// Service worker — Français Elevate
// Si tu avais déjà un sw.js, garde ses autres fonctionnalités (cache, offline...)
// et copie-colle simplement les 3 blocs ci-dessous (install/activate/push/notificationclick).

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Réception d'une notification push envoyée par le serveur
self.addEventListener('push', (event) => {
  let data = { title: 'Français Elevate', body: 'Un petit rappel pour toi 👋' };
  try {
    if (event.data) data = event.data.json();
  } catch (e) {
    if (event.data) data.body = event.data.text();
  }

  const options = {
    body: data.body || '',
    icon: './icon.png',
    badge: './icon.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || './' }
  };

  event.waitUntil(self.registration.showNotification(data.title || 'Français Elevate', options));
});

// Clic sur la notification -> ouvre ou refocus l'app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || './';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
