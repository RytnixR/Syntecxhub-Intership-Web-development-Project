import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTasks } from './context/TaskContext';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Navbar from './components/Navbar';
import StatCards from './components/StatCards';
import KanbanBoard from './components/KanbanBoard';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import Auth from './components/Auth';
import { Filter, ArrowUpDown, Download, Plus, Inbox, Loader2 } from 'lucide-react';

function Dashboard() {
  const { user } = useAuth();
  const { tasks, loading, filters, setFilters, fetchTasks, fetchStats } = useTasks();
  const [viewMode, setViewMode] = useState('kanban');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Dark Mode Persistence & Initialization
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem('taskTheme') === 'dark' ||
      (!('taskTheme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('taskTheme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('taskTheme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchStats();
    }
  }, [user, filters, fetchTasks, fetchStats]);

  if (!user) {
    return <Auth />;
  }

  const handleOpenModal = (task = null) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  // Distinct category list for dynamic dropdown
  const uniqueCategories = Array.from(
    new Set(tasks.map((t) => t.category).filter(Boolean))
  );

  // Export Tasks to CSV
  const handleExportCSV = () => {
    if (!tasks || tasks.length === 0) {
      toast.error('No tasks available to export');
      return;
    }

    const headers = [
      'Title,Description,Status,Priority,Category,DueDate,SubtasksTotal,SubtasksCompleted',
    ];
    const rows = tasks.map((t) => {
      const title = `"${(t.title || '').replace(/"/g, '""')}"`;
      const desc = `"${(t.description || '').replace(/"/g, '""')}"`;
      const subTotal = t.subtasks?.length || 0;
      const subDone = t.subtasks?.filter((s) => s.isCompleted).length || 0;
      const due = t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : '';
      return [
        title,
        desc,
        t.status,
        t.priority,
        t.category || '',
        due,
        subTotal,
        subDone,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `TaskFlow_Export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Tasks exported successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />

      <Navbar
        onOpenTaskModal={handleOpenModal}
        viewMode={viewMode}
        setViewMode={setViewMode}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <StatCards />

        {/* Toolbar & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Filter className="w-4 h-4" /> Filters:
            </div>

            {/* Priority Filter */}
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="text-xs bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="text-xs bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="text-xs bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="createdAt">Newest First</option>
                <option value="dueDate_asc">Due Date (Earliest)</option>
                <option value="dueDate_desc">Due Date (Latest)</option>
                <option value="priority">Priority Order</option>
              </select>
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition"
              title="Export tasks to CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center justify-center py-12 gap-2 text-indigo-600 dark:text-indigo-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm font-medium">Syncing tasks...</span>
          </div>
        )}

        {/* Board / Grid Display */}
        {!loading && (
          <>
            {tasks.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                  No tasks found
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  There are no tasks matching your current filters. Create a new task to get started.
                </p>
                <button
                  onClick={() => handleOpenModal()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition"
                >
                  <Plus className="w-4 h-4" /> Create Task
                </button>
              </div>
            ) : viewMode === 'kanban' ? (
              <KanbanBoard onEditTask={handleOpenModal} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
                  <TaskCard key={task._id} task={task} onEdit={handleOpenModal} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Task Creation / Edit Modal */}
      <TaskModal
        task={selectedTask}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedTask(null);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Dashboard />
      </TaskProvider>
    </AuthProvider>
  );
}