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

const WildDuckAttachmentStorage = require('wildduck/lib/attachment-storage');

//
// we don't use base64 decoding/encoding of attachments (unlike wildduck)
// instead we store raw buffer/binary blob in sqlite of the attachment
// as `attachment.body` (as opposed to using gridfs and chunking)
//

const Attachments = require('#models/attachments');
const logger = require('#helpers/logger');

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

  async create(instance, session, attachment) {
    const hex = await this.calculateHashPromise(attachment.body);
    attachment.hash = revHash(Buffer.from(hex, 'hex'));
    attachment.counter = 1;
    attachment.counterUpdated = new Date();
    attachment.size = attachment.body.length;
    if (
      Number.isNaN(attachment.magic) ||
      typeof attachment.magic !== 'number'
    ) {
      const err = new TypeError('Invalid magic');
      err.attachment = attachment;
      throw err;
    }

    const result = await Attachments.findOneAndUpdate(
      instance,
      session,
      {
        hash: attachment.hash
      },
      {
        $inc: {
          counter: 1,
          magic: attachment.magic
        },
        $set: {
          counterUpdated: new Date()
        }
      },
      {
        returnDocument: 'after'
      }
    );

    if (result) return result;

    // virtual helper for locking if we lock in advance
    // attachment.lock = lock

    // virtual helper
    attachment.instance = instance;
    attachment.session = session;

    return Attachments.create(attachment);
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

    const attachments = await Attachments.updateMany(
      instance,
      session,
      {
        hash: { $in: attachmentIds }
      },
      {
        $inc: {
          counter: -1,
          magic: -magic
        },
        $set: {
          counterUpdated: new Date()
        }
      },
      {
        lock,
        returnDocument: 'after'
      }
    );

    //
    // NOTE: wildduck has this disabled (as they have a cleanup job that runs after a duration)
    //       (e.g. if a user quickly re-adds the attachment, it would save the re-creation by hash lookup)
    //       (but to keep things simple for now we're just going to delete it)
    //
    await Promise.all(
      attachments.map(async (attachment) => {
        try {
          if (attachment.counter === 0 && attachment.magic === 0)
            await Attachments.deleteOne(
              instance,
              session,
              { _id: attachment._id },
              { lock }
            );
        } catch (err) {
          logger.fatal(err, { attachment });
        }
      })
    );
  }
}

module.exports = AttachmentStorage;
