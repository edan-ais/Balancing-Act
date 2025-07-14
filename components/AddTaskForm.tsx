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

// Get window dimensions for consistent modal sizing
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

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
  const [taskType, setTaskType] = useState<string>('task'); // Default to 'task'
  const [habitGoal, setHabitGoal] = useState('1');
  const [priority, setPriority] = useState<string>('');
  const [customPriorityText, setCustomPriorityText] = useState('');
  const [customPriorityColor, setCustomPriorityColor] = useState(colors?.tabColors?.daily?.priorityCustomSelected || '#4A5568');
  const [goalType, setGoalType] = useState<string>('');
  const [customGoalTypeText, setCustomGoalTypeText] = useState('');
  const [customGoalTypeColor, setCustomGoalTypeColor] = useState(colors?.tabColors?.future?.goalCustomSelected || '#4A5568');
  const [mealType, setMealType] = useState<string>('');
  const [dayOfWeek, setDayOfWeek] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [frequency, setFrequency] = useState<string>('');
  const [cleaningLocation, setCleaningLocation] = useState<string>('');
  const [customCleaningLocation, setCustomCleaningLocation] = useState('');
  const [customCleaningLocationColor, setCustomCleaningLocationColor] = useState(colors?.tabColors?.cleaning?.cleaningCustomSelected || '#996B77');
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
  
  // Use the tab colors from the theme or fallback to effective colors
  const veryDarkColor = tabColors.veryDark || effectiveDarkColor;
  const highlightColor = tabColors.highlight || effectiveAccentColor;
  const bgAltColor = tabColors.bgAlt || effectivePastelColor;
  const lightColor = tabColors.light || effectivePastelColor;

  // Helper to get tag color - updated to work with the new flat structure
  const getTagColor = (tagType: string, tagValue: string, isSelected: boolean = true) => {
    // Required tags use tab's colors
    if (['taskType', 'mealType', 'frequency', 'selfCareType', 'delegateType'].includes(tagType)) {
      return isSelected ? veryDarkColor : bgAltColor;
    }

    // For non-required tags, use their specific color from the tab section in theme
    const tabColorKey = getCategoryColorKey();
    const tabColors = colors?.tabColors?.[tabColorKey] || {};
    
    // Handle custom tag option
    if (tagValue === 'custom') {
      const customColorMap = {
        'priority': customPriorityColor,
        'goalType': customGoalTypeColor,
        'cleaningLocation': customCleaningLocationColor,
      };
      
      if (isSelected) {
        // Try to use the user selected custom color first
        return customColorMap[tagType] || veryDarkColor;
      } else {
        // For unselected state of custom tag
        const unselectedKey = `${tagType}CustomUnselected`;
        return tabColors[unselectedKey] || bgAltColor;
      }
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
    }
    
    // Add Selected/Unselected suffix based on state
    lookupKey = `${lookupKey}${isSelected ? 'Selected' : 'Unselected'}`;
    
    // Return the color from the tab's colors or default to tab's main colors
    return tabColors[lookupKey] || (isSelected ? veryDarkColor : bgAltColor);
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

  // Get array of color options for custom color selection from the flat structure
  const getColorOptions = (tagType: string) => {
    const tabColorKey = getCategoryColorKey();
    const tabColors = colors?.tabColors?.[tabColorKey] || {};
    const colorOptions = [];
    
    // Collect all the Selected colors for this tag type
    const prefix = tagType === 'priority' ? 'priority' : 
                  tagType === 'goalType' ? 'goal' :
                  tagType === 'cleaningLocation' ? 'cleaning' :
                  tagType === 'delegateType' ? 'delegate' : '';
    
    if (prefix) {
      // Go through all tabColors keys and find the ones that match our prefix and end with "Selected"
      Object.entries(tabColors).forEach(([key, value]) => {
        if (key.startsWith(prefix) && key.endsWith('Selected') && key !== `${prefix}CustomSelected` && key !== `${prefix}DefaultSelected`) {
          if (typeof value === 'string') {
            colorOptions.push(value);
          }
        }
      });
    }
    
    // If we found colors for this tag type, return them
    if (colorOptions.length > 0) {
      return colorOptions;
    }
    
    // Otherwise collect colors from all tabs as a fallback
    const allColors = [];
    if (colors?.tabColors) {
      Object.values(colors.tabColors).forEach(tabColorSet => {
        Object.entries(tabColorSet).forEach(([key, value]) => {
          if (typeof value === 'string' && key.endsWith('Selected') && !key.includes('Default') && !key.includes('Custom')) {
            if (!allColors.includes(value)) {
              allColors.push(value);
            }
          }
        });
      });
    }
    
    // Return all collected colors or fallback to tab colors
    return allColors.length > 0 ? allColors : [
      veryDarkColor, highlightColor, tabColors.medium || effectiveMediumColor
    ];
  };

  const resetForm = () => {
    setTitle('');
    setTaskType('task');
    setHabitGoal('1');
    setPriority('');
    setCustomPriorityText('');
    setCustomPriorityColor(colors?.tabColors?.daily?.priorityCustomSelected || '#4A5568');
    setGoalType('');
    setCustomGoalTypeText('');
    setCustomGoalTypeColor(colors?.tabColors?.future?.goalCustomSelected || '#4A5568');
    setMealType('');
    setDayOfWeek('');
    setNotes('');
    setFrequency('');
    setCleaningLocation('');
    setCustomCleaningLocation('');
    setCustomCleaningLocationColor(colors?.tabColors?.cleaning?.cleaningCustomSelected || '#996B77');
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
        if (cleaningLocation === 'custom' && !customCleaningLocation.trim()) {
          validationErrors.push('Custom location text is required');
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

    // Habit-specific validation - only if it's a habit
    if (taskType === 'habit' && (!habitGoal || parseInt(habitGoal) <= 0)) {
      validationErrors.push('Valid habit goal is required for habits');
    }

    // Validate custom tag text is provided when custom option is selected
    if (priority === 'custom' && !customPriorityText.trim()) {
      validationErrors.push('Custom priority text is required');
    }
    
    if (goalType === 'custom' && !customGoalTypeText.trim()) {
      validationErrors.push('Custom goal type text is required');
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
      isHabit: taskType === 'habit',
      habitGoal: taskType === 'habit' && habitGoal ? parseInt(habitGoal) : undefined,
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
      customCleaningLocationColor: cleaningLocation === 'custom' ? customCleaningLocationColor : undefined,
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

  // Render custom color picker for a tag type
  const renderColorPicker = (tagType: string, selectedColor: string, setColorFunction: (color: string) => void) => {
    const colorOptions = getColorOptions(tagType);
    
    return (
      <>
        <Text style={[styles.label, { color: veryDarkColor }]}>Custom Color</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorWheelContainer}>
          <View style={styles.colorWheel}>
            {colorOptions.map((color: string, index: number) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor
                ]}
                onPress={() => setColorFunction(color)}
              />
            ))}
          </View>
        </ScrollView>
      </>
    );
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={[
          styles.modalContainer, 
          { 
            backgroundColor: effectiveBgColor,
            height: windowHeight * 0.65, // Shorter fixed height
            width: Math.min(windowWidth * 0.9, 450), // Control width for better layout
          }
        ]}>
          <View style={[styles.header, { 
            borderBottomColor: effectivePastelColor,
            backgroundColor: bgAltColor 
          }]}>
            <Text style={[styles.title, { color: veryDarkColor }]}>Add New Task</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={veryDarkColor} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
            showsVerticalScrollIndicator={true}
          >
            {/* Error Messages */}
            {errors.length > 0 && (
              <View style={[styles.errorCard, { 
                backgroundColor: '#FED7D7',
                borderLeftColor: '#E53E3E',
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
              <Text style={[styles.label, { color: veryDarkColor }]}>Task Name *</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: errors.some(e => e.includes('Task name')) ? '#E53E3E' : effectivePastelColor, 
                  backgroundColor: effectiveBgColor,
                  color: veryDarkColor
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

              {/* Task Type as Tags - Daily and Calendar tabs */}
              {(category === 'daily' || category === 'weekly') && (
                <>
                  <Text style={[styles.label, { color: veryDarkColor }]}>Task Type *</Text>
                  <View style={styles.optionGrid}>
                    {['task', 'habit'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { 
                            backgroundColor: getTagColor('taskType', option, taskType === option),
                          }
                        ]}
                        onPress={() => setTaskType(option)}
                      >
                        <Text style={[
                          styles.optionText,
                          { color: taskType === option ? '#FFFFFF' : veryDarkColor }
                        ]}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {taskType === 'habit' && (
                    <View style={styles.habitGoalSection}>
                      <Text style={[styles.label, { color: veryDarkColor }]}>Daily Goal</Text>
                      <View style={styles.counterContainer}>
                        <TouchableOpacity
                          style={[styles.counterButton, { backgroundColor: effectivePastelColor }]}
                          onPress={decrementHabitGoal}
                        >
                          <Minus size={16} color={veryDarkColor} />
                        </TouchableOpacity>
                        <Text style={[styles.counterText, { color: veryDarkColor }]}>
                          {habitGoal}
                        </Text>
                        <TouchableOpacity
                          style={[styles.counterButton, { backgroundColor: effectivePastelColor }]}
                          onPress={incrementHabitGoal}
                        >
                          <Plus size={16} color={veryDarkColor} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </>
              )}

              {/* Daily Tasks - Priority */}
              {category === 'daily' && (
                <>
                  <Text style={[styles.label, { color: veryDarkColor }]}>Priority</Text>
                  <View style={styles.optionGrid}>
                    {['high', 'medium', 'low', 'quick-win', 'custom'].map((option) => {
                      // Convert option to tagValue format for lookup
                      const tagValue = option === 'quick-win' ? 'quickWin' : option;
                      const bgColor = getTagColor('priority', tagValue, priority === option);
                      const textColor = getTextColor(bgColor);
                      
                      return (
                        <TouchableOpacity
                          key={option}
                          style={[
                            styles.optionButton,
                            { backgroundColor: bgColor }
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
                            { color: textColor }
                          ]}>
                            {option === 'quick-win' ? 'Quick Win' : option.charAt(0).toUpperCase() + option.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {priority === 'custom' && (
                    <>
                      <Text style={[styles.label, { color: veryDarkColor }]}>Custom Priority Text</Text>
                      <TextInput
                        style={[styles.input, { 
                          borderColor: errors.some(e => e.includes('Custom priority text')) ? '#E53E3E' : effectivePastelColor, 
                          backgroundColor: effectiveBgColor,
                          color: veryDarkColor
                        }]}
                        value={customPriorityText}
                        onChangeText={(text) => {
                          setCustomPriorityText(text);
                          if (errors.length > 0) {
                            setErrors(errors.filter(e => !e.includes('Custom priority text')));
                          }
                        }}
                        placeholder="Enter custom priority"
                        placeholderTextColor={effectiveMediumColor}
                      />
                      
                      {renderColorPicker('priority', customPriorityColor, setCustomPriorityColor)}
                    </>
                  )}
                </>
              )}

              {/* Goals - Goal Type */}
              {category === 'goals' && (
                <>
                  <Text style={[styles.label, { color: veryDarkColor }]}>Goal Type</Text>
                  <View style={styles.optionGrid}>
                    {['TBD', 'Not Priority', 'Wish', 'custom'].map((option) => {
                      // Convert option to tagValue format for lookup
                      const tagValue = option === 'TBD' ? 'tbd' : 
                                    option === 'Not Priority' ? 'notPriority' : 
                                    option.toLowerCase();
                      
                      const bgColor = getTagColor('goalType', tagValue, goalType === option);
                      const textColor = getTextColor(bgColor);
                      
                      return (
                        <TouchableOpacity
                          key={option}
                          style={[
                            styles.optionButton,
                            { backgroundColor: bgColor }
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
                            { color: textColor }
                          ]}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {goalType === 'custom' && (
                    <>
                      <Text style={[styles.label, { color: veryDarkColor }]}>Custom Goal Type</Text>
                      <TextInput
                        style={[styles.input, { 
                          borderColor: errors.some(e => e.includes('Custom goal type text')) ? '#E53E3E' : effectivePastelColor, 
                          backgroundColor: effectiveBgColor,
                          color: veryDarkColor
                        }]}
                        value={customGoalTypeText}
                        onChangeText={(text) => {
                          setCustomGoalTypeText(text);
                          if (errors.length > 0) {
                            setErrors(errors.filter(e => !e.includes('Custom goal type text')));
                          }
                        }}
                        placeholder="Enter custom goal type"
                        placeholderTextColor={effectiveMediumColor}
                      />
                      
                      {renderColorPicker('goalType', customGoalTypeColor, setCustomGoalTypeColor)}
                    </>
                  )}
                </>
              )}

              {/* Meal Prep */}
              {category === 'meal-prep' && (
                <>
                  <Text style={[styles.label, { color: veryDarkColor }]}>Meal Type *</Text>
                  <View style={styles.optionGrid}>
                    {['breakfast', 'lunch', 'dinner', 'snack'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { 
                            backgroundColor: getTagColor('mealType', option, mealType === option),
                            borderColor: errors.some(e => e.includes('Meal type')) ? '#E53E3E' : 'transparent',
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
                            color: mealType === option ? '#FFFFFF' : veryDarkColor
                          }
                        ]}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.label, { color: veryDarkColor }]}>Day of Week</Text>
                  <View style={styles.optionGrid}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                      const bgColor = getTagColor('dayOfWeek', day, dayOfWeek === day);
                      const textColor = getTextColor(bgColor);
                      
                      return (
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.optionButton,
                            { backgroundColor: bgColor }
                          ]}
                          onPress={() => setDayOfWeek(day)}
                        >
                          <Text style={[
                            styles.optionText,
                            { color: textColor }
                          ]}>
                            {day}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <Text style={[styles.label, { color: veryDarkColor }]}>Notes</Text>
                  <TextInput
                    style={[styles.input, styles.textArea, { 
                      borderColor: effectivePastelColor, 
                      backgroundColor: effectiveBgColor,
                      color: veryDarkColor
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
                  <Text style={[styles.label, { color: veryDarkColor }]}>Frequency *</Text>
                  <View style={styles.optionGrid}>
                    {['daily', 'weekly', 'monthly', 'seasonal'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { 
                            backgroundColor: getTagColor('frequency', option, frequency === option),
                            borderColor: errors.some(e => e.includes('Frequency')) ? '#E53E3E' : 'transparent',
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
                            color: frequency === option ? '#FFFFFF' : veryDarkColor
                          }
                        ]}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.label, { color: veryDarkColor }]}>Location</Text>
                  <View style={styles.optionGrid}>
                    {['kitchen', 'bathroom', 'bedroom', 'custom'].map((option) => {
                      const bgColor = getTagColor('cleaningLocation', option, cleaningLocation === option);
                      const textColor = getTextColor(bgColor);
                      
                      return (
                        <TouchableOpacity
                          key={option}
                          style={[
                            styles.optionButton,
                            { backgroundColor: bgColor }
                          ]}
                          onPress={() => {
                            setCleaningLocation(option);
                          }}
                        >
                          <Text style={[
                            styles.optionText,
                            { color: textColor }
                          ]}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {cleaningLocation === 'custom' && (
                    <>
                      <Text style={[styles.label, { color: veryDarkColor }]}>Custom Location</Text>
                      <TextInput
                        style={[styles.input, { 
                          borderColor: errors.some(e => e.includes('Custom location text')) ? '#E53E3E' : effectivePastelColor, 
                          backgroundColor: effectiveBgColor,
                          color: veryDarkColor
                        }]}
                        value={customCleaningLocation}
                        onChangeText={(text) => {
                          setCustomCleaningLocation(text);
                          if (errors.length > 0) {
                            setErrors(errors.filter(e => !e.includes('Custom location text')));
                          }
                        }}
                        placeholder="Enter custom location"
                        placeholderTextColor={effectiveMediumColor}
                      />
                      
                      {renderColorPicker('cleaningLocation', customCleaningLocationColor, setCustomCleaningLocationColor)}
                    </>
                  )}
                </>
              )}

              {/* Self-Care */}
              {category === 'self-care' && (
                <>
                  <Text style={[styles.label, { color: veryDarkColor }]}>Self-Care Type *</Text>
                  <View style={styles.optionGrid}>
                    {['physical', 'mental', 'rest', 'joy'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { 
                            backgroundColor: getTagColor('selfCareType', option, selfCareType === option),
                            borderColor: errors.some(e => e.includes('Self-care type')) ? '#E53E3E' : 'transparent',
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
                            color: selfCareType === option ? '#FFFFFF' : veryDarkColor
                          }
                        ]}>
                          {option === 'physical' ? 'Physical Health' :
                           option === 'mental' ? 'Mental Health' :
                           option === 'rest' ? 'Rest & Recovery' :
                           option === 'joy' ? 'Joy & Connection' :
                           option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {/* Delegation */}
              {category === 'delegation' && (
                <>
                  <Text style={[styles.label, { color: veryDarkColor }]}>Delegate To *</Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: errors.some(e => e.includes('Person to delegate')) ? '#E53E3E' : effectivePastelColor, 
                      backgroundColor: effectiveBgColor,
                      color: veryDarkColor
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

                  <Text style={[styles.label, { color: veryDarkColor }]}>Delegate Type *</Text>
                  <View style={styles.optionGrid}>
                    {['partner', 'family', 'friends', 'kids'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { 
                            backgroundColor: getTagColor('delegateType', option, delegateType === option),
                            borderColor: errors.some(e => e.includes('Delegate type')) ? '#E53E3E' : 'transparent',
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
                            color: delegateType === option ? '#FFFFFF' : veryDarkColor
                          }
                        ]}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.switchRow}>
                    <Text style={[styles.label, { color: veryDarkColor }]}>Enable Reminders</Text>
                    <Switch
                      value={reminderEnabled}
                      onValueChange={setReminderEnabled}
                      trackColor={{ false: effectivePastelColor, true: highlightColor }}
                      thumbColor="#ffffff"
                    />
                  </View>
                </>
              )}

              {/* Calendar Tasks */}
              {category === 'weekly' && selectedDate && (
                <View style={[styles.dateInfo, { 
                  backgroundColor: highlightColor,
                  borderColor: veryDarkColor
                }]}>
                  <Text style={[styles.dateInfoText, { color: '#FFFFFF' }]}>
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
                  <Text style={[styles.label, { color: veryDarkColor }]}>Subtasks</Text>
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
                        borderColor: effectivePastelColor, 
                        backgroundColor: effectiveBgColor,
                        color: veryDarkColor
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
                      <Minus size={16} color="#E53E3E" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={[styles.footer, { 
            borderTopColor: effectivePastelColor,
            backgroundColor: bgAltColor
          }]}>
            <TouchableOpacity 
              style={[styles.cancelButton, { backgroundColor: effectivePastelColor }]} 
              onPress={handleClose}
            >
              <Text style={[styles.cancelText, { color: veryDarkColor }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: veryDarkColor }]}
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
  habitGoalSection: {
    marginTop: 16,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Left-aligned as requested
    paddingLeft: 8,
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
    width: 28, // Smaller color circles
    height: 28, // Smaller color circles
    borderRadius: 14, // Keep it circular
    marginHorizontal: 4, // Less spacing between circles
  },
  selectedColor: {
    borderWidth: 2, // Thinner border
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
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