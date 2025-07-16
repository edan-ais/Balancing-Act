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
  mealType?: string;
  dayOfWeek?: string;
  notes?: string;
  frequency?: string;
  cleaningLocation?: string;
  customCleaningLocation?: string;
  customCleaningLocationColor?: string;
  selfCareType?: string;
  reminderEnabled?: boolean;
  scheduledDate?: Date;
}

export interface TaskItemProps {
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
  colors?: any;
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
  colors
}: TaskItemProps) {
  const [scaleAnim] = useState(new Animated.Value(1));

  const getTagColor = (tagType: string, tagValue: string) => {
    if (tagValue === 'custom') {
      if (tagType === 'priority') return task.customPriorityColor || colors?.veryDark;
      if (tagType === 'goalType') return task.customGoalTypeColor || colors?.veryDark;
      if (tagType === 'cleaningLocation') return task.customCleaningLocationColor || colors?.veryDark;
    }
    
    const colorWheel = colors?.themeColorWheel || {};
    const tagColorMap: Record<string, Record<string, string>> = {
      priority: {
        high: colorWheel.redBold,
        medium: colorWheel.orangeBold,
        low: colorWheel.yellowBold,
        'quick-win': colorWheel.greenBold,
      },
      goalType: {
        Personal: colorWheel.purpleBold,
        Career: colorWheel.blueBold,
        Financial: colorWheel.greenBold,
        TBD: colorWheel.grayBold,
        'Not Priority': colorWheel.grayBold,
      },
      dayOfWeek: {
        Mon: colorWheel.redBold,
        Tue: colorWheel.orangeBold,
        Wed: colorWheel.yellowBold,
        Thu: colorWheel.greenBold,
        Fri: colorWheel.blueBold,
        Sat: colorWheel.purpleBold,
        Sun: colorWheel.pinkBold,
      },
      cleaningLocation: {
        kitchen: colorWheel.redBold,
        bathroom: colorWheel.blueBold,
        bedroom: colorWheel.purpleBold,
      },
    };
    
    return tagColorMap[tagType]?.[tagValue] || colorWheel.grayBold || colors?.veryDark;
  };

  const animateAndExecute = (callback: () => void, scale = 1.1) => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: scale, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    callback();
  };

  const handleToggle = () => animateAndExecute(() => onToggle(task.id));
  const handleHabitIncrement = () => animateAndExecute(() => onHabitIncrement?.(task.id), 1.2);

  const renderTag = () => {
    let tagType = '';
    let tagValue = '';
    let displayText = '';

    if (task.category === 'goals' && task.goalType) {
      tagType = 'goalType';
      tagValue = task.goalType;
      displayText = task.goalType === 'custom' ? task.customGoalTypeText || '' : task.goalType;
    } else if (task.priority) {
      tagType = 'priority';
      tagValue = task.priority;
      displayText = task.priority === 'custom' ? task.customPriorityText || '' : 
                   task.priority === 'quick-win' ? 'QUICK WIN' : task.priority;
    } else if (task.category === 'meal-prep' && task.dayOfWeek) {
      tagType = 'dayOfWeek';
      tagValue = task.dayOfWeek;
      displayText = task.dayOfWeek;
    } else if (task.category === 'cleaning' && task.cleaningLocation) {
      tagType = 'cleaningLocation';
      tagValue = task.cleaningLocation;
      displayText = task.cleaningLocation === 'custom' ? task.customCleaningLocation || '' : task.cleaningLocation;
    }

    if (!displayText) return null;

    return (
      <View style={[styles.priorityTag, { backgroundColor: getTagColor(tagType, tagValue) }]}>
        <Text style={styles.priorityText}>{displayText.toUpperCase()}</Text>
      </View>
    );
  };

  const habitProgress = task.isHabit && task.habitCount !== undefined && task.habitGoal
    ? (task.habitCount / task.habitGoal) * 100 : 0;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <NeumorphicCard style={[
        styles.taskCard,
        { backgroundColor: colors?.bg },
        task.isHabit && {
          backgroundColor: colors?.bgAlt,
          borderLeftWidth: 6,
          borderLeftColor: colors?.veryDark
        },
        { borderColor: colors?.pastel, borderWidth: 2 }
      ]}>
        <View style={styles.taskHeader}>
          <TouchableOpacity
            onPress={task.isHabit ? handleHabitIncrement : handleToggle}
            style={[
              styles.checkbox,
              {
                backgroundColor: task.completed ? colors?.veryDark : colors?.pastel,
                borderColor: task.completed ? 'transparent' : colors?.veryDark,
                borderWidth: task.completed ? 0 : 2,
                shadowColor: colors?.shadow
              },
            ]}
          >
            {task.completed ? (
              <Check size={18} color="#FFFFFF" />
            ) : (
              task.isHabit && task.habitCount !== undefined && (
                <Text style={[styles.habitCount, { color: colors?.veryDark }]}>
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
              { color: task.completed ? colors?.medium : colors?.veryDark }
            ]}>
              {task.title}
              {task.isDelegated && (
                <Text style={[styles.delegatedBadge, { color: colors?.highlight }]}>
                  {" "}→ {task.delegatedTo}
                </Text>
              )}
            </Text>
            
            <View style={styles.taskMeta}>
              {renderTag()}
            </View>

            {task.category === 'meal-prep' && task.notes && (
              <View style={[styles.notesContainer, { 
                backgroundColor: colors?.bgAlt,
                borderLeftColor: colors?.highlight,
                borderLeftWidth: 3
              }]}>
                <Text style={[styles.notesText, { color: colors?.dark }]}>
                  {task.notes}
                </Text>
              </View>
            )}

            {task.isHabit && task.habitGoal && (
              <View style={[styles.habitProgressContainer, { backgroundColor: colors?.pastel }]}>
                <View style={[
                  styles.habitProgressBar, 
                  { width: `${habitProgress}%`, backgroundColor: colors?.veryDark }
                ]} />
                <Text style={[styles.habitGoalText, { color: colors?.dark }]}>
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
                    onPress={() => onSubtaskToggle?.(task.id, subtask.id)}
                  >
                    <View style={[
                      styles.subtaskCheckbox, 
                      {
                        backgroundColor: subtask.completed ? colors?.veryDark : colors?.pastel,
                        borderColor: subtask.completed ? 'transparent' : colors?.veryDark,
                        borderWidth: subtask.completed ? 0 : 2,
                      },
                    ]}>
                      {subtask.completed && <Check size={10} color="#FFFFFF" />}
                    </View>
                    <Text style={[
                      styles.subtaskText, 
                      { color: subtask.completed ? colors?.medium : colors?.dark },
                      subtask.completed && styles.subtaskCompletedText
                    ]}>
                      {subtask.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.actionIcons}>
            <View style={styles.iconGroup}>
              <TouchableOpacity
                onPress={() => onMoveUp?.(task.id)}
                style={[styles.iconButton, { backgroundColor: colors?.pastel }]}
                disabled={isFirst}
              >
                <ChevronUp size={18} color={isFirst ? colors?.medium : colors?.dark} strokeWidth={2.5} />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => onMoveDown?.(task.id)}
                style={[styles.iconButton, { backgroundColor: colors?.pastel }]}
                disabled={isLast}
              >
                <ChevronDown size={18} color={isLast ? colors?.medium : colors?.dark} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.iconGroup}>
              {onEdit && (
                <TouchableOpacity
                  onPress={() => onEdit(task)}
                  style={[styles.iconButton, { backgroundColor: colors?.pastel }]}
                >
                  <Pencil size={18} color={colors?.dark} strokeWidth={2.5} />
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                onPress={() => onDelete(task.id)}
                style={[styles.iconButton, { backgroundColor: '#FFF1F0' }]}
              >
                <X size={18} color="#E53E3E" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
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
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});