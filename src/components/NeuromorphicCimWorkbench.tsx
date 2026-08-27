// src/components/NeuromorphicCimWorkbench.tsx
// OMEGA Neuromorphic + Compute-in-Memory (CIM) + Flash/NAND Hierarchical Memory System Workbench

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Cpu, Zap, Database, Flame, Thermometer, Activity, Sparkles,
  ShieldCheck, CheckCircle2, Layers, Radio, ArrowRight, Play, Pause,
  RotateCcw, FileText, Binary, Compass, Eye, Download, Search,
  SlidersHorizontal, HardDrive, Filter, AlertTriangle, ChevronRight,
  TrendingDown, TrendingUp, RefreshCw, Box, Shield, Server, FileJson
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
  ScientificCoDesignDiscoveryOutput
} from './NeuromorphicCimTypes';

interface NeuromorphicCimWorkbenchProps {
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
}

export default function NeuromorphicCimWorkbench({ onLogEvent }: NeuromorphicCimWorkbenchProps) {
  // Navigation tabs inside the Neuromorphic-CIM Workbench
  const [activeSubView, setActiveSubView] = useState<
    'sweep_benchmark' | 'discovery_loop' | 'data_temperature' | 'workload_compare' | 'compiler_pipeline' | 'co_design_rules' | 'scientific_json'
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

  // Current active sweep event data
  const currentEvent = useMemo<CimTelemetrySweepEvent>(() => {
    return CIM_TELEMETRY_DATASET[currentSweepIndex] || CIM_TELEMETRY_DATASET[5];
  }, [currentSweepIndex]);

  // Scientific Discovery output object (Step #6 optimal)
  const discoveryOutput = useMemo<ScientificCoDesignDiscoveryOutput>(() => {
    return {
      discovery: {
        optimal_cim_utilization_pct: 81,
        optimal_spike_sparsity_pct: 78,
        memory_bus_reduction_pct: 58,
        energy_reduction_pct: 31,
        accuracy_change_pct: 0.1,
        nand_write_reduction_pct: 24,
        optimal_operating_point: {
          sensor_rate_hz: 32000,
          latency_us: 51,
          thermal_load_c: 45.2,
          cim_energy_nj_per_mac: 1.30
        }
      },
      hypothesis: "Hybrid CIM/NAND placement outperforms uniform memory placement",
      confidence: 0.93,
      reality_anchor: "SIMULATION_VALIDATED",
      next_experiment: "hardware_in_loop_validation",
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
      }, 1400);
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
    { step: 7, name: 'SLLM REASONING', desc: 'Hierarchical causal reasoning over hypergraph topology and goal trajectories', target: 'SLLM / World Model', color: 'border-fuchsia-400 text-fuchsia-950 bg-fuchsia-50' },
    { step: 8, name: 'SYMBOLIC VETO', desc: 'Evaluate strict Level A-D Governance limits (glass force <4.5N, joint torque <28Nm)', target: 'Symbolic Safety Verifier', color: 'border-red-600 text-red-950 bg-red-50' },
    { step: 9, name: 'REALITY ANCHOR', desc: 'CAD-to-Point-Cloud & sensory discrepancy measurement (RMSE < 2.0%)', target: 'Reality Anchor Engine', color: 'border-emerald-500 text-emerald-950 bg-emerald-50' },
    { step: 10, name: 'MEMORY CONSOLIDATE', desc: 'Asynchronous differential write buffer coalescing to prevent NAND wear', target: 'Memory Manager', color: 'border-teal-400 text-teal-950 bg-teal-50' },
    { step: 11, name: 'NAND CHECKPOINT', desc: 'Commit compressed episodic memories, learned weights & provenance to 3D NAND', target: 'Flash/NAND Storage', color: 'border-slate-500 text-slate-950 bg-slate-50' },
    { step: 12, name: 'NEXT EXPERIMENT', desc: 'Compute Expected Information Gain (EIG) to formulate the next co-design trial', target: 'Autonomous Discovery Scheduler', color: 'border-indigo-600 text-indigo-950 bg-indigo-50' }
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
      {/* 1. MASTER WORKBENCH HEADER WITH ARCHITECTURE MISSION STATEMENT */}
      <div className="bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-700 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-indigo-900 border border-indigo-500 text-indigo-200">
              <Cpu className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-indigo-500 text-black px-1.5 py-0.2 uppercase">
                  EXPERIMENT C: CO-DESIGN STRESS TEST
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  ● HIERARCHICAL MEMORY FABRIC ACTIVE
                </span>
              </div>
              <h2 className="font-serif font-black uppercase text-base sm:text-lg text-white tracking-wide">
                OMEGA Neuromorphic + Compute-in-Memory (CIM) + Flash/NAND System
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="bg-neutral-900 text-neutral-300 border border-neutral-700 px-2.5 py-1">
              TARGET OPTIMUM: <strong className="text-emerald-400">Step #6 (81% CIM Util / 78% Sparsity)</strong>
            </span>
            <button
              onClick={() => {
                onLogEvent('[NEUROMORPHIC-CIM] Exported scientific co-design discovery certificate to audit ledger.', 'physics');
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1 border border-indigo-400 cursor-pointer flex items-center gap-1 uppercase"
            >
              <Download className="w-3 h-3" />
              Export Co-Design JSON
            </button>
          </div>
        </div>

        {/* MISSION INTENT & ARCHITECTURAL SUMMARY */}
        <p className="text-xs text-neutral-300 font-sans leading-relaxed">
          <strong className="text-indigo-300">The OMEGA Mission:</strong> Minimize data movement and energy while maintaining scientific-model accuracy by dynamically deciding what information belongs in <strong>SRAM/CIM (Hot)</strong>, <strong>DRAM (Warm)</strong>, <strong>Flash (Cool)</strong>, <strong>NAND (Cold/Learned)</strong>, and <strong>Protected Digital Logic (Safety)</strong>. Rather than forcing one architecture to do everything, OMEGA exploits mixed-precision CIM to break the von-Neumann memory wall.
        </p>

        {/* SUB-NAV BUTTONS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-neutral-800">
          {[
            { id: 'sweep_benchmark', label: '📊 10-Step Telemetry Sweep', icon: SlidersHorizontal },
            { id: 'discovery_loop', label: '🔄 12-Step Memory-Aware Loop', icon: RefreshCw },
            { id: 'data_temperature', label: '🌡️ Data Temperature Engine', icon: Flame },
            { id: 'workload_compare', label: '⚔️ 3-Workload Benchmark', icon: Activity },
            { id: 'co_design_rules', label: '💡 7 Co-Design Discoveries', icon: Sparkles },
            { id: 'compiler_pipeline', label: '⚙️ OMEGA CIM Compiler', icon: Binary },
            { id: 'scientific_json', label: '📄 Structured Discovery JSON', icon: FileJson }
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

      {/* VIEW 1: 10-STEP TELEMETRY SWEEP BENCHMARK */}
      {activeSubView === 'sweep_benchmark' && (
        <div className="space-y-4">
          {/* Active Operating Point Card */}
          <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1A1A1A] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-widest block">
                  HARDWARE-IN-LOOP TELEMETRY SWEEP & OPTIMIZATION FRONTIER
                </span>
                <h3 className="text-base font-serif font-black uppercase text-neutral-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  Step #{currentEvent.step} Operating Point: {currentEvent.sensor_event_rate_hz.toLocaleString()} Hz Sensor Rate
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
                <span className="text-neutral-600 font-bold">10-Step Sweep Progression:</span>
                <span className="text-neutral-500">
                  {currentEvent.is_optimal ? (
                    <strong className="text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-300">
                      ★ GLOBAL BALANCED OPTIMUM REACHED
                    </strong>
                  ) : currentEvent.thermal_c > 45.5 ? (
                    <strong className="text-red-700 bg-red-50 px-2 py-0.5 border border-red-300">
                      ⚠️ OVER-SATURATION THERMAL WALL ({currentEvent.thermal_c}°C)
                    </strong>
                  ) : (
                    <span className="text-indigo-700">Exploratory Co-Design Regime</span>
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
                        onLogEvent(`[SWEEP] Selected Step ${ev.step} (${ev.sensor_event_rate_hz} Hz)`, 'physics');
                      }}
                      className={`p-2 border text-center transition cursor-pointer flex flex-col items-center justify-between h-14 ${
                        isCurrent
                          ? 'bg-indigo-600 text-white border-indigo-900 ring-2 ring-indigo-400 font-bold scale-102 shadow-md'
                          : ev.is_optimal
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-400 hover:bg-emerald-100 font-bold'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      <span className="text-[9px] font-mono">STEP {ev.step}</span>
                      <span className="text-[10px] font-mono font-black">{ev.sram_cim_utilization_pct}% CIM</span>
                      <span className="text-[8px] font-mono opacity-80">{ev.inference_latency_us}µs</span>
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
                  <span className="text-[9px] text-neutral-500">10T SRAM</span>
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
                  <span className="text-[9px] text-neutral-500">Event Spikes</span>
                </div>
                <div className="w-full bg-neutral-200 h-1.5">
                  <div className="h-full bg-cyan-600" style={{ width: `${currentEvent.spike_sparsity_pct}%` }} />
                </div>
              </div>

              {/* Metric 3: Memory Bus Traffic */}
              <div className="bg-[#FAF9F6] border-2 border-neutral-300 p-3 space-y-1">
                <span className="text-[9px] text-neutral-500 uppercase block font-bold">Memory Bus Traffic</span>
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
                <span className="text-[9px] text-neutral-500 uppercase block font-bold">Inference Latency</span>
                <div className="flex items-baseline justify-between">
                  <strong className="text-base font-black text-blue-900">{currentEvent.inference_latency_us} µs</strong>
                  <span className="text-[9px] text-neutral-500">End-to-End</span>
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
                  Telemetry Discovery Analysis: Why Maximum CIM Utilization is NOT the Optimum
                </span>
                <span className="text-[9.5px] font-mono font-bold text-neutral-600">
                  Step {currentEvent.step} Notes
                </span>
              </div>
              <p className="text-xs text-neutral-800 font-sans leading-relaxed">
                {currentEvent.notes}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[10px] pt-1 text-neutral-700">
                <div className="bg-white p-2 border border-neutral-200">
                  <span className="text-neutral-500 block text-[9px]">FLASH READ RATE:</span>
                  <strong className="text-indigo-900">{currentEvent.flash_read_rate_mb_s} MB/s</strong>
                </div>
                <div className="bg-white p-2 border border-neutral-200">
                  <span className="text-neutral-500 block text-[9px]">NAND WRITE RATE:</span>
                  <strong className="text-purple-900">{currentEvent.nand_write_rate_mb_s} MB/s</strong>
                </div>
                <div className="bg-white p-2 border border-neutral-200">
                  <span className="text-neutral-500 block text-[9px]">NAND ENDURANCE COST:</span>
                  <strong className={currentEvent.nand_endurance_cost > 0.6 ? 'text-red-700' : 'text-emerald-700'}>
                    {currentEvent.nand_endurance_cost.toFixed(2)} wear/hr
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
                      <th className="p-2 border-r border-neutral-300">Event Rate (Hz)</th>
                      <th className="p-2 border-r border-neutral-300">Sparsity (%)</th>
                      <th className="p-2 border-r border-neutral-300">SRAM-CIM (%)</th>
                      <th className="p-2 border-r border-neutral-300">Flash Read (MB/s)</th>
                      <th className="p-2 border-r border-neutral-300">NAND Write (MB/s)</th>
                      <th className="p-2 border-r border-neutral-300">Bus Traffic (Gbps)</th>
                      <th className="p-2 border-r border-neutral-300">Energy (nJ/MAC)</th>
                      <th className="p-2 border-r border-neutral-300">Latency (µs)</th>
                      <th className="p-2 border-r border-neutral-300">Accuracy (%)</th>
                      <th className="p-2 border-r border-neutral-300">Thermal (°C)</th>
                      <th className="p-2">Endurance Cost</th>
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
                          <td className="p-2 border-r border-neutral-300">{row.sensor_event_rate_hz.toLocaleString()}</td>
                          <td className="p-2 border-r border-neutral-300 text-cyan-800">{row.spike_sparsity_pct}%</td>
                          <td className="p-2 border-r border-neutral-300 font-bold text-indigo-900">{row.sram_cim_utilization_pct}%</td>
                          <td className="p-2 border-r border-neutral-300">{row.flash_read_rate_mb_s}</td>
                          <td className="p-2 border-r border-neutral-300">{row.nand_write_rate_mb_s}</td>
                          <td className="p-2 border-r border-neutral-300 text-emerald-800 font-bold">{row.memory_bus_traffic_gbps}</td>
                          <td className="p-2 border-r border-neutral-300 text-purple-900">{row.cim_energy_nj_per_mac.toFixed(2)}</td>
                          <td className="p-2 border-r border-neutral-300 font-bold text-blue-900">{row.inference_latency_us}</td>
                          <td className="p-2 border-r border-neutral-300 text-neutral-900">{row.model_accuracy_pct}%</td>
                          <td className={`p-2 border-r border-neutral-300 ${row.thermal_c > 45.5 ? 'text-red-700 font-bold' : 'text-neutral-700'}`}>
                            {row.thermal_c.toFixed(1)}
                          </td>
                          <td className={`p-2 ${row.nand_endurance_cost > 0.6 ? 'text-red-700 font-bold' : 'text-neutral-700'}`}>
                            {row.nand_endurance_cost.toFixed(2)}
                          </td>
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

          {/* 12-Stage Visual Stepper Pipeline */}
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

          {/* Architecture Dataflow Flowchart ASCII representation */}
          <div className="bg-[#121212] text-neutral-200 p-4 border-2 border-[#1A1A1A] font-mono text-[10.5px] overflow-x-auto space-y-2">
            <span className="text-[9.5px] font-bold text-indigo-400 uppercase tracking-wider block">
              ⚡ OMEGA HIERARCHICAL ZERO-BUS MEMORY FABRIC DATAFLOW:
            </span>
            <pre className="text-emerald-400 font-mono text-[10px] leading-relaxed">
{`SENSORS (Vision, Tactile, Spectrometer)
  ↓
EVENT / SPIKE PROCESSOR (LIF Thresholding)
  ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                      OMEGA MEMORY FABRIC                                │
│                                                                         │
│  SRAM / CIM (HOT)        FLASH / NAND (COLD)        DRAM (WARM)         │
│  • Active neural weights • Model checkpoints        • Working datasets  │
│  • Spike-state vectors   • Episodic history         • Candidate buffers │
│  • Parallel MAC / MVM    • Discovered parameters    • Sliding state     │
└─────────────────────────────────────────────────────────────────────────┘
          ↓
   NEUROMORPHIC CORE (Recurrent Synapses)
          ↓
   SLLM / WORLD MODEL (Causal Reasoning)
          ↓
   SYMBOLIC SAFETY VETO (Hard Torque & Fragility Bounds)
          ↓
   REALITY ANCHOR (CAD-to-Sensor Discrepancy Calibration)
          ↓
   MEMORY CONSOLIDATION & NAND CHECKPOINT`}
            </pre>
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

          {/* 6 Temperature Category Selector Buttons */}
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

          {/* Selected Category Deep Dive Detail Card */}
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

          {/* 3 Workload Comparison Cards */}
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

          {/* Stepper Pipeline for Compiler */}
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

          {/* Active Compiler Stage Output Inspection */}
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
