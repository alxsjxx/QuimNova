// Service worker mínimo: guarda todo en caché para usar QuimNova sin conexión en el navegador.
// Sube el número de versión cuando cambies archivos para forzar la actualización.
const CACHE = 'quimnova-v1';
const ARCHIVOS = [
  './', './index.html', './css/style.css', './manifest.webmanifest', './icon.svg',
  './js/app.js', './js/viewer.js', './js/molecules.js',
  './vendor/three.module.min.js', './vendor/three.core.min.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => Promise.allSettled(ARCHIVOS.map((a) => c.add(a)))).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) { const copia = res.clone(); caches.open(CACHE).then((c) => c.put(req, copia)); }
      return res;
    })),
  );
});
