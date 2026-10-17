import React from 'react';
import { Compass, Sparkles, ShieldCheck, Flame, Calculator, FlaskConical, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface LandingPageProps {
  onStartAnalysis: () => void;
  onViewSaved: () => void;
  onOpenSample: (sampleId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAnalysis,
  onViewSaved,
  onOpenSample,
}) => {
  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 mb-6 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Hackathon-Grade Startup Diligence Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Turn startup ideas into{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            evidence-backed decisions.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Don't rely on generic AI cheerleading. VentureLens evaluates startup viability through real competitor search,
          mathematically transparent scoring, and an adversarial investor red-team that stress-tests your assumptions.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartAnalysis}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110 active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            <span>Evaluate Your Startup Idea</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={onViewSaved}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
          >
            <span>View Preloaded Benchmarks</span>
          </button>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white">How VentureLens Differs From Generic Chatbots</h2>
          <p className="text-sm text-slate-400 mt-2">Engineered specifically for founders, students, and hackathon teams.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Real Web Evidence</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Separates verified market citations from unverified founder hypotheses. No hallucinated citations or URLs.
              </p>
            </div>
            <div className="mt-4 text-[11px] text-indigo-400 font-semibold">Source verification →</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                <Flame className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Adversarial Red-Team</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                A skeptical investor persona identifies fatal flaws, distribution traps, incumbent threats, and an 18-month pre-mortem.
              </p>
            </div>
            <div className="mt-4 text-[11px] text-rose-400 font-semibold">Harsh stress-tests →</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Calculator className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Explainable Scoring</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Deterministic weights across Problem (20%), Market (25%), Moat (20%), Business (20%), and Tech (15%) with explicit risk penalties.
              </p>
            </div>
            <div className="mt-4 text-[11px] text-emerald-400 font-semibold">Zero black-box scores →</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                <FlaskConical className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Actionable Experiments</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Suggests concrete, cheap validation experiments with explicit pass/fail metrics before writing production code.
              </p>
            </div>
            <div className="mt-4 text-[11px] text-cyan-400 font-semibold">Empirical de-risking →</div>
          </div>
        </div>
      </section>

      {/* Honest Capabilities: What VentureLens Can & Cannot Establish */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-white text-center">
            Transparency: What VentureLens Can & Cannot Establish
          </h3>
          <p className="text-xs text-slate-400 text-center mt-1">
            Understanding the boundaries of automated AI startup diligence.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Can Establish */}
            <div className="space-y-3">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <CheckCircle2 className="h-4 w-4" />
                What VentureLens Can Establish
              </span>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Clarity and coherence of the proposed problem and customer ICP</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Existing published competitors and current pricing models</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Structural unit economics red flags (e.g. CAC traps, negative contribution margin)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Mathematical breakdown of dimensional feasibility with risk deductions</span>
                </li>
              </ul>
            </div>

            {/* Cannot Establish */}
            <div className="space-y-3">
              <span className="font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <XCircle className="h-4 w-4" />
                What AI Cannot Guarantee
              </span>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Guaranteed commercial success or future venture investment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Actual customer willingness-to-pay without empirical discovery interviews</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Founder execution velocity, perseverance, and team chemistry</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Unpublished stealth competitors or proprietary internal enterprise roadmaps</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Preloaded Benchmark Teasers */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Or explore preloaded evaluation archetypes
        </h3>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onOpenSample('seed-docuflow-001')}
            className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-xs font-medium text-slate-200 hover:border-indigo-500/50 hover:bg-slate-800 transition"
          >
            <span className="font-bold text-white">DocuFlow AI</span> (Score: 83.5 / Grade A • B2B BioTech)
          </button>

          <button
            onClick={() => onOpenSample('seed-quickcart-002')}
            className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-xs font-medium text-slate-200 hover:border-rose-500/50 hover:bg-slate-800 transition"
          >
            <span className="font-bold text-white">QuickCart 15</span> (Score: 42.0 / Grade D • Q-Commerce Red-Flag)
          </button>
        </div>
      </section>
    </div>
  );
};
