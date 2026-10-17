import React from 'react';
import { RoadmapPhase } from '../types';
import { Calendar, Flag, ShieldAlert, Check } from 'lucide-react';

interface RoadmapTimelineProps {
  roadmap: RoadmapPhase[];
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ roadmap }) => {
  if (!roadmap || roadmap.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-indigo-400" />
        <h3 className="text-base font-bold text-white">30-60-90 Day Execution Roadmap & Kill-Metrics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roadmap.map((phase, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition hover:border-slate-700"
          >
            <div>
              <div className="flex items-center space-x-2">
                <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-xs font-bold text-indigo-300 border border-indigo-500/30">
                  {phase.phase}
                </span>
                <span className="font-semibold text-slate-100 text-sm">{phase.title}</span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <span className="font-semibold text-slate-400 block text-[11px] uppercase tracking-wider">
                  Target Milestones:
                </span>
                <ul className="space-y-1.5 text-slate-200">
                  {phase.milestones.map((m, mIdx) => (
                    <li key={mIdx} className="flex items-start gap-2">
                      <div className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] text-indigo-400">
                        <Check className="h-2.5 w-2.5" />
                      </div>
                      <span className="leading-relaxed">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Kill Metric */}
            <div className="mt-5 rounded-lg border border-rose-900/30 bg-rose-950/20 p-3 text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-rose-400 text-[11px] uppercase tracking-wider mb-1">
                <ShieldAlert className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                <span>Pivot / Kill Metric</span>
              </div>
              <p className="text-rose-200/90 text-[11px] leading-relaxed">
                {phase.kill_metric}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
