import React from 'react';
import { SystemStatusResponse } from '../types';
import { X, Cpu, Search, Database, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

interface SystemStatusModalProps {
  status: SystemStatusResponse | null;
  onClose: () => void;
}

export const SystemStatusModal: React.FC<SystemStatusModalProps> = ({ status, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">System Runtime & Provider Status</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4 text-xs">
          {/* AI Provider */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-indigo-400" />
                AI Inference Engine
              </span>
              <span className="rounded bg-indigo-500/20 px-2 py-0.5 font-mono text-indigo-300">
                {status?.ai_provider || 'Loading...'}
              </span>
            </div>
            <div className="mt-2 text-slate-400 space-y-1">
              <p>Active Model: <strong className="text-slate-200 font-mono">{status?.ai_model || 'N/A'}</strong></p>
              <div className="flex items-center gap-1.5 pt-1">
                {status?.gemini_key_configured ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Google Gemini API key configured on server</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-amber-400">No Gemini API key set (Running in deterministic Mock / Local mode)</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Search Provider */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Search className="h-4 w-4 text-cyan-400" />
                Market Search Provider
              </span>
              <span className="rounded bg-cyan-500/20 px-2 py-0.5 font-mono text-cyan-300">
                {status?.search_provider || 'Loading...'}
              </span>
            </div>
            <p className="mt-2 text-slate-400">
              Provider Mode: <strong className="text-slate-200">{status?.search_provider === 'duckduckgo' ? 'DuckDuckGo Live Index (No Key Required)' : status?.search_provider === 'tavily' ? 'Tavily Search API' : 'Curated Offline Benchmarks'}</strong>
            </p>
          </div>

          {/* Database */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Database className="h-4 w-4 text-emerald-400" />
                Persistence Layer
              </span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-emerald-300">
                {status?.database_url_type || 'sqlite'}
              </span>
            </div>
            <p className="mt-2 text-slate-400">
              Total Saved Analyses in Local Database: <strong className="text-slate-200">{status?.total_saved_reports ?? 0}</strong>
            </p>
          </div>

          {/* Security & Data Privacy Notice */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1">
              <Shield className="h-4 w-4 text-purple-400" />
              Security & Privacy Policy
            </span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              API keys are strictly managed server-side and never exposed to the frontend browser bundle.
              Idea submissions are stored locally in your SQLite database and are never used to train third-party public models.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
