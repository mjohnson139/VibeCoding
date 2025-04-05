import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useConnection } from './ConnectionProvider';
import { ConnectionState, ConnectionInfo } from '../utils/websocketUtils';

const QRCodeGenerator = () => {
  const { startServer, connectionInfo: contextConnectionInfo, connectionState, stopServer } = useConnection();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localConnectionInfo, setLocalConnectionInfo] = useState<ConnectionInfo | null>(null);
  const hasInitialized = useRef(false);

  // Initialize connection info when component mounts - run only once
  useEffect(() => {
    const initConnection = async () => {
      // Don't run if we've already initialized
      if (hasInitialized.current) {
        return;
      }
      
      hasInitialized.current = true;
      setIsLoading(true);
      setError(null);
      
      try {
        // Start the server explicitly when generating QR code
        const info = await startServer();
        console.log('Server started and ready for QR code generation:', info);
        
        // Store connection info locally so we can display the QR code
        setLocalConnectionInfo(info);
        
        // Show a notification about server limitations
        setTimeout(() => {
          Alert.alert(
            'Connection Information',
            'Your device is configured as a host. Note that direct connections may not work on all networks due to firewall restrictions.',
            [{ text: 'OK', onPress: () => console.log('User acknowledged connection limitations') }]
          );
        }, 500);
      } catch (err) {
        console.error('Failed to start server:', err);
        setError('Failed to start server: ' + 
          (err instanceof Error ? err.message : String(err)));
        // Reset the hasInitialized ref so we can try again if needed
        hasInitialized.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    initConnection();
    
    // Stop the server when component unmounts
    return () => {
      console.log('QRCodeGenerator unmounting, stopping server');
      stopServer();
    };
  }, [startServer, stopServer]);

  // Use either the local connection info or the one from context
  const effectiveConnectionInfo = localConnectionInfo || contextConnectionInfo;
  
  // Reset initialization if we're remounting the component
  useEffect(() => {
    return () => {
      hasInitialized.current = false;
    };
  }, []);

  // Generate QR code value from connection data
  const getQRCodeValue = (): string => {
    if (!effectiveConnectionInfo) return '';
    return JSON.stringify(effectiveConnectionInfo);
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
      ) : effectiveConnectionInfo ? (
        <>
          <Text style={styles.label}>Scan this QR code to connect:</Text>
          <QRCode value={getQRCodeValue()} size={200} />
          <View style={styles.infoContainer}>
            <Text style={styles.info}>Device ID: {effectiveConnectionInfo.deviceId}</Text>
            <Text style={styles.info}>IP: {effectiveConnectionInfo.ipAddress}</Text>
            <Text style={styles.info}>Port: {effectiveConnectionInfo.port}</Text>
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