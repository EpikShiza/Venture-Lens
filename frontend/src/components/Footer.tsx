import React from 'react';
import { ShieldCheck, Info, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8 text-xs text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-200">VentureLens</span>
            <span>— Open-Source AI Startup Diligence & Feasibility Engine</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Evidence-Backed Verification</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Terminal className="h-4 w-4 text-indigo-400" />
              <span>Deterministic Scoring Rules</span>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-slate-900 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-slate-400">
          <p className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>
              Disclaimer: VentureLens scores are algorithmic estimates based on defined criteria and available search evidence.
              They do not guarantee venture funding or commercial success.
            </span>
          </p>
          <span className="shrink-0">Hackathon Edition • Apache 2.0 License</span>
        </div>
      </div>
    </footer>
  );
};
