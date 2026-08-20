import { MatchFormat, Player } from '../types/tactics';

export interface FormationPreset {
  name: string;
  format: MatchFormat;
  homePositions: { number: number; role: string; name: string; x: number; y: number; isGK?: boolean }[];
  awayPositions: { number: number; role: string; name: string; x: number; y: number; isGK?: boolean }[];
}

export const FORMATIONS_11v11: Record<string, FormationPreset> = {
  '4-3-3': {
    name: '4-3-3',
    format: '11v11',
    homePositions: [
      { number: 1, role: 'GK', name: 'GK', x: 6, y: 50, isGK: true },
      { number: 2, role: 'RB', name: 'RB', x: 22, y: 84 },
      { number: 4, role: 'RCB', name: 'RCB', x: 18, y: 62 },
      { number: 5, role: 'LCB', name: 'LCB', x: 18, y: 38 },
      { number: 3, role: 'LB', name: 'LB', x: 22, y: 16 },
      { number: 6, role: 'DM', name: 'DM', x: 30, y: 50 },
      { number: 8, role: 'RCM', name: 'RCM', x: 38, y: 68 },
      { number: 10, role: 'LCM', name: 'LCM', x: 38, y: 32 },
      { number: 7, role: 'RW', name: 'RW', x: 46, y: 82 },
      { number: 9, role: 'ST', name: 'ST', x: 48, y: 50 },
      { number: 11, role: 'LW', name: 'LW', x: 46, y: 18 },
    ],
    awayPositions: [
      { number: 1, role: 'GK', name: 'GK', x: 94, y: 50, isGK: true },
      { number: 2, role: 'RB', name: 'RB', x: 78, y: 16 },
      { number: 4, role: 'RCB', name: 'RCB', x: 82, y: 38 },
      { number: 5, role: 'LCB', name: 'LCB', x: 82, y: 62 },
      { number: 3, role: 'LB', name: 'LB', x: 78, y: 84 },
      { number: 6, role: 'DM', name: 'DM', x: 70, y: 50 },
      { number: 8, role: 'RCM', name: 'RCM', x: 62, y: 32 },
      { number: 10, role: 'LCM', name: 'LCM', x: 62, y: 68 },
      { number: 7, role: 'RW', name: 'RW', x: 54, y: 18 },
      { number: 9, role: 'ST', name: 'ST', x: 52, y: 50 },
      { number: 11, role: 'LW', name: 'LW', x: 54, y: 82 },
    ],
  },
  '4-2-3-1': {
    name: '4-2-3-1',
    format: '11v11',
    homePositions: [
      { number: 1, role: 'GK', name: 'GK', x: 6, y: 50, isGK: true },
      { number: 2, role: 'RB', name: 'RB', x: 22, y: 84 },
      { number: 4, role: 'RCB', name: 'RCB', x: 18, y: 62 },
      { number: 5, role: 'LCB', name: 'LCB', x: 18, y: 38 },
      { number: 3, role: 'LB', name: 'LB', x: 22, y: 16 },
      { number: 6, role: 'RDM', name: 'RDM', x: 28, y: 60 },
      { number: 8, role: 'LDM', name: 'LDM', x: 28, y: 40 },
      { number: 7, role: 'RAM', name: 'RAM', x: 40, y: 78 },
      { number: 10, role: 'CAM', name: 'CAM', x: 38, y: 50 },
      { number: 11, role: 'LAM', name: 'LAM', x: 40, y: 22 },
      { number: 9, role: 'ST', name: 'ST', x: 48, y: 50 },
    ],
    awayPositions: [
      { number: 1, role: 'GK', name: 'GK', x: 94, y: 50, isGK: true },
      { number: 2, role: 'RB', name: 'RB', x: 78, y: 16 },
      { number: 4, role: 'RCB', name: 'RCB', x: 82, y: 38 },
      { number: 5, role: 'LCB', name: 'LCB', x: 82, y: 62 },
      { number: 3, role: 'LB', name: 'LB', x: 78, y: 84 },
      { number: 6, role: 'RDM', name: 'RDM', x: 72, y: 40 },
      { number: 8, role: 'LDM', name: 'LDM', x: 72, y: 60 },
      { number: 7, role: 'RAM', name: 'RAM', x: 60, y: 22 },
      { number: 10, role: 'CAM', name: 'CAM', x: 62, y: 50 },
      { number: 11, role: 'LAM', name: 'LAM', x: 60, y: 78 },
      { number: 9, role: 'ST', name: 'ST', x: 52, y: 50 },
    ],
  },
  '4-4-2': {
    name: '4-4-2',
    format: '11v11',
    homePositions: [
      { number: 1, role: 'GK', name: 'GK', x: 6, y: 50, isGK: true },
      { number: 2, role: 'RB', name: 'RB', x: 20, y: 84 },
      { number: 4, role: 'RCB', name: 'RCB', x: 18, y: 62 },
      { number: 5, role: 'LCB', name: 'LCB', x: 18, y: 38 },
      { number: 3, role: 'LB', name: 'LB', x: 20, y: 16 },
      { number: 7, role: 'RM', name: 'RM', x: 34, y: 82 },
      { number: 8, role: 'RCM', name: 'RCM', x: 32, y: 60 },
      { number: 6, role: 'LCM', name: 'LCM', x: 32, y: 40 },
      { number: 11, role: 'LM', name: 'LM', x: 34, y: 18 },
      { number: 9, role: 'RST', name: 'RST', x: 47, y: 60 },
      { number: 10, role: 'LST', name: 'LST', x: 47, y: 40 },
    ],
    awayPositions: [
      { number: 1, role: 'GK', name: 'GK', x: 94, y: 50, isGK: true },
      { number: 2, role: 'RB', name: 'RB', x: 80, y: 16 },
      { number: 4, role: 'RCB', name: 'RCB', x: 82, y: 38 },
      { number: 5, role: 'LCB', name: 'LCB', x: 82, y: 62 },
      { number: 3, role: 'LB', name: 'LB', x: 80, y: 84 },
      { number: 7, role: 'RM', name: 'RM', x: 66, y: 18 },
      { number: 8, role: 'RCM', name: 'RCM', x: 68, y: 40 },
      { number: 6, role: 'LCM', name: 'LCM', x: 68, y: 60 },
      { number: 11, role: 'LM', name: 'LM', x: 66, y: 82 },
      { number: 9, role: 'RST', name: 'RST', x: 53, y: 40 },
      { number: 10, role: 'LST', name: 'LST', x: 53, y: 60 },
    ],
  },
  '3-5-2': {
    name: '3-5-2',
    format: '11v11',
    homePositions: [
      { number: 1, role: 'GK', name: 'GK', x: 6, y: 50, isGK: true },
      { number: 4, role: 'RCB', name: 'RCB', x: 18, y: 70 },
      { number: 5, role: 'CB', name: 'CB', x: 16, y: 50 },
      { number: 6, role: 'LCB', name: 'LCB', x: 18, y: 30 },
      { number: 2, role: 'RWB', name: 'RWB', x: 30, y: 88 },
      { number: 8, role: 'RCM', name: 'RCM', x: 32, y: 64 },
      { number: 14, role: 'DM', name: 'DM', x: 26, y: 50 },
      { number: 10, role: 'LCM', name: 'LCM', x: 32, y: 36 },
      { number: 3, role: 'LWB', name: 'LWB', x: 30, y: 12 },
      { number: 9, role: 'RST', name: 'RST', x: 47, y: 60 },
      { number: 11, role: 'LST', name: 'LST', x: 47, y: 40 },
    ],
    awayPositions: [
      { number: 1, role: 'GK', name: 'GK', x: 94, y: 50, isGK: true },
      { number: 4, role: 'RCB', name: 'RCB', x: 82, y: 30 },
      { number: 5, role: 'CB', name: 'CB', x: 84, y: 50 },
      { number: 6, role: 'LCB', name: 'LCB', x: 82, y: 70 },
      { number: 2, role: 'RWB', name: 'RWB', x: 70, y: 12 },
      { number: 8, role: 'RCM', name: 'RCM', x: 68, y: 36 },
      { number: 14, role: 'DM', name: 'DM', x: 74, y: 50 },
      { number: 10, role: 'LCM', name: 'LCM', x: 68, y: 64 },
      { number: 3, role: 'LWB', name: 'LWB', x: 70, y: 88 },
      { number: 9, role: 'RST', name: 'RST', x: 53, y: 40 },
      { number: 11, role: 'LST', name: 'LST', x: 53, y: 60 },
    ],
  },
  '5-3-2': {
    name: '5-3-2',
    format: '11v11',
    homePositions: [
      { number: 1, role: 'GK', name: 'GK', x: 6, y: 50, isGK: true },
      { number: 2, role: 'RWB', name: 'RWB', x: 20, y: 88 },
      { number: 4, role: 'RCB', name: 'RCB', x: 16, y: 68 },
      { number: 5, role: 'CB', name: 'CB', x: 14, y: 50 },
      { number: 6, role: 'LCB', name: 'LCB', x: 16, y: 32 },
      { number: 3, role: 'LWB', name: 'LWB', x: 20, y: 12 },
      { number: 8, role: 'RCM', name: 'RCM', x: 30, y: 65 },
      { number: 14, role: 'DM', name: 'DM', x: 26, y: 50 },
      { number: 10, role: 'LCM', name: 'LCM', x: 30, y: 35 },
      { number: 9, role: 'RST', name: 'RST', x: 46, y: 60 },
      { number: 11, role: 'LST', name: 'LST', x: 46, y: 40 },
    ],
    awayPositions: [
      { number: 1, role: 'GK', name: 'GK', x: 94, y: 50, isGK: true },
      { number: 2, role: 'RWB', name: 'RWB', x: 80, y: 12 },
      { number: 4, role: 'RCB', name: 'RCB', x: 84, y: 32 },
      { number: 5, role: 'CB', name: 'CB', x: 86, y: 50 },
      { number: 6, role: 'LCB', name: 'LCB', x: 84, y: 68 },
      { number: 3, role: 'LWB', name: 'LWB', x: 80, y: 88 },
      { number: 8, role: 'RCM', name: 'RCM', x: 70, y: 35 },
      { number: 14, role: 'DM', name: 'DM', x: 74, y: 50 },
      { number: 10, role: 'LCM', name: 'LCM', x: 70, y: 65 },
      { number: 9, role: 'RST', name: 'RST', x: 54, y: 40 },
      { number: 11, role: 'LST', name: 'LST', x: 54, y: 60 },
    ],
  },
};

