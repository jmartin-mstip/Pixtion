/* PIXTION · core/sanitize.js — validates anything that comes from outside the running app
   (backup files, saved storage, drafts, typed names) before the app trusts it. */
import { dec } from './codec.js';
import { validGrid } from './frames.js';
import { uid } from './dom.js';

export const LIMITS = Object.freeze({
  title: 40, desc: 200, name: 40, frames: 400,
  backupBytes: 100 * 1024 * 1024,   // 100 MB backup file
  imageBytes: 25 * 1024 * 1024      // 25 MB picture for "Turn a picture into pixel art"
});

/** Plain text only: no control characters, collapsed spaces, length-capped. */
export function cleanText(v, max){
  if (typeof v !== 'string') return '';
  return v.replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028\u2029\ufeff]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}
const num = (v, lo, hi, fallback) => { const n = Number(v); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback; };

/** Checks every frame string decodes to exactly grid×grid pixels. */
export function validFrames(frames, grid){
  return Array.isArray(frames) && frames.length > 0 && frames.length <= LIMITS.frames &&
    frames.every(f => typeof f === 'string' && f.length <= grid * grid * 2 && dec(f).length === grid * grid);
}

/** Returns a safe gallery item built only from known fields, or null if it isn't valid art. */
export function cleanItem(it){
  if (!it || typeof it !== 'object' || Array.isArray(it)) return null;
  const grid = Number(it.grid);
  if (!validGrid(grid) || !validFrames(it.frames, grid)) return null;
  const now = Date.now();
  return {
    id: typeof it.id === 'string' && /^[a-z0-9]{4,40}$/i.test(it.id) ? it.id : uid(),
    title: cleanText(it.title, LIMITS.title) || 'Untitled',
    desc: cleanText(it.desc, LIMITS.desc),
    artist: cleanText(it.artist, LIMITS.name),
    grid, frames: it.frames.slice(),
    fps: Math.round(num(it.fps, 1, 24, 8)),
    pingpong: it.pingpong === true,
    example: it.example === true,
    created: num(it.created, 0, now + 864e5, now),
    updated: num(it.updated, 0, now + 864e5, now)
  };
}

/** Cleans a whole gallery list, dropping anything invalid. */
export function cleanGallery(list){
  return Array.isArray(list) ? list.map(cleanItem).filter(Boolean) : [];
}

/** Profile from storage: name + age only. */
export function cleanProfile(p){
  if (!p || typeof p !== 'object') return null;
  const name = cleanText(p.name, LIMITS.name);
  const age = Math.round(num(p.age, 5, 120, NaN));
  return name ? {name, age: Number.isFinite(age) ? age : null} : null;
}
