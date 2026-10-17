import React from 'react';
import { Compass, Sparkles, FolderArchive, ArrowUpRight } from 'lucide-react';
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
    <header className="vl-navbar">
      <div className="page-shell vl-navbar-inner">
        <button
          type="button"
          onClick={() => setCurrentTab('landing')}
          className="vl-brand"
          aria-label="VentureLens home"
        >
          <span className="vl-brand-mark"><Compass size={23} strokeWidth={1.6} /></span>
          <span className="vl-brand-wordmark">venture<span>lens</span><small>INDEPENDENT STARTUP DILIGENCE</small></span>
        </button>

        <nav className="vl-nav-links" aria-label="Main navigation">
          <button
            onClick={() => setCurrentTab('analyze')}
            className={`vl-nav-link ${currentTab === 'analyze' ? 'is-active' : ''}`}
          >
            <Sparkles size={15} /> <span>New analysis</span>
          </button>
          <button
            onClick={() => setCurrentTab('saved')}
            className={`vl-nav-link ${currentTab === 'saved' ? 'is-active' : ''}`}
          >
            <FolderArchive size={15} /> <span>Saved reports</span>
          </button>
          <button
            onClick={onOpenStatusModal}
            className={`vl-engine-status ${isMock ? 'is-mock' : 'is-live'}`}
            title="View runtime engine and provider status"
          >
            <span className="vl-status-dot" />
            <span className="vl-status-label">{isMock ? 'DEMO MODE' : 'ENGINE ONLINE'}</span>
            <ArrowUpRight size={13} />
          </button>
        </nav>
      </div>
    </header>
  );
};
