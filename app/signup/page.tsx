"use client";
import { useState } from 'react';
import { Radar, Eye, EyeOff, ShieldAlert, Globe2, ArrowRight, Lock, CheckCircle2, Building2, User, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ROLES = ['Security Analyst', 'Risk Manager', 'Field Operator', 'Executive / C-Suite', 'IT Administrator', 'Other'];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    role: '',
    password: '',
    confirm: '',
    agree: false,
  });
  const [error, setError] = useState('');

  const update = (field: string, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.firstName || !form.lastName || !form.email || !form.organization || !form.role) {
      setError('Please fill in all fields.');
      return;
    }
    setStep(2);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!form.agree) {
      setError('You must agree to the terms to continue.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setDone(true);
  };

  const passwordStrength = (pw: string) => {
    if (!pw) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score, label: 'Moderate', color: 'bg-amber-500' };
    return { score, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = passwordStrength(form.password);

  if (done) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none flex items-center justify-center">
          <Globe2 size={800} strokeWidth={0.3} className="text-white" />
        </div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#12879f] rounded-full mix-blend-screen filter blur-[160px] opacity-10 pointer-events-none" />

        <div className="text-center max-w-md relative z-10">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <CheckCircle2 size={40} className="text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Access Requested</h2>
          <p className="text-slate-400 font-medium leading-relaxed mb-8">
            Your account request has been submitted. Our security team will review and activate your access within <strong className="text-white">24–48 hours</strong>.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-left mb-8 space-y-3">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Submitted Details</p>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Name</span>
              <span className="text-white font-bold">{form.firstName} {form.lastName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Email</span>
              <span className="text-white font-bold">{form.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Organization</span>
              <span className="text-white font-bold">{form.organization}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Role</span>
              <span className="text-white font-bold">{form.role}</span>
            </div>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-[#12879f] hover:bg-[#0f6c7f] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(18,135,159,0.3)]"
          >
            Back to Sign In <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex overflow-hidden relative">

      {/* Background effects */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#12879f] rounded-full mix-blend-screen filter blur-[140px] opacity-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600 rounded-full mix-blend-screen filter blur-[140px] opacity-10 animate-pulse pointer-events-none" style={{ animationDelay: '3s' }} />
      <div className="absolute bottom-[-100px] left-[-100px] opacity-[0.04] pointer-events-none select-none">
        <Globe2 size={600} strokeWidth={0.4} className="text-white" />
      </div>

      {/* Left panel */}
      <div className="hidden lg:flex w-[44%] flex-col justify-between p-14 relative border-r border-white/5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#12879f] to-blue-800 text-white p-2.5 rounded-xl shadow-lg shadow-[#12879f]/30">
            <Radar strokeWidth={2.5} size={26} className="animate-[spin_4s_linear_infinite]" />
          </div>
          <div>
            <span className="text-white font-black text-2xl tracking-tighter leading-none block">RISK24</span>
            <span className="text-[9px] font-black bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent uppercase tracking-widest">PRO PLATFORM</span>
          </div>
        </div>

        <div className="max-w-sm space-y-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight leading-[1.1] mb-4">
              Join the<br />
              <span className="text-[#12879f]">Intelligence Network</span>
            </h1>
            <p className="text-slate-400 font-medium leading-relaxed">
              Trusted by security teams across 40+ countries. Get access to real-time threat intelligence and risk management tools.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              { icon: '🌍', title: 'Global Risk Map', desc: 'Live security events across 195 countries' },
              { icon: '⚡', title: 'Instant Alerts', desc: 'Real-time threat notifications & escalations' },
              { icon: '📊', title: 'Country Assessments', desc: 'Deep-dive intelligence reports on demand' },
              { icon: '🛡️', title: 'Travel Plan Security', desc: 'End-to-end journey risk management' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-4 p-4 bg-white/5 border border-white/8 rounded-xl backdrop-blur-sm">
                <span className="text-xl shrink-0 mt-0.5">{f.icon}</span>
                <div>
                  <p className="text-white font-bold text-sm">{f.title}</p>
                  <p className="text-slate-500 text-xs font-medium mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-xs font-medium">
          © 2026 Risk24 Intelligence Platform. All rights reserved.
        </p>
      </div>

      {/* Right panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-lg py-8">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="bg-gradient-to-br from-[#12879f] to-blue-800 text-white p-2 rounded-xl">
              <Radar strokeWidth={2.5} size={22} className="animate-[spin_4s_linear_infinite]" />
            </div>
            <span className="text-white font-black text-xl tracking-tighter">RISK24</span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  step === s
                    ? 'bg-[#12879f] text-white shadow-[0_0_15px_rgba(18,135,159,0.4)]'
                    : step > s
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/10 text-slate-500'
                }`}>
                  {step > s ? <CheckCircle2 size={16} /> : s}
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest ${step === s ? 'text-white' : 'text-slate-600'}`}>
                  {s === 1 ? 'Identity' : 'Security'}
                </span>
                {s < 2 && <div className={`w-12 h-px ${step > 1 ? 'bg-emerald-500' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">
              {step === 1 ? 'Create your account' : 'Secure your access'}
            </h2>
            <p className="text-slate-400 font-medium">
              {step === 1 ? 'Tell us about yourself and your organization.' : 'Set a strong password to protect your account.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
              <ShieldAlert size={16} className="text-red-400 shrink-0" />
              <p className="text-sm text-red-300 font-medium">{error}</p>
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">First Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input
                      required type="text" value={form.firstName}
                      onChange={e => update('firstName', e.target.value)}
                      placeholder="John"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-[#12879f] focus:ring-2 focus:ring-[#12879f]/20 transition-all font-medium text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Last Name</label>
                  <input
                    required type="text" value={form.lastName}
                    onChange={e => update('lastName', e.target.value)}
                    placeholder="Smith"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-[#12879f] focus:ring-2 focus:ring-[#12879f]/20 transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Work Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    required type="email" value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="john@organization.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-[#12879f] focus:ring-2 focus:ring-[#12879f]/20 transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Organization</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    required type="text" value={form.organization}
                    onChange={e => update('organization', e.target.value)}
                    placeholder="ACME Security Group"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-[#12879f] focus:ring-2 focus:ring-[#12879f]/20 transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Role</label>
                <select
                  required value={form.role}
                  onChange={e => update('role', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#12879f] focus:ring-2 focus:ring-[#12879f]/20 transition-all font-medium text-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-slate-900">Select your role...</option>
                  {ROLES.map(r => (
                    <option key={r} value={r} className="bg-slate-900">{r}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#12879f] hover:bg-[#0f6c7f] text-white font-black py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(18,135,159,0.3)] hover:shadow-[0_0_40px_rgba(18,135,159,0.5)] flex items-center justify-center gap-2 group mt-2"
              >
                Continue to Security Setup
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <input
                    required type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-slate-600 outline-none focus:border-[#12879f] focus:ring-2 focus:ring-[#12879f]/20 transition-all font-medium text-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Password strength */}
                {form.password && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength.score ? strength.color : 'bg-white/10'}`} />
                      ))}
                    </div>
                    <p className={`text-xs font-bold ${strength.score <= 1 ? 'text-red-400' : strength.score <= 3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {strength.label} password
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Confirm Password</label>
                <input
                  required type="password"
                  value={form.confirm}
                  onChange={e => update('confirm', e.target.value)}
                  placeholder="Repeat your password"
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:ring-2 transition-all font-medium text-sm ${
                    form.confirm && form.confirm !== form.password
                      ? 'border-red-500/50 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-white/10 focus:border-[#12879f] focus:ring-[#12879f]/20'
                  }`}
                />
                {form.confirm && form.confirm !== form.password && (
                  <p className="text-xs text-red-400 font-bold mt-1.5">Passwords do not match</p>
                )}
              </div>

              {/* Terms */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agree"
                  checked={form.agree}
                  onChange={e => update('agree', e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 accent-[#12879f] cursor-pointer shrink-0"
                />
                <label htmlFor="agree" className="text-sm text-slate-400 font-medium cursor-pointer leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-[#12879f] hover:underline font-bold">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-[#12879f] hover:underline font-bold">Privacy Policy</a>.
                  I understand this platform handles sensitive intelligence data.
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(''); }}
                  className="px-6 py-4 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 font-bold transition-all text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#12879f] hover:bg-[#0f6c7f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(18,135,159,0.3)] hover:shadow-[0_0_40px_rgba(18,135,159,0.5)] flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      Request Access
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-[#12879f] hover:text-[#0f6c7f] font-bold transition-colors">
                Sign In
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
