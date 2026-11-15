/* PIXTION · studio/import.js — turning a picture into pixel art with the nearest palette colours. */
import { LIMITS } from '../core/sanitize.js';
import { $, toast } from '../core/dom.js';
import { blank } from '../core/frames.js';
import { PAL } from '../core/palette.js';
import { S } from '../state.js';
import { pushUndo } from './history.js';
import { changed } from './view.js';

let RGB;

let nearCache;

function nearest(r, g, b){ const key = (r >> 2) << 12 | (g >> 2) << 6 | (b >> 2); const hit = nearCache.get(key); if (hit) return hit; const v = nearestRaw(r, g, b); nearCache.set(key, v); return v; }

function nearestRaw(r, g, b){ let best = 1, bd = 1e9; for (let i = 1; i < RGB.length; i++){ const [R, G, B] = RGB[i], d = (r - R) ** 2 * .3 + (g - G) ** 2 * .59 + (b - B) ** 2 * .11; if (d < bd){ bd = d; best = i; } } return best; }

/** Runs once at start-up, in the original order. */
export function init() {
  RGB = PAL.map(h => h ? [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)] : null);

  nearCache = new Map();

  $('#importBtn').onclick = () => $('#importFile').click();

  $('#importFile').addEventListener('change', e => {
    const file = e.target.files && e.target.files[0]; e.target.value = '';
    if (!file) return;
    if (file.size > LIMITS.imageBytes){ toast('That picture is too big. The limit is 25 MB.'); return; }
    if (!/^image\//.test(file.type)){ toast('That file isn’t a picture. Choose a JPG, PNG or GIF.'); return; }
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const g = S.grid, cv = document.createElement('canvas'); cv.width = g; cv.height = g;
      const ctx = cv.getContext('2d'), sc = Math.min(g / img.width, g / img.height), w = img.width * sc, h = img.height * sc;
      ctx.imageSmoothingEnabled = true; ctx.drawImage(img, (g - w) / 2, (g - h) / 2, w, h);
      const d = ctx.getImageData(0, 0, g, g).data, out = blank(g);
      for (let i = 0; i < g * g; i++) if (d[i * 4 + 3] >= 128) out[i] = nearest(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]);
      URL.revokeObjectURL(url); pushUndo(); S.frames[S.cur] = out; changed();
      toast(`Picture turned into ${g}×${g} pixel art. Undo if you don’t like it.`);
    };
    img.onerror = () => { URL.revokeObjectURL(url); toast('PIXTION couldn’t open that picture. Try a JPG or PNG.'); };
    img.src = url;
  });
}
