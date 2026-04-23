import { Construction } from 'lucide-react';

export default function PlaceholderPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-slate-50 p-8">
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Construction size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">PRO Module</h1>
        <p className="text-slate-500">Executive Briefings generation is currently syncing with global intelligence feeds.</p>
      </div>
    </div>
  );
}
