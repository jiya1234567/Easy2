/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { StateTensor, HardwareState, PolicyProposal } from '../types';
import SimulationControls from './SimulationControls';
import { DollarSign, Check, X, Edit2, ExternalLink } from 'lucide-react';

type FinanceDashboardProps = {
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
  worldState: any;
  hardwareState?: HardwareState;
};

export default function FinanceDashboard({
  onLogEvent,
  worldState,
  hardwareState,
}: FinanceDashboardProps) {
  const [timeSeries, setTimeSeries] = useState<{ time: number; price: number; volume: number }[]>(() => {
    // Initial data
    const initial = [];
    for (let i = 0; i < 40; i++) {
      const price = 100 + Math.sin(i * 0.2) * 5 + (Math.random() * 2);
      const volume = 1000 + Math.random() * 500;
      initial.push({ time: i, price, volume });
    }
    return initial;
  });

  const [volatility, setVolatility] = useState(0.1);
  const [interestRate, setInterestRate] = useState(0.05);
  const [liquidity, setLiquidity] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [localEvents, setLocalEvents] = useState<{ time: number; details: string; type: 'info' | 'physics' | 'interaction' }[]>([
    { time: 0, details: "Financial simulation workspace initialized.", type: "info" }
  ]);

  const addLocalEvent = useCallback((details: string, type: 'info' | 'physics' | 'interaction') => {
    setLocalEvents(prev => [...prev, { time: prev.length, details, type }]);
    onLogEvent(details, type);
  }, [onLogEvent]);

  // Generate mock financial data
  const generateTimeSeries = useCallback(() => {
    const newSeries = [];
    for (let i = 0; i < 40; i++) {
      const price = 100 + Math.sin(i * 0.25) * 8 + (Math.random() * volatility * 30);
      const volume = 800 + Math.random() * 1200 * liquidity;
      newSeries.push({ time: i, price, volume });
    }
    setTimeSeries(newSeries);
    addLocalEvent(`Generated financial time-series: Volatility=${volatility.toFixed(2)}, Interest Rate=${(interestRate * 100).toFixed(1)}%, Liquidity=${liquidity.toFixed(1)}`, 'info');
  }, [volatility, interestRate, liquidity, addLocalEvent]);

  // Convert time-series to StateTensor
  const timeSeriesToStateTensor = (): StateTensor => ({
    spatial: { x: timeSeries.length, y: 1, z: 1 },
    temporal: { t: timeSeries.length, dt: 1 },
    features: {
      volatility,
      interestRate,
      liquidity,
      avgPrice: timeSeries.reduce((sum, d) => sum + d.price, 0) / (timeSeries.length || 1),
      avgVolume: timeSeries.reduce((sum, d) => sum + d.volume, 0) / (timeSeries.length || 1),
    },
  });

  // Create a financial policy
  const createPolicy = useCallback(() => {
    addLocalEvent(`Created portfolio optimization policy proposal with Volatility parameters.`, 'interaction');
  }, [addLocalEvent]);

  return (
    <div className="bg-[#F5F2ED] border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
      <div className="flex items-center gap-2 border-b-2 border-[#1A1A1A] pb-4 mb-6">
        <div className="bg-[#1A1A1A] text-white p-1.5">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-[#1A1A1A] text-base uppercase tracking-wider">01. ECONOMIC & FINANCE LAB</h2>
          <span className="text-[10px] font-mono opacity-60">SMC v2.0 Economic Simulation Engine</span>
        </div>
      </div>

      {/* Grid Layout for controls and graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-4 pb-2 border-b border-neutral-200">
              Simulation Parameters
            </h3>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold uppercase text-[#1A1A1A]">
                  <span>Volatility</span>
                  <span className="font-mono text-emerald-600">{volatility.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.01"
                  value={volatility}
                  onChange={(e) => setVolatility(Number(e.target.value))}
                  className="w-full accent-[#1A1A1A]"
                />
                <span className="text-[9px] font-mono text-neutral-500">Controls amplitude of random pricing shocks.</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold uppercase text-[#1A1A1A]">
                  <span>Interest Rate</span>
                  <span className="font-mono text-emerald-600">{(interestRate * 100).toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.2"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-[#1A1A1A]"
                />
                <span className="text-[9px] font-mono text-neutral-500">Baseline growth rate multiplier.</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold uppercase text-[#1A1A1A]">
                  <span>Liquidity</span>
                  <span className="font-mono text-emerald-600">{liquidity.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={liquidity}
                  onChange={(e) => setLiquidity(Number(e.target.value))}
                  className="w-full accent-[#1A1A1A]"
                />
                <span className="text-[9px] font-mono text-neutral-500">Volume generation dampening threshold.</span>
              </div>
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t border-neutral-100">
              <button
                onClick={generateTimeSeries}
                className="flex-1 px-3 py-2 text-xs font-bold bg-[#1A1A1A] hover:bg-[#333333] text-white transition border border-[#1A1A1A] cursor-pointer text-center uppercase tracking-wider"
              >
                Simulate Markets
              </button>
              <button
                onClick={createPolicy}
                className="px-3 py-2 text-xs font-bold bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500 transition cursor-pointer uppercase tracking-wider"
              >
                Propose Portfolio
              </button>
            </div>
          </div>

          {/* StateTensor Display */}
          <div className="bg-[#1A1A1A] text-[#F5F2ED] p-4 border-2 border-[#1A1A1A] font-mono text-[10px] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            <span className="text-emerald-400 font-bold uppercase tracking-widest text-[9px] block mb-2">
              StateTensor Output
            </span>
            <pre className="overflow-x-auto leading-relaxed text-neutral-300">
              {JSON.stringify(timeSeriesToStateTensor(), null, 2)}
            </pre>
          </div>
        </div>

        {/* Charts & Visualization Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-200">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                Asset Price & Volume Field
              </h3>
              <div className="flex gap-4 text-[10px] font-mono text-neutral-600">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-emerald-500 border border-emerald-600 block" /> Buy Shock
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-rose-500 border border-rose-600 block" /> Sell Shock
                </span>
              </div>
            </div>

            <div className="h-64 relative bg-[#FCFAF7] border border-neutral-200 p-2">
              <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                {/* Horizontal reference lines */}
                <line x1="0" y1="25" x2="100" y2="25" stroke="#E2E8F0" strokeWidth="0.25" strokeDasharray="1,1" />
                <line x1="0" y1="12.5" x2="100" y2="12.5" stroke="#E2E8F0" strokeWidth="0.25" strokeDasharray="1,1" />
                <line x1="0" y1="37.5" x2="100" y2="37.5" stroke="#E2E8F0" strokeWidth="0.25" strokeDasharray="1,1" />

                {/* Draw price path line */}
                <path
                  d={`M ${timeSeries.map((d, i) => `${(i / (timeSeries.length - 1)) * 100} ${50 - (d.price - 80) * 1.2}`).join(' L ')}`}
                  fill="none"
                  stroke="#1A1A1A"
                  strokeWidth="0.75"
                />

                {/* Draw points indicating positive/negative changes */}
                {timeSeries.map((d, i) => {
                  if (i === 0) return null;
                  const prev = timeSeries[i - 1];
                  const isUp = d.price >= prev.price;
                  const x = (i / (timeSeries.length - 1)) * 100;
                  const y = 50 - (d.price - 80) * 1.2;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="1"
                      fill={isUp ? '#10B981' : '#EF4444'}
                      stroke="#1A1A1A"
                      strokeWidth="0.15"
                    />
                  );
                })}
              </svg>
              <div className="absolute top-2 left-2 text-[8px] font-mono bg-white/80 px-1 border border-neutral-100">
                Max Price: ${(Math.max(...timeSeries.map(d => d.price))).toFixed(2)}
              </div>
              <div className="absolute bottom-2 left-2 text-[8px] font-mono bg-white/80 px-1 border border-neutral-100">
                Min Price: ${(Math.min(...timeSeries.map(d => d.price))).toFixed(2)}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#FCFAF7] border border-neutral-200">
                <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase">Average Price</span>
                <p className="text-lg font-mono font-bold text-[#1A1A1A]">
                  ${(timeSeries.reduce((sum, d) => sum + d.price, 0) / (timeSeries.length || 1)).toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-[#FCFAF7] border border-neutral-200">
                <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase">Average Volume</span>
                <p className="text-lg font-mono font-bold text-[#1A1A1A]">
                  {(timeSeries.reduce((sum, d) => sum + d.volume, 0) / (timeSeries.length || 1)).toFixed(0)} units
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
              setLocalEvents([{ time: 0, details: "Simulation reset. State tensor purged.", type: "info" }]);
              addLocalEvent("Economic simulation states reset.", "info");
            }}
            hardwareState={hardwareState}
          />
        </div>
      </div>
    </div>
  );
}
