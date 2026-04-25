"use client";
import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const FALLBACK_ITEMS = [
  "⚠️ FIERCE ARMED CONFRONTATION IN QILLA ABDULLAH CLAIMS 3 LIVES — AVOID IMMEDIATE AREA",
  "⚠️ IED EXPLOSION TARGETING RAILWAY TRACK PREVENTED IN SIBI — SECURITY HEIGHTENED",
  "⚠️ WIDESPREAD RAIN AND FLASH FLOOD WARNINGS ISSUED ACROSS 27 DISTRICTS IN BALOCHISTAN",
  "⚠️ LARGE-SCALE MILITANT SEARCH OPERATION IN TANK DISTRICT FOLLOWING ABDUCTION",
  "⚠️ TRIBAL CLASHES (2 FATALITIES) IN SHAMSHOZAI — LEVIES FORCES DEPLOYED",
];

export default function Ticker() {
  const [items, setItems] = useState<string[]>(FALLBACK_ITEMS);

  useEffect(() => {
    fetch('/api/news')
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const headlines = data.map(
            (item: any) => `⚠️ ${(item.title || '').toUpperCase()} — ${(item.source || 'GLOBAL ALERT').toUpperCase()}`
          );
          setItems(headlines);
        }
      })
      .catch(() => {
        // Silently fall back to hardcoded items — ticker always works
      });
  }, []);

  const tickerText = items.join('          ');

  return (
    <div className="bg-red-600 text-white px-4 py-2.5 flex items-center overflow-hidden shrink-0 z-50 relative shadow-md">
      <div className="flex items-center gap-2 font-black tracking-widest uppercase text-xs shrink-0 z-10 bg-red-600 pr-6 border-r border-red-500/50">
        <AlertTriangle size={16} className="animate-pulse text-yellow-300" /> LIVE INTEL
      </div>
      <div className="flex-1 overflow-hidden relative flex items-center ml-4 mask-edges">
        <div className="animate-marquee whitespace-nowrap font-semibold text-sm tracking-wide">
          {tickerText}
        </div>
      </div>
    </div>
  );
}
