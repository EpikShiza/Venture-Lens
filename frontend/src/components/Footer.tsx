import React from 'react';
import { ShieldCheck, Info, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="vl-footer">
      <div className="page-shell">
        <div className="vl-footer-main">
          <div className="vl-footer-brand">
            <span className="vl-footer-name">venture<span>lens</span></span>
            <span>Open-source AI startup diligence & feasibility engine</span>
          </div>
          <div className="vl-footer-signals">
            <span><ShieldCheck size={14} /> Evidence-aware verification</span>
            <span><Terminal size={14} /> Deterministic scoring rules</span>
          </div>
        </div>
        <div className="vl-footer-bottom">
          <p><Info size={14} /> Scores are algorithmic estimates based on defined criteria and available evidence. They do not guarantee funding or commercial success.</p>
          <span>HACKATHON EDITION · APACHE 2.0</span>
        </div>
      </div>
    </footer>
  );
};
