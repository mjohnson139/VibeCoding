import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import QRCodeGenerator from './QRCodeGenerator';
import QRCodeScanner from './QRCodeScanner';
import { useConnection } from './ConnectionProvider';
import { ConnectionState } from '../utils/websocketUtils';

const ConnectScreen = () => {
  const [showScanner, setShowScanner] = useState(false);
  const { connectionState, disconnect } = useConnection();
  
  // Animated values for oscillating gradient
  const [gradientProgress] = useState(new Animated.Value(0));
  
  // Start gradient animation when connecting
  useEffect(() => {
    if (connectionState === ConnectionState.CONNECTING) {
      // Create oscillating animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(gradientProgress, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(gradientProgress, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      // Stop animation if not connecting
      gradientProgress.stopAnimation();
      gradientProgress.setValue(0);
    }
  }, [connectionState, gradientProgress]);

  // Define gradient colors based on connection state
  const getGradientColors = () => {
    switch (connectionState) {
      case ConnectionState.CONNECTED:
        return ['#28a745', '#218838', '#1e7e34']; // Green success colors
      case ConnectionState.ERROR:
        return ['#dc3545', '#c82333', '#bd2130']; // Red error colors
      case ConnectionState.CONNECTING:
        // For connecting state, we use the animated gradient
        return [
          gradientProgress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['#dc3545', '#ffc107', '#28a745'],
          }),
          gradientProgress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['#c82333', '#e0a800', '#218838'],
          }),
          gradientProgress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['#bd2130', '#d39e00', '#1e7e34'],
          }),
        ];
      default:
        return ['#6c757d', '#5a6268', '#545b62']; // Gray default colors
    }
  };

  const handleScan = (data: string) => {
    console.log('Scanned data:', data);
    // The actual connection is handled by the QRCodeScanner component
  };

  const handleDisconnect = () => {
    disconnect();
    setShowScanner(false);
  };

  // Switch to QR generator when successfully connected as client
  useEffect(() => {
    if (connectionState === ConnectionState.CONNECTED && showScanner) {
      // After successful connection, automatically switch back to QR generator view
      setTimeout(() => {
        setShowScanner(false);
      }, 1500); // Small delay to show the connection success state
    }
  }, [connectionState, showScanner]);

  return (
    <View style={styles.container}>
      {/* Connection status banner - don't show error state when scanner is active */}
      {connectionState !== ConnectionState.DISCONNECTED && 
       !(showScanner && connectionState === ConnectionState.ERROR) && (
        <Animated.View style={styles.statusBanner}>
          <LinearGradient
            colors={getGradientColors() as string[]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Text style={styles.statusText}>
              {connectionState === ConnectionState.CONNECTED
                ? 'Connected!'
                : connectionState === ConnectionState.CONNECTING
                ? 'Connecting...'
                : connectionState === ConnectionState.ERROR
                ? 'Connection Error'
                : 'Disconnected'}
            </Text>
            
            {connectionState === ConnectionState.CONNECTED && (
              <TouchableOpacity
                style={styles.disconnectButton}
                onPress={handleDisconnect}
              >
                <Text style={styles.disconnectText}>Disconnect</Text>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </Animated.View>
      )}

      {showScanner ? (
        <View style={styles.cameraContainer}>
          <QRCodeScanner onScan={handleScan} />
        </View>
      ) : (
        <View style={styles.qrCodeContainer}>
          <QRCodeGenerator />
        </View>
      )}

      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => setShowScanner(!showScanner)}
        disabled={connectionState === ConnectionState.CONNECTING}
      >
        <FontAwesome
          name={showScanner ? 'qrcode' : 'camera'}
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
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
  qrCodeContainer: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disconnectButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  disconnectText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ConnectScreen;