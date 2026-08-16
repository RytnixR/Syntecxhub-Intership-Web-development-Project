import Task from '../models/Task.js';

// @route GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Get Tasks Error:', error);
    return res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

// @route POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, category, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      category: category || 'General',
      dueDate: dueDate || null,
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error('Create Task Error:', error);
    return res.status(500).json({ message: 'Failed to create task' });
  }
};

// @route PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Update Task Error:', error);
    return res.status(500).json({ message: 'Failed to update task' });
  }
};

// @route DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete Task Error:', error);
    return res.status(500).json({ message: 'Failed to delete task' });
  }
};