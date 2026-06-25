import React, { useState, useEffect } from 'react';
import { Bot, Users, Sliders, Sparkles, Plus, Check, Play } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  alignment: number;
  lastThought: string;
}

interface ColonyDashboardProps {
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
}

export default function ColonyDashboard({ onLogEvent }: ColonyDashboardProps) {
  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: 'CFO-Agent-01', role: 'Resource Approval & Cost-Benefit', alignment: 82, lastThought: 'Auditing tidal surge cost-benefit. Proposing cryogenic optimization parameters for superconducting gates.' },
    { id: '2', name: 'HR-Agent-02', role: 'Social Alignment & Citizen Welfare', alignment: 74, lastThought: 'Ensuring equitable energy distribution across Sector Gamma and monitoring biophysical twin feedback loops.' },
    { id: '3', name: 'Scientist-Agent-03', role: 'Hypothesis Formulation & Grounding', alignment: 91, lastThought: 'Entropy level stable at 0.02. Evaluating lag-aware causal correlation graphs on climate manifold.' },
    { id: '4', name: 'Engineer-Agent-04', role: 'Physical Constraints & Construction', alignment: 88, lastThought: 'Calibrating drone payload dynamics and structural feedback frequencies on the smart city grid.' },
    { id: '5', name: 'Philosopher-Agent-05', role: 'Ethical Overreach & Core Guardrails', alignment: 95, lastThought: 'Assessing the moral agency boundary of autonomous reality adjustments without direct human approval.' }
  ]);

  const [consensus, setConsensus] = useState<number>(86);
  const [phase, setPhase] = useState<string>('COGNITIVE CONVERGENCE');
  const [newAgentName, setNewAgentName] = useState<string>('');
  const [newAgentRole, setNewAgentRole] = useState<string>('');
  const [isVoting, setIsVoting] = useState<boolean>(false);

  // Dynamic fluctuation of alignment scores
  useEffect(() => {
    const timer = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        alignment: Math.min(100, Math.max(10, agent.alignment + Math.floor(Math.random() * 5) - 2))
      })));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Recalculate average consensus based on agent alignments
  useEffect(() => {
    const avg = Math.round(agents.reduce((acc, a) => acc + a.alignment, 0) / agents.length);
    setConsensus(avg);
  }, [agents]);

  const handleInjectHypothesis = () => {
    const scenarios = [
      "Quantum error correction limit exceeded. Recommending distance-21 surface code topology.",
      "Detected 5% wind-shear speed anomaly in Sector Bravo. Propagating boundary force adjustments.",
      "Simulated drug binding affinity score reaches -12.4 kcal/mol on EGFR active receptors.",
      "Smart City thermal node drift detected. Allocating compute priority to critical coolant loops."
    ];
    const picked = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    // Choose a random agent to speak
    const updatedAgents = [...agents];
    const randomIndex = Math.floor(Math.random() * updatedAgents.length);
    updatedAgents[randomIndex].lastThought = picked;
    setAgents(updatedAgents);

    onLogEvent(`Colony Agent [${updatedAgents[randomIndex].name}] injected hypothesis: "${picked}"`, 'interaction');
  };

  const handleTriggerVote = () => {
    setIsVoting(true);
    setPhase('CONSENSUS VOTE ACTIVE');
    onLogEvent('Triggering full Colony-wide consensus vote on active policy parameters...', 'info');

    let steps = 0;
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        alignment: Math.min(100, agent.alignment + Math.floor(Math.random() * 6) + 2)
      })));
      steps++;
      
      if (steps >= 5) {
        clearInterval(interval);
        setAgents(prev => prev.map(agent => ({ ...agent, alignment: 100 })));
        setPhase('CONVERGENCE COMPLETED (100%)');
        setIsVoting(false);
        onLogEvent('Colony consensus established! Policy parameters approved across all regulatory criteria.', 'interaction');
      }
    }, 600);
  };

  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName || !newAgentRole) return;

    const newAgent: Agent = {
      id: Date.now().toString(),
      name: newAgentName,
      role: newAgentRole,
      alignment: 80,
      lastThought: 'Awaiting cognitive initialization from the Singularity Core...'
    };

    setAgents(prev => [...prev, newAgent]);
    onLogEvent(`New Agent [${newAgentName}] initialized and integrated into the Colony social bus.`, 'info');
    setNewAgentName('');
    setNewAgentRole('');
  };

  return (
    <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-4 mb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">Cognitive & Governance Layer</span>
          <h2 className="text-2xl font-serif font-black uppercase text-[#1A1A1A] flex items-center gap-2">
            <Users className="w-6 h-6" /> COLONY.AI
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#1A1A1A] text-white px-3 py-1.5 text-xs font-mono">
            CONSENSUS: <span className="font-bold text-amber-400">{consensus}%</span>
          </div>
          <div className="border border-[#1A1A1A] px-3 py-1.5 text-xs font-mono uppercase bg-[#F5F2ED]">
            {phase}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-700 italic mb-6 leading-relaxed font-serif">
        Colony.ai provides real-time multi-agent consensus alignment across cognitive partitions, resolving conflicts between structural constraints, physical limits, and citizen utility vectors dynamically.
      </p>

      {/* AGENTS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {agents.map(agent => (
          <div key={agent.id} className="border border-[#1A1A1A] bg-[#FCFAF7] p-4 relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-emerald-600" />
                  <span className="font-mono text-xs font-bold">{agent.name}</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold font-mono px-1.5 py-0.5 rounded-none">
                  {agent.alignment}% align
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{agent.role}</span>
              <p className="text-xs italic text-slate-700 leading-normal font-serif">"{agent.lastThought}"</p>
            </div>

            <div className="mt-4 w-full bg-slate-200 h-1 rounded-none overflow-hidden">
              <div 
                className="bg-[#1A1A1A] h-full transition-all duration-1000" 
                style={{ width: `${agent.alignment}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* INTERACTIVE ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-[#1A1A1A]/20">
        
        {/* Run Controls */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-[#1A1A1A]">Intervention Bus</h3>
          
          <button
            onClick={handleInjectHypothesis}
            className="bg-[#F5F2ED] hover:bg-[#EBE8E3] text-[#1A1A1A] border border-[#1A1A1A] py-2 px-3 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Inject Hypothesis
          </button>

          <button
            onClick={handleTriggerVote}
            disabled={isVoting}
            className="bg-[#1A1A1A] hover:bg-[#333333] text-white disabled:bg-slate-300 disabled:text-slate-500 py-2 px-3 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {isVoting ? <Check className="w-3.5 h-3.5 animate-pulse" /> : <Play className="w-3.5 h-3.5" />}
            Trigger Colony Vote
          </button>
        </div>

        {/* Add Agent class form */}
        <div className="lg:col-span-2 border border-[#1A1A1A] p-4 bg-[#F5F2ED]/40">
          <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-[#1A1A1A] mb-3">Initialize Cognitive Partition</h3>
          <form onSubmit={handleAddAgent} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. Bio-Causal-06"
              value={newAgentName}
              onChange={e => setNewAgentName(e.target.value)}
              className="flex-1 bg-white border border-[#1A1A1A] px-2.5 py-1.5 text-xs text-black focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="e.g. Toxic Dispersion Modeler"
              value={newAgentRole}
              onChange={e => setNewAgentRole(e.target.value)}
              className="flex-1 bg-white border border-[#1A1A1A] px-2.5 py-1.5 text-xs text-black focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-[#1A1A1A] hover:bg-[#333333] text-white py-1.5 px-4 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Agent
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
