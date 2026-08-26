// src/components/UniversalQuantumTypes.ts
// OMEGA Modality-Agnostic Universal Quantum Physical-AI Architecture & Datasets

export type QuantumModality = 'photonic' | 'superconducting' | 'trapped_ion' | 'neutral_atom' | 'silicon_spin';

export type QuantumScientificTask = 
  | 'quantum_networking'       // Flying qubits, frequency conversion, photon loss, room temp
  | 'nisq_optimization'        // Variational algorithms, circuit depth, fast gate clock, high 2Q rate
  | 'quantum_simulation'       // Hamiltonian dynamics, all-to-all connectivity, long coherence, extreme fidelity
  | 'fault_tolerant_qec'       // Surface/Color code, syndrome extraction, 2D geometry scaling, low physical error
  | 'quantum_sensing'          // Phase sensitivity, magnetic/thermal stability, spin coherence
  | 'quantum_sampling';        // Cross-entropy benchmarking, throughput, multi-shot reproducibility

export interface TaskRequirement {
  id: QuantumScientificTask;
  label: string;
  description: string;
  key_metrics: string[];
  weights: {
    fidelity: number;
    error_rate: number;
    coherence: number;
    scalability: number;
    clock_speed: number;
    connectivity: number;
  };
  recommended_modality: QuantumModality;
}

export const QUANTUM_TASKS: TaskRequirement[] = [
  {
    id: 'quantum_networking',
    label: 'Quantum Networking & Teleportation',
    description: 'Long-distance entanglement distribution, optical frequency conversion, room-temperature flying qubits.',
    key_metrics: ['Photon transmission', 'Frequency conversion efficiency', 'Sub-poissonian coherence g²(0)', 'Low dark counts'],
    weights: { fidelity: 0.25, error_rate: 0.15, coherence: 0.30, scalability: 0.10, clock_speed: 0.15, connectivity: 0.05 },
    recommended_modality: 'photonic'
  },
  {
    id: 'nisq_optimization',
    label: 'NISQ Optimization (QAOA / VQE)',
    description: 'Variational hybrid quantum-classical algorithms demanding ultra-fast gate execution and deep circuit iterations.',
    key_metrics: ['Gate clock speed (30ns)', 'Fast repetition rate', 'Tunable coupler fidelity', 'Parametrized pulse control'],
    weights: { fidelity: 0.30, error_rate: 0.20, coherence: 0.15, scalability: 0.15, clock_speed: 0.20, connectivity: 0.00 },
    recommended_modality: 'superconducting'
  },
  {
    id: 'quantum_simulation',
    label: 'Complex Molecular & Many-Body Simulation',
    description: 'High-depth unitary evolution demanding near-perfect two-qubit fidelity and arbitrary all-to-all entanglement.',
    key_metrics: ['Record 2-qubit fidelity (99.8%)', 'All-to-all ion connectivity', 'Second-scale T2 coherence', 'Low crosstalk'],
    weights: { fidelity: 0.40, error_rate: 0.25, coherence: 0.20, scalability: 0.05, clock_speed: 0.00, connectivity: 0.10 },
    recommended_modality: 'trapped_ion'
  },
  {
    id: 'fault_tolerant_qec',
    label: 'Fault-Tolerant Error Correction (QEC)',
    description: 'Logical qubit synthesis with hundreds of physical data & syndrome qubits in reconfigurable 2D/3D lattices.',
    key_metrics: ['Massive physical qubit count (256+)', 'Optical tweezer rearrangement', 'Sub-threshold physical error rate', 'Low leakage'],
    weights: { fidelity: 0.25, error_rate: 0.25, coherence: 0.15, scalability: 0.30, clock_speed: 0.05, connectivity: 0.00 },
    recommended_modality: 'neutral_atom'
  },
  {
    id: 'quantum_sensing',
    label: 'High-Density Spin-Based Quantum Sensing',
    description: 'Nanoscale magnetometry and electrometer sensing with long electron/nuclear spin lifetimes.',
    key_metrics: ['Long T1 relaxation (24ms)', 'Nanometer dot footprint', 'Microwave resonance linewidth', 'High sensitivity'],
    weights: { fidelity: 0.25, error_rate: 0.15, coherence: 0.35, scalability: 0.15, clock_speed: 0.05, connectivity: 0.05 },
    recommended_modality: 'silicon_spin'
  },
  {
    id: 'quantum_sampling',
    label: 'Quantum Supremacy Sampling (RCS)',
    description: 'Random circuit sampling with high multi-shot repetition throughput and verifiable cross-entropy benchmarking.',
    key_metrics: ['Cross-entropy fidelity', 'Multi-shot throughput', 'Stable calibration epochs', 'Reproducibility score'],
    weights: { fidelity: 0.35, error_rate: 0.25, coherence: 0.15, scalability: 0.15, clock_speed: 0.10, connectivity: 0.00 },
    recommended_modality: 'superconducting'
  }
];

