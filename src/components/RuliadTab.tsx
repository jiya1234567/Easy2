import React, { useState, useEffect, useRef } from 'react';
import { StateTensor } from '../types';
import { Play, Pause, RotateCcw, Cpu, HelpCircle, Activity } from 'lucide-react';

type RuliadTabProps = {
  stateTensor?: StateTensor;
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction' | 'hardware' | 'causal') => void;
};

export const RuliadTab: React.FC<RuliadTabProps> = ({
  stateTensor,
  onLogEvent,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [rule, setRule] = useState<number>(30); // Rule 30, Rule 90, Rule 110, Rule 184
  const [generation, setGeneration] = useState<number>(0);
  const cellsRef = useRef<number[][]>([]);
  const animFrameRef = useRef<number | null>(null);

  const cols = 120;
  const rows = 60;

  // Re-initialize cells based on stateTensor when it changes
  useEffect(() => {
    const initCells = () => {
      const arr = Array(rows).fill(null).map(() => Array(cols).fill(0));
      // Put initial state in the middle of first row
      const mid = Math.floor(cols / 2);
      arr[0][mid] = 1;

      // If stateTensor has active dimensions, inject them as starting cells
      if (stateTensor) {
        const xCoord = Math.min(cols - 1, Math.max(0, stateTensor.spatial.x || mid));
        arr[0][xCoord] = 1;
        if (stateTensor.spatial.y) {
          const yCoord = Math.min(rows - 1, Math.max(0, stateTensor.spatial.y));
          if (yCoord < rows) arr[yCoord][mid] = 1;
        }
      }

      cellsRef.current = arr;
      setGeneration(0);
    };

    initCells();
  }, [stateTensor, rule]);

  // Log on rule changes or mount to prevent infinite loop on stateTensor
  useEffect(() => {
    onLogEvent(`Ruliad cellular lattice initialized with Rule ${rule} starting state.`, 'physics');
  }, [rule]);

  // Compute next cellular automaton generation based on rule number
  const computeNextGeneration = () => {
    const current = cellsRef.current;
    if (current.length === 0) return;

    const nextGen = current.map(row => [...row]);
    let hasChanged = false;

    // Standard 1D cellular automaton rule matching
    // Look at previous row to generate next row
    for (let r = 0; r < rows - 1; r++) {
      let isRowEmpty = true;
      for (let c = 0; c < cols; c++) {
        if (current[r][c] === 1) {
          isRowEmpty = false;
          break;
        }
      }
      if (isRowEmpty) continue;

      for (let c = 0; c < cols; c++) {
        const left = current[r][(c - 1 + cols) % cols];
        const center = current[r][c];
        const right = current[r][(c + 1) % cols];

        // Binary representation of the neighborhood
        const pattern = (left << 2) | (center << 1) | right;
        const result = (rule >> pattern) & 1;

        if (nextGen[r + 1][c] !== result) {
          nextGen[r + 1][c] = result;
          hasChanged = true;
        }
      }
    }

    if (hasChanged) {
      cellsRef.current = nextGen;
      setGeneration(g => g + 1);
    } else {
      // If fully computed or stable, loop reset
      setIsPlaying(false);
    }
  };

  // Evolving game loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const loop = () => {
      computeNextGeneration();
      animFrameRef.current = setTimeout(() => {
        requestAnimationFrame(loop);
      }, 80) as any;
    };

    loop();

    return () => {
      if (animFrameRef.current) clearTimeout(animFrameRef.current);
    };
  }, [isPlaying, rule]);

  // Render cellular automaton cells to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    const cellW = width / cols;
    const cellH = height / rows;

    ctx.fillStyle = '#FCFAF7'; // Sand cream background
    ctx.fillRect(0, 0, width, height);

    // Draw active cells
    const cells = cellsRef.current;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (cells[r]?.[c] === 1) {
          // Heat gradient color based on generation row depth
          const pct = r / rows;
          ctx.fillStyle = `hsl(${180 + pct * 180}, 85%, 45%)`; // beautiful cyan-purple gradient
          ctx.fillRect(c * cellW, r * cellH, cellW - 0.5, cellH - 0.5);
        } else {
          // Faint dot grids
          if (c % 10 === 0 && r % 10 === 0) {
            ctx.fillStyle = 'rgba(26, 26, 26, 0.04)';
            ctx.fillRect(c * cellW, r * cellH, 1.5, 1.5);
          }
        }
      }
    }
  }, [generation]);

  return (
    <div className="bg-[#FAF9F6] border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
      
      {/* Brand Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-[#1A1A1A] pb-4 mb-4 gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-amber-600 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" /> WOLFRAM FUNDAMENTAL PHYSICS ENGINE
          </span>
          <h3 className="text-base font-serif font-black uppercase tracking-tight text-[#1A1A1A]">
            📐 The Ruliad Computational Multi-Lattice
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-white border border-[#1A1A1A] p-1 text-[10px] font-mono">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-1.5 flex items-center gap-1 font-bold ${isPlaying ? 'bg-amber-600 text-white' : 'hover:bg-neutral-100'}`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'PAUSE' : 'EVOLVE'}
          </button>
          
          <button
            onClick={() => {
              const arr = Array(rows).fill(null).map(() => Array(cols).fill(0));
              arr[0][Math.floor(cols / 2)] = 1;
              cellsRef.current = arr;
              setGeneration(0);
              onLogEvent('Reset Ruliad state to center cell.', 'interaction');
            }}
            className="p-1.5 hover:bg-neutral-100 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <span className="h-4 w-px bg-[#1A1A1A] mx-1"></span>

          {/* Rules selector */}
          {[30, 90, 110, 126, 184].map(r => (
            <button
              key={r}
              onClick={() => {
                setRule(r);
                onLogEvent(`Set Ruliad cellular automaton simulation rule to Rule ${r}`, 'interaction');
              }}
              className={`px-2 py-1 font-bold ${rule === r ? 'bg-[#1A1A1A] text-white' : 'hover:bg-neutral-100'}`}
            >
              R{r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Automata Evolution Map */}
        <div className="lg:col-span-3 border-2 border-[#1A1A1A] bg-white h-[360px] relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
          />
          <span className="absolute bottom-3 left-3 bg-[#1A1A1A] text-white text-[8px] font-mono font-bold px-2 py-0.5">
            GENERATION: {generation} | RULES: AUTOMATON RULE-{rule}
          </span>
        </div>

        {/* Informational Help card */}
        <div className="space-y-4">
          <div className="border-2 border-[#1A1A1A] p-4 bg-white shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] text-[11px] font-serif leading-relaxed">
            <h4 className="text-[10px] uppercase font-mono font-black text-[#1A1A1A] mb-2 flex items-center gap-1">
              <HelpCircle className="w-4 h-4 text-amber-600" /> Ruliad Taxonomy
            </h4>
            <p className="text-neutral-600">
              In Stephen Wolfram's fundamental physics model, the <strong>Ruliad</strong> represents the entangly-infinite space of all possible computational rules.
            </p>
            <p className="text-neutral-600 mt-2">
              Our simulation extracts the active state of OMEGA-CORE tensors and maps them directly to the spatial coordinates of cellular seed lines, illustrating computational causality.
            </p>
          </div>

          <div className="border border-[#1A1A1A] p-3.5 bg-neutral-50 font-mono text-[9px] text-[#1A1A1A] space-y-1">
            <span className="font-bold text-amber-700 block uppercase">Lattice Properties:</span>
            <div>• Dim: 1D Infinite Boundary</div>
            <div>• Cellular grid: {cols} x {rows} vertices</div>
            <div>• Causal Step Increment: {generation}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuliadTab;
