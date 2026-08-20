import React from 'react';
import { PitchConfig, PitchTheme, PitchGridType, PitchView } from '../../types/tactics';

interface PitchMarkingsProps {
  config: PitchConfig;
}

export const PitchMarkings: React.FC<PitchMarkingsProps> = ({ config }) => {
  const { theme, showGrid, gridType, view } = config;

  // Theme color maps
  const getThemeBg = (t: PitchTheme) => {
    switch (t) {
      case 'striped-grass':
        return {
          base: '#1b4d3e',
          stripe: '#225d4b',
          line: 'rgba(255, 255, 255, 0.85)',
          grid: 'rgba(255, 255, 255, 0.15)',
          zone14: 'rgba(251, 191, 36, 0.18)',
        };
      case 'tactical-dark':
        return {
          base: '#0f172a',
          stripe: '#131e33',
          line: 'rgba(148, 163, 184, 0.75)',
          grid: 'rgba(59, 130, 246, 0.2)',
          zone14: 'rgba(59, 130, 246, 0.22)',
        };
      case 'blueprint':
        return {
          base: '#0c2340',
          stripe: '#081a30',
          line: 'rgba(56, 189, 248, 0.8)',
          grid: 'rgba(56, 189, 248, 0.25)',
          zone14: 'rgba(56, 189, 248, 0.3)',
        };
      case 'chalkboard':
        return {
          base: '#1c1917',
          stripe: '#292524',
          line: 'rgba(245, 245, 244, 0.8)',
          grid: 'rgba(245, 245, 244, 0.15)',
          zone14: 'rgba(251, 146, 60, 0.18)',
        };
      case 'indoor-wood':
        return {
          base: '#854d0e',
          stripe: '#713f12',
          line: 'rgba(255, 255, 255, 0.9)',
          grid: 'rgba(255, 255, 255, 0.2)',
          zone14: 'rgba(234, 179, 8, 0.2)',
        };
      case 'classic-grass':
      default:
        return {
          base: '#15803d',
          stripe: '#166534',
          line: 'rgba(255, 255, 255, 0.9)',
          grid: 'rgba(255, 255, 255, 0.18)',
          zone14: 'rgba(250, 204, 21, 0.2)',
        };
    }
  };

  const colors = getThemeBg(theme);

  // Define stripes across pitch width (e.g. 10 vertical stripes)
  const stripeWidth = 100 / 10;

  return (
    <g className="pitch-background-markings pointer-events-none select-none">
      {/* Base Field Background */}
      <rect x="0" y="0" width="100" height="100" fill={colors.base} />

      {/* Alternating Mowed Stripes */}
      {Array.from({ length: 10 }).map((_, i) => {
        if (i % 2 === 0) return null;
        return (
          <rect
            key={`stripe-${i}`}
            x={i * stripeWidth}
            y="0"
            width={stripeWidth}
            height="100"
            fill={colors.stripe}
          />
        );
      })}

      {/* Grass subtle texture / vignette filter */}
      <radialGradient id="pitch-vignette" cx="50%" cy="50%" r="65%">
        <stop offset="60%" stopColor="transparent" stopOpacity="0" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
      </radialGradient>
      <rect x="0" y="0" width="100" height="100" fill="url(#pitch-vignette)" />

      {/* Tactical Grids (Channels / 18 Zones / Thirds) */}
      {showGrid && (
        <g className="tactical-grids">
          {gridType === 'channels' && (
            <g>
              {/* 5 Channels: Left Wing (0-18%), Left Half Space (18-36%), Center (36-64%), Right Half Space (64-82%), Right Wing (82-100%) */}
              <line x1="0" y1="18" x2="100" y2="18" stroke={colors.grid} strokeWidth="0.4" strokeDasharray="1.5,1" />
              <line x1="0" y1="36" x2="100" y2="36" stroke={colors.grid} strokeWidth="0.4" strokeDasharray="1.5,1" />
              <line x1="0" y1="64" x2="100" y2="64" stroke={colors.grid} strokeWidth="0.4" strokeDasharray="1.5,1" />
              <line x1="0" y1="82" x2="100" y2="82" stroke={colors.grid} strokeWidth="0.4" strokeDasharray="1.5,1" />
              
              {/* Thirds dividers */}
              <line x1="33.33" y1="0" x2="33.33" y2="100" stroke={colors.grid} strokeWidth="0.4" strokeDasharray="1.5,1" />
              <line x1="66.66" y1="0" x2="66.66" y2="100" stroke={colors.grid} strokeWidth="0.4" strokeDasharray="1.5,1" />

              {/* Channel labels */}
              <text x="50" y="10" fill={colors.grid} fontSize="1.8" textAnchor="middle" fontWeight="600" opacity="0.6">LEFT WING</text>
              <text x="50" y="27" fill={colors.grid} fontSize="1.8" textAnchor="middle" fontWeight="600" opacity="0.6">LEFT HALF-SPACE</text>
              <text x="50" y="50" fill={colors.grid} fontSize="1.8" textAnchor="middle" fontWeight="600" opacity="0.6">CENTRAL CHANNEL</text>
              <text x="50" y="73" fill={colors.grid} fontSize="1.8" textAnchor="middle" fontWeight="600" opacity="0.6">RIGHT HALF-SPACE</text>
              <text x="50" y="91" fill={colors.grid} fontSize="1.8" textAnchor="middle" fontWeight="600" opacity="0.6">RIGHT WING</text>
            </g>
          )}

          {gridType === 'zones-18' && (
            <g>
              {/* 18 Zones Grid (6 columns x 3 rows) */}
              {[1, 2, 3, 4, 5].map((c) => (
                <line key={`col-${c}`} x1={(c * 100) / 6} y1="0" x2={(c * 100) / 6} y2="100" stroke={colors.grid} strokeWidth="0.35" strokeDasharray="1,1" />
              ))}
              {[1, 2].map((r) => (
                <line key={`row-${r}`} x1="0" y1={(r * 100) / 3} x2="100" y2={(r * 100) / 3} stroke={colors.grid} strokeWidth="0.35" strokeDasharray="1,1" />
              ))}

              {/* Zone 14 Highlight (Column 4, Row 1.5 => in front of right penalty area x: 66.66-83.33, y: 33.33-66.66) */}
              <rect x="66.66" y="33.33" width="16.66" height="33.33" fill={colors.zone14} stroke={colors.zone14} strokeWidth="0.5" rx="0.5" />
              <text x="75" y="51" fill="#fef08a" fontSize="2.2" textAnchor="middle" fontWeight="700" opacity="0.85">ZONE 14</text>
            </g>
          )}

          {gridType === 'thirds' && (
            <g>
              {/* Defensive Third, Middle Third, Attacking Third */}
              <line x1="33.33" y1="0" x2="33.33" y2="100" stroke={colors.grid} strokeWidth="0.5" strokeDasharray="2,1" />
              <line x1="66.66" y1="0" x2="66.66" y2="100" stroke={colors.grid} strokeWidth="0.5" strokeDasharray="2,1" />
              <text x="16.66" y="5" fill={colors.grid} fontSize="2.2" textAnchor="middle" fontWeight="700" opacity="0.7">DEFENSIVE THIRD</text>
              <text x="50" y="5" fill={colors.grid} fontSize="2.2" textAnchor="middle" fontWeight="700" opacity="0.7">MIDDLE THIRD</text>
              <text x="83.33" y="5" fill={colors.grid} fontSize="2.2" textAnchor="middle" fontWeight="700" opacity="0.7">ATTACKING THIRD</text>
            </g>
          )}

          {gridType === 'corridors' && (
            <g>
              {[20, 40, 60, 80].map((y) => (
                <line key={`corr-${y}`} x1="0" y1={y} x2="100" y2={y} stroke={colors.grid} strokeWidth="0.35" strokeDasharray="1,1" />
              ))}
            </g>
          )}
        </g>
      )}

      {/* STANDARD FOOTBALL PITCH MARKINGS (High Precision Vector Math) */}
      <g stroke={colors.line} strokeWidth="0.55" fill="none">
        {/* Outer Boundary / Touchlines */}
        <rect x="2" y="2" width="96" height="96" />

        {/* Halfway Line */}
        <line x1="50" y1="2" x2="50" y2="98" />

        {/* Center Circle & Center Spot */}
        <circle cx="50" cy="50" r="9.15" />
        <circle cx="50" cy="50" r="0.6" fill={colors.line} />

        {/* LEFT GOAL & PENALTY AREA (Home) */}
        {/* Penalty Area (18-yard box: 16.5m depth, 40.3m height) */}
        <rect x="2" y="20" width="16" height="60" />
        {/* Goal Area (6-yard box: 5.5m depth, 18.3m height) */}
        <rect x="2" y="36.5" width="5.5" height="27" />
        {/* Penalty Spot (11m / 12 yards from goal line) */}
        <circle cx="11" cy="50" r="0.6" fill={colors.line} />
        {/* Penalty Arc / D */}
        <path d="M 18 39.5 A 9.15 9.15 0 0 1 18 60.5" />
        {/* Goal Post & Net (Left) */}
        <rect x="0" y="44" width="2" height="12" stroke="#ffffff" fill="rgba(255,255,255,0.2)" strokeWidth="0.6" />

        {/* RIGHT GOAL & PENALTY AREA (Away) */}
        {/* Penalty Area (18-yard box) */}
        <rect x="82" y="20" width="16" height="60" />
        {/* Goal Area (6-yard box) */}
        <rect x="92.5" y="36.5" width="5.5" height="27" />
        {/* Penalty Spot */}
        <circle cx="89" cy="50" r="0.6" fill={colors.line} />
        {/* Penalty Arc / D */}
        <path d="M 82 39.5 A 9.15 9.15 0 0 0 82 60.5" />
        {/* Goal Post & Net (Right) */}
        <rect x="98" y="44" width="2" height="12" stroke="#ffffff" fill="rgba(255,255,255,0.2)" strokeWidth="0.6" />

        {/* Corner Arcs (1m radius in all four corners) */}
        {/* Top-Left */}
        <path d="M 2 4 A 2 2 0 0 0 4 2" />
        {/* Bottom-Left */}
        <path d="M 2 96 A 2 2 0 0 1 4 98" />
        {/* Top-Right */}
        <path d="M 98 4 A 2 2 0 0 1 96 2" />
        {/* Bottom-Right */}
        <path d="M 98 96 A 2 2 0 0 0 96 98" />
      </g>
    </g>
  );
};
