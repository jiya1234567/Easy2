import React, { useState, useEffect, useMemo } from 'react';
import { 
  Beaker, Layers, Activity, RefreshCw, Sliders, Cpu, 
  CheckCircle, AlertTriangle, Compass, Database, Network, 
  Eye, Thermometer, Binary, Radio, Zap, ArrowRight, CornerDownRight, Info
} from 'lucide-react';
import MasterTestSandbox from './MasterTestSandbox';

interface HardwareIntegrationPanelProps {
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
}

// 6-Layer Architecture definitions
interface ArchitectureLayer {
  id: string;
  name: string;
  role: string;
  components: string[];
  telemetry: {
    status: 'ONLINE' | 'ACTIVE' | 'STANDBY';
    frequency: string;
    ping: string;
    throughput: string;
  };
  details: string;
}

const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: 'harness',
    name: 'Scientific Harness',
    role: 'Scientific reasoning and orchestration layer',
    components: ['Hypothesis Generator', 'Causal Reasoning Engine', 'Observation Matrix', 'Arbiter Controller'],
    telemetry: { status: 'ACTIVE', frequency: '2.4 GHz', ping: '4ms', throughput: '1.2 GB/s' },
    details: 'The brain of the platform. Translates abstract scientific hypotheses into executable multi-parametric experiment graphs, evaluates validation scores, and triggers cognitive correction sweeps.'
  },
  {
    id: 'ai_models',
    name: 'AI Models',
    role: 'Multi-modal core models & domain-specific neural networks',
    components: ['Gemini 2.5 Flash', 'Phi-3 Mini', 'Mistral Large', 'LLaVA Visual Encoder', 'Domain Custom Fine-tunes'],
    telemetry: { status: 'ONLINE', frequency: 'N/A', ping: '85ms', throughput: '450 tokens/s' },
    details: 'Houses the large language and visual models. Facilitates real-time reasoning, document-level semantic knowledge extraction, and deep visual representation analysis of raw experimental imagery.'
  },
  {
    id: 'simulation',
    name: 'Simulation Engines',
    role: 'Multi-physics high-fidelity simulators',
    components: ['DFT Predictor', 'Molecular Dynamics (LAMMPS)', 'Finite Element Analysis (FEA)', 'Climate Boundary Simulators'],
    telemetry: { status: 'STANDBY', frequency: '12.8 TFLOPS', ping: '12ms', throughput: '120 frames/s' },
    details: 'Runs high-fidelity physical, chemical, biological, and economic models to predict system responses before executing physical robotic actions.'
  },
  {
    id: 'knowledge',
    name: 'Knowledge Layer',
    role: 'Structured geometry and global state representation',
    components: ['Causal Hypergraph Mesh', 'Thermodynamic Manifold', 'Wolfram Ruliad Pathfinders', 'Reality Anchor Database'],
    telemetry: { status: 'ONLINE', frequency: '100 MHz', ping: '2ms', throughput: '2.1 M nodes/s' },
    details: 'Coordinates the theoretical topological boundaries. Maps empirical observations onto the manifold coordinates, updates causal link scores, and verifies alignment against the Reality Anchor.'
  },
  {
    id: 'laboratory',
    name: 'Laboratory Layer',
    role: 'Physical instruments, spectrometers, and automated diagnostics',
    components: ['Diffractometers (XRD)', 'Spectrometers (Raman/FTIR)', 'Electron Microscopes (SEM/TEM)', 'Environmental Sensors'],
    telemetry: { status: 'ACTIVE', frequency: '500 kHz', ping: '35ms', throughput: '45 MB/s' },
    details: 'The connection portal to physical hardware instruments. Interfaces directly with cameras, robotic controllers, temperature regulators, and chemical measurement devices.'
  },
  {
    id: 'autonomous',
    name: 'Autonomous Discovery',
    role: 'Closed-loop scheduler and meta-cognition planner',
    components: ['Active Learning Scheduler', 'Meta-Cognitive Critique Loop', 'Reproducibility Arbiter', 'Parameter Sweep Sweep'],
    telemetry: { status: 'ACTIVE', frequency: '1.2 GHz', ping: '6ms', throughput: '98.5% uptime' },
    details: 'Performs autonomous task prioritization, organizes batch experiment sweeps, handles failure-recovery states, and optimizes the rate of global information gain.'
  }
];

// Physical Hardware Devices
interface Device {
  id: string;
  name: string;
  purpose: string;
  category: 'microscopy' | 'spectroscopy' | 'thermal_mechanical' | 'biotech' | 'robotics';
  company: string;
  status: 'ONLINE' | 'CALIBRATING' | 'OFFLINE';
  paramName: string;
  paramValue: string;
}

