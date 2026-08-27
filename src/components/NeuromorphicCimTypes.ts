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

// GAP A: Memory movement as a first-class scientific variable
export interface DataMovementAccounting {
  bytes_sensor_to_memory: number;
  bytes_memory_to_compute: number;
  bytes_compute_to_memory: number;
  bytes_off_chip: number;
  memory_bus_transactions: number;
  data_movement_energy_pj: number;
}

// GAP C: Analog CIM Digital Truth Layer
export interface DigitalTruthVerification {
  cim_output: number;
  adc_output: number;
  quantization_error: number;
  device_variation: number;
  temperature_drift: number;
  digital_reference: number;
  verification: 'PASS' | 'VETO_EXCEEDED' | 'CALIBRATION_TRIGGERED';
}

// GAP D: Episodic Scientific Experience Memory in NAND
export interface EpisodicExperienceLog {
  episode: number;
  sensor_signature: string;
  cim_configuration: string;
  precision: 'INT2' | 'INT4' | 'INT8' | 'INT16' | 'FP16' | 'FP32';
  thermal_state: number;
  prediction: number;
  reality: number;
  error: number;
  result: 'PASS' | 'CALIBRATE' | 'VETO';
  lesson: string;
}

// GAP E: Memory Wear Predictor across non-volatile substrates
export interface MemorySubstrateWearProfile {
  technology: 'SRAM' | 'DRAM' | 'NOR' | 'NAND' | 'MRAM' | 'ReRAM' | 'PCM';
  latencyNs: number;
  energyPjPerBit: number;
  retentionYears: string;
  enduranceCycles: string;
  optimalTemperature: string;
  wearFactorPerHour: number;
  status: 'OPTIMAL' | 'MODERATE_WEAR' | 'PROTECTED';
}

export const MEMORY_SUBSTRATES_TABLE: MemorySubstrateWearProfile[] = [
  { technology: 'SRAM', latencyNs: 0.8, energyPjPerBit: 0.12, retentionYears: 'Volatile', enduranceCycles: '> 10^16', optimalTemperature: 'HOT', wearFactorPerHour: 0.00, status: 'OPTIMAL' },
  { technology: 'DRAM', latencyNs: 12.5, energyPjPerBit: 1.80, retentionYears: 'Volatile (64ms)', enduranceCycles: '> 10^16', optimalTemperature: 'WARM', wearFactorPerHour: 0.00, status: 'OPTIMAL' },
  { technology: 'MRAM', latencyNs: 4.5, energyPjPerBit: 0.85, retentionYears: '> 10 years', enduranceCycles: '> 10^12', optimalTemperature: 'WARM/COOL', wearFactorPerHour: 0.02, status: 'OPTIMAL' },
  { technology: 'ReRAM', latencyNs: 18.0, energyPjPerBit: 2.10, retentionYears: '> 10 years', enduranceCycles: '10^6 - 10^8', optimalTemperature: 'HOT (CIM)', wearFactorPerHour: 0.14, status: 'OPTIMAL' },
  { technology: 'PCM', latencyNs: 50.0, energyPjPerBit: 5.40, retentionYears: '> 10 years', enduranceCycles: '10^7 - 10^9', optimalTemperature: 'COOL', wearFactorPerHour: 0.18, status: 'OPTIMAL' },
  { technology: 'NOR', latencyNs: 240.0, energyPjPerBit: 8.20, retentionYears: '> 20 years', enduranceCycles: '10^5', optimalTemperature: 'COOL', wearFactorPerHour: 0.05, status: 'OPTIMAL' },
  { technology: 'NAND', latencyNs: 25000.0, energyPjPerBit: 12.50, retentionYears: '> 10 years', enduranceCycles: '3x10^3 (3D QLC)', optimalTemperature: 'COLD/LEARNED', wearFactorPerHour: 0.42, status: 'PROTECTED' }
];

export interface CimTelemetrySweepEvent {
  step: number;
  variableName: string;
  discoveryTheme: string;
  sensor_event_rate_hz: number;
  spike_sparsity_pct: number;
  sram_cim_utilization_pct: number;
  precision: 'INT2' | 'INT4' | 'INT8' | 'INT16' | 'FP16' | 'FP32';
  flash_read_rate_mb_s: number;
  nand_write_rate_mb_s: number;
  memory_bus_traffic_gbps: number;
  cim_energy_nj_per_mac: number;
  inference_latency_us: number;
  model_accuracy_pct: number;
  thermal_c: number;
  nand_endurance_cost: number;
  dataMovement: DataMovementAccounting;
  digitalTruth: DigitalTruthVerification;
  is_optimal?: boolean;
  notes?: string;
}

