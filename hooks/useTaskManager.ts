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
  moveTaskUp: (id: string) => void;
  moveTaskDown: (id: string) => void;
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
      else if (category === 'cleaning' && task.cleaningLocation) {
        sectionTasks = sectionTasks.filter(t => t.cleaningLocation === task.cleaningLocation);
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
      else if (category === 'cleaning' && task.cleaningLocation) {
        sectionTasks = sectionTasks.filter(t => t.cleaningLocation === task.cleaningLocation);
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
  };

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    incrementHabit,
    toggleSubtask,
    rolloverTasks,
    emergencyOverride,
    moveTaskUp,
    moveTaskDown
  };
}