const CACHE_NAME = "ax-hub-v3";
const ALLOWED_ORIGINS = [
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(["./logo-ax.png", "./manifest.json"])),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      )
      .then(() => clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const isFont = ALLOWED_ORIGINS.some((o) => e.request.url.startsWith(o));
  const isStaticAsset =
    e.request.url.includes("logo-ax.png") ||
    e.request.url.includes("manifest.json");

  if (isFont || isStaticAsset) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
          return response;
        });
      }),
    );
    return;
  }
  e.respondWith(fetch(e.request));
});
