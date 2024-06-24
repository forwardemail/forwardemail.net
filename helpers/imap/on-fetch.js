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
const pMap = require('p-map');
const tools = require('wildduck/lib/tools');
const { Builder } = require('json-sql');
const { IMAPConnection } = require('wildduck/imap-core/lib/imap-connection');
const { imapHandler } = require('wildduck/imap-core');

const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const getQueryResponse = require('#helpers/get-query-response');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const { syncConvertResult } = require('#helpers/mongoose-to-sqlite');

// const LIMITED_PROJECTION_KEYS = new Set(['_id', 'flags', 'modseq', 'uid']);
// const MAX_BULK_WRITE_SIZE = 1000;

const builder = new Builder();

const { formatResponse } = IMAPConnection.prototype;

async function onFetch(mailboxId, options, session, fn) {
  this.logger.debug('FETCH', { mailboxId, options, session });

  if (this.wsp) {
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

      for (const compiled of writeStream) {
        session.writeStream.write({ compiled });
      }

      fn(null, bool, response);
    } catch (err) {
      fn(err);
    }

    return;
  }

  try {
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

    let queryAll;

    const pageQuery = { ...query };

    // `1:*`
    // <https://github.com/nodemailer/wildduck/pull/559>
    // if (_.isEqual(options.messages.sort(), session.selected.uidList.sort()))
    if (options.messages.length === session.selected.uidList.length)
      queryAll = true;
    // NOTE: don't use uid for `1:*`
    else pageQuery.uid = tools.checkRangeQuery(options.messages, false);

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

    // TODO: this query could become too large and slow for 1000's of messages
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
    const entries = [];
    const writeStream = [];
    const ops = [];

    let rowCount = 0;
    let totalBytes = 0;

    // <https://github.com/m4heshd/better-sqlite3-multiple-ciphers/blob/master/docs/api.md#iteratebindparameters---iterator>
    // const stmt = session.db.prepare(sql.query);
    // for (const result of stmt.iterate(sql.values))
    const results = session.db.prepare(sql.query).all(sql.values);

    if (results.length > 0) {
      await pMap(
        results,
        async (result) => {
          const message = syncConvertResult(Messages, result, projection);

          // don't process messages that are new since query started
          if (
            queryAll &&
            typeof session?.selected?.uidList === 'object' &&
            Array.isArray(session.selected.uidList) &&
            !session.selected.uidList.includes(message.uid)
          ) {
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

            writeStream.push(compiled);
            rowCount++;

            //
            // NOTE: we may need to pass indexer options here as similar to wildduck (through the use of `eachAsync`)
            // <https://mongoosejs.com/docs/api/querycursor.html#QueryCursor.prototype.eachAsync()>
            // (e.g. so we can do `await Promise.resolve((resolve) => setImmediate(resolve));`)
            //

            // move along to next cursor
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
          const buffer = await getStream.buffer(stream);
          const compiled = buffer.toString('binary');
          totalBytes += compiled.length;
          writeStream.push(compiled);

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
              message: message._id
            });
          }
        },
        { concurrency: 500 }
      );
    }

    // perform db operations
    if (ops.length > 0) {
      session.db.transaction(() => {
        for (const op of ops) {
          session.db.prepare(op[0]).run(op[1]);
        }
      })();
    }

    if (entries.length > 0) {
      await this.server.notifier.addEntries(
        this,
        session,
        mailbox._id,
        entries
      );
      this.server.notifier.fire(session.user.alias_id);
    }

    fn(
      null,
      true,
      {
        rowCount,
        totalBytes
      },
      writeStream
    );
  } catch (err) {
    // NOTE: wildduck uses `imapResponse` so we are keeping it consistent
    if (err.imapResponse) {
      this.logger.error(err, { mailboxId, options, session });
      return fn(null, err.imapResponse);
    }

    fn(refineAndLogError(err, session, true, this));
  }
}

module.exports = onFetch;
