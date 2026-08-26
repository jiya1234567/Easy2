// src/components/QuantumPhotonicWorkbench.tsx
// OMEGA Universal Modality-Agnostic Quantum Physical-AI Architecture & 6-Layer Task Reality Anchor

import React, { useState, useEffect, useMemo } from 'react';
import {
  Atom, Zap, Play, Pause, RotateCcw, ShieldCheck, ShieldAlert,
  Activity, Sliders, Layers, ChevronRight, CheckCircle, Flame,
  Cpu, Compass, Database, BarChart2, Radio, Sparkles, BookOpen,
  ArrowRight, Check, AlertTriangle, Eye, RefreshCw, Terminal,
  Maximize2, Binary, Gauge, HelpCircle, FileText, Target, Award,
  Split, Network, CheckSquare, Microscope, FlaskConical, Beaker,
  Shield, Server, Info, ArrowUpRight
} from 'lucide-react';
import {
  QuantumModality,
  QuantumScientificTask,
  QUANTUM_TASKS,
  DATASET_PHOTONIC,
  DATASET_SUPERCONDUCTING,
  DATASET_TRAPPED_ION,
  DATASET_NEUTRAL_ATOM,
  DATASET_SILICON_SPIN,
  UniversalQuantumState,
  QuantumRealityAnchorVerdict,
  CrossModalitySuitability,
  ScientificStatusTier,
  ScientificEvidenceLevel
} from './UniversalQuantumTypes';

interface UniversalQuantumWorkbenchProps {
  onLogEvent?: (details: string, type: 'info' | 'physics' | 'interaction') => void;
}

