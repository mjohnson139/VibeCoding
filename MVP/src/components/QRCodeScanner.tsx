import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useConnection } from './ConnectionProvider';
import { ConnectionInfo } from '../utils/websocketUtils';
import { Ionicons } from '@expo/vector-icons';
import * as Network from 'expo-network';

const QRCodeScanner = ({ onScan }: { onScan: (data: string) => void }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const { connect, connectionState } = useConnection();
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Monitor connection state for errors
  useEffect(() => {
    if (connectionState === 'error') {
      setError('Failed to connect: Connection refused');
      setScanned(false);
    }
  }, [connectionState]);

  const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {
    if (scanned || connecting) return;
    setScanned(true);
    
    try {
      // Parse the connection data from the QR code
      let connectionData: ConnectionInfo;
      try {
        connectionData = JSON.parse(data) as ConnectionInfo;
        console.log('Parsed connection data from QR code:', connectionData);
      } catch (err) {
        throw new Error('Invalid QR code format. Expected valid connection data.');
      }
      
      // Validate the connection data
      if (!connectionData.ipAddress || !connectionData.port) {
        throw new Error('QR code missing IP or port information.');
      }
      
      // Show connecting state
      setConnecting(true);
      
      // Test IP address connectivity before attempting WebSocket connection
      try {
        console.log(`Testing network connectivity to ${connectionData.ipAddress}:${connectionData.port}...`);
        const networkState = await Network.getNetworkStateAsync();
        console.log('Current network state:', networkState);
      } catch (netErr) {
        console.error('Network info error:', netErr);
      }
      
      // Call onScan callback with the raw data
      onScan(data);
      
      // Connect to the server using the connection data
      connect(connectionData);
      
      // Connection successful (handled by the ConnectionProvider state)
    } catch (err) {
      // Handle connection error
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to server');
      
      // Reset scanned status to allow scanning again
      setScanned(false);
    } finally {
      setConnecting(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
          }}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            {/* Crosshair lines */}
            <View style={styles.crosshairHorizontal} />
            <View style={styles.crosshairVertical} />
          </View>
          
          {/* Display connection status if attempting to connect */}
          {connecting && (
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>Connecting...</Text>
            </View>
          )}
        </View>
      </CameraView>
      
      {/* Error message near the bottom button */}
      {error && (
        <View style={styles.errorContainer}>
          <View style={styles.errorContent}>
            <Ionicons name="warning" size={24} color="white" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
          <TouchableOpacity 
            style={styles.dismissButton} 
            onPress={() => setError(null)}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
      
      {scanned && !connecting && (
        <View style={styles.buttonContainer}>
          <Button title={'Scan Again'} onPress={() => {
            setScanned(false);
            setError(null);
          }} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute', // Ensure it doesn't overflow the parent container
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 30,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  crosshairVertical: {
    position: 'absolute',
    height: 30,
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'rgba(0, 123, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(220, 53, 69, 0.9)',
    padding: 12,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  errorText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  dismissButton: {
    padding: 5,
  },
});

export default QRCodeScanner;