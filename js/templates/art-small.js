/* PIXTION · templates/art-small.js — template art for small grids (12×12 to 48×48). */
import { TAU, U8, animFrames, bg, box, disc, dot, ell, fromMap, pip, rng, seg, shape, stamp, starPts } from './draw.js';
import { MAPS } from './maps.js';

export function makeBall(){
  const g = 16, frames = [];
  [3.5, 5.5, 8.2, 10.6, 12, 10.6, 8.2, 5.5].forEach((cy, f) => {
    const a = new Array(g * g).fill(0);
    for (let x = 0; x < g; x++){ a[14 * g + x] = 13; a[15 * g + x] = 14; }
    const squash = f === 4, rx = squash ? 3.6 : 3, ry = squash ? 2 : 3, cx = 8;
    const w = Math.round(1 + (cy / 12) * 3);
    for (let x = cx - w; x < cx + w; x++) a[13 * g + x] = 4;
    for (let y = 0; y < g; y++) for (let x = 0; x < g; x++){
      const dx = (x + .5 - cx) / rx, dy = (y + .5 - cy) / ry;
      if (dx * dx + dy * dy <= 1) a[y * g + x] = 8;
    }
    const hx = Math.round(cx - rx * .5 - .5), hy = Math.round(cy - ry * .5 - .5);
    if (a[hy * g + hx] === 8) a[hy * g + hx] = 10;
    frames.push(a);
  });
  return frames;
}

export function starFrame(f){
  const g = 16, s = f % 2 ? .9 : 1, pts = starPts(8, 8.6, 7.2 * s, 3 * s);
  const a = shape(g, (x, y) => pip(x + .5, y + .5, pts), 10, 27);
  [[7, 8], [8, 8], [7, 9], [8, 9]].forEach(([x, y]) => { if (a[y * g + x] === 10) a[y * g + x] = 11; });
  const [sx, sy] = [[2, 2], [13, 2], [13, 13], [2, 13]][f % 4];
  [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const i = (sy + dy) * g + sx + dx; if (!a[i]) a[i] = dx || dy ? 20 : 29; });
  return a;
}

export function fishFrame(f){
  const g = 20, a = bg(g, (x, y) => y >= 17 ? 28 : y === 0 ? 20 : 19);
  for (let x = 0; x < g; x++) if ((x + f) % 4 === 0) a[g + x] = 20;
  [[3, 12, 0], [16, 11, 2]].forEach(([sx, top, o]) => { for (let y = top; y < 17; y++) dot(a, g, sx + Math.round(Math.sin((y + f + o) / 1.6) * .8), y, 13); });
  const cx = f * 2 - 6, cy = 8.5;
  const body = (x, y) => { const dx = (x + .5 - cx) / 4.2, dy = (y + .5 - cy) / 2.6; return dx * dx + dy * dy <= 1; };
  const tail = (x, y) => { const t = cx - 3.6 - (x + .5); return t >= 0 && t <= 3.2 && Math.abs(y + .5 - cy) <= t * .9 + .3; };
  const fish = (x, y) => body(x, y) || tail(x, y);
  for (let y = 0; y < g; y++) for (let x = 0; x < g; x++){
    if (!fish(x, y)) continue;
    const edge = !fish(x - 1, y) || !fish(x + 1, y) || !fish(x, y - 1) || !fish(x, y + 1);
    a[y * g + x] = edge ? 1 : tail(x, y) ? 9 : (x === Math.round(cx - 1) ? 29 : 8);
  }
  dot(a, g, cx + 2, 8, 1);
  [0, 5, 10].forEach(k => dot(a, g, 12 + (k % 2), 16 - ((f + k) % 16), 29));
  return a;
}

export function spinFrame(f){
  const g = 16, a = new Array(g * g).fill(0), cols = [17, 16, 15, 20, 20, 20, 20, 20];
  for (let k = 0; k < 8; k++){ const an = k * Math.PI / 4 - Math.PI / 2; box(a, g, Math.round(7 + 5 * Math.cos(an)), Math.round(7 + 5 * Math.sin(an)), 2, 2, cols[(f - k + 8) % 8]); }
  return a;
}

export function flagFrame(f){
  /* Philippine flag: blue over red, white triangle at the hoist with a golden sun and three stars. */
  const g = 32, a = bg(g, (x, y) => y >= 28 ? (y === 28 ? 13 : 12) : y > 22 ? 20 : 19);
  [[6, 24, 5], [24, 25, 6]].forEach(([cx, cy, rx]) => { for (let y = 20; y < 28; y++) for (let x = 0; x < g; x++) if (ell(x, y, cx, cy, rx, 2.2) || ell(x, y, cx + 3, cy - 1, rx * .6, 2)) a[y * g + x] = 29; });
  for (let y = 3; y < 28; y++){ a[y * g + 3] = 2; a[y * g + 4] = 3; }
  box(a, g, 2, 2, 4, 1, 46); box(a, g, 3, 1, 2, 1, 46);
  const W = 24, H = 12, TRI = H * .866;
  const BLUE = 37, RED = 6, WHITE = 29, GOLD = 10;
  const sunX = TRI / 3, sunY = H / 2;
  const stars = [[.95, 1.15], [.95, H - 1.15], [TRI - 1.25, H / 2]];
  for (let fx = 0; fx < W; fx++){
    const off = Math.round(Math.sin(fx * .42 - f * 1.05) * 1.6 * (fx / W));
    const shade = Math.sin(fx * .42 - f * 1.05) > .55;
    for (let fy = 0; fy < H; fy++){
      const cx = fx + .5, cy = fy + .5;
      let v = cy < H / 2 ? BLUE : RED;
      if (shade) v = v === BLUE ? 18 : 39;
      if (cx <= TRI * (1 - Math.abs(cy - H / 2) / (H / 2))) v = WHITE;
      const ds = Math.hypot(cx - sunX, cy - sunY), an = Math.atan2(cy - sunY, cx - sunX);
      if (ds <= 1.3) v = GOLD;
      else if (ds <= 2.6 && Math.abs(((an / (Math.PI / 4)) % 1 + 1) % 1 - .5) > .32) v = GOLD;
      if (stars.some(([sx, sy]) => Math.abs(cx - sx) + Math.abs(cy - sy) <= .8)) v = GOLD;
      dot(a, g, 5 + fx, 5 + fy + off, v);
    }
  }
  return a;
}

const ROCKET = ['...k...', '..krk..', '.kWWWk.', '.kWlWk.', '.kWWWk.', '.kWWWk.', 'krWWWrk', 'k.kkk.k'];

export function rocketFrame(f){
  const g = 16, a = new Array(g * g).fill(22), r = rng(11);
  for (let i = 0; i < 12; i++){ const x = Math.floor(r() * g), y = Math.floor(r() * g); a[y * g + x] = (i + f) % 4 ? 20 : 29; }
  const oy = 12 - ((f * 2) % 22);
  stamp(a, g, ROCKET, 5, oy);
  stamp(a, g, f % 2 ? ['..oyo..', '...o...'] : ['..yoy..', '..o.o..'], 5, oy + 8);
  return a;
}

export function snowFrame(f){
  const g = 20, a = bg(g, (x, y) => y >= 17 ? 29 : 18);
  for (let y = 0; y < g; y++) for (let x = 0; x < g; x++){ const dx = x + .5 - 15.5, dy = y + .5 - 3.5; if (dx * dx + dy * dy <= 4.4) a[y * g + x] = 11; }
  [[4, 7], [10, 9], [15, 6]].forEach(([tx, h]) => {
    for (let i = 0; i < h; i++){ const half = Math.floor((i + 1) / 2); box(a, g, tx - half, 16 - h + i, half * 2 + 1, 1, 14); }
    dot(a, g, tx, 16 - h, 29); dot(a, g, tx, 16, 26);
  });
  const r = rng(5);
  for (let i = 0; i < 18; i++){ const x0 = Math.floor(r() * g), y0 = Math.floor(r() * 17), sp = 1 + (i % 2); dot(a, g, (x0 + Math.round(Math.sin((f + i) / 2)) + g) % g, (y0 + f * sp) % 17, 29); }
  return a;
}

