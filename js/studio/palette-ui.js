/* PIXTION · studio/palette-ui.js — palette swatches and the More colours toggle. */
import { $, $$ } from '../core/dom.js';
import { BASE_COLOURS, NAMES, PAL } from '../core/palette.js';
import { S } from '../state.js';
import { setTool } from './tools.js';

export function buildPalette(){
  const p = $('#palette');
  if (!p.children.length){
    PAL.forEach((c, i) => {
      if (!i) return;
      const host = i > BASE_COLOURS ? $('#paletteMore') : p;
      const b = document.createElement('button'); b.className = 'sw'; b.style.background = c;
      b.setAttribute('aria-label', NAMES[i]); b.title = NAMES[i]; b.dataset.c = i;
      b.onclick = () => { selColor(i); if (S.tool === 'eraser' || S.tool === 'pan' || S.tool === 'picker') setTool('pencil'); };
      host.append(b);
    });
  }
  selColor(S.color);
}

export function selColor(i){ S.color = i; if (i > BASE_COLOURS) showMore(true); $$('.palette .sw').forEach(b => b.setAttribute('aria-pressed', Number(b.dataset.c) === i)); $('#inkName').textContent = NAMES[i]; }

function showMore(on){ $('#paletteMore').hidden = !on; $('#moreColours').setAttribute('aria-expanded', on); $('#moreColours').textContent = on ? 'Fewer colours ▴' : `More colours (${PAL.length - 1 - BASE_COLOURS}) ▾`; }

/** Runs once at start-up, in the original order. */
export function init() {
  $('#moreColours').onclick = () => showMore($('#paletteMore').hidden);
}
