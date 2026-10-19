import {
  Session,
  KeyframeStep,
  Player,
  Ball,
  Equipment,
  Annotation,
  MatchFormat,
  MarkingSize,
  EquipmentType,
} from '../types/tactics';
import { getStrokeWidthForSize } from '../utils/pitchGeometry';

/**
 * COACH KIT DRILL LIBRARY — v0.1
 *
 * Written for the reality of Nigerian grassroots coaching: bare or sandy pitches, one
 * ball between two players, cones replaced by stones, bottles and school bags, 25-40
 * players on one pitch, no floodlights, mixed ability, and coaches who learned by
 * playing rather than by a licence.
 *
 * Every drill is deliberately: (a) short-cued (8 words or less, so it works as a
 * picture + a sentence for a reader with limited English), (b) 2-3 animated steps,
 * (c) runnable with the equipment actually available, (d) scalable up and down.
 *
 * Coordinates are percentages of a full pitch (x 0-100 left-to-right, y 0-100
 * top-to-bottom). Home team defends the left goal and attacks right. Small-sided
 * drills live in the LEFT HALF (x 2-50) with pitch view cropped to 'half-left'.
 */

export type AgeBand =
  | 'U6-U8'
  | 'U9-U11'
  | 'U12-U14'
  | 'U15-U17'
  | 'Adult'
  | 'Amputee'
  | 'Blind';

export type DrillTheme =
  | 'Warm-up'
  | 'Ball mastery'
  | 'Passing'
  | 'Dribbling'
  | '1v1'
  | 'Possession'
  | 'Pressing'
  | 'Transition'
  | 'Finishing'
  | 'Set piece'
  | 'Game'
  | 'Cool-down'
  | 'Inclusive';

export interface DrillPose {
  n: number;
  role: string;
  x: number;
  y: number;
  gk?: boolean;
  name?: string;
}

export type ArrowKind = 'pass' | 'move' | 'dribble' | 'curved';

export interface DrillArrow {
  kind: ArrowKind;
  from: [number, number];
  to: [number, number];
  /** optional label drawn at the arrow end */
  note?: string;
}

export interface DrillZone {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
}

export interface DrillStep {
  label: string;
  /** the one sentence the coach says out loud, in plain English */
  cue: string;
  /** same idea in Nigerian Pidgin — often what actually lands in a huddle */
  cuePcm?: string;
  home: DrillPose[];
  away?: DrillPose[];
  ball: [number, number];
  equipment?: { type: EquipmentType; x: number; y: number; label?: string }[];
  arrows?: DrillArrow[];
  zones?: DrillZone[];
  duration?: number;
}

export interface Drill {
  id: string;
  title: string;
  titlePcm?: string;
  band: AgeBand;
  theme: DrillTheme;
  format: MatchFormat;
  minutes: number;
  /** how many players it needs, and how to cope if you have more */
  players: string;
  /** size and shape of the area, described in steps/paces not metres */
  space: string;
  balls: string;
  /** what to use when you have no cones, no bibs and no markers */
  makeshift: string;
  why: string;
  objectives: string[];
  coachingPoints: string[];
  easier: string;
  harder: string;
  /** pitch crop: 'half-left' for small-sided so players stay big on a phone screen */
  view?: 'full' | 'half-left' | 'half-right' | 'attacking-third';
  /** water/safety flags that matter at 34 degrees */
  safety?: string;
  audience?: 'girls' | 'inclusive' | 'mixed';
  steps: DrillStep[];
  tags: string[];
}

export const AGE_BANDS: AgeBand[] = ['U6-U8', 'U9-U11', 'U12-U14', 'U15-U17', 'Adult', 'Amputee', 'Blind'];

export const DRILL_THEMES: DrillTheme[] = [
  'Warm-up',
  'Ball mastery',
  'Passing',
  'Dribbling',
  '1v1',
  'Possession',
  'Pressing',
  'Transition',
  'Finishing',
  'Set piece',
  'Game',
  'Cool-down',
  'Inclusive',
];

const P = (n: number, role: string, x: number, y: number, gk?: boolean): DrillPose => ({ n, role, x, y, gk });

