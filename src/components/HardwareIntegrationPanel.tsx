import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Beaker, Layers, Activity, RefreshCw, Sliders, Cpu, 
  CheckCircle, AlertTriangle, Compass, Database, Network, 
  Eye, Thermometer, Binary, Radio, Zap, ArrowRight, CornerDownRight, Info,
  Shield, ShieldAlert, ShieldCheck, Lock, Unlock, Play, Square, SkipForward,
  Sparkles, ChevronRight, ChevronDown, ChevronLeft, Check, X, Flame, Droplets, Wind,
  Box, GitBranch, FileText, ListOrdered, Settings, Terminal, Award, Upload,
  Table, FileSpreadsheet, HardDrive, Filter, SlidersHorizontal, Sliders as SliderIcon
} from 'lucide-react';
import MasterTestSandbox from './MasterTestSandbox';
import Spatial3DProgressionViewer from './Spatial3DProgressionViewer';
import PhysicalAiStressBenchmark from './PhysicalAiStressBenchmark';
import PhysicalAiWorldStatePipeline from './PhysicalAiWorldStatePipeline';
import QuantumPhotonicWorkbench from './QuantumPhotonicWorkbench';
import CsvDataInspectorModal from './CsvDataInspectorModal';
import {
  RiskLevel,
  SensoryFrame,
  PhysicalNodeEntity,
  PhysicalWorldStateTensor,
  ActionCandidate,
  VerificationRecord,
  SubconsciousIntuition,
  DishwasherScenarioStep
} from '../types';
import {
  OmegaPhysicalHarness,
  DISHWASHER_22_STEPS
} from '../utils/physicalAiHarness';

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
    components: ['Hypothesis Generator', 'Causal Reasoning Engine', 'Observation Matrix', 'Arbiter Controller', 'Physical-AI Loop'],
    telemetry: { status: 'ACTIVE', frequency: '2.4 GHz', ping: '4ms', throughput: '1.2 GB/s' },
    details: 'The brain of the platform. Translates abstract scientific hypotheses into executable multi-parametric experiment graphs, evaluates validation scores, and triggers cognitive correction sweeps.'
  },
  {
    id: 'ai_models',
    name: 'AI Models',
    role: 'Multi-modal core models & domain-specific neural networks',
    components: ['Gemini 2.5 Flash', 'Phi-3 Mini', 'Mistral Large', 'LLaVA Visual Encoder', 'Physical-AI Spatial Transformers'],
    telemetry: { status: 'ONLINE', frequency: 'N/A', ping: '85ms', throughput: '450 tokens/s' },
    details: 'Houses the large language and visual models. Facilitates real-time reasoning, document-level semantic knowledge extraction, and deep visual representation analysis of raw experimental imagery.'
  },
  {
    id: 'simulation',
    name: 'Simulation Engines',
    role: 'Multi-physics high-fidelity simulators',
    components: ['MuJoCo Forward Dynamics', 'DFT Predictor', 'Molecular Dynamics (LAMMPS)', 'Finite Element Analysis (FEA)'],
    telemetry: { status: 'ACTIVE', frequency: '12.8 TFLOPS', ping: '12ms', throughput: '120 frames/s' },
    details: 'Runs high-fidelity physical, chemical, biological, and kinematic models to predict system responses before executing physical robotic actions.'
  },
  {
    id: 'knowledge',
    name: 'Knowledge Layer',
    role: 'Structured geometry and global state representation',
    components: ['Causal Hypergraph Mesh', 'WorldStateTensor', 'Thermodynamic Manifold', 'Subconscious Prior Memory'],
    telemetry: { status: 'ONLINE', frequency: '100 MHz', ping: '2ms', throughput: '2.1 M nodes/s' },
    details: 'Coordinates the theoretical topological boundaries. Maps empirical observations onto the manifold coordinates, updates causal link scores, and verifies alignment against the Reality Anchor.'
  },
  {
    id: 'laboratory',
    name: 'Laboratory & Device Layer',
    role: 'Physical instruments, spectrometers, and robotic manipulators',
    components: ['7-DOF Robotic Arm', 'Parallel Compliant Gripper', 'RGB-D Point Cloud Sensor', 'Diffractometers & Spectrometers'],
    telemetry: { status: 'ACTIVE', frequency: '500 kHz', ping: '35ms', throughput: '45 MB/s' },
    details: 'The connection portal to physical hardware instruments. Interfaces directly with cameras, robotic controllers, temperature regulators, and chemical measurement devices.'
  },
  {
    id: 'autonomous',
    name: 'Autonomous Governance',
    role: 'Closed-loop scheduler, Level A-D Governance Gate & Subconscious Engine',
    components: ['Level A-D Governance Gate', 'Subconscious Prior Miner', 'Symbolic Safety Verifier', 'HITL Token Auth'],
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
  { id: 'dev_rob_arm', name: '7-DOF High-Compliance Robotic Arm', purpose: 'Sub-millimeter spatial trajectory & dishware manipulation', category: 'robotics', company: 'Franka Emika / Universal Robots', status: 'ONLINE', paramName: 'Repeatability', paramValue: '±0.02 mm' },
  { id: 'dev_tactile_grip', name: 'Dual-Finger Compliant Tactile Gripper', purpose: 'Active shear slip sensing & fragile glass force limits', category: 'robotics', company: 'GelSight / Robotiq', status: 'ONLINE', paramName: 'Force Resolution', paramValue: '0.05 N' },
  { id: 'dev_rgbd_sensor', name: 'Spatial RGB-D Depth Visualizer', purpose: 'Dense 3D point cloud & rack slot segmentation', category: 'microscopy', company: 'Intel RealSense / Photoneo', status: 'ONLINE', paramName: 'Depth Accuracy', paramValue: '0.15 mm' },
  { id: 'dev_micro', name: 'Optical Microscope', purpose: 'Basic microscale observation & surface tracking', category: 'microscopy', company: 'Zeiss / Olympus', status: 'ONLINE', paramName: 'Magnification', paramValue: '100x / 400x' },
  { id: 'dev_sem', name: 'Scanning Electron Microscope (SEM)', purpose: 'Sub-micron high-resolution surface topology mapping', category: 'microscopy', company: 'Thermo Fisher / Hitachi', status: 'ONLINE', paramName: 'Accelerating Voltage', paramValue: '15.0 kV' },
  { id: 'dev_xrd', name: 'X-Ray Diffractometer (XRD)', purpose: 'Crystal lattice phase identification & orientation', category: 'spectroscopy', company: 'Bruker / Rigaku', status: 'ONLINE', paramName: 'Theta-2Theta Step', paramValue: '0.02 deg' },
  { id: 'dev_raman', name: 'Raman Spectrometer', purpose: 'In-situ chemical fingerprinting & molecular bond vibrations', category: 'spectroscopy', company: 'Renishaw / Horiba', status: 'ONLINE', paramName: 'Laser Wavelength', paramValue: '532 nm' },
  { id: 'dev_dsc', name: 'Differential Scanning Calorimeter (DSC)', purpose: 'Thermal glass transitions, crystallization, and melting peaks', category: 'thermal_mechanical', company: 'TA Instruments', status: 'ONLINE', paramName: 'Heating Rate', paramValue: '10.0 °C/min' },
  { id: 'dev_seq', name: 'DNA/RNA Sequencer', purpose: 'High-throughput genomic sequencing & codon alignment', category: 'biotech', company: 'Illumina / Oxford Nanopore', status: 'ONLINE', paramName: 'Sequence Accuracy', paramValue: '99.98% Q30' },
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
    id: 'dishwasher',
    title: 'Robotic Dishwasher Loading (Physical-AI)',
    description: 'Autonomous 22-step multi-modal perception, simulation verification, fragile glass handling, and spray clearance verification.',
    steps: DISHWASHER_22_STEPS.map(s => ({ label: `Step ${s.stepNumber}: ${s.title}`, role: s.description })),
    cadSimMeasure: {
      cadSpec: 'Nominal Lower & Upper Rack Spatial Layout (CAD DWG-9021)',
      simValue: 'Predicted cycle duration: 42.5s, Max glass grip: 3.8N, Spray clearance: 52mm',
      physicalMeasured: 'Actual cycle duration: 43.1s, Max glass grip: 3.78N, Spray clearance: 51.6mm',
      deviation: '+1.41% (Within physical convergence bound)'
    }
  },
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

// Forecast Vector Table Schema (Matching Screenshot 1 Layout)
interface RobotForecastItem {
  id: number;
  instrument: string;
  current: string;
  omega_range_low: string;
  omega_range_high: string;
  confidence: number;
  veto: 'PASS' | 'WARN' | 'VETO';
  direction: string;
  causalDriver: string;
}

const ROBOT_FORECAST_VECTORS: RobotForecastItem[] = [
  {
    id: 0,
    instrument: '7-DOF Joint #04 Pitch (rad)',
    current: '0.5830 rad (33.4°)',
    omega_range_low: '0.4886 rad (28.0°)',
    omega_range_high: '0.6632 rad (38.0°)',
    confidence: 0.98,
    veto: 'PASS',
    direction: 'Docking Trajectory',
    causalDriver: 'IK Slot #04 Solution + Impedance Control'
  },
  {
    id: 1,
    instrument: 'GelSight Grip Normal Force',
    current: '3.8000 N',
    omega_range_low: '2.5000 N',
    omega_range_high: '4.4000 N',
    confidence: 0.96,
    veto: 'PASS',
    direction: 'Compliant Clamp',
    causalDriver: 'Tactile Shear Zero-Slip + Fragility Bound (<4.5N)'
  },
  {
    id: 2,
    instrument: 'Lower Spray Arm Jet Clearance',
    current: '52.0000 mm',
    omega_range_low: '35.0000 mm',
    omega_range_high: '65.0000 mm',
    confidence: 0.99,
    veto: 'PASS',
    direction: 'Free Sweep Arc',
    causalDriver: 'LiDAR Height Profiler (Minimum >35mm)'
  },
  {
    id: 3,
    instrument: 'Dish Tine Collision Buffer',
    current: '57.0000 mm',
    omega_range_low: '30.0000 mm',
    omega_range_high: '90.0000 mm',
    confidence: 0.97,
    veto: 'PASS',
    direction: 'Insertion Path',
    causalDriver: 'MuJoCo Convex Hull Distance Matrix'
  },
  {
    id: 4,
    instrument: '7-DOF Joint #03 Torque Load',
    current: '6.1000 Nm',
    omega_range_low: '3.0000 Nm',
    omega_range_high: '9.5000 Nm',
    confidence: 0.95,
    veto: 'PASS',
    direction: 'Dynamic Motion',
    causalDriver: 'Dynamic Inertia Matrix (Max Limit: 10.0Nm)'
  },
  {
    id: 5,
    instrument: 'Eye-in-Hand LiDAR Sim2Real Error',
    current: '5.1000 mm',
    omega_range_low: '0.0000 mm',
    omega_range_high: '9.8000 mm',
    confidence: 0.96,
    veto: 'PASS',
    direction: 'Reality Anchor Alignment',
    causalDriver: 'ICP Point Cloud to Dish CAD Alignment (<10mm)'
  },
  {
    id: 6,
    instrument: 'GelSight Micro-Slip Velocity',
    current: '0.0000 mm/s',
    omega_range_low: '0.0000 mm/s',
    omega_range_high: '0.2500 mm/s',
    confidence: 0.99,
    veto: 'PASS',
    direction: 'Zero Slip Lock',
    causalDriver: 'Optical Flow Elastomer Surface Tracking'
  },
  {
    id: 7,
    instrument: 'Dishwasher Tub Linear Slide Rail',
    current: '0.3200 m',
    omega_range_low: '0.0000 m',
    omega_range_high: '0.3800 m',
    confidence: 0.99,
    veto: 'PASS',
    direction: 'Rack Extraction',
    causalDriver: 'Linear Slide Limit Switch (Stroke: 0.38m)'
  }
];

