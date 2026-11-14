/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 */

import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';

import { ImapFlow } from 'imapflow';

import { IMAP_WRITE_COMMANDS } from './config.js';

class ImapError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

function requireString(args, key, max = 1000) {
  const value = args?.[key];
  if (typeof value !== 'string' || !value || value.length > max)
    throw new ImapError('INVALID', `"${key}" is required`);
  return value;
}

// A message range, e.g. "1:*", "5,7,9" or a single UID
function getRange(args) {
  const range = args?.range ?? args?.uid;
  if (Number.isInteger(range) && range > 0) return String(range);
  if (typeof range === 'string' && /^[\d:*,]{1,2000}$/.test(range))
    return range;
  throw new ImapError('INVALID', '"range" is required');
}

function getFlags(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (flag) => typeof flag === 'string' && /^[\\$\w.-]{1,100}$/.test(flag)
    )
    .slice(0, 50);
}

// Search criteria as imapflow takes them (dates arrive as strings)
function getSearchQuery(query) {
  if (query === undefined || query === null) return { all: true };
  if (typeof query !== 'object' || Array.isArray(query))
    throw new ImapError('INVALID', '"query" must be an object');
  const result = {};
  for (const [key, value] of Object.entries(query)) {
    if (
      ['since', 'before', 'on', 'sentSince', 'sentBefore', 'sentOn'].includes(
        key
      )
    ) {
      const date = new Date(value);
      if (Number.isNaN(date.getTime()))
        throw new ImapError('INVALID', `"${key}" must be a date`);
      result[key] = date;
    } else if (key === 'or' || key === 'not') {
      result[key] = Array.isArray(value)
        ? value.map((item) => getSearchQuery(item))
        : getSearchQuery(value);
    } else if (
      ['string', 'number', 'boolean'].includes(typeof value) ||
      (key === 'header' && value && typeof value === 'object')
    ) {
      result[key] = value;
    }
  }

  return result;
}

function toAddressList(list) {
  return Array.isArray(list)
    ? list.map(({ name, address }) => ({ name, address }))
    : undefined;
}

function toMessage(message) {
  const result = { uid: message.uid, seq: message.seq };
  if (message.flags) result.flags = [...message.flags];
  if (message.size !== undefined) result.size = message.size;
  if (message.internalDate)
    result.internal_date = new Date(message.internalDate).toISOString();
  if (message.bodyStructure) result.body_structure = message.bodyStructure;
  if (message.headers) result.headers = message.headers.toString('base64');
  if (message.envelope) {
    const { envelope } = message;
    result.envelope = {
      date: envelope.date ? new Date(envelope.date).toISOString() : undefined,
      subject: envelope.subject,
      message_id: envelope.messageId,
      in_reply_to: envelope.inReplyTo,
      from: toAddressList(envelope.from),
      sender: toAddressList(envelope.sender),
      reply_to: toAddressList(envelope.replyTo),
      to: toAddressList(envelope.to),
      cc: toAddressList(envelope.cc),
      bcc: toAddressList(envelope.bcc)
    };
  }

  return result;
}

async function withMailbox(client, path, readOnly, fn) {
  const lock = await client.getMailboxLock(path, { readOnly });
  try {
    return await fn();
  } finally {
    lock.release();
  }
}

