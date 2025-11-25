# Webmail Pure Client-Side Architecture

**Proposal Date:** November 24, 2024
**Status:** Design Proposal
**Goal:** Deploy webmail as a pure static PWA on mail.forwardemail.net

---

## Executive Summary

Migrate webmail from hybrid SSR+CSR to **100% pure client-side PWA** with the following characteristics:

- **Zero server-side rendering** - Just static HTML, CSS, JS
- **Single `index.html`** - Served from CDN or static host
- **API-only backend** - All data from existing `/v1/webmail/*` endpoints
- **Offline-first PWA** - Service worker, localStorage, IndexedDB
- **Separate deployment** - Completely independent from forwardemail.net main app
- **No middleware** - No sessions, no Passport, no rate limiting on static host

---

## Table of Contents

1. [Current vs Proposed Architecture](#1-current-vs-proposed-architecture)
2. [Static Deployment Structure](#2-static-deployment-structure)
3. [Service Worker Strategy](#3-service-worker-strategy)
4. [Authentication Flow](#4-authentication-flow)
5. [API Backend Requirements](#5-api-backend-requirements)
6. [Migration Plan](#6-migration-plan)
7. [Build & Deployment](#7-build--deployment)
8. [Benefits & Trade-offs](#8-benefits--trade-offs)

---

## 1. Current vs Proposed Architecture

### Current Architecture (Hybrid)

```
┌─────────────────────────────────────────────────────────┐
│ forwardemail.net/webmail                                │
│                                                         │
│ Node.js Server (Koa)                                    │
│ ├─ Middleware: i18n, session, passport, rate limit     │
│ ├─ Route: /webmail → webmail.pug (SSR)                 │
│ ├─ Controller: Renders HTML with inline scripts        │
│ └─ Response: 200KB HTML (includes templates)           │
│                                                         │
│ Client downloads JS → Knockout initializes → API calls │
└─────────────────────────────────────────────────────────┘

Issues:
❌ Tightly coupled to main app
❌ Requires Node.js server for static HTML
❌ Middleware overhead (sessions, auth checks)
❌ Can't deploy to CDN edge locations
❌ Server-side rendering for static content
```

### Proposed Architecture (Pure Client-Side PWA)

```
┌─────────────────────────────────────────────────────────┐
│ mail.forwardemail.net                                   │
│                                                         │
│ Static Files (Served from CDN/S3/Nginx)                │
│ ├─ index.html (10KB)                                   │
│ ├─ manifest.json (PWA manifest)                        │
│ ├─ sw.js (Service worker)                              │
│ ├─ css/app.min.css (350KB → 100KB gzipped)             │
│ ├─ js/app.bundle.js (1MB → 200KB gzipped)              │
│ └─ assets/ (images, fonts, icons)                      │
│                                                         │
│ Client downloads → SW installs → Offline-ready         │
│ All data from: api.forwardemail.net/v1/webmail/*       │
└─────────────────────────────────────────────────────────┘

Benefits:
✅ Completely independent deployment
✅ Deploy to CDN edge (Cloudflare, Fastly)
✅ No server-side logic needed
✅ Works offline (PWA)
✅ Faster cold starts (cached at edge)
✅ Simpler architecture
```

---

## 2. Static Deployment Structure

### File Structure

```
mail.forwardemail.net/
│
├── index.html                 # Entry point (10KB)
│   └── Minimal HTML shell, loads app bundle
│
├── manifest.json              # PWA manifest (2KB)
│   └── App metadata, icons, display mode
│
├── sw.js                      # Service worker (20KB)
│   └── Offline caching, background sync
│
├── css/
│   ├── app.min.css            # Main styles (350KB → 100KB gzipped)
│   └── critical.css           # Critical CSS (inlined in index.html)
│
├── js/
│   ├── app.bundle.js          # Complete app (1MB → 200KB gzipped)
│   │   ├── Knockout.js
│   │   ├── SnappyMail core
│   │   ├── ForwardEmail adapter
│   │   └── All ViewModels & templates
│   │
│   ├── vendor.bundle.js       # Third-party libs (optional split)
│   └── polyfills.js           # Browser compatibility (if needed)
│
├── assets/
│   ├── icons/
│   │   ├── icon-192.png       # PWA icon (small)
│   │   ├── icon-512.png       # PWA icon (large)
│   │   └── favicon.ico
│   │
│   ├── fonts/
│   │   └── fontawesome.woff2  # Icon font
│   │
│   └── images/
│       └── logo.svg           # Branding
│
└── .well-known/
    └── assetlinks.json        # Android TWA support (optional)
```

### index.html (Minimal Shell)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#667eea">

  <title>ForwardEmail Webmail</title>

  <!-- PWA Manifest -->
  <link rel="manifest" href="/manifest.json">

  <!-- Icons -->
  <link rel="icon" href="/assets/icons/favicon.ico">
  <link rel="apple-touch-icon" href="/assets/icons/icon-192.png">

  <!-- Critical CSS (inlined) -->
  <style>
    /* ~10KB critical CSS for initial render */
    body { margin: 0; font-family: sans-serif; }
    #app-loading { display: flex; justify-content: center; align-items: center; height: 100vh; }
    .spinner { animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>

  <!-- Deferred CSS -->
  <link rel="preload" href="/css/app.min.css" as="style" onload="this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/css/app.min.css"></noscript>

  <!-- Resource hints -->
  <link rel="preconnect" href="https://api.forwardemail.net">
  <link rel="dns-prefetch" href="https://api.forwardemail.net">
</head>
<body>
  <!-- Loading state -->
  <div id="app-loading">
    <div class="spinner">⟳</div>
    <p>Loading ForwardEmail Webmail...</p>
  </div>

  <!-- App root (hidden until Knockout binds) -->
  <div id="app" hidden>
    <!-- SnappyMail UI injected here by Knockout -->
  </div>

  <!-- Service Worker Registration -->
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('SW registered:', reg.scope))
          .catch(err => console.error('SW registration failed:', err));
      });
    }
  </script>

  <!-- Main application bundle -->
  <script src="/js/app.bundle.js" defer></script>

  <!-- No-JavaScript fallback -->
  <noscript>
    <div style="text-align: center; margin-top: 50px;">
      <h1>JavaScript Required</h1>
      <p>ForwardEmail Webmail requires JavaScript to function.</p>
      <p>Please enable JavaScript in your browser and reload.</p>
    </div>
  </noscript>
</body>
</html>
```

**Key Points:**
- **10KB total** (including inline CSS)
- **No server-side variables** - Pure static HTML
- **No templates embedded** - All templates in app.bundle.js
- **Service worker registered** on load
- **Critical CSS inlined** for instant FCP
- **Deferred CSS** for non-critical styles

---

## 3. Service Worker Strategy

### Service Worker Lifecycle

```javascript
// sw.js - Service Worker

const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `webmail-static-${CACHE_VERSION}`;
const API_CACHE = `webmail-api-${CACHE_VERSION}`;
const OFFLINE_PAGE = '/offline.html';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/app.min.css',
  '/js/app.bundle.js',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/fonts/fontawesome.woff2',
  '/manifest.json',
  OFFLINE_PAGE
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('webmail-') && name !== STATIC_CACHE && name !== API_CACHE)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim()) // Take control immediately
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests: Network-first, cache fallback
  if (url.origin === 'https://api.forwardemail.net') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone response to cache
          const responseClone = response.clone();

          // Cache GET requests only
          if (request.method === 'GET') {
            caches.open(API_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }

          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(request)
            .then((cached) => {
              if (cached) {
                console.log('[SW] Serving API from cache:', request.url);
                return cached;
              }

              // No cache, return offline response
              return new Response(
                JSON.stringify({ error: 'Offline', message: 'No network connection' }),
                { status: 503, headers: { 'Content-Type': 'application/json' } }
              );
            });
        })
    );
    return;
  }

  // Static assets: Cache-first, network fallback
  event.respondWith(
    caches.match(request)
      .then((cached) => {
        if (cached) {
          console.log('[SW] Serving from cache:', request.url);
          return cached;
        }

        // Not in cache, fetch from network
        return fetch(request)
          .then((response) => {
            // Cache for future use
            if (request.method === 'GET' && response.status === 200) {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }

            return response;
          })
          .catch(() => {
            // Show offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match(OFFLINE_PAGE);
            }

            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Background sync - retry failed API requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

async function syncMessages() {
  // Retrieve failed requests from IndexedDB
  // Retry sending to API
  // Update UI via postMessage
  console.log('[SW] Background sync: messages');
}

// Push notifications (future feature)
self.addEventListener('push', (event) => {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: '/assets/icons/icon-192.png',
    badge: '/assets/icons/badge.png',
    data: { url: data.url }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
```

### Caching Strategies

**Static Assets (Cache-First):**
```
User requests /js/app.bundle.js
  ↓
SW checks cache
  ├─ Found in cache → Return cached version (instant)
  └─ Not in cache → Fetch from network → Cache → Return
```

**API Requests (Network-First):**
```
User requests /v1/webmail/folders
  ↓
SW tries network
  ├─ Network success → Cache response → Return
  └─ Network failed → Check cache
      ├─ Found in cache → Return stale data (offline mode)
      └─ Not in cache → Return 503 error
```

**Benefits:**
- **Offline folders** - Previously viewed folders available offline
- **Offline messages** - Cached message list visible without network
- **Instant load** - Static assets served from cache (~50ms)
- **Background sync** - Failed sends retried when online

---

## 4. Authentication Flow

### Pure Client-Side Auth

**No server-side sessions, no cookies, 100% client-side:**

```javascript
// auth.js - Authentication module

class WebmailAuth {
  constructor() {
    this.API_BASE = 'https://api.forwardemail.net';
    this.STORAGE_KEY = 'webmail_credentials';
  }

  // Check if user is authenticated
  isAuthenticated() {
    const credentials = this.getCredentials();
    return credentials !== null;
  }

  // Get stored credentials
  getCredentials() {
    const encrypted = localStorage.getItem(this.STORAGE_KEY);
    if (!encrypted) return null;

    try {
      // Decrypt credentials (stored encrypted)
      const decrypted = this.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (err) {
      console.error('Failed to decrypt credentials:', err);
      return null;
    }
  }

  // Store credentials (encrypted)
  async login(email, password) {
    // Test credentials by making API call
    const testAuth = btoa(`${email}:${password}`);

    try {
      const response = await fetch(`${this.API_BASE}/v1/webmail/folders`, {
        headers: {
          'Authorization': `Basic ${testAuth}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid email or password');
        }
        throw new Error('Login failed');
      }

      // Credentials valid, store encrypted
      const credentials = { email, password };
      const encrypted = this.encrypt(JSON.stringify(credentials));
      localStorage.setItem(this.STORAGE_KEY, encrypted);

      return true;
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  }

  // Logout - clear credentials
  logout() {
    localStorage.removeItem(this.STORAGE_KEY);

    // Clear all webmail data
    this.clearCache();
  }

  // Get Authorization header for API requests
  getAuthHeader() {
    const credentials = this.getCredentials();
    if (!credentials) return null;

    const auth = btoa(`${credentials.email}:${credentials.password}`);
    return `Basic ${auth}`;
  }

  // Make authenticated API request
  async apiRequest(endpoint, options = {}) {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${this.API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        ...options.headers
      }
    });

    // Handle 401 - credentials expired/invalid
    if (response.status === 401) {
      this.logout();
      window.location.reload();
      throw new Error('Authentication expired');
    }

    return response;
  }

  // Simple encryption (Web Crypto API)
  encrypt(data) {
    // TODO: Use Web Crypto API for proper encryption
    // For now, base64 encoding (NOT SECURE, placeholder)
    return btoa(data);
  }

  decrypt(encrypted) {
    // TODO: Use Web Crypto API for proper decryption
    return atob(encrypted);
  }

  // Clear all cached data
  clearCache() {
    // Clear localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('webmail_') || key.startsWith('rl-') || key.startsWith('sm-')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Clear IndexedDB
    if ('indexedDB' in window) {
      indexedDB.deleteDatabase('webmail');
    }

    // Clear service worker cache
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('api')) {
            caches.delete(name);
          }
        });
      });
    }
  }
}

export default new WebmailAuth();
```

### Login Flow (Client-Only)

```html
<!-- login.html (can be part of index.html SPA routing) -->
<div id="login-view">
  <h1>ForwardEmail Webmail</h1>

  <form id="login-form">
    <input type="email" name="email" placeholder="you@example.com" required>
    <input type="password" name="password" placeholder="Password" required>
    <button type="submit">Sign In</button>
  </form>

  <div id="login-error" hidden></div>
</div>

<script type="module">
  import auth from '/js/auth.js';

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    const errorDiv = document.getElementById('login-error');

    try {
      await auth.login(email, password);

      // Login successful, navigate to inbox
      window.location.hash = '#/inbox';
    } catch (err) {
      // Show error
      errorDiv.textContent = err.message;
      errorDiv.hidden = false;
    }
  });
</script>
```

**Security Considerations:**

⚠️ **Credential Storage:**
- Currently using localStorage (not ideal)
- Should encrypt with Web Crypto API
- Consider using IndexedDB for better security
- Alternative: Store only session token, not password

**Better Approach:**
```javascript
// Server API endpoint: POST /v1/webmail/auth/login
// Returns JWT token instead of requiring password every request

async login(email, password) {
  const response = await fetch(`${this.API_BASE}/v1/webmail/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const { token, refreshToken } = await response.json();

  // Store tokens (encrypted)
  localStorage.setItem('webmail_token', token);
  localStorage.setItem('webmail_refresh_token', this.encrypt(refreshToken));
}

// API requests use token instead of password
getAuthHeader() {
  const token = localStorage.getItem('webmail_token');
  return token ? `Bearer ${token}` : null;
}
```

---

## 5. API Backend Requirements

### API Endpoints (Already Exist)

**All endpoints at:** `https://api.forwardemail.net/v1/webmail/*`

```
Authentication:
POST   /v1/webmail/auth/login        # New: Return JWT token
POST   /v1/webmail/auth/refresh      # New: Refresh expired token
POST   /v1/webmail/auth/logout       # Optional: Invalidate token

Folders:
GET    /v1/webmail/folders            # List all folders
POST   /v1/webmail/folders            # Create folder
PUT    /v1/webmail/folders/:id        # Rename folder
DELETE /v1/webmail/folders/:id        # Delete folder

Messages:
GET    /v1/webmail/messages           # List messages (query: folder, limit, offset)
GET    /v1/webmail/messages/:id       # Get full message
POST   /v1/webmail/messages/:id/flags # Update flags (read, starred, etc.)
DELETE /v1/webmail/messages/:id       # Delete message
POST   /v1/webmail/messages/:id/move  # Move to folder

Compose:
POST   /v1/webmail/send               # Send message
POST   /v1/webmail/drafts             # Save draft
PUT    /v1/webmail/drafts/:id         # Update draft
DELETE /v1/webmail/drafts/:id         # Delete draft

Search:
GET    /v1/webmail/search             # Search messages (query: q, folder)

Attachments:
GET    /v1/webmail/attachments/:id    # Download attachment
POST   /v1/webmail/attachments        # Upload attachment (for compose)
```

### CORS Configuration

**API server must allow:** `https://mail.forwardemail.net`

```javascript
// API server (api.forwardemail.net)
// CORS middleware configuration

app.use(cors({
  origin: [
    'https://mail.forwardemail.net',
    'https://mail-staging.forwardemail.net',
    'http://localhost:3001' // Development
  ],
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 86400 // 24 hours
}));
```

### Rate Limiting (API-Side)

**Move rate limiting to API server:**

```javascript
// api/v1/webmail routes
// Apply rate limiting per authenticated user (not IP)

router.use('/v1/webmail/*', async (ctx, next) => {
  const authHeader = ctx.request.headers.authorization;
  const user = await getUserFromAuth(authHeader);

  // Rate limit by user email
  const key = `ratelimit:webmail:${user.email}`;
  const limit = 1000; // requests per hour

  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, 3600); // 1 hour
  }

  if (current > limit) {
    ctx.status = 429;
    ctx.body = { error: 'Rate limit exceeded' };
    return;
  }

  ctx.set('X-RateLimit-Limit', limit);
  ctx.set('X-RateLimit-Remaining', limit - current);

  await next();
});
```

### API Response Format

**Consistent JSON responses:**

```javascript
// Success response
{
  "success": true,
  "data": {
    "folders": [...]
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "details": {}
  }
}

// Pagination
{
  "success": true,
  "data": {
    "messages": [...],
    "pagination": {
      "total": 1250,
      "limit": 50,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

---

## 6. Migration Plan

### Phase 1: Preparation (Week 1)

**Tasks:**
1. ✅ Create static build pipeline
   - Configure Vite/Rollup for pure client build
   - Remove Pug templates, use HTML
   - Bundle all Knockout templates into JS

2. ✅ Implement service worker
   - Cache static assets
   - Cache API responses
   - Offline support

3. ✅ Update authentication
   - Remove server-side session checks
   - Implement pure client-side auth
   - Encrypt credentials in localStorage

4. ✅ Test locally
   - Run static server (e.g., `python -m http.server`)
   - Point to api.forwardemail.net for data
   - Verify all features work

### Phase 2: API Updates (Week 2)

**Tasks:**
1. ✅ Add CORS headers to API
   - Allow `mail.forwardemail.net` origin
   - Configure preflight requests

2. ✅ Implement JWT authentication (optional but recommended)
   - POST /v1/webmail/auth/login → return token
   - Use Bearer tokens instead of Basic Auth

3. ✅ Move rate limiting to API
   - Rate limit by user, not IP
   - Return rate limit headers

4. ✅ Test API from static client
   - Verify CORS works
   - Test authentication flow
   - Check rate limiting

### Phase 3: Static Deployment (Week 3)

**Tasks:**
1. ✅ Deploy to CDN
   - Upload static files to S3/Cloudflare
   - Configure `mail.forwardemail.net` DNS
   - Enable HTTPS

2. ✅ Configure caching
   - HTML: Cache-Control: no-cache
   - JS/CSS: Cache-Control: max-age=31536000, immutable
   - Service worker: Cache-Control: no-cache

3. ✅ Test production
   - Verify PWA installation
   - Test offline mode
   - Check service worker updates

4. ✅ Monitor & optimize
   - Setup error tracking (Sentry)
   - Monitor performance (RUM)
   - Analyze bundle size

### Phase 4: Cleanup (Week 4)

**Tasks:**
1. ✅ Remove old webmail routes
   - Delete `routes/public-webmail.js`
   - Delete `app/controllers/web/webmail.js`
   - Delete `app/views/webmail*.pug`

2. ✅ Update documentation
   - Document new architecture
   - Update deployment guides
   - Add troubleshooting

3. ✅ Deprecation notice
   - Add notice on old `/webmail` route
   - Redirect to `mail.forwardemail.net`
   - Remove after 30 days

---

## 7. Build & Deployment

### Build Pipeline (Vite)

**vite.config.js:**

```javascript
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  root: 'webmail-client',
  build: {
    outDir: '../dist/webmail',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['knockout', 'underscore', 'moment'],
          snappymail: ['./src/snappymail-core.js']
        }
      }
    }
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ForwardEmail Webmail',
        short_name: 'Webmail',
        description: 'Privacy-focused email client',
        theme_color: '#667eea',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/assets/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/assets/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.forwardemail\.net\/v1\/webmail\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 300 // 5 minutes
              }
            }
          }
        ]
      }
    })
  ]
});
```

**Build commands:**

```bash
# Development server
npm run dev
# → Starts Vite dev server on localhost:3001

