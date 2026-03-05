const AD_DOMAINS = [
    'ad.doubleclick.net',
    'googleads.g.doubleclick.net',
    'pagead2.googlesyndication.com',
    'www.googleadservices.com',
    'adservice.google.com',
    'youtube.com/pagead',
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

        // Responder con 204 No Content para silenciar errores de consola
        // y añadir cabeceras CORS para evitar el error de "wildcard vs include credentials"
        const origin = event.request.headers.get('origin');
        const headers = {
            'Access-Control-Allow-Origin': origin || '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Credentials': 'true',
            'Cache-Control': 'no-store'
        };

        event.respondWith(new Response(null, {
            status: 204,
            statusText: 'No Content (Blocked by StudyNeo)',
            headers
        }));
        return;
    }

    // Continuar con la petición normal
    event.respondWith(fetch(event.request));
});