const COMMANDS = {
  async list(client) {
    const folders = await client.list();
    return folders.map((folder) => ({
      path: folder.path,
      name: folder.name,
      delimiter: folder.delimiter,
      flags: [...(folder.flags || [])],
      special_use: folder.specialUse,
      subscribed: folder.subscribed
    }));
  },

  async status(client, args) {
    const status = await client.status(requireString(args, 'path'), {
      messages: true,
      unseen: true,
      recent: true,
      uidNext: true,
      uidValidity: true
    });
    return {
      path: status.path,
      messages: status.messages,
      unseen: status.unseen,
      recent: status.recent,
      uid_next: status.uidNext,
      uid_validity: String(status.uidValidity)
    };
  },

  async search(client, args) {
    const query = getSearchQuery(args.query);
    return withMailbox(client, requireString(args, 'path'), true, async () => {
      const uids = await client.search(query, { uid: true });
      return { uids: uids || [] };
    });
  },

  async fetch(client, args, options) {
    const range = getRange(args);
    const fields =
      args.fields && typeof args.fields === 'object' ? args.fields : {};
    const query = {
      uid: true,
      flags: fields.flags !== false,
      envelope: fields.envelope !== false,
      size: fields.size !== false,
      internalDate: fields.internal_date !== false,
      bodyStructure: fields.body_structure === true,
      headers: fields.headers === true
    };
    const limit = Math.min(
      Number.isInteger(args.limit) && args.limit > 0
        ? args.limit
        : options.maxMessages,
      options.maxMessages
    );
    return withMailbox(client, requireString(args, 'path'), true, async () => {
      const messages = [];
      let bytes = 0;
      let isTruncated = false;
      for await (const message of client.fetch(range, query, { uid: true })) {
        if (messages.length >= limit) {
          isTruncated = true;
          continue;
        }

        const item = toMessage(message);
        bytes += JSON.stringify(item).length;
        if (bytes > options.maxBytes) {
          isTruncated = true;
          continue;
        }

        messages.push(item);
      }

      return { messages, truncated: isTruncated };
    });
  },

  // A whole message, or one of its parts (e.g. "2" for an attachment)
  async download(client, args, options) {
    const range = getRange(args);
    const part = typeof args.part === 'string' ? args.part : undefined;
    return withMailbox(client, requireString(args, 'path'), true, async () => {
      const { meta, content } = await client.download(range, part, {
        uid: true,
        maxBytes: options.maxBytes
      });
      const chunks = [];
      let size = 0;
      for await (const chunk of content) {
        size += chunk.length;
        if (size > options.maxBytes)
          throw new ImapError(
            'TOO_LARGE',
            'Message is larger than imap.maxBytes'
          );
        chunks.push(chunk);
      }

      return {
        content: Buffer.concat(chunks).toString('base64'),
        content_type: meta?.contentType,
        filename: meta?.filename,
        size
      };
    });
  },

  async flags(client, args) {
    const range = getRange(args);
    return withMailbox(client, requireString(args, 'path'), false, async () => {
      const options = { uid: true };
      if (Array.isArray(args.set))
        await client.messageFlagsSet(range, getFlags(args.set), options);
      if (Array.isArray(args.add) && args.add.length > 0)
        await client.messageFlagsAdd(range, getFlags(args.add), options);
      if (Array.isArray(args.remove) && args.remove.length > 0)
        await client.messageFlagsRemove(range, getFlags(args.remove), options);
      return { ok: true };
    });
  },

  async move(client, args) {
    const range = getRange(args);
    const destination = requireString(args, 'destination');
    return withMailbox(client, requireString(args, 'path'), false, async () => {
      const result = await client.messageMove(range, destination, {
        uid: true
      });
      return { ok: Boolean(result), destination };
    });
  },

  async copy(client, args) {
    const range = getRange(args);
    const destination = requireString(args, 'destination');
    return withMailbox(client, requireString(args, 'path'), false, async () => {
      const result = await client.messageCopy(range, destination, {
        uid: true
      });
      return { ok: Boolean(result), destination };
    });
  },

  async delete(client, args) {
    const range = getRange(args);
    return withMailbox(client, requireString(args, 'path'), false, async () => {
      const ok = await client.messageDelete(range, { uid: true });
      return { ok: Boolean(ok) };
    });
  },

  async append(client, args, options) {
    const content = Buffer.from(
      requireString(args, 'content', Number.POSITIVE_INFINITY),
      'base64'
    );
    if (content.length === 0 || content.length > options.maxBytes)
      throw new ImapError('TOO_LARGE', 'Message is larger than imap.maxBytes');
    const date = args.date ? new Date(args.date) : undefined;
    const result = await client.append(
      requireString(args, 'path'),
      content,
      getFlags(args.flags),
      date && !Number.isNaN(date.getTime()) ? date : undefined
    );
    return { ok: Boolean(result), uid: result?.uid };
  },

  async mailboxCreate(client, args) {
    const result = await client.mailboxCreate(requireString(args, 'path'));
    return { path: result.path, created: result.created };
  },

  async mailboxRename(client, args) {
    const result = await client.mailboxRename(
      requireString(args, 'path'),
      requireString(args, 'new_path')
    );
    return { path: result.path, new_path: result.newPath };
  },

  async mailboxDelete(client, args) {
    const result = await client.mailboxDelete(requireString(args, 'path'));
    return { path: result.path };
  }
};

