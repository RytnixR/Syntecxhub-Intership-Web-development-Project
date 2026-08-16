import { useTasks } from '../context/TaskContext';
import { CheckCircle2, Clock, AlertTriangle, ListTodo, TrendingUp } from 'lucide-react';

export default function StatCards() {
  const { stats, tasks } = useTasks();

  const total = stats?.totalTasks ?? tasks?.length ?? 0;
  const completed = stats?.completedTasks ?? tasks?.filter((t) => t.status === 'completed').length ?? 0;
  const inProgress = stats?.inProgressTasks ?? tasks?.filter((t) => t.status === 'in_progress').length ?? 0;
  const overdue = stats?.overdueTasks ?? 0;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const cards = [
    {
      title: 'Total Tasks',
      value: total,
      icon: ListTodo,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    },
    {
      title: 'In Progress',
      value: inProgress,
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
    },
    {
      title: 'Completed',
      value: completed,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      title: 'Overdue',
      value: overdue,
      icon: AlertTriangle,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
    },
    {
      title: 'Completion Rate',
      value: `${rate}%`,
      icon: TrendingUp,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.bg}`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {card.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}