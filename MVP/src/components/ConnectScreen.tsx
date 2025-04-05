import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import QRCodeGenerator from './QRCodeGenerator';
import QRCodeScanner from './QRCodeScanner';

const ConnectScreen = () => {
  const [showScanner, setShowScanner] = useState(false);

  const handleScan = (data: string) => {
    console.log('Scanned data:', data);
    setShowScanner(false);
  };

  return (
    <View style={styles.container}>
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
      >
        <FontAwesome name="camera" size={24} color="#fff" />
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
    aspectRatio: 1, // Ensures a square view
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    width: '100%',
    aspectRatio: 1, // Ensures a square view
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
});

export default ConnectScreen;