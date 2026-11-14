/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');
const url = require('node:url');
const { Buffer } = require('node:buffer');
const { randomUUID } = require('node:crypto');

const WebSocket = require('ws');
const basicAuth = require('basic-auth');
const isFQDN = require('is-fqdn');
const ms = require('ms');

const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const ensureApiTokenEnabled = require('#helpers/ensure-api-token-enabled');
const getIpBucket = require('#helpers/get-ip-bucket');
const logger = require('#helpers/logger');
const tunnel = require('#helpers/tunnel');
const { decrypt } = require('#helpers/encrypt-decrypt');
const {
  CLOSE_CODE_REVOKED,
  getRedisTime,
  getSubjects,
  isRevokedSince
} = require('#helpers/credential-revocation');

//
// The WebSocket the Mail Server Tunnel app (`tools/mail-server-tunnel`)
// connects to (see `helpers/tunnel.js` for how requests reach it).
//
// The app authenticates with an API token in the Authorization header, then
// names the domains it serves in its first message. A domain is served when
// the token's user is an admin of it, it is on a paid plan and its "Mail
// Server Tunnel" setting is on. One app serves a domain at a time: the last
// one to connect takes over.
//
const WS_PATH = '/v1/tunnel';

// what the app sends is small (answers, status), what it is sent is not
const MAX_INCOMING_PAYLOAD = 1024 * 1024;
// answers to IMAP commands are capped by the app, see its `imap.maxBytes`
const MAX_IMAP_RESULT = 32 * 1024 * 1024;
const MAX_DOMAINS = 50;
const MAX_TOTAL_CONNECTIONS = 10_000;
const MAX_CONNECTIONS_PER_USER = 20;
const MAX_CONNECT_ATTEMPTS_PER_MINUTE = 60;
const MAX_AUTH_FAILURES_PER_IP = 20;
const AUTH_FAILURE_WINDOW_MS = ms('15m');
// requests one app works on at once (more are answered as busy, and retried)
const { MAX_IN_FLIGHT } = tunnel;
// a message still waiting in the socket's buffer this large means the app
// cannot keep up
const MAX_SEND_BUFFER = 128 * 1024 * 1024;
// status messages an app may send in a window (see `_onMessage`)
const STATUS_WINDOW = ms('1m');
const MAX_STATUS_PER_WINDOW = 30;
const HELLO_TIMEOUT = ms('10s');
const KEEP_ALIVE_INTERVAL = ms('20s');
const ONLINE_REFRESH_INTERVAL = ms('30s');
const ACCESS_CHECK_INTERVAL = ms('5m');

const CLOSE_CODE_ERROR = 4400;
const CLOSE_CODE_FORBIDDEN = 4403;
const CLOSE_CODE_REPLACED = 4409;

function getRemoteAddress(request) {
  const socketAddress = request.socket.remoteAddress;
  if (!config.WS_TRUST_PROXY) return socketAddress;
  const header = request.headers['x-forwarded-for'];
  if (typeof header !== 'string') return socketAddress;
  return header.split(',').at(-1).trim() || socketAddress;
}

function refuse(socket, status, extra = '') {
  socket.on('error', () => socket.destroy());
  socket.end(`HTTP/1.1 ${status}\r\n${extra}Connection: close\r\n\r\n`);
}

// a string an app sent about itself, as short text without control characters
function clean(value, max = 100) {
  if (typeof value !== 'string') return '';
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u001F\u007F]/g, '').slice(0, max);
}

