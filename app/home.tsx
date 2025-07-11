import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CalendarDays, Calendar, ChefHat, Sparkles, Target, Heart, Users, ArrowRight, Palette } from 'lucide-react-native';
import NeumorphicCard from '@/components/NeumorphicCard';
import { useTabContext } from '@/contexts/TabContext';

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
  const [localSelectedTabs, setLocalSelectedTabs] = useState<string[]>(selectedTabs);
  const router = useRouter();

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Balancing Act</Text>
        <Text style={styles.subtitle}>Choose which areas of life you want to focus on</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme Selector */}
        <View style={styles.themeSelector}>
          <Text style={styles.themeSelectorTitle}>App Theme</Text>
          <NeumorphicCard style={styles.themeOption}>
            <View style={styles.themeIconContainer}>
              <Palette size={20} color="#4055C5" />
            </View>
            <Text style={styles.themeTitle}>Balance Theme</Text>
            <View style={styles.themeSelectedIndicator}>
              <Text style={styles.themeSelectedText}>✓</Text>
            </View>
          </NeumorphicCard>
        </View>
        
        <Text style={styles.sectionTitle}>Life Areas</Text>
        <View style={styles.grid}>
          {tabOptions.map((tab) => {
            const isSelected = localSelectedTabs.includes(tab.id);
            const IconComponent = tab.icon;
            
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => toggleTab(tab.id)}
                style={styles.tabOptionContainer}
              >
                <NeumorphicCard style={[
                  styles.tabOption,
                  {
                    backgroundColor: isSelected ? tab.colors.accent : '#F5F7FA',
                    borderColor: isSelected ? tab.colors.dark : 'transparent',
                    borderWidth: isSelected ? 2 : 0,
                  }
                ]}>
                  <View style={[
                    styles.iconContainer,
                    { backgroundColor: isSelected ? tab.colors.dark : '#E2E8F0' }
                  ]}>
                    <IconComponent 
                      size={24} 
                      color={isSelected ? '#FFFFFF' : '#4A5568'} 
                    />
                  </View>
                  
                  <Text style={[
                    styles.tabTitle,
                    { color: isSelected ? tab.colors.dark : '#2D3748' }
                  ]}>
                    {tab.title}
                  </Text>
                  
                  <Text style={[
                    styles.tabSubtitle,
                    { color: isSelected ? tab.colors.dark : '#4A5568' }
                  ]}>
                    {tab.subtitle}
                  </Text>
                  
                  {isSelected && (
                    <View style={[
                      styles.selectedIndicator,
                      { backgroundColor: tab.colors.dark }
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
            backgroundColor: localSelectedTabs.length > 0 ? '#4055C5' : '#CBD5E0',
            shadowColor: localSelectedTabs.length > 0 ? '#4055C5' : '#CBD5E0'
          }
        ]}
        onPress={handleContinue}
        disabled={localSelectedTabs.length === 0}
      >
        <Text style={styles.continueText}>Continue</Text>
        <ArrowRight size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
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
    color: '#2D3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    color: '#4A5568',
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
  themeSelectorTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
    color: '#2D3748',
    marginBottom: 12,
    paddingLeft: 8,
  },
  themeOption: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F5FF',
    position: 'relative',
  },
  themeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D9E0FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  themeTitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#4055C5',
  },
  themeSelectedIndicator: {
    position: 'absolute',
    top: '50%',
    right: 16,
    marginTop: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4055C5',
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
    color: '#2D3748',
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
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
    marginRight: 8,
  },
});