// src/components/PhysicalAiWorldStateTypes.ts
// Comprehensive Physical AI World-Model Data Structures

export interface TrackedWorldObject {
  id: string;
  class: 'plate' | 'glass' | 'rack_slot' | 'spray_arm' | 'gripper';
  position: [number, number, number]; // [x_mm, y_mm, z_mm]
  velocity: [number, number, number]; // [vx, vy, vz] in mm/ms or mm/s
  confidence: number; // 0.0 to 1.0
  covariance_sigma: [number, number, number]; // [sigma_x, sigma_y, sigma_z]
  bounding_box: { width: number; height: number; depth: number };
  material: {
    name: string;
    fragility: number; // 0.0 to 1.0
    friction_coefficient: number; // mu
    wetness_pct: number;
  };
}

export interface AudioEventReading {
  timestamp_ms: number;
  amplitude_db: number;
  frequency_centroid_hz: number;
  classification: 'silent' | 'smooth_contact' | 'acoustic_transient' | 'slip_chatter' | 'motor_harmonic';
  anomaly_score: number;
}

export interface TemporalDeltaFrame {
  delta_description: string;
  displaced_objects: Array<{ id: string; delta_xyz_mm: [number, number, number]; delta_v: number }>;
  torque_delta_nm: number;
  slip_acceleration: number;
  causal_event_triggered?: string;
}

export interface UncertaintyPropagationFrame {
  clearance_mm: number;
  measurement_sigma_mm: number;
  prediction_sigma_mm: number;
  minimum_safe_clearance_mm: number;
  formal_worst_case_clearance_mm: number;
  decision: 'NOMINAL' | 'WARN' | 'VETO';
  reasoning: string;
}

export interface WorldStateFrame {
  world_state_id: string; // e.g. "WS_000041", "WS_000042", "WS_000043"
  timestamp_ms: number;
  parent_world_state_id?: string;
  objects: TrackedWorldObject[];
  robot_state: {
    joint_positions_deg: [number, number, number, number, number, number, number];
    joint_velocities_dps: [number, number, number, number, number, number, number];
    joint_torque_peak: number;
    temperature_c: number;
    gripper_aperture_mm: number;
  };
  tactile: {
    normal_force_n: number;
    shear_magnitude_n: number;
    contact_area_mm2: number;
    slip_probability: number;
    wetness_pct: number;
  };
  audio: AudioEventReading;
  temporal_delta: TemporalDeltaFrame;
  uncertainty_chain: UncertaintyPropagationFrame;
}

// Dynamic Hypergraph
export interface DynamicHypergraphTransition {
  time_key: 't0' | 't1' | 't2' | 't3' | 't4' | 't5';
  timestamp_ms: number;
  edge_id: string;
  source_node: string;
  relationship: 'near' | 'approaching' | 'contacts' | 'holding' | 'entering' | 'secured_in';
  target_node: string;
  active_constraints: string[];
  formal_invariant: string;
  status: 'active' | 'transitioning' | 'completed' | 'pending';
}

// Two-Layer World Model
export interface GeometricWorldLayer {
  pointcloud_count: number;
  mesh_polygons: number;
  gaussian_splat_count: number;
  gaussian_splats_active: boolean;
  camera_streams: Array<{
    id: string;
    name: string;
    fps: number;
    resolution: string;
    fov_deg: number;
    pose_matrix: string;
    status: 'STREAMING' | 'CALIBRATED';
  }>;
  depth_min_max_mm: [number, number];
}

export interface ScientificWorldLayer {
  active_objects_count: number;
  hypergraph_edges_count: number;
  state_tensor_dim: string;
  causal_invariants: string[];
  safety_envelope_margin_pct: number;
  sllm_grounding_score: number;
}

