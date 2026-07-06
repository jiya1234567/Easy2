/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { StateTensor, HardwareState } from '../types';
import SimulationControls from './SimulationControls';
import { Brain } from 'lucide-react';

type NeuroscienceDashboardProps = {
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
  worldState: any;
  hardwareState?: HardwareState;
};

export default function NeuroscienceDashboard({
  onLogEvent,
  worldState,
  hardwareState,
}: NeuroscienceDashboardProps) {
  const [numNeurons, setNumNeurons] = useState(30);
  const [firingThreshold, setFiringThreshold] = useState(0.5);
  const [plasticity, setPlasticity] = useState(0.1);
  const [spikeTrain, setSpikeTrain] = useState<number[]>(() => {
    const list = [];
    for (let i = 0; i < 60; i++) {
      list.push(Math.random() > 0.5 ? 1 : 0);
    }
    return list;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [localEvents, setLocalEvents] = useState<{ time: number; details: string; type: 'info' | 'physics' | 'interaction' }[]>([
    { time: 0, details: "Computational neuroscience and spiking neuron grid loaded.", type: "info" }
  ]);

  const addLocalEvent = useCallback((details: string, type: 'info' | 'physics' | 'interaction') => {
    setLocalEvents(prev => [...prev, { time: prev.length, details, type }]);
    onLogEvent(details, type);
  }, [onLogEvent]);

  // Simulate neural network activity
  const simulateNetwork = useCallback(() => {
    const newSpikeTrain = [];
    for (let i = 0; i < 60; i++) {
      newSpikeTrain.push(Math.random() > firingThreshold ? 1 : 0);
    }
    setSpikeTrain(newSpikeTrain);
    addLocalEvent(`Simulated neural network firing sequence: ${numNeurons} active nodes, Firing Threshold=${firingThreshold.toFixed(2)}, plasticity coefficient=${plasticity.toFixed(2)}`, 'physics');
  }, [numNeurons, firingThreshold, plasticity, addLocalEvent]);

  const networkToStateTensor = (): StateTensor => ({
    spatial: { x: numNeurons, y: 1, z: 1 },
    temporal: { t: spikeTrain.length, dt: 1 },
    features: {
      numNeurons,
      firingThreshold,
      plasticity,
      spikeDensity: spikeTrain.filter(s => s === 1).length / (spikeTrain.length || 1),
    },
  });

  return (
    <div className="bg-[#F5F2ED] border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
      <div className="flex items-center gap-2 border-b-2 border-[#1A1A1A] pb-4 mb-6">
        <div className="bg-[#1A1A1A] text-white p-1.5">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-[#1A1A1A] text-base uppercase tracking-wider">05. THE COGNITIVE & NEUROSCIENCE LAB</h2>
          <span className="text-[10px] font-mono opacity-60">SMC v2.0 Computational Neuroscience Mesh</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-4 pb-2 border-b border-neutral-200">
              Synaptic & Axon Settings
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-[#1A1A1A]">Neuron Density Count</label>
                <input
                  type="number"
                  value={numNeurons}
                  onChange={(e) => setNumNeurons(Number(e.target.value))}
                  className="p-2 text-xs border-2 border-[#1A1A1A] bg-transparent font-mono focus:outline-none"
                  min="10"
                  max="100"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold uppercase text-[#1A1A1A]">
                  <span>Action Potential Threshold</span>
                  <span className="font-mono text-emerald-600">{firingThreshold.toFixed(2)} mV</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={firingThreshold}
                  onChange={(e) => setFiringThreshold(Number(e.target.value))}
                  className="w-full accent-[#1A1A1A]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold uppercase text-[#1A1A1A]">
                  <span>Synaptic Plasticity (STDP)</span>
                  <span className="font-mono text-emerald-600">{plasticity.toFixed(2)} λ</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.50"
                  step="0.01"
                  value={plasticity}
                  onChange={(e) => setPlasticity(Number(e.target.value))}
                  className="w-full accent-[#1A1A1A]"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t border-neutral-100">
              <button
                onClick={simulateNetwork}
                className="w-full px-3 py-2 text-xs font-bold bg-[#1A1A1A] hover:bg-[#333333] text-white transition border border-[#1A1A1A] cursor-pointer text-center uppercase tracking-wider"
              >
                Fire Spike Train
              </button>
            </div>
          </div>

          {/* StateTensor */}
          <div className="bg-[#1A1A1A] text-[#F5F2ED] p-4 border-2 border-[#1A1A1A] font-mono text-[10px] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            <span className="text-emerald-400 font-bold uppercase tracking-widest text-[9px] block mb-2">
              Neuroscience StateTensor
            </span>
            <pre className="overflow-x-auto leading-relaxed text-neutral-300">
              {JSON.stringify(networkToStateTensor(), null, 2)}
            </pre>
          </div>
        </div>

        {/* Visualizer Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-4 pb-2 border-b border-neutral-200">
              Biophysical Neuron Grid Mesh & Synapse Activity
            </h3>

            {/* Neural grid visualization in SVG */}
            <div className="h-64 relative bg-[#FCFAF7] border border-neutral-200 p-2">
              <svg className="w-full h-full" viewBox="0 0 100 50">
                {/* Draw synapses (lines) */}
                {Array.from({ length: Math.min(numNeurons, 30) }).map((_, i) => {
                  if (i % 3 === 0 && i + 3 < numNeurons) {
                    const x1 = (i % 10) * 9 + 9;
                    const y1 = Math.floor(i / 10) * 12 + 10;
                    const x2 = ((i + 3) % 10) * 9 + 9;
                    const y2 = Math.floor((i + 3) / 10) * 12 + 10;
                    return (
                      <line
                        key={`synapse-${i}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#1A1A1A"
                        strokeWidth={plasticity * 1.5}
                        opacity={0.3}
                      />
                    );
                  }
                  return null;
                })}

                {/* Draw neurons */}
                {Array.from({ length: Math.min(numNeurons, 30) }).map((_, i) => {
                  const x = (i % 10) * 9 + 9;
                  const y = Math.floor(i / 10) * 12 + 10;
                  const isFiring = spikeTrain[i] === 1;
                  return (
                    <circle
                      key={`neuron-${i}`}
                      cx={x}
                      cy={y}
                      r="2"
                      fill={isFiring ? '#10B981' : '#EF4444'}
                      stroke="#1A1A1A"
                      strokeWidth="0.3"
                    />
                  );
                })}
              </svg>
              <div className="absolute top-2 left-2 text-[8px] font-mono bg-white/80 px-1 border border-neutral-100">
                Current Firing State: {spikeTrain.filter(s => s === 1).length} active nodes
              </div>
            </div>

            {/* Spike Train Raster Plot */}
            <div className="mt-4">
              <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase block mb-1.5">Action Potential Raster Plot</span>
              <div className="border-2 border-[#1A1A1A] p-2 bg-white h-16 flex items-end">
                {spikeTrain.map((spike, i) => (
                  <div
                    key={i}
                    className={`flex-1 mx-0.5 ${spike === 1 ? 'bg-emerald-500 h-12' : 'bg-neutral-100 h-2'}`}
                  />
                ))}
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
              setLocalEvents([{ time: 0, details: "Spiking network model reset.", type: "info" }]);
              addLocalEvent("Depolarization limits returned to passive resting levels.", "info");
            }}
            hardwareState={hardwareState}
          />
        </div>
      </div>
    </div>
  );
}