export function clockFrame(f){
  const g = 16, a = shape(g, (x, y) => { const dx = x + .5 - 8, dy = y + .5 - 8; return dx * dx + dy * dy <= 46; }, 5, 1);
  [[7, 2], [8, 2], [7, 13], [8, 13], [2, 7], [2, 8], [13, 7], [13, 8]].forEach(([x, y]) => a[y * g + x] = 3);
  for (let y = 4; y < 8; y++) a[y * g + 7] = 1;
  for (let x = 8; x < 11; x++) a[8 * g + x] = 1;
  const an = f * Math.PI / 4;
  for (let t = 1; t <= 5; t++) dot(a, g, Math.floor(8 + t * Math.sin(an)), Math.floor(8 - t * Math.cos(an)), 6);
  a[7 * g + 7] = 1;
  return a;
}

export function heroWalk() { const A = fromMap(MAPS.hero), rows = MAPS.hero.slice(0, 12).concat(['....kxxxxxxk....', '...kxxk..kxxk...', '..kxxk....kxxk..', '.kwwwk....kwwwk.']); return [A, fromMap(rows)]; }

export function slimeFrame([ry, lift]){
  const g = 16, rx = Math.min(6.5, 16 / ry), bottom = 15 - lift, cy = bottom;
  const a = new Array(g * g).fill(0);
  const sw = Math.max(1, Math.round(rx - lift * .7));
  for (let x = 8 - sw; x < 8 + sw; x++) dot(a, g, x, 15, 4);
  const inside = (x, y) => y < bottom && ell(x, y, 8, cy, rx, ry);
  for (let y = 0; y < g; y++) for (let x = 0; x < g; x++){
    if (!inside(x, y)) continue;
    const edge = !inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1);
    a[y * g + x] = edge ? 41 : 35;
  }
  const ey = Math.round(bottom - ry * .6);
  dot(a, g, 6, ey, 1); dot(a, g, 9, ey, 1); dot(a, g, Math.round(8 - rx * .5), Math.round(bottom - ry * .85), 29);
  return a;
}

export function butterflyFrame(f){
  const g = 16, w = [6, 4.2, 1.6, 4.2][f], bob = f % 2;
  const a = new Array(g * g).fill(0);
  const up = (x, y) => [-1, 1].some(s => ell(x, y, 8 + s * (w * .55 + .6), 6 + bob, Math.max(.7, w * .55), 3.1));
  const lo = (x, y) => [-1, 1].some(s => ell(x, y, 8 + s * (w * .4 + .6), 10.6 + bob, Math.max(.6, w * .4), 2.3));
  const wing = (x, y) => x >= 0 && y >= 0 && x < g && y < g && (up(x, y) || lo(x, y));
  for (let y = 0; y < g; y++) for (let x = 0; x < g; x++){
    if (!wing(x, y)) continue;
    const edge = !wing(x - 1, y) || !wing(x + 1, y) || !wing(x, y - 1) || !wing(x, y + 1);
    a[y * g + x] = edge ? 1 : up(x, y) ? 36 : 24;
  }
  if (w > 3){ [-1, 1].forEach(s => dot(a, g, 8 + s * (w * .55 + .6) - .5, 5 + bob, 29)); }
  for (let y = 4; y <= 12; y++){ dot(a, g, 7, y + bob, 1); dot(a, g, 8, y + bob, 1); }
  dot(a, g, 6, 2 + bob, 1); dot(a, g, 9, 2 + bob, 1); dot(a, g, 7, 3 + bob, 1); dot(a, g, 8, 3 + bob, 1);
  return a;
}

export function campfireFrame(f){
  const g = 20, a = new Array(g * g).fill(42), r = rng(13);
  for (let i = 0; i < 10; i++){ const x = Math.floor(r() * g), y = Math.floor(r() * 8); a[y * g + x] = (i + f) % 4 ? 20 : 29; }
  box(a, g, 0, 18, g, 2, 14);
  const sway = [0, 1, 0, -1, 0, 1][f], tip = [5, 4, 6, 4, 5, 3][f], base = 16;
  for (let y = tip; y < base; y++){
    const t = (y - tip) / (base - 1 - tip), hw = 4.2 * Math.sqrt(t) * (1 - .2 * t) + .4, cx = 10 + sway * (1 - t) * 1.6;
    for (let x = 0; x < g; x++){ const d = Math.abs(x + .5 - cx); if (d <= hw) a[y * g + x] = (d <= hw * .35 && t > .3) ? 11 : d <= hw * .68 ? 10 : (t > .7 ? 40 : 8); }
  }
  for (let i = 0; i < 10; i++){ dot(a, g, 4 + i * 1.2, 16 + (i % 2), 26); dot(a, g, 15 - i * 1.2, 16 + (i % 2), 27); }
  [2, 4, 15, 17].forEach(x => { dot(a, g, x, 17, 3); dot(a, g, x, 18, 4); });
  [[8, 0], [12, 2], [10, 4]].forEach(([x, o]) => dot(a, g, x + ((f + o) % 2), 4 - ((f + o) % 5), 8));
  return a;
}

