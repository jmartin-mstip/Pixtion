/* PIXTION · views/export-sheet.js — the export sheet that previews and saves GIF, video and PNG files. */
import { $, slug } from '../core/dom.js';
import { offerFile } from '../core/downloads.js';
import { IAB } from '../core/env.js';
import { makeGif } from '../export/gif.js';
import { makeVideo } from '../export/video.js';

let exBlob = null;
let exName = '';
let exURL = null;

export function openExport(title){ $('#exTitle').textContent = title; $('#exBody').innerHTML = ''; $('#exHint').textContent = ''; $('#exSave').disabled = true; $('#exportSheet').hidden = false; }

export function closeExport(){ $('#exportSheet').hidden = true; if (exURL){ URL.revokeObjectURL(exURL); exURL = null; } exBlob = null; }

export function exReady(blob, name, html, hint){
  exBlob = blob; exName = name; exURL = URL.createObjectURL(blob);
  $('#exBody').innerHTML = html.replace('{url}', exURL);
  $('#exHint').textContent = hint; $('#exSave').disabled = false; $('#exSave').focus();
}

export function exportGif(item, fps){
  openExport('Making your GIF…');
  setTimeout(() => {
    try {
      const blob = makeGif(item, fps, Math.max(1, Math.floor(480 / item.grid)));
      $('#exTitle').textContent = 'Your GIF is ready';
      exReady(blob, slug(item.title) + '.gif', '<img class="expimg" src="{url}" alt="Animated GIF preview">',
        `${Math.max(1, Math.round(blob.size / 1024))} KB · loops forever. Tap Save file, or long-press the picture and choose Save image.` + (IAB ? ' In Messenger, open PIXTION in your browser first.' : ''));
    } catch { $('#exTitle').textContent = 'Couldn’t make the GIF'; $('#exHint').textContent = 'Something went wrong while building the file. Try again.'; }
  }, 30);
}

export async function exportVideo(item, fps){
  openExport('Recording your video…');
  $('#exHint').textContent = 'This takes a few seconds while the animation plays through.';
  try {
    const {blob, ext} = await makeVideo(item, fps);
    $('#exTitle').textContent = 'Your video is ready';
    exReady(blob, slug(item.title) + '.' + ext, '<video class="expimg" src="{url}" autoplay loop muted playsinline controls></video>',
      `${Math.max(1, Math.round(blob.size / 1024))} KB ${ext.toUpperCase()} video.` + (IAB ? ' In Messenger, open PIXTION in your browser first.' : ''));
  } catch { $('#exTitle').textContent = 'Video isn’t available here'; $('#exHint').textContent = 'This browser can’t record video. Download a GIF instead, or try Chrome.'; }
}

/** Runs once at start-up, in the original order. */
export function init() {
  $('#exClose').onclick = closeExport;

  $('#exSave').onclick = () => { if (exBlob) offerFile(exBlob, exName); };
}