const HARDWARE_DEVICES: Device[] = [
  { id: 'dev_micro', name: 'Optical Microscope', purpose: 'Basic microscale observation & surface tracking', category: 'microscopy', company: 'Zeiss / Olympus', status: 'ONLINE', paramName: 'Magnification', paramValue: '100x / 400x' },
  { id: 'dev_sem', name: 'Scanning Electron Microscope (SEM)', purpose: 'Sub-micron high-resolution surface topology mapping', category: 'microscopy', company: 'Thermo Fisher / Hitachi', status: 'ONLINE', paramName: 'Accelerating Voltage', paramValue: '15.0 kV' },
  { id: 'dev_tem', name: 'Transmission Electron Microscope (TEM)', purpose: 'Atomic lattice structure visualizer', category: 'microscopy', company: 'JEOL / Thermo Fisher', status: 'OFFLINE', paramName: 'Vacuum Level', paramValue: '10^-7 Pa' },
  { id: 'dev_xrd', name: 'X-Ray Diffractometer (XRD)', purpose: 'Crystal lattice phase identification & orientation', category: 'spectroscopy', company: 'Bruker / Rigaku', status: 'ONLINE', paramName: 'Theta-2Theta Step', paramValue: '0.02 deg' },
  { id: 'dev_raman', name: 'Raman Spectrometer', purpose: 'In-situ chemical fingerprinting & molecular bond vibrations', category: 'spectroscopy', company: 'Renishaw / Horiba', status: 'ONLINE', paramName: 'Laser Wavelength', paramValue: '532 nm' },
  { id: 'dev_ftir', name: 'FTIR Spectrometer', purpose: 'Identification of functional chemistry groups & organic chains', category: 'spectroscopy', company: 'Bruker / Agilent', status: 'ONLINE', paramName: 'Spectral Resolution', paramValue: '4.0 cm^-1' },
  { id: 'dev_dsc', name: 'Differential Scanning Calorimeter (DSC)', purpose: 'Thermal glass transitions, crystallization, and melting peaks', category: 'thermal_mechanical', company: 'TA Instruments', status: 'ONLINE', paramName: 'Heating Rate', paramValue: '10.0 °C/min' },
  { id: 'dev_tga', name: 'Thermogravimetric Analyzer (TGA)', purpose: 'Mass loss vs temperature, thermal stability threshold', category: 'thermal_mechanical', company: 'Netzsch', status: 'ONLINE', paramName: 'Purge Flow (N2)', paramValue: '20 mL/min' },
  { id: 'dev_utm', name: 'Universal Testing Machine', purpose: 'Tensile, compression, and elongation strain bounds', category: 'thermal_mechanical', company: 'Instron', status: 'STANDBY' as any, paramName: 'Force Capacity', paramValue: '50.0 kN' },
  { id: 'dev_cyt', name: 'Flow Cytometer', purpose: 'Cell population count & biomarker sorting analysis', category: 'biotech', company: 'BD Biosciences', status: 'ONLINE', paramName: 'Lasers Configured', paramValue: 'Blue/Red/Violet' },
  { id: 'dev_seq', name: 'DNA/RNA Sequencer', purpose: 'High-throughput genomic sequencing & codon alignment', category: 'biotech', company: 'Illumina / Oxford Nanopore', status: 'ONLINE', paramName: 'Sequence Accuracy', paramValue: '99.98% Q30' },
  { id: 'dev_ms', name: 'Mass Spectrometer', purpose: 'High-fidelity protein Identification & chemical composition', category: 'biotech', company: 'Thermo Fisher', status: 'ONLINE', paramName: 'Mass Resolution', paramValue: '240,000 FWHM' },
  { id: 'dev_rob', name: 'Multi-Axis Robotic Arm', purpose: 'Precision physical sample transfer, placement, & alignment', category: 'robotics', company: 'Universal Robots / ABB', status: 'ONLINE', paramName: 'Repeatability', paramValue: '±0.03 mm' },
  { id: 'dev_liq', name: 'Automated Liquid Handler', purpose: 'High-speed automated microplate pipetting sweeps', category: 'robotics', company: 'Opentrons / Tecan', status: 'ONLINE', paramName: 'Volume Range', paramValue: '1.0 - 1000 µL' }
];

// Closed-Loop Domain Scenarios
interface DomainLoopStep {
  label: string;
  role: string;
}

interface DomainScenario {
  id: string;
  title: string;
  description: string;
  steps: DomainLoopStep[];
  cadSimMeasure: {
    cadSpec: string;
    simValue: string;
    physicalMeasured: string;
    deviation: string;
  };
}

