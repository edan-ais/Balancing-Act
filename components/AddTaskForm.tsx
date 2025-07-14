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
  colors?: any; // Theme colors
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
  colors,
  accentColor = '#4055C5',
  darkColor = '#2B6CB0',
  bgColor = '#F5F7FA',
  mediumColor = '#4A5568',
  pastelColor = '#E2E8F0',
  shadowColor = '#C8D0E0'
}: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [isHabit, setIsHabit] = useState(false);
  const [habitGoal, setHabitGoal] = useState('1');
  const [priority, setPriority] = useState<string>('');
  const [customPriorityText, setCustomPriorityText] = useState('');
  const [customPriorityColor, setCustomPriorityColor] = useState(colors?.tagColors?.priority?.custom || '#4A5568');
  const [goalType, setGoalType] = useState<string>('');
  const [customGoalTypeText, setCustomGoalTypeText] = useState('');
  const [customGoalTypeColor, setCustomGoalTypeColor] = useState(colors?.tagColors?.goalType?.custom || '#4A5568');
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
    return colors?.tagColors?.[tagType]?.default || effectiveAccentColor;
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

  const resetForm = () => {
    setTitle('');
    setIsHabit(false);
    setHabitGoal('1');
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
    switch (category) {
      case 'meal-prep':
        if (!mealType) {
          validationErrors.push('Meal type is required for meal prep tasks');
        }
        break;

      case 'cleaning':
        if (!frequency) {
          validationErrors.push('Frequency is required for cleaning tasks');
        }
        // Location is now optional
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

  const incrementHabitGoal = () => {
    const currentGoal = parseInt(habitGoal) || 1;
    setHabitGoal((currentGoal + 1).toString());
  };

  const decrementHabitGoal = () => {
    const currentGoal = parseInt(habitGoal) || 1;
    if (currentGoal > 1) {
      setHabitGoal((currentGoal - 1).toString());
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: effectiveBgColor }]}>
          <View style={[styles.header, { borderBottomColor: effectivePastelColor }]}>
            <Text style={[styles.title, { color: effectiveDarkColor }]}>Add New Task</Text>
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

              {/* Habit Settings - Only for Daily and Calendar tabs */}
              {(category === 'daily' || category === 'weekly') && (
                <View style={styles.taskTypeSection}>
                  <Text style={[styles.label, { color: effectiveDarkColor }]}>Task Type (Optional)</Text>
                  <View style={[styles.toggleContainer, { borderColor: effectivePastelColor }]}>
                    <TouchableOpacity
                      style={[
                        styles.toggleButton, 
                        { backgroundColor: !isHabit ? effectiveAccentColor : effectiveBgColor }
                      ]}
                      onPress={() => setIsHabit(false)}
                    >
                      <Text style={[
                        styles.toggleText, 
                        { color: !isHabit ? '#FFFFFF' : effectiveMediumColor }
                      ]}>
                        Task
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.toggleButton, 
                        { backgroundColor: isHabit ? effectiveAccentColor : effectiveBgColor }
                      ]}
                      onPress={() => setIsHabit(true)}
                    >
                      <Text style={[
                        styles.toggleText, 
                        { color: isHabit ? '#FFFFFF' : effectiveMediumColor }
                      ]}>
                        Habit
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {isHabit && (
                    <View style={styles.habitGoalSection}>
                      <Text style={[styles.label, { color: effectiveDarkColor }]}>Daily Goal</Text>
                      <View style={styles.counterContainer}>
                        <TouchableOpacity
                          style={[styles.counterButton, { backgroundColor: effectivePastelColor }]}
                          onPress={decrementHabitGoal}
                        >
                          <Minus size={16} color={effectiveMediumColor} />
                        </TouchableOpacity>
                        <Text style={[styles.counterText, { color: effectiveDarkColor }]}>
                          {habitGoal}
                        </Text>
                        <TouchableOpacity
                          style={[styles.counterButton, { backgroundColor: effectivePastelColor }]}
                          onPress={incrementHabitGoal}
                        >
                          <Plus size={16} color={effectiveMediumColor} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              )}

              {/* Daily Tasks - Priority (Optional) */}
              {category === 'daily' && (
                <>
                  <Text style={[styles.label, { color: effectiveDarkColor }]}>Priority (Optional)</Text>
                  <View style={styles.optionGrid}>
                    {['high', 'medium', 'low', 'quick-win', 'custom'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { backgroundColor: effectivePastelColor },
                          priority === option && { backgroundColor: getPriorityColor(option) }
                        ]}
                        onPress={() => {
                          setPriority(option);
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
                      <Text style={[styles.label, { color: effectiveDarkColor }]}>Custom Priority Text</Text>
                      <TextInput
                        style={[styles.input, { 
                          borderColor: effectivePastelColor, 
                          backgroundColor: effectiveBgColor,
                          color: effectiveDarkColor
                        }]}
                        value={customPriorityText}
                        onChangeText={setCustomPriorityText}
                        placeholder="Enter custom priority"
                        placeholderTextColor={effectiveMediumColor}
                      />
                      
                      <Text style={[styles.label, { color: effectiveDarkColor }]}>Custom Color</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorWheelContainer}>
                        <View style={styles.colorWheel}>
                          {Object.values(colors.tagColors.priority).map((color: string, index: number) => (
                            <TouchableOpacity
                              key={index}
                              style={[
                                styles.colorOption,
                                { backgroundColor: color },
                                customPriorityColor === color && styles.selectedColor
                              ]}
                              onPress={() => setCustomPriorityColor(color)}
                            />
                          ))}
                        </View>
                      </ScrollView>
                    </>
                  )}
                </>
              )}

              {/* Goals - Goal Type (Optional) */}
              {category === 'goals' && (
                <>
                  <Text style={[styles.label, { color: effectiveDarkColor }]}>Goal Type (Optional)</Text>
                  <View style={styles.optionGrid}>
                    {['TBD', 'Not Priority', 'Wish', 'custom'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { backgroundColor: effectivePastelColor },
                          goalType === option && { backgroundColor: getGoalTypeColor(option) }
                        ]}
                        onPress={() => {
                          setGoalType(option);
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
                      <Text style={[styles.label, { color: effectiveDarkColor }]}>Custom Goal Type</Text>
                      <TextInput
                        style={[styles.input, { 
                          borderColor: effectivePastelColor, 
                          backgroundColor: effectiveBgColor,
                          color: effectiveDarkColor
                        }]}
                        value={customGoalTypeText}
                        onChangeText={setCustomGoalTypeText}
                        placeholder="Enter custom goal type"
                        placeholderTextColor={effectiveMediumColor}
                      />
                      
                      <Text style={[styles.label, { color: effectiveDarkColor }]}>Custom Color</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorWheelContainer}>
                        <View style={styles.colorWheel}>
                          {Object.values(colors.tagColors.goalType).map((color: string, index: number) => (
                            <TouchableOpacity
                              key={index}
                              style={[
                                styles.colorOption,
                                { backgroundColor: color },
                                customGoalTypeColor === color && styles.selectedColor
                              ]}
                              onPress={() => setCustomGoalTypeColor(color)}
                            />
                          ))}
                        </View>
                      </ScrollView>
                    </>
                  )}
                </>
              )}

              {/* Meal Prep */}
              {category === 'meal-prep' && (
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

                  <Text style={[styles.label, { color: effectiveDarkColor }]}>Day of Week (Optional)</Text>
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
              {category === 'cleaning' && (
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

                  <Text style={[styles.label, { color: effectiveDarkColor }]}>Location (Optional)</Text>
                  <View style={styles.optionGrid}>
                    {['kitchen', 'bathroom', 'bedroom', 'custom'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { backgroundColor: effectivePastelColor },
                          cleaningLocation === option && { backgroundColor: getCleaningLocationColor(option) }
                        ]}
                        onPress={() => {
                          setCleaningLocation(option);
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
                      <Text style={[styles.label, { color: effectiveDarkColor }]}>Custom Location</Text>
                      <TextInput
                        style={[styles.input, { 
                          borderColor: effectivePastelColor, 
                          backgroundColor: effectiveBgColor,
                          color: effectiveDarkColor
                        }]}
                        value={customCleaningLocation}
                        onChangeText={setCustomCleaningLocation}
                        placeholder="Enter custom location"
                        placeholderTextColor={effectiveMediumColor}
                      />
                    </>
                  )}
                </>
              )}

              {/* Self-Care */}
              {category === 'self-care' && (
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
              {category === 'delegation' && (
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

              {/* Calendar Tasks */}
              {category === 'weekly' && selectedDate && (
                <View style={[styles.dateInfo, { 
                  backgroundColor: effectiveAccentColor,
                  borderColor: effectiveDarkColor
                }]}>
                  <Text style={[styles.dateInfoText, { color: effectivePastelColor }]}>
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
              <Text style={[styles.submitText, { color: "#FFFFFF" }]}>Add Task</Text>
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
    paddingHorizontal: 12,
  },
  errorCard: {
    margin: 12,
    borderLeftWidth: 4,
    padding: 12,
    borderRadius: 8,
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
    padding: 12,
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
  taskTypeSection: {
    marginTop: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
  },
  habitGoalSection: {
    marginTop: 16,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  counterText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    paddingHorizontal: 20,
  },
  colorWheelContainer: {
    marginBottom: 16,
  },
  colorWheel: {
    flexDirection: 'row',
    padding: 8,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 6,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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