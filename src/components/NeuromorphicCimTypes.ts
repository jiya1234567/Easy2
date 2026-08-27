// src/components/NeuromorphicCimTypes.ts
// OMEGA Neuromorphic + Compute-in-Memory (CIM) + Flash/NAND Hierarchical Memory Architecture

export type DataTemperature = 'hot' | 'warm' | 'cool' | 'cold' | 'learned' | 'safety';

export interface DataTemperatureCategory {
  id: DataTemperature;
  label: string;
  iconSymbol: string;
  badgeColor: string;
  destination: string;
  physicalTechnology: string;
  characteristics: string;
  typicalPayloads: string[];
  accessFrequency: string;
  targetLatencyNs: number;
}

export const DATA_TEMPERATURE_REGIME: DataTemperatureCategory[] = [
  {
    id: 'hot',
    label: 'HOT',
    iconSymbol: '🔥',
    badgeColor: 'bg-red-950 text-red-300 border-red-500',
    destination: 'SRAM / CIM Macro Arrays',
    physicalTechnology: '10T/8T SRAM-CIM + Memristive Crossbars',
    characteristics: 'Continuous parallel MVM/MAC vector operations, high read/write cycle rate',
    typicalPayloads: ['Active neural synaptic weights', 'Current state tensor', 'Spike-state vectors', 'Recurrent hidden states', 'Hot hypergraph neighborhoods'],
    accessFrequency: 'Continuously (200 MHz - 1.2 GHz)',
    targetLatencyNs: 0.8
  },
  {
    id: 'warm',
    label: 'WARM',
    iconSymbol: '🟠',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-500',
    destination: 'L2/L3 Cache & Working DRAM',
    physicalTechnology: 'High-bandwidth LPDDR5 / eDRAM buffer',
    characteristics: 'Working datasets, candidate action buffers, rolling window sliding state',
    typicalPayloads: ['Observation sliding buffers', 'Pre-staged memory pages', 'Intermediate layer activations', 'Subconscious prior buffers'],
    accessFrequency: 'Frequent (10 kHz - 100 MHz)',
    targetLatencyNs: 12.5
  },
  {
    id: 'cool',
    label: 'COOL',
    iconSymbol: '🔵',
    badgeColor: 'bg-blue-950 text-blue-300 border-blue-500',
    destination: 'NOR Flash / Fast 3D Flash',
    physicalTechnology: 'High-speed SPI/eMMC NOR Flash',
    characteristics: 'Occasional access, calibration tables, immutable firmware code blocks',
    typicalPayloads: ['QPU & Qubit calibration tables', 'Kinematic CAD meshes', 'Sensor calibration curves', 'Standard operating procedures (SOP)'],
    accessFrequency: 'Periodic / On-Demand (100 Hz - 1 kHz)',
    targetLatencyNs: 240
  },
  {
    id: 'cold',
    label: 'COLD',
    iconSymbol: '⚫',
    badgeColor: 'bg-neutral-900 text-neutral-300 border-neutral-600',
    destination: '3D TLC/QLC NAND Flash Archive',
    physicalTechnology: 'High-density 3D NAND Flash (Non-volatile)',
    characteristics: 'Historical logs, episodic memory snapshots, long-term experiment provenance',
    typicalPayloads: ['Complete sensor trajectory logs', 'Historical failed trajectories', 'Cryptographic compliance audit trails', 'Raw LiDAR point clouds'],
    accessFrequency: 'Infrequent (1 Hz - Hourly Archive)',
    targetLatencyNs: 25000
  },
  {
    id: 'learned',
    label: 'LEARNED',
    iconSymbol: '🧠',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-500',
    destination: 'NAND Checkpoint Store + Distilled Model Store',
    physicalTechnology: 'Wear-leveled high-retention NAND Flash',
    characteristics: 'Distilled neural weights, world model checkpoints, discovered physical parameters',
    typicalPayloads: ['Discovered material parameters', 'Distilled SLLM weights', 'Subconscious prior embeddings', 'Optimal hardware-software co-design rules'],
    accessFrequency: 'Session-based updates',
    targetLatencyNs: 12000
  },
  {
    id: 'safety',
    label: 'SAFETY',
    iconSymbol: '🚨',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-500',
    destination: 'Protected SRAM & Deterministic Digital Logic',
    physicalTechnology: 'ECC-protected Dual-Rail Hardened SRAM',
    characteristics: 'Zero-stale tolerance, hard symbolic VETO constraints, emergency torque limits',
    typicalPayloads: ['Level A-D Governance limits', 'Fragile glass force clamp (<4.5N)', 'Joint torque ceilings (<28Nm)', 'HITL cryptographic auth keys'],
    accessFrequency: 'Immediate / Cycle-by-cycle guarantee',
    targetLatencyNs: 0.4
  }
];

