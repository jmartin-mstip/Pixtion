/* PIXTION · templates/art-big.js — template art for big grids (128×128 to 512×512). */
import { TAU, U8, animFrames, bands, bg, box, disc, dot, drawFish, ell, pine, rng, seg } from './draw.js';

export function warpFrame(f){
  const g = 128, a = new Array(g * g).fill(47), r = rng(31);
  for (let i = 0; i < 220; i++){
    const an = r() * Math.PI * 2, d0 = r() * 64, sp = 3 + r() * 5, col = [29, 20, 37, 44][i % 4];
    const d = (d0 + f * sp) % 64, len = 1 + d / 9;
    for (let t = 0; t < len; t++) dot(a, g, 64 + (d + t) * Math.cos(an), 64 + (d + t) * Math.sin(an), t < 1 ? 29 : col);
  }
  for (let y = 60; y < 68; y++) for (let x = 60; x < 68; x++) if (ell(x, y, 64, 64, 3, 3)) a[y * g + x] = 20;
  return a;
}

export function auroraFrame(f){
  const g = 256, r = rng(17);
  const a = bg(g, (x, y) => y < 90 ? 42 : y < 170 ? 22 : 18);
  for (let i = 0; i < 260; i++){ const x = Math.floor(r() * g), y = Math.floor(r() * 180); a[y * g + x] = (i + f) % 5 ? 20 : 29; }
  for (let x = 0; x < g; x++){
    const c = 70 + 22 * Math.sin(x / 30 + f * .6) + 9 * Math.sin(x / 11 - f * .4);
    for (let y = Math.max(0, Math.floor(c - 34)); y < Math.min(g, c + 8); y++){
      const d = c - y;
      if (d < 0) a[y * g + x] = 35; else if (d < 8) a[y * g + x] = 15; else if (d < 20 && (x + y + f) % 2) a[y * g + x] = 38; else if (d < 34 && (x + y) % 3 === 0) a[y * g + x] = 21;
    }
  }
  for (let x = 0; x < g; x++){ const m = 190 + Math.round(16 * Math.sin(x / 23) + 9 * Math.sin(x / 9)); for (let y = m; y < g; y++) a[y * g + x] = y > 236 ? 14 : 1; }
  return a;
}

export function galaxy(){
  const g = 128, r = rng(41), a = bg(g, () => 47);
  for (let i = 0; i < 500; i++) dot(a, g, r() * g, r() * g, i % 7 ? 2 : 20);
  for (let arm = 0; arm < 3; arm++) for (let i = 0; i < 900; i++){
    const t = i / 900 * 3.4 * Math.PI, rad = 4 + t * 5.2, an = t + arm * 2 * Math.PI / 3;
    const jx = (r() - .5) * (4 + t * 1.6), jy = (r() - .5) * (4 + t * 1.6);
    dot(a, g, 64 + rad * Math.cos(an) + jx, 64 + rad * Math.sin(an) * .78 + jy, [24, 21, 44, 29, 23][i % 5]);
  }
  for (let y = 0; y < g; y++) for (let x = 0; x < g; x++){ const d = Math.hypot(x + .5 - 64, (y + .5 - 64) / .78); if (d < 5) a[y * g + x] = 29; else if (d < 9) a[y * g + x] = 11; else if (d < 12 && (x + y) % 2) a[y * g + x] = 9; }
  return a;
}

export function valley(){
  const g = 256, r = rng(55), bands = [21, 19, 19, 19, 20, 20];
  const a = bg(g, (x, y) => bands[Math.min(5, Math.floor(y / 22))]);
  for (let y = 0; y < 130; y++) for (let x = 0; x < g; x++) if (ell(x, y, 190, 50, 16, 16)) a[y * g + x] = 10;
  [[40, 30], [120, 18], [210, 90]].forEach(([cx, cy]) => { for (let y = 0; y < g; y++) for (let x = 0; x < g; x++) if (ell(x, y, cx, cy, 22, 6) || ell(x, y, cx + 12, cy - 4, 14, 6)) a[y * g + x] = 29; });
  for (let x = 0; x < g; x++){
    const far = 100 + 22 * Math.sin(x / 31) + 9 * Math.sin(x / 12);
    const mid = 128 + 14 * Math.sin(x / 19 + 2) + 6 * Math.sin(x / 7);
    for (let y = Math.floor(far); y < g; y++) a[y * g + x] = y < far + 6 && Math.sin(x / 31) > .2 ? 29 : 24;
    for (let y = Math.floor(mid); y < g; y++) a[y * g + x] = 22;
    for (let y = 150; y < g; y++) a[y * g + x] = y < 170 ? 12 : y < 196 ? ((x + y) % 9 === 0 ? 20 : 18) : 13;
  }
  for (let y = 170; y < 196; y++) for (let x = 0; x < g; x++){ const m = 196 - (y - 170) * 2; if (ell(x, y, 190, 196 - (50 - 40) , 10, 14) && a[y * g + x] === 18) a[y * g + x] = 9; }
  for (let tx = 6; tx < g; tx += 11 + Math.floor(r() * 8)){ const h = 12 + Math.floor(r() * 10), by = 166 + Math.floor(r() * 4); for (let i = 0; i < h; i++){ const half = Math.floor(i / 2.2); box(a, g, tx - half, by - h + i, half * 2 + 1, 1, 14); } box(a, g, tx, by, 1, 3, 26); }
  for (let i = 0; i < 700; i++){ const x = Math.floor(r() * g), y = 198 + Math.floor(r() * 58); a[y * g + x] = [6, 10, 29, 36, 12][i % 5]; }
  return a;
}

