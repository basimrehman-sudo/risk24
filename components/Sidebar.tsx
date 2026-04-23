"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, User, CheckSquare, Map as MapIcon, 
  BellRing, Bell, ShieldCheck, FileText, 
  BookOpen, Network, DownloadCloud, Upload, Radar, BrainCircuit, Satellite, Crown, Zap 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'User Management', href: '/users', icon: User },
    { name: 'Task Management', href: '/tasks', icon: CheckSquare },
    { name: 'Risk Map', href: '/risk-map', icon: MapIcon },
    { name: 'Risk Alerts', href: '/risk-alerts', icon: BellRing },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Check-Ins', href: '/check-ins', icon: ShieldCheck },
    { name: 'Country Assessments', href: '/assessments', icon: FileText },
    { name: 'Travel Diaries', href: '/travel-diaries', icon: BookOpen },
    { name: 'Travel Plans', href: '/travel-plans', icon: Network },
    { name: 'Quick Country Assessment', href: '/quick-assessment', icon: Zap },
    { name: 'Software Updates', href: '/updates', icon: DownloadCloud },
    { name: 'AI Threat Prediction', href: '/ai-prediction', icon: BrainCircuit, isPremium: true },
    { name: 'Live Satellite Feed', href: '/satellite', icon: Satellite, isPremium: true },
    { name: 'Executive Briefings', href: '/briefings', icon: Crown, isPremium: true },
    { name: 'Daily Reports (PDF)', href: '/reports', icon: Upload, isFree: true },
  ];

  return (
    <aside className="w-64 bg-white text-slate-800 min-h-screen flex flex-col border-r border-slate-200 z-20 shrink-0">
      <div className="h-[72px] flex items-center px-6 text-xl tracking-wide font-extrabold gap-3 shrink-0 uppercase text-slate-800 group cursor-pointer relative">
        <div className="bg-gradient-to-br from-spearfish to-blue-800 text-white p-2 rounded-xl shadow-lg group-hover:shadow-spearfish/50 transition-all duration-300 hover:scale-105">
          <Radar strokeWidth={2.5} size={24} className="animate-[spin_4s_linear_infinite]" />
        </div>
        <div className="flex flex-col -gap-1">
          <span className="leading-none tracking-tighter text-2xl">RISK24</span>
        </div>
        <span className="absolute top-4 right-1 text-[9px] font-black bg-gradient-to-r from-amber-200 to-amber-400 text-amber-900 px-1.5 py-0.5 rounded shadow-sm border border-amber-300">PRO</span>
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href || (pathname === '/' && link.href === '/') || (pathname?.startsWith(link.href) && link.href !== '/');
          const isExactActive = pathname === link.href;
          
          return (
            <Link 
              key={link.name}
              href={link.href} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${
                isExactActive 
                  ? 'bg-spearfish text-white shadow-md' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <link.icon size={20} strokeWidth={isExactActive ? 2 : 1.5} className={isExactActive ? 'text-white' : 'text-slate-600'} /> 
              <span className="flex-1 truncate">{link.name}</span>
              {link.isFree && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0 ${
                  isExactActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                }`}>Free</span>
              )}
              {link.isPremium && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0 shadow-sm border ${
                  isExactActive ? 'bg-amber-400/20 text-amber-100 border-transparent' : 'bg-gradient-to-r from-amber-100 to-yellow-300 text-amber-900 border-amber-300'
                }`}>PRO</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