export interface UniversalQuantumState {
  experiment_id: string;
  quantum_modality: QuantumModality;
  modality_name: string;
  hardware_target: string;
  mission_intent: string;
  active_task: QuantumScientificTask;
  physical_state: Record<string, any>;
  control_state: Record<string, any>;
  environment_state: Record<string, any>;
  measurement_state: Record<string, any>;
  noise_state: Record<string, any>;
  logical_state: Record<string, any>;
  uncertainty: Record<string, any>;
  provenance: {
    circuit_hash: string;
    compiler_pass: string;
    qpu_calibration_epoch: string;
    firmware_version: string;
    timestamp_ns: number;
    held_out_validation_set: boolean;
  };
}

// 1. PHOTONIC DATASET (OMEGA_QPHOTON_001) - OPTIMUM AT STEP #4
export interface PhotonicEvent {
  event_id: number;
  input_wavelength_nm: number;
  input_frequency_thz: number;
  crystal_temperature_c: number;
  crystal_angle_deg: number;
  phase_matching_error: number;
  polarization_angle_deg: number;
  output_wavelength_nm: number;
  conversion_efficiency: number;
  detector_efficiency: number;
  dark_count_rate_hz: number;
  arrival_time_ns: number;
  coherence_estimate: number;
  measurement_confidence: number;
  energy_in_ev: number;
  energy_out_ev: number;
  energy_pump_ev: number;
}

