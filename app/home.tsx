import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CalendarDays, Calendar, ChefHat, Sparkles, Target, Heart, Users, ArrowRight, Palette } from 'lucide-react-native';
import NeumorphicCard from '@/components/NeumorphicCard';
import { useTabContext } from '@/contexts/TabContext';
import { useTheme } from '@/contexts/ThemeContext';

// Mapping between tab IDs and theme color keys
const tabToThemeKeyMap = {
  'index': 'daily',
  'goals': 'future',    // "goals" tab uses "future" theme colors
  'weekly': 'calendar', // "weekly" tab uses "calendar" theme colors
  'meal-prep': 'meals',
  'cleaning': 'cleaning',
  'self-care': 'selfCare',
  'delegation': 'delegate'
};

const tabOptions = [
  {
    id: 'index',
    title: 'Daily Tasks',
    subtitle: 'Manage your daily routines and habits',
    icon: CalendarDays,
    themeKey: 'daily'
  },
  {
    id: 'goals',
    title: 'Future Tasks',
    subtitle: 'Plan your long-term goals and projects',
    icon: Target,
    themeKey: 'future'  // This corresponds to 'future' in the theme
  },
  {
    id: 'weekly',
    title: 'Calendar',
    subtitle: 'Schedule and organize your time',
    icon: Calendar,
    themeKey: 'calendar'  // This corresponds to 'calendar' in the theme
  },
  {
    id: 'meal-prep',
    title: 'Meal Prep',
    subtitle: 'Plan and prepare your meals',
    icon: ChefHat,
    themeKey: 'meals'
  },
  {
    id: 'cleaning',
    title: 'Cleaning',
    subtitle: 'Maintain your space regularly',
    icon: Sparkles,
    themeKey: 'cleaning'
  },
  {
    id: 'self-care',
    title: 'Self-Care',
    subtitle: 'Nurture yourself daily',
    icon: Heart,
    themeKey: 'selfCare'
  },
  {
    id: 'delegation',
    title: 'Delegation',
    subtitle: 'Share the load with others',
    icon: Users,
    themeKey: 'delegate'
  }
];

