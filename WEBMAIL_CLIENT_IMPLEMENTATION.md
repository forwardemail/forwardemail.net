# Webmail Client Implementation Status

**Date:** November 24, 2024
**Status:** In Progress (scaffold created)

---

## Current State

### ✅ Implementation Snapshot (2025-02)

- Login validates alias credentials via `GET /v1/folders` (Basic email:password); stores `alias_auth`/email.
- Mailbox: INBOX-first sorting, debounced search, pagination, unread filter and badge updates, mark read/unread, message reader with sanitized HTML, attachment list (no inline cid mapping yet).
- Compose: TipTap rich editor (bold/italic/underline/strike/lists/quote/code/link, plain-text toggle), To/CC/BCC chips with validation, attachments as base64, uses alias email for envelope and `/v1/emails` with stored API key (`webmail_api_key` or `api_token`) when present.
- Settings: API key storage, theme toggle (system/light/dark) with light-mode overrides; compose/settings modals styled.
- Theming: dark by default; light mode with improved contrast; responsive tweaks for smaller screens.
- Known gap: inline attachments require API `cid`/URL mapping; current fallback shows attachments in a list and attempts data URLs when available.

### ✅ New Client Scaffold

- ✅ Added `webmail-client/` Vite + Knockout app with PWA (VitePWA) config
- ✅ Login view + starfield background + placeholder `/mailbox` route with sign-out
- ✅ Utilities for API (`Remote`), storage (`Local`), starfield canvas, and Knockout bootstrapping
- ✅ Mailbox skeleton UI (folders, message list, reader pane with sample data and selection)
- ✅ API wiring uses Basic Auth header (`alias_auth`) from login for mailbox requests; token stored but not required
- ✅ Root NPM scripts: `webmail:dev`, `webmail:build`, `webmail:preview`
- ✅ Generated placeholder PWA icons (192/512) in `webmail-client/public/icons`
- ⏳ Pending assets: fonts (Nunito Sans, VC Honey) to place in `webmail-client/public/fonts`
    - ✅ Added search (debounced), pagination, unread filter, mark read/unread, and attachment list; compose modal stub exists.

### ✅ Completed: Old Code Removal

All legacy webmail code has been removed from the main forwardemail.net application:

- ✅ Removed `webmail-src/` submodule (SnappyMail upstream)
- ✅ Removed `webmail-overrides/` directory (themes, plugins, configs)
- ✅ Removed `routes/public-webmail.js` (server routes)
- ✅ Removed `app/controllers/web/webmail.js` (controller)
- ✅ Removed `app/views/webmail*` (Pug templates)
- ✅ Removed `assets/webmail/` (old assets)
- ✅ Removed `build/webmail/` (built output)
- ✅ Removed `scripts/build-webmail.sh` (build script)
- ✅ Cleaned `gulpfile.js` (removed webmail tasks)
- ✅ Cleaned `config/web.js` (removed webmail routes registration)
- ✅ Cleaned `config/i18n.js` (removed /webmail from ignored paths)

### 📁 Created: New Directory Structure

```
webmail-client/
├── src/
│   ├── components/     # UI components
│   ├── styles/         # CSS files
│   ├── utils/          # Utility functions
│   └── assets/
│       ├── img/        # Images (logo, icons)
│       └── fonts/      # Local font files
└── public/             # Static files (manifest, icons)
```

---

## Implementation Plan

Based on the provided requirements, here's what needs to be built:

### Phase 1: Source Material Needed

Since `mail-overrides/` was removed, we need to either:

**Option A: Restore from Git History**
```bash
# Temporarily checkout the files we need
git show HEAD~1:webmail-overrides/plugins/forwardemail/templates/Views/User/Login.html > temp-login.html
git show HEAD~1:webmail-overrides/themes/ForwardEmail/login-page.css > temp-login-page.css
git show HEAD~1:webmail-overrides/themes/ForwardEmail/images/background.css > temp-background.css
git show HEAD~1:webmail-overrides/themes/ForwardEmail/styles.css > temp-styles.css
# Extract what we need, then delete temp files
```

**Option B: Build Fresh Implementation**
Create a new standalone login page using:
- Knockout.js for MVVM bindings
- ForwardEmail branding (colors, fonts, logo)
- Starfield background animation
- Clean card-based login form

**Recommendation:** Option B - Build fresh with modern tooling

---

## Phase 2: Component Breakdown

