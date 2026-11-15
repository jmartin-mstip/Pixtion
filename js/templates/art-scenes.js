/* PIXTION · templates/art-scenes.js — template art for scenes (20×20 to 64×64). */
import { TAU, U8, animFrames, bands, bg, box, disc, dot, ell, rng, seg, stamp } from './draw.js';

export function landscape(){
  const g = 20, a = new Array(g * g).fill(0);
  for (let y = 0; y < g; y++) for (let x = 0; x < g; x++){
    let v = y < 6 ? 19 : 20;
    const dx = x + .5 - 15, dy = y + .5 - 4.5, d = dx * dx + dy * dy;
    if (d <= 7.3) v = d > 4 ? 9 : 10;
    const hill = 12 + Math.round(2.2 * Math.sin(x / 3.1));
    if (y >= hill) v = 12;
    if (y >= 15) v = 13;
    if (y >= 18) v = 14;
    a[y * g + x] = v;
  }
  [[3, 3], [4, 3], [5, 3], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4]].forEach(([x, y]) => a[y * g + x] = 29);
  for (let y = 15; y < g; y++){ const x = 9 + Math.floor((y - 15) / 2); a[y * g + x] = 28; a[y * g + x + 1] = 28; }
  return a;
}

export function fireFrame(f){
  const g = 24, a = new Array(g * g).fill(22), r = rng(7);
  for (let i = 0; i < 16; i++){ const x = Math.floor(r() * g), y = Math.floor(r() * 15); a[y * g + x] = (i + f) % 5 ? 20 : 29; }
  const hs = [5, 8, 6, 10, 7, 4, 9, 6], w = rng(3);
  hs.forEach((h, i) => { box(a, g, i * 3, g - h, 3, h, 1); for (let y = g - h + 1; y < g - 1; y += 2) if (w() < .45) a[y * g + i * 3 + 1] = 11; });
  const cx = 12, cy = 8;
  if (f < 3){ const y = 20 - f * 5; dot(a, g, cx, y, 29); dot(a, g, cx, y + 1, 10); dot(a, g, cx, y + 2, 8); }
  else {
    const R = [0, 0, 0, 2, 4, 6, 7, 8][f], cs = [6, 10, 7, 15];
    for (let k = 0; k < 12; k++){ const an = k * Math.PI / 6; [R, R - 1.6].forEach(rr => { if (rr >= 1) dot(a, g, cx + rr * Math.cos(an), cy + rr * Math.sin(an), f === 7 ? 3 : cs[k % 4]); }); }
    if (f === 3) dot(a, g, cx, cy, 29);
  }
  return a;
}

export function cityFrame(f){
  const g = 48, a = bg(g, (x, y) => y < 14 ? 22 : y < 26 ? 23 : 18), r = rng(21);
  for (let i = 0; i < 40; i++){ const x = Math.floor(r() * g), y = Math.floor(r() * 24); a[y * g + x] = (i + f) % 6 ? 20 : 29; }
  for (let y = 0; y < g; y++) for (let x = 0; x < g; x++){ const dx = x + .5 - 38, dy = y + .5 - 8; if (dx * dx + dy * dy <= 16) a[y * g + x] = 11; }
  let x = 0; const b = rng(4);
  while (x < g){
    const w = 4 + Math.floor(b() * 5), h = 12 + Math.floor(b() * 22), col = b() < .5 ? 1 : 2;
    box(a, g, x, g - h, w, h, col);
    for (let yy = g - h + 2; yy < g - 2; yy += 3) for (let xx = x + 1; xx < x + w - 1; xx += 2){ const hsh = (xx * 7 + yy * 13) % 9; a[yy * g + xx] = (hsh + f * 2) % 9 < 4 ? 11 : 3; }
    x += w + (b() < .3 ? 1 : 0);
  }
  box(a, g, 0, g - 2, g, 2, 2);
  return a;
}

