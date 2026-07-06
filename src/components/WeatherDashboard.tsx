/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { StateTensor, HardwareState, WorldState } from '../types';
import SpatialCanvas from './SpatialCanvas';
import SimulationControls from './SimulationControls';
import { Wind } from 'lucide-react';

type WeatherDashboardProps = {
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
  worldState: WorldState;
  hardwareState?: HardwareState;
};

export default function WeatherDashboard({
  onLogEvent,
  worldState,
  hardwareState,
}: WeatherDashboardProps) {
  const [temperature, setTemperature] = useState(20);
  const [humidity, setHumidity] = useState(50);
  const [windSpeed, setWindSpeed] = useState(10);
  const [windDirection, setWindDirection] = useState(45);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [localEvents, setLocalEvents] = useState<{ time: number; details: string; type: 'info' | 'physics' | 'interaction' }[]>([
    { time: 0, details: "Fluid dynamics and atmospheric lab active.", type: "info" }
  ]);

  const addLocalEvent = useCallback((details: string, type: 'info' | 'physics' | 'interaction') => {
    setLocalEvents(prev => [...prev, { time: prev.length, details, type }]);
    onLogEvent(details, type);
  }, [onLogEvent]);

  // Convert settings to StateTensor
  const gridToStateTensor = (): StateTensor => ({
    spatial: { x: 32, y: 32, z: 1 },
    temporal: { t: 0, dt: 1 },
    features: {
      temperature,
      humidity,
      windSpeed,
      windDirection,
      heatFactor: worldState.heatFactor,
    },
  });

  const handleUpdateAtmosphere = useCallback(() => {
    addLocalEvent(`Configured fluid vector grid. Speed: ${windSpeed} km/h, Angle: ${windDirection}°, Ambient Temperature: ${temperature}°C`, 'physics');
  }, [windSpeed, windDirection, temperature, addLocalEvent]);

  return (
    <div className="bg-[#F5F2ED] border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
      <div className="flex items-center gap-2 border-b-2 border-[#1A1A1A] pb-4 mb-6">
        <div className="bg-[#1A1A1A] text-white p-1.5">
          <Wind className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-[#1A1A1A] text-base uppercase tracking-wider">02. CLIMATE & ATMOSPHERIC FLUID LAB</h2>
          <span className="text-[10px] font-mono opacity-60">SMC v2.0 Atmospheric Model Integration</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-4 pb-2 border-b border-neutral-200">
              Atmospheric Boundary States
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-[#1A1A1A]">Temperature (°C)</label>
                <input
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="p-2 text-xs border-2 border-[#1A1A1A] bg-transparent font-mono focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-[#1A1A1A]">Humidity (%)</label>
                <input
                  type="number"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className="p-2 text-xs border-2 border-[#1A1A1A] bg-transparent font-mono focus:outline-none"
                  min="0"
                  max="100"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-[#1A1A1A]">Wind Speed (km/h)</label>
                <input
                  type="number"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                  className="p-2 text-xs border-2 border-[#1A1A1A] bg-transparent font-mono focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-[#1A1A1A]">Wind Vector Angle (°)</label>
                <input
                  type="number"
                  value={windDirection}
                  onChange={(e) => setWindDirection(Number(e.target.value))}
                  className="p-2 text-xs border-2 border-[#1A1A1A] bg-transparent font-mono focus:outline-none"
                  min="0"
                  max="360"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t border-neutral-100">
              <button
                onClick={handleUpdateAtmosphere}
                className="w-full px-3 py-2 text-xs font-bold bg-[#1A1A1A] hover:bg-[#333333] text-white transition border border-[#1A1A1A] cursor-pointer text-center uppercase tracking-wider"
              >
                Apply Boundary Values
              </button>
            </div>
          </div>

          {/* StateTensor */}
          <div className="bg-[#1A1A1A] text-[#F5F2ED] p-4 border-2 border-[#1A1A1A] font-mono text-[10px] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            <span className="text-emerald-400 font-bold uppercase tracking-widest text-[9px] block mb-2">
              Atmospheric StateTensor
            </span>
            <pre className="overflow-x-auto leading-relaxed text-neutral-300">
              {JSON.stringify(gridToStateTensor(), null, 2)}
            </pre>
          </div>
        </div>

        {/* Visualizer Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-4 pb-2 border-b border-neutral-200">
              Atmospheric Spatial Field Visualization
            </h3>
            
            {/* Embedded Spatial Canvas representing Wind Vectors */}
            <SpatialCanvas
              worldState={{
                ...worldState,
                windVector: {
                  x: windSpeed * Math.cos((windDirection * Math.PI) / 180) * 0.1,
                  y: windSpeed * Math.sin((windDirection * Math.PI) / 180) * 0.1,
                },
                diffusionRate: humidity / 100,
                heatFactor: (temperature + 273.15) / 300, // Kelvin scale fraction
              }}
              selectedPolicy={null}
              policies={[]}
              onCanvasClick={() => {}}
              showSpatialGraph={true}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              speed={speed}
              temporalEvents={localEvents}
              addTemporalEvent={addLocalEvent}
              hardwareState={hardwareState}
            />
            <p className="text-[10px] font-mono text-neutral-500 mt-2 italic leading-relaxed text-center">
              *The canvas demonstrates vector currents, thermal diffusion, and particle turbulence scaled from controls.*
            </p>
          </div>

          {/* Local simulation console */}
          <SimulationControls
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            speed={speed}
            setSpeed={setSpeed}
            temporalEvents={localEvents}
            onResetSimulation={() => {
              setLocalEvents([{ time: 0, details: "Atmospheric simulation reset.", type: "info" }]);
              addLocalEvent("Boundary states returned to original equilibrium.", "info");
            }}
            hardwareState={hardwareState}
          />
        </div>
      </div>
    </div>
  );
}
