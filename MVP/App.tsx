import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import Constants from 'expo-constants';
import EnvironmentIndicator from './src/components/EnvironmentIndicator';
import BuildNotesComponent from './src/components/BuildNotesComponent';
import { environmentService } from './src/config/environments';
import QRCodeGenerator from './src/components/QRCodeGenerator';

export default function App() {
  const [notesVisible, setNotesVisible] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  // Updated way to access the version in newer Expo SDK
  const appVersion = Constants.expoConfig?.version || '1.0.1'; // Default to latest version if unavailable
  const [environment, setEnvironment] = useState(environmentService.getEnvironment());
  const [fadeAnim] = useState(new Animated.Value(1));

  // Update the environment state when it changes
  useEffect(() => {
    const updateEnvironment = async () => {
      // Listen for environment changes
      setEnvironment(environmentService.getEnvironment());
    };

    updateEnvironment();
  }, []);

  // Get environment color for consistent styling
  const { environmentColor } = environmentService.getConfig();

  return (
    <View style={styles.container}>
      {/* Environment Indicator */}
      <EnvironmentIndicator position="top" />
      
      {/* Version Indicator - styled similar to Environment Indicator but with light gray color */}
      <TouchableOpacity 
        style={[styles.versionContainer, { backgroundColor: '#9e9e9e' }]}
        onPress={() => setNotesVisible(true)}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.versionText}>v{appVersion}</Text>
        </Animated.View>
      </TouchableOpacity>
      
      {/* Using our new component that fetches notes from CHANGELOG.md */}
      <BuildNotesComponent
        version={appVersion}
        isVisible={notesVisible}
        onClose={() => setNotesVisible(false)}
      />

      {showQRCode ? (
        <QRCodeGenerator />
      ) : (
        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => setShowQRCode(true)}
        >
          <Text style={styles.qrButtonText}>Generate QR Code</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  versionContainer: {
    position: 'absolute',
    top: 50,
    right: 70, // Position to the left of environment indicator
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1000,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  versionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoContainer: {
    position: 'absolute',
    top: 50,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionLabel: {
    fontSize: 10, // Label size slightly smaller than version text
    color: '#555',
    marginBottom: 5, // Add spacing between label and version text
  },
  infoButton: {
    width: 30, // Increased size for better visibility
    height: 30, // Increased size for better visibility
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25, // Adjusted to match the new size
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoIcon: {
    fontSize: 50, // Increased icon size for better visibility
    color: '#333',
  },
  notesContainer: {
    position: 'absolute',
    top: 100,
    right: 10,
    width: 250,
    maxHeight: 400,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  notesTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
  },
  closeButton: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 2,
  },
  notesScrollView: {
    maxHeight: 300,
  },
  noteItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletPoint: {
    marginRight: 6,
  },
  noteText: {
    fontSize: 12,
    flex: 1,
  },
  qrButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  qrButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
