import React, { useState } from 'react';
import { AnalysisReportResponse } from '../types';
import { exportAnalysis } from '../services/api';
import { X, Download, Copy, Check, FileCode, FileText } from 'lucide-react';

interface ExportModalProps {
  report: AnalysisReportResponse;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ report, onClose }) => {
  const [format, setFormat] = useState<'markdown' | 'json'>('markdown');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  React.useEffect(() => {
    async function loadContent() {
      setLoading(true);
      try {
        const res = await exportAnalysis(report.id, format);
        if (typeof res === 'string') {
          setContent(res);
        } else {
          setContent(JSON.stringify(res, null, 2));
        }
      } catch (err) {
        setContent(`Error exporting: ${err}`);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, [report.id, format]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = format === 'markdown' ? 'md' : 'json';
    const mime = format === 'markdown' ? 'text/markdown' : 'application/json';
    const filename = `venturelens_${report.startup_name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${ext}`;
    
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-white">Export Feasibility Report</h3>
            <p className="text-xs text-slate-400">Startup: {report.startup_name}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60 px-6 py-2.5">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFormat('markdown')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                format === 'markdown'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Markdown (.md)</span>
            </button>
            <button
              onClick={() => setFormat('json')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                format === 'json'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>JSON (.json)</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              disabled={loading}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={loading}
              className="flex items-center space-x-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-6 bg-slate-950 font-mono text-xs text-slate-300">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-400">
              Generating export document...
            </div>
          ) : (
            <pre className="whitespace-pre-wrap select-all">{content}</pre>
          )}
        </div>
      </div>
    </div>
  );
};
