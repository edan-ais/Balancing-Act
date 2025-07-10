import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TextInput, Modal } from 'react-native';
import { Check, X, ChevronUp, ChevronDown, Edit2, Save, Plus, Trash } from 'lucide-react-native';
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
  onUpdate: (updatedTask: Task) => void; // New prop for updating task
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
  onUpdate,
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>({...task});
  const [newSubtask, setNewSubtask] = useState('');

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
      case 'goals': return '#276749';  // Using the color from emergency icon
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

  const handleEditStart = () => {
    setEditedTask({...task});
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSave = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim() === '') return;
    
    const updatedSubtasks = [...(editedTask.subtasks || []), {
      id: Date.now().toString(),
      title: newSubtask,
      completed: false
    }];
    
    setEditedTask({...editedTask, subtasks: updatedSubtasks});
    setNewSubtask('');
  };

  const handleRemoveSubtask = (subtaskId: string) => {
    const updatedSubtasks = (editedTask.subtasks || []).filter(
      subtask => subtask.id !== subtaskId
    );
    
    setEditedTask({...editedTask, subtasks: updatedSubtasks});
  };

  const toggleHabitMode = () => {
    setEditedTask({
      ...editedTask,
      isHabit: !editedTask.isHabit,
      habitCount: editedTask.isHabit ? undefined : 0,
      habitGoal: editedTask.isHabit ? undefined : 1,
    });
  };

  const toggleDelegatedMode = () => {
    setEditedTask({
      ...editedTask,
      isDelegated: !editedTask.isDelegated,
      delegatedTo: editedTask.isDelegated ? undefined : '',
    });
  };

  // Calculate habit progress percentage
  const habitProgress = task.isHabit && task.habitCount && task.habitGoal 
    ? (task.habitCount / task.habitGoal) * 100 
    : 0;

  if (isEditing) {
    return (
      <NeumorphicCard style={[
        styles.taskCard, 
        styles.editingCard,
        { borderColor: taskColor }
      ]}>
        <View style={styles.editHeader}>
          <Text style={styles.editTitle}>Edit Task</Text>
          <TouchableOpacity onPress={handleEditCancel} style={styles.editHeaderButton}>
            <X size={18} color="#FC8181" />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.editInput}
          value={editedTask.title}
          onChangeText={(text) => setEditedTask({...editedTask, title: text})}
          placeholder="Task title"
        />

        <View style={styles.editSection}>
          <Text style={styles.editSectionTitle}>Priority</Text>
          <View style={styles.priorityButtons}>
            {['high', 'medium', 'low', 'quick-win'].map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.priorityButton,
                  { backgroundColor: getPriorityColor(priority) },
                  editedTask.priority === priority && styles.activePriorityButton
                ]}
                onPress={() => setEditedTask({...editedTask, priority: priority as any})}
              >
                <Text style={styles.priorityButtonText}>
                  {priority === 'quick-win' ? 'QUICK' : priority.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.editSection}>
          <View style={styles.editToggleRow}>
            <Text style={styles.editSectionTitle}>Habit</Text>
            <TouchableOpacity 
              style={[styles.toggleButton, editedTask.isHabit && styles.toggleButtonActive]} 
              onPress={toggleHabitMode}
            >
              <Text style={styles.toggleButtonText}>
                {editedTask.isHabit ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {editedTask.isHabit && (
            <View style={styles.habitControls}>
              <Text style={styles.habitControlLabel}>Goal:</Text>
              <View style={styles.habitCounterRow}>
                <TouchableOpacity 
                  style={styles.habitCounterButton} 
                  onPress={() => setEditedTask({
                    ...editedTask, 
                    habitGoal: Math.max(1, (editedTask.habitGoal || 1) - 1)
                  })}
                >
                  <Text style={styles.habitCounterButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.habitCountValue}>{editedTask.habitGoal || 1}</Text>
                <TouchableOpacity 
                  style={styles.habitCounterButton} 
                  onPress={() => setEditedTask({
                    ...editedTask, 
                    habitGoal: (editedTask.habitGoal || 1) + 1
                  })}
                >
                  <Text style={styles.habitCounterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.editSection}>
          <View style={styles.editToggleRow}>
            <Text style={styles.editSectionTitle}>Delegated</Text>
            <TouchableOpacity 
              style={[styles.toggleButton, editedTask.isDelegated && styles.toggleButtonActive]} 
              onPress={toggleDelegatedMode}
            >
              <Text style={styles.toggleButtonText}>
                {editedTask.isDelegated ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {editedTask.isDelegated && (
            <TextInput
              style={styles.editInput}
              value={editedTask.delegatedTo}
              onChangeText={(text) => setEditedTask({...editedTask, delegatedTo: text})}
              placeholder="Delegated to"
            />
          )}
        </View>

        <View style={styles.editSection}>
          <Text style={styles.editSectionTitle}>Subtasks</Text>
          
          {editedTask.subtasks && editedTask.subtasks.map(subtask => (
            <View key={subtask.id} style={styles.editSubtaskRow}>
              <TextInput
                style={styles.editSubtaskInput}
                value={subtask.title}
                onChangeText={(text) => {
                  const updatedSubtasks = editedTask.subtasks?.map(s => 
                    s.id === subtask.id ? {...s, title: text} : s
                  );
                  setEditedTask({...editedTask, subtasks: updatedSubtasks});
                }}
              />
              <TouchableOpacity 
                style={styles.removeSubtaskButton}
                onPress={() => handleRemoveSubtask(subtask.id)}
              >
                <Trash size={16} color="#FC8181" />
              </TouchableOpacity>
            </View>
          ))}
          
          <View style={styles.addSubtaskRow}>
            <TextInput
              style={styles.addSubtaskInput}
              value={newSubtask}
              onChangeText={setNewSubtask}
              placeholder="Add new subtask"
            />
            <TouchableOpacity 
              style={styles.addSubtaskButton}
              onPress={handleAddSubtask}
            >
              <Plus size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: taskAccentColor }]}
          onPress={handleEditSave}
        >
          <Save size={16} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </NeumorphicCard>
    );
  }

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
              { backgroundColor: task.completed ? (task.category === 'goals' ? '#276749' : taskAccentColor) : '#E2E8F0' },
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
                      backgroundColor: task.category === 'goals' ? '#276749' : taskHabitColor
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
                          { backgroundColor: task.category === 'goals' ? '#276749' : taskAccentColor }
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
              onPress={handleEditStart}
              style={styles.editIconButton}
            >
              <Edit2 size={18} color="#4A5568" />
            </TouchableOpacity>
            
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
    borderWidth: 1,
    borderColor: '#38A169',
    backgroundColor: '#FFFFFF',
  },
  habitCard: {
    backgroundColor: '#E3F5EC', // Slightly more visible light green background
  },
  editingCard: {
    padding: 16,
    backgroundColor: '#FFFFFF',
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
  editIconButton: {
    padding: 4,
    marginRight: 4,
  },
  deleteIconButton: {
    padding: 4,
  },
  // Edit mode styles
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  editTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#2D3748',
  },
  editHeaderButton: {
    padding: 4,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    backgroundColor: '#F7FAFC',
  },
  editSection: {
    marginBottom: 16,
  },
  editSectionTitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#4A5568',
    marginBottom: 8,
  },
  priorityButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  priorityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    opacity: 0.7,
  },
  activePriorityButton: {
    opacity: 1,
  },
  priorityButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Quicksand-SemiBold',
  },
  editToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleButton: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  toggleButtonActive: {
    backgroundColor: '#4299E1',
  },
  toggleButtonText: {
    color: '#4A5568',
    fontSize: 12,
    fontFamily: 'Quicksand-SemiBold',
  },
  habitControls: {
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  habitControlLabel: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    color: '#4A5568',
    marginBottom: 8,
  },
  habitCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitCounterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitCounterButtonText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    color: '#4A5568',
  },
  habitCountValue: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#2D3748',
    marginHorizontal: 16,
  },
  editSubtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  editSubtaskInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    backgroundColor: '#F7FAFC',
  },
  removeSubtaskButton: {
    padding: 8,
    marginLeft: 8,
  },
  addSubtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  addSubtaskInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    backgroundColor: '#F7FAFC',
  },
  addSubtaskButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4299E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#38A169',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    marginLeft: 8,
  },
});