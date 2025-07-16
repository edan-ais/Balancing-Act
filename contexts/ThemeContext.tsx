import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Theme, defaultTheme, themes, TabColors, TabColorSet } from '@/constants/themes';

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
  const isMountedRef = useRef(true);

  // Setup mounted ref
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Memoize loadUserPreferences to avoid recreation on each render
  const loadUserPreferences = useCallback(async () => {
    if (!user || !isMountedRef.current) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('current_theme')
        .eq('id', user.id)
        .single();

      if (error) {
        // If table doesn't exist, use default theme
        if (error.code === '42P01' || error.code === 'PGRST116') {
          console.log('User profiles table not found, using default theme');
          return;
        }
        console.error('Error loading user preferences:', error);
        return;
      }

      if (data?.current_theme && isMountedRef.current) {
        const theme = themes.find(t => t.id === data.current_theme);
        if (theme) {
          setCurrentTheme(theme);
        }
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  }, [user]);

  // Load user preferences when user logs in
  useEffect(() => {
    if (user) {
      loadUserPreferences();
    } else {
      // Reset to defaults when user logs out
      if (isMountedRef.current) {
        setCurrentTheme(defaultTheme);
      }
    }
  }, [user, loadUserPreferences]);

  // Memoize saveUserPreferences to avoid recreation on each render
  const saveUserPreferences = useCallback(async (themeId: string) => {
    if (!user || !isMountedRef.current) return;

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
  }, [user]);

  // Memoize the theme setter function
  const setTheme = useCallback((themeId: string) => {
    if (!isMountedRef.current) return;
    
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      
      // Save to Supabase if user is logged in
      if (user) {
        saveUserPreferences(themeId);
      }
    }
  }, [user, saveUserPreferences]);

  // Memoize the tab setter function
  const handleSetCurrentTab = useCallback((tab: string) => {
    if (isMountedRef.current) {
      setCurrentTab(tab);
    }
  }, []);

  // Apply the background image when the theme changes
  useEffect(() => {
    // Only run DOM manipulation in web environment
    if (typeof document === 'undefined' || !isMountedRef.current) return;
    
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
      if (currentTheme.tabColors && currentTab) {
        // Skip themeColorWheel as it doesn't have bg property
        if (currentTab !== 'themeColorWheel') {
          // Now TypeScript knows this is a TabColorSet with a bg property
          const tabColors = currentTheme.tabColors[currentTab as keyof Omit<TabColors, 'themeColorWheel'>];
          if (tabColors) {
            // Safe to access bg property
            document.body.style.backgroundColor = (tabColors as TabColorSet).bg;
          } else {
            document.body.style.backgroundColor = '#ffffff'; // Default fallback
          }
        } else {
          // For themeColorWheel, use a default color
          document.body.style.backgroundColor = '#ffffff';
        }
      } else {
        document.body.style.backgroundColor = '#ffffff'; // Default fallback
      }
    }
    
    // Clean up function to reset background when component unmounts or theme changes
    return () => {
      if (typeof document !== 'undefined' && isMountedRef.current) {
        // Only reset if component is still mounted (prevents unnecessary DOM operations)
        document.body.style.backgroundImage = 'none';
      }
    };
  }, [currentTheme, currentTab]);

  // Memoize the context value
  const contextValue = useMemo(() => ({
    currentTheme,
    setTheme,
    availableThemes: themes,
    currentTab,
    setCurrentTab: handleSetCurrentTab
  }), [currentTheme, setTheme, currentTab, handleSetCurrentTab]);

  return (
    <ThemeContext.Provider value={contextValue}>
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