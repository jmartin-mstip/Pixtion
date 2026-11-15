/* PIXTION · export/gif.js — GIF89a encoder (64-colour palette, LZW). */
import { dec } from '../core/codec.js';
import { seqOf } from '../core/frames.js';
import { fullPalette } from '../core/palette.js';

function lzw(px, minSize){
  const out = []; let cur = 0, bits = 0;
  const clear = 1 << minSize, eoi = clear + 1;
  let size = minSize + 1, next = eoi + 1, dict = new Map();
  const emit = c => { cur |= c << bits; bits += size; while (bits >= 8){ out.push(cur & 255); cur >>>= 8; bits -= 8; } };
  emit(clear);
  let prefix = px[0];
  for (let i = 1; i < px.length; i++){
    const k = px[i], key = prefix * 256 + k, hit = dict.get(key);
    if (hit !== undefined){ prefix = hit; continue; }
    emit(prefix);
    if (next === 4096){ emit(clear); next = eoi + 1; size = minSize + 1; dict = new Map(); }
    else { if (next >= (1 << size)) size++; dict.set(key, next++); }
    prefix = k;
  }
  emit(prefix); emit(eoi);
  if (bits > 0) out.push(cur & 255);
  return out;
}

export function makeGif(item, fps, scale){
  const g = item.grid, W = g * scale, frames = item.frames.map(dec), b = [];
  const w16 = n => b.push(n & 255, (n >> 8) & 255);
  const str = s => { for (const c of s) b.push(c.charCodeAt(0)); };
  const pal = fullPalette(item.custom);
  str('GIF89a'); w16(W); w16(W); b.push(0xF5, 0, 0);
  for (let i = 0; i < 64; i++){
    const hex = i === 0 ? '#ffffff' : (pal[i] || '#ffffff');
    b.push(parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16));
  }
  b.push(0x21, 0xFF, 0x0B); str('NETSCAPE2.0'); b.push(0x03, 0x01, 0, 0, 0);
  const delay = Math.max(2, Math.round(100 / fps)), px = new Uint8Array(W * W);
  seqOf(frames.length, item.pingpong).forEach(fi => {
    const f = frames[fi];
    for (let y = 0; y < W; y++){ const row = Math.floor(y / scale) * g; for (let x = 0; x < W; x++) px[y * W + x] = f[row + Math.floor(x / scale)]; }
    b.push(0x21, 0xF9, 0x04, 0x04); w16(delay); b.push(0, 0);
    b.push(0x2C); w16(0); w16(0); w16(W); w16(W); b.push(0);
    b.push(6);
    const data = lzw(px, 6);
    for (let i = 0; i < data.length; i += 255){ const chunk = data.slice(i, i + 255); b.push(chunk.length); for (const v of chunk) b.push(v); }
    b.push(0);
  });
  b.push(0x3B);
  return new Blob([new Uint8Array(b)], {type: 'image/gif'});
}