const DOMAIN_SCENARIOS: DomainScenario[] = [
  {
    id: 'materials',
    title: 'Materials Discovery',
    description: 'Autonomous high-temperature alloy development targeting next-generation turbine blades.',
    steps: [
      { label: 'Set Core Goal', role: 'Establish target yield strength > 900 MPa at 1200°C' },
      { label: 'Generate Candidate Alloys', role: 'Generative graph neural network proposes 24 crystal candidates' },
      { label: 'DFT Prediction', role: 'Model electronic band gaps and lattice binding energies' },
      { label: 'Molecular Dynamics', role: 'Simulate dislocation propagation under extreme mechanical shear' },
      { label: 'Crystal Stability Check', role: 'Verify thermodynamic stability on the convex hull' },
      { label: 'Manufacturing Simulation', role: 'Predict powder-bed laser sintering thermal stress boundaries' },
      { label: 'Robot Sintering Experiment', role: 'Send command to robotic arm & laser cutter to forge physical coin' },
      { label: 'Mechanical Measurement', role: 'Execute tensile press and microindentation sweeps' },
      { label: 'Reality Anchor Compare', role: 'Inject actual data into causal hypergraph and update DFT weights' },
      { label: 'Meta-Cognitive Critique', role: 'Recommend composition adjustment (+0.4% Chromium) for next loop' }
    ],
    cadSimMeasure: {
      cadSpec: 'Nominal Cr-Co-Ni-Ti Matrix (Lattice parameter: 3.582 Å)',
      simValue: 'Predicted yield limit: 945 MPa at 1200°C',
      physicalMeasured: 'Actual yield limit: 918 MPa at 1200°C',
      deviation: '-2.85% (Within active learning tolerance)'
    }
  },
  {
    id: 'semiconductor',
    title: 'Semiconductor Research',
    description: 'Nanoscale gate oxide crystallization & hotspot leakage current suppression.',
    steps: [
      { label: 'Target Objective', role: 'Minimize leakage to < 10^-8 A/cm² at 3nm thickness' },
      { label: 'ALD Deposition Sim', role: 'Predict thermal gas dynamics and precursor diffusion layers' },
      { label: 'Thermal Anneal Sweep', role: 'Simulate ultra-fast laser anneal heat spikes on silicon' },
      { label: 'Silicon Wafer Probe', role: 'Move automated probe station pins to measure gate leakage characteristics' },
      { label: 'AFM Nano-imaging', role: 'Scan localized surface roughness down to 0.1nm precision' },
      { label: 'Causal Correlation', role: 'Relate Anneal Temp (K) vs Atomic Oxygen vacancy concentration' },
      { label: 'Reality Calibration', role: 'Update physical diffusion coefficients in manufacturing files' }
    ],
    cadSimMeasure: {
      cadSpec: 'Hafnium Silicate Target Gate Oxide (Thickness: 2.8 nm)',
      simValue: 'Simulated thermal leakage: 1.15 x 10^-8 A/cm²',
      physicalMeasured: 'Probe station measured leakage: 1.34 x 10^-8 A/cm²',
      deviation: '+16.5% (Tuned ALD parameters automatically updated)'
    }
  },
  {
    id: 'space',
    title: 'Space Propulsion Systems',
    description: 'Combustion nozzle thermal erosion modeling & cryogenic telemetry tuning.',
    steps: [
      { label: 'Propulsion Goal', role: 'Suppress high-frequency thermal vibration anomalies in nozzle' },
      { label: 'Combustion Simulation', role: 'Model localized liquid-oxygen gas combustion heat fluxes' },
      { label: 'Nozzle Stress Model', role: 'Predict mechanical expansion under structural pressure' },
      { label: 'Telemetry Acquisition', role: 'Stream real-time high-speed thermocouple data from test stand' },
      { label: 'Erosion Scanning', role: 'Laser range scan interior surface erosion profiles' },
      { label: 'Reality Correction', role: 'Calibrate fluid-dynamic boundary layer model parameters' }
    ],
    cadSimMeasure: {
      cadSpec: '3D Printed Inconel 718 Regenerative Cooling Nozzle',
      simValue: 'Predicted nozzle throat temp: 1045 K',
      physicalMeasured: 'Sensing thermocouple measured: 1068 K',
      deviation: '+2.2% (Perfect model convergence achieved)'
    }
  },
  {
    id: 'biology',
    title: 'Biological Pathways & Immunotherapy',
    description: 'Targeted melanoma checkpoint inhibition and single-cell expression tracking.',
    steps: [
      { label: 'Therapeutic Target', role: 'Reverse MHC-I down-regulation to boost active T-cell recognition' },
      { label: 'In-Silico Docking', role: 'Model binding affinity of check-point antibodies across 40 variants' },
      { label: 'Robot Liquid Handler', role: 'Command Opentrons to dose live cell populations with candidate drugs' },
      { label: 'Microscope Imaging', role: 'Capture high-speed cell morphology and green fluorescence protein tags' },
      { label: 'Flow Cytometry', role: 'Count percentage of activated cell populations' },
      { label: 'Single-Cell RNA Seq', role: 'Verify exact gene transcription alterations' },
      { label: 'Update Causal Loop', role: 'Map transcription factors inside the causal hypergraph' }
    ],
    cadSimMeasure: {
      cadSpec: 'Recombinant Anti-PD-1 Antibody (Binding domain matching score)',
      simValue: 'Predicted tumor-cell suppression: 88.5%',
      physicalMeasured: 'Flow cytometry assay verified cell death: 86.2%',
      deviation: '-2.6% (Pathway accuracy authenticated)'
    }
  },
  {
    id: 'manufacturing',
    title: 'Adaptive CAD-to-Part Loop',
    description: 'Automated geometric error correction using real-time metrology scans.',
    steps: [
      { label: 'Load CAD File', role: 'Input precise 3D mesh coordinates and dimensional limits' },
      { label: 'Simulation Sweep', role: 'Model tool-path mechanical tool deflection and thermal contraction' },
      { label: 'CNC / 3D Print Part', role: 'Command robotic mills or metal printers to manufacture part' },
      { label: 'Laser Metrology Scan', role: 'Acquire high-density 3D optical point cloud of physical object' },
      { label: 'Mesh Alignment', role: 'Run Iterative Closest Point (ICP) algorithm to align Scan against CAD' },
      { label: 'Calculate Deviations', role: 'Detect microscale warping, shrinkage, and dimensional errors' },
      { label: 'Iterative Compensation', role: 'Automatically alter source tool-paths to offset identified shrinkage' }
    ],
    cadSimMeasure: {
      cadSpec: 'Structural Rocket Nozzle Ring (Outer diameter: 240.00 mm)',
      simValue: 'Predicted post-cooling contraction: -0.42 mm',
      physicalMeasured: 'Metrology scanning actual dimension: 239.38 mm',
      deviation: '-0.26% (Compensatory toolpath offset generated)'
    }
  }
];

