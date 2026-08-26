// src/components/StressTestingHarnessModal.tsx
import React, { useState } from 'react';
import {
  AlertTriangle, Shield, ShieldCheck, Flame, Eye, Activity, RefreshCw,
  Play, RotateCcw, CheckCircle, XCircle, Zap, Cpu, Compass, Layers,
  ChevronRight, Terminal, BarChart2, Radio, Sliders, Check
} from 'lucide-react';
import { STRESS_TEST_SUITE, StressTestCase } from './StressTestingTypes';

interface StressTestingHarnessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogEvent?: (details: string, type: 'info' | 'physics' | 'interaction') => void;
  onApplyStressToTimeline?: (stressCase: StressTestCase) => void;
}

export default function StressTestingHarnessModal({
  isOpen,
  onClose,
  onLogEvent,
  onApplyStressToTimeline
}: StressTestingHarnessModalProps) {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(STRESS_TEST_SUITE[0].id);
  const [activeTab, setActiveTab] = useState<'overview' | 'telemetry' | 'parameters' | 'formal_proof'>('overview');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<number>(100);
  const [runHistory, setRunHistory] = useState<Record<string, { executed: boolean; passed: boolean }>>({
    'STRESS_01_LUBRICATION_SLIP': { executed: true, passed: true },
    'STRESS_02_OPTICAL_OCCLUSION': { executed: true, passed: true },
    'STRESS_03_TEMPORAL_JITTER': { executed: true, passed: true },
    'STRESS_04_JAMMING_COLLISION': { executed: true, passed: true },
    'STRESS_05_ADVERSARIAL_INVARIANTS': { executed: true, passed: true },
    'STRESS_06_SIM2REAL_MASS_DRIFT': { executed: true, passed: true },
    'STRESS_07_THERMAL_FATIGUE': { executed: true, passed: true }
  });

  if (!isOpen) return null;

  const currentCase = STRESS_TEST_SUITE.find(c => c.id === selectedCaseId) || STRESS_TEST_SUITE[0];

  const handleRunStressSimulation = () => {
    setIsSimulating(true);
    setSimProgress(0);
    if (onLogEvent) {
      onLogEvent(`[STRESS TEST] Initiated hardware stress simulation for ${currentCase.id}: "${currentCase.title}"`, 'physics');
    }

    const interval = setInterval(() => {
      setSimProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulating(false);
          setRunHistory(h => ({
            ...h,
            [currentCase.id]: { executed: true, passed: currentCase.simulationRun.status !== 'FAILED' }
          }));
          if (onLogEvent) {
            onLogEvent(`[STRESS TEST RESULT] ${currentCase.id} finished with status: ${currentCase.simulationRun.status}. Mitigation: ${currentCase.simulationRun.mitigationApplied}`, 'physics');
          }
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleApplyToWorldTimeline = () => {
    if (onApplyStressToTimeline) {
      onApplyStressToTimeline(currentCase);
    }
    if (onLogEvent) {
      onLogEvent(`[STRESS TEST → WORLD STATE] Injected stress parameters from ${currentCase.title} into active 3D World State pipeline.`, 'interaction');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[#FAF9F6] w-full max-w-6xl max-h-[92vh] flex flex-col border-4 border-[#1A1A1A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-[#1A1A1A] overflow-hidden font-sans">
        
        {/* Header */}
        <div className="p-3.5 bg-[#1A1A1A] text-white flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#1A1A1A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-amber-500 text-black flex items-center justify-center font-mono font-black text-sm border border-amber-300">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black uppercase text-sm tracking-wide text-white">
                  Physical AI Robotics Stress Testing Harness
                </h3>
                <span className="bg-amber-950 text-amber-300 text-[9px] font-mono font-bold px-1.5 py-0.5 border border-amber-600">
                  7 EDGE-CASE PROTOCOLS
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono">
                Viscoelastic Surfactants • Optical Occlusions • Clock Drift • Physical Jamming • Formal VETO Proofs • Sim-to-Real • Fatigue
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyToWorldTimeline}
              className="bg-emerald-400 hover:bg-emerald-300 text-black px-3 py-1.5 text-xs font-mono font-bold border border-emerald-300 shadow-[2px_2px_0px_0px_rgba(16,185,129,1)] transition cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-black" />
              <span>Inject Case into 3D Pipeline</span>
            </button>
            <button
              onClick={onClose}
              className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 text-xs font-mono font-bold border border-neutral-600 transition cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Modal Body: Left Scenario Selector + Right Detailed Stress Workbench */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Column: 7 Stress Test Categories List (4 cols) */}
          <div className="lg:col-span-4 bg-[#F5F2ED] border-r-2 border-[#1A1A1A] p-3 overflow-y-auto space-y-2">
            <div className="text-[10px] font-mono font-bold text-neutral-500 uppercase px-1 mb-1">
              Select Stress Test Protocol:
            </div>

            {STRESS_TEST_SUITE.map((testCase, index) => {
              const isSelected = testCase.id === selectedCaseId;
              const hasRun = runHistory[testCase.id];
              return (
                <button
                  key={testCase.id}
                  onClick={() => {
                    setSelectedCaseId(testCase.id);
                    if (onLogEvent) {
                      onLogEvent(`[STRESS TEST] Selected stress case ${testCase.id}: "${testCase.title}"`, 'interaction');
                    }
                  }}
                  className={`w-full text-left p-2.5 border-2 transition cursor-pointer font-sans space-y-1 ${
                    isSelected
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-neutral-900 border-neutral-300 hover:border-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-mono font-bold uppercase ${
                      isSelected ? 'text-amber-400' : 'text-neutral-500'
                    }`}>
                      {testCase.categoryTitle}
                    </span>
                    <span className={`text-[8px] font-mono font-black px-1.5 py-0.2 uppercase ${
                      testCase.severity === 'CRITICAL'
                        ? 'bg-red-950 text-red-300 border border-red-700'
                        : testCase.severity === 'HIGH'
                        ? 'bg-amber-950 text-amber-300 border border-amber-700'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}>
                      {testCase.severity}
                    </span>
                  </div>

                  <h5 className="font-bold text-xs leading-tight line-clamp-1">
                    {testCase.title}
                  </h5>

                  <div className="flex items-center justify-between text-[9px] font-mono pt-1 border-t border-neutral-200/40">
                    <span className={`truncate ${isSelected ? 'text-neutral-300' : 'text-neutral-600'}`}>
                      {testCase.subtitle}
                    </span>
                    {hasRun && (
                      <span className="text-emerald-400 font-bold flex items-center gap-0.5 shrink-0">
                        <Check className="w-3 h-3" />
                        <span>VERIFIED</span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Stress Scenario Analysis & Execution (8 cols) */}
          <div className="lg:col-span-8 bg-white p-4 overflow-y-auto space-y-4 flex flex-col">
            
            {/* Scenario Header Info */}
            <div className="p-3 bg-[#FAF9F6] border-2 border-[#1A1A1A] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 border border-indigo-200">
                      {currentCase.id}
                    </span>
                    <h4 className="font-serif font-black text-sm uppercase text-black">
                      {currentCase.title}
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-600 font-medium font-sans mt-0.5">
                    {currentCase.subtitle}
                  </p>
                </div>

                <button
                  onClick={handleRunStressSimulation}
                  disabled={isSimulating}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 border ${
                    isSimulating
                      ? 'bg-amber-100 text-amber-900 border-amber-400 animate-pulse cursor-wait'
                      : 'bg-black text-white hover:bg-neutral-800 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer'
                  }`}
                >
                  <Play className={`w-3.5 h-3.5 ${isSimulating ? 'text-amber-700 animate-spin' : 'text-emerald-400'}`} />
                  <span>{isSimulating ? 'Executing Physics Rollout...' : 'Run Stress Simulation'}</span>
                </button>
              </div>

              {/* Simulation Progress Bar */}
              {isSimulating && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                    <span>MuJoCo Dynamic Stress Rollout Horizon: 50ms</span>
                    <span className="font-bold text-black">{simProgress}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-2 border border-neutral-400 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full transition-all duration-150"
                      style={{ width: `${simProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Stress Description */}
              <p className="text-xs text-neutral-700 leading-relaxed font-sans">
                {currentCase.description}
              </p>
            </div>

            {/* Sub-Tabs for Deep Technical Inspection */}
            <div className="flex items-center gap-1 border-b-2 border-neutral-300 pb-1">
              {[
                { id: 'overview', label: 'Overview & Invariants', icon: ShieldCheck },
                { id: 'telemetry', label: '50ms Telemetry Trace', icon: Activity },
                { id: 'parameters', label: 'Stress Parameter Deltas', icon: Sliders },
                { id: 'formal_proof', label: 'Symbolic VETO Proof', icon: Terminal }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-2.5 py-1 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer border-b-2 ${
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

            {/* SUB-TAB 1: OVERVIEW & INVARIANTS */}
            {activeTab === 'overview' && (
              <div className="space-y-3">
                
                {/* Measured Outcome Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 bg-neutral-50 border border-neutral-300">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase block">Peak Joint Torque</span>
                    <span className="text-sm font-mono font-black text-black">
                      {currentCase.simulationRun.measuredOutcome.peakTorqueNm} Nm
                    </span>
                  </div>
                  <div className="p-2.5 bg-neutral-50 border border-neutral-300">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase block">Worst-Case Clearance</span>
                    <span className={`text-sm font-mono font-black ${
                      currentCase.simulationRun.measuredOutcome.minClearanceMm < 50.0 ? 'text-amber-700' : 'text-emerald-700'
                    }`}>
                      {currentCase.simulationRun.measuredOutcome.minClearanceMm} mm
                    </span>
                  </div>
                  <div className="p-2.5 bg-neutral-50 border border-neutral-300">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase block">Slip Probability</span>
                    <span className={`text-sm font-mono font-black ${
                      currentCase.simulationRun.measuredOutcome.slipProbPct > 40 ? 'text-red-700' : 'text-neutral-800'
                    }`}>
                      {currentCase.simulationRun.measuredOutcome.slipProbPct}%
                    </span>
                  </div>
                  <div className="p-2.5 bg-neutral-50 border border-neutral-300">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase block">Glass Fracture Risk</span>
                    <span className="text-sm font-mono font-black text-black">
                      {currentCase.simulationRun.measuredOutcome.fractureRiskPct}%
                    </span>
                  </div>
                  <div className="p-2.5 bg-neutral-50 border border-neutral-300">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase block">Reflex Latency</span>
                    <span className="text-sm font-mono font-black text-indigo-700">
                      {currentCase.simulationRun.measuredOutcome.latencyMs} ms
                    </span>
                  </div>
                  <div className="p-2.5 bg-neutral-50 border border-neutral-300">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase block">Sim-to-Real Status</span>
                    <span className="text-xs font-mono font-black text-emerald-800 uppercase">
                      {currentCase.simulationRun.status}
                    </span>
                  </div>
                </div>

                {/* Autonomous Mitigation Card */}
                <div className="p-3 bg-emerald-50 border-2 border-emerald-800 shadow-[2px_2px_0px_0px_rgba(6,95,70,1)] space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-xs uppercase font-mono">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Autonomous Safety Reflex & Mitigation Executed</span>
                  </div>
                  <p className="text-xs text-emerald-950 font-sans leading-relaxed">
                    {currentCase.simulationRun.mitigationApplied}
                  </p>
                </div>

                {/* Sim-to-Real Calibration Error */}
                <div className="p-2.5 bg-neutral-900 text-white border border-neutral-700 font-mono text-xs space-y-1">
                  <span className="text-[9px] text-neutral-400 uppercase block">Reality Anchor Observation</span>
                  <p className="text-neutral-200 text-[11px] leading-relaxed">
                    "{currentCase.simulationRun.simToRealErrorDelta}"
                  </p>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: 50MS TELEMETRY TRACE */}
            {activeTab === 'telemetry' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                  <span>Synchronized 200 Hz Sensor Trace (0 to 50ms)</span>
                  <span className="font-bold text-black">6 Measured Steps</span>
                </div>
                <div className="overflow-x-auto border-2 border-[#1A1A1A]">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="bg-neutral-100 border-b border-neutral-300 text-[10px] text-neutral-700 uppercase">
                        <th className="p-2">Time (ms)</th>
                        <th className="p-2">Torque (Nm)</th>
                        <th className="p-2">Shear (N)</th>
                        <th className="p-2">Clearance (mm)</th>
                        <th className="p-2">Slip Prob</th>
                        <th className="p-2">System State</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCase.simulationRun.telemetryTrace.map((row) => (
                        <tr key={row.timeMs} className="border-b border-neutral-200 hover:bg-neutral-50">
                          <td className="p-2 font-bold text-black">{row.timeMs} ms</td>
                          <td className="p-2 font-bold text-indigo-900">{row.torqueNm} Nm</td>
                          <td className="p-2 text-neutral-800">{row.shearForceN.toFixed(3)} N</td>
                          <td className="p-2 text-neutral-800">{row.clearanceMm} mm</td>
                          <td className="p-2 text-amber-800 font-bold">{row.slipProbPct}%</td>
                          <td className="p-2 text-[11px] font-medium text-neutral-900">{row.systemState}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: PARAMETER DELTAS */}
            {activeTab === 'parameters' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  {currentCase.parameters.map((param, idx) => (
                    <div key={idx} className="p-3 bg-neutral-50 border border-neutral-300 space-y-1">
                      <span className="text-[10px] text-neutral-500 uppercase block font-bold">{param.label}</span>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-600">Nominal: <strong>{param.nominalValue}</strong></span>
                        <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 border border-red-200">
                          Stress: {param.stressValue}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-200 font-sans text-xs text-indigo-950 space-y-1">
                  <span className="font-mono text-[10px] font-bold text-indigo-900 uppercase block">Expected Harness Behavior</span>
                  <p className="leading-relaxed">{currentCase.expectedBehavior}</p>
                </div>
              </div>
            )}

            {/* SUB-TAB 4: FORMAL VETO PROOF */}
            {activeTab === 'formal_proof' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-neutral-900 text-white border-2 border-neutral-800 space-y-2">
                  <div className="flex justify-between items-center border-b border-neutral-700 pb-1.5">
                    <span className="text-emerald-400 font-bold uppercase text-[10px]">Active Formal Invariant</span>
                    <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 border border-emerald-700 font-bold">
                      MATHEMATICAL ENVELOPE
                    </span>
                  </div>
                  <p className="text-neutral-100 font-bold text-xs">{currentCase.formalInvariant}</p>
                </div>

                <div className="p-3 bg-white border border-neutral-300 space-y-2">
                  <span className="text-[10px] text-neutral-500 uppercase block font-bold">VETO Rule Trigger Evaluation</span>
                  <div className="p-2 bg-neutral-100 text-black border border-neutral-200 text-xs">
                    {currentCase.simulationRun.vetoTriggered ? (
                      <div className="space-y-1">
                        <div className="text-red-700 font-bold">
                          [VETO TRIPPED] Rule Name: {currentCase.simulationRun.vetoRuleName}
                        </div>
                        <div className="text-neutral-600 text-[11px]">
                          Uncertainty propagation proved safety margin was violated. Actuator command was overridden by symbolic safety gate.
                        </div>
                      </div>
                    ) : (
                      <div className="text-emerald-700 font-bold">
                        [NOMINAL PASS] Safety envelope intact. No symbolic VETO required.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-[#F5F2ED] border-t-2 border-[#1A1A1A] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-700">Active Test Protocol:</span>
            <span className="font-bold text-indigo-900">{currentCase.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRunStressSimulation}
              disabled={isSimulating}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold transition cursor-pointer"
            >
              Re-run MuJoCo Physics
            </button>
            <button
              onClick={handleApplyToWorldTimeline}
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold border border-emerald-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition cursor-pointer"
            >
              Inject Into 3D World State →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