// 10-Step OMEGA_CIM_MEMORY_DISCOVERY_001 Benchmark Dataset
export const CIM_TELEMETRY_DATASET: CimTelemetrySweepEvent[] = [
  {
    step: 1,
    variableName: 'CIM 20%',
    discoveryTheme: 'Bus-Dominated Regime',
    sensor_event_rate_hz: 1000,
    spike_sparsity_pct: 92,
    sram_cim_utilization_pct: 20,
    precision: 'INT8',
    flash_read_rate_mb_s: 20,
    nand_write_rate_mb_s: 2,
    memory_bus_traffic_gbps: 12.4,
    cim_energy_nj_per_mac: 1.80,
    inference_latency_us: 84,
    model_accuracy_pct: 94.1,
    thermal_c: 39.2,
    nand_endurance_cost: 0.12,
    dataMovement: { bytes_sensor_to_memory: 128000, bytes_memory_to_compute: 890000, bytes_compute_to_memory: 450000, bytes_off_chip: 1240000, memory_bus_transactions: 38400, data_movement_energy_pj: 14800 },
    digitalTruth: { cim_output: 0.812, adc_output: 0.809, quantization_error: 0.003, device_variation: 0.006, temperature_drift: 0.002, digital_reference: 0.811, verification: 'PASS' },
    notes: 'Bus bottleneck: 78% of tensor transfers fall back to off-chip host DRAM.'
  },
  {
    step: 2,
    variableName: 'CIM 35%',
    discoveryTheme: 'Transfer Reduction Onset',
    sensor_event_rate_hz: 2000,
    spike_sparsity_pct: 90,
    sram_cim_utilization_pct: 35,
    precision: 'INT8',
    flash_read_rate_mb_s: 25,
    nand_write_rate_mb_s: 3,
    memory_bus_traffic_gbps: 11.2,
    cim_energy_nj_per_mac: 1.70,
    inference_latency_us: 78,
    model_accuracy_pct: 94.2,
    thermal_c: 40.1,
    nand_endurance_cost: 0.16,
    dataMovement: { bytes_sensor_to_memory: 256000, bytes_memory_to_compute: 740000, bytes_compute_to_memory: 380000, bytes_off_chip: 1120000, memory_bus_transactions: 32100, data_movement_energy_pj: 12600 },
    digitalTruth: { cim_output: 0.824, adc_output: 0.821, quantization_error: 0.003, device_variation: 0.007, temperature_drift: 0.003, digital_reference: 0.823, verification: 'PASS' },
    notes: 'L1 feature maps mapped into 10T SRAM-CIM arrays; bus traffic begins downward slope.'
  },
  {
    step: 3,
    variableName: 'CIM 50%',
    discoveryTheme: 'First Major Efficiency Gain',
    sensor_event_rate_hz: 4000,
    spike_sparsity_pct: 88,
    sram_cim_utilization_pct: 50,
    precision: 'INT8',
    flash_read_rate_mb_s: 31,
    nand_write_rate_mb_s: 4,
    memory_bus_traffic_gbps: 9.8,
    cim_energy_nj_per_mac: 1.60,
    inference_latency_us: 71,
    model_accuracy_pct: 94.3,
    thermal_c: 41.4,
    nand_endurance_cost: 0.21,
    dataMovement: { bytes_sensor_to_memory: 512000, bytes_memory_to_compute: 580000, bytes_compute_to_memory: 290000, bytes_off_chip: 980000, memory_bus_transactions: 26500, data_movement_energy_pj: 10400 },
    digitalTruth: { cim_output: 0.835, adc_output: 0.831, quantization_error: 0.004, device_variation: 0.008, temperature_drift: 0.004, digital_reference: 0.834, verification: 'PASS' },
    notes: 'Convolutional filter weights fully resident in stationary CIM crossbars.'
  },
  {
    step: 4,
    variableName: 'CIM 65%',
    discoveryTheme: 'Balanced Compute Dataflow',
    sensor_event_rate_hz: 8000,
    spike_sparsity_pct: 85,
    sram_cim_utilization_pct: 65,
    precision: 'INT8',
    flash_read_rate_mb_s: 38,
    nand_write_rate_mb_s: 5,
    memory_bus_traffic_gbps: 8.1,
    cim_energy_nj_per_mac: 1.50,
    inference_latency_us: 64,
    model_accuracy_pct: 94.5,
    thermal_c: 42.7,
    nand_endurance_cost: 0.29,
    dataMovement: { bytes_sensor_to_memory: 1024000, bytes_memory_to_compute: 410000, bytes_compute_to_memory: 210000, bytes_off_chip: 810000, memory_bus_transactions: 20400, data_movement_energy_pj: 7900 },
    digitalTruth: { cim_output: 0.841, adc_output: 0.837, quantization_error: 0.004, device_variation: 0.009, temperature_drift: 0.005, digital_reference: 0.840, verification: 'PASS' },
    notes: 'Recurrent hidden states computed without writing back to DRAM buffers.'
  },
  {
    step: 5,
    variableName: 'CIM 75%',
    discoveryTheme: 'Candidate Optimum Frontier',
    sensor_event_rate_hz: 16000,
    spike_sparsity_pct: 82,
    sram_cim_utilization_pct: 75,
    precision: 'INT8',
    flash_read_rate_mb_s: 44,
    nand_write_rate_mb_s: 7,
    memory_bus_traffic_gbps: 6.7,
    cim_energy_nj_per_mac: 1.40,
    inference_latency_us: 57,
    model_accuracy_pct: 94.6,
    thermal_c: 44.0,
    nand_endurance_cost: 0.38,
    dataMovement: { bytes_sensor_to_memory: 2048000, bytes_memory_to_compute: 290000, bytes_compute_to_memory: 140000, bytes_off_chip: 670000, memory_bus_transactions: 15800, data_movement_energy_pj: 5800 },
    digitalTruth: { cim_output: 0.844, adc_output: 0.840, quantization_error: 0.004, device_variation: 0.010, temperature_drift: 0.006, digital_reference: 0.843, verification: 'PASS' },
    notes: 'Approaching optimal multi-variable score before thermal onset.'
  },
  {
    step: 6,
    variableName: 'CIM + Adaptive Precision',
    discoveryTheme: 'Precision Discovery Engine (INT4/INT8/FP32)',
    sensor_event_rate_hz: 32000,
    spike_sparsity_pct: 78,
    sram_cim_utilization_pct: 81,
    precision: 'INT8',
    flash_read_rate_mb_s: 51,
    nand_write_rate_mb_s: 9,
    memory_bus_traffic_gbps: 5.2,
    cim_energy_nj_per_mac: 1.30,
    inference_latency_us: 51,
    model_accuracy_pct: 94.7,
    thermal_c: 45.2,
    nand_endurance_cost: 0.51,
    is_optimal: true,
    dataMovement: { bytes_sensor_to_memory: 4096000, bytes_memory_to_compute: 180000, bytes_compute_to_memory: 92000, bytes_off_chip: 520000, memory_bus_transactions: 11200, data_movement_energy_pj: 4100 },
    digitalTruth: { cim_output: 0.847, adc_output: 0.842, quantization_error: 0.005, device_variation: 0.011, temperature_drift: 0.007, digital_reference: 0.844, verification: 'PASS' },
    notes: '★ GLOBAL CO-DESIGN OPTIMUM: INT4/INT8 CIM perceptual layers + FP32 digital safety verifier.'
  },
  {
    step: 7,
    variableName: 'CIM + Thermal Stress',
    discoveryTheme: 'Thermal Boundary & Saturation',
    sensor_event_rate_hz: 64000,
    spike_sparsity_pct: 74,
    sram_cim_utilization_pct: 91,
    precision: 'INT4',
    flash_read_rate_mb_s: 57,
    nand_write_rate_mb_s: 12,
    memory_bus_traffic_gbps: 4.1,
    cim_energy_nj_per_mac: 1.28,
    inference_latency_us: 48,
    model_accuracy_pct: 94.7,
    thermal_c: 46.1,
    nand_endurance_cost: 0.67,
    dataMovement: { bytes_sensor_to_memory: 8192000, bytes_memory_to_compute: 120000, bytes_compute_to_memory: 64000, bytes_off_chip: 410000, memory_bus_transactions: 8900, data_movement_energy_pj: 3400 },
    digitalTruth: { cim_output: 0.852, adc_output: 0.843, quantization_error: 0.009, device_variation: 0.016, temperature_drift: 0.012, digital_reference: 0.847, verification: 'PASS' },
    notes: '⚠️ Thermal boundary at 46.1°C: Elevated ADC drift and accelerated NAND wear.'
  },
  {
    step: 8,
    variableName: 'CIM + NAND Wear Gating',
    discoveryTheme: 'Memory Lifetime Gating (2σ Write Coalescing)',
    sensor_event_rate_hz: 32000,
    spike_sparsity_pct: 79,
    sram_cim_utilization_pct: 84,
    precision: 'INT8',
    flash_read_rate_mb_s: 52,
    nand_write_rate_mb_s: 10,
    memory_bus_traffic_gbps: 5.0,
    cim_energy_nj_per_mac: 1.34,
    inference_latency_us: 53,
    model_accuracy_pct: 94.6,
    thermal_c: 45.4,
    nand_endurance_cost: 0.54,
    dataMovement: { bytes_sensor_to_memory: 4096000, bytes_memory_to_compute: 160000, bytes_compute_to_memory: 85000, bytes_off_chip: 500000, memory_bus_transactions: 10800, data_movement_energy_pj: 3900 },
    digitalTruth: { cim_output: 0.846, adc_output: 0.841, quantization_error: 0.005, device_variation: 0.011, temperature_drift: 0.008, digital_reference: 0.844, verification: 'PASS' },
    notes: 'Asynchronous write batching cuts NAND wear amplification factor by 76%.'
  },
  {
    step: 9,
    variableName: 'CIM + Device Variation',
    discoveryTheme: 'Silicon Robustness & Noise-as-Resource',
    sensor_event_rate_hz: 16000,
    spike_sparsity_pct: 84,
    sram_cim_utilization_pct: 69,
    precision: 'INT8',
    flash_read_rate_mb_s: 43,
    nand_write_rate_mb_s: 7,
    memory_bus_traffic_gbps: 6.8,
    cim_energy_nj_per_mac: 1.48,
    inference_latency_us: 61,
    model_accuracy_pct: 94.5,
    thermal_c: 43.8,
    nand_endurance_cost: 0.36,
    dataMovement: { bytes_sensor_to_memory: 2048000, bytes_memory_to_compute: 270000, bytes_compute_to_memory: 130000, bytes_off_chip: 680000, memory_bus_transactions: 15200, data_movement_energy_pj: 5400 },
    digitalTruth: { cim_output: 0.843, adc_output: 0.836, quantization_error: 0.007, device_variation: 0.015, temperature_drift: 0.006, digital_reference: 0.841, verification: 'PASS' },
    notes: 'Cell-to-cell conductance variation absorbed by recurrent neuromorphic dynamics.'
  },
  {
    step: 10,
    variableName: 'Full Adaptive System',
    discoveryTheme: 'Global Closed-Loop Pareto Optimum',
    sensor_event_rate_hz: 8000,
    spike_sparsity_pct: 89,
    sram_cim_utilization_pct: 51,
    precision: 'INT8',
    flash_read_rate_mb_s: 35,
    nand_write_rate_mb_s: 4,
    memory_bus_traffic_gbps: 8.9,
    cim_energy_nj_per_mac: 1.62,
    inference_latency_us: 70,
    model_accuracy_pct: 94.3,
    thermal_c: 42.0,
    nand_endurance_cost: 0.23,
    dataMovement: { bytes_sensor_to_memory: 1024000, bytes_memory_to_compute: 420000, bytes_compute_to_memory: 210000, bytes_off_chip: 890000, memory_bus_transactions: 21800, data_movement_energy_pj: 8100 },
    digitalTruth: { cim_output: 0.838, adc_output: 0.833, quantization_error: 0.005, device_variation: 0.009, temperature_drift: 0.004, digital_reference: 0.836, verification: 'PASS' },
    notes: 'Multi-objective fitness: Minimizes latency, energy, bus traffic & NAND wear simultaneously.'
  }
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
    title: 'Controlled Device Stochasticity as an Exploration Resource',
    question: 'Can controlled CIM memory and ADC stochasticity be exploited as an exploration resource rather than treated as pure error?',
    discoveredRule: 'Controlled device stochasticity from thermal fluctuation and crossbar resistance variance may be exploited as an entropy resource for physical exploration rollouts, provided noise amplitude is characterized, bounded (σ ≤ 0.012), and anchored by the Digital Truth Layer.',
    quantitativeMetric: 'Controlled stochasticity yields +8.0% task diversity gain with Δ accuracy -0.003, maintaining 96.0% reproducibility under safety governance',
    scientificImpact: 'Transforms characterized silicon nonidealities into bounded computational exploration primitives under active governance.',
    status: 'SIMULATION_VALIDATED'
  }
];

