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
  bgColor?: string;
  mediumColor?: string;
  pastelColor?: string;
  shadowColor?: string;
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
  accentColor = '#4055C5',
  darkColor = '#2B6CB0',
  bgColor = '#F5F7FA',
  mediumColor = '#4A5568',
  pastelColor = '#E2E8F0',
  shadowColor = '#C8D0E0'
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
    <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
      <NeumorphicCard style={[styles.form, { backgroundColor: bgColor, shadowColor: shadowColor }]}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: darkColor }]}>Add New Task</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={mediumColor} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={[styles.input, { 
              backgroundColor: bgColor,
              borderColor: pastelColor,
              color: darkColor,
              shadowColor: shadowColor
            }]}
            placeholder="Task title"
            placeholderTextColor={mediumColor}
            value={title}
            onChangeText={setTitle}
            autoFocus
          />

          {/* Daily Tab */}
          {category === 'daily' && (
            <>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: darkColor }]}>Type</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton, 
                      { backgroundColor: pastelColor, shadowColor: shadowColor },
                      !isHabit && [styles.selectedOption, { backgroundColor: accentColor }]
                    ]}
                    onPress={() => setIsHabit(false)}
                  >
                    <Text style={[
                      styles.optionText, 
                      { color: mediumColor },
                      !isHabit && [styles.selectedText, { color: pastelColor }]
                    ]}>Task</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.optionButton, 
                      { backgroundColor: pastelColor, shadowColor: shadowColor },
                      isHabit && [styles.selectedOption, { backgroundColor: accentColor }]
                    ]}
                    onPress={() => setIsHabit(true)}
                  >
                    <Text style={[
                      styles.optionText, 
                      { color: mediumColor },
                      isHabit && [styles.selectedText, { color: pastelColor }]
                    ]}>Habit</Text>
                  </TouchableOpacity>
                </View>
                
                {isHabit && (
                  <View style={styles.habitFrequency}>
                    <Text style={[styles.habitFrequencyLabel, { color: mediumColor }]}>
                      Daily goal:
                    </Text>
                    <View style={[styles.habitGoalInput, { 
                      backgroundColor: bgColor,
                      shadowColor: shadowColor
                    }]}>
                      <TouchableOpacity 
                        style={[styles.habitGoalButton, { backgroundColor: pastelColor }]}
                        onPress={() => setHabitGoal(Math.max(1, habitGoal - 1))}
                      >
                        <Text style={[styles.habitGoalButtonText, { color: mediumColor }]}>-</Text>
                      </TouchableOpacity>
                      <Text style={[styles.habitGoalValue, { color: darkColor }]}>{habitGoal}</Text>
                      <TouchableOpacity 
                        style={[styles.habitGoalButton, { backgroundColor: pastelColor }]}
                        onPress={() => setHabitGoal(habitGoal + 1)}
                      >
                        <Text style={[styles.habitGoalButtonText, { color: mediumColor }]}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: darkColor }]}>Subtasks</Text>
                {subtasks.map((subtask, index) => (
                  <View key={index} style={styles.subtaskRow}>
                    <TextInput
                      style={[styles.subtaskInput, { 
                        backgroundColor: bgColor,
                        borderColor: pastelColor,
                        color: darkColor,
                        shadowColor: shadowColor
                      }]}
                      placeholder={`Subtask ${index + 1}`}
                      placeholderTextColor={mediumColor}
                      value={subtask}
                      onChangeText={(value) => updateSubtask(index, value)}
                    />
                    {subtasks.length > 1 && (
                      <TouchableOpacity onPress={() => removeSubtask(index)} style={styles.removeButton}>
                        <X size={16} color="#FC8181" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity 
                  onPress={addSubtask} 
                  style={[styles.addSubtaskButton, { backgroundColor: accentColor }]}
                >
                  <Plus size={16} color={pastelColor} />
                  <Text style={[styles.addSubtaskText, { color: pastelColor }]}>Add Subtask</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: darkColor }]}>Priority</Text>
                  <TouchableOpacity 
                    style={[styles.addCustomButton, { backgroundColor: pastelColor }]}
                    onPress={() => openCustomTagModal('priority')}
                  >
                    <Plus size={14} color={mediumColor} />
                    <Text style={[styles.addCustomText, { color: mediumColor }]}>Add Custom</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    key="low"
                    style={[
                      styles.optionButton, 
                      { backgroundColor: pastelColor, shadowColor: shadowColor },
                      priority === 'low' && [styles.selectedOption, {backgroundColor: '#68D391'}]
                    ]}
                    onPress={() => setPriority('low')}
                  >
                    <Text style={[
                      styles.optionText, 
                      { color: mediumColor },
                      priority === 'low' && styles.selectedText
                    ]}>
                      Low
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    key="medium"
                    style={[
                      styles.optionButton, 
                      { backgroundColor: pastelColor, shadowColor: shadowColor },
                      priority === 'medium' && [styles.selectedOption, {backgroundColor: '#4299E1'}]
                    ]}
                    onPress={() => setPriority('medium')}
                  >
                    <Text style={[
                      styles.optionText, 
                      { color: mediumColor },
                      priority === 'medium' && styles.selectedText
                    ]}>
                      Medium
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    key="high"
                    style={[
                      styles.optionButton, 
                      { backgroundColor: pastelColor, shadowColor: shadowColor },
                      priority === 'high' && [styles.selectedOption, {backgroundColor: '#FC8181'}]
                    ]}
                    onPress={() => setPriority('high')}
                  >
                    <Text style={[
                      styles.optionText, 
                      { color: mediumColor },
                      priority === 'high' && styles.selectedText
                    ]}>
                      High
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    key="quick-win"
                    style={[
                      styles.optionButton, 
                      { backgroundColor: pastelColor, shadowColor: shadowColor },
                      priority === 'quick-win' && [styles.selectedOption, {backgroundColor: '#F6AD55'}]
                    ]}
                    onPress={() => setPriority('quick-win')}
                  >
                    <Text style={[
                      styles.optionText, 
                      { color: mediumColor },
                      priority === 'quick-win' && styles.selectedText
                    ]}>
                      Quick Win
                    </Text>
                  </TouchableOpacity>
                  
                  {/* Display saved custom priority tags */}
                  {savedPriorityTags.map((tag, index) => (
                    <TouchableOpacity
                      key={`saved-priority-${index}`}
                      style={[
                        styles.optionButton, 
                        { backgroundColor: pastelColor, shadowColor: shadowColor },
                        priority === 'custom' && customPriorityText === tag.text && [
                          styles.selectedOption, 
                          { backgroundColor: tag.color }
                        ]
                      ]}
                      onPress={() => {
                        setPriority('custom');
                        setCustomPriorityText(tag.text);
                        setCustomPriorityColor(tag.color);
                      }}
                    >
                      <Text style={[
                        styles.optionText, 
                        { color: mediumColor },
                        priority === 'custom' && customPriorityText === tag.text && styles.selectedText
                      ]}>
                        {tag.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* Goals Tab - Modified section */}
          {category === 'goals' && (
            <>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: darkColor }]}>Goal Type</Text>
                  <TouchableOpacity 
                    style={[styles.addCustomButton, { backgroundColor: pastelColor }]}
                    onPress={() => openCustomTagModal('goalType')}
                  >
                    <Plus size={14} color={mediumColor} />
                    <Text style={[styles.addCustomText, { color: mediumColor }]}>Add Custom</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    key="TBD"
                    style={[
                      styles.optionButton, 
                      { backgroundColor: pastelColor, shadowColor: shadowColor },
                      goalType === 'TBD' && [styles.selectedOption, {backgroundColor: '#9F7AEA'}]
                    ]}
                    onPress={() => setGoalType('TBD')}
                  >
                    <Text style={[
                      styles.optionText, 
                      { color: mediumColor },
                      goalType === 'TBD' && styles.selectedText
                    ]}>
                      TBD
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    key="Not Priority"
                    style={[
                      styles.optionButton, 
                      { backgroundColor: pastelColor, shadowColor: shadowColor },
                      goalType === 'Not Priority' && [styles.selectedOption, {backgroundColor: '#FC8181'}]
                    ]}
                    onPress={() => setGoalType('Not Priority')}
                  >
                    <Text style={[
                      styles.optionText, 
                      { color: mediumColor },
                      goalType === 'Not Priority' && styles.selectedText
                    ]}>
                      Not Priority
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    key="Wish"
                    style={[
                      styles.optionButton, 
                      { backgroundColor: pastelColor, shadowColor: shadowColor },
                      goalType === 'Wish' && [styles.selectedOption, {backgroundColor: '#4299E1'}]
                    ]}
                    onPress={() => setGoalType('Wish')}
                  >
                    <Text style={[
                      styles.optionText, 
                      { color: mediumColor },
                      goalType === 'Wish' && styles.selectedText
                    ]}>
                      Wish
                    </Text>
                  </TouchableOpacity>
                  
                  {/* Display saved custom goal type tags */}
                  {savedGoalTypeTags.map((tag, index) => (
                    <TouchableOpacity
                      key={`saved-goalType-${index}`}
                      style={[
                        styles.optionButton, 
                        { backgroundColor: pastelColor, shadowColor: shadowColor },
                        goalType === 'custom' && customGoalTypeText === tag.text && [
                          styles.selectedOption, 
                          { backgroundColor: tag.color }
                        ]
                      ]}
                      onPress={() => {
                        setGoalType('custom');
                        setCustomGoalTypeText(tag.text);
                        setCustomGoalTypeColor(tag.color);
                      }}
                    >
                      <Text style={[
                        styles.optionText, 
                        { color: mediumColor },
                        goalType === 'custom' && customGoalTypeText === tag.text && styles.selectedText
                      ]}>
                        {tag.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: darkColor }]}>Subtasks</Text>
                {subtasks.map((subtask, index) => (
                  <View key={index} style={styles.subtaskRow}>
                    <TextInput
                      style={[styles.subtaskInput, { 
                        backgroundColor: bgColor,
                        borderColor: pastelColor,
                        color: darkColor,
                        shadowColor: shadowColor
                      }]}
                      placeholder={`Subtask ${index + 1}`}
                      placeholderTextColor={mediumColor}
                      value={subtask}
                      onChangeText={(value) => updateSubtask(index, value)}
                    />
                    {subtasks.length > 1 && (
                      <TouchableOpacity onPress={() => removeSubtask(index)} style={styles.removeButton}>
                        <X size={16} color="#FC8181" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity 
                  onPress={addSubtask} 
                  style={[styles.addSubtaskButton, { backgroundColor: accentColor }]}
                >
                  <Plus size={16} color={pastelColor} />
                  <Text style={[styles.addSubtaskText, { color: pastelColor }]}>Add Subtask</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Weekly Calendar Tab */}
          {category === 'weekly' && (
            <>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: darkColor }]}>Type</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton, 
                      { backgroundColor: pastelColor, shadowColor: shadowColor },
                      !isHabit && [styles.selectedOption, { backgroundColor: accentColor }]
                    ]}
                    onPress={() => setIsHabit(false)}
                  >
                    <Text style={[
                      styles.optionText, 
                      { color: mediumColor },
                      !isHabit && [styles.selectedText, { color: pastelColor }]
                    ]}>Task</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.optionButton, 
                      { backgroundColor: pastelColor, shadowColor: shadowColor },
                      isHabit && [styles.selectedOption, { backgroundColor: accentColor }]
                    ]}
                    onPress={() => setIsHabit(true)}
                  >
                    <Text style={[
                      styles.optionText, 
                      { color: mediumColor },
                      isHabit && [styles.selectedText, { color: pastelColor }]
                    ]}>Habit</Text>
                  </TouchableOpacity>
                </View>
                
                {isHabit && (
                  <View style={styles.habitFrequency}>
                    <Text style={[styles.habitFrequencyLabel, { color: mediumColor }]}>
                      Daily goal:
                    </Text>
                    <View style={[styles.habitGoalInput, { 
                      backgroundColor: bgColor,
                      shadowColor: shadowColor
                    }]}>
                      <TouchableOpacity 
                        style={[styles.habitGoalButton, { backgroundColor: pastelColor }]}
                        onPress={() => setHabitGoal(Math.max(1, habitGoal - 1))}
                      >
                        <Text style={[styles.habitGoalButtonText, { color: mediumColor }]}>-</Text>
                      </TouchableOpacity>
                      <Text style={[styles.habitGoalValue, { color: darkColor }]}>{habitGoal}</Text>
                      <TouchableOpacity 
                        style={[styles.habitGoalButton, { backgroundColor: pastelColor }]}
                        onPress={() => setHabitGoal(habitGoal + 1)}
                      >
                        <Text style={[styles.habitGoalButtonText, { color: mediumColor }]}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: darkColor }]}>Subtasks</Text>
                {subtasks.map((subtask, index) => (
                  <View key={index} style={styles.subtaskRow}>
                    <TextInput
                      style={[styles.subtaskInput, { 
                        backgroundColor: bgColor,
                        borderColor: pastelColor,
                        color: darkColor,
                        shadowColor: shadowColor
                      }]}
                      placeholder={`Subtask ${index + 1}`}
                      placeholderTextColor={mediumColor}
                      value={subtask}
                      onChangeText={(value) => updateSubtask(index, value)}
                    />
                    {subtasks.length > 1 && (
                      <TouchableOpacity onPress={() => removeSubtask(index)} style={styles.removeButton}>
                        <X size={16} color="#FC8181" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity 
                  onPress={addSubtask} 
                  style={[styles.addSubtaskButton, { backgroundColor: accentColor }]}
                >
                  <Plus size={16} color={pastelColor} />
                  <Text style={[styles.addSubtaskText, { color: pastelColor }]}>Add Subtask</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: darkColor }]}>Date Options</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton, 
                      { backgroundColor: pastelColor, shadowColor: shadowColor },
                      !isRecurring && [styles.selectedOption, { backgroundColor: accentColor }]
                    ]}
                    onPress={() => setIsRecurring(false)}
                  >
                    <Text style={[
                      styles.optionText, 
                      { color: mediumColor },
                      !isRecurring && [styles.selectedText, { color: pastelColor }]
                    ]}>One-time</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.optionButton, 
                      { backgroundColor: pastelColor, shadowColor: shadowColor },
                      isRecurring && [styles.selectedOption, { backgroundColor: accentColor }]
                    ]}
                    onPress={() => setIsRecurring(true)}
                  >
                    <Text style={[
                      styles.optionText, 
                      { color: mediumColor },
                      isRecurring && [styles.selectedText, { color: pastelColor }]
                    ]}>Recurring</Text>
                  </TouchableOpacity>
                </View>
                
                {isRecurring && (
                  <View style={styles.recurringOptions}>
                    <Text style={[styles.recurringTitle, { color: mediumColor }]}>Repeat on:</Text>
                    <View style={styles.daysRow}>
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.dayButton,
                            { backgroundColor: pastelColor, shadowColor: shadowColor },
                            recurringDays.includes(day) && { backgroundColor: accentColor }
                          ]}
                          onPress={() => toggleRecurringDay(day)}
                        >
                          <Text style={[
                            styles.dayText,
                            { color: mediumColor },
                            recurringDays.includes(day) && { color: pastelColor }
                          ]}>
                            {day.charAt(0)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </>
          )}

          {/* Meal Prep Tab - Updated for day of week tags */}
          {category === 'meal-prep' && (
            <>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: darkColor }]}>Meal Type</Text>
                <View style={styles.buttonRow}>
                  {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.optionButton, 
                        { backgroundColor: pastelColor, shadowColor: shadowColor },
                        mealType === type && [
                          styles.selectedOption,
                          { backgroundColor: accentColor }
                        ]
                      ]}
                      onPress={() => setMealType(type)}
                    >
                      <Text style={[
                        styles.optionText, 
                        { color: mediumColor },
                        mealType === type && [styles.selectedText, { color: pastelColor }]
                      ]}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: darkColor }]}>Day</Text>
                <View style={styles.buttonRow}>
                  {[
                    { day: 'Mon', color: '#FC8181' }, // Red
                    { day: 'Tue', color: '#F6AD55' }, // Orange
                    { day: 'Wed', color: '#F6E05E' }, // Yellow
                    { day: 'Thu', color: '#68D391' }, // Green
                    { day: 'Fri', color: '#4FD1C5' }, // Teal
                    { day: 'Sat', color: '#63B3ED' }, // Blue
                    { day: 'Sun', color: '#B794F4' }  // Purple
                  ].map(({ day, color }) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.optionButton, 
                        { backgroundColor: pastelColor, shadowColor: shadowColor },
                        dayOfWeek === day && [styles.selectedOption, { backgroundColor: color }]
                      ]}
                      onPress={() => setDayOfWeek(day)}
                    >
                      <Text style={[
                        styles.optionText, 
                        { color: mediumColor },
                        dayOfWeek === day && styles.selectedText
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: darkColor }]}>Recipe Notes</Text>
                <TextInput
                  style={[styles.input, styles.notesInput, { 
                    backgroundColor: bgColor,
                    borderColor: pastelColor,
                    color: darkColor,
                    shadowColor: shadowColor
                  }]}
                  placeholder="Add recipe notes, ingredients, etc."
                  placeholderTextColor={mediumColor}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </>
          )}

          {/* Cleaning Tab - Updated for custom location with color wheel */}
          {category === 'cleaning' && (
            <>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: darkColor }]}>Frequency</Text>
                <View style={styles.buttonRow}>
                  {['daily', 'weekly', 'monthly', 'seasonal'].map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.optionButton, 
                        { backgroundColor: pastelColor, shadowColor: shadowColor },
                        frequency === freq && [styles.selectedOption, { backgroundColor: accentColor }]
                      ]}
                      onPress={() => setFrequency(freq)}
                    >
                      <Text style={[
                        styles.optionText, 
                        { color: mediumColor },
                        frequency === freq && [styles.selectedText, { color: pastelColor }]
                      ]}>
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: darkColor }]}>Location</Text>
                  <TouchableOpacity 
                    style={[styles.addCustomButton, { backgroundColor: pastelColor }]}
                    onPress={() => openCustomTagModal('cleaningLocation')}
                  >
                    <Plus size={14} color={mediumColor} />
                    <Text style={[styles.addCustomText, { color: mediumColor }]}>Add Custom</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    key="kitchen"
                    style={[
                      styles.optionButton, 
                      { backgroundColor: pastelColor, shadowColor: shadowColor },
                      cleaningLocation === 'kitchen' && [styles.selectedOption, {backgroundColor: '#F6E05E'}]
                    ]}
                    onPress={() => setCleaningLocation('kitchen')}
                  >
                    <Text style={[
                      styles.optionText, 
                      { color: mediumColor },
                      cleaningLocation === 'kitchen' && styles.selectedText
                    ]}>
                      Kitchen
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    key="bathroom"
                    style={[
                      styles.optionButton, 
                      { backgroundColor: pastelColor, shadowColor: shadowColor },
                      cleaningLocation === 'bathroom' && [styles.selectedOption, {backgroundColor: '#4FD1C5'}]
                    ]}
                    onPress={() => setCleaningLocation('bathroom')}
                  >
                    <Text style={[
                      styles.optionText, 
                      { color: mediumColor },
                      cleaningLocation === 'bathroom' && styles.selectedText
                    ]}>
                      Bathroom
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    key="bedroom"
                    style={[
                      styles.optionButton, 
                      { backgroundColor: pastelColor, shadowColor: shadowColor },
                      cleaningLocation === 'bedroom' && [styles.selectedOption, {backgroundColor: '#9F7AEA'}]
                    ]}
                    onPress={() => setCleaningLocation('bedroom')}
                  >
                    <Text style={[
                      styles.optionText, 
                      { color: mediumColor },
                      cleaningLocation === 'bedroom' && styles.selectedText
                    ]}>
                      Bedroom
                    </Text>
                  </TouchableOpacity>
                  
                  {/* Display saved custom cleaning location tags */}
                  {savedCleaningLocationTags.map((tag, index) => (
                    <TouchableOpacity
                      key={`saved-cleaning-${index}`}
                      style={[
                        styles.optionButton, 
                        { backgroundColor: pastelColor, shadowColor: shadowColor },
                        cleaningLocation === 'custom' && customCleaningLocation === tag.text && [
                          styles.selectedOption, 
                          { backgroundColor: tag.color }
                        ]
                      ]}
                      onPress={() => {
                        setCleaningLocation('custom');
                        setCustomCleaningLocation(tag.text);
                        setCustomCleaningLocationColor(tag.color);
                      }}
                    >
                      <Text style={[
                        styles.optionText, 
                        { color: mediumColor },
                        cleaningLocation === 'custom' && customCleaningLocation === tag.text && styles.selectedText
                      ]}>
                        {tag.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: darkColor }]}>Subtasks</Text>
                {subtasks.map((subtask, index) => (
                  <View key={index} style={styles.subtaskRow}>
                    <TextInput
                      style={[styles.subtaskInput, { 
                        backgroundColor: bgColor,
                        borderColor: pastelColor,
                        color: darkColor,
                        shadowColor: shadowColor
                      }]}
                      placeholder={`Subtask ${index + 1}`}
                      placeholderTextColor={mediumColor}
                      value={subtask}
                      onChangeText={(value) => updateSubtask(index, value)}
                    />
                    {subtasks.length > 1 && (
                      <TouchableOpacity onPress={() => removeSubtask(index)} style={styles.removeButton}>
                        <X size={16} color="#FC8181" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity 
                  onPress={addSubtask} 
                  style={[styles.addSubtaskButton, { backgroundColor: accentColor }]}
                >
                  <Plus size={16} color={pastelColor} />
                  <Text style={[styles.addSubtaskText, { color: pastelColor }]}>Add Subtask</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Self-care Tab - Removed Frequency section */}
          {category === 'self-care' && (
            <>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: darkColor }]}>Self-Care Type</Text>
                <View style={styles.buttonRow}>
                  {[
                    { type: 'physical', label: 'Physical Health', color: '#68D391' },
                    { type: 'mental', label: 'Mental Health', color: '#9F7AEA' },
                    { type: 'rest', label: 'Rest & Recovery', color: '#4FD1C5' },
                    { type: 'joy', label: 'Joy & Connection', color: '#F6AD55' }
                  ].map(({ type, label, color }) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.optionButton, 
                        { backgroundColor: pastelColor, shadowColor: shadowColor },
                        selfCareType === type && [styles.selectedOption, {backgroundColor: color}]
                      ]}
                      onPress={() => setSelfCareType(type)}
                    >
                      <Text style={[
                        styles.optionText, 
                        { color: mediumColor },
                        selfCareType === type && styles.selectedText
                      ]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: darkColor }]}>Subtasks</Text>
                {subtasks.map((subtask, index) => (
                  <View key={index} style={styles.subtaskRow}>
                    <TextInput
                      style={[styles.subtaskInput, { 
                        backgroundColor: bgColor,
                        borderColor: pastelColor,
                        color: darkColor,
                        shadowColor: shadowColor
                      }]}
                      placeholder={`Subtask ${index + 1}`}
                      placeholderTextColor={mediumColor}
                      value={subtask}
                      onChangeText={(value) => updateSubtask(index, value)}
                    />
                    {subtasks.length > 1 && (
                      <TouchableOpacity onPress={() => removeSubtask(index)} style={styles.removeButton}>
                        <X size={16} color="#FC8181" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity 
                  onPress={addSubtask} 
                  style={[styles.addSubtaskButton, { backgroundColor: accentColor }]}
                >
                  <Plus size={16} color={pastelColor} />
                  <Text style={[styles.addSubtaskText, { color: pastelColor }]}>Add Subtask</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Delegation Tab - Removed Frequency, renamed field, added tag selection */}
          {category === 'delegation' && (
            <>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: darkColor }]}>Delegate To</Text>
                <View style={styles.buttonRow}>
                  {[
                    { type: 'partner', label: 'Partner Tasks', color: '#63B3ED' },
                    { type: 'family', label: 'Family Tasks', color: '#F6AD55' },
                    { type: 'friends', label: 'Friends Tasks', color: '#9F7AEA' },
                    { type: 'kids', label: 'Kids Tasks', color: '#68D391' }
                  ].map(({ type, label, color }) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.optionButton, 
                        { backgroundColor: pastelColor, shadowColor: shadowColor },
                        delegateType === type && [styles.selectedOption, {backgroundColor: color}]
                      ]}
                      onPress={() => setDelegateType(type)}
                    >
                      <Text style={[
                        styles.optionText, 
                        { color: mediumColor },
                        delegateType === type && styles.selectedText
                      ]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: darkColor }]}>Delegate Name</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: bgColor,
                    borderColor: pastelColor,
                    color: darkColor,
                    shadowColor: shadowColor
                  }]}
                  placeholder="Person's name"
                  placeholderTextColor={mediumColor}
                  value={delegatedTo}
                  onChangeText={setDelegatedTo}
                />
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: darkColor }]}>Subtasks</Text>
                {subtasks.map((subtask, index) => (
                  <View key={index} style={styles.subtaskRow}>
                    <TextInput
                      style={[styles.subtaskInput, { 
                        backgroundColor: bgColor,
                        borderColor: pastelColor,
                        color: darkColor,
                        shadowColor: shadowColor
                      }]}
                      placeholder={`Subtask ${index + 1}`}
                      placeholderTextColor={mediumColor}
                      value={subtask}
                      onChangeText={(value) => updateSubtask(index, value)}
                    />
                    {subtasks.length > 1 && (
                      <TouchableOpacity onPress={() => removeSubtask(index)} style={styles.removeButton}>
                        <X size={16} color="#FC8181" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity 
                  onPress={addSubtask} 
                  style={[styles.addSubtaskButton, { backgroundColor: accentColor }]}
                >
                  <Plus size={16} color={pastelColor} />
                  <Text style={[styles.addSubtaskText, { color: pastelColor }]}>Add Subtask</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <View style={styles.reminderRow}>
                  <Text style={[styles.sectionTitle, { color: darkColor }]}>Add task reminder</Text>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      { backgroundColor: pastelColor },
                      reminderEnabled && { backgroundColor: accentColor }
                    ]}
                    onPress={() => setReminderEnabled(!reminderEnabled)}
                  >
                    <View style={[
                      styles.toggleKnob,
                      { backgroundColor: bgColor },
                      reminderEnabled && { transform: [{ translateX: 18 }] }
                    ]} />
                  </TouchableOpacity>
                </View>
                {reminderEnabled && (
                  <Text style={[styles.reminderText, { color: mediumColor }]}>
                    Will add reminder to goals: "Remind {delegatedTo || 'person'} to {title}"
                  </Text>
                )}
              </View>
            </>
          )}

          <TouchableOpacity 
            style={[styles.submitButton, { 
              backgroundColor: darkColor,
              shadowColor: shadowColor
            }]} 
            onPress={handleSubmit}
          >
            <Plus size={20} color={pastelColor} />
            <Text style={[styles.submitText, { color: pastelColor }]}>Add Task</Text>
          </TouchableOpacity>
        </ScrollView>
      </NeumorphicCard>

      {/* Custom Tag Modal - Modified for filtered color options */}
      <Modal
        transparent
        visible={showCustomTagModal}
        animationType="fade"
        onRequestClose={() => setShowCustomTagModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <NeumorphicCard style={[styles.modalContent, { 
            backgroundColor: bgColor,
            shadowColor: shadowColor
          }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: darkColor }]}>
                {customTagType === 'priority' ? 'Custom Priority' : 
                 customTagType === 'goalType' ? 'Custom Goal Type' : 
                 'Custom Location'}
              </Text>
              <TouchableOpacity onPress={() => setShowCustomTagModal(false)}>
                <X size={24} color={mediumColor} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalLabel, { color: darkColor }]}>
              {customTagType === 'cleaningLocation' ? 'Location Name' : 'Tag Text'}
            </Text>
            <TextInput
              style={[styles.modalInput, { 
                backgroundColor: bgColor,
                borderColor: pastelColor,
                color: darkColor
              }]}
              placeholder={
                customTagType === 'priority' ? "Enter custom priority" : 
                customTagType === 'goalType' ? "Enter custom goal type" : 
                "Enter custom location"
              }
              placeholderTextColor={mediumColor}
              value={
                customTagType === 'priority' ? customPriorityText : 
                customTagType === 'goalType' ? customGoalTypeText : 
                customCleaningLocation
              }
              onChangeText={(text) => {
                if (customTagType === 'priority') {
                  setCustomPriorityText(text);
                } else if (customTagType === 'goalType') {
                  setCustomGoalTypeText(text);
                } else {
                  setCustomCleaningLocation(text);
                }
              }}
            />

            <Text style={[styles.modalLabel, { color: darkColor }]}>Tag Color</Text>
            <View style={styles.colorOptionsRow}>
              {getAvailableColorOptions(customTagType).map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color, borderColor: pastelColor },
                    ((customTagType === 'priority' ? customPriorityColor : 
                     customTagType === 'goalType' ? customGoalTypeColor :
                     customCleaningLocationColor) === color) && 
                    [styles.selectedColorOption, { borderColor: darkColor }]
                  ]}
                  onPress={() => {
                    if (customTagType === 'priority') {
                      setCustomPriorityColor(color);
                    } else if (customTagType === 'goalType') {
                      setCustomGoalTypeColor(color);
                    } else {
                      setCustomCleaningLocationColor(color);
                    }
                  }}
                />
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: pastelColor }]} 
                onPress={() => setShowCustomTagModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: mediumColor }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton, { backgroundColor: darkColor }]} 
                onPress={saveCustomTag}
              >
                <Text style={[styles.saveButtonText, { color: pastelColor }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </NeumorphicCard>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  form: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    margin: 0,
    maxHeight: '90%',
  },
  scrollView: {
    flexGrow: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
  },
  closeButton: {
    padding: 4,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    marginBottom: 20,
    borderWidth: 1,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
  },
  addCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 12,
  },
  addCustomText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    marginLeft: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 4,
  },
  selectedOption: {
    shadowOpacity: 0.3,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
  },
  selectedText: {
    color: '#ffffff',
  },
  habitFrequency: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  habitFrequencyLabel: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
  },
  habitGoalInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  habitGoalButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  habitGoalButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  habitGoalValue: {
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtaskInput: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    marginRight: 8,
    borderWidth: 1,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  removeButton: {
    padding: 4,
  },
  addSubtaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  addSubtaskText: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    marginLeft: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  submitText: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    marginLeft: 8,
  },
  recurringOptions: {
    marginTop: 10,
  },
  recurringTitle: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
    marginBottom: 8,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleButton: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  reminderText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
  },
  modalLabel: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    marginBottom: 8,
  },
  modalInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    marginBottom: 16,
    borderWidth: 1,
  },
  // Updated to show colors in a single row
  colorOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 20,
    gap: 8,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 2,
    borderWidth: 1,
  },
  selectedColorOption: {
    borderWidth: 2,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
  },
  saveButton: {
  },
  cancelButtonText: {
    fontFamily: 'Quicksand-SemiBold',
    fontSize: 16,
  },
  saveButtonText: {
    fontFamily: 'Quicksand-SemiBold',
    fontSize: 16,
  },
});