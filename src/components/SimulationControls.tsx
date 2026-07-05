/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Terminal, Filter, Cpu } from 'lucide-react';
import { HardwareState } from '../types';

interface SimulationControlsProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  temporalEvents: { time: number; details: string; type: 'info' | 'physics' | 'interaction' }[];
  onResetSimulation: () => void;
  hardwareState?: HardwareState;
}

export default function SimulationControls({
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  temporalEvents,
  onResetSimulation,
  hardwareState
}: SimulationControlsProps) {
  const [filter, setFilter] = useState<'all' | 'info' | 'physics' | 'interaction'>('all');
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll terminal log to the bottom when new items appear without disrupting window scroll
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [temporalEvents]);

  const filteredEvents = temporalEvents.filter(
    (e) => filter === 'all' || e.type === filter
  );

  return (
    <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] rounded-none flex flex-col gap-4 mt-2">
      {/* Simulation Controls HUD */}
      <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-black" />
          <h2 className="font-bold text-[#1A1A1A] tracking-tight text-sm font-serif">Temporal Engine & Memory</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 transition border cursor-pointer rounded-none ${
              isPlaying
                ? 'bg-[#E05A36] hover:bg-[#C94E2C] text-white border-[#1A1A1A]'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white border-[#1A1A1A]'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={onResetSimulation}
            title="Reset Simulation Grid"
            className="p-2 bg-white hover:bg-[#F5F2ED] text-black border border-[#1A1A1A] rounded-none transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex items-center border border-[#1A1A1A] bg-white rounded-none p-0.5 text-xs font-mono">
            <button
              onClick={() => setSpeed(1)}
              className={`px-2 py-0.5 rounded-none cursor-pointer transition ${speed === 1 ? 'bg-[#1A1A1A] text-white font-bold' : 'text-black hover:bg-[#F5F2ED]'}`}
            >
              1x
            </button>
            <button
              onClick={() => setSpeed(2)}
              className={`px-2 py-0.5 rounded-none cursor-pointer transition ${speed === 2 ? 'bg-[#1A1A1A] text-white font-bold' : 'text-black hover:bg-[#F5F2ED]'}`}
            >
              2x
            </button>
            <button
              onClick={() => setSpeed(4)}
              className={`px-2 py-0.5 rounded-none cursor-pointer transition ${speed === 4 ? 'bg-[#1A1A1A] text-white font-bold' : 'text-black hover:bg-[#F5F2ED]'}`}
            >
              4x
            </button>
          </div>
        </div>
      </div>

      {/* Terminal View: Temporal World Memory */}
      <div className="flex flex-col gap-2 bg-[#FCFAF7] border border-[#1A1A1A] rounded-none p-3.5">
        <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
          <div className="flex items-center gap-1.5 text-black text-xs font-mono font-bold">
            <Terminal className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-300 text-[9px] uppercase font-bold tracking-wider rounded-none">STEP 07 • PERSISTENT MEMORY LEDGER</span>
          </div>

          <div className="flex gap-1">
            {(['all', 'info', 'physics', 'interaction'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`text-[9px] font-mono uppercase px-2 py-0.5 border transition cursor-pointer rounded-none ${
                  filter === opt
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] font-bold'
                    : 'bg-white text-black border-[#1A1A1A] hover:bg-[#F5F2ED]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Event Logs Feed */}
        <div 
          ref={scrollContainerRef}
          className="h-[140px] overflow-y-auto font-mono text-[10px] space-y-2 pr-1 scrollbar-thin"
        >
          {filteredEvents.length === 0 ? (
            <div className="text-slate-500 italic text-center py-6 font-serif">No temporal vector changes recorded yet.</div>
          ) : (
            filteredEvents.map((evt, idx) => (
              <div key={idx} className="flex gap-1.5 leading-relaxed items-start">
                <span className="text-slate-600 font-bold shrink-0">[{evt.time}s]</span>
                <span className={`px-1 py-0.2 font-bold shrink-0 uppercase text-[8px] border rounded-none ${
                  evt.type === 'physics' ? 'bg-rose-100 text-rose-950 border-rose-600' :
                  evt.type === 'interaction' ? 'bg-emerald-100 text-emerald-950 border-emerald-600' :
                  'bg-[#EBE8E3] text-black border-[#1A1A1A]'
                }`}>
                  {evt.type}
                </span>
                <span className="text-slate-900 font-serif italic">"{evt.details}"</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Live State Legend HUD */}
      <div className="flex items-center justify-between text-[9px] font-mono text-black px-3.5 py-2.5 bg-[#EBE8E3]/50 border border-[#1A1A1A] rounded-none">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 bg-[#1B6A43] border border-[#1A1A1A] rounded-none" />
          <span>Active Ecologies</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 bg-[#E05A36] border border-[#1A1A1A] rounded-none" />
          <span>Specialist Citizens</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 bg-[#1A1A1A] border border-[#FFFFFF] rounded-none" />
          <span>Fluid Energy Cells</span>
        </div>
      </div>
    </div>
  );
}