export const DATASET_PHOTONIC: PhotonicEvent[] = [
  { event_id: 1, input_wavelength_nm: 650, input_frequency_thz: 461.22, crystal_temperature_c: 24.5, crystal_angle_deg: 0.00, phase_matching_error: 0.072, polarization_angle_deg: 0, output_wavelength_nm: 781, conversion_efficiency: 0.58, detector_efficiency: 0.80, dark_count_rate_hz: 42, arrival_time_ns: 100120, coherence_estimate: 0.74, measurement_confidence: 0.82, energy_in_ev: 1.9074, energy_out_ev: 1.5875, energy_pump_ev: 0.3199 },
  { event_id: 2, input_wavelength_nm: 650, input_frequency_thz: 461.22, crystal_temperature_c: 24.8, crystal_angle_deg: 0.04, phase_matching_error: 0.049, polarization_angle_deg: 10, output_wavelength_nm: 780, conversion_efficiency: 0.71, detector_efficiency: 0.81, dark_count_rate_hz: 40, arrival_time_ns: 100132, coherence_estimate: 0.82, measurement_confidence: 0.86, energy_in_ev: 1.9074, energy_out_ev: 1.5895, energy_pump_ev: 0.3179 },
  { event_id: 3, input_wavelength_nm: 650, input_frequency_thz: 461.22, crystal_temperature_c: 25.0, crystal_angle_deg: 0.08, phase_matching_error: 0.025, polarization_angle_deg: 20, output_wavelength_nm: 780, conversion_efficiency: 0.84, detector_efficiency: 0.82, dark_count_rate_hz: 38, arrival_time_ns: 100145, coherence_estimate: 0.91, measurement_confidence: 0.92, energy_in_ev: 1.9074, energy_out_ev: 1.5895, energy_pump_ev: 0.3179 },
  { event_id: 4, input_wavelength_nm: 650, input_frequency_thz: 461.22, crystal_temperature_c: 25.2, crystal_angle_deg: 0.12, phase_matching_error: 0.008, polarization_angle_deg: 30, output_wavelength_nm: 780, conversion_efficiency: 0.89, detector_efficiency: 0.83, dark_count_rate_hz: 35, arrival_time_ns: 100151, coherence_estimate: 0.97, measurement_confidence: 0.96, energy_in_ev: 1.9074, energy_out_ev: 1.5895, energy_pump_ev: 0.3179 }, // ★ PEAK OPTIMUM #4
  { event_id: 5, input_wavelength_nm: 650, input_frequency_thz: 461.22, crystal_temperature_c: 25.5, crystal_angle_deg: 0.16, phase_matching_error: 0.021, polarization_angle_deg: 40, output_wavelength_nm: 779, conversion_efficiency: 0.82, detector_efficiency: 0.82, dark_count_rate_hz: 37, arrival_time_ns: 100163, coherence_estimate: 0.92, measurement_confidence: 0.91, energy_in_ev: 1.9074, energy_out_ev: 1.5916, energy_pump_ev: 0.3158 },
  { event_id: 6, input_wavelength_nm: 650, input_frequency_thz: 461.22, crystal_temperature_c: 25.8, crystal_angle_deg: 0.20, phase_matching_error: 0.038, polarization_angle_deg: 45, output_wavelength_nm: 779, conversion_efficiency: 0.73, detector_efficiency: 0.81, dark_count_rate_hz: 39, arrival_time_ns: 100177, coherence_estimate: 0.85, measurement_confidence: 0.87, energy_in_ev: 1.9074, energy_out_ev: 1.5916, energy_pump_ev: 0.3158 },
  { event_id: 7, input_wavelength_nm: 650, input_frequency_thz: 461.22, crystal_temperature_c: 26.0, crystal_angle_deg: 0.24, phase_matching_error: 0.052, polarization_angle_deg: 50, output_wavelength_nm: 780, conversion_efficiency: 0.65, detector_efficiency: 0.80, dark_count_rate_hz: 41, arrival_time_ns: 100189, coherence_estimate: 0.79, measurement_confidence: 0.84, energy_in_ev: 1.9074, energy_out_ev: 1.5895, energy_pump_ev: 0.3179 },
  { event_id: 8, input_wavelength_nm: 650, input_frequency_thz: 461.22, crystal_temperature_c: 26.2, crystal_angle_deg: 0.28, phase_matching_error: 0.068, polarization_angle_deg: 60, output_wavelength_nm: 781, conversion_efficiency: 0.54, detector_efficiency: 0.80, dark_count_rate_hz: 43, arrival_time_ns: 100204, coherence_estimate: 0.72, measurement_confidence: 0.80, energy_in_ev: 1.9074, energy_out_ev: 1.5875, energy_pump_ev: 0.3199 },
  { event_id: 9, input_wavelength_nm: 650, input_frequency_thz: 461.22, crystal_temperature_c: 26.5, crystal_angle_deg: 0.32, phase_matching_error: 0.083, polarization_angle_deg: 70, output_wavelength_nm: 782, conversion_efficiency: 0.46, detector_efficiency: 0.79, dark_count_rate_hz: 45, arrival_time_ns: 100219, coherence_estimate: 0.66, measurement_confidence: 0.77, energy_in_ev: 1.9074, energy_out_ev: 1.5855, energy_pump_ev: 0.3219 },
  { event_id: 10, input_wavelength_nm: 650, input_frequency_thz: 461.22, crystal_temperature_c: 26.8, crystal_angle_deg: 0.36, phase_matching_error: 0.104, polarization_angle_deg: 80, output_wavelength_nm: 783, conversion_efficiency: 0.38, detector_efficiency: 0.78, dark_count_rate_hz: 48, arrival_time_ns: 100233, coherence_estimate: 0.59, measurement_confidence: 0.73, energy_in_ev: 1.9074, energy_out_ev: 1.5835, energy_pump_ev: 0.3239 }
];

// 2. SUPERCONDUCTING QUBITS DATASET (OMEGA_QSC_001) - OPTIMUM AT STEP #7
export interface SuperconductingEvent {
  event_id: number;
  qubit_frequency_ghz: number;
  anharmonicity_mhz: number;
  coupler_strength_mhz: number;
  pulse_amplitude: number;
  gate_duration_ns: number;
  t1_us: number;
  t2_us: number;
  readout_error: number;
  two_qubit_gate_error: number;
  leakage_probability: number;
  circuit_success_probability: number;
}

