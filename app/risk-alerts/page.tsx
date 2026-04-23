'use client';

import React, { useState, useRef } from 'react';
import { Search, Eye, Plus, ArrowDownUp, Edit, Trash2, X, UploadCloud, ImageIcon } from 'lucide-react';

export default function RiskAlerts() {
  const [alerts, setAlerts] = useState<{ id: string; color: string; title: string; country: string; where: string; when: string; rsa: string; image: string | null; }[]>([
    { id: "RA-08327", color: "bg-orange-500", title: "WARNING:RN5 Security Escalation", country: "Democratic Republic of the Congo", where: "Biriba Village, Kabunambo-Runingu Axis (RN5)...", when: "25/03/2026", rsa: "Louison Malu Malu", image: null },
    { id: "RA-08326", color: "bg-orange-500", title: "WARNING: Military Counter-Insurgency Operations - Borno State", country: "Nigeria", where: "Borno State", when: "25/03/2026", rsa: "Jane Naankang", image: null },
    { id: "RA-08322", color: "bg-red-500", title: "IMMEDIATE ACTION: UAV Interceptions", country: "United Arab Emirates", where: "UAE", when: "25/03/2026", rsa: "Fida Hussain", image: null },
    { id: "RA-08320", color: "bg-green-500", title: "ADVISORY: Widespread Rainfall", country: "United Arab Emirates", where: "UAE", when: "25/03/2026", rsa: "Fida Hussain", image: null },
  ]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    color: "bg-orange-500",
    title: "",
    country: "",
    where: "",
    when: "",
    rsa: "",
    image: null as string | null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const colors = [
    { label: "Red (Immediate)", value: "bg-red-500" },
    { label: "Orange (Warning)", value: "bg-orange-500" },
    { label: "Green (Advisory)", value: "bg-green-500" },
    { label: "Blue (Info)", value: "bg-blue-500" },
  ];

  const handleOpenModal = (alert: any = null) => {
    if (alert) {
      setEditingId(alert.id);
      setFormData({ ...alert });
    } else {
      setEditingId(null);
      let dateString = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
      setFormData({
        color: "bg-orange-500",
        title: "",
        country: "",
        where: "",
        when: dateString,
        rsa: "",
        image: null
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setAlerts(alerts.map(a => a.id === editingId ? { ...formData, id: editingId } : a));
    } else {
      const newId = `RA-0${Math.floor(Math.random() * 10000 + 8000)}`;
      setAlerts([{ ...formData, id: newId }, ...alerts]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this alert?")) {
      setAlerts(alerts.filter(a => a.id !== id));
    }
  };

  const filteredAlerts = alerts.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.country.toLowerCase().includes(search.toLowerCase()) ||
    a.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 relative">
      <div className="py-5 px-8 flex justify-between items-center bg-white z-10 sticky top-0 border-b border-slate-200 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Risk Alerts</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => handleOpenModal()} 
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-all font-medium text-sm shadow-sm"
          >
            <Plus size={16} /> Create Risk Alert
          </button>
        </div>
      </div>

      <div className="flex-1 px-8 pb-8 flex flex-col pt-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2 w-72 bg-white focus-within:ring-2 focus-within:ring-slate-200 transition-all shadow-sm">
            <Search size={16} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search alerts..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm outline-none placeholder:text-slate-400 bg-transparent"
            />
          </div>
        </div>

        <div className="flex-1 w-full overflow-auto bg-white rounded-xl shadow-sm border border-slate-200 relative">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr className="text-slate-500 border-b border-slate-200">
                <th className="py-4 px-6 font-medium">ID</th>
                <th className="py-4 px-6 font-medium w-1/3">Title</th>
                <th className="py-4 px-6 font-medium">Country</th>
                <th className="py-4 px-6 font-medium w-1/4">Location</th>
                <th className="py-4 px-6 font-medium">Date</th>
                <th className="py-4 px-6 font-medium">RSA/Manager</th>
                <th className="py-4 px-6 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlerts.length > 0 ? filteredAlerts.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-6 text-slate-600 font-medium">{row.id}</td>
                  <td className="py-4 px-6 font-medium text-slate-800 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 shadow-sm ${row.color}`}></div>
                    <div className="flex flex-col">
                      <span className="truncate max-w-sm" title={row.title}>{row.title}</span>
                      {row.image && <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><ImageIcon size={12} className="opacity-70" /> Includes Image</span>}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    <span className="break-words whitespace-normal leading-snug">{row.country}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    <span className="truncate max-w-xs block" title={row.where}>{row.where}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{row.when}</td>
                  <td className="py-4 px-6 text-slate-600">{row.rsa}</td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(row)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 bg-white shadow-sm border border-slate-200 rounded-md transition-all"
                        title="Edit Alert"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(row.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 bg-white shadow-sm border border-slate-200 rounded-md transition-all"
                        title="Delete Alert"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan={7} className="py-12 text-center text-slate-500">
                     No risk alerts found. Adjust your search or create a new alert.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl animate-in slide-in-from-right flex flex-col border-l border-slate-200">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">{editingId ? 'Edit Risk Alert' : 'Create Risk Alert'}</h2>
              <button 
                onClick={closeModal} 
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
              <form id="alert-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Severity Level</label>
                  <div className="flex gap-2">
                    {colors.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: c.value })}
                        className={`flex-1 py-2 rounded-md text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                          formData.color === c.value 
                            ? 'border-slate-800 ring-1 ring-slate-800 bg-slate-800 text-white' 
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${formData.color === c.value ? 'bg-white' : c.value}`}></span>
                        {c.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Alert Title</label>
                  <input 
                    required
                    maxLength={100}
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all placeholder:text-slate-400 shadow-sm bg-slate-50/50"
                    placeholder="e.g. WARNING: Security Operations..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                    <input 
                      required
                      type="text" 
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all placeholder:text-slate-400 shadow-sm bg-slate-50/50"
                      placeholder="e.g. UAE"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location / Where</label>
                    <input 
                      required
                      type="text" 
                      value={formData.where}
                      onChange={(e) => setFormData({ ...formData, where: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all placeholder:text-slate-400 shadow-sm bg-slate-50/50"
                      placeholder="e.g. Dubai"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <input 
                      required
                      type="text" 
                      value={formData.when}
                      onChange={(e) => setFormData({ ...formData, when: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all placeholder:text-slate-400 shadow-sm bg-slate-50/50"
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Manager / RSA</label>
                    <input 
                      required
                      type="text" 
                      value={formData.rsa}
                      onChange={(e) => setFormData({ ...formData, rsa: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all placeholder:text-slate-400 shadow-sm bg-slate-50/50"
                      placeholder="Your Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Alert Media / Cover Image</label>
                  {formData.image ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-900 flex items-center justify-center h-48">
                       <img src={formData.image} alt="Alert image preview" className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-40" />
                       <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                         <button 
                           type="button" 
                           onClick={() => fileInputRef.current?.click()}
                           className="bg-white text-slate-800 px-4 py-2 rounded-lg text-sm font-medium shadow-xl hover:bg-slate-50 transition-colors"
                         >
                           Replace Media
                         </button>
                         <button 
                           type="button" 
                           onClick={handleRemoveImage}
                           className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-xl hover:bg-red-600 transition-colors"
                         >
                           Remove completely
                         </button>
                       </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 rounded-xl px-6 py-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-slate-800/30 hover:bg-slate-50 transition-all bg-white"
                    >
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 shadow-sm">
                        <UploadCloud size={24} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-800">Click to upload collateral</p>
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG or GIF up to 5MB</p>
                      </div>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3 shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)]">
              <button 
                type="button" 
                onClick={closeModal}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-transparent w-full"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="alert-form"
                className="px-5 py-2.5 text-sm font-medium bg-slate-800 text-white hover:bg-slate-700 rounded-lg transition-colors shadow-sm w-full"
              >
                {editingId ? 'Save Alert' : 'Publish Alert'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
