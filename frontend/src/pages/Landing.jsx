import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/authSlice';
import { setTest } from '../redux/slices/testSlice';
import api from '../lib/axios';
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
    <div className="page-bg" style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '80px 24px 80px' }}>

        {/* ── Hero ────────────────────────────────── */}
        <div className="anim-fade-up" style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="chip chip-accent" style={{ marginBottom: 20 }}>
            <Sparkles size={13} /> Open Source Mock Tests
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 6vw, 3.5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: 16,
            background: 'linear-gradient(135deg, #f1f1ff 30%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            MockTest Platform
          </h1>

          <p style={{ fontSize: 17, color: 'var(--text-2)', maxWidth: 420, margin: '0 auto', lineHeight: 1.7 }}>
            Test your knowledge, get instant results, and track your progress — no signup needed.
          </p>
        </div>

        {/* ── Name Card ───────────────────────────── */}
        <div className="card anim-fade-up delay-1" style={{ padding: '36px 40px', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--accent-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <User size={18} color="var(--accent-2)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Enter your name</div>
              <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Pick a test below to start immediately</div>
            </div>
          </div>

          <input
            className="input"
            type="text"
            placeholder="e.g. Alex Johnson"
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            onKeyDown={e => { if (e.key === 'Enter' && tests[0]) handleStart(tests[0]._id); }}
          />

          {error && (
            <div style={{ marginTop: 10, fontSize: 13, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 6 }}>
              {error}
            </div>
          )}
        </div>

        {/* ── Tests List ──────────────────────────── */}
        <div className="anim-fade-up delay-2">
          <div className="section-label" style={{ marginBottom: 16 }}>
            <BookOpen size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
            Available Tests
          </div>

          {fetchingTests ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '56px 0' }}>
              <Loader2 size={32} className="spin" color="var(--accent)" />
            </div>
          ) : tests.length === 0 ? (
            <div className="card" style={{ padding: '56px 40px', textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: 18,
                background: 'var(--bg-card-2)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <Inbox size={28} color="var(--text-3)" />
              </div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>No tests available yet</div>
              <div style={{ fontSize: 14, color: 'var(--text-2)' }}>Ask an admin to upload a test to get started.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {tests.map((test, i) => (
                <div
                  key={test._id}
                  className={`card card-hover anim-fade-up delay-${Math.min(i + 3, 4)}`}
                  style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {test.title}
                    </div>
                    <div style={{ display: 'flex', gap: 18, fontSize: 13, color: 'var(--text-2)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Clock size={13} /> {test.duration} min
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Calendar size={13} /> {new Date(test.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleStart(test._id)}
                    disabled={loading}
                    style={{ flexShrink: 0 }}
                  >
                    {loading
                      ? <Loader2 size={15} className="spin" />
                      : <><span>Start</span><ArrowRight size={15} /></>
                    }
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ──────────────────────────────── */}
        <div className="anim-fade-up delay-4"
          style={{ textAlign: 'center', marginTop: 56, fontSize: 13, color: 'var(--text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <ShieldCheck size={14} />
          Admin?{' '}
          <a href="/admin/login" style={{ color: 'var(--accent-2)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Login here
          </a>
        </div>
      </div>
    </div>
  );
}
