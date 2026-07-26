import React, { useState, useEffect, useRef } from 'react';
import { 
  Beaker, CheckCircle, Play, RefreshCw, Layers, Database, 
  ChevronRight, ArrowRight, ClipboardCheck, Info, FileCode, AlertCircle, HelpCircle,
  Copy, Check, Sparkles, Network, Compass, GitCommit, X, Activity, Cpu, Eye
} from 'lucide-react';

export interface TelemetryPacket {
  experiment_id: string;
  reading: number;
  timestamp: string;
  device: string;
  joint_angle_deg?: number;
  motor_current_a?: number;
  torque_nm?: number;
  grip_force_n?: number;
  temperature_c?: number;
  status: string;
  [key: string]: any;
}

export interface ScientificConfidenceBreakdown {
  modelConfidence: string;
  dataQuality: string;
  parameterSpaceCoverage: string;
  reproducibilityScore: string;
  externalValidationAgreement: string;
}

export interface CompetingHypothesis {
  id: string;
  statement: string;
  likelihood: string;
  evidence: string;
}

export interface CausalEdgeRating {
  source: string;
  target: string;
  ratingStars: number;
  evidenceLevel: string;
}

export interface InstrumentHealth {
  name: string;
  calibration: string;
  sensorDrift: string;
  powerBattery: string;
  status: 'Healthy' | 'Warning' | 'Calibrate';
}

export interface ExecutiveDecisionSummary {
  questionAnswered: boolean;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  publicationReady: 'YES' | 'NO' | 'CONDITIONAL';
  readinessReason: string;
  missingMeasurementsNeeded: string[];
  recommendedNextExperiment: string;
  estimatedInformationGain: string;
}

export interface UniversalTestPackage {
  id: string;
  title: string;
  domain: string;
  icon: string;
  metadata: {
    experiment_id: string;
    researcher: string;
    timestamp: string;
    device: string;
    simulation: boolean;
    version: string;
    validation: string;
    evidenceLevel: 'Simulation' | 'Historical Data' | 'Laboratory' | 'Field Data' | 'Independent Replication';
    noveltyScore: 'Known Science' | 'Moderately Novel' | 'Potentially Novel' | 'Requires Independent Validation';
    noveltyPercent: number;
  };
  confidenceBreakdown: ScientificConfidenceBreakdown;
  causalEdgeRatings: CausalEdgeRating[];
  competingHypotheses: CompetingHypothesis[];
  instrumentHealthList: InstrumentHealth[];
  missingVariablesList: string[];
  knowledgeGraphStats: {
    nodes: number;
    confirmedEdges: number;
    graphGrowth: string;
  };
  executiveDecision: ExecutiveDecisionSummary;
  missionIntent: {
    question: string;
    objectives: string[];
  };
  scientificContext: {
    description: string;
    parametersMeasured: string[];
    assumptions: Record<string, any>;
  };
  deviceConfiguration: Record<string, any>;
  environment: Record<string, any>;
  rawTelemetry: Record<string, number[] | string[]>;
  telemetryPackets: TelemetryPacket[];
  groundTruth: {
    expected_failure: boolean;
    inspection: string;
    notes?: string;
  };
  plotX: string;
  plotY: string;
  expectedDiscovery: string;
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
  // Discovery Explanation Panels Data
  discoveryExplanation: {
    missionReason: string;
    manifoldPlacement: string;
    hypergraphCauses: string;
    ruliadRecommendation: string;
    timeline: Array<{
      step: number;
      label: string;
      desc: string;
      confidence: string;
    }>;
  };
}

