"use client";
import React, { useState } from 'react';
import { UploadCloud, Download, Trash2, Calendar, FileType } from 'lucide-react';

interface Report {
  id: number;
  name: string;
  date: string;
  size: string;
  author: string;
  file?: File;
}

export default function DailyReports() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [reports, setReports] = useState<Report[]>([
    { id: 1, name: "DSR – 24 MAR 2026", date: "24 Mar 2026", size: "2.4 MB", author: "Intelligence Team" },
    { id: 2, name: "DSR – 23 MAR 2026", date: "23 Mar 2026", size: "1.8 MB", author: "Intelligence Team" },
    { id: 3, name: "DSR – 22 MAR 2026", date: "22 Mar 2026", size: "2.1 MB", author: "Intelligence Team" },
  ]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file && file.type === 'application/pdf') {
      setUploading(true);
      setTimeout(() => {
        setReports(prev => [{
          id: Date.now(),
          name: file.name.replace('.pdf', ''),
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
          size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
          author: 'Current User',
          file, // store actual file reference for download
        }, ...prev]);
        setUploading(false);
      }, 1500);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  // ✅ Fixed: actually deletes the report from state
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this report?')) {
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  // ✅ Fixed: downloads the file if available, otherwise shows message
  const handleDownload = (report: Report) => {
    if (report.file) {
      const url = URL.createObjectURL(report.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = report.name + '.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      alert('Download not available for pre-loaded reports. Upload a real PDF to enable downloads.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex flex-row items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Daily Situation Reports</h1>
            <span className="bg-emerald-100 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-md uppercase tracking-wide">Free Feature</span>
          </div>
          <p className="text-slate-500 mt-1">Upload and manage daily PDF intelligence briefings.</p>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:bg-slate-50'
        }`}
      >
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <UploadCloud size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Upload Daily Report (PDF)</h3>
        <p className="text-sm text-slate-500 mb-6 text-center max-w-sm">
          Drag and drop your PDF report here, or click to browse files.
        </p>

        <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 relative overflow-hidden shadow-sm">
          {uploading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            <>
              Browse Files
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFile(e.target.files[0]);
                    e.target.value = ''; // reset so same file can be re-uploaded
                  }
                }}
              />
            </>
          )}
        </label>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 className="font-semibold text-slate-800">Recent Uploads</h2>
          <span className="text-xs text-slate-400 font-medium">{reports.length} report{reports.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="divide-y divide-slate-100">
          {reports.length === 0 && (
            <div className="p-12 text-center text-slate-400 font-medium">
              No reports uploaded yet.
            </div>
          )}
          {reports.map((report) => (
            <div key={report.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center shrink-0">
                  <FileType size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {report.name}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {report.date}</span>
                    <span>&bull; {report.size}</span>
                    <span>&bull; Uploaded by {report.author}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* ✅ Download now works for uploaded files */}
                <button
                  onClick={() => handleDownload(report)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Download PDF"
                >
                  <Download size={18} />
                </button>
                {/* ✅ Delete now actually removes from list */}
                <button
                  onClick={() => handleDelete(report.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
