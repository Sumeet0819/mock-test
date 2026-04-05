import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/axios';
import {
  ChevronLeft, UploadCloud, FileJson, Rocket,
  CheckCircle2, XCircle, BookOpen, FileUp, Loader2, LayoutDashboard, User, Bell
} from 'lucide-react';

const SAMPLE_JSON = `{
  "title": "JavaScript Basics",
  "duration": 30,
  "questions": [
    {
      "question": "What keyword is used to declare a variable in modern JS?",
      "options": ["var", "let", "def", "dim"],
      "correctAnswer": "let"
    },
    {
      "question": "Which method converts a JSON string to an object?",
      "options": ["JSON.stringify()", "JSON.parse()", "JSON.convert()", "JSON.toObject()"],
      "correctAnswer": "JSON.parse()"
    }
  ]
}`;

export default function Upload() {
  const { isAuthenticated } = useSelector(s => s.admin);
  const navigate = useNavigate();
  const [jsonText, setJsonText] = useState('');
  const [parsed, setParsed] = useState(null);
  const [parseError, setParseError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { if (!isAuthenticated) navigate('/admin/login'); }, [isAuthenticated]);

  const handleJsonChange = (val) => {
    setJsonText(val);
    setParseError(''); setParsed(null); setError(''); setSuccess('');
    try {
      if (!val.trim()) return;
      const data = JSON.parse(val);
      if (!data.title) throw new Error('Missing "title" field');
      if (typeof data.duration !== 'number') throw new Error('"duration" must be a number (minutes)');
      if (!Array.isArray(data.questions) || data.questions.length === 0)
        throw new Error('"questions" must be a non-empty array');
      for (let i = 0; i < data.questions.length; i++) {
        const q = data.questions[i];
        if (!q.question) throw new Error(`Q${i + 1}: missing "question"`);
        if (!Array.isArray(q.options) || q.options.length < 2) throw new Error(`Q${i + 1}: "options" needs ≥ 2 items`);
        if (!q.correctAnswer) throw new Error(`Q${i + 1}: missing "correctAnswer"`);
      }
      setParsed(data);
    } catch (e) { setParseError(e.message); }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => handleJsonChange(ev.target.result);
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => handleJsonChange(ev.target.result);
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!parsed) return;
    setUploading(true); setError(''); setSuccess('');
    try {
      const res = await api.post('/admin/test', parsed);
      setSuccess(`Test uploaded successfully! ID: ${res.data.testId}`);
      setJsonText(''); setParsed(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Try again.');
    } finally { setUploading(false); }
  };

  return (
    <div className="bg-[#f7fafc] text-[#181c1e] flex h-screen overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex h-screen w-64 bg-slate-50 flex-col p-6 gap-2 border-r border-[#e0e3e5] shrink-0">
         <div className="mb-8 px-4">
           <h1 className="text-lg font-black text-[#002045] tracking-tighter uppercase font-sans">Admin Portal</h1>
           <p className="text-xs text-[#545f72] font-medium opacity-70 mt-1">Institutional Access</p>
         </div>
         <nav className="flex-grow space-y-1">
           <div className="flex items-center gap-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 px-4 py-3 rounded-lg cursor-pointer transition-all" onClick={() => navigate('/admin/dashboard')}>
             <LayoutDashboard size={20} />
             <span className="text-sm font-medium">Overview</span>
           </div>
           <div className="flex items-center gap-3 bg-blue-50 text-blue-800 font-bold rounded-lg px-4 py-3 cursor-pointer select-none transition-all">
             <BookOpen size={20} />
             <span className="text-sm font-medium">Test Library</span>
           </div>
         </nav>
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

        <div className="px-8 pb-12 pt-8 max-w-4xl mx-auto w-full space-y-8">
          {/* Header section form for Upload */}
          <div className="flex items-center gap-4 mb-2">
            <button 
              className="inline-flex items-center justify-center gap-2 font-bold text-sm bg-white border border-[#e5e9eb] rounded-lg px-4 py-2 hover:bg-[#f1f4f6]" 
              onClick={() => navigate('/admin/dashboard')}
            >
              <ChevronLeft size={16} /> Back
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-[#002045] tracking-tight">Upload New Test</h1>
              <p className="text-sm text-[#545f72]">Provide test structure in JSON format.</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
             <div className="bg-white p-8 rounded-xl shadow-sm border border-[#f1f4f6]">
               <div className="font-semibold text-[15px] flex items-center gap-2 mb-4 text-[#002045]">
                 <FileUp size={18} /> Upload JSON File
               </div>
               <label
                 className="flex flex-col items-center gap-3 py-10 px-6 rounded-xl border-2 border-dashed border-[#adc7f7] cursor-pointer text-center bg-[#f1f4f6]/50 hover:bg-[#f1f4f6] hover:border-[#002045] transition-all"
                 onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#002045'; e.currentTarget.style.background = '#f1f4f6'; }}
                 onDragLeave={e => { e.currentTarget.style.borderColor = '#adc7f7'; e.currentTarget.style.background = 'rgba(241, 244, 246, 0.5)'; }}
                 onDrop={e => { e.currentTarget.style.borderColor = '#adc7f7'; e.currentTarget.style.background = 'rgba(241, 244, 246, 0.5)'; handleDrop(e); }}
               >
                 <input type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
                 <UploadCloud size={40} className="text-[#002045] opacity-60" />
                 <div>
                   <div className="font-semibold text-sm mb-1 text-[#002045]">Drop your <span className="text-[#1a365d]">.json</span> file here</div>
                   <div className="text-xs text-[#545f72]">or click to open file picker</div>
                 </div>
               </label>
             </div>
             
             <div className="bg-white p-8 rounded-xl shadow-sm border border-[#f1f4f6]">
               <div className="flex items-center justify-between mb-4">
                 <div className="font-semibold text-[15px] flex items-center gap-2 text-[#002045]">
                   <FileJson size={18} /> Paste JSON Content
                 </div>
                 <button
                   className="text-xs font-bold text-[#1a365d] bg-[#f1f4f6] px-3 py-1.5 rounded-lg hover:bg-[#e0e3e5] transition-colors"
                   onClick={() => handleJsonChange(SAMPLE_JSON)}
                 >
                   Load Sample
                 </button>
               </div>
               
               <textarea
                 className="w-full bg-[#f1f4f6]/50 border border-[#e0e3e5] text-sm text-[#181c1e] rounded-xl px-4 py-4 outline-none focus:border-[#002045] focus:ring-2 focus:ring-[#002045]/20 min-h-[220px] font-mono resize-y"
                 value={jsonText}
                 onChange={e => handleJsonChange(e.target.value)}
                 placeholder={`{\n  "title": "Test Title",\n  "duration": 30,\n  "questions": [...]\n}`}
               />
               
               {parseError && (
                 <div className="flex items-start gap-2 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100 mt-4 text-sm font-medium">
                   <XCircle size={16} className="shrink-0 mt-px" />
                   <span>{parseError}</span>
                 </div>
               )}
               {parsed && !parseError && (
                 <div className="flex items-start gap-2 p-3 bg-green-50 text-green-700 rounded-lg border border-green-100 mt-4 text-sm font-medium">
                   <CheckCircle2 size={16} className="shrink-0 mt-px" />
                   <span>
                     Valid — <strong>"{parsed.title}"</strong> · {parsed.questions.length} questions · {parsed.duration} min
                   </span>
                 </div>
               )}
             </div>

             {/* Status Messages */}
             {success && <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 text-sm font-medium">{success}</div>}
             {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">{error}</div>}

             <button
               className="w-full bg-[#002045] hover:bg-[#1a365d] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#002045]/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
               onClick={handleUpload}
               disabled={!parsed || uploading}
             >
               {uploading ? <Loader2 size={18} className="animate-spin" /> : <Rocket size={18} />}
               {uploading ? 'Uploading...' : 'Deploy Assessment'}
             </button>
          </div>
        </div>
      </main>
    </div>
  );
}
