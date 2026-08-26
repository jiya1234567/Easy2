import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  UploadCloud, FileSpreadsheet, Check, RotateCcw, Upload, ShieldCheck,
  Play, Pause, SkipForward, SkipBack, Eye, Activity, Cpu, Sparkles,
  Layers, Radio, AlertTriangle, ArrowRight, CornerDownRight, CheckCircle,
  Database, Network, Zap, Shield, FileText, ChevronRight, Lock, Maximize2, Camera
} from 'lucide-react';

// Import Generated Assets
import cellRenderImg from '../assets/images/robotic_dishwasher_cell_1787637177751.jpg';
import tactileRenderImg from '../assets/images/gelsight_tactile_render_1787637192815.jpg';
import pointcloudRenderImg from '../assets/images/spatial_pointcloud_render_1787637208235.jpg';
import CsvDataInspectorModal from './CsvDataInspectorModal';
import PhysicalAiWorldModelViewer from './PhysicalAiWorldModelViewer';
import StressTestingHarnessModal from './StressTestingHarnessModal';
import { StressTestCase } from './StressTestingTypes';

// Synchronized Robot Telemetry Dataset (0 - 50ms @ 200Hz)
export interface SynchronizedTelemetryRow {
  timestamp_ms: number;
  j0_deg: number;
  j1_deg: number;
  j2_deg: number;
  j3_deg: number;
  j4_deg: number;
  j5_deg: number;
  j6_deg: number;
  j0_vel: number;
  j1_vel: number;
  j2_vel: number;
  j3_vel: number;
  j4_vel: number;
  j5_vel: number;
  j6_vel: number;
  torque_nm: number;
  temperature_c: number;
}

export const SYNCHRONIZED_TELEMETRY_DATA: SynchronizedTelemetryRow[] = [
  { timestamp_ms: 0, j0_deg: 12.1, j1_deg: -24.5, j2_deg: 31.2, j3_deg: 8.4, j4_deg: 15.2, j5_deg: -6.1, j6_deg: 2.0, j0_vel: 0.0, j1_vel: 0.0, j2_vel: 0.0, j3_vel: 0.0, j4_vel: 0.0, j5_vel: 0.0, j6_vel: 0.0, torque_nm: 2.1, temperature_c: 37.8 },
  { timestamp_ms: 5, j0_deg: 12.2, j1_deg: -24.6, j2_deg: 31.3, j3_deg: 8.5, j4_deg: 15.3, j5_deg: -6.0, j6_deg: 2.1, j0_vel: 20.0, j1_vel: -20.0, j2_vel: 20.0, j3_vel: 20.0, j4_vel: 20.0, j5_vel: 20.0, j6_vel: 20.0, torque_nm: 2.3, temperature_c: 37.9 },
  { timestamp_ms: 10, j0_deg: 12.5, j1_deg: -24.9, j2_deg: 31.7, j3_deg: 8.7, j4_deg: 15.6, j5_deg: -5.8, j6_deg: 2.3, j0_vel: 60.0, j1_vel: -60.0, j2_vel: 80.0, j3_vel: 40.0, j4_vel: 60.0, j5_vel: 40.0, j6_vel: 40.0, torque_nm: 3.1, temperature_c: 38.0 },
  { timestamp_ms: 15, j0_deg: 13.0, j1_deg: -25.4, j2_deg: 32.3, j3_deg: 9.0, j4_deg: 16.0, j5_deg: -5.4, j6_deg: 2.6, j0_vel: 100.0, j1_vel: -100.0, j2_vel: 120.0, j3_vel: 60.0, j4_vel: 80.0, j5_vel: 80.0, j6_vel: 60.0, torque_nm: 4.0, temperature_c: 38.1 },
  { timestamp_ms: 20, j0_deg: 13.7, j1_deg: -26.1, j2_deg: 33.1, j3_deg: 9.4, j4_deg: 16.5, j5_deg: -4.9, j6_deg: 3.0, j0_vel: 140.0, j1_vel: -140.0, j2_vel: 160.0, j3_vel: 80.0, j4_vel: 100.0, j5_vel: 100.0, j6_vel: 80.0, torque_nm: 5.2, temperature_c: 38.2 },
  { timestamp_ms: 25, j0_deg: 14.5, j1_deg: -26.8, j2_deg: 34.0, j3_deg: 9.8, j4_deg: 17.0, j5_deg: -4.2, j6_deg: 3.5, j0_vel: 160.0, j1_vel: -140.0, j2_vel: 180.0, j3_vel: 80.0, j4_vel: 100.0, j5_vel: 140.0, j6_vel: 100.0, torque_nm: 6.4, temperature_c: 38.2 },
  { timestamp_ms: 30, j0_deg: 15.2, j1_deg: -27.4, j2_deg: 34.8, j3_deg: 10.2, j4_deg: 17.5, j5_deg: -3.5, j6_deg: 4.0, j0_vel: 140.0, j1_vel: -120.0, j2_vel: 160.0, j3_vel: 80.0, j4_vel: 100.0, j5_vel: 140.0, j6_vel: 100.0, torque_nm: 7.0, temperature_c: 38.3 },
  { timestamp_ms: 35, j0_deg: 15.8, j1_deg: -27.9, j2_deg: 35.5, j3_deg: 10.6, j4_deg: 18.0, j5_deg: -2.9, j6_deg: 4.4, j0_vel: 120.0, j1_vel: -100.0, j2_vel: 140.0, j3_vel: 80.0, j4_vel: 100.0, j5_vel: 120.0, j6_vel: 80.0, torque_nm: 6.1, temperature_c: 38.4 },
  { timestamp_ms: 40, j0_deg: 16.3, j1_deg: -28.3, j2_deg: 36.1, j3_deg: 11.0, j4_deg: 18.4, j5_deg: -2.4, j6_deg: 4.8, j0_vel: 100.0, j1_vel: -80.0, j2_vel: 120.0, j3_vel: 80.0, j4_vel: 80.0, j5_vel: 100.0, j6_vel: 80.0, torque_nm: 5.0, temperature_c: 38.5 },
  { timestamp_ms: 45, j0_deg: 16.7, j1_deg: -28.6, j2_deg: 36.6, j3_deg: 11.4, j4_deg: 18.8, j5_deg: -2.0, j6_deg: 5.1, j0_vel: 80.0, j1_vel: -60.0, j2_vel: 100.0, j3_vel: 60.0, j4_vel: 80.0, j5_vel: 80.0, j6_vel: 60.0, torque_nm: 4.2, temperature_c: 38.6 },
  { timestamp_ms: 50, j0_deg: 17.0, j1_deg: -28.8, j2_deg: 37.0, j3_deg: 11.7, j4_deg: 19.1, j5_deg: -1.7, j6_deg: 5.4, j0_vel: 60.0, j1_vel: -40.0, j2_vel: 80.0, j3_vel: 60.0, j4_vel: 60.0, j5_vel: 60.0, j6_vel: 60.0, torque_nm: 3.5, temperature_c: 38.7 }
];