class TunnelWebSocketHandler {
  constructor(options = {}) {
    this.server = options.server;
    this.client = options.client;
    //
    // domain id => WebSocket (the id, never the name: another account can
    // add a domain of the same name, which its DNS does not verify, and must
    // not receive the mail of the one that it does)
    //
    this.domains = new Map();
    this.helloTimeout = HELLO_TIMEOUT;
    this.accessCheckInterval = ACCESS_CHECK_INTERVAL;

    this.wss = new WebSocket.WebSocketServer({
      noServer: true,
      maxPayload: MAX_IMAP_RESULT,
      perMessageDeflate: false
    });

    this.subscriber = this.client.duplicate();
    this.subscriber.setMaxListeners(0);

    this._onUpgrade = this._onUpgrade.bind(this);
    this._onSubscriberMessage = this._onSubscriberMessage.bind(this);
    this.server.on('upgrade', this._onUpgrade);
    this.subscriber.on('message', this._onSubscriberMessage);
    this.subscriber
      .subscribe(tunnel.TAKEOVER_CHANNEL)
      .catch((err) => logger.fatal(err));

    this._keepAliveInterval = setInterval(() => {
      for (const ws of this.wss.clients) {
        if (ws.isAlive === false) {
          ws.terminate();
          continue;
        }

        ws.isAlive = false;
        ws.ping();
      }
    }, KEEP_ALIVE_INTERVAL);

    this._onlineInterval = setInterval(() => {
      for (const ws of this.wss.clients) {
        this._refreshOnline(ws).catch((err) => logger.fatal(err));
        if (Date.now() - ws.accessCheckedAt >= this.accessCheckInterval)
          this._checkAccess(ws).catch((err) => logger.fatal(err));
      }
    }, ONLINE_REFRESH_INTERVAL);
  }

  // (fixed windows shared by every API process, as in the API WebSocket)
  async _isRateLimited(ip) {
    try {
      const key = `tunnel_rate:${config.env}:${ip}`;
      const results = await this.client
        .multi()
        .set(key, 0, 'PX', ms('1m'), 'NX')
        .incr(key)
        .exec();
      const count = results?.[1]?.[1];
      return (
        typeof count === 'number' && count > MAX_CONNECT_ATTEMPTS_PER_MINUTE
      );
    } catch (err) {
      logger.fatal(err);
      return false;
    }
  }

  async _isAuthLocked(ip) {
    try {
      const count = await this.client.get(
        `tunnel_auth_fail:${config.env}:${ip}`
      );
      return Number(count) >= MAX_AUTH_FAILURES_PER_IP;
    } catch (err) {
      logger.fatal(err);
      return false;
    }
  }

  async _recordAuthFailure(ip) {
    try {
      const key = `tunnel_auth_fail:${config.env}:${ip}`;
      await this.client
        .multi()
        .set(key, 0, 'PX', AUTH_FAILURE_WINDOW_MS, 'NX')
        .incr(key)
        .exec();
    } catch (err) {
      logger.fatal(err);
    }
  }

  // the user an API token belongs to (as the rest of the API checks it)
  async _authenticate(request) {
    const header = request.headers.authorization;
    const token =
      typeof header === 'string' && /^bearer /i.test(header)
        ? header.slice(7).trim()
        : basicAuth(request)?.name;

    if (typeof token !== 'string' || !token || token.length > 320) return null;

    const user = await Users.findByApiToken(token).lean().exec();
    if (!user) return null;
    try {
      ensureApiTokenEnabled(user);
    } catch {
      return null;
    }

    if (
      !user[config.userFields.hasVerifiedEmail] ||
      user[config.userFields.isBanned]
    )
      return null;
    return user;
  }

  async _onUpgrade(request, socket, head) {
    const { pathname } = url.parse(request.url);
    // (other paths belong to the API WebSocket, which answers them)
    if (pathname !== WS_PATH) return;

    socket.on('error', () => socket.destroy());

    const remoteAddress = getRemoteAddress(request);
    const ip = getIpBucket(remoteAddress);

    try {
      if (this.isClosing || this.wss.clients.size >= MAX_TOTAL_CONNECTIONS)
        return refuse(socket, '503 Service Unavailable', 'Retry-After: 60\r\n');

      if ((await this._isRateLimited(ip)) || (await this._isAuthLocked(ip)))
        return refuse(socket, '429 Too Many Requests', 'Retry-After: 60\r\n');

      // (before the lookup, so that a token reset meanwhile is not missed)
      const authStartedAt = await getRedisTime(this.client);
      const user = await this._authenticate(request);
      if (!user) {
        await this._recordAuthFailure(ip);
        return refuse(socket, '401 Unauthorized');
      }

      const userId = user._id.toString();
      let count = 0;
      for (const ws of this.wss.clients) {
        if (ws.userId === userId) count++;
      }

      if (count >= MAX_CONNECTIONS_PER_USER)
        return refuse(socket, '429 Too Many Requests', 'Retry-After: 60\r\n');

      this.wss.handleUpgrade(request, socket, head, (ws) => {
        ws.id = randomUUID();
        ws.userId = userId;
        ws.subjects = getSubjects({ accountIds: [userId], tokenIds: [userId] });
        ws.authStartedAt = authStartedAt;
        ws.accessCheckedAt = Date.now();
        ws.isAlive = true;
        // ids of the domains it serves, and their names
        ws.names = new Set();
        ws.domainNames = new Map();
        ws.local = {};
        ws.info = {};
        ws.pending = new Map();
        ws.statusWindowAt = 0;
        ws.statusCount = 0;
        this._onConnection(ws);
      });
    } catch (err) {
      logger.fatal(err);
      refuse(socket, '503 Service Unavailable', 'Retry-After: 60\r\n');
    }
  }

