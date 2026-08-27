// src/components/NeuromorphicCimWorkbench.tsx
// OMEGA Neuromorphic + Compute-in-Memory (CIM) + Flash/NAND Hierarchical Memory System Workbench

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Cpu, Zap, Database, Flame, Thermometer, Activity, Sparkles,
  ShieldCheck, CheckCircle2, Layers, Radio, ArrowRight, Play, Pause,
  RotateCcw, FileText, Binary, Compass, Eye, Download, Search,
  SlidersHorizontal, HardDrive, Filter, AlertTriangle, ChevronRight,
  TrendingDown, TrendingUp, RefreshCw, Box, Shield, Server, FileJson,
  Scale, Microchip, Clock, CheckSquare, ZapOff
} from 'lucide-react';
import {
  DataTemperature,
  DATA_TEMPERATURE_REGIME,
  WORKLOAD_COMPARISONS,
  WorkloadArchitectureType,
  CIM_TELEMETRY_DATASET,
  CimTelemetrySweepEvent,
  CO_DESIGN_DISCOVERIES,
  HardwareSoftwareCoDesignDiscovery,
  CIM_COMPILER_PIPELINE,
  CimCompilerStage,
  ScientificCoDesignDiscoveryOutput,
  MEMORY_SUBSTRATES_TABLE,
  EpisodicExperienceLog,
  COMPILER_HARDWARE_FEEDBACK_TELEMETRY,
  CONTROLLED_STOCHASTICITY_TELEMETRY
} from './NeuromorphicCimTypes';

interface NeuromorphicCimWorkbenchProps {
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
}