// Synchronized Spatial Point Cloud Dataset
export interface SynchronizedPointCloudPoint {
  timestamp_ms: number;
  point_id: number;
  x_mm: number;
  y_mm: number;
  z_mm: number;
  object_id: string;
  semantic_class: string;
  confidence: number;
}

export const SYNCHRONIZED_POINTCLOUD_DATA: SynchronizedPointCloudPoint[] = [
  { timestamp_ms: 0, point_id: 1, x_mm: 120, y_mm: 80, z_mm: 145, object_id: 'plate_01', semantic_class: 'plate', confidence: 0.99 },
  { timestamp_ms: 0, point_id: 2, x_mm: 135, y_mm: 82, z_mm: 147, object_id: 'plate_01', semantic_class: 'plate', confidence: 0.98 },
  { timestamp_ms: 0, point_id: 3, x_mm: 150, y_mm: 84, z_mm: 148, object_id: 'plate_01', semantic_class: 'plate', confidence: 0.98 },
  { timestamp_ms: 0, point_id: 4, x_mm: 210, y_mm: 105, z_mm: 180, object_id: 'glass_01', semantic_class: 'glass', confidence: 0.97 },
  { timestamp_ms: 0, point_id: 5, x_mm: 220, y_mm: 108, z_mm: 182, object_id: 'glass_01', semantic_class: 'glass', confidence: 0.96 },
  { timestamp_ms: 5, point_id: 6, x_mm: 121, y_mm: 81, z_mm: 145, object_id: 'plate_01', semantic_class: 'plate', confidence: 0.99 },
  { timestamp_ms: 5, point_id: 7, x_mm: 136, y_mm: 83, z_mm: 147, object_id: 'plate_01', semantic_class: 'plate', confidence: 0.98 },
  { timestamp_ms: 5, point_id: 8, x_mm: 151, y_mm: 85, z_mm: 149, object_id: 'plate_01', semantic_class: 'plate', confidence: 0.98 },
  { timestamp_ms: 5, point_id: 9, x_mm: 211, y_mm: 106, z_mm: 180, object_id: 'glass_01', semantic_class: 'glass', confidence: 0.97 },
  { timestamp_ms: 5, point_id: 10, x_mm: 221, y_mm: 109, z_mm: 183, object_id: 'glass_01', semantic_class: 'glass', confidence: 0.96 },
  { timestamp_ms: 10, point_id: 11, x_mm: 124, y_mm: 84, z_mm: 146, object_id: 'plate_01', semantic_class: 'plate', confidence: 0.99 },
  { timestamp_ms: 10, point_id: 12, x_mm: 139, y_mm: 86, z_mm: 148, object_id: 'plate_01', semantic_class: 'plate', confidence: 0.98 },
  { timestamp_ms: 10, point_id: 13, x_mm: 154, y_mm: 88, z_mm: 150, object_id: 'plate_01', semantic_class: 'plate', confidence: 0.98 },
  { timestamp_ms: 10, point_id: 14, x_mm: 214, y_mm: 109, z_mm: 181, object_id: 'glass_01', semantic_class: 'glass', confidence: 0.96 },
  { timestamp_ms: 10, point_id: 15, x_mm: 224, y_mm: 112, z_mm: 184, object_id: 'glass_01', semantic_class: 'glass', confidence: 0.96 },
  { timestamp_ms: 15, point_id: 16, x_mm: 128, y_mm: 88, z_mm: 148, object_id: 'plate_01', semantic_class: 'plate', confidence: 0.99 },
  { timestamp_ms: 15, point_id: 17, x_mm: 143, y_mm: 90, z_mm: 150, object_id: 'plate_01', semantic_class: 'plate', confidence: 0.98 },
  { timestamp_ms: 15, point_id: 18, x_mm: 158, y_mm: 92, z_mm: 152, object_id: 'plate_01', semantic_class: 'plate', confidence: 0.97 },
  { timestamp_ms: 15, point_id: 19, x_mm: 217, y_mm: 112, z_mm: 182, object_id: 'glass_01', semantic_class: 'glass', confidence: 0.96 },
  { timestamp_ms: 15, point_id: 20, x_mm: 227, y_mm: 115, z_mm: 185, object_id: 'glass_01', semantic_class: 'glass', confidence: 0.95 }
];

