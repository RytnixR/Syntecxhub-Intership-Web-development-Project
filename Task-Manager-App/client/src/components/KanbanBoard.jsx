import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';

const COLUMNS = [
  { id: 'todo', title: 'To Do', border: 'border-slate-300 dark:border-slate-700', badge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
  { id: 'in_progress', title: 'In Progress', border: 'border-blue-400 dark:border-blue-700', badge: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300' },
  { id: 'review', title: 'In Review', border: 'border-amber-400 dark:border-amber-700', badge: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300' },
  { id: 'completed', title: 'Completed', border: 'border-emerald-400 dark:border-emerald-700', badge: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300' },
];

export default function KanbanBoard({ onEditTask }) {
  const { tasks, updateTask } = useTasks();

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      updateTask(taskId, { status: targetStatus });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      {COLUMNS.map((col) => {
        const columnTasks = tasks?.filter((t) => t.status === col.id) || [];

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="flex flex-col bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 min-h-[500px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full border-2 ${col.border}`} />
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  {col.title}
                </h3>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                {columnTasks.length}
              </span>
            </div>

            {/* Task List */}
            <div className="flex-1 space-y-3">
              {columnTasks.length === 0 ? (
                <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium">
                  Drop tasks here
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', task._id)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <TaskCard task={task} onEdit={onEditTask} />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}