"use client";
import { Eye, Edit3, Plus, ShieldAlert } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Assessments() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch('/api/country-assessments')
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then(d => {
        setData(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Assessments fetch error:', err);
        setError('Failed to load assessments. Please try again.');
        setLoading(false);
      });
  }, []);

  const createNewAssessment = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/country-assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: 'New Country',
          status: 'DRAFT',
          riskRating: 'LOW',
          riskLevel: 0,
          createdBy: 'Admin',
          summary: 'Assessment summary pending...',
          regions: [],
          matrix: []
        })
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const newAssessment = await res.json();
      router.push(`/assessments/${newAssessment.id}`);
    } catch (err) {
      console.error('Create assessment error:', err);
      alert('Failed to create assessment. Check your API route.');
    } finally {
      setCreating(false);
    }
  };

  const getRatingColor = (rating: string) => {
    const r = (rating || '').toUpperCase();
    if (r === 'CRITICAL' || r === 'EXTREME') return 'bg-black text-white';
    if (r === 'HIGH') return 'bg-red-500 text-white';
    if (r === 'MEDIUM') return 'bg-amber-500 text-amber-950';
    if (r === 'LOW') return 'bg-green-500 text-white';
    return 'bg-slate-300 text-slate-700';
  };

  if (loading) return (
    <div className="p-12 text-center text-slate-500 font-bold animate-pulse">
      Loading Assessments...
    </div>
  );

  if (error) return (
    <div className="p-12 text-center">
      <p className="text-red-500 font-bold mb-4">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Country Assessments</h1>
          <p className="text-slate-500 mt-1">Manage and review intelligence risk ratings globally.</p>
        </div>
        <button
          onClick={createNewAssessment}
          disabled={creating}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 shadow-sm shrink-0"
        >
          <Plus size={18} /> {creating ? 'Creating...' : 'Create Assessment'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Country</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4">Risk Rating</th>
                <th className="px-6 py-4">Created By</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{row.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{row.country}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono font-medium">{row.riskLevel} / 100</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[10px] uppercase font-black tracking-widest rounded shadow-sm ${getRatingColor(row.riskRating)}`}>
                      {row.riskRating}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{row.createdBy}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                      row.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/assessments/${row.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-bold"
                      >
                        <Edit3 size={16} /> Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">No assessments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
