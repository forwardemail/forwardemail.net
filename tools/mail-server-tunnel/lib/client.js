/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { Buffer } from 'node:buffer';
import { EventEmitter } from 'node:events';

import WebSocket from 'ws';

import { PROTOCOL_VERSION, VERSION, getLocal } from './config.js';
import { deliver, probe } from './deliver.js';
import { createImap } from './imap.js';

// Close codes of the API (see helpers/tunnel-websocket-handler.js)
const CLOSE_CODE_REVOKED = 4001;
const CLOSE_CODE_FORBIDDEN = 4403;
const CLOSE_CODE_REPLACED = 4409;

const LOCAL_ERROR_CODES = new Set([
  'LOCAL_UNREACHABLE',
  'LOCAL_TIMEOUT',
  'LOCAL_TLS',
  'LOCAL_AUTH'
]);

function writeFileAtomic(file, text) {
  const temporary = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, text, { mode: 0o600 });
  fs.renameSync(temporary, file);
}

// https://api.forwardemail.net => wss://api.forwardemail.net/v1/tunnel
export function getTunnelUrl(apiUrl) {
  const url = new URL('/v1/tunnel', apiUrl);
  url.protocol = url.protocol === 'http:' ? 'ws:' : 'wss:';
  return url.toString();
}

//
// The long-lived connection to the Forward Email API. It reconnects by
// itself for as long as it runs, delivers each message it is sent to the
// local mail server, and answers with that server's response.
//
export class TunnelClient extends EventEmitter {
  constructor(config, options = {}) {
    super();
    this.config = config;
    this.logger = options.logger;
    this.notify = options.notify || (() => {});
    // Re-reads the settings before each connection (e.g. a new token)
    this.reload = options.reload;
    this.state = 'stopped';
    this.stateSince = Date.now();
    this.attempts = 0;
    this.servedDomains = [];
    this.rejectedDomains = [];
    // "host:port" => { ok, message }
    this.localStates = new Map();
    this.inFlight = 0;
    this.queue = [];
    this.stats = {
      delivered: 0,
      rejected: 0,
      deferred: 0,
      duplicates: 0,
      imap: 0
    };
    this.lastDeliveryAt = null;
    this.lastError = '';
    this.delivered = new Map();
    // Fingerprint => the delivery of that message that is under way
    this.delivering = new Map();
    this.imap = createImap(config, this.logger);
    this._loadDelivered();
  }

  get statusFile() {
    return path.join(this.config.directory, 'status.json');
  }

  get deliveredFile() {
    return path.join(this.config.directory, 'delivered.json');
  }

  start() {
    if (this.state !== 'stopped') return;
    this.isStopping = false;
    this._setState('connecting');
    this._connect();
    this._watchdog = setInterval(() => this._checkHeartbeat(), 5000);
    this._statusTimer = setInterval(() => this._writeStatus(), 30_000);
    if (this.config.probe.interval > 0) {
      this._probeTimer = setInterval(
        () => this._probeAll(),
        this.config.probe.interval
      );
      this._probeAll();
    }

    this._startHealthServer();
  }

