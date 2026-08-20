import React, { useRef, useState, useCallback } from 'react';
import {
  Player,
  Ball,
  Equipment,
  Annotation,
  PitchConfig,
  TeamConfig,
  DrawingTool,
  Point,
  MarkingSize,
} from '../../types/tactics';
import { PitchMarkings } from './PitchMarkings';
import { PlayerMarker } from './PlayerMarker';
import { BallMarker } from './BallMarker';
import { EquipmentMarker } from './EquipmentMarker';
import { TacticalAnnotations } from './TacticalAnnotations';
import { DrawingLayer } from './DrawingLayer';

interface FootballPitchProps {
  pitchConfig: PitchConfig;
  homeTeam: TeamConfig;
  awayTeam: TeamConfig;
  players: Player[];
  ball: Ball;
  equipment: Equipment[];
  annotations: Annotation[];
  activeTool: DrawingTool;
  drawingColor: string;
  markingSize?: MarkingSize;
  drawingStyle: 'solid' | 'dashed' | 'dotted' | 'wavy';
  activeZoneText: string;
  selectedPlayerId: string | null;
  selectedEquipmentId: string | null;
  selectedAnnotationId: string | null;
  isBallSelected: boolean;
  isInteractive?: boolean;
  onSelectPlayer: (id: string | null) => void;
  onSelectEquipment: (id: string | null) => void;
  onSelectAnnotation: (id: string | null) => void;
  onSelectBall: (selected: boolean) => void;
  onUpdatePlayerPosition: (id: string, x: number, y: number) => void;
  onUpdateBallPosition: (x: number, y: number) => void;
  onUpdateEquipmentPosition: (id: string, x: number, y: number) => void;
  onAddAnnotation: (ann: Annotation) => void;
  onDeleteAnnotation?: (id: string) => void;
  onPlayerDoubleClick?: (player: Player) => void;
}

