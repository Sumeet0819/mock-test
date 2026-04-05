import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin, setTestResults } from '../../../redux/slices/adminSlice';
import api from '../../../lib/axios';
import {
  LayoutDashboard, Upload, LogOut, Trash2, Loader2,
  FileText, HelpCircle, Clock, Plus, BookOpen, LineChart, Settings, Bell, User, Search, Filter, Eye
} from 'lucide-react';

export default function Dashboard() {
  const { isAuthenticated, resultsCache = {} } = useSelector(s => s.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [loadingResultsId, setLoadingResultsId] = useState(null);

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

  const handleViewResults = async (testId) => {
    if (resultsCache[testId]) {
      setResults({ testId, attempts: resultsCache[testId] });
      return;
    }

    setLoadingResultsId(testId);
    setResults(null);
    try {
      const res = await api.get(`/admin/test/${testId}/results`);
      dispatch(setTestResults({ testId, attempts: res.data }));
      setResults({ testId, attempts: res.data });
    } catch {
      setError('Failed to fetch results');
    } finally {
      setLoadingResultsId(null);
    }
  };

  const handleLogout = () => { dispatch(logoutAdmin()); navigate('/admin/login'); };

  const avgDuration = tests.length
    ? Math.round(tests.reduce((a, t) => a + t.duration, 0) / tests.length)
    : 0;

  return (
    <div className="bg-[#f7fafc] text-[#181c1e] flex h-screen overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex h-screen w-64 bg-slate-50 flex-col p-6 gap-2 border-r border-[#e0e3e5] shrink-0">
         <div className="mb-8 px-4">
           <h1 className="text-lg font-black text-[#002045] tracking-tighter uppercase font-sans">Admin Portal</h1>
           <p className="text-xs text-[#545f72] font-medium opacity-70 mt-1">Institutional Access</p>
         </div>
         <nav className="flex-grow space-y-1">
           <div className="flex items-center gap-3 bg-blue-50 text-blue-800 font-bold rounded-lg px-4 py-3 cursor-pointer select-none transition-all">
             <LayoutDashboard size={20} />
             <span className="text-sm font-medium">Overview</span>
           </div>
           <div className="flex items-center gap-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 px-4 py-3 rounded-lg cursor-pointer transition-all">
             <BookOpen size={20} />
             <span className="text-sm font-medium">Test Library</span>
           </div>
           <div className="flex items-center gap-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 px-4 py-3 rounded-lg cursor-pointer transition-all">
             <LineChart size={20} />
             <span className="text-sm font-medium">Analytics</span>
           </div>
           <div className="flex items-center gap-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 px-4 py-3 rounded-lg cursor-pointer transition-all">
             <Settings size={20} />
             <span className="text-sm font-medium">Settings</span>
           </div>
         </nav>
         <div className="mt-8 space-y-4">
            <button 
              onClick={() => navigate('/admin/upload')}
              className="w-full bg-[#002045] hover:bg-[#1a365d] text-white py-3 px-4 rounded-xl font-bold text-sm tracking-tight active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus size={18} /> New Test
            </button>
            <div className="h-[1px] bg-slate-200"></div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg px-4 py-2.5 transition-colors">
              <LogOut size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
            </button>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col h-screen overflow-y-auto relative">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md z-50 flex justify-between items-center px-8 py-4 border-b border-[#e5e9eb]">
           <div className="flex items-center gap-8">
             <span className="text-xl font-bold text-[#002045] tracking-tighter">The Mock Test</span>
           </div>
           <div className="flex items-center gap-4">
             <button className="text-slate-400 hover:text-[#002045] transition-colors"><Bell size={20} /></button>
             <div className="w-10 h-10 rounded-full bg-[#e5e9eb] border-2 border-[#adc7f7] overflow-hidden flex items-center justify-center text-[#002045]">
               <User size={20} />
             </div>
           </div>
        </header>

        <div className="px-8 pb-12 pt-8 max-w-7xl mx-auto w-full space-y-8">
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">{error}</div>}
          
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-[#f1f4f6]">
               <h2 className="text-3xl font-extrabold text-[#002045] mb-2 tracking-tight">Institutional Overview</h2>
               <p className="text-[#545f72] text-sm mb-8 font-medium">Platform Usage & Testing Metrics</p>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-[#f1f4f6] p-6 rounded-xl">
                   <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#545f72] block mb-2">Active Exams</span>
                   <div className="text-4xl font-black text-[#002045]">{tests.length}</div>
                 </div>
                 <div className="bg-[#f1f4f6] p-6 rounded-xl">
                   <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#545f72] block mb-2">Total Questions</span>
                   <div className="text-4xl font-black text-[#002045]">{tests.reduce((a, t) => a + t.questionCount, 0)}</div>
                 </div>
                 <div className="bg-[#f1f4f6] p-6 rounded-xl">
                   <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#545f72] block mb-2">Avg. Duration</span>
                   <div className="text-4xl font-black text-[#002045]">{tests.length ? avgDuration + 'm' : '—'}</div>
                 </div>
               </div>
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col">
              <div className="bg-[#1a365d] text-[#86a0cd] p-8 rounded-xl flex flex-col items-center justify-center text-center h-full shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#002045] to-transparent opacity-50 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <Upload size={56} className="opacity-40 mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold mb-2 text-white tracking-tight">New Assessment</h3>
                  <button onClick={() => navigate('/admin/upload')} className="mt-4 bg-white text-[#002045] px-6 py-3.5 rounded-xl font-bold text-sm tracking-tight w-full hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] active:scale-95 transition-all">
                    Upload New Test
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8 items-start">
            <section className="col-span-12 xl:col-span-7 space-y-4">
              <div className="flex items-center justify-between mb-2">
                 <h3 className="text-xl font-extrabold text-[#002045] tracking-tight flex items-center gap-2">
                   <BookOpen size={20} className="text-[#1a365d]" /> Manage Tests
                 </h3>
              </div>

              {loading ? (
                <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#002045]" size={32} /></div>
              ) : tests.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border border-[#f1f4f6] text-center py-20 text-slate-500">
                  <p className="font-semibold text-[#002045]">No assessments available</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl overflow-hidden border border-[#f1f4f6]">
                   <div className="divide-y divide-slate-100">
                     {tests.map(test => (
                       <div key={test._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 shrink-0"><FileText size={20} /></div>
                           <div>
                             <h4 className="font-bold text-[#002045] text-[15px]">{test.title}</h4>
                             <p className="text-xs text-[#545f72] mt-1 font-medium">{test.questionCount} Questions • {test.duration}m</p>
                           </div>
                         </div>
                         <div className="flex items-center gap-3">
                           <button onClick={() => handleViewResults(test._id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-[#002045] bg-[#f1f4f6] hover:bg-[#e0e3e5] transition-colors">
                             {loadingResultsId === test._id ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />} Results
                           </button>
                           <button onClick={() => handleDelete(test._id)} className="p-2 text-slate-400 hover:text-red-600">
                             {deleting === test._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              )}
            </section>

            <section className="col-span-12 xl:col-span-5 space-y-4">
              <h3 className="text-xl font-extrabold text-[#002045] tracking-tight flex items-center gap-2 mb-2">
                <LayoutDashboard size={20} className="text-[#1a365d]" /> Student Scores
              </h3>
              <div className="bg-white rounded-xl border border-[#f1f4f6] overflow-hidden">
                 {results ? (
                   <>
                     <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                       <div>
                         <h4 className="font-bold text-[13px] text-[#002045] uppercase tracking-wide">{tests.find(t => t._id === results.testId)?.title || 'Test'}</h4>
                         <p className="text-xs text-slate-500 font-medium mt-0.5">{results.attempts.length} Submissions</p>
                       </div>
                       <button onClick={() => setResults(null)} className="text-xs text-slate-400">Close</button>
                     </div>
                     {results.attempts.length > 0 ? (
                       <div className="max-h-[400px] overflow-y-auto">
                         <table className="w-full text-left border-collapse">
                           <tbody className="text-sm divide-y divide-slate-50">
                             {results.attempts.map((attempt, i) => (
                               <tr key={i} className="hover:bg-slate-50 transition-colors">
                                 <td className="p-4 font-semibold text-[#002045]">{attempt.name}</td>
                                 <td className="p-4"><span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800">{attempt.score} pts</span></td>
                                 <td className="p-4 text-slate-400 text-xs text-right whitespace-nowrap">{new Date(attempt.submittedAt).toLocaleDateString()}</td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       </div>
                     ) : (
                       <div className="p-12 text-center text-sm font-medium text-slate-500 bg-slate-50/50">No submissions registered yet for this test.</div>
                     )}
                   </>
                 ) : (
                   <div className="p-16 text-center flex flex-col items-center justify-center min-h-[300px] text-slate-400">
                     <p className="text-sm font-medium text-[#002045]">No Report Loaded</p>
                     <p className="text-xs text-slate-500 mt-1">Select 'Results' on any assessment.</p>
                   </div>
                 )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