export const FORMATIONS_9v9: Record<string, FormationPreset> = {
  '3-2-3': {
    name: '3-2-3',
    format: '9v9',
    homePositions: [
      { number: 1, role: 'GK', name: 'GK', x: 8, y: 50, isGK: true },
      { number: 2, role: 'RCB', name: 'RCB', x: 22, y: 76 },
      { number: 4, role: 'CB', name: 'CB', x: 20, y: 50 },
      { number: 3, role: 'LCB', name: 'LCB', x: 22, y: 24 },
      { number: 6, role: 'RCM', name: 'RCM', x: 34, y: 62 },
      { number: 8, role: 'LCM', name: 'LCM', x: 34, y: 38 },
      { number: 7, role: 'RW', name: 'RW', x: 46, y: 78 },
      { number: 9, role: 'ST', name: 'ST', x: 48, y: 50 },
      { number: 11, role: 'LW', name: 'LW', x: 46, y: 22 },
    ],
    awayPositions: [
      { number: 1, role: 'GK', name: 'GK', x: 92, y: 50, isGK: true },
      { number: 2, role: 'RCB', name: 'RCB', x: 78, y: 24 },
      { number: 4, role: 'CB', name: 'CB', x: 80, y: 50 },
      { number: 3, role: 'LCB', name: 'LCB', x: 78, y: 76 },
      { number: 6, role: 'RCM', name: 'RCM', x: 66, y: 38 },
      { number: 8, role: 'LCM', name: 'LCM', x: 66, y: 62 },
      { number: 7, role: 'RW', name: 'RW', x: 54, y: 22 },
      { number: 9, role: 'ST', name: 'ST', x: 52, y: 50 },
      { number: 11, role: 'LW', name: 'LW', x: 54, y: 78 },
    ],
  },
  '3-3-2': {
    name: '3-3-2',
    format: '9v9',
    homePositions: [
      { number: 1, role: 'GK', name: 'GK', x: 8, y: 50, isGK: true },
      { number: 2, role: 'RCB', name: 'RCB', x: 22, y: 76 },
      { number: 4, role: 'CB', name: 'CB', x: 20, y: 50 },
      { number: 3, role: 'LCB', name: 'LCB', x: 22, y: 24 },
      { number: 7, role: 'RM', name: 'RM', x: 34, y: 80 },
      { number: 8, role: 'CM', name: 'CM', x: 32, y: 50 },
      { number: 11, role: 'LM', name: 'LM', x: 34, y: 20 },
      { number: 9, role: 'RST', name: 'RST', x: 47, y: 62 },
      { number: 10, role: 'LST', name: 'LST', x: 47, y: 38 },
    ],
    awayPositions: [
      { number: 1, role: 'GK', name: 'GK', x: 92, y: 50, isGK: true },
      { number: 2, role: 'RCB', name: 'RCB', x: 78, y: 24 },
      { number: 4, role: 'CB', name: 'CB', x: 80, y: 50 },
      { number: 3, role: 'LCB', name: 'LCB', x: 78, y: 76 },
      { number: 7, role: 'RM', name: 'RM', x: 66, y: 20 },
      { number: 8, role: 'CM', name: 'CM', x: 68, y: 50 },
      { number: 11, role: 'LM', name: 'LM', x: 66, y: 80 },
      { number: 9, role: 'RST', name: 'RST', x: 53, y: 38 },
      { number: 10, role: 'LST', name: 'LST', x: 53, y: 62 },
    ],
  },
  '4-3-1': {
    name: '4-3-1',
    format: '9v9',
    homePositions: [
      { number: 1, role: 'GK', name: 'GK', x: 8, y: 50, isGK: true },
      { number: 2, role: 'RB', name: 'RB', x: 22, y: 82 },
      { number: 4, role: 'RCB', name: 'RCB', x: 19, y: 60 },
      { number: 5, role: 'LCB', name: 'LCB', x: 19, y: 40 },
      { number: 3, role: 'LB', name: 'LB', x: 22, y: 18 },
      { number: 7, role: 'RM', name: 'RM', x: 35, y: 76 },
      { number: 8, role: 'CM', name: 'CM', x: 33, y: 50 },
      { number: 11, role: 'LM', name: 'LM', x: 35, y: 24 },
      { number: 9, role: 'ST', name: 'ST', x: 48, y: 50 },
    ],
    awayPositions: [
      { number: 1, role: 'GK', name: 'GK', x: 92, y: 50, isGK: true },
      { number: 2, role: 'RB', name: 'RB', x: 78, y: 18 },
      { number: 4, role: 'RCB', name: 'RCB', x: 81, y: 40 },
      { number: 5, role: 'LCB', name: 'LCB', x: 81, y: 60 },
      { number: 3, role: 'LB', name: 'LB', x: 78, y: 82 },
      { number: 7, role: 'RM', name: 'RM', x: 65, y: 24 },
      { number: 8, role: 'CM', name: 'CM', x: 67, y: 50 },
      { number: 11, role: 'LM', name: 'LM', x: 65, y: 76 },
      { number: 9, role: 'ST', name: 'ST', x: 52, y: 50 },
    ],
  },
};

