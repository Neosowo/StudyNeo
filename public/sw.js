const AD_DOMAINS = [
    'ad.doubleclick.net',
    'googleads.g.doubleclick.net',
    'pagead2.googlesyndication.com',
    'www.googleadservices.com',
    'adservice.google.com',
    'youtube.com/api/stats/ads',
    'youtube.com/ptracking',
    'youtube.com/api/stats/qoe',
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    const isAd = AD_DOMAINS.some(domain => url.includes(domain));

    if (isAd) {
        console.log('🛡️ StudyNeo Shield: Bloqueando petición de anuncio:', url);
        event.respondWith(new Response('', { status: 403, statusText: 'Blocked by StudyNeo' }));
        return;
    }

    // Continuar con la petición normal
    event.respondWith(fetch(event.request));
});
