// Service Worker for Event Reminder App

// Handle push notifications
self.addEventListener('push', function(event) {
  let payload = {
    title: 'Event Reminder',
    body: 'An event is coming up!'
  };
  
  try {
    if (event.data) {
      payload = event.data.json();
    }
  } catch (e) {
    console.error('Error parsing push notification:', e);
  }
  
  const title = payload.title;
  const options = {
    body: payload.body,
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect fill="%230f9d58" width="180" height="180"/><text x="50%" y="50%" font-size="80" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold" font-family="system-ui">ER</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><circle cx="96" cy="96" r="90" fill="%230f9d58"/></svg>',
    tag: 'event-reminder',
    requireInteraction: true,
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'close', title: 'Dismiss' }
    ]
  };
  
  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(clientList) {
      // Check if app is already open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // If not open, open new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', function(event) {
  console.log('Notification dismissed');
});

// Service Worker installation
self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Service Worker activation
self.addEventListener('activate', function(event) {
  console.log('Service Worker activated');
  event.waitUntil(clients.claim());
});