export const DRILLS: Drill[] = [
  // ─────────────────────────── WARM-UP / BALL MASTERY ───────────────────────────
  {
    id: 'grid-mastery',
    title: 'Ball Mastery Grid',
    titlePcm: "Dribble inside your small box",
    band: 'U6-U8',
    theme: 'Warm-up',
    format: '5v5',
    minutes: 12,
    players: 'Any number. Everyone needs a ball — if balls are short, share in pairs and swap every 60 seconds.',
    space: 'A square about 15 long steps on each side. Mark it with 4 piles of stones or 4 bottles.',
    balls: '1 per player (or 1 per 2 with constant swapping)',
    makeshift: 'No cones? Use water bottles, stones, school bags or folded bibs on the ground.',
    why: 'First 10 minutes decide whether a young group loves training or fears it. Everyone touches the ball hundreds of times, nobody queues.',
    objectives: [
      'Every player touches the ball 100+ times',
      'Comfort with the ball in a crowded space',
      'Eyes up while moving',
    ],
    coachingPoints: [
      'Soft touches: the ball stays within one stride of your feet.',
      'Use both feet, both sides of the sole.',
      'Head up — call out how many players you can see.',
      'Stop the ball dead on the whistle, not the player.',
    ],
    easier: 'Bigger grid, no opponents, walk first then jog.',
    harder: 'Add "last one to stop the ball does 5 press-ups" or a second ball to knock others out.',
    view: 'half-left',
    safety: 'Two drinks breaks inside 12 minutes in the dry season. Shade the group if the sun is high.',
    steps: [
      {
        label: 'Everyone dribbles',
        cue: 'Small touches, ball stays close.',
        cuePcm: 'Touch am small small, let ball near your leg.',
        home: [P(1, 'DRB', 10, 25), P(2, 'DRB', 16, 45), P(3, 'DRB', 24, 30), P(4, 'DRB', 12, 62), P(5, 'DRB', 22, 70), P(6, 'DRB', 30, 50), P(7, 'DRB', 34, 25), P(8, 'DRB', 36, 68)],
        ball: [20, 50],
        zones: [{ x: 6, y: 15, w: 36, h: 70, label: '15-step square' }],
        arrows: [
          { kind: 'dribble', from: [10, 25], to: [30, 60] },
          { kind: 'dribble', from: [34, 25], to: [12, 62] },
        ],
      },
      {
        label: 'Whistle stop',
        cue: 'Stop it dead, freeze, look up.',
        cuePcm: 'Hold am, freeze, look up.',
        home: [P(1, 'DRB', 14, 30), P(2, 'DRB', 20, 50), P(3, 'DRB', 26, 36), P(4, 'DRB', 16, 66), P(5, 'DRB', 28, 66), P(6, 'DRB', 32, 46), P(7, 'DRB', 30, 30), P(8, 'DRB', 38, 60)],
        ball: [20, 50],
        zones: [{ x: 6, y: 15, w: 36, h: 70 }],
        arrows: [{ kind: 'move', from: [14, 30], to: [14, 30] }],
      },
    ],
    tags: ['no-cones', 'high-reps', 'arrival-activity', 'no-opponents', 'heat-ok'],
  },
  {
    id: 'tail-tag',
    title: 'Tail Tag (ball in hand or at feet)',
    titlePcm: 'Catch the tail',
    band: 'U6-U8',
    theme: 'Ball mastery',
    format: '5v5',
    minutes: 10,
    players: '8-20. Two teams inside the same square.',
    space: 'Same 15-step square. Each player tucks a bib or a leaf/stick in their shorts as a "tail".',
    balls: '0 (or 1 each for the harder version)',
    makeshift: 'No bibs? Tear a strip of cloth, use a leaf, a bottle cap on the ground, or a rolled sock.',
    why: 'Teaches scanning, change of direction and courage in traffic — the base of every 1v1 — with zero equipment and no sitting.',
    objectives: ['Head on a swivel', 'Explode off both feet', 'Protect your own space'],
    coachingPoints: [
      'Look before you move: find a gap first, then go.',
      'Shield your tail with your body, not your hands.',
      'If you lose your tail, get it back — keep moving, nobody is out.',
    ],
    easier: 'Halve the square so nobody is ever more than 3 steps from a partner.',
    harder: 'Dribble a ball while protecting your tail; both feet must stay on the ball to be "safe".',
    view: 'half-left',
    steps: [
      {
        label: 'Chase and shield',
        cue: 'Eyes up, find the gap, go.',
        cuePcm: 'Open your eye, see road, just run am.',
        home: [P(1, 'RUN', 12, 30), P(2, 'RUN', 20, 60), P(3, 'RUN', 30, 24), P(4, 'RUN', 36, 55)],
        away: [P(5, 'TAG', 16, 45), P(6, 'TAG', 26, 34), P(7, 'TAG', 33, 68)],
        ball: [22, 48],
        zones: [{ x: 6, y: 15, w: 36, h: 70, label: 'tag zone' }],
        arrows: [
          { kind: 'move', from: [16, 45], to: [12, 30], note: 'chase' },
          { kind: 'move', from: [36, 55], to: [30, 24] },
        ],
      },
    ],
    tags: ['no-balls', 'no-cones', 'large-group', 'fun'],
  },

  // ─────────────────────────── PASSING ───────────────────────────
  {
    id: 'pass-and-follow',
    title: 'Pass & Follow Gates',
    titlePcm: 'Pass am, follow am',
    band: 'U9-U11',
    theme: 'Passing',
    format: '7v7',
    minutes: 15,
    players: 'Pairs, then groups of 4. 30 players = 15 pairs, run two grids at once.',
    space: 'Two cones 8-10 steps apart, a gate 3 steps wide between them.',
    balls: '1 per pair',
    makeshift: 'Gate = two stones or two bottles. Wide gate for beginners, narrow for better players.',
    why: 'Passing is not a foot problem, it is a body problem: this forces weight of pass, then instantly re-uses the body to move.',
    objectives: ['Pass on the correct foot', 'Weight of pass into the run', 'Receiving across the body'],
    coachingPoints: [
      'Hit the far foot so they can turn, not stop.',
      'Firm pass, no lob. The gate must be beaten on the ground.',
      'After you pass, move — a player who passes and stands is a player who does not exist.',
    ],
    easier: 'Stand still, 3 touches, bigger gate.',
    harder: 'One touch; add a passive defender in the middle; race two pairs.',
    steps: [
      {
        label: 'Pass through the gate',
        cue: 'Far foot, firm and low.',
        cuePcm: 'Use far leg, make am ground, make am fast.',
        home: [P(7, 'PASS', 12, 40), P(8, 'PASS', 30, 40)],
        ball: [12, 40],
        equipment: [
          { type: 'cone', x: 20, y: 36, label: 'gate' },
          { type: 'cone', x: 20, y: 44, label: 'gate' },
        ],
        arrows: [{ kind: 'pass', from: [12, 40], to: [30, 40], note: 'through gate' }],
      },
      {
        label: 'Follow and receive back',
        cue: 'Pass, run, receive on the move.',
        cuePcm: 'Pass, run, collect am.',
        home: [P(7, 'PASS', 22, 44), P(8, 'PASS', 34, 36)],
        ball: [34, 36],
        equipment: [
          { type: 'cone', x: 20, y: 36 },
          { type: 'cone', x: 20, y: 44 },
        ],
        arrows: [
          { kind: 'move', from: [12, 40], to: [22, 44], note: 'follow your pass' },
          { kind: 'pass', from: [30, 40], to: [22, 44] },
        ],
      },
    ],
    tags: ['no-cones', 'pairs', 'repetition', 'heat-ok'],
  },
  {
    id: 'rondo-4v1',
    title: '4v1 Rondo',
    titlePcm: 'Keep ball, 4 against 1',
    band: 'U9-U11',
    theme: 'Possession',
    format: '7v7',
    minutes: 15,
    players: 'Groups of 5. If you have 4 in a group, play 3v1 in a smaller square.',
    space: 'Square of 8 steps. 5 groups need 5 squares.',
    balls: '1 per group of 5',
    makeshift: 'Use bags as corners so the square does not drift when the game gets hot.',
    why: 'The cheapest possible way to teach everything: angles, support, first touch under pressure and pressing as a team — five kids, one ball.',
    objectives: ['Form triangles automatically', '2 touches maximum', 'Immediate counter-press on loss'],
    coachingPoints: [
      'Never stand in the shadow of a teammate — spread to the edges and the corners.',
      'Body open: receive side-on so you can see both goals.',
      'Lose it, win it back in 5 seconds. No blaming, no walking.',
    ],
    easier: 'Allow 3 touches; let the outside players use 4 sides of the square.',
    harder: '2v2 pressers; only 1 touch; score by passing across to a target man.',
    view: 'half-left',
    steps: [
      {
        label: 'Diamond shape',
        cue: 'Spread out, make triangles.',
        cuePcm: 'Wide wide, make triangle for your mate.',
        home: [P(2, 'WIDE', 10, 25), P(4, 'CB', 14, 60), P(6, 'MID', 30, 62), P(8, 'WIDE', 34, 26)],
        away: [P(10, 'PRESS', 22, 44)],
        ball: [14, 60],
        zones: [{ x: 8, y: 22, w: 28, h: 44, label: '8-step square' }],
        arrows: [
          { kind: 'pass', from: [14, 60], to: [10, 25] },
          { kind: 'pass', from: [10, 25], to: [34, 26] },
          { kind: 'pass', from: [34, 26], to: [30, 62] },
        ],
      },
      {
        label: 'Press and rotate',
        cue: 'Close the ball, cut the line.',
        cuePcm: 'Gree am, shut di passing lane.',
        home: [P(2, 'WIDE', 12, 30), P(4, 'CB', 20, 55), P(6, 'MID', 32, 58), P(8, 'WIDE', 26, 24)],
        away: [P(10, 'PRESS', 18, 40)],
        ball: [20, 55],
        zones: [{ x: 8, y: 22, w: 28, h: 44 }],
        arrows: [
          { kind: 'move', from: [22, 44], to: [18, 40], note: 'press' },
          { kind: 'pass', from: [20, 55], to: [32, 58] },
        ],
      },
    ],
    tags: ['no-cones', 'small-group', 'pressure', 'best-value-per-ball'],
  },

  // ─────────────────────────── 1v1 / DUELLING ───────────────────────────
  {
    id: '1v1-shield',
    title: '1v1 Shield & Score',
    titlePcm: '1 against 1, shield your ball',
    band: 'U12-U14',
    theme: '1v1',
    format: '5v5',
    minutes: 15,
    players: 'Two lines, one duel at a time. 30 players = run 8 grids side by side so nobody waits more than 40 seconds.',
    space: 'A square 10 steps wide with a mini-goal (or two stones) on each end line.',
    balls: '1 per pair',
    makeshift: 'Mini-goal = 2 stones a stride apart. No bibs? One player rolls up a trouser leg.',
    why: 'Nigerian football is built on the 1v1. Structured repetition turns street skill into a repeatable weapon, and teaches losing without hiding.',
    objectives: ['Beat the first touch of pressure', 'Use the body between opponent and ball', 'Score, then defend immediately'],
    coachingPoints: [
      'Attack the near foot, then change direction away from him.',
      'Arm out, back to him — legal shielding wins football matches.',
      'Lose the ball? Win it back before it leaves your square.',
    ],
    easier: 'Give the attacker a two-touch head start before the defender enters.',
    harder: 'First to 3 wins, loser does the next duel against the winner; add a second ball to knock out.',
    view: 'half-left',
    steps: [
      {
        label: 'Attacker vs defender',
        cue: 'Take him on your front foot.',
        cuePcm: 'Use your leg, chop am, finish.',
        home: [P(11, 'ATT', 12, 45)],
        away: [P(5, 'DEF', 22, 45)],
        ball: [12, 45],
        zones: [{ x: 8, y: 28, w: 24, h: 36, label: 'duel square' }],
        arrows: [
          { kind: 'dribble', from: [12, 45], to: [26, 38] },
          { kind: 'move', from: [22, 45], to: [16, 45], note: 'defend' },
        ],
      },
      {
        label: 'Finish, then counter',
        cue: 'Score, then win it back.',
        cuePcm: 'Finish am, after turn press am.',
        home: [P(11, 'ATT', 30, 38)],
        away: [P(5, 'DEF', 24, 42)],
        ball: [30, 38],
        equipment: [{ type: 'mini-goal', x: 34, y: 38, label: 'goal' }],
        zones: [{ x: 8, y: 28, w: 24, h: 36 }],
        arrows: [{ kind: 'pass', from: [30, 38], to: [36, 36], note: 'shot' }],
      },
    ],
    tags: ['no-cones', 'confidence', 'large-group', 'girls-ok'],
  },
  {
    id: '2v1-overlap',
    title: '2v1 with Overlap',
    titlePcm: 'Two against one',
    band: 'U12-U14',
    theme: 'Possession',
    format: '7v7',
    minutes: 15,
    players: 'Threes plus a keeper or a target. 4 groups needs 12 players and 4 balls.',
    space: 'Channel 10 steps long and 6 wide, goal or two stones at the end.',
    balls: '1 per group',
    makeshift: 'Channel sides = a line of stones or a chalk line on concrete.',
    why: 'Numbers up is the one pattern a young player must be able to smell. Two attackers, one defender, and a decision to make in 3 seconds.',
    objectives: ['Commit the defender, then release', 'Timing of the run, not speed of the pass', 'Delay if you are not on'],
    coachingPoints: [
      'First attacker walks the ball at the defender until he commits.',
      'The second one runs wide behind him, never on his shoulder.',
      'Pass to the far foot of the runner so the keeper cannot reach both.',
    ],
    easier: 'Let the defender only shadow, no touching.',
    harder: 'Make it 2v2 with a support player; limit attackers to 2 touches.',
    view: 'half-left',
    steps: [
      {
        label: 'Attract, then release',
        cue: 'Walk it at him, then give the pass.',
        cuePcm: 'Carry am go close to him, then release.',
        home: [P(7, 'CARRY', 12, 50), P(11, 'RUN', 14, 28)],
        away: [P(3, 'DEF', 24, 44)],
        ball: [12, 50],
        zones: [{ x: 10, y: 24, w: 22, h: 40, label: 'channel' }],
        arrows: [
          { kind: 'dribble', from: [12, 50], to: [20, 48] },
          { kind: 'move', from: [14, 28], to: [26, 26], note: 'overlap' },
        ],
      },
      {
        label: 'Finish off the pass',
        cue: 'Far foot, side-foot, low.',
        home: [P(7, 'PASS', 20, 48), P(11, 'FIN', 30, 26)],
        away: [P(3, 'DEF', 24, 40)],
        ball: [30, 26],
        zones: [{ x: 10, y: 24, w: 22, h: 40 }],
        arrows: [
          { kind: 'pass', from: [20, 48], to: [30, 26] },
          { kind: 'pass', from: [30, 26], to: [36, 34], note: 'shot' },
        ],
      },
    ],
    tags: ['numbers-up', 'decision-making'],
  },

  // ─────────────────────────── TRANSITION ───────────────────────────
  {
    id: '3v2-counter',
    title: '3v2 Counter Attack',
    titlePcm: 'Quick 3 against 2',
    band: 'U15-U17',
    theme: 'Transition',
    format: '9v9',
    minutes: 18,
    players: '5 in the drill, rest in a passing line behind for water and rotation. 3 groups keeps waiting under a minute.',
    space: 'Half a pitch, two real goals or two pairs of stones.',
    balls: '1 per group (2 makes it flow)',
    makeshift: 'No nets? Two bags on the ground = a post. Agree the goal width before the game.',
    why: 'Most goals at this level come in the 6 seconds after the ball changes hands. This is that moment, repeated until the read is automatic.',
    objectives: ['First 3 seconds: is it on?', 'Overload the weak side', 'Defenders delay, don\'t dive in'],
    coachingPoints: [
      'Attacker with the ball: run at the nearest defender, do not pass sideways.',
      'Third man arrives late and unmarked — wait for him if the goal is not on.',
      'Defender closest to the ball delays; the other covers the pass, never both chase.',
    ],
    easier: 'Start with a 3v1; allow the defence a goalkeeper.',
    harder: 'Add a fourth attacker making it 4v3; or the coach rolls a second ball in for "go again".',
    view: 'half-right',
    steps: [
      {
        label: 'Numbers up, go fast',
        cue: 'Run at the nearest man.',
        cuePcm: 'No time to think — run at the nearest body.',
        home: [P(8, 'W', 58, 30), P(9, 'ST', 62, 50), P(11, 'W', 58, 70)],
        away: [P(4, 'CB', 78, 42), P(5, 'CB', 80, 58)],
        ball: [58, 30],
        arrows: [
          { kind: 'dribble', from: [58, 30], to: [70, 40] },
          { kind: 'move', from: [58, 70], to: [68, 74], note: 'width' },
          { kind: 'pass', from: [62, 50], to: [68, 74] },
        ],
      },
      {
        label: 'Commit, then cut it back',
        cue: 'One commits, one is free.',
        home: [P(8, 'W', 74, 34), P(9, 'ST', 82, 50), P(11, 'W', 72, 72)],
        away: [P(4, 'CB', 80, 40), P(5, 'CB', 76, 60)],
        ball: [74, 34],
        arrows: [
          { kind: 'pass', from: [74, 34], to: [84, 50], note: 'cut-back' },
          { kind: 'move', from: [82, 50], to: [88, 50] },
        ],
      },
    ],
    tags: ['transition', 'game-real', 'girls-ok'],
  },
  {
    id: 'lose-press-5s',
    title: 'Lose It, Press It (5 seconds)',
    titlePcm: 'Lose am, press am before 5 count',
    band: 'U15-U17',
    theme: 'Pressing',
    format: '9v9',
    minutes: 15,
    players: '8 (4v4) plus 2 jokers to make 4v2 for the press.',
    space: 'Half pitch, 4 mini-goals on the end lines.',
    balls: '1-2',
    makeshift: 'Count the 5 seconds out loud. The sound is the coaching.',
    why: 'Counter-pressing is the cheapest team tactic there is and it fixes "we lose the ball and just watch". Everyone sprints, then everyone resets.',
    objectives: ['Nearest player goes, second player covers the pass', 'No standing, no complaining', 'Win it or foul it in a smart place'],
    coachingPoints: [
      'The moment you lose the ball, 3 things happen: swarm the ball, cut the forward pass, drop the goal-side line.',
      'Shout the trigger word so the whole group starts together.',
      'If you cannot win it in 5 seconds, sprint back and get your shape.',
    ],
    easier: 'Give the pressing team a head start of one player.',
    harder: 'Playing out from the back under press, with points for a goal within 8 passes.',
    view: 'half-left',
    steps: [
      {
        label: 'Ball lost — swarm',
        cue: 'Nearest goes, next covers the lane.',
        cuePcm: 'Nearest man dey go, second man dey block pass.',
        home: [P(6, 'LOSE', 22, 46), P(8, 'SUP', 16, 34), P(4, 'SUP', 26, 62), P(2, 'BAL', 30, 40)],
        away: [P(9, 'WIN', 24, 50), P(11, 'CUT', 18, 60), P(7, 'DRP', 34, 52)],
        ball: [22, 46],
        arrows: [
          { kind: 'move', from: [24, 50], to: [22, 46], note: '1st: ball' },
          { kind: 'move', from: [18, 60], to: [20, 52], note: '2nd: lane' },
          { kind: 'move', from: [34, 52], to: [30, 46], note: '3rd: goal side' },
        ],
      },
    ],
    tags: ['team-tactic', 'fitness', 'voice'],
  },

  // ─────────────────────────── TEAM SHAPE / ADULT / NPFL-style ───────────────────────────
  {
    id: 'build-out-3v2',
    title: 'Build Out From the Back (3v2)',
    band: 'Adult',
    theme: 'Possession',
    format: '11v11',
    minutes: 18,
    players: '6: GK, 2 centre backs, a midfielder; 2 forwards.',
    space: 'Penalty-box width, from goal line to halfway arc. Add a target zone 8 steps wide beyond.',
    balls: '2 (service from the coach keeps it moving)',
    makeshift: 'If you have no cones for the target zone, use two water sachets and an agreed line.',
    why: 'Every team wants to play out; most get pressed into panic. This isolates exactly the overload that beats two forwards.',
    objectives: ['Keeper as the +1', 'Create the third-man pass', 'Bait, then break the line'],
    coachingPoints: [
      'Centre backs split wide to the penalty-box edge; the midfielder drops between or steps beside.',
      'First touch must be directional, into the open body shape, not safety-side.',
      'If the midfielder is shut, we go goalkeeper → full-back → target. Never force the middle.',
    ],
    easier: 'Remove one forward; allow 3 touches.',
    harder: 'A fourth presser enters on the coach\'s call; or score only by a line-breaking pass to the target.',
    view: 'half-left',
    steps: [
      {
        label: 'Bait the press',
        cue: 'Show them the ball, then go around.',
        home: [P(1, 'GK', 4, 50, true), P(4, 'RCB', 14, 62), P(5, 'LCB', 14, 38), P(6, 'DM', 24, 50)],
        away: [P(9, 'FWD', 20, 42), P(10, 'FWD', 22, 58)],
        ball: [4, 50],
        zones: [{ x: 2, y: 28, w: 26, h: 44, label: 'build zone' }],
        arrows: [
          { kind: 'pass', from: [4, 50], to: [14, 62] },
          { kind: 'pass', from: [14, 62], to: [24, 50] },
          { kind: 'move', from: [24, 50], to: [30, 40], note: 'third man' },
        ],
      },
      {
        label: 'Break the line',
        cue: 'Into the target, then hold it.',
        home: [P(1, 'GK', 4, 50, true), P(4, 'RCB', 16, 60), P(5, 'LCB', 16, 40), P(6, 'DM', 28, 52)],
        away: [P(9, 'FWD', 22, 44), P(10, 'FWD', 24, 60)],
        ball: [34, 34],
        zones: [{ x: 2, y: 28, w: 26, h: 44 }, { x: 30, y: 24, w: 8, h: 24, label: 'target' }],
        arrows: [
          { kind: 'pass', from: [28, 52], to: [34, 34], note: 'line-break' },
          { kind: 'move', from: [16, 60], to: [26, 66] },
        ],
      },
    ],
    tags: ['shape', 'keeper', 'semi-pro'],
  },
  {
    id: 'press-trap-side',
    title: 'Press Trap — Send Wide, Then Shut',
    band: 'Adult',
    theme: 'Pressing',
    format: '11v11',
    minutes: 15,
    players: '9 outfield (4 defenders, 3 mids, 2 forwards) vs 6 in a possession game, or use your whole squad in halves.',
    space: 'Half pitch with the wide 8 steps shaded as the "trap channel".',
    balls: '2',
    makeshift: 'One assistant coach or captain stands on the touchline and shouts the trigger.',
    why: 'A trap turns eleven individuals into one machine. It is simple enough that a D-license squad can execute it on a Sunday.',
    objectives: ['Trigger = ball to full-back, or a bad first touch', 'Force down the line, cut the inside pass', 'Win in the channel or foul tactically'],
    coachingPoints: [
      'Front player curves his run to steer the pass outside — pressing is direction, not chasing.',
      'Full-back jumps, six covers the hole, far side tucks in. Nobody is optional.',
      'If they beat the first line, we stop pressing and drop into the block. That is discipline, not cowardice.',
    ],
    easier: 'Give the pressing team a numbers advantage on the trap side.',
    harder: 'Add an 11v11 condition: goals from a turnover inside 10 seconds count double.',
    view: 'half-left',
    steps: [
      {
        label: 'Steer it outside',
        cue: 'Curve your run, show him the line.',
        home: [P(9, 'PR1', 30, 44), P(10, 'PR2', 26, 58), P(7, 'PB', 20, 74), P(8, 'PC', 18, 50)],
        away: [P(4, 'CB', 10, 56), P(3, 'LB', 14, 78), P(6, 'DM', 22, 62)],
        ball: [10, 56],
        zones: [{ x: 2, y: 70, w: 34, h: 26, label: 'TRAP CHANNEL' }],
        arrows: [
          { kind: 'move', from: [30, 44], to: [14, 66], note: 'steer wide' },
          { kind: 'move', from: [20, 74], to: [14, 80], note: 'jump' },
          { kind: 'pass', from: [10, 56], to: [14, 78] },
        ],
      },
      {
        label: 'Shut it and win',
        cue: 'Ball, line, no inside pass.',
        home: [P(9, 'PR1', 14, 76), P(10, 'PR2', 18, 62), P(7, 'PB', 10, 84), P(8, 'PC', 16, 50)],
        away: [P(4, 'CB', 8, 60), P(3, 'LB', 10, 80), P(6, 'DM', 14, 66)],
        ball: [10, 80],
        zones: [{ x: 2, y: 70, w: 34, h: 26 }],
        arrows: [
          { kind: 'move', from: [18, 62], to: [12, 74], note: 'no inside' },
          { kind: 'move', from: [16, 50], to: [14, 62] },
        ],
      },
    ],
    tags: ['team-tactic', 'trigger', 'voice'],
  },
  {
    id: 'cutback-finishing',
    title: 'Wide Overload & Cut-Back Finishing',
    band: 'Adult',
    theme: 'Finishing',
    format: '11v11',
    minutes: 20,
    players: '6 attackers, 3 defenders, keeper (or two stone posts).',
    space: 'Attacking third plus penalty box.',
    balls: '4 (a bag of balls at the byline keeps reps high)',
    makeshift: 'Collect your own balls — a 5-minute ball chase is 5 fewer shots.',
    why: 'At every level, the easiest goal in football is the ball pulled back from the byline to an arriving player. Rep it until it is boring, then it is automatic.',
    objectives: ['Cross timing with the run, not the ball', 'Attacking the front post and the spot', 'Finish first time, low, across the keeper'],
    coachingPoints: [
      'The runner goes early and arrives on the half-turn, never standing at the six-yard line.',
      'Second attacker attacks the back post for the deflection.',
      'Hit the cut-back along the ground. A bouncing ball is a saved ball.',
    ],
    easier: 'Remove defenders; serve from the coach.',
    harder: 'One touch only; a defender may shadow the runner; finish within 4 seconds of the cross.',
    view: 'half-right',
    steps: [
      {
        label: 'Overlap and whip it',
        cue: 'Go early, cross low.',
        home: [P(7, 'W', 76, 20), P(2, 'RB', 72, 34), P(9, 'ST', 86, 46), P(11, 'ST2', 82, 62)],
        away: [P(5, 'CB', 84, 42), P(6, 'CB', 86, 58), P(1, 'GK', 95, 50, true)],
        ball: [72, 34],
        arrows: [
          { kind: 'move', from: [76, 20], to: [68, 26] },
          { kind: 'pass', from: [72, 34], to: [80, 24], note: 'overlap run' },
          { kind: 'pass', from: [80, 24], to: [84, 48], note: 'cut-back' },
        ],
      },
      {
        label: 'Arrive and finish',
        cue: 'Front post, side-foot, low.',
        home: [P(7, 'W', 82, 22), P(2, 'RB', 78, 30), P(9, 'ST', 84, 50), P(11, 'ST2', 88, 58)],
        away: [P(5, 'CB', 86, 44), P(6, 'CB', 88, 56), P(1, 'GK', 95, 50, true)],
        ball: [84, 50],
        arrows: [
          { kind: 'pass', from: [80, 46], to: [84, 50] },
          { kind: 'pass', from: [84, 50], to: [96, 46], note: 'GOAL' },
        ],
      },
    ],
    tags: ['finishing', 'reps'],
  },
  {
    id: 'corner-zonal',
    title: 'Attacking Corner — 3 Zones',
    band: 'Adult',
    theme: 'Set piece',
    format: '11v11',
    minutes: 15,
    players: '7 attackers + 3 blockers + keeper. Rest of squad watch with a ball at their feet.',
    space: 'Penalty box only.',
    balls: '6',
    makeshift: 'Blockers = the three smallest quick players; that is the whole trick.',
    why: 'Set pieces are a third of grassroots goals and cost nothing to rehearse. Three zones plus a short option beats zonal marking every week.',
    objectives: ['Near-post flick, penalty-spot header, back-post arrival', 'Blockers hold the keeper 4 seconds', 'One short option to break the shape'],
    coachingPoints: [
      'Runners arrive from behind, not standing in the six-yard box.',
      'Tie the keeper: two players occupy his space legally, arm-to-arm.',
      'If the corner is poor, we reset short — no half-chances.',
    ],
    easier: 'Serve from the coach\'s hand with no blockers first.',
    harder: 'Add a defensive line and score only from the second phase.',
    view: 'half-right',
    steps: [
      {
        label: 'Run the zones',
        cue: 'Near post flick, spot attack.',
        home: [P(9, 'NEAR', 84, 60), P(10, 'SPOT', 88, 46), P(11, 'BACK', 92, 30), P(7, 'SHORT', 78, 74), P(4, 'BLK', 95, 52)],
        away: [P(2, 'D1', 88, 56), P(3, 'D2', 90, 40), P(1, 'GK', 96, 50, true)],
        ball: [74, 92],
        arrows: [
          { kind: 'pass', from: [74, 92], to: [84, 58], note: 'inswinger' },
          { kind: 'move', from: [78, 62], to: [84, 60], note: 'near-post run' },
          { kind: 'move', from: [82, 36], to: [88, 46] },
        ],
      },
    ],
    tags: ['set-piece', 'dead-ball', 'high-value'],
  },

  // ─────────────────────────── GIRLS' PACK ───────────────────────────
  {
    id: 'girls-1v1-confidence',
    title: 'Girls U13 — 1v1 Confidence Ladder',
    band: 'U12-U14',
    theme: '1v1',
    format: '5v5',
    minutes: 15,
    players: 'Whole group in pairs. Nobody waits more than 30 seconds.',
    space: '10-step square with a target gate on the far side.',
    balls: '1 per 2 players',
    makeshift: 'Gate = two bottles. Keep the round short and loud so the fear goes away fast.',
    why: 'Girls who only train with boys often never get protected reps in the 1v1. Short, safe, repeated duels build the belief that everything else is built on.',
    objectives: ['Take on without apology', 'Use the body to protect', 'Speak up: call your line, call your pass'],
    coachingPoints: [
      'Every attacker gets 3 attempts before anyone swaps.',
      'Encourage the first step — hesitation, not ability, is what we are fixing.',
      'Cheer the defender who wins it fairly. Both jobs matter.',
    ],
    easier: 'Attacker starts with a 2-step head start; defender only shadow.',
    harder: 'Make it 2v1, or score with a first-time shot from the byline.',
    view: 'half-left',
    audience: 'girls',
    steps: [
      {
        label: 'Beat and drive',
        cue: 'Step at her, then push past.',
        home: [P(11, 'ATT', 12, 46)],
        away: [P(2, 'DEF', 22, 46)],
        ball: [12, 46],
        zones: [{ x: 8, y: 26, w: 26, h: 40, label: 'duel' }],
        arrows: [
          { kind: 'dribble', from: [12, 46], to: [26, 36] },
          { kind: 'pass', from: [26, 36], to: [32, 46], note: 'finish' },
        ],
      },
      {
        label: 'Switch and support',
        cue: 'If she shuts you, pass and go again.',
        home: [P(11, 'ATT', 26, 36), P(7, 'SUP', 18, 60)],
        away: [P(2, 'DEF', 24, 42)],
        ball: [26, 36],
        zones: [{ x: 8, y: 26, w: 26, h: 40 }],
        arrows: [
          { kind: 'pass', from: [26, 36], to: [18, 60], note: 'support' },
          { kind: 'move', from: [18, 60], to: [28, 58] },
        ],
      },
    ],
    tags: ['girls', 'confidence', 'no-cones'],
  },
  {
    id: 'girls-wings-2v1',
    title: 'Girls U15 — Use the Wings 2v1',
    band: 'U15-U17',
    theme: 'Possession',
    format: '7v7',
    minutes: 18,
    players: '6 attackers, 3 defenders + keeper, or 7v7 game version with conditions.',
    space: 'Half pitch, wide channel marked on each side.',
    balls: '2',
    makeshift: 'Chalk line on concrete, or a line of stones, marks the touchline channel.',
    why: 'School and league teams crowd the middle and go nowhere. Teaching wide isolation and the overlap gives the trickiest player 1v1 space, which is where this group scores.',
    objectives: ['Switch play early and often', 'Winger 1v1, fullback behind her', 'Cross or cut-back decision'],
    coachingPoints: [
      'Two touches to switch the field, then the wide player has freedom.',
      'The run must arrive while the ball travels — no standing and watching the dribble.',
      'Lose it? 5-second counter-press, together, then shape.',
    ],
    easier: 'Remove the near-side defender so the winger always has time to look up.',
    harder: 'Restrict the middle: goals only from a wide 2v1 or a cross.',
    view: 'half-right',
    audience: 'girls',
    steps: [
      {
        label: 'Switch and isolate',
        cue: 'Two touches, then wide.',
        home: [P(6, 'MID', 62, 52), P(7, 'W', 70, 24), P(3, 'FB', 64, 34)],
        away: [P(5, 'D1', 78, 32), P(4, 'D2', 82, 50), P(1, 'GK', 95, 50, true)],
        ball: [62, 52],
        zones: [{ x: 58, y: 12, w: 36, h: 22, label: 'WIDE CHANNEL' }],
        arrows: [
          { kind: 'pass', from: [62, 52], to: [70, 24], note: 'switch' },
          { kind: 'dribble', from: [70, 24], to: [84, 26] },
          { kind: 'move', from: [64, 34], to: [78, 22], note: 'overlap' },
        ],
      },
      {
        label: 'Cross or cut back',
        cue: 'Head up before you reach the line.',
        home: [P(6, 'MID', 66, 50), P(7, 'W', 86, 22), P(3, 'FB', 84, 34), P(9, 'ST', 90, 48), P(11, 'ST2', 86, 62)],
        away: [P(5, 'D1', 86, 34), P(4, 'D2', 90, 50), P(1, 'GK', 96, 50, true)],
        ball: [86, 22],
        zones: [{ x: 58, y: 12, w: 36, h: 22 }],
        arrows: [
          { kind: 'pass', from: [86, 22], to: [90, 48], note: 'cross' },
          { kind: 'move', from: [86, 62], to: [92, 54] },
        ],
      },
    ],
    tags: ['girls', 'width', 'team-tactic'],
  },
  {
    id: 'girls-block-shape',
    title: 'Girls U17 — Defensive Block & Triggers',
    band: 'U15-U17',
    theme: 'Pressing',
    format: '9v9',
    minutes: 20,
    players: '7 defenders (back 3, mid 3, striker) vs 7 in possession.',
    space: 'Two thirds of the pitch, own goal.',
    balls: '3',
    makeshift: 'Use one assistant on the halfway line to restart the phase quickly.',
    why: 'A clear "we sit here, we press there" plan is what turns a hard-working girls\' team into a hard-to-beat one. Nothing here needs fitness beyond discipline.',
    objectives: ['Hold a compact 3-3-1 block', 'Slide as a unit, not as individuals', 'Two agreed pressing triggers'],
    coachingPoints: [
      'Distance between lines: 8 steps. If you can see your neighbour\'s shirt number, you are too far.',
      'Ball moves wide — the whole block slides. Nobody stays to admire the pass.',
      'Triggers only: back-pass, bad first touch, or a receiver with his back on. Else we hold.',
    ],
    easier: 'Give the attackers 3 touches so the block can organise.',
    harder: 'Allow the attacking team to switch play freely; score if you win it and shoot within 8 seconds.',
    view: 'half-left',
    audience: 'girls',
    steps: [
      {
        label: 'Hold the block',
        cue: '8 steps apart, all one line.',
        home: [P(4, 'CB', 10, 50), P(5, 'CB', 8, 34), P(3, 'CB', 8, 66), P(8, 'CM', 20, 50), P(6, 'CM', 18, 34), P(10, 'CM', 18, 66), P(9, 'ST', 28, 50)],
        away: [P(2, 'RB', 34, 20), P(7, 'RW', 36, 34), P(11, 'LW', 34, 78)],
        ball: [34, 20],
        zones: [{ x: 6, y: 26, w: 26, h: 48, label: 'BLOCK' }],
        arrows: [{ kind: 'pass', from: [34, 20], to: [36, 34] }],
      },
      {
        label: 'Slide to the ball',
        cue: 'Ball wide — everyone shifts.',
        home: [P(4, 'CB', 12, 42), P(5, 'CB', 10, 26), P(3, 'CB', 10, 58), P(8, 'CM', 22, 42), P(6, 'CM', 22, 26), P(10, 'CM', 20, 58), P(9, 'ST', 30, 44)],
        away: [P(2, 'RB', 36, 18), P(7, 'RW', 38, 32), P(11, 'LW', 36, 76)],
        ball: [38, 32],
        zones: [{ x: 8, y: 20, w: 26, h: 48 }],
        arrows: [
          { kind: 'move', from: [8, 34], to: [10, 26], note: 'slide' },
          { kind: 'move', from: [20, 58], to: [20, 46] },
          { kind: 'move', from: [30, 50], to: [34, 40], note: 'press trigger' },
        ],
      },
    ],
    tags: ['girls', 'shape', 'no-fitness-needed'],
  },

  // ─────────────────────────── INCLUSIVE PACK ───────────────────────────
  {
    id: 'amputee-shape-passing',
    title: 'Amputee 7-a-side — Shape & Support',
    band: 'Amputee',
    theme: 'Inclusive',
    format: '7v7',
    minutes: 20,
    players: '7 a side (outfield players on crutches, one-armed goalkeeper). Squad of 12 = two blocks of 7 with rotation.',
    space: '60m x 45m where available; otherwise a half pitch. No offside — so teach depth, not drifting.',
    balls: '2-3 (loose balls slow the game for everyone)',
    makeshift: 'Crutch-friendly ground: flat, no holes, no stones in the running lanes. Inspect the pitch on foot first.',
    why: 'The crutch means turning and short support angles matter more than speed. Compact triangles and a second passing option create chances without long dribbles.',
    objectives: ['Support within 4 steps of the ball carrier', 'Two angles always open', 'Pass, then move the body — crutch work is expensive, so pass and go'],
    coachingPoints: [
      'Give the ball carrier time: arrive early, side-on, in his eyeline.',
      'Weight of pass to the foot he plays, not across his crutch side.',
      'Defend 1v1 by showing him the wider side — he cannot change direction quickly under load.',
    ],
    easier: 'Free zone: no defender inside 3 steps of the receiver.',
    harder: 'Two touches; add a joker who can only play one way.',
    view: 'full',
    audience: 'inclusive',
    steps: [
      {
        label: 'Triangles around the ball',
        cue: 'Come short, show two options.',
        home: [P(1, 'GK', 6, 50, true), P(4, 'DEF', 20, 60), P(6, 'MID', 32, 46), P(8, 'MID', 28, 66), P(10, 'ATT', 42, 40), P(11, 'ATT', 44, 60)],
        away: [P(7, 'PR', 36, 56), P(9, 'PR', 34, 34)],
        ball: [32, 46],
        arrows: [
          { kind: 'pass', from: [32, 46], to: [28, 66] },
          { kind: 'pass', from: [28, 66], to: [42, 40] },
          { kind: 'pass', from: [32, 46], to: [44, 60] },
        ],
      },
      {
        label: 'Pass and go',
        cue: 'Give and go, never stand.',
        home: [P(1, 'GK', 6, 50, true), P(4, 'DEF', 22, 58), P(6, 'MID', 38, 56), P(8, 'MID', 34, 68), P(10, 'ATT', 48, 38), P(11, 'ATT', 46, 58)],
        away: [P(7, 'PR', 38, 50), P(9, 'PR', 40, 30)],
        ball: [38, 56],
        arrows: [
          { kind: 'pass', from: [34, 68], to: [38, 56] },
          { kind: 'move', from: [38, 56], to: [46, 48], note: 'go' },
          { kind: 'pass', from: [46, 48], to: [48, 38] },
        ],
      },
    ],
    tags: ['inclusive', 'amputee', 'no-offside', 'pitch-safety'],
  },
  {
    id: 'blind-orientation',
    title: 'Blind Football — Sound & Direction',
    band: 'Blind',
    theme: 'Inclusive',
    format: '5v5',
    minutes: 20,
    players: '5 a side (field players fully blindfolded, goalkeeper sighted). Ball with bells inside.',
    space: '60m x 40m with side barriers (gym walls, boards, or a line of bags). Goal 5.5m wide.',
    balls: '1 ball with bells (or a bottle of pebbles in a bag inside a ball)',
    makeshift: 'Barrier = row of bags or a rope between stones. It replaces the touchline — players navigate by sound and touch.',
    why: 'Communication is the technique. A player who can call "man on", "left", "behind you" plays the game as well as a sighted player. This builds it for everyone.',
    objectives: ['Speak before you touch the ball', 'Kick and follow, do not watch', 'Silence when the keeper has it'],
    coachingPoints: [
      'Guidecaller speaks in short words: "here", "left", "right", "now", "shoot".',
      'The ball must make sound: keep it on the ground, kick firmly, chase by ear.',
      'Everyone quiet when the opposition keeper holds the ball — otherwise you steal his call.',
    ],
    easier: 'Remove the blindfolds first to learn the calls, then add them on one drill only.',
    harder: 'One-touch "wall" off the side barrier to beat a defender.',
    view: 'full',
    audience: 'inclusive',
    steps: [
      {
        label: 'Call, kick, follow',
        cue: 'Say it, then go.',
        home: [P(1, 'GK', 5, 50, true), P(2, 'FLD', 22, 30), P(3, 'FLD', 28, 50), P(4, 'FLD', 22, 70)],
        away: [P(9, 'OPP', 40, 44), P(10, 'OPP', 44, 58)],
        ball: [28, 50],
        zones: [{ x: 4, y: 20, w: 44, h: 60, label: 'barrier to barrier' }],
        arrows: [
          { kind: 'pass', from: [28, 50], to: [22, 30], note: '"left"' },
          { kind: 'dribble', from: [22, 30], to: [36, 26] },
        ],
      },
    ],
    tags: ['inclusive', 'blind', 'communication', 'audio-first'],
  },

  // ─────────────────────────── BIG GROUP / LOW RESOURCE ───────────────────────────
  {
    id: 'four-games-rotation',
    title: 'Four Games, One Pitch (30 kids)',
    band: 'U9-U11',
    theme: 'Game',
    format: '5v5',
    minutes: 25,
    players: 'Up to 32 in four mini-leagues of 8.',
    space: 'Four 14-step squares. Half a pitch is enough; four goals of two stones each.',
    balls: '4 (share with a neighbouring square if you have 2)',
    makeshift: 'Substitute players stand behind a goal as "walls"; rotate them every 5 minutes so nobody is a spectator.',
    why: 'The real problem in most academies is not tactics, it is 30 children and 3 balls. This gives everyone 20 minutes of live play plus rotation and keeps the coach in one place.',
    objectives: ['Maximum touches, minimum queueing', 'Learn to win and to lose a league point', 'Rotate without the coach shouting'],
    coachingPoints: [
      'Winner of each square stays, loser goes to the next square — self-organising.',
      'Coach picks one square for 3 minutes of freeze-frame teaching; the others keep playing.',
      'Every child is on a team of 4 or 5. Never 7 — that is where kids disappear.',
    ],
    easier: '4 a side, no goalkeeper, only 2 squares.',
    harder: 'Two-touch football league, or add a neutral player to make numbers up.',
    view: 'full',
    safety: 'Water break every 8 minutes. Watch the smallest kids — they keep running when they should stop.',
    steps: [
      {
        label: 'Four mini games',
        cue: 'Play, win, move on.',
        home: [P(1, 'SQ1', 14, 26), P(2, 'SQ1', 22, 34), P(3, 'SQ1', 10, 40), P(4, 'SQ2', 34, 26), P(5, 'SQ2', 40, 38), P(6, 'SQ3', 14, 64), P(7, 'SQ4', 34, 66)],
        away: [P(8, 'SQ1', 20, 22), P(9, 'SQ2', 36, 30), P(10, 'SQ3', 12, 72), P(11, 'SQ4', 40, 74)],
        ball: [16, 32],
        zones: [
          { x: 8, y: 18, w: 16, h: 26, label: 'A' },
          { x: 32, y: 18, w: 14, h: 26, label: 'B' },
          { x: 8, y: 56, w: 14, h: 26, label: 'C' },
          { x: 32, y: 58, w: 14, h: 26, label: 'D' },
        ],
        arrows: [{ kind: 'dribble', from: [20, 22], to: [12, 40] }],
      },
    ],
    tags: ['large-group', 'low-equipment', 'self-organising'],
  },
  {
    id: 'conditioned-game',
    title: 'Conditioned Game — Change the Rule, Change the Learning',
    band: 'U12-U14',
    theme: 'Game',
    format: '7v7',
    minutes: 20,
    players: '7v7 or 5v5 with substitutes on the run.',
    space: 'Full 7-a-side pitch. Nothing is marked except goals.',
    balls: '3',
    makeshift: 'This drill needs nothing but rules — perfect for a damaged pitch or a very hot day when you want lower volume but full thinking.',
    why: 'You do not need cones to coach. Changing a rule changes behaviour: which is exactly what a coach is trying to create.',
    objectives: ['Recognise the behaviour you want, then write the rule', 'Keep it playable and fun', 'Change one rule at a time'],
    coachingPoints: [
      'Want width? Goals from a wide player count double.',
      'Want passing under press? Three touches maximum, and a 5-second counter-press after a loss.',
      'Want courage in the 1v1? A dribble past a defender earns a bonus goal.',
      'Never more than two conditions, or players stop playing football.',
    ],
    easier: 'Remove the condition for 5 minutes and let them just play.',
    harder: 'Add a bonus for a goal built in under 8 seconds.',
    view: 'full',
    steps: [
      {
        label: 'Wide bonus',
        cue: 'Use the sides, double goal.',
        home: [P(7, 'W', 52, 18), P(11, 'W', 52, 82), P(9, 'ST', 62, 50), P(6, 'MID', 40, 50)],
        away: [P(2, 'FB', 66, 24), P(3, 'FB', 66, 76), P(5, 'CB', 74, 50)],
        ball: [40, 50],
        zones: [{ x: 40, y: 4, w: 44, h: 22, label: 'DOUBLE GOALS' }, { x: 40, y: 74, w: 44, h: 22, label: 'DOUBLE GOALS' }],
        arrows: [
          { kind: 'pass', from: [40, 50], to: [52, 18] },
          { kind: 'dribble', from: [52, 18], to: [72, 14] },
          { kind: 'pass', from: [52, 82], to: [70, 86] },
        ],
      },
    ],
    tags: ['no-equipment', 'thinking', 'heat-ok'],
  },
  {
    id: 'cool-down-questions',
    title: 'Cool-Down & Three Questions',
    band: 'U6-U8',
    theme: 'Cool-down',
    format: '5v5',
    minutes: 8,
    players: 'Everyone, sitting in a circle, balls collected in a pile.',
    space: 'Anywhere on the pitch. Water bottles out.',
    balls: '0',
    makeshift: 'No whistle? Use a clap pattern the group learns on day one.',
    why: 'The last five minutes is where learning gets stored. Players who say the answer own the answer — and it works with zero equipment and no literacy needed.',
    objectives: ['Players say what they learned', 'Emotional close: everyone is seen', 'Set one job for next week'],
    coachingPoints: [
      'Ask three questions, do not give three speeches: "What did we do today? What was hard? What will you try next time?"',
      'Pick the quietest child first, and the one who messed up last.',
      'End on something they did well. Names, not general praise.',
    ],
    easier: 'Let them answer in pairs before shouting out.',
    harder: 'Ask one player to demo the skill with a ball while the others guess it.',
    view: 'full',
    steps: [
      {
        label: 'Circle, collect, ask',
        cue: 'You say it, so you own it.',
        home: [P(1, 'CIR', 46, 44), P(2, 'CIR', 50, 40), P(3, 'CIR', 54, 44), P(4, 'CIR', 54, 52), P(5, 'CIR', 50, 56), P(6, 'CIR', 46, 52)],
        ball: [50, 48],
        zones: [{ x: 42, y: 36, w: 18, h: 26, label: 'circle' }],
        arrows: [{ kind: 'move', from: [46, 44], to: [50, 40], note: 'talk' }],
      },
    ],
    tags: ['no-equipment', 'reflection', 'every-session'],
  },
];

