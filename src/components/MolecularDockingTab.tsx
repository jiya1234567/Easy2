import React, { useState, useEffect, useRef } from 'react';
import { MolecularDockingEngine, DockingResult } from '../utils/molecularDockingEngine';
import { StateTensor } from '../types';
import { Compass, Shield, Activity, Play, Activity as Heartbeat } from 'lucide-react';

type MolecularDockingTabProps = {
  stateTensor?: StateTensor;
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction' | 'hardware' | 'causal') => void;
};

export const MolecularDockingTab: React.FC<MolecularDockingTabProps> = ({
  stateTensor,
  onLogEvent,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [protein, setProtein] = useState<string>('ACE2_Receptor_G2');
  const [ligand, setLigand] = useState<string>('N-Acetylglucosamine');
  const [dockingResult, setDockingResult] = useState<DockingResult | null>(null);
  const [angleX, setAngleX] = useState<number>(0.5);
  const [angleY, setAngleY] = useState<number>(0.5);
  const [zoom, setZoom] = useState<number>(24);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  const isMouseDownRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    handleDock();
  }, []);

  // Listen to stateTensor features to detect melanoma/cancer context
  useEffect(() => {
    if (stateTensor?.features) {
      const keys = Object.keys(stateTensor.features).map(k => k.toLowerCase());
      const hasMelanoma = keys.some(k => k.includes('tumour') || k.includes('immune') || k.includes('pdl1') || k.includes('melanoma'));
      if (hasMelanoma) {
        if (protein !== 'PD-L1_Receptor_Complex' || ligand !== 'Atezolizumab_Fab_Domain') {
          setProtein('PD-L1_Receptor_Complex');
          setLigand('Atezolizumab_Fab_Domain');
          const result = MolecularDockingEngine.dockLigand('PD-L1_Receptor_Complex', 'Atezolizumab_Fab_Domain');
          setDockingResult(result);
        }
      }
    }
  }, [stateTensor, protein, ligand]);

  const handleDock = () => {
    const result = MolecularDockingEngine.dockLigand(protein, ligand);
    setDockingResult(result);
    onLogEvent(`Docked small molecule ligand "${result.ligand}" into pocket of protein "${result.protein}" (Binding Affinity: ${result.bindingAffinity.toFixed(2)} kcal/mol, Hydrogen bonds: ${result.hydrogenBonds}).`, 'physics');
  };

  // Render 3D docking pocket and ligand atoms
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dockingResult) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let localAngleY = angleY;

    const render = () => {
      const width = canvas.width = canvas.offsetWidth;
      const height = canvas.height = canvas.offsetHeight;
      const cx = width / 2;
      const cy = height / 2;

      // Clear
      ctx.fillStyle = '#FCFAF7'; // Sand cream background
      ctx.fillRect(0, 0, width, height);

      if (isRotating && !isMouseDownRef.current) {
        localAngleY += 0.003;
      }

      // 3D to 2D projection
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y axis
        let x1 = x * Math.cos(localAngleY) - z * Math.sin(localAngleY);
        let z1 = x * Math.sin(localAngleY) + z * Math.cos(localAngleY);

        // Rotate around X axis
        let y2 = y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = y * Math.sin(angleX) + z1 * Math.cos(angleX);

        const dist = 30;
        const scale = (dist / (dist + z2)) * zoom;
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          depth: z2,
          visible: dist + z2 > 0.5
        };
      };

      // 1. Draw Pocket Boundary Wireframe (Receptor active site cage)
      const pocketCenter = dockingResult.activeSiteCoordinates;
      const boxSize = 2.5;
      const vertices = [
        { x: pocketCenter.x - boxSize, y: pocketCenter.y - boxSize, z: pocketCenter.z - boxSize },
        { x: pocketCenter.x + boxSize, y: pocketCenter.y - boxSize, z: pocketCenter.z - boxSize },
        { x: pocketCenter.x + boxSize, y: pocketCenter.y + boxSize, z: pocketCenter.z - boxSize },
        { x: pocketCenter.x - boxSize, y: pocketCenter.y + boxSize, z: pocketCenter.z - boxSize },
        { x: pocketCenter.x - boxSize, y: pocketCenter.y - boxSize, z: pocketCenter.z + boxSize },
        { x: pocketCenter.x + boxSize, y: pocketCenter.y - boxSize, z: pocketCenter.z + boxSize },
        { x: pocketCenter.x + boxSize, y: pocketCenter.y + boxSize, z: pocketCenter.z + boxSize },
        { x: pocketCenter.x - boxSize, y: pocketCenter.y + boxSize, z: pocketCenter.z + boxSize },
      ];

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0], // back
        [4, 5], [5, 6], [6, 7], [7, 4], // front
        [0, 4], [1, 5], [2, 6], [3, 7]  // links
      ];

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)'; // Green active pocket cage
      ctx.lineWidth = 1.5;
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

      // Label the pocket center
      const pCenter2D = project(pocketCenter.x, pocketCenter.y, pocketCenter.z);
      if (pCenter2D.visible) {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.5)';
        ctx.beginPath();
        ctx.arc(pCenter2D.x, pCenter2D.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = 'bold 8px monospace';
        ctx.fillStyle = '#10B981';
        ctx.fillText('Pocket Active Site', pCenter2D.x + 8, pCenter2D.y + 3);
      }

      // 2. Project Ligand Atoms
      const projectedAtoms = dockingResult.ligandAtoms.map(atom => ({
        ...atom,
        proj: project(atom.coordinates.x, atom.coordinates.y, atom.coordinates.z)
      })).filter(atom => atom.proj.visible);

      // Draw Bonds connecting ligand atoms sequentially to illustrate compound structure
      if (projectedAtoms.length > 1) {
        ctx.beginPath();
        ctx.moveTo(projectedAtoms[0].proj.x, projectedAtoms[0].proj.y);
        for (let i = 1; i < projectedAtoms.length; i++) {
          ctx.lineTo(projectedAtoms[i].proj.x, projectedAtoms[i].proj.y);
        }
        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Draw hydrogen bonding dashed lines from ligand to pocket boundary center
      projectedAtoms.forEach((atom, index) => {
        if (index < dockingResult.hydrogenBonds && pCenter2D.visible) {
          ctx.beginPath();
          ctx.moveTo(atom.proj.x, atom.proj.y);
          ctx.lineTo(pCenter2D.x, pCenter2D.y);
          ctx.strokeStyle = '#EF4444'; // Red for hydrogen bonds
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // Draw atoms spheres
      projectedAtoms.forEach(atom => {
        const { x, y } = atom.proj;

        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        // Atom color coding
        let color = '#3B82F6'; // Carbon = Blue
        if (atom.symbol === 'O') color = '#EF4444'; // Oxygen = Red
        if (atom.symbol === 'N') color = '#10B981'; // Nitrogen = Green
        if (atom.symbol === 'F') color = '#8B5CF6'; // Fluorine = Purple
        if (atom.symbol === 'H') color = '#FFFFFF'; // Hydrogen = White

        ctx.fillStyle = color;
        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        // Atom symbol tag
        ctx.font = 'bold 8px sans-serif';
        ctx.fillStyle = atom.symbol === 'H' ? '#1A1A1A' : '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(atom.symbol, x, y + 2.5);
      });

      animFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrame);
  }, [dockingResult, angleX, angleY, zoom, isRotating]);

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
          <span className="text-[10px] uppercase tracking-widest font-bold text-teal-600 flex items-center gap-1">
            <Heartbeat className="w-3.5 h-3.5" /> RECEPTOR BINDING AFFINITY CALIBRATOR
          </span>
          <h3 className="text-base font-serif font-black uppercase tracking-tight text-[#1A1A1A]">
            🧬 Molecular Docking & Drug Screening Pocket
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Inputs */}
          <input
            type="text"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            placeholder="Receptor/Protein"
            className="px-2.5 py-1.5 border border-[#1A1A1A] bg-white font-mono text-[10px] w-36"
          />
          <input
            type="text"
            value={ligand}
            onChange={(e) => setLigand(e.target.value)}
            placeholder="Ligand Compound"
            className="px-2.5 py-1.5 border border-[#1A1A1A] bg-white font-mono text-[10px] w-36"
          />
          <button
            onClick={handleDock}
            className="bg-[#1A1A1A] hover:bg-neutral-800 text-white font-bold border border-white px-3 py-1.5 text-[10px] flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition"
          >
            <Play className="w-3.5 h-3.5" /> DOCK
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Docking Viewport */}
        <div className="lg:col-span-3 border-2 border-[#1A1A1A] bg-white h-[360px] relative">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />

          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <span className="bg-[#10B981] text-white border border-[#1A1A1A] px-2 py-0.5 text-[8px] font-mono font-bold select-none">
              ACTIVE SITE POCKET Mapped
            </span>
            <span className="bg-[#FAF9F6] text-[#1A1A1A] border border-[#1A1A1A] px-2 py-0.5 text-[8px] font-mono font-bold">
              LIGAND ATOMS: {dockingResult?.ligandAtoms.length} SYMBOLS
            </span>
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white border border-[#1A1A1A] p-1 text-[10px]">
            <button onClick={() => setZoom(z => Math.min(45, z + 2.5))} className="p-1 hover:bg-neutral-100"><Compass className="w-3.5 h-3.5" /></button>
            <button onClick={() => setIsRotating(!isRotating)} className="px-2 py-0.5 font-bold font-mono text-[8px] hover:bg-neutral-100">
              {isRotating ? 'ROTATE: ON' : 'ROTATE: OFF'}
            </button>
          </div>
        </div>

        {/* Sidebar indicators */}
        <div className="space-y-4">
          {dockingResult && (
            <div className="border-2 border-[#1A1A1A] p-4 bg-white shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] space-y-3">
              <h4 className="text-[10px] uppercase font-mono font-black text-teal-700">
                Docking Affinities
              </h4>

              <div className="space-y-2 font-mono text-[10px]">
                <div className="p-2 bg-teal-50 border border-teal-200">
                  <span className="text-[8px] text-teal-600 block">BINDING AFFINITY (Kd)</span>
                  <span className="font-bold text-xs">{dockingResult.bindingAffinity.toFixed(3)} kcal/mol</span>
                </div>

                <div className="p-2 bg-red-50 border border-red-200">
                  <span className="text-[8px] text-red-600 block">HYDROGEN BONDS</span>
                  <span className="font-bold text-xs">{dockingResult.hydrogenBonds} Bonds</span>
                </div>

                <div className="p-2 bg-blue-50 border border-blue-200">
                  <span className="text-[8px] text-blue-600 block">ALIGNMENT SCORE</span>
                  <span className="font-bold text-xs">{dockingResult.confidence.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-[#FAF9F6] border border-[#1A1A1A] p-3 text-[10px] font-mono text-neutral-600 leading-normal">
            <span className="font-bold text-[#1A1A1A] block mb-1">ELECTROSTATIC FORCES:</span>
            Negative values indicate exothermic binding energy. Dashed lines illustrate critical electrostatic hydrogen links stabilizing the compound inside the active cleft.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MolecularDockingTab;
