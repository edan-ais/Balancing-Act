import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Task } from '@/components/TaskItem';

export interface TaskManager {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (updatedTask: Task) => void;
  incrementHabit: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  rolloverTasks: () => void;
  emergencyOverride: () => void;
  moveTaskUp: (id: string) => void;
  moveTaskDown: (id: string) => void;
}

interface ExtendedTask extends Task {
  scheduledDate?: Date;
}

export function useTaskManager(): TaskManager {
  const [tasks, setTasks] = useState<ExtendedTask[]>([]);
  const { user } = useAuth();

  const transformToTask = (data: any): ExtendedTask => ({
    id: data.id,
    title: data.title,
    completed: data.completed,
    isHabit: data.is_habit,
    habitCount: data.habit_count,
    habitGoal: data.habit_goal,
    priority: data.priority,
    customPriorityText: data.custom_priority_text,
    customPriorityColor: data.custom_priority_color,
    goalType: data.goal_type,
    customGoalTypeText: data.custom_goal_type_text,
    customGoalTypeColor: data.custom_goal_type_color,
    isDelegated: !!data.delegated_to,
    delegatedTo: data.delegated_to,
    delegateType: data.delegate_type,
    subtasks: data.subtasks || [],
    category: data.category,
    mealType: data.meal_type,
    dayOfWeek: data.day_of_week,
    notes: data.notes,
    frequency: data.frequency,
    cleaningLocation: data.cleaning_location,
    customCleaningLocation: data.custom_cleaning_location,
    customCleaningLocationColor: data.custom_cleaning_location_color,
    selfCareType: data.self_care_type,
    reminderEnabled: data.reminder_enabled,
    scheduledDate: data.scheduled_date ? new Date(data.scheduled_date) : undefined,
  });

  const transformToSupabase = (task: ExtendedTask) => ({
    id: task.id,
    user_id: user?.id,
    title: task.title,
    category: task.category,
    completed: task.completed,
    is_habit: task.isHabit,
    habit_count: task.habitCount,
    habit_goal: task.habitGoal,
    priority: task.priority,
    custom_priority_text: task.customPriorityText,
    custom_priority_color: task.customPriorityColor,
    goal_type: task.goalType,
    custom_goal_type_text: task.customGoalTypeText,
    custom_goal_type_color: task.customGoalTypeColor,
    meal_type: task.mealType,
    day_of_week: task.dayOfWeek,
    notes: task.notes,
    frequency: task.frequency,
    cleaning_location: task.cleaningLocation,
    custom_cleaning_location: task.customCleaningLocation,
    custom_cleaning_location_color: task.customCleaningLocationColor,
    self_care_type: task.selfCareType,
    delegated_to: task.delegatedTo,
    delegate_type: task.delegateType,
    reminder_enabled: task.reminderEnabled,
    scheduled_date: task.scheduledDate?.toISOString(),
    subtasks: task.subtasks || [],
  });

  const loadTasks = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data) {
        setTasks(data.map(transformToTask));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }, [user]);

  const saveTask = useCallback(async (task: ExtendedTask) => {
    if (!user) return;

    try {
      await supabase.from('tasks').upsert(transformToSupabase(task));
    } catch (error) {
      console.error('Error saving task:', error);
    }
  }, [user]);

  const deleteTaskFromDB = useCallback(async (taskId: string) => {
    if (!user) return;

    try {
      await supabase.from('tasks').delete().eq('id', taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, [user]);

  const addTask = useCallback((newTask: Omit<Task, 'id' | 'completed'>) => {
    const task: ExtendedTask = {
      ...newTask,
      id: Date.now().toString(),
      completed: false,
      habitCount: newTask.isHabit ? 0 : undefined,
      subtasks: newTask.subtasks?.map((subtask, index) => ({
        id: `${Date.now()}-${index}`,
        title: subtask.title,
        completed: false,
      })) || [],
    };
    
    setTasks(prev => [...prev, task]);
    if (user) saveTask(task);
  }, [user, saveTask]);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => {
      const updated = prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      
      const updatedTask = updated.find(task => task.id === id);
      if (user && updatedTask) saveTask(updatedTask);
      
      return updated;
    });
  }, [user, saveTask]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    if (user) deleteTaskFromDB(id);
  }, [user, deleteTaskFromDB]);

  const updateTask = useCallback((updatedTask: Task) => {
    const extendedTask = updatedTask as ExtendedTask;
    setTasks(prev => prev.map(task => task.id === extendedTask.id ? extendedTask : task));
    if (user) saveTask(extendedTask);
  }, [user, saveTask]);

  const incrementHabit = useCallback((id: string) => {
    setTasks(prev => {
      const updated = prev.map(task => {
        if (task.id === id && task.isHabit) {
          const newCount = (task.habitCount || 0) + 1;
          const isCompleted = task.habitGoal ? newCount >= task.habitGoal : false;
          return { ...task, habitCount: newCount, completed: isCompleted };
        }
        return task;
      });
      
      const updatedTask = updated.find(task => task.id === id);
      if (user && updatedTask) saveTask(updatedTask);
      
      return updated;
    });
  }, [user, saveTask]);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prev => {
      const updated = prev.map(task => {
        if (task.id === taskId && task.subtasks) {
          const updatedSubtasks = task.subtasks.map(subtask => 
            subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
          );
          return { ...task, subtasks: updatedSubtasks };
        }
        return task;
      });
      
      const updatedTask = updated.find(task => task.id === taskId);
      if (user && updatedTask) saveTask(updatedTask);
      
      return updated;
    });
  }, [user, saveTask]);

  const rolloverTasks = useCallback(() => {
    setTasks(prev => {
      const updated = prev.map(task => 
        task.isHabit ? { ...task, habitCount: 0, completed: false } : task
      );
      
      if (user) {
        updated.forEach(task => {
          if (task.isHabit) saveTask(task);
        });
      }
      
      return updated;
    });
  }, [user, saveTask]);

  const emergencyOverride = useCallback(() => {
    const emergencyTasks: ExtendedTask[] = [
      {
        id: Date.now().toString(),
        title: 'Handle emergency situation',
        completed: false,
        priority: 'high',
        category: 'daily',
      },
      {
        id: (Date.now() + 1).toString(),
        title: 'Notify relevant parties',
        completed: false,
        priority: 'high',
        category: 'daily',
      },
    ];

    setTasks(prev => [
      ...emergencyTasks,
      ...prev.filter(task => task.priority === 'high' || task.isHabit),
    ]);

    if (user) {
      emergencyTasks.forEach(task => saveTask(task));
    }
  }, [user, saveTask]);

  const moveTask = useCallback((id: string, direction: 'up' | 'down') => {
    setTasks(prevTasks => {
      const taskIndex = prevTasks.findIndex(task => task.id === id);
      if (taskIndex === -1) return prevTasks;
      
      const task = prevTasks[taskIndex];
      const { category, completed } = task;
      
      // Get tasks in the same section
      let sectionTasks = prevTasks.filter(t => t.category === category && t.completed === completed);
      
      // Apply category-specific filtering
      if (category === 'meal-prep' && task.mealType) {
        sectionTasks = sectionTasks.filter(t => t.mealType === task.mealType);
      } else if (category === 'cleaning' && task.frequency) {
        sectionTasks = sectionTasks.filter(t => t.frequency === task.frequency);
      } else if (category === 'self-care' && task.selfCareType) {
        sectionTasks = sectionTasks.filter(t => t.selfCareType === task.selfCareType);
      } else if (category === 'delegation' && task.delegateType) {
        sectionTasks = sectionTasks.filter(t => t.delegateType === task.delegateType);
      } else if (category === 'goals' && task.goalType) {
        sectionTasks = sectionTasks.filter(t => t.goalType === task.goalType);
      }
      
      const sectionIndex = sectionTasks.findIndex(t => t.id === id);
      const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
      
      if (targetIndex < 0 || targetIndex >= sectionTasks.length) return prevTasks;
      
      const targetTask = sectionTasks[targetIndex];
      const targetTaskIndex = prevTasks.findIndex(t => t.id === targetTask.id);
      
      const newTasks = [...prevTasks];
      [newTasks[taskIndex], newTasks[targetTaskIndex]] = [newTasks[targetTaskIndex], newTasks[taskIndex]];
      
      if (user) {
        saveTask(newTasks[taskIndex]);
        saveTask(newTasks[targetTaskIndex]);
      }
      
      return newTasks;
    });
  }, [user, saveTask]);

  const moveTaskUp = useCallback((id: string) => moveTask(id, 'up'), [moveTask]);
  const moveTaskDown = useCallback((id: string) => moveTask(id, 'down'), [moveTask]);

  useEffect(() => {
    if (user) {
      loadTasks();
    } else {
      setTasks([]);
    }
  }, [user, loadTasks]);

  return {
    tasks: tasks as Task[],
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    incrementHabit,
    toggleSubtask,
    rolloverTasks,
    emergencyOverride,
    moveTaskUp,
    moveTaskDown
  };
}