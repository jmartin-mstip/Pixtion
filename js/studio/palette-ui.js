/* PIXTION · studio/palette-ui.js — palette swatches, More colours, and the artwork's custom colours. */
import { $, $$ } from '../core/dom.js';
import { BASE_COLOURS, CUSTOM_MAX, CUSTOM_START, PAL, colorName } from '../core/palette.js';
import { setActiveCustom } from '../core/render.js';
import { S } from '../state.js';
import { setTool } from './tools.js';
import { openWheel } from './colour-wheel.js';

function pick(i){ selColor(i); if (S.tool === 'eraser' || S.tool === 'pan' || S.tool === 'picker') setTool('pencil'); }

function swatch(colour, i){
  const b = document.createElement('button'); b.className = 'sw'; b.type = 'button'; b.style.background = colour;
  b.setAttribute('aria-label', colorName(i)); b.title = colorName(i); b.dataset.c = i;
  b.onclick = () => pick(i);
  return b;
}

export function buildPalette(){
  const p = $('#palette');
  if (!p.children.length) PAL.forEach((c, i) => { if (i) (i > BASE_COLOURS ? $('#paletteMore') : p).append(swatch(c, i)); });
  renderCustom();
  selColor(S.color);
}

/** Draws the custom colour swatches and the "+" button. */
export function renderCustom(){
  const box = $('#paletteCustom'); box.innerHTML = '';
  S.custom.forEach((c, k) => box.append(swatch(c, CUSTOM_START + k)));
  if (S.custom.length < CUSTOM_MAX){
    const add = document.createElement('button'); add.type = 'button'; add.className = 'sw sw-add';
    add.textContent = '+'; add.title = 'Add a custom colour'; add.setAttribute('aria-label', 'Add a custom colour');
    add.onclick = () => openWheel(null);
    box.append(add);
  }
  $('#customCount').textContent = `${S.custom.length} / ${CUSTOM_MAX}`;
}

/** Call after S.custom changes (added, edited, removed, undone or a new artwork opened). */
export function customChanged(){
  setActiveCustom(S.custom);
  if (S.color >= CUSTOM_START + S.custom.length) S.color = 1;
  if ($('#palette').children.length){ renderCustom(); selColor(S.color); }
}

export function selColor(i){
  S.color = i;
  if (i > BASE_COLOURS) showMore(true);
  $$('.palette .sw').forEach(b => b.setAttribute('aria-pressed', Number(b.dataset.c) === i));
  $('#inkName').textContent = colorName(i);
  $('#editColour').hidden = !(i >= CUSTOM_START && i < CUSTOM_START + S.custom.length);
}

function showMore(on){
  $('#paletteMore').hidden = !on; $('#customWrap').hidden = !on;
  $('#moreColours').setAttribute('aria-expanded', on);
  $('#moreColours').textContent = on ? 'Fewer colours ▴' : `More colours (${PAL.length - 1 - BASE_COLOURS}) + custom ▾`;
}

/** Runs once at start-up. */
export function init(){
  $('#moreColours').onclick = () => showMore($('#paletteMore').hidden);
  $('#editColour').onclick = () => openWheel(S.color - CUSTOM_START);
}
