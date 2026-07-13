/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PolicyProposal, Experiment, BenchmarkResult } from '../types';
import { Compass, Beaker, CheckCircle2, Award, ArrowUpRight, Loader2, Terminal } from 'lucide-react';

interface DiscoveryPlannerPanelProps {
  selectedPolicy: PolicyProposal | null;
  addTemporalEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
  benchmarkResults?: BenchmarkResult[];
  onLinkToLogs?: () => void;
}

interface DiscoveryTabConfig {
  id: string;
  name: string;
  emoji: string;
  label: string;
  focus: string;
  efficiencyLabel: string;
  optimalStrength: number;
  optimalScore: number;
  prompt: string;
  trials: Experiment[];
}

const DISCOVERY_TABS: DiscoveryTabConfig[] = [
  {
    id: 'weather',
    name: 'WEATHER',
    emoji: '🌦️',
    label: 'Atmospheric Diffusion',
    focus: 'Aerosol Dispersal Rate',
    efficiencyLabel: 'Sequestration Efficiency',
    optimalStrength: 60,
    optimalScore: 88,
    prompt: 'Optimizing urban aerosol tracer dispersal rates to maximize atmospheric air quality index correction while avoiding localized precipitate anomalies.',
    trials: [
      { id: 't-1', name: 'Low Intensity Floor', strength: 25, score: 58, outcome: 'Trace aerosol release reduces boundary layer particulates by 15% with zero public concern.', status: 'completed' },
      { id: 't-2', name: 'Optimal Equilibrium Curve', strength: 60, score: 88, outcome: 'Calculated 60% saturation achieves 84% reduction in micro-particulates with minimal microclimate drift.', status: 'completed' },
      { id: 't-3', name: 'Excessive Overshot Saturation', strength: 95, score: 74, outcome: 'Total saturation leads to heavy localized condensation and micro-precipitate anomalies (+30% friction).', status: 'completed' }
    ]
  },
  {
    id: 'finance',
    name: 'FINANCE',
    emoji: '🏦',
    label: 'Portfolio Risk',
    focus: 'Liquidity Buffer Margin',
    efficiencyLabel: 'Capital Buffer Protection',
    optimalStrength: 65,
    optimalScore: 92,
    prompt: 'Calibrating multi-factor Liquidity Buffers against systemic interbank contagion spreads during high-frequency asset volatility and semiconductor supply shocks.',
    trials: [
      { id: 't-1', name: 'Minimal Liquidity Buffer', strength: 20, score: 61, outcome: 'Low risk coverage. Interbank contagion stress causes 4.2% portfolio drawdown during sudden tech sell-offs.', status: 'completed' },
      { id: 't-2', name: 'Optimal Buffer Target', strength: 65, score: 92, outcome: 'Optimal capital buffer preserves 98.4% liquidity matching 10-year black-swan historic volatility benchmarks.', status: 'completed' },
      { id: 't-3', name: 'Excessive Capital Lockup', strength: 90, score: 71, outcome: 'Capital lockup limits commercial trade operations. Opportunity cost drops overall return on equity by 3.8%.', status: 'completed' }
    ]
  },
  {
    id: 'quantum',
    name: 'QUANTUM',
    emoji: '🌀',
    label: 'Quantum Gate Drift',
    focus: 'Phase Realignment Rate',
    efficiencyLabel: 'Register Coherence Parity',
    optimalStrength: 65,
    optimalScore: 94,
    prompt: 'Modeling stabilizer surface-17 codes across 128 qubits to preserve register state parity under sub-45 mK thermal drift.',
    trials: [
      { id: 't-1', name: 'Basic Feedback Tune', strength: 30, score: 65, outcome: 'Partial drift compensation. 2-qubit gate fidelity remains bound to 98.2% under thermal flux.', status: 'completed' },
      { id: 't-2', name: 'Optimal Phase Realignment', strength: 65, score: 94, outcome: 'Stabilizes 128-qubit register to 99.94% surface-17 parity with continuous sub-millisecond corrections.', status: 'completed' },
      { id: 't-3', name: 'High-Frequency Over-Correction', strength: 95, score: 76, outcome: 'High control-pulse frequency injects localized microwave heating, actually degrading coherence limits.', status: 'completed' }
    ]
  },
  {
    id: 'semiconductor',
    name: 'SEMICONDUCTOR',
    emoji: '💾',
    label: 'Silicon Junctions',
    focus: 'Dynamic Laser Dampening',
    efficiencyLabel: 'Thermal Dissipation Delta',
    optimalStrength: 60,
    optimalScore: 91,
    prompt: 'Adjusting continuous laser power and mod voltage thresholds to isolate core thermal hotspot degradation on micro-chiplets.',
    trials: [
      { id: 't-1', name: 'Baseline Power Level', strength: 25, score: 60, outcome: 'Sub-optimal thermal dissipation. Core junction hotspots peak at 84°C, inducing minor clock speed throttling.', status: 'completed' },
      { id: 't-2', name: 'Dynamic Thermal Balancing', strength: 60, score: 91, outcome: 'Maintains optimal 24.5°C core delta with active laser-power scaling and direct liquid channel calibration.', status: 'completed' },
      { id: 't-3', name: 'Peak Thermal Load', strength: 95, score: 68, outcome: 'Overclocks hotspot dissipation beyond maximum continuous rating, leading to high chiplet thermal strain.', status: 'completed' }
    ]
  },
  {
    id: 'satellite',
    name: 'SATELLITE',
    emoji: '🛰️',
    label: 'GOES-18 Downlink',
    focus: 'Reed-Solomon Filtering',
    efficiencyLabel: 'Continuous Downlink Rate',
    optimalStrength: 70,
    optimalScore: 89,
    prompt: 'Optimizing geostationary GOES-18 download bitrates and Reed-Solomon filtering under severe solar flare radiation.',
    trials: [
      { id: 't-1', name: 'Low-Noise Filter Mode', strength: 30, score: 62, outcome: 'Trace solar flare filter. Bitrate declines to 2.4 Mbps, causing data-packet dropouts in GOES-18 feeds.', status: 'completed' },
      { id: 't-2', name: 'Deep Reed-Solomon Parity', strength: 70, score: 89, outcome: 'Achieves stable 45 Mbps continuous telemetry downlink with robust 2-pass Reed-Solomon signal reconstruction.', status: 'completed' },
      { id: 't-3', name: 'Max Radiation Guard', strength: 95, score: 70, outcome: 'Aggressive filtering drops throughput. System resources consumed by heavy forward-error-correction routines.', status: 'completed' }
    ]
  },
  {
    id: 'genomics',
    name: 'GENOMICS',
    emoji: '🧬',
    label: 'CRISPR RNA Splicing',
    focus: 'Transductive Vector Splicing',
    efficiencyLabel: 'Alignment Targeting Score',
    optimalStrength: 65,
    optimalScore: 93,
    prompt: 'Maximizing target gene repair alignment scores using multi-layer RNA-seq transcript expression optimization.',
    trials: [
      { id: 't-1', name: 'Single-Guide Splicing', strength: 20, score: 55, outcome: 'Minimal alignment score. Off-target edit risk at 4.2% in primary RNA transcript segments.', status: 'completed' },
      { id: 't-2', name: 'Multi-Layer RNA-seq Alignment', strength: 65, score: 93, outcome: 'Optimal target CRISPR splice score of 98.5% with near-zero off-target mutagenesis anomalies.', status: 'completed' },
      { id: 't-3', name: 'Saturation Dosage Splicing', strength: 90, score: 73, outcome: 'Total edit alignment, but triggers cell-scaffold apoptosis warnings in downstream genomic markers.', status: 'completed' }
    ]
  },
  {
    id: 'economic',
    name: 'ECONOMIC',
    emoji: '📈',
    label: 'Macro Deflections',
    focus: 'Reserve Coefficient Target',
    efficiencyLabel: 'GDP Shock Resistance',
    optimalStrength: 60,
    optimalScore: 90,
    prompt: 'Modeling GDP growth deflections and global supply chains during extreme shipping delays and interest rate spikes.',
    trials: [
      { id: 't-1', name: 'Standard Liquidity Infusion', strength: 25, score: 64, outcome: 'Minor deflections damped. Does not insulate against global supply chain interest rate spikes.', status: 'completed' },
      { id: 't-2', name: 'Optimal Systemic Buffer', strength: 60, score: 90, outcome: 'Optimal interbank reserve coefficient isolates system from inter-country transfer shocks with 98% efficiency.', status: 'completed' },
      { id: 't-3', name: 'Aggressive Capital Constraint', strength: 95, score: 67, outcome: 'Excessive reserve mandates suppress commercial lending, resulting in a 1.2% annualized drop in GDP.', status: 'completed' }
    ]
  },
  {
    id: 'video',
    name: 'VIDEO',
    emoji: '📹',
    label: 'SSIM Macular Vision',
    focus: 'Cross-Attention Weighting',
    efficiencyLabel: 'Temporal SSIM Accuracy',
    optimalStrength: 65,
    optimalScore: 91,
    prompt: 'Optimizing latent spatial frame generation rates using cross-attention weight matrices under atmospheric distortion.',
    trials: [
      { id: 't-1', name: 'Baseline SSIM Guidance', strength: 30, score: 59, outcome: 'Visual artifacts and macroblock pixelation in rapid panning frames under cloud-distortion models.', status: 'completed' },
      { id: 't-2', name: 'Cross-Attention Latent Guidance', strength: 65, score: 91, outcome: 'High-fidelity reconstruction preserving 98.6% SSIM Macular scores with elegant temporal consistency.', status: 'completed' },
      { id: 't-3', name: 'Extreme Upscale Saturation', strength: 95, score: 72, outcome: 'Hallucinates fine textures that don\'t match source telemetry. High GPU processing overhead.', status: 'completed' }
    ]
  },
  {
    id: 'meddevices',
    name: 'MEDDEVICES',
    emoji: '⚕️',
    label: 'FDA Compliance Bounds',
    focus: 'Sensor Telemetry Power',
    efficiencyLabel: 'FDA EMI Coherence Rate',
    optimalStrength: 65,
    optimalScore: 92,
    prompt: 'Evaluating electromagnetic compliance and sensor telemetry bounds on active bio-compatible implants.',
    trials: [
      { id: 't-1', name: 'Low-Power Sensor Mode', strength: 25, score: 63, outcome: 'Weak signal-to-noise ratio. Periodic telemetry gaps when patient moves past heavy metal boundaries.', status: 'completed' },
      { id: 't-2', name: 'Coherency Bounds Stabilization', strength: 65, score: 92, outcome: 'Meets FDA implantable requirements under continuous 5G and MRI-adjacent proximity tests.', status: 'completed' },
      { id: 't-3', name: 'Max Power Telemetry', strength: 90, score: 70, outcome: 'Excessive power dissipation triggers localized tissue temperature alarm above 38.5°C limit.', status: 'completed' }
    ]
  },
  {
    id: 'surgery',
    name: 'SURGERY',
    emoji: '🦾',
    label: 'Robotic Kinematics',
    focus: 'Feedback Gain Coeff',
    efficiencyLabel: 'Path Tracking Accuracy',
    optimalStrength: 60,
    optimalScore: 95,
    prompt: 'Tuning PID controller feedback gains on surgical robotic arm joints to prevent trajectory deflection overshoots.',
    trials: [
      { id: 't-1', name: 'Moderate Force Dampening', strength: 35, score: 66, outcome: 'Sub-millimeter arm jitter is suppressed, but robotic path deflection lacks responsive tactile feedback.', status: 'completed' },
      { id: 't-2', name: 'Dual-Stage Kinematic Feedback', strength: 60, score: 95, outcome: 'Maintains absolute 15-micron precision under variable human tissue resistance with real-time feedback.', status: 'completed' },
      { id: 't-3', name: 'High PID Gain Lockup', strength: 90, score: 75, outcome: 'Extreme rigid joint stiffness triggers minor overshoot oscillations and motor thermal overload.', status: 'completed' }
    ]
  },
  {
    id: 'cancer',
    name: 'CANCER',
    emoji: '🔬',
    label: 'Oncology Express Pathways',
    focus: 'Inhibitor Delivery Target',
    efficiencyLabel: 'Transcript Suppressive Rate',
    optimalStrength: 65,
    optimalScore: 94,
    prompt: 'Modeling metabolic pathway expression shifts using targeted cellular micro-dose infusions.',
    trials: [
      { id: 't-1', name: 'Conservative Dose Expression', strength: 20, score: 58, outcome: 'Tumor transcript expression remains active. Insufficient gene pathway suppressive impact.', status: 'completed' },
      { id: 't-2', name: 'Targeted Micro-Dose Pathway', strength: 65, score: 94, outcome: 'Achieves 98.2% down-regulation of oncogenic transcription with zero observed healthy-cell toxicity.', status: 'completed' },
      { id: 't-3', name: 'Maximum Tolerated Dose', strength: 95, score: 69, outcome: 'Complete suppressive action, but triggers massive white-blood cell counts collapse and organ strain.', status: 'completed' }
    ]
  },
  {
    id: 'regenmed',
    name: 'REGENMED',
    emoji: '🌱',
    label: 'Tissue Scaffolds',
    focus: 'Acoustic Harmonic Matrix',
    efficiencyLabel: 'Cell Alignment Density',
    optimalStrength: 70,
    optimalScore: 92,
    prompt: 'Generating optimal acoustic wave patterns to accelerate cell alignment on 3D-printed biodegradable scaffolds.',
    trials: [
      { id: 't-1', name: 'Standard Scaffold Inoculation', strength: 30, score: 61, outcome: 'Sparsely aligned cell distribution. Regeneration cycle requires 24+ additional incubation days.', status: 'completed' },
      { id: 't-2', name: 'Acoustic Harmonic Matrix', strength: 70, score: 92, outcome: 'Accelerates cell scaffold alignment by 400% with absolute spatial cellular alignment accuracy.', status: 'completed' },
      { id: 't-3', name: 'Extreme Vibration Stress', strength: 95, score: 73, outcome: 'Excessive shear forces disrupt delicate polymer cell bonds, degrading overall scaffold integrity.', status: 'completed' }
    ]
  },
  {
    id: 'implants',
    name: 'IMPLANTS',
    emoji: '🦿',
    label: 'Neural Interfaces',
    focus: 'Cortical Signal Filtering',
    efficiencyLabel: 'Cortical Interface SNR',
    optimalStrength: 65,
    optimalScore: 93,
    prompt: 'Calibrating sub-millisecond cortical signal-to-noise ratios on neural interface implants.',
    trials: [
      { id: 't-1', name: 'Basic Neural Filtering', strength: 25, score: 64, outcome: 'Signal-to-noise ratio restricted to 12 dB. Sub-optimal mapping of complex motor intent vectors.', status: 'completed' },
      { id: 't-2', name: 'Deep Cortical Noise Rejection', strength: 65, score: 93, outcome: 'Maintains clear 28 dB cortical SNR, tracking motor intent channels with sub-millisecond precision.', status: 'completed' },
      { id: 't-3', name: 'Max Electro-Shielding', strength: 95, score: 71, outcome: 'Active noise cancellation generates minor local magnetic induction, exceeding target temperature limits.', status: 'completed' }
    ]
  }
];

