const Task = require('../models/Task');

// @desc    Get user tasks with search, filter, and sorting
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { search, status, priority, category, sortBy } = req.query;
    const query = { user: req.user._id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'dueDate_asc') sortOption = { dueDate: 1 };
    if (sortBy === 'dueDate_desc') sortOption = { dueDate: -1 };
    if (sortBy === 'priority') sortOption = { priority: 1 };

    const tasks = await Task.find(query).sort(sortOption);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching tasks' });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, category, dueDate, subtasks } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      category: category || 'General',
      dueDate: dueDate ? new Date(dueDate) : null,
      subtasks: Array.isArray(subtasks) ? subtasks : [],
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error creating task' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Clean dueDate before update
    const updateData = { ...req.body };
    if (updateData.dueDate === '') {
      updateData.dueDate = null;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error updating task' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error deleting task' });
  }
};

// @desc    Get dashboard metrics / stats
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });

    const totalTasks = tasks.length;
    const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const highPriorityTasks = tasks.filter((t) => t.priority === 'high' || t.priority === 'urgent').length;
    const overdueTasks = tasks.filter(
      (t) => t.dueDate && t.status !== 'completed' && new Date(t.dueDate) < new Date()
    ).length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      totalTasks,
      inProgressTasks,
      completedTasks,
      highPriorityTasks,
      overdueTasks,
      completionRate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching stats' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};