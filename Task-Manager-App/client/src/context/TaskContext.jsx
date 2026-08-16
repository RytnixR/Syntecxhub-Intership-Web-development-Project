import { createContext, useContext, useState, useCallback } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    sortBy: 'createdAt',
  });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.priority !== 'all') params.append('priority', filters.priority);
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

      const { data } = await API.get(`/tasks?${params.toString()}`);
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await API.get('/tasks/stats');
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  const createTask = async (taskPayload) => {
    try {
      const { data } = await API.post('/tasks', taskPayload);
      setTasks((prev) => [data, ...prev]);
      fetchStats();
      toast.success('Task created successfully!');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
      throw err;
    }
  };

  // Optimistic Update: Updates UI instantly, reverts on failure
  const updateTask = async (id, updates) => {
    const previousTasks = [...tasks];

    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, ...updates } : t))
    );

    try {
      const { data } = await API.put(`/tasks/${id}`, updates);
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
      fetchStats();
      return data;
    } catch (err) {
      setTasks(previousTasks); // Rollback
      toast.error('Failed to update task');
      console.error(err);
    }
  };

  // Optimistic Delete
  const deleteTask = async (id) => {
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t._id !== id));

    try {
      await API.delete(`/tasks/${id}`);
      fetchStats();
      toast.success('Task removed');
    } catch (err) {
      setTasks(previousTasks); // Rollback
      toast.error('Failed to delete task');
      console.error(err);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        stats,
        loading,
        filters,
        setFilters,
        fetchTasks,
        fetchStats,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);