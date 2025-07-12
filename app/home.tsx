import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CalendarDays, Calendar, ChefHat, Sparkles, Target, Heart, Users, ArrowRight, Palette } from 'lucide-react-native';
import NeumorphicCard from '@/components/NeumorphicCard';
import { useTabContext } from '@/contexts/TabContext';
import { useTheme } from '@/contexts/ThemeContext';

const tabOptions = [
  {
    id: 'index',
    title: 'Daily Tasks',
    subtitle: 'Manage your daily routines and habits',
    icon: CalendarDays,
    colors: {
      dark: '#4055C5',
      pastel: '#B9C5FA',
      bg: '#F2F5FF',
      accent: '#D9E0FC'
    }
  },
  {
    id: 'goals',
    title: 'Future Tasks',
    subtitle: 'Plan your long-term goals and projects',
    icon: Target,
    colors: {
      dark: '#2A9958',
      pastel: '#A9E6C0',
      bg: '#F2FFF7',
      accent: '#C9F2D9'
    }
  },
  {
    id: 'weekly',
    title: 'Calendar',
    subtitle: 'Schedule and organize your time',
    icon: Calendar,
    colors: {
      dark: '#7E55D4',
      pastel: '#D6C5F5',
      bg: '#F8F5FF',
      accent: '#E8DDFA'
    }
  },
  {
    id: 'meal-prep',
    title: 'Meal Prep',
    subtitle: 'Plan and prepare your meals',
    icon: ChefHat,
    colors: {
      dark: '#DC6B15',
      pastel: '#F8D0B0',
      bg: '#FFF8F2',
      accent: '#FBE2CE'
    }
  },
  {
    id: 'cleaning',
    title: 'Cleaning',
    subtitle: 'Maintain your space regularly',
    icon: Sparkles,
    colors: {
      dark: '#2578C8',
      pastel: '#B2DAFD',
      bg: '#F2F8FF',
      accent: '#D4E8FE'
    }
  },
  {
    id: 'self-care',
    title: 'Self-Care',
    subtitle: 'Nurture yourself daily',
    icon: Heart,
    colors: {
      dark: '#D83A3A',
      pastel: '#FCBFBF',
      bg: '#FFF5F5',
      accent: '#FBD8D8'
    }
  },
  {
    id: 'delegation',
    title: 'Delegation',
    subtitle: 'Share the load with others',
    icon: Users,
    colors: {
      dark: '#258F8A',
      pastel: '#A9E3E0',
      bg: '#F2FFFE',
      accent: '#C9F0EE'
    }
  }
];

export default function HomeScreen() {
  const { selectedTabs, setSelectedTabs } = useTabContext();
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [localSelectedTabs, setLocalSelectedTabs] = useState<string[]>(selectedTabs);
  const router = useRouter();

  // Get the primary colors from the current theme
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
        <Text style={[styles.subtitle, { color: primaryColors.medium }]}>
          Choose which areas of life you want to focus on
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme Selector */}
        <View style={styles.themeSelector}>
          <Text style={[styles.themeSelectorTitle, { color: primaryColors.dark }]}>App Theme</Text>
          {availableThemes.map((theme) => {
            const themeColors = theme.tabColors.daily;
            const isSelected = currentTheme.id === theme.id;
            
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
                    shadowColor: primaryColors.shadow
                  }
                ]}>
                  <View style={[
                    styles.themeIconContainer,
                    { backgroundColor: isSelected ? themeColors.dark : primaryColors.pastel }
                  ]}>
                    <Palette size={20} color={isSelected ? '#FFFFFF' : primaryColors.medium} />
                  </View>
                  <Text style={[
                    styles.themeTitle,
                    { color: isSelected ? themeColors.dark : primaryColors.dark }
                  ]}>
                    {theme.name}
                  </Text>
                  {isSelected && (
                    <View style={[
                      styles.themeSelectedIndicator,
                      { backgroundColor: themeColors.dark }
                    ]}>
                      <Text style={styles.themeSelectedText}>✓</Text>
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
            const tabColors = currentTheme.tabColors[tab.id === 'index' ? 'daily' : tab.id] || tab.colors;
            
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
                    shadowColor: primaryColors.shadow
                  }
                ]}>
                  <View style={[
                    styles.iconContainer,
                    { backgroundColor: isSelected ? tabColors.dark : primaryColors.pastel }
                  ]}>
                    <IconComponent 
                      size={24} 
                      color={isSelected ? '#FFFFFF' : primaryColors.medium} 
                    />
                  </View>
                  
                  <Text style={[
                    styles.tabTitle,
                    { color: isSelected ? tabColors.dark : primaryColors.dark }
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
                      <Text style={styles.selectedText}>✓</Text>
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
            shadowColor: primaryColors.shadow
          }
        ]}
        onPress={handleContinue}
        disabled={localSelectedTabs.length === 0}
      >
        <Text style={[
          styles.continueText, 
          { color: localSelectedTabs.length > 0 ? '#FFFFFF' : primaryColors.medium }
        ]}>
          Continue
        </Text>
        <ArrowRight 
          size={20} 
          color={localSelectedTabs.length > 0 ? '#FFFFFF' : primaryColors.medium} 
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
    color: '#FFFFFF',
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
    color: '#FFFFFF',
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