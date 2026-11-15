/* PIXTION · state.js — studio state S, loading the saved draft and gallery, and saving them (IndexedDB with localStorage fallback). */
import { cleanGallery, cleanProfile, validFrames } from './core/sanitize.js';
import { app } from './shared.js';
import { dec, enc } from './core/codec.js';
import { $, toast } from './core/dom.js';
import { blank, validGrid } from './core/frames.js';
import { K, idb, store } from './core/storage.js';
import { exampleItem } from './templates/catalog.js';
import { setTab, tab } from './views/nav.js';

export let settings;

export let S;

let draftT;

let useIDB;
let draftTouched;

export function saveDraft(){
  draftTouched = true; clearTimeout(draftT);
  draftT = setTimeout(() => {
    const d = {grid: S.grid, frames: S.frames.map(enc), cur: S.cur, fps: S.fps, title: S.title, desc: S.desc, pingpong: S.pingpong, editingId: S.editingId};
    if (useIDB) idb.set(K.draft, d).then(() => store.del(K.draft)).catch(() => store.set(K.draft, d)); else store.set(K.draft, d);
  }, 400);
}

export function saveGallery(){
  if (useIDB){
    idb.set(K.gallery, app.gallery).then(() => store.del(K.gallery)).catch(() => { useIDB = false; if (!store.set(K.gallery, app.gallery)) toast('Storage is full. Back up your art in Settings, then delete a few big pieces.'); });
    return true;
  }
  if (!store.set(K.gallery, app.gallery)){ toast('Storage is full. Back up your art in Settings, then delete a few big pieces.'); return false; }
  return true;
}

/** Runs once at start-up, in the original order. */
export function init() {
  app.profile = cleanProfile(store.get(K.profile, null));

  settings = Object.assign({grid: true, fps: 8}, store.get(K.settings, {}));

  app.gallery = cleanGallery(store.get(K.gallery, []));

  if (!Array.isArray(app.gallery)) app.gallery = [];

  if (!store.get(K.seeded, false) && app.gallery.length === 0){ app.gallery = [exampleItem()]; store.set(K.gallery, app.gallery); store.set(K.seeded, true); }

  S = {grid: 16, frames: [blank(16)], cur: 0, tool: 'pencil', color: 1, onion: false, mirror: false, pingpong: false, brush: 1, zoom: 1, fps: settings.fps, title: '', desc: '', editingId: null};

  (function loadDraft(){
    const d = store.get(K.draft, null);
    if (d && validGrid(d.grid) && validFrames(d.frames, d.grid)){
      S.grid = d.grid; S.frames = d.frames.map(dec); S.cur = Math.min(d.cur || 0, S.frames.length - 1);
      S.fps = d.fps || settings.fps; S.title = d.title || ''; S.desc = d.desc || ''; S.pingpong = !!d.pingpong; S.editingId = d.editingId || null;
      if (S.editingId && !app.gallery.some(x => x.id === S.editingId)) S.editingId = null;
    }
  })();

  useIDB = true;
  draftTouched = false;

  /* Load the IndexedDB copies once the page is up. */
  Promise.all([idb.get(K.gallery), idb.get(K.draft)]).then(([g, d]) => {
    if (Array.isArray(g)) app.gallery = cleanGallery(g);
    else if (app.gallery.length) idb.set(K.gallery, app.gallery).then(() => store.del(K.gallery)).catch(() => {});
    if (d && !draftTouched && validGrid(d.grid) && validFrames(d.frames, d.grid)){
      S.grid = d.grid; S.frames = d.frames.map(dec); S.cur = Math.min(d.cur || 0, S.frames.length - 1);
      S.fps = d.fps || settings.fps; S.title = d.title || ''; S.desc = d.desc || ''; S.pingpong = !!d.pingpong; S.editingId = d.editingId || null;
      if (S.editingId && !app.gallery.some(x => x.id === S.editingId)) S.editingId = null;
      draftTouched = false;
    }
    if (!$('#v-main').hidden) setTab(tab);
  }).catch(() => { useIDB = false; });
}
