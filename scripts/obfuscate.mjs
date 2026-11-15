/* PIXTION · scripts/obfuscate.mjs — builds dist/, the version you deploy.
 *
 * It does three things:
 *   1. Bundles every JS module into one file and OBFUSCATES it (unreadable, but still runs).
 *   2. Moves the app's HTML markup into that bundle, so `view-source:` shows only a small shell
 *      instead of the whole app. (DevTools still shows the running app — no site can hide that.)
 *   3. Adds Subresource Integrity (SRI) hashes so the browser refuses a tampered script.
 *
 * The readable source in this folder is for editing; dist/ is only a build output.
 * Run:  node scripts/obfuscate.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import JsObfuscator from 'javascript-obfuscator';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const DIST = join(ROOT, 'dist');
const SITE = 'https://pixtion.vercel.app';

const OBFUSCATE = {
  compact: true,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,
  simplify: true,
  numbersToExpressions: true,
  stringArray: true,
  stringArrayThreshold: 0.75,
  stringArrayEncoding: ['base64'],
  splitStrings: true,
  splitStringsChunkLength: 10,
  transformObjectKeys: false,   // safer with our template-heavy code
  controlFlowFlattening: false, // keeps it fast and reliable
  deadCodeInjection: false,
  selfDefending: false,         // avoid breaking the app
  debugProtection: false        // never freeze the user's browser
};

const sri = buf => 'sha384-' + createHash('sha384').update(buf).digest('base64');

/* ---------- 1. the HTML markup that will be injected at runtime ---------- */
const srcHtml = readFileSync(join(ROOT, 'index.html'), 'utf8');
const body = srcHtml.slice(srcHtml.indexOf('<body>') + 6, srcHtml.indexOf('</body>'));
const markup = body
  .replace(/<noscript>[\s\S]*?<\/noscript>/g, '')
  .replace(/<script[\s\S]*?<\/script>/g, '')
  .replace(/<!--[\s\S]*?-->/g, '')
  .trim();

