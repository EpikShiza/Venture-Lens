import React from 'react';
import { Compass, Sparkles, FolderArchive, Activity, HelpCircle } from 'lucide-react';
import { SystemStatusResponse } from '../types';

interface NavbarProps {
  currentTab: 'landing' | 'analyze' | 'report' | 'saved';
  setCurrentTab: (tab: 'landing' | 'analyze' | 'report' | 'saved') => void;
  systemStatus: SystemStatusResponse | null;
  onOpenStatusModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  systemStatus,
  onOpenStatusModal,
}) => {
  const isMock = systemStatus?.ai_provider === 'mock';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div
          onClick={() => setCurrentTab('landing')}
          className="flex cursor-pointer items-center space-x-3 transition hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white">VentureLens</span>
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Turn startup ideas into evidence-backed decisions</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setCurrentTab('analyze')}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              currentTab === 'analyze'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>New Analysis</span>
          </button>

          <button
            onClick={() => setCurrentTab('saved')}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              currentTab === 'saved'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FolderArchive className="h-4 w-4" />
            <span>Saved Reports</span>
          </button>

          {/* Engine Status Pill */}
          <button
            onClick={onOpenStatusModal}
            className={`flex items-center space-x-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition ${
              isMock
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
            }`}
            title="Click to view runtime engine and provider status"
          >
            <span className={`h-2 w-2 rounded-full ${isMock ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="hidden md:inline">Engine:</span>
            <span>{isMock ? 'Demo Mock Mode' : (systemStatus?.ai_model || 'Live AI')}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
