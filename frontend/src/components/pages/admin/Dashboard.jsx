import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../../../redux/slices/adminSlice';
import api from '../../../lib/axios';
import {
  LayoutDashboard, Upload, LogOut, Trash2, Loader2,
  FileText, HelpCircle, Clock, Inbox, Plus
} from 'lucide-react';

export default function Dashboard() {
  const { isAuthenticated } = useSelector(s => s.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/admin/login'); return; }
    fetchTests();
  }, [isAuthenticated]);

  const fetchTests = () => {
    setLoading(true);
    api.get('/admin/tests')
      .then(r => setTests(r.data))
      .catch(() => setError('Failed to fetch tests'))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this test?')) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/test/${id}`);
      setTests(prev => prev.filter(t => t._id !== id));
    } catch { setError('Failed to delete'); }
    finally { setDeleting(null); }
  };

  const handleViewResults = async (testId) => {
    setLoadingResults(true);
    setResults(null);
    try {
      const res = await api.get(`/admin/test/${testId}/results`);
      setResults({ testId, attempts: res.data });
    } catch {
      setError('Failed to fetch results');
    } finally {
      setLoadingResults(false);
    }
  };

  const handleLogout = () => { dispatch(logoutAdmin()); navigate('/admin/login'); };

  const avgDuration = tests.length
    ? Math.round(tests.reduce((a, t) => a + t.duration, 0) / tests.length)
    : 0;

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-50 font-sans antialiased bg-[image:radial-gradient(ellipse_80%_60%_at_10%_-10%,rgba(99,102,241,0.13)_0%,transparent_55%),radial-gradient(ellipse_60%_50%_at_90%_100%,rgba(167,139,250,0.08)_0%,transparent_55%)]">
      <div className="max-w-[960px] mx-auto py-12 pb-20 px-6">

        {/* ── Header ───────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-11">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-[14px] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <LayoutDashboard size={22} color="#a78bfa" />
            </div>
            <div>
              <h1 className="text-[1.7rem] font-black tracking-[-0.02em]">Dashboard</h1>
              <p className="text-[13px] text-slate-500 mt-0.5">Manage all uploaded tests</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center justify-center gap-[8px] font-semibold text-[14px] rounded-[16px] px-[24px] py-[12px] whitespace-nowrap bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => navigate('/admin/upload')}>
              <Plus size={16} /> Upload Test
            </button>
            <button className="inline-flex items-center justify-center gap-[8px] font-semibold text-[14px] border-[1.5px] border-white/10 rounded-[16px] px-[24px] py-[12px] whitespace-nowrap bg-transparent text-slate-400 transition-all hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-violet-400" onClick={handleLogout}>
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>

        {/* ── Stats ────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Tests', value: tests.length, Icon: FileText, color: 'text-violet-400', bg: 'bg-indigo-500/10' },
            { label: 'Total Questions', value: tests.reduce((a, t) => a + t.questionCount, 0), Icon: HelpCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Avg Duration', value: tests.length ? `${avgDuration}m` : '—', Icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map(s => (
            <div key={s.label} className="bg-slate-900 border border-white/10 rounded-[24px] shadow-2xl shadow-black/40 p-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${s.bg}`}>
                <s.Icon size={20} className={s.color} />
              </div>
              <div className={`text-[2rem] font-black leading-none mb-1.5 ${s.color}`}>{s.value}</div>
              <div className="text-[13px] text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Table ────────────────────────────────────── */}
        <div>
          {error && <div className="flex items-start gap-[10px] px-[18px] py-[14px] rounded-[16px] text-[14px] leading-[1.5] bg-red-500/10 text-red-400 border border-red-500/20 mb-4">{error}</div>}

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={36} className="animate-spin" color="#6366f1" />
            </div>
          ) : tests.length === 0 ? (
            <div className="bg-slate-900 border border-white/10 rounded-[24px] shadow-2xl shadow-black/40 py-20 px-10 text-center">
              <div className="w-16 h-16 rounded-[18px] bg-slate-800 border border-white/10 flex items-center justify-center mx-auto mb-5">
                <Inbox size={28} color="#64748b" />
              </div>
              <div className="font-bold text-lg mb-2">No tests yet</div>
              <div className="text-sm text-slate-400 mb-7">Upload your first test to get started.</div>
              <button className="inline-flex items-center justify-center gap-[8px] font-semibold text-[14px] rounded-[16px] px-[24px] py-[12px] whitespace-nowrap bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => navigate('/admin/upload')}>
                <Upload size={16} /> Upload Test
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-white/10 rounded-[24px] shadow-2xl shadow-black/40 overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_110px_110px_130px_120px_100px] py-3.5 px-7 border-b border-white/10">
                {['Title', 'Questions', 'Duration', 'Created', 'Actions', ''].map(h => (
                  <div key={h} className="text-[11px] font-bold tracking-[0.1em] uppercase text-slate-500">{h}</div>
                ))}
              </div>

              {/* Rows */}
              {tests.map((test, i) => (
                <div
                  key={test._id}
                  className={`grid grid-cols-[1fr_110px_110px_130px_120px_100px] py-4.5 px-7 items-center transition-[background] duration-150 hover:bg-white/5 ${i < tests.length - 1 ? 'border-b border-white/10' : ''}`}
                >
                  <div className="font-semibold text-[15px]">{test.title}</div>
                  <div>
                    <span className="inline-flex items-center gap-[6px] px-[14px] py-[5px] rounded-full text-[12px] font-semibold tracking-[0.02em] bg-indigo-500/10 text-violet-400">{test.questionCount} Q</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-400">
                    <Clock size={13} /> {test.duration} min
                  </div>
                  <div className="text-[13px] text-slate-500">
                    {new Date(test.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="inline-flex items-center justify-center gap-[8px] font-semibold text-[13px] border-[1.5px] border-white/10 rounded-[10px] px-[16px] py-[8px] whitespace-nowrap bg-transparent text-slate-400 transition-all hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-violet-400"
                      onClick={() => handleViewResults(test._id)}
                      disabled={loadingResults}
                    >
                      {loadingResults ? <Loader2 size={13} className="animate-spin" /> : 'View Results'}
                    </button>
                  </div>
                  <div>
                    <button
                      className="inline-flex items-center justify-center gap-[8px] font-semibold text-[13px] border-[1.5px] border-red-500/25 rounded-[10px] px-[16px] py-[8px] whitespace-nowrap bg-transparent text-red-400 transition-all hover:bg-red-500/10 hover:border-red-500/50"
                      onClick={() => handleDelete(test._id)}
                      disabled={deleting === test._id}
                    >
                      {deleting === test._id
                        ? <Loader2 size={13} className="animate-spin" />
                        : <Trash2 size={13} />}
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Results ──────────────────────────────────── */}
        {results && (
          <div className="mt-10">
            <div className="bg-slate-900 border border-white/10 rounded-[24px] shadow-2xl shadow-black/40 overflow-hidden">
              <div className="py-5 px-7 border-b border-white/10">
                <h3 className="text-[1.2rem] font-bold">Test Results</h3>
                <p className="text-[14px] text-slate-500 mt-1">
                  {results.attempts.length} attempt{results.attempts.length !== 1 ? 's' : ''}
                </p>
              </div>
              {results.attempts.length === 0 ? (
                <div className="p-10 text-center text-slate-500">
                  No attempts yet
                </div>
              ) : (
                <div className="px-7 pb-7 pt-0">
                  {results.attempts.map((attempt, i) => (
                    <div
                      key={i}
                      className={`flex justify-between items-center py-4 ${i < results.attempts.length - 1 ? 'border-b border-white/10' : ''}`}
                    >
                      <div>
                        <div className="font-semibold">{attempt.name}</div>
                        <div className="text-xs text-slate-500">
                          Submitted: {new Date(attempt.submittedAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-[1.2rem] font-bold text-emerald-400">
                        {attempt.score} marks
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
