/* PIXTION · studio/playback.js — preview playback, speed, ping-pong and onion skin. */
import { $, toast } from '../core/dom.js';
import { seqOf } from '../core/frames.js';
import { S, saveDraft } from '../state.js';
import { drawBoard } from './board.js';
import { drawPreview, renderMeta } from './view.js';

export let playing = false;
let playT;
let playI = 0;

const PLAY_ICON = '<path d="M7 4l13 8-13 8z"/>';
const STOP_ICON = '<rect x="6" y="5" width="12" height="14"/>';

function startPlay(){
  playing = true; $('#playBtn span').textContent = 'Stop'; $('#playBtn svg').innerHTML = STOP_ICON;
  const seq = seqOf(S.frames.length, S.pingpong); playI = Math.max(0, seq.indexOf(S.cur));
  const show = () => { const f = seq[playI]; drawPreview(f); drawBoard(f); const l = $('#mfLabel'); if (l) l.textContent = `${f + 1} / ${S.frames.length}`; };
  clearInterval(playT); show(); playT = setInterval(() => { playI = (playI + 1) % seq.length; show(); }, 1000 / S.fps);
}

export function stopPlay(){
  if (!playing) return; playing = false; clearInterval(playT);
  $('#playBtn span').textContent = 'Play'; $('#playBtn svg').innerHTML = PLAY_ICON; drawPreview(); drawBoard();
  const l = $('#mfLabel'); if (l) l.textContent = `${S.cur + 1} / ${S.frames.length}`;
}

/** Runs once at start-up, in the original order. */
export function init() {
  $('#playBtn').onclick = () => {
    if (playing) return stopPlay();
    if (S.frames.length < 2) toast('Add more frames to see it move.');
    startPlay();
  };

  $('#fps').addEventListener('input', e => { S.fps = Number(e.target.value); $('#fpsOut').textContent = S.fps + ' fps'; if (playing){ stopPlay(); startPlay(); } saveDraft(); });

  $('#loopBtn').onclick = () => { S.pingpong = !S.pingpong; renderMeta(); saveDraft(); if (playing){ stopPlay(); startPlay(); } toast(S.pingpong ? 'Ping-pong on: plays forward, then backward.' : 'Normal loop: plays from the first frame again.'); };

  $('#onionBtn').onclick = () => { S.onion = !S.onion; renderMeta(); drawBoard(); if (S.onion && S.cur === 0) toast('Onion skin shows the frame before this one. Pick frame 2 or later.'); };
}
