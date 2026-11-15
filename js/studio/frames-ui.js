/* PIXTION · studio/frames-ui.js — frame strip actions, transform buttons and grid size. */
import { $, $$, ask, toast } from '../core/dom.js';
import { blank, resize, transform, validGrid } from '../core/frames.js';
import { S } from '../state.js';
import { pushUndo } from './history.js';
import { changed } from './view.js';

async function setGridSize(to){
  const from = S.grid; if (to === from) return;
  const hasArt = S.frames.some(f => f.some(Boolean));
  if (to < from && hasArt && !await ask({title: `Shrink to ${to}×${to}?`, body: 'Your drawing stays in the centre and pixels near the edges are trimmed. You can Undo this.', ok: 'Shrink grid'})) return;
  pushUndo(); S.frames = S.frames.map(f => resize(f, from, to)); S.grid = to; changed();
  if (to >= 128) toast(`${to}×${to} is huge! Zoom in to 8× or 16× and use a bigger brush.`); else if (to >= 48 && S.zoom === 1) toast('Big grid! Try Zoom 2× and a bigger brush.');
}

/** Runs once at start-up, in the original order. */
export function init() {
  $$('[data-tf]').forEach(b => b.onclick = () => {
    const all = $('#tfAll').checked;
    pushUndo(); S.frames = S.frames.map((f, i) => (all || i === S.cur) ? transform(f, b.dataset.tf, S.grid) : f); changed();
  });

  $('#fPrev').onclick = () => { if (S.cur > 0){ S.cur--; changed(); } };

  $('#fNext').onclick = () => { if (S.cur < S.frames.length - 1){ S.cur++; changed(); } };

  $('#fAdd').onclick = () => { pushUndo(); S.frames.splice(S.cur + 1, 0, blank(S.grid)); S.cur++; changed(); };

  $('#fDup').onclick = () => { pushUndo(); S.frames.splice(S.cur + 1, 0, S.frames[S.cur].slice()); S.cur++; changed(); toast('Frame duplicated'); };

  $('#fRev').onclick = () => { if (S.frames.length < 2){ toast('Add more frames first.'); return; } pushUndo(); S.frames.reverse(); S.cur = S.frames.length - 1 - S.cur; changed(); toast('Frames reversed. Your animation now plays backwards.'); };

  $('#fDel').onclick = () => { if (S.frames.length < 2) return; pushUndo(); S.frames.splice(S.cur, 1); S.cur = Math.max(0, S.cur - 1); changed(); toast('Frame deleted. Undo brings it back.'); };

  $('#fClear').onclick = async () => {
    if (!S.frames[S.cur].some(Boolean)){ toast('This frame is already empty.'); return; }
    if (!await ask({title: `Clear frame ${S.cur + 1}?`, body: 'Every pixel in this frame is erased. You can still Undo afterwards.', ok: 'Clear frame', danger: true})) return;
    pushUndo(); S.frames[S.cur] = blank(S.grid); changed();
  };

  $$('[data-size]').forEach(b => b.onclick = () => setGridSize(Number(b.dataset.size)));

  $('#customSizeBtn').onclick = () => {
    const v = Number($('#customSize').value);
    if (!validGrid(v)){ toast('Type a whole number from 4 to 512.'); return; }
    setGridSize(v); $('#customSize').value = '';
  };

  $('#customSize').addEventListener('keydown', e => { if (e.key === 'Enter') $('#customSizeBtn').click(); });
}