export const DATASET_SUPERCONDUCTING: SuperconductingEvent[] = [
  { event_id: 1, qubit_frequency_ghz: 5.01, anharmonicity_mhz: -310, coupler_strength_mhz: 18, pulse_amplitude: 0.72, gate_duration_ns: 42, t1_us: 112, t2_us: 86, readout_error: 0.041, two_qubit_gate_error: 0.041, leakage_probability: 0.012, circuit_success_probability: 0.71 },
  { event_id: 2, qubit_frequency_ghz: 5.02, anharmonicity_mhz: -310, coupler_strength_mhz: 20, pulse_amplitude: 0.76, gate_duration_ns: 40, t1_us: 115, t2_us: 89, readout_error: 0.038, two_qubit_gate_error: 0.036, leakage_probability: 0.011, circuit_success_probability: 0.75 },
  { event_id: 3, qubit_frequency_ghz: 5.03, anharmonicity_mhz: -309, coupler_strength_mhz: 22, pulse_amplitude: 0.80, gate_duration_ns: 38, t1_us: 118, t2_us: 93, readout_error: 0.035, two_qubit_gate_error: 0.032, leakage_probability: 0.010, circuit_success_probability: 0.79 },
  { event_id: 4, qubit_frequency_ghz: 5.04, anharmonicity_mhz: -309, coupler_strength_mhz: 24, pulse_amplitude: 0.84, gate_duration_ns: 36, t1_us: 121, t2_us: 97, readout_error: 0.031, two_qubit_gate_error: 0.028, leakage_probability: 0.009, circuit_success_probability: 0.82 },
  { event_id: 5, qubit_frequency_ghz: 5.05, anharmonicity_mhz: -308, coupler_strength_mhz: 26, pulse_amplitude: 0.88, gate_duration_ns: 34, t1_us: 124, t2_us: 101, readout_error: 0.028, two_qubit_gate_error: 0.024, leakage_probability: 0.008, circuit_success_probability: 0.86 },
  { event_id: 6, qubit_frequency_ghz: 5.06, anharmonicity_mhz: -308, coupler_strength_mhz: 28, pulse_amplitude: 0.92, gate_duration_ns: 32, t1_us: 126, t2_us: 104, readout_error: 0.024, two_qubit_gate_error: 0.019, leakage_probability: 0.007, circuit_success_probability: 0.90 },
  { event_id: 7, qubit_frequency_ghz: 5.07, anharmonicity_mhz: -307, coupler_strength_mhz: 30, pulse_amplitude: 0.96, gate_duration_ns: 30, t1_us: 125, t2_us: 103, readout_error: 0.023, two_qubit_gate_error: 0.017, leakage_probability: 0.007, circuit_success_probability: 0.92 }, // ★ PEAK OPTIMUM #7
  { event_id: 8, qubit_frequency_ghz: 5.08, anharmonicity_mhz: -307, coupler_strength_mhz: 32, pulse_amplitude: 0.94, gate_duration_ns: 31, t1_us: 122, t2_us: 99, readout_error: 0.026, two_qubit_gate_error: 0.021, leakage_probability: 0.008, circuit_success_probability: 0.89 },
  { event_id: 9, qubit_frequency_ghz: 5.09, anharmonicity_mhz: -306, coupler_strength_mhz: 34, pulse_amplitude: 0.90, gate_duration_ns: 34, t1_us: 119, t2_us: 94, readout_error: 0.030, two_qubit_gate_error: 0.027, leakage_probability: 0.010, circuit_success_probability: 0.84 },
  { event_id: 10, qubit_frequency_ghz: 5.10, anharmonicity_mhz: -306, coupler_strength_mhz: 36, pulse_amplitude: 0.86, gate_duration_ns: 37, t1_us: 116, t2_us: 90, readout_error: 0.034, two_qubit_gate_error: 0.034, leakage_probability: 0.013, circuit_success_probability: 0.77 }
];

