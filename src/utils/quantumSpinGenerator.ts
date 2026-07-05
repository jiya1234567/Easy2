import { StateTensor } from '../types';

// Quantum spin states (up=1, down=-1)
export type SpinState = 1 | -1;

// Generate a random 2D spin lattice
export const generateSpinLattice = (size: number = 32): SpinState[][] => {
  const lattice: SpinState[][] = [];
  for (let i = 0; i < size; i++) {
    lattice[i] = [];
    for (let j = 0; j < size; j++) {
      lattice[i][j] = Math.random() > 0.5 ? 1 : -1;
    }
  }
  return lattice;
};

// Convert spin lattice to StateTensor
export const spinLatticeToStateTensor = (lattice: SpinState[][], temperature: number, energy: number): StateTensor => {
  const size = lattice.length;
  const features: Record<string, number> = {
    temperature,
    energy,
    magnetization: calculateMagnetization(lattice),
  };

  return {
    spatial: { x: size, y: size, z: 1 }, // 2D lattice
    temporal: { t: Date.now(), dt: 1 },
    features,
  };
};

// Calculate total magnetization of the lattice
export const calculateMagnetization = (lattice: SpinState[][]): number => {
  const size = lattice.length;
  let totalSpin = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      totalSpin += lattice[i][j];
    }
  }
  return totalSpin / (size * size);
};

// Calculate energy of the lattice (Ising model)
export const calculateEnergy = (lattice: SpinState[][]): number => {
  const size = lattice.length;
  let energy = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const spin = lattice[i][j];
      // Periodic boundary conditions
      const right = lattice[i][(j + 1) % size];
      const bottom = lattice[(i + 1) % size][j];
      energy -= spin * (right + bottom);
    }
  }
  return energy;
};

// Run a single sweep of the Metropolis-Hastings algorithm for Monte Carlo simulation
export const runMonteCarloSweep = (
  lattice: SpinState[][],
  temperature: number
): { lattice: SpinState[][]; energy: number } => {
  const size = lattice.length;
  const newLattice = lattice.map(row => [...row]);

  // J is coupling constant, assumed = 1.0 (ferromagnetic)
  // kB is Boltzmann constant, assumed = 1.0
  const beta = 1.0 / Math.max(0.01, temperature);

  for (let sweep = 0; sweep < size * size; sweep++) {
    // Pick random site
    const i = Math.floor(Math.random() * size);
    const j = Math.floor(Math.random() * size);

    const spin = newLattice[i][j];

    // Nearest neighbors with periodic boundaries
    const right = newLattice[i][(j + 1) % size];
    const left = newLattice[i][(j - 1 + size) % size];
    const bottom = newLattice[(i + 1) % size][j];
    const top = newLattice[(i - 1 + size) % size][j];

    // Change in energy if spin was flipped
    const deltaE = 2 * spin * (right + left + bottom + top);

    if (deltaE <= 0 || Math.random() < Math.exp(-deltaE * beta)) {
      newLattice[i][j] = -spin as SpinState;
    }
  }

  const energy = calculateEnergy(newLattice);
  return { lattice: newLattice, energy };
};

// Generate a policy for quantum spin optimization
export const generateSpinPolicy = (lattice: SpinState[][], energy: number) => {
  return {
    id: `spin-policy-${Date.now()}`,
    title: `Quantum Spin Optimization (E=${energy.toFixed(1)})`,
    description: `Minimizing quantum spin lattice energy (Ising spin glass approximation). Current magnetization is ${calculateMagnetization(lattice).toFixed(3)}.`,
    coordinates: { x: 250, y: 200 },
    votes: { up: 1, down: 0, neutral: 0 },
    comments: [
      {
        author: "Omega-Core Quantum Agent",
        text: `Lattice energy successfully mapped to StateTensor with E=${energy}. Ground state stabilization active.`,
        role: "Quantum AI System",
        timestamp: Date.now()
      }
    ],
    simulationData: {
      predictions: [
        `Magnetization will stabilize near ${calculateMagnetization(lattice) > 0 ? '+' : ''}${calculateMagnetization(lattice).toFixed(2)}`,
        `Phase transition expected if temperature rises above Tc ~ 2.27.`
      ],
      stateTensor: spinLatticeToStateTensor(lattice, 1.0, energy)
    },
    createdAt: Date.now()
  };
};
