import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PeerConnection, ConnectionState, ConnectionInfo } from '../utils/websocketUtils';

// Interface for the connection context
interface ConnectionContextProps {
  connectionState: ConnectionState;
  connectionInfo: ConnectionInfo | null;
  connect: (connectionInfo: ConnectionInfo) => void;
  disconnect: () => void;
  sendMessage: (type: string, data: any) => void;
  getConnectionInfo: () => Promise<ConnectionInfo>;
  isHost: boolean;
}

// Default context values
const ConnectionContext = createContext<ConnectionContextProps>({
  connectionState: ConnectionState.DISCONNECTED,
  connectionInfo: null,
  connect: () => {},
  disconnect: () => {},
  sendMessage: () => {},
  getConnectionInfo: async () => ({ deviceId: '', ipAddress: '', port: 0 }),
  isHost: false,
});

// Hook to use the connection context
export const useConnection = () => useContext(ConnectionContext);

// Provider component for connection management
export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connection] = useState<PeerConnection>(new PeerConnection());
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    // Listen for connection state changes
    connection.onStateChange((state) => {
      console.log('Connection state changed:', state);
      setConnectionState(state);
    });
    
    // Clean up on unmount
    return () => {
      connection.disconnect();
    };
  }, [connection]);

  // Get connection info for QR code - memoized with useCallback to prevent recreating on every render
  const getConnectionInfo = useCallback(async (): Promise<ConnectionInfo> => {
    try {
      // Only get new connection info if we don't already have it
      if (!connectionInfo) {
        const info = await connection.getConnectionInfo();
        setConnectionInfo(info);
        setIsHost(true);
        return info;
      }
      return connectionInfo;
    } catch (error) {
      console.error('Failed to get connection info:', error);
      throw error;
    }
  }, [connection, connectionInfo]);

  // Connect to another peer
  const connect = useCallback((info: ConnectionInfo): void => {
    setIsHost(false);
    connection.connect(info);
  }, [connection]);

  // Disconnect from current connection
  const disconnect = useCallback((): void => {
    connection.disconnect();
    setIsHost(false);
  }, [connection]);

  // Send a message to connected peer
  const sendMessage = useCallback((type: string, data: any): void => {
    connection.sendMessage(type, data);
  }, [connection]);

  const contextValue: ConnectionContextProps = {
    connectionState,
    connectionInfo,
    connect,
    disconnect,
    sendMessage,
    getConnectionInfo,
    isHost,
  };

  return (
    <ConnectionContext.Provider value={contextValue}>
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionProvider;