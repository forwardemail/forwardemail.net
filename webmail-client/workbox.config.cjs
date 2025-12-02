module.exports = {
  globDirectory: 'dist',
  globPatterns: ['**/*.{js,css,html,woff2,woff,png,svg,ico,json}'],
  swDest: 'dist/sw.js',
  navigateFallback: '/index.html',
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /\/icons\/.*\.(?:png|svg|ico)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'app-icons',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        },
      },
    },
  ],
};
