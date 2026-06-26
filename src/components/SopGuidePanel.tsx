import React, { useState } from 'react';
import { 
  BookOpen, Search, Copy, Check, Terminal, Play, HelpCircle, ArrowRight,
  Wind, DollarSign, Activity, Eye, Cpu, Layers, Radio, Dna, TrendingUp, Film,
  Shield, Scissors, Flame, RotateCcw, Award, Heart, ShieldAlert, Cpu as Brain, HardDrive, Settings
} from 'lucide-react';

interface DomainSop {
  id: string;
  name: string;
  sopCode: string;
  category: 'Life Sciences' | 'Physical Systems' | 'Macro Economics' | 'Robotics & Hardware';
  icon: any;
  summary: string;
  steps: string[];
  parameters: { name: string; value: string; desc: string }[];
  blueprintPrompt: string;
  standardRef: string;
}

export default function SopGuidePanel({ 
  onLogEvent, 
  onLoadHarnessPrompt 
}: { 
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction') => void;
  onLoadHarnessPrompt: (prompt: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'Life Sciences' | 'Physical Systems' | 'Macro Economics' | 'Robotics & Hardware'>('all');
  const [selectedDomainId, setSelectedDomainId] = useState('biopsy');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({});

  const domains: DomainSop[] = [
    {
      id: 'weather',
      name: 'Weather',
      sopCode: 'SOP-WX-102',
      category: 'Physical Systems',
      icon: Wind,
      summary: 'Atmospheric fluid dynamics, boundary thermal gradients, and satellite-guided convective cyclogenesis modeling. Includes multi-modal EO data ingestion (Optical, Infrared, SAR, DEM) to simulate severe storm propagation.',
      steps: [
        'Ingest multi-modal sensor streams: Optical RGB, Infrared Convection, and Synthetic Aperture Radar (SAR) channels',
        'Configure the geostationary temporal horizon window from baseline T0 down to T5 prediction bands',
        'Inject sensor degradation challenges (e.g., cloud obscuration, GPS satellite drift, or geostationary outage)',
        'Deploy targeted self-healing algorithms (temporal spline interpolations, SAR penetrative backups, and transponder hot-swaps)'
      ],
      parameters: [
        { name: 'Model ACC Target', value: '0.962', desc: 'Anomaly Correlation Coefficient threshold for severe weather systems' },
        { name: 'Root Mean Square Error', value: '1.84 hPa', desc: 'Standard target for L2 spatial pressure field deviation' },
        { name: 'CRPS Performance', value: '0.341', desc: 'Target probabilistic accuracy for spatial prediction vectors' }
      ],
      blueprintPrompt: 'Initialize OMEGA Scientific Severe Convection Cyclone model. Set temporal horizon to T+5h, simulate sudden convective cloud obscuration, deploy multi-modal SAR backups for structural penetration, and verify predictive ACC scores exceed 0.95.',
      standardRef: 'WMO-No. 544 (Manual on Global Data-Processing and Forecasting Systems)'
    },
    {
      id: 'finance',
      name: 'Finance',
      sopCode: 'SOP-FIN-204',
      category: 'Macro Economics',
      icon: DollarSign,
      summary: 'Stochastic portfolio optimization and dynamic market drift modeling under black-swan counterfactual shocks. Analyzes multi-factor liquidity constraints and arbitrage stability.',
      steps: [
        'Import historical asset covariance matrices and log-return volatility indexes',
        'Apply the dual-pathway drift correction filter to discount simulated noise',
        'Inject a synthetic risk-factor rate shock (e.g., +250bps central bank baseline shift)',
        'Synthesize Monte Carlo risk curves to establish the 99% Value-at-Risk (VaR) margin'
      ],
      parameters: [
        { name: 'Volatility Index', value: 'VIX 24.5', desc: 'Implied variance factor of assets' },
        { name: 'Drift Rate (μ)', value: '0.045 / annum', desc: 'Expected return drift constant' },
        { name: 'VaR Confidence', value: '99.0%', desc: 'Tail risk confidence boundary' }
      ],
      blueprintPrompt: 'Model dynamic asset allocation drift under sudden central bank interest rate hikes (+150bps). Run risk sensitivity sweeps across fixed income and equities portfolios, estimating liquidity drawdown bounds.',
      standardRef: 'Basel III Regulatory Capital Accord Framework'
    },
    {
      id: 'biopsy',
      name: 'Biopsy',
      sopCode: 'SOP-BIO-301',
      category: 'Life Sciences',
      icon: Activity,
      summary: 'Multi-modal histopathological cancer biopsy analysis. Combines H&E nuclear staining and IHC Ki67 cell proliferation metrics to classify cellular density and margin boundaries.',
      steps: [
        'Map high-resolution biopsy coordinate patches across stain channels (H&E and IHC-Ki67)',
        'Run cell nuclei segmentations to isolate mitotic division indices in active hot spots',
        'Identify tissue margin borders to measure stromal-epithelial tumor purity levels',
        'Compile the somatic gene expression heatmap overlay for spatial validation'
      ],
      parameters: [
        { name: 'Ki67 Proliferation Index', value: '42.3%', desc: 'Active tumor cell growth percentage' },
        { name: 'Tumor Purity Metric', value: '72.0%', desc: 'Proportion of neoplastic cell density' },
        { name: 'Necrosis Density', value: '18.7%', desc: 'Percentage of dead tissue inside core' }
      ],
      blueprintPrompt: 'Synthesize biopsy mapping of colon adenocarcinoma H&E slides. Align with IHC-Ki67 cellular staining matrices, calculate the average mitotic index per high-power field, and detect micro-metastatic borders.',
      standardRef: 'College of American Pathologists (CAP) Cancer Protocols'
    },
    {
      id: 'retina',
      name: 'Retina',
      sopCode: 'SOP-RET-312',
      category: 'Life Sciences',
      icon: Eye,
      summary: 'Optoelectronic vascular mapping and micro-aneurysm segmentation across retinal optical coherence tomography (OCT) layers. Identifies progressive diabetic retinopathy markers.',
      steps: [
        'Isolate inner nuclear and photoreceptor outer segment layer boundaries in OCT b-scans',
        'Apply high-pass vascular filtering to map capillary density and foveal avascular zones',
        'Detect micro-aneurysms using morphological circularity and local intensity thresholds',
        'Overlay longitudinal progression maps to detect fluid accumulation pockets'
      ],
      parameters: [
        { name: 'FAZ Area', value: '0.28 mm²', desc: 'Foveal avascular zone pixel footprint' },
        { name: 'Retinal Thickness', value: '245 μm', desc: 'Average macular thickness score' },
        { name: 'Vessel Density', value: '38.4%', desc: 'Micro-capillary spatial coverage' }
      ],
      blueprintPrompt: 'Execute retinal vascular layer segmentation on OCT angiography scans. Map vessel density fluctuations, isolate micro-aneurysm focal points, and measure changes in the foveal avascular zone area.',
      standardRef: 'ETDRS (Early Treatment Diabetic Retinopathy Study) Guidelines'
    },
    {
      id: 'quantum',
      name: 'Quantum',
      sopCode: 'SOP-QTM-401',
      category: 'Physical Systems',
      icon: Cpu,
      summary: 'Multi-qubit register coherence calibration and cryo-quench mitigation under environmental noise. Optimizes quantum gate fidelities and error-correcting thresholds.',
      steps: [
        'Measure baseline qubit relaxation (T1) and dephasing (T2) times across 128-qubit registers',
        'Run randomized benchmarking sweeps to isolate systematic single-qubit gate errors',
        'Inject a cryogenic thermal perturbation (quench event) to test superconducting stability',
        'Compile stabilizer measurement outcomes to construct the error-correction surface'
      ],
      parameters: [
        { name: 'Gate Fidelity', value: '99.92%', desc: 'Average randomized benchmark fidelity' },
        { name: 'Relaxation Time (T1)', value: '120 μs', desc: 'Average excited state decay duration' },
        { name: 'Cryogenic Temp', value: '12 mK', desc: 'Operational dilution refrigerator temperature' }
      ],
      blueprintPrompt: 'Simulate a 128-qubit quantum register. Inject a localized thermal drift of +5mK to induce dephasing, benchmark randomized gate fidelity drops, and generate correction maps using Surface-17 stabilizer codes.',
      standardRef: 'IEEE P1913 - Software-Defined Quantum Communication Framework'
    },
    {
      id: 'semiconductor',
      name: 'Semiconductor',
      sopCode: 'SOP-SEMI-505',
      category: 'Physical Systems',
      icon: Layers,
      summary: 'EUV lithography line-edge roughness (LER) defect detection and localized wafer thermal dissipation analysis. Assesses transistor pitch fidelity down to 2nm bounds.',
      steps: [
        'Model the extreme ultraviolet light exposure field across the multi-layer silicon mask',
        'Detect critical dimension offsets and line-edge roughness on the printed photoresist',
        'Simulate localized Joule heating under active 5.0 GHz clock cycles across gate layouts',
        'Verify thermal dissipation bottlenecks near high-density 3D TSV vertical pillars'
      ],
      parameters: [
        { name: 'Line Roughness (LER)', value: '1.2 nm', desc: 'Standard deviation of printed line margins' },
        { name: 'Gate Pitch Width', value: '18 nm', desc: 'Nominal physical transistor spacing limit' },
        { name: 'Power Density', value: '120 W/cm²', desc: 'Localized thermal heat dissipation load' }
      ],
      blueprintPrompt: 'Evaluate extreme ultraviolet lithography mask margins at 2nm. Model line-edge roughness perturbations under fluctuating dose levels, and simulate thermal dissipation parameters for high-density FinFET layouts.',
      standardRef: 'SEMI F20-0706 (Standard for Semiconductor Processing Components)'
    },
    {
      id: 'satellite',
      name: 'Satellite',
      sopCode: 'SOP-SAT-211',
      category: 'Physical Systems',
      icon: Radio,
      summary: 'Geostationary and low earth orbit (LEO) synthetic aperture radar (SAR) calibration under physical telemetry degradation. Leverages cognitive tasks for atmospheric hazard detection.',
      steps: [
        'Map active orbit profiles and lock onto geostationary transponders for multi-spectral sensor retrieval',
        'Select the target cognitive task: Scene Classification, Semantic Segmentation, Change Detection, or Object Detection',
        'Analyze real-time sensor streams under high-moisture convective gradients or wildfire fronts',
        'Calibrate continuous predictive reliability against verified ground-truth physical observation matrices'
      ],
      parameters: [
        { name: 'Sensor Confidence', value: '99.4% Nominal', desc: 'Baseline satellite-to-earth transponder signal coherence' },
        { name: 'Telemetry Error', value: '< 1.22 hPa MAE', desc: 'Acceptable deviation limit for geostationary spatial grids' },
        { name: 'Recovery Speed', value: '< 150 ms', desc: 'Asynchronous buffer flush and Doppler-beacon realignment latency' }
      ],
      blueprintPrompt: 'Establish a secure geostationary link with GOES-18. Enable Semantic Segmentation cognitive routing to map coastal supercell line parameters, trigger corrupted telemetry stressors, and apply Reed-Solomon ECC validation filters.',
      standardRef: 'CCSDS 131.0-B-3 (Consultative Committee for Space Data Systems)'
    },
    {
      id: 'genomics',
      name: 'Genomics',
      sopCode: 'SOP-GEN-104',
      category: 'Life Sciences',
      icon: Dna,
      summary: 'CRISPR-Cas9 target sequence alignment and somatic genomic drift modeling. Predicts off-target cleavage probabilities and cell-line lineage mutations.',
      steps: [
        'Ingest genomic sequence strings and execute dynamic programming matching routines',
        'Calculate binding energies and mismatched base tolerances to predict cleavage locations',
        'Model phylogenetic cell-line replication drift across 100 consecutive generations',
        'Isolate expression shifts in metabolic pathways using RNA-seq transcript counts'
      ],
      parameters: [
        { name: 'Off-Target Probability', value: '0.014%', desc: 'Likelihood of secondary cleavage events' },
        { name: 'Sequence Alignment Score', value: '98.6%', desc: 'Matching accuracy to template sequence' },
        { name: 'Genomic Drift Rate', value: '1.2e-8 / bp', desc: 'Mutation accumulation pace per cell division' }
      ],
      blueprintPrompt: 'Map CRISPR target sequences to find potential off-target cleavage zones. Estimate thermodynamic mismatch energies at non-homologous sites and plot cell-line mutational drift over 50 cellular generations.',
      standardRef: 'NCBI Genomic Reference Assembly Standard GRCh38'
    },
    {
      id: 'economic',
      name: 'Economic',
      sopCode: 'SOP-ECON-109',
      category: 'Macro Economics',
      icon: TrendingUp,
      summary: 'Multi-agent supply chain friction modeling and consumer sentiment feedback loops. Simulates micro-economic price discovery curves under sudden resource embargoes.',
      steps: [
        'Define consumption elasticity variables and agent marginal utilities',
        'Introduce a supply-chain freight capacity restriction at global transit chokepoints',
        'Trace price-clearing dynamics across raw materials and finished goods sectors',
        'Estimate systemic inflation drift and central bank interest rate policy offsets'
      ],
      parameters: [
        { name: 'Embargo Friction Factor', value: '1.45x', desc: 'Freight delay multiplier on transit lines' },
        { name: 'Friction Elasticity', value: '-0.35', desc: 'Demand drop sensitivity per unit price spike' },
        { name: 'Producer Price Index', value: '108.4', desc: 'Relative supplier wholesale cost baseline' }
      ],
      blueprintPrompt: 'Construct a multi-agent microeconomic system modeling severe shipping route friction. Run simulations on retail price discovery patterns, consumer purchasing elasticity, and baseline producer inflation.',
      standardRef: 'NBER Macroeconomics Annual Research Standards'
    },
    {
      id: 'video',
      name: 'Video',
      sopCode: 'SOP-VID-550',
      category: 'Physical Systems',
      icon: Film,
      summary: 'Temporal consistency modeling in video-diffusion engines. Prevents optical flow artifacts and flickering in generative frame transitions under spatial motion vectors.',
      steps: [
        'Calculate dense optical flow vectors between consecutive video frames',
        'Establish multi-frame cross-attention guidance grids across latents',
        'Measure structural similarity indexes (SSIM) to flag temporal jitter boundaries',
        'Optimize diffusion noise schedules to preserve static background assets'
      ],
      parameters: [
        { name: 'Temporal Consistency Score', value: '94.2%', desc: 'Frame-to-frame pixel layout continuity' },
        { name: 'Motion Vector Magnitude', value: '4.5 px/f', desc: 'Average velocity of active objects' },
        { name: 'SSIM Macular Bound', value: '0.88', desc: 'Minimum acceptable visual similarity factor' }
      ],
      blueprintPrompt: 'Optimize a generative video-diffusion sequence for high temporal consistency. Segment fast optical flow regions (5.0 px/frame), suppress noise variance, and evaluate SSIM indices across 60 frames.',
      standardRef: 'SMPTE ST 2067 (Interoperable Master Format Standards)'
    },
    {
      id: 'meddevices',
      name: 'Medical Devices',
      sopCode: 'SOP-MED-702',
      category: 'Robotics & Hardware',
      icon: Shield,
      summary: 'FDA pre-market testing of implantable medical devices. Verifies electromagnetic compatibility (EMC), wireless sensor telemetry, and thermal heating bounds.',
      steps: [
        'Simulate magnetic resonance imaging (MRI) RF exposure on pacemaker metal leads',
        'Measure wireless Bluetooth Low Energy (BLE) antenna packet drop rates in dense environments',
        'Verify battery discharge heat thresholds (temperature must remain below 39°C baseline)',
        'Generate compliance data structures for pre-market notification submissions'
      ],
      parameters: [
        { name: 'MRI RF Heating', value: '+1.4 °C', desc: 'Maximum induced lead temperature increase' },
        { name: 'BLE Signal Loss', value: '0.012%', desc: 'Wireless telemetry connection error rate' },
        { name: 'Battery Lifetime', value: '8.4 yr', desc: 'Estimated low-power standby battery duration' }
      ],
      blueprintPrompt: 'Simulate high-power electromagnetic RF exposure on metallic orthopedic implant leads. Calculate localized heating curves, trace battery standby dissipation rates, and verify telemetry retention rates.',
      standardRef: 'FDA Quality System Regulation (QSR) 21 CFR Part 820'
    },
    {
      id: 'surgery',
      name: 'Surgery',
      sopCode: 'SOP-SURG-805',
      category: 'Robotics & Hardware',
      icon: Scissors,
      summary: 'Robotic surgical assistant kinematic trajectory planning and dynamic collision avoidance. Calibrates end-effector forces under soft-tissue displacement models.',
      steps: [
        'Load surgical instrument mechanical link models and joint angular limits',
        'Calculate forward and inverse kinematics profiles for micro-incision tracking',
        'Implement sub-millimeter virtual walls to prevent accidental tissue puncture events',
        'Run adaptive force-feedback compensation to adjust tool grip during tissue retraction'
      ],
      parameters: [
        { name: 'Kinematic Error', value: '0.12 mm', desc: 'Average robotic arm position deviation' },
        { name: 'Force Feedback', value: '1.4 N', desc: 'Tactile resistance threshold on soft organs' },
        { name: 'Response Latency', value: '1.2 ms', desc: 'Actuator control loop delay' }
      ],
      blueprintPrompt: 'Plan real-time surgical robot kinematics paths for laparoscopic suture tracking. Define Inverse Kinematics targets, deploy sub-millimeter obstacle safety boundaries, and tune actuator response latency.',
      standardRef: 'ISO 13485 (Medical Devices Quality Management Systems)'
    },
    {
      id: 'cancer',
      name: 'Cancer',
      sopCode: 'SOP-CANC-303',
      category: 'Life Sciences',
      icon: Flame,
      summary: 'Dynamic tumor progression and microenvironment modeling. Simulates vascular angiogenesis triggers, hypoxia zones, and chemotherapy drug perfusion.',
      steps: [
        'Model neoplastic cell division kinetics and oxygen diffusion throughout the tumor mass',
        'Inject vascular endothelial growth factors (VEGF) to trigger vascular angiogenesis',
        'Simulate localized cytotoxic drug diffusion coefficients through dense necrotic tissue',
        'Predict cellular resistance rates based on epigenetic drug evasion probability models'
      ],
      parameters: [
        { name: 'Mitotic Speed', value: '1.1 divisions/day', desc: 'Pace of tumor cell replication cycles' },
        { name: 'Angiogenesis Rate', value: '1.45x', desc: 'Vascular development speed multiplier' },
        { name: 'Chemo Perfusion Ratio', value: '38.4%', desc: 'Volume of tumor tissue reached by drug therapy' }
      ],
      blueprintPrompt: 'Simulate progressive tumor tissue growth. Map oxygen starvation hypoxia zones, inject chemotherapy perfusion parameters with a 0.35 diffusion factor, and predict tumor mass shrinkage.',
      standardRef: 'NCI Quantitative Imaging Network (QIN) Standards'
    },
    {
      id: 'regenmed',
      name: 'Regenerative Medicine',
      sopCode: 'SOP-REGEN-402',
      category: 'Life Sciences',
      icon: Heart,
      summary: 'Mesenchymal stem cell differentiation and biomimetic scaffold layout optimization. Models cellular adhesion rates under mechanical shear stress.',
      steps: [
        'Construct 3D porous polymer scaffold geometries with optimal cell seeding pore sizes',
        'Simulate dynamic nutrient perfusion fluid shear stress across scaffolding pores',
        'Calculate growth factor concentration gradients to direct stem cell lineage targets',
        'Measure extracellular matrix deposition density to track neo-tissue maturity rates'
      ],
      parameters: [
        { name: 'Scaffold Porosity', value: '82.0%', desc: 'Scaffold structural open-space ratio' },
        { name: 'Shear Stress Index', value: '0.04 Pa', desc: 'Perfusion flow force acting on stem cell walls' },
        { name: 'Differentiation Speed', value: '14 days', desc: 'Time taken to reach tissue lineage targets' }
      ],
      blueprintPrompt: 'Optimize cell-seeding layouts on biomimetic scaffolds. Calculate nutrient-rich fluid shear stress vectors, map growth factor gradients, and simulate stem cell proliferation over 14 days.',
      standardRef: 'ASTM F3106 - Standard Guide for Implantable Tissue Scaffolds'
    },
    {
      id: 'implants',
      name: 'Implants',
      sopCode: 'SOP-IMP-850',
      category: 'Robotics & Hardware',
      icon: HardDrive,
      summary: 'Finite element stress testing of orthopedic implants. Evaluates osseointegration mechanical loads, titanium pore density, and micro-motion interfaces.',
      steps: [
        'Import 3D CAD meshes of orthopedic titanium implants and surrounding bone geometries',
        'Apply cyclic mechanical gait loads (equal to 3x standard body weight force)',
        'Calculate micro-motion friction coefficients along bone-implant contact interfaces',
        'Design 3D-printed trabecular titanium pore sizes to maximize osteoblast cell growth'
      ],
      parameters: [
        { name: 'Interfacial Motion', value: '12.4 μm', desc: 'Micro-sliding distance during peak walking gait' },
        { name: 'Tensile Strength Limit', value: '850 MPa', desc: 'Titanium alloy mechanical yield boundary' },
        { name: 'Osseointegration Ratio', value: '64.5%', desc: 'Percentage of implant surface fused to raw bone' }
      ],
      blueprintPrompt: 'Evaluate titanium hip stem mechanical stress profiles under gait cycles. Model contact interface micro-motion values (μm), analyze tensile stress limits, and optimize porous osseointegration matrices.',
      standardRef: 'ISO 7206-4 (Implants for Surgery - Partial and Total Hip Joint Prostheses)'
    },
    {
      id: 'brain',
      name: 'Brain Imaging',
      sopCode: 'SOP-NEUR-308',
      category: 'Life Sciences',
      icon: Brain,
      summary: 'Multi-voxel fMRI blood-oxygenation level-dependent (BOLD) pathway tracing. Computes functional connectivity matrices and identifies neural circuit anomalies.',
      steps: [
        'Preprocess fMRI raw volumes to correct for head movement and slice timing skew',
        'Extract blood-oxygenation level-dependent (BOLD) time courses from individual voxels',
        'Compute pairwise correlation matrices across 180 distinct brain region nodes',
        'Trace diffusion tensor tractography vectors to locate structural white-matter paths'
      ],
      parameters: [
        { name: 'BOLD Signal Drift', value: '1.2%', desc: 'Percentage signal change during motor actions' },
        { name: 'Voxel Resolution', value: '2.0 mm³', desc: 'Spatial resolution of high-field fMRI scans' },
        { name: 'Connectivity Threshold', value: 'r = 0.45', desc: 'Minimum correlation for regional network paths' }
      ],
      blueprintPrompt: 'Process fMRI blood-oxygen level-dependent (BOLD) time courses. Construct a functional connectivity matrix across cortical regions and map structural pathways using fractional anisotropy values.',
      standardRef: 'BIDS (Brain Imaging Data Structure) Metadata Standard'
    },
    {
      id: 'biomaterials',
      name: 'Biomaterials',
      sopCode: 'SOP-MAT-601',
      category: 'Physical Systems',
      icon: Award,
      summary: 'Biodegradable polymer degradation modeling. Simulates mechanical tensile strength decay profiles under variable pH and temperature settings.',
      steps: [
        'Define chemical composition and cross-linking densities of copolymer matrices',
        'Simulate water hydrolysis diffusion rates into the core polymer structure',
        'Track ester bond cleavage kinetics to estimate mechanical mass loss velocity',
        'Plot polymer tensile strength decay curves to match bone healing rates'
      ],
      parameters: [
        { name: 'Hydrolysis Rate', value: '0.012 day^-1', desc: 'Speed of polymer water absorption degradation' },
        { name: 'Initial Tensile Modulus', value: '3.2 GPa', desc: 'Starting polymer structural rigidity score' },
        { name: 'Acidic pH Offset', value: '6.4 pH', desc: 'Inflammatory localized pH drop factor' }
      ],
      blueprintPrompt: 'Model biodegradable PLGA copolymer hydrolysis degradation profiles. Simulate water penetration speed, calculate ester cleavage rates under mild inflammation (pH 6.4), and plot structural tensile strength decline.',
      standardRef: 'ISO 10993-9 (Biological Evaluation of Medical Devices Degradation)'
    },
    {
      id: 'robotics',
      name: 'Robotics',
      sopCode: 'SOP-ROB-910',
      category: 'Robotics & Hardware',
      icon: Settings,
      summary: 'Dynamic kinematic actuator loops and PID controller tuning for autonomous logistics rovers. Evaluates motor feedback gains under variable payloads.',
      steps: [
        'Model robotics joint inertia matrices and motor torque limits',
        'Calibrate PID loop proportional (Kp), integral (Ki), and derivative (Kd) feedback gains',
        'Apply Kalman state filters to integrate lidar scans with motor wheel encoders',
        'Measure path-tracking accuracy while transporting fluctuating payload masses'
      ],
      parameters: [
        { name: 'Tracking Precision', value: '1.8 cm', desc: 'Average navigation path error distance' },
        { name: 'Feedback Control rate', value: '1.0 kHz', desc: 'Actuator motor command cycle rate' },
        { name: 'Kalman Drift Offset', value: '0.04 m/s', desc: 'Position estimate divergence rate' }
      ],
      blueprintPrompt: 'Tune high-frequency PID controller loops for a dual-drive robotics carrier. Simulate sudden payload mass additions (25kg), analyze wheel encoder tracking precision, and balance Kalman position filters.',
      standardRef: 'IEEE 1872-2015 (Standard Ontologies for Robotics and Automation)'
    }
  ];

  const filteredDomains = domains.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.sopCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.blueprintPrompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || d.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedDomain = domains.find(d => d.id === selectedDomainId) || domains[0];

  const handleCopyPreset = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onLogEvent(`Copied simulation blueprint prompt for domain [${id.toUpperCase()}] to clipboard`, 'interaction');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLoadToHarness = (prompt: string, id: string) => {
    onLoadHarnessPrompt(prompt);
    onLogEvent(`Loaded [${id.toUpperCase()}] SOP blueprint directly into Actuator Chat Console`, 'interaction');
  };

  const toggleStep = (domainId: string, index: number) => {
    const key = `${domainId}-${index}`;
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    onLogEvent(`Updated checklist progression for ${domainId.toUpperCase()} SOP (Step ${index + 1})`, 'info');
  };

  const resetChecklist = (domainId: string) => {
    const updated = { ...completedSteps };
    domains.find(d => d.id === domainId)?.steps.forEach((_, i) => {
      delete updated[`${domainId}-${i}`];
    });
    setCompletedSteps(updated);
    onLogEvent(`Reset operational checklist for domain: ${domainId.toUpperCase()}`, 'info');
  };

  const categories = ['all', 'Life Sciences', 'Physical Systems', 'Macro Economics', 'Robotics & Hardware'] as const;

  return (
    <div className="bg-[#FCFAF7] border-2 border-[#1A1A1A] p-6 shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] flex flex-col gap-6" id="sop-guide-dashboard">
      
      {/* Title & Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#1A1A1A] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-300">
              OMEGA MASTER FRAMEWORK
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A1A1A] font-serif uppercase mt-1">
            SOP PROTOCOLS & CHEAT SHEETS
          </h2>
          <p className="text-xs text-[#555555] font-serif italic mt-0.5">
            Standard Operating Procedures and physical constraint profiles across all 18 OMEGA simulation domains.
          </p>
        </div>
        
        {/* Quick Help Banner */}
        <div className="flex items-center gap-2 bg-[#EBE8E3] border border-[#1A1A1A]/30 p-2.5 max-w-sm">
          <HelpCircle className="w-4 h-4 text-neutral-700 shrink-0" />
          <span className="text-[10px] font-mono text-neutral-700 leading-tight">
            <strong>GLOBAL ACCESS:</strong> Select a process to view its standard checklist, telemetry metrics, and load direct prompt parameters into the actuator console.
          </span>
        </div>
      </div>

      {/* Grid Filter and Search Actions */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch justify-between">
        
        {/* Category Switches */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-[10px] font-mono font-bold tracking-tight transition cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white text-neutral-600 border-neutral-300 hover:text-black hover:border-neutral-500'
              }`}
            >
              {cat === 'all' ? 'ALL PROCESSES' : cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Real-time search engine */}
        <div className="relative flex items-center min-w-[280px]">
          <Search className="absolute left-3 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search 18 domains or codes (e.g. CAP, Basel)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs font-mono bg-white border-2 border-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-[10px] font-bold font-mono text-neutral-400 hover:text-black cursor-pointer"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Main Two-Column Guide Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Hand side: Domain List Switcher */}
        <div className="lg:col-span-4 flex flex-col border-2 border-[#1A1A1A] bg-white h-[480px] overflow-y-auto">
          <div className="bg-[#1A1A1A] text-white font-mono text-[9px] px-3 py-2 font-bold tracking-wider sticky top-0 flex items-center justify-between z-10">
            <span>INDEX: {filteredDomains.length} MATCHED DOMAINS</span>
            <span>DOM-V4.1</span>
          </div>

          <div className="divide-y divide-[#1A1A1A]">
            {filteredDomains.length > 0 ? (
              filteredDomains.map(d => {
                const Icon = d.icon;
                const isSelected = d.id === selectedDomainId;
                const totalSteps = d.steps.length;
                const doneSteps = d.steps.filter((_, i) => completedSteps[`${d.id}-${i}`]).length;
                
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDomainId(d.id)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition cursor-pointer relative ${
                      isSelected 
                        ? 'bg-emerald-50 border-l-4 border-l-emerald-600' 
                        : 'hover:bg-neutral-50'
                    }`}
                  >
                    <div className={`p-2 border border-[#1A1A1A] shrink-0 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-neutral-100 text-[#1A1A1A]'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-mono font-semibold text-neutral-500">{d.sopCode}</span>
                        <span className="text-[8px] font-mono text-neutral-400 font-bold uppercase">{d.category}</span>
                      </div>
                      <h4 className="font-bold text-xs font-sans text-neutral-900 mt-0.5 truncate uppercase">
                        {d.name}
                      </h4>
                      <p className="text-[10px] text-neutral-500 font-serif italic line-clamp-1 mt-0.5">
                        {d.summary}
                      </p>
                      
                      {/* Operational progress indicators */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 bg-neutral-100 border border-[#1A1A1A]/20">
                          <div 
                            className="h-full bg-emerald-600" 
                            style={{ width: `${(doneSteps / totalSteps) * 100}%` }}
                          />
                        </div>
                        <span className="text-[8px] font-mono font-bold text-neutral-600">
                          {doneSteps}/{totalSteps} STEPS
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <ArrowRight className="w-4 h-4 text-emerald-600" />
                      </div>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-neutral-500 italic text-xs font-serif bg-neutral-50">
                No matching OMEGA domains found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Right Hand side: SOP Content Details */}
        <div className="lg:col-span-8 flex flex-col border-2 border-[#1A1A1A] bg-[#FCFAF7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] overflow-hidden">
          
          {/* Active Header Block */}
          <div className="bg-[#1A1A1A] text-white p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-2 border-[#1A1A1A]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white border border-white/20">
                {React.createElement(selectedDomain.icon, { className: 'w-5 h-5' })}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
                    {selectedDomain.sopCode} • {selectedDomain.category}
                  </span>
                </div>
                <h3 className="text-lg font-black tracking-tight font-serif uppercase text-[#FCFAF7]">
                  {selectedDomain.name} Standard Operating Procedure
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-stretch sm:self-auto">
              <button
                onClick={() => resetChecklist(selectedDomain.id)}
                className="bg-neutral-800 hover:bg-neutral-700 text-[9px] text-white font-mono font-bold uppercase tracking-wider py-1 px-2 border border-neutral-700 cursor-pointer flex items-center gap-1"
                title="Reset steps checked progress"
              >
                <RotateCcw className="w-3 h-3" />
                <span>RESET CHECKLIST</span>
              </button>
            </div>
          </div>

          <div className="p-5 overflow-y-auto max-h-[420px] flex flex-col gap-5">
            
            {/* 1. Core Summary Block */}
            <div className="bg-white border border-[#1A1A1A] p-4 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
              <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 border-b border-[#1A1A1A]/10 pb-1 mb-2">
                01. Operational Process Scope
              </h5>
              <p className="text-xs text-neutral-800 font-serif leading-relaxed italic">
                "{selectedDomain.summary}"
              </p>
            </div>

            {/* 2. Parameters & Variables Table */}
            <div>
              <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-2.5 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                02. Standard Telemetry Variables & Physical Constraints
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedDomain.parameters.map((param, index) => (
                  <div key={index} className="bg-white border border-[#1A1A1A] p-3 flex flex-col gap-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-[9px] font-mono font-bold text-neutral-500 uppercase">{param.name}</span>
                    <span className="text-sm font-mono font-black text-emerald-700">{param.value}</span>
                    <span className="text-[9px] text-neutral-400 font-sans leading-tight mt-0.5">{param.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Steps Checklist */}
            <div className="bg-white border border-[#1A1A1A] p-4 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
              <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 border-b border-[#1A1A1A]/10 pb-1 mb-3">
                03. Step-by-Step Execution Sequence
              </h5>

              <div className="space-y-2.5">
                {selectedDomain.steps.map((step, index) => {
                  const stepKey = `${selectedDomain.id}-${index}`;
                  const isChecked = !!completedSteps[stepKey];
                  return (
                    <div 
                      key={index}
                      onClick={() => toggleStep(selectedDomain.id, index)}
                      className={`flex items-start gap-3 p-2.5 border transition cursor-pointer select-none ${
                        isChecked 
                          ? 'bg-emerald-50/50 border-emerald-500 text-neutral-500 line-through' 
                          : 'bg-[#FCFAF7] hover:bg-neutral-100 border-neutral-300'
                      }`}
                    >
                      <button
                        className={`w-4 h-4 rounded-none border shrink-0 flex items-center justify-center transition-all ${
                          isChecked 
                            ? 'bg-emerald-600 border-emerald-700 text-white' 
                            : 'bg-white border-[#1A1A1A]'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                      <div className="text-[11px] font-mono leading-tight flex-1">
                        <strong className="text-black mr-1">STEP {index + 1}:</strong> {step}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Actuator Blueprint Prompt Panel */}
            <div className="bg-[#1A1A1A] text-white p-4 border border-[#1A1A1A] flex flex-col gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  04. Actuator Blueprint Prompt
                </span>
                <span className="text-[8px] font-mono text-neutral-500">READY FOR SIMULATOR</span>
              </div>

              <div className="bg-black p-3 font-mono text-[11px] text-emerald-300 border border-neutral-800 leading-relaxed max-h-[80px] overflow-y-auto select-all rounded-sm">
                {selectedDomain.blueprintPrompt}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 mt-1">
                <span className="text-[8px] font-mono text-neutral-500 font-bold uppercase">
                  STD: <span className="text-neutral-400 italic font-sans font-normal">{selectedDomain.standardRef}</span>
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyPreset(selectedDomain.blueprintPrompt, selectedDomain.id)}
                    className="bg-neutral-800 hover:bg-neutral-700 text-[10px] text-white font-mono font-bold uppercase tracking-wider py-1 px-3 border border-neutral-700 cursor-pointer flex items-center gap-1 transition-colors"
                  >
                    {copiedId === selectedDomain.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>COPY PRESET</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleLoadToHarness(selectedDomain.blueprintPrompt, selectedDomain.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-[10px] text-white font-mono font-bold uppercase tracking-wider py-1 px-3 border border-emerald-800 cursor-pointer flex items-center gap-1 transition-colors shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                  >
                    <Play className="w-3 h-3 text-white" />
                    <span>LOAD TO HARNESS CHAT</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom regulatory reference strip */}
          <div className="bg-[#EBE8E3] border-t border-[#1A1A1A] p-2 px-4 flex items-center justify-between text-[9px] font-mono text-neutral-500 font-bold uppercase">
            <span>REFERENCE MATRIX: OMEGA-EVAL-V4</span>
            <span>SYSTEM CONSTRAINTS SECURE</span>
          </div>
        </div>

      </div>

    </div>
  );
}
