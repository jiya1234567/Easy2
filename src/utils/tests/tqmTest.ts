// src/utils/tests/tqmTest.ts
import { RSOrchestrator } from '../rsdOrchestrator';
import { OpenClawAdapter } from '../openClawAdapter';
import { ScientificPassport } from '../scientificPassport';
import { KnowledgeGraphEngine } from '../knowledgeGraphEngine';
import { StateTensor } from '../../types';

// TQM Dataset
const tqmDataset = {
  teacher_industry_years: [0, 0, 2, 3, 5, 5, 8, 10, 12, 15, 18, 20],
  curriculum_relevance_score: [55, 58, 62, 65, 70, 68, 75, 78, 80, 82, 85, 88],
  student_engagement_score: [60, 62, 65, 68, 72, 70, 78, 80, 82, 84, 86, 88],
  student_outcome_score: [62, 64, 66, 68, 74, 72, 79, 81, 83, 85, 87, 89],
  teaching_method_score: [70, 72, 70, 74, 75, 73, 78, 80, 82, 82, 84, 86],
  years_teaching: [15, 12, 10, 8, 6, 8, 5, 4, 3, 2, 2, 1],
  professional_dev_hours: [40, 38, 35, 32, 28, 30, 25, 22, 18, 15, 12, 10],
};

export async function runTQMTest() {
  // Initialize engines
  const openClaw = new OpenClawAdapter();
  const rsOrchestrator = new RSOrchestrator(openClaw);
  const knowledgeGraph = new KnowledgeGraphEngine(openClaw);

  // Convert dataset to StateTensor
  const stateTensor: StateTensor = {
    spatial: { x: tqmDataset.teacher_industry_years.length, y: 1, z: 1 },
    temporal: { t: 0, dt: 1 },
    features: {
      domain: 4, // Numeric identifier
      variablesCount: Object.keys(tqmDataset).length,
    },
  };

  // Run RSD loop
  console.log('[TQM Test] Starting RSD loop for Teacher Industry Experience dataset...');
  
  // Transform the object dataset into an array of objects
  const keys = Object.keys(tqmDataset);
  const rowCount = tqmDataset.teacher_industry_years.length;
  const arrayData = [];
  for (let i = 0; i < rowCount; i++) {
    const row: Record<string, any> = {};
    keys.forEach(key => {
      row[key] = (tqmDataset as any)[key][i];
    });
    arrayData.push(row);
  }

  const finalState = await rsOrchestrator.startLoop('education', arrayData, {}, stateTensor);

  // Generate report
  const report = await rsOrchestrator.getReport();
  console.log('[TQM Test] Report:\n', report);

  // Validate findings
  const causalResult = await rsOrchestrator.getState().agentActions.find(a => a.type === 'observation');
  const causalGraph = causalResult?.causalGraph;

  if (causalGraph) {
    console.log('[TQM Test] Causal Graph:\n', JSON.stringify(causalGraph, null, 2));
  } else {
    console.warn('[TQM Test] No causal graph generated.');
  }

  // Check Research Director logs
  const experiments = ScientificPassport.getRecursiveDiscoveryTable('education');
  console.log('[TQM Test] Experiments from Scientific Passport:\n', JSON.stringify(experiments, null, 2));

  return { finalState, report, causalGraph };
}