### 1. Login Page Structure

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

  <!-- Critical CSS (Inlined) -->
  <style>
    /* Brand Variables */
    :root {
      --brand-primary: #667eea;
      --brand-secondary: #764ba2;
      --brand-bg: #ffffff;
      --brand-text: #2d3748;
      --brand-font: 'Nunito Sans', sans-serif;
      --brand-heading-font: 'VC Honey', cursive;
    }

    /* Reset & Base */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: var(--brand-font);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Starfield Background */
    #stars, #stars2, #stars3 {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }

    /* Login Card */
    .fe-login-wrapper {
      position: relative;
      z-index: 1;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      padding: 40px;
      width: 90%;
      max-width: 400px;
    }

    /* Form Elements */
    .LoginView input[type="email"],
    .LoginView input[type="password"] {
      width: 100%;
      padding: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 16px;
      margin-bottom: 16px;
    }

    .LoginView button[type="submit"] {
      width: 100%;
      padding: 12px;
      background: var(--brand-primary);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .LoginView button[type="submit"]:hover {
      background: var(--brand-secondary);
    }
  </style>
</head>
<body id="rl-app">
  <!-- Starfield layers -->
  <div id="stars"></div>
  <div id="stars2"></div>
  <div id="stars3"></div>

  <!-- Login Card -->
  <div class="fe-login-wrapper">
    <div class="LoginView" data-bind="with: loginUserView">
      <!-- Logo -->
      <div class="logo">
        <svg><!-- ForwardEmail logo SVG --></svg>
        <h1>Webmail</h1>
      </div>

      <!-- Login Form -->
      <form data-bind="submit: submitForm">
        <input
          type="email"
          placeholder="you@example.com"
          data-bind="textInput: email"
          required>

        <input
          type="password"
          placeholder="Password"
          data-bind="textInput: password"
          required>

        <label>
          <input
            type="checkbox"
            data-bind="checked: signMe">
          Remember me
        </label>

        <button
          type="submit"
          data-bind="enable: !submitRequest(), text: submitButtonText">
          Sign In
        </button>

        <!-- Error Display -->
        <div
          class="alert alert-danger"
          data-bind="visible: submitError, text: submitError">
        </div>
      </form>
    </div>
  </div>

  <!-- App Bundle (Knockout + LoginView) -->
  <script src="/js/app.bundle.js"></script>
</body>
</html>
```

### 2. LoginUserView (Knockout ViewModel)

```javascript
// src/components/LoginUserView.js

import ko from 'knockout';
import { Remote } from '../utils/remote';
import { Local } from '../utils/storage';

export class LoginUserView {
  constructor() {
    // Observable properties
    this.email = ko.observable('');
    this.password = ko.observable('');
    this.signMe = ko.observable(Local.get('signMe') === '1');
    this.submitRequest = ko.observable(false);
    this.submitError = ko.observable('');
    this.submitErrorAdditional = ko.observable('');

    // Computed
    this.submitButtonText = ko.computed(() => {
      return this.submitRequest() ? 'Signing in...' : 'Sign In';
    });
  }

  submitForm = () => {
    if (this.submitRequest()) return false;

    const email = this.email().trim();
    const password = this.password();

    if (!email || !password) {
      this.submitError('Please enter both email and password');
      return false;
    }

    this.submitRequest(true);
    this.submitError('');

    // Call auth API
    Remote.request('Login', {
      Email: email,
      Password: password,
      SignMe: this.signMe() ? '1' : '0'
    })
      .then((result) => {
        if (result && result.Result) {
          // Save credentials
          Local.set('signMe', this.signMe() ? '1' : '0');
          Local.set('email', email);

          // Store auth token
          if (result.Result.Token) {
            Local.set('authToken', result.Result.Token);
          } else {
            // Fallback to Basic Auth
            Local.set('alias_auth', `${email}:${password}`);
          }

          // Redirect to main app
          window.location.href = '/mailbox';
        } else {
          this.submitError('Login failed');
        }

        this.submitRequest(false);
      })
      .catch((error) => {
        this.submitError(error.message || 'Login failed');
        this.submitRequest(false);
      });

    return false;
  };
}
```

### 3. Remote Utility (API Client)

```javascript
// src/utils/remote.js

const API_BASE = 'https://api.forwardemail.net';

export const Remote = {
  async request(action, params = {}) {
    const endpoint = this.getEndpoint(action);

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error(`Remote.${action} failed:`, error);
      throw error;
    }
  },

  getEndpoint(action) {
    const endpoints = {
      'Login': '/v1/webmail/auth/login',
      'Folders': '/v1/webmail/folders',
      'MessageList': '/v1/webmail/messages',
      'Message': '/v1/webmail/messages'
      // ... other endpoints
    };

    return endpoints[action] || `/v1/webmail/${action.toLowerCase()}`;
  }
};
```

### 4. Local Storage Utility

```javascript
// src/utils/storage.js

