/* PIXTION · views/profile.js — the profile form. */
import { cleanText } from '../core/sanitize.js';
import { app } from '../shared.js';
import { $ } from '../core/dom.js';
import { K, store } from '../core/storage.js';
import { go } from './nav.js';

export function validAge(v) { const n = Number(v); return v !== '' && Number.isInteger(n) && n >= 5 && n <= 120; }

/** Runs once at start-up, in the original order. */
export function init() {
  $('#profileForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = cleanText($('#pfName').value, 40), age = $('#pfAge').value.trim(), err = $('#pfErr');
    if (!name){ err.textContent = 'Type your name so PIXTION knows what to call you.'; err.hidden = false; return; }
    if (!validAge(age)){ err.textContent = 'Type your age as a whole number from 5 to 120.'; err.hidden = false; return; }
    err.hidden = true; app.profile = {name, age: Number(age)}; store.set(K.profile, app.profile); go('home');
  });
}
