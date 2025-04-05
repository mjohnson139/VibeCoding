import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { parseChangelog, BuildNotes as BuildNotesType } from '../utils/changelogParser';

interface BuildNotesProps {
  version: string;
  isVisible: boolean;
  onClose: () => void;
}

const BuildNotesComponent: React.FC<BuildNotesProps> = ({ version, isVisible, onClose }) => {
  const [buildNotes, setBuildNotes] = useState<BuildNotesType>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadBuildNotes() {
      try {
        const notes = await parseChangelog();
        setBuildNotes(notes);
      } catch (error) {
        console.error('Error loading build notes:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadBuildNotes();
  }, []);
  
  if (!isVisible) return null;
  
  // Get notes for the current version or fallback to unknown version message
  const noteData = buildNotes[version] || { 
    title: `Version ${version}`, 
    notes: ['No notes available for this version'] 
  };
  
  return (
    <View style={styles.notesContainer}>
      <View style={styles.notesHeader}>
        <Text style={styles.notesTitle}>{noteData.title} (Build {version})</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <Text style={styles.loadingText}>Loading release notes...</Text>
      ) : (
        <ScrollView style={styles.notesScrollView}>
          {noteData.notes.map((note, index) => (
            <View key={index} style={styles.noteItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.noteText}>{note}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  loadingText: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  }
});

export default BuildNotesComponent;