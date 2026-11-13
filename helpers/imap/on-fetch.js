/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * This file incorporates work covered by the following copyright and
 * permission notice:
 *
 *   WildDuck Mail Agent is licensed under the European Union Public License 1.2 or later.
 *   https://github.com/nodemailer/wildduck
 */

const getStream = require('get-stream');
const tools = require('@zone-eu/wildduck/lib/tools');
const {
  IMAPConnection
} = require('@zone-eu/wildduck/imap-core/lib/imap-connection');
const { imapHandler } = require('@zone-eu/wildduck/imap-core');
const { Builder } = require('#helpers/json-sql');
const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const getImapFlags = require('#helpers/get-imap-flags');
const Messages = require('#models/messages');
const {
  isOverBandwidth,
  recordBandwidth
} = require('#helpers/bandwidth-limiter');
const getQueryResponse = require('#helpers/get-query-response');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const sendApn = require('#helpers/send-apn');
const sendNotification = require('#helpers/send-notification');
const config = require('#config');
const {
  prepareQuery,
  syncConvertResult
} = require('#helpers/mongoose-to-sqlite');

// const LIMITED_PROJECTION_KEYS = new Set(['_id', 'flags', 'modseq', 'uid']);
// const MAX_BULK_WRITE_SIZE = 1000;

const builder = new Builder({ bufferAsNative: true });

const { formatResponse } = IMAPConnection.prototype;

async function renewConcurrentConnectionTTL(session) {
  const id = session?.user?.alias_id || session?.user?.domain_id;
  if (!id) return;

  try {
    await this.client.pexpire(
      `concurrent_imap_${config.env}:${id}`,
      config.socketTimeout
    );
  } catch (err) {
    // The limiter is a safeguard; a Redis outage must not prevent retrieval of
    // a mailbox that was already authenticated successfully.
    this.logger.fatal(err, { session, resolver: this.resolver });
  }
}

//
// Byte-based flush threshold for batch mode (10 MB).
// When accumulated compiled payloads exceed this threshold, they are
// flushed via wss.broadcast() which provides backpressure through UUID ACK.
// Set to 10 MB to limit peak memory per FETCH while still batching enough
// to amortize the round-trip overhead of each broadcast ACK.
//
const FLUSH_BYTES = 10 * 1024 * 1024; // 10 MB

