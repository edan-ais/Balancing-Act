import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Check, X, ChevronUp, ChevronDown, Pencil } from 'lucide-react-native';
import NeumorphicCard from './NeumorphicCard';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  isHabit?: boolean;
  habitCount?: number;
  habitGoal?: number;
  priority?: 'high' | 'medium' | 'low' | 'quick-win' | 'custom';
  customPriorityText?: string;
  customPriorityColor?: string;
  isDelegated?: boolean;
  delegatedTo?: string;
  delegateType?: string;
  subtasks?: { id: string; title: string; completed: boolean }[];
  category: string;
  goalType?: string;
  customGoalTypeText?: string;
  customGoalTypeColor?: string;
  // Meal prep specific
  mealType?: string;
  dayOfWeek?: string;
  notes?: string;
  // Cleaning specific
  frequency?: string;
  cleaningLocation?: string;
  customCleaningLocation?: string;
  // Self-care specific
  selfCareType?: string;
  // Delegation specific
  reminderEnabled?: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
  onHabitIncrement?: (id: string) => void;
  onSubtaskToggle?: (taskId: string, subtaskId: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  isFirst?: boolean;
  isLast?: boolean;
  colors?: any; // Theme colors for the tab
  accentColor?: string; // Optional color override
  borderColor?: string; // Optional border color override
  habitColor?: string; // Optional habit color override
}

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
  onHabitIncrement,
  onSubtaskToggle,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  colors,
  accentColor,
  borderColor,
  habitColor
}: TaskItemProps) {
  const [scaleAnim] = useState(new Animated.Value(1));

  // Use theme colors if provided, otherwise fallback to the old color logic
  const themeColors = colors || {};

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return '#FC8181'; // Red
      case 'medium': return '#4299E1'; // Blue
      case 'low': return '#68D391'; // Green
      case 'quick-win': return '#F6AD55'; // Orange
      case 'custom': return task.customPriorityColor || '#4A5568';
      default: return '#A0AEC0'; // Default gray
    }
  };

  // Function to get goal type tag color
  const getGoalTypeColor = (goalType?: string) => {
    switch (goalType) {
      case 'TBD': return '#9F7AEA'; // Purple
      case 'Not Priority': return '#FC8181'; // Red
      case 'Wish': return '#4299E1'; // Blue
      case 'custom': return task.customGoalTypeColor || '#4A5568';
      default: return '#A0AEC0'; // Default gray
    }
  };

  // Function to get day of week color
  const getDayOfWeekColor = (day?: string) => {
    switch (day) {
      case 'Mon': return '#FC8181'; // Red
      case 'Tue': return '#F6AD55'; // Orange
      case 'Wed': return '#F6E05E'; // Yellow
      case 'Thu': return '#68D391'; // Green
      case 'Fri': return '#4FD1C5'; // Teal
      case 'Sat': return '#63B3ED'; // Blue
      case 'Sun': return '#B794F4'; // Purple
      default: return '#A0AEC0'; // Default gray
    }
  };

  // Function to get cleaning location color
  const getCleaningLocationColor = (location?: string) => {
    switch (location) {
      case 'kitchen': return '#F6E05E'; // Yellow
      case 'bathroom': return '#4FD1C5'; // Teal
      case 'bedroom': return '#9F7AEA'; // Purple
      case 'custom': return '#FC8181'; // Red
      default: return '#A0AEC0'; // Default gray
    }
  };

  // Function to get self-care type color
  const getSelfCareTypeColor = (type?: string) => {
    switch (type) {
      case 'physical': return '#68D391'; // Green
      case 'mental': return '#9F7AEA'; // Purple
      case 'rest': return '#4FD1C5'; // Teal
      case 'joy': return '#F6AD55'; // Orange
      default: return '#A0AEC0'; // Default gray
    }
  };

  // Function to get delegate type color
  const getDelegateTypeColor = (type?: string) => {
    switch (type) {
      case 'partner': return '#63B3ED'; // Blue
      case 'family': return '#F6AD55'; // Orange
      case 'friends': return '#9F7AEA'; // Purple
      case 'kids': return '#68D391'; // Green
      default: return '#A0AEC0'; // Default gray
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

  // If theme colors provided, use them, otherwise fallback to props or category colors
  const taskColor = colors?.dark || borderColor || getTabColor(task.category);
  const taskAccentColor = colors?.accent || accentColor || taskColor;
  const taskHabitColor = colors?.accent || habitColor || taskColor;
  
  // Get a lighter version of the color for borders
  const getLightBorderColor = (color: string) => {
    // If we have theme colors, use the pastel color
    if (colors?.pastel) {
      return colors.pastel;
    }
    // Otherwise make the border color more subtle by adding transparency
    return color + '40'; // Adding 40 for 25% opacity
  };
  
  // Get a lighter background color for habits based on the task category
  const getHabitBackgroundColor = (category: string) => {
    // If we have theme colors, use the bg color
    if (colors?.bgAlt) {
      return colors.bgAlt;
    }

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
  const habitProgress = task.isHabit && task.habitCount !== undefined && task.habitGoal
    ? (task.habitCount / task.habitGoal) * 100
    : 0;

  // Render tag based on task category
  const renderTag = () => {
    // For goals category
    if (task.category === 'goals' && task.goalType) {
      // For custom goal type
      if (task.goalType === 'custom' && task.customGoalTypeText) {
        return (
          <View style={[
            styles.priorityTag,
            { backgroundColor: task.customGoalTypeColor || '#4A5568' }
          ]}>
            <Text style={styles.priorityText}>
              {task.customGoalTypeText.toUpperCase()}
            </Text>
          </View>
        );
      }
      
      // For predefined goal types
      return (
        <View style={[
          styles.priorityTag,
          { backgroundColor: getGoalTypeColor(task.goalType) }
        ]}>
          <Text style={styles.priorityText}>
            {task.goalType.toUpperCase()}
          </Text>
        </View>
      );
    } 
    // For daily tasks with priority
    else if (task.priority) {
      // For custom priority
      if (task.priority === 'custom' && task.customPriorityText) {
        return (
          <View style={[
            styles.priorityTag,
            { backgroundColor: task.customPriorityColor || '#4A5568' }
          ]}>
            <Text style={styles.priorityText}>
              {task.customPriorityText.toUpperCase()}
            </Text>
          </View>
        );
      }
      
      // For predefined priorities
      return (
        <View style={[
          styles.priorityTag,
          { backgroundColor: getPriorityColor(task.priority) }
        ]}>
          <Text style={styles.priorityText}>
            {task.priority === 'quick-win' ? 'QUICK WIN' : task.priority.toUpperCase()}
          </Text>
        </View>
      );
    }
    // For meal-prep with day of week only (not meal type)
    else if (task.category === 'meal-prep' && task.dayOfWeek) {
      return (
        <View style={[
          styles.priorityTag,
          { backgroundColor: getDayOfWeekColor(task.dayOfWeek) }
        ]}>
          <Text style={styles.priorityText}>
            {task.dayOfWeek.toUpperCase()}
          </Text>
        </View>
      );
    }
    // For cleaning with location
    else if (task.category === 'cleaning' && task.cleaningLocation) {
      if (task.cleaningLocation === 'custom' && task.customCleaningLocation) {
        return (
          <View style={[
            styles.priorityTag,
            { backgroundColor: getCleaningLocationColor('custom') }
          ]}>
            <Text style={styles.priorityText}>
              {task.customCleaningLocation.toUpperCase()}
            </Text>
          </View>
        );
      }
      return (
        <View style={[
          styles.priorityTag,
          { backgroundColor: getCleaningLocationColor(task.cleaningLocation) }
        ]}>
          <Text style={styles.priorityText}>
            {task.cleaningLocation.toUpperCase()}
          </Text>
        </View>
      );
    }

    // For self-care with type
    else if (task.category === 'self-care' && task.selfCareType) {
      return (
        <View style={[
          styles.priorityTag,
          { backgroundColor: getSelfCareTypeColor(task.selfCareType) }
        ]}>
          <Text style={styles.priorityText}>
            {task.selfCareType.toUpperCase()}
          </Text>
        </View>
      );
    }

    // For delegation with type
    else if (task.category === 'delegation' && task.delegateType) {
      return (
        <View style={[
          styles.priorityTag,
          { backgroundColor: getDelegateTypeColor(task.delegateType) }
        ]}>
          <Text style={styles.priorityText}>
            {task.delegateType.toUpperCase()}
          </Text>
        </View>
      );
    }
    
    return null;
  };

  // Choose text color based on completed state and theme
  const getTextColor = (completed: boolean) => {
    if (completed) return colors?.medium || '#A0AEC0'; // Completed tasks use medium color
    return colors?.veryDark || '#2D3748'; // Active tasks use veryDark color for better contrast
  };

  // Choose subtask text color based on completed state and theme
  const getSubtaskTextColor = (completed: boolean) => {
    if (completed) return colors?.medium || '#A0AEC0'; // Completed subtasks use medium color
    return colors?.dark || '#4A5568'; // Active subtasks use dark color
  };

  // Choose icon colors based on theme
  const getIconColor = (disabled: boolean) => {
    if (disabled) return colors?.pastel || '#CBD5E0'; 
    return colors?.medium || '#4A5568';
  };

  // Get checkbox background color - logical flow from light to dark
  const getCheckboxBgColor = (completed: boolean, isHabit: boolean) => {
    if (completed) {
      return taskAccentColor; // Completed checkbox uses accent color (darker)
    } else {
      return colors?.pastel || '#E2E8F0'; // Uncompleted uses pastel (lighter)
    }
  };

  // Get checkbox text/icon color - logical flow from dark to light
  const getCheckboxContentColor = (completed: boolean, isHabit: boolean) => {
    if (completed) {
      return colors?.pastel || '#FFFFFF'; // Completed checkbox uses light text
    } else if (isHabit) {
      return taskHabitColor; // Habit number uses accent color
    } else {
      return colors?.medium || '#A0AEC0'; // Default color
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <NeumorphicCard style={[
        styles.taskCard,
        { backgroundColor: colors?.bg || '#FFFFFF' },
        task.isHabit ? [styles.habitCard, { backgroundColor: getHabitBackgroundColor(task.category) }] : null,
        { 
          borderColor: getLightBorderColor(taskColor),
          borderWidth: 1,
          // Add left border accent for habits
          ...(task.isHabit ? {
            borderLeftWidth: 4,
            borderLeftColor: taskColor
          } : {})
        }
      ]}>
        <View style={styles.taskHeader}>
          <TouchableOpacity
            onPress={task.isHabit ? handleHabitIncrement : handleToggle}
            style={[
              styles.checkbox,
              task.completed ? styles.checkedBox : null,
              task.isHabit ? styles.habitBox : null,
              { 
                backgroundColor: getCheckboxBgColor(task.completed, !!task.isHabit),
                shadowColor: colors?.shadow || '#C8D0E0'
              },
            ]}
          >
            {task.completed ? (
              <Check size={16} color={getCheckboxContentColor(true, !!task.isHabit)} />
            ) : (
              task.isHabit && task.habitCount !== undefined && (
                <Text style={[
                  styles.habitCount,
                  { color: getCheckboxContentColor(false, true) }
                ]}>
                  {task.habitCount}
                </Text>
              )
            )}
          </TouchableOpacity>

          <View style={styles.taskContent}>
            <Text style={[
              styles.taskTitle,
              task.completed ? styles.completedTitle : null,
              task.isHabit ? styles.habitTitle : null,
              { color: getTextColor(task.completed) }
            ]}>
              {task.title}
              {task.isDelegated && (
                <Text style={[styles.delegatedBadge, { color: colors?.accent || '#38B2AC' }]}>
                  {" "}→ {task.delegatedTo}
                </Text>
              )}
            </Text>
            
            <View style={styles.taskMeta}>
              {renderTag()}
            </View>

            {/* Display notes for meal prep tasks */}
            {task.category === 'meal-prep' && task.notes ? (
              <View style={[styles.notesContainer, { 
                backgroundColor: colors?.bgAlt || '#F7FAFC',
                borderLeftColor: colors?.accent || '#ED8936'
              }]}>
                <Text style={[styles.notesText, { color: colors?.medium || '#4A5568' }]}>
                  {task.notes}
                </Text>
              </View>
            ) : null}

            {task.isHabit && task.habitGoal ? (
              <View style={[styles.habitProgressContainer, { backgroundColor: colors?.pastel || '#E2E8F0' }]}>
                <View 
                  style={[
                    styles.habitProgressBar, 
                    { 
                      width: `${habitProgress}%`,
                      backgroundColor: taskHabitColor
                    }
                  ]} 
                />
                <Text style={[styles.habitGoalText, { color: colors?.medium || '#4A5568' }]}>
                  {task.habitCount || 0}/{task.habitGoal}
                </Text>
              </View>
            ) : null}

            {task.subtasks && task.subtasks.length > 0 ? (
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
                        { 
                          backgroundColor: subtask.completed 
                            ? taskAccentColor 
                            : (colors?.pastel || '#E2E8F0')
                        },
                        subtask.completed ? styles.subtaskCompleted : null
                      ]} 
                    >
                      {subtask.completed ? <Check size={8} color={colors?.pastel || "#ffffff"} /> : null}
                    </View>
                    <Text style={[
                      styles.subtaskText, 
                      { color: getSubtaskTextColor(subtask.completed) },
                      subtask.completed ? styles.subtaskCompletedText : null
                    ]}>
                      {subtask.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>

          <View style={styles.actionIcons}>
            <View style={styles.orderButtons}>
              <TouchableOpacity
                onPress={() => onMoveUp && onMoveUp(task.id)}
                style={[styles.orderButton, isFirst ? styles.disabledButton : null]}
                disabled={isFirst}
              >
                <ChevronUp size={16} color={getIconColor(!!isFirst)} />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => onMoveDown && onMoveDown(task.id)}
                style={[styles.orderButton, isLast ? styles.disabledButton : null]}
                disabled={isLast}
              >
                <ChevronDown size={16} color={getIconColor(!!isLast)} />
              </TouchableOpacity>
            </View>
            
            {onEdit && (
              <TouchableOpacity
                onPress={() => onEdit(task)}
                style={styles.editIconButton}
              >
                <Pencil size={18} color={colors?.medium || "#4A5568"} />
              </TouchableOpacity>
            )}
            
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
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  habitTitle: {
    fontStyle: 'italic',
  },
  delegatedBadge: {
    fontSize: 12,
    fontFamily: 'Quicksand-SemiBold',
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
  notesContainer: {
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
    borderLeftWidth: 2,
  },
  notesText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    fontStyle: 'italic',
  },
  habitProgressContainer: {
    height: 8,
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
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtaskCompleted: {},
  subtaskText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
  },
  subtaskCompletedText: {
    textDecorationLine: 'line-through',
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
  editIconButton: {
    padding: 4,
    marginRight: 8,
  },
  deleteIconButton: {
    padding: 4,
  },
});