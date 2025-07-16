import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, Home, Sun, RefreshCw, Moon, CloudSnow } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import NeumorphicCard from '@/components/NeumorphicCard';
import TaskItem, { Task } from '@/components/TaskItem';
import AddTaskForm from '@/components/AddTaskForm';
import EditTaskForm from '@/components/EditTaskForm';
import { useTaskManager } from '@/hooks/useTaskManager';
import { useTheme } from '@/contexts/ThemeContext';

const CLEANING_SCHEDULE = [
  { title: 'Daily', frequency: 'daily', frequencyDisplay: 'Every day', icon: Sun },
  { title: 'Weekly', frequency: 'weekly', frequencyDisplay: 'Every week', icon: RefreshCw },
  { title: 'Monthly', frequency: 'monthly', frequencyDisplay: 'Every month', icon: Moon },
  { title: 'Seasonal', frequency: 'seasonal', frequencyDisplay: 'Every season', icon: CloudSnow },
];

export default function RepetitiveCleaning() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const taskManager = useTaskManager();
  const router = useRouter();
  const { currentTheme } = useTheme();
  const colors = currentTheme.tabColors.cleaning;

  const cleaningTasks = taskManager.tasks.filter(task => task.category === 'cleaning');

  const handleAddTask = (newTask: Partial<Task>) => {
    taskManager.addTask({ ...newTask, category: 'cleaning' });
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

  const renderScheduleCategory = (schedule: typeof CLEANING_SCHEDULE[0], index: number) => {
    const tasks = cleaningTasks.filter(t => t.frequency === schedule.frequency);
    const Icon = schedule.icon;
    
    return (
      <NeumorphicCard 
        key={index} 
        style={[styles.scheduleCard, { 
          shadowColor: colors.shadow,
          borderColor: colors.medium,
          borderWidth: 1,
          backgroundColor: colors.bgAlt
        }]}
      >
        <View style={styles.scheduleHeader}>
          <View style={styles.scheduleTitleRow}>
            <Icon size={22} color={colors.dark} />
            <View style={styles.scheduleTextContainer}>
              <Text style={[styles.scheduleTitle, { color: colors.veryDark }]}>
                {schedule.title}
              </Text>
              <Text style={[styles.scheduleFrequency, { color: colors.dark }]}>
                {schedule.frequencyDisplay}
              </Text>
            </View>
          </View>
          <View style={[styles.scheduleCountContainer, { backgroundColor: colors.dark }]}>
            <Text style={[styles.scheduleCount, { color: colors.pastel }]}>
              {tasks.length} tasks
            </Text>
          </View>
        </View>
        
        {tasks.length === 0 ? (
          <View style={styles.emptySchedule}>
            <Text style={[styles.emptyScheduleText, { color: colors.dark }]}>
              No {schedule.title.toLowerCase()} cleaning tasks
            </Text>
          </View>
        ) : (
          tasks.map((task, taskIndex) => {
            const sameFrequencyTasks = cleaningTasks.filter(t => t.frequency === schedule.frequency);
            const taskPosition = sameFrequencyTasks.findIndex(t => t.id === task.id);
            
            return (
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
                isFirst={taskPosition === 0}
                isLast={taskPosition === sameFrequencyTasks.length - 1}
                colors={colors}
              />
            );
          })
        )}
      </NeumorphicCard>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.title, { color: colors.veryDark }]}>Cleaning Tasks</Text>
          <Text style={[styles.subtitle, { color: colors.dark }]}>
            Maintain your space regularly
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
        {CLEANING_SCHEDULE.map(renderScheduleCategory)}
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
        category="cleaning"
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
  scheduleCard: { margin: 10, marginBottom: 10, padding: 12, borderRadius: 16 },
  scheduleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  scheduleTitleRow: { flexDirection: 'row', alignItems: 'center' },
  scheduleTextContainer: { marginLeft: 10 },
  scheduleTitle: { fontSize: 18, fontFamily: 'Quicksand-Bold' },
  scheduleFrequency: { fontSize: 14, fontFamily: 'Quicksand-Medium', marginTop: 2 },
  scheduleCountContainer: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  scheduleCount: { fontSize: 13, fontFamily: 'Quicksand-SemiBold' },
  emptySchedule: { alignItems: 'center', paddingVertical: 16 },
  emptyScheduleText: { fontSize: 16, fontFamily: 'Quicksand-Medium', fontStyle: 'italic' },
  addButton: { position: 'absolute', bottom: 16, right: 16, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 6 },
});