import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Network from 'expo-network';

const QRCodeGenerator = () => {
  const [localIP, setLocalIP] = useState('');
  const [port] = useState('8080'); // Default port for WebSocket server

  useEffect(() => {
    // Fetch the local IP address using expo-network
    console.log('Fetching local IP address...');
    Network.getIpAddressAsync()
      .then(ip => {
        console.log('Local IP fetched:', ip);
        setLocalIP(ip);
      })
      .catch(error => {
        console.error('Error fetching local IP:', error);
      });
  }, []);

  const qrValue = localIP ? `${localIP}:${port}` : 'Loading...';

  return (
    <View style={styles.container}>
      {localIP ? (
        <>
          <Text style={styles.label}>Scan this QR code to connect:</Text>
          <QRCode value={qrValue} size={200} />
          <Text style={styles.info}>IP: {localIP}</Text>
          <Text style={styles.info}>Port: {port}</Text>
        </>
      ) : (
        <Text style={styles.loading}>Fetching local IP...</Text>
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
  },
});

export default QRCodeGenerator;