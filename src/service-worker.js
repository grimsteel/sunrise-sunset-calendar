const cacheName = "sunrise-sunset-calendar-v1.2";

const urlsToCache = [
  ".",
  "index.html",
  "icons/icon-192-maskable.png",
  "icons/icon-512-maskable.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "app.webmanifest",
  "apple-touch-icon.png",
  "favicon.ico",
  "file-saver.js",
  "ical-export.js",
  "index.js",
  "sunrise-sunset.js",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
    .then(cachedResponse => cachedResponse || fetch(event.request)
  )
 )
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key === cacheName) return;
      return caches.delete(key); // delete old caches
    }))
  }));
});