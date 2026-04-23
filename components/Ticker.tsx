import { AlertTriangle } from 'lucide-react';

export default function Ticker() {
  return (
    <div className="bg-red-600 text-white px-4 py-2.5 flex items-center overflow-hidden shrink-0 z-50 relative shadow-md">
      <div className="flex items-center gap-2 font-black tracking-widest uppercase text-xs shrink-0 z-10 bg-red-600 pr-6 border-r border-red-500/50">
        <AlertTriangle size={16} className="animate-pulse text-yellow-300" /> ONGOING CRITICAL
      </div>
      <div className="flex-1 overflow-hidden relative flex items-center ml-4 mask-edges">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16 font-semibold text-sm tracking-wide">
          <span>⚠️ FIERCE ARMED CONFRONTATION IN QILLA ABDULLAH CLAIMS 3 LIVES — AVOID IMMEDIATE AREA</span>
          <span>⚠️ IED EXPLOSION TARGETING RAILWAY TRACK PREVENTED IN SIBI — SECURITY HEIGHTENED</span>
          <span>⚠️ WIDESPREAD RAIN AND FLASH FLOOD WARNINGS ISSUED ACROSS 27 DISTRICTS IN BALOCHISTAN</span>
          <span>⚠️ LARGE-SCALE MILITANT SEARCH OPERATION IN TANK DISTRICT FOLLOWING ABDUCTION</span>
          <span>⚠️ TRIBAL CLASHES (2 FATALITIES) IN SHAMSHOZAI — LEVIES FORCES DEPLOYED</span>
        </div>
      </div>
    </div>
  );
}
