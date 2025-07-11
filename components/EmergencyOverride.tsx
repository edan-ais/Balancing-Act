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
  accentColor = '#38A169', // Default accent color
  darkColor = '#1B4731'    // Default dark color
}: EmergencyOverrideProps) {
  if (!visible) return null;

  // Generate a lighter background color based on the accent color
  const getLightBackgroundColor = (color: string) => {
    // For simplicity, we're using predefined light colors based on common themes
    if (color.toLowerCase().includes('2b6cb0')) return '#E6F0FA'; // Light blue for daily
    if (color.toLowerCase().includes('38a169') || color.toLowerCase().includes('276749')) return '#E6FFFA'; // Light green for goals
    if (color.toLowerCase().includes('9f7aea')) return '#F3F0FF'; // Light purple for weekly
    if (color.toLowerCase().includes('ed8936')) return '#FEEBC8'; // Light orange for meal-prep
    return '#F7FAFC'; // Default light gray
  };

  const lightBackground = getLightBackgroundColor(darkColor);

  return (
    <View style={styles.overlay}>
      <NeumorphicCard style={styles.card}>
        <View style={styles.header}>
          <AlertTriangle size={32} color={darkColor} />
          <Text style={styles.title}>Emergency Override</Text>
        </View>

        <View style={[styles.effects, { 
          backgroundColor: lightBackground,
          borderLeftColor: darkColor 
        }]}>
          <Text style={[styles.effectsTitle, { color: darkColor }]}>What happens:</Text>
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
              backgroundColor: darkColor,
              shadowColor: darkColor 
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
  },
  effectsTitle: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    marginBottom: 8,
  },
  effectItem: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
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
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
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