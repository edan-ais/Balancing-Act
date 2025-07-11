import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TabContextType {
  selectedTabs: string[];
  setSelectedTabs: (tabs: string[]) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: ReactNode }) {
  const [selectedTabs, setSelectedTabs] = useState<string[]>(['index', 'goals', 'weekly', 'meal-prep', 'cleaning', 'self-care', 'delegation']);

  return (
    <TabContext.Provider value={{ selectedTabs, setSelectedTabs }}>
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