// World-Model Imagination Branch (Multiple Counterfactual Futures)
export interface CounterfactualFuture {
  candidate_id: 'ACTION_A' | 'ACTION_B' | 'ACTION_C';
  action_label: string;
  trajectory_strategy: string;
  predicted_outcome: {
    success_probability: number;
    peak_torque_nm: number;
    minimum_clearance_mm: number;
    slip_probability: number;
    energy_joules: number;
  };
  physics_simulation: {
    engine: string;
    rollout_horizon_ms: number;
    collision_detected: boolean;
    stress_concentration_mpa: number;
  };
  symbolic_veto: {
    status: 'APPROVED' | 'VETOED' | 'WARNING';
    violated_invariants: string[];
    veto_reason?: string;
  };
  is_selected_best_action: boolean;
}

// Sim-to-Real Calibration Loop
export interface SimToRealCalibration {
  experiment_id: string;
  predicted_clearance_mm: number;
  measured_clearance_mm: number;
  error_clearance_mm: number;
  predicted_grip_force_n: number;
  measured_grip_force_n: number;
  error_grip_force_n: number;
  predicted_slip_prob: number;
  measured_slip_prob: number;
  error_slip_prob: number;
  learned_calibration_offset: string;
  reality_anchor_confidence: number;
  iterations_converged: number;
}

// Action Result Bridge
export interface ActionResultBridge {
  action_id: string;
  world_state_id: string;
  timestamp_executed_ms: number;
  predicted: {
    success_probability: number;
    clearance_mm: number;
    slip_probability: number;
    peak_torque_nm: number;
  };
  actual: {
    success: boolean;
    clearance_mm: number;
    slip_probability: number;
    peak_torque_nm: number;
  };
  errors: {
    clearance_mm: number;
    slip_probability: number;
    peak_torque_nm: number;
  };
  reproducible: boolean;
  promoted_to_skill_memory: boolean;
}

// Hierarchical Skill Memory
export interface HierarchicalSkillMemoryNode {
  level: 'EXPERIMENT' | 'EPISODE' | 'TRAJECTORY' | 'SKILL' | 'GENERALIZED_PRIOR';
  id: string;
  name: string;
  description: string;
  conditions: {
    wetness_pct_range: [number, number];
    object_mass_g_range: [number, number];
    surface_curvature: string;
  };
  successful_trajectories: string[];
  failure_trajectories: string[];
  recommended_parameters: {
    grip_force_n_range: [number, number];
    insertion_speed_mms: number;
    compliance_stiffness_nm_rad: number;
  };
  confidence: number;
  last_validated_timestamp: string;
}

// Provenance & Scientific Lineage
export interface ProvenanceAuditLineage {
  prediction_id: string;
  world_state_id: string;
  experiment_id: string;
  sensor_versions: {
    lidar: string;
    gelsight: string;
    robot_encoders: string;
    rgb_camera: string;
    ambient_audio: string;
  };
  model_version: string;
  policy_version: string;
  simulation_engine: string;
  human_gate_authorized: boolean;
  hardware_authorization_hash: string;
  git_lineage_commit: string;
}

// ----------------------------------------------------
// Deterministic 11-Step World State Timeline (0 to 50ms)
// ----------------------------------------------------

