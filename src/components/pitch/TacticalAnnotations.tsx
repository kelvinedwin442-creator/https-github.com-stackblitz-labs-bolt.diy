import React from 'react';
import { Annotation, MarkingSize } from '../../types/tactics';
import {
  generateCurvedPath,
  generateWavyPath,
  getStrokeWidthForSize,
  getFontSizeForSize,
} from '../../utils/pitchGeometry';

interface TacticalAnnotationsProps {
  annotations: Annotation[];
  selectedAnnotationId: string | null;
  globalMarkingSize?: MarkingSize;
  onSelectAnnotation: (id: string | null) => void;
  onDeleteAnnotation?: (id: string) => void;
}

export const TacticalAnnotations: React.FC<TacticalAnnotationsProps> = ({
  annotations,
  selectedAnnotationId,
  globalMarkingSize = 'small',
  onSelectAnnotation,
}) => {
  const colors = [
    '#ffffff', '#dc2626', '#2563eb', '#16a34a', '#eab308', '#ea580c', '#9333ea', '#06b6d4', '#f43f5e'
  ];

  return (
    <g className="tactical-annotations-layer">
      {/* Compact & Refined SVG Marker Definitions (Thinner & proportional arrowheads) */}
      <defs>
        {colors.map((c) => {
          const safeId = c.replace('#', '');
          return (
            <React.Fragment key={safeId}>
              {/* Solid Compact Arrow Head */}
              <marker
                id={`arrowhead-${safeId}`}
                markerWidth="4"
                markerHeight="4"
                refX="3.5"
                refY="2"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M 0 0.5 L 4 2 L 0 3.5 z" fill={c} />
              </marker>

              {/* Open / Pass Arrow Head */}
              <marker
                id={`arrowhead-pass-${safeId}`}
                markerWidth="4.5"
                markerHeight="4.5"
                refX="4"
                refY="2.25"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M 0 0.8 L 4 2.25 L 0 3.7 L 1 2.25 z" fill={c} />
              </marker>
            </React.Fragment>
          );
        })}
      </defs>

      {annotations.map((ann) => {
        const isSelected = ann.id === selectedAnnotationId;
        const colorId = (ann.color || '#ffffff').replace('#', '');
        const size = ann.size || globalMarkingSize;
        const strokeWidth = ann.strokeWidth || getStrokeWidthForSize(size);
        const fontSize = ann.fontSize || getFontSizeForSize(size);
        const pts = ann.points || [];

        if (pts.length === 0) return null;

        const dashArray =
          ann.style === 'dashed'
            ? '2.2,1.5'
            : ann.style === 'dotted'
            ? '0.8,1.2'
            : undefined;

        const renderAnnotationContent = () => {
          switch (ann.type) {
            case 'arrow': {
              if (pts.length < 2) return null;
              const [p1, p2] = pts;
              return (
                <g>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={ann.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={dashArray}
                    strokeLinecap="round"
                    markerEnd={`url(#arrowhead-${colorId})`}
                  />
                  {ann.text && (
                    <text
                      x={(p1.x + p2.x) / 2}
                      y={(p1.y + p2.y) / 2 - 1.2}
                      fill={ann.color}
                      fontSize={fontSize}
                      fontWeight="600"
                      textAnchor="middle"
                      className="select-none"
                    >
                      {ann.text}
                    </text>
                  )}
                </g>
              );
            }

            case 'pass': {
              if (pts.length < 2) return null;
              const [p1, p2] = pts;
              return (
                <g>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={ann.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray="1.8,1.2"
                    strokeLinecap="round"
                    markerEnd={`url(#arrowhead-pass-${colorId})`}
                  />
                  {ann.text && (
                    <text
                      x={(p1.x + p2.x) / 2}
                      y={(p1.y + p2.y) / 2 - 1.2}
                      fill={ann.color}
                      fontSize={fontSize}
                      fontWeight="600"
                      textAnchor="middle"
                      className="select-none"
                    >
                      {ann.text}
                    </text>
                  )}
                </g>
              );
            }

            case 'curved': {
              const pathD = generateCurvedPath(pts);
              const lastPt = pts[pts.length - 1];
              return (
                <g>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={ann.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={dashArray}
                    strokeLinecap="round"
                    markerEnd={`url(#arrowhead-${colorId})`}
                  />
                  {ann.text && (
                    <text
                      x={lastPt.x}
                      y={lastPt.y - 1.4}
                      fill={ann.color}
                      fontSize={fontSize}
                      fontWeight="600"
                      textAnchor="middle"
                      className="select-none"
                    >
                      {ann.text}
                    </text>
                  )}
                </g>
              );
            }

            case 'dribble': {
              if (pts.length < 2) return null;
              const [p1, p2] = pts;
              const pathD = generateWavyPath(p1, p2, size);
              return (
                <g>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={ann.color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    markerEnd={`url(#arrowhead-${colorId})`}
                  />
                  {ann.text && (
                    <text
                      x={(p1.x + p2.x) / 2}
                      y={(p1.y + p2.y) / 2 - 1.4}
                      fill={ann.color}
                      fontSize={fontSize}
                      fontWeight="600"
                      textAnchor="middle"
                      className="select-none"
                    >
                      {ann.text}
                    </text>
                  )}
                </g>
              );
            }

            case 'zone-rect': {
              if (pts.length < 2) return null;
              const p1 = pts[0];
              const p2 = pts[pts.length - 1];
              const x = Math.min(p1.x, p2.x);
              const y = Math.min(p1.y, p2.y);
              const w = Math.abs(p2.x - p1.x);
              const h = Math.abs(p2.y - p1.y);
              return (
                <g>
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    rx="0.8"
                    fill={ann.fillColor || ann.color}
                    fillOpacity={ann.fillOpacity ?? 0.12}
                    stroke={ann.color}
                    strokeWidth={Math.max(0.5, strokeWidth * 0.7)}
                    strokeDasharray={dashArray}
                  />
                  {ann.text && (
                    <text
                      x={x + w / 2}
                      y={y + h / 2 + 0.4}
                      fill={ann.color}
                      fontSize={fontSize}
                      fontWeight="600"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="select-none opacity-90"
                    >
                      {ann.text}
                    </text>
                  )}
                </g>
              );
            }

            case 'zone-circle': {
              if (pts.length < 2) return null;
              const [center, edge] = pts;
              const r = Math.hypot(edge.x - center.x, edge.y - center.y);
              return (
                <g>
                  <circle
                    cx={center.x}
                    cy={center.y}
                    r={r}
                    fill={ann.fillColor || ann.color}
                    fillOpacity={ann.fillOpacity ?? 0.12}
                    stroke={ann.color}
                    strokeWidth={Math.max(0.5, strokeWidth * 0.7)}
                    strokeDasharray={dashArray}
                  />
                  {ann.text && (
                    <text
                      x={center.x}
                      y={center.y + 0.4}
                      fill={ann.color}
                      fontSize={fontSize}
                      fontWeight="600"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="select-none opacity-90"
                    >
                      {ann.text}
                    </text>
                  )}
                </g>
              );
            }

            case 'freehand': {
              if (pts.length < 2) return null;
              let pathStr = `M ${pts[0].x} ${pts[0].y}`;
              for (let i = 1; i < pts.length; i++) {
                pathStr += ` L ${pts[i].x} ${pts[i].y}`;
              }
              return (
                <path
                  d={pathStr}
                  fill="none"
                  stroke={ann.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            }

            case 'text': {
              const p = pts[0];
              return (
                <g transform={`translate(${p.x}, ${p.y})`}>
                  <rect
                    x="-4.5"
                    y="-1.3"
                    width="9"
                    height="2.6"
                    rx="0.6"
                    fill="rgba(15, 23, 42, 0.85)"
                    stroke={ann.color}
                    strokeWidth="0.3"
                  />
                  <text
                    x="0"
                    y="0.2"
                    fill="#ffffff"
                    fontSize={fontSize}
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="select-none"
                  >
                    {ann.text || 'Note'}
                  </text>
                </g>
              );
            }

            default:
              return null;
          }
        };

        return (
          <g
            key={ann.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectAnnotation(ann.id);
            }}
            className={`annotation-item cursor-pointer transition-opacity ${
              isSelected ? 'opacity-100 filter drop-shadow(0 0 3px #38bdf8)' : 'hover:opacity-90'
            }`}
          >
            {renderAnnotationContent()}
          </g>
        );
      })}
    </g>
  );
};
