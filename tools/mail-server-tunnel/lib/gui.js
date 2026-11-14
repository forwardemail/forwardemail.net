/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { spawn } from 'node:child_process';

import * as api from './api.js';
import {
  APP_TITLE,
  DEFAULTS,
  SETTING_PATHS,
  VERSION,
  getEnvName,
  normalizeDomain,
  redact,
  saveConfig
} from './config.js';
import {
  checkMx,
  getStatus,
  runDoctor,
  startBackground,
  install,
  stopRunning,
  uninstall,
  waitUntilStopped
} from './actions.js';
import { probe } from './deliver.js';
import { checkForUpdate } from './update.js';

//
// The app as a window: a page served to this computer only, opened in the
// default browser, that does what the command line does. Requests must come
// from the page itself (a secret it is given when it is served, and this
// server's own Host and Origin), so no other site or program on the network
// can use it.
//
const PAGE = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mail Server Tunnel</title>
<style>
:root{color-scheme:light dark;--b:#d0d7de;--m:#57606a;--ok:#1a7f37;--bad:#cf222e;--a:#0969da}
@media(prefers-color-scheme:dark){:root{--b:#30363d;--m:#8b949e;--ok:#3fb950;--bad:#f85149;--a:#58a6ff}}
*{box-sizing:border-box}body{font:15px/1.5 system-ui,sans-serif;margin:0 auto;max-width:860px;padding:16px}
h1{font-size:22px;margin:8px 0}h2{font-size:16px;margin:0 0 8px}
section{border:1px solid var(--b);border-radius:8px;margin:14px 0;padding:14px}
label{display:block;font-weight:600;margin:10px 0 2px}small,.m{color:var(--m)}
input[type=text],input[type=password],input[type=number],textarea,select{width:100%;padding:7px;border:1px solid var(--b);border-radius:6px;font:inherit;background:transparent;color:inherit}
textarea{font:13px/1.4 ui-monospace,monospace;min-height:220px}
button{font:inherit;padding:7px 14px;border-radius:6px;border:1px solid var(--b);background:transparent;color:inherit;cursor:pointer;margin:6px 6px 0 0}
button.p{background:var(--a);border-color:var(--a);color:#fff}button:disabled{opacity:.5}
.ok{color:var(--ok)}.bad{color:var(--bad)}.row{display:flex;gap:10px}.row>div{flex:1}
pre{background:rgba(127,127,127,.12);border-radius:6px;font:12px/1.4 ui-monospace,monospace;max-height:260px;overflow:auto;padding:8px;white-space:pre-wrap}
#toasts{position:fixed;right:16px;top:16px;display:flex;flex-direction:column;gap:8px;z-index:9}
.toast{background:#24292f;border-left:4px solid var(--a);border-radius:6px;color:#fff;max-width:340px;padding:10px 14px;box-shadow:0 4px 12px rgba(0,0,0,.3)}
.toast.ok{border-color:var(--ok);color:#fff}.toast.bad{border-color:var(--bad);color:#fff}
ul{margin:4px 0;padding-left:20px}li{margin:2px 0}.check{list-style:none;margin-left:-20px}
</style>
</head>
<body>
<div id="toasts" role="status" aria-live="polite"></div>
<h1>Mail Server Tunnel <small id="version"></small></h1>
<p class="m">Receive mail on your own mail server behind CGNAT (Starlink, 5G home internet and other providers without a public IP address). <a href="https://forwardemail.net/guides/self-hosted-mail-server-behind-cgnat" target="_blank" rel="noopener">Guide</a></p>

<section><h2>Status</h2><div id="status">Loading…</div>
<button id="start">Start</button><button id="stop">Stop</button><button id="refresh">Refresh</button></section>

<section><h2>1. Forward Email account</h2>
<label for="token">API token</label>
<input type="password" id="token" autocomplete="off" placeholder="Paste from My Account &gt; Security">
<small>Find it at <a href="https://forwardemail.net/my-account/security" target="_blank" rel="noopener">forwardemail.net/my-account/security</a>. It is saved on this computer only, in a file only you can read.</small><br>
<button class="p" id="saveToken">Save and load domains</button> <span id="account" class="m"></span></section>

<section><h2>2. Domains</h2><div id="domains" class="m">Save your API token to list your domains.</div>
<button class="p" id="saveDomains">Save domains</button></section>

<section><h2>3. Your mail server</h2>
<div class="row"><div><label for="host">Host</label><input type="text" id="host"></div>
<div><label for="port">Port</label><input type="number" id="port" min="1" max="65535"></div>
<div><label for="protocol">Protocol</label><select id="protocol"><option>smtp</option><option>lmtp</option></select></div></div>
<button id="probe">Test connection</button><button class="p" id="saveLocal">Save</button>
<label><input type="checkbox" id="imap"> Allow reading mailboxes through the tunnel (IMAP)</label>
<div class="row"><div><label for="imapHost">IMAP host</label><input type="text" id="imapHost"></div>
<div><label for="imapPort">IMAP port</label><input type="number" id="imapPort" min="1" max="65535"></div></div></section>

<section><h2>4. Keep it running</h2><div id="installed" class="m"></div>
<label for="mode">Start</label><select id="mode"><option value="">Automatic (recommended)</option><option value="user">When I sign in (user)</option><option value="system">At boot (system, needs administrator)</option><option value="cron">With cron</option></select>
<button class="p" id="install">Install</button><button id="uninstall">Uninstall</button></section>

<section><h2>Check everything</h2><button id="doctor">Run checks</button><ul id="checks"></ul></section>

<section><h2>All settings</h2><small>Every setting as JSON (the token and passwords are hidden and kept as they are). Each can also be set by an environment variable; see the list below.</small>
<textarea id="settings" spellcheck="false"></textarea><button class="p" id="saveSettings">Save settings</button>
<details><summary class="m">Setting names and environment variables</summary><pre id="paths"></pre></details></section>

<section><h2>Log</h2><button id="loadLogs">Show log</button><pre id="logs" hidden></pre></section>

<section><h2>Updates</h2><div id="update" class="m"></div><button id="checkUpdate">Check for updates</button><button id="applyUpdate">Update now</button></section>

<script>
const SECRET = '__SECRET__';
const $ = (id) => document.getElementById(id);
function toast(text, kind) {
  const el = document.createElement('div');
  el.className = 'toast ' + (kind || '');
  el.textContent = text;
  $('toasts').append(el);
  setTimeout(() => el.remove(), 6000);
}
async function call(name, body) {
  const response = await fetch('/api/' + name, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Tunnel-Secret': SECRET },
    body: JSON.stringify(body || {})
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}
function run(button, fn) {
  $(button).addEventListener('click', async () => {
    $(button).disabled = true;
    try { await fn(); } catch (err) { toast(err.message, 'bad'); }
    $(button).disabled = false;
  });
}
function line(parent, ok, text) {
  const li = document.createElement('li');
  li.className = 'check ' + (ok ? 'ok' : 'bad');
  li.textContent = (ok ? '✓ ' : '✗ ') + text;
  parent.append(li);
}
let lastState = '';
function showStatus(state) {
  const s = state.status;
  const box = $('status');
  box.textContent = '';
  const ul = document.createElement('ul');
  if (s.state === 'connected') line(ul, true, 'Connected since ' + s.since);
  else if (s.running) line(ul, false, 'Running but not connected: ' + (s.last_error || s.state));
  else line(ul, false, 'Not running');
  for (const d of s.domains || []) line(ul, true, 'Serving ' + d);
  for (const r of s.rejected || []) line(ul, false, r.name + ': ' + r.message);
  for (const [target, local] of Object.entries(s.local || {}))
    line(ul, local.ok, 'Mail server at ' + target + (local.ok ? ' is reachable' : ' is not reachable: ' + local.message));
  const stats = s.stats || {};
  const p = document.createElement('small');
  p.textContent = 'Delivered ' + (stats.delivered || 0) + ', refused ' + (stats.rejected || 0) + ', deferred ' + (stats.deferred || 0);
  box.append(ul, p);
  $('installed').textContent = s.installed.length ? 'Starts automatically with ' + s.installed.join(', ') + '.' : 'Not set to start automatically yet.';
  if (lastState && lastState !== s.state)
    toast(s.state === 'connected' ? 'Connected' : 'Tunnel is ' + s.state, s.state === 'connected' ? 'ok' : 'bad');
  lastState = s.state;
}
function showDomains(domains, selected) {
  const box = $('domains');
  box.textContent = '';
  if (!domains.length) { box.textContent = 'No domains were found for this account. Add one at forwardemail.net first.'; return; }
  for (const d of domains) {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox'; input.value = d.name; input.name = 'domain';
    input.checked = selected.includes(d.name);
    input.disabled = d.plan === 'free';
    label.append(input, ' ' + d.name + (d.plan === 'free' ? ' (free plan: upgrade to use the tunnel)' : d.has_tunnel ? ' (tunnel on)' : ''));
    box.append(label);
  }
}
async function refresh(full) {
  const state = await call('state');
  $('version').textContent = state.version;
  showStatus(state);
  if (!full) return state;
  const c = state.config;
  $('token').placeholder = c.token ? 'Saved (paste a new one to replace it)' : 'Paste from My Account > Security';
  $('host').value = c.local.host; $('port').value = c.local.port; $('protocol').value = c.local.protocol;
  $('imap').checked = c.imap.enabled; $('imapHost').value = c.imap.host; $('imapPort').value = c.imap.port;
  const editable = JSON.parse(JSON.stringify(c));
  delete editable.directory; delete editable.file;
  $('settings').value = JSON.stringify(editable, null, 2);
  $('paths').textContent = state.paths.map((p) => p.path.padEnd(30) + ' ' + p.env).join('\n');
  if (c.token) call('domains').then((d) => { $('account').textContent = d.email; showDomains(d.domains, c.domains); }).catch(() => {});
  return state;
}
run('refresh', () => refresh(true));
run('start', async () => { await call('start'); toast('Starting'); setTimeout(refresh, 2000); });
run('stop', async () => { await call('stop'); toast('Stopping'); setTimeout(refresh, 1500); });
run('saveToken', async () => {
  const d = await call('token', { token: $('token').value });
  $('token').value = ''; $('account').textContent = d.email;
  showDomains(d.domains, d.selected); toast('Signed in as ' + d.email, 'ok');
});
run('saveDomains', async () => {
  const names = [...document.querySelectorAll('input[name=domain]:checked')].map((i) => i.value);
  const d = await call('save-domains', { domains: names });
  for (const w of d.warnings) toast(w, 'bad');
  toast('Domains saved. Restart the tunnel to apply.', 'ok'); refresh(true);
});
const local = () => ({ host: $('host').value.trim(), port: Number($('port').value), protocol: $('protocol').value });
run('probe', async () => { const r = await call('probe', local()); toast(r.ok ? 'Mail server answered: ' + r.message : 'No mail server answered: ' + r.message, r.ok ? 'ok' : 'bad'); });
run('saveLocal', async () => {
  await call('save', { changes: { local: local(), imap: { enabled: $('imap').checked, host: $('imapHost').value.trim(), port: Number($('imapPort').value) } } });
  toast('Saved. Restart the tunnel to apply.', 'ok'); refresh(true);
});
run('install', async () => { const r = await call('install', { mode: $('mode').value }); toast('Installed with ' + r.manager, 'ok'); for (const n of r.notes) toast(n); setTimeout(() => refresh(), 2500); });
run('uninstall', async () => { const r = await call('uninstall'); toast(r.removed.length ? 'Removed from ' + r.removed.join(', ') : 'Nothing was installed', 'ok'); refresh(); });
run('doctor', async () => {
  $('checks').textContent = 'Checking…';
  const r = await call('doctor'); $('checks').textContent = '';
  for (const c of r.checks) line($('checks'), c.ok, c.message + (c.fix && !c.ok ? ' — Fix: ' + c.fix : ''));
});
run('saveSettings', async () => { await call('save', { changes: JSON.parse($('settings').value) }); toast('Settings saved. Restart the tunnel to apply.', 'ok'); refresh(true); });
run('loadLogs', async () => { const r = await call('logs'); $('logs').hidden = false; $('logs').textContent = r.lines.join('\n') || 'No log yet.'; $('logs').scrollTop = 1e9; });
run('checkUpdate', async () => { const r = await call('update', { checkOnly: true }); $('update').textContent = r.message; });
run('applyUpdate', async () => { const r = await call('update', {}); $('update').textContent = r.message; toast(r.message, r.updated ? 'ok' : ''); });
refresh(true).catch((err) => toast(err.message, 'bad'));
setInterval(() => refresh().catch(() => {}), 5000);
</script>
</body>
</html>`;

function isEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

function readBody(request, limit = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error('Request too large'));
        request.destroy();
        return;
      }

      chunks.push(chunk);
    });
    request.on('end', () => {
      try {
        resolve(chunks.length > 0 ? JSON.parse(Buffer.concat(chunks)) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    request.on('error', reject);
  });
}

// (never the token or a password: what the page is shown and sends back)
const SECRET_MASK = '********';

function stripMasked(changes) {
  if (changes.token === SECRET_MASK || changes.token === '')
    delete changes.token;
  if (changes.local?.pass === SECRET_MASK) delete changes.local.pass;
  for (const value of Object.values(changes.domainOverrides || {}))
    if (value?.pass === SECRET_MASK) delete value.pass;
  delete changes.directory;
  delete changes.file;
  return changes;
}

function createHandlers(load, file, saveOptions) {
  // Saves changes, and puts the file back as it was if they are not valid
  function save(changes) {
    const previous = fs.existsSync(file) ? fs.readFileSync(file) : null;
    saveConfig(changes, saveOptions);
    try {
      return load();
    } catch (error) {
      if (previous) fs.writeFileSync(file, previous, { mode: 0o600 });
      else fs.rmSync(file, { force: true });
      throw error;
    }
  }

  return {
    state() {
      const config = load();
      return {
        version: VERSION,
        config: redact(config),
        status: getStatus(config),
        paths: SETTING_PATHS.map((keyPath) => ({
          path: keyPath,
          env: getEnvName(keyPath)
        }))
      };
    },

    async token({ token }) {
      if (typeof token !== 'string' || !token.trim())
        throw new Error('Paste your API token first');
      const config = { ...load(), token: token.trim() };
      const account = await api.getAccount(config);
      save({ token: token.trim() });
      const domains = await api.listDomains(config);
      return {
        email: account.email,
        selected: config.domains,
        domains: domains
          .filter((d) => !d.is_global)
          .map(({ name, plan, has_tunnel }) => ({ name, plan, has_tunnel }))
      };
    },

    async domains() {
      const config = load();
      const [account, domains] = await Promise.all([
        api.getAccount(config),
        api.listDomains(config)
      ]);
      return {
        email: account.email,
        domains: domains
          .filter((d) => !d.is_global)
          .map(({ name, plan, has_tunnel }) => ({ name, plan, has_tunnel }))
      };
    },

    // The domains to serve: the tunnel is turned on for those chosen, and
    // off for those no longer chosen
    async 'save-domains'({ domains }) {
      if (!Array.isArray(domains)) throw new Error('Choose your domains');
      const config = load();
      const names = [...new Set(domains.map((d) => normalizeDomain(d)))];
      const warnings = [];
      for (const name of names) {
        await api.setTunnel(config, name, true);
        const mx = await checkMx(name);
        if (!mx.ok)
          warnings.push(
            `${name}: set the MX records mx1.forwardemail.net and mx2.forwardemail.net at your DNS provider`
          );
      }

      for (const name of config.domains)
        if (!names.includes(name))
          await api.setTunnel(config, name, false).catch(() => {});
      save({ domains: names });
      return { domains: names, warnings };
    },

    save({ changes }) {
      if (!changes || typeof changes !== 'object' || Array.isArray(changes))
        throw new Error('Settings must be a JSON object');
      const clean = stripMasked(structuredClone(changes));
      for (const key of Object.keys(clean))
        if (!(key in DEFAULTS)) throw new Error(`Unknown setting "${key}"`);
      save(clean);
      return { ok: true };
    },

    async probe({ host, port, protocol }) {
      const config = load();
      return probe(
        { ...config.local, host: String(host), port: Number(port), protocol },
        5000
      );
    },

    install({ mode }) {
      const config = load();
      if (!config.token || config.domains.length === 0)
        throw new Error('Save your API token and domains first');
      const result = install(config, { mode: mode || undefined });
      return {
        manager: result.manager,
        mode: result.mode,
        notes: result.notes
      };
    },

    async uninstall() {
      return { removed: await uninstall(load()) };
    },

    start() {
      const config = load();
      if (!config.token || config.domains.length === 0)
        throw new Error('Save your API token and domains first');
      return { pid: startBackground(config) };
    },

    stop() {
      return { stopped: stopRunning(load()) };
    },

    async doctor() {
      return { checks: await runDoctor(load()) };
    },

    logs() {
      const { file } = load().log;
      if (!fs.existsSync(file)) return { lines: [] };
      return {
        lines: fs.readFileSync(file, 'utf8').trimEnd().split('\n').slice(-200)
      };
    },

    async update({ checkOnly }) {
      const config = load();
      const result = await checkForUpdate(config, {
        force: true,
        checkOnly: Boolean(checkOnly)
      });
      if (result.updated && stopRunning(config)) {
        await waitUntilStopped(config);
        if (getStatus(config).installed.length === 0) startBackground(config);
      }

      return result;
    }
  };
}

export function openBrowser(url) {
  const [file, args] =
    process.platform === 'win32'
      ? ['cmd', ['/c', 'start', '""', url]]
      : process.platform === 'darwin'
      ? ['open', [url]]
      : ['xdg-open', [url]];
  try {
    const child = spawn(file, args, {
      detached: true,
      stdio: 'ignore',
      windowsHide: true
    });
    child.on('error', () => {});
    child.unref();
  } catch {}
}

//
// Starts the page's server on this computer only and opens it. Resolves
// with { server, url, secret }.
//
export async function startGui({ load, file, open = true, port = 0 }) {
  //
  // The address that is opened works once: it gives the browser a session
  // cookie and leads to the page. What stays in the browser's history, or
  // was seen in the list of running programs, opens nothing afterwards.
  //
  const bootstrap = randomBytes(32).toString('hex');
  const session = randomBytes(32).toString('hex');
  // (sent by the page with each request, which another site cannot do)
  const secret = randomBytes(32).toString('hex');
  let isBootstrapUsed = false;
  const handlers = createHandlers(load, file, {
    file,
    directory: path.dirname(file)
  });
  const hasSession = (request) =>
    String(request.headers.cookie || '')
      .split(';')
      .some((part) => isEqual(part.trim(), `mst_session=${session}`));

  const server = http.createServer(async (request, response) => {
    const { port: listening } = server.address();
    const hosts = new Set([`127.0.0.1:${listening}`, `localhost:${listening}`]);
    const send = (status, body, type = 'application/json') => {
      response.writeHead(status, {
        'Content-Type': type,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'no-referrer',
        'Content-Security-Policy':
          "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
      });
      response.end(type === 'application/json' ? JSON.stringify(body) : body);
    };

    // (a name that resolves to this computer from another site is refused)
    if (!hosts.has(request.headers.host))
      return send(403, { message: 'Forbidden' });

    const url = new URL(request.url, `http://${request.headers.host}`);
    if (request.method === 'GET' && url.pathname === `/open/${bootstrap}`) {
      if (isBootstrapUsed) return send(404, { message: 'Not found' });
      isBootstrapUsed = true;
      response.writeHead(302, {
        Location: '/',
        'Set-Cookie': `mst_session=${session}; HttpOnly; SameSite=Strict; Path=/`,
        'Cache-Control': 'no-store',
        'Referrer-Policy': 'no-referrer'
      });
      return response.end();
    }

    if (request.method === 'GET' && url.pathname === '/' && hasSession(request))
      return send(
        200,
        PAGE.replace('__SECRET__', secret),
        'text/html; charset=utf-8'
      );

    if (request.method !== 'POST' || !url.pathname.startsWith('/api/'))
      return send(404, { message: 'Not found' });

    const { origin } = request.headers;
    if (
      !hasSession(request) ||
      !isEqual(request.headers['x-tunnel-secret'] || '', secret) ||
      (origin && !hosts.has(origin.replace(/^https?:\/\//, ''))) ||
      !String(request.headers['content-type']).startsWith('application/json')
    )
      return send(403, { message: 'Forbidden' });

    const name = url.pathname.slice('/api/'.length);
    if (!Object.hasOwn(handlers, name))
      return send(404, { message: 'Not found' });
    try {
      send(200, await handlers[name](await readBody(request)));
    } catch (error) {
      send(400, { message: String(error.message || error) });
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });
  const url = `http://127.0.0.1:${server.address().port}/open/${bootstrap}`;
  if (open) {
    console.log(
      `${APP_TITLE} is open at:\n\n  ${url}\n\nKeep this window open while you use it. Press Ctrl+C to close.`
    );
    openBrowser(url);
  }

  return { server, url, secret, cookie: `mst_session=${session}` };
}
