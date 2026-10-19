import { Drill, DrillArrow, DrillZone, DrillStep } from '../data/drills';

/**
 * WhatsApp share card.
 *
 * In Nigerian grassroots the delivery channel is not email, a PDF or a printout — it is a
 * picture into a team or coach group. So every drill can become a 1080x1350 PNG drawn on a
 * canvas (no SVG serialisation, no external fonts, no network), plus a plain-text version
 * that reads well inside a chat bubble.
 */

type Ctx = CanvasRenderingContext2D;

const PITCH = { w: 105, h: 68 }; // metres, for proportions only

interface Crop {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

function cropFor(view: Drill['view']): Crop {
  switch (view) {
    case 'half-left':
      return { x0: 0, x1: 52, y0: 0, y1: 100 };
    case 'half-right':
      return { x0: 48, x1: 100, y0: 0, y1: 100 };
    case 'attacking-third':
      return { x0: 62, x1: 100, y0: 0, y1: 100 };
    case 'full':
    default:
      return { x0: 0, x1: 100, y0: 0, y1: 100 };
  }
}

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrap(ctx: Ctx, text: string, maxW: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) break;
    } else {
      line = test;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (lines.length === maxLines) {
    const last = lines[maxLines - 1];
    const overflow = words.join(' ').length > lines.join(' ').length;
    if (overflow && !last.endsWith('…')) lines[maxLines - 1] = `${last.replace(/…$/, '')}…`;
  }
  return lines;
}

function drawPitch(ctx: Ctx, rect: { x: number; y: number; w: number; h: number }, crop: Crop) {
  const { x, y, w, h } = rect;
  const sx = w / (crop.x1 - crop.x0);
  const sy = h / (crop.y1 - crop.y0);
  const px = (pitchX: number) => x + (pitchX - crop.x0) * sx;
  const py = (pitchY: number) => y + (pitchY - crop.y0) * sy;

  // surface
  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, '#14532d');
  grad.addColorStop(1, '#0f3a20');
  ctx.fillStyle = grad;
  roundRect(ctx, x, y, w, h, 10);
  ctx.fill();
  ctx.save();
  roundRect(ctx, x, y, w, h, 10);
  ctx.clip();

  // mow stripes
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  const stripeW = w / 8;
  for (let i = 0; i < 8; i += 2) ctx.fillRect(x + i * stripeW, y, stripeW, h);

  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = Math.max(1.4, w * 0.0022);

  // outline
  ctx.strokeRect(px(0), py(0), (100 - 0) * sx, (100 - 0) * sy);

  // halfway + centre circle
  if (crop.x0 <= 50 && crop.x1 >= 50) {
    ctx.beginPath();
    ctx.moveTo(px(50), py(0));
    ctx.lineTo(px(50), py(100));
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(px(50), py(50), 8.7 * sx, 13.5 * sy, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // penalty areas / goals, left and right
  const drawBox = (side: 'left' | 'right') => {
    const depth = 15.7;
    const width = 59.3;
    const smallDepth = 5.2;
    const smallWidth = 27;
    const goalDepth = 2.4;
    const goalWidth = 10.8;
    const xLine = side === 'left' ? 0 : 100;
    const dir = side === 'left' ? 1 : -1;

    ctx.strokeRect(
      side === 'left' ? px(xLine) : px(xLine - depth),
      py((100 - width) / 2),
      depth * sx,
      width * sy
    );
    ctx.strokeRect(
      side === 'left' ? px(xLine) : px(xLine - smallDepth),
      py((100 - smallWidth) / 2),
      smallDepth * sx,
      smallWidth * sy
    );
    ctx.strokeRect(
      side === 'left' ? px(xLine - goalDepth) : px(xLine),
      py((100 - goalWidth) / 2),
      goalDepth * sx,
      goalWidth * sy
    );
    void xLine;
    void dir;
  };
  if (crop.x0 <= 16) drawBox('left');
  if (crop.x1 >= 84) drawBox('right');
  ctx.restore();
}

function arrowHead(ctx: Ctx, fromX: number, fromY: number, toX: number, toY: number, size: number) {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - size * Math.cos(angle - 0.4), toY - size * Math.sin(angle - 0.4));
  ctx.lineTo(toX - size * Math.cos(angle + 0.4), toY - size * Math.sin(angle + 0.4));
  ctx.closePath();
  ctx.fill();
}