# Production build
npm run build
# → Outputs to dist/webmail/
#   ├── index.html
#   ├── manifest.json
#   ├── sw.js
#   ├── assets/
#   │   ├── app.bundle.js
#   │   └── app.min.css

# Preview production build
npm run preview
# → Serves dist/webmail/ locally for testing
```

### Deployment Options

**Option 1: Cloudflare Pages (Recommended)**

```bash
# Push to GitHub repo
git push origin main

# Cloudflare Pages auto-deploys:
# - Build command: npm run build
# - Output directory: dist/webmail
# - Deploy to: mail.forwardemail.net
# - Edge locations: Worldwide
# - HTTPS: Automatic
```

**Option 2: AWS S3 + CloudFront**

```bash
# Build
npm run build

# Sync to S3
aws s3 sync dist/webmail/ s3://mail.forwardemail.net/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html" \
  --exclude "sw.js"

# HTML and SW (no cache)
aws s3 sync dist/webmail/ s3://mail.forwardemail.net/ \
  --exclude "*" \
  --include "*.html" \
  --include "sw.js" \
  --cache-control "no-cache"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id E1234567890 \
  --paths "/*"
```

**Option 3: Nginx (Self-Hosted)**

```nginx
# /etc/nginx/sites-available/mail.forwardemail.net

