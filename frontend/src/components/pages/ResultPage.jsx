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
    ? { label: 'Excellent!',      Icon: Trophy,     color: '#34d399', bg: 'rgba(52,211,153,0.12)' }
    : percentage >= 75
    ? { label: 'Great Job!',      Icon: Star,       color: '#7c6ff7', bg: 'rgba(124,111,247,0.12)' }
    : percentage >= 60
    ? { label: 'Good Pass!',      Icon: TrendingUp,  color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' }
    : { label: 'Keep Practicing', Icon: RotateCcw,  color: '#f87171', bg: 'rgba(248,113,113,0.12)' };

  const { Icon: GradeIcon } = grade;

  const handleRetry = () => { dispatch(clearTest()); navigate('/'); };

  const circumference = 2 * Math.PI * 52;

  return (
    <div className="page-bg" style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 96px' }}>

        {/* ── Score Hero ───────────────────────────── */}
        <div className="anim-fade-up" style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 22,
            background: grade.bg, border: `1px solid ${grade.color}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <GradeIcon size={34} color={grade.color} />
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.03em', color: grade.color, marginBottom: 8 }}>
            {grade.label}
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-2)' }}>
            Well done, <strong style={{ color: 'var(--text-1)' }}>{user}</strong>!
          </p>

          {/* SVG Ring */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
            <div style={{ position: 'relative', width: 160, height: 160 }}>
              <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke={grade.color} strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - percentage / 100)}
                  style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1, color: grade.color }}>{percentage}%</span>
                <span style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>{score}/{total} correct</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 380, margin: '0 auto' }}>
            {[
              { label: 'Correct', value: score, Icon: CheckCircle, color: 'var(--success)', bg: 'var(--success-dim)' },
              { label: 'Wrong', value: total - score, Icon: XCircle, color: 'var(--danger)', bg: 'var(--danger-dim)' },
              { label: 'Total', value: total, Icon: Circle, color: 'var(--accent-2)', bg: 'var(--accent-dim)' },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                  <s.Icon size={18} color={s.color} />
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Breakdown ────────────────────────────── */}
        <div className="anim-fade-up delay-1">
          <div className="section-label" style={{ marginBottom: 16 }}>Detailed Breakdown</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {breakdown.map((item, i) => (
              <div
                key={i} className="card"
                style={{
                  padding: '24px 28px',
                  borderColor: item.isCorrect ? 'rgba(52,211,153,0.18)' : 'rgba(248,113,113,0.18)',
                }}
              >
                {/* Question Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 18 }}>
                  <div style={{
                    flexShrink: 0, width: 28, height: 28, borderRadius: 8,
                    background: item.isCorrect ? 'var(--success-dim)' : 'var(--danger-dim)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginTop: 1
                  }}>
                    {item.isCorrect
                      ? <CheckCircle size={15} color="var(--success)" />
                      : <XCircle size={15} color="var(--danger)" />}
                  </div>
                  <p style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.5, color: 'var(--text-1)' }}>
                    {i + 1}. {item.question}
                  </p>
                </div>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 40 }}>
                  {item.options.map((opt, j) => {
                    const isCorrect  = opt === item.correctAnswer;
                    const isUserWrong = opt === item.userAnswer && !item.isCorrect;
                    return (
                      <div key={j} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 14px', borderRadius: 10,
                        background: isCorrect ? 'var(--success-dim)' : isUserWrong ? 'var(--danger-dim)' : 'rgba(255,255,255,0.03)',
                        borderLeft: `3px solid ${isCorrect ? 'var(--success)' : isUserWrong ? 'var(--danger)' : 'transparent'}`,
                        color: isCorrect ? 'var(--success)' : isUserWrong ? 'var(--danger)' : 'var(--text-2)',
                        fontSize: 14,
                      }}>
                        <span style={{ flexShrink: 0 }}>
                          {isCorrect ? <Check size={13} /> : isUserWrong ? <X size={13} /> : <Circle size={11} style={{ opacity: 0.3 }} />}
                        </span>
                        <span style={{ flex: 1 }}>{opt}</span>
                        {isCorrect && <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.8 }}>Correct answer</span>}
                        {isUserWrong && <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.8 }}>Your answer</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions ──────────────────────────────── */}
        <div className="anim-fade-up delay-2"
          style={{ display: 'flex', gap: 14, marginTop: 48, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={handleRetry}>
            <RotateCcw size={17} /> Try Another Test
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => window.print()}>
            <Printer size={17} /> Print Results
          </button>
        </div>
      </div>
    </div>
  );
}