//
// Runs IMAP commands against the local IMAP server (and only that server:
// its host and port come from the app's settings, never from a request).
// The mailbox's own username and password arrive with each request and are
// kept in memory only for as long as its connection is reused.
//
export function createImap(config, logger) {
  // Digest of the credentials => { client, timer, queue }
  const connections = new Map();

  function drop(key) {
    const entry = connections.get(key);
    if (!entry) return;
    connections.delete(key);
    clearTimeout(entry.timer);
    entry.client.logout().catch(() => entry.client.close());
  }

  async function getConnection(auth) {
    const key = createHash('sha256')
      .update(`${auth.user}\0${auth.pass}`)
      .digest('hex');
    let entry = connections.get(key);
    // (still connecting for an earlier request)
    if (entry?.connecting) return entry.connecting;
    if (entry && entry.client.usable) return entry;
    if (entry) drop(key);

    if (connections.size >= config.imap.maxConnections) {
      // (the one that has waited longest for its next command)
      drop(connections.keys().next().value);
    }

    const client = new ImapFlow({
      host: config.imap.host,
      port: config.imap.port,
      secure: config.imap.secure,
      auth: { user: auth.user, pass: auth.pass },
      tls: { rejectUnauthorized: Boolean(config.imap.rejectUnauthorized) },
      logger: false,
      disableAutoIdle: true,
      connectionTimeout: config.local.connectTimeout,
      greetingTimeout: config.local.greetingTimeout
    });
    client.on('error', (error) => {
      logger.debug('IMAP connection error', { message: error.message });
      if (connections.get(key)?.client === client) drop(key);
    });
    client.on('close', () => {
      if (connections.get(key)?.client === client) connections.delete(key);
    });
    entry = { client, timer: null, queue: Promise.resolve() };
    entry.connecting = client.connect().then(
      () => {
        entry.connecting = null;
        return entry;
      },
      (error) => {
        if (connections.get(key) === entry) connections.delete(key);
        throw error;
      }
    );
    connections.set(key, entry);
    return entry.connecting;
  }

  async function run(request) {
    const { command, args = {}, auth } = request;

    if (!config.imap.enabled)
      return {
        error: {
          code: 'IMAP_DISABLED',
          message:
            'Remote mailbox access is turned off in this app (imap.enabled)'
        }
      };
    if (
      typeof command !== 'string' ||
      !Object.hasOwn(COMMANDS, command) ||
      !config.imap.allowedCommands.includes(command)
    )
      return {
        error: { code: 'NOT_ALLOWED', message: 'Command is not allowed' }
      };
    if (config.imap.readOnly && IMAP_WRITE_COMMANDS.includes(command))
      return {
        error: { code: 'READ_ONLY', message: 'Mailbox access is read-only' }
      };
    if (
      !auth ||
      typeof auth.user !== 'string' ||
      typeof auth.pass !== 'string' ||
      !auth.user ||
      !auth.pass ||
      auth.user.length > 320 ||
      auth.pass.length > 1024
    )
      return {
        error: {
          code: 'AUTH',
          message: 'Mailbox username and password are required'
        }
      };
    if (!args || typeof args !== 'object' || Array.isArray(args))
      return {
        error: { code: 'INVALID', message: '"args" must be an object' }
      };

    let entry;
    try {
      entry = await getConnection(auth);
    } catch (error) {
      const isAuth = error.authenticationFailed === true;
      return {
        error: {
          code: isAuth ? 'AUTH' : 'LOCAL_UNREACHABLE',
          message: isAuth
            ? 'Mailbox username or password was refused'
            : `IMAP server is not reachable: ${String(error.message).slice(
                0,
                300
              )}`
        }
      };
    }

    clearTimeout(entry.timer);
    // (one command at a time on a connection)
    const result = entry.queue.then(async () => {
      let timer;
      try {
        const data = await Promise.race([
          COMMANDS[command](entry.client, args, config.imap),
          new Promise((resolve, reject) => {
            timer = setTimeout(
              () => reject(new ImapError('TIMEOUT', 'IMAP command timed out')),
              config.imap.commandTimeout
            );
          })
        ]);
        return { data };
      } catch (error) {
        // (a timed out connection is in an unknown state)
        if (error.code === 'TIMEOUT') entry.client.close();
        return {
          error: {
            code: error instanceof ImapError ? error.code : 'IMAP_ERROR',
            message: String(error.responseText || error.message || error).slice(
              0,
              500
            )
          }
        };
      } finally {
        clearTimeout(timer);
      }
    });
    entry.queue = result.then(() => {
      clearTimeout(entry.timer);
      entry.timer = setTimeout(() => {
        for (const [key, value] of connections) if (value === entry) drop(key);
      }, config.imap.idleTimeout);
      entry.timer.unref?.();
    });
    return result;
  }

  function close() {
    for (const key of connections.keys()) drop(key);
  }

  return { run, close };
}
