import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  runOnJS 
} from 'react-native-reanimated';
import NeumorphicCard from '@/components/NeumorphicCard';
import TaskItem from '@/components/TaskItem';
import AddTaskForm from '@/components/AddTaskForm';
import EmergencyOverride from '@/components/EmergencyOverride';
import { useTaskManager } from '@/hooks/useTaskManager';
import { tabColors } from './_layout';

export default function DailyTasks() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEmergencyOverride, setShowEmergencyOverride] = useState(false);
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const taskManager = useTaskManager();
  const colors = tabColors.daily;
  
  const scrollViewRef = useRef(null);
  const taskPositions = useRef({}).current;
  const scrollOffset = useSharedValue(0);

  const dailyTasks = taskManager.tasks.filter(task => task.category === 'daily');
  const completedTasks = dailyTasks.filter(task => task.completed);
  const pendingTasks = dailyTasks.filter(task => !task.completed);

  const handleAddTask = (newTask) => {
    taskManager.addTask({ ...newTask, category: 'daily' });
  };

  const handleEmergencyOverride = () => {
    taskManager.emergencyOverride();
    setShowEmergencyOverride(false);
  };

  const onScroll = (event) => {
    scrollOffset.value = event.nativeEvent.contentOffset.y;
  };

  const handleMoveStart = (taskId) => {
    setDraggingTaskId(taskId);
  };

  const reorderTasks = (taskId, toY) => {
    // Find the task section (pending or completed)
    const isCompleted = completedTasks.some(task => task.id === taskId);
    const tasksToReorder = isCompleted ? completedTasks : pendingTasks;
    
    // Find the task index
    const taskIndex = tasksToReorder.findIndex(task => task.id === taskId);
    
    // Find target position
    let targetIndex = taskIndex;
    for (let i = 0; i < tasksToReorder.length; i++) {
      const taskPosition = taskPositions[tasksToReorder[i].id];
      if (taskPosition && 
          toY > taskPosition.y && 
          toY < taskPosition.y + taskPosition.height &&
          i !== taskIndex) {
        targetIndex = i;
        break;
      }
    }
    
    if (targetIndex !== taskIndex) {
      taskManager.reorderTasks(taskId, targetIndex, isCompleted ? 'completed' : 'pending');
    }
  };
  
  const registerTaskPosition = (id, layout) => {
    taskPositions[id] = {
      y: layout.y,
      height: layout.height
    };
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.dark }]}>Daily Tasks</Text>
          <Text style={styles.subtitle}>
            {completedTasks.length}/{dailyTasks.length} completed
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.emergencyButton, { backgroundColor: colors.accent }]}
            onPress={() => setShowEmergencyOverride(true)}
          >
            <AlertTriangle size={20} color={colors.dark} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {dailyTasks.length === 0 ? (
          <NeumorphicCard style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No tasks for today</Text>
            <Text style={styles.emptySubtitle}>
              Start by adding a task or habit to get organized
            </Text>
          </NeumorphicCard>
        ) : (
          <>
            {pendingTasks.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pending</Text>
                {pendingTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={taskManager.toggleTask}
                    onDelete={taskManager.deleteTask}
                    onHabitIncrement={taskManager.incrementHabit}
                    onSubtaskToggle={taskManager.toggleSubtask}
                    onMoveStart={() => handleMoveStart(task.id)}
                    isDragging={draggingTaskId === task.id}
                    onLayout={(layout) => registerTaskPosition(task.id, layout)}
                    onDragEnd={(position) => {
                      reorderTasks(task.id, position.y + scrollOffset.value);
                      setDraggingTaskId(null);
                    }}
                  />
                ))}
              </View>
            )}

            {completedTasks.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Completed</Text>
                {completedTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={taskManager.toggleTask}
                    onDelete={taskManager.deleteTask}
                    onHabitIncrement={taskManager.incrementHabit}
                    onSubtaskToggle={taskManager.toggleSubtask}
                    onMoveStart={() => handleMoveStart(task.id)}
                    isDragging={draggingTaskId === task.id}
                    onLayout={(layout) => registerTaskPosition(task.id, layout)}
                    onDragEnd={(position) => {
                      reorderTasks(task.id, position.y + scrollOffset.value);
                      setDraggingTaskId(null);
                    }}
                  />
                ))}
              </View>
            )}
          </>
        )}
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
        category="daily"
      />

      <EmergencyOverride
        visible={showEmergencyOverride}
        onClose={() => setShowEmergencyOverride(false)}
        onConfirm={handleEmergencyOverride}
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
    gap: 12,
  },
  emergencyButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C8D0E0',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#4A5568',
    marginLeft: 12,
    marginBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    margin: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
    color: '#2D3748',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    color: '#4A5568',
    textAlign: 'center',
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