export const DETERMINISTIC_WORLD_STATE_TIMELINE: WorldStateFrame[] = [
  {
    world_state_id: "WS_000040",
    timestamp_ms: 0,
    objects: [
      {
        id: "plate_01",
        class: "plate",
        position: [120, 80, 145],
        velocity: [0.00, 0.00, 0.00],
        confidence: 0.99,
        covariance_sigma: [0.8, 0.8, 1.2],
        bounding_box: { width: 220, height: 220, depth: 25 },
        material: { name: "Ceramic Glaze", fragility: 0.25, friction_coefficient: 0.22, wetness_pct: 12 }
      },
      {
        id: "glass_01",
        class: "glass",
        position: [210, 105, 180],
        velocity: [0.00, 0.00, 0.00],
        confidence: 0.97,
        covariance_sigma: [1.1, 1.1, 1.5],
        bounding_box: { width: 75, height: 75, depth: 150 },
        material: { name: "Soda-Lime Glass", fragility: 0.95, friction_coefficient: 0.16, wetness_pct: 18 }
      }
    ],
    robot_state: {
      joint_positions_deg: [12.1, -24.5, 31.2, 8.4, 15.2, -6.1, 2.0],
      joint_velocities_dps: [0, 0, 0, 0, 0, 0, 0],
      joint_torque_peak: 2.1,
      temperature_c: 37.8,
      gripper_aperture_mm: 88.0
    },
    tactile: {
      normal_force_n: 0.2,
      shear_magnitude_n: 0.014,
      contact_area_mm2: 18,
      slip_probability: 0.01,
      wetness_pct: 12
    },
    audio: {
      timestamp_ms: 0,
      amplitude_db: 42.1,
      frequency_centroid_hz: 320,
      classification: 'silent',
      anomaly_score: 0.02
    },
    temporal_delta: {
      delta_description: "Initial quiescent state. Robot positioned above lower rack.",
      displaced_objects: [],
      torque_delta_nm: 0.0,
      slip_acceleration: 0.0
    },
    uncertainty_chain: {
      clearance_mm: 52.0,
      measurement_sigma_mm: 1.8,
      prediction_sigma_mm: 3.2,
      minimum_safe_clearance_mm: 50.0,
      formal_worst_case_clearance_mm: 48.8,
      decision: 'WARN',
      reasoning: "Nominal clearance 52.0mm. Factoring combined sigma ±3.2mm gives worst-case 48.8mm (<50.0mm threshold). Prudence gate triggers soft advisory."
    }
  },
  {
    world_state_id: "WS_000041",
    timestamp_ms: 5,
    parent_world_state_id: "WS_000040",
    objects: [
      {
        id: "plate_01",
        class: "plate",
        position: [121, 81, 145],
        velocity: [0.02, 0.02, 0.00],
        confidence: 0.99,
        covariance_sigma: [0.8, 0.8, 1.2],
        bounding_box: { width: 220, height: 220, depth: 25 },
        material: { name: "Ceramic Glaze", fragility: 0.25, friction_coefficient: 0.22, wetness_pct: 13 }
      },
      {
        id: "glass_01",
        class: "glass",
        position: [211, 106, 180],
        velocity: [0.01, 0.01, 0.00],
        confidence: 0.97,
        covariance_sigma: [1.1, 1.1, 1.5],
        bounding_box: { width: 75, height: 75, depth: 150 },
        material: { name: "Soda-Lime Glass", fragility: 0.95, friction_coefficient: 0.16, wetness_pct: 18 }
      }
    ],
    robot_state: {
      joint_positions_deg: [12.2, -24.6, 31.3, 8.5, 15.3, -6.0, 2.1],
      joint_velocities_dps: [20, -20, 20, 20, 20, 20, 20],
      joint_torque_peak: 2.3,
      temperature_c: 37.9,
      gripper_aperture_mm: 82.0
    },
    tactile: {
      normal_force_n: 0.8,
      shear_magnitude_n: 0.036,
      contact_area_mm2: 32,
      slip_probability: 0.02,
      wetness_pct: 13
    },
    audio: {
      timestamp_ms: 5,
      amplitude_db: 46.5,
      frequency_centroid_hz: 480,
      classification: 'smooth_contact',
      anomaly_score: 0.04
    },
    temporal_delta: {
      delta_description: "Gripper elastomer finger pads establish initial contact with plate rim.",
      displaced_objects: [{ id: "plate_01", delta_xyz_mm: [1, 1, 0], delta_v: 0.02 }],
      torque_delta_nm: 0.2,
      slip_acceleration: 0.002
    },
    uncertainty_chain: {
      clearance_mm: 51.6,
      measurement_sigma_mm: 1.9,
      prediction_sigma_mm: 3.5,
      minimum_safe_clearance_mm: 50.0,
      formal_worst_case_clearance_mm: 48.1,
      decision: 'WARN',
      reasoning: "Contact initiated. Elastomer deformation measured at 32 mm². Worst-case margin is 48.1mm."
    }
  },
  {
    world_state_id: "WS_000042",
    timestamp_ms: 15,
    parent_world_state_id: "WS_000041",
    objects: [
      {
        id: "plate_01",
        class: "plate",
        position: [128, 88, 148],
        velocity: [0.12, 0.03, -0.01],
        confidence: 0.98,
        covariance_sigma: [0.9, 0.9, 1.3],
        bounding_box: { width: 220, height: 220, depth: 25 },
        material: { name: "Ceramic Glaze", fragility: 0.25, friction_coefficient: 0.22, wetness_pct: 17 }
      },
      {
        id: "glass_01",
        class: "glass",
        position: [217, 112, 182],
        velocity: [0.08, 0.01, 0.00],
        confidence: 0.96,
        covariance_sigma: [1.2, 1.2, 1.6],
        bounding_box: { width: 75, height: 75, depth: 150 },
        material: { name: "Soda-Lime Glass", fragility: 0.95, friction_coefficient: 0.16, wetness_pct: 19 }
      }
    ],
    robot_state: {
      joint_positions_deg: [13.0, -25.4, 32.3, 9.0, 16.0, -5.4, 2.6],
      joint_velocities_dps: [100, -100, 120, 60, 80, 80, 60],
      joint_torque_peak: 4.0,
      temperature_c: 38.1,
      gripper_aperture_mm: 45.0
    },
    tactile: {
      normal_force_n: 3.2,
      shear_magnitude_n: 0.122,
      contact_area_mm2: 61,
      slip_probability: 0.04,
      wetness_pct: 17
    },
    audio: {
      timestamp_ms: 15,
      amplitude_db: 52.8,
      frequency_centroid_hz: 610,
      classification: 'smooth_contact',
      anomaly_score: 0.06
    },
    temporal_delta: {
      delta_description: "Plate lifted off holding bay. Velocity vector [0.12, 0.03, -0.01] mm/ms directed toward slot 4.",
      displaced_objects: [{ id: "plate_01", delta_xyz_mm: [7, 7, 3], delta_v: 0.12 }],
      torque_delta_nm: 0.9,
      slip_acceleration: 0.005
    },
    uncertainty_chain: {
      clearance_mm: 50.8,
      measurement_sigma_mm: 2.1,
      prediction_sigma_mm: 4.8,
      minimum_safe_clearance_mm: 50.0,
      formal_worst_case_clearance_mm: 46.0,
      decision: 'WARN',
      reasoning: "Measured 50.8 mm, predicted uncertainty ±4.8 mm -> worst-case clearance 46.0 mm (<50mm). Insufficient safety buffer triggers advisory WARN."
    }
  },
  {
    world_state_id: "WS_000043",
    timestamp_ms: 30,
    parent_world_state_id: "WS_000042",
    objects: [
      {
        id: "plate_01",
        class: "plate",
        position: [142, 98, 155],
        velocity: [0.14, 0.04, -0.02],
        confidence: 0.98,
        covariance_sigma: [1.0, 1.0, 1.4],
        bounding_box: { width: 220, height: 220, depth: 25 },
        material: { name: "Ceramic Glaze", fragility: 0.25, friction_coefficient: 0.22, wetness_pct: 22 }
      },
      {
        id: "glass_01",
        class: "glass",
        position: [225, 120, 185],
        velocity: [0.00, 0.00, 0.00],
        confidence: 0.96,
        covariance_sigma: [1.2, 1.2, 1.6],
        bounding_box: { width: 75, height: 75, depth: 150 },
        material: { name: "Soda-Lime Glass", fragility: 0.95, friction_coefficient: 0.16, wetness_pct: 20 }
      }
    ],
    robot_state: {
      joint_positions_deg: [15.2, -27.4, 34.8, 10.2, 17.5, -3.5, 4.0],
      joint_velocities_dps: [140, -120, 160, 80, 100, 140, 100],
      joint_torque_peak: 7.0,
      temperature_c: 38.3,
      gripper_aperture_mm: 36.0
    },
    tactile: {
      normal_force_n: 6.2,
      shear_magnitude_n: 0.368,
      contact_area_mm2: 81,
      slip_probability: 0.11,
      wetness_pct: 22
    },
    audio: {
      timestamp_ms: 30,
      amplitude_db: 58.2,
      frequency_centroid_hz: 840,
      classification: 'acoustic_transient',
      anomaly_score: 0.12
    },
    temporal_delta: {
      delta_description: "Peak torque inflection at 7.0 Nm during pitch alignment over dish rack.",
      displaced_objects: [{ id: "plate_01", delta_xyz_mm: [14, 10, 7], delta_v: 0.14 }],
      torque_delta_nm: 0.6,
      slip_acceleration: 0.012
    },
    uncertainty_chain: {
      clearance_mm: 49.6,
      measurement_sigma_mm: 2.3,
      prediction_sigma_mm: 5.1,
      minimum_safe_clearance_mm: 50.0,
      formal_worst_case_clearance_mm: 44.5,
      decision: 'VETO',
      reasoning: "Nominal clearance 49.6 mm is below 50.0 mm safety envelope. Combined uncertainty ±5.1 mm yields worst-case clearance 44.5 mm. High collision risk."
    }
  },
  {
    world_state_id: "WS_000044",
    timestamp_ms: 50,
    parent_world_state_id: "WS_000043",
    objects: [
      {
        id: "plate_01",
        class: "plate",
        position: [160, 110, 162],
        velocity: [0.06, 0.01, -0.03],
        confidence: 0.97,
        covariance_sigma: [1.2, 1.2, 1.7],
        bounding_box: { width: 220, height: 220, depth: 25 },
        material: { name: "Ceramic Glaze", fragility: 0.25, friction_coefficient: 0.22, wetness_pct: 34 }
      },
      {
        id: "glass_01",
        class: "glass",
        position: [225, 120, 185],
        velocity: [0.00, 0.00, 0.00],
        confidence: 0.95,
        covariance_sigma: [1.3, 1.3, 1.8],
        bounding_box: { width: 75, height: 75, depth: 150 },
        material: { name: "Soda-Lime Glass", fragility: 0.95, friction_coefficient: 0.16, wetness_pct: 22 }
      }
    ],
    robot_state: {
      joint_positions_deg: [17.0, -28.8, 37.0, 11.7, 19.1, -1.7, 5.4],
      joint_velocities_dps: [60, -40, 80, 60, 60, 60, 60],
      joint_torque_peak: 3.5,
      temperature_c: 38.7,
      gripper_aperture_mm: 36.0
    },
    tactile: {
      normal_force_n: 6.1,
      shear_magnitude_n: 1.136,
      contact_area_mm2: 75,
      slip_probability: 0.63,
      wetness_pct: 34
    },
    audio: {
      timestamp_ms: 50,
      amplitude_db: 67.4,
      frequency_centroid_hz: 1820,
      classification: 'slip_chatter',
      anomaly_score: 0.68
    },
    temporal_delta: {
      delta_description: "Developing slip detected! Shear force spiked to 1.14 N under 34% wetness. Causal reflex initiated.",
      displaced_objects: [{ id: "plate_01", delta_xyz_mm: [18, 12, 7], delta_v: -0.08 }],
      torque_delta_nm: -3.5,
      slip_acceleration: 0.045,
      causal_event_triggered: "AUTONOMOUS_IMPEDANCE_DAMPENING"
    },
    uncertainty_chain: {
      clearance_mm: 48.0,
      measurement_sigma_mm: 2.6,
      prediction_sigma_mm: 5.6,
      minimum_safe_clearance_mm: 50.0,
      formal_worst_case_clearance_mm: 42.4,
      decision: 'VETO',
      reasoning: "Slip probability 63% > 40% threshold. Clearance 48.0 mm < 50.0 mm. Autonomous safety reflex clamped descent velocity and applied 6.1N normal force correction."
    }
  }
];

