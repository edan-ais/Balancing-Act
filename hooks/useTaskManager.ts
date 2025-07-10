import { useState, useEffect } from 'react';
import { Task } from '@/components/TaskItem';

export interface TaskManager {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  incrementHabit: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  rolloverTasks: () => void;
  emergencyOverride: () => void;
  reorderTasks: (taskId: string, targetIndex: number, section: 'pending' | 'completed') => void;
}

export function useTaskManager(): TaskManager {
  const [tasks, setTasks] = useState<Task[]>([]);

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
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
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
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId && task.subtasks) {
        const updatedSubtasks = task.subtasks.map(subtask => 
          subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
        );
        
        // Removed the auto-completion of parent task based on subtasks
        return {
          ...task,
          subtasks: updatedSubtasks
        };
      }
      return task;
    }));
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

  const reorderTasks = (taskId: string, targetIndex: number, section: 'pending' | 'completed') => {
    setTasks(currentTasks => {
      const newTasks = [...currentTasks];
      
      // Find the task to move
      const taskIndex = newTasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return currentTasks;
      
      const taskToMove = newTasks[taskIndex];
      const taskCategory = taskToMove.category;
      const isCompleted = taskToMove.completed;
      
      // Only allow reordering within the same section (pending or completed)
      const sectionMatches = 
        (section === 'pending' && !isCompleted) || 
        (section === 'completed' && isCompleted);
      
      if (!sectionMatches) return currentTasks;
      
      // Remove the task from its current position
      newTasks.splice(taskIndex, 1);
      
      // Get the tasks in the same section and category
      const sectionTasks = newTasks.filter(t => 
        t.category === taskCategory && 
        (section === 'pending' ? !t.completed : t.completed)
      );
      
      // Calculate the insert position in the overall array
      let insertPosition = 0;
      
      if (sectionTasks.length > 0) {
        // If there are tasks in this section, find where to insert
        const boundedTargetIndex = Math.min(targetIndex, sectionTasks.length);
        
        if (boundedTargetIndex === sectionTasks.length) {
          // Insert after the last task in this section
          const lastTask = sectionTasks[sectionTasks.length - 1];
          insertPosition = newTasks.findIndex(t => t.id === lastTask.id) + 1;
        } else {
          // Insert before the target task
          const targetTask = sectionTasks[boundedTargetIndex];
          insertPosition = newTasks.findIndex(t => t.id === targetTask.id);
        }
      } else {
        // If there are no tasks in this section, find the appropriate position
        // based on category and completion status
        const categoryTasks = newTasks.filter(t => t.category === taskCategory);
        
        if (section === 'pending') {
          // Insert at the beginning of this category
          const firstCategoryTask = categoryTasks[0];
          insertPosition = firstCategoryTask 
            ? newTasks.findIndex(t => t.id === firstCategoryTask.id)
            : newTasks.length;
        } else {
          // For completed, insert after all pending tasks in this category
          const pendingTasks = categoryTasks.filter(t => !t.completed);
          if (pendingTasks.length > 0) {
            const lastPendingTask = pendingTasks[pendingTasks.length - 1];
            insertPosition = newTasks.findIndex(t => t.id === lastPendingTask.id) + 1;
          } else {
            // If no pending tasks, insert at the beginning of the category
            const firstCategoryTask = categoryTasks[0];
            insertPosition = firstCategoryTask 
              ? newTasks.findIndex(t => t.id === firstCategoryTask.id)
              : newTasks.length;
          }
        }
      }
      
      // Insert the task at the calculated position
      newTasks.splice(insertPosition, 0, taskToMove);
      
      return newTasks;
    });
  };

  // Auto-rollover logic could be implemented here with date checking
  useEffect(() => {
    // This would typically check if it's a new day and rollover incomplete tasks
    // For demo purposes, we'll keep it simple
  }, []);

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    incrementHabit,
    toggleSubtask,
    rolloverTasks,
    emergencyOverride,
    reorderTasks,
  };
}