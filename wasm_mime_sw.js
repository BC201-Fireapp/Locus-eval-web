self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (!url.pathname.endsWith('.wasm')) {
    return;
  }
  event.respondWith((async () => {
    const resp = await fetch(event.request);
    const buf = await resp.arrayBuffer();
    const headers = new Headers(resp.headers);
    headers.set('Content-Type', 'application/wasm');
    return new Response(buf, {
      status: resp.status,
      statusText: resp.statusText,
      headers,
    });
  })());
});
