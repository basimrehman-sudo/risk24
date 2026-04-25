"use client";
import { useState } from 'react';
import { Radar, Eye, EyeOff, ShieldAlert, Globe2, ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Simulate auth — replace with real API call
    await new Promise(r => setTimeout(r, 1500));
    if (email && password) {
      router.push('/');
    } else {
      setError('Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex overflow-hidden relative">

      {/* Background globe watermark */}
      <div className="absolute bottom-[-100px] right-[-100px] opacity-[0.04] pointer-events-none select-none">
        <Globe2 size={700} strokeWidth={0.4} className="text-white" />
      </div>

      {/* Animated background glows */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#12879f] rounded-full mix-blend-screen filter blur-[140px] opacity-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600 rounded-full mix-blend-screen filter blur-[140px] opacity-10 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex w-[52%] flex-col justify-between p-14 relative border-r border-white/5">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#12879f] to-blue-800 text-white p-2.5 rounded-xl shadow-lg shadow-[#12879f]/30">
            <Radar strokeWidth={2.5} size={26} className="animate-[spin_4s_linear_infinite]" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black text-2xl tracking-tighter leading-none">RISK24</span>
            <span className="text-[9px] font-black bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent uppercase tracking-widest">PRO PLATFORM</span>
          </div>
        </div>

        {/* Main copy */}
        <div className="space-y-8 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold tracking-widest text-emerald-200 uppercase">System Active & Monitoring</span>
          </div>

          <div>
            <h1 className="text-5xl font-black text-white tracking-tight leading-[1.1] mb-4">
              Global Security<br />
              <span className="text-[#12879f]">Command Center</span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed font-medium">
              Real-time threat intelligence, AI-powered incident forecasting, and dedicated satellite telemetry streams — all in one platform.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '8.4k', label: 'Events Scanned' },
              { value: '14', label: 'High Risk Zones' },
              { value: '128', label: 'Active Travelers' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Recent alert */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
            <ShieldAlert size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black text-red-300 uppercase tracking-widest mb-1">Latest Alert</p>
              <p className="text-sm text-slate-300 font-medium leading-snug">IED Attack Prevented — Sibi, Balochistan. Security cordon in effect.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-slate-600 text-xs font-medium">
          © 2026 Risk24 Intelligence Platform. All rights reserved.
        </p>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="bg-gradient-to-br from-[#12879f] to-blue-800 text-white p-2 rounded-xl">
              <Radar strokeWidth={2.5} size={22} className="animate-[spin_4s_linear_infinite]" />
            </div>
            <span className="text-white font-black text-xl tracking-tighter">RISK24</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Welcome back</h2>
            <p className="text-slate-400 font-medium">Sign in to your secure dashboard</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
              <ShieldAlert size={16} className="text-red-400 shrink-0" />
              <p className="text-sm text-red-300 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="operator@risk24.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-[#12879f] focus:ring-2 focus:ring-[#12879f]/20 transition-all font-medium text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                <a href="#" className="text-xs text-[#12879f] hover:text-[#0f6c7f] font-bold transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-slate-600 outline-none focus:border-[#12879f] focus:ring-2 focus:ring-[#12879f]/20 transition-all font-medium text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#12879f] cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-slate-400 font-medium cursor-pointer">
                Keep me signed in for 30 days
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#12879f] hover:bg-[#0f6c7f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(18,135,159,0.3)] hover:shadow-[0_0_40px_rgba(18,135,159,0.5)] flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Sign In to Dashboard
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#12879f] hover:text-[#0f6c7f] font-bold transition-colors">
                Request Access
              </Link>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-slate-600 text-xs font-medium">
            <Lock size={12} />
            <span>256-bit encrypted · SOC2 compliant · Zero-trust architecture</span>
          </div>
        </div>
      </div>
    </div>
  );
}
