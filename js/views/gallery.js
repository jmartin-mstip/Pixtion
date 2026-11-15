/* PIXTION · views/gallery.js — the Gallery tab: search, sort and cards. */
import { app } from '../shared.js';
import { dec } from '../core/codec.js';
import { $, $$, esc, fmtDate, plural } from '../core/dom.js';
import { IAB } from '../core/env.js';
import { seqOf } from '../core/frames.js';
import { palette32, thumbFrames } from '../core/render.js';
import { openInStudio } from '../studio/save.js';
import { animateCards, cardEl } from './cards.js';
import { openPlayer } from './player.js';

let gSort = 'new';

export function renderGallery(){
  $$('.iab').forEach(b => b.hidden = !IAB);
  const box = $('#gallery'); box.innerHTML = '';
  $('#gCount').textContent = plural(app.gallery.length, 'piece');
  $('#gEmpty').hidden = app.gallery.length > 0;
  $('#gTools').hidden = app.gallery.length < 2;
  const q = $('#gSearch').value.trim().toLowerCase();
  let list = app.gallery.filter(it => !q || (it.title + ' ' + (it.desc || '')).toLowerCase().includes(q));
  const sorters = {new: (a, b) => (b.updated || 0) - (a.updated || 0), old: (a, b) => (a.created || 0) - (b.created || 0), az: (a, b) => a.title.localeCompare(b.title), anim: (a, b) => b.frames.length - a.frames.length};
  list = list.slice().sort(sorters[gSort]);
  $('#gNone').hidden = !(app.gallery.length && !list.length);
  const cards = [];
  list.forEach(item => {
    const frames = item.frames.map(dec), th = thumbFrames(frames, item.grid), pal = palette32(item.custom);
    const el = cardEl({title: item.title, tag: item.example ? 'EXAMPLE' : '', grid: item.grid, fps: item.fps, frames, pf: th.frames, pg: th.grid, pal,
      sub: `<p class="meta">${fmtDate(item.updated)}</p>${item.desc ? `<p class="desc">${esc(item.desc)}</p>` : ''}`},
      '<div class="row u-gap6"><button class="btn orange" data-a="play">Play</button><button class="btn" data-a="edit">Edit</button></div>');
    const cv = el.querySelector('canvas');
    cv.setAttribute('role', 'button'); cv.tabIndex = 0; cv.setAttribute('aria-label', 'Play ' + item.title);
    cv.onclick = () => openPlayer(item.id);
    cv.onkeydown = e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openPlayer(item.id); } };
    el.querySelector('[data-a=play]').onclick = () => openPlayer(item.id);
    el.querySelector('[data-a=edit]').onclick = () => openInStudio(item);
    box.append(el); cards.push({cv, pal, frames: th.frames, grid: th.grid, fps: item.fps, seq: seqOf(frames.length, item.pingpong), last: 0});
  });
  animateCards(cards);
}

/** Runs once at start-up, in the original order. */
export function init() {
  $('#gSearch').addEventListener('input', () => renderGallery());

  $$('[data-sort]').forEach(b => b.onclick = () => { gSort = b.dataset.sort; $$('[data-sort]').forEach(x => x.setAttribute('aria-pressed', x === b)); renderGallery(); });
}
