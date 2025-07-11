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
    colorKey: 'daily'
  },
  'goals': {
    name: 'goals',
    title: 'Future',
    icon: Target,
    colorKey: 'future'
  },
  'weekly': {
    name: 'weekly',
    title: 'Calendar',
    icon: Calendar,
    colorKey: 'calendar'
  },
  'meal-prep': {
    name: 'meal-prep',
    title: 'Meals',
    icon: ChefHat,
    colorKey: 'meals'
  },
  'cleaning': {
    name: 'cleaning',
    title: 'Cleaning',
    icon: Sparkles,
    colorKey: 'cleaning'
  },
  'self-care': {
    name: 'self-care',
    title: 'Self-Care',
    icon: Heart,
    colorKey: 'selfCare'
  },
  'delegation': {
    name: 'delegation',
    title: 'Delegate',
    icon: Users,
    colorKey: 'delegate'
  }
};

export default function TabLayout() {
  const { selectedTabs } = useTabContext();
  
  // Custom tab icon component to ensure proper re-rendering
  const TabIcon = ({ name, size, iconComponent: Icon, focused }) => {
    // If Icon is not defined, return an empty placeholder with same dimensions
    if (!Icon) {
      return <View style={{ width: size, height: size }} />;
    }
    
    // Make sure we have a valid name and color key
    if (!name || !routeToColorMap[name]) {
      return <View style={{ width: size, height: size }} />;
    }
    
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
    // If no valid name or color key, return empty component with same height
    if (!name || !routeToColorMap[name]) {
      return <View style={{ height: 14 }} />;
    }
    
    const colorKey = routeToColorMap[name];
    
    if (focused) return null;
    
    const config = tabConfig[name];
    if (!config) return <View style={{ height: 14 }} />;
    
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
  
  // Get the currently focused tab for background color
  const [focusedTab, setFocusedTab] = React.useState(selectedTabs[0] || 'index');
  const activeColorKey = routeToColorMap[focusedTab] || 'daily'; // Fallback to daily if not found
  
  // Calculate available tab width based on the number of selected tabs
  const availableWidth = `${100 / selectedTabs.length}%`;
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabColors[activeColorKey].accent,
          borderTopWidth: 0,
          elevation: 8,
          height: 120, // Taller footer
          // Remove all padding
          padding: 0,
          // Add padding to center content vertically
          paddingTop: 30, // This centers the icons vertically
          paddingBottom: 60, // This centers the icons vertically
          // Add shadow with color matching active tab
          shadowColor: tabColors[activeColorKey].dark,
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
          // Set dynamic width based on number of tabs
          width: availableWidth,
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
      
      {/* Render all selected tabs, even if their config is invalid */}
      {selectedTabs.map((tabId) => {
        const config = tabConfig[tabId];
        // Use a default config object if the tab doesn't have a valid config
        const safeConfig = config || { 
          name: tabId, 
          title: '', 
          icon: null, 
          colorKey: 'daily' // Use a default color key
        };
        
        const colorKey = safeConfig.colorKey;
        
        return (
          <Tabs.Screen
            key={tabId}
            name={safeConfig.name}
            options={{
              title: safeConfig.title || '',
              tabBarActiveTintColor: tabColors[colorKey]?.dark || '#000000',
              tabBarInactiveTintColor: tabColors[colorKey]?.dark || '#000000',
              tabBarIcon: ({ size, focused }) => {
                return <TabIcon 
                  name={safeConfig.name} 
                  size={size} 
                  iconComponent={safeConfig.icon} 
                  focused={focused} 
                />;
              },
              tabBarLabel: ({ focused }) => <TabLabel name={safeConfig.name} focused={focused} />,
              // Make the tab button non-interactive if it doesn't have a valid config
              tabBarButton: !config ? () => <View style={{ width: availableWidth }} /> : undefined,
            }}
            listeners={{
              focus: () => {
                if (config) {
                  setFocusedTab(config.name);
                }
              },
            }}
          />
        );
      })}
    </Tabs>
  );
}