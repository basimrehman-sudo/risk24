import { DownloadCloud } from 'lucide-react';

export default function UpdatesPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-slate-50 p-8">
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <DownloadCloud size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Software Updates</h1>
        <p className="text-slate-500">Your system is up to date. Platform release notes and feature updates will be published here.</p>
      </div>
    </div>
  );
}