export function megaMountains(){
  const g = 512, bands = [21, 21, 24, 24, 25, 25, 45, 9, 9, 46];
  const a = bg(g, (x, y) => bands[Math.min(9, Math.floor(y / 26))]);
  for (let y = 0; y < 300; y++) for (let x = 0; x < g; x++){ const d = Math.hypot(x + .5 - 360, y + .5 - 230); if (d < 40) a[y * g + x] = d < 30 ? 10 : 11; }
  const r = rng(77);
  for (let i = 0; i < 6; i++){ const cx = r() * g, cy = 30 + r() * 120; for (let y = Math.floor(cy - 10); y < cy + 10; y++) for (let x = Math.floor(cx - 50); x < cx + 50; x++) if (x >= 0 && x < g && y >= 0 && ell(x, y, cx, cy, 46, 7)) a[y * g + x] = 44; }
  for (let x = 0; x < g; x++){
    const L = [
      [230 + 40 * Math.sin(x / 70) + 18 * Math.sin(x / 23) + 6 * Math.sin(x / 7), 24, 0],
      [290 + 55 * Math.abs(Math.sin(x / 95 + 1)) * -1 + 20 * Math.sin(x / 31) + 8 * Math.sin(x / 9) + 40, 21, 14],
      [330 + 35 * Math.sin(x / 50 + 2) + 10 * Math.sin(x / 13), 22, 10],
      [395 + 16 * Math.sin(x / 40 + 4) + 5 * Math.sin(x / 11), 14, 0]
    ];
    L.forEach(([top, col, snow]) => { for (let y = Math.max(0, Math.floor(top)); y < g; y++) a[y * g + x] = snow && y < top + snow ? 29 : col; });
    for (let y = 440; y < g; y++) a[y * g + x] = y < 470 ? ((x * 3 + y) % 11 === 0 ? 20 : 18) : 13;
  }
  for (let tx = 4; tx < g; tx += 9 + Math.floor(r() * 9)){ const h = 18 + Math.floor(r() * 16), by = 436 + Math.floor(r() * 6); for (let i = 0; i < h; i++){ const half = Math.floor(i / 2.4); box(a, g, tx - half, by - h + i, half * 2 + 1, 1, 14); } box(a, g, tx, by, 2, 4, 26); }
  for (let i = 0; i < 2600; i++){ const x = Math.floor(r() * g), y = 472 + Math.floor(r() * 40); a[y * g + x] = [12, 14, 10, 29, 6][i % 5]; }
  return a;
}

export function earthFrames(){
  const g = 128, base = U8(g, 47), r = rng(61);
  for (let i = 0; i < 180; i++) dot(base, g, r() * g, r() * g, i % 5 ? 2 : 29);
  const land = (lon, lat) => Math.sin(lon * 2 + 1) * Math.cos(lat * 3) + .6 * Math.sin(lon * 5 + lat * 4) + .35 * Math.sin(lon * 11 - lat * 7) > .45;
  const cloud = (lon, lat) => Math.sin(lon * 4 + lat * 6) * Math.sin(lat * 9 + 1) > .62;
  return animFrames(12, base, (a, f) => {
    const rot = f * Math.PI / 6, R = 54;
    for (let y = 8; y < 120; y++) for (let x = 8; x < 120; x++){
      const nx = (x + .5 - 64) / R, ny = (y + .5 - 64) / R, d = nx * nx + ny * ny;
      if (d > 1){ if (d < 1.06) a[y * g + x] = 20; continue; }
      const nz = Math.sqrt(1 - d), lat = Math.asin(ny), lon = Math.atan2(nx, nz) + rot, light = -nx * .6 - ny * .4 + nz * .7;
      let v = Math.abs(lat) > 1.2 ? 29 : land(lon, lat) ? (light > .35 ? 12 : 13) : (light > .35 ? 19 : 18);
      if (cloud(lon + rot, lat)) v = 29;
      if (light < -.05) v = v === 29 ? 4 : (v === 12 || v === 13) ? 14 : 42;
      a[y * g + x] = v;
    }
  });
}

export function rainyCityFrames(){
  const g = 128, r = rng(81), base = bg(g, (x, y) => y < 40 ? 2 : y < 100 ? 3 : y < 104 ? 4 : 2);
  let x = 0;
  while (x < g){
    const w = 10 + Math.floor(r() * 16), h = 40 + Math.floor(r() * 50), col = r() < .5 ? 1 : 42;
    box(base, g, x, 100 - h, w, h, col);
    for (let yy = 100 - h + 4; yy < 96; yy += 6) for (let xx = x + 2; xx < x + w - 2; xx += 4) if (r() < .45) box(base, g, xx, yy, 2, 3, r() < .7 ? 11 : 10);
    x += w + 1 + Math.floor(r() * 3);
  }
  for (let y = 104; y < g; y++) for (let xx = 0; xx < g; xx++){ const src = base[(203 - y) * g + xx]; if ((src === 11 || src === 10) && (xx + y) % 2) base[y * g + xx] = 10; }
  box(base, g, 30, 58, 2, 46, 1); box(base, g, 26, 56, 10, 3, 1); box(base, g, 27, 59, 8, 2, 11);
  for (let y = 61; y < 100; y++){ const w = (y - 61) * .35; for (let xx = Math.round(31 - w); xx <= Math.round(31 + w); xx++) if ((xx + y) % 3 === 0 && base[y * g + xx] !== 1) dot(base, g, xx, y, 46); }
  const drops = [...Array(150)].map(() => [r() * 150, r() * g]), rip = [...Array(10)].map((_, k) => [r() * g, 108 + r() * 18, k]);
  return animFrames(8, base, (a, f) => {
    rip.forEach(([cx, cy, k]) => { const rr = ((f + k) % 8) * .9 + .5; for (let t = 0; t < 24; t++){ const an = t / 24 * Math.PI * 2; dot(a, g, cx + rr * 2 * Math.cos(an), cy + rr * .5 * Math.sin(an), 4); } });
    drops.forEach(([x0, y0]) => { const y = (y0 + f * 16) % g, xx = x0 - y * .3; seg(a, g, xx, y, xx - 1.5, y + 5, 44); });
  });
}

