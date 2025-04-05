import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { environmentService, Environment } from '../config/environments';

interface EnvironmentIndicatorProps {
  position?: 'top' | 'bottom';
}

const EnvironmentIndicator: React.FC<EnvironmentIndicatorProps> = ({ position = 'top' }) => {
  const [environment, setEnvironment] = useState<Environment>(environmentService.getEnvironment());
  const [fadeAnim] = useState(new Animated.Value(1));
  
  // Get environment details
  const config = environmentService.getConfig();
  const { environmentColor } = config;

  useEffect(() => {
    // Create an animation when environment changes
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
  }, [environment, fadeAnim]);

  const handlePress = async () => {
    try {
      const newEnv = await environmentService.cycleEnvironment();
      setEnvironment(newEnv);
    } catch (error) {
      console.error('Failed to change environment:', error);
    }
  };

  // Only show if configured to show
  if (!config.showEnvironmentIndicator) {
    return null;
  }

  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={[
        styles.container, 
        position === 'top' ? styles.topPosition : styles.bottomPosition,
        { backgroundColor: environmentColor }
      ]}
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.text}>{environment.toUpperCase()}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
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
  topPosition: {
    top: 50,
    right: 10,
  },
  bottomPosition: {
    bottom: 30,
    right: 10,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default EnvironmentIndicator;