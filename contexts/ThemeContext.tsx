import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
    }
  };

  // Apply the background image when the theme changes
  useEffect(() => {
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
      document.body.style.backgroundImage = 'none';
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