import React, { useState } from 'react';
import { ScoreReport } from '../types';
import { Calculator, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface ScoreGaugeProps {
  scoreReport: ScoreReport;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ scoreReport }) => {
  const [showFormula, setShowFormula] = useState(false);
  const score = scoreReport.overall_score;

  // Determine color theme based on score
  let strokeColor = '#10B981'; // Green
  let gradeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  if (score < 55) {
    strokeColor = '#EF4444'; // Red
    gradeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  } else if (score < 72) {
    strokeColor = '#F59E0B'; // Amber
    gradeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else if (score < 82) {
    strokeColor = '#3B82F6'; // Blue
    gradeBg = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  }

  // Circular gauge math (radius = 56, circumference = 2 * PI * 56 ≈ 351.85)
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Circular Score Gauge */}
        <div className="flex items-center space-x-6">
          <div className="relative flex items-center justify-center">
            <svg className="h-36 w-36 -rotate-90 transform" viewBox="0 0 130 130">
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke={strokeColor}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold tracking-tight text-white">{score}</span>
              <span className="text-xs font-medium text-slate-400">OUT OF 100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-3">
              <span className={`rounded-lg border px-3 py-1 text-sm font-bold ${gradeBg}`}>
                Grade: {scoreReport.grade}
              </span>
              <span className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300">
                Composite Index
              </span>
            </div>

            <h3 className="mt-2 text-lg font-bold text-slate-100">{scoreReport.verdict}</h3>
            
            <div className="mt-1 flex items-center space-x-1.5 text-xs text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span>{scoreReport.confidence_level}</span>
            </div>
          </div>
        </div>

        {/* Right: Scoring Transparency Toggle & Penalties summary */}
        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowFormula(!showFormula)}
            className="flex items-center space-x-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>{showFormula ? 'Hide Scoring Formula' : 'View Transparent Formula'}</span>
          </button>

          {scoreReport.penalties_applied.length > 0 && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-300 max-w-sm">
              <div className="flex items-center space-x-1.5 font-semibold">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>{scoreReport.penalties_applied.length} Risk Penalty Deductions Applied</span>
              </div>
              <ul className="mt-1 list-disc pl-4 space-y-0.5 text-amber-200/80 text-[11px]">
                {scoreReport.penalties_applied.map((p, idx) => (
                  <li key={idx}>
                    -{p.deduction} pts: {p.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Formula Drawer */}
      {showFormula && (
        <div className="mt-4 rounded-xl border border-slate-700/60 bg-slate-950 p-4 text-xs">
          <div className="flex items-center space-x-2 text-slate-300 font-semibold mb-1">
            <Calculator className="h-4 w-4 text-indigo-400" />
            <span>Deterministic Scoring Formula & Weight Allocation</span>
          </div>
          <code className="block rounded bg-slate-900 p-2 font-mono text-cyan-300">
            {scoreReport.formula_explanation}
          </code>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
            <div className="rounded border border-slate-800 bg-slate-900/50 p-1.5">
              <span className="block text-slate-400">Problem Urgency</span>
              <span className="font-bold text-white">20% weight</span>
            </div>
            <div className="rounded border border-slate-800 bg-slate-900/50 p-1.5">
              <span className="block text-slate-400">Market Need</span>
              <span className="font-bold text-white">25% weight</span>
            </div>
            <div className="rounded border border-slate-800 bg-slate-900/50 p-1.5">
              <span className="block text-slate-400">Competitive Moat</span>
              <span className="font-bold text-white">20% weight</span>
            </div>
            <div className="rounded border border-slate-800 bg-slate-900/50 p-1.5">
              <span className="block text-slate-400">Business Model</span>
              <span className="font-bold text-white">20% weight</span>
            </div>
            <div className="rounded border border-slate-800 bg-slate-900/50 p-1.5">
              <span className="block text-slate-400">Tech Feasibility</span>
              <span className="font-bold text-white">15% weight</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
