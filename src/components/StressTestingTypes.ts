// src/components/StressTestingTypes.ts
// Comprehensive Stress Testing & Edge Case Scenarios for Physical AI Robotics

export interface StressTestCase {
  id: string;
  category: 'viscoelastic' | 'optical' | 'temporal' | 'jamming' | 'counterfactual' | 'sim2real' | 'fatigue';
  categoryTitle: string;
  title: string;
  subtitle: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  parameters: {
    label: string;
    nominalValue: string;
    stressValue: string;
    unit?: string;
  }[];
  expectedBehavior: string;
  formalInvariant: string;
  simulationRun: {
    status: 'PASSED' | 'FAILED' | 'WARN_VETOED' | 'RECOVERED';
    measuredOutcome: {
      peakTorqueNm: number;
      minClearanceMm: number;
      slipProbPct: number;
      fractureRiskPct: number;
      latencyMs: number;
      reactionTimeMs: number;
    };
    vetoTriggered: boolean;
    vetoRuleName?: string;
    mitigationApplied: string;
    simToRealErrorDelta: string;
    telemetryTrace: Array<{
      timeMs: number;
      torqueNm: number;
      shearForceN: number;
      clearanceMm: number;
      slipProbPct: number;
      systemState: string;
    }>;
  };
}

export const STRESS_TEST_SUITE: StressTestCase[] = [
  // 1. Viscoelastic & Contact Mechanics
  {
    id: 'STRESS_01_LUBRICATION_SLIP',
    category: 'viscoelastic',
    categoryTitle: '1. Viscoelastic & Wet Lubrication',
    title: 'Surfactant Slickness & Wet Slip Cascade',
    subtitle: 'Wetness spike 12% → 90% (μ: 0.22 → 0.08)',
    severity: 'CRITICAL',
    description: 'Simulates detergent residue forming a hydrodynamic lubrication boundary layer between elastomer gripper pads and glazed ceramic/glass plate rim.',
    parameters: [
      { label: 'Surface Wetness', nominalValue: '12%', stressValue: '88%' },
      { label: 'Friction Coeff (μ)', nominalValue: '0.22', stressValue: '0.08' },
      { label: 'Viscosity Factor', nominalValue: '1.0 cP', stressValue: '4.5 cP' },
      { label: 'Normal Force Limit', nominalValue: '6.0 N', stressValue: '6.8 N' }
    ],
    expectedBehavior: '200 Hz GelSight tactile array detects micro-shear acceleration within 12ms, increasing normal grip force to 6.8N without fracturing fragile glass (>7.0N limit).',
    formalInvariant: 'Invariant 4: Grasp Stability > 30% && Normal Force <= 7.0 N',
    simulationRun: {
      status: 'RECOVERED',
      measuredOutcome: {
        peakTorqueNm: 5.6,
        minClearanceMm: 51.8,
        slipProbPct: 62,
        fractureRiskPct: 4,
        latencyMs: 12,
        reactionTimeMs: 14
      },
      vetoTriggered: true,
      vetoRuleName: 'TACTILE_REFLEX_IMPEDANCE_CLAMP',
      mitigationApplied: 'Autonomous 200 Hz tactile reflex clamped descent velocity by -45% and augmented elastomer contact pressure to 6.4 N, halting shear displacement.',
      simToRealErrorDelta: 'Slip onset occurred 4ms earlier in reality due to fluid film shearing.',
      telemetryTrace: [
        { timeMs: 0, torqueNm: 2.1, shearForceN: 0.014, clearanceMm: 52.0, slipProbPct: 2, systemState: 'Nominal Grip' },
        { timeMs: 10, torqueNm: 2.6, shearForceN: 0.085, clearanceMm: 51.5, slipProbPct: 8, systemState: 'Lifting from Bay' },
        { timeMs: 20, torqueNm: 4.2, shearForceN: 0.380, clearanceMm: 50.8, slipProbPct: 24, systemState: 'Surfactant Film Shearing' },
        { timeMs: 30, torqueNm: 5.4, shearForceN: 0.980, clearanceMm: 50.2, slipProbPct: 58, systemState: '⚠️ Micro-Slip Warning' },
        { timeMs: 40, torqueNm: 5.6, shearForceN: 1.140, clearanceMm: 51.2, slipProbPct: 62, systemState: '🛡️ Reflex Damping Active' },
        { timeMs: 50, torqueNm: 4.8, shearForceN: 0.420, clearanceMm: 51.8, slipProbPct: 14, systemState: '✅ Grasp Re-stabilized' }
      ]
    }
  },

  // 2. Optical Occlusion & High Refraction
  {
    id: 'STRESS_02_OPTICAL_OCCLUSION',
    category: 'optical',
    categoryTitle: '2. Perception & Optical Occlusion',
    title: 'Steam Condensation & Multi-Camera Dropout',
    subtitle: '70% camera occlusion + high-refraction glass',
    severity: 'HIGH',
    description: 'Dishwasher steam fogs camera optics while specular glare from crystal glassware scatters LiDAR point clouds, dropping point density by 65%.',
    parameters: [
      { label: 'Camera Occlusion', nominalValue: '0%', stressValue: '70%' },
      { label: 'LiDAR Valid Returns', nominalValue: '99.4%', stressValue: '34.2%' },
      { label: 'Specular Refraction Noise', nominalValue: '0.2 mm', stressValue: '4.8 mm' },
      { label: 'Covariance σ_meas', nominalValue: '±1.8 mm', stressValue: '±5.8 mm' }
    ],
    expectedBehavior: 'System expands measurement covariance σ_meas to ±5.8mm, maintaining object permanence and triggering conservative WARN mode instead of blindly assuming unobserved tines are absent.',
    formalInvariant: 'Invariant 5: Clearance Envelope >= 50.0mm (Including 2σ Uncertainty)',
    simulationRun: {
      status: 'WARN_VETOED',
      measuredOutcome: {
        peakTorqueNm: 3.8,
        minClearanceMm: 44.4,
        slipProbPct: 18,
        fractureRiskPct: 1,
        latencyMs: 25,
        reactionTimeMs: 18
      },
      vetoTriggered: true,
      vetoRuleName: 'PERCEPTION_UNCERTAINTY_SAFETY_MARGIN_BREACH',
      mitigationApplied: 'Nominal clearance 50.2mm reduced to worst-case 44.4mm (50.2 - 5.8mm). Trajectory halted at standoff waypoint until acoustic and tactile fusion confirmed boundary.',
      simToRealErrorDelta: 'Specular refraction shifted predicted rim position by +3.1mm.',
      telemetryTrace: [
        { timeMs: 0, torqueNm: 2.1, shearForceN: 0.014, clearanceMm: 52.0, slipProbPct: 2, systemState: 'Cameras Clear' },
        { timeMs: 10, torqueNm: 2.4, shearForceN: 0.040, clearanceMm: 51.5, slipProbPct: 3, systemState: 'Steam Fog Ingress' },
        { timeMs: 20, torqueNm: 3.1, shearForceN: 0.090, clearanceMm: 50.8, slipProbPct: 6, systemState: 'Point Cloud Sparse (34%)' },
        { timeMs: 30, torqueNm: 3.8, shearForceN: 0.120, clearanceMm: 50.2, slipProbPct: 12, systemState: 'σ_meas Spikes to ±5.8mm' },
        { timeMs: 40, torqueNm: 3.5, shearForceN: 0.110, clearanceMm: 44.4, slipProbPct: 15, systemState: '🛑 Symbolic VETO Tripped' },
        { timeMs: 50, torqueNm: 2.8, shearForceN: 0.080, clearanceMm: 50.0, slipProbPct: 8, systemState: 'Safe Standoff Hover' }
      ]
    }
  },

  // 3. Temporal Jitter & Clock Drift
  {
    id: 'STRESS_03_TEMPORAL_JITTER',
    category: 'temporal',
    categoryTitle: '3. Clock Synchrony & Temporal Jitter',
    title: 'PTP Clock Drift & 80ms Telemetry Lag Spike',
    subtitle: 'Joint encoder latency jumps 5ms → 85ms',
    severity: 'HIGH',
    description: 'Injects severe CAN bus and Ethernet packet jitter causing out-of-order telemetry arrival and 80ms latency spikes during fast insertion descent.',
    parameters: [
      { label: 'Bus Latency', nominalValue: '5.0 ms', stressValue: '85.0 ms' },
      { label: 'Clock Drift (PTP)', nominalValue: '0.05 μs', stressValue: '12.4 ms' },
      { label: 'Dropped Packets', nominalValue: '0.01%', stressValue: '18.5%' },
      { label: 'Extrapolation Horizon', nominalValue: '10 ms', stressValue: '100 ms' }
    ],
    expectedBehavior: 'State buffer detects stale timestamp differential (Δt > 20ms). Predictive world-state halts aggressive motion and defaults to compliant passive impedance.',
    formalInvariant: 'Invariant 1: No uncommanded extrapolation when telemetry age > 25ms',
    simulationRun: {
      status: 'RECOVERED',
      measuredOutcome: {
        peakTorqueNm: 4.4,
        minClearanceMm: 50.5,
        slipProbPct: 15,
        fractureRiskPct: 2,
        latencyMs: 85,
        reactionTimeMs: 22
      },
      vetoTriggered: true,
      vetoRuleName: 'STALE_STATE_HORIZON_HOLD',
      mitigationApplied: 'Failsafe watchdog engaged at t=28ms when telemetry packet age exceeded 25ms. Controller switched to zero-gravity compliance until resynchronized.',
      simToRealErrorDelta: 'Encoder queue backlog resolved within 3 cycles after burst flush.',
      telemetryTrace: [
        { timeMs: 0, torqueNm: 2.1, shearForceN: 0.014, clearanceMm: 52.0, slipProbPct: 2, systemState: 'PTP Synchronized' },
        { timeMs: 10, torqueNm: 2.5, shearForceN: 0.050, clearanceMm: 51.6, slipProbPct: 3, systemState: 'Bus Latency Nominal' },
        { timeMs: 20, torqueNm: 3.2, shearForceN: 0.100, clearanceMm: 51.0, slipProbPct: 7, systemState: '⚠️ 85ms Lag Spike Injected' },
        { timeMs: 30, torqueNm: 4.4, shearForceN: 0.160, clearanceMm: 50.5, slipProbPct: 15, systemState: '🛑 Watchdog Freeze Active' },
        { timeMs: 40, torqueNm: 3.8, shearForceN: 0.140, clearanceMm: 50.5, slipProbPct: 12, systemState: 'Passive Damping Mode' },
        { timeMs: 50, torqueNm: 2.9, shearForceN: 0.080, clearanceMm: 50.8, slipProbPct: 6, systemState: '✅ Clock Resynchronized' }
      ]
    }
  },

  // 4. Jamming & Wire Tine Misalignment
  {
    id: 'STRESS_04_JAMMING_COLLISION',
    category: 'jamming',
    categoryTitle: '4. Physical Jamming & Rack Obstruction',
    title: 'Rack Wire Tine Bend & Unyielding Obstacle',
    subtitle: 'Tine shifted -12mm into path (Torque spike 7.8 Nm)',
    severity: 'CRITICAL',
    description: 'Simulates bent wire tine or foreign fork lodged in rack slot 4. Plate rim establishes unexpected hard contact during descent.',
    parameters: [
      { label: 'Tine Position Offset', nominalValue: '0.0 mm', stressValue: '-12.0 mm' },
      { label: 'Contact Stiffness', nominalValue: '120 N/m', stressValue: '4500 N/m' },
      { label: 'External Impact Force', nominalValue: '0.0 N', stressValue: '18.4 N' },
      { label: 'Torque Cutoff Threshold', nominalValue: '6.5 Nm', stressValue: '7.8 Nm (Spike)' }
    ],
    expectedBehavior: 'Instant torque spike (>6.5 Nm) and acoustic transient trigger sub-5ms impedance back-off, retracting end-effector by +15mm to avoid ceramic shatter.',
    formalInvariant: 'Invariant 3: Force limit < 7.0 N && Peak Torque < 6.5 Nm',
    simulationRun: {
      status: 'RECOVERED',
      measuredOutcome: {
        peakTorqueNm: 7.2,
        minClearanceMm: 48.0,
        slipProbPct: 32,
        fractureRiskPct: 8,
        latencyMs: 8,
        reactionTimeMs: 6
      },
      vetoTriggered: true,
      vetoRuleName: 'OVERTORQUE_HARD_COLLISION_RETRACT',
      mitigationApplied: 'Torque surge of 7.2 Nm detected at t=32ms. Autonomous impedance loop released downward thrust and executed 15mm vertical clearance retreat in 18ms.',
      simToRealErrorDelta: 'Wire tine compliance absorbed 1.2J before robot retraction completed.',
      telemetryTrace: [
        { timeMs: 0, torqueNm: 2.1, shearForceN: 0.014, clearanceMm: 52.0, slipProbPct: 2, systemState: 'Trajectory Start' },
        { timeMs: 10, torqueNm: 2.6, shearForceN: 0.040, clearanceMm: 51.5, slipProbPct: 4, systemState: 'Descending to Slot' },
        { timeMs: 20, torqueNm: 3.5, shearForceN: 0.120, clearanceMm: 50.2, slipProbPct: 9, systemState: 'Approaching Wire Tine' },
        { timeMs: 30, torqueNm: 7.2, shearForceN: 0.580, clearanceMm: 48.0, slipProbPct: 32, systemState: '💥 Hard Contact with Bent Tine' },
        { timeMs: 40, torqueNm: 4.1, shearForceN: 0.220, clearanceMm: 54.0, slipProbPct: 16, systemState: '🛡️ Autonomous Retraction' },
        { timeMs: 50, torqueNm: 2.4, shearForceN: 0.060, clearanceMm: 62.0, slipProbPct: 4, systemState: '✅ Safe Hover & Re-route' }
      ]
    }
  },

  // 5. Counterfactual Invariant Stress
  {
    id: 'STRESS_05_ADVERSARIAL_INVARIANTS',
    category: 'counterfactual',
    categoryTitle: '5. Counterfactual Safety & Boundary Proofs',
    title: 'Adversarial Razor-Thin Clearance Trajectory',
    subtitle: 'Nominal clearance 50.2mm vs ±3.8mm sigma',
    severity: 'HIGH',
    description: 'Adversarial policy proposes a fast, energy-efficient trajectory with nominal clearance 50.2mm (above the 50.0mm threshold), testing whether uncertainty checks catch the margin breach.',
    parameters: [
      { label: 'Nominal Clearance', nominalValue: '54.0 mm', stressValue: '50.2 mm' },
      { label: 'Prediction Sigma (2σ)', nominalValue: '±2.0 mm', stressValue: '±3.8 mm' },
      { label: 'Worst-Case Margin', nominalValue: '52.0 mm', stressValue: '46.4 mm' },
      { label: 'Safety Threshold', nominalValue: '50.0 mm', stressValue: '50.0 mm' }
    ],
    expectedBehavior: 'Symbolic VETO mathematical evaluator proves that 50.2mm - 3.8mm = 46.4mm < 50.0mm. Rejects policy with zero tolerance.',
    formalInvariant: 'Invariant: (Clearance_nominal - 2*Sigma_pred) >= Clearance_min',
    simulationRun: {
      status: 'WARN_VETOED',
      measuredOutcome: {
        peakTorqueNm: 4.8,
        minClearanceMm: 46.4,
        slipProbPct: 16,
        fractureRiskPct: 12,
        latencyMs: 14,
        reactionTimeMs: 10
      },
      vetoTriggered: true,
      vetoRuleName: 'FORMAL_SAFETY_ENVELOPE_REJECTION',
      mitigationApplied: 'Candidate Action C vetoed prior to hardware actuation. Switched to Trajectory B (Center Rim with 53.4mm clearance).',
      simToRealErrorDelta: 'Simulation confirmed unmitigated Trajectory C would have scuffed tine 6 with 68% probability.',
      telemetryTrace: [
        { timeMs: 0, torqueNm: 2.1, shearForceN: 0.014, clearanceMm: 50.2, slipProbPct: 2, systemState: 'Candidate Action Evaluated' },
        { timeMs: 10, torqueNm: 2.8, shearForceN: 0.050, clearanceMm: 49.8, slipProbPct: 4, systemState: 'Uncertainty Bounds Expanded' },
        { timeMs: 20, torqueNm: 3.6, shearForceN: 0.110, clearanceMm: 48.2, slipProbPct: 8, systemState: 'Sigma Band: 46.4 to 54.0mm' },
        { timeMs: 30, torqueNm: 4.8, shearForceN: 0.160, clearanceMm: 46.4, slipProbPct: 16, systemState: '🛑 Symbolic VETO Rejection' },
        { timeMs: 40, torqueNm: 3.1, shearForceN: 0.080, clearanceMm: 53.4, slipProbPct: 6, systemState: 'Switched to Safe Policy B' },
        { timeMs: 50, torqueNm: 2.5, shearForceN: 0.040, clearanceMm: 53.4, slipProbPct: 3, systemState: '✅ Safe Insertion Verified' }
      ]
    }
  },

  // 6. Sim-to-Real Domain Randomization & Calibration
  {
    id: 'STRESS_06_SIM2REAL_MASS_DRIFT',
    category: 'sim2real',
    categoryTitle: '6. Sim-to-Real Calibration & Reality Anchor',
    title: 'Unknown Payload Mass (+65%) & Center of Gravity Drift',
    subtitle: 'Cast-iron skillet substituted for glass (180g → 680g)',
    severity: 'MEDIUM',
    description: 'Unknown heavy dense object picked without prior weight declaration. Gravitational sag introduces 4.2mm simulator kinematic mismatch.',
    parameters: [
      { label: 'Object Mass', nominalValue: '210 g', stressValue: '680 g (+223%)' },
      { label: 'CG Offset (Z)', nominalValue: '0.0 mm', stressValue: '+32.0 mm' },
      { label: 'Joint Sag Deflection', nominalValue: '0.3 mm', stressValue: '4.2 mm' },
      { label: 'Torque Prediction Error', nominalValue: '±0.2 Nm', stressValue: '+2.8 Nm' }
    ],
    expectedBehavior: 'Reality Anchor compares measured joint torque and LiDAR sag against MuJoCo prediction, learning new calibration parameter within 2 episodes.',
    formalInvariant: 'Reality Anchor: Convergence error delta_error <= 5% within 3 iterations',
    simulationRun: {
      status: 'PASSED',
      measuredOutcome: {
        peakTorqueNm: 7.1,
        minClearanceMm: 50.8,
        slipProbPct: 22,
        fractureRiskPct: 0,
        latencyMs: 16,
        reactionTimeMs: 14
      },
      vetoTriggered: false,
      mitigationApplied: 'Online recursive least squares estimator updated payload parameter M=680g and adjusted feedforward gravity compensation by +2.6 Nm.',
      simToRealErrorDelta: 'Initial error -4.2mm converged to -0.3mm after calibration cycle 2.',
      telemetryTrace: [
        { timeMs: 0, torqueNm: 2.1, shearForceN: 0.014, clearanceMm: 52.0, slipProbPct: 2, systemState: 'Payload Lifted' },
        { timeMs: 10, torqueNm: 4.8, shearForceN: 0.180, clearanceMm: 50.2, slipProbPct: 12, systemState: 'Torque Surge: 4.8 Nm (Expected 2.3)' },
        { timeMs: 20, torqueNm: 6.8, shearForceN: 0.420, clearanceMm: 48.8, slipProbPct: 20, systemState: 'Gravity Sag Identified' },
        { timeMs: 30, torqueNm: 7.1, shearForceN: 0.480, clearanceMm: 49.5, slipProbPct: 22, systemState: 'Feedforward Compensation +2.6Nm' },
        { timeMs: 40, torqueNm: 6.2, shearForceN: 0.280, clearanceMm: 50.8, slipProbPct: 10, systemState: 'Trajectory Offset Corrected' },
        { timeMs: 50, torqueNm: 5.8, shearForceN: 0.120, clearanceMm: 51.5, slipProbPct: 5, systemState: '✅ Reality Anchor Calibrated' }
      ]
    }
  },

  // 7. Long-Horizon Thermal Drift & Actuator Backlash
  {
    id: 'STRESS_07_THERMAL_FATIGUE',
    category: 'fatigue',
    categoryTitle: '7. Multi-Step Fatigue & Thermal Drift',
    title: '150-Cycle Continuous Run & Motor Overheat (48°C)',
    subtitle: 'Harmonic drive backlash doubles (0.04° → 0.12°)',
    severity: 'MEDIUM',
    description: 'Continuous duty cycle heats harmonic drive actuators to 48.5°C, increasing joint compliance and optical encoder thermal drift over 150 consecutive cycles.',
    parameters: [
      { label: 'Motor Temperature', nominalValue: '37.8 °C', stressValue: '48.5 °C' },
      { label: 'Gear Backlash', nominalValue: '0.04°', stressValue: '0.12°' },
      { label: 'Cumulative Cycles', nominalValue: '1', stressValue: '150' },
      { label: 'End-Effector Drift', nominalValue: '0.1 mm', stressValue: '1.4 mm' }
    ],
    expectedBehavior: 'Skill memory continually incorporates thermal expansion offsets, maintaining sub-millimeter precision across continuous industrial runs.',
    formalInvariant: 'Invariant: Thermal drift auto-zeroing prevents systematic positional bias',
    simulationRun: {
      status: 'PASSED',
      measuredOutcome: {
        peakTorqueNm: 4.6,
        minClearanceMm: 52.2,
        slipProbPct: 10,
        fractureRiskPct: 0,
        latencyMs: 14,
        reactionTimeMs: 12
      },
      vetoTriggered: false,
      mitigationApplied: 'Thermal expansion coefficient (12.4 μm/°C) automatically applied to inverse kinematics. Skill memory updated temperature compensation prior.',
      simToRealErrorDelta: 'End-effector drift held to ±0.2mm despite 10.7°C motor core temperature rise.',
      telemetryTrace: [
        { timeMs: 0, torqueNm: 2.4, shearForceN: 0.018, clearanceMm: 52.0, slipProbPct: 2, systemState: 'Cycle 150 Inception' },
        { timeMs: 10, torqueNm: 2.8, shearForceN: 0.045, clearanceMm: 51.8, slipProbPct: 4, systemState: 'Core Temp: 48.5°C' },
        { timeMs: 20, torqueNm: 3.8, shearForceN: 0.095, clearanceMm: 51.6, slipProbPct: 6, systemState: 'Backlash Compensation Active' },
        { timeMs: 30, torqueNm: 4.6, shearForceN: 0.160, clearanceMm: 52.0, slipProbPct: 10, systemState: 'Thermal Offset Applied' },
        { timeMs: 40, torqueNm: 3.9, shearForceN: 0.110, clearanceMm: 52.2, slipProbPct: 7, systemState: 'Insertion Alignment Nominal' },
        { timeMs: 50, torqueNm: 2.7, shearForceN: 0.050, clearanceMm: 52.2, slipProbPct: 3, systemState: '✅ 150-Cycle Run Verified' }
      ]
    }
  }
];