function getCognitiveLogsForTab(tabId: string, focus: string, label: string) {
  const upperTab = tabId.toUpperCase();
  
  if (tabId === 'economic') {
    return [
      {
        progress: 10,
        type: 'info' as const,
        details: `[DATASET INGESTION LOG]
Dataset: RBA Inflation Stress Test 2026
Source: macro_variables.csv
Records: 5200 observations
Features: CPI, Wage Growth, Oil, AUD/USD, Shipping Index, Insurance Premium Index, Electricity Price, AI Energy Demand
Quality Check: Missing Values: 2.1%, Outliers: Detected 14
Action: Auto-normalized
Status: READY`
      },
      {
        progress: 25,
        type: 'info' as const,
        details: `[RESEARCH QUESTION CREATED AUTOMATICALLY]
Research Objective: "Can non-traditional supply variables improve inflation forecasting?"
Generated by: Meta-Cognition Engine
Baseline: Traditional RBA model
Challenge: Find missing causal variables
Priority: HIGH`
      },
      {
        progress: 40,
        type: 'info' as const,
        details: `[HYPOTHESIS GENERATION]
H1: Shipping congestion increases insurance cost. [Confidence: 72%]
H2: Insurance cost increases freight prices. [Confidence: 81%]
H3: Freight delays transmit to CPI. [Confidence: 77%]
Proposed experiment: Remove insurance data. Compare forecast error.`
      },
      {
        progress: 55,
        type: 'interaction' as const,
        details: `[AGENT DEBATE]
Generator (Mistral): "Inflation pressure is mainly energy driven."
Critic (Phi-3): "Rejected. Evidence shows freight insurance explains 18% unexplained variance."
Vision Agent (LLaVA): "Satellite drought patterns indicate agricultural supply pressure."
Arbiter Consensus: Combined model required. [Confidence: 89%]`
      },
      {
        progress: 70,
        type: 'physics' as const,
        details: `[SIMULATION LOG]
Experiment: RBA Shock Test #0047
Scenario: Oil: 120 USD, Shipping: +35%, Insurance: +24%
Prediction: CPI: 4.8%
Reality Anchor: Actual: 4.6%
Error: MAE: 0.12
Improvement: Previous MAE: 0.31 -> New MAE: 0.12 [PASS]`
      },
      {
        progress: 85,
        type: 'info' as const,
        details: `[META COGNITION REFLECTION]
Failure Analysis: Previous assumption: Energy was dominant inflation driver.
Detected weakness: Insurance transmission missing.
Correction: Added Port congestion index, Insurance premium index.
Result: Prediction improved 22%
Learning: Future inflation experiments must include logistics stress variables. Memory updated.`
      },
      {
        progress: 95,
        type: 'info' as const,
        details: `[AUTONOMOUS RESEARCH DIRECTOR]
Completed: RBA Inflation Test
Next Highest Information Gain:
Experiment: "Test weather impact on food inflation"
Required data: Rainfall, NDVI satellite index, Crop yield, Fertilizer price
Reason: Current uncertainty: Agriculture inflation (+14% expected gain)
Scheduled: RUN`
      },
      {
        progress: 100,
        type: 'interaction' as const,
        details: `[OMEGA SCIENTIFIC PASSPORT]
Experiment ID: RBA-2026-0047
Question: What drives inflation?
Models: Mistral, Phi-3, LLaVA
Dataset: Macro + Alternative Signals
Result: Prediction improvement: 22%
Discovery: Insurance -> Freight -> CPI
Confidence: 91%
Next Action: Agriculture supply chain test
Hash: A7F92C44E8C2B3`
      }
    ];
  }

  if (tabId === 'weather') {
    return [
      {
        progress: 10,
        type: 'info' as const,
        details: `[DATASET INGESTION LOG]
Dataset: Urban Aerosol Dispersion Profile 2026
Source: air_sensor_array.nc
Records: 12,400 coordinate slices
Features: Boundary Layer Height, Aerosol Tracer Concentration, Local Relative Humidity, Surface Temperature Grid, Particulate PM2.5, Wind Vector Delta
Quality Check: Missing Values: 0.8%, Outliers: 3 high-heat sensor spikes isolated and filtered
Status: READY`
      },
      {
        progress: 25,
        type: 'info' as const,
        details: `[RESEARCH QUESTION CREATED AUTOMATICALLY]
Research Objective: "Optimize urban aerosol tracer dispersal to maximize atmospheric Air Quality Index (AQI) correction while avoiding condensation anomalies."
Generated by: Meta-Cognition Engine
Baseline: Static Lagrangian dispersal model
Challenge: Prevent localized micro-precipitate droplets
Priority: CRITICAL`
      },
      {
        progress: 40,
        type: 'info' as const,
        details: `[HYPOTHESIS GENERATION]
H1: Boundary layer height restricts aerosol height, accelerating saturation thresholds. [Confidence: 79%]
H2: Relative humidity above 75% triggers premature micro-precipitation nucleation. [Confidence: 84%]
H3: Optimal 60% Saturation Curve maximizes dispersal drift without condensation. [Confidence: 90%]
Proposed experiment: Execute 60% saturation profile across varying boundary heights.`
      },
      {
        progress: 55,
        type: 'interaction' as const,
        details: `[AGENT DEBATE]
Generator (Mistral): "Dispersal efficiency is strictly determined by surface temperature wind vectors."
Critic (Phi-3): "Rejected. Multi-point boundary height holds 34% more predictive variance on tracer concentration."
Vision Agent (LLaVA): "LiDAR scattering profiles confirm immediate moisture condensation at low atmospheric layers."
Arbiter Consensus: Dynamic boundary scaling required. [Confidence: 92%]`
      },
      {
        progress: 70,
        type: 'physics' as const,
        details: `[SIMULATION LOG]
Experiment: Atmospheric Tracer Sweep #1042
Scenario: Humidity: 78%, Boundary Layer: 450m, Tracer Intensity: 60%
Prediction: Localized AQI correction: 84% improvement
Reality Anchor: Actual: 85%
Error: MAE: 0.05
Improvement: Previous MAE: 0.28 -> New MAE: 0.05 [PASS]`
      },
      {
        progress: 85,
        type: 'info' as const,
        details: `[META COGNITION REFLECTION]
Failure Analysis: Previous assumption: Wind vector was the solitary transport driver.
Detected weakness: Boundary layer thermal inversion cap was omitted.
Correction: Integrated dynamic thermal inversion tracking variables.
Result: Dispersal prediction accuracy improved by 28%
Learning: Dispersal models must evaluate thermodynamic caps in metropolitan zones. Memory updated.`
      },
      {
        progress: 95,
        type: 'info' as const,
        details: `[AUTONOMOUS RESEARCH DIRECTOR]
Completed: Atmospheric Tracer Sweep #1042
Next Highest Information Gain:
Experiment: "Aerosol interaction with urban heat islands"
Required data: FLIR thermal maps, Concrete density, HVAC plume indexes, Traffic heat dissipation
Reason: High uncertainty in core business districts (+18% expected gain)
Scheduled: RUN`
      },
      {
        progress: 100,
        type: 'interaction' as const,
        details: `[OMEGA SCIENTIFIC PASSPORT]
Experiment ID: ATM-2026-1042
Question: How to optimize urban aerosol dispersion safely?
Models: Mistral, Phi-3, LLaVA
Dataset: Air Sensor Array + LiDAR
Result: Prediction improvement: 28%
Discovery: Thermal Inversion Cap -> Aerosol Saturation -> AQI Peak
Confidence: 94%
Next Action: Urban Heat Island correlation test
Hash: B8E1F30C9E7D42`
      }
    ];
  }

  return [
    {
      progress: 10,
      type: 'info' as const,
      details: `[DATASET INGESTION LOG]
Dataset: Autonomous ${upperTab} Stream 2026
Source: ${tabId}_discovery_grid.db
Records: 8400 state vectors
Features: ${focus}, Base Temperature, System Boundary Latency, Density Delta, Calibration Vector
Quality Check: Outliers isolated, standard deviation within 1.4%
Status: READY`
    },
    {
      progress: 25,
      type: 'info' as const,
      details: `[RESEARCH QUESTION CREATED AUTOMATICALLY]
Research Objective: "Optimize ${label} to identify the ideal ${focus} boundary envelope."
Generated by: Meta-Cognition Engine
Baseline: Standard static calibration
Challenge: Eliminate localized thermal/density phase drift
Priority: HIGH`
    },
    {
      progress: 40,
      type: 'info' as const,
      details: `[HYPOTHESIS GENERATION]
H1: ${focus} sweep provides non-linear efficiency gains. [Confidence: 78%]
H2: Phase transition anomalies trigger performance degradation past 80% intensity. [Confidence: 83%]
Proposed experiment: Run discrete sweeps to isolate peak stability.`
    },
    {
      progress: 55,
      type: 'interaction' as const,
      details: `[AGENT DEBATE]
Generator (Mistral): "Target parameters should be scaled exponentially for maximum output."
Critic (Phi-3): "Rejected. Thermal saturation registers clear structural deflection past 75% strength."
Vision Agent (LLaVA): "Sensor heat map confirms core temperature delta remains stable at 60-65% strength."
Arbiter Consensus: Medium intensity stabilization is optimal. [Confidence: 91%]`
    },
    {
      progress: 70,
      type: 'physics' as const,
      details: `[SIMULATION LOG]
Experiment: ${upperTab} Calibration Sweep #0241
Scenario: ${focus}: 65%, System Temperature: Stable, Coherence: Peak
Prediction: Efficiency Score: 92%
Reality Anchor: Actual: 93.4%
Error: MAE: 0.08
Improvement: Previous MAE: 0.24 -> New MAE: 0.08 [PASS]`
    },
    {
      progress: 85,
      type: 'info' as const,
      details: `[META COGNITION REFLECTION]
Failure Analysis: Identified non-linear feedback loop at extreme boundaries.
Correction: Dynamic power limiting filters activated above 80% threshold.
Result: Structural safety margin improved by 19%
Learning: Future tests should auto-clamp voltage/vibration spikes. Memory updated.`
    },
    {
      progress: 95,
      type: 'info' as const,
      details: `[AUTONOMOUS RESEARCH DIRECTOR]
Completed: ${upperTab} Calibration Sweep
Next Highest Information Gain:
Experiment: "Test dynamic environmental stress coupling"
Required data: Dynamic vibration feed, cross-sensor telemetry
Reason: High information gain potential (+15%)
Scheduled: RUN`
    },
    {
      progress: 100,
      type: 'interaction' as const,
      details: `[OMEGA SCIENTIFIC PASSPORT]
Experiment ID: ${upperTab}-2026-0241
Question: How to optimize ${label}?
Models: Mistral, Phi-3, LLaVA
Dataset: ${upperTab} Alternative Sensors
Result: Structural prediction improvement: 19%
Discovery: Optimal ${focus} -> Balanced ${label} Response
Confidence: 93%
Next Action: Dynamic stress coupling test
Hash: D5A9F246C${tabId.slice(0, 3).toUpperCase()}`
    }
  ];
}

