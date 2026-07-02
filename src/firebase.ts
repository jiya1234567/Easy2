/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  setDoc,
  getDocs, 
  doc, 
  getDocFromServer,
  query,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { ScientificSweep } from './types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

let firebaseApp: any = null;
export let db: any = null;
export let auth: any = null;
export let isFirestoreLive = false;

// Check if valid Firebase configuration is supplied
const hasValidConfig = firebaseConfig && 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey.trim() !== "" && 
  firebaseConfig.projectId && 
  firebaseConfig.projectId.trim() !== "";

if (hasValidConfig) {
  try {
    if (!getApps().length) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApps()[0];
    }
    db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(firebaseApp);
    isFirestoreLive = true;
    console.info("⚡ FIRESTORE ACTIVE: Scientific Ledger connected directly to Google Cloud Firestore.");
  } catch (err) {
    console.warn("⚠️ Firebase Initialization failed. Falling back to local ledger simulation mode.", err);
    isFirestoreLive = false;
  }
} else {
  console.info("📋 LOCAL LEDGER MODE: Running sweeps with local persistence fallback. Run set_up_firebase to activate direct Cloud Firestore sync.");
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  console.error('Firestore Secure Rule Error Context: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validation to verify connection on boot
export async function validateFirestoreConnection(): Promise<boolean> {
  if (!isFirestoreLive || !db) return false;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('client is offline')) {
      console.warn("Firestore client is offline. Local sweeps fallback is active.");
    }
    return false;
  }
}

// Fetch all registered scientific sweeps
export async function getSweeps(): Promise<ScientificSweep[]> {
  const localKey = 'singularity_scientific_sweeps';
  
  if (isFirestoreLive && db) {
    try {
      const sweepsCollection = collection(db, 'sweeps');
      const sweepsQuery = query(sweepsCollection, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(sweepsQuery);
      const results: ScientificSweep[] = [];
      snapshot.forEach((docRef) => {
        const data = docRef.data();
        results.push({
          id: docRef.id,
          timestamp: data.timestamp,
          domain: data.domain,
          totalRuns: data.totalRuns,
          meanError: data.meanError,
          confidence: data.confidence,
          failureRate: data.failureRate,
          hashSignature: data.hashSignature,
          calibratedHeat: data.calibratedHeat || 0,
          calibratedDiffusion: data.calibratedDiffusion || 0,
          calibratedWindX: data.calibratedWindX || 0,
          calibratedWindY: data.calibratedWindY || 0,
          verifier: data.verifier || 'Unknown'
        });
      });
      return results;
    } catch (error) {
      console.error("Firestore loading error, falling back to local storage ledger:", error);
      // Fail-secure/graceful fallback
    }
  }

  // Local storage fallback
  try {
    const saved = localStorage.getItem(localKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.sort((a: any, b: any) => b.timestamp.localeCompare(a.timestamp));
    }
  } catch (e) {
    console.error("Failed to parse local sweeps:", e);
  }
  return [];
}

// Publish a new non-repudiable sweep passport to the ledger
export async function publishSweep(sweepData: Omit<ScientificSweep, 'id' | 'timestamp'>): Promise<ScientificSweep> {
  const localKey = 'singularity_scientific_sweeps';
  const id = `SWEEP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const timestamp = new Date().toISOString();
  
  const fullSweep: ScientificSweep = {
    id,
    timestamp,
    ...sweepData
  };

  // 1. Attempt Cloud Firestore write
  if (isFirestoreLive && db) {
    try {
      const docRef = doc(db, 'sweeps', id);
      await setDoc(docRef, {
        id,
        timestamp,
        domain: fullSweep.domain,
        totalRuns: fullSweep.totalRuns,
        meanError: fullSweep.meanError,
        confidence: fullSweep.confidence,
        failureRate: fullSweep.failureRate,
        hashSignature: fullSweep.hashSignature,
        calibratedHeat: fullSweep.calibratedHeat,
        calibratedDiffusion: fullSweep.calibratedDiffusion,
        calibratedWindX: fullSweep.calibratedWindX,
        calibratedWindY: fullSweep.calibratedWindY,
        verifier: fullSweep.verifier
      });
      console.info(`✅ LEDGER SIGNED: Published sweep ${id} directly to Cloud Firestore.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `sweeps/${id}`);
    }
  }

  // 2. Also record in localStorage for cross-parity and local offline backup
  try {
    const saved = localStorage.getItem(localKey);
    const sweeps = saved ? JSON.parse(saved) : [];
    sweeps.push(fullSweep);
    localStorage.setItem(localKey, JSON.stringify(sweeps));
  } catch (e) {
    console.error("Failed to persist local sweep:", e);
  }

  return fullSweep;
}
