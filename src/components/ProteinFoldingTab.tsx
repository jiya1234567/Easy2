import React, { useState, useEffect, useRef } from 'react';
import { ProteinFoldingEngine, FoldingResult } from '../utils/proteinFoldingEngine';
import { StateTensor } from '../types';
import { Activity, Play, Zap, Compass, RefreshCcw } from 'lucide-react';

type ProteinFoldingTabProps = {
  stateTensor?: StateTensor;
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction' | 'hardware' | 'causal') => void;
};

export const ProteinFoldingTab: React.FC<ProteinFoldingTabProps> = ({
  stateTensor,
  onLogEvent,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sequence, setSequence] = useState<string>('MKVLWAALLVTFLAGCQAKVEQAVETEP');
  const [foldingResult, setFoldingResult] = useState<FoldingResult | null>(null);
  const [angleX, setAngleX] = useState<number>(0.6);
  const [angleY, setAngleY] = useState<number>(0.4);
  const [zoom, setZoom] = useState<number>(14);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  
  const isMouseDownRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Fold the protein sequence on mount and on trigger
  useEffect(() => {
    handleFold();
  }, []);

  // Listen to stateTensor features to detect melanoma/cancer context
  useEffect(() => {
    if (stateTensor?.features) {
      const keys = Object.keys(stateTensor.features).map(k => k.toLowerCase());
      const hasMelanoma = keys.some(k => k.includes('tumour') || k.includes('immune') || k.includes('pdl1') || k.includes('melanoma'));
      if (hasMelanoma) {
        const pdl1Seq = "MFTVTVPKDLYVVEYGSNMTIECKFPVEKQLDLAALIVYWEMEDKNIIQFVHGEEDLKVQHSSYRQRARLLKDQLSLGNAALQITDVKLQDAGVYRCMISYGGADYKRITVKVNAPYNKINQRILVVDPVTSEHELTCQAEGYPKAEVIWTSSDHQVLSGKTTTTNSKREEKLFNVTSTLRINTTTNEIFYCTFRRLDPEENHTAELVIPELPLAHPPNERTHLVILGAILLCLGVALTFIFRLRKGRMMDVKKCGIQDTNSKKQSDTHLEET";
        if (sequence !== pdl1Seq) {
          setSequence(pdl1Seq);
          const result = ProteinFoldingEngine.foldSequence(pdl1Seq);
          setFoldingResult(result);
        }
      }
    }
  }, [stateTensor, sequence]);

  const handleFold = () => {
    const result = ProteinFoldingEngine.foldSequence(sequence);
    setFoldingResult(result);
    onLogEvent(`Completed folding projection for sequence: ${result.sequence} (Free Energy: ${result.freeEnergy.toFixed(2)} kcal/mol, Confidence pLDDT: ${result.confidence.toFixed(1)}%).`, 'physics');
  };

  // Render 3D ribbon backbone on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !foldingResult) return;
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
        localAngleY += 0.004;
      }

      // Project 3D to 2D
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

      const pts = foldingResult.structure.map(res => ({
        ...res,
        proj: project(res.coordinates.x, res.coordinates.y - (foldingResult.structure.length), res.coordinates.z)
      })).filter(pt => pt.proj.visible);

      // Draw ribbon/backbone connecting links
      if (pts.length > 1) {
        ctx.beginPath();
        ctx.moveTo(pts[0].proj.x, pts[0].proj.y);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].proj.x, pts[i].proj.y);
        }
        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 4;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();

        // High contrast core inner ribbon line
        ctx.beginPath();
        ctx.moveTo(pts[0].proj.x, pts[0].proj.y);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].proj.x, pts[i].proj.y);
        }
        ctx.strokeStyle = '#34D399'; // Emerald-helical core
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw amino acid residue beads
      pts.forEach(pt => {
        const { x, y } = pt.proj;

        // Bead circle
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        // Alternate colors based on charge or polar properties of residue
        const cIdx = pt.residue.charCodeAt(0) % 4;
        const colors = ['#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6'];
        ctx.fillStyle = colors[cIdx];
        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        // Small white shine highlight
        ctx.beginPath();
        ctx.arc(x - 1.5, y - 1.5, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Residue text letter on hover
        ctx.fillStyle = '#1A1A1A';
        ctx.font = 'bold 8px monospace';
        ctx.fillText(pt.residue, x + 8, y + 3);
      });

      animFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrame);
  }, [foldingResult, angleX, angleY, zoom, isRotating]);

  // Mouse Drag to rotate molecular structures
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
          <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> ALPHAFOLD COLLATERAL SYNTHESIS
          </span>
          <h3 className="text-base font-serif font-black uppercase tracking-tight text-[#1A1A1A]">
            🧬 Protein Folding Conformational Ribbons
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Custom Sequence input */}
          <input
            type="text"
            value={sequence}
            onChange={(e) => setSequence(e.target.value.toUpperCase().replace(/[^ACDEFGHIKLMNPQRSTVWY]/g, ''))}
            placeholder="Sequence (e.g., MGEK)"
            className="px-3 py-1.5 border border-[#1A1A1A] bg-white font-mono text-[10px] uppercase tracking-wider w-48"
          />
          <button
            onClick={handleFold}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold border border-[#1A1A1A] px-3 py-1.5 text-[10px] flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] active:translate-x-px active:translate-y-px active:shadow-none transition"
          >
            <Play className="w-3.5 h-3.5" /> FOLD
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* ribbon canvas viewport */}
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
            <span className="bg-[#1A1A1A] text-[#FAF9F6] border border-[#FAF9F6] px-2 py-0.5 text-[8px] font-mono font-bold select-none">
              3D PERSPECTIVE RIBBON • DRAG TO ROTATE
            </span>
            <span className="bg-[#FAF9F6] text-[#1A1A1A] border border-[#1A1A1A] px-2 py-0.5 text-[8px] font-mono font-bold">
              SEQUENCE: {foldingResult?.sequence.length} RESIDUES
            </span>
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white border border-[#1A1A1A] p-1 text-[10px]">
            <button onClick={() => setZoom(z => Math.min(30, z + 2))} className="p-1 hover:bg-neutral-100"><Zap className="w-3 h-3" /></button>
            <button onClick={() => setIsRotating(!isRotating)} className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 transition font-bold font-mono text-[8px]">
              {isRotating ? 'ROTATE: ON' : 'ROTATE: OFF'}
            </button>
          </div>
        </div>

        {/* Info card */}
        <div className="space-y-4">
          
          {/* Folding metrics display */}
          {foldingResult && (
            <div className="border-2 border-[#1A1A1A] p-4 bg-white shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] space-y-3">
              <h4 className="text-[10px] uppercase font-mono font-black text-emerald-700">
                Thermodynamic Profile
              </h4>

              <div className="space-y-2 font-mono text-[10px]">
                <div className="p-2 bg-emerald-50 border border-emerald-200">
                  <span className="text-[8px] text-emerald-600 block">FREE ENERGY (ΔG)</span>
                  <span className="font-bold text-xs">{foldingResult.freeEnergy.toFixed(3)} kcal/mol</span>
                </div>

                <div className="p-2 bg-blue-50 border border-blue-200">
                  <span className="text-[8px] text-blue-600 block">pLDDT MODEL CONFIDENCE</span>
                  <span className="font-bold text-xs">{foldingResult.confidence.toFixed(1)}% (Excellent)</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-[#FAF9F6] border border-[#1A1A1A] p-3 text-[10px] font-mono text-neutral-600 leading-normal">
            <span className="font-bold text-[#1A1A1A] block mb-1">RAMACHANDRAN ANGLE BIAS:</span>
            Torsion parameters (φ/ψ) computed using standard potential fields to preserve covalent peptide bond geometries.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProteinFoldingTab;
