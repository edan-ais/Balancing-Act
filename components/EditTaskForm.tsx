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
}

export default function EditTaskForm({
  visible,
  onClose,
  onSubmit,
  initialTask,
  colors,
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

  // Map category to appropriate tab color key
  const getCategoryColorKey = () => {
    if (!initialTask) return 'daily';
    
    switch (initialTask.category) {
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
  
  // Use the tab colors from the theme
  const veryDarkColor = tabColors.veryDark || '#333333';
  const shadowColor = tabColors.shadow || '#444444';
  const darkColor = tabColors.dark || '#555555';
  const mediumColor = tabColors.medium || '#777777';
  const accentColor = tabColors.accent || '#999999';
  const highlightColor = tabColors.highlight || '#AAAAAA';
  const bgAltColor = tabColors.bgAlt || '#F0F0F0';
  const pastelColor = tabColors.pastel || '#E0E0E0';
  const bgColor = tabColors.bg || '#FFFFFF';

  // Helper to get tag color from theme
  const getTagColor = (tagType: string, tagValue: string) => {
    if (colors?.tagColors?.[tagType]?.[tagValue]) {
      return colors.tagColors[tagType][tagValue];
    }
    return colors?.tagColors?.[tagType]?.default || mediumColor;
  };

  // Get priority color based on theme
  const getPriorityColor = (priorityValue: string) => {
    if (priorityValue === 'custom') return customPriorityColor;
    return getTagColor('priority', priorityValue);
  };

  // Get goal type color based on theme
  const getGoalTypeColor = (goalTypeValue: string) => {
    if (goalTypeValue === 'custom') return customGoalTypeColor;
    // Convert from camelCase to lowercase with spaces if needed
    const key = goalTypeValue === 'TBD' ? 'tbd' : 
                goalTypeValue === 'Not Priority' ? 'notPriority' : 
                goalTypeValue.toLowerCase();
    return getTagColor('goalType', key);
  };

  // Get day of week color based on theme
  const getDayOfWeekColor = (day: string) => {
    const key = day.toLowerCase();
    return getTagColor('dayOfWeek', key);
  };
  
  // Get meal type color based on theme
  const getMealTypeColor = (type: string) => {
    return getTagColor('mealType', type);
  };

  // Get cleaning location color based on theme
  const getCleaningLocationColor = (location: string) => {
    return getTagColor('cleaningLocation', location);
  };

  // Get self-care type color based on theme
  const getSelfCareTypeColor = (type: string) => {
    return getTagColor('selfCareType', type);
  };

  // Get delegate type color based on theme
  const getDelegateTypeColor = (type: string) => {
    return getTagColor('delegateType', type);
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
        <View style={[styles.modalContainer, { backgroundColor: bgColor }]}>
          <View style={[styles.header, { 
            borderBottomColor: pastelColor,
            backgroundColor: bgAltColor 
          }]}>
            <Text style={[styles.title, { color: darkColor }]}>Edit Task</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={mediumColor} />
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
                  trackColor={{ false: pastelColor, true: highlightColor }}
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
              {initialTask.category === 'daily' && (
                <>
                  <Text style={[styles.label, { color: darkColor }]}>Priority *</Text>
                  <View style={styles.optionGrid}>
                    {['high', 'medium', 'low', 'quick-win', 'custom'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { backgroundColor: pastelColor },
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
                          { color: mediumColor },
                          priority === option && { color: '#FFFFFF' }
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
              {initialTask.category === 'goals' && (
                <>
                  <Text style={[styles.label, { color: darkColor }]}>Goal Type *</Text>
                  <View style={styles.optionGrid}>
                    {['TBD', 'Not Priority', 'Wish', 'custom'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { backgroundColor: pastelColor },
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
                          { color: mediumColor },
                          goalType === option && { color: '#FFFFFF' }
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
              {initialTask.category === 'meal-prep' && (
                <>
                  <Text style={[styles.label, { color: darkColor }]}>Meal Type *</Text>
                  <View style={styles.optionGrid}>
                    {['breakfast', 'lunch', 'dinner', 'snack'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { backgroundColor: pastelColor },
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
                          { color: mediumColor },
                          mealType === option && { color: '#FFFFFF' }
                        ]}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.label, { color: darkColor }]}>Day of Week</Text>
                  <View style={styles.optionGrid}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                      const dayKey = day.toLowerCase();
                      return (
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.optionButton,
                            { backgroundColor: pastelColor },
                            dayOfWeek === day && { backgroundColor: getDayOfWeekColor(dayKey) }
                          ]}
                          onPress={() => setDayOfWeek(day)}
                        >
                          <Text style={[
                            styles.optionText,
                            { color: mediumColor },
                            dayOfWeek === day && { color: '#FFFFFF' }
                          ]}>
                            {day}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
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
              {initialTask.category === 'cleaning' && (
                <>
                  <Text style={[styles.label, { color: darkColor }]}>Frequency *</Text>
                  <View style={styles.optionGrid}>
                    {['daily', 'weekly', 'monthly', 'seasonal'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { backgroundColor: pastelColor },
                          frequency === option && { backgroundColor: highlightColor },
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
                          frequency === option && { color: '#FFFFFF' }
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
                          { color: mediumColor },
                          cleaningLocation === option && { color: '#FFFFFF' }
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
              {initialTask.category === 'self-care' && (
                <>
                  <Text style={[styles.label, { color: darkColor }]}>Self-Care Type *</Text>
                  <View style={styles.optionGrid}>
                    {['physical', 'mental', 'rest', 'joy'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { backgroundColor: pastelColor },
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
                          { color: mediumColor },
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
                          { color: mediumColor },
                          delegateType === option && { color: '#FFFFFF' }
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
                      trackColor={{ false: pastelColor, true: highlightColor }}
                      thumbColor="#ffffff"
                    />
                  </View>
                </>
              )}

              {/* Subtasks */}
              <View style={styles.subtasksSection}>
                <View style={styles.subtasksHeader}>
                  <Text style={[styles.label, { color: darkColor }]}>Subtasks</Text>
                  <TouchableOpacity 
                    onPress={addSubtask} 
                    style={[styles.addSubtaskButton, { backgroundColor: highlightColor }]}
                  >
                    <Plus size={16} color="#FFFFFF" />
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
            </View>
          </ScrollView>

          <View style={[styles.footer, { 
            borderTopColor: pastelColor,
            backgroundColor: bgAltColor
          }]}>
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
    flexGrow: 1,
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