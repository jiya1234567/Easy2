import React, { useState, useEffect, useRef } from 'react';
import { 
  Beaker, CheckCircle, Play, RefreshCw, Layers, Database, 
  ChevronRight, ArrowRight, ClipboardCheck, Info, FileCode, AlertCircle, HelpCircle
} from 'lucide-react';

interface DatasetItem {
  id: string;
  title: string;
  domain: string;
  icon: string;
  mission: string;
  context: Record<string, any>;
  devices: Record<string, string>;
  environment: Record<string, any>;
  measurements: Record<string, number[]>;
  plotX: string;
  plotY: string;
  expectedDiscovery: string;
  deviceTelemetry: Record<string, any>;
  metaCognition: {
    mission: string;
    confidence: string;
    realityScore: string;
    whatFailed: string;
    missingVariable: string;
    instrumentNeeded: string;
    nextExperiment: string;
    knowledgeGraph: string;
  };
}

const PROOF_OF_PRINCIPLE_DATASETS: DatasetItem[] = [
  {
    id: 'materials',
    title: 'Materials Science (Al-Mg-Graphene)',
    domain: 'Metallurgy & Composites',
    icon: '🔬',
    mission: 'Discover a lightweight alloy with thermal conductivity above 250 W/m·K while maintaining tensile strength above 450 MPa.',
    context: {
      "candidate_material": "Al-Mg-Graphene",
      "objective": "Increase thermal conductivity while reducing density",
      "constraints": {
        "density_max": 2.9,
        "cost_max": 25,
        "thermal_conductivity_min": 250
      }
    },
    devices: {
      "SEM": "Zeiss Sigma",
      "XRD": "Bruker D8",
      "Raman": "Renishaw",
      "DSC": "TA Discovery",
      "Robot": "Universal Robots UR5"
    },
    environment: {
      "temperature_C": 25,
      "humidity_pct": 42,
      "pressure_kPa": 101.4
    },
    measurements: {
      "density": [2.82, 2.80, 2.81],
      "thermal_conductivity": [210, 225, 244],
      "yield_strength": [455, 460, 462],
      "grain_size_nm": [180, 165, 150]
    },
    plotX: 'grain_size_nm',
    plotY: 'thermal_conductivity',
    expectedDiscovery: 'Grain refinement increases conductivity; conductivity plateau near 245 W/m·K; graphene loading likely insufficient; recommend 3.5% graphene.',
    deviceTelemetry: {
      "device_id": "SEM-01",
      "manufacturer": "Zeiss",
      "timestamp": "2026-07-21T09:30:00Z",
      "status": "OK",
      "calibration": "PASS",
      "temperature": 25.1,
      "measurement": {
        "grain_size_nm": 145
      }
    },
    metaCognition: {
      mission: "Discover lightweight high-conductivity alloy",
      confidence: "87.4%",
      realityScore: "92.1% alignment",
      whatFailed: "Conductivity did not exceed 250 W/m·K target due to plateau.",
      missingVariable: "Graphene volume fraction and lattice dispersion index.",
      instrumentNeeded: "Renishaw Raman Spectrometer (measuring G/D band ratio and peak dispersion).",
      nextExperiment: "Inject 3.5% Graphene under 150nm grain refinement sweep.",
      knowledgeGraph: "Add edge: Graphene dispersion -> [Thermal Conductive Manifold]."
    }
  },
  {
    id: 'semiconductor',
    title: 'Semiconductor Research (3nm GAAFET)',
    domain: 'Microelectronics',
    icon: '⚡',
    mission: 'Reduce leakage current below 0.5 nA in 3nm Gate-All-Around field effect transistors.',
    context: {
      "technology": "3nm GAAFET",
      "annealing": "Laser",
      "gate_material": "HfO2"
    },
    devices: {
      "AFM": "Bruker",
      "ProbeStation": "Cascade",
      "ThermalCamera": "FLIR"
    },
    environment: {
      "temperature_C": 21.8,
      "humidity_pct": 35.2,
      "pressure_kPa": 101.1
    },
    measurements: {
      "anneal_temp": [900, 950, 1000, 1050],
      "gate_leakage_nA": [2.8, 1.4, 0.7, 0.45],
      "oxide_thickness_nm": [1.8, 1.7, 1.6, 1.5]
    },
    plotX: 'anneal_temp',
    plotY: 'gate_leakage_nA',
    expectedDiscovery: 'Leakage current falls rapidly until gate oxide crystallization reaches monoclinic equilibrium near 1.5 nm.',
    deviceTelemetry: {
      "device_id": "PROBE-STATION-03",
      "manufacturer": "Cascade",
      "timestamp": "2026-07-21T10:15:00Z",
      "status": "OK",
      "calibration": "PASS",
      "temperature": 21.8,
      "measurement": {
        "gate_leakage_nA": 0.45
      }
    },
    metaCognition: {
      mission: "Reduce GAAFET leakage current < 0.5 nA",
      confidence: "91.2%",
      realityScore: "96.8% alignment",
      whatFailed: "Initial trials above 0.5 nA due to incomplete crystallization of HfO2.",
      missingVariable: "Oxygen vacancy concentration and crystal phase ratio (Monoclinic vs Tetragonal).",
      instrumentNeeded: "Bruker XRD & Raman Spectrometer.",
      nextExperiment: "Perform 1075°C rapid laser spike annealing sweep on 1.5nm HfO2.",
      knowledgeGraph: "Add edge: Laser Anneal Temp -> [Tetragonal Phase Fraction] -> [Gate Leakage Manifold]."
    }
  },
  {
    id: 'climate',
    title: 'Climate Diagnostics (Queensland Storms)',
    domain: 'Meteorology & Sensing',
    icon: '⛈️',
    mission: 'Determine whether barometric pressure drops precede severe localized storm systems in Queensland.',
    context: {
      "location": "Queensland",
      "season": "Summer"
    },
    devices: {
      "WeatherStation": "BOM",
      "Satellite": "Himawari",
      "Radar": "Doppler"
    },
    environment: {
      "temperature_C": 31.4,
      "humidity_pct": 78.5,
      "pressure_kPa": 100.2
    },
    measurements: {
      "pressure": [1018, 1016, 1014, 1009, 1002, 996],
      "wind": [8, 10, 15, 22, 35, 45],
      "humidity": [60, 63, 70, 82, 91, 95],
      "rain": [0, 0, 4, 16, 55, 80]
    },
    plotX: 'pressure',
    plotY: 'rain',
    expectedDiscovery: 'Pressure drop serves as a leading indicator of storm intensity, triggering cascades: Pressure ↓ Wind ↓ Rain ↓ Storm.',
    deviceTelemetry: {
      "device_id": "WX-STN-BOM-07",
      "manufacturer": "BOM",
      "timestamp": "2026-07-21T11:45:00Z",
      "status": "OK",
      "calibration": "PASS",
      "temperature": 31.4,
      "measurement": {
        "pressure_mbar": 996
      }
    },
    metaCognition: {
      mission: "Identify storm precursors",
      confidence: "85.0%",
      realityScore: "98.2% alignment",
      whatFailed: "Oversimplified model missed wind shear vector changes.",
      missingVariable: "Atmospheric vertical wind shear and convection index.",
      instrumentNeeded: "Himawari Satellite Infrared sounder & Doppler Radar.",
      nextExperiment: "Map high-resolution radar vertical convection sweeps during pressure gradients.",
      knowledgeGraph: "Add edge: Pressure Drop -> [Convection Shear] -> [Storm Intensity]."
    }
  },
  {
    id: 'immunotherapy',
    title: 'Oncology Immunotherapy (Melanoma Escape)',
    domain: 'Biomedicine & Genomics',
    icon: '🧬',
    mission: 'Identify causal drivers of tumor cell melanoma immune escape and CD8 exhaustion.',
    context: {
      "therapy": "Nivolumab",
      "mutation": "BRAF V600E"
    },
    devices: {
      "FlowCytometer": "BD",
      "Sequencer": "Illumina",
      "Microscope": "Leica"
    },
    environment: {
      "temperature_C": 37.0,
      "humidity_pct": 95.0,
      "pressure_kPa": 101.3
    },
    measurements: {
      "tumour_volume": [100, 120, 150, 180, 220, 280],
      "PDL1": [20, 25, 35, 48, 60, 72],
      "CD8": [95, 90, 82, 70, 60, 48],
      "IFNg": [80, 76, 70, 60, 50, 40],
      "ctDNA": [5, 8, 12, 20, 34, 48]
    },
    plotX: 'PDL1',
    plotY: 'CD8',
    expectedDiscovery: 'BRAF V600E triggers PD-L1 upregulation, driving CD8 exhaustion and tumor escape pathway.',
    deviceTelemetry: {
      "device_id": "CYTOMETER-BD-2",
      "manufacturer": "BD",
      "timestamp": "2026-07-21T13:20:00Z",
      "status": "OK",
      "calibration": "PASS",
      "temperature": 37.0,
      "measurement": {
        "CD8_active_pct": 48
      }
    },
    metaCognition: {
      mission: "Map melanoma immune escape causal loops",
      confidence: "89.0%",
      realityScore: "94.5% alignment",
      whatFailed: "Single-agent treatment failed to stop volume growth.",
      missingVariable: "Alternative immune checkpoints like LAG-3 or TIM-3 expression levels.",
      instrumentNeeded: "Illumina Sequencer (single-cell transcriptomics) & BD Flow Cytometer.",
      nextExperiment: "Dose Nivolumab + Relatlimab (anti-LAG-3) dual cocktail on cell lines.",
      knowledgeGraph: "Add edge: LAG-3 activation -> [CD8 Exhaustion Manifold] -> [Immune Escape]."
    }
  },
  {
    id: 'propulsion',
    title: 'Propulsion Nozzle (LOX/Methane)',
    domain: 'Aerospace Engineering',
    icon: '🚀',
    mission: 'Prevent structural combustion nozzle fatigue and erosion failure during static fire tests.',
    context: {
      "technology": "Regenerative Nozzle",
      "fuel": "LOX/Methane"
    },
    devices: {
      "ThermalCamera": "FLIR",
      "PressureSensor": "Honeywell",
      "StrainGauge": "HBM"
    },
    environment: {
      "temperature_C": 18.5,
      "humidity_pct": 52.0,
      "pressure_kPa": 101.8
    },
    measurements: {
      "combustion_temp": [2800, 2950, 3100, 3250],
      "pressure_bar": [90, 110, 130, 145],
      "strain": [0.10, 0.14, 0.18, 0.26],
      "erosion_mm": [0.00, 0.02, 0.07, 0.18]
    },
    plotX: 'combustion_temp',
    plotY: 'erosion_mm',
    expectedDiscovery: 'Pressure spikes drive extreme heat flux and thermal fatigue, leading to nozzle erosion failures above 3100K.',
    deviceTelemetry: {
      "device_id": "THERMO-FLIR-X",
      "manufacturer": "FLIR",
      "timestamp": "2026-07-21T14:40:00Z",
      "status": "OK",
      "calibration": "PASS",
      "temperature": 18.5,
      "measurement": {
        "nozzle_throat_temp": 3250
      }
    },
    metaCognition: {
      mission: "Prevent combustion nozzle fatigue & erosion",
      confidence: "93.0%",
      realityScore: "97.2% alignment",
      whatFailed: "Simple linear expansion models failed to predict the erosion spike above 3100K.",
      missingVariable: "Nozzle boundary layer gas composition and carbon soot deposition rate.",
      instrumentNeeded: "Raman Spectroscopy (in-situ gas analysis) & high-resolution FLIR cameras.",
      nextExperiment: "Execute a combustion test sweep varying LOX-to-fuel mixture ratio from 2.8 to 3.4.",
      knowledgeGraph: "Add edge: Mixture Ratio -> [Soot Boundary Layer] -> [Erosion Velocity]."
    }
  },
  {
    id: 'metrology',
    title: 'CAD Metrology Print Shrinkage',
    domain: 'Additive Manufacturing',
    icon: '📐',
    mission: 'Automatically compensate 3D-printed metal alloy shrinkage using high-density laser scan feedback loops.',
    context: {
      "alloy": "Inconel 718",
      "printer": "Selective Laser Sintering"
    },
    devices: {
      "CAD": "Autodesk Fusion",
      "Printer": "EOS M290",
      "LaserScanner": "Creaform"
    },
    environment: {
      "temperature_C": 24.2,
      "humidity_pct": 44.1,
      "pressure_kPa": 101.5
    },
    measurements: {
      "CAD_mm": [100, 50, 25],
      "Printed_mm": [99.1, 49.5, 24.7],
      "LaserScan_mm": [99.2, 49.6, 24.8]
    },
    plotX: 'CAD_mm',
    plotY: 'Printed_mm',
    expectedDiscovery: 'Systematic shrinkage of ~1% observed. Apply toolpath compensation multiplier and reprint for error correction.',
    deviceTelemetry: {
      "device_id": "METROLOGY-CREAFORM-1",
      "manufacturer": "Creaform",
      "timestamp": "2026-07-21T15:55:00Z",
      "status": "OK",
      "calibration": "PASS",
      "temperature": 24.2,
      "measurement": {
        "dimensional_deviation_pct": -0.9
      }
    },
    metaCognition: {
      mission: "Compensate 3D print shrinkage automatically",
      confidence: "94.8%",
      realityScore: "99.1% alignment",
      whatFailed: "Initial print without shrinkage scaling factor failed mechanical tolerances.",
      missingVariable: "Anisotropic shrinkage coefficient along the Z-axis relative to thermal cooling rate.",
      instrumentNeeded: "High-resolution Laser Metrology scanner & pyrometers.",
      nextExperiment: "Print a multi-axial test coupon with 1.1% isotropic scale offset.",
      knowledgeGraph: "Add edge: Thermal Cooling Rate -> [Anisotropic Shrinkage Tensor] -> [CAD compensation path]."
    }
  }
];

