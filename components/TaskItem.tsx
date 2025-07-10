import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated as RNAnimated } from 'react-native';
import { Check, X, GripVertical } from 'lucide-react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import NeumorphicCard from './NeumorphicCard';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  isHabit?: boolean;
  habitCount?: number;
  habitGoal?: number;
  priority?: 'high' | 'medium' | 'low' | 'quick-win';
  isDelegated?: boolean;
  delegatedTo?: string;
  subtasks?: { id: string; title: string; completed: boolean }[];
  category: string;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onHabitIncrement?: (id: string) => void;
  onSubtaskToggle?: (taskId: string, subtaskId: string) => void;
  onMoveStart?: () => void;
  isDragging?: boolean;
  onLayout?: (layout: { x: number; y: number; width: number; height: number }) => void;
  onDragEnd?: (position: { y: number }) => void;
}

export default function TaskItem({ 
  task, 
  onToggle, 
  onDelete, 
  onHabitIncrement, 
  onSubtaskToggle,
  onMoveStart,
  isDragging,
  onLayout,
  onDragEnd
}: TaskItemProps) {
  const [scaleAnim] = useState(new RNAnimated.Value(1));
  
  // Gesture handler setup
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const zIndex = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  // Handle the drag gesture
  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startY = translateY.value;
      runOnJS(onMoveStart)();
      scale.value = withSpring(1.03);
      zIndex.value = 100;
    },
    onActive: (event, context) => {
      translateY.value = context.startY + event.translationY;
      translateX.value = event.translationX;
    },
    onEnd: () => {
      if (onDragEnd) {
        runOnJS(onDragEnd)({ y: translateY.value });
      }
      
      // Reset position with animation
      translateY.value = withSpring(0);
      translateX.value = withSpring(0);
      scale.value = withSpring(1);
      
      // Delay resetting z-index until animation completes
      setTimeout(() => {
        zIndex.value = 1;
      }, 300);
    },
  });
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
        { scale: scale.value }
      ],
      zIndex: zIndex.value,
      elevation: isDragging ? 8 : 1,
      shadowOpacity: isDragging ? 0.3 : 0.1,
      shadowRadius: isDragging ? 10 : 3,
    };
  });

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return '#FC8181';
      case 'medium': return '#F6AD55';
      case 'low': return '#68D391';
      case 'quick-win': return '#F6AD55';
      default: return '#A0AEC0';
    }
  };

  const getTabColor = (category: string) => {
    switch (category) {
      case 'daily': return '#2B6CB0'; // Changed to dark blue for habits
      case 'goals': return '#48BB78';
      case 'weekly': return '#9F7AEA';
      case 'meal-prep': return '#ED8936';
      case 'cleaning': return '#4299E1';
      case 'self-care': return '#F56565';
      case 'delegation': return '#38B2AC';
      default: return '#2B6CB0';
    }
  };
  
  const handleToggle = () => {
    // Celebration animation
    RNAnimated.sequence([
      RNAnimated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      RNAnimated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle(task.id);
  };

  const handleHabitIncrement = () => {
    if (onHabitIncrement) {
      // Special habit animation
      RNAnimated.sequence([
        RNAnimated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        RNAnimated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      onHabitIncrement(task.id);
    }
  };

  const handleSubtaskToggle = (subtaskId: string) => {
    if (onSubtaskToggle) {
      onSubtaskToggle(task.id, subtaskId);
    }
  };

  // Calculate habit progress percentage
  const habitProgress = task.isHabit && task.habitCount && task.habitGoal 
    ? (task.habitCount / task.habitGoal) * 100 
    : 0;

  return (
    <Animated.View 
      style={[styles.taskContainer, animatedStyle]}
      onLayout={(event) => onLayout && onLayout(event.nativeEvent.layout)}
    >
      <RNAnimated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
        <NeumorphicCard style={[
          styles.taskCard, 
          task.isHabit && styles.habitCard,
        ]}>
          <View style={styles.taskHeader}>
            <TouchableOpacity
              onPress={task.isHabit ? handleHabitIncrement : handleToggle}
              style={[
                styles.checkbox,
                task.completed && styles.checkedBox,
                task.isHabit && styles.habitBox,
                { backgroundColor: task.completed ? getTabColor(task.category) : '#E2E8F0' },
              ]}
            >
              {task.completed ? (
                <Check size={16} color="#ffffff" />
              ) : (
                task.isHabit && task.habitCount !== undefined && (
                  <Text style={[
                    styles.habitCount,
                    { color: task.completed ? '#ffffff' : getTabColor(task.category) }
                  ]}>
                    {task.habitCount}
                  </Text>
                )
              )}
            </TouchableOpacity>

            <View style={styles.taskContent}>
              <Text style={[
                styles.taskTitle,
                task.completed && styles.completedTitle,
                task.isHabit && styles.habitTitle,
              ]}>
                {task.title}
                {task.isDelegated && <Text style={styles.delegatedBadge}> → {task.delegatedTo}</Text>}
              </Text>
              
              <View style={styles.taskMeta}>
                {task.priority && (
                  <View style={[
                    styles.priorityTag,
                    { backgroundColor: getPriorityColor(task.priority) }
                  ]}>
                    <Text style={styles.priorityText}>
                      {task.priority === 'quick-win' ? 'QUICK WIN' : task.priority.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>

              {task.isHabit && task.habitGoal && (
                <View style={styles.habitProgressContainer}>
                  <View 
                    style={[
                      styles.habitProgressBar, 
                      { 
                        width: `${habitProgress}%`,
                        backgroundColor: getTabColor(task.category)
                      }
                    ]} 
                  />
                  <Text style={styles.habitGoalText}>
                    {task.habitCount || 0}/{task.habitGoal}
                  </Text>
                </View>
              )}

              {task.subtasks && task.subtasks.length > 0 && (
                <View style={styles.subtasks}>
                  {task.subtasks.map(subtask => (
                    <TouchableOpacity 
                      key={subtask.id} 
                      style={styles.subtask}
                      onPress={() => handleSubtaskToggle(subtask.id)}
                    >
                      <View 
                        style={[
                          styles.subtaskCheckbox, 
                          subtask.completed && [
                            styles.subtaskCompleted,
                            { backgroundColor: getTabColor(task.category) }
                          ]
                        ]} 
                      >
                        {subtask.completed && <Check size={8} color="#ffffff" />}
                      </View>
                      <Text style={[styles.subtaskText, subtask.completed && styles.subtaskCompletedText]}>
                        {subtask.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.actionIcons}>
              <PanGestureHandler onGestureEvent={panGestureEvent}>
                <Animated.View>
                  <TouchableOpacity
                    style={styles.moveButton}
                  >
                    <GripVertical size={18} color="#A0AEC0" />
                  </TouchableOpacity>
                </Animated.View>
              </PanGestureHandler>
              
              <TouchableOpacity
                onPress={() => onDelete(task.id)}
                style={styles.deleteIconButton}
              >
                <X size={18} color="#FC8181" />
              </TouchableOpacity>
            </View>
          </View>
        </NeumorphicCard>
      </RNAnimated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    width: '100%',
  },
  taskCard: {
    margin: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF', // Ensuring regular tasks are white
  },
  habitCard: {
    backgroundColor: '#d9e0fc', // Changed to the requested color for habits
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#C8D0E0',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  checkedBox: {},
  habitBox: {},
  habitCount: {
    fontSize: 12,
    fontFamily: 'Quicksand-SemiBold',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#2D3748',
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#A0AEC0',
  },
  habitTitle: {
    fontStyle: 'italic',
  },
  delegatedBadge: {
    fontSize: 12,
    fontFamily: 'Quicksand-SemiBold',
    color: '#38B2AC',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  priorityText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Quicksand-SemiBold',
    textTransform: 'uppercase',
  },
  habitProgressContainer: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginVertical: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  habitProgressBar: {
    height: '100%',
    borderRadius: 4,
  },
  habitGoalText: {
    position: 'absolute',
    right: 0,
    top: -16,
    fontSize: 10,
    fontFamily: 'Quicksand-SemiBold',
    color: '#4A5568',
  },
  subtasks: {
    marginTop: 8,
    paddingLeft: 4,
  },
  subtask: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  subtaskCheckbox: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E2E8F0',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtaskCompleted: {},
  subtaskText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    color: '#4A5568',
  },
  subtaskCompletedText: {
    textDecorationLine: 'line-through',
    color: '#A0AEC0',
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moveButton: {
    padding: 4,
    marginRight: 4,
  },
  deleteIconButton: {
    padding: 4,
  },
});