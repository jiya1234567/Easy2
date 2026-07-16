// src/utils/tests/autoChainTest.ts
import { RSOrchestrator } from '../rsdOrchestrator';
import { OpenClawAdapter } from '../openClawAdapter';
import { StateTensor } from '../../types';

export async function runAutoChainTest(domain: string, initialData: any[]) {
  // Initialize engines
  const openClaw = new OpenClawAdapter();
  const rsOrchestrator = new RSOrchestrator(openClaw, { maxCycles: 20 });

  // Convert initial data to StateTensor
  const stateTensor: StateTensor = {
    spatial: { x: initialData.length, y: 1, z: 1 },
    temporal: { t: 0, dt: 1 },
    features: {
      domainLength: domain.length,
      variablesCount: Object.keys(initialData[0] || {}).length,
    },
  };

  // Run 20-cycle Auto-Chain
  console.log(`[Auto-Chain Test] Starting 20-cycle test for domain: ${domain}...`);
  const finalState = await rsOrchestrator.startLoop(domain, initialData, {}, stateTensor);

  // Generate report
  const report = await rsOrchestrator.getReport();
  console.log(`[Auto-Chain Test] Report:\n${report}`);

  // Log Research Director experiments
  const experiments = rsOrchestrator.getState().agentActions?.filter(action => action.type === 'hypothesis') || [];
  console.log(`[Auto-Chain Test] Experiments:\n${JSON.stringify(experiments, null, 2)}`);

  return { finalState, report, experiments };
}
