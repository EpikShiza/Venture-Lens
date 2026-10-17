SEED_REPORTS = [
    {
        "id": "seed-docuflow-001",
        "created_at": "2026-10-15T14:30:00Z",
        "startup_name": "DocuFlow AI",
        "tagline": "Automated FDA regulatory dossier compilation for mid-size biotechs",
        "industry": "BioTech / Regulatory SaaS",
        "target_customer": "Regulatory Affairs Vice Presidents at mid-size clinical-stage biotechs (Series A/B)",
        "geographic_market": "United States & European Union",
        "business_model": "B2B SaaS ($35,000 annual license + $5,000 per IND filing module)",
        "executive_summary": "DocuFlow AI addresses a severe, mission-critical operational bottleneck in clinical trial documentation where delay costs exceed $50k/day. Strong enterprise willingness-to-pay and high regulatory tailwinds offset the initial sales cycle length.",
        "score_report": {
            "overall_score": 83.5,
            "grade": "A",
            "verdict": "High Potential — Proceed to Customer Validation Experiments",
            "formula_explanation": "Overall Score = (0.20 * Problem) + (0.25 * Market) + (0.20 * Defensibility) + (0.20 * Business) + (0.15 * Technical) - Penalties",
            "confidence_level": "High (Backed by Multiple Verified External Sources)",
            "dimensions": {
                "problem_clarity": {
                    "name": "Problem Clarity & Pain Urgency",
                    "weight": 0.20,
                    "raw_score": 90.0,
                    "weighted_score": 18.0,
                    "reasoning": "Extreme regulatory urgency: every week of delayed IND review costs biotechs tens of thousands in cash burn.",
                    "strengths": ["Direct ROI calculation easily proven to buyers", "Existing budget line items currently paid to expensive CRO consultants"],
                    "risks": ["Conservative buyer persona with high risk aversion regarding FDA audit compliance"]
                },
                "market_opportunity": {
                    "name": "Market Need & TAM Opportunity",
                    "weight": 0.25,
                    "raw_score": 82.0,
                    "weighted_score": 20.5,
                    "reasoning": "TAM is focused ($1.8B global clinical regulatory software), but contract values (ACVs) are high ($35k-$120k).",
                    "strengths": ["High Net Revenue Retention potential", "Defensible beachhead with over 2,400 active clinical trials"],
                    "risks": ["Long B2B enterprise procurement cycles (3 to 6 months)"]
                },
                "competitive_defensibility": {
                    "name": "Competitive Moat & Defensibility",
                    "weight": 0.20,
                    "raw_score": 78.0,
                    "weighted_score": 15.6,
                    "reasoning": "Proprietary mapping of historical FDA deficiency letters creates expanding workflow switching costs.",
                    "strengths": ["Domain-specific validation guardrails", "High switching costs once integrated with eCTD systems"],
                    "risks": ["Legacy electronic trial master file (eTMF) vendors like Veeva Systems expanding modular AI capabilities"]
                },
                "business_viability": {
                    "name": "Business Model & Unit Economics",
                    "weight": 0.20,
                    "raw_score": 85.0,
                    "weighted_score": 17.0,
                    "reasoning": "High-ticket SaaS model supports dedicated inside sales reps and high LTV/CAC ratios.",
                    "strengths": ["Gross margins exceeding 82%", "Low customer churn once adopted for an active trial program"],
                    "risks": ["Pilot-to-paid conversion friction if security and 21 CFR Part 11 audits take months"]
                },
                "technical_feasibility": {
                    "name": "Technical & Execution Feasibility",
                    "weight": 0.15,
                    "raw_score": 82.0,
                    "weighted_score": 12.3,
                    "reasoning": "Modern LLMs fine-tuned with structured eCTD schemas can reliably extract and cross-reference trial protocol inconsistencies.",
                    "strengths": ["Proven NLP extraction architectures", "Well-defined FDA eCTD standard XML schemas"],
                    "risks": ["Zero-hallucination tolerance requirement requires deterministic deterministic validation rules"]
                }
            },
            "penalties_applied": []
        },
        "competitors": [
            {
                "name": "Veeva Systems (Veeva Vault RIM)",
                "type": "Direct Incumbent",
                "description": "The enterprise standard for life sciences regulatory content and document management.",
                "strengths": ["Massive enterprise market share", "Deep pharmaceutical integration", "Trusted enterprise brand"],
                "weaknesses": ["Multi-hundred-thousand dollar implementations", "Complex legacy interface", "Lacks proactive generative cross-referencing"],
                "differentiator_wedge": "DocuFlow operates as an agile, self-serve pre-audit copilot specifically tailored for biotechs under 100 employees without requiring a 6-month Veeva consultant team.",
                "pricing_model": "$150,000+ annual enterprise commitment"
            },
            {
                "name": "Manual CRO Consultancies (e.g. Parexel, IQVIA)",
                "type": "Alternative Solution",
                "description": "Human regulatory affairs consultants charging hourly billing for manual dossier review.",
                "strengths": ["Deep bespoke human expertise", "Direct liability buffer"],
                "weaknesses": ["Slow turnaround (4-8 weeks per module)", "Extreme cost ($350+/hr)", "Human oversights across 5,000-page submissions"],
                "differentiator_wedge": "Completes preliminary consistency checks in 15 minutes, cutting CRO billable hours by 60%.",
                "pricing_model": "$50,000 to $120,000 per filing in consulting fees"
            }
        ],
        "adversarial_critique": {
            "investor_persona": "Skeptical Early-Stage General Partner",
            "fatal_flaws": [
                "Biotech regulatory teams are notoriously risk-averse; they do not get fired for buying Veeva or hiring Parexel, but could face career termination if a startup's AI outputs a flawed IND submission.",
                "Long compliance validation cycles (21 CFR Part 11, SOC2 Type II, HIPAA) can burn $200k in legal/auditing before closing the first dollar of revenue."
            ],
            "untested_assumptions": [
                "Regulatory officers will trust an AI output without reading every single cited page anyway.",
                "Clinical trial protocols contain sufficient clean digital structure for automated ingestion."
            ],
            "distribution_hurdles": [
                "Cold emails to biopharma executives have near-zero reply rates due to vendor spam and confidentiality paranoia.",
                "Requires warm introductions from life science angel investors or clinical research liaisons."
            ],
            "incumbent_threat_analysis": "Veeva has announced generative AI copilots inside Vault. If their execution is good enough, DocuFlow's feature becomes an embedded add-on for existing customers.",
            "pre_mortem_scenario": "DocuFlow spends 9 months building a gorgeous tool. Two prospects sign pilot letters of intent, but their internal IT and quality compliance teams stall the security review for 11 months until DocuFlow runs out of cash.",
            "required_proof_points": [
                "Obtain written confirmation from 2 active biotech Heads of Regulatory agreeing to trial a blinded dataset.",
                "Achieve 100% precision on automated detection of dosing discrepancies across a test 500-page FDA submission packet.",
                "Secure at least 1 paid pilot agreement ($10k+ deposit) before writing full platform code."
            ]
        },
        "evidence_sources": [
            {
                "title": "FDA Clinical Trial Guidance & eCTD Specifications",
                "url": "https://www.fda.gov/drugs/electronic-regulatory-submission-and-review",
                "snippet": "Official FDA specifications requiring standardized electronic submission formats (eCTD 4.0) with strict hyperlinking and document validation rules.",
                "retrieved_at": "2026-10-15T14:31:00Z",
                "verification_status": "VERIFIED_SOURCE",
                "relevance_note": "Confirms standardized data schema exists for regulatory submissions, reducing ingestion variability."
            },
            {
                "title": "Tufts Center for the Study of Drug Development Benchmarks",
                "url": "https://csdd.tufts.edu/reports",
                "snippet": "Average clinical trial protocol amendment costs $500,000 and adds months to study timelines, with 40% traceable to avoidable dossier documentation discrepancies.",
                "retrieved_at": "2026-10-15T14:31:00Z",
                "verification_status": "VERIFIED_SOURCE",
                "relevance_note": "Direct economic validation for the pain point and value proposition."
            }
        ],
        "validation_experiments": [
            {
                "id": "exp-1",
                "name": "Historical Blinded Protocol Audit Test",
                "hypothesis_tested": "Algorithm can detect at least 3 critical discrepancy errors that human CRO reviewers missed in a past public FDA review.",
                "method": "Run DocuFlow parser on 5 publicly accessible FDA Complete Response Letters (CRLs) and blinded trial submissions.",
                "metric_to_track": "Discrepancy detection recall and false positive rate",
                "target_threshold": "> 95% recall on protocol inconsistencies with < 5% false alarms",
                "estimated_cost_usd": 200.0,
                "estimated_days": 10,
                "priority": "Critical (Do First)"
            },
            {
                "id": "exp-2",
                "name": "Advisory Board Discovery Calls",
                "hypothesis_tested": "Mid-tier biotechs have discretionary budget for independent regulatory copilots outside Veeva.",
                "method": "Conduct 12 paid 45-minute discovery interviews with active regulatory directors offering $250 honorariums.",
                "metric_to_track": "Commitment to review a free benchmark pilot",
                "target_threshold": "At least 4 out of 12 agree to test their next draft dossier",
                "estimated_cost_usd": 3000.0,
                "estimated_days": 21,
                "priority": "High"
            }
        ],
        "roadmap": [
            {
                "phase": "Days 1-30",
                "title": "Benchmark Accuracy & ICP Alignment",
                "milestones": [
                    "Benchmark parser on 5 public FDA trial packages",
                    "Complete 12 regulatory director discovery calls",
                    "Publish a whitepaper on top 10 automated IND review errors"
                ],
                "kill_metric": "Fewer than 2 directors express interest in testing a pilot."
            },
            {
                "phase": "Days 31-60",
                "title": "Design Partner Concierge Pilot",
                "milestones": [
                    "Sign 2 biotech design partners for confidential draft audits",
                    "Deliver manual-plus-automated review within 48 hours",
                    "Document hours saved versus their previous CRO"
                ],
                "kill_metric": "If design partner quality audit rejects automated findings as unreliable."
            },
            {
                "phase": "Days 61-90",
                "title": "Commercial Conversion & SOC2 Initiation",
                "milestones": [
                    "Convert at least 1 design partner to a $25k annual contract",
                    "Initiate SOC2 Type I audit preparation",
                    "Prepare Seed round investor deck with empirical retention data"
                ],
                "kill_metric": "Inability to secure paying pilot customer confirms enterprise trust barrier is too high."
            }
        ],
        "ai_provider": "gemini-2.5-flash",
        "is_mock": False,
        "limitations_disclaimer": "NOTICE: VentureLens feasibility scores and evaluations are algorithmic estimates based on defined criteria and available web evidence."
    },
    {
        "id": "seed-quickcart-002",
        "created_at": "2026-10-14T09:15:00Z",
        "startup_name": "QuickCart 15",
        "tagline": "15-minute ultra-fast grocery and essentials delivery for suburban neighborhoods",
        "industry": "Consumer Tech / Quick Commerce",
        "target_customer": "Suburban busy parents and young professionals",
        "geographic_market": "Dallas-Fort Worth suburban corridor, USA",
        "business_model": "On-demand retail markup (15%) + $2.99 delivery fee + monthly $9.99 prime subscription",
        "executive_summary": "QuickCart 15 operates in a structurally distressed category characterized by devastating unit economics, brutal incumbent competition (DoorDash, Instacart, Gopuff), and capital-intensive micro-fulfillment dark stores.",
        "score_report": {
            "overall_score": 42.0,
            "grade": "D",
            "verdict": "Severe Structural Headwinds — Fundamental Pivot Recommended",
            "formula_explanation": "Overall Score = (0.20 * Problem) + (0.25 * Market) + (0.20 * Defensibility) + (0.20 * Business) + (0.15 * Technical) - Penalties",
            "confidence_level": "High (Backed by Multiple Verified External Sources)",
            "dimensions": {
                "problem_clarity": {
                    "name": "Problem Clarity & Pain Urgency",
                    "weight": 0.20,
                    "raw_score": 58.0,
                    "weighted_score": 11.6,
                    "reasoning": "Consumers enjoy fast delivery, but 15-minute speed is a luxury convenience, not an existential pain point compared to 1-hour delivery.",
                    "strengths": ["High consumer delight when working"],
                    "risks": ["Price sensitivity: consumers balk at delivery fees and price markups in inflationary environments"]
                },
                "market_opportunity": {
                    "name": "Market Need & TAM Opportunity",
                    "weight": 0.25,
                    "raw_score": 55.0,
                    "weighted_score": 13.75,
                    "reasoning": "Massive grocery TAM, but quick-commerce segment has contracted dramatically with numerous bankruptcies (Getir, Gorillas, Buyk, Fridge No More).",
                    "strengths": ["High order frequency"],
                    "risks": ["Suburban density is fundamentally incompatible with 15-minute bicycle/scooter delivery economics"]
                },
                "competitive_defensibility": {
                    "name": "Competitive Moat & Defensibility",
                    "weight": 0.20,
                    "raw_score": 30.0,
                    "weighted_score": 6.0,
                    "reasoning": "Zero moat. Consumers switch between delivery apps based purely on $10-off coupons and discounts.",
                    "strengths": ["None demonstrable at seed stage"],
                    "risks": ["DoorDash and Instacart possess billion-dollar balance sheets and existing merchant density"]
                },
                "business_viability": {
                    "name": "Business Model & Unit Economics",
                    "weight": 0.20,
                    "raw_score": 25.0,
                    "weighted_score": 5.0,
                    "reasoning": "Catastrophic contribution margin: suburban drive times mean couriers complete < 1.5 deliveries per hour, resulting in a -$8 net loss per order.",
                    "strengths": ["Immediate cash flow from customer cards"],
                    "risks": ["Negative unit economics on delivery wages, commercial dark store leases, and inventory spoilage"]
                },
                "technical_feasibility": {
                    "name": "Technical & Execution Feasibility",
                    "weight": 0.15,
                    "raw_score": 71.0,
                    "weighted_score": 10.65,
                    "reasoning": "Software stack (app + dispatch router) is straightforward, but physical operations (warehouse inventory, real-time pick-and-pack) are brutally difficult.",
                    "strengths": ["Off-the-shelf delivery dispatch APIs"],
                    "risks": ["Inventory shrink, stockouts, and cold-chain compliance"]
                }
            },
            "penalties_applied": [
                {
                    "reason": "Structural Negative Contribution Margin",
                    "deduction": 10.0,
                    "explanation": "Suburban logistics density cannot sustain 15-minute SLA at acceptable courier labor costs."
                },
                {
                    "reason": "Crowded Category with High Capital Failure Rate",
                    "deduction": 5.0,
                    "explanation": "Over $10B in venture capital was incinerated in quick commerce 2021-2024 with near-total sector collapse."
                }
            ]
        },
        "competitors": [
            {
                "name": "Instacart / DoorDash DashMart",
                "type": "Direct Incumbent",
                "description": "Dominant national delivery platforms with existing merchant networks and millions of active subscribers.",
                "strengths": ["Massive courier networks", "Cross-subsidized subscription memberships", "Exclusive supermarket partnerships"],
                "weaknesses": ["Average 30-45 minute delivery window rather than 15 minutes"],
                "differentiator_wedge": "Claims 15-minute guarantee, but at unsustainable unit cost.",
                "pricing_model": "DashPass ($9.99/mo) with waived delivery fees"
            }
        ],
        "adversarial_critique": {
            "investor_persona": "Hardened Logistics & Consumer Seed Partner",
            "fatal_flaws": [
                "Suburban quick commerce is mathematically unviable: average distance between suburban homes is 3-6 miles. A driver driving 10 minutes each way cannot physically execute 3 orders an hour.",
                "Dark store leases require $15k/month in rent plus inventory carrying costs before delivering a single carton of milk."
            ],
            "untested_assumptions": [
                "Suburban customers care about 15 minutes versus 45 minutes enough to pay a $5 premium.",
                "Couriers will work for standard gig rates when gas prices and vehicle depreciation in suburbs erode their net pay."
            ],
            "distribution_hurdles": [
                "Customer Acquisition Cost (CAC) in consumer grocery delivery is over $65/customer, requiring 14 repeat orders just to break even on marketing."
            ],
            "incumbent_threat_analysis": "DoorDash can launch competing promotional discounts in the target zip codes within 48 hours.",
            "pre_mortem_scenario": "The startup raises $100k from friends and family, leases a suburban warehouse, buys $30k of inventory, and spends $20k on Facebook ads. They deliver 400 orders at a net loss of $12/order before running out of cash in month 3.",
            "required_proof_points": [
                "Prove positive contribution margin (CM2) on at least 100 consecutive real-world deliveries.",
                "Demonstrate courier batching of at least 2.8 deliveries per courier hour in target geography."
            ]
        },
        "evidence_sources": [
            {
                "title": "Wall Street Journal: The Collapse of 15-Minute Grocery Startups",
                "url": "https://www.wsj.com/articles/quick-commerce-startup-retrenchment",
                "snippet": "Analysis showing how venture-backed quick-commerce players lost an average of $15 to $22 per order on rapid suburban and urban micro-fulfillment operations.",
                "retrieved_at": "2026-10-14T09:16:00Z",
                "verification_status": "VERIFIED_SOURCE",
                "relevance_note": "Confirms catastrophic sector-wide unit economic history in this specific category."
            }
        ],
        "validation_experiments": [
            {
                "id": "exp-1",
                "name": "Manual Delivery Economics Stress-Test",
                "hypothesis_tested": "A single courier can complete 2.5 suburban deliveries per hour during peak evening hours.",
                "method": "Founders personally deliver simulated orders across 5 targeted suburban zip codes at 6:00 PM.",
                "metric_to_track": "Actual door-to-door transit time and round-trip courier turnaround",
                "target_threshold": "< 22 minutes total turnaround per dropoff",
                "estimated_cost_usd": 150.0,
                "estimated_days": 3,
                "priority": "Critical (Do First)"
            }
        ],
        "roadmap": [
            {
                "phase": "Days 1-30",
                "title": "Unit Economics Feasibility Audit",
                "milestones": ["Conduct 20 manual trial deliveries", "Map real traffic constraints during school/rush hours"],
                "kill_metric": "If courier cost exceeds delivery fee plus markup, abort dark store lease immediately."
            }
        ],
        "ai_provider": "gemini-2.5-flash",
        "is_mock": False,
        "limitations_disclaimer": "NOTICE: VentureLens feasibility scores and evaluations are algorithmic estimates based on defined criteria and available web evidence."
    }
]
