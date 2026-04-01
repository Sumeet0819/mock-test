import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAdmin } from '../../../redux/slices/adminSlice';
import api from '../../../lib/axios';
import { Lock, Mail, ArrowRight, Loader2, ChevronLeft, KeyRound } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('All fields are required'); return; }
    setLoading(true); setError('');
    try {
      const res = await api.post('/admin/login', { email, password });
      dispatch(setAdmin(res.data.token));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-50 font-sans antialiased bg-[image:radial-gradient(ellipse_80%_60%_at_10%_-10%,rgba(99,102,241,0.13)_0%,transparent_55%),radial-gradient(ellipse_60%_50%_at_90%_100%,rgba(167,139,250,0.08)_0%,transparent_55%)] flex items-center justify-center py-10 px-6">
      <div className="w-full max-w-[440px]">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-[68px] h-[68px] rounded-[20px] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
            <KeyRound size={30} color="#a78bfa" />
          </div>
          <h1 className="text-[1.9rem] font-black tracking-[-0.03em] mb-2">
            Admin Login
          </h1>
          <p className="text-[15px] text-slate-400">
            Access the panel to upload and manage tests
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900 border border-white/10 rounded-[24px] shadow-2xl shadow-black/40 py-10 px-10">
          <form onSubmit={handleLogin} className="flex flex-col gap-[22px]">
            <div>
              <label className="flex items-center gap-[6px] text-[13px] font-medium text-slate-400 mb-[8px]">
                <Mail size={13} /> Email address
              </label>
              <input
                className="w-full bg-white/5 border-[1.5px] border-white/10 text-slate-50 rounded-[16px] px-[18px] py-[14px] text-[15px] outline-none transition-all placeholder:text-slate-500 focus:border-indigo-500 focus:bg-indigo-500/10 focus:ring-4 focus:ring-indigo-500/10"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@mock.test"
              />
            </div>

            <div>
              <label className="flex items-center gap-[6px] text-[13px] font-medium text-slate-400 mb-[8px]">
                <Lock size={13} /> Password
              </label>
              <input
                className="w-full bg-white/5 border-[1.5px] border-white/10 text-slate-50 rounded-[16px] px-[18px] py-[14px] text-[15px] outline-none transition-all placeholder:text-slate-500 focus:border-indigo-500 focus:bg-indigo-500/10 focus:ring-4 focus:ring-indigo-500/10"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-start gap-[10px] px-[18px] py-[14px] rounded-[16px] text-[14px] leading-[1.5] bg-red-500/10 text-red-400 border border-red-500/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-[8px] font-semibold rounded-[16px] py-[14px] px-[24px] text-[15px] whitespace-nowrap bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed w-full mt-1"
              disabled={loading}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <hr className="h-[1px] bg-white/10 border-none m-0 my-7" />

          <div className="text-center text-[13px] text-slate-500">
            Default credentials
            <div className="mt-2.5 py-2.5 px-4 rounded-[10px] bg-indigo-500/10 text-violet-400 font-mono text-[13px]">
              admin@mock.test&nbsp;&nbsp;/&nbsp;&nbsp;Admin@123
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-7">
          <Link to="/" className="inline-flex items-center justify-center gap-[8px] font-semibold text-[13px] border-[1.5px] border-white/10 rounded-[10px] px-[16px] py-[8px] whitespace-nowrap bg-transparent text-slate-400 transition-all hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-violet-400">
            <ChevronLeft size={14} /> Back to platform
          </Link>
        </div>
      </div>
    </div>
  );
}