export function windmillFrame(f){
  const g = 20, a = bg(g, (x, y) => y >= 17 ? 13 : 19);
  for (let y = 9; y < 17; y++){ const half = 1 + Math.floor((y - 9) / 3); for (let x = 10 - half; x <= 10 + half - 1; x++) dot(a, g, x, y, (x === 10 - half || x === 10 + half - 1) ? 1 : 5); }
  dot(a, g, 9, 14, 26); dot(a, g, 9, 15, 26); dot(a, g, 10, 14, 26); dot(a, g, 10, 15, 26);
  for (let k = 0; k < 4; k++){
    const an = f * Math.PI / 8 + k * Math.PI / 2, c = Math.cos(an), sn = Math.sin(an);
    for (let t = 1; t <= 7; t++){ dot(a, g, 9.5 + t * c, 7.5 + t * sn, 26); if (t > 2) dot(a, g, 9.5 + t * c - sn * 1.2, 7.5 + t * sn + c * 1.2, 29); }
  }
  dot(a, g, 9.5, 7.5, 1);
  [[2, 3], [3, 3], [4, 3], [3, 2], [14, 2], [15, 2], [16, 2]].forEach(([x, y]) => dot(a, g, x, y, 29));
  return a;
}

export function trafficFrame(f){
  const g = 12, a = new Array(g * g).fill(0), on = ['r', 'r', 'r', 'g', 'g', 'g', 'y'][f];
  box(a, g, 3, 0, 6, 12, 1); box(a, g, 4, 1, 4, 10, 2);
  [['r', 2, 6], ['y', 5, 10], ['g', 8, 13]].forEach(([k, y, c]) => box(a, g, 5, y, 2, 2, on === k ? c : 3));
  return a;
}

export function dayNightFrame(f){
  const g = 20, sky = [20, 19, 19, 9, 23, 22, 22, 25][f], night = f >= 4 && f <= 6;
  const a = bg(g, (x, y) => { const hill = 14 + Math.round(1.5 * Math.sin(x / 3)); return y >= 17 ? 13 : y >= hill ? 12 : sky; });
  if (night){ const r = rng(2); for (let i = 0; i < 12; i++){ const x = Math.floor(r() * g), y = Math.floor(r() * 10); if (a[y * g + x] === sky) a[y * g + x] = 29; } }
  const k = f < 4 ? f : f - 4, px = 3 + k * 4.5, py = 12 - Math.sin((k + .5) / 4 * Math.PI) * 9;
  for (let y = 0; y < g; y++) for (let x = 0; x < g; x++) if (ell(x, y, px, py, 2.2, 2.2) && y < 14) a[y * g + x] = f < 4 ? 10 : 11;
  box(a, g, 12, 13, 5, 4, 26); box(a, g, 13, 14, 2, 2, night ? 11 : 1); for (let i = 0; i < 4; i++) box(a, g, 11 + i, 12 - i + Math.max(0, i - 2) * 2, 7 - i * 2, 1, 6);
  return a;
}

export function wavesFrame(f){
  const g = 24, a = bg(g, (x, y) => y < 5 ? 19 : y < 10 ? 20 : y < 20 ? 18 : 28);
  for (let y = 0; y < 10; y++) for (let x = 0; x < g; x++) if (ell(x, y, 18, 4, 2.6, 2.6)) a[y * g + x] = 10;
  for (let row = 11; row < 20; row += 3) for (let x = 0; x < g; x++) if (((x + f * 2 + row) % 8) < 3) a[row * g + x] = row > 16 ? 19 : 29;
  const shore = 19 + Math.round(Math.sin(f * Math.PI / 3));
  for (let x = 0; x < g; x++){ dot(a, g, x, shore, 29); if ((x + f) % 3 === 0) dot(a, g, x, shore + 1, 20); }
  [[4, 22], [12, 23], [19, 21]].forEach(([x, y]) => dot(a, g, x, y, 27));
  return a;
}

