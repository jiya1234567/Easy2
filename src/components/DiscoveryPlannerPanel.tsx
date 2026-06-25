/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PolicyProposal, Experiment } from '../types';
import { Compass, Play, CheckCircle2, Award, ArrowUpRight, Beaker, Loader2 } from 'lucide-react';

interface DiscoveryPlannerPanelProps {
  selectedPolicy: PolicyProposal | null;
  addTemporalEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
}

export default function DiscoveryPlannerPanel({
  selectedPolicy,
  addTemporalEvent
}: DiscoveryPlannerPanelProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [trials, setTrials] = useState<Experiment[]>([]);
  const [bestTrial, setBestTrial] = useState<Experiment | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('');

  const handleStartDiscovery = () => {
    if (!selectedPolicy) return;

    setIsRunning(true);
    setProgress(0);
    setTrials([]);
    setBestTrial(null);
    setCurrentStep('Initializing Autonomous Experiment Cycle...');
    addTemporalEvent(`Discovery Planner initiated optimization loop for: ${selectedPolicy.title}`, 'info');
  };

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        
        // Trial 1 triggers at 20% progress
        if (next === 20) {
          setCurrentStep('Running Trial #1: Intensity sweep at 25% boundary...');
          const t1: Experiment = {
            id: 't-1',
            name: 'Low Intensity Floor',
            strength: 25,
            score: 58,
            outcome: 'Weak environmental impact (+32% air quality index), low public friction (92% acceptance). Cost within minimal envelope.',
            status: 'completed'
          };
          setTrials([t1]);
          addTemporalEvent(`Discovery Planner completed Trial #1 (25% Intensity): Score 58/100`, 'info');
        }

        // Trial 2 triggers at 50% progress
        if (next === 50) {
          setCurrentStep('Running Trial #2: Intensity sweep at 60% boundary...');
          const t2: Experiment = {
            id: 't-2',
            name: 'Optimal Equilibrium Curve',
            strength: 60,
            score: 88,
            outcome: 'High environmental impact (+78% air quality index), excellent citizen backing (86% acceptance). Yields optimal cost-benefit ratio.',
            status: 'completed'
          };
          setTrials((prevTrials) => [...prevTrials, t2]);
          addTemporalEvent(`Discovery Planner completed Trial #2 (60% Intensity): Score 88/100`, 'info');
        }

        // Trial 3 triggers at 80% progress
        if (next === 80) {
          setCurrentStep('Running Trial #3: Intensity sweep at 95% boundary...');
          const t3: Experiment = {
            id: 't-3',
            name: 'Maximum Saturation Threshold',
            strength: 95,
            score: 74,
            outcome: 'Absolute environmental capture (+96% air quality index), but triggers extreme tax friction and public outrage (38% acceptance). Overshot efficiency curve.',
            status: 'completed'
          };
          setTrials((prevTrials) => [...prevTrials, t3]);
          addTemporalEvent(`Discovery Planner completed Trial #3 (95% Intensity): Score 74/100`, 'info');
        }

        if (next >= 100) {
          clearInterval(timer);
          setIsRunning(false);
          setCurrentStep('Autonomous Discovery Complete!');
          
          // Determine best trial
          const optimal = {
            id: 't-2',
            name: 'Optimal Equilibrium Curve',
            strength: 60,
            score: 88,
            outcome: 'Recommend implementing at 60% Intensity. Avoid scaling past 75% to prevent citizen tax exhaustion and microclimate wind distortion.',
            status: 'completed' as const
          };
          setBestTrial(optimal);
          addTemporalEvent(`Discovery Planner found optimal parameter: 60% Sequestration Intensity (Efficiency Rank: 1/3)`, 'interaction');
          return 100;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isRunning, selectedPolicy]);

  return (
    <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] rounded-none flex flex-col gap-4 mt-2">
      <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-black" />
          <h2 className="font-bold text-[#1A1A1A] tracking-tight text-sm font-serif">Discovery Planner</h2>
        </div>
      </div>

      {!selectedPolicy ? (
        <div className="text-center p-6 text-xs text-slate-600 italic bg-white border border-[#1A1A1A] rounded-none font-serif">
          Select a policy proposal from the workspace to engage the autonomous optimization engine.
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          <p className="text-xs text-[#1A1A1A]/95 leading-relaxed bg-[#EBE8E3]/60 p-4 border border-[#1A1A1A] rounded-none font-serif">
            <strong>Stage 8 Autonomous Exploration:</strong> The Discovery Planner scans policy intensity vectors,
            evaluates cost-to-benefit boundary conditions, and outputs optimal parameters avoiding over-engineering failure states.
          </p>

          {/* Start Button & Progress HUD */}
          {!isRunning && !bestTrial ? (
            <button
              onClick={handleStartDiscovery}
              className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white rounded-none py-2.5 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition border border-[#1A1A1A] cursor-pointer"
            >
              <Beaker className="w-4 h-4" />
              Analyze Optimal Parameter Envelope
            </button>
          ) : (
            <div className="bg-[#FCFAF7] border border-[#1A1A1A] rounded-none p-3.5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-[#1A1A1A] flex items-center gap-1.5">
                  {isRunning ? <Loader2 className="w-3.5 h-3.5 text-[#E05A36] animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                  <span>{currentStep}</span>
                </span>
                <span className="text-[#E05A36] font-extrabold">{progress}%</span>
              </div>
              <div className="w-full bg-[#EBE8E3] h-2 rounded-none overflow-hidden border border-[#1A1A1A]">
                <div
                  className="bg-[#1A1A1A] h-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Running trial outcomes */}
          {trials.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold font-mono uppercase text-black tracking-wide">Experimental Trial Log</span>
              <div className="space-y-2">
                {trials.map((trial) => (
                  <div key={trial.id} className="bg-white border border-[#1A1A1A] p-3 rounded-none flex items-start gap-2.5 text-xs text-black">
                    <div className="bg-[#EBE8E3] border border-[#1A1A1A] rounded-none p-1 font-mono text-black text-[10px] font-bold shrink-0">
                      T{trial.id.split('-')[1]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5 border-b border-[#EBE8E3] pb-1">
                        <strong className="text-black text-[11px] font-serif font-bold italic">{trial.name}</strong>
                        <span className="text-[10px] font-mono font-bold text-[#1B6A43]">Score: {trial.score}/100</span>
                      </div>
                      <p className="text-xs text-slate-800 leading-normal font-serif italic mt-1">"{trial.outcome}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discovery optimal report overlay */}
          {bestTrial && (
            <div className="bg-[#EBE8E3]/60 border border-[#1A1A1A] p-4 rounded-none flex flex-col gap-2.5 animate-fadeIn text-[#1A1A1A]">
              <div className="flex items-center gap-1.5 text-[#1B6A43] font-mono font-bold text-xs uppercase tracking-wider">
                <Award className="w-4.5 h-4.5 text-[#1B6A43]" />
                <span>Optimal Configurations Found</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-white p-2.5 border border-[#1A1A1A] rounded-none flex flex-col">
                  <span className="text-[9px] text-slate-600 uppercase font-bold">Target Intensity</span>
                  <strong className="text-black text-sm font-extrabold mt-0.5">60% (Medium)</strong>
                </div>
                <div className="bg-white p-2.5 border border-[#1A1A1A] rounded-none flex flex-col">
                  <span className="text-[9px] text-slate-600 uppercase font-bold">System Efficiency</span>
                  <strong className="text-[#1B6A43] text-sm font-extrabold mt-0.5">88% (Peak)</strong>
                </div>
              </div>

              <p className="text-xs text-black leading-relaxed italic border-l-2 border-[#1A1A1A] pl-3 font-serif">
                "{bestTrial.outcome}"
              </p>

              <button
                onClick={handleStartDiscovery}
                className="text-[10px] font-mono font-bold text-[#E05A36] hover:underline flex items-center gap-1 mt-1 cursor-pointer bg-transparent border-none w-max"
              >
                <span>Re-run experimental parameters sweep</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
