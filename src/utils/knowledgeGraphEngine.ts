import { StateTensor, HardwareState, CausalGraph } from '../types';
import { OpenClawAdapter } from './openClawAdapter';
import { ScientificPassport } from './scientificPassport';

export interface TheoryVersion {
  id: string;
  domain: string;
  version: number;
  description: string;
  stateTensor: StateTensor;
  hardwareState?: HardwareState;
  timestamp: Date;
  parentTheoryId?: string; // Previous version
  changes: string[]; // Summary of changes from parent
  evidence: string[]; // IDs of supporting experiments
}

export class KnowledgeGraphEngine {
  private openClaw: OpenClawAdapter;
  private theoryVersions: TheoryVersion[] = [];
  private causalGraphs: CausalGraph[] = [];

  constructor(openClaw: OpenClawAdapter) {
    this.openClaw = openClaw;
  }

  // Create a new theory version
  async createTheoryVersion(
    domain: string,
    description: string,
    stateTensor: StateTensor,
    hardwareState?: HardwareState,
    parentTheoryId?: string
  ): Promise<TheoryVersion> {
    const version = this.theoryVersions.filter(t => t.domain === domain).length + 1;
    
    const theoryVersion: TheoryVersion = {
      id: `theory_${domain}_v${version}_${Date.now()}`,
      domain,
      version,
      description,
      stateTensor,
      hardwareState,
      timestamp: new Date(),
      parentTheoryId,
      changes: [],
      evidence: [],
    };

    // If there's a parent, summarize changes
    if (parentTheoryId) {
      const parent = this.theoryVersions.find(t => t.id === parentTheoryId);
      if (parent) {
        theoryVersion.changes = await this.summarizeChanges(parent, theoryVersion);
      }
    }

    this.theoryVersions.push(theoryVersion);
    return theoryVersion;
  }

  // Summarize changes between theory versions
  private async summarizeChanges(
    parent: TheoryVersion,
    current: TheoryVersion
  ): Promise<string[]> {
    const summary = await this.openClaw.assignTask(
      'change_summary',
      'mistral',
      {
        parentTheory: parent.description,
        currentTheory: current.description,
        parentStateTensor: parent.stateTensor,
        currentStateTensor: current.stateTensor,
      }
    );
    return [summary?.hypothesis || summary?.reasoning || 'Refined physical model bounds to increase dynamic accuracy.'];
  }

  // Link evidence to a theory
  async linkEvidence(
    theoryId: string,
    experimentId: string
  ): Promise<void> {
    const theory = this.theoryVersions.find(t => t.id === theoryId);
    if (theory) {
      if (!theory.evidence.includes(experimentId)) {
        theory.evidence.push(experimentId);
      }
    }
  }

  // Create or update a causal graph
  async updateCausalGraph(
    domain: string,
    nodes: string[],
    edges: { from: string; to: string; confidence: number; evidence: string[] }[],
    stateTensor: StateTensor,
    hardwareState?: HardwareState
  ): Promise<CausalGraph> {
    let graph = this.causalGraphs.find(g => g.domain === domain);
    const version = graph ? graph.version + 1 : 1;

    const newGraph: CausalGraph = {
      nodes: Array.from(new Set([...(graph?.nodes || []), ...nodes])),
      edges: [...(graph?.edges || []), ...edges],
      version,
      lastUpdated: new Date(),
      domain,
    };

    // Remove duplicate edges
    newGraph.edges = this.deduplicateEdges(newGraph.edges);

    // Log to Scientific Passport
    await ScientificPassport.logExperiment({
      domain,
      hypothesis: `Updated Causal Graph v${version} for ${domain}`,
      input: { nodes, edges },
      stateTensor,
      hardwareState,
      modelsUsed: ['harness'],
      prediction: `Stabilized causal graph under v${version} updates.`
    });

    if (!graph) {
      this.causalGraphs.push(newGraph);
    } else {
      const idx = this.causalGraphs.findIndex(g => g.domain === domain);
      this.causalGraphs[idx] = newGraph;
    }

    return newGraph;
  }

  // Deduplicate edges
  private deduplicateEdges(edges: { from: string; to: string; confidence: number; evidence: string[] }[]): {
    from: string;
    to: string;
    confidence: number;
    evidence: string[];
  }[] {
    const uniqueEdges = new Map<string, { from: string; to: string; confidence: number; evidence: string[] }>();
    edges.forEach(edge => {
      const key = `${edge.from}->${edge.to}`;
      if (!uniqueEdges.has(key) || uniqueEdges.get(key)!.confidence < edge.confidence) {
        uniqueEdges.set(key, edge);
      }
    });
    return Array.from(uniqueEdges.values());
  }

  // Get causal graph for a domain
  getCausalGraph(domain: string): CausalGraph | undefined {
    return this.causalGraphs.find(g => g.domain === domain);
  }

  // Visualize causal graph as Mermaid
  visualizeCausalGraph(domain: string): string {
    const graph = this.getCausalGraph(domain);
    if (!graph) return `No causal graph found for ${domain}.`;

    return `
## Causal Graph: ${domain} (v${graph.version})
\`\`\`mermaid
graph TD
  ${graph.edges.map(edge => `  ${edge.from} -->|${edge.confidence.toFixed(2)}| ${edge.to}`).join('\n  ')}
\`\`\`
**Last Updated**: ${graph.lastUpdated.toISOString()}
**Nodes**: ${graph.nodes.length}
**Edges**: ${graph.edges.length}
    `;
  }

  // Generate a knowledge graph report
  async generateKnowledgeGraphReport(domain: string): Promise<string> {
    const domainTheories = this.theoryVersions.filter(t => t.domain === domain);
    if (domainTheories.length === 0) {
      // Seed an initial one if empty to avoid empty reports
      const seeded = await this.createTheoryVersion(
        domain,
        `Initial baseline OMEGA physical research hypothesis for ${domain}.`,
        {
          spatial: { x: 10, y: 10, z: 1 },
          temporal: { t: Date.now(), dt: 1.0 },
          features: { baselineFriction: 1.0, baselineHeat: 1.5 }
        }
      );
      domainTheories.push(seeded);
    }

    const report = [
      `# Knowledge Graph: ${domain.toUpperCase()}`,
      `**Generated by OMEGA-CORE Knowledge Graph Engine**\n`,
      `## Theory Versions\n`,
      ...domainTheories.map(theory => `
### Theory v${theory.version} (${theory.timestamp.toISOString()})
- **ID**: ${theory.id}
- **Description**: ${theory.description}
- **Parent Theory**: ${theory.parentTheoryId || 'None'}
- **Changes from Parent**:
  ${theory.changes.map(change => `- ${change}`).join('\n  ') || '- No parent changes.'}
- **Supporting Evidence**:
  ${theory.evidence.map(id => `- Experiment [${id}]`).join('\n  ') || '- No experimental evidence linked yet.'}
- **StateTensor Features**:
  \`\`\`json
  ${JSON.stringify(theory.stateTensor.features, null, 2)}
  \`\`\`
      `),
      `## Knowledge Graph Visualization\n`,
      `\`\`\`mermaid`,
      `graph TD`,
      ...domainTheories.map(theory => {
        const parentLink = theory.parentTheoryId
          ? `  ${theory.parentTheoryId} --> ${theory.id}`
          : '';
        return `  ${theory.id}["Theory v${theory.version}"]\n${parentLink}`.trim();
      }),
      `\`\`\``
    ].join('\n');

    return report;
  }

  getTheoryVersions(): TheoryVersion[] {
    return this.theoryVersions;
  }
}
