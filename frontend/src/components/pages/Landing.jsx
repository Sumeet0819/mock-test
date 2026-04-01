import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/authSlice';
import { setTest } from '../../redux/slices/testSlice';
import api from '../../lib/axios';
import {
  Sparkles, Clock, Calendar, ArrowRight,
  Loader2, Inbox, User, ShieldCheck, BookOpen
} from 'lucide-react';

export default function Landing() {
  const [name, setName] = useState('');
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingTests, setFetchingTests] = useState(true);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/test/all')
      .then(r => setTests(r.data))
      .catch(() => setError('Could not connect to the backend. Make sure the server is running.'))
      .finally(() => setFetchingTests(false));
  }, []);

  const handleStart = async (testId) => {
    if (!name.trim()) { setError('Please enter your name first'); return; }
    if (name.trim().length < 2) { setError('Name must be at least 2 characters'); return; }
    setLoading(true); setError('');
    try {
      const authRes = await api.post('/auth/user', { name: name.trim() });
      dispatch(setUser({ user: authRes.data.name, token: authRes.data.token }));
      const testRes = await api.get(`/test/${testId}`);
      dispatch(setTest(testRes.data));
      navigate(`/test/${testId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-50 font-sans antialiased bg-[image:radial-gradient(ellipse_80%_60%_at_10%_-10%,rgba(99,102,241,0.13)_0%,transparent_55%),radial-gradient(ellipse_60%_50%_at_90%_100%,rgba(167,139,250,0.08)_0%,transparent_55%)]">
      <div className="max-w-[680px] mx-auto py-20 px-6">

        {/* ── Hero ────────────────────────────────── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-[6px] px-[14px] py-[5px] rounded-full text-[12px] font-semibold tracking-[0.02em] bg-indigo-500/10 text-violet-400 mb-5">
            <Sparkles size={13} /> Open Source Mock Tests
          </div>

          <h1 className="text-[clamp(2.4rem,6vw,3.5rem)] font-black leading-[1.1] tracking-[-0.03em] mb-4 bg-clip-text text-transparent bg-gradient-to-br from-slate-50 to-violet-400">
            MockTest Platform
          </h1>

          <p className="text-[17px] text-slate-400 max-w-[420px] mx-auto leading-relaxed">
            Test your knowledge, get instant results, and track your progress — no signup needed.
          </p>
        </div>

        {/* ── Name Card ───────────────────────────── */}
        <div className="bg-slate-900 border border-white/10 rounded-[24px] shadow-2xl shadow-black/40 py-9 px-10 mb-8">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-[10px] bg-indigo-500/10 flex items-center justify-center">
              <User size={18} color="#a78bfa" />
            </div>
            <div>
              <div className="font-bold text-base">Enter your name</div>
              <div className="text-[13px] text-slate-500">Pick a test below to start immediately</div>
            </div>
          </div>

          <input
            className="w-full bg-white/5 border-[1.5px] border-white/10 text-slate-50 rounded-[16px] px-[18px] py-[14px] text-[15px] outline-none transition-all placeholder:text-slate-500 focus:border-indigo-500 focus:bg-indigo-500/10 focus:ring-4 focus:ring-indigo-500/10"
            type="text"
            placeholder="e.g. Alex Johnson"
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            onKeyDown={e => { if (e.key === 'Enter' && tests[0]) handleStart(tests[0]._id); }}
          />

          {error && (
            <div className="mt-2.5 text-[13px] text-red-400 flex items-center gap-1.5">
              {error}
            </div>
          )}
        </div>

        {/* ── Tests List ──────────────────────────── */}
        <div>
          <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-slate-500 mb-4">
            <BookOpen size={11} className="inline align-middle mr-1.5" />
            Available Tests
          </div>

          {fetchingTests ? (
            <div className="flex justify-center py-14">
              <Loader2 size={32} className="animate-spin" color="#6366f1" />
            </div>
          ) : tests.length === 0 ? (
            <div className="bg-slate-900 border border-white/10 rounded-[24px] shadow-2xl shadow-black/40 py-14 px-10 text-center">
              <div className="w-16 h-16 rounded-[18px] bg-slate-800 border border-white/10 flex items-center justify-center mx-auto mb-5">
                <Inbox size={28} color="#64748b" />
              </div>
              <div className="font-semibold mb-2">No tests available yet</div>
              <div className="text-sm text-slate-400">Ask an admin to upload a test to get started.</div>
            </div>
          ) : (
             <div className="flex flex-col gap-3.5">
              {tests.map((test, i) => (
                <div
                  key={test._id}
                  className="bg-slate-900 border border-white/10 rounded-[24px] shadow-2xl shadow-black/40 transition-all duration-200 hover:border-indigo-500/30 hover:shadow-indigo-500/20 hover:ring-1 hover:ring-indigo-500/30 hover:-translate-y-[2px] py-6 px-7 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-base mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                      {test.title}
                    </div>
                    <div className="flex gap-[18px] text-[13px] text-slate-400">
                      <span className="flex items-center gap-[5px]">
                        <Clock size={13} /> {test.duration} min
                      </span>
                      <span className="flex items-center gap-[5px]">
                        <Calendar size={13} /> {new Date(test.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    className="inline-flex items-center justify-center gap-[8px] font-semibold text-[14px] rounded-[16px] px-[24px] py-[12px] whitespace-nowrap bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-[1px] active:translate-y-0 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleStart(test._id)}
                    disabled={loading}
                  >
                    {loading
                      ? <Loader2 size={15} className="animate-spin" />
                      : <><span>Start</span><ArrowRight size={15} /></>
                    }
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ──────────────────────────────── */}
        <div className="text-center mt-14 text-[13px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} />
          Admin?{' '}
          <Link to="/admin/login" className="text-violet-400 underline underline-offset-4">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
