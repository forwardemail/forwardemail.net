/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');
const { randomUUID } = require('node:crypto');

const ms = require('ms');

const logger = require('#helpers/logger');

//
// Mail Server Tunnel
//
// A mail server behind CGNAT (e.g. Starlink, 5G home internet) cannot be
// connected to, so its owner runs the tunnel app (`tools/mail-server-tunnel`)
// beside it. The app keeps a WebSocket open to the API (see
// `helpers/tunnel-websocket-handler.js`), and whichever API process holds
// that socket subscribes to the domain's request channel in Redis.
//
// Any process (the MX server for a delivery, the API for an IMAP command)
// sends a request with `request` below: the body (a message) is parked in
// Redis for the few seconds the request takes, the request is published to
// the domain's channel, and the answer comes back on a reply channel that
// only this process listens to. Nothing is kept once it is answered.
//
const REQUEST_PREFIX = 'tunnel_request:';
const ONLINE_PREFIX = 'tunnel_online:';
const BODY_PREFIX = 'tunnel_body:';
const IN_FLIGHT_PREFIX = 'tunnel_in_flight:';
const TAKEOVER_CHANNEL = 'tunnel_takeover';
// requests to one domain's app at once (as the app's own handler allows)
const MAX_IN_FLIGHT = 20;
const PROTOCOL_VERSION = 1;

const DELIVER_TIMEOUT = ms('60s');
const IMAP_TIMEOUT = ms('30s');
// how long an app is seen as connected after its last refresh
const ONLINE_TTL = ms('90s');

// codes the app answers with when the local mail server could not be reached
// (as opposed to having refused the message)
const LOCAL_ERROR_CODES = new Set([
  'LOCAL_UNREACHABLE',
  'LOCAL_TIMEOUT',
  'LOCAL_TLS',
  'LOCAL_AUTH'
]);

class TunnelError extends Error {
  constructor(code, message, props = {}) {
    super(message);
    this.name = 'TunnelError';
    this.code = code;
    this.isTunnel = true;
    Object.assign(this, props);
  }
}

// the name a domain's channel and keys are stored by
function getName(domain) {
  return punycode.toASCII(String(domain).trim().toLowerCase());
}

// Redis client => { subscriber, channel, pending, ready }
const states = new WeakMap();

function getState(client) {
  let state = states.get(client);
  if (state) return state;

  const subscriber = client.duplicate();
  subscriber.setMaxListeners(0);
  const channel = `tunnel_reply:${randomUUID()}`;
  const pending = new Map();
  subscriber.on('message', (name, message) => {
    if (name !== channel) return;
    let reply;
    try {
      reply = JSON.parse(message);
    } catch (err) {
      logger.fatal(err);
      return;
    }

    const fn = pending.get(reply?.id);
    if (!fn) return;
    pending.delete(reply.id);
    fn(reply);
  });
  state = {
    subscriber,
    channel,
    pending,
    ready: subscriber.subscribe(channel)
  };
  // (so a failed subscription is tried again by the next request)
  state.ready.catch(() => {
    states.delete(client);
    subscriber.disconnect();
  });
  states.set(client, state);
  return state;
}

// stops listening for answers (when the server that sent requests closes)
function close(client) {
  const state = states.get(client);
  if (!state) return;
  states.delete(client);
  state.subscriber.disconnect();
}

// (`id` is the id of the domain, see `request`)
async function isOnline(client, id) {
  return Boolean(await client.get(`${ONLINE_PREFIX}${id}`));
}

