"use client";
import React, { useState, useEffect } from 'react';
import { Plus, ShieldAlert, Activity, MapPin, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TravelPlansDashboard() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/travel-plans')
      .then(res => res.json())
      .then(data => {
        setPlans(data);
        setLoading(false);
      });
  }, []);

  const createNewPlan = async () => {
    const res = await fetch('/api/travel-plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'New Operation',
        status: 'Draft',
        dates: 'TBD',
        location: 'TBD',
        travelers: 'TBD',
        riskStatus: 'PENDING ASSESSMENT',
        risks: []
      })
    });
    const newPlan = await res.json();
    window.location.href = `/travel-plans/${newPlan.id}`;
  };

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold">Loading Travel Plans...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Travel Plans Dashboard</h1>
          <p className="text-slate-500 mt-2">Manage ongoing and upcoming travel operations.</p>
        </div>
        <button onClick={createNewPlan} className="bg-spearfish hover:bg-[#0f6c7f] text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all flex items-center gap-2">
          <Plus size={20} /> Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex-1">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-black uppercase tracking-widest bg-slate-100 text-slate-600 px-2.5 py-1 rounded">{plan.id}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-sm ${(plan.riskStatus || '').includes('HIGH') || (plan.riskStatus || '').includes('EXTREME') ? 'bg-red-500 text-white' : (plan.riskStatus || '').includes('MEDIUM') ? 'bg-amber-400 text-amber-950' : 'bg-slate-200 text-slate-700'}`}>
                  {plan.riskStatus}
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">{plan.name}</h3>
              <p className="text-sm font-medium text-slate-500 mb-4">{plan.status}</p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <MapPin size={16} className="text-spearfish" /> <span className="font-medium truncate">{plan.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Calendar size={16} className="text-blue-500" /> <span className="font-medium">{plan.dates}</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{plan.risks?.length || 0} Identified Risks</span>
              <Link href={`/travel-plans/${plan.id}`} className="text-spearfish hover:text-[#0f6c7f] font-bold text-sm flex items-center gap-1 group">
                View Details <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
        {plans.length === 0 && (
          <div className="col-span-full p-12 text-center bg-slate-50 rounded-xl border border-slate-200 border-dashed">
            <h3 className="text-lg font-bold text-slate-600 mb-2">No Travel Plans found</h3>
            <p className="text-sm text-slate-500">Click the button above to create your first travel plan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
