import React from 'react';
import { ValidationExperiment } from '../types';
import { FlaskConical, Target, Clock, DollarSign, CheckCircle2 } from 'lucide-react';

interface ExperimentCardsProps {
  experiments: ValidationExperiment[];
}

export const ExperimentCards: React.FC<ExperimentCardsProps> = ({ experiments }) => {
  if (!experiments || experiments.length === 0) return null;

  const getPriorityBadge = (priority: string) => {
    if (priority.toLowerCase().includes('critical')) {
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    } else if (priority.toLowerCase().includes('high')) {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
    return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <FlaskConical className="h-5 w-5 text-emerald-400" />
        <h3 className="text-base font-bold text-white">Recommended Validation Experiments</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {experiments.map((exp) => (
          <div
            key={exp.id}
            className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition hover:border-slate-700"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getPriorityBadge(exp.priority)}`}>
                  {exp.priority}
                </span>
                <div className="flex items-center space-x-3 text-slate-400 text-xs">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-emerald-400" />
                    <span>${exp.estimated_cost_usd}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-indigo-400" />
                    <span>{exp.estimated_days}d</span>
                  </span>
                </div>
              </div>

              <h4 className="mt-3 font-bold text-slate-100 text-sm">{exp.name}</h4>

              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">Hypothesis to Prove:</span>
                  <p className="text-slate-200 mt-0.5 leading-relaxed">{exp.hypothesis_tested}</p>
                </div>

                <div className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 block">Method / Test Setup:</span>
                  <p className="text-slate-300 mt-0.5 text-[11px] leading-relaxed">{exp.method}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-800/80 pt-3">
              <div className="flex items-start gap-1.5 text-xs text-emerald-400">
                <Target className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-[11px]">Pass/Fail Threshold:</span>
                  <span className="text-slate-200 text-[11px]">{exp.target_threshold}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
