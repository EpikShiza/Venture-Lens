import React, { useState, useEffect } from 'react';
import { AnalysisSummaryItem, AnalysisReportResponse } from '../types';
import { listAnalyses, deleteAnalysis, getAnalysis, seedDemoData } from '../services/api';
import { CompareModal } from '../components/CompareModal';
import {
  FolderArchive,
  Search,
  Trash2,
  ExternalLink,
  Scale,
  RefreshCw,
  Plus,
  AlertCircle,
  Building,
} from 'lucide-react';

interface SavedReportsPageProps {
  onOpenReport: (report: AnalysisReportResponse) => void;
  onNewAnalysis: () => void;
}

export const SavedReportsPage: React.FC<SavedReportsPageProps> = ({
  onOpenReport,
  onNewAnalysis,
}) => {
  const [reports, setReports] = useState<AnalysisSummaryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Comparison State
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [compareReportA, setCompareReportA] = useState<AnalysisReportResponse | null>(null);
  const [compareReportBId, setCompareReportBId] = useState<string | null>(null);

  const fetchReports = async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAnalyses(query);
      setReports(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch saved reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports(searchQuery);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the evaluation for "${name}"?`)) {
      try {
        await deleteAnalysis(id);
        setReports(reports.filter((r) => r.id !== id));
        setSelectedForCompare(selectedForCompare.filter((item) => item !== id));
      } catch (err: any) {
        alert(`Failed to delete: ${err.message}`);
      }
    }
  };

  const handleOpen = async (id: string) => {
    try {
      const fullReport = await getAnalysis(id);
      onOpenReport(fullReport);
    } catch (err: any) {
      alert(`Could not load report: ${err.message}`);
    }
  };

  const handleSeed = async () => {
    try {
      await seedDemoData();
      await fetchReports();
    } catch (err: any) {
      alert(`Seed failed: ${err.message}`);
    }
  };

  const toggleSelectForCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((item) => item !== id));
    } else {
      if (selectedForCompare.length >= 2) {
        // Keep latest 2
        setSelectedForCompare([selectedForCompare[1], id]);
      } else {
        setSelectedForCompare([...selectedForCompare, id]);
      }
    }
  };

  const startComparison = async () => {
    if (selectedForCompare.length === 2) {
      try {
        const fullA = await getAnalysis(selectedForCompare[0]);
        setCompareReportA(fullA);
        setCompareReportBId(selectedForCompare[1]);
      } catch (err: any) {
        alert(`Failed to prepare comparison: ${err.message}`);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderArchive className="h-6 w-6 text-indigo-400" />
            <span>Saved Diligence Reports</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Revisit historical analyses, compare startup ideas side-by-side, or export past findings.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSeed}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
            title="Auto-seeds benchmark examples into local SQLite database"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Seed Benchmarks</span>
          </button>

          <button
            onClick={onNewAnalysis}
            className="flex items-center space-x-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Search & Compare Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
        </form>

        {selectedForCompare.length > 0 && (
          <div className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-xs text-indigo-300">
            <span>Selected for compare: {selectedForCompare.length} / 2</span>
            {selectedForCompare.length === 2 && (
              <button
                onClick={startComparison}
                className="flex items-center space-x-1 rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-indigo-500 transition ml-2"
              >
                <Scale className="h-3 w-3" />
                <span>Compare Now</span>
              </button>
            )}
            <button
              onClick={() => setSelectedForCompare([])}
              className="text-slate-400 hover:text-white text-[11px] ml-2"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs">
          Loading saved analyses...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 py-16 text-center">
          <Building className="mx-auto h-10 w-10 text-slate-600 mb-3" />
          <h4 className="text-sm font-bold text-slate-300">No startup reports found</h4>
          <p className="text-xs text-slate-500 mt-1">Start a new evaluation or click "Seed Benchmarks" above.</p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={handleSeed}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition"
            >
              Load Demo Benchmarks
            </button>
            <button
              onClick={onNewAnalysis}
              className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition"
            >
              Start New Analysis
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((r) => {
            const isSelected = selectedForCompare.includes(r.id);
            let scoreColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
            if (r.overall_score < 55) {
              scoreColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
            } else if (r.overall_score < 72) {
              scoreColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
            }

            return (
              <div
                key={r.id}
                className={`relative flex flex-col justify-between rounded-xl border p-5 transition bg-slate-900/40 ${
                  isSelected
                    ? 'border-indigo-500 shadow-md shadow-indigo-500/10 bg-slate-900/80'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white text-base">{r.startup_name}</h4>
                      <span className="text-xs text-slate-400">{r.industry}</span>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block rounded-md border px-2 py-0.5 text-xs font-extrabold ${scoreColor}`}>
                        {r.overall_score} / 100
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5 font-bold">Grade: {r.grade}</span>
                    </div>
                  </div>

                  {r.tagline && (
                    <p className="mt-2 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {r.tagline}
                    </p>
                  )}

                  <div className="mt-3 rounded bg-slate-950/60 p-2 text-[11px] text-slate-300 border border-slate-800/80">
                    <span className="font-semibold text-slate-400 block text-[10px] uppercase">Verdict:</span>
                    <span className="line-clamp-2">{r.verdict}</span>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleSelectForCompare(r.id)}
                      className={`rounded px-2 py-1 text-[11px] font-medium border transition ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ In Compare' : '+ Compare'}
                    </button>

                    <button
                      onClick={() => handleDelete(r.id, r.startup_name)}
                      className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-rose-400 transition"
                      title="Delete report"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleOpen(r.id)}
                    className="flex items-center space-x-1 font-semibold text-indigo-400 hover:text-indigo-300 transition"
                  >
                    <span>View Report</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {compareReportA && compareReportBId && (
        <CompareModal
          reportA={compareReportA}
          reportBId={compareReportBId}
          onClose={() => {
            setCompareReportA(null);
            setCompareReportBId(null);
          }}
        />
      )}
    </div>
  );
};
