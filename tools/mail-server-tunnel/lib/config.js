/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

export const APP_NAME = 'mail-server-tunnel';
export const APP_TITLE = 'Mail Server Tunnel';
// The version of package.json (which the release workflow sets to the
// release's version before it builds the executables)
function getVersion() {
  // eslint-disable-next-line no-undef
  if (typeof __MST_VERSION__ === 'string') return __MST_VERSION__;
  try {
    return JSON.parse(
      fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8')
    ).version;
  } catch {
    return '0.0.0';
  }
}

export const VERSION = getVersion();
export const PROTOCOL_VERSION = 1;

// Every command the app may run against the local IMAP server
export const IMAP_READ_COMMANDS = [
  'list',
  'status',
  'search',
  'fetch',
  'download'
];
export const IMAP_WRITE_COMMANDS = [
  'flags',
  'move',
  'copy',
  'delete',
  'append',
  'mailboxCreate',
  'mailboxRename',
  'mailboxDelete'
];

//
// Every setting, with its default. Each one can be set in the config file,
// with `--set key=value` (e.g. `--set local.port=2525`), or with an
// environment variable (e.g. `MAIL_SERVER_TUNNEL_LOCAL_PORT=2525`), in that
// order of precedence from lowest to highest.
//
export const DEFAULTS = {
  // API token (My Account > Security), or a file that holds it
  token: '',
  tokenFile: '',
  apiUrl: 'https://api.forwardemail.net',
  // Domains whose mail is delivered to the local mail server
  domains: [],
  // The local mail server that receives the mail
  local: {
    host: '127.0.0.1',
    port: 25,
    // Smtp or lmtp
    protocol: 'smtp',
    // Auto (STARTTLS when offered), none, starttls (required), or implicit
    tls: 'auto',
    // Local servers mostly have a self-signed certificate
    rejectUnauthorized: false,
    // The name given in EHLO/LHLO
    name: '',
    user: '',
    pass: '',
    connectTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 60_000,
    // Messages delivered at once
    maxConcurrent: 5
  },
  // Settings of `local` that differ for a domain, by domain name
  // (e.g. { "example.org": { "host": "192.168.1.20", "port": 2525 } })
  domainOverrides: {},
  // Remote mailbox access: IMAP commands run against the local IMAP server
  imap: {
    enabled: false,
    host: '127.0.0.1',
    port: 993,
    secure: true,
    rejectUnauthorized: false,
    readOnly: false,
    allowedCommands: [...IMAP_READ_COMMANDS, ...IMAP_WRITE_COMMANDS],
    // The most one command may return (e.g. a downloaded message)
    maxBytes: 20_971_520,
    // The most messages one fetch may return
    maxMessages: 500,
    // How long a signed-in connection is kept for the next command
    idleTimeout: 60_000,
    maxConnections: 10,
    commandTimeout: 25_000
  },
  reconnect: {
    minDelay: 1000,
    maxDelay: 30_000,
    // Random share of each delay, so that many apps do not retry together
    jitter: 0.3,
    // Wait after another app took over the domains, or the token was refused
    slowDelay: 300_000
  },
  heartbeat: {
    // The connection is reopened when nothing was received for this long
    timeout: 60_000,
    handshakeTimeout: 20_000
  },
  // How often the local mail server is checked (0 turns the check off)
  probe: {
    interval: 60_000,
    timeout: 5000
  },
  notify: {
    // Desktop (toast) notifications
    desktop: true,
    // A URL that is sent each event as JSON
    webhookUrl: '',
    // A command that is run for each event (see the README)
    command: '',
    // The least time between two notifications of the same event
    minInterval: 300_000,
    // How long the connection must be down before it is notified of
    disconnectedAfter: 60_000,
    events: [
      'connected',
      'disconnected',
      'local_down',
      'local_up',
      'replaced',
      'unauthorized',
      'updated',
      'error'
    ]
  },
  log: {
    // Debug, info, warn, error, or silent
    level: 'info',
    file: '',
    maxSize: 10_485_760,
    maxFiles: 3,
    json: false
  },
  // An HTTP endpoint that answers 200 while connected (0 turns it off)
  health: {
    host: '127.0.0.1',
    port: 0
  },
  // Deliveries remembered so that a retried message is not delivered twice
  dedupe: {
    ttl: 604_800_000,
    max: 20_000
  },
  // Updates of the standalone executable from GitHub releases
  update: {
    enabled: true,
    // How often a newer release is looked for
    interval: 86_400_000,
    // Restart into the new version once it is installed
    restart: true
  },
  // The largest message accepted from the API
  maxMessageSize: 78_643_200
};

const SECRET_KEYS = new Set(['token', 'local.pass']);

