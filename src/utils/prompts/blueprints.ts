// src/utils/prompts/blueprints.ts

export const DOMAIN_BLUEPRINTS: Record<string, string> = {
  economics: `
    You are a macroeconomic analyst. Use the following known causal structures:
    - Oil Prices → Freight Costs → Inflation
    - Interest Rates → Investment → GDP Growth
    - Unemployment → Consumer Spending → GDP Growth
    - Currency Exchange Rates → Exports/Imports → Trade Balance
    - Fiscal Policy (Govt Spending/Taxes) → Aggregate Demand → GDP Growth
    - Monetary Policy (Interest Rates) → Money Supply → Inflation
    - Productivity → Wages → Inflation
    - Supply Shocks (e.g., Pandemics, Wars) → Supply Chain Disruptions → Inflation
    - Demand Shocks (e.g., Stimulus, Recessions) → Aggregate Demand → GDP Growth
    - Inflation Expectations → Wage-Price Spiral → Inflation
    - Labor Market Tightness → Wages → Inflation
    - Housing Market → Wealth Effect → Consumer Spending
    - Stock Market → Wealth Effect → Consumer Spending
    - Global Trade → Commodity Prices → Inflation
    - Technological Progress → Productivity → GDP Growth
    - Education/Training → Human Capital → Productivity
    - Income Inequality → Social Unrest → Economic Instability
    - Climate Change → Agricultural Yields → Food Prices → Inflation
    - Geopolitical Risks → Supply Chain Disruptions → Inflation
    - Demographic Changes → Labor Force → GDP Growth
    - Government Debt → Interest Rates → Crowding Out → Private Investment
    - Financial Market Volatility → Investment Uncertainty → GDP Growth
  `,
  quantum: `
    You are a quantum physicist. Use the following known causal structures:
    - Temperature → Energy → Magnetization (Ising Model)
    - External Field → Spin Alignment → Magnetization
    - Spin-Spin Interaction (J) → Energy → Phase Transition
    - Lattice Size → Critical Temperature (Tₛ) → Phase Transition
    - Monte Carlo Steps → Convergence → Ground State Energy
    - Quantum Fluctuations → Entanglement → Superposition
    - Measurement → Wavefunction Collapse → Classical State
    - Decoherence → Loss of Quantum Coherence → Classical Behavior
    - Topological Defects → Phase Transitions → Symmetry Breaking
    - Quantum Tunneling → Barrier Penetration → Reaction Rates
    - Superconductivity → Zero Resistance → Magnetic Field Expulsion (Meissner Effect)
    - Bose-Einstein Condensate → Macroscopic Quantum State → Coherence
    - Quantum Entanglement → Non-Local Correlations → Bell Inequality Violation
    - Quantum Computing → Qubit Operations → Algorithmic Speedup
  `,
  weather: `
    You are a climate scientist. Use the following known causal structures:
    - Temperature → Humidity → Precipitation
    - Wind Speed/Direction → Storm Trajectory → Impact
    - Atmospheric Pressure → Wind Patterns → Weather Systems
    - Ocean Currents → Temperature Distribution → Climate
    - Solar Radiation → Surface Temperature → Evaporation
    - Greenhouse Gas Concentrations → Radiative Forcing → Global Warming
    - Cloud Cover → Albedo → Surface Temperature
    - El Niño/La Niña → Ocean Temperatures → Global Weather Patterns
    - Jet Stream → Storm Tracks → Weather Events
    - Sea Surface Temperature → Hurricane Intensity → Damage
    - Deforestation → Carbon Cycle → Climate Change
    - Urban Heat Island Effect → Local Temperature → Energy Demand
    - Aerosols → Radiative Forcing → Climate
    - Volcanic Eruptions → Sulfate Aerosols → Global Cooling
    - Ice-Albedo Feedback → Temperature → Ice Melt → More Warming
  `,
  education: `
    You are an education researcher. Use the following known causal structures:
    - Teacher Industry Experience → Curriculum Relevance → Student Engagement → Outcomes
    - Teaching Method → Student Engagement → Outcomes
    - Class Size → Student-Teacher Interaction → Outcomes
    - Student Motivation → Engagement → Outcomes
    - Parental Involvement → Student Motivation → Outcomes
    - School Resources → Teaching Quality → Outcomes
    - Teacher Training → Teaching Quality → Outcomes
    - Standardized Testing → Teaching to the Test → Engagement
    - Socioeconomic Status → School Resources → Outcomes
    - Technology in Classroom → Engagement → Outcomes
    - Extracurricular Activities → Student Motivation → Outcomes
    - Peer Effects → Student Motivation → Outcomes
    - School Leadership → Teacher Morale → Teaching Quality → Outcomes
    - Curriculum Design → Student Engagement → Outcomes
    - Professional Development → Teaching Quality → Outcomes
  `,
  materials: `
    You are a materials scientist. Use the following known causal structures:
    - Temperature → Atomic Vibrations → Thermal Expansion
    - Pressure → Atomic Spacing → Phase Transitions
    - Composition → Microstructure → Mechanical Properties
    - Defects → Strength → Material Failure
    - Grain Size → Strength → Hardness (Hall-Petch Effect)
    - Heat Treatment → Microstructure → Properties
    - Stress → Strain → Deformation
    - Corrosion → Material Degradation → Failure
    - Diffusion → Atomic Migration → Phase Separation
    - Crystal Structure → Electronic Properties → Conductivity
    - Alloying Elements → Microstructure → Properties
    - Processing Conditions → Microstructure → Properties
    - Fatigue → Crack Propagation → Material Failure
    - Creep → Deformation → Material Failure
    - Fracture Toughness → Crack Resistance → Material Reliability
  `,
  biology: `
    You are a biologist. Use the following known causal structures:
    - Gene Expression → Protein Synthesis → Cellular Function
    - Protein-Protein Interactions → Signal Transduction → Cell Behavior
    - Metabolic Pathways → Energy Production → Cell Survival
    - DNA Methylation → Gene Regulation → Phenotype
    - CRISPR/Cas9 → Gene Editing → Phenotypic Changes
    - Drug-Protein Interaction → Binding Affinity → Therapeutic Efficacy
    - Pathogen → Immune Response → Disease Outcome
    - Microbiome → Metabolism → Health
    - Epigenetics → Gene Regulation → Development
    - Cell Cycle → Proliferation → Tissue Growth
    - Apoptosis → Cell Death → Tissue Homeostasis
    - Neural Networks → Signal Processing → Behavior
    - Hormonal Signaling → Physiological Response → Homeostasis
    - Evolutionary Pressure → Natural Selection → Adaptation
  `,
};

// Default blueprint (fallback)
export const DEFAULT_BLUEPRINT = `
  You are a scientist. Use structured reasoning to analyze the data.
  Consider causal relationships, temporal dynamics, and domain-specific constraints.
`;
