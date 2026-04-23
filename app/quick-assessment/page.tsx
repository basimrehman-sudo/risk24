"use client";
import React, { useState } from 'react';
import { Search, MapPin, AlertTriangle, ShieldCheck, Activity, Map as MapIcon, ExternalLink } from 'lucide-react';

export default function QuickAssessment() {
  const [country, setCountry] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(country.trim()) {
      setSearched(true);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Quick Country Assessment</h1>
        <p className="text-slate-500 mt-1">Instantly retrieve risk levels, regional intelligence, and Google Maps integration.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1 shadow-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter country name (e.g., Nigeria, Colombia, UAE)..." 
              className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-spearfish focus:border-spearfish outline-none transition-all text-slate-800 font-medium"
            />
          </div>
          <button type="submit" className="bg-spearfish hover:bg-[#0f6c7f] text-white font-bold py-3.5 px-10 rounded-lg shadow-[0_4px_14px_rgba(18,135,159,0.3)] transition-all hover:scale-105 active:scale-95">
            Analyze
          </button>
        </form>
      </div>

      {searched && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-800 uppercase tracking-widest">{country}</h2>
                  <p className="text-slate-500 flex items-center gap-1.5 mt-2 font-medium"><MapPin size={16} /> Regional Security Assessment</p>
                </div>
                <span className="bg-red-100 border border-red-200 text-red-700 font-black text-sm px-4 py-2 rounded-full uppercase tracking-widest shadow-sm flex items-center gap-2">
                  <AlertTriangle size={18} /> High Risk
                </span>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex gap-4 p-5 rounded-xl bg-slate-50 border border-slate-100">
                  <Activity className="text-amber-500 shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">Current Threat Landscape</h4>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed font-medium">Elevated risk of civil unrest and localized political violence. Travel outside major urban centers is strongly discouraged without an armed escort. Increased vigilance required at border crossings.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-5 rounded-xl bg-slate-50 border border-slate-100">
                  <ShieldCheck className="text-spearfish shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">Platform Recommendation</h4>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed font-medium">Maintain a low profile. Implement mandatory daily check-ins for all active personnel via the Journey Management module. Trigger immediate alerts for cross-region movements.</p>
                  </div>
                </div>
              </div>
            </div>

            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(country)}`} 
              target="_blank" 
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-950 text-white font-bold py-4 px-6 rounded-xl transition-colors border border-slate-700 shadow-[0_4px_14px_rgba(0,0,0,0.1)] group"
            >
              <MapIcon size={20} className="group-hover:scale-110 transition-transform" /> 
              View {country} on Google Maps
              <ExternalLink size={16} className="ml-1 opacity-70" />
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col">
            <h3 className="font-bold text-slate-800 mb-6 border-b pb-3 text-lg">Assessment Stats</h3>
            <div className="space-y-6 flex-1">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Risk Level Score</span>
                <div className="text-4xl font-black text-slate-800 flex items-baseline gap-1 mt-1">84 <span className="text-base text-slate-400 font-semibold mb-1">/ 100</span></div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-red-500 h-full w-[84%] shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Active Alerts</span>
                <div className="text-3xl font-black text-slate-800 mt-1">12</div>
              </div>
              <div className="pt-6 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Target Intelligence</span>
                <div className="text-sm font-semibold text-slate-700 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  Updated from Live Scraper 14 mins ago
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
