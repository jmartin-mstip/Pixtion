/* PIXTION · studio/tools.js — drawing tools: pencil, eraser, fill, line, box, circle, spray, dither, replace, mirror and brush size. */
import { app } from '../shared.js';
import { $, $$, toast } from '../core/dom.js';
import { NAMES } from '../core/palette.js';
import { S } from '../state.js';
import { board, drawBoard } from './board.js';
import { renderMeta } from './view.js';

export function setTool(t){ S.tool = t; $$('[data-tool]').forEach(b => b.setAttribute('aria-pressed', b.dataset.tool === t)); board.style.cursor = t === 'pan' ? 'grab' : 'crosshair'; $('#textRow').hidden = t !== 'text'; if (t === 'text') toast('Type your text, then tap the canvas where it should start. Brush size sets the letter size.'); }

export let SHAPES;

export function putPx(px, py, v){
  const f = S.frames[S.cur], g = S.grid;
  const one = (x, y) => { if (x < 0 || y < 0 || x >= g || y >= g) return; if (S.tool === 'dither' && (x + y) % 2) return; const i = y * g + x; if (f[i] !== v){ f[i] = v; app.dirty = true; } };
  one(px, py); if (S.mirror) one(g - 1 - px, py);
}

export function setPx(x, y){
  const g = S.grid, v = S.tool === 'eraser' ? 0 : S.color;
  const put = (px, py) => putPx(px, py, v);
  const b = S.brush, o = Math.floor((b - 1) / 2);
  for (let dy = 0; dy < b; dy++) for (let dx = 0; dx < b; dx++) put(x + dx - o, y + dy - o);
}

function rect(a, b){
  const x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x), y0 = Math.min(a.y, b.y), y1 = Math.max(a.y, b.y);
  for (let x = x0; x <= x1; x++){ setPx(x, y0); setPx(x, y1); }
  for (let y = y0; y <= y1; y++){ setPx(x0, y); setPx(x1, y); }
}

export function shapeTo(c){
  S.frames[S.cur] = app.base.slice(); app.dirty = false;
  if (S.tool === 'line') line(app.start, c);
  else if (S.tool === 'rect') rect(app.start, c);
  else if (S.tool === 'rectf'){ const x0 = Math.min(app.start.x, c.x), x1 = Math.max(app.start.x, c.x), y0 = Math.min(app.start.y, c.y), y1 = Math.max(app.start.y, c.y); for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) putPx(x, y, S.color); }
  else if (S.tool === 'circle') ellipse(app.start, c);
}

function ellipse(a, b){
  const x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x), y0 = Math.min(a.y, b.y), y1 = Math.max(a.y, b.y);
  const cx = (x0 + x1 + 1) / 2, cy = (y0 + y1 + 1) / 2, rx = (x1 - x0 + 1) / 2, ry = (y1 - y0 + 1) / 2;
  const ins = (x, y) => ((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2 <= 1;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (ins(x, y) && (!ins(x - 1, y) || !ins(x + 1, y) || !ins(x, y - 1) || !ins(x, y + 1))) setPx(x, y);
}

export function sprayAt(c){
  const rad = Math.max(2, S.brush * 1.6 + 1), n = Math.max(4, Math.round(rad * 1.5));
  for (let i = 0; i < n; i++){ const an = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random()) * rad; putPx(Math.round(c.x + Math.cos(an) * d), Math.round(c.y + Math.sin(an) * d), S.color); }
}

export function replaceColour(c){
  const f = S.frames[S.cur], t = f[c.y * S.grid + c.x], v = S.color;
  if (t === v){ toast('That pixel is already the selected colour.'); return; }
  const frames = $('#tfAll').checked ? S.frames : [f];
  let n = 0; frames.forEach(fr => { for (let i = 0; i < fr.length; i++) if (fr[i] === t){ fr[i] = v; n++; } });
  app.dirty = n > 0; toast(`Replaced ${n.toLocaleString()} ${t ? NAMES[t] : 'empty'} pixels with ${NAMES[v]}.`);
}

export function line(a, b){
  let x0 = a.x, y0 = a.y; const dx = Math.abs(b.x - x0), dy = -Math.abs(b.y - y0), sx = x0 < b.x ? 1 : -1, sy = y0 < b.y ? 1 : -1; let err = dx + dy;
  for (;;){ setPx(x0, y0); if (x0 === b.x && y0 === b.y) break; const e2 = 2 * err; if (e2 >= dy){ err += dy; x0 += sx; } if (e2 <= dx){ err += dx; y0 += sy; } }
}

export function fill(x, y){ flood(x, y); if (S.mirror) flood(S.grid - 1 - x, y); }

function flood(x, y){
  const g = S.grid, f = S.frames[S.cur], t = f[y * g + x], v = S.color; if (t === v) return;
  const stack = new Int32Array(g * g * 4 + 4); let sp = 0; stack[sp++] = y * g + x;
  while (sp){
    const i = stack[--sp]; if (f[i] !== t) continue; f[i] = v; app.dirty = true;
    const cx = i % g, cy = (i - cx) / g;
    if (cx > 0) stack[sp++] = i - 1; if (cx < g - 1) stack[sp++] = i + 1; if (cy > 0) stack[sp++] = i - g; if (cy < g - 1) stack[sp++] = i + g;
  }
}

/** Runs once at start-up, in the original order. */
export function init() {
  $$('[data-tool]').forEach(b => b.onclick = () => setTool(b.dataset.tool));

  app.drawing = false;
  app.last = null;
  app.dirty = false;

  app.start = null;
  app.base = null;

  SHAPES = ['line', 'rect', 'rectf', 'circle'];

  $('#mirrorBtn').onclick = () => { S.mirror = !S.mirror; renderMeta(); drawBoard(); if (S.mirror) toast('Mirror on. Strokes are copied to the other side of the dashed line.'); };

  $$('[data-brush]').forEach(b => b.onclick = () => { S.brush = Number(b.dataset.brush); $$('[data-brush]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
}