// ----------------------------------------------------
// Dynamic Hypergraph Transitions (t0 to t5)
// ----------------------------------------------------

export const DYNAMIC_HYPERGRAPH_TRANSITIONS: DynamicHypergraphTransition[] = [
  {
    time_key: 't0',
    timestamp_ms: 0,
    edge_id: 'EDGE_01',
    source_node: 'robot_manipulator',
    relationship: 'near',
    target_node: 'plate_01',
    active_constraints: ['standoff_distance > 100mm', 'velocity_limit < 200 deg/s'],
    formal_invariant: 'Invariant 1: No uncommanded rapid joint accelerations',
    status: 'completed'
  },
  {
    time_key: 't1',
    timestamp_ms: 5,
    edge_id: 'EDGE_02',
    source_node: 'gripper_fingers',
    relationship: 'approaching',
    target_node: 'plate_01',
    active_constraints: ['approach_vector_angle < 15 deg', 'aperture > plate_width + 10mm'],
    formal_invariant: 'Invariant 2: Approach along normal vector of ceramic rim',
    status: 'completed'
  },
  {
    time_key: 't2',
    timestamp_ms: 10,
    edge_id: 'EDGE_03',
    source_node: 'gripper_fingers',
    relationship: 'contacts',
    target_node: 'plate_01',
    active_constraints: ['normal_force < 7.0 N (Glass Fragility)', 'contact_area > 30 mm²'],
    formal_invariant: 'Invariant 3: Force ramp rate <= 2.5 N/s',
    status: 'completed'
  },
  {
    time_key: 't3',
    timestamp_ms: 15,
    edge_id: 'EDGE_04',
    source_node: 'gripper_fingers',
    relationship: 'holding',
    target_node: 'plate_01',
    active_constraints: ['shear_force < 1.2 N', 'slip_probability < 0.70'],
    formal_invariant: 'Invariant 4: Object grasp stability margin > 30%',
    status: 'completed'
  },
  {
    time_key: 't4',
    timestamp_ms: 30,
    edge_id: 'EDGE_05',
    source_node: 'plate_01',
    relationship: 'entering',
    target_node: 'rack_slot_4',
    active_constraints: ['clearance_to_tine > 50.0 mm', 'pitch_alignment_error < 3.0 deg'],
    formal_invariant: 'Invariant 5: Clearance envelope >= 50.0mm',
    status: 'active'
  },
  {
    time_key: 't5',
    timestamp_ms: 50,
    edge_id: 'EDGE_06',
    source_node: 'plate_01',
    relationship: 'secured_in',
    target_node: 'rack_slot_4',
    active_constraints: ['seating_depth == 145mm', 'gripper_release_force == 0.0 N'],
    formal_invariant: 'Invariant 6: Zero kinetic energy upon release',
    status: 'pending'
  }
];

