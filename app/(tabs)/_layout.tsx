import React from 'react';
import { useRef, useEffect, useMemo } from 'react';
import { Tabs } from 'expo-router';
import { CalendarDays, Calendar, ChefHat, Sparkles, Target, Heart, Users } from 'lucide-react-native';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
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

// Custom TabBar component to enable horizontal scrolling
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { selectedTabs } = useTabContext();
  const { currentTheme } = useTheme();
  const tabColors = currentTheme.tabColors;
  
  // Create animated values for each tab
  const animatedValues = useRef(
    state.routes.reduce((acc, route) => {
      acc[route.key] = new Animated.Value(1);
      return acc;
    }, {})
  ).current;
  
  // Get active route name for background color
  const activeRouteName = state.routes[state.index].name;
  const activeColorKey = routeToColorMap[activeRouteName];
  
  // Safely access colors with fallbacks
  const backgroundColor = tabColors[activeColorKey]?.dark || '#000000';
  const shadowColor = tabColors[activeColorKey]?.shadow || 'rgba(0,0,0,0.5)';
  
  // Filter to show only selected tabs
  const selectedTabsSet = new Set(selectedTabs);
  const visibleRoutes = state.routes.filter(route => selectedTabsSet.has(route.name));
  
  return (
    <View style={{
      backgroundColor: backgroundColor,
      height: 120, // Keep the original height
      shadowColor: shadowColor,
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
    }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          // When there are few tabs, they should expand to fill the space
          minWidth: '100%',
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || options.title || route.name;
          const isFocused = state.index === index;
          const isVisible = selectedTabsSet.has(route.name);
          
          // Animate when focus changes
          useEffect(() => {
            Animated.spring(animatedValues[route.key], {
              toValue: isFocused ? 1.8 : 1,
              useNativeDriver: true,
              tension: 100,
              friction: 8,
            }).start();
          }, [isFocused, route.key]);
          
          // Create interpolated values for smooth animations
          const animatedScale = animatedValues[route.key];
          
          const animatedTranslateY = useMemo(() => 
            animatedScale.interpolate({
              inputRange: [1, 1.8],
              outputRange: [0, -5],
              extrapolate: 'clamp',
            }), [animatedScale]
          );
          
          const animatedShadowOpacity = useMemo(() => 
            animatedScale.interpolate({
              inputRange: [1, 1.8],
              outputRange: [0, 0.8],
              extrapolate: 'clamp',
            }), [animatedScale]
          );
          
          const animatedShadowRadius = useMemo(() => 
            animatedScale.interpolate({
              inputRange: [1, 1.8],
              outputRange: [0, 10],
              extrapolate: 'clamp',
            }), [animatedScale]
          );
          
          const animatedLabelOpacity = useMemo(() => 
            animatedScale.interpolate({
              inputRange: [1, 1.8],
              outputRange: [1, 0],
              extrapolate: 'clamp',
            }), [animatedScale]
          );
          
          const animatedLabelTranslateY = useMemo(() => 
            animatedScale.interpolate({
              inputRange: [1, 1.8],
              outputRange: [0, 5],
              extrapolate: 'clamp',
            }), [animatedScale]
          );
          
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
              navigation.navigate(route.name);
            }
          };
          
          // Calculate width based on number of visible tabs
          // When few tabs, expand to fill space; otherwise use fixed width
          const tabWidth = visibleRoutes.length <= 4 
            ? `${100 / visibleRoutes.length}%` 
            : 80; // Keep tabs closer together
          
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
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 2, // Reduced padding to keep icons closer
              }}
            >
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
              }}>
                <Animated.View style={{
                  transform: [
                    { scale: animatedScale },
                    { translateY: animatedTranslateY }
                  ],
                  shadowColor: tabColors[colorKey]?.shadow || 'rgba(0,0,0,0.5)',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: animatedShadowOpacity,
                  shadowRadius: animatedShadowRadius,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {Icon && <Icon size={30} color={tabColor} />}
                </Animated.View>
                
                {/* Animated label that fades out when focused */}
                <Animated.Text
                  style={{
                    opacity: animatedLabelOpacity,
                    transform: [{ translateY: animatedLabelTranslateY }],
                    color: tabColor,
                    fontFamily: 'Quicksand-SemiBold',
                    fontSize: 12,
                    marginTop: 4,
                    textAlign: 'center',
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {tabConfig[route.name]?.title || label}
                </Animated.Text>
              </View>
            </TouchableOpacity>
          );
        })}
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
                    style={{
                      color: tabColor,
                      fontFamily: 'Quicksand-SemiBold',
                      fontSize: 12, // Larger than original but not too large
                      marginTop: 4,
                      textAlign: 'center',
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {tabConfig[route.name]?.title || label}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
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