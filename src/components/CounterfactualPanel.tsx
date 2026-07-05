/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WorldState, PolicyProposal, HardwareState } from '../types';
import { ShieldAlert, Flame, Sliders, Wind, HelpCircle, ArrowRight } from 'lucide-react';

interface CounterfactualPanelProps {
  worldState: WorldState;
  setWorldState: React.Dispatch<React.SetStateAction<WorldState>>;
  selectedPolicy: PolicyProposal | null;
  addTemporalEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
  hardwareState?: HardwareState;
}

export default function CounterfactualPanel({
  worldState,
  setWorldState,
  selectedPolicy,
  addTemporalEvent,
  hardwareState
}: CounterfactualPanelProps) {
  const handleWindXChange = (val: number) => {
    setWorldState((prev) => ({
      ...prev,
      windVector: { ...prev.windVector, x: val }
    }));
    addTemporalEvent(`Counterfactual Shift: Adjusting wind X-vector force to ${val} m/s`, 'physics');
  };

  const handleDiffusionChange = (val: number) => {
    setWorldState((prev) => ({ ...prev, diffusionRate: val }));
    addTemporalEvent(`Counterfactual Shift: Adjusting molecular diffusion coefficient to ${val}x`, 'physics');
  };

  const handleGravityChange = (val: number) => {
    setWorldState((prev) => ({ ...prev, gravityFactor: val }));
    addTemporalEvent(`Counterfactual Shift: Modifying gravitational compression vector to ${val}g`, 'physics');
  };

  const handleHeatChange = (val: number) => {
    setWorldState((prev) => ({ ...prev, heatFactor: val }));
    addTemporalEvent(`Counterfactual Shift: Exciting local thermal gradient factor to ${val}°K`, 'physics');
  };

  return (
    <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] rounded-none flex flex-col gap-4 mt-2">
      <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-black" />
          <h2 className="font-bold text-[#1A1A1A] tracking-tight text-sm font-serif">Counterfactual Physics</h2>
        </div>
      </div>

      {/* Physics sliders */}
      <div className="space-y-3.5 bg-[#EBE8E3]/60 border border-[#1A1A1A] p-4 rounded-none text-[#1A1A1A]">
        <span className="text-[10px] font-bold font-mono uppercase text-black block tracking-wide">Tweak Physical Realities</span>

        {/* Wind */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] font-mono font-bold text-black">
            <span className="flex items-center gap-1">
              <Wind className="w-3 h-3 text-black" />
              Wind Vector Force
            </span>
            <span className="text-[#E05A36] font-bold">{worldState.windVector.x > 0 ? '+' : ''}{worldState.windVector.x} m/s</span>
          </div>
          <input
            type="range"
            min="-5"
            max="5"
            step="1"
            value={worldState.windVector.x}
            onChange={(e) => handleWindXChange(Number(e.target.value))}
            className="accent-[#1A1A1A] w-full cursor-ew-resize"
          />
        </div>

        {/* Diffusion */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] font-mono font-bold text-black">
            <span>Molecular Diffusion</span>
            <span className="text-[#E05A36] font-bold">{worldState.diffusionRate}x Coefficient</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="3"
            step="0.1"
            value={worldState.diffusionRate}
            onChange={(e) => handleDiffusionChange(Number(e.target.value))}
            className="accent-[#1A1A1A] w-full cursor-ew-resize"
          />
        </div>

        {/* Gravity */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] font-mono font-bold text-black">
            <span>Gravitational Constants</span>
            <span className="text-[#E05A36] font-bold">{worldState.gravityFactor}g Compression</span>
          </div>
          <input
            type="range"
            min="0"
            max="3"
            step="0.5"
            value={worldState.gravityFactor}
            onChange={(e) => handleGravityChange(Number(e.target.value))}
            className="accent-[#1A1A1A] w-full cursor-ew-resize"
          />
        </div>

        {/* Heat Factor */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] font-mono font-bold text-black">
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-[#E05A36]" />
              Thermal Kinetic Energy
            </span>
            <span className="text-[#E05A36] font-bold">{worldState.heatFactor}x Exchanger</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.5"
            step="0.1"
            value={worldState.heatFactor}
            onChange={(e) => handleHeatChange(Number(e.target.value))}
            className="accent-[#1A1A1A] w-full cursor-ew-resize"
          />
        </div>
      </div>

      {/* Counterfactual Scenario Comparison */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold font-mono uppercase text-black tracking-wide flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-black" />
          <span>Active Counterfactual Modeling</span>
        </span>

        {selectedPolicy && selectedPolicy.simulationData ? (
          <div className="space-y-2.5">
            {selectedPolicy.simulationData.counterfactuals.map((scen, idx) => (
              <div key={idx} className="bg-white border border-[#1A1A1A] p-3.5 rounded-none flex flex-col gap-1.5 font-sans">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-black" />
                  <span className="text-xs font-bold text-[#1A1A1A]">{scen.parameterName}</span>
                </div>
                
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-mono font-bold">
                  <span>{scen.originalValue}</span>
                  <ArrowRight className="w-3 h-3 text-[#E05A36]" />
                  <span className="text-[#1B6A43]">{scen.alternativeValue}</span>
                </div>

                <div className="bg-[#FCFAF7] p-2.5 rounded-none border border-[#1A1A1A] text-xs text-[#1A1A1A] leading-relaxed font-serif">
                  <strong>Expected Impact:</strong> {scen.outcome}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#1A1A1A] rounded-none p-6 text-center text-xs text-slate-600 italic font-serif">
            Select a policy proposal and initiate world simulation to forecast counterfactual outcomes.
          </div>
        )}
      </div>
    </div>
  );
}