export function getConfigDirectory() {
  if (process.env.MAIL_SERVER_TUNNEL_HOME)
    return process.env.MAIL_SERVER_TUNNEL_HOME;
  const home = os.homedir();
  if (process.platform === 'win32')
    return path.join(
      process.env.APPDATA || path.join(home, 'AppData', 'Roaming'),
      APP_TITLE
    );
  if (process.platform === 'darwin')
    return path.join(home, 'Library', 'Application Support', APP_TITLE);
  // (a system service run as root keeps its files in /etc)
  if (typeof process.getuid === 'function' && process.getuid() === 0)
    return path.join('/etc', APP_NAME);
  return path.join(
    process.env.XDG_CONFIG_HOME || path.join(home, '.config'),
    APP_NAME
  );
}

export function getConfigPath(directory = getConfigDirectory()) {
  return path.join(directory, 'config.json');
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

// `local.port` => ['local', 'port']
function getDefault(keyPath) {
  let value = DEFAULTS;
  for (const key of keyPath.split('.')) {
    if (!isObject(value) || !(key in value)) return undefined;
    value = value[key];
  }

  return value;
}

// A string from the command line or the environment, as the setting's type
export function coerce(keyPath, raw) {
  // (settings of one domain have the types of `local`)
  const lookup = keyPath.startsWith('domainOverrides.')
    ? `local.${keyPath.split('.').at(-1)}`
    : keyPath;
  const defaultValue = getDefault(lookup);
  if (defaultValue === undefined)
    throw new Error(`Unknown setting "${keyPath}"`);
  if (typeof raw !== 'string') return raw;
  const value = raw.trim();
  if (typeof defaultValue === 'boolean') {
    if (/^(true|1|yes|on)$/i.test(value)) return true;
    if (/^(false|0|no|off)$/i.test(value)) return false;
    throw new Error(`"${keyPath}" must be true or false`);
  }

  if (typeof defaultValue === 'number') {
    const number = Number(value);
    if (!Number.isFinite(number))
      throw new Error(`"${keyPath}" must be a number`);
    return number;
  }

  if (Array.isArray(defaultValue))
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  if (isObject(defaultValue)) return JSON.parse(value);
  return value;
}

export function setPath(object, keyPath, value) {
  const keys = keyPath.split('.');
  let target = object;
  for (const key of keys.slice(0, -1)) {
    // (never through the prototype of an object)
    if (key === '__proto__' || key === 'constructor' || key === 'prototype')
      throw new Error(`Unknown setting "${keyPath}"`);
    if (!isObject(target[key])) target[key] = {};
    target = target[key];
  }

  const last = keys.at(-1);
  if (last === '__proto__' || last === 'constructor' || last === 'prototype')
    throw new Error(`Unknown setting "${keyPath}"`);
  target[last] = value;
}

function merge(target, source, keyPath = '') {
  for (const [key, value] of Object.entries(source)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype')
      continue;
    const next = keyPath ? `${keyPath}.${key}` : key;
    if (isObject(value) && isObject(target[key]) && next !== 'domainOverrides')
      merge(target[key], value, next);
    else target[key] = clone(value);
  }

  return target;
}

// Every setting's path, e.g. `local.port`
function listPaths(object = DEFAULTS, prefix = '') {
  const paths = [];
  for (const [key, value] of Object.entries(object)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (isObject(value) && next !== 'domainOverrides')
      paths.push(...listPaths(value, next));
    else paths.push(next);
  }

  return paths;
}

export const SETTING_PATHS = listPaths();

// `local.maxConcurrent` => `MAIL_SERVER_TUNNEL_LOCAL_MAX_CONCURRENT`
export function getEnvName(keyPath) {
  return `MAIL_SERVER_TUNNEL_${keyPath
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .replace(/\./g, '_')
    .toUpperCase()}`;
}

export function normalizeDomain(domain) {
  let name = String(domain).trim().toLowerCase().replace(/\.$/, '');
  try {
    name = new URL(`http://${name}`).hostname;
  } catch {}

  return name;
}

export function validate(config) {
  const errors = [];
  const port = (value) =>
    Number.isInteger(value) && value >= 0 && value <= 65_535;

  if (Array.isArray(config.domains))
    for (const domain of config.domains) {
      if (
        !/^[a-z\d]([a-z\d-]*[a-z\d])?(\.[a-z\d]([a-z\d-]*[a-z\d])?)+$/.test(
          domain
        )
      )
        errors.push(`"${domain}" is not a domain name`);
    }
  else errors.push('"domains" must be a list');

  let apiUrl;
  try {
    apiUrl = new URL(config.apiUrl);
  } catch {}

  if (!apiUrl || !['https:', 'http:'].includes(apiUrl.protocol))
    errors.push('"apiUrl" must be an https:// URL');
  // (the token is only ever sent over TLS, except to this computer itself)
  else if (
    apiUrl.protocol === 'http:' &&
    !['localhost', '127.0.0.1', '[::1]'].includes(apiUrl.hostname)
  )
    errors.push('"apiUrl" must use https://');

  const locals = [
    ['local', config.local],
    ...Object.entries(config.domainOverrides || {}).map(([domain, value]) => [
      `domainOverrides.${domain}`,
      { ...config.local, ...value }
    ])
  ];
  for (const [name, local] of locals) {
    if (typeof local.host !== 'string' || !local.host)
      errors.push(`"${name}.host" is required`);
    if (!port(local.port) || local.port === 0)
      errors.push(`"${name}.port" must be a port number`);
    if (!['smtp', 'lmtp'].includes(local.protocol))
      errors.push(`"${name}.protocol" must be smtp or lmtp`);
    if (!['auto', 'none', 'starttls', 'implicit'].includes(local.tls))
      errors.push(`"${name}.tls" must be auto, none, starttls or implicit`);
  }

  if (!port(config.imap.port) || config.imap.port === 0)
    errors.push('"imap.port" must be a port number');
  if (!port(config.health.port))
    errors.push('"health.port" must be a port number');
  const known = new Set([...IMAP_READ_COMMANDS, ...IMAP_WRITE_COMMANDS]);
  for (const command of config.imap.allowedCommands) {
    if (!known.has(command))
      errors.push(`"${command}" is not an IMAP command of this app`);
  }

  if (!['debug', 'info', 'warn', 'error', 'silent'].includes(config.log.level))
    errors.push('"log.level" must be debug, info, warn, error or silent');

  for (const keyPath of SETTING_PATHS) {
    const defaultValue = getDefault(keyPath);
    if (typeof defaultValue !== 'number') continue;
    let value = config;
    for (const key of keyPath.split('.')) value = value?.[key];
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0)
      errors.push(`"${keyPath}" must be a number of 0 or more`);
  }

  return errors;
}

