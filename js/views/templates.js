/* PIXTION · views/templates.js — the Templates tab: filters, lazy loading and opening a template. */
import { app } from '../shared.js';
import { toU8 } from '../core/codec.js';
import { $, ask, esc, toast } from '../core/dom.js';
import { SIZES, blank, seqOf } from '../core/frames.js';
import { thumbFrames } from '../core/render.js';
import { S, settings } from '../state.js';
import { pushUndo } from '../studio/history.js';
import { stopPlay } from '../studio/playback.js';
import { TPLS, tplFrames } from '../templates/catalog.js';
import { animateCards, cardEl } from './cards.js';
import { go, setTab } from './nav.js';

async function startFresh(title, grid, frames, fps, artTitle = ''){
  const has = S.frames.some(f => f.some(Boolean));
  const saved = S.editingId && app.gallery.some(x => x.id === S.editingId);
  if (has && !saved && !await ask({title: `Open “${title}”?`, body: 'Your current drawing isn’t saved to the Gallery yet. This replaces it in the Studio, but Undo can bring it back.', ok: 'Open', danger: true})) return;
  stopPlay(); pushUndo();
  S.grid = grid; S.frames = frames.map(toU8); S.cur = 0; S.fps = fps || settings.fps;
  S.title = artTitle; S.desc = ''; S.pingpong = false; S.editingId = null;
  go('main'); setTab('studio'); toast(`Opened ${title}`);
}

let tFilter = 'All';
let tToken = 0;

const T_FILTERS = ['All', 'Animated', 'Characters', 'Nature', 'Objects', 'Scenes', 'Big 64+'];

function tMatch(t, f) { return f === 'All' || (f === 'Animated' ? !!t.anim : f === 'Big 64+' ? t.grid >= 64 : t.cat === f); }

export function renderTemplates(){
  $('#tCount').textContent = `${TPLS.length} templates`;
  const chips = $('#tChips'); chips.innerHTML = '';
  T_FILTERS.forEach(name => {
    const n = TPLS.filter(t => tMatch(t, name)).length;
    const c = document.createElement('button'); c.className = 'chip'; c.textContent = `${name} ${n}`; c.setAttribute('aria-pressed', name === tFilter);
    c.onclick = () => { tFilter = name; renderTemplates(); };
    chips.append(c);
  });
  const list = TPLS.filter(t => tMatch(t, tFilter));
  const box = $('#tGrid'); box.innerHTML = '';
  const cards = [], queue = [], token = ++tToken;
  const build = t => {
    const frames = tplFrames(t), th = t._th || (t._th = thumbFrames(frames, t.grid)), anim = frames.length > 1;
    const el = cardEl({title: t.title, tag: anim ? 'ANIMATED' : '', grid: t.grid, fps: t.fps, frames, pf: th.frames, pg: th.grid, sub: `<p class="meta">${t.cat}</p><p class="desc">${esc(t.desc)}</p>`}, '<button class="btn orange btn-card">Use template</button>');
    el.querySelector('button').onclick = () => startFresh(`the “${t.title}” template`, t.grid, tplFrames(t), t.fps, t.title);
    cards.push({cv: el.querySelector('canvas'), frames: th.frames, grid: th.grid, fps: t.fps || 8, seq: seqOf(frames.length, false), last: 0});
    return el;
  };
  list.forEach(t => {
    if (t._f){ box.append(build(t)); return; }
    const ph = document.createElement('article'); ph.className = 'gcard';
    ph.innerHTML = `<div class="pv card-loading"><span class="meta">Loading ${t.grid}×${t.grid}…</span></div><div><h3>${esc(t.title)}</h3><p class="meta">${t.cat}</p><p class="desc">${esc(t.desc)}</p></div><span></span>`;
    box.append(ph); queue.push([t, ph]);
  });
  const step = () => { if (token !== tToken || $('#p-templates').hidden || !queue.length) return; const [t, ph] = queue.shift(); ph.replaceWith(build(t)); setTimeout(step, 0); };
  setTimeout(step, 20);
  const bl = $('#tBlank'); bl.innerHTML = '';
  SIZES.forEach(g => {
    const b = document.createElement('button'); b.className = 'btn'; b.textContent = `${g}×${g}`;
    b.onclick = () => startFresh(`a blank ${g}×${g} canvas`, g, [blank(g)]);
    bl.append(b);
  });
  animateCards(cards);
}
