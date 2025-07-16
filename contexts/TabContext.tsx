import React, { createContext, useContext, useState, ReactNode, useRef, useCallback, useMemo, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// Default tabs array - defined as a constant outside the component
const DEFAULT_TABS = ['index', 'goals', 'weekly', 'meal-prep', 'cleaning', 'self-care', 'delegation'];

interface TabContextType {
  selectedTabs: string[];
  setSelectedTabs: (tabs: string[]) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: ReactNode }) {
  const [selectedTabs, setSelectedTabs] = useState<string[]>(DEFAULT_TABS);
  const { user } = useAuth();
  const isMountedRef = useRef(true);

  // Set up mounted ref
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Memoize loadUserTabs to avoid recreation on each render
  const loadUserTabs = useCallback(async () => {
    if (!user || !isMountedRef.current) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('selected_tabs')
        .eq('id', user.id)
        .single();

      if (error) {
        // If table doesn't exist, use default tabs
        if (error.code === '42P01' || error.code === 'PGRST116') {
          console.log('User profiles table not found, using default tabs');
          return;
        }
        console.error('Error loading user tabs:', error);
        return;
      }

      // Only update state if component is still mounted and we have valid data
      if (isMountedRef.current && data?.selected_tabs && Array.isArray(data.selected_tabs)) {
        setSelectedTabs(data.selected_tabs);
      }
    } catch (error) {
      console.error('Error loading user tabs:', error);
    }
  }, [user]);

  // Load user's selected tabs when user logs in
  useEffect(() => {
    if (user) {
      loadUserTabs();
    } else {
      // Reset to defaults when user logs out
      if (isMountedRef.current) {
        setSelectedTabs(DEFAULT_TABS);
      }
    }
  }, [user, loadUserTabs]);

  // Memoize saveUserTabs to avoid recreation on each render
  const saveUserTabs = useCallback(async (tabs: string[]) => {
    if (!user || !isMountedRef.current) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          selected_tabs: tabs,
        });

      if (error) {
        console.error('Error saving user tabs:', error);
      }
    } catch (error) {
      console.error('Error saving user tabs:', error);
    }
  }, [user]);

  // Memoize the tab setter function
  const setSelectedTabsWithSync = useCallback((tabs: string[]) => {
    if (!isMountedRef.current) return;
    
    setSelectedTabs(tabs);
    
    // Save to Supabase if user is logged in
    if (user) {
      saveUserTabs(tabs);
    }
  }, [user, saveUserTabs]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    selectedTabs,
    setSelectedTabs: setSelectedTabsWithSync
  }), [selectedTabs, setSelectedTabsWithSync]);

  return (
    <TabContext.Provider value={contextValue}>
      {children}
    </TabContext.Provider>
  );
}

export function useTabContext() {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
}