import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, ChevronLeft, ChevronRight, Home } from 'lucide-react-native';
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
    if (!date) return [];
    
    return weeklyTasks.filter(task => {
      if (!task.scheduledDate) return false;
      
      const taskDate = new Date(task.scheduledDate);
      return taskDate.toDateString() === date.toDateString();
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
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.title, { color: colors.veryDark }]}>Calendar</Text>
          <Text style={[styles.subtitle, { color: colors.dark }]}>Plan your future tasks</Text>
        </View>
        <View style={styles.monthNavigation}>
          <TouchableOpacity
            style={[styles.homeButton, { 
              backgroundColor: colors.dark,
              shadowColor: colors.shadow
            }]}
            onPress={() => router.push('/home')}
          >
            <Home size={18} color={colors.pastel} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, { 
              backgroundColor: colors.dark,
              shadowColor: colors.shadow
            }]}
            onPress={() => navigateMonth('prev')}
          >
            <ChevronLeft size={18} color={colors.pastel} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, { 
              backgroundColor: colors.dark,
              shadowColor: colors.shadow
            }]}
            onPress={() => navigateMonth('next')}
          >
            <ChevronRight size={18} color={colors.pastel} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedDate && (
          <NeumorphicCard style={[styles.selectedDateCard, { 
            backgroundColor: colors.bgAlt,
            borderLeftColor: colors.dark,
            shadowColor: colors.shadow
          }]}>
            <Text style={[styles.selectedDateTitle, { color: colors.veryDark }]}>
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            
            {getTasksForDate(selectedDate).length === 0 ? (
              <View style={styles.emptyDate}>
                <Text style={[styles.emptyDateText, { color: colors.dark }]}>
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
          borderColor: colors.medium,
          borderWidth: 1 
        }]}>
          <View style={styles.calendarHeader}>
            <Text style={[styles.monthTitle, { color: colors.veryDark }]}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
          </View>

          <View style={styles.dayHeaders}>
            {dayNames.map(day => (
              <Text key={day} style={[styles.dayHeader, { color: colors.dark }]}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendar}>
            {days.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  !day && styles.emptyDayCell,
                  day && selectedDate && day.toDateString() === selectedDate.toDateString() && [
                    styles.selectedDayCell,
                    { backgroundColor: colors.dark, shadowColor: colors.shadow }
                  ],
                  day && day.toDateString() === new Date().toDateString() && [
                    styles.todayCell,
                    { backgroundColor: colors.medium }
                  ],
                ]}
                onPress={() => day && setSelectedDate(day)}
                disabled={!day}
              >
                {day && (
                  <View style={styles.dayCellContent}>
                    <Text style={[
                      styles.dayNumber,
                      { color: colors.dark },
                      day.toDateString() === new Date().toDateString() && [
                        styles.todayNumber,
                        { color: colors.veryDark }
                      ],
                      selectedDate && day.toDateString() === selectedDate.toDateString() && [
                        styles.selectedDayNumber,
                        { color: colors.pastel }
                      ],
                    ]}>
                      {day.getDate()}
                    </Text>
                    {getTasksForDate(day).length > 0 && (
                      <View style={[styles.taskIndicator, { backgroundColor: 
                        selectedDate && day.toDateString() === selectedDate.toDateString() 
                          ? colors.pastel 
                          : colors.dark 
                      }]} />
                    )}
                  </View>
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
        selectedDate={selectedDate}
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
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    marginTop: 2,
  },
  monthNavigation: {
    flexDirection: 'row',
    gap: 6,
  },
  navButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  homeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginRight: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  selectedDateCard: {
    margin: 10,
    marginBottom: 6,
    borderLeftWidth: 4,
    padding: 12,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 10,
  },
  emptyDate: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyDateText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    fontStyle: 'italic',
  },
  calendarCard: {
    margin: 10,
    padding: 12,
  },
  calendarHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  monthTitle: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
    paddingVertical: 6,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // (100% / 7) for 7 days a week
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    margin: 0,
    padding: 0,
  },
  dayCellContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyDayCell: {
    backgroundColor: 'transparent',
  },
  selectedDayCell: {
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  todayCell: {
    borderRadius: 6,
  },
  dayNumber: {
    fontSize: 15,
    fontFamily: 'Quicksand-SemiBold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  todayNumber: {
    fontFamily: 'Quicksand-Bold',
  },
  selectedDayNumber: {
    fontFamily: 'Quicksand-Bold',
  },
  taskIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 3,
    position: 'absolute',
    bottom: '20%',
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