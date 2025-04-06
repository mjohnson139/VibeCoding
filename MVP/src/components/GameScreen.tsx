import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GameScreen = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#28a745', '#218838', '#1e7e34']}
        style={styles.background}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Game Started!</Text>
          <Text style={styles.subtitle}>You are now connected and ready to play</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#218838',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
});

export default GameScreen;
