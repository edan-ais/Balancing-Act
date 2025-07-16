import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const DEFAULT_TABS = ['index', 'goals', 'weekly', 'meal-prep', 'cleaning', 'self-care', 'delegation'];

interface TabContextType {
  selectedTabs: string[];
  setSelectedTabs: (tabs: string[]) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: ReactNode }) {
  const [selectedTabs, setSelectedTabs] = useState<string[]>(DEFAULT_TABS);
  const { user } = useAuth();

  const loadUserTabs = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('selected_tabs')
        .eq('id', user.id)
        .single();

      if (!error && data?.selected_tabs && Array.isArray(data.selected_tabs)) {
        setSelectedTabs(data.selected_tabs);
      }
    } catch (error) {
      console.error('Error loading user tabs:', error);
    }
  }, [user]);

  const saveUserTabs = useCallback(async (tabs: string[]) => {
    if (!user) return;

    try {
      await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          selected_tabs: tabs,
        });
    } catch (error) {
      console.error('Error saving user tabs:', error);
    }
  }, [user]);

  const updateSelectedTabs = useCallback((tabs: string[]) => {
    setSelectedTabs(tabs);
    if (user) {
      saveUserTabs(tabs);
    }
  }, [user, saveUserTabs]);

  useEffect(() => {
    if (user) {
      loadUserTabs();
    } else {
      setSelectedTabs(DEFAULT_TABS);
    }
  }, [user, loadUserTabs]);

  return (
    <TabContext.Provider value={{ selectedTabs, setSelectedTabs: updateSelectedTabs }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTabContext() {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
}
</boltContext>