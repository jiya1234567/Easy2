import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, RefreshCw, AlertTriangle, ShieldCheck, Snowflake } from 'lucide-react';
import { HardwareState } from '../types';

interface StonedDashboardProps {
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
  hardwareState?: HardwareState;
  bitErrorRate?: number;
}

interface RegisterNode {
  id: number;
  row: number;
  col: number;
  hexValue: string;
  status: 'normal' | 'error';
  temperature: number; // mK
}

export default function StonedDashboard({ onLogEvent, hardwareState, bitErrorRate }: StonedDashboardProps) {
  const [nodes, setNodes] = useState<RegisterNode[]>([]);
  const [gateFidelity, setGateFidelity] = useState<number>(0.9992);
  const [temperature, setTemperature] = useState<number>(12); // mK
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);

  // Initialize the 8x8 grid of register cells
  useEffect(() => {
    const initialNodes: RegisterNode[] = [];
    const hexChars = '0123456789ABCDEF';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const val = hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)];
        initialNodes.push({
          id: r * 8 + c,
          row: r,
          col: c,
          hexValue: val,
          status: 'normal',
          temperature: 12 + Math.random() * 2 - 1
        });
      }
    }
    setNodes(initialNodes);
  }, []);

  // Simulating silicon cycles ticking: slightly randomize register hex values
  useEffect(() => {
    if (isCalibrating) return;
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        if (node.status === 'error') return node;
        
        // 5% chance of changing value per tick
        if (Math.random() > 0.08) return node;

        const hexChars = '0123456789ABCDEF';
        const newVal = hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)];
        return {
          ...node,
          hexValue: newVal,
          temperature: temperature + Math.random() * 2 - 1
        };
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, [temperature, isCalibrating]);

  const handleInjectBitFlip = () => {
    onLogEvent(`Injecting high-frequency thermal fault causing register bit-flip...`, 'physics');
    
    setNodes(prev => {
      // Pick a random healthy cell
      const healthyNodes = prev.filter(n => n.status === 'normal');
      if (healthyNodes.length === 0) return prev;
      const target = healthyNodes[Math.floor(Math.random() * healthyNodes.length)];
      
      onLogEvent(`Hardware parity audit failed at Register Node #${target.id} [Row ${target.row}, Col ${target.col}].`, 'physics');

      return prev.map(node => {
        if (node.id === target.id) {
          return {
            ...node,
            hexValue: 'ERR',
            status: 'error',
            temperature: node.temperature + 45 // node heats up during fault
          };
        }
        return node;
      });
    });

    // Degrade gate fidelity
    setGateFidelity(prev => parseFloat(Math.max(0.92, prev - 0.015).toFixed(4)));
  };

  const handleCellClick = (id: number) => {
    setNodes(prev => prev.map(node => {
      if (node.id === id) {
        if (node.status === 'normal') {
          onLogEvent(`Manual bit-flip fault injected on Cell #${id} [Row ${node.row}, Col ${node.col}].`, 'physics');
          setGateFidelity(prev => parseFloat(Math.max(0.92, prev - 0.015).toFixed(4)));
          return { ...node, hexValue: 'ERR', status: 'error', temperature: node.temperature + 45 };
        } else {
          onLogEvent(`Manually cleared fault on Register Node #${id}. Run calibration sweep for full parity restore.`, 'info');
          return { ...node, hexValue: 'AA', status: 'normal', temperature: temperature };
        }
      }
      return node;
    }));
  };

  const handleCalibrateNodes = () => {
    setIsCalibrating(true);
    onLogEvent(`Running silicon parity calibration and sweep on qubit registers...`, 'info');

    let row = 0;
    const interval = setInterval(() => {
      // Sweep row by row
      setNodes(prev => prev.map(node => {
        if (node.row === row) {
          const hexChars = '0123456789ABCDEF';
          const newVal = hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)];
          return {
            ...node,
            hexValue: newVal,
            status: 'normal',
            temperature: temperature
          };
        }
        return node;
      }));

      row++;
      if (row >= 8) {
        clearInterval(interval);
        setIsCalibrating(false);
        setGateFidelity(0.9992);
        onLogEvent(`Silicon nodes calibrated. All parity states aligned with distance-21 surface code.`, 'info');
      }
    }, 200);
  };

  const handleCryoQuench = () => {
    onLogEvent(`Activating cryogenic booster loop to quench quantum substrate thermal noise...`, 'physics');
    setTemperature(6);
    setGateFidelity(0.9998);

    setTimeout(() => {
      setTemperature(12);
      setGateFidelity(0.9992);
      onLogEvent(`Cryogenic boost completed. Substrate temperature stabilized back to baseline 12 mK.`, 'physics');
    }, 6000);
  };

  const errorNodesCount = nodes.filter(n => n.status === 'error').length;

  return (
    <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-4 mb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">Sensory & Substrate Layer</span>
          <h2 className="text-2xl font-serif font-black uppercase text-[#1A1A1A] flex items-center gap-2">
            <Cpu className="w-6 h-6 text-indigo-700 animate-pulse" /> STONED.AI
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#1A1A1A] text-white px-3 py-1.5 text-xs font-mono flex items-center gap-1.5">
            <Snowflake className="w-3.5 h-3.5 text-blue-300" />
            CRYO: <span className="font-bold text-blue-300">{temperature.toFixed(0)} mK</span>
          </div>
          <div className="border border-[#1A1A1A] px-3 py-1.5 text-xs font-mono bg-[#FCFAF7] flex items-center gap-1">
            <ShieldCheck className={`w-3.5 h-3.5 ${errorNodesCount > 0 ? 'text-red-600' : 'text-emerald-600'}`} />
            GATE FIDELITY: <span className={`font-bold ${errorNodesCount > 0 ? 'text-red-700 animate-pulse' : 'text-emerald-700'}`}>{(gateFidelity * 100).toFixed(2)}%</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-700 italic mb-4 leading-relaxed font-serif">
        Stoned.ai manages the hardware substrate and silicon layers, tracing decision semantics to bit-level parity states under strict cryo-thermal boundaries.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive 8x8 Register matrix */}
        <div className="lg:col-span-8 flex items-center justify-center border-2 border-[#1A1A1A] p-6 bg-[#1A1A1A] relative">
          <div className="grid grid-cols-8 gap-1.5 max-w-md w-full">
            {nodes.map(node => (
              <button
                key={node.id}
                onClick={() => handleCellClick(node.id)}
                className={`aspect-square border text-[10px] font-mono font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                  node.status === 'error'
                    ? 'bg-red-600 text-white border-red-800 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                    : 'bg-[#2E2E2E] text-slate-300 border-neutral-700 hover:bg-[#3E3E3E] hover:text-white'
                }`}
              >
                <span>{node.hexValue}</span>
                <span className="text-[7px] opacity-40 mt-0.5">#{node.id}</span>
              </button>
            ))}
          </div>

          <div className="absolute bottom-3 left-3 flex gap-4 text-[9px] font-mono text-slate-400">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-600 rounded-none border border-red-800" /> Faulty (ERR)
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-[#2E2E2E] rounded-none border border-neutral-700" /> Healthy State
            </div>
          </div>
        </div>

        {/* Node configuration panel */}
        <div className="lg:col-span-4 flex flex-col justify-between border border-[#1A1A1A] p-4 bg-[#F5F2ED]/40">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-[#1A1A1A] border-b border-[#1A1A1A]/10 pb-2 mb-3">
              Substrate Calibration
            </h3>

            <div className="space-y-2 mb-4 font-mono text-xs">
              <div className="flex justify-between border-b border-dashed border-[#1A1A1A]/10 pb-1">
                <span>Active Core Gates</span>
                <span className="font-bold">64 / 64</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#1A1A1A]/10 pb-1">
                <span>Parity Faults</span>
                <span className={`font-bold ${errorNodesCount > 0 ? 'text-red-600' : 'text-slate-800'}`}>
                  {errorNodesCount} detected
                </span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#1A1A1A]/10 pb-1">
                <span>Fidelity Target</span>
                <span>&gt; 99.90%</span>
              </div>
            </div>

            <div className="text-[10px] bg-white border border-[#1A1A1A] p-2.5 font-mono text-slate-600 leading-relaxed">
              <strong className="text-black uppercase block mb-0.5">Distance-21 surface code:</strong>
              Bit-level errors are automatically flagged and queued for physical sweep alignment during regular parity ticks.
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={handleCalibrateNodes}
              disabled={isCalibrating}
              className="w-full bg-[#1A1A1A] hover:bg-[#333333] disabled:bg-slate-300 text-white py-2 px-3 text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-300 ${isCalibrating ? 'animate-spin' : ''}`} /> Calibrate Silicon Nodes
            </button>
            <button
              onClick={handleCryoQuench}
              className="w-full bg-white hover:bg-[#F5F2ED] text-[#1A1A1A] border border-[#1A1A1A] py-2 px-3 text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Snowflake className="w-3.5 h-3.5 text-blue-600" /> Cryogenic Boost Quench
            </button>
            <button
              onClick={handleInjectBitFlip}
              className="w-full bg-red-50 hover:bg-red-100 border border-red-300 text-red-900 py-2 px-3 text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Inject Bit-Flip Fault
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
