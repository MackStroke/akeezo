import { useState } from 'react';
import { CheckCircle2, Circle, Clock, Filter, Plus } from 'lucide-react';

export default function TasksPage() {
  const [tasks] = useState([
    { id: 1, title: 'Review medical records for John Doe', status: 'pending', date: '2026-09-14', priority: 'High' },
    { id: 2, title: 'Follow up with Apollo Hospital', status: 'completed', date: '2026-09-13', priority: 'Medium' },
    { id: 3, title: 'Update compliance documentation', status: 'in-progress', date: '2026-09-15', priority: 'High' },
    { id: 4, title: 'Schedule consultation for emergency lead', status: 'pending', date: '2026-09-13', priority: 'Urgent' }
  ]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-bold tracking-tight text-ink-strong">Tasks Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-ink-strong text-background shadow-md font-semibold text-sm">
          <Plus className="size-4" /> New Task
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">All Tasks</h3>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium hover:bg-muted">
            <Filter className="size-4" /> Filter
          </button>
        </div>

        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-4 rounded-xl border border-rule/50 hover:border-primary/30 hover:shadow-sm transition-all group">
              <div className="flex items-center gap-4">
                {task.status === 'completed' ? (
                  <CheckCircle2 className="size-5 text-green-500" />
                ) : task.status === 'in-progress' ? (
                  <Clock className="size-5 text-yellow-500" />
                ) : (
                  <Circle className="size-5 text-muted-foreground" />
                )}
                <div>
                  <p className={`font-semibold ${task.status === 'completed' ? 'text-muted-foreground line-through' : 'text-ink-strong'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>Due: {task.date}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold ${
                      task.priority === 'Urgent' ? 'bg-emergency-surface text-emergency-strong' :
                      task.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-full bg-muted text-sm font-medium transition-opacity">
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
