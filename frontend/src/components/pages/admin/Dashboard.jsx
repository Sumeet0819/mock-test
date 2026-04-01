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
    <div className="page-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 pb-20">

        {/* ── Header ───────────────────────────────────── */}
        <div className="anim-fade-up flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-11">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-purple-500/20" style={{ background: 'var(--accent-dim)' }}>
              <LayoutDashboard size={22} color="var(--accent-2)" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
              <p className="text-sm text-gray-400 mt-1">Manage all uploaded tests</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-primary" onClick={() => navigate('/admin/upload')}>
              <Plus size={16} /> Upload Test
            </button>
            <button className="btn btn-ghost" onClick={handleLogout}>
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>

        {/* ── Stats ────────────────────────────────────── */}
        <div className="anim-fade-up delay-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Tests', value: tests.length, Icon: FileText, color: 'var(--accent-2)', bg: 'var(--accent-dim)' },
            { label: 'Total Questions', value: tests.reduce((a, t) => a + t.questionCount, 0), Icon: HelpCircle, color: 'var(--success)', bg: 'var(--success-dim)' },
            { label: 'Avg Duration', value: tests.length ? `${avgDuration}m` : '—', Icon: Clock, color: 'var(--warning)', bg: 'var(--warning-dim)' },
          ].map(s => (
            <div key={s.label} className="card p-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: s.bg }}>
                <s.Icon size={20} color={s.color} />
              </div>
              <div className="text-2xl font-black leading-none mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-sm text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Table ────────────────────────────────────── */}
        <div className="anim-fade-up delay-2">
          {error && <div className="alert alert-danger" style={{ marginBottom: 16 }}>{error}</div>}

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
              <Loader2 size={36} className="spin" color="var(--accent)" />
            </div>
          ) : tests.length === 0 ? (
            <div className="card" style={{ padding: '80px 40px', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--bg-card-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Inbox size={28} color="var(--text-3)" />
              </div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No tests yet</div>
              <div style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 28 }}>Upload your first test to get started.</div>
              <button className="btn btn-primary" onClick={() => navigate('/admin/upload')}>
                <Upload size={16} /> Upload Test
              </button>
            </div>
          ) : (
            <div className="card" style={{ overflow: 'hidden' }}>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 110px 110px 130px 120px 100px',
                padding: '14px 28px',
                borderBottom: '1px solid var(--border)',
              }} className="hidden md:grid">
                {['Title', 'Questions', 'Duration', 'Created', 'Actions', ''].map(h => (
                  <div key={h} className="section-label">{h}</div>
                ))}
              </div>

              {/* Mobile Header - Hidden on larger screens */}
              <div className="md:hidden px-4 py-3 border-b border-gray-700">
                <div className="section-label">Tests</div>
              </div>

              {/* Rows */}
              {tests.map((test, i) => (
                <div key={test._id}>
                  {/* Desktop Row */}
                  <div
                    className="hidden md:grid"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 110px 110px 130px 120px 100px',
                      padding: '18px 28px',
                      borderBottom: i < tests.length - 1 ? '1px solid var(--border)' : 'none',
                      alignItems: 'center',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{test.title}</div>
                    <div>
                      <span className="chip chip-accent">{test.questionCount} Q</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text-2)' }}>
                      <Clock size={13} /> {test.duration} min
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
                      {new Date(test.createdAt).toLocaleDateString()}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleViewResults(test._id)}
                        disabled={loadingResults}
                      >
                        {loadingResults ? <Loader2 size={13} className="spin" /> : 'View Results'}
                      </button>
                    </div>
                    <div>
                      <button
                        className="btn btn-danger-ghost"
                        onClick={() => handleDelete(test._id)}
                        disabled={deleting === test._id}
                      >
                        {deleting === test._id
                          ? <Loader2 size={13} className="spin" />
                          : <Trash2 size={13} />}
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Mobile Row */}
                  <div className="md:hidden p-4 border-b border-gray-700 last:border-b-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-base truncate">{test.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                          <span className="chip chip-accent text-xs">{test.questionCount} Q</span>
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            {test.duration} min
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Created: {new Date(test.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-ghost btn-sm flex-1"
                        onClick={() => handleViewResults(test._id)}
                        disabled={loadingResults}
                      >
                        {loadingResults ? <Loader2 size={13} className="spin" /> : 'View Results'}
                      </button>
                      <button
                        className="btn btn-danger-ghost btn-sm"
                        onClick={() => handleDelete(test._id)}
                        disabled={deleting === test._id}
                      >
                        {deleting === test._id
                          ? <Loader2 size={13} className="spin" />
                          : <Trash2 size={13} />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Results ──────────────────────────────────── */}
        {results && (
          <div className="anim-fade-up delay-3 mt-10">
            <div className="card overflow-hidden">
              <div className="p-5 lg:p-7 border-b border-gray-700">
                <h3 className="text-xl font-bold">Test Results</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {results.attempts.length} attempt{results.attempts.length !== 1 ? 's' : ''}
                </p>
              </div>
              {results.attempts.length === 0 ? (
                <div className="p-10 text-center text-gray-500">
                  No attempts yet
                </div>
              ) : (
                <div className="p-5 lg:p-7">
                  {results.attempts.map((attempt, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-gray-700 last:border-b-0 gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white">{attempt.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Submitted: {new Date(attempt.submittedAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-xl font-bold text-green-400 sm:text-right">
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
