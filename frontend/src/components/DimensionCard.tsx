import React from 'react';
import { DimensionBreakdown } from '../types';
import { CheckCircle2, AlertOctagon, TrendingUp } from 'lucide-react';

interface DimensionCardProps {
  dimension: DimensionBreakdown;
}

export const DimensionCard: React.FC<DimensionCardProps> = ({ dimension }) => {
  let barColor = 'bg-emerald-500';
  let badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

  if (dimension.raw_score < 55) {
    barColor = 'bg-rose-500';
    badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  } else if (dimension.raw_score < 72) {
    barColor = 'bg-amber-500';
    badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  } else if (dimension.raw_score < 82) {
    barColor = 'bg-blue-500';
    badgeColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
  }

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition hover:border-slate-700/80">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold text-slate-100 text-sm sm:text-base">{dimension.name}</h4>
            <span className="text-xs text-slate-400">Weight: {Math.round(dimension.weight * 100)}%</span>
          </div>

          <div className="text-right">
            <span className={`inline-block rounded-md border px-2 py-0.5 text-xs font-bold ${badgeColor}`}>
              {dimension.raw_score} / 100
            </span>
            <div className="text-[11px] text-slate-400 mt-0.5">
              +{dimension.weighted_score.toFixed(1)} pts to total
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${dimension.raw_score}%` }}
          />
        </div>

        {/* Qualitative Reasoning */}
        <p className="mt-3 text-xs leading-relaxed text-slate-300">
          {dimension.reasoning}
        </p>

        {/* Strengths & Risks */}
        <div className="mt-4 space-y-2 border-t border-slate-800/80 pt-3 text-xs">
          {dimension.strengths.length > 0 && (
            <div className="space-y-1">
              <span className="font-medium text-emerald-400 flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="h-3 w-3 shrink-0" />
                Key Drivers:
              </span>
              <ul className="list-inside space-y-0.5 text-slate-300 pl-1 text-[11px]">
                {dimension.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500/80 shrink-0">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {dimension.risks.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="font-medium text-amber-400 flex items-center gap-1 text-[11px]">
                <AlertOctagon className="h-3 w-3 shrink-0" />
                Vulnerabilities:
              </span>
              <ul className="list-inside space-y-0.5 text-slate-300 pl-1 text-[11px]">
                {dimension.risks.map((r, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500/80 shrink-0">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
