/* PIXTION · templates/draw.js — drawing helpers used to generate template art (shapes, discs, lines, trees, fish, noise). */

const LEG = {'.':0,k:1,s:2,g:3,f:4,c:5,r:6,p:7,o:8,a:9,y:10,u:11,m:12,e:13,n:14,i:15,l:16,t:17,d:18,b:19,z:20,v:21,x:22,q:23,h:24,j:25,w:26,C:27,S:28,W:29};

export function fromMap(rows) { return rows.join('').split('').map(c => LEG[c] || 0); }

export function shape(g, inside, fill, line){
  const a = new Array(g * g).fill(0);
  const ins = (x, y) => x >= 0 && y >= 0 && x < g && y < g && inside(x, y);
  for (let y = 0; y < g; y++) for (let x = 0; x < g; x++){
    if (!ins(x, y)) continue;
    const edge = !ins(x - 1, y) || !ins(x + 1, y) || !ins(x, y - 1) || !ins(x, y + 1);
    a[y * g + x] = edge ? line : fill;
  }
  return a;
}

export function pip(x, y, pts) { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++){ const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; }

export function starPts(cx, cy, R, r) { return [...Array(10)].map((_, k) => { const an = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r : R; return [cx + rr * Math.cos(an), cy + rr * Math.sin(an)]; }); }

export function shiftArt(a, g, dx, dy) { const o = new Array(g * g).fill(0); for (let y = 0; y < g; y++) for (let x = 0; x < g; x++) o[y * g + x] = a[((y - dy + g) % g) * g + ((x - dx + g) % g)]; return o; }

export function box(a, g, x0, y0, w, h, v) { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) if (x >= 0 && y >= 0 && x < g && y < g) a[y * g + x] = v; }

export function dot(a, g, x, y, v) { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < g && y < g) a[y * g + x] = v; }

export function stamp(a, g, rows, ox, oy) { return rows.forEach((r, y) => [...r].forEach((ch, x) => { const v = LEG[ch]; if (v) dot(a, g, ox + x, oy + y, v); })); }

export function rng(s) { return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

export function bg(g, fn) { const a = new Uint8Array(g * g); for (let y = 0; y < g; y++) for (let x = 0; x < g; x++) a[y * g + x] = fn(x, y); return a; }

export function ell(x, y, cx, cy, rx, ry) { return ((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2 <= 1; }

export function U8(g, v = 0) { return new Uint8Array(g * g).fill(v); }

export function disc(a, g, cx, cy, r, v){
  for (let y = Math.max(0, Math.floor(cy - r)); y <= Math.min(g - 1, Math.ceil(cy + r)); y++)
    for (let x = Math.max(0, Math.floor(cx - r)); x <= Math.min(g - 1, Math.ceil(cx + r)); x++)
      if ((x + .5 - cx) ** 2 + (y + .5 - cy) ** 2 <= r * r) a[y * g + x] = v;
}

export function seg(a, g, x0, y0, x1, y1, v, w = 1){ const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0)) + 1; for (let i = 0; i <= n; i++){ const t = i / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; if (w <= 1) dot(a, g, x, y, v); else disc(a, g, x, y, w / 2, v); } }

export function pine(a, g, tx, by, h, v, snow){ for (let i = 0; i < h; i++){ const half = Math.floor(i / 2.3); box(a, g, tx - half, by - h + i, half * 2 + 1, 1, snow && i % 6 === 0 && i > 0 ? 29 : v); } box(a, g, tx - Math.max(1, h / 30), by, Math.max(2, h / 15), Math.max(2, h / 12), 34); }

export function animFrames(n, base, fn) { return [...Array(n).keys()].map(f => { const a = base.slice(); fn(a, f); return a; }); }

export function bands(g, list, h) { return bg(g, (x, y) => list[Math.min(list.length - 1, Math.floor(y / h))]); }

export function drawFish(a, g, cx, cy, s, body, fin){
  for (let y = Math.floor(cy - s); y <= cy + s; y++) for (let x = Math.floor(cx - s * 2.6); x <= cx + s * 1.8; x++){
    const inB = ell(x, y, cx, cy, s * 1.6, s * .9), t = cx - s * 1.3 - (x + .5), inT = t >= 0 && t <= s * 1.2 && Math.abs(y + .5 - cy) <= t * .9 + .3;
    if (inB || inT) dot(a, g, x, y, inT ? fin : body);
  }
  dot(a, g, cx + s * .9, cy - s * .2, 1);
}

export const TAU = Math.PI * 2;