export function aquariumFrames(){
  const g = 128, r = rng(71), base = bg(g, (x, y) => y >= 112 ? ((x * 7 + y * 3) % 17 ? 28 : 27) : y < 40 ? 19 : y < 85 ? 18 : 42);
  for (let k = 0; k < 5; k++) for (let y = 0; y < 90; y++){ const x0 = 10 + k * 28 + y * .45; for (let xx = Math.floor(x0); xx < x0 + 5; xx++) if ((xx + y) % 2 && base[y * g + xx] !== 28) dot(base, g, xx, y, 20); }
  [[20, 112, 14, 8], [90, 110, 18, 10], [62, 114, 10, 6]].forEach(([cx, cy, rx, ry]) => { for (let y = cy - ry; y < 112 + 6; y++) for (let xx = cx - rx; xx < cx + rx; xx++) if (ell(xx, y, cx, cy, rx, ry)) dot(base, g, xx, y, (xx + y) % 5 ? 3 : 4); });
  [[44, 112], [104, 110]].forEach(([cx, by]) => { for (let b = -2; b <= 2; b++) seg(base, g, cx, by, cx + b * 6, by - 20 - Math.abs(b) * -2, b % 2 ? 7 : 25, 3); });
  const fish = [...Array(9)].map((_, k) => [r() * 148, 20 + r() * 80, 2.5 + r() * 2.5, [[8, 9], [10, 11], [36, 25], [16, 17], [6, 7]][k % 5], r() < .5 ? 1 : 2]);
  const bubbles = [...Array(20)].map(() => [r() * g, r() * g]);
  const weeds = [[8, 60], [56, 45], [118, 70], [76, 35]];
  return animFrames(16, base, (a, f) => {
    weeds.forEach(([wx, h], k) => { for (let y = 0; y < h; y++){ const xx = wx + Math.sin((y / 9) + (f / 16) * Math.PI * 2 + k) * (y / 12); disc(a, g, xx, 116 - y, 1.6, y % 10 < 5 ? 13 : 12); } });
    fish.forEach(([x0, y0, s, [b, fin], sp]) => { const xx = (x0 + f * 9.25 * sp) % 148 - 10; drawFish(a, g, xx, y0 + Math.sin((f / 16) * Math.PI * 2 + x0) * 2, s, b, fin); });
    bubbles.forEach(([x0, y0], k) => { const y = ((y0 - f * 8) % g + g) % g; if (y < 110){ dot(a, g, x0 + Math.sin(y / 8) * 2, y, 29); if (k % 3 === 0) dot(a, g, x0 + Math.sin(y / 8) * 2 + 1, y, 20); } });
  });
}

export function volcanoFrames(){
  const g = 128, r = rng(91), base = bg(g, (x, y) => y < 30 ? 22 : y < 60 ? 23 : y < 95 ? 39 : 1);
  for (let i = 0; i < 60; i++){ const xx = Math.floor(r() * g), y = Math.floor(r() * 40); base[y * g + xx] = 20; }
  for (let y = 40; y < 112; y++){ const half = 8 + (y - 40) * .95; for (let xx = Math.floor(64 - half); xx <= 64 + half; xx++) dot(base, g, xx, y, (xx * 3 + y * 5) % 13 === 0 ? 33 : (xx < 64 - half * .3 ? 1 : 34)); }
  box(base, g, 0, 112, g, 16, 1);
  [[60, -.45], [68, .5], [64, -.1]].forEach(([sx, dx]) => { for (let y = 42; y < 112; y++){ const xx = sx + dx * (y - 42) + Math.sin(y / 5) * 2; dot(base, g, xx, y, 8); dot(base, g, xx + 1, y, y % 3 ? 6 : 10); } });
  box(base, g, 57, 40, 15, 3, 10);
  const parts = [...Array(36)].map((_, k) => [(r() - .5) * 1.6, .8 + r() * .7, k * .37, [10, 8, 6, 11][k % 4]]);
  return animFrames(8, base, (a, f) => {
    for (let k = 0; k < 6; k++){ const t = ((f + k * 1.33) % 8) / 8; disc(a, g, 64 + Math.sin(k * 2 + t * 3) * 10 + (k - 3) * 3, 34 - t * 32, 4 + t * 5, t > .6 ? 3 : 4); }
    parts.forEach(([vx, vy, ph, c]) => { const t = (f / 8 + ph) % 1, xx = 64 + vx * t * 50, y = 40 - vy * t * 70 + 75 * t * t; if (y < 112) disc(a, g, xx, y, t < .3 ? 1.6 : 1, c); });
  });
}

export function sunsetSeaFrames(){
  const g = 256, base = bands(g, [22, 23, 23, 43, 25, 25, 7, 7, 9, 10], 14);
  disc(base, g, 128, 140, 36, 10); disc(base, g, 128, 140, 26, 11);
  for (let y = 120; y < 140; y += 5) box(base, g, 90, y, 76, 2, 9);
  box(base, g, 0, 140, g, 86, 42);
  for (let y = 226; y < g; y++) for (let x = 0; x < g; x++) base[y * g + x] = (x * 5 + y * 3) % 23 ? 28 : 27;
  for (let y = 150; y < 226; y++){ const t = (y - 150) / 76; seg(base, g, 22 + Math.sin(t * 3) * 6, y, 22 + Math.sin(t * 3) * 6, y, 34, 4); }
  for (let k = 0; k < 7; k++){ const an = -Math.PI + k * Math.PI / 6 + .2; for (let t = 0; t < 34; t++) disc(base, g, 26 + Math.cos(an) * t, 148 + Math.sin(an) * t * .6 + t * t * .012, 2.2 - t / 30, 1); }
  [[60, 40], [72, 34], [200, 60], [212, 54]].forEach(([x, y], i) => { seg(base, g, x, y, x + 5, y - 3, 1); seg(base, g, x + 5, y - 3, x + 10, y, 1); });
  return animFrames(6, base, (a, f) => {
    for (let row = 144; row < 226; row += 6){ const near = row > 185; for (let x = 0; x < g; x++) if (((x + f * (near ? 12 : 6) + row * 3) % 36) < (near ? 14 : 8)) a[row * g + x] = near ? 18 : 3; }
    for (let y = 142; y < 224; y++){ const w = 30 - (y - 142) * .3; for (let x = Math.round(128 - w); x < 128 + w; x++) if ((x + y * 3 + f * 5) % 7 < 2) a[y * g + x] = y < 180 ? 11 : 10; }
    const by = 176 + Math.round(Math.sin(f / 6 * Math.PI * 2) * 2);
    for (let i = 0; i < 6; i++) box(a, g, 176 + i, by + i, 30 - i * 2, 1, 1);
    for (let i = 0; i < 18; i++) box(a, g, 190 - Math.floor(i * .5), by - 18 + i, Math.floor(i * .5) + 1, 1, 29);
    box(a, g, 190, by - 20, 1, 20, 1);
    const shore = 226 + Math.round(Math.sin(f / 6 * Math.PI * 2) * 3);
    for (let x = 0; x < g; x++){ dot(a, g, x, shore + Math.round(Math.sin(x / 9) * 1.5), 29); if ((x + f * 3) % 4 === 0) dot(a, g, x, shore + 2, 20); }
  });
}