export default function HomeScreen() {
  const { selectedTabs, setSelectedTabs } = useTabContext();
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [localSelectedTabs, setLocalSelectedTabs] = useState<string[]>(selectedTabs);
  const router = useRouter();

  // Helper function to get tab colors from the theme
  const getTabThemeColors = (tab) => {
    // Get the appropriate theme key for this tab
    const themeKey = tab.themeKey;
    
    // Get colors from the theme
    return currentTheme.tabColors[themeKey];
  };

  // Use primary colors from the current theme
  const primaryColors = currentTheme.tabColors.daily;

  const toggleTab = (tabId: string) => {
    if (localSelectedTabs.includes(tabId)) {
      // Don't allow removing all tabs
      if (localSelectedTabs.length > 1) {
        setLocalSelectedTabs(localSelectedTabs.filter(id => id !== tabId));
      }
    } else {
      setLocalSelectedTabs([...localSelectedTabs, tabId]);
    }
  };

  const handleContinue = () => {
    // Update the global selected tabs
    setSelectedTabs(localSelectedTabs);
    
    // Navigate to the first selected tab
    const firstTab = localSelectedTabs[0] || 'index';
    router.replace(`/(tabs)/${firstTab === 'index' ? '' : firstTab}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: primaryColors.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: primaryColors.medium }]}>Balancing Act</Text>
        <Text style={[styles.subtitle, { color: primaryColors.medium }]}>
          Choose which areas of life you want to focus on
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme Selector */}
        <View style={styles.themeSelector}>
          <Text style={[styles.themeSelectorTitle, { color: primaryColors.medium }]}>App Theme</Text>
          {availableThemes.map((theme) => {
            const isSelected = currentTheme.id === theme.id;
            const themeColors = theme.tabColors.daily;
            
            return (
              <TouchableOpacity
                key={theme.id}
                onPress={() => setTheme(theme.id)}
                style={styles.themeOptionContainer}
              >
                <NeumorphicCard style={[
                  styles.themeOption,
                  {
                    backgroundColor: isSelected ? themeColors.accent : primaryColors.bg,
                    borderColor: isSelected ? themeColors.dark : 'transparent',
                    borderWidth: isSelected ? 2 : 0,
                    shadowColor: themeColors.shadow || themeColors.dark
                  }
                ]}>
                  <View style={[
                    styles.themeIconContainer,
                    { backgroundColor: isSelected ? themeColors.dark : primaryColors.pastel }
                  ]}>
                    <Palette size={20} color={isSelected ? themeColors.pastel : primaryColors.medium} />
                  </View>
                  <Text style={[
                    styles.themeTitle,
                    { color: isSelected ? themeColors.medium : primaryColors.medium }
                  ]}>
                    {theme.name}
                  </Text>
                  {isSelected && (
                    <View style={[
                      styles.themeSelectedIndicator,
                      { backgroundColor: themeColors.dark }
                    ]}>
                      <Text style={[styles.themeSelectedText, { color: themeColors.pastel }]}>✓</Text>
                    </View>
                  )}
                </NeumorphicCard>
              </TouchableOpacity>
            );
          })}
        </View>
        
        <Text style={[styles.sectionTitle, { color: primaryColors.medium }]}>Life Areas</Text>
        <View style={styles.grid}>
          {tabOptions.map((tab) => {
            const isSelected = localSelectedTabs.includes(tab.id);
            const IconComponent = tab.icon;
            
            // Get the appropriate colors for this tab from the current theme
            const tabColors = getTabThemeColors(tab);
            
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => toggleTab(tab.id)}
                style={styles.tabOptionContainer}
              >
                <NeumorphicCard style={[
                  styles.tabOption,
                  {
                    backgroundColor: isSelected ? tabColors.accent : primaryColors.bg,
                    borderColor: isSelected ? tabColors.dark : 'transparent',
                    borderWidth: isSelected ? 2 : 0,
                    shadowColor: tabColors.shadow || tabColors.dark
                  }
                ]}>
                  <View style={[
                    styles.iconContainer,
                    { backgroundColor: isSelected ? tabColors.dark : primaryColors.pastel }
                  ]}>
                    <IconComponent 
                      size={24} 
                      color={isSelected ? tabColors.pastel : primaryColors.medium} 
                    />
                  </View>
                  
                  <Text style={[
                    styles.tabTitle,
                    { color: isSelected ? tabColors.medium : primaryColors.medium }
                  ]}>
                    {tab.title}
                  </Text>
                  
                  <Text style={[
                    styles.tabSubtitle,
                    { color: isSelected ? tabColors.medium : primaryColors.medium }
                  ]}>
                    {tab.subtitle}
                  </Text>
                  
                  {isSelected && (
                    <View style={[
                      styles.selectedIndicator,
                      { backgroundColor: tabColors.dark }
                    ]}>
                      <Text style={[styles.selectedText, { color: tabColors.pastel }]}>✓</Text>
                    </View>
                  )}
                </NeumorphicCard>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.continueButton,
          { 
            backgroundColor: localSelectedTabs.length > 0 ? primaryColors.dark : primaryColors.pastel,
            shadowColor: primaryColors.shadow || primaryColors.dark
          }
        ]}
        onPress={handleContinue}
        disabled={localSelectedTabs.length === 0}
      >
        <Text style={[
          styles.continueText, 
          { color: localSelectedTabs.length > 0 ? primaryColors.pastel : primaryColors.medium }
        ]}>
          Continue
        </Text>
        <ArrowRight 
          size={20} 
          color={localSelectedTabs.length > 0 ? primaryColors.pastel : primaryColors.medium} 
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
  },
  themeSelector: {
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  themeOptionContainer: {
    marginBottom: 8,
  },
  themeSelectorTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
    marginBottom: 12,
    paddingLeft: 8,
  },
  themeOption: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  themeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  themeTitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
  },
  themeSelectedIndicator: {
    position: 'absolute',
    top: '50%',
    right: 16,
    marginTop: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeSelectedText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
    marginTop: 8,
    marginBottom: 12,
    paddingLeft: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  tabOptionContainer: {
    width: '48%',
    marginBottom: 16,
  },
  tabOption: {
    padding: 16,
    alignItems: 'center',
    minHeight: 140,
    position: 'relative',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  tabTitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    textAlign: 'center',
    marginBottom: 4,
  },
  tabSubtitle: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Bold',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueText: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
    marginRight: 8,
  },
});