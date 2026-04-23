import { ShieldAlert, Users, MapPin, AlertCircle, Radar, Clock, ExternalLink, Globe2 } from 'lucide-react';
import LiveNews from '@/components/LiveNews';

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-[#0e5c6e] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden mb-8 border border-slate-800">
        {/* Animated background glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-spearfish rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 border border-white/10 backdrop-blur-md mb-6 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold tracking-widest text-emerald-100 uppercase">System Active & Monitoring</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4 leading-[1.1]">
               Global Security Command
              <span className="text-[11px] bg-gradient-to-r from-amber-200 to-amber-500 text-amber-950 px-3 py-1 rounded-md uppercase tracking-widest font-black shadow-[0_0_15px_rgba(245,158,11,0.3)] w-max">PRO</span>
            </h1>
            
            <p className="text-slate-300 text-base md:text-lg leading-relaxed font-medium mb-8 opacity-90">
              Welcome back. Your enterprise infrastructure is actively processing real-time threat intelligence, AI-powered incident forecasting, and dedicated satellite telemetry streams globally.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <button className="bg-white text-slate-900 font-bold py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all hover:-translate-y-1 hover:scale-105 active:scale-95 shrink-0">
                View Predictive Analytics
              </button>
              <button className="bg-black/20 hover:bg-black/40 text-white font-bold py-3 px-8 rounded-xl backdrop-blur-sm border border-white/20 transition-all hover:-translate-y-1">
                Download Briefing
              </button>
            </div>
          </div>
          
          <div className="w-full lg:w-auto grid grid-cols-2 gap-4 shrink-0 mt-4 lg:mt-0">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center text-center">
              <ShieldAlert size={32} className="text-amber-400 mb-3" />
              <span className="text-4xl font-black text-white tracking-tighter">14</span>
              <span className="text-[10px] text-slate-300 uppercase tracking-widest font-bold mt-2">High Risk Zones</span>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center text-center">
              <Radar size={32} className="text-blue-400 mb-3" />
              <span className="text-4xl font-black text-white tracking-tighter">8.4k</span>
              <span className="text-[10px] text-slate-300 uppercase tracking-widest font-bold mt-2">Events Scanned</span>
            </div>
          </div>
        </div>
        
        <div className="absolute top-[-80px] right-[-40px] opacity-[0.06] transform -rotate-12 pointer-events-none mix-blend-plus-lighter">
          <Globe2 size={500} strokeWidth={0.5} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Critical Alerts" value="4" icon={<ShieldAlert className="text-red-500" size={24} />} trend="+1 since yesterday" trendColor="text-red-500" />
        <StatCard title="Travelers on Move" value="128" icon={<Users className="text-blue-500" size={24} />} trend="Stable" trendColor="text-slate-500" />
        <StatCard title="High Risk Zones" value="12" icon={<MapPin className="text-amber-500" size={24} />} trend="-2 since last week" trendColor="text-emerald-500" />
        <StatCard title="Pending Assessments" value="7" icon={<AlertCircle className="text-purple-500" size={24} />} trend="Needs attention" trendColor="text-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
             Recent Security Events
          </h2>
          <div className="space-y-4">
            <EventRow time="10:45 AM" title="IED Attack Prevented" location="Sibi, Balochistan" type="Terrorism" color="bg-red-100 text-red-700" />
            <EventRow time="09:15 AM" title="Tribal Clashes (3 Fatalities)" location="Qila Abdullah" type="Civil Unrest" color="bg-orange-100 text-orange-700" />
            <EventRow time="Yesterday" title="Flash Flood Warning Issued" location="Quetta" type="Hazard" color="bg-amber-100 text-amber-700" />
            <EventRow time="Yesterday" title="Protest Rally (PTI)" location="Karachi" type="Protest" color="bg-blue-100 text-blue-700" />
          </div>
        </div>
        
        <LiveNews />
      </div>
    </div>
  );
}



function StatCard({ title, value, icon, trend, trendColor }: any) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition-shadow cursor-default">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
      <p className={`text-xs mt-2 font-medium ${trendColor}`}>{trend}</p>
    </div>
  );
}

function EventRow({ time, title, location, type, color }: any) {
  return (
    <div className="flex items-start justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
      <div>
        <h4 className="font-semibold text-slate-800 text-sm">{title}</h4>
        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
          <MapPin size={12} /> {location} &bull; {time}
        </p>
      </div>
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>
        {type}
      </span>
    </div>
  );
}
