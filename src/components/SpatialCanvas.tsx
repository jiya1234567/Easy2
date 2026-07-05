/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { SpatialObject, WorldState, PolicyProposal, GraphNode, GraphEdge, HardwareState } from '../types';
import { Play, Pause, RotateCcw, Wind, Sparkles, Map, Network, Eye } from 'lucide-react';

interface SpatialCanvasProps {
  worldState: WorldState;
  selectedPolicy: PolicyProposal | null;
  policies: PolicyProposal[];
  onCanvasClick: (coords: { x: number; y: number }) => void;
  showSpatialGraph: boolean;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  temporalEvents: { time: number; details: string; type: string }[];
  addTemporalEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
  hardwareState?: HardwareState;
}

export default function SpatialCanvas({
  worldState,
  selectedPolicy,
  policies,
  onCanvasClick,
  showSpatialGraph,
  isPlaying,
  setIsPlaying,
  speed,
  temporalEvents,
  addTemporalEvent,
  hardwareState
}: SpatialCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);
  const [showFlowField, setShowFlowField] = useState<boolean>(true);
  const [showAgents, setShowAgents] = useState<boolean>(true);

  // Simulation persistent states
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; type: 'carbon' | 'fluid' | 'dust'; life: number; color: string }[]>([]);
  const agentsRef = useRef<{ id: string; x: number; y: number; vx: number; vy: number; faction: 'resident' | 'activist' | 'engineer'; happiness: number; size: number }[]>([]);
  const timeRef = useRef<number>(0);

  // Initialize particles & agents once
  useEffect(() => {
    // Generate static agents representing citizens
    const agents = [];
    const factions: ('resident' | 'activist' | 'engineer')[] = ['resident', 'activist', 'engineer'];
    for (let i = 0; i < 35; i++) {
      agents.push({
        id: `agent-${i}`,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        faction: factions[Math.floor(Math.random() * factions.length)],
        happiness: 50 + Math.random() * 30,
        size: 3 + Math.random() * 3
      });
    }
    agentsRef.current = agents;

    // Generate initial dust/fluid particles
    const particles = [];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        type: Math.random() > 0.4 ? 'fluid' as const : 'carbon' as const,
        life: 100 + Math.random() * 200,
        color: ''
      });
    }
    particlesRef.current = particles;
  }, []);

  // Handle ResizeObserver to support robust, fluid grid resizing
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const size = Math.max(Math.min(width, height, 750), 320);
        setDimensions({ width: size, height: size });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Core Simulation Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      // Clear with elegant off-white paper canvas background
      ctx.fillStyle = '#FCFAF7';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      const scaleX = dimensions.width / 100;
      const scaleY = dimensions.height / 100;

      // 1. Draw Grid Background (Paper/Slate style)
      ctx.strokeStyle = '#E2DFD9';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const pos = i * 10;
        // Vertical line
        ctx.beginPath();
        ctx.moveTo(pos * scaleX, 0);
        ctx.lineTo(pos * scaleX, dimensions.height);
        ctx.stroke();

        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(0, pos * scaleY);
        ctx.lineTo(dimensions.width, pos * scaleY);
        ctx.stroke();
      }

      // Draw axis numbers (JetBrains Mono style label)
      ctx.fillStyle = '#7A756D';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('Y=100', 10, 15);
      ctx.fillText('Y=0', 10, dimensions.height - 10);
      ctx.fillText('X=0', 10, dimensions.height - 10);
      ctx.fillText('X=100', dimensions.width - 45, dimensions.height - 10);

      // Simulation physics updates (only when playing)
      if (isPlaying) {
        timeRef.current += 1 * speed;

        // Particle Physics (Diffusion, Wind Flow, Gravity, Heat)
        particlesRef.current.forEach((p) => {
          // Wind vector effect
          p.vx += worldState.windVector.x * 0.002 * worldState.diffusionRate;
          p.vy += worldState.windVector.y * 0.002 * worldState.diffusionRate;

          // Gravity Factor pushes heavy particles down
          if (p.type === 'carbon') {
            p.vy += worldState.gravityFactor * 0.0015;
          }

          // Heat factor acts as molecular excitement
          p.vx += (Math.random() - 0.5) * worldState.heatFactor * 0.05;
          p.vy += (Math.random() - 0.5) * worldState.heatFactor * 0.05;

          // Limit speed
          const velocity = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (velocity > 1.5) {
            p.vx = (p.vx / velocity) * 1.5;
            p.vy = (p.vy / velocity) * 1.5;
          }

          // Move
          p.x += p.vx * speed;
          p.y += p.vy * speed;

          // Boundary bounce or wrap-around
          if (p.x < 0 || p.x > 100 || p.y < 0 || p.y > 100) {
            p.x = Math.random() * 100;
            p.y = Math.random() * 100;
            p.vx = (Math.random() - 0.5) * 0.2;
            p.vy = (Math.random() - 0.5) * 0.2;
            p.life = 100 + Math.random() * 200;
          }

          // Policy influence attraction/clearance
          policies.forEach((policy) => {
            const dx = p.x - policy.coordinates.x;
            const dy = p.y - policy.coordinates.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < policy.physicalParams.radius) {
              const strength = (policy.physicalParams.intensity / 100);
              
              if (policy.category === 'environment' && p.type === 'carbon') {
                // Carbon Absorption active clearance!
                p.x = Math.random() * 100; // Reset
                p.y = 0; // Spawn near top
                if (Math.random() < 0.05) {
                  addTemporalEvent(`Carbon atom captured by synthetic canopy in Sector Alpha`, 'interaction');
                }
              } else if (policy.category === 'energy' && p.type === 'fluid') {
                // Sluice Grid slows fluid and redirects
                p.vx += dx * 0.001 * strength;
                p.vy += dy * 0.001 * strength;
              }
            }
          });
        });

        // Multi-Agent Citizen Steer Behavior
        agentsRef.current.forEach((a) => {
          // Wander behavior
          a.vx += (Math.random() - 0.5) * 0.05;
          a.vy += (Math.random() - 0.5) * 0.05;

          // Interactive alignment with policies
          policies.forEach((policy) => {
            const dx = policy.coordinates.x - a.x;
            const dy = policy.coordinates.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // If inside active radius, adjust agent state & happiness
            if (dist < policy.physicalParams.radius) {
              const intensityFactor = policy.physicalParams.intensity / 100;
              
              if (policy.category === 'environment') {
                // Reforest makes green residents happy and attract
                a.happiness = Math.min(100, a.happiness + 0.05 * intensityFactor);
                // Seek
                a.vx += (dx / dist) * 0.005;
                a.vy += (dy / dist) * 0.005;
              } else if (policy.category === 'transport') {
                // Hyperloop attracts engineers and citizens but creates noise (activists dislike)
                if (a.faction === 'engineer') {
                  a.happiness = Math.min(100, a.happiness + 0.1);
                  a.vx += (dx / dist) * 0.01;
                  a.vy += (dy / dist) * 0.01;
                } else if (a.faction === 'activist') {
                  a.happiness = Math.max(0, a.happiness - 0.04);
                  // Repel
                  a.vx -= (dx / dist) * 0.005;
                  a.vy -= (dy / dist) * 0.005;
                }
              }
            }
          });

          // Bounds containment
          if (a.x < 5) { a.x = 5; a.vx *= -1; }
          if (a.x > 95) { a.x = 95; a.vx *= -1; }
          if (a.y < 5) { a.y = 5; a.vy *= -1; }
          if (a.y > 95) { a.y = 95; a.vy *= -1; }

          // Cap speed
          const spd = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
          if (spd > 0.6) {
            a.vx = (a.vx / spd) * 0.6;
            a.vy = (a.vy / spd) * 0.6;
          }

          a.x += a.vx * speed;
          a.y += a.vy * speed;
        });
      }

      // 2. Draw Flow Field Particles
      if (showFlowField) {
        particlesRef.current.forEach((p) => {
          ctx.beginPath();
          if (p.type === 'carbon') {
            ctx.fillStyle = `rgba(100, 110, 120, 0.6)`; // Warm grey ink dots
            ctx.arc(p.x * scaleX, p.y * scaleY, 2, 0, Math.PI * 2);
          } else {
            ctx.fillStyle = `rgba(224, 90, 54, 0.45)`; // Warm red-orange fluid flow
            ctx.arc(p.x * scaleX, p.y * scaleY, 1.5, 0, Math.PI * 2);
          }
          ctx.fill();
        });
      }

      // 3. Draw Active Policies Radiuses & Coords
      policies.forEach((policy) => {
        const px = policy.coordinates.x * scaleX;
        const py = policy.coordinates.y * scaleY;
        const radius = policy.physicalParams.radius * scaleX;

        // Radiating pulse
        const pulse = (Date.now() / 2000) % 1;
        ctx.beginPath();
        ctx.arc(px, py, radius * pulse, 0, Math.PI * 2);
        let strokeColor = 'rgba(26, 26, 26, 0.03)';
        if (policy.category === 'environment') strokeColor = 'rgba(27, 106, 67, 0.03)';
        if (policy.category === 'transport') strokeColor = 'rgba(224, 90, 54, 0.03)';
        
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Static radius circle
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.strokeStyle = policy.category === 'environment' ? 'rgba(27, 106, 67, 0.25)' : policy.category === 'transport' ? 'rgba(224, 90, 54, 0.25)' : 'rgba(26, 26, 26, 0.25)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Policy center node
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = policy.category === 'environment' ? '#1B6A43' : policy.category === 'transport' ? '#E05A36' : '#1A1A1A';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // 4. Highlight Selected Policy
      if (selectedPolicy) {
        const sX = selectedPolicy.coordinates.x * scaleX;
        const sY = selectedPolicy.coordinates.y * scaleY;

        ctx.beginPath();
        ctx.arc(sX, sY, 14, 0, Math.PI * 2);
        ctx.strokeStyle = '#E05A36'; // Rich Orange Border
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#E05A36';
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillText('TARGET ACTIVE', sX + 18, sY + 4);
      }

      // 5. Draw Agents (Citizens)
      if (showAgents) {
        agentsRef.current.forEach((a) => {
          const ax = a.x * scaleX;
          const ay = a.y * scaleY;

          ctx.beginPath();
          ctx.arc(ax, ay, a.size, 0, Math.PI * 2);
          
          // Editorial high contrast colors
          let color = '#1A1A1A'; // Citizen black
          if (a.faction === 'activist') color = '#1B6A43'; // Forest Green
          if (a.faction === 'engineer') color = '#E05A36'; // Brick Red
          
          ctx.fillStyle = color;
          ctx.fill();

          // Satisfaction indicator outer rings
          ctx.beginPath();
          ctx.arc(ax, ay, a.size + 2.5, 0, Math.PI * 2);
          ctx.strokeStyle = a.happiness > 65 ? 'rgba(27, 106, 67, 0.4)' : a.happiness < 40 ? 'rgba(224, 90, 54, 0.4)' : 'rgba(26, 26, 26, 0.15)';
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      }

      // 6. Spatial Graph Topological Overlay
      if (showSpatialGraph && selectedPolicy && selectedPolicy.simulationData) {
        const { nodes, edges } = selectedPolicy.simulationData.spatialGraph;

        // Draw relationship link lines
        edges.forEach((edge) => {
          const srcNode = nodes.find(n => n.id === edge.source);
          const tgtNode = nodes.find(n => n.id === edge.target);

          if (srcNode && tgtNode) {
            const sx = srcNode.x * scaleX;
            const sy = srcNode.y * scaleY;
            const tx = tgtNode.x * scaleX;
            const ty = tgtNode.y * scaleY;

            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(tx, ty);
            
            ctx.strokeStyle = 'rgba(26, 26, 26, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([1, 4]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Link label container
            const mx = (sx + tx) / 2;
            const my = (sy + ty) / 2;
            
            ctx.fillStyle = '#EBE8E3';
            const txtWidth = ctx.measureText(edge.relation).width;
            ctx.fillRect(mx - txtWidth/2 - 4, my - 7, txtWidth + 8, 14);

            ctx.strokeStyle = '#1A1A1A';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(mx - txtWidth/2 - 4, my - 7, txtWidth + 8, 14);

            ctx.fillStyle = '#1A1A1A';
            ctx.font = 'bold 8px "JetBrains Mono", monospace';
            ctx.fillText(edge.relation.toUpperCase(), mx - txtWidth/2, my + 3);
          }
        });

        // Draw graph node points
        nodes.forEach((node) => {
          const nx = node.x * scaleX;
          const ny = node.y * scaleY;

          ctx.beginPath();
          ctx.arc(nx, ny, 7, 0, Math.PI * 2);
          
          if (node.type === 'policy') ctx.fillStyle = '#1A1A1A';
          else if (node.type === 'resource') ctx.fillStyle = '#1B6A43';
          else if (node.type === 'population') ctx.fillStyle = '#E05A36';
          else if (node.type === 'hazard') ctx.fillStyle = '#8B2500';
          else ctx.fillStyle = '#7A756D';

          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Label
          ctx.font = 'bold 9px "Inter", sans-serif';
          ctx.strokeStyle = '#FCFAF7'; // Off-white grid canvas background
          ctx.lineWidth = 3.5;
          ctx.lineJoin = 'round';
          ctx.strokeText(node.label, nx + 12, ny + 3);

          ctx.fillStyle = '#1A1A1A';
          ctx.fillText(node.label, nx + 12, ny + 3);
        });
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [dimensions, worldState, selectedPolicy, policies, showSpatialGraph, showFlowField, showAgents, isPlaying, speed]);

  // Handle click on canvas
  const handleMouseClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert pixel to grid coordinate 0 - 100
    const x = Math.round((clickX / rect.width) * 100);
    const y = Math.round((clickY / rect.height) * 100);

    onCanvasClick({ x, y });
    addTemporalEvent(`User placed Spatial Probe target coordinates: (${x}, ${y}, 0)`, 'info');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setHoverCoords({ x, y });
  };

  return (
    <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] rounded-none flex flex-col gap-4 mt-2">
      <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-black" />
          <h2 className="font-bold text-[#1A1A1A] tracking-tight text-sm font-serif">Spatial Twin Grid</h2>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowFlowField(!showFlowField)}
            className={`px-2.5 py-1 text-[10px] font-mono font-bold border transition cursor-pointer rounded-none ${
              showFlowField 
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' 
                : 'bg-white hover:bg-[#F5F2ED] text-[#1A1A1A] border-[#1A1A1A]'
            }`}
          >
            Flow Field
          </button>
          <button
            onClick={() => setShowAgents(!showAgents)}
            className={`px-2.5 py-1 text-[10px] font-mono font-bold border transition cursor-pointer rounded-none ${
              showAgents 
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' 
                : 'bg-white hover:bg-[#F5F2ED] text-[#1A1A1A] border-[#1A1A1A]'
            }`}
          >
            Citizens
          </button>
        </div>
      </div>

      {/* Canvas Wrapper */}
      <div ref={containerRef} className="flex-1 flex items-center justify-center min-h-[300px] relative">
        <canvas
          id="spatial-world-canvas"
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          onClick={handleMouseClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverCoords(null)}
          className="border-2 border-[#1A1A1A] bg-[#FCFAF7] rounded-none cursor-crosshair"
        />

        {/* Hover Coordinate floating HUD */}
        {hoverCoords && (
          <div className="absolute top-2.5 right-2.5 bg-white border border-[#1A1A1A] rounded-none px-2 py-1 text-[10px] font-mono text-black shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] pointer-events-none font-bold">
            X: {hoverCoords.x} | Y: {hoverCoords.y} | Z: 0
          </div>
        )}
      </div>

      {/* Real-time Telemetry Indicator */}
      <div className="grid grid-cols-3 gap-2 bg-[#EBE8E3]/60 border border-[#1A1A1A] p-2.5 rounded-none text-[10px] font-mono text-black font-semibold">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-emerald-700 rounded-full animate-pulse border border-emerald-950" />
          <span>Friction: {(1.0 - worldState.diffusionRate * 0.1).toFixed(2)}v</span>
        </div>
        <div className="flex items-center gap-1.5 justify-center">
          <Wind className="w-3.5 h-3.5 text-black" />
          <span>Wind: {worldState.windVector.x > 0 ? 'E' : 'W'} {Math.abs(worldState.windVector.x)}m/s</span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span>Gravity: {worldState.gravityFactor.toFixed(1)}g</span>
        </div>
      </div>
    </div>
  );
}
