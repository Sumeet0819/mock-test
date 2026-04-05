import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/authSlice';
import { setTest } from '../../redux/slices/testSlice';
import api from '../../lib/axios';
import { 
  HelpCircle, Timer, BookOpen, ShieldCheck, 
  BarChart, GraduationCap, ArrowRight, Loader2, 
  User, ChevronDown, Check 
} from 'lucide-react';

export default function Landing() {
  const [name, setName] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingTests, setFetchingTests] = useState(true);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/test/all')
      .then(r => {
        setTests(r.data);
        if (r.data.length > 0) {
          setSelectedTest(r.data[0]._id);
        }
      })
      .catch(() => setError('Could not connect to the backend. Make sure the server is running.'))
      .finally(() => setFetchingTests(false));
  }, []);

  const handleStart = async (e) => {
    e?.preventDefault();
    if (!name.trim()) { setError('Please enter your name first'); return; }
    if (name.trim().length < 2) { setError('Name must be at least 2 characters'); return; }
    if (!selectedTest) { setError('Please select a test first'); return; }
    if (!termsAccepted) { setError('You must accept the Academic Integrity Guidelines'); return; }
    
    setLoading(true); setError('');
    try {
      const authRes = await api.post('/auth/user', { name: name.trim() });
      dispatch(setUser({ user: authRes.data.name, token: authRes.data.token }));
      const testRes = await api.get(`/test/${selectedTest}`);
      dispatch(setTest(testRes.data));
      navigate(`/test/${selectedTest}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col items-center justify-center relative overflow-hidden anim-fade-in">
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] mix-blend-multiply"></div>
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-secondary-container/20 blur-[100px] mix-blend-multiply"></div>
      </div>
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-[20px] shadow-sm border-b border-outline-variant/10 flex justify-between items-center px-8 py-4 anim-fade-up">
        <div className="text-xl font-headline font-extrabold text-primary tracking-tighter hover:scale-[1.02] transition-transform cursor-pointer">
          The Mock Test
        </div>
        <div className="flex items-center gap-6">
          <Link to="/admin/login" className="text-sm font-bold text-outline hover:text-primary transition-colors pr-4">Admin Login</Link>
          <HelpCircle className="text-outline hover:text-primary transition-colors cursor-pointer" size={24} />
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center z-10 pt-24 pb-12">
        
        {/* Left Column Text & Features */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="space-y-5">
            <span className="inline-block font-label text-[11px] uppercase tracking-widest font-bold text-on-secondary-container bg-secondary-container px-3.5 py-1.5 rounded-full shadow-sm anim-fade-up">
              Knowledge Assessment
            </span>
            <h1 className="font-headline text-5xl md:text-[3.5rem] font-extrabold text-primary leading-[1.1] tracking-tight anim-fade-up delay-1">
              Welcome to your <br /><span className="text-surface-tint">Academic Session</span>.
            </h1>
            <p className="font-body text-[1.125rem] text-on-surface-variant max-w-xl leading-relaxed anim-fade-up delay-2">
              This mock assessment is designed to mirror the rigorous standards of professional examinations. Prepare to demonstrate your proficiency in a distraction-free environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 anim-fade-up delay-3">
            {[
              { icon: Timer, title: "60 Minutes", desc: "Continuous session time." },
              { icon: BookOpen, title: "45 Questions", desc: "Adaptive difficulty scaling." },
              { icon: ShieldCheck, title: "Secure Mode", desc: "Focus-only interface." },
              { icon: BarChart, title: "Instant Results", desc: "Comprehensive performance map." }
            ].map((feature, idx) => (
              <div key={idx} className="flex gap-4 p-5 bg-surface-container-lowest/80 backdrop-blur-md rounded-[1.25rem] shadow-sm border border-outline-variant/15 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group cursor-default">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                  <feature.icon className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="font-headline text-[1.1rem] font-bold text-primary">{feature.title}</h4>
                  <p className="text-[0.85rem] text-on-surface-variant">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column Form */}
        <div className="lg:col-span-5 anim-fade-up delay-4">
          <div className="bg-surface-container-lowest p-10 rounded-[2rem] shadow-2xl shadow-primary/5 border border-outline-variant/20 relative overflow-visible">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <GraduationCap className="text-primary w-40 h-40" />
            </div>
            
            <div className="relative z-10 space-y-8">
              <div className="space-y-2">
                <h2 className="font-headline text-[1.75rem] font-bold text-primary">Identity Check</h2>
                <p className="text-[0.9rem] text-on-surface-variant leading-relaxed">
                  Please provide your legal name as it should appear on your performance certificate.
                </p>
              </div>

              <form onSubmit={handleStart} className="space-y-6">
                
                {/* Custom Input */}
                <div className="relative group">
                  <label className="font-label text-[11px] uppercase tracking-widest font-bold text-outline block mb-2.5 transition-colors group-focus-within:text-primary" htmlFor="student_name">
                    Your Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-4 text-outline-variant group-focus-within:text-primary transition-colors pointer-events-none" size={20} />
                    <input 
                      className="w-full bg-surface border-2 border-outline-variant/30 rounded-xl pl-[2.8rem] pr-4 py-3.5 text-[1.1rem] font-headline text-primary focus:outline-none focus:border-primary focus:ring-[4px] focus:ring-primary/10 hover:border-outline-variant/60 transition-all placeholder:text-outline/40 shadow-[0_2px_10px_rgba(0,0,0,0.02)]" 
                      id="student_name" 
                      placeholder="e.g. Julian Sterling" 
                      type="text" 
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(''); }}
                    />
                  </div>
                </div>

                {/* Custom Dropdown Selection */}
                <div className="relative group">
                  <label className="font-label text-[11px] uppercase tracking-widest font-bold text-outline block mb-2.5 transition-colors" htmlFor="test_selection">
                    Select Assessment
                  </label>
                  
                  {fetchingTests ? (
                    <div className="py-4 px-4 bg-surface rounded-xl border border-outline-variant/30 text-primary flex items-center gap-3 font-headline">
                      <Loader2 className="animate-spin" size={20} /> <span className="text-sm">Fetching modules...</span>
                    </div>
                  ) : tests.length === 0 ? (
                    <div className="py-4 px-4 bg-surface rounded-xl border border-outline-variant/30 text-outline font-headline italic">
                      No assessments available.
                    </div>
                  ) : (
                    <div className="relative">
                      <div 
                        className={`w-full bg-surface border-2 ${isDropdownOpen ? 'border-primary ring-[4px] ring-primary/10' : 'border-outline-variant/30 hover:border-outline-variant/60'} rounded-xl pl-4 pr-12 py-3.5 text-[1.1rem] font-headline text-primary shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all cursor-pointer flex items-center justify-between select-none`}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <span className="truncate">
                          {selectedTest ? tests.find(t => t._id === selectedTest)?.title : "Choose an assessment..."}
                        </span>
                        <ChevronDown className={`absolute right-4 text-outline-variant transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-primary' : ''}`} size={20} />
                      </div>
                      
                      {isDropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setIsDropdownOpen(false)} 
                          />
                          <div className="absolute top-[calc(100%+8px)] left-0 w-full z-50 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden anim-scale-in origin-top">
                            <div className="max-h-[220px] overflow-y-auto custom-scrollbar">
                              {tests.map(t => {
                                const isSelected = selectedTest === t._id;
                                return (
                                  <div 
                                    key={t._id} 
                                    className={`px-5 py-3.5 flex items-center justify-between cursor-pointer transition-colors ${isSelected ? 'bg-primary/5 text-primary' : 'text-on-surface hover:bg-surface-container-low'}`}
                                    onClick={() => { setSelectedTest(t._id); setIsDropdownOpen(false); setError(''); }}
                                  >
                                    <span className={`truncate text-[0.95rem] ${isSelected ? 'font-bold' : 'font-medium'}`}>{t.title}</span>
                                    {isSelected && <Check size={18} className="text-primary ml-3 flex-shrink-0" />}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3.5 pt-2">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input 
                      className="peer appearance-none w-5 h-5 rounded-[6px] border-2 border-outline-variant/50 checked:bg-primary checked:border-primary focus:ring-0 focus:outline-none transition-all cursor-pointer shadow-sm hover:border-primary/50" 
                      id="terms" 
                      type="checkbox" 
                      checked={termsAccepted}
                      onChange={(e) => { setTermsAccepted(e.target.checked); setError(''); }}
                    />
                    <Check size={14} strokeWidth={3} className="text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                  </div>
                  <label className="text-[0.8rem] text-on-surface-variant leading-relaxed select-none cursor-pointer" htmlFor="terms">
                    I understand that this is a timed assessment and I agree to the <a className="text-primary font-bold underline hover:text-primary-container transition-colors" href="#">Academic Integrity Guidelines</a>.
                  </label>
                </div>

                {/* Error Box */}
                {error && (
                  <div className="text-[0.85rem] text-error font-bold bg-error-container/50 px-4 py-3 rounded-xl border border-error/20 flex items-center gap-2 anim-scale-in">
                    <HelpCircle size={16} className="text-error" /> {error}
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={loading || fetchingTests || tests.length === 0}
                  className="w-full bg-primary text-white font-headline font-bold py-4 rounded-xl shadow-[0_8px_20px_rgba(0,32,69,0.15)] hover:shadow-[0_12px_25px_rgba(0,32,69,0.25)] hover:-translate-y-1 hover:bg-primary-container active:scale-[0.98] active:translate-y-0 transition-all flex items-center justify-center gap-3 group mt-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <span className="tracking-wide">Start Assessment</span>
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </>
                  )}
                </button>
              </form>

              {/* Social Proof Footer */}
              <div className="pt-6 border-t border-outline-variant/15 flex justify-center items-center">
                <div className="flex -space-x-3 hover:space-x-[-8px] transition-all duration-300">
                  <img className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm hover:-translate-y-1 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3135CsvUcJlNjWDhLIV3608WGGio1wca0jbTiU1hsEMH-du1k82zlC4SNENiz-1qmwieIhlrVVWTlBPqfRl4Z-qRaYLSrAwnnJtnCfKD5G7vuOCuAiipghrwOp65rNhQ5_fIwYDtVA30aRFHo3arpMScxEYhBu01yUaG7MKrb1VR3o9tcScgHMF5-S2cZbFwahygXP34L48qcwtuRn9YHCRCdcv6UVkeOWHUQxUA35tUTcoWa3whYpgZqEVhLHRaYU9-JPFMcPvw" alt="student a" />
                  <img className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm hover:-translate-y-1 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDgm3cbqeaJidHTQAT2Z_4Ux7YIuGJRjJkUfkSJaChKo4kXL3rk-F333fxzJqktvM3hxcbhOHaxxd5O5vx-b-Y8onOl30qXu-4esJGsY7rb5YPy4g4rH9UB_xUciWa1eQ2aOLL6l1j-ro1pfOQp_Y77OMun5MeC6-GvQOvMSnmwYoFTKt7GB6JUz3Y6HSK1AGVWGucJ7XHuPpa1_v1DidItP82Goj8EWnZ5leU3M1Ys9weAv9JrITHzRIsIbq1EBJI5lhEq-vRneA" alt="student b" />
                  <img className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm hover:-translate-y-1 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCakd6CPD9bfoidFI7juGrJ4I2ArF9YR5bI5tow69_59PwT9oIXLem6G7rFaVW-OtAlLAaDcSGXkhukbMNG1OX66dtZwMndLjYGtsoPcYxb_ZgnMhe9nOkaWGWAedrhUpO2LkkZT9nvcfkqLmqzviH09SwjV_4EKFV4BW1HPNuIttMk3f2vXuUDsw8edKyi2nUI02BhYJr1zqLYCJx0RZgi8ep25mNGwlXBVg1w9NBKfWh55j8E7GZXra8Pwtma8Faho6W5nnbUCBE" alt="student c" />
                </div>
                <p className="ml-5 text-[10.5px] text-on-surface-variant font-semibold tracking-wide">Joined by 2,400+ students today</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl px-8 mt-auto py-10 flex flex-col md:flex-row justify-between items-center gap-6 text-on-surface-variant/80 z-10 opacity-80 hover:opacity-100 transition-opacity">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em]">© 2024 The Mock Test — Assessment System</p>
        <div className="flex gap-8 text-[11px] font-bold uppercase tracking-[0.08em]">
          <a className="hover:text-primary transition-colors" href="#">Privacy</a>
          <a className="hover:text-primary transition-colors" href="#">Standard</a>
          <a className="hover:text-primary transition-colors" href="#">Integrity</a>
        </div>
      </footer>
    </div>
  );
}
