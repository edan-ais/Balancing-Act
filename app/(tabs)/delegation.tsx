import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, Users, Heart, HomeIcon, Star, BookOpen } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import NeumorphicCard from '@/components/NeumorphicCard';
import TaskItem from '@/components/TaskItem';
import AddTaskForm from '@/components/AddTaskForm';
import { useTaskManager } from '@/hooks/useTaskManager';
import { tabColors } from './_layout';

export default function Delegation() {
  const [showAddForm, setShowAddForm] = useState(false);
  const taskManager = useTaskManager();
  const router = useRouter();
  const colors = tabColors.delegate;
  const tealColor = '#38B2AC'; // Teal color for all icons

  const delegationTasks = taskManager.tasks.filter(task => task.category === 'delegation');

  const handleAddTask = (newTask: any) => {
    taskManager.addTask({ ...newTask, category: 'delegation' });
  };

  const teamMembers = [
    { 
      name: 'Partner', 
      subtitle: 'Shared responsibilities',
      icon: Heart,
      color: '#48BB78',
      tasks: delegationTasks.filter(t => t.title.toLowerCase().includes('partner')),
    },
    { 
      name: 'Family', 
      subtitle: 'Extended support network',
      icon: HomeIcon,
      color: '#4299E1',
      tasks: delegationTasks.filter(t => t.title.toLowerCase().includes('family')),
    },
    { 
      name: 'Friends', 
      subtitle: 'Social connections',
      icon: Star,
      color: '#9F7AEA',
      tasks: delegationTasks.filter(t => t.title.toLowerCase().includes('friend')),
    },
    { 
      name: 'Kids', 
      subtitle: 'Learning opportunities',
      icon: BookOpen,
      color: '#ED8936',
      tasks: delegationTasks.filter(t => t.title.toLowerCase().includes('kid')),
    },
  ];

  const pendingTasks = delegationTasks.filter(task => !task.completed);
  const completedTasks = delegationTasks.filter(task => task.completed);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.dark }]}>Delegation</Text>
          <Text style={styles.subtitle}>Share the load with others</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/home')}
          >
            <HomeIcon size={20} color={colors.dark} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {teamMembers.map((member, index) => (
          <NeumorphicCard key={index} style={[styles.memberTasksCard, { 
            shadowColor: colors.pastel,
            borderColor: colors.accent,
            borderWidth: 1 
          }]}>
            <View style={styles.memberTasksHeader}>
              <View style={styles.memberTasksInfo}>
                <member.icon size={20} color={tealColor} />
                <View style={styles.memberTextContainer}>
                  <Text style={[styles.memberTasksName, { color: colors.dark }]}>{member.name} Tasks</Text>
                  <Text style={styles.memberSubtitle}>{member.subtitle}</Text>
                </View>
              </View>
              <View style={styles.memberTasksMeta}>
                <Text style={[styles.memberTasksCount, { color: colors.dark }]}>{member.tasks.length}</Text>
              </View>
            </View>
            
            {member.tasks.length === 0 ? (
              <View style={styles.emptyMemberTasks}>
                <Text style={[styles.emptyMemberTasksText, { color: colors.pastel }]}>
                  No tasks assigned to {member.name.toLowerCase()}
                </Text>
              </View>
            ) : (
              member.tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={taskManager.toggleTask}
                  onDelete={taskManager.deleteTask}
                  onHabitIncrement={taskManager.incrementHabit}
                />
              ))
            )}
          </NeumorphicCard>
        ))}
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
        category="delegation"
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
  memberTasksCard: {
    margin: 12,
    marginBottom: 8,
  },
  memberTasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberTasksInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberTextContainer: {
    marginLeft: 8,
  },
  memberTasksName: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
  },
  memberSubtitle: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    color: '#4A5568',
    marginTop: 2,
  },
  memberTasksMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberTasksCount: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
  },
  emptyMemberTasks: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyMemberTasksText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    fontStyle: 'italic',
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
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