// 3. TRAPPED-ION DATASET (OMEGA_QION_001) - OPTIMUM AT STEP #6
export interface TrappedIonEvent {
  event_id: number;
  ion_count: number;
  laser_detuning_khz: number;
  rabi_frequency_khz: number;
  trap_frequency_mhz: number;
  motional_heating_rate: number;
  single_qubit_fidelity: number;
  two_qubit_fidelity: number;
  readout_fidelity: number;
  decoherence_rate: number;
}

export const DATASET_TRAPPED_ION: TrappedIonEvent[] = [
  { event_id: 1, ion_count: 2, laser_detuning_khz: -12, rabi_frequency_khz: 82, trap_frequency_mhz: 1.80, motional_heating_rate: 0.19, single_qubit_fidelity: 0.991, two_qubit_fidelity: 0.961, readout_fidelity: 0.982, decoherence_rate: 0.021 },
  { event_id: 2, ion_count: 2, laser_detuning_khz: -10, rabi_frequency_khz: 86, trap_frequency_mhz: 1.82, motional_heating_rate: 0.17, single_qubit_fidelity: 0.992, two_qubit_fidelity: 0.969, readout_fidelity: 0.983, decoherence_rate: 0.019 },
  { event_id: 3, ion_count: 2, laser_detuning_khz: -8, rabi_frequency_khz: 90, trap_frequency_mhz: 1.84, motional_heating_rate: 0.14, single_qubit_fidelity: 0.994, two_qubit_fidelity: 0.976, readout_fidelity: 0.985, decoherence_rate: 0.016 },
  { event_id: 4, ion_count: 2, laser_detuning_khz: -6, rabi_frequency_khz: 94, trap_frequency_mhz: 1.86, motional_heating_rate: 0.11, single_qubit_fidelity: 0.996, two_qubit_fidelity: 0.983, readout_fidelity: 0.988, decoherence_rate: 0.013 },
  { event_id: 5, ion_count: 2, laser_detuning_khz: -4, rabi_frequency_khz: 98, trap_frequency_mhz: 1.88, motional_heating_rate: 0.08, single_qubit_fidelity: 0.997, two_qubit_fidelity: 0.989, readout_fidelity: 0.991, decoherence_rate: 0.010 },
  { event_id: 6, ion_count: 2, laser_detuning_khz: -2, rabi_frequency_khz: 102, trap_frequency_mhz: 1.90, motional_heating_rate: 0.06, single_qubit_fidelity: 0.999, two_qubit_fidelity: 0.994, readout_fidelity: 0.994, decoherence_rate: 0.007 }, // ★ PEAK OPTIMUM #6
  { event_id: 7, ion_count: 2, laser_detuning_khz: 0, rabi_frequency_khz: 106, trap_frequency_mhz: 1.92, motional_heating_rate: 0.09, single_qubit_fidelity: 0.998, two_qubit_fidelity: 0.988, readout_fidelity: 0.991, decoherence_rate: 0.011 },
  { event_id: 8, ion_count: 2, laser_detuning_khz: 2, rabi_frequency_khz: 102, trap_frequency_mhz: 1.90, motional_heating_rate: 0.12, single_qubit_fidelity: 0.996, two_qubit_fidelity: 0.981, readout_fidelity: 0.988, decoherence_rate: 0.014 },
  { event_id: 9, ion_count: 2, laser_detuning_khz: 4, rabi_frequency_khz: 98, trap_frequency_mhz: 1.87, motional_heating_rate: 0.15, single_qubit_fidelity: 0.994, two_qubit_fidelity: 0.974, readout_fidelity: 0.985, decoherence_rate: 0.017 },
  { event_id: 10, ion_count: 2, laser_detuning_khz: 6, rabi_frequency_khz: 94, trap_frequency_mhz: 1.84, motional_heating_rate: 0.19, single_qubit_fidelity: 0.992, two_qubit_fidelity: 0.965, readout_fidelity: 0.982, decoherence_rate: 0.021 }
];

// 4. NEUTRAL ATOM DATASET (OMEGA_QATOM_001) - OPTIMUM AT STEP #8
export interface NeutralAtomEvent {
  event_id: number;
  atom_count: number;
  spacing_um: number;
  rydberg_drive_mhz: number;
  detuning_mhz: number;
  atom_loss_rate: number;
  leakage_probability: number;
  two_qubit_fidelity: number;
  readout_fidelity: number;
}

