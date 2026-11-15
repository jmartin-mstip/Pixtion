/* PIXTION · views/nav.js — screen and tab navigation. */
import { app } from '../shared.js';
import { $, $$ } from '../core/dom.js';
import { stopPlay } from '../studio/playback.js';
import { renderStudio } from '../studio/view.js';
import { stopGalleryAnim } from './cards.js';
import { renderGallery } from './gallery.js';
import { renderSettings } from './settings.js';
import { renderTemplates } from './templates.js';

const views = ['welcome', 'profile', 'home', 'settings', 'about', 'main'];

export function go(v){
  stopPlay(); stopGalleryAnim();
  views.forEach(n => $('#v-' + n).hidden = n !== v);
  if (v === 'home') $('#homeHello').textContent = `Welcome, ${app.profile ? app.profile.name : 'artist'}. What would you like to make today?`;
  if (v === 'settings') renderSettings();
  if (v === 'profile' && app.profile){ $('#pfName').value = app.profile.name || ''; $('#pfAge').value = app.profile.age ?? ''; }
  window.scrollTo(0, 0);
}

export let tab = 'studio';

export function setTab(t){
  tab = t; stopPlay(); stopGalleryAnim();
  $$('.tab').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === t));
  ['studio', 'gallery', 'templates', 'tutorial'].forEach(n => $('#p-' + n).hidden = n !== t);
  if (t === 'studio') renderStudio();
  if (t === 'gallery') renderGallery();
  if (t === 'templates') renderTemplates();
}

/** Runs once at start-up, in the original order. */
export function init() {
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]');
    if (g){ go(g.dataset.go); if (g.dataset.tab) setTab(g.dataset.tab); return; }
    const tb = e.target.closest('[data-tab]');
    if (tb){ if ($('#v-main').hidden) go('main'); setTab(tb.dataset.tab); window.scrollTo(0, 0); }
  });
}