export const FORMATIONS_7v7: Record<string, FormationPreset> = {
  '2-3-1': {
    name: '2-3-1',
    format: '7v7',
    homePositions: [
      { number: 1, role: 'GK', name: 'GK', x: 9, y: 50, isGK: true },
      { number: 2, role: 'RCB', name: 'RCB', x: 24, y: 68 },
      { number: 3, role: 'LCB', name: 'LCB', x: 24, y: 32 },
      { number: 7, role: 'RM', name: 'RM', x: 36, y: 78 },
      { number: 8, role: 'CM', name: 'CM', x: 34, y: 50 },
      { number: 11, role: 'LM', name: 'LM', x: 36, y: 22 },
      { number: 9, role: 'ST', name: 'ST', x: 48, y: 50 },
    ],
    awayPositions: [
      { number: 1, role: 'GK', name: 'GK', x: 91, y: 50, isGK: true },
      { number: 2, role: 'RCB', name: 'RCB', x: 76, y: 32 },
      { number: 3, role: 'LCB', name: 'LCB', x: 76, y: 68 },
      { number: 7, role: 'RM', name: 'RM', x: 64, y: 22 },
      { number: 8, role: 'CM', name: 'CM', x: 66, y: 50 },
      { number: 11, role: 'LM', name: 'LM', x: 64, y: 78 },
      { number: 9, role: 'ST', name: 'ST', x: 52, y: 50 },
    ],
  },
  '3-2-1': {
    name: '3-2-1',
    format: '7v7',
    homePositions: [
      { number: 1, role: 'GK', name: 'GK', x: 9, y: 50, isGK: true },
      { number: 2, role: 'RCB', name: 'RCB', x: 23, y: 76 },
      { number: 4, role: 'CB', name: 'CB', x: 21, y: 50 },
      { number: 3, role: 'LCB', name: 'LCB', x: 23, y: 24 },
      { number: 8, role: 'RCM', name: 'RCM', x: 36, y: 64 },
      { number: 10, role: 'LCM', name: 'LCM', x: 36, y: 36 },
      { number: 9, role: 'ST', name: 'ST', x: 48, y: 50 },
    ],
    awayPositions: [
      { number: 1, role: 'GK', name: 'GK', x: 91, y: 50, isGK: true },
      { number: 2, role: 'RCB', name: 'RCB', x: 77, y: 24 },
      { number: 4, role: 'CB', name: 'CB', x: 79, y: 50 },
      { number: 3, role: 'LCB', name: 'LCB', x: 77, y: 76 },
      { number: 8, role: 'RCM', name: 'RCM', x: 64, y: 36 },
      { number: 10, role: 'LCM', name: 'LCM', x: 64, y: 64 },
      { number: 9, role: 'ST', name: 'ST', x: 52, y: 50 },
    ],
  },
  '2-2-2': {
    name: '2-2-2',
    format: '7v7',
    homePositions: [
      { number: 1, role: 'GK', name: 'GK', x: 9, y: 50, isGK: true },
      { number: 2, role: 'RCB', name: 'RCB', x: 23, y: 68 },
      { number: 3, role: 'LCB', name: 'LCB', x: 23, y: 32 },
      { number: 8, role: 'RCM', name: 'RCM', x: 34, y: 66 },
      { number: 6, role: 'LCM', name: 'LCM', x: 34, y: 34 },
      { number: 9, role: 'RST', name: 'RST', x: 47, y: 62 },
      { number: 10, role: 'LST', name: 'LST', x: 47, y: 38 },
    ],
    awayPositions: [
      { number: 1, role: 'GK', name: 'GK', x: 91, y: 50, isGK: true },
      { number: 2, role: 'RCB', name: 'RCB', x: 77, y: 32 },
      { number: 3, role: 'LCB', name: 'LCB', x: 77, y: 68 },
      { number: 8, role: 'RCM', name: 'RCM', x: 66, y: 34 },
      { number: 6, role: 'LCM', name: 'LCM', x: 66, y: 66 },
      { number: 9, role: 'RST', name: 'RST', x: 53, y: 38 },
      { number: 10, role: 'LST', name: 'LST', x: 53, y: 62 },
    ],
  },
};

