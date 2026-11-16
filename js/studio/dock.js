/* PIXTION · studio/dock.js — the phone timeline and tabbed tool sheet.
   Under the canvas, a timeline shows a little picture of every frame: tap one to edit it.
   At the bottom, a tool sheet with four tabs (Draw, Shapes, Colour, View) keeps every tool one tap
   away, in big buttons, with no sideways scrolling. Nothing is duplicated: tool keys use the normal
   data-tool wiring, and every other key "proxies" a click to the real button in the panels. */
import { $, $$ } from '../core/dom.js';

const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>';
const STOP = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>';

/** Colour tab: every colour in one grid, plus "+" for a custom colour. */
function buildPalette(){
  const box = $('#dockPal'); if (!box) return;
  const src = [...$$('#palette .sw'), ...$$('#paletteMore .sw'), ...$$('#paletteCustom .sw:not(.sw-add)')];
  const sig = src.map(b => b.dataset.c + b.style.background + (b.getAttribute('aria-pressed') === 'true' ? '*' : '')).join(',');
  if (box.dataset.sig !== sig){
    box.dataset.sig = sig; box.innerHTML = '';
    src.forEach(b => {
      const d = document.createElement('button');
      d.type = 'button'; d.className = 'dsw'; d.style.background = b.style.background;
      d.setAttribute('aria-label', b.getAttribute('aria-label') || 'Colour');
      d.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true');
      d.onclick = () => b.click();
      box.append(d);
    });
    const add = document.createElement('button');
    add.type = 'button'; add.className = 'dsw dsw-add'; add.textContent = '+'; add.setAttribute('aria-label', 'Add a custom colour');
    add.onclick = () => { const a = $('#paletteCustom .sw-add'); if (a) a.click(); };
    box.append(add);
  }
  const sel = src.find(b => b.getAttribute('aria-pressed') === 'true');
  $('#msChip').style.background = sel ? sel.style.background : 'transparent';
}

/** Timeline: a small picture of each frame, copied from the real frame strip. */
function buildFrames(playingFrame){
  const box = $('#mtlFrames'); if (!box) return;
  const thumbs = $$('#strip .thumb');
  while (box.children.length > thumbs.length) box.lastChild.remove();
  thumbs.forEach((t, i) => {
    let b = box.children[i];
    if (!b){
      b = document.createElement('button'); b.type = 'button'; b.className = 'mtl-f';
      b.innerHTML = '<canvas width="40" height="40"></canvas><i></i>';
      b.onclick = () => { const real = $$('#strip .thumb')[i]; if (real) real.click(); };
      box.append(b);
    }
    b.querySelector('i').textContent = i + 1;
    b.setAttribute('aria-label', `Frame ${i + 1}`);
    const on = playingFrame >= 0 ? i === playingFrame : t.getAttribute('aria-pressed') === 'true';
    b.setAttribute('aria-pressed', on);
    const src = t.querySelector('canvas'), c = b.querySelector('canvas'), x = c.getContext('2d');
    x.imageSmoothingEnabled = false; x.clearRect(0, 0, 40, 40);
    if (src && src.width) x.drawImage(src, 0, 0, 40, 40);
  });
  const on = box.querySelector('[aria-pressed="true"]');
  if (on) on.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

function sync(){
  const playing = ($('#playBtn span')?.textContent || '').trim() === 'Stop';
  const copy = (a, b) => { const A = $(a), B = $(b); if (A && B){ B.disabled = A.disabled; if (A.hasAttribute('aria-pressed')) B.setAttribute('aria-pressed', A.getAttribute('aria-pressed')); } };
  copy('#undoBtn', '#dkUndo'); copy('#redoBtn', '#dkRedo'); copy('#mirrorBtn', '#dkMirror'); copy('#onionBtn', '#dkOnion'); copy('#loopBtn', '#dkLoop');
  $$('[data-dkbrush]').forEach(b => b.setAttribute('aria-pressed', $(`[data-brush="${b.dataset.dkbrush}"]`)?.getAttribute('aria-pressed') === 'true'));
  $$('[data-dkzoom]').forEach(b => b.setAttribute('aria-pressed', $(`[data-zoom="${b.dataset.dkzoom}"]`)?.getAttribute('aria-pressed') === 'true'));
  const thumbs = $$('#strip .thumb'), cur = thumbs.findIndex(t => t.getAttribute('aria-pressed') === 'true');
  const want = `${Math.max(1, cur + 1)} / ${Math.max(1, thumbs.length)}`;
  if (!playing && $('#mfLabel').textContent !== want) $('#mfLabel').textContent = want;
  const shown = playing ? parseInt($('#mfLabel').textContent, 10) - 1 : -1;
  $('#mfPlay').innerHTML = playing ? STOP : PLAY;
  $('#mfPlay').setAttribute('aria-label', playing ? 'Stop' : 'Play');
  $('#mfDel').disabled = $('#fDel').disabled;
  buildPalette(); buildFrames(shown);
}

function openSheet(name){
  $$('.ms-tab').forEach(t => t.setAttribute('aria-selected', t.dataset.sheet === name));
  $$('.ms-panel').forEach(p => { p.hidden = p.dataset.panel !== name; });
  try { sessionStorage.setItem('pxSheet', name); } catch {}
}

/** Runs once at start-up, after the palette, tools and frames are wired. */
export function init(){
  document.addEventListener('click', e => {
    const p = e.target.closest('[data-proxy]'); if (!p || p.disabled) return;
    const real = $(p.dataset.proxy); if (real && !real.disabled) real.click();
  });
  $$('.ms-tab').forEach(t => t.addEventListener('click', () => openSheet(t.dataset.sheet)));
  let last = 'draw'; try { last = sessionStorage.getItem('pxSheet') || 'draw'; } catch {}
  openSheet(last);

  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; sync(); }); };
  const mo = new MutationObserver(later);
  ['#undoBtn', '#redoBtn', '#mirrorBtn', '#onionBtn', '#loopBtn', '#palette', '#paletteMore', '#paletteCustom', '#strip', '#playBtn', '#fDel', '#mfLabel', '[data-o=tools]', '[data-o=zoom]'].forEach(sel => {
    const el = $(sel); if (el) mo.observe(el, { attributes: true, childList: true, subtree: true, characterData: true });
  });
  sync();
}
