import React from 'react';
import { Tabs } from 'expo-router';
import { CalendarDays, Calendar, ChefHat, Sparkles, Target, Heart, Users } from 'lucide-react-native';
import { View, Text } from 'react-native';
import { useTabContext } from '@/contexts/TabContext';
import { useTheme } from '@/contexts/ThemeContext';

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

// Get all tab IDs for rendering all possible tabs
const allTabIds = Object.keys(tabConfig);

export default function TabLayout() {
const { selectedTabs } = useTabContext();
const { currentTheme } = useTheme();
const tabColors = currentTheme.tabColors;

// Custom tab icon component to ensure proper re-rendering
const TabIcon = ({ name, size, iconComponent: Icon, focused }) => {
const colorKey = routeToColorMap[name];

// Calculate offset to keep icon visually centered when scaled
const offsetY = focused ? 8 : 0; // Adjust this value as needed

return (
  <View style={{ 
    transform: [{ scale: focused ? 1.8 : 1 }],
    shadowColor: focused ? tabColors[colorKey].shadow : 'transparent',
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

// Get the currently focused tab for background color
const [focusedTab, setFocusedTab] = React.useState(selectedTabs[0] || 'index');
const activeColorKey = routeToColorMap[focusedTab];

// Filter out any selectedTabs that don't have valid configurations
const validSelectedTabs = selectedTabs.filter(tabId => tabConfig[tabId]);

// Create a Set for quick lookups
const selectedTabsSet = new Set(validSelectedTabs);

// Function to check if a tab is selected
const isTabSelected = (tabId) => selectedTabsSet.has(tabId);

// Calculate the flex value based on the number of visible tabs
const visibleTabCount = validSelectedTabs.length;

return (
<Tabs
screenOptions={({ route }) => {
const routeName = route.name;
const isSelected = isTabSelected(routeName);
const colorKey = routeToColorMap[routeName] || activeColorKey;

return {
      headerShown: false,
      tabBarStyle: {
        backgroundColor: tabColors[activeColorKey].medium,
        borderTopWidth: 0,
        elevation: 8,
        height: 120, // Taller footer
        // Remove all padding
        padding: 0,
        // Add padding to center content vertically
        paddingTop: 30, // This centers the icons vertically
        paddingBottom: 60, // This centers the icons vertically
        // Add shadow with color matching active tab
        shadowColor: tabColors[activeColorKey].shadow,
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        // Add flexbox properties to ensure proper alignment
        display: 'flex',
        flexDirection: 'row',
      },
      tabBarItemStyle: {
        borderRadius: 12,
        marginHorizontal: 2,
        paddingHorizontal: 2,
        height: 80, // Fixed height for items
        // Center content vertically
        alignItems: 'center',
        justifyContent: 'center',
        // Important: only visible tabs should take up space
        display: isSelected ? 'flex' : 'none',
        // Make each visible tab take equal space
        flex: isSelected ? 1 : 0,
        width: isSelected ? `${100 / visibleTabCount}%` : 0,
      },
      tabBarIconStyle: {
        // Ensure icon is centered
        marginTop: 0,
        marginBottom: 0,
      },
      tabBarLabelStyle: {
        // Position label below icon
        marginTop: 4,
        color: tabColors[colorKey].medium, // Explicitly set label color here
      },
      tabBarLabelPosition: 'below-icon',
      tabBarActiveTintColor: tabColors[colorKey].dark,
      tabBarInactiveTintColor: tabColors[colorKey].medium,
      // Explicitly handle the label component to override default behavior
      tabBarLabel: ({ focused, color }) => {
        if (focused) return null;
        
        const config = tabConfig[routeName];
        if (!config) return null;
        
        return (
          <Text 
            style={{
              color: tabColors[colorKey].medium, // Use medium color for text
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
      }
    };
  }}>
  
  {/* Render all tabs, but with visibility controlled by tabBarItemStyle */}
  {allTabIds.map((tabId) => {
    const config = tabConfig[tabId];
    if (!config) return null;
    
    const colorKey = config.colorKey;
    const selected = isTabSelected(tabId);
    
    return (
      <Tabs.Screen
        key={tabId}
        name={config.name}
        options={{
          title: config.title,
          tabBarIcon: ({ size, focused }) => {
            return <TabIcon name={config.name} size={size} iconComponent={config.icon} focused={focused} />;
          },
          // No longer using the TabLabel component directly as it might not be getting called
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