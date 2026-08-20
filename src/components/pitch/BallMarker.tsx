import React from 'react';
import { Ball } from '../../types/tactics';

interface BallMarkerProps {
  ball: Ball;
  isSelected: boolean;
  isInteractive?: boolean;
  onPointerDown: (e: React.PointerEvent, ball: Ball) => void;
  onClick: (e: React.MouseEvent, ball: Ball) => void;
}

export const BallMarker: React.FC<BallMarkerProps> = ({
  ball,
  isSelected,
  isInteractive = true,
  onPointerDown,
  onClick,
}) => {
  const radius = 1.3;

  return (
    <g
      className={`ball-marker-group ${isInteractive ? 'cursor-grab active:cursor-grabbing' : ''}`}
      transform={`translate(${ball.x}, ${ball.y})`}
      onPointerDown={(e) => isInteractive && onPointerDown(e, ball)}
      onClick={(e) => onClick(e, ball)}
      style={{ touchAction: 'none' }}
    >
      {/* Selection Glow */}
      {isSelected && (
        <circle
          cx="0"
          cy="0"
          r={radius + 1.0}
          fill="none"
          stroke="#facc15"
          strokeWidth="0.6"
          strokeDasharray="1,1"
          className="animate-pulse"
        />
      )}

      {/* Shadow */}
      <circle cx="0.3" cy="0.3" r={radius} fill="rgba(0,0,0,0.5)" className="pointer-events-none" />

      {/* Outer Ball Body */}
      <circle
        cx="0"
        cy="0"
        r={radius}
        fill="#ffffff"
        stroke="#1e293b"
        strokeWidth="0.3"
        className="transition-transform duration-75 hover:scale-125"
      />

      {/* Classic Football Pattern (Center pentagon + patches) */}
      <polygon points="0,-0.5 0.5,-0.2 0.3,0.5 -0.3,0.5 -0.5,-0.2" fill="#0f172a" />
      <circle cx="-0.8" cy="-0.6" r="0.35" fill="#0f172a" />
      <circle cx="0.8" cy="-0.6" r="0.35" fill="#0f172a" />
      <circle cx="0.9" cy="0.6" r="0.35" fill="#0f172a" />
      <circle cx="-0.9" cy="0.6" r="0.35" fill="#0f172a" />
    </g>
  );
};
