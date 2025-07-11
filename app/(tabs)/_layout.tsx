import React from 'react';
import { Tabs } from 'expo-router';
import { CalendarDays, Calendar, ChefHat, Sparkles, Target, Heart, Users } from 'lucide-react-native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTabContext } from '@/contexts/TabContext';
import { usePathname, useRouter } from 'expo-router';

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

// Custom tab bar component
function CustomTabBar() {
  const { selectedTabs } = useTabContext();
  const pathname = usePathname();
  const router = useRouter();
  
  // Extract the current tab name from the pathname
  const currentTab = pathname.split('/').pop() || 'index';
  const colorKey = routeToColorMap[currentTab];
  
  // Filter tabs to only show selected ones with valid configurations
  const validSelectedTabs = selectedTabs.filter(tabId => tabConfig[tabId]);
  
  return (
    <View style={[styles.tabBar, { backgroundColor: tabColors[colorKey].accent }]}>
      {validSelectedTabs.map((tabId) => {
        const config = tabConfig[tabId];
        if (!config) return null;
        
        const Icon = config.icon;
        const isActive = currentTab === config.name;
        const tabColorKey = routeToColorMap[config.name];
        
        return (
          <TouchableOpacity
            key={tabId}
            style={[styles.tabItem, { flex: 1 }]}
            onPress={() => {
              router.replace(`/(tabs)/${config.name === 'index' ? '' : config.name}`);
            }}
          >
            <View style={[
              styles.iconContainer,
              isActive && { 
                transform: [{ scale: 1.8 }],
                shadowColor: tabColors[tabColorKey].dark,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 10,
                marginTop: 8,
              }
            ]}>
              <Icon 
                size={24} 
                color={tabColors[tabColorKey].dark} 
              />
            </View>
            {!isActive && (
              <Text style={[
                styles.tabLabel,
                { color: tabColors[tabColorKey].dark }
              ]}>
                {config.title}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Main tab layout component
export default function TabLayout() {
  // We still need to render all possible tab screens for navigation to work,
  // but we'll hide the default tab bar and replace it with our custom one
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          // Hide the default tab bar
          tabBarStyle: { 
            display: 'none' 
          },
        }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="goals" />
        <Tabs.Screen name="weekly" />
        <Tabs.Screen name="meal-prep" />
        <Tabs.Screen name="cleaning" />
        <Tabs.Screen name="self-care" />
        <Tabs.Screen name="delegation" />
      </Tabs>
      
      {/* Our custom tab bar appears outside the Tabs component */}
      <CustomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 120,
    paddingTop: 30,
    paddingBottom: 60,
    borderTopWidth: 0,
    elevation: 8,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: 'Quicksand-SemiBold',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  }
});