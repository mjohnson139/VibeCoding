// Networking utilities for peer-to-peer connection using expo-nearby-connections
import * as NearbyConnections from 'expo-nearby-connections';
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

export interface ConnectionInfo {
  deviceId: string;
  ipAddress?: string; // No longer needed but kept for compatibility
  port?: number; // No longer needed but kept for compatibility
  username?: string;
}

// Simple event emitter implementation for React Native
class SimpleEventEmitter {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function): void {
    if (!this.listeners.has(event)) return;
    const eventListeners = this.listeners.get(event);
    if (!eventListeners) return;
    
    const index = eventListeners.indexOf(callback);
    if (index !== -1) {
      eventListeners.splice(index, 1);
    }
  }

  emit(event: string, ...args: any[]): void {
    if (!this.listeners.has(event)) return;
    const eventListeners = this.listeners.get(event);
    if (!eventListeners) return;
    
    for (const callback of eventListeners) {
      callback(...args);
    }
  }
}

export class PeerConnection {
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private onStateChangeCallback: ((state: ConnectionState) => void) | null = null;
  private onMessageCallback: ((data: any) => void) | null = null;
  private cachedDeviceId: string | null = null;
  private readonly DEVICE_ID_STORAGE_KEY = 'SPITBALL_DEVICE_ID';
  private isHost: boolean = false;
  private connections: Map<string, string> = new Map(); // Map of endpoint ID to device ID
  private eventEmitter: SimpleEventEmitter = new SimpleEventEmitter();
  private serviceId: string = 'com.spitball.app';
  private isInitialized: boolean = false;
  private isAdvertising: boolean = false;
  private isDiscovering: boolean = false;
  
  constructor() {
    // Try to load the device ID from storage when the class is instantiated
    this.loadDeviceId();
    this.initialize();
  }
  
  // Initialize the NearbyConnections module
  private async initialize(): Promise<void> {
    try {
      // First check if Nearby Connections is available
      if (!(await NearbyConnections.isAvailableAsync())) {
        console.error('Nearby Connections is not available on this device');
        this.setConnectionState(ConnectionState.ERROR);
        return;
      }
      
      await NearbyConnections.initialize();
      this.isInitialized = true;
      console.log('Nearby Connections initialized successfully');
      
      // Set up event listeners
      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to initialize Nearby Connections:', error);
      this.setConnectionState(ConnectionState.ERROR);
    }
  }
  
  // Set up event listeners for NearbyConnections events
  private setupEventListeners(): void {
    // Handle endpoint discovery
    NearbyConnections.onEndpointDiscovered(({ endpointId, serviceId, endpointName }) => {
      console.log(`Discovered endpoint: ${endpointName} (${endpointId})`);
      
      // Request a connection to the discovered endpoint
      this.requestConnection(endpointId, endpointName);
    });
    
    // Handle connection requests
    NearbyConnections.onConnectionInitiated(({ endpointId, endpointName, authenticationToken }) => {
      console.log(`Connection initiated from: ${endpointName} (${endpointId})`);
      console.log(`Authentication token: ${authenticationToken}`);
      
      // Automatically accept all connection requests
      NearbyConnections.acceptConnection(endpointId);
    });
    
    // Handle successful connections
    NearbyConnections.onConnectionResult(({ endpointId, status }) => {
      if (status === NearbyConnections.ConnectionStatus.CONNECTED) {
        console.log(`Connected to endpoint: ${endpointId}`);
        this.connections.set(endpointId, endpointId);
        this.setConnectionState(ConnectionState.CONNECTED);
        
        // Send our device ID to the other endpoint
        if (this.cachedDeviceId) {
          const message = JSON.stringify({
            type: 'identity',
            deviceId: this.cachedDeviceId
          });
          NearbyConnections.sendPayload(endpointId, message);
        }
      } else {
        console.log(`Failed to connect to endpoint: ${endpointId}`);
        this.setConnectionState(ConnectionState.ERROR);
      }
    });
    
    // Handle disconnections
    NearbyConnections.onDisconnected(({ endpointId }) => {
      console.log(`Disconnected from endpoint: ${endpointId}`);
      this.connections.delete(endpointId);
      
      // If no connections left, set state to disconnected
      if (this.connections.size === 0) {
        this.setConnectionState(ConnectionState.DISCONNECTED);
      }
    });
    
    // Handle incoming data/payloads
    NearbyConnections.onPayloadReceived(({ endpointId, payloadType, payload }) => {
      if (payloadType === NearbyConnections.PayloadType.BYTES) {
        try {
          const message = JSON.parse(payload);
          console.log('Received message:', message);
          
          // Handle identity messages specifically
          if (message.type === 'identity') {
            this.connections.set(endpointId, message.deviceId);
          }
          
          // Forward the message to the callback
          if (this.onMessageCallback) {
            this.onMessageCallback(message);
          }
        } catch (error) {
          console.error('Error parsing received payload:', error);
        }
      }
    });
  }
  
  // Request a connection to a discovered endpoint
  private async requestConnection(endpointId: string, endpointName: string): Promise<void> {
    try {
      await NearbyConnections.requestConnection(
        this.cachedDeviceId || 'Unknown',
        endpointId
      );
      console.log(`Connection requested to ${endpointName} (${endpointId})`);
    } catch (error) {
      console.error('Error requesting connection:', error);
    }
  }
  
