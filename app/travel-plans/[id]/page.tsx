"use client";
import React, { useState, useEffect } from 'react';
import { Plus, ShieldAlert, Activity, Users, Calendar, MapPin, Printer, X, FilePlus, Save, Trash2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TravelPlanDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<'admin' | 'client'>('admin');
  const [showAddForm, setShowAddForm] = useState(false);
  const factors = [
    "Travel and Transportation",
    "Environment and Infrastructure",
    "Detention and Kidnap",
    "Political Violence and Terrorism",
    "Social Unrest and Protests",
    "Crime and Lawlessness",
    "Medical and Health",
    "Cyber Crimes",
    "Other / Custom"
  ];
  const [newThreat, setNewThreat] = useState({ threat: '', factor: factors[0], mitigation: '', likelihood: 3, impact: 3 });
  const [customFactor, setCustomFactor] = useState('');
  
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/travel-plans/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setPlan(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        router.push('/travel-plans');
      });
  }, [params.id, router]);

  const savePlan = async (updatedPlan: any) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/travel-plans/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlan)
      });
      const data = await res.json();
      setPlan(data);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if(!confirm('Are you sure you want to delete this travel plan?')) return;
    await fetch(`/api/travel-plans/${params.id}`, { method: 'DELETE' });
    router.push('/travel-plans');
  };

  const handleFieldUpdate = (field: string, value: string) => {
    if (userRole !== 'admin') return;
    const updatedPlan = { ...plan, [field]: value };
    setPlan(updatedPlan);
  };

  const updateRisk = (id: number, field: string, value: any) => {
    if (userRole !== 'admin') return;
    const updatedRisks = (plan.risks || []).map((r: any) => {
      if (r.id === id) {
        const newR = { ...r, [field]: value };
        newR.score = newR.likelihood * newR.impact;
        return newR;
      }
      return r;
    });
    setPlan({ ...plan, risks: updatedRisks });
  };

  const likelihoods = [
    { val: 5, label: "Almost Certain" }, { val: 4, label: "Likely" }, { val: 3, label: "Possible" }, { val: 2, label: "Unlikely" }, { val: 1, label: "Rare" }
  ];

  const impacts = [
    { val: 1, label: "Negligible" }, { val: 2, label: "Minor" }, { val: 3, label: "Moderate" }, { val: 4, label: "Major" }, { val: 5, label: "Critical" }
  ];

  const getRiskLevel = (score: number) => {
    if (score >= 15) return { label: 'EXTREME', color: 'bg-red-600', text: 'text-red-700', bgLt: 'bg-red-100' };
    if (score >= 10) return { label: 'HIGH', color: 'bg-orange-500', text: 'text-orange-700', bgLt: 'bg-orange-100' };
    if (score >= 5) return { label: 'MEDIUM', color: 'bg-amber-400', text: 'text-amber-700', bgLt: 'bg-amber-100' };
    return { label: 'LOW', color: 'bg-green-500', text: 'text-green-700', bgLt: 'bg-green-100' };
  };

  const handleAddRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if(newThreat.threat.trim() === '') return;
    const score = newThreat.likelihood * newThreat.impact;
    let finalFactor = newThreat.factor;
    if (finalFactor === "Other / Custom" && customFactor.trim() !== '') {
      finalFactor = customFactor.trim();
    }
    const updatedRisks = [...(plan.risks || []), { id: Date.now(), ...newThreat, factor: finalFactor, score }];
    savePlan({ ...plan, risks: updatedRisks });
    setNewThreat({ threat: '', factor: factors[0], mitigation: '', likelihood: 3, impact: 3 });
    setCustomFactor('');
    setShowAddForm(false);
  };

  const removeRisk = (id: number) => {
    if(!confirm('Remove this threat?')) return;
    const updatedRisks = (plan.risks || []).filter((r: any) => r.id !== id);
    savePlan({ ...plan, risks: updatedRisks });
  };

  const getCellClasses = (l: number, i: number) => {
    const s = l * i;
    if (s >= 15) return 'bg-red-500 hover:bg-red-400 text-white';
    if (s >= 10) return 'bg-orange-500 hover:bg-orange-400 text-white';
    if (s >= 5) return 'bg-amber-400 hover:bg-amber-300 text-amber-950';
    return 'bg-green-500 hover:bg-green-400 text-white';
  };

  const printDocument = () => {
    window.print();
  };

  const getFactorColor = (factorStr: string) => {
    if(!factorStr) return 'bg-slate-100 text-slate-700 border-slate-200';
    const colors = [
      'bg-blue-100 text-blue-700 border-blue-200',
      'bg-indigo-100 text-indigo-700 border-indigo-200',
      'bg-purple-100 text-purple-700 border-purple-200',
      'bg-rose-100 text-rose-700 border-rose-200',
      'bg-emerald-100 text-emerald-700 border-emerald-200',
      'bg-cyan-100 text-cyan-700 border-cyan-200',
      'bg-slate-800 text-white border-slate-700'
    ];
    let hash = 0;
    for (let i = 0; i < factorStr.length; i++) {
        hash = factorStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading || !plan) return <div className="p-12 text-center text-slate-500 font-bold">Loading Travel Plan Details...</div>;

  const isAdmin = userRole === 'admin';

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-0 pb-12">
      <div className="pt-4 pb-2">
        <Link href="/travel-plans" className="text-spearfish hover:text-[#0f6c7f] font-bold text-sm flex items-center gap-2 w-max">
          <ArrowLeft size={16} /> Back to Travel Plans
        </Link>
      </div>
      
      {/* Header aligned to PPT concepts */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-slate-900 via-slate-800 to-[var(--color-spearfish,rgb(18,135,159))] p-8 rounded-2xl shadow-xl border border-slate-700 text-white gap-6">
        <div className="w-full md:w-1/2">
          {isAdmin ? (
            <input 
              value={plan.status} 
              onChange={e => handleFieldUpdate('status', e.target.value)} 
              className="bg-white/10 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded border border-white/30 backdrop-blur-md mb-4 inline-block shadow-sm outline-none focus:border-white w-full max-w-[300px]" 
            />
          ) : (
            <span className="bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/30 backdrop-blur-md mb-4 inline-block shadow-sm">{plan.status}</span>
          )}
          
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <input 
                value={plan.name} 
                onChange={e => handleFieldUpdate('name', e.target.value)} 
                className="text-3xl md:text-4xl font-black tracking-tight mt-2 w-full bg-transparent border-b border-dashed border-white/30 focus:border-white outline-none pb-1"
              />
            ) : (
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-2 flex items-center gap-3">
                {plan.name}
              </h1>
            )}
          </div>
          <p className="text-slate-300 mt-4 font-medium max-w-2xl leading-relaxed text-sm">Comprehensive travel security plan, route assessment, and dynamic risk matrix mapping evaluating operational threats against established mitigation protocols.</p>
        </div>
        
        <div className="flex flex-col items-start md:items-end gap-3 shrink-0 mt-4 md:mt-0">
          <div className="flex items-center gap-1 bg-black/20 p-1.5 rounded-lg border border-white/10 backdrop-blur-md shadow-inner mb-2 lg:mb-0">
            <button 
              onClick={() => { setUserRole('admin'); setShowAddForm(false); }} 
              className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${isAdmin ? 'bg-spearfish text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
            >
              Admin View
            </button>
            <button 
              onClick={() => { setUserRole('client'); setShowAddForm(false); }} 
              className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${userRole === 'client' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
            >
              Client View
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
             {isAdmin && (
              <button onClick={() => savePlan(plan)} disabled={saving} className="bg-white text-spearfish font-bold py-2 px-4 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all flex items-center gap-2 hover:-translate-y-0.5 text-sm hover:scale-105 active:scale-95 disabled:opacity-50">
                <Save size={16} /> {saving ? 'Saving...' : 'Save Plan'}
              </button>
            )}
            <button onClick={printDocument} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2 shadow-sm backdrop-blur-sm text-sm">
              <Printer size={16} /> Export
            </button>
            {isAdmin && (
              <button onClick={handleDelete} className="bg-red-500/20 hover:bg-red-500 text-white border border-red-500/50 font-bold py-2 px-3 rounded-lg transition-all flex items-center shadow-sm backdrop-blur-sm text-sm" title="Delete Plan">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Itinerary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Calendar size={20} />, title: "Dates", field: "dates", color: "blue" },
          { icon: <MapPin size={20} />, title: "Primary Location", field: "location", color: "spearfish" },
          { icon: <Users size={20} />, title: "Travelers", field: "travelers", color: "amber" },
          { icon: <ShieldAlert size={20} />, title: "Overall Risk Status", field: "riskStatus", color: "red" },
        ].map((item: any, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 bg-${item.color}-100 text-${item.color}-700 rounded-lg shrink-0`}>{item.icon}</div>
            <div className="w-full">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{item.title}</p>
              {isAdmin ? (
                <input 
                  value={plan[item.field] || ''} 
                  onChange={e => handleFieldUpdate(item.field, e.target.value)}
                  className="w-full font-semibold text-slate-800 leading-tight border-b border-dashed border-slate-300 focus:border-spearfish outline-none bg-transparent"
                />
              ) : (
                <p className={`font-semibold text-slate-800 leading-tight ${item.field === 'riskStatus' ? 'font-black text-red-700 uppercase' : ''}`}>
                  {plan[item.field]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ISO 31010 Risk Matrix (Takes 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 p-8 sticky top-24">
          <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2 border-b pb-4">
            <Activity className="text-spearfish" /> ISO 31010 Matrix
          </h2>
          
          <div className="relative mt-8 ml-8">
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-black text-slate-400 tracking-widest uppercase">
              Likelihood
            </div>
            
            <div className="grid grid-cols-5 gap-1.5 md:gap-2">
              {likelihoods.map((l) => (
                <React.Fragment key={l.val}>
                  {impacts.map((i) => {
                    const activeRisks = (plan.risks || []).filter((r: any) => r.likelihood === l.val && r.impact === i.val);
                    return (
                      <div key={`${l.val}-${i.val}`} className={`aspect-square rounded shadow-inner border border-black/10 transition-all flex items-center justify-center relative ${getCellClasses(l.val, i.val)}`}>
                        {activeRisks.length > 0 && (
                          <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-white text-white flex items-center justify-center text-xs font-black shadow-lg animate-bounce">
                            {activeRisks.length}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 tracking-widest uppercase w-max">
              Impact / Consequence
            </div>

            <div className="grid grid-cols-5 gap-1.5 md:gap-2 mt-2">
              {impacts.map(i => (
                <div key={i.val} className="text-center text-[9px] md:text-[10px] font-bold text-slate-400">
                  {i.label}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-16 pt-6 border-t border-slate-100 grid grid-cols-2 gap-3 text-[10px] font-black tracking-wider text-slate-600">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-sm shadow-sm"></div> EXTREME (15+)</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-sm shadow-sm"></div> HIGH (10-14)</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-400 rounded-sm shadow-sm"></div> MEDIUM (5-9)</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-sm shadow-sm"></div> LOW (1-4)</div>
          </div>
        </div>

        {/* Detailed Threat Analysis Log (Takes 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative z-10 flex-wrap gap-4">
            <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2"><ShieldAlert className="text-amber-500" size={20} /> Operational Threats & Mitigations</h2>
            
            {isAdmin ? (
              <button onClick={() => setShowAddForm(!showAddForm)} className="text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm active:scale-95">
                {showAddForm ? <><X size={16}/> Cancel Edit</> : <><Plus size={16}/> Add Threat</>}
              </button>
            ) : (
              <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-3 py-1.5 rounded-md uppercase tracking-widest border border-slate-200 flex items-center gap-1.5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-slate-400"></div> Client Read-Only Mode
              </span>
            )}
          </div>

          {isAdmin && showAddForm && (
            <form onSubmit={handleAddRisk} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 text-white relative z-0 mt-[-10px] pt-10">
              <h3 className="font-bold text-lg mb-4 text-white">Add New Threat Assessment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Identified Threat</label>
                  <input required type="text" value={newThreat.threat} onChange={e=>setNewThreat({...newThreat, threat: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-[var(--color-spearfish,rgb(18,135,159))] outline-none" placeholder="e.g., Unexploded Ordnance (UXO)" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Risk Factor Category</label>
                  <select value={newThreat.factor} onChange={e=>setNewThreat({...newThreat, factor: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[var(--color-spearfish,rgb(18,135,159))]">
                    {factors.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  {newThreat.factor === "Other / Custom" && (
                    <input type="text" value={customFactor} onChange={e=>setCustomFactor(e.target.value)} className="w-full bg-slate-800 border-b border-[var(--color-spearfish,rgb(18,135,159))] px-4 py-2 text-white mt-3 outline-none text-sm shadow-inner" placeholder="Specify custom factor..." autoFocus />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Mitigation Strategy</label>
                  <textarea required value={newThreat.mitigation} onChange={e=>setNewThreat({...newThreat, mitigation: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-[var(--color-spearfish,rgb(18,135,159))] outline-none min-h-[80px]" placeholder="e.g., Remain strictly on paved roads. Engage local guide." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Initial Likelihood (1-5)</label>
                    <select value={newThreat.likelihood} onChange={e=>setNewThreat({...newThreat, likelihood: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none">
                      {likelihoods.map(l=><option key={l.val} value={l.val}>{l.val} - {l.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Initial Impact (1-5)</label>
                    <select value={newThreat.impact} onChange={e=>setNewThreat({...newThreat, impact: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none">
                      {impacts.map(i=><option key={i.val} value={i.val}>{i.val} - {i.label}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#12879f] hover:bg-[#0f6c7f] text-white font-bold py-3 rounded-lg mt-2 transition-all shadow-[0_0_15px_rgba(18,135,159,0.4)] flex justify-center items-center gap-2">
                  <Plus size={18} /> Save Threat to Matrix
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {(!plan.risks || plan.risks.length === 0) && (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 border-dashed text-slate-500">
                No threats identified yet. {isAdmin && "Use the form above to add a threat."}
              </div>
            )}
            {(plan.risks || []).map((r: any) => {
              const level = getRiskLevel(r.score);
              return (
                <div key={r.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 hover:shadow-md transition-all group relative">
                  {isAdmin && (
                    <button onClick={() => removeRisk(r.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors z-20" title="Remove Threat">
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="p-5 border-b border-slate-100 flex justify-between items-start gap-4">
                    <div className="pr-8 w-full">
                      {isAdmin ? (
                        <input value={r.threat} onChange={e => updateRisk(r.id, 'threat', e.target.value)} className="font-extrabold text-slate-800 text-lg w-full border-b border-dashed border-slate-300 focus:border-spearfish outline-none bg-transparent" placeholder="Threat name..." />
                      ) : (
                        <h4 className="font-extrabold text-slate-800 text-lg group-hover:text-[var(--color-spearfish,rgb(18,135,159))] transition-colors leading-tight">{r.threat}</h4>
                      )}
                      
                      {isAdmin ? (
                        <div className="mt-2 mb-1">
                          <select value={r.factor || factors[0]} onChange={e => updateRisk(r.id, 'factor', e.target.value)} className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 outline-none focus:border-[var(--color-spearfish,rgb(18,135,159))]">
                            {factors.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                      ) : (
                        r.factor && (
                          <div className="mt-2 mb-1 flex items-center gap-1.5">
                             <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border shadow-sm ${getFactorColor(r.factor)}`}>
                               <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div> {r.factor}
                             </span>
                          </div>
                        )
                      )}

                      <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <strong className="text-slate-800 text-xs uppercase tracking-wider mb-1 block">Mitigation Strategy:</strong>
                        {isAdmin ? (
                          <textarea value={r.mitigation} onChange={e => updateRisk(r.id, 'mitigation', e.target.value)} className="w-full text-sm font-medium text-slate-600 bg-transparent border-b border-dashed border-slate-300 focus:border-[var(--color-spearfish,rgb(18,135,159))] outline-none min-h-[60px]" placeholder="Mitigation..." />
                        ) : (
                          <p className="text-sm font-medium text-slate-600 leading-relaxed">{r.mitigation}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 hidden sm:flex">
                      <span className={`text-[10px] font-black px-3 py-1 rounded shadow-sm ${level.color} text-white uppercase tracking-widest`}>
                        {level.label}
                      </span>
                      <span className="text-3xl font-black text-slate-800 mt-1">{r.score}</span>
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mt-0">Total Score</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-slate-100 bg-slate-50 sm:divide-x-0 sm:flex sm:gap-6 sm:px-5 sm:py-3 text-sm">
                    <div className="p-3 sm:p-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="uppercase text-[9px] tracking-widest text-slate-400 font-bold">Likelihood:</span>
                      {isAdmin ? (
                        <select value={r.likelihood} onChange={e => updateRisk(r.id, 'likelihood', Number(e.target.value))} className="font-bold text-slate-700 bg-transparent outline-none cursor-pointer border-b border-dashed border-slate-300">
                          {likelihoods.map(l => <option key={l.val} value={l.val}>{l.val} - {l.label}</option>)}
                        </select>
                      ) : (
                        <span className="font-bold text-slate-700">{r.likelihood} - {likelihoods.find(l=>l.val===r.likelihood)?.label}</span>
                      )}
                    </div>
                    <div className="p-3 sm:p-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="uppercase text-[9px] tracking-widest text-slate-400 font-bold">Impact:</span>
                      {isAdmin ? (
                        <select value={r.impact} onChange={e => updateRisk(r.id, 'impact', Number(e.target.value))} className="font-bold text-slate-700 bg-transparent outline-none cursor-pointer border-b border-dashed border-slate-300">
                          {impacts.map(i => <option key={i.val} value={i.val}>{i.val} - {i.label}</option>)}
                        </select>
                      ) : (
                        <span className="font-bold text-slate-700">{r.impact} - {impacts.find(i=>i.val===r.impact)?.label}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