export const FORMATIONS_5v5: Record<string, FormationPreset> = {
  '1-2-1': {
    name: '1-2-1 (Diamond)',
    format: '5v5',
    homePositions: [
      { number: 1, role: 'GK', name: 'GK', x: 10, y: 50, isGK: true },
      { number: 4, role: 'FIXO', name: 'CB', x: 25, y: 50 },
      { number: 7, role: 'ALA R', name: 'ALA R', x: 35, y: 78 },
      { number: 11, role: 'ALA L', name: 'ALA L', x: 35, y: 22 },
      { number: 9, role: 'PIVO', name: 'ST', x: 47, y: 50 },
    ],
    awayPositions: [
      { number: 1, role: 'GK', name: 'GK', x: 90, y: 50, isGK: true },
      { number: 4, role: 'FIXO', name: 'CB', x: 75, y: 50 },
      { number: 7, role: 'ALA R', name: 'ALA R', x: 65, y: 22 },
      { number: 11, role: 'ALA L', name: 'ALA L', x: 65, y: 78 },
      { number: 9, role: 'PIVO', name: 'ST', x: 53, y: 50 },
    ],
  },
  '2-2': {
    name: '2-2 (Square)',
    format: '5v5',
    homePositions: [
      { number: 1, role: 'GK', name: 'GK', x: 10, y: 50, isGK: true },
      { number: 2, role: 'RCB', name: 'RCB', x: 26, y: 68 },
      { number: 3, role: 'LCB', name: 'LCB', x: 26, y: 32 },
      { number: 9, role: 'RST', name: 'RST', x: 46, y: 68 },
      { number: 10, role: 'LST', name: 'LST', x: 46, y: 32 },
    ],
    awayPositions: [
      { number: 1, role: 'GK', name: 'GK', x: 90, y: 50, isGK: true },
      { number: 2, role: 'RCB', name: 'RCB', x: 74, y: 32 },
      { number: 3, role: 'LCB', name: 'LCB', x: 74, y: 68 },
      { number: 9, role: 'RST', name: 'RST', x: 54, y: 32 },
      { number: 10, role: 'LST', name: 'LST', x: 54, y: 68 },
    ],
  },
  '1-1-2': {
    name: '1-1-2 (Y-shape)',
    format: '5v5',
    homePositions: [
      { number: 1, role: 'GK', name: 'GK', x: 10, y: 50, isGK: true },
      { number: 4, role: 'CB', name: 'CB', x: 24, y: 50 },
      { number: 8, role: 'CM', name: 'CM', x: 35, y: 50 },
      { number: 9, role: 'RST', name: 'RST', x: 47, y: 70 },
      { number: 11, role: 'LST', name: 'LST', x: 47, y: 30 },
    ],
    awayPositions: [
      { number: 1, role: 'GK', name: 'GK', x: 90, y: 50, isGK: true },
      { number: 4, role: 'CB', name: 'CB', x: 76, y: 50 },
      { number: 8, role: 'CM', name: 'CM', x: 65, y: 50 },
      { number: 9, role: 'RST', name: 'RST', x: 53, y: 30 },
      { number: 11, role: 'LST', name: 'LST', x: 53, y: 70 },
    ],
  },
};

