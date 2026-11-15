/* PIXTION · studio/colour-wheel.js — the custom colour picker: a colour wheel (hue around the ring,
   strength towards the edge), a brightness slider, a hex code box, and a colour roulette spin. */
import { $, toast } from '../core/dom.js';
import { hexToRgb, hsvToRgb, rgbToHex, rgbToHsv } from '../core/color.js';
import { CUSTOM_MAX, CUSTOM_START, HEX, fullPalette } from '../core/palette.js';
import { S } from '../state.js';
import { pushUndo } from './history.js';
import { customChanged, selColor } from './palette-ui.js';
import { changed } from './view.js';

const W = { h: 20, s: .8, v: .9, slot: null, base: null, spin: 0 };
let cv, ctx;

const hex = () => rgbToHex(...hsvToRgb(W.h, W.s, W.v));

/* The wheel image only changes with brightness, so it is redrawn just then. */
function paintWheel(){
  const n = cv.width, c = n / 2, R = c - 8, img = ctx.createImageData(n, n), d = img.data;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++){
    const dx = x + .5 - c, dy = y + .5 - c, r = Math.hypot(dx, dy), o = (y * n + x) * 4;
    if (r > R) continue;
    const h = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360, [rr, gg, bb] = hsvToRgb(h, r / R, W.v);
    d[o] = rr; d[o + 1] = gg; d[o + 2] = bb; d[o + 3] = r > R - 1 ? Math.round((R - r) * 255) : 255;
  }
  W.base = img;
}

