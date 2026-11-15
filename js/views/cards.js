/* PIXTION · views/cards.js — shared gallery/template card rendering and thumbnail animation. */
import { esc, plural } from '../core/dom.js';
import { paintFrame } from '../core/render.js';

export function cardEl(o, btns){
  const el = document.createElement('article'); el.className = 'gcard';
  el.innerHTML = `<canvas aria-label="${esc(o.title)} preview"></canvas>
    <div><h3>${esc(o.title)}${o.tag ? `<span class="tag">${o.tag}</span>` : ''}</h3>
    <p class="meta">${o.grid}×${o.grid} · ${plural(o.frames.length, 'frame')}${o.frames.length > 1 ? ` · ${o.fps} fps` : ''}</p>${o.sub || ''}</div>${btns}`;
  const pf = o.pf || o.frames, pg = o.pg || o.grid;
  paintFrame(el.querySelector('canvas'), pf[0], pg, Math.ceil(160 / pg));
  return el;
}

export function animateCards(cards){
  stopGalleryAnim();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const t0 = performance.now();
  gT = setInterval(() => {
    const t = performance.now() - t0;
    cards.forEach(c => {
      if (c.frames.length < 2) return;
      const k = Math.floor(t / (1000 / c.fps)) % c.seq.length, i = c.seq[k];
      if (i !== c.last){ c.last = i; paintFrame(c.cv, c.frames[i], c.grid, Math.ceil(160 / c.grid)); }
    });
  }, 40);
}

let gT;

export function stopGalleryAnim(){ clearInterval(gT); }
