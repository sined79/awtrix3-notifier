const CACHE_NAME = 'awtrix-notifier-v1.0.8';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './icons/icon-192x192.png'
];

// Installation avec précache
self.addEventListener('install', (event) => {
    console.log('SW: Installation nouvelle version');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('SW: Précache des ressources');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Fetch - stratégie "Network First" pour les fichiers HTML
self.addEventListener('fetch', (event) => {
    if (event.request.url.startsWith(self.location.origin)) {
        // Pour les fichiers HTML, essaie d'abord le réseau
        if (event.request.url.endsWith('.html') || event.request.url.endsWith('/')) {
            event.respondWith(
                fetch(event.request)
                    .then((response) => {
                        if (response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, responseClone);
                            });
                        }
                        return response;
                    })
                    .catch(() => {
                        return caches.match(event.request);
                    })
            );
        } else {
            // Pour les autres ressources, utilise le cache d'abord
            event.respondWith(
                caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return fetch(event.request).then((response) => {
                        if (response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, responseClone);
                            });
                        }
                        return response;
                    });
                })
            );
        }
    }
});
