import React, { useReducer, useEffect } from 'react';
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
import { X, Plus, Minus, Leaf, CloudRain, Coffee, Palette } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Theme, TabColorSet, ColorWheelSet } from '@/constants/themes';

// Get window dimensions for consistent modal sizing
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

// Helper function to get theme icon component
const getThemeIcon = (themeId: string | undefined) => {
  switch (themeId) {
    case 'balance':
      return Palette;
    case 'latte':
      return Coffee;
    case 'rainstorm':
      return CloudRain;
    case 'autumn':
      return Leaf;
    default:
      return Plus;
  }
};

// Interface for custom tags
interface CustomTag {
  text: string;
  color: string;
}

// Interface for custom tags by category and type
export interface CustomTags {
  [category: string]: {
    [tagType: string]: CustomTag[];
  };
}

// Updated interface to match the pattern in DailyTasks
export interface AddTaskFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: Partial<Task>) => void;
  category: string;
  selectedDate?: Date; // For calendar tasks
  colors: TabColorSet & { 
    themeColorWheel?: ColorWheelSet; 
  };
  customTags?: CustomTags;
  theme?: Theme;
}

// Define action types for the reducer
type ActionType = 
  | { type: 'SET_FIELD', field: string, value: any }
  | { type: 'ADD_SUBTASK' }
  | { type: 'UPDATE_SUBTASK', id: string, title: string }
  | { type: 'REMOVE_SUBTASK', id: string }
  | { type: 'SET_ERRORS', errors: string[] }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'RESET_FORM' };

// Define the form state interface
interface FormState {
  title: string;
  taskType: string;
  habitGoal: string;
  priority: string;
  customPriorityText: string;
  customPriorityColor: string;
  goalType: string;
  customGoalTypeText: string;
  customGoalTypeColor: string;
  mealType: string;
  dayOfWeek: string;
  notes: string;
  frequency: string;
  cleaningLocation: string;
  customCleaningLocation: string;
  customCleaningLocationColor: string;
  selfCareType: string;
  delegatedTo: string;
  delegateType: string;
  reminderEnabled: boolean;
  subtasks: { id: string; title: string; completed: boolean }[];
  errors: string[];
}

// Initial state for the form
const initialState: FormState = {
  title: '',
  taskType: 'task',
  habitGoal: '1',
  priority: '',
  customPriorityText: '',
  customPriorityColor: '',
  goalType: '',
  customGoalTypeText: '',
  customGoalTypeColor: '',
  mealType: '',
  dayOfWeek: '',
  notes: '',
  frequency: '',
  cleaningLocation: '',
  customCleaningLocation: '',
  customCleaningLocationColor: '',
  selfCareType: '',
  delegatedTo: '',
  delegateType: '',
  reminderEnabled: false,
  subtasks: [],
  errors: []
};

// Reducer function to handle all form state changes
const formReducer = (state: FormState, action: ActionType): FormState => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    
    case 'ADD_SUBTASK':
      return {
        ...state,
        subtasks: [
          ...state.subtasks,
          {
            id: Date.now().toString(),
            title: '',
            completed: false
          }
        ]
      };
    
    case 'UPDATE_SUBTASK':
      return {
        ...state,
        subtasks: state.subtasks.map(subtask => 
          subtask.id === action.id ? { ...subtask, title: action.title } : subtask
        )
      };
    
    case 'REMOVE_SUBTASK':
      return {
        ...state,
        subtasks: state.subtasks.filter(subtask => subtask.id !== action.id)
      };
    
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    
    case 'CLEAR_ERRORS':
      return { ...state, errors: [] };
    
    case 'RESET_FORM':
      return { ...initialState };
      
    default:
      return state;
  }
};

