import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, ChevronLeft, ChevronRight, Chrome as Home } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import NeumorphicCard from '@/components/NeumorphicCard';
import TaskItem from '@/components/TaskItem';
import AddTaskForm from '@/components/AddTaskForm';
import EditTaskForm from '@/components/EditTaskForm';
import { useTaskManager } from '@/hooks/useTaskManager';
import { useTheme } from '@/contexts/ThemeContext';

export default function MonthlyCalendar() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const taskManager = useTaskManager();
  const router = useRouter();
  const { currentTheme } = useTheme();
  const colors = currentTheme.tabColors.calendar;

  const weeklyTasks = taskManager.tasks.filter(task => task.category === 'weekly');

  const handleAddTask = (newTask: any) => {
    taskManager.addTask({ ...newTask, category: 'weekly', scheduledDate: selectedDate });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const getTasksForDate = (date: Date) => {
    return weeklyTasks.filter(task => {
      // In a real app, you'd compare task.scheduledDate with the date
      return false; // Placeholder
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getDaysInMonth(currentMonth);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.dark }]}>Calendar</Text>
          <Text style={[styles.subtitle, { color: colors.medium }]}>Plan your future tasks</Text>
        </View>
        <View style={styles.monthNavigation}>
          <TouchableOpacity
            style={[styles.homeButton, { 
              backgroundColor: colors.accent,
              shadowColor: colors.shadow
            }]}
            onPress={() => router.push('/home')}
          >
            <Home size={20} color={colors.pastel} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, { 
              backgroundColor: colors.accent,
              shadowColor: colors.shadow
            }]}
            onPress={() => navigateMonth('prev')}
          >
            <ChevronLeft size={20} color={colors.pastel} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, { 
              backgroundColor: colors.accent,
              shadowColor: colors.shadow
            }]}
            onPress={() => navigateMonth('next')}
          >
            <ChevronRight size={20} color={colors.pastel} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedDate && (
          <NeumorphicCard style={[styles.selectedDateCard, { 
            backgroundColor: colors.accent,
            borderLeftColor: colors.dark,
            shadowColor: colors.shadow
          }]}>
            <Text style={[styles.selectedDateTitle, { color: colors.dark }]}>
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            
            {getTasksForDate(selectedDate).length === 0 ? (
              <View style={styles.emptyDate}>
                <Text style={[styles.emptyDateText, { color: colors.medium }]}>
                  No tasks scheduled for this date
                </Text>
              </View>
            ) : (
              getTasksForDate(selectedDate).map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={taskManager.toggleTask}
                  onDelete={taskManager.deleteTask}
                  onHabitIncrement={taskManager.incrementHabit}
                  colors={colors}
                />
              ))
            )}
          </NeumorphicCard>
        )}

        <NeumorphicCard style={[styles.calendarCard, { 
          shadowColor: colors.shadow,
          borderColor: colors.accent,
          borderWidth: 1 
        }]}>
          <View style={styles.calendarHeader}>
            <Text style={[styles.monthTitle, { color: colors.dark }]}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
          </View>

          <View style={styles.dayHeaders}>
            {dayNames.map(day => (
              <Text key={day} style={[styles.dayHeader, { color: colors.medium }]}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendar}>
            {days.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  !day && styles.emptyDayCell,
                  day && selectedDate && day.toDateString() === selectedDate.toDateString() && styles.selectedDayCell,
                  day && day.toDateString() === new Date().toDateString() && styles.todayCell,
                  day && selectedDate && day.toDateString() === selectedDate.toDateString() && { 
                    backgroundColor: colors.dark,
                    shadowColor: colors.shadow
                  },
                  day && day.toDateString() === new Date().toDateString() && { 
                    backgroundColor: colors.accent
                  },
                ]}
                onPress={() => day && setSelectedDate(day)}
                disabled={!day}
              >
                {day && (
                  <>
                    <Text style={[
                      styles.dayNumber,
                      { color: colors.medium },
                      day.toDateString() === new Date().toDateString() && styles.todayNumber,
                      day.toDateString() === new Date().toDateString() && { color: colors.dark },
                      selectedDate && day.toDateString() === selectedDate.toDateString() && styles.selectedDayNumber,
                      selectedDate && day.toDateString() === selectedDate.toDateString() && { color: colors.pastel },
                    ]}>
                      {day.getDate()}
                    </Text>
                    {getTasksForDate(day).length > 0 && (
                      <View style={[styles.taskIndicator, { backgroundColor: colors.dark }]} />
                    )}
                  </>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </NeumorphicCard>
      </ScrollView>

      <TouchableOpacity
        style={[styles.addButton, { 
          backgroundColor: colors.dark,
          shadowColor: colors.shadow 
        }]}
        onPress={() => setShowAddForm(true)}
      >
        <Plus size={24} color={colors.pastel} />
      </TouchableOpacity>

      <AddTaskForm
        visible={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddTask}
        category="weekly"
        accentColor={colors.accent}
        darkColor={colors.dark}
        bgColor={colors.bg}
        mediumColor={colors.medium}
        pastelColor={colors.pastel}
        shadowColor={colors.shadow}
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
    marginTop: 2,
  },
  monthNavigation: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  homeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
  },
  selectedDateCard: {
    margin: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
    marginBottom: 12,
  },
  emptyDate: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyDateText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    fontStyle: 'italic',
  },
  calendarCard: {
    margin: 12,
  },
  calendarHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 20,
    fontFamily: 'Quicksand-SemiBold',
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Quicksand-SemiBold',
    paddingVertical: 8,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 1,
  },
  emptyDayCell: {
    backgroundColor: 'transparent',
  },
  selectedDayCell: {
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  todayCell: {
  },
  dayNumber: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
  },
  todayNumber: {
    fontFamily: 'Quicksand-Bold',
  },
  selectedDayNumber: {
  },
  taskIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
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