import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Plus, X, Calendar as CalendarIcon } from 'lucide-react-native';
import NeumorphicCard from './NeumorphicCard';

interface AddTaskFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: {
    title: string;
    isHabit: boolean;
    priority: string;
    customPriorityText?: string;
    customPriorityColor?: string;
    isDelegated: boolean;
    delegatedTo: string;
    delegateType?: string;
    subtasks: { title: string }[];
    habitGoal?: number;
    goalType?: string;
    customGoalTypeText?: string;
    customGoalTypeColor?: string;
    // Other fields
    mealType?: string;
    dayOfWeek?: string;
    specificDate?: Date;
    notes?: string;
    frequency?: string;
    recurringDays?: string[];
    recurringDate?: number;
    isRecurring?: boolean;
    reminderEnabled?: boolean;
    cleaningLocation?: string;
    customCleaningLocation?: string;
    customCleaningLocationColor?: string;
    selfCareType?: string;
  }) => void;
  category: string;
  selectedDate?: Date | null;
  accentColor?: string;
  darkColor?: string;
}

interface CustomTag {
  text: string;
  color: string;
}

export default function AddTaskForm({ 
  visible, 
  onClose, 
  onSubmit, 
  category, 
  selectedDate,
  accentColor,
  darkColor 
}: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [isHabit, setIsHabit] = useState(false);
  const [habitGoal, setHabitGoal] = useState(1);
  const [priority, setPriority] = useState('');
  const [customPriorityText, setCustomPriorityText] = useState('');
  const [customPriorityColor, setCustomPriorityColor] = useState('#4A5568'); // Default gray
  const [isDelegated, setIsDelegated] = useState(false);
  const [delegatedTo, setDelegatedTo] = useState('');
  const [delegateType, setDelegateType] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>(['']);
  
  // Goal specific fields
  const [goalType, setGoalType] = useState('');
  const [customGoalTypeText, setCustomGoalTypeText] = useState('');
  const [customGoalTypeColor, setCustomGoalTypeColor] = useState('#4A5568'); // Default gray

  // New state variables for category-specific fields
  const [mealType, setMealType] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [notes, setNotes] = useState('');
  const [frequency, setFrequency] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState<string[]>([]);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [cleaningLocation, setCleaningLocation] = useState('');
  const [customCleaningLocation, setCustomCleaningLocation] = useState('');
  const [customCleaningLocationColor, setCustomCleaningLocationColor] = useState('#4A5568'); // Default gray
  const [selfCareType, setSelfCareType] = useState('');
  
  // Custom tag modal state
  const [showCustomTagModal, setShowCustomTagModal] = useState(false);
  const [customTagType, setCustomTagType] = useState<'priority' | 'goalType' | 'cleaningLocation'>('priority');

  // Store created custom tags for reuse
  const [savedPriorityTags, setSavedPriorityTags] = useState<CustomTag[]>([]);
  const [savedGoalTypeTags, setSavedGoalTypeTags] = useState<CustomTag[]>([]);
  const [savedCleaningLocationTags, setSavedCleaningLocationTags] = useState<CustomTag[]>([]);

  // Get used colors for various tag types
  const getUsedPriorityColors = () => {
    const usedColors = [];
    
    // Colors used by predefined priority tags
    if (category === 'daily') {
      usedColors.push('#FC8181'); // high - Red
      usedColors.push('#4299E1'); // medium - Blue
      usedColors.push('#68D391'); // low - Green
      usedColors.push('#F6AD55'); // quick-win - Orange
    }
    
    return usedColors;
  };
  
  const getUsedGoalTypeColors = () => {
    const usedColors = [];
    
    // Colors used by predefined goal type tags
    if (category === 'goals') {
      usedColors.push('#9F7AEA'); // TBD - Purple
      usedColors.push('#FC8181'); // Not Priority - Red
      usedColors.push('#4299E1'); // Wish - Blue
    }
    
    return usedColors;
  };
  
  const getUsedCleaningLocationColors = () => {
    const usedColors = [];
    
    // Colors used by predefined cleaning location tags
    if (category === 'cleaning') {
      usedColors.push('#F6E05E'); // kitchen - Yellow
      usedColors.push('#4FD1C5'); // bathroom - Teal
      usedColors.push('#9F7AEA'); // bedroom - Purple
    }
    
    return usedColors;
  };

  // Available color options for custom tags - filter out used colors
  const getAvailableColorOptions = (type: 'priority' | 'goalType' | 'cleaningLocation') => {
    const allColors = [
      '#FC8181', // Red
      '#F6AD55', // Orange
      '#F6E05E', // Yellow
      '#68D391', // Green
      '#4FD1C5', // Teal
      '#63B3ED', // Blue
      '#4299E1', // Blue (darker)
      '#7F9CF5', // Indigo
      '#9F7AEA', // Purple
      '#B794F4', // Purple (lighter)
      '#F687B3', // Pink
    ];
    
    let usedColors: string[] = [];
    
    if (type === 'priority') {
      usedColors = getUsedPriorityColors();
    } else if (type === 'goalType') {
      usedColors = getUsedGoalTypeColors();
    } else if (type === 'cleaningLocation') {
      usedColors = getUsedCleaningLocationColors();
    }
    
    return allColors.filter(color => !usedColors.includes(color));
  };

  const handleSubmit = () => {
    if (title.trim()) {
      const baseTask = {
        title: title.trim(),
        isHabit,
        priority,
        customPriorityText: priority === 'custom' ? customPriorityText : undefined,
        customPriorityColor: priority === 'custom' ? customPriorityColor : undefined,
        isDelegated,
        delegatedTo: isDelegated ? delegatedTo : '',
        subtasks: subtasks.filter(s => s.trim()).map(s => ({ title: s.trim() })),
      };

      // Add habit goal if it's a habit
      if (isHabit) {
        baseTask.habitGoal = habitGoal;
      }

      // Add category-specific fields
      let taskData = { ...baseTask };

      // Weekly calendar specific fields
      if (category === 'weekly') {
        taskData = {
          ...taskData,
          isRecurring,
          recurringDays: isRecurring ? recurringDays : [],
          recurringDate: isRecurring && selectedDate ? selectedDate.getDate() : undefined,
        };
      }

      // Goal specific field
      if (category === 'goals') {
        taskData = {
          ...taskData,
          goalType,
          customGoalTypeText: goalType === 'custom' ? customGoalTypeText : undefined,
          customGoalTypeColor: goalType === 'custom' ? customGoalTypeColor : undefined,
        };
      }

      // Meal prep specific fields
      if (category === 'meal-prep') {
        taskData = {
          ...taskData,
          mealType,
          dayOfWeek,
          notes,
        };
      }

      // Cleaning specific fields
      if (category === 'cleaning') {
        taskData = {
          ...taskData,
          frequency,
          cleaningLocation,
          customCleaningLocation: cleaningLocation === 'custom' ? customCleaningLocation : undefined,
          customCleaningLocationColor: cleaningLocation === 'custom' ? customCleaningLocationColor : undefined,
        };
      }

      // Self-care specific fields
      if (category === 'self-care') {
        taskData = {
          ...taskData,
          selfCareType,
        };
      }

      // Delegation specific fields
      if (category === 'delegation') {
        taskData = {
          ...taskData,
          delegateType,
          reminderEnabled,
        };
      }

      onSubmit(taskData);

      // Reset all fields
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setTitle('');
    setIsHabit(false);
    setHabitGoal(1);
    setPriority('');
    setCustomPriorityText('');
    setCustomPriorityColor('#4A5568');
    setIsDelegated(false);
    setDelegatedTo('');
    setDelegateType('');
    setSubtasks(['']);
    setGoalType('');
    setCustomGoalTypeText('');
    setCustomGoalTypeColor('#4A5568');
    setMealType('');
    setDayOfWeek('');
    setNotes('');
    setFrequency('');
    setIsRecurring(false);
    setRecurringDays([]);
    setReminderEnabled(false);
    setCleaningLocation('');
    setCustomCleaningLocation('');
    setCustomCleaningLocationColor('#4A5568');
    setSelfCareType('');
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, '']);
  };

  const updateSubtask = (index: number, value: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = value;
    setSubtasks(newSubtasks);
  };

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const getTabColor = () => {
    if (accentColor) return accentColor;
    
    switch (category) {
      case 'daily': return '#2B6CB0';
      case 'goals': return '#48BB78';
      case 'weekly': return '#9F7AEA';
      case 'meal-prep': return '#ED8936';
      case 'cleaning': return '#4299E1';
      case 'self-care': return '#F56565';
      case 'delegation': return '#38B2AC';
      default: return '#2B6CB0';
    }
  };

  const toggleRecurringDay = (day: string) => {
    if (recurringDays.includes(day)) {
      setRecurringDays(recurringDays.filter(d => d !== day));
    } else {
      setRecurringDays([...recurringDays, day]);
    }
  };

  const openCustomTagModal = (type: 'priority' | 'goalType' | 'cleaningLocation') => {
    setCustomTagType(type);
    setShowCustomTagModal(true);
  };

  const saveCustomTag = () => {
    if (customTagType === 'priority') {
      if (customPriorityText.trim()) {
        // Create a new custom priority tag
        const newTag: CustomTag = {
          text: customPriorityText,
          color: customPriorityColor
        };
        
        // Only add if not already in the list
        if (!savedPriorityTags.some(tag => tag.text === newTag.text)) {
          setSavedPriorityTags([...savedPriorityTags, newTag]);
        }
        
        setPriority('custom');
      }
    } else if (customTagType === 'goalType') {
      if (customGoalTypeText.trim()) {
        // Create a new custom goal type tag
        const newTag: CustomTag = {
          text: customGoalTypeText,
          color: customGoalTypeColor
        };
        
        // Only add if not already in the list
        if (!savedGoalTypeTags.some(tag => tag.text === newTag.text)) {
          setSavedGoalTypeTags([...savedGoalTypeTags, newTag]);
        }
        
        setGoalType('custom');
      }
    } else if (customTagType === 'cleaningLocation') {
      if (customCleaningLocation.trim()) {
        // Create a new custom cleaning location tag
        const newTag: CustomTag = {
          text: customCleaningLocation,
          color: customCleaningLocationColor
        };
        
        // Only add if not already in the list
        if (!savedCleaningLocationTags.some(tag => tag.text === newTag.text)) {
          setSavedCleaningLocationTags([...savedCleaningLocationTags, newTag]);
        }
        
        setCleaningLocation('custom');
      }
    }
    setShowCustomTagModal(false);
  };
  
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <NeumorphicCard style={styles.form}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Add New Task</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#A0AEC0" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Task title"
            value={title}
            onChangeText={setTitle}
            autoFocus
          />

          {/* Daily Tab */}
          {category === 'daily' && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Type</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,