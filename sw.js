/* Thuis Kracht — service worker: cache-first zodat de app offline werkt */
const CACHE_NAAM = "thuis-kracht-v2";
const GIF_CACHE = "thuis-kracht-gifs-v1";
const GIF_HOST = "static.exercisedb.dev";
const BESTANDEN = [
  ".",
  "index.html",
  "css/style.css",
  "js/data.js",
  "js/app.js",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAAM).then((cache) => cache.addAll(BESTANDEN)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((sleutels) => Promise.all(sleutels.filter((s) => s !== CACHE_NAAM && s !== GIF_CACHE).map((s) => caches.delete(s))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);

  // Demonstratie-GIF's: cache-first, zodat een eenmaal bekeken GIF ook offline werkt
  if (url.hostname === GIF_HOST) {
    event.respondWith(
      caches.open(GIF_CACHE).then((cache) =>
        cache.match(event.request).then(
          (hit) =>
            hit ||
            fetch(event.request).then((antwoord) => {
              if (antwoord.ok || antwoord.type === "opaque") cache.put(event.request, antwoord.clone());
              return antwoord;
            })
        )
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(
      (hit) =>
        hit ||
        fetch(event.request).then((antwoord) => {
          if (antwoord.ok && new URL(event.request.url).origin === self.location.origin) {
            const kopie = antwoord.clone();
            caches.open(CACHE_NAAM).then((cache) => cache.put(event.request, kopie));
          }
          return antwoord;
        })
    )
  );
});
