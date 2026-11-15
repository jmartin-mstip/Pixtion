/* PIXTION · core/downloads.js — saving files to the device (artifact downloads capability or a normal download link). */
import { toast } from './dom.js';
import { IAB } from './env.js';

let dlReady;

export async function offerFile(blob, filename){
  let dl = null;
  try { dl = await Promise.race([dlReady, new Promise(r => setTimeout(() => r(null), 1500))]); } catch {}
  if (dl){
    try { await dl.save({filename, data: blob}); toast('Saved ' + filename); return; }
    catch (e){
      const c = e && e.code;
      if (c === 'declined'){ toast('Download cancelled'); return; }
      if (c === 'rate_limited'){ toast('Wait a moment, then try again.'); return; }
      if (c === 'too_large'){ toast('That file is too big. Try fewer frames.'); return; }
    }
  }
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    toast(IAB ? 'If nothing downloads, open PIXTION in your browser.' : 'Download started. If nothing happens, long-press the preview to save it.');
  } catch { toast('This browser blocked the download. Long-press the preview to save it.'); }
}

/** Runs once at start-up, in the original order. */
export function init() {
  dlReady = (window.claude && typeof window.claude.use === 'function')
    ? Promise.resolve(window.claude.use('downloads')).catch(() => null) : Promise.resolve(null);
}
