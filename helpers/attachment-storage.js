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

const intoStream = require('into-stream');
const pify = require('pify');
const revHash = require('rev-hash');
const _ = require('lodash');
const { Builder } = require('json-sql');

const WildDuckAttachmentStorage = require('wildduck/lib/attachment-storage');

//
// we don't use base64 decoding/encoding of attachments (unlike wildduck)
// instead we store raw buffer/binary blob in sqlite of the attachment
// as `attachment.body` (as opposed to using gridfs and chunking)
//

const Attachments = require('#models/attachments');
const logger = require('#helpers/logger');
const { acquireLock, releaseLock } = require('#helpers/lock');
const { syncConvertResult } = require('#helpers/mongoose-to-sqlite');

const builder = new Builder();

function updateAttachments(attachmentIds, magic, session) {
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
  const attachments = session.db.prepare(sql.query).all(sql.values);

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
    session.db.prepare(sql.query).run(sql.values);
  }
}

async function createAttachment(instance, session, node, isRetry = false) {
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

  const result = session.db.prepare(sql.query).get(sql.values);
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

  try {
    const attachment = Attachments.create(node);
    return attachment;
  } catch (err) {
    if (err.message !== 'UNIQUE constraint failed: Attachments.hash' || isRetry)
      throw err;
    return createAttachment.call(this, instance, session, node, true);
  }
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

  async create(instance, session, node, isRetry = false) {
    return createAttachment.call(this, instance, session, node, isRetry);
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

  // eslint-disable-next-line max-params
  async deleteMany(instance, session, attachmentIds, magic, lock = false) {
    if (Number.isNaN(magic) || typeof magic !== 'number') {
      const err = new TypeError('Invalid magic');
      err.attachmentIds = attachmentIds;
      err.magic = magic;
      throw err;
    }

    if (instance.wsp) throw new TypeError('WSP instance invalid');

    let newLock;
    if (!lock) newLock = await acquireLock(instance, session.db);

    let err;

    try {
      updateAttachments(attachmentIds, magic, session);
    } catch (_err) {
      err = _err;
    }

    // release lock
    if (newLock?.success) {
      try {
        await releaseLock(instance, session.db, newLock);
      } catch (err) {
        logger.fatal(err, { attachmentIds, magic });
      }
    }

    if (err) throw err;
  }
}

module.exports = AttachmentStorage;
