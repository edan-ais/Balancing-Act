import React from 'react';
import { Tabs } from 'expo-router';
import { CalendarDays, Calendar, ChefHat, Sparkles, Target, Heart, Users } from 'lucide-react-native';
import { View, Text } from 'react-native';
import { useTabContext } from '@/contexts/TabContext';

// Define pastel and dark color pairs for each tab
export const tabColors = {
  daily: {
    pastel: '#B9C5FA',    // Pastel blue
    dark: '#4055C5',      // Darker blue
    bg: '#F2F5FF',        // Very light blue background
    accent: '#D9E0FC'     // Accent color for elements
  },
  future: {
    pastel: '#A9E6C0',    // Pastel green
    dark: '#2A9958',      // Darker green
    bg: '#F2FFF7',        // Very light green background
    accent: '#C9F2D9'     // Accent color for elements
  },
  calendar: {
    pastel: '#D6C5F5',    // Pastel purple
    dark: '#7E55D4',      // Darker purple
    bg: '#F8F5FF',        // Very light purple background
    accent: '#E8DDFA'     // Accent color for elements
  },
  meals: {
    pastel: '#F8D0B0',    // Pastel orange
    dark: '#DC6B15',      // Darker orange
    bg: '#FFF8F2',        // Very light orange background
    accent: '#FBE2CE'     // Accent color for elements
  },
  cleaning: {
    pastel: '#B2DAFD',    // Pastel blue
    dark: '#2578C8',      // Darker blue
    bg: '#F2F8FF',        // Very light blue background
    accent: '#D4E8FE'     // Accent color for elements
  },
  selfCare: {
    pastel: '#FCBFBF',    // Pastel red
    dark: '#D83A3A',      // Darker red
    bg: '#FFF5F5',        // Very light red background
    accent: '#FBD8D8'     // Accent color for elements
  },
  delegate: {
    pastel: '#A9E3E0',    // Pastel teal
    dark: '#258F8A',      // Darker teal
    bg: '#F2FFFE',        // Very light teal background
    accent: '#C9F0EE'     // Accent color for elements
  }
};

// Map route names to tab IDs and vice versa
const routeToTabMap = {
  'index': 'daily',
  'goals': 'future',
  'weekly': 'calendar',
  'meal-prep': 'meals',
  'cleaning': 'cleaning',
  'self-care': 'selfCare',
  'delegation': 'delegate'
};

const tabToRouteMap = {
  'daily': 'index',
  'future': 'goals',
  'calendar': 'weekly',
  'meals': 'meal-prep',
  'cleaning': 'cleaning',
  'selfCare': 'self-care',
  'delegate': 'delegation'
};

// Tab configuration mapping
const tabConfig = {
  'daily': {
    title: 'Daily',
    icon: CalendarDays,
  },
  'future': {
    title: 'Future',
    icon: Target,
  },
  'calendar': {
    title: 'Calendar',
    icon: Calendar,
  },
  'meals': {
    title: 'Meals',
    icon: ChefHat,
  },
  'cleaning': {
    title: 'Cleaning',
    icon: Sparkles,
  },
  'selfCare': {
    title: 'Self-Care',
    icon: Heart,
  },
  'delegate': {
    title: 'Delegate',
    icon: Users,
  }
};

export default function TabLayout() {
  const { selectedTabs } = useTabContext();
  
  // Custom tab icon component to ensure proper re-rendering
  const TabIcon = ({ route, size, focused }) => {
    const tabId = routeToTabMap[route];
    if (!tabId || !tabConfig[tabId]) return null;
    
    const Icon = tabConfig[tabId].icon;
    
    // Calculate offset to keep icon visually centered when scaled
    const offsetY = focused ? 8 : 0;
    
    return (
      <View style={{ 
        transform: [{ scale: focused ? 1.8 : 1 }],
        shadowColor: focused ? tabColors[tabId].dark : 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: focused ? 0.8 : 0,
        shadowRadius: focused ? 10 : 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: offsetY,
      }}>
        <Icon size={size} color={tabColors[tabId].dark} />
      </View>
    );
  };
  
  // Custom tab label component with proper styling
  const TabLabel = ({ route, focused }) => {
    const tabId = routeToTabMap[route];
    if (!tabId || !tabConfig[tabId]) return null;
    
    if (focused) return null;
    
    return (
      <Text 
        style={{
          color: tabColors[tabId].dark,
          fontFamily: 'Quicksand-SemiBold',
          fontSize: 10,
          marginTop: 4,
          textAlign: 'center',
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {tabConfig[tabId].title}
      </Text>
    );
  };
  
  // Get the currently focused tab for background color
  const [focusedTab, setFocusedTab] = React.useState(
    selectedTabs.length > 0 ? selectedTabs[0] : 'daily'
  );
  const activeColorKey = focusedTab;
  
  // If no tabs are selected, show at least the daily tab
  const tabsToShow = selectedTabs.length > 0 ? selectedTabs : ['daily'];
  
  // Convert tab IDs to route names
  const routesToShow = tabsToShow.map(tabId => tabToRouteMap[tabId]).filter(Boolean);
  
  return (
    <Tabs
      screenOptions={({ route }) => {
        const tabId = routeToTabMap[route.name];
        
        return {
          headerShown: false,
          tabBarStyle: {
            backgroundColor: tabColors[activeColorKey].accent,
            borderTopWidth: 0,
            elevation: 8,
            height: 120,
            padding: 0,
            paddingTop: 30,
            paddingBottom: 60,
            shadowColor: tabColors[activeColorKey].dark,
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
          },
          tabBarItemStyle: {
            borderRadius: 12,
            marginHorizontal: 2,
            paddingHorizontal: 2,
            height: 80,
            alignItems: 'center',
            justifyContent: 'center',
          },
          tabBarIconStyle: {
            marginTop: 0,
            marginBottom: 0,
          },
          tabBarLabelStyle: {
            marginTop: 4,
          },
          tabBarLabelPosition: 'below-icon',
          tabBarActiveTintColor: tabId ? tabColors[tabId].dark : '#000',
          tabBarInactiveTintColor: tabId ? tabColors[tabId].dark : '#000',
          tabBarIcon: ({ focused, size }) => (
            <TabIcon route={route.name} size={size} focused={focused} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel route={route.name} focused={focused} />
          ),
          // Hide tabs that aren't in the selectedTabs array
          tabBarButton: routesToShow.includes(route.name) ? undefined : () => null,
        };
      }}
    >
      {/* Include all possible tab screens but hide them using tabBarButton */}
      <Tabs.Screen 
        name="index"
        listeners={{
          focus: () => setFocusedTab('daily'),
        }}
      />
      <Tabs.Screen 
        name="goals"
        listeners={{
          focus: () => setFocusedTab('future'),
        }}
      />
      <Tabs.Screen 
        name="weekly"
        listeners={{
          focus: () => setFocusedTab('calendar'),
        }}
      />
      <Tabs.Screen 
        name="meal-prep"
        listeners={{
          focus: () => setFocusedTab('meals'),
        }}
      />
      <Tabs.Screen 
        name="cleaning"
        listeners={{
          focus: () => setFocusedTab('cleaning'),
        }}
      />
      <Tabs.Screen 
        name="self-care"
        listeners={{
          focus: () => setFocusedTab('selfCare'),
        }}
      />
      <Tabs.Screen 
        name="delegation"
        listeners={{
          focus: () => setFocusedTab('delegate'),
        }}
      />
    </Tabs>
  );
}