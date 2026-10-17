import React, { useState } from 'react';
import { StartupInput, AnalysisReportResponse } from '../types';
import { createAnalysis } from '../services/api';
import { Sparkles, Loader2, AlertCircle, BookmarkPlus, CheckCircle2 } from 'lucide-react';

interface AnalyzePageProps {
  onAnalysisSuccess: (report: AnalysisReportResponse) => void;
}

const PREFILL_SAMPLES: Record<string, StartupInput> = {
  biotech: {
    startup_name: 'DocuFlow AI',
    tagline: 'Automated FDA regulatory dossier compilation for mid-size biotechs',
    problem_statement: 'Clinical-stage biotechs spend over $50k/day in cash burn while waiting on manual CRO consultants to compile FDA Investigational New Drug (IND) submission dossiers.',
    solution_description: 'An AI-powered pre-audit engine that validates clinical protocols against historical FDA Complete Response Letters and eCTD specifications in 15 minutes.',
    target_customer: 'Regulatory Affairs Vice Presidents at mid-size clinical-stage biotechs (Series A/B)',
    geographic_market: 'United States & European Union',
    industry: 'BioTech / Regulatory SaaS',
    business_model: 'B2B SaaS ($35,000 annual license + $5,000 per IND filing module)',
    available_budget_usd: 25000,
    timeframe_months: 6,
    known_competitors: ['Veeva Systems', 'Parexel', 'Manual Excel & Word'],
    pricing_hypothesis: '$35,000 annual platform fee with $5,000 per dossier audit module.',
    additional_notes: 'Spoke with 4 regulatory directors who confirmed manual CRO audits take 6 weeks.',
  },
  qcommerce: {
    startup_name: 'QuickCart 15',
    tagline: '15-minute ultra-fast grocery and essentials delivery for suburban neighborhoods',
    problem_statement: 'Suburban parents frequently run out of essential groceries during weekday evenings but face 45+ minute delivery times on standard delivery apps.',
    solution_description: 'A network of suburban micro-fulfillment dark stores promising 15-minute delivery via dedicated electric scooter couriers.',
    target_customer: 'Suburban busy parents and young professionals in residential corridors',
    geographic_market: 'Dallas-Fort Worth suburban corridor, USA',
    industry: 'Consumer Tech / Quick Commerce',
    business_model: 'On-demand retail markup (15%) + $2.99 delivery fee + monthly $9.99 prime subscription',
    available_budget_usd: 8000,
    timeframe_months: 4,
    known_competitors: ['Instacart', 'DoorDash DashMart', 'Gopuff'],
    pricing_hypothesis: '15% grocery markup plus $2.99 delivery fee.',
    additional_notes: 'Suburban delivery distances average 4.2 miles round-trip.',
  },
  climate: {
    startup_name: 'FleetCarbon',
    tagline: 'Automated Scope 1 & 3 carbon accounting API for logistics fleets',
    problem_statement: 'Mid-size freight fleets in Europe face pending CSRD and Scope 3 compliance penalties in 2026 but cannot afford enterprise climate consultancies costing $60k+.',
    solution_description: 'A lightweight API & telematics plugin that converts GPS and fuel telemetry into audit-ready Scope 1 & 3 carbon reports in under 5 minutes.',
    target_customer: 'Fleet managers and operations directors at mid-size trucking companies (50-500 vehicles) in the EU.',
    geographic_market: 'European Union (Germany, Netherlands, France)',
    industry: 'ClimateTech / Supply Chain Logistics',
    business_model: 'B2B SaaS tiered by active fleet size ($15/vehicle/month)',
    available_budget_usd: 15000,
    timeframe_months: 6,
    known_competitors: ['Watershed', 'Sweep', 'Manual Spreadsheets'],
    pricing_hypothesis: '$15 to $25 per truck per month with a $2,500 annual platform fee.',
    additional_notes: 'Spoke with 3 EU freight operators who confirmed manual carbon reporting takes 20 hours per month.',
  },
};