// ─────────────────────────── BUILDERS ───────────────────────────

interface BuildOptions {
  markingSize?: MarkingSize;
  homeColor?: string;
  awayColor?: string;
}

const DEFAULT_COLORS = {
  home: { primary: '#1d4ed8', text: '#ffffff' },
  away: { primary: '#b91c1c', text: '#ffffff' },
};

function toPlayers(drillStep: DrillStep, opts: BuildOptions): Player[] {
  const out: Player[] = [];
  drillStep.home.forEach((pose, i) => {
    out.push({
      id: `h-${pose.n}-${i}`,
      team: 'home',
      number: pose.n,
      name: pose.name ?? pose.role,
      role: pose.role,
      isGK: pose.gk,
      x: pose.x,
      y: pose.y,
      color: opts.homeColor ?? DEFAULT_COLORS.home.primary,
      textColor: DEFAULT_COLORS.home.text,
    });
  });
  (drillStep.away ?? []).forEach((pose, i) => {
    out.push({
      id: `a-${pose.n}-${i}`,
      team: 'away',
      number: pose.n,
      name: pose.name ?? pose.role,
      role: pose.role,
      isGK: pose.gk,
      x: pose.x,
      y: pose.y,
      color: opts.awayColor ?? DEFAULT_COLORS.away.primary,
      textColor: DEFAULT_COLORS.away.text,
    });
  });
  return out;
}

