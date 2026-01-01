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
const tools = require('@forwardemail/wildduck/lib/tools');
const { Builder } = require('json-sql-enhanced');
const {
  IMAPConnection
} = require('@forwardemail/wildduck/imap-core/lib/imap-connection');
const { imapHandler } = require('@forwardemail/wildduck/imap-core');
const _ = require('#helpers/lodash');

const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const getQueryResponse = require('#helpers/get-query-response');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const { syncConvertResult } = require('#helpers/mongoose-to-sqlite');

// const LIMITED_PROJECTION_KEYS = new Set(['_id', 'flags', 'modseq', 'uid']);
// const MAX_BULK_WRITE_SIZE = 1000;

const builder = new Builder({ bufferAsNative: true });

const { formatResponse } = IMAPConnection.prototype;

async function onFetch(mailboxId, options, session, fn) {
  this.logger.debug('FETCH', { mailboxId, options, session });

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

      if (entries.length > 0) {
        this.server.notifier
          .addEntries(this, session, mailboxId, entries)
          .then(() => this.server.notifier.fire(session.user.alias_id))
          .catch((err) =>
            this.logger.fatal(err, { session, resolver: this.resolver })
          );
      }
    } catch (err) {
      if (err.imapResponse) return fn(null, err.imapResponse);
      fn(err);
    }

    return;
  }

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

    const pageQuery = { ...query };

    //
    // NOTE: if the uid is not in the selected list then we can assume client is requesting invalid data
    //       (e.g. `options.messages = [ 50 ]` when `50` doesn't exist, e.g. after COPY in Thunderbird)
    //

    let queryAll = false;

    /*
    // return early if no messages
    // (we could also do `_id: -1` as a query)
    if (options.messages.length === 0) {
      return fn(
        null,
        true,
        {
          rowCount,
          totalBytes
        },
        compiledPayloads,
        entries
      );
    }
    */

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

    // TODO: take out JSON.parse and JSON.stringify
    // converts objectids -> strings and arrays/json appropriately
    const condition = JSON.parse(JSON.stringify(pageQuery));

    // condition {
    //   mailbox: '6673762a02663ea16204767b',
    //   uid: {
    //     '$in': [
    //       4047, 4049, 4050, 4051, 4052, 4054, 4053, 4055, 4056, 4057,
    //       4058, 4059, 4060, 4061, 4062, 4063, 4064, 4048, 4066, 4065,
    //       4067, 4068, 4069, 4070, 4072, 4071, 4073, 4074, 4075, 4076,
    //       4077, 4078, 4079, 4080, 4081, 4082, 4083, 4084, 4085, 4087,
    //       4088, 4089, 4090, 4092, 4091, 4093, 4095, 4094, 4086, 4098,
    //       4101, 4099, 4102, 4103, 4106, 4104, 4105, 4100, 4107, 4108,
    //       4111, 4109, 4110, 4114, 4115, 4116, 4117, 4118, 4119, 4120,
    //       4123, 4125, 4122, 4127, 4130, 4121, 4124, 4126, 4132, 4129,
    //       4131, 4128, 4096, 4097, 4133, 4135, 4134, 4137, 4138, 4136,
    //       4139, 4140, 4141, 4142, 4144, 4146, 4143, 4145, 4148, 4147,
    //       ... 429 more items
    //     ]
    //   }
    // }

    // TODO: `condition` may need further refined for accuracy (e.g. see `prepareQuery`)
    const fields = [];
    for (const key of Object.keys(projection)) {
      if (projection[key] === true) fields.push(key);
    }

    // const count = await Messages.countDocuments(this, session, condition);

    const sql = builder.build({
      type: 'select',
      table: 'Messages',
      condition,
      fields,
      // sort required for IMAP UIDPLUS
      sort: condition?.uid?.$eq ? undefined : 'uid'
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

    // <https://github.com/m4heshd/better-sqlite3-multiple-ciphers/blob/master/docs/api.md#iteratebindparameters---iterator>
    const stmt = session.db.prepare(sql.query);

    //
    // NOTE: we explicitly disable `isBatchMode` for now since there is a bug somewhere
    //       in the logic for `await this.wss.broadcast(...)` below which code lies in `sqlite-server.js`
    //       and the loop itself has a `5m` timeout, so basically FETCH calls were taking 5m+ before timing out
    //
    const isBatchMode = false; // count > 1000;

    for (const result of isBatchMode
      ? stmt.all(sql.values)
      : stmt.iterate(sql.values)) {
      const message = syncConvertResult(Messages, result, projection);

      // don't process messages that are new since query started
      // <https://github.com/nodemailer/wildduck/issues/708>
      if (queryAll && !session.selected.uidList.includes(message.uid)) {
        continue;
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

        // flush compiled payloads after every 500 written
        if (isBatchMode && compiledPayloads.length >= 500) {
          await this.wss.broadcast(session, compiledPayloads);
          _.pullAll(compiledPayloads, compiledPayloads);
        }

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

      // flush compiled payloads after every 500 written
      if (isBatchMode && compiledPayloads.length >= 500) {
        await this.wss.broadcast(session, compiledPayloads);
        _.pullAll(compiledPayloads, compiledPayloads);
      }

      rowCount++;

      if (markAsSeen) {
        const sql = builder.build({
          type: 'update',
          table: 'Messages',
          condition: {
            _id: message._id.toString()
          },
          modifier: {
            $set: {
              flags: JSON.stringify(message.flags),
              unseen: false
            }
          }
        });
        ops.push([sql.query, sql.values]);

        entries.push({
          ignore: session.id,
          command: 'FETCH',
          uid: message.uid,
          flags: message.flags,
          message: message._id,
          thread: message.thread,
          // unseenChange is true when marking as seen via FETCH
          unseenChange: true
        });
      }
    }

    // perform db operations
    if (ops.length > 0) {
      session.db
        .transaction((ops) => {
          for (const op of ops) {
            session.db.prepare(op[0]).run(op[1]);
          }
        })
        .immediate(ops);
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
  } catch (err) {
    fn(refineAndLogError(err, session, true, this));
  }
}

module.exports = onFetch;
