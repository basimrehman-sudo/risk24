import { CheckSquare } from 'lucide-react';

export default function TasksPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-slate-50 p-8">
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckSquare size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Task Management</h1>
        <p className="text-slate-500">No tasks assigned. Operational tasks, risk action items, and team assignments will appear here.</p>
      </div>
    </div>
  );
}
