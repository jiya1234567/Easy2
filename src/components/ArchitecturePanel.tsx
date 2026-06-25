import React, { useState, useEffect } from 'react';
import { 
  GitBranch, RefreshCw, Eye, Layers, Lightbulb, CheckSquare, ShieldAlert,
  Sliders, Play, RotateCw, BookOpen, Terminal, Network, Zap, Cpu, Server, Map, ChevronRight, PlayCircle
} from 'lucide-react';

interface LoopStep {
  id: number;
  name: string;
  shortDesc: string;
  icon: any;
  colorClass: string;
  activeComponent: string;
  codeSnippet: string;
  inputTensor: string;
  outputTensor: string;
}

export default function ArchitecturePanel({ 
  onLogEvent 
}: { 
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
}) {
  const [activeStepId, setActiveStepId] = useState<number>(1);
  const [loopIsRunning, setLoopIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'loop' | 'system'>('loop');

  // Animation cycle for the loop
  useEffect(() => {
    if (!loopIsRunning) return;

    const interval = setInterval(() => {
      setActiveStepId(prev => {
        const next = prev === 10 ? 1 : prev + 1;
        onLogEvent(`Active Discovery Loop auto-transitioned to Step ${next}: ${steps[next - 1].name}`, 'info');
        return next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [loopIsRunning]);

  const steps: LoopStep[] = [
    {
      id: 1,
      name: "Observe Reality",
      shortDesc: "Ingest active sensors, thermal gradients, Wind vectors, and pixel density states from the Spatial Canvas.",
      icon: Eye,
      colorClass: "text-blue-500 bg-blue-50 border-blue-200",
      activeComponent: "Spatial Canvas",
      inputTensor: "Raw telemetry sensors (H&E stain channels, real-time wind speeds, dil-ref thermal limits)",
      outputTensor: "{ spatial_coordinates: [X, Y], sensor_intensity: 0.85, boundary_state: 'LOCKED' }",
      codeSnippet: `def ingest_spatial_sensors(canvas_nodes):\n    """Read real-time coordinates and thermal bounds."""\n    active_matrix = np.zeros((100, 100, 4))\n    for node in canvas_nodes:\n        active_matrix[node.x, node.y] = [\n            node.heat, node.velocity_x, node.velocity_y, node.density\n        ]\n    return StateTensor(active_matrix)`
    },
    {
      id: 2,
      name: "Build State Tensor",
      shortDesc: "Encode continuous observations into structured multi-layer arrays (density, velocity, heat index).",
      icon: Layers,
      colorClass: "text-indigo-500 bg-indigo-50 border-indigo-200",
      activeComponent: "Core Kernel Engine",
      inputTensor: "Raw spatial sensor state array",
      outputTensor: "StateTensor(shape=(100, 100, 4), dtype=float32, layers=['density', 'v_x', 'v_y', 'heat'])",
      codeSnippet: `class StateTensor:\n    def __init__(self, raw_data):\n        self.tensor = tf.convert_to_tensor(raw_data, dtype=tf.float32)\n        self.layers = ['density', 'velocity_x', 'velocity_y', 'heat_factor']\n        \n    def get_layer(self, name):\n        return self.tensor[:, :, self.layers.index(name)]`
    },
    {
      id: 3,
      name: "Generate Hypotheses",
      shortDesc: "Evaluate the state tensor using Dual-Pathway agents to propose causal structures for active changes.",
      icon: Lightbulb,
      colorClass: "text-amber-500 bg-amber-50 border-amber-200",
      activeComponent: "Harness Console (LLM Core)",
      inputTensor: "StateTensor & historic system logs",
      outputTensor: "{ hypothesis: 'Heat excitation increases particle drift speed non-linearly', weight: 0.92 }",
      codeSnippet: `def generate_causal_hypotheses(state_tensor, memory_logs):\n    """Dual-pathway prompt synthesizer with Mistral proposer."""\n    prompt = compose_kernel_prompt(state_tensor, memory_logs)\n    proposer_output = llm_agents.mistral_propose(prompt)\n    challenger_critique = llm_agents.phi3_audit(proposer_output)\n    return synthesize_agreement(proposer_output, challenger_critique)`
    },
    {
      id: 4,
      name: "Run Counterfactuals",
      shortDesc: "Simulate 'what-if' scenarios by shifting key parameters (e.g. scaling heat +50% or adding heavy gravity constraints).",
      icon: Sliders,
      colorClass: "text-rose-500 bg-rose-50 border-rose-200",
      activeComponent: "Counterfactual Panel",
      inputTensor: "{ active_state: StateTensor, parameter_mutations: { heat_factor: 1.5, gravity: 0.05 } }",
      outputTensor: "CounterfactualPredictionTensor(variance_offset=0.24, stability_bounds='VIOLATED')",
      codeSnippet: `def compute_counterfactual_drift(baseline_tensor, parameter_mutations):\n    """Evaluate how state changes if inputs shift hypothetically."""\n    mutated_tensor = baseline_tensor.clone()\n    for param, value in parameter_mutations.items():\n        mutated_tensor.apply_parameter(param, value)\n    \n    projected_loss = run_rk4_ode_step(mutated_tensor, step_size=0.1)\n    return projected_loss`
    },
    {
      id: 5,
      name: "Discover Causes",
      shortDesc: "Run statistical significance filters to identify real causal roots from random signal noise.",
      icon: CheckSquare,
      colorClass: "text-teal-500 bg-teal-50 border-teal-200",
      activeComponent: "Stoned Substrate Core",
      inputTensor: "History of temporal events & counterfactual outcomes",
      outputTensor: "{ granger_causality_score: 0.89, target_cause: 'localized_heat_sink', confidence: 0.98 }",
      codeSnippet: `def evaluate_granger_causality(temporal_history, parameter):\n    """Isolate real drivers from correlated environmental noise."""\n    restricted_model = fit_autoregressive_model(temporal_history, exclude=parameter)\n    unrestricted_model = fit_autoregressive_model(temporal_history, include=parameter)\n    \n    f_statistic = calculate_f_stat(restricted_model, unrestricted_model)\n    return f_statistic > F_CRITICAL_THRESHOLD`
    },
    {
      id: 6,
      name: "Create Experiments",
      shortDesc: "Formulate concrete actuator instructions and target boundary metrics for immediate simulation testing.",
      icon: Terminal,
      colorClass: "text-emerald-500 bg-emerald-50 border-emerald-200",
      activeComponent: "Discovery Planner Panel",
      inputTensor: "{ isolated_cause: 'localized_heat_sink', priority_level: 'HIGH' }",
      outputTensor: "{ experimental_protocol: 'Inject micro-coolant pulse near quadrant (68, 15)', target: 'thermal_stabilization' }",
      codeSnippet: `def assemble_experiment_protocol(causal_root):\n    """Assemble active testing blueprints to run on the simulation canvas."""\n    target_sectors = find_vulnerable_quadrants(causal_root)\n    blueprint = {\n        'actuator_target': 'coolant_injection',\n        'quadrants': target_sectors,\n        'intensity': 75,\n        'duration_steps': 100\n    }\n    return blueprint`
    },
    {
      id: 7,
      name: "Simulate Futures",
      shortDesc: "Execute physical simulation projection in parallel loops, projecting the system forward up to 100 turns.",
      icon: Play,
      colorClass: "text-cyan-500 bg-cyan-50 border-cyan-200",
      activeComponent: "Radiant / Aromea Lab Engine",
      inputTensor: "Current StateTensor & target experiment protocols",
      outputTensor: "ProjectedFutureMatrix(steps=100, final_system_coherence=0.9992)",
      codeSnippet: `def project_simulation_future(initial_state, protocol, steps=100):\n    """Run 4th-order Runge-Kutta updates to simulate system trajectory."""\n    state_trajectory = [initial_state]\n    for t in range(steps):\n        next_state = rk4_integration_step(\n            state_trajectory[-1], \n            physics_boundary_rules, \n            external_forces=protocol\n        )\n        state_trajectory.append(next_state)\n    return state_trajectory`
    },
    {
      id: 8,
      name: "Compare With Reality",
      shortDesc: "Quantify divergence metrics by comparing simulated projections with real incoming sensor streams.",
      icon: Sliders,
      colorClass: "text-purple-500 bg-purple-50 border-purple-200",
      activeComponent: "Simulation Controls Hub",
      inputTensor: "ProjectedFutureMatrix & actual sensor streams observed at t=100",
      outputTensor: "{ l2_norm_divergence: 0.0241, accuracy_percent: 97.59% }",
      codeSnippet: `def compute_prediction_error(projected_trajectory, actual_observations):\n    """Calculate L2 norm difference vector across spatial matrices."""\n    simulated_final = projected_trajectory[-1].to_numpy()\n    actual_final = actual_observations.to_numpy()\n    \n    l2_error = np.linalg.norm(simulated_final - actual_final)\n    mean_accuracy = 1.0 - (l2_error / np.max(actual_final))\n    return l2_error, mean_accuracy`
    },
    {
      id: 9,
      name: "Learn",
      shortDesc: "Update neural network weights, persistent memory buffers, and causal confidence limits based on error vectors.",
      icon: RotateCw,
      colorClass: "text-fuchsia-500 bg-fuchsia-50 border-fuchsia-200",
      activeComponent: "Harness Memory System",
      inputTensor: "{ accuracy_percent: 97.59%, model_weights_to_update: 'diffusion_friction_coefficients' }",
      outputTensor: "UpdatedWeights(alpha_bias=0.031, updated_memories_added=1)",
      codeSnippet: `def update_shared_memory(prediction_error, hypothesis, memory_namespace):\n    """Refine causal biases inside the agent database cluster."""\n    if prediction_error < STABILIZATION_BOUND:\n        confidence_boost = 0.05 * (1.0 - prediction_error)\n        memory_namespace.update_confidence(hypothesis.id, confidence_boost)\n    else:\n        memory_namespace.penalize_causal_path(hypothesis.id, penalty=0.1)\n    memory_namespace.add_record(hypothesis, accuracy=1.0 - prediction_error)`
    },
    {
      id: 10,
      name: "Repeat",
      shortDesc: "Restart the active loop utilizing updated weights to achieve tighter physical control and discovery boundaries.",
      icon: RefreshCw,
      colorClass: "text-emerald-500 bg-emerald-50 border-emerald-200",
      activeComponent: "OMEGA System Core",
      inputTensor: "Updated system weights & active environment triggers",
      outputTensor: "CycleComplete(next_iteration_scheduled=True, current_timestamp=1782294100)",
      codeSnippet: `def trigger_omega_feedback_cycle(iteration_count):\n    """Re-initialize the spatial sensor sweeps using the calibrated matrices."""\n    log_system_telemetry(f"Cycle {iteration_count} completed. Recalibrating...")\n    time.sleep(0.001)\n    return start_next_observation_pass()`
    }
  ];

  const handleManualStepChange = (id: number) => {
    setActiveStepId(id);
    onLogEvent(`Manually switched visual OMEGA loop view to step [${id}]: ${steps[id - 1].name}`, 'interaction');
  };

  const selectedStep = steps[activeStepId - 1];

  return (
    <div className="bg-[#FCFAF7] border-2 border-[#1A1A1A] p-6 shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] flex flex-col gap-6" id="architecture-panel-dashboard">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#1A1A1A] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-indigo-600" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 border border-indigo-300">
              CORE SYSTEM COGNITION
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A1A1A] font-serif uppercase mt-1">
            OMEGA SYSTEM DESIGN & HYPOTHESIS LOOP
          </h2>
          <p className="text-xs text-[#555555] font-serif italic mt-0.5">
            Interactive structural maps and sequential Active Discovery protocols powering OMEGA digital twins.
          </p>
        </div>
        
        {/* Toggle between Loop View and Structural Link View */}
        <div className="flex bg-[#EBE8E3] border-2 border-[#1A1A1A] p-0.5">
          <button
            onClick={() => {
              setActiveTab('loop');
              onLogEvent('Switched architecture console view to Loop Paradigm', 'interaction');
            }}
            className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'loop' ? 'bg-[#1A1A1A] text-white' : 'text-neutral-600 hover:text-black'
            }`}
          >
            ACTIVE DISCOVERY LOOP
          </button>
          <button
            onClick={() => {
              setActiveTab('system');
              onLogEvent('Switched architecture console view to System Core Linkage Map', 'interaction');
            }}
            className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'system' ? 'bg-[#1A1A1A] text-white' : 'text-neutral-600 hover:text-black'
            }`}
          >
            SYSTEM LINKAGE DIALECT
          </button>
        </div>
      </div>

      {activeTab === 'loop' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="active-discovery-loop-grid">
          
          {/* Left Column: Interactive 10-Step OODA Visual Diagram */}
          <div className="xl:col-span-5 flex flex-col border-2 border-[#1A1A1A] bg-white p-4 justify-between min-h-[500px]">
            <div>
              <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-2 mb-4">
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  01. SEQUENTIAL DISCOVERY VECTOR
                </span>
                <button
                  onClick={() => {
                    setLoopIsRunning(!loopIsRunning);
                    onLogEvent(`${loopIsRunning ? 'Paused' : 'Started'} OMEGA active feedback loop simulation`, 'interaction');
                  }}
                  className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase border cursor-pointer transition-all flex items-center gap-1 ${
                    loopIsRunning 
                      ? 'bg-emerald-600 text-white border-emerald-800 animate-pulse' 
                      : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-500'
                  }`}
                >
                  <RefreshCw className={`w-3 h-3 ${loopIsRunning ? 'animate-spin' : ''}`} />
                  <span>{loopIsRunning ? 'AUTO-LOOP: RUNNING' : 'ACTIVATE AUTO-LOOP'}</span>
                </button>
              </div>

              {/* Sequential nodes flow list */}
              <div className="relative flex flex-col gap-1.5">
                {steps.map(step => {
                  const StepIcon = step.icon;
                  const isActive = step.id === activeStepId;
                  return (
                    <button
                      key={step.id}
                      onClick={() => handleManualStepChange(step.id)}
                      className={`w-full text-left p-2.5 flex items-center gap-3 border transition-all cursor-pointer relative ${
                        isActive
                          ? 'bg-indigo-50 border-indigo-500 shadow-[2px_2px_0px_0px_rgba(99,102,241,0.2)] scale-[1.01]'
                          : 'bg-[#FCFAF7] border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      {/* Left color badge indicator */}
                      <div className={`p-1.5 border shrink-0 ${
                        isActive 
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' 
                          : 'bg-neutral-100 text-[#1A1A1A] border-neutral-300'
                      }`}>
                        <StepIcon className="w-3.5 h-3.5" />
                      </div>

                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-mono font-bold text-neutral-400 block -mb-0.5">
                            STEP {step.id.toString().padStart(2, '0')}
                          </span>
                          <span className={`text-xs font-bold uppercase font-sans ${isActive ? 'text-indigo-950 font-black' : 'text-neutral-700'}`}>
                            {step.name}
                          </span>
                        </div>
                        
                        <div className="text-[8px] font-mono text-neutral-400 font-bold uppercase mr-1">
                          {step.activeComponent}
                        </div>
                      </div>

                      {/* Direction arrow on active step */}
                      {isActive && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping absolute" />
                          <ChevronRight className="w-4 h-4 text-indigo-600 relative z-10" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 p-2 text-center text-[9px] font-mono text-neutral-500 uppercase font-bold tracking-tight mt-4">
              * OMEGA feedback dynamics execute continuously at ~1.2 Kilohertz loops.
            </div>
          </div>

          {/* Right Column: Step Telemetry Analysis, Input/Output, & Kernel code blocks */}
          <div className="xl:col-span-7 flex flex-col border-2 border-[#1A1A1A] bg-[#FCFAF7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] overflow-hidden">
            
            {/* Step header indicator */}
            <div className="bg-[#1A1A1A] text-white p-4 flex items-center justify-between border-b-2 border-[#1A1A1A]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 text-white border border-indigo-400">
                  {React.createElement(selectedStep.icon, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-indigo-400 font-bold uppercase">
                    LOOP STEP {selectedStep.id.toString().padStart(2, '0')} • {selectedStep.activeComponent}
                  </span>
                  <h3 className="text-base font-black font-serif uppercase tracking-tight text-[#FCFAF7]">
                    {selectedStep.name} Method Dialect
                  </h3>
                </div>
              </div>
              <span className="text-[9px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 border border-neutral-800">
                ACTIVE STATE
              </span>
            </div>

            {/* Content panel */}
            <div className="p-5 flex flex-col gap-4">
              
              {/* Short explanation block */}
              <div className="bg-white border border-[#1A1A1A] p-4 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 border-b border-[#1A1A1A]/10 pb-1 mb-2">
                  Step Description & Physical Purpose
                </h5>
                <p className="text-xs text-neutral-800 font-serif leading-relaxed italic">
                  "{selectedStep.shortDesc}"
                </p>
              </div>

              {/* Data structures Input/Output tensor maps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white border border-[#1A1A1A] p-3 flex flex-col gap-1.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                    INPUT STRUCT
                  </span>
                  <div className="bg-neutral-50 p-2 border border-neutral-200 rounded-sm font-mono text-[10px] text-neutral-700 min-h-[50px] leading-tight select-all">
                    {selectedStep.inputTensor}
                  </div>
                </div>

                <div className="bg-white border border-[#1A1A1A] p-3 flex flex-col gap-1.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                    OUTPUT TENSOR RESULT
                  </span>
                  <div className="bg-indigo-950 p-2 border border-indigo-900 rounded-sm font-mono text-[10px] text-indigo-200 min-h-[50px] leading-tight select-all">
                    {selectedStep.outputTensor}
                  </div>
                </div>
              </div>

              {/* Dynamic kernel script block */}
              <div className="bg-[#1A1A1A] text-white p-4 border border-[#1A1A1A] flex flex-col gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    OMEGA-KERNEL-ENGINE-DAEMON • PYTHON DIALECT
                  </span>
                  <span className="text-[8px] font-mono text-neutral-500">SIMULATOR_DAEMON_V4</span>
                </div>

                <pre className="bg-black p-3 font-mono text-[10.5px] text-emerald-400 border border-neutral-800 leading-relaxed overflow-x-auto select-all rounded-sm max-h-[160px] h-[160px]">
                  <code>{selectedStep.codeSnippet}</code>
                </pre>
              </div>

            </div>

            {/* Bottom standard parameters banner */}
            <div className="bg-[#EBE8E3] border-t border-[#1A1A1A] mt-auto p-2 px-4 flex items-center justify-between text-[9px] font-mono text-neutral-500 font-bold uppercase">
              <span>ACTIVE PIPELINE SPEC: OMEGA-PIPELINE-BETA</span>
              <span>SYNCHRONIZATION COHERENT</span>
            </div>

          </div>

        </div>
      ) : (
        <div className="flex flex-col gap-6" id="system-linkage-hierarchy">
          
          {/* Structural Linkage diagram */}
          <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-bold font-serif uppercase text-neutral-900">
                OMEGA Multi-Agent Core Hierarchy Map
              </h3>
              <p className="text-xs text-neutral-500 font-serif italic mt-0.5">
                Trace how system kernel signals propagate from low-level physics threads up to reactive browser canvases and generative LLM loops.
              </p>
            </div>

            {/* Multi-tier architectural flow visualization */}
            <div className="flex flex-col gap-4 relative">
              
              {/* Tier 1: Hardware & Substrate Core */}
              <div className="border border-[#1A1A1A] bg-neutral-50 p-4 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] relative z-10">
                <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 pb-1.5 mb-2.5">
                  <span className="text-[9px] font-mono font-bold text-neutral-500 tracking-wider uppercase">
                    TIER 01 • LOW-LEVEL SIMULATION SUBSTRATE
                  </span>
                  <span className="bg-neutral-800 text-white font-mono text-[8px] font-bold px-1.5 py-0.5">KERNEL</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white border border-[#1A1A1A]/40 p-3 flex flex-col gap-1 font-mono">
                    <span className="text-[10px] font-bold text-rose-700 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      PHYSICS BOUNDARY
                    </span>
                    <p className="text-[9px] text-neutral-500 font-sans leading-tight">
                      Enforces Runge-Kutta integrations, Navier-Stokes wind fluid dynamics, and molecular scatter limits.
                    </p>
                  </div>
                  <div className="bg-white border border-[#1A1A1A]/40 p-3 flex flex-col gap-1 font-mono">
                    <span className="text-[10px] font-bold text-cyan-700 flex items-center gap-1">
                      <Cpu className="w-3 h-3" />
                      STONED QU-SUBSTRATE
                    </span>
                    <p className="text-[9px] text-neutral-500 font-sans leading-tight">
                      Drives the hexadecimal node register, simulating multi-qubit error thresholds and quantum gate dephasing.
                    </p>
                  </div>
                  <div className="bg-white border border-[#1A1A1A]/40 p-3 flex flex-col gap-1 font-mono">
                    <span className="text-[10px] font-bold text-neutral-800 flex items-center gap-1">
                      <Server className="w-3 h-3" />
                      EXPRESS INTEGRATION
                    </span>
                    <p className="text-[9px] text-neutral-500 font-sans leading-tight">
                      Coordinates Node.js/Vite hosting processes. Binds to port 3000 to serve static files and proxy prompt logs securely.
                    </p>
                  </div>
                </div>
              </div>

              {/* Connector line */}
              <div className="h-6 w-0.5 bg-neutral-400 mx-auto -my-1 border-dashed" />

              {/* Tier 2: Bridge/Python Logic Script Layers */}
              <div className="border border-[#1A1A1A] bg-indigo-50/40 p-4 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] relative z-10">
                <div className="flex justify-between items-center border-b border-indigo-200 pb-1.5 mb-2.5">
                  <span className="text-[9px] font-mono font-bold text-indigo-600 tracking-wider uppercase">
                    TIER 02 • BRIDGE / PYTHON ACTUATOR MODULES
                  </span>
                  <span className="bg-indigo-600 text-white font-mono text-[8px] font-bold px-1.5 py-0.5">APP.PY & HARNESS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-[#1A1A1A]/40 p-3 flex flex-col gap-1 font-mono">
                    <span className="text-[10.5px] font-bold text-indigo-950 flex items-center gap-1">
                      <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                      python-kernel-daemon (app.py)
                    </span>
                    <p className="text-[9.5px] text-neutral-600 font-sans leading-tight">
                      Loads deep math modules, maps H&E stain metrics, processes gene expression vectors, and provides structural API endpoints.
                    </p>
                  </div>

                  <div className="bg-white border border-[#1A1A1A]/40 p-3 flex flex-col gap-1 font-mono">
                    <span className="text-[10.5px] font-bold text-emerald-950 flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                      ACTUATOR CHAT CONTROL HARNESS
                    </span>
                    <p className="text-[9.5px] text-neutral-600 font-sans leading-tight">
                      Translates free-form textual queries into highly structured mathematical parameters and loads them directly into core memory buffers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Connector line */}
              <div className="h-6 w-0.5 bg-neutral-400 mx-auto -my-1 border-dashed" />

              {/* Tier 3: Browser Canvas Rendering & Visual Interfaces */}
              <div className="border border-[#1A1A1A] bg-emerald-50/40 p-4 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] relative z-10">
                <div className="flex justify-between items-center border-b border-emerald-200 pb-1.5 mb-2.5">
                  <span className="text-[9px] font-mono font-bold text-emerald-700 tracking-wider uppercase">
                    TIER 03 • BROWSER RUNTIME LAYER (REACT FRONT-END)
                  </span>
                  <span className="bg-emerald-600 text-white font-mono text-[8px] font-bold px-1.5 py-0.5">RENDER</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white border border-[#1A1A1A]/40 p-3 flex flex-col gap-1 font-mono">
                    <span className="text-[10px] font-bold text-neutral-800 flex items-center gap-1">
                      <Map className="w-3 h-3 text-emerald-600" />
                      SPATIAL CANVAS
                    </span>
                    <p className="text-[9px] text-neutral-500 font-sans leading-tight">
                      Renders fluid/carbon/agent vector fields. Utilizes fluid ResizeObserver hooks to adjust layout coordinates perfectly on any resolution.
                    </p>
                  </div>

                  <div className="bg-white border border-[#1A1A1A]/40 p-3 flex flex-col gap-1 font-mono">
                    <span className="text-[10px] font-bold text-neutral-800 flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-indigo-600" />
                      COUNTERFACTUAL SWEEPS
                    </span>
                    <p className="text-[9px] text-neutral-500 font-sans leading-tight">
                      Translates sliders into immediate visual updates. Simulates hypothetical outcomes without corrupting active world parameters.
                    </p>
                  </div>

                  <div className="bg-white border border-[#1A1A1A]/40 p-3 flex flex-col gap-1 font-mono">
                    <span className="text-[10px] font-bold text-neutral-800 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-amber-600" />
                      SOP CHEAT SHEET ENGINE
                    </span>
                    <p className="text-[9px] text-neutral-500 font-sans leading-tight">
                      Presents regulatory standards (WMO, Basel, FDA) and loads direct physical blueprint scripts to automate tests tab-by-tab.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Theoretical paradigm explainer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[3.5px_3.5px_0px_0px_rgba(26,26,26,1)]">
              <h4 className="text-xs font-mono font-bold uppercase text-neutral-800 tracking-wider mb-2">
                THE DOUBLE-LOOP LEARNING MECHANISM
              </h4>
              <p className="text-xs text-neutral-600 font-serif leading-relaxed">
                Traditional digital twins simply display raw incoming observations. OMEGA differentiates itself by maintaining an **Active Hypothesis Workspace**. When incoming reality diverges from simulated predictions by more than **2.4% (L2 norm error)**, the dual-pathway debate proposer (Mistral vs Phi3) automatically recalculates underlying causal weights to force reality-model convergence.
              </p>
            </div>

            <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[3.5px_3.5px_0px_0px_rgba(26,26,26,1)]">
              <h4 className="text-xs font-mono font-bold uppercase text-neutral-800 tracking-wider mb-2">
                STRICT TEMPORAL ISOLATION
              </h4>
              <p className="text-xs text-neutral-600 font-serif leading-relaxed">
                By utilizing **Counterfactual Projections**, planners can test heavy environmental and economic shocks (e.g. extreme climate changes or interest rates shifts) on the active spatial canvas safely. This preserves active telemetry indexes, storing the outcomes in local browser storage memory so they can be re-analyzed later inside the Harness Console.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
