import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Play, Cpu, Database, HelpCircle, ChevronRight, AlertCircle, 
  Sparkles, BookOpen, Layers, Settings, ChevronDown, ChevronUp, RefreshCw, 
  Lightbulb, Radio, CheckCircle, Flame, Eye, Save, Trash2
} from 'lucide-react';

interface HarnessConsoleProps {
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
  worldState?: {
    windVector: { x: number; y: number };
    diffusionRate: number;
    gravityFactor: number;
    heatFactor: number;
    waterLevel: number;
  };
  preloadedPrompt?: string;
  onClearPreloadedPrompt?: () => void;
}

interface HarnessMemory {
  id: string;
  agent: string;
  timestamp: string;
  role: 'observation' | 'hypothesis' | 'action' | 'result';
  content: string;
}

export default function HarnessConsole({ 
  onLogEvent, 
  worldState, 
  preloadedPrompt, 
  onClearPreloadedPrompt 
}: HarnessConsoleProps) {
  const [activeAgent, setActiveAgent] = useState<string>('democratic');
  const [query, setQuery] = useState<string>('Analyze the thermodynamic friction of high-velocity mass transfer under 1.5x diffusion coefficient.');
  
  // Watch for preloaded prompt from SOP Cheat Sheets
  useEffect(() => {
    if (preloadedPrompt) {
      setQuery(preloadedPrompt);
      if (onClearPreloadedPrompt) {
        onClearPreloadedPrompt();
      }
    }
  }, [preloadedPrompt, onClearPreloadedPrompt]);
  const [useDebate, setUseDebate] = useState<boolean>(true);
  const [recallN, setRecallN] = useState<number>(5);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0); // 0: idle, 1: context, 2: observe, 3: reason, 4: act/complete
  const [harnessLogs, setHarnessLogs] = useState<string[]>([]);
  const [memories, setMemories] = useState<HarnessMemory[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'console' | 'memory' | 'architecture'>('console');

  // Inference Stack Dropdowns (as in screenshot)
  const [primaryModel, setPrimaryModel] = useState<string>('mistral');
  const [challengerModel, setChallengerModel] = useState<string>('phi3');
  const [isInferenceStackOpen, setIsInferenceStackOpen] = useState<boolean>(true);

  // Discovery Planner (as in screenshot)
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState<boolean>(true);

  // Poll Mode: 'manual' or 'live'
  const [pollMode, setPollMode] = useState<'manual' | 'live'>('manual');
  const [pollCountdown, setPollCountdown] = useState<number>(12);

  // Dual pathway debate output state from API
  const [primaryProposal, setPrimaryProposal] = useState<string>('');
  const [challengerOpposition, setChallengerOpposition] = useState<string>('');
  const [synthesizedDecision, setSynthesizedDecision] = useState<string>('');
  
  const [proposalImage, setProposalImage] = useState<string>('');
  const [finalImage, setFinalImage] = useState<string>('');
  const [isGeneratingImages, setIsGeneratingImages] = useState<boolean>(false);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Presets & Planner Experiments matching each agent
  const agentExperiments: { [key: string]: { title: string; query: string }[] } = {
    democratic: [
      {
        title: "⚡ Dynamic Fluid Friction Compensator Sweep",
        query: "Simulate wave friction mitigation coefficients at coordinates (40, 55, 5) with zero-drag alternative boundaries."
      },
      {
        title: "🌲 Estuary Absorbent Canopy Location Drift",
        query: "Analyze carbon absorption coefficient and approval spikes if high-density bio-engineered canopy shifts to (68, 15)."
      },
      {
        title: "🌊 Tidal Hydro-Barrier Deflection Study",
        query: "Model fluid velocity drift parameters during a 180-degree wind vector reverse incident."
      }
    ],
    colony: [
      {
        title: "⚠️ Localized Node #12 Parity Fault Injection",
        query: "Trigger cognitive stress audits during localized parity faults on Core Gate #12 with 98.4% baseline consensus."
      },
      {
        title: "🧬 Cascading Network Compliance Recalibration",
        query: "Evaluate consensus thresholds and distance-21 surface code sweeps under active coordinate stress."
      }
    ],
    radiant: [
      {
        title: "🔥 Sector C High-Tension Field Sweep",
        query: "Analyze particle velocity containment vectors at 0.85 Tesla under extreme cryogenic boost quenches."
      },
      {
        title: "❄️ Cryo-Thermal Decoupling Half-Life Model",
        query: "Model magnetic field variance when particle vectors are inverted at cryo-substrate boundaries."
      }
    ],
    aromea: [
      {
        title: "💨 Aerosol Plume Eastward Velocity Test",
        query: "Predict molecular plume dispersion and air friction coefficients with a 2.5 m/s Eastward wind vector."
      },
      {
        title: "🌡️ Thermal Inversion Atmospheric Drift",
        query: "Analyze aerosol particle decay bounds during standard cold-air traps and ambient chemical mist releases."
      }
    ],
    stoned: [
      {
        title: "💾 Surface Code Register Integrity Audit",
        query: "Verify distance-21 surface code parity registers after high-frequency uncalibrated bit-flip sweeps."
      },
      {
        title: "⚡ Silicon Core Thermal Fault Calibration",
        query: "Model gate fidelity thresholds when cryo substrate temp climbs to 45 mK under stress testing."
      }
    ]
  };

  const presets: { [key: string]: string[] } = {
    democratic: [
      "Analyze the thermodynamic friction of high-velocity mass transfer under 1.5x diffusion coefficient.",
      "Evaluate approval indices for a synthetic carbon absorbent canopy placed at estuary coordinate (68, 15).",
      "Model coastal surge buffers with fluid velocity friction factors fully removed."
    ],
    colony: [
      "Simulate agent consensus under localized parity faults on Core Gate #12.",
      "Run social compliance audit after introducing environmental stress factor.",
      "Calculate quarantine thresholds for cognitive node network during sensory overflow."
    ],
    radiant: [
      "Analyze heat propagation of particles through high-energy field grid at 250mK.",
      "Model magnetic field alignment variance when particle vectors are inverted.",
      "Determine thermal decay half-life during active cryogenic boost sweeps."
    ],
    aromea: [
      "Predict molecular plume dispersion of Eucalyptus Biome Mist at 2.5 m/s Eastward wind vector.",
      "Calculate atmospheric diffusion rate under linear thermal inversion scenarios.",
      "Analyze aerosol drift limits when volatile tracer compound decay is set to 0.08."
    ],
    stoned: [
      "Audit silicon core register parity states after high-frequency thermal fault injections.",
      "Verify distance-21 surface code integrity during active cryo-thermal stress testing.",
      "Model gate fidelity drop during continuous uncalibrated bit-flip cycles."
    ]
  };

  // Seed memory on mount
  useEffect(() => {
    const saved = localStorage.getItem('omega_harness_memories');
    if (saved) {
      try {
        setMemories(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse memories:", e);
      }
    } else {
      const initialMemories: HarnessMemory[] = [
        { id: 'm1', agent: 'democratic', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), role: 'observation', content: 'Query: Deploy high-density bio-engineered canopy.' },
        { id: 'm2', agent: 'democratic', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), role: 'hypothesis', content: 'Mistral Primary: Establishing synthetic forest at (68, 15, 10) stabilizes temperature.' },
        { id: 'm3', agent: 'democratic', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), role: 'result', content: 'Arbiter Synthesis: Approved canopy with 85% intensity, buffering local residential boundaries.' },
        { id: 'm4', agent: 'radiant', timestamp: new Date(Date.now() - 3600000).toISOString(), role: 'observation', content: 'Sensor Input: High thermal friction detected at energy coordinates (40, 55).' },
        { id: 'm5', agent: 'radiant', timestamp: new Date(Date.now() - 3600000).toISOString(), role: 'action', content: 'Triggered active vacuum-tube kinetic dampeners.' }
      ];
      setMemories(initialMemories);
      localStorage.setItem('omega_harness_memories', JSON.stringify(initialMemories));
    }
  }, []);

  const saveMemories = (newMems: HarnessMemory[]) => {
    setMemories(newMems);
    localStorage.setItem('omega_harness_memories', JSON.stringify(newMems));
  };

  const handleClearMemory = (agentName: string) => {
    const filtered = memories.filter(m => m.agent !== agentName);
    saveMemories(filtered);
    onLogEvent(`Cleared memory namespace for agent [${agentName.toUpperCase()}].`, 'info');
  };

  const handleAgentChange = (agent: string) => {
    setActiveAgent(agent);
    if (presets[agent]) {
      setQuery(presets[agent][0]);
    }
  };

  const addLog = (msg: string) => {
    setHarnessLogs(prev => [...prev, msg]);
  };

  // Run structured loop matching harness.py & mistral_client.py
  const executeHarnessLoop = async () => {
    if (!query.trim() || isRunning) return;
    setIsRunning(true);
    setHarnessLogs([]);
    setCurrentStep(1);
    setPrimaryProposal('');
    setChallengerOpposition('');
    setSynthesizedDecision('');
    setProposalImage('');
    setFinalImage('');

    onLogEvent(`Harness runtime execution triggered for agent: ${activeAgent.toUpperCase()}`, 'interaction');

    // ─────────────────────────────────────────────────────────────
    // STAGE 1: CONTEXT (Memory Recall matching harness.py _build_context)
    // ─────────────────────────────────────────────────────────────
    addLog(`[SYSTEM] Initializing Agent: "${activeAgent.toUpperCase()}" ...`);
    await new Promise(r => setTimeout(r, 400));
    addLog(`[CONTEXT] Loading Persistent Memory Layer from /memory/${activeAgent}_memory.json ...`);
    await new Promise(r => setTimeout(r, 300));
    
    const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const matchedMems = memories.filter(m => 
      m.agent === activeAgent && 
      keywords.some(kw => m.content.toLowerCase().includes(kw))
    ).slice(0, recallN);

    addLog(`[CONTEXT] Memory Layer summary: ${memories.filter(m => m.agent === activeAgent).length} total vectors indexed.`);
    if (matchedMems.length > 0) {
      addLog(`[CONTEXT] Matched ${matchedMems.length} memory entries using keyword vector query:`);
      matchedMems.forEach(m => {
        addLog(`  -> [${m.role.toUpperCase()} @ ${m.timestamp.slice(11, 19)}] "${m.content.slice(0, 60)}..."`);
      });
    } else {
      addLog(`[CONTEXT] Zero matching memory vectors found. Using prompt blueprint baseline.`);
    }

    // ─────────────────────────────────────────────────────────────
    // STAGE 2: OBSERVE (Ingest sensors matching harness.py _observe)
    // ─────────────────────────────────────────────────────────────
    setCurrentStep(2);
    await new Promise(r => setTimeout(r, 400));
    addLog(`[OBSERVE] Actively querying sensors & digital twin physical parameters...`);
    
    const activeWind = worldState?.windVector || { x: 1, y: 0 };
    const activeDiff = worldState?.diffusionRate ?? 1.0;
    const activeHeat = worldState?.heatFactor ?? 1.0;
    const activeGravity = worldState?.gravityFactor ?? 1.0;
    const activeWater = worldState?.waterLevel ?? 50;

    const sensorSummary = `Wind=(${activeWind.x.toFixed(1)}, ${activeWind.y.toFixed(1)}), Diffusion=${activeDiff.toFixed(2)}x, Heat=${activeHeat.toFixed(2)}x, Gravity=${activeGravity.toFixed(2)}x, WaterLevel=${activeWater.toFixed(1)}%`;
    addLog(`[OBSERVE] Captured telemetry: ${sensorSummary}`);

    const obsId = 'm-' + Math.random().toString(36).substring(2, 7);
    const newObsMemory: HarnessMemory = {
      id: obsId,
      agent: activeAgent,
      timestamp: new Date().toISOString(),
      role: 'observation',
      content: `Query: ${query} | Environmental Telemetry: ${sensorSummary}`
    };

    // ─────────────────────────────────────────────────────────────
    // STAGE 3: REASON (Full-stack API call with Mistral x Phi3 Debate)
    // ─────────────────────────────────────────────────────────────
    setCurrentStep(3);
    addLog(`[REASON] Triggering Dual-Pathway reasoning via /api/harness/run...`);
    addLog(`[REASON] Primary path (model: "${primaryModel}") proposing thesis...`);
    
    let proposalTextForImage = "";
    let decisionTextForImage = "";

    try {
      const response = await fetch('/api/harness/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: activeAgent,
          query,
          primaryModel,
          challengerModel,
          useDebate,
          worldState
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      await new Promise(r => setTimeout(r, 600));

      setPrimaryProposal(data.primaryReasoning);
      proposalTextForImage = data.primaryReasoning;
      addLog(`[REASON] Proposer completed draft.`);

      if (useDebate) {
        addLog(`[REASON] Challenger path (model: "${challengerModel}") executing critique review...`);
        await new Promise(r => setTimeout(r, 600));
        setChallengerOpposition(data.challengerReasoning);
        addLog(`[REASON] Challenger analysis logged.`);

        addLog(`[REASON] Arbiter compiling debate synthesis...`);
        await new Promise(r => setTimeout(r, 500));
        setSynthesizedDecision(data.arbiterDecision);
        decisionTextForImage = data.arbiterDecision;
        addLog(`[REASON] Synthesis completed successfully.`);
      } else {
        setSynthesizedDecision(data.primaryReasoning);
        decisionTextForImage = data.primaryReasoning;
        addLog(`[REASON] Finished (Challenger review bypassed).`);
      }

      // ─────────────────────────────────────────────────────────────
      // STAGE 4: ACT (Actuate and write back matching harness.py _act)
      // ─────────────────────────────────────────────────────────────
      setCurrentStep(4);
      await new Promise(r => setTimeout(r, 400));
      addLog(`[ACT] Recording outcome decisions into memory block...`);

      const hypId = 'm-' + Math.random().toString(36).substring(2, 7);
      const resId = 'm-' + Math.random().toString(36).substring(2, 7);
      
      const newMems = [
        ...memories,
        newObsMemory,
        {
          id: hypId,
          agent: activeAgent,
          timestamp: new Date().toISOString(),
          role: 'hypothesis',
          content: `Model Debate: Proposer=${primaryModel} | Challenger=${challengerModel}.`
        },
        {
          id: resId,
          agent: activeAgent,
          timestamp: new Date().toISOString(),
          role: 'result',
          content: data.arbiterDecision.slice(0, 180) + "..."
        }
      ];
      saveMemories(newMems);

      addLog(`[ACT] Persistent storage updated. Write successfully committed.`);
      addLog(`[ACT] Actuating physics change log triggers...`);
      onLogEvent(`Harness complete: ${data.arbiterDecision.slice(0, 100)}...`, 'physics');

      // ─────────────────────────────────────────────────────────────
      // STAGE 5: VISUALIZE (Generate comparison schematics)
      // ─────────────────────────────────────────────────────────────
      setIsGeneratingImages(true);
      addLog(`[SYSTEM] Instantiating Nano Banana / Omni image creation models...`);
      addLog(`[SYSTEM] Generating dual visual representations: [PROPOSAL vs FINAL OUTCOME]...`);
      
      try {
        const imageRes = await fetch('/api/harness/generate-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            proposalText: proposalTextForImage || query,
            decisionText: decisionTextForImage || proposalTextForImage || query,
            agent: activeAgent,
            query
          })
        });
        if (imageRes.ok) {
          const imgData = await imageRes.json();
          setProposalImage(imgData.proposalImage);
          setFinalImage(imgData.finalImage);
          addLog(`[SYSTEM] High-fidelity visualization blueprints generated successfully.`);
        } else {
          throw new Error("Failed to generate schematic visualization.");
        }
      } catch (imgErr: any) {
        console.error("Image generation failed:", imgErr);
        addLog(`[SYSTEM] Warning: Image generation failed. Schematic blueprints generated as fallback.`);
      } finally {
        setIsGeneratingImages(false);
      }

    } catch (error: any) {
      console.error(error);
      addLog(`[ERROR] Full stack connection failed: ${error.message}. Triggering client-side sandbox backup...`);
      // Sandbox backup
      await new Promise(r => setTimeout(r, 1000));
      const backupDecision = `[ARBITER DESIGN] Auto-stabilize active limits for ${activeAgent.toUpperCase()} under ${sensorSummary}. Recommended backup coefficient calibrated to 0.45.`;
      setPrimaryProposal(`[SANDBOX PRIMARY] Analyze query: ${query}`);
      setChallengerOpposition(`[SANDBOX CHALLENGER] Review parameters.`);
      setSynthesizedDecision(backupDecision);
      addLog(`[SYSTEM] Client-side sandbox fallback completed.`);

      // Generate fallback procedural schematics for Sandbox
      setIsGeneratingImages(true);
      try {
        const imageRes = await fetch('/api/harness/generate-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            proposalText: `Analyze query: ${query}`,
            decisionText: backupDecision,
            agent: activeAgent,
            query
          })
        });
        if (imageRes.ok) {
          const imgData = await imageRes.json();
          setProposalImage(imgData.proposalImage);
          setFinalImage(imgData.finalImage);
        }
      } catch (imgErr) {
        console.error(imgErr);
      } finally {
        setIsGeneratingImages(false);
      }
    }

    await new Promise(r => setTimeout(r, 200));
    addLog(`[SYSTEM] OMEGA loop run complete.`);
    setIsRunning(false);
  };

  // Handle Poll Mode (Live) auto trigger
  useEffect(() => {
    if (pollMode === 'live') {
      setPollCountdown(12);
      
      countdownIntervalRef.current = setInterval(() => {
        setPollCountdown(prev => {
          if (prev <= 1) {
            return 12;
          }
          return prev - 1;
        });
      }, 1000);

      pollIntervalRef.current = setInterval(() => {
        if (!isRunning) {
          executeHarnessLoop();
        }
      }, 12000);
    } else {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [pollMode, activeAgent, query, useDebate, primaryModel, challengerModel, worldState]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [harnessLogs]);

  const filteredMemories = memories.filter(m => {
    const matchesAgent = m.agent === activeAgent;
    if (!matchesAgent) return false;
    if (!searchQuery) return true;
    return m.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
           m.role.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const loadExperiment = (expQuery: string) => {
    setQuery(expQuery);
    onLogEvent(`Discovery Planner recommendation loaded into active prompt.`, 'info');
  };

  return (
    <div className="bg-[#FAF9F6] border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] text-[#1A1A1A]">
      
      {/* BRAND HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] pb-5 mb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-600 block mb-1">
            Ω OMEGA HARNESS RUNTIME ENGINE • CORE v2
          </span>
          <h2 className="text-xl md:text-2xl font-serif font-black uppercase tracking-tight text-[#1A1A1A] flex items-center gap-2">
            🧠 OMEGA Harness v2 — Mistral × Phi3 Debate + Reality Loop
          </h2>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-1 bg-neutral-100 border border-[#1A1A1A] p-1 self-start md:self-center">
          {[
            { id: 'console', label: 'RUNTIME CONSOLE', icon: Terminal },
            { id: 'memory', label: 'MEMORY PERSISTENCE', icon: Database },
            { id: 'architecture', label: 'THEORY CODEBASE', icon: BookOpen }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 text-[9px] font-mono font-bold tracking-tight cursor-pointer flex items-center gap-1.5 transition ${
                  activeTab === tab.id
                    ? 'bg-[#1A1A1A] text-white'
                    : 'bg-transparent text-neutral-600 hover:text-black hover:bg-neutral-200/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'console' && (
        <div className="space-y-6">

          {/* INFERENCE STACK - MATCHING SCREENSHOT */}
          <div className="bg-white border-2 border-[#1A1A1A] overflow-hidden">
            <button 
              onClick={() => setIsInferenceStackOpen(!isInferenceStackOpen)}
              className="w-full flex items-center justify-between p-4 bg-neutral-50 border-b border-[#1A1A1A] hover:bg-neutral-100 transition text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-neutral-600" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-800">
                  ⚙️ Inference Stack Configurations
                </span>
              </div>
              {isInferenceStackOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isInferenceStackOpen && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Primary model select */}
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-600 block mb-1">
                      Primary model (Mistral Base)
                    </label>
                    <select
                      value={primaryModel}
                      onChange={(e) => setPrimaryModel(e.target.value)}
                      className="w-full border-2 border-[#1A1A1A] p-2 bg-white text-xs font-mono font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="mistral">mistral (primary tuned)</option>
                      <option value="llama3:70b">llama3:70b (deep logic)</option>
                      <option value="gemini-3.5-flash">gemini-3.5-flash (multimodal)</option>
                      <option value="gemma2">gemma2 (structured)</option>
                    </select>
                  </div>

                  {/* Challenger model select */}
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-600 block mb-1">
                      Challenger model
                    </label>
                    <select
                      value={challengerModel}
                      onChange={(e) => setChallengerModel(e.target.value)}
                      className="w-full border-2 border-[#1A1A1A] p-2 bg-white text-xs font-mono font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="phi3">phi3 (challenger audit)</option>
                      <option value="mistral-small">mistral-small (deductive review)</option>
                      <option value="phi3:mini">phi3:mini (fast critique)</option>
                      <option value="qwen2.5">qwen2.5 (quantitative logic)</option>
                    </select>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-500 font-sans leading-relaxed">
                  Changes apply to this agent's next run. Smaller models (e.g. phi3:mini) trade reasoning depth for speed — useful for testing the loop quickly before committing to longer auto-chain runs.
                </p>
              </div>
            )}
          </div>

          {/* MODE SELECTOR - MATCHING SCREENSHOT */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F1EFEA]/40 border border-[#1A1A1A] p-4">
            <div className="flex items-center gap-6">
              <span className="text-[11px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-indigo-600 animate-pulse" /> MODE:
              </span>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono font-bold">
                  <input
                    type="radio"
                    name="pollMode"
                    value="manual"
                    checked={pollMode === 'manual'}
                    onChange={() => setPollMode('manual')}
                    className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  />
                  <span>Manual (Single Step)</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono font-bold">
                  <input
                    type="radio"
                    name="pollMode"
                    value="live"
                    checked={pollMode === 'live'}
                    onChange={() => setPollMode('live')}
                    className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    Live (auto-poll) 
                    {pollMode === 'live' && (
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1 font-sans rounded-sm animate-pulse">
                        polling in {pollCountdown}s
                      </span>
                    )}
                  </span>
                </label>
              </div>
            </div>

            {pollMode === 'live' && (
              <div className="w-full sm:w-48 bg-neutral-200 h-1.5 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-1000"
                  style={{ width: `${(pollCountdown / 12) * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* DISCOVERY PLANNER ACCORDION - MATCHING SCREENSHOT */}
          <div className="bg-white border-2 border-[#1A1A1A] overflow-hidden">
            <button 
              onClick={() => setIsDiscoveryOpen(!isDiscoveryOpen)}
              className="w-full flex items-center justify-between p-4 bg-indigo-50 border-b border-[#1A1A1A] hover:bg-indigo-100/50 transition text-left cursor-pointer"
            >
              <div className="flex items-center gap-2 text-indigo-900">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  💡 Discovery Planner suggests a next experiment
                </span>
              </div>
              {isDiscoveryOpen ? <ChevronUp className="w-4 h-4 text-indigo-700" /> : <ChevronDown className="w-4 h-4 text-indigo-700" />}
            </button>

            {isDiscoveryOpen && (
              <div className="p-4 space-y-3 bg-indigo-50/10">
                <p className="text-[11px] text-indigo-950 font-serif italic mb-2">
                  Based on current sensor limits (wind, thermal gradients, and surface drift coefficient), the Discovery Planner recommends loading these custom physical scenarios into the OMEGA-CORE loop:
                </p>
                
                <div className="space-y-2">
                  {agentExperiments[activeAgent]?.map((exp, idx) => (
                    <div 
                      key={idx} 
                      className="border border-indigo-100 bg-white p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:border-indigo-300 transition"
                    >
                      <div className="flex-1">
                        <span className="text-[10px] font-mono font-bold text-indigo-700 block mb-0.5">
                          {exp.title}
                        </span>
                        <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                          "{exp.query}"
                        </p>
                      </div>
                      <button
                        onClick={() => loadExperiment(exp.query)}
                        className="bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white px-2.5 py-1.5 text-[9px] font-mono font-bold tracking-tight uppercase border border-indigo-200 transition cursor-pointer self-end md:self-center"
                      >
                        Load Experiment
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* MAIN RUNTIME SPLIT PANELS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* COLUMN 1: TARGET SELECTION & PROMPT INPUT */}
            <div className="lg:col-span-5 flex flex-col gap-4 border border-[#1A1A1A] p-4 bg-white">
              
              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-600 block mb-2">
                  Select Active Agent Workspace
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-1.5">
                  {[
                    { id: 'democratic', label: 'DEMO' },
                    { id: 'colony', label: 'COLONY' },
                    { id: 'radiant', label: 'RADIANT' },
                    { id: 'aromea', label: 'AROMEA' },
                    { id: 'stoned', label: 'STONED' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleAgentChange(item.id)}
                      className={`p-2 text-[9px] font-mono font-bold border-2 transition text-center cursor-pointer ${
                        activeAgent === item.id
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#1A1A1A]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-600">
                    Prompt Input Blueprint
                  </label>
                  <span className="text-[9px] font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-sm font-bold uppercase">
                    Agent = LLM + Harness
                  </span>
                </div>
                <div className="border-2 border-[#1A1A1A] bg-white overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-indigo-500">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter dynamic testing guidelines or physical queries..."
                    className="w-full h-28 p-3 text-xs font-mono bg-transparent focus:outline-none leading-relaxed border-none resize-none"
                  />
                  <div className="flex justify-between items-center px-3 py-2 bg-neutral-50 border-t border-[#1A1A1A] gap-2">
                    <span className="text-[9px] text-neutral-500 font-mono">
                      {query.length} chars
                    </span>
                    <button
                      onClick={executeHarnessLoop}
                      disabled={isRunning}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-300 text-white font-mono text-[10px] font-bold uppercase py-1 px-3 border border-emerald-800 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Play className={`w-3 h-3 text-white ${isRunning ? 'animate-spin' : ''}`} />
                      {isRunning ? 'RUNNING...' : 'RUN SIMULATION'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Preset Selector */}
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold block mb-1.5">
                  📋 Active Presets
                </span>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {presets[activeAgent]?.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(preset)}
                      className="w-full text-left p-1.5 text-[10px] font-serif italic text-neutral-700 hover:text-black hover:bg-neutral-100 border border-dashed border-neutral-200 block truncate"
                    >
                      "{preset}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Dual debate toggle & depth config */}
              <div className="border-t border-dashed border-neutral-200 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-700 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-neutral-500" />
                    Activate Dual-Pathway Debate
                  </span>
                  <button
                    onClick={() => setUseDebate(!useDebate)}
                    className={`w-12 h-6 border-2 border-[#1A1A1A] relative transition-colors p-0.5 cursor-pointer ${
                      useDebate ? 'bg-[#1A1A1A]' : 'bg-white'
                    }`}
                  >
                    <div className={`w-4 h-4 transition-transform ${
                      useDebate ? 'bg-white translate-x-6' : 'bg-[#1A1A1A]'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-700 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-neutral-500" />
                    Memory Recall Depth (vector n)
                  </span>
                  <select
                    value={recallN}
                    onChange={(e) => setRecallN(Number(e.target.value))}
                    className="border-2 border-[#1A1A1A] text-xs font-mono p-1 bg-white focus:outline-none cursor-pointer"
                  >
                    <option value={3}>3 matches</option>
                    <option value={5}>5 matches</option>
                    <option value={8}>8 matches</option>
                  </select>
                </div>
              </div>

              <button
                onClick={executeHarnessLoop}
                disabled={isRunning}
                className="w-full bg-[#1A1A1A] hover:bg-indigo-950 disabled:bg-neutral-300 text-white font-mono text-xs uppercase tracking-wider py-3.5 px-4 flex items-center justify-center gap-2 cursor-pointer mt-auto border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] active:translate-x-0.5 active:translate-y-0.5 transition"
              >
                <Play className={`w-4 h-4 text-emerald-400 ${isRunning ? 'animate-spin' : ''}`} />
                {isRunning ? 'RUNNING OMEGA LOOP FLOW...' : 'EXECUTE HARNESS LOOP'}
              </button>

            </div>

            {/* COLUMN 2: RUNTIME MONITOR & LOGS */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              
              {/* Terminal Logger */}
              <div className="border-2 border-[#1A1A1A] bg-[#121212] text-neutral-200 p-4 font-mono text-[11px] h-[200px] overflow-y-auto flex flex-col relative shadow-[inset_0px_2px_8px_rgba(0,0,0,0.8)]">
                <div className="sticky top-0 bg-[#121212] text-[9px] text-neutral-500 flex justify-between items-center pb-2 border-b border-neutral-800 mb-2 select-none">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" /> OMEGA-CORE TERMINAL RUNTIME (harness.py)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    RUNNING
                  </span>
                </div>
                
                <div className="flex-1 space-y-1">
                  {harnessLogs.length === 0 ? (
                    <div className="text-neutral-500 italic py-6 text-center select-none">
                      No active logs. Click "EXECUTE HARNESS LOOP" or select "Live (auto-poll)" to pipe streaming telemetry into the console.
                    </div>
                  ) : (
                    harnessLogs.map((log, idx) => {
                      let colorClass = 'text-neutral-400';
                      if (log.startsWith('[SYSTEM]')) colorClass = 'text-indigo-400 font-bold';
                      if (log.startsWith('[CONTEXT]')) colorClass = 'text-amber-400';
                      if (log.startsWith('[OBSERVE]')) colorClass = 'text-yellow-200';
                      if (log.startsWith('[REASON]')) colorClass = 'text-cyan-400';
                      if (log.startsWith('[ACT]')) colorClass = 'text-emerald-400 font-semibold';
                      return (
                        <div key={idx} className={`${colorClass} leading-normal`}>
                          {log}
                        </div>
                      );
                    })
                  )}
                  <div ref={terminalEndRef} />
                </div>
              </div>

              {/* Loop Progress Indicators */}
              <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[9px] uppercase font-bold border-b border-dashed border-[#1A1A1A]/10 pb-3">
                {[
                  { label: '1. Memory Recall', step: 1 },
                  { label: '2. Ingest Sensors', step: 2 },
                  { label: '3. Dual Reason', step: 3 },
                  { label: '4. Action Actuate', step: 4 }
                ].map(item => (
                  <div 
                    key={item.step} 
                    className={`p-1.5 border transition ${
                      currentStep === item.step 
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 animate-pulse' 
                        : currentStep > item.step 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Dual Debate Result Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Proposer box */}
                <div className="border border-[#1A1A1A] p-3 bg-white hover:shadow-md transition">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5 mb-2">
                    <span className="text-[10px] font-mono font-bold text-neutral-800">PRIMARY PROPOSAL</span>
                    <span className="text-[9px] bg-indigo-50 text-indigo-700 font-mono px-2 py-0.5 font-bold uppercase">
                      {primaryModel}
                    </span>
                  </div>
                  <p className="text-[11px] font-sans text-neutral-700 leading-relaxed whitespace-pre-line">
                    {primaryProposal || 'Awaiting reasoning step to fetch primary model proposal...'}
                  </p>
                </div>

                {/* Challenger box */}
                <div className="border border-[#1A1A1A] p-3 bg-white hover:shadow-md transition">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5 mb-2">
                    <span className="text-[10px] font-mono font-bold text-neutral-800">CHALLENGER ANALYSIS</span>
                    <span className="text-[9px] bg-amber-50 text-amber-700 font-mono px-2 py-0.5 font-bold uppercase">
                      {challengerModel}
                    </span>
                  </div>
                  <p className="text-[11px] font-sans text-neutral-700 leading-relaxed whitespace-pre-line">
                    {!useDebate 
                      ? 'Challenger analysis review is currently bypassed in setup.' 
                      : challengerOpposition || 'Awaiting reasoning step to initiate opponent review critique...'}
                  </p>
                </div>

              </div>

              {/* Arbiter Synthesized Result Box */}
              <div className="border-2 border-[#1A1A1A] p-4 bg-emerald-50/40">
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-emerald-950/10">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs uppercase font-mono tracking-wider">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Arbiter Decision Synthesis Output
                  </div>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-mono font-bold px-1.5 py-0.5">
                    RESOLVED
                  </span>
                </div>
                <p className="text-xs text-emerald-950 font-serif leading-relaxed italic whitespace-pre-line">
                  {synthesizedDecision || 'The arbiter synthesizes the strongest parameters from both Mistral and Phi3 to compile the final loop action outcome. Run simulation to execute.'}
                </p>
              </div>

              {/* Dual Visual Output: Proposal vs Final Outcome */}
              {(isGeneratingImages || proposalImage || finalImage) && (
                <div className="border-2 border-[#1A1A1A] bg-[#0A0A0F] p-4 text-white">
                  <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                      <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-200">
                        OMEGA VISUAL ENGINE // MODEL SCHEMATICS
                      </span>
                    </div>
                    {isGeneratingImages ? (
                      <span className="text-[10px] font-mono text-indigo-400 animate-pulse flex items-center gap-1">
                        <span className="inline-block animate-spin">⚡</span> GENERATING COGNITIVE RECONSTRUCTIONS...
                      </span>
                    ) : (
                      <span className="text-[9px] bg-indigo-950 text-indigo-300 font-mono px-2 py-0.5 border border-indigo-900 uppercase font-bold">
                        NANO BANANA // OMNI CREATOR
                      </span>
                    )}
                  </div>

                  {isGeneratingImages && !proposalImage && (
                    <div className="flex flex-col items-center justify-center py-12 border border-dashed border-neutral-800 bg-[#07070B] rounded-sm">
                      <div className="animate-spin text-3xl mb-3">🌀</div>
                      <p className="text-xs font-mono text-neutral-400">Synthesizing spatial blueprints from proposal to final output...</p>
                      <p className="text-[10px] font-mono text-neutral-600 mt-1">Calling gemini-2.5-flash-image network arrays...</p>
                    </div>
                  )}

                  {(proposalImage || finalImage) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Proposal Schematic */}
                      <div className="border border-neutral-800 bg-[#07070B] p-2 flex flex-col justify-between rounded-sm">
                        <div className="flex items-center justify-between mb-2 px-1 pb-1 border-b border-neutral-800">
                          <span className="text-[10px] font-mono font-bold text-neutral-300">STAGE A: THESIS PROPOSAL SCHEMATIC</span>
                          <span className="text-[9px] text-indigo-400 font-mono font-black uppercase">PROPOSED</span>
                        </div>
                        <div className="aspect-[16/9] w-full bg-neutral-950 overflow-hidden border border-neutral-800 relative rounded-sm">
                          {proposalImage ? (
                            <img 
                              src={proposalImage} 
                              alt="Proposal Blueprint Schematic" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600 font-mono">
                              Awaiting render...
                            </div>
                          )}
                        </div>
                        <div className="mt-2 text-[9px] font-mono text-neutral-500 leading-tight">
                          Visual mapping of the draft thesis proposed by the primary model. Shows initial coordinates and vector layouts.
                        </div>
                      </div>

                      {/* Final Outcome Blueprint */}
                      <div className="border border-neutral-800 bg-[#07070B] p-2 flex flex-col justify-between rounded-sm">
                        <div className="flex items-center justify-between mb-2 px-1 pb-1 border-b border-neutral-800">
                          <span className="text-[10px] font-mono font-bold text-neutral-300">STAGE B: ARBITER FINAL OUTCOME</span>
                          <span className="text-[9px] text-emerald-400 font-mono font-black uppercase">SYNTHESIZED</span>
                        </div>
                        <div className="aspect-[16/9] w-full bg-neutral-950 overflow-hidden border border-neutral-800 relative rounded-sm">
                          {finalImage ? (
                            <img 
                              src={finalImage} 
                              alt="Final Outcome Blueprint Schematic" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600 font-mono animate-pulse">
                              Synthesizing final vectors...
                            </div>
                          )}
                        </div>
                        <div className="mt-2 text-[9px] font-mono text-neutral-500 leading-tight">
                          Grounded physical outcome model compiled by the Arbiter synthesis engine. Shows stabilized diffusion and constraint bounds.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {activeTab === 'memory' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white border border-[#1A1A1A] p-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-neutral-600" />
              <span className="text-xs font-mono font-bold text-neutral-800">
                Persistent Cache Namespace Explorer: <span className="text-indigo-600 uppercase font-black">/memory/{activeAgent}_memory.json</span>
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search index keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-[#1A1A1A] bg-white text-xs font-mono px-2 py-1.5 focus:outline-none"
              />
              <button
                onClick={() => handleClearMemory(activeAgent)}
                className="bg-red-50 hover:bg-red-600 hover:text-white text-red-700 border border-red-200 text-[10px] font-mono px-3 py-1.5 uppercase font-bold cursor-pointer transition flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Namespace
              </button>
            </div>
          </div>

          <div className="border border-[#1A1A1A] bg-white max-h-[350px] overflow-y-auto">
            {filteredMemories.length === 0 ? (
              <div className="p-12 text-center text-neutral-400 font-mono text-xs select-none">
                No vector records stored in the "/memory/{activeAgent}_memory.json" partition namespace matching query filters.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {filteredMemories.map(m => (
                  <div key={m.id} className="p-3.5 font-mono text-[11px] hover:bg-neutral-50 flex items-start gap-4">
                    <span className="text-[9px] text-neutral-400 select-none">#{m.id}</span>
                    <span className={`text-[9px] px-2 py-0.5 font-bold uppercase select-none ${
                      m.role === 'observation' ? 'bg-yellow-100 text-yellow-800' :
                      m.role === 'hypothesis' ? 'bg-indigo-100 text-indigo-800' :
                      m.role === 'result' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-neutral-100 text-neutral-800'
                    }`}>
                      {m.role}
                    </span>
                    <div className="flex-1">
                      <p className="text-neutral-800 leading-normal font-sans text-xs">{m.content}</p>
                      <span className="text-[9px] text-neutral-400 block mt-1.5">{new Date(m.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'architecture' && (
        <div className="bg-white border border-[#1A1A1A] p-6 text-center space-y-6">
          <BookOpen className="w-10 h-10 text-indigo-600 mx-auto" />
          
          <div className="max-w-2xl mx-auto space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
              The OMEGA-CORE "AGENT = LLM + HARNESS" Runtime Architecture
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-serif">
              In this implementation, each digital twin subsystem (Democratic, Colony, Radiant, Aromea, Stoned) is wrapped by a dedicated runtime harness looping cycle. By utilizing persistent shared memory namespaces and the dual-pathway debate pipeline (Mistral primary proposer vs Phi3 challenger), decisions satisfy both citizen approval ratings and stringent thermodynamic/silicon constraints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left font-mono text-[11px]">
            <div className="border border-dashed border-neutral-300 p-4 space-y-1">
              <span className="font-bold text-indigo-600 uppercase block">01. CONTEXT LOAD</span>
              <span className="text-neutral-500 leading-normal block">
                Ingests historical memories and keyword vectors from /memory to ensure temporal consistency across cycles.
              </span>
            </div>
            <div className="border border-dashed border-neutral-300 p-4 space-y-1">
              <span className="font-bold text-indigo-600 uppercase block">02. SENSOR INGEST</span>
              <span className="text-neutral-500 leading-normal block">
                Reads current physical variables (wind speed, diffusion rates, thermal indices, gate state, gravity factor).
              </span>
            </div>
            <div className="border border-dashed border-neutral-300 p-4 space-y-1">
              <span className="font-bold text-indigo-600 uppercase block">03. DUAL REASON</span>
              <span className="text-neutral-500 leading-normal block">
                Mistral proposes, Phi3 critiques gaps, and an Arbiter synthesizes the final optimal policy vector.
              </span>
            </div>
            <div className="border border-dashed border-neutral-300 p-4 space-y-1">
              <span className="font-bold text-indigo-600 uppercase block">04. PERSIST & ACT</span>
              <span className="text-neutral-500 leading-normal block">
                Saves outcomes to local JSON vectors and triggers physical twin simulation modifications instantly.
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
