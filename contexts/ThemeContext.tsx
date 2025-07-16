import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Theme, defaultTheme, themes } from '@/constants/themes';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);
  const { user } = useAuth();

  const loadUserTheme = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('current_theme')
        .eq('id', user.id)
        .single();

      if (!error && data?.current_theme) {
        const theme = themes.find(t => t.id === data.current_theme);
        if (theme) {
          setCurrentTheme(theme);
        }
      }
    } catch (error) {
      console.error('Error loading user theme:', error);
    }
  }, [user]);

  const saveUserTheme = useCallback(async (themeId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          current_theme: themeId,
        });
    } catch (error) {
      console.error('Error saving user theme:', error);
    }
  }, [user]);

  const updateTheme = useCallback((themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      if (user) {
        saveUserTheme(themeId);
      }
    }
  }, [user, saveUserTheme]);

  useEffect(() => {
    if (user) {
      loadUserTheme();
    } else {
      setCurrentTheme(defaultTheme);
    }
  }, [user, loadUserTheme]);

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      setTheme: updateTheme,
      availableThemes: themes,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}