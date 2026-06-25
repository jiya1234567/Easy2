/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the server-side Gemini client with recommended telemetry headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const app = express();
app.use(express.json());

// In-memory store for Policy Proposals and Feedback
// Seeding with 3 rich, spatially interesting, and scientifically rigorous policies
let policies = [
  {
    id: "policy-1",
    title: "Sector Delta Blue Tidal Sluice Grid",
    description: "Deploy a matrix of multi-chamber tidal barriers at coordinate (25, 42, 0) to capture kinetic ocean energy, regulate fluid velocity, and mitigate coastal surge erosion.",
    category: "energy",
    creator: "Lead Hydroplanner",
    coordinates: { x: 25, y: 42, z: 0 },
    status: "active",
    votes: { up: 42, down: 8, neutral: 15 },
    comments: [
      { id: "c1", author: "Dr. Elena Vance", text: "Excellent placement. The fluid flow calculations match natural estuary boundaries.", timestamp: "2026-06-23T12:00:00Z", role: "expert" },
      { id: "c2", author: "Resident 409", text: "Will this disrupt the local fishing corridors? Coordinates overlap slightly.", timestamp: "2026-06-23T14:30:00Z", role: "citizen" }
    ],
    physicalParams: {
      intensity: 75,
      radius: 30,
      cost: 120,
      duration: 36
    },
    simulationData: {
      predictions: [
        "Kinetic energy capture peaks at 420MW during high tide cycles.",
        "Fluid boundary velocity is deflected eastward by 18%, reducing sediment drift.",
        "Estuary salinity levels expected to stabilize within a 2.1% variance band.",
        "Localized marine shear stress drops, promoting marine flora expansion."
      ],
      spatialGraph: {
        nodes: [
          { id: "p1", label: "Tidal Sluice Grid", type: "policy", x: 25, y: 42 },
          { id: "r1", label: "Estuary Kinetic Channel", type: "resource", x: 30, y: 48 },
          { id: "h1", label: "Coastal Erosion Surge", type: "hazard", x: 20, y: 35 },
          { id: "b1", label: "Marine Conservation Area", type: "boundary", x: 10, y: 50 }
        ],
        edges: [
          { source: "p1", target: "r1", relation: "harnesses" },
          { source: "p1", target: "h1", relation: "blocks" },
          { source: "p1", target: "b1", relation: "protects" },
          { source: "r1", target: "b1", relation: "influences" }
        ]
      },
      citizenImpact: {
        approval: 82,
        economicGrowth: 6.8,
        environmentalIndex: 89
      },
      counterfactuals: [
        { parameterName: "Remove Fluid Friction Factor", originalValue: "Viscous flow under 0.08 drag", alternativeValue: "Superfluid frictionless boundary", outcome: "Wave height increases exponentially, overtopping the structure and flooding Sector Gamma." },
        { parameterName: "Shift Tidal Source Westward", originalValue: "East-North-East primary flow", alternativeValue: "Strict Westward drift", outcome: "Energy absorption rate drops by 64% as turbine angles misalign with primary velocity vector." }
      ]
    }
  },
  {
    id: "policy-2",
    title: "Sovereign Core Carbon Absorption Canopy",
    description: "Establish a high-density, bio-engineered synthetic forestry block at coordinate (68, 15, 10) that utilizes catalytic canopies to actively diffuse and bind airborne atmospheric carbon.",
    category: "environment",
    creator: "Ecological Architect",
    coordinates: { x: 68, y: 15, z: 10 },
    status: "proposed",
    votes: { up: 89, down: 4, neutral: 12 },
    comments: [
      { id: "c3", author: "Sylvia Thorne", text: "Highly needed. The atmospheric sensors in Sector C have been showing extreme carbon spikes.", timestamp: "2026-06-23T11:15:00Z", role: "expert" },
      { id: "c4", author: "Urban Planner K.", text: "Combining heat convection mapping with this plant will yield twice the absorption coefficient.", timestamp: "2026-06-23T15:20:00Z", role: "planner" }
    ],
    physicalParams: {
      intensity: 85,
      radius: 25,
      cost: 45,
      duration: 12
    },
    simulationData: {
      predictions: [
        "Particulate concentration within 25m radius falls by 68% in 48 hours.",
        "Synthetic canopies sequester up to 14.5 tons of carbon molecules daily.",
        "Local convective updrafts cooling effect measured at -1.4 degrees Celsius.",
        "Oxygen enrichment creates a stable, high-buoyancy microclimate."
      ],
      spatialGraph: {
        nodes: [
          { id: "p2", label: "Absorption Canopy", type: "policy", x: 68, y: 15 },
          { id: "r2", label: "Ambient Air Quality", type: "resource", x: 60, y: 20 },
          { id: "h2", label: "Smokestack Emission Plume", type: "hazard", x: 75, y: 10 },
          { id: "b2", label: "Residential Zone Limit", type: "boundary", x: 55, y: 25 }
        ],
        edges: [
          { source: "p2", target: "r2", relation: "purifies" },
          { source: "p2", target: "h2", relation: "neutralizes" },
          { source: "p2", target: "b2", relation: "buffers" },
          { source: "h2", target: "b2", relation: "threatens" }
        ]
      },
      citizenImpact: {
        approval: 94,
        economicGrowth: 3.2,
        environmentalIndex: 96
      },
      counterfactuals: [
        { parameterName: "Double Regional Wind Velocity", originalValue: "4.2 m/s Northward breeze", alternativeValue: "8.4 m/s Gale force", outcome: "Carbon plume is scattered before absorption can occur, reducing canopy efficiency to 22%." },
        { parameterName: "Activate Thermal Inversion", originalValue: "Linear thermal gradient", alternativeValue: "Cold air trapped under warm ceiling", outcome: "Concentrated carbon is forced down into the residential zone, requiring immediate catalyst deployment." }
      ]
    }
  },
  {
    id: "policy-3",
    title: "District 7 Kinetic Hyperloop Transverse",
    description: "Erect a high-speed vacuum-tube transit loop at coordinate (40, 55, 5) connecting the manufacturing hub with Sector G residential units to alleviate thermal friction and heavy cargo mass transfer.",
    category: "transport",
    creator: "Transit Engineer",
    coordinates: { x: 40, y: 55, z: 5 },
    status: "proposed",
    votes: { up: 55, down: 28, neutral: 34 },
    comments: [
      { id: "c5", author: "Marcus Aurel", text: "The momentum vector runs close to the geological fault line. Did you calculate seismic tolerances?", timestamp: "2026-06-23T09:45:00Z", role: "expert" },
      { id: "c6", author: "Commuter X", text: "If it cuts my travel time to 4 minutes, count me in!", timestamp: "2026-06-23T16:10:00Z", role: "citizen" }
    ],
    physicalParams: {
      intensity: 60,
      radius: 45,
      cost: 280,
      duration: 48
    },
    simulationData: {
      predictions: [
        "Reduces commercial road friction wear by 82% over 5 years.",
        "Shifts 24,000 tons of freight daily off heavy highways.",
        "Seismic compression joints dissipate up to 4.5 Richter force vector components.",
        "Direct convective heating along the line increases land temperature by 0.3°C."
      ],
      spatialGraph: {
        nodes: [
          { id: "p3", label: "Kinetic Hyperloop", type: "policy", x: 40, y: 55 },
          { id: "r3", label: "Regional Steel/Iron Reserve", type: "resource", x: 30, y: 60 },
          { id: "h3", label: "Seismic Fault Line", type: "hazard", x: 45, y: 50 },
          { id: "b3", label: "District 7 Grid Border", type: "boundary", x: 50, y: 58 }
        ],
        edges: [
          { source: "p3", target: "r3", relation: "depletes" },
          { source: "p3", target: "h3", relation: "spans_near" },
          { source: "p3", target: "b3", relation: "bridges" },
          { source: "h3", target: "b3", relation: "endangers" }
        ]
      },
      citizenImpact: {
        approval: 66,
        economicGrowth: 9.4,
        environmentalIndex: 58
      },
      counterfactuals: [
        { parameterName: "Simulate Seismic Incident (Mag 6.2)", originalValue: "Dampened friction joints", alternativeValue: "Active 6.2 Richter shift", outcome: "Vacuum tube sustains structural breach; magnetic brakes auto-trigger; safety valves capture kinetic mass safely." },
        { parameterName: "Replace High-Friction Steel Rails", originalValue: "Standard composite track", alternativeValue: "Zero-contact magnetic levitation", outcome: "Travel time drops to 1.8 minutes; thermal friction drops to zero; construction costs surge by $140M." }
      ]
    }
  }
];

