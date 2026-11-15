/* PIXTION · studio/export-ui.js — export straight from the Studio, without saving to the Gallery first. */
import { enc } from '../core/codec.js';
import { $, toast } from '../core/dom.js';
import { canVideo } from '../export/video.js';
import { S } from '../state.js';
import { stopPlay } from './playback.js';
import { exportFrames, exportGif, exportPng, exportSheet, exportVideo } from '../views/export-sheet.js';

/** The current Studio work, shaped like a saved artwork. */
function current(){
  return {title: S.title || 'pixtion', grid: S.grid, frames: S.frames.map(enc), fps: S.fps, pingpong: S.pingpong, custom: S.custom.slice()};
}

function guard(fn){
  return () => {
    if (!S.frames.some(f => f.some(Boolean))){ toast('Draw something first, then export.'); return; }
    stopPlay(); fn(current(), $('#sxTransparent').checked);
  };
}

/** Runs once at start-up. */
export function init(){
  $('#sxGif').onclick = guard(item => exportGif(item, item.fps));
  $('#sxVid').onclick = guard(item => exportVideo(item, item.fps));
  $('#sxPng').onclick = guard((item, t) => exportPng(item, S.cur, t));
  $('#sxFrames').onclick = guard((item, t) => exportFrames(item, t));
  $('#sxSheet').onclick = guard((item, t) => exportSheet(item, t));
  if (!canVideo()){ $('#sxVid').disabled = true; $('#sxVid').title = 'This browser can’t record video. Use GIF.'; }
}