export type WorkloadArchitectureType = 'conventional' | 'pure_cim' | 'omega_hybrid';

export interface WorkloadArchitectureComparison {
  id: WorkloadArchitectureType;
  name: string;
  dataflowPipeline: string;
  energyPerInferenceUj: number;
  memoryBusTrafficGbps: number;
  inferenceLatencyUs: number;
  nandWriteRateMbS: number;
  modelAccuracyPct: number;
  thermalLoadC: number;
  cimUtilizationPct: number;
  spikeSparsityPct: number;
  advantages: string;
  bottleneck: string;
}

export const WORKLOAD_COMPARISONS: WorkloadArchitectureComparison[] = [
  {
    id: 'conventional',
    name: 'Experiment A: Conventional Von-Neumann',
    dataflowPipeline: 'Sensors → Working DRAM → Host CPU/GPU Bus → Working DRAM → Model Output',
    energyPerInferenceUj: 48.6,
    memoryBusTrafficGbps: 18.4,
    inferenceLatencyUs: 240,
    nandWriteRateMbS: 18.2,
    modelAccuracyPct: 94.6,
    thermalLoadC: 58.4,
    cimUtilizationPct: 0,
    spikeSparsityPct: 0,
    advantages: 'Familiar software toolchain, arbitrary high-precision FP32 math',
    bottleneck: 'Von-Neumann memory wall, high bus energy dissipation, thermal throttling'
  },
  {
    id: 'pure_cim',
    name: 'Experiment B: Pure SRAM-CIM Homogeneous',
    dataflowPipeline: 'Sensors → All Layers in SRAM-CIM Arrays → Digital Controller',
    energyPerInferenceUj: 14.2,
    memoryBusTrafficGbps: 2.1,
    inferenceLatencyUs: 38,
    nandWriteRateMbS: 0.5,
    modelAccuracyPct: 91.8,
    thermalLoadC: 49.8,
    cimUtilizationPct: 96,
    spikeSparsityPct: 45,
    advantages: 'Minimal bus movement, ultra-fast analog vector-matrix multiplication',
    bottleneck: 'ADC/DAC conversion overhead, device noise sensitivity in safety layers, lack of long-term memory'
  },
  {
    id: 'omega_hybrid',
    name: 'Experiment C: OMEGA Neuromorphic CIM-NAND Hybrid',
    dataflowPipeline: 'Sensors → Event Spike Encoder → SRAM/CIM (Hot) → Neuromorphic State → SLLM Reasoning → NAND Consolidation',
    energyPerInferenceUj: 6.8,
    memoryBusTrafficGbps: 5.2,
    inferenceLatencyUs: 51,
    nandWriteRateMbS: 9.0,
    modelAccuracyPct: 94.7,
    thermalLoadC: 45.2,
    cimUtilizationPct: 81,
    spikeSparsityPct: 78,
    advantages: 'Optimal balanced multi-objective fitness: high accuracy, low bus traffic, thermal stability & zero NAND wear penalty',
    bottleneck: 'Requires heterogeneous CIM compiler and dynamic temperature classification'
  }
];

export interface CimTelemetrySweepEvent {
  step: number;
  sensor_event_rate_hz: number;
  spike_sparsity_pct: number;
  sram_cim_utilization_pct: number;
  flash_read_rate_mb_s: number;
  nand_write_rate_mb_s: number;
  memory_bus_traffic_gbps: number;
  cim_energy_nj_per_mac: number;
  inference_latency_us: number;
  model_accuracy_pct: number;
  thermal_c: number;
  nand_endurance_cost: number;
  is_optimal?: boolean;
  notes?: string;
}

