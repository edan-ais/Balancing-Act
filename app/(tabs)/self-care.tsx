import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, Heart, Smile, Moon, Activity, Music, Home } from 'lucide-react-native';
import * as LucideIcons from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import NeumorphicCard from '@/components/NeumorphicCard';
import TaskItem from '@/components/TaskItem';
import AddTaskForm from '@/components/AddTaskForm';
import EditTaskForm from '@/components/EditTaskForm';
import { useTaskManager } from '@/hooks/useTaskManager';
import { useTheme } from '@/contexts/ThemeContext';

export default function SelfCare() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const taskManager = useTaskManager();
  const router = useRouter();
  const { currentTheme } = useTheme();
  const colors = currentTheme.tabColors.selfCare;

  // Get the add task icon for the current theme dynamically
  const getAddTaskIcon = () => {
    if (currentTheme.addTaskIcon) {
      // Convert kebab-case to PascalCase for Lucide icon names
      const iconName = currentTheme.addTaskIcon
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
      
      // Dynamically get the icon component from Lucide
      const IconComponent = LucideIcons[iconName];
      
      // Return the icon if it exists, otherwise fall back to Plus
      if (IconComponent) {
        return <IconComponent size={24} color={colors.pastel} />;
      }
    }
    
    // Default to Plus icon if no theme icon is specified or if the specified icon doesn't exist
    return <Plus size={24} color={colors.pastel} />;
  };

  const selfCareTasks = taskManager.tasks.filter(task => task.category === 'self-care');

  const handleAddTask = (newTask: any) => {
    taskManager.addTask({ ...newTask, category: 'self-care' });
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setShowEditForm(true);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    taskManager.updateTask(updatedTask);
    setShowEditForm(false);
    setTaskToEdit(null);
  };

  const careCategories = [
    { 
      title: 'Physical Health', 
      icon: Activity, 
      type: 'physical',
      tasks: selfCareTasks.filter(t => t.selfCareType === 'physical'),
      description: 'Movement and wellness'
    },
    { 
      title: 'Mental Health', 
      icon: Smile, 
      type: 'mental',
      tasks: selfCareTasks.filter(t => t.selfCareType === 'mental'),
      description: 'Mindfulness and peace'
    },
    { 
      title: 'Rest & Recovery', 
      icon: Moon, 
      type: 'rest',
      tasks: selfCareTasks.filter(t => t.selfCareType === 'rest'),
      description: 'Sleep and relaxation'
    },
    { 
      title: 'Joy & Connection', 
      icon: Music, 
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
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.title, { color: colors.veryDark }]}>Self-Care</Text>
          <Text style={[styles.subtitle, { color: colors.dark }]}>
            Nurture yourself daily
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={[styles.actionButton, { 
              backgroundColor: colors.dark,
              shadowColor: colors.shadow
            }]}
            onPress={() => router.push('/home')}
          >
            <Home size={22} color={colors.pastel} />
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
              shadowColor: colors.shadow,
              borderColor: colors.medium,
              borderWidth: 1,
              backgroundColor: colors.bgAlt
            }]}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryInfo}>
                  <View style={styles.categoryTitleRow}>
                    <category.icon size={22} color={colors.dark} />
                    <View style={styles.categoryTextContainer}>
                      <Text style={[styles.categoryTitle, { color: colors.veryDark }]}>
                        {category.title}
                      </Text>
                      <Text style={[styles.categoryDescription, { color: colors.dark }]}>
                        {category.description}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.categoryCountContainer, { backgroundColor: colors.dark }]}>
                  <Text style={[styles.categoryCount, { color: colors.pastel }]}>
                    {category.tasks.length} tasks
                  </Text>
                </View>
              </View>
              
              {category.tasks.length === 0 ? (
                <View style={styles.emptyCategory}>
                  <Text style={[styles.emptyCategoryText, { color: colors.dark }]}>
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
                      onEdit={handleEditTask}
                      onHabitIncrement={taskManager.incrementHabit}
                      onSubtaskToggle={taskManager.toggleSubtask}
                      onMoveUp={taskManager.moveTaskUp}
                      onMoveDown={taskManager.moveTaskDown}
                      isFirst={taskPosition === 0}
                      isLast={taskPosition === typeTasks.length - 1}
                      colors={colors}
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
          shadowColor: colors.shadow 
        }]}
        onPress={() => setShowAddForm(true)}
      >
        {getAddTaskIcon()}
      </TouchableOpacity>

      <AddTaskForm
        visible={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddTask}
        category="self-care"
        accentColor={colors.accent}
        darkColor={colors.dark}
        bgColor={colors.bg}
        mediumColor={colors.medium}
        pastelColor={colors.pastel}
        shadowColor={colors.shadow}
        veryDarkColor={colors.veryDark}
        highlightColor={colors.highlight}
        bgAltColor={colors.bgAlt}
      />

      <EditTaskForm
        visible={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleUpdateTask}
        initialTask={taskToEdit}
        accentColor={colors.accent}
        darkColor={colors.dark}
        bgColor={colors.bg}
        mediumColor={colors.medium}
        pastelColor={colors.pastel}
        shadowColor={colors.shadow}
        veryDarkColor={colors.veryDark}
        highlightColor={colors.highlight}
        bgAltColor={colors.bgAlt}
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitleContainer: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 6,
  },
  categoryCard: {
    margin: 10,
    marginBottom: 10,
    padding: 12,
    borderRadius: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTextContainer: {
    marginLeft: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
  },
  categoryDescription: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
    marginTop: 2,
  },
  categoryCountContainer: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryCount: {
    fontSize: 13,
    fontFamily: 'Quicksand-SemiBold',
  },
  emptyCategory: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyCategoryText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    fontStyle: 'italic',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
});