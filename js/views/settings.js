/* PIXTION · views/settings.js — settings, backup and restore. */
import { LIMITS, cleanGallery, cleanText } from '../core/sanitize.js';
import { app } from '../shared.js';
import { $, ask, plural, toast, uid } from '../core/dom.js';
import { offerFile } from '../core/downloads.js';
import { K, storageOK, store } from '../core/storage.js';
import { S, saveDraft, saveGallery, settings } from '../state.js';
import { go } from './nav.js';
import { validAge } from './profile.js';

export function renderSettings(){
  $('#stName').value = app.profile?.name || ''; $('#stAge').value = app.profile?.age ?? '';
  $('#stGrid').checked = settings.grid; $('#stFps').value = settings.fps; $('#stFpsOut').textContent = settings.fps + ' fps';
  $('#stErr').hidden = true;
  $('#stStorage').textContent = storageOK
    ? `${plural(app.gallery.length, 'piece')} saved in this browser. Clearing browser data removes them, so download anything you want to keep.`
    : 'This browser is blocking storage, so saved art disappears when you close the page. Open PIXTION in Chrome or Safari to keep your work.';
}

/** Runs once at start-up, in the original order. */
export function init() {
  $('#stFps').addEventListener('input', e => $('#stFpsOut').textContent = e.target.value + ' fps');

  $('#stSave').addEventListener('click', () => {
    const name = cleanText($('#stName').value, 40), age = $('#stAge').value.trim();
    if (!name){ $('#stErr').textContent = 'Name can’t be empty.'; $('#stErr').hidden = false; return; }
    if (!validAge(age)){ $('#stErr').textContent = 'Age should be a whole number from 5 to 120.'; $('#stErr').hidden = false; return; }
    app.profile = {name, age: Number(age)}; store.set(K.profile, app.profile);
    settings.grid = $('#stGrid').checked; settings.fps = Number($('#stFps').value); store.set(K.settings, settings);
    toast('Settings saved'); go('home');
  });

  $('#stWipe').addEventListener('click', async () => {
    if (!app.gallery.length){ toast('Your gallery is already empty.'); return; }
    if (!await ask({title: 'Delete all saved art?', body: `This removes ${plural(app.gallery.length, 'piece')} from this device. It can’t be undone.`, ok: 'Delete all', danger: true})) return;
    app.gallery = []; saveGallery(); S.editingId = null; saveDraft(); renderSettings(); toast('Gallery cleared');
  });

  $('#stBackup').addEventListener('click', () => {
    if (!app.gallery.length){ toast('Nothing to back up yet. Save some art first.'); return; }
    const data = JSON.stringify({app: 'PIXTION', version: 2, exported: new Date().toISOString(), gallery: app.gallery}, null, 1);
    offerFile(new Blob([data], {type: 'application/json'}), `pixtion-backup-${new Date().toISOString().slice(0, 10)}.json`);
  });

  $('#stRestore').addEventListener('click', () => $('#restoreFile').click());

  $('#restoreFile').addEventListener('change', e => {
    const file = e.target.files && e.target.files[0]; e.target.value = '';
    if (!file) return;
    if (file.size > LIMITS.backupBytes){ toast('That backup is too big. The limit is 100 MB.'); return; }
    const rd = new FileReader();
    rd.onload = () => {
      let items;
      try { const j = JSON.parse(rd.result); items = Array.isArray(j) ? j : j.gallery; } catch { items = null; }
      if (!Array.isArray(items)){ toast('That file isn’t a PIXTION backup.'); return; }
      const ok = cleanGallery(items);
      if (!ok.length){ toast('No artwork found in that backup.'); return; }
      const ids = new Set(app.gallery.map(x => x.id));
      ok.forEach(c => { if (ids.has(c.id)) c.id = uid(); ids.add(c.id); app.gallery.push(c); });
      if (saveGallery()){ renderSettings(); toast(`Restored ${plural(ok.length, 'piece')} to your Gallery`); }
    };
    rd.onerror = () => toast('PIXTION couldn’t read that file.');
    rd.readAsText(file);
  });

  $('#stReset').addEventListener('click', async () => {
    if (!await ask({title: 'Reset your profile?', body: 'Your name and age are removed. Your saved art stays.', ok: 'Reset'})) return;
    store.del(K.profile); app.profile = null; $('#pfName').value = ''; $('#pfAge').value = ''; go('welcome');
  });
}
