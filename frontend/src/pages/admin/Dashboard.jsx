import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../../redux/slices/adminSlice';
import api from '../../lib/axios';
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

  const handleLogout = () => { dispatch(logoutAdmin()); navigate('/admin/login'); };

  const avgDuration = tests.length
    ? Math.round(tests.reduce((a, t) => a + t.duration, 0) / tests.length)
    : 0;

  return (
    <div className="page-bg" style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* ── Header ───────────────────────────────────── */}
        <div className="anim-fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 44 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--accent-dim)', border: '1px solid rgba(124,111,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LayoutDashboard size={22} color="var(--accent-2)" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.7rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Dashboard</h1>
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>Manage all uploaded tests</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" onClick={() => navigate('/admin/upload')}>
              <Plus size={16} /> Upload Test
            </button>
            <button className="btn btn-ghost" onClick={handleLogout}>
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>

        {/* ── Stats ────────────────────────────────────── */}
        <div className="anim-fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
          {[
            { label: 'Total Tests', value: tests.length, Icon: FileText, color: 'var(--accent-2)', bg: 'var(--accent-dim)' },
            { label: 'Total Questions', value: tests.reduce((a, t) => a + t.questionCount, 0), Icon: HelpCircle, color: 'var(--success)', bg: 'var(--success-dim)' },
            { label: 'Avg Duration', value: tests.length ? `${avgDuration}m` : '—', Icon: Clock, color: 'var(--warning)', bg: 'var(--warning-dim)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '24px 24px' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <s.Icon size={20} color={s.color} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1, color: s.color, marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{s.label}</div>
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
                gridTemplateColumns: '1fr 110px 110px 130px 100px',
                padding: '14px 28px',
                borderBottom: '1px solid var(--border)',
              }}>
                {['Title', 'Questions', 'Duration', 'Created', ''].map(h => (
                  <div key={h} className="section-label">{h}</div>
                ))}
              </div>

              {/* Rows */}
              {tests.map((test, i) => (
                <div
                  key={test._id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 110px 110px 130px 100px',
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
