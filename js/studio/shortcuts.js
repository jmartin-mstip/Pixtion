/* PIXTION · studio/shortcuts.js — keyboard shortcuts for the studio. */
import { $ } from '../core/dom.js';
import { setTool } from './tools.js';

/** Runs once at start-up, in the original order. */
export function init() {
  document.addEventListener('keydown', e => {
    if ($('#p-studio').hidden || $('#v-main').hidden || e.target.matches('input')) return;
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === 'z'){ e.preventDefault(); (e.shiftKey ? $('#redoBtn') : $('#undoBtn')).click(); }
    if ((e.ctrlKey || e.metaKey) && k === 'y'){ e.preventDefault(); $('#redoBtn').click(); }
    if (e.ctrlKey || e.metaKey || e.altKey || !$('#player').hidden || !$('#saveDlg').hidden || !$('#confirm').hidden) return;
    const tools = {b: 'pencil', p: 'pencil', e: 'eraser', g: 'fill', i: 'picker', l: 'line', r: 'rect', c: 'circle', s: 'spray', t: 'text', h: 'pan'};
    if (tools[k]){ setTool(tools[k]); return; }
    if (k === 'm') $('#mirrorBtn').click();
    if (k === 'o') $('#onionBtn').click();
    if (k === ',' || k === '[') $('#fPrev').click();
    if (k === '.' || k === ']') $('#fNext').click();
    if (k === 'n') $('#fAdd').click();
    if (k === 'd') $('#fDup').click();
    if (k === ' '){ e.preventDefault(); $('#playBtn').click(); }
    const bk = {'1': 1, '2': 2, '3': 4, '4': 8, '5': 16}[k]; if (bk) $(`[data-brush="${bk}"]`).click();
  });
}