// Synchronized Tactile GelSight Dataset (Developing Slip Event)
export interface SynchronizedTactileRow {
  timestamp_ms: number;
  normal_force_n: number;
  shear_x_n: number;
  shear_y_n: number;
  contact_area_mm2: number;
  slip_probability: number;
  wetness_pct: number;
  contact_object: string;
}

export const SYNCHRONIZED_TACTILE_DATA: SynchronizedTactileRow[] = [
  { timestamp_ms: 0, normal_force_n: 0.2, shear_x_n: 0.01, shear_y_n: 0.01, contact_area_mm2: 18, slip_probability: 0.01, wetness_pct: 12, contact_object: 'none' },
  { timestamp_ms: 5, normal_force_n: 0.8, shear_x_n: 0.03, shear_y_n: 0.02, contact_area_mm2: 32, slip_probability: 0.02, wetness_pct: 13, contact_object: 'plate_01' },
  { timestamp_ms: 10, normal_force_n: 1.8, shear_x_n: 0.06, shear_y_n: 0.04, contact_area_mm2: 48, slip_probability: 0.03, wetness_pct: 15, contact_object: 'plate_01' },
  { timestamp_ms: 15, normal_force_n: 3.2, shear_x_n: 0.10, shear_y_n: 0.07, contact_area_mm2: 61, slip_probability: 0.04, wetness_pct: 17, contact_object: 'plate_01' },
  { timestamp_ms: 20, normal_force_n: 4.5, shear_x_n: 0.15, shear_y_n: 0.09, contact_area_mm2: 72, slip_probability: 0.05, wetness_pct: 18, contact_object: 'plate_01' },
  { timestamp_ms: 25, normal_force_n: 5.8, shear_x_n: 0.22, shear_y_n: 0.13, contact_area_mm2: 78, slip_probability: 0.07, wetness_pct: 20, contact_object: 'plate_01' },
  { timestamp_ms: 30, normal_force_n: 6.2, shear_x_n: 0.31, shear_y_n: 0.20, contact_area_mm2: 81, slip_probability: 0.11, wetness_pct: 22, contact_object: 'plate_01' },
  { timestamp_ms: 35, normal_force_n: 6.4, shear_x_n: 0.42, shear_y_n: 0.29, contact_area_mm2: 83, slip_probability: 0.19, wetness_pct: 25, contact_object: 'plate_01' },
  { timestamp_ms: 40, normal_force_n: 6.5, shear_x_n: 0.55, shear_y_n: 0.38, contact_area_mm2: 82, slip_probability: 0.31, wetness_pct: 28, contact_object: 'plate_01' },
  { timestamp_ms: 45, normal_force_n: 6.3, shear_x_n: 0.72, shear_y_n: 0.51, contact_area_mm2: 79, slip_probability: 0.46, wetness_pct: 31, contact_object: 'plate_01' },
  { timestamp_ms: 50, normal_force_n: 6.1, shear_x_n: 0.91, shear_y_n: 0.68, contact_area_mm2: 75, slip_probability: 0.63, wetness_pct: 34, contact_object: 'plate_01' }
];

// Master JSON Manifest
export const MASTER_EXPERIMENT_MANIFEST = {
  experiment_id: "EXP-2026-PHYSICAL-AI-DISHWASHER-001",
  mission_intent: "Load the dishwasher safely while minimizing glass breakage and collision risk.",
  environment: {
    temperature_c: 24.0,
    humidity_pct: 61.0,
    dishwasher_state: "open",
    rack_state: "extended"
  },
  streams: {
    robot_telemetry: "robot_telemetry.csv",
    pointcloud_spatial: "pointcloud_spatial.csv",
    gelsight_tactile: "gelsight_tactile.csv"
  },
  sampling: {
    telemetry_hz: 200,
    tactile_hz: 200,
    spatial_hz: 20
  },
  world_model: {
    coordinate_frame: "robot_base",
    objects: [
      { id: "plate_01", class: "plate", fragility: 0.25 },
      { id: "glass_01", class: "glass", fragility: 0.95 }
    ]
  },
  safety: {
    max_joint_torque_nm: 12.0,
    minimum_clearance_mm: 50.0,
    max_glass_normal_force_n: 7.0,
    max_slip_probability: 0.70
  },
  required_outputs: [
    "world_state",
    "hypergraph",
    "state_tensor",
    "trajectory_prediction",
    "safety_verdict",
    "reality_anchor"
  ]
};

