import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, Home, Sun, RefreshCw, Moon, CloudSnow } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import NeumorphicCard from '@/components/NeumorphicCard';
import TaskItem from '@/components/TaskItem';
import AddTaskForm from '@/components/AddTaskForm';
import EditTaskForm from '@/components/EditTaskForm';
import { useTaskManager } from '@/hooks/useTaskManager';
import { useTheme } from '@/contexts/ThemeContext';

export default function RepetitiveCleaning() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const taskManager = useTaskManager();
  const router = useRouter();
  const { currentTheme } = useTheme();
  const colors = currentTheme.tabColors.cleaning;

  const cleaningTasks = taskManager.tasks.filter(task => task.category === 'cleaning');

  const handleAddTask = (newTask: any) => {
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
  
  const cleaningSchedule = [
    { 
      title: 'Daily', 
      frequency: 'daily',
      frequencyDisplay: 'Every day', 
      tasks: cleaningTasks.filter(t => t.frequency === 'daily'),
      icon: Sun
    },
    { 
      title: 'Weekly', 
      frequency: 'weekly',
      frequencyDisplay: 'Every week', 
      tasks: cleaningTasks.filter(t => t.frequency === 'weekly'),
      icon: RefreshCw
    },
    { 
      title: 'Monthly', 
      frequency: 'monthly',
      frequencyDisplay: 'Every month', 
      tasks: cleaningTasks.filter(t => t.frequency === 'monthly'),
      icon: Moon
    },
    { 
      title: 'Seasonal', 
      frequency: 'seasonal',
      frequencyDisplay: 'Every season', 
      tasks: cleaningTasks.filter(t => t.frequency === 'seasonal'),
      icon: CloudSnow
    },
  ];

  // Group tasks by cleaning location within each frequency
  const getTasksGroupedByLocation = (tasks) => {
    const locationGroups = {};
    
    tasks.forEach(task => {
      const locationKey = task.cleaningLocation || 'other';
      if (!locationGroups[locationKey]) {
        locationGroups[locationKey] = [];
      }
      locationGroups[locationKey].push(task);
    });
    
    return Object.entries(locationGroups).map(([location, locationTasks]) => ({
      location,
      tasks: locationTasks,
    }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.dark }]}>Cleaning Tasks</Text>
          <Text style={[styles.subtitle, { color: colors.medium }]}>
            Maintain your space regularly
          </Text>
        </View>
        <View style={styles.headerActions}>
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
        {cleaningSchedule.map((schedule, index) => (
          <NeumorphicCard 
            key={index} 
            style={[styles.scheduleCard, { 
              shadowColor: colors.shadow,
              borderColor: colors.accent,
              borderWidth: 1 
            }]}
          >
            <View style={styles.scheduleHeader}>
              <View style={styles.scheduleTitleRow}>
                <schedule.icon size={20} color={colors.accent} />
                <View>
                  <Text style={[styles.scheduleTitle, { color: colors.dark }]}>
                    {schedule.title}
                  </Text>
                  <Text style={[styles.scheduleFrequency, { color: colors.medium }]}>
                    {schedule.frequencyDisplay}
                  </Text>
                </View>
              </View>
              <View style={[styles.scheduleCountContainer, { backgroundColor: colors.accent }]}>
                <Text style={[styles.scheduleCount, { color: colors.pastel }]}>
                  {schedule.tasks.length} tasks
                </Text>
              </View>
            </View>
            
            {schedule.tasks.length === 0 ? (
              <View style={styles.emptySchedule}>
                <Text style={[styles.emptyScheduleText, { color: colors.medium }]}>
                  No {schedule.title.toLowerCase()} cleaning tasks
                </Text>
              </View>
            ) : (
              getTasksGroupedByLocation(schedule.tasks).map((locationGroup, locationIndex) => (
                <View key={locationIndex} style={styles.locationGroup}>
                  {locationGroup.tasks.map((task, taskIndex) => {
                    // Get all tasks with the same frequency
                    const sameFrequencyTasks = cleaningTasks.filter(t => 
                      t.frequency === schedule.frequency
                    );
                    
                    // Find position of this task in the frequency group
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
                  })}
                </View>
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
        category="cleaning"
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
    marginTop: 2,
    marginLeft: 8,
  },
  scheduleCountContainer: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  scheduleCount: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
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
  locationGroup: {
    marginBottom: 8,
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