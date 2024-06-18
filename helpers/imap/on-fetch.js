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

const _ = require('lodash');
const getStream = require('get-stream');
const mongoose = require('mongoose');
const tools = require('wildduck/lib/tools');
const { Builder } = require('json-sql');
const { IMAPConnection } = require('wildduck/imap-core/lib/imap-connection');
const { imapHandler } = require('wildduck/imap-core');

const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const SocketError = require('#helpers/socket-error');
const getQueryResponse = require('#helpers/get-query-response');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const { convertResult } = require('#helpers/mongoose-to-sqlite');

// const LIMITED_PROJECTION_KEYS = new Set(['_id', 'flags', 'modseq', 'uid']);
const MAX_BULK_WRITE_SIZE = 150;

const builder = new Builder();

const { formatResponse } = IMAPConnection.prototype;

// eslint-disable-next-line complexity
async function getMessages(instance, session, server, opts = {}) {
  const { options, projection, query, mailbox, attachmentStorage } = opts;

  server.logger.debug('getting messages', opts);

  // safeguard
  if (!_.isObject(query) || _.isEmpty(query))
    throw new Error('Query cannot be empty');

  // safeguard for mailbox
  if (!query?.mailbox || !mongoose.isObjectIdOrHexString(query.mailbox))
    throw new Error('Mailbox missing from query');

  if (!_.isObject(attachmentStorage))
    throw new Error('Attachment storage missing');

  let {
    entries,
    bulkWrite,
    writeStream,
    successful,
    lastUid,
    rowCount,
    totalBytes
  } = opts;

  //
  // extra safeguards for development
  //
  if (!Array.isArray(entries)) throw new Error('Entries is not an array');

  if (!Array.isArray(bulkWrite)) throw new Error('Bulk write is not an array');

  if (!Array.isArray(writeStream))
    throw new Error('Write stream is not an array');

  if (typeof successful !== 'boolean')
    throw new Error('Successful is not a boolean');

  if (typeof lastUid !== 'number' && lastUid !== null)
    throw new Error('Last uid must be a number or null');

  if (typeof rowCount !== 'number' || rowCount < 0)
    throw new Error('Row count must be a number >= 0');

  if (typeof totalBytes !== 'number' || totalBytes < 0)
    throw new Error('Total bytes must be a number >= 0');

  let queryAll;

  const pageQuery = { ...query };

  // `1:*`
  // <https://github.com/nodemailer/wildduck/pull/559>
  // if (_.isEqual(options.messages.sort(), session.selected.uidList.sort()))
  if (options.messages.length === session.selected.uidList.length)
    queryAll = true;
  // NOTE: don't use uid for `1:*`
  else pageQuery.uid = tools.checkRangeQuery(options.messages, false);

  if (lastUid) {
    if (pageQuery.uid)
      pageQuery.$and = [
        {
          uid: pageQuery.uid
        },
        { uid: { $gt: lastUid } }
      ];
    else pageQuery.uid = { $gt: lastUid };
  }

  // converts objectids -> strings and arrays/json appropriately
  const condition = JSON.parse(JSON.stringify(pageQuery));

  // TODO: `condition` may need further refined for accuracy (e.g. see `prepareQuery`)

  const fields = [];
  for (const key of Object.keys(projection)) {
    if (projection[key] === true) fields.push(key);
  }

  const sql = builder.build({
    type: 'select',
    table: 'Messages',
    condition,
    fields,
    // sort required for IMAP UIDPLUS
    sort: 'uid'
    // no limits right now:
    // limit: MAX_PAGE_SIZE
  });

  //
  // NOTE: use larger batch size if the query was limited in its projection
  //
  // max batch size in mongoose is 5000
  // <https://github.com/Automattic/mongoose/blob/1f6449576aac47dcb43f9974bb187a4f13d413d3/lib/cursor/QueryCursor.js#L78C1-L83>
  //
  // the default in mongodb for find query is 101
  // <https://www.mongodb.com/docs/manual/tutorial/iterate-a-cursor/#cursor-batches>
  //
  // const batchSize: !Object.keys(projection).some(
  //   (key) => !LIMITED_PROJECTION_KEYS.has(key)
  // )
  //   ? 1000
  //   : 101

  //
  // TODO: we may want to use `.all()` instead of `.all()`
  // with the `batchSize` value at a time (for better performance)
  //
  let messages;

  if (session.db.wsp) {
    messages = await instance.wsp.request({
      action: 'stmt',
      session: { user: session.user },
      stmt: [
        ['prepare', sql.query],
        ['all', sql.values]
      ]
    });
  } else {
    // <https://github.com/m4heshd/better-sqlite3-multiple-ciphers/blob/master/docs/api.md#iteratebindparameters---iterator>
    // messages = db.prepare(sql.query).iterate(sql.values);
    messages = session.db.prepare(sql.query).all(sql.values);
  }

  for (const result of messages) {
    // eslint-disable-next-line no-await-in-loop
    const message = await convertResult(Messages, result, projection);

    server.logger.debug('fetched message', {
      result,
      message,
      session,
      options,
      query,
      pageQuery
    });

    // check if server is in the process of shutting down
    if (server._closeTimeout) throw new ServerShutdownError();

    // TODO: we should use web socket request to check against IMAP server if it's still open
    // check if socket is still connected
    if (instance?.constructor?.name === 'IMAP') {
      const socket =
        (session.socket && session.socket._parent) || session.socket;
      if (!socket || socket?.destroyed || socket?.readyState !== 'open')
        throw new SocketError();
    } else {
      // TODO: finish this for SQLite server to check websocket if still open
    }

    // store reference to last message uid
    lastUid = message.uid;

    // don't process messages that are new since query started
    if (
      queryAll &&
      typeof session?.selected?.uidList === 'object' &&
      Array.isArray(session.selected.uidList) &&
      !session.selected.uidList.includes(message.uid)
    ) {
      continue;
    }

    const markAsSeen =
      options.markAsSeen && message.flags && !message.flags.includes('\\Seen');
    if (markAsSeen) message.flags.unshift('\\Seen');

    // write the response early since we don't need to perform db operation
    if (options.metadataOnly && !markAsSeen) {
      // eslint-disable-next-line no-await-in-loop
      const values = await Promise.all(
        getQueryResponse(
          options.query,
          message,
          {
            logger: server.logger,
            fetchOptions: {},
            // database
            attachmentStorage,
            acceptUTF8Enabled:
              typeof session.isUTF8Enabled === 'function'
                ? session.isUTF8Enabled()
                : session.acceptUTF8Enabled || false
          },
          instance,
          session
        ).map((obj) => {
          if (
            typeof obj !== 'object' ||
            obj.type !== 'stream' ||
            typeof obj.value !== 'object'
          )
            return obj;
          return getStream(obj.value);
        })
      );

      const data = formatResponse.call(session, 'FETCH', message.uid, {
        query: options.query,
        values
      });

      // <https://github.com/nodemailer/wildduck/issues/563#issuecomment-1826943401>
      const stream = imapHandler.compileStream(data);
      // eslint-disable-next-line no-await-in-loop
      const buffer = await getStream.buffer(stream);
      const compiled = buffer.toString('binary');
      totalBytes += compiled.length;
      if (instance?.constructor?.name === 'IMAP') {
        session.writeStream.write({ compiled });
      } else {
        writeStream.push({ compiled });
      }

      /*
      const compiled = imapHandler.compiler(data);
      // `compiled` is a 'binary' string
      totalBytes += compiled.length;
      if (instance?.constructor?.name === 'IMAP') {
        session.writeStream.write({ compiled });
      } else {
        writeStream.push({ compiled });
      }
      */

      rowCount++;

      //
      // NOTE: we may need to pass indexer options here as similar to wildduck (through the use of `eachAsync`)
      // <https://mongoosejs.com/docs/api/querycursor.html#QueryCursor.prototype.eachAsync()>
      // (e.g. so we can do `await Promise.resolve((resolve) => setImmediate(resolve));`)
      //

      // move along to next cursor
      continue;
    }

    //
    // NOTE: wildduck uses streams and a TTL limiter/counter however we can
    // simplify this for now just by writing to the socket writable stream
    //

    // eslint-disable-next-line no-await-in-loop
    const values = await Promise.all(
      getQueryResponse(
        options.query,
        message,
        {
          logger: server.logger,
          fetchOptions: {},
          // database
          attachmentStorage,
          acceptUTF8Enabled:
            typeof session.isUTF8Enabled === 'function'
              ? session.isUTF8Enabled()
              : session.acceptUTF8Enabled || false
        },
        instance,
        session
      ).map((obj) => {
        if (
          typeof obj !== 'object' ||
          obj.type !== 'stream' ||
          typeof obj.value !== 'object'
        )
          return obj;
        return getStream(obj.value);
      })
    );

    const data = formatResponse.call(session, 'FETCH', message.uid, {
      query: options.query,
      values
    });

    // <https://github.com/nodemailer/wildduck/issues/563#issuecomment-1826943401>
    const stream = imapHandler.compileStream(data);
    // eslint-disable-next-line no-await-in-loop
    const buffer = await getStream.buffer(stream);
    const compiled = buffer.toString('binary');
    totalBytes += compiled.length;
    if (instance?.constructor?.name === 'IMAP') {
      session.writeStream.write({ compiled });
    } else {
      writeStream.push({ compiled });
    }

    /*
    const compiled = imapHandler.compiler(data);
    // `compiled` is a 'binary' string
    totalBytes += compiled.length;
    if (instance?.constructor?.name === 'IMAP') {
      session.writeStream.write({ compiled });
    } else {
      writeStream.push({ compiled });
    }
    */

    rowCount++;

    // add operation to bulkWrite
    if (markAsSeen) {
      bulkWrite.push({
        updateOne: {
          filter: {
            _id: message._id,
            mailbox: mailbox._id,
            uid: message.uid
          },
          update: {
            $addToSet: {
              flags: '\\Seen'
            },
            $set: {
              unseen: false
            }
          }
        }
      });
      const entry = {
        ignore: session.id,
        command: 'FETCH',
        uid: message.uid,
        flags: message.flags,
        message: message._id
      };
      entries.push(entry);
    }

    if (bulkWrite.length >= MAX_BULK_WRITE_SIZE) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await Messages.bulkWrite(instance, session, bulkWrite, {
          // ordered: false,
          // w: 1
        });
        bulkWrite = [];
        if (entries.length >= MAX_BULK_WRITE_SIZE) {
          try {
            // eslint-disable-next-line no-await-in-loop
            await server.notifier.addEntries(
              instance,
              session,
              mailbox,
              entries
            );
            entries = [];
            server.notifier.fire(session.user.alias_id);
          } catch (err) {
            server.logger.fatal(err, { message, session, options, query });
          }
        }
      } catch (err) {
        bulkWrite = [];
        entries = [];
        server.logger.fatal(err, { message, session, options, query });

        successful = false;
        break;
      }
    }
  }

  return {
    entries,
    bulkWrite,
    writeStream,
    successful,
    lastUid,
    rowCount,
    totalBytes
  };
}

