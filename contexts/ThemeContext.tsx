import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Theme, defaultTheme, themes } from '@/constants/themes';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
  currentTab?: string;
  setCurrentTab?: (tab: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);
  const [currentTab, setCurrentTab] = useState<string>('daily'); // Default to 'daily' tab
  const { user } = useAuth();

  // Load user preferences when user logs in
  useEffect(() => {
    if (user) {
      loadUserPreferences();
    } else {
      // Reset to defaults when user logs out
      setCurrentTheme(defaultTheme);
    }
  }, [user]);

  const loadUserPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('current_theme')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading user preferences:', error);
        return;
      }

      if (data?.current_theme) {
        const theme = themes.find(t => t.id === data.current_theme);
        if (theme) {
          setCurrentTheme(theme);
        }
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const saveUserPreferences = async (themeId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          current_theme: themeId,
        });

      if (error) {
        console.error('Error saving user preferences:', error);
      }
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  };

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      
      // Save to Supabase if user is logged in
      if (user) {
        saveUserPreferences(themeId);
      }
    }
  };

  // Apply the background image when the theme changes
  useEffect(() => {
    // Only run DOM manipulation in web environment
    if (typeof document === 'undefined') return;
    
    // Check if there's a tab-specific background for the current tab
    const tabBackground = currentTheme.tabBackgrounds?.[currentTab];
    
    // Use tab-specific background if available, otherwise fall back to main theme background
    const backgroundImage = tabBackground || currentTheme.backgroundImage;
    
    if (backgroundImage) {
      document.body.style.backgroundImage = `url(${backgroundImage})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      // Reset background if no image is specified
      document.body.style.backgroundImage = 'none';
      // Use the background color from the current tab if available
      if (currentTheme.tabColors && currentTab && currentTheme.tabColors[currentTab]) {
        document.body.style.backgroundColor = currentTheme.tabColors[currentTab].bg;
      } else {
        document.body.style.backgroundColor = '#ffffff'; // Default fallback
      }
    }
    
    // Clean up function to reset background when component unmounts
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.backgroundImage = 'none';
      }
    };
  }, [currentTheme, currentTab]);

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      setTheme, 
      availableThemes: themes,
      currentTab,
      setCurrentTab
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}