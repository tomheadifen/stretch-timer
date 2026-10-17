// Service worker: makes the app installable and usable offline.
//
// App files are served from the saved copy for this version, so the app
// opens instantly and only changes when you choose to update. Fonts: saved
// copy first.
//
// RELEASING A CHANGE: bump VERSION below. The browser sees sw.js changed,
// downloads the new files in the background, and the app shows an
// "Update" banner. Tapping it switches to the new version and reloads.
// If you don't bump VERSION, installed copies keep the old files.
const VERSION = "v3";
const CACHE = "stretches-" + VERSION;
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon.png"
];

self.addEventListener("install", e => {
  // Fetch fresh copies (skip the HTTP cache) so the new version is complete.
  // Don't activate yet: wait until the page asks (the Update button).
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(SHELL.map(u => new Request(u, { cache: "reload" })))
    )
  );
});

self.addEventListener("message", e => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("stretches-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }))
    );
    return;
  }

  if (url.origin === location.origin) {
    e.respondWith(
      caches.open(CACHE).then(c =>
        c.match(req, { ignoreSearch: true }).then(hit => {
          if (hit) return hit;
          if (req.mode === "navigate") {
            return c.match("./index.html").then(page => page || fetch(req));
          }
          return fetch(req).then(res => {
            if (res.ok) c.put(req, res.clone());
            return res;
          });
        })
      )
    );
  }
});
