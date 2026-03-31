import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
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
    <div className="page-bg" style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* ── Header ───────────────────────────────────── */}
        <div className="anim-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 44 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/dashboard')}>
            <ChevronLeft size={15} /> Back
          </button>
          <div>
            <h1 style={{ fontSize: '1.7rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Upload Test</h1>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>Paste JSON or drag a .json file</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── Drop Zone ──────────────────────────────── */}
          <div className="card anim-fade-up delay-1" style={{ padding: '28px 32px' }}>
            <div style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <FileUp size={17} color="var(--accent-2)" /> Upload JSON File
            </div>
            <label
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                padding: '36px 24px', borderRadius: 14,
                border: '2px dashed rgba(124,111,247,0.25)',
                cursor: 'pointer', textAlign: 'center',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-dim)'; }}
              onDragLeave={e => { e.currentTarget.style.borderColor = 'rgba(124,111,247,0.25)'; e.currentTarget.style.background = 'transparent'; }}
              onDrop={e => { e.currentTarget.style.borderColor = 'rgba(124,111,247,0.25)'; e.currentTarget.style.background = 'transparent'; handleDrop(e); }}
            >
              <input type="file" accept=".json" className="hidden" style={{ display: 'none' }} onChange={handleFileUpload} />
              <UploadCloud size={36} color="var(--accent)" style={{ opacity: 0.7 }} />
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  Drop your <span style={{ color: 'var(--accent-2)' }}>.json</span> file here
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-3)' }}>or click to open file picker</div>
              </div>
            </label>
          </div>

          {/* ── Textarea ───────────────────────────────── */}
          <div className="card anim-fade-up delay-2" style={{ padding: '28px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileJson size={17} color="var(--accent-2)" /> Paste JSON
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => handleJsonChange(SAMPLE_JSON)}
                style={{ fontSize: 12 }}
              >
                <BookOpen size={12} /> Load Sample
              </button>
            </div>

            <textarea
              className="input textarea"
              value={jsonText}
              onChange={e => handleJsonChange(e.target.value)}
              placeholder={`{\n  "title": "Test Title",\n  "duration": 30,\n  "questions": [...]\n}`}
            />

            {/* Validation Feedback */}
            {parseError && (
              <div className="alert alert-danger" style={{ marginTop: 14 }}>
                <XCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{parseError}</span>
              </div>
            )}
            {parsed && !parseError && (
              <div className="alert alert-success" style={{ marginTop: 14 }}>
                <CheckCircle2 size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>
                  Valid — <strong>"{parsed.title}"</strong> · {parsed.questions.length} questions · {parsed.duration} min
                </span>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {success && <div className="alert alert-success anim-fade-in">{success}</div>}
          {error   && <div className="alert alert-danger  anim-fade-in">{error}</div>}

          {/* Upload Button */}
          <button
            className="btn btn-primary btn-lg"
            onClick={handleUpload}
            disabled={!parsed || uploading}
            style={{ width: '100%' }}
          >
            {uploading ? <Loader2 size={18} className="spin" /> : <Rocket size={18} />}
            {uploading ? 'Uploading…' : 'Upload Test'}
          </button>

          {/* Schema Reference */}
          <div className="card anim-fade-up delay-3" style={{ padding: '24px 28px' }}>
            <div style={{ fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-2)', marginBottom: 16 }}>
              <BookOpen size={14} /> JSON Schema Reference
            </div>
            <pre style={{
              fontSize: 12, lineHeight: 1.8, color: 'var(--text-3)', fontFamily: 'monospace',
              overflowX: 'auto', padding: '16px', borderRadius: 10,
              background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)',
            }}>
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
