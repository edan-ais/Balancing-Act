import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, Users, Heart, Chrome as Home, Star, BookOpen } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import NeumorphicCard from '@/components/NeumorphicCard';
import TaskItem, { Task } from '@/components/TaskItem';
import AddTaskForm from '@/components/AddTaskForm';
import EditTaskForm from '@/components/EditTaskForm';
import { useTaskManager } from '@/hooks/useTaskManager';
import { useTheme } from '@/contexts/ThemeContext';

const TEAM_MEMBERS = [
  { name: 'Partner', subtitle: 'Shared responsibilities', icon: Heart, type: 'partner' },
  { name: 'Family', subtitle: 'Extended support network', icon: Home, type: 'family' },
  { name: 'Friends', subtitle: 'Social connections', icon: Star, type: 'friends' },
  { name: 'Kids', subtitle: 'Learning opportunities', icon: BookOpen, type: 'kids' },
];

export default function Delegation() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const taskManager = useTaskManager();
  const router = useRouter();
  const { currentTheme } = useTheme();
  const colors = currentTheme.tabColors.delegate;

  const delegationTasks = taskManager.tasks.filter(task => task.category === 'delegation');

  const handleAddTask = (newTask: Partial<Task>) => {
    taskManager.addTask({ ...newTask, category: 'delegation' });
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

  const renderTeamMember = (member: typeof TEAM_MEMBERS[0], index: number) => {
    const tasks = delegationTasks.filter(t => t.delegateType === member.type);
    const Icon = member.icon;
    
    return (
      <NeumorphicCard key={index} style={[styles.memberTasksCard, { 
        shadowColor: colors.shadow,
        borderColor: colors.medium,
        borderWidth: 1,
        backgroundColor: colors.bgAlt
      }]}>
        <View style={styles.memberTasksHeader}>
          <View style={styles.memberTasksInfo}>
            <Icon size={22} color={colors.dark} />
            <View style={styles.memberTextContainer}>
              <Text style={[styles.memberTasksName, { color: colors.veryDark }]}>
                {member.name} Tasks
              </Text>
              <Text style={[styles.memberSubtitle, { color: colors.dark }]}>
                {member.subtitle}
              </Text>
            </View>
          </View>
          <View style={[styles.memberTasksCountContainer, { backgroundColor: colors.dark }]}>
            <Text style={[styles.memberTasksCount, { color: colors.pastel }]}>
              {tasks.length} tasks
            </Text>
          </View>
        </View>
        
        {tasks.length === 0 ? (
          <View style={styles.emptyMemberTasks}>
            <Text style={[styles.emptyMemberTasksText, { color: colors.dark }]}>
              No tasks assigned to {member.name.toLowerCase()}
            </Text>
          </View>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={taskManager.toggleTask}
              onDelete={taskManager.deleteTask}
              onEdit={handleEditTask}
              onHabitIncrement={taskManager.incrementHabit}
              colors={colors}
            />
          ))
        )}
      </NeumorphicCard>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.title, { color: colors.veryDark }]}>Delegation</Text>
          <Text style={[styles.subtitle, { color: colors.dark }]}>
            Share the load with others
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.dark, shadowColor: colors.shadow }]}
          onPress={() => router.push('/home')}
        >
          <Home size={22} color={colors.pastel} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {TEAM_MEMBERS.map(renderTeamMember)}
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
        category="delegation"
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
  actionButton: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 4 },
  content: { flex: 1, paddingHorizontal: 10, marginTop: 6 },
  memberTasksCard: { margin: 10, marginBottom: 10, padding: 12, borderRadius: 16 },
  memberTasksHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  memberTasksInfo: { flexDirection: 'row', alignItems: 'center' },
  memberTextContainer: { marginLeft: 10 },
  memberTasksName: { fontSize: 18, fontFamily: 'Quicksand-Bold' },
  memberSubtitle: { fontSize: 14, fontFamily: 'Quicksand-Medium', marginTop: 2 },
  memberTasksCountContainer: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  memberTasksCount: { fontSize: 13, fontFamily: 'Quicksand-SemiBold' },
  emptyMemberTasks: { alignItems: 'center', paddingVertical: 16 },
  emptyMemberTasksText: { fontSize: 16, fontFamily: 'Quicksand-Medium', fontStyle: 'italic' },
  addButton: { position: 'absolute', bottom: 16, right: 16, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 6 },
});