export function readConfigFile(file) {
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return {};
    throw error;
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error(`${file} is not valid JSON: ${error.message}`);
  }

  if (!isObject(data)) throw new Error(`${file} must hold a JSON object`);
  return data;
}

//
// The settings in effect: the defaults, then the config file, then `--set`
// overrides, then environment variables.
//
export function loadConfig(options = {}) {
  const directory = options.directory || getConfigDirectory();
  const file = options.file || getConfigPath(directory);
  const env = options.env || process.env;
  const config = clone(DEFAULTS);

  merge(config, readConfigFile(file));

  for (const [keyPath, raw] of Object.entries(options.overrides || {}))
    setPath(config, keyPath, coerce(keyPath, raw));

  for (const keyPath of SETTING_PATHS) {
    const raw = env[getEnvName(keyPath)];
    if (raw !== undefined && raw !== '')
      setPath(config, keyPath, coerce(keyPath, raw));
  }

  // (the name the Forward Email API documentation uses for the token)
  if (!config.token && env.FORWARD_EMAIL_API_TOKEN)
    config.token = env.FORWARD_EMAIL_API_TOKEN;
  if (!config.token && config.tokenFile)
    config.token = fs.readFileSync(config.tokenFile, 'utf8');
  config.token = String(config.token || '').trim();

  config.domains = [
    ...new Set((config.domains || []).map((d) => normalizeDomain(d)))
  ].filter(Boolean);
  const overrides = {};
  for (const [domain, value] of Object.entries(config.domainOverrides || {}))
    if (isObject(value)) overrides[normalizeDomain(domain)] = value;
  config.domainOverrides = overrides;

  if (!config.local.name) config.local.name = os.hostname();
  if (!config.log.file)
    config.log.file = path.join(directory, `${APP_NAME}.log`);

  config.directory = directory;
  config.file = file;

  const errors = validate(config);
  if (errors.length > 0) {
    const error = new Error(`Invalid settings:\n- ${errors.join('\n- ')}`);
    error.isConfigError = true;
    throw error;
  }

  return config;
}

// The local mail server a domain's mail is delivered to
export function getLocal(config, domain) {
  return { ...config.local, ...config.domainOverrides[domain] };
}

//
// Writes settings to the config file, which only its owner can read (it
// holds the API token). `changes` are merged into what the file holds.
//
export function saveConfig(changes, options = {}) {
  const directory = options.directory || getConfigDirectory();
  const file = options.file || getConfigPath(directory);
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  const data = merge(readConfigFile(file), changes);
  const temporary = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(data, null, 2)}\n`, {
    mode: 0o600
  });
  fs.renameSync(temporary, file);
  // (a file that already existed keeps its mode through the rename above,
  // but one created with a looser umask elsewhere is tightened too)
  if (process.platform !== 'win32') fs.chmodSync(file, 0o600);
  return file;
}

// The settings as they may be printed (without the token or passwords)
export function redact(config) {
  const copy = clone(config);
  for (const keyPath of SECRET_KEYS) {
    const keys = keyPath.split('.');
    let target = copy;
    for (const key of keys.slice(0, -1)) target = target?.[key];
    if (target?.[keys.at(-1)]) target[keys.at(-1)] = '********';
  }

  for (const value of Object.values(copy.domainOverrides || {}))
    if (value?.pass) value.pass = '********';
  return copy;
}
