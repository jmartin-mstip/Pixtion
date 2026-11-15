/* PIXTION · core/storage.js — localStorage wrapper with memory fallback, and a tiny IndexedDB key-value store. */

export const K = {profile:'pixtion.profile', gallery:'pixtion.gallery', settings:'pixtion.settings', draft:'pixtion.draft', seeded:'pixtion.seeded'};

export let storageOK = true;

let mem;

export let store;

/* IndexedDB holds the gallery and draft: it has far more room than localStorage, which big grids need. */
export let idb;

/** Runs once at start-up, in the original order. */
export function init() {
  try { const t = 'pixtion.test'; localStorage.setItem(t, '1'); localStorage.removeItem(t); } catch { storageOK = false; }

  mem = {};

  store = {
    get(k, d){ try { if (!storageOK) return k in mem ? mem[k] : d; const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v){ if (!storageOK){ mem[k] = v; return true; } try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
    del(k){ delete mem[k]; try { localStorage.removeItem(k); } catch {} }
  };

  /* IndexedDB holds the gallery and draft: it has far more room than localStorage, which big grids need. */
  idb = (() => {
    let dbp = null;
    const open = () => dbp || (dbp = new Promise((res, rej) => {
      try { const r = indexedDB.open('pixtion', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }
      catch (e){ rej(e); }
    }));
    const run = (mode, fn) => open().then(db => new Promise((res, rej) => { const t = db.transaction('kv', mode), q = fn(t.objectStore('kv')); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); }));
    return {get: k => run('readonly', st => st.get(k)), set: (k, v) => run('readwrite', st => st.put(v, k)), del: k => run('readwrite', st => st.delete(k))};
  })();
}