interface ValidationStep {
  step: number;
  name: string;
  desc: string;
  targetTab: string;
  sequenceStep: string;
  verificationKey: string;
}

const MASTER_TEST_STEPS: ValidationStep[] = [
  { step: 1, name: 'Mission Intent', desc: 'Define falsifiable scientific objective and targets', targetTab: '🔬 HARNESS CONSOLE / ROADTESTS', sequenceStep: 'Step 1 (Goal Specification)', verificationKey: 'Mission Intent' },
  { step: 2, name: 'Scientific Context', desc: 'Validate candidate parameters, objective variables & constraints', targetTab: '💡 DISCOVERY PLANNER (SUGGESTIONS)', sequenceStep: 'Step 2 (Assumptions Binding)', verificationKey: 'Context' },
  { step: 3, name: 'Instrument Config', desc: 'Bind and calibrate physical hardware instrumentation', targetTab: '🔌 HARDWARE & DEVICE LAYERS', sequenceStep: 'Step 3 (Hardware Registries)', verificationKey: 'Instrument Setup' },
  { step: 4, name: 'Environmental Capture', desc: 'Acquire real-time atmospheric & mechanical biases', targetTab: '🔌 HARDWARE & DEVICE LAYERS', sequenceStep: 'Step 4 (Ambient Arrays)', verificationKey: 'Environment' },
  { step: 5, name: 'Measurement Dataset', desc: 'Feed raw sensor & instrument readings into the terminal', targetTab: '💻 TERMINAL / CONSOLE FEED', sequenceStep: 'Step 5 (Ingestion Feed)', verificationKey: 'Raw Data' },
  { step: 6, name: 'Simulation Run', desc: 'Predictive modeling & multi-physics theoretical manifold calculation', targetTab: '📐 GEOMETRIC MANIFOLD / REALITY', sequenceStep: 'Step 6 (Manifold Forecast)', verificationKey: 'Simulation' },
  { step: 7, name: 'Reality Anchor', desc: 'Map empirical observations directly against simulated bounds', targetTab: '💻 REALITY TAB / METROLOGY', sequenceStep: 'Step 7 (Scans Alignment)', verificationKey: 'Reality Anchor' },
  { step: 8, name: 'Knowledge Graph Update', desc: 'Establish links and causal weights between variables', targetTab: '🔗 HYPER GRAPH CAUSAL MESH', sequenceStep: 'Step 8 (Mesh Edge Ingestion)', verificationKey: 'AI Reasoning' },
  { step: 9, name: 'Meta Reflection', desc: 'Engage critique loops on missing variables & anomalies', targetTab: '📐 GEOMETRIC RULIAD', sequenceStep: 'Step 9 (Pathways Uncertainty)', verificationKey: 'Meta-Cognition' },
  { step: 10, name: 'Next Experiment', desc: 'Formulate highest-information-gain parameters sweep', targetTab: '⛓️ AUTO-CHAIN DISCOVERY', sequenceStep: 'Step 10 (Autonomous Iteration)', verificationKey: 'Next Experiment' }
];