function toEquipment(drillStep: DrillStep): Equipment[] {
  return (drillStep.equipment ?? []).map((eq, i) => ({
    id: `eq-${i}-${Math.round(eq.x)}-${Math.round(eq.y)}`,
    type: eq.type,
    x: eq.x,
    y: eq.y,
    label: eq.label,
  }));
}

function toAnnotations(drillStep: DrillStep, size: MarkingSize): Annotation[] {
  const stroke = getStrokeWidthForSize(size);
  const anns: Annotation[] = [];

  (drillStep.arrows ?? []).forEach((arrow, i) => {
    const isPass = arrow.kind === 'pass';
    anns.push({
      id: `an-ar-${i}-${Math.round(arrow.from[0])}`,
      type: arrow.kind === 'move' ? 'arrow' : arrow.kind,
      points: [
        { x: arrow.from[0], y: arrow.from[1] },
        { x: arrow.to[0], y: arrow.to[1] },
      ],
      color: isPass ? '#f8fafc' : '#4ade80',
      strokeWidth: stroke,
      style: isPass ? 'dashed' : 'solid',
      size,
    });
    if (arrow.note) {
      anns.push({
        id: `an-lb-${i}`,
        type: 'text',
        points: [{ x: Math.min(96, arrow.to[0] + 1), y: Math.max(4, arrow.to[1] - 4) }],
        color: '#fbbf24',
        strokeWidth: stroke,
        style: 'solid',
        text: arrow.note,
        size,
      });
    }
  });

  (drillStep.zones ?? []).forEach((zone, i) => {
    anns.push({
      id: `an-zn-${i}`,
      type: 'zone-rect',
      points: [
        { x: zone.x, y: zone.y },
        { x: zone.x + zone.w, y: zone.y + zone.h },
      ],
      color: '#38bdf8',
      strokeWidth: stroke,
      style: 'dashed',
      fillColor: '#38bdf8',
      fillOpacity: 0.12,
      size,
      text: zone.label,
    });
  });

  return anns;
}

