// src/components/PhysicalAiWorldModelViewer.tsx
import React, { useState } from 'react';
import {
  Layers, Radio, Activity, ShieldCheck, AlertTriangle, Eye, Database,
  Cpu, ArrowRight, CornerDownRight, CheckCircle, Network, Zap, Shield,
  GitBranch, RefreshCw, Box, FastForward, Play, Pause, Compass, Check,
  FileText, Key, Sparkles, Scale, Info, Crosshair
} from 'lucide-react';
import {
  DETERMINISTIC_WORLD_STATE_TIMELINE,
  DYNAMIC_HYPERGRAPH_TRANSITIONS,
  IMAGINATION_COUNTERFACTUAL_FUTURES,
  SIM_TO_REAL_CALIBRATION_DATA,
  DETERMINISTIC_ACTION_RESULT,
  HIERARCHICAL_SKILL_MEMORY_NODES,
  MASTER_PROVENANCE_AUDIT,
  WorldStateFrame
} from './PhysicalAiWorldStateTypes';

// Import image assets
import cellRenderImg from '../assets/images/robotic_dishwasher_cell_1787637177751.jpg';
import tactileRenderImg from '../assets/images/gelsight_tactile_render_1787637192815.jpg';
import pointcloudRenderImg from '../assets/images/spatial_pointcloud_render_1787637208235.jpg';

interface PhysicalAiWorldModelViewerProps {
  activeTimeMs?: number;
  onSelectTimeMs?: (timeMs: number) => void;
  onLogEvent?: (details: string, type: 'info' | 'physics' | 'interaction') => void;
}

