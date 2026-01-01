import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../theme';

export default function PurpleIconTile() {
  return (
    <LinearGradient colors={Gradients.icon} style={styles.tile}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.label}>BB</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 128,
    height: 128,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },

    // Android shadow
    elevation: 12,
  },
  emoji: {
    fontSize: 36,
  },
  label: {
    marginTop: 6,
    color: Colors.white,
    fontWeight: '900',
    fontSize: 24,
    letterSpacing: 2,
  },
});