export const CIM_TELEMETRY_DATASET: CimTelemetrySweepEvent[] = [
  { step: 1, sensor_event_rate_hz: 1000, spike_sparsity_pct: 92, sram_cim_utilization_pct: 22, flash_read_rate_mb_s: 20, nand_write_rate_mb_s: 2, memory_bus_traffic_gbps: 12.4, cim_energy_nj_per_mac: 1.80, inference_latency_us: 84, model_accuracy_pct: 94.1, thermal_c: 39.2, nand_endurance_cost: 0.12, notes: 'Under-utilized CIM arrays, high off-chip bus fallback' },
  { step: 2, sensor_event_rate_hz: 2000, spike_sparsity_pct: 90, sram_cim_utilization_pct: 31, flash_read_rate_mb_s: 25, nand_write_rate_mb_s: 3, memory_bus_traffic_gbps: 11.2, cim_energy_nj_per_mac: 1.70, inference_latency_us: 78, model_accuracy_pct: 94.2, thermal_c: 40.1, nand_endurance_cost: 0.16, notes: 'Early spike filtering active' },
  { step: 3, sensor_event_rate_hz: 4000, spike_sparsity_pct: 88, sram_cim_utilization_pct: 43, flash_read_rate_mb_s: 31, nand_write_rate_mb_s: 4, memory_bus_traffic_gbps: 9.8, cim_energy_nj_per_mac: 1.60, inference_latency_us: 71, model_accuracy_pct: 94.3, thermal_c: 41.4, nand_endurance_cost: 0.21, notes: 'Intermediate activation staging in DRAM' },
  { step: 4, sensor_event_rate_hz: 8000, spike_sparsity_pct: 85, sram_cim_utilization_pct: 56, flash_read_rate_mb_s: 38, nand_write_rate_mb_s: 5, memory_bus_traffic_gbps: 8.1, cim_energy_nj_per_mac: 1.50, inference_latency_us: 64, model_accuracy_pct: 94.5, thermal_c: 42.7, nand_endurance_cost: 0.29, notes: 'Transition to mixed-precision INT8 CIM weights' },
  { step: 5, sensor_event_rate_hz: 16000, spike_sparsity_pct: 82, sram_cim_utilization_pct: 68, flash_read_rate_mb_s: 44, nand_write_rate_mb_s: 7, memory_bus_traffic_gbps: 6.7, cim_energy_nj_per_mac: 1.40, inference_latency_us: 57, model_accuracy_pct: 94.6, thermal_c: 44.0, nand_endurance_cost: 0.38, notes: 'Neuromorphic spike rate scaling' },
  { step: 6, sensor_event_rate_hz: 32000, spike_sparsity_pct: 78, sram_cim_utilization_pct: 81, flash_read_rate_mb_s: 51, nand_write_rate_mb_s: 9, memory_bus_traffic_gbps: 5.2, cim_energy_nj_per_mac: 1.30, inference_latency_us: 51, model_accuracy_pct: 94.7, thermal_c: 45.2, nand_endurance_cost: 0.51, is_optimal: true, notes: '★ GLOBAL CO-DESIGN OPTIMUM: Balanced accuracy, energy, latency & thermal limits' },
  { step: 7, sensor_event_rate_hz: 64000, spike_sparsity_pct: 74, sram_cim_utilization_pct: 91, flash_read_rate_mb_s: 57, nand_write_rate_mb_s: 12, memory_bus_traffic_gbps: 4.1, cim_energy_nj_per_mac: 1.28, inference_latency_us: 48, model_accuracy_pct: 94.7, thermal_c: 46.1, nand_endurance_cost: 0.67, notes: '⚠️ Over-saturation: Thermal wall at 46.1°C + high NAND endurance wear penalty' },
  { step: 8, sensor_event_rate_hz: 32000, spike_sparsity_pct: 79, sram_cim_utilization_pct: 84, flash_read_rate_mb_s: 52, nand_write_rate_mb_s: 10, memory_bus_traffic_gbps: 5.0, cim_energy_nj_per_mac: 1.34, inference_latency_us: 53, model_accuracy_pct: 94.6, thermal_c: 45.4, nand_endurance_cost: 0.54, notes: 'Thermal throttling recovery check' },
  { step: 9, sensor_event_rate_hz: 16000, spike_sparsity_pct: 84, sram_cim_utilization_pct: 69, flash_read_rate_mb_s: 43, nand_write_rate_mb_s: 7, memory_bus_traffic_gbps: 6.8, cim_energy_nj_per_mac: 1.48, inference_latency_us: 61, model_accuracy_pct: 94.5, thermal_c: 43.8, nand_endurance_cost: 0.36, notes: 'Controlled ramp-down' },
  { step: 10, sensor_event_rate_hz: 8000, spike_sparsity_pct: 89, sram_cim_utilization_pct: 51, flash_read_rate_mb_s: 35, nand_write_rate_mb_s: 4, memory_bus_traffic_gbps: 8.9, cim_energy_nj_per_mac: 1.62, inference_latency_us: 70, model_accuracy_pct: 94.3, thermal_c: 42.0, nand_endurance_cost: 0.23, notes: 'Baseline hysteresis validation' }
];