export const FootballPitch: React.FC<FootballPitchProps> = ({
  pitchConfig,
  homeTeam,
  awayTeam,
  players,
  ball,
  equipment,
  annotations,
  activeTool,
  drawingColor,
  markingSize = 'small',
  drawingStyle,
  activeZoneText,
  selectedPlayerId,
  selectedEquipmentId,
  selectedAnnotationId,
  isBallSelected,
  isInteractive = true,
  onSelectPlayer,
  onSelectEquipment,
  onSelectAnnotation,
  onSelectBall,
  onUpdatePlayerPosition,
  onUpdateBallPosition,
  onUpdateEquipmentPosition,
  onAddAnnotation,
  onDeleteAnnotation,
  onPlayerDoubleClick,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const [dragItem, setDragItem] = useState<{
    type: 'player' | 'ball' | 'equipment';
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const screenToPitch = useCallback((clientX: number, clientY: number): Point | null => {
    if (!svgRef.current) return null;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    let px = Math.round(svgP.x * 10) / 10;
    let py = Math.round(svgP.y * 10) / 10;

    if (pitchConfig.snapToGrid) {
      px = Math.round(px / 5) * 5;
      py = Math.round(py / 5) * 5;
    }

    return {
      x: Math.max(1, Math.min(99, px)),
      y: Math.max(1, Math.min(99, py)),
    };
  }, [pitchConfig.snapToGrid]);

  const handlePlayerPointerDown = (e: React.PointerEvent, player: Player) => {
    if (activeTool !== 'select') return;
    e.stopPropagation();
    onSelectPlayer(player.id);
    onSelectBall(false);
    onSelectEquipment(null);
    onSelectAnnotation(null);

    const coords = screenToPitch(e.clientX, e.clientY);
    if (coords) {
      setDragItem({
        type: 'player',
        id: player.id,
        offsetX: coords.x - player.x,
        offsetY: coords.y - player.y,
      });
      (e.target as Element).setPointerCapture?.(e.pointerId);
    }
  };

  const handleBallPointerDown = (e: React.PointerEvent, b: Ball) => {
    if (activeTool !== 'select') return;
    e.stopPropagation();
    onSelectBall(true);
    onSelectPlayer(null);
    onSelectEquipment(null);
    onSelectAnnotation(null);

    const coords = screenToPitch(e.clientX, e.clientY);
    if (coords) {
      setDragItem({
        type: 'ball',
        id: b.id,
        offsetX: coords.x - b.x,
        offsetY: coords.y - b.y,
      });
      (e.target as Element).setPointerCapture?.(e.pointerId);
    }
  };

  const handleEquipmentPointerDown = (e: React.PointerEvent, eq: Equipment) => {
    if (activeTool !== 'select') return;
    e.stopPropagation();
    onSelectEquipment(eq.id);
    onSelectPlayer(null);
    onSelectBall(false);
    onSelectAnnotation(null);

    const coords = screenToPitch(e.clientX, e.clientY);
    if (coords) {
      setDragItem({
        type: 'equipment',
        id: eq.id,
        offsetX: coords.x - eq.x,
        offsetY: coords.y - eq.y,
      });
      (e.target as Element).setPointerCapture?.(e.pointerId);
    }
  };

  const handlePitchPointerMove = (e: React.PointerEvent) => {
    if (!dragItem || activeTool !== 'select') return;

    const coords = screenToPitch(e.clientX, e.clientY);
    if (!coords) return;

    const targetX = Math.max(1, Math.min(99, coords.x - dragItem.offsetX));
    const targetY = Math.max(1, Math.min(99, coords.y - dragItem.offsetY));

    if (dragItem.type === 'player') {
      onUpdatePlayerPosition(dragItem.id, targetX, targetY);
    } else if (dragItem.type === 'ball') {
      onUpdateBallPosition(targetX, targetY);
    } else if (dragItem.type === 'equipment') {
      onUpdateEquipmentPosition(dragItem.id, targetX, targetY);
    }
  };

  const handlePitchPointerUp = () => {
    setDragItem(null);
  };

  const handlePitchClick = () => {
    if (activeTool === 'select') {
      onSelectPlayer(null);
      onSelectBall(false);
      onSelectEquipment(null);
      onSelectAnnotation(null);
    }
  };

  const getViewBox = (): string => {
    switch (pitchConfig.view) {
      case 'half-left':
        return '0 0 52 100';
      case 'half-right':
        return '48 0 52 100';
      case 'attacking-third':
        return '65 0 35 100';
      case 'penalty-box':
        return '78 15 22 70';
      case 'half-top':
        return '0 0 100 52';
      case 'half-bottom':
        return '0 48 100 52';
      case 'full':
      default:
        return '0 0 100 100';
    }
  };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none overflow-hidden"
      onPointerMove={handlePitchPointerMove}
      onPointerUp={handlePitchPointerUp}
    >
      <svg
        ref={svgRef}
        viewBox={getViewBox()}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full max-h-[88vh] md:max-h-[82vh] filter drop-shadow-2xl rounded-xl transition-all"
        onClick={handlePitchClick}
        style={{ touchAction: 'none' }}
      >
        <PitchMarkings config={pitchConfig} />

        <TacticalAnnotations
          annotations={annotations}
          selectedAnnotationId={selectedAnnotationId}
          globalMarkingSize={markingSize}
          onSelectAnnotation={onSelectAnnotation}
          onDeleteAnnotation={onDeleteAnnotation}
        />

        {equipment.map((eq) => (
          <EquipmentMarker
            key={eq.id}
            equipment={eq}
            isSelected={eq.id === selectedEquipmentId}
            isInteractive={isInteractive && activeTool === 'select'}
            onPointerDown={handleEquipmentPointerDown}
            onClick={(e, item) => {
              e.stopPropagation();
              onSelectEquipment(item.id);
            }}
          />
        ))}

        {players.map((player) => {
          const teamConf = player.team === 'home' ? homeTeam : awayTeam;
          return (
            <PlayerMarker
              key={player.id}
              player={player}
              teamConfig={teamConf}
              isSelected={player.id === selectedPlayerId}
              showLabels={pitchConfig.showPlayerLabels}
              showNumbers={pitchConfig.showPlayerNumbers}
              showVisionCones={pitchConfig.showVisionCones}
              isInteractive={isInteractive && activeTool === 'select'}
              onPointerDown={handlePlayerPointerDown}
              onClick={(e, p) => {
                e.stopPropagation();
                onSelectPlayer(p.id);
              }}
              onDoubleClick={onPlayerDoubleClick}
            />
          );
        })}

        <BallMarker
          ball={ball}
          isSelected={isBallSelected}
          isInteractive={isInteractive && activeTool === 'select'}
          onPointerDown={handleBallPointerDown}
          onClick={(e) => {
            e.stopPropagation();
            onSelectBall(true);
          }}
        />

        {isInteractive && (
          <DrawingLayer
            activeTool={activeTool}
            drawingColor={drawingColor}
            markingSize={markingSize}
            drawingStyle={drawingStyle}
            activeZoneText={activeZoneText}
            onAddAnnotation={onAddAnnotation}
            svgRef={svgRef}
          />
        )}
      </svg>
    </div>
  );
};
