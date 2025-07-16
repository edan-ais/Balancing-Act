import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, Coffee, Sandwich, Utensils, Apple, Chrome as Home } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import NeumorphicCard from '@/components/NeumorphicCard';
import TaskItem, { Task } from '@/components/TaskItem';
import AddTaskForm from '@/components/AddTaskForm';
import EditTaskForm from '@/components/EditTaskForm';
import { useTaskManager } from '@/hooks/useTaskManager';
import { useTheme } from '@/contexts/ThemeContext';

const MEAL_CATEGORIES = [
  { title: 'Breakfast', subtitle: 'Morning energy boost', icon: Coffee, type: 'breakfast' },
  { title: 'Lunch', subtitle: 'Midday nourishment', icon: Sandwich, type: 'lunch' },
  { title: 'Dinner', subtitle: 'Evening satisfaction', icon: Utensils, type: 'dinner' },
  { title: 'Snacks', subtitle: 'Healthy between-meals', icon: Apple, type: 'snack' },
];

export default function MealPrep() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const taskManager = useTaskManager();
  const router = useRouter();
  const { currentTheme } = useTheme();
  const colors = currentTheme.tabColors.meals;

  const mealTasks = taskManager.tasks.filter(task => task.category === 'meal-prep');

  const handleAddTask = (newTask: Partial<Task>) => {
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

  const renderMealCategory = (category: typeof MEAL_CATEGORIES[0], index: number) => {
    const tasks = mealTasks.filter(t => t.mealType === category.type);
    const Icon = category.icon;
    
    return (
      <NeumorphicCard key={index} style={[styles.categoryCard, { 
        shadowColor: colors.shadow,
        borderColor: colors.medium,
        borderWidth: 1,
        backgroundColor: colors.bgAlt
      }]}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryInfo}>
            <Icon size={22} color={colors.dark} />
            <View style={styles.categoryTextContainer}>
              <Text style={[styles.categoryTitle, { color: colors.veryDark }]}>
                {category.title}
              </Text>
              <Text style={[styles.categorySubtitle, { color: colors.dark }]}>
                {category.subtitle}
              </Text>
            </View>
          </View>
          <View style={[styles.categoryCountContainer, { backgroundColor: colors.dark }]}>
            <Text style={[styles.categoryCount, { color: colors.pastel }]}>
              {tasks.length} items
            </Text>
          </View>
        </View>
        
        {tasks.length === 0 ? (
          <View style={styles.emptyCategory}>
            <Text style={[styles.emptyCategoryText, { color: colors.dark }]}>
              No {category.title.toLowerCase()} tasks yet
            </Text>
          </View>
        ) : (
          tasks.map((task, taskIndex) => (
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
              isLast={taskIndex === tasks.length - 1}
              colors={colors}
            />
          ))
        )}
      </NeumorphicCard>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.title, { color: colors.veryDark }]}>Meal Prep</Text>
          <Text style={[styles.subtitle, { color: colors.dark }]}>
            Plan and prepare your meals
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.dark, shadowColor: colors.shadow }]}
          onPress={() => router.push('/home')}
        >
          <Home size={22} color={colors.pastel} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {MEAL_CATEGORIES.map(renderMealCategory)}
      </ScrollView>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.dark, shadowColor: colors.shadow }]}
        onPress={() => setShowAddForm(true)}
      >
        <Plus size={24} color={colors.pastel} />
      </TouchableOpacity>

      <AddTaskForm
        visible={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddTask}
        category="meal-prep"
        colors={colors}
      />

      <EditTaskForm
        visible={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleUpdateTask}
        initialTask={taskToEdit}
        colors={colors}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  headerTitleContainer: { flex: 1, paddingRight: 8 },
  title: { fontSize: 26, fontFamily: 'Quicksand-Bold', marginBottom: 2 },
  subtitle: { fontSize: 16, fontFamily: 'Quicksand-Medium', marginTop: 2 },
  actionButton: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 4 },
  content: { flex: 1, paddingHorizontal: 10, marginTop: 6 },
  categoryCard: { margin: 10, marginBottom: 10, padding: 12, borderRadius: 16 },
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  categoryTextContainer: { marginLeft: 10 },
  categoryTitle: { fontSize: 18, fontFamily: 'Quicksand-Bold' },
  categorySubtitle: { fontSize: 14, fontFamily: 'Quicksand-Medium', marginTop: 2 },
  categoryCountContainer: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  categoryCount: { fontSize: 13, fontFamily: 'Quicksand-SemiBold' },
  emptyCategory: { alignItems: 'center', paddingVertical: 16 },
  emptyCategoryText: { fontSize: 16, fontFamily: 'Quicksand-Medium', fontStyle: 'italic' },
  addButton: { position: 'absolute', bottom: 16, right: 16, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 6 },
});