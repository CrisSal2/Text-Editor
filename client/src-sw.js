const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { StaleWhileRevalidate, CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

// Define cache strategy for pages (HTML documents)
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200], // Cache only successful responses and opaque responses
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // Cache pages for 30 days
    }),
  ],
});

// Pre-warm the page cache with important URLs
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// Cache all navigation requests (e.g., page loads)
registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// Cache CSS, JS, and worker files with Stale-While-Revalidate strategy
registerRoute(
  // Match requests for stylesheets, scripts, or worker files
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',

  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Cache valid and opaque responses
      }),
    ],
  })
);

// Cache images using the Cache-First strategy with expiration
registerRoute(
  // Match requests for images
  ({ request }) => request.destination === 'image',

  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Cache valid and opaque responses
      }),
      new ExpirationPlugin({
        maxEntries: 50, // Limit to 50 images
        maxAgeSeconds: 30 * 24 * 60 * 60, // Cache images for 30 days
      }),
    ],
  })
);
