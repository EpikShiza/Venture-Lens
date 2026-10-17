import React, { useState, useEffect } from 'react';
import { AnalysisReportResponse, SystemStatusResponse } from './types';
import { getSystemStatus, getAnalysis } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SystemStatusModal } from './components/SystemStatusModal';
import { LandingPage } from './pages/LandingPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { ReportPage } from './pages/ReportPage';
import { SavedReportsPage } from './pages/SavedReportsPage';

export function App() {
  const [currentTab, setCurrentTab] = useState<'landing' | 'analyze' | 'report' | 'saved'>('landing');
  const [activeReport, setActiveReport] = useState<AnalysisReportResponse | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatusResponse | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      try {
        const status = await getSystemStatus();
        setSystemStatus(status);
      } catch (err) {
        console.warn('System status check could not reach backend:', err);
      }
    }
    loadStatus();
  }, []);

  const handleAnalysisSuccess = (report: AnalysisReportResponse) => {
    setActiveReport(report);
    setCurrentTab('report');
  };

  const handleOpenReport = (report: AnalysisReportResponse) => {
    setActiveReport(report);
    setCurrentTab('report');
  };

  const handleOpenSample = async (sampleId: string) => {
    try {
      const report = await getAnalysis(sampleId);
      setActiveReport(report);
      setCurrentTab('report');
    } catch {
      // If sample isn't seeded yet, go to analyze page
      setCurrentTab('analyze');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        systemStatus={systemStatus}
        onOpenStatusModal={() => setShowStatusModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onStartAnalysis={() => setCurrentTab('analyze')}
            onViewSaved={() => setCurrentTab('saved')}
            onOpenSample={handleOpenSample}
          />
        )}

        {currentTab === 'analyze' && (
          <AnalyzePage onAnalysisSuccess={handleAnalysisSuccess} />
        )}

        {currentTab === 'report' && activeReport && (
          <ReportPage
            report={activeReport}
            onBackToSaved={() => setCurrentTab('saved')}
            onNewAnalysis={() => setCurrentTab('analyze')}
          />
        )}

        {currentTab === 'saved' && (
          <SavedReportsPage
            onOpenReport={handleOpenReport}
            onNewAnalysis={() => setCurrentTab('analyze')}
          />
        )}
      </main>

      {/* System Status & Privacy Modal */}
      {showStatusModal && (
        <SystemStatusModal
          status={systemStatus}
          onClose={() => setShowStatusModal(false)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