export interface HardwareSoftwareCoDesignDiscovery {
  id: string;
  discoveryNumber: number;
  title: string;
  question: string;
  discoveredRule: string;
  quantitativeMetric: string;
  scientificImpact: string;
  status: 'CONFIRMED' | 'SIMULATION_VALIDATED' | 'HARDWARE_TESTED';
}

export const CO_DESIGN_DISCOVERIES: HardwareSoftwareCoDesignDiscovery[] = [
  {
    id: 'disc_adaptive_placement',
    discoveryNumber: 1,
    title: 'Adaptive Layer Memory Placement',
    question: 'Which neural layers should live in SRAM-CIM versus conventional digital compute?',
    discoveredRule: 'Early perceptual and convolutional/recurrent layers (L1–L4) tolerate INT4/INT8 analog MAC and map to SRAM-CIM, while safety-critical symbolic reasoning (L5–L6) must remain in digital logic to guarantee zero error.',
    quantitativeMetric: '81% of weights in CIM / 19% in digital yields 58% bus reduction with 0.0% safety degradation',
    scientificImpact: 'Prevents analog ADC noise from contaminating deterministic Level D VETO gates.',
    status: 'CONFIRMED'
  },
  {
    id: 'disc_spike_compression',
    discoveryNumber: 2,
    title: 'Spike Compression & Sparsity Boundary',
    question: 'How sparse can event representations become before prediction accuracy collapses?',
    discoveredRule: 'Spike sparsity can reach up to 78% without perceptible loss in task precision; exceeding 85% causes degradation in high-frequency tactile micro-slip detection.',
    quantitativeMetric: 'Optimal sparsity setpoint = 78.0% (Accuracy maintained at 94.7%)',
    scientificImpact: 'Reduces dynamic synaptic energy dissipation by 3.8x compared to dense framing.',
    status: 'CONFIRMED'
  },
  {
    id: 'disc_memory_hierarchy',
    discoveryNumber: 3,
    title: 'Hierarchical Memory Consolidation',
    question: 'What information should be retained locally versus consolidated into NAND?',
    discoveredRule: 'Active synaptic weights and 50ms state sliding windows reside in SRAM; model checkpoints, failure trajectories, and episodic provenance are compressed and asynchronously committed to 3D NAND.',
    quantitativeMetric: 'Asynchronous write coalescing cuts NAND write amplification factor from 4.2 to 1.15',
    scientificImpact: 'Protects 3D NAND endurance cycles while preserving full reproducibility audit trails.',
    status: 'CONFIRMED'
  },
  {
    id: 'disc_precision_allocation',
    discoveryNumber: 4,
    title: 'Mixed-Precision Sensitivity Allocation',
    question: 'Which operations require 8/16-bit precision and which tolerate lower precision?',
    discoveredRule: 'First-layer sensory spatial feature maps operate at INT4/INT8 inside CIM crossbars; kinematic matrix inversions and torque safety limits require exact FP32 digital arithmetic.',
    quantitativeMetric: 'INT4/INT8 for 81% of operations yields 3.2x energy improvement',
    scientificImpact: 'Eliminates unnecessary high-precision ADC power dissipation in intermediate tensor steps.',
    status: 'CONFIRMED'
  },
  {
    id: 'disc_learned_scheduling',
    discoveryNumber: 5,
    title: 'Learned Memory Scheduling & Pre-Staging',
    question: 'Can OMEGA predict which memory blocks will be needed next and pre-stage them?',
    discoveredRule: 'The Subconscious Engine uses action-conditioned trajectory forecasts to pre-fetch upcoming object kinematic meshes from Flash to DRAM 15ms prior to physical contact.',
    quantitativeMetric: 'Cache hit rate increases from 74% to 96.8%; zero stall latency on contact',
    scientificImpact: 'Enables sub-millisecond reaction times during high-speed robotic manipulation.',
    status: 'CONFIRMED'
  },
  {
    id: 'disc_nand_aware_learning',
    discoveryNumber: 6,
    title: 'NAND-Aware Lifetime Endurance Optimization',
    question: 'Can the learning algorithm reduce unnecessary writes while retaining the same scientific performance?',
    discoveredRule: 'Differential weight updates are accumulated in volatile SRAM and only written to NAND Flash when cumulative divergence exceeds the 2σ significance threshold.',
    quantitativeMetric: 'Reduces total NAND write cycles by 76% (extends QPU embedded drive lifespan from 1.4 years to 9.2 years)',
    scientificImpact: 'Makes high-throughput autonomous continuous physical learning economically viable.',
    status: 'CONFIRMED'
  },
  {
    id: 'disc_noise_as_resource',
    discoveryNumber: 7,
    title: 'Hardware Stochasticity & Device Noise as Resource',
    question: 'Can controlled CIM memory and ADC noise improve exploration rather than being a pure error?',
    discoveredRule: 'Inherent thermal and crossbar resistance variability provides natural physical entropy for exploratory policy rollouts, replacing computationally expensive pseudo-random number generators.',
    quantitativeMetric: 'Entropy harvesting improves policy exploration diversity by 22% with 0mW extra compute',
    scientificImpact: 'Transforms physical hardware imperfections into a constructive computational primitive.',
    status: 'SIMULATION_VALIDATED'
  }
];

