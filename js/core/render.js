/* PIXTION · core/render.js — fast pixel rendering through ImageData, and light thumbnails for big grids. */
import { fullPalette } from './palette.js';

/* A palette as 32-bit RGBA words, 64 entries, cached per list of custom colours. */
const cache = new Map();
export function palette32(custom){
  const key = custom && custom.length ? custom.join(',') : '';
  let p = cache.get(key);
  if (!p){
    p = new Uint32Array(64);
    fullPalette(custom).forEach((h, i) => { if (h) p[i] = ((255 << 24) | (parseInt(h.slice(5, 7), 16) << 16) | (parseInt(h.slice(3, 5), 16) << 8) | parseInt(h.slice(1, 3), 16)) >>> 0; });
    if (cache.size > 64) cache.clear();
    cache.set(key, p);
  }
  return p;
}

/* The studio's palette: used whenever a caller doesn't pass one. */
let active;
export function setActiveCustom(custom){ active = palette32(custom); }

/* Draw through a 1-pixel-per-cell image, then scale it up: fast even at 512×512. */
let scratch;
function frameImage(arr, g, whiteBg, pal){
  if (scratch.width !== g || scratch.height !== g){ scratch.width = g; scratch.height = g; }
  const ctx = scratch.getContext('2d'), img = ctx.createImageData(g, g), u = new Uint32Array(img.data.buffer), n = g * g;
  const empty = whiteBg ? 0xffffffff : 0;
  for (let i = 0; i < n; i++){ const v = arr[i]; u[i] = v ? (pal[v] || empty) : empty; }
  ctx.putImageData(img, 0, 0);
  return scratch;
}

export function drawPixels(ctx, arr, grid, cell, alpha = 1, pal = active){
  ctx.globalAlpha = alpha; ctx.imageSmoothingEnabled = false;
  ctx.drawImage(frameImage(arr, grid, false, pal), 0, 0, grid * cell, grid * cell);
  ctx.globalAlpha = 1;
}

export function paintFrame(cv, arr, grid, px, pal = active){
  const size = grid * px;
  if (cv.width !== size){ cv.width = size; cv.height = size; }
  const ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.drawImage(frameImage(arr, grid, true, pal), 0, 0, size, size);
}

/* Big art is shown in cards at 128×128 so the thumbnails stay light. */
export function thumbFrames(frames, g){
  if (g <= 128) return {frames, grid: g};
  const s = g / 128;
  return {grid: 128, frames: frames.map(f => { const o = new Uint8Array(128 * 128); for (let y = 0; y < 128; y++){ const row = Math.floor(y * s) * g; for (let x = 0; x < 128; x++) o[y * 128 + x] = f[row + Math.floor(x * s)]; } return o; })};
}

/** Runs once at start-up. */
export function init(){
  scratch = document.createElement('canvas');
  active = palette32([]);
}
