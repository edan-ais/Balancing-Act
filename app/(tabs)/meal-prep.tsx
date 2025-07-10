import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, ChefHat, Coffee, Sandwich, Utensils, Apple } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NeumorphicCard from '@/components/NeumorphicCard';
import TaskItem from '@/components/TaskItem';
import AddTaskForm from '@/components/AddTaskForm';
import { useTaskManager } from '@/hooks/useTaskManager';
import { tabColors } from './_layout';

export default function MealPrep() {
  const [showAddForm, setShowAddForm] = useState(false);
  const taskManager = useTaskManager();
  const colors = tabColors.meals;
  const orangeColor = '#ED8936'; // Orange color for all icons

  const mealTasks = taskManager.tasks.filter(task => task.category === 'meal-prep');

  const handleAddTask = (newTask: any) => {
    taskManager.addTask({ ...newTask, category: 'meal-prep' });
  };

  const mealCategories = [
    { 
      title: 'Breakfast', 
      subtitle: 'Morning energy boost',
      icon: Coffee,
      tasks: mealTasks.filter(t => t.title.toLowerCase().includes('breakfast')) 
    },
    { 
      title: 'Lunch', 
      subtitle: 'Midday nourishment',
      icon: Sandwich,
      tasks: mealTasks.filter(t => t.title.toLowerCase().includes('lunch')) 
    },
    { 
      title: 'Dinner', 
      subtitle: 'Evening satisfaction',
      icon: Utensils,
      tasks: mealTasks.filter(t => t.title.toLowerCase().includes('dinner')) 
    },
    { 
      title: 'Snacks', 
      subtitle: 'Healthy between-meals',
      icon: Apple,
      tasks: mealTasks.filter(t => t.title.toLowerCase().includes('snack')) 
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.dark }]}>Meal Prep</Text>
          <Text style={styles.subtitle}>Plan and prepare your meals</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.accent }]}>
            <ChefHat size={20} color={orangeColor} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {mealCategories.map((category, index) => (
          <NeumorphicCard key={index} style={[styles.categoryCard, { 
            shadowColor: colors.pastel,
            borderColor: colors.accent,
            borderWidth: 1 
          }]}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryInfo}>
                <View style={styles.categoryTitleRow}>
                  <category.icon size={20} color={orangeColor} />
                  <View style={styles.categoryTextContainer}>
                    <Text style={[styles.categoryTitle, { color: colors.dark }]}>{category.title}</Text>
                    <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.categoryCount, { backgroundColor: colors.accent, color: colors.dark }]}>
                {category.tasks.length} items
              </Text>
            </View>
            
            {category.tasks.length === 0 ? (
              <View style={styles.emptyCategory}>
                <Text style={[styles.emptyCategoryText, { color: colors.pastel }]}>
                  No {category.title.toLowerCase()} tasks yet
                </Text>
              </View>
            ) : (
              category.tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={taskManager.toggleTask}
                  onDelete={taskManager.deleteTask}
                  onHabitIncrement={taskManager.incrementHabit}
                />
              ))
            )}
          </NeumorphicCard>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.addButton, { 
          backgroundColor: colors.dark,
          shadowColor: colors.dark 
        }]}
        onPress={() => setShowAddForm(true)}
      >
        <Plus size={24} color="#ffffff" />
      </TouchableOpacity>

      <AddTaskForm
        visible={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddTask}
        category="meal-prep"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Quicksand-Bold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
    color: '#4A5568',
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C8D0E0',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
  },
  categoryCard: {
    margin: 12,
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTextContainer: {
    marginLeft: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
  },
  categorySubtitle: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    color: '#4A5568',
    marginTop: 2,
  },
  categoryCount: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyCategory: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyCategoryText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    fontStyle: 'italic',
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});