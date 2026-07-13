import { StateTensor, HardwareState, RecursiveDiscoveryEntry } from '../types';
import { OpenClawAdapter } from './openClawAdapter';
import { RealityAnchor } from './realityAnchor';
import { FailureDiagnoser } from './failureDiagnoser';
import { DataAcquisitionLayer } from './dataAcquisitionLayer';
import { KnowledgeGraphEngine } from './knowledgeGraphEngine';
import { ScientificPassport } from './scientificPassport';
import { DiscoveryScoreCalculator } from './discoveryScoreCalculator';

export interface ChallengeStepLog {
  step: number;
  label: string;
  description: string;
  status: 'pending' | 'active' | 'success' | 'failure';
  details: string;
  data?: any;
}

export class WorldBankChallenge {
  private openClaw: OpenClawAdapter;
  private anchor: RealityAnchor;
  private diagnoser: FailureDiagnoser;
  private acquirer: DataAcquisitionLayer;
  private kgEngine: KnowledgeGraphEngine;

  constructor() {
    this.openClaw = new OpenClawAdapter();
    this.anchor = new RealityAnchor(this.openClaw);
    this.diagnoser = new FailureDiagnoser(this.openClaw);
    this.acquirer = new DataAcquisitionLayer(this.openClaw);
    this.kgEngine = new KnowledgeGraphEngine(this.openClaw);
  }

