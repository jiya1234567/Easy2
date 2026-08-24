/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PolicyCategory = 'environment' | 'infrastructure' | 'energy' | 'transport' | 'health';

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  role: 'citizen' | 'expert' | 'planner';
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'policy' | 'resource' | 'population' | 'hazard' | 'boundary';
  x: number;
  y: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: string; // e.g., "Blocks", "Influences", "Near", "Depletes"
}

export interface SpatialGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface CounterfactualScenario {
  parameterName: string;
  originalValue: string;
  alternativeValue: string;
  outcome: string;
}

export interface SimulationData {
  predictions: string[];
  spatialGraph: SpatialGraph;
  citizenImpact: {
    approval: number;
    economicGrowth: number;
    environmentalIndex: number;
  };
  counterfactuals: CounterfactualScenario[];
}

export interface PolicyProposal {
  id: string;
  title: string;
  description: string;
  category: PolicyCategory;
  creator: string;
  coordinates: { x: number; y: number; z: number };
  status: 'active' | 'proposed' | 'testing';
  votes: { up: number; down: number; neutral: number };
  comments: Comment[];
  physicalParams: {
    intensity: number; // 0 - 100
    radius: number;     // 5 - 50 meters
    cost: number;       // millions USD
    duration: number;   // months
  };
  simulationData: SimulationData | null;
}

export interface WorldState {
  windVector: { x: number; y: number };
  diffusionRate: number;
  gravityFactor: number;
  heatFactor: number;
  waterLevel: number;
  counterfactualMode: boolean;
}

export interface TemporalEvent {
  id: string;
  time: number; // frame count or timestamp
  objectId: string;
  action: 'appeared' | 'moved' | 'accelerated' | 'interacted';
  details: string;
}

export interface SpatialObject {
  id: string;
  type: 'policy_source' | 'pollutant' | 'agent' | 'resource' | 'barrier';
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number; // remaining life frames
  label: string;
}

export interface Experiment {
  id: string;
  name: string;
  strength: number; // e.g., variable input
  score: number;    // output metric
  outcome: string;
  status: 'queued' | 'running' | 'completed';
}

export interface ScientificSweep {
  id: string;
  timestamp: string;
  domain: string;
  totalRuns: number;
  meanError: string;
  confidence: string;
  failureRate: string;
  hashSignature: string;
  calibratedHeat: number;
  calibratedDiffusion: number;
  calibratedWindX: number;
  calibratedWindY: number;
  verifier: string;
}

export interface StateTensor {
  spatial: { x: number; y: number; z?: number };
  temporal: { t: number; dt: number };
  features: Record<string, number>;
}

export interface HardwareState {
  gpu: { temp: number; memoryUsage: number; clockSpeed: number };
  cpu: { load: number; temp: number };
  bitErrors: number;
}

export interface BenchmarkResult {
  model: string;
  mae: number;
  rSquared: number;
  latencyMs: number;
}

// --- RSD v1 Types ---

export type FailureThresholds = {
  economics: {
    mae: number;       // Mean Absolute Error
    rSquared: number;  // R² score
    ciWidth: number;   // Confidence Interval width
  };
  quantum: {
    energyError: number; // % error in energy calculation
    magnetizationError: number; // % error in magnetization
  };
  weather: {
    pathErrorKm: number; // Max allowed path deviation (km)
    tempError: number;    // Max allowed temperature error (°C)
  };
  materials: {
    stressError: number; // % error in stress calculation
    defectRate: number;   // Max allowed defect rate
  };
  default: {
    mae: number;
    rSquared: number;
  };
};

export type FailureType =
  | 'missing_data'
  | 'wrong_assumption'
  | 'sensor_error'
  | 'physics_violation'
  | 'numerical_instability'
  | 'cross_domain_mismatch'
  | 'unknown';

export type FailureDiagnosis = {
  failureType: FailureType;
  rootCause: string;
  proposedFix: string;
  confidence: number;
  severity: number;
};

export type DataSource =
  | { type: 'static'; path: string }
  | { type: 'api'; endpoint: string; params?: Record<string, any> }
  | { type: 'user'; prompt: string }
  | { type: 'synthetic'; generator: string; params?: Record<string, any> };

export type DataAcquisitionLog = {
  experimentId: string;
  missingData: string;
  source: DataSource;
  success: boolean;
  data?: any;
  timestamp: Date;
};

export type CausalGraph = {
  nodes: string[];
  edges: { from: string; to: string; confidence: number; evidence: string[] }[];
  version: number;
  lastUpdated: Date;
  domain: string;
};

export type RecursiveDiscoveryEntry = {
  cycle: number;
  purpose: string;
  failure: string;
  missingObservation: string;
  newExperiment: string;
  improvement: string;
  confidence: number;
  domain: string;
  timestamp: Date;
  experimentId: string;
};

export type DiscoveryScores = {
  novelVariablesPer100: number;
  assumptionsRemovedPerExperiment: number;
  newCausalLinksPerDomain: Record<string, number>;
  experimentsSavedPercent: number;
  uncertaintyReducedPercent: number;
  crossDomainReuse: number;
};

export type TerminationConditions = {
  maxCycles: number;
  minImprovement: number; // Minimum improvement per cycle (e.g., 0.01)
  maxRuntimeMs: number;   // Max total runtime in milliseconds
  maxCost: number;         // Max cost in dollars
  maxGpuTemp: number;     // Max GPU temperature in °C
};

