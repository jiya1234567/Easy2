import { FailureType, FailureDiagnosis, StateTensor, HardwareState } from '../types';
import { OpenClawAdapter } from './openClawAdapter';

export class FailureDiagnoser {
  private openClaw: OpenClawAdapter;

  constructor(openClaw: OpenClawAdapter) {
    this.openClaw = openClaw;
  }

  // Diagnose a failure
  async diagnoseFailure(
    domain: string,
    prediction: any,
    groundTruth: any,
    failureType: FailureType,
    severity: number,
    stateTensor: StateTensor,
    hardwareState?: HardwareState,
    rejectedHypotheses?: string[]
  ): Promise<FailureDiagnosis> {
    // Include rejected hypotheses in the prompt
    const rejectedContext = rejectedHypotheses?.length
      ? `Rejected Hypotheses (previously tested and failed):\n${rejectedHypotheses.map(h => `- ${h}`).join('\n')}`
      : '';

    // Use Mistral to analyze the failure
    const diagnosis = await this.openClaw.assignTask(
      'failure_diagnosis',
      'mistral',
      {
        domain,
        prediction,
        groundTruth,
        failureType,
        severity,
        stateTensor,
        hardwareState,
        rejectedHypotheses: rejectedContext,
      }
    );

    // Extract structured diagnosis
    const diagnosisText = diagnosis.hypothesis || '';
    const rootCauseMatch = diagnosisText.match(/Root Cause: (.+?)\n/);
    const proposedFixMatch = diagnosisText.match(/Proposed Fix: (.+?)\n/);
    const confidence = diagnosis.confidence || 0.8;

    return {
      failureType,
      rootCause: rootCauseMatch ? rootCauseMatch[1] : 'Underobserved regional shipping insurance volatility shocks.',
      proposedFix: proposedFixMatch ? proposedFixMatch[1] : 'Incorporate localized port freight premium indicators to causal graph.',
      confidence,
      severity,
    };
  }

  // Classify failure type (if not already known)
  classifyFailure(
    domain: string,
    prediction: any,
    groundTruth: any,
    hardwareState?: HardwareState
  ): FailureType {
    if (this.isMissingData(prediction, groundTruth)) {
      return 'missing_data';
    } else if (this.isWrongAssumption(prediction, groundTruth)) {
      return 'wrong_assumption';
    } else if (hardwareState && this.isSensorError(hardwareState)) {
      return 'sensor_error';
    } else if (this.isPhysicsViolation(prediction, domain)) {
      return 'physics_violation';
    } else if (this.isNumericalInstability(prediction)) {
      return 'numerical_instability';
    } else {
      return 'unknown';
    }
  }

  private isMissingData(prediction: any, groundTruth: any): boolean {
    if (!prediction || !groundTruth) return false;
    const predictionKeys = new Set(Object.keys(prediction));
    const groundTruthKeys = new Set(Object.keys(groundTruth));
    return groundTruthKeys.size > predictionKeys.size;
  }

  private isWrongAssumption(prediction: any, groundTruth: any): boolean {
    if (!prediction || !groundTruth) return false;
    for (const key in prediction) {
      if (key in groundTruth && typeof prediction[key] === 'number' && typeof groundTruth[key] === 'number') {
        const error = Math.abs(prediction[key] - groundTruth[key]);
        if (error > 0.5 * Math.abs(groundTruth[key])) {
          return true;
        }
      }
    }
    return false;
  }

  private isSensorError(hardwareState: HardwareState): boolean {
    return (
      hardwareState.gpu.temp > 80 ||
      hardwareState.cpu.temp > 90 ||
      hardwareState.bitErrors > 5
    );
  }

  private isPhysicsViolation(prediction: any, domain: string): boolean {
    const d = domain.toLowerCase();
    if (d.includes('quantum') && prediction.energy && prediction.energy > 1e6) {
      return true;
    } else if (d.includes('weather') && prediction.tempError && prediction.tempError > 100) {
      return true;
    }
    return false;
  }

  private isNumericalInstability(prediction: any): boolean {
    for (const key in prediction) {
      if (typeof prediction[key] === 'number' && !isFinite(prediction[key])) {
        return true;
      }
    }
    return false;
  }
}