// Sensor Uncertainty Entity Definition
export interface SensorUncertaintyReading {
  sensor_name: string;
  value: number;
  unit: string;
  confidence: number;
  source: 'lidar' | 'gelsight' | 'encoder' | 'thermocouple' | 'torque_cell';
  timestamp_ms: number;
  quality: 'EXCELLENT' | 'GOOD' | 'DEGRADED' | 'CRITICAL';
  causal_bound: string;
}

interface PhysicalAiWorldStatePipelineProps {
  onLogEvent?: (details: string, type: 'info' | 'physics' | 'interaction') => void;
}

export default function PhysicalAiWorldStatePipeline({ onLogEvent }: PhysicalAiWorldStatePipelineProps) {
  const [activeTimeMs, setActiveTimeMs] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [pipelineStep, setPipelineStep] = useState<number>(6); // 1 to 6
  const [selectedVisualFeed, setSelectedVisualFeed] = useState<'all' | 'camera' | 'tactile' | 'pointcloud'>('all');
  const [isManifestOpen, setIsManifestOpen] = useState<boolean>(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);
  const [isStressModalOpen, setIsStressModalOpen] = useState<boolean>(false);
  const [csvTab, setCsvTab] = useState<'telemetry' | 'pointcloud' | 'gelsight' | 'manifest' | 'fused'>('telemetry');

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveTimeMs((prev) => {
          if (prev >= 50) {
            return 0;
          }
          return prev + 5;
        });
      }, 400 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  // Current row lookups
  const currentTelemetry = useMemo(() => {
    return SYNCHRONIZED_TELEMETRY_DATA.find(r => r.timestamp_ms === activeTimeMs) || SYNCHRONIZED_TELEMETRY_DATA[0];
  }, [activeTimeMs]);

  const currentTactile = useMemo(() => {
    return SYNCHRONIZED_TACTILE_DATA.find(r => r.timestamp_ms === activeTimeMs) || SYNCHRONIZED_TACTILE_DATA[0];
  }, [activeTimeMs]);

  const currentPoints = useMemo(() => {
    return SYNCHRONIZED_POINTCLOUD_DATA.filter(p => p.timestamp_ms === activeTimeMs || p.timestamp_ms === 0);
  }, [activeTimeMs]);

  // Uncertainty readings derived at current timestamp
  const uncertaintyReadings: SensorUncertaintyReading[] = useMemo(() => {
    const shearMagnitude = Math.sqrt(Math.pow(currentTactile.shear_x_n, 2) + Math.pow(currentTactile.shear_y_n, 2));
    const slipProb = currentTactile.slip_probability;
    const isSlipHigh = slipProb > 0.4;

    return [
      {
        sensor_name: 'LiDAR Spray Arm Clearance',
        value: 52.0 - (activeTimeMs * 0.08),
        unit: 'mm',
        confidence: 0.985,
        source: 'lidar',
        timestamp_ms: activeTimeMs,
        quality: 'EXCELLENT',
        causal_bound: '> 35.0 mm clearance limit'
      },
      {
        sensor_name: 'GelSight Normal Clamping Force',
        value: currentTactile.normal_force_n,
        unit: 'N',
        confidence: 0.965,
        source: 'gelsight',
        timestamp_ms: activeTimeMs,
        quality: currentTactile.normal_force_n > 6.4 ? 'GOOD' : 'EXCELLENT',
        causal_bound: '< 7.0 N glass fragility limit'
      },
      {
        sensor_name: 'Tactile Micro-Shear Dynamic Slip',
        value: Number(shearMagnitude.toFixed(3)),
        unit: 'N',
        confidence: isSlipHigh ? 0.89 : 0.97,
        source: 'gelsight',
        timestamp_ms: activeTimeMs,
        quality: isSlipHigh ? 'DEGRADED' : 'EXCELLENT',
        causal_bound: 'Slip probability threshold < 0.70'
      },
      {
        sensor_name: '7-DOF Joint #03 Torque Load',
        value: currentTelemetry.torque_nm,
        unit: 'Nm',
        confidence: 0.992,
        source: 'torque_cell',
        timestamp_ms: activeTimeMs,
        quality: 'EXCELLENT',
        causal_bound: 'Maximum joint torque < 12.0 Nm'
      },
      {
        sensor_name: '7-DOF Joint Actuator Thermal Core',
        value: currentTelemetry.temperature_c,
        unit: '°C',
        confidence: 0.995,
        source: 'thermocouple',
        timestamp_ms: activeTimeMs,
        quality: 'EXCELLENT',
        causal_bound: 'Safe operating limit < 55.0 °C'
      }
    ];
  }, [activeTimeMs, currentTactile, currentTelemetry]);

  // Slip assessment & symbolic verdict
  const slipAnalysis = useMemo(() => {
    const p = currentTactile.slip_probability;
    if (p > 0.6) {
      return {
        status: 'INTERVENTION_REQUIRED',
        badge: 'bg-amber-500 text-black',
        text: 'Developing shear slip detected at t=50ms (Prob: 63%). OMEGA initiates compliant impedance torque correction before grasp failure occurs.',
        verdict: 'COMPENSATE',
        remedy: 'Increase normal force by +0.3N & slow downward descent velocity by -40%.'
      };
    }
    if (p > 0.2) {
      return {
        status: 'MONITORING_SHEAR',
        badge: 'bg-blue-500 text-white',
        text: 'Shear vector increasing as dish surface contacts lower rack slot.',
        verdict: 'PASS_WARN',
        remedy: 'Maintain 200 Hz tactile optical flow tracking.'
      };
    }
    return {
      status: 'STABLE_LOCKED',
      badge: 'bg-emerald-600 text-white',
      text: 'Grasp and trajectory parameters completely within nominal bounds.',
      verdict: 'PASS',
      remedy: 'Proceed on forward kinematic path.'
    };
  }, [currentTactile]);

  return (
    <div className="space-y-6">
      {/* HEADER BANNER & INGESTION LAUNCHER */}
      <div className="border-2 border-[#1A1A1A] bg-white p-4 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#1A1A1A] text-white font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                OMEGA PIPELINE v4.2
              </span>
              <span className="font-mono text-xs font-black uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                Time-Synchronized Physical AI Ingestion & 3D World State
              </span>
            </div>
            <p className="text-neutral-700 text-xs font-serif italic mt-1">
              Fuses 200 Hz robot kinematics, dense spatial point clouds, and elastomer GelSight tactile matrices into a deterministic 3D World Model.
            </p>
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setIsStressModalOpen(true);
                if (onLogEvent) {
                  onLogEvent("[STRESS TEST HARNESS] Opened Physical AI 7-Category Stress Test Workbench.", "physics");
                }
              }}
              className="bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 text-xs font-mono font-black border border-amber-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-black text-black" />
              <span>🔥 ROBOTICS STRESS SUITE (7 Protocols)</span>
            </button>
            <button
              onClick={() => {
                setCsvTab('telemetry');
                setIsCsvModalOpen(true);
                if (onLogEvent) {
                  onLogEvent("[INSPECTOR] Opened CSV Data Table Inspector from 3D Pipeline.", "interaction");
                }
              }}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-900 px-3 py-1.5 text-xs font-mono font-bold border border-indigo-300 shadow-[2px_2px_0px_0px_rgba(79,70,229,1)] transition cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-700" />
              <span>📊 Inspect CSV Data Tables</span>
            </button>
            <button
              onClick={() => {
                setActiveTimeMs(50);
                setIsPlaying(false);
                if (onLogEvent) {
                  onLogEvent("[ANOMALY] Jumped directly to t=50ms to inspect developing shear slip condition.", "physics");
                }
              }}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-2.5 py-1.5 text-xs font-mono font-bold border border-amber-400 shadow-[2px_2px_0px_0px_rgba(217,119,6,1)] transition cursor-pointer flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>Slip Event (t=50ms)</span>
            </button>
            <button
              onClick={() => setIsManifestOpen(!isManifestOpen)}
              className="bg-[#F5F2ED] hover:bg-neutral-200 text-[#1A1A1A] px-3 py-1.5 text-xs font-mono font-bold border border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isManifestOpen ? 'Hide Master Manifest' : 'View Master Manifest JSON'}</span>
            </button>
            <button
              onClick={() => {
                setActiveTimeMs(0);
                setIsPlaying(true);
                if (onLogEvent) {
                  onLogEvent("[OMEGA] Triggered full time-synchronized world-state rollout (0ms to 50ms).", "physics");
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-mono font-bold border border-emerald-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>⚡ RUN SYNC ROLLOUT (0-50ms)</span>
            </button>
          </div>
        </div>

        {/* MASTER MANIFEST JSON DRAWER */}
        {isManifestOpen && (
          <div className="mt-4 p-3 bg-[#1A1A1A] text-emerald-400 font-mono text-[11px] border border-neutral-700 overflow-x-auto rounded-none shadow-inner">
            <div className="flex justify-between items-center text-neutral-400 border-b border-neutral-700 pb-1 mb-2">
              <span className="font-bold text-white uppercase text-[10px]">manifest.json (Master Physical AI Ingestion Specification)</span>
              <span className="text-[9px]">Hash: 0x8F92A1...OK</span>
            </div>
            <pre className="leading-relaxed">
              {JSON.stringify(MASTER_EXPERIMENT_MANIFEST, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* 6-STAGE PROCESSING PIPELINE CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {[
          { step: 1, title: '1. Ingest Streams', desc: 'CSV & Manifest Parse', icon: UploadCloud, status: 'DONE' },
          { step: 2, title: '2. Align Timestamps', desc: '0 - 50ms @ 200 Hz', icon: Activity, status: 'SYNCED' },
          { step: 3, title: '3. 3D World Model', desc: 'Point Clouds & Objects', icon: Layers, status: 'CONVERGED' },
          { step: 4, title: '4. State Tensor', desc: 'Hypergraph Compilation', icon: Database, status: 'COMPILED' },
          { step: 5, title: '5. Slip Prediction', desc: 'Developing Slip Detected', icon: Cpu, status: activeTimeMs >= 40 ? 'WARN' : 'NOMINAL' },
          { step: 6, title: '6. Symbolic VETO', desc: 'Compliance Gate HITL', icon: ShieldCheck, status: 'VETO_CLEAR' },
        ].map((s) => (
          <div
            key={s.step}
            onClick={() => setPipelineStep(s.step)}
            className={`border-2 p-2.5 flex flex-col justify-between transition cursor-pointer ${
              pipelineStep === s.step
                ? 'border-[#1A1A1A] bg-[#F5F2ED] shadow-[3px_3px_0px_0px_rgba(26,26,26,1)]'
                : 'border-neutral-300 bg-white hover:bg-neutral-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <s.icon className={`w-3.5 h-3.5 ${pipelineStep === s.step ? 'text-indigo-600' : 'text-neutral-500'}`} />
                <span className={`text-[9px] font-mono font-bold px-1 py-0.2 border ${
                  s.status === 'WARN' ? 'bg-amber-100 text-amber-900 border-amber-400' : 'bg-emerald-100 text-emerald-900 border-emerald-400'
                }`}>
                  {s.status}
                </span>
              </div>
              <div className="text-[11px] font-mono font-black text-[#1A1A1A]">{s.title}</div>
              <div className="text-[10px] font-sans text-neutral-600 leading-tight">{s.desc}</div>
            </div>
            <div className="mt-2 text-[9px] font-mono text-neutral-500 flex items-center justify-between border-t border-neutral-200 pt-1">
              <span>Stage 0{s.step}</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </div>
          </div>
        ))}
      </div>

      {/* SYNCHRONIZED PLAYBACK TIMELINE CONTROL */}
      <div className="bg-[#1A1A1A] text-white p-4 border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              SYNCHRONIZED TIMELINE CLOCK (t = {activeTimeMs} ms)
            </span>
            <span className="text-[10px] font-mono bg-neutral-800 text-neutral-300 px-2 py-0.5 border border-neutral-700">
              Sampling: 200 Hz Telemetry | 20 Hz Vision
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTimeMs(Math.max(0, activeTimeMs - 5))}
              className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600 cursor-pointer"
              title="Step Back -5ms"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-black font-mono font-bold text-xs border border-emerald-400 cursor-pointer flex items-center gap-1"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY CLOCK'}</span>
            </button>
            <button
              onClick={() => setActiveTimeMs(Math.min(50, activeTimeMs + 5))}
              className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600 cursor-pointer"
              title="Step Forward +5ms"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setActiveTimeMs(0); setIsPlaying(false); }}
              className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-600 cursor-pointer"
              title="Reset to 0ms"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1 ml-2 text-[10px] font-mono text-neutral-400">
              <span>Speed:</span>
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setPlaybackSpeed(s)}
                  className={`px-1.5 py-0.5 border ${playbackSpeed === s ? 'bg-white text-black font-bold' : 'bg-neutral-900 text-neutral-400 border-neutral-700'}`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Range Slider for Scrubbing */}
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={50}
            step={5}
            value={activeTimeMs}
            onChange={(e) => setActiveTimeMs(Number(e.target.value))}
            className="w-full h-2 bg-neutral-700 rounded-none appearance-none cursor-pointer accent-emerald-400"
          />
          
          {/* Clickable Time Chips */}
          <div className="flex flex-wrap items-center justify-between gap-1 pt-1 border-t border-neutral-800">
            {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActiveTimeMs(t);
                  setIsPlaying(false);
                  if (onLogEvent) {
                    onLogEvent(`[PLAYBACK] Scrubbed timeline clock to exact frame t=${t}ms`, 'interaction');
                  }
                }}
                className={`px-2 py-0.5 text-[9px] font-mono font-bold transition cursor-pointer border ${
                  activeTimeMs === t
                    ? 'bg-emerald-400 text-black border-emerald-300 shadow-[1px_1px_0px_0px_rgba(255,255,255,0.4)]'
                    : t === 50
                    ? 'bg-amber-950/60 text-amber-300 border-amber-800/80 hover:bg-amber-900'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:text-white hover:border-neutral-500'
                }`}
              >
                {t}ms {t === 50 && '⚠️'}
              </button>
            ))}
          </div>

          <div className="flex justify-between text-[9px] font-mono text-neutral-400">
            <span>0 ms (Nominal Grip)</span>
            <span>15 ms (Plate Alignment)</span>
            <span>30 ms (Contact Shear Rise)</span>
            <span className="text-amber-400 font-bold">50 ms (Developing Slip Event)</span>
          </div>
        </div>
      </div>

      {/* MAIN 3-PANEL MULTI-MODAL RECONSTRUCTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: MULTI-MODAL VISUALIZATION FEEDS (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
            <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-600" />
                <span className="font-mono text-xs font-black uppercase text-[#1A1A1A]">
                  Multi-Modal Visual Perception & Sensory Feeds (t = {activeTimeMs} ms)
                </span>
              </div>
              <div className="flex items-center gap-1 bg-[#F5F2ED] p-0.5 border border-[#1A1A1A]">
                {(['all', 'camera', 'tactile', 'pointcloud'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedVisualFeed(mode)}
                    className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase transition ${
                      selectedVisualFeed === mode ? 'bg-[#1A1A1A] text-white' : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* VISUAL FEED GALLERY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* FEED 1: RGB-D Cell Render */}
              {(selectedVisualFeed === 'all' || selectedVisualFeed === 'camera') && (
                <div className="border-2 border-[#1A1A1A] bg-black relative group overflow-hidden">
                  <div className="absolute top-2 left-2 z-10 bg-black/80 text-white font-mono text-[9px] px-2 py-0.5 border border-neutral-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    RGB-D ROBOTIC CELL (MuJoCo Digital Twin)
                  </div>
                  <img
                    src={cellRenderImg}
                    alt="Robotic Dishwasher Cell 3D Render"
                    referrerPolicy="no-referrer"
                    className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition duration-300"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm p-1.5 text-[9px] font-mono text-neutral-300 border border-neutral-700 flex justify-between">
                    <span>Pose: J0:{currentTelemetry.j0_deg}° J2:{currentTelemetry.j2_deg}°</span>
                    <span className="text-emerald-400">Torque: {currentTelemetry.torque_nm} Nm</span>
                  </div>
                </div>
              )}

              {/* FEED 2: GelSight Tactile Matrix */}
              {(selectedVisualFeed === 'all' || selectedVisualFeed === 'tactile') && (
                <div className="border-2 border-[#1A1A1A] bg-black relative group overflow-hidden">
                  <div className="absolute top-2 left-2 z-10 bg-black/80 text-white font-mono text-[9px] px-2 py-0.5 border border-neutral-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    GELSIGHT ELASTOMER TACTILE MATRIX
                  </div>
                  <img
                    src={tactileRenderImg}
                    alt="GelSight Tactile Matrix 3D Render"
                    referrerPolicy="no-referrer"
                    className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition duration-300"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm p-1.5 text-[9px] font-mono text-neutral-300 border border-neutral-700 flex justify-between">
                    <span>Normal: {currentTactile.normal_force_n} N | Shear: {currentTactile.shear_x_n} N</span>
                    <span className={currentTactile.slip_probability > 0.4 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                      Slip Prob: {(currentTactile.slip_probability * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}

              {/* FEED 3: LiDAR Point Cloud Scan */}
              {(selectedVisualFeed === 'all' || selectedVisualFeed === 'pointcloud') && (
                <div className="border-2 border-[#1A1A1A] bg-black relative group overflow-hidden md:col-span-2">
                  <div className="absolute top-2 left-2 z-10 bg-black/80 text-white font-mono text-[9px] px-2 py-0.5 border border-neutral-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    3D SPATIAL LIDAR POINT CLOUD & RACK METROLOGY
                  </div>
                  <img
                    src={pointcloudRenderImg}
                    alt="3D Spatial Point Cloud Render"
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover opacity-90 group-hover:opacity-100 transition duration-300"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm p-1.5 text-[9px] font-mono text-neutral-300 border border-neutral-700 flex justify-between">
                    <span>Objects: plate_01 (120,80,145mm) | glass_01 (210,105,180mm)</span>
                    <span className="text-cyan-300">Confidence: 98.4%</span>
                  </div>
                </div>
              )}
            </div>

            {/* LIVE SLIP & COMPLIANCE VERDICT BAR */}
            <div className={`mt-4 p-3 border-2 border-[#1A1A1A] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
              currentTactile.slip_probability > 0.4 ? 'bg-amber-50' : 'bg-emerald-50'
            }`}>
              <div className="flex items-start gap-2">
                <ShieldCheck className={`w-5 h-5 mt-0.5 shrink-0 ${currentTactile.slip_probability > 0.4 ? 'text-amber-600' : 'text-emerald-600'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black uppercase text-[#1A1A1A]">
                      DYNAMIC WORLD-MODEL VERDICT: {slipAnalysis.verdict}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 border border-black ${slipAnalysis.badge}`}>
                      {slipAnalysis.status}
                    </span>
                  </div>
                  <p className="text-[11px] font-sans text-neutral-800 mt-0.5">
                    {slipAnalysis.text}
                  </p>
                  <p className="text-[10px] font-mono text-neutral-600 mt-1">
                    <span className="font-bold">Autonomous Remedy:</span> {slipAnalysis.remedy}
                  </p>
                </div>
              </div>

              <div className="shrink-0 bg-white p-2 border border-[#1A1A1A] text-right font-mono text-[10px]">
                <div className="text-neutral-500">HITL State: <span className="text-emerald-600 font-bold">APPROVED</span></div>
                <div className="text-neutral-500">Reality Error: <span className="text-black font-bold">±1.42%</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SENSOR UNCERTAINTY & WORLD-STATE TENSOR (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* REALITY VS KNOWLEDGE UNCERTAINTY METRICS TABLE */}
          <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2 mb-3">
              <div className="flex items-center gap-2 text-[#1A1A1A]">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="font-mono text-xs font-black uppercase">
                  Reality vs Knowledge (Uncertainty Metrics)
                </span>
              </div>
              <span className="text-[9px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.5 border border-neutral-300">
                5 Active Streams
              </span>
            </div>

            <p className="text-[11px] text-neutral-600 font-serif italic mb-3">
              Distinguishes physical reality measurements from epistemic confidence bounds across the causal loop.
            </p>

            <div className="space-y-2.5">
              {uncertaintyReadings.map((sensor, idx) => (
                <div
                  key={idx}
                  className="p-2.5 border border-[#1A1A1A] bg-[#FAF9F6] text-xs font-mono flex flex-col justify-between gap-1 shadow-[2px_2px_0px_0px_rgba(26,26,26,0.05)]"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-black text-[#1A1A1A]">{sensor.sensor_name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 border ${
                      sensor.quality === 'EXCELLENT' ? 'bg-emerald-100 text-emerald-900 border-emerald-400' :
                      sensor.quality === 'GOOD' ? 'bg-blue-100 text-blue-900 border-blue-400' :
                      'bg-amber-100 text-amber-900 border-amber-400'
                    }`}>
                      {sensor.quality}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] mt-1 bg-white p-1.5 border border-neutral-200">
                    <div>
                      <span className="text-neutral-500">Reality (Value): </span>
                      <span className="font-bold text-black">{sensor.value.toFixed(2)} {sensor.unit}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Knowledge: </span>
                      <span className="font-bold text-indigo-700">{(sensor.confidence * 100).toFixed(1)}% Conf</span>
                    </div>
                  </div>

                  <div className="text-[9px] text-neutral-500 flex justify-between items-center mt-0.5">
                    <span>Source: {sensor.source}</span>
                    <span className="italic">{sensor.causal_bound}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OBJECT TRACKING & SPATIAL PERMANENCE TABLE */}
          <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2 mb-2">
              <div className="flex items-center gap-2 text-[#1A1A1A]">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span className="font-mono text-xs font-black uppercase">
                  Persistent 3D Object Memory
                </span>
              </div>
              <span className="text-[9px] font-mono text-neutral-500">Frame: robot_base</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[10px]">
                <thead>
                  <tr className="border-b border-neutral-300 text-neutral-500">
                    <th className="py-1">ID</th>
                    <th className="py-1">Class</th>
                    <th className="py-1">Pos (x,y,z) mm</th>
                    <th className="py-1">Fragility</th>
                    <th className="py-1">Conf</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr>
                    <td className="py-1.5 font-bold text-black">plate_01</td>
                    <td className="py-1.5">Dinner Plate</td>
                    <td className="py-1.5 text-indigo-600">({120 + activeTimeMs * 0.1}, {80 + activeTimeMs * 0.1}, 145)</td>
                    <td className="py-1.5">0.25 (Low)</td>
                    <td className="py-1.5 text-emerald-600 font-bold">99.0%</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-bold text-black">glass_01</td>
                    <td className="py-1.5">Wine Glass</td>
                    <td className="py-1.5 text-indigo-600">({210 + activeTimeMs * 0.1}, {105 + activeTimeMs * 0.1}, 180)</td>
                    <td className="py-1.5 text-red-600 font-bold">0.95 (Fragile)</td>
                    <td className="py-1.5 text-emerald-600 font-bold">97.0%</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-bold text-black">tub_rack_01</td>
                    <td className="py-1.5">Lower Rack</td>
                    <td className="py-1.5 text-neutral-600">(0.0, 320.0, 45.0)</td>
                    <td className="py-1.5">0.05 (Rigid)</td>
                    <td className="py-1.5 text-emerald-600 font-bold">99.9%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE PHYSICAL WORLD-MODEL ARCHITECTURE SUITE */}
      <PhysicalAiWorldModelViewer
        activeTimeMs={activeTimeMs}
        onSelectTimeMs={(t) => {
          setActiveTimeMs(t);
          setIsPlaying(false);
        }}
        onLogEvent={onLogEvent}
      />

      {/* CSV DATA INSPECTOR MODAL */}
      <CsvDataInspectorModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        initialTab={csvTab}
        onLogEvent={onLogEvent}
        onSelectTimeMs={(t) => {
          setActiveTimeMs(t);
          setIsPlaying(false);
        }}
      />

      {/* COMPREHENSIVE 7-PROTOCOL ROBOTICS STRESS TESTING HARNESS */}
      <StressTestingHarnessModal
        isOpen={isStressModalOpen}
        onClose={() => setIsStressModalOpen(false)}
        onLogEvent={onLogEvent}
        onApplyStressToTimeline={(stressCase) => {
          if (stressCase.category === 'viscoelastic') {
            setActiveTimeMs(50);
          } else if (stressCase.category === 'jamming') {
            setActiveTimeMs(30);
          } else if (stressCase.category === 'temporal') {
            setActiveTimeMs(30);
          } else {
            setActiveTimeMs(40);
          }
          setIsPlaying(false);
        }}
      />
    </div>
  );
}
