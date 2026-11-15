/* PIXTION · studio/save.js — the save dialog, new art and opening saved art in the studio. */
import { customChanged } from './palette-ui.js';
import { app } from '../shared.js';
import { dec, enc } from '../core/codec.js';
import { $, ask, plural, toast, uid } from '../core/dom.js';
import { blank } from '../core/frames.js';
import { S, saveGallery, settings } from '../state.js';
import { pushUndo } from './history.js';
import { stopPlay } from './playback.js';
import { changed } from './view.js';
import { go, setTab } from '../views/nav.js';
import { closePlayer } from '../views/player.js';

function doSave(asNew){
  const now = Date.now();
  const title = $('#sdTitle').value.trim() || `Untitled #${app.gallery.length + 1}`;
  const desc = $('#sdDesc').value.trim();
  const data = {title, desc, grid: S.grid, fps: S.fps, pingpong: S.pingpong, frames: S.frames.map(enc), custom: S.custom.slice(), artist: app.profile ? app.profile.name : '', updated: now};
  S.desc = desc;
  const existing = !asNew && S.editingId && app.gallery.find(x => x.id === S.editingId);
  if (existing){ Object.assign(existing, data); delete existing.example; app.gallery = [existing, ...app.gallery.filter(x => x !== existing)]; }
  else { const item = Object.assign({id: uid(), created: now}, data); app.gallery.unshift(item); S.editingId = item.id; }
  S.title = title; $('#saveDlg').hidden = true;
  if (saveGallery()) toast(existing ? `Updated “${title}” in your Gallery` : `Saved “${title}” to your Gallery`);
  changed();
}

export function openInStudio(item){
  stopPlay();
  S.grid = item.grid; S.frames = item.frames.map(dec); S.custom = (item.custom || []).slice(); customChanged(); S.cur = 0; S.fps = item.fps; S.title = item.title; S.desc = item.desc || ''; S.pingpong = !!item.pingpong; S.editingId = item.id;
  app.undo = []; app.redo = []; closePlayer(true); go('main'); setTab('studio'); toast(`Opened “${item.title}”`);
}

/** Runs once at start-up, in the original order. */
export function init() {
  $('#saveBtn').onclick = () => {
    if (!S.frames.some(f => f.some(Boolean))){ toast('Draw something first, then save.'); return; }
    const editing = S.editingId && app.gallery.find(x => x.id === S.editingId);
    $('#sdHead').textContent = editing ? 'Update your artwork' : 'Name your artwork';
    $('#sdTitle').value = S.title || (editing ? editing.title : '');
    $('#sdDesc').value = S.desc || (editing ? editing.desc || '' : '');
    $('#sdSave').textContent = editing ? 'Update in Gallery' : 'Save to Gallery';
    $('#sdCopy').hidden = !editing;
    $('#sdNote').textContent = `${S.grid}×${S.grid} · ${plural(S.frames.length, 'frame')} · ${S.fps} fps`;
    $('#saveDlg').hidden = false; $('#sdTitle').focus();
  };

  $('#saveForm').addEventListener('submit', e => { e.preventDefault(); doSave(false); });

  $('#sdCopy').onclick = () => doSave(true);

  $('#sdCancel').onclick = () => $('#saveDlg').hidden = true;

  $('#newBtn').onclick = async () => {
    const has = S.frames.some(f => f.some(Boolean));
    const saved = S.editingId && app.gallery.some(x => x.id === S.editingId);
    if (has && !saved && !await ask({title: 'Start a new piece?', body: 'Your current drawing isn’t saved to the Gallery yet. Starting fresh clears it from the Studio.', ok: 'Start new', danger: true})) return;
    pushUndo(); S.frames = [blank(S.grid)]; S.cur = 0; S.title = ''; S.desc = ''; S.pingpong = false; S.editingId = null; S.fps = settings.fps; changed();
  };
}
