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
  customCleaningLocationColor?: string;
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

  // Use theme colors if provided, otherwise use props
  const themeColors = colors || {};
  const effectiveAccentColor = colors?.accent || accentColor || '#4055C5';
  const effectiveDarkColor = colors?.dark || '#2B6CB0';
  const effectiveBgColor = colors?.bg || '#F5F7FA';
  const effectiveMediumColor = colors?.medium || '#4A5568';
  const effectivePastelColor = colors?.pastel || '#E2E8F0';
  const effectiveShadowColor = colors?.shadow || '#C8D0E0';
  
  // Map category to appropriate tab color key
  const getCategoryColorKey = () => {
    switch (task.category) {
      case 'daily': return 'daily';
      case 'future': return 'future';
      case 'weekly': return 'calendar';
      case 'meal-prep': return 'meals';
      case 'cleaning': return 'cleaning';
      case 'self-care': return 'selfCare';
      case 'delegation': return 'delegate';
      case 'goals': return 'future'; // Goals can use future colors
      default: return 'daily'; // Fallback to daily colors
    }
  };
  
  // Get the appropriate theme colors based on category
  const tabColorKey = getCategoryColorKey();
  const tabColors = colors?.tabColors?.[tabColorKey] || {};
  
  // Use the tab colors from the theme or fallback to effective colors
  const veryDarkColor = tabColors.veryDark || effectiveDarkColor;
  const highlightColor = tabColors.highlight || effectiveAccentColor;
  const bgAltColor = tabColors.bgAlt || effectivePastelColor;
  const lightColor = tabColors.light || effectivePastelColor;

  // Helper to get tag color - using the flat structure
  const getTagColor = (tagType: string, tagValue: string) => {
    // For custom tags, use their specific custom color
    if (tagValue === 'custom') {
      const customColorMap = {
        'priority': task.customPriorityColor,
        'goalType': task.customGoalTypeColor,
        'cleaningLocation': task.customCleaningLocationColor,
      };
      
      return customColorMap[tagType] || veryDarkColor;
    }
    
    // Convert option to proper format for lookup in theme
    let lookupKey;
    if (tagType === 'priority') {
      lookupKey = `priority${tagValue.charAt(0).toUpperCase() + tagValue.slice(1)}`;
      if (tagValue === 'quick-win') {
        lookupKey = 'priorityQuickWin';
      }
    } else if (tagType === 'goalType') {
      if (tagValue === 'TBD') {
        lookupKey = 'goalTbd';
      } else if (tagValue === 'Not Priority') {
        lookupKey = 'goalNotPriority';
      } else {
        lookupKey = `goal${tagValue.charAt(0).toUpperCase() + tagValue.slice(1)}`;
      }
    } else if (tagType === 'dayOfWeek') {
      lookupKey = `day${tagValue}`;
    } else if (tagType === 'cleaningLocation') {
      lookupKey = `cleaning${tagValue.charAt(0).toUpperCase() + tagValue.slice(1)}`;
    } else if (tagType === 'delegateType') {
      lookupKey = `delegate${tagValue.charAt(0).toUpperCase() + tagValue.slice(1)}`;
    } else if (tagType === 'mealType') {
      lookupKey = `meal${tagValue.charAt(0).toUpperCase() + tagValue.slice(1)}`;
    } else if (tagType === 'selfCareType') {
      lookupKey = `selfCare${tagValue.charAt(0).toUpperCase() + tagValue.slice(1)}`;
    }
    
    // Add Selected suffix to get the selected color
    lookupKey = `${lookupKey}Selected`;
    
    // Return the color from the tab's colors or default to tab's main colors
    return tabColors[lookupKey] || veryDarkColor;
  };

  // Helper to get text color based on background color
  const getTextColor = (backgroundColor: string) => {
    // For standard cases where we know the intent
    if (backgroundColor === bgAltColor || backgroundColor.toUpperCase().startsWith('#F')) {
      return veryDarkColor; // Dark text on light backgrounds
    } else {
      return '#FFFFFF'; // White text on dark backgrounds
    }
  };

  // Function to get priority tag color
  const getPriorityColor = (priority?: string) => {
    if (!priority) return tabColors.priorityDefaultSelected || veryDarkColor;
    
    return getTagColor('priority', priority);
  };

  // Function to get goal type tag color
  const getGoalTypeColor = (goalType?: string) => {
    if (!goalType) return tabColors.goalDefaultSelected || veryDarkColor;
    
    return getTagColor('goalType', goalType);
  };

  // Function to get day of week color
  const getDayOfWeekColor = (day?: string) => {
    if (!day) return veryDarkColor;
    
    return getTagColor('dayOfWeek', day);
  };

  // Function to get cleaning location color
  const getCleaningLocationColor = (location?: string) => {
    if (!location) return tabColors.cleaningDefaultSelected || veryDarkColor;
    
    return getTagColor('cleaningLocation', location);
  };

  // Function to get self-care type color
  const getSelfCareTypeColor = (type?: string) => {
    if (!type) return tabColors.selfCareDefaultSelected || veryDarkColor;
    
    return getTagColor('selfCareType', type);
  };

  // Function to get delegate type color
  const getDelegateTypeColor = (type?: string) => {
    if (!type) return tabColors.delegateDefaultSelected || veryDarkColor;
    
    return getTagColor('delegateType', type);
  };

  // Function to get meal type color
  const getMealTypeColor = (type?: string) => {
    if (!type) return tabColors.mealDefaultSelected || veryDarkColor;
    
    return getTagColor('mealType', type);
  };

  // Get a lighter version of the color for borders
  const getLightBorderColor = () => {
    return colors?.pastel || effectivePastelColor;
  };
  
  // Get a lighter background color for habits based on the task category
  const getHabitBackgroundColor = () => {
    return tabColors.bgAlt || bgAltColor;
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
            { backgroundColor: task.customGoalTypeColor || (tabColors.goalCustomSelected || veryDarkColor) }
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
            { backgroundColor: task.customPriorityColor || (tabColors.priorityCustomSelected || veryDarkColor) }
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
    // For meal-prep with day of week
    else if (task.category === 'meal-prep') {
      // Show both meal type and day of week if available
      if (task.mealType && task.dayOfWeek) {
        return (
          <View style={styles.tagContainer}>
            <View style={[
              styles.priorityTag,
              { backgroundColor: getMealTypeColor(task.mealType) }
            ]}>
              <Text style={styles.priorityText}>
                {task.mealType.toUpperCase()}
              </Text>
            </View>
            <View style={[
              styles.priorityTag,
              { backgroundColor: getDayOfWeekColor(task.dayOfWeek) }
            ]}>
              <Text style={styles.priorityText}>
                {task.dayOfWeek.toUpperCase()}
              </Text>
            </View>
          </View>
        );
      }
      // Show just meal type if available
      else if (task.mealType) {
        return (
          <View style={[
            styles.priorityTag,
            { backgroundColor: getMealTypeColor(task.mealType) }
          ]}>
            <Text style={styles.priorityText}>
              {task.mealType.toUpperCase()}
            </Text>
          </View>
        );
      }
      // Show just day of week if available
      else if (task.dayOfWeek) {
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
    }
    // For cleaning with location
    else if (task.category === 'cleaning' && task.cleaningLocation) {
      if (task.cleaningLocation === 'custom' && task.customCleaningLocation) {
        return (
          <View style={[
            styles.priorityTag,
            { backgroundColor: task.customCleaningLocationColor || (tabColors.cleaningCustomSelected || veryDarkColor) }
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
  const getTaskTextColor = (completed: boolean) => {
    if (completed) return colors?.medium || effectiveMediumColor; // Completed tasks use medium color
    return colors?.veryDark || veryDarkColor; // Active tasks use veryDark color for better contrast
  };

  // Choose subtask text color based on completed state and theme
  const getSubtaskTextColor = (completed: boolean) => {
    if (completed) return colors?.medium || effectiveMediumColor; // Completed subtasks use medium color
    return colors?.dark || effectiveDarkColor; // Active subtasks use dark color
  };

  // Choose icon colors based on theme - ensuring good contrast
  const getIconColor = (disabled: boolean) => {
    if (disabled) return colors?.medium || effectiveMediumColor; // Using medium instead of pastel for better visibility
    return colors?.dark || effectiveDarkColor; // Using dark instead of medium for better contrast
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <NeumorphicCard style={[
        styles.taskCard,
        { backgroundColor: colors?.bg || effectiveBgColor },
        task.isHabit ? [styles.habitCard, { backgroundColor: getHabitBackgroundColor() }] : null,
        { 
          borderColor: getLightBorderColor(),
          borderWidth: 2, // Updated to 2px as requested
          // Add left border accent for habits
          ...(task.isHabit ? {
            borderLeftWidth: 6,
            borderLeftColor: veryDarkColor
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
                // LIGHT when unchecked, DARK when checked
                backgroundColor: task.completed ? veryDarkColor : effectivePastelColor,
                // Add border when unchecked for visibility - changed to 2px as requested
                borderColor: task.completed ? 'transparent' : veryDarkColor,
                borderWidth: task.completed ? 0 : 2,
                shadowColor: colors?.shadow || effectiveShadowColor
              },
            ]}
          >
            {task.completed ? (
              // LIGHT icon on DARK background when checked
              <Check size={18} color="#FFFFFF" />
            ) : (
              task.isHabit && task.habitCount !== undefined && (
                // DARK text on LIGHT background when unchecked
                <Text style={[
                  styles.habitCount,
                  { color: veryDarkColor }
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
              { color: getTaskTextColor(task.completed) }
            ]}>
              {task.title}
              {task.isDelegated && (
                <Text style={[styles.delegatedBadge, { color: highlightColor }]}>
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
                backgroundColor: bgAltColor,
                borderLeftColor: highlightColor,
                borderLeftWidth: 3
              }]}>
                <Text style={[styles.notesText, { color: effectiveDarkColor }]}>
                  {task.notes}
                </Text>
              </View>
            ) : null}

            {task.isHabit && task.habitGoal ? (
              <View style={[
                styles.habitProgressContainer, 
                // LIGHT background for progress bar
                { backgroundColor: effectivePastelColor }
              ]}>
                <View 
                  style={[
                    styles.habitProgressBar, 
                    { 
                      width: `${habitProgress}%`,
                      // DARK fill for completed portion
                      backgroundColor: veryDarkColor
                    }
                  ]} 
                />
                <Text style={[styles.habitGoalText, { color: effectiveDarkColor }]}>
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
                          // LIGHT when unchecked, DARK when checked
                          backgroundColor: subtask.completed 
                            ? veryDarkColor 
                            : effectivePastelColor,
                          // Updated to 2px as requested for consistent style
                          borderColor: subtask.completed ? 'transparent' : veryDarkColor,
                          borderWidth: subtask.completed ? 0 : 2,
                        },
                      ]} 
                    >
                      {subtask.completed ? 
                        // LIGHT icon on DARK background when checked
                        <Check size={10} color="#FFFFFF" /> 
                        : null
                      }
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
                <ChevronUp size={20} color={getIconColor(!!isFirst)} />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => onMoveDown && onMoveDown(task.id)}
                style={[styles.orderButton, isLast ? styles.disabledButton : null]}
                disabled={isLast}
              >
                <ChevronDown size={20} color={getIconColor(!!isLast)} />
              </TouchableOpacity>
            </View>
            
            {onEdit && (
              <TouchableOpacity
                onPress={() => onEdit(task)}
                style={styles.editIconButton}
              >
                <Pencil size={20} color={effectiveDarkColor} />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              onPress={() => onDelete(task.id)}
              style={styles.deleteIconButton}
            >
              <X size={20} color="#FC8181" />
            </TouchableOpacity>
          </View>
        </View>
      </NeumorphicCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    margin: 6,
    padding: 14,
    borderRadius: 12,
  },
  habitCard: {
    // Base habit card - specific background colors are set dynamically
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  checkedBox: {},
  habitBox: {},
  habitCount: {
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
    marginBottom: 6,
    lineHeight: 24,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  habitTitle: {
    fontStyle: 'italic',
  },
  delegatedBadge: {
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  priorityTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  priorityText: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Quicksand-Bold',
    textTransform: 'uppercase',
  },
  notesContainer: {
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },
  notesText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  habitProgressContainer: {
    height: 10,
    borderRadius: 5,
    marginVertical: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  habitProgressBar: {
    height: '100%',
    borderRadius: 5,
  },
  habitGoalText: {
    position: 'absolute',
    right: 0,
    top: -18,
    fontSize: 12,
    fontFamily: 'Quicksand-Bold',
  },
  subtasks: {
    marginTop: 10,
    paddingLeft: 4,
  },
  subtask: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  subtaskCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtaskText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    lineHeight: 22,
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
    padding: 5,
    marginVertical: 2,
  },
  disabledButton: {
    opacity: 0.5,
  },
  editIconButton: {
    padding: 6,
    marginRight: 8,
  },
  deleteIconButton: {
    padding: 6,
  },
});