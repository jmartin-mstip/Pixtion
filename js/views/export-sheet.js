/* PIXTION · views/export-sheet.js — the export sheet that previews and saves GIF, video and PNG files. */
import { $, slug } from '../core/dom.js';
import { offerFile } from '../core/downloads.js';
import { IAB } from '../core/env.js';
import { makeGif } from '../export/gif.js';
import { makeVideo } from '../export/video.js';
import { dec } from '../core/codec.js';
import { plural } from '../core/dom.js';
import { drawPixels, paintFrame, palette32 } from '../core/render.js';
import { makeZip } from '../export/zip.js';

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

/* ---------- PNG, sprite sheet and all frames ---------- */
function frameCanvas(f, g, scale, pal, transparent){
  const cv = document.createElement('canvas');
  if (transparent){ cv.width = cv.height = g * scale; drawPixels(cv.getContext('2d'), f, g, scale, 1, pal); }
  else paintFrame(cv, f, g, scale, pal);
  return cv;
}
const toPng = cv => new Promise(res => cv.toBlob(res, 'image/png'));
function failed(what){ $('#exTitle').textContent = `Couldn’t make the ${what}`; $('#exHint').textContent = 'Something went wrong while building the file. Try again.'; }

export async function exportPng(item, i, transparent){
  const g = item.grid, scale = Math.max(1, Math.floor(480 / g)), pal = palette32(item.custom);
  openExport('Making your PNG…');
  const blob = await toPng(frameCanvas(dec(item.frames[i]), g, scale, pal, transparent));
  if (!blob) return failed('PNG');
  $('#exTitle').textContent = `Frame ${i + 1} as PNG`;
  exReady(blob, `${slug(item.title)}-frame-${i + 1}.png`, '<img class="expimg" src="{url}" alt="PNG preview">',
    `${g * scale}×${g * scale} px picture of frame ${i + 1}.`);
}

export async function exportSheet(item, transparent){
  const g = item.grid, n = item.frames.length, scale = Math.max(1, Math.floor(256 / g)), W = g * scale, pal = palette32(item.custom);
  openExport('Making your sprite sheet…');
  const cols = Math.min(n, Math.max(1, Math.floor(8192 / W))), rows = Math.ceil(n / cols);
  const cv = document.createElement('canvas'); cv.width = W * cols; cv.height = W * rows;
  const ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false;
  if (!transparent){ ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cv.width, cv.height); }
  item.frames.forEach((f, i) => { ctx.save(); ctx.translate((i % cols) * W, Math.floor(i / cols) * W); drawPixels(ctx, dec(f), g, scale, 1, pal); ctx.restore(); });
  const blob = await toPng(cv);
  if (!blob) return failed('sprite sheet');
  $('#exTitle').textContent = 'Your sprite sheet is ready';
  exReady(blob, `${slug(item.title)}-sprite-sheet.png`, '<img class="expimg u-maxw100" src="{url}" alt="Sprite sheet preview">',
    `${n} frames${rows > 1 ? ` in ${rows} rows` : ' side by side'}, each ${W}×${W} px. Game makers like Scratch, Godot and Unity can cut it back into frames.`);
}

/** Every frame as its own PNG picture, packed into one ZIP file. */
export async function exportFrames(item, transparent){
  const g = item.grid, n = item.frames.length, scale = Math.max(1, Math.floor(480 / g)), pal = palette32(item.custom);
  const base = slug(item.title), pad = Math.max(2, String(n).length);
  openExport('Making your frames…');
  try {
    const files = [];
    for (let i = 0; i < n; i++){
      $('#exHint').textContent = `Picture ${i + 1} of ${n}…`;
      const blob = await toPng(frameCanvas(dec(item.frames[i]), g, scale, pal, transparent));
      files.push({name: `${base}-frame-${String(i + 1).padStart(pad, '0')}.png`, data: new Uint8Array(await blob.arrayBuffer())});
    }
    const zip = makeZip(files);
    $('#exTitle').textContent = `${plural(n, 'frame')} ready`;
    exReady(zip, `${base}-frames.zip`, '<div class="frame-grid" id="exFrames"></div>',
      `${plural(n, 'PNG picture')}, each ${g * scale}×${g * scale} px, in one ZIP file (${Math.max(1, Math.round(zip.size / 1024))} KB). Open the ZIP to get every frame as its own image.`);
    const box = $('#exFrames'), tScale = Math.max(1, Math.ceil(64 / g));
    item.frames.slice(0, 24).forEach((f, i) => { const c = frameCanvas(dec(f), g, tScale, pal, false); c.title = 'Frame ' + (i + 1); box.append(c); });
    if (n > 24){ const more = document.createElement('span'); more.className = 'meta'; more.textContent = `+${n - 24} more`; box.append(more); }
  } catch { failed('frames'); }
}

/** Runs once at start-up, in the original order. */
export function init() {
  $('#exClose').onclick = closeExport;

  $('#exSave').onclick = () => { if (exBlob) offerFile(exBlob, exName); };
}
