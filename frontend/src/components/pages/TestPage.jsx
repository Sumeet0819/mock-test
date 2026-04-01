import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setTest, setAnswer, setResult } from '../../redux/slices/testSlice';
import api from '../../lib/axios';
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
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={36} className="animate-spin" color="#6366f1" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
        <AlertCircle size={26} color="#f87171" />
      </div>
      <p className="text-slate-400">{error}</p>
      <button className="inline-flex items-center justify-center gap-[8px] font-semibold text-[14px] border-[1.5px] border-white/10 rounded-[16px] px-[24px] py-[12px] whitespace-nowrap bg-transparent text-slate-400 transition-all hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-violet-400" onClick={() => navigate('/')}>
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
  const timerColor = timeLeft < 60 ? '#f87171' : timeLeft < 180 ? '#fbbf24' : '#34d399';
  const progressPct = ((current + 1) / total) * 100;

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-50 font-sans antialiased bg-[image:radial-gradient(ellipse_80%_60%_at_10%_-10%,rgba(99,102,241,0.13)_0%,transparent_55%),radial-gradient(ellipse_60%_50%_at_90%_100%,rgba(167,139,250,0.08)_0%,transparent_55%)] pb-16">
      {/* ── Top Bar ──────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-[20px] border-b border-white/10">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="flex items-center justify-between gap-4 h-16">
            {/* Title */}
            <div className="min-w-0">
              <div className="font-bold text-[15px] overflow-hidden text-ellipsis whitespace-nowrap">
                {currentTest.title}
              </div>
              <div className="text-xs text-slate-500 mt-[1px]">
                Hi {user} · Q{current + 1}/{total}
              </div>
            </div>

            {/* Timer */}
            <div className={`flex items-center gap-2 py-2 px-[18px] rounded-xl font-tabular-nums transition-all duration-300 border ${isUrgent ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'}`}
              style={{ color: timerColor }}>
              <Timer size={16} />
              <span className="font-mono text-lg font-extrabold">
                {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-[3px] bg-white/5 rounded-full mb-0">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400 transition-[width] duration-400 ease-out"
              style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* ── Question ─────────────────────────────────── */}
      <div className="max-w-[800px] mx-auto pt-10 px-6">
        <div className="bg-slate-900 border border-white/10 rounded-[24px] shadow-2xl shadow-black/40 py-10 px-11 mb-6" key={current}>
          <div className="inline-flex items-center gap-[6px] px-[14px] py-[5px] rounded-full text-[12px] font-semibold tracking-[0.02em] bg-indigo-500/10 text-violet-400 mb-5">
            Question {current + 1} of {total}
          </div>

          <p className="text-[19px] font-semibold leading-[1.6] mb-9 text-slate-50">
            {q.question}
          </p>

          <div className="flex flex-col gap-3">
            {q.options.map((opt, i) => {
              const isSelected = answers[current] === opt;
              return (
                <button
                  key={i}
                  onClick={() => dispatch(setAnswer({ index: current, answer: opt }))}
                  className={`flex items-center gap-3.5 py-4 px-5 rounded-[14px] font-[inherit] text-[15px] text-left cursor-pointer transition-all duration-150 border-[1.5px] ${isSelected ? 'border-indigo-500 bg-indigo-500/10 text-violet-400 translate-x-1 font-semibold' : 'border-white/10 bg-white/5 text-slate-50 font-normal'}`}
                >
                  {/* Option Letter */}
                  <span className={`shrink-0 w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[13px] font-bold transition-all duration-150 ${isSelected ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-500'}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {isSelected && <CheckCircle2 size={16} color="#6366f1" className="shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Navigation ───────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
          <button
            className="inline-flex items-center justify-center gap-[8px] font-semibold text-[14px] border-[1.5px] border-white/10 rounded-[16px] px-[24px] py-[12px] whitespace-nowrap bg-transparent text-slate-400 transition-all hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-violet-400"
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <span className="text-[13px] text-slate-500">
            {answered} of {total} answered
          </span>

          {current < total - 1 ? (
            <button className="inline-flex items-center justify-center gap-[8px] font-semibold text-[14px] rounded-[16px] px-[24px] py-[12px] whitespace-nowrap bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setCurrent(c => c + 1)}>
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button className="inline-flex items-center justify-center gap-[8px] font-semibold text-[14px] rounded-[16px] px-[24px] py-[12px] whitespace-nowrap bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
              {submitting ? 'Submitting…' : 'Submit Test'}
            </button>
          )}
        </div>

        {/* ── Question Navigator ───────────────────────── */}
        <div className="bg-slate-900 border border-white/10 rounded-[24px] shadow-2xl shadow-black/40 py-6 px-7">
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid size={14} color="#606080" />
            <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-slate-500">Question Navigator</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentTest.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-[38px] h-[38px] rounded-[10px] text-[13px] font-bold cursor-pointer transition-all duration-150 font-[inherit]"
                style={{
                  border: `1.5px solid ${i === current ? '#6366f1' : answers[i] ? '#34d399' : 'rgba(255,255,255,0.1)'}`,
                  background: i === current ? '#6366f1' : answers[i] ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.05)',
                  color: i === current ? 'white' : answers[i] ? '#34d399' : '#64748b'
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
