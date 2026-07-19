import React, { useState, useEffect, useRef } from 'react';
import { StateTensor } from '../types';
import { Sparkles, Compass, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

type VisualManifoldTabProps = {
  stateTensor?: StateTensor;
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction' | 'hardware' | 'causal') => void;
};

interface Point3D {
  x: number;
  y: number;
  z: number;
  color: string;
  label: string;
  val: number;
}

export const VisualManifoldTab: React.FC<VisualManifoldTabProps> = ({
  stateTensor,
  onLogEvent,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [angleX, setAngleX] = useState<number>(0.5);
  const [angleY, setAngleY] = useState<number>(0.6);
  const [zoom, setZoom] = useState<number>(20);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [points, setPoints] = useState<Point3D[]>([]);
  const isMouseDownRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Get coordinate coordinates from StateTensor or use defaults
  useEffect(() => {
    // Standard default coordinates for macro economics or physics
    const coordinates: Point3D[] = [
      { x: -2, y: 1.5, z: 2, color: '#3B82F6', label: 'H (Hierarchy)', val: 4.8 },
      { x: 3, y: -2, z: 1.5, color: '#10B981', label: 'K (Knowledge)', val: 3.5 },
      { x: -1.5, y: -3, z: -2, color: '#EF4444', label: 'E (Energy)', val: 5.2 },
      { x: 2.5, y: 2.8, z: -1, color: '#F59E0B', label: 'B (Binding)', val: 2.9 },
      { x: -2.8, y: -1, z: 3, color: '#8B5CF6', label: 'R (Relational)', val: 4.1 }
    ];

    if (stateTensor) {
      // If we have actual stateTensor features, map them!
      const features = stateTensor.features || {};
      const keys = Object.keys(features);
      keys.forEach((key, index) => {
        const val = features[key];
        // Calculate deterministic coordinates in [-3, 3] bounds
        const angle = (index / keys.length) * Math.PI * 2;
        coordinates.push({
          x: Math.cos(angle) * (val % 4),
          y: Math.sin(angle) * (val % 3),
          z: ((val * 7) % 5) - 2.5,
          color: `hsl(${(index * 360) / keys.length}, 70%, 55%)`,
          label: key.toUpperCase(),
          val: val
        });
      });
    }

    setPoints(coordinates);
  }, [stateTensor]);

  // Log on mount only to prevent infinite loop
  useEffect(() => {
    onLogEvent(`Initialized Visual Manifold Tab viewport.`, 'info');
  }, []);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let localAngleY = angleY;

    const render = () => {
      const width = canvas.width = canvas.offsetWidth;
      const height = canvas.height = canvas.offsetHeight;
      const cx = width / 2;
      const cy = height / 2;

      // Clear Canvas
      ctx.fillStyle = '#FCFAF7'; // Soft cream
      ctx.fillRect(0, 0, width, height);

      // Auto rotation increment if enabled
      if (isRotating && !isMouseDownRef.current) {
        localAngleY += 0.005;
      }

      // Drawing Helper: 3D to 2D projection
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y axis
        let x1 = x * Math.cos(localAngleY) - z * Math.sin(localAngleY);
        let z1 = x * Math.sin(localAngleY) + z * Math.cos(localAngleY);

        // Rotate around X axis
        let y2 = y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = y * Math.sin(angleX) + z1 * Math.cos(angleX);

        // Simple perspective scaling
        const dist = 8;
        const scale = (dist / (dist + z2)) * zoom;
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          depth: z2,
          visible: dist + z2 > 0.5
        };
      };

      // 1. Draw 3D Axes
      const axes = [
        { x: 5, y: 0, z: 0, color: 'rgba(239, 68, 68, 0.4)', label: '+X' }, // Red (H)
        { x: 0, y: 5, z: 0, color: 'rgba(16, 185, 129, 0.4)', label: '+Y' }, // Green (K)
        { x: 0, y: 0, z: 5, color: 'rgba(59, 130, 246, 0.4)', label: '+Z' }, // Blue (E)
      ];

      const center2D = project(0, 0, 0);

      axes.forEach(axis => {
        const p2D = project(axis.x, axis.y, axis.z);
        if (center2D.visible && p2D.visible) {
          ctx.beginPath();
          ctx.moveTo(center2D.x, center2D.y);
          ctx.lineTo(p2D.x, p2D.y);
          ctx.strokeStyle = axis.color;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Axis Tag label
          ctx.fillStyle = '#1A1A1A';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(axis.label, p2D.x + 5, p2D.y - 5);
        }
      });

      // 2. Draw Wireframe Box cage grid
      const boxSize = 3;
      const vertices = [
        { x: -boxSize, y: -boxSize, z: -boxSize },
        { x: boxSize, y: -boxSize, z: -boxSize },
        { x: boxSize, y: boxSize, z: -boxSize },
        { x: -boxSize, y: boxSize, z: -boxSize },
        { x: -boxSize, y: -boxSize, z: boxSize },
        { x: boxSize, y: -boxSize, z: boxSize },
        { x: boxSize, y: boxSize, z: boxSize },
        { x: -boxSize, y: boxSize, z: boxSize },
      ];

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0], // back
        [4, 5], [5, 6], [6, 7], [7, 4], // front
        [0, 4], [1, 5], [2, 6], [3, 7]  // links
      ];

      ctx.strokeStyle = 'rgba(26, 26, 26, 0.08)';
      ctx.lineWidth = 1;
      edges.forEach(([from, to]) => {
        const p1 = project(vertices[from].x, vertices[from].y, vertices[from].z);
        const p2 = project(vertices[to].x, vertices[to].y, vertices[to].z);
        if (p1.visible && p2.visible) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });

      // 3. Draw Projected Coordinates points
      const projected = points.map(pt => ({
        ...pt,
        proj: project(pt.x, pt.y, pt.z)
      })).filter(pt => pt.proj.visible);

      // Sort by depth for correct 3D overlap rendering
      projected.sort((a, b) => b.proj.depth - a.proj.depth);

      projected.forEach(pt => {
        const { x, y } = pt.proj;

        // Draw connecting stem line down to horizontal zero plane
        const planeProj = project(pt.x, 0, pt.z);
        if (planeProj.visible) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(planeProj.x, planeProj.y);
          ctx.strokeStyle = 'rgba(26, 26, 26, 0.15)';
          ctx.setLineDash([2, 2]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Draw outer brutalist ring
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        // Draw inner dot
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Label Tag Box
        ctx.font = 'bold 9px monospace';
        const txt = `${pt.label}: ${pt.val.toFixed(2)}`;
        const txtW = ctx.measureText(txt).width;

        ctx.fillStyle = '#1A1A1A';
        ctx.fillRect(x + 10, y - 8, txtW + 8, 15);
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeRect(x + 10, y - 8, txtW + 8, 15);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(pt.label, x + 14, y + 2);
      });

      animFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrame);
  }, [points, angleX, angleY, zoom, isRotating]);

  // Mouse Drag to rotate coordinate space
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    isMouseDownRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isMouseDownRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;

    setAngleY(prev => prev + dx * 0.007);
    setAngleX(prev => Math.max(-Math.PI / 3, Math.min(Math.PI / 3, prev + dy * 0.007)));

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  return (
    <div className="bg-[#FAF9F6] border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
      
      {/* Brand Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-[#1A1A1A] pb-4 mb-4 gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-violet-600 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" /> MULTI-DIMENSIONAL COORDINATE SCANNER
          </span>
          <h3 className="text-base font-serif font-black uppercase tracking-tight text-[#1A1A1A]">
            🌌 State Tensor Visual Manifold
          </h3>
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-[#1A1A1A] p-1 text-[10px] font-mono">
          <button onClick={() => setZoom(z => Math.min(45, z + 2.5))} className="p-1.5 hover:bg-neutral-100 transition" title="Zoom In">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setZoom(z => Math.max(8, z - 2.5))} className="p-1.5 hover:bg-neutral-100 transition" title="Zoom Out">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setIsRotating(!isRotating)} className={`px-2.5 py-1 transition font-bold ${isRotating ? 'bg-indigo-600 text-white' : 'hover:bg-neutral-100'}`}>
            {isRotating ? 'ROTATE: AUTO' : 'ROTATE: MANUAL'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Real-time WebGL alternative canvas */}
        <div className="lg:col-span-3 border-2 border-[#1A1A1A] bg-white h-[400px] relative">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />
          <span className="absolute top-3 left-3 bg-[#1A1A1A] text-[#FAF9F6] border border-[#FAF9F6] px-2 py-0.5 text-[8px] font-mono font-bold select-none">
            3D PERSPECTIVE VIEW • DRAG TO ROTATE
          </span>
        </div>

        {/* Coords details */}
        <div className="space-y-4">
          <div className="border-2 border-[#1A1A1A] p-4 bg-white shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            <h4 className="text-[10px] uppercase font-mono font-black text-violet-700 mb-2.5">
              Dimension Readings
            </h4>
            
            <div className="space-y-2">
              {points.map((pt, i) => (
                <div key={i} className="p-2 border border-neutral-200 bg-neutral-50 flex items-center justify-between font-mono text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: pt.color }}></span>
                    <span className="font-bold text-[#1A1A1A]">{pt.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-neutral-500 mr-2">val:</span>
                    <span className="font-bold text-neutral-900">{pt.val.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#FAF9F6] border-2 border-dashed border-[#1A1A1A] p-3 text-[10px] font-mono text-neutral-600 leading-normal">
            <span className="font-bold text-[#1A1A1A] block mb-1">💡 COGNITIVE CALIBRATION NOTICE:</span>
            Coordinates represent projected vectors extracted from OMEGA-CORE state tensors. Highly correlated patterns indicate low global model uncertainty.
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualManifoldTab;
