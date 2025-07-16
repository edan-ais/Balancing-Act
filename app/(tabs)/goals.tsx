import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, Chrome as Home } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import NeumorphicCard from '@/components/NeumorphicCard';
import TaskItem, { Task } from '@/components/TaskItem';
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
  const { completed, pending } = goalTasks.reduce((acc, task) => {
    task.completed ? acc.completed.push(task) : acc.pending.push(task);
    return acc;
  }, { completed: [] as Task[], pending: [] as Task[] });

  const handleAddTask = (newTask: Partial<Task>) => {
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

  const renderTaskSection = (title: string, tasks: Task[]) => {
    if (tasks.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.dark }]}>{title}</Text>
        {tasks.map((task, index) => (
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
            isLast={index === tasks.length - 1}
            colors={colors}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.title, { color: colors.veryDark }]}>Long-term Tasks</Text>
          <Text style={[styles.subtitle, { color: colors.dark }]}>
            {completed.length}/{goalTasks.length} completed
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.homeButton, { backgroundColor: colors.dark, shadowColor: colors.shadow }]}
          onPress={() => router.push('/home')}
        >
          <Home size={22} color={colors.pastel} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {goalTasks.length === 0 ? (
          <NeumorphicCard style={[styles.emptyState, { borderColor: colors.medium, backgroundColor: colors.bgAlt }]}>
            <Text style={[styles.emptyTitle, { color: colors.veryDark }]}>No long-term tasks</Text>
            <Text style={[styles.emptySubtitle, { color: colors.dark }]}>
              Add tasks to do, just not any time soon
            </Text>
          </NeumorphicCard>
        ) : (
          <>
            {renderTaskSection('Pending', pending)}
            {renderTaskSection('Completed', completed)}
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.dark, shadowColor: colors.shadow }]}
        onPress={() => setShowAddForm(true)}
      >
        <Plus size={24} color={colors.pastel} />
      </TouchableOpacity>

      <AddTaskForm
        visible={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddTask}
        category="goals"
        colors={colors}
      />

      <EditTaskForm
        visible={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleUpdateTask}
        initialTask={taskToEdit}
        colors={colors}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  headerTitleContainer: { flex: 1, paddingRight: 8 },
  title: { fontSize: 26, fontFamily: 'Quicksand-Bold', marginBottom: 2 },
  subtitle: { fontSize: 16, fontFamily: 'Quicksand-Medium', marginTop: 2 },
  homeButton: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 4 },
  content: { flex: 1, paddingHorizontal: 10, marginTop: 6 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontFamily: 'Quicksand-Bold', marginLeft: 12, marginBottom: 10 },
  emptyState: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 16, margin: 10, borderWidth: 2, borderRadius: 16 },
  emptyTitle: { fontSize: 22, fontFamily: 'Quicksand-Bold', marginBottom: 10 },
  emptySubtitle: { fontSize: 16, fontFamily: 'Quicksand-Medium', textAlign: 'center', lineHeight: 24 },
  addButton: { position: 'absolute', bottom: 16, right: 16, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 6 },
});