import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearTest } from '../../redux/slices/testSlice';
import {
  Trophy, Star, TrendingUp, RotateCcw,
  CheckCircle, XCircle, Printer, Check, X, Circle
} from 'lucide-react';

export default function ResultPage() {
  const { result } = useSelector(s => s.test);
  const { user } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!result) { navigate('/'); return null; }

  const { score, total, percentage, breakdown } = result;

  const grade = percentage >= 90
    ? { label: 'Excellent!',      Icon: Trophy,     color: '#34d399', colorClass: 'text-emerald-400', borderClass: 'border-emerald-500/20', bgClass: 'bg-emerald-500/10' }
    : percentage >= 75
    ? { label: 'Great Job!',      Icon: Star,       color: '#a78bfa', colorClass: 'text-violet-400', borderClass: 'border-indigo-500/20', bgClass: 'bg-indigo-500/10' }
    : percentage >= 60
    ? { label: 'Good Pass!',      Icon: TrendingUp, color: '#fbbf24', colorClass: 'text-amber-400', borderClass: 'border-amber-500/20', bgClass: 'bg-amber-500/10' }
    : { label: 'Keep Practicing', Icon: RotateCcw,  color: '#f87171', colorClass: 'text-red-400', borderClass: 'border-red-500/20', bgClass: 'bg-red-500/10' };

  const { Icon: GradeIcon } = grade;

  const handleRetry = () => { dispatch(clearTest()); navigate('/'); };

  const circumference = 2 * Math.PI * 52;

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-50 font-sans antialiased bg-[image:radial-gradient(ellipse_80%_60%_at_10%_-10%,rgba(99,102,241,0.13)_0%,transparent_55%),radial-gradient(ellipse_60%_50%_at_90%_100%,rgba(167,139,250,0.08)_0%,transparent_55%)]">
      <div className="max-w-[720px] mx-auto pt-16 px-6 pb-24">

        {/* ── Score Hero ───────────────────────────── */}
        <div className="text-center mb-12">
          <div className={`w-[72px] h-[72px] rounded-[22px] flex items-center justify-center mx-auto mb-5 border ${grade.borderClass} ${grade.bgClass}`}>
            <GradeIcon size={34} className={grade.colorClass} />
          </div>

          <h1 className={`text-[2.4rem] font-black tracking-[-0.03em] mb-2 ${grade.colorClass}`}>
            {grade.label}
          </h1>
          <p className="text-base text-slate-400">
            Well done, <strong className="text-slate-50">{user}</strong>!
          </p>

          {/* SVG Ring */}
          <div className="flex justify-center my-10">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke={grade.color} strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - percentage / 100)}
                  className="transition-[stroke-dashoffset] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-[2rem] font-black leading-none ${grade.colorClass}`}>{percentage}%</span>
                <span className="text-[13px] text-slate-500 mt-1">{score}/{total} correct</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3.5 max-w-[380px] mx-auto">
            {[
              { label: 'Correct', value: score, Icon: CheckCircle, colorClass: 'text-emerald-400', bgClass: 'bg-emerald-500/10' },
              { label: 'Wrong', value: total - score, Icon: XCircle, colorClass: 'text-red-400', bgClass: 'bg-red-500/10' },
              { label: 'Total', value: total, Icon: Circle, colorClass: 'text-violet-400', bgClass: 'bg-indigo-500/10' },
            ].map(s => (
              <div key={s.label} className="bg-slate-900 border border-white/10 rounded-[24px] shadow-2xl shadow-black/40 py-5 px-4 text-center">
                <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center mx-auto mb-2.5 ${s.bgClass}`}>
                  <s.Icon size={18} className={s.colorClass} />
                </div>
                <div className={`text-[1.6rem] font-extrabold leading-none ${s.colorClass}`}>{s.value}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Breakdown ────────────────────────────── */}
        <div>
          <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-slate-500 mb-4">Detailed Breakdown</div>
          <div className="flex flex-col gap-3.5">
            {breakdown.map((item, i) => (
              <div
                key={i} className={`bg-slate-900 border rounded-[24px] shadow-2xl shadow-black/40 py-6 px-7 ${item.isCorrect ? 'border-emerald-500/20' : 'border-red-500/20'}`}
              >
                {/* Question Header */}
                <div className="flex items-start gap-3 mb-4.5">
                  <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-px ${item.isCorrect ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                    {item.isCorrect
                      ? <CheckCircle size={15} className="text-emerald-400" />
                      : <XCircle size={15} className="text-red-400" />}
                  </div>
                  <p className="font-semibold text-[15px] leading-relaxed text-slate-50">
                    {i + 1}. {item.question}
                  </p>
                </div>

                {/* Options */}
                <div className="flex flex-col gap-2 pl-10">
                  {item.options.map((opt, j) => {
                    const isCorrect  = opt === item.correctAnswer;
                    const isUserWrong = opt === item.userAnswer && !item.isCorrect;
                    
                    let bg = 'bg-white/5';
                    let border = 'border-transparent';
                    let text = 'text-slate-400';
                    
                    if (isCorrect) {
                      bg = 'bg-emerald-500/10'; border = 'border-emerald-400'; text = 'text-emerald-400';
                    } else if (isUserWrong) {
                      bg = 'bg-red-500/10'; border = 'border-red-400'; text = 'text-red-400';
                    }
                    
                    return (
                      <div key={j} className={`flex items-center gap-2.5 py-2.5 px-3.5 rounded-[10px] text-sm border-l-[3px] ${bg} ${border} ${text}`}>
                        <span className="shrink-0">
                          {isCorrect ? <Check size={13} /> : isUserWrong ? <X size={13} /> : <Circle size={11} className="opacity-30" />}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isCorrect && <span className="text-[11px] font-bold opacity-80">Correct answer</span>}
                        {isUserWrong && <span className="text-[11px] font-bold opacity-80">Your answer</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions ──────────────────────────────── */}
        <div className="flex gap-3.5 mt-12 justify-center flex-wrap">
          <button className="inline-flex items-center justify-center gap-[8px] font-semibold text-[15px] rounded-[18px] px-[28px] py-[16px] whitespace-nowrap bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-[1px] active:translate-y-0" onClick={handleRetry}>
            <RotateCcw size={17} /> Try Another Test
          </button>
          <button className="inline-flex items-center justify-center gap-[8px] font-semibold text-[15px] border-[1.5px] border-white/10 rounded-[18px] px-[28px] py-[16px] whitespace-nowrap bg-transparent text-slate-400 transition-all hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-violet-400" onClick={() => window.print()}>
            <Printer size={17} /> Print Results
          </button>
        </div>
      </div>
    </div>
  );
}
