import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, Chrome as Home, Sun, RefreshCw, Moon, CloudSnow } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import NeumorphicCard from '@/components/NeumorphicCard';
import TaskItem from '@/components/TaskItem';
import AddTaskForm from '@/components/AddTaskForm';
import { useTaskManager } from '@/hooks/useTaskManager';
import { tabColors } from './_layout'; // Import from tab layout

export default function RepetitiveCleaning() {
  const [showAddForm, setShowAddForm] = useState(false);
  const taskManager = useTaskManager();
  const router = useRouter();
  const colors = tabColors.cleaning;
  const blueColor = '#4299E1'; // Blue color for all icons

  const cleaningTasks = taskManager.tasks.filter(task => task.category === 'cleaning');

  const handleAddTask = (newTask: any) => {
    taskManager.addTask({ ...newTask, category: 'cleaning' });
  };

  const cleaningSchedule = [
    { 
      title: 'Daily', 
      frequency: 'Every day', 
      tasks: cleaningTasks.filter(t => t.title.toLowerCase().includes('daily')),
      icon: Sun
    },
    { 
      title: 'Weekly', 
      frequency: 'Every week', 
      tasks: cleaningTasks.filter(t => t.title.toLowerCase().includes('weekly')),
      icon: RefreshCw
    },
    { 
      title: 'Monthly', 
      frequency: 'Every month', 
      tasks: cleaningTasks.filter(t => t.title.toLowerCase().includes('monthly')),
      icon: Moon
    },
    { 
      title: 'Seasonal', 
      frequency: 'Every season', 
      tasks: cleaningTasks.filter(t => t.title.toLowerCase().includes('seasonal')),
      icon: CloudSnow
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.dark }]}>Cleaning Tasks</Text>
          <Text style={styles.subtitle}>Maintain your space regularly</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/')}
          >
            <Home size={20} color={colors.dark} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {cleaningSchedule.map((schedule, index) => (
          <NeumorphicCard 
            key={index} 
            style={[styles.scheduleCard, { 
              shadowColor: colors.pastel,
              borderColor: colors.accent,
              borderWidth: 1 
            }]}
          >
            <View style={styles.scheduleHeader}>
              <View style={styles.scheduleTitleRow}>
                <schedule.icon size={20} color={blueColor} />
                <View>
                  <Text style={[styles.scheduleTitle, { color: colors.dark }]}>{schedule.title}</Text>
                  <Text style={styles.scheduleFrequency}>{schedule.frequency}</Text>
                </View>
              </View>
              <Text style={[styles.scheduleCount, { backgroundColor: colors.accent, color: colors.dark }]}>
                {schedule.tasks.length} tasks
              </Text>
            </View>
            
            {schedule.tasks.length === 0 ? (
              <View style={styles.emptySchedule}>
                <Text style={[styles.emptyScheduleText, { color: colors.pastel }]}>
                  No {schedule.title.toLowerCase()} cleaning tasks
                </Text>
              </View>
            ) : (
              schedule.tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={taskManager.toggleTask}
                  onDelete={taskManager.deleteTask}
                  onHabitIncrement={taskManager.incrementHabit}
                  themeColor={colors.dark}
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
        category="cleaning"
        themeColor={colors.dark}
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
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
  scheduleCard: {
    margin: 12,
    marginBottom: 8,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
    marginLeft: 8,
  },
  scheduleFrequency: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    color: '#4A5568',
    marginTop: 2,
    marginLeft: 8,
  },
  scheduleCount: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptySchedule: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyScheduleText: {
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