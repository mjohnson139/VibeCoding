import React, { useState, useEffect, createContext, useContext } from 'react';
import WebSocketUtils, { ConnectionState } from '../utils/websocketUtils';

// Port for WebSocket connections
const CONNECTION_PORT = 3000;

// Interface for connection data that will be encoded in QR codes
export interface ConnectionData {
  ip: string;
  port: number;
  userId?: string;
  username?: string;
  gameId?: string;
}

// Interface for the ConnectionContext
interface ConnectionContextProps {
  // Connection state
  connectionState: ConnectionState;
  
  // Start a WebSocket server (host mode)
  startServer: () => Promise<ConnectionData>;
  
  // Connect to a WebSocket server (client mode)
  connectToServer: (connectionData: ConnectionData) => Promise<void>;
  
  // Disconnect from current connection
  disconnect: () => void;
  
  // Send a message to connected peer
  sendMessage: (event: string, message: any) => void;
  
  // Register a handler for a specific event
  onMessage: (event: string, handler: (message: any) => void) => void;
  
  // Encoded connection data for QR code
  connectionData: ConnectionData | null;
  
  // Is this device acting as a server?
  isServer: boolean;
}

// Create the connection context
const ConnectionContext = createContext<ConnectionContextProps>({
  connectionState: ConnectionState.DISCONNECTED,
  startServer: async () => ({ ip: '', port: 0 }),
  connectToServer: async () => {},
  disconnect: () => {},
  sendMessage: () => {},
  onMessage: () => {},
  connectionData: null,
  isServer: false
});

// Hook to use the connection context
export const useConnection = () => useContext(ConnectionContext);

// Provider component for connection management
export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // WebSocket server and client instances
  const [server, setServer] = useState<WebSocketUtils.Server | null>(null);
  const [client, setClient] = useState<WebSocketUtils.Client | null>(null);
  
  // Connection state and data
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [connectionData, setConnectionData] = useState<ConnectionData | null>(null);
  const [isServer, setIsServer] = useState<boolean>(false);
  
  // Event handlers map
  const [eventHandlers] = useState<Map<string, (message: any) => void>>(new Map());

  /**
   * Start a WebSocket server (host mode)
   */
  const startServer = async (): Promise<ConnectionData> => {
    try {
      // Clean up any existing connections
      disconnect();
      
      // Create a new server instance
      const newServer = new WebSocketUtils.Server(CONNECTION_PORT);
      setServer(newServer);
      setIsServer(true);
      
      // Set up server event handlers
      newServer.onConnection((clientId) => {
        console.log(`Client connected: ${clientId}`);
        setConnectionState(ConnectionState.CONNECTED);
      });
      
      newServer.onDisconnection(() => {
        console.log('Client disconnected');
        setConnectionState(ConnectionState.DISCONNECTED);
      });
      
      newServer.onMessage((clientId, message) => {
        console.log(`Message from client ${clientId}:`, message);
        // Find and call the appropriate event handler
        if (message.event && eventHandlers.has(message.event)) {
          const handler = eventHandlers.get(message.event);
          if (handler) {
            handler(message.data);
          }
        }
      });
      
      // Start the server and get the IP address
      const ip = await newServer.start();
      
      // Create connection data for QR code
      const data: ConnectionData = {
        ip,
        port: CONNECTION_PORT,
        userId: 'host',
        username: 'Host Player'
      };
      
      setConnectionData(data);
      setConnectionState(ConnectionState.CONNECTING); // Waiting for client to connect
      
      return data;
    } catch (error) {
      console.error('Failed to start server:', error);
      setConnectionState(ConnectionState.ERROR);
      throw error;
    }
  };

  /**
   * Connect to a WebSocket server (client mode)
   */
  const connectToServer = async (data: ConnectionData): Promise<void> => {
    try {
      // Clean up any existing connections
      disconnect();
      
      // Create a new client instance
      const newClient = new WebSocketUtils.Client();
      setClient(newClient);
      setIsServer(false);
      
      // Set up client event handlers
      newClient.onConnect(() => {
        console.log('Connected to server');
        setConnectionState(ConnectionState.CONNECTED);
      });
      
      newClient.onDisconnect(() => {
        console.log('Disconnected from server');
        setConnectionState(ConnectionState.DISCONNECTED);
      });
      
      newClient.onError((error) => {
        console.error('Connection error:', error);
        setConnectionState(ConnectionState.ERROR);
      });
      
      // Connect to the server
      setConnectionState(ConnectionState.CONNECTING);
      await newClient.connect(data.ip, data.port);
      
      // Register event handlers
      eventHandlers.forEach((handler, event) => {
        newClient.on(event, handler);
      });
      
      setConnectionData(data);
    } catch (error) {
      console.error('Failed to connect to server:', error);
      setConnectionState(ConnectionState.ERROR);
      throw error;
    }
  };

  /**
   * Disconnect from current connection
   */
  const disconnect = (): void => {
    // Stop server if running
    if (server) {
      server.stop();
      setServer(null);
    }
    
    // Disconnect client if connected
    if (client) {
      client.disconnect();
      setClient(null);
    }
    
    setConnectionState(ConnectionState.DISCONNECTED);
    setIsServer(false);
  };

  /**
   * Send a message to connected peer
   */
  const sendMessage = (event: string, message: any): void => {
    if (isServer && server) {
      // If we're the server, broadcast to all clients
      server.broadcast('message', { event, data: message });
    } else if (client) {
      // If we're a client, send to the server
      client.send('message', { event, data: message });
    } else {
      console.warn('Cannot send message: not connected');
    }
  };

  /**
   * Register a handler for a specific event
   */
  const onMessage = (event: string, handler: (message: any) => void): void => {
    eventHandlers.set(event, handler);
    
    // Also register with active client if exists
    if (client) {
      client.on(event, handler);
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  // Context value
  const contextValue: ConnectionContextProps = {
    connectionState,
    startServer,
    connectToServer,
    disconnect,
    sendMessage,
    onMessage,
    connectionData,
    isServer
  };

  return (
    <ConnectionContext.Provider value={contextValue}>
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionProvider;