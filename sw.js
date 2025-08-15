// Service Worker for PWA functionality - FORCE CLEAR ALL CACHE
const CACHE_NAME = 'beyond99days-v3.0-NO-LOOPS-' + Date.now();
const urlsToCache = [
  './',
  './index-complete.html', 
  './index.html',
  './main-enhanced.js',
  './main-enhanced-v5-fixed.js',
  './style.css',
  './favicon.svg',
  './manifest.json'
];

// Install service worker - CLEAR ALL OLD CACHES!
self.addEventListener('install', (event) => {
  console.log('🧹 Service Worker installing - CLEARING ALL OLD CACHES!');
  self.skipWaiting(); // Force activation immediately
  event.waitUntil(
    // Clear ALL old caches first
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return caches.open(CACHE_NAME);
    }).then((cache) => {
      console.log('✅ Opened NEW cache:', CACHE_NAME);
      return cache.addAll(urlsToCache);
    }).catch((error) => {
      console.log('❌ Cache operation failed:', error);
    })
  );
});

// Activate service worker - TAKE CONTROL IMMEDIATELY!
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating - TAKING CONTROL!');
  event.waitUntil(
    self.clients.claim() // Take control of all pages immediately
  );
});

// Fetch event - ALWAYS NETWORK FIRST FOR JS/HTML!
self.addEventListener('fetch', (event) => {
  // FORCE NETWORK FIRST for JS and HTML files - NO CACHE for critical files!
  if (event.request.url.includes('.js') || event.request.url.includes('.html')) {
    console.log('🌐 FORCE NETWORK for:', event.request.url);
    event.respondWith(
      fetch(event.request.url + '?nocache=' + Date.now())
        .then((response) => {
          console.log('✅ Network response for:', event.request.url);
          // Don't cache JS/HTML files to ensure always fresh!
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
  } else {
    // Use cache first for other resources
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
        .catch((error) => {
          console.log('Fetch failed:', error);
        })
    );
  }
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
