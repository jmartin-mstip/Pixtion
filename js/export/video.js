/* PIXTION · export/video.js — video export through MediaRecorder (MP4 or WebM). */
import { dec } from '../core/codec.js';
import { seqOf } from '../core/frames.js';
import { drawPixels, palette32 } from '../core/render.js';

function videoMime(){
  if (!window.MediaRecorder) return null;
  for (const m of ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']){
    try { if (MediaRecorder.isTypeSupported(m)) return m; } catch {}
  }
  return null;
}

export function canVideo() { return !!(videoMime() && HTMLCanvasElement.prototype.captureStream); }

export function makeVideo(item, fps){
  return new Promise((resolve, reject) => {
    const mime = videoMime(); if (!mime) return reject(new Error('unsupported'));
    const pal = palette32(item.custom), frames = item.frames.map(dec), g = item.grid, scale = Math.max(1, Math.floor(720 / g)), size = g * scale;
    const cv = document.createElement('canvas'); cv.width = size; cv.height = size;
    cv.style.cssText = 'position:fixed;left:-10000px;top:0;width:10px;height:10px';
    document.body.append(cv);
    const ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false;
    const draw = i => { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, size, size); drawPixels(ctx, frames[i], g, scale, 1, pal); };
    draw(0);
    let rec;
    try { rec = new MediaRecorder(cv.captureStream(30), {mimeType: mime, videoBitsPerSecond: 4e6}); } catch (e){ cv.remove(); return reject(e); }
    const chunks = [];
    rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    rec.onstop = () => { cv.remove(); resolve({blob: new Blob(chunks, {type: mime.split(';')[0]}), ext: mime.includes('mp4') ? 'mp4' : 'webm'}); };
    const seq = seqOf(frames.length, item.pingpong);
    const loopMs = seq.length * 1000 / fps;
    const total = Math.max(3000, Math.min(15000, Math.ceil(3000 / loopMs) * loopMs));
    rec.start(250);
    const t0 = performance.now();
    (function tick(){
      const t = performance.now() - t0;
      if (t >= total){ rec.stop(); return; }
      draw(seq[Math.floor(t / (1000 / fps)) % seq.length]);
      requestAnimationFrame(tick);
    })();
  });
}
