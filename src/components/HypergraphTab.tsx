import React, { useState, useEffect, useRef } from 'react';
import { StateTensor, CausalGraph } from '../types';
import { Network, Activity, Info, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

type HypergraphTabProps = {
  stateTensor?: StateTensor;
  causalGraph?: CausalGraph;
  onLogEvent: (details: string, type: 'info' | 'physics' | 'interaction' | 'hardware' | 'causal') => void;
};

interface VisualNode {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface VisualEdge {
  from: string;
  to: string;
  confidence: number;
}

export const HypergraphTab: React.FC<HypergraphTabProps> = ({
  stateTensor,
  causalGraph,
  onLogEvent,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<VisualNode[]>([]);
  const [edges, setEdges] = useState<VisualEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Fallback default graph if causalGraph is empty
  const defaultGraph: CausalGraph = {
    nodes: ['Teacher_Experience', 'Curriculum_Relevance', 'Student_Engagement', 'Student_Outcomes', 'Years_Teaching', 'Professional_Dev'],
    edges: [
      { from: 'Teacher_Experience', to: 'Curriculum_Relevance', confidence: 0.94, evidence: [] },
      { from: 'Curriculum_Relevance', to: 'Student_Engagement', confidence: 0.88, evidence: [] },
      { from: 'Student_Engagement', to: 'Student_Outcomes', confidence: 0.95, evidence: [] },
      { from: 'Years_Teaching', to: 'Student_Outcomes', confidence: 0.72, evidence: [] },
      { from: 'Teacher_Experience', to: 'Student_Outcomes', confidence: 0.82, evidence: [] },
      { from: 'Professional_Dev', to: 'Curriculum_Relevance', confidence: 0.65, evidence: [] }
    ],
    version: 1,
    lastUpdated: new Date(),
    domain: 'education'
  };

  const activeGraph = causalGraph && causalGraph.nodes && causalGraph.nodes.length > 0 ? causalGraph : defaultGraph;

  // Initialize visual nodes with custom circle/grid placement
  useEffect(() => {
    const width = 600;
    const height = 400;
    const initialNodes = activeGraph.nodes.map((node, index) => {
      const angle = (index / activeGraph.nodes.length) * Math.PI * 2;
      return {
        id: node,
        label: node.replace(/_/g, ' '),
        x: width / 2 + Math.cos(angle) * 120,
        y: height / 2 + Math.sin(angle) * 120,
        vx: 0,
        vy: 0,
      };
    });

    setNodes(initialNodes);
    setEdges(activeGraph.edges.map(e => ({ from: e.from, to: e.to, confidence: e.confidence })));
    
    onLogEvent(`Initialized Hypergraph Tab with ${initialNodes.length} causal vertices and ${activeGraph.edges.length} edges.`, 'interaction');
  }, [causalGraph]);

  // Run lightweight force-directed simulation layout
  useEffect(() => {
    if (nodes.length === 0) return;

    let animFrame: number;
    const width = 600;
    const height = 400;

    const runLayout = () => {
      setNodes(prevNodes => {
        // Create copies of nodes to update
        const next = prevNodes.map(n => ({ ...n }));

        // 1. Repulsion force between all nodes
        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const dx = next[j].x - next[i].x;
            const dy = next[j].y - next[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
            if (dist < 180) {
              const force = (180 - dist) * 0.08;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;
              
              if (next[i].id !== draggedNode) {
                next[i].x -= fx;
                next[i].y -= fy;
              }
              if (next[j].id !== draggedNode) {
                next[j].x += fx;
                next[j].y += fy;
              }
            }
          }
        }

        // 2. Attraction force along edges
        edges.forEach(edge => {
          const u = next.find(n => n.id === edge.from);
          const v = next.find(n => n.id === edge.to);
          if (u && v) {
            const dx = v.x - u.x;
            const dy = v.y - u.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
            const desiredDist = 120;
            const force = (dist - desiredDist) * 0.03 * edge.confidence;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (u.id !== draggedNode) {
              u.x += fx;
              u.y += fy;
            }
            if (v.id !== draggedNode) {
              v.x -= fx;
              v.y -= fy;
            }
          }
        });

        // 3. Gravity center force & boundary confinement
        next.forEach(node => {
          if (node.id === draggedNode) return;
          const dx = width / 2 - node.x;
          const dy = height / 2 - node.y;
          node.x += dx * 0.015;
          node.y += dy * 0.015;

          // Limit to canvas bounds
          node.x = Math.max(30, Math.min(width - 30, node.x));
          node.y = Math.max(30, Math.min(height - 30, node.y));
        });

        return next;
      });

      animFrame = requestAnimationFrame(runLayout);
    };

    animFrame = requestAnimationFrame(runLayout);
    return () => cancelAnimationFrame(animFrame);
  }, [edges, draggedNode]);

  // Handle Drag interactions
  const handleNodeMouseDown = (nodeId: string, e: React.MouseEvent<SVGGElement, MouseEvent>) => {
    e.stopPropagation();
    setDraggedNode(nodeId);
    setSelectedNode(nodeId);
    onLogEvent(`Selected Causal Vertex Node: ${nodeId}`, 'interaction');
    
    // Scale for zoom
    const svgElement = e.currentTarget.ownerSVGElement;
    if (!svgElement) return;
    const rect = svgElement.getBoundingClientRect();
    dragStartRef.current = {
      x: (e.clientX - rect.left) / zoom - pan.x,
      y: (e.clientY - rect.top) / zoom - pan.y
    };
    setIsDragging(true);
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!isDragging || !draggedNode) return;
    const svgElement = e.currentTarget;
    const rect = svgElement.getBoundingClientRect();
    const curX = (e.clientX - rect.left) / zoom - pan.x;
    const curY = (e.clientY - rect.top) / zoom - pan.y;

    setNodes(prev => prev.map(node => {
      if (node.id === draggedNode) {
        return { ...node, x: curX, y: curY };
      }
      return node;
    }));
  };

  const handleSvgMouseUp = () => {
    setIsDragging(false);
    setDraggedNode(null);
  };

  const selectedNodeDetails = nodes.find(n => n.id === selectedNode);
  const selectedNodeEdges = edges.filter(e => e.from === selectedNode || e.to === selectedNode);

  return (
    <div ref={containerRef} className="bg-[#FAF9F6] border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
      
      {/* Brand Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-[#1A1A1A] pb-4 mb-4 gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> CAUSAL SCAN INTEGRATION ENGINE
          </span>
          <h3 className="text-base font-serif font-black uppercase tracking-tight text-[#1A1A1A]">
            🔗 Causal Hypergraph Topology Matrix
          </h3>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-1 bg-white border border-[#1A1A1A] p-1 text-xs">
          <button onClick={() => setZoom(z => Math.min(2.0, z + 0.1))} className="p-1.5 hover:bg-neutral-100 transition" title="Zoom In">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1.5 hover:bg-neutral-100 transition" title="Zoom Out">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => { setZoom(1.0); setPan({ x: 0, y: 0 }); }} className="p-1.5 hover:bg-neutral-100 transition" title="Reset view">
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Network Viewport */}
        <div className="lg:col-span-2 border-2 border-[#1A1A1A] bg-white relative overflow-hidden h-[400px]">
          <svg
            className="w-full h-full cursor-grab active:cursor-grabbing select-none"
            onMouseMove={handleSvgMouseMove}
            onMouseUp={handleSvgMouseUp}
            onMouseLeave={handleSvgMouseUp}
          >
            <g transform={`scale(${zoom}) translate(${pan.x}, ${pan.y})`}>
              {/* Markers for arrows */}
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="16"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#1A1A1A" />
                </marker>
              </defs>

              {/* Render edges/relations */}
              {edges.map((edge, i) => {
                const u = nodes.find(n => n.id === edge.from);
                const v = nodes.find(n => n.id === edge.to);
                if (!u || !v) return null;
                return (
                  <g key={`edge-${i}`}>
                    <line
                      x1={u.x}
                      y1={u.y}
                      x2={v.x}
                      y2={v.y}
                      stroke="#1A1A1A"
                      strokeWidth={1 + edge.confidence * 3}
                      strokeDasharray={edge.confidence < 0.7 ? "5,5" : "none"}
                      markerEnd="url(#arrow)"
                      opacity={0.8}
                    />
                    {/* Render confidence weight tag middle of edge */}
                    <rect
                      x={(u.x + v.x) / 2 - 14}
                      y={(u.y + v.y) / 2 - 8}
                      width="28"
                      height="16"
                      rx="2"
                      fill="#FAF9F6"
                      stroke="#1A1A1A"
                      strokeWidth="1"
                    />
                    <text
                      x={(u.x + v.x) / 2}
                      y={(u.y + v.y) / 2 + 3}
                      textAnchor="middle"
                      className="font-mono text-[8px] font-bold text-[#1A1A1A]"
                    >
                      {edge.confidence.toFixed(2)}
                    </text>
                  </g>
                );
              })}

              {/* Render vertices */}
              {nodes.map((node) => {
                const isSelected = selectedNode === node.id;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                    className="cursor-pointer group"
                  >
                    <rect
                      x="-65"
                      y="-18"
                      width="130"
                      height="36"
                      rx="4"
                      fill={isSelected ? '#34D399' : '#FFFFFF'}
                      stroke="#1A1A1A"
                      strokeWidth={isSelected ? '3' : '2'}
                      className="shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-colors duration-200"
                    />
                    <text
                      y="3"
                      textAnchor="middle"
                      className="font-mono text-[9px] font-bold text-[#1A1A1A]"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Scale Indicator */}
          <span className="absolute bottom-3 left-3 bg-[#FAF9F6] border border-[#1A1A1A] px-2 py-0.5 text-[8px] font-mono font-bold select-none">
            SCALE: {(zoom * 100).toFixed(0)}% | SKELETON: PC-ALGORITHM
          </span>
        </div>

        {/* Sidebar Info/Metadata */}
        <div className="space-y-4">
          <div className="border-2 border-[#1A1A1A] p-4 bg-white shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            <h4 className="text-[10px] uppercase font-mono font-black text-indigo-600 mb-2 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Selected Vertices
            </h4>

            {selectedNodeDetails ? (
              <div className="space-y-2.5">
                <div>
                  <span className="text-[9px] font-mono text-neutral-400 block uppercase">NODE IDENTIFIER</span>
                  <span className="text-xs font-serif font-black uppercase text-[#1A1A1A]">{selectedNodeDetails.id}</span>
                </div>
                
                <div>
                  <span className="text-[9px] font-mono text-neutral-400 block uppercase">NODE COORDINATES</span>
                  <span className="text-xs font-mono font-bold">X: {selectedNodeDetails.x.toFixed(1)} | Y: {selectedNodeDetails.y.toFixed(1)}</span>
                </div>

                <div>
                  <span className="text-[9px] font-mono text-neutral-400 block uppercase mb-1">CO-DEPENDENCY LOOPS</span>
                  <div className="space-y-1">
                    {selectedNodeEdges.length === 0 ? (
                      <span className="text-[10px] italic text-neutral-500">No active paths mapped.</span>
                    ) : (
                      selectedNodeEdges.map((e, index) => {
                        const direct = e.from === selectedNode ? 'OUTGOING' : 'INCOMING';
                        const other = e.from === selectedNode ? e.to : e.from;
                        return (
                          <div key={index} className="flex justify-between items-center text-[10px] bg-neutral-50 border border-neutral-200 p-1.5 font-mono">
                            <span>{direct} → {other.substring(0, 15)}</span>
                            <span className="font-bold text-emerald-600">{(e.confidence * 100).toFixed(0)}%</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[11px] font-serif text-neutral-500 italic">
                Click on any node in the causal hypergraph network layout to load properties and active co-dependency paths.
              </p>
            )}
          </div>

          {/* Active State Tensor */}
          {stateTensor && (
            <div className="border-2 border-[#1A1A1A] p-4 bg-[#FAF9F6]">
              <h4 className="text-[10px] uppercase font-mono font-black text-[#1A1A1A] mb-2">
                📡 ACTIVE STATE TENSOR
              </h4>
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                <div className="bg-white p-1.5 border border-neutral-300">
                  <span className="text-neutral-400 block text-[8px]">SPATIAL</span>
                  <span>X: {stateTensor.spatial.x} | Y: {stateTensor.spatial.y}</span>
                </div>
                <div className="bg-white p-1.5 border border-neutral-300">
                  <span className="text-neutral-400 block text-[8px]">TEMPORAL</span>
                  <span>t: {stateTensor.temporal.t} (dt: {stateTensor.temporal.dt})</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HypergraphTab;
