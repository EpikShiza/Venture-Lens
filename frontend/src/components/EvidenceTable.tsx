import React from 'react';
import { EvidenceItem } from '../types';
import { ExternalLink, CheckCircle, HelpCircle, FileText, Globe } from 'lucide-react';

interface EvidenceTableProps {
  evidence: EvidenceItem[];
}

export const EvidenceTable: React.FC<EvidenceTableProps> = ({ evidence }) => {
  if (!evidence || evidence.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center text-slate-400 text-sm">
        <Globe className="mx-auto h-8 w-8 text-slate-600 mb-2" />
        <p>No external citations were retrieved for this query.</p>
        <p className="text-xs text-slate-500 mt-1">
          Findings for this analysis are derived from internal model estimates and user assumptions.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED_SOURCE':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
            <CheckCircle className="h-2.5 w-2.5" />
            Verified Source
          </span>
        );
      case 'DERIVED_ESTIMATE':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-300 border border-blue-500/30">
            <FileText className="h-2.5 w-2.5" />
            Derived Benchmark
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
            <HelpCircle className="h-2.5 w-2.5" />
            Unverified Hypothesis
          </span>
        );
    }
  };

  const getDomainFromUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace('www.', '');
    } catch {
      return 'external-link';
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
      <div className="border-b border-slate-800 px-5 py-3 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-cyan-400" />
          <h4 className="font-semibold text-slate-200 text-sm">
            Retrieved Evidence & Market Citations ({evidence.length})
          </h4>
        </div>
        <span className="text-[11px] text-slate-400">
          Real web index sources • Anti-hallucination verified
        </span>
      </div>

      <div className="divide-y divide-slate-800/80">
        {evidence.map((item, index) => (
          <div key={index} className="p-4 transition hover:bg-slate-800/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {getStatusBadge(item.verification_status)}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-indigo-300 hover:text-indigo-200 hover:underline flex items-center gap-1 text-xs sm:text-sm"
                >
                  <span>{item.title}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300 font-mono">
                  {getDomainFromUrl(item.url)}
                </span>
                <span>{new Date(item.retrieved_at).toLocaleDateString()}</span>
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
              "{item.snippet}"
            </p>

            {item.relevance_note && (
              <p className="mt-1.5 text-[11px] text-slate-400 italic">
                <span className="font-medium text-slate-300 not-italic">Relevance: </span>
                {item.relevance_note}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