export function snowForestFrames(){
  const g = 256, r = rng(101), base = bands(g, [42, 42, 22, 22, 18, 18, 18], 25);
  disc(base, g, 196, 52, 20, 11); disc(base, g, 190, 46, 5, 28);
  for (let i = 0; i < 140; i++){ const x = Math.floor(r() * g), y = Math.floor(r() * 140); if (base[y * g + x] !== 11) base[y * g + x] = i % 4 ? 20 : 29; }
  for (let x = 0; x < g; x++){ const h = 150 + Math.round(10 * Math.sin(x / 25) + 5 * Math.sin(x / 9)); for (let y = h; y < g; y++) base[y * g + x] = 44; }
  for (let tx = 4; tx < g; tx += 10 + Math.floor(r() * 8)) pine(base, g, tx, 168 + Math.floor(r() * 6), 30 + Math.floor(r() * 20), 22, false);
  for (let y = 190; y < g; y++) for (let x = 0; x < g; x++) base[y * g + x] = (x + y * 2) % 29 === 0 ? 44 : 29;
  for (let tx = 10; tx < g; tx += 26 + Math.floor(r() * 18)) if (tx < 50 || tx > 110) pine(base, g, tx, 196 + Math.floor(r() * 30), 60 + Math.floor(r() * 40), 14, true);
  box(base, g, 62, 176, 40, 26, 26); for (let i = 0; i < 16; i++) box(base, g, 58 + i, 176 - i, 48 - i * 2, 1, 29);
  box(base, g, 74, 184, 8, 8, 11); box(base, g, 88, 188, 8, 14, 34); box(base, g, 92, 152, 6, 14, 3);
  const flakes = [...Array(380)].map((_, i) => [r() * g, r() * g, i % 3 ? 32 : 64, i % 7 === 0]);
  return animFrames(8, base, (a, f) => {
    for (let k = 0; k < 4; k++){ const t = ((f + k * 2) % 8) / 8; disc(a, g, 95 + t * 10 + Math.sin(t * 6) * 3, 148 - t * 40, 3 + t * 4, t > .5 ? 44 : 4); }
    flakes.forEach(([x0, y0, sp, big], i) => { const y = (y0 + f * sp) % g, x = x0 + 3 * Math.sin(f / 8 * Math.PI * 2 + i); if (big) disc(a, g, x, y, 1.5, 29); else dot(a, g, x, y, 29); });
  });
}

export function synthFrames(){
  const g = 256, r = rng(111), base = bands(g, [47, 22, 22, 43, 43, 23, 36, 36, 7], 16);
  for (let i = 0; i < 120; i++){ const x = Math.floor(r() * g), y = Math.floor(r() * 70); base[y * g + x] = i % 3 ? 20 : 29; }
  for (let y = 50; y < 128; y++) for (let x = 78; x < 178; x++){
    if (!ell(x, y, 128, 100, 50, 50)) continue;
    const t = (y - 50) / 78; if (y > 96 && (y - 96) % 7 < Math.min(5, 1 + (y - 96) / 8)) continue;
    base[y * g + x] = t < .3 ? 10 : t < .55 ? 9 : t < .8 ? 7 : 36;
  }
  for (let x = 0; x < g; x++){ const m = 128 - Math.abs(Math.round(26 * Math.sin(x / 21) + 12 * Math.sin(x / 7))) * (Math.abs(x - 128) > 40 ? 1 : .2); for (let y = Math.floor(m); y < 128; y++) base[y * g + x] = y < m + 2 ? 37 : 43; }
  box(base, g, 0, 128, g, 128, 47);
  return animFrames(8, base, (a, f) => {
    for (let k = -14; k <= 14; k++) seg(a, g, 128 + k * 4, 128, 128 + k * 44, g, 36);
    for (let n = 1; n < 26; n++){ const d = n - f / 8; if (d <= .25) continue; const y = 128 + 150 / d; if (y < g) box(a, g, 0, Math.round(y), g, d < 2 ? 2 : 1, 36); }
    box(a, g, 0, 127, g, 2, 38);
  });
}

export function nightStarFrames(){
  const g = 512, r = rng(121), base = bands(g, [47, 47, 42, 42, 22, 22, 18], 60);
  const stars = [];
  for (let i = 0; i < 2200; i++){ const x = Math.floor(r() * g), y = Math.floor(r() * 400); base[y * g + x] = i % 6 ? 2 : 20; if (i % 9 === 0) stars.push([x, y]); }
  for (let i = 0; i < 3000; i++){ const t = r(), x = t * g, y = 320 - t * 260 + (r() - .5) * 70; dot(base, g, x, y, [44, 24, 21, 20][i % 4]); }
  for (let y = 0; y < 200; y++) for (let x = 330; x < 470; x++){ const d1 = (x + .5 - 410) ** 2 + (y + .5 - 90) ** 2, d2 = (x + .5 - 428) ** 2 + (y + .5 - 78) ** 2; if (d1 < 1600 && d2 > 1300) base[y * g + x] = 11; }
  for (let x = 0; x < g; x++){ const h1 = 390 + 30 * Math.sin(x / 60) + 12 * Math.sin(x / 17), h2 = 440 + 18 * Math.sin(x / 45 + 2); for (let y = Math.floor(h1); y < g; y++) base[y * g + x] = y >= h2 ? 47 : 1; }
  seg(base, g, 90, 470, 96, 300, 47, 14); [[96, 330, 40, 280], [96, 360, 150, 300], [94, 320, 60, 250]].forEach(([a1, b1, a2, b2]) => seg(base, g, a1, b1, a2, b2, 47, 6));
  [[60, 270, 46], [140, 285, 52], [95, 240, 56], [40, 310, 34], [160, 330, 34]].forEach(([cx, cy, rr]) => disc(base, g, cx, cy, rr, 47));
  return animFrames(8, base, (a, f) => {
    stars.forEach(([x, y], i) => { if ((i + f) % 4 === 0){ dot(a, g, x, y, 29); dot(a, g, x + 1, y, 20); dot(a, g, x - 1, y, 20); dot(a, g, x, y + 1, 20); dot(a, g, x, y - 1, 20); } });
    const t = f / 7, hx = 40 + t * 380, hy = 50 + t * 150;
    for (let k = 0; k < 90; k++){ const x = hx - k * 2.1, y = hy - k * .83; disc(a, g, x, y, Math.max(.6, 3 - k / 30), k < 6 ? 29 : k < 30 ? 20 : 44); }
  });
}