export default function HardwareIntegrationPanel({ onLogEvent }: HardwareIntegrationPanelProps) {
  // Navigation Sub-tab within Hardware panel
  const [hardwareSubTab, setHardwareSubTab] = useState<'world_state_pipeline' | 'stress_benchmark' | 'physical_ai_harness' | 'spatial_3d_progression' | 'robot_forecast_vector' | 'operator_guide' | 'instruments' | 'workflows' | 'sandbox'>('world_state_pipeline');
  const [showEmbedded3dViewer, setShowEmbedded3dViewer] = useState<boolean>(true);
  const [showCommandDeckModal, setShowCommandDeckModal] = useState<boolean>(false);
  const [isCsvInspectorOpen, setIsCsvInspectorOpen] = useState<boolean>(false);
  const [csvInspectorTab, setCsvInspectorTab] = useState<'telemetry' | 'pointcloud' | 'gelsight' | 'manifest' | 'fused'>('telemetry');

  // File Upload states for Left Panel
  const [uploadedFiles, setUploadedFiles] = useState<{ [filename: string]: boolean }>({
    'robot_telemetry.csv': true,
    'pointcloud_spatial.csv': true,
    'gelsight_tactile.csv': true,
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, filename: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFiles(prev => ({ ...prev, [filename]: true }));
      onLogEvent(`[DATA INGESTION] Uploaded ${file.name} (${(file.size / 1024).toFixed(1)} KB). Stream synchronized with 7-DOF MuJoCo model.`, 'physics');
    }
  };

  const handleClearAndReloadData = () => {
    setUploadedFiles({
      'robot_telemetry.csv': true,
      'pointcloud_spatial.csv': true,
      'gelsight_tactile.csv': true,
    });
    setRealityErrorHistory([
      { step: 1, errorPct: 0.8 },
      { step: 5, errorPct: 1.2 },
      { step: 10, errorPct: 1.4 },
      { step: 15, errorPct: 0.9 },
      { step: 20, errorPct: 1.85 }
    ]);
    onLogEvent(`[DATA RESET] Telemetry cleared and reloaded with deterministic DISHWASHER_TEST_001 baseline vectors.`, 'info');
  };

  // Physical Harness Core Instance
  const harness = useMemo(() => new OmegaPhysicalHarness(), []);

  // Physical-AI Harness Real-time States
  const [sensoryFrame, setSensoryFrame] = useState<SensoryFrame>(() => harness.getInitialSensoryFrame());
  const [worldState, setWorldState] = useState<PhysicalWorldStateTensor>(() => harness.getDishwasherWorldState());
  const [selectedEntityId, setSelectedEntityId] = useState<string>('dish_glass_01');
  const [hitlAuthToken, setHitlAuthToken] = useState<string>('HITL_OVERRIDE_AUTH_DEV');
  const [isHitlAuthorized, setIsHitlAuthorized] = useState<boolean>(true);
  const [subconsciousFeed, setSubconsciousFeed] = useState<SubconsciousIntuition[]>([]);
  const [governanceAuditLogs, setGovernanceAuditLogs] = useState<string[]>([]);
  const [vetoTriggered, setVetoTriggered] = useState<boolean>(false);
  const [vetoReasonText, setVetoReasonText] = useState<string>('');

  // 22-Step Execution State
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [is22StepRunning, setIs22StepRunning] = useState<boolean>(false);
  const [autoRunIntervalSpeed, setAutoRunIntervalSpeed] = useState<number>(1400);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [gripperForceLive, setGripperForceLive] = useState<number>(3.8);
  const [sprayArmClearanceLiveMm, setSprayArmClearanceLiveMm] = useState<number>(52.0);
  const [tactileSlipIndexLive, setTactileSlipIndexLive] = useState<number>(0.04);
  const [realityErrorHistory, setRealityErrorHistory] = useState<{ step: number; errorPct: number }[]>([
    { step: 1, errorPct: 0.8 },
    { step: 5, errorPct: 1.2 },
    { step: 10, errorPct: 1.4 },
    { step: 15, errorPct: 0.9 },
    { step: 20, errorPct: 1.85 }
  ]);

  // Selected Entity derived
  const selectedEntity = useMemo(() => {
    return worldState.entities.find(e => e.id === selectedEntityId) || worldState.entities[0];
  }, [worldState, selectedEntityId]);

  // Traditional Lab Instruments & 6-Layer states
  const [selectedLayerId, setSelectedLayerId] = useState<string>('laboratory');
  const [deviceFilter, setDeviceFilter] = useState<string>('all');
  const [calibratingDeviceId, setCalibratingDeviceId] = useState<string | null>(null);
  const [calibrationProgress, setCalibrationProgress] = useState<number>(0);
  const [calibrationLogs, setCalibrationLogs] = useState<string[]>([]);
  
  const [activeScenarioId, setActiveScenarioId] = useState<string>('dishwasher');
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

  const stepIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (stepIntervalRef.current) {
        clearInterval(stepIntervalRef.current);
      }
    };
  }, []);

  // Initialize subconscious stream with default insights
  useEffect(() => {
    const initial1 = harness.subconscious.queryIntuition('wine_glass_stem', 3.8);
    const initial2 = harness.subconscious.queryIntuition('dish_rim_grasp', 11.5);
    setSubconsciousFeed([initial1, initial2]);
  }, [harness]);

  // Step progression handler for Dishwasher 22-Step Loop
  const executeStep = (stepIdx: number) => {
    if (stepIdx >= DISHWASHER_22_STEPS.length) {
      setIs22StepRunning(false);
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      onLogEvent(`[PHYSICAL-AI] 22-Step Dishwasher Loading Cycle completed with 100% compliance!`, 'physics');
      return;
    }

    const step = DISHWASHER_22_STEPS[stepIdx];
    setActiveStepIndex(stepIdx);

    // Update live telemetry based on step
    if (step.expectedTelemetry.gripperForceN !== undefined) {
      setGripperForceLive(step.expectedTelemetry.gripperForceN);
    }
    if (step.expectedTelemetry.sprayArmClearanceMm !== undefined) {
      setSprayArmClearanceLiveMm(step.expectedTelemetry.sprayArmClearanceMm);
    }
    if (step.expectedTelemetry.tactileSlipIndex !== undefined) {
      setTactileSlipIndexLive(step.expectedTelemetry.tactileSlipIndex);
    }
    if (step.expectedTelemetry.errorDeviationPct !== undefined) {
      setRealityErrorHistory(prev => [...prev.slice(-8), { step: step.stepNumber, errorPct: step.expectedTelemetry.errorDeviationPct! }]);
    }

    // Build mock ActionCandidate for this step to run through Governance Gate
    const mockAction: ActionCandidate = {
      actionId: `act_${step.stepNumber}_${Date.now().toString().slice(-4)}`,
      stepName: step.title,
      type: step.title.toLowerCase().includes('grasp') ? 'grasp' : step.title.toLowerCase().includes('insert') ? 'insert' : 'trajectory',
      targetEntityId: step.title.includes('Glass') ? 'dish_glass_01' : step.title.includes('Plate') ? 'dish_plate_01' : 'appliance_lower_rack',
      riskLevel: step.riskLevel,
      waypoints: [
        { x: 0.45, y: -0.10, z: 0.25, speedMPerS: 0.15, maxTorqueNm: step.expectedTelemetry.torquePeakNm || 8.0 }
      ],
      gripperForceTargetN: step.expectedTelemetry.gripperForceN || 5.0,
      expectedDurationMs: 1200,
      symbolicPreconditions: ['rack_extended', 'object_segmented'],
      postConditions: ['object_seated', 'spray_clearance_verified']
    };

    // Run Governance verification
    const tokenToPass = isHitlAuthorized ? hitlAuthToken : undefined;
    const verification = harness.governance.verifyAction(mockAction, worldState, sensoryFrame, tokenToPass);

    // Update Subconscious Intuition
    const patternKey = step.title.includes('Glass') ? 'wine_glass_stem' : step.title.includes('Plate') ? 'dish_rim_grasp' : 'rack_glide_push';
    const intuition = harness.subconscious.queryIntuition(patternKey, gripperForceLive);
    setSubconsciousFeed(prev => [intuition, ...prev.slice(0, 5)]);

    // Check for Veto
    if (verification.vetoReason) {
      setVetoTriggered(true);
      setVetoReasonText(verification.vetoReason);
      setGovernanceAuditLogs(prev => [`[${new Date().toLocaleTimeString()}] 🛑 ${verification.vetoReason}`, ...prev.slice(0, 9)]);
    } else {
      setVetoTriggered(false);
      setVetoReasonText('');
      setGovernanceAuditLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ✓ Step ${step.stepNumber} passed Tier ${step.riskLevel} (${verification.symbolicPass ? 'Symbolic: OK' : 'Check'} | HITL: ${verification.humanAuthorizationToken ? 'VERIFIED' : 'N/A'})`,
        ...prev.slice(0, 9)
      ]);
    }

    // Add log
    const logLine = `[STEP ${step.stepNumber}/22] [${step.subsystem}] ${step.title} -> ${step.hardwareCommand}`;
    setExecutionLogs(prev => [logLine, ...prev.slice(0, 15)]);
    onLogEvent(logLine, step.subsystem === 'ROBOT_ACTUATION' ? 'physics' : 'interaction');
  };

  // Run full 22-step autonomous loop
  const startAutonomousLoop = () => {
    if (is22StepRunning) {
      setIs22StepRunning(false);
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      return;
    }

    setIs22StepRunning(true);
    let current = 0;
    executeStep(0);

    stepIntervalRef.current = setInterval(() => {
      current++;
      if (current >= DISHWASHER_22_STEPS.length) {
        if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
        setIs22StepRunning(false);
        onLogEvent(`[PHYSICAL-AI] Full 22-Step Dishwasher Loading Cycle completed successfully!`, 'physics');
      } else {
        executeStep(current);
      }
    }, autoRunIntervalSpeed);
  };

  // Step forward single step
  const stepForwardOnce = () => {
    const nextIdx = (activeStepIndex + 1) % DISHWASHER_22_STEPS.length;
    executeStep(nextIdx);
  };

  // Reset 22-Step loop
  const resetLoop = () => {
    if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    setIs22StepRunning(false);
    setActiveStepIndex(0);
    setExecutionLogs([]);
    setGripperForceLive(3.8);
    setSprayArmClearanceLiveMm(52.0);
    setTactileSlipIndexLive(0.04);
    setVetoTriggered(false);
    onLogEvent(`[PHYSICAL-AI] Dishwasher loading cycle reset to Step 1.`, 'info');
  };

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
  const activeStepObj = DISHWASHER_22_STEPS[activeStepIndex] || DISHWASHER_22_STEPS[0];

  const HARDWARE_TABS = [
    { id: 'world_state_pipeline', label: '⚡ INGEST → 3D World State (0-50ms)', desc: 'Fused Sensor Streams, Uncertainty & Slip Predictor' },
    { id: 'quantum_photonics', label: '🔮 Quantum-Photonic Closed Loop (QFC)', desc: 'Single-Photon Frequency Conversion & ORCA Actuators' },
    { id: 'stress_benchmark', label: '⚡ Stress Benchmark (DISHWASHER_TEST_001)', desc: 'Deterministic 12-Step Closed Loop' },
    { id: 'physical_ai_harness', label: '🦾 Physical-AI Harness (4-Section)', desc: 'Telemetry, Twin & Governance' },
    { id: 'spatial_3d_progression', label: '🎥 3D Spatial Video Progression', desc: 'Kinematic 3D Video Scrubber' },
    { id: 'robot_forecast_vector', label: '📊 Robot State & Forecast Vector', desc: 'Forecast Vector & VETO Status' },
    { id: 'instruments', label: '🔬 Hardware Registry & Sensors', desc: '10 Physical Instruments' },
    { id: 'operator_guide', label: '📖 SOP Operator Guide', desc: 'Robotic Dishwasher Protocols' },
    { id: 'workflows', label: '🧬 Multi-Domain Closed Loops', desc: 'Materials, Aero & Bio Workflows' },
    { id: 'sandbox', label: '🧪 Master Test Sandbox', desc: 'Continuous Verification & USDI' }
  ];

  return (
    <div className="space-y-4 text-left font-sans">
      
      {/* TOP META STATUS BAR (Screenshot 1 Style) */}
      <div className="bg-[#1A1A1A] text-white px-4 py-2 flex flex-wrap items-center justify-between gap-3 border-2 border-[#1A1A1A] text-[11px] font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500 text-black px-1.5 py-0.5 font-bold uppercase text-[9.5px]">ALL GAPS CLOSED</span>
          <span className="text-neutral-300 font-bold hidden sm:inline">| 7-DOF Robotic Cell | MuJoCo & GelSight | SYNTHETIC & DETERMINISTIC HARNESS</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-neutral-400 hidden md:inline">STREAM:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
            200 Hz TELEMETRY ACTIVE
          </span>
          <button 
            onClick={() => setShowCommandDeckModal(true)}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white px-2.5 py-1 border border-neutral-600 rounded-none text-[9.5px] font-bold cursor-pointer flex items-center gap-1 transition"
          >
            <span>COMMAND DECK [39 LABS]</span>
          </button>
          <button
            onClick={() => {
              setVetoTriggered(true);
              setVetoReasonText('[MANUAL E-STOP] Emergency stop engaged by operator. Arm servos locked.');
              if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
              setIs22StepRunning(false);
              onLogEvent('[E-STOP] Emergency stop triggered on robotic manipulators.', 'info');
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-mono text-[9.5px] font-black uppercase px-2.5 py-1 border border-red-800 cursor-pointer flex items-center gap-1"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            E-STOP
          </button>
        </div>
      </div>

      {/* DUAL PANEL WRAPPER */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        
        {/* LEFT PANEL: DATA INGESTION & HARDWARE TELEMETRY SIDEBAR */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4 font-sans">
          
          {/* 1. DATA UPLOAD SECTION */}
          <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
              <h4 className="font-serif font-black uppercase text-sm text-[#1A1A1A] flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-indigo-600" />
                Data Upload & Ingest
              </h4>
              <span className="text-[9px] font-mono bg-emerald-100 text-emerald-900 px-1.5 py-0.5 border border-emerald-300 font-bold">200 Hz SYNCED</span>
            </div>

            {/* Quick Inspect All Button */}
            <button
              onClick={() => {
                setCsvInspectorTab('telemetry');
                setIsCsvInspectorOpen(true);
                onLogEvent("[INSPECTOR] Opened CSV Data Table & Multi-Sensor Inspector from Hardware Studio.", "interaction");
              }}
              className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-mono text-[10px] font-bold uppercase py-1.5 px-2 border border-indigo-300 shadow-sm cursor-pointer flex items-center justify-center gap-1.5 transition"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-700" />
              <span>📊 Inspect All CSV Datasets</span>
            </button>

            {/* Upload 1: robot_telemetry.csv */}
            <div className="space-y-1 bg-[#FAF9F6] p-2 border border-neutral-300">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-neutral-900">robot_telemetry.csv</span>
                <span className="text-[8.5px] font-mono text-emerald-700 font-bold">✓ Synced</span>
              </div>
              <div className="grid grid-cols-2 gap-1 mt-1">
                <button
                  onClick={() => {
                    setCsvInspectorTab('telemetry');
                    setIsCsvInspectorOpen(true);
                  }}
                  className="bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 p-1 text-[9px] font-mono font-bold uppercase flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Eye className="w-2.5 h-2.5 text-indigo-600" />
                  Inspect
                </button>
                <label className="border border-[#1A1A1A] bg-[#1A1A1A] hover:bg-neutral-800 text-white p-1 flex items-center justify-center gap-1 cursor-pointer text-[9px] font-mono font-bold uppercase transition">
                  <input type="file" accept=".csv,.json" className="hidden" onChange={(e) => handleFileUpload(e, 'robot_telemetry.csv')} />
                  <Upload className="w-2.5 h-2.5 text-emerald-400" />
                  <span>Upload</span>
                </label>
              </div>
              <span className="text-[8.5px] text-neutral-500 font-mono block">11 rows • 7-DOF Kinematics @ 200Hz</span>
            </div>

            {/* Upload 2: pointcloud_spatial.csv */}
            <div className="space-y-1 bg-[#FAF9F6] p-2 border border-neutral-300">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-neutral-900">pointcloud_spatial.csv</span>
                <span className="text-[8.5px] font-mono text-emerald-700 font-bold">✓ Synced</span>
              </div>
              <div className="grid grid-cols-2 gap-1 mt-1">
                <button
                  onClick={() => {
                    setCsvInspectorTab('pointcloud');
                    setIsCsvInspectorOpen(true);
                  }}
                  className="bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 p-1 text-[9px] font-mono font-bold uppercase flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Eye className="w-2.5 h-2.5 text-indigo-600" />
                  Inspect
                </button>
                <label className="border border-[#1A1A1A] bg-[#1A1A1A] hover:bg-neutral-800 text-white p-1 flex items-center justify-center gap-1 cursor-pointer text-[9px] font-mono font-bold uppercase transition">
                  <input type="file" accept=".csv,.ply,.json" className="hidden" onChange={(e) => handleFileUpload(e, 'pointcloud_spatial.csv')} />
                  <Upload className="w-2.5 h-2.5 text-emerald-400" />
                  <span>Upload</span>
                </label>
              </div>
              <span className="text-[8.5px] text-neutral-500 font-mono block">15 3D points • LiDAR metrology</span>
            </div>

            {/* Upload 3: gelsight_tactile.csv */}
            <div className="space-y-1 bg-[#FAF9F6] p-2 border border-neutral-300">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-neutral-900">gelsight_tactile.csv</span>
                <span className="text-[8.5px] font-mono text-emerald-700 font-bold">✓ Synced</span>
              </div>
              <div className="grid grid-cols-2 gap-1 mt-1">
                <button
                  onClick={() => {
                    setCsvInspectorTab('gelsight');
                    setIsCsvInspectorOpen(true);
                  }}
                  className="bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 p-1 text-[9px] font-mono font-bold uppercase flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Eye className="w-2.5 h-2.5 text-indigo-600" />
                  Inspect
                </button>
                <label className="border border-[#1A1A1A] bg-[#1A1A1A] hover:bg-neutral-800 text-white p-1 flex items-center justify-center gap-1 cursor-pointer text-[9px] font-mono font-bold uppercase transition">
                  <input type="file" accept=".csv,.json" className="hidden" onChange={(e) => handleFileUpload(e, 'gelsight_tactile.csv')} />
                  <Upload className="w-2.5 h-2.5 text-emerald-400" />
                  <span>Upload</span>
                </label>
              </div>
              <span className="text-[8.5px] text-neutral-500 font-mono block">11 rows • Tactile Shear & Slip</span>
            </div>

            <button 
              onClick={() => {
                setHardwareSubTab('world_state_pipeline');
                onLogEvent("[PIPELINE] Initialized 3D World State Ingestion (0-50ms synchronized).", "physics");
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[10px] font-black uppercase py-2 px-3 border border-emerald-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center gap-1.5 transition"
            >
              <Zap className="w-3.5 h-3.5 fill-white text-white" />
              ⚡ INGEST → BUILD WORLD STATE
            </button>

            <button 
              onClick={handleClearAndReloadData}
              className="w-full bg-[#1A1A1A] hover:bg-neutral-800 text-white font-mono text-[10px] font-bold uppercase py-2 px-3 border border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center gap-1.5 transition"
            >
              <RefreshCw className="w-3 h-3 text-emerald-400" />
              Clear Session / Reload Data
            </button>
          </div>

          {/* 2. ROBOTICS HARDWARE HEALTH & TELEMETRY */}
          <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
              <h4 className="font-serif font-black uppercase text-xs text-[#1A1A1A] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                Robotic Cell Hardware
              </h4>
              <span className="text-[8.5px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-300 font-bold">100% ONLINE</span>
            </div>

            <div className="space-y-2 text-[10.5px] font-mono">
              <div className="bg-neutral-50 p-2 border border-neutral-200 flex justify-between items-center">
                <span className="text-neutral-600">7-DOF Manipulator:</span>
                <span className="font-bold text-neutral-900">38.2°C • Cal 99.8%</span>
              </div>
              <div className="bg-neutral-50 p-2 border border-neutral-200 flex justify-between items-center">
                <span className="text-neutral-600">GelSight Tactile:</span>
                <span className="font-bold text-emerald-700">200Hz • Slip 0.04%</span>
              </div>
              <div className="bg-neutral-50 p-2 border border-neutral-200 flex justify-between items-center">
                <span className="text-neutral-600">RealSense LiDAR:</span>
                <span className="font-bold text-neutral-900">0.15mm precision</span>
              </div>
              <div className="bg-neutral-50 p-2 border border-neutral-200 flex justify-between items-center">
                <span className="text-neutral-600">Tub Metrology Jet:</span>
                <span className="font-bold text-indigo-700">Clearance 52.0mm</span>
              </div>
            </div>
          </div>

          {/* 3. SAFETY GOVERNOR & HARD VETO */}
          <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
              <h4 className="font-serif font-black uppercase text-xs text-[#1A1A1A] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Safety Governor (VETO)
              </h4>
              <span className={`text-[8.5px] font-mono px-1.5 py-0.5 border font-bold ${
                vetoTriggered ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                {vetoTriggered ? 'VETO ACTIVE' : 'ALL CLEAR'}
              </span>
            </div>

            <div className="space-y-2 text-[10.5px] font-mono">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">HITL Auth Token:</span>
                <span className="font-bold text-neutral-800 bg-neutral-100 px-1 py-0.5 border border-neutral-300 text-[9.5px]">
                  [{hitlAuthToken}]
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Fragility Limit:</span>
                <span className="font-bold text-emerald-700">&lt; 4.5 N</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Obstacle Buffer:</span>
                <span className="font-bold text-neutral-800">&gt; 30.0 mm</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: EXECUTIVE SUMMARY & TAB WORKSPACE */}
        <div className="flex-1 min-w-0 space-y-4">
          
          {/* EXECUTIVE SUMMARY CALLOUT BOX (Screenshot 1 Matching) */}
          <div className="bg-[#EBF5FB] border-2 border-[#1A1A1A] p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2">
            <div className="flex items-center justify-between border-b border-indigo-200 pb-1.5">
              <span className="text-[11px] font-serif font-black uppercase text-indigo-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Executive Summary
              </span>
              <span className="text-[9px] font-mono font-bold bg-indigo-100 text-indigo-900 px-2 py-0.5">
                DISHWASHER CELL VETO: ACTIVE
              </span>
            </div>
            <p className="text-xs text-indigo-950 font-sans leading-relaxed font-normal">
              <strong>OMEGA v5.0 Active Regime: [NORMAL / DETERMINISTIC].</strong> Autonomous 16-stage physical closed-loop active. 7-DOF robotic arm state tensor synchronized with MuJoCo contact dynamics. Symbolic verification has screened 3 candidate policies with deterministic VETO rules active to prevent rack collisions and wine glass fracture (&lt;4.5N). Next EIG benchmark: STACKED_BOWLS.
            </p>
          </div>

          {/* HORIZONTAL SCROLLING TAB BAR (Screenshot 1 Matching with Green Pill) */}
          <div className="flex items-center gap-1 border-b-2 border-[#1A1A1A] pb-2 overflow-x-auto">
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 flex-1">
              {HARDWARE_TABS.map((tab) => {
                const isActive = hardwareSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setHardwareSubTab(tab.id as any)}
                    className={`px-3 py-2 text-[10.5px] font-mono font-bold tracking-tight cursor-pointer whitespace-nowrap border-2 transition rounded-none shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#10B981] text-[#0A2E1C] border-[#10B981] font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-[#1A1A1A]'
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#0A2E1C] inline-block animate-pulse" />}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUB-VIEW: 3D WORLD STATE INGESTION & PIPELINE */}
          {hardwareSubTab === 'world_state_pipeline' && (
            <div className="space-y-4 font-sans animate-fadeIn">
              <PhysicalAiWorldStatePipeline onLogEvent={onLogEvent} />
            </div>
          )}

          {/* SUB-VIEW: QUANTUM-PHOTONIC CLOSED LOOP (QFC) */}
          {hardwareSubTab === 'quantum_photonics' && (
            <div className="space-y-4 font-sans animate-fadeIn">
              <QuantumPhotonicWorkbench onLogEvent={onLogEvent} />
            </div>
          )}

          {/* SUB-VIEW: ROBOT STATE & FORECAST VECTOR TABLE (Screenshot 1 matching) */}
          {hardwareSubTab === 'robot_forecast_vector' && (
            <div className="space-y-4 font-sans animate-fadeIn">
              <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-2">
                <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
                  <h4 className="font-serif font-black uppercase text-base text-[#1A1A1A] flex items-center gap-2">
                    <Table className="w-4 h-4 text-indigo-600" />
                    OMEGA Robot State & Forecast Vector
                  </h4>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 font-bold">
                    8/8 TELEMETRY NODES PASS
                  </span>
                </div>
                <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                  Live probabilistic state vectors, symbolic VETO bounds, inverse kinematics trajectories, and GelSight contact force constraints mapped in real time.
                </p>
              </div>

              <div className="bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 border-b-2 border-[#1A1A1A] text-neutral-800 uppercase font-black text-[10px] tracking-wider">
                      <th className="p-3 border-r border-neutral-200">#</th>
                      <th className="p-3 border-r border-neutral-200">Instrument / Joint</th>
                      <th className="p-3 border-r border-neutral-200">Current</th>
                      <th className="p-3 border-r border-neutral-200">omega_range_low</th>
                      <th className="p-3 border-r border-neutral-200">omega_range_high</th>
                      <th className="p-3 border-r border-neutral-200 text-center">confidence</th>
                      <th className="p-3 border-r border-neutral-200 text-center">VETO</th>
                      <th className="p-3 border-r border-neutral-200">Direction</th>
                      <th className="p-3">Causal Driver / Constraint</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {ROBOT_FORECAST_VECTORS.map((row) => (
                      <tr key={row.id} className="hover:bg-indigo-50/50 transition">
                        <td className="p-3 font-bold text-neutral-400 border-r border-neutral-200">{row.id}</td>
                        <td className="p-3 font-bold text-neutral-900 border-r border-neutral-200 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>{row.instrument}</span>
                        </td>
                        <td className="p-3 font-bold text-neutral-900 border-r border-neutral-200 font-mono">{row.current}</td>
                        <td className="p-3 text-neutral-600 border-r border-neutral-200 font-mono">{row.omega_range_low}</td>
                        <td className="p-3 text-neutral-600 border-r border-neutral-200 font-mono">{row.omega_range_high}</td>
                        <td className="p-3 text-center border-r border-neutral-200 font-mono font-bold text-neutral-800">
                          {(row.confidence * 100).toFixed(0)}%
                        </td>
                        <td className="p-3 text-center border-r border-neutral-200">
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-black px-2 py-0.5 text-[9.5px] rounded-none">
                            {row.veto}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-indigo-700 border-r border-neutral-200">{row.direction}</td>
                        <td className="p-3 text-neutral-600 font-sans text-[10.5px]">{row.causalDriver}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

      {/* SUB-VIEW: 3D SPATIAL VIDEO PROGRESSION */}
      {hardwareSubTab === 'spatial_3d_progression' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-2">
            <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-widest block">
              🎥 3D METROLOGY & KINEMATIC VIDEO PROGRESSION
            </span>
            <h3 className="text-lg font-serif font-black uppercase text-neutral-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600 animate-pulse" />
              Robotic Dishwasher 3D Spatial Progression & Video Scrubber
            </h3>
            <p className="text-xs text-neutral-600 max-w-3xl font-sans leading-relaxed">
              Interact with full 3D affine perspective projection, 7-DOF forward kinematics, multi-angle camera viewports (Orbit 3D, Wrist Cam, Top-Down Metrology, Front Chamber, FEA Stress, LiDAR Point Cloud), timeline scrubber, and 22-step keyframe synchronization.
            </p>
          </div>

          <Spatial3DProgressionViewer
            onLogEvent={onLogEvent}
            externalActiveStep={activeStepIndex}
            onStepChange={(stepIdx) => {
              setActiveStepIndex(stepIdx);
              const step = DISHWASHER_22_STEPS[stepIdx];
              if (step && step.expectedTelemetry.gripperForceN !== undefined) {
                setGripperForceLive(step.expectedTelemetry.gripperForceN);
              }
            }}
          />
        </div>
      )}

      {/* SUB-VIEW: DISHWASHER_TEST_001 STRESS BENCHMARK */}
      {hardwareSubTab === 'stress_benchmark' && (
        <div className="space-y-6">
          <PhysicalAiStressBenchmark onLogEvent={onLogEvent} />
        </div>
      )}

      {/* SUB-VIEW 1: 4-SECTION PHYSICAL-AI HARNESS & ROBOT DISHWASHER WORKFLOW */}
      {hardwareSubTab === 'physical_ai_harness' && (
        <div className="space-y-6">

          {/* 22-STEP CLOSED-LOOP ROBOTIC DISHWASHER CONTROLLER STRIP */}
          <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#1A1A1A] pb-3">
              <div>
                <span className="text-[9.5px] font-mono font-bold text-indigo-700 uppercase tracking-widest block">
                  ACTIVE EXPERIMENT SCENARIO • DISHWASHER 22-STEP CLOSE-LOOP HARNESS
                </span>
                <h4 className="text-base font-serif font-black uppercase text-neutral-900 flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-600" />
                  Robotic Dishwasher Loading Orchestration Loop
                </h4>
              </div>

              {/* Loop Stepper Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={startAutonomousLoop}
                  className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase transition border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center gap-1.5 ${
                    is22StepRunning
                      ? 'bg-amber-400 text-black border-[#1A1A1A]'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white border-[#1A1A1A]'
                  }`}
                >
                  {is22StepRunning ? <Square className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  {is22StepRunning ? 'PAUSE 22-STEP LOOP' : 'AUTO-RUN 22-STEP HARNESS'}
                </button>

                <button
                  onClick={stepForwardOnce}
                  disabled={is22StepRunning}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 disabled:opacity-50 px-3 py-1.5 text-[10px] font-mono font-bold uppercase border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center gap-1"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  STEP FORWARD (SINGLE)
                </button>

                <button
                  onClick={resetLoop}
                  className="bg-white hover:bg-neutral-100 text-neutral-700 px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase border border-neutral-300 cursor-pointer"
                >
                  RESET
                </button>
              </div>
            </div>

            {/* Step Progress Bar & Active Step Banner */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono font-bold">
                <span className="text-neutral-800">
                  STEP {activeStepObj.stepNumber} of 22: <strong className="text-indigo-700">{activeStepObj.title}</strong>
                </span>
                <span className="text-neutral-500 font-mono text-[10.5px]">
                  Subsystem: <strong className="text-neutral-900 bg-neutral-100 px-1.5 py-0.5 rounded-none">{activeStepObj.subsystem}</strong> | Risk Tier: <strong className={`${activeStepObj.riskLevel === RiskLevel.LEVEL_D_CODE_DEVICE ? 'text-red-700 bg-red-50' : 'text-indigo-700 bg-indigo-50'} px-1.5 py-0.5 border`}>{activeStepObj.riskLevel}</strong>
                </span>
              </div>

              {/* Stepper Progress Visualizer */}
              <div className="grid grid-cols-11 sm:grid-cols-22 gap-1">
                {DISHWASHER_22_STEPS.map((s, idx) => {
                  const isCurrent = idx === activeStepIndex;
                  const isPast = idx < activeStepIndex;
                  return (
                    <button
                      key={s.stepNumber}
                      onClick={() => executeStep(idx)}
                      title={`Step ${s.stepNumber}: ${s.title}`}
                      className={`h-5 text-[8px] font-mono font-extrabold flex items-center justify-center border transition cursor-pointer ${
                        isCurrent
                          ? 'bg-indigo-600 text-white border-indigo-800 ring-2 ring-indigo-400 scale-105'
                          : isPast
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                          : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {s.stepNumber}
                    </button>
                  );
                })}
              </div>

              {/* Live Step Detail Box */}
              <div className="bg-[#FCFAF7] border border-[#1A1A1A] p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-neutral-800 font-sans leading-relaxed">
                    "{activeStepObj.description}"
                  </p>
                  <div className="font-mono text-[10px] text-indigo-900 bg-white border border-neutral-300 px-2 py-0.5 inline-block">
                    CMD: <code>{activeStepObj.hardwareCommand}</code>
                  </div>
                </div>

            {/* Live 3D Spatial Progression Viewer Accordion */}
            <div className="border-2 border-[#1A1A1A] bg-neutral-900 text-white overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="p-3 bg-neutral-950 flex items-center justify-between border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
                    Live 3D Spatial Metrology & Video Progression Viewport
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setHardwareSubTab('spatial_3d_progression')}
                    className="px-2 py-1 text-[9px] font-mono font-bold uppercase bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400 cursor-pointer"
                  >
                    Open Full 3D Deck ↗
                  </button>
                  <button
                    onClick={() => setShowEmbedded3dViewer(!showEmbedded3dViewer)}
                    className="px-2 py-1 text-[9px] font-mono font-bold uppercase bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 cursor-pointer"
                  >
                    {showEmbedded3dViewer ? 'Hide Viewport ▲' : 'Show Viewport ▼'}
                  </button>
                </div>
              </div>

              {showEmbedded3dViewer && (
                <div className="p-3 bg-[#0B0F17]">
                  <Spatial3DProgressionViewer
                    onLogEvent={onLogEvent}
                    externalActiveStep={activeStepIndex}
                    onStepChange={(stepIdx) => {
                      setActiveStepIndex(stepIdx);
                      const step = DISHWASHER_22_STEPS[stepIdx];
                      if (step && step.expectedTelemetry.gripperForceN !== undefined) {
                        setGripperForceLive(step.expectedTelemetry.gripperForceN);
                      }
                    }}
                  />
                </div>
              )}
            </div>

            {/* Key live parameters */}
                <div className="flex flex-wrap items-center gap-3 font-mono text-[10.5px] shrink-0">
                  <div className="bg-white border border-neutral-300 px-2 py-1">
                    <span className="text-neutral-500 text-[9px] block">GRIPPER FORCE</span>
                    <strong className="text-indigo-700">{gripperForceLive.toFixed(2)} N</strong>
                  </div>
                  <div className="bg-white border border-neutral-300 px-2 py-1">
                    <span className="text-neutral-500 text-[9px] block">SPRAY CLEARANCE</span>
                    <strong className={`${sprayArmClearanceLiveMm < 35 ? 'text-red-600' : 'text-emerald-700'}`}>
                      {sprayArmClearanceLiveMm.toFixed(1)} mm
                    </strong>
                  </div>
                  <div className="bg-white border border-neutral-300 px-2 py-1">
                    <span className="text-neutral-500 text-[9px] block">SLIP RISK INDEX</span>
                    <strong className={`${tactileSlipIndexLive > 0.5 ? 'text-red-600' : 'text-neutral-900'}`}>
                      {(tactileSlipIndexLive * 100).toFixed(0)}%
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOUR-SECTION CORE ARCHITECTURE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* SECTION 1: REAL-TIME TELEMETRY & INGESTION MATRIX */}
            <div className="lg:col-span-6 bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
              <div className="border-b border-[#1A1A1A] pb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-indigo-600 animate-pulse" />
                  <h4 className="font-bold text-[#1A1A1A] tracking-tight text-sm font-serif uppercase">
                    1. Real-Time Telemetry & Sensory Ingestion Matrix
                  </h4>
                </div>
                <span className="text-[9px] font-mono font-bold bg-indigo-50 text-indigo-800 border border-indigo-300 px-2 py-0.5 uppercase">
                  RGB-D & Tactile Grid
                </span>
              </div>

              <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                Ingests high-frequency sensory frames at 200 Hz. Live feedback streams from the 7-DOF arm joint encoders, tactile pressure arrays, RGB-D point clouds, and IMU accelerometer sensors.
              </p>

              {/* 7-DOF Robotic Joint Encoders & Torques */}
              <div className="space-y-2 border border-neutral-200 bg-neutral-50/50 p-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-neutral-700 uppercase">
                    7-DOF Robot Joint Encoders & Dynamic Torques
                  </span>
                  <span className="text-[9px] font-mono text-neutral-500">Max Limit: 28.0 Nm</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {worldState.kinematicChains.map((joint) => {
                    const torqueRatio = Math.min(100, (joint.torqueNm / 28.0) * 100);
                    return (
                      <div key={joint.jointIndex} className="bg-white border border-neutral-300 p-2 font-mono text-[10px] space-y-1">
                        <div className="flex justify-between font-bold text-neutral-800">
                          <span>J{joint.jointIndex}</span>
                          <span className="text-indigo-700">{joint.torqueNm.toFixed(1)} Nm</span>
                        </div>
                        <div className="w-full bg-neutral-200 h-1.5">
                          <div
                            className={`h-full ${torqueRatio > 70 ? 'bg-red-500' : torqueRatio > 40 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                            style={{ width: `${torqueRatio}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] text-neutral-500">
                          <span>{(joint.angleRad * 57.3).toFixed(0)}°</span>
                          <span>{joint.tempC.toFixed(1)}°C</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dual Tactile Finger Sensors & Micro-slip Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-neutral-200 bg-white p-3 space-y-2 font-mono text-[10px]">
                  <div className="flex items-center justify-between border-b pb-1">
                    <strong className="text-neutral-900 uppercase">Left Finger Tactile Pad</strong>
                    <span className="text-emerald-700 font-bold">{(gripperForceLive / 2).toFixed(2)} N</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {[0.2, 0.4, 0.8, 0.3, 0.6, 0.9, 0.7, 0.4, 0.3, 0.5, 0.8, 0.2].map((v, i) => (
                      <div 
                        key={i} 
                        className="h-3.5 rounded-none border border-neutral-200"
                        style={{ backgroundColor: `rgba(79, 70, 229, ${v * (gripperForceLive / 10)})` }}
                      />
                    ))}
                  </div>
                  <div className="text-[8.5px] text-neutral-500 flex justify-between">
                    <span>Shear: 0.04</span>
                    <span>Slip: {tactileSlipIndexLive > 0.2 ? 'DETECTED' : 'NOMINAL'}</span>
                  </div>
                </div>

                <div className="border border-neutral-200 bg-white p-3 space-y-2 font-mono text-[10px]">
                  <div className="flex items-center justify-between border-b pb-1">
                    <strong className="text-neutral-900 uppercase">Right Finger Tactile Pad</strong>
                    <span className="text-emerald-700 font-bold">{(gripperForceLive / 2).toFixed(2)} N</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {[0.3, 0.5, 0.7, 0.4, 0.5, 0.9, 0.8, 0.3, 0.2, 0.6, 0.7, 0.3].map((v, i) => (
                      <div 
                        key={i} 
                        className="h-3.5 rounded-none border border-neutral-200"
                        style={{ backgroundColor: `rgba(79, 70, 229, ${v * (gripperForceLive / 10)})` }}
                      />
                    ))}
                  </div>
                  <div className="text-[8.5px] text-neutral-500 flex justify-between">
                    <span>Shear: 0.03</span>
                    <span>Contact: UNIFORM</span>
                  </div>
                </div>
              </div>

              {/* End-Effector 6-DOF Pose Matrix */}
              <div className="border border-neutral-200 bg-[#FCFAF7] p-2.5 font-mono text-[10px] flex flex-wrap justify-between items-center gap-2">
                <span className="font-bold text-neutral-700 uppercase">End-Effector Spatial Vector:</span>
                <span className="text-neutral-900 font-bold">X: 0.45m | Y: -0.10m | Z: 0.28m</span>
                <span className="text-indigo-700 font-bold">Roll: 0° | Pitch: 45° | Yaw: 15°</span>
              </div>
            </div>

            {/* SECTION 2: DIGITAL TWIN & DYNAMIC HYPERGRAPH */}
            <div className="lg:col-span-6 bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
              <div className="border-b border-[#1A1A1A] pb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-indigo-600 animate-pulse" />
                  <h4 className="font-bold text-[#1A1A1A] tracking-tight text-sm font-serif uppercase">
                    2. Digital Twin & Dynamic Hypergraph
                  </h4>
                </div>
                <span className="text-[9px] font-mono font-bold bg-[#1A1A1A] text-white px-2 py-0.5 uppercase">
                  WorldStateTensor
                </span>
              </div>

              <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                Maintains a synchronized spatial topology of segmented entities, bounding volumes, rack occupancy status, and relational causal hypergraph constraints.
              </p>

              {/* Dishware & Appliance Entity Selector */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">
                  Segmented Physical Objects in Workspace:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {worldState.entities.map(e => (
                    <button
                      key={e.id}
                      onClick={() => setSelectedEntityId(e.id)}
                      className={`p-2 text-left border transition cursor-pointer flex flex-col justify-between font-mono text-[9.5px] ${
                        selectedEntityId === e.id
                          ? 'bg-indigo-50 border-indigo-700 text-indigo-950 font-bold shadow-sm'
                          : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                      }`}
                    >
                      <span className="truncate">{e.label}</span>
                      <span className={`text-[8px] uppercase mt-1 ${e.fragilityIndex > 0.7 ? 'text-red-600 font-bold' : 'text-neutral-500'}`}>
                        {e.category} • Fragility: {(e.fragilityIndex * 100).toFixed(0)}%
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Entity Physical Parameters Card */}
              <div className="border border-neutral-300 bg-[#FCFAF7] p-3 space-y-2 font-mono text-[10.5px]">
                <div className="flex justify-between items-center border-b border-neutral-200 pb-1.5">
                  <strong className="text-neutral-900 font-serif text-xs uppercase">{selectedEntity.label}</strong>
                  <span className="bg-white border px-1.5 py-0.5 text-[9px] font-bold text-indigo-800 uppercase">
                    Status: {selectedEntity.graspStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-neutral-700 font-sans text-xs">
                  <div>
                    <span className="text-neutral-500 text-[10px] font-mono block">SPATIAL POSE (X, Y, Z)</span>
                    <strong className="font-mono text-neutral-900">[{selectedEntity.pose.join(', ')}] m</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] font-mono block">BOUNDING BOX (DX, DY, DZ)</span>
                    <strong className="font-mono text-neutral-900">[{selectedEntity.boundingBox.join(', ')}] m</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] font-mono block">MASS & FRICTION COEFF</span>
                    <strong className="font-mono text-neutral-900">{selectedEntity.massKg} kg (μ = {selectedEntity.frictionCoeff})</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] font-mono block">RECOMMENDED GRIP FORCE</span>
                    <strong className="font-mono text-indigo-700">{selectedEntity.recommendedGripForceN} N</strong>
                  </div>
                </div>
              </div>

              {/* Relational Causal Hypergraph Edges */}
              <div className="space-y-1.5 border-t border-neutral-200 pt-2 font-mono text-[10px]">
                <span className="font-bold text-neutral-600 uppercase block">Active Causal Relational Edges:</span>
                <div className="space-y-1">
                  {worldState.causalHypergraphEdges.map(edge => (
                    <div key={edge.id} className="bg-white border border-neutral-200 p-1.5 flex items-center justify-between">
                      <span className="text-neutral-800">
                        <code>{edge.source}</code> <strong className="text-indigo-600 font-bold mx-1">--[{edge.relation}]--&gt;</strong> <code>{edge.target}</code>
                      </span>
                      <span className="text-emerald-700 font-bold text-[9px]">Conf: {(edge.confidence * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 3: SIMULATION, VETO ENGINE & GOVERNANCE GATE */}
            <div className="lg:col-span-6 bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
              <div className="border-b border-[#1A1A1A] pb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600 animate-pulse" />
                  <h4 className="font-bold text-[#1A1A1A] tracking-tight text-sm font-serif uppercase">
                    3. Simulation, Veto Engine & Governance Gate
                  </h4>
                </div>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 border ${
                  vetoTriggered ? 'bg-red-100 text-red-800 border-red-300 animate-pulse' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {vetoTriggered ? '🛑 VETO ENGAGED' : '✓ GATES SECURE'}
                </span>
              </div>

              <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                Enforces strict Level A through Level D risk protocols. Level D (physical robotic motor trajectory) requires symbolic safety verification and Human-In-The-Loop (HITL) authorization token verification.
              </p>

              {/* Level A-D Governance Status Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
                <div className="bg-neutral-50 border border-neutral-300 p-2 text-center">
                  <span className="text-neutral-400 text-[8px] uppercase block">LEVEL A (LOW)</span>
                  <strong className="text-emerald-700 block mt-0.5">MEMORY INDEX</strong>
                  <span className="text-[8px] text-neutral-500">Auto-Pass</span>
                </div>
                <div className="bg-neutral-50 border border-neutral-300 p-2 text-center">
                  <span className="text-neutral-400 text-[8px] uppercase block">LEVEL B (MODERATE)</span>
                  <strong className="text-emerald-700 block mt-0.5">ROUTING & TEMP</strong>
                  <span className="text-[8px] text-neutral-500">Auto-Pass</span>
                </div>
                <div className="bg-neutral-50 border border-neutral-300 p-2 text-center">
                  <span className="text-neutral-400 text-[8px] uppercase block">LEVEL C (HIGH)</span>
                  <strong className="text-indigo-700 block mt-0.5">TOOL & WORKFLOW</strong>
                  <span className="text-[8px] text-neutral-500">Symbolic Check</span>
                </div>
                <div className={`p-2 text-center border-2 ${
                  isHitlAuthorized ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-500'
                }`}>
                  <span className="text-neutral-400 text-[8px] uppercase block">LEVEL D (CRITICAL)</span>
                  <strong className={isHitlAuthorized ? 'text-emerald-800 block mt-0.5' : 'text-red-800 block mt-0.5'}>
                    PHYSICAL ROBOT
                  </strong>
                  <span className="text-[8px] text-neutral-600 font-bold">{isHitlAuthorized ? 'HITL TOKEN OK' : 'LOCKED 🛑'}</span>
                </div>
              </div>

              {/* Veto Alert Box if Triggered */}
              {vetoTriggered && (
                <div className="bg-red-50 border-2 border-red-500 p-3 text-red-900 font-mono text-xs flex items-start gap-2 animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-black uppercase text-red-800">AUTOMATIC VETO SAFETY ENGAGED:</strong>
                    <p className="mt-0.5 text-[11px] leading-relaxed font-sans">{vetoReasonText}</p>
                  </div>
                </div>
              )}

              {/* HITL Operator Authorization Token Controller */}
              <div className="border border-neutral-300 bg-[#FCFAF7] p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-neutral-800 flex items-center gap-1.5">
                    {isHitlAuthorized ? <Lock className="w-3.5 h-3.5 text-emerald-700" /> : <Unlock className="w-3.5 h-3.5 text-red-600" />}
                    Human-in-the-Loop (HITL) Authorization Token:
                  </span>
                  <button
                    onClick={() => {
                      setIsHitlAuthorized(!isHitlAuthorized);
                      onLogEvent(`[GOVERNANCE] Operator toggled HITL authorization to ${!isHitlAuthorized}`, 'interaction');
                    }}
                    className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase transition border cursor-pointer ${
                      isHitlAuthorized ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-red-600 text-white border-red-700'
                    }`}
                  >
                    {isHitlAuthorized ? 'REVOKE HITL TOKEN' : 'GRANT HITL TOKEN'}
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={hitlAuthToken}
                    onChange={(e) => setHitlAuthToken(e.target.value)}
                    placeholder="Enter supervisor authorization signature..."
                    className="flex-1 p-2 text-xs font-mono border border-neutral-300 bg-white"
                  />
                  <button
                    onClick={() => {
                      harness.governance.registerAuthToken(hitlAuthToken);
                      setIsHitlAuthorized(true);
                      onLogEvent(`[GOVERNANCE] Registered token: ${hitlAuthToken}`, 'info');
                    }}
                    className="bg-[#1A1A1A] hover:bg-neutral-800 text-white text-[10px] font-mono font-bold uppercase px-3 py-1 cursor-pointer"
                  >
                    Sign Token
                  </button>
                </div>
              </div>

              {/* Governance Audit Log Terminal */}
              <div className="bg-[#121212] text-neutral-300 p-3 border-2 border-[#1A1A1A] font-mono text-[10px] h-[120px] overflow-y-auto space-y-1">
                <span className="text-[9px] font-bold text-indigo-400 border-b border-neutral-800 pb-1 mb-1 block uppercase">
                  🛡️ GOVERNANCE GATE AUDIT TRAIL
                </span>
                {governanceAuditLogs.length === 0 ? (
                  <div className="text-neutral-500 italic py-4 text-center">Awaiting execution audit checks...</div>
                ) : (
                  governanceAuditLogs.map((log, i) => (
                    <div key={i} className={log.includes('🛑') ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* SECTION 4: REALITY ANCHOR & SUBCONSCIOUS LEARNING FEED */}
            <div className="lg:col-span-6 bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
              <div className="border-b border-[#1A1A1A] pb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-600 animate-pulse" />
                  <h4 className="font-bold text-[#1A1A1A] tracking-tight text-sm font-serif uppercase">
                    4. Reality Anchor & Subconscious Learning Feed
                  </h4>
                </div>
                <span className="text-[9px] font-mono font-bold bg-indigo-50 text-indigo-800 border border-indigo-300 px-2 py-0.5 uppercase">
                  Latent Dynamics Engine
                </span>
              </div>

              <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                The SubconsciousEngine operates in the background, mining 14,000+ historical manipulation trajectories to extract optimal friction damping, micro-torque priors, and continuous reality error calibration.
              </p>

              {/* Subconscious Intuition Stream */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">
                  Subconscious Latent Trajectory Priors (Background Thread):
                </span>
                
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {subconsciousFeed.map((sub, idx) => (
                    <div key={idx} className="bg-neutral-50 border border-neutral-300 p-2.5 font-mono text-[10px] space-y-1">
                      <div className="flex justify-between items-center">
                        <strong className="text-indigo-900 font-bold">{sub.patternId}</strong>
                        <span className="text-emerald-700 font-bold">Prior Confidence: {(sub.priorConfidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-neutral-600 text-[9px]">
                        <span>Samples: {sub.historicalSampleCount.toLocaleString()}</span>
                        <span>Micro-Damping: {sub.recommendedMicroDamping}</span>
                        <span>ΔTorque: [{sub.latentTorqueCorrectionNm.slice(0, 3).join(', ')}] Nm</span>
                      </div>
                      {sub.anomalyWarning && (
                        <div className="text-amber-700 text-[9px] font-bold bg-amber-50 p-1 border border-amber-200">
                          ⚠️ {sub.anomalyWarning}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Reality Anchor Error Calibration & CAD vs Reality Comparison */}
              <div className="border border-neutral-300 bg-[#FCFAF7] p-3 space-y-2">
                <div className="flex justify-between items-center border-b pb-1 font-mono text-[10px]">
                  <strong className="text-neutral-800 uppercase">CAD vs Measured Reality Discrepancy Index:</strong>
                  <span className="font-extrabold text-indigo-700">1.85% Error (Convergence Pass)</span>
                </div>

                <div className="space-y-1 text-xs font-sans">
                  <div className="flex justify-between font-mono text-[10.5px]">
                    <span className="text-neutral-500">Planned CAD Placement:</span>
                    <span className="font-bold text-neutral-900">DWG-9021 Lower/Upper Rack Slot Matrix</span>
                  </div>
                  <div className="flex justify-between font-mono text-[10.5px]">
                    <span className="text-neutral-500">Physical Point Cloud Deviation:</span>
                    <span className="font-bold text-emerald-800">ΔX: 0.8mm | ΔY: 0.5mm | ΔAngle: 0.4°</span>
                  </div>
                </div>

                {/* Mini Error Sparkline */}
                <div className="pt-1.5">
                  <span className="text-[9px] font-mono text-neutral-500 block mb-1">Closed-Loop Discrepancy Trend (% Error over Steps):</span>
                  <div className="flex items-end gap-1 h-8 bg-white p-1 border border-neutral-200">
                    {realityErrorHistory.map((item, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-indigo-600 transition-all"
                        style={{ height: `${Math.min(100, item.errorPct * 40)}%` }}
                        title={`Step ${item.step}: ${item.errorPct}% error`}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* LIVE EXECUTION LOGS TERMINAL */}
          <div className="bg-[#121212] text-neutral-200 p-4 border-2 border-[#1A1A1A] font-mono text-[10.5px] h-[180px] overflow-y-auto flex flex-col relative shadow-[inset_0px_2px_8px_rgba(0,0,0,0.8)]">
            <span className="text-[9.5px] font-bold text-indigo-400 border-b border-neutral-800 pb-1 mb-1.5 flex justify-between uppercase">
              <span>⚡ OMEGA Physical-AI Execution Terminal & Sensor Loop</span>
              <span className="text-emerald-400 font-bold">{is22StepRunning ? 'RUNNING AUTONOMOUSLY' : 'STANDBY'}</span>
            </span>

            {executionLogs.length === 0 ? (
              <div className="text-neutral-500 italic my-auto text-center">
                System ready. Click "AUTO-RUN 22-STEP HARNESS" or "STEP FORWARD" to start robotic dish manipulation telemetry.
              </div>
            ) : (
              <div className="space-y-1">
                {executionLogs.map((log, idx) => (
                  <div key={idx} className={`${
                    log.includes('PERCEPTION') ? 'text-amber-400' :
                    log.includes('DIGITAL_TWIN') ? 'text-cyan-400' :
                    log.includes('GOVERNANCE') ? 'text-indigo-400 font-bold' :
                    log.includes('ROBOT_ACTUATION') ? 'text-emerald-400 font-bold' :
                    log.includes('REALITY_ANCHOR') ? 'text-yellow-300' : 'text-neutral-300'
                  } leading-tight`}>
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* SUB-VIEW 2: DISHWASHER OPERATOR STEPS GUIDE */}
      {hardwareSubTab === 'operator_guide' && (
        <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-6">
          <div className="border-b border-[#1A1A1A] pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-widest block">
                STANDARD OPERATING PROCEDURE (SOP) • ROBOTIC DISHWASHER LOADING
              </span>
              <h3 className="text-lg font-serif font-black uppercase text-neutral-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Step-by-Step Operator Guide: Loading a Dishwasher by a Robot
              </h3>
            </div>
            <span className="text-[9.5px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 font-bold uppercase">
              Verified SOP v2.6
            </span>
          </div>

          <p className="text-xs text-neutral-700 leading-relaxed font-sans">
            This operational guide instructs engineers and robotic technicians on how to execute safe, zero-damage dishwasher loading using the OMEGA Physical-AI Harness. Follow each phase sequentially to ensure compliance with Level A–D Governance Gates.
          </p>

          {/* 5 OPERATIONAL PHASES TABLE */}
          <div className="space-y-4">
            {[
              {
                phase: 'PHASE 1: PERCEPTION & SENSOR CALIBRATION (Steps 1–4)',
                icon: Eye,
                color: 'text-amber-700 bg-amber-50 border-amber-200',
                items: [
                  '1. Power on the RGB-D camera and dual-finger tactile arrays. Verify 200 Hz streaming frequency.',
                  '2. Run bilateral noise filtering on the point cloud to eliminate specular reflections from glazed ceramic and wet glassware.',
                  '3. Execute 3D semantic segmentation to identify dinner plates, crystal wine glasses, cereal bowls, cutlery, and dishwasher rack handles.',
                  '4. Construct the Digital Twin WorldStateTensor and map spatial clearance vectors to the Causal Hypergraph.'
                ]
              },
              {
                phase: 'PHASE 2: DISHWASHER PREPARATION & RACK EXTENSION (Steps 5–8)',
                icon: Box,
                color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
                items: [
                  '1. Query SubconsciousEngine for historical rack glide torque limits (nominal: 16.5 Nm).',
                  '2. Verify Level C Governance Gate authorization for kitchen boundary clearance.',
                  '3. Command 7-DOF arm to engage the lower rack handle tab with a smooth 18.0 N pull force.',
                  '4. Extend lower rack 380mm forward on glide tracks until the mechanical bump stop engages.'
                ]
              },
              {
                phase: 'PHASE 3: DINNER PLATE PICK & LOWER RACK INSERTION (Steps 9–13)',
                icon: Zap,
                color: 'text-emerald-700 bg-emerald-50 border-emerald-300',
                items: [
                  '1. Generate 7-DOF trajectory to align gripper fingers with the plate upper rim at a 15° approach angle.',
                  '2. Execute MuJoCo forward-dynamics pass to verify plate stability against tines deflection.',
                  '3. Verify Level D Governance Gate HITL authorization token (HITL_OVERRIDE_AUTH_DEV).',
                  '4. Command physical gripper with 11.5 N gentle clamping force, lift 120mm, and seat plate into Lower Rack Slot #4.',
                  '5. Check tactile shear sensors upon release to confirm plate is resting securely against tines.'
                ]
              },
              {
                phase: 'PHASE 4: ULTRA-FRAGILE STEMWARE & SILVERWARE HANDLING (Steps 14–17)',
                icon: Shield,
                color: 'text-purple-700 bg-purple-50 border-purple-200',
                items: [
                  '1. Restrict maximum gripper force to 3.8 N ± 0.2 N for fragile crystal wine glasses (fracture limit: 5.2 N).',
                  '2. Execute soft-pinch grasp on glass stem with high micro-damping (0.085) to prevent resonant vibrations.',
                  '3. Invert glass 180° and dock stem into Upper Rack Silicone Clasp #2.',
                  '4. Deposit silverware cutlery into the cutlery basket with 14.0 N grip, and angle cereal bowls on upper tines.'
                ]
              },
              {
                phase: 'PHASE 5: SPRAY ARM CLEARANCE & REALITY ANCHOR VERIFICATION (Steps 18–22)',
                icon: Award,
                color: 'text-blue-700 bg-blue-50 border-blue-200',
                items: [
                  '1. Execute 360° virtual and optical rotation of both upper and lower spray arms.',
                  '2. Enforce strict ≥ 35mm physical clearance threshold (live observed clearance: 52.0mm).',
                  '3. Slide lower rack closed and engage door latch mechanism with 12.0 N smooth force.',
                  '4. Run CAD-to-Reality metrology point cloud comparison. Verify discrepancy is under 2.0% threshold (actual: 1.85%).',
                  '5. Update SubconsciousEngine trajectory prior weights and publish cryptographic compliance record.'
                ]
              }
            ].map((phase, pIdx) => {
              const Icon = phase.icon;
              return (
                <div key={pIdx} className="border border-neutral-300 bg-white p-4 space-y-3">
                  <div className={`p-2 border flex items-center gap-2 font-mono text-xs font-bold uppercase ${phase.color}`}>
                    <Icon className="w-4 h-4" />
                    <span>{phase.phase}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-neutral-700 font-sans pl-2">
                    {phase.items.map((item, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-2 leading-relaxed">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* CRITICAL SAFETY CHECKLIST */}
          <div className="bg-amber-50/60 border-2 border-amber-400 p-4 space-y-2 text-xs">
            <h5 className="font-mono font-bold text-amber-900 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Safety Checklist Before Physical Run:
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-amber-950 font-sans">
              <div className="flex items-center gap-2 bg-white/80 p-2 border border-amber-200">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>HITL Authorization signature token verified in Governance Gate.</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2 border border-amber-200">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fragile glassware force threshold strictly capped at 4.5 N.</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2 border border-amber-200">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Spray arm clearance zone checked with 360° laser sweep.</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2 border border-amber-200">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tactile micro-slip feedback loop active at 200 Hz.</span>
              </div>
            </div>
          </div>

          {/* OMEGA 16-STAGE PHYSICAL-AI CLOSED LOOP PIPELINE */}
          <div className="bg-[#0F172A] text-white border-2 border-[#1A1A1A] p-5 space-y-4 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <span className="font-mono text-xs font-black uppercase text-cyan-300 tracking-wider">
                  THE COMPLETE 16-STAGE OMEGA PHYSICAL-AI CLOSED LOOP
                </span>
              </div>
              <span className="text-[9px] font-mono bg-indigo-900 text-indigo-200 border border-indigo-500 px-2 py-0.5 font-bold uppercase">
                Action-Conditioned World Model
              </span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 font-mono text-[10px] text-cyan-200 overflow-x-auto leading-relaxed">
              <span className="text-amber-400 font-bold">PERCEIVE</span> → <span className="text-cyan-400 font-bold">REPRESENT</span> → <span className="text-blue-400 font-bold">UNDERSTAND</span> → <span className="text-indigo-400 font-bold">PREDICT</span> → <span className="text-purple-400 font-bold">IMAGINE</span> → <span className="text-fuchsia-400 font-bold">PLAN</span> → <span className="text-rose-400 font-bold">VERIFY</span> → <span className="text-red-400 font-bold">ACT</span> → <span className="text-orange-400 font-bold">OBSERVE</span> → <span className="text-yellow-400 font-bold">COMPARE</span> → <span className="text-emerald-400 font-bold">REMEMBER</span> → <span className="text-teal-400 font-bold">REFLECT</span> → <span className="text-sky-400 font-bold">IMPROVE</span> → <span className="text-blue-300 font-bold">REPRODUCE</span> → <span className="text-indigo-300 font-bold">DEPLOY</span> → <span className="text-purple-300 font-bold">REPEAT</span>
            </div>

            {/* Matrix of OMEGA Module Mapping to Physical-AI Architecture */}
            <div className="space-y-2">
              <h5 className="font-mono text-[11px] font-bold text-slate-200 uppercase tracking-wide">
                Where Existing OMEGA Modules Fit in the Physical-AI Architecture:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-[10px]">
                {[
                  { omega: 'Mission Intent', role: 'Human instruction ("Load the dishwasher")', tab: 'Harness Console / System' },
                  { omega: 'Ontology', role: 'Semantic meaning of objects & actions', tab: 'Ontology Graph / Digital Twin' },
                  { omega: 'Embeddings', role: 'Similar historical experiences & latent priors', tab: 'Memory / Subconscious' },
                  { omega: 'Hypergraph', role: 'Active spatial & causal relationships', tab: 'Hypergraph / Digital Twin' },
                  { omega: 'State Tensor', role: 'Dynamic 7-DOF arm, tactile & object states', tab: 'Hardware & Device Layers' },
                  { omega: 'World Model', role: 'Physical state + action-conditioned rollout', tab: 'Spatial 3D / Simulation' },
                  { omega: 'Vision & Point Cloud', role: 'RGB-D semantic segmentation & depth', tab: 'Spatial 3D / Wrist Cam' },
                  { omega: 'Audio & Tactile', role: 'Acoustic resonance & GelSight 200 Hz forces', tab: 'Hardware Layers / Sensors' },
                  { omega: 'Signal Processing', role: 'Raw sensor bilateral conditioning & sync', tab: 'Sensory Ingestion Section' },
                  { omega: 'SLLM Reasoning', role: 'Optimal dish sequence determination', tab: 'Server-side Gemini / SLLM' },
                  { omega: 'Symbolic VETO Gate', role: 'Joint torque (<28Nm) & glass clamp limits', tab: 'Governance Gate' },
                  { omega: 'Simulation Engine', role: 'Counterfactual reachability & clearance checks', tab: 'Simulation / MuJoCo' },
                  { omega: 'Reality Anchor', role: 'CAD-to-Point-Cloud RMSE error validation', tab: 'Reality Anchor Section' },
                  { omega: 'Subconscious Engine', role: 'Background hypothesis & micro-damping tuning', tab: 'Subconscious Feed' },
                  { omega: 'EIG Active Learning', role: 'Information-gain guided next trial exploration', tab: 'Discovery Planner / EIG' },
                  { omega: 'Reproducibility Guard', role: 'Cryptographic compliance ledger & freeze', tab: 'Audit Trail / Governance' }
                ].map((row, rIdx) => (
                  <div key={rIdx} className="bg-slate-800/80 border border-slate-700 p-2 flex flex-col justify-between gap-1">
                    <div className="flex items-center justify-between text-cyan-300">
                      <span className="font-bold">{row.omega}</span>
                      <span className="text-[8.5px] px-1.5 py-0.2 bg-slate-900 border border-slate-700 text-slate-300">{row.tab}</span>
                    </div>
                    <span className="text-slate-300 font-sans text-[10px] leading-tight">{row.role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-950/60 border border-indigo-600/50 p-3 text-[11px] font-sans text-indigo-200 space-y-1">
              <span className="font-mono font-bold text-amber-300 text-xs block">
                ⭐ OMEGA SCIENTIFIC TRUTH DIRECTIVE:
              </span>
              <p className="leading-relaxed">
                "OMEGA does not learn merely because an LLM generated a better answer. It learns when a proposed change produces a reproducible improvement against reality."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: PHYSICAL INSTRUMENTS & SENSORS */}
      {hardwareSubTab === 'instruments' && (
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
                    { id: 'robotics', label: '🦾 ROBOTICS' },
                    { id: 'microscopy', label: '🔬 MICROSCOPY' },
                    { id: 'spectroscopy', label: '📊 SPECTRA' },
                    { id: 'thermal_mechanical', label: '🔥 THERMAL/MECH' },
                    { id: 'biotech', label: '🧬 GENOME/CELL' }
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
        </div>
      )}

      {/* SUB-VIEW 4: MULTI-DOMAIN CLOSED LOOPS */}
      {hardwareSubTab === 'workflows' && (
        <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] rounded-none text-left flex flex-col gap-4">
          <div className="border-b border-[#1A1A1A] pb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Beaker className="w-5 h-5 text-indigo-600" />
              <h4 className="font-bold text-[#1A1A1A] tracking-tight text-sm font-serif uppercase">
                Closed-Loop Lab Workflows & Autonomous Run Cycles
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
      )}

      {/* SUB-VIEW 5: MASTER VALIDATION SANDBOX */}
      {hardwareSubTab === 'sandbox' && (
        <MasterTestSandbox onLogEvent={onLogEvent} />
      )}

        </div>
        {/* END OF RIGHT PANEL */}

      </div>
      {/* END OF DUAL PANEL WRAPPER */}

      {/* COMMAND DECK MODAL / DRAWER (Screenshot 2 Matching) */}
      {showCommandDeckModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border-2 border-neutral-700 text-white w-full max-w-5xl max-h-[85vh] overflow-y-auto p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                <h3 className="font-serif font-black uppercase text-sm tracking-wider">
                  OMEGA-CORE SYSTEM COMMAND DECK [39 LABS CONNECTED]
                </h3>
              </div>
              <button 
                onClick={() => setShowCommandDeckModal(false)}
                className="text-neutral-400 hover:text-white p-1 hover:bg-neutral-800 cursor-pointer font-mono text-xs font-bold"
              >
                [ESC / CLOSE ✕]
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
              {[
                { id: 'physical_ai', label: '01. PHYSICAL-AI HARNESS', status: 'ACTIVE', color: 'text-emerald-400' },
                { id: 'spatial_3d', label: '02. 3D SPATIAL KINEMATICS', status: 'ACTIVE', color: 'text-emerald-400' },
                { id: 'stress_bench', label: '03. DISHWASHER_TEST_001', status: 'PASS', color: 'text-emerald-400' },
                { id: 'forecast_vec', label: '04. ROBOT FORECAST VECTOR', status: 'ONLINE', color: 'text-indigo-400' },
                { id: 'gelsight', label: '05. GELSIGHT TACTILE ARRAY', status: '200Hz', color: 'text-emerald-400' },
                { id: 'mujoco', label: '06. MUJOCO PHYSICS ENGINE', status: 'CALIBRATED', color: 'text-emerald-400' },
                { id: 'realsense', label: '07. REALSENSE RGB-D LIDAR', status: '0.15mm', color: 'text-cyan-400' },
                { id: 'metrology', label: '08. TUB METROLOGY SCANNER', status: 'ONLINE', color: 'text-amber-400' },
                { id: 'governance', label: '09. LEVEL A-D GOVERNANCE', status: 'ARMED', color: 'text-emerald-400' },
                { id: 'hitl_auth', label: '10. HITL TOKEN OVERRIDE', status: 'SIGNED', color: 'text-emerald-400' },
                { id: 'subconscious', label: '11. SUBCONSCIOUS PRIORS', status: 'STREAMING', color: 'text-purple-400' },
                { id: 'colony', label: '12. COLONY.AI AGENT DECK', status: 'ONLINE', color: 'text-neutral-300' },
                { id: 'radiant', label: '13. RADIANT PHYSICS LAB', status: 'ONLINE', color: 'text-neutral-300' },
                { id: 'aromea', label: '14. AROMEA SENSORY LAB', status: 'ONLINE', color: 'text-neutral-300' },
                { id: 'stoned', label: '15. STONED TELEMETRY LAB', status: 'ONLINE', color: 'text-neutral-300' },
                { id: 'quantum', label: '16. QUANTUM COMPUTER LAB', status: 'ONLINE', color: 'text-neutral-300' },
                { id: 'finance', label: '17. QUANT FINANCE ENGINE', status: 'ONLINE', color: 'text-neutral-300' },
                { id: 'materials', label: '18. ADVANCED MATERIALS LAB', status: 'ONLINE', color: 'text-neutral-300' },
                { id: 'drugs', label: '19. DRUG THERAPY DISCOVERY', status: 'ONLINE', color: 'text-neutral-300' },
                { id: 'neuro', label: '20. NEUROSCIENCE SYNAPSE', status: 'ONLINE', color: 'text-neutral-300' },
                { id: 'weather', label: '21. METEOROLOGY ATMOSPHERE', status: 'ONLINE', color: 'text-neutral-300' },
                { id: 'hypergraph', label: '22. CAUSAL HYPERGRAPH LAB', status: 'ONLINE', color: 'text-neutral-300' },
                { id: 'manifold', label: '23. TOPOLOGICAL MANIFOLD', status: 'ONLINE', color: 'text-neutral-300' },
                { id: 'ruliad', label: '24. RULIAD MULTICOMPUTATION', status: 'ONLINE', color: 'text-neutral-300' },
              ].map((btn) => (
                <div 
                  key={btn.id} 
                  onClick={() => setShowCommandDeckModal(false)}
                  className="bg-neutral-900 border border-neutral-800 p-2.5 flex items-center justify-between hover:border-neutral-500 cursor-pointer transition"
                >
                  <span className="font-bold text-[10.5px] truncate">{btn.label}</span>
                  <span className={`text-[9px] font-bold ${btn.color}`}>{btn.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CSV DATA INSPECTOR & MULTI-SENSOR ROW VIEWER MODAL */}
      <CsvDataInspectorModal
        isOpen={isCsvInspectorOpen}
        onClose={() => setIsCsvInspectorOpen(false)}
        initialTab={csvInspectorTab}
        onLogEvent={onLogEvent}
        onOpenPipeline={() => {
          setIsCsvInspectorOpen(false);
          setHardwareSubTab('world_state_pipeline');
          onLogEvent("[PIPELINE] Opened 3D World State Pipeline from Data Inspector.", "physics");
        }}
      />

    </div>
  );
}
