# Webmail Local Development Setup

## Overview

This guide covers how to set up and test the SnappyMail webmail integration locally.

## Architecture Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│ Dashboard (forwardemail.net)                                │
│ - Session-based auth (Passport.js)                          │
│ - Routes: /:locale/* (e.g., /en/my-account)                 │
│ - Protected by @ladjs/auth policies                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Webmail (currently /webmail, future: mail.forwardemail.net) │
│ - Client-side alias auth (localStorage.alias_auth)          │
│ - Routes: /webmail/* (no locale prefix)                     │
│ - Bypasses @ladjs/auth via hookBeforeRoutes                 │
│ - API: /v1/webmail/* (validates alias credentials)          │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

1. **Git submodules initialized**
   ```bash
   git submodule update --init webmail-src
   ```

2. **PHP installed** (optional, for version patching)
   ```bash
   brew install php  # macOS
   ```

3. **Node.js dependencies installed**
   ```bash
   npm install
   ```

## Build Process

### Step 1: Build SnappyMail Assets

Run the webmail build script:

```bash
npm run webmail:build
```

This script (`scripts/build-webmail.sh`) does the following:
1. Builds SnappyMail from `webmail-src/` submodule
2. Applies ForwardEmail customizations from `webmail-overrides/`
3. Outputs to `assets/webmail/build/`

**Output structure:**
```
assets/webmail/build/
├── snappymail/
│   └── v/
│       └── 0.0.0/
│           ├── static/
│           │   ├── css/
│           │   │   ├── boot.min.css
│           │   │   └── app.min.css
│           │   └── js/
│           │       ├── libs.js (Knockout, etc.)
│           │       └── app.js (SnappyMail core)
│           ├── themes/
│           │   └── ForwardEmail/
│           └── plugins/
└── js/
    ├── forwardemail-snappymail-adapter.js
    ├── init.js
    ├── start.js
    └── login-bridge.js
```

### Step 2: Build Main Assets

Run the main gulp build:

```bash
npm run build
```

This copies webmail assets to `build/` and compiles templates:
- `build/webmail/` - SnappyMail static assets (served at /webmail/*)
- `app/views/_snappymail_templates.pug` - Knockout templates

### Step 3: Start the Server

```bash
NODE_ENV=development node web.js
```

The server will start on http://localhost:3000

## Testing the Webmail Flow

### 1. Access Webmail Login Page

Navigate to: http://localhost:3000/webmail/login

**Expected behavior:**
- Page loads without requiring dashboard login
- Shows ForwardEmail login form
- No 302 redirects

**Troubleshooting:**
- If redirected to /en, check that `hookBeforeRoutes` is registered in config/web.js
- If 404, ensure webmail routes are registered in routes/public-webmail.js
- If CSS missing, run `npm run build` to copy assets

### 2. Enter Alias Credentials

The webmail login requires **alias credentials**, not dashboard credentials:

**Format:** `alias@yourdomain.com` : `password_or_token`

Example:
- Email: `hello@example.com`
- Password: Your alias password or generated token

**What happens:**
1. JavaScript captures form submission
2. Stores credentials in `localStorage.alias_auth` as base64
3. Redirects to `/webmail`

### 3. View Webmail Interface

Navigate to: http://localhost:3000/webmail

**Expected behavior:**
1. Page checks `localStorage.alias_auth`
2. If missing → redirects to `/webmail/login`
3. If present → loads SnappyMail UI
4. Makes API calls to `/v1/webmail/*` with Basic Auth

**What you should see:**
- SnappyMail loading screen
- Folder list (Inbox, Sent, Drafts, etc.)
- Message list
- Compose button

### 4. API Calls

Open browser DevTools Network tab and look for:

```
GET /v1/webmail/threads/INBOX
Headers:
  Authorization: Basic <base64 of alias@domain.com:password>
```

**Expected responses:**
- 200 OK with JSON data (folders, messages, etc.)
- 401 Unauthorized if credentials invalid
- 403 Forbidden if account banned

### 5. Test Logout

Navigate to: http://localhost:3000/webmail/logout

**Expected behavior:**
1. Clears `localStorage.alias_auth`
2. Redirects to `/webmail/login`
3. Does NOT clear dashboard session (if you're also logged into dashboard)

## Common Issues

### Issue: 302 Redirect to /en

**Cause:** i18n middleware redirects ALL routes to locale-prefixed URLs by default

**Fix:** Add webmail paths to `ignoredRedirectGlobs` in `config/i18n.js`:
```javascript
ignoredRedirectGlobs: [
  '/webmail',
  '/webmail/*',
  '/webmail/**/*'
]
```

This tells @ladjs/i18n to skip locale redirects for webmail routes.

### Issue: HTML Rendered as Text

**Cause:** Knockout templates escaped in Pug

**Fix:** Templates use dot notation (`.`) not pipe (`|`) in gulpfile.js (already fixed)

### Issue: Static Assets 404

**Symptoms:**
```
GET /webmail/snappymail/v/0.0.0/static/css/app.min.css 404
```

**Fix:**
```bash
npm run build  # Copies assets to build/webmail/
```

### Issue: API 401 Unauthorized

**Cause:** Invalid alias credentials or alias doesn't exist

**Debug:**
1. Check `localStorage.alias_auth` in browser console:
   ```javascript
   localStorage.getItem('alias_auth')
   // Should return: "alias@domain.com:password"
   ```

2. Verify alias exists in database and password is correct

3. Check API logs for authentication errors

### Issue: SnappyMail Not Loading

**Symptoms:** Blank page or "Loading..." indefinitely

**Debug:**
1. Open browser console for JavaScript errors
2. Check Network tab for failed requests
3. Verify all JS files loaded:
   - /webmail/snappymail/v/0.0.0/static/js/libs.js
   - /webmail/snappymail/v/0.0.0/static/js/app.js
   - /webmail/js/forwardemail-snappymail-adapter.js
   - /webmail/js/start.js

4. Check that `window.rl` object exists:
   ```javascript
   console.log(window.rl)
   ```

## Development Workflow

### Making Changes to Webmail Adapter

Edit: `assets/webmail/js/forwardemail-snappymail-adapter.js`

```bash
npm run build  # Rebuild to copy changes
# Restart server or refresh browser
```

### Making Changes to Webmail Views

Edit: `app/views/webmail.pug`, `app/views/webmail/login.pug`, etc.

```bash
# Just restart server (Pug templates compile on request in dev mode)
```

### Making Changes to SnappyMail Core

Edit files in: `webmail-src/` (submodule)

```bash
npm run webmail:build  # Rebuild SnappyMail
npm run build          # Copy to build/
# Restart server
```

### Making Changes to ForwardEmail Overrides

Edit files in: `webmail-overrides/`
- `themes/ForwardEmail/` - Custom theme CSS
- `plugins/` - Custom SnappyMail plugins
- `configs/` - Configuration files

```bash
npm run webmail:build  # Rebuild with overrides
npm run build          # Copy to build/
# Restart server
```

## API Endpoints Reference

All webmail API endpoints require alias auth via Basic Auth header.

### Authentication
- **Format:** `Authorization: Basic base64(alias@domain.com:password)`
- **Middleware:** `api.v1.aliasAuth` validates credentials
- **Rate Limit:** Applied per endpoint

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /v1/webmail/threads/:mailbox_id | List threads in mailbox |
| GET | /v1/webmail/drafts | List draft messages |
| POST | /v1/webmail/drafts | Create new draft |
| PUT | /v1/webmail/drafts/:id | Update draft |
| DELETE | /v1/webmail/drafts/:id | Delete draft |
| POST | /v1/webmail/drafts/:id/send | Send draft |
| POST | /v1/webmail/compose | Compose new message |
| POST | /v1/webmail/reply/:message_id | Reply to message |
| POST | /v1/webmail/forward/:message_id | Forward message |
| GET | /v1/webmail/quote/:message_id | Get quote for reply |
| POST | /v1/webmail/batch/flags | Batch update flags |
| POST | /v1/webmail/batch/move | Batch move messages |
| POST | /v1/webmail/batch/delete | Batch delete messages |
| GET | /v1/webmail/search | Search messages |

See: `routes/api/v1/index.js` (lines 543-639) for full API definition

## File Reference

### Key Files

| File | Purpose |
|------|---------|
| **Routing** |
| `routes/public-webmail.js` | Public webmail routes (bypass auth) |
| `config/web.js` | hookBeforeRoutes registration |
| `config/i18n.js` | ignoredRedirectGlobs (prevents locale redirect) |
| **Controllers** |
| `app/controllers/web/webmail.js` | Web page controllers |
| `app/controllers/api/v1/webmail.js` | API endpoint handlers |
| **Views** |
| `app/views/webmail.pug` | Main webmail SPA shell |
| `app/views/webmail/login.pug` | Login page |
| `app/views/webmail/logout.pug` | Logout page |
| `app/views/_snappymail_templates.pug` | Compiled Knockout templates |
| **Assets** |
| `assets/webmail/js/forwardemail-snappymail-adapter.js` | API adapter |
| `assets/webmail/js/init.js` | Bootstrap code |
| `assets/webmail/js/start.js` | SnappyMail startup |
| `assets/webmail/js/login-bridge.js` | Login form handler |
| **Build** |
| `scripts/build-webmail.sh` | SnappyMail build script |
| `gulpfile.js` | Asset compilation (lines 824-894) |
| `build/webmail/` | Built assets (served to browser) |

### Submodule

| Path | Purpose |
|------|---------|
| `webmail-src/` | SnappyMail upstream (git submodule) |
| `webmail-overrides/` | ForwardEmail customizations |

## Next Steps

### For Production
1. Deploy webmail to `mail.forwardemail.net` subdomain
2. Create separate Koa app instance for complete isolation
3. Implement proper IMAP/SMTP connections (currently REST API)
4. Add caching for frequently accessed data
5. Implement WebSocket for push notifications

### For Development
1. Add mock data generator for testing without live IMAP
2. Create Cypress/Playwright tests for webmail flows
3. Add development-only test credentials
4. Implement hot module reload for adapter changes
5. Add TypeScript types for API responses

## Debugging Tips

### Enable Verbose Logging

```javascript
// In assets/webmail/js/forwardemail-snappymail-adapter.js
const DEBUG = true;

