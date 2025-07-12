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
import NeumorphicCard from './NeumorphicCard';
import { Task } from './TaskItem';

interface EditTaskFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (updatedTask: Task) => void;
  initialTask: Task | null;
  accentColor?: string;
  darkColor?: string;
}

export default function EditTaskForm({
  visible,
  onClose,
  onSubmit,
  initialTask,
  accentColor = '#4055C5',
  darkColor = '#2B6CB0'
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

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setIsHabit(initialTask.isHabit || false);
      setHabitGoal(initialTask.habitGoal?.toString() || '');
      setPriority(initialTask.priority || '');
      setCustomPriorityText(initialTask.customPriorityText || '');
      setCustomPriorityColor(initialTask.customPriorityColor || '#4A5568');
      setGoalType(initialTask.goalType || '');
      setCustomGoalTypeText(initialTask.customGoalTypeText || '');
      setCustomGoalTypeColor(initialTask.customGoalTypeColor || '#4A5568');
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
    }
  }, [initialTask]);

  const resetForm = () => {
    setTitle('');
    setIsHabit(false);
    setHabitGoal('');
    setPriority('');
    setCustomPriorityText('');
    setCustomPriorityColor('#4A5568');
    setGoalType('');
    setCustomGoalTypeText('');
    setCustomGoalTypeColor('#4A5568');
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
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!title.trim() || !initialTask) return;

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
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Task</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color="#4A5568" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <NeumorphicCard style={styles.formCard}>
            <Text style={styles.label}>Task Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              multiline
            />

            {/* Habit Settings */}
            <View style={styles.switchRow}>
              <Text style={styles.label}>Is this a habit?</Text>
              <Switch
                value={isHabit}
                onValueChange={setIsHabit}
                trackColor={{ false: '#E2E8F0', true: accentColor }}
                thumbColor="#ffffff"
              />
            </View>

            {isHabit && (
              <>
                <Text style={styles.label}>Daily Goal</Text>
                <TextInput
                  style={styles.input}
                  value={habitGoal}
                  onChangeText={setHabitGoal}
                  placeholder="e.g., 3"
                  keyboardType="numeric"
                />
              </>
            )}

            {/* Daily Tasks - Priority */}
            {initialTask.category === 'daily' && (
              <>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.optionGrid}>
                  {['high', 'medium', 'low', 'quick-win', 'custom'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        priority === option && { backgroundColor: accentColor }
                      ]}
                      onPress={() => setPriority(option)}
                    >
                      <Text style={[
                        styles.optionText,
                        priority === option && { color: '#ffffff' }
                      ]}>
                        {option === 'quick-win' ? 'Quick Win' : option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {priority === 'custom' && (
                  <>
                    <Text style={styles.label}>Custom Priority Text</Text>
                    <TextInput
                      style={styles.input}
                      value={customPriorityText}
                      onChangeText={setCustomPriorityText}
                      placeholder="Enter custom priority"
                    />
                  </>
                )}
              </>
            )}

            {/* Goals - Goal Type */}
            {initialTask.category === 'goals' && (
              <>
                <Text style={styles.label}>Goal Type</Text>
                <View style={styles.optionGrid}>
                  {['TBD', 'Not Priority', 'Wish', 'custom'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        goalType === option && { backgroundColor: accentColor }
                      ]}
                      onPress={() => setGoalType(option)}
                    >
                      <Text style={[
                        styles.optionText,
                        goalType === option && { color: '#ffffff' }
                      ]}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {goalType === 'custom' && (
                  <>
                    <Text style={styles.label}>Custom Goal Type</Text>
                    <TextInput
                      style={styles.input}
                      value={customGoalTypeText}
                      onChangeText={setCustomGoalTypeText}
                      placeholder="Enter custom goal type"
                    />
                  </>
                )}
              </>
            )}

            {/* Meal Prep */}
            {initialTask.category === 'meal-prep' && (
              <>
                <Text style={styles.label}>Meal Type</Text>
                <View style={styles.optionGrid}>
                  {['breakfast', 'lunch', 'dinner', 'snack'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        mealType === option && { backgroundColor: accentColor }
                      ]}
                      onPress={() => setMealType(option)}
                    >
                      <Text style={[
                        styles.optionText,
                        mealType === option && { color: '#ffffff' }
                      ]}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Day of Week</Text>
                <View style={styles.optionGrid}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.optionButton,
                        dayOfWeek === day && { backgroundColor: accentColor }
                      ]}
                      onPress={() => setDayOfWeek(day)}
                    >
                      <Text style={[
                        styles.optionText,
                        dayOfWeek === day && { color: '#ffffff' }
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add any notes or details"
                  multiline
                  numberOfLines={3}
                />
              </>
            )}

            {/* Cleaning */}
            {initialTask.category === 'cleaning' && (
              <>
                <Text style={styles.label}>Frequency</Text>
                <View style={styles.optionGrid}>
                  {['daily', 'weekly', 'monthly', 'seasonal'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        frequency === option && { backgroundColor: accentColor }
                      ]}
                      onPress={() => setFrequency(option)}
                    >
                      <Text style={[
                        styles.optionText,
                        frequency === option && { color: '#ffffff' }
                      ]}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Location</Text>
                <View style={styles.optionGrid}>
                  {['kitchen', 'bathroom', 'bedroom', 'custom'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        cleaningLocation === option && { backgroundColor: accentColor }
                      ]}
                      onPress={() => setCleaningLocation(option)}
                    >
                      <Text style={[
                        styles.optionText,
                        cleaningLocation === option && { color: '#ffffff' }
                      ]}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {cleaningLocation === 'custom' && (
                  <>
                    <Text style={styles.label}>Custom Location</Text>
                    <TextInput
                      style={styles.input}
                      value={customCleaningLocation}
                      onChangeText={setCustomCleaningLocation}
                      placeholder="Enter custom location"
                    />
                  </>
                )}
              </>
            )}

            {/* Self-Care */}
            {initialTask.category === 'self-care' && (
              <>
                <Text style={styles.label}>Self-Care Type</Text>
                <View style={styles.optionGrid}>
                  {['physical', 'mental', 'rest', 'joy'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        selfCareType === option && { backgroundColor: accentColor }
                      ]}
                      onPress={() => setSelfCareType(option)}
                    >
                      <Text style={[
                        styles.optionText,
                        selfCareType === option && { color: '#ffffff' }
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
                <Text style={styles.label}>Delegate To</Text>
                <TextInput
                  style={styles.input}
                  value={delegatedTo}
                  onChangeText={setDelegatedTo}
                  placeholder="Who will handle this task?"
                />

                <Text style={styles.label}>Delegate Type</Text>
                <View style={styles.optionGrid}>
                  {['partner', 'family', 'friends', 'kids'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        delegateType === option && { backgroundColor: accentColor }
                      ]}
                      onPress={() => setDelegateType(option)}
                    >
                      <Text style={[
                        styles.optionText,
                        delegateType === option && { color: '#ffffff' }
                      ]}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.switchRow}>
                  <Text style={styles.label}>Enable Reminders</Text>
                  <Switch
                    value={reminderEnabled}
                    onValueChange={setReminderEnabled}
                    trackColor={{ false: '#E2E8F0', true: accentColor }}
                    thumbColor="#ffffff"
                  />
                </View>
              </>
            )}

            {/* Subtasks */}
            <View style={styles.subtasksSection}>
              <View style={styles.subtasksHeader}>
                <Text style={styles.label}>Subtasks</Text>
                <TouchableOpacity onPress={addSubtask} style={styles.addSubtaskButton}>
                  <Plus size={16} color={darkColor} />
                </TouchableOpacity>
              </View>

              {subtasks.map((subtask, index) => (
                <View key={subtask.id} style={styles.subtaskRow}>
                  <TextInput
                    style={[styles.input, styles.subtaskInput]}
                    value={subtask.title}
                    onChangeText={(text) => updateSubtask(subtask.id, text)}
                    placeholder={`Subtask ${index + 1}`}
                  />
                  <TouchableOpacity
                    onPress={() => removeSubtask(subtask.id)}
                    style={styles.removeSubtaskButton}
                  >
                    <Minus size={16} color="#FC8181" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </NeumorphicCard>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: darkColor }]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitText}>Update Task</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    color: '#2D3748',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
  },
  formCard: {
    margin: 12,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#2D3748',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    backgroundColor: '#ffffff',
    color: '#2D3748',
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
    backgroundColor: '#E2E8F0',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
    color: '#4A5568',
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
    backgroundColor: '#E2E8F0',
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
    backgroundColor: '#FED7D7',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#4A5568',
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
    color: '#ffffff',
  },
});