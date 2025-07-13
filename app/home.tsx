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
    subtitle: 'Manage daily routines',
    icon: CalendarDays,
    themeKey: 'daily'
  },
  {
    id: 'goals',
    title: 'Future Tasks',
    subtitle: 'Plan long-term goals',
    icon: Target,
    themeKey: 'future'
  },
  {
    id: 'weekly',
    title: 'Calendar',
    subtitle: 'Organize your time',
    icon: Calendar,
    themeKey: 'calendar'
  },
  {
    id: 'meal-prep',
    title: 'Meal Prep',
    subtitle: 'Plan your meals',
    icon: ChefHat,
    themeKey: 'meals'
  },
  {
    id: 'cleaning',
    title: 'Cleaning',
    subtitle: 'Keep space tidy',
    icon: Sparkles,
    themeKey: 'cleaning'
  },
  {
    id: 'self-care',
    title: 'Self-Care',
    subtitle: 'Nurture yourself',
    icon: Heart,
    themeKey: 'selfCare'
  },
  {
    id: 'delegation',
    title: 'Delegation',
    subtitle: 'Share the load',
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
        <Text style={[styles.title, { color: primaryColors.dark }]}>Balancing Act</Text>
        <Text style={[styles.subtitle, { color: primaryColors.dark }]}>
          Choose which areas of life you want to focus on
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme Selector */}
        <View style={styles.themeSelector}>
          <Text style={[styles.themeSelectorTitle, { color: primaryColors.dark }]}>App Theme</Text>
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
                    backgroundColor: isSelected ? themeColors.medium : primaryColors.bgAlt,
                    borderColor: isSelected ? themeColors.dark : 'transparent',
                    borderWidth: isSelected ? 3 : 0,
                    shadowColor: themeColors.shadow
                  }
                ]}>
                  <View style={[
                    styles.themeIconContainer,
                    { backgroundColor: isSelected ? themeColors.dark : primaryColors.medium }
                  ]}>
                    <Palette size={20} color={isSelected ? themeColors.pastel : primaryColors.pastel} />
                  </View>
                  <Text style={[
                    styles.themeTitle,
                    { color: isSelected ? themeColors.veryDark : primaryColors.dark }
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
        
        <Text style={[styles.sectionTitle, { color: primaryColors.dark }]}>Life Areas</Text>
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
                    backgroundColor: isSelected ? tabColors.medium : primaryColors.bgAlt,
                    borderColor: isSelected ? tabColors.dark : 'transparent',
                    borderWidth: isSelected ? 3 : 0,
                    shadowColor: tabColors.shadow
                  }
                ]}>
                  <View style={[
                    styles.iconContainer,
                    { backgroundColor: isSelected ? tabColors.dark : primaryColors.medium }
                  ]}>
                    <IconComponent 
                      size={26} 
                      color={isSelected ? tabColors.pastel : primaryColors.pastel} 
                    />
                  </View>
                  
                  <Text style={[
                    styles.tabTitle,
                    { color: isSelected ? tabColors.veryDark : primaryColors.dark }
                  ]}>
                    {tab.title}
                  </Text>
                  
                  <Text style={[
                    styles.tabSubtitle,
                    { color: isSelected ? tabColors.dark : primaryColors.medium }
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
            backgroundColor: localSelectedTabs.length > 0 ? primaryColors.dark : primaryColors.medium,
            shadowColor: primaryColors.shadow
          }
        ]}
        onPress={handleContinue}
        disabled={localSelectedTabs.length === 0}
      >
        <Text style={[
          styles.continueText, 
          { color: primaryColors.pastel }
        ]}>
          Continue
        </Text>
        <ArrowRight 
          size={22} 
          color={primaryColors.pastel} 
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
    fontSize: 36,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    lineHeight: 24,
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
    marginBottom: 10,
  },
  themeSelectorTitle: {
    fontSize: 22,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 12,
    paddingLeft: 8,
  },
  themeOption: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 12,
  },
  themeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  themeTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
  },
  themeSelectedIndicator: {
    position: 'absolute',
    top: '50%',
    right: 16,
    marginTop: -12,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeSelectedText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Quicksand-Bold',
    marginTop: 10,
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
    borderRadius: 12,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  tabTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  tabSubtitle: {
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    lineHeight: 18,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 18,
    borderRadius: 14,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  continueText: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    marginRight: 10,
  },
});