function apiRequest(path, options = {}) {
  if (DEBUG) console.log('[API Request]', path, options);
  // ...
}
```

### Inspect SnappyMail State

```javascript
// Browser console
console.log(window.rl);              // SnappyMail core object
console.log(window.rl.settings);     // Settings store
console.log(window.rl.data);         // Data stores (folders, messages)
console.log(localStorage.alias_auth); // Auth credentials
```

### Test API Endpoints Directly

```bash
# Get alias auth token
echo -n "hello@example.com:mypassword" | base64
# Output: aGVsbG9AZXhhbXBsZS5jb206bXlwYXNzd29yZA==

# Test API endpoint
curl -H "Authorization: Basic aGVsbG9AZXhhbXBsZS5jb206bXlwYXNzd29yZA==" \
  http://localhost:3000/v1/webmail/threads/INBOX
```

## Additional Documentation

- `WEBMAIL_AUTH_GUIDE.md` - Authentication architecture
- `WEBMAIL_ROUTING_FIX.md` - Routing fixes applied
- `WEBMAIL_REFACTORING.md` - Implementation details
- `routes/public-webmail.js` - Detailed routing documentation
- `config/web.js` - hookBeforeRoutes documentation

---

**Last Updated:** November 24, 2024
**Status:** Ready for local development testing
