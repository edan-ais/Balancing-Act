import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

interface TabContextType {
  selectedTabs: string[];
  setSelectedTabs: (tabs: string[]) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: ReactNode }) {
  const [selectedTabs, setSelectedTabs] = useState<string[]>(['index', 'goals', 'weekly', 'meal-prep', 'cleaning', 'self-care', 'delegation']);
  const { user } = useAuth();

  // Load user's selected tabs when user logs in
  useEffect(() => {
    if (user) {
      loadUserTabs();
    } else {
      // Reset to defaults when user logs out
      setSelectedTabs(['index', 'goals', 'weekly', 'meal-prep', 'cleaning', 'self-care', 'delegation']);
    }
  }, [user]);

  const loadUserTabs = async () => {
    if (!user) return;

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

      if (data?.selected_tabs && Array.isArray(data.selected_tabs)) {
        setSelectedTabs(data.selected_tabs);
      }
    } catch (error) {
      console.error('Error loading user tabs:', error);
    }
  };

  const saveUserTabs = async (tabs: string[]) => {
    if (!user) return;

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
  };

  const setSelectedTabsWithSync = (tabs: string[]) => {
    setSelectedTabs(tabs);
    
    // Save to Supabase if user is logged in
    if (user) {
      saveUserTabs(tabs);
    }
  };

  return (
    <TabContext.Provider value={{ selectedTabs, setSelectedTabs: setSelectedTabsWithSync }}>
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