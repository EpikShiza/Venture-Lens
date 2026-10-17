import React from 'react';
import { AdversarialCritique } from '../types';
import { Flame, AlertTriangle, Crosshair, Skull, ShieldAlert, CheckSquare } from 'lucide-react';

interface RedTeamSectionProps {
  critique: AdversarialCritique;
}

export const RedTeamSection: React.FC<RedTeamSectionProps> = ({ critique }) => {
  return (
    <div className="rounded-2xl border border-rose-900/40 bg-gradient-to-b from-rose-950/20 via-slate-900/40 to-slate-900/40 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-900/40 pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white">Adversarial Investor Diligence (Red-Team)</h3>
              <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 uppercase tracking-wider">
                Stress-Test
              </span>
            </div>
            <p className="text-xs text-rose-200/70">
              Simulated harsh LP/GP persona: <span className="font-semibold text-rose-200">{critique.investor_persona}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Fatal Flaws */}
        <div className="rounded-xl border border-rose-900/30 bg-rose-950/10 p-4">
          <h4 className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-rose-400">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>Structural Flaws & Blindspots</span>
          </h4>
          <ul className="mt-3 space-y-2 text-xs text-slate-200">
            {critique.fatal_flaws.map((flaw, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span>{flaw}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Untested Assumptions */}
        <div className="rounded-xl border border-amber-900/30 bg-amber-950/10 p-4">
          <h4 className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Fragile Unvalidated Assumptions</span>
          </h4>
          <ul className="mt-3 space-y-2 text-xs text-slate-200">
            {critique.untested_assumptions.map((ass, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold shrink-0">?</span>
                <span>{ass}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Distribution Hurdles */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h4 className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <Crosshair className="h-4 w-4 shrink-0" />
            <span>Go-To-Market & CAC Friction</span>
          </h4>
          <ul className="mt-3 space-y-2 text-xs text-slate-200">
            {critique.distribution_hurdles.map((dh, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400 shrink-0">→</span>
                <span>{dh}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Incumbent Threat */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h4 className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>Incumbent Retaliation Analysis</span>
          </h4>
          <p className="mt-3 text-xs leading-relaxed text-slate-300">
            {critique.incumbent_threat_analysis}
          </p>
        </div>
      </div>

      {/* Pre-Mortem Scenario Callout */}
      <div className="mt-5 rounded-xl border border-rose-900/40 bg-rose-950/20 p-4">
        <div className="flex items-center space-x-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
          <Skull className="h-4 w-4 text-rose-400" />
          <span>18-Month Pre-Mortem: How This Company Dies If Unchecked</span>
        </div>
        <p className="mt-2 text-xs italic text-rose-100/90 leading-relaxed">
          "{critique.pre_mortem_scenario}"
        </p>
      </div>

      {/* Required Proof Points */}
      <div className="mt-5 rounded-xl border border-emerald-900/30 bg-emerald-950/10 p-4">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <CheckSquare className="h-4 w-4" />
          <span>Non-Negotiable Proof Points Required Before Writing Code</span>
        </div>
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-100">
          {critique.required_proof_points.map((pt, idx) => (
            <li key={idx} className="flex items-start gap-2 bg-emerald-950/20 p-2 rounded-lg border border-emerald-800/20">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
