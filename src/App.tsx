/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { PolicyProposal, WorldState } from './types';
import SpatialCanvas from './components/SpatialCanvas';
import PolicyList from './components/PolicyList';
import SimulationControls from './components/SimulationControls';
import CounterfactualPanel from './components/CounterfactualPanel';
import DiscoveryPlannerPanel from './components/DiscoveryPlannerPanel';
import ColonyDashboard from './components/ColonyDashboard';
import RadiantDashboard from './components/RadiantDashboard';
import AromeaDashboard from './components/AromeaDashboard';
import StonedDashboard from './components/StonedDashboard';
import HarnessConsole from './components/HarnessConsole';
import SopGuidePanel from './components/SopGuidePanel';
import ArchitecturePanel from './components/ArchitecturePanel';
import StressTestDashboard from './components/StressTestDashboard';
import { 
  Beaker, Globe, Sparkles, Map, Vote, Network, BarChart3, HelpCircle,
  ExternalLink, Settings, Edit2, Check, X, Shield, Cpu, Zap, Wind, Layers, Terminal, BookOpen, GitBranch, Activity
} from 'lucide-react';

export default function App() {
  const [policies, setPolicies] = useState<PolicyProposal[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>("policy-1");
  const [probeCoords, setProbeCoords] = useState<{ x: number; y: number } | null>(null);
  const [showSpatialGraph, setShowSpatialGraph] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Singularity Multi-Lab state
  const [activeLab, setActiveLab] = useState<'world' | 'colony' | 'radiant' | 'aromea' | 'stoned' | 'harness' | 'sop' | 'architecture' | 'benchmark'>('world');
  const [showStackMap, setShowStackMap] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [harnessPreloadedPrompt, setHarnessPreloadedPrompt] = useState<string>('');

  // Auto-redirect harness lab tab clicks to the side-drawer chat console
  useEffect(() => {
    if (activeLab === 'harness') {
      setActiveLab('world');
      setIsChatOpen(true);
      addTemporalEvent(`Redirected full-screen harness view to responsive side actuator chat`, 'info');
    }
  }, [activeLab]);

  // Persistent shared links config for external applets
  const [labUrls, setLabUrls] = useState<{ [key: string]: string }>({
    world: 'https://ai.studio/apps/08c79c7e-4cbb-4a89-9a63-6d177ea6775c',
    colony: '',
    radiant: '',
    aromea: '',
    stoned: '',
    harness: ''
  });

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  // Hydrate custom links from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('singularity_lab_urls');
    if (saved) {
      try {
        setLabUrls((prev) => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) {
        console.error("Failed to load user lab links:", e);
      }
    }
  }, []);

  const handleSaveUrl = (key: string) => {
    const updated = { ...labUrls, [key]: editingValue };
    setLabUrls(updated);
    localStorage.setItem('singularity_lab_urls', JSON.stringify(updated));
    setEditingKey(null);
    addTemporalEvent(`Configured external redirection path for subsystem [${key.toUpperCase()}]: "${editingValue}"`, 'info');
  };

  // Time control states
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [temporalEvents, setTemporalEvents] = useState<{ time: number; details: string; type: 'info' | 'physics' | 'interaction' }[]>([]);
  const [simTime, setSimTime] = useState<number>(0);

  // Physics global states
  const [worldState, setWorldState] = useState<WorldState>({
    windVector: { x: 1, y: 0 },
    diffusionRate: 1.0,
    gravityFactor: 1.0,
    heatFactor: 1.0,
    waterLevel: 10,
    counterfactualMode: false
  });

  // Fetch policies on load
  const fetchPolicies = async () => {
    try {
      const res = await fetch('/api/policies');
      if (res.ok) {
        const data = await res.json();
        setPolicies(data);
      }
    } catch (e) {
      console.error("Failed to load policies from backend memory:", e);
    }
  };

  useEffect(() => {
    fetchPolicies();

    // Initial seed events
    setTemporalEvents([
      { time: 0, details: "Spatial Digital Twin grid initialized. Spatial graph coordinates aligned with World Model.", type: "info" },
      { time: 2, details: "Global wind vector initialized at (1.0 m/s East). Boundary thermal friction calibrated.", type: "physics" }
    ]);
  }, []);

  // Time ticker for temporal simulation log
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSimTime((prev) => prev + speed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  // Generate slight physics/agent telemetry logs when simTime changes
  useEffect(() => {
    if (simTime > 0 && simTime % 15 === 0) {
      const physicsLogs = [
        `Atmospheric particles drift at vector (${worldState.windVector.x * worldState.diffusionRate}, ${worldState.windVector.y * worldState.diffusionRate})`,
        `Gravity compression factors pull particulate matter to the Z-axis surface`,
        `Thermal gradient excites molecular movement vectors by ${worldState.heatFactor}x factor`
      ];
      const interactionLogs = [
        `Citizen agent group registered quality of life shift near policy clusters`,
        `Expert observers logged pressure levels adjusting inside coordinate bounds`,
        `Spatial graph linkages refreshed. No critical boundaries overreached.`
      ];

      const type = Math.random() > 0.5 ? 'physics' as const : 'interaction' as const;
      const details = type === 'physics' 
        ? physicsLogs[Math.floor(Math.random() * physicsLogs.length)]
        : interactionLogs[Math.floor(Math.random() * interactionLogs.length)];

      setTemporalEvents((prev) => [
        ...prev,
        { time: simTime, details, type }
      ]);
    }
  }, [simTime]);

  const addTemporalEvent = (details: string, type: 'info' | 'physics' | 'interaction') => {
    setTemporalEvents((prev) => [
      ...prev,
      { time: simTime, details, type }
    ]);
  };

  const handleSelectPolicy = (policy: PolicyProposal) => {
    setSelectedPolicyId(policy.id);
    addTemporalEvent(`User selected policy folder: ${policy.title}. Coordinates highlighted.`, 'info');
  };

  const handleCanvasClick = (coords: { x: number; y: number }) => {
    setProbeCoords(coords);
  };

  // Submit new proposal
  const handleCreatePolicy = async (policyData: any) => {
    try {
      const res = await fetch('/api/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policyData)
      });
      if (res.ok) {
        const newPolicy = await res.json();
        await fetchPolicies();
        setSelectedPolicyId(newPolicy.id);
        addTemporalEvent(`Successfully proposed policy: "${newPolicy.title}" at coordinates (${newPolicy.coordinates.x}, ${newPolicy.coordinates.y})`, 'info');
        
        // Auto-run simulation for the new policy immediately!
        await handleRunSimulation(newPolicy.id);
      }
    } catch (e) {
      console.error("Failed to deploy policy proposal:", e);
    }
  };

  // Upvote / Downvote
  const handleVote = async (policyId: string, type: 'up' | 'down' | 'neutral') => {
    try {
      const res = await fetch(`/api/policies/${policyId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      if (res.ok) {
        await fetchPolicies();
        addTemporalEvent(`Registered feedback vote [${type.toUpperCase()}] on policy id: ${policyId}`, 'interaction');
      }
    } catch (e) {
      console.error("Failed to submit feedback vote:", e);
    }
  };

  // Add Comment
  const handleAddComment = async (policyId: string, author: string, text: string, role: string) => {
    try {
      const res = await fetch(`/api/policies/${policyId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, text, role })
      });
      if (res.ok) {
        await fetchPolicies();
        addTemporalEvent(`Citizen comment logged under policy ${policyId}: "${text.slice(0, 30)}..."`, 'interaction');
      }
    } catch (e) {
      console.error("Failed to add feedback comment:", e);
    }
  };

  // Trigger Gemini AI Spatial simulation
  const handleRunSimulation = async (id: string | null = selectedPolicyId) => {
    if (!id) return;
    setIsGenerating(true);
    addTemporalEvent(`Spinning up Gemini Spatial AI reasoning engine to simulate boundary predictions...`, 'info');

    try {
      const res = await fetch(`/api/policies/${id}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customWorldState: worldState })
      });

      if (res.ok) {
        await fetchPolicies();
        addTemporalEvent(`Gemini Spatial simulation complete. Graph linkages mapped.`, 'info');
      }
    } catch (e) {
      console.error("Failed to simulate policy proposal:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedPolicy = policies.find((p) => p.id === selectedPolicyId) || null;
  const totalVotesCount = policies.reduce((acc, p) => acc + p.votes.up + p.votes.down + p.votes.neutral, 0);

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A]/10 selection:text-[#1A1A1A]">
      
      {/* MULTI-LAB CLOUD SINGULARITY ROUTER */}
      <div className="bg-[#1A1A1A] text-[#F5F2ED] font-mono text-[10px] py-2 px-4 border-b border-[#1A1A1A] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="font-bold tracking-wider text-emerald-400 uppercase">SINGULARITY BUS v4.0</span>
            <span className="text-neutral-600">|</span>
            
            {/* Portable Dropdown Switcher */}
            <div className="relative group">
              <button className="bg-neutral-800 hover:bg-neutral-700 text-white px-2 py-0.5 border border-neutral-700 rounded-none flex items-center gap-1 cursor-pointer font-bold">
                <span>PORTAL: {isChatOpen ? 'HARNESS' : activeLab.toUpperCase()}</span>
                <span className="text-[7px]">▼</span>
              </button>
              <div className="absolute left-0 mt-1 w-52 bg-[#1A1A1A] border border-neutral-800 shadow-2xl hidden group-hover:block z-50">
                {[
                  { id: 'world', name: '01. WORLD LAB', layer: 'Billionaire.ai Layer' },
                  { id: 'colony', name: '02. COLONY.AI', layer: 'Cognitive Layer' },
                  { id: 'radiant', name: '03. RADIANT LAB', layer: 'Physics Layer' },
                  { id: 'aromea', name: '04. AROMEA AI', layer: 'Sensory Layer' },
                  { id: 'stoned', name: '05. STONED.AI', layer: 'Substrate Layer' },
                  { id: 'harness', name: '06. HARNESS CHAT', layer: 'Actuator Chat Layer' },
                  { id: 'sop', name: '07. SOP GUIDES', layer: 'Operations Guide Layer' },
                  { id: 'architecture', name: '08. LOOP DESIGN', layer: 'Causal Loop Layer' },
                  { id: 'benchmark', name: '09. STRESS BENCHMARK', layer: 'Test Ingestion Layer' }
                ].map(item => {
                  const isItemHarness = item.id === 'harness';
                  const isItemActive = isItemHarness ? isChatOpen : (activeLab === item.id && !isChatOpen);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (isItemHarness) {
                          setIsChatOpen(!isChatOpen);
                          addTemporalEvent(`Toggled Harness Chat console via portal menu`, 'info');
                        } else {
                          setActiveLab(item.id as any);
                          setIsChatOpen(false);
                          addTemporalEvent(`Active view switched to ${item.name} console via portal menu`, 'info');
                        }
                      }}
                      className={`w-full text-left px-3 py-2 text-[10px] border-b border-neutral-900 transition flex flex-col justify-center cursor-pointer ${
                        isItemActive ? 'bg-[#F5F2ED] text-[#1A1A1A]' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                      }`}
                    >
                      <span className="font-bold">{item.name}</span>
                      <span className={`text-[8px] opacity-60 ${isItemActive ? 'text-slate-600' : 'text-neutral-400'}`}>{item.layer}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Horizontal rare toggle tabs */}
          <div className="flex flex-wrap items-center gap-1">
            {[
              { id: 'world', name: 'WORLD LAB', icon: Globe },
              { id: 'colony', name: 'COLONY.AI', icon: Shield },
              { id: 'radiant', name: 'RADIANT LAB', icon: Zap },
              { id: 'aromea', name: 'AROMEA AI', icon: Wind },
              { id: 'stoned', name: 'STONED.AI', icon: Cpu },
              { id: 'harness', name: 'HARNESS CHAT', icon: Terminal },
              { id: 'sop', name: 'SOP GUIDES', icon: BookOpen },
              { id: 'architecture', name: 'LOOP DESIGN', icon: GitBranch },
              { id: 'benchmark', name: 'STRESS TEST', icon: Activity }
            ].map(lab => {
              const Icon = lab.icon;
              const isHarness = lab.id === 'harness';
              const isActive = isHarness ? isChatOpen : (activeLab === lab.id && !isChatOpen);
              return (
                <button
                  key={lab.id}
                  onClick={() => {
                    if (isHarness) {
                      setIsChatOpen(!isChatOpen);
                      addTemporalEvent(`Toggled side-drawer Harness Chat console`, 'info');
                    } else {
                      setActiveLab(lab.id as any);
                      setIsChatOpen(false);
                      addTemporalEvent(`Active view toggled to subsystem console: ${lab.name}`, 'info');
                    }
                  }}
                  className={`px-3 py-1 text-[10px] font-bold tracking-tight transition cursor-pointer flex items-center gap-1.5 border ${
                    isActive
                      ? isHarness
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                        : 'bg-[#F5F2ED] text-[#1A1A1A] border-[#F5F2ED]'
                      : 'bg-transparent text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <Icon className={`w-3 h-3 ${isHarness && isChatOpen ? 'animate-pulse text-emerald-400' : ''}`} />
                  <span>{lab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Persistent URL input and launchers */}
          <div className="flex items-center gap-2">
            {editingKey === activeLab ? (
              <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-2 py-0.5">
                <input
                  type="text"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  placeholder="Paste shared app link..."
                  className="bg-transparent border-none text-[10px] text-white focus:outline-none w-44 font-mono"
                  autoFocus
                />
                <button
                  onClick={() => handleSaveUrl(activeLab)}
                  className="text-emerald-400 hover:text-white cursor-pointer"
                  title="Save Link"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setEditingKey(null)}
                  className="text-red-400 hover:text-white cursor-pointer"
                  title="Cancel"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 text-[9px] max-w-[120px] truncate">
                  {labUrls[activeLab] ? labUrls[activeLab].replace('https://', '') : 'No link configured'}
                </span>
                
                <button
                  onClick={() => {
                    setEditingKey(activeLab);
                    setEditingValue(labUrls[activeLab] || '');
                  }}
                  className="text-neutral-400 hover:text-white cursor-pointer"
                  title="Configure live link"
                >
                  <Edit2 className="w-3 h-3" />
                </button>

                {labUrls[activeLab] ? (
                  <a
                    href={labUrls[activeLab]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-neutral-800 hover:bg-neutral-700 text-[#F5F2ED] border border-neutral-700 px-2.5 py-1 text-[9px] font-bold tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>LAUNCH OUT</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ) : (
                  <span className="text-neutral-600 text-[9px]">Configure link to activate</span>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* BRANDING HEADER */}
      <header className="border-b border-[#1A1A1A] bg-[#FCFAF7]/80 relative px-4 py-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-60 mb-1">
              Billionaire.ai / Spatial Module v2.4
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.8] font-serif uppercase">
              WORLD LAB
            </h1>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 lg:text-right">
            {/* Live Metrics */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono border border-[#1A1A1A] bg-white px-4 py-2 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" />
                <span className="opacity-70">Citizens: <strong className="text-black">35</strong></span>
              </div>
              <div className="h-3 w-px bg-[#1A1A1A]/20" />
              <div className="flex items-center gap-1.5">
                <Vote className="w-3.5 h-3.5 text-[#1A1A1A]" />
                <span className="opacity-70">Assessments: <strong className="text-black">{totalVotesCount}</strong></span>
              </div>
              <div className="h-3 w-px bg-[#1A1A1A]/20" />
              <div className="flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-[#1A1A1A]" />
                <span className="opacity-70">Engine: <strong className="text-black">gemini-3.5</strong></span>
              </div>
            </div>

            <div className="text-left flex flex-col md:items-end gap-2.5">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-60 block">Status Assessment</span>
                <p className="text-xl font-light italic font-serif text-[#1A1A1A]">Beyond Expectation</p>
              </div>
              <button
                onClick={() => {
                  setShowStackMap(!showStackMap);
                  addTemporalEvent(`Toggled interaction stack mapping: ${!showStackMap ? 'VISIBLE' : 'HIDDEN'}`, 'info');
                }}
                className={`px-3 py-1 text-[9px] font-mono font-bold tracking-widest border border-[#1A1A1A] cursor-pointer transition-all ${
                  showStackMap ? 'bg-[#1A1A1A] text-white' : 'bg-transparent text-[#1A1A1A] hover:bg-[#1A1A1A]/5'
                }`}
              >
                {showStackMap ? 'HIDE ARCHITECTURE ▲' : 'VIEW ARCHITECTURE ▼'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN COHESIVE BENTO WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        {/* INTERACTIVE ASCII STACK MAP */}
        {showStackMap && (
          <div className="bg-[#1A1A1A] text-[#F5F2ED] border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] mb-8 font-mono text-[11px] overflow-x-auto relative animate-fade-in">
            <button 
              onClick={() => setShowStackMap(false)} 
              className="absolute top-4 right-4 text-neutral-400 hover:text-white cursor-pointer font-bold text-[10px]"
            >
              [CLOSE]
            </button>
            <div className="max-w-2xl mx-auto flex flex-col items-center">
              <span className="text-emerald-400 font-bold uppercase tracking-widest text-[9px] mb-4">SINGULARITY FULL-STACK INTERACTION LAYERS</span>
              
              <div className="w-full border border-neutral-700 p-4 bg-neutral-900/60 text-center">
                <div className="text-amber-400 font-bold tracking-wider mb-2">01. COGNITIVE & GOVERNANCE LAYER</div>
                <div className="text-neutral-300 text-[11px] flex flex-col items-center gap-1.5">
                  <button 
                    onClick={() => {
                      setActiveLab('colony');
                      addTemporalEvent('Navigated to colony.ai console via visual architecture model link', 'info');
                    }}
                    className="hover:text-amber-300 hover:underline transition cursor-pointer font-mono flex items-center gap-1.5 bg-transparent border-none text-left"
                  >
                    • colony.ai (Agent Group Consensus & Social Dynamics) ↗
                  </button>
                  <button 
                    onClick={() => {
                      setActiveLab('world');
                      addTemporalEvent('Navigated to Billionaire.ai World Lab console via visual architecture model link', 'info');
                    }}
                    className="hover:text-amber-300 hover:underline transition cursor-pointer font-mono flex items-center gap-1.5 bg-transparent border-none text-left"
                  >
                    • Billionaire.ai (Policy Parameters & Feedback Loops) ↗
                  </button>
                </div>
              </div>

              <div className="my-2 text-neutral-500 text-center flex flex-col items-center">
                <span className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold">Policy Vectors & Constraints</span>
                <span>▼</span>
              </div>

              <div className="w-full border border-neutral-700 p-4 bg-neutral-900/60 text-center">
                <div className="text-blue-400 font-bold tracking-wider mb-2">02. SPATIAL & PHYSICS LAYER</div>
                <div className="text-neutral-300 text-[11px] flex flex-col items-center gap-1.5">
                  <button 
                    onClick={() => {
                      setActiveLab('radiant');
                      addTemporalEvent('Navigated to Radiant Lab console via visual architecture model link', 'info');
                    }}
                    className="hover:text-blue-300 hover:underline transition cursor-pointer font-mono flex items-center gap-1.5 bg-transparent border-none text-left"
                  >
                    • RADIANT LAB (Thermal, High-Energy & Particle Fields) ↗
                  </button>
                  <button 
                    onClick={() => {
                      setActiveLab('world');
                      addTemporalEvent('Navigated to Billionaire.ai World Lab console via visual architecture model link', 'info');
                    }}
                    className="hover:text-blue-300 hover:underline transition cursor-pointer font-mono flex items-center gap-1.5 bg-transparent border-none text-left"
                  >
                    • Billionaire.ai (Spatial Coordinate Twin Grid X,Y,Z) ↗
                  </button>
                </div>
              </div>

              <div className="my-2 text-neutral-500 text-center flex flex-col items-center">
                <span className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold">Field Strengths & Gradients</span>
                <span>▼</span>
              </div>

              <div className="w-full border border-neutral-700 p-4 bg-neutral-900/60 text-center">
                <div className="text-emerald-400 font-bold tracking-wider mb-2">03. SENSORY & SUBSTRATE LAYER</div>
                <div className="text-neutral-300 text-[11px] flex flex-col items-center gap-1.5">
                  <button 
                    onClick={() => {
                      setActiveLab('aromea');
                      addTemporalEvent('Navigated to Aromea AI console via visual architecture model link', 'info');
                    }}
                    className="hover:text-emerald-300 hover:underline transition cursor-pointer font-mono flex items-center gap-1.5 bg-transparent border-none text-left"
                  >
                    • Aromea AI (Chemical, Emission & Olfactory Gradients) ↗
                  </button>
                  <button 
                    onClick={() => {
                      setActiveLab('stoned');
                      addTemporalEvent('Navigated to Stoned.ai console via visual architecture model link', 'info');
                    }}
                    className="hover:text-emerald-300 hover:underline transition cursor-pointer font-mono flex items-center gap-1.5 bg-transparent border-none text-left"
                  >
                    • STONED.AI (Hardware, Substrate & Material Boundaries) ↗
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeLab === 'world' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMN 1: POLICY WORKSPACE & CRITERIAS */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="relative">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white bg-[#1A1A1A] px-2 py-0.5 absolute -top-3 left-3 z-10">
                01. Policies
              </span>
              <PolicyList
                policies={policies}
                selectedPolicyId={selectedPolicyId}
                onSelectPolicy={handleSelectPolicy}
                probeCoords={probeCoords}
                onCreatePolicy={handleCreatePolicy}
                onVote={handleVote}
                onAddComment={handleAddComment}
                isGenerating={isGenerating}
              />
            </div>
          </div>

          {/* COLUMN 2: SPATIAL CANVAS & TIME CONTROLS */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white bg-[#1A1A1A] px-2 py-0.5 absolute -top-3 left-3 z-10">
                02. Spatial Field
              </span>
              <SpatialCanvas
                worldState={worldState}
                selectedPolicy={selectedPolicy}
                policies={policies}
                onCanvasClick={handleCanvasClick}
                showSpatialGraph={showSpatialGraph}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                speed={speed}
                temporalEvents={temporalEvents}
                addTemporalEvent={addTemporalEvent}
              />
            </div>

            <div className="relative">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white bg-[#1A1A1A] px-2 py-0.5 absolute -top-3 left-3 z-10">
                03. Temporal Control
              </span>
              <SimulationControls
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                speed={speed}
                setSpeed={setSpeed}
                temporalEvents={temporalEvents}
                onResetSimulation={() => {
                  setSimTime(0);
                  setTemporalEvents([
                    { time: 0, details: "Spatial state vector tables purged. Particle momentum recalibrated.", type: "info" }
                  ]);
                }}
              />
            </div>
          </div>

          {/* COLUMN 3: ANALYTICAL PHYSICS HUD (Counterfactual & Discovery Planner) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Simulation Trigger HUD (Stage 3 & 4 Graph analysis launcher) */}
            <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] flex flex-col gap-3.5 relative">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white bg-[#1A1A1A] px-2 py-0.5 absolute -top-3 left-3 z-10">
                04. Analysis
              </span>
              <div className="flex items-center gap-2 border-b border-[#1A1A1A] pb-2.5 mt-2">
                <BarChart3 className="w-4.5 h-4.5 text-[#1A1A1A]" />
                <h2 className="font-bold text-[#1A1A1A] text-xs uppercase tracking-wider font-sans">Spatial Reasoning</h2>
              </div>

              {selectedPolicy ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleRunSimulation()}
                    disabled={isGenerating}
                    className="w-full bg-[#1A1A1A] hover:bg-[#333333] disabled:bg-slate-300 disabled:text-slate-600 text-white font-mono uppercase tracking-wider text-xs py-2.5 transition border border-[#1A1A1A] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing Spatial Graph...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                        Generate AI Physical Impact
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs font-mono bg-[#EBE8E3] p-2.5 border border-[#1A1A1A]">
                    <span className="text-[#1A1A1A] flex items-center gap-1.5 font-bold">
                      <Network className="w-3.5 h-3.5 text-[#1A1A1A]" />
                      Topology Layers
                    </span>
                    <button
                      onClick={() => setShowSpatialGraph(!showSpatialGraph)}
                      className={`px-2 py-0.5 text-[10px] font-bold transition border border-[#1A1A1A] cursor-pointer ${showSpatialGraph ? 'bg-[#1A1A1A] text-white' : 'bg-transparent text-[#1A1A1A]'}`}
                    >
                      {showSpatialGraph ? 'ACTIVE' : 'MUTED'}
                    </button>
                  </div>

                  {/* Gemini generated Predictions List */}
                  {selectedPolicy.simulationData && (
                    <div className="bg-[#EBE8E3]/30 border border-[#1A1A1A] p-4 flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-black font-bold uppercase tracking-wide border-b border-[#1A1A1A] pb-1">Consequences Forecast</span>
                      <ul className="space-y-1.5">
                        {selectedPolicy.simulationData.predictions.map((pred, i) => (
                          <li key={i} className="text-xs text-[#1A1A1A] flex items-start gap-1.5 leading-normal font-serif italic">
                            <span className="text-[#1A1A1A] font-bold shrink-0">•</span>
                            <span>{pred}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-600 italic text-center py-4 bg-[#EBE8E3]/40 border border-[#1A1A1A]">
                  Select a policy workspace parameter on the left.
                </div>
              )}
            </div>

            <CounterfactualPanel
              worldState={worldState}
              setWorldState={setWorldState}
              selectedPolicy={selectedPolicy}
              addTemporalEvent={addTemporalEvent}
            />

            <DiscoveryPlannerPanel
              selectedPolicy={selectedPolicy}
              addTemporalEvent={addTemporalEvent}
            />
          </div>

        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          {activeLab === 'colony' && (
            <ColonyDashboard onLogEvent={addTemporalEvent} />
          )}
          {activeLab === 'radiant' && (
            <RadiantDashboard onLogEvent={addTemporalEvent} heatFactor={worldState.heatFactor} />
          )}
          {activeLab === 'aromea' && (
            <AromeaDashboard onLogEvent={addTemporalEvent} windVector={worldState.windVector} diffusionRate={worldState.diffusionRate} />
          )}
          {activeLab === 'stoned' && (
            <StonedDashboard onLogEvent={addTemporalEvent} />
          )}
          {activeLab === 'sop' && (
            <SopGuidePanel 
              onLogEvent={addTemporalEvent} 
              onLoadHarnessPrompt={(prompt) => {
                setHarnessPreloadedPrompt(prompt);
                setIsChatOpen(true);
              }}
            />
          )}
          {activeLab === 'architecture' && (
            <ArchitecturePanel onLogEvent={addTemporalEvent} />
          )}
          {activeLab === 'benchmark' && (
            <StressTestDashboard onLogEvent={addTemporalEvent} />
          )}
        </div>
      )}

        {/* BEAUTIFUL EDITORIAL FOOTER */}
        <footer className="mt-16 pt-6 border-t border-[#1A1A1A] flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-[#1A1A1A]">
          <div className="flex flex-wrap gap-12 text-[10px] font-bold uppercase tracking-widest font-mono">
            <span>Ref: BILLIONAIRE-AI-SPATIAL-2024</span>
            <span>Sensor Fusion: Unified State</span>
            <span>Agent: Colony-Stable</span>
          </div>
          <div className="text-[10px] italic opacity-75 font-serif max-w-xl text-left md:text-right leading-relaxed">
            3D World modeling and grounded simulation are the primary remaining friction points for the World Lab module. Transitions from user queries to autonomous state creation are ongoing.
          </div>
        </footer>
      </main>

      {/* FLOATING SIDE TAB TO CHAT */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#1A1A1A] hover:bg-neutral-800 text-emerald-400 border-l-2 border-y-2 border-emerald-500 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)] py-5 px-1.5 cursor-pointer transition-all rounded-l-md flex-col items-center gap-2 font-mono select-none"
        style={{ writingMode: 'vertical-lr' }}
        id="harness-side-chat-tab"
      >
        <span className="flex items-center gap-1 font-bold text-[9px] tracking-widest uppercase">
          <Terminal className="w-3.5 h-3.5 rotate-90 inline-block text-emerald-400 animate-pulse" />
          ACTUATOR CHAT
        </span>
      </button>

      {/* SLIDE-OUT CHAT DRAWER */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] md:w-[650px] bg-[#0A0A0F] border-l-2 border-[#1A1A1A] shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-transform duration-300 transform flex flex-col ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        id="harness-side-chat-drawer"
      >
        {/* Drawer Header */}
        <div className="bg-[#1A1A1A] text-[#F5F2ED] font-mono text-[11px] p-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="font-bold tracking-widest uppercase text-emerald-400">HARNESS CHAT CONSOLE</span>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            className="bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 px-3 py-1 text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1"
            id="close-drawer-btn"
          >
            <X className="w-3.5 h-3.5" />
            <span>CLOSE</span>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#0A0A0F]">
          <HarnessConsole 
            onLogEvent={addTemporalEvent} 
            worldState={worldState} 
            preloadedPrompt={harnessPreloadedPrompt}
            onClearPreloadedPrompt={() => setHarnessPreloadedPrompt('')}
          />
        </div>
      </div>

      {/* Backdrop overlay */}
      {isChatOpen && (
        <div 
          onClick={() => setIsChatOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
          id="chat-drawer-overlay"
        />
      )}
    </div>
  );
}
