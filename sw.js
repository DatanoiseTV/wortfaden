/* Offline cache. Bump CACHE when any shell file changes. */
var CACHE = 'wortfaden-v3';
var SHELL = [
  './', 'index.html', 'styles.css', 'manifest.webmanifest',
  'js/i18n.js', 'js/data-words.js', 'js/data-phrases.js', 'js/data-board.js', 'js/board.js', 'js/spelling.js',
  'js/predict.js', 'data/lexicon-de.js', 'data/lexicon-en.js', 'js/data-encouragement.js',
  'js/store.js', 'js/programme.js', 'js/neural-voice.js', 'js/speech.js', 'js/ui.js', 'js/exercises.js', 'js/screens.js',
  'js/review.js', 'js/app.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-180.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    // addAll rejects the whole install if a single file 404s; add one by one.
    return Promise.all(SHELL.map(function (u) {
      return c.add(u).catch(function () { return null; });
    }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE && k !== CACHE + '-voice'; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

/* Hosts that serve the optional neural voice RUNTIME (the ESM module, the ONNX
   runtime and the phonemiser wasm). Caching these keeps an installed voice
   working offline.

   The model weights are deliberately NOT listed. They are ~60 MB and the
   library streams them straight into the Origin Private File System; putting
   that response through the cache produced a truncated file and the model
   then failed to load with "No graph was found in the protobuf". OPFS already
   makes the weights available offline, so the service worker stays out of it. */
var VOICE_HOSTS = ['cdn.jsdelivr.net', 'cdnjs.cloudflare.com'];

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);

  if (url.origin !== self.location.origin) {
    if (VOICE_HOSTS.indexOf(url.hostname) < 0) return;   // never the weights
    // The voice runtime is immutable per version: cache-first is right here.
    e.respondWith(
      caches.match(e.request).then(function (hit) {
        if (hit) return hit;
        return fetch(e.request).then(function (res) {
          var copy = res.clone();
          caches.open(CACHE + '-voice').then(function (c) { c.put(e.request, copy); });
          return res;
        });
      })
    );
    return;
  }

  /* The app's own files go network first, with the cache as the fallback.
   *
   * Cache-first was wrong here: after a deploy the first visit still ran the
   * previous version, and a page that had already loaded stale scripts stayed
   * stale until a second reload. For an app someone may depend on to ask for
   * help, being one reload behind is not an acceptable default. Offline still
   * works — that is exactly what the fallback is for. */
  e.respondWith(
    fetch(e.request).then(function (res) {
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(e.request).then(function (hit) {
        return hit || caches.match('index.html');
      });
    })
  );
});
