/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { StateTensor, HardwareState } from '../types';
import SimulationControls from './SimulationControls';
import { Brain } from 'lucide-react';

type MentalIllnessDashboardProps = {
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
  worldState: any;
  hardwareState?: HardwareState;
};

export default function MentalIllnessDashboard({
  onLogEvent,
  worldState,
  hardwareState,
}: MentalIllnessDashboardProps) {
  const [serotonin, setSerotonin] = useState(0.5);
  const [dopamine, setDopamine] = useState(0.5);
  const [connectivity, setConnectivity] = useState(0.8);
  const [stress, setStress] = useState(0.3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [localEvents, setLocalEvents] = useState<{ time: number; details: string; type: 'info' | 'physics' | 'interaction' }[]>([
    { time: 0, details: "Cognitive state and neuropsychological lab active.", type: "info" }
  ]);

  const addLocalEvent = useCallback((details: string, type: 'info' | 'physics' | 'interaction') => {
    setLocalEvents(prev => [...prev, { time: prev.length, details, type }]);
    onLogEvent(details, type);
  }, [onLogEvent]);

  // Simulate brain region active signals (pure function)
  const getBrainActivity = useCallback(() => {
    return [
      { name: 'Prefrontal Cortex (Logic/Regulation)', activity: Math.max(0.05, Math.min(1.0, 0.7 - stress * 0.4 + serotonin * 0.2)) },
      { name: 'Amygdala (Emotion/Fear)', activity: Math.max(0.05, Math.min(1.0, 0.25 + stress * 0.75 - serotonin * 0.25)) },
      { name: 'Hippocampus (Memory/Encoding)', activity: Math.max(0.05, Math.min(1.0, 0.6 - stress * 0.35 + dopamine * 0.2)) },
      { name: 'Nucleus Accumbens (Reward Pathway)', activity: Math.max(0.05, Math.min(1.0, 0.4 + dopamine * 0.55 - stress * 0.15)) },
    ];
  }, [serotonin, dopamine, stress]);

  const [regions, setRegions] = useState(() => getBrainActivity());

  const handleComputeDynamics = useCallback(() => {
    setRegions(getBrainActivity());
    addLocalEvent(`Triggered neuropsychological sweep. Neurotransmitters: Serotonin=${serotonin.toFixed(1)}, Dopamine=${dopamine.toFixed(1)}, Connectivity Coefficient=${connectivity.toFixed(1)}, Stress=${stress.toFixed(1)}`, 'physics');
  }, [getBrainActivity, addLocalEvent, serotonin, dopamine, connectivity, stress]);

  const brainToStateTensor = (): StateTensor => ({
    spatial: { x: regions.length, y: 1, z: 1 },
    temporal: { t: 0, dt: 1 },
    features: {
      serotonin,
      dopamine,
      connectivity,
      stress,
      meanActivity: regions.reduce((sum, r) => sum + r.activity, 0) / regions.length,
    },
  });

  return (
    <div className="bg-[#F5F2ED] border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
      <div className="flex items-center gap-2 border-b-2 border-[#1A1A1A] pb-4 mb-6">
        <div className="bg-[#1A1A1A] text-white p-1.5">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-[#1A1A1A] text-base uppercase tracking-wider">06. PSYCHIATRIC & COGNITIVE MODELING LAB</h2>
          <span className="text-[10px] font-mono opacity-60">SMC v2.0 Neurotransmission & Stress Models</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-4 pb-2 border-b border-neutral-200">
              Neurotransmitter & Stress Baselines
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold uppercase text-[#1A1A1A]">
                  <span>Serotonin Level</span>
                  <span className="font-mono text-emerald-600">{(serotonin * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={serotonin}
                  onChange={(e) => setSerotonin(Number(e.target.value))}
                  className="w-full accent-[#1A1A1A]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold uppercase text-[#1A1A1A]">
                  <span>Dopamine Level</span>
                  <span className="font-mono text-emerald-600">{(dopamine * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={dopamine}
                  onChange={(e) => setDopamine(Number(e.target.value))}
                  className="w-full accent-[#1A1A1A]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold uppercase text-[#1A1A1A]">
                  <span>Default Mode Connectivity</span>
                  <span className="font-mono text-emerald-600">{(connectivity * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={connectivity}
                  onChange={(e) => setConnectivity(Number(e.target.value))}
                  className="w-full accent-[#1A1A1A]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold uppercase text-[#1A1A1A]">
                  <span>Systemic Stress Index (Cortisol)</span>
                  <span className="font-mono text-emerald-600">{(stress * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={stress}
                  onChange={(e) => setStress(Number(e.target.value))}
                  className="w-full accent-[#1A1A1A]"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t border-neutral-100">
              <button
                onClick={handleComputeDynamics}
                className="w-full px-3 py-2 text-xs font-bold bg-[#1A1A1A] hover:bg-[#333333] text-white transition border border-[#1A1A1A] cursor-pointer text-center uppercase tracking-wider"
              >
                Simulate Neuro-States
              </button>
            </div>
          </div>

          {/* StateTensor */}
          <div className="bg-[#1A1A1A] text-[#F5F2ED] p-4 border-2 border-[#1A1A1A] font-mono text-[10px] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            <span className="text-emerald-400 font-bold uppercase tracking-widest text-[9px] block mb-2">
              Psychiatric StateTensor
            </span>
            <pre className="overflow-x-auto leading-relaxed text-neutral-300">
              {JSON.stringify(brainToStateTensor(), null, 2)}
            </pre>
          </div>
        </div>

        {/* Visualizer Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-4 pb-2 border-b border-neutral-200">
              Active Regional Brain Activity Indices
            </h3>

            {/* Region activity display */}
            <div className="space-y-4 bg-[#FCFAF7] border border-neutral-200 p-4">
              {regions.map((region, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-mono font-bold text-[#1A1A1A]">
                    <span>{region.name}</span>
                    <span>{(region.activity * 100).toFixed(0)}% Activity</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-3 border border-[#1A1A1A]">
                    <div
                      className="bg-emerald-500 h-full border-r border-[#1A1A1A] transition-all duration-300"
                      style={{ width: `${region.activity * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Diagnostics Insights */}
            <div className="mt-6 border-t-2 border-[#1A1A1A] pt-4">
              <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block mb-3">AI Diagnostic Hypothesis (Autonomous Assessment)</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white border border-neutral-200">
                  <strong className="block text-[#1A1A1A] mb-1">Prefrontal-Amygdala Connectivity:</strong>
                  {stress > 0.6 && serotonin < 0.4 ? (
                    <span className="text-rose-600 font-serif italic">Reduced logic regulation over emotional triggers observed. Suggests anxiety/depression profile.</span>
                  ) : (
                    <span className="text-emerald-700 font-serif italic">Balanced logic regulation over sensory emotional inputs. Baseline cognitive control intact.</span>
                  )}
                </div>
                <div className="p-3 bg-white border border-neutral-200">
                  <strong className="block text-[#1A1A1A] mb-1">Dopaminergic Hedonic Feedback:</strong>
                  {dopamine < 0.3 ? (
                    <span className="text-rose-600 font-serif italic">Hypo-dopaminergic signals in nucleus accumbens. Anhedonia pattern detected.</span>
                  ) : dopamine > 0.8 ? (
                    <span className="text-emerald-700 font-serif italic">Hyper-dopaminergic signals. Search activity and reward feedback loops fully active.</span>
                  ) : (
                    <span className="text-emerald-700 font-serif italic">Dopamine levels in nominal homeostatic range. Reward loops balanced.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Local simulation console */}
          <SimulationControls
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            speed={speed}
            setSpeed={setSpeed}
            temporalEvents={localEvents}
            onResetSimulation={() => {
              setLocalEvents([{ time: 0, details: "Cognitive region sweep reset.", type: "info" }]);
              addLocalEvent("Neurochemical state tensors cleared.", "info");
            }}
            hardwareState={hardwareState}
          />
        </div>
      </div>
    </div>
  );
}