export default function AddTaskForm({
  visible,
  onClose,
  onSubmit,
  category,
  selectedDate,
  colors,
  customTags = {},
  theme
}: AddTaskFormProps) {
  // Use reducer for form state management
  const [state, dispatch] = useReducer(formReducer, initialState);
  
  // Helper function to update any form field
  const setField = (field: string, value: any) => {
    dispatch({ type: 'SET_FIELD', field, value });
    
    // Clear related errors when updating a field
    if (state.errors.length > 0) {
      const updatedErrors = state.errors.filter(e => !e.toLowerCase().includes(field.toLowerCase()));
      if (updatedErrors.length !== state.errors.length) {
        dispatch({ type: 'SET_ERRORS', errors: updatedErrors });
      }
    }
  };

  // Initialize custom colors with theme colors
  useEffect(() => {
    if (!state.customPriorityColor) {
      setField('customPriorityColor', colors.themeColorWheel?.redBold || colors.veryDark);
    }
    if (!state.customGoalTypeColor) {
      setField('customGoalTypeColor', colors.themeColorWheel?.blueBold || colors.veryDark);
    }
    if (!state.customCleaningLocationColor) {
      setField('customCleaningLocationColor', colors.themeColorWheel?.greenBold || colors.veryDark);
    }
  }, [colors]);
  
  // Get the theme-specific icon component  
  const ThemeIcon = getThemeIcon(theme?.id);

  // Helper to get tag color - using the themeColorWheel
  const getTagColor = (tagType: string, tagValue: string, isSelected: boolean = true) => {
    // Required tags use tab's colors
    if (['taskType', 'mealType', 'frequency', 'selfCareType', 'delegateType'].includes(tagType)) {
      return isSelected ? colors.veryDark : colors.bgAlt;
    }

    // For non-required tags, use the themeColorWheel
    const colorWheel = colors.themeColorWheel || {};
    
    // Check for saved custom tags first
    const savedCustomTags = customTags[category]?.[tagType] || [];
    const matchingCustomTag = savedCustomTags.find((tag: CustomTag) => tag.text === tagValue);
    
    if (matchingCustomTag) {
      return isSelected ? matchingCustomTag.color : colors.bgAlt;
    }
    
    // Handle custom tag option
    if (tagValue === 'custom') {
      if (tagType === 'priority' && isSelected) {
        return state.customPriorityColor;
      } 
      else if (tagType === 'goalType' && isSelected) {
        return state.customGoalTypeColor;
      }
      else if (tagType === 'cleaningLocation' && isSelected) {
        return state.customCleaningLocationColor;
      }
      return isSelected ? colors.veryDark : colors.bgAlt;
    }
    
    // Use the color wheel mapping for specific tag types and values
    const tagColorMap: Record<string, Record<string, { bold: keyof ColorWheelSet, light: keyof ColorWheelSet }>> = {
      priority: {
        high: { bold: 'redBold', light: 'redLight' },
        medium: { bold: 'orangeBold', light: 'orangeLight' },
        low: { bold: 'yellowBold', light: 'yellowLight' },
        'quick-win': { bold: 'greenBold', light: 'greenLight' },
      },
      goalType: {
        Personal: { bold: 'purpleBold', light: 'purpleLight' },
        Career: { bold: 'blueBold', light: 'blueLight' },
        Financial: { bold: 'greenBold', light: 'greenLight' },
        TBD: { bold: 'grayBold', light: 'grayLight' },
        'Not Priority': { bold: 'grayBold', light: 'grayLight' },
        Wish: { bold: 'pinkBold', light: 'pinkLight' },
      },
      dayOfWeek: {
        Mon: { bold: 'redBold', light: 'redLight' },
        Tue: { bold: 'orangeBold', light: 'orangeLight' },
        Wed: { bold: 'yellowBold', light: 'yellowLight' },
        Thu: { bold: 'greenBold', light: 'greenLight' },
        Fri: { bold: 'blueBold', light: 'blueLight' },
        Sat: { bold: 'purpleBold', light: 'purpleLight' },
        Sun: { bold: 'pinkBold', light: 'pinkLight' },
      },
      cleaningLocation: {
        kitchen: { bold: 'redBold', light: 'redLight' },
        bathroom: { bold: 'blueBold', light: 'blueLight' },
        bedroom: { bold: 'purpleBold', light: 'purpleLight' },
      },
    };
    
    // Check if we have a mapping for this tag type and value
    const mapping = tagColorMap[tagType]?.[tagValue];
    if (mapping) {
      const colorKey = isSelected ? mapping.bold : mapping.light;
      return colorWheel[colorKey as keyof typeof colorWheel] || (isSelected ? colors.veryDark : colors.bgAlt);
    }
    
    // Fallback to default colors
    return isSelected ? colorWheel.grayBold || colors.veryDark : colorWheel.grayLight || colors.bgAlt;
  };

  // Helper to get text color based on background color
  const getTextColor = (backgroundColor: string) => {
    // For standard cases where we know the intent
    if (backgroundColor === colors.bgAlt || backgroundColor.toUpperCase().startsWith('#F')) {
      return colors.veryDark; // Dark text on light backgrounds
    } else {
      return '#FFFFFF'; // White text on dark backgrounds
    }
  };

  // Get predefined color options for custom color selection
  const getColorOptions = () => {
    // Use the theme color wheel for color options
    const colorWheel = colors.themeColorWheel || {};
    
    // Extract all the bold colors from the color wheel
    const colorOptions = [
      colorWheel.redBold,
      colorWheel.orangeBold,
      colorWheel.yellowBold,
      colorWheel.greenBold,
      colorWheel.blueBold,
      colorWheel.indigoBold,
      colorWheel.purpleBold,
      colorWheel.pinkBold,
      colorWheel.brownBold,
      colorWheel.grayBold,
      colors.veryDark // Add veryDarkColor as a fallback
    ].filter(Boolean); // Filter out undefined values
    
    // Filter out any duplicates
    return [...new Set(colorOptions)];
  };

  // Get available options for a tag type (including custom saved ones)
  const getTagOptions = (tagType: string) => {
    const savedCustomTags = customTags[category]?.[tagType] || [];
    
    // Default options based on tag type
    let defaultOptions: string[] = [];
    
    if (tagType === 'priority') {
      defaultOptions = ['high', 'medium', 'low', 'quick-win'];
    } else if (tagType === 'goalType') {
      defaultOptions = ['TBD', 'Not Priority', 'Wish'];
    } else if (tagType === 'cleaningLocation') {
      defaultOptions = ['kitchen', 'bathroom', 'bedroom'];
    }
    
    // Add saved custom tags
    const savedOptions = savedCustomTags.map((tag: CustomTag) => tag.text);
    
    // Always include the "custom" option as the last one
    return [...defaultOptions, ...savedOptions, 'custom'];
  };

  const handleClose = () => {
    dispatch({ type: 'RESET_FORM' });
    onClose();
  };

  const validateForm = (): string[] => {
    const validationErrors: string[] = [];

    // Check if title is provided
    if (!state.title.trim()) {
      validationErrors.push('Task name is required');
    }

    // Category-specific validation
    switch (category) {
      case 'meal-prep':
        if (!state.mealType) {
          validationErrors.push('Meal type is required for meal prep tasks');
        }
        break;

      case 'cleaning':
        if (!state.frequency) {
          validationErrors.push('Frequency is required for cleaning tasks');
        }
        if (state.cleaningLocation === 'custom' && !state.customCleaningLocation.trim()) {
          validationErrors.push('Custom location text is required');
        }
        break;

      case 'self-care':
        if (!state.selfCareType) {
          validationErrors.push('Self-care type is required for self-care tasks');
        }
        break;

      case 'delegation':
        if (!state.delegateType) {
          validationErrors.push('Delegate type is required for delegation tasks');
        }
        if (!state.delegatedTo.trim()) {
          validationErrors.push('Person to delegate to is required');
        }
        break;
    }

    // Habit-specific validation - only if it's a habit
    if (state.taskType === 'habit' && (!state.habitGoal || parseInt(state.habitGoal) <= 0)) {
      validationErrors.push('Valid habit goal is required for habits');
    }

    // Validate custom tag text is provided when custom option is selected
    if (state.priority === 'custom' && !state.customPriorityText.trim()) {
      validationErrors.push('Custom priority text is required');
    }
    
    if (state.goalType === 'custom' && !state.customGoalTypeText.trim()) {
      validationErrors.push('Custom goal type text is required');
    }

    return validationErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      dispatch({ type: 'SET_ERRORS', errors: validationErrors });
      return;
    }

    const newTask: Partial<Task> = {
      title: state.title.trim(),
      isHabit: state.taskType === 'habit',
      habitGoal: state.taskType === 'habit' && state.habitGoal ? parseInt(state.habitGoal) : undefined,
      priority: state.priority || undefined,
      customPriorityText: state.priority === 'custom' ? state.customPriorityText : undefined,
      customPriorityColor: state.priority === 'custom' ? state.customPriorityColor : undefined,
      goalType: state.goalType || undefined,
      customGoalTypeText: state.goalType === 'custom' ? state.customGoalTypeText : undefined,
      customGoalTypeColor: state.goalType === 'custom' ? state.customGoalTypeColor : undefined,
      mealType: state.mealType || undefined,
      dayOfWeek: state.dayOfWeek || undefined,
      notes: state.notes || undefined,
      frequency: state.frequency || undefined,
      cleaningLocation: state.cleaningLocation || undefined,
      customCleaningLocation: state.cleaningLocation === 'custom' ? state.customCleaningLocation : undefined,
      customCleaningLocationColor: state.cleaningLocation === 'custom' ? state.customCleaningLocationColor : undefined,
      selfCareType: state.selfCareType || undefined,
      delegatedTo: state.delegatedTo || undefined,
      delegateType: state.delegateType || undefined,
      reminderEnabled: state.reminderEnabled,
      subtasks: state.subtasks.length > 0 ? state.subtasks : undefined,
      scheduledDate: selectedDate, // For calendar tasks
      category: category, // Add category to make tracking easier
    };

    onSubmit(newTask);
    handleClose();
  };

  // Helper function to render tag options
  const renderTagOptions = (tagType: string, value: string, setter: (value: string) => void, options: string[]) => {
    return (
      <View style={styles.optionGrid}>
        {options.map((option) => {
          const bgColor = getTagColor(tagType, option, value === option);
          const textColor = getTextColor(bgColor);
          
          // Get display text for the option
          const savedCustomTags = customTags[category]?.[tagType] || [];
          const matchingCustomTag = savedCustomTags.find((tag: CustomTag) => tag.text === option);
          let displayText = option;
          
          if (matchingCustomTag) {
            displayText = matchingCustomTag.text;
          } else if (option === 'quick-win') {
            displayText = 'Quick Win';
          } else if (option !== 'custom') {
            displayText = option.charAt(0).toUpperCase() + option.slice(1);
          } else {
            displayText = 'Custom';
          }
          
          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                { backgroundColor: bgColor }
              ]}
              onPress={() => setter(option)}
            >
              <Text style={[
                styles.optionText,
                { color: textColor }
              ]}>
                {displayText}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // Render simplified color picker for a tag type
  const renderColorPicker = (tagType: string, selectedColor: string, setColorFunction: (color: string) => void) => {
    const colorOptions = getColorOptions();
    
    return (
      <>
        <Text style={[styles.label, { color: colors.veryDark }]}>Custom Color</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorWheelContainer}>
          <View style={styles.colorWheel}>
            {colorOptions.map((color, index) => (
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
            backgroundColor: colors.bg,
            height: windowHeight * 0.65, // Shorter fixed height
            width: Math.min(windowWidth * 0.9, 450), // Control width for better layout
          }
        ]}>
          <View style={[styles.header, { 
            borderBottomColor: colors.pastel,
            backgroundColor: colors.bgAlt 
          }]}>
            <Text style={[styles.title, { color: colors.veryDark }]}>Add New Task</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={colors.veryDark} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
            showsVerticalScrollIndicator={true}
          >
            {/* Error Messages */}
            {state.errors.length > 0 && (
              <View style={[styles.errorCard, { 
                backgroundColor: '#FED7D7',
                borderLeftColor: '#E53E3E',
              }]}>
                <Text style={[styles.errorTitle, { color: '#C53030' }]}>Please fix the following:</Text>
                {state.errors.map((error, index) => (
                  <Text key={index} style={[styles.errorText, { color: '#C53030' }]}>
                    • {error}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.formSection}>
              <Text style={[styles.label, { color: colors.veryDark }]}>Task Name *</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: state.errors.some(e => e.includes('Task name')) ? '#E53E3E' : colors.pastel, 
                  backgroundColor: colors.bg,
                  color: colors.veryDark
                }]}
                value={state.title}
                onChangeText={(text) => setField('title', text)}
                placeholder="Enter task name"
                placeholderTextColor={colors.medium}
                multiline
              />

              {/* Task Type as Tags - Daily and Calendar tabs */}
              {(category === 'daily' || category === 'weekly') && (
                <>
                  <Text style={[styles.label, { color: colors.veryDark }]}>Task Type *</Text>
                  {renderTagOptions(
                    'taskType',
                    state.taskType,
                    (value) => setField('taskType', value),
                    ['task', 'habit']
                  )}

                  {state.taskType === 'habit' && (
                    <View style={styles.habitGoalSection}>
                      <Text style={[styles.label, { color: colors.veryDark }]}>Daily Goal</Text>
                      <View style={styles.counterContainer}>
                        <TouchableOpacity
                          style={[styles.counterButton, { backgroundColor: colors.pastel }]}
                          onPress={() => {
                            const currentGoal = parseInt(state.habitGoal) || 0;
                            if (currentGoal > 1) {
                              setField('habitGoal', (currentGoal - 1).toString());
                            }
                          }}
                        >
                          <Minus size={16} color={colors.veryDark} />
                        </TouchableOpacity>
                        <Text style={[styles.counterText, { color: colors.veryDark }]}>
                          {state.habitGoal}
                        </Text>
                        <TouchableOpacity
                          style={[styles.counterButton, { backgroundColor: colors.pastel }]}
                          onPress={() => {
                            const currentGoal = parseInt(state.habitGoal) || 0;
                            setField('habitGoal', (currentGoal + 1).toString());
                          }}
                        >
                          <Plus size={16} color={colors.veryDark} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </>
              )}

              {/* Daily Tasks - Priority */}
              {category === 'daily' && (
                <>
                  <Text style={[styles.label, { color: colors.veryDark }]}>Priority</Text>
                  {renderTagOptions(
                    'priority',
                    state.priority,
                    (value) => setField('priority', value),
                    getTagOptions('priority')
                  )}

                  {state.priority === 'custom' && (
                    <>
                      <Text style={[styles.label, { color: colors.veryDark }]}>Custom Priority Text</Text>
                      <TextInput
                        style={[styles.input, { 
                          borderColor: state.errors.some(e => e.includes('Custom priority text')) ? '#E53E3E' : colors.pastel, 
                          backgroundColor: colors.bg,
                          color: colors.veryDark
                        }]}
                        value={state.customPriorityText}
                        onChangeText={(text) => setField('customPriorityText', text)}
                        placeholder="Enter custom priority"
                        placeholderTextColor={colors.medium}
                      />
                      
                      {renderColorPicker(
                        'priority', 
                        state.customPriorityColor, 
                        (color) => setField('customPriorityColor', color)
                      )}
                    </>
                  )}
                </>
              )}

              {/* Goals Tasks - Goal Type */}
              {category === 'goals' && (
                <>
                  <Text style={[styles.label, { color: colors.veryDark }]}>Goal Type</Text>
                  {renderTagOptions(
                    'goalType',
                    state.goalType,
                    (value) => setField('goalType', value),
                    getTagOptions('goalType')
                  )}

                  {state.goalType === 'custom' && (
                    <>
                      <Text style={[styles.label, { color: colors.veryDark }]}>Custom Goal Type Text</Text>
                      <TextInput
                        style={[styles.input, { 
                          borderColor: state.errors.some(e => e.includes('Custom goal type text')) ? '#E53E3E' : colors.pastel, 
                          backgroundColor: colors.bg,
                          color: colors.veryDark
                        }]}
                        value={state.customGoalTypeText}
                        onChangeText={(text) => setField('customGoalTypeText', text)}
                        placeholder="Enter custom goal type"
                        placeholderTextColor={colors.medium}
                      />
                      
                      {renderColorPicker(
                        'goalType', 
                        state.customGoalTypeColor, 
                        (color) => setField('customGoalTypeColor', color)
                      )}
                    </>
                  )}
                </>
              )}

              {/* Meal Prep Tasks */}
              {category === 'meal-prep' && (
                <>
                  <Text style={[styles.label, { color: colors.veryDark }]}>Meal Type *</Text>
                  {renderTagOptions(
                    'mealType',
                    state.mealType,
                    (value) => setField('mealType', value),
                    ['breakfast', 'lunch', 'dinner', 'snack']
                  )}

                  <Text style={[styles.label, { color: colors.veryDark }]}>Day of Week</Text>
                  {renderTagOptions(
                    'dayOfWeek',
                    state.dayOfWeek,
                    (value) => setField('dayOfWeek', value),
                    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                  )}

                  <Text style={[styles.label, { color: colors.veryDark }]}>Notes</Text>
                  <TextInput
                    style={[styles.input, styles.textArea, { 
                      borderColor: colors.pastel, 
                      backgroundColor: colors.bg,
                      color: colors.veryDark
                    }]}
                    value={state.notes}
                    onChangeText={(text) => setField('notes', text)}
                    placeholder="Add cooking notes, ingredients, etc."
                    placeholderTextColor={colors.medium}
                    multiline
                  />
                </>
              )}

              {/* Cleaning Tasks */}
              {category === 'cleaning' && (
                <>
                  <Text style={[styles.label, { color: colors.veryDark }]}>Frequency *</Text>
                  {renderTagOptions(
                    'frequency',
                    state.frequency,
                    (value) => setField('frequency', value),
                    ['daily', 'weekly', 'monthly', 'seasonal']
                  )}

                  <Text style={[styles.label, { color: colors.veryDark }]}>Location</Text>
                  {renderTagOptions(
                    'cleaningLocation',
                    state.cleaningLocation,
                    (value) => setField('cleaningLocation', value),
                    getTagOptions('cleaningLocation')
                  )}

                  {state.cleaningLocation === 'custom' && (
                    <>
                      <Text style={[styles.label, { color: colors.veryDark }]}>Custom Location Text</Text>
                      <TextInput
                        style={[styles.input, { 
                          borderColor: state.errors.some(e => e.includes('Custom location text')) ? '#E53E3E' : colors.pastel, 
                          backgroundColor: colors.bg,
                          color: colors.veryDark
                        }]}
                        value={state.customCleaningLocation}
                        onChangeText={(text) => setField('customCleaningLocation', text)}
                        placeholder="Enter custom location"
                        placeholderTextColor={colors.medium}
                      />
                      
                      {renderColorPicker(
                        'cleaningLocation', 
                        state.customCleaningLocationColor, 
                        (color) => setField('customCleaningLocationColor', color)
                      )}
                    </>
                  )}
                </>
              )}

              {/* Self-Care Tasks */}
              {category === 'self-care' && (
                <>
                  <Text style={[styles.label, { color: colors.veryDark }]}>Self-Care Type *</Text>
                  {renderTagOptions(
                    'selfCareType',
                    state.selfCareType,
                    (value) => setField('selfCareType', value),
                    ['physical', 'mental', 'rest', 'joy']
                  )}
                </>
              )}

              {/* Delegation Tasks */}
              {category === 'delegation' && (
                <>
                  <Text style={[styles.label, { color: colors.veryDark }]}>Delegate To *</Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: state.errors.some(e => e.includes('Person to delegate')) ? '#E53E3E' : colors.pastel, 
                      backgroundColor: colors.bg,
                      color: colors.veryDark
                    }]}
                    value={state.delegatedTo}
                    onChangeText={(text) => setField('delegatedTo', text)}
                    placeholder="Enter person's name"
                    placeholderTextColor={colors.medium}
                  />

                  <Text style={[styles.label, { color: colors.veryDark }]}>Delegate Type *</Text>
                  {renderTagOptions(
                    'delegateType',
                    state.delegateType,
                    (value) => setField('delegateType', value),
                    ['partner', 'family', 'friends', 'kids']
                  )}

                  <View style={styles.switchRow}>
                    <Text style={[styles.label, { color: colors.veryDark, marginTop: 0 }]}>Enable Reminder</Text>
                    <Switch
                      value={state.reminderEnabled}
                      onValueChange={(value) => setField('reminderEnabled', value)}
                      trackColor={{ false: colors.pastel, true: colors.highlight }}
                      thumbColor={state.reminderEnabled ? '#FFFFFF' : colors.medium}
                    />
                  </View>
                </>
              )}

              {/* Calendar Tasks - Show selected date */}
              {category === 'weekly' && selectedDate && (
                <View style={[styles.dateInfo, { 
                  borderColor: colors.pastel,
                  backgroundColor: colors.bgAlt 
                }]}>
                  <Text style={[styles.dateInfoText, { color: colors.veryDark }]}>
                    Scheduled for: {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Text>
                </View>
              )}

              {/* Subtasks Section */}
              <View style={styles.subtasksSection}>
                <View style={styles.subtasksHeader}>
                  <Text style={[styles.label, { color: colors.veryDark, marginTop: 0 }]}>Subtasks</Text>
                  <TouchableOpacity
                    style={[styles.addSubtaskButton, { backgroundColor: colors.pastel }]}
                    onPress={() => dispatch({ type: 'ADD_SUBTASK' })}
                  >
                    <Plus size={16} color={colors.veryDark} />
                  </TouchableOpacity>
                </View>

                {state.subtasks.map((subtask) => (
                  <View key={subtask.id} style={styles.subtaskRow}>
                    <TextInput
                      style={[styles.input, styles.subtaskInput, { 
                        borderColor: colors.pastel, 
                        backgroundColor: colors.bg,
                        color: colors.veryDark
                      }]}
                      value={subtask.title}
                      onChangeText={(text) => dispatch({ type: 'UPDATE_SUBTASK', id: subtask.id, title: text })}
                      placeholder="Enter subtask"
                      placeholderTextColor={colors.medium}
                    />
                    <TouchableOpacity
                      style={[styles.removeSubtaskButton, { backgroundColor: '#FED7D7' }]}
                      onPress={() => dispatch({ type: 'REMOVE_SUBTASK', id: subtask.id })}
                    >
                      <X size={16} color="#E53E3E" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={[styles.footer, { 
            borderTopColor: colors.pastel,
            backgroundColor: colors.bgAlt
          }]}>
            <TouchableOpacity 
              style={[styles.cancelButton, { backgroundColor: colors.pastel }]} 
              onPress={handleClose}
            >
              <Text style={[styles.cancelText, { color: colors.veryDark }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.veryDark }]}
              onPress={handleSubmit}
            >
              <ThemeIcon size={20} color="#FFFFFF" />
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
    justifyContent: 'flex-start',
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
    width: 28,
    height: 28,
    borderRadius: 14,
    marginHorizontal: 4,
  },
  selectedColor: {
    borderWidth: 2,
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  submitText: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
  },
});