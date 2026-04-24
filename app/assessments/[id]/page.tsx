"use client";
import React, { useState, useEffect } from 'react';
import { Plus, ShieldAlert, Activity, MapPin, X, Save, Trash2, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AssessmentDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(true);
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [openSummary, setOpenSummary] = useState(true);
  const [openRegions, setOpenRegions] = useState(true);
  const [openMatrix, setOpenMatrix] = useState(true);
  const [openDeepDive, setOpenDeepDive] = useState(true);

  const [newRegion, setNewRegion] = useState('');
  const [newThreat, setNewThreat] = useState({
    factor: 'Travel and Transportation',
    impact: 3,
    probability: 3,
    threatDescription: '',
    mitigation: ''
  });

  const factors = [
    "Travel and Transportation",
    "Environment and Infrastructure",
    "Detention and Kidnap",
    "Political Violence and Terrorism",
    "Social Unrest and Protests",
    "Crime and Lawlessness",
    "Medical and Health",
    "Cyber Crimes",
    "Other"
  ];

  useEffect(() => {
    fetch(`/api/country-assessments/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setAssessment(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Assessment detail fetch error:', err);
        router.push('/assessments');
      });
  }, [params.id, router]);

  const saveAssessment = async (data: any) => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/country-assessments/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const updated = await res.json();
      setAssessment(updated);
    } catch (e: any) {
      console.error('Save assessment error:', e);
      setSaveError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldUpdate = (field: string, value: any) => {
    if (!isAdmin) return;
    setAssessment((prev: any) => ({ ...prev, [field]: value }));
  };

  const addRegion = () => {
    if (!isAdmin || !newRegion.trim()) return;
    const updatedRegions = [...(assessment.regions || []), newRegion.trim()];
    setAssessment((prev: any) => ({ ...prev, regions: updatedRegions }));
    setNewRegion('');
  };

  const removeRegion = (idx: number) => {
    if (!isAdmin) return;
    const updatedRegions = [...assessment.regions];
    updatedRegions.splice(idx, 1);
    setAssessment((prev: any) => ({ ...prev, regions: updatedRegions }));
  };

  const addThreatToMatrix = () => {
    if (!isAdmin) return;
    const score = newThreat.impact * newThreat.probability;
    let rating = 'Low';
    if (score >= 15) rating = 'Extreme';
    else if (score >= 10) rating = 'High';
    else if (score >= 5) rating = 'Medium';

    const matrixItem = { id: Date.now(), ...newThreat, score, rating };
    setAssessment((prev: any) => ({ ...prev, matrix: [...(prev.matrix || []), matrixItem] }));
    setNewThreat({ factor: factors[0], impact: 3, probability: 3, threatDescription: '', mitigation: '' });
  };

  const updateMatrixItem = (id: number, field: string, value: any) => {
    if (!isAdmin) return;
    setAssessment((prev: any) => ({
      ...prev,
      matrix: (prev.matrix || []).map((m: any) => {
        if (m.id !== id) return m;
        const newM = { ...m, [field]: value };
        newM.score = newM.impact * newM.probability;
        if (newM.score >= 15) newM.rating = 'Extreme';
        else if (newM.score >= 10) newM.rating = 'High';
        else if (newM.score >= 5) newM.rating = 'Medium';
        else newM.rating = 'Low';
        return newM;
      })
    }));
  };

  const removeMatrixItem = (id: number) => {
    if (!isAdmin) return;
    setAssessment((prev: any) => ({
      ...prev,
      matrix: (prev.matrix || []).filter((m: any) => m.id !== id)
    }));
  };

  const getRatingColor = (rating: string) => {
    const r = (rating || '').toUpperCase();
    if (r === 'CRITICAL' || r === 'EXTREME') return 'bg-black text-white';
    if (r === 'HIGH') return 'bg-red-500 text-white';
    if (r === 'MEDIUM') return 'bg-amber-500 text-amber-950';
    if (r === 'LOW') return 'bg-green-500 text-white';
    return 'bg-slate-300 text-slate-700';
  };

  if (loading || !assessment) return (
    <div className="p-12 text-center font-bold text-slate-500 animate-pulse">
      Loading Assessment Details...
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 pb-24">
      {/* Header */}
      <div className="pt-4 pb-2 flex justify-between items-center flex-wrap gap-3">
        <Link href="/assessments" className="text-blue-600 hover:underline font-bold text-sm flex items-center gap-2">
          <ArrowLeft size={16} /> Back: Country Assessments
        </Link>
        <div className="flex gap-2 items-center flex-wrap">
          {saveError && (
            <span className="text-xs text-red-500 font-bold">{saveError}</span>
          )}
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className={`px-3 py-1.5 text-xs font-bold uppercase rounded ${isAdmin ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-600'}`}
          >
            {isAdmin ? 'Admin View Active' : 'Client View Active'}
          </button>
          {isAdmin && (
            <button
              onClick={() => saveAssessment(assessment)}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-sm font-bold rounded shadow disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Assessment'}
            </button>
          )}
        </div>
      </div>

      {/* Country Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Assessment ID: {assessment.id}</p>
            {isAdmin ? (
              <input
                value={assessment.country}
                onChange={e => handleFieldUpdate('country', e.target.value)}
                className="text-4xl font-black text-slate-800 bg-transparent border-b-2 border-dashed border-slate-300 outline-none focus:border-blue-500 w-full mb-2"
              />
            ) : (
              <h1 className="text-4xl font-black text-slate-800 mb-2">{assessment.country}</h1>
            )}
            <p className="text-slate-500 text-sm font-medium">Created by: {assessment.createdBy}</p>
          </div>

          <div className="flex flex-col gap-4 min-w-[200px]">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Risk Rating</label>
              {isAdmin ? (
                <select
                  value={assessment.riskRating}
                  onChange={e => handleFieldUpdate('riskRating', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-blue-500"
                >
                  {['LOW', 'MEDIUM', 'HIGH', 'EXTREME', 'CRITICAL'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              ) : (
                <span className={`px-3 py-1.5 text-xs uppercase font-black tracking-widest rounded shadow-sm ${getRatingColor(assessment.riskRating)}`}>
                  {assessment.riskRating}
                </span>
              )}
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Risk Level (0-100)</label>
              {isAdmin ? (
                <input
                  type="number" min="0" max="100"
                  value={assessment.riskLevel}
                  onChange={e => handleFieldUpdate('riskLevel', Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-blue-500"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${assessment.riskLevel}%` }}></div>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{assessment.riskLevel}</span>
                </div>
              )}
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Status</label>
              {isAdmin ? (
                <select
                  value={assessment.status}
                  onChange={e => handleFieldUpdate('status', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-blue-500"
                >
                  {['DRAFT', 'UNDER REVIEW', 'APPROVED'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                  {assessment.status}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary Accordion */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <button
          onClick={() => setOpenSummary(!openSummary)}
          className="w-full flex justify-between items-center p-5 bg-slate-50 border-b border-slate-200 hover:bg-slate-100 transition-colors"
        >
          <h3 className="font-bold text-slate-800 text-lg">Executive Summary</h3>
          {openSummary ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
        </button>
        {openSummary && (
          <div className="p-6">
            {isAdmin ? (
              <textarea
                value={assessment.summary}
                onChange={e => handleFieldUpdate('summary', e.target.value)}
                className="w-full min-h-[150px] p-4 text-slate-700 bg-slate-50 border border-slate-300 rounded outline-none focus:border-blue-500 leading-relaxed font-medium"
                placeholder="Detailed intelligence summary..."
              />
            ) : (
              <p className="text-slate-700 leading-relaxed font-medium">{assessment.summary}</p>
            )}
          </div>
        )}
      </div>

      {/* Regions Accordion */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <button
          onClick={() => setOpenRegions(!openRegions)}
          className="w-full flex justify-between items-center p-5 bg-slate-50 border-b border-slate-200 hover:bg-slate-100 transition-colors"
        >
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <MapPin size={20} className="text-blue-500" /> Specific Regions
          </h3>
          {openRegions ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
        </button>
        {openRegions && (
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              {(assessment.regions || []).map((region: string, idx: number) => (
                <div key={idx} className="bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200 font-medium text-sm flex items-center gap-2">
                  {region}
                  {isAdmin && (
                    <button onClick={() => removeRegion(idx)} className="text-blue-400 hover:text-red-500">
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              {(!assessment.regions || assessment.regions.length === 0) && (
                <p className="text-slate-400 text-sm">No regions specified.</p>
              )}
            </div>
            {isAdmin && (
              <div className="flex gap-2 w-full max-w-sm mt-4">
                <input
                  value={newRegion}
                  onChange={e => setNewRegion(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addRegion()}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="Add region (e.g., Kabul)"
                />
                <button
                  onClick={addRegion}
                  className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-900 transition-colors"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Risk Matrix Accordion */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <button
          onClick={() => setOpenMatrix(!openMatrix)}
          className="w-full flex justify-between items-center p-5 bg-slate-50 border-b border-slate-200 hover:bg-slate-100 transition-colors"
        >
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Activity size={20} className="text-teal-600" /> Risk Matrix Overview
          </h3>
          {openMatrix ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
        </button>
        {openMatrix && (
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-100/50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4">Threat Scenario</th>
                  <th className="px-6 py-4 text-center">Impact (1-5)</th>
                  <th className="px-6 py-4 text-center">Probability (1-5)</th>
                  <th className="px-6 py-4 text-right">Risk Rating</th>
                  {isAdmin && <th className="px-6 py-4"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(assessment.matrix || []).map((m: any) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {isAdmin ? (
                        <select
                          value={m.factor}
                          onChange={e => updateMatrixItem(m.id, 'factor', e.target.value)}
                          className="w-full bg-transparent border-b border-dashed border-slate-300 outline-none"
                        >
                          {factors.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      ) : m.factor}
                    </td>
                    <td className="px-6 py-4 text-center font-mono">
                      {isAdmin ? (
                        <input
                          type="number" min="1" max="5"
                          value={m.impact}
                          onChange={e => updateMatrixItem(m.id, 'impact', Number(e.target.value))}
                          className="w-12 text-center border-b border-slate-300 outline-none bg-transparent"
                        />
                      ) : m.impact}
                    </td>
                    <td className="px-6 py-4 text-center font-mono">
                      {isAdmin ? (
                        <input
                          type="number" min="1" max="5"
                          value={m.probability}
                          onChange={e => updateMatrixItem(m.id, 'probability', Number(e.target.value))}
                          className="w-12 text-center border-b border-slate-300 outline-none bg-transparent"
                        />
                      ) : m.probability}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2.5 py-1 text-[10px] uppercase font-black tracking-widest rounded shadow-sm ${getRatingColor(m.rating)}`}>
                        {m.rating}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => removeMatrixItem(m.id)} className="text-slate-300 hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {(!assessment.matrix || assessment.matrix.length === 0) && (
                  <tr>
                    <td colSpan={isAdmin ? 5 : 4} className="px-6 py-8 text-center text-slate-400">
                      No threat scenarios modeled.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {isAdmin && (
              <div className="p-6 bg-slate-50 border-t border-slate-200">
                <button
                  onClick={addThreatToMatrix}
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Plus size={16} /> Add Threat Scenario
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Deep Dive Accordion */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <button
          onClick={() => setOpenDeepDive(!openDeepDive)}
          className="w-full flex justify-between items-center p-5 bg-slate-50 border-b border-slate-200 hover:bg-slate-100 transition-colors"
        >
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <ShieldAlert size={20} className="text-red-500" /> Deep Dive Risk Assessments
          </h3>
          {openDeepDive ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
        </button>
        {openDeepDive && (
          <div className="divide-y divide-slate-100">
            {(assessment.matrix || []).map((m: any) => (
              <div key={`deep-${m.id}`} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`w-3 h-3 rounded-full ${getRatingColor(m.rating).split(' ')[0]}`}></span>
                  <h4 className="text-lg font-black text-slate-800">{m.factor}</h4>
                </div>
                <div className="space-y-4 pl-6 border-l-2 border-slate-100 ml-1.5">
                  <div>
                    <strong className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1">
                      Intelligence / Threat Description
                    </strong>
                    {isAdmin ? (
                      <textarea
                        value={m.threatDescription}
                        onChange={e => updateMatrixItem(m.id, 'threatDescription', e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded outline-none focus:border-blue-500 text-sm text-slate-700 min-h-[80px]"
                        placeholder="Analyze the threat landscape..."
                      />
                    ) : (
                      <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg">
                        {m.threatDescription || 'No intelligence provided.'}
                      </p>
                    )}
                  </div>
                  <div>
                    <strong className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1">
                      Mitigation Measures
                    </strong>
                    {isAdmin ? (
                      <textarea
                        value={m.mitigation}
                        onChange={e => updateMatrixItem(m.id, 'mitigation', e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded outline-none focus:border-blue-500 text-sm text-slate-700 min-h-[80px]"
                        placeholder="Define protocol to minimize risk..."
                      />
                    ) : (
                      <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border-l-4 border-blue-500">
                        {m.mitigation || 'No mitigation mapped.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {(!assessment.matrix || assessment.matrix.length === 0) && (
              <div className="p-12 text-center text-slate-400 font-medium">
                Add threat scenarios to the matrix to write deep dive reports.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
