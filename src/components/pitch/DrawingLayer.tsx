import React, { useEffect, useState } from 'react';
import { Annotation, AnnotationType, DrawingTool, MarkingSize } from '../../types/tactics';
import {
  generateCurvedPath,
  generateWavyPath,
  Point,
  getStrokeWidthForSize,
} from '../../utils/pitchGeometry';

interface DrawingLayerProps {
  activeTool: DrawingTool;
  drawingColor: string;
  markingSize: MarkingSize;
  drawingStyle: 'solid' | 'dashed' | 'dotted' | 'wavy';
  activeZoneText: string;
  onAddAnnotation: (ann: Annotation) => void;
  svgRef: React.RefObject<SVGSVGElement>;
}

export const DrawingLayer: React.FC<DrawingLayerProps> = ({
  activeTool,
  drawingColor,
  markingSize,
  drawingStyle,
  activeZoneText,
  onAddAnnotation,
  svgRef,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [laserPoints, setLaserPoints] = useState<{ x: number; y: number; time: number }[]>([]);

  const strokeWidth = getStrokeWidthForSize(markingSize);

  // Laser decay ticker
  useEffect(() => {
    if (activeTool !== 'laser' || laserPoints.length === 0) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setLaserPoints((prev) => prev.filter((p) => now - p.time < 1200));
    }, 60);
    return () => clearInterval(interval);
  }, [activeTool, laserPoints.length]);

  const getPitchCoords = (e: React.PointerEvent): Point | null => {
    if (!svgRef.current) return null;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    return {
      x: Math.max(0, Math.min(100, Math.round(svgP.x * 10) / 10)),
      y: Math.max(0, Math.min(100, Math.round(svgP.y * 10) / 10)),
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (activeTool === 'select' || activeTool === 'eraser') return;
    const coords = getPitchCoords(e);
    if (!coords) return;

    (e.target as Element).setPointerCapture?.(e.pointerId);

    if (activeTool === 'laser') {
      setLaserPoints((prev) => [...prev, { ...coords, time: Date.now() }]);
      setIsDrawing(true);
      return;
    }

    if (activeTool === 'text') {
      const textNote = window.prompt('Enter tactical note / label:', activeZoneText || 'Run trigger');
      if (textNote) {
        onAddAnnotation({
          id: `ann-${Date.now()}`,
          type: 'text',
          points: [coords],
          color: drawingColor,
          strokeWidth,
          style: 'solid',
          text: textNote,
          size: markingSize,
        });
      }
      return;
    }

    setIsDrawing(true);
    setCurrentPoints([coords]);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    const coords = getPitchCoords(e);
    if (!coords) return;

    if (activeTool === 'laser') {
      setLaserPoints((prev) => [...prev, { ...coords, time: Date.now() }]);
      return;
    }

    if (activeTool === 'freehand') {
      setCurrentPoints((prev) => [...prev, coords]);
    } else {
      setCurrentPoints((prev) => {
        if (prev.length === 0) return [coords];
        if (activeTool === 'curved-run' && prev.length === 2) {
          return [prev[0], coords, prev[1]];
        }
        return [prev[0], coords];
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (activeTool === 'laser') return;

    if (currentPoints.length < 2) {
      setCurrentPoints([]);
      return;
    }

    let type: AnnotationType = 'arrow';
    let style = drawingStyle;

    switch (activeTool) {
      case 'pass':
        type = 'pass';
        style = 'dashed';
        break;
      case 'movement':
        type = 'arrow';
        style = 'solid';
        break;
      case 'curved-run':
        type = 'curved';
        break;
      case 'dribble':
        type = 'dribble';
        break;
      case 'zone-rect':
        type = 'zone-rect';
        break;
      case 'zone-circle':
        type = 'zone-circle';
        break;
      case 'freehand':
        type = 'freehand';
        break;
    }

    onAddAnnotation({
      id: `ann-${Date.now()}`,
      type,
      points: currentPoints,
      color: drawingColor,
      strokeWidth,
      style,
      text: activeZoneText || undefined,
      fillColor: drawingColor,
      fillOpacity: 0.12,
      size: markingSize,
    });

    setCurrentPoints([]);
  };

  const colorId = (drawingColor || '#ffffff').replace('#', '');
  const dashArray =
    drawingStyle === 'dashed'
      ? '2.2,1.5'
      : drawingStyle === 'dotted'
      ? '0.8,1.2'
      : undefined;

  const renderLivePreview = () => {
    if (currentPoints.length < 2) return null;
    const p1 = currentPoints[0];
    const p2 = currentPoints[currentPoints.length - 1];

    switch (activeTool) {
      case 'pass':
        return (
          <line
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke={drawingColor}
            strokeWidth={strokeWidth}
            strokeDasharray="1.8,1.2"
            markerEnd={`url(#arrowhead-pass-${colorId})`}
          />
        );
      case 'movement':
        return (
          <line
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke={drawingColor}
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray}
            markerEnd={`url(#arrowhead-${colorId})`}
          />
        );
      case 'curved-run': {
        const mid: Point = { x: (p1.x + p2.x) / 2 - 4, y: (p1.y + p2.y) / 2 - 4 };
        const pts = [p1, mid, p2];
        return (
          <path
            d={generateCurvedPath(pts)}
            fill="none"
            stroke={drawingColor}
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray}
            markerEnd={`url(#arrowhead-${colorId})`}
          />
        );
      }
      case 'dribble':
        return (
          <path
            d={generateWavyPath(p1, p2, markingSize)}
            fill="none"
            stroke={drawingColor}
            strokeWidth={strokeWidth}
            markerEnd={`url(#arrowhead-${colorId})`}
          />
        );
      case 'zone-rect': {
        const x = Math.min(p1.x, p2.x);
        const y = Math.min(p1.y, p2.y);
        const w = Math.abs(p2.x - p1.x);
        const h = Math.abs(p2.y - p1.y);
        return (
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            rx="0.8"
            fill={drawingColor}
            fillOpacity={0.12}
            stroke={drawingColor}
            strokeWidth={Math.max(0.5, strokeWidth * 0.7)}
            strokeDasharray={dashArray}
          />
        );
      }
      case 'zone-circle': {
        const r = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        return (
          <circle
            cx={p1.x}
            cy={p1.y}
            r={r}
            fill={drawingColor}
            fillOpacity={0.12}
            stroke={drawingColor}
            strokeWidth={Math.max(0.5, strokeWidth * 0.7)}
            strokeDasharray={dashArray}
          />
        );
      }
      case 'freehand': {
        let pathStr = `M ${currentPoints[0].x} ${currentPoints[0].y}`;
        for (let i = 1; i < currentPoints.length; i++) {
          pathStr += ` L ${currentPoints[i].x} ${currentPoints[i].y}`;
        }
        return (
          <path
            d={pathStr}
            fill="none"
            stroke={drawingColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        );
      }
      default:
        return null;
    }
  };

  const isInteractiveLayer = activeTool !== 'select' && activeTool !== 'eraser';

  return (
    <g
      className={`drawing-layer ${isInteractiveLayer ? 'cursor-crosshair' : 'pointer-events-none'}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      {isInteractiveLayer && (
        <rect x="0" y="0" width="100" height="100" fill="transparent" />
      )}

      {isDrawing && renderLivePreview()}

      {/* Prominent Laser Pointer */}
      {laserPoints.length > 0 && (
        <g className="pointer-events-none">
          {laserPoints.map((pt, i) => {
            const age = Date.now() - pt.time;
            const opacity = Math.max(0, 1 - age / 1200);
            return (
              <circle
                key={`laser-${i}`}
                cx={pt.x}
                cy={pt.y}
                r={1.8}
                fill="#ef4444"
                fillOpacity={opacity}
                filter="drop-shadow(0 0 6px #ef4444)"
              />
            );
          })}
        </g>
      )}
    </g>
  );
};
