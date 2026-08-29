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

const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

const intoStream = require('into-stream');
const ms = require('ms');
const pRetry = require('p-retry');
const { Builder } = require('json-sql-enhanced');
const _ = require('#helpers/lodash');

//
// we don't use base64 decoding/encoding of attachments (unlike wildduck)
// instead we store raw buffer/binary blob in sqlite of the attachment
// as `attachment.body` (as opposed to using gridfs and chunking)
//

const Attachments = require('#models/attachments');
const logger = require('#helpers/logger');
const isRetryableError = require('#helpers/is-retryable-error');
const {
  prepareQuery,
  syncConvertResult
} = require('#helpers/mongoose-to-sqlite');

const builder = new Builder({ bufferAsNative: true });

async function updateAttachments(attachmentIds, magic, session) {
  const sql = builder.build({
    type: 'update',
    table: 'Attachments',
    condition: {
      hash: { $in: attachmentIds }
    },
    modifier: {
      $inc: {
        counter: -1,
        magic: -magic
      },
      $set: {
        counterUpdated: new Date().toISOString()
      }
    },
    returning: ['_id', 'counter', 'magic']
  });

  // update attachment data
  let attachments;
  if (session.db.readonly) {
    attachments = await this.wsp.request({
      action: 'stmt',
      session: { user: session.user },
      stmt: [
        ['prepare', sql.query],
        ['all', sql.values]
      ]
    });
  } else {
    attachments = session.db.prepare(sql.query).all(sql.values);
  }

  if (!Array.isArray(attachments)) attachments = [];

  // delete attachments if necessary
  const $in = [];
  for (const attachment of attachments) {
    if (attachment.counter === 0 && attachment.magic === 0) {
      $in.push(attachment._id);
    }
  }

  //
  // NOTE: wildduck has this disabled (as they have a cleanup job that runs after a duration)
  //       (e.g. if a user quickly re-adds the attachment, it would save the re-creation by hash lookup)
  //       (but to keep things simple for now we're just going to delete it)
  //
  if ($in.length > 0) {
    const sql = builder.build({
      type: 'remove',
      table: 'Attachments',
      condition: {
        _id: {
          $in
        }
      }
    });
    if (session.db.readonly) {
      await this.wsp.request({
        action: 'stmt',
        session: { user: session.user },
        stmt: [
          ['prepare', sql.query],
          ['run', sql.values]
        ]
      });
    } else {
      session.db.prepare(sql.query).run(sql.values);
    }
  }
}

function normalizeAttachmentBody(value) {
  if (Buffer.isBuffer(value)) return value;

  // `msgpackr` preserves Buffers, but accept the standard serialized Buffer
  // representation as a defensive compatibility measure for queued work from
  // older processes or transports.
  if (
    value &&
    value.type === 'Buffer' &&
    Array.isArray(value.data) &&
    value.data.every(
      (byte) => Number.isInteger(byte) && byte >= 0 && byte <= 0xff
    )
  )
    return Buffer.from(value.data);

  if (value instanceof ArrayBuffer) return Buffer.from(value);

  if (ArrayBuffer.isView(value))
    return Buffer.from(value.buffer, value.byteOffset, value.byteLength);

  const err = new TypeError(
    'Attachment body must be a Buffer, an ArrayBuffer view, or a serialized Buffer'
  );
  err.isCodeBug = true;
  throw err;
}

function getAttachmentHash(algorithm, body) {
  return `${algorithm}:${crypto
    .createHash(algorithm)
    .update(body)
    .digest('hex')}`;
}

async function executeGet(instance, session, sql) {
  if (session.db.readonly) {
    return instance.wsp.request({
      action: 'stmt',
      session: { user: session.user },
      stmt: [
        ['prepare', sql.query],
        ['get', sql.values]
      ]
    });
  }

  return session.db.prepare(sql.query).get(sql.values);
}

