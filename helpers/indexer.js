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
const { PassThrough } = require('node:stream');

const WildDuckIndexer = require('wildduck/imap-core/lib/indexer/indexer');

const storeNodeBodies = require('#helpers/store-node-bodies');

const NEWLINE = Buffer.from('\r\n');

// not yet exposed via indexer
function formatHeaders(headers) {
  headers = headers || [];
  if (!Array.isArray(headers)) {
    headers = [headers || []].flat();
  }

  return headers;
}

class Indexer extends WildDuckIndexer {
  constructor(options) {
    super(options);
    this.storeNodeBodies = storeNodeBodies.bind(this);
  }

  rebuild(mimeTree, textOnly, options) {
    options = options || {};

    const output = new PassThrough();
    let aborted = false;

    const startFrom = Math.max(Number(options.startFrom) || 0, 0);
    const maxLength = Math.max(Number(options.maxLength) || 0, 0);

    output.isLimited = Boolean(options.startFrom || options.maxLength);

    let curWritePos = 0;
    let writeLength = 0;

    const getCurrentBounds = (size) => {
      if (curWritePos + size < startFrom) {
        curWritePos += size;
        return false;
      }

      if (maxLength && writeLength >= maxLength) {
        writeLength += size;
        return false;
      }

      const startFromBounds =
        curWritePos < startFrom ? startFrom - curWritePos : 0;

      let maxLengthBounds = maxLength ? maxLength - writeLength : 0;
      maxLengthBounds = Math.min(size - startFromBounds, maxLengthBounds);
      if (maxLengthBounds < 0) {
        maxLengthBounds = 0;
      }

      return {
        startFrom: startFromBounds,
        maxLength: maxLengthBounds
      };
    };

    const write = async (chunk) => {
      if (!chunk || chunk.length === 0) {
        return;
      }

      if (curWritePos >= startFrom) {
        // already allowed to write
        curWritePos += chunk.length;
      } else if (curWritePos + chunk.length <= startFrom) {
        // not yet ready to write, skip
        curWritePos += chunk.length;
        return;
      } else {
        // chunk is in the middle
        const useBytes = curWritePos + chunk.length - startFrom;
        curWritePos += chunk.length;
        chunk = chunk.slice(-useBytes);
      }

      if (maxLength) {
        if (writeLength >= maxLength) {
          // can not write anymore
          return;
        }

        if (writeLength + chunk.length <= maxLength) {
          // can still write chunks, so do nothing
          writeLength += chunk.length;
        } else {
          // chunk is in the middle
          const allowedBytes = maxLength - writeLength;
          writeLength += chunk.length;
          chunk = chunk.slice(0, allowedBytes);
        }
      }

      if (output.write(chunk) === false) {
        await new Promise((resolve) => {
          output.once('drain', resolve());
        });
      }
    };

    const processStream = async () => {
      let firstLine = true;
      let isRootNode = true;
      let remainder = false;

      // make sure that mixed body + mime gets rebuilt correctly
      const emit = async (data, force) => {
        if (remainder || data || force) {
          if (firstLine) {
            firstLine = false;
          } else {
            await write(NEWLINE);
          }

          if (remainder && remainder.length > 0) {
            await write(remainder);
          }

          if (data) {
            await write(
              Buffer.isBuffer(data) ? data : Buffer.from(data, 'binary')
            );
          }
        }

        remainder = false;
      };

      // eslint-disable-next-line complexity
      const walk = async (node) => {
        if (aborted) {
          return;
        }

        if (!textOnly || !isRootNode) {
          await emit(formatHeaders(node.header).join('\r\n') + '\r\n');
        }

        isRootNode = false;
        if (Buffer.isBuffer(node.body)) {
          // node Buffer
          remainder = node.body;
        } else if (node.body && node.body.buffer) {
          // mongodb Binary
          remainder = node.body.buffer;
        } else if (typeof node.body === 'string') {
          // binary string
          remainder = Buffer.from(node.body, 'binary');
        } else {
          // whatever
          remainder = node.body;
        }

        if (node.boundary) {
          // this is a multipart node, so start with initial boundary before continuing
          await emit(`--${node.boundary}`);
        } else if (node.attachmentId && !options.skipExternal) {
          await emit(false, true); // force newline between header and contents

          let { attachmentId } = node;
          if (
            mimeTree.attachmentMap &&
            mimeTree.attachmentMap[node.attachmentId]
          ) {
            attachmentId = mimeTree.attachmentMap[node.attachmentId];
          }

          let attachmentData;
          try {
            //
            // NOTE: WildDuck source code simply passes attachmentId
            // since it uses MongoDB for lookups, but we use SQLite)
            // so we have to pass something else - and instead of rewriting _everything_
            // we simply just pass it an object with a symbol bound to `mimeTree`
            // `mimeTree[Symbol.for('instance')]`
            // `mimeTree[Symbol.for('session')]`
            //
            attachmentData = await this.getAttachment(mimeTree, attachmentId);
          } catch (err) {
            if (err.code === 'FileNotFound') {
              this.loggelf({
                short_message: 'Attachment missing',
                _mail_action: 'attachment_missing',
                _attachment_id: attachmentId
              });

              // attachment was not found from storage, use empty placeholder instead
              attachmentData = {
                contentType: 'application/octet-stream',
                transferEncoding: '8bit',
                length: 0,
                count: 0,
                hash: attachmentId,
                metadata: {
                  lineLen: 0
                }
              };
            } else {
              throw err;
            }
          }

          let attachmentSize = node.size;
          //
          // NOTE: we don't use `metadata` nor `metadata.decoded` anywhere
          //       so the below logic would never get executed
          //       (see `app/models/attachments.js` for more insight)
          //
          // we need to calculate expected length as the original does not apply anymore
          // original size matches input data but decoding/encoding is not 100% lossless so we need to
          // calculate the actual possible output size
          if (
            attachmentData.metadata &&
            attachmentData.metadata.decoded &&
            attachmentData.metadata.lineLen
          ) {
            const b64Size = Math.ceil(attachmentData.length / 3) * 4;
            let lineBreaks = Math.floor(
              b64Size / attachmentData.metadata.lineLen
            );

            // extra case where base64 string ends at line end
            // in this case we do not need the ending line break
            if (lineBreaks && b64Size % attachmentData.metadata.lineLen === 0) {
              lineBreaks--;
            }

            attachmentSize = b64Size + lineBreaks * 2;
          }

          const readBounds = getCurrentBounds(attachmentSize);
          if (readBounds) {
            // move write pointer ahead by skipped base64 bytes
            const bytes = Math.min(readBounds.startFrom, node.size);
            curWritePos += bytes;

            // only process attachment if we are reading inside existing bounds
            if (node.size > readBounds.startFrom) {
              const attachmentStream = this.attachmentStorage.createReadStream(
                attachmentId,
                attachmentData,
                readBounds
              );
              await new Promise((resolve, reject) => {
                attachmentStream.once('error', (err) => {
                  if (err.code === 'ENOENT') {
                    this.loggelf({
                      short_message: 'Attachment missing',
                      _mail_action: 'attachment_missing',
                      _attachment_id: attachmentId
                    });
                    return resolve();
                  }

                  reject(err);
                });

                attachmentStream.once('end', () => {
                  // update read offset counters

                  const bytes =
                    'outputBytes' in attachmentStream
                      ? attachmentStream.outputBytes
                      : readBounds.maxLength;

                  if (bytes) {
                    curWritePos += bytes;
                    if (maxLength) {
                      writeLength += bytes;
                    }
                  }

                  resolve();
                });

                attachmentStream.pipe(output, {
                  end: false
                });
              });
            }
          }
        }

        if (Array.isArray(node.childNodes)) {
          let pos = 0;
          for (const childNode of node.childNodes) {
            // eslint-disable-next-line no-await-in-loop
            await walk(childNode);

            if (aborted) {
              return;
            }

            if (pos++ < node.childNodes.length - 1) {
              // emit boundary unless last item
              // eslint-disable-next-line no-await-in-loop
              await emit(`--${node.boundary}`);
            }
          }
        }

        if (node.boundary) {
          await emit(`--${node.boundary}--\r\n`);
        }

        await emit();
      };

      await walk(mimeTree);

      if (mimeTree.lineCount > 1) {
        await write(NEWLINE);
      }

      output.end();
    };

    setImmediate(() => {
      processStream()
        .then(() => {
          output.end();
        })
        .catch((err) => {
          output.emit('error', err);
        });
    });

    // if called then stops resolving rest of the message
    output.abort = () => {
      aborted = true;
    };

    return {
      type: 'stream',
      value: output,
      expectedLength: this.getSize(mimeTree, textOnly)
    };
  }
}

module.exports = Indexer;
