import React, { useState, useEffect, useRef } from 'react';
import { Wind, Droplet, Sparkles, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface AromeaDashboardProps {
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
  windVector: { x: number; y: number };
  diffusionRate: number;
}

interface AromaCompound {
  name: string;
  chemicalFormula: string;
  volatility: number;
  decayRate: number;
  color: string;
}

export default function AromeaDashboard({ onLogEvent, windVector, diffusionRate }: AromeaDashboardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [compounds] = useState<AromaCompound[]>([
    { name: 'Carbon Catalyst-B', chemicalFormula: 'C₆₀-CAT', volatility: 0.85, decayRate: 0.02, color: 'rgba(52, 211, 153, 0.4)' },
    { name: 'Eucalyptus Biome Mist', chemicalFormula: 'C₁₀H₁₈O', volatility: 0.65, decayRate: 0.04, color: 'rgba(59, 130, 246, 0.4)' },
    { name: 'Synthetic Ozone Shield', chemicalFormula: 'O₃-SYN', volatility: 0.95, decayRate: 0.08, color: 'rgba(168, 85, 247, 0.4)' },
    { name: 'Quantum Hydride Vapor', chemicalFormula: 'H₄-Q', volatility: 0.50, decayRate: 0.01, color: 'rgba(251, 191, 36, 0.4)' }
  ]);
  const [selectedCompound, setSelectedCompound] = useState<AromaCompound>(compounds[0]);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; alpha: number; vx: number; vy: number; radius: number }>>([]);
  const [showFlowVectors, setShowFlowVectors] = useState<boolean>(true);

  // Olfactory telemetry stats
  const [concentration, setConcentration] = useState<number>(0.34);
  const [decaySpeed, setDecaySpeed] = useState<string>('Standard (Linear)');

  // Gas diffusion simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // Resize
    const resizeObserver = new ResizeObserver(() => {
      if (canvas) {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      }
    });
    resizeObserver.observe(canvas);

    const updateParticles = () => {
      ctx.fillStyle = '#FCFAF7'; // Sand paper light background
      ctx.fillRect(0, 0, width, height);

      // Draw flowing wind vectors background to demonstrate wind direction
      if (showFlowVectors) {
        ctx.strokeStyle = 'rgba(26, 26, 26, 0.04)';
        ctx.lineWidth = 1;
        const gridSpace = 30;
        for (let x = gridSpace / 2; x < width; x += gridSpace) {
          for (let y = gridSpace / 2; y < height; y += gridSpace) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            // Draw brief vector pointing along windVector
            ctx.lineTo(
              x + windVector.x * 12 * diffusionRate,
              y + windVector.y * 12 * diffusionRate
            );
            ctx.stroke();

            // Arrow head
            ctx.fillStyle = 'rgba(26, 26, 26, 0.04)';
            ctx.beginPath();
            ctx.arc(x + windVector.x * 12 * diffusionRate, y + windVector.y * 12 * diffusionRate, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Update and render chemical diffusion gas particles
      setParticles(prev => {
        const nextParticles = prev
          .map(p => {
            // Apply wind drift (advection) + random chaotic thermal perturbation (diffusion)
            const randomX = (Math.random() - 0.5) * 1.5 * diffusionRate;
            const randomY = (Math.random() - 0.5) * 1.5 * diffusionRate;

            return {
              ...p,
              x: p.x + windVector.x * 1.8 * diffusionRate + randomX,
              y: p.y + windVector.y * 1.8 * diffusionRate + randomY,
              // Slowly expand radius as it diffuses
              radius: p.radius + 0.15 * diffusionRate,
              // Chemical decay/decay rate
              alpha: p.alpha - selectedCompound.decayRate
            };
          })
          // Keep only visible particles
          .filter(p => p.alpha > 0.02 && p.x > -50 && p.x < width + 50 && p.y > -50 && p.y < height + 50);

        // Update real-time metric based on active particles count
        setConcentration(parseFloat((nextParticles.length * 0.012).toFixed(3)));

        // Draw chemical cloud particles
        nextParticles.forEach(p => {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          // Extract RGB from compound and inject alpha
          const colorBase = selectedCompound.color.replace('0.4', p.alpha.toFixed(2));
          const colorEdge = selectedCompound.color.replace('0.4', '0.0');

          grad.addColorStop(0, colorBase);
          grad.addColorStop(1, colorEdge);

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        });

        return nextParticles;
      });

      // Canvas boundary labeling
      ctx.fillStyle = '#1A1A1A';
      ctx.font = 'bold 8px monospace';
      ctx.fillText(`WIND_FORCE: [x:${windVector.x.toFixed(1)}, y:${windVector.y.toFixed(1)}]`, 15, 20);
      ctx.fillText(`DIFFUSION_COEFF: ${diffusionRate.toFixed(2)}x`, 15, 30);
      ctx.fillText(`COMPOUND: ${selectedCompound.name} (${selectedCompound.chemicalFormula})`, 15, 40);

      animationId = requestAnimationFrame(updateParticles);
    };

    updateParticles();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [particles, windVector, diffusionRate, selectedCompound, showFlowVectors]);

  const handleReleaseAerosol = () => {
    // Generate a burst of 50 gas particles in the middle of the canvas
    onLogEvent(`Releasing custom aerosol spray of ${selectedCompound.name} [${selectedCompound.chemicalFormula}]...`, 'physics');
    
    const burst: Array<{ x: number; y: number; alpha: number; vx: number; vy: number; radius: number }> = [];
    const canvas = canvasRef.current;
    const startX = canvas ? canvas.width / 2 : 150;
    const startY = canvas ? canvas.height / 2 : 100;

    for (let i = 0; i < 45; i++) {
      burst.push({
        x: startX + (Math.random() - 0.5) * 20,
        y: startY + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        alpha: Math.random() * 0.4 + 0.6,
        radius: Math.random() * 15 + 10
      });
    }

    setParticles(prev => [...prev, ...burst]);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    onLogEvent(`Localized olfactory plume introduced at sensor click (${clickX.toFixed(0)}, ${clickY.toFixed(0)})`, 'physics');

    // Introduce localized puff
    const burst: Array<{ x: number; y: number; alpha: number; vx: number; vy: number; radius: number }> = [];
    for (let i = 0; i < 20; i++) {
      burst.push({
        x: clickX + (Math.random() - 0.5) * 10,
        y: clickY + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        alpha: Math.random() * 0.4 + 0.6,
        radius: Math.random() * 10 + 8
      });
    }
    setParticles(prev => [...prev, ...burst]);
  };

  const handleTriggerNeutralizer = () => {
    onLogEvent(`Spraying biochemical cleaning agent to neutralize atmospheric emissions...`, 'physics');
    setParticles([]);
  };

  return (
    <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-4 mb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">Sensory & Substrate Layer</span>
          <h2 className="text-2xl font-serif font-black uppercase text-[#1A1A1A] flex items-center gap-2">
            <Wind className="w-6 h-6 text-emerald-600" /> AROMEA AI
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#1A1A1A] text-white px-3 py-1.5 text-xs font-mono flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5 text-emerald-400" />
            CONC: <span className="font-bold text-emerald-400">{concentration.toFixed(3)} ppm</span>
          </div>
          <div className="border border-[#1A1A1A] px-3 py-1.5 text-xs font-mono bg-[#FCFAF7] flex items-center gap-1">
            <Wind className="w-3.5 h-3.5 text-blue-600" />
            WIND: <span className="font-bold text-slate-800">{(Math.sqrt(windVector.x*windVector.x + windVector.y*windVector.y)).toFixed(1)} m/s</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-700 italic mb-4 leading-relaxed font-serif">
        Aromea AI analyzes gaseous emissions, chemical gradients, and olfactory plume advection, mapping dispersion behaviors against dynamic atmospheric wind and boundary pressures.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Gas plume Canvas */}
        <div className="lg:col-span-8 border-2 border-[#1A1A1A] h-[260px] relative overflow-hidden bg-[#FCFAF7] cursor-crosshair group">
          <canvas ref={canvasRef} onClick={handleCanvasClick} className="w-full h-full block" />
          
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFlowVectors(!showFlowVectors);
              }}
              className="bg-white/95 border border-[#1A1A1A] text-[9px] font-mono text-black px-2 py-1 flex items-center gap-1 hover:bg-slate-100 cursor-pointer"
            >
              {showFlowVectors ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              {showFlowVectors ? 'FLOW VECTOR ON' : 'FLOW VECTOR OFF'}
            </button>
          </div>

          <div className="absolute bottom-3 left-3 bg-white/95 border border-[#1A1A1A] text-[9px] text-slate-600 font-mono px-2 py-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            Click canvas to spray chemical compound plumes
          </div>
        </div>

        {/* Compound Selector & Actions */}
        <div className="lg:col-span-4 flex flex-col justify-between border border-[#1A1A1A] p-4 bg-[#F5F2ED]/40">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-[#1A1A1A] border-b border-[#1A1A1A]/10 pb-2 mb-3">
              Molecular Formulation
            </h3>

            {/* Selector list */}
            <div className="space-y-1.5 mb-4">
              {compounds.map(comp => (
                <button
                  key={comp.name}
                  onClick={() => {
                    setSelectedCompound(comp);
                    onLogEvent(`Selected olfactory tracer compound: ${comp.name}`, 'info');
                  }}
                  className={`w-full text-left p-2 text-xs font-mono border transition flex items-center justify-between cursor-pointer ${
                    selectedCompound.name === comp.name
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-white text-slate-800 border-[#1A1A1A]/20 hover:border-[#1A1A1A]'
                  }`}
                >
                  <span>{comp.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-none font-bold ${selectedCompound.name === comp.name ? 'bg-amber-400 text-black' : 'bg-[#F5F2ED] text-slate-600'}`}>
                    {comp.chemicalFormula}
                  </span>
                </button>
              ))}
            </div>

            <div className="text-[10px] bg-white border border-[#1A1A1A] p-2.5 font-mono text-slate-600 leading-normal">
              <strong className="text-black uppercase block mb-0.5">Physical profile:</strong>
              Volatility: {(selectedCompound.volatility * 100).toFixed(0)}%<br />
              Decay Halflife: {(1 / selectedCompound.decayRate).toFixed(0)} cycles
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={handleReleaseAerosol}
              className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white py-2 px-3 text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Droplet className="w-3.5 h-3.5 text-emerald-400" /> Release Aerosol Spray
            </button>
            <button
              onClick={handleTriggerNeutralizer}
              className="w-full bg-white hover:bg-[#F5F2ED] text-[#1A1A1A] border border-[#1A1A1A] py-2 px-3 text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" /> Neutralize Air Emissions
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
