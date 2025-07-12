import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, ChefHat, Coffee, Sandwich, Utensils, Apple, Home } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import NeumorphicCard from '@/components/NeumorphicCard';
import TaskItem from '@/components/TaskItem';
import AddTaskForm from '@/components/AddTaskForm';
import EditTaskForm from '@/components/EditTaskForm';
import { useTaskManager } from '@/hooks/useTaskManager';
import { useTheme } from '@/contexts/ThemeContext';

export default function MealPrep() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const taskManager = useTaskManager();
  const router = useRouter();
  const { currentTheme } = useTheme();
  const colors = currentTheme.tabColors.meals;

  const mealTasks = taskManager.tasks.filter(task => task.category === 'meal-prep');

  const handleAddTask = (newTask: any) => {
    taskManager.addTask({ ...newTask, category: 'meal-prep' });
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setShowEditForm(true);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    taskManager.updateTask(updatedTask);
    setShowEditForm(false);
    setTaskToEdit(null);
  };
  
  const mealCategories = [
    { 
      title: 'Breakfast', 
      subtitle: 'Morning energy boost',
      icon: Coffee,
      tasks: mealTasks.filter(t => t.mealType === 'breakfast') 
    },
    { 
      title: 'Lunch', 
      subtitle: 'Midday nourishment',
      icon: Sandwich,
      tasks: mealTasks.filter(t => t.mealType === 'lunch') 
    },
    { 
      title: 'Dinner', 
      subtitle: 'Evening satisfaction',
      icon: Utensils,
      tasks: mealTasks.filter(t => t.mealType === 'dinner') 
    },
    { 
      title: 'Snacks', 
      subtitle: 'Healthy between-meals',
      icon: Apple,
      tasks: mealTasks.filter(t => t.mealType === 'snack') 
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.dark }]}>Meal Prep</Text>
          <Text style={[styles.subtitle, { color: colors.medium }]}>
            Plan and prepare your meals
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={[styles.actionButton, { 
              backgroundColor: colors.accent,
              shadowColor: colors.shadow
            }]}
            onPress={() => router.push('/home')}
          >
            <Home size={20} color={colors.pastel} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {mealCategories.map((category, index) => (
          <NeumorphicCard key={index} style={[styles.categoryCard, { 
            shadowColor: colors.shadow,
            borderColor: colors.accent,
            borderWidth: 1 
          }]}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryInfo}>
                <View style={styles.categoryTitleRow}>
                  <category.icon size={20} color={colors.accent} />
                  <View style={styles.categoryTextContainer}>
                    <Text style={[styles.categoryTitle, { color: colors.dark }]}>
                      {category.title}
                    </Text>
                    <Text style={[styles.categorySubtitle, { color: colors.medium }]}>
                      {category.subtitle}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={[styles.categoryCountContainer, { backgroundColor: colors.accent }]}>
                <Text style={[styles.categoryCount, { color: colors.pastel }]}>
                  {category.tasks.length} items
                </Text>
              </View>
            </View>
            
            {category.tasks.length === 0 ? (
              <View style={styles.emptyCategory}>
                <Text style={[styles.emptyCategoryText, { color: colors.medium }]}>
                  No {category.title.toLowerCase()} tasks yet
                </Text>
              </View>
            ) : (
              category.tasks.map((task, taskIndex) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={taskManager.toggleTask}
                  onDelete={taskManager.deleteTask}
                  onEdit={handleEditTask}
                  onHabitIncrement={taskManager.incrementHabit}
                  onSubtaskToggle={taskManager.toggleSubtask}
                  onMoveUp={taskManager.moveTaskUp}
                  onMoveDown={taskManager.moveTaskDown}
                  isFirst={taskIndex === 0}
                  isLast={taskIndex === category.tasks.length - 1}
                  colors={colors}
                />
              ))
            )}
          </NeumorphicCard>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.addButton, { 
          backgroundColor: colors.dark,
          shadowColor: colors.shadow 
        }]}
        onPress={() => setShowAddForm(true)}
      >
        <Plus size={24} color={colors.pastel} />
      </TouchableOpacity>

      <AddTaskForm
        visible={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddTask}
        category="meal-prep"
        accentColor={colors.accent}
        darkColor={colors.dark}
        bgColor={colors.bg}
        mediumColor={colors.medium}
        pastelColor={colors.pastel}
        shadowColor={colors.shadow}
      />

      <EditTaskForm
        visible={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleUpdateTask}
        initialTask={taskToEdit}
        accentColor={colors.accent}
        darkColor={colors.dark}
        bgColor={colors.bg}
        mediumColor={colors.medium}
        pastelColor={colors.pastel}
        shadowColor={colors.shadow}
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
    marginTop: 2,
  },
  categoryCountContainer: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryCount: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
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
    bottom: 20,
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