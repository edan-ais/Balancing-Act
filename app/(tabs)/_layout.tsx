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

// Map route names to color keys
const routeToColorMap = {
  'index': 'daily',
  'goals': 'future',
  'weekly': 'calendar',
  'meal-prep': 'meals',
  'cleaning': 'cleaning',
  'self-care': 'selfCare',
  'delegation': 'delegate'
};

// Tab configuration mapping
const tabConfig = {
  'index': {
    name: 'index',
    title: 'Daily',
    icon: CalendarDays,
    colorKey: 'daily',
    tabId: 'daily'  // Add this to map to the selectedTabs values
  },
  'goals': {
    name: 'goals',
    title: 'Future',
    icon: Target,
    colorKey: 'future',
    tabId: 'future'
  },
  'weekly': {
    name: 'weekly',
    title: 'Calendar',
    icon: Calendar,
    colorKey: 'calendar',
    tabId: 'calendar'
  },
  'meal-prep': {
    name: 'meal-prep',
    title: 'Meals',
    icon: ChefHat,
    colorKey: 'meals',
    tabId: 'meals'
  },
  'cleaning': {
    name: 'cleaning',
    title: 'Cleaning',
    icon: Sparkles,
    colorKey: 'cleaning',
    tabId: 'cleaning'
  },
  'self-care': {
    name: 'self-care',
    title: 'Self-Care',
    icon: Heart,
    colorKey: 'selfCare',
    tabId: 'selfCare'
  },
  'delegation': {
    name: 'delegation',
    title: 'Delegate',
    icon: Users,
    colorKey: 'delegate',
    tabId: 'delegate'
  }
};

// Create a map of tabId to route name for quick lookup
const tabIdToRouteMap = {};
Object.entries(tabConfig).forEach(([route, config]) => {
  tabIdToRouteMap[config.tabId] = route;
});

export default function TabLayout() {
  const { selectedTabs } = useTabContext();
  
  // Custom tab icon component to ensure proper re-rendering
  const TabIcon = ({ name, size, iconComponent: Icon, focused }) => {
    const colorKey = routeToColorMap[name];
    
    // Calculate offset to keep icon visually centered when scaled
    const offsetY = focused ? 8 : 0; // Adjust this value as needed
    
    return (
      <View style={{ 
        transform: [{ scale: focused ? 1.8 : 1 }],
        shadowColor: focused ? tabColors[colorKey].dark : 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: focused ? 0.8 : 0,
        shadowRadius: focused ? 10 : 0,
        // Add alignment adjustments
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: offsetY, // Move down when focused
      }}>
        <Icon size={size} color={tabColors[colorKey].dark} />
      </View>
    );
  };
  
  // Custom tab label component with proper styling
  const TabLabel = ({ name, focused }) => {
    const colorKey = routeToColorMap[name];
    
    if (focused) return null;
    
    const config = tabConfig[name];
    if (!config) return null;
    
    return (
      <Text 
        style={{
          color: tabColors[colorKey].dark,
          fontFamily: 'Quicksand-SemiBold',
          fontSize: 10,
          marginTop: 4,
          textAlign: 'center',
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {config.title}
      </Text>
    );
  };
  
  // Default to 'daily' if no tabs are selected
  const defaultTab = 'index';
  
  // Get the currently focused tab for background color
  const [focusedTab, setFocusedTab] = React.useState(
    selectedTabs.length > 0 ? tabIdToRouteMap[selectedTabs[0]] || defaultTab : defaultTab
  );
  
  // Ensure we have a valid color key
  const activeColorKey = routeToColorMap[focusedTab] || 'daily';
  
  // Convert selectedTabs (which are tabIds) to route names using our mapping
  const selectedRoutes = selectedTabs
    .map(tabId => tabIdToRouteMap[tabId])
    .filter(Boolean); // Filter out any undefined values
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabColors[activeColorKey]?.accent || tabColors.daily.accent,
          borderTopWidth: 0,
          elevation: 8,
          height: 120, // Taller footer
          // Remove all padding
          padding: 0,
          // Add padding to center content vertically
          paddingTop: 30, // This centers the icons vertically
          paddingBottom: 60, // This centers the icons vertically
          // Add shadow with color matching active tab
          shadowColor: tabColors[activeColorKey]?.dark || tabColors.daily.dark,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
        },
        tabBarItemStyle: {
          borderRadius: 12,
          marginHorizontal: 2,
          paddingHorizontal: 2,
          height: 80, // Fixed height for items
          // Center content vertically
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarIconStyle: {
          // Ensure icon is centered
          marginTop: 0,
          marginBottom: 0,
        },
        tabBarLabelStyle: {
          // Position label below icon
          marginTop: 4,
        },
        tabBarLabelPosition: 'below-icon',
      }}>
      
      {/* Only render tabs that are in selectedRoutes */}
      {Object.entries(tabConfig).map(([route, config]) => {
        // Skip if this route is not in selectedRoutes
        if (selectedRoutes.length > 0 && !selectedRoutes.includes(route)) {
          return null;
        }
        
        const colorKey = config.colorKey;
        
        return (
          <Tabs.Screen
            key={route}
            name={config.name}
            options={{
              title: config.title,
              tabBarActiveTintColor: tabColors[colorKey].dark,
              tabBarInactiveTintColor: tabColors[colorKey].dark,
              tabBarIcon: ({ size, focused }) => {
                return <TabIcon name={config.name} size={size} iconComponent={config.icon} focused={focused} />;
              },
              tabBarLabel: ({ focused }) => <TabLabel name={config.name} focused={focused} />,
            }}
            listeners={{
              focus: () => setFocusedTab(config.name),
            }}
          />
        );
      })}
    </Tabs>
  );
}