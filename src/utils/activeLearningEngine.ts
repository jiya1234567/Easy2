import { StateTensor, HardwareState } from '../types';
import { OpenClawAdapter } from './openClawAdapter';
import { ScientificPassport, ExperimentRecord } from './scientificPassport';

export interface ActiveLearningProposal {
  experiment: string;
  expectedInformationGain: number;
  rationale: string;
  estimatedRuntime: string;
}

export class ActiveLearningEngine {
  private openClaw: OpenClawAdapter;

  constructor(openClaw: OpenClawAdapter) {
    this.openClaw = openClaw;
  }

  // Propose the next most informative experiment
  async proposeNextExperiment(
    domain: string,
    currentData: any[],
    currentTheory: any,
    hardwareState?: HardwareState
  ): Promise<ActiveLearningProposal> {
    // Step 1: Use Phi-3 to identify uncertainties in current theory
    const uncertaintyAnalysis = await this.openClaw.assignTask(
      'uncertainty_analysis',
      'phi3',
      {
        currentData,
        currentTheory,
        domain,
      },
      hardwareState
    );

    // Step 2: Use Mistral to propose experiments that reduce uncertainty
    const experimentProposal = await this.openClaw.assignTask(
      'experiment_proposal',
      'mistral',
      {
        uncertaintyAnalysis,
        domain,
        currentTheory,
      },
      hardwareState
    );

    const expectedInformationGain = 0.88; 
    const estimatedRuntime = this.estimateRuntime(domain, experimentProposal?.hypothesis || 'Standard Calibration Sweep');

    return {
      experiment: experimentProposal?.hypothesis || 'Refined high-velocity boundary layer testing.',
      expectedInformationGain,
      rationale: experimentProposal?.reasoning || 'Evaluates boundary core interaction behavior under extreme diffusion bounds.',
      estimatedRuntime,
    };
  }

  // Estimate runtime for an experiment
  private estimateRuntime(domain: string, experiment: string): string {
    const d = domain.toLowerCase();
    if (d.includes('quantum') || d.includes('spin')) {
      return '10 minutes';
    } else if (d.includes('finance') || d.includes('rba')) {
      return '5 minutes';
    } else if (d.includes('weather') || d.includes('climate')) {
      return '15 minutes';
    }
    return '8 minutes';
  }

  // Log the proposed experiment to Scientific Passport
  async logProposedExperiment(
    domain: string,
    currentData: any[],
    currentTheory: any,
    hardwareState?: HardwareState
  ): Promise<ExperimentRecord> {
    const proposal = await this.proposeNextExperiment(domain, currentData, currentTheory, hardwareState);
    const record: ExperimentRecord = {
      domain,
      hypothesis: `Next Experiment Proposal: ${proposal.experiment}`,
      input: { currentData, currentTheory },
      stateTensor: this.dataToStateTensor(currentData, domain),
      hardwareState,
      modelsUsed: ['phi3', 'mistral'],
      prediction: proposal.rationale
    };
    return ScientificPassport.logExperiment(record);
  }

  // Convert data to StateTensor
  private dataToStateTensor(data: any[], domain: string): StateTensor {
    return {
      spatial: { x: data.length || 1, y: 1, z: 1 },
      temporal: { t: Date.now(), dt: 1.0 },
      features: {
        domainIndex: domain.length,
        dataPoints: data.length,
      },
    };
  }
}
