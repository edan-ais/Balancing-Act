import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { X, Plus, Minus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NeumorphicCard from './NeumorphicCard';

interface AddTaskFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
  category: string;
  selectedDate?: Date; // For calendar tasks
  accentColor?: string;
  darkColor?: string;
  bgColor?: string;
  mediumColor?: string;
  pastelColor?: string;
  shadowColor?: string;
}

export default function AddTaskForm({
  visible,
  onClose,
  onSubmit,
  category,
  selectedDate,
  accentColor = '#4055C5',
  darkColor = '#2B6CB0',
  bgColor = '#F5F7FA',
  mediumColor = '#4A5568',
  pastelColor = '#E2E8F0',
  shadowColor = '#C8D0E0'
}: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [isHabit, setIsHabit] = useState(false);
  const [habitGoal, setHabitGoal] = useState('');
  const [priority, setPriority] = useState<string>('');
  const [customPriorityText, setCustomPriorityText] = useState('');
  const [customPriorityColor, setCustomPriorityColor] = useState('#4A5568');
  const [goalType, setGoalType] = useState<string>('');
  const [customGoalTypeText, setCustomGoalTypeText] = useState('');
  const [customGoalTypeColor, setCustomGoalTypeColor] = useState('#4A5568');
  const [mealType, setMealType] = useState<string>('');
  const [dayOfWeek, setDayOfWeek] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [frequency, setFrequency] = useState<string>('');
  const [cleaningLocation, setCleaningLocation] = useState<string>('');
  const [customCleaningLocation, setCustomCleaningLocation] = useState('');
  const [selfCareType, setSelfCareType] = useState<string>('');
  const [delegatedTo, setDelegatedTo] = useState('');
  const [delegateType, setDelegateType] = useState<string>('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const resetForm = () => {
    setTitle('');
    setIsHabit(false);
    setHabitGoal('');
    setPriority('');
    setCustomPriorityText('');
    setCustomPriorityColor('#4A5568');
    setGoalType('');
    setCustomGoalTypeText('');
    setCustomGoalTypeColor('#4A5568');
    setMealType('');
    setDayOfWeek('');
    setNotes('');
    setFrequency('');
    setCleaningLocation('');
    setCustomCleaningLocation('');
    setSelfCareType('');
    setDelegatedTo('');
    setDelegateType('');
    setReminderEnabled(false);
    setSubtasks([]);
    setErrors([]);
  };

  const validateForm = (): string[] => {
    const validationErrors: string[] = [];

    // Check if title is provided
    if (!title.trim()) {
      validationErrors.push('Task name is required');
    }

    // Category-specific validation
    switch (category) {
      case 'daily':
        if (!priority) {
          validationErrors.push('Priority is required for daily tasks');
        }
        if (priority === 'custom' && !customPriorityText.trim()) {
          validationErrors.push('Custom priority text is required');
        }
        break;

      case 'goals':
        if (!goalType) {
          validationErrors.push('Goal type is required for future tasks');
        }
        if (goalType === 'custom' && !customGoalTypeText.trim()) {
          validationErrors.push('Custom goal type text is required');
        }
        break;

      case 'meal-prep':
        if (!mealType) {
          validationErrors.push('Meal type is required for meal prep tasks');
        }
        break;

      case 'cleaning':
        if (!frequency) {
          validationErrors.push('Frequency is required for cleaning tasks');
        }
        if (!cleaningLocation) {
          validationErrors.push('Location is required for cleaning tasks');
        }
        if (cleaningLocation === 'custom' && !customCleaningLocation.trim()) {
          validationErrors.push('Custom location is required');
        }
        break;

      case 'self-care':
        if (!selfCareType) {
          validationErrors.push('Self-care type is required for self-care tasks');
        }
        break;

      case 'delegation':
        if (!delegateType) {
          validationErrors.push('Delegate type is required for delegation tasks');
        }
        if (!delegatedTo.trim()) {
          validationErrors.push('Person to delegate to is required');
        }
        break;

      case 'weekly':
        // For calendar tasks, we don't require additional validation beyond title
        // The selectedDate is handled automatically
        break;
    }

    // Habit-specific validation
    if (isHabit && (!habitGoal || parseInt(habitGoal) <= 0)) {
      validationErrors.push('Valid habit goal is required for habits');
    }

    return validationErrors;
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newTask = {
      title: title.trim(),
      isHabit,
      habitGoal: isHabit && habitGoal ? parseInt(habitGoal) : undefined,
      priority: priority || undefined,
      customPriorityText: priority === 'custom' ? customPriorityText : undefined,
      customPriorityColor: priority === 'custom' ? customPriorityColor : undefined,
      goalType: goalType || undefined,
      customGoalTypeText: goalType === 'custom' ? customGoalTypeText : undefined,
      customGoalTypeColor: goalType === 'custom' ? customGoalTypeColor : undefined,
      mealType: mealType || undefined,
      dayOfWeek: dayOfWeek || undefined,
      notes: notes || undefined,
      frequency: frequency || undefined,
      cleaningLocation: cleaningLocation || undefined,
      customCleaningLocation: cleaningLocation === 'custom' ? customCleaningLocation : undefined,
      selfCareType: selfCareType || undefined,
      delegatedTo: delegatedTo || undefined,
      delegateType: delegateType || undefined,
      reminderEnabled,
      subtasks: subtasks.length > 0 ? subtasks : undefined,
      scheduledDate: selectedDate, // For calendar tasks
    };

    onSubmit(newTask);
    handleClose();
  };

  const addSubtask = () => {
    const newSubtask = {
      id: Date.now().toString(),
      title: '',
      completed: false,
    };
    setSubtasks([...subtasks, newSubtask]);
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== id));
  };

  const updateSubtask = (id: string, title: string) => {
    setSubtasks(subtasks.map(subtask => 
      subtask.id === id ? { ...subtask, title } : subtask
    ));
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={[styles.header, { borderBottomColor: pastelColor }]}>
          <Text style={[styles.title, { color: darkColor }]}>Add New Task</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={mediumColor} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Error Messages */}
          {errors.length > 0 && (
            <NeumorphicCard style={[styles.errorCard, { 
              backgroundColor: '#FED7D7',
              borderLeftColor: '#FC8181',
              shadowColor: shadowColor
            }]}>
              <Text style={[styles.errorTitle, { color: '#C53030' }]}>Please fix the following:</Text>
              {errors.map((error, index) => (
                <Text key={index} style={[styles.errorText, { color: '#C53030' }]}>
                  • {error}
                </Text>
              ))}
            </NeumorphicCard>
          )}

          <NeumorphicCard style={[styles.formCard, { shadowColor: shadowColor }]}>
            <Text style={[styles.label, { color: darkColor }]}>Task Name *</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: errors.some(e => e.includes('Task name')) ? '#FC8181' : pastelColor, 
                backgroundColor: bgColor,
                color: darkColor
              }]}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.length > 0) {
                  setErrors(errors.filter(e => !e.includes('Task name')));
                }
              }}
              placeholder="Enter task name"
              placeholderTextColor={mediumColor}
              multiline
            />

            {/* Habit Settings */}
            <View style={styles.switchRow}>
              <Text style={[styles.label, { color: darkColor }]}>Is this a habit?</Text>
              <Switch
                value={isHabit}
                onValueChange={setIsHabit}
                trackColor={{ false: pastelColor, true: accentColor }}
                thumbColor="#ffffff"
              />
            </View>

            {isHabit && (
              <>
                <Text style={[styles.label, { color: darkColor }]}>Daily Goal *</Text>
                <TextInput
                  style={[styles.input, { 
                    borderColor: errors.some(e => e.includes('habit goal')) ? '#FC8181' : pastelColor, 
                    backgroundColor: bgColor,
                    color: darkColor
                  }]}
                  value={habitGoal}
                  onChangeText={(text) => {
                    setHabitGoal(text);
                    if (errors.length > 0) {
                      setErrors(errors.filter(e => !e.includes('habit goal')));
                    }
                  }}
                  placeholder="e.g., 3"
                  placeholderTextColor={mediumColor}
                  keyboardType="numeric"
                />
              </>
            )}

            {/* Daily Tasks - Priority */}
            {category === 'daily' && (
              <>
                <Text style={[styles.label, { color: darkColor }]}>Priority *</Text>
                <View style={styles.optionGrid}>
                  {['high', 'medium', 'low', 'quick-win', 'custom'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        { backgroundColor: pastelColor },
                        priority === option && { backgroundColor: accentColor },
                        errors.some(e => e.includes('Priority')) && { borderColor: '#FC8181', borderWidth: 1 }
                      ]}
                      onPress={() => {
                        setPriority(option);
                        if (errors.length > 0) {
                          setErrors(errors.filter(e => !e.includes('Priority')));
                        }
                      }}
                    >
                      <Text style={[
                        styles.optionText,
                        { color: mediumColor },
                        priority === option && { color: pastelColor }
                      ]}>
                        {option === 'quick-win' ? 'Quick Win' : option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {priority === 'custom' && (
                  <>
                    <Text style={[styles.label, { color: darkColor }]}>Custom Priority Text *</Text>
                    <TextInput
                      style={[styles.input, { 
                        borderColor: errors.some(e => e.includes('Custom priority')) ? '#FC8181' : pastelColor, 
                        backgroundColor: bgColor,
                        color: darkColor
                      }]}
                      value={customPriorityText}
                      onChangeText={(text) => {
                        setCustomPriorityText(text);
                        if (errors.length > 0) {
                          setErrors(errors.filter(e => !e.includes('Custom priority')));
                        }
                      }}
                      placeholder="Enter custom priority"
                      placeholderTextColor={mediumColor}
                    />
                  </>
                )}
              </>
            )}

            {/* Goals - Goal Type */}
            {category === 'goals' && (
              <>
                <Text style={[styles.label, { color: darkColor }]}>Goal Type *</Text>
                <View style={styles.optionGrid}>
                  {['TBD', 'Not Priority', 'Wish', 'custom'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        { backgroundColor: pastelColor },
                        goalType === option && { backgroundColor: accentColor },
                        errors.some(e => e.includes('Goal type')) && { borderColor: '#FC8181', borderWidth: 1 }
                      ]}
                      onPress={() => {
                        setGoalType(option);
                        if (errors.length > 0) {
                          setErrors(errors.filter(e => !e.includes('Goal type')));
                        }
                      }}
                    >
                      <Text style={[
                        styles.optionText,
                        { color: mediumColor },
                        goalType === option && { color: pastelColor }
                      ]}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {goalType === 'custom' && (
                  <>
                    <Text style={[styles.label, { color: darkColor }]}>Custom Goal Type *</Text>
                    <TextInput
                      style={[styles.input, { 
                        borderColor: errors.some(e => e.includes('Custom goal type')) ? '#FC8181' : pastelColor, 
                        backgroundColor: bgColor,
                        color: darkColor
                      }]}
                      value={customGoalTypeText}
                      onChangeText={(text) => {
                        setCustomGoalTypeText(text);
                        if (errors.length > 0) {
                          setErrors(errors.filter(e => !e.includes('Custom goal type')));
                        }
                      }}
                      placeholder="Enter custom goal type"
                      placeholderTextColor={mediumColor}
                    />
                  </>
                )}
              </>
            )}

            {/* Meal Prep */}
            {category === 'meal-prep' && (
              <>
                <Text style={[styles.label, { color: darkColor }]}>Meal Type *</Text>
                <View style={styles.optionGrid}>
                  {['breakfast', 'lunch', 'dinner', 'snack'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        { backgroundColor: pastelColor },
                        mealType === option && { backgroundColor: accentColor },
                        errors.some(e => e.includes('Meal type')) && { borderColor: '#FC8181', borderWidth: 1 }
                      ]}
                      onPress={() => {
                        setMealType(option);
                        if (errors.length > 0) {
                          setErrors(errors.filter(e => !e.includes('Meal type')));
                        }
                      }}
                    >
                      <Text style={[
                        styles.optionText,
                        { color: mediumColor },
                        mealType === option && { color: pastelColor }
                      ]}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.label, { color: darkColor }]}>Day of Week</Text>
                <View style={styles.optionGrid}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.optionButton,
                        { backgroundColor: pastelColor },
                        dayOfWeek === day && { backgroundColor: accentColor }
                      ]}
                      onPress={() => setDayOfWeek(day)}
                    >
                      <Text style={[
                        styles.optionText,
                        { color: mediumColor },
                        dayOfWeek === day && { color: pastelColor }
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.label, { color: darkColor }]}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { 
                    borderColor: pastelColor, 
                    backgroundColor: bgColor,
                    color: darkColor
                  }]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add any notes or details"
                  placeholderTextColor={mediumColor}
                  multiline
                  numberOfLines={3}
                />
              </>
            )}

            {/* Cleaning */}
            {category === 'cleaning' && (
              <>
                <Text style={[styles.label, { color: darkColor }]}>Frequency *</Text>
                <View style={styles.optionGrid}>
                  {['daily', 'weekly', 'monthly', 'seasonal'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        { backgroundColor: pastelColor },
                        frequency === option && { backgroundColor: accentColor },
                        errors.some(e => e.includes('Frequency')) && { borderColor: '#FC8181', borderWidth: 1 }
                      ]}
                      onPress={() => {
                        setFrequency(option);
                        if (errors.length > 0) {
                          setErrors(errors.filter(e => !e.includes('Frequency')));
                        }
                      }}
                    >
                      <Text style={[
                        styles.optionText,
                        { color: mediumColor },
                        frequency === option && { color: pastelColor }
                      ]}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.label, { color: darkColor }]}>Location *</Text>
                <View style={styles.optionGrid}>
                  {['kitchen', 'bathroom', 'bedroom', 'custom'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        { backgroundColor: pastelColor },
                        cleaningLocation === option && { backgroundColor: accentColor },
                        errors.some(e => e.includes('Location')) && { borderColor: '#FC8181', borderWidth: 1 }
                      ]}
                      onPress={() => {
                        setCleaningLocation(option);
                        if (errors.length > 0) {
                          setErrors(errors.filter(e => !e.includes('Location')));
                        }
                      }}
                    >
                      <Text style={[
                        styles.optionText,
                        { color: mediumColor },
                        cleaningLocation === option && { color: pastelColor }
                      ]}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {cleaningLocation === 'custom' && (
                  <>
                    <Text style={[styles.label, { color: darkColor }]}>Custom Location *</Text>
                    <TextInput
                      style={[styles.input, { 
                        borderColor: errors.some(e => e.includes('Custom location')) ? '#FC8181' : pastelColor, 
                        backgroundColor: bgColor,
                        color: darkColor
                      }]}
                      value={customCleaningLocation}
                      onChangeText={(text) => {
                        setCustomCleaningLocation(text);
                        if (errors.length > 0) {
                          setErrors(errors.filter(e => !e.includes('Custom location')));
                        }
                      }}
                      placeholder="Enter custom location"
                      placeholderTextColor={mediumColor}
                    />
                  </>
                )}
              </>
            )}

            {/* Self-Care */}
            {category === 'self-care' && (
              <>
                <Text style={[styles.label, { color: darkColor }]}>Self-Care Type *</Text>
                <View style={styles.optionGrid}>
                  {['physical', 'mental', 'rest', 'joy'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        { backgroundColor: pastelColor },
                        selfCareType === option && { backgroundColor: accentColor },
                        errors.some(e => e.includes('Self-care type')) && { borderColor: '#FC8181', borderWidth: 1 }
                      ]}
                      onPress={() => {
                        setSelfCareType(option);
                        if (errors.length > 0) {
                          setErrors(errors.filter(e => !e.includes('Self-care type')));
                        }
                      }}
                    >
                      <Text style={[
                        styles.optionText,
                        { color: mediumColor },
                        selfCareType === option && { color: pastelColor }
                      ]}>
                        {option === 'physical' ? 'Physical Health' :
                         option === 'mental' ? 'Mental Health' :
                         option === 'rest' ? 'Rest & Recovery' :
                         'Joy & Connection'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* Delegation */}
            {category === 'delegation' && (
              <>
                <Text style={[styles.label, { color: darkColor }]}>Delegate To *</Text>
                <TextInput
                  style={[styles.input, { 
                    borderColor: errors.some(e => e.includes('Person to delegate')) ? '#FC8181' : pastelColor, 
                    backgroundColor: bgColor,
                    color: darkColor
                  }]}
                  value={delegatedTo}
                  onChangeText={(text) => {
                    setDelegatedTo(text);
                    if (errors.length > 0) {
                      setErrors(errors.filter(e => !e.includes('Person to delegate')));
                    }
                  }}
                  placeholder="Who will handle this task?"
                  placeholderTextColor={mediumColor}
                />

                <Text style={[styles.label, { color: darkColor }]}>Delegate Type *</Text>
                <View style={styles.optionGrid}>
                  {['partner', 'family', 'friends', 'kids'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        { backgroundColor: pastelColor },
                        delegateType === option && { backgroundColor: accentColor },
                        errors.some(e => e.includes('Delegate type')) && { borderColor: '#FC8181', borderWidth: 1 }
                      ]}
                      onPress={() => {
                        setDelegateType(option);
                        if (errors.length > 0) {
                          setErrors(errors.filter(e => !e.includes('Delegate type')));
                        }
                      }}
                    >
                      <Text style={[
                        styles.optionText,
                        { color: mediumColor },
                        delegateType === option && { color: pastelColor }
                      ]}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.switchRow}>
                  <Text style={[styles.label, { color: darkColor }]}>Enable Reminders</Text>
                  <Switch
                    value={reminderEnabled}
                    onValueChange={setReminderEnabled}
                    trackColor={{ false: pastelColor, true: accentColor }}
                    thumbColor="#ffffff"
                  />
                </View>
              </>
            )}

            {/* Calendar Tasks */}
            {category === 'weekly' && selectedDate && (
              <View style={[styles.dateInfo, { 
                backgroundColor: accentColor,
                borderColor: darkColor
              }]}>
                <Text style={[styles.dateInfoText, { color: pastelColor }]}>
                  Scheduled for: {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
              </View>
            )}

            {/* Subtasks */}
            <View style={styles.subtasksSection}>
              <View style={styles.subtasksHeader}>
                <Text style={[styles.label, { color: darkColor }]}>Subtasks</Text>
                <TouchableOpacity 
                  onPress={addSubtask} 
                  style={[styles.addSubtaskButton, { backgroundColor: accentColor }]}
                >
                  <Plus size={16} color={pastelColor} />
                </TouchableOpacity>
              </View>

              {subtasks.map((subtask, index) => (
                <View key={subtask.id} style={styles.subtaskRow}>
                  <TextInput
                    style={[styles.input, styles.subtaskInput, { 
                      borderColor: pastelColor, 
                      backgroundColor: bgColor,
                      color: darkColor
                    }]}
                    value={subtask.title}
                    onChangeText={(text) => updateSubtask(subtask.id, text)}
                    placeholder={`Subtask ${index + 1}`}
                    placeholderTextColor={mediumColor}
                  />
                  <TouchableOpacity
                    onPress={() => removeSubtask(subtask.id)}
                    style={[styles.removeSubtaskButton, { backgroundColor: '#FED7D7' }]}
                  >
                    <Minus size={16} color="#FC8181" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </NeumorphicCard>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: pastelColor }]}>
          <TouchableOpacity 
            style={[styles.cancelButton, { backgroundColor: pastelColor }]} 
            onPress={handleClose}
          >
            <Text style={[styles.cancelText, { color: mediumColor }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: darkColor }]}
            onPress={handleSubmit}
          >
            <Text style={[styles.submitText, { color: pastelColor }]}>Add Task</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
  },
  errorCard: {
    margin: 12,
    borderLeftWidth: 4,
  },
  errorTitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    marginBottom: 4,
  },
  formCard: {
    margin: 12,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
  },
  dateInfo: {
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
  },
  dateInfoText: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    textAlign: 'center',
  },
  subtasksSection: {
    marginTop: 16,
  },
  subtasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addSubtaskButton: {
    padding: 8,
    borderRadius: 20,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtaskInput: {
    flex: 1,
    marginRight: 8,
  },
  removeSubtaskButton: {
    padding: 8,
    borderRadius: 20,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
  },
  submitButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
  },
});