"use client";
import React, { useState, useEffect } from 'react';
import { Plus, ShieldAlert, Activity, Users, Calendar, MapPin, Printer, X, FilePlus, Save, Trash2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TravelPlanDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<'admin' | 'client'>('admin');
  const [showAddForm, setShowAddForm] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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

  const likelihoods = [
    { val: 5, label: "Almost Certain" },
    { val: 4, label: "Likely" },
    { val: 3, label: "Possible" },
    { val: 2, label: "Unlikely" },
    { val: 1, label: "Rare" }
  ];

  const impacts = [
    { val: 1, label: "Negligible" },
    { val: 2, label: "Minor" },
    { val: 3, label: "Moderate" },
    { val: 4, label: "Major" },
    { val: 5, label: "Critical" }
  ];

  const [newThreat, setNewThreat] = useState({
    threat: '', factor: factors[0], mitigation: '', likelihood: 3, impact: 3
  });
  const [customFactor, setCustomFactor] = useState('');
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isAdmin = userRole === 'admin';

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
    setSaveError(null);
    try {
      const res = await fetch(`/api/travel-plans/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlan)
      });
      // ✅ Fixed: was missing res.ok check — failed saves were silent
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setPlan(data);
    } catch (e: any) {
      console.error('Save plan error:', e);
      setSaveError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this travel plan?')) return;
    try {
      const res = await fetch(`/api/travel-plans/${params.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      router.push('/travel-plans');
    } catch (e) {
      alert('Failed to delete travel plan.');
    }
  };

  const handleFieldUpdate = (field: string, value: string) => {
    if (!isAdmin) return;
    // ✅ Fixed: use functional updater to avoid stale state
    setPlan((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateRisk = (id: number, field: string, value: any) => {
    if (!isAdmin) return;
    setPlan((prev: any) => ({
      ...prev,
      risks: (prev.risks || []).map((r: any) => {
        if (r.id !== id) return r;
        const newR = { ...r, [field]: value };
        newR.score = newR.likelihood * newR.impact;
        return newR;
      })
    }));
  };

  const getRiskLevel = (score: number) => {
    if (score >= 15) return { label: 'EXTREME', color: 'bg-red-600', text: 'text-red-700', bgLt: 'bg-red-100' };
    if (score >= 10) return { label: 'HIGH', color: 'bg-orange-500', text: 'text-orange-700', bgLt: 'bg-orange-100' };
    if (score >= 5) return { label: 'MEDIUM', color: 'bg-amber-400', text: 'text-amber-700', bgLt: 'bg-amber-100' };
    return { label: 'LOW', color: 'bg-green-500', text: 'text-green-700', bgLt: 'bg-green-100' };
  };

  const handleAddRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (newThreat.threat.trim() === '') return;
    const score = newThreat.likelihood * newThreat.impact;
    const finalFactor = newThreat.factor === "Other / Custom" && customFactor.trim()
      ? customFactor.trim()
      : newThreat.factor;
    const updatedPlan = {
      ...plan,
      risks: [...(plan.risks || []), { id: Date.now(), ...newThreat, factor: finalFactor, score }]
    };
    savePlan(updatedPlan);
    setNewThreat({ threat: '', factor: factors[0], mitigation: '', likelihood: 3, impact: 3 });
    setCustomFactor('');
    setShowAddForm(false);
  };

  const removeRisk = (id: number) => {
    if (!confirm('Remove this threat?')) return;
    const updatedPlan = { ...plan, risks: (plan.risks || []).filter((r: any) => r.id !== id) };
    savePlan(updatedPlan);
  };

  const getCellClasses = (l: number, i: number) => {
    const s = l * i;
    if (s >= 15) return 'bg-red-500 hover:bg-red-400 text-white';
    if (s >= 10) return 'bg-orange-500 hover:bg-orange-400 text-white';
    if (s >= 5) return 'bg-amber-400 hover:bg-amber-300 text-amber-950';
    return 'bg-green-500 hover:bg-green-400 text-white';
  };

  const getFactorColor = (factorStr: string) => {
    if (!factorStr) return 'bg-slate-100 text-slate-700 border-slate-200';
    const colors = [
      'bg-blue-100 text-blue-700 border-blue-200',
      'bg-indigo-100 text-indigo-700 border-indigo-200',
      'bg-purple-100 text-purple-700 border-purple-200',
      'bg-rose-100 text-rose-700 border-rose-200',
      'bg-orange-100 text-orange-700 border-orange-200',
      'bg-red-100 text-red-700 border-red-200',
      'bg-teal-100 text-teal-700 border-teal-200',
      'bg-cyan-100 text-cyan-700 border-cyan-200',
    ];
    let hash = 0;
    for (let i = 0; i < factorStr.length; i++) hash = factorStr.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading || !plan) return (
    <div className="p-12 text-center font-bold text-slate-500 animate-pulse">
      Loading Travel Plan...
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 pb-24 space-y-6">

      {/* Header */}
      <div className="pt-4 flex justify-between items-center flex-wrap gap-3">
        <Link href="/travel-plans" className="text-blue-600 hover:underline font-bold text-sm flex items-center gap-2">
          <ArrowLeft size={16} /> Back: Travel Plans
        </Link>
        <div className="flex gap-2 items-center flex-wrap">
          {saveError && (
            <span className="text-xs text-red-500 font-bold">{saveError}</span>
          )}
          <button
            onClick={() => setUserRole(userRole === 'admin' ? 'client' : 'admin')}
            className={`px-3 py-1.5 text-xs font-bold uppercase rounded transition-colors ${
              isAdmin ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-600'
            }`}
          >
            {isAdmin ? 'Admin View' : 'Client View'}
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => savePlan(plan)}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-1.5 text-sm font-bold rounded shadow flex items-center gap-2"
              >
                <Save size={16} /> {saving ? 'Saving...' : 'Save Plan'}
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 text-sm font-bold rounded border border-red-200 flex items-center gap-2"
              >
                <Trash2 size={16} /> Delete
              </button>
              <button
                onClick={() => window.print()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 text-sm font-bold rounded flex items-center gap-2"
              >
                <Printer size={16} /> Print
              </button>
            </>
          )}
        </div>
      </div>

      {/* Plan Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1 space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plan ID: {plan.id}</p>
            {isAdmin ? (
              <input
                value={plan.name}
                onChange={e => handleFieldUpdate('name', e.target.value)}
                className="text-3xl font-black text-slate-800 bg-transparent border-b-2 border-dashed border-slate-300 outline-none focus:border-blue-500 w-full"
              />
            ) : (
              <h1 className="text-3xl font-black text-slate-800">{plan.name}</h1>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin size={18} className="text-spearfish shrink-0" />
                {isAdmin ? (
                  <input value={plan.location} onChange={e => handleFieldUpdate('location', e.target.value)}
                    className="font-medium bg-transparent border-b border-dashed border-slate-300 outline-none focus:border-blue-500 w-full" />
                ) : (
                  <span className="font-medium">{plan.location}</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Calendar size={18} className="text-blue-500 shrink-0" />
                {isAdmin ? (
                  <input value={plan.dates} onChange={e => handleFieldUpdate('dates', e.target.value)}
                    className="font-medium bg-transparent border-b border-dashed border-slate-300 outline-none focus:border-blue-500 w-full" />
                ) : (
                  <span className="font-medium">{plan.dates}</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Users size={18} className="text-purple-500 shrink-0" />
                {isAdmin ? (
                  <input value={plan.travelers} onChange={e => handleFieldUpdate('travelers', e.target.value)}
                    className="font-medium bg-transparent border-b border-dashed border-slate-300 outline-none focus:border-blue-500 w-full" />
                ) : (
                  <span className="font-medium">{plan.travelers}</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <ShieldAlert size={18} className="text-red-500 shrink-0" />
                {isAdmin ? (
                  <select value={plan.riskStatus} onChange={e => handleFieldUpdate('riskStatus', e.target.value)}
                    className="font-medium bg-transparent border-b border-dashed border-slate-300 outline-none focus:border-blue-500">
                    {['LOW RISK', 'MEDIUM RISK', 'HIGH RISK', 'EXTREME RISK', 'PENDING ASSESSMENT'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  <span className="font-bold text-red-600">{plan.riskStatus}</span>
                )}
              </div>
            </div>
          </div>

          {/* Risk Matrix Preview */}
          <div className="shrink-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">Risk Matrix</p>
            <div className="grid gap-0.5" style={{ gridTemplateColumns: 'auto repeat(5, 1fr)' }}>
              <div className="w-6"></div>
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-7 h-5 text-[8px] font-bold text-slate-400 flex items-center justify-center">{i}</div>
              ))}
              {[5,4,3,2,1].map(l => (
                <React.Fragment key={l}>
                  <div className="w-6 h-7 text-[8px] font-bold text-slate-400 flex items-center justify-center">{l}</div>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`w-7 h-7 rounded-sm text-[8px] font-bold flex items-center justify-center transition-colors ${getCellClasses(l, i)}`}>
                      {l*i}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between text-[8px] text-slate-400 mt-1 font-bold uppercase tracking-wider">
              <span>↑ Likelihood</span><span>Impact →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Threat Register */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Activity size={22} className="text-spearfish" /> Threat Register
            <span className="text-sm font-bold text-slate-400 ml-1">({plan.risks?.length || 0} threats)</span>
          </h2>
          {isAdmin ? (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 transition-all ${
                showAddForm
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  : 'bg-slate-800 text-white hover:bg-slate-900'
              }`}
            >
              {showAddForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Threat</>}
            </button>
          ) : (
            <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-3 py-1.5 rounded-md uppercase tracking-widest border border-slate-200">
              Client Read-Only
            </span>
          )}
        </div>

        {/* Add Threat Form */}
        {isAdmin && showAddForm && (
          <form onSubmit={handleAddRisk} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl text-white">
            <h3 className="font-bold text-lg mb-4">Add New Threat Assessment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Identified Threat</label>
                <input
                  required type="text" value={newThreat.threat}
                  onChange={e => setNewThreat({ ...newThreat, threat: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-blue-400"
                  placeholder="e.g., Unexploded Ordnance (UXO)"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Risk Factor Category</label>
                <select
                  value={newThreat.factor}
                  onChange={e => setNewThreat({ ...newThreat, factor: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none"
                >
                  {factors.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                {newThreat.factor === "Other / Custom" && (
                  <input
                    type="text" value={customFactor}
                    onChange={e => setCustomFactor(e.target.value)}
                    className="w-full bg-slate-800 border-b border-blue-400 px-4 py-2 text-white mt-3 outline-none text-sm"
                    placeholder="Specify custom factor..." autoFocus
                  />
                )}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Mitigation Strategy</label>
                <textarea
                  required value={newThreat.mitigation}
                  onChange={e => setNewThreat({ ...newThreat, mitigation: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none min-h-[80px]"
                  placeholder="e.g., Remain on paved roads. Engage local guide."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Likelihood (1-5)</label>
                  <select
                    value={newThreat.likelihood}
                    onChange={e => setNewThreat({ ...newThreat, likelihood: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none"
                  >
                    {likelihoods.map(l => <option key={l.val} value={l.val}>{l.val} - {l.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Impact (1-5)</label>
                  <select
                    value={newThreat.impact}
                    onChange={e => setNewThreat({ ...newThreat, impact: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none"
                  >
                    {impacts.map(i => <option key={i.val} value={i.val}>{i.val} - {i.label}</option>)}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-spearfish hover:bg-[#0f6c7f] text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2"
              >
                <Plus size={18} /> Save Threat to Matrix
              </button>
            </div>
          </form>
        )}

        {/* Threats List */}
        {(!plan.risks || plan.risks.length === 0) && (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 border-dashed text-slate-500">
            No threats identified yet. {isAdmin && 'Use the form above to add a threat.'}
          </div>
        )}

        {(plan.risks || []).map((r: any) => {
          const level = getRiskLevel(r.score);
          return (
            <div key={r.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all relative group">
              {isAdmin && (
                <button
                  onClick={() => removeRisk(r.id)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors z-20"
                  title="Remove Threat"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <div className="p-5 border-b border-slate-100 flex justify-between items-start gap-4">
                <div className="pr-8 w-full">
                  {isAdmin ? (
                    <input
                      value={r.threat}
                      onChange={e => updateRisk(r.id, 'threat', e.target.value)}
                      className="font-extrabold text-slate-800 text-lg w-full border-b border-dashed border-slate-300 focus:border-blue-500 outline-none bg-transparent"
                    />
                  ) : (
                    <h4 className="font-extrabold text-slate-800 text-lg leading-tight">{r.threat}</h4>
                  )}

                  {isAdmin ? (
                    <div className="mt-2">
                      <select
                        value={r.factor || factors[0]}
                        onChange={e => updateRisk(r.id, 'factor', e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 outline-none"
                      >
                        {factors.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  ) : r.factor && (
                    <div className="mt-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border shadow-sm ${getFactorColor(r.factor)}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div> {r.factor}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <strong className="text-slate-800 text-xs uppercase tracking-wider mb-1 block">Mitigation Strategy:</strong>
                    {isAdmin ? (
                      <textarea
                        value={r.mitigation}
                        onChange={e => updateRisk(r.id, 'mitigation', e.target.value)}
                        className="w-full text-sm font-medium text-slate-600 bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 outline-none min-h-[60px]"
                      />
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
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Total Score</span>
                </div>
              </div>

              <div className="grid grid-cols-2 divide-x divide-slate-100 bg-slate-50 sm:flex sm:gap-6 sm:px-5 sm:py-3 text-sm">
                <div className="p-3 sm:p-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="uppercase text-[9px] tracking-widest text-slate-400 font-bold">Likelihood:</span>
                  {isAdmin ? (
                    <select
                      value={r.likelihood}
                      onChange={e => updateRisk(r.id, 'likelihood', Number(e.target.value))}
                      className="font-bold text-slate-700 bg-transparent outline-none border-b border-dashed border-slate-300"
                    >
                      {likelihoods.map(l => <option key={l.val} value={l.val}>{l.val} - {l.label}</option>)}
                    </select>
                  ) : (
                    <span className="font-bold text-slate-700">{r.likelihood} - {likelihoods.find(l => l.val === r.likelihood)?.label}</span>
                  )}
                </div>
                <div className="p-3 sm:p-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="uppercase text-[9px] tracking-widest text-slate-400 font-bold">Impact:</span>
                  {isAdmin ? (
                    <select
                      value={r.impact}
                      onChange={e => updateRisk(r.id, 'impact', Number(e.target.value))}
                      className="font-bold text-slate-700 bg-transparent outline-none border-b border-dashed border-slate-300"
                    >
                      {impacts.map(i => <option key={i.val} value={i.val}>{i.val} - {i.label}</option>)}
                    </select>
                  ) : (
                    <span className="font-bold text-slate-700">{r.impact} - {impacts.find(i => i.val === r.impact)?.label}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