export default function HardwareIntegrationPanel({ onLogEvent }: HardwareIntegrationPanelProps) {
  const [selectedLayerId, setSelectedLayerId] = useState<string>('laboratory');
  const [deviceFilter, setDeviceFilter] = useState<string>('all');
  const [calibratingDeviceId, setCalibratingDeviceId] = useState<string | null>(null);
  const [calibrationProgress, setCalibrationProgress] = useState<number>(0);
  const [calibrationLogs, setCalibrationLogs] = useState<string[]>([]);
  
  const [activeScenarioId, setActiveScenarioId] = useState<string>('materials');
  const [loopRunning, setLoopRunning] = useState<boolean>(false);
  const [loopStepIndex, setLoopStepIndex] = useState<number>(-1);
  const [loopLogs, setLoopLogs] = useState<string[]>([]);

  // Environmental Sensor States
  const [envStates, setEnvStates] = useState({
    temp: 22.4,
    humidity: 42.1,
    pressure: 101.32,
    wind: 1.5,
    co2: 412,
    airQuality: 15,
    radiation: 0.11,
    magneticField: 48.6,
    vibration: 0.015
  });

  // Derived filtered devices
  const filteredDevices = useMemo(() => {
    if (deviceFilter === 'all') return HARDWARE_DEVICES;
    return HARDWARE_DEVICES.filter(d => d.category === deviceFilter);
  }, [deviceFilter]);

  // Derived active scenario
  const activeScenario = useMemo(() => {
    return DOMAIN_SCENARIOS.find(s => s.id === activeScenarioId) || DOMAIN_SCENARIOS[0];
  }, [activeScenarioId]);

  // Handle sensor slider changes
  const updateSensor = (key: keyof typeof envStates, val: number) => {
    setEnvStates(prev => {
      const updated = { ...prev, [key]: val };
      onLogEvent(`[ENVIRONMENT] Sensor update: ${String(key).toUpperCase()} modified to ${val}. Recalibrating reality envelope reference bounds.`, 'physics');
      return updated;
    });
  };

  // Run Device Calibration simulator
  const runCalibration = (device: Device) => {
    if (calibratingDeviceId) return;
    setCalibratingDeviceId(device.id);
    setCalibrationProgress(0);
    setCalibrationLogs([
      `[CALIBRATOR] Initializing connection protocol to ${device.name} (${device.company})`,
      `[CALIBRATOR] Querying controller status... Returned state: ${device.status}`
    ]);

    onLogEvent(`[LABORATORY] Initiated physical calibration sweep on ${device.name}`, 'interaction');

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setCalibrationProgress(progress);

      if (progress === 30) {
        setCalibrationLogs(prev => [...prev, 
          `[${device.id.toUpperCase()}] Performing internal mechanical self-test & optical alignment check`,
          `[${device.id.toUpperCase()}] Calibrating current sensor variable [${device.paramName}] (Current Value: ${device.paramValue})`
        ]);
      } else if (progress === 60) {
        setCalibrationLogs(prev => [...prev, 
          `[${device.id.toUpperCase()}] Injecting reference standard standard-sample (Traceability Standard #9214-A)`,
          `[${device.id.toUpperCase()}] Reading spectrometer sensor response curves... Error quotient within 0.0012% bounds`
        ]);
      } else if (progress === 90) {
        setCalibrationLogs(prev => [...prev, 
          `[CALIBRATOR] Standard-sample match verified. Fitting local coordinates onto global thermodynamic manifold...`,
          `[CALIBRATOR] Reality Anchor mapping updated successfully.`
        ]);
      } else if (progress >= 100) {
        clearInterval(interval);
        setCalibratingDeviceId(null);
        onLogEvent(`[LABORATORY] Calibration complete for ${device.name}. All parameters verified.`, 'info');
      }
    }, 400);
  };

  // Run Closed-Loop Step-by-Step Scenario Simulation
  const executeClosedLoop = () => {
    if (loopRunning) return;
    setLoopRunning(true);
    setLoopStepIndex(0);
    setLoopLogs([
      `[CLOSED-LOOP] Beginning closed-loop execution for scenario: "${activeScenario.title}"`,
      `[ENVIRONMENT] Environmental bias bounds: Temp=${envStates.temp}°C, Humidity=${envStates.humidity}%, Vibration=${envStates.vibration}g`,
      `[STAGE 1/${activeScenario.steps.length}] ${activeScenario.steps[0].label}: ${activeScenario.steps[0].role}`
    ]);
    
    onLogEvent(`[CLOSED-LOOP] Executing autonomous physical-simulation sweep: ${activeScenario.title}`, 'info');

    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx++;
      if (currentIdx < activeScenario.steps.length) {
        setLoopStepIndex(currentIdx);
        const step = activeScenario.steps[currentIdx];
        
        // Add specific logical log descriptions depending on the step index
        let contextDetail = '';
        if (step.label.includes('Sim') || step.label.includes('Prediction')) {
          contextDetail = ` (Evaluating theoretical manifold tensor at T=${envStates.temp}°C)`;
        } else if (step.label.includes('Robot') || step.label.includes('Experiment')) {
          contextDetail = ` (Robotic controller received coordinate matrices. Executing precise toolpaths)`;
        } else if (step.label.includes('Measure')) {
          contextDetail = ` (Streaming raw ADC values from physical transducers: Vibration=${envStates.vibration}g)`;
        }

        setLoopLogs(prev => [...prev, 
          `[STAGE ${currentIdx + 1}/${activeScenario.steps.length}] ${step.label}: ${step.role}${contextDetail}`
        ]);
        
        onLogEvent(`[CLOSED-LOOP] Advanced to step: ${step.label}`, 'physics');
      } else {
        clearInterval(interval);
        setLoopRunning(false);
        setLoopLogs(prev => [...prev, 
          `[CLOSED-LOOP] Autonomous cycle completed! Reality reference database successfully synchronized.`,
          `[REALITY ANCHOR COMPARISON]`,
          `   - CAD Specification: ${activeScenario.cadSimMeasure.cadSpec}`,
          `   - High-Fidelity Simulation: ${activeScenario.cadSimMeasure.simValue}`,
          `   - Measured Physical Reality: ${activeScenario.cadSimMeasure.physicalMeasured}`,
          `   - Observed Discrepancy: ${activeScenario.cadSimMeasure.deviation}`
        ]);
        onLogEvent(`[CLOSED-LOOP] Finished scenario "${activeScenario.title}" with deviation ${activeScenario.cadSimMeasure.deviation}`, 'interaction');
      }
    }, 1500);
  };

  const selectedLayer = ARCHITECTURE_LAYERS.find(l => l.id === selectedLayerId) || ARCHITECTURE_LAYERS[4];

  return (
    <div className="space-y-6">
      
      {/* 6-Layer Architecture Explorer */}
      <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] text-left rounded-none">
        <div className="border-b border-[#1A1A1A] pb-2.5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 animate-pulse" />
            <h4 className="font-bold text-[#1A1A1A] tracking-tight text-sm font-serif uppercase">
              1. Modular Six-Layer Scientific Operating System
            </h4>
          </div>
          <span className="text-[9px] font-mono font-bold bg-[#1A1A1A] text-white px-2 py-0.5 uppercase">
            Active Core Topology
          </span>
        </div>

        <p className="text-xs text-neutral-600 font-sans leading-relaxed mb-4">
          OMEGA automatically segments its cognitive and physical roles across six specialized layers. This keeps the research methodology identical whether you are synthesising cancer inhibitors or testing aerospace cryogenic valves.
        </p>

        {/* 6 Blocks Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
          {ARCHITECTURE_LAYERS.map((layer, idx) => {
            const isActive = selectedLayerId === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setSelectedLayerId(layer.id)}
                className={`p-3 border-2 text-left transition rounded-none cursor-pointer flex flex-col justify-between h-28 relative ${
                  isActive
                    ? 'border-indigo-600 bg-indigo-50/45 shadow-[2px_2px_0px_0px_rgba(79,70,229,1)]'
                    : 'border-neutral-200 bg-neutral-50 hover:border-neutral-500'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 block">
                    LAYER 0{idx + 1}
                  </span>
                  <span className="text-[11px] font-serif font-black uppercase text-neutral-800 leading-tight block">
                    {layer.name}
                  </span>
                </div>

                <div className="flex items-center justify-between w-full mt-2">
                  <span className={`w-2 h-2 rounded-full ${
                    layer.telemetry.status === 'ACTIVE' 
                      ? 'bg-emerald-500 animate-pulse' 
                      : layer.telemetry.status === 'ONLINE' 
                      ? 'bg-indigo-500' 
                      : 'bg-amber-400'
                  }`} />
                  <span className="text-[8px] font-mono text-neutral-500 font-bold uppercase">
                    {layer.telemetry.status}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Layer Details Drawer Panel */}
        <div className="border border-neutral-300 bg-[#FCFAF7] p-4 rounded-none flex flex-col md:flex-row gap-4 justify-between">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 uppercase rounded-sm border border-indigo-200">
                Selected: {selectedLayer.name}
              </span>
              <span className="text-[11px] text-neutral-500 font-sans italic">{selectedLayer.role}</span>
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed font-sans">
              {selectedLayer.details}
            </p>
            <div className="pt-1.5">
              <span className="text-[10px] font-bold font-mono text-neutral-500 block mb-1 uppercase">Core Layer Component Modules:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedLayer.components.map((c, i) => (
                  <span key={i} className="text-[9.5px] font-mono text-neutral-800 bg-white border border-neutral-200 px-2 py-0.5 rounded-sm">
                    ⚙️ {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-neutral-300 pt-3 md:pt-0 md:pl-4 min-w-[200px] flex flex-col justify-center space-y-2 font-mono text-[11px]">
            <span className="text-[10px] font-bold text-neutral-500 uppercase block">Layer Telemetry Logs</span>
            <div className="flex justify-between border-b border-neutral-200/65 pb-1">
              <span className="text-neutral-500">PING LATENCY:</span>
              <span className="font-bold text-neutral-900">{selectedLayer.telemetry.ping}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-200/65 pb-1">
              <span className="text-neutral-500">BANDWIDTH:</span>
              <span className="font-bold text-neutral-900">{selectedLayer.telemetry.throughput}</span>
            </div>
            {selectedLayer.telemetry.frequency !== 'N/A' && (
              <div className="flex justify-between">
                <span className="text-neutral-500">CYCLE CLOCK:</span>
                <span className="font-bold text-neutral-900">{selectedLayer.telemetry.frequency}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lab Devices Grid & Calibration Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-left">
        
        {/* Left column: Hardware Devices Filter and list */}
        <div className="md:col-span-8 bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] rounded-none flex flex-col gap-4">
          <div className="border-b border-[#1A1A1A] pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
              <h4 className="font-bold text-[#1A1A1A] tracking-tight text-sm font-serif uppercase">
                2. Lab Instruments & Hardware Registries
              </h4>
            </div>
            
            {/* Filter buttons */}
            <div className="flex gap-1 overflow-x-auto pb-1 max-w-full">
              {[
                { id: 'all', label: 'ALL DEVICES' },
                { id: 'microscopy', label: '🔬 MICROSCOPY' },
                { id: 'spectroscopy', label: '📊 SPECTRA' },
                { id: 'thermal_mechanical', label: '🔥 THERMAL/MECH' },
                { id: 'biotech', label: '🧬 GENOME/CELL' },
                { id: 'robotics', label: '🦾 ROBOTICS' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setDeviceFilter(btn.id)}
                  className={`px-2.5 py-1 text-[9px] font-mono font-bold border transition cursor-pointer shrink-0 rounded-none ${
                    deviceFilter === btn.id
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-neutral-600 font-sans leading-relaxed">
            Registered telemetry and API hooks for active research hardware. Select any instrument to calibrate the goniometers, vacuum pumps, lasers, or robotic limits in real-time.
          </p>

          {/* Devices Grid List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
            {filteredDevices.map((device) => {
              const isCalibrating = calibratingDeviceId === device.id;
              return (
                <div 
                  key={device.id} 
                  className="border border-neutral-200 bg-white p-3 flex flex-col justify-between gap-3 hover:border-neutral-500 transition shadow-sm rounded-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
                        {device.category}
                      </span>
                      <span className={`px-1.5 py-0.5 text-[8px] font-mono font-extrabold uppercase rounded-sm border ${
                        device.status === 'ONLINE'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : device.status === 'CALIBRATING'
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-300 animate-pulse'
                          : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                      }`}>
                        {device.status}
                      </span>
                    </div>

                    <h5 className="font-serif font-black text-xs text-neutral-900 uppercase">
                      {device.name}
                    </h5>

                    <p className="text-[10px] text-neutral-500 font-sans leading-tight">
                      {device.purpose}
                    </p>

                    <div className="pt-1 text-[9.5px] font-mono text-neutral-600 flex justify-between border-t border-dashed border-neutral-100 mt-1">
                      <span>MFR: <strong className="text-neutral-800">{device.company}</strong></span>
                      <span>{device.paramName}: <strong className="text-indigo-700">{device.paramValue}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => runCalibration(device)}
                    disabled={!!calibratingDeviceId || device.status === 'OFFLINE'}
                    className={`w-full text-center py-1.5 text-[9px] font-mono font-bold uppercase transition cursor-pointer border-2 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ${
                      device.status === 'OFFLINE'
                        ? 'bg-neutral-100 text-neutral-400 border-neutral-200 shadow-none cursor-not-allowed'
                        : isCalibrating
                        ? 'bg-indigo-100 text-indigo-800 border-indigo-400 animate-pulse'
                        : 'bg-[#FCFAF7] text-neutral-800 border-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    {isCalibrating ? `Calibrating (${calibrationProgress}%)` : 'Run Diagnostics & Calibrate'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Environmental Sensors & Calibration Logs */}
        <div className="md:col-span-4 flex flex-col gap-5">
          
          {/* Environmental Sensors */}
          <div className="bg-[#FCFAF7] border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] rounded-none text-left flex flex-col gap-4 flex-1">
            <div className="border-b border-[#1A1A1A] pb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-600 animate-spin-slow" />
                <h5 className="font-bold text-[#1A1A1A] tracking-tight text-xs font-serif uppercase">
                  3. Environment Sensoring Array
                </h5>
              </div>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            </div>

            <p className="text-[11px] text-neutral-600 leading-normal font-sans">
              Real-time feed from environmental sensors. Alter these sliders to simulate changing ambient boundaries during high-fidelity loop simulations.
            </p>

            <div className="space-y-3 font-mono text-[10px] text-neutral-700">
              {/* Temp */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>🌡️ AMBIENT TEMP:</span>
                  <span className="text-neutral-900">{envStates.temp.toFixed(1)} °C</span>
                </div>
                <input 
                  type="range" min="15" max="45" step="0.1" value={envStates.temp} 
                  onChange={(e) => updateSensor('temp', parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 h-1 bg-neutral-200 rounded-none cursor-pointer" 
                />
              </div>

              {/* Humidity */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>💧 RELATIVE HUMIDITY:</span>
                  <span className="text-neutral-900">{envStates.humidity.toFixed(1)} %</span>
                </div>
                <input 
                  type="range" min="10" max="95" step="0.5" value={envStates.humidity} 
                  onChange={(e) => updateSensor('humidity', parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 h-1 bg-neutral-200 rounded-none cursor-pointer" 
                />
              </div>

              {/* Vibration */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>📳 MECHANICAL VIBRATION:</span>
                  <span className="text-neutral-900">{envStates.vibration.toFixed(3)} g</span>
                </div>
                <input 
                  type="range" min="0.001" max="0.5" step="0.001" value={envStates.vibration} 
                  onChange={(e) => updateSensor('vibration', parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 h-1 bg-neutral-200 rounded-none cursor-pointer" 
                />
              </div>

              {/* CO2 */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>🍃 ATMOSPHERIC CO₂:</span>
                  <span className="text-neutral-900">{envStates.co2} ppm</span>
                </div>
                <input 
                  type="range" min="350" max="800" step="5" value={envStates.co2} 
                  onChange={(e) => updateSensor('co2', parseInt(e.target.value))}
                  className="w-full accent-indigo-600 h-1 bg-neutral-200 rounded-none cursor-pointer" 
                />
              </div>

              {/* Magnetic Field */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>🧲 GEOMAGNETIC FIELD:</span>
                  <span className="text-neutral-900">{envStates.magneticField.toFixed(1)} µT</span>
                </div>
                <input 
                  type="range" min="20" max="80" step="0.2" value={envStates.magneticField} 
                  onChange={(e) => updateSensor('magneticField', parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 h-1 bg-neutral-200 rounded-none cursor-pointer" 
                />
              </div>
            </div>
          </div>

          {/* Diagnostic Console Logs output */}
          <div className="bg-[#121212] text-neutral-200 p-4 border-2 border-[#1A1A1A] font-mono text-[10.5px] h-[150px] overflow-y-auto flex flex-col relative shadow-[inset_0px_2px_8px_rgba(0,0,0,0.8)] text-left rounded-none">
            <span className="text-[9px] font-bold text-indigo-400 border-b border-neutral-800 pb-1 mb-1 block uppercase">
              ⚡ LIVE CALIBRATION FEED
            </span>
            {calibrationLogs.length === 0 ? (
              <div className="text-neutral-500 italic my-auto text-center">
                System idle. Select diagnostic options to stream active hardware telemetry.
              </div>
            ) : (
              <div className="space-y-1 flex-1">
                {calibrationLogs.map((log, i) => (
                  <div key={i} className="text-emerald-400/90 leading-tight">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Closed-Loop Experiment Loops Runner */}
      <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] rounded-none text-left flex flex-col gap-4">
        <div className="border-b border-[#1A1A1A] pb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Beaker className="w-5 h-5 text-indigo-600" />
            <h4 className="font-bold text-[#1A1A1A] tracking-tight text-sm font-serif uppercase">
              4. Closed-Loop Lab Workflows & Autonomous Run Cycles
            </h4>
          </div>

          {/* Loop Domain Selector Tabs */}
          <div className="flex gap-1 overflow-x-auto max-w-full pb-1">
            {DOMAIN_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => {
                  if (loopRunning) return;
                  setActiveScenarioId(sc.id);
                  setLoopStepIndex(-1);
                  setLoopLogs([]);
                }}
                disabled={loopRunning}
                className={`px-3 py-1 text-[10px] font-mono font-bold border transition cursor-pointer shrink-0 rounded-none ${
                  activeScenarioId === sc.id
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-[#FCFAF7] text-[#1A1A1A] border-neutral-200 hover:border-neutral-500'
                } ${loopRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {sc.title.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left panel: Selected loop steps */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[10.5px] font-bold font-mono text-indigo-700 block uppercase">
                🎯 CURRENT OBJECTIVE:
              </span>
              <p className="text-xs text-neutral-700 font-sans leading-relaxed italic border-l-2 border-indigo-600 pl-3 bg-indigo-50/20 py-1">
                "{activeScenario.description}"
              </p>
            </div>

            {/* Steps Path Progress Flow */}
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              <span className="text-[10px] font-mono font-bold text-neutral-400 block uppercase mb-1">
                Sequential Feedback Loop Workflow Steps
              </span>
              {activeScenario.steps.map((step, idx) => {
                const isStepPassed = loopStepIndex > idx;
                const isStepActive = loopStepIndex === idx;
                return (
                  <div 
                    key={idx}
                    className={`p-2 border transition duration-150 flex items-start gap-2.5 rounded-none text-xs ${
                      isStepActive
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-inner scale-[1.01]'
                        : isStepPassed
                        ? 'border-emerald-300 bg-emerald-50/15 opacity-80'
                        : 'border-neutral-200 bg-white'
                    }`}
                  >
                    <div className={`px-1.5 py-0.5 text-[9px] font-mono font-bold shrink-0 rounded-sm border ${
                      isStepActive
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : isStepPassed
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                    }`}>
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <strong className="text-neutral-900 font-sans text-[11px] uppercase tracking-tight">
                          {step.label}
                        </strong>
                        {isStepActive && (
                          <span className="text-[9px] font-mono font-bold text-indigo-700 animate-pulse uppercase">
                            ⚙️ ACTIVE STAGE
                          </span>
                        )}
                        {isStepPassed && (
                          <span className="text-[9px] font-mono font-bold text-emerald-700 uppercase">
                            ✓ VERIFIED
                          </span>
                        )}
                      </div>
                      <p className="text-[10.5px] text-neutral-500 font-sans mt-0.5">
                        {step.role}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Run Button trigger */}
            <button
              onClick={executeClosedLoop}
              disabled={loopRunning}
              className={`w-full py-3.5 text-xs font-mono font-black uppercase tracking-wider transition border-2 shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] flex items-center justify-center gap-2 cursor-pointer ${
                loopRunning
                  ? 'bg-neutral-100 text-neutral-400 border-neutral-200 shadow-none cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white border-[#1A1A1A]'
              }`}
            >
              {loopRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 text-neutral-400 animate-spin" />
                  Running Closed-Loop Experiment Sequence...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-white" />
                  Launch Closed-Loop experiment Run ({activeScenario.title.toUpperCase()})
                </>
              )}
            </button>
          </div>

          {/* Right panel: Live Execution Feed + Comparison Metrics */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Live closed-loop log console */}
            <div className="bg-[#121212] text-neutral-200 p-4 border-2 border-[#1A1A1A] font-mono text-[10.5px] h-[220px] overflow-y-auto flex flex-col relative shadow-[inset_0px_2px_8px_rgba(0,0,0,0.8)] rounded-none">
              <span className="text-[9px] font-bold text-indigo-400 border-b border-neutral-800 pb-1 mb-1.5 block uppercase">
                🌌 Closed-Loop Instrument Telemetry & State Tensors
              </span>
              
              {loopLogs.length === 0 ? (
                <div className="text-neutral-500 italic my-auto text-center">
                  Closed-loop system idle. Click "Launch Closed-Loop experiment Run" to begin dynamic simulation sequences.
                </div>
              ) : (
                <div className="space-y-1.5 flex-1">
                  {loopLogs.map((log, idx) => (
                    <div key={idx} className={`leading-normal ${
                      log.startsWith('[CLOSED-LOOP]')
                        ? 'text-indigo-400 font-bold'
                        : log.startsWith('[REALITY ANCHOR') || log.startsWith('   -')
                        ? 'text-yellow-400 font-semibold'
                        : 'text-neutral-200'
                    }`}>
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CAD to Reality comparison matrix */}
            <div className="border border-neutral-300 bg-[#FCFAF7] p-4 rounded-none flex flex-col gap-2.5">
              <span className="text-[10px] font-bold font-mono text-neutral-500 block uppercase">
                ⚖️ METROLOGY SCAN & REALITY COMPARATOR (COMPARE LOOPS)
              </span>

              <div className="space-y-1.5 text-xs font-sans">
                <div className="flex justify-between border-b border-neutral-200/65 pb-1">
                  <span className="text-neutral-500">CAD DESIGN COEFFICIENT:</span>
                  <span className="font-mono text-neutral-900 font-bold">{activeScenario.cadSimMeasure.cadSpec}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-200/65 pb-1">
                  <span className="text-neutral-500">SIMULATION FORECAST:</span>
                  <span className="font-mono text-indigo-700 font-bold">{activeScenario.cadSimMeasure.simValue}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-200/65 pb-1">
                  <span className="text-neutral-500">PHYSICAL INSTRUMENT DATA:</span>
                  <span className="font-mono text-emerald-800 font-bold">{activeScenario.cadSimMeasure.physicalMeasured}</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-neutral-500 font-bold uppercase">OBSERVED COGNITIVE GAP:</span>
                  <span className="font-mono text-amber-700 font-black uppercase tracking-wider">
                    {activeScenario.cadSimMeasure.deviation}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <MasterTestSandbox onLogEvent={onLogEvent} />

    </div>
  );
}
