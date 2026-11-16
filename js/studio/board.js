/* PIXTION · studio/board.js — the drawing canvas: rendering, pointer input, panning and zoom. */
import { app } from '../shared.js';
import { playing, stopPlay } from './playback.js';
import { $, $$, toast } from '../core/dom.js';
import { colorName } from '../core/palette.js';
import { drawPixels } from '../core/render.js';
import { S, settings } from '../state.js';
import { pushUndo, updUndo } from './history.js';
import { selColor } from './palette-ui.js';
import { stampText } from './text-tool.js';
import { SHAPES, fill, line, replaceColour, setPx, setTool, shapeTo, sprayAt } from './tools.js';
import { changed } from './view.js';

export let board;
let bctx;

function cellPx(g) { return g <= 64 ? Math.max(16, Math.round(640 / g)) : Math.max(2, Math.round(1024 / g)); }

/** Draws the canvas. Normally the frame being edited; during Play, the frame being shown. */
export function drawBoard(i = S.cur){
  const g = S.grid, CELL = cellPx(g), size = g * CELL;
  if (board.width !== size){ board.width = size; board.height = size; }
  bctx.imageSmoothingEnabled = false;
  bctx.fillStyle = '#ffffff'; bctx.fillRect(0, 0, size, size);
  if (i === S.cur && S.onion && S.cur > 0) drawPixels(bctx, S.frames[S.cur - 1], g, CELL, .28);
  drawPixels(bctx, S.frames[i] || S.frames[S.cur], g, CELL);
  if (settings.grid && CELL * S.zoom >= 6 && g <= 128){
    bctx.strokeStyle = '#dedede'; bctx.lineWidth = Math.max(1, CELL / 12); bctx.beginPath();
    for (let i = 1; i < g; i++){ bctx.moveTo(i * CELL, 0); bctx.lineTo(i * CELL, size); bctx.moveTo(0, i * CELL); bctx.lineTo(size, i * CELL); }
    bctx.stroke();
  }
  if (S.mirror){
    bctx.save(); bctx.strokeStyle = 'rgba(201,74,90,.75)'; bctx.lineWidth = Math.max(3, CELL / 6); bctx.setLineDash([CELL / 2, CELL / 3]);
    bctx.beginPath(); bctx.moveTo(size / 2, 0); bctx.lineTo(size / 2, size); bctx.stroke(); bctx.restore();
  }
}

function cellAt(e){
  const r = board.getBoundingClientRect(), g = S.grid;
  const x = Math.floor((e.clientX - r.left) / r.width * g), y = Math.floor((e.clientY - r.top) / r.height * g);
  return (x < 0 || y < 0 || x >= g || y >= g) ? null : {x, y};
}

let panning;

let scroller;

function finishStroke(){ app.drawing = false; if (!app.dirty){ app.undo.pop(); updUndo(); } changed(); }

function setZoom(z){
  S.zoom = z; board.style.setProperty('--zoom', z);
  $$('[data-zoom]').forEach(b => b.setAttribute('aria-pressed', Number(b.dataset.zoom) === z));
  if (z === 1 && S.tool === 'pan') setTool('pencil');
  drawBoard();
}

/** Runs once at start-up, in the original order. */
export function init() {
  board = $('#board');
  bctx = board.getContext('2d');

  panning = null;

  scroller = $('#boardScroll');

  board.addEventListener('pointerdown', e => {
    if (playing) stopPlay();
    if (S.tool === 'pan'){ e.preventDefault(); panning = {x: e.clientX, y: e.clientY, l: scroller.scrollLeft, t: scroller.scrollTop}; try { board.setPointerCapture(e.pointerId); } catch {} return; }
    const c = cellAt(e); if (!c) return; e.preventDefault();
    if (S.tool === 'picker'){
      const v = S.frames[S.cur][c.y * S.grid + c.x];
      if (v){ selColor(v); setTool('pencil'); toast(`Picked ${colorName(v)}. Pencil is ready.`); }
      else toast('That pixel is empty. Tap a coloured pixel.');
      return;
    }
    pushUndo(); app.dirty = false;
    if (S.tool === 'fill'){ fill(c.x, c.y); finishStroke(); return; }
    if (S.tool === 'replace'){ replaceColour(c); finishStroke(); return; }
    if (S.tool === 'text'){ stampText(c); finishStroke(); return; }
    app.drawing = true; app.last = c; app.start = c; try { board.setPointerCapture(e.pointerId); } catch {}
    if (SHAPES.includes(S.tool)){ app.base = S.frames[S.cur].slice(); shapeTo(c); } else if (S.tool === 'spray') sprayAt(c); else setPx(c.x, c.y);
    drawBoard();
  });

  board.addEventListener('pointermove', e => {
    if (panning){ scroller.scrollLeft = panning.l - (e.clientX - panning.x); scroller.scrollTop = panning.t - (e.clientY - panning.y); return; }
    if (!app.drawing) return; const c = cellAt(e); if (!c) return;
    if (S.tool === 'spray'){ sprayAt(c); app.last = c; drawBoard(); return; }
    if (c.x === app.last.x && c.y === app.last.y) return;
    if (SHAPES.includes(S.tool)) shapeTo(c); else if (S.tool === 'spray') sprayAt(c); else line(app.last, c);
    app.last = c; drawBoard();
  });

  board.addEventListener('pointerup', () => { panning = null; if (app.drawing) finishStroke(); });

  board.addEventListener('pointercancel', () => { panning = null; if (app.drawing) finishStroke(); });

  $$('[data-zoom]').forEach(b => b.onclick = () => { setZoom(Number(b.dataset.zoom)); if (S.zoom > 1) toast('Zoomed in. Use ✋ Pan to move around.'); });
}
