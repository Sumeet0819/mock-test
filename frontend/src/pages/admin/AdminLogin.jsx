import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAdmin } from '../../redux/slices/adminSlice';
import api from '../../lib/axios';
import { Lock, Mail, ArrowRight, Loader2, ChevronLeft, KeyRound } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('All fields are required'); return; }
    setLoading(true); setError('');
    try {
      const res = await api.post('/admin/login', { email, password });
      dispatch(setAdmin(res.data.token));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="anim-scale-in" style={{ width: '100%', maxWidth: 440 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 68, height: 68, borderRadius: 20,
            background: 'var(--accent-dim)', border: '1px solid rgba(124,111,247,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <KeyRound size={30} color="var(--accent-2)" />
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Admin Login
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-2)' }}>
            Access the panel to upload and manage tests
          </p>
        </div>

        {/* Form Card */}
        <div className="card" style={{ padding: '40px 40px' }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div>
              <label className="label">
                <Mail size={13} /> Email address
              </label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@mock.test"
              />
            </div>

            <div>
              <label className="label">
                <Lock size={13} /> Password
              </label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '14px', fontSize: 15, marginTop: 4 }}
            >
              {loading ? <Loader2 size={16} className="spin" /> : <ArrowRight size={16} />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <hr className="divider" style={{ margin: '28px 0' }} />

          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-3)' }}>
            Default credentials
            <div style={{ marginTop: 10, padding: '10px 16px', borderRadius: 10, background: 'var(--accent-dim)', color: 'var(--accent-2)', fontFamily: 'monospace', fontSize: 13 }}>
              admin@mock.test&nbsp;&nbsp;/&nbsp;&nbsp;Admin@123
            </div>
          </div>
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <a href="/" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex' }}>
            <ChevronLeft size={14} /> Back to platform
          </a>
        </div>
      </div>
    </div>
  );
}
