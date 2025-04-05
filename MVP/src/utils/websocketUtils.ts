// Networking utilities for peer-to-peer connection
import * as Network from 'expo-network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Simple WebSocket server for React Native
class WebSocketServer {
  private connections: WebSocket[] = [];
  private isListening: boolean = false;
  private server: any = null;
  private port: number;
  private onConnectionCallback: ((socket: WebSocket) => void) | null = null;
  private onMessageCallback: ((data: any, socket: WebSocket) => void) | null = null;
  
  constructor(port: number = 8080) {
    this.port = port;
  }
  
  public async start(): Promise<boolean> {
    if (this.isListening) {
      console.log('WebSocket server is already listening');
      return true;
    }
    
    try {
      // Use a different implementation based on platform
      if (Platform.OS === 'web') {
        // For web, we can use native WebSocket server
        await this.startWebServer();
      } else {
        // For mobile, we'll use a WebSocket server library
        // This is a stub - in a real implementation you'd use a native module or polyfill
        console.log('WebSocket server starting on mobile platform...');
        this.isListening = true;
        
        // Mock successful server start for testing
        setTimeout(() => {
          console.log('WebSocket server started on port', this.port);
          this.mockIncomingConnections();
        }, 1000);
        
        return true;
      }
      
      return this.isListening;
    } catch (error) {
      console.error('Failed to start WebSocket server:', error);
      return false;
    }
  }
  
  private async startWebServer(): Promise<void> {
    // This is a stub for web implementation
    console.log('Starting WebSocket server on web...');
    this.isListening = true;
  }
  
  public stop(): void {
    if (!this.isListening) {
      return;
    }
    
    if (this.server) {
      try {
        // Close the server
        this.server.close();
      } catch (error) {
        console.error('Error closing WebSocket server:', error);
      } finally {
        this.server = null;
      }
    }
    
    // Close all connections
    this.connections.forEach(socket => {
      try {
        socket.close();
      } catch (error) {
        console.error('Error closing WebSocket connection:', error);
      }
    });
    
    this.connections = [];
    this.isListening = false;
    console.log('WebSocket server stopped');
  }
  
  public onConnection(callback: (socket: WebSocket) => void): void {
    this.onConnectionCallback = callback;
  }
  
  public onMessage(callback: (data: any, socket: WebSocket) => void): void {
    this.onMessageCallback = callback;
  }
  
  public broadcast(message: string): void {
    this.connections.forEach(socket => {
      try {
        socket.send(message);
      } catch (error) {
        console.error('Error broadcasting message:', error);
      }
    });
  }
  
  public isRunning(): boolean {
    return this.isListening;
  }
  
  // Mock function for testing - simulates incoming connections
  private mockIncomingConnections(): void {
    console.log('WebSocket server is ready to accept connections on port', this.port);
    console.log('When a QR code is scanned, the device will attempt to connect to this server');
    
    // This is where we would normally set up listeners for incoming connections
    // For now, we're just mocking the server behavior for testing
  }
}

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
  private server: WebSocketServer | null = null;
  private isHost: boolean = false;
  
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
    
    // Start a WebSocket server to listen for incoming connections
    await this.startServer();
    
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
  
  // Start WebSocket server
  private async startServer(): Promise<void> {
    // If server is already running, don't start another one
    if (this.server && this.server.isRunning()) {
      console.log('WebSocket server is already running');
      return;
    }
    
    // Create and start the WebSocket server
    this.server = new WebSocketServer();
    const success = await this.server.start();
    
    if (success) {
      console.log('WebSocket server started successfully');
      this.isHost = true;
      
      // Set up event handlers for the server
      this.server.onConnection((socket) => {
        console.log('New client connected to server');
        
        // When a client connects, update the connection state
        this.setConnectionState(ConnectionState.CONNECTED);
      });
      
      this.server.onMessage((data, socket) => {
        console.log('Received message from client:', data);
        
        // Forward incoming messages to the message callback
        if (this.onMessageCallback) {
          this.onMessageCallback(data);
        }
      });
    } else {
      console.error('Failed to start WebSocket server');
    }
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
      
      // Add network debugging
      Network.getNetworkStateAsync().then(state => {
        console.log('Current network state:', JSON.stringify(state));
      });
      
      this.socket = new WebSocket(wsUrl);
      
      // Set up event handlers
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = (error) => {
        console.error('WebSocket detailed error:', JSON.stringify(error));
        this.handleError(error);
      };
      
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
    
    // Don't try to reconnect on error - just set the state to ERROR and stop
    this.isReconnecting = false;
    this.reconnectAttempts = this.maxReconnectAttempts; // Set to max to prevent future attempts
  }
  
  // Try to reconnect with exponential backoff
  private tryReconnect(): void {
    // Don't attempt to reconnect if we've already had an error
    if (this.connectionState === ConnectionState.ERROR) {
      console.log('Connection in ERROR state, not attempting to reconnect');
      return;
    }
    
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
      
      // Stop the WebSocket server if running
      if (this.server) {
        this.server.stop();
        this.server = null;
        this.isHost = false;
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