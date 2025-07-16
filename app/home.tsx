import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CalendarDays, Calendar, ChefHat, Sparkles, Target, Heart, Users, ArrowRight, Palette, Coffee, Cloud, CloudRain, User, LogOut, Leaf } from 'lucide-react-native';
import NeumorphicCard from '@/components/NeumorphicCard';
import AuthModal from '@/components/AuthModal';
import { useTabContext } from '@/contexts/TabContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

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
    subtitle: 'Organize your tasks over time',
    icon: Calendar,
    themeKey: 'calendar'
  },
  {
    id: 'meal-prep',
    title: 'Meal Prep',
    subtitle: 'Plan your meals and snacks',
    icon: ChefHat,
    themeKey: 'meals'
  },
  {
    id: 'cleaning',
    title: 'Cleaning',
    subtitle: 'Keep all your spaces tidy',
    icon: Sparkles,
    themeKey: 'cleaning'
  },
  {
    id: 'self-care',
    title: 'Self-Care',
    subtitle: 'Nurture yourself to feel refreshed',
    icon: Heart,
    themeKey: 'selfCare'
  },
  {
    id: 'delegation',
    title: 'Delegation',
    subtitle: 'Share the load with loved ones',
    icon: Users,
    themeKey: 'delegate'
  }
];

// Helper function to get theme icon component
const getThemeIconComponent = (themeId: string) => {
  switch (themeId) {
    case 'balance':
      return Palette;
    case 'latte':
      return Coffee;
    case 'rainstorm':
      return CloudRain;
    case 'autumn':
      return Leaf;
    default:
      return Palette;
  }
};

export default function HomeScreen() {
  const { selectedTabs, setSelectedTabs } = useTabContext();
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const { user, signOut, loading } = useAuth();
  const [localSelectedTabs, setLocalSelectedTabs] = useState<string[]>(selectedTabs);
  const [showAuthModal, setShowAuthModal] = useState(false);
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
        <Text style={[styles.title, { color: primaryColors.veryDark }]}>Balancing Act</Text>
        <Text style={[styles.subtitle, { color: primaryColors.dark }]}>
          Choose which areas of life you want to focus on
        </Text>
      </View>
      
      <View style={styles.authSection}>
        {user ? (
          <TouchableOpacity
            style={[styles.authButton, { backgroundColor: primaryColors.medium }]}
            onPress={signOut}
          >
            <Text style={[styles.userEmail, { color: primaryColors.pastel }]} numberOfLines={1}>
              {user.email}
            </Text>
            <LogOut size={18} color={primaryColors.pastel} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.authButton, { backgroundColor: primaryColors.dark }]}
            onPress={() => setShowAuthModal(true)}
          >
            <User size={18} color={primaryColors.pastel} />
            <Text style={[styles.authButtonText, { color: primaryColors.pastel }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme Selector */}
        <View style={styles.themeSelector}>
          <Text style={[styles.themeSelectorTitle, { color: primaryColors.veryDark }]}>App Theme</Text>
          {availableThemes.map((theme) => {
            const isSelected = currentTheme.id === theme.id;
            const themeColors = theme.tabColors.daily;
            const ThemeIconComponent = getThemeIconComponent(theme.id);
            
            return (
              <TouchableOpacity
                key={theme.id}
                onPress={() => setTheme(theme.id)}
                style={styles.themeOptionContainer}
              >
                <NeumorphicCard style={[
                  styles.themeOption,
                  {
                    backgroundColor: isSelected ? themeColors.bgAlt : primaryColors.bgAlt,
                    borderColor: isSelected ? themeColors.dark : 'transparent',
                    borderWidth: isSelected ? 2 : 0,
                    shadowColor: isSelected ? themeColors.shadow : primaryColors.shadow
                  }
                ]}>
                  <View style={[
                    styles.themeIconContainer,
                    { backgroundColor: isSelected ? themeColors.dark : primaryColors.medium }
                  ]}>
                    <ThemeIconComponent size={22} color={isSelected ? themeColors.pastel : primaryColors.pastel} />
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
        
        <Text style={[styles.sectionTitle, { color: primaryColors.veryDark }]}>Life Areas</Text>
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
                    backgroundColor: isSelected ? tabColors.bgAlt : primaryColors.bgAlt,
                    borderColor: isSelected ? tabColors.dark : 'transparent',
                    borderWidth: isSelected ? 2 : 0,
                    shadowColor: isSelected ? tabColors.shadow : primaryColors.shadow
                  }
                ]}>
                  <View style={[
                    styles.iconContainer,
                    { backgroundColor: isSelected ? tabColors.dark : primaryColors.medium }
                  ]}>
                    <IconComponent 
                      size={24} 
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

      <AuthModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        colors={primaryColors}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Medium',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  authSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    minWidth: 120,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    marginRight: 8,
    maxWidth: 180,
  },
  authButtonText: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    marginLeft: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  themeSelector: {
    marginVertical: 12,
    paddingHorizontal: 6,
  },
  themeOptionContainer: {
    marginBottom: 10,
  },
  themeSelectorTitle: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 10,
    paddingLeft: 6,
  },
  themeOption: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 12,
  },
  themeIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  themeTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
  },
  themeSelectedIndicator: {
    position: 'absolute',
    top: '50%',
    right: 14,
    marginTop: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeSelectedText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    marginTop: 8,
    marginBottom: 10,
    paddingLeft: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  tabOptionContainer: {
    width: '48%',
    marginBottom: 12,
  },
  tabOption: {
    padding: 14,
    alignItems: 'center',
    minHeight: 136,
    position: 'relative',
    borderRadius: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  tabTitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  tabSubtitle: {
    fontSize: 13,
    fontFamily: 'Quicksand-Medium',
    textAlign: 'center',
    lineHeight: 18,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
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
    margin: 16,
    padding: 16,
    borderRadius: 14,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  continueText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    marginRight: 8,
  },
});