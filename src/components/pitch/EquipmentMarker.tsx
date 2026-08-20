import React from 'react';
import { Equipment } from '../../types/tactics';

interface EquipmentMarkerProps {
  equipment: Equipment;
  isSelected: boolean;
  isInteractive?: boolean;
  onPointerDown: (e: React.PointerEvent, eq: Equipment) => void;
  onClick: (e: React.MouseEvent, eq: Equipment) => void;
}

export const EquipmentMarker: React.FC<EquipmentMarkerProps> = ({
  equipment,
  isSelected,
  isInteractive = true,
  onPointerDown,
  onClick,
}) => {
  const { type, x, y, color = '#f97316', rotation = 0, label } = equipment;

  const renderContent = () => {
    switch (type) {
      case 'cone':
        return (
          <g>
            <ellipse cx="0" cy="0.4" rx="1.2" ry="0.6" fill="rgba(0,0,0,0.3)" />
            <polygon points="0,-1.6 1.1,0.8 -1.1,0.8" fill={color} stroke="#ffffff" strokeWidth="0.2" />
            <line x1="-0.6" y1="0.2" x2="0.6" y2="0.2" stroke="#ffffff" strokeWidth="0.3" />
          </g>
        );
      case 'pole':
        return (
          <g>
            <circle cx="0" cy="0" r="1" fill="#facc15" stroke="#ca8a04" strokeWidth="0.3" />
            <circle cx="0" cy="0" r="0.4" fill="#0f172a" />
          </g>
        );
      case 'mini-goal':
        return (
          <g>
            <rect x="-3" y="-1.5" width="6" height="3" rx="0.3" fill="rgba(255,255,255,0.2)" stroke="#ffffff" strokeWidth="0.4" strokeDasharray="0.8,0.8" />
            <line x1="-3" y1="1.5" x2="3" y2="1.5" stroke="#ef4444" strokeWidth="0.6" />
          </g>
        );
      case 'mannequin':
        return (
          <g>
            <rect x="-1" y="-2" width="2" height="4" rx="0.5" fill="#e2e8f0" stroke="#475569" strokeWidth="0.3" />
            <circle cx="0" cy="-2.5" r="0.8" fill="#e2e8f0" stroke="#475569" strokeWidth="0.3" />
          </g>
        );
      case 'ladder':
        return (
          <g>
            <rect x="-1" y="-5" width="2" height="10" fill="none" stroke="#facc15" strokeWidth="0.3" />
            {[-4, -2, 0, 2, 4].map((stepY) => (
              <line key={stepY} x1="-1" y1={stepY} x2="1" y2={stepY} stroke="#facc15" strokeWidth="0.3" />
            ))}
          </g>
        );
      case 'passing-gate':
        return (
          <g>
            <circle cx="-2.5" cy="0" r="0.8" fill="#f97316" stroke="#ffffff" strokeWidth="0.2" />
            <circle cx="2.5" cy="0" r="0.8" fill="#f97316" stroke="#ffffff" strokeWidth="0.2" />
            <line x1="-2.5" y1="0" x2="2.5" y2="0" stroke="#f97316" strokeWidth="0.4" strokeDasharray="0.8,0.8" />
          </g>
        );
      default:
        return <circle cx="0" cy="0" r="1.5" fill={color} />;
    }
  };

  return (
    <g
      className={`equipment-marker-group ${isInteractive ? 'cursor-grab active:cursor-grabbing' : ''}`}
      transform={`translate(${x}, ${y}) rotate(${rotation})`}
      onPointerDown={(e) => isInteractive && onPointerDown(e, equipment)}
      onClick={(e) => onClick(e, equipment)}
      style={{ touchAction: 'none' }}
    >
      {isSelected && (
        <rect
          x="-3"
          y="-3"
          width="6"
          height="6"
          rx="1"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="0.4"
          strokeDasharray="1,1"
          className="animate-pulse"
        />
      )}
      {renderContent()}
      {label && (
        <text x="0" y="3" fill="#ffffff" fontSize="1.4" textAnchor="middle" fontWeight="bold">
          {label}
        </text>
      )}
    </g>
  );
};
