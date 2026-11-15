/* PIXTION · core/codec.js — compact text encoding for frames (run-length encoded, backward compatible). */

const CH = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';

const CODE = {};

/* Frames are saved as text; runs of 4+ identical pixels become ~<colour><count base36>. so big grids stay small. */
export function enc(a){
  let s = '', i = 0; const n = a.length;
  while (i < n){ const v = a[i]; let j = i + 1; while (j < n && a[j] === v) j++; const run = j - i; s += run >= 4 ? '~' + CH[v] + run.toString(36) + '.' : CH[v].repeat(run); i = j; }
  return s;
}

export function dec(s){
  const out = []; let i = 0;
  while (i < s.length){
    const c = s[i];
    if (c === '~'){ const v = CODE[s[i + 1]] || 0, e = s.indexOf('.', i + 2); const run = e < 0 ? 0 : parseInt(s.slice(i + 2, e), 36) || 0; for (let k = 0; k < run; k++) out.push(v); i = e < 0 ? s.length : e + 1; }
    else { out.push(CODE[c] || 0); i++; }
  }
  return Uint8Array.from(out);
}

export function toU8(f) { return f instanceof Uint8Array ? f.slice() : Uint8Array.from(f); }

/** Runs once at start-up, in the original order. */
export function init() {
 
  [...CH].forEach((c, i) => CODE[c] = i);
}