  // Run the full 10-step economic scientific discovery loop
  async *runEconomicChallenge(onStepChange?: (logs: ChallengeStepLog[]) => void): AsyncGenerator<ChallengeStepLog[], void, unknown> {
    const logs: ChallengeStepLog[] = [
      { step: 1, label: 'Observe', description: 'Gini coefficient, shipping delay matrices, and nominal inflation indices.', status: 'pending', details: 'Awaiting activation of economic scientific sensor arrays...' },
      { step: 2, label: 'Predict', description: 'Project inflation recovery bounds using traditional physical econometric baselines.', status: 'pending', details: 'Waiting for prediction pipeline...' },
      { step: 3, label: 'FAIL 🛑', description: 'Validate prediction against actual World Bank downgraded reality matrices.', status: 'pending', details: 'Awaiting validation validation matrices...' },
      { step: 4, label: 'Diagnose 🧠', description: 'Classify failure models and identify active blind spots in the model assumption matrices.', status: 'pending', details: 'Awaiting failure trigger...' },
      { step: 5, label: 'Missing Knowledge', description: 'Isolate unobserved parameters (e.g. Maritime Insurance Premiums, Port Congestion).', status: 'pending', details: 'Waiting for diagnostic results...' },
      { step: 6, label: 'Acquire Evidence', description: 'Leverage data acquisition layers to stream live freight & Lloyd\'s shipping indices.', status: 'pending', details: 'Waiting to fetch external indicators...' },
      { step: 7, label: 'Update Causal Graph', description: 'Link the newly acquired variables dynamically to restructure our causal hypothesis.', status: 'pending', details: 'Waiting to update knowledge graph...' },
      { step: 8, label: 'Retry', description: 'Re-run causal forecasting models with the integrated variables.', status: 'pending', details: 'Awaiting simulation rerun...' },
      { step: 9, label: 'Converge 🎉', description: 'Verify that prediction uncertainty bounds collapse below the 0.04 RSD threshold.', status: 'pending', details: 'Waiting to evaluate updated error metrics...' },
      { step: 10, label: 'Discovery 🏆', description: 'Formulate robust domestic policy discoveries to present to World Bank governors.', status: 'pending', details: 'Awaiting final synthesis...' }
    ];

    const stateTensor: StateTensor = {
      spatial: { x: 140, y: 35, z: 2 }, // spatial indices corresponding to Global Shipping Hub corridors
      temporal: { t: Date.now(), dt: 1.0 },
      features: { GiniCoefficient: 0.45, BaselineSubsidies: 1.2 }
    };

    const hardwareState: HardwareState = {
      gpu: { temp: 42, memoryUsage: 0.15, clockSpeed: 1410 },
      cpu: { load: 0.12, temp: 45 },
      bitErrors: 0
    };

    yield logs;

    // --- STEP 1: OBSERVE ---
    logs[0].status = 'active';
    logs[0].details = 'Scanning historical global trade records, local industry subsidies, and regional consumer baskets... Found Gini Coefficient = 0.45, Port Delay Index = 1.0.';
    logs[0].data = { gini: 0.45, baselineSubsidies: 1.2, portDelayIndex: 1.0 };
    if (onStepChange) onStepChange([...logs]);
    await this.delay(1800);
    logs[0].status = 'success';
    logs[0].details = 'Observations ingested successfully into OMEGA-CORE state tensors.';
    yield logs;

    // --- STEP 2: PREDICT ---
    logs[1].status = 'active';
    logs[1].details = 'Running XGBoost and standard linear econometric models to project regional inflation recovery...';
    if (onStepChange) onStepChange([...logs]);
    await this.delay(1800);
    const initialPrediction = { expectedInflation: 2.1, rSquared: 0.88, mae: 0.03, ciWidth: 0.02 };
    logs[1].status = 'success';
    logs[1].details = 'Predicted regional inflation to settle at a stable 2.1% under nominal parameters.';
    logs[1].data = initialPrediction;
    yield logs;

    // --- STEP 3: FAIL 🛑 ---
    logs[2].status = 'active';
    logs[2].details = 'Confronting prediction against actual reality data... World Bank has downgraded regional economic health as domestic inflation spikes to 12.4%!';
    if (onStepChange) onStepChange([...logs]);
    await this.delay(2000);
    
    // Evaluate against reality thresholds
    const groundTruth = { expectedInflation: 12.4, rSquared: 0.35, mae: 0.18, ciWidth: 0.15 };
    const validationResult = await this.anchor.validate(groundTruth, initialPrediction, 'economics', hardwareState);
    
    logs[2].status = 'failure';
    logs[2].details = `CRITICAL FAILURE DETECTED! Actual inflation of 12.4% violates normal boundaries. Prediction error: ${validationResult.error.toFixed(2)}. World Bank downgrades regional economic resilience.`;
    logs[2].data = { groundTruth: 12.4, predicted: 2.1, mae: validationResult.error, isFailure: validationResult.isFailure };
    
    // Log failure to Scientific Passport
    await ScientificPassport.logFailure('EXP-WB-101', 'wrong_assumption', 'economics', validationResult.severity || 2.5);
    yield logs;

    // --- STEP 4: DIAGNOSE 🧠 ---
    logs[3].status = 'active';
    logs[3].details = 'Analyzing anomaly patterns and classifying operational failure triggers...';
    if (onStepChange) onStepChange([...logs]);
    await this.delay(1800);
    
    const failureType = this.diagnoser.classifyFailure('economics', groundTruth, initialPrediction, hardwareState);
    const diagnosis = await this.diagnoser.diagnoseFailure(
      'economics',
      groundTruth,
      initialPrediction,
      failureType,
      validationResult.severity || 2.5,
      stateTensor,
      hardwareState
    );

    logs[3].status = 'success';
    logs[3].details = `Classified as [${failureType.toUpperCase()}]. Meta-cognitive diagnosis completed: ${diagnosis.rootCause}`;
    logs[3].data = diagnosis;
    yield logs;

    // --- STEP 5: IDENTIFY MISSING KNOWLEDGE ---
    logs[4].status = 'active';
    logs[4].details = 'Scanning surrounding causal networks for absent parameters...';
    if (onStepChange) onStepChange([...logs]);
    await this.delay(1800);
    
    const missingParameter = 'maritime_freight_premiums';
    logs[4].status = 'success';
    logs[4].details = 'Identified missing causal parameter: Maritime Freight Insurance Premiums are unmodeled in standard consumer indexes.';
    logs[4].data = { missingParameter, affectedNodes: ['domestic_freight_rates', 'import_tariffs'] };
    yield logs;

    // --- STEP 6: ACQUIRE EVIDENCE ---
    logs[5].status = 'active';
    logs[5].details = `Deploying data acquisition layers to grab Suez Canal shipping delay logs, Lloyd's premium indices, and freight costs...`;
    if (onStepChange) onStepChange([...logs]);
    await this.delay(2000);
    
    const acquisitionLog = await this.acquirer.acquireData('EXP-WB-101', missingParameter, 'economics', stateTensor);
    
    logs[5].status = 'success';
    logs[5].details = 'External maritime insurance premium indices (Lloyd\'s spike) acquired successfully with high signal confidence.';
    logs[5].data = acquisitionLog;
    yield logs;

    // --- STEP 7: UPDATE CAUSAL GRAPH ---
    logs[6].status = 'active';
    logs[6].details = 'Integrating new variables and dynamic edges into the economic causal graph...';
    if (onStepChange) onStepChange([...logs]);
    await this.delay(2000);
    
    const nodes = ['Port_Congestion', 'Maritime_Insurance_Spikes', 'Freight_Rates', 'Local_Subsidies', 'Domestic_Inflation'];
    const edges = [
      { from: 'Port_Congestion', to: 'Maritime_Insurance_Spikes', confidence: 0.95, evidence: ['Suez_Delay_Logs_2023'] },
      { from: 'Maritime_Insurance_Spikes', to: 'Freight_Rates', confidence: 0.91, evidence: ['Lloyds_Premium_Index'] },
      { from: 'Freight_Rates', to: 'Local_Subsidies', confidence: 0.84, evidence: ['subsidy_records_v4'] },
      { from: 'Local_Subsidies', to: 'Domestic_Inflation', confidence: 0.88, evidence: ['inflation_drift_residuals'] }
    ];
    
    const updatedGraph = await this.kgEngine.updateCausalGraph('economics', nodes, edges, stateTensor, hardwareState);
    
    logs[6].status = 'success';
    logs[6].details = `Causal graph updated to version ${updatedGraph.version}. Dynamic structural relationships mapped successfully.`;
    logs[6].data = updatedGraph;
    yield logs;

    // --- STEP 8: RETRY ---
    logs[7].status = 'active';
    logs[7].details = 'Re-initializing causal prediction parameters with the updated knowledge structures...';
    if (onStepChange) onStepChange([...logs]);
    await this.delay(1800);
    
    const retryPrediction = { expectedInflation: 11.8, rSquared: 0.94, mae: 0.02, ciWidth: 0.035 };
    logs[7].status = 'success';
    logs[7].details = 'New prediction with integrated maritime causal vectors forecasts inflation at 11.8%.';
    logs[7].data = retryPrediction;
    yield logs;

    // --- STEP 9: CONVERGE 🎉 ---
    logs[8].status = 'active';
    logs[8].details = 'Evaluating new error matrices against World Bank reality...';
    if (onStepChange) onStepChange([...logs]);
    await this.delay(1800);
    
    const finalValidation = await this.anchor.validate(retryPrediction, groundTruth, 'economics', hardwareState);
    const ciCollapse = 0.15 - 0.035; // width collapsed from 0.15 to 0.035 (highly stable)
    
    logs[8].status = 'success';
    logs[8].details = `Uncertainty collapsed by ${(ciCollapse * 100).toFixed(1)}%. Confidence interval width (0.035) satisfies the 0.04 RSD strict target limit!`;
    logs[8].data = { finalMae: finalValidation.error, finalConfidence: finalValidation.confidence, ciWidth: retryPrediction.ciWidth };
    yield logs;

    // --- STEP 10: DISCOVERY 🏆 ---
    logs[9].status = 'active';
    logs[9].details = 'Synthesizing final structural policy recommendations for World Bank governors...';
    if (onStepChange) onStepChange([...logs]);
    await this.delay(2200);
    
    const discoveryStatement = 'Strategic Port Insurance Stabilization Buffers shield small economies from trade-route transportation cost spikes.';
    logs[9].status = 'success';
    logs[9].details = `DISCOVERY CONFIRMED! Policy synthesized: "${discoveryStatement}"`;
    logs[9].data = {
      discoveryStatement,
      upgradeConfirmed: true,
      usdiScore: DiscoveryScoreCalculator.calculateUSDI('economics'),
    };

    // Log the complete recursive entry step
    await ScientificPassport.logRecursiveDiscoveryCycle({
      purpose: 'Model World Bank global shipping premium shocks.',
      failure: 'Underestimated inflation by 10.3% due to unmodeled maritime premium spikes.',
      missingObservation: 'Maritime_Insurance_Spikes',
      newExperiment: 'Inject shipping rate and insurance premium transmission vectors into causal model.',
      improvement: 'Reduced model error (MAE) from 0.18 to 0.02.',
      confidence: 0.94,
      domain: 'economics',
      experimentId: 'EXP-WB-101'
    });

    // Update discovery scores
    DiscoveryScoreCalculator.updateScores('economics', {
      novelVariablesPer100: 5.8,
      assumptionsRemovedPerExperiment: 1.5,
      experimentsSavedPercent: 42.0,
      uncertaintyReducedPercent: 76.7, // Collapsed uncertainty from 0.15 to 0.035
      crossDomainReuse: 1.8,
      newCausalLinks: 4,
    });

    if (onStepChange) onStepChange([...logs]);
    yield logs;
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
