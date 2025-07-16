import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. Check your .env file or environment configuration.'
  );
}

// Create a secure storage adapter that works across platforms
const createSupabaseStorage = () => {
  // For web, use localStorage
  if (Platform.OS === 'web') {
    return {
      getItem: (key: string) => {
        const value = localStorage.getItem(key);
        return Promise.resolve(value);
      },
      setItem: (key: string, value: string) => {
        localStorage.setItem(key, value);
        return Promise.resolve(undefined);
      },
      removeItem: (key: string) => {
        localStorage.removeItem(key);
        return Promise.resolve(undefined);
      },
    };
  }

  // For native platforms, use SecureStore with AsyncStorage fallback
  return {
    getItem: async (key: string): Promise<string | null> => {
      try {
        return await SecureStore.getItemAsync(key);
      } catch (error) {
        // Fall back to AsyncStorage if SecureStore fails
        return AsyncStorage.getItem(key);
      }
    },
    setItem: async (key: string, value: string): Promise<void> => {
      try {
        await SecureStore.setItemAsync(key, value);
      } catch (error) {
        // Fall back to AsyncStorage if SecureStore fails
        await AsyncStorage.setItem(key, value);
      }
    },
    removeItem: async (key: string): Promise<void> => {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (error) {
        // Fall back to AsyncStorage if SecureStore fails
        await AsyncStorage.removeItem(key);
      }
    },
  };
};

// Initialize Supabase client
export const supabase = createClient(
  supabaseUrl || '',  // Fallback to empty string if undefined
  supabaseAnonKey || '',  // Fallback to empty string if undefined
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      storage: createSupabaseStorage(),
    },
    global: {
      headers: {
        'X-Client-Info': 'bolt-expo-starter',
      },
    },
  }
);

// Export type for use throughout the app
export type SupabaseClient = typeof supabase;