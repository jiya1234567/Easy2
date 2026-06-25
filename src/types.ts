/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PolicyCategory = 'environment' | 'infrastructure' | 'energy' | 'transport' | 'health';

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  role: 'citizen' | 'expert' | 'planner';
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'policy' | 'resource' | 'population' | 'hazard' | 'boundary';
  x: number;
  y: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: string; // e.g., "Blocks", "Influences", "Near", "Depletes"
}

export interface SpatialGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface CounterfactualScenario {
  parameterName: string;
  originalValue: string;
  alternativeValue: string;
  outcome: string;
}

export interface SimulationData {
  predictions: string[];
  spatialGraph: SpatialGraph;
  citizenImpact: {
    approval: number;
    economicGrowth: number;
    environmentalIndex: number;
  };
  counterfactuals: CounterfactualScenario[];
}

export interface PolicyProposal {
  id: string;
  title: string;
  description: string;
  category: PolicyCategory;
  creator: string;
  coordinates: { x: number; y: number; z: number };
  status: 'active' | 'proposed' | 'testing';
  votes: { up: number; down: number; neutral: number };
  comments: Comment[];
  physicalParams: {
    intensity: number; // 0 - 100
    radius: number;     // 5 - 50 meters
    cost: number;       // millions USD
    duration: number;   // months
  };
  simulationData: SimulationData | null;
}

export interface WorldState {
  windVector: { x: number; y: number };
  diffusionRate: number;
  gravityFactor: number;
  heatFactor: number;
  waterLevel: number;
  counterfactualMode: boolean;
}

export interface TemporalEvent {
  id: string;
  time: number; // frame count or timestamp
  objectId: string;
  action: 'appeared' | 'moved' | 'accelerated' | 'interacted';
  details: string;
}

export interface SpatialObject {
  id: string;
  type: 'policy_source' | 'pollutant' | 'agent' | 'resource' | 'barrier';
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number; // remaining life frames
  label: string;
}

export interface Experiment {
  id: string;
  name: string;
  strength: number; // e.g., variable input
  score: number;    // output metric
  outcome: string;
  status: 'queued' | 'running' | 'completed';
}
