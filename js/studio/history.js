/* PIXTION · studio/history.js — undo and redo. */
import { customChanged } from './palette-ui.js';
import { app } from '../shared.js';
import { $ } from '../core/dom.js';
import { S } from '../state.js';
import { changed } from './view.js';

function snap() { return {frames: S.frames.map(f => f.slice()), custom: S.custom.slice(), cur: S.cur, grid: S.grid}; }

function undoLimit() { return Math.max(6, Math.min(60, Math.floor(24e6 / (S.grid * S.grid * S.frames.length)))); }

export function pushUndo(){ app.undo.push(snap()); while (app.undo.length > undoLimit()) app.undo.shift(); app.redo = []; updUndo(); }

function restore(s){
  S.frames = s.frames; S.cur = s.cur; S.grid = s.grid;
  if (s.custom && s.custom.join() !== S.custom.join()){ S.custom = s.custom; customChanged(); }
  changed();
}

export function updUndo(){ $('#undoBtn').disabled = !app.undo.length; $('#redoBtn').disabled = !app.redo.length; }

/** Runs once at start-up, in the original order. */
export function init() {
  app.undo = [];
  app.redo = [];

  $('#undoBtn').onclick = () => { if (!app.undo.length) return; app.redo.push(snap()); restore(app.undo.pop()); updUndo(); };

  $('#redoBtn').onclick = () => { if (!app.redo.length) return; app.undo.push(snap()); restore(app.redo.pop()); updUndo(); };
}
