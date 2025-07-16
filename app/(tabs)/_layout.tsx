import React, { useState, useMemo } from 'react';
import { Tabs } from 'expo-router';
import { CalendarDays, Calendar, ChefHat, Sparkles, Target, Heart, Users } from 'lucide-react-native';
import { View, Text, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useTabContext } from '@/contexts/TabContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { LucideIcon } from 'lucide-react-native';

const routeToColorMap: Record<string, string> = {
  'index': 'daily',
  'goals': 'future',
  'weekly': 'calendar',
  'meal-prep': 'meals',
  'cleaning': 'cleaning',
  'self-care': 'selfCare',
  'delegation': 'delegate'
};

const tabConfig: Record<string, {
  name: string;
  title: string;
  icon: LucideIcon;
  colorKey: string;
}> = {
  'index': { name: 'index', title: 'Daily', icon: CalendarDays, colorKey: 'daily' },
  'goals': { name: 'goals', title: 'Future', icon: Target, colorKey: 'future' },
  'weekly': { name: 'weekly', title: 'Calendar', icon: Calendar, colorKey: 'calendar' },
  'meal-prep': { name: 'meal-prep', title: 'Meals', icon: ChefHat, colorKey: 'meals' },
  'cleaning': { name: 'cleaning', title: 'Cleaning', icon: Sparkles, colorKey: 'cleaning' },
  'self-care': { name: 'self-care', title: 'Self-Care', icon: Heart, colorKey: 'selfCare' },
  'delegation': { name: 'delegation', title: 'Delegate', icon: Users, colorKey: 'delegate' }
};

const allTabIds = Object.keys(tabConfig);
const screenWidth = Dimensions.get('window').width;

interface TabItemProps {
  route: any;
  isFocused: boolean;
  navigation: any;
  tabColors: any;
  selectedTabsSet: Set<string>;
  visibleRoutes: any[];
}

const TabItem: React.FC<TabItemProps> = ({ 
  route, 
  isFocused, 
  navigation, 
  tabColors, 
  selectedTabsSet, 
  visibleRoutes 
}) => {
  const [animatedScale] = useState(new Animated.Value(isFocused ? 1.8 : 1));
  
  if (!selectedTabsSet.has(route.name)) return null;
  
  const colorKey = routeToColorMap[route.name];
  const tabColor = tabColors[colorKey]?.pastel || '#FFFFFF';
  const Icon = tabConfig[route.name]?.icon;
  
  const onPress = () => {
    if (!isFocused) {
      Animated.spring(animatedScale, {
        toValue: 1.8,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
      navigation.navigate(route.name);
    }
  };
  
  React.useEffect(() => {
    Animated.spring(animatedScale, {
      toValue: isFocused ? 1.8 : 1,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, [isFocused]);
  
  const tabWidth = visibleRoutes.length <= 4 ? screenWidth / visibleRoutes.length : 80;
  
  const animatedTranslateY = animatedScale.interpolate({
    inputRange: [1, 1.8],
    outputRange: [0, 10],
    extrapolate: 'clamp',
  });
  
  const animatedShadowOpacity = animatedScale.interpolate({
    inputRange: [1, 1.8],
    outputRange: [0, 0.8],
    extrapolate: 'clamp',
  });
  
  const animatedLabelOpacity = animatedScale.interpolate({
    inputRange: [1, 1.8],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        width: tabWidth,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center', height: 70, width: '100%', paddingBottom: 10 }}>
        <Animated.View style={{
          height: 70,
          alignItems: 'center',
          justifyContent: 'flex-start',
          transform: [{ translateY: animatedTranslateY }],
        }}>
          <Animated.View style={{
            height: 40,
            width: 40,
            transform: [{ scale: animatedScale }],
            shadowColor: tabColors[colorKey]?.shadow || 'rgba(0,0,0,0.5)',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: animatedShadowOpacity,
            shadowRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {Icon && <Icon size={30} color={tabColor} />}
          </Animated.View>
          
          <Animated.View style={{
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: animatedLabelOpacity,
            marginTop: 4,
          }}>
            <Text style={{
              color: tabColor,
              fontFamily: 'Quicksand-SemiBold',
              fontSize: 12,
              textAlign: 'center',
            }} numberOfLines={1}>
              {tabConfig[route.name]?.title}
            </Text>
          </Animated.View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { selectedTabs } = useTabContext();
  const { currentTheme } = useTheme();
  const tabColors = currentTheme.tabColors;
  
  const selectedTabsSet = useMemo(() => new Set(selectedTabs), [selectedTabs]);
  const visibleRoutes = useMemo(() => 
    state.routes.filter((route: any) => selectedTabsSet.has(route.name)),
    [state.routes, selectedTabsSet]
  );
  
  const activeRouteName = state.routes[state.index].name;
  const activeColorKey = routeToColorMap[activeRouteName];
  const backgroundColor = tabColors[activeColorKey]?.dark || '#000000';
  const shadowColor = tabColors[activeColorKey]?.shadow || 'rgba(0,0,0,0.5)';
  
  return (
    <View style={{
      backgroundColor,
      height: 120,
      shadowColor,
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
    }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          minWidth: screenWidth,
          ...(visibleRoutes.length <= 4 && {
            justifyContent: 'space-evenly',
            width: screenWidth,
          }),
        }}
        scrollEventThrottle={16}
        decelerationRate="normal"
      >
        {state.routes.map((route: any, index: number) => (
          <TabItem
            key={route.key}
            route={route}
            isFocused={state.index === index}
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
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {allTabIds.map((tabId) => {
        const config = tabConfig[tabId];
        return (
          <Tabs.Screen
            key={tabId}
            name={config.name}
            options={{ title: config.title }}
          />
        );
      })}
    </Tabs>
  );
}