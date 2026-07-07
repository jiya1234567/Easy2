import { db, isFirestoreLive } from '../firebase';
import { collection, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { StateTensor, HardwareState } from '../types';

export type ExperimentRecord = {
  id?: string;
  domain: string;
  hypothesis: string;
  input: any;
  prediction: any;
  groundTruth?: any;
  validation?: {
    isValid: boolean;
    error: number;
    confidence: number;
    feedback: string;
  };
  stateTensor: StateTensor;
  hardwareState?: HardwareState;
  timestamp?: any;
  modelsUsed: string[];
  consensus?: {
    result: any;
    disagreements: { model: string; output: any }[];
    confidence: number;
  };
};

export class ScientificPassport {
  static async logExperiment(experiment: ExperimentRecord): Promise<ExperimentRecord> {
    const id = `EXP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const timestamp = new Date().toISOString();

    const record = {
      ...experiment,
      id,
      timestamp
    };

    // Try Firestore if active
    if (isFirestoreLive && db) {
      try {
        const docRef = doc(collection(db, 'experiments'), id);
        await setDoc(docRef, {
          ...record,
          timestamp: serverTimestamp()
        });
        console.info(`[Scientific Passport] Logged experiment ${id} to Cloud Firestore.`);
      } catch (err) {
        console.error("[Scientific Passport] Firestore error, saving locally:", err);
      }
    }

    // Save to localStorage as redundancy
    try {
      const saved = localStorage.getItem('scientific_passport_ledger');
      const ledger = saved ? JSON.parse(saved) : [];
      ledger.push(record);
      localStorage.setItem('scientific_passport_ledger', JSON.stringify(ledger));
    } catch (e) {
      console.error("[Scientific Passport] Failed to save locally:", e);
    }

    return record;
  }

  static async logHypothesis(
    domain: string,
    hypothesis: string,
    input: any,
    stateTensor: StateTensor,
    hardwareState?: HardwareState,
    modelsUsed: string[] = []
  ): Promise<ExperimentRecord> {
    return this.logExperiment({
      domain,
      hypothesis,
      input,
      stateTensor,
      hardwareState,
      modelsUsed,
      prediction: "Pending simulation run..."
    });
  }

  static async logValidation(
    experimentId: string,
    prediction: any,
    groundTruth: any,
    validation: {
      isValid: boolean;
      error: number;
      confidence: number;
      feedback: string;
    },
    modelsUsed: string[] = []
  ): Promise<void> {
    console.log(`[Scientific Passport] Logged validation for experiment ${experimentId}:`, validation);
    
    // Update local storage
    try {
      const saved = localStorage.getItem('scientific_passport_ledger');
      if (saved) {
        const ledger = JSON.parse(saved) as ExperimentRecord[];
        const index = ledger.findIndex(e => e.id === experimentId);
        if (index !== -1) {
          ledger[index].prediction = prediction;
          ledger[index].groundTruth = groundTruth;
          ledger[index].validation = validation;
          ledger[index].modelsUsed = Array.from(new Set([...ledger[index].modelsUsed, ...modelsUsed]));
          localStorage.setItem('scientific_passport_ledger', JSON.stringify(ledger));
        }
      }
    } catch (err) {
      console.error("[Scientific Passport] Local storage validation log failed:", err);
    }
  }

  static async logConsensus(
    experimentId: string,
    consensus: any,
    disagreements: { model: string; output: any }[],
    confidence: number,
    modelsUsed: string[]
  ): Promise<void> {
    console.log(`[Scientific Passport] Logged consensus for experiment ${experimentId}:`, { consensus, disagreements, confidence });
    
    try {
      const saved = localStorage.getItem('scientific_passport_ledger');
      if (saved) {
        const ledger = JSON.parse(saved) as ExperimentRecord[];
        const index = ledger.findIndex(e => e.id === experimentId);
        if (index !== -1) {
          ledger[index].consensus = {
            result: consensus,
            disagreements,
            confidence
          };
          ledger[index].modelsUsed = Array.from(new Set([...ledger[index].modelsUsed, ...modelsUsed]));
          localStorage.setItem('scientific_passport_ledger', JSON.stringify(ledger));
        }
      }
    } catch (err) {
      console.error("[Scientific Passport] Local storage consensus log failed:", err);
    }
  }
}
