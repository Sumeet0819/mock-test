import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearTest } from '../../redux/slices/testSlice';
import {
  CheckCircle, XCircle, Printer, Check, X, Circle, Bell, Settings,
  ChevronLeft, ChevronRight, Home, LayoutList, TrendingUp, User
} from 'lucide-react';

export default function ResultPage() {
  const { result } = useSelector(s => s.test);
  const { user } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Pagination state for questions
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!result) { navigate('/'); return null; }

  const { score, total, percentage, breakdown, testTitle } = result;

  const handleRetry = () => { dispatch(clearTest()); navigate('/'); };

  const totalPages = Math.ceil(breakdown.length / itemsPerPage);
  const paginatedQuestions = breakdown.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const correctAnswersCount = score;
  const incorrectAnswersCount = total - score;

  return (
    <div className="bg-[#f7fafc] text-[#181c1e] font-sans antialiased min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-md shadow-sm border-b border-[#e0e3e5]">
        <div className="flex justify-between items-center w-full px-8 py-4">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold text-[#002045] tracking-tighter">The Mock Test</span>
            <nav className="hidden md:flex gap-6">
              <button className="text-[#002045] font-bold tracking-tight border-b-2 border-[#002045] pb-1">Test Results</button>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-[#545f72]">
            <button className="active:scale-95 transition-transform"><Bell size={20} /></button>
            <div className="w-10 h-10 rounded-full border border-[#adc7f7] bg-[#e5e9eb] flex items-center justify-center text-[#002045] font-bold uppercase overflow-hidden">
               {user?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Left Column: Student Summary */}
        <aside className="w-full md:w-1/3 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-xl shadow-[0_4px_24px_-12px_rgba(0,0,0,0.06)] border border-[#e0e3e5]/70">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-[#002045] flex items-center justify-center text-white text-2xl font-bold uppercase shadow-inner">
                {user?.charAt(0) || 'S'}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[#002045] tracking-tight">{user || 'Student Name'}</h1>
                <p className="text-[#545f72] text-xs uppercase tracking-wider font-semibold mt-1">Candidate Profile</p>
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-[#e0e3e5]/50">
              <div>
                <p className="text-[#86a0cd] text-[10px] uppercase tracking-widest font-bold mb-1">Test Title</p>
                <h2 className="text-[#002045] font-bold text-lg">{testTitle || 'Completed Assessment'}</h2>
              </div>
            </div>
          </div>

          {/* Score Visualization */}
          <div className="bg-[#002045] p-8 rounded-xl text-white overflow-hidden relative shadow-lg">
            <div className="relative z-10">
              <p className="text-[#adc7f7] text-[10px] uppercase tracking-widest font-bold mb-4">Final Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-extrabold tracking-tighter">{Math.round(percentage)}</span>
                <span className="text-2xl font-bold text-[#86a0cd]">%</span>
              </div>
              <div className="mt-8 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#adc7f7] font-medium">Correct Answers</span>
                  <span className="font-bold">{score}/{total}</span>
                </div>
                <div className="w-full bg-[#1a365d] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#adc7f7] to-white h-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            </div>
            {/* Abstract Decorative Shapes */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#adc7f7]/10 rounded-full blur-2xl pointer-events-none"></div>
          </div>

          {/* Breakdown Bento Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#e0e3e5]/70 text-center shadow-sm">
              <div className="flex justify-center mb-2"><CheckCircle className="text-green-600" size={24} /></div>
              <p className="text-[#002045] font-black text-2xl">{correctAnswersCount}</p>
              <p className="text-[#545f72] text-[10px] uppercase font-bold tracking-widest mt-1">Correct</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#e0e3e5]/70 text-center shadow-sm">
              <div className="flex justify-center mb-2"><XCircle className="text-red-500" size={24} /></div>
              <p className="text-[#002045] font-black text-2xl">{incorrectAnswersCount}</p>
              <p className="text-[#545f72] text-[10px] uppercase font-bold tracking-widest mt-1">Incorrect</p>
            </div>
          </div>
        </aside>

        {/* Right Column: Question Review */}
        <section className="flex-1 space-y-6">
          <div className="flex justify-between items-end px-2 sm:flex-row flex-col sm:items-end items-start gap-4">
            <div>
              <h3 className="text-xl font-black text-[#002045]">Detailed Question Review</h3>
              <p className="text-[#545f72] text-sm mt-1">Analyze specific response patterns from your submission.</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="bg-[#e5e9eb] text-[#002045] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#d7dadc] transition-colors flex items-center gap-2" onClick={() => window.print()}>
                <Printer size={16} /> Export
              </button>
              <button className="bg-[#002045] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#1a365d] shadow-md transition-colors" onClick={handleRetry}>
                Take Another
              </button>
            </div>
          </div>

          {/* Review Items */}
          <div className="space-y-4">
            {paginatedQuestions.map((item, index) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
              return (
                <div key={globalIndex} className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${item.isCorrect ? 'border-l-green-500 border border-[#e0e3e5]/50' : 'border-l-red-500 border border-[#e0e3e5]/50'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[#545f72] text-[11px] font-bold uppercase tracking-widest">Question {String(globalIndex).padStart(2, '0')}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${item.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="text-[#002045] font-semibold text-lg leading-relaxed mb-6">
                    {item.question}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className={`p-4 rounded-xl border flex items-start gap-3 ${item.isCorrect ? 'bg-[#f7fafc] border-[#e0e3e5]' : 'bg-red-50 border-red-100'}`}>
                      {item.isCorrect ? <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} /> : <XCircle className="text-red-500 shrink-0 mt-0.5" size={20} />}
                      <div>
                        <p className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${item.isCorrect ? 'text-[#545f72]' : 'text-red-700'}`}>Your Choice</p>
                        <p className="text-[#002045] font-bold text-sm leading-snug">{item.userAnswer || 'No Answer'}</p>
                      </div>
                    </div>

                    {!item.isCorrect && (
                      <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex items-start gap-3">
                        <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
                        <div>
                          <p className="text-[10px] text-green-700 uppercase font-bold tracking-wider mb-1">Correct Answer</p>
                          <p className="text-[#002045] font-bold text-sm leading-snug">{item.correctAnswer}</p>
                        </div>
                      </div>
                    )}
                    {item.isCorrect && (
                      <div className="p-4 rounded-xl bg-white border border-[#e0e3e5]/50 flex items-start gap-3 opacity-60">
                         <Check className="text-slate-400 shrink-0 mt-0.5" size={20} />
                         <div>
                           <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Correct Answer</p>
                           <p className="text-[#002045] font-bold text-sm leading-snug">{item.correctAnswer}</p>
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-6">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="w-10 h-10 rounded-full border border-[#adc7f7] flex items-center justify-center text-[#002045] hover:bg-[#e5e9eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} className="-ml-1" />
              </button>
              <span className="text-sm font-bold text-[#002045]">
                Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, breakdown.length)} of {breakdown.length}
              </span>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="w-10 h-10 rounded-full border border-[#adc7f7] flex items-center justify-center text-[#002045] hover:bg-[#e5e9eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} className="-mr-1" />
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Bottom NavBar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white flex justify-around items-center px-4 py-3 pb-safe z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-slate-100">
        <button onClick={() => navigate('/')} className="flex flex-col items-center justify-center text-slate-400 px-6 py-2 active:scale-90 transition-transform">
          <Home size={24} strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-widest font-bold mt-1">Home</span>
        </button>
        <div className="flex flex-col items-center justify-center bg-[#d8e3fa] text-[#002045] rounded-2xl px-6 py-2 active:scale-90 transition-transform">
           <LayoutList size={24} strokeWidth={2} />
           <span className="text-[10px] uppercase tracking-widest font-bold mt-1">Results</span>
        </div>
      </nav>
    </div>
  );
}
