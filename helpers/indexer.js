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

const WildDuckIndexer = require('@forwardemail/wildduck/imap-core/lib/indexer/indexer');

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

  // NOTE: `bodyQuery` is actually unused in the WildDuck source code
  // eslint-disable-next-line max-params
  bodyQuery(mimeTree, selector, instance, session, callback) {
    if (!instance) throw new TypeError('Instance is missing');
    if (!session) throw new TypeError('Session is missing');
    if (typeof callback !== 'function')
      throw new TypeError('Callback is missing');

    const data = this.getContents(mimeTree, selector, {}, instance, session);

    if (data && data.type === 'stream') {
      let sent = false;
      const buffers = [];
      let buflen = 0;

      data.value.on('readable', () => {
        let buf;
        while ((buf = data.value.read())) {
          buffers.push(buf);
          buflen += buf.length;
        }
      });

      data.value.on('error', (err) => {
        if (sent) {
          return;
        }

        sent = true;
        return callback(err);
      });

      data.value.on('end', () => {
        if (sent) {
          return;
        }

        sent = true;
        return callback(null, Buffer.concat(buffers, buflen));
      });
    } else {
      return setImmediate(() =>
        callback(null, Buffer.from((data || '').toString(), 'binary'))
      );
    }
  }

  // eslint-disable-next-line max-params
  getContents(mimeTree, selector, options = {}, instance, session) {
    if (!instance) throw new TypeError('Instance is missing');
    if (!session) throw new TypeError('Session is missing');

    options = options || {};

    let node = mimeTree;
    if (typeof selector === 'string') {
      selector = {
        type: selector
      };
    }

    selector = selector || {
      type: ''
    };

    if (selector.path) {
      node = this.resolveContentNode(mimeTree, selector.path);
    }

    if (!node) {
      return '';
    }

    switch (selector.type) {
      case '':
      case 'content': {
        if (!selector.path) {
          // BODY[]
          node.attachmentMap = mimeTree.attachmentMap;
          return this.rebuild(node, false, options, instance, session);
        }

        // BODY[1.2.3]
        node.attachmentMap = mimeTree.attachmentMap;
        return this.rebuild(node, true, options, instance, session);
      }

      case 'header': {
        if (!selector.path) {
          // BODY[HEADER] mail header
          return formatHeaders(node.header).join('\r\n') + '\r\n\r\n';
        }

        if (node.message) {
          // BODY[1.2.3.HEADER] embedded message/rfc822 header
          return (node.message.header || []).join('\r\n') + '\r\n\r\n';
        }

        return '';
      }

      case 'header.fields': {
        // BODY[HEADER.FIELDS.NOT (Key1 Key2 KeyN)] only selected header keys
        if (!selector.headers || selector.headers.length === 0) {
          return '\r\n\r\n';
        }

        const headers =
          formatHeaders(node.header)
            .filter((line) => {
              const key = line.split(':').shift().toLowerCase().trim();
              return selector.headers.includes(key);
            })
            .join('\r\n') + '\r\n\r\n';

        return headers;
      }

      case 'header.fields.not': {
        // BODY[HEADER.FIELDS.NOT (Key1 Key2 KeyN)] all but selected header keys
        if (!selector.headers || selector.headers.length === 0) {
          return formatHeaders(node.header).join('\r\n') + '\r\n\r\n';
        }

        const headers =
          formatHeaders(node.header)
            .filter((line) => {
              const key = line.split(':').shift().toLowerCase().trim();
              return !selector.headers.includes(key);
            })
            .join('\r\n') + '\r\n\r\n';
        return headers;
      }

      case 'mime': {
        // BODY[1.2.3.MIME] mime node header
        return formatHeaders(node.header).join('\r\n') + '\r\n\r\n';
      }

      case 'text': {
        if (!selector.path) {
          // BODY[TEXT] mail body without headers
          node.attachmentMap = mimeTree.attachmentMap;
          return this.rebuild(node, true, options, instance, session);
        }

        if (node.message) {
          // BODY[1.2.3.TEXT] embedded message/rfc822 body without headers
          node.attachmentMap = mimeTree.attachmentMap;
          return this.rebuild(node.message, true, options, instance, session);
        }

        return '';
      }

      default: {
        return '';
      }
    }
  }

  //
  // TODO: the issue is that rebuild is called with a `node`
  //       and not the original `mimeTree` with the symbols binded
  //       (so we pass additional args `instance` and `session` unlike WildDuck)
  //
  // eslint-disable-next-line max-params
  rebuild(mimeTree, textOnly = false, options = {}, instance, session) {
    if (!instance) throw new TypeError('Instance is missing');
    if (!session) throw new TypeError('Session is missing');

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
            // since it uses MongoDB for lookups, but we use SQLite
            // so we have to pass the instance and session as well
            // (this calls `attachmentStorage.get`)
            attachmentData = await this.getAttachment(
              mimeTree,
              attachmentId,
              instance,
              session
            );
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
            await walk(childNode);

            if (aborted) {
              return;
            }

            if (pos++ < node.childNodes.length - 1) {
              // emit boundary unless last item

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
