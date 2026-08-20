export interface Point {
  x: number;
  y: number;
}

export function distance(p1: Point, p2: Point): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

export function angle(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

/**
 * Generates an SVG path string for a wavy / zig-zag dribbling line
 */
export function generateWavyPath(start: Point, end: Point, wavelength = 3, amplitude = 1.2): string {
  const dist = distance(start, end);
  if (dist < 1) return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;

  const ang = angle(start, end);
  const cos = Math.cos(ang);
  const sin = Math.sin(ang);
  const perpCos = -sin;
  const perpSin = cos;

  const numWaves = Math.max(2, Math.floor(dist / wavelength));
  const waveLen = dist / numWaves;

  let path = `M ${start.x} ${start.y}`;

  for (let i = 0; i < numWaves; i++) {
    const t1 = (i + 0.25) * waveLen;
    const t2 = (i + 0.75) * waveLen;
    const tEnd = (i + 1) * waveLen;

    const side = i % 2 === 0 ? 1 : -1;

    // Control point 1
    const cx1 = start.x + cos * t1 + perpCos * amplitude * side;
    const cy1 = start.y + sin * t1 + perpSin * amplitude * side;

    // Control point 2
    const cx2 = start.x + cos * t2 - perpCos * amplitude * side;
    const cy2 = start.y + sin * t2 - perpSin * amplitude * side;

    // End of wave segment
    const ex = start.x + cos * tEnd;
    const ey = start.y + sin * tEnd;

    path += ` C ${cx1.toFixed(2)} ${cy1.toFixed(2)}, ${cx2.toFixed(2)} ${cy2.toFixed(2)}, ${ex.toFixed(2)} ${ey.toFixed(2)}`;
  }

  return path;
}

/**
 * Generates an SVG path for a smooth curved line through multiple points
 */
export function generateCurvedPath(points: Point[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

  if (points.length === 3) {
    // Quadratic bezier with middle point as control
    const [p0, p1, p2] = points;
    return `M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`;
  }

  // Smooth Catmull-Rom or cubic spline
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;

    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

/**
 * Generates vision cone SVG path for a player facing a specific direction
 */
export function generateVisionCone(x: number, y: number, angleDeg: number, length = 12, fovDeg = 55): string {
  const rad = (angleDeg * Math.PI) / 180;
  const halfFov = ((fovDeg / 2) * Math.PI) / 180;

  const leftAngle = rad - halfFov;
  const rightAngle = rad + halfFov;

  // Aspect ratio adjustment (assuming pitch is roughly 100 wide x 68 high in real meters)
  const aspect = 1.0; 

  const x1 = x + Math.cos(leftAngle) * length;
  const y1 = y + Math.sin(leftAngle) * length * aspect;

  const x2 = x + Math.cos(rightAngle) * length;
  const y2 = y + Math.sin(rightAngle) * length * aspect;

  return `M ${x} ${y} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${length} ${length * aspect} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
}

/**
 * Smooth cubic interpolation (ease-in-out)
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Linear interpolation
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