export function lighthouseFrames(){
  const g = 512, r = rng(131), base = bands(g, [47, 42, 42, 22, 22], 64);
  for (let i = 0; i < 900; i++){ const x = Math.floor(r() * g), y = Math.floor(r() * 300); base[y * g + x] = i % 5 ? 20 : 29; }
  disc(base, g, 400, 90, 26, 11);
  box(base, g, 0, 300, g, 212, 18);
  for (let y = 250; y < g; y++){ const edge = 230 - (y - 250) * .25 + Math.sin(y / 11) * 8; for (let x = 0; x < edge; x++) base[y * g + x] = (x * 3 + y * 7) % 19 ? 1 : 2; }
  for (let y = 140; y < 262; y++){ const half = 16 + (y - 140) * .1; for (let x = Math.round(120 - half); x < 120 + half; x++) base[y * g + x] = Math.floor((y - 140) / 20) % 2 ? 29 : 6; }
  box(base, g, 98, 124, 44, 16, 1); box(base, g, 104, 126, 32, 12, 11); for (let i = 0; i < 18; i++) box(base, g, 101 + i, 106 + i, 38 - i * 2, 1, 6); box(base, g, 92, 140, 56, 4, 1);
  return animFrames(8, base, (a, f) => {
    for (let row = 304; row < g; row += 10){ const k = row > 420 ? 16 : 8; for (let x = 0; x < g; x++) if (((x + f * k + row * 5) % 64) < (row > 420 ? 22 : 12)) a[row * g + x] = row > 420 ? 19 : 3; }
    const an = f * Math.PI / 4, c = Math.cos(an), facing = Math.max(0, Math.sin(an));
    const len = 380 * Math.abs(c), dir = c >= 0 ? 1 : -1;
    for (let d = 0; d < len; d += 1) { const half = 3 + d * .12; for (let dy = -half; dy <= half; dy++){ const x = 120 + dir * (20 + d), y = 132 + dy; if ((Math.round(x) + Math.round(y)) % 2 === 0) dot(a, g, x, y, d < len * .5 ? 11 : 46); } }
    disc(a, g, 120, 132, 8 + facing * 16, 11); if (facing > .5) disc(a, g, 120, 132, 6, 29);
    for (let row = 304; row < 420; row += 4){ const w = (1 - (row - 304) / 116) * 30 * (.4 + facing); for (let x = Math.round(120 - w + 60); x < 120 + w + 60; x++) if ((x + row) % 3 === 0) dot(a, g, x, row, 11); }
  });
}

export function blossomFrames(){
  const g = 512, r = rng(141), base = bands(g, [19, 19, 20, 20, 20], 70);
  for (let x = 0; x < g; x++){ const h = 330 + 25 * Math.sin(x / 70) + 10 * Math.sin(x / 23); for (let y = Math.floor(h); y < g; y++) base[y * g + x] = 44; }
  for (let y = 380; y < g; y++) for (let x = 0; x < g; x++) base[y * g + x] = (x * 3 + y * 5) % 37 ? 12 : 13;
  for (let y = 380; y < g; y++){ const c = 330 + (y - 380) * .9, w = 20 + (y - 380) * .45; for (let x = Math.round(c - w); x < c + w; x++) dot(base, g, x, y, (x + y) % 11 ? 28 : 27); }
  seg(base, g, 170, 470, 185, 290, 34, 22);
  [[185, 300, 110, 190], [182, 320, 270, 210], [180, 290, 200, 150], [176, 340, 90, 280], [186, 330, 300, 290]].forEach(([a1, b1, a2, b2]) => seg(base, g, a1, b1, a2, b2, 34, 9));
  const blobs = [];
  for (let i = 0; i < 70; i++){ const an = r() * Math.PI * 2, d = r() * 130; blobs.push([190 + Math.cos(an) * d * 1.3, 220 + Math.sin(an) * d * .75, 14 + r() * 22]); }
  blobs.forEach(([cx, cy, rr], i) => disc(base, g, cx, cy, rr, [45, 25, 45, 7][i % 4]));
  blobs.forEach(([cx, cy, rr], i) => { if (i % 3 === 0) disc(base, g, cx - rr * .3, cy - rr * .3, rr * .35, 29); });
  for (let i = 0; i < 500; i++) dot(base, g, r() * g, 390 + r() * 120, i % 2 ? 45 : 25);
  box(base, g, 360, 400, 70, 6, 26); box(base, g, 366, 406, 4, 16, 26); box(base, g, 420, 406, 4, 16, 26); box(base, g, 360, 384, 70, 5, 26);
  const petals = [...Array(260)].map(() => [r() * g, r() * g, r() < .5 ? 45 : 25]);
  return animFrames(8, base, (a, f) => { petals.forEach(([x0, y0, c], i) => { const y = (y0 + f * 64) % g, x = (x0 + 14 * Math.sin(f / 8 * Math.PI * 2 + i) + f * 4 + g) % g; box(a, g, Math.round(x), Math.round(y), 3, 2, c); }); });
}