async function updateExistingAttachment(instance, session, options) {
  const { hash, body, magic } = options;
  const sql = builder.build({
    type: 'update',
    table: 'Attachments',
    // A digest alone is never trusted as an identity.  The byte-for-byte BLOB
    // condition prevents even a theoretical digest collision from merging two
    // different attachment bodies or corrupting their reference counters.
    condition: {
      hash,
      body
    },
    modifier: {
      $inc: {
        counter: 1,
        magic
      },
      $set: {
        counterUpdated: new Date().toISOString()
      }
    },
    returning: ['*']
  });

  return executeGet(instance, session, sql);
}

async function insertAttachmentIgnoringConflict(instance, session, node) {
  const attachment = new Attachments(node);
  attachment.instance = instance;
  attachment.session = session;
  await attachment.validate();

  const sql = builder.build({
    type: 'insert',
    // The update-then-insert sequence must not throw if an equivalent append
    // wins the race.  A losing request performs the exact-body UPDATE again.
    or: 'ignore',
    table: 'Attachments',
    values: prepareQuery(Attachments.mapping, attachment),
    returning: ['*']
  });

  return executeGet(instance, session, sql);
}

async function retryCreateAttachment(...args) {
  return pRetry(() => createAttachment.call(this, ...args), {
    retries: 2,
    minTimeout: ms('5s'),
    async onFailedAttempt(error) {
      if (error.code === 'EATTACHMENTRACE' || isRetryableError(error)) {
        logger.fatal(error);
        return;
      }

      throw error;
    }
  });
}

async function createAttachment(instance, session, node) {
  const body = normalizeAttachmentBody(node.body);
  if (!Number.isSafeInteger(node.magic)) {
    const err = new TypeError('Invalid magic');
    err.node = node;
    throw err;
  }

  node.body = body;
  node.counter = 1;
  node.counterUpdated = new Date();
  node.size = body.length;

  // Legacy rev-hash values remain readable but are intentionally not reused
  // for new writes.  New rows have a full, namespaced SHA-256 content key.
  const hash = getAttachmentHash('sha256', body);
  const collisionHash = getAttachmentHash('sha512', body);

  for (const candidateHash of [hash, collisionHash]) {
    node.hash = candidateHash;

    let result = await updateExistingAttachment(instance, session, {
      hash: node.hash,
      body,
      magic: node.magic
    });
    if (result) return syncConvertResult(Attachments, result);

    result = await insertAttachmentIgnoringConflict(instance, session, node);
    if (result) return syncConvertResult(Attachments, result);

    // INSERT OR IGNORE can only return no row when a unique key already exists.
    // Re-read it.  If it contains the same BLOB, its writer won the race and a
    // second exact-body UPDATE performs the required counter/magic increment.
    const existing = await Attachments.findOne(instance, session, {
      hash: node.hash
    });
    if (existing) {
      if (normalizeAttachmentBody(existing.body).equals(body)) {
        result = await updateExistingAttachment(instance, session, {
          hash: node.hash,
          body,
          magic: node.magic
        });
        if (result) return syncConvertResult(Attachments, result);

        // A concurrent cleanup can remove a row between the lookup and this
        // update. Retry the same SHA-256 candidate; do not create a needless
        // SHA-512 duplicate for identical content.
        const err = new Error('Attachment update lost an expected hash race');
        err.code = 'EATTACHMENTRACE';
        err.hash = node.hash;
        throw err;
      }

      // The SHA-256 key is occupied by a different BLOB. This is defense in
      // depth for a cryptographic collision or corrupted historical row; use
      // the distinct SHA-512 key and repeat the same atomic procedure.
      if (candidateHash === hash) continue;

      const err = new Error(
        'Attachment hash collision could not be disambiguated'
      );
      err.code = 'EATTACHMENTCOLLISION';
      err.hash = node.hash;
      throw err;
    }

    const err = new Error('Attachment insert lost an expected hash race');
    err.code = 'EATTACHMENTRACE';
    err.hash = node.hash;
    throw err;
  }

  const err = new Error('Attachment hash collision could not be disambiguated');
  err.code = 'EATTACHMENTCOLLISION';
  err.hash = node.hash;
  throw err;
}