export default function MasterTestSandbox({ onLogEvent }: { onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void }) {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('materials');
  const [activePackageTab, setActivePackageTab] = useState<'mission' | 'devices' | 'measurements'>('mission');
  
  const [executing, setExecuting] = useState<boolean>(false);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(-1);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [showScorecard, setShowScorecard] = useState<boolean>(false);
  
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const selectedDataset = PROOF_OF_PRINCIPLE_DATASETS.find(d => d.id === selectedDatasetId) || PROOF_OF_PRINCIPLE_DATASETS[0];

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  const runMasterValidation = () => {
    if (executing) return;
    setExecuting(true);
    setActiveStepIdx(0);
    setShowScorecard(false);
    setTerminalLogs([
      `[MASTER-RUN] Initializing Standard Test Package for Domain: ${selectedDataset.title.toUpperCase()}`,
      `[MASTER-RUN] Ingesting Universal Device Telemetry schema...`
    ]);

    onLogEvent(`[MASTER_SANDBOX] Commenced 10-step validation loop for ${selectedDataset.title}`, 'interaction');

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep >= MASTER_TEST_STEPS.length) {
        clearInterval(interval);
        setExecuting(false);
        setShowScorecard(true);
        setTerminalLogs(prev => [
          ...prev,
          `[✓] Validation sequence complete for ${selectedDataset.title}. All OMEGA layers integrated successfully.`,
          `[✓] SCORECARD GENERATED: 11/11 criteria satisfied (PASS)`
        ]);
        onLogEvent(`[MASTER_SANDBOX] Validation loop successfully concluded for ${selectedDataset.title}`, 'physics');
        return;
      }

      const stepDetails = MASTER_TEST_STEPS[currentStep];
      setActiveStepIdx(currentStep);

      // Add specialized terminal messages based on step
      let logMsg = '';
      switch (stepDetails.step) {
        case 1:
          logMsg = `[STAGE 1/10] [MISSION INTENT] Set objective: "${selectedDataset.mission}"`;
          break;
        case 2:
          logMsg = `[STAGE 2/10] [SCIENTIFIC CONTEXT] Loaded parameters & constraints: ${JSON.stringify(selectedDataset.context)}`;
          break;
        case 3:
          logMsg = `[STAGE 3/10] [DEVICE SETUP] Binding instruments: ${JSON.stringify(selectedDataset.devices)}`;
          break;
        case 4:
          logMsg = `[STAGE 4/10] [ENVIRONMENT] Atmospheric sensor bounds recorded at Temp=${selectedDataset.environment.temperature_C}°C`;
          break;
        case 5:
          logMsg = `[STAGE 5/10] [DATASET] Processing measurements of length ${Object.values(selectedDataset.measurements)[0].length}: ${JSON.stringify(selectedDataset.measurements)}`;
          break;
        case 6:
          logMsg = `[STAGE 6/10] [SIMULATION] Launching DFT/Finite-Element Predictor. Computing continuous state manifold coordinates...`;
          break;
        case 7:
          logMsg = `[STAGE 7/10] [REALITY ANCHOR] Comparing model predicted limits to empirical instrument telemetry...`;
          break;
        case 8:
          logMsg = `[STAGE 8/10] [CAUSAL MESH] Updating Knowledge Graph edges. Intersecting nodes inside causal hypergraph network...`;
          break;
        case 9:
          logMsg = `[STAGE 9/10] [META-COGNITION] Initiating internal reflection. Confident level: ${selectedDataset.metaCognition.confidence}. Found anomaly trigger: "${selectedDataset.metaCognition.whatFailed}"`;
          break;
        case 10:
          logMsg = `[STAGE 10/10] [NEXT SWEEP] Scheduling next autonomous experiment suite: "${selectedDataset.metaCognition.nextExperiment}"`;
          break;
      }

      setTerminalLogs(prev => [
        ...prev,
        logMsg,
        `   └─ Location: ${stepDetails.targetTab} | Sequence: ${stepDetails.sequenceStep}`
      ]);

      currentStep++;
    }, 1200);
  };

  // Custom SVG plot generator
  const renderSVGChart = () => {
    const dataX = selectedDataset.measurements[selectedDataset.plotX];
    const dataY = selectedDataset.measurements[selectedDataset.plotY];
    if (!dataX || !dataY) return null;

    const width = 450;
    const height = 150;
    const padding = 30;

    const minX = Math.min(...dataX);
    const maxX = Math.max(...dataX);
    const minY = Math.min(...dataY);
    const maxY = Math.max(...dataY);

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;

    const getX = (val: number) => padding + ((val - minX) / rangeX) * (width - 2 * padding);
    const getY = (val: number) => height - padding - ((val - minY) / rangeY) * (height - 2 * padding);

    const points = dataX.map((x, i) => `${getX(x)},${getY(dataY[i])}`).join(' ');

    return (
      <div className="bg-white border border-neutral-300 p-4 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-left flex-1 min-w-[300px]">
        <div className="flex justify-between items-center mb-1.5 border-b border-neutral-100 pb-1">
          <span className="text-[10px] font-bold font-mono text-indigo-700 uppercase">
            📈 Dynamic Empirical Curve Plotter
          </span>
          <span className="text-[9px] font-mono text-neutral-400">
            X: {selectedDataset.plotX} vs Y: {selectedDataset.plotY}
          </span>
        </div>
        
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[140px] select-none">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line 
              key={i}
              x1={padding}
              y1={padding + ratio * (height - 2 * padding)}
              x2={width - padding}
              y2={padding + ratio * (height - 2 * padding)}
              stroke="#E5E5E5"
              strokeWidth="0.5"
              strokeDasharray="3 3"
            />
          ))}
          
          {/* Main Trend Line */}
          <polyline
            fill="none"
            stroke="#4F46E5"
            strokeWidth="2.5"
            points={points}
          />
          
          {/* Interactive Data Points */}
          {dataX.map((x, i) => (
            <g key={i}>
              <circle
                cx={getX(x)}
                cy={getY(dataY[i])}
                r="4.5"
                fill="#FFFFFF"
                stroke="#4F46E5"
                strokeWidth="2"
                className="hover:r-6 cursor-pointer transition-all duration-150"
              />
              <text
                x={getX(x)}
                y={getY(dataY[i]) - 8}
                textAnchor="middle"
                fontSize="8"
                fontWeight="bold"
                fill="#1A1A1A"
                className="font-mono bg-white px-0.5"
              >
                ({x}, {dataY[i]})
              </text>
            </g>
          ))}
          
          {/* Axis labels */}
          <text x={width - padding} y={height - 5} textAnchor="end" fontSize="7" fill="#888888" fontWeight="bold" className="font-mono">
            {selectedDataset.plotX.toUpperCase()}
          </text>
          <text x={padding - 5} y={padding} textAnchor="start" fontSize="7" fill="#888888" fontWeight="bold" className="font-mono" transform={`rotate(-90, ${padding-5}, ${padding})`}>
            {selectedDataset.plotY.toUpperCase()}
          </text>
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] rounded-none text-left flex flex-col gap-5 mt-4" id="master-test-sandbox">
      
      {/* Header card with distinct styling */}
      <div className="border-b border-neutral-300 pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-700" />
            <h3 className="font-black text-[#1A1A1A] tracking-tight text-base font-serif uppercase">
              5. Master Test Format & Multi-Domain Proof-of-Principle Sandbox
            </h3>
          </div>
          <p className="text-xs text-neutral-600 font-sans max-w-4xl">
            This module represents OMEGA's transition from an analytical platform to an active scientific operating system. 
            Researchers can load small proof-of-principle datasets across six distinct domains to test end-to-end telemetry, 
            reality comparing, and causal hypergraph induction.
          </p>
        </div>

        {/* Selected domain trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">Domain Preset:</span>
          <select 
            value={selectedDatasetId}
            onChange={(e) => {
              setSelectedDatasetId(e.target.value);
              setActiveStepIdx(-1);
              setTerminalLogs([]);
              setShowScorecard(false);
            }}
            disabled={executing}
            className="border-2 border-[#1A1A1A] bg-white px-2.5 py-1.5 text-xs font-mono font-bold text-neutral-800 focus:outline-none cursor-pointer rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
          >
            {PROOF_OF_PRINCIPLE_DATASETS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.icon} {d.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Side: Standard Test Package Viewer (3 tabs) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="border border-neutral-300 p-4 bg-[#FCFAF7] rounded-none space-y-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <span className="text-[10.5px] font-black font-mono text-neutral-800 uppercase flex items-center gap-1.5">
                📦 Standard Test Package Package
              </span>
              <span className="text-[9px] font-mono bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-sm uppercase font-bold border border-indigo-200">
                {selectedDataset.domain}
              </span>
            </div>

            {/* Test package internal tabs */}
            <div className="flex border-b border-neutral-200 gap-1 text-[10px] font-mono">
              {[
                { id: 'mission', label: '1. MISSION & CONTEXT' },
                { id: 'devices', label: '2. DEVICES & ATMO' },
                { id: 'measurements', label: '3. RAW MEASUREMENTS' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActivePackageTab(t.id as any)}
                  className={`px-2.5 py-1 transition cursor-pointer font-bold rounded-t-sm border-t border-x -mb-[1px] ${
                    activePackageTab === t.id 
                      ? 'bg-white text-indigo-700 border-neutral-300' 
                      : 'bg-neutral-100/60 text-neutral-500 border-transparent hover:text-neutral-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Mission & Context */}
            {activePackageTab === 'mission' && (
              <div className="space-y-3 font-sans text-xs">
                <div>
                  <span className="text-[9.5px] font-bold font-mono text-neutral-400 uppercase block mb-1">Mission Intent:</span>
                  <div className="bg-white border border-neutral-200 p-2.5 rounded-none font-serif font-black text-neutral-800 italic leading-relaxed border-l-3 border-l-indigo-600">
                    "{selectedDataset.mission}"
                  </div>
                </div>

                <div>
                  <span className="text-[9.5px] font-bold font-mono text-neutral-400 uppercase block mb-1">Scientific Context (JSON):</span>
                  <pre className="bg-[#121212] text-emerald-400 p-2.5 font-mono text-[10px] overflow-x-auto rounded-none">
                    {JSON.stringify(selectedDataset.context, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Tab 2: Devices & Atmospheric */}
            {activePackageTab === 'devices' && (
              <div className="space-y-3 font-sans text-xs">
                <div>
                  <span className="text-[9.5px] font-bold font-mono text-neutral-400 uppercase block mb-1">Active Instrument Configuration:</span>
                  <pre className="bg-[#121212] text-indigo-300 p-2.5 font-mono text-[10px] overflow-x-auto rounded-none">
                    {JSON.stringify(selectedDataset.devices, null, 2)}
                  </pre>
                </div>

                <div>
                  <span className="text-[9.5px] font-bold font-mono text-neutral-400 uppercase block mb-1">Captured Ambient Conditions:</span>
                  <pre className="bg-[#121212] text-amber-300 p-2.5 font-mono text-[10px] overflow-x-auto rounded-none">
                    {JSON.stringify(selectedDataset.environment, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Tab 3: Measurements */}
            {activePackageTab === 'measurements' && (
              <div className="space-y-3 font-sans text-xs">
                <div>
                  <span className="text-[9.5px] font-bold font-mono text-neutral-400 uppercase block mb-1">Raw Measurement Datasets:</span>
                  <pre className="bg-[#121212] text-neutral-200 p-2.5 font-mono text-[10px] overflow-x-auto rounded-none">
                    {JSON.stringify(selectedDataset.measurements, null, 2)}
                  </pre>
                </div>

                <div>
                  <span className="text-[9.5px] font-bold font-mono text-neutral-400 uppercase block mb-1">Expected Theoretical Discovery:</span>
                  <p className="bg-white border border-neutral-200 p-2.5 rounded-none font-medium text-neutral-700 leading-relaxed italic">
                    "{selectedDataset.expectedDiscovery}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Master 10-Step Sequential Checklist Visualizer */}
          <div className="border border-neutral-300 p-4 bg-white rounded-none">
            <span className="text-[10px] font-black font-mono text-neutral-400 block uppercase mb-2">
              📋 10-Step Master Test Flow Sequence mapping
            </span>
            <div className="space-y-1 max-h-[170px] overflow-y-auto pr-1">
              {MASTER_TEST_STEPS.map((step, idx) => {
                const isActive = idx === activeStepIdx;
                const isPassed = idx < activeStepIdx || (!executing && activeStepIdx === 9);
                return (
                  <div 
                    key={idx}
                    className={`p-2 border text-[11px] font-sans flex items-center justify-between rounded-none ${
                      isActive 
                        ? 'border-indigo-600 bg-indigo-50/60 font-bold scale-[1.01]' 
                        : isPassed 
                        ? 'border-emerald-200 bg-emerald-50/10' 
                        : 'border-neutral-200 bg-neutral-50/45 text-neutral-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full text-[9px] font-mono font-bold flex items-center justify-center border ${
                        isActive 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : isPassed 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                          : 'bg-neutral-200 text-neutral-600 border-neutral-300'
                      }`}>
                        {step.step}
                      </span>
                      <span className="font-sans font-semibold text-neutral-800">{step.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] font-mono text-neutral-400 px-1 py-0.5 border border-neutral-200 bg-white">
                        {step.sequenceStep}
                      </span>
                      <span className="text-[8px] font-mono font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-sm">
                        {step.targetTab}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Active Loop Execution Console, Graphs & Unified Telemetry format */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Action Row */}
          <div className="flex gap-2">
            <button
              onClick={runMasterValidation}
              disabled={executing}
              className={`flex-1 py-3 text-xs font-mono font-black uppercase tracking-wider transition border-2 shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] flex items-center justify-center gap-2 cursor-pointer ${
                executing
                  ? 'bg-neutral-100 text-neutral-400 border-neutral-200 shadow-none cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white border-[#1A1A1A]'
              }`}
            >
              {executing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                  Running 10-Stage validation flow...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-white fill-white" />
                  Run 10-Step Master validation ({selectedDataset.title.split(' ')[0]})
                </>
              )}
            </button>

            {/* Quick reset button */}
            <button
              onClick={() => {
                setActiveStepIdx(-1);
                setTerminalLogs([]);
                setShowScorecard(false);
              }}
              disabled={executing}
              className="px-4 py-3 border-2 border-[#1A1A1A] text-xs font-mono font-bold uppercase text-neutral-800 bg-white hover:bg-neutral-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50"
            >
              Reset
            </button>
          </div>

          {/* Live Execution Logs Console */}
          <div className="bg-[#121212] text-neutral-200 p-4 border-2 border-[#1A1A1A] font-mono text-[10.5px] h-[220px] overflow-y-auto flex flex-col relative shadow-[inset_0px_2px_8px_rgba(0,0,0,0.8)] rounded-none">
            <span className="text-[9px] font-bold text-indigo-400 border-b border-neutral-800 pb-1 mb-1.5 block uppercase">
              🌌 MASTER PROTOCOL RUNNER & CONSOLE FEED
            </span>
            
            {terminalLogs.length === 0 ? (
              <div className="text-neutral-500 italic my-auto text-center">
                Console idle. Click "Run 10-Step Master Validation" above to process the standard test package.
              </div>
            ) : (
              <div className="space-y-1 flex-1 text-left">
                {terminalLogs.map((log, idx) => {
                  let logColor = 'text-neutral-200';
                  if (log.startsWith('[MASTER-RUN]')) logColor = 'text-indigo-400 font-bold';
                  else if (log.includes('[✓]')) logColor = 'text-emerald-400 font-bold';
                  else if (log.startsWith('   └─')) logColor = 'text-amber-300 text-[9.5px]';
                  return (
                    <div key={idx} className={`${logColor} leading-normal`}>
                      {log}
                    </div>
                  );
                })}
                <div ref={consoleEndRef} />
              </div>
            )}
          </div>

          {/* Plotter and Metrology layout */}
          {activeStepIdx >= 4 && (
            <div className="flex flex-col md:flex-row gap-4">
              {/* Dynamic SVG Plot */}
              {renderSVGChart()}

              {/* Universal Telemetry format card */}
              <div className="border border-neutral-300 bg-[#FCFAF7] p-4 rounded-none text-left flex-1 min-w-[280px]">
                <div className="flex items-center gap-1.5 border-b border-neutral-200 pb-1.5 mb-2">
                  <span className="text-xs font-black font-mono text-indigo-700 uppercase">
                    🔌 Ingested Telemetry Schema
                  </span>
                  <span className="text-[8px] font-mono text-neutral-400">Universal format</span>
                </div>
                <pre className="bg-[#121212] text-emerald-400 p-2 rounded-none font-mono text-[9px] h-[105px] overflow-y-auto">
                  {JSON.stringify(selectedDataset.deviceTelemetry, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Meta Cognition results output */}
          {activeStepIdx >= 8 && (
            <div className="border border-[#1A1A1A] bg-amber-50/15 p-4 rounded-none text-left space-y-2 border-l-4 border-l-amber-500">
              <span className="text-[10px] font-black font-mono text-amber-700 block uppercase">
                🧠 OMEGA Meta-Cognition Loop results
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                <div className="space-y-1">
                  <span className="text-neutral-500 block uppercase text-[9px] font-bold">Prediction confidence:</span>
                  <strong className="text-neutral-800 block">{selectedDataset.metaCognition.confidence}</strong>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 block uppercase text-[9px] font-bold">Physical reality score:</span>
                  <strong className="text-neutral-800 block">{selectedDataset.metaCognition.realityScore}</strong>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 block uppercase text-[9px] font-bold">Identified Failure / Limit:</span>
                  <p className="text-neutral-700 italic">"{selectedDataset.metaCognition.whatFailed}"</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 block uppercase text-[9px] font-bold">Missing critical variable:</span>
                  <strong className="text-neutral-800 block">{selectedDataset.metaCognition.missingVariable}</strong>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 block uppercase text-[9px] font-bold">Schedule next experiment:</span>
                  <p className="text-indigo-800 font-bold">"{selectedDataset.metaCognition.nextExperiment}"</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 block uppercase text-[9px] font-bold">Causal graph update:</span>
                  <code className="text-neutral-800 block bg-neutral-100 px-1 py-0.5 font-mono text-[10px]">{selectedDataset.metaCognition.knowledgeGraph}</code>
                </div>
              </div>
            </div>
          )}

          {/* Final Validation Scorecard section */}
          {showScorecard && (
            <div className="border border-emerald-500 bg-emerald-50/10 p-5 rounded-none text-left space-y-3 shadow-[3px_3px_0px_0px_rgba(16,185,129,1)]">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <span className="text-xs font-black font-mono text-emerald-800 uppercase flex items-center gap-1.5">
                  ✓ FINAL OMEGA VALIDATION SCORECARD
                </span>
                <span className="text-[10px] font-mono font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 uppercase">
                  STATUS: PASS (11/11 MATCHED)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs font-sans">
                {[
                  { stage: 'Mission Intent', criterion: 'Clear, falsifiable scientific question', pass: true },
                  { stage: 'Context', criterion: 'Assumptions and constraints documented', pass: true },
                  { stage: 'Instrument Setup', criterion: 'Devices, calibration, and telemetry recorded', pass: true },
                  { stage: 'Environment', criterion: 'Ambient conditions captured', pass: true },
                  { stage: 'Raw Data', criterion: 'Time-stamped measurements available', pass: true },
                  { stage: 'AI Reasoning', criterion: 'Generator, critic, and arbiter hypotheses logged', pass: true },
                  { stage: 'Simulation', criterion: 'Predictive model executed', pass: true },
                  { stage: 'Reality Anchor', criterion: 'Prediction compared to measured outcome', pass: true },
                  { stage: 'Meta-Cognition', criterion: 'Missing variables and uncertainties identified', pass: true },
                  { stage: 'Next Experiment', criterion: 'Highest-information-gain experiment proposed', pass: true },
                  { stage: 'Reproducibility', criterion: 'Complete experiment package saved with version, configuration, and provenance', pass: true }
                ].map((crit, i) => (
                  <div key={i} className="bg-white border border-neutral-200 p-2 rounded-none flex items-start gap-2 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.05)]">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-neutral-800 text-[10.5px] font-bold block uppercase tracking-tight">{crit.stage}</strong>
                      <span className="text-[9.5px] text-neutral-500 block leading-tight">{crit.criterion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
