// service-worker.js

const CACHE_NAME = 'clock-app-cache-v1';
const urlsToCache = [
    '/',                // Your main HTML file
    '/index.html',      // Your main HTML file (change if different)
    '/style.css',       // Your CSS file (change if different)
    '/sw.js',           // Your service worker file
    '/alarm.mp3',       // Your audio file for the alarm (change if different)
    // Add any other assets you want to cache
];

// Install event to cache files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event to serve cached files
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Activate event to clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Function to show a notification
function showNotification(title, body) {
    self.registration.showNotification(title, {
        body: body,
        silent: true, // Make the notification silent
        icon: '/icon-192x192.png', // Your app icon
    });
}

// Listen for messages from the main script
self.addEventListener('message', event => {
    if (event.data.type === 'ALARM_RINGING') {
        showNotification('Alarm', 'Your alarm is ringing!');
    } else if (event.data.type === 'STOPWATCH_ACTIVE') {
        showNotification('Stopwatch', 'Your stopwatch is running.');
    } else if (event.data.type === 'TIMER_FINISHED') {
        showNotification('Timer', 'Your timer has finished.');
    }
});
