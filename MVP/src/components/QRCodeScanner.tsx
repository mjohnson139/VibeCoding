import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useConnection, ConnectionData } from './ConnectionProvider';

const QRCodeScanner = ({ onScan }: { onScan: (data: string) => void }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const { connectToServer, connectionState } = useConnection();
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {
    if (scanned || connecting) return;
    setScanned(true);
    
    try {
      // Parse the connection data from the QR code
      let connectionData: ConnectionData;
      try {
        connectionData = JSON.parse(data) as ConnectionData;
      } catch (err) {
        throw new Error('Invalid QR code format. Expected valid connection data.');
      }
      
      // Validate the connection data
      if (!connectionData.ip || !connectionData.port) {
        throw new Error('QR code missing IP or port information.');
      }
      
      // Show connecting state
      setConnecting(true);
      Alert.alert('QR Code Scanned', `Connecting to ${connectionData.ip}:${connectionData.port}...`);
      
      // Call onScan callback with the raw data
      onScan(data);
      
      // Connect to the server using the connection data
      await connectToServer(connectionData);
      
      // Connection successful (handled by the ConnectionProvider state)
    } catch (err) {
      // Handle connection error
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to server');
      
      // Show error alert
      Alert.alert(
        'Connection Error', 
        err instanceof Error ? err.message : 'Failed to connect to server',
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
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
          
          {/* Display connection error if there is one */}
          {error && (
            <View style={[styles.statusContainer, styles.errorContainer]}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      </CameraView>
      
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
    backgroundColor: 'rgba(220, 53, 69, 0.7)',
  },
  errorText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default QRCodeScanner;