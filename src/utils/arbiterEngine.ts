import { HardwareState } from '../types';
import { OpenClawAdapter } from './openClawAdapter';

export class ArbiterEngine {
  private openClaw: OpenClawAdapter;

  constructor(openClaw: OpenClawAdapter) {
    this.openClaw = openClaw;
  }

  // Resolve consensus between multiple models
  async resolveConsensus(
    task: string,
    input: any,
    models: ('mistral' | 'phi3' | 'llava' | string)[],
    hardwareState?: HardwareState
  ): Promise<{
    consensus: any;
    disagreements: { model: string; output: any }[];
    confidence: number;
  }> {
    const results = await Promise.all(
      models.map(model => this.openClaw.assignTask(task, model, input, hardwareState))
    );

    // Simple consensus: Majority vote (for categorical) or average (for numerical)
    const consensus = this.calculateConsensus(results);
    const disagreements = results
      .map((result, i) => ({ model: models[i], output: result }))
      .filter(item => JSON.stringify(item.output) !== JSON.stringify(consensus));

    const confidence = Number((1 - (disagreements.length / Math.max(1, models.length))).toFixed(3));

    return { consensus, disagreements, confidence };
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
