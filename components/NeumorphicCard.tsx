import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface NeumorphicCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  pressed?: boolean;
  small?: boolean;
}

export default function NeumorphicCard({ children, style, pressed = false, small = false }: NeumorphicCardProps) {
  return (
    <View style={[
      styles.card,
      small ? styles.smallCard : styles.normalCard,
      pressed ? styles.pressedCard : styles.defaultCard,
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5F7FA',
    borderRadius: 16,
    padding: 16,
    margin: 8,
  },
  normalCard: {
    shadowColor: '#ffffff',
    shadowOffset: { width: -5, height: -5 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  smallCard: {
    shadowColor: '#ffffff',
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
  defaultCard: {
    shadowColor: '#C8D0E0',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  pressedCard: {
    shadowColor: '#C8D0E0',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});