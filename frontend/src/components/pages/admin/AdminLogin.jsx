import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAdmin } from '../../../redux/slices/adminSlice';
import api from '../../../lib/axios';
import { Lock, User, ArrowRight, Loader2, Eye, EyeOff, BookOpen } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="bg-[#f7fafc] min-h-screen flex flex-col items-center justify-center selection:bg-[#d6e3ff] selection:text-[#001b3c] overflow-hidden font-sans">
      {/* Subtle Architectural Background Element */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f1f4f6] skew-x-[-12deg] translate-x-20"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#002045]/5 blur-[100px]"></div>
      </div>

      {/* Login Container */}
      <main className="relative z-10 w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden rounded-xl shadow-[0_32px_64px_-12px_rgba(0,32,69,0.08)] bg-white mx-4 my-8">
        {/* Brand/Visual Side */}
        <div className="hidden md:flex md:col-span-7 relative flex-col justify-between p-12 overflow-hidden bg-[#002045]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img alt="Atmospheric library" className="w-full h-full object-cover opacity-20 mix-blend-overlay pointer-events-none" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLtkNcftbRELzo5Ece39bC1ru18ZIcLh2GcReYBVun6QniA_dFr1_PoZKTwounsv7oqfPp2p4oO0wS6AAiwuIaZanhg8JDp8Id4nQwc3VXoVH4ZjZQWXZVjELUB15yDUtSOLehsBMAr-cyI6-avrFcyJcsbUDvafOvG0FjNqE4pvcpbv2P7LzxAbaP4-9hMZvzUDCFRbKjCS8WHNOVPiqubWI0gjZOFbOOvAKn7lxfaw9ZdiQl4tbajCyutq02JCZZfLWyacYUla0" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#002045] via-[#002045]/90 to-[#1a365d]/80"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
                <BookOpen className="text-white" size={20} />
              </div>
              <span className="text-white font-bold text-xl tracking-tight font-sans">The Mock Test</span>
            </div>
            {/* Back link */}
            <Link to="/" className="inline-flex items-center text-white/70 hover:text-white text-sm transition-colors mt-2">
              &larr; Back to platform
            </Link>
          </div>
          
          <div className="relative z-10 max-w-md my-16">
            <h2 className="text-white text-3xl lg:text-4xl font-extrabold leading-tight mb-6 tracking-tight">
              Elevating the standard of <span className="text-[#adc7f7] italic">intellectual performance</span>.
            </h2>
            <p className="text-[#86a0cd] text-lg leading-relaxed">
              Access the institutional dashboard to manage assessments, monitor student progress, and analyze academic outcomes with editorial precision.
            </p>
          </div>
          
          <div className="relative z-10 flex flex-wrap items-center gap-8 border-t border-white/10 pt-8 mt-auto">
            <div>
              <div className="text-[#d6e3ff] text-2xl font-bold">1.2M+</div>
              <div className="text-white/60 text-xs uppercase tracking-widest mt-1">Tests Conducted</div>
            </div>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <div>
              <div className="text-[#d6e3ff] text-2xl font-bold">99.9%</div>
              <div className="text-white/60 text-xs uppercase tracking-widest mt-1">System Uptime</div>
            </div>
          </div>
        </div>

        {/* Login Form Side */}
        <div className="col-span-1 md:col-span-5 flex flex-col justify-center p-8 md:p-16 lg:p-20 bg-white">
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-[#181c1e] mb-2 tracking-tight">Admin Portal</h1>
              <p className="text-[#43474e] text-sm">Welcome back. Please enter your credentials.</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-8">
              {/* Email Input */}
              <div className="group">
                <label className="block text-xs font-bold text-[#43474e] uppercase tracking-widest mb-2 group-focus-within:text-[#002045] transition-colors" htmlFor="email">Administrator ID</label>
                <div className="relative">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 text-[#c4c6cf] group-focus-within:text-[#002045] transition-colors" size={20} />
                  <input 
                    className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-[#c4c6cf] focus:ring-0 focus:border-[#002045] pl-8 py-3 text-[#181c1e] placeholder:text-[#c4c6cf]/60 transition-all outline-none" 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mock.test" 
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="group">
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-xs font-bold text-[#43474e] uppercase tracking-widest group-focus-within:text-[#002045] transition-colors" htmlFor="password">Security Key</label>
                  <a className="text-xs font-medium text-[#002045] hover:text-[#1a365d] transition-colors" href="#">Forgot Access?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-[#c4c6cf] group-focus-within:text-[#002045] transition-colors" size={20} />
                  <input 
                    className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-[#c4c6cf] focus:ring-0 focus:border-[#002045] pl-8 py-3 text-[#181c1e] placeholder:text-[#c4c6cf]/60 transition-all outline-none" 
                    id="password" 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                  />
                  <button 
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[#c4c6cf] hover:text-[#181c1e] transition-colors" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input className="w-4 h-4 rounded text-[#002045] border-[#c4c6cf] focus:ring-[#002045]/20 cursor-pointer" id="remember" type="checkbox" />
                  <label className="ml-2 text-sm text-[#43474e] cursor-pointer" htmlFor="remember">Stay authenticated for 30 days</label>
                </div>
              </div>
              
              {error && (
                <div className="p-3 bg-[#ba1a1a]/10 border border-[#ba1a1a]/20 rounded-md text-sm text-[#ba1a1a]">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button 
                className="w-full bg-[#002045] hover:bg-[#1a365d] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#002045]/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed" 
                type="submit"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign Into Portal"}
                {!loading && <ArrowRight className="text-[20px] group-hover:translate-x-1 transition-transform" size={20} />}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-[#43474e] mb-2">Default Credentials:</p>
              <div className="inline-block py-1.5 px-3 rounded-lg bg-[#f1f4f6] text-[#002045] font-mono text-xs border border-[#c4c6cf]/30">
                admin@mock.test / Admin@123
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-10 pt-6 border-t border-[#e5e9eb] text-center">
              <p className="text-xs text-[#43474e]/70 leading-relaxed">
                Authorized Personnel Only. All session activities are logged and monitored under institutional security protocols.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Support Footer */}
      <footer className="mt-4 mb-8 text-center relative z-10 hidden md:block">
        <p className="text-sm text-[#43474e]/60 flex items-center justify-center gap-4">
          <span className="hover:text-[#002045] cursor-pointer transition-colors">Security Policy</span>
          <span className="w-1 h-1 rounded-full bg-[#c4c6cf]"></span>
          <span className="hover:text-[#002045] cursor-pointer transition-colors">Technical Support</span>
          <span className="w-1 h-1 rounded-full bg-[#c4c6cf]"></span>
          <span className="hover:text-[#002045] cursor-pointer transition-colors">System Status</span>
        </p>
      </footer>
    </div>
  );
}