export const ALL_FORMATIONS: Record<MatchFormat, Record<string, FormationPreset>> = {
  '11v11': FORMATIONS_11v11,
  '9v9': FORMATIONS_9v9,
  '7v7': FORMATIONS_7v7,
  '5v5': FORMATIONS_5v5,
};

export function createPlayersFromFormation(
  format: MatchFormat,
  homeFormationName: string,
  awayFormationName: string
): Player[] {
  const homeFormatGroup = ALL_FORMATIONS[format] || FORMATIONS_11v11;
  const homePreset = homeFormatGroup[homeFormationName] || Object.values(homeFormatGroup)[0];
  
  const awayFormatGroup = ALL_FORMATIONS[format] || FORMATIONS_11v11;
  const awayPreset = awayFormatGroup[awayFormationName] || Object.values(awayFormatGroup)[0];

  const players: Player[] = [];

  homePreset.homePositions.forEach((pos, idx) => {
    players.push({
      id: `home-${pos.number}-${idx}`,
      team: 'home',
      number: pos.number,
      name: pos.name,
      role: pos.role,
      isGK: pos.isGK,
      x: pos.x,
      y: pos.y,
      rotation: 0,
    });
  });

  awayPreset.awayPositions.forEach((pos, idx) => {
    players.push({
      id: `away-${pos.number}-${idx}`,
      team: 'away',
      number: pos.number,
      name: pos.name,
      role: pos.role,
      isGK: pos.isGK,
      x: pos.x,
      y: pos.y,
      rotation: 180,
    });
  });

  return players;
}
