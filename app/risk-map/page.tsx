"use client";
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const MapWithNoSSR = dynamic(() => import('@/components/MapLayer'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-slate-200">
      <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
      <span className="text-slate-500 font-medium tracking-wide">Loading Geodata...</span>
    </div>
  )
});

export default function RiskMap() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Global Risk Map</h1>
          <p className="text-slate-500 mt-1">Real-time geographical visualization of security events.</p>
        </div>
        <div className="flex gap-3">
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-full text-xs font-bold shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Critical
          </span>
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-full text-xs font-bold shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> High
          </span>
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-full text-xs font-bold shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Medium
          </span>
        </div>
      </div>

      <div className="flex-1 bg-white p-2 rounded-xl shadow-sm border border-slate-200 relative z-0 overflow-hidden">
        <MapWithNoSSR />
      </div>
    </div>
  );
}
