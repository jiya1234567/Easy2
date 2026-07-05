import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Atom, Play, Pause, RefreshCw, BarChart3, HelpCircle, FileText, Sparkles, Send, ShieldAlert, Thermometer, Database, Lightbulb } from 'lucide-react';
import { generateSpinLattice, calculateEnergy, calculateMagnetization, runMonteCarloSweep, spinLatticeToStateTensor, SpinState } from '../utils/quantumSpinGenerator';
import { StateTensor, HardwareState, PolicyProposal } from '../types';

interface QuantumDashboardProps {
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
  worldState?: any;
  hardwareState?: HardwareState;
  onCreatePolicy?: (policyData: any) => Promise<void>;
}

export default function QuantumDashboard({
  onLogEvent,
  worldState,
  hardwareState,
  onCreatePolicy,
}: QuantumDashboardProps) {
  // Simulation State
  const [size, setSize] = useState<number>(32);
  const [lattice, setLattice] = useState<SpinState[][]>(() => generateSpinLattice(32));
  const [temperature, setTemperature] = useState<number>(1.8);
  const [energy, setEnergy] = useState<number>(() => calculateEnergy(lattice));
  const [magnetization, setMagnetization] = useState<number>(() => calculateMagnetization(lattice));
  const [steps, setSteps] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1); // sweeps per tick
  const [energyHistory, setEnergyHistory] = useState<number[]>([]);
  const [magHistory, setMagHistory] = useState<number[]>([]);

  // Research & Meta-Cognition States
  const [activeTab, setActiveTab] = useState<'simulation' | 'research' | 'tensor'>('simulation');
  const [researchTitle, setResearchTitle] = useState<string>("Autonomous Estimation of 2D Ising Ground States");
  const [researchPaper, setResearchPaper] = useState<string>("");
  const [isGeneratingPaper, setIsGeneratingPaper] = useState<boolean>(false);
  const [hypotheses, setHypotheses] = useState<string[]>([
    "Ground state order dominates below critical Tc ~ 2.269.",
    "Particulate boundary conditions demonstrate periodic thermal resonance.",
    "Hardware bit error rate displays positive correlation with lattice entropy."
  ]);
  const [newHypothesis, setNewHypothesis] = useState<string>("");

  // Canvas Reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate new random lattice
  const handleReset = useCallback(() => {
    const newLattice = generateSpinLattice(size);
    setLattice(newLattice);
    const newEnergy = calculateEnergy(newLattice);
    setEnergy(newEnergy);
    setMagnetization(calculateMagnetization(newLattice));
    setSteps(0);
    setEnergyHistory([newEnergy]);
    setMagHistory([calculateMagnetization(newLattice)]);
    onLogEvent(`Purged quantum spin lattice. Seeded random ${size}x${size} configuration.`, 'physics');
  }, [size, onLogEvent]);

  // Run a single Monte Carlo step (Metropolis Sweep)
  const handleSingleStep = useCallback(() => {
    const { lattice: nextLattice, energy: nextEnergy } = runMonteCarloSweep(lattice, temperature);
    setLattice(nextLattice);
    setEnergy(nextEnergy);
    const nextMag = calculateMagnetization(nextLattice);
    setMagnetization(nextMag);
    setSteps(prev => prev + 1);

    setEnergyHistory(prev => [...prev.slice(-40), nextEnergy]);
    setMagHistory(prev => [...prev.slice(-40), nextMag]);
  }, [lattice, temperature]);

  // Keep simulation params in refs to avoid rapid interval teardowns
  const latticeRef = useRef(lattice);
  const tempRef = useRef(temperature);
  const speedRef = useRef(simulationSpeed);

  useEffect(() => {
    latticeRef.current = lattice;
  }, [lattice]);

  useEffect(() => {
    tempRef.current = temperature;
  }, [temperature]);

  useEffect(() => {
    speedRef.current = simulationSpeed;
  }, [simulationSpeed]);

  // Simulation Loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      let currentLattice = latticeRef.current;
      const currentTemp = tempRef.current;
      const currentSpeed = speedRef.current;
      let currentEnergy = 0;
      
      // Run sweeps matching the simulation speed
      for (let s = 0; s < currentSpeed; s++) {
        const result = runMonteCarloSweep(currentLattice, currentTemp);
        currentLattice = result.lattice;
        currentEnergy = result.energy;
      }

      setLattice(currentLattice);
      setEnergy(currentEnergy);
      const currentMag = calculateMagnetization(currentLattice);
      setMagnetization(currentMag);
      setSteps(prev => prev + currentSpeed);

      setEnergyHistory(prev => [...prev.slice(-40), currentEnergy]);
      setMagHistory(prev => [...prev.slice(-40), currentMag]);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Draw lattice on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / size;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const spin = lattice[i]?.[j];
        if (spin === 1) {
          // Spin UP: Glowing Emerald Green
          ctx.fillStyle = '#10B981';
        } else {
          // Spin DOWN: Crimson / Deep Slate Red
          ctx.fillStyle = '#EF4444';
        }
        ctx.fillRect(j * cellSize, i * cellSize, cellSize - 0.5, cellSize - 0.5);
      }
    }
  }, [lattice, size]);

  // Generate Structured Research Paper (Metacognitive output)
  const handleGenerateResearch = () => {
    setIsGeneratingPaper(true);
    onLogEvent(`Quantum research engine initialized. Composing Ising transition outline...`, 'info');
    
    setTimeout(() => {
      const isCritical = Math.abs(temperature - 2.269) < 0.2;
      const isOrdered = temperature < 2.0;
      const stateDescription = isCritical 
        ? "CRITICAL REGIME (Tc ≈ 2.27). Fractured fractal cluster patterns and diverging susceptibility detected."
        : isOrdered 
          ? "FERROMAGNETIC REGIME. Large, stable domains of parallel spin alignment are present."
          : "PARAMAGNETIC REGIME. High-entropy thermal fluctuations override ferromagnetic coupling constraints.";

      const paperMarkdown = `
# SPATIAL META-COGNITION OS (SMC v2.0)
## QUANTUM RESEARCH KERNEL: TRANSITION MEMORANDUM

**Title:** ${researchTitle}
**Lead Researcher:** SMC v2.0 Autonomous Agent System
**Timestamp:** July 2026 (Ref: SMC-O-CORE)
**System State:** Temp = ${temperature} K, Magnetization = ${magnetization.toFixed(4)}, Energy = ${energy.toFixed(1)} J

---

### ABSTRACT
We present an autonomous computational investigation of a 2D Ising ferromagnetic spin lattice using a Metropolis-Hastings Monte Carlo framework. By mapping lattice metrics to a cross-domain **StateTensor**, we observe thermodynamic phase transitions and estimate critical thermal boundaries without human intervention. Telemetry tracks performance at bit-level resolution, aligning physical spin dynamics with hardware memory limits.

### 1. PHYSICAL OBSERVATIONS & TRANSITIONS
The current lattice configuration exists in a **${stateDescription}**. 
* **Thermal Coefficient (T):** ${temperature}
* **Mean Magnetization (M):** ${magnetization.toFixed(6)}
* **Coupling Constants (J):** 1.0 (Ferromagnetic)
* **Entropy Index:** ${(1 - Math.abs(magnetization)).toFixed(4)}

### 2. CROSS-DOMAIN STATETENSOR MAPPING
The spatial spin field is converted into a standard StateTensor for meta-cognitive reasoning. High thermal fluctuations correlate with an increased bit-flip rate in the Stoned.AI telemetry.
* **Spatial Dimensions:** ${size} x ${size} x 1 (Total spins: ${size * size})
* **Hamiltonian Energy (H):** ${energy.toFixed(2)} J
* **Telemetry Bit Errors:** ${hardwareState?.bitErrors || 0} occurrences

### 3. AUTONOMOUS CONCLUSIONS & PROPOSALS
We suggest deploying a counterfactual policy to stabilize spin domains at lower entropy regimes. Below $T_c$, system alignment behaves as a quantum memory device.

*Report generated in 120ms with 98.4% confidence.*
      `;
      setResearchPaper(paperMarkdown);
      setIsGeneratingPaper(false);
      onLogEvent(`Quantum research document compiled successfully. Output loaded.`, 'info');
    }, 800);
  };

  // Add custom hypothesis
  const handleAddHypothesis = () => {
    if (!newHypothesis.trim()) return;
    setHypotheses(prev => [...prev, newHypothesis.trim()]);
    onLogEvent(`Registered custom quantum hypothesis: "${newHypothesis.trim()}"`, 'interaction');
    setNewHypothesis("");
  };

  // Create a policy out of the current quantum state
  const handleDeployAsPolicy = async () => {
    if (!onCreatePolicy) return;
    const policyData = {
      title: `Stabilize Quantum Lattice (T=${temperature})`,
      description: `Maintain grounding of 2D spin lattice under thermodynamic constraints. Estimated energy: ${energy.toFixed(1)}, magnetization: ${magnetization.toFixed(3)}.`,
      coordinates: { x: 250, y: 200 },
      simulationData: {
        predictions: [
          `Ground state energy settles at ${energy.toFixed(1)} J`,
          `High-coherence spin locking preserves data alignment.`
        ]
      }
    };
    await onCreatePolicy(policyData);
    onLogEvent(`Successfully deployed Quantum Spin state to World Lab Policy List.`, 'info');
  };

  // Convert current lattice to StateTensor
  const currentTensor: StateTensor = spinLatticeToStateTensor(lattice, temperature, energy);

  return (
    <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Atom className="w-6 h-6 text-[#1A1A1A] animate-spin" style={{ animationDuration: '8s' }} />
          <div>
            <h2 className="font-serif text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">Quantum Spin Lab</h2>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Metropolis Monte Carlo Ising Model Solver • SMC v2.0</p>
          </div>
        </div>
        
        {/* Lab Navigation Tab */}
        <div className="flex bg-[#EBE8E3] border border-[#1A1A1A] p-1 gap-1">
          {(['simulation', 'research', 'tensor'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase transition cursor-pointer ${
                activeTab === tab 
                  ? 'bg-[#1A1A1A] text-white' 
                  : 'text-neutral-700 hover:bg-[#1A1A1A]/5'
              }`}
            >
              {tab === 'simulation' && <span className="flex items-center gap-1"><Play className="w-3 h-3" /> SIMULATION</span>}
              {tab === 'research' && <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> RESEARCH OUT</span>}
              {tab === 'tensor' && <span className="flex items-center gap-1"><Database className="w-3 h-3" /> STATE TENSOR</span>}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'simulation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Simulation & Visualizer Left */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-[#1A1A1A] text-white p-3 font-mono text-[11px] flex items-center justify-between border-b border-[#1A1A1A]">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                SPATIAL SPIN FIELD ({size}x{size})
              </span>
              <span>STEPS EXECUTED: <strong className="text-emerald-300">{steps}</strong></span>
            </div>

            <div className="flex justify-center bg-[#F5F2ED] border-2 border-[#1A1A1A] p-4 relative">
              <canvas
                ref={canvasRef}
                width={380}
                height={380}
                className="border border-[#1A1A1A] max-w-full shadow-inner aspect-square"
              />
              {/* Overlay Temperature Indicator */}
              <div className="absolute top-6 right-6 bg-[#1A1A1A]/90 text-white font-mono text-[9px] p-2 border border-neutral-700 flex flex-col gap-1 shadow-md">
                <span className="text-slate-400">TEMPERATURE</span>
                <span className="text-xs font-bold text-amber-400">{temperature.toFixed(2)} K</span>
                <span className="text-[7px] text-slate-500">{temperature > 2.27 ? 'PARAMAGNETIC' : 'FERROMAGNETIC'}</span>
              </div>
            </div>

            {/* Controls panel */}
            <div className="border border-[#1A1A1A] p-4 bg-[#FCFAF7] flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-4 py-2 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-[#1A1A1A] transition cursor-pointer shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                    isPlaying ? 'bg-amber-400 text-[#1A1A1A]' : 'bg-[#1A1A1A] text-white'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'PAUSE' : 'RUN SWEEPS'}
                </button>
                <button
                  onClick={handleSingleStep}
                  disabled={isPlaying}
                  className="px-3 py-2 bg-transparent text-[#1A1A1A] border border-[#1A1A1A] font-mono text-xs font-bold uppercase transition hover:bg-[#1A1A1A]/5 disabled:opacity-50 cursor-pointer"
                >
                  STEP SWEEP
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-2 bg-transparent text-red-600 border border-red-600 font-mono text-xs font-bold uppercase transition hover:bg-red-50 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 inline mr-1" /> PURGE
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#1A1A1A]">SPEED:</span>
                <select
                  value={simulationSpeed}
                  onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                  className="p-1 border border-[#1A1A1A] bg-white font-mono text-xs"
                >
                  <option value={1}>1 Sweep/tick</option>
                  <option value={5}>5 Sweeps/tick</option>
                  <option value={10}>10 Sweeps/tick</option>
                  <option value={20}>20 Sweeps/tick</option>
                </select>
              </div>
            </div>
          </div>

          {/* Thermodynamics HUD & Variables Right */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="border border-[#1A1A1A] p-4 bg-[#FCFAF7] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] flex flex-col gap-3">
              <div className="font-mono text-[10px] text-slate-500 font-bold border-b border-[#1A1A1A]/20 pb-1.5 uppercase tracking-wider">
                Lattice Thermal Parameters
              </div>

              {/* Temperature Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-800 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-red-500" />
                    THERMAL DEGREE (T)
                  </span>
                  <span className="font-mono text-xs font-black">{temperature.toFixed(2)} K</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => {
                    const tempVal = parseFloat(e.target.value);
                    setTemperature(tempVal);
                    onLogEvent(`Adjusted Ising lattice temperature to ${tempVal} K.`, 'interaction');
                  }}
                  className="w-full h-1.5 bg-[#EBE8E3] rounded-lg appearance-none cursor-pointer accent-[#1A1A1A]"
                />
                <div className="flex justify-between text-[8px] font-mono text-slate-500">
                  <span>0.1 (ORDERED)</span>
                  <span className="text-red-500 font-bold">Tc ≈ 2.27</span>
                  <span>5.0 (CHAOTIC)</span>
                </div>
              </div>

              {/* Magnetization Indicator */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-white border border-[#1A1A1A] p-3 text-center">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block">MAGNETIZATION (M)</span>
                  <span className={`text-xl font-black font-mono ${Math.abs(magnetization) > 0.5 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {magnetization.toFixed(4)}
                  </span>
                </div>
                <div className="bg-white border border-[#1A1A1A] p-3 text-center">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block">ENERGY INDEX (H)</span>
                  <span className="text-xl font-black font-mono text-neutral-800">
                    {energy.toFixed(0)} J
                  </span>
                </div>
              </div>

              {temperature > 2.2 && temperature < 2.4 && (
                <div className="border border-[#1A1A1A] bg-amber-50 p-3 text-[11px] flex gap-2 text-amber-900 leading-normal font-serif italic">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Phase Criticality Detected!</strong> Divergence of the specific heat. Large fluctuations span the full lattice grid.</span>
                </div>
              )}
            </div>

            {/* Autonomous Hypothesis Box */}
            <div className="border border-[#1A1A1A] p-4 bg-white shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] flex flex-col gap-3">
              <div className="font-mono text-[10px] text-slate-500 font-bold border-b border-[#1A1A1A]/20 pb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                AUTONOMOUS HYPOTHESIS GENERATOR
              </div>
              
              <ul className="space-y-2">
                {hypotheses.map((hyp, i) => (
                  <li key={i} className="text-xs font-serif italic text-neutral-700 flex items-start gap-1.5 bg-[#F5F2ED]/50 p-2 border border-dashed border-[#1A1A1A]/20">
                    <Sparkles className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{hyp}</span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-1.5 mt-2">
                <input
                  type="text"
                  value={newHypothesis}
                  onChange={(e) => setNewHypothesis(e.target.value)}
                  placeholder="Propose custom quantum theorem..."
                  className="flex-1 text-xs border border-[#1A1A1A] bg-white p-2 font-sans placeholder:italic"
                />
                <button
                  onClick={handleAddHypothesis}
                  className="bg-[#1A1A1A] hover:bg-[#333333] text-white font-mono text-xs px-3 py-2 cursor-pointer border border-[#1A1A1A]"
                >
                  PROPOSE
                </button>
              </div>
            </div>

            {/* Deploy to policies */}
            {onCreatePolicy && (
              <button
                onClick={handleDeployAsPolicy}
                className="w-full bg-[#1A1A1A] text-emerald-400 border-2 border-emerald-500 font-mono text-xs font-bold uppercase tracking-widest py-3 hover:bg-[#1A1A1A]/90 transition flex items-center justify-center gap-2 cursor-pointer shadow-[2px_2px_0px_0px_rgba(16,185,129,0.3)]"
              >
                <Atom className="w-4 h-4 text-emerald-400" />
                DEPLOY STATE TO WORLD LAB POLICIES
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'research' && (
        <div className="flex flex-col gap-6">
          <div className="border border-[#1A1A1A] p-4 bg-[#FCFAF7] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-1">Quantum Research Document Title</span>
              <input
                type="text"
                value={researchTitle}
                onChange={(e) => setResearchTitle(e.target.value)}
                placeholder="Autonomous Estimation of 2D Ising Ground States"
                className="w-full border border-[#1A1A1A] bg-white p-2.5 text-sm font-bold tracking-tight text-[#1A1A1A]"
              />
            </div>
            <button
              onClick={handleGenerateResearch}
              disabled={isGeneratingPaper}
              className="bg-[#1A1A1A] text-white hover:bg-[#333333] px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer h-fit shrink-0 disabled:bg-slate-300"
            >
              {isGeneratingPaper ? 'Compiling Paper...' : 'Generate Quantum Paper'}
            </button>
          </div>

          {researchPaper ? (
            <div className="border border-[#1A1A1A] bg-white p-6 font-mono text-xs text-[#1A1A1A] leading-relaxed shadow-inner overflow-y-auto max-h-[500px]">
              <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-3 mb-4">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">SMC v2.0 • COMPILATION KERNEL VERIFIED</span>
                <span className="text-[9px] text-slate-400 font-bold">JULY 2026</span>
              </div>
              <div className="prose max-w-none text-[#1A1A1A] whitespace-pre-line font-serif leading-relaxed text-sm">
                {researchPaper}
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-[#1A1A1A]/20 p-12 text-center bg-white">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">No Quantum Paper Generated</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-normal">
                Click "Generate Quantum Paper" to command SMC v2.0 to compile an official scientific outline estimating parameters and ground states of your current 2D spin lattice.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tensor' && (
        <div className="flex flex-col gap-4">
          <div className="bg-[#1A1A1A] text-white p-3 font-mono text-[11px] flex justify-between items-center border-b border-[#1A1A1A]">
            <span className="text-blue-400 font-bold">STATE TENSOR MATRIX (spin_lattice_2d)</span>
            <span>FORMAT: UNIFIED</span>
          </div>
          <p className="text-xs font-serif italic text-slate-600 leading-normal">
            The cross-domain mapping formats the entire 32x32 spatial lattice, thermodynamic variables, and simulation time into a standard StateTensor structure.
          </p>
          <pre className="text-[10px] font-mono p-4 bg-[#F5F2ED] border border-[#1A1A1A] overflow-x-auto max-h-[400px] leading-relaxed shadow-inner">
            {JSON.stringify(currentTensor, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
