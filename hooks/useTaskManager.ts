import { useState, useEffect, useRef, useCallback } from 'react';
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

// Extend the Task interface to include scheduledDate
interface ExtendedTask extends Task {
  scheduledDate?: Date;
}

export function useTaskManager(): TaskManager {
  const [tasks, setTasks] = useState<ExtendedTask[]>([]);
  const { user } = useAuth();
  const isMountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set up mounted ref and clean up timeouts
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Clear any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Load tasks from Supabase when user logs in - using useCallback to memoize the function
  const loadTasks = useCallback(async () => {
    if (!user || !isMountedRef.current) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading tasks:', error);
      }
      if (error && error.code !== 'PGRST116') { // Ignore "not found" errors
        return;
      }

      // Check if data is null before mapping
      if (!data) {
        console.warn('No task data returned from Supabase');
        return;
      }

      // Transform Supabase data to Task format
      const transformedTasks: ExtendedTask[] = data.map(task => ({
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

      if (isMountedRef.current) {
        setTasks(transformedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }, [user]);

  // Load tasks when user changes
  useEffect(() => {
    if (user) {
      loadTasks();
    } else {
      // Clear tasks when user logs out
      if (isMountedRef.current) {
        setTasks([]);
      }
    }
  }, [user, loadTasks]);

  // Memoized function to save tasks to Supabase
  const saveTaskToSupabase = useCallback(async (task: ExtendedTask) => {
    if (!user || !isMountedRef.current) return;

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
  }, [user]);

  // Memoized function to delete tasks from Supabase
  const deleteTaskFromSupabase = useCallback(async (taskId: string) => {
    if (!user || !isMountedRef.current) return;

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
  }, [user]);

  // Add a new task
  const addTask = useCallback((newTask: Omit<Task, 'id' | 'completed'>) => {
    if (!isMountedRef.current) return;

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
    
    // Save to Supabase
    if (user) {
      saveTaskToSupabase(task);
    }
  }, [user, saveTaskToSupabase]);

  // Toggle task completion
  const toggleTask = useCallback((id: string) => {
    if (!isMountedRef.current) return;

    setTasks(prev => {
      const updatedTasks = prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      
      // Find the updated task for Supabase
      const updatedTask = updatedTasks.find(task => task.id === id);
      
      // Update in Supabase
      if (user && updatedTask) {
        saveTaskToSupabase(updatedTask);
      }
      
      return updatedTasks;
    });
  }, [user, saveTaskToSupabase]);

  // Delete a task
  const deleteTask = useCallback((id: string) => {
    if (!isMountedRef.current) return;

    setTasks(prev => prev.filter(task => task.id !== id));
    
    // Delete from Supabase
    if (user) {
      deleteTaskFromSupabase(id);
    }
  }, [user, deleteTaskFromSupabase]);

  // Update an existing task
  const updateTask = useCallback((updatedTask: Task) => {
    if (!isMountedRef.current) return;

    // Cast to ExtendedTask to ensure compatibility
    const extendedTask = updatedTask as ExtendedTask;
    
    setTasks(prev => prev.map(task => 
      task.id === extendedTask.id ? extendedTask : task
    ));
    
    // Update in Supabase
    if (user) {
      saveTaskToSupabase(extendedTask);
    }
  }, [user, saveTaskToSupabase]);
  
  // Increment habit count
  const incrementHabit = useCallback((id: string) => {
    if (!isMountedRef.current) return;

    setTasks(prev => {
      const updatedTasks = prev.map(task => {
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
      });
      
      // Find the updated task for Supabase
      const updatedTask = updatedTasks.find(task => task.id === id);
      
      // Update in Supabase
      if (user && updatedTask) {
        saveTaskToSupabase(updatedTask);
      }
      
      return updatedTasks;
    });
  }, [user, saveTaskToSupabase]);

  // Toggle subtask completion
  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    if (!isMountedRef.current) return;

    setTasks(prev => {
      const updatedTasks = prev.map(task => {
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
      });
      
      // Find the updated task for Supabase
      const updatedTask = updatedTasks.find(task => task.id === taskId);
      
      // Update in Supabase
      if (user && updatedTask) {
        saveTaskToSupabase(updatedTask);
      }
      
      return updatedTasks;
    });
  }, [user, saveTaskToSupabase]);

  // Reset habit counts for the day
  const rolloverTasks = useCallback(() => {
    if (!isMountedRef.current) return;

    setTasks(prev => {
      const updatedTasks = prev.map(task => {
        // Reset habits but maintain completion status of other tasks
        if (task.isHabit) {
          return { ...task, habitCount: 0, completed: false };
        }
        return task;
      });
      
      // Update all habits in Supabase
      if (user) {
        updatedTasks.forEach(task => {
          if (task.isHabit) {
            saveTaskToSupabase(task);
          }
        });
      }
      
      return updatedTasks;
    });
  }, [user, saveTaskToSupabase]);

  // Add emergency tasks
  const emergencyOverride = useCallback(() => {
    if (!isMountedRef.current) return;

    setTasks(prev => {
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

      // Save emergency tasks to Supabase
      if (user) {
        emergencyTasks.forEach(task => saveTaskToSupabase(task));
      }

      return [
        ...emergencyTasks,
        ...prev.filter(task => task.priority === 'high' || task.isHabit),
      ];
    });
  }, [user, saveTaskToSupabase]);

  // Move task up in order
  const moveTaskUp = useCallback((id: string) => {
    if (!isMountedRef.current) return;

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
      
      // Update both tasks in Supabase immediately
      if (user && isMountedRef.current) {
        saveTaskToSupabase(newTasks[taskIndex]);
        saveTaskToSupabase(newTasks[prevTaskIndex]);
      }
      
      return newTasks;
    });
  }, [user, saveTaskToSupabase]);
  
  // Move task down in order
  const moveTaskDown = useCallback((id: string) => {
    if (!isMountedRef.current) return;

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
      
      // Update both tasks in Supabase immediately
      if (user && isMountedRef.current) {
        saveTaskToSupabase(newTasks[taskIndex]);
        saveTaskToSupabase(newTasks[nextTaskIndex]);
      }
      
      return newTasks;
    });
  }, [user, saveTaskToSupabase]);

  return {
    tasks: tasks as Task[],  // Cast back to Task[] for the returned interface
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