import React from 'react';
import { Tabs } from 'expo-router';
import { CalendarDays, Calendar, ChefHat, Sparkles, Target, Heart, Users } from 'lucide-react-native';
import { View, Text } from 'react-native';

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

export default function TabLayout() {
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
    
    // Map route names to display labels
    const labelMap = {
      'index': 'Daily',
      'goals': 'Future',
      'weekly': 'Calendar',
      'meal-prep': 'Meals',
      'cleaning': 'Cleaning',
      'self-care': 'Self-Care',
      'delegation': 'Delegate'
    };
    
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
        {labelMap[name]}
      </Text>
    );
  };
  
  // Get the currently focused tab for background color
  const [focusedTab, setFocusedTab] = React.useState('index');
  const activeColorKey = routeToColorMap[focusedTab];
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabColors[activeColorKey].accent,
          borderTopWidth: 0,
          elevation: 8, // Added elevation for Android shadow
          height: 120, // Increased from 100 to 120 for a taller footer
          paddingBottom: 25,
          paddingTop: 5, // Reduced from 15 to 5 to move icons up
          // Add shadow for iOS
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
        },
        tabBarItemStyle: {
          borderRadius: 12,
          marginHorizontal: 2,
          paddingHorizontal: 2,
          // Ensure consistent height and positioning
          height: 65,
          paddingTop: 5, // Reduced from 10 to 5 to move icons up
          marginTop: -10, // Added negative margin to move icons up
        },
        tabBarLabelPosition: 'below-icon',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Daily',
          tabBarActiveTintColor: tabColors.daily.dark,
          tabBarInactiveTintColor: tabColors.daily.dark,
          tabBarIcon: ({ size, focused }) => {
            return <TabIcon name="index" size={size} iconComponent={CalendarDays} focused={focused} />;
          },
          tabBarLabel: ({ focused }) => <TabLabel name="index" focused={focused} />,
        }}
        listeners={{
          focus: () => setFocusedTab('index'),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Future',
          tabBarActiveTintColor: tabColors.future.dark,
          tabBarInactiveTintColor: tabColors.future.dark,
          tabBarIcon: ({ size, focused }) => {
            return <TabIcon name="goals" size={size} iconComponent={Target} focused={focused} />;
          },
          tabBarLabel: ({ focused }) => <TabLabel name="goals" focused={focused} />,
        }}
        listeners={{
          focus: () => setFocusedTab('goals'),
        }}
      />
      <Tabs.Screen
        name="weekly"
        options={{
          title: 'Calendar',
          tabBarActiveTintColor: tabColors.calendar.dark,
          tabBarInactiveTintColor: tabColors.calendar.dark,
          tabBarIcon: ({ size, focused }) => {
            return <TabIcon name="weekly" size={size} iconComponent={Calendar} focused={focused} />;
          },
          tabBarLabel: ({ focused }) => <TabLabel name="weekly" focused={focused} />,
        }}
        listeners={{
          focus: () => setFocusedTab('weekly'),
        }}
      />
      <Tabs.Screen
        name="meal-prep"
        options={{
          title: 'Meals',
          tabBarActiveTintColor: tabColors.meals.dark,
          tabBarInactiveTintColor: tabColors.meals.dark,
          tabBarIcon: ({ size, focused }) => {
            return <TabIcon name="meal-prep" size={size} iconComponent={ChefHat} focused={focused} />;
          },
          tabBarLabel: ({ focused }) => <TabLabel name="meal-prep" focused={focused} />,
        }}
        listeners={{
          focus: () => setFocusedTab('meal-prep'),
        }}
      />
      <Tabs.Screen
        name="cleaning"
        options={{
          title: 'Cleaning',
          tabBarActiveTintColor: tabColors.cleaning.dark,
          tabBarInactiveTintColor: tabColors.cleaning.dark,
          tabBarIcon: ({ size, focused }) => {
            return <TabIcon name="cleaning" size={size} iconComponent={Sparkles} focused={focused} />;
          },
          tabBarLabel: ({ focused }) => <TabLabel name="cleaning" focused={focused} />,
        }}
        listeners={{
          focus: () => setFocusedTab('cleaning'),
        }}
      />
      <Tabs.Screen
        name="self-care"
        options={{
          title: 'Self-Care',
          tabBarActiveTintColor: tabColors.selfCare.dark,
          tabBarInactiveTintColor: tabColors.selfCare.dark,
          tabBarIcon: ({ size, focused }) => {
            return <TabIcon name="self-care" size={size} iconComponent={Heart} focused={focused} />;
          },
          tabBarLabel: ({ focused }) => <TabLabel name="self-care" focused={focused} />,
        }}
        listeners={{
          focus: () => setFocusedTab('self-care'),
        }}
      />
      <Tabs.Screen
        name="delegation"
        options={{
          title: 'Delegate',
          tabBarActiveTintColor: tabColors.delegate.dark,
          tabBarInactiveTintColor: tabColors.delegate.dark,
          tabBarIcon: ({ size, focused }) => {
            return <TabIcon name="delegation" size={size} iconComponent={Users} focused={focused} />;
          },
          tabBarLabel: ({ focused }) => <TabLabel name="delegation" focused={focused} />,
        }}
        listeners={{
          focus: () => setFocusedTab('delegation'),
        }}
      />
    </Tabs>
  );
}