export interface ControlledStochasticityRecord {
  noise_source: 'device_variation' | 'thermal_fluctuation' | 'adc_quantization_jitter';
  noise_amplitude: number;
  task_diversity_gain: number;
  accuracy_change: number;
  reproducibility: number;
  safety_status: 'PASS' | 'CALIBRATE' | 'VETO';
  exploitation_mode: 'CONTROLLED' | 'UNBOUNDED' | 'SUPPRESSED';
}

export const CONTROLLED_STOCHASTICITY_TELEMETRY: ControlledStochasticityRecord = {
  noise_source: "device_variation",
  noise_amplitude: 0.012,
  task_diversity_gain: 0.08,
  accuracy_change: -0.003,
  reproducibility: 0.96,
  safety_status: "PASS",
  exploitation_mode: "CONTROLLED"
};

export interface CompilerFeedbackMetric {
  metric: string;
  measured_value: string;
  target_threshold: string;
  feedback_action: string;
  status: 'OPTIMAL' | 'RE-OPTIMIZING' | 'ADAPTED';
}

export const COMPILER_HARDWARE_FEEDBACK_TELEMETRY: CompilerFeedbackMetric[] = [
  { metric: 'Latency', measured_value: '51 µs', target_threshold: '< 60 µs', feedback_action: 'Maintain INT8 layer pipeline activation', status: 'OPTIMAL' },
  { metric: 'Energy per MAC', measured_value: '1.30 nJ/MAC', target_threshold: '< 1.50 nJ/MAC', feedback_action: 'Hold SRAM-CIM tile allocation at 81%', status: 'OPTIMAL' },
  { metric: 'Accuracy Drift', measured_value: '+0.1%', target_threshold: '> -0.5%', feedback_action: 'Anchor FP32 Digital Truth Layer', status: 'OPTIMAL' },
  { metric: 'Thermal Load', measured_value: '45.2 °C', target_threshold: '< 48.0 °C', feedback_action: 'Regulate spike-event frequency at 32 kHz', status: 'OPTIMAL' },
  { metric: 'NAND Write Wear', measured_value: '9 MB/s (2σ)', target_threshold: '< 15 MB/s', feedback_action: 'Apply differential write coalescing in SRAM buffer', status: 'ADAPTED' },
  { metric: 'Bus Traffic', measured_value: '5.2 Gbps', target_threshold: '< 8.0 Gbps', feedback_action: 'Zero-bus routing for Hot data regime', status: 'OPTIMAL' },
  { metric: 'Device Variability', measured_value: 'σ = 0.011', target_threshold: 'σ < 0.020', feedback_action: 'Harvest controlled stochasticity for exploration', status: 'OPTIMAL' }
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
  { stepNumber: 11, name: 'HARDWARE DEPLOY', description: 'Flash weights to physical OMEGA Neuromorphic-CIM-NAND Fabric', status: 'VERIFIED', outputArtifact: 'Firmware Bitstream (Active)' },
  { stepNumber: 12, name: 'DISCOVERY FEEDBACK LOOP (GAP H)', description: 'Ingest chip telemetry, wear, and reality anchor metrics to synthesize new compiler optimization policy', status: 'VERIFIED', outputArtifact: 'Adaptive Co-Design Policy Policy v3.5' }
];

export interface ScientificCoDesignDiscoveryOutput {
  benchmark_id: string;
  discovery: {
    optimal_cim_utilization_pct: number;
    optimal_spike_sparsity_pct: number;
    memory_bus_reduction_pct: number;
    energy_reduction_pct: number;
    accuracy_change_pct: number;
    nand_write_reduction_pct: number;
    optimal_operating_point: {
      step_name: string;
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
  gaps_addressed: string[];
  provenance: {
    compiler_version: string;
    target_hardware: string;
    timestamp_iso: string;
    verification_hash: string;
  };
}
