// Networking utilities for peer-to-peer connection
import * as Network from 'expo-network';
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

export interface ConnectionInfo {
  deviceId: string;
  ipAddress: string;
  port: number;
  username?: string;
}

// Implementation for React Native using WebSockets
export class PeerConnection {
  private socket: WebSocket | null = null;
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private onStateChangeCallback: ((state: ConnectionState) => void) | null = null;
  private onMessageCallback: ((data: any) => void) | null = null;
  private isReconnecting: boolean = false;
  private cachedDeviceId: string | null = null;
  private readonly DEVICE_ID_STORAGE_KEY = 'SPITBALL_DEVICE_ID';
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: any = null;
  
  constructor() {
    // Try to load the device ID from storage when the class is instantiated
    this.loadDeviceId();
  }
  
  // Load device ID from AsyncStorage
  private async loadDeviceId(): Promise<void> {
    try {
      const storedId = await AsyncStorage.getItem(this.DEVICE_ID_STORAGE_KEY);
      if (storedId) {
        this.cachedDeviceId = storedId;
        console.log('Loaded device ID from storage:', storedId);
      }
    } catch (error) {
      console.error('Failed to load device ID:', error);
    }
  }
  
  // Save device ID to AsyncStorage
  private async saveDeviceId(deviceId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.DEVICE_ID_STORAGE_KEY, deviceId);
      console.log('Saved device ID to storage:', deviceId);
    } catch (error) {
      console.error('Failed to save device ID:', error);
    }
  }
  
  // Get local connection info for QR code
  async getConnectionInfo(): Promise<ConnectionInfo> {
    const ipAddress = await Network.getIpAddressAsync();
    let deviceId = this.cachedDeviceId;
    
    // If we don't have a cached ID, generate a new one and save it
    if (!deviceId) {
      deviceId = this.generateDeviceId();
      this.cachedDeviceId = deviceId;
      this.saveDeviceId(deviceId);
    }
    
    return {
      deviceId,
      ipAddress,
      port: 8080, // Default port
      username: 'Player1', // Could be customized by user
    };
  }
  
  private generateDeviceId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
  
  // Connect to a peer using WebSocket
  connect(connectionInfo: ConnectionInfo): void {
    try {
      // Clean up any existing connection
      this.disconnect();
      
      this.setConnectionState(ConnectionState.CONNECTING);
      
      // Create WebSocket connection
      const wsProtocol = 'ws'; // Use 'wss' for secure connections
      const wsUrl = `${wsProtocol}://${connectionInfo.ipAddress}:${connectionInfo.port}`;
      
      console.log(`Connecting to WebSocket at ${wsUrl}`);
      this.socket = new WebSocket(wsUrl);
      
      // Set up event handlers
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
      
    } catch (error) {
      console.error('Connection error:', error);
      this.setConnectionState(ConnectionState.ERROR);
    }
  }
  
  // WebSocket event handlers
  private handleOpen(): void {
    console.log('WebSocket connection established');
    this.setConnectionState(ConnectionState.CONNECTED);
    this.reconnectAttempts = 0;
    
    // Send initial message with our device ID
    if (this.socket && this.cachedDeviceId) {
      this.socket.send(JSON.stringify({
        type: 'identity',
        deviceId: this.cachedDeviceId
      }));
    }
  }
  
  private handleMessage(event: WebSocketMessageEvent): void {
    try {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      
      if (this.onMessageCallback) {
        this.onMessageCallback(message);
      }
    } catch (error) {
      console.error('Error parsing message:', error, event.data);
    }
  }
  
  private handleClose(event: WebSocketCloseEvent): void {
    console.log(`WebSocket closed: ${event.code} ${event.reason}`);
    
    // Don't try to reconnect if we intentionally closed
    if (this.connectionState === ConnectionState.DISCONNECTED) {
      return;
    }
    
    // Try to reconnect if it wasn't a normal closure
    if (event.code !== 1000) {
      this.tryReconnect();
    } else {
      this.setConnectionState(ConnectionState.DISCONNECTED);
    }
  }
  
  private handleError(error: Event): void {
    console.error('WebSocket error:', error);
    this.setConnectionState(ConnectionState.ERROR);
    
    // Try to reconnect on error
    this.tryReconnect();
  }
  
  // Try to reconnect with exponential backoff
  private tryReconnect(): void {
    if (this.isReconnecting || this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Maximum reconnection attempts reached or already reconnecting');
      this.setConnectionState(ConnectionState.ERROR);
      return;
    }
    
    this.isReconnecting = true;
    this.reconnectAttempts++;
    
    const delay = Math.min(30000, Math.pow(2, this.reconnectAttempts) * 1000);
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    // Clear any existing timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    // Set new timeout
    this.reconnectTimeout = setTimeout(() => {
      // If we have connection info, try to reconnect
      if (this.socket) {
        console.log('Attempting to reconnect...');
        // We need to recreate the WebSocket connection
        this.socket = new WebSocket(this.socket.url);
        this.socket.onopen = this.handleOpen.bind(this);
        this.socket.onmessage = this.handleMessage.bind(this);
        this.socket.onclose = this.handleClose.bind(this);
        this.socket.onerror = this.handleError.bind(this);
        
        this.isReconnecting = false;
      } else {
        this.isReconnecting = false;
        this.setConnectionState(ConnectionState.ERROR);
      }
    }, delay);
  }
  
  // Send message to connected peer
  sendMessage(type: string, data: any): void {
    if (this.connectionState === ConnectionState.CONNECTED && this.socket) {
      const message = JSON.stringify({
        type,
        data,
        deviceId: this.cachedDeviceId,
        timestamp: Date.now()
      });
      
      this.socket.send(message);
      console.log('Message sent:', { type, data });
    } else {
      console.warn(`Cannot send message: Not connected (state: ${this.connectionState})`);
    }
  }
  
  // Disconnect from peer
  disconnect(): void {
    if (this.connectionState !== ConnectionState.DISCONNECTED) {
      console.log('Disconnecting...');
      
      // Set state to disconnected first to prevent reconnection attempts
      this.setConnectionState(ConnectionState.DISCONNECTED);
      
      // Clear any reconnection timeout
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
      
      // Close the WebSocket if it exists
      if (this.socket) {
        try {
          // Only close if the socket is not already closing or closed
          if (this.socket.readyState === WebSocket.OPEN ||
              this.socket.readyState === WebSocket.CONNECTING) {
            this.socket.close(1000, 'Disconnected by user');
          }
        } catch (error) {
          console.error('Error closing WebSocket:', error);
        } finally {
          this.socket = null;
        }
      }
      
      // Reset reconnection state
      this.isReconnecting = false;
      this.reconnectAttempts = 0;
    }
  }
  
  // Set connection state and trigger callback
  private setConnectionState(state: ConnectionState): void {
    if (this.connectionState !== state) {
      this.connectionState = state;
      if (this.onStateChangeCallback) {
        this.onStateChangeCallback(state);
      }
    }
  }
  
  // Register state change callback
  onStateChange(callback: (state: ConnectionState) => void): void {
    this.onStateChangeCallback = callback;
  }
  
  // Register message callback
  onMessage(callback: (data: any) => void): void {
    this.onMessageCallback = callback;
  }
  
  // Get current connection state
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }
}