class AttachmentStorage {
  constructor(options) {
    this.options = options || {};
  }

  async get(mimeTree, hash, instance, session) {
    if (!instance) throw new TypeError('Instance is not defined');
    if (!session) throw new TypeError('Session is not defined');

    // TODO: should we project w/o body since we're not using it here as an optimization (?)
    const attachmentData = await Attachments.findOne(instance, session, {
      hash
    });

    if (!attachmentData) {
      const err = new Error('This attachment does not exist');
      err.isCodeBug = true;
      // TODO: this is most likely not used and can be removed:
      err.responseCode = 404;
      err.code = 'FileNotFound';
      throw err;
    }

    // since we don't use streams (e.g. gridfs)
    // (see notes in `helpers/indexer.js`)
    return {
      body: attachmentData.body, // Buffer.from(attachmentData.body, 'hex'),
      contentType: attachmentData.contentType,
      transferEncoding: attachmentData.transferEncoding, // (instead of `.metadata.transferEncoding`)
      length: attachmentData.size, // (instead of `.length`)
      count: attachmentData.counter, // instead of `.metadata.c`)
      hash: attachmentData.hash,
      metadata: { decoded: false, lineLen: attachmentData.lineCount } // instead of `.metadata` we have empty object
    };
  }

  async create(instance, session, node) {
    return retryCreateAttachment.call(this, instance, session, node);
  }

  //
  // we could also use `to-readable-stream` instead if desired
  // <https://github.com/sindresorhus/to-readable-stream>
  //
  createReadStream(id, attachmentData, options = {}) {
    try {
      //
      // NOTE: `attachmentData.body` can be undefined if FileNotFound error occurs
      //       so in order to prevent an error being thrown per below GH issue
      //       we allocate a new Buffer with size of 0 bytes
      //       <https://github.com/sindresorhus/into-stream/issues/23>
      //
      const streamOptions = {};

      if (attachmentData && attachmentData.metadata) {
        if (options && !attachmentData.metadata.decoded) {
          streamOptions.start = options.startFrom || 0;
          if (options.maxLength) {
            streamOptions.end = streamOptions.start + options.maxLength;
          }
        }

        if (
          streamOptions.start &&
          streamOptions.start > attachmentData.length
        ) {
          streamOptions.start = attachmentData.length;
        }

        if (streamOptions.end && streamOptions.end > attachmentData.length) {
          streamOptions.end = attachmentData.length;
        }
      }

      let buffer = attachmentData.body || Buffer.alloc(0);

      if (streamOptions && streamOptions.start) {
        buffer = streamOptions.end
          ? buffer.slice(streamOptions.start, streamOptions.end)
          : buffer.slice(streamOptions.start);
      }

      return intoStream(buffer);
    } catch (err) {
      // errors most likely won't get thrown anymore since we have `Buffer.alloc(0)` now
      // but in the event they do, we at least have this to help debug the issue
      err.isCodeBug = true;
      if (typeof attachmentData === 'object')
        err.attachmentData = _.omit(attachmentData, ['body']);
      throw err;
    }
  }

  async deleteMany(instance, session, attachmentIds, magic) {
    if (Number.isNaN(magic) || typeof magic !== 'number') {
      const err = new TypeError('Invalid magic');
      err.attachmentIds = attachmentIds;
      err.magic = magic;
      throw err;
    }

    if (instance.wsp) throw new TypeError('WSP instance invalid');

    let err;

    try {
      await updateAttachments.call(instance, attachmentIds, magic, session);
    } catch (_err) {
      err = _err;
    }

    if (err) throw err;
  }
}

module.exports = AttachmentStorage;
