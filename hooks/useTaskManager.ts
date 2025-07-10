import { useState, useEffect } from 'react';
import { Task } from '@/components/TaskItem';

export interface TaskManager {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  incrementHabit: (id: string) => void;
  rolloverTasks: () => void;
  emergencyOverride: () => void;
}

export function useTaskManager(): TaskManager {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Morning meditation',
      completed: false,
      isHabit: true,
      habitCount: 0,
      location: 'home',
      priority: 'high',
      isQuickWin: false,
      isDelegated: false,
      subtasks: [
        { id: '1a', title: 'Find quiet space', completed: false },
        { id: '1b', title: 'Set timer for 10 minutes', completed: true },
        { id: '1c', title: 'Focus on breathing', completed: false },
      ],
      category: 'daily',
    },
    {
      id: '2',
      title: 'Complete project proposal',
      completed: false,
      location: 'work',
      priority: 'high',
      isQuickWin: false,
      isDelegated: false,
      subtasks: [
        { id: '2a', title: 'Research requirements', completed: true },
        { id: '2b', title: 'Draft outline', completed: false },
        { id: '2c', title: 'Review with team', completed: false },
      ],
      category: 'daily',
    },
    {
      id: '3',
      title: 'Drink 8 glasses of water',
      completed: false,
      isHabit: true,
      habitCount: 0,
      location: 'anywhere',
      priority: 'medium',
      isQuickWin: true,
      isDelegated: false,
      category: 'daily',
    },
  ]);

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
    setTasks(prev => prev.map(task => 
      task.id === id && task.isHabit 
        ? { ...task, habitCount: (task.habitCount || 0) + 1 }
        : task
    ));
  };

  const rolloverTasks = () => {
    setTasks(prev => prev.map(task => 
      task.completed ? task : { ...task, completed: false }
    ));
  };

  const emergencyOverride = () => {
    setTasks(prev => {
      const emergencyTasks: Task[] = [
        {
          id: Date.now().toString(),
          title: 'Handle emergency situation',
          completed: false,
          priority: 'high',
          location: 'anywhere',
          category: 'daily',
        },
        {
          id: (Date.now() + 1).toString(),
          title: 'Notify relevant parties',
          completed: false,
          priority: 'high',
          location: 'anywhere',
          category: 'daily',
        },
      ];

      return [
        ...emergencyTasks,
        ...prev.filter(task => task.priority === 'high' || task.isHabit),
      ];
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
    rolloverTasks,
    emergencyOverride,
  };
}