async function onFetch(mailboxId, options, session, fn) {
  this.logger.debug('FETCH', { mailboxId, options, session });

  // Keep the connection counted while it is actively serving mailbox data.
  await renewConcurrentConnectionTTL.call(this, session);

  // downloads stop once the account's bandwidth limit is used up
  // (NO [LIMIT], RFC 5530)
  if (
    await isOverBandwidth(this.client, {
      userId: session?.user?.alias_user_id,
      service: 'imap_download'
    })
  )
    return fn(null, 'LIMIT');

  if (this.wsp) {
    try {
      const [bool, response, compiledPayloads, entries] =
        await this.wsp.request({
          action: 'fetch',
          session: {
            id: session.id,
            user: session.user,
            remoteAddress: session.remoteAddress,
            selected: session.selected,
            acceptUTF8Enabled: session.isUTF8Enabled()
          },
          mailboxId,
          options
        });

      if (Array.isArray(compiledPayloads)) {
        for (const compiled of compiledPayloads) {
          session.writeStream.write(compiled);
        }
      }

      fn(null, bool, response);

      if (Array.isArray(entries) && entries.length > 0) {
        this.server.notifier
          .addEntries(this, session, mailboxId, entries)
          .then(() => this.server.notifier.fire(session.user.alias_id))
          .catch((err) =>
            this.logger.fatal(err, { session, resolver: this.resolver })
          );

        // the SQLite server sends the realtime notification (WebSocket and push)
      }
    } catch (err) {
      if (err.imapResponse) return fn(null, err.imapResponse);
      fn(err);
    }

    return;
  }

  // (what was sent to the client before the command ended, see the flushes)
  let sentBytes = 0;

  try {
    const compiledPayloads = [];
    const entries = [];
    const ops = [];

    let rowCount = 0;
    let totalBytes = 0;

    await this.refreshSession(session, 'FETCH');

    const mailbox = await Mailboxes.findOne(this, session, {
      _id: mailboxId
    });

    if (!mailbox)
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', session.user.locale),
        {
          imapResponse: 'NONEXISTENT'
        }
      );

    const projection = {
      _id: true,
      uid: true,
      modseq: true,
      thread: true
    };

    if (options.flagsExist) {
      projection.flags = true;
      // Custom labels are exposed to IMAP clients as keywords alongside flags.
      // Without this, FETCH responses never include user-defined labels and
      // cross-device label visibility breaks for native IMAP clients.
      projection.labels = true;
    }

    if (options.idateExist) projection.idate = true;
    if (options.bodystructureExist) projection.bodystructure = true;
    if (options.rfc822sizeExist) projection.size = true;
    if (options.envelopeExist) projection.envelope = true;
    // (the size bounds how much of a message one response may hold, see
    //  `MAX_CONTENT_EXTRA` in helpers/get-query-response)
    if (!options.metadataOnly) {
      projection.mimeTree = true;
      projection.size = true;
    }

    const query = {
      mailbox: mailbox._id
    };

    if (options.changedSince)
      query.modseq = {
        $gt: options.changedSince
      };

    const pageQuery = { ...query };

    //
    // NOTE: if the uid is not in the selected list then we can assume client is requesting invalid data
    //       (e.g. `options.messages = [ 50 ]` when `50` doesn't exist, e.g. after COPY in Thunderbird)
    //

    let queryAll = false;

    // return early if no messages requested
    if (options.messages.length === 0) {
      fn(null, true, { rowCount, totalBytes }, compiledPayloads, entries);
      return;
    }

    if (
      !options.isUid &&
      options.messages.length === session.selected.uidList.length
    ) {
      // 1:*
      queryAll = true;
    } else {
      // do not use uid selector for 1:*
      pageQuery.uid = tools.checkRangeQuery(options.messages, false);
    }

    // converts objectids -> strings and arrays/json appropriately
    const condition = prepareQuery(Messages.mapping, pageQuery);

    // TODO: `condition` may need further refined for accuracy (e.g. see `prepareQuery`)
    const fields = [];
    for (const key of Object.keys(projection)) {
      if (projection[key] === true) fields.push(key);
    }

    // const count = await Messages.countDocuments(this, session, condition);

    //
    // Single-message fast path: use stmt.get() instead of stmt.iterate()
    // to avoid iterator allocation overhead. This is the most common FETCH
    // pattern (user opens a single message in their mail client).
    //
    const isSingleMessage = Boolean(condition?.uid?.$eq);

    //
    // Batch mode: flush accumulated compiledPayloads via wss.broadcast()
    // when they exceed FLUSH_BYTES (10 MB). This prevents unbounded memory
    // growth when fetching very large mailboxes. The broadcast is awaited
    // to provide backpressure and prevent unbounded in-flight buffers.
    //
    const isBatchMode = !isSingleMessage;
    let pendingBytes = 0;

    // convert uidList to Set for O(1) lookups instead of O(n) Array.includes
    const uidSet = queryAll ? new Set(session.selected.uidList) : null;

    //
    // processMessage handles a single row from the query result.
    // Extracted to avoid duplicating logic between .get() and .iterate() paths.
    //
    const processMessage = async (result) => {
      const message = syncConvertResult(Messages, result, projection);

      // don't process messages that are new since query started
      // <https://github.com/nodemailer/wildduck/issues/708>
      if (queryAll && !uidSet.has(message.uid)) {
        return;
      }

      const markAsSeen =
        options.markAsSeen &&
        message.flags &&
        !message.flags.includes('\\Seen');
      if (markAsSeen) message.flags.unshift('\\Seen');

      // write the response early since we don't need to perform db operation
      if (options.metadataOnly && !markAsSeen) {
        const values = await Promise.all(
          getQueryResponse(
            options.query,
            message,
            {
              logger: this.logger,
              fetchOptions: {},
              // database
              attachmentStorage: this.attachmentStorage,
              acceptUTF8Enabled:
                typeof session.isUTF8Enabled === 'function'
                  ? session.isUTF8Enabled()
                  : session.acceptUTF8Enabled || false
            },
            this,
            session
          )
        );

        const data = formatResponse.call(session, 'FETCH', message.uid, {
          query: options.query,
          values
        });

        const compiled = imapHandler.compiler(data);

        // `compiled` is a 'binary' string
        totalBytes += compiled.length;
        rowCount++;

        compiledPayloads.push({ compiled });
        pendingBytes += compiled.length;

        // flush compiled payloads when accumulated bytes exceed threshold
        if (isBatchMode && pendingBytes >= FLUSH_BYTES) {
          await this.wss.broadcast(session, compiledPayloads);
          compiledPayloads.length = 0;
          sentBytes += pendingBytes;
          pendingBytes = 0;
        }

        //
        // NOTE: we may need to pass indexer options here as similar to wildduck (through the use of `eachAsync`)
        // <https://mongoosejs.com/docs/api/querycursor.html#QueryCursor.prototype.eachAsync()>
        // (e.g. so we can do `await Promise.resolve((resolve) => setImmediate(resolve));`)
        //

        return;
      }

      //
      // NOTE: wildduck uses streams and a TTL limiter/counter however we can
      // simplify this for now just by writing to the socket writable stream
      //

      const values = await Promise.all(
        getQueryResponse(
          options.query,
          message,
          {
            logger: this.logger,
            fetchOptions: {},
            // database
            attachmentStorage: this.attachmentStorage,
            acceptUTF8Enabled:
              typeof session.isUTF8Enabled === 'function'
                ? session.isUTF8Enabled()
                : session.acceptUTF8Enabled || false
          },
          this,
          session
        )
      );

      const data = formatResponse.call(session, 'FETCH', message.uid, {
        query: options.query,
        values
      });

      // <https://github.com/nodemailer/wildduck/issues/563#issuecomment-1826943401>
      const stream = imapHandler.compileStream(data);

      const compiled = await getStream(stream, {
        encoding: 'binary'
      });
      totalBytes += compiled.length;

      compiledPayloads.push({ compiled });
      pendingBytes += compiled.length;

      // flush compiled payloads when accumulated bytes exceed threshold
      if (isBatchMode && pendingBytes >= FLUSH_BYTES) {
        await this.wss.broadcast(session, compiledPayloads);
        compiledPayloads.length = 0;
        sentBytes += pendingBytes;
        pendingBytes = 0;
      }

      rowCount++;

      if (markAsSeen) {
        // (written once the response is sent, see below)
        const entry = {
          ignore: session.id,
          command: 'FETCH',
          uid: message.uid,
          message: message._id,
          thread: message.thread,
          // unseenChange is true when marking as seen via FETCH
          unseenChange: true
        };
        ops.push({ id: message._id.toString(), entry });
        entries.push(entry);
      }
    };

    if (isSingleMessage) {
      // Fast path: single row lookup via .get() avoids iterator overhead
      const sql = builder.build({
        type: 'select',
        table: 'Messages',
        condition,
        fields
      });
      const result = session.db.prepare(sql.query).get(sql.values);
      if (result) {
        await processMessage(result);
      }
    } else {
      //
      // Multi-message path: read the rows a page at a time in uid order
      //
      // NOTE: an iterator must not stay open across the awaits below (e.g.
      //       the byte-based flush, which waits on the IMAP server): while
      //       one is open this handle refuses every write, so a large FETCH
      //       made deliveries, STORE and EXPUNGE for the alias fail and retry
      //       until it finished (and kept WAL checkpoints from completing)
      //
      // (a list of uids, e.g. `1:*` on a mailbox with an expunged message,
      // is paged through as the list itself: repeating the whole list in
      // every page made each page cost as much as the whole FETCH)
      const pageSize = projection.mimeTree ? 25 : 250;
      const uids = Array.isArray(condition?.uid?.$in)
        ? [...condition.uid.$in].sort((a, b) => a - b)
        : null;
      let lastUid = 0;
      for (let i = 0; ; i += pageSize) {
        const page = builder.build({
          type: 'select',
          table: 'Messages',
          condition: uids
            ? { ...condition, uid: { $in: uids.slice(i, i + pageSize) } }
            : { $and: [condition, { uid: { $gt: lastUid } }] },
          fields,
          sort: 'uid',
          limit: pageSize
        });
        const rows = session.db.prepare(page.query).all(page.values);
        for (const result of rows) {
          await processMessage(result);
        }

        if (uids) {
          if (i + pageSize >= uids.length) break;
        } else if (rows.length < pageSize) {
          break;
        } else {
          lastUid = rows.at(-1).uid;
        }
      }
    }

    // Record bandwidth usage (non-blocking)
    if (totalBytes > 0)
      recordBandwidth(this.client, {
        userId: session.user.alias_user_id,
        service: 'imap_download',
        bytes: totalBytes
      });
    // (all of it is counted now, should what follows end in an error)
    sentBytes = 0;

    //
    // mark the messages as seen
    //
    // NOTE: other requests can change the mailbox while the response is
    //       sent, so the flags and modifyIndex are read again here: a flag
    //       set meanwhile is kept, and the new modseq is above theirs
    //
    if (ops.length > 0) {
      const expunged = new Set();
      session.db
        .transaction(() => {
          const mbSelect = builder.build({
            type: 'select',
            table: 'Mailboxes',
            fields: ['modifyIndex'],
            condition: { _id: mailbox._id.toString() }
          });
          const modifyIndex = session.db
            .prepare(mbSelect.query)
            .pluck()
            .get(mbSelect.values);
          // (the mailbox was deleted meanwhile)
          if (typeof modifyIndex !== 'number') {
            for (const { entry } of ops) expunged.add(entry);
            return;
          }

          // RFC 7162: Any flag change MUST update the message's mod-sequence
          // so CONDSTORE clients can detect the implicit \Seen change.
          const modseq = modifyIndex + 1;

          for (const { id, entry } of ops) {
            const select = builder.build({
              type: 'select',
              table: 'Messages',
              fields: ['flags', 'labels'],
              // (a message moved or expunged meanwhile is left as it is)
              condition: { _id: id, mailbox: mailbox._id.toString() }
            });
            const row = session.db.prepare(select.query).get(select.values);
            if (!row) {
              expunged.add(entry);
              continue;
            }

            const message = syncConvertResult(Messages, row, {
              flags: true,
              labels: true
            });
            if (!message.flags.includes('\\Seen'))
              message.flags.unshift('\\Seen');
            const update = builder.build({
              type: 'update',
              table: 'Messages',
              condition: { _id: id, mailbox: mailbox._id.toString() },
              modifier: {
                $set: prepareQuery(Messages.mapping, {
                  flags: message.flags,
                  unseen: false,
                  modseq
                })
              }
            });
            session.db.prepare(update.query).run(update.values);
            // with the labels, as every FETCH shows them
            entry.flags = getImapFlags(message);
            entry.modseq = modseq;
          }

          const mbUpdate = builder.build({
            type: 'update',
            table: 'Mailboxes',
            condition: { _id: mailbox._id.toString() },
            modifier: { $set: { modifyIndex: modseq } }
          });
          session.db.prepare(mbUpdate.query).run(mbUpdate.values);
        })
        .immediate();

      if (expunged.size > 0) {
        const kept = entries.filter((entry) => !expunged.has(entry));
        entries.length = 0;
        entries.push(...kept);
      }
    }

    fn(
      null,
      true,
      {
        rowCount,
        totalBytes
      },
      compiledPayloads,
      entries
    );

    // send websocket push notification (implicit \Seen flag change)
    if (entries.length > 0) {
      sendNotification.inChunks(
        this.client,
        session.user.alias_id,
        'flagsUpdated',
        {
          mailbox: mailboxId.toString(),
          path: mailbox.path,
          action: 'add',
          flags: ['\\Seen'],
          uids: entries.map((e) => e.uid)
        },
        ['uids']
      );

      // send apple push notification (unread count changed)
      sendApn(this.client, session.user.alias_id, mailbox.path)
        .then()
        .catch((err) =>
          this.logger.fatal(err, { session, resolver: this.resolver })
        );
    }
  } catch (err) {
    // a FETCH that ends in an error has sent what it flushed before it,
    // which counts as downloaded too (it was only counted on success, so
    // one that failed at its last message was free)
    if (sentBytes > 0)
      recordBandwidth(this.client, {
        userId: session.user.alias_user_id,
        service: 'imap_download',
        bytes: sentBytes
      });

    fn(refineAndLogError(err, session, true, this));
  }
}

module.exports = onFetch;
