import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, Heart, Smile, Moon, Activity, Music, Chrome as Home } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import NeumorphicCard from '@/components/NeumorphicCard';
import TaskItem from '@/components/TaskItem';
import AddTaskForm from '@/components/AddTaskForm';
import EditTaskForm from '@/components/EditTaskForm';
import { useTaskManager } from '@/hooks/useTaskManager';
import { tabColors } from './_layout';

export default function SelfCare() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const taskManager = useTaskManager();
  const router = useRouter();
  const colors = tabColors.selfCare;

  const selfCareTasks = taskManager.tasks.filter(task => task.category === 'self-care');

  const handleAddTask = (newTask: any) => {
    taskManager.addTask({ ...newTask, category: 'self-care' });
  };

  const careCategories = [
    { 
      title: 'Physical Health', 
      icon: Activity, 
      color: '#FF0000',
      type: 'physical',
      tasks: selfCareTasks.filter(t => t.selfCareType === 'physical'),
      description: 'Movement and wellness'
    },
    { 
      title: 'Mental Health', 
      icon: Smile, 
      color: '#FF0000',
      type: 'mental',
      tasks: selfCareTasks.filter(t => t.selfCareType === 'mental'),
      description: 'Mindfulness and peace'
    },
    { 
      title: 'Rest & Recovery', 
      icon: Moon, 
      color: '#FF0000',
      type: 'rest',
      tasks: selfCareTasks.filter(t => t.selfCareType === 'rest'),
      description: 'Sleep and relaxation'
    },
    { 
      title: 'Joy & Connection', 
      icon: Music, 
      color: '#FF0000',
      type: 'joy',
      tasks: selfCareTasks.filter(t => t.selfCareType === 'joy'),
      description: 'Relationships and fun'
    },
  ];

  const todaysMood = '😊'; // This could be dynamic
  const selfCareStreak = 12;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.dark }]}>Self-Care</Text>
          <Text style={styles.subtitle}>Nurture yourself daily</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/home')}
          >
            <Home size={20} color={colors.dark} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {careCategories.map((category, index) => {
          // Get all tasks with the same self-care type that are not completed
          const typeTasks = selfCareTasks.filter(t => 
            t.selfCareType === category.type && !t.completed
          );
          
          return (
            <NeumorphicCard key={index} style={[styles.categoryCard, { 
              shadowColor: colors.pastel,
              borderColor: colors.accent,
              borderWidth: 1 
            }]}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryInfo}>
                  <View style={styles.categoryTitleRow}>
                    <category.icon size={24} color={category.color} />
                    <View style={styles.categoryTextContainer}>
                      <Text style={[styles.categoryTitle, { color: colors.dark }]}>{category.title}</Text>
                      <Text style={styles.categoryDescription}>{category.description}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.categoryMeta}>
                  <Text style={styles.categoryCount}>{category.tasks.length}</Text>
                  <Text style={styles.categoryLabel}>tasks</Text>
                </View>
              </View>
              
              {category.tasks.length === 0 ? (
                <View style={styles.emptyCategory}>
                  <Text style={[styles.emptyCategoryText, { color: colors.pastel }]}>
                    No {category.title.toLowerCase()} activities yet
                  </Text>
                </View>
              ) : (
                category.tasks.map((task, taskIndex) => {
                  // Find position of this task in the self-care type group
                  const taskPosition = typeTasks.findIndex(t => t.id === task.id);
                  
                  return (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={taskManager.toggleTask}
                      onDelete={taskManager.deleteTask}
                      onHabitIncrement={taskManager.incrementHabit}
                      onSubtaskToggle={taskManager.toggleSubtask}
                      onMoveUp={taskManager.moveTaskUp}
                      onMoveDown={taskManager.moveTaskDown}
                      isFirst={taskPosition === 0}
                      isLast={taskPosition === typeTasks.length - 1}
                      accentColor={colors.dark}
                    />
                  );
                })
              )}
            </NeumorphicCard>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={[styles.addButton, { 
          backgroundColor: colors.dark,
          shadowColor: colors.dark 
        }]}
        onPress={() => setShowAddForm(true)}
      >
        <Plus size={24} color="#ffffff" />
      </TouchableOpacity>

      <AddTaskForm
        visible={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddTask}
        category="self-care"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Quicksand-Bold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
    color: '#4A5568',
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C8D0E0',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
  },
  categoryCard: {
    margin: 12,
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTextContainer: {
    marginLeft: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
  },
  categoryDescription: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    color: '#4A5568',
    marginTop: 2,
  },
  categoryMeta: {
    alignItems: 'center',
  },
  categoryCount: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#4A5568',
  },
  categoryLabel: {
    fontSize: 10,
    fontFamily: 'Quicksand-Regular',
    color: '#4A5568',
    marginTop: 2,
  },
  emptyCategory: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyCategoryText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    fontStyle: 'italic',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});