export function gemFrame(f){
  const g = 16, pts = [[4, 4], [12, 4], [15, 7.5], [8, 15], [1, 7.5]];
  const a = shape(g, (x, y) => pip(x + .5, y + .5, pts), 38, 17);
  for (let x = 0; x < g; x++) for (let y = 5; y < 8; y++) if (a[y * g + x] === 38) a[y * g + x] = 20;
  for (let y = 8; y < 15; y++){ const i = y * g + 8; if (a[i] === 38) a[i] = 16; }
  const [sx, sy] = [[5, 5], [10, 6], [7, 10], [12, 2]][f];
  [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => dot(a, g, sx + dx, sy + dy, dx || dy ? 20 : 29));
  return a;
}

export function carArt(){
  const g = 24, a = new Array(g * g).fill(0);
  const xl = y => 8 - (y - 6) * .75, xr = y => 15 + (y - 6) * .75;
  const body = (x, y) => (y >= 11 && y <= 16 && x >= 2 && x <= 21) || (y >= 6 && y <= 10 && x >= xl(y) && x <= xr(y));
  for (let y = 0; y < g; y++) for (let x = 0; x < g; x++){ if (!body(x, y)) continue; const edge = !body(x - 1, y) || !body(x + 1, y) || !body(x, y - 1) || !body(x, y + 1); a[y * g + x] = edge ? 1 : 6; }
  for (let y = 7; y <= 10; y++) for (let x = Math.ceil(xl(y)) + 1; x <= Math.floor(xr(y)) - 1; x++) a[y * g + x] = x === 11 ? 6 : 20;
  for (let y = 11; y <= 15; y++) a[y * g + 12] = 1;
  a[12 * g + 20] = 11; a[12 * g + 3] = 9;
  [6.5, 17.5].forEach(cx => { for (let y = 14; y < g; y++) for (let x = 0; x < g; x++){ if (ell(x, y, cx, 17.5, 2.8, 2.8)) a[y * g + x] = ell(x, y, cx, 17.5, 1.2, 1.2) ? 4 : 1; } });
  return a;
}

export function ecgFrames(){
  const g = 32, base = bg(g, (x, y) => (x % 4 === 0 || y % 4 === 0) ? 14 : 47);
  const off = [0, 0, 0, 0, -1, 0, 0, -2, -10, 8, -1, 0, 0, -2, -2, 0], yAt = x => 18 + off[((x % 16) + 16) % 16];
  return animFrames(16, base, (a, f) => {
    const head = f * 2;
    for (let k = 0; k < 26; k++){ const x = head - k, x2 = x - 1; const col = k < 3 ? 29 : k < 10 ? 35 : k < 18 ? 13 : 14; seg(a, g, ((x % g) + g) % g, yAt(x), ((x2 % g) + g) % g, yAt(x2), col); }
    const beat = (head % 16) >= 8 && (head % 16) <= 11;
    stamp(a, g, beat ? ['.r.r.', 'rrrrr', 'rrrrr', '.rrr.', '..r..'] : ['.....', '.r.r.', '.rrr.', '..r..', '.....'], 1, 1);
    stamp(a, g, ['y.y', '...'], 26, 2);
  });
}

export function pendulumFrames(){
  const g = 32, base = bg(g, (x, y) => y < 2 ? 26 : 5);
  box(base, g, 0, 2, g, 1, 34); box(base, g, 0, 30, g, 2, 26);
  return animFrames(8, base, (a, f) => {
    const an = .6 * Math.cos(f / 8 * TAU), bx = 16 + Math.sin(an) * 20, by = 3 + Math.cos(an) * 20;
    for (let k = 1; k <= 3; k++){ const an2 = .6 * Math.cos((f - k * .35) / 8 * TAU); disc(a, g, 16 + Math.sin(an2) * 20, 3 + Math.cos(an2) * 20, 3, 28); }
    seg(a, g, 16, 3, bx, by, 1); disc(a, g, bx, by, 3.6, 1); disc(a, g, bx, by, 2.6, 46); dot(a, g, bx - 1, by - 1, 11); disc(a, g, 16, 3, 1.4, 1);
  });
}

