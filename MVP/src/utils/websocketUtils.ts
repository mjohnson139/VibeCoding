/**
 * WebSocket utility for handling peer-to-peer connections in the Spitball app
 * Provides both server and client functionality
 */
import { io, Socket } from 'socket.io-client';
import { Server } from 'socket.io';
import { NetworkInfo } from 'react-native-network-info';

// Default port for WebSocket connections
const DEFAULT_PORT = 3000;

/**
 * Connection states for the WebSocket
 */
export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error'
}

/**
 * WebSocket server class
 */
export class WebSocketServer {
  private server: Server | null = null;
  private port: number;
  private clients: Set<string> = new Set();
  private onConnectionCallback: ((clientId: string) => void) | null = null;
  private onDisconnectionCallback: ((clientId: string) => void) | null = null;
  private onMessageCallback: ((clientId: string, message: any) => void) | null = null;

  constructor(port: number = DEFAULT_PORT) {
    this.port = port;
  }

  /**
   * Start the WebSocket server
   * @returns Promise resolving to the server's IP address
   */
  public async start(): Promise<string> {
    try {
      this.server = new Server(this.port, {
        cors: {
          origin: '*',
        }
      });

      this.setupEventListeners();
      
      // Get the server's IP address
      const ipAddress = await NetworkInfo.getIPAddress();
      console.log(`WebSocket server started on ${ipAddress}:${this.port}`);
      
      return ipAddress;
    } catch (error) {
      console.error('Failed to start WebSocket server:', error);
      throw error;
    }
  }

  /**
   * Stop the WebSocket server
   */
  public stop(): void {
    if (this.server) {
      this.server.close();
      this.server = null;
      this.clients.clear();
      console.log('WebSocket server stopped');
    }
  }

  /**
   * Set callback for new client connections
   */
  public onConnection(callback: (clientId: string) => void): void {
    this.onConnectionCallback = callback;
  }

  /**
   * Set callback for client disconnections
   */
  public onDisconnection(callback: (clientId: string) => void): void {
    this.onDisconnectionCallback = callback;
  }

  /**
   * Set callback for incoming messages
   */
  public onMessage(callback: (clientId: string, message: any) => void): void {
    this.onMessageCallback = callback;
  }

  /**
   * Send a message to a specific client
   */
  public sendToClient(clientId: string, event: string, message: any): void {
    if (this.server && this.clients.has(clientId)) {
      this.server.to(clientId).emit(event, message);
    }
  }

  /**
   * Broadcast a message to all connected clients
   */
  public broadcast(event: string, message: any): void {
    if (this.server) {
      this.server.emit(event, message);
    }
  }

  /**
   * Set up the WebSocket server event listeners
   */
  private setupEventListeners(): void {
    if (!this.server) return;

    this.server.on('connection', (socket) => {
      const clientId = socket.id;
      this.clients.add(clientId);
      console.log(`Client connected: ${clientId}`);
      
      if (this.onConnectionCallback) {
        this.onConnectionCallback(clientId);
      }

      // Handle incoming messages
      socket.on('message', (message) => {
        console.log(`Message from ${clientId}:`, message);
        if (this.onMessageCallback) {
          this.onMessageCallback(clientId, message);
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.clients.delete(clientId);
        console.log(`Client disconnected: ${clientId}`);
        if (this.onDisconnectionCallback) {
          this.onDisconnectionCallback(clientId);
        }
      });
    });
  }
}

/**
 * WebSocket client class
 */
export class WebSocketClient {
  private socket: Socket | null = null;
  private serverUrl: string | null = null;
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private onConnectCallback: (() => void) | null = null;
  private onDisconnectCallback: (() => void) | null = null;
  private onErrorCallback: ((error: Error) => void) | null = null;
  private messageHandlers: Map<string, (message: any) => void> = new Map();

  /**
   * Connect to a WebSocket server
   * @param serverIp The IP address of the server
   * @param port The port of the server
   * @returns Promise resolving when connected
   */
  public async connect(serverIp: string, port: number = DEFAULT_PORT): Promise<void> {
    try {
      this.serverUrl = `http://${serverIp}:${port}`;
      this.connectionState = ConnectionState.CONNECTING;
      
      this.socket = io(this.serverUrl, {
        reconnection: true,
        reconnectionAttempts: 5,
        timeout: 10000
      });

      return new Promise((resolve, reject) => {
        if (!this.socket) {
          reject(new Error('Socket not initialized'));
          return;
        }

        this.socket.on('connect', () => {
          this.connectionState = ConnectionState.CONNECTED;
          console.log(`Connected to server: ${this.serverUrl}`);
          if (this.onConnectCallback) {
            this.onConnectCallback();
          }
          resolve();
        });

        this.socket.on('disconnect', () => {
          this.connectionState = ConnectionState.DISCONNECTED;
          console.log('Disconnected from server');
          if (this.onDisconnectCallback) {
            this.onDisconnectCallback();
          }
        });

        this.socket.on('connect_error', (error) => {
          this.connectionState = ConnectionState.ERROR;
          console.error('Connection error:', error);
          if (this.onErrorCallback) {
            this.onErrorCallback(error);
          }
          reject(error);
        });

        // Set up handlers for custom events
        this.messageHandlers.forEach((handler, event) => {
          this.socket?.on(event, handler);
        });
      });
    } catch (error) {
      this.connectionState = ConnectionState.ERROR;
      console.error('Failed to connect to WebSocket server:', error);
      throw error;
    }
  }

  /**
   * Disconnect from the WebSocket server
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.serverUrl = null;
      this.connectionState = ConnectionState.DISCONNECTED;
    }
  }

  /**
   * Send a message to the server
   */
  public send(event: string, message: any): void {
    if (this.socket && this.connectionState === ConnectionState.CONNECTED) {
      this.socket.emit(event, message);
    } else {
      console.warn('Cannot send message: not connected to server');
    }
  }

  /**
   * Register a handler for a specific event
   */
  public on(event: string, handler: (message: any) => void): void {
    this.messageHandlers.set(event, handler);
    
    // If already connected, add the handler to the socket too
    if (this.socket) {
      this.socket.on(event, handler);
    }
  }

  /**
   * Remove a handler for a specific event
   */
  public off(event: string): void {
    this.messageHandlers.delete(event);
    
    if (this.socket) {
      this.socket.off(event);
    }
  }

  /**
   * Set callback for successful connection
   */
  public onConnect(callback: () => void): void {
    this.onConnectCallback = callback;
  }

  /**
   * Set callback for disconnection
   */
  public onDisconnect(callback: () => void): void {
    this.onDisconnectCallback = callback;
  }

  /**
   * Set callback for connection errors
   */
  public onError(callback: (error: Error) => void): void {
    this.onErrorCallback = callback;
  }

  /**
   * Get the current connection state
   */
  public getConnectionState(): ConnectionState {
    return this.connectionState;
  }
}

/**
 * Check if the device can act as a WebSocket server
 * (Some implementations or platforms might have limitations)
 */
export const canActAsServer = async (): Promise<boolean> => {
  try {
    // This is a basic check, may need to be enhanced for specific platforms
    return true;
  } catch (error) {
    console.error('Error checking server capability:', error);
    return false;
  }
};

/**
 * Utility for working with WebSocket connections
 */
export const WebSocketUtils = {
  Server: WebSocketServer,
  Client: WebSocketClient,
  canActAsServer,
  ConnectionState
};

export default WebSocketUtils;