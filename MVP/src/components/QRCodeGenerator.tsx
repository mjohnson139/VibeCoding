import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useConnection } from './ConnectionProvider';
import { ConnectionState } from '../utils/websocketUtils';

const QRCodeGenerator = () => {
  const { getConnectionInfo, connectionInfo, connectionState } = useConnection();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  // Initialize connection info when component mounts - run only once
  useEffect(() => {
    const initConnection = async () => {
      // Don't run if we've already initialized or already have connection info
      if (hasInitialized.current || connectionInfo) {
        return;
      }
      
      hasInitialized.current = true;
      setIsLoading(true);
      setError(null);
      
      try {
        await getConnectionInfo();
      } catch (err) {
        console.error('Failed to get connection info:', err);
        setError('Failed to initialize connection: ' + 
          (err instanceof Error ? err.message : String(err)));
        // Reset the hasInitialized ref so we can try again if needed
        hasInitialized.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    initConnection();
    // Empty dependency array ensures this only runs once on mount
  }, []);

  // Generate QR code value from connection data
  const getQRCodeValue = (): string => {
    if (!connectionInfo) return '';
    return JSON.stringify(connectionInfo);
  };

  // Get connection status text
  const getStatusText = () => {
    switch (connectionState) {
      case ConnectionState.CONNECTED:
        return 'Connected!';
      case ConnectionState.CONNECTING:
        return 'Connecting...';
      case ConnectionState.ERROR:
        return 'Connection Failed';
      default:
        return 'Ready to Connect';
    }
  };

  // Get status color
  const getStatusColor = () => {
    switch (connectionState) {
      case ConnectionState.CONNECTED:
        return '#28a745'; // Green
      case ConnectionState.CONNECTING:
        return '#ffc107'; // Yellow
      case ConnectionState.ERROR:
        return '#dc3545'; // Red
      default:
        return '#6c757d'; // Gray
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loading}>Initializing connection...</Text>
        </View>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : connectionInfo ? (
        <>
          <Text style={styles.label}>Scan this QR code to connect:</Text>
          <QRCode value={getQRCodeValue()} size={200} />
          <View style={styles.infoContainer}>
            <Text style={styles.info}>Device ID: {connectionInfo.deviceId}</Text>
            <Text style={styles.info}>IP: {connectionInfo.ipAddress}</Text>
            <Text style={styles.info}>Port: {connectionInfo.port}</Text>
          </View>
          <Text style={[styles.status, { color: getStatusColor() }]}>
            {getStatusText()}
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
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  info: {
    fontSize: 14,
    marginVertical: 5,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default QRCodeGenerator;