export function lavaLampFrames(){
  const g = 512, base = bg(g, (x, y) => (x + y) % 41 === 0 ? 23 : 43);
  const half = y => 76 + (y - 90) * .22;
  for (let y = 90; y < 440; y++){ const h = half(y); for (let x = Math.round(256 - h); x < 256 + h; x++) base[y * g + x] = x < 256 - h + 6 ? 21 : 23; }
  for (let y = 30; y < 90; y++){ const h = 40 + (y - 30) * .6; for (let x = Math.round(256 - h); x < 256 + h; x++) base[y * g + x] = x < 256 - h + 8 ? 4 : 3; }
  for (let y = 440; y < 500; y++){ const h = 150 - (y - 440) * .4; for (let x = Math.round(256 - h); x < 256 + h; x++) base[y * g + x] = x < 256 - h + 10 ? 4 : 3; }
  box(base, g, 120, 500, 272, 8, 2);
  const balls = [[0, 40, 50], [1.6, -30, 42], [3.1, 20, 56], [4.4, -45, 36], [5.5, 35, 32], [2.3, -5, 46]];
  return animFrames(8, base, (a, f) => {
    const P = balls.map(([ph, ox, rr], k) => [256 + ox + Math.sin(ph * 2 + f / 8 * Math.PI * 2) * 12, 265 + Math.sin(ph + f / 8 * Math.PI * 2 * (k % 2 ? 1 : -1)) * 140, rr * rr]);
    for (let y = 92; y < 438; y++){ const h = half(y) - 4; for (let x = Math.round(256 - h); x < 256 + h; x++){
      let s = 0; for (let k = 0; k < P.length; k++){ const dx = x - P[k][0], dy = y - P[k][1]; s += P[k][2] / (dx * dx + dy * dy + 1); }
      if (s > 1.15) a[y * g + x] = s > 2.2 ? 9 : 8; else if (s > .9) a[y * g + x] = 36;
    } }
  });
}

export function tunnelFrames(){
  const g = 128;
  return [...Array(8).keys()].map(f => {
    const a = new Uint8Array(g * g);
    for (let y = 0; y < g; y++) for (let x = 0; x < g; x++){
      const dx = x + .5 - 64, dy = y + .5 - 64, d = Math.hypot(dx, dy);
      if (d < 5){ a[y * g + x] = 47; continue; }
      const depth = 320 / d, ring = Math.floor(depth / 4 + f / 4), sector = Math.floor((Math.atan2(dy, dx) / TAU + .5) * 16);
      const chk = (ring + sector) % 2, far = d < 18;
      a[y * g + x] = chk ? (far ? 22 : ring % 4 < 2 ? 37 : 36) : (far ? 47 : 43);
    }
    return a;
  });
}

export function stormFrames(){
  const g = 128, r = rng(15), base = bands(g, [1, 2, 2, 3], 24);
  for (let k = 0; k < 14; k++){ const cx = r() * g, cy = 6 + r() * 26, rx = 14 + r() * 18; for (let y = 0; y < 50; y++) for (let x = Math.floor(cx - rx); x < cx + rx; x++) if (x >= 0 && x < g && ell(x, y, cx, cy, rx, rx * .45)) base[y * g + x] = k % 3 ? 2 : 3; }
  for (let x = 0; x < g; x++){ const h = 104 + Math.round(6 * Math.sin(x / 13) + 3 * Math.sin(x / 5)); for (let y = h; y < g; y++) base[y * g + x] = 47; }
  [[20, 92, 6], [100, 88, 5]].forEach(([tx, by, h]) => pine(base, g, tx, by + 14, 22, 47, false));
  const drops = [...Array(170)].map(() => [r() * 150, r() * g]);
  const bolt = [[70, 24], [64, 44], [72, 50], [60, 74], [68, 78], [56, 104]];
  return animFrames(8, base, (a, f) => {
    if (f === 3 || f === 4) for (let i = 0; i < 128 * 104; i++) if (a[i] === 2 || a[i] === 3) a[i] = f === 3 ? 4 : 3;
    if (f === 3){ for (let i = 0; i < bolt.length - 1; i++) seg(a, g, bolt[i][0], bolt[i][1], bolt[i + 1][0], bolt[i + 1][1], 29, 3); seg(a, g, 64, 44, 50, 60, 11, 2); seg(a, g, 60, 74, 74, 92, 11, 2); }
    if (f === 4) for (let i = 0; i < bolt.length - 1; i++) seg(a, g, bolt[i][0], bolt[i][1], bolt[i + 1][0], bolt[i + 1][1], 44, 1);
    drops.forEach(([x0, y0]) => { const y = (y0 + f * 16) % g, x = x0 - y * .35; seg(a, g, x, y, x - 2, y + 6, f === 3 ? 29 : 44); });
  });
}