// ----------------------------------------------------
// Imagination Branch (3 Counterfactual Futures)
// ----------------------------------------------------

export const IMAGINATION_COUNTERFACTUAL_FUTURES: CounterfactualFuture[] = [
  {
    candidate_id: 'ACTION_A',
    action_label: 'Trajectory A: Grasp from Left Quadrant',
    trajectory_strategy: 'Direct horizontal sweep from left side, high velocity insertion.',
    predicted_outcome: {
      success_probability: 0.58,
      peak_torque_nm: 8.8,
      minimum_clearance_mm: 44.2,
      slip_probability: 0.54,
      energy_joules: 34.2
    },
    physics_simulation: {
      engine: 'MuJoCo 2.3 Rigid + Soft Contact Engine',
      rollout_horizon_ms: 250,
      collision_detected: true,
      stress_concentration_mpa: 8.4
    },
    symbolic_veto: {
      status: 'VETOED',
      violated_invariants: [
        'Invariant 5: Clearance envelope 44.2mm < 50.0mm threshold',
        'Invariant 3: Peak torque 8.8Nm exceeds conservative limit'
      ],
      veto_reason: 'Left trajectory collides with rack tine #3 during insertion roll.'
    },
    is_selected_best_action: false
  },
  {
    candidate_id: 'ACTION_B',
    action_label: 'Trajectory B: Center Rim + Adaptive Impedance (RECOMMENDED)',
    trajectory_strategy: 'Normal approach perpendicular to rim with 200 Hz impedance compliance and tactile feedback damping.',
    predicted_outcome: {
      success_probability: 0.96,
      peak_torque_nm: 5.2,
      minimum_clearance_mm: 53.4,
      slip_probability: 0.14,
      energy_joules: 18.5
    },
    physics_simulation: {
      engine: 'MuJoCo 2.3 Rigid + Soft Contact Engine',
      rollout_horizon_ms: 250,
      collision_detected: false,
      stress_concentration_mpa: 2.1
    },
    symbolic_veto: {
      status: 'APPROVED',
      violated_invariants: []
    },
    is_selected_best_action: true
  },
  {
    candidate_id: 'ACTION_C',
    action_label: 'Trajectory C: Rapid Vertical Top-Down Insertion',
    trajectory_strategy: 'Steep vertical drop with stiff kinematic controller.',
    predicted_outcome: {
      success_probability: 0.41,
      peak_torque_nm: 10.4,
      minimum_clearance_mm: 38.5,
      slip_probability: 0.76,
      energy_joules: 48.0
    },
    physics_simulation: {
      engine: 'MuJoCo 2.3 Rigid + Soft Contact Engine',
      rollout_horizon_ms: 250,
      collision_detected: true,
      stress_concentration_mpa: 14.8
    },
    symbolic_veto: {
      status: 'VETOED',
      violated_invariants: [
        'Invariant 5: Clearance 38.5mm < 50.0mm threshold',
        'Invariant 4: Slip probability 76% > 70% max tolerance',
        'Invariant 1: Stress concentration 14.8 MPa risks ceramic chip'
      ],
      veto_reason: 'Vertical drop causes severe impact impulse and high slip under wet surface.'
    },
    is_selected_best_action: false
  }
];