// Helper endpoint: health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// GET policies
app.get("/api/policies", (req, res) => {
  res.json(policies);
});

// POST policies (Create new proposal)
app.post("/api/policies", (req, res) => {
  const { title, description, category, creator, coordinates, physicalParams } = req.body;
  
  if (!title || !description || !category) {
    return res.status(400).json({ error: "Missing required fields: title, description, category" });
  }

  const newPolicy = {
    id: `policy-${Date.now()}`,
    title,
    description,
    category: category as any,
    creator: creator || "Anonymous Planner",
    coordinates: {
      x: Number(coordinates?.x ?? Math.floor(Math.random() * 80 + 10)),
      y: Number(coordinates?.y ?? Math.floor(Math.random() * 80 + 10)),
      z: Number(coordinates?.z ?? Math.floor(Math.random() * 20))
    },
    status: "proposed" as const,
    votes: { up: 0, down: 0, neutral: 0 },
    comments: [],
    physicalParams: {
      intensity: Number(physicalParams?.intensity ?? 50),
      radius: Number(physicalParams?.radius ?? 20),
      cost: Number(physicalParams?.cost ?? 50),
      duration: Number(physicalParams?.duration ?? 12)
    },
    simulationData: null
  };

  policies.push(newPolicy);
  res.status(210).json(newPolicy);
});