export function rippleFrames(){
  const g = 48, base = bg(g, (x, y) => y < 6 ? 20 : y < 26 ? 19 : 18);
  return animFrames(8, base, (a, f) => {
    if (f < 2){ const y = 6 + f * 12; disc(a, g, 24, y, 2, 20); dot(a, g, 24, y - 3, 20); }
    else {
      const R = (f - 2) * 4 + 2;
      [[R, 20], [R - 5, 29], [R - 10, 20]].forEach(([rr, c]) => { if (rr <= 0) return; for (let t = 0; t < 120; t++){ const an = t / 120 * TAU; dot(a, g, 24 + Math.cos(an) * rr * 1.6, 32 + Math.sin(an) * rr * .45, c); } });
      if (f === 2 || f === 3){ const h = f === 2 ? 6 : 3; [-3, -1, 1, 3].forEach(dx => { dot(a, g, 24 + dx, 30 - h, 29); dot(a, g, 24 + dx * 1.5, 31 - h / 2, 20); }); }
    }
  });
}

export function eqFrames(){
  const g = 32, base = U8(g, 47);
  return animFrames(8, base, (a, f) => {
    for (let k = 0; k < 8; k++){
      const h = 4 + Math.round(22 * Math.abs(Math.sin(k * 1.7 + f / 8 * TAU * (1 + k % 3))));
      for (let y = 30 - h; y < 30; y++) box(a, g, k * 4, y, 3, 1, y < 10 ? 6 : y < 18 ? 10 : 13);
      box(a, g, k * 4, 28 - h, 3, 1, 29);
    }
    box(a, g, 0, 30, g, 2, 2);
  });
}

export function sunSpinFrames(){
  const g = 32, base = U8(g, 19);
  [[5, 26, 4], [9, 25, 3], [24, 27, 4], [28, 26, 3]].forEach(([cx, cy, rr]) => disc(base, g, cx, cy, rr, 29));
  return animFrames(6, base, (a, f) => {
    for (let k = 0; k < 12; k++){ const an = k * Math.PI / 6 + f * Math.PI / 36; seg(a, g, 16 + Math.cos(an) * 10, 15 + Math.sin(an) * 10, 16 + Math.cos(an) * 14.5, 15 + Math.sin(an) * 14.5, k % 2 ? 46 : 9, 2); }
    disc(a, g, 16, 15, 8.5, 9); disc(a, g, 16, 15, 7.5, 10);
    dot(a, g, 13, 13, 1); dot(a, g, 19, 13, 1); [13, 14, 15, 16, 17, 18, 19].forEach((x, i) => dot(a, g, x, 18 + (i === 0 || i === 6 ? -1 : 0), 1)); dot(a, g, 12, 16, 7); dot(a, g, 20, 16, 7);
  });
}

export function hourglassFrames(){
  const g = 16;
  const inside = y => y >= 2 && y <= 7 ? 5 - (y - 2) * .8 : y >= 8 && y <= 13 ? 1 + (y - 8) * .8 : -1;
  return [...Array(8).keys()].map(f => {
    const a = new Uint8Array(g * g);
    box(a, g, 3, 1, 10, 1, 26); box(a, g, 3, 14, 10, 1, 26);
    for (let y = 2; y <= 13; y++){
      const h = inside(y), x0 = Math.round(8 - h), x1 = Math.round(8 + h) - 1;
      dot(a, g, x0 - 1, y, 1); dot(a, g, x1 + 1, y, 1);
      for (let x = x0; x <= x1; x++){
        const top = y <= 7 && y >= 3 + f * .6, bottom = y >= 8 && y > 13 - f * .7;
        a[y * g + x] = top || bottom ? 28 : 20;
      }
    }
    if (f < 7) for (let y = 7; y <= 13 - f * .7; y++) dot(a, g, 7, y, 28);
    return a;
  });
}
