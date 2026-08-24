import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play, Pause, RotateCcw, SkipBack, SkipForward, Video, Eye, Compass,
  Layers, Zap, Shield, Sparkles, Sliders, Camera, Maximize2, Minimize2,
  Activity, CheckCircle, AlertTriangle, Cpu, Radio, ChevronRight, Download
} from 'lucide-react';
import {
  RiskLevel,
  DishwasherScenarioStep
} from '../types';
import {
  DISHWASHER_22_STEPS
} from '../utils/physicalAiHarness';

interface Spatial3DProgressionViewerProps {
  onLogEvent?: (details: string, type: 'info' | 'physics' | 'interaction') => void;
  externalActiveStep?: number;
  onStepChange?: (stepIndex: number) => void;
}

type CameraViewMode = 'orbit' | 'eye_in_hand' | 'top_down' | 'front_chamber' | 'stress_fea' | 'lidar_pointcloud';

export default function Spatial3DProgressionViewer({
  onLogEvent,
  externalActiveStep,
  onStepChange
}: Spatial3DProgressionViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pipCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Video Progression Timeline State (Total 44 seconds = 1320 frames at 30fps)
  const TOTAL_DURATION_SEC = 44.0;
  const FPS = 30;
  const TOTAL_FRAMES = Math.floor(TOTAL_DURATION_SEC * FPS);

  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Camera & Perspective Settings
  const [cameraMode, setCameraMode] = useState<CameraViewMode>('orbit');
  const [camYaw, setCamYaw] = useState<number>(0.65); // Azimuth angle radians
  const [camPitch, setCamPitch] = useState<number>(0.48); // Elevation angle radians
  const [camDistance, setCamDistance] = useState<number>(540); // Camera distance zoom
  const [camPan, setCamPan] = useState<{ x: number; y: number }>({ x: 0, y: -20 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  // Layer Toggles
  const [showTrajectory, setShowTrajectory] = useState<boolean>(true);
  const [showPointClouds, setShowPointClouds] = useState<boolean>(true);
  const [showForceVectors, setShowForceVectors] = useState<boolean>(true);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [showSprayLaserSweep, setShowSprayLaserSweep] = useState<boolean>(true);
  const [showPip, setShowPip] = useState<boolean>(true);
  const [pipMode, setPipMode] = useState<'eye_in_hand' | 'tactile_gelsight'>('eye_in_hand');

  // Canvas size
  const [dimensions, setDimensions] = useState({ width: 850, height: 500 });

  // Map frame to 22 steps
  const currentStepIndex = useMemo(() => {
    const stepDurationFrames = TOTAL_FRAMES / DISHWASHER_22_STEPS.length;
    const idx = Math.min(
      Math.floor(currentFrame / stepDurationFrames),
      DISHWASHER_22_STEPS.length - 1
    );
    return Math.max(0, idx);
  }, [currentFrame, TOTAL_FRAMES]);

  const activeStep = DISHWASHER_22_STEPS[currentStepIndex] || DISHWASHER_22_STEPS[0];

  // Sync with external active step if provided
  useEffect(() => {
    if (externalActiveStep !== undefined && externalActiveStep !== currentStepIndex) {
      const stepDurationFrames = TOTAL_FRAMES / DISHWASHER_22_STEPS.length;
      setCurrentFrame(Math.floor(externalActiveStep * stepDurationFrames));
    }
  }, [externalActiveStep]);

  // Handle ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        const w = Math.max(width, 320);
        const h = isFullscreen ? window.innerHeight - 160 : Math.max(Math.min(w * 0.58, 620), 400);
        setDimensions({ width: w, height: h });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isFullscreen]);

  // Video progression playback clock
  useEffect(() => {
    let animationId: number;
    let lastTimestamp = performance.now();

    const tick = (now: number) => {
      const deltaSec = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying) {
        setCurrentFrame((prev) => {
          const framesToAdd = deltaSec * FPS * playbackSpeed;
          let next = prev + framesToAdd;
          if (next >= TOTAL_FRAMES) {
            if (isLooping) {
              next = 0;
            } else {
              setIsPlaying(false);
              return TOTAL_FRAMES - 1;
            }
          }
          return next;
        });
      }

      if (autoRotate && cameraMode === 'orbit') {
        setCamYaw((prev) => prev + 0.005);
      }

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, playbackSpeed, isLooping, autoRotate, cameraMode, TOTAL_FRAMES]);

  // Notify parent on step transition
  const prevStepRef = useRef<number>(currentStepIndex);
  useEffect(() => {
    if (prevStepRef.current !== currentStepIndex) {
      prevStepRef.current = currentStepIndex;
      onStepChange?.(currentStepIndex);
      onLogEvent?.(`[3D-SPATIAL] Step ${activeStep.stepNumber}/22: ${activeStep.title}`, 'physics');
    }
  }, [currentStepIndex, activeStep, onStepChange, onLogEvent]);

  // Mouse interaction for 3D orbit
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setDragStart({ x: e.clientX, y: e.clientY });

    if (e.shiftKey) {
      // Pan
      setCamPan((prev) => ({ x: prev.x + dx * 0.5, y: prev.y + dy * 0.5 }));
    } else {
      // Orbit
      setCamYaw((prev) => prev + dx * 0.008);
      setCamPitch((prev) => Math.max(-0.2, Math.min(1.4, prev + dy * 0.008)));
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setCamDistance((prev) => Math.max(220, Math.min(1200, prev + e.deltaY * 0.4)));
  };

  // Jump to specific step
  const seekToStep = (stepIdx: number) => {
    const stepDurationFrames = TOTAL_FRAMES / DISHWASHER_22_STEPS.length;
    setCurrentFrame(Math.floor(stepIdx * stepDurationFrames));
  };

  // Set camera angle preset
  const applyCameraPreset = (mode: CameraViewMode) => {
    setCameraMode(mode);
    if (mode === 'orbit') {
      setCamYaw(0.65);
      setCamPitch(0.48);
      setCamDistance(540);
      setCamPan({ x: 0, y: -20 });
    } else if (mode === 'eye_in_hand') {
      setCamYaw(0.1);
      setCamPitch(0.9);
      setCamDistance(300);
      setCamPan({ x: 0, y: 40 });
    } else if (mode === 'top_down') {
      setCamYaw(0.0);
      setCamPitch(1.52);
      setCamDistance(480);
      setCamPan({ x: 0, y: 0 });
    } else if (mode === 'front_chamber') {
      setCamYaw(0.0);
      setCamPitch(0.1);
      setCamDistance(460);
      setCamPan({ x: 0, y: -30 });
    } else if (mode === 'stress_fea') {
      setCamYaw(0.85);
      setCamPitch(0.35);
      setCamDistance(500);
      setCamPan({ x: 10, y: -10 });
    } else if (mode === 'lidar_pointcloud') {
      setCamYaw(0.4);
      setCamPitch(0.6);
      setCamDistance(520);
      setCamPan({ x: 0, y: -15 });
    }
  };

  // -------------------------------------------------------------
  // 3D KINEMATICS & PROJECTION MATRIX MATHEMATICAL CALCULATIONS
  // -------------------------------------------------------------
  // 3D Point projection helper
  const project3D = useCallback((x: number, y: number, z: number, w: number, h: number) => {
    // Center of scene
    const cx = w / 2 + camPan.x;
    const cy = h / 2 + camPan.y;

    // Camera rotation matrix (Yaw & Pitch)
    const cosY = Math.cos(camYaw);
    const sinY = Math.sin(camYaw);
    const cosP = Math.cos(camPitch);
    const sinP = Math.sin(camPitch);

    // Apply Yaw (Y-axis rotation)
    const x1 = x * cosY - z * sinY;
    const y1 = y;
    const z1 = x * sinY + z * cosY;

    // Apply Pitch (X-axis rotation)
    const x2 = x1;
    const y2 = y1 * cosP - z1 * sinP;
    const z2 = y1 * sinP + z1 * cosP;

    // Perspective projection
    const fov = 650;
    const distanceOffset = camDistance;
    const depth = z2 + distanceOffset;

    if (depth <= 10) return { x: cx, y: cy, z: depth, visible: false, scale: 0 };

    const scale = fov / depth;
    const screenX = cx + x2 * scale;
    const screenY = cy - y2 * scale; // Invert Y for screen space

    return {
      x: screenX,
      y: screenY,
      z: depth,
      visible: true,
      scale
    };
  }, [camYaw, camPitch, camDistance, camPan]);

  // Continuous Kinematic State calculated based on timeline progression
  const simProgressionRatio = currentFrame / TOTAL_FRAMES; // 0.0 to 1.0
  const normalizedTimeSec = simProgressionRatio * TOTAL_DURATION_SEC;

  // Dynamic values derived from timeline:
  // 1. Dishwasher Lower Rack slide extension [0 to 140 mm in 3D units]
  let lowerRackExtension = 0;
  if (simProgressionRatio >= 0.15 && simProgressionRatio < 0.85) {
    // Rack extended
    lowerRackExtension = Math.min(135, (simProgressionRatio - 0.15) * 600);
  } else if (simProgressionRatio >= 0.85) {
    // Retracting back
    lowerRackExtension = Math.max(0, 135 - (simProgressionRatio - 0.85) * 900);
  }

  // 2. Robot Arm Target Coordinate & End-Effector XYZ in World 3D (mm)
  let eeX = -60, eeY = 80, eeZ = 40; // Default Standby Pose
  let gripperOpenMm = 45; // Open
  let activeGraspedObject: 'none' | 'plate' | 'glass' | 'fork' | 'bowl' | 'rack_handle' = 'none';
  let gripperForceN = 0.0;
  let sprayRotationAngle = (currentFrame * 0.12) % (Math.PI * 2);

  // Phase-dependent trajectory interpolation:
  if (currentStepIndex <= 4) {
    // Phase 1: Perception scanning & standby
    const t = currentStepIndex / 4;
    eeX = -80 + Math.sin(currentFrame * 0.08) * 15;
    eeY = 90 + Math.cos(currentFrame * 0.08) * 10;
    eeZ = 60 + Math.sin(currentFrame * 0.05) * 10;
    gripperOpenMm = 50;
    gripperForceN = 0.0;
  } else if (currentStepIndex >= 5 && currentStepIndex <= 7) {
    // Phase 2: Pulling Rack handle
    const subT = (currentFrame % (TOTAL_FRAMES / 22)) / (TOTAL_FRAMES / 22);
    eeX = -10 + lowerRackExtension * 0.8;
    eeY = -20;
    eeZ = -10;
    gripperOpenMm = 15;
    activeGraspedObject = 'rack_handle';
    gripperForceN = 18.0;
  } else if (currentStepIndex >= 8 && currentStepIndex <= 12) {
    // Phase 3: Grasping Plate and loading into lower rack slot #4
    const stepFr = TOTAL_FRAMES / 22;
    const progressInPlate = (currentFrame - 8 * stepFr) / (5 * stepFr);
    
    if (progressInPlate < 0.25) {
      // Approach plate on counter
      eeX = -120 + progressInPlate * 4 * 10;
      eeY = 40;
      eeZ = 30;
      gripperOpenMm = 55;
    } else if (progressInPlate < 0.45) {
      // Grasp rim
      eeX = -110;
      eeY = 45;
      eeZ = 30;
      gripperOpenMm = 8;
      activeGraspedObject = 'plate';
      gripperForceN = 11.5;
    } else if (progressInPlate < 0.8) {
      // Lift and translate in arc
      const arcT = (progressInPlate - 0.45) / 0.35;
      eeX = -110 + arcT * 95;
      eeY = 45 + Math.sin(arcT * Math.PI) * 55 - arcT * 40;
      eeZ = 30 + arcT * 10;
      activeGraspedObject = 'plate';
      gripperForceN = 11.5;
    } else {
      // Lower and seat into Lower Slot #4
      eeX = -15;
      eeY = 5;
      eeZ = 40;
      gripperOpenMm = 45; // released
      activeGraspedObject = 'none';
      gripperForceN = 0.5;
    }
  } else if (currentStepIndex >= 13 && currentStepIndex <= 16) {
    // Phase 4: Delicate Wine Glass soft clamp & 180 deg invert into top rack
    const stepFr = TOTAL_FRAMES / 22;
    const progressInGlass = (currentFrame - 13 * stepFr) / (4 * stepFr);

    if (progressInGlass < 0.3) {
      // Approach glass stem
      eeX = -120;
      eeY = 70;
      eeZ = 80;
      gripperOpenMm = 28;
    } else if (progressInGlass < 0.6) {
      // Clamp stem softly (3.8N) & lift
      eeX = -120;
      eeY = 75;
      eeZ = 90;
      gripperOpenMm = 6;
      activeGraspedObject = 'glass';
      gripperForceN = 3.8;
    } else if (progressInGlass < 0.9) {
      // Translate to upper rack stem holder #2 and invert
      const arcT = (progressInGlass - 0.6) / 0.3;
      eeX = -120 + arcT * 110;
      eeY = 75 + arcT * 15;
      eeZ = 90 + arcT * 10;
      activeGraspedObject = 'glass';
      gripperForceN = 3.78;
    } else {
      // Docked into upper silicone clasp
      eeX = -10;
      eeY = 90;
      eeZ = 100;
      gripperOpenMm = 25;
      activeGraspedObject = 'none';
      gripperForceN = 0.0;
    }
  } else if (currentStepIndex === 17) {
    // Phase 5: Fork & Bowl batch insertion
    eeX = -5 + Math.sin(currentFrame * 0.2) * 20;
    eeY = 60;
    eeZ = 60;
    gripperForceN = 13.8;
    activeGraspedObject = 'fork';
  } else if (currentStepIndex === 18) {
    // Phase 6: 360 Spray Arm laser clearance scan
    eeX = -50;
    eeY = 110;
    eeZ = 50;
    sprayRotationAngle = (currentFrame * 0.35) % (Math.PI * 2);
    gripperForceN = 0.0;
  } else if (currentStepIndex >= 19) {
    // Final Phase: Retract rack, close door & compliance verify
    eeX = -70;
    eeY = 60;
    eeZ = 20;
    gripperForceN = currentStepIndex === 19 ? 12.0 : 0.0;
  }

  // -------------------------------------------------------------
  // PRIMARY 3D CANVAS RENDER LOOP
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = dimensions.width;
    const H = dimensions.height;
    canvas.width = W;
    canvas.height = H;

    // 1. Dark Tech / Grid Blueprint Background
    ctx.fillStyle = cameraMode === 'stress_fea' ? '#080811' : cameraMode === 'lidar_pointcloud' ? '#04070B' : '#0B0F17';
    ctx.fillRect(0, 0, W, H);

    // 2. Render 3D Perspective Grid Floor
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    const gridSize = 240;
    const gridStep = 40;

    for (let gx = -gridSize; gx <= gridSize; gx += gridStep) {
      const p1 = project3D(gx, -60, -gridSize, W, H);
      const p2 = project3D(gx, -60, gridSize, W, H);
      if (p1.visible && p2.visible) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
    for (let gz = -gridSize; gz <= gridSize; gz += gridStep) {
      const p1 = project3D(-gridSize, -60, gz, W, H);
      const p2 = project3D(gridSize, -60, gz, W, H);
      if (p1.visible && p2.visible) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }

    // 3. Render Dishwasher Cabinet Stainless Steel Enclosure (3D Box)
    const dwOrigin = { x: 40, y: 40, z: 0 };
    const dwW = 160, dwH = 170, dwD = 160;

    // Draw Dishwasher Tub Wireframe & Walls
    const corners = [
      { x: dwOrigin.x - dwW / 2, y: dwOrigin.y - dwH / 2, z: dwOrigin.z - dwD / 2 },
      { x: dwOrigin.x + dwW / 2, y: dwOrigin.y - dwH / 2, z: dwOrigin.z - dwD / 2 },
      { x: dwOrigin.x + dwW / 2, y: dwOrigin.y + dwH / 2, z: dwOrigin.z - dwD / 2 },
      { x: dwOrigin.x - dwW / 2, y: dwOrigin.y + dwH / 2, z: dwOrigin.z - dwD / 2 },
      { x: dwOrigin.x - dwW / 2, y: dwOrigin.y - dwH / 2, z: dwOrigin.z + dwD / 2 },
      { x: dwOrigin.x + dwW / 2, y: dwOrigin.y - dwH / 2, z: dwOrigin.z + dwD / 2 },
      { x: dwOrigin.x + dwW / 2, y: dwOrigin.y + dwH / 2, z: dwOrigin.z + dwD / 2 },
      { x: dwOrigin.x - dwW / 2, y: dwOrigin.y + dwH / 2, z: dwOrigin.z + dwD / 2 }
    ].map(c => project3D(c.x, c.y, c.z, W, H));

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    // Connect back wall
    if (corners[0].visible && corners[1].visible && corners[2].visible && corners[3].visible) {
      ctx.fillStyle = 'rgba(30, 41, 59, 0.35)';
      ctx.beginPath();
      ctx.moveTo(corners[0].x, corners[0].y);
      ctx.lineTo(corners[1].x, corners[1].y);
      ctx.lineTo(corners[2].x, corners[2].y);
      ctx.lineTo(corners[3].x, corners[3].y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Connect top & side tub panels
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Back face
      [4, 5], [5, 6], [6, 7], [7, 4], // Front opening face
      [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting depth ribs
    ];

    ctx.strokeStyle = '#475569';
    edges.forEach(([i1, i2]) => {
      if (corners[i1].visible && corners[i2].visible) {
        ctx.beginPath();
        ctx.moveTo(corners[i1].x, corners[i1].y);
        ctx.lineTo(corners[i2].x, corners[i2].y);
        ctx.stroke();
      }
    });

    // 4. Render Lower Slide-Out Rack with Wire Tines
    const rackX = dwOrigin.x - lowerRackExtension * 0.75;
    const rackY = dwOrigin.y - 45;
    const rackZ = dwOrigin.z;
    const rackW = 140, rackD = 135;

    // Draw Rack Base Perimeter
    const rp1 = project3D(rackX - rackW / 2, rackY, rackZ - rackD / 2, W, H);
    const rp2 = project3D(rackX + rackW / 2, rackY, rackZ - rackD / 2, W, H);
    const rp3 = project3D(rackX + rackW / 2, rackY, rackZ + rackD / 2, W, H);
    const rp4 = project3D(rackX - rackW / 2, rackY, rackZ + rackD / 2, W, H);

    if (rp1.visible && rp2.visible && rp3.visible && rp4.visible) {
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rp1.x, rp1.y);
      ctx.lineTo(rp2.x, rp2.y);
      ctx.lineTo(rp3.x, rp3.y);
      ctx.lineTo(rp4.x, rp4.y);
      ctx.closePath();
      ctx.stroke();

      // Draw Wire Tines Ribs along Lower Rack
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1;
      for (let tx = -rackW / 2 + 15; tx < rackW / 2; tx += 18) {
        const tp1 = project3D(rackX + tx, rackY, rackZ - rackD / 2, W, H);
        const tp2 = project3D(rackX + tx, rackY, rackZ + rackD / 2, W, H);
        const tineTop = project3D(rackX + tx, rackY + 18, rackZ + 10, W, H);

        if (tp1.visible && tp2.visible) {
          ctx.beginPath();
          ctx.moveTo(tp1.x, tp1.y);
          ctx.lineTo(tp2.x, tp2.y);
          ctx.stroke();
        }
        if (tp1.visible && tineTop.visible) {
          ctx.beginPath();
          ctx.moveTo(tp1.x, tp1.y);
          ctx.lineTo(tineTop.x, tineTop.y);
          ctx.stroke();
        }
      }
    }

    // 5. Render Upper Rack (Glassware & Cup Section)
    const upperRackY = dwOrigin.y + 35;
    const up1 = project3D(dwOrigin.x - 65, upperRackY, dwOrigin.z - 60, W, H);
    const up2 = project3D(dwOrigin.x + 65, upperRackY, dwOrigin.z - 60, W, H);
    const up3 = project3D(dwOrigin.x + 65, upperRackY, dwOrigin.z + 60, W, H);
    const up4 = project3D(dwOrigin.x - 65, upperRackY, dwOrigin.z + 60, W, H);

    if (up1.visible && up2.visible && up3.visible && up4.visible) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(up1.x, up1.y);
      ctx.lineTo(up2.x, up2.y);
      ctx.lineTo(up3.x, up3.y);
      ctx.lineTo(up4.x, up4.y);
      ctx.closePath();
      ctx.stroke();
    }

    // 6. Render Rotating Spray Arm & 360° Laser Sweep Cone
    const sprayY = dwOrigin.y - 55;
    const sprayCenter = project3D(dwOrigin.x, sprayY, dwOrigin.z, W, H);
    const armLen = 55;
    const spTip1 = project3D(
      dwOrigin.x + Math.cos(sprayRotationAngle) * armLen,
      sprayY,
      dwOrigin.z + Math.sin(sprayRotationAngle) * armLen,
      W, H
    );
    const spTip2 = project3D(
      dwOrigin.x - Math.cos(sprayRotationAngle) * armLen,
      sprayY,
      dwOrigin.z - Math.sin(sprayRotationAngle) * armLen,
      W, H
    );

    if (sprayCenter.visible && spTip1.visible && spTip2.visible) {
      // Rotating Spray Blades
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(spTip1.x, spTip1.y);
      ctx.lineTo(spTip2.x, spTip2.y);
      ctx.stroke();

      // Center Hub
      ctx.fillStyle = '#22D3EE';
      ctx.beginPath();
      ctx.arc(sprayCenter.x, sprayCenter.y, 4 * sprayCenter.scale, 0, Math.PI * 2);
      ctx.fill();

      // Show Spray Laser Sweep Cone
      if (showSprayLaserSweep) {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
        ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.3) {
          const cp = project3D(
            dwOrigin.x + Math.cos(a) * (armLen + 10),
            sprayY + 25,
            dwOrigin.z + Math.sin(a) * (armLen + 10),
            W, H
          );
          if (a === 0) ctx.moveTo(cp.x, cp.y);
          else ctx.lineTo(cp.x, cp.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Active clearance text HUD in 3D space
        const textPos = project3D(dwOrigin.x + 30, sprayY + 30, dwOrigin.z, W, H);
        if (textPos.visible) {
          ctx.fillStyle = '#22D3EE';
          ctx.font = '10px monospace';
          ctx.fillText(`CLEARANCE: ${activeStep.expectedTelemetry?.sprayArmClearanceMm || 52.0} mm (PASS)`, textPos.x, textPos.y);
        }
      }
    }

    // 7. Render Kitchen Counter & Dishware Stacks on Left
    const counterX = -120, counterY = -40, counterZ = 20;
    const cpTop1 = project3D(counterX - 50, counterY, counterZ - 60, W, H);
    const cpTop2 = project3D(counterX + 50, counterY, counterZ - 60, W, H);
    const cpTop3 = project3D(counterX + 50, counterY, counterZ + 60, W, H);
    const cpTop4 = project3D(counterX - 50, counterY, counterZ + 60, W, H);

    if (cpTop1.visible && cpTop2.visible && cpTop3.visible && cpTop4.visible) {
      ctx.fillStyle = 'rgba(51, 65, 85, 0.4)';
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cpTop1.x, cpTop1.y);
      ctx.lineTo(cpTop2.x, cpTop2.y);
      ctx.lineTo(cpTop3.x, cpTop3.y);
      ctx.lineTo(cpTop4.x, cpTop4.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Draw Ceramic Dinner Plates
    // If not grasped, plate is on counter or in rack slot #4
    let plateX = -110, plateY = -30, plateZ = 20;
    let plateTilt = 0;
    if (activeGraspedObject === 'plate') {
      plateX = eeX;
      plateY = eeY - 10;
      plateZ = eeZ;
      plateTilt = 0.25;
    } else if (currentStepIndex >= 12) {
      // Plate is seated in lower rack slot #4
      plateX = rackX + 15;
      plateY = rackY + 16;
      plateZ = rackZ - 10;
      plateTilt = 0.35; // 15-20 deg tilt resting on rack tines
    }

    const platePos = project3D(plateX, plateY, plateZ, W, H);
    if (platePos.visible) {
      ctx.save();
      ctx.translate(platePos.x, platePos.y);
      ctx.scale(platePos.scale, platePos.scale * 0.45);
      ctx.rotate(plateTilt);

      // Plate outer rim
      ctx.fillStyle = activeGraspedObject === 'plate' ? '#FDE047' : '#F1F5F9';
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Plate inner circle
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      if (showBoundingBoxes) {
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.6)';
        ctx.strokeRect(platePos.x - 24 * platePos.scale, platePos.y - 12 * platePos.scale, 48 * platePos.scale, 24 * platePos.scale);
      }
    }

    // Draw Crystal Wine Glass
    let glassX = -125, glassY = -20, glassZ = 50;
    let glassInverted = false;
    if (activeGraspedObject === 'glass') {
      glassX = eeX;
      glassY = eeY;
      glassZ = eeZ;
      glassInverted = true;
    } else if (currentStepIndex >= 16) {
      // Glass is docked into Upper Stem Rack
      glassX = dwOrigin.x - 20;
      glassY = upperRackY - 15;
      glassZ = dwOrigin.z - 20;
      glassInverted = true;
    }

    const glassPos = project3D(glassX, glassY, glassZ, W, H);
    if (glassPos.visible) {
      ctx.strokeStyle = activeGraspedObject === 'glass' ? '#EC4899' : '#A5F3FC';
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(165, 243, 252, 0.25)';

      const s = glassPos.scale;
      const dir = glassInverted ? -1 : 1;

      // Base, stem, and bowl
      ctx.beginPath();
      ctx.arc(glassPos.x, glassPos.y + dir * 15 * s, 8 * s, 0, Math.PI * 2); // Base
      ctx.moveTo(glassPos.x, glassPos.y + dir * 15 * s);
      ctx.lineTo(glassPos.x, glassPos.y); // Stem
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(glassPos.x, glassPos.y - dir * 10 * s, 10 * s, 0, Math.PI); // Bowl
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (activeGraspedObject === 'glass') {
        ctx.fillStyle = '#F472B6';
        ctx.font = '10px monospace';
        ctx.fillText(`FRAGILE STEM: 3.8N CLAMP`, glassPos.x + 12, glassPos.y - 10);
      }
    }

    // 8. Render 3D Trajectory Spline & Motion Waypoints
    if (showTrajectory) {
      ctx.strokeStyle = '#A855F7';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);

      const waypoints = [
        { x: -110, y: 40, z: 25 },  // Pick Plate
        { x: -80, y: 75, z: 40 },   // Lift & Transit Arc
        { x: -20, y: 50, z: 40 },   // Enter Dishwasher
        { x: rackX + 15, y: rackY + 16, z: rackZ - 10 }, // Dock Slot #4
        { x: -125, y: 65, z: 50 },  // Pick Wine Glass
        { x: dwOrigin.x - 20, y: upperRackY - 15, z: dwOrigin.z - 20 } // Dock Top Glass
      ];

      ctx.beginPath();
      waypoints.forEach((wp, idx) => {
        const p = project3D(wp.x, wp.y, wp.z, W, H);
        if (p.visible) {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Waypoint Nodes
      waypoints.forEach((wp, idx) => {
        const p = project3D(wp.x, wp.y, wp.z, W, H);
        if (p.visible) {
          ctx.fillStyle = idx === 3 || idx === 5 ? '#10B981' : '#C084FC';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // 9. Render 7-DOF Robotic Arm Skeleton with Forward Kinematics
    const basePos = { x: -70, y: -60, z: -40 };
    const shoulderPos = { x: -70, y: 10, z: -40 };

    // Calculate elbow joint in 3D connecting shoulder to End-Effector
    const midX = (shoulderPos.x + eeX) / 2 + Math.sin(currentFrame * 0.05) * 15;
    const midY = (shoulderPos.y + eeY) / 2 + 35;
    const midZ = (shoulderPos.z + eeZ) / 2 + 20;

    const pBase = project3D(basePos.x, basePos.y, basePos.z, W, H);
    const pShoulder = project3D(shoulderPos.x, shoulderPos.y, shoulderPos.z, W, H);
    const pElbow = project3D(midX, midY, midZ, W, H);
    const pWrist = project3D(eeX, eeY + 12, eeZ, W, H);
    const pGripTip = project3D(eeX, eeY, eeZ, W, H);

    if (pBase.visible && pShoulder.visible && pElbow.visible && pWrist.visible && pGripTip.visible) {
      // 3D Robot Base Turntable
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#0EA5E9';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(pBase.x, pBase.y, 14 * pBase.scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Arm Links (Shoulder to Elbow, Elbow to Wrist)
      const linkGrad1 = ctx.createLinearGradient(pShoulder.x, pShoulder.y, pElbow.x, pElbow.y);
      linkGrad1.addColorStop(0, '#0284C7');
      linkGrad1.addColorStop(1, '#38BDF8');

      ctx.strokeStyle = linkGrad1;
      ctx.lineWidth = 8 * pElbow.scale;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(pBase.x, pBase.y);
      ctx.lineTo(pShoulder.x, pShoulder.y);
      ctx.lineTo(pElbow.x, pElbow.y);
      ctx.lineTo(pWrist.x, pWrist.y);
      ctx.stroke();

      // Forearm link
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 6 * pWrist.scale;
      ctx.beginPath();
      ctx.moveTo(pElbow.x, pElbow.y);
      ctx.lineTo(pWrist.x, pWrist.y);
      ctx.lineTo(pGripTip.x, pGripTip.y);
      ctx.stroke();

      // Spherical Joint Bearings
      [pShoulder, pElbow, pWrist].forEach((joint) => {
        ctx.fillStyle = '#0F172A';
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(joint.x, joint.y, 6 * joint.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Dual-Finger Compliant Gripper
      const fingerSpread = (gripperOpenMm / 50) * 12 * pGripTip.scale;
      ctx.strokeStyle = gripperForceN > 0 ? '#10B981' : '#F59E0B';
      ctx.lineWidth = 3;

      // Left Finger
      ctx.beginPath();
      ctx.moveTo(pGripTip.x - fingerSpread, pGripTip.y - 8);
      ctx.lineTo(pGripTip.x - fingerSpread, pGripTip.y + 12);
      ctx.stroke();

      // Right Finger
      ctx.beginPath();
      ctx.moveTo(pGripTip.x + fingerSpread, pGripTip.y - 8);
      ctx.lineTo(pGripTip.x + fingerSpread, pGripTip.y + 12);
      ctx.stroke();

      // Normal Force vector arrows if in contact
      if (showForceVectors && gripperForceN > 0) {
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pGripTip.x - fingerSpread, pGripTip.y + 2);
        ctx.lineTo(pGripTip.x - fingerSpread + 10, pGripTip.y + 2);
        ctx.moveTo(pGripTip.x + fingerSpread, pGripTip.y + 2);
        ctx.lineTo(pGripTip.x + fingerSpread - 10, pGripTip.y + 2);
        ctx.stroke();

        ctx.fillStyle = '#EF4444';
        ctx.font = '9px monospace';
        ctx.fillText(`${gripperForceN.toFixed(1)} N`, pGripTip.x + fingerSpread + 12, pGripTip.y + 5);
      }
    }

    // 10. Render Dense 3D Point Cloud Particles if LiDAR Mode or enabled
    if (showPointClouds || cameraMode === 'lidar_pointcloud') {
      const pcCount = cameraMode === 'lidar_pointcloud' ? 140 : 45;
      for (let i = 0; i < pcCount; i++) {
        const seed = (i * 9301 + 49297) % 233280;
        const pcz = (seed % 180) - 90;
        const pcx = ((seed * 7) % 260) - 130;
        const pcy = ((seed * 13) % 150) - 40;

        const pt = project3D(pcx, pcy, pcz, W, H);
        if (pt.visible) {
          const depthRatio = Math.max(0, Math.min(1, (pt.z - 200) / 600));
          ctx.fillStyle = cameraMode === 'lidar_pointcloud'
            ? `hsl(${260 - depthRatio * 180}, 90%, 65%)`
            : 'rgba(56, 189, 248, 0.45)';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, cameraMode === 'lidar_pointcloud' ? 2 : 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 11. HUD Video Recording & Metrology Telemetry Overlay
    ctx.save();
    // Top Left REC Banner
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.fillRect(12, 12, 280, 80);
    ctx.strokeRect(12, 12, 280, 80);

    ctx.fillStyle = isPlaying ? '#EF4444' : '#94A3B8';
    ctx.beginPath();
    ctx.arc(26, 28, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`3D SPATIAL VIDEO PROGRESSION`, 38, 31);

    ctx.font = '10px monospace';
    ctx.fillStyle = '#38BDF8';
    const minutes = Math.floor(normalizedTimeSec / 60).toString().padStart(2, '0');
    const seconds = (normalizedTimeSec % 60).toFixed(2).padStart(5, '0');
    ctx.fillText(`TIME: ${minutes}:${seconds} | FRAME: ${Math.floor(currentFrame)}/${TOTAL_FRAMES}`, 24, 52);

    ctx.fillStyle = '#CBD5E1';
    ctx.fillText(`STEP ${activeStep.stepNumber}/22: [${activeStep.subsystem}]`, 24, 70);
    ctx.fillText(`RISK: ${activeStep.riskLevel.toUpperCase()}`, 24, 84);

    // Top Right Camera Mode Indicator
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(W - 220, 12, 208, 68);
    ctx.strokeRect(W - 220, 12, 208, 68);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(`CAMERA: ${cameraMode.toUpperCase()}`, W - 208, 28);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '9px monospace';
    ctx.fillText(`YAW: ${(camYaw * 180 / Math.PI).toFixed(1)}° | PITCH: ${(camPitch * 180 / Math.PI).toFixed(1)}°`, W - 208, 44);
    ctx.fillText(`DISTANCE: ${camDistance.toFixed(0)}mm | FOV: 65°`, W - 208, 58);
    ctx.fillText(`END-EFF: [${eeX.toFixed(0)}, ${eeY.toFixed(0)}, ${eeZ.toFixed(0)}] mm`, W - 208, 72);

    ctx.restore();
  }, [
    dimensions, camYaw, camPitch, camDistance, camPan, cameraMode,
    currentFrame, currentStepIndex, activeStep, lowerRackExtension,
    eeX, eeY, eeZ, gripperOpenMm, gripperForceN, activeGraspedObject,
    sprayRotationAngle, showTrajectory, showPointClouds, showForceVectors,
    showBoundingBoxes, showSprayLaserSweep, isPlaying, TOTAL_FRAMES, TOTAL_DURATION_SEC, project3D
  ]);

  // -------------------------------------------------------------
  // SECONDARY PICTURE-IN-PICTURE (PIP) RENDER LOOP
  // -------------------------------------------------------------
  useEffect(() => {
    if (!showPip) return;
    const pipCanvas = pipCanvasRef.current;
    if (!pipCanvas) return;
    const pipCtx = pipCanvas.getContext('2d');
    if (!pipCtx) return;

    pipCanvas.width = 180;
    pipCanvas.height = 120;

    pipCtx.fillStyle = '#0F172A';
    pipCtx.fillRect(0, 0, 180, 120);

    if (pipMode === 'eye_in_hand') {
      // Eye in Hand RGB-D Gripper Camera Feed
      pipCtx.fillStyle = '#1E293B';
      pipCtx.fillRect(10, 10, 160, 100);

      // Draw crosshairs
      pipCtx.strokeStyle = '#38BDF8';
      pipCtx.lineWidth = 1;
      pipCtx.beginPath();
      pipCtx.moveTo(90, 20);
      pipCtx.lineTo(90, 100);
      pipCtx.moveTo(30, 60);
      pipCtx.lineTo(150, 60);
      pipCtx.stroke();

      // Gripper fingers in frame
      pipCtx.fillStyle = '#0284C7';
      pipCtx.fillRect(25, 45, 20, 30);
      pipCtx.fillRect(135, 45, 20, 30);

      // Target Object in center
      if (activeGraspedObject === 'plate') {
        pipCtx.fillStyle = '#FDE047';
        pipCtx.beginPath();
        pipCtx.arc(90, 60, 28, 0, Math.PI * 2);
        pipCtx.fill();
      } else if (activeGraspedObject === 'glass') {
        pipCtx.fillStyle = '#F472B6';
        pipCtx.beginPath();
        pipCtx.arc(90, 60, 14, 0, Math.PI * 2);
        pipCtx.fill();
      }

      pipCtx.fillStyle = '#F8FAFC';
      pipCtx.font = 'bold 9px monospace';
      pipCtx.fillText(`EYE-IN-HAND RGB-D (1080p)`, 14, 22);
    } else {
      // Tactile GelSight Dual-Finger Pressure Grid Heatmap
      pipCtx.fillStyle = '#111827';
      pipCtx.fillRect(10, 10, 160, 100);

      const rows = 6;
      const cols = 8;
      const cellW = 160 / cols;
      const cellH = 100 / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const distToCenter = Math.sqrt((r - 2.5) ** 2 + (c - 3.5) ** 2);
          const intensity = gripperForceN > 0
            ? Math.max(0, 1 - distToCenter / 3.5) * (gripperForceN / 15)
            : 0.05;
          pipCtx.fillStyle = `rgba(239, 68, 68, ${intensity})`;
          pipCtx.fillRect(10 + c * cellW, 10 + r * cellH, cellW - 1, cellH - 1);
        }
      }

      pipCtx.fillStyle = '#F8FAFC';
      pipCtx.font = 'bold 9px monospace';
      pipCtx.fillText(`GELSIGHT TACTILE ARRAY`, 14, 22);
      pipCtx.fillText(`FORCE: ${gripperForceN.toFixed(1)} N`, 14, 102);
    }
  }, [showPip, pipMode, gripperForceN, activeGraspedObject]);

  // Snapshot PNG Export
  const captureSnapshot = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `PhysicalAI_Spatial3D_Step_${activeStep.stepNumber}_Frame_${Math.floor(currentFrame)}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    onLogEvent?.(`[3D-SPATIAL] Captured snapshot at Step ${activeStep.stepNumber}.`, 'interaction');
  };

  return (
    <div className={`space-y-4 text-left ${isFullscreen ? 'fixed inset-0 z-50 bg-[#0B0F17] p-6 overflow-y-auto' : ''}`}>
      
      {/* 3D CANVAS VIEWPORT WRAPPER */}
      <div 
        ref={containerRef}
        className="relative bg-[#0B0F17] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] overflow-hidden rounded-none"
      >
        {/* Main 3D Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="w-full block cursor-grab active:cursor-grabbing select-none"
        />

        {/* PIP Mini Inset */}
        {showPip && (
          <div className="absolute bottom-4 right-4 bg-slate-900 border border-slate-700 shadow-xl p-1 z-20">
            <div className="flex items-center justify-between px-1 pb-1 text-[8.5px] font-mono text-slate-300">
              <span className="font-bold flex items-center gap-1">
                <Camera className="w-3 h-3 text-cyan-400" />
                {pipMode === 'eye_in_hand' ? 'WRIST CAM' : 'GELSIGHT'}
              </span>
              <button
                onClick={() => setPipMode(pipMode === 'eye_in_hand' ? 'tactile_gelsight' : 'eye_in_hand')}
                className="text-[8px] text-cyan-400 hover:underline cursor-pointer"
              >
                SWITCH
              </button>
            </div>
            <canvas ref={pipCanvasRef} className="w-[170px] h-[110px] block bg-black" />
          </div>
        )}

        {/* Top Control Bar floating inside canvas */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-10">
          <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-sm border border-slate-700 px-2.5 py-1.5">
            <Video className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] font-black text-white uppercase tracking-wider">
              SPATIAL 3D METROLOGY FEED
            </span>
          </div>

          {/* Camera View Angle Selector */}
          <div className="pointer-events-auto flex items-center gap-1 bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-1">
            {[
              { id: 'orbit', label: '🎥 ORBIT 3D' },
              { id: 'eye_in_hand', label: '👁️ WRIST CAM' },
              { id: 'top_down', label: '📐 TOP-DOWN' },
              { id: 'front_chamber', label: '🚪 FRONT' },
              { id: 'stress_fea', label: '⚡ FEA STRESS' },
              { id: 'lidar_pointcloud', label: '☁️ LiDAR' }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => applyCameraPreset(btn.id as CameraViewMode)}
                className={`px-2 py-1 text-[9px] font-mono font-bold tracking-tight uppercase cursor-pointer transition ${
                  cameraMode === btn.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-transparent text-slate-300 hover:bg-slate-800'
                }`}
              >
                {btn.label}
              </button>
            ))}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 text-slate-400 hover:text-white cursor-pointer ml-1"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Visual Overlay Toggles Pill */}
        <div className="absolute bottom-4 left-4 pointer-events-auto flex flex-wrap items-center gap-1.5 bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-1.5 z-10">
          <span className="text-[9px] font-mono text-slate-400 font-bold uppercase mr-1">LAYERS:</span>
          {[
            { label: 'TRAJECTORY', active: showTrajectory, toggle: () => setShowTrajectory(!showTrajectory) },
            { label: 'POINT CLOUD', active: showPointClouds, toggle: () => setShowPointClouds(!showPointClouds) },
            { label: 'FORCE N', active: showForceVectors, toggle: () => setShowForceVectors(!showForceVectors) },
            { label: 'LASER SWEEP', active: showSprayLaserSweep, toggle: () => setShowSprayLaserSweep(!showSprayLaserSweep) },
            { label: 'PIP CAM', active: showPip, toggle: () => setShowPip(!showPip) },
            { label: 'AUTO-ORBIT', active: autoRotate, toggle: () => setAutoRotate(!autoRotate) }
          ].map((layer, idx) => (
            <button
              key={idx}
              onClick={layer.toggle}
              className={`px-2 py-0.5 text-[8.5px] font-mono font-bold tracking-wider uppercase cursor-pointer border transition ${
                layer.active
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {layer.label}
            </button>
          ))}
          <button
            onClick={captureSnapshot}
            className="px-2 py-0.5 text-[8.5px] font-mono font-bold tracking-wider uppercase cursor-pointer bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1"
            title="Download Snapshot PNG"
          >
            <Download className="w-3 h-3" />
            SNAP
          </button>
        </div>
      </div>

      {/* VIDEO SCRUBBER & TIMELINE PROGRESSION CONTROLLER */}
      <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-3">
        
        {/* Timeline Slider with 22-Step Keyframe Markers */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-900">TIMELINE PROGRESSION</span>
              <span className="text-[10px] bg-neutral-100 border border-neutral-300 px-2 py-0.5 font-bold text-neutral-700">
                FRAME: {Math.floor(currentFrame)} / {TOTAL_FRAMES}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-indigo-700">
                {Math.floor(normalizedTimeSec / 60).toString().padStart(2, '0')}:{(normalizedTimeSec % 60).toFixed(2).padStart(5, '0')}
              </span>
              <span className="text-neutral-400">/</span>
              <span className="text-neutral-500">00:44.00</span>
            </div>
          </div>

          {/* Interactive Range Scrubber */}
          <div className="relative pt-1 pb-2">
            <input
              type="range"
              min={0}
              max={TOTAL_FRAMES - 1}
              value={currentFrame}
              onChange={(e) => setCurrentFrame(Number(e.target.value))}
              className="w-full h-3 bg-neutral-200 rounded-none appearance-none cursor-pointer accent-indigo-600 border border-neutral-400"
            />

            {/* 22 Keyframe step tick markers overlay */}
            <div className="absolute left-0 right-0 top-1.5 flex justify-between pointer-events-none px-1">
              {DISHWASHER_22_STEPS.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;
                return (
                  <div
                    key={step.stepNumber}
                    className={`w-1 h-3 -mt-0.5 transition ${
                      isCurrent
                        ? 'bg-red-500 scale-y-125'
                        : isPassed
                        ? 'bg-emerald-500'
                        : 'bg-neutral-400'
                    }`}
                    title={`Step ${step.stepNumber}: ${step.title}`}
                  />
                );
              })}
            </div>
          </div>

          {/* 22 Step Keyframe Flag Chips */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
            {DISHWASHER_22_STEPS.map((step, idx) => {
              const isCurrent = currentStepIndex === idx;
              let riskBadgeColor = 'text-neutral-600 bg-neutral-100';
              if (step.riskLevel === RiskLevel.LEVEL_D_CODE_DEVICE) riskBadgeColor = 'text-red-700 bg-red-50 border-red-200';
              if (step.riskLevel === RiskLevel.LEVEL_C_WORKFLOW) riskBadgeColor = 'text-amber-700 bg-amber-50 border-amber-200';

              return (
                <button
                  key={step.stepNumber}
                  onClick={() => seekToStep(idx)}
                  className={`px-2.5 py-1 text-[9px] font-mono font-bold tracking-tight shrink-0 border cursor-pointer transition text-left flex flex-col gap-0.5 ${
                    isCurrent
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-[#FCFAF7] text-neutral-700 border-neutral-300 hover:border-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>STEP {step.stepNumber}</span>
                    <span className={`text-[7.5px] px-1 py-0.2 border ${isCurrent ? 'bg-neutral-800 text-white border-neutral-700' : riskBadgeColor}`}>
                      {step.subsystem}
                    </span>
                  </div>
                  <span className="text-[8px] truncate max-w-[120px] font-sans font-normal opacity-80">
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Video Transport Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-200">
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => seekToStep(0)}
              className="p-2 border border-neutral-300 hover:border-neutral-900 bg-white hover:bg-neutral-100 cursor-pointer"
              title="Rewind to Start"
            >
              <RotateCcw className="w-4 h-4 text-neutral-800" />
            </button>
            <button
              onClick={() => seekToStep(Math.max(0, currentStepIndex - 1))}
              className="p-2 border border-neutral-300 hover:border-neutral-900 bg-white hover:bg-neutral-100 cursor-pointer"
              title="Previous Step"
            >
              <SkipBack className="w-4 h-4 text-neutral-800" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 border-2 border-[#1A1A1A] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'PAUSE VIDEO' : 'PLAY 3D PROGRESSION'}
            </button>
            <button
              onClick={() => seekToStep(Math.min(DISHWASHER_22_STEPS.length - 1, currentStepIndex + 1))}
              className="p-2 border border-neutral-300 hover:border-neutral-900 bg-white hover:bg-neutral-100 cursor-pointer"
              title="Next Step"
            >
              <SkipForward className="w-4 h-4 text-neutral-800" />
            </button>
          </div>

          {/* Speed Multiplier & Loop */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">SPEED:</span>
            <div className="flex border border-neutral-300">
              {[0.25, 0.5, 1.0, 2.0, 4.0].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 text-[10px] font-mono font-bold cursor-pointer transition ${
                    playbackSpeed === speed
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`px-2.5 py-1 text-[10px] font-mono font-bold border cursor-pointer transition ${
                isLooping
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                  : 'bg-white text-neutral-400 border-neutral-300'
              }`}
            >
              LOOP: {isLooping ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Active Step Live Details Card */}
        <div className="bg-[#FCFAF7] border border-[#1A1A1A] p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-[#1A1A1A] text-white px-2 py-0.5">
                STEP {activeStep.stepNumber} / 22
              </span>
              <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase bg-indigo-50 border border-indigo-200 px-2 py-0.5">
                SUBSYSTEM: {activeStep.subsystem}
              </span>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 border ${
                activeStep.riskLevel === RiskLevel.LEVEL_D_CODE_DEVICE
                  ? 'bg-red-100 text-red-800 border-red-300'
                  : activeStep.riskLevel === RiskLevel.LEVEL_C_WORKFLOW
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                {activeStep.riskLevel}
              </span>
            </div>
            <h4 className="text-sm font-serif font-black text-neutral-900">
              {activeStep.title}
            </h4>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed">
              {activeStep.description}
            </p>
          </div>

          <div className="bg-neutral-900 text-neutral-100 p-2.5 font-mono text-[10.5px] border border-neutral-800 shrink-0 space-y-1 min-w-[220px]">
            <div className="text-[9px] text-neutral-400 uppercase font-bold border-b border-neutral-800 pb-0.5">
              Live Hardware Command
            </div>
            <div className="text-emerald-400 font-bold truncate max-w-[280px]">
              $ {activeStep.hardwareCommand}
            </div>
            <div className="text-[9.5px] text-neutral-400 flex items-center justify-between pt-1">
              <span>Grip Force Target:</span>
              <strong className="text-white">{activeStep.expectedTelemetry?.gripperForceN ? `${activeStep.expectedTelemetry.gripperForceN} N` : '0.0 N'}</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
