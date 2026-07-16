// src/utils/tests/overnightTest.ts
import { RSOrchestrator } from '../rsdOrchestrator';
import { OpenClawAdapter } from '../openClawAdapter';
import { StateTensor } from '../../types';

// Run 100+ autonomous experiments overnight
export async function runOvernightTest(domain: string, initialData: any[]) {
  const openClaw = new OpenClawAdapter();
  const rsOrchestrator = new RSOrchestrator(openClaw, { maxCycles: 100 });

  // Convert initial data to StateTensor
  const stateTensor: StateTensor = {
    spatial: { x: initialData.length, y: 1, z: 1 },
    temporal: { t: 0, dt: 1 },
    features: {
      domainLength: domain.length,
      variablesCount: Object.keys(initialData[0] || {}).length,
    },
  };

  // Run 100+ cycles
  console.log(`[Overnight Test] Starting 100+ cycle test for domain: ${domain}...`);
  let finalState = await rsOrchestrator.startLoop(domain, initialData, {}, stateTensor);

  // Continue until 100 cycles or convergence
  let cycle = 0;
  while (cycle < 100 && finalState.currentStep !== 'converge') {
    cycle++;
    finalState = await rsOrchestrator.startLoop(
      domain,
      finalState.data || [],
      finalState.updatedModel || {},
      stateTensor,
      finalState.hardwareState
    );
    console.log(`[Overnight Test] Cycle ${cycle}: ${finalState.currentStep}`);
  }

  // Generate report
  const report = await rsOrchestrator.getReport();
  console.log(`[Overnight Test] Report:\n${report}`);

  // Log Research Director experiments
  const experiments = rsOrchestrator.getState().agentActions?.filter(action => action.type === 'observation') || [];
  console.log(`[Overnight Test] Experiments:\n${JSON.stringify(experiments, null, 2)}`);

  return { finalState, report, experiments };
}
