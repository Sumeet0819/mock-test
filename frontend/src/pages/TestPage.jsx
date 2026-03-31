import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setTest, setAnswer, setResult } from '../redux/slices/testSlice';
import api from '../lib/axios';
import {
  Timer, ChevronLeft, ChevronRight, CheckCircle2,
  Loader2, AlertCircle, Home, LayoutGrid
} from 'lucide-react';

export default function TestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTest, answers, result } = useSelector(s => s.test);
  const { user, token } = useSelector(s => s.auth);

  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(!currentTest);
  const [error, setError] = useState('');
  const timerRef = useRef(null);

  useEffect(() => { if (!user || !token) navigate('/'); }, [user, token, navigate]);

  // If a result already exists, immediately replace the current route with the result page
  // This explicitly catches the browser "Back" button
  useEffect(() => {
    if (result) navigate('/result', { replace: true });
  }, [result, navigate]);

  useEffect(() => {
    if (!currentTest || currentTest._id !== id) {
      setLoading(true);
      api.get(`/test/${id}`)
        .then(r => { dispatch(setTest(r.data)); setTimeLeft(r.data.duration * 60); })
        .catch(() => setError('Test not found.'))
        .finally(() => setLoading(false));
    } else {
      setTimeLeft(currentTest.duration * 60);
    }
  }, [id, currentTest, dispatch]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const res = await api.post('/test/submit', { testId: currentTest._id, answers, name: user, token });
      dispatch(setResult(res.data));
      navigate('/result', { replace: true }); // Prevent test from staying in history
    } catch {
      setError('Failed to submit. Please try again.');
      setSubmitting(false);
    }
  }, [currentTest, answers, user, token, submitting, navigate, dispatch]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft === null, handleSubmit]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={36} className="spin" color="var(--accent)" />
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--danger-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AlertCircle size={26} color="var(--danger)" />
      </div>
      <p style={{ color: 'var(--text-2)' }}>{error}</p>
      <button className="btn btn-ghost" onClick={() => navigate('/')}>
        <Home size={15} /> Go Home
      </button>
    </div>
  );

  if (!currentTest) return null;

  const q = currentTest.questions[current];
  const total = currentTest.questions.length;
  const answered = answers.filter(a => a !== '').length;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isUrgent = timeLeft < 60;
  const timerColor = timeLeft < 60 ? 'var(--danger)' : timeLeft < 180 ? 'var(--warning)' : 'var(--success)';
  const progressPct = ((current + 1) / total) * 100;

  return (
    <div className="page-bg" style={{ minHeight: '100vh', paddingBottom: 64 }}>
      {/* ── Top Bar ──────────────────────────────────── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(8,8,16,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, height: 64 }}>
            {/* Title */}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentTest.title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>
                Hi {user} · Q{current + 1}/{total}
              </div>
            </div>

            {/* Timer */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 18px', borderRadius: 12,
              background: isUrgent ? 'var(--danger-dim)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isUrgent ? 'rgba(248,113,113,0.3)' : 'var(--border)'}`,
              color: timerColor,
              fontVariantNumeric: 'tabular-nums',
              transition: 'all 0.3s',
            }}>
              <Timer size={16} />
              <span style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 800 }}>
                {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, marginBottom: 0 }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      </div>

      {/* ── Question ─────────────────────────────────── */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 0' }}>
        <div className="card anim-scale-in" key={current} style={{ padding: '40px 44px', marginBottom: 24 }}>
          <div className="chip chip-accent" style={{ marginBottom: 20 }}>
            Question {current + 1} of {total}
          </div>

          <p style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.6, marginBottom: 36, color: 'var(--text-1)' }}>
            {q.question}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {q.options.map((opt, i) => {
              const isSelected = answers[current] === opt;
              return (
                <button
                  key={i}
                  onClick={() => dispatch(setAnswer({ index: current, answer: opt }))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '16px 20px', borderRadius: 14,
                    border: `1.5px solid ${isSelected ? 'var(--accent)' : 'rgba(255,255,255,0.07)'}`,
                    background: isSelected ? 'var(--accent-dim)' : 'rgba(255,255,255,0.025)',
                    color: isSelected ? 'var(--accent-2)' : 'var(--text-1)',
                    cursor: 'pointer', textAlign: 'left',
                    transform: isSelected ? 'translateX(4px)' : 'none',
                    transition: 'all 0.18s',
                    fontFamily: 'inherit', fontSize: 15, fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {/* Option Letter */}
                  <span style={{
                    flexShrink: 0, width: 30, height: 30, borderRadius: 8,
                    background: isSelected ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700,
                    color: isSelected ? 'white' : 'var(--text-3)',
                    transition: 'all 0.18s',
                  }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span style={{ flex: 1 }}>{opt}</span>
                  {isSelected && <CheckCircle2 size={16} color="var(--accent)" style={{ flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Navigation ───────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
          <button
            className="btn btn-ghost"
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <span style={{ fontSize: 13, color: 'var(--text-3)' }}>
            {answered} of {total} answered
          </span>

          {current < total - 1 ? (
            <button className="btn btn-primary" onClick={() => setCurrent(c => c + 1)}>
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 size={15} className="spin" /> : <CheckCircle2 size={15} />}
              {submitting ? 'Submitting…' : 'Submit Test'}
            </button>
          )}
        </div>

        {/* ── Question Navigator ───────────────────────── */}
        <div className="card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <LayoutGrid size={14} color="var(--text-3)" />
            <span className="section-label">Question Navigator</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {currentTest.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: 38, height: 38, borderRadius: 10,
                  border: `1.5px solid ${i === current ? 'var(--accent)' : answers[i] ? 'var(--success)' : 'rgba(255,255,255,0.08)'}`,
                  background: i === current ? 'var(--accent)' : answers[i] ? 'var(--success-dim)' : 'rgba(255,255,255,0.04)',
                  color: i === current ? 'white' : answers[i] ? 'var(--success)' : 'var(--text-3)',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.15s', fontFamily: 'inherit',
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
