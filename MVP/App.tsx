import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { MaterialIcons } from '@expo/vector-icons';

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

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.versionLabel}>App Version:</Text>
          <Text style={styles.versionText}>Version {appVersion}</Text>
        </View>
        <TouchableOpacity style={styles.infoButton} onPress={() => setNotesVisible(true)}>
          <MaterialIcons name="info" size={30} color="#333" />
        </TouchableOpacity>
      </View>
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
  infoContainer: {
    position: 'absolute',
    top: 50,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12, // Match the size of the info button
    color: '#888',
    marginRight: 10, // Add spacing between version text and info button
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
