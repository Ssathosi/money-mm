// sw.js - Service Worker (cache assets + offline + show notifications on message)
const CACHE_NAME = 'keu-proyek-cache-v1';
const URLS_TO_CACHE = [
'/', 'index.html', 'sw.js', 'manifest.json',
'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];


self.addEventListener('install', event => {
event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE)));
self.skipWaiting();
});


self.addEventListener('activate', event => {
event.waitUntil(clients.claim());
});


self.addEventListener('fetch', event => {
event.respondWith(
caches.match(event.request).then(resp => resp || fetch(event.request).catch(()=> caches.match('index.html')))
);
});


self.addEventListener('message', event => {
const data = event.data || {};
if(data.type === 'SHOW_NOTIFICATION'){
const title = data.title || 'Pemberitahuan';
const body = data.body || '';
self.registration.showNotification(title, { body });
}
});


self.addEventListener('notificationclick', event => {
event.notification.close();
event.waitUntil(clients.matchAll({type:'window'}).then(windowClients => {
for (let client of windowClients) {
if (client.url === '/' && 'focus' in client) return client.focus();
}
if (clients.openWindow) return clients.openWindow('/');
}));
});