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
  reorderTasks: (startIndex: number, endIndex: number, category: string) => void;
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

  const reorderTasks = (startIndex: number, endIndex: number, category: string) => {
    setTasks(prev => {
      const result = [...prev];
      const categoryTasks = result.filter(task => task.category === category);
      const otherTasks = result.filter(task => task.category !== category);
      
      // Reorder within the category
      const [removed] = categoryTasks.splice(startIndex, 1);
      categoryTasks.splice(endIndex, 0, removed);
      
      // Combine and return
      return [...categoryTasks, ...otherTasks];
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