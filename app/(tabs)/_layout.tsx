import React from 'react';
import { useRef, useEffect, useMemo, useState } from 'react';
import { Tabs } from 'expo-router';
import { CalendarDays, Calendar, ChefHat, Sparkles, Target, Heart, Users } from 'lucide-react-native';
import { View, Text, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
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

// Get screen width for calculations
const screenWidth = Dimensions.get('window').width;

// Constants for layout measurements
const TAB_ITEM_HEIGHT = 70;  // Total height of tab item
const ICON_SIZE = 30;        // Size of the icon
const LABEL_HEIGHT = 16;     // Height of the label
const LABEL_MARGIN = 5;      // Margin between icon and label

// Individual Tab Item component to properly use hooks
const TabItem = ({ route, index, isFocused, descriptor, navigation, tabColors, selectedTabsSet, visibleRoutes }) => {
  const { options } = descriptor;
  const label = options.tabBarLabel || options.title || route.name;
  const isVisible = selectedTabsSet.has(route.name);
  
  // Track if this is the first render to avoid initial animation
  const [isFirstRender, setIsFirstRender] = useState(true);
  
  // Create animated value with initial value based on focus
  const animatedScale = useRef(new Animated.Value(isFocused ? 1.8 : 1)).current;

  // Update animation when focus changes, but not on first render
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    
    Animated.spring(animatedScale, {
      toValue: isFocused ? 1.8 : 1,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
      velocity: 0.1,
      delay: 0,
    }).start();
  }, [isFocused, animatedScale, isFirstRender]);
  
  // Calculate the distance the icon needs to move to be perfectly centered
  // When not focused: Icon is positioned at its default spot with label below
  // When focused: Icon should be in the middle of the entire tab item height
  
  // When not focused, the icon's center is at:
  // (ICON_SIZE / 2) from the top of the icon container
  
  // When focused, we want the icon's center to be at:
  // TAB_ITEM_HEIGHT / 2 from the top of the tab item
  
  // Calculate resting position of icon's center (from top of the tab item)
  const iconCenterY = ICON_SIZE / 2;
  
  // Calculate target position for centered icon
  const targetCenterY = TAB_ITEM_HEIGHT / 2;
  
  // The difference is how much we need to move the icon when focused
  const centeringOffset = targetCenterY - iconCenterY;
  
  // Create interpolated values for animations
  const animatedIconTranslateY = animatedScale.interpolate({
    inputRange: [1, 1.8],
    outputRange: [0, centeringOffset],
    extrapolate: 'clamp',
  });
  
  const animatedShadowOpacity = animatedScale.interpolate({
    inputRange: [1, 1.8],
    outputRange: [0, 0.8],
    extrapolate: 'clamp',
  });
  
  const animatedShadowRadius = animatedScale.interpolate({
    inputRange: [1, 1.8],
    outputRange: [0, 10],
    extrapolate: 'clamp',
  });
  
  const animatedLabelOpacity = animatedScale.interpolate({
    inputRange: [1, 1.4, 1.8], // Start fading out earlier for smoother transition
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });
  
  // If tab isn't visible, don't render it
  if (!isVisible) return null;
  
  // Get tab color key
  const colorKey = routeToColorMap[route.name];
  const tabColor = tabColors[colorKey]?.pastel || '#FFFFFF';
  
  // Handle tab press
  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    
    if (!isFocused && !event.defaultPrevented) {
      // Immediately start animation for better perceived performance
      Animated.spring(animatedScale, {
        toValue: 1.8,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
        velocity: 0.1,
      }).start();
      
      navigation.navigate(route.name);
    }
  };
  
  // Calculate width based on number of visible tabs
  const tabWidth = visibleRoutes.length <= 4 
    ? screenWidth / visibleRoutes.length 
    : 80;
  
  // Icon component
  const Icon = tabConfig[route.name]?.icon;
  
  return (
    <TouchableOpacity
      key={route.key}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      style={{
        width: tabWidth,
        height: TAB_ITEM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'flex-start', // Start from the top to position items correctly
        paddingTop: 10, // Add some padding at the top
      }}
    >
      {/* Icon container with centered positioning */}
      <Animated.View style={{
        width: 40,
        height: 40,
        transform: [
          { scale: animatedScale },
          { translateY: animatedIconTranslateY }
        ],
        shadowColor: tabColors[colorKey]?.shadow || 'rgba(0,0,0,0.5)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: animatedShadowOpacity,
        shadowRadius: animatedShadowRadius,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {Icon && <Icon size={ICON_SIZE} color={tabColor} />}
      </Animated.View>
      
      {/* Label container positioned absolutely under the icon */}
      <Animated.View style={{
        position: 'absolute',
        top: 50, // Position below the icon (40px height + 10px padding)
        opacity: animatedLabelOpacity,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: LABEL_HEIGHT,
      }}>
        <Text
          style={{
            color: tabColor,
            fontFamily: 'Quicksand-SemiBold',
            fontSize: 12,
            textAlign: 'center',
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {tabConfig[route.name]?.title || label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Custom TabBar component to enable horizontal scrolling
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { selectedTabs } = useTabContext();
  const { currentTheme } = useTheme();
  const tabColors = currentTheme.tabColors;
  
  // Cache visible routes to prevent recalculation on each render
  const selectedTabsSet = useMemo(() => new Set(selectedTabs), [selectedTabs]);
  const visibleRoutes = useMemo(() => 
    state.routes.filter(route => selectedTabsSet.has(route.name)),
    [state.routes, selectedTabsSet]
  );
  
  // Get active route name for background color
  const activeRouteName = state.routes[state.index].name;
  const activeColorKey = routeToColorMap[activeRouteName];
  
  // Safely access colors with fallbacks
  const backgroundColor = tabColors[activeColorKey]?.dark || '#000000';
  const shadowColor = tabColors[activeColorKey]?.shadow || 'rgba(0,0,0,0.5)';
  
  // Use effect to scroll to the active tab
  const scrollViewRef = useRef();
  useEffect(() => {
    if (scrollViewRef.current && state.index !== undefined) {
      // Find the position of the active tab within visible routes
      const activeRouteIndex = visibleRoutes.findIndex(
        route => route.name === state.routes[state.index].name
      );
      
      if (activeRouteIndex !== -1) {
        // Calculate scroll position based on tab width and position
        const tabWidth = visibleRoutes.length <= 4 
          ? screenWidth / visibleRoutes.length 
          : 80;
        
        const scrollX = Math.max(0, activeRouteIndex * tabWidth - (screenWidth / 2) + (tabWidth / 2));
          
        // Scroll with animation to reduce jumpiness
        scrollViewRef.current?.scrollTo({
          x: scrollX,
          animated: true
        });
      }
    }
  }, [state.index, visibleRoutes]);
  
  return (
    <View style={{
      backgroundColor: backgroundColor,
      height: 120,
      shadowColor: shadowColor,
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
      justifyContent: 'center', // Center content vertically
    }}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          // Make sure content is at least as wide as the screen
          minWidth: screenWidth,
          // Center tabs when there are few of them
          ...(visibleRoutes.length <= 4 && {
            justifyContent: 'space-evenly',
            width: screenWidth,
          }),
        }}
        scrollEventThrottle={16}
        decelerationRate="normal"
      >
        {state.routes.map((route, index) => (
          <TabItem
            key={route.key}
            route={route}
            index={index}
            isFocused={state.index === index}
            descriptor={descriptors[route.key]}
            navigation={navigation}
            tabColors={tabColors}
            selectedTabsSet={selectedTabsSet}
            visibleRoutes={visibleRoutes}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default function TabLayout() {
  const { selectedTabs } = useTabContext();
  const { currentTheme } = useTheme();
  
  // Get the currently focused tab for background color
  const [focusedTab, setFocusedTab] = React.useState(selectedTabs[0] || 'index');
  
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Render all tabs, but with visibility controlled by the CustomTabBar */}
      {allTabIds.map((tabId) => {
        const config = tabConfig[tabId];
        if (!config) return null;
        
        return (
          <Tabs.Screen
            key={tabId}
            name={config.name}
            options={{
              title: config.title,
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