export function stepsFromDrill(drill: Drill, opts: BuildOptions = {}): KeyframeStep[] {
  const size = opts.markingSize ?? 'large';
  return drill.steps.map((step, idx) => ({
    id: `step-${drill.id}-${idx}`,
    name: `${idx + 1}. ${step.label}`,
    description: step.cue,
    duration: step.duration ?? 2,
    players: toPlayers(step, opts),
    ball: { id: 'ball', x: step.ball[0], y: step.ball[1] } as Ball,
    equipment: toEquipment(step),
    annotations: toAnnotations(step, size),
  }));
}

/** Instantiates a drill as a normal editable session — the whole engine stays untouched. */
export function sessionFromDrill(drill: Drill, opts: BuildOptions = {}): Session {
  const size = opts.markingSize ?? 'large';
  const now = new Date().toISOString();
  return {
    id: `session-drill-${drill.id}-${Date.now()}`,
    drillId: drill.id,
    ageGroup: drill.band,
    markingSize: size,
    title: drill.title,
    description: drill.why,
    format: drill.format,
    phase:
      drill.theme === 'Pressing'
        ? 'out-of-possession'
        : drill.theme === 'Transition'
          ? 'transition-attack'
          : drill.theme === 'Set piece'
            ? 'set-piece'
            : drill.theme === 'Game' || drill.theme === 'Inclusive' || drill.theme === 'Warm-up'
              ? 'drill'
              : 'possession',
    category: drill.band,
    homeTeam: {
      name: 'Our players',
      primaryColor: opts.homeColor ?? DEFAULT_COLORS.home.primary,
      textColor: DEFAULT_COLORS.home.text,
      gkColor: '#eab308',
      gkTextColor: '#000000',
      formation: 'kit',
    },
    awayTeam: {
      name: drill.audience === 'inclusive' ? 'Opposition' : 'Opponents',
      primaryColor: opts.awayColor ?? DEFAULT_COLORS.away.primary,
      textColor: DEFAULT_COLORS.away.text,
      gkColor: '#16a34a',
      gkTextColor: '#ffffff',
      formation: 'kit',
    },
    pitchConfig: {
      view: drill.view ?? 'full',
      orientation: 'horizontal',
      theme: 'classic-grass',
      showGrid: false,
      gridType: 'none',
      showPlayerLabels: true,
      showPlayerNumbers: true,
      showVisionCones: false,
      snapToGrid: false,
    },
    coachingPoints: drill.coachingPoints,
    objectives: drill.objectives,
    kitMeta: {
      drillId: drill.id,
      minutes: drill.minutes,
      players: drill.players,
      space: drill.space,
      balls: drill.balls,
      makeshift: drill.makeshift,
      safety: drill.safety,
      cues: drill.steps.map((s) => ({ cue: s.cue, cuePcm: s.cuePcm })),
    },
    createdAt: now,
    updatedAt: now,
    currentStepIndex: 0,
    steps: stepsFromDrill(drill, { markingSize: size }),
  };
}

export function findDrill(id: string): Drill | undefined {
  return DRILLS.find((d) => d.id === id);
}