//
// Sends `payload` (and `body`, a Buffer) to the app connected for `domain`
// and returns its answer. Throws a `TunnelError` whose code is `OFFLINE`
// when no app is connected, or `TIMEOUT` when it did not answer in time.
//
//
// A domain is named by its id, never by its name: accounts can add a domain
// of the same name, and only the one that the name's DNS verifies (which the
// MX server looks up, see `helpers/get-settings.js`) receives its mail.
//
async function request(client, domainId, payload, options = {}) {
  const { body, timeout = DELIVER_TIMEOUT } = options;
  const name = String(domainId);

  if (!(await client.get(`${ONLINE_PREFIX}${name}`)))
    throw new TunnelError('OFFLINE', 'Tunnel is not connected');

  const state = getState(client);
  await state.ready;

  //
  // requests in flight for the domain, across every process (so that many
  // senders at once cannot park more than this many messages in Redis; the
  // rest are asked to try again)
  //
  const inFlightKey = `${IN_FLIGHT_PREFIX}${name}`;
  const [[, inFlight]] = await client
    .multi()
    .incr(inFlightKey)
    .pexpire(inFlightKey, timeout + ms('30s'))
    .exec();
  if (inFlight > MAX_IN_FLIGHT) {
    client.decr(inFlightKey).catch((err) => logger.fatal(err));
    throw new TunnelError('BUSY', 'Tunnel is busy');
  }

  const id = randomUUID();
  const bodyKey = `${BODY_PREFIX}${id}`;
  let timer;
  try {
    if (body) await client.set(bodyKey, body, 'PX', timeout + ms('30s'));

    const reply = new Promise((resolve, reject) => {
      state.pending.set(id, resolve);
      timer = setTimeout(() => {
        reject(new TunnelError('TIMEOUT', 'Tunnel did not answer in time'));
      }, timeout);
    });
    // (answered below, or by the timer once nothing awaits it anymore)
    reply.catch(() => {});

    const count = await client.publish(
      `${REQUEST_PREFIX}${name}`,
      JSON.stringify({
        ...payload,
        id,
        reply_to: state.channel,
        has_body: Boolean(body)
      })
    );
    // (the app went away since it was last seen)
    if (count === 0)
      throw new TunnelError('OFFLINE', 'Tunnel is not connected');

    return await reply;
  } finally {
    clearTimeout(timer);
    state.pending.delete(id);
    client.decr(inFlightKey).catch((err) => logger.fatal(err));
    if (body) client.del(bodyKey).catch((err) => logger.fatal(err));
  }
}

//
// Delivers a message to the mail server behind the tunnel and returns its
// response. The error thrown otherwise has the `responseCode` the sender is
// answered with: the local server's own code when it refused the message for
// good, and 421 for everything else (the app is not connected, did not
// answer, or could not reach the local server), so the sender keeps the
// message and tries again.
//
async function deliver(client, options) {
  const { id, domain, from, to, raw, fingerprint, session = {} } = options;

  let reply;
  try {
    reply = await request(
      client,
      id,
      {
        event: 'deliver',
        domain: getName(domain),
        from,
        to,
        fingerprint,
        size: raw.length,
        session
      },
      { body: raw, timeout: options.timeout || DELIVER_TIMEOUT }
    );
  } catch (err) {
    if (!err.isTunnel) throw err;
    err.responseCode = 421;
    err._message = err.message;
    err.message = `The mail server for ${domain} is not reachable right now, please try again later`;
    throw err;
  }

  const rejected = Array.isArray(reply.rejected) ? reply.rejected : [];
  const accepted = Array.isArray(reply.accepted) ? reply.accepted : [];

  if (!reply.error && rejected.length === 0 && accepted.length > 0)
    return { accepted, response: String(reply.response || '250 OK') };

  const failure = reply.error || rejected[0] || {};
  const smtpCode = Number(failure.smtp_code || failure.code);
  const isPermanent =
    !LOCAL_ERROR_CODES.has(failure.code) &&
    Number.isInteger(smtpCode) &&
    smtpCode >= 500 &&
    smtpCode < 600;
  // (the app's own words, which reach the sender: one line of plain text)
  const response = String(
    failure.response || failure.message || 'Delivery failed'
  )
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]+/g, ' ')
    .trim()
    .slice(0, 500);

  const err = new TunnelError(
    typeof failure.code === 'string' ? failure.code : 'REJECTED',
    isPermanent
      ? response
      : `The mail server for ${domain} could not accept the message right now, please try again later`
  );
  if (!isPermanent) err._message = response;
  err.responseCode = isPermanent ? smtpCode : 421;
  err.response = response;
  // (the local server could not be reached, which its owner is alerted to)
  err.isLocalError = LOCAL_ERROR_CODES.has(failure.code);
  throw err;
}

module.exports = {
  BODY_PREFIX,
  DELIVER_TIMEOUT,
  IMAP_TIMEOUT,
  LOCAL_ERROR_CODES,
  MAX_IN_FLIGHT,
  ONLINE_PREFIX,
  ONLINE_TTL,
  PROTOCOL_VERSION,
  REQUEST_PREFIX,
  TAKEOVER_CHANNEL,
  TunnelError,
  close,
  deliver,
  getName,
  isOnline,
  request
};
