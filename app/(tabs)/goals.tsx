import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, Home } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import NeumorphicCard from '@/components/NeumorphicCard';
import TaskItem from '@/components/TaskItem';
import AddTaskForm from '@/components/AddTaskForm';
import EditTaskForm from '@/components/EditTaskForm';
import { useTaskManager } from '@/hooks/useTaskManager';
import { useTheme } from '@/contexts/ThemeContext';

export default function LongTermGoals() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const taskManager = useTaskManager();
  const router = useRouter();
  const { currentTheme } = useTheme();
  const colors = currentTheme.tabColors.future;

  const goalTasks = taskManager.tasks.filter(task => task.category === 'goals');
  const completedTasks = goalTasks.filter(task => task.completed);
  const pendingTasks = goalTasks.filter(task => !task.completed);

  const handleAddTask = (newTask: any) => {
    taskManager.addTask({ ...newTask, category: 'goals' });
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
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.veryDark }]}>Long-term Tasks</Text>
          <Text style={[styles.subtitle, { color: colors.dark }]}>
            {completedTasks.length}/{goalTasks.length} completed
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.homeButton, { 
              backgroundColor: colors.dark,
              shadowColor: colors.shadow
            }]}
            onPress={() => router.push('/home')}
          >
            <Home size={24} color={colors.pastel} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {goalTasks.length === 0 ? (
          <NeumorphicCard style={[styles.emptyState, { borderColor: colors.medium, backgroundColor: colors.bgAlt }]}>
            <Text style={[styles.emptyTitle, { color: colors.veryDark }]}>No long-term tasks</Text>
            <Text style={[styles.emptySubtitle, { color: colors.dark }]}>
              Add tasks you need to do, just not any time soon
            </Text>
          </NeumorphicCard>
        ) : (
          <>
            {pendingTasks.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.dark }]}>Pending</Text>
                {pendingTasks.map((task, index) => (
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
                    isFirst={index === 0}
                    isLast={index === pendingTasks.length - 1}
                    colors={colors}
                  />
                ))}
              </View>
            )}

            {completedTasks.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.dark }]}>Completed</Text>
                {completedTasks.map((task, index) => (
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
                    isFirst={index === 0}
                    isLast={index === completedTasks.length - 1}
                    colors={colors}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.addButton, { 
          backgroundColor: colors.dark,
          shadowColor: colors.shadow 
        }]}
        onPress={() => setShowAddForm(true)}
      >
        <Plus size={28} color={colors.pastel} />
      </TouchableOpacity>

      <AddTaskForm
        visible={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddTask}
        category="goals"
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 14,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  homeButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Quicksand-Bold',
    marginLeft: 12,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
    margin: 16,
    borderWidth: 2,
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Medium',
    textAlign: 'center',
    lineHeight: 26,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});