export const Local = {
  get(key) {
    try {
      return localStorage.getItem(`webmail_${key}`);
    } catch (e) {
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(`webmail_${key}`, value);
      return true;
    } catch (e) {
      console.error('localStorage.setItem failed:', e);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(`webmail_${key}`);
      return true;
    } catch (e) {
      return false;
    }
  },

  clear() {
    try {
      // Clear only webmail keys
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('webmail_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (e) {
      return false;
    }
  }
};
```

---

## Phase 3: Assets

### Fonts (Download Locally)

**Nunito Sans:**
```css
@font-face {
  font-family: 'Nunito Sans';
  src: url('/fonts/NunitoSans-Regular.woff2') format('woff2'),
       url('/fonts/NunitoSans-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Nunito Sans';
  src: url('/fonts/NunitoSans-Bold.woff2') format('woff2'),
       url('/fonts/NunitoSans-Bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

**VC Honey:**
```css
@font-face {
  font-family: 'VC Honey';
  src: url('/fonts/VCHoney-Regular.woff2') format('woff2'),
       url('/fonts/VCHoney-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

**Download from:**
- Nunito Sans: https://fonts.google.com/specimen/Nunito+Sans
- VC Honey: https://fonts.google.com/specimen/VC+Honey+Deck (or alternative heading font)

### Logo SVG

```svg
<!-- logo-icon.svg -->
<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <rect width="40" height="40" rx="8" fill="url(#gradient)"/>
  <path d="M10 15 L20 25 L30 15" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#667eea"/>
      <stop offset="100%" stop-color="#764ba2"/>
    </linearGradient>
  </defs>
</svg>
```

### Starfield Animation

```css
/* background-stars.css */
#stars {
  background: transparent url('/img/stars-small.png') repeat top center;
  animation: move-stars 200s linear infinite;
}

#stars2 {
  background: transparent url('/img/stars-medium.png') repeat top center;
  animation: move-stars 400s linear infinite;
}

#stars3 {
  background: transparent url('/img/stars-large.png') repeat top center;
  animation: move-stars 600s linear infinite;
}

@keyframes move-stars {
  from { transform: translateY(0); }
  to { transform: translateY(-2000px); }
}
```

Or use Canvas/CSS-only stars:

```javascript
// src/utils/starfield.js
export function createStarfield(canvasId, starCount = 200) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const stars = [];
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      opacity: Math.random()
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();

      // Twinkle effect
      star.opacity += (Math.random() - 0.5) * 0.1;
      star.opacity = Math.max(0.1, Math.min(1, star.opacity));
    });

    requestAnimationFrame(animate);
  }

  animate();
}
```

---

## Phase 4: PWA Setup

### manifest.json

```json
{
  "name": "ForwardEmail Webmail",
  "short_name": "Webmail",
  "description": "Privacy-focused email client",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#667eea",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### service-worker.js

```javascript
const CACHE_NAME = 'webmail-v1';
const STATIC_CACHE = [
  '/',
  '/index.html',
  '/js/app.bundle.js',
  '/css/app.css',
  '/fonts/NunitoSans-Regular.woff2',
  '/fonts/NunitoSans-Bold.woff2',
  '/img/logo-icon.svg',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => {
        return Promise.all(
          names
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests: network-first
  if (url.origin === 'https://api.forwardemail.net') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request)
      .then((cached) => cached || fetch(request))
  );
});
```

---

## Phase 5: Build Configuration

### package.json

```json
{
  "name": "forwardemail-webmail-client",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "knockout": "^3.5.1"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "vite-plugin-pwa": "^0.17.0"
  }
}
```

### vite.config.js

```javascript
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  root: '.',
  build: {
    outDir: '../dist/webmail',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['fonts/**/*', 'img/**/*'],
      manifest: false, // We provide our own manifest.json
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff,woff2,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.forwardemail\.net\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 300
              }
            }
          }
        ]
      }
    })
  ]
});
```

---

## Next Steps

1. **Create the basic files:**
   - `webmail-client/index.html` - Login page shell
   - `webmail-client/src/main.js` - Entry point
   - `webmail-client/src/components/LoginUserView.js` - ViewModel
   - `webmail-client/src/utils/remote.js` - API client
   - `webmail-client/src/utils/storage.js` - localStorage wrapper

2. **Download assets:**
   - Fonts: Nunito Sans, VC Honey (or alternative)
   - Icons: Create 192x192 and 512x512 PNG icons
   - Logo: SVG logo files

3. **Setup build:**
   - Install Vite + dependencies
   - Configure PWA plugin
   - Test local dev server

4. **Implement login:**
   - Wire up Knockout bindings
   - Connect to API endpoint
   - Test auth flow

5. **Add PWA features:**
   - Service worker caching
   - Offline support
   - Install prompt

6. **Deploy:**
   - Build production bundle
   - Deploy to mail.forwardemail.net
   - Test from production

**Updated next steps (post-implementation):**
- Finish assets (fonts/icons) and run production build.
- Inline attachments support once API exposes `cid`/download URLs; consider attachment upload flow instead of base64.
- Compose enhancements: From selector (aliases), drafts, error toasts, keyboard shortcuts, reply/reply-all/forward stubs.
- Recipient UX polish: chip autocomplete (contacts/CardDAV) when available.
- Message actions: delete/move, unread indicators in list, retries on errors.
- Settings page (or modal) expansion: PGP support, contacts sync, additional preferences.
- Styling/mobile polish: light-mode contrast fixes (message canvas, headers/buttons, emoji picker), responsive stacking for folders/messages/reader on small screens, consistent padding/spacing.
- Send robustness: offline/outbox queue via IDB + replay, error toasts/retry.
- Crypto: signature verification indicator, clearer decrypt error states.
- Search/filter: filters (has attachment/date range) using cached data; optional body indexing.
- PWA polish: clear caches on sign-out, offline fallback page, install prompt/icons.

---

## Deferred: Mailbox UI

The main mailbox interface (folders, messages, compose) will be built in a second phase after login is working. This keeps the initial implementation focused and testable.

For now, after successful login, redirect to a placeholder `/mailbox` route that shows:
- "Welcome to ForwardEmail Webmail"
- User's email address
- Logout button
- "Mailbox UI coming soon" message

---

**Status:** Ready to begin implementation
**Next Action:** Create basic file structure and HTML/JS boilerplate

---

### Progress Notes / TODO

- ✅ Mailbox UI skeleton, dark theme/branding, search (debounced), pagination, unread filter, mark read/unread, attachment list, and compose modal stub.
- ⚠️ Attachments: current API returns Buffers without `cid`/URL mapping; inline images (e.g., `<img alt>` with no `src`) cannot be resolved. TODO: API should return `cid` and/or download URLs per attachment so inline images and downloads map cleanly. Attachment list currently uses data URLs when available and shows name/size.
- ⏳ Assets: final fonts (Nunito Sans, VC Honey) and maskable icons still needed.
- 🚧 Compose roadmap: add full-featured compose (Gmail-like) in phases:
  - Recipients: To/CC/BCC chips with add/remove, validation; CC/BCC toggles added. Optional From selector (when aliases are available) is still pending.
  - Rich editor: TipTap editor in place (bold/italic/links/lists/quotes, underline/highlight); add plain-text toggle, auto-generate text for payloads.
  - Attachments: file picker/drag-drop, show chips with name/size/progress, remove; support inline images with `cid` mapping; enforce size/type limits.
  - Send flow: loading/disable, errors with retry, success toast/clear; optional drafts (localStorage + `Drafts` folder).
  - Extras: reply/reply-all/forward entry points, keyboard shortcuts, recipient autocomplete (contacts), inline error handling.
- ✅ Settings page + modal upgraded (accessible at `/mailbox/settings`): theme toggle (system/light/dark), sending API key storage for `/v1/emails`, default “plain text compose” preference, clear saved data, sign out/back-to-mailbox controls; light-mode overrides applied.
- ✅ Message actions: reader supports mark read/unread and delete (hard delete via `/v1/messages/:id`); move APIs wired but UI deferred.
- ✅ Actions dropdown (⋯) in reader: reply/forward (prefills compose), mark read/unread, delete, download original (.eml) using alias auth fetch. (Move will return later on the list view.)
- ✅ Settings adds PGP private key storage list (local-only) with add/edit/remove (decrypt flow to follow).
- ✅ PGP detection/decrypt wiring: detect armored blocks, load saved keys, prompt for passphrase (tab-only cache or sessionStorage if user opts), decrypt with `openpgp`, and render decrypted body or an inline notice.
- ✅ Contacts autocomplete: fetches `/v1/contacts` (alias auth) and wires suggestions to To/CC/BCC via datalist; non-blocking if the API call fails.
- ✅ Search now uses a local FlexSearch index on loaded messages (subject/from/snippet) for instant filtering; falls back to list when empty.
- ✅ IndexedDB (Dexie) caching: folders, message lists per folder, and message bodies/attachments are cached for instant loads; cache is refreshed on fetch and used to seed search.
- ✅ Workbox config added for PWA shell: precaches built assets and cache-first for icons/images; SW registered in prod build.
- ✅ Login now probes `/v1/folders` with alias Basic auth (email:password) since `/v1/webmail/auth/login` is unavailable; stores alias auth/email (no API token).
- ✅ Compose send now uses alias basic auth (same as mailbox read) for `/v1/emails`; envelope uses alias email, attachments include `encoding: base64`.
- ✅ Recipient validation shows specific invalid email errors; requires at least one valid “To”.
- ✅ Folder list sorts INBOX first; unread badges update using API unread counts or local message counts.
