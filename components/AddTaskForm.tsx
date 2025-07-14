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
  Dimensions,
} from 'react-native';
import { X, Plus, Minus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AddTaskFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
  category: string;
  selectedDate?: Date; // For calendar tasks
  colors?: any; // Theme colors
}

const windowHeight = Dimensions.get('window').height;

export default function AddTaskForm({
  visible,
  onClose,
  onSubmit,
  category,
  selectedDate,
  colors,
}: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [isHabit, setIsHabit] = useState(false);
  const [habitGoal, setHabitGoal] = useState('1');
  const [priority, setPriority] = useState<string>('');
  const [customPriorityText, setCustomPriorityText] = useState('');
  const [customPriorityColor, setCustomPriorityColor] = useState(colors?.tagColors?.priority?.custom || '');
  const [goalType, setGoalType] = useState<string>('');
  const [customGoalTypeText, setCustomGoalTypeText] = useState('');
  const [customGoalTypeColor, setCustomGoalTypeColor] = useState(colors?.tagColors?.goalType?.custom || '');
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
    switch (category) {
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

  // Helper to get tag color from theme
  const getTagColor = (tagType: string, tagValue: string) => {
    if (colors?.tagColors && colors.tagColors[tagType] && colors.tagColors[tagType][tagValue]) {
      return colors.tagColors[tagType][tagValue];
    }
    return tabColors.highlight || tabColors.accent;
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
    setCustomPriorityColor(colors?.tagColors?.priority?.custom || '');
    setGoalType('');
    setCustomGoalTypeText('');
    setCustomGoalTypeColor(colors?.tagColors?.goalType?.custom || '');
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

    // Habit-specific validation - only if it's a habit
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
    const currentGoal = parseInt(habitGoal) || 0;
    setHabitGoal((currentGoal + 1).toString());
  };

  const decrementHabitGoal = () => {
    const currentGoal = parseInt(habitGoal) || 0;
    if (currentGoal > 1) {
      setHabitGoal((currentGoal - 1).toString());
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { 
          backgroundColor: tabColors.bg,
          shadowColor: tabColors.shadow,
          minHeight: windowHeight * 0.6, // Ensure minimum height for consistency
          maxHeight: windowHeight * 0.85
        }]}>
          <View style={[styles.header, { 
            borderBottomColor: tabColors.pastel,
            backgroundColor: tabColors.bgAlt 
          }]}>
            <Text style={[styles.title, { color: tabColors.veryDark }]}>Add New Task</Text>
            <TouchableOpacity 
              onPress={handleClose} 
              style={[styles.closeButton, { backgroundColor: tabColors.pastel }]}
            >
              <X size={22} color={tabColors.medium} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.content} 
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
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
              <Text style={[styles.label, { color: tabColors.veryDark }]}>Task Name *</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: errors.some(e => e.includes('Task name')) ? '#FC8181' : tabColors.pastel, 
                  backgroundColor: tabColors.bg,
                  color: tabColors.veryDark
                }]}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errors.length > 0) {
                    setErrors(errors.filter(e => !e.includes('Task name')));
                  }
                }}
                placeholder="Enter task name"
                placeholderTextColor={tabColors.medium}
                multiline
              />

              {/* Habit Settings - Only for Daily and Calendar tabs */}
              {(category === 'daily' || category === 'weekly') && (
                <View style={styles.taskTypeSection}>
                  <Text style={[styles.label, { color: tabColors.veryDark }]}>Task Type</Text>
                  <View style={[styles.toggleContainer, { borderColor: tabColors.pastel }]}>
                    <TouchableOpacity
                      style={[
                        styles.toggleButton, 
                        { backgroundColor: !isHabit ? tabColors.highlight : tabColors.bg }
                      ]}
                      onPress={() => setIsHabit(false)}
                    >
                      <Text style={[
                        styles.toggleText, 
                        { 
                          color: !isHabit ? tabColors.pastel : tabColors.medium,
                          fontFamily: !isHabit ? 'Quicksand-Bold' : 'Quicksand-Medium'
                        }
                      ]}>
                        Task
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.toggleButton, 
                        { backgroundColor: isHabit ? tabColors.highlight : tabColors.bg }
                      ]}
                      onPress={() => setIsHabit(true)}
                    >
                      <Text style={[
                        styles.toggleText, 
                        { 
                          color: isHabit ? tabColors.pastel : tabColors.medium,
                          fontFamily: isHabit ? 'Quicksand-Bold' : 'Quicksand-Medium'
                        }
                      ]}>
                        Habit
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {isHabit && (
                    <View style={styles.habitGoalSection}>
                      <Text style={[styles.label, { color: tabColors.veryDark }]}>Daily Goal</Text>
                      <View style={styles.counterContainer}>
                        <TouchableOpacity
                          style={[styles.counterButton, { 
                            backgroundColor: tabColors.pastel,
                            shadowColor: tabColors.shadow
                          }]}
                          onPress={decrementHabitGoal}
                        >
                          <Minus size={16} color={tabColors.dark} />
                        </TouchableOpacity>
                        <Text style={[styles.counterText, { color: tabColors.veryDark }]}>
                          {habitGoal}
                        </Text>
                        <TouchableOpacity
                          style={[styles.counterButton, { 
                            backgroundColor: tabColors.pastel,
                            shadowColor: tabColors.shadow
                          }]}
                          onPress={incrementHabitGoal}
                        >
                          <Plus size={16} color={tabColors.dark} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              )}

              {/* Daily Tasks - Priority (Optional) */}
              {category === 'daily' && (
                <>
                  <Text style={[styles.label, { color: tabColors.veryDark }]}>Priority (Optional)</Text>
                  <View style={styles.optionGrid}>
                    {['high', 'medium', 'low', 'quick-win', 'custom'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { 
                            backgroundColor: priority === option ? getPriorityColor(option) : tabColors.pastel,
                            shadowColor: tabColors.shadow
                          }
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
                          { 
                            color: priority === option ? tabColors.pastel : tabColors.medium,
                            fontFamily: priority === option ? 'Quicksand-Bold' : 'Quicksand-Medium'
                          }
                        ]}>
                          {option === 'quick-win' ? 'Quick Win' : option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {priority === 'custom' && (
                    <>
                      <Text style={[styles.label, { color: tabColors.veryDark }]}>Custom Priority Text</Text>
                      <TextInput
                        style={[styles.input, { 
                          borderColor: tabColors.pastel, 
                          backgroundColor: tabColors.bg,
                          color: tabColors.veryDark
                        }]}
                        value={customPriorityText}
                        onChangeText={setCustomPriorityText}
                        placeholder="Enter custom priority"
                        placeholderTextColor={tabColors.medium}
                      />
                      
                      <Text style={[styles.label, { color: tabColors.veryDark }]}>Custom Color</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorWheelContainer}>
                        <View style={styles.colorWheel}>
                          {Object.values(colors?.tagColors?.priority || {}).map((color: string, index: number) => (
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
                  <Text style={[styles.label, { color: tabColors.veryDark }]}>Goal Type (Optional)</Text>
                  <View style={styles.optionGrid}>
                    {['TBD', 'Not Priority', 'Wish', 'custom'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { 
                            backgroundColor: goalType === option ? getGoalTypeColor(option) : tabColors.pastel,
                            shadowColor: tabColors.shadow
                          }
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
                          { 
                            color: goalType === option ? tabColors.pastel : tabColors.medium,
                            fontFamily: goalType === option ? 'Quicksand-Bold' : 'Quicksand-Medium'
                          }
                        ]}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {goalType === 'custom' && (
                    <>
                      <Text style={[styles.label, { color: tabColors.veryDark }]}>Custom Goal Type</Text>
                      <TextInput
                        style={[styles.input, { 
                          borderColor: tabColors.pastel, 
                          backgroundColor: tabColors.bg,
                          color: tabColors.veryDark
                        }]}
                        value={customGoalTypeText}
                        onChangeText={setCustomGoalTypeText}
                        placeholder="Enter custom goal type"
                        placeholderTextColor={tabColors.medium}
                      />
                      
                      <Text style={[styles.label, { color: tabColors.veryDark }]}>Custom Color</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorWheelContainer}>
                        <View style={styles.colorWheel}>
                          {Object.values(colors?.tagColors?.goalType || {}).map((color: string, index: number) => (
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
                  <Text style={[styles.label, { color: tabColors.veryDark }]}>Meal Type *</Text>
                  <View style={styles.optionGrid}>
                    {['breakfast', 'lunch', 'dinner', 'snack'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { 
                            backgroundColor: mealType === option ? getMealTypeColor(option) : tabColors.pastel,
                            shadowColor: tabColors.shadow,
                            borderColor: errors.some(e => e.includes('Meal type')) ? '#FC8181' : 'transparent',
                            borderWidth: errors.some(e => e.includes('Meal type')) ? 1 : 0
                          }
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
                          { 
                            color: mealType === option ? tabColors.pastel : tabColors.medium,
                            fontFamily: mealType === option ? 'Quicksand-Bold' : 'Quicksand-Medium'
                          }
                        ]}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.label, { color: tabColors.veryDark }]}>Day of Week (Optional)</Text>
                  <View style={styles.optionGrid}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                      const dayKey = day.toLowerCase();
                      return (
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.optionButton,
                            { 
                              backgroundColor: dayOfWeek === day ? getDayOfWeekColor(dayKey) : tabColors.pastel,
                              shadowColor: tabColors.shadow
                            }
                          ]}
                          onPress={() => setDayOfWeek(day)}
                        >
                          <Text style={[
                            styles.optionText,
                            { 
                              color: dayOfWeek === day ? tabColors.pastel : tabColors.medium,
                              fontFamily: dayOfWeek === day ? 'Quicksand-Bold' : 'Quicksand-Medium'
                            }
                          ]}>
                            {day}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <Text style={[styles.label, { color: tabColors.veryDark }]}>Notes</Text>
                  <TextInput
                    style={[styles.input, styles.textArea, { 
                      borderColor: tabColors.pastel, 
                      backgroundColor: tabColors.bg,
                      color: tabColors.veryDark
                    }]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Add any notes or details"
                    placeholderTextColor={tabColors.medium}
                    multiline
                    numberOfLines={3}
                  />
                </>
              )}

              {/* Cleaning */}
              {category === 'cleaning' && (
                <>
                  <Text style={[styles.label, { color: tabColors.veryDark }]}>Frequency *</Text>
                  <View style={styles.optionGrid}>
                    {['daily', 'weekly', 'monthly', 'seasonal'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { 
                            backgroundColor: frequency === option ? tabColors.highlight : tabColors.pastel,
                            shadowColor: tabColors.shadow,
                            borderColor: errors.some(e => e.includes('Frequency')) ? '#FC8181' : 'transparent',
                            borderWidth: errors.some(e => e.includes('Frequency')) ? 1 : 0
                          }
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
                          { 
                            color: frequency === option ? tabColors.pastel : tabColors.medium,
                            fontFamily: frequency === option ? 'Quicksand-Bold' : 'Quicksand-Medium'
                          }
                        ]}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.label, { color: tabColors.veryDark }]}>Location (Optional)</Text>
                  <View style={styles.optionGrid}>
                    {['kitchen', 'bathroom', 'bedroom', 'custom'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { 
                            backgroundColor: cleaningLocation === option ? getCleaningLocationColor(option) : tabColors.pastel,
                            shadowColor: tabColors.shadow
                          }
                        ]}
                        onPress={() => {
                          setCleaningLocation(option);
                        }}
                      >
                        <Text style={[
                          styles.optionText,
                          { 
                            color: cleaningLocation === option ? tabColors.pastel : tabColors.medium,
                            fontFamily: cleaningLocation === option ? 'Quicksand-Bold' : 'Quicksand-Medium'
                          }
                        ]}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {cleaningLocation === 'custom' && (
                    <>
                      <Text style={[styles.label, { color: tabColors.veryDark }]}>Custom Location</Text>
                      <TextInput
                        style={[styles.input, { 
                          borderColor: tabColors.pastel, 
                          backgroundColor: tabColors.bg,
                          color: tabColors.veryDark
                        }]}
                        value={customCleaningLocation}
                        onChangeText={setCustomCleaningLocation}
                        placeholder="Enter custom location"
                        placeholderTextColor={tabColors.medium}
                      />
                    </>
                  )}
                </>
              )}

              {/* Self-Care */}
              {category === 'self-care' && (
                <>
                  <Text style={[styles.label, { color: tabColors.veryDark }]}>Self-Care Type *</Text>
                  <View style={styles.optionGrid}>
                    {['physical', 'mental', 'rest', 'joy'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { 
                            backgroundColor: selfCareType === option ? getSelfCareTypeColor(option) : tabColors.pastel,
                            shadowColor: tabColors.shadow,
                            borderColor: errors.some(e => e.includes('Self-care type')) ? '#FC8181' : 'transparent',
                            borderWidth: errors.some(e => e.includes('Self-care type')) ? 1 : 0
                          }
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
                          { 
                            color: selfCareType === option ? tabColors.pastel : tabColors.medium,
                            fontFamily: selfCareType === option ? 'Quicksand-Bold' : 'Quicksand-Medium'
                          }
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
                  <Text style={[styles.label, { color: tabColors.veryDark }]}>Delegate To *</Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: errors.some(e => e.includes('Person to delegate')) ? '#FC8181' : tabColors.pastel, 
                      backgroundColor: tabColors.bg,
                      color: tabColors.veryDark
                    }]}
                    value={delegatedTo}
                    onChangeText={(text) => {
                      setDelegatedTo(text);
                      if (errors.length > 0) {
                        setErrors(errors.filter(e => !e.includes('Person to delegate')));
                      }
                    }}
                    placeholder="Who will handle this task?"
                    placeholderTextColor={tabColors.medium}
                  />

                  <Text style={[styles.label, { color: tabColors.veryDark }]}>Delegate Type *</Text>
                  <View style={styles.optionGrid}>
                    {['partner', 'family', 'friends', 'kids'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { 
                            backgroundColor: delegateType === option ? getDelegateTypeColor(option) : tabColors.pastel,
                            shadowColor: tabColors.shadow,
                            borderColor: errors.some(e => e.includes('Delegate type')) ? '#FC8181' : 'transparent',
                            borderWidth: errors.some(e => e.includes('Delegate type')) ? 1 : 0
                          }
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
                          { 
                            color: delegateType === option ? tabColors.pastel : tabColors.medium,
                            fontFamily: delegateType === option ? 'Quicksand-Bold' : 'Quicksand-Medium'
                          }
                        ]}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.switchRow}>
                    <Text style={[styles.label, { color: tabColors.veryDark, marginTop: 0 }]}>Enable Reminders</Text>
                    <Switch
                      value={reminderEnabled}
                      onValueChange={setReminderEnabled}
                      trackColor={{ false: tabColors.pastel, true: tabColors.highlight }}
                      thumbColor={tabColors.pastel}
                    />
                  </View>
                </>
              )}

              {/* Calendar Tasks */}
              {category === 'weekly' && selectedDate && (
                <View style={[styles.dateInfo, { 
                  backgroundColor: tabColors.highlight,
                  borderColor: tabColors.pastel
                }]}>
                  <Text style={[styles.dateInfoText, { color: tabColors.pastel }]}>
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
                  <Text style={[styles.label, { color: tabColors.veryDark }]}>Subtasks (Optional)</Text>
                  <TouchableOpacity 
                    onPress={addSubtask} 
                    style={[styles.addSubtaskButton, { 
                      backgroundColor: tabColors.highlight,
                      shadowColor: tabColors.shadow
                    }]}
                  >
                    <Plus size={16} color={tabColors.pastel} />
                  </TouchableOpacity>
                </View>

                {subtasks.map((subtask, index) => (
                  <View key={subtask.id} style={styles.subtaskRow}>
                    <TextInput
                      style={[styles.input, styles.subtaskInput, { 
                        borderColor: tabColors.pastel, 
                        backgroundColor: tabColors.bg,
                        color: tabColors.veryDark
                      }]}
                      value={subtask.title}
                      onChangeText={(text) => updateSubtask(subtask.id, text)}
                      placeholder={`Subtask ${index + 1}`}
                      placeholderTextColor={tabColors.medium}
                    />
                    <TouchableOpacity
                      onPress={() => removeSubtask(subtask.id)}
                      style={[styles.removeSubtaskButton, { 
                        backgroundColor: '#FED7D7',
                        shadowColor: tabColors.shadow
                      }]}
                    >
                      <Minus size={16} color="#FC8181" />
                    </TouchableOpacity>
                  </View>
                ))}

                {/* Placeholder space to ensure consistent modal height */}
                {subtasks.length === 0 && category !== 'meal-prep' && (
                  <View style={styles.emptySpace} />
                )}
              </View>
            </View>
          </ScrollView>

          <View style={[styles.footer, { 
            borderTopColor: tabColors.pastel,
            backgroundColor: tabColors.bgAlt
          }]}>
            <TouchableOpacity 
              style={[styles.cancelButton, { 
                backgroundColor: tabColors.pastel,
                shadowColor: tabColors.shadow
              }]} 
              onPress={handleClose}
            >
              <Text style={[styles.cancelText, { 
                color: tabColors.dark,
                fontFamily: 'Quicksand-Bold'
              }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, { 
                backgroundColor: tabColors.dark,
                shadowColor: tabColors.shadow 
              }]}
              onPress={handleSubmit}
            >
              <Text style={[styles.submitText, { 
                color: tabColors.pastel,
                fontFamily: 'Quicksand-Bold'
              }]}>Add Task</Text>
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
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    fontSize: 22,
    fontFamily: 'Quicksand-Bold',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexGrow: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  errorCard: {
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  errorTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    marginBottom: 4,
    lineHeight: 22,
  },
  formSection: {
    paddingVertical: 8,
  },
  label: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 10,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginBottom: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
  },
  dateInfo: {
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateInfoText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
  },
  taskTypeSection: {
    marginTop: 20,
    marginBottom: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    marginTop: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
  },
  habitGoalSection: {
    marginTop: 20,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  counterButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 46,
    height: 46,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  counterText: {
    fontSize: 22,
    fontFamily: 'Quicksand-Bold',
    paddingHorizontal: 24,
  },
  colorWheelContainer: {
    marginBottom: 20,
    marginTop: 8,
  },
  colorWheel: {
    flexDirection: 'row',
    padding: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 8,
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
    marginTop: 20,
    marginBottom: 8,
  },
  subtasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addSubtaskButton: {
    padding: 10,
    borderRadius: 24,
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subtaskInput: {
    flex: 1,
    marginRight: 10,
  },
  removeSubtaskButton: {
    padding: 10,
    borderRadius: 24,
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptySpace: {
    height: 120, // Add space to maintain consistent height
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cancelText: {
    fontSize: 18,
  },
  submitButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  submitText: {
    fontSize: 18,
  },
});