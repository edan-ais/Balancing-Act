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
  const [customPriorityColor, setCustomPriorityColor] = useState(colors?.tagColors?.priority?.custom || '#4A5568');
  const [goalType, setGoalType] = useState<string>('');
  const [customGoalTypeText, setCustomGoalTypeText] = useState('');
  const [customGoalTypeColor, setCustomGoalTypeColor] = useState(colors?.tagColors?.goalType?.custom || '#4A5568');
  const [mealType, setMealType] = useState<string>('');
  const [customMealTypeText, setCustomMealTypeText] = useState('');
  const [customMealTypeColor, setCustomMealTypeColor] = useState(colors?.tagColors?.mealType?.custom || '#736A8F');
  const [dayOfWeek, setDayOfWeek] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [frequency, setFrequency] = useState<string>('');
  const [customFrequencyText, setCustomFrequencyText] = useState('');
  const [customFrequencyColor, setCustomFrequencyColor] = useState(colors?.tagColors?.frequency?.custom || '#666F7A');
  const [cleaningLocation, setCleaningLocation] = useState<string>('');
  const [customCleaningLocation, setCustomCleaningLocation] = useState('');
  const [customCleaningLocationColor, setCustomCleaningLocationColor] = useState(colors?.tagColors?.cleaningLocation?.custom || '#996B77');
  const [selfCareType, setSelfCareType] = useState<string>('');
  const [customSelfCareTypeText, setCustomSelfCareTypeText] = useState('');
  const [customSelfCareTypeColor, setCustomSelfCareTypeColor] = useState(colors?.tagColors?.selfCareType?.custom || '#666F7A');
  const [delegatedTo, setDelegatedTo] = useState('');
  const [delegateType, setDelegateType] = useState<string>('');
  const [customDelegateTypeText, setCustomDelegateTypeText] = useState('');
  const [customDelegateTypeColor, setCustomDelegateTypeColor] = useState(colors?.tagColors?.delegateType?.custom || '#666F7A');
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

  // Helper to get tag color from theme
  const getTagColor = (tagType: string, tagValue: string, isSelected: boolean = true) => {
    // If not selected, return light color for consistent unselected state
    if (!isSelected) {
      return tabColors.bgAlt || effectivePastelColor;
    }
    
    // Required tags that should use tab colors rather than specific tag colors
    if (['taskType'].includes(tagType)) {
      return veryDarkColor;
    }

    // For all other tags, use their specific color from theme
    if (colors?.tagColors && colors.tagColors[tagType]) {
      // Handle custom tag option
      if (tagValue === 'custom') {
        const customColorMap = {
          'priority': customPriorityColor,
          'goalType': customGoalTypeColor,
          'mealType': customMealTypeColor,
          'cleaningLocation': customCleaningLocationColor,
          'selfCareType': customSelfCareTypeColor,
          'delegateType': customDelegateTypeColor,
        };
        return customColorMap[tagType] || colors.tagColors[tagType].custom || veryDarkColor;
      }
      
      // Convert option to proper format for lookup in theme
      let lookupValue = tagValue;
      if (tagType === 'priority' && tagValue === 'quick-win') {
        lookupValue = 'quickWin';
      } else if (tagType === 'goalType' && tagValue === 'Not Priority') {
        lookupValue = 'notPriority';
      } else if (tagType === 'goalType' && tagValue === 'TBD') {
        lookupValue = 'tbd';
      }
      
      // Use the specific tag color from theme
      if (colors.tagColors[tagType][lookupValue]) {
        return colors.tagColors[tagType][lookupValue];
      }
      
      // If no specific color found, use default for that tag type
      return colors.tagColors[tagType].default || veryDarkColor;
    }
    
    // Fallback to tab colors if no specific tag colors defined
    return veryDarkColor;
  };

  // Get array of color options for custom color selection
  const getColorOptions = (tagType: string) => {
    // First try to collect all tag colors from this category
    const tagColors = [];
    
    if (colors?.tagColors && colors.tagColors[tagType]) {
      Object.entries(colors.tagColors[tagType]).forEach(([key, value]) => {
        if (typeof value === 'string' && key !== 'default' && key !== 'custom') {
          tagColors.push(value);
        }
      });
    }
    
    // If we have tag colors, return them
    if (tagColors.length > 0) {
      return tagColors;
    }
    
    // If no specific colors for this tag type, collect colors from all tag types
    const allColors = [];
    if (colors?.tagColors) {
      Object.keys(colors.tagColors).forEach(category => {
        Object.entries(colors.tagColors[category]).forEach(([key, value]) => {
          if (typeof value === 'string' && key !== 'default' && key !== 'custom' && !allColors.includes(value)) {
            allColors.push(value);
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
    setCustomPriorityColor(colors?.tagColors?.priority?.custom || '#4A5568');
    setGoalType('');
    setCustomGoalTypeText('');
    setCustomGoalTypeColor(colors?.tagColors?.goalType?.custom || '#4A5568');
    setMealType('');
    setCustomMealTypeText('');
    setCustomMealTypeColor(colors?.tagColors?.mealType?.custom || '#736A8F');
    setDayOfWeek('');
    setNotes('');
    setFrequency('');
    setCustomFrequencyText('');
    setCustomFrequencyColor(colors?.tagColors?.frequency?.custom || '#666F7A');
    setCleaningLocation('');
    setCustomCleaningLocation('');
    setCustomCleaningLocationColor(colors?.tagColors?.cleaningLocation?.custom || '#996B77');
    setSelfCareType('');
    setCustomSelfCareTypeText('');
    setCustomSelfCareTypeColor(colors?.tagColors?.selfCareType?.custom || '#666F7A');
    setDelegatedTo('');
    setDelegateType('');
    setCustomDelegateTypeText('');
    setCustomDelegateTypeColor(colors?.tagColors?.delegateType?.custom || '#666F7A');
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
        if (mealType === 'custom' && !customMealTypeText.trim()) {
          validationErrors.push('Custom meal type text is required');
        }
        break;

      case 'cleaning':
        if (!frequency) {
          validationErrors.push('Frequency is required for cleaning tasks');
        }
        if (frequency === 'custom' && !customFrequencyText.trim()) {
          validationErrors.push('Custom frequency text is required');
        }
        if (cleaningLocation === 'custom' && !customCleaningLocation.trim()) {
          validationErrors.push('Custom location text is required');
        }
        break;

      case 'self-care':
        if (!selfCareType) {
          validationErrors.push('Self-care type is required for self-care tasks');
        }
        if (selfCareType === 'custom' && !customSelfCareTypeText.trim()) {
          validationErrors.push('Custom self-care type text is required');
        }
        break;

      case 'delegation':
        if (!delegateType) {
          validationErrors.push('Delegate type is required for delegation tasks');
        }
        if (delegateType === 'custom' && !customDelegateTypeText.trim()) {
          validationErrors.push('Custom delegate type text is required');
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
      customMealTypeText: mealType === 'custom' ? customMealTypeText : undefined,
      customMealTypeColor: mealType === 'custom' ? customMealTypeColor : undefined,
      dayOfWeek: dayOfWeek || undefined,
      notes: notes || undefined,
      frequency: frequency || undefined,
      customFrequencyText: frequency === 'custom' ? customFrequencyText : undefined,
      customFrequencyColor: frequency === 'custom' ? customFrequencyColor : undefined,
      cleaningLocation: cleaningLocation || undefined,
      customCleaningLocation: cleaningLocation === 'custom' ? customCleaningLocation : undefined,
      customCleaningLocationColor: cleaningLocation === 'custom' ? customCleaningLocationColor : undefined,
      selfCareType: selfCareType || undefined,
      customSelfCareTypeText: selfCareType === 'custom' ? customSelfCareTypeText : undefined,
      customSelfCareTypeColor: selfCareType === 'custom' ? customSelfCareTypeColor : undefined,
      delegatedTo: delegatedTo || undefined,
      delegateType: delegateType || undefined,
      customDelegateTypeText: delegateType === 'custom' ? customDelegateTypeText : undefined,
      customDelegateTypeColor: delegateType === 'custom' ? customDelegateTypeColor : undefined,
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
                      
                      return (
                        <TouchableOpacity
                          key={option}
                          style={[
                            styles.optionButton,
                            { 
                              backgroundColor: getTagColor('priority', tagValue, priority === option)
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
                              color: priority === option ? '#FFFFFF' : veryDarkColor 
                            }
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
                      
                      return (
                        <TouchableOpacity
                          key={option}
                          style={[
                            styles.optionButton,
                            { 
                              backgroundColor: getTagColor('goalType', tagValue, goalType === option)
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
                              color: goalType === option ? '#FFFFFF' : veryDarkColor 
                            }
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
                    {['breakfast', 'lunch', 'dinner', 'snack', 'custom'].map((option) => (
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

                  {mealType === 'custom' && (
                    <>
                      <Text style={[styles.label, { color: veryDarkColor }]}>Custom Meal Type</Text>
                      <TextInput
                        style={[styles.input, { 
                          borderColor: errors.some(e => e.includes('Custom meal type text')) ? '#E53E3E' : effectivePastelColor, 
                          backgroundColor: effectiveBgColor,
                          color: veryDarkColor
                        }]}
                        value={customMealTypeText}
                        onChangeText={(text) => {
                          setCustomMealTypeText(text);
                          if (errors.length > 0) {
                            setErrors(errors.filter(e => !e.includes('Custom meal type text')));
                          }
                        }}
                        placeholder="Enter custom meal type"
                        placeholderTextColor={effectiveMediumColor}
                      />
                      
                      {renderColorPicker('mealType', customMealTypeColor, setCustomMealTypeColor)}
                    </>
                  )}

                  <Text style={[styles.label, { color: veryDarkColor }]}>Day of Week</Text>
                  <View style={styles.optionGrid}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                      const dayKey = day.toLowerCase();
                      return (
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.optionButton,
                            { 
                              backgroundColor: getTagColor('dayOfWeek', dayKey, dayOfWeek === day)
                            }
                          ]}
                          onPress={() => setDayOfWeek(day)}
                        >
                          <Text style={[
                            styles.optionText,
                            { 
                              color: dayOfWeek === day ? '#FFFFFF' : veryDarkColor
                            }
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
                    {['daily', 'weekly', 'monthly', 'seasonal', 'custom'].map((option) => (
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

                  {frequency === 'custom' && (
                    <>
                      <Text style={[styles.label, { color: veryDarkColor }]}>Custom Frequency</Text>
                      <TextInput
                        style={[styles.input, { 
                          borderColor: errors.some(e => e.includes('Custom frequency text')) ? '#E53E3E' : effectivePastelColor, 
                          backgroundColor: effectiveBgColor,
                          color: veryDarkColor
                        }]}
                        value={customFrequencyText}
                        onChangeText={(text) => {
                          setCustomFrequencyText(text);
                          if (errors.length > 0) {
                            setErrors(errors.filter(e => !e.includes('Custom frequency text')));
                          }
                        }}
                        placeholder="Enter custom frequency"
                        placeholderTextColor={effectiveMediumColor}
                      />
                      
                      {renderColorPicker('frequency', customFrequencyColor, setCustomFrequencyColor)}
                    </>
                  )}

                  <Text style={[styles.label, { color: veryDarkColor }]}>Location</Text>
                  <View style={styles.optionGrid}>
                    {['kitchen', 'bathroom', 'bedroom', 'custom'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          { 
                            backgroundColor: getTagColor('cleaningLocation', option, cleaningLocation === option)
                          }
                        ]}
                        onPress={() => {
                          setCleaningLocation(option);
                        }}
                      >
                        <Text style={[
                          styles.optionText,
                          { 
                            color: cleaningLocation === option ? '#FFFFFF' : veryDarkColor
                          }
                        ]}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
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
                    {['physical', 'mental', 'rest', 'joy', 'custom'].map((option) => (
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

                  {selfCareType === 'custom' && (
                    <>
                      <Text style={[styles.label, { color: veryDarkColor }]}>Custom Self-Care Type</Text>
                      <TextInput
                        style={[styles.input, { 
                          borderColor: errors.some(e => e.includes('Custom self-care type text')) ? '#E53E3E' : effectivePastelColor, 
                          backgroundColor: effectiveBgColor,
                          color: veryDarkColor
                        }]}
                        value={customSelfCareTypeText}
                        onChangeText={(text) => {
                          setCustomSelfCareTypeText(text);
                          if (errors.length > 0) {
                            setErrors(errors.filter(e => !e.includes('Custom self-care type text')));
                          }
                        }}
                        placeholder="Enter custom self-care type"
                        placeholderTextColor={effectiveMediumColor}
                      />
                      
                      {renderColorPicker('selfCareType', customSelfCareTypeColor, setCustomSelfCareTypeColor)}
                    </>
                  )}
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
                    {['partner', 'family', 'friends', 'kids', 'custom'].map((option) => (
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

                  {delegateType === 'custom' && (
                    <>
                      <Text style={[styles.label, { color: veryDarkColor }]}>Custom Delegate Type</Text>
                      <TextInput
                        style={[styles.input, { 
                          borderColor: errors.some(e => e.includes('Custom delegate type text')) ? '#E53E3E' : effectivePastelColor, 
                          backgroundColor: effectiveBgColor,
                          color: veryDarkColor
                        }]}
                        value={customDelegateTypeText}
                        onChangeText={(text) => {
                          setCustomDelegateTypeText(text);
                          if (errors.length > 0) {
                            setErrors(errors.filter(e => !e.includes('Custom delegate type text')));
                          }
                        }}
                        placeholder="Enter custom delegate type"
                        placeholderTextColor={effectiveMediumColor}
                      />
                      
                      {renderColorPicker('delegateType', customDelegateTypeColor, setCustomDelegateTypeColor)}
                    </>
                  )}

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