export function nightSky(){
  const g = 24, a = bg(g, (x, y) => { const hill = 17 + Math.round(2.6 * Math.sin(x / 3.3) + 1.2 * Math.sin(x / 1.7)); return y >= 21 ? 14 : y >= hill ? 1 : y < 10 ? 22 : 18; });
  for (let y = 0; y < g; y++) for (let x = 0; x < g; x++){
    const d1 = (x + .5 - 17.5) ** 2 + (y + .5 - 5.5) ** 2, d2 = (x + .5 - 18.9) ** 2 + (y + .5 - 4.6) ** 2;
    if (d1 <= 9 && d2 > 6.8) a[y * g + x] = 11;
  }
  const r = rng(9);
  for (let i = 0; i < 22; i++){ const x = Math.floor(r() * g), y = Math.floor(r() * 15); if (a[y * g + x] === 22 || a[y * g + x] === 18) a[y * g + x] = i % 3 ? 20 : 29; }
  return a;
}

export function oceanFloor(){
  const g = 20, a = bg(g, (x, y) => y >= 16 ? ((x * 3 + y) % 7 ? 28 : 27) : y < 8 ? 19 : 18);
  [[2, 16, 3], [15, 15, 4]].forEach(([x, y, w]) => box(a, g, x, y, w, 2, 3));
  for (let y = 9; y < 16; y++) dot(a, g, 6 + Math.round(Math.sin(y) * .8), y, 13);
  [[11, 15], [11, 14], [10, 13], [12, 13], [10, 12], [12, 11], [9, 11]].forEach(([x, y]) => dot(a, g, x, y, 7));
  [[16, 13], [15, 14], [17, 14], [16, 14], [16, 15]].forEach(([x, y]) => dot(a, g, x, y, 8));
  [[4, 3], [5, 5], [4, 7]].forEach(([x, y]) => dot(a, g, x, y, 20));
  return a;
}

export function beachSunset(){
  const g = 24, bands = [22, 22, 22, 23, 23, 23, 25, 25, 25, 9, 9, 9];
  const a = bg(g, (x, y) => y >= 19 ? 28 : y >= 12 ? 18 : bands[y]);
  for (let y = 0; y < 12; y++) for (let x = 0; x < g; x++){ const d = (x + .5 - 12) ** 2 + (y + .5 - 12) ** 2; if (d <= 20) a[y * g + x] = 10; }
  for (let y = 12; y < 19; y++){ const w = Math.max(1, 5 - (y - 12)); for (let x = 12 - w; x < 12 + w; x++) if ((x + y) % 2) a[y * g + x] = 10; }
  [[4, 4], [5, 3], [6, 4], [16, 6], [17, 5], [18, 6]].forEach(([x, y]) => dot(a, g, x, y, 1));
  return a;
}

export function platformLevel(){
  const g = 32, a = bg(g, (x, y) => y >= 27 ? ((x + y) % 5 ? 26 : 27) : y === 26 ? 13 : 19);
  [[5, 5], [21, 3]].forEach(([cx, cy]) => { for (let y = 0; y < g; y++) for (let x = 0; x < g; x++){ const d1 = (x + .5 - cx) ** 2 / 9 + (y + .5 - cy) ** 2 / 2.2, d2 = (x + .5 - cx - 3) ** 2 / 6 + (y + .5 - cy + .8) ** 2 / 2; if (d1 <= 1 || d2 <= 1) a[y * g + x] = 29; } });
  for (let x = 10; x < 20; x++) for (let y = 17; y < 19; y++) a[y * g + x] = ((x + (y % 2) * 2) % 4 === 0) ? 26 : 8;
  box(a, g, 14, 12, 2, 2, 10); dot(a, g, 14, 12, 27);
  [[11, 15], [13, 15], [17, 15]].forEach(([x, y]) => { dot(a, g, x, y, 10); dot(a, g, x, y - 1, 10); });
  box(a, g, 24, 20, 5, 6, 13); box(a, g, 23, 19, 7, 2, 13);
  for (let y = 19; y < 26; y++){ dot(a, g, 23 + (y > 20 ? 1 : 0), y, 14); dot(a, g, 29 - (y > 20 ? 1 : 0), y, 14); }
  stamp(a, g, ['.kk.', 'kaak', '.dd.', 'kddk', '.xx.', '.k.k'], 5, 20);
  return a;
}

