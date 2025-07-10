import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TriangleAlert as AlertTriangle, ArrowRight } from 'lucide-react-native';
import NeumorphicCard from './NeumorphicCard';

interface EmergencyOverrideProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  accentColor?: string; // Main accent color
  darkColor?: string;   // Darker variant for borders, etc.
}

export default function EmergencyOverride({ 
  visible, 
  onClose, 
  onConfirm, 
  accentColor = '#2B6CB0', // Default blue
  darkColor = '#2C5282'    // Default dark blue
}: EmergencyOverrideProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <NeumorphicCard style={styles.card}>
        <View style={styles.header}>
          <AlertTriangle size={32} color={accentColor} />
          <Text style={styles.title}>Emergency Override</Text>
        </View>

        <View style={[styles.effects, { 
          backgroundColor: `${accentColor}10`, // Light version of accent color
          borderLeftColor: accentColor 
        }]}>
          <Text style={[styles.effectsTitle, { color: accentColor }]}>What happens:</Text>
          <Text style={[styles.effectItem, { color: darkColor }]}>• Non-urgent tasks → Tomorrow</Text>
          <Text style={[styles.effectItem, { color: darkColor }]}>• Emergency tasks created</Text>
          <Text style={[styles.effectItem, { color: darkColor }]}>• Critical habits reduced</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.confirmButton, { 
              backgroundColor: accentColor,
              shadowColor: accentColor 
            }]} 
            onPress={onConfirm}
          >
            <Text style={styles.confirmText}>Activate</Text>
            <ArrowRight size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </NeumorphicCard>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  card: {
    width: '90%',
    maxWidth: 400,
    padding: 24,
    margin: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    color: '#2D3748',
    marginLeft: 12,
  },
  effects: {
    backgroundColor: '#EBF8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#2B6CB0',
  },
  effectsTitle: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    color: '#2B6CB0',
    marginBottom: 8,
  },
  effectItem: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    color: '#2C5282',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: '#C8D0E0',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#4A5568',
  },
  confirmButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#2B6CB0',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#2B6CB0',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  confirmText: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#ffffff',
    marginRight: 8,
  },
});