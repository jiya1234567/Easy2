// src/utils/molecularDockingEngine.ts

export interface DockingResult {
  protein: string;
  ligand: string;
  bindingAffinity: number; // kcal/mol
  activeSiteCoordinates: { x: number; y: number; z: number };
  ligandAtoms: {
    symbol: string;
    coordinates: { x: number; y: number; z: number };
    charge: number;
  }[];
  hydrogenBonds: number;
  confidence: number;
}

export class MolecularDockingEngine {
  // Simulates molecular docking between a protein receptor and a small molecule ligand
  static dockLigand(protein: string, ligand: string): DockingResult {
    const pLen = protein.length || 10;
    const lLen = ligand.length || 5;

    // Active pocket coordinates based on receptor size
    const activeSiteCoordinates = {
      x: Math.sin(pLen * 0.15) * 4.5,
      y: Math.cos(pLen * 0.15) * 4.5,
      z: (pLen % 5) * 1.8,
    };

    // Construct simple chemical ligand atoms (e.g. carbon chains and oxygen/nitrogen bindings)
    const ligandSymbols = ['C', 'C', 'O', 'N', 'C', 'F', 'H', 'H', 'H'];
    const ligandAtoms = Array(Math.min(12, Math.max(4, lLen))).fill(null).map((_, index) => {
      const symbol = ligandSymbols[index % ligandSymbols.length];
      const offsetAngle = index * 0.8;
      // Position small ligand atoms offset around active pocket
      const x = activeSiteCoordinates.x + Math.cos(offsetAngle) * 1.4;
      const y = activeSiteCoordinates.y + Math.sin(offsetAngle) * 1.4;
      const z = activeSiteCoordinates.z + (index % 3) * 0.5;
      
      const charge = symbol === 'O' ? -0.45 : symbol === 'N' ? -0.32 : symbol === 'H' ? 0.18 : 0.05;

      return {
        symbol,
        coordinates: { x, y, z },
        charge,
      };
    });

    // Binding energy (kcal/mol). Stronger binding = lower negative affinity score
    const bindingAffinity = -5.8 - (lLen * 0.42) - (pLen % 4) * 0.35 + (Math.random() * 0.3);
    const hydrogenBonds = Math.max(1, Math.min(6, Math.floor(lLen / 2) + (pLen % 2)));
    const confidence = Math.min(98.8, 75.2 + (hydrogenBonds * 3.5) + (Math.random() * 2));

    return {
      protein,
      ligand,
      bindingAffinity,
      activeSiteCoordinates,
      ligandAtoms,
      hydrogenBonds,
      confidence,
    };
  }
}
export default MolecularDockingEngine;