export default function NeuromorphicCimWorkbench({ onLogEvent }: NeuromorphicCimWorkbenchProps) {
  // Navigation tabs inside the Neuromorphic-CIM Workbench
  const [activeSubView, setActiveSubView] = useState<
    'sweep_benchmark' | 'data_movement' | 'digital_truth' | 'episodic_nand' | 'wear_substrates' | 'hardware_variability' | 'novelty_learning' | 'compiler_feedback' | 'discovery_loop' | 'data_temperature' | 'workload_compare' | 'co_design_rules' | 'compiler_pipeline' | 'scientific_json'
  >('sweep_benchmark');

  // Sweep playback state
  const [currentSweepIndex, setCurrentSweepIndex] = useState<number>(5); // Default to Step #6 (0-indexed 5)
  const [isPlayingSweep, setIsPlayingSweep] = useState<boolean>(false);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Selected Discovery Card
  const [selectedDiscoveryId, setSelectedDiscoveryId] = useState<string>('disc_adaptive_placement');

  // Selected Data Temperature
  const [selectedTemperature, setSelectedTemperature] = useState<DataTemperature>('hot');

  // Selected Workload Architecture for deeper inspection
  const [selectedWorkload, setSelectedWorkload] = useState<WorkloadArchitectureType>('omega_hybrid');

  // Interactive Compiler stage
  const [activeCompilerStage, setActiveCompilerStage] = useState<number>(4);

  // Filter for co-design discoveries
  const [discoveryFilter, setDiscoveryFilter] = useState<'ALL' | 'CONFIRMED' | 'SIMULATION_VALIDATED'>('ALL');

  // Hardware variability injection levels
  const [injectedVariation, setInjectedVariation] = useState<number>(1.2); // % cell conductance deviation
  const [injectedTempDrift, setInjectedTempDrift] = useState<number>(0.8); // % thermal offset
  const [injectedAdcNoise, setInjectedAdcNoise] = useState<number>(0.5); // % ADC noise

  // Episodic NAND experience memories
  const [episodicLogs] = useState<EpisodicExperienceLog[]>([
    { episode: 18421, sensor_signature: "A91F", cim_configuration: "CIM_06", precision: "INT8", thermal_state: 45.2, prediction: 0.91, reality: 0.87, error: 0.04, result: "PASS", lesson: "Reduce spike sparsity when junction temperature exceeds 45.5°C" },
    { episode: 18422, sensor_signature: "B48C", cim_configuration: "CIM_06", precision: "INT8", thermal_state: 44.8, prediction: 0.95, reality: 0.94, error: 0.01, result: "PASS", lesson: "Pre-stage fragile glass grasp kinematics 15ms prior to physical contact" },
    { episode: 18423, sensor_signature: "C01A", cim_configuration: "CIM_04", precision: "INT4", thermal_state: 43.1, prediction: 0.82, reality: 0.76, error: 0.06, result: "CALIBRATE", lesson: "INT4 quantization in L3 causes 3.2% error under fast tactile micro-slip" },
    { episode: 18424, sensor_signature: "D77E", cim_configuration: "CIM_06", precision: "INT8", thermal_state: 45.0, prediction: 0.98, reality: 0.97, error: 0.01, result: "PASS", lesson: "Differential 2σ weight gating coalesces 76% of raw NAND writes" },
    { episode: 18425, sensor_signature: "E33F", cim_configuration: "CIM_07", precision: "INT4", thermal_state: 46.1, prediction: 0.94, reality: 0.89, error: 0.05, result: "VETO", lesson: "Thermal over-saturation at 46.1°C triggers emergency symbolic frequency scaling" }
  ]);

  // Current active sweep event data
  const currentEvent = useMemo<CimTelemetrySweepEvent>(() => {
    return CIM_TELEMETRY_DATASET[currentSweepIndex] || CIM_TELEMETRY_DATASET[5];
  }, [currentSweepIndex]);

  // Scientific Discovery output object (Step #6 optimal)
  const discoveryOutput = useMemo<ScientificCoDesignDiscoveryOutput>(() => {
    return {
      benchmark_id: "OMEGA_CIM_MEMORY_DISCOVERY_001",
      discovery: {
        optimal_cim_utilization_pct: 81,
        optimal_spike_sparsity_pct: 78,
        memory_bus_reduction_pct: 58,
        energy_reduction_pct: 31,
        accuracy_change_pct: 0.1,
        nand_write_reduction_pct: 24,
        optimal_operating_point: {
          step_name: "Step 6: CIM + Adaptive Precision",
          sensor_rate_hz: 32000,
          latency_us: 51,
          thermal_load_c: 45.2,
          cim_energy_nj_per_mac: 1.30
        }
      },
      hypothesis: "Hybrid CIM/NAND placement with dynamic data-temperature routing outperforms uniform memory placement",
      confidence: 0.93,
      reality_anchor: "SIMULATION_VALIDATED",
      next_experiment: "hardware_in_loop_validation",
      gaps_addressed: [
        "Gap A: First-Class Data Movement Accounting",
        "Gap B: Adaptive Precision Discovery Engine (INT2->FP32)",
        "Gap C: Analog CIM Digital Truth Reality Anchor Layer",
        "Gap D: Episodic Scientific Experience Memory in NAND",
        "Gap E: Multi-Substrate Memory Wear Predictor (SRAM/DRAM/MRAM/ReRAM/PCM/NOR/NAND)",
        "Gap F: Silicon Hardware Variability & Controlled Stochasticity Exploitation",
        "Gap G: Continual Learning with Safe Governance VETO Gating",
        "Gap H: Compiler <-> Hardware <-> Memory Closed-Loop Bidirectional Feedback"
      ],
      provenance: {
        compiler_version: "OMEGA-CIM-Compiler-v3.4.2-RULIAD",
        target_hardware: "OMEGA Neuromorphic-CIM 10T-SRAM + 3D QLC NAND Fabric",
        timestamp_iso: new Date().toISOString(),
        verification_hash: "0x8F92B4A1CD3E6E01A87D2F44"
      }
    };
  }, []);

  // Handle auto-play sweep
  useEffect(() => {
    if (isPlayingSweep) {
      playIntervalRef.current = setInterval(() => {
        setCurrentSweepIndex((prev) => {
          const next = (prev + 1) % CIM_TELEMETRY_DATASET.length;
          return next;
        });
      }, 1500);
    } else if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlayingSweep]);

  // 12-Step Memory-Aware Discovery Loop definitions
  const MEMORY_AWARE_DISCOVERY_LOOP = [
    { step: 1, name: 'SENSE', desc: 'Continuous asynchronous physical sensor streams (Vision, Tactile, Spectrometer)', target: 'Sensors / Transducers', color: 'border-amber-400 text-amber-950 bg-amber-50' },
    { step: 2, name: 'EVENT ENCODE', desc: 'Convert continuous analog signals into sparse event-driven spikes (LIF neuron thresholding)', target: 'Neuromorphic Spike Encoder', color: 'border-cyan-400 text-cyan-950 bg-cyan-50' },
    { step: 3, name: 'CLASSIFY DATA TEMP', desc: 'Dynamic temperature classifier tags data: HOT, WARM, COOL, COLD, LEARNED, SAFETY', target: 'Data Temperature Engine', color: 'border-rose-500 text-rose-950 bg-rose-50' },
    { step: 4, name: 'ROUTE TO FABRIC', desc: 'Zero-bus routing: stream HOT directly to SRAM-CIM; SAFETY to protected SRAM', target: 'OMEGA Crossbar Router', color: 'border-indigo-400 text-indigo-950 bg-indigo-50' },
    { step: 5, name: 'COMPUTE-IN-MEMORY', desc: 'Parallel analog vector-matrix multiplication directly inside SRAM/Memristor arrays', target: 'SRAM/CIM Macro Core', color: 'border-purple-500 text-purple-950 bg-purple-50' },
    { step: 6, name: 'SPIKE / STATE UPDATE', desc: 'Update recurrent latent hidden vectors and physical robot kinematic state tensor', target: 'Neuromorphic Core', color: 'border-blue-400 text-blue-950 bg-blue-50' },
    { step: 7, name: 'DIGITAL TRUTH CHECK', desc: 'Analog CIM -> ADC -> Quantization error estimate -> Digital reference comparison', target: 'Digital Reality Anchor', color: 'border-emerald-500 text-emerald-950 bg-emerald-50' },
    { step: 8, name: 'SYMBOLIC VETO', desc: 'Evaluate strict Level A-D Governance limits (glass force <4.5N, joint torque <28Nm)', target: 'Symbolic Safety Verifier', color: 'border-red-600 text-red-950 bg-red-50' },
    { step: 9, name: 'REALITY ANCHOR', desc: 'CAD-to-Point-Cloud & sensory discrepancy measurement (RMSE < 2.0%)', target: 'Reality Anchor Engine', color: 'border-teal-500 text-teal-950 bg-teal-50' },
    { step: 10, name: 'MEMORY WEAR PREDICT', desc: 'Evaluate write cost, endurance wear & alternative substrate routing', target: 'Wear Predictor Engine', color: 'border-amber-600 text-amber-950 bg-amber-50' },
    { step: 11, name: 'EPISODIC NAND COMMIT', desc: 'Commit compressed experience logs, lessons, & provenance to 3D NAND Flash', target: 'NAND Flash Store', color: 'border-slate-500 text-slate-950 bg-slate-50' },
    { step: 12, name: 'CIM COMPILER UPDATE', desc: 'Continuous optimization loop: compile new hardware bitstream policy', target: 'CIM Compiler Core', color: 'border-indigo-600 text-indigo-950 bg-indigo-50' }
  ];

  const selectedCategoryObj = useMemo(() => {
    return DATA_TEMPERATURE_REGIME.find(c => c.id === selectedTemperature) || DATA_TEMPERATURE_REGIME[0];
  }, [selectedTemperature]);

  const selectedDiscoveryObj = useMemo(() => {
    return CO_DESIGN_DISCOVERIES.find(d => d.id === selectedDiscoveryId) || CO_DESIGN_DISCOVERIES[0];
  }, [selectedDiscoveryId]);

  const filteredDiscoveries = useMemo(() => {
    if (discoveryFilter === 'ALL') return CO_DESIGN_DISCOVERIES;
    return CO_DESIGN_DISCOVERIES.filter(d => d.status === discoveryFilter);
  }, [discoveryFilter]);

  return (
    <div className="space-y-4 text-left font-sans animate-fadeIn">
      {/* 1. MASTER WORKBENCH HEADER */}
      <div className="bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-700 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-indigo-900 border border-indigo-500 text-indigo-200">
              <Cpu className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-indigo-500 text-black px-1.5 py-0.2 uppercase">
                  BENCHMARK: OMEGA_CIM_MEMORY_DISCOVERY_001
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  ● 7 GAPS ADDRESSED • CO-DESIGN DISCOVERY ENGINE
                </span>
              </div>
              <h2 className="font-serif font-black uppercase text-base sm:text-lg text-white tracking-wide">
                OMEGA Neuromorphic + Compute-in-Memory (CIM) + Hierarchical Flash/NAND Architecture
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="bg-neutral-900 text-neutral-300 border border-neutral-700 px-2.5 py-1">
              PARETO OPTIMUM: <strong className="text-emerald-400">Step #6 (81% CIM Util / 78% Sparsity / INT8)</strong>
            </span>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(JSON.stringify(discoveryOutput, null, 2));
                onLogEvent('[NEUROMORPHIC-CIM] Exported scientific co-design discovery certificate to audit ledger.', 'physics');
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1 border border-indigo-400 cursor-pointer flex items-center gap-1 uppercase"
            >
              <Download className="w-3 h-3" />
              Copy Co-Design JSON
            </button>
          </div>
        </div>

        {/* MISSION INTENT & ARCHITECTURAL SUMMARY */}
        <p className="text-xs text-neutral-300 font-sans leading-relaxed">
          <strong className="text-indigo-300">Core Scientific Principle:</strong> <em>"Compute where the data is, move only what must move."</em> OMEGA turns neuromorphic and Compute-in-Memory from a static benchmark into an autonomous <strong>chip–memory–algorithm co-design discovery engine</strong> incorporating first-class data movement accounting, adaptive precision (INT2 $\to$ FP32), analog CIM Digital Truth reality anchoring, episodic scientific memory in NAND, multi-substrate wear prediction, and hardware variability harvesting.
        </p>

        {/* SUB-NAV BUTTONS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-neutral-800">
          {[
            { id: 'sweep_benchmark', label: '📊 10-Step Discovery Sweep', icon: SlidersHorizontal },
            { id: 'data_movement', label: '🔄 Gap A: Data Movement', icon: Scale },
            { id: 'digital_truth', label: '⚓ Gap C: Digital Truth Layer', icon: ShieldCheck },
            { id: 'episodic_nand', label: '💾 Gap D: Episodic NAND', icon: Database },
            { id: 'wear_substrates', label: '📉 Gap E: Wear Predictor', icon: HardDrive },
            { id: 'hardware_variability', label: '🎲 Gap F: Silicon Variability', icon: Microchip },
            { id: 'novelty_learning', label: '🧠 Gap G: Continual Learning', icon: Sparkles },
            { id: 'compiler_feedback', label: '🔁 Gap H: Closed-Loop Feedback', icon: RefreshCw },
            { id: 'discovery_loop', label: '🔄 12-Step Loop', icon: Layers },
            { id: 'data_temperature', label: '🌡️ Data Temperature', icon: Flame },
            { id: 'workload_compare', label: '⚔️ 3-Workload Benchmark', icon: Activity },
            { id: 'co_design_rules', label: '💡 7 Discoveries', icon: CheckSquare },
            { id: 'compiler_pipeline', label: '⚙️ CIM Compiler', icon: Binary },
            { id: 'scientific_json', label: '📄 Discovery JSON', icon: FileJson }
          ].map(tab => {
            const isActive = activeSubView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSubView(tab.id as any);
                  onLogEvent(`[NEUROMORPHIC-CIM] Switched view to: ${tab.label}`, 'info');
                }}
                className={`px-3 py-1.5 text-[10.5px] font-mono font-bold tracking-tight cursor-pointer whitespace-nowrap border transition shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-400 text-black border-emerald-400 font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW 1: 10-STEP TELEMETRY SWEEP BENCHMARK (OMEGA_CIM_MEMORY_DISCOVERY_001) */}
      {activeSubView === 'sweep_benchmark' && (
        <div className="space-y-4">
          <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1A1A1A] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-widest block">
                  BENCHMARK: OMEGA_CIM_MEMORY_DISCOVERY_001 • 10-STEP MULTI-OBJECTIVE FRONTIER
                </span>
                <h3 className="text-base font-serif font-black uppercase text-neutral-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  Step #{currentEvent.step}: {currentEvent.variableName} — {currentEvent.discoveryTheme}
                </h3>
              </div>

              {/* Timeline Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingSweep(!isPlayingSweep)}
                  className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center gap-1 ${
                    isPlayingSweep ? 'bg-amber-400 text-amber-950' : 'bg-emerald-500 text-black'
                  }`}
                >
                  {isPlayingSweep ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isPlayingSweep ? 'Pause Sweep' : 'Auto Sweep'}</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentSweepIndex(5);
                    setIsPlayingSweep(false);
                    onLogEvent('[NEUROMORPHIC-CIM] Reset to global co-design optimum (Step #6)', 'physics');
                  }}
                  className="bg-white hover:bg-neutral-100 text-neutral-800 px-2.5 py-1.5 text-[10px] font-mono font-bold border border-neutral-300 cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3 text-neutral-600" />
                  Jump to Optimum (Step 6)
                </button>
              </div>
            </div>

            {/* Stepper Timeline Buttons */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-neutral-600 font-bold">10-Step Co-Design Sweep Progression:</span>
                <span className="text-neutral-500">
                  {currentEvent.is_optimal ? (
                    <strong className="text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-300">
                      ★ GLOBAL BALANCED PARETO OPTIMUM
                    </strong>
                  ) : currentEvent.thermal_c > 45.5 ? (
                    <strong className="text-red-700 bg-red-50 px-2 py-0.5 border border-red-300">
                      ⚠️ THERMAL & WEAR BOUNDARY ({currentEvent.thermal_c}°C)
                    </strong>
                  ) : (
                    <span className="text-indigo-700 font-bold">{currentEvent.discoveryTheme}</span>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                {CIM_TELEMETRY_DATASET.map((ev, idx) => {
                  const isCurrent = idx === currentSweepIndex;
                  return (
                    <button
                      key={ev.step}
                      onClick={() => {
                        setCurrentSweepIndex(idx);
                        setIsPlayingSweep(false);
                        onLogEvent(`[SWEEP] Selected Step ${ev.step}: ${ev.variableName}`, 'physics');
                      }}
                      className={`p-2 border text-center transition cursor-pointer flex flex-col items-center justify-between h-16 ${
                        isCurrent
                          ? 'bg-indigo-600 text-white border-indigo-900 ring-2 ring-indigo-400 font-bold scale-102 shadow-md'
                          : ev.is_optimal
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-400 hover:bg-emerald-100 font-bold'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      <span className="text-[8.5px] font-mono">STEP {ev.step}</span>
                      <span className="text-[9.5px] font-mono font-black truncate">{ev.variableName}</span>
                      <span className="text-[8px] font-mono opacity-80">{ev.precision} • {ev.inference_latency_us}µs</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6 Metric Telemetry KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-[10.5px]">
              {/* Metric 1: SRAM/CIM Util */}
              <div className="bg-[#FAF9F6] border-2 border-neutral-300 p-3 space-y-1">
                <span className="text-[9px] text-neutral-500 uppercase block font-bold">CIM Utilization</span>
                <div className="flex items-baseline justify-between">
                  <strong className="text-base font-black text-indigo-900">{currentEvent.sram_cim_utilization_pct}%</strong>
                  <span className="text-[9px] text-neutral-500">{currentEvent.precision}</span>
                </div>
                <div className="w-full bg-neutral-200 h-1.5">
                  <div
                    className={`h-full ${currentEvent.sram_cim_utilization_pct > 85 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                    style={{ width: `${currentEvent.sram_cim_utilization_pct}%` }}
                  />
                </div>
              </div>

              {/* Metric 2: Spike Sparsity */}
              <div className="bg-[#FAF9F6] border-2 border-neutral-300 p-3 space-y-1">
                <span className="text-[9px] text-neutral-500 uppercase block font-bold">Spike Sparsity</span>
                <div className="flex items-baseline justify-between">
                  <strong className="text-base font-black text-cyan-900">{currentEvent.spike_sparsity_pct}%</strong>
                  <span className="text-[9px] text-neutral-500">Events</span>
                </div>
                <div className="w-full bg-neutral-200 h-1.5">
                  <div className="h-full bg-cyan-600" style={{ width: `${currentEvent.spike_sparsity_pct}%` }} />
                </div>
              </div>

              {/* Metric 3: Memory Bus Traffic */}
              <div className="bg-[#FAF9F6] border-2 border-neutral-300 p-3 space-y-1">
                <span className="text-[9px] text-neutral-500 uppercase block font-bold">Bus Bandwidth</span>
                <div className="flex items-baseline justify-between">
                  <strong className="text-base font-black text-emerald-800">{currentEvent.memory_bus_traffic_gbps} Gbps</strong>
                  <span className="text-[9px] text-emerald-700 font-bold">-58%</span>
                </div>
                <div className="w-full bg-neutral-200 h-1.5">
                  <div className="h-full bg-emerald-600" style={{ width: `${(currentEvent.memory_bus_traffic_gbps / 18.4) * 100}%` }} />
                </div>
              </div>

              {/* Metric 4: Energy per MAC */}
              <div className="bg-[#FAF9F6] border-2 border-neutral-300 p-3 space-y-1">
                <span className="text-[9px] text-neutral-500 uppercase block font-bold">CIM Energy</span>
                <div className="flex items-baseline justify-between">
                  <strong className="text-base font-black text-purple-900">{currentEvent.cim_energy_nj_per_mac.toFixed(2)}</strong>
                  <span className="text-[9px] text-neutral-500">nJ/MAC</span>
                </div>
                <div className="w-full bg-neutral-200 h-1.5">
                  <div className="h-full bg-purple-600" style={{ width: `${(currentEvent.cim_energy_nj_per_mac / 2.0) * 100}%` }} />
                </div>
              </div>

              {/* Metric 5: Inference Latency */}
              <div className="bg-[#FAF9F6] border-2 border-neutral-300 p-3 space-y-1">
                <span className="text-[9px] text-neutral-500 uppercase block font-bold">Latency</span>
                <div className="flex items-baseline justify-between">
                  <strong className="text-base font-black text-blue-900">{currentEvent.inference_latency_us} µs</strong>
                  <span className="text-[9px] text-neutral-500">Deterministic</span>
                </div>
                <div className="w-full bg-neutral-200 h-1.5">
                  <div className="h-full bg-blue-600" style={{ width: `${(currentEvent.inference_latency_us / 100) * 100}%` }} />
                </div>
              </div>

              {/* Metric 6: Thermal Dissipation */}
              <div className={`p-3 space-y-1 border-2 ${
                currentEvent.thermal_c > 45.5 ? 'bg-red-50 border-red-400' : 'bg-[#FAF9F6] border-neutral-300'
              }`}>
                <span className="text-[9px] text-neutral-500 uppercase block font-bold">Thermal Load</span>
                <div className="flex items-baseline justify-between">
                  <strong className={`text-base font-black ${currentEvent.thermal_c > 45.5 ? 'text-red-700' : 'text-neutral-900'}`}>
                    {currentEvent.thermal_c.toFixed(1)} °C
                  </strong>
                  <span className="text-[9px] text-neutral-500">Cap: 48°C</span>
                </div>
                <div className="w-full bg-neutral-200 h-1.5">
                  <div
                    className={`h-full ${currentEvent.thermal_c > 45.5 ? 'bg-red-600' : 'bg-emerald-600'}`}
                    style={{ width: `${(currentEvent.thermal_c / 60) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Scientific Explanation of the Optimum */}
            <div className="bg-[#FCFAF7] border border-[#1A1A1A] p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-neutral-300 pb-1.5">
                <span className="text-[11px] font-serif font-black uppercase text-neutral-900 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-indigo-600" />
                  Step #{currentEvent.step} Discovery Findings & Reality Anchor Check
                </span>
                <span className="text-[9.5px] font-mono font-bold text-neutral-600">
                  Theme: {currentEvent.discoveryTheme}
                </span>
              </div>
              <p className="text-xs text-neutral-800 font-sans leading-relaxed">
                {currentEvent.notes}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[10px] pt-1 text-neutral-700">
                <div className="bg-white p-2 border border-neutral-200">
                  <span className="text-neutral-500 block text-[9px]">OFF-CHIP TRANSFERS:</span>
                  <strong className="text-indigo-900">{(currentEvent.dataMovement.bytes_off_chip / 1000).toFixed(0)} KB</strong>
                </div>
                <div className="bg-white p-2 border border-neutral-200">
                  <span className="text-neutral-500 block text-[9px]">DATA MOVEMENT ENERGY:</span>
                  <strong className="text-purple-900">{(currentEvent.dataMovement.data_movement_energy_pj / 1000).toFixed(1)} nJ</strong>
                </div>
                <div className="bg-white p-2 border border-neutral-200">
                  <span className="text-neutral-500 block text-[9px]">DIGITAL TRUTH VERIFICATION:</span>
                  <strong className={currentEvent.digitalTruth.verification === 'PASS' ? 'text-emerald-700' : 'text-red-700'}>
                    ● {currentEvent.digitalTruth.verification} (Δ {currentEvent.digitalTruth.quantization_error.toFixed(4)})
                  </strong>
                </div>
              </div>
            </div>

            {/* Complete 10-Step Telemetry Matrix Table */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase block">
                Full 10-Step OMEGA Neuromorphic-CIM Telemetry Matrix:
              </span>
              <div className="border-2 border-[#1A1A1A] overflow-x-auto shadow-sm">
                <table className="w-full text-left font-mono text-[10px] border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 border-b border-[#1A1A1A] text-neutral-800 uppercase font-black text-[9px]">
                      <th className="p-2 border-r border-neutral-300">Step</th>
                      <th className="p-2 border-r border-neutral-300">Variable</th>
                      <th className="p-2 border-r border-neutral-300">Theme</th>
                      <th className="p-2 border-r border-neutral-300">CIM Util</th>
                      <th className="p-2 border-r border-neutral-300">Precision</th>
                      <th className="p-2 border-r border-neutral-300">Bus (Gbps)</th>
                      <th className="p-2 border-r border-neutral-300">Energy (nJ/MAC)</th>
                      <th className="p-2 border-r border-neutral-300">Latency (µs)</th>
                      <th className="p-2 border-r border-neutral-300">Accuracy</th>
                      <th className="p-2 border-r border-neutral-300">Thermal (°C)</th>
                      <th className="p-2">Truth Check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {CIM_TELEMETRY_DATASET.map((row, idx) => {
                      const isSelected = idx === currentSweepIndex;
                      return (
                        <tr
                          key={row.step}
                          onClick={() => {
                            setCurrentSweepIndex(idx);
                            setIsPlayingSweep(false);
                          }}
                          className={`cursor-pointer transition ${
                            isSelected
                              ? 'bg-indigo-100/80 font-bold'
                              : row.is_optimal
                              ? 'bg-emerald-50/70 hover:bg-emerald-100'
                              : 'hover:bg-neutral-100'
                          }`}
                        >
                          <td className="p-2 border-r border-neutral-300 font-bold flex items-center gap-1">
                            {row.is_optimal && <span className="text-emerald-700 font-black">★</span>}
                            <span>{row.step}</span>
                          </td>
                          <td className="p-2 border-r border-neutral-300 font-bold text-indigo-900">{row.variableName}</td>
                          <td className="p-2 border-r border-neutral-300 text-neutral-700">{row.discoveryTheme}</td>
                          <td className="p-2 border-r border-neutral-300 font-bold">{row.sram_cim_utilization_pct}%</td>
                          <td className="p-2 border-r border-neutral-300 text-purple-900 font-bold">{row.precision}</td>
                          <td className="p-2 border-r border-neutral-300 text-emerald-800 font-bold">{row.memory_bus_traffic_gbps}</td>
                          <td className="p-2 border-r border-neutral-300 text-purple-900">{row.cim_energy_nj_per_mac.toFixed(2)}</td>
                          <td className="p-2 border-r border-neutral-300 font-bold text-blue-900">{row.inference_latency_us}</td>
                          <td className="p-2 border-r border-neutral-300 text-neutral-900">{row.model_accuracy_pct}%</td>
                          <td className={`p-2 border-r border-neutral-300 ${row.thermal_c > 45.5 ? 'text-red-700 font-bold' : 'text-neutral-700'}`}>
                            {row.thermal_c.toFixed(1)}
                          </td>
                          <td className="p-2 font-bold text-emerald-700">{row.digitalTruth.verification}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: GAP A — FIRST-CLASS DATA MOVEMENT ACCOUNTING */}
      {activeSubView === 'data_movement' && (
        <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
          <div className="border-b border-[#1A1A1A] pb-3">
            <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-widest block">
              GAP A: DATA MOVEMENT IS A FIRST-CLASS SCIENTIFIC VARIABLE
            </span>
            <h3 className="text-base font-serif font-black uppercase text-neutral-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-600" />
              Scientific Question: Which computation should move to memory?
            </h3>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed mt-1">
              Rather than only asking <em>"How much CIM can we use?"</em>, OMEGA instruments the exact byteflow across every boundary to discover the optimal compute-memory partitioning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-[11px]">
            <div className="p-3 border-2 border-neutral-300 bg-[#FAF9F6] space-y-1">
              <span className="text-[9px] text-neutral-500 uppercase block font-bold">Sensor → Memory Ingestion</span>
              <strong className="text-base font-black text-indigo-900">
                {(currentEvent.dataMovement.bytes_sensor_to_memory / 1024).toFixed(1)} KB/s
              </strong>
              <p className="text-[10px] text-neutral-600 font-sans">Raw asynchronous spike-event streams ingested into input buffers.</p>
            </div>

            <div className="p-3 border-2 border-neutral-300 bg-[#FAF9F6] space-y-1">
              <span className="text-[9px] text-neutral-500 uppercase block font-bold">Memory → Compute Boundary</span>
              <strong className="text-base font-black text-blue-900">
                {(currentEvent.dataMovement.bytes_memory_to_compute / 1024).toFixed(1)} KB/inf
              </strong>
              <p className="text-[10px] text-neutral-600 font-sans">Weights and activations fetched for digital safety verifier.</p>
            </div>

            <div className="p-3 border-2 border-neutral-300 bg-[#FAF9F6] space-y-1">
              <span className="text-[9px] text-neutral-500 uppercase block font-bold">Compute → Memory Writeback</span>
              <strong className="text-base font-black text-purple-900">
                {(currentEvent.dataMovement.bytes_compute_to_memory / 1024).toFixed(1)} KB/inf
              </strong>
              <p className="text-[10px] text-neutral-600 font-sans">Intermediate latent state tensors written back to working memory.</p>
            </div>

            <div className="p-3 border-2 border-emerald-400 bg-emerald-50 space-y-1">
              <span className="text-[9px] text-emerald-800 uppercase block font-bold">Off-Chip Memory Transfers</span>
              <strong className="text-base font-black text-emerald-950">
                {(currentEvent.dataMovement.bytes_off_chip / 1024).toFixed(1)} KB (-58%)
              </strong>
              <p className="text-[10px] text-neutral-700 font-sans">Off-chip transfers bypassed due to stationary SRAM-CIM weights.</p>
            </div>

            <div className="p-3 border-2 border-neutral-300 bg-[#FAF9F6] space-y-1">
              <span className="text-[9px] text-neutral-500 uppercase block font-bold">Memory Bus Transactions</span>
              <strong className="text-base font-black text-neutral-900">
                {currentEvent.dataMovement.memory_bus_transactions.toLocaleString()} txn/s
              </strong>
              <p className="text-[10px] text-neutral-600 font-sans">Bus arbitrations required per 10-step physical cycle.</p>
            </div>

            <div className="p-3 border-2 border-neutral-300 bg-[#FAF9F6] space-y-1">
              <span className="text-[9px] text-neutral-500 uppercase block font-bold">Data Movement Energy</span>
              <strong className="text-base font-black text-rose-900">
                {currentEvent.dataMovement.data_movement_energy_pj.toLocaleString()} pJ
              </strong>
              <p className="text-[10px] text-neutral-600 font-sans">Physical I/O pad dissipation spent purely moving bits over wires.</p>
            </div>
          </div>

          <div className="bg-[#121212] text-neutral-200 p-4 border-2 border-[#1A1A1A] font-mono text-[10.5px]">
            <span className="text-indigo-400 font-bold uppercase block mb-1">DATA MOVEMENT SCIENTIFIC SCHEMA (JSON):</span>
            <pre className="text-emerald-400 text-[10px] overflow-x-auto">{JSON.stringify(currentEvent.dataMovement, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* VIEW: GAP C — ANALOG CIM DIGITAL TRUTH LAYER */}
      {activeSubView === 'digital_truth' && (
        <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
          <div className="border-b border-[#1A1A1A] pb-3">
            <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-widest block">
              GAP C: ANALOG CIM REALITY ANCHOR & DIGITAL TRUTH LAYER
            </span>
            <h3 className="text-base font-serif font-black uppercase text-neutral-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Analog CIM → ADC → Quantization/Error Estimate → Digital Verifier → Reality Anchor
            </h3>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed mt-1">
              Analog CIM outputs are never passed directly to critical actuators. The Digital Truth Layer computes an instantaneous error delta against a software reference to guarantee zero drift.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-[#1A1A1A] p-4 bg-[#FCFAF7] space-y-3 font-mono text-[11px]">
              <div className="flex justify-between border-b border-neutral-300 pb-1 font-bold">
                <span>SIGNAL / REALITY ANCHOR</span>
                <span className="text-emerald-700">STATUS: {currentEvent.digitalTruth.verification}</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Analog CIM Output:</span>
                  <strong className="text-indigo-900">{currentEvent.digitalTruth.cim_output.toFixed(4)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">ADC Readout Value:</span>
                  <strong className="text-blue-900">{currentEvent.digitalTruth.adc_output.toFixed(4)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Quantization Error:</span>
                  <strong className="text-amber-700">Δ {currentEvent.digitalTruth.quantization_error.toFixed(4)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Crossbar Device Variation:</span>
                  <strong className="text-purple-700">σ {currentEvent.digitalTruth.device_variation.toFixed(4)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Temperature Drift:</span>
                  <strong className="text-rose-700">δT {currentEvent.digitalTruth.temperature_drift.toFixed(4)}</strong>
                </div>
                <div className="flex justify-between border-t border-neutral-300 pt-1">
                  <span className="text-neutral-900 font-bold">Digital Software Reference:</span>
                  <strong className="text-emerald-800 font-black">{currentEvent.digitalTruth.digital_reference.toFixed(4)}</strong>
                </div>
              </div>
            </div>

            <div className="bg-[#121212] text-neutral-200 p-4 border-2 border-[#1A1A1A] font-mono text-[10.5px] space-y-2">
              <span className="text-indigo-400 font-bold uppercase block">DIGITAL TRUTH TELEMETRY PAYLOAD:</span>
              <pre className="text-cyan-300 text-[10px] overflow-x-auto">{JSON.stringify(currentEvent.digitalTruth, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: GAP D — EPISODIC SCIENTIFIC EXPERIENCE MEMORY IN NAND */}
      {activeSubView === 'episodic_nand' && (
        <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
          <div className="border-b border-[#1A1A1A] pb-3">
            <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-widest block">
              GAP D: NAND AS EPISODIC SCIENTIFIC EXPERIENCE MEMORY
            </span>
            <h3 className="text-base font-serif font-black uppercase text-neutral-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-600" />
              NAND = Scientific Experience (Trajectories, Conditions, Lessons, & Reality Anchors)
            </h3>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed mt-1">
              Rather than treating NAND as mere persistent storage, OMEGA writes structured episodic discovery records that allow the system to learn across trials without uncontrolled runtime retraining.
            </p>
          </div>

          <div className="border-2 border-[#1A1A1A] overflow-x-auto shadow-sm">
            <table className="w-full text-left font-mono text-[10px] border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-[#1A1A1A] text-neutral-800 uppercase font-black">
                  <th className="p-2 border-r border-neutral-300">Episode</th>
                  <th className="p-2 border-r border-neutral-300">Sensor Sig</th>
                  <th className="p-2 border-r border-neutral-300">CIM Config</th>
                  <th className="p-2 border-r border-neutral-300">Precision</th>
                  <th className="p-2 border-r border-neutral-300">Temp (°C)</th>
                  <th className="p-2 border-r border-neutral-300">Pred vs Reality</th>
                  <th className="p-2 border-r border-neutral-300">Result</th>
                  <th className="p-2">Learned Scientific Lesson</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {episodicLogs.map((log) => (
                  <tr key={log.episode} className="hover:bg-neutral-50">
                    <td className="p-2 border-r border-neutral-300 font-bold text-indigo-900">#{log.episode}</td>
                    <td className="p-2 border-r border-neutral-300 text-neutral-700">{log.sensor_signature}</td>
                    <td className="p-2 border-r border-neutral-300 font-bold">{log.cim_configuration}</td>
                    <td className="p-2 border-r border-neutral-300 text-purple-900 font-bold">{log.precision}</td>
                    <td className="p-2 border-r border-neutral-300">{log.thermal_state.toFixed(1)}</td>
                    <td className="p-2 border-r border-neutral-300">{log.prediction} / {log.reality} (Δ{log.error})</td>
                    <td className={`p-2 border-r border-neutral-300 font-bold ${
                      log.result === 'PASS' ? 'text-emerald-700' : log.result === 'CALIBRATE' ? 'text-amber-700' : 'text-red-700'
                    }`}>{log.result}</td>
                    <td className="p-2 text-neutral-800 font-sans text-[10.5px]">{log.lesson}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: GAP E — MULTI-SUBSTRATE MEMORY WEAR PREDICTOR */}
      {activeSubView === 'wear_substrates' && (
        <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
          <div className="border-b border-[#1A1A1A] pb-3">
            <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-widest block">
              GAP E: MULTI-SUBSTRATE MEMORY WEAR & ENDURANCE PREDICTOR
            </span>
            <h3 className="text-base font-serif font-black uppercase text-neutral-900 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-indigo-600" />
              Technology-Neutral Memory Selection: SRAM, DRAM, MRAM, ReRAM, PCM, NOR, NAND
            </h3>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed mt-1">
              Every write operation produces a wear cost prediction. OMEGA dynamically routes data payloads across non-volatile technologies based on access frequency, retention, and endurance limits.
            </p>
          </div>

          <div className="border-2 border-[#1A1A1A] overflow-x-auto shadow-sm">
            <table className="w-full text-left font-mono text-[10px] border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-[#1A1A1A] text-neutral-800 uppercase font-black">
                  <th className="p-2 border-r border-neutral-300">Memory Substrate</th>
                  <th className="p-2 border-r border-neutral-300">Latency (ns)</th>
                  <th className="p-2 border-r border-neutral-300">Energy (pJ/bit)</th>
                  <th className="p-2 border-r border-neutral-300">Retention</th>
                  <th className="p-2 border-r border-neutral-300">Endurance Cycles</th>
                  <th className="p-2 border-r border-neutral-300">Optimal Temp</th>
                  <th className="p-2 border-r border-neutral-300">Wear Rate</th>
                  <th className="p-2">Protection State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {MEMORY_SUBSTRATES_TABLE.map((mem) => (
                  <tr key={mem.technology} className="hover:bg-neutral-50">
                    <td className="p-2 border-r border-neutral-300 font-bold text-indigo-900">{mem.technology}</td>
                    <td className="p-2 border-r border-neutral-300">{mem.latencyNs}</td>
                    <td className="p-2 border-r border-neutral-300 text-purple-900">{mem.energyPjPerBit}</td>
                    <td className="p-2 border-r border-neutral-300">{mem.retentionYears}</td>
                    <td className="p-2 border-r border-neutral-300 font-bold">{mem.enduranceCycles}</td>
                    <td className="p-2 border-r border-neutral-300 text-indigo-800 font-bold">{mem.optimalTemperature}</td>
                    <td className="p-2 border-r border-neutral-300">{mem.wearFactorPerHour.toFixed(2)}</td>
                    <td className="p-2 font-bold text-emerald-700">● {mem.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: GAP F — SILICON HARDWARE VARIABILITY & NOISE-AS-RESOURCE */}
      {activeSubView === 'hardware_variability' && (
        <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
          <div className="border-b border-[#1A1A1A] pb-3">
            <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-widest block">
              GAP F: SILICON HARDWARE VARIABILITY & NOISE-AS-RESOURCE INJECTION
            </span>
            <h3 className="text-base font-serif font-black uppercase text-neutral-900 flex items-center gap-2">
              <Microchip className="w-4 h-4 text-indigo-600" />
              Can OMEGA Adapt to Imperfect Silicon & Harvest Device Noise?
            </h3>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed mt-1">
              Inject real-world silicon nonidealities (cell-to-cell conductance variation, temperature drift, ADC noise, IR drop) to prove scientific robustness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 border-2 border-neutral-300 bg-[#FAF9F6] space-y-2">
              <div className="flex justify-between font-mono text-[10px]">
                <span className="font-bold">Cell-to-Cell Conductance σ:</span>
                <strong className="text-indigo-900">{injectedVariation}%</strong>
              </div>
              <input
                type="range"
                min="0.0"
                max="5.0"
                step="0.1"
                value={injectedVariation}
                onChange={(e) => setInjectedVariation(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[9px] text-neutral-500 font-sans block">Simulates memristor/crossbar conductance manufacturing deviation.</span>
            </div>

            <div className="p-3 border-2 border-neutral-300 bg-[#FAF9F6] space-y-2">
              <div className="flex justify-between font-mono text-[10px]">
                <span className="font-bold">Thermal Drift Offset:</span>
                <strong className="text-rose-900">{injectedTempDrift}%</strong>
              </div>
              <input
                type="range"
                min="0.0"
                max="3.0"
                step="0.1"
                value={injectedTempDrift}
                onChange={(e) => setInjectedTempDrift(parseFloat(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <span className="text-[9px] text-neutral-500 font-sans block">Simulates threshold voltage shifts under 45°C+ junction heat.</span>
            </div>

            <div className="p-3 border-2 border-neutral-300 bg-[#FAF9F6] space-y-2">
              <div className="flex justify-between font-mono text-[10px]">
                <span className="font-bold">ADC Quantization Noise:</span>
                <strong className="text-amber-900">{injectedAdcNoise}%</strong>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.0"
                step="0.1"
                value={injectedAdcNoise}
                onChange={(e) => setInjectedAdcNoise(parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-[9px] text-neutral-500 font-sans block">Simulates multi-bit readout comparator noise in column ADCs.</span>
            </div>
          </div>

          <div className="p-3 border-2 border-emerald-400 bg-emerald-50 font-mono text-[11px] space-y-2">
            <div className="flex justify-between items-center">
              <strong className="text-emerald-950 block">★ Discovery #7 Confirmed: Controlled Stochasticity Exploited</strong>
              <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 text-[9px] font-bold border border-emerald-400">
                SAFETY PASS • BOUNDED
              </span>
            </div>
            <p className="text-[10.5px] text-neutral-800 font-sans leading-relaxed">
              Rather than assuming noise is unconditionally beneficial, <strong>controlled stochasticity is characterized, bounded, and exploited as an exploration resource</strong>. Real-time logging confirms diversity gains while preserving accuracy and deterministic safety anchoring.
            </p>
            <div className="bg-[#121212] p-2.5 border border-emerald-700 text-emerald-400 text-[10px] overflow-x-auto">
              <pre>{JSON.stringify(CONTROLLED_STOCHASTICITY_TELEMETRY, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: GAP G — CONTINUAL LEARNING & NOVELTY DETECTOR */}
      {activeSubView === 'novelty_learning' && (
        <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
          <div className="border-b border-[#1A1A1A] pb-3">
            <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-widest block">
              GAP G: CONTINUAL LEARNING WITHOUT UNCONTROLLED REWRITING
            </span>
            <h3 className="text-base font-serif font-black uppercase text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Novelty Detector + Symbolic VETO Reality Anchor
            </h3>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed mt-1">
              Safety-critical parameters are never rewritten in real-time. Novelty is partitioned into Known (normal inference), Uncertain (temporary buffer), and Novel (research candidate for governance verification).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
            <div className="p-3 border-2 border-emerald-400 bg-emerald-50 space-y-1.5">
              <strong className="text-emerald-950 block uppercase text-xs">1. Known Domain</strong>
              <p className="text-[10.5px] text-neutral-800 font-sans">Confidence &gt; 92%. Normal high-speed SRAM-CIM analog inference with zero bus stall.</p>
              <span className="bg-emerald-200 text-emerald-900 text-[9px] px-1.5 py-0.5 font-bold">ACTIVE DEPLOYMENT</span>
            </div>

            <div className="p-3 border-2 border-amber-400 bg-amber-50 space-y-1.5">
              <strong className="text-amber-950 block uppercase text-xs">2. Uncertain State</strong>
              <p className="text-[10.5px] text-neutral-800 font-sans">Confidence 70-92%. Staged in DRAM temporary learning buffer with Reality Anchor check.</p>
              <span className="bg-amber-200 text-amber-900 text-[9px] px-1.5 py-0.5 font-bold">BUFFERED AUDIT</span>
            </div>

            <div className="p-3 border-2 border-purple-400 bg-purple-50 space-y-1.5">
              <strong className="text-purple-950 block uppercase text-xs">3. Novel Discovery</strong>
              <p className="text-[10.5px] text-neutral-800 font-sans">Novel physical property detected. Committed to NAND for CIM compiler re-optimization.</p>
              <span className="bg-purple-200 text-purple-900 text-[9px] px-1.5 py-0.5 font-bold">GOVERNANCE REQUIRED</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: GAP H — COMPILER <-> HARDWARE <-> MEMORY CLOSED-LOOP FEEDBACK */}
      {activeSubView === 'compiler_feedback' && (
        <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
          <div className="border-b border-[#1A1A1A] pb-3">
            <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-widest block">
              GAP H: COMPILER ↔ HARDWARE ↔ MEMORY BIDIRECTIONAL FEEDBACK
            </span>
            <h3 className="text-base font-serif font-black uppercase text-neutral-900 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-indigo-600" />
              Closed-Loop Co-Design Optimization Policy Synthesis
            </h3>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed mt-1">
              Treats software stack, CIM hardware arrays, and memory fabric as an integrated bidirectional feedback system. Real-time chip telemetry directly synthesizes updated compiler allocation rules.
            </p>
          </div>

          {/* BIDIRECTIONAL DATAFLOW SCHEMATIC */}
          <div className="bg-[#121212] text-neutral-200 p-4 border-2 border-[#1A1A1A] font-mono text-[10.5px] space-y-2 overflow-x-auto">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-1 text-[9.5px]">
              <span className="font-bold text-indigo-400 uppercase">OMEGA Bidirectional Co-Design Pipeline</span>
              <span className="text-emerald-400 font-bold">ACTIVE CLOSED LOOP</span>
            </div>
            <pre className="text-emerald-300 font-mono text-[10px] leading-relaxed">
{`   ┌──────────────────────────────────────────────┐
   │         OMEGA SLLM / Mission Algorithm       │
   └──────────────────────┬───────────────────────┘
                          ↓
                   CIM COMPILER
                          ↓
            ┌─────────────┴─────────────┐
            ↓                           ↓
        CIM ARRAY                 MEMORY FABRIC
      (10T SRAM-CIM)               (NAND/Flash)
            ↓                           ↓
      NEUROMORPHIC              EPISODIC EXPERIENCE
            └─────────────┬─────────────┘
                          ↓
                   CHIP TELEMETRY
                          ↓
               DIGITAL TRUTH LAYER
                          ↓
                   REALITY ANCHOR
                          ↓
              ┌───────────────────────┐
              │  DISCOVERY FEEDBACK   │
              │  • Latency (51 µs)    │
              │  • Energy (1.30 nJ)   │
              │  • Accuracy (+0.1%)   │
              │  • Thermal (45.2°C)   │
              │  • Endurance (2σ buf) │
              │  • Bus Traffic (5.2G) │
              │  • Noise (σ = 0.011)  │
              └───────────┬───────────┘
                          ↓
               NEW COMPILER POLICY ↺ (Adaptive Policy v3.5)`}
            </pre>
          </div>

          {/* TELEMETRY FEEDBACK METRICS */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase text-neutral-900">
              Active Closed-Loop Telemetry &amp; Adaptive Feedback Actions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {COMPILER_HARDWARE_FEEDBACK_TELEMETRY.map((item, idx) => (
                <div key={idx} className="p-3 border-2 border-neutral-300 bg-[#FAF9F6] space-y-1 font-mono text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-neutral-700 uppercase">{item.metric}</span>
                    <span className="text-[8.5px] px-1 bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                      {item.status}
                    </span>
                  </div>
                  <div className="text-sm font-black text-indigo-900">{item.measured_value}</div>
                  <div className="text-[9px] text-neutral-500">Threshold: {item.target_threshold}</div>
                  <div className="text-[9.5px] text-neutral-800 font-sans pt-1 border-t border-neutral-200">
                    <strong className="text-indigo-800">Action:</strong> {item.feedback_action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: 12-STEP MEMORY-AWARE DISCOVERY LOOP */}
      {activeSubView === 'discovery_loop' && (
        <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
          <div className="border-b border-[#1A1A1A] pb-3">
            <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-widest block">
              12-STEP CLOSED LOOP • SCIENTIFIC DISCOVERY CYCLE
            </span>
            <h3 className="text-base font-serif font-black uppercase text-neutral-900 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-indigo-600" />
              The Complete Memory-Aware Processing Cycle
            </h3>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed mt-1">
              Data is classified for temperature immediately after event encoding. Only meaningful state changes move through the bus, eliminating the von-Neumann memory wall.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {MEMORY_AWARE_DISCOVERY_LOOP.map((stage) => (
              <div
                key={stage.step}
                className={`p-3 border-2 ${stage.color} space-y-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <strong className="font-black">STAGE {stage.step}</strong>
                  <span className="bg-black/10 px-1.5 py-0.2 font-bold text-[9px] uppercase">{stage.target}</span>
                </div>
                <h4 className="font-mono font-bold text-xs uppercase text-black">{stage.name}</h4>
                <p className="text-[11px] font-sans text-neutral-800 leading-snug">
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: DATA TEMPERATURE ENGINE */}
      {activeSubView === 'data_temperature' && (
        <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
          <div className="border-b border-[#1A1A1A] pb-3">
            <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-widest block">
              DYNAMIC INFORMATION CLASSIFIER
            </span>
            <h3 className="text-base font-serif font-black uppercase text-neutral-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-600" />
              Data Temperature Engine (Routing Policy)
            </h3>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed mt-1">
              OMEGA classifies every incoming data object and neural tensor into six discrete thermodynamic states, routing each object to the physical memory substrate designed for its specific access frequency and error tolerance.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {DATA_TEMPERATURE_REGIME.map((cat) => {
              const isSelected = selectedTemperature === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedTemperature(cat.id);
                    onLogEvent(`[DATA-TEMP] Inspected category: ${cat.label} -> ${cat.destination}`, 'info');
                  }}
                  className={`p-3 border-2 text-left transition cursor-pointer flex flex-col justify-between h-24 ${
                    isSelected
                      ? `${cat.badgeColor} ring-2 ring-indigo-400 font-bold scale-102 shadow-md`
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{cat.iconSymbol}</span>
                    <span className="text-[8.5px] font-mono font-bold uppercase">{cat.targetLatencyNs} ns</span>
                  </div>
                  <div>
                    <span className="font-mono font-black text-xs block">{cat.label}</span>
                    <span className="text-[8.5px] font-mono truncate block opacity-80">{cat.destination}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="border-2 border-[#1A1A1A] bg-[#FCFAF7] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-300 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedCategoryObj.iconSymbol}</span>
                <div>
                  <h4 className="font-serif font-black uppercase text-sm text-neutral-900">
                    {selectedCategoryObj.label} Regime Detail
                  </h4>
                  <span className="text-[10px] font-mono text-neutral-600">
                    Physical Destination: <strong className="text-indigo-900">{selectedCategoryObj.destination}</strong>
                  </span>
                </div>
              </div>
              <span className={`px-2 py-0.5 text-[9.5px] font-mono font-bold border ${selectedCategoryObj.badgeColor}`}>
                Access Freq: {selectedCategoryObj.accessFrequency}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">Underlying Physical Substrate</span>
                  <strong className="font-mono text-neutral-900">{selectedCategoryObj.physicalTechnology}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">Operational Characteristics</span>
                  <p className="text-neutral-700 leading-relaxed">{selectedCategoryObj.characteristics}</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">Typical Resident Data Payloads</span>
                <ul className="space-y-1 font-mono text-[10.5px]">
                  {selectedCategoryObj.typicalPayloads.map((payload, i) => (
                    <li key={i} className="flex items-center gap-1.5 bg-white p-1.5 border border-neutral-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      <span className="text-neutral-800">{payload}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: 3-WORKLOAD ARCHITECTURE COMPARISON */}
      {activeSubView === 'workload_compare' && (
        <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
          <div className="border-b border-[#1A1A1A] pb-3">
            <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-widest block">
              BENCHMARKING EXPERIMENTS A, B, AND C
            </span>
            <h3 className="text-base font-serif font-black uppercase text-neutral-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              Three Workload Architectures Under Identical Physical Stimuli
            </h3>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed mt-1">
              Compare conventional Von-Neumann processing vs pure homogeneous SRAM-CIM vs OMEGA's Neuromorphic CIM-NAND Hybrid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {WORKLOAD_COMPARISONS.map((wl) => {
              const isSelected = selectedWorkload === wl.id;
              return (
                <div
                  key={wl.id}
                  onClick={() => {
                    setSelectedWorkload(wl.id);
                    onLogEvent(`[WORKLOAD] Inspected ${wl.name}`, 'info');
                  }}
                  className={`p-4 border-2 cursor-pointer transition flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'border-indigo-600 bg-[#FAF9F6] shadow-[3px_3px_0px_0px_rgba(79,70,229,1)]'
                      : 'border-neutral-300 bg-white hover:border-neutral-500'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold uppercase text-neutral-500">{wl.id}</span>
                      {wl.id === 'omega_hybrid' && (
                        <span className="bg-emerald-100 text-emerald-800 font-mono text-[8.5px] font-bold px-1.5 py-0.2 border border-emerald-300">
                          ★ WINNER
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif font-bold text-xs uppercase text-neutral-900">{wl.name}</h4>
                    <p className="text-[10px] font-mono text-neutral-600 bg-white p-2 border border-neutral-200">
                      {wl.dataflowPipeline}
                    </p>
                  </div>

                  <div className="space-y-1.5 font-mono text-[10px] border-t border-neutral-200 pt-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Energy / Inference:</span>
                      <strong className={wl.energyPerInferenceUj < 10 ? 'text-emerald-700 font-bold' : 'text-neutral-800'}>
                        {wl.energyPerInferenceUj} µJ
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Memory Bus Traffic:</span>
                      <strong className={wl.memoryBusTrafficGbps < 6 ? 'text-emerald-700 font-bold' : 'text-neutral-800'}>
                        {wl.memoryBusTrafficGbps} Gbps
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Latency:</span>
                      <strong className="text-neutral-800">{wl.inferenceLatencyUs} µs</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Model Accuracy:</span>
                      <strong className={wl.modelAccuracyPct >= 94.7 ? 'text-emerald-700 font-bold' : 'text-neutral-800'}>
                        {wl.modelAccuracyPct}%
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Thermal Temp:</span>
                      <strong className={wl.thermalLoadC > 50 ? 'text-red-700 font-bold' : 'text-neutral-800'}>
                        {wl.thermalLoadC}°C
                      </strong>
                    </div>
                  </div>

                  <div className="space-y-1 text-[10px] font-sans border-t border-neutral-200 pt-2">
                    <div className="text-emerald-800">
                      <strong>Advantage:</strong> {wl.advantages}
                    </div>
                    <div className="text-amber-800">
                      <strong>Limitation:</strong> {wl.bottleneck}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3 INDEPENDENT DOMAIN WORKLOADS & MULTI-OBJECTIVE PARETO FRONTIER */}
          <div className="border-t-2 border-[#1A1A1A] pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[9.5px] font-mono font-bold text-indigo-700 uppercase">
                  OMEGA_CIM_MEMORY_DISCOVERY_001 • MULTI-OBJECTIVE PARETO FRONTIER
                </span>
                <h4 className="font-serif font-black uppercase text-sm text-neutral-900">
                  Three Domain Workloads Yield Distinct Physical Pareto Optima
                </h4>
              </div>
              <span className="text-[9px] font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 font-bold border border-emerald-300">
                WORKLOAD-ADAPTIVE CO-DESIGN
              </span>
            </div>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed">
              Rather than forcing a single static "winner", OMEGA's discovery engine sweeps precision (INT2 $\to$ FP32), CIM utilization (20% $\to$ 100%), sparsity (0% $\to$ 95%), temperature, device variation, and memory substrates (SRAM, DRAM, MRAM, ReRAM, PCM, NAND) to identify tailored Pareto frontiers for different workload dynamics:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[10.5px]">
              {/* Workload 1 */}
              <div className="p-3 border-2 border-indigo-400 bg-indigo-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <strong className="text-indigo-950 uppercase text-xs">1. Neuromorphic Sensory</strong>
                  <span className="bg-indigo-200 text-indigo-900 text-[8.5px] px-1 font-bold">EVENT-DRIVEN</span>
                </div>
                <div className="space-y-1 text-[10px] text-neutral-800">
                  <div className="flex justify-between"><span>Optimal Precision:</span><strong className="text-indigo-900">INT4 / INT8</strong></div>
                  <div className="flex justify-between"><span>CIM Utilization:</span><strong className="text-indigo-900">81% (SRAM-CIM)</strong></div>
                  <div className="flex justify-between"><span>Spike Sparsity:</span><strong className="text-indigo-900">78%</strong></div>
                  <div className="flex justify-between"><span>Energy / MAC:</span><strong className="text-emerald-700">1.30 nJ</strong></div>
                  <div className="flex justify-between"><span>Inference Latency:</span><strong className="text-emerald-700">51 µs</strong></div>
                  <div className="flex justify-between"><span>Bus Traffic:</span><strong className="text-emerald-700">5.2 Gbps (-72%)</strong></div>
                </div>
                <div className="text-[9.5px] font-sans text-neutral-700 pt-1 border-t border-indigo-200">
                  <strong>Optimum Objective:</strong> Ultra-low latency edge event processing; high tolerance for stochastic ADC jitter.
                </div>
              </div>

              {/* Workload 2 */}
              <div className="p-3 border-2 border-purple-400 bg-purple-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <strong className="text-purple-950 uppercase text-xs">2. Physical-AI Trajectory</strong>
                  <span className="bg-purple-200 text-purple-900 text-[8.5px] px-1 font-bold">SAFETY-CRITICAL</span>
                </div>
                <div className="space-y-1 text-[10px] text-neutral-800">
                  <div className="flex justify-between"><span>Optimal Precision:</span><strong className="text-purple-900">INT8 CIM + FP32 VETO</strong></div>
                  <div className="flex justify-between"><span>CIM Utilization:</span><strong className="text-purple-900">65% (Hybrid)</strong></div>
                  <div className="flex justify-between"><span>Spike Sparsity:</span><strong className="text-purple-900">55%</strong></div>
                  <div className="flex justify-between"><span>Energy / MAC:</span><strong className="text-purple-900">2.10 nJ</strong></div>
                  <div className="flex justify-between"><span>Inference Latency:</span><strong className="text-purple-900">68 µs</strong></div>
                  <div className="flex justify-between"><span>Reality Drift Δ:</span><strong className="text-emerald-700">≤ 0.002 (Anchored)</strong></div>
                </div>
                <div className="text-[9.5px] font-sans text-neutral-700 pt-1 border-t border-purple-200">
                  <strong>Optimum Objective:</strong> Zero-violation physics constraints; dual-plane analog perception with digital truth gating.
                </div>
              </div>

              {/* Workload 3 */}
              <div className="p-3 border-2 border-teal-400 bg-teal-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <strong className="text-teal-950 uppercase text-xs">3. Scientific / Materials</strong>
                  <span className="bg-teal-200 text-teal-900 text-[8.5px] px-1 font-bold">HIGH-PRECISION</span>
                </div>
                <div className="space-y-1 text-[10px] text-neutral-800">
                  <div className="flex justify-between"><span>Optimal Precision:</span><strong className="text-teal-900">FP16 / FP32</strong></div>
                  <div className="flex justify-between"><span>CIM Utilization:</span><strong className="text-teal-900">45% (MRAM / ReRAM)</strong></div>
                  <div className="flex justify-between"><span>Spike Sparsity:</span><strong className="text-teal-900">30%</strong></div>
                  <div className="flex justify-between"><span>Energy / MAC:</span><strong className="text-teal-900">3.40 nJ</strong></div>
                  <div className="flex justify-between"><span>Inference Latency:</span><strong className="text-teal-900">110 µs</strong></div>
                  <div className="flex justify-between"><span>Memory Retention:</span><strong className="text-emerald-700">&gt;10 Years (NAND)</strong></div>
                </div>
                <div className="text-[9.5px] font-sans text-neutral-700 pt-1 border-t border-teal-200">
                  <strong>Optimum Objective:</strong> Analytical exactness, crystal-structure invariant retention, multi-decade experience logging.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: 7 HARDWARE/SOFTWARE CO-DESIGN DISCOVERIES */}
      {activeSubView === 'co_design_rules' && (
        <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1A1A1A] pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-widest block">
                SCIENTIFIC DISCOVERY ENGINE
              </span>
              <h3 className="text-base font-serif font-black uppercase text-neutral-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                7 Discovered Hardware/Software Co-Design Rules
              </h3>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 text-[9.5px] font-mono">
              {(['ALL', 'CONFIRMED', 'SIMULATION_VALIDATED'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setDiscoveryFilter(f)}
                  className={`px-2.5 py-1 border cursor-pointer font-bold ${
                    discoveryFilter === f
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-white text-neutral-700 border-neutral-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left list of discovery cards */}
            <div className="lg:col-span-5 space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {filteredDiscoveries.map((disc) => {
                const isSelected = selectedDiscoveryId === disc.id;
                return (
                  <button
                    key={disc.id}
                    onClick={() => {
                      setSelectedDiscoveryId(disc.id);
                      onLogEvent(`[CO-DESIGN] Selected Discovery #${disc.discoveryNumber}: ${disc.title}`, 'info');
                    }}
                    className={`w-full p-3 border-2 text-left transition cursor-pointer flex flex-col justify-between space-y-1.5 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-[2px_2px_0px_0px_rgba(79,70,229,1)]'
                        : 'border-neutral-300 bg-white hover:border-neutral-500'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[9px]">
                      <span className="font-black text-indigo-900">DISCOVERY #{disc.discoveryNumber}</span>
                      <span className={`px-1.5 py-0.2 font-bold ${
                        disc.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {disc.status}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-xs text-neutral-900">{disc.title}</h4>
                    <p className="text-[10px] font-sans text-neutral-600 line-clamp-2">
                      "{disc.question}"
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Right selected discovery deep dive */}
            <div className="lg:col-span-7 bg-[#FCFAF7] border-2 border-[#1A1A1A] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-300 pb-2">
                <div>
                  <span className="text-[9px] font-mono font-bold text-indigo-700 uppercase">
                    Discovery #{selectedDiscoveryObj.discoveryNumber} Breakdown
                  </span>
                  <h4 className="font-serif font-black uppercase text-sm text-neutral-900">
                    {selectedDiscoveryObj.title}
                  </h4>
                </div>
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 text-[9px] font-mono font-bold uppercase">
                  {selectedDiscoveryObj.status}
                </span>
              </div>

              <div className="space-y-2 text-xs font-sans">
                <div className="bg-white p-2.5 border border-neutral-300">
                  <span className="text-[9.5px] font-mono font-bold text-neutral-500 uppercase block mb-0.5">Scientific Question</span>
                  <strong className="text-neutral-900 font-serif text-xs">"{selectedDiscoveryObj.question}"</strong>
                </div>

                <div className="bg-white p-2.5 border border-neutral-300 space-y-1">
                  <span className="text-[9.5px] font-mono font-bold text-indigo-700 uppercase block">Discovered Co-Design Rule</span>
                  <p className="text-neutral-800 leading-relaxed font-normal">{selectedDiscoveryObj.discoveredRule}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[10px]">
                  <div className="bg-emerald-50/80 p-2.5 border border-emerald-300">
                    <span className="text-emerald-900 font-bold block text-[9px] uppercase">Quantitative Metric:</span>
                    <span className="text-emerald-950 font-bold">{selectedDiscoveryObj.quantitativeMetric}</span>
                  </div>
                  <div className="bg-indigo-50/80 p-2.5 border border-indigo-300">
                    <span className="text-indigo-900 font-bold block text-[9px] uppercase">Scientific Impact:</span>
                    <span className="text-indigo-950">{selectedDiscoveryObj.scientificImpact}</span>
                  </div>
                </div>

                {selectedDiscoveryObj.id === 'disc_noise_as_resource' && (
                  <div className="bg-[#121212] p-2.5 border border-indigo-950 text-emerald-400 font-mono text-[10px] space-y-1">
                    <div className="flex justify-between text-[9px] text-indigo-300 border-b border-neutral-800 pb-1">
                      <span>Controlled Stochasticity Scientific Record</span>
                      <span className="text-emerald-400">TESTABLE HYPOTHESIS PASS</span>
                    </div>
                    <pre>{JSON.stringify(CONTROLLED_STOCHASTICITY_TELEMETRY, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 6: OMEGA CIM COMPILER PIPELINE */}
      {activeSubView === 'compiler_pipeline' && (
        <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
          <div className="border-b border-[#1A1A1A] pb-3">
            <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-widest block">
              HARDWARE-AWARE SOFTWARE STACK
            </span>
            <h3 className="text-base font-serif font-black uppercase text-neutral-900 flex items-center gap-2">
              <Binary className="w-4 h-4 text-indigo-600" />
              OMEGA Full-Stack CIM Compiler Pipeline
            </h3>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed mt-1">
              Coordinated model placement, layer sensitivity analysis, spike conversion, and physical tile mapping while accounting for hardware nonidealities (ADC conversion noise, DAC resolution, and thermal variation).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {CIM_COMPILER_PIPELINE.map((stage) => {
              const isSelected = activeCompilerStage === stage.stepNumber;
              return (
                <button
                  key={stage.stepNumber}
                  onClick={() => {
                    setActiveCompilerStage(stage.stepNumber);
                    onLogEvent(`[CIM-COMPILER] Inspected Stage ${stage.stepNumber}: ${stage.name}`, 'info');
                  }}
                  className={`p-2.5 border-2 text-left transition cursor-pointer flex flex-col justify-between h-24 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-[2px_2px_0px_0px_rgba(79,70,229,1)]'
                      : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[9px]">
                    <span className="font-bold text-neutral-500">STAGE {stage.stepNumber}</span>
                    <span className="text-emerald-700 font-bold">✓ {stage.status}</span>
                  </div>
                  <strong className="font-mono text-[10.5px] uppercase text-neutral-900">{stage.name}</strong>
                  <span className="text-[8.5px] font-mono text-indigo-800 truncate block">Artifact: {stage.outputArtifact}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-[#121212] text-neutral-200 p-4 border-2 border-[#1A1A1A] font-mono text-[10.5px] space-y-2">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-1.5 text-[9.5px]">
              <span className="font-bold text-indigo-400 uppercase">
                COMPILER STAGE #{activeCompilerStage} IR OUTPUT
              </span>
              <span className="text-emerald-400 font-bold">BITSTREAM READY • DETERMINISTIC</span>
            </div>
            <pre className="text-cyan-300 font-mono text-[10px] leading-relaxed">
{`// OMEGA-CIM-Compiler-v3.4.2 Target Bitstream Map
STAGE_${activeCompilerStage}: ${CIM_COMPILER_PIPELINE[activeCompilerStage - 1]?.name}
ARTIFACT: ${CIM_COMPILER_PIPELINE[activeCompilerStage - 1]?.outputArtifact}
OPTIMIZATION PASS:
  - MAC Precision Allocation: INT8 (Layers 1-4) | FP32 (Layers 5-6)
  - Tile Mapping: 128x128 10T SRAM-CIM Macro Array [Tiles 0..7]
  - ADC Sampling Frequency: 1.2 GHz @ 6-bit ENOB
  - Symbolic Governance Verification: PASSED (Zero-violation certificate signed)`}
            </pre>
          </div>
        </div>
      )}

      {/* VIEW 7: STRUCTURED SCIENTIFIC DISCOVERY JSON */}
      {activeSubView === 'scientific_json' && (
        <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-widest block">
                VERIFIED SCIENTIFIC DISCOVERY PAYLOAD
              </span>
              <h3 className="text-base font-serif font-black uppercase text-neutral-900 flex items-center gap-2">
                <FileJson className="w-4 h-4 text-indigo-600" />
                OMEGA Scientific Discovery Output (Self-Optimizing Co-Design)
              </h3>
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(JSON.stringify(discoveryOutput, null, 2));
                onLogEvent('[SCIENTIFIC-OUTPUT] Copied structured discovery JSON to clipboard.', 'info');
              }}
              className="bg-[#1A1A1A] hover:bg-neutral-800 text-white font-mono text-[9.5px] font-bold uppercase px-3 py-1 cursor-pointer"
            >
              Copy JSON
            </button>
          </div>

          <p className="text-xs text-neutral-600 font-sans leading-relaxed">
            Rather than simply predicting an accuracy percentage, OMEGA produces actionable hardware/software co-design discoveries verified against empirical simulation and physical sensor loops.
          </p>

          <div className="bg-[#121212] text-emerald-400 p-4 border-2 border-[#1A1A1A] font-mono text-[11px] overflow-x-auto shadow-inner">
            <pre>{JSON.stringify(discoveryOutput, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
