/* PIXTION · views/player.js — the player dialog: playback, details, duplicate, delete and exports. */
import { app } from '../shared.js';
import { dec } from '../core/codec.js';
import { $, $$, ask, esc, fmtDate, plural, toast, uid } from '../core/dom.js';
import { IAB } from '../core/env.js';
import { seqOf } from '../core/frames.js';
import { colorName, fullPalette } from '../core/palette.js';
import { paintFrame, palette32 } from '../core/render.js';
import { canVideo } from '../export/video.js';
import { S, saveDraft, saveGallery } from '../state.js';
import { openInStudio } from '../studio/save.js';
import { stopGalleryAnim } from './cards.js';
import { closeExport, exportFrames, exportGif, exportPng, exportSheet, exportVideo } from './export-sheet.js';
import { renderGallery } from './gallery.js';
import { tab } from './nav.js';

const P = {item: null, pal: null, frames: [], seq: [0], k: 0, i: 0, playing: false, fps: 8, t: null};

let plCanvas;

function plDraw(){ paintFrame(plCanvas, P.frames[P.i], P.item.grid, Math.ceil(320 / P.item.grid), P.pal); $('#plFrame').textContent = `Frame ${P.i + 1} / ${P.frames.length}`; }

function plSetPlay(on){
  P.playing = on; clearInterval(P.t);
  $('#plPlay').innerHTML = on
    ? '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>Pause'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M7 4l13 8-13 8z"/></svg>Play';
  if (on) P.t = setInterval(() => { P.k = (P.k + 1) % P.seq.length; P.i = P.seq[P.k]; plDraw(); }, 1000 / P.fps);
}

export function openPlayer(id){
  const item = app.gallery.find(x => x.id === id); if (!item) return;
  stopGalleryAnim();
  P.item = item; P.pal = palette32(item.custom); P.frames = item.frames.map(dec); P.seq = seqOf(P.frames.length, item.pingpong); P.k = 0; P.i = 0; P.fps = item.fps;
  $('#plTitle').textContent = item.title;
  $('#plInfo').textContent = `${item.grid}×${item.grid} · ${plural(P.frames.length, 'frame')}`;
  $('#plDesc').textContent = item.desc || ''; $('#plDesc').hidden = !item.desc;
  const used = new Set(); P.frames.forEach(f => f.forEach(v => v && used.add(v)));
  $('#plDetails').innerHTML = `<dt>Artist</dt><dd>${esc(item.artist || (app.profile ? app.profile.name : '') || '—')}</dd>
    <dt>Size</dt><dd>${item.grid}×${item.grid} pixels</dd>
    <dt>Frames</dt><dd>${P.frames.length}${item.pingpong ? ' · ping-pong loop' : ''}</dd>
    <dt>Speed</dt><dd>${item.fps} fps · ${(P.seq.length / item.fps).toFixed(1)} s per loop</dd>
    <dt>Colours</dt><dd><span class="swatchrow" id="plSwatches"></span></dd>
    <dt>Created</dt><dd>${fmtDate(item.created)}</dd>
    <dt>Updated</dt><dd>${fmtDate(item.updated)}</dd>`;
  const sw = $('#plSwatches'), hexes = fullPalette(item.custom);
  [...used].sort((a, b) => a - b).forEach(v => { const i = document.createElement('i'); i.style.setProperty('--sw', hexes[v] || '#ffffff'); i.title = colorName(v); sw.append(i); });
  $('#plFps').value = P.fps; $('#plFpsOut').textContent = P.fps + ' fps';
  $$('.iab').forEach(b => b.hidden = !IAB);
  $('#plVid').disabled = !canVideo(); $('#plVid').title = canVideo() ? '' : 'This browser can’t record video. Use GIF.';
  $('#player').hidden = false; plDraw(); plSetPlay(P.frames.length > 1);
}

export function closePlayer(silent){ clearInterval(P.t); P.playing = false; $('#player').hidden = true; if (!silent && tab === 'gallery' && !$('#v-main').hidden) renderGallery(); }

/** Runs once at start-up, in the original order. */
export function init() {
  plCanvas = $('#plCanvas');

  $('#plClose').onclick = () => closePlayer();

  $('#player').addEventListener('click', e => { if (e.target.id === 'player') closePlayer(); });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!$('#exportSheet').hidden) closeExport();
    else if (!$('#saveDlg').hidden) $('#saveDlg').hidden = true;
    else if (!$('#player').hidden) closePlayer();
  });

  $('#plPlay').onclick = () => plSetPlay(!P.playing);

  $('#plFps').addEventListener('input', e => { P.fps = Number(e.target.value); $('#plFpsOut').textContent = P.fps + ' fps'; if (P.playing) plSetPlay(true); });

  $('#plEdit').onclick = () => openInStudio(P.item);

  $('#plClose2').onclick = () => closePlayer();

  $('#plDup').onclick = () => {
    const it = P.item, now = Date.now();
    const copy = Object.assign({}, it, {id: uid(), title: (it.title + ' copy').slice(0, 40), example: false, created: now, updated: now});
    app.gallery.unshift(copy);
    if (saveGallery()){ toast(`Made “${copy.title}”`); closePlayer(); }
  };

  $('#plDel').onclick = async () => {
    const it = P.item;
    if (!await ask({title: `Delete “${it.title}”?`, body: 'It is removed from your Gallery on this device. Download it first if you want to keep a copy.', ok: 'Delete', danger: true})) return;
    app.gallery = app.gallery.filter(x => x.id !== it.id); saveGallery();
    if (S.editingId === it.id){ S.editingId = null; saveDraft(); }
    closePlayer(); toast('Deleted');
  };

  $('#plGif').onclick = () => exportGif(P.item, P.fps);

  $('#plVid').onclick = () => exportVideo(P.item, P.fps);

  $('#plPng').onclick = () => { if (P.playing) plSetPlay(false); exportPng(P.item, P.i, $('#plTransparent').checked); };

  $('#plSheet').onclick = () => exportSheet(P.item, $('#plTransparent').checked);

  $('#plFrames').onclick = () => { if (P.playing) plSetPlay(false); exportFrames(P.item, $('#plTransparent').checked); };
}