function draw(){
  const n = cv.width, c = n / 2, R = c - 8;
  ctx.putImageData(W.base, 0, 0);
  const a = W.h * Math.PI / 180, mx = c + Math.cos(a) * W.s * R, my = c + Math.sin(a) * W.s * R;
  ctx.lineWidth = 5; ctx.strokeStyle = '#1f2a37'; ctx.beginPath(); ctx.arc(mx, my, 16, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 3; ctx.strokeStyle = '#ffffff'; ctx.beginPath(); ctx.arc(mx, my, 11, 0, Math.PI * 2); ctx.stroke();
  const h = hex();
  $('#cwPreview').style.setProperty('--sw', h);
  if (document.activeElement !== $('#cwHex')) $('#cwHex').value = h.toUpperCase();
  $('#cwVal').value = Math.round(W.v * 100); $('#cwValOut').textContent = Math.round(W.v * 100) + '%';
}

function setFromHex(h){ [W.h, W.s, W.v] = rgbToHsv(...hexToRgb(h)); paintWheel(); draw(); }

function fromPointer(e){
  const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
  const R = (cv.width / 2 - 8) / cv.width;
  W.h = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  W.s = Math.min(1, Math.hypot(x, y) / R);
  draw();
}

/* Colour roulette: the marker spins round the wheel and lands on a random colour. */
function spin(){
  cancelAnimationFrame(W.spin);
  const target = {h: Math.random() * 360, s: .45 + Math.random() * .55, v: .55 + Math.random() * .45};
  if (matchMedia('(prefers-reduced-motion: reduce)').matches){ Object.assign(W, target); paintWheel(); draw(); return; }
  const from = {h: W.h, s: W.s, v: W.v}, turns = 2 + Math.floor(Math.random() * 2);
  const dh = ((target.h - from.h + 360) % 360) + turns * 360, t0 = performance.now(), dur = 1300;
  $('#cwSpin').disabled = true;
  const step = t => {
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    W.h = (from.h + dh * e) % 360; W.s = from.s + (target.s - from.s) * e;
    const v = from.v + (target.v - from.v) * e;
    if (Math.abs(v - W.v) > .02 || k === 1){ W.v = v; paintWheel(); }
    draw();
    if (k < 1) W.spin = requestAnimationFrame(step); else { $('#cwSpin').disabled = false; toast(`The roulette landed on ${hex().toUpperCase()}`); }
  };
  W.spin = requestAnimationFrame(step);
}

function close(){ cancelAnimationFrame(W.spin); $('#cwSpin').disabled = false; $('#cwDlg').hidden = true; }

function used(index){ return S.frames.some(f => f.includes(index)); }

function save(){
  const h = hex(), all = fullPalette(S.custom);
  const same = all.findIndex((c, i) => i && c === h && i !== (W.slot === null ? -1 : CUSTOM_START + W.slot));
  if (same > 0 && W.slot === null){ close(); selColor(same); toast('That colour is already in your palette, so it is selected.'); return; }
  pushUndo();
  if (W.slot === null){
    if (S.custom.length >= CUSTOM_MAX){ toast(`You can keep up to ${CUSTOM_MAX} custom colours. Remove one to add another.`); return; }
    S.custom.push(h); customChanged(); selColor(CUSTOM_START + S.custom.length - 1);
    toast('Custom colour added. It is saved with this artwork.');
  } else {
    S.custom[W.slot] = h; customChanged(); selColor(CUSTOM_START + W.slot);
    toast(used(CUSTOM_START + W.slot) ? 'Colour changed everywhere it is used.' : 'Colour changed.');
  }
  changed(); close();
}

function remove(){
  const k = W.slot, index = CUSTOM_START + k;
  if (used(index)){ toast('This colour is used in your art. Use Replace to swap it for another colour first.'); return; }
  pushUndo();
  S.custom.splice(k, 1);
  for (const f of S.frames) for (let i = 0; i < f.length; i++) if (f[i] > index) f[i]--;   // later custom colours move down one
  if (S.color === index) S.color = 1; else if (S.color > index) S.color--;
  customChanged(); changed(); close(); toast('Custom colour removed.');
}

/** slot: null to add a colour, or 0–15 to edit that custom colour. */
export function openWheel(slot){
  if (slot === null && S.custom.length >= CUSTOM_MAX){ toast(`You can keep up to ${CUSTOM_MAX} custom colours. Remove one to add another.`); return; }
  W.slot = slot;
  const start = slot === null ? (fullPalette(S.custom)[S.color] || '#ff944f') : S.custom[slot];
  $('#cwHead').textContent = slot === null ? 'Add a custom colour' : `Edit Custom ${slot + 1}`;
  $('#cwSave').textContent = slot === null ? 'Add colour' : 'Save colour';
  $('#cwRemove').hidden = slot === null;
  $('#cwDlg').hidden = false;
  setFromHex(start);
}

/** Runs once at start-up. */
export function init(){
  cv = $('#cwWheel'); ctx = cv.getContext('2d', {willReadFrequently: true});
  let dragging = false;
  cv.addEventListener('pointerdown', e => { e.preventDefault(); dragging = true; cancelAnimationFrame(W.spin); $('#cwSpin').disabled = false; try { cv.setPointerCapture(e.pointerId); } catch {} fromPointer(e); });
  cv.addEventListener('pointermove', e => { if (dragging) fromPointer(e); });
  cv.addEventListener('pointerup', () => { dragging = false; });
  cv.addEventListener('pointercancel', () => { dragging = false; });
  $('#cwVal').addEventListener('input', e => { W.v = Number(e.target.value) / 100; paintWheel(); draw(); });
  $('#cwHex').addEventListener('input', e => { let v = e.target.value.trim(); if (v && v[0] !== '#') v = '#' + v; if (HEX.test(v)){ [W.h, W.s, W.v] = rgbToHsv(...hexToRgb(v)); paintWheel(); draw(); } });
  $('#cwHex').addEventListener('blur', () => draw());
  $('#cwSpin').onclick = spin;
  $('#cwSave').onclick = save;
  $('#cwRemove').onclick = remove;
  $('#cwCancel').onclick = close;
  $('#cwDlg').addEventListener('click', e => { if (e.target.id === 'cwDlg') close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#cwDlg').hidden) close(); });
}
