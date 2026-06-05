const CACHE_NAME = "ax-hub-v2";
const ALLOWED_ORIGINS = [
  "https://aionyxprime9999.github.io",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll([
          "./index.html",
          "./404.html",
          "./logo-ax.png",
          "./manifest.json",
        ]),
      ),
  );
});

self.addEventListener("activate", (e) => {
  clients.claim();
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      ),
  );
});

self.addEventListener("fetch", (e) => {
  const allowed = ALLOWED_ORIGINS.some((o) => e.request.url.startsWith(o));
  if (!allowed) return;
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request)),
  );
});