const ANALYSIS_STAGES = [
  'Stage 1: Structuring idea & extracting domain parameters...',
  'Stage 2: Querying live web index for competitor evidence...',
  'Stage 3: Computing transparent dimensional scores & applying risk penalties...',
  'Stage 4: Running adversarial investor red-team diligence...',
  'Stage 5: Reconciling verified findings & synthesizing action plan...',
];

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ onAnalysisSuccess }) => {
  const [formData, setFormData] = useState<StartupInput>({
    startup_name: '',
    tagline: '',
    problem_statement: '',
    solution_description: '',
    target_customer: '',
    geographic_market: '',
    industry: '',
    business_model: '',
    available_budget_usd: 10000,
    timeframe_months: 6,
    known_competitors: [],
    pricing_hypothesis: '',
    additional_notes: '',
  });

  const [competitorsText, setCompetitorsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handlePreFill = (key: string) => {
    const sample = PREFILL_SAMPLES[key];
    if (sample) {
      setFormData(sample);
      setCompetitorsText(sample.known_competitors?.join(', ') || '');
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!formData.startup_name.trim()) {
      setError('Startup Name is required.');
      return;
    }
    if (formData.problem_statement.trim().length < 20) {
      setError('Problem Statement must be at least 20 characters.');
      return;
    }
    if (formData.solution_description.trim().length < 20) {
      setError('Solution Description must be at least 20 characters.');
      return;
    }
    if (!formData.target_customer.trim()) {
      setError('Target Customer ICP is required.');
      return;
    }
    if (!formData.industry.trim()) {
      setError('Industry / Sector is required.');
      return;
    }

    const payload: StartupInput = {
      ...formData,
      known_competitors: competitorsText
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
    };

    setLoading(true);
    setCurrentStageIdx(0);

    // Stage ticker for truthful user feedback
    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => (prev < ANALYSIS_STAGES.length - 1 ? prev + 1 : prev));
    }, 2800);

    try {
      const report = await createAnalysis(payload);
      clearInterval(interval);
      onAnalysisSuccess(report);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || 'An error occurred during startup evaluation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Startup Feasibility Analysis</h2>
        <p className="mt-1 text-sm text-slate-400">
          Submit your startup parameters. VentureLens will execute web competitor diligence, transparent scoring, and red-team stress testing.
        </p>

        {/* Quick Pre-fill Buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">Quick Demo Pre-fills:</span>
          <button
            type="button"
            onClick={() => handlePreFill('biotech')}
            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:border-indigo-500 hover:text-white transition"
          >
            DocuFlow (BioTech B2B)
          </button>
          <button
            type="button"
            onClick={() => handlePreFill('qcommerce')}
            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:border-rose-500 hover:text-white transition"
          >
            QuickCart (Q-Commerce Red-Flag)
          </button>
          <button
            type="button"
            onClick={() => handlePreFill('climate')}
            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:border-emerald-500 hover:text-white transition"
          >
            FleetCarbon (Climate API)
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <div>
            <span className="font-semibold block">Submission Error:</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center backdrop-blur-md">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-indigo-400 mb-4" />
          <h3 className="text-lg font-bold text-white">Running 5-Stage Diligence Engine</h3>
          <p className="text-xs text-slate-400 mt-1">This process conducts live searches and deep evaluation.</p>

          <div className="mt-8 max-w-md mx-auto space-y-3 text-left">
            {ANALYSIS_STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIdx;
              const isCurrent = idx === currentStageIdx;
              return (
                <div
                  key={idx}
                  className={`flex items-center space-x-3 rounded-lg p-2.5 text-xs transition ${
                    isCurrent
                      ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/30'
                      : isPast
                      ? 'text-slate-400'
                      : 'text-slate-600'
                  }`}
                >
                  {isPast ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-400 shrink-0" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span className={isCurrent ? 'font-semibold' : ''}>{stage}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">1. Core Venture Identity</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Startup Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DocuFlow AI"
                  value={formData.startup_name}
                  onChange={(e) => setFormData({ ...formData, startup_name: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  One-Line Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Automated FDA regulatory dossier compilation"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Industry / Category <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BioTech / Regulatory SaaS"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Geographic Market <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. United States & European Union"
                  value={formData.geographic_market}
                  onChange={(e) => setFormData({ ...formData, geographic_market: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">2. Problem & Value Proposition</h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Problem Statement & Customer Pain <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="What urgent, expensive pain does the customer suffer from? Quantify time/money waste if known..."
                value={formData.problem_statement}
                onChange={(e) => setFormData({ ...formData, problem_statement: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Proposed Solution & Product Mechanism <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="How does your product solve the problem? What is the core workflow or technical mechanism?"
                value={formData.solution_description}
                onChange={(e) => setFormData({ ...formData, solution_description: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target Customer Profile (Ideal Customer Profile) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Regulatory Affairs Vice Presidents at biotechs (50-200 employees)"
                value={formData.target_customer}
                onChange={(e) => setFormData({ ...formData, target_customer: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">3. Business Model & Constraints</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Business & Monetization Model <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B2B SaaS annual license + usage modules"
                  value={formData.business_model}
                  onChange={(e) => setFormData({ ...formData, business_model: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Pricing Hypothesis
                </label>
                <input
                  type="text"
                  placeholder="e.g. $35,000/year plus $5,000 per module"
                  value={formData.pricing_hypothesis || ''}
                  onChange={(e) => setFormData({ ...formData, pricing_hypothesis: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Available Budget ($ USD): <strong className="text-white">${formData.available_budget_usd.toLocaleString()}</strong>
                </label>
                <input
                  type="range"
                  min={500}
                  max={100000}
                  step={500}
                  value={formData.available_budget_usd}
                  onChange={(e) => setFormData({ ...formData, available_budget_usd: Number(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target MVP Timeframe: <strong className="text-white">{formData.timeframe_months} months</strong>
                </label>
                <input
                  type="range"
                  min={1}
                  max={24}
                  step={1}
                  value={formData.timeframe_months}
                  onChange={(e) => setFormData({ ...formData, timeframe_months: Number(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Known Competitors or Existing Alternatives (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Veeva Systems, Parexel, Manual Excel spreadsheets"
                value={competitorsText}
                onChange={(e) => setCompetitorsText(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Additional Notes / Founder Traction (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Any customer discovery interviews already conducted, pre-orders, or domain expertise..."
                value={formData.additional_notes || ''}
                onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>Generate Diligence Report</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
