import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Plus, X, Calendar as CalendarIcon } from 'lucide-react-native';
import NeumorphicCard from './NeumorphicCard';

interface AddTaskFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: {
    title: string;
    isHabit: boolean;
    priority: string;
    isDelegated: boolean;
    delegatedTo: string;
    subtasks: { title: string }[];
    habitGoal?: number;
    // New fields
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
  }) => void;
  category: string;
  selectedDate?: Date | null;
}

export default function AddTaskForm({ visible, onClose, onSubmit, category, selectedDate }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [isHabit, setIsHabit] = useState(false);
  const [habitGoal, setHabitGoal] = useState(1);
  const [priority, setPriority] = useState('medium');
  const [isDelegated, setIsDelegated] = useState(false);
  const [delegatedTo, setDelegatedTo] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>(['']);

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

  const handleSubmit = () => {
    if (title.trim()) {
      const baseTask = {
        title: title.trim(),
        isHabit,
        priority,
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

      // Meal prep specific fields
      if (category === 'meal-prep') {
        taskData = {
          ...taskData,
          mealType,
          dayOfWeek,
          notes,
        };
      }

      // Cleaning, self-care, delegation specific fields
      if (['cleaning', 'self-care', 'delegation'].includes(category)) {
        taskData = {
          ...taskData,
          frequency,
        };
      }

      // Cleaning location
      if (category === 'cleaning') {
        taskData = {
          ...taskData,
          cleaningLocation: cleaningLocation === 'custom' ? customCleaningLocation : cleaningLocation,
        };
      }

      // Delegation reminder
      if (category === 'delegation') {
        taskData = {
          ...taskData,
          reminderEnabled,
        };
      }

      onSubmit(taskData);

      // Reset all fields
      setTitle('');
      setIsHabit(false);
      setHabitGoal(1);
      setPriority('medium');
      setIsDelegated(false);
      setDelegatedTo('');
      setSubtasks(['']);
      setMealType('');
      setDayOfWeek('');
      setNotes('');
      setFrequency('');
      setIsRecurring(false);
      setRecurringDays([]);
      setReminderEnabled(false);
      setCleaningLocation('');
      setCustomCleaningLocation('');
      
      onClose();
    }
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
    switch (category) {
      case 'daily': return '#2B6CB0'; // Changed to dark blue
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
                      !isHabit && [styles.selectedOption, {backgroundColor: getTabColor()}]
                    ]}
                    onPress={() => setIsHabit(false)}
                  >
                    <Text style={[styles.optionText, !isHabit && styles.selectedText]}>Task</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.optionButton, 
                      isHabit && [styles.selectedOption, {backgroundColor: getTabColor()}]
                    ]}
                    onPress={() => setIsHabit(true)}
                  >
                    <Text style={[styles.optionText, isHabit && styles.selectedText]}>Habit</Text>
                  </TouchableOpacity>
                </View>
                
                {isHabit && (
                  <View style={styles.habitFrequency}>
                    <Text style={styles.habitFrequencyLabel}>
                      Daily goal:
                    </Text>
                    <View style={styles.habitGoalInput}>
                      <TouchableOpacity 
                        style={styles.habitGoalButton}
                        onPress={() => setHabitGoal(Math.max(1, habitGoal - 1))}
                      >
                        <Text style={styles.habitGoalButtonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.habitGoalValue}>{habitGoal}</Text>
                      <TouchableOpacity 
                        style={styles.habitGoalButton}
                        onPress={() => setHabitGoal(habitGoal + 1)}
                      >
                        <Text style={styles.habitGoalButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Subtasks</Text>
                {subtasks.map((subtask, index) => (
                  <View key={index} style={styles.subtaskRow}>
                    <TextInput
                      style={styles.subtaskInput}
                      placeholder={`Subtask ${index + 1}`}
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
                <TouchableOpacity onPress={addSubtask} style={styles.addSubtaskButton}>
                  <Plus size={16} color={getTabColor()} />
                  <Text style={[styles.addSubtaskText, { color: getTabColor() }]}>Add Subtask</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Priority</Text>
                <View style={styles.buttonRow}>
                  {['low', 'medium', 'high', 'quick-win'].map((prio) => (
                    <TouchableOpacity
                      key={prio}
                      style={[
                        styles.optionButton, 
                        priority === prio && [styles.selectedOption, {backgroundColor: getTabColor()}]
                      ]}
                      onPress={() => setPriority(prio)}
                    >
                      <Text style={[styles.optionText, priority === prio && styles.selectedText]}>
                        {prio === 'quick-win' ? 'Quick Win' : prio.charAt(0).toUpperCase() + prio.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* Goals Tab */}
          {category === 'goals' && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Type</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton, 
                      !isHabit && [styles.selectedOption, {backgroundColor: getTabColor()}]
                    ]}
                    onPress={() => setIsHabit(false)}
                  >
                    <Text style={[styles.optionText, !isHabit && styles.selectedText]}>Task</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.optionButton, 
                      isHabit && [styles.selectedOption, {backgroundColor: getTabColor()}]
                    ]}
                    onPress={() => setIsHabit(true)}
                  >
                    <Text style={[styles.optionText, isHabit && styles.selectedText]}>Habit</Text>
                  </TouchableOpacity>
                </View>
                
                {isHabit && (
                  <View style={styles.habitFrequency}>
                    <Text style={styles.habitFrequencyLabel}>
                      Daily goal:
                    </Text>
                    <View style={styles.habitGoalInput}>
                      <TouchableOpacity 
                        style={styles.habitGoalButton}
                        onPress={() => setHabitGoal(Math.max(1, habitGoal - 1))}
                      >
                        <Text style={styles.habitGoalButtonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.habitGoalValue}>{habitGoal}</Text>
                      <TouchableOpacity 
                        style={styles.habitGoalButton}
                        onPress={() => setHabitGoal(habitGoal + 1)}
                      >
                        <Text style={styles.habitGoalButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Subtasks</Text>
                {subtasks.map((subtask, index) => (
                  <View key={index} style={styles.subtaskRow}>
                    <TextInput
                      style={styles.subtaskInput}
                      placeholder={`Subtask ${index + 1}`}
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
                <TouchableOpacity onPress={addSubtask} style={styles.addSubtaskButton}>
                  <Plus size={16} color={getTabColor()} />
                  <Text style={[styles.addSubtaskText, { color: getTabColor() }]}>Add Subtask</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Weekly Calendar Tab */}
          {category === 'weekly' && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Type</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton, 
                      !isHabit && [styles.selectedOption, {backgroundColor: getTabColor()}]
                    ]}
                    onPress={() => setIsHabit(false)}
                  >
                    <Text style={[styles.optionText, !isHabit && styles.selectedText]}>Task</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.optionButton, 
                      isHabit && [styles.selectedOption, {backgroundColor: getTabColor()}]
                    ]}
                    onPress={() => setIsHabit(true)}
                  >
                    <Text style={[styles.optionText, isHabit && styles.selectedText]}>Habit</Text>
                  </TouchableOpacity>
                </View>
                
                {isHabit && (
                  <View style={styles.habitFrequency}>
                    <Text style={styles.habitFrequencyLabel}>
                      Daily goal:
                    </Text>
                    <View style={styles.habitGoalInput}>
                      <TouchableOpacity 
                        style={styles.habitGoalButton}
                        onPress={() => setHabitGoal(Math.max(1, habitGoal - 1))}
                      >
                        <Text style={styles.habitGoalButtonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.habitGoalValue}>{habitGoal}</Text>
                      <TouchableOpacity 
                        style={styles.habitGoalButton}
                        onPress={() => setHabitGoal(habitGoal + 1)}
                      >
                        <Text style={styles.habitGoalButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Subtasks</Text>
                {subtasks.map((subtask, index) => (
                  <View key={index} style={styles.subtaskRow}>
                    <TextInput
                      style={styles.subtaskInput}
                      placeholder={`Subtask ${index + 1}`}
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
                <TouchableOpacity onPress={addSubtask} style={styles.addSubtaskButton}>
                  <Plus size={16} color={getTabColor()} />
                  <Text style={[styles.addSubtaskText, { color: getTabColor() }]}>Add Subtask</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Date Options</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton, 
                      !isRecurring && [styles.selectedOption, {backgroundColor: getTabColor()}]
                    ]}
                    onPress={() => setIsRecurring(false)}
                  >
                    <Text style={[styles.optionText, !isRecurring && styles.selectedText]}>One-time</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.optionButton, 
                      isRecurring && [styles.selectedOption, {backgroundColor: getTabColor()}]
                    ]}
                    onPress={() => setIsRecurring(true)}
                  >
                    <Text style={[styles.optionText, isRecurring && styles.selectedText]}>Recurring</Text>
                  </TouchableOpacity>
                </View>
                
                {isRecurring && (
                  <View style={styles.recurringOptions}>
                    <Text style={styles.recurringTitle}>Repeat on:</Text>
                    <View style={styles.daysRow}>
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.dayButton,
                            recurringDays.includes(day) && {backgroundColor: getTabColor()}
                          ]}
                          onPress={() => toggleRecurringDay(day)}
                        >
                          <Text style={[
                            styles.dayText,
                            recurringDays.includes(day) && {color: '#FFFFFF'}
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

          {/* Meal Prep Tab */}
          {category === 'meal-prep' && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Meal Type</Text>
                <View style={styles.buttonRow}>
                  {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.optionButton, 
                        mealType === type && [styles.selectedOption, {backgroundColor: getTabColor()}]
                      ]}
                      onPress={() => setMealType(type)}
                    >
                      <Text style={[styles.optionText, mealType === type && styles.selectedText]}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Day</Text>
                <View style={styles.buttonRow}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.optionButton, 
                        dayOfWeek === day && [styles.selectedOption, {backgroundColor: getTabColor()}]
                      ]}
                      onPress={() => setDayOfWeek(day)}
                    >
                      <Text style={[styles.optionText, dayOfWeek === day && styles.selectedText]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recipe Notes</Text>
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  placeholder="Add recipe notes, ingredients, etc."
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </>
          )}

          {/* Cleaning Tab */}
          {category === 'cleaning' && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Frequency</Text>
                <View style={styles.buttonRow}>
                  {['daily', 'weekly', 'monthly', 'seasonal'].map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.optionButton, 
                        frequency === freq && [styles.selectedOption, {backgroundColor: getTabColor()}]
                      ]}
                      onPress={() => setFrequency(freq)}
                    >
                      <Text style={[styles.optionText, frequency === freq && styles.selectedText]}>
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.buttonRow}>
                  {['kitchen', 'bathroom', 'bedroom', 'custom'].map((loc) => (
                    <TouchableOpacity
                      key={loc}
                      style={[
                        styles.optionButton, 
                        cleaningLocation === loc && [styles.selectedOption, {backgroundColor: getTabColor()}]
                      ]}
                      onPress={() => setCleaningLocation(loc)}
                    >
                      <Text style={[styles.optionText, cleaningLocation === loc && styles.selectedText]}>
                        {loc === 'custom' ? 'Other' : loc.charAt(0).toUpperCase() + loc.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                {cleaningLocation === 'custom' && (
                  <TextInput
                    style={[styles.input, { marginTop: 8 }]}
                    placeholder="Enter location"
                    value={customCleaningLocation}
                    onChangeText={setCustomCleaningLocation}
                  />
                )}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Subtasks</Text>
                {subtasks.map((subtask, index) => (
                  <View key={index} style={styles.subtaskRow}>
                    <TextInput
                      style={styles.subtaskInput}
                      placeholder={`Subtask ${index + 1}`}
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
                <TouchableOpacity onPress={addSubtask} style={styles.addSubtaskButton}>
                  <Plus size={16} color={getTabColor()} />
                  <Text style={[styles.addSubtaskText, { color: getTabColor() }]}>Add Subtask</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Self-care Tab */}
          {category === 'self-care' && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Frequency</Text>
                <View style={styles.buttonRow}>
                  {['daily', 'weekly', 'monthly', 'seasonal'].map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.optionButton, 
                        frequency === freq && [styles.selectedOption, {backgroundColor: getTabColor()}]
                      ]}
                      onPress={() => setFrequency(freq)}
                    >
                      <Text style={[styles.optionText, frequency === freq && styles.selectedText]}>
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Subtasks</Text>
                {subtasks.map((subtask, index) => (
                  <View key={index} style={styles.subtaskRow}>
                    <TextInput
                      style={styles.subtaskInput}
                      placeholder={`Subtask ${index + 1}`}
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
                <TouchableOpacity onPress={addSubtask} style={styles.addSubtaskButton}>
                  <Plus size={16} color={getTabColor()} />
                  <Text style={[styles.addSubtaskText, { color: getTabColor() }]}>Add Subtask</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Delegation Tab */}
          {category === 'delegation' && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Frequency</Text>
                <View style={styles.buttonRow}>
                  {['daily', 'weekly', 'monthly', 'seasonal'].map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.optionButton, 
                        frequency === freq && [styles.selectedOption, {backgroundColor: getTabColor()}]
                      ]}
                      onPress={() => setFrequency(freq)}
                    >
                      <Text style={[styles.optionText, frequency === freq && styles.selectedText]}>
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Delegate To</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Person's name"
                  value={delegatedTo}
                  onChangeText={setDelegatedTo}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Subtasks</Text>
                {subtasks.map((subtask, index) => (
                  <View key={index} style={styles.subtaskRow}>
                    <TextInput
                      style={styles.subtaskInput}
                      placeholder={`Subtask ${index + 1}`}
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
                <TouchableOpacity onPress={addSubtask} style={styles.addSubtaskButton}>
                  <Plus size={16} color={getTabColor()} />
                  <Text style={[styles.addSubtaskText, { color: getTabColor() }]}>Add Subtask</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <View style={styles.reminderRow}>
                  <Text style={styles.sectionTitle}>Add task reminder</Text>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      reminderEnabled && { backgroundColor: getTabColor() }
                    ]}
                    onPress={() => setReminderEnabled(!reminderEnabled)}
                  >
                    <View style={[
                      styles.toggleKnob,
                      reminderEnabled && { transform: [{ translateX: 18 }] }
                    ]} />
                  </TouchableOpacity>
                </View>
                {reminderEnabled && (
                  <Text style={styles.reminderText}>
                    Will add reminder to goals: "Remind {delegatedTo || 'person'} to {title}"
                  </Text>
                )}
              </View>
            </>
          )}

          <TouchableOpacity style={[styles.submitButton, { backgroundColor: getTabColor() }]} onPress={handleSubmit}>
            <Plus size={20} color="#ffffff" />
            <Text style={styles.submitText}>Add Task</Text>
          </TouchableOpacity>
        </ScrollView>
      </NeumorphicCard>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    color: '#2D3748',
  },
  closeButton: {
    padding: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    marginBottom: 20,
    shadowColor: '#C8D0E0',
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
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    color: '#4A5568',
    marginBottom: 8,
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
    backgroundColor: '#E2E8F0',
    shadowColor: '#C8D0E0',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selectedOption: {
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOpacity: 0.3,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    color: '#4A5568',
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
    color: '#4A5568',
  },
  habitGoalInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 4,
    shadowColor: '#C8D0E0',
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
    backgroundColor: '#E2E8F0',
  },
  habitGoalButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A5568',
  },
  habitGoalValue: {
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    color: '#2D3748',
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtaskInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    marginRight: 8,
    shadowColor: '#C8D0E0',
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
    color: '#ffffff',
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
    color: '#4A5568',
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
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C8D0E0',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    color: '#4A5568',
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
    backgroundColor: '#CBD5E0',
    padding: 2,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  reminderText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    color: '#4A5568',
    fontStyle: 'italic',
    marginBottom: 10,
  }
});