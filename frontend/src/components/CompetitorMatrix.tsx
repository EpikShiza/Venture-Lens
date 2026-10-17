import React from 'react';
import { CompetitorItem } from '../types';
import { Swords, ShieldCheck, Zap, DollarSign } from 'lucide-react';

interface CompetitorMatrixProps {
  competitors: CompetitorItem[];
}

export const CompetitorMatrix: React.FC<CompetitorMatrixProps> = ({ competitors }) => {
  if (!competitors || competitors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Swords className="h-5 w-5 text-indigo-400" />
        <h3 className="text-base font-bold text-white">Competitor Landscape & Differentiator Wedges</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {competitors.map((comp, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition hover:border-slate-700 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm sm:text-base">{comp.name}</h4>
                  <span className="inline-block mt-0.5 rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300 border border-slate-700">
                    {comp.type}
                  </span>
                </div>
                {comp.pricing_model && (
                  <span className="flex items-center gap-1 rounded bg-slate-800/80 px-2 py-0.5 text-[11px] text-slate-400">
                    <DollarSign className="h-3 w-3 text-emerald-400" />
                    <span>{comp.pricing_model}</span>
                  </span>
                )}
              </div>

              <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                {comp.description}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs border-t border-slate-800/80 pt-3">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 block mb-1">Their Strengths:</span>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {comp.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-emerald-500 shrink-0">+</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-rose-400 block mb-1">Their Vulnerabilities:</span>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {comp.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-rose-500 shrink-0">-</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Differentiator Wedge */}
            <div className="mt-4 rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-indigo-300 text-[11px] uppercase tracking-wider mb-1">
                <Zap className="h-3.5 w-3.5 text-indigo-400" />
                <span>The VentureLens Wedge</span>
              </div>
              <p className="text-indigo-100/90 leading-relaxed">
                {comp.differentiator_wedge}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
