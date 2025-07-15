import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { X, Mail, Lock, User } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import NeumorphicCard from './NeumorphicCard';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  colors: any;
}

export default function AuthModal({ visible, onClose, colors }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setIsSignUp(false);
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }


    setLoading(true);

    try {
      const { error } = isSignUp 
        ? await signUp(email.trim(), password)
        : await signIn(email.trim(), password);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        if (isSignUp) {
          Alert.alert(
            'Success', 
            'Account created! Please check your email to verify your account.',
            [{ text: 'OK', onPress: handleClose }]
          );
        } else {
          handleClose();
        }
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An unexpected error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <NeumorphicCard style={[styles.modalContainer, { backgroundColor: colors.bg }]}>
            <View style={[styles.header, { borderBottomColor: colors.pastel }]}>
              <Text style={[styles.title, { color: colors.veryDark }]}>
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <X size={24} color={colors.veryDark} />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <Text style={[styles.subtitle, { color: colors.dark }]}>
                {isSignUp 
                  ? 'Create an account to save your tasks and preferences'
                  : 'Sign in to access your saved tasks and preferences'
                }
              </Text>

              <View style={styles.inputContainer}>
                <View style={[styles.inputWrapper, { borderColor: colors.pastel }]}>
                  <Mail size={20} color={colors.medium} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.veryDark }]}
                    placeholder="Email address"
                    placeholderTextColor={colors.medium}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={[styles.inputWrapper, { borderColor: colors.pastel }]}>
                  <Lock size={20} color={colors.medium} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.veryDark }]}
                    placeholder="Password"
                    placeholderTextColor={colors.medium}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>

                {isSignUp && (
                  <View style={[styles.inputWrapper, { borderColor: colors.pastel }]}>
                    <Lock size={20} color={colors.medium} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: colors.veryDark }]}
                      placeholder="Confirm password"
                      placeholderTextColor={colors.medium}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                      autoCapitalize="none"
                    />
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.authButton,
                  { backgroundColor: colors.dark },
                  loading && styles.disabledButton
                ]}
                onPress={handleAuth}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.pastel} />
                ) : (
                  <>
                    <User size={20} color={colors.pastel} />
                    <Text style={[styles.authButtonText, { color: colors.pastel }]}>
                      {isSignUp ? 'Create Account' : 'Sign In'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.switchModeButton}
                onPress={() => setIsSignUp(!isSignUp)}
              >
                <Text style={[styles.switchModeText, { color: colors.dark }]}>
                  {isSignUp 
                    ? 'Already have an account? Sign in'
                    : "Don't have an account? Sign up"
                  }
                </Text>
              </TouchableOpacity>
            </View>
          </NeumorphicCard>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    width: '90%',
    maxWidth: 400,
  },
  modalContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    margin: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Quicksand-Bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    paddingVertical: 12,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  authButtonText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    marginLeft: 8,
  },
  switchModeButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchModeText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
  },
});