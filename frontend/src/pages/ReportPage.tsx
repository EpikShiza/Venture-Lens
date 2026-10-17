import React, { useState } from 'react';
import { AnalysisReportResponse } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { DimensionCard } from '../components/DimensionCard';
import { EvidenceTable } from '../components/EvidenceTable';
import { RedTeamSection } from '../components/RedTeamSection';
import { CompetitorMatrix } from '../components/CompetitorMatrix';
import { ExperimentCards } from '../components/ExperimentCards';
import { RoadmapTimeline } from '../components/RoadmapTimeline';
import { ExportModal } from '../components/ExportModal';
import { Download, ArrowLeft, Sparkles, Building2, Globe2, Briefcase, Info } from 'lucide-react';

interface ReportPageProps {
  report: AnalysisReportResponse;
  onBackToSaved: () => void;
  onNewAnalysis: () => void;
}

export const ReportPage: React.FC<ReportPageProps> = ({
  report,
  onBackToSaved,
  onNewAnalysis,
}) => {
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <button
            onClick={onBackToSaved}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Saved Reports</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {report.startup_name}
            </h1>
            <span className="rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
              {report.industry}
            </span>
            {report.is_mock && (
              <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                Demo Mock Fixture
              </span>
            )}
          </div>

          {report.tagline && (
            <p className="mt-1 text-sm text-slate-300 font-medium">{report.tagline}</p>
          )}

          {/* Metadata Badges */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5 text-cyan-400" />
              <span>{report.geographic_market}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-indigo-400" />
              <span>Target: {report.target_customer}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
              <span>{report.business_model}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Report</span>
          </button>

          <button
            onClick={onNewAnalysis}
            className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow-md shadow-indigo-600/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
          Diligence Executive Summary
        </h3>
        <p className="text-sm leading-relaxed text-slate-200 font-medium">
          {report.executive_summary}
        </p>
      </div>

      {/* Score Gauge */}
      <ScoreGauge scoreReport={report.score_report} />

      {/* 5-Dimensional Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">5-Dimensional Feasibility Breakdown</h3>
          <span className="text-xs text-slate-400">Total Weight: 100%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(report.score_report.dimensions).map(([key, dim]) => (
            <DimensionCard key={key} dimension={dim} />
          ))}
        </div>
      </div>

      {/* Adversarial Red-Team Review */}
      <RedTeamSection critique={report.adversarial_critique} />

      {/* Competitor Matrix */}
      <CompetitorMatrix competitors={report.competitors} />

      {/* Recommended Validation Experiments */}
      <ExperimentCards experiments={report.validation_experiments} />

      {/* 30-60-90 Day Execution Roadmap */}
      <RoadmapTimeline roadmap={report.roadmap} />

      {/* Verified Web Evidence Table */}
      <EvidenceTable evidence={report.evidence_sources} />

      {/* Disclaimer Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-400 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" />
        <p className="leading-relaxed">
          {report.limitations_disclaimer}
        </p>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal report={report} onClose={() => setShowExportModal(false)} />
      )}
    </div>
  );
};
