// Give this file exact name: firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDett0SoGzQP8puqO0x1DsPvwSZyNd4g0g",
    authDomain: "agenticemailtool.firebaseapp.com",
    projectId: "agenticemailtool",
    storageBucket: "agenticemailtool.firebasestorage.app",
    messagingSenderId: "413903835231",
    appId: "1:413903835231:web:78c4426b077a9d6aaacbea",
    measurementId: "G-88SCQ6KNC7"
});

const messaging = firebase.messaging();

// Handle background messages (when page closed or in background)
messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] onBackgroundMessage', payload);
    const notification = payload.notification || {};
    const data = payload.data || {};
    const title = notification.title || data.title || 'Reminder';
    const options = {
        body: notification.body || data.body || 'You have a new notification.',
        icon: notification.icon || '/src/assets/3DAvatar.png',
        data,
        badge: '/src/assets/3DAvatar.png',
        vibrate: [100, 50, 100]
    };
    self.registration.showNotification(title, options);
});

// Fallback for raw push events (data-only messages that skip FCM handler)
self.addEventListener('push', function(event) {
    try {
        const payload = event.data ? event.data.json() : {};
        console.log('[firebase-messaging-sw.js] push event payload', payload);
        const notification = payload.notification || {};
        const data = payload.data || {};
        const title = notification.title || data.title || 'Reminder';
        const options = {
            body: notification.body || data.body || 'You have a new notification.',
            icon: notification.icon || '/src/assets/3DAvatar.png',
            data,
            badge: '/src/assets/3DAvatar.png'
        };
        event.waitUntil(self.registration.showNotification(title, options));
    } catch (e) {
        console.error('Push event error', e);
    }
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const targetUrl = event.notification.data?.url || '/';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            for (const client of clientList) {
                if (client.url.includes(targetUrl) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) return clients.openWindow(targetUrl);
        })
    );
});