export default function DiscoveryPlannerPanel({
  selectedPolicy,
  addTemporalEvent,
  benchmarkResults,
  onLinkToLogs
}: DiscoveryPlannerPanelProps) {
  const [activeTabId, setActiveTabId] = useState<string>('weather');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [trials, setTrials] = useState<Experiment[]>([]);
  const [bestTrial, setBestTrial] = useState<Experiment | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('');

  // Synchronize active tab with selected policy category if any
  useEffect(() => {
    if (selectedPolicy && selectedPolicy.category) {
      const match = DISCOVERY_TABS.find(t => t.id === selectedPolicy.category.toLowerCase());
      if (match) {
        setActiveTabId(match.id);
        // Reset trial states when tab changes automatically
        setTrials([]);
        setBestTrial(null);
        setIsRunning(false);
        setProgress(0);
      }
    }
  }, [selectedPolicy]);

  const activeTab = DISCOVERY_TABS.find(t => t.id === activeTabId) || DISCOVERY_TABS[0];

  const handleStartDiscovery = () => {
    setIsRunning(true);
    setProgress(0);
    setTrials([]);
    setBestTrial(null);
    setCurrentStep('Initializing Autonomous Parameter Sweep...');
    addTemporalEvent(`Discovery Planner initiated high-fidelity parameter sweep for ${activeTab.name} (${activeTab.label})`, 'info');
  };

  useEffect(() => {
    if (!isRunning) return;

    const cognitiveLogs = getCognitiveLogsForTab(activeTabId, activeTab.focus, activeTab.label);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        
        // Feed OMEGA-CORE Scientific Cognitive Log steps in real-time
        const matchedLog = cognitiveLogs.find(log => log.progress === next);
        if (matchedLog) {
          addTemporalEvent(matchedLog.details, matchedLog.type);
        }

        // Trial 1 triggers at 20% progress
        if (next === 20) {
          setCurrentStep(`Running Trial #1: ${activeTab.focus} at ${activeTab.trials[0].strength}% boundary...`);
          setTrials([activeTab.trials[0]]);
          addTemporalEvent(`Discovery Planner completed Trial #1 (${activeTab.trials[0].strength}% Intensity): Score ${activeTab.trials[0].score}/100`, 'info');
        }

        // Trial 2 triggers at 50% progress
        if (next === 50) {
          setCurrentStep(`Running Trial #2: ${activeTab.focus} at ${activeTab.trials[1].strength}% boundary...`);
          setTrials((prevTrials) => [...prevTrials, activeTab.trials[1]]);
          addTemporalEvent(`Discovery Planner completed Trial #2 (${activeTab.trials[1].strength}% Intensity): Score ${activeTab.trials[1].score}/100`, 'info');
        }

        // Trial 3 triggers at 80% progress
        if (next === 80) {
          setCurrentStep(`Running Trial #3: ${activeTab.focus} at ${activeTab.trials[2].strength}% boundary...`);
          setTrials((prevTrials) => [...prevTrials, activeTab.trials[2]]);
          addTemporalEvent(`Discovery Planner completed Trial #3 (${activeTab.trials[2].strength}% Intensity): Score ${activeTab.trials[2].score}/100`, 'info');
        }

        if (next >= 100) {
          clearInterval(timer);
          setIsRunning(false);
          setCurrentStep('Autonomous Discovery Complete!');
          
          const optimal = activeTab.trials[1]; // Always trial 2 in this sweep model
          setBestTrial(optimal);
          addTemporalEvent(`Discovery Planner determined optimal parameter: ${optimal.strength}% ${activeTab.focus} (Efficiency Score: ${optimal.score}/100)`, 'interaction');
          return 100;
        }
        return next;
      });
    }, 60); // Faster sweep time for responsive UX

    return () => clearInterval(timer);
  }, [isRunning, activeTabId, activeTab, addTemporalEvent]);

  return (
    <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] rounded-none flex flex-col gap-4 mt-2">
      <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-black animate-spin-slow" />
          <h2 className="font-bold text-[#1A1A1A] tracking-tight text-sm font-serif">Discovery Planner</h2>
        </div>
        <span className="text-[9px] font-mono text-[#E05A36] bg-[#FCFAF7] px-2 py-0.5 border border-[#1A1A1A]/30 font-bold uppercase">
          13 Labs Unified
        </span>
      </div>

      {/* 13 Tabs Interactive Strip */}
      <div className="flex flex-col gap-1.5 border-b border-[#EBE8E3] pb-3">
        <span className="text-[10px] font-bold font-mono uppercase text-[#1A1A1A]/70">
          Target Exploration Lab
        </span>
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
          {DISCOVERY_TABS.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (isRunning) return;
                  setActiveTabId(tab.id);
                  setTrials([]);
                  setBestTrial(null);
                  setProgress(0);
                }}
                disabled={isRunning}
                className={`px-3 py-1 text-[10px] font-bold font-mono tracking-tight transition cursor-pointer flex items-center gap-1 shrink-0 border rounded-none ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-[#FCFAF7] text-[#1A1A1A] border-[#EBE8E3] hover:border-[#1A1A1A]'
                } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        <div className="bg-[#FCFAF7] border border-[#1A1A1A] p-4 rounded-none font-serif text-xs flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-black font-bold text-xs uppercase font-mono">
            <span>{activeTab.emoji}</span>
            <span>{activeTab.label} Optimization Guide</span>
          </div>
          <p className="text-slate-700 leading-relaxed italic">
            "{activeTab.prompt}"
          </p>
        </div>

        {/* Start Button & Progress HUD */}
        {!isRunning && !bestTrial ? (
          <button
            onClick={handleStartDiscovery}
            className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white rounded-none py-2.5 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition border border-[#1A1A1A] cursor-pointer"
          >
            <Beaker className="w-4 h-4" />
            Analyze Optimal Parameter Envelope ({activeTab.name})
          </button>
        ) : (
          <div className="bg-[#FCFAF7] border border-[#1A1A1A] rounded-none p-3.5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-[#1A1A1A] flex items-center gap-1.5">
                {isRunning ? <Loader2 className="w-3.5 h-3.5 text-[#E05A36] animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                <span className="truncate max-w-[280px]">{currentStep}</span>
              </span>
              <span className="text-[#E05A36] font-extrabold">{progress}%</span>
            </div>
            <div className="w-full bg-[#EBE8E3] h-2 rounded-none overflow-hidden border border-[#1A1A1A]">
              <div
                className="bg-[#1A1A1A] h-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Running trial outcomes */}
        {trials.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold font-mono uppercase text-black tracking-wide">Experimental Trial Log</span>
            <div className="space-y-2">
              {trials.map((trial) => (
                <div key={trial.id} className="bg-white border border-[#1A1A1A] p-3 rounded-none flex items-start gap-2.5 text-xs text-black animate-fadeIn">
                  <div className="bg-[#EBE8E3] border border-[#1A1A1A] rounded-none p-1 font-mono text-black text-[10px] font-bold shrink-0">
                    T{trial.id.split('-')[1]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5 border-b border-[#EBE8E3] pb-1">
                      <strong className="text-black text-[11px] font-serif font-bold italic">{trial.name}</strong>
                      <span className="text-[10px] font-mono font-bold text-[#1B6A43]">Score: {trial.score}/100</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-normal font-serif italic mt-1">"{trial.outcome}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discovery optimal report overlay */}
        {bestTrial && (
          <div className="bg-[#EBE8E3]/60 border border-[#1A1A1A] p-4 rounded-none flex flex-col gap-2.5 animate-fadeIn text-[#1A1A1A]">
            <div className="flex items-center gap-1.5 text-[#1B6A43] font-mono font-bold text-xs uppercase tracking-wider">
              <Award className="w-4.5 h-4.5 text-[#1B6A43]" />
              <span>Optimal Configurations Found</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-white p-2.5 border border-[#1A1A1A] rounded-none flex flex-col">
                <span className="text-[9px] text-slate-600 uppercase font-bold">{activeTab.focus}</span>
                <strong className="text-black text-sm font-extrabold mt-0.5">{activeTab.optimalStrength}% (Medium)</strong>
              </div>
              <div className="bg-white p-2.5 border border-[#1A1A1A] rounded-none flex flex-col">
                <span className="text-[9px] text-slate-600 uppercase font-bold">{activeTab.efficiencyLabel}</span>
                <strong className="text-[#1B6A43] text-sm font-extrabold mt-0.5">{activeTab.optimalScore}% (Peak)</strong>
              </div>
            </div>

            <p className="text-xs text-black leading-relaxed italic border-l-2 border-[#1A1A1A] pl-3 font-serif">
              "{bestTrial.outcome}"
            </p>

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 border-t border-[#1A1A1A]/20 pt-3 mt-1">
              <button
                onClick={handleStartDiscovery}
                className="text-[10px] font-mono font-bold text-[#E05A36] hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none w-max"
              >
                <span>Re-run experimental parameters sweep</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              {onLinkToLogs && (
                <button
                  onClick={onLinkToLogs}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold uppercase text-[10px] py-1.5 px-3 border border-[#1A1A1A] flex items-center justify-center gap-1.5 transition cursor-pointer shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
                >
                  <Terminal className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>View Cognitive Logs</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
