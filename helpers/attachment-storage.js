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

const { Buffer } = require('node:buffer');

const _ = require('lodash');
const intoStream = require('into-stream');
const ms = require('ms');
const pRetry = require('p-retry');
const pify = require('pify');
const revHash = require('rev-hash');
const { Builder } = require('json-sql');

const WildDuckAttachmentStorage = require('wildduck/lib/attachment-storage');

//
// we don't use base64 decoding/encoding of attachments (unlike wildduck)
// instead we store raw buffer/binary blob in sqlite of the attachment
// as `attachment.body` (as opposed to using gridfs and chunking)
//

const Attachments = require('#models/attachments');
const logger = require('#helpers/logger');
const isRetryableError = require('#helpers/is-retryable-error');
const { syncConvertResult } = require('#helpers/mongoose-to-sqlite');

const builder = new Builder();

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
      ],
      checkpoint: 'PASSIVE'
    });
  } else {
    attachments = session.db.prepare(sql.query).all(sql.values);
  }

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
        ],
        checkpoint: 'PASSIVE'
      });
    } else {
      session.db.prepare(sql.query).run(sql.values);
    }
  }
}

async function retryCreateAttachment(...args) {
  return pRetry(() => createAttachment.call(this, ...args), {
    retries: 2,
    minTimeout: ms('5s'),
    async onFailedAttempt(error) {
      // TODO: add fallback mechanism which returns existing unique attachment
      if (error.message === 'UNIQUE constraint failed: Attachments.hash') {
        error.isCodeBug = true;
        throw error;
      }

      if (isRetryableError(error)) {
        logger.fatal(error);
        return;
      }

      throw error;
    }
  });
}

async function createAttachment(instance, session, node) {
  const hex = await this.calculateHashPromise(node.body);
  node.hash = revHash(Buffer.from(hex, 'hex'));
  node.counter = 1;
  node.counterUpdated = new Date();
  node.size = node.body.length;
  if (Number.isNaN(node.magic) || typeof node.magic !== 'number') {
    const err = new TypeError('Invalid magic');
    err.node = node;
    throw err;
  }

  const sql = builder.build({
    type: 'update',
    table: 'Attachments',
    condition: {
      hash: node.hash
    },
    modifier: {
      $inc: {
        counter: 1,
        magic: node.magic
      },
      $set: {
        counterUpdated: new Date().toISOString()
      }
    },
    returning: ['*']
  });

  let result;
  if (session.db.readonly) {
    result = await instance.wsp.request({
      action: 'stmt',
      session: { user: session.user },
      stmt: [
        ['prepare', sql.query],
        ['get', sql.values]
      ],
      checkpoint: 'PASSIVE'
    });
  } else {
    result = session.db.prepare(sql.query).get(sql.values);
  }

  if (result) return syncConvertResult(Attachments, result);

  // TODO: finish this INSERT statement with validation of a field returned
  // const attachment = new Attachments(node);
  // await attachment.validate();
  // {
  //   const sql = builder.build({
  //     type: 'insert',
  //   });
  //   // TODO: finish this
  // }

  // virtual helper
  node.instance = instance;
  node.session = session;

  const attachment = Attachments.create(node);
  return attachment;
}

class AttachmentStorage {
  constructor(options) {
    this.options = options || {};
    this.calculateHashPromise = pify(
      WildDuckAttachmentStorage.prototype.calculateHash
    );
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
      body: attachmentData.body,
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
  createReadStream(id, attachment) {
    // NOTE: we don't use any `metadata` or `streamOptions` like wildduck does
    try {
      //
      // NOTE: `attachment.body` can be undefined if FileNotFound error occurs
      //       so in order to prevent an error being thrown per below GH issue
      //       we allocate a new Buffer with size of 0 bytes
      //       <https://github.com/sindresorhus/into-stream/issues/23>
      //
      const stream = intoStream(attachment.body || Buffer.alloc(0));
      return stream;
    } catch (err) {
      // errors most likely won't get thrown anymore since we have `Buffer.alloc(0)` now
      // but in the event they do, we at least have this to help debug the issue
      err.isCodeBug = true;
      if (typeof attachment === 'object')
        err.attachment = _.omit(attachment, ['body']);
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
