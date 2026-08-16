import { useState } from 'react';
import {
  Calendar,
  CheckSquare,
  Edit3,
  Trash2,
  Tag,
  CheckCircle2,
  Circle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const priorityColors = {
  low: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  medium: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  high: 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  urgent: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
};

export default function TaskCard({ task, onEdit }) {
  const { deleteTask, updateTask } = useTasks();
  const [showSubtasks, setShowSubtasks] = useState(false);

  const isCompleted = task.status === 'completed';
  const completedSubtasks = task.subtasks?.filter((s) => s.isCompleted).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const getDueDateStatus = () => {
    if (!task.dueDate || isCompleted) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: 'Overdue',
        color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 font-bold animate-pulse',
      };
    }
    if (diffDays === 0) {
      return {
        label: 'Due Today',
        color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 font-semibold',
      };
    }
    return null;
  };

  const dueStatus = getDueDateStatus();

  const handleToggleComplete = (e) => {
    e.stopPropagation();
    updateTask(task._id, {
      status: isCompleted ? 'todo' : 'completed',
    });
  };

  const handleToggleSubtask = (index, e) => {
    e.stopPropagation();
    const updatedSubtasks = task.subtasks.map((sub, i) =>
      i === index ? { ...sub, isCompleted: !sub.isCompleted } : sub
    );
    updateTask(task._id, { subtasks: updatedSubtasks });
  };

  return (
    <div
      className={`group bg-white dark:bg-slate-900 rounded-xl p-4 border transition-all duration-200 shadow-sm hover:shadow-md ${
        isCompleted
          ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/20 dark:bg-emerald-950/10'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      {/* Badges */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
              priorityColors[task.priority] || priorityColors.medium
            }`}
          >
            {task.priority}
          </span>

          {dueStatus && (
            <span
              className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md border ${dueStatus.color}`}
            >
              <AlertCircle className="w-3 h-3" />
              {dueStatus.label}
            </span>
          )}
        </div>

        {task.category && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
            <Tag className="w-3 h-3 text-slate-400" />
            {task.category}
          </span>
        )}
      </div>

      {/* Task Header & Completion Check */}
      <div className="flex items-start gap-2.5">
        <button
          type="button"
          onClick={handleToggleComplete}
          className="mt-0.5 flex-shrink-0 transition-transform active:scale-90"
          title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950 transition-colors" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-emerald-500 transition-colors" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm font-semibold leading-snug transition-all ${
              isCompleted
                ? 'line-through text-slate-400 dark:text-slate-500 font-normal'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {task.title}
          </h4>

          {task.description && (
            <p
              className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                isCompleted
                  ? 'text-slate-400 dark:text-slate-600 line-through'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Subtasks Progress & Accordion */}
      {totalSubtasks > 0 && (
        <div className="mt-3 pl-7">
          <button
            type="button"
            onClick={() => setShowSubtasks(!showSubtasks)}
            className="w-full flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-1 transition"
          >
            <span className="flex items-center gap-1 font-medium">
              <CheckSquare className="w-3 h-3 text-indigo-500" />
              Subtasks ({completedSubtasks}/{totalSubtasks})
            </span>
            {showSubtasks ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Expanded Subtask Checklist */}
          {showSubtasks && (
            <div className="mt-2.5 space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-2">
              {task.subtasks.map((sub, idx) => (
                <div
                  key={idx}
                  onClick={(e) => handleToggleSubtask(idx, e)}
                  className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={sub.isCompleted}
                    onChange={() => {}}
                    className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span
                    className={
                      sub.isCompleted
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : ''
                    }
                  >
                    {sub.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Card Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : 'No date'}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(task)}
            className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded transition"
            title="Edit Task"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => deleteTask(task._id)}
            className="p-1 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded transition"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}