/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { StateTensor, HardwareState } from '../types';
import SimulationControls from './SimulationControls';
import { Pill } from 'lucide-react';

type DrugTherapyDashboardProps = {
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
  worldState: any;
  hardwareState?: HardwareState;
};

export default function DrugTherapyDashboard({
  onLogEvent,
  worldState,
  hardwareState,
}: DrugTherapyDashboardProps) {
  const [drugConcentration, setDrugConcentration] = useState(100);
  const [metabolismRate, setMetabolismRate] = useState(0.1);
  const [bindingAffinity, setBindingAffinity] = useState(0.8);
  const [proteinStructure, setProteinStructure] = useState<string>('alpha_helix');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [localEvents, setLocalEvents] = useState<{ time: number; details: string; type: 'info' | 'physics' | 'interaction' }[]>([
    { time: 0, details: "Pharmacokinetics and molecular docking environment active.", type: "info" }
  ]);

  const addLocalEvent = useCallback((details: string, type: 'info' | 'physics' | 'interaction') => {
    setLocalEvents(prev => [...prev, { time: prev.length, details, type }]);
    onLogEvent(details, type);
  }, [onLogEvent]);

  // Simulate drug-protein interaction (pure function)
  const getInteractionData = useCallback(() => {
    const effectiveness = drugConcentration * bindingAffinity * (1 - metabolismRate);
    return {
      bindingSites: Math.floor(bindingAffinity * 10),
      effectiveness,
    };
  }, [drugConcentration, metabolismRate, bindingAffinity]);

  const [interaction, setInteraction] = useState(() => getInteractionData());

  const handleRunSimulation = useCallback(() => {
    const data = getInteractionData();
    setInteraction(data);
    addLocalEvent(`Simulated ligand docking. Dosage: ${drugConcentration} mg, Affinity: ${bindingAffinity.toFixed(2)}, Computed Bioavailability: ${data.effectiveness.toFixed(1)}%`, 'physics');
  }, [getInteractionData, addLocalEvent, drugConcentration, bindingAffinity]);

  // Convert interaction to StateTensor
  const interactionToStateTensor = (): StateTensor => ({
    spatial: { x: 1, y: 1, z: 1 },
    temporal: { t: 0, dt: 1 },
    features: {
      drugConcentration,
      metabolismRate,
      bindingAffinity,
      bindingSites: interaction.bindingSites,
      effectiveness: interaction.effectiveness,
    },
  });

  return (
    <div className="bg-[#F5F2ED] border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
      <div className="flex items-center gap-2 border-b-2 border-[#1A1A1A] pb-4 mb-6">
        <div className="bg-[#1A1A1A] text-white p-1.5">
          <Pill className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-[#1A1A1A] text-base uppercase tracking-wider">04. CLINICAL PHARMACOLOGY LAB</h2>
          <span className="text-[10px] font-mono opacity-60">SMC v2.0 Pharmacokinetics & Molecular Docking</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-4 pb-2 border-b border-neutral-200">
              Ligand / Dosage Properties
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-[#1A1A1A]">Drug Concentration (mg/mL)</label>
                <input
                  type="number"
                  value={drugConcentration}
                  onChange={(e) => setDrugConcentration(Number(e.target.value))}
                  className="p-2 text-xs border-2 border-[#1A1A1A] bg-transparent font-mono focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold uppercase text-[#1A1A1A]">
                  <span>Metabolism Rate</span>
                  <span className="font-mono text-emerald-600">{(metabolismRate * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.01"
                  value={metabolismRate}
                  onChange={(e) => setMetabolismRate(Number(e.target.value))}
                  className="w-full accent-[#1A1A1A]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold uppercase text-[#1A1A1A]">
                  <span>Binding Affinity (Kd)</span>
                  <span className="font-mono text-emerald-600">{bindingAffinity.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={bindingAffinity}
                  onChange={(e) => setBindingAffinity(Number(e.target.value))}
                  className="w-full accent-[#1A1A1A]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-[#1A1A1A]">Target Protein Domain</label>
                <select
                  value={proteinStructure}
                  onChange={(e) => setProteinStructure(e.target.value)}
                  className="p-2 text-xs border-2 border-[#1A1A1A] bg-transparent font-mono focus:outline-none"
                >
                  <option value="alpha_helix">Alpha Helix (Receptor GPCR)</option>
                  <option value="beta_sheet">Beta Sheet (Enzyme Active Site)</option>
                  <option value="random_coil">Random Coil (Ion Channel)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t border-neutral-100">
              <button
                onClick={handleRunSimulation}
                className="w-full px-3 py-2 text-xs font-bold bg-[#1A1A1A] hover:bg-[#333333] text-white transition border border-[#1A1A1A] cursor-pointer text-center uppercase tracking-wider"
              >
                Compute Docking
              </button>
            </div>
          </div>

          {/* StateTensor */}
          <div className="bg-[#1A1A1A] text-[#F5F2ED] p-4 border-2 border-[#1A1A1A] font-mono text-[10px] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            <span className="text-emerald-400 font-bold uppercase tracking-widest text-[9px] block mb-2">
              Pharmacological StateTensor
            </span>
            <pre className="overflow-x-auto leading-relaxed text-neutral-300">
              {JSON.stringify(interactionToStateTensor(), null, 2)}
            </pre>
          </div>
        </div>

        {/* Crystalline Visualizer */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-4 pb-2 border-b border-neutral-200">
              Drug-Protein Binding Field & Receptors
            </h3>

            <div className="h-64 relative bg-[#FCFAF7] border border-neutral-200 p-2 flex items-center justify-center">
              <div className="relative w-48 h-48 border-2 border-dashed border-[#1A1A1A] rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
                {/* Core protein visual */}
                <div className="w-24 h-24 bg-[#1A1A1A] text-[#F5F2ED] rounded-full flex items-center justify-center font-serif italic text-xs font-bold">
                  PROTEIN
                </div>

                {/* Ligands docking */}
                {Array.from({ length: interaction.bindingSites }).map((_, i) => {
                  const angle = (i * 2 * Math.PI) / (interaction.bindingSites || 1);
                  const x = 50 + Math.cos(angle) * 40;
                  const y = 50 + Math.sin(angle) * 40;
                  return (
                    <div
                      key={i}
                      className="absolute w-4 h-4 bg-emerald-500 rounded-full border border-[#1A1A1A] flex items-center justify-center shadow-md"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <span className="text-[6px] text-white font-bold font-mono">L</span>
                    </div>
                  );
                })}
              </div>

              <div className="absolute top-2 left-2 text-[8px] font-mono bg-white/80 px-1 border border-neutral-100">
                GPCR Active Receptors Bound: {interaction.bindingSites}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-mono font-bold text-[#1A1A1A]">
                <span>THERAPEUTIC ABSORPTION KINETICS</span>
                <span>{Math.min(100, interaction.effectiveness).toFixed(1)}% Effective</span>
              </div>
              <div className="w-full bg-neutral-200 h-3 border border-[#1A1A1A]">
                <div
                  className="bg-emerald-500 h-full border-r border-[#1A1A1A] transition-all duration-500"
                  style={{ width: `${Math.min(100, interaction.effectiveness)}%` }}
                />
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
              setLocalEvents([{ time: 0, details: "Drug-protein workspace reset.", type: "info" }]);
              addLocalEvent("Bioavailability states returned to steady-state baseline.", "info");
            }}
            hardwareState={hardwareState}
          />
        </div>
      </div>
    </div>
  );
}
