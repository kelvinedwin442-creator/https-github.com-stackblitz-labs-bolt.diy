import React from 'react';
import { Player, TeamConfig } from '../../types/tactics';
import { generateVisionCone } from '../../utils/pitchGeometry';

interface PlayerMarkerProps {
  player: Player;
  teamConfig: TeamConfig;
  isSelected: boolean;
  showLabels: boolean;
  showNumbers: boolean;
  showVisionCones: boolean;
  isInteractive?: boolean;
  onPointerDown: (e: React.PointerEvent, player: Player) => void;
  onClick: (e: React.MouseEvent, player: Player) => void;
  onDoubleClick?: (player: Player) => void;
}

export const PlayerMarker: React.FC<PlayerMarkerProps> = ({
  player,
  teamConfig,
  isSelected,
  showLabels,
  showNumbers,
  showVisionCones,
  isInteractive = true,
  onPointerDown,
  onClick,
  onDoubleClick,
}) => {
  const isGK = player.isGK;
  const fillColor = player.color || (isGK ? teamConfig.gkColor : teamConfig.primaryColor);
  const textColor = player.textColor || (isGK ? teamConfig.gkTextColor : teamConfig.textColor);
  const rotation = player.rotation ?? (player.team === 'home' ? 0 : 180);

  // Marker radius
  const radius = 2.4;

  return (
    <g
      className={`player-marker-group ${isInteractive ? 'cursor-grab active:cursor-grabbing' : ''}`}
      transform={`translate(${player.x}, ${player.y})`}
      onPointerDown={(e) => isInteractive && onPointerDown(e, player)}
      onClick={(e) => onClick(e, player)}
      onDoubleClick={() => onDoubleClick && onDoubleClick(player)}
      style={{ touchAction: 'none' }}
    >
      {/* Vision Cone if enabled */}
      {(showVisionCones || player.coneVisible) && (
        <path
          d={generateVisionCone(0, 0, rotation, 14, 50)}
          fill={fillColor}
          fillOpacity={0.16}
          stroke={fillColor}
          strokeWidth={0.3}
          strokeDasharray="1,1"
          className="pointer-events-none"
        />
      )}

      {/* Selected Halo / Glow */}
      {isSelected && (
        <circle
          cx="0"
          cy="0"
          r={radius + 1.2}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="0.8"
          strokeDasharray="1.5,1"
          className="animate-pulse"
        />
      )}

      {/* Drop Shadow for realistic depth */}
      <circle
        cx="0.3"
        cy="0.5"
        r={radius}
        fill="rgba(0, 0, 0, 0.4)"
        className="pointer-events-none"
      />

      {/* Main Jersey Circle */}
      <circle
        cx="0"
        cy="0"
        r={radius}
        fill={fillColor}
        stroke={isGK ? '#ffffff' : '#ffffff'}
        strokeWidth={isGK ? '0.6' : '0.5'}
        className="transition-transform duration-75 hover:scale-110"
      />

      {/* GK Gloves Indicator Ring if Goalkeeper */}
      {isGK && (
        <circle
          cx="0"
          cy="0"
          r={radius - 0.5}
          fill="none"
          stroke="#000000"
          strokeWidth="0.3"
          strokeDasharray="0.8,0.8"
        />
      )}

      {/* Direction Pointer Tick (small triangle showing facing orientation) */}
      <polygon
        points="0,-2.6 0.8,-3.4 -0.8,-3.4"
        fill="#ffffff"
        transform={`rotate(${rotation + 90})`}
        stroke="rgba(0,0,0,0.5)"
        strokeWidth="0.2"
        className="pointer-events-none"
      />

      {/* Jersey Number */}
      {showNumbers && (
        <text
          x="0"
          y="0.8"
          fill={textColor}
          fontSize="2.1"
          fontWeight="800"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Outfit, Inter, sans-serif"
          className="select-none pointer-events-none"
        >
          {player.number}
        </text>
      )}

      {/* Name / Role Badge Below Player */}
      {showLabels && (player.name || player.role) && (
        <g transform="translate(0, 3.8)" className="pointer-events-none select-none">
          <rect
            x="-7"
            y="-1.3"
            width="14"
            height="2.8"
            rx="1.4"
            fill="rgba(15, 23, 42, 0.88)"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="0.2"
          />
          <text
            x="0"
            y="0.3"
            fill="#ffffff"
            fontSize="1.6"
            fontWeight="600"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="Inter, sans-serif"
          >
            {player.name || player.role}
          </text>
        </g>
      )}
    </g>
  );
};