export interface CimCompilerStage {
  stepNumber: number;
  name: string;
  description: string;
  status: 'PENDING' | 'ANALYZING' | 'OPTIMIZED' | 'VERIFIED';
  outputArtifact: string;
}

export const CIM_COMPILER_PIPELINE: CimCompilerStage[] = [
  { stepNumber: 1, name: 'MODEL INGESTION', description: 'Parse neural graph architecture and recurrent state dynamics', status: 'VERIFIED', outputArtifact: 'PyTorch/ONNX Graph IR' },
  { stepNumber: 2, name: 'GRAPH ANALYSER', description: 'Extract layer data dependencies, recurrent feedback loops and tensor shapes', status: 'VERIFIED', outputArtifact: 'Directed Acyclic Graph (DAG)' },
  { stepNumber: 3, name: 'LAYER SENSITIVITY ANALYSIS', description: 'Compute Hessian eigenspectrum to quantify noise tolerance per layer', status: 'VERIFIED', outputArtifact: 'Layer Sensitivity Profile' },
  { stepNumber: 4, name: 'MEMORY PLACEMENT', description: 'Partition layers across SRAM-CIM (Hot), DRAM (Warm), Flash (Cool), NAND (Cold)', status: 'VERIFIED', outputArtifact: 'Memory Allocation Map' },
  { stepNumber: 5, name: 'PRECISION SELECTION', description: 'Assign INT4/INT8 to CIM arrays and FP32 to digital safety blocks', status: 'VERIFIED', outputArtifact: 'Mixed-Precision Quantization Table' },
  { stepNumber: 6, name: 'SPIKE CONVERSION', description: 'Encode continuous sensory streams into sparse event-driven spikes', status: 'VERIFIED', outputArtifact: 'LIF Spike Encoding Parameters' },
  { stepNumber: 7, name: 'CIM MAPPING', description: 'Place synaptic weights onto physical 10T SRAM/Memristor crossbar tiles', status: 'VERIFIED', outputArtifact: 'Crossbar Weight Matrices' },
  { stepNumber: 8, name: 'DATAFLOW OPTIMIZATION', description: 'Schedule parallel tile activations to minimize intermediate ADC conversions', status: 'VERIFIED', outputArtifact: 'Dataflow Execution Schedule' },
  { stepNumber: 9, name: 'HARDWARE SIMULATION', description: 'Simulate device nonidealities, thermal dissipation, and ADC noise', status: 'VERIFIED', outputArtifact: 'Physical Emulation Telemetry' },
  { stepNumber: 10, name: 'SYMBOLIC VERIFICATION', description: 'Verify deterministic compliance with Level A-D Governance Gate limits', status: 'VERIFIED', outputArtifact: 'Cryptographic VETO Certificate' },
  { stepNumber: 11, name: 'HARDWARE DEPLOY', description: 'Flash weights to physical OMEGA Neuromorphic-CIM-NAND Fabric', status: 'VERIFIED', outputArtifact: 'Firmware Bitstream (Ready)' }
];

export interface ScientificCoDesignDiscoveryOutput {
  discovery: {
    optimal_cim_utilization_pct: number;
    optimal_spike_sparsity_pct: number;
    memory_bus_reduction_pct: number;
    energy_reduction_pct: number;
    accuracy_change_pct: number;
    nand_write_reduction_pct: number;
    optimal_operating_point: {
      sensor_rate_hz: number;
      latency_us: number;
      thermal_load_c: number;
      cim_energy_nj_per_mac: number;
    };
  };
  hypothesis: string;
  confidence: number;
  reality_anchor: string;
  next_experiment: string;
  provenance: {
    compiler_version: string;
    target_hardware: string;
    timestamp_iso: string;
    verification_hash: string;
  };
}
