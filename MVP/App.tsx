import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Animated } from 'react-native';
import Constants from 'expo-constants';
import { MaterialIcons } from '@expo/vector-icons';
import EnvironmentIndicator from './src/components/EnvironmentIndicator';
import { environmentService } from './src/config/environments';

const BuildNotes = ({ version, isVisible, onClose }) => {
  if (!isVisible) return null;

  const notes = {
    '1.0.0': {
      title: 'Version 1.0.0',
      notes: [
        'Initial release with peer-to-peer spitball shooting!',
        'QR code-based connection.',
        '3D spitball animations.',
      ],
    },
    '1.0.1': {
      title: 'Version 1.0.1',
      notes: [
        'Added environment management system (DEV/TEST/LIVE)',
        'Environment indicator in top-right corner (tap to switch)',
        'Environment-specific API endpoints and configuration',
        'Persistent environment settings',
      ],
    },
  }[version] || { title: 'Unknown Version', notes: ['No notes available'] };

  return (
    <View style={styles.notesContainer}>
      <View style={styles.notesHeader}>
        <Text style={styles.notesTitle}>{notes.title} (Build {version})</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.notesScrollView}>
        {notes.notes.map((note, index) => (
          <View key={index} style={styles.noteItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.noteText}>{note}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default function App() {
  const [notesVisible, setNotesVisible] = useState(false);
  const appVersion = Constants.manifest?.version || '1.0.0'; // Ensure version fallback is correct
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
      {/* Add Environment Indicator */}
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
      
      <BuildNotes
        version={appVersion}
        isVisible={notesVisible}
        onClose={() => setNotesVisible(false)}
      />
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
});