export function balloonFrames(){
  const g = 256, r = rng(25), base = bands(g, [19, 19, 20, 20, 45, 45, 9], 24);
  for (let x = 0; x < g; x++){ const h = 190 + 20 * Math.sin(x / 30) + 8 * Math.sin(x / 11); for (let y = Math.floor(h); y < g; y++) base[y * g + x] = y > 224 ? 13 : 24; }
  for (let y = 224; y < g; y++) for (let x = 0; x < g; x++) base[y * g + x] = (x * 3 + y) % 13 ? 13 : 12;
  disc(base, g, 60, 160, 14, 10);
  const balloons = [[60, 70, 24, [6, 10]], [150, 50, 30, [37, 29]], [210, 110, 18, [35, 8]], [110, 130, 16, [23, 45]], [30, 140, 12, [17, 11]]];
  const clouds = [[20, 40], [90, 20], [160, 70], [230, 30]];
  return animFrames(8, base, (a, f) => {
    clouds.forEach(([x0, y0]) => { const cx = ((x0 + f * 16) % 256 + 256) % 256; for (let dx = -26; dx < 30; dx++) for (let y = y0 - 8; y < y0 + 8; y++){ const x = (Math.round(cx) + dx + 256) % 256; if (ell(dx, y, 0, y0 + 2, 24, 6) || ell(dx, y, 8, y0 - 2, 14, 6)) a[y * g + x] = 29; } });
    balloons.forEach(([bx, by0, R, [c1, c2]], k) => {
      const by = by0 + Math.sin(f / 8 * TAU + k) * 6, cx = bx + Math.sin(f / 8 * TAU + k * 2) * 3;
      for (let y = Math.floor(by - R); y < by + R * 1.2; y++) for (let x = Math.floor(cx - R); x < cx + R; x++){
        const ny = (y + .5 - by) / R, w = ny < 0 ? Math.sqrt(1 - ny * ny) : Math.max(0, 1 - ny * .8);
        const nx = (x + .5 - cx) / R; if (Math.abs(nx) > w || ny > 1.15) continue;
        const stripe = Math.floor((nx / Math.max(.01, w) + 1) * 3) % 2;
        dot(a, g, x, y, Math.abs(nx) > w - 2 / R ? 1 : stripe ? c1 : c2);
      }
      const bt = by + R * 1.35; seg(a, g, cx - R * .25, by + R * 1.1, cx - R * .2, bt, 1); seg(a, g, cx + R * .25, by + R * 1.1, cx + R * .2, bt, 1);
      box(a, g, Math.round(cx - R * .22), Math.round(bt), Math.max(4, Math.round(R * .44)), Math.max(3, Math.round(R * .3)), 26);
    });
  });
}

export function ringedPlanetFrames(){
  const g = 256, r = rng(35), base = U8(g, 47);
  for (let i = 0; i < 500; i++) dot(base, g, r() * g, r() * g, i % 5 ? 2 : (i % 2 ? 20 : 29));
  const ring = (a, front) => { for (let y = 90; y < 166; y++) for (let x = 10; x < 246; x++){ const e = ((x + .5 - 128) / 116) ** 2 + ((y + .5 - 128) / 28) ** 2, e2 = ((x + .5 - 128) / 84) ** 2 + ((y + .5 - 128) / 19) ** 2; if (e <= 1 && e2 > 1 && (front ? y >= 128 : y < 128)) a[y * g + x] = e > .8 ? 27 : e > .55 ? 28 : 5; } };
  return animFrames(12, base, (a, f) => {
    const moons = [[f / 12 * TAU, 118, 34, 8, 4], [f / 12 * TAU * 2 + 1, 96, 22, 5, 44]];
    const drawMoon = ([an, rx, ry, rr, c]) => { disc(a, g, 128 + Math.cos(an) * rx, 128 + Math.sin(an) * ry, rr, c); disc(a, g, 128 + Math.cos(an) * rx + rr * .35, 128 + Math.sin(an) * ry + rr * .2, rr * .55, c === 4 ? 3 : 24); };
    moons.forEach(m => { if (Math.sin(m[0]) < 0) drawMoon(m); });
    ring(a, false);
    for (let y = 72; y < 184; y++) for (let x = 72; x < 184; x++){ const dx = x + .5 - 128, dy = y + .5 - 128, d = dx * dx + dy * dy; if (d > 3025) continue; const band = Math.floor((dy + 55 + Math.sin(dx / 9 + f / 12 * TAU) * 2.5) / 9) % 4; let v = [27, 28, 32, 9][band]; if (dx * .7 + dy * .3 > 20) v = v === 28 ? 27 : v === 9 ? 32 : 33; a[y * g + x] = v; }
    ring(a, true);
    moons.forEach(m => { if (Math.sin(m[0]) >= 0) drawMoon(m); });
  });
}

export function waterfallFrames(){
  const g = 512, r = rng(45), base = bands(g, [19, 19, 20], 40);
  for (let y = 60; y < g; y++){ const l = 196 + Math.sin(y / 23) * 8, rr = 316 + Math.sin(y / 19 + 1) * 8; for (let x = 0; x < g; x++) if (x < l || x > rr) base[y * g + x] = (x * 7 + y * 3) % 23 === 0 ? 3 : ((x >> 3) + (y >> 3)) % 5 === 0 ? 2 : 1; }
  for (let x = 0; x < g; x++){ if (x > 190 && x < 322) continue; const h = 60 + Math.round(8 * Math.sin(x / 17)); for (let y = h - 14; y < h + 6; y++) dot(base, g, x, y, y < h ? 13 : 12); }
  for (let tx = 10; tx < g; tx += 22 + Math.floor(r() * 14)) if (tx < 170 || tx > 342) pine(base, g, tx, 52 + Math.floor(r() * 8), 40 + Math.floor(r() * 24), 14, false);
  box(base, g, 0, 400, g, 112, 18);
  for (let y = 400; y < g; y++) for (let x = 0; x < g; x++) if ((x < 120 || x > 392) && y > 420 + Math.abs(x - 256) * .02) base[y * g + x] = (x + y) % 9 ? 2 : 3;
  const offs = [...Array(g)].map(() => Math.floor(r() * 128));
  const spray = [...Array(220)].map(() => [196 + r() * 120, 370 + r() * 50, r()]);
  return animFrames(8, base, (a, f) => {
    for (let y = 60; y < 402; y++){ const l = Math.ceil(196 + Math.sin(y / 23) * 8), rr = Math.floor(316 + Math.sin(y / 19 + 1) * 8); for (let x = l; x <= rr; x++){ const ph = ((y - f * 64 + offs[x]) % 128 + 128) % 128; a[y * g + x] = ph < 6 ? 29 : ph < 40 ? 20 : ph < 90 ? 19 : 16; } }
    for (let k = 0; k < 6; k++){ const R = ((f + k * 1.33) % 8) * 14 + 10; for (let t = 0; t < 160; t++){ const an = t / 160 * TAU; dot(a, g, 256 + Math.cos(an) * R * 1.8, 430 + Math.sin(an) * R * .3, 19); } }
    spray.forEach(([x, y, ph]) => { const t = (f / 8 + ph) % 1; disc(a, g, x + (x - 256) * t * .3, y - t * 30, 2 - t, t < .5 ? 29 : 20); });
    for (let y = 380; y < 420; y++) for (let x = 170; x < 342; x++) if ((x + y + f) % 3 === 0 && ell(x, y, 256, 402, 86, 22)) a[y * g + x] = 44;
  });
}