export const DATASET_NEUTRAL_ATOM: NeutralAtomEvent[] = [
  { event_id: 1, atom_count: 16, spacing_um: 3.0, rydberg_drive_mhz: 8, detuning_mhz: -18, atom_loss_rate: 0.082, leakage_probability: 0.031, two_qubit_fidelity: 0.935, readout_fidelity: 0.971 },
  { event_id: 2, atom_count: 16, spacing_um: 3.2, rydberg_drive_mhz: 10, detuning_mhz: -15, atom_loss_rate: 0.074, leakage_probability: 0.028, two_qubit_fidelity: 0.944, readout_fidelity: 0.974 },
  { event_id: 3, atom_count: 16, spacing_um: 3.4, rydberg_drive_mhz: 12, detuning_mhz: -12, atom_loss_rate: 0.065, leakage_probability: 0.024, two_qubit_fidelity: 0.953, readout_fidelity: 0.977 },
  { event_id: 4, atom_count: 16, spacing_um: 3.6, rydberg_drive_mhz: 14, detuning_mhz: -9, atom_loss_rate: 0.056, leakage_probability: 0.020, two_qubit_fidelity: 0.964, readout_fidelity: 0.980 },
  { event_id: 5, atom_count: 16, spacing_um: 3.8, rydberg_drive_mhz: 16, detuning_mhz: -6, atom_loss_rate: 0.047, leakage_probability: 0.016, two_qubit_fidelity: 0.972, readout_fidelity: 0.983 },
  { event_id: 6, atom_count: 16, spacing_um: 4.0, rydberg_drive_mhz: 18, detuning_mhz: -3, atom_loss_rate: 0.039, leakage_probability: 0.013, two_qubit_fidelity: 0.980, readout_fidelity: 0.986 },
  { event_id: 7, atom_count: 16, spacing_um: 4.2, rydberg_drive_mhz: 20, detuning_mhz: 0, atom_loss_rate: 0.032, leakage_probability: 0.010, two_qubit_fidelity: 0.987, readout_fidelity: 0.989 },
  { event_id: 8, atom_count: 16, spacing_um: 4.4, rydberg_drive_mhz: 22, detuning_mhz: 3, atom_loss_rate: 0.024, leakage_probability: 0.007, two_qubit_fidelity: 0.992, readout_fidelity: 0.993 }, // ★ PEAK OPTIMUM #8
  { event_id: 9, atom_count: 16, spacing_um: 4.6, rydberg_drive_mhz: 24, detuning_mhz: 6, atom_loss_rate: 0.041, leakage_probability: 0.014, two_qubit_fidelity: 0.981, readout_fidelity: 0.987 },
  { event_id: 10, atom_count: 16, spacing_um: 4.8, rydberg_drive_mhz: 26, detuning_mhz: 9, atom_loss_rate: 0.058, leakage_probability: 0.022, two_qubit_fidelity: 0.968, readout_fidelity: 0.980 }
];

// 5. SILICON SPIN QUBITS DATASET (OMEGA_QSPIN_001) - OPTIMUM AT STEP #5
export interface SiliconSpinEvent {
  event_id: number;
  spin_qubits: number;
  magnetic_field_mT: number;
  microwave_power_dbm: number;
  exchange_coupling_mhz: number;
  t1_ms: number;
  t2_ms: number;
  single_qubit_fidelity: number;
  two_qubit_fidelity: number;
}

