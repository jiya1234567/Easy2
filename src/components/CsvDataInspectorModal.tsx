import React, { useState } from 'react';
import { 
  FileSpreadsheet, X, Download, Check, Upload, RefreshCw, Zap, Eye, 
  Layers, ArrowRight, ShieldCheck, Activity, Cpu, Filter, Search
} from 'lucide-react';
import { 
  SYNCHRONIZED_TELEMETRY_DATA, 
  SYNCHRONIZED_POINTCLOUD_DATA, 
  SYNCHRONIZED_TACTILE_DATA,
  MASTER_EXPERIMENT_MANIFEST
} from './PhysicalAiWorldStatePipeline';

interface CsvDataInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'telemetry' | 'pointcloud' | 'gelsight' | 'manifest' | 'fused';
  onLogEvent?: (details: string, type: 'info' | 'physics' | 'interaction') => void;
  onSelectTimeMs?: (timeMs: number) => void;
  onOpenPipeline?: () => void;
}

export default function CsvDataInspectorModal({
  isOpen,
  onClose,
  initialTab = 'telemetry',
  onLogEvent,
  onSelectTimeMs,
  onOpenPipeline
}: CsvDataInspectorModalProps) {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'pointcloud' | 'gelsight' | 'manifest' | 'fused'>(initialTab);
  const [filterTime, setFilterTime] = useState<number | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [ingestStatus, setIngestStatus] = useState<string>('Ready • Synchronized (0 - 50ms)');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSimulateIngest = (datasetName: string) => {
    setIsProcessing(true);
    setIngestStatus(`Ingesting and parsing ${datasetName}...`);
    if (onLogEvent) {
      onLogEvent(`[DATA INGESTION] Reading and validating ${datasetName} stream. Parsing 200 Hz rows...`, 'physics');
    }

    setTimeout(() => {
      setIsProcessing(false);
      setIngestStatus(`✓ Successfully ingested and verified ${datasetName} (0-50ms synchronized @ 200 Hz).`);
      if (onLogEvent) {
        onLogEvent(`[DATA INGESTION] ${datasetName} synchronized with MuJoCo kinematics and 3D World State.`, 'physics');
      }
    }, 600);
  };

  const handleDownloadCsv = (type: string) => {
    let csvContent = '';
    let fileName = '';

    if (type === 'telemetry') {
      fileName = 'robot_telemetry.csv';
      const headers = Object.keys(SYNCHRONIZED_TELEMETRY_DATA[0]).join(',');
      const rows = SYNCHRONIZED_TELEMETRY_DATA.map(r => Object.values(r).join(',')).join('\n');
      csvContent = `${headers}\n${rows}`;
    } else if (type === 'pointcloud') {
      fileName = 'pointcloud_spatial.csv';
      const headers = Object.keys(SYNCHRONIZED_POINTCLOUD_DATA[0]).join(',');
      const rows = SYNCHRONIZED_POINTCLOUD_DATA.map(r => Object.values(r).join(',')).join('\n');
      csvContent = `${headers}\n${rows}`;
    } else if (type === 'gelsight') {
      fileName = 'gelsight_tactile.csv';
      const headers = Object.keys(SYNCHRONIZED_TACTILE_DATA[0]).join(',');
      const rows = SYNCHRONIZED_TACTILE_DATA.map(r => Object.values(r).join(',')).join('\n');
      csvContent = `${headers}\n${rows}`;
    } else {
      fileName = 'master_manifest.json';
      csvContent = JSON.stringify(MASTER_EXPERIMENT_MANIFEST, null, 2);
    }

    const blob = new Blob([csvContent], { type: type === 'manifest' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (onLogEvent) {
      onLogEvent(`[EXPORT] Downloaded clean dataset artifact: ${fileName}`, 'interaction');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FAF9F6] border-2 border-[#1A1A1A] w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 bg-white border-b-2 border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 border border-indigo-200">
              <FileSpreadsheet className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black uppercase tracking-wider text-[#1A1A1A]">
                  Physical AI CSV Data Ingestion & Multi-Sensor Inspector
                </span>
                <span className="text-[9px] font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-1.5 py-0.5">
                  TIME-SYNCHRONIZED (0 - 50ms)
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 font-serif italic mt-0.5">
                Inspect raw telemetry rows, 3D point cloud coordinate metrology, GelSight shear matrices, and Master Manifest JSON.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-[#F5F2ED] hover:bg-neutral-200 text-[#1A1A1A] border border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TOP CONTROLS & SUB-TABS */}
        <div className="p-3 bg-[#F5F2ED] border-b border-[#1A1A1A] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {[
              { id: 'telemetry', label: 'robot_telemetry.csv (200Hz)', icon: Cpu, count: '11 rows' },
              { id: 'pointcloud', label: 'pointcloud_spatial.csv (LiDAR)', icon: Layers, count: '15 pts' },
              { id: 'gelsight', label: 'gelsight_tactile.csv (Tactile)', icon: Activity, count: '11 rows' },
              { id: 'fused', label: '⚡ Fused 3D World Tensor', icon: Zap, count: 'Unified' },
              { id: 'manifest', label: 'manifest.json (Specification)', icon: ShieldCheck, count: 'Master' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-mono font-bold tracking-tight uppercase border transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:border-[#1A1A1A]'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`text-[9px] px-1 py-0.2 rounded-xs ${activeTab === tab.id ? 'bg-neutral-800 text-emerald-400' : 'bg-neutral-100 text-neutral-600'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSimulateIngest(activeTab.toUpperCase())}
              disabled={isProcessing}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-300 text-white px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center gap-1.5 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Ingesting...' : '⚡ Re-Ingest Stream'}</span>
            </button>

            <button
              onClick={() => handleDownloadCsv(activeTab)}
              className="bg-white hover:bg-neutral-100 text-neutral-900 px-3 py-1.5 text-xs font-mono font-bold uppercase border border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        {/* STATUS BANNER */}
        <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-700" />
            <span>Status: <strong className="text-black">{ingestStatus}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-neutral-600">
            <span>Sampling: <strong>200 Hz Telemetry | 200 Hz Tactile | 20 Hz Vision</strong></span>
          </div>
        </div>

        {/* TABLE CONTENT AREA */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs">
          
          {/* TAB 1: ROBOT TELEMETRY CSV */}
          {activeTab === 'telemetry' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white p-2.5 border border-[#1A1A1A]">
                <span className="font-bold text-[#1A1A1A] uppercase text-xs">
                  robot_telemetry.csv (7-DOF Joint Positions, Velocities, Motor Torques & Thermal Core)
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">11 time-slices (t=0 to 50ms)</span>
              </div>

              <div className="border border-[#1A1A1A] bg-white overflow-x-auto shadow-sm">
                <table className="w-full text-left font-mono text-[11px] divide-y divide-neutral-200">
                  <thead className="bg-[#F5F2ED] text-neutral-700 font-bold">
                    <tr>
                      <th className="p-2 border-r border-neutral-300">timestamp_ms</th>
                      <th className="p-2 border-r border-neutral-300">j0_deg</th>
                      <th className="p-2 border-r border-neutral-300">j1_deg</th>
                      <th className="p-2 border-r border-neutral-300">j2_deg</th>
                      <th className="p-2 border-r border-neutral-300">j3_deg</th>
                      <th className="p-2 border-r border-neutral-300">j0_vel_dps</th>
                      <th className="p-2 border-r border-neutral-300">torque_nm</th>
                      <th className="p-2 border-r border-neutral-300">temp_c</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {SYNCHRONIZED_TELEMETRY_DATA.map((row) => (
                      <tr key={row.timestamp_ms} className="hover:bg-indigo-50/50 transition">
                        <td className="p-2 font-black text-black border-r border-neutral-200">
                          {row.timestamp_ms} ms
                        </td>
                        <td className="p-2 border-r border-neutral-200">{row.j0_deg}°</td>
                        <td className="p-2 border-r border-neutral-200">{row.j1_deg}°</td>
                        <td className="p-2 border-r border-neutral-200">{row.j2_deg}°</td>
                        <td className="p-2 border-r border-neutral-200">{row.j3_deg}°</td>
                        <td className="p-2 border-r border-neutral-200 text-indigo-700 font-bold">{row.j0_vel}°/s</td>
                        <td className="p-2 border-r border-neutral-200 font-bold text-black">
                          {row.torque_nm} Nm {row.torque_nm > 6.5 && <span className="text-[9px] text-amber-600">(Peak)</span>}
                        </td>
                        <td className="p-2 border-r border-neutral-200 text-neutral-600">{row.temperature_c}°C</td>
                        <td className="p-2">
                          <button
                            onClick={() => {
                              if (onSelectTimeMs) onSelectTimeMs(row.timestamp_ms);
                              if (onOpenPipeline) onOpenPipeline();
                              onClose();
                            }}
                            className="bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white px-2 py-0.5 text-[9px] font-bold uppercase border border-indigo-200 transition cursor-pointer"
                          >
                            Inspect t={row.timestamp_ms}ms
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: POINT CLOUD SPATIAL CSV */}
          {activeTab === 'pointcloud' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white p-2.5 border border-[#1A1A1A]">
                <span className="font-bold text-[#1A1A1A] uppercase text-xs">
                  pointcloud_spatial.csv (3D LiDAR Object Permanence & Coordinate Metrology)
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">15 points segmented</span>
              </div>

              <div className="border border-[#1A1A1A] bg-white overflow-x-auto shadow-sm">
                <table className="w-full text-left font-mono text-[11px] divide-y divide-neutral-200">
                  <thead className="bg-[#F5F2ED] text-neutral-700 font-bold">
                    <tr>
                      <th className="p-2 border-r border-neutral-300">point_id</th>
                      <th className="p-2 border-r border-neutral-300">object_id</th>
                      <th className="p-2 border-r border-neutral-300">x_mm</th>
                      <th className="p-2 border-r border-neutral-300">y_mm</th>
                      <th className="p-2 border-r border-neutral-300">z_mm</th>
                      <th className="p-2 border-r border-neutral-300">confidence</th>
                      <th className="p-2 border-r border-neutral-300">semantic_label</th>
                      <th className="p-2">t_ms</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {SYNCHRONIZED_POINTCLOUD_DATA.map((row) => (
                      <tr key={row.point_id} className="hover:bg-indigo-50/50 transition">
                        <td className="p-2 font-bold text-black border-r border-neutral-200">{row.point_id}</td>
                        <td className="p-2 border-r border-neutral-200 font-bold text-indigo-700">{row.object_id}</td>
                        <td className="p-2 border-r border-neutral-200">{row.x_mm}</td>
                        <td className="p-2 border-r border-neutral-200">{row.y_mm}</td>
                        <td className="p-2 border-r border-neutral-200">{row.z_mm}</td>
                        <td className="p-2 border-r border-neutral-200 text-emerald-700 font-bold">{(row.confidence * 100).toFixed(0)}%</td>
                        <td className="p-2 border-r border-neutral-200 text-neutral-700">{row.semantic_class}</td>
                        <td className="p-2 font-mono text-neutral-500">{row.timestamp_ms}ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: GELSIGHT TACTILE CSV */}
          {activeTab === 'gelsight' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white p-2.5 border border-[#1A1A1A]">
                <span className="font-bold text-[#1A1A1A] uppercase text-xs">
                  gelsight_tactile.csv (Tactile Normal Force, Shear Vectors & Developing Slip Probability)
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">11 time-slices (t=0 to 50ms)</span>
              </div>

              <div className="border border-[#1A1A1A] bg-white overflow-x-auto shadow-sm">
                <table className="w-full text-left font-mono text-[11px] divide-y divide-neutral-200">
                  <thead className="bg-[#F5F2ED] text-neutral-700 font-bold">
                    <tr>
                      <th className="p-2 border-r border-neutral-300">timestamp_ms</th>
                      <th className="p-2 border-r border-neutral-300">normal_force_n</th>
                      <th className="p-2 border-r border-neutral-300">shear_x_n</th>
                      <th className="p-2 border-r border-neutral-300">shear_y_n</th>
                      <th className="p-2 border-r border-neutral-300">contact_area_mm2</th>
                      <th className="p-2 border-r border-neutral-300">slip_probability</th>
                      <th className="p-2 border-r border-neutral-300">wetness_pct</th>
                      <th className="p-2">Verdict</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {SYNCHRONIZED_TACTILE_DATA.map((row) => (
                      <tr key={row.timestamp_ms} className={`transition ${row.slip_probability > 0.4 ? 'bg-amber-50/80' : 'hover:bg-indigo-50/50'}`}>
                        <td className="p-2 font-black text-black border-r border-neutral-200">{row.timestamp_ms} ms</td>
                        <td className="p-2 border-r border-neutral-200 font-bold text-neutral-900">{row.normal_force_n} N</td>
                        <td className="p-2 border-r border-neutral-200 text-indigo-700 font-bold">{row.shear_x_n} N</td>
                        <td className="p-2 border-r border-neutral-200 text-indigo-700 font-bold">{row.shear_y_n} N</td>
                        <td className="p-2 border-r border-neutral-200">{row.contact_area_mm2} mm²</td>
                        <td className="p-2 border-r border-neutral-200 font-black">
                          <span className={row.slip_probability > 0.4 ? 'text-amber-700 font-black' : 'text-emerald-700'}>
                            {(row.slip_probability * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="p-2 border-r border-neutral-200 text-neutral-600">{row.wetness_pct}%</td>
                        <td className="p-2">
                          {row.slip_probability > 0.4 ? (
                            <span className="bg-amber-100 text-amber-900 border border-amber-400 text-[9px] font-bold px-1.5 py-0.5">
                              ⚠️ COMPENSATE
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-900 border border-emerald-400 text-[9px] font-bold px-1.5 py-0.5">
                              ✓ NOMINAL
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: FUSED 3D WORLD TENSOR */}
          {activeTab === 'fused' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white p-2.5 border border-[#1A1A1A]">
                <span className="font-bold text-[#1A1A1A] uppercase text-xs">
                  Unified 3D World State Tensor (Synchronized Multi-Modal Ingestion)
                </span>
                <span className="text-[10px] text-emerald-700 font-mono font-bold">100% SENSOR ALIGNMENT OK</span>
              </div>

              <div className="p-4 bg-white border border-[#1A1A1A] space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-neutral-50 border border-neutral-300">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Stream 1: Kinematics</span>
                    <div className="font-bold text-black text-xs">7-DOF Manipulator @ 200 Hz</div>
                    <div className="text-[10px] text-neutral-600 mt-1">Joints J0-J6, torque limit 12.0 Nm</div>
                  </div>
                  <div className="p-3 bg-neutral-50 border border-neutral-300">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Stream 2: 3D Spatial</span>
                    <div className="font-bold text-indigo-700 text-xs">LiDAR Point Cloud (0.15mm)</div>
                    <div className="text-[10px] text-neutral-600 mt-1">Metrology clearance 52.0 mm</div>
                  </div>
                  <div className="p-3 bg-neutral-50 border border-neutral-300">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Stream 3: Elastomer</span>
                    <div className="font-bold text-emerald-700 text-xs">GelSight Tactile (200 Hz)</div>
                    <div className="text-[10px] text-neutral-600 mt-1">Developing slip detected at t=50ms</div>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-200">
                  <h5 className="font-bold text-indigo-950 uppercase text-xs mb-1">Causal Verification Closed Loop</h5>
                  <p className="text-[11px] text-indigo-900 leading-relaxed font-sans">
                    All 3 streams are merged into the OMEGA Causal Graph. When shear force increases from t=45ms to 50ms, the closed loop initiates autonomous impedance torque compensation, dampening descent velocity by -40% and preventing dish fracture.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MASTER MANIFEST JSON */}
          {activeTab === 'manifest' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white p-2.5 border border-[#1A1A1A]">
                <span className="font-bold text-[#1A1A1A] uppercase text-xs">
                  manifest.json (Master Ingestion Specification)
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">Format: JSON v2.1</span>
              </div>

              <div className="p-3 bg-[#1A1A1A] text-emerald-400 font-mono text-[11px] border border-neutral-700 overflow-x-auto shadow-inner">
                <pre className="leading-relaxed">{JSON.stringify(MASTER_EXPERIMENT_MANIFEST, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-3 bg-white border-t-2 border-[#1A1A1A] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-neutral-600 font-serif italic">
            Synchronized dataset ready for 3D simulation rollout and causal safety verification.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                if (onOpenPipeline) onOpenPipeline();
                onClose();
              }}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-mono font-black uppercase tracking-wider border border-emerald-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center gap-1.5 transition"
            >
              <Zap className="w-3.5 h-3.5 fill-white text-white" />
              <span>Open 3D World State Pipeline</span>
            </button>
            <button
              onClick={onClose}
              className="bg-[#1A1A1A] hover:bg-neutral-800 text-white px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider border border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