export function firefliesFrames(){
  const g = 512, r = rng(55), base = bands(g, [47, 47, 42, 42, 22], 70);
  for (let i = 0; i < 700; i++){ const x = Math.floor(r() * g), y = Math.floor(r() * 260); base[y * g + x] = i % 5 ? 2 : 20; }
  disc(base, g, 380, 90, 30, 11); disc(base, g, 370, 82, 6, 28);
  for (let tx = 0; tx < g; tx += 26 + Math.floor(r() * 14)) pine(base, g, tx, 330 + Math.floor(r() * 20), 120 + Math.floor(r() * 80), 22, false);
  for (let tx = 10; tx < g; tx += 50 + Math.floor(r() * 30)) pine(base, g, tx, 420 + Math.floor(r() * 30), 200 + Math.floor(r() * 90), 47, false);
  for (let y = 430; y < g; y++) for (let x = 0; x < g; x++) base[y * g + x] = (x * 5 + y * 3) % 17 === 0 ? 14 : 47;
  for (let i = 0; i < 400; i++){ const x = r() * g, y = 420 + r() * 20; seg(base, g, x, y, x + (r() - .5) * 6, y - 8 - r() * 10, 14); }
  const flies = [...Array(110)].map(() => [r() * g, 150 + r() * 330, r() * TAU, Math.floor(r() * 8)]);
  return animFrames(8, base, (a, f) => {
    flies.forEach(([x0, y0, ph, k]) => {
      const x = x0 + Math.cos(f / 8 * TAU + ph) * 8, y = y0 + Math.sin(f / 8 * TAU * 2 + ph) * 5, on = (f + k) % 4;
      if (on === 0){ for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) if (dx * dx + dy * dy <= 16 && (Math.round(x) + dx + Math.round(y) + dy) % 2 === 0) dot(a, g, x + dx, y + dy, 41); disc(a, g, x, y, 2, 35); dot(a, g, x, y, 11); }
      else if (on === 1) { disc(a, g, x, y, 1.4, 35); }
      else dot(a, g, x, y, 41);
    });
  });
}

export function koiFrames(){
  const g = 512, r = rng(65), base = U8(g, 28);
  for (let y = 0; y < g; y++) for (let x = 0; x < g; x++){ const e = ((x + .5 - 256) / 236) ** 2 + ((y + .5 - 256) / 236) ** 2; if (e > 1) base[y * g + x] = (x * 3 + y * 7) % 11 ? 13 : 12; else if (e > .86) base[y * g + x] = ((x >> 3) + (y >> 3)) % 3 === 0 ? 4 : ((x >> 3) * 7 + (y >> 3)) % 5 === 0 ? 2 : 3; else base[y * g + x] = e > .5 ? 18 : 16; }
  const pads = [[150, 140, 26], [360, 170, 32], [330, 360, 24], [140, 350, 30], [250, 110, 18]];
  pads.forEach(([cx, cy, rr], i) => { disc(base, g, cx, cy, rr, 13); disc(base, g, cx, cy, rr - 4, 12); for (let t = 0; t < rr; t++) for (let w = -t * .28; w <= t * .28; w++) dot(base, g, cx + t, cy + w, 18); if (i % 2 === 0){ disc(base, g, cx - 4, cy - 4, 8, 45); disc(base, g, cx - 4, cy - 4, 4, 29); dot(base, g, cx - 4, cy - 4, 10); } });
  const koi = [[0, 150, [8, 29]], [Math.PI / 2, 110, [29, 6]], [Math.PI, 170, [10, 8]], [Math.PI * 1.5, 130, [8, 47]]];
  return animFrames(12, base, (a, f) => {
    koi.forEach(([ph, R, [c1, c2]], k) => {
      const an = ph + f / 12 * TAU * (k % 2 ? -1 : 1), dir = k % 2 ? -1 : 1;
      const hx = 256 + Math.cos(an) * R, hy = 256 + Math.sin(an) * R * .9;
      const tdx = -Math.sin(an) * dir, tdy = Math.cos(an) * .9 * dir, tl = Math.hypot(tdx, tdy), ux = tdx / tl, uy = tdy / tl;
      for (let t = 0; t < 46; t++){
        const px = hx - ux * t + Math.sin(t / 8 + f) * (t / 46) * 4 * -uy, py = hy - uy * t + Math.sin(t / 8 + f) * (t / 46) * 4 * ux;
        const w = t < 34 ? 7.5 * Math.sin(Math.PI * Math.min(1, (t + 4) / 38)) : 0;
        if (w > .5){ disc(a, g, px + 4, py + 5, w, 18); }
      }
      for (let t = 0; t < 46; t++){
        const wig = Math.sin(t / 8 + f) * (t / 46) * 4;
        const px = hx - ux * t - uy * wig, py = hy - uy * t + ux * wig;
        if (t < 34){ const w = 7.5 * Math.sin(Math.PI * Math.min(1, (t + 4) / 38)); disc(a, g, px, py, w, (Math.floor(t / 7) + k) % 3 === 0 ? c2 : c1); }
        else { const spread = (t - 34) * .9; disc(a, g, px - uy * spread, py + ux * spread, 2.2, 9); disc(a, g, px + uy * spread, py - ux * spread, 2.2, 9); }
      }
      disc(a, g, hx + ux * 2 - uy * 3, hy + uy * 2 + ux * 3, 1.3, 1); disc(a, g, hx + ux * 2 + uy * 3, hy + uy * 2 - ux * 3, 1.3, 1);
    });
    for (let k = 0; k < 4; k++){ const R = ((f + k * 3) % 12) * 4 + 4, [cx, cy] = [[200, 230], [300, 290], [250, 330], [320, 220]][k]; for (let t = 0; t < 60; t++){ const an2 = t / 60 * TAU; dot(a, g, cx + Math.cos(an2) * R, cy + Math.sin(an2) * R * .8, 20); } }
  });
}
