/* PIXTION · core/palette.js — the 47-colour palette and colour names. */

export const PAL = [null,'#1b2230','#2c3a4a','#556677','#9fb0b6','#fbf7ee','#d94b5f','#ff6b81','#ff944f','#ffb46a','#ffd65a',
 '#fff09a','#7fa75a','#4b8a5c','#23614a','#9ae3c6','#46cfcb','#238a8a','#2f6aa5','#72c5ec','#c9eff2',
 '#6b72cc','#434c8f','#7451a3','#b08ccb','#efa2bb','#8a5a44','#c8955f','#e6c08a','#ffffff',
 '#ffe3cf','#f6c3a0','#d99a6c','#8e5b3e','#4a2f24','#b6e34a','#ff4fa3','#4f7bff','#3fe0d0','#8c2a3c',
 '#c4552d','#6f7a2e','#1f3263','#5a2d5f','#dcd3f2','#ffc2cc','#e8b62c','#000000'];

export const BASE_COLOURS = 29;

export const NAMES = [null,'Ink','Slate','Steel','Fog','Cream','Cherry','Coral','Tangerine','Apricot','Sunflower',
 'Butter','Moss','Fern','Pine','Mint','Lagoon','Teal','Denim','Sky','Ice',
 'Periwinkle','Indigo','Grape','Lilac','Blush','Cocoa','Caramel','Sand','White',
 'Porcelain','Peach','Honey','Umber','Espresso','Lime','Neon pink','Electric','Aqua','Maroon',
 'Rust','Olive','Navy','Plum','Mist','Rose','Gold','Black'];

/* Custom colours. Frames store colour numbers 0–63 and the GIF palette holds 64 colours. The built-in
   colours use 1–47, so numbers 48–63 hold up to 16 colours the artist picks, saved with each artwork. */
export const CUSTOM_START = PAL.length;          // 48
export const CUSTOM_MAX = 64 - PAL.length;       // 16
export const HEX = /^#[0-9a-f]{6}$/i;

/** Built-in colours followed by this artwork's custom colours (64 entries, index 0 = empty). */
export function fullPalette(custom){
  const p = PAL.slice();
  for (let i = 0; i < CUSTOM_MAX; i++){ const c = custom && custom[i]; p.push(typeof c === 'string' && HEX.test(c) ? c.toLowerCase() : null); }
  return p;
}

/** A friendly name for any colour number. */
export function colorName(v){ return v >= CUSTOM_START ? `Custom ${v - CUSTOM_START + 1}` : NAMES[v]; }
