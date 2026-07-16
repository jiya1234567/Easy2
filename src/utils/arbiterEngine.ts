import { HardwareState } from '../types';
import { OpenClawAdapter } from './openClawAdapter';

export class ArbiterEngine {
  private openClaw: OpenClawAdapter;
  private reproducibilityScores: Record<string, number> = {}; // Track hypothesis reproducibility
  private realityAnchorAccuracy: Record<string, number> = {}; // Track Reality Anchor accuracy

  constructor(openClaw: OpenClawAdapter) {
    this.openClaw = openClaw;
  }

  // Update reproducibility score for a hypothesis
  updateReproducibilityScore(hypothesis: string, score: number): void {
    this.reproducibilityScores[hypothesis] = score;
  }

  // Update Reality Anchor accuracy for a hypothesis
  updateRealityAnchorAccuracy(hypothesis: string, accuracy: number): void {
    this.realityAnchorAccuracy[hypothesis] = accuracy;
  }

  // Resolve consensus between multiple models, incorporating reproducibility and Reality Anchor weights
  async resolveConsensus(
    task: string,
    input: any,
    models: ('mistral' | 'phi3' | 'llava' | string)[],
    hardwareState?: HardwareState
  ): Promise<{
    consensus: any;
    disagreements: { model: string; output: any }[];
    confidence: number;
    reproducibilityScore: number;
    realityAnchorAccuracy: number;
  }> {
    const results = await Promise.all(
      models.map(model => this.openClaw.assignTask(task, model, input, hardwareState))
    );

    // Calculate consensus
    const consensus = this.calculateConsensus(results);
    const disagreements = results
      .map((result, i) => ({ model: models[i], output: result }))
      .filter(item => JSON.stringify(item.output) !== JSON.stringify(consensus));

    // Get score weights
    const hypothesis = consensus?.hypothesis || (typeof consensus === 'string' ? consensus : JSON.stringify(consensus));
    const reproducibilityScore = this.reproducibilityScores[hypothesis] || 0.5; // Default baseline: 0.5
    const realityAnchorAccuracy = this.realityAnchorAccuracy[hypothesis] || 0.5; // Default baseline: 0.5

    // Weighted confidence: 50% from model agreement, 30% from reproducibility, 20% from Reality Anchor checks
    const agreementRatio = 1 - (disagreements.length / Math.max(1, models.length));
    const confidence = Number((
      0.5 * agreementRatio +
      0.3 * reproducibilityScore +
      0.2 * realityAnchorAccuracy
    ).toFixed(3));

    return {
      consensus,
      disagreements,
      confidence,
      reproducibilityScore,
      realityAnchorAccuracy
    };
  }

  private calculateConsensus(results: any[]): any {
    if (results.length === 0) return null;
    if (results.length === 1) return results[0];

    // For numerical values, take the average
    if (typeof results[0] === 'number') {
      return results.reduce((sum, val) => sum + val, 0) / results.length;
    }
    // For objects, take the most common key-value pairs
    else if (typeof results[0] === 'object' && results[0] !== null) {
      if (Array.isArray(results[0])) {
        // For arrays, take the most common elements
        const flat = results.flat();
        const counts: Record<string, number> = {};
        flat.forEach((item: any) => {
          const key = JSON.stringify(item);
          counts[key] = (counts[key] || 0) + 1;
        });
        const sorted = Object.entries(counts).sort((a: any, b: any) => b[1] - a[1]);
        return sorted.map(([key]: any) => JSON.parse(key));
      }

      const consensus: Record<string, any> = {};
      const firstObj = results[0];
      for (const key in firstObj) {
        if (Object.prototype.hasOwnProperty.call(firstObj, key)) {
          const values = results.map(r => r[key]).filter(v => v !== undefined);
          if (values.length > 0) {
            consensus[key] = this.calculateConsensus(values);
          }
        }
      }
      return consensus;
    }
    // Default: Return the first result
    return results[0];
  }
}