/* ---------- 1b. the CSS, in cascade order, to inline at runtime ---------- */
const cssOrder = [...srcHtml.matchAll(/href="css\/([^"]+)"/g)].map(m => m[1]);
const css = cssOrder.map(f => readFileSync(join(ROOT, 'css', f), 'utf8')).join('\n')
  .replace(/url\((['"]?)\.\.\/assets\//g, 'url($1/assets/');   // resolve font paths from the page root
const cssSri = sri(css);

/* ---------- 2. bundle + obfuscate the app ---------- */
const bundled = await build({
  entryPoints: [join(ROOT, 'js', 'main.js')],
  bundle: true, format: 'iife', platform: 'browser', target: 'es2019',
  minify: true, write: false, legalComments: 'none'
});
// Prelude (runs first): inject the stylesheet, then the markup, then the app boots.
const inject = `(function(){` +
  `var st=document.createElement("style");st.textContent=${JSON.stringify(css)};document.head.appendChild(st);` +
  `var s=document.getElementById("seo");if(s)s.remove();` +
  `document.body.insertAdjacentHTML("afterbegin",${JSON.stringify(markup)});})();\n`;
const appObf = JsObfuscator.obfuscate(inject + bundled.outputFiles[0].text, OBFUSCATE).getObfuscatedCode();

// Random-looking content-hash filenames (asset fingerprinting; also busts caches on update).
const h12 = buf => createHash('sha256').update(buf).digest('hex').slice(0, 12);

// The service worker keeps a STABLE name (never per-build): browsers update a worker by its URL,
// so a name that changed every build would leave stale workers behind. Its name reveals nothing.
const SW_FILE = 'pixtion.worker.js';

const guardSrc = readFileSync(join(ROOT, 'js', 'guard.js'), 'utf8').replaceAll('./sw.js', './' + SW_FILE);
const guardObf = JsObfuscator.obfuscate(guardSrc, OBFUSCATE).getObfuscatedCode();

/* ---------- 3. write dist/ ---------- */
rmSync(DIST, { recursive: true, force: true });
mkdirSync(join(DIST, 'js'), { recursive: true });
const APP_FILE = 'js/' + h12(appObf) + '.js';
const GUARD_FILE = 'js/' + h12(guardObf) + '.js';
writeFileSync(join(DIST, APP_FILE), appObf);
writeFileSync(join(DIST, GUARD_FILE), guardObf);
const appSri = sri(appObf), guardSri = sri(guardObf);

// assets ship as-is. There are NO .css files in dist: the CSS lives inside the obfuscated bundle.
cpSync(join(ROOT, 'assets'), join(DIST, 'assets'), { recursive: true });
for (const f of ['robots.txt', 'sitemap.xml']) cpSync(join(ROOT, f), join(DIST, f));
cpSync(join(ROOT, 'site.webmanifest'), join(DIST, 'site.webmanifest'));
// dist headers: rename the worker, and allow exactly our one injected stylesheet by its hash.
writeFileSync(join(DIST, 'vercel.json'), readFileSync(join(ROOT, 'vercel.json'), 'utf8')
  .replaceAll('/sw.js', '/' + SW_FILE)
  .replace("style-src 'self'", "style-src 'self' '" + cssSri + "'"));

/* ---------- the shell index.html (what view-source shows) ---------- */
let head = srcHtml.slice(srcHtml.indexOf('<head>'), srcHtml.indexOf('</head>') + 7)
  .replace(/<script src="js\/guard\.js" defer><\/script>\s*/, '')
  .replace(/<script type="module" src="js\/main\.js"><\/script>\s*/, '')
  .replace(/<link rel="stylesheet" href="css\/[^"]+">\s*/g, '')   // CSS is inlined by the bundle
  .replace(/<!-- Styles, in cascade order -->\s*/, '');
const desc = 'PIXTION is a free pixel art animation maker in your browser. Draw, animate frame by frame and export GIF, video or PNG.';
const shell = `<!doctype html>
<html lang="en">
${head}
<body>
<div id="seo"><h1>PIXTION – Free Pixel Art Animation Maker</h1><p>${desc} Draw on grids from 8×8 to 512×512, start from 86 templates, save to a gallery, and download your art. Loading…</p></div>
<noscript><div class="noscript-box"><h1>PIXTION – Free Pixel Art Animation Maker</h1><p>${desc} Please turn on JavaScript to use PIXTION.</p></div></noscript>
<script src="${GUARD_FILE}" defer integrity="${guardSri}"></script>
<script src="${APP_FILE}" defer integrity="${appSri}"></script>
</body>
</html>
`;
writeFileSync(join(DIST, 'index.html'), shell);

/* ---------- regenerate the service worker for dist ---------- */
const SKIP = new Set([SW_FILE, 'vercel.json', 'robots.txt', 'sitemap.xml']);
const walk = dir => readdirSync(dir).flatMap(n => {
  const full = join(dir, n), rel = relative(DIST, full).split(sep).join('/');
  if (statSync(full).isDirectory()) return walk(full);
  if (SKIP.has(rel) || rel === 'assets/og-image.png' || rel.endsWith('.txt')) return [];
  return [rel];
});
const files = walk(DIST).sort();
const hash = createHash('sha256');
for (const f of files) { hash.update(f); hash.update(readFileSync(join(DIST, f))); }
const version = hash.digest('hex').slice(0, 10);
writeFileSync(join(DIST, SW_FILE), `/* PIXTION · service worker — offline support (generated). */
const CACHE = 'pixtion-${version}';
const CORE = ${JSON.stringify(['./', ...files.map(f => './' + f)], null, 1)};
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.startsWith('pixtion-') && x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') { e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put('./', c)); return r; }).catch(() => caches.match('./'))); return; }
  e.respondWith(caches.match(req).then(h => h || fetch(req).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); } return r; })));
});
`);

console.log(`dist/ built — ${APP_FILE} ${(appObf.length / 1024).toFixed(0)} KB, worker ${SW_FILE}, ${files.length} files, cache pixtion-${version}`);
console.log(`hashed names: ${GUARD_FILE}, ${APP_FILE} · CSS inlined into the bundle (no .css files)`);
console.log(`view-source body hides the app: ${!shell.includes('id="board"')}`);