// POST vote on a policy
app.post("/api/policies/:id/vote", (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // 'up', 'down', 'neutral'

  const policy = policies.find(p => p.id === id);
  if (!policy) {
    return res.status(404).json({ error: "Policy not found" });
  }

  if (type === 'up') {
    policy.votes.up += 1;
  } else if (type === 'down') {
    policy.votes.down += 1;
  } else {
    policy.votes.neutral += 1;
  }

  res.json(policy);
});

// POST comment on a policy
app.post("/api/policies/:id/comment", (req, res) => {
  const { id } = req.params;
  const { author, text, role } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Comment text is required" });
  }

  const policy = policies.find(p => p.id === id);
  if (!policy) {
    return res.status(404).json({ error: "Policy not found" });
  }

  const newComment = {
    id: `c-${Date.now()}`,
    author: author || "Anonymous User",
    text,
    timestamp: new Date().toISOString(),
    role: (role as any) || "citizen"
  };

  policy.comments.push(newComment);
  res.json(policy);
});

// POST simulate policy (Uses Gemini server-side)
app.post("/api/policies/:id/simulate", async (req, res) => {
  const { id } = req.params;
  const { customWorldState } = req.body; // Optional custom physics/world states from counterfactual pane

  const policy = policies.find(p => p.id === id);
  if (!policy) {
    return res.status(404).json({ error: "Policy not found" });
  }

  // Fallback generation if Gemini API key is not active, or for graceful failover
  const fallbackSimulation = {
    predictions: [
      `Localized physical reaction triggered at coordinate (${policy.coordinates.x}, ${policy.coordinates.y}, ${policy.coordinates.z}).`,
      `Diffusion coefficient limits boundaries to a ${policy.physicalParams.radius} meter radius.`,
      "Thermal radiation shifts regional temperature gradient by 0.5°C.",
      "Energy extraction stabilizes grid distribution channels."
    ],
    spatialGraph: {
      nodes: [
        { id: "policy-node", label: policy.title, type: "policy" as const, x: policy.coordinates.x, y: policy.coordinates.y },
        { id: "res-node", label: "Local Infrastructure Res", type: "resource" as const, x: Math.min(policy.coordinates.x + 10, 90), y: Math.max(policy.coordinates.y - 10, 10) },
        { id: "haz-node", label: "Ambient Environmental Risk", type: "hazard" as const, x: Math.max(policy.coordinates.x - 15, 10), y: Math.min(policy.coordinates.y + 15, 90) },
        { 
          id: "pop-node", 
          label: "Sector Citizen Core", 
          type: "population" as const, 
          x: Math.abs(policy.coordinates.x - 50) < 12 ? (policy.coordinates.x > 50 ? 32 : 68) : 50, 
          y: Math.abs(policy.coordinates.y - 50) < 12 ? (policy.coordinates.y > 50 ? 28 : 72) : 55 
        }
      ],
      edges: [
        { source: "policy-node", target: "res-node", relation: "anchors" },
        { source: "policy-node", target: "haz-node", relation: "dampens" },
        { source: "policy-node", target: "pop-node", relation: "influences" }
      ]
    },
    citizenImpact: {
      approval: Math.floor(Math.random() * 30 + 60), // 60-90
      economicGrowth: Number((Math.random() * 8 + 1).toFixed(1)), // 1-9%
      environmentalIndex: Math.floor(Math.random() * 40 + 50) // 50-90
    },
    counterfactuals: [
      {
        parameterName: "Double Regional Heat Factor",
        originalValue: "Normal temperature equilibrium",
        alternativeValue: "High Thermal Influx (+4.0°C)",
        outcome: `Molecular expansion reduces sequestration density. Local efficiency drops by 18%, causing particle expansion.`
      },
      {
        parameterName: "Invert Local Fluid Vectors",
        originalValue: "Current directional wind vector",
        alternativeValue: "180-degree wind direction reversal",
        outcome: `Particulate boundary plume is driven directly into coordinate (50, 50), triggering secondary filtration alerts.`
      }
    ]
  };

  // If GEMINI_API_KEY is not defined, return fallback simulation immediately
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY" || process.env.GEMINI_API_KEY === "") {
    policy.simulationData = fallbackSimulation;
    return res.json(policy);
  }

  try {
    const systemPrompt = `You are the Spatial AI World Lab simulation engine for a digital twin policy laboratory called 'Democratic Lab'.
Your task is to model, calculate, and reason through the physical, spatial, structural, and social impacts of a user-submitted policy proposal.
You must return your output strictly in JSON format.
The JSON must adhere precisely to this schema structure:
{
  "predictions": string[], // 4 specific, scientifically rigorous physical/spatial predictions about coordinates, wind, heat, or diffusion
  "spatialGraph": {
    "nodes": [
      { "id": string, "label": string, "type": "policy" | "resource" | "population" | "hazard" | "boundary", "x": number, "y": number }
    ],
    "edges": [
      { "source": string, "target": string, "relation": string }
    ]
  },
  "citizenImpact": {
    "approval": number, // 0 to 100
    "economicGrowth": number, // e.g., 4.2 (percentage)
    "environmentalIndex": number // 0 to 100
  },
  "counterfactuals": [
    { "parameterName": string, "originalValue": string, "alternativeValue": string, "outcome": string } // 2 counterfactual test models
  ]
}

Make all details highly realistic, referencing the coordinates, physical parameters, category, and physics constraints. Give realistic numbers, and make the spatial relationships in the graph deeply relevant.`;

    const userPrompt = `Simulate the following policy proposal under current spatial constraints:
Title: ${policy.title}
Category: ${policy.category}
Description: ${policy.description}
Coordinates: X=${policy.coordinates.x}, Y=${policy.coordinates.y}, Z=${policy.coordinates.z}
Physical Parameters: Intensity=${policy.physicalParams.intensity}%, Radius=${policy.physicalParams.radius}m, Cost=$${policy.physicalParams.cost}M, Duration=${policy.physicalParams.duration} months.
${customWorldState ? `Active Physics Modifications: Wind Vector=(${customWorldState.windVector?.x}, ${customWorldState.windVector?.y}), Diffusion Rate=${customWorldState.diffusionRate}, Gravity Factor=${customWorldState.gravityFactor}, Heat Factor=${customWorldState.heatFactor}, Water Level=${customWorldState.waterLevel}` : ""}

Ensure the coordinates play a heavy part. Place nodes of the spatial graph nearby the coordinate (${policy.coordinates.x}, ${policy.coordinates.y}).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            spatialGraph: {
              type: Type.OBJECT,
              properties: {
                nodes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      label: { type: Type.STRING },
                      type: { type: Type.STRING, description: "Must be one of: policy, resource, population, hazard, boundary" },
                      x: { type: Type.NUMBER },
                      y: { type: Type.NUMBER }
                    },
                    required: ["id", "label", "type", "x", "y"]
                  }
                },
                edges: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      source: { type: Type.STRING },
                      target: { type: Type.STRING },
                      relation: { type: Type.STRING }
                    },
                    required: ["source", "target", "relation"]
                  }
                }
              },
              required: ["nodes", "edges"]
            },
            citizenImpact: {
              type: Type.OBJECT,
              properties: {
                approval: { type: Type.INTEGER },
                economicGrowth: { type: Type.NUMBER },
                environmentalIndex: { type: Type.INTEGER }
              },
              required: ["approval", "economicGrowth", "environmentalIndex"]
            },
            counterfactuals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  parameterName: { type: Type.STRING },
                  originalValue: { type: Type.STRING },
                  alternativeValue: { type: Type.STRING },
                  outcome: { type: Type.STRING }
                },
                required: ["parameterName", "originalValue", "alternativeValue", "outcome"]
              }
            }
          },
          required: ["predictions", "spatialGraph", "citizenImpact", "counterfactuals"]
        }
      }
    });

    const resultText = response.text;
    if (resultText) {
      const parsed = JSON.parse(resultText.trim());
      policy.simulationData = parsed;
    } else {
      policy.simulationData = fallbackSimulation;
    }
    
    res.json(policy);
  } catch (error) {
    console.error("Gemini simulation failed, using fallback metrics:", error);
    policy.simulationData = fallbackSimulation;
    res.json(policy);
  }
});


// POST run harness loop (integrates with mistral_client / harness principles)
app.post("/api/harness/run", async (req, res) => {
  const { agent, query, primaryModel, challengerModel, useDebate, worldState } = req.body;

  if (!agent || !query) {
    return res.status(400).json({ error: "Missing required fields: agent, query" });
  }

  const activeWind = worldState?.windVector || { x: 1, y: 0 };
  const activeDiff = worldState?.diffusionRate ?? 1.0;
  const activeHeat = worldState?.heatFactor ?? 1.0;
  const activeGravity = worldState?.gravityFactor ?? 1.0;
  const activeWater = worldState?.waterLevel ?? 50;

  const sensorSummary = `Wind=(${activeWind.x.toFixed(1)}, ${activeWind.y.toFixed(1)}), Diffusion=${activeDiff.toFixed(2)}x, Heat=${activeHeat.toFixed(2)}x, Gravity=${activeGravity.toFixed(2)}x, WaterLevel=${activeWater.toFixed(1)}%`;

  // Fallback procedural debate logic if no Gemini API Key is available
  const getFallbackDebate = () => {
    let primary = "";
    let challenger = "";
    let arbiter = "";

    if (agent === "democratic") {
      primary = `[${primaryModel.toUpperCase()} - PRIMARY PROPOSAL]
Recommended action: Deploy dynamic fluid friction compensators to counter heat velocity dissipation at ${activeHeat}x thermal factor.
By introducing a 0.08 friction coefficient at bounds (40, 55), we can stabilize wave deflection vectors. This secures local resident safety and satisfies the approval index requirements.`;
      challenger = `[${challengerModel.toUpperCase()} - CHALLENGER OPPOSITION]
Primary proposal fails to account for current wind vectors (${activeWind.x}, ${activeWind.y}) and water level of ${activeWater}%. Friction removal would cause high-velocity surge displacement, causing severe erosion. Direct fluid-friction suppression should only be activated with active magnetic dampeners.`;
      arbiter = `[ARBITER DECISION - SYNTHESIS]
We synthesize both pathways: Approve the mechanical boundary buffers but implement a baseline fluid friction of 0.04 (rather than 0.08) to mitigate the wind velocity advection vectors. We save $40M by eliminating unnecessary concrete structural reinforcement.`;
    } else if (agent === "colony") {
      primary = `[${primaryModel.toUpperCase()} - PRIMARY PROPOSAL]
Isolate Core Node #12 immediately to protect parity registers from localized cryo-thermal drift. Force social compliance score calibration down to 15% during quarantine to maintain strict consensus stability.`;
      challenger = `[${challengerModel.toUpperCase()} - CHALLENGER OPPOSITION]
Quarantining Node #12 entirely triggers cascade routing faults across the 8x8 matrix. A distance-21 surface code sweep on Row 1 should be triggered instead to restore register parity without service disruption.`;
      arbiter = `[ARBITER DECISION - SYNTHESIS]
Synthesized approach: Deny full quarantine. Execute local parity sweeps on Node #12 during active operation. This keeps overall compliance above 97.2% and avoids network routing bottlenecks.`;
    } else if (agent === "radiant") {
      primary = `[${primaryModel.toUpperCase()} - PRIMARY PROPOSAL]
Increase magnetic field tension to 0.85 Tesla across Sector C. This binds particle velocity profiles and locks high-energy radiation within stable coordinate bounds under ${activeHeat}x heat.`;
      challenger = `[${challengerModel.toUpperCase()} - CHALLENGER OPPOSITION]
Applying high tension will spike particle collision thresholds, generating substantial convective thermal feedback. We must deploy an active cryo-thermal boost sweep at 6 mK to safeguard the field boundary from rupture.`;
      arbiter = `[ARBITER DECISION - SYNTHESIS]
Synthesized action: Set magnetic field vector to a safer 0.65 Tesla baseline, coupled with a temporary 6-second cryogenic boost loop. Stabilizes thermal drift without feedback loop hazards.`;
    } else if (agent === "aromea") {
      primary = `[${primaryModel.toUpperCase()} - PRIMARY PROPOSAL]
Release custom aerosol tracer mist with a volatility rating of 0.65, allowing eastward wind velocity to disperse active particles over a 25m radius.`;
      challenger = `[${challengerModel.toUpperCase()} - CHALLENGER OPPOSITION]
Under a diffusion rate of ${activeDiff}x, the aerosol plume will spread beyond safe limits before complete particle decay. We must substitute the aerosol compound with a synthetic ozone shield to accelerate decay to 0.08.`;
      arbiter = `[ARBITER DECISION - SYNTHESIS]
Synthesized solution: Use Eucalyptus Biome Mist but adjust decay rate to 0.06 to ensure complete atmospheric dispersal before crossing residential boundaries.`;
    } else { // stoned or general
      primary = `[${primaryModel.toUpperCase()} - PRIMARY PROPOSAL]
Inject a high-frequency bit-flip fault at silicon Core Gate #42 to stress-test hardware parity code limits under a ${activeHeat}x heat index.`;
      challenger = `[${challengerModel.toUpperCase()} - CHALLENGER OPPOSITION]
Thermal fault injection on an active calibration line risks scrambling the register hex values, lowering gate fidelity below 92.0%. Injection must be isolated to Row 3 cells.`;
      arbiter = `[ARBITER DECISION - SYNTHESIS]
Synthesized decision: Inject bit-flip thermal faults solely on isolated cells of Row 3 under cryo supervision. Instantly queue distance-21 surface code alignment sweeps to restore full gate fidelity to 99.92% within 3 cycles.`;
    }

    return { primaryReasoning: primary, challengerReasoning: challenger, arbiterDecision: arbiter };
  };

  // Check if Gemini API key is valid
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY" || process.env.GEMINI_API_KEY === "") {
    const fallback = getFallbackDebate();
    return res.json({
      agent,
      query,
      primaryModel,
      challengerModel,
      useDebate,
      sensorSummary,
      ...fallback,
      timestamp: new Date().toISOString()
    });
  }

  try {
    const systemInstruction = `You are the OMEGA-CORE Dual-Pathway Reasoning Engine.
You simulate a debate between two advanced LLMs:
1. Primary Proposer (acting as '${primaryModel}') which proposes a physical/spatial policy action to address the user's query under current sensor limits.
2. Challenger (acting as '${challengerModel}') which challenges the proposal, points out logical flaws, uncalculated risks, or physics mismatches.
3. Arbiter (representing the synthesized theory engine) which reviews both paths, picks the strongest parameters, and makes a final decision.

Current Sensor telemetry: ${sensorSummary}.
Target Agent Module: ${agent}.

You MUST return your response strictly as a JSON object with this exact structure:
{
  "primaryReasoning": "Proposals and arguments from the Primary model (should speak in character as ${primaryModel})",
  "challengerReasoning": "Challenges and critique from the Challenger model (should speak in character as ${challengerModel})",
  "arbiterDecision": "Final synthesized decision from the Arbiter"
}

Make the debate highly professional, filled with scientific rigor, coordinate-specific calculations, and physical constraints. Ensure the tone is objective and scholarly.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Perform the dual-pathway debate loop for this query: "${query}" under target agent "${agent}". Use current sensor limits: ${sensorSummary}.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryReasoning: { type: Type.STRING },
            challengerReasoning: { type: Type.STRING },
            arbiterDecision: { type: Type.STRING }
          },
          required: ["primaryReasoning", "challengerReasoning", "arbiterDecision"]
        }
      }
    });

    const resultText = response.text;
    if (resultText) {
      const parsed = JSON.parse(resultText.trim());
      res.json({
        agent,
        query,
        primaryModel,
        challengerModel,
        useDebate,
        sensorSummary,
        ...parsed,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error("Gemini harness run failed, using fallback:", error);
    const fallback = getFallbackDebate();
    res.json({
      agent,
      query,
      primaryModel,
      challengerModel,
      useDebate,
      sensorSummary,
      ...fallback,
      timestamp: new Date().toISOString()
    });
  }
});


// POST generate comparison images (proposal to final output) using nano banana (gemini-2.5-flash-image)
app.post("/api/harness/generate-images", async (req, res) => {
  const { proposalText, decisionText, agent, query } = req.body;

  let proposalImage = "";
  let finalImage = "";

  // Helper to generate dynamic, high-fidelity schematic SVG blueprints
  // to act as highly styled, visual, responsive fallbacks when no key is set or generation fails
  const generateProceduralBlueprint = (text: string, title: string, isFinal: boolean) => {
    const gridColor = isFinal ? "rgba(16, 185, 129, 0.12)" : "rgba(99, 102, 241, 0.12)";
    const strokeColor = isFinal ? "#10B981" : "#6366F1";
    const accentColor = isFinal ? "#34D399" : "#818CF8";
    const bgGradientStart = isFinal ? "#061F15" : "#0F0F23";
    const bgGradientEnd = "#07070B";

    // Extract some keywords for custom visual features
    const textLower = text.toLowerCase();
    const hasHeat = textLower.includes("heat") || textLower.includes("thermal") || textLower.includes("temperature");
    const hasWind = textLower.includes("wind") || textLower.includes("velocity") || textLower.includes("drift") || textLower.includes("atmospheric");
    const hasFluid = textLower.includes("fluid") || textLower.includes("tidal") || textLower.includes("water") || textLower.includes("coastal") || textLower.includes("estuary");
    const hasQuantum = textLower.includes("gate") || textLower.includes("quantum") || textLower.includes("parity") || textLower.includes("surface code") || textLower.includes("qubit");
    const hasAerosol = textLower.includes("aerosol") || textLower.includes("tracer") || textLower.includes("particle") || textLower.includes("mist") || textLower.includes("carbon");

    let overlayGraphics = "";
    if (hasWind || hasFluid) {
      overlayGraphics = `
        <path d="M 50 150 Q 250 100 450 150 T 850 150" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="5,5" opacity="0.6" />
        <path d="M 50 250 Q 250 200 450 250 T 850 250" fill="none" stroke="${strokeColor}" stroke-width="1.5" stroke-dasharray="8,4" opacity="0.4" />
        <path d="M 50 350 Q 250 300 450 350 T 850 350" fill="none" stroke="${accentColor}" stroke-width="3" opacity="0.7" />
        <circle cx="450" cy="250" r="120" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.2" />
        <circle cx="450" cy="250" r="160" fill="none" stroke="${accentColor}" stroke-width="1" stroke-dasharray="10,5" opacity="0.15" />
      `;
    } else if (hasQuantum || textLower.includes("node") || textLower.includes("matrix")) {
      overlayGraphics = `
        <g opacity="0.4">
          <line x1="100" y1="100" x2="800" y2="100" stroke="${strokeColor}" stroke-width="1" />
          <line x1="100" y1="250" x2="800" y2="250" stroke="${strokeColor}" stroke-width="1" />
          <line x1="100" y1="400" x2="800" y2="400" stroke="${strokeColor}" stroke-width="1" />
          <line x1="200" y1="50" x2="200" y2="450" stroke="${strokeColor}" stroke-width="1" />
          <line x1="450" y1="50" x2="450" y2="450" stroke="${strokeColor}" stroke-width="1" />
          <line x1="700" y1="50" x2="700" y2="450" stroke="${strokeColor}" stroke-width="1" />
        </g>
        <circle cx="450" cy="250" r="80" fill="none" stroke="${accentColor}" stroke-width="2" />
        <circle cx="450" cy="250" r="15" fill="${accentColor}" opacity="0.8" />
        <circle cx="200" cy="100" r="8" fill="${strokeColor}" />
        <circle cx="700" cy="400" r="8" fill="${strokeColor}" />
        <path d="M 200 100 L 450 250 L 700 400" fill="none" stroke="${accentColor}" stroke-width="2" stroke-dasharray="4,4" />
      `;
    } else if (hasHeat || hasAerosol) {
      overlayGraphics = `
        <defs>
          <radialGradient id="heatGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.35" />
            <stop offset="100%" stop-color="${bgGradientStart}" stop-opacity="0" />
          </radialGradient>
        </defs>
        <circle cx="450" cy="250" r="220" fill="url(#heatGlow)" />
        <g opacity="0.7">
          <circle cx="300" cy="200" r="4" fill="${strokeColor}" />
          <circle cx="350" cy="150" r="6" fill="${strokeColor}" />
          <circle cx="500" cy="220" r="5" fill="${accentColor}" />
          <circle cx="400" cy="300" r="7" fill="${accentColor}" />
          <circle cx="550" cy="280" r="4" fill="${strokeColor}" />
          <circle cx="600" cy="180" r="6" fill="${accentColor}" />
        </g>
        <path d="M 300 200 Q 400 250 500 220 T 600 180" fill="none" stroke="${strokeColor}" stroke-width="1.5" />
      `;
    } else {
      overlayGraphics = `
        <polygon points="450,100 650,220 570,400 330,400 250,220" fill="none" stroke="${strokeColor}" stroke-width="1.5" opacity="0.5" />
        <polygon points="450,140 600,230 540,360 360,360 300,230" fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.8" />
        <line x1="450" y1="100" x2="450" y2="400" stroke="${strokeColor}" stroke-width="1" stroke-dasharray="5,5" opacity="0.4" />
        <line x1="250" y1="220" x2="650" y2="220" stroke="${strokeColor}" stroke-width="1" stroke-dasharray="5,5" opacity="0.4" />
      `;
    }

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" width="100%" height="100%" style="background-color: ${bgGradientEnd}; font-family: monospace;">
        <rect width="900" height="500" fill="url(#bgGrad)" />
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${bgGradientStart}" stop-opacity="0.95" />
            <stop offset="100%" stop-color="${bgGradientEnd}" stop-opacity="1" />
          </linearGradient>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="${gridColor}" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="900" height="500" fill="url(#grid)" />

        <!-- Graphics layer -->
        ${overlayGraphics}

        <!-- Outer structure lines -->
        <rect x="15" y="15" width="870" height="470" fill="none" stroke="${strokeColor}" stroke-width="2" opacity="0.6" />
        <line x1="15" y1="45" x2="885" y2="45" stroke="${strokeColor}" stroke-width="1.5" opacity="0.4" />

        <text x="30" y="35" fill="${accentColor}" font-size="11" font-weight="bold" letter-spacing="2">OMEGA CORE WORLD LAB // COGNITIVE RECONSTRUCTION</text>
        <text x="710" y="35" fill="${strokeColor}" font-size="10" font-weight="bold">${isFinal ? "STAGE B: SYNTHESIS" : "STAGE A: PROPOSAL"}</text>
        
        <text x="35" y="455" fill="#777777" font-size="8.5">AGENT MODULE: /${agent.toUpperCase()}</text>
        <text x="35" y="470" fill="#555555" font-size="8.5">SYSTEM CALIBRATION COMPLETED // TEMPORAL PHYSICS SYNC 1.0</text>
        
        <!-- Descriptive Overlay Card -->
        <rect x="230" y="375" width="440" height="75" rx="4" fill="rgba(6, 6, 10, 0.95)" stroke="${strokeColor}" stroke-width="1.2" />
        <text x="250" y="398" fill="#FFFFFF" font-size="10" font-weight="bold">${title.slice(0, 50).toUpperCase()}</text>
        <text x="250" y="416" fill="#999999" font-size="8.5" font-family="sans-serif">${isFinal ? "Grounded parameters committed to physical outcome mesh." : "Initial thesis draft pending opponent debate review."}</text>
        <text x="250" y="432" fill="${accentColor}" font-size="8">${text.replace(/[\r\n]+/g, ' ').slice(0, 80)}...</text>
      </svg>
    `;

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
  };

  const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" && process.env.GEMINI_API_KEY !== "";

  try {
    if (hasGemini) {
      console.log("Generating comparison schematics with gemini-2.5-flash-image...");
      
      const proposalPrompt = `A high-fidelity minimalist scientific blueprint diagram representing a draft technological proposal for a ${agent} agent. Description: ${proposalText.slice(0, 250)}. Deep cosmic dark theme with neon purple accents, technical line-art vector illustration, beautiful layout, clear schematics, objective design style.`;
      
      const finalPrompt = `A high-fidelity minimalist scientific blueprint diagram representing the final synthesized physical outcome of a simulated plan for a ${agent} agent. Description: ${decisionText.slice(0, 250)}. Deep cosmic dark theme with neon emerald-green accents, technical line-art vector illustration, beautiful layout, clear schematics, objective design style.`;

      // 1. Generate Proposal Image
      const proposalPromise = ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: proposalPrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      }).then((resp) => {
        for (const part of resp.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData?.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
        return "";
      }).catch((err) => {
        console.error("Gemini proposal image generation failed:", err);
        return "";
      });

      // 2. Generate Final Image
      const finalPromise = ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: finalPrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      }).then((resp) => {
        for (const part of resp.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData?.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
        return "";
      }).catch((err) => {
        console.error("Gemini final image generation failed:", err);
        return "";
      });

      const [pImg, fImg] = await Promise.all([proposalPromise, finalPromise]);
      proposalImage = pImg;
      finalImage = fImg;
    }
  } catch (error) {
    console.error("Error generating comparison images via Gemini, triggering blueprint generator:", error);
  }

  // Fallbacks if generation returned empty or failed
  if (!proposalImage) {
    proposalImage = generateProceduralBlueprint(proposalText, "PROPOSED MODEL THESIS", false);
  }
  if (!finalImage) {
    finalImage = generateProceduralBlueprint(decisionText, "SYNTHESIZED OUTCOME BLUEPRINT", true);
  }

  res.json({
    proposalImage,
    finalImage
  });
});


// Boot Vite Dev Server middleware or Serve Production Static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Democratic Lab Server] running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