server {
  listen 443 ssl http2;
  server_name mail.forwardemail.net;

  root /var/www/mail.forwardemail.net;
  index index.html;

  # SSL certificates
  ssl_certificate /etc/letsencrypt/live/mail.forwardemail.net/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/mail.forwardemail.net/privkey.pem;

  # Security headers
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "same-origin" always;

  # Service worker (no cache)
  location = /sw.js {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
  }

  # HTML (no cache)
  location ~ \.html$ {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
  }

  # Static assets (cache forever)
  location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|ico)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  # SPA fallback (all routes to index.html)
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Gzip compression
  gzip on;
  gzip_types text/css application/javascript application/json image/svg+xml;
  gzip_min_length 1000;
}
```

---

## 8. Benefits & Trade-offs

### Benefits ✅

**Architecture:**
- ✅ **Complete independence** - No coupling to main app
- ✅ **Simpler deployment** - Just static files, no Node.js
- ✅ **No middleware overhead** - No sessions, no Passport checks
- ✅ **API-first** - Clean separation of concerns

**Performance:**
- ✅ **CDN edge delivery** - Sub-50ms TTFB worldwide
- ✅ **Offline-first** - Works without network
- ✅ **Instant repeat visits** - Service worker cache
- ✅ **Progressive Web App** - Install like native app

**Development:**
- ✅ **Faster builds** - Vite HMR vs Gulp
- ✅ **Easier testing** - Static server, no backend needed
- ✅ **Better DX** - Modern tooling, TypeScript support
- ✅ **Cleaner codebase** - Remove Pug, server controllers

**Operations:**
- ✅ **Cheaper hosting** - S3/Cloudflare Pages vs VPS
- ✅ **Better scaling** - CDN handles traffic spikes
- ✅ **Less maintenance** - No server to patch/update
- ✅ **Higher availability** - CDN edge locations

### Trade-offs ⚠️

**Security:**
- ⚠️ **Credentials in localStorage** - Less secure than httpOnly cookies
  - Mitigation: Encrypt with Web Crypto API
  - Better: Use JWT tokens with short expiration
- ⚠️ **XSS risk** - All auth client-side
  - Mitigation: CSP headers, sanitize all inputs
- ⚠️ **CORS required** - API must allow origin
  - Mitigation: Strict origin whitelist

**Functionality:**
- ⚠️ **No server-side validation** - All validation on API
  - Mitigation: API already validates, no change needed
- ⚠️ **No rate limiting on client** - Must be API-side
  - Mitigation: API already has rate limiting
- ⚠️ **No SSR for SEO** - Not important for auth-required app
  - N/A: Webmail doesn't need SEO

**Complexity:**
- ⚠️ **Service worker complexity** - Debugging offline mode
  - Mitigation: Good logging, clear error messages
- ⚠️ **Cache invalidation** - Must handle SW updates
  - Mitigation: Version-based cache names
- ⚠️ **Offline sync** - Background sync implementation
  - Mitigation: Start simple, iterate

### Recommendation

**Proceed with pure client-side architecture:**

The benefits significantly outweigh the trade-offs. The main security concern (credentials in localStorage) can be mitigated with:

1. **JWT tokens** instead of storing passwords
2. **Web Crypto API** encryption
3. **Short token expiration** (15-30 min) with refresh tokens
4. **Strict CSP** headers

The architecture is simpler, faster, cheaper, and more scalable. The only real "loss" is httpOnly cookies for auth, but the API already uses Basic Auth / tokens, so this is consistent.

---

## Next Steps

1. **Create new repo:** `forwardemail-webmail-client`
2. **Setup Vite build** with PWA plugin
3. **Convert Pug templates** to HTML/JS templates
4. **Implement service worker** with offline support
5. **Add JWT authentication** to API (optional but recommended)
6. **Deploy to Cloudflare Pages** as mail.forwardemail.net
7. **Test thoroughly** - offline mode, PWA install, all features
8. **Remove old webmail** from main app after migration

---

**Estimated Timeline:** 3-4 weeks
**Estimated Cost Savings:** ~$50-100/month (VPS → CDN)
**Performance Improvement:** 50-70% faster initial load
**Availability Improvement:** 99.9% → 99.99% (CDN SLA)

