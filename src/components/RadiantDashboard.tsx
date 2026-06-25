import React, { useState, useEffect, useRef } from 'react';
import { Zap, Flame, Sun, Sliders, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RadiantDashboardProps {
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
  heatFactor: number;
}

export default function RadiantDashboard({ onLogEvent, heatFactor }: RadiantDashboardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [particlesCount, setParticlesCount] = useState<number>(64);
  const [coherence, setCoherence] = useState<number>(0.9992);
  const [magneticPower, setMagneticPower] = useState<number>(50);
  const [temperature, setTemperature] = useState<number>(312.15); // Kelvin
  const [isPlasma, setIsPlasma] = useState<boolean>(false);

  // Synchronize internal temperature scale with global heat factor
  useEffect(() => {
    setTemperature(parseFloat((312.15 * heatFactor).toFixed(2)));
  }, [heatFactor]);

  // Particle physics simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      if (canvas) {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      }
    });
    resizeObserver.observe(canvas);

    // Initialize particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      charge: number;
    }> = [];

    const colors = isPlasma 
      ? ['rgba(168, 85, 247, 0.8)', 'rgba(236, 72, 153, 0.8)', 'rgba(99, 102, 241, 0.8)']
      : ['rgba(239, 68, 68, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(59, 130, 246, 0.8)'];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 4 * heatFactor,
        vy: (Math.random() - 0.5) * 4 * heatFactor,
        size: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        charge: Math.random() > 0.5 ? 1 : -1
      });
    }

    const drawSimulation = () => {
      ctx.fillStyle = '#1A1A1A'; // Deep dark canvas for Radiant chamber
      ctx.fillRect(0, 0, width, height);

      // Draw vector field lines (magnetic cage)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const step = 20;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw magnetic shield circle in the center
      const centerX = width / 2;
      const centerY = height / 2;
      const cageRadius = Math.min(width, height) * 0.35 * (magneticPower / 50);

      ctx.beginPath();
      ctx.arc(centerX, centerY, cageRadius, 0, Math.PI * 2);
      ctx.strokeStyle = isPlasma ? 'rgba(168, 85, 247, 0.25)' : 'rgba(239, 68, 68, 0.25)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Update & render particles
      particles.forEach(p => {
        // Core physics equation: Lorentz-like attraction to center (magnetic cage force)
        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > cageRadius) {
          // Attract back with a force proportional to magnetic power
          const force = (magneticPower / 1200) * (dist - cageRadius);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Kinetic heat drift
        p.x += p.vx * heatFactor;
        p.y += p.vy * heatFactor;

        // Boundary bounce
        if (p.x < 0 || p.x > width) { p.vx *= -1; p.x = p.x < 0 ? 0 : width; }
        if (p.y < 0 || p.y > height) { p.vy *= -1; p.y = p.y < 0 ? 0 : height; }

        // Render particle with glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Draw brief connection line to close neighbors to show spatial field mesh
        particles.forEach(other => {
          if (p === other) return;
          const odx = other.x - p.x;
          const ody = other.y - p.y;
          const odist = Math.sqrt(odx * odx + ody * ody);
          if (odist < 35) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = isPlasma ? 'rgba(168, 85, 247, 0.12)' : 'rgba(239, 68, 68, 0.1)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      // Overlay magnetic grid coordinates
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '8px monospace';
      ctx.fillText(`CAGE_RAD: ${cageRadius.toFixed(0)}px`, 15, 20);
      ctx.fillText(`THERMAL_VIBRATION: ${(heatFactor * 100).toFixed(0)}Hz`, 15, 32);
      ctx.fillText(`COHERENCE: ${coherence.toFixed(4)}`, 15, 44);

      animationId = requestAnimationFrame(drawSimulation);
    };

    drawSimulation();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [particlesCount, isPlasma, magneticPower, heatFactor, coherence]);

  const handleInjectHighEnergy = () => {
    onLogEvent(`Injecting high-velocity alpha photon into RADIANT-CORE chamber...`, 'physics');
    
    // Spark animation trigger by dropping coherence temporarily
    setCoherence(0.8123);
    const prevCount = particlesCount;
    setParticlesCount(prev => prev + 12);
    
    setTimeout(() => {
      setCoherence(0.9992);
      setParticlesCount(prevCount);
      onLogEvent(`RADIANT-CORE thermal shock successfully dampened. Grid coherence restored.`, 'physics');
    }, 2500);
  };

  const handleInduceMagneticShock = () => {
    onLogEvent(`Inducing magnetic barrier shock perturbation on physical manifold...`, 'physics');
    const prevPower = magneticPower;
    setMagneticPower(10);
    
    setTimeout(() => {
      setMagneticPower(prevPower);
      onLogEvent(`Magnetic shield cage reconstituted automatically. Core particles locked.`, 'physics');
    }, 3000);
  };

  return (
    <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-4 mb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">Spatial & Physics Layer</span>
          <h2 className="text-2xl font-serif font-black uppercase text-[#1A1A1A] flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500 animate-pulse" /> RADIANT LAB
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#1A1A1A] text-white px-3 py-1.5 text-xs font-mono flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-red-400" />
            TEMP: <span className="font-bold text-red-400">{temperature} K</span>
          </div>
          <div className="border border-[#1A1A1A] px-3 py-1.5 text-xs font-mono bg-[#F5F2ED] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            COHERENCE: <span className="font-bold text-emerald-700">{(coherence * 100).toFixed(2)}%</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-700 italic mb-4 leading-relaxed font-serif">
        Radiant Lab monitors high-energy fields, thermal vector gradients, and plasma dispersion states. It simulates physical reactions within electromagnetic boundaries.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Particle Canvas viewport */}
        <div className="lg:col-span-8 border-2 border-[#1A1A1A] h-[260px] relative overflow-hidden bg-[#1A1A1A]">
          <canvas ref={canvasRef} className="w-full h-full block" />
          <div className="absolute bottom-3 right-3 bg-black/70 border border-white/20 text-[10px] text-emerald-400 font-mono px-2 py-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            PARTICLE METERS ACTIVE
          </div>
        </div>

        {/* Sliders & Physics controls */}
        <div className="lg:col-span-4 flex flex-col justify-between border border-[#1A1A1A] p-4 bg-[#F5F2ED]/40">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-[#1A1A1A] flex items-center gap-1.5 border-b border-[#1A1A1A]/10 pb-2 mb-3">
              <Sliders className="w-3.5 h-3.5" /> Magnetic Cage Tuning
            </h3>

            {/* Density slider */}
            <div className="mb-4">
              <div className="flex justify-between text-[11px] font-mono mb-1 text-slate-700">
                <span>Particle Density</span>
                <span>{particlesCount} u</span>
              </div>
              <input
                type="range"
                min="20"
                max="120"
                value={particlesCount}
                onChange={e => setParticlesCount(parseInt(e.target.value))}
                className="w-full accent-[#1A1A1A]"
              />
            </div>

            {/* Magnetic Power slider */}
            <div className="mb-4">
              <div className="flex justify-between text-[11px] font-mono mb-1 text-slate-700">
                <span>Electromagnet Deflection</span>
                <span>{magneticPower}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={magneticPower}
                onChange={e => setMagneticPower(parseInt(e.target.value))}
                className="w-full accent-[#1A1A1A]"
              />
            </div>

            {/* State selector */}
            <div className="flex items-center justify-between text-xs font-mono bg-white p-2 border border-[#1A1A1A]">
              <span className="text-[#1A1A1A] flex items-center gap-1 font-bold">
                <Sun className="w-3.5 h-3.5" /> Plasma State
              </span>
              <button
                onClick={() => {
                  setIsPlasma(!isPlasma);
                  onLogEvent(`Toggled RADIANT particle ionization: ${!isPlasma ? 'HIGH PLASMA' : 'STANDARD MOLTEN'}`, 'physics');
                }}
                className={`px-2 py-0.5 text-[9px] font-bold border border-[#1A1A1A] cursor-pointer ${isPlasma ? 'bg-[#1A1A1A] text-white' : 'bg-transparent text-[#1A1A1A]'}`}
              >
                {isPlasma ? 'IONIZED' : 'NEUTRAL'}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={handleInjectHighEnergy}
              className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white py-2 px-3 text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Inject High-Energy Photon
            </button>
            <button
              onClick={handleInduceMagneticShock}
              className="w-full bg-white hover:bg-[#F5F2ED] text-[#1A1A1A] border border-[#1A1A1A] py-2 px-3 text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Induce Magnetic Shock
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
