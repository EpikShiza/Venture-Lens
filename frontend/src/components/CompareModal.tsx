import React, { useState, useEffect } from 'react';
import { AnalysisReportResponse } from '../types';
import { getAnalysis } from '../services/api';
import { X, ArrowRightLeft, Scale } from 'lucide-react';

interface CompareModalProps {
  reportA: AnalysisReportResponse;
  reportBId: string;
  onClose: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({ reportA, reportBId, onClose }) => {
  const [reportB, setReportB] = useState<AnalysisReportResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchB() {
      try {
        const data = await getAnalysis(reportBId);
        setReportB(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load second report');
      } finally {
        setLoading(false);
      }
    }
    fetchB();
  }, [reportBId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center space-x-2">
            <Scale className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Side-by-Side Startup Comparison</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading comparison data...</div>
          ) : error || !reportB ? (
            <div className="py-12 text-center text-rose-400">{error || 'Unable to load report'}</div>
          ) : (
            <div className="space-y-6">
              {/* Header Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-center">
                  <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider block">Startup A</span>
                  <h4 className="text-lg font-bold text-white mt-1">{reportA.startup_name}</h4>
                  <p className="text-xs text-slate-400">{reportA.industry}</p>
                  <div className="mt-3">
                    <span className="text-3xl font-extrabold text-white">{reportA.score_report.overall_score}</span>
                    <span className="text-xs text-slate-400">/100</span>
                    <span className="ml-2 rounded bg-indigo-500/20 px-2 py-0.5 text-xs font-bold text-indigo-300">
                      {reportA.score_report.grade}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-medium text-slate-300">{reportA.score_report.verdict}</p>
                </div>

                <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-center">
                  <span className="text-xs text-cyan-300 font-semibold uppercase tracking-wider block">Startup B</span>
                  <h4 className="text-lg font-bold text-white mt-1">{reportB.startup_name}</h4>
                  <p className="text-xs text-slate-400">{reportB.industry}</p>
                  <div className="mt-3">
                    <span className="text-3xl font-extrabold text-white">{reportB.score_report.overall_score}</span>
                    <span className="text-xs text-slate-400">/100</span>
                    <span className="ml-2 rounded bg-cyan-500/20 px-2 py-0.5 text-xs font-bold text-cyan-300">
                      {reportB.score_report.grade}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-medium text-slate-300">{reportB.score_report.verdict}</p>
                </div>
              </div>

              {/* Dimensional Breakdown Comparison */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <h5 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">
                  Dimensional Raw Score Comparison
                </h5>
                <div className="space-y-3">
                  {Object.keys(reportA.score_report.dimensions).map((key) => {
                    const dimA = reportA.score_report.dimensions[key];
                    const dimB = reportB.score_report.dimensions[key];
                    if (!dimA || !dimB) return null;
                    const diff = dimA.raw_score - dimB.raw_score;

                    return (
                      <div key={key} className="border-t border-slate-800/80 pt-2 text-xs">
                        <div className="flex items-center justify-between text-slate-300 mb-1">
                          <span className="font-medium">{dimA.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {diff > 0 ? `A leads by +${diff.toFixed(1)}` : diff < 0 ? `B leads by +${Math.abs(diff).toFixed(1)}` : 'Tied'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <div className="h-2 flex-1 rounded-full bg-slate-800 overflow-hidden">
                              <div className="h-full bg-indigo-500" style={{ width: `${dimA.raw_score}%` }} />
                            </div>
                            <span className="w-8 font-mono text-right text-indigo-300 font-semibold">{dimA.raw_score}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="h-2 flex-1 rounded-full bg-slate-800 overflow-hidden">
                              <div className="h-full bg-cyan-500" style={{ width: `${dimB.raw_score}%` }} />
                            </div>
                            <span className="w-8 font-mono text-right text-cyan-300 font-semibold">{dimB.raw_score}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key Comparison Points */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <span className="font-semibold text-slate-400 block mb-1">Target Customer & Model:</span>
                  <p className="text-slate-200"><strong>Customer:</strong> {reportA.target_customer}</p>
                  <p className="text-slate-200 mt-1"><strong>Model:</strong> {reportA.business_model}</p>
                  <p className="text-slate-400 mt-2">Competitors: {reportA.competitors.length} | Evidence: {reportA.evidence_sources.length}</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <span className="font-semibold text-slate-400 block mb-1">Target Customer & Model:</span>
                  <p className="text-slate-200"><strong>Customer:</strong> {reportB.target_customer}</p>
                  <p className="text-slate-200 mt-1"><strong>Model:</strong> {reportB.business_model}</p>
                  <p className="text-slate-400 mt-2">Competitors: {reportB.competitors.length} | Evidence: {reportB.evidence_sources.length}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
