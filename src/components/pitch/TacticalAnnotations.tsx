import React from 'react';
import { Annotation } from '../../types/tactics';
import { generateCurvedPath, generateWavyPath, Point } from '../../utils/pitchGeometry';

interface TacticalAnnotationsProps {
  annotations: Annotation[];
  selectedAnnotationId: string | null;
  onSelectAnnotation: (id: string | null) => void;
  onDeleteAnnotation?: (id: string) => void;
}

export const TacticalAnnotations: React.FC<TacticalAnnotationsProps> = ({
  annotations,
  selectedAnnotationId,
  onSelectAnnotation,
}) => {
  // Arrowhead marker generator helper
  const colors = [
    '#ffffff', '#dc2626', '#2563eb', '#16a34a', '#eab308', '#ea580c', '#9333ea', '#06b6d4', '#f43f5e'
  ];

  return (
    <g className="tactical-annotations-layer">
      {/* SVG Marker Definitions for sharp arrowheads */}
      <defs>
        {colors.map((c) => {
          const safeId = c.replace('#', '');
          return (
            <React.Fragment key={safeId}>
              {/* Solid standard arrow */}
              <marker
                id={`arrowhead-${safeId}`}
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M 0 0.5 L 6 3 L 0 5.5 z" fill={c} />
              </marker>

              {/* Open / Pass Arrow */}
              <marker
                id={`arrowhead-pass-${safeId}`}
                markerWidth="7"
                markerHeight="7"
                refX="6"
                refY="3.5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M 0 1 L 6 3.5 L 0 6 L 1.5 3.5 z" fill={c} />
              </marker>
            </React.Fragment>
          );
        })}
      </defs>

      {annotations.map((ann) => {
        const isSelected = ann.id === selectedAnnotationId;
        const colorId = (ann.color || '#ffffff').replace('#', '');
        const strokeWidth = ann.strokeWidth || 2;
        const pts = ann.points || [];

        if (pts.length === 0) return null;

        const dashArray =
          ann.style === 'dashed'
            ? '3,2'
            : ann.style === 'dotted'
            ? '1,1.5'
            : undefined;

        // Render based on type
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
                      y={(p1.y + p2.y) / 2 - 1.5}
                      fill={ann.color}
                      fontSize="1.8"
                      fontWeight="bold"
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
                    strokeDasharray="2,1.5"
                    strokeLinecap="round"
                    markerEnd={`url(#arrowhead-pass-${colorId})`}
                  />
                  {ann.text && (
                    <text
                      x={(p1.x + p2.x) / 2}
                      y={(p1.y + p2.y) / 2 - 1.5}
                      fill={ann.color}
                      fontSize="1.8"
                      fontWeight="bold"
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
                      y={lastPt.y - 2}
                      fill={ann.color}
                      fontSize="1.8"
                      fontWeight="bold"
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
              const pathD = generateWavyPath(p1, p2, 3.5, 1.2);
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
                      y={(p1.y + p2.y) / 2 - 1.8}
                      fill={ann.color}
                      fontSize="1.8"
                      fontWeight="bold"
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
                    rx="1"
                    fill={ann.fillColor || ann.color}
                    fillOpacity={ann.fillOpacity ?? 0.18}
                    stroke={ann.color}
                    strokeWidth={strokeWidth * 0.75}
                    strokeDasharray={dashArray}
                  />
                  {ann.text && (
                    <text
                      x={x + w / 2}
                      y={y + h / 2 + 0.6}
                      fill={ann.color}
                      fontSize="2.0"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="select-none"
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
                    fillOpacity={ann.fillOpacity ?? 0.18}
                    stroke={ann.color}
                    strokeWidth={strokeWidth * 0.75}
                    strokeDasharray={dashArray}
                  />
                  {ann.text && (
                    <text
                      x={center.x}
                      y={center.y + 0.6}
                      fill={ann.color}
                      fontSize="2.0"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="select-none"
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
                    x="-6"
                    y="-2"
                    width="12"
                    height="4"
                    rx="1"
                    fill="rgba(15, 23, 42, 0.85)"
                    stroke={ann.color}
                    strokeWidth="0.4"
                  />
                  <text
                    x="0"
                    y="0.5"
                    fill="#ffffff"
                    fontSize="1.8"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="select-none"
                  >
                    {ann.text || 'Tactical Note'}
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
              isSelected ? 'opacity-100 filter drop-shadow(0 0 4px #38bdf8)' : 'hover:opacity-90'
            }`}
          >
            {renderAnnotationContent()}
          </g>
        );
      })}
    </g>
  );
};