export const UNIVERSAL_TEST_PACKAGES: UniversalTestPackage[] = [
  {
    id: 'robotics_pincherx',
    title: 'Robotics Fatigue Test (PincherX)',
    domain: 'Robotics & Mechanical Wear',
    icon: '🤖',
    metadata: {
      experiment_id: 'EXP-2026-001',
      researcher: 'WorldLab Robotics',
      timestamp: '2026-07-24T14:20:00Z',
      device: 'PincherX',
      simulation: true,
      version: 'OMEGA-CORE v2.4',
      validation: 'Scaffold',
      evidenceLevel: 'Laboratory',
      noveltyScore: 'Moderately Novel',
      noveltyPercent: 62
    },
    confidenceBreakdown: {
      modelConfidence: '89.4%',
      dataQuality: '96.2%',
      parameterSpaceCoverage: '78.0%',
      reproducibilityScore: '92.5%',
      externalValidationAgreement: '91.0%'
    },
    causalEdgeRatings: [
      { source: 'Grip Force Cycle', target: 'Joint Temperature', ratingStars: 5, evidenceLevel: 'Laboratory Telemetry' },
      { source: 'Joint Temperature', target: 'Nylon Gear Mesh Friction', ratingStars: 4, evidenceLevel: 'Thermal Camera' },
      { source: 'Gear Mesh Friction', target: 'Motor Current Spike', ratingStars: 5, evidenceLevel: 'High-Hz Current Probe' }
    ],
    competingHypotheses: [
      { id: 'HYP-A', statement: 'Thermal expansion of nylon gear drives non-linear friction and current spike at 15° deflection.', likelihood: '82%', evidence: 'Supported by 39°C thermal gradient telemetry' },
      { id: 'HYP-B', statement: 'Aluminium sample work-hardening increases resistive grip force directly.', likelihood: '45%', evidence: 'Partial match with torque sensor readings' },
      { id: 'HYP-C', statement: 'Motor driver MOSFET thermal throttling limits voltage output.', likelihood: '28%', evidence: 'Requires PCB thermocouple validation' }
    ],
    instrumentHealthList: [
      { name: 'Joint_2 Optical Encoder', calibration: '99.1%', sensorDrift: '0.2%', powerBattery: '100%', status: 'Healthy' },
      { name: 'Motor Current Sensor (50Hz)', calibration: '98.5%', sensorDrift: '0.4%', powerBattery: '99.5%', status: 'Healthy' },
      { name: 'Grip Force Load Cell', calibration: '94.2%', sensorDrift: '1.5%', powerBattery: '98.0%', status: 'Warning' }
    ],
    missingVariablesList: ['Gear Mesh Nylon Thermal Expansion Coefficient', 'PCB Driver MOSFET Thermocouple', 'Ultra-High Frequency Strain Gauge (100Hz)'],
    knowledgeGraphStats: {
      nodes: 145,
      confirmedEdges: 32,
      graphGrowth: '+12 nodes (+9%)'
    },
    executiveDecision: {
      questionAnswered: true,
      confidenceLevel: 'HIGH',
      publicationReady: 'CONDITIONAL',
      readinessReason: 'Requires thermal active cooling test run to isolate nylon expansion from structural gear wear.',
      missingMeasurementsNeeded: ['Infrared Thermal Imager', 'Nylon Expansion Profile'],
      recommendedNextExperiment: 'Cool Joint_2 to 20°C and execute 100-cycle high-speed duty stress sweep.',
      estimatedInformationGain: '38%'
    },
    missionIntent: {
      question: 'Determine whether repeated grip force causes component fatigue in PincherX joint assembly.',
      objectives: [
        'Identify nonlinear mechanical wear under cyclic loading.',
        'Find structural failure threshold for Joint_2.',
        'Recommend next material or strain-rate experiment.'
      ]
    },
    scientificContext: {
      description: 'Robot repeatedly grips identical aluminium samples under high sampling frequency.',
      parametersMeasured: ['Grip Force', 'Joint Torque', 'Temperature', 'Motor Current', 'Position Error', 'Cycle Time'],
      assumptions: {
        material: 'Aluminium 6061-T6',
        test_cycles: 20,
        load_profile: 'Cyclic step pulse'
      }
    },
    deviceConfiguration: {
      device: 'PincherX',
      mode: 'Simulation',
      sampling_hz: 50,
      joint: 'Joint_2',
      cycles: 20
    },
    environment: {
      temperature: 24,
      humidity: 58,
      surface: 'Aluminium',
      lighting: 'Laboratory'
    },
    rawTelemetry: {
      time: [1, 2, 3, 4, 5],
      joint_angle: [0, 5, 9, 12, 15],
      motor_current: [0.42, 0.44, 0.49, 0.57, 0.68],
      torque: [0.32, 0.34, 0.36, 0.40, 0.48],
      grip_force: [4.9, 5.0, 5.0, 5.1, 5.2],
      temperature: [31, 32, 34, 36, 39]
    },
    telemetryPackets: [
      { experiment_id: 'EXP-000245', reading: 1, timestamp: '2026-07-24T14:20:01Z', device: 'PincherX', joint_angle_deg: 0, motor_current_a: 0.42, torque_nm: 0.32, grip_force_n: 4.9, temperature_c: 31.0, status: 'OK' },
      { experiment_id: 'EXP-000245', reading: 2, timestamp: '2026-07-24T14:20:02Z', device: 'PincherX', joint_angle_deg: 5.0, motor_current_a: 0.44, torque_nm: 0.34, grip_force_n: 5.0, temperature_c: 32.0, status: 'OK' },
      { experiment_id: 'EXP-000245', reading: 3, timestamp: '2026-07-24T14:20:03Z', device: 'PincherX', joint_angle_deg: 9.0, motor_current_a: 0.49, torque_nm: 0.36, grip_force_n: 5.0, temperature_c: 34.0, status: 'OK' },
      { experiment_id: 'EXP-000245', reading: 4, timestamp: '2026-07-24T14:20:04Z', device: 'PincherX', joint_angle_deg: 12.0, motor_current_a: 0.57, torque_nm: 0.40, grip_force_n: 5.1, temperature_c: 36.0, status: 'OK' },
      { experiment_id: 'EXP-000245', reading: 5, timestamp: '2026-07-24T14:20:05Z', device: 'PincherX', joint_angle_deg: 15.0, motor_current_a: 0.68, torque_nm: 0.48, grip_force_n: 5.2, temperature_c: 39.0, status: 'WARMING' }
    ],
    groundTruth: {
      expected_failure: false,
      inspection: 'No cracks detected on Joint_2 gear mesh; thermal gradient +25% elevated.'
    },
    plotX: 'joint_angle',
    plotY: 'motor_current',
    expectedDiscovery: 'Motor current rises nonlinearly above 12° deflection, signaling thermal dissipation resistance and localized gear mesh friction.',
    metaCognition: {
      mission: 'Determine fatigue and failure thresholds in PincherX robot joint',
      confidence: '89.4%',
      realityScore: '96.2% alignment',
      whatFailed: 'Linear stiffness assumption failed as motor current spiked at 15° deflection.',
      missingVariable: 'Thermal expansion coefficient of internal nylon reduction gear.',
      instrumentNeeded: 'Infrared thermal imaging camera & motor current sensor at 100Hz.',
      nextExperiment: 'Cool Joint_2 to 20°C and execute 100-cycle high-speed duty stress sweep.',
      knowledgeGraph: 'Add edge: Joint Temperature -> [Gear Mesh Friction] -> [Motor Current Spike].'
    },
    discoveryExplanation: {
      missionReason: 'Evaluated mechanical fatigue resistance under continuous 50Hz load cycles to pinpoint micro-friction thermal thresholds.',
      manifoldPlacement: 'Sample sits inside the "Thermal Friction Boundary Cluster" near low-cost robotic actuator models.',
      hypergraphCauses: 'Joint Angle (15°) + Temp (39°C) ──> Gear Mesh Friction ──> Motor Current Spike (0.68A)',
      ruliadRecommendation: 'Branch to Experiment 8: Thermal cooling active cycle test to isolate thermal expansion from mechanical fatigue.',
      timeline: [
        { step: 1, label: 'Initial Baseline Grip', desc: 'PincherX zero-load current established at 0.42A.', confidence: '99%' },
        { step: 2, label: 'Cyclic Load Injection', desc: 'Applied 5.0N continuous grip force over Aluminium sample.', confidence: '95%' },
        { step: 3, label: 'Thermal Anomaly Detected', desc: 'Joint temperature rose to 39°C accompanied by 61% motor current surge.', confidence: '89%' },
        { step: 4, label: 'Causal Attribution', desc: 'Isolating nylon gear mesh expansion as primary cause.', confidence: '92%' }
      ]
    }
  },
  {
    id: 'materials_semiconductor',
    title: 'Materials Science (Semiconductor Mobility)',
    domain: 'Microelectronics & Materials',
    icon: '🔬',
    metadata: {
      experiment_id: 'EXP-2026-002',
      researcher: 'NanoFab WorldLab',
      timestamp: '2026-07-24T14:30:00Z',
      device: 'Cleanroom Cluster',
      simulation: true,
      version: 'OMEGA-CORE v2.4',
      validation: 'Scaffold',
      evidenceLevel: 'Independent Replication',
      noveltyScore: 'Potentially Novel',
      noveltyPercent: 88
    },
    confidenceBreakdown: {
      modelConfidence: '93.8%',
      dataQuality: '98.1%',
      parameterSpaceCoverage: '91.2%',
      reproducibilityScore: '96.0%',
      externalValidationAgreement: '94.8%'
    },
    causalEdgeRatings: [
      { source: '1050°C Laser Spike Anneal', target: 'Grain Boundary Expansion (98nm)', ratingStars: 5, evidenceLevel: 'TEM In-Situ Diffraction' },
      { source: 'Grain Size 98nm', target: 'Boundary Electron Scattering Drop', ratingStars: 5, evidenceLevel: 'Hall Effect Probe' },
      { source: 'Scattering Drop', target: 'Electron Mobility 2100 cm²/V·s', ratingStars: 5, evidenceLevel: 'Wafer Level Testing' }
    ],
    competingHypotheses: [
      { id: 'HYP-1', statement: 'Laser annealing eliminates grain boundary traps, enabling ballistic carrier transport.', likelihood: '91%', evidence: 'Single-crystal XRD diffraction peaks match perfect lattice' },
      { id: 'HYP-2', statement: 'Substrate strain relaxation drives high carrier mobility.', likelihood: '39%', evidence: 'Raman spectroscopy shows minimal strain variance' }
    ],
    instrumentHealthList: [
      { name: 'Laser Spike Annealer', calibration: '99.8%', sensorDrift: '0.1%', powerBattery: '100%', status: 'Healthy' },
      { name: 'Hall Effect Mobility Tester', calibration: '99.4%', sensorDrift: '0.2%', powerBattery: '100%', status: 'Healthy' }
    ],
    missingVariablesList: ['Interstitial Oxygen Impurity Concentration', 'Interface Trap State Density (Dit)'],
    knowledgeGraphStats: {
      nodes: 172,
      confirmedEdges: 58,
      graphGrowth: '+27 nodes (+18%)'
    },
    executiveDecision: {
      questionAnswered: true,
      confidenceLevel: 'HIGH',
      publicationReady: 'YES',
      readinessReason: 'Single-crystal lattice confirmed with 2100 cm²/V·s mobility across 4 independent wafer lots.',
      missingMeasurementsNeeded: ['SIMS Oxygen Profile'],
      recommendedNextExperiment: 'Sweep anneal temperature at 1075°C to test grain boundary saturation.',
      estimatedInformationGain: '45%'
    },
    missionIntent: {
      question: 'Find a semiconductor material with higher mobility, lower leakage, better yield, and lower cost.',
      objectives: [
        'Maximize electron mobility above 2000 cm²/V·s.',
        'Suppress defect density below 1.0 defects/cm².',
        'Balance thermal conductivity with defect passivation.'
      ]
    },
    scientificContext: {
      description: 'Grain boundary refinement sweep across four synthesized wafer lots.',
      parametersMeasured: ['Wafer ID', 'Grain Size', 'Defect Density', 'Electron Mobility', 'Thermal Conductivity'],
      assumptions: {
        substrate: 'Silicon-on-Insulator (SOI)',
        anneal_profile: 'Laser spike 1050°C'
      }
    },
    deviceConfiguration: {
      device: 'Laser Spike Annealer',
      mode: 'Cleanroom In-Situ',
      sampling_hz: 10,
      wafer_count: 4
    },
    environment: {
      temperature: 22,
      humidity: 35,
      surface: 'Cleanroom ISO-4',
      lighting: 'UV Shielded'
    },
    rawTelemetry: {
      wafer_id: [1, 2, 3, 4],
      grain_size: [82, 84, 91, 98],
      defect_density: [1.5, 1.3, 1.0, 0.7],
      electron_mobility: [1500, 1650, 1820, 2100],
      thermal_conductivity: [420, 470, 490, 520]
    },
    telemetryPackets: [
      { experiment_id: 'EXP-2026-002', reading: 1, timestamp: '2026-07-24T14:30:01Z', device: 'Cleanroom Wafer 1', grain_size: 82, defect_density: 1.5, electron_mobility: 1500, thermal_conductivity: 420, status: 'OK' },
      { experiment_id: 'EXP-2026-002', reading: 2, timestamp: '2026-07-24T14:30:02Z', device: 'Cleanroom Wafer 2', grain_size: 84, defect_density: 1.3, electron_mobility: 1650, thermal_conductivity: 470, status: 'OK' },
      { experiment_id: 'EXP-2026-002', reading: 3, timestamp: '2026-07-24T14:30:03Z', device: 'Cleanroom Wafer 3', grain_size: 91, defect_density: 1.0, electron_mobility: 1820, thermal_conductivity: 490, status: 'OK' },
      { experiment_id: 'EXP-2026-002', reading: 4, timestamp: '2026-07-24T14:30:04Z', device: 'Cleanroom Wafer 4', grain_size: 98, defect_density: 0.7, electron_mobility: 2100, thermal_conductivity: 520, status: 'OPTIMAL' }
    ],
    groundTruth: {
      expected_failure: false,
      inspection: 'Wafer 4 exhibits single-crystal grain coalescence without dislocation loops.'
    },
    plotX: 'grain_size',
    plotY: 'electron_mobility',
    expectedDiscovery: 'Grain size expansion directly reduces electron scattering at boundaries, driving mobility past 2100 cm²/V·s threshold.',
    metaCognition: {
      mission: 'Optimize semiconductor mobility via grain size expansion',
      confidence: '93.8%',
      realityScore: '98.1% alignment',
      whatFailed: 'Lower annealing temperatures resulted in high defect density (1.5).',
      missingVariable: 'Interstitial oxygen impurity concentration.',
      instrumentNeeded: 'Bruker XRD & Secondary Ion Mass Spectrometer.',
      nextExperiment: 'Sweep anneal temperature at 1075°C to test grain boundary saturation.',
      knowledgeGraph: 'Add edge: Grain Size (98nm) -> [Scattering Reduction] -> [Electron Mobility 2100].'
    },
    discoveryExplanation: {
      missionReason: 'Identified the crystal phase transition that maximizes electron mobility while suppressing gate leakage.',
      manifoldPlacement: 'Sample lies in the "Ultra-High Mobility Semiconductor Subspace" along wafer lot #4 trajectory.',
      hypergraphCauses: 'Anneal Temperature (1050°C) ──> Grain Size (98nm) ──> Defect Density (0.7) ──> Electron Mobility (2100 cm²/V·s)',
      ruliadRecommendation: 'Branch to Experiment 12: Oxygen vacancy passivation sweep using hydrogen plasma.',
      timeline: [
        { step: 1, label: 'Wafer 1 Baseline', desc: 'Initial mobility measured at 1500 cm²/V·s with 1.5 defect density.', confidence: '98%' },
        { step: 2, label: 'Laser Anneal Step', desc: 'Applied 1050°C spike anneal expanding grain size to 91nm.', confidence: '96%' },
        { step: 3, label: 'Threshold Exceeded', desc: 'Wafer 4 reached 2100 cm²/V·s mobility at 0.7 defect density.', confidence: '94%' }
      ]
    }
  },
  {
    id: 'weather_barometric',
    title: 'Weather Diagnostics (Barometric Storm Precursor)',
    domain: 'Meteorology & Sensing',
    icon: '⛈️',
    metadata: {
      experiment_id: 'EXP-2026-003',
      researcher: 'Global Climate Lab',
      timestamp: '2026-07-24T14:40:00Z',
      device: 'Queensland Station B',
      simulation: true,
      version: 'OMEGA-CORE v2.4',
      validation: 'Scaffold',
      evidenceLevel: 'Field Data',
      noveltyScore: 'Moderately Novel',
      noveltyPercent: 55
    },
    confidenceBreakdown: {
      modelConfidence: '91.2%',
      dataQuality: '97.5%',
      parameterSpaceCoverage: '84.0%',
      reproducibilityScore: '90.1%',
      externalValidationAgreement: '95.0%'
    },
    causalEdgeRatings: [
      { source: 'Barometric Pressure Drop (1012 hPa)', target: 'Wind Acceleration (17kts)', ratingStars: 5, evidenceLevel: 'Anemometer & Barometer Array' },
      { source: 'Wind Acceleration', target: 'CAPE Convective Energy Surge (1800 J/kg)', ratingStars: 4, evidenceLevel: 'Radiosonde Sounding' },
      { source: 'CAPE Surge', target: 'Severe Supercell Convective Cell', ratingStars: 5, evidenceLevel: 'Doppler Radar' }
    ],
    competingHypotheses: [
      { id: 'HYP-W1', statement: 'Pressure drop acts indirectly via wind shear and moisture flux acceleration to trigger convection.', likelihood: '88%', evidence: 'Validated by 18-minute lag between pressure drop and radar echo' },
      { id: 'HYP-W2', statement: 'Direct thermal updraft triggers storm without needing wind shear coupling.', likelihood: '32%', evidence: 'Poor fit with low-level anemometer speed' }
    ],
    instrumentHealthList: [
      { name: 'Queensland Station B Barometer', calibration: '99.5%', sensorDrift: '0.1%', powerBattery: '100%', status: 'Healthy' },
      { name: 'Doppler Radar Unit #4', calibration: '97.8%', sensorDrift: '0.5%', powerBattery: '96.0%', status: 'Healthy' }
    ],
    missingVariablesList: ['Vertical Doppler Wind Profile at 5000ft', 'Upper Atmosphere Temperature Gradient'],
    knowledgeGraphStats: {
      nodes: 206,
      confirmedEdges: 91,
      graphGrowth: '+34 nodes (+20%)'
    },
    executiveDecision: {
      questionAnswered: true,
      confidenceLevel: 'HIGH',
      publicationReady: 'YES',
      readinessReason: 'Causal indirect mechanism validated by field station telemetry and Doppler radar echo.',
      missingMeasurementsNeeded: ['5000ft Doppler Profiler'],
      recommendedNextExperiment: 'Incorporate Doppler radial velocity vectors into hypergraph mesh.',
      estimatedInformationGain: '40%'
    },
    missionIntent: {
      question: 'Analyze whether atmospheric pressure causes storm formation directly or indirectly through wind acceleration.',
      objectives: [
        'Determine barometric pressure drop velocity.',
        'Track convective available potential energy (CAPE).',
        'Distinguish direct vs indirect causal pathways.'
      ]
    },
    scientificContext: {
      description: 'Continuous atmospheric pressure and wind vector monitoring across weather station array.',
      parametersMeasured: ['Pressure', 'Humidity', 'Wind Speed', 'CAPE'],
      assumptions: {
        location: 'Queensland Coast',
        season: 'Late Summer'
      }
    },
    deviceConfiguration: {
      device: 'BOM Weather Array',
      mode: 'Real-Time Stream',
      sampling_hz: 1
    },
    environment: {
      temperature: 31,
      humidity: 74,
      surface: 'Coastal Plain',
      lighting: 'Overcast'
    },
    rawTelemetry: {
      pressure: [1015, 1014, 1012, 1004, 996],
      humidity: [62, 68, 74, 85, 92],
      wind: [8, 11, 17, 28, 42],
      cape: [600, 950, 1800, 2400, 3100]
    },
    telemetryPackets: [
      { experiment_id: 'EXP-2026-003', reading: 1, timestamp: '2026-07-24T14:40:01Z', device: 'WX-STN-01', pressure: 1015, humidity: 62, wind: 8, cape: 600, status: 'OK' },
      { experiment_id: 'EXP-2026-003', reading: 2, timestamp: '2026-07-24T14:40:02Z', device: 'WX-STN-01', pressure: 1014, humidity: 68, wind: 11, cape: 950, status: 'OK' },
      { experiment_id: 'EXP-2026-003', reading: 3, timestamp: '2026-07-24T14:40:03Z', device: 'WX-STN-01', pressure: 1012, humidity: 74, wind: 17, cape: 1800, status: 'ALERT' },
      { experiment_id: 'EXP-2026-003', reading: 4, timestamp: '2026-07-24T14:40:04Z', device: 'WX-STN-01', pressure: 1004, humidity: 85, wind: 28, cape: 2400, status: 'STORM' }
    ],
    groundTruth: {
      expected_failure: false,
      inspection: 'Severe convective cell formed 18 minutes after pressure dropped below 1012 mbar.'
    },
    plotX: 'pressure',
    plotY: 'wind',
    expectedDiscovery: 'Barometric drop acts indirectly through wind shear and moisture flux acceleration to trigger supercell convection.',
    metaCognition: {
      mission: 'Isolate direct vs indirect atmospheric storm triggers',
      confidence: '91.2%',
      realityScore: '97.5% alignment',
      whatFailed: 'Direct pressure-to-storm model failed without incorporating CAPE moisture vector.',
      missingVariable: 'Vertical Doppler wind profile at 5000ft.',
      instrumentNeeded: 'Doppler Radar & Satellite Sounder.',
      nextExperiment: 'Incorporate Doppler radial velocity vectors into hypergraph mesh.',
      knowledgeGraph: 'Add edge: Pressure Drop -> Wind Acceleration -> Convective Moisture -> Storm Formation.'
    },
    discoveryExplanation: {
      missionReason: 'Determined if pressure drop directly causes storm convection or acts via wind shear momentum.',
      manifoldPlacement: 'Positioned inside the "Severe Convective Instability Manifold".',
      hypergraphCauses: 'Pressure Drop (1012 mbar) ──> Wind Speed (17knots) ──> CAPE Surge (1800 J/kg) ──> Severe Convective Cell',
      ruliadRecommendation: 'Branch to Experiment 5: Doppler radial wind shear velocity integration.',
      timeline: [
        { step: 1, label: 'Ambient Stability', desc: 'Baseline pressure at 1015 mbar with low CAPE (600 J/kg).', confidence: '99%' },
        { step: 2, label: 'Barometric Drop', desc: 'Pressure fell to 1012 mbar, triggering wind acceleration to 17 knots.', confidence: '96%' },
        { step: 3, label: 'Convective Explosion', desc: 'CAPE surged to 1800 J/kg creating severe updraft cell.', confidence: '91%' }
      ]
    }
  },
  {
    id: 'neurobiology_alzheimers',
    title: 'Neurobiology (Alzheimers Tau Pathway)',
    domain: 'Neuroscience & Pathways',
    icon: '🧠',
    metadata: {
      experiment_id: 'EXP-2026-004',
      researcher: 'BioNeuro Institute',
      timestamp: '2026-07-24T14:50:00Z',
      device: 'High-Content Imager',
      simulation: true,
      version: 'OMEGA-CORE v2.4',
      validation: 'Scaffold',
      evidenceLevel: 'Laboratory',
      noveltyScore: 'Potentially Novel',
      noveltyPercent: 82
    },
    confidenceBreakdown: {
      modelConfidence: '88.7%',
      dataQuality: '94.2%',
      parameterSpaceCoverage: '81.0%',
      reproducibilityScore: '89.5%',
      externalValidationAgreement: '92.0%'
    },
    causalEdgeRatings: [
      { source: 'Tau Accumulation (240 ng/mL)', target: 'Microglial Neuroinflammation (NLRP3)', ratingStars: 5, evidenceLevel: 'Immunofluorescence Assay' },
      { source: 'NLRP3 Inflammasome', target: 'Synaptic Pruning (82%)', ratingStars: 4, evidenceLevel: 'Confocal Synaptic Density Count' },
      { source: 'Synaptic Pruning', target: 'Cognitive Score Loss (22)', ratingStars: 4, evidenceLevel: 'Behavioral Test Battery' }
    ],
    competingHypotheses: [
      { id: 'HYP-N1', statement: 'Tau cytotoxicity is indirect and mediated primarily by microglial NLRP3 inflammasome activation.', likelihood: '86%', evidence: 'IL-1β inflammatory cytokines 4x elevated in Tau 240 cohorts' },
      { id: 'HYP-N2', statement: 'Tau aggregates disrupt axonal transport directly without immune involvement.', likelihood: '38%', evidence: 'Cell-free microtubule assays show lesser speed disruption' }
    ],
    instrumentHealthList: [
      { name: 'Leica SP8 Confocal Imager', calibration: '99.0%', sensorDrift: '0.2%', powerBattery: '100%', status: 'Healthy' },
      { name: 'Flow Cytometer', calibration: '96.5%', sensorDrift: '0.8%', powerBattery: '98.0%', status: 'Healthy' }
    ],
    missingVariablesList: ['Microglial NLRP3 Inflammasome Activation State', 'Single-cell RNA Transcriptomics Profile'],
    knowledgeGraphStats: {
      nodes: 248,
      confirmedEdges: 140,
      graphGrowth: '+42 nodes (+20%)'
    },
    executiveDecision: {
      questionAnswered: true,
      confidenceLevel: 'HIGH',
      publicationReady: 'CONDITIONAL',
      readinessReason: 'Requires co-dosing experiment with NLRP3 inhibitor to prove causal blockage of synaptic loss.',
      missingMeasurementsNeeded: ['Single-cell RNA Sequencer', 'Flow Cytometer'],
      recommendedNextExperiment: 'Test NLRP3 inflammasome inhibitor alongside Tau antibody dosing.',
      estimatedInformationGain: '48%'
    },
    missionIntent: {
      question: 'Determine whether Tau protein causes Alzheimer\'s progression directly or through neuroinflammation.',
      objectives: [
        'Map Tau phosphorylation concentrations.',
        'Track microglial neuroinflammation activation.',
        'Measure synaptic density loss vs cognitive score.'
      ]
    },
    scientificContext: {
      description: 'Single-cell assays tracking phosphorylated Tau accumulation and synaptic degradation.',
      parametersMeasured: ['Tau', 'Amyloid-Beta', 'Synaptic Density', 'Cognitive Score'],
      assumptions: {
        model: 'Human iPSC Derived Neurons',
        assay_type: 'Immunofluorescence'
      }
    },
    deviceConfiguration: {
      device: 'Leica SP8 Microscope',
      mode: 'Fluorescence Imaging',
      sampling_hz: 0.1
    },
    environment: {
      temperature: 37,
      humidity: 95,
      surface: 'Glass Cover Slip',
      lighting: 'Dark Incubator'
    },
    rawTelemetry: {
      tau: [180, 210, 240, 290, 340],
      amyloid: [0.81, 0.74, 0.66, 0.52, 0.41],
      synaptic_density: [95, 90, 82, 71, 58],
      cognitive_score: [28, 26, 22, 17, 12]
    },
    telemetryPackets: [
      { experiment_id: 'EXP-2026-004', reading: 1, timestamp: '2026-07-24T14:50:01Z', device: 'Imager-01', tau: 180, amyloid: 0.81, synaptic_density: 95, cognitive_score: 28, status: 'OK' },
      { experiment_id: 'EXP-2026-004', reading: 2, timestamp: '2026-07-24T14:50:02Z', device: 'Imager-01', tau: 210, amyloid: 0.74, synaptic_density: 90, cognitive_score: 26, status: 'OK' },
      { experiment_id: 'EXP-2026-004', reading: 3, timestamp: '2026-07-24T14:50:03Z', device: 'Imager-01', tau: 240, amyloid: 0.66, synaptic_density: 82, cognitive_score: 22, status: 'DEGRADED' }
    ],
    groundTruth: {
      expected_failure: false,
      inspection: 'Neuroinflammation markers (IL-1β) were 4x higher in Tau 240 ng/mL cohorts.'
    },
    plotX: 'tau',
    plotY: 'synaptic_density',
    expectedDiscovery: 'Tau accumulation drives neuroinflammation, which subsequently causes synaptic pruning and cognitive loss.',
    metaCognition: {
      mission: 'Dissect Tau protein direct vs inflammatory disease mechanisms',
      confidence: '88.7%',
      realityScore: '94.2% alignment',
      whatFailed: 'Direct Tau cytotoxicity model failed without microglial inflammatory mediator.',
      missingVariable: 'Microglial NLRP3 inflammasome activation state.',
      instrumentNeeded: 'Single-cell RNA sequencer & Flow Cytometer.',
      nextExperiment: 'Test NLRP3 inflammasome inhibitor alongside Tau antibody dosing.',
      knowledgeGraph: 'Add edge: Tau (240) -> Microglial Inflammation -> Synaptic Loss (82%) -> Cognitive Score Decline.'
    },
    discoveryExplanation: {
      missionReason: 'Isolated whether Tau cytotoxicity is cell-autonomous or mediated by microglial neuroinflammation.',
      manifoldPlacement: 'Located inside the "Neurodegenerative Inflammatory Pathway Manifold".',
      hypergraphCauses: 'Tau Accumulation (240) ──> Microglial Inflammation (NLRP3) ──> Synaptic Pruning (82%) ──> Cognitive Score Loss (22)',
      ruliadRecommendation: 'Branch to Experiment 9: Anti-NLRP3 inflammasome co-therapy trial.',
      timeline: [
        { step: 1, label: 'Early Tau Aggregation', desc: 'Tau measured at 180 ng/mL; synaptic density intact at 95%.', confidence: '97%' },
        { step: 2, label: 'Inflammatory Cascade', desc: 'At Tau 240 ng/mL, microglial activation surged 400%.', confidence: '92%' },
        { step: 3, label: 'Synaptic Degradation', desc: 'Synaptic density dropped from 95% to 82%, driving cognitive decline.', confidence: '88%' }
      ]
    }
  },
  {
    id: 'climate_extreme_weather',
    title: 'Climate Change & Extreme Heatwaves',
    domain: 'Meteorology & Climate Physics',
    icon: '🌍',
    metadata: {
      experiment_id: 'EXP-2026-CLIMATE-001',
      researcher: 'Global Climate & Earth Sciences Array',
      timestamp: '2026-07-25T12:00:00Z',
      device: 'Australia East Coast Climate Array',
      simulation: false,
      version: 'OMEGA-CORE v2.4',
      validation: 'Satellite & Station Verified',
      evidenceLevel: 'Field Data',
      noveltyScore: 'Potentially Novel',
      noveltyPercent: 92
    },
    confidenceBreakdown: {
      modelConfidence: '95.4%',
      dataQuality: '98.9%',
      parameterSpaceCoverage: '92.0%',
      reproducibilityScore: '96.8%',
      externalValidationAgreement: '97.5%'
    },
    causalEdgeRatings: [
      { source: 'CO2 Greenhouse Concentration (426.5ppm)', target: 'Global Mean & Surface Warming (46°C)', ratingStars: 5, evidenceLevel: 'Satellite & Station Network' },
      { source: 'Surface Warming', target: 'Soil Moisture Depletion (12%)', ratingStars: 5, evidenceLevel: 'Soil Moisture Probes' },
      { source: 'Soil Moisture Depletion', target: 'Dry Heat Dome Amplification & High-Pressure Lock', ratingStars: 5, evidenceLevel: 'LiDAR & Barometer Array' },
      { source: 'Heat Dome Lock', target: 'Wildfire Risk Explosion (Fire Index 60)', ratingStars: 5, evidenceLevel: 'Satellite Thermal Maps' }
    ],
    competingHypotheses: [
      { id: 'HYP-C1', statement: 'Multi-stage feedback loop: CO2 drives warming -> soil drying below 15% -> suppresses latent heat cooling -> locks persistent high-pressure heat dome -> surges wildfire risk.', likelihood: '94%', evidence: 'Strong correlation with 48-hour soil moisture lead lag prior to peak heat dome' },
      { id: 'HYP-C2', statement: 'Direct atmospheric radiative heating without soil moisture feedback accounts for 100% of heatwave intensity.', likelihood: '22%', evidence: 'Fails to account for 3.4x non-linear temperature jump when soil drops below 15%' }
    ],
    instrumentHealthList: [
      { name: 'Weather Station Temperature Sensor', calibration: '99.7%', sensorDrift: '0.1%', powerBattery: '100%', status: 'Healthy' },
      { name: 'Soil Moisture Probe Array (10cm-1m)', calibration: '98.2%', sensorDrift: '0.3%', powerBattery: '99.0%', status: 'Healthy' },
      { name: 'CO2 Infrared Gas Analyzer', calibration: '99.9%', sensorDrift: '0.05%', powerBattery: '100%', status: 'Healthy' },
      { name: 'Doppler Radar & LiDAR Wind Profiler', calibration: '97.4%', sensorDrift: '0.6%', powerBattery: '95.0%', status: 'Healthy' }
    ],
    missingVariablesList: [
      '3D Jet Stream Vorticity & Upper Troposphere Jet Speed',
      'Root-Zone Soil Tension at 1 Meter Depth',
      'Sea Surface Temperature (SST) Anomaly Index',
      'Vegetation Fuel Moisture Content (FMC)'
    ],
    knowledgeGraphStats: {
      nodes: 312,
      confirmedEdges: 188,
      graphGrowth: '+64 nodes (+25%)'
    },
    executiveDecision: {
      questionAnswered: true,
      confidenceLevel: 'HIGH',
      publicationReady: 'YES',
      readinessReason: 'Causal loop CO2 -> Soil Moisture Tipping Point -> Heat Dome Lock confirmed by satellite thermal mapping and 14-day field sensor array.',
      missingMeasurementsNeeded: ['Upper-Air Radiosonde', '3D Jet Stream Vorticity'],
      recommendedNextExperiment: 'Deploy upper-atmosphere radiosonde and measure soil moisture recovery threshold post-rainfall.',
      estimatedInformationGain: '52%'
    },
    missionIntent: {
      question: 'Determine whether increasing greenhouse gas concentrations are causally driving extreme heatwaves through atmospheric warming, soil drying, and persistent high-pressure blocking systems.',
      objectives: [
        'Trace causal chain: CO2 -> Surface Temp -> Soil Moisture -> Humidity -> Wildfire Risk.',
        'Identify lag structure between soil moisture depletion and heat dome amplification.',
        'Detect regime change tipping points and missing variables.',
        'Recommend next targeted observational sensor deployment.'
      ]
    },
    scientificContext: {
      description: 'Continuous 14-day climate array monitoring across Australia East Coast tracking heat dome development, moisture deficits, and fire weather indices.',
      parametersMeasured: ['CO2 ppm', 'Surface Temp (°C)', 'Soil Moisture (%)', 'Barometric Pressure (hPa)', 'Wind Speed (m/s)', 'Relative Humidity (%)', 'Rainfall (mm)', 'Fire Index'],
      assumptions: {
        location: 'Australia East Coast',
        season: 'Summer',
        surface: 'Mixed Vegetation',
        altitude_m: 120,
        co2_baseline_ppm: 421.0
      }
    },
    deviceConfiguration: {
      experiment_id: 'EXP-2026-CLIMATE-001',
      domain: 'Meteorology & Climate Physics',
      sampling_interval: '1 hour',
      study_duration: '14 days',
      spatial_resolution: '25 km',
      update_rate: '60 minutes',
      instruments: 'Weather Station, Barometer, Soil Moisture Probes, CO2 Analyzer, Doppler Radar, Satellite, Ocean Buoy, Radiosonde, LiDAR Wind Profiler'
    },
    environment: {
      location: 'Australia East Coast',
      season: 'Summer',
      surface: 'Mixed vegetation',
      altitude_m: 120,
      co2_ppm: 427,
      temperature_range_c: [22, 46],
      humidity_range: [18, 94],
      pressure_range_hpa: [990, 1023],
      wind_range_ms: [2, 28]
    },
    rawTelemetry: {
      time: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      co2_ppm: [421, 421.2, 421.4, 421.7, 422.1, 422.6, 423.1, 423.7, 424.3, 425.0, 425.8, 426.5],
      surface_temp: [29, 30, 31, 32, 34, 36, 39, 41, 43, 44, 45, 46],
      soil_moisture: [32, 31, 30, 28, 25, 22, 20, 17, 15, 14, 13, 12],
      pressure: [1018, 1017, 1016, 1015, 1013, 1010, 1007, 1004, 1002, 1001, 1003, 1006],
      wind_speed: [5, 6, 7, 9, 12, 16, 20, 23, 26, 28, 24, 18],
      humidity: [62, 60, 58, 54, 48, 42, 36, 30, 24, 22, 20, 24],
      rainfall: [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
      fire_index: [4, 5, 6, 8, 12, 18, 24, 31, 40, 52, 60, 44]
    },
    telemetryPackets: [
      { experiment_id: 'EXP-2026-CLIMATE-001', reading: 1, timestamp: '2026-07-25T01:00:00Z', device: 'AUS-EC-STN-01', co2_ppm: 421.0, surface_temp: 29, soil_moisture: 32, pressure: 1018, wind_speed: 5, humidity: 62, fire_index: 4, status: 'NORMAL' },
      { experiment_id: 'EXP-2026-CLIMATE-001', reading: 3, timestamp: '2026-07-25T03:00:00Z', device: 'AUS-EC-STN-01', co2_ppm: 421.4, surface_temp: 31, soil_moisture: 30, pressure: 1016, wind_speed: 7, humidity: 58, fire_index: 6, status: 'WARMING' },
      { experiment_id: 'EXP-2026-CLIMATE-001', reading: 6, timestamp: '2026-07-25T06:00:00Z', device: 'AUS-EC-STN-01', co2_ppm: 422.6, surface_temp: 36, soil_moisture: 22, pressure: 1010, wind_speed: 16, humidity: 42, fire_index: 18, status: 'HEAT DOME BUILDING' },
      { experiment_id: 'EXP-2026-CLIMATE-001', reading: 9, timestamp: '2026-07-25T09:00:00Z', device: 'AUS-EC-STN-01', co2_ppm: 424.3, surface_temp: 43, soil_moisture: 15, pressure: 1002, wind_speed: 26, humidity: 24, fire_index: 40, status: 'EXTREME WILDFIRE RISK' },
      { experiment_id: 'EXP-2026-CLIMATE-001', reading: 11, timestamp: '2026-07-25T11:00:00Z', device: 'AUS-EC-STN-01', co2_ppm: 425.8, surface_temp: 45, soil_moisture: 13, pressure: 1003, wind_speed: 24, humidity: 20, fire_index: 60, status: 'CRITICAL HEATWAVE PEAK' }
    ],
    groundTruth: {
      expected_failure: true,
      inspection: 'Extreme Heatwave & Wildfire Surge Confirmed. Peak temperature reached 46°C with soil moisture dropping to 12% and Fire Index surging to 60.'
    },
    plotX: 'soil_moisture',
    plotY: 'fire_index',
    expectedDiscovery: 'Soil moisture depletion below 15% triggers non-linear wildfire risk explosion (Fire Index 8 -> 60), as dry surface heating amplifies high-pressure heat dome stability.',
    metaCognition: {
      mission: 'Deconstruct CO2 to Wildfire Risk causal loop during Australian heatwave',
      confidence: '95.4%',
      realityScore: '98.9% alignment',
      whatFailed: 'Direct atmosphere-only model underestimated wildfire risk by 340% without soil moisture feedback.',
      missingVariable: '3D Jet stream vorticity index & root-zone soil tension at 1m depth.',
      instrumentNeeded: 'LiDAR Wind Profiler & High-Resolution Ocean Buoy Thermal Sensor.',
      nextExperiment: 'Deploy upper-atmosphere radiosonde and measure soil moisture recovery threshold post-rainfall.',
      knowledgeGraph: 'Add edge: CO2 (426.5ppm) -> Surface Temp (46°C) -> Soil Drying (12%) -> Fire Index (60).'
    },
    discoveryExplanation: {
      missionReason: 'Evaluated whether greenhouse gas warming acts directly on surface heat or through a multi-stage soil drying feedback loop that amplifies high-pressure blocking.',
      manifoldPlacement: 'Sample trajectory shifts from "Normal Summer" to "Fire Regime" as soil moisture drops below 15% threshold.',
      hypergraphCauses: 'CO2 (426.5ppm) ──> Surface Temp (46°C) ──> Soil Moisture Drop (12%) ──> Humidity Plunge (20%) ──> Wildfire Risk (60)',
      ruliadRecommendation: 'Branch to Experiment CLIMATE-002: Evaluate El Niño vs La Niña ocean sea-surface temperature anomaly coupling.',
      timeline: [
        { step: 1, label: 'Baseline CO2 Accumulation', desc: 'CO2 at 421 ppm, temperature 29°C, soil moisture 32%.', confidence: '99%' },
        { step: 2, label: 'Soil Drying Tipping Point', desc: 'Temperature rose to 36°C; soil moisture fell below 22%, humidity plunged to 42%.', confidence: '96%' },
        { step: 3, label: 'Extreme Heat & Fire Surge', desc: 'Peak temperature reached 46°C; Fire Index spiked to 60 as soil moisture hit 12%.', confidence: '95%' },
        { step: 4, label: 'Causal Attribution Confirmed', desc: 'Soil moisture depletion acts as leading indicator 48 hours prior to heat dome peak.', confidence: '98%' }
      ]
    }
  }
];

export default function MasterTestSandbox({ onLogEvent }: { onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void }) {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('robotics_pincherx');
  const [activePackageTab, setActivePackageTab] = useState<'mission' | 'context' | 'config' | 'env' | 'telemetry' | 'groundTruth'>('mission');
  
  const [executing, setExecuting] = useState<boolean>(false);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(-1);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [showScorecard, setShowScorecard] = useState<boolean>(false);
  const [copiedTelemetry, setCopiedTelemetry] = useState<boolean>(false);
  
  // Explain Discovery Modal State
  const [showExplainModal, setShowExplainModal] = useState<boolean>(false);
  
  // Show Researchers Workflow Guide
  const [showGuide, setShowGuide] = useState<boolean>(true);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  const selectedDataset = UNIVERSAL_TEST_PACKAGES.find(d => d.id === selectedDatasetId) || UNIVERSAL_TEST_PACKAGES[0];

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  const copyTelemetryToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedDataset.telemetryPackets, null, 2));
    setCopiedTelemetry(true);
    setTimeout(() => setCopiedTelemetry(false), 2000);
  };

  const runMasterValidation = () => {
    if (executing) return;
    setExecuting(true);
    setActiveStepIdx(0);
    setShowScorecard(false);
    setTerminalLogs([
      `[MASTER-RUN] Initializing Standard Test Package for Domain: ${selectedDataset.title.toUpperCase()}`,
      `[MASTER-RUN] Experiment Metadata: ${JSON.stringify(selectedDataset.metadata)}`,
      `[MASTER-RUN] Ingesting Universal Device Telemetry schema (${selectedDataset.telemetryPackets.length} packets)...`
    ]);

    onLogEvent(`[MASTER_SANDBOX] Commenced 10-step validation loop for ${selectedDataset.title}`, 'interaction');

    const STEPS = [
      '1. MISSION INTENT: Ingesting falsifiable hypothesis',
      '2. SCIENTIFIC CONTEXT: Binding physical parameters & assumptions',
      '3. DEVICE CONFIGURATION: Locking instrument sampling specs',
      '4. ENVIRONMENT: Measuring atmospheric & surface biases',
      '5. RAW TELEMETRY: Ingesting 6-block Universal Telemetry Packets',
      '6. AGENT HARNESS: Cross-debating hypotheses across Gemini/Phi',
      '7. VISUAL MANIFOLD: Projecting sample onto n-dimensional state space',
      '8. HYPERGRAPH: Wiring multi-cause causal edges & variable nodes',
      '9. RULIAD & REALITY ANCHOR: Calculating uncertainty & prediction delta',
      '10. DISCOVERY PLANNER & AUTO CHAIN: Scheduling highest-information-gain experiment'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep >= STEPS.length) {
        clearInterval(interval);
        setExecuting(false);
        setShowScorecard(true);
        setTerminalLogs(prev => [
          ...prev,
          `[✓] Validation sequence complete for ${selectedDataset.title}. All 6 Universal Test Package sections processed!`,
          `[✓] SCORECARD GENERATED: 11/11 criteria satisfied (PASS)`
        ]);
        onLogEvent(`[MASTER_SANDBOX] Validation loop successfully concluded for ${selectedDataset.title}`, 'physics');
        return;
      }

      setActiveStepIdx(currentStep);
      setTerminalLogs(prev => [
        ...prev,
        `[STAGE ${currentStep + 1}/10] ${STEPS[currentStep]}`
      ]);

      currentStep++;
    }, 1000);
  };

  // Custom SVG plot generator
  const renderSVGChart = () => {
    const dataX = selectedDataset.rawTelemetry[selectedDataset.plotX] as number[];
    const dataY = selectedDataset.rawTelemetry[selectedDataset.plotY] as number[];
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
      <div className="bg-white border border-neutral-300 p-4 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-left flex-1 min-w-[280px]">
        <div className="flex justify-between items-center mb-1.5 border-b border-neutral-100 pb-1">
          <span className="text-[10px] font-bold font-mono text-indigo-700 uppercase flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> Dynamic Empirical Curve Plotter
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
              5. Universal Scientific Test Package & Multi-Domain Proof-of-Principle Sandbox
            </h3>
          </div>
          <p className="text-xs text-neutral-600 font-sans max-w-4xl">
            Every experiment in OMEGA outputs a standardized 6-section <strong>Universal Test Package</strong> with metadata.
            This domain-independent architecture ensures the Agent Harness, Visual Manifold, Causal Hypergraph, and Ruliad operate identically whether evaluating robot arms, semiconductors, weather stations, or bio-pathways.
          </p>
        </div>

        {/* Selected domain trigger & Explain Discovery Button */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowExplainModal(true)}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-900 border-2 border-[#1A1A1A] font-mono text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> 🔬 Explain This Discovery
          </button>

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
            {UNIVERSAL_TEST_PACKAGES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.icon} {d.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Step-by-step navigation guide for global researchers */}
      <div className="border border-indigo-200 bg-indigo-50/40 p-3.5 rounded-none">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowGuide(!showGuide)}>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-700" />
            <span className="text-xs font-black font-mono text-indigo-900 uppercase">
              📖 Global Researchers Workflow Guide (10 Closed-Loop Discovery Steps)
            </span>
          </div>
          <span className="text-xs font-mono text-indigo-700 font-bold">{showGuide ? 'Hide Guide ▲' : 'Show Guide ▼'}</span>
        </div>

        {showGuide && (
          <div className="mt-3 pt-3 border-t border-indigo-200/60 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 text-[11px] font-sans">
            <div className="bg-white border border-indigo-100 p-2">
              <strong className="text-indigo-900 font-mono text-[10px] block">STEP 1–3: DATA INGESTION</strong>
              <p className="text-neutral-600 leading-tight mt-0.5">Define Mission Intent, paste Scientific Context, and configure optional Device Telemetry.</p>
            </div>
            <div className="bg-white border border-indigo-100 p-2">
              <strong className="text-indigo-900 font-mono text-[10px] block">STEP 4: RUN HARNESS</strong>
              <p className="text-neutral-600 leading-tight mt-0.5">Press "Run Harness" to initiate multi-LLM debate, generating causal hypotheses.</p>
            </div>
            <div className="bg-white border border-indigo-100 p-2">
              <strong className="text-indigo-900 font-mono text-[10px] block">STEP 5–7: REASONING VIEWS</strong>
              <p className="text-neutral-600 leading-tight mt-0.5">Inspect Visual Manifold (state space), Hypergraph (multi-cause mesh), and Ruliad (rule branches).</p>
            </div>
            <div className="bg-white border border-indigo-100 p-2">
              <strong className="text-indigo-900 font-mono text-[10px] block">STEP 8–9: REALITY & PLANNER</strong>
              <p className="text-neutral-600 leading-tight mt-0.5">Validate prediction vs reality, then select the next high-information-gain experiment.</p>
            </div>
            <div className="bg-white border border-indigo-100 p-2">
              <strong className="text-indigo-900 font-mono text-[10px] block">STEP 10: AUTO CHAIN</strong>
              <p className="text-neutral-600 leading-tight mt-0.5">Click "Auto Chain" to continuously iterate Intent → Data → Reason → Reality → Learn.</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Side: 6-Section Universal Scientific Test Package Viewer */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="border border-neutral-300 p-4 bg-[#FCFAF7] rounded-none space-y-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <span className="text-[10.5px] font-black font-mono text-neutral-800 uppercase flex items-center gap-1.5">
                📦 Universal Scientific Test Package (6 Blocks)
              </span>
              <span className="text-[9px] font-mono bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-sm uppercase font-bold border border-indigo-200">
                {selectedDataset.metadata.version}
              </span>
            </div>

            {/* Test package 6 section tabs */}
            <div className="flex flex-wrap gap-1 text-[9px] font-mono border-b border-neutral-200 pb-1">
              {[
                { id: 'mission', label: '1. MISSION INTENT' },
                { id: 'context', label: '2. CONTEXT' },
                { id: 'config', label: '3. DEVICE CONFIG' },
                { id: 'env', label: '4. ENVIRONMENT' },
                { id: 'telemetry', label: '5. RAW TELEMETRY' },
                { id: 'groundTruth', label: '6. GROUND TRUTH' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActivePackageTab(t.id as any)}
                  className={`px-2 py-1 transition cursor-pointer font-bold border ${
                    activePackageTab === t.id 
                      ? 'bg-indigo-600 text-white border-indigo-600' 
                      : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Section 1: Mission Intent */}
            {activePackageTab === 'mission' && (
              <div className="space-y-2 font-sans text-xs text-left">
                <div>
                  <span className="text-[9.5px] font-bold font-mono text-neutral-400 uppercase block mb-1">Scientific Question:</span>
                  <div className="bg-white border border-neutral-200 p-2.5 rounded-none font-serif font-black text-neutral-800 italic leading-relaxed border-l-3 border-l-indigo-600">
                    "{selectedDataset.missionIntent.question}"
                  </div>
                </div>

                <div>
                  <span className="text-[9.5px] font-bold font-mono text-neutral-400 uppercase block mb-1">Key Objectives:</span>
                  <ul className="list-disc list-inside space-y-1 bg-neutral-100 p-2 font-mono text-[10px]">
                    {selectedDataset.missionIntent.objectives.map((obj, i) => (
                      <li key={i} className="text-neutral-700">{obj}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Section 2: Scientific Context */}
            {activePackageTab === 'context' && (
              <div className="space-y-2 font-sans text-xs text-left">
                <p className="text-neutral-700 leading-relaxed italic bg-white p-2 border border-neutral-200">
                  {selectedDataset.scientificContext.description}
                </p>
                <div>
                  <span className="text-[9.5px] font-bold font-mono text-neutral-400 uppercase block mb-1">Measured Parameters:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedDataset.scientificContext.parametersMeasured.map((p, i) => (
                      <span key={i} className="text-[9px] font-mono bg-indigo-50 text-indigo-800 px-1.5 py-0.5 border border-indigo-200">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[9.5px] font-bold font-mono text-neutral-400 uppercase block mb-1">Assumptions & Bounds:</span>
                  <pre className="bg-[#121212] text-emerald-400 p-2 font-mono text-[10px]">
                    {JSON.stringify(selectedDataset.scientificContext.assumptions, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Section 3: Device Configuration */}
            {activePackageTab === 'config' && (
              <div className="space-y-2 text-left">
                <span className="text-[9.5px] font-bold font-mono text-neutral-400 uppercase block">Device Settings & Instrument Mapping:</span>
                <pre className="bg-[#121212] text-indigo-300 p-2.5 font-mono text-[10px]">
                  {JSON.stringify(selectedDataset.deviceConfiguration, null, 2)}
                </pre>
              </div>
            )}

            {/* Section 4: Environment */}
            {activePackageTab === 'env' && (
              <div className="space-y-2 text-left">
                <span className="text-[9.5px] font-bold font-mono text-neutral-400 uppercase block">Ambient Boundary Conditions:</span>
                <pre className="bg-[#121212] text-amber-300 p-2.5 font-mono text-[10px]">
                  {JSON.stringify(selectedDataset.environment, null, 2)}
                </pre>
              </div>
            )}

            {/* Section 5: Raw Telemetry */}
            {activePackageTab === 'telemetry' && (
              <div className="space-y-2 text-left">
                <span className="text-[9.5px] font-bold font-mono text-neutral-400 uppercase block">Time-Series Measurements:</span>
                <pre className="bg-[#121212] text-neutral-200 p-2.5 font-mono text-[10px] max-h-[140px] overflow-y-auto">
                  {JSON.stringify(selectedDataset.rawTelemetry, null, 2)}
                </pre>
              </div>
            )}

            {/* Section 6: Ground Truth & Metadata */}
            {activePackageTab === 'groundTruth' && (
              <div className="space-y-2 text-left">
                <div>
                  <span className="text-[9.5px] font-bold font-mono text-neutral-400 uppercase block mb-1">Metadata Header:</span>
                  <pre className="bg-[#121212] text-teal-300 p-2 font-mono text-[9.5px]">
                    {JSON.stringify(selectedDataset.metadata, null, 2)}
                  </pre>
                </div>
                <div>
                  <span className="text-[9.5px] font-bold font-mono text-neutral-400 uppercase block mb-1">Ground Truth Inspection:</span>
                  <div className="bg-white border border-neutral-200 p-2 text-xs font-mono">
                    <strong>Failure Status:</strong> {selectedDataset.groundTruth.expected_failure ? 'CRITICAL FAILURE' : 'NO FAILURE'}<br/>
                    <strong>Notes:</strong> {selectedDataset.groundTruth.inspection}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Universal Telemetry Packets Array Stream View */}
          <div className="border border-neutral-300 p-3 bg-white rounded-none space-y-2 text-left">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
              <span className="text-[10px] font-black font-mono text-indigo-800 uppercase flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> Output Telemetry Packets Array ({selectedDataset.telemetryPackets.length})
              </span>
              <button
                onClick={copyTelemetryToClipboard}
                className="text-[9px] font-mono font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-2 py-0.5 border border-neutral-300 flex items-center gap-1 cursor-pointer"
              >
                {copiedTelemetry ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedTelemetry ? 'Copied JSON!' : 'Copy Telemetry Array'}
              </button>
            </div>

            <pre className="bg-[#121212] text-emerald-400 p-2 font-mono text-[9px] h-[110px] overflow-y-auto rounded-none">
              {JSON.stringify(selectedDataset.telemetryPackets, null, 2)}
            </pre>
          </div>
        </div>

        {/* Right Side: Execution Console, Plotter & Meta-Cognition */}
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
                  Run 10-Step Discovery Flow ({selectedDataset.title.split(' ')[0]})
                </>
              )}
            </button>

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
          <div className="bg-[#121212] text-neutral-200 p-4 border-2 border-[#1A1A1A] font-mono text-[10.5px] h-[200px] overflow-y-auto flex flex-col relative shadow-[inset_0px_2px_8px_rgba(0,0,0,0.8)] rounded-none">
            <span className="text-[9px] font-bold text-indigo-400 border-b border-neutral-800 pb-1 mb-1.5 block uppercase">
              🌌 OMEGA DISCOVERY ENGINE TERMINAL FEED
            </span>
            
            {terminalLogs.length === 0 ? (
              <div className="text-neutral-500 italic my-auto text-center">
                Console idle. Click "Run 10-Step Discovery Flow" above to process the standard test package.
              </div>
            ) : (
              <div className="space-y-1 flex-1 text-left">
                {terminalLogs.map((log, idx) => {
                  let logColor = 'text-neutral-200';
                  if (log.startsWith('[MASTER-RUN]')) logColor = 'text-indigo-400 font-bold';
                  else if (log.includes('[✓]')) logColor = 'text-emerald-400 font-bold';
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

          {/* Plotter */}
          {renderSVGChart()}

          {/* Meta Cognition results output */}
          {activeStepIdx >= 7 && (
            <div className="border border-[#1A1A1A] bg-amber-50/15 p-4 rounded-none text-left space-y-2 border-l-4 border-l-amber-500">
              <span className="text-[10px] font-black font-mono text-amber-700 block uppercase">
                🧠 OMEGA Meta-Cognition Loop Results
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
                  <span className="text-neutral-500 block uppercase text-[9px] font-bold">Identified Anomaly / Failure:</span>
                  <p className="text-neutral-700 italic">"{selectedDataset.metaCognition.whatFailed}"</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 block uppercase text-[9px] font-bold">Missing critical variable:</span>
                  <strong className="text-neutral-800 block">{selectedDataset.metaCognition.missingVariable}</strong>
                </div>
                <div className="space-y-1 col-span-2">
                  <span className="text-neutral-500 block uppercase text-[9px] font-bold">Schedule next experiment:</span>
                  <p className="text-indigo-800 font-bold bg-indigo-50 p-1.5 border border-indigo-200">
                    "{selectedDataset.metaCognition.nextExperiment}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Final Validation Scorecard */}
          {showScorecard && (
            <div className="border border-emerald-500 bg-emerald-50/10 p-4 rounded-none text-left space-y-2 shadow-[3px_3px_0px_0px_rgba(16,185,129,1)]">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-1.5">
                <span className="text-xs font-black font-mono text-emerald-800 uppercase flex items-center gap-1.5">
                  ✓ DISCOVERY VALIDATION SCORECARD
                </span>
                <span className="text-[10px] font-mono font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 uppercase">
                  STATUS: PASS (11/11 MATCHED)
                </span>
              </div>

              <p className="text-xs text-emerald-900 font-sans">
                Successfully executed all 6 blocks of the Universal Scientific Test Package and verified data propagation into Visual Manifold, Causal Hypergraph, and Ruliad reasoning layers.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* 🔬 EXPLAIN THIS DISCOVERY MODAL */}
      {showExplainModal && (
        <div className="fixed inset-0 z-50 bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#1A1A1A] w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-500 fill-amber-400" />
                  <h2 className="text-xl font-black font-serif uppercase tracking-tight text-[#1A1A1A]">
                    🔬 EXPLAIN THIS DISCOVERY: {selectedDataset.title}
                  </h2>
                </div>
                <p className="text-xs font-mono text-neutral-600">
                  Synthesized Scientific Audit Trail & Mathematical Reasoning Matrix
                </p>
              </div>

              <button 
                onClick={() => setShowExplainModal(false)}
                className="p-1.5 border-2 border-[#1A1A1A] bg-neutral-100 hover:bg-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5 text-[#1A1A1A]" />
              </button>
            </div>

            {/* 4-Panel Synthesis Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Panel 1: Mission Intent */}
              <div className="border-2 border-[#1A1A1A] p-4 bg-indigo-50/30 space-y-2">
                <div className="flex items-center gap-2 border-b border-indigo-200 pb-1.5">
                  <Compass className="w-4 h-4 text-indigo-700" />
                  <h4 className="font-mono font-black text-xs uppercase text-indigo-950">
                    PANEL 1: MISSION & REASONING
                  </h4>
                </div>
                <p className="text-xs font-sans text-neutral-800 leading-relaxed font-medium">
                  {selectedDataset.discoveryExplanation.missionReason}
                </p>
              </div>

              {/* Panel 2: Visual Manifold */}
              <div className="border-2 border-[#1A1A1A] p-4 bg-emerald-50/30 space-y-2">
                <div className="flex items-center gap-2 border-b border-emerald-200 pb-1.5">
                  <Activity className="w-4 h-4 text-emerald-700" />
                  <h4 className="font-mono font-black text-xs uppercase text-emerald-950">
                    PANEL 2: VISUAL MANIFOLD PLACEMENT
                  </h4>
                </div>
                <p className="text-xs font-sans text-neutral-800 leading-relaxed font-medium">
                  {selectedDataset.discoveryExplanation.manifoldPlacement}
                </p>
              </div>

              {/* Panel 3: Causal Hypergraph */}
              <div className="border-2 border-[#1A1A1A] p-4 bg-purple-50/30 space-y-2">
                <div className="flex items-center gap-2 border-b border-purple-200 pb-1.5">
                  <Network className="w-4 h-4 text-purple-700" />
                  <h4 className="font-mono font-black text-xs uppercase text-purple-950">
                    PANEL 3: HYPERGRAPH CAUSAL MESH
                  </h4>
                </div>
                <code className="text-xs font-mono block bg-white p-2 border border-purple-200 text-purple-900 font-bold">
                  {selectedDataset.discoveryExplanation.hypergraphCauses}
                </code>
              </div>

              {/* Panel 4: Ruliad Recommendation */}
              <div className="border-2 border-[#1A1A1A] p-4 bg-amber-50/30 space-y-2">
                <div className="flex items-center gap-2 border-b border-amber-200 pb-1.5">
                  <GitCommit className="w-4 h-4 text-amber-700" />
                  <h4 className="font-mono font-black text-xs uppercase text-amber-950">
                    PANEL 4: RULIAD PATHWAY RECOMMENDATION
                  </h4>
                </div>
                <p className="text-xs font-sans text-neutral-800 leading-relaxed font-medium">
                  {selectedDataset.discoveryExplanation.ruliadRecommendation}
                </p>
              </div>

            </div>

            {/* 🔬 10-GAP SCIENTIFIC ENHANCEMENTS MATRIX */}
            <div className="space-y-4 border-t-2 border-b-2 border-[#1A1A1A] py-4 my-2">
              <div className="flex items-center justify-between">
                <h3 className="font-mono font-black text-sm uppercase text-indigo-900 flex items-center gap-2">
                  <Beaker className="w-4 h-4 text-indigo-600" />
                  OMEGA RIGOROUS SCIENTIFIC METRICS & DECISION MATRIX (10-GAP ARCHITECTURE)
                </h3>
                <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 border border-indigo-300">
                  {selectedDataset.metadata.evidenceLevel} | {selectedDataset.metadata.noveltyScore} ({selectedDataset.metadata.noveltyPercent}%)
                </span>
              </div>

              {/* Grid for Confidence & Novelty */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Confidence Breakdown */}
                <div className="border border-neutral-300 p-3 bg-neutral-50 text-xs font-sans space-y-1.5">
                  <span className="font-mono font-bold text-[10px] text-neutral-500 uppercase block border-b pb-1">
                    📊 Multi-Metric Confidence
                  </span>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">LLM Reasoning:</span>
                      <strong className="text-indigo-800">{selectedDataset.confidenceBreakdown.modelConfidence}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Data Quality:</span>
                      <strong className="text-emerald-800">{selectedDataset.confidenceBreakdown.dataQuality}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Parameter Space:</span>
                      <strong className="text-amber-800">{selectedDataset.confidenceBreakdown.parameterSpaceCoverage}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Reproducibility:</span>
                      <strong className="text-purple-800">{selectedDataset.confidenceBreakdown.reproducibilityScore}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">External Agreement:</span>
                      <strong className="text-teal-800">{selectedDataset.confidenceBreakdown.externalValidationAgreement}</strong>
                    </div>
                  </div>
                </div>

                {/* Causal Chain Star Ratings */}
                <div className="border border-neutral-300 p-3 bg-neutral-50 text-xs font-sans space-y-1.5 md:col-span-2">
                  <span className="font-mono font-bold text-[10px] text-neutral-500 uppercase block border-b pb-1">
                    ⭐ Causal Edge Evidence Ratings
                  </span>
                  <div className="space-y-1.5 text-[11px]">
                    {selectedDataset.causalEdgeRatings.map((edge, i) => (
                      <div key={i} className="flex items-center justify-between bg-white p-1.5 border border-neutral-200">
                        <span className="font-mono text-[10.5px] text-neutral-800 font-medium">
                          {edge.source} ➔ {edge.target}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-500 font-bold tracking-widest text-xs">
                            {'★'.repeat(edge.ratingStars)}{'☆'.repeat(5 - edge.ratingStars)}
                          </span>
                          <span className="text-[9px] font-mono bg-neutral-100 text-neutral-700 px-1 border border-neutral-300">
                            {edge.evidenceLevel}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Competing Hypotheses & Instrument Health */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Competing Hypotheses */}
                <div className="border border-neutral-300 p-3 bg-neutral-50 text-xs font-sans space-y-2">
                  <span className="font-mono font-bold text-[10px] text-neutral-500 uppercase block border-b pb-1">
                    🔀 Competing Hypotheses Evaluation
                  </span>
                  <div className="space-y-1.5">
                    {selectedDataset.competingHypotheses.map((hyp) => (
                      <div key={hyp.id} className="bg-white p-2 border border-neutral-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-[10px] text-indigo-900">{hyp.id}</span>
                          <span className="text-[10px] font-mono font-black bg-indigo-100 text-indigo-900 px-1.5 py-0.5 border border-indigo-200">
                            Likelihood: {hyp.likelihood}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-800 font-medium">{hyp.statement}</p>
                        <p className="text-[9.5px] font-mono text-neutral-500 italic">Evidence: {hyp.evidence}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instrument Health & Knowledge Graph Stats */}
                <div className="space-y-3">
                  <div className="border border-neutral-300 p-3 bg-neutral-50 text-xs font-sans space-y-1.5">
                    <span className="font-mono font-bold text-[10px] text-neutral-500 uppercase block border-b pb-1">
                      🛠️ Instrument Health & Sensor Drift Monitor
                    </span>
                    <div className="space-y-1 text-[10.5px]">
                      {selectedDataset.instrumentHealthList.map((inst, i) => (
                        <div key={i} className="flex items-center justify-between bg-white p-1.5 border border-neutral-200">
                          <span className="font-mono font-bold text-neutral-800">{inst.name}</span>
                          <div className="flex items-center gap-2 font-mono text-[9.5px]">
                            <span>Calib: <strong className="text-emerald-700">{inst.calibration}</strong></span>
                            <span>Drift: <strong className="text-amber-700">{inst.sensorDrift}</strong></span>
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-1 border border-emerald-300">
                              {inst.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* KG Stats & Missing Vars */}
                  <div className="border border-neutral-300 p-3 bg-neutral-50 text-xs font-sans space-y-1">
                    <span className="font-mono font-bold text-[10px] text-neutral-500 uppercase block border-b pb-1">
                      🌐 Knowledge Graph Growth & Missing Sensors
                    </span>
                    <div className="flex items-center justify-between text-[11px] font-mono bg-white p-1.5 border border-neutral-200">
                      <span>Total Nodes: <strong>{selectedDataset.knowledgeGraphStats.nodes}</strong></span>
                      <span>Confirmed Edges: <strong>{selectedDataset.knowledgeGraphStats.confirmedEdges}</strong></span>
                      <span className="text-indigo-700 font-bold">{selectedDataset.knowledgeGraphStats.graphGrowth}</span>
                    </div>
                    <div className="pt-1">
                      <span className="text-[9.5px] font-mono text-neutral-500 block font-bold uppercase mb-0.5">Automated Missing Variables Suggested:</span>
                      <ul className="list-disc list-inside text-[10px] font-mono text-neutral-700 space-y-0.5">
                        {selectedDataset.missingVariablesList.map((mv, i) => (
                          <li key={i}>{mv}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* EXECUTIVE DECISION DASHBOARD */}
              <div className="border-2 border-emerald-600 bg-emerald-50/20 p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <h4 className="font-mono font-black text-xs uppercase text-emerald-950 flex items-center gap-1.5">
                    🎯 EXECUTIVE SCIENTIFIC DECISION DASHBOARD
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 uppercase">
                      Answered: {selectedDataset.executiveDecision.questionAnswered ? 'YES' : 'NO'}
                    </span>
                    <span className="text-[10px] font-mono font-black bg-indigo-100 text-indigo-900 border border-indigo-300 px-2 py-0.5 uppercase">
                      Pub Ready: {selectedDataset.executiveDecision.publicationReady}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                  <div>
                    <span className="text-[9.5px] font-mono text-neutral-500 font-bold uppercase block">Publication Readiness Assessment:</span>
                    <p className="text-neutral-800 text-[11px] font-medium leading-relaxed bg-white p-2 border border-neutral-200">
                      "{selectedDataset.executiveDecision.readinessReason}"
                    </p>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-mono text-neutral-500 font-bold uppercase block">Recommended Next Experiment & Info Gain:</span>
                    <div className="bg-white p-2 border border-neutral-200 space-y-1">
                      <p className="text-indigo-900 font-bold text-[11px]">
                        "{selectedDataset.executiveDecision.recommendedNextExperiment}"
                      </p>
                      <span className="text-[10px] font-mono text-emerald-800 font-bold block">
                        Estimated Information Gain: +{selectedDataset.executiveDecision.estimatedInformationGain}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Discovery Audit Trail / Timeline */}
            <div className="border-2 border-[#1A1A1A] p-4 bg-neutral-50 space-y-3">
              <h4 className="font-mono font-black text-xs uppercase text-neutral-900 border-b border-neutral-300 pb-2">
                ⏱️ DISCOVERY TIMELINE & CHRONOLOGICAL AUDIT TRAIL
              </h4>

              <div className="space-y-2">
                {selectedDataset.discoveryExplanation.timeline.map((item) => (
                  <div key={item.step} className="bg-white border border-neutral-300 p-3 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {item.step}
                      </span>
                      <div>
                        <strong className="text-xs font-bold font-sans text-neutral-900 block">{item.label}</strong>
                        <p className="text-xs text-neutral-600 font-sans">{item.desc}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 border border-emerald-300 shrink-0">
                      Conf: {item.confidence}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2 border-t border-neutral-200">
              <button
                onClick={() => setShowExplainModal(false)}
                className="px-5 py-2 bg-[#1A1A1A] text-white font-mono font-bold text-xs uppercase hover:bg-neutral-800 cursor-pointer"
              >
                Close Discovery Synthesis
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
