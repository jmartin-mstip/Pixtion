/* PIXTION · core/frames.js — pure frame helpers: blank frames, grid sizes, resize, flip/move, playback order. */

export const SIZES = [8, 12, 16, 20, 24, 32, 48, 64, 128, 256, 512];

export function validGrid(g) { return Number.isInteger(g) && g >= 4 && g <= 512; }

export function seqOf(n, pp) { const a = [...Array(n).keys()]; return pp && n > 2 ? a.concat(a.slice(1, -1).reverse()) : a; }

export function blank(g) { return new Uint8Array(g * g); }

export function transform(f, op, g){
  const o = blank(g);
  for (let y = 0; y < g; y++) for (let x = 0; x < g; x++){
    let sx = x, sy = y;
    if (op === 'fliph') sx = g - 1 - x;
    if (op === 'flipv') sy = g - 1 - y;
    if (op === 'up') sy = (y + 1) % g;
    if (op === 'down') sy = (y - 1 + g) % g;
    if (op === 'left') sx = (x + 1) % g;
    if (op === 'right') sx = (x - 1 + g) % g;
    o[y * g + x] = f[sy * g + sx];
  }
  return o;
}

export function resize(frame, from, to){
  const out = blank(to), off = Math.floor((to - from) / 2);
  for (let y = 0; y < from; y++) for (let x = 0; x < from; x++){
    const nx = x + off, ny = y + off; if (nx >= 0 && ny >= 0 && nx < to && ny < to) out[ny * to + nx] = frame[y * from + x];
  }
  return out;
}