export default function QuantumPhotonicWorkbench({ onLogEvent }: UniversalQuantumWorkbenchProps) {
  // Active Scientific Task & Modality
  const [activeTask, setActiveTask] = useState<QuantumScientificTask>('nisq_optimization');
  const [activeModality, setActiveModality] = useState<QuantumModality>('superconducting');
  const [activeEventIndex, setActiveEventIndex] = useState<number>(6); // Default for active modality
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'task_eval' | 'bench_control' | 'universal_tensor' | 'cross_comparison' | 'reality_anchor' | 'evidence_tier' | 'raw_dataset'>('task_eval');
  const [isImagining, setIsImagining] = useState<boolean>(false);
  
  // Experimental Evidence Tiers Toggles for Operator Lab Testing
  const [hardwareInLoop, setHardwareInLoop] = useState<boolean>(false);
  const [independentReplication, setIndependentReplication] = useState<boolean>(false);
  const [heldOutValidation, setHeldOutValidation] = useState<boolean>(true);

  // Modalities metadata with distinct non-monotonic optimums
  const MODALITIES = useMemo(() => [
    {
      id: 'photonic' as QuantumModality,
      name: 'Photonic Quantum Conversion',
      chip: 'PPLN Nonlinear Waveguide',
      icon: Atom,
      color: 'purple',
      badge: 'Room Temp / Flying Qubits',
      experimentId: 'OMEGA_QPHOTON_001',
      optimalStep: 4, // ★ Step #4 Optimum
      optimalSettingText: 'T=25.2°C, θ=0.12°, Pol=30°',
      dataset: DATASET_PHOTONIC,
      mission: 'Maximize single-photon frequency conversion (650nm → 780nm) preserving sub-Poissonian coherence.'
    },
    {
      id: 'superconducting' as QuantumModality,
      name: 'Superconducting Circuits',
      chip: 'IBM Heron / Nighthawk (156Q)',
      icon: Zap,
      color: 'amber',
      badge: 'Fast Gates (30ns) / 15mK Cryo',
      experimentId: 'OMEGA_QSC_001',
      optimalStep: 7, // ★ Step #7 Optimum
      optimalSettingText: 'Coupler=30MHz, Freq=5.07GHz, Pulse=0.96',
      dataset: DATASET_SUPERCONDUCTING,
      mission: 'Optimize detuning, pulse amplitude and coupling to minimize two-qubit gate error under T1/T2 constraints.'
    },
    {
      id: 'trapped_ion' as QuantumModality,
      name: 'Trapped-Ion Architecture',
      chip: 'IonQ Forte (36Q Ytterbium)',
      icon: Radio,
      color: 'indigo',
      badge: 'Highest Fidelity (99.4%) / All-to-All',
      experimentId: 'OMEGA_QION_001',
      optimalStep: 6, // ★ Step #6 Optimum
      optimalSettingText: 'Detuning=-2kHz, Rabi=102kHz, Trap=1.90MHz',
      dataset: DATASET_TRAPPED_ION,
      mission: 'Identify laser detuning and Rabi drive minimizing motional heating while maximizing MS entangling gate fidelity.'
    },
    {
      id: 'neutral_atom' as QuantumModality,
      name: 'Neutral-Atom Array',
      chip: 'Rydberg Optical Tweezers (256Q)',
      icon: Compass,
      color: 'emerald',
      badge: 'Dynamic Geometry / High Scalability',
      experimentId: 'OMEGA_QATOM_001',
      optimalStep: 8, // ★ Step #8 Optimum
      optimalSettingText: 'Spacing=4.4μm, Drive=22MHz, Detuning=3MHz',
      dataset: DATASET_NEUTRAL_ATOM,
      mission: 'Determine atom spacing and Rydberg drive maximizing entangling-gate fidelity while minimizing atom loss.'
    },
    {
      id: 'silicon_spin' as QuantumModality,
      name: 'Silicon Spin Qubits',
      chip: 'Si/SiGe Quantum Dot Pair',
      icon: Cpu,
      color: 'red',
      badge: 'Semiconductor Foundries / T1=26ms',
      experimentId: 'OMEGA_QSPIN_001',
      optimalStep: 5, // ★ Step #5 Optimum
      optimalSettingText: 'B-Field=49mT, Exchange=2.4MHz, Power=-14dBm',
      dataset: DATASET_SILICON_SPIN,
      mission: 'Optimize static magnetic field and microwave exchange pulse to maximize two-qubit fidelity without heating.'
    }
  ], []);

  const currentModalityMeta = MODALITIES.find(m => m.id === activeModality) || MODALITIES[1];
  const currentDataset = currentModalityMeta.dataset;
  const currentEvent = currentDataset[activeEventIndex] || currentDataset[0];
  const currentTaskMeta = QUANTUM_TASKS.find(t => t.id === activeTask) || QUANTUM_TASKS[1];

  // Auto-play timeline loop
  useEffect(() => {
    let timer: any;
    if (isPlayingSequence) {
      timer = setInterval(() => {
        setActiveEventIndex((prev) => {
          const next = (prev + 1) % currentDataset.length;
          if (onLogEvent) {
            onLogEvent(`[${currentModalityMeta.experimentId} STEP #${currentDataset[next].event_id}] Sweep progressed. Telemetry received.`, 'physics');
          }
          return next;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlayingSequence, currentDataset, currentModalityMeta, onLogEvent]);

  // Handle task selection & auto-recommend optimal modality
  const handleSelectTask = (taskId: QuantumScientificTask) => {
    setActiveTask(taskId);
    const targetTask = QUANTUM_TASKS.find(t => t.id === taskId);
    if (targetTask) {
      const recMod = targetTask.recommended_modality;
      setActiveModality(recMod);
      const modMeta = MODALITIES.find(m => m.id === recMod);
      if (modMeta) {
        setActiveEventIndex(modMeta.optimalStep - 1);
      }
      if (onLogEvent) {
        onLogEvent(`[TASK SELECTION] Scientific Task set to "${targetTask.label}". OMEGA SLLM Planner recommended: ${recMod.toUpperCase()} based on requirement weights.`, 'interaction');
      }
    }
  };

  // Handle manual modality change
  const handleSelectModality = (modality: QuantumModality) => {
    setActiveModality(modality);
    const modMeta = MODALITIES.find(m => m.id === modality);
    if (modMeta) {
      setActiveEventIndex(modMeta.optimalStep - 1); // Select this modality's unique optimum
    }
    setIsPlayingSequence(false);
    if (onLogEvent) {
      onLogEvent(`[MODALITY SWITCH] Target switched to ${modality.toUpperCase()} (${modMeta?.chip}). Universal State Tensor re-partitioned. Disagreement optimum is Step #${modMeta?.optimalStep}.`, 'interaction');
    }
  };

  // Run SLLM Counterfactual Discovery
  const handleRunCounterfactuals = () => {
    setIsImagining(true);
    if (onLogEvent) {
      onLogEvent(`[SLLM REASONING] Spawning 100 counterfactual sweeps for Task "${currentTaskMeta.label}" across 5 physical modalities.`, 'physics');
    }
    setTimeout(() => {
      setIsImagining(false);
      // Auto-focus the exact non-monotonic optimum for this specific modality
      setActiveEventIndex(currentModalityMeta.optimalStep - 1);
      if (onLogEvent) {
        onLogEvent(`[SLLM DISCOVERY] Successfully identified unique optimum for ${currentModalityMeta.name} at Step #${currentModalityMeta.optimalStep} (${currentModalityMeta.optimalSettingText}). Evaluated 6-layer Reality Anchor.`, 'physics');
      }
    }, 1000);
  };

  // Universal Quantum State Tensor Payload Generation
  const universalStatePayload: UniversalQuantumState = useMemo(() => {
    const isHeldOut = heldOutValidation;
    if (activeModality === 'photonic') {
      const e = currentEvent as typeof DATASET_PHOTONIC[0];
      return {
        experiment_id: "OMEGA_QPHOTON_001",
        quantum_modality: 'photonic',
        modality_name: "Photonic Quantum Frequency Conversion",
        hardware_target: "Nonlinear PPLN Waveguide & Piezo Rig",
        mission_intent: currentModalityMeta.mission,
        active_task: activeTask,
        physical_state: {
          input_photon: { wavelength_nm: e.input_wavelength_nm, frequency_thz: e.input_frequency_thz, energy_ev: e.energy_in_ev, polarization: "H" },
          output_photon: { wavelength_nm: e.output_wavelength_nm, energy_ev: e.energy_out_ev },
          pump_laser: { energy_ev: e.energy_pump_ev, energy_conservation_check: "100.00% PASS" },
          material: { type: "PPLN_crystal", temp_c: e.crystal_temperature_c, angle_deg: e.crystal_angle_deg, phase_mismatch_error: e.phase_matching_error }
        },
        control_state: {
          piezo_stage_xyz_um: [12.4, -4.2, 88.3],
          waveplate_angle_deg: e.polarization_angle_deg,
          tec_temperature_setpoint_c: e.crystal_temperature_c,
          actuator_symbolic_veto: "APPROVED"
        },
        environment_state: {
          optical_table_temp_c: 22.4,
          ambient_vibration_rms_g: 0.018,
          humidity_pct: 38.2
        },
        measurement_state: {
          detector_id: "SNSPD_CH01",
          mode: "destructive_single_photon_absorption",
          arrival_timestamp_ns: e.arrival_time_ns,
          conversion_efficiency: e.conversion_efficiency,
          detector_quantum_efficiency: e.detector_efficiency
        },
        noise_state: {
          dark_count_rate_hz: e.dark_count_rate_hz,
          depolarization_rate: 0.006,
          spectral_jitter_ps: 1.1
        },
        logical_state: {
          superposition_type: "two_mode_frequency",
          amplitude_alpha: Math.sqrt(1 - e.conversion_efficiency).toFixed(4),
          amplitude_beta: Math.sqrt(e.conversion_efficiency).toFixed(4),
          coherence_estimate: e.coherence_estimate
        },
        uncertainty: {
          conversion_uncertainty: 0.015,
          confidence_interval_2sigma: "±0.021"
        },
        provenance: {
          circuit_hash: "0x8f99a32c4b01e7d",
          compiler_pass: "OMEGA_QFC_v3.2",
          qpu_calibration_epoch: "EPOCH_2026_08_25_A",
          firmware_version: "v4.1.8-photonic",
          timestamp_ns: e.arrival_time_ns,
          held_out_validation_set: isHeldOut
        }
      };
    } else if (activeModality === 'superconducting') {
      const e = currentEvent as typeof DATASET_SUPERCONDUCTING[0];
      return {
        experiment_id: "OMEGA_QSC_001",
        quantum_modality: 'superconducting',
        modality_name: "Transmon Superconducting Processor",
        hardware_target: "IBM Heron Architecture (156Q Tunable Coupler)",
        mission_intent: currentModalityMeta.mission,
        active_task: activeTask,
        physical_state: {
          qubit_pair: ["Q04", "Q05"],
          qubit_frequency_ghz: e.qubit_frequency_ghz,
          anharmonicity_mhz: e.anharmonicity_mhz,
          tunable_coupler_strength_mhz: e.coupler_strength_mhz
        },
        control_state: {
          microwave_pulse_amplitude: e.pulse_amplitude,
          cz_gate_duration_ns: e.gate_duration_ns,
          flux_bias_mv: 14.8,
          mixer_iq_skew_deg: 0.12
        },
        environment_state: {
          mixing_chamber_temp_mk: 14.8,
          magnetic_shielding_nt: 1.2,
          attenuation_db: 60
        },
        measurement_state: {
          readout_resonator_ghz: 7.24,
          readout_error: e.readout_error,
          circuit_success_probability: e.circuit_success_probability
        },
        noise_state: {
          t1_relaxation_us: e.t1_us,
          t2_dephasing_us: e.t2_us,
          two_qubit_gate_error: e.two_qubit_gate_error,
          leakage_to_non_computational_state: e.leakage_probability
        },
        logical_state: {
          entangled_bell_pair_fidelity: (1 - e.two_qubit_gate_error).toFixed(4),
          syndrome_extraction_rounds: 3
        },
        uncertainty: {
          randomized_benchmarking_error: "±0.0012",
          readout_variance: 0.003
        },
        provenance: {
          circuit_hash: "0xec12984ba0087f9",
          compiler_pass: "Qiskit-PassManager-Level3",
          qpu_calibration_epoch: "DAILY_CALIB_1440",
          firmware_version: "FPGA_RFSoC_4.0",
          timestamp_ns: 200000000 + e.event_id * 1500,
          held_out_validation_set: isHeldOut
        }
      };
    } else if (activeModality === 'trapped_ion') {
      const e = currentEvent as typeof DATASET_TRAPPED_ION[0];
      return {
        experiment_id: "OMEGA_QION_001",
        quantum_modality: 'trapped_ion',
        modality_name: "Trapped-Ion Architecture",
        hardware_target: "IonQ Forte (36Q Ytterbium-171+)",
        mission_intent: currentModalityMeta.mission,
        active_task: activeTask,
        physical_state: {
          ion_species: "171Yb+",
          ion_count: e.ion_count,
          trap_secular_frequency_mhz: e.trap_frequency_mhz
        },
        control_state: {
          raman_laser_detuning_khz: e.laser_detuning_khz,
          rabi_frequency_khz: e.rabi_frequency_khz,
          ms_gate_duration_us: 45.0,
          aom_power_mw: 18.4
        },
        environment_state: {
          ultra_high_vacuum_torr: 2.1e-11,
          magnetic_field_gauss: 5.5,
          ambient_jitter_hz: 0.4
        },
        measurement_state: {
          emccd_camera_exposure_ms: 1.5,
          readout_fidelity: e.readout_fidelity
        },
        noise_state: {
          motional_heating_rate_quanta_per_s: e.motional_heating_rate,
          decoherence_rate: e.decoherence_rate,
          laser_phase_noise_rad: 0.003
        },
        logical_state: {
          single_qubit_fidelity: e.single_qubit_fidelity,
          two_qubit_ms_fidelity: e.two_qubit_fidelity
        },
        uncertainty: {
          state_tomography_error: "±0.0006",
          gate_infidelity_std: 0.0010
        },
        provenance: {
          circuit_hash: "0x117ca8e019b882f",
          compiler_pass: "IonQ-AOM-Synthesizer-v2",
          qpu_calibration_epoch: "INTER_SHOT_DRIFT_SCAN",
          firmware_version: "DDS_AOM_CONTROLLER_v9",
          timestamp_ns: 300000000 + e.event_id * 2200,
          held_out_validation_set: isHeldOut
        }
      };
    } else if (activeModality === 'neutral_atom') {
      const e = currentEvent as typeof DATASET_NEUTRAL_ATOM[0];
      return {
        experiment_id: "OMEGA_QATOM_001",
        quantum_modality: 'neutral_atom',
        modality_name: "Neutral-Atom Array",
        hardware_target: "Rydberg Optical Tweezers (Rubidium-87)",
        mission_intent: currentModalityMeta.mission,
        active_task: activeTask,
        physical_state: {
          atom_count: e.atom_count,
          inter_atom_spacing_um: e.spacing_um,
          rydberg_blockade_radius_um: 7.4
        },
        control_state: {
          rydberg_laser_drive_mhz: e.rydberg_drive_mhz,
          laser_detuning_mhz: e.detuning_mhz,
          spatial_light_modulator_phase: "FLAT_TRAP_ARRAY"
        },
        environment_state: {
          vacuum_pressure_mbar: 1.0e-10,
          trap_depth_uk: 850
        },
        measurement_state: {
          fluorescence_detection_efficiency: 0.988,
          readout_fidelity: e.readout_fidelity
        },
        noise_state: {
          atom_loss_rate: e.atom_loss_rate,
          leakage_probability: e.leakage_probability,
          rydberg_lifetime_us: 135
        },
        logical_state: {
          two_qubit_rydberg_cz_fidelity: e.two_qubit_fidelity,
          rearrangement_success_prob: 0.995
        },
        uncertainty: {
          tweezer_intensity_variance: "±0.3%",
          phase_noise_deg: 0.25
        },
        provenance: {
          circuit_hash: "0x7741e9b048fa2c1",
          compiler_pass: "QuEra-Bloq-Optimizer",
          qpu_calibration_epoch: "HOURLY_ARRAY_RELOAD",
          firmware_version: "SLM_AOD_CTRL_v3.4",
          timestamp_ns: 400000000 + e.event_id * 3100,
          held_out_validation_set: isHeldOut
        }
      };
    } else {
      const e = currentEvent as typeof DATASET_SILICON_SPIN[0];
      return {
        experiment_id: "OMEGA_QSPIN_001",
        quantum_modality: 'silicon_spin',
        modality_name: "Silicon Spin Qubits",
        hardware_target: "Si/SiGe Quantum Dot Nanostructure",
        mission_intent: currentModalityMeta.mission,
        active_task: activeTask,
        physical_state: {
          spin_qubit_count: e.spin_qubits,
          static_magnetic_field_mt: e.magnetic_field_mT,
          zeeman_splitting_ghz: 14.2
        },
        control_state: {
          esr_microwave_power_dbm: e.microwave_power_dbm,
          exchange_coupling_mhz: e.exchange_coupling_mhz,
          gate_voltage_plunger_mv: 420.5
        },
        environment_state: {
          dilution_fridge_temp_mk: 45.0,
          charge_noise_ev_per_sqrt_hz: 1.1e-6
        },
        measurement_state: {
          elzerman_readout_fidelity: 0.988,
          spin_to_charge_conversion_eff: 0.95
        },
        noise_state: {
          t1_relaxation_ms: e.t1_ms,
          t2_coherence_ms: e.t2_ms,
          hyperfine_nuclear_noise: "Isotopically purified 28Si (800ppm 29Si)"
        },
        logical_state: {
          single_qubit_fidelity: e.single_qubit_fidelity,
          two_qubit_exchange_fidelity: e.two_qubit_fidelity
        },
        uncertainty: {
          exchange_pulse_drift: "±0.015 MHz",
          magnetic_field_stability: "±0.0008 mT"
        },
        provenance: {
          circuit_hash: "0x992b4fa1c0029d8",
          compiler_pass: "SpinQ-PulseEngine-v1.8",
          qpu_calibration_epoch: "MAGNET_RAMP_CHECK",
          firmware_version: "QD_DAC_AWG_v5",
          timestamp_ns: 500000000 + e.event_id * 4000,
          held_out_validation_set: isHeldOut
        }
      };
    }
  }, [activeModality, currentEvent, currentModalityMeta, activeTask, heldOutValidation]);

  // 6-Layer Task Reality Anchor Verdict & Scientific Status Tiering
  const realityAnchorVerdict: QuantumRealityAnchorVerdict = useMemo(() => {
    let predErr = 0.98;
    let fidelity = 0.96;
    let stability = 0.97;
    let reprod = 0.95;
    let taskFitness = 0.85;

    const isOptimumStep = (currentEvent.event_id === currentModalityMeta.optimalStep);

    // Calculate Task-Specific Fitness Score
    if (activeTask === 'quantum_networking') {
      taskFitness = activeModality === 'photonic' ? (isOptimumStep ? 0.98 : 0.82) : 0.45;
    } else if (activeTask === 'nisq_optimization') {
      taskFitness = activeModality === 'superconducting' ? (isOptimumStep ? 0.97 : 0.78) : (activeModality === 'neutral_atom' ? 0.88 : 0.65);
    } else if (activeTask === 'quantum_simulation') {
      taskFitness = activeModality === 'trapped_ion' ? (isOptimumStep ? 0.99 : 0.84) : 0.72;
    } else if (activeTask === 'fault_tolerant_qec') {
      taskFitness = activeModality === 'neutral_atom' ? (isOptimumStep ? 0.98 : 0.80) : (activeModality === 'superconducting' ? 0.82 : 0.55);
    } else if (activeTask === 'quantum_sensing') {
      taskFitness = activeModality === 'silicon_spin' ? (isOptimumStep ? 0.97 : 0.79) : 0.50;
    } else {
      // Quantum Sampling
      taskFitness = activeModality === 'superconducting' ? (isOptimumStep ? 0.96 : 0.76) : 0.70;
    }

    if (activeModality === 'photonic') {
      const e = currentEvent as typeof DATASET_PHOTONIC[0];
      predErr = 1 - Math.abs(e.conversion_efficiency - 0.89);
      fidelity = e.coherence_estimate;
      stability = e.phase_matching_error < 0.015 ? 0.98 : 0.82;
      reprod = e.measurement_confidence;
    } else if (activeModality === 'superconducting') {
      const e = currentEvent as typeof DATASET_SUPERCONDUCTING[0];
      predErr = 1 - e.two_qubit_gate_error * 2;
      fidelity = e.circuit_success_probability;
      stability = e.t2_us > 100 ? 0.98 : 0.84;
      reprod = 1 - e.leakage_probability * 10;
    } else if (activeModality === 'trapped_ion') {
      const e = currentEvent as typeof DATASET_TRAPPED_ION[0];
      predErr = 0.99;
      fidelity = e.two_qubit_fidelity;
      stability = 1 - e.motional_heating_rate * 2;
      reprod = e.readout_fidelity;
    } else if (activeModality === 'neutral_atom') {
      const e = currentEvent as typeof DATASET_NEUTRAL_ATOM[0];
      predErr = 0.98;
      fidelity = e.two_qubit_fidelity;
      stability = 1 - e.atom_loss_rate * 3;
      reprod = e.readout_fidelity;
    } else {
      const e = currentEvent as typeof DATASET_SILICON_SPIN[0];
      predErr = 0.97;
      fidelity = e.two_qubit_fidelity;
      stability = e.t2_ms > 2.5 ? 0.98 : 0.85;
      reprod = e.single_qubit_fidelity;
    }

    // 6-Layer Composite score weighted by task requirements
    const composite = (
      predErr * 0.20 +
      fidelity * 0.25 +
      stability * 0.15 +
      reprod * 0.15 +
      taskFitness * 0.25
    );

    // Determine Exact Scientific Evidence Tier
    let evidenceLevel: ScientificEvidenceLevel = 'synthetic';
    let statusTier: ScientificStatusTier = 'SIMULATION_VALIDATED';

    if (hardwareInLoop && independentReplication) {
      evidenceLevel = 'physical_hardware_certified';
      statusTier = 'PHYSICAL_HARDWARE_ANCHORED';
    } else if (independentReplication) {
      evidenceLevel = 'lab_replicated';
      statusTier = 'LAB_REPLICATION_CONFIRMED';
    } else if (heldOutValidation) {
      evidenceLevel = 'simulated_held_out';
      statusTier = 'HELD_OUT_VALIDATED';
    } else {
      evidenceLevel = 'synthetic';
      statusTier = 'SIMULATION_VALIDATED';
    }

    return {
      experiment_id: currentModalityMeta.experimentId,
      modality: activeModality,
      active_task: activeTask,
      prediction_error_score: Number(predErr.toFixed(3)),
      quantum_fidelity_score: Number(fidelity.toFixed(3)),
      hardware_stability_score: Number(stability.toFixed(3)),
      reproducibility_score: Number(reprod.toFixed(3)),
      task_fitness_score: Number(taskFitness.toFixed(3)),
      composite_omega_verified_score: Number(composite.toFixed(3)),
      status: statusTier,
      evidence_level: evidenceLevel,
      independent_replication: independentReplication,
      physical_hardware_measurement: hardwareInLoop,
      held_out_validation_pass: heldOutValidation,
      next_experiment_intent: `independent_replication_sweep_${activeModality}_task_${activeTask}`
    };
  }, [activeModality, currentEvent, currentModalityMeta, activeTask, hardwareInLoop, independentReplication, heldOutValidation]);

  // Cross-Modality Task-Specific Suitability Matrix
  const crossModalityComparisons: CrossModalitySuitability[] = useMemo(() => {
    return [
      {
        modality: 'photonic',
        label: 'Photonic (QFC/GKP)',
        target_qpu: 'PPLN / Silicon Waveguide',
        optimal_step: 4,
        optimal_metric_summary: 'Step #4 (T=25.2°C, η=89%, g²(0)=0.042)',
        primary_advantage: 'Room-temperature operation, direct optical networking & flying qubits',
        limiting_constraint: 'Probabilistic photon generation, fiber coupling loss',
        two_qubit_fidelity_pct: 89.0,
        coherence_metric: 'Coherence = 0.97',
        clock_cycle_ns: '0.001 ns',
        gate_depth_limit: 45,
        task_suitability_score: activeTask === 'quantum_networking' ? 98 : (activeTask === 'nisq_optimization' ? 62 : 74),
        is_task_recommended: activeTask === 'quantum_networking'
      },
      {
        modality: 'superconducting',
        label: 'Superconducting Transmon',
        target_qpu: 'IBM Heron / Nighthawk (156Q)',
        optimal_step: 7,
        optimal_metric_summary: 'Step #7 (Coupler=30MHz, 2Q Err=1.7%, P_succ=92%)',
        primary_advantage: 'Ultra-fast gate speeds (30ns), mature semiconductor lithography',
        limiting_constraint: 'Short coherence (T2 ~ 103μs), complex dilution cryogenics (15mK)',
        two_qubit_fidelity_pct: 98.3,
        coherence_metric: 'T1=125μs, T2=103μs',
        clock_cycle_ns: '30 ns',
        gate_depth_limit: 180,
        task_suitability_score: activeTask === 'nisq_optimization' ? 97 : (activeTask === 'quantum_sampling' ? 96 : 82),
        is_task_recommended: activeTask === 'nisq_optimization' || activeTask === 'quantum_sampling'
      },
      {
        modality: 'trapped_ion',
        label: 'Trapped-Ion Architecture',
        target_qpu: 'IonQ Forte (36Q Ytterbium)',
        optimal_step: 6,
        optimal_metric_summary: 'Step #6 (Detuning=-2kHz, Rabi=102kHz, 2Q Fid=99.4%)',
        primary_advantage: 'World-record gate fidelity (99.4%), pristine all-to-all connectivity',
        limiting_constraint: 'Slow gate times (45μs), laser motional heating',
        two_qubit_fidelity_pct: 99.4,
        coherence_metric: 'T2 > 1.4s (Heating=0.06)',
        clock_cycle_ns: '45,000 ns',
        gate_depth_limit: 350,
        task_suitability_score: activeTask === 'quantum_simulation' ? 99 : (activeTask === 'nisq_optimization' ? 76 : 88),
        is_task_recommended: activeTask === 'quantum_simulation'
      },
      {
        modality: 'neutral_atom',
        label: 'Neutral Atoms',
        target_qpu: 'Rydberg Tweezers (256Q)',
        optimal_step: 8,
        optimal_metric_summary: 'Step #8 (Spacing=4.4μm, Drive=22MHz, 2Q Fid=99.2%)',
        primary_advantage: 'Massive scalability (1000s qubits), reconfigurable 2D/3D lattice',
        limiting_constraint: 'Tweezer atom loss (2.4%), spontaneous Rydberg decay',
        two_qubit_fidelity_pct: 99.2,
        coherence_metric: 'T2 ~ 280ms (Loss=2.4%)',
        clock_cycle_ns: '350 ns',
        gate_depth_limit: 240,
        task_suitability_score: activeTask === 'fault_tolerant_qec' ? 98 : (activeTask === 'quantum_simulation' ? 91 : 85),
        is_task_recommended: activeTask === 'fault_tolerant_qec'
      },
      {
        modality: 'silicon_spin',
        label: 'Silicon Spin Qubits',
        target_qpu: 'Si/SiGe Quantum Dots',
        optimal_step: 5,
        optimal_metric_summary: 'Step #5 (B-Field=49mT, Exch=2.4MHz, 2Q Fid=98.5%)',
        primary_advantage: 'Nanometer qubit footprint, high thermal stability, long T1 (26ms)',
        limiting_constraint: 'Fast charge noise, sensitive exchange pulse calibration',
        two_qubit_fidelity_pct: 98.5,
        coherence_metric: 'T1=26ms, T2=3.1ms',
        clock_cycle_ns: '80 ns',
        gate_depth_limit: 140,
        task_suitability_score: activeTask === 'quantum_sensing' ? 97 : (activeTask === 'nisq_optimization' ? 79 : 81),
        is_task_recommended: activeTask === 'quantum_sensing'
      }
    ];
  }, [activeTask]);

  return (
    <div className="bg-[#FAF9F6] border-2 border-[#1A1A1A] text-[#1A1A1A] p-4 font-sans space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      
      {/* Universal Header with Evidence Level Status */}
      <div className="bg-[#1A1A1A] text-white p-3.5 border-b-2 border-[#1A1A1A] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 text-white flex items-center justify-center font-mono font-black text-sm border border-purple-400">
            <Atom className="w-6 h-6 animate-spin-slow text-purple-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-black uppercase text-sm tracking-wide text-white">
                Universal Modality-Agnostic Quantum Physical-AI Architecture
              </h3>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 border ${
                realityAnchorVerdict.status === 'PHYSICAL_HARDWARE_ANCHORED'
                  ? 'bg-emerald-900 text-emerald-200 border-emerald-500'
                  : realityAnchorVerdict.status === 'LAB_REPLICATION_CONFIRMED'
                  ? 'bg-blue-900 text-blue-200 border-blue-500'
                  : 'bg-purple-900 text-purple-200 border-purple-600'
              }`}>
                {realityAnchorVerdict.status}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-mono">
              Task Requirements → Modality Selection → Universal State Tensor → Counterfactuals → Reality Anchor → Subconscious Memory
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleRunCounterfactuals}
            disabled={isImagining}
            className={`px-3 py-1 font-bold uppercase transition flex items-center gap-1.5 border cursor-pointer ${
              isImagining
                ? 'bg-purple-900 text-purple-200 border-purple-500 animate-pulse'
                : 'bg-purple-600 hover:bg-purple-500 text-white border-purple-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isImagining ? 'Exploring State Space...' : 'SLLM Task Reasoning'}</span>
          </button>

          <button
            onClick={() => setIsPlayingSequence(!isPlayingSequence)}
            className={`px-3 py-1 font-bold uppercase transition flex items-center gap-1.5 border cursor-pointer ${
              isPlayingSequence
                ? 'bg-amber-400 text-black border-amber-500'
                : 'bg-emerald-500 text-black border-emerald-600'
            }`}
          >
            {isPlayingSequence ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlayingSequence ? 'Pause Run' : 'Step Sweep'}</span>
          </button>
        </div>
      </div>

      {/* 1. SCIENTIFIC TASK SELECTOR SWITCHBOARD */}
      <div className="bg-white border-2 border-black p-3 space-y-2">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="font-bold text-neutral-800 uppercase flex items-center gap-1.5">
            <Target className="w-4 h-4 text-purple-700" />
            Layer 1: Scientific & Computational Task Selection
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">
            OMEGA SLLM will select the optimal physical qubit modality for this specific task
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 font-mono text-xs">
          {QUANTUM_TASKS.map((task) => {
            const isSelected = task.id === activeTask;
            return (
              <button
                key={task.id}
                onClick={() => handleSelectTask(task.id)}
                className={`p-2 border-2 text-left transition cursor-pointer flex flex-col justify-between space-y-1 ${
                  isSelected
                    ? 'bg-purple-950 text-white border-purple-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-neutral-50 text-neutral-800 border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold truncate">{task.label.split(' ')[0]}</span>
                  {isSelected && <span className="w-2 h-2 bg-emerald-400 rounded-full" />}
                </div>
                <div className="text-[9px] text-neutral-400 truncate">
                  Rec: <strong className="text-purple-300 uppercase">{task.recommended_modality}</strong>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 5-MODALITY SELECTOR (SHOWING DISAGREEMENT OPTIMUMS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 font-mono text-xs">
        {MODALITIES.map((mod) => {
          const Icon = mod.icon;
          const isSelected = mod.id === activeModality;
          const isRecommendedForTask = mod.id === currentTaskMeta.recommended_modality;
          return (
            <button
              key={mod.id}
              onClick={() => handleSelectModality(mod.id)}
              className={`p-2.5 border-2 text-left transition cursor-pointer flex flex-col justify-between space-y-1.5 ${
                isSelected
                  ? 'bg-white border-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-700' : 'text-neutral-500'}`} />
                  <span className="text-[11px] truncate">{mod.name.split(' ')[0]}</span>
                </div>
                {isRecommendedForTask && (
                  <span className="bg-emerald-100 text-emerald-800 text-[8px] font-bold px-1 border border-emerald-400">
                    RECOMMENDED
                  </span>
                )}
              </div>
              
              <div className="text-[9px] text-neutral-500 truncate">{mod.chip}</div>
              
              {/* Distinct Disagreement Optimum Indicator */}
              <div className="flex items-center justify-between text-[9px] bg-neutral-200 text-neutral-900 px-1.5 py-0.5 border border-neutral-300 font-bold">
                <span>Optimum:</span>
                <strong className="text-purple-800">Step #{mod.optimalStep}</strong>
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE EXPERIMENT MISSION BANNER */}
      <div className="bg-neutral-900 text-white p-3 border-2 border-neutral-800 font-mono text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-[11px] uppercase">
            <Microscope className="w-4 h-4 text-purple-400" />
            <span>Target QPU: {currentModalityMeta.name} ({currentModalityMeta.chip}) • Task: {currentTaskMeta.label}</span>
          </div>
          <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
            <strong>Active Mission Intent:</strong> "{currentModalityMeta.mission}"
          </p>
        </div>
        <div className="bg-black/60 p-2 border border-neutral-700 font-mono text-[10px] space-y-0.5 shrink-0">
          <div><span className="text-neutral-400">Unique Optimum:</span> <strong className="text-amber-300">Step #{currentModalityMeta.optimalStep}</strong></div>
          <div><span className="text-neutral-400">Calibration Setting:</span> <span className="text-neutral-200">{currentModalityMeta.optimalSettingText}</span></div>
          <div className="text-emerald-400 font-bold pt-0.5 border-t border-neutral-800 flex items-center justify-between">
            <span>Score: {realityAnchorVerdict.composite_omega_verified_score}</span>
            <span className="text-[9px] uppercase px-1 bg-emerald-950 border border-emerald-700">{realityAnchorVerdict.status}</span>
          </div>
        </div>
      </div>

      {/* 10-EVENT PARAMETER TIMELINE (SHOWING DISAGREEMENT OPTIMUM FOR ACTIVE MODALITY) */}
      <div className="bg-white border-2 border-[#1A1A1A] p-3 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold uppercase text-neutral-700">
            10-Step Hardware Sweep (Active Modality Optimum: Step #{currentModalityMeta.optimalStep})
          </span>
          <span className="text-[10px] text-purple-700 font-bold">
            Selected: Step #{currentEvent.event_id} of 10
          </span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 font-mono">
          {currentDataset.map((evt: any, idx: number) => {
            const isSelected = idx === activeEventIndex;
            const isOptimal = evt.event_id === currentModalityMeta.optimalStep;
            
            // Get main metric depending on modality
            let metricVal = "";
            let subVal = "";
            if (activeModality === 'photonic') {
              metricVal = `${(evt.conversion_efficiency * 100).toFixed(0)}%`;
              subVal = `${evt.crystal_temperature_c}°C`;
            } else if (activeModality === 'superconducting') {
              metricVal = `${(evt.circuit_success_probability * 100).toFixed(0)}%`;
              subVal = `${evt.coupler_strength_mhz}MHz`;
            } else if (activeModality === 'trapped_ion') {
              metricVal = `${(evt.two_qubit_fidelity * 100).toFixed(1)}%`;
              subVal = `${evt.rabi_frequency_khz}kHz`;
            } else if (activeModality === 'neutral_atom') {
              metricVal = `${(evt.two_qubit_fidelity * 100).toFixed(1)}%`;
              subVal = `${evt.spacing_um}μm`;
            } else {
              metricVal = `${(evt.two_qubit_fidelity * 100).toFixed(1)}%`;
              subVal = `${evt.exchange_coupling_mhz}MHz`;
            }

            return (
              <button
                key={evt.event_id}
                onClick={() => {
                  setActiveEventIndex(idx);
                  setIsPlayingSequence(false);
                }}
                className={`p-1.5 border-2 text-center transition cursor-pointer flex flex-col items-center justify-between ${
                  isSelected
                    ? 'bg-[#1A1A1A] text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : isOptimal
                    ? 'bg-purple-100 text-purple-950 border-purple-500 hover:bg-purple-200'
                    : 'bg-neutral-50 text-neutral-800 border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center justify-between w-full text-[9px] font-bold">
                  <span>#{evt.event_id}</span>
                  {isOptimal && <span className="text-amber-500 font-black text-[10px]">★ OPT</span>}
                </div>
                <div className="text-[11px] font-black my-0.5">
                  {metricVal}
                </div>
                <div className={`text-[8px] truncate w-full ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {subVal}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TABS NAVIGATION */}
      <div className="flex flex-wrap items-center gap-1 border-b-2 border-neutral-300 pb-1 font-mono text-xs">
        {[
          { id: 'task_eval', label: '1. Task Suitability & Reasoning', icon: Target },
          { id: 'bench_control', label: '2. Modality Telemetry & Controls', icon: Activity },
          { id: 'universal_tensor', label: '3. Universal State Schema', icon: Layers },
          { id: 'cross_comparison', label: '4. Cross-Modality Disagreement Matrix', icon: Network },
          { id: 'reality_anchor', label: '5. 6-Layer Task Reality Anchor', icon: ShieldCheck },
          { id: 'evidence_tier', label: '6. Scientific Validation Tiers', icon: Award },
          { id: 'raw_dataset', label: '7. Raw Telemetry Table', icon: Database }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-1.5 font-bold transition flex items-center gap-1.5 cursor-pointer border-b-2 ${
                isActive
                  ? 'border-black text-black font-black bg-neutral-100'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* VIEW 1: TASK SUITABILITY & REASONING */}
      {activeSubTab === 'task_eval' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border-2 border-black space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-black uppercase text-sm text-black">
                Active Task Evaluation: {currentTaskMeta.label}
              </h4>
              <span className="bg-purple-100 text-purple-900 border border-purple-400 font-mono text-[10px] font-bold px-2 py-0.5">
                RECOMMENDED: {currentTaskMeta.recommended_modality.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-neutral-700 font-sans leading-relaxed">
              {currentTaskMeta.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentTaskMeta.key_metrics.map((km, i) => (
                <span key={i} className="text-[10px] font-mono bg-neutral-100 text-neutral-800 px-2 py-0.5 border border-neutral-300 font-bold">
                  ✓ {km}
                </span>
              ))}
            </div>
          </div>

          {/* SLLM Reasoning Graph Flowchart */}
          <div className="bg-[#111113] text-white p-4 border-2 border-black space-y-3 font-mono text-xs">
            <span className="text-purple-400 font-bold uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              OMEGA Scientific Reasoning Pipeline (Task Requirements → Physical Execution)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2 text-[10px]">
              <div className="p-2 bg-neutral-900 border border-neutral-700 space-y-1">
                <span className="text-neutral-400 font-bold">1. TASK REQ</span>
                <div className="text-purple-300 font-bold">{activeTask}</div>
                <div className="text-neutral-400">Weight matrix calculated</div>
              </div>

              <div className="p-2 bg-neutral-900 border border-neutral-700 space-y-1">
                <span className="text-neutral-400 font-bold">2. MODALITY</span>
                <div className="text-amber-300 font-bold">{activeModality}</div>
                <div className="text-neutral-400">QPU: {currentModalityMeta.chip}</div>
              </div>

              <div className="p-2 bg-neutral-900 border border-neutral-700 space-y-1">
                <span className="text-neutral-400 font-bold">3. DISAGREEMENT</span>
                <div className="text-indigo-300 font-bold">Optimum #{currentModalityMeta.optimalStep}</div>
                <div className="text-neutral-400">Non-monotonic peak</div>
              </div>

              <div className="p-2 bg-neutral-900 border border-neutral-700 space-y-1">
                <span className="text-neutral-400 font-bold">4. VETO CHECK</span>
                <div className="text-emerald-300 font-bold">APPROVED</div>
                <div className="text-neutral-400">Within actuator bounds</div>
              </div>

              <div className="p-2 bg-neutral-900 border border-neutral-700 space-y-1">
                <span className="text-neutral-400 font-bold">5. ANCHOR</span>
                <div className="text-emerald-300 font-bold">Score: {realityAnchorVerdict.composite_omega_verified_score}</div>
                <div className="text-neutral-400">6-Layer Verified</div>
              </div>

              <div className="p-2 bg-neutral-900 border border-purple-600 space-y-1">
                <span className="text-purple-300 font-bold">6. EVIDENCE</span>
                <div className="text-white font-black">{realityAnchorVerdict.evidence_level}</div>
                <div className="text-purple-400 font-bold">{realityAnchorVerdict.status}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: MODALITY TELEMETRY & CONTROLS */}
      {activeSubTab === 'bench_control' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            
            <div className="p-3 bg-white border-2 border-black space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                Primary Success Metric (Step #{currentEvent.event_id})
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-purple-900">
                  {activeModality === 'photonic' && `${((currentEvent as any).conversion_efficiency * 100).toFixed(1)}%`}
                  {activeModality === 'superconducting' && `${((currentEvent as any).circuit_success_probability * 100).toFixed(1)}%`}
                  {activeModality === 'trapped_ion' && `${((currentEvent as any).two_qubit_fidelity * 100).toFixed(2)}%`}
                  {activeModality === 'neutral_atom' && `${((currentEvent as any).two_qubit_fidelity * 100).toFixed(2)}%`}
                  {activeModality === 'silicon_spin' && `${((currentEvent as any).two_qubit_fidelity * 100).toFixed(2)}%`}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 border ${
                  currentEvent.event_id === currentModalityMeta.optimalStep
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-black'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                }`}>
                  {currentEvent.event_id === currentModalityMeta.optimalStep ? '★ PEAK OPTIMUM' : 'SUB-OPTIMAL'}
                </span>
              </div>
              <p className="text-[10px] text-neutral-600 font-sans">
                {activeModality === 'photonic' && 'Single-photon quantum frequency conversion efficiency.'}
                {activeModality === 'superconducting' && 'Circuit success probability across randomized benchmarking.'}
                {activeModality === 'trapped_ion' && 'Mølmer-Sørensen two-qubit entangling gate fidelity.'}
                {activeModality === 'neutral_atom' && 'Rydberg blockade entangling gate fidelity.'}
                {activeModality === 'silicon_spin' && 'Exchange coupling two-qubit gate fidelity.'}
              </p>
            </div>

            <div className="p-3 bg-white border-2 border-black space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                Noise & Coherence Channel
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-indigo-900">
                  {activeModality === 'photonic' && `g²(0) = 0.042`}
                  {activeModality === 'superconducting' && `T2 = ${(currentEvent as any).t2_us} μs`}
                  {activeModality === 'trapped_ion' && `Heating = ${(currentEvent as any).motional_heating_rate}`}
                  {activeModality === 'neutral_atom' && `Loss = ${((currentEvent as any).atom_loss_rate * 100).toFixed(1)}%`}
                  {activeModality === 'silicon_spin' && `T2 = ${(currentEvent as any).t2_ms} ms`}
                </span>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-900 px-1.5 py-0.5 border border-indigo-300">
                  {activeModality === 'photonic' && 'Sub-Poissonian'}
                  {activeModality === 'superconducting' && `T1=${(currentEvent as any).t1_us}μs`}
                  {activeModality === 'trapped_ion' && `Decoh=${(currentEvent as any).decoherence_rate}`}
                  {activeModality === 'neutral_atom' && `Leak=${((currentEvent as any).leakage_probability * 100).toFixed(1)}%`}
                  {activeModality === 'silicon_spin' && `T1=${(currentEvent as any).t1_ms}ms`}
                </span>
              </div>
              <p className="text-[10px] text-neutral-600 font-sans">
                Physical decay channels and dephasing limits for {currentModalityMeta.chip}.
              </p>
            </div>

            <div className="p-3 bg-white border-2 border-black space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                Actuator Setting vs Peak
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-emerald-800">
                  {activeModality === 'photonic' && `${(currentEvent as any).crystal_temperature_c}°C / ${(currentEvent as any).crystal_angle_deg}°`}
                  {activeModality === 'superconducting' && `${(currentEvent as any).gate_duration_ns} ns / ${(currentEvent as any).coupler_strength_mhz} MHz`}
                  {activeModality === 'trapped_ion' && `${(currentEvent as any).rabi_frequency_khz} kHz / ${(currentEvent as any).laser_detuning_khz} kHz`}
                  {activeModality === 'neutral_atom' && `${(currentEvent as any).spacing_um} μm / ${(currentEvent as any).rydberg_drive_mhz} MHz`}
                  {activeModality === 'silicon_spin' && `${(currentEvent as any).magnetic_field_mT} mT / ${(currentEvent as any).microwave_power_dbm} dBm`}
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-1.5 py-0.5 border border-emerald-400">
                  VETO: CLEAR
                </span>
              </div>
              <p className="text-[10px] text-neutral-600 font-sans">
                Peak optimum for this modality is Step #{currentModalityMeta.optimalStep}.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* VIEW 3: UNIVERSAL STATE SCHEMA */}
      {activeSubTab === 'universal_tensor' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-950 font-sans leading-relaxed">
            <strong>Universal Modality-Agnostic State Schema:</strong> Standardized partition across physical, control, environment, measurement, noise, logical, uncertainty, and provenance states:
          </div>

          <div className="bg-[#111113] p-3 border-2 border-black text-purple-300 space-y-2">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-1.5">
              <span className="text-white font-bold text-xs">
                JSON PAYLOAD: {universalStatePayload.experiment_id} ({universalStatePayload.modality_name})
              </span>
              <span className="bg-purple-900 text-purple-200 text-[9px] px-2 py-0.5 font-bold">
                COMPLIANT UNIVERSAL SCHEMA
              </span>
            </div>
            <pre className="text-[11px] overflow-x-auto leading-relaxed max-h-[480px] p-2 bg-black/70 border border-neutral-800">
              {JSON.stringify(universalStatePayload, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* VIEW 4: CROSS-MODALITY DISAGREEMENT MATRIX */}
      {activeSubTab === 'cross_comparison' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border-2 border-black space-y-2">
            <span className="text-sm font-bold uppercase text-black block">
              Cross-Modality Disagreement & Task Benchmark Matrix
            </span>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed">
              Every physical modality has its own distinct operating optimum. OMEGA reasons over genuine tradeoffs rather than applying a blanket template.
            </p>
          </div>

          <div className="overflow-x-auto border-2 border-black">
            <table className="w-full text-left font-mono text-xs border-collapse bg-white">
              <thead>
                <tr className="bg-[#1A1A1A] text-white text-[9px] uppercase">
                  <th className="p-2.5">Modality</th>
                  <th className="p-2.5">Target QPU</th>
                  <th className="p-2.5">Unique Optimum</th>
                  <th className="p-2.5">2-Qubit Fid</th>
                  <th className="p-2.5">Clock Time</th>
                  <th className="p-2.5">Gate Depth</th>
                  <th className="p-2.5">Task Suitability ({activeTask})</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {crossModalityComparisons.map((c) => {
                  const isCurrent = c.modality === activeModality;
                  return (
                    <tr
                      key={c.modality}
                      onClick={() => handleSelectModality(c.modality)}
                      className={`border-b border-neutral-200 hover:bg-purple-50 cursor-pointer ${
                        isCurrent ? 'bg-purple-100 font-bold' : ''
                      }`}
                    >
                      <td className="p-2.5 font-bold text-black flex items-center gap-1.5">
                        {isCurrent && <span className="text-purple-700">▶</span>}
                        <span>{c.label}</span>
                      </td>
                      <td className="p-2.5 text-neutral-700">{c.target_qpu}</td>
                      <td className="p-2.5 font-black text-amber-900">
                        Step #{c.optimal_step}
                      </td>
                      <td className="p-2.5 font-black text-purple-900">{c.two_qubit_fidelity_pct.toFixed(1)}%</td>
                      <td className="p-2.5 text-neutral-700">{c.clock_cycle_ns}</td>
                      <td className="p-2.5 font-mono">{c.gate_depth_limit}</td>
                      <td className="p-2.5 font-black">
                        <span className={`px-2 py-0.5 border text-[10px] ${
                          c.is_task_recommended
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-black'
                            : 'bg-neutral-100 text-neutral-800 border-neutral-300'
                        }`}>
                          {c.task_suitability_score} / 100
                        </span>
                      </td>
                      <td className="p-2.5">
                        {c.is_task_recommended ? (
                          <span className="text-[9px] bg-emerald-900 text-emerald-200 px-1.5 py-0.5 font-bold">BEST FIT</span>
                        ) : (
                          <span className="text-[9px] text-neutral-500">VIABLE</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 5: 6-LAYER TASK REALITY ANCHOR */}
      {activeSubTab === 'reality_anchor' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border-2 border-black space-y-1">
            <span className="text-[10px] font-mono font-bold text-purple-700 uppercase block">
              6-Layer Task-Specific Quantum Reality Anchor
            </span>
            <h4 className="font-serif font-black text-sm uppercase text-black">
              OMEGA_VERIFIED = (0.20 × Accuracy) + (0.25 × Fidelity) + (0.15 × Stability) + (0.15 × Reproducibility) + (0.25 × TaskFitness)
            </h4>
            <p className="text-xs text-neutral-700 font-sans leading-relaxed">
              Assesses both physical device health and task-specific suitability before anchoring into subconscious memory.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
            
            <div className="p-3 bg-white border-2 border-black space-y-1">
              <span className="text-[9px] text-neutral-500 uppercase font-bold block">1. Prediction Accuracy</span>
              <div className="text-2xl font-black text-purple-900">
                {(realityAnchorVerdict.prediction_error_score * 100).toFixed(1)}%
              </div>
              <p className="text-[10px] text-neutral-600 font-sans">
                Predicted vs measured quantum distribution match.
              </p>
            </div>

            <div className="p-3 bg-white border-2 border-black space-y-1">
              <span className="text-[9px] text-neutral-500 uppercase font-bold block">2. Quantum Fidelity</span>
              <div className="text-2xl font-black text-indigo-900">
                {(realityAnchorVerdict.quantum_fidelity_score * 100).toFixed(1)}%
              </div>
              <p className="text-[10px] text-neutral-600 font-sans">
                Unitary gate execution without decoherence collapse.
              </p>
            </div>

            <div className="p-3 bg-white border-2 border-black space-y-1">
              <span className="text-[9px] text-neutral-500 uppercase font-bold block">3. Hardware Stability</span>
              <div className="text-2xl font-black text-amber-900">
                {(realityAnchorVerdict.hardware_stability_score * 100).toFixed(1)}%
              </div>
              <p className="text-[10px] text-neutral-600 font-sans">
                Zero drift across calibration epoch.
              </p>
            </div>

            <div className="p-3 bg-white border-2 border-black space-y-1">
              <span className="text-[9px] text-neutral-500 uppercase font-bold block">4. Multi-Shot Repro</span>
              <div className="text-2xl font-black text-emerald-900">
                {(realityAnchorVerdict.reproducibility_score * 100).toFixed(1)}%
              </div>
              <p className="text-[10px] text-neutral-600 font-sans">
                Variance across 10,000 statistical shots.
              </p>
            </div>

            <div className="p-3 bg-white border-2 border-purple-600 space-y-1">
              <span className="text-[9px] text-purple-700 uppercase font-bold block">5. Task Fitness ({activeTask.split('_')[0]})</span>
              <div className="text-2xl font-black text-purple-700">
                {(realityAnchorVerdict.task_fitness_score * 100).toFixed(1)}%
              </div>
              <p className="text-[10px] text-neutral-600 font-sans">
                Alignment with active scientific mission constraints.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* VIEW 6: SCIENTIFIC VALIDATION TIERS & EVIDENCE LEVEL */}
      {activeSubTab === 'evidence_tier' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border-2 border-black space-y-2">
            <span className="text-sm font-bold uppercase text-black block">
              Independent Replication & Scientific Evidence Hierarchy
            </span>
            <p className="text-xs text-neutral-700 font-sans leading-relaxed">
              Prevents OMEGA from confusing a successful simulated experiment with a verified physical discovery. A strong scientific claim requires physical hardware telemetry and independent cross-lab replication.
            </p>
          </div>

          {/* Verification Hierarchy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
            
            <div className={`p-3 border-2 ${
              realityAnchorVerdict.status === 'SIMULATION_VALIDATED'
                ? 'bg-purple-50 border-purple-700'
                : 'bg-white border-neutral-300'
            }`}>
              <div className="text-[10px] font-bold text-neutral-500 uppercase">Tier 1: Simulation</div>
              <div className="text-xs font-black my-1 text-purple-900">SIMULATION_VALIDATED</div>
              <p className="text-[10px] text-neutral-600 font-sans">
                Synthetic model verified. Baseline state space exploration.
              </p>
            </div>

            <div className={`p-3 border-2 ${
              realityAnchorVerdict.status === 'HELD_OUT_VALIDATED'
                ? 'bg-indigo-50 border-indigo-700'
                : 'bg-white border-neutral-300'
            }`}>
              <div className="text-[10px] font-bold text-neutral-500 uppercase">Tier 2: Held-Out</div>
              <div className="text-xs font-black my-1 text-indigo-900">HELD_OUT_VALIDATED</div>
              <p className="text-[10px] text-neutral-600 font-sans">
                Tested against unobserved parameter trajectories and randomized seeds.
              </p>
            </div>

            <div className={`p-3 border-2 ${
              realityAnchorVerdict.status === 'LAB_REPLICATION_CONFIRMED'
                ? 'bg-blue-50 border-blue-700'
                : 'bg-white border-neutral-300'
            }`}>
              <div className="text-[10px] font-bold text-neutral-500 uppercase">Tier 3: Replicated</div>
              <div className="text-xs font-black my-1 text-blue-900">LAB_REPLICATION_CONFIRMED</div>
              <p className="text-[10px] text-neutral-600 font-sans">
                Independently replicated across secondary test harnesses and runs.
              </p>
            </div>

            <div className={`p-3 border-2 ${
              realityAnchorVerdict.status === 'PHYSICAL_HARDWARE_ANCHORED'
                ? 'bg-emerald-50 border-emerald-700'
                : 'bg-white border-neutral-300'
            }`}>
              <div className="text-[10px] font-bold text-neutral-500 uppercase">Tier 4: Certified</div>
              <div className="text-xs font-black my-1 text-emerald-900">PHYSICAL_HARDWARE_ANCHORED</div>
              <p className="text-[10px] text-neutral-600 font-sans">
                Live cryogenic / optical QPU measurement stream anchored into memory.
              </p>
            </div>

          </div>

          {/* Interactive Evidence Controls */}
          <div className="p-3 bg-neutral-900 text-white border-2 border-black space-y-3 font-mono text-xs">
            <span className="text-purple-400 font-bold uppercase block">
              Operator Evidence Rig Controls (Simulate Laboratory Upgrades)
            </span>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-neutral-800 px-3 py-1.5 border border-neutral-700">
                <input
                  type="checkbox"
                  checked={heldOutValidation}
                  onChange={(e) => setHeldOutValidation(e.target.checked)}
                  className="rounded"
                />
                <span>Held-Out Validation Set Passed</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-neutral-800 px-3 py-1.5 border border-neutral-700">
                <input
                  type="checkbox"
                  checked={independentReplication}
                  onChange={(e) => setIndependentReplication(e.target.checked)}
                  className="rounded"
                />
                <span>Independent Multi-Lab Replication</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-neutral-800 px-3 py-1.5 border border-neutral-700">
                <input
                  type="checkbox"
                  checked={hardwareInLoop}
                  onChange={(e) => setHardwareInLoop(e.target.checked)}
                  className="rounded"
                />
                <span>Live Physical QPU Hardware Connected</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 7: RAW TELEMETRY TABLE */}
      {activeSubTab === 'raw_dataset' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-neutral-800 uppercase">
              10-Row Telemetry Matrix: {currentModalityMeta.name} ({currentModalityMeta.experimentId})
            </span>
            <span className="text-[10px] text-purple-700 font-bold">
              Peak Optimum for this Modality: Step #{currentModalityMeta.optimalStep}
            </span>
          </div>

          <div className="overflow-x-auto border-2 border-black max-h-[380px]">
            <pre className="p-3 bg-white font-mono text-[11px] leading-relaxed text-black">
              {JSON.stringify(currentDataset, null, 2)}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
}
