import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { X, Plus, Minus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Task } from './TaskItem';

interface EditTaskFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (updatedTask: Task) => void;
  initialTask: Task | null;
  colors?: any; // Theme colors
  accentColor?: string;
  darkColor?: string;
  bgColor?: string;
  mediumColor?: string;
  pastelColor?: string;
  shadowColor?: string;
}

export default function EditTaskForm({
  visible,
  onClose,
  onSubmit,
  initialTask,
  colors,
  accentColor = '#4055C5',
  darkColor = '#2B6CB0',
  bgColor = '#F5F7FA',
  mediumColor = '#4A5568',
  pastelColor = '#E2E8F0',
  shadowColor = '#C8D0E0'
}: EditTaskFormProps) {
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

  // Use theme colors if provided, otherwise use props
  const themeColors = colors || {};
  const effectiveAccentColor = colors?.accent || accentColor;
  const effectiveDarkColor = colors?.dark || darkColor;
  const effectiveBgColor = colors?.bg || bgColor;
  const effectiveMediumColor = colors?.medium || mediumColor;
  const effectivePastelColor = colors?.pastel || pastelColor;
  const effectiveShadowColor = colors?.shadow || shadowColor;

  // Helper to get tag color from theme
  const getTagColor = (tagType: string, tagValue: string) => {
    if (colors?.tagColors && colors.tagColors[tagType] && colors.tagColors[tagType][tagValue]) {
      return colors.tagColors[tagType][tagValue];
    }
    return null;
  };

  // Get priority color based on theme
  const getPriorityColor = (priorityValue: string) => {
    if (priorityValue === 'custom') return customPriorityColor;
    return getTagColor('priority', priorityValue) || effectiveAccentColor;
  };

  // Get goal type color based on theme
  const getGoalTypeColor = (goalTypeValue: string) => {
    if (goalTypeValue === 'custom') return customGoalTypeColor;
    // Convert from camelCase to lowercase with spaces if needed
    const key = goalTypeValue === 'TBD' ? 'tbd' : 
                goalTypeValue === 'Not Priority' ? 'notPriority' : 
                goalTypeValue.toLowerCase();
    return getTagColor('goalType', key) || effectiveAccentColor;
  };

  // Get day of week color based on theme
  const getDayOfWeekColor = (day: string) => {
    const key = day.toLowerCase();
    return getTagColor('dayOfWeek', key) || effectiveAccentColor;
  };
  
  // Get meal type color based on theme
  const getMealTypeColor = (type: string) => {
    return getTagColor('mealType', type) || effectiveAccentColor;
  };

  // Get cleaning location color based on theme
  const getCleaningLocationColor = (location: string) => {
    return getTagColor('cleaningLocation', location) || effectiveAccentColor;
  };

  // Get self-care type color based on theme
  const getSelfCareTypeColor = (type: string) => {
    return getTagColor('selfCareType', type) || effectiveAccentColor;
  };

  // Get delegate type color based on theme
  const getDelegateTypeColor = (type: string) => {
    return getTagColor('delegateType', type) || effectiveAccentColor;
  };

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setIsHabit(initialTask.isHabit || false);
      setHabitGoal(initialTask.habitGoal?.toString() || '');
      setPriority(initialTask.priority || '');
      setCustomPriorityText(initialTask.customPriorityText || '');
      setCustomPriorityColor(initialTask.customPriorityColor || colors?.tagColors?.priority?.custom || '#4A5568');
      setGoalType(initialTask.goalType || '');
      setCustomGoalTypeText(initialTask.customGoalTypeText || '');
      setCustomGoalTypeColor(initialTask.customGoalTypeColor || colors?.tagColors?.goalType?.custom || '#4A5568');
      setMealType(initialTask.mealType || '');
      setDayOfWeek(initialTask.dayOfWeek || '');
      setNotes(initialTask.notes || '');
      setFrequency(initialTask.frequency || '');
      setCleaningLocation(initialTask.cleaningLocation || '');
      setCustomCleaningLocation(initialTask.customCleaningLocation || '');
      setSelfCareType(initialTask.selfCareType || '');
      setDelegatedTo(initialTask.delegatedTo || '');
      setDelegateType(initialTask.delegateType || '');
      setReminderEnabled(initialTask.reminderEnabled || false);
      setSubtasks(initialTask.subtasks || []);
      setErrors([]);
    }
  }, [initialTask, colors]);

  const resetForm = () => {
    setTitle('');
    setIsHabit(false);
    setHabitGoal('');
    setPriority('');
    setCustomPriorityText('');
    setCustomPriorityColor(colors?.tagColors?.priority?.custom || '#4A5568');
    setGoalType('');
    setCustomGoalTypeText('');
    setCustomGoalTypeColor(colors?.tagColors?.goalType?.custom || '#4A5568');
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
    if (initialTask) {
      switch (initialTask.category) {
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
      }
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
    if (!initialTask) return;
    
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedTask: Task = {
      ...initialTask,
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
    };

    onSubmit(updatedTask);
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

  if (!initialTask) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: effectiveBgColor }]}>
          <View style={[styles.header, { borderBottomColor: effectivePastelColor }]}>
            <Text style={[styles.title, { color: effectiveDarkColor }]}>Edit Task</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={effectiveMediumColor} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Error Messages */}
            {errors.length > 0 && (
              <View style={[styles.errorCard, { 
                backgroundColor: '#FED7D7',
                borderLeftColor: '#FC8181',
              }]}>
                <Text style={[styles.errorTitle, { color: '#C53030' }]}>Please fix the following:</Text>
                {errors.map((error, index) => (
                  <Text key={index} style={[styles.errorText, { color: '#C53030' }]}>
                    • {error}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.formSection}>
              <Text style={[styles.label, { color: effectiveDarkColor }]}>Task Name *</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: errors.some(e => e.includes('Task name')) ? '#FC8181' : effectivePastelColor, 
                  backgroundColor: effectiveBgColor,
                  color: effectiveDarkColor
                }]}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errors.length > 0) {
                    setErrors(errors.filter(e => !e.includes('Task name')));
                  }
                }}
                placeholder="Enter task name"
                placeholderTextColor={effectiveMediumColor}
                multiline
              />

              {/* Habit Settings */}
              <View style={styles.switchRow}>
                <Text style={[styles.label, { color: effectiveDarkColor }]}>Is this a habit?</Text>
                <Switch
                  value={isHabit}
                  onValueChange={setIsHabit}
                  trackColor={{ false: effectivePastelColor, true: effectiveAccentColor }}
                  thumbColor="#ffffff"
                />
              </View>

              {isHabit && (
                <>
                  <Text style={[styles.label, { color: effectiveDarkColor }]}>Daily Goal *</Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: errors.some(e => e.includes('habit goal')) ? '#FC8181' : effectivePastelColor, 
                      backgroundColor: effectiveBgColor,
                      color: effectiveDarkColor
                    }]}
                    value={habitGoal}
                    onChangeText={(text) => {
                      setHabitGoal(text);
                      if (errors.length > 0) {
                        setErrors(errors.filter(e => !e.includes('habit goal')));
                      }
                    }}
                    placeholder="e.g., 3"
                    placeholderTextColor={effectiveMediumColor}
                    keyboardType="numeric"
                  />
                </>
              )}

              {/* Daily Tasks - Priority */}
              {initialTask.category === 'daily' && (
                <>
                  <Text style={[styles.label, { color: effectiveDarkColor }]}>Priority *</Text>
                  <View style={styles.optionGrid}>
                    {['high', 'medium', 'low', 'quick-win', 'custom'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { backgroundColor: effectivePastelColor },
                          priority === option && { backgroundColor: getPriorityColor(option) },
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
                          { color: effectiveMediumColor },
                          priority === option && { color: '#FFFFFF' }
                        ]}>
                          {option === 'quick-win' ? 'Quick Win' : option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {priority === 'custom' && (
                    <>
                      <Text style={[styles.label, { color: effectiveDarkColor }]}>Custom Priority Text *</Text>
                      <TextInput
                        style={[styles.input, { 
                          borderColor: errors.some(e => e.includes('Custom priority')) ? '#FC8181' : effectivePastelColor, 
                          backgroundColor: effectiveBgColor,
                          color: effectiveDarkColor
                        }]}
                        value={customPriorityText}
                        onChangeText={(text) => {
                          setCustomPriorityText(text);
                          if (errors.length > 0) {
                            setErrors(errors.filter(e => !e.includes('Custom priority')));
                          }
                        }}
                        placeholder="Enter custom priority"
                        placeholderTextColor={effectiveMediumColor}
                      />
                    </>
                  )}
                </>
              )}

              {/* Goals - Goal Type */}
              {initialTask.category === 'goals' && (
                <>
                  <Text style={[styles.label, { color: effectiveDarkColor }]}>Goal Type *</Text>
                  <View style={styles.optionGrid}>
                    {['TBD', 'Not Priority', 'Wish', 'custom'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { backgroundColor: effectivePastelColor },
                          goalType === option && { backgroundColor: getGoalTypeColor(option) },
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
                          { color: effectiveMediumColor },
                          goalType === option && { color: '#FFFFFF' }
                        ]}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {goalType === 'custom' && (
                    <>
                      <Text style={[styles.label, { color: effectiveDarkColor }]}>Custom Goal Type *</Text>
                      <TextInput
                        style={[styles.input, { 
                          borderColor: errors.some(e => e.includes('Custom goal type')) ? '#FC8181' : effectivePastelColor, 
                          backgroundColor: effectiveBgColor,
                          color: effectiveDarkColor
                        }]}
                        value={customGoalTypeText}
                        onChangeText={(text) => {
                          setCustomGoalTypeText(text);
                          if (errors.length > 0) {
                            setErrors(errors.filter(e => !e.includes('Custom goal type')));
                          }
                        }}
                        placeholder="Enter custom goal type"
                        placeholderTextColor={effectiveMediumColor}
                      />
                    </>
                  )}
                </>
              )}

              {/* Meal Prep */}
              {initialTask.category === 'meal-prep' && (
                <>
                  <Text style={[styles.label, { color: effectiveDarkColor }]}>Meal Type *</Text>
                  <View style={styles.optionGrid}>
                    {['breakfast', 'lunch', 'dinner', 'snack'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { backgroundColor: effectivePastelColor },
                          mealType === option && { backgroundColor: getMealTypeColor(option) },
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
                          { color: effectiveMediumColor },
                          mealType === option && { color: '#FFFFFF' }
                        ]}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.label, { color: effectiveDarkColor }]}>Day of Week</Text>
                  <View style={styles.optionGrid}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                      const dayKey = day.toLowerCase();
                      return (
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.optionButton,
                            { backgroundColor: effectivePastelColor },
                            dayOfWeek === day && { backgroundColor: getDayOfWeekColor(dayKey) }
                          ]}
                          onPress={() => setDayOfWeek(day)}
                        >
                          <Text style={[
                            styles.optionText,
                            { color: effectiveMediumColor },
                            dayOfWeek === day && { color: '#FFFFFF' }
                          ]}>
                            {day}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <Text style={[styles.label, { color: effectiveDarkColor }]}>Notes</Text>
                  <TextInput
                    style={[styles.input, styles.textArea, { 
                      borderColor: effectivePastelColor, 
                      backgroundColor: effectiveBgColor,
                      color: effectiveDarkColor
                    }]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Add any notes or details"
                    placeholderTextColor={effectiveMediumColor}
                    multiline
                    numberOfLines={3}
                  />
                </>
              )}

              {/* Cleaning */}
              {initialTask.category === 'cleaning' && (
                <>
                  <Text style={[styles.label, { color: effectiveDarkColor }]}>Frequency *</Text>
                  <View style={styles.optionGrid}>
                    {['daily', 'weekly', 'monthly', 'seasonal'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { backgroundColor: effectivePastelColor },
                          frequency === option && { backgroundColor: effectiveAccentColor },
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
                          { color: effectiveMediumColor },
                          frequency === option && { color: '#FFFFFF' }
                        ]}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.label, { color: effectiveDarkColor }]}>Location *</Text>
                  <View style={styles.optionGrid}>
                    {['kitchen', 'bathroom', 'bedroom', 'custom'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { backgroundColor: effectivePastelColor },
                          cleaningLocation === option && { backgroundColor: getCleaningLocationColor(option) },
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
                          { color: effectiveMediumColor },
                          cleaningLocation === option && { color: '#FFFFFF' }
                        ]}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {cleaningLocation === 'custom' && (
                    <>
                      <Text style={[styles.label, { color: effectiveDarkColor }]}>Custom Location *</Text>
                      <TextInput
                        style={[styles.input, { 
                          borderColor: errors.some(e => e.includes('Custom location')) ? '#FC8181' : effectivePastelColor, 
                          backgroundColor: effectiveBgColor,
                          color: effectiveDarkColor
                        }]}
                        value={customCleaningLocation}
                        onChangeText={(text) => {
                          setCustomCleaningLocation(text);
                          if (errors.length > 0) {
                            setErrors(errors.filter(e => !e.includes('Custom location')));
                          }
                        }}
                        placeholder="Enter custom location"
                        placeholderTextColor={effectiveMediumColor}
                      />
                    </>
                  )}
                </>
              )}

              {/* Self-Care */}
              {initialTask.category === 'self-care' && (
                <>
                  <Text style={[styles.label, { color: effectiveDarkColor }]}>Self-Care Type *</Text>
                  <View style={styles.optionGrid}>
                    {['physical', 'mental', 'rest', 'joy'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { backgroundColor: effectivePastelColor },
                          selfCareType === option && { backgroundColor: getSelfCareTypeColor(option) },
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
                          { color: effectiveMediumColor },
                          selfCareType === option && { color: '#FFFFFF' }
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
              {initialTask.category === 'delegation' && (
                <>
                  <Text style={[styles.label, { color: effectiveDarkColor }]}>Delegate To *</Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: errors.some(e => e.includes('Person to delegate')) ? '#FC8181' : effectivePastelColor, 
                      backgroundColor: effectiveBgColor,
                      color: effectiveDarkColor
                    }]}
                    value={delegatedTo}
                    onChangeText={(text) => {
                      setDelegatedTo(text);
                      if (errors.length > 0) {
                        setErrors(errors.filter(e => !e.includes('Person to delegate')));
                      }
                    }}
                    placeholder="Who will handle this task?"
                    placeholderTextColor={effectiveMediumColor}
                  />

                  <Text style={[styles.label, { color: effectiveDarkColor }]}>Delegate Type *</Text>
                  <View style={styles.optionGrid}>
                    {['partner', 'family', 'friends', 'kids'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { backgroundColor: effectivePastelColor },
                          delegateType === option && { backgroundColor: getDelegateTypeColor(option) },
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
                          { color: effectiveMediumColor },
                          delegateType === option && { color: '#FFFFFF' }
                        ]}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.switchRow}>
                    <Text style={[styles.label, { color: effectiveDarkColor }]}>Enable Reminders</Text>
                    <Switch
                      value={reminderEnabled}
                      onValueChange={setReminderEnabled}
                      trackColor={{ false: effectivePastelColor, true: effectiveAccentColor }}
                      thumbColor="#ffffff"
                    />
                  </View>
                </>
              )}

              {/* Subtasks */}
              <View style={styles.subtasksSection}>
                <View style={styles.subtasksHeader}>
                  <Text style={[styles.label, { color: effectiveDarkColor }]}>Subtasks</Text>
                  <TouchableOpacity 
                    onPress={addSubtask} 
                    style={[styles.addSubtaskButton, { backgroundColor: effectiveAccentColor }]}
                  >
                    <Plus size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {subtasks.map((subtask, index) => (
                  <View key={subtask.id} style={styles.subtaskRow}>
                    <TextInput
                      style={[styles.input, styles.subtaskInput, { 
                        borderColor: effectivePastelColor, 
                        backgroundColor: effectiveBgColor,
                        color: effectiveDarkColor
                      }]}
                      value={subtask.title}
                      onChangeText={(text) => updateSubtask(subtask.id, text)}
                      placeholder={`Subtask ${index + 1}`}
                      placeholderTextColor={effectiveMediumColor}
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
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: effectivePastelColor }]}>
            <TouchableOpacity 
              style={[styles.cancelButton, { backgroundColor: effectivePastelColor }]} 
              onPress={handleClose}
            >
              <Text style={[styles.cancelText, { color: effectiveMediumColor }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: effectiveDarkColor }]}
              onPress={handleSubmit}
            >
              <Text style={[styles.submitText, { color: "#FFFFFF" }]}>Update Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '90%',
    borderRadius: 16,
    overflow: 'hidden',
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
    paddingHorizontal: 16,
    maxHeight: '70%',
  },
  errorCard: {
    marginTop: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
  formSection: {
    paddingVertical: 8,
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