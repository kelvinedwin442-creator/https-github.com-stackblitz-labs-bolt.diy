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

  // Balanced marker radius
  const radius = 2.3;

  return (
    <g
      className={`player-marker-group ${isInteractive ? 'cursor-grab active:cursor-grabbing' : ''}`}
      transform={`translate(${player.x}, ${player.y})`}
      onPointerDown={(e) => isInteractive && onPointerDown(e, player)}
      onClick={(e) => onClick(e, player)}
      onDoubleClick={() => onDoubleClick && onDoubleClick(player)}
      style={{ touchAction: 'none' }}
    >
      {/* Invisible Touch Area for easy mobile grabbing */}
      <circle
        cx="0"
        cy="0"
        r={radius + 2.2}
        fill="transparent"
        className="cursor-pointer"
      />

      {/* Vision Cone if enabled */}
      {(showVisionCones || player.coneVisible) && (
        <path
          d={generateVisionCone(0, 0, rotation, 12, 45)}
          fill={fillColor}
          fillOpacity={0.14}
          stroke={fillColor}
          strokeWidth={0.25}
          strokeDasharray="0.8,0.8"
          className="pointer-events-none"
        />
      )}

      {/* Selected Halo */}
      {isSelected && (
        <circle
          cx="0"
          cy="0"
          r={radius + 1.0}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="0.6"
          strokeDasharray="1.2,0.8"
          className="animate-pulse"
        />
      )}

      {/* Realistic Soft Shadow */}
      <circle
        cx="0.2"
        cy="0.35"
        r={radius}
        fill="rgba(0, 0, 0, 0.35)"
        className="pointer-events-none"
      />

      {/* Main Player Disc */}
      <circle
        cx="0"
        cy="0"
        r={radius}
        fill={fillColor}
        stroke="#ffffff"
        strokeWidth={isGK ? '0.55' : '0.45'}
        className="transition-transform duration-75 hover:scale-105"
      />

      {/* GK Indicator Ring */}
      {isGK && (
        <circle
          cx="0"
          cy="0"
          r={radius - 0.5}
          fill="none"
          stroke="#000000"
          strokeWidth="0.25"
          strokeDasharray="0.6,0.6"
        />
      )}

      {/* Direction Pointer Tick */}
      <polygon
        points="0,-2.5 0.6,-3.1 -0.6,-3.1"
        fill="#ffffff"
        transform={`rotate(${rotation + 90})`}
        stroke="rgba(0,0,0,0.4)"
        strokeWidth="0.15"
        className="pointer-events-none"
      />

      {/* Jersey Number */}
      {showNumbers && (
        <text
          x="0"
          y="0.75"
          fill={textColor}
          fontSize="1.9"
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
        <g transform="translate(0, 3.5)" className="pointer-events-none select-none">
          <rect
            x="-5.5"
            y="-1.1"
            width="11"
            height="2.2"
            rx="1.1"
            fill="rgba(15, 23, 42, 0.9)"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="0.2"
          />
          <text
            x="0"
            y="0.2"
            fill="#ffffff"
            fontSize="1.3"
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
