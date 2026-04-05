import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setTest, setAnswer, setResult } from '../../redux/slices/testSlice';
import api from '../../lib/axios';
import {
  Timer, ArrowLeft, ArrowRight, CheckCircle2,
  Loader2, AlertCircle, Home, LayoutGrid, Info, User, CheckCheck, Send, LogOut
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
      navigate('/result', { replace: true });
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <Loader2 size={40} className="animate-spin text-primary" />
      <span className="mt-4 text-primary font-headline font-bold anim-pulse">Preparing your assessment...</span>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 anim-fade-in">
      <div className="w-16 h-16 rounded-[1.25rem] bg-error-container/20 flex items-center justify-center shadow-sm">
        <AlertCircle size={32} className="text-error" />
      </div>
      <p className="text-on-surface-variant font-medium text-lg">{error}</p>
      <button
        className="inline-flex items-center gap-2 font-bold text-[15px] border-2 border-outline-variant rounded-xl px-6 py-3 transition-all hover:bg-primary/5 hover:border-primary hover:text-primary active:scale-95"
        onClick={() => navigate('/')}
      >
        <Home size={18} /> Go Home
      </button>
    </div>
  );

  if (!currentTest) return null;

  const q = currentTest.questions[current];
  const total = currentTest.questions.length;
  // const answered = answers.filter(a => a !== '').length; // Keeping if needed
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isUrgent = timeLeft < 60;
  const progressPct = ((current + 1) / total) * 100;

  return (
    <div className="bg-background font-body text-on-surface antialiased min-h-screen">

      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-sm border-b border-outline-variant/10 anim-fade-in">
        <div className="flex justify-between items-center w-full px-8 py-4">

          <div className="flex items-center gap-6">
            <span className="text-xl font-bold text-primary tracking-tighter font-headline">The Mock Test</span>
            <div className="hidden md:flex gap-6 items-center border-l border-outline-variant/30 pl-6">
              <span className="text-outline font-bold text-[13px] uppercase tracking-wide">{currentTest.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                if (window.confirm('Are you sure you want to exit the test? Your progress will not be saved.')) {
                  navigate('/');
                }
              }}
              className="flex items-center gap-2 text-[12px] font-bold text-error bg-error/10 border border-error/20 px-4 py-2 rounded-[0.6rem] transition-all hover:bg-error hover:text-white"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Exit Test</span>
            </button>
            
            <div className="hidden md:flex flex-col items-end border-l border-outline-variant/30 pl-6">
              <span className="text-[10px] uppercase tracking-widest font-bold text-outline">Time Remaining</span>
              <span className={`text-lg font-headline font-extrabold flex items-center gap-2 ${isUrgent ? 'text-error animate-pulse' : 'text-primary'}`}>
                {isUrgent && <Timer size={16} />}
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </span>
            </div>

            <div className="h-10 w-10 rounded-[0.85rem] bg-surface-container-high border border-outline-variant/20 flex flex-col items-center justify-center overflow-hidden shadow-sm">
              <User className="text-outline" size={20} />
            </div>
          </div>

        </div>
        {/* Underline separator */}
        <div className="bg-outline-variant/20 h-[1px] w-full"></div>
      </header>

      <main className="pt-[106px] pb-32 min-h-screen flex flex-col items-center">

        {/* Progress Navigation Header */}
        <div className="w-full max-w-[90rem] px-8 mb-8 flex flex-col gap-5 anim-fade-up">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-widest font-bold text-outline mb-1.5">Assessment Progress</span>
              <h1 className="text-2xl md:text-[1.75rem] font-headline font-extrabold text-primary tracking-tight">Question {current + 1} of {total}</h1>
            </div>
          </div>

          {/* Focus Bar */}
          <div className="h-[6px] w-full bg-surface-container-highest rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #002045 0%, #455f88 100%)' }}
            ></div>
          </div>
        </div>

        {/* Asymmetric Question Layout */}
        <div className="w-full max-w-[90rem] px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Panel: Context & Navigator */}
          <aside className="lg:col-span-5 space-y-6 order-2 lg:order-1 anim-fade-up delay-1">

            <div className="p-6 bg-surface-container-low rounded-[1.25rem] space-y-4 border border-outline-variant/20 shadow-sm transition-all hover:shadow-md hover:border-outline-variant/40">
              <div className="flex items-center gap-2 text-primary">
                <Info size={16} strokeWidth={2.5} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Contextual Brief</span>
              </div>
              <p className="text-[0.95rem] leading-relaxed text-on-surface-variant font-medium">
                Ensure you read all options carefully. The options may be similar but carry distinct contextual meanings depending on the topic. Good luck, {user}!
              </p>
            </div>

            <div className="p-6 bg-surface-container-low rounded-[1.25rem] border border-outline-variant/20 shadow-sm transition-all hover:shadow-md hover:border-outline-variant/40">
              <div className="flex items-center gap-2 text-primary mb-5">
                <LayoutGrid size={16} strokeWidth={2.5} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Question Navigator</span>
              </div>

              <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-6 gap-2.5">
                {currentTest.questions.map((_, i) => {
                  const isCurrent = i === current;
                  const isAnswered = !!answers[i];

                  let btnClass = "h-11 rounded-[0.6rem] flex items-center justify-center text-[13px] font-bold transition-all cursor-pointer font-headline ";

                  if (isCurrent) {
                    btnClass += "ring-[3px] ring-primary/20 bg-primary-fixed text-primary shadow-sm hover:scale-105 hover:bg-primary-fixed-dim";
                  } else if (isAnswered) {
                    btnClass += "bg-primary text-white shadow-[0_2px_8px_rgba(0,32,69,0.15)] hover:scale-105 hover:bg-primary-container";
                  } else {
                    btnClass += "bg-surface-container-highest text-outline hover:bg-outline-variant/60 hover:text-on-surface-variant hover:scale-105";
                  }

                  return (
                    <button key={i} onClick={() => setCurrent(i)} className={btnClass}>
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Panel: The Question Canvas */}
          <div className="lg:col-span-7 order-1 lg:order-2 anim-fade-up delay-2">
            <div className="bg-surface-container-lowest p-8 md:p-14 rounded-[2rem] shadow-[0_16px_40px_-12px_rgba(0,32,69,0.08)] border border-outline-variant/20">

              <div className="mb-12">
                <h2 className="text-[1.05rem] md:text-[1.15rem] font-body font-semibold leading-[1.6] text-on-surface tracking-tight">
                  {q.question}
                </h2>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-5">
                {q.options.map((opt, i) => {
                  const isSelected = answers[current] === opt;
                  return (
                    <label
                      key={i}
                      className={`group relative flex items-center px-8 py-5 bg-surface border-b-2 rounded-xl transition-all duration-200 cursor-pointer ${isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-outline-variant/30 hover:border-outline-variant/60 hover:bg-surface-container-low hover:-translate-y-[1px]'}`}
                    >
                      <input
                        type="radio"
                        className="hidden peer"
                        name="mock-test-option"
                        checked={isSelected}
                        onChange={() => dispatch(setAnswer({ index: current, answer: opt }))}
                      />
                      <div className={`flex-shrink-0 w-6 h-6 rounded-lg border-[2px] ${isSelected ? 'bg-primary border-primary shadow-inner shadow-black/20' : 'border-outline-variant group-hover:border-outline'} flex items-center justify-center transition-all mr-6`}>
                        <div className={`w-2 h-2 bg-white rounded-[3px] transition-all transform ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>
                      </div>
                      <span className={`text-[0.9rem] md:text-[0.95rem] leading-[1.6] font-medium font-body transition-colors ${isSelected ? 'text-primary font-bold' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Footer Navigation Controls */}
            <div className="mt-10 flex justify-between items-center px-2">
              <button
                onClick={() => setCurrent(c => Math.max(0, c - 1))}
                disabled={current === 0}
                className="flex items-center gap-2 px-6 py-4 rounded-xl text-primary font-bold hover:bg-primary/5 transition-colors active:scale-95 disabled:opacity-40 disabled:hover:bg-transparent disabled:active:scale-100 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={18} />
                <span>Previous</span>
              </button>

              <div className="flex gap-4">
                {current < total - 1 ? (
                  <button
                    onClick={() => setCurrent(c => c + 1)}
                    className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-bold shadow-[0_8px_20px_rgba(0,32,69,0.15)] hover:shadow-[0_12px_25px_rgba(0,32,69,0.25)] hover:-translate-y-[2px] hover:bg-primary-container transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    <span>Next Question</span>
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-bold shadow-[0_8px_20px_rgba(0,32,69,0.15)] hover:shadow-[0_12px_25px_rgba(0,32,69,0.25)] hover:-translate-y-[2px] hover:bg-primary-container transition-all active:scale-[0.98] disabled:opacity-50 disabled:hover:-translate-y-0 disabled:cursor-not-allowed"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCheck size={18} />}
                    <span>{submitting ? 'Submitting...' : 'Submit Assessment'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
