import React from 'react';
import {
  Compass, Sparkles, ShieldCheck, Flame, Calculator, FlaskConical,
  ArrowRight, CheckCircle2, XCircle, MoveUpRight, ScanSearch, Activity,
} from 'lucide-react';

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
    <div className="vl-landing">
      <section className="vl-hero page-shell">
        <div className="vl-hero-copy">
          <div className="vl-eyebrow"><span className="vl-eyebrow-dot" /> INDEPENDENT STARTUP DILIGENCE <span className="vl-eyebrow-index">VL / 001</span></div>
          <h1 className="vl-display">
            Good ideas<br />
            deserve <span className="vl-highlight">hard</span><br />
            questions<span className="vl-period">.</span>
          </h1>
          <p className="vl-hero-description">
            VentureLens turns startup instinct into evidence-backed decisions — with competitor research,
            transparent scoring, and an investor-style red team that looks for what could go wrong.
          </p>
          <div className="vl-hero-actions">
            <button onClick={onStartAnalysis} className="vl-button vl-button-primary">
              <Sparkles size={16} strokeWidth={2} /> Evaluate an idea <ArrowRight size={16} />
            </button>
            <button onClick={onViewSaved} className="vl-button vl-button-secondary">
              Explore benchmark reports <MoveUpRight size={15} />
            </button>
          </div>
          <div className="vl-proofline">
            <span><CheckCircle2 size={14} /> Evidence-aware research</span>
            <span><CheckCircle2 size={14} /> Explainable scoring</span>
            <span><CheckCircle2 size={14} /> No success guarantees</span>
          </div>
        </div>

        <div className="vl-hero-art" aria-label="Abstract VentureLens evaluation graphic">
          <div className="vl-art-topline"><span>THE IDEA / UNDER REVIEW</span><span>FIG. 01</span></div>
          <div className="vl-orbit vl-orbit-one" />
          <div className="vl-orbit vl-orbit-two" />
          <div className="vl-orbit vl-orbit-three" />
          <div className="vl-art-cross vl-art-cross-a" />
          <div className="vl-art-cross vl-art-cross-b" />
          <div className="vl-art-center">
            <div className="vl-art-center-icon"><Compass size={33} strokeWidth={1.2} /></div>
            <span className="vl-art-center-label">VENTURE / LENS</span>
            <span className="vl-art-center-sub">Look closer.</span>
          </div>
          <div className="vl-art-note vl-art-note-a"><span className="vl-note-marker" /> MARKET SIGNAL <strong>01 — SEARCH</strong></div>
          <div className="vl-art-note vl-art-note-b"><span className="vl-note-marker" /> ASSUMPTIONS <strong>02 — TEST</strong></div>
          <div className="vl-art-index">A BETTER<br />FIRST LOOK</div>
          <div className="vl-art-bottomline"><span>RESEARCH → REASON → RED-TEAM</span><span>2026</span></div>
        </div>
        <div className="vl-hero-footnote"><span>01 / THE THESIS</span><span>Clarity before capital. Evidence before enthusiasm.</span></div>
      </section>

      <section className="vl-principles">
        <div className="page-shell vl-principles-inner">
          <div className="vl-section-kicker"><span>02</span> THE METHOD</div>
          <div className="vl-principles-heading">
            <h2>Optimism is useful.<br /><em>Unchallenged optimism isn’t.</em></h2>
            <p>Most idea reviews tell founders what they want to hear. VentureLens is built to ask the second question — and show its work.</p>
          </div>
          <div className="vl-pillar-list">
            <article className="vl-pillar">
              <div className="vl-pillar-number">01</div>
              <div className="vl-pillar-icon"><ShieldCheck size={21} /></div>
              <div className="vl-pillar-copy"><h3>Evidence, not invented certainty</h3><p>Separate published market evidence from founder assumptions, with source-aware competitor research.</p></div>
              <div className="vl-pillar-aside">RESEARCH <ArrowRight size={14} /></div>
            </article>
            <article className="vl-pillar">
              <div className="vl-pillar-number">02</div>
              <div className="vl-pillar-icon"><Flame size={21} /></div>
              <div className="vl-pillar-copy"><h3>A red team that pushes back</h3><p>Surface distribution traps, incumbent advantages, fatal flaws, and the uncomfortable 18-month pre-mortem.</p></div>
              <div className="vl-pillar-aside">CHALLENGE <ArrowRight size={14} /></div>
            </article>
            <article className="vl-pillar">
              <div className="vl-pillar-number">03</div>
              <div className="vl-pillar-icon"><Calculator size={21} /></div>
              <div className="vl-pillar-copy"><h3>Scoring you can inspect</h3><p>See the weighted dimensions and explicit risk deductions behind a score — not a mysterious number.</p></div>
              <div className="vl-pillar-aside">EXPLAIN <ArrowRight size={14} /></div>
            </article>
            <article className="vl-pillar">
              <div className="vl-pillar-number">04</div>
              <div className="vl-pillar-icon"><FlaskConical size={21} /></div>
              <div className="vl-pillar-copy"><h3>Experiments before expensive bets</h3><p>Turn the riskiest assumptions into practical tests with measurable pass/fail criteria.</p></div>
              <div className="vl-pillar-aside">VALIDATE <ArrowRight size={14} /></div>
            </article>
          </div>
        </div>
      </section>

      <section className="vl-honesty page-shell">
        <div className="vl-section-kicker"><span>03</span> CALIBRATED CONFIDENCE</div>
        <div className="vl-honesty-layout">
          <div>
            <div className="vl-mini-label"><Activity size={14} /> A TOOL FOR BETTER QUESTIONS</div>
            <h2>Clarity is a process.<br /><span>Not a prediction.</span></h2>
            <p className="vl-honesty-intro">VentureLens can structure what is known, highlight what is uncertain, and suggest what to test next. It cannot replace customer discovery or founder judgment.</p>
          </div>
          <div className="vl-truth-columns">
            <div className="vl-truth-column">
              <h3><CheckCircle2 size={17} /> CAN HELP ESTABLISH</h3>
              <ul>
                <li>Problem and customer-profile clarity</li>
                <li>Published competitors and visible pricing</li>
                <li>Structural unit-economics red flags</li>
                <li>Scoring rationale and risk deductions</li>
              </ul>
            </div>
            <div className="vl-truth-column vl-truth-caution">
              <h3><XCircle size={17} /> CANNOT GUARANTEE</h3>
              <ul>
                <li>Commercial success or future funding</li>
                <li>Willingness to pay without real interviews</li>
                <li>Team execution or founder-market fit</li>
                <li>Discovery of every stealth competitor</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="vl-benchmarks">
        <div className="page-shell vl-benchmarks-inner">
          <div>
            <div className="vl-section-kicker"><span>04</span> START WITH A REFERENCE POINT</div>
            <h2>See the method<br /><em>in action.</em></h2>
            <p>Explore two preloaded archetypes — one strong on paper, one full of hard questions.</p>
          </div>
          <div className="vl-sample-list">
            <button onClick={() => onOpenSample('seed-docuflow-001')} className="vl-sample">
              <span className="vl-sample-symbol">A</span>
              <span className="vl-sample-copy"><strong>DocuFlow AI</strong><small>B2B BioTech · Benchmark case</small></span>
              <span className="vl-sample-score">83.5 <small>/ 100</small></span>
              <MoveUpRight size={18} className="vl-sample-arrow" />
            </button>
            <button onClick={() => onOpenSample('seed-quickcart-002')} className="vl-sample">
              <span className="vl-sample-symbol vl-sample-symbol-alert">Q</span>
              <span className="vl-sample-copy"><strong>QuickCart 15</strong><small>Quick commerce · Red-flag case</small></span>
              <span className="vl-sample-score vl-sample-score-low">42.0 <small>/ 100</small></span>
              <MoveUpRight size={18} className="vl-sample-arrow" />
            </button>
          </div>
        </div>
      </section>

      <section className="vl-last-cta page-shell">
        <div className="vl-last-cta-index">VL / NEXT STEP</div>
        <h2>Make the idea<br />earn your <span>conviction.</span></h2>
        <button onClick={onStartAnalysis} className="vl-button vl-button-primary">Start an evaluation <ArrowRight size={16} /></button>
      </section>
    </div>
  );
};
