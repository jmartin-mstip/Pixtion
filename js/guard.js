/* PIXTION · guard.js — runs before the app: registers the offline service worker, offers
   "Install PIXTION", and adds light deterrents against casual tampering.
   Client-side code can never be truly hidden; the real protection is the server's security headers. */
(function () {
  "use strict";
  var framed = false;
  try { framed = window.top !== window.self; } catch (e) { framed = true; }
  if (framed) return;                       // embedded previews: leave the host page alone

  /* Offline support (HTTPS or localhost only) */
  try {
    if ("serviceWorker" in navigator && (location.protocol === "https:" || /^(localhost|127\.0\.0\.1)$/.test(location.hostname))) {
      window.addEventListener("load", function () { navigator.serviceWorker.register("./sw.js", {scope: "./"}).catch(function () {}); });
    }
  } catch (e) {}

  /* Install button, shown only when the browser offers installation */
  var deferred = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); deferred = e;
    if (document.getElementById("pxInstall")) return;
    var b = document.createElement("button");
    b.id = "pxInstall"; b.type = "button"; b.className = "install-btn"; b.textContent = "Install PIXTION";
    b.addEventListener("click", function () {
      if (!deferred) return;
      deferred.prompt();
      deferred.userChoice.finally(function () { deferred = null; b.remove(); });
    });
    document.body.appendChild(b);
  });
  window.addEventListener("appinstalled", function () { var b = document.getElementById("pxInstall"); if (b) b.remove(); });

  /* Light deterrents: right-click menu and developer-tool shortcuts (easy to bypass by design) */
  document.addEventListener("contextmenu", function (e) {
    if (e.target && e.target.closest && e.target.closest("input, textarea")) return;
    e.preventDefault();
  });
  document.addEventListener("keydown", function (e) {
    var k = (e.key || "").toLowerCase(), mod = e.ctrlKey || e.metaKey;
    if (k === "f12" || (mod && e.shiftKey && (k === "i" || k === "j" || k === "c")) || (mod && (k === "u" || k === "s"))) {
      e.preventDefault(); e.stopPropagation();
    }
  }, true);
  setTimeout(function () {
    try {
      console.log("%cPIXTION", "font:700 40px monospace;color:#ff944f");
      console.log("%cThis panel is for developers. PIXTION keeps your art only on this device, so there is nothing secret here. Never paste code from strangers into this panel.", "font-size:13px");
    } catch (e) {}
  }, 500);
})();