export const DATASET_SILICON_SPIN: SiliconSpinEvent[] = [
  { event_id: 1, spin_qubits: 2, magnetic_field_mT: 45, microwave_power_dbm: -18, exchange_coupling_mhz: 1.2, t1_ms: 18, t2_ms: 1.8, single_qubit_fidelity: 0.988, two_qubit_fidelity: 0.932 },
  { event_id: 2, spin_qubits: 2, magnetic_field_mT: 46, microwave_power_dbm: -17, exchange_coupling_mhz: 1.5, t1_ms: 20, t2_ms: 2.1, single_qubit_fidelity: 0.991, two_qubit_fidelity: 0.946 },
  { event_id: 3, spin_qubits: 2, magnetic_field_mT: 47, microwave_power_dbm: -16, exchange_coupling_mhz: 1.8, t1_ms: 22, t2_ms: 2.4, single_qubit_fidelity: 0.994, two_qubit_fidelity: 0.961 },
  { event_id: 4, spin_qubits: 2, magnetic_field_mT: 48, microwave_power_dbm: -15, exchange_coupling_mhz: 2.1, t1_ms: 24, t2_ms: 2.7, single_qubit_fidelity: 0.996, two_qubit_fidelity: 0.975 },
  { event_id: 5, spin_qubits: 2, magnetic_field_mT: 49, microwave_power_dbm: -14, exchange_coupling_mhz: 2.4, t1_ms: 26, t2_ms: 3.1, single_qubit_fidelity: 0.998, two_qubit_fidelity: 0.985 }, // ★ PEAK OPTIMUM #5
  { event_id: 6, spin_qubits: 2, magnetic_field_mT: 50, microwave_power_dbm: -13, exchange_coupling_mhz: 2.7, t1_ms: 23, t2_ms: 2.8, single_qubit_fidelity: 0.997, two_qubit_fidelity: 0.978 },
  { event_id: 7, spin_qubits: 2, magnetic_field_mT: 51, microwave_power_dbm: -12, exchange_coupling_mhz: 3.0, t1_ms: 21, t2_ms: 2.4, single_qubit_fidelity: 0.995, two_qubit_fidelity: 0.969 },
  { event_id: 8, spin_qubits: 2, magnetic_field_mT: 52, microwave_power_dbm: -11, exchange_coupling_mhz: 2.8, t1_ms: 19, t2_ms: 2.1, single_qubit_fidelity: 0.993, two_qubit_fidelity: 0.958 },
  { event_id: 9, spin_qubits: 2, magnetic_field_mT: 53, microwave_power_dbm: -10, exchange_coupling_mhz: 2.5, t1_ms: 17, t2_ms: 1.8, single_qubit_fidelity: 0.990, two_qubit_fidelity: 0.947 },
  { event_id: 10, spin_qubits: 2, magnetic_field_mT: 54, microwave_power_dbm: -9, exchange_coupling_mhz: 2.2, t1_ms: 15, t2_ms: 1.5, single_qubit_fidelity: 0.986, two_qubit_fidelity: 0.935 }
];

// SCIENTIFIC EVIDENCE VALIDATION TIERS
export type ScientificEvidenceLevel = 'synthetic' | 'simulated_held_out' | 'lab_replicated' | 'physical_hardware_certified';
export type ScientificStatusTier = 
  | 'SIMULATION_VALIDATED'
  | 'HELD_OUT_VALIDATED'
  | 'LAB_REPLICATION_CONFIRMED'
  | 'PHYSICAL_HARDWARE_ANCHORED';

export interface QuantumRealityAnchorVerdict {
  experiment_id: string;
  modality: QuantumModality;
  active_task: QuantumScientificTask;
  prediction_error_score: number; // 0..1 (1.0 = perfect match)
  quantum_fidelity_score: number;  // 0..1 (1.0 = ideal gate/state behavior)
  hardware_stability_score: number;// 0..1 (1.0 = zero drift)
  reproducibility_score: number;   // 0..1 (1.0 = high multi-shot consistency)
  task_fitness_score: number;      // 0..1 (Task-specific reality score)
  composite_omega_verified_score: number;
  status: ScientificStatusTier;
  evidence_level: ScientificEvidenceLevel;
  independent_replication: boolean;
  physical_hardware_measurement: boolean;
  held_out_validation_pass: boolean;
  symbolic_veto_reason?: string;
  next_experiment_intent: string;
}

export interface CrossModalitySuitability {
  modality: QuantumModality;
  label: string;
  target_qpu: string;
  optimal_step: number;
  optimal_metric_summary: string;
  primary_advantage: string;
  limiting_constraint: string;
  two_qubit_fidelity_pct: number;
  coherence_metric: string;
  clock_cycle_ns: string;
  gate_depth_limit: number;
  task_suitability_score: number; // 0..100 for currently selected scientific task
  is_task_recommended: boolean;
}
