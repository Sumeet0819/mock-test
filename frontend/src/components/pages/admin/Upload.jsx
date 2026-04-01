import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/axios';
import {
  ChevronLeft, UploadCloud, FileJson, Rocket,
  CheckCircle2, XCircle, BookOpen, FileUp, Loader2
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
    <div className="min-h-screen w-full bg-slate-950 text-slate-50 font-sans antialiased bg-[image:radial-gradient(ellipse_80%_60%_at_10%_-10%,rgba(99,102,241,0.13)_0%,transparent_55%),radial-gradient(ellipse_60%_50%_at_90%_100%,rgba(167,139,250,0.08)_0%,transparent_55%)]">
      <div className="max-w-[760px] mx-auto py-12 pb-20 px-6">

        {/* ── Header ───────────────────────────────────── */}
        <div className="flex items-center gap-4 mb-11">
          <button className="inline-flex items-center justify-center gap-[6px] font-semibold text-[13px] border-[1.5px] border-white/10 rounded-[12px] px-[16px] py-[8px] whitespace-nowrap bg-transparent text-slate-400 transition-all hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-violet-400" onClick={() => navigate('/admin/dashboard')}>
            <ChevronLeft size={15} /> Back
          </button>
          <div>
            <h1 className="text-[1.7rem] font-black tracking-[-0.02em]">Upload Test</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Paste JSON or drag a .json file</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">

          {/* ── Drop Zone ──────────────────────────────── */}
          <div className="bg-slate-900 border border-white/10 rounded-[24px] shadow-2xl shadow-black/40 py-7 px-8">
            <div className="font-semibold text-[15px] flex items-center gap-2 mb-4.5">
              <FileUp size={17} color="#a78bfa" /> Upload JSON File
            </div>
            <label
              className="flex flex-col items-center gap-3 py-9 px-6 rounded-[14px] border-2 border-dashed border-indigo-500/25 cursor-pointer text-center transition-[border-color,background] duration-200 hover:border-indigo-500 hover:bg-indigo-500/10"
              onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; }}
              onDragLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; e.currentTarget.style.background = 'transparent'; }}
              onDrop={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; e.currentTarget.style.background = 'transparent'; handleDrop(e); }}
            >
              <input type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
              <UploadCloud size={36} color="#6366f1" className="opacity-70" />
              <div>
                <div className="font-semibold mb-1">
                  Drop your <span className="text-violet-400">.json</span> file here
                </div>
                <div className="text-[13px] text-slate-500">or click to open file picker</div>
              </div>
            </label>
          </div>

          {/* ── Textarea ───────────────────────────────── */}
          <div className="bg-slate-900 border border-white/10 rounded-[24px] shadow-2xl shadow-black/40 py-7 px-8">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-[15px] flex items-center gap-2">
                <FileJson size={17} color="#a78bfa" /> Paste JSON
              </div>
              <button
                className="inline-flex items-center justify-center gap-[6px] font-semibold text-[13px] border-[1.5px] border-white/10 rounded-[12px] px-[16px] py-[8px] whitespace-nowrap bg-transparent text-slate-400 transition-all hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-violet-400 text-xs"
                onClick={() => handleJsonChange(SAMPLE_JSON)}
              >
                <BookOpen size={12} /> Load Sample
              </button>
            </div>

            <textarea
              className="w-full bg-white/5 border-[1.5px] border-white/10 text-slate-50 rounded-[16px] px-[18px] py-[14px] outline-none transition-all placeholder:text-slate-500 focus:border-indigo-500 focus:bg-indigo-500/10 focus:ring-4 focus:ring-indigo-500/10 min-h-[220px] resize-y font-mono text-[13px] leading-[1.6]"
              value={jsonText}
              onChange={e => handleJsonChange(e.target.value)}
              placeholder={`{\n  "title": "Test Title",\n  "duration": 30,\n  "questions": [...]\n}`}
            />

            {/* Validation Feedback */}
            {parseError && (
              <div className="flex items-start gap-[10px] px-[18px] py-[14px] rounded-[16px] text-[14px] leading-[1.5] bg-red-500/10 text-red-400 border border-red-500/20 mt-3.5">
                <XCircle size={15} className="shrink-0 mt-px" />
                <span>{parseError}</span>
              </div>
            )}
            {parsed && !parseError && (
              <div className="flex items-start gap-[10px] px-[18px] py-[14px] rounded-[16px] text-[14px] leading-[1.5] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-3.5">
                <CheckCircle2 size={15} className="shrink-0 mt-px" />
                <span>
                  Valid — <strong className="font-bold">"{parsed.title}"</strong> · {parsed.questions.length} questions · {parsed.duration} min
                </span>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {success && <div className="flex items-start gap-[10px] px-[18px] py-[14px] rounded-[16px] text-[14px] leading-[1.5] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{success}</div>}
          {error   && <div className="flex items-start gap-[10px] px-[18px] py-[14px] rounded-[16px] text-[14px] leading-[1.5] bg-red-500/10 text-red-400 border border-red-500/20">{error}</div>}

          {/* Upload Button */}
          <button
            className="inline-flex items-center justify-center gap-[8px] font-semibold text-[15px] rounded-[18px] px-[28px] py-[16px] whitespace-nowrap bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed w-full"
            onClick={handleUpload}
            disabled={!parsed || uploading}
          >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Rocket size={18} />}
            {uploading ? 'Uploading…' : 'Upload Test'}
          </button>

          {/* Schema Reference */}
          <div className="bg-slate-900 border border-white/10 rounded-[24px] shadow-2xl shadow-black/40 py-6 px-7">
            <div className="font-semibold text-[13px] flex items-center gap-2 text-slate-400 mb-4">
              <BookOpen size={14} /> JSON Schema Reference
            </div>
            <pre className="text-xs leading-[1.8] text-slate-500 font-mono overflow-x-auto p-4 rounded-[10px] bg-black/30 border border-white/10">
{`{
  "title":    "string (required)",
  "duration": number in minutes (required),
  "questions": [
    {
      "question":     "string (required)",
      "options":      ["A", "B", "C", "D"]  // min 2
      "correctAnswer": "must match one of options"
    }
  ]
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
