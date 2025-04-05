import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useConnection, ConnectionData } from './ConnectionProvider';

const QRCodeGenerator = () => {
  const { connectionData, startServer, connectionState } = useConnection();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start the WebSocket server when the component mounts
  useEffect(() => {
    const initServer = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Start the WebSocket server
        await startServer();
      } catch (err) {
        console.error('Failed to start server:', err);
        setError('Failed to start server: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    if (!connectionData) {
      initServer();
    }
  }, [startServer, connectionData]);

  // Generate QR code value from connection data
  const getQRCodeValue = (): string => {
    if (!connectionData) return '';
    
    // Encode connection data as JSON
    const jsonData = JSON.stringify(connectionData);
    return jsonData;
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loading}>Starting server...</Text>
        </View>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : connectionData ? (
        <>
          <Text style={styles.label}>Scan this QR code to connect:</Text>
          <QRCode value={getQRCodeValue()} size={200} />
          <Text style={styles.info}>IP: {connectionData.ip}</Text>
          <Text style={styles.info}>Port: {connectionData.port}</Text>
          <Text style={styles.status}>
            Status: {connectionState === 'connected' ? 'Connected!' : 'Waiting for connection...'}
          </Text>
        </>
      ) : (
        <Text style={styles.loading}>Preparing connection...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 14,
    marginTop: 5,
  },
  loading: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 10,
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    margin: 10,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#007BFF',
  },
});

export default QRCodeGenerator;