// ----------------------------------------------------
// Sim-to-Real Calibration & Action Result Bridge
// ----------------------------------------------------

export const SIM_TO_REAL_CALIBRATION_DATA: SimToRealCalibration = {
  experiment_id: "EXP-2026-PHYSICAL-AI-DISHWASHER-001",
  predicted_clearance_mm: 55.2,
  measured_clearance_mm: 52.0,
  error_clearance_mm: -3.2,
  predicted_grip_force_n: 5.8,
  measured_grip_force_n: 6.1,
  error_grip_force_n: 0.3,
  predicted_slip_prob: 0.58,
  measured_slip_prob: 0.63,
  error_slip_prob: 0.05,
  learned_calibration_offset: "Simulator overestimates clearance by 3.2mm in wet rack environment. Learned offset delta_clearance = -3.2mm applied to policy prior.",
  reality_anchor_confidence: 0.942,
  iterations_converged: 18
};

export const DETERMINISTIC_ACTION_RESULT: ActionResultBridge = {
  action_id: "ACT_00091",
  world_state_id: "WS_000042",
  timestamp_executed_ms: 250,
  predicted: {
    success_probability: 0.94,
    clearance_mm: 54.0,
    slip_probability: 0.12,
    peak_torque_nm: 4.8
  },
  actual: {
    success: true,
    clearance_mm: 52.0,
    slip_probability: 0.18,
    peak_torque_nm: 5.2
  },
  errors: {
    clearance_mm: -2.0,
    slip_probability: 0.06,
    peak_torque_nm: 0.4
  },
  reproducible: true,
  promoted_to_skill_memory: true
};

