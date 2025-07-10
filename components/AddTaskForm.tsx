import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import NeumorphicCard from './NeumorphicCard';

interface AddTaskFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: {
    title: string;
    isHabit: boolean;
    location: string;
    priority: string;
    isQuickWin: boolean;
    isDelegated: boolean;
    delegatedTo: string;
    subtasks: { title: string }[];
  }) => void;
  category: string;
}

export default function AddTaskForm({ visible, onClose, onSubmit, category }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [isHabit, setIsHabit] = useState(false);
  const [location, setLocation] = useState('anywhere');
  const [priority, setPriority] = useState('medium');
  const [isQuickWin, setIsQuickWin] = useState(false);
  const [isDelegated, setIsDelegated] = useState(false);
  const [delegatedTo, setDelegatedTo] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>(['']);

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        isHabit,
        location,
        priority,
        isQuickWin,
        isDelegated,
        delegatedTo: isDelegated ? delegatedTo : '',
        subtasks: subtasks.filter(s => s.trim()).map(s => ({ title: s.trim() })),
      });
      setTitle('');
      setIsHabit(false);
      setLocation('anywhere');
      setPriority('medium');
      setIsQuickWin(false);
      setIsDelegated(false);
      setDelegatedTo('');
      setSubtasks(['']);
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
      case 'daily': return '#667EEA';
      case 'goals': return '#48BB78';
      case 'weekly': return '#9F7AEA';
      case 'meal-prep': return '#ED8936';
      case 'cleaning': return '#4299E1';
      case 'self-care': return '#F56565';
      case 'delegation': return '#38B2AC';
      default: return '#667EEA';
    }
  };
  
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <NeumorphicCard style={styles.form}>
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

        {(category === 'daily' || category === 'goals') && (
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.buttonRow}>
              {['home', 'work', 'errands', 'anywhere'].map((loc) => (
                <TouchableOpacity
                  key={loc}
                  style={[
                    styles.optionButton, 
                    location === loc && [styles.selectedOption, {backgroundColor: getTabColor()}]
                  ]}
                  onPress={() => setLocation(loc)}
                >
                  <Text style={[styles.optionText, location === loc && styles.selectedText]}>
                    {loc.charAt(0).toUpperCase() + loc.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Priority</Text>
          <View style={styles.buttonRow}>
            {['low', 'medium', 'high'].map((prio) => (
              <TouchableOpacity
                key={prio}
                style={[
                  styles.optionButton, 
                  priority === prio && [styles.selectedOption, {backgroundColor: getTabColor()}]
                ]}
                onPress={() => setPriority(prio)}
              >
                <Text style={[styles.optionText, priority === prio && styles.selectedText]}>
                  {prio.charAt(0).toUpperCase() + prio.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.optionButton, 
                isQuickWin && [styles.selectedOption, {backgroundColor: getTabColor()}]
              ]}
              onPress={() => setIsQuickWin(!isQuickWin)}
            >
              <Text style={[styles.optionText, isQuickWin && styles.selectedText]}>Quick Win</Text>
            </TouchableOpacity>
            {category === 'delegation' && (
              <TouchableOpacity
                style={[
                  styles.optionButton, 
                  isDelegated && [styles.selectedOption, {backgroundColor: getTabColor()}]
                ]}
                onPress={() => setIsDelegated(!isDelegated)}
              >
                <Text style={[styles.optionText, isDelegated && styles.selectedText]}>Delegated</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {isDelegated && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delegate To</Text>
            <TextInput
              style={styles.input}
              placeholder="Person's name"
              value={delegatedTo}
              onChangeText={setDelegatedTo}
            />
          </View>
        )}
        <TouchableOpacity style={[styles.submitButton, { backgroundColor: getTabColor() }]} onPress={handleSubmit}>
          <Plus size={20} color="#ffffff" />
          <Text style={styles.submitText}>Add Task</Text>
        </TouchableOpacity>
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
    gap: 8,
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
});