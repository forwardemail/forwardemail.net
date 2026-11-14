/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const _ = require('#helpers/lodash');
const tunnel = require('#helpers/tunnel');
const { encrypt } = require('#helpers/encrypt-decrypt');

// Mail Server Tunnel (see `helpers/tunnel.js`)

// whether the tunnel app of a domain is connected
async function status(ctx) {
  const { domain } = ctx.state;
  let online = null;
  if (domain.has_tunnel) {
    const value = await ctx.client.get(`${tunnel.ONLINE_PREFIX}${domain.id}`);
    try {
      online = value ? JSON.parse(value) : null;
    } catch (err) {
      ctx.logger.fatal(err);
    }
  }

  ctx.body = {
    has_tunnel: Boolean(domain.has_tunnel),
    is_online: Boolean(online),
    connected_at: online?.connected_at,
    hostname: online?.hostname,
    version: online?.version,
    platform: online?.platform,
    has_imap: online?.imap === true,
    local: online?.local
  };
}

//
// Runs one IMAP command against the mail server behind the tunnel (remote
// mailbox access, which its owner turns on in the tunnel app). The mailbox
// username and password are those of the owner's own mail server: they are
// passed through to the app for this one command and never stored.
//
async function imap(ctx) {
  const { domain } = ctx.state;
  const { body } = ctx.request;

  if (!domain.has_tunnel)
    throw Boom.badRequest(ctx.translateError('TUNNEL_NOT_ENABLED'));

  // (as the tunnel itself, only for a domain whose DNS verifies it)
  if (!domain.has_txt_record)
    throw Boom.badRequest(ctx.translateError('TUNNEL_NOT_VERIFIED'));

  if (!isSANB(body.command) || body.command.length > 50)
    throw Boom.badRequest(ctx.translateError('TUNNEL_INVALID_COMMAND'));

  if (
    !isSANB(body.username) ||
    !isSANB(body.password) ||
    body.username.length > 320 ||
    body.password.length > 1024
  )
    throw Boom.badRequest(ctx.translateError('TUNNEL_INVALID_CREDENTIALS'));

  if (body.args !== undefined && !_.isPlainObject(body.args))
    throw Boom.badRequest(ctx.translateError('TUNNEL_INVALID_COMMAND'));

  let reply;
  try {
    reply = await tunnel.request(
      ctx.client,
      domain.id,
      {
        event: 'imap',
        domain: tunnel.getName(domain.name),
        command: body.command,
        args: body.args || {},
        // (never readable in Redis on its way to the process that holds
        // the app's connection, see `helpers/tunnel-websocket-handler.js`)
        auth: encrypt(
          JSON.stringify({ user: body.username, pass: body.password })
        )
      },
      { timeout: tunnel.IMAP_TIMEOUT }
    );
  } catch (err) {
    if (!err.isTunnel) throw err;
    if (err.code === 'TIMEOUT')
      throw Boom.gatewayTimeout(ctx.translateError('TUNNEL_TIMEOUT'));
    throw Boom.serverUnavailable(ctx.translateError('TUNNEL_OFFLINE'));
  }

  if (reply.error) {
    const message = String(reply.error.message || reply.error.code).slice(
      0,
      500
    );
    throw ['OFFLINE', 'BUSY', 'LOCAL_UNREACHABLE'].includes(reply.error.code)
      ? Boom.serverUnavailable(message)
      : reply.error.code === 'TIMEOUT'
      ? Boom.gatewayTimeout(message)
      : ['IMAP_DISABLED', 'NOT_ALLOWED', 'READ_ONLY'].includes(reply.error.code)
      ? Boom.forbidden(message)
      : Boom.badRequest(message);
  }

  ctx.body = reply.data ?? {};
}

module.exports = { status, imap };