// ----------------------------------------------------
// Hierarchical Skill Memory Nodes
// ----------------------------------------------------

export const HIERARCHICAL_SKILL_MEMORY_NODES: HierarchicalSkillMemoryNode[] = [
  {
    level: 'GENERALIZED_PRIOR',
    id: 'PRIOR_001',
    name: 'Wet Viscoelastic Contact Physics Prior',
    description: 'Bayesian prior encoding hydrodynamic lubrication between silicone elastomer and wet smooth glazed ceramic/glass.',
    conditions: {
      wetness_pct_range: [10, 80],
      object_mass_g_range: [100, 1500],
      surface_curvature: 'Any smooth convex/planar'
    },
    successful_trajectories: ['T_00840', 'T_00842', 'T_00855', 'T_00860'],
    failure_trajectories: ['T_00810', 'T_00813', 'T_00819'],
    recommended_parameters: {
      grip_force_n_range: [5.8, 6.5],
      insertion_speed_mms: 45,
      compliance_stiffness_nm_rad: 120
    },
    confidence: 0.96,
    last_validated_timestamp: '2026-08-24T22:45:00Z'
  },
  {
    level: 'SKILL',
    id: 'SKILL_0084',
    name: 'Fragile Glass & Wet Plate Dishwasher Loading',
    description: 'Reusable compliant skill for inserting fragile objects into tight wire rack slots with 200 Hz tactile slip compensation.',
    conditions: {
      wetness_pct_range: [20, 40],
      object_mass_g_range: [180, 250],
      surface_curvature: 'R = 110mm rim'
    },
    successful_trajectories: ['T_00842', 'T_00843'],
    failure_trajectories: ['T_00813', 'T_00819'],
    recommended_parameters: {
      grip_force_n_range: [6.0, 6.3],
      insertion_speed_mms: 30,
      compliance_stiffness_nm_rad: 85
    },
    confidence: 0.91,
    last_validated_timestamp: '2026-08-24T23:05:00Z'
  },
  {
    level: 'TRAJECTORY',
    id: 'T_00842',
    name: 'Validated Trajectory T_00842',
    description: 'Impedance-damped trajectory achieving 52.0mm clearance and zero glass fracture under 34% wetness.',
    conditions: {
      wetness_pct_range: [30, 35],
      object_mass_g_range: [210, 230],
      surface_curvature: 'R = 110mm rim'
    },
    successful_trajectories: ['T_00842'],
    failure_trajectories: [],
    recommended_parameters: {
      grip_force_n_range: [6.1, 6.2],
      insertion_speed_mms: 25,
      compliance_stiffness_nm_rad: 80
    },
    confidence: 0.98,
    last_validated_timestamp: '2026-08-24T23:10:00Z'
  }
];

// ----------------------------------------------------
// Master Provenance & Audit Lineage
// ----------------------------------------------------

export const MASTER_PROVENANCE_AUDIT: ProvenanceAuditLineage = {
  prediction_id: "P_00182",
  world_state_id: "WS_000042",
  experiment_id: "EXP-2026-PHYSICAL-AI-DISHWASHER-001",
  sensor_versions: {
    lidar: "v2.1 (0.15mm Metrology)",
    gelsight: "v1.4 (200 Hz Tactile Array)",
    robot_encoders: "v3.0 (Absolute 19-bit Optical)",
    rgb_camera: "v1.2 (Overhead + Eye-in-Hand)",
    ambient_audio: "v1.0 (Acoustic Transient Hydrophone)"
  },
  model_version: "OMEGA-PHYS-0.9.4",
  policy_version: "GRASP-0.3 (Compliant Impedance)",
  simulation_engine: "MUJOCO-2.3 (Calibrated Sim-to-Real)",
  human_gate_authorized: true,
  hardware_authorization_hash: "0x98f2c3a7e1b40d89c562e841fa90218b",
  git_lineage_commit: "commit-f89a24c-physical-world-state-closed-loop"
};
