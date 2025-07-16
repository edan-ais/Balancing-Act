import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

const createSupabaseStorage = () => {
  if (Platform.OS === 'web') {
    return {
      getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
      setItem: (key: string, value: string) => {
        localStorage.setItem(key, value);
        return Promise.resolve();
      },
      removeItem: (key: string) => {
        localStorage.removeItem(key);
        return Promise.resolve();
      },
    };
  }

  return {
    getItem: async (key: string): Promise<string | null> => {
      try {
        return await SecureStore.getItemAsync(key);
      } catch {
        return AsyncStorage.getItem(key);
      }
    },
    setItem: async (key: string, value: string): Promise<void> => {
      try {
        await SecureStore.setItemAsync(key, value);
      } catch {
        await AsyncStorage.setItem(key, value);
      }
    },
    removeItem: async (key: string): Promise<void> => {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch {
        await AsyncStorage.removeItem(key);
      }
    },
  };
};

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      storage: createSupabaseStorage(),
    },
  }
);