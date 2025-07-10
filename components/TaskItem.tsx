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
  habitColor?: string;  // Optional habit color override
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
      case 'goals': return '#48BB78';
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
        task.isHabit && styles.habitCard,
        { borderColor: taskColor }
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  card: {
    width: '90%',
    maxWidth: 400,
    padding: 24,
    margin: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    color: '#2D3748',
    marginLeft: 12,
  },
  effects: {
    backgroundColor: '#E6FFFA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#38A169',
  },
  effectsTitle: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    color: '#2F855A',
    marginBottom: 8,
  },
  effectItem: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    color: '#276749',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: '#C8D0E0',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#4A5568',
  },
  confirmButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#276749',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#276749',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  confirmText: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#ffffff',
    marginRight: 8,
  },
});