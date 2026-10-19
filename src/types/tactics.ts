export type MatchFormat = '5v5' | '7v7' | '9v9' | '11v11';

export type TeamId = 'home' | 'away' | 'neutral' | 'equipment';

export type MarkingSize = 'small' | 'medium' | 'large';

export interface Point {
  x: number;
  y: number;
}

export interface Player {
  id: string;
  team: TeamId;
  number: number;
  name: string;
  role: string;
  isGK?: boolean;
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  rotation?: number; // 0 to 360 degrees
  color?: string;
  textColor?: string;
  coneVisible?: boolean;
  highlighted?: boolean;
}

export interface Ball {
  id: string;
  x: number;
  y: number;
  z?: number;
}

export type EquipmentType = 'cone' | 'pole' | 'mini-goal' | 'mannequin' | 'ladder' | 'passing-gate';

export interface Equipment {
  id: string;
  type: EquipmentType;
  x: number;
  y: number;
  color?: string;
  rotation?: number;
  label?: string;
}

export type DrawingTool =
  | 'select'
  | 'pass'
  | 'movement'
  | 'curved-run'
  | 'dribble'
  | 'zone-rect'
  | 'zone-circle'
  | 'freehand'
  | 'text'
  | 'laser'
  | 'equipment'
  | 'eraser';

export type AnnotationType =
  | 'arrow'
  | 'pass'
  | 'curved'
  | 'dribble'
  | 'zone-rect'
  | 'zone-circle'
  | 'freehand'
  | 'text';

export interface Annotation {
  id: string;
  type: AnnotationType;
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
  style: 'solid' | 'dashed' | 'dotted' | 'wavy';
  text?: string;
  fontSize?: number;
  fillColor?: string;
  fillOpacity?: number;
  selected?: boolean;
  size?: MarkingSize;
}

export interface KeyframeStep {
  id: string;
  name: string;
  description?: string;
  duration: number; // in seconds, default 2.0
  players: Player[];
  ball: Ball;
  equipment: Equipment[];
  annotations: Annotation[];
  videoTimestamp?: number;
}

export interface TeamConfig {
  name: string;
  primaryColor: string;
  textColor: string;
  gkColor: string;
  gkTextColor: string;
  formation: string;
}

export type PitchView =
  | 'full'
  | 'half-top'
  | 'half-bottom'
  | 'half-left'
  | 'half-right'
  | 'attacking-third'
  | 'penalty-box';

export type PitchTheme =
  | 'classic-grass'
  | 'striped-grass'
  | 'tactical-dark'
  | 'blueprint'
  | 'chalkboard'
  | 'indoor-wood';

export type PitchGridType = 'none' | 'channels' | 'zones-18' | 'thirds' | 'corridors';

export interface PitchConfig {
  view: PitchView;
  orientation: 'horizontal' | 'vertical';
  theme: PitchTheme;
  showGrid: boolean;
  gridType: PitchGridType;
  showPlayerLabels: boolean;
  showPlayerNumbers: boolean;
  showVisionCones: boolean;
  snapToGrid: boolean;
}

export type TacticalPhase =
  | 'possession'
  | 'out-of-possession'
  | 'transition-attack'
  | 'transition-defense'
  | 'set-piece'
  | 'drill';

export interface VideoBookmark {
  id: string;
  time: number;
  label: string;
  stepId?: string;
}

/** Coach Kit metadata: everything that came from the drill library. Optional so
 *  classic freeform sessions keep working exactly as before. */
export interface KitCue {
  cue: string;
  cuePcm?: string;
}

export interface KitMeta {
  drillId: string;
  minutes: number;
  players: string;
  space: string;
  balls: string;
  makeshift: string;
  safety?: string;
  cues: KitCue[];
}

export type AgeGroup =
  | 'U6-U8'
  | 'U9-U11'
  | 'U12-U14'
  | 'U15-U17'
  | 'Adult'
  | 'Amputee'
  | 'Blind';

export interface Session {
  id: string;
  title: string;
  description: string;
  format: MatchFormat;
  phase: TacticalPhase;
  category: string;
  /** set when the session was created from the Coach Kit drill library */
  drillId?: string;
  ageGroup?: AgeGroup;
  /** persisted marking size so a huddle session opens huddle-sized next time */
  markingSize?: MarkingSize;
  kitMeta?: KitMeta;
  homeTeam: TeamConfig;
  awayTeam: TeamConfig;
  steps: KeyframeStep[];
  currentStepIndex: number;
  pitchConfig: PitchConfig;
  videoUrl?: string;
  videoFileName?: string;
  videoBookmarks?: VideoBookmark[];
  coachingPoints: string[];
  objectives: string[];
  createdAt: string;
  updatedAt: string;
  isTemplate?: boolean;
}