// Default thresholds
export const DEFAULT_FAILURE_THRESHOLDS: FailureThresholds = {
  economics: { mae: 0.05, rSquared: 0.85, ciWidth: 0.04 },
  quantum: { energyError: 0.01, magnetizationError: 0.05 },
  weather: { pathErrorKm: 10, tempError: 2.0 },
  materials: { stressError: 0.05, defectRate: 0.01 },
  default: { mae: 0.05, rSquared: 0.85 },
};

// --- Physical-AI Harness Types & Governance Schemas ---

export enum RiskLevel {
  LEVEL_A_MEMORY = "LOW",             // Dynamic retrieval/weight re-indexing
  LEVEL_B_REASONING = "MODERATE",     // Prompt, routing, temperature, thresholds
  LEVEL_C_WORKFLOW = "HIGH",          // Tool injection, DAG mutation, sensor sequence
  LEVEL_D_CODE_DEVICE = "CRITICAL"    // Firmware, physical device actuation, robotic motion
}

export interface SensoryFrame {
  timestamp: number;
  frameId: string;
  cameraRgbd?: {
    resolution: [number, number];
    depthRangeMeters: [number, number];
    pointCloudSampleCount: number;
  };
  tactileGrid: {
    leftFingerPressureN: number;
    rightFingerPressureN: number;
    shearFriction: number;
    slipDetected: boolean;
  };
  jointEncodersRad: number[];        // 7-DOF arm joint angles [q0..q6]
  jointTorquesNm: number[];          // 7-DOF joint torques [tau0..tau6]
  endEffectorPose: {
    x: number;
    y: number;
    z: number;
    roll: number;
    pitch: number;
    yaw: number;
    gripperOpeningM: number;
  };
  imu: {
    accel: [number, number, number]; // m/s^2
    gyro: [number, number, number];  // rad/s
  };
  ambientSensors: {
    tempC: number;
    humidityPct: number;
    acousticNoiseDb: number;
  };
}

export interface PhysicalNodeEntity {
  id: string;
  label: string;
  category: 'dishware' | 'appliance' | 'obstacle' | 'rack' | 'tool';
  pose: [number, number, number];           // x, y, z meters
  orientation: [number, number, number];    // roll, pitch, yaw deg
  boundingBox: [number, number, number];    // dx, dy, dz meters
  massKg: number;
  frictionCoeff: number;
  fragilityIndex: number;                   // 0.0 (rugged) to 1.0 (ultra-delicate glass)
  graspStatus: 'free' | 'grasped' | 'seated' | 'obstructed';
  recommendedGripForceN: number;
  targetRackSlot?: string;
}

export interface PhysicalWorldStateTensor {
  entities: PhysicalNodeEntity[];
  kinematicChains: {
    jointIndex: number;
    name: string;
    angleRad: number;
    velocityRadS: number;
    torqueNm: number;
    limitMinRad: number;
    limitMaxRad: number;
    tempC: number;
  }[];
  causalHypergraphEdges: {
    id: string;
    source: string;
    target: string;
    relation: 'supports' | 'contains' | 'grasped_by' | 'obstructs' | 'clears_with' | 'adjacent_to';
    confidence: number;
    stressThresholdN: number;
  }[];
  thermodynamicEnvelope: {
    tempKelvin: number;
    vibrationG: number;
    pressureHpa: number;
  };
}

export interface ActionCandidate {
  actionId: string;
  stepName: string;
  type: 'trajectory' | 'grasp' | 'insert' | 'release' | 'scan' | 'emergency_stop';
  targetEntityId: string;
  riskLevel: RiskLevel;
  waypoints: {
    x: number;
    y: number;
    z: number;
    speedMPerS: number;
    maxTorqueNm: number;
  }[];
  gripperForceTargetN: number;
  expectedDurationMs: number;
  symbolicPreconditions: string[];
  postConditions: string[];
}

export interface VerificationRecord {
  actionId: string;
  collisionFree: boolean;
  torqueWithinLimits: boolean;
  slipRiskIndex: number;
  fragilityPreserved: boolean;
  sprayArmClearanceM: number;
  symbolicPass: boolean;
  governanceApproved: boolean;
  governanceTier: RiskLevel;
  humanAuthorizationToken?: string;
  vetoReason?: string;
  subconsciousPriorScore: number;
  discrepancyErrorPct: number;
}

export interface SubconsciousIntuition {
  patternId: string;
  domain: string;
  historicalSampleCount: number;
  priorConfidence: number;
  latentTorqueCorrectionNm: number[];
  recommendedMicroDamping: number;
  anomalyWarning?: string;
  timestamp: string;
}

export interface DishwasherScenarioStep {
  stepNumber: number;
  title: string;
  subsystem: 'PERCEPTION' | 'DIGITAL_TWIN' | 'SIM_CHECK' | 'GOVERNANCE' | 'ROBOT_ACTUATION' | 'REALITY_ANCHOR' | 'SUBCONSCIOUS';
  description: string;
  hardwareCommand: string;
  riskLevel: RiskLevel;
  expectedTelemetry: {
    gripperForceN?: number;
    torquePeakNm?: number;
    sprayArmClearanceMm?: number;
    tactileSlipIndex?: number;
    errorDeviationPct?: number;
  };
}