  async stop() {
    if (this.state === 'stopped') return;
    this.isStopping = true;
    clearInterval(this._watchdog);
    clearInterval(this._statusTimer);
    clearInterval(this._probeTimer);
    clearTimeout(this._reconnectTimer);
    clearTimeout(this._disconnectedTimer);
    clearTimeout(this._readyTimer);
    clearTimeout(this._statusSoon);
    clearTimeout(this._retryDomainsTimer);

    // (messages being delivered are finished and answered first)
    const deadline = Date.now() + 10_000;
    while (this.inFlight > 0 && Date.now() < deadline)
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });

    if (this.ws) {
      try {
        this.ws.close(1000, 'Stopping');
      } catch {}

      const { ws } = this;
      setTimeout(() => ws.terminate(), 2000).unref();
    }

    this.imap.close();
    if (this.healthServer) this.healthServer.close();
    this._saveDelivered(true);
    this._setState('stopped');
  }

  getStatus() {
    return {
      pid: process.pid,
      version: VERSION,
      state: this.state,
      since: new Date(this.stateSince).toISOString(),
      domains: this.servedDomains,
      rejected: this.rejectedDomains,
      local: Object.fromEntries(this.localStates),
      stats: this.stats,
      last_delivery_at: this.lastDeliveryAt,
      last_error: this.lastError,
      updated_at: new Date().toISOString()
    };
  }

  _setState(state) {
    if (this.state === state) return;
    this.state = state;
    this.stateSince = Date.now();
    this._writeStatus();
    this.emit('state', state);
  }

  _writeStatus() {
    try {
      fs.mkdirSync(this.config.directory, { recursive: true, mode: 0o700 });
      writeFileAtomic(
        this.statusFile,
        JSON.stringify(this.getStatus(), null, 2)
      );
    } catch (error) {
      this.logger.debug('Status file not written', { message: error.message });
    }
  }

  // (after a delivery, so that "status" shows current counts)
  _writeStatusSoon() {
    if (this._statusSoon) return;
    this._statusSoon = setTimeout(() => {
      this._statusSoon = null;
      this._writeStatus();
    }, 500);
    this._statusSoon.unref?.();
  }

  _startHealthServer() {
    const { port, host } = this.config.health;
    if (!port) return;
    this.healthServer = http.createServer((request, response) => {
      const isConnected = this.state === 'connected';
      response.writeHead(isConnected ? 200 : 503, {
        'Content-Type': 'application/json'
      });
      response.end(JSON.stringify(this.getStatus()));
    });
    this.healthServer.on('error', (error) =>
      this.logger.warn('Health endpoint failed', { message: error.message })
    );
    this.healthServer.listen(port, host);
  }

  //
  // connection
  //
  _connect() {
    if (this.isStopping) return;
    clearTimeout(this._reconnectTimer);

    if (this.reload) {
      try {
        const config = this.reload();
        // (the IMAP runner and the timers keep the settings they started
        // with; a restart applies every changed setting)
        Object.assign(this.config, config);
      } catch (error) {
        this.logger.error(`Settings not reloaded: ${error.message}`);
      }
    }

    const { config } = this;
    if (!config.token) {
      this.lastError = 'No API token is set';
      this.logger.error(`${this.lastError}. Run "mail-server-tunnel setup".`);
      this.notify('unauthorized', 'No API token is set. Run the setup again.');
      return this._scheduleReconnect(config.reconnect.slowDelay);
    }

    if (config.domains.length === 0) {
      this.lastError = 'No domains are set';
      this.logger.error(`${this.lastError}. Run "mail-server-tunnel setup".`);
      return this._scheduleReconnect(config.reconnect.slowDelay);
    }

    this._setState('connecting');
    this.attempts++;
    const url = getTunnelUrl(config.apiUrl);
    this.logger.debug('Connecting', { url, attempt: this.attempts });

    const ws = new WebSocket(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.token}:`).toString(
          'base64'
        )}`,
        'User-Agent': `mail-server-tunnel/${VERSION}`
      },
      handshakeTimeout: config.heartbeat.handshakeTimeout,
      maxPayload: config.maxMessageSize,
      perMessageDeflate: false
    });
    this.ws = ws;
    ws.isReady = false;
    this.lastSeenAt = Date.now();

    ws.on('unexpected-response', (request, response) => {
      const status = response.statusCode;
      const retryAfter = Number(response.headers['retry-after']) * 1000;
      request.destroy();
      if (status === 401) {
        this.lastError = 'The API token was refused';
        this.logger.error(
          `${this.lastError}. Check the token under My Account > Security and run "mail-server-tunnel setup".`
        );
        this.notify(
          'unauthorized',
          'The API token was refused. Mail is deferred until this is fixed.'
        );
        return this._onDisconnect(ws, config.reconnect.slowDelay);
      }

      this.lastError = `The API answered ${status}`;
      this.logger.warn(this.lastError);
      this._onDisconnect(
        ws,
        Number.isFinite(retryAfter) ? retryAfter : undefined
      );
    });

    ws.on('open', () => {
      this.lastSeenAt = Date.now();
      ws.send(
        JSON.stringify({
          event: 'hello',
          protocol: PROTOCOL_VERSION,
          version: VERSION,
          hostname: os.hostname(),
          platform: process.platform,
          domains: config.domains,
          imap: config.imap.enabled
        })
      );
      this._readyTimer = setTimeout(() => {
        this.logger.warn('The API did not answer the hello in time');
        ws.terminate();
      }, config.heartbeat.handshakeTimeout);
    });

    ws.on('ping', () => {
      this.lastSeenAt = Date.now();
    });
    ws.on('pong', () => {
      this.lastSeenAt = Date.now();
    });

    ws.on('message', (data, isBinary) => {
      this.lastSeenAt = Date.now();
      try {
        if (isBinary) this._onRequest(ws, data);
        else this._onEvent(ws, JSON.parse(data.toString()));
      } catch (error) {
        this.logger.warn('Message from the API not understood', {
          message: error.message
        });
      }
    });

    ws.on('error', (error) => {
      this.lastError = error.message;
      this.logger.debug('Connection error', { message: error.message });
    });

    ws.on('close', (code, reason) => {
      clearTimeout(this._readyTimer);
      let delay;
      if (code === CLOSE_CODE_REPLACED) {
        this.lastError =
          'Another Mail Server Tunnel app connected for these domains';
        this.logger.warn(
          `${this.lastError}. Only one app serves a domain at a time; this one waits before it tries again.`
        );
        this.notify('replaced', `${this.lastError}.`);
        delay = config.reconnect.slowDelay;
      } else if (code === CLOSE_CODE_FORBIDDEN || code === CLOSE_CODE_REVOKED) {
        delay = config.reconnect.slowDelay;
      } else if (!this.isStopping) {
        this.logger.info('Disconnected', { code, reason: reason?.toString() });
      }

      this._onDisconnect(ws, delay);
    });
  }

  _onDisconnect(ws, delay) {
    if (this.ws !== ws) return;
    this.ws = null;
    if (this.isStopping) return;
    const wasConnected = this.state === 'connected';
    this._setState('waiting');
    this.servedDomains = [];

    if (wasConnected && !this._disconnectedTimer)
      this._disconnectedTimer = setTimeout(() => {
        this._disconnectedTimer = null;
        this.notify(
          'disconnected',
          'Disconnected from Forward Email. Incoming mail is deferred (not lost) until the connection is back.',
          { force: true }
        );
        this.isDisconnectNotified = true;
      }, this.config.notify.disconnectedAfter);

    this._scheduleReconnect(delay);
  }

  _scheduleReconnect(delay) {
    if (this.isStopping) return;
    const { minDelay, maxDelay, jitter } = this.config.reconnect;
    if (delay === undefined) {
      const base = Math.min(
        maxDelay,
        minDelay * 2 ** Math.min(this.attempts - 1, 16)
      );
      delay = base * (1 - jitter + Math.random() * jitter * 2);
    }

    if (this.state !== 'waiting') this._setState('waiting');
    this.logger.debug('Reconnecting', { in_ms: Math.round(delay) });
    clearTimeout(this._reconnectTimer);
    this._reconnectTimer = setTimeout(() => this._connect(), delay);
  }

  _checkHeartbeat() {
    const { ws } = this;
    if (!ws) return;
    if (Date.now() - this.lastSeenAt > this.config.heartbeat.timeout) {
      this.logger.warn('Nothing received from the API in time, reconnecting');
      ws.terminate();
      return;
    }

    // (so a dead link is noticed without waiting for the API's own ping)
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.ping();
      } catch {}
    }
  }

  _onEvent(ws, message) {
    switch (message?.event) {
      case 'ready': {
        clearTimeout(this._readyTimer);
        ws.isReady = true;
        this.attempts = 0;
        this.lastError = '';
        this.servedDomains = (message.domains || []).map((d) => d.name);
        this.rejectedDomains = message.rejected || [];
        this._setState('connected');
        this.logger.info(`Connected for ${this.servedDomains.join(', ')}`);
        for (const rejected of this.rejectedDomains) {
          this.logger.warn(`${rejected.name}: ${rejected.message}`);
          this.notify('error', `${rejected.name}: ${rejected.message}`);
        }

        clearTimeout(this._disconnectedTimer);
        this._disconnectedTimer = null;
        if (this.isDisconnectNotified || !this.hasConnectedBefore)
          this.notify(
            'connected',
            `Connected. Mail for ${this.servedDomains.join(
              ', '
            )} is delivered to your mail server.`,
            { force: true }
          );
        this.isDisconnectNotified = false;
        this.hasConnectedBefore = true;
        if (this.rejectedDomains.length > 0) this._retryDomains(ws);
        this._sendLocalStatus();
        break;
      }

      case 'released': {
        this.servedDomains = this.servedDomains.filter(
          (d) => d !== message.domain
        );
        this.logger.warn(`No longer serving ${message.domain}`, {
          code: message.code
        });
        this.rejectedDomains.push({
          name: message.domain,
          code: message.code,
          message: 'No longer served'
        });
        this._writeStatus();
        if (message.code !== 'REPLACED') this._retryDomains(ws);
        break;
      }

      case 'error': {
        const details = Array.isArray(message.rejected)
          ? message.rejected.map((r) => `${r.name}: ${r.message}`).join('; ')
          : message.message;
        this.lastError = details || message.code;
        this.rejectedDomains = message.rejected || [];
        this.logger.error(`The API refused the connection: ${this.lastError}`);
        this.notify('error', this.lastError);
        break;
      }

      default:
    }
  }

  // Connects again later for the domains that are not served (e.g. the
  // setting of one was turned on after the app connected)
  _retryDomains(ws) {
    clearTimeout(this._retryDomainsTimer);
    this._retryDomainsTimer = setTimeout(() => {
      if (this.ws !== ws) return;
      if (this.inFlight === 0) ws.close(1000, 'Reconnecting');
      else this._retryDomains(ws);
    }, this.config.reconnect.slowDelay);
    this._retryDomainsTimer.unref?.();
  }

  // A binary frame: the length of the header, the header, then the body
  _onRequest(ws, data) {
    if (data.length < 4) throw new Error('Frame too short');
    const length = data.readUInt32BE(0);
    if (length > data.length - 4) throw new Error('Invalid frame');
    const header = JSON.parse(data.subarray(4, 4 + length).toString());
    const body = data.subarray(4 + length);
    if (typeof header.id !== 'string') throw new Error('Request has no id');

    const answer = (result) => {
      if (ws.readyState !== WebSocket.OPEN) return;
      ws.send(JSON.stringify({ ...result, event: 'result', id: header.id }));
    };

    if (header.event === 'deliver') {
      this.queue.push({ header, body, answer });
      this._drain();
    } else if (header.event === 'imap') {
      this.stats.imap++;
      this.imap
        .run(header)
        .then(answer)
        .catch((error) =>
          answer({ error: { code: 'IMAP_ERROR', message: error.message } })
        );
    } else {
      answer({ error: { code: 'UNSUPPORTED', message: 'Update the app' } });
    }
  }

  _drain() {
    while (
      this.queue.length > 0 &&
      this.inFlight < Math.max(1, this.config.local.maxConcurrent)
    ) {
      const { header, body, answer } = this.queue.shift();
      this.inFlight++;
      this._deliver(header, body)
        .catch((error) => ({
          error: { code: 'LOCAL_UNREACHABLE', message: error.message }
        }))
        .then((result) => {
          this.inFlight--;
          this._writeStatusSoon();
          answer(result);
          this._drain();
        });
    }
  }

  //
  // delivery
  //
  //
  // A message that is still being delivered when its sender retries it (the
  // MX server stopped waiting for a slow local server) is not delivered a
  // second time: the retry is answered with the outcome of the first.
  //
  _deliver(header, body) {
    const { fingerprint } = header;
    if (typeof fingerprint !== 'string') return this._deliverOnce(header, body);
    const running = this.delivering.get(fingerprint);
    if (running) {
      this.stats.duplicates++;
      return running;
    }

    const promise = this._deliverOnce(header, body).finally(() => {
      this.delivering.delete(fingerprint);
    });
    this.delivering.set(fingerprint, promise);
    return promise;
  }

  async _deliverOnce(header, body) {
    const domain = String(header.domain || '').toLowerCase();
    const to = Array.isArray(header.to)
      ? header.to.filter((address) => typeof address === 'string')
      : [];
    if (!this.config.domains.includes(domain) || to.length === 0)
      return {
        error: {
          code: 'NOT_ALLOWED',
          message: 'Domain is not served by this app'
        }
      };

    const { fingerprint } = header;
    if (typeof fingerprint === 'string' && this.delivered.has(fingerprint)) {
      this.stats.duplicates++;
      this.logger.info('Already delivered, not delivered again', { to });
      return { accepted: to, rejected: [], response: '250 Already delivered' };
    }

    const local = getLocal(this.config, domain);
    const result = await deliver(local, { from: header.from, to }, body);
    const target = `${local.host}:${local.port}`;

    if (result.error && LOCAL_ERROR_CODES.has(result.error.code)) {
      this.stats.deferred++;
      this.lastError = result.error.message;
      this.logger.error(
        `Mail server at ${target} not reachable: ${result.error.message}`
      );
      this._setLocal(target, { ok: false, message: result.error.message });
      return result;
    }

    this._setLocal(target, { ok: true, message: '' });

    if (result.error || result.accepted.length === 0) {
      const code = Number(
        result.error?.smtp_code || result.rejected?.[0]?.code
      );
      if (code >= 500) this.stats.rejected++;
      else this.stats.deferred++;
      this.logger.warn('Mail server refused a message', {
        from: header.from,
        to,
        response: result.error?.response || result.rejected?.[0]?.response
      });
      return result;
    }

    this.stats.delivered++;
    this.lastDeliveryAt = new Date().toISOString();
    this.logger.info('Delivered', {
      from: header.from,
      to: result.accepted,
      size: body.length
    });
    if (typeof fingerprint === 'string' && result.rejected.length === 0) {
      this.delivered.set(fingerprint, Date.now());
      this._saveDelivered();
    }

    return result;
  }

  //
  // local mail server state
  //
  _setLocal(target, state) {
    const previous = this.localStates.get(target);
    this.localStates.set(target, state);
    if (previous && previous.ok === state.ok) return;
    if (!state.ok) {
      this.notify(
        'local_down',
        `Your mail server at ${target} is not reachable. Incoming mail is deferred (not lost) until it is back.`,
        { force: true }
      );
    } else if (previous) {
      this.logger.info(`Mail server at ${target} is reachable again`);
      this.notify(
        'local_up',
        `Your mail server at ${target} is reachable again.`,
        {
          force: true
        }
      );
    }

    this._sendLocalStatus();
    this._writeStatus();
  }

  _sendLocalStatus() {
    const { ws } = this;
    if (!ws || !ws.isReady || ws.readyState !== WebSocket.OPEN) return;
    for (const domain of this.servedDomains) {
      const local = getLocal(this.config, domain);
      const state = this.localStates.get(`${local.host}:${local.port}`);
      if (!state) continue;
      ws.send(
        JSON.stringify({
          event: 'status',
          domain,
          local: state.ok ? 'up' : 'down',
          message: state.message
        })
      );
    }
  }

  async _probeAll() {
    const targets = new Map();
    for (const domain of this.config.domains) {
      const local = getLocal(this.config, domain);
      targets.set(`${local.host}:${local.port}`, local);
    }

    for (const [target, local] of targets) {
      const result = await probe(local, this.config.probe.timeout);
      if (this.isStopping) return;
      if (!result.ok)
        this.logger.warn(
          `Mail server at ${target} not reachable: ${result.message}`
        );
      this._setLocal(target, {
        ok: result.ok,
        message: result.ok ? '' : result.message
      });
    }
  }

  //
  // deliveries remembered, so that a message whose answer was lost on the
  // way back is not delivered twice when its sender retries it
  //
  _loadDelivered() {
    try {
      const data = JSON.parse(fs.readFileSync(this.deliveredFile, 'utf8'));
      const cutoff = Date.now() - this.config.dedupe.ttl;
      for (const [fingerprint, time] of Object.entries(data))
        if (time > cutoff) this.delivered.set(fingerprint, time);
    } catch {}
  }

  _saveDelivered(isNow = false) {
    clearTimeout(this._deliveredTimer);
    const save = () => {
      const { ttl, max } = this.config.dedupe;
      const cutoff = Date.now() - ttl;
      for (const [fingerprint, time] of this.delivered) {
        if (time <= cutoff || this.delivered.size > max)
          this.delivered.delete(fingerprint);
        else break;
      }

      try {
        fs.mkdirSync(this.config.directory, { recursive: true, mode: 0o700 });
        writeFileAtomic(
          this.deliveredFile,
          JSON.stringify(Object.fromEntries(this.delivered))
        );
      } catch (error) {
        this.logger.debug('Delivered list not written', {
          message: error.message
        });
      }
    };

    if (isNow) return save();
    this._deliveredTimer = setTimeout(save, 1000);
    this._deliveredTimer.unref?.();
  }
}
