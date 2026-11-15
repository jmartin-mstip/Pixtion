/* PIXTION · core/dom.js — small DOM and text helpers: $, $$, toast, confirm dialog, escaping, ids, dates. */

export function $(s) { return document.querySelector(s); }

export function $$(s) { return [...document.querySelectorAll(s)]; }

let toastT;

export function toast(msg){ const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 3200); }

export function ask({title, body, ok = 'OK', danger = false}){
  return new Promise(res => {
    const box = $('#confirm'); $('#cfTitle').textContent = title; $('#cfBody').textContent = body;
    const okB = $('#cfOk'); okB.textContent = ok; okB.className = 'btn ' + (danger ? 'pink' : 'orange');
    box.hidden = false; okB.focus();
    const done = v => { box.hidden = true; okB.onclick = null; $('#cfNo').onclick = null; res(v); };
    okB.onclick = () => done(true); $('#cfNo').onclick = () => done(false);
  });
}

export function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

export function slug(s) { return (s || 'pixtion').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'pixtion'; }

export function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }

export function esc(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

export function fmtDate(t) { return t ? new Date(t).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) : '—'; }
