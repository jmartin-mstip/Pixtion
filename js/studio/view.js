/* PIXTION · studio/view.js — studio rendering: frame strip, preview and status text. */
import { app } from '../shared.js';
import { $, $$, plural } from '../core/dom.js';
import { seqOf } from '../core/frames.js';
import { paintFrame } from '../core/render.js';
import { storageOK } from '../core/storage.js';
import { S, saveDraft } from '../state.js';
import { drawBoard } from './board.js';
import { updUndo } from './history.js';
import { buildPalette } from './palette-ui.js';
import { playing } from './playback.js';

let pv;

function drawStrip(){
  const strip = $('#strip'); strip.innerHTML = '';
  S.frames.forEach((f, i) => {
    const b = document.createElement('button'); b.className = 'thumb'; b.setAttribute('aria-pressed', i === S.cur);
    b.setAttribute('aria-label', 'Frame ' + (i + 1));
    const c = document.createElement('canvas'); paintFrame(c, f, S.grid, Math.ceil(120 / S.grid));
    const s = document.createElement('span'); s.textContent = 'FRAME ' + (i + 1);
    b.append(c, s); b.onclick = () => { S.cur = i; changed(); };
    strip.append(b);
  });
  const sel = strip.children[S.cur];
  if (sel) strip.scrollLeft = Math.max(0, sel.offsetLeft - strip.clientWidth / 2 + sel.clientWidth / 2);
}

export function drawPreview(i = S.cur){ paintFrame(pv, S.frames[i] || S.frames[0], S.grid, Math.ceil(320 / S.grid)); }

export function renderMeta(){
  const n = S.frames.length;
  $('#badge').textContent = `${S.grid}×${S.grid} · ${plural(n, 'frame')}`;
  $('#fDel').disabled = n < 2; $('#fPrev').disabled = S.cur === 0; $('#fNext').disabled = S.cur === n - 1;
  $$('[data-size]').forEach(b => b.setAttribute('aria-pressed', Number(b.dataset.size) === S.grid));
  const editing = S.editingId && app.gallery.find(x => x.id === S.editingId);
  $('#saveNote').textContent = editing ? `Editing “${editing.title}”` : (storageOK ? 'Your work in progress is kept on this device.' : 'This browser blocks storage. Open PIXTION in Chrome or Safari to keep your work.');
  $('#wbTitle').textContent = editing ? editing.title : 'Draw it frame by frame.';
  $('#fps').value = S.fps; $('#fpsOut').textContent = S.fps + ' fps';
  $('#onionBtn').setAttribute('aria-pressed', S.onion);
  $('#loopBtn').setAttribute('aria-pressed', S.pingpong);
  $('#mirrorBtn').setAttribute('aria-pressed', S.mirror);
  $('#pvInfo').textContent = `${plural(n, 'frame')} at ${S.fps} fps · ${(seqOf(n, S.pingpong).length / S.fps).toFixed(1)} s per loop`;
}

export function changed(){ drawBoard(); drawStrip(); if (!playing) drawPreview(); renderMeta(); saveDraft(); }

export function renderStudio(){ buildPalette(); changed(); updUndo(); }

/** Runs once at start-up, in the original order. */
export function init() {
  pv = $('#pv');
}