async function onFetch(mailboxId, options, session, fn) {
  this.logger.debug('FETCH', { mailboxId, options, session });

  try {
    if (this?.constructor?.name === 'IMAP') {
      try {
        const [bool, response, writeStream] = await this.wsp.request({
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

        if (Array.isArray(writeStream)) {
          for (const write of writeStream) {
            if (Array.isArray(write)) {
              session.writeStream.write(session.formatResponse(...write));
            } else {
              session.writeStream.write(write);
            }
          }
        }

        fn(null, bool, response);
      } catch (err) {
        fn(err);
      }

      return;
    }

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
      modseq: true
    };

    if (options.flagsExist) projection.flags = true;
    if (options.idateExist) projection.idate = true;
    if (options.bodystructureExist) projection.bodystructure = true;
    if (options.rfc822sizeExist) projection.size = true;
    if (options.envelopeExist) projection.envelope = true;
    if (!options.metadataOnly) projection.mimeTree = true;

    const query = {
      mailbox: mailbox._id
    };

    if (options.changedSince)
      query.modseq = {
        $gt: options.changedSince
      };

    const results = await getMessages(this, session, this.server, {
      options,
      projection,
      query,
      mailbox,
      attachmentStorage: this.attachmentStorage,
      entries: [],
      bulkWrite: [],
      writeStream: [],
      successful: true,
      lastUid: null,
      rowCount: 0,
      totalBytes: 0
    });

    //
    // NOTE: if bulkWrite > 0 then entries is also > 0
    //
    // (this is a safeguard just in case)
    //
    if (results.bulkWrite.length !== results.entries.length)
      this.logger.fatal(
        new TypeError('Bulk write length and entries not equal')
      );

    try {
      // mark messages as Seen
      if (results.bulkWrite.length > 0) {
        await Messages.bulkWrite(this, session, results.bulkWrite, {
          // ordered: false,
          // w: 1
        });
      }

      if (results.entries.length > 0) {
        await this.server.notifier.addEntries(
          this,
          session,
          mailbox,
          results.entries
        );
        this.server.notifier.fire(session.user.alias_id);
      }
    } catch (err) {
      this.logger.fatal(err, { mailboxId, options, session });
    }

    fn(
      null,
      results.successful,
      {
        rowCount: results.rowCount,
        totalBytes: results.totalBytes
      },
      results.writeStream
    );
  } catch (err) {
    // NOTE: wildduck uses `imapResponse` so we are keeping it consistent
    if (err.imapResponse) {
      this.logger.error(err, { mailboxId, options, session });
      return fn(null, err.imapResponse);
    }

    fn(refineAndLogError(err, session, true));
  }
}

module.exports = onFetch;
