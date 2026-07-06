/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { StateTensor, HardwareState } from '../types';
import SimulationControls from './SimulationControls';
import { Cpu } from 'lucide-react';

type MaterialScienceDashboardProps = {
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
  worldState: any;
  hardwareState?: HardwareState;
};

export default function MaterialScienceDashboard({
  onLogEvent,
  worldState,
  hardwareState,
}: MaterialScienceDashboardProps) {
  const [temperature, setTemperature] = useState(300); // Kelvin
  const [pressure, setPressure] = useState(1.0); // atm
  const [bondStrength, setBondStrength] = useState(1.0);
  const [latticeType, setLatticeType] = useState<'fcc' | 'bcc' | 'hcp'>('fcc');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [localEvents, setLocalEvents] = useState<{ time: number; details: string; type: 'info' | 'physics' | 'interaction' }[]>([
    { time: 0, details: "Crystalline and molecular structure simulation ready.", type: "info" }
  ]);

  const addLocalEvent = useCallback((details: string, type: 'info' | 'physics' | 'interaction') => {
    setLocalEvents(prev => [...prev, { time: prev.length, details, type }]);
    onLogEvent(details, type);
  }, [onLogEvent]);

  // Generate atomic lattice coordinates for visualization
  const getAtoms = useCallback(() => {
    const atomsList = [];
    const size = 6;
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        // Base coordinate with a bit of thermal jitter proportional to temperature
        const jitter = (temperature - 100) * 0.005 * (Math.random() - 0.5);
        
        let zFactor = 0;
        if (latticeType === 'bcc' && (x + y) % 2 === 1) {
          zFactor = 0.5;
        } else if (latticeType === 'hcp') {
          zFactor = (x % 2) * 0.25;
        }

        atomsList.push({
          id: `${x}-${y}`,
          x: x * 15 + 12 + jitter,
          y: y * 15 + 12 + zFactor * 10 + jitter,
          type: (x + y) % 2 === 0 ? 'A' : 'B',
        });
      }
    }
    return atomsList;
  }, [temperature, latticeType]);

  const [atoms, setAtoms] = useState(() => getAtoms());

  const handleRecalculateLattice = useCallback(() => {
    setAtoms(getAtoms());
    addLocalEvent(`Recalculated crystalline lattice states for ${latticeType.toUpperCase()} under ${temperature}K / ${pressure} atm.`, 'physics');
  }, [getAtoms, latticeType, temperature, pressure, addLocalEvent]);

  // Convert state to StateTensor
  const latticeToStateTensor = (): StateTensor => ({
    spatial: { x: 6, y: 6, z: 1 },
    temporal: { t: 0, dt: 1 },
    features: {
      temperature,
      pressure,
      bondStrength,
      totalAtoms: atoms.length,
      freeEnergy: (temperature * 0.45 + pressure * 12.2) / bondStrength,
    },
  });

  return (
    <div className="bg-[#F5F2ED] border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
      <div className="flex items-center gap-2 border-b-2 border-[#1A1A1A] pb-4 mb-6">
        <div className="bg-[#1A1A1A] text-white p-1.5">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-[#1A1A1A] text-base uppercase tracking-wider">03. MATERIALS SCIENCE & ATOMIC LAB</h2>
          <span className="text-[10px] font-mono opacity-60">SMC v2.0 Microstructural Crystalline Solver</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Parameters */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-4 pb-2 border-b border-neutral-200">
              Thermodynamic Boundary Conditions
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold uppercase text-[#1A1A1A]">
                  <span>Temperature (Kelvin)</span>
                  <span className="font-mono text-emerald-600">{temperature} K</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1200"
                  step="10"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-[#1A1A1A]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold uppercase text-[#1A1A1A]">
                  <span>Pressure (atm)</span>
                  <span className="font-mono text-emerald-600">{pressure.toFixed(1)} atm</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="10.0"
                  step="0.1"
                  value={pressure}
                  onChange={(e) => setPressure(Number(e.target.value))}
                  className="w-full accent-[#1A1A1A]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold uppercase text-[#1A1A1A]">
                  <span>Interatomic Bond Strength</span>
                  <span className="font-mono text-emerald-600">{bondStrength.toFixed(2)} eV</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={bondStrength}
                  onChange={(e) => setBondStrength(Number(e.target.value))}
                  className="w-full accent-[#1A1A1A]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-[#1A1A1A]">Crystalline Phase</label>
                <select
                  value={latticeType}
                  onChange={(e) => setLatticeType(e.target.value as 'fcc' | 'bcc' | 'hcp')}
                  className="p-2 text-xs border-2 border-[#1A1A1A] bg-transparent font-mono focus:outline-none"
                >
                  <option value="fcc">FCC (Face-Centered Cubic)</option>
                  <option value="bcc">BCC (Body-Centered Cubic)</option>
                  <option value="hcp">HCP (Hexagonal Close-Packed)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t border-neutral-100">
              <button
                onClick={handleRecalculateLattice}
                className="w-full px-3 py-2 text-xs font-bold bg-[#1A1A1A] hover:bg-[#333333] text-white transition border border-[#1A1A1A] cursor-pointer text-center uppercase tracking-wider"
              >
                Compute Dynamics
              </button>
            </div>
          </div>

          {/* StateTensor */}
          <div className="bg-[#1A1A1A] text-[#F5F2ED] p-4 border-2 border-[#1A1A1A] font-mono text-[10px] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            <span className="text-emerald-400 font-bold uppercase tracking-widest text-[9px] block mb-2">
              Materials StateTensor
            </span>
            <pre className="overflow-x-auto leading-relaxed text-neutral-300">
              {JSON.stringify(latticeToStateTensor(), null, 2)}
            </pre>
          </div>
        </div>

        {/* Crystalline Visualizer */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-4 pb-2 border-b border-neutral-200">
              Atomic Crystalline Matrix (2D Projection)
            </h3>

            <div className="h-64 relative bg-[#FCFAF7] border border-neutral-200 p-2 flex items-center justify-center">
              <svg className="w-full h-full max-w-sm" viewBox="0 0 100 100">
                {/* Render bonds */}
                {atoms.map((atom, i) => {
                  return atoms.slice(i + 1).map((otherAtom) => {
                    const dx = atom.x - otherAtom.x;
                    const dy = atom.y - otherAtom.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    // Draw bonds between immediate neighbors only
                    if (dist < 18) {
                      return (
                        <line
                          key={`bond-${atom.id}-${otherAtom.id}`}
                          x1={atom.x}
                          y1={atom.y}
                          x2={otherAtom.x}
                          y2={otherAtom.y}
                          stroke="#E2E8F0"
                          strokeWidth={bondStrength * 0.75}
                        />
                      );
                    }
                    return null;
                  });
                })}

                {/* Render atom spheres */}
                {atoms.map((atom) => (
                  <circle
                    key={atom.id}
                    cx={atom.x}
                    cy={atom.y}
                    r={temperature > 800 ? "2.5" : "1.8"}
                    fill={atom.type === 'A' ? '#1A1A1A' : '#EF4444'}
                    stroke="#1A1A1A"
                    strokeWidth="0.25"
                  />
                ))}
              </svg>
              <div className="absolute top-2 left-2 text-[8px] font-mono bg-white/80 px-1 border border-neutral-100">
                State: {temperature > 900 ? 'Liquid Phase (Molten)' : 'Solid-State Lattice'}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="p-3 bg-[#FCFAF7] border border-neutral-200">
                <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase">Phase System</span>
                <p className="text-xs font-mono font-bold text-[#1A1A1A]">
                  {latticeType.toUpperCase()} Cubic
                </p>
              </div>
              <div className="p-3 bg-[#FCFAF7] border border-neutral-200">
                <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase">Thermal Entropy</span>
                <p className="text-xs font-mono font-bold text-[#1A1A1A]">
                  {(temperature * 0.0083).toFixed(4)} J/K
                </p>
              </div>
              <div className="p-3 bg-[#FCFAF7] border border-neutral-200">
                <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase">Strain energy</span>
                <p className="text-xs font-mono font-bold text-[#1A1A1A]">
                  {(pressure * 0.125).toFixed(3)} eV/atom
                </p>
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
              setLocalEvents([{ time: 0, details: "Crystalline structure simulation reset.", type: "info" }]);
              addLocalEvent("Materials simulation returned to starting atomic matrix.", "info");
            }}
            hardwareState={hardwareState}
          />
        </div>
      </div>
    </div>
  );
}