export default function PhysicalAiWorldModelViewer({
  activeTimeMs = 0,
  onSelectTimeMs,
  onLogEvent
}: PhysicalAiWorldModelViewerProps) {
  // Navigation tabs for the world model
  const [worldModelTab, setWorldModelTab] = useState<
    'timeline_states' | 'two_layer_world' | 'dynamic_hypergraph' | 'uncertainty_propagation' | 'imagination_futures' | 'sim_to_real' | 'skill_memory' | 'provenance'
  >('timeline_states');

  // Sub-tab for two-layer world
  const [twoLayerMode, setTwoLayerMode] = useState<'geometric' | 'scientific'>('geometric');
  
  // Selected counterfactual future
  const [selectedFuture, setSelectedFuture] = useState<'ACTION_A' | 'ACTION_B' | 'ACTION_C'>('ACTION_B');

  // Gaussian Splat render toggle
  const [enableGaussianSplats, setEnableGaussianSplats] = useState<boolean>(true);
  
  // Active World State lookup
  const selectedWorldState: WorldStateFrame = DETERMINISTIC_WORLD_STATE_TIMELINE.find(
    ws => ws.timestamp_ms === activeTimeMs
  ) || DETERMINISTIC_WORLD_STATE_TIMELINE[0];

  const handleTimeSelect = (t: number) => {
    if (onSelectTimeMs) {
      onSelectTimeMs(t);
    }
    if (onLogEvent) {
      onLogEvent(`[WORLD STATE] Switched active world frame to timestamp t=${t}ms (${selectedWorldState.world_state_id})`, 'interaction');
    }
  };

  return (
    <div className="bg-[#FAF9F6] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-[#1A1A1A] font-sans">
      
      {/* Top Banner: Cosmos 3 / Marble Physical World Model Core */}
      <div className="p-3.5 bg-[#1A1A1A] text-white flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#1A1A1A]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-500 text-black flex items-center justify-center font-mono font-black text-sm border border-emerald-300">
            Ω
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-black uppercase text-sm tracking-wide text-white">
                OMEGA Physical World-Model Architecture
              </h3>
              <span className="bg-emerald-950 text-emerald-300 text-[9px] font-mono font-bold px-1.5 py-0.5 border border-emerald-700">
                CLOSED-LOOP ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-mono">
              Pixels → 3D World → Spatio-Temporal Prediction → Symbolic VETO → Reality Anchor → Skill Prior
            </p>
          </div>
        </div>

        {/* Current Active World State Chip */}
        <div className="flex items-center gap-2 bg-neutral-900 px-3 py-1 border border-neutral-700 font-mono text-xs">
          <span className="text-neutral-400 text-[10px] uppercase">World State ID:</span>
          <span className="text-emerald-400 font-black">{selectedWorldState.world_state_id}</span>
          <span className="text-neutral-500">|</span>
          <span className="text-neutral-300 font-bold">t = {selectedWorldState.timestamp_ms} ms</span>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="bg-[#F5F2ED] border-b-2 border-[#1A1A1A] p-2 flex flex-wrap gap-1.5 overflow-x-auto">
        {[
          { id: 'timeline_states', label: '1. WS_ID Timeline & Objects', icon: Activity },
          { id: 'two_layer_world', label: '2. Two-Layer World Model', icon: Layers },
          { id: 'dynamic_hypergraph', label: '3. Dynamic Hypergraph (t0-t5)', icon: Network },
          { id: 'uncertainty_propagation', label: '4. Uncertainty & Safety Margin', icon: Shield },
          { id: 'imagination_futures', label: '5. Counterfactual Imagination', icon: GitBranch },
          { id: 'sim_to_real', label: '6. Sim-to-Real Reality Anchor', icon: RefreshCw },
          { id: 'skill_memory', label: '7. Hierarchical Skill Memory', icon: Database },
          { id: 'provenance', label: '8. Scientific Lineage & Audit', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = worldModelTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setWorldModelTab(tab.id as any);
                if (onLogEvent) {
                  onLogEvent(`[NAV] Switched world model view to ${tab.label}`, 'interaction');
                }
              }}
              className={`px-2.5 py-1.5 text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 cursor-pointer border ${
                isActive
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]'
                  : 'bg-white text-neutral-800 border-neutral-300 hover:border-[#1A1A1A] hover:bg-neutral-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-neutral-600'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREA */}
      <div className="p-4 space-y-4">
        
        {/* ========================================================= */}
        {/* TAB 1: WORLD_STATE_ID TIMELINE & OBJECT TRACKING           */}
        {/* ========================================================= */}
        {worldModelTab === 'timeline_states' && (
          <div className="space-y-4">
            
            {/* Explanatory Header */}
            <div className="p-3 bg-white border border-neutral-300 flex items-start gap-3">
              <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-black uppercase text-xs text-[#1A1A1A]">
                  Persistent Physical Timeline: WS_000040 → WS_000041 → WS_000042 → WS_000043 → WS_000044
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  Every synchronized multi-modal observation produces an immutable, uniquely indexed World State (<code className="font-mono bg-neutral-100 px-1 font-bold">WORLD_STATE_ID</code>). This preserves temporal causality and object permanence across the trajectory.
                </p>
              </div>
            </div>

            {/* Timeline Stepper Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {DETERMINISTIC_WORLD_STATE_TIMELINE.map((ws) => {
                const isSelected = ws.timestamp_ms === selectedWorldState.timestamp_ms;
                return (
                  <button
                    key={ws.world_state_id}
                    onClick={() => handleTimeSelect(ws.timestamp_ms)}
                    className={`p-2.5 text-left border-2 transition cursor-pointer font-mono ${
                      isSelected
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-neutral-900 border-neutral-300 hover:border-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[10px] font-black ${isSelected ? 'text-emerald-400' : 'text-indigo-800'}`}>
                        {ws.world_state_id}
                      </span>
                      <span className="text-[9px] px-1 py-0.2 bg-neutral-200 text-neutral-800 font-bold">
                        {ws.timestamp_ms} ms
                      </span>
                    </div>
                    <div className="text-[10px] truncate">
                      Torque: <span className="font-bold">{ws.robot_state.joint_torque_peak} Nm</span>
                    </div>
                    <div className="text-[9px] text-neutral-500">
                      Slip Prob: {(ws.tactile.slip_probability * 100).toFixed(0)}%
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Temporal Perception Delta Box ("What changed between frame t-1 and frame t?") */}
            <div className="p-3.5 bg-indigo-50 border-2 border-indigo-900 shadow-[2px_2px_0px_0px_rgba(49,46,129,1)]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] uppercase font-bold text-indigo-900 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-indigo-700" />
                  Temporal Perception: What Changed Since Previous Frame?
                </span>
                <span className="text-[9px] font-mono bg-indigo-200 text-indigo-950 px-2 py-0.5 font-bold">
                  Δt = 5-15 ms
                </span>
              </div>
              <p className="text-xs text-indigo-950 font-medium font-sans">
                {selectedWorldState.temporal_delta.delta_description}
              </p>
              {selectedWorldState.temporal_delta.causal_event_triggered && (
                <div className="mt-2 inline-flex items-center gap-1.5 bg-amber-200 text-amber-900 px-2 py-0.5 text-[10px] font-mono font-bold border border-amber-400">
                  <AlertTriangle className="w-3 h-3 text-amber-800" />
                  <span>REFLEX TRIGGERED: {selectedWorldState.temporal_delta.causal_event_triggered}</span>
                </div>
              )}
            </div>

            {/* 3D Tracked Objects Table */}
            <div className="bg-white border-2 border-[#1A1A1A] p-3 space-y-2">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
                <h5 className="font-serif font-black uppercase text-xs text-[#1A1A1A] flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-neutral-800" />
                  Tracked Physical Objects in {selectedWorldState.world_state_id}
                </h5>
                <span className="text-[10px] font-mono text-neutral-500">Coordinate Frame: Robot Base (mm)</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 border-b border-neutral-300 text-[10px] text-neutral-700 uppercase">
                      <th className="p-2">Object ID</th>
                      <th className="p-2">Class</th>
                      <th className="p-2">Position [X, Y, Z] (mm)</th>
                      <th className="p-2">Velocity [Vx, Vy, Vz]</th>
                      <th className="p-2">Covariance σ</th>
                      <th className="p-2">Material / Fragility</th>
                      <th className="p-2">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedWorldState.objects.map((obj) => (
                      <tr key={obj.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                        <td className="p-2 font-bold text-black">{obj.id}</td>
                        <td className="p-2 uppercase text-[10px]">{obj.class}</td>
                        <td className="p-2 text-indigo-700 font-bold">[{obj.position.join(', ')}]</td>
                        <td className="p-2 text-neutral-600">[{obj.velocity.join(', ')}]</td>
                        <td className="p-2 text-neutral-500">±[{obj.covariance_sigma.join(', ')}]</td>
                        <td className="p-2 text-neutral-800">
                          {obj.material.name} (Fragility: {obj.material.fragility})
                        </td>
                        <td className="p-2 text-emerald-700 font-bold">{(obj.confidence * 100).toFixed(0)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ambient Acoustic / Audio Perception Stream */}
            <div className="bg-[#1A1A1A] text-white p-3 border border-neutral-700 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Ambient Hydrophone Acoustic</span>
                <span className="font-mono text-base font-black text-emerald-400">{selectedWorldState.audio.amplitude_db} dB</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Spectral Centroid</span>
                <span className="font-mono text-base font-black text-neutral-200">{selectedWorldState.audio.frequency_centroid_hz} Hz</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Acoustic Event Classification</span>
                <span className={`font-mono text-xs font-bold uppercase px-2 py-0.5 inline-block ${
                  selectedWorldState.audio.classification === 'slip_chatter'
                    ? 'bg-amber-500 text-black'
                    : 'bg-neutral-800 text-emerald-300'
                }`}>
                  {selectedWorldState.audio.classification}
                </span>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: TWO-LAYER WORLD MODEL (GEOMETRIC VS SCIENTIFIC)    */}
        {/* ========================================================= */}
        {worldModelTab === 'two_layer_world' && (
          <div className="space-y-4">
            
            {/* Architecture Overview Diagram */}
            <div className="p-3.5 bg-neutral-900 text-white border-2 border-neutral-800">
              <div className="font-mono text-[10px] text-emerald-400 uppercase font-bold mb-2">
                Dual-Layer Physical World Model Architecture (Marble + Cosmos 3 Paradigm)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className={`p-3 border transition cursor-pointer ${
                  twoLayerMode === 'geometric' ? 'bg-neutral-800 border-emerald-400' : 'bg-neutral-950 border-neutral-800'
                }`} onClick={() => setTwoLayerMode('geometric')}>
                  <div className="flex items-center justify-between font-bold text-white mb-1">
                    <span className="flex items-center gap-1.5">
                      <Box className="w-3.5 h-3.5 text-emerald-400" />
                      1. GEOMETRIC WORLD
                    </span>
                    <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5">Spatial Layer</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 font-sans">
                    Point clouds, meshes, 3D Gaussian splats, depth maps, multi-camera calibrated frustums. Visual & spatial rendering substrate.
                  </p>
                </div>

                <div className={`p-3 border transition cursor-pointer ${
                  twoLayerMode === 'scientific' ? 'bg-neutral-800 border-emerald-400' : 'bg-neutral-950 border-neutral-800'
                }`} onClick={() => setTwoLayerMode('scientific')}>
                  <div className="flex items-center justify-between font-bold text-white mb-1">
                    <span className="flex items-center gap-1.5">
                      <Network className="w-3.5 h-3.5 text-indigo-400" />
                      2. SCIENTIFIC WORLD
                    </span>
                    <span className="text-[9px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5">Causal Layer</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 font-sans">
                    Objects, physical material properties, dynamic hypergraphs, state tensors, causal constraints, formal uncertainty margins.
                  </p>
                </div>
              </div>
            </div>

            {/* View Layer Content */}
            {twoLayerMode === 'geometric' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-black uppercase text-xs text-[#1A1A1A]">
                    Geometric Representations & Multi-Camera Inputs
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-neutral-700">3D Gaussian Splats:</span>
                    <button
                      onClick={() => setEnableGaussianSplats(!enableGaussianSplats)}
                      className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase transition border ${
                        enableGaussianSplats
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-neutral-200 text-neutral-700 border-neutral-400'
                      }`}
                    >
                      {enableGaussianSplats ? 'Gaussian Splats (4,800 Ellipsoids) ✓' : 'Mesh Only'}
                    </button>
                  </div>
                </div>

                {/* 3 Camera Feeds Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="border border-neutral-300 bg-white p-2">
                    <div className="flex justify-between text-[10px] font-mono font-bold text-neutral-700 mb-1">
                      <span>CAM 01: OVERHEAD RGB</span>
                      <span className="text-emerald-700">60 FPS CALIBRATED</span>
                    </div>
                    <img src={cellRenderImg} alt="Cell RGB" className="w-full h-32 object-cover border border-neutral-200" />
                    <span className="text-[9px] font-mono text-neutral-500 mt-1 block">Pose: [0, 0, 1200] mm • FOV: 78°</span>
                  </div>

                  <div className="border border-neutral-300 bg-white p-2">
                    <div className="flex justify-between text-[10px] font-mono font-bold text-neutral-700 mb-1">
                      <span>CAM 02: EYE-IN-HAND / TACTILE</span>
                      <span className="text-emerald-700">200 Hz SYNCED</span>
                    </div>
                    <img src={tactileRenderImg} alt="Tactile Feed" className="w-full h-32 object-cover border border-neutral-200" />
                    <span className="text-[9px] font-mono text-neutral-500 mt-1 block">Elastomer Micro-Shear Displacement</span>
                  </div>

                  <div className="border border-neutral-300 bg-white p-2">
                    <div className="flex justify-between text-[10px] font-mono font-bold text-neutral-700 mb-1">
                      <span>LIDAR: SPATIAL POINT CLOUD</span>
                      <span className="text-indigo-700">0.15mm DENSE</span>
                    </div>
                    <img src={pointcloudRenderImg} alt="LiDAR Point Cloud" className="w-full h-32 object-cover border border-neutral-200" />
                    <span className="text-[9px] font-mono text-neutral-500 mt-1 block">15 Synchronized Metrology Points</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-white p-4 border border-neutral-300">
                <h4 className="font-serif font-black uppercase text-xs text-[#1A1A1A]">
                  Scientific World Invariants & Grounding
                </h4>
                <p className="text-xs text-neutral-600 font-sans">
                  The sensors are the immutable ground truth. The SLLM does not speculate on geometry; it queries the structured state tensor and causal invariants.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-neutral-50 border border-neutral-300">
                    <span className="font-bold text-black block mb-1">Physical Invariant 1: Contact Force Limit</span>
                    <span className="text-neutral-600 text-[11px]">Normal force on soda-lime glass must not exceed 7.0 N (Failure yield threshold = 9.2 N).</span>
                  </div>
                  <div className="p-2.5 bg-neutral-50 border border-neutral-300">
                    <span className="font-bold text-black block mb-1">Physical Invariant 2: Clearance Buffer</span>
                    <span className="text-neutral-600 text-[11px]">Clearance to rack wire tines must maintain ≥ 50.0 mm including ±4.8 mm prediction sigma.</span>
                  </div>
                  <div className="p-2.5 bg-neutral-50 border border-neutral-300">
                    <span className="font-bold text-black block mb-1">Physical Invariant 3: Micro-Slip Dynamic Margin</span>
                    <span className="text-neutral-600 text-[11px]">GelSight shear acceleration must remain below 0.05 N/ms² under wet surface lubrication.</span>
                  </div>
                  <div className="p-2.5 bg-neutral-50 border border-neutral-300">
                    <span className="font-bold text-black block mb-1">Physical Invariant 4: Kinetic Energy Release</span>
                    <span className="text-neutral-600 text-[11px]">Zero residual relative velocity upon gripper release at seating position Z = 145 mm.</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: DYNAMIC HYPERGRAPH TRANSITIONS (t0 to t5)          */}
        {/* ========================================================= */}
        {worldModelTab === 'dynamic_hypergraph' && (
          <div className="space-y-4">
            
            <div className="p-3 bg-white border border-neutral-300 flex items-start gap-3">
              <div className="p-2 bg-indigo-50 border border-indigo-200 text-indigo-800 shrink-0">
                <Network className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-black uppercase text-xs text-[#1A1A1A]">
                  Dynamic Hypergraph: Time-Dependent Events and State Transitions
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  Edges in OMEGA are not static links. They represent active causal states, kinetic events, and formal invariants transitioning across the physical timeline:
                </p>
              </div>
            </div>

            {/* Hypergraph State Transition Timeline */}
            <div className="space-y-2.5">
              {DYNAMIC_HYPERGRAPH_TRANSITIONS.map((trans, idx) => (
                <div
                  key={trans.edge_id}
                  className={`p-3 border-2 font-mono text-xs transition ${
                    trans.status === 'active'
                      ? 'bg-amber-50 border-amber-700 shadow-[3px_3px_0px_0px_rgba(180,83,9,1)]'
                      : trans.status === 'completed'
                      ? 'bg-white border-neutral-800'
                      : 'bg-neutral-100 border-neutral-300 opacity-60'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-300 pb-1.5 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#1A1A1A] text-white px-2 py-0.5 font-bold text-[10px]">
                        {trans.time_key} ({trans.timestamp_ms} ms)
                      </span>
                      <span className="font-bold text-indigo-900 text-xs">
                        {trans.source_node} ── [{trans.relationship.toUpperCase()}] ── {trans.target_node}
                      </span>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 uppercase ${
                      trans.status === 'active'
                        ? 'bg-amber-200 text-amber-900'
                        : trans.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-neutral-200 text-neutral-700'
                    }`}>
                      {trans.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-neutral-500 text-[10px] uppercase block">Formal Invariant:</span>
                      <span className="text-neutral-900 font-bold">{trans.formal_invariant}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] uppercase block">Active Boundary Constraints:</span>
                      <span className="text-neutral-700">{trans.active_constraints.join(' • ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: UNCERTAINTY PROPAGATION & FORMAL SAFETY MARGIN     */}
        {/* ========================================================= */}
        {worldModelTab === 'uncertainty_propagation' && (
          <div className="space-y-4">
            
            {/* Uncertainty Pipeline Chain */}
            <div className="p-3.5 bg-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <h4 className="font-serif font-black uppercase text-xs text-[#1A1A1A]">
                  Full Uncertainty Propagation Chain
                </h4>
                <span className="text-[10px] font-mono bg-indigo-100 text-indigo-900 px-2 py-0.5 font-bold">
                  Rigorous Engineering Margin
                </span>
              </div>

              {/* Chain Diagram */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-center font-mono text-[10px]">
                <div className="p-2 bg-neutral-100 border border-neutral-300">
                  <span className="text-neutral-500 block">1. Sensor Uncertainty</span>
                  <span className="font-bold text-black text-xs">σ_meas = ±2.1 mm</span>
                </div>
                <div className="p-2 bg-neutral-100 border border-neutral-300">
                  <span className="text-neutral-500 block">2. World-State Covariance</span>
                  <span className="font-bold text-black text-xs">σ_world = ±2.8 mm</span>
                </div>
                <div className="p-2 bg-neutral-100 border border-neutral-300">
                  <span className="text-neutral-500 block">3. Prediction Uncertainty</span>
                  <span className="font-bold text-indigo-800 text-xs">σ_pred = ±4.8 mm</span>
                </div>
                <div className="p-2 bg-neutral-100 border border-neutral-300">
                  <span className="text-neutral-500 block">4. Action Uncertainty</span>
                  <span className="font-bold text-indigo-800 text-xs">σ_act = ±1.2 mm</span>
                </div>
                <div className="p-2 bg-amber-100 border border-amber-400">
                  <span className="text-amber-800 block font-bold">5. Safety Margin</span>
                  <span className="font-bold text-amber-950 text-xs">WORST CASE &lt; 50mm</span>
                </div>
              </div>
            </div>

            {/* Practical Example Explanation Card */}
            <div className="p-4 bg-amber-50 border-2 border-amber-800 shadow-[3px_3px_0px_0px_rgba(180,83,9,1)] space-y-2">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase font-mono">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Engineering Verdict: Why 52 mm &gt; 50 mm is Rejected</span>
              </div>
              <p className="text-xs text-amber-950 font-sans leading-relaxed">
                OMEGA does not naively reason: <code className="font-mono bg-amber-200/80 px-1 font-bold">52.0 mm &gt; 50.0 mm → SAFE</code>.
                Instead, OMEGA executes formal uncertainty propagation:
              </p>
              <div className="bg-white p-3 border border-amber-400 font-mono text-xs text-black space-y-1">
                <div>Measured Clearance: <strong>52.0 mm</strong></div>
                <div>Prediction Uncertainty (2σ): <strong>±4.8 mm</strong></div>
                <div>Worst-Case Bounds: <strong>52.0 mm - 4.8 mm = 47.2 mm</strong></div>
                <div>Safety Envelope Threshold: <strong>50.0 mm</strong></div>
                <div className="text-red-700 font-black pt-1 border-t border-neutral-200">
                  47.2 mm &lt; 50.0 mm → Insufficient Safety Buffer → Verdict: WARN / SYMBOLIC VETO
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: WORLD-MODEL IMAGINATION BRANCH (3 FUTURES)         */}
        {/* ========================================================= */}
        {worldModelTab === 'imagination_futures' && (
          <div className="space-y-4">
            
            <div className="p-3 bg-white border border-neutral-300 flex items-start gap-3">
              <div className="p-2 bg-purple-50 border border-purple-200 text-purple-800 shrink-0">
                <GitBranch className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-black uppercase text-xs text-[#1A1A1A]">
                  World-Model Imagination Branch (Counterfactual Futures Rollout)
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  Before commanding real hardware, OMEGA simulates candidate actions in parallel through MuJoCo, evaluating collision margins, contact forces, and symbolic invariants.
                </p>
              </div>
            </div>

            {/* 3 Candidate Futures Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {IMAGINATION_COUNTERFACTUAL_FUTURES.map((future) => {
                const isSelected = selectedFuture === future.candidate_id;
                return (
                  <div
                    key={future.candidate_id}
                    onClick={() => {
                      setSelectedFuture(future.candidate_id);
                      if (onLogEvent) {
                        onLogEvent(`[IMAGINATION] Inspected rollout for ${future.candidate_id} (${future.action_label})`, 'physics');
                      }
                    }}
                    className={`p-3.5 border-2 transition cursor-pointer font-sans space-y-2.5 ${
                      isSelected
                        ? 'bg-white border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-[#FAF9F6] border-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
                      <span className="font-mono font-bold text-xs text-indigo-900">{future.candidate_id}</span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase ${
                        future.symbolic_veto.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                          : 'bg-red-100 text-red-900 border border-red-400'
                      }`}>
                        {future.symbolic_veto.status}
                      </span>
                    </div>

                    <h5 className="font-bold text-xs text-black">{future.action_label}</h5>
                    <p className="text-[11px] text-neutral-600 leading-normal">{future.trajectory_strategy}</p>

                    {/* Predicted Metrics */}
                    <div className="bg-neutral-50 p-2 border border-neutral-200 font-mono text-[10px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Success Prob:</span>
                        <span className="font-bold text-emerald-700">{(future.predicted_outcome.success_probability * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Peak Torque:</span>
                        <span className="font-bold">{future.predicted_outcome.peak_torque_nm} Nm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Min Clearance:</span>
                        <span className="font-bold">{future.predicted_outcome.minimum_clearance_mm} mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Slip Prob:</span>
                        <span className="font-bold">{(future.predicted_outcome.slip_probability * 100).toFixed(0)}%</span>
                      </div>
                    </div>

                    {/* VETO / Approval Reason */}
                    {future.symbolic_veto.veto_reason && (
                      <div className="p-2 bg-red-50 border border-red-200 text-[10px] text-red-800 font-mono">
                        ⚠️ {future.symbolic_veto.veto_reason}
                      </div>
                    )}
                    {future.is_selected_best_action && (
                      <div className="p-2 bg-emerald-50 border border-emerald-300 text-[10px] text-emerald-900 font-mono font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                        <span>OPTIMAL POLICY SELECTED</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: SIM-TO-REAL REALITY ANCHOR CALIBRATION             */}
        {/* ========================================================= */}
        {worldModelTab === 'sim_to_real' && (
          <div className="space-y-4">
            
            <div className="p-3 bg-white border border-neutral-300 flex items-start gap-3">
              <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-black uppercase text-xs text-[#1A1A1A]">
                  Closed-Loop Reality Anchor & Sim-to-Real Calibration
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  Prediction error is directly quantified against physical sensors to calibrate simulation dynamics and prevent drift:
                </p>
              </div>
            </div>

            {/* Error Metric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-white border-2 border-neutral-800">
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">Rack Clearance Error</span>
                <div className="flex justify-between items-baseline mt-1 font-mono">
                  <span className="text-xs text-neutral-700">Pred: 55.2 mm</span>
                  <span className="text-xs text-neutral-700">Meas: 52.0 mm</span>
                </div>
                <div className="text-sm font-mono font-black text-amber-700 mt-1">
                  Δ Error = -3.2 mm (Overestimated)
                </div>
              </div>

              <div className="p-3 bg-white border-2 border-neutral-800">
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">GelSight Grip Force Error</span>
                <div className="flex justify-between items-baseline mt-1 font-mono">
                  <span className="text-xs text-neutral-700">Pred: 5.8 N</span>
                  <span className="text-xs text-neutral-700">Meas: 6.1 N</span>
                </div>
                <div className="text-sm font-mono font-black text-emerald-700 mt-1">
                  Δ Error = +0.3 N (Calibrated)
                </div>
              </div>

              <div className="p-3 bg-white border-2 border-neutral-800">
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">Slip Probability Error</span>
                <div className="flex justify-between items-baseline mt-1 font-mono">
                  <span className="text-xs text-neutral-700">Pred: 58%</span>
                  <span className="text-xs text-neutral-700">Meas: 63%</span>
                </div>
                <div className="text-sm font-mono font-black text-indigo-700 mt-1">
                  Δ Error = +5% (Dynamic Wetness)
                </div>
              </div>
            </div>

            {/* Learned Calibration Rule */}
            <div className="p-3.5 bg-neutral-900 text-white border-2 border-neutral-800 font-mono text-xs space-y-1.5">
              <span className="text-emerald-400 text-[10px] uppercase font-bold">Learned Reality Anchor Rule</span>
              <p className="text-neutral-200 leading-relaxed">
                "{SIM_TO_REAL_CALIBRATION_DATA.learned_calibration_offset}"
              </p>
              <div className="text-[10px] text-neutral-400 pt-1 border-t border-neutral-700 flex justify-between">
                <span>Confidence: {(SIM_TO_REAL_CALIBRATION_DATA.reality_anchor_confidence * 100).toFixed(1)}%</span>
                <span>Converged after {SIM_TO_REAL_CALIBRATION_DATA.iterations_converged} physical episodes</span>
              </div>
            </div>

            {/* Explicit ACTION_RESULT Block */}
            <div className="bg-white border-2 border-[#1A1A1A] p-3 space-y-2">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-1">
                <span className="font-mono text-xs font-bold text-indigo-900">
                  ACTION_RESULT: {DETERMINISTIC_ACTION_RESULT.action_id}
                </span>
                <span className="text-[9px] font-mono bg-emerald-100 text-emerald-900 px-1.5 py-0.5 font-bold">
                  PROMOTED TO SKILL MEMORY ✓
                </span>
              </div>
              <pre className="bg-neutral-50 p-2.5 text-[10px] font-mono text-neutral-800 overflow-x-auto border border-neutral-200">
{JSON.stringify(DETERMINISTIC_ACTION_RESULT, null, 2)}
              </pre>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: HIERARCHICAL SKILL MEMORY                          */}
        {/* ========================================================= */}
        {worldModelTab === 'skill_memory' && (
          <div className="space-y-4">
            
            <div className="p-3 bg-white border border-neutral-300 flex items-start gap-3">
              <div className="p-2 bg-indigo-50 border border-indigo-200 text-indigo-800 shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-black uppercase text-xs text-[#1A1A1A]">
                  Hierarchical Skill Memory: Experiment → Episode → Trajectory → Skill → Generalized Prior
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  Instead of flat logs, OMEGA distills validated physical executions into reusable parametric skills and generalized physical priors.
                </p>
              </div>
            </div>

            {/* Skill Memory Hierarchy Tree */}
            <div className="space-y-3">
              {HIERARCHICAL_SKILL_MEMORY_NODES.map((node) => (
                <div key={node.id} className="p-3.5 bg-white border-2 border-neutral-800 font-sans space-y-2 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] font-bold bg-[#1A1A1A] text-white px-2 py-0.5 uppercase">
                        {node.level}
                      </span>
                      <span className="font-mono font-bold text-xs text-indigo-900">{node.id}</span>
                      <span className="font-bold text-xs text-black">{node.name}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-700">
                      Confidence: {(node.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  <p className="text-xs text-neutral-700 leading-relaxed">{node.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-[10px] bg-neutral-50 p-2.5 border border-neutral-200">
                    <div>
                      <span className="text-neutral-500 uppercase block">Operating Condition Envelope:</span>
                      <span className="text-neutral-900 font-bold">
                        Wetness: {node.conditions.wetness_pct_range[0]}–{node.conditions.wetness_pct_range[1]}% • Mass: {node.conditions.object_mass_g_range[0]}–{node.conditions.object_mass_g_range[1]}g
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 uppercase block">Optimal Parameter Bounds:</span>
                      <span className="text-indigo-800 font-bold">
                        Grip Force: {node.recommended_parameters.grip_force_n_range[0]}–{node.recommended_parameters.grip_force_n_range[1]} N • Speed: {node.recommended_parameters.insertion_speed_mms} mm/s
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 8: PROVENANCE & SCIENTIFIC AUDIT LINEAGE              */}
        {/* ========================================================= */}
        {worldModelTab === 'provenance' && (
          <div className="space-y-4">
            
            <div className="p-3 bg-white border border-neutral-300 flex items-start gap-3">
              <div className="p-2 bg-neutral-100 border border-neutral-300 text-neutral-800 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-black uppercase text-xs text-[#1A1A1A]">
                  Scientific Provenance & Audit Lineage
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  Every decision, counterfactual rollout, and VETO check is cryptographically anchored to exact sensor calibrations, model versions, and human authorization tokens.
                </p>
              </div>
            </div>

            {/* Lineage Details */}
            <div className="bg-neutral-900 text-white p-4 border-2 border-neutral-800 font-mono text-xs space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-b border-neutral-700 pb-3">
                <div>
                  <span className="text-neutral-400 text-[10px] block">Prediction ID:</span>
                  <span className="text-emerald-400 font-bold">{MASTER_PROVENANCE_AUDIT.prediction_id}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block">World State ID:</span>
                  <span className="text-neutral-200 font-bold">{MASTER_PROVENANCE_AUDIT.world_state_id}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block">Model Architecture:</span>
                  <span className="text-neutral-200">{MASTER_PROVENANCE_AUDIT.model_version}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block">Simulation Engine:</span>
                  <span className="text-neutral-200">{MASTER_PROVENANCE_AUDIT.simulation_engine}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-neutral-400 text-[10px] block uppercase">Calibrated Sensor Firmware Lineage:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-neutral-300">
                  <div>LiDAR Metrology: {MASTER_PROVENANCE_AUDIT.sensor_versions.lidar}</div>
                  <div>Tactile GelSight: {MASTER_PROVENANCE_AUDIT.sensor_versions.gelsight}</div>
                  <div>Joint Encoders: {MASTER_PROVENANCE_AUDIT.sensor_versions.robot_encoders}</div>
                  <div>Cameras: {MASTER_PROVENANCE_AUDIT.sensor_versions.rgb_camera}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-700 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Hardware Authorization Hash: {MASTER_PROVENANCE_AUDIT.hardware_authorization_hash}</span>
                </div>
                <span className="text-neutral-400">Git Commit: {MASTER_PROVENANCE_AUDIT.git_lineage_commit}</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