export function mountains(){
  const g = 64, bands = [21, 21, 21, 24, 24, 24, 25, 25, 9, 9];
  const a = bg(g, (x, y) => bands[Math.min(9, Math.floor(y / 4))] || 9);
  for (let y = 0; y < g; y++) for (let x = 0; x < g; x++){
    const sun = (x + .5 - 44) ** 2 + (y + .5 - 30) ** 2;
    if (sun <= 49) a[y * g + x] = sun > 30 ? 11 : 10;
    const far = 30 + 6 * Math.sin(x / 7) + 3 * Math.sin(x / 3.1);
    const mid = 38 + 8 * Math.abs(Math.sin(x / 9 + 1)) * -1 + 4 * Math.sin(x / 4.3) + 6;
    const near = 50 + 3 * Math.sin(x / 5 + 2);
    if (y >= far) a[y * g + x] = 24;
    if (y >= mid) a[y * g + x] = y < mid + 2.5 ? 29 : 22;
    if (y >= near) a[y * g + x] = 14;
    if (y >= 58) a[y * g + x] = 13;
  }
  for (let tx = 3; tx < g; tx += 7){ const h = 5 + (tx % 3); for (let i = 0; i < h; i++){ const half = Math.floor(i / 2); box(a, g, tx - half, 57 - h + i, half * 2 + 1, 1, 14); } }
  return a;
}

export function castleArt(){
  const g = 32, a = bg(g, (x, y) => y >= 28 ? 13 : 19);
  [[4, 8], [22, 26]].forEach(([cx, cy]) => { for (let y = 0; y < g; y++) for (let x = 0; x < g; x++) if (ell(x, y, cx + 2, 5, 3.5, 1.6) || ell(x, y, cy - 4, 3, 3, 1.4)) a[y * g + x] = 29; });
  const wall = (x, y) => (x >= 8 && x <= 23 && y >= 13 && y <= 27) || ((x >= 3 && x <= 8 || x >= 23 && x <= 28) && y >= 8 && y <= 27) || ((x >= 3 && x <= 28) && y >= 8 && y <= 27 && false);
  const crenel = (x, y) => (y === 12 && x >= 8 && x <= 23 && x % 2 === 0) || (y === 7 && ((x >= 3 && x <= 8) || (x >= 23 && x <= 28)) && x % 2 === 1);
  const solid = (x, y) => wall(x, y) || crenel(x, y);
  for (let y = 0; y < g; y++) for (let x = 0; x < g; x++){ if (!solid(x, y)) continue; const edge = !solid(x - 1, y) || !solid(x + 1, y) || !solid(x, y - 1) || !solid(x, y + 1); a[y * g + x] = edge ? 1 : ((x * 5 + y * 3) % 11 === 0 ? 3 : 4); }
  for (let y = 20; y <= 27; y++) for (let x = 13; x <= 18; x++){ if (y > 21 || ell(x, y, 16, 22, 3, 3)) a[y * g + x] = x === 13 || x === 18 ? 1 : 26; }
  [[5, 13], [25, 13], [5, 19], [25, 19], [11, 16], [20, 16]].forEach(([x, y]) => { dot(a, g, x, y, 1); dot(a, g, x, y + 1, 1); });
  [5, 25].forEach(px => { for (let y = 2; y < 7; y++) dot(a, g, px, y, 1); box(a, g, px + 1, 2, 3, 2, 6); });
  return a;
}

export function cubeFrames(){
  const g = 64, r = rng(5), base = bands(g, [42, 22, 22, 23], 16);
  for (let i = 0; i < 50; i++) dot(base, g, r() * g, r() * 40, i % 3 ? 20 : 29);
  for (let y = 52; y < 60; y++) for (let x = 14; x < 50; x++) if (ell(x, y, 32, 56, 15, 2.6)) base[y * g + x] = 47;
  const V = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]], E = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  return animFrames(12, base, (a, f) => {
    const ay = f / 12 * Math.PI / 2, tx = .55;
    const P = V.map(([x, y, z]) => { const X = x * Math.cos(ay) - z * Math.sin(ay), Z = x * Math.sin(ay) + z * Math.cos(ay); const Y2 = y * Math.cos(tx) - Z * Math.sin(tx), Z2 = y * Math.sin(tx) + Z * Math.cos(tx), s = 62 / (Z2 + 4.6); return [32 + X * s, 29 + Y2 * s]; });
    E.forEach(([i, j]) => seg(a, g, P[i][0], P[i][1], P[j][0], P[j][1], 38, 2));
    P.forEach(([x, y]) => disc(a, g, x, y, 1.6, 29));
  });
}

