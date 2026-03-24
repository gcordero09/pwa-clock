/**
 * Service Worker para la PWA del Reloj
 * Gestiona el caché de los archivos estáticos para permitir el funcionamiento sin conexión.
 */

// Nombre de la versión actual del caché, se actualiza para forzar refrescos en los clientes
const CACHE_NAME = 'pwa-clock-v1';

// Recursos críticos de la UI a almacenar permanentemente en caché (Asset Caching)
const URLS_TO_CACHE = [
    '../',
    '../index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './icon-192.svg',
    './icon-512.svg'
];

/**
 * Evento de inicialización/instalación (install): 
 * Ocurre cuando se instala el Service Worker por primera vez.
 * Aprovechamos para cachear todos los archivos estáticos críticos.
 */
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('ServiceWorker: Abriendo caché local y guardando recursos críticos');
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

/**
 * Evento de activación (activate): 
 * Ocurre cuando el Service Worker toma el control de los clientes (paginas abiertas).
 * Es ideal para limpiar cachés antiguos de versiones previas.
 */
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Borrar los cachés que no coinciden con la versión actual (CACHE_NAME)
                    if (cacheName !== CACHE_NAME) {
                        console.log('ServiceWorker: Borrando caché antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

/**
 * Evento de intercepción de peticiones de red (fetch):
 * Actúa como un proxy de red. Devuelve la respuesta del caché si existe (Cache First), 
 * o hace la petición a la red si no está respaldada.
 */
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si la petición ya está en el caché, la devolvemos sin contactar la red
                if (response) {
                    return response;
                }
                
                // Si la petición no se encuentra en el caché local, solicitamos a la red
                return fetch(event.request);
            })
    );
});
