import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Check, X, ChevronUp, ChevronDown } from 'lucide-react-native';
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
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  isFirst?: boolean;
  isLast?: boolean;
  accentColor?: string; // Optional color override
  borderColor?: string; // Optional border color override
  habitColor?: string; // Optional habit color override
}

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onHabitIncrement,
  onSubtaskToggle,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  accentColor,
  borderColor,
  habitColor
}: TaskItemProps) {
  const [scaleAnim] = useState(new Animated.Value(1));

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
      case 'daily': return '#2B6CB0';
      case 'goals': return '#276749'; // Using the color from emergency icon
      case 'weekly': return '#9F7AEA';
      case 'meal-prep': return '#ED8936';
      case 'cleaning': return '#4299E1';
      case 'self-care': return '#F56565';
      case 'delegation': return '#38B2AC';
      default: return '#2B6CB0';
    }
  };

  // If override colors are provided, use them, otherwise use the category colors
  const taskColor = borderColor || getTabColor(task.category);
  const taskAccentColor = accentColor || taskColor;
  const taskHabitColor = habitColor || taskColor;
  
  // Get a lighter version of the color for borders
  const getLightBorderColor = (color: string) => {
    // Make the border color more subtle by adding transparency
    return color + '40'; // Adding 40 for 25% opacity
  };
  
  // Get a lighter background color for habits based on the task category
  const getHabitBackgroundColor = (category: string) => {
    switch(category) {
      case 'daily': return '#E6F0FA'; // Light blue for daily tasks
      case 'goals': return '#E3F5EC'; // Light green for goals
      case 'weekly': return '#F3F0FF'; // Light purple for weekly
      default: return '#F7FAFC'; // Default light color
    }
  };

  const handleToggle = () => {
    // Celebration animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
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
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
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
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <NeumorphicCard style={[
        styles.taskCard,
        task.isHabit && [styles.habitCard, { backgroundColor: getHabitBackgroundColor(task.category) }],
        { 
          borderColor: getLightBorderColor(taskColor),
          borderWidth: 1,
          // Add left border accent for habits
          ...(task.isHabit && {
            borderLeftWidth: 4,
            borderLeftColor: taskColor
          })
        }
      ]}>
        <View style={styles.taskHeader}>
          <TouchableOpacity
            onPress={task.isHabit ? handleHabitIncrement : handleToggle}
            style={[
              styles.checkbox,
              task.completed && styles.checkedBox,
              task.isHabit && styles.habitBox,
              { backgroundColor: task.completed ? taskAccentColor : '#E2E8F0' },
            ]}
          >
            {task.completed ? (
              <Check size={16} color="#ffffff" />
            ) : (
              task.isHabit && task.habitCount !== undefined && (
                <Text style={[
                  styles.habitCount,
                  { color: task.completed ? '#ffffff' : taskHabitColor }
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
                      backgroundColor: taskHabitColor
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
                          { backgroundColor: taskAccentColor }
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
            <View style={styles.orderButtons}>
              <TouchableOpacity
                onPress={() => onMoveUp && onMoveUp(task.id)}
                style={[styles.orderButton, isFirst && styles.disabledButton]}
                disabled={isFirst}
              >
                <ChevronUp size={16} color={isFirst ? '#CBD5E0' : '#718096'} />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => onMoveDown && onMoveDown(task.id)}
                style={[styles.orderButton, isLast && styles.disabledButton]}
                disabled={isLast}
              >
                <ChevronDown size={16} color={isLast ? '#CBD5E0' : '#718096'} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              onPress={() => onDelete(task.id)}
              style={styles.deleteIconButton}
            >
              <X size={18} color="#FC8181" />
            </TouchableOpacity>
          </View>
        </View>
      </NeumorphicCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    margin: 4,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  habitCard: {
    // Base habit card - specific background colors are set dynamically
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
  orderButtons: {
    flexDirection: 'column',
    marginRight: 8,
  },
  orderButton: {
    padding: 4,
    marginVertical: 2,
  },
  disabledButton: {
    opacity: 0.5,
  },
  deleteIconButton: {
    padding: 4,
  },
});