export function rainbowFrames(){
  const g = 64, base = U8(g, 19);
  [[12, 50, 7, 3], [50, 54, 8, 3], [34, 8, 6, 2.4]].forEach(([cx, cy, rx, ry]) => { for (let y = 0; y < g; y++) for (let x = 0; x < g; x++) if (ell(x, y, cx, cy, rx, ry) || ell(x, y, cx + rx * .6, cy - ry * .6, rx * .7, ry)) base[y * g + x] = 29; });
  return animFrames(8, base, (a, f) => {
    const cols = [6, 8, 10, 13, 18, 23];
    for (let x = 0; x < g; x++) cols.forEach((c, i) => { const y = 18 + i * 3 + Math.round(7 * Math.sin(x / 64 * TAU * 1.5 - f / 8 * TAU)); box(a, g, x, y, 1, 3, c); });
    for (let k = 0; k < 5; k++){ const x = (k * 13 + f * 8) % g, y = 12 + ((k * 7) % 30); dot(a, g, x, y, 29); }
  });
}

export function codeRainFrames(){
  const g = 64, base = U8(g, 47), r = rng(8), cols = [...Array(16)].map((_, i) => [i * 4 + 1, Math.floor(r() * 64), 10 + Math.floor(r() * 22)]);
  const glyph = (cx, cy) => ((cx * 73856093) ^ (cy * 19349663)) >>> 0;
  return animFrames(8, base, (a, f) => {
    cols.forEach(([x, y0, len]) => {
      const head = (y0 + f * 8) % 64;
      for (let i = 0; i < len; i++){
        const y = head - i; if (y < 0) continue;
        const h = glyph(x, Math.floor(y / 3) + (i < 3 ? f : 0));
        const col = i === 0 ? 29 : i < 3 ? 35 : i < len * .6 ? 13 : 14;
        for (let q = 0; q < 3; q++) if ((h >> (q + (y % 3) * 3)) & 1) dot(a, g, x + q - 1, y, col);
      }
    });
  });
}

export function parallaxFrames(){
  const g = 64, base = bands(g, [19, 19, 20, 20], 12);
  disc(base, g, 50, 12, 6, 10);
  return animFrames(16, base, (a, f) => {
    for (let k = 0; k < 3; k++){ const cx = ((k * 22 + 64 - f * 4) % 64 + 64) % 64; for (let dx = -8; dx <= 10; dx++) for (let y = 4; y < 16; y++){ const x = (cx + dx + 64) % 64; if (ell(dx + 8, y, 8, 9 + k % 2 * 2, 7, 2.6) || ell(dx + 8, y, 11, 7 + k % 2 * 2, 4.5, 2.4)) a[y * g + x] = 29; } }
    for (let x = 0; x < g; x++){
      const xs1 = (x + f * 4) % 64, h1 = 34 + Math.round(5 * Math.sin(xs1 / 64 * TAU * 2) + 3 * Math.sin(xs1 / 64 * TAU * 5));
      for (let y = h1; y < g; y++) a[y * g + x] = 24;
      const xs2 = (x + f * 8) % 64, h2 = 44 + Math.round(4 * Math.sin(xs2 / 64 * TAU * 3 + 1));
      for (let y = h2; y < g; y++) a[y * g + x] = 12;
      if (xs2 % 16 === 5){ for (let i = 0; i < 9; i++){ const half = Math.floor(i / 2); box(a, g, x - half, h2 - 10 + i, half * 2 + 1, 1, 14); } box(a, g, x, h2 - 1, 1, 2, 26); }
      const xs3 = (x + f * 16) % 64;
      for (let y = 54; y < g; y++) a[y * g + x] = y === 54 ? 13 : (xs3 + y) % 8 === 0 ? 27 : 26;
      if (xs3 % 8 === 2) dot(a, g, x, 53, 13);
    }
  });
}