function drawArrow(ctx: Ctx, arrow: DrillArrow, rect: { x: number; y: number; w: number; h: number }, crop: Crop, lw: number) {
  const sx = rect.w / (crop.x1 - crop.x0);
  const sy = rect.h / (crop.y1 - crop.y0);
  const X = (v: number) => rect.x + (v - crop.x0) * sx;
  const Y = (v: number) => rect.y + (v - crop.y0) * sy;
  const x1 = X(arrow.from[0]);
  const y1 = Y(arrow.from[1]);
  const x2 = X(arrow.to[0]);
  const y2 = Y(arrow.to[1]);

  ctx.lineWidth = lw;
  ctx.lineCap = 'round';

  if (arrow.kind === 'pass') {
    ctx.strokeStyle = '#f8fafc';
    ctx.fillStyle = '#f8fafc';
    ctx.setLineDash([lw * 4, lw * 3]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
    arrowHead(ctx, x1, y1, x2, y2, lw * 3.4);
    return;
  }

  if (arrow.kind === 'dribble') {
    ctx.strokeStyle = '#4ade80';
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.max(1, Math.hypot(dx, dy));
    const nx = -dy / len;
    const ny = dx / len;
    const waves = Math.max(2, Math.round(len / (lw * 9)));
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const wob = Math.sin(t * waves * Math.PI * 2) * lw * 1.9;
      const cx = x1 + dx * t + nx * wob;
      const cy = y1 + dy * t + ny * wob;
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    arrowHead(ctx, x1 + dx * 0.94, y1 + dy * 0.94, x2, y2, lw * 3.4);
    return;
  }

  // movement + curved both get a bend, curved more of one
  const bend = arrow.kind === 'curved' ? 0.34 : 0.12;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.max(1, Math.hypot(dx, dy));
  const cx = mx + (-dy / len) * len * bend;
  const cy = my + (dx / len) * len * bend;
  ctx.strokeStyle = '#4ade80';
  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(cx, cy, x2, y2);
  ctx.stroke();
  arrowHead(ctx, cx, cy, x2, y2, lw * 3.4);
}

function drawZone(ctx: Ctx, zone: DrillZone, rect: { x: number; y: number; w: number; h: number }, crop: Crop, lw: number, fs: number) {
  const sx = rect.w / (crop.x1 - crop.x0);
  const sy = rect.h / (crop.y1 - crop.y0);
  const x = rect.x + (zone.x - crop.x0) * sx;
  const y = rect.y + (zone.y - crop.y0) * sy;
  const w = zone.w * sx;
  const h = zone.h * sy;
  ctx.save();
  ctx.fillStyle = 'rgba(56,189,248,0.16)';
  ctx.strokeStyle = 'rgba(125,211,252,0.9)';
  ctx.lineWidth = lw;
  ctx.setLineDash([lw * 3, lw * 2.4]);
  roundRect(ctx, x, y, w, h, Math.min(10, w * 0.08));
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);
  if (zone.label) {
    ctx.fillStyle = '#bae6fd';
    ctx.font = `700 ${fs}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(zone.label.toUpperCase(), x + lw * 2, y + fs * 1.35);
  }
  ctx.restore();
}

function drawStep(ctx: Ctx, drill: Drill, stepIndex: number, rect: { x: number; y: number; w: number; h: number }) {
  const step: DrillStep = drill.steps[Math.min(stepIndex, drill.steps.length - 1)];
  const crop = cropFor(drill.view);
  drawPitch(ctx, rect, crop);

  const lw = Math.max(2.2, rect.w * 0.0055);
  const fs = Math.max(10, rect.w * 0.016);

  ctx.save();
  roundRect(ctx, rect.x, rect.y, rect.w, rect.h, 10);
  ctx.clip();
  (step.zones ?? []).forEach((z) => drawZone(ctx, z, rect, crop, lw, fs));
  (step.arrows ?? []).forEach((a) => drawArrow(ctx, a, rect, crop, lw));

  const r = Math.max(9, rect.w * 0.023);
  const sx = rect.w / (crop.x1 - crop.x0);
  const sy = rect.h / (crop.y1 - crop.y0);
  const at = (p: { x: number; y: number }) => ({
    cx: rect.x + (p.x - crop.x0) * sx,
    cy: rect.y + (p.y - crop.y0) * sy,
  });

  const dot = (pose: { n: number; role: string; x: number; y: number }, color: string, textColor: string) => {
    const { cx, cy } = at({ x: pose.x, y: pose.y });
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = Math.max(1.5, r * 0.16);
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.stroke();
    ctx.fillStyle = textColor;
    ctx.font = `800 ${r * 1.05}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(pose.n), cx, cy + r * 0.06);
    ctx.font = `700 ${fs * 0.82}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.fillText(pose.role, cx, cy + r + fs * 0.85);
    ctx.textBaseline = 'alphabetic';
  };

  step.home.forEach((p) => dot(p, '#1d4ed8', '#ffffff'));
  (step.away ?? []).forEach((p) => dot(p, '#b91c1c', '#ffffff'));

  if (step.ball) {
    const { cx, cy } = at({ x: step.ball[0], y: step.ball[1] });
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.46, 0, Math.PI * 2);
    ctx.fillStyle = '#facc15';
    ctx.fill();
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = Math.max(1, r * 0.1);
    ctx.stroke();
  }
  ctx.restore();
}

function chip(ctx: Ctx, text: string, x: number, y: number, h: number, fs: number, fill: string, fg: string) {
  ctx.font = `700 ${fs}px system-ui, -apple-system, Segoe UI, sans-serif`;
  const w = ctx.measureText(text).width + fs * 1.6;
  ctx.fillStyle = fill;
  roundRect(ctx, x, y, w, h, h / 2);
  ctx.fill();
  ctx.fillStyle = fg;
  ctx.textAlign = 'left';
  ctx.fillText(text, x + fs * 0.8, y + h * 0.68);
  return w + fs * 0.7;
}

export interface CardOptions {
  width?: number;
  compact?: boolean;
  academyName?: string;
  showPidgin?: boolean;
}

export function renderDrillCard(drill: Drill, stepIndex: number, opts: CardOptions = {}): HTMLCanvasElement {
  const width = opts.width ?? 1080;
  const compact = !!opts.compact;
  const height = compact ? Math.round(width * 0.72) : Math.round(width * 1.25);
  const pad = Math.round(width * 0.052);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // page
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#0b1220');
  bg.addColorStop(1, '#0a1a14');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(0, 0, width, Math.max(6, width * 0.008));

  const scale = width / 1080;
  const titleFs = 46 * scale;
  const chipFs = 24 * scale;
  const cueFs = 34 * scale;
  const bodyFs = 25 * scale;

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // title
  ctx.font = `800 ${titleFs}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.fillStyle = '#f8fafc';
  const titleLines = wrap(ctx, drill.title, width - pad * 2, 2);
  let cursor = pad + titleFs;
  titleLines.forEach((l) => {
    ctx.fillText(l, pad, cursor);
    cursor += titleFs * 1.12;
  });

  // chips
  cursor += 8 * scale;
  let cx = pad;
  const chipH = chipFs * 1.9;
  const chips: { text: string; fill: string; fg: string }[] = [
    { text: drill.band, fill: '#10b981', fg: '#04241a' },
    { text: drill.theme, fill: '#1e293b', fg: '#cbd5e1' },
    { text: `${drill.minutes} min`, fill: '#1e293b', fg: '#cbd5e1' },
    { text: drill.balls.split('(')[0].trim(), fill: '#1e293b', fg: '#cbd5e1' },
  ];
  chips.forEach((c) => {
    if (cx > width - pad - 140 * scale) return;
    cx += chip(ctx, c.text, cx, cursor, chipH, chipFs, c.fill, c.fg);
  });
  cursor += chipH + 18 * scale;

  // pitch
  const pitchW = width - pad * 2;
  const crop = cropFor(drill.view);
  const aspect = (crop.y1 - crop.y0) / (crop.x1 - crop.x0);
  const pitchH = Math.min(Math.round(pitchW * aspect * (PITCH.h / PITCH.w)), compact ? 420 * scale : 560 * scale);
  drawStep(ctx, drill, stepIndex, { x: pad, y: cursor, w: pitchW, h: pitchH });
  cursor += pitchH + 26 * scale;

  // step label + cue
  const step = drill.steps[Math.min(stepIndex, drill.steps.length - 1)];
  ctx.font = `700 ${bodyFs}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.fillStyle = '#64748b';
  ctx.fillText(`STEP ${Math.min(stepIndex, drill.steps.length - 1) + 1} — ${step.label.toUpperCase()}`, pad, cursor);
  cursor += cueFs * 1.2;

  ctx.font = `800 ${cueFs}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.fillStyle = '#4ade80';
  wrap(ctx, step.cue, width - pad * 2, 2).forEach((l) => {
    ctx.fillText(l, pad, cursor);
    cursor += cueFs * 1.16;
  });

  if (opts.showPidgin !== false && step.cuePcm) {
    ctx.font = `600 ${bodyFs * 1.02}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.fillStyle = '#fbbf24';
    wrap(ctx, `“${step.cuePcm}”`, width - pad * 2, 2).forEach((l) => {
      ctx.fillText(l, pad, cursor);
      cursor += bodyFs * 1.3;
    });
  }

  if (!compact) {
    cursor += 14 * scale;
    ctx.fillStyle = 'rgba(148,163,184,0.22)';
    ctx.fillRect(pad, cursor, width - pad * 2, 1.5);
    cursor += 30 * scale;

    ctx.font = `700 ${bodyFs}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('WHAT TO SAY', pad, cursor);
    cursor += bodyFs * 1.35;
    ctx.font = `500 ${bodyFs}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.fillStyle = '#e2e8f0';
    drill.coachingPoints.slice(0, 3).forEach((pt) => {
      const lines = wrap(ctx, pt, width - pad * 2 - 22 * scale, 2);
      ctx.fillStyle = '#10b981';
      ctx.fillText('•', pad, cursor);
      ctx.fillStyle = '#e2e8f0';
      lines.forEach((l, i) => {
        ctx.fillText(l, pad + 22 * scale, cursor);
        if (i < lines.length - 1) cursor += bodyFs * 1.22;
      });
      cursor += bodyFs * 1.5;
    });

    cursor += 6 * scale;
    ctx.font = `600 ${bodyFs * 0.94}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.fillStyle = '#94a3b8';
    wrap(ctx, `No equipment? ${drill.makeshift}`, width - pad * 2, 2).forEach((l) => {
      ctx.fillText(l, pad, cursor);
      cursor += bodyFs * 1.2;
    });

    ctx.font = `600 ${bodyFs * 0.94}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.fillStyle = '#64748b';
    wrap(ctx, `Area: ${drill.space}`, width - pad * 2, 2).forEach((l, idx) => {
      if (idx === 1) ctx.fillText('…', pad, cursor);
      else ctx.fillText(l, pad, cursor);
      cursor += bodyFs * 1.2;
    });
  }

  // footer
  ctx.font = `700 ${bodyFs * 0.9}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.fillStyle = '#10b981';
  const footer = opts.academyName?.trim()
    ? `${opts.academyName.trim()}  ·  Coach Kit — free, works offline`
    : 'Tactical Coach · Coach Kit — free, works offline, no account';
  ctx.fillText(footer, pad, height - pad * 0.7);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#64748b';
  ctx.font = `600 ${bodyFs * 0.82}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.fillText(`${Math.min(stepIndex, drill.steps.length - 1) + 1}/${drill.steps.length}`, width - pad, height - pad * 0.7);

  return canvas;
}

export function drillCardDataUrl(drill: Drill, stepIndex: number, opts: CardOptions = {}): string {
  return renderDrillCard(drill, stepIndex, opts).toDataURL('image/png');
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
}

export async function drillCardBlob(drill: Drill, stepIndex: number, opts: CardOptions = {}): Promise<Blob | null> {
  return canvasToBlob(renderDrillCard(drill, stepIndex, opts));
}

function fileNameFor(drill: Drill): string {
  return `${drill.id}-step.png`.replace(/[^a-z0-9.-]/gi, '_');
}

/**
 * Shares the card into the native sheet (WhatsApp, Status, Telegram…). If the browser
 * cannot share files, it saves the PNG instead so the coach can attach it by hand.
 */
export async function shareDrillCard(
  drill: Drill,
  stepIndex: number,
  opts: CardOptions = {}
): Promise<'shared' | 'saved' | 'empty'> {
  const blob = await drillCardBlob(drill, stepIndex, opts);
  if (!blob) return 'empty';
  const file = new File([blob], fileNameFor(drill), { type: 'image/png' });
  const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
  try {
    if (nav.canShare?.({ files: [file] }) && nav.share) {
      await nav.share({ files: [file], title: drill.title, text: drillToText(drill, stepIndex) });
      return 'shared';
    }
  } catch {
    /* user cancelled, or share rejected — fall back to saving */
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileNameFor(drill);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  return 'saved';
}

/** Plain-text version for a chat bubble — no formatting that WhatsApp will mangle. */
export function drillToText(drill: Drill, stepIndex?: number): string {
  const lines: string[] = [];
  lines.push(`⚽ ${drill.title}`);
  lines.push(`${drill.band} · ${drill.theme} · ${drill.minutes} min · ${drill.format}`);
  lines.push('');
  const steps = stepIndex === undefined ? drill.steps : [drill.steps[stepIndex] ?? drill.steps[0]];
  steps.forEach((s, i) => {
    lines.push(`${stepIndex === undefined ? i + 1 : stepIndex + 1}. ${s.label}`);
    lines.push(`   👉 ${s.cue}`);
    if (s.cuePcm) lines.push(`   🗣 ${s.cuePcm}`);
  });
  lines.push('');
  lines.push(`Players: ${drill.players}`);
  lines.push(`Area: ${drill.space}`);
  lines.push(`Balls: ${drill.balls}`);
  lines.push(`No equipment: ${drill.makeshift}`);
  lines.push('');
  lines.push('Coaching points:');
  drill.coachingPoints.forEach((p) => lines.push(`• ${p}`));
  lines.push('');
  lines.push(`Easier: ${drill.easier}`);
  lines.push(`Harder: ${drill.harder}`);
  lines.push('');
  lines.push('— from Coach Kit (free, offline)');
  return lines.join('\n');
}