  // Load device ID from AsyncStorage
  private async loadDeviceId(): Promise<void> {
    try {
      const storedId = await AsyncStorage.getItem(this.DEVICE_ID_STORAGE_KEY);
      if (storedId) {
        this.cachedDeviceId = storedId;
        console.log('Loaded device ID from storage:', storedId);
      } else {
        // Generate a new device ID if none exists
        this.cachedDeviceId = this.generateDeviceId();
        this.saveDeviceId(this.cachedDeviceId);
      }
    } catch (error) {
      console.error('Failed to load device ID:', error);
      // Generate a new device ID as fallback
      this.cachedDeviceId = this.generateDeviceId();
      this.saveDeviceId(this.cachedDeviceId);
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
  
  // Generate a random device ID
  private generateDeviceId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
  
  // Start advertising our device to be discovered by others
  async startAdvertising(): Promise<ConnectionInfo> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (this.isAdvertising) {
      console.log('Already advertising');
      return this.getConnectionInfo();
    }
    
    try {
      console.log('Starting to advertise with name:', this.cachedDeviceId);
      
      await NearbyConnections.startAdvertising({
        serviceId: this.serviceId,
        strategy: NearbyConnections.Strategy.P2P_CLUSTER,
        name: this.cachedDeviceId || 'Unknown',
      });
      
      this.isAdvertising = true;
      this.isHost = true;
      
      console.log('Started advertising successfully');
      return this.getConnectionInfo();
    } catch (error) {
      console.error('Failed to start advertising:', error);
      this.setConnectionState(ConnectionState.ERROR);
      throw error;
    }
  }
  
  // Start discovering nearby devices
  async startDiscovery(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (this.isDiscovering) {
      console.log('Already discovering');
      return;
    }
    
    try {
      await NearbyConnections.startDiscovering({
        serviceId: this.serviceId,
        strategy: NearbyConnections.Strategy.P2P_CLUSTER,
      });
      
      this.isDiscovering = true;
      this.setConnectionState(ConnectionState.CONNECTING);
      
      console.log('Started discovering successfully');
    } catch (error) {
      console.error('Failed to start discovering:', error);
      this.setConnectionState(ConnectionState.ERROR);
      throw error;
    }
  }
  
  // Stop advertising
  async stopAdvertising(): Promise<void> {
    if (this.isAdvertising) {
      try {
        await NearbyConnections.stopAdvertising();
        this.isAdvertising = false;
        console.log('Stopped advertising');
      } catch (error) {
        console.error('Error stopping advertising:', error);
      }
    }
  }
  
  // Stop discovering
  async stopDiscovery(): Promise<void> {
    if (this.isDiscovering) {
      try {
        await NearbyConnections.stopDiscovering();
        this.isDiscovering = false;
        console.log('Stopped discovering');
      } catch (error) {
        console.error('Error stopping discovery:', error);
      }
    }
  }
  
  // Get connection info (for compatibility with previous implementation)
  async getConnectionInfo(): Promise<ConnectionInfo> {
    return {
      deviceId: this.cachedDeviceId || 'Unknown',
      username: 'Player1', // Could be customized by user
    };
  }
  
  // Connect to a peer
  // Note: With Nearby Connections, both parties need to be advertising/discovering
  // So this method starts discovery to find the peer with the given deviceId
  connect(connectionInfo: ConnectionInfo): void {
    try {
      this.setConnectionState(ConnectionState.CONNECTING);
      
      // Start discovering nearby devices
      this.startDiscovery();
      
      console.log(`Looking for device with ID: ${connectionInfo.deviceId}`);
    } catch (error) {
      console.error('Connection error:', error);
      this.setConnectionState(ConnectionState.ERROR);
    }
  }
  
  // Send message to all connected peers
  sendMessage(type: string, data: any): void {
    if (this.connectionState === ConnectionState.CONNECTED && this.connections.size > 0) {
      const message = JSON.stringify({
        type,
        data,
        deviceId: this.cachedDeviceId,
        timestamp: Date.now()
      });
      
      // Send to all connected endpoints
      for (const endpointId of this.connections.keys()) {
        try {
          NearbyConnections.sendPayload(endpointId, message);
          console.log('Message sent to endpoint:', endpointId, { type, data });
        } catch (error) {
          console.error('Error sending message to endpoint:', endpointId, error);
        }
      }
    } else {
      console.warn(`Cannot send message: Not connected (state: ${this.connectionState}, connections: ${this.connections.size})`);
    }
  }
  
  // Disconnect from all peers
  disconnect(): void {
    if (this.connectionState !== ConnectionState.DISCONNECTED) {
      console.log('Disconnecting...');
      
      // Set state to disconnected first
      this.setConnectionState(ConnectionState.DISCONNECTED);
      
      // Disconnect from all endpoints
      for (const endpointId of this.connections.keys()) {
        try {
          NearbyConnections.disconnectFromEndpoint(endpointId);
        } catch (error) {
          console.error('Error disconnecting from endpoint:', endpointId, error);
        }
      }
      
      // Clear all connections
      this.connections.clear();
      
      // Stop advertising and discovery
      this.stopAdvertising();
      this.stopDiscovery();
      
      this.isHost = false;
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
  
  // For backward compatibility with the WebSocketServer approach
  // This starts advertising which allows others to discover this device
  async startServer(): Promise<ConnectionInfo> {
    return this.startAdvertising();
  }
  
  // For backward compatibility with the WebSocketServer approach
  stopServer(): void {
    this.stopAdvertising();
  }
}