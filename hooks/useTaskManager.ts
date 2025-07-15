import { useState, useEffect } from 'react';
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

export function useTaskManager(): TaskManager {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  // Load tasks from Supabase when user logs in
  useEffect(() => {
    if (user) {
      loadTasks();
    } else {
      // Clear tasks when user logs out
      setTasks([]);
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading tasks:', error);
        return;
      }

      // Transform Supabase data to Task format
      const transformedTasks: Task[] = data.map(task => ({
        id: task.id,
        title: task.title,
        completed: task.completed,
        isHabit: task.is_habit,
        habitCount: task.habit_count,
        habitGoal: task.habit_goal,
        priority: task.priority,
        customPriorityText: task.custom_priority_text,
        customPriorityColor: task.custom_priority_color,
        goalType: task.goal_type,
        customGoalTypeText: task.custom_goal_type_text,
        customGoalTypeColor: task.custom_goal_type_color,
        isDelegated: !!task.delegated_to,
        delegatedTo: task.delegated_to,
        delegateType: task.delegate_type,
        subtasks: task.subtasks || [],
        category: task.category,
        mealType: task.meal_type,
        dayOfWeek: task.day_of_week,
        notes: task.notes,
        frequency: task.frequency,
        cleaningLocation: task.cleaning_location,
        customCleaningLocation: task.custom_cleaning_location,
        customCleaningLocationColor: task.custom_cleaning_location_color,
        selfCareType: task.self_care_type,
        reminderEnabled: task.reminder_enabled,
        scheduledDate: task.scheduled_date ? new Date(task.scheduled_date) : undefined,
      }));

      setTasks(transformedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTaskToSupabase = async (task: Task) => {
    if (!user) return;

    try {
      const taskData = {
        id: task.id,
        user_id: user.id,
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
      };

      const { error } = await supabase
        .from('tasks')
        .upsert(taskData);

      if (error) {
        console.error('Error saving task:', error);
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const deleteTaskFromSupabase = async (taskId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('Error deleting task:', error);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const addTask = (newTask: Omit<Task, 'id' | 'completed'>) => {
    const task: Task = {
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
    
    // Save to Supabase
    if (user) {
      saveTaskToSupabase(task);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    
    // Update in Supabase
    if (user) {
      const updatedTask = tasks.find(task => task.id === id);
      if (updatedTask) {
        saveTaskToSupabase({ ...updatedTask, completed: !updatedTask.completed });
      }
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    
    // Delete from Supabase
    if (user) {
      deleteTaskFromSupabase(id);
    }
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    
    // Update in Supabase
    if (user) {
      saveTaskToSupabase(updatedTask);
    }
  };
  
  const incrementHabit = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id && task.isHabit) {
        const newCount = (task.habitCount || 0) + 1;
        const isCompleted = task.habitGoal ? newCount >= task.habitGoal : false;
        
        return { 
          ...task, 
          habitCount: newCount,
          completed: isCompleted
        };
      }
      return task;
    }));
    
    // Update in Supabase
    if (user) {
      const updatedTask = tasks.find(task => task.id === id);
      if (updatedTask) {
        const newCount = (updatedTask.habitCount || 0) + 1;
        const isCompleted = updatedTask.habitGoal ? newCount >= updatedTask.habitGoal : false;
        saveTaskToSupabase({ 
          ...updatedTask, 
          habitCount: newCount,
          completed: isCompleted
        });
      }
    }
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId && task.subtasks) {
        const updatedSubtasks = task.subtasks.map(subtask => 
          subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
        );
        
        return {
          ...task,
          subtasks: updatedSubtasks
        };
      }
      return task;
    }));
    
    // Update in Supabase
    if (user) {
      const updatedTask = tasks.find(task => task.id === taskId);
      if (updatedTask) {
        saveTaskToSupabase(updatedTask);
      }
    }
  };

  const rolloverTasks = () => {
    setTasks(prev => prev.map(task => {
      // Reset habits but maintain completion status of other tasks
      if (task.isHabit) {
        return { ...task, habitCount: 0, completed: false };
      }
      return task;
    }));
  };

  const emergencyOverride = () => {
    setTasks(prev => {
      const emergencyTasks: Task[] = [
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

      return [
        ...emergencyTasks,
        ...prev.filter(task => task.priority === 'high' || task.isHabit),
      ];
    });
  };

  const moveTaskUp = (id: string) => {
    setTasks(prevTasks => {
      const taskIndex = prevTasks.findIndex(task => task.id === id);
      if (taskIndex <= 0) return prevTasks; // Already at the top
      
      const task = prevTasks[taskIndex];
      const isCompleted = task.completed;
      const category = task.category;
      
      // Define grouping criteria based on task category
      let sectionTasks = prevTasks.filter(t => 
        t.category === category && t.completed === isCompleted
      );
      
      // Apply additional filtering based on category-specific tags
      if (category === 'meal-prep' && task.mealType) {
        sectionTasks = sectionTasks.filter(t => t.mealType === task.mealType);
      } 
      else if (category === 'cleaning' && task.frequency) {
        // For cleaning tasks, filter by frequency instead of location
        sectionTasks = sectionTasks.filter(t => t.frequency === task.frequency);
      }
      else if (category === 'self-care' && task.selfCareType) {
        sectionTasks = sectionTasks.filter(t => t.selfCareType === task.selfCareType);
      }
      else if (category === 'delegation' && task.delegateType) {
        sectionTasks = sectionTasks.filter(t => t.delegateType === task.delegateType);
      }
      else if (category === 'goals' && task.goalType) {
        sectionTasks = sectionTasks.filter(t => t.goalType === task.goalType);
      }
      
      const sectionIndex = sectionTasks.findIndex(t => t.id === id);
      if (sectionIndex <= 0) return prevTasks; // Already at the top of its section
      
      // Get the task to swap with
      const prevTask = sectionTasks[sectionIndex - 1];
      const prevTaskIndex = prevTasks.findIndex(t => t.id === prevTask.id);
      
      // Create a new array with the tasks swapped
      const newTasks = [...prevTasks];
      [newTasks[taskIndex], newTasks[prevTaskIndex]] = [newTasks[prevTaskIndex], newTasks[taskIndex]];
      
      return newTasks;
    });
    
    // Update both tasks in Supabase
    if (user) {
      setTimeout(() => {
        const currentTasks = tasks;
        const task = currentTasks.find(t => t.id === id);
        const taskIndex = currentTasks.findIndex(t => t.id === id);
        
        if (task && taskIndex > 0) {
          const prevTask = currentTasks[taskIndex - 1];
          saveTaskToSupabase(task);
          saveTaskToSupabase(prevTask);
        }
      }, 100);
    }
  };
  
  const moveTaskDown = (id: string) => {
    setTasks(prevTasks => {
      const taskIndex = prevTasks.findIndex(task => task.id === id);
      if (taskIndex === -1 || taskIndex === prevTasks.length - 1) return prevTasks; // Not found or already at the bottom
      
      const task = prevTasks[taskIndex];
      const isCompleted = task.completed;
      const category = task.category;
      
      // Define grouping criteria based on task category
      let sectionTasks = prevTasks.filter(t => 
        t.category === category && t.completed === isCompleted
      );
      
      // Apply additional filtering based on category-specific tags
      if (category === 'meal-prep' && task.mealType) {
        sectionTasks = sectionTasks.filter(t => t.mealType === task.mealType);
      } 
      else if (category === 'cleaning' && task.frequency) {
        // For cleaning tasks, filter by frequency instead of location
        sectionTasks = sectionTasks.filter(t => t.frequency === task.frequency);
      }
      else if (category === 'self-care' && task.selfCareType) {
        sectionTasks = sectionTasks.filter(t => t.selfCareType === task.selfCareType);
      }
      else if (category === 'delegation' && task.delegateType) {
        sectionTasks = sectionTasks.filter(t => t.delegateType === task.delegateType);
      }
      else if (category === 'goals' && task.goalType) {
        sectionTasks = sectionTasks.filter(t => t.goalType === task.goalType);
      }
      
      const sectionIndex = sectionTasks.findIndex(t => t.id === id);
      if (sectionIndex === sectionTasks.length - 1) return prevTasks; // Already at the bottom of its section
      
      // Get the task to swap with
      const nextTask = sectionTasks[sectionIndex + 1];
      const nextTaskIndex = prevTasks.findIndex(t => t.id === nextTask.id);
      
      // Create a new array with the tasks swapped
      const newTasks = [...prevTasks];
      [newTasks[taskIndex], newTasks[nextTaskIndex]] = [newTasks[nextTaskIndex], newTasks[taskIndex]];
      
      return newTasks;
    });
    
    // Update both tasks in Supabase
    if (user) {
      setTimeout(() => {
        const currentTasks = tasks;
        const task = currentTasks.find(t => t.id === id);
        const taskIndex = currentTasks.findIndex(t => t.id === id);
        
        if (task && taskIndex < currentTasks.length - 1) {
          const nextTask = currentTasks[taskIndex + 1];
          saveTaskToSupabase(task);
          saveTaskToSupabase(nextTask);
        }
      }, 100);
    }
  };

  return {
    tasks,
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