  _send(ws, message) {
    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message));
  }

  _fail(ws, closeCode, code, message) {
    this._send(ws, { event: 'error', code, message });
    ws.close(closeCode, code);
  }

  _onConnection(ws) {
    ws.helloTimer = setTimeout(() => {
      this._fail(ws, CLOSE_CODE_ERROR, 'HELLO_TIMEOUT', 'No hello was sent');
    }, this.helloTimeout);

    ws.on('pong', () => {
      ws.isAlive = true;
    });
    ws.on('error', (err) => logger.debug(err));
    ws.on('close', () => {
      this._onClose(ws).catch((err) => logger.fatal(err));
    });
    ws.on('message', (data, isBinary) => {
      ws.isAlive = true;
      if (isBinary)
        return this._fail(ws, CLOSE_CODE_ERROR, 'INVALID', 'Invalid message');
      // (only the answer to an IMAP command that is awaited can be large,
      // and nothing larger is parsed)
      if (data.length > MAX_INCOMING_PAYLOAD) {
        let isAwaited = false;
        for (const pending of ws.pending.values())
          if (pending.event === 'imap') isAwaited = true;
        if (!isAwaited)
          return this._fail(ws, CLOSE_CODE_ERROR, 'INVALID', 'Too large');
      }

      let message;
      try {
        message = JSON.parse(data.toString());
      } catch {
        return this._fail(ws, CLOSE_CODE_ERROR, 'INVALID', 'Invalid message');
      }

      if (!message || typeof message !== 'object' || Array.isArray(message))
        return this._fail(ws, CLOSE_CODE_ERROR, 'INVALID', 'Invalid message');

      this._onMessage(ws, message, data.length).catch((err) => {
        logger.fatal(err);
        this._fail(ws, CLOSE_CODE_ERROR, 'ERROR', 'Try again later');
      });
    });
  }

  async _onMessage(ws, message, size) {
    if (!ws.isReady) {
      if (message.event !== 'hello' || ws.isHelloSeen)
        return this._fail(ws, CLOSE_CODE_ERROR, 'INVALID', 'Send hello first');
      ws.isHelloSeen = true;
      return this._onHello(ws, message);
    }

    switch (message.event) {
      case 'result': {
        const pending = ws.pending.get(message.id);
        if (!pending) return;
        // (only the answer to an IMAP command can be this large)
        if (size > MAX_INCOMING_PAYLOAD && pending.event !== 'imap')
          return this._fail(ws, CLOSE_CODE_ERROR, 'INVALID', 'Too large');
        ws.pending.delete(message.id);
        clearTimeout(pending.timer);
        await this.client.publish(
          pending.replyTo,
          JSON.stringify({ ...message, event: undefined, reply_to: undefined })
        );
        return;
      }

      // whether the app can reach the local mail server for a domain
      case 'status': {
        // (each one is a write to Redis: more than a few a minute are not
        // changes of state, and are ignored)
        const now = Date.now();
        if (now - ws.statusWindowAt > STATUS_WINDOW) {
          ws.statusWindowAt = now;
          ws.statusCount = 0;
        }

        if (++ws.statusCount > MAX_STATUS_PER_WINDOW) return;
        const name = this._getServedName(ws, message.domain);
        if (!name) return;
        ws.local[name] = {
          state: message.local === 'down' ? 'down' : 'up',
          message: clean(message.message, 500)
        };
        await this._refreshOnline(ws, [name]);
        break;
      }

      default:
    }
  }

  _getServedName(ws, domain) {
    if (typeof domain !== 'string') return null;
    let name;
    try {
      name = tunnel.getName(domain);
    } catch {
      return null;
    }

    for (const [id, served] of ws.domainNames)
      if (served === name && ws.names.has(id)) return id;
    return null;
  }

  // the domains (of those asked for) that this user's app may serve
  async _getAccess(userId, names) {
    const allowed = [];
    const rejected = [];
    const domains = await Domains.find({
      name: {
        $in: [...new Set(names.flatMap((n) => [n, punycode.toUnicode(n)]))]
      },
      members: { $elemMatch: { user: userId, group: 'admin' } }
    })
      .select('name plan has_tunnel is_global has_txt_record')
      .lean()
      .exec();
    // (of two domains of one name this user administers, the verified one)
    const byName = new Map();
    for (const domain of domains) {
      const name = tunnel.getName(domain.name);
      if (!byName.get(name)?.has_txt_record) byName.set(name, domain);
    }

    for (const name of names) {
      const domain = byName.get(name);
      if (!domain || domain.is_global)
        rejected.push({
          name,
          code: 'NOT_FOUND',
          message:
            'Domain not found, or this API token is not for an admin of it'
        });
      else if (domain.plan === 'free')
        rejected.push({
          name,
          code: 'PLAN',
          message: 'Domain is not on a paid plan'
        });
      //
      // (the MX server only hands mail to the domain that the name's DNS TXT
      // record verifies, whatever connects here, see `helpers/get-settings`;
      // one that is not verified is told so instead of waiting for mail
      // that will never come)
      //
      else if (!domain.has_txt_record)
        rejected.push({
          name,
          code: 'NOT_VERIFIED',
          message:
            'Domain is not verified: add its Forward Email TXT verification record to its DNS first'
        });
      else if (domain.has_tunnel)
        allowed.push({ name, id: domain._id.toString() });
      else
        rejected.push({
          name,
          code: 'NOT_ENABLED',
          message: 'Mail Server Tunnel is not enabled for this domain'
        });
    }

    return { allowed, rejected };
  }

  async _onHello(ws, message) {
    clearTimeout(ws.helloTimer);

    if (message.protocol !== tunnel.PROTOCOL_VERSION)
      return this._fail(
        ws,
        CLOSE_CODE_ERROR,
        'UNSUPPORTED_PROTOCOL',
        'Update the Mail Server Tunnel app to its latest version'
      );

    const names = new Set();
    if (Array.isArray(message.domains)) {
      for (const domain of message.domains.slice(0, MAX_DOMAINS + 1)) {
        if (typeof domain !== 'string' || domain.length > 255) continue;
        let name;
        try {
          name = tunnel.getName(domain);
        } catch {
          continue;
        }

        if (isFQDN(name)) names.add(name);
      }
    }

    if (names.size === 0 || names.size > MAX_DOMAINS)
      return this._fail(
        ws,
        CLOSE_CODE_ERROR,
        'INVALID_DOMAINS',
        `Name between 1 and ${MAX_DOMAINS} domains`
      );

    const { allowed, rejected } = await this._getAccess(ws.userId, [...names]);
    if (ws.readyState !== WebSocket.OPEN) return;
    if (allowed.length === 0) {
      this._send(ws, { event: 'error', code: 'NO_DOMAINS', rejected });
      ws.close(CLOSE_CODE_FORBIDDEN, 'NO_DOMAINS');
      return;
    }

    ws.info = {
      connection_id: ws.id,
      connected_at: new Date().toISOString(),
      hostname: clean(message.hostname),
      version: clean(message.version, 20),
      platform: clean(message.platform, 20),
      imap: message.imap === true
    };

    for (const { name, id } of allowed) {
      // (an app this process already serves the domain for is replaced)
      const existing = this.domains.get(id);
      if (existing && existing !== ws) this._release(existing, id);
      this.domains.set(id, ws);
      ws.names.add(id);
      ws.domainNames.set(id, name);
    }

    await this.subscriber.subscribe(
      ...allowed.map(({ id }) => `${tunnel.REQUEST_PREFIX}${id}`)
    );
    // (apps other processes serve these domains for are replaced)
    await this.client.publish(
      tunnel.TAKEOVER_CHANNEL,
      JSON.stringify({
        connection_id: ws.id,
        names: allowed.map(({ id }) => id)
      })
    );
    await this._refreshOnline(ws);

    ws.isReady = true;
    this._send(ws, {
      event: 'ready',
      protocol: tunnel.PROTOCOL_VERSION,
      domains: allowed,
      rejected,
      heartbeat: KEEP_ALIVE_INTERVAL
    });
  }

  // marks the app as connected for its domains (see `tunnel.request`)
  async _refreshOnline(ws, names = [...ws.names]) {
    if (!ws.isReady && !ws.isHelloSeen) return;
    if (ws.readyState !== WebSocket.OPEN || names.length === 0) return;
    const multi = this.client.multi();
    for (const name of names) {
      // (another app has taken the domain over since)
      if (this.domains.get(name) !== ws) continue;
      multi.set(
        `${tunnel.ONLINE_PREFIX}${name}`,
        JSON.stringify({
          ...ws.info,
          local: ws.local[name] || { state: 'up', message: '' }
        }),
        'PX',
        tunnel.ONLINE_TTL
      );
    }

    await multi.exec();
  }

  // stops serving a domain on a connection (closed once it serves none)
  _release(ws, name, code = 'REPLACED') {
    if (!ws.names.delete(name)) return;
    if (this.domains.get(name) === ws) {
      this.domains.delete(name);
      this.subscriber
        .unsubscribe(`${tunnel.REQUEST_PREFIX}${name}`)
        .catch((err) => logger.fatal(err));
    }

    this._send(ws, {
      event: 'released',
      domain: ws.domainNames.get(name),
      code
    });
    ws.domainNames.delete(name);
    if (ws.names.size === 0)
      ws.close(
        code === 'REPLACED' ? CLOSE_CODE_REPLACED : CLOSE_CODE_FORBIDDEN,
        code
      );
  }

  // closes a connection whose token was reset or whose domains changed
  async _checkAccess(ws) {
    ws.accessCheckedAt = Date.now();
    if (!ws.isReady) return;
    if (await isRevokedSince(this.client, ws.subjects, ws.authStartedAt)) {
      ws.close(CLOSE_CODE_REVOKED, 'REVOKED');
      return;
    }

    const user = await Users.findById(ws.userId)
      .select(
        `${config.userFields.isBanned} ${config.userFields.apiTokenDisabled}`
      )
      .lean()
      .exec();
    if (
      !user ||
      user[config.userFields.isBanned] ||
      user[config.userFields.apiTokenDisabled]
    ) {
      ws.close(CLOSE_CODE_REVOKED, 'REVOKED');
      return;
    }

    const { allowed } = await this._getAccess(ws.userId, [
      ...ws.domainNames.values()
    ]);
    // (a domain that was removed and added again is another domain)
    const names = new Set(allowed.map(({ id }) => id));
    for (const name of ws.names) {
      if (names.has(name)) continue;
      this.client
        .del(`${tunnel.ONLINE_PREFIX}${name}`)
        .catch((err) => logger.fatal(err));
      this._release(ws, name, 'NOT_ALLOWED');
    }
  }

  _onSubscriberMessage(channel, message) {
    let data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      logger.fatal(err);
      return;
    }

    if (channel === tunnel.TAKEOVER_CHANNEL) {
      if (!Array.isArray(data?.names)) return;
      for (const name of data.names) {
        const ws = this.domains.get(name);
        if (ws && ws.id !== data.connection_id) this._release(ws, name);
      }

      return;
    }

    if (!channel.startsWith(tunnel.REQUEST_PREFIX)) return;
    this._onRequest(channel.slice(tunnel.REQUEST_PREFIX.length), data).catch(
      (err) => logger.fatal(err)
    );
  }

  _reply(replyTo, id, error) {
    this.client
      .publish(replyTo, JSON.stringify({ id, error }))
      .catch((err) => logger.fatal(err));
  }

  // a request from `tunnel.request` for a domain this process serves
  async _onRequest(name, data) {
    const { id, reply_to: replyTo, has_body: hasBody, ...header } = data;
    if (typeof id !== 'string' || typeof replyTo !== 'string') return;

    //
    // (during a takeover, the process of the app being replaced may still
    // serve this request: an answer from here would have the sender retry a
    // message that is being delivered, so this process says nothing, and a
    // request no process answers is retried once it times out)
    //
    const ws = this.domains.get(name);
    if (!ws || !ws.isReady || ws.readyState !== WebSocket.OPEN) return;

    if (
      ws.pending.size >= MAX_IN_FLIGHT ||
      ws.bufferedAmount >= MAX_SEND_BUFFER
    )
      return this._reply(replyTo, id, {
        code: 'BUSY',
        message: 'Tunnel is busy'
      });

    // (reserved before the body is read, which other requests may overtake)
    const pending = { replyTo, event: header.event };
    ws.pending.set(id, pending);

    let body = Buffer.alloc(0);
    if (hasBody) {
      body = await this.client.getBuffer(`${tunnel.BODY_PREFIX}${id}`);
      if (!body || ws.readyState !== WebSocket.OPEN) {
        ws.pending.delete(id);
        return this._reply(replyTo, id, {
          code: 'OFFLINE',
          message: 'Tunnel is not connected'
        });
      }
    }

    // (answered by `tunnel.request` itself once its own timer runs out; this
    // one only forgets a request the app never answered)
    pending.timer = setTimeout(
      () => ws.pending.delete(id),
      Math.max(tunnel.DELIVER_TIMEOUT, tunnel.IMAP_TIMEOUT) + ms('30s')
    );

    // (the mailbox credentials of an IMAP command, see
    // `app/controllers/api/v1/tunnel.js`)
    if (typeof header.auth === 'string') {
      try {
        header.auth = JSON.parse(decrypt(header.auth));
      } catch (err) {
        logger.fatal(err);
        clearTimeout(pending.timer);
        ws.pending.delete(id);
        return this._reply(replyTo, id, {
          code: 'ERROR',
          message: 'Try again later'
        });
      }
    }

    // one binary frame: the length of the header, the header, then the body
    const json = Buffer.from(JSON.stringify({ ...header, id }));
    const length = Buffer.alloc(4);
    length.writeUInt32BE(json.length);
    ws.send(Buffer.concat([length, json, body]), { binary: true });
  }

  async _onClose(ws) {
    clearTimeout(ws.helloTimer);
    for (const [id, pending] of ws.pending) {
      clearTimeout(pending.timer);
      this._reply(pending.replyTo, id, {
        code: 'OFFLINE',
        message: 'Tunnel disconnected'
      });
    }

    ws.pending.clear();

    for (const name of ws.names) {
      if (this.domains.get(name) !== ws) continue;
      this.domains.delete(name);
      this.subscriber
        .unsubscribe(`${tunnel.REQUEST_PREFIX}${name}`)
        .catch((err) => logger.fatal(err));
      // (unless another process's app has taken the domain over since)
      const key = `${tunnel.ONLINE_PREFIX}${name}`;
      try {
        const value = await this.client.get(key);
        if (value && JSON.parse(value).connection_id === ws.id)
          await this.client.del(key);
      } catch (err) {
        logger.fatal(err);
      }
    }

    ws.names.clear();
    ws.domainNames.clear();
  }

  async close() {
    this.isClosing = true;
    clearInterval(this._keepAliveInterval);
    clearInterval(this._onlineInterval);
    this.server.removeListener('upgrade', this._onUpgrade);
    const closing = [];
    for (const ws of this.wss.clients) {
      closing.push(this._onClose(ws).catch((err) => logger.fatal(err)));
      ws.close(1001, 'Server shutting down');
    }

    await Promise.all(closing);
    await new Promise((resolve) => {
      this.wss.close(resolve);
    });
    this.subscriber.disconnect();
  }
}

TunnelWebSocketHandler.WS_PATH = WS_PATH;

module.exports = TunnelWebSocketHandler;
