import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Check, X, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import NeumorphicCard from './NeumorphicCard';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  isHabit?: boolean;
  habitCount?: number;
  location?: 'home' | 'work' | 'errands' | 'anywhere';
  priority?: 'high' | 'medium' | 'low';
  isQuickWin?: boolean;
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
}

export default function TaskItem({ task, onToggle, onDelete, onHabitIncrement }: TaskItemProps) {
  const [showActions, setShowActions] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const getLocationColor = (location?: string) => {
    switch (location) {
      case 'home': return '#68D391';
      case 'work': return '#4299E1';
      case 'errands': return '#F6AD55';
      case 'anywhere': return '#9F7AEA';
      default: return '#A0AEC0';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return '#FC8181';
      case 'medium': return '#F6AD55';
      case 'low': return '#68D391';
      default: return '#A0AEC0';
    }
  };

  const getTabColor = (category: string) => {
    switch (category) {
      case 'daily': return '#667EEA';
      case 'goals': return '#48BB78';
      case 'weekly': return '#9F7AEA';
      case 'meal-prep': return '#ED8936';
      case 'cleaning': return '#4299E1';
      case 'self-care': return '#F56565';
      case 'delegation': return '#38B2AC';
      default: return '#667EEA';
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

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <NeumorphicCard style={[styles.taskCard, task.isQuickWin && styles.quickWinCard]}>
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
            {task.completed && <Check size={16} color="#ffffff" />}
            {task.isHabit && task.habitCount && (
              <Text style={styles.habitCount}>{task.habitCount}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.taskContent}>
            <Text style={[
              styles.taskTitle,
              task.completed && styles.completedTitle,
              task.isHabit && styles.habitTitle,
              task.isQuickWin && styles.quickWinTitle,
            ]}>
              {task.title}
              {task.isQuickWin && <Text style={styles.quickWinBadge}> QUICK WIN</Text>}
              {task.isDelegated && <Text style={styles.delegatedBadge}> → {task.delegatedTo}</Text>}
            </Text>
            
            <View style={styles.taskMeta}>
              {task.location && (
                <View style={[styles.locationTag, { backgroundColor: getLocationColor(task.location) }]}>
                  <Text style={styles.locationText}>{task.location}</Text>
                </View>
              )}
              {task.priority && (
                <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(task.priority) }]} />
              )}
            </View>

            {task.subtasks && task.subtasks.length > 0 && (
              <View style={styles.subtasks}>
                {task.subtasks.map(subtask => (
                  <View key={subtask.id} style={styles.subtask}>
                    <View style={[styles.subtaskCheckbox, subtask.completed && styles.subtaskCompleted]} />
                    <Text style={[styles.subtaskText, subtask.completed && styles.subtaskCompletedText]}>
                      {subtask.title}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setShowActions(!showActions)}
            style={styles.actionButton}
          >
            <MoreHorizontal size={20} color="#A0AEC0" />
          </TouchableOpacity>
        </View>

        {showActions && (
          <View style={styles.actionMenu}>
            <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.deleteButton}>
              <X size={16} color="#FC8181" />
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </NeumorphicCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    margin: 4,
    padding: 12,
  },
  quickWinCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#F6AD55',
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
    color: '#ffffff',
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
  quickWinTitle: {
    fontFamily: 'Quicksand-Bold',
  },
  quickWinBadge: {
    fontSize: 10,
    fontFamily: 'Quicksand-Bold',
    color: '#F6AD55',
  },
  delegatedBadge: {
    fontSize: 12,
    fontFamily: 'Quicksand-SemiBold',
    color: '#38B2AC',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  locationText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Quicksand-SemiBold',
    textTransform: 'uppercase',
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  subtasks: {
    marginTop: 8,
    paddingLeft: 12,
  },
  subtask: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  subtaskCheckbox: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
    marginRight: 8,
  },
  subtaskCompleted: {
    backgroundColor: '#48BB78',
  },
  subtaskText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    color: '#4A5568',
  },
  subtaskCompletedText: {
    textDecorationLine: 'line-through',
    color: '#A0AEC0',
  },
  actionButton: {
    padding: 4,
  },
  actionMenu: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  deleteText: {
    color: '#FC8181',
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    marginLeft: 8,
  },
});