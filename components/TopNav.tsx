"use client";  // ← ADDED THIS
import { Bell, MessageSquare, HelpCircle, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TopNav() {
  const router = useRouter();

  return (
    <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-end px-6 shrink-0 z-10 sticky top-0 w-full">
      <div className="flex items-center gap-6">
        
        <button 
          onClick={() => router.push('/risk-alerts')}  // ← NOW WORKS
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium px-4 py-2 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors text-sm"
        >
          <span>Create Risk Alert</span>
          <Plus size={16} />
        </button>

        <div className="flex items-center gap-4 text-slate-600">
          <button 
            onClick={() => router.push('/notifications')}  // ← NOW WORKS
            className="relative p-1 hover:text-slate-900 transition-colors"
          >
            <Bell size={22} strokeWidth={1.5} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-spearfish text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
              20
            </span>
          </button>

          <button className="p-1 hover:text-slate-900 transition-colors">
            <MessageSquare size={22} strokeWidth={1.5} />
          </button>

          <button className="p-1 hover:text-slate-900 transition-colors">
            <HelpCircle size={22} strokeWidth={1.5} />
          </button>
        </div>
        
        <div 
          onClick={() => router.push('/users')}  // ← Profile click goes to users
          className="flex items-center gap-2 cursor-pointer rounded-full border-2 border-transparent hover:border-slate-200 transition-colors"
        >
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="Profile" 
            className="w-9 h-9 rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}