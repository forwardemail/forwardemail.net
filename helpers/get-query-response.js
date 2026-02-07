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

const punycode = require('node:punycode');
const { Buffer } = require('node:buffer');

const libmime = require('libmime');

const Indexer = require('./indexer');
const { repairEncryptedMessage } = require('./repair-encrypted-message');

// eslint-disable-next-line max-params
function getQueryResponse(query, message, options = {}, instance, session) {
  options = options || {};

  if (!instance) throw new TypeError('Instance is missing');
  if (!session) throw new TypeError('Session is missing');

  // for optimization purposes try to use cached mimeTree etc. if available
  // If these values are missing then generate these when first time required
  // So if the query is for (UID FLAGS) then mimeTree is never generated
  let { mimeTree } = message;
  const indexer = new Indexer(options);

  // Repair corrupted encrypted.asc bodies from Feb 2-6, 2026
  // This handles messages with empty encrypted.asc parts that need
  // to be reconstructed from the raw message for IMAP clients
  if (mimeTree && message.raw) {
    mimeTree = repairEncryptedMessage(mimeTree, message.raw);
  }

  // generate response object
  const values = [];
  for (const item of query) {
    let value = '';
    switch (item.item) {
      case 'uid': {
        value = message.uid;
        break;
      }

      case 'modseq': {
        value = message.modseq;
        break;
      }

      case 'flags': {
        value = message.flags;
        break;
      }

      case 'internaldate': {
        if (!message.idate) {
          message.idate = new Date();
        }

        value = message.idate;
        break;
      }

      case 'bodystructure': {
        if (message.bodystructure) {
          value = message.bodystructure;
        } else {
          if (!mimeTree) {
            mimeTree = indexer.parseMimeTree(message.raw);
            mimeTree = repairEncryptedMessage(mimeTree, message.raw);
          }

          value = indexer.getBodyStructure(mimeTree);
        }

        const walk = (arr) => {
          for (const [i, entry] of arr.entries()) {
            if (Array.isArray(entry)) {
              walk(entry);
              continue;
            }

            if (!entry || typeof entry !== 'object') {
              continue;
            }

            let val = entry;
            if (!Buffer.isBuffer(val) && val.buffer) {
              val = val.buffer;
            }

            arr[i] = libmime.encodeWords(
              val.toString(),
              false,
              Number.POSITIVE_INFINITY
            );
          }
        };

        if (!options.acceptUTF8Enabled) {
          walk(value);
        }

        break;
      }

      case 'envelope': {
        if (message.envelope) {
          //
          // NOTE: this is an edge case because of how we store envelopes
          // <https://github.com/nodemailer/wildduck/issues/618#issuecomment-1933139110>
          //
          value = message.envelope.map((a) =>
            a instanceof Date ? a.toISOString() : a
          );

          // cast invalidly stored In-Reply-To (8) and Message-ID (9) to strings
          for (const index of [9, 10]) {
            if (value[index] && Array.isArray(value[index])) {
              value[index] = value[index].pop() || null;
            }
          }
        } else {
          if (!mimeTree) {
            mimeTree = indexer.parseMimeTree(message.raw);
            mimeTree = repairEncryptedMessage(mimeTree, message.raw);
          }

          value = indexer.getEnvelope(mimeTree);
        }

        if (!options.acceptUTF8Enabled) {
          // encode unicode values

          // subject
          value[1] = libmime.encodeWords(
            value[1],
            false,
            Number.POSITIVE_INFINITY
          );

          for (let i = 2; i < 8; i++) {
            if (value[i] && Array.isArray(value[i])) {
              for (const addr of value[i]) {
                if (addr[0] && typeof addr[0] === 'object') {
                  // name
                  let val = addr[0];
                  if (!Buffer.isBuffer(val) && val.buffer) {
                    val = val.buffer;
                  }

                  addr[0] = libmime.encodeWords(
                    val.toString(),
                    false,
                    Number.POSITIVE_INFINITY
                  );
                }

                if (addr[2] && typeof addr[2] === 'object') {
                  // username
                  let val = addr[2];
                  if (!Buffer.isBuffer(val) && val.buffer) {
                    val = val.buffer;
                  }

                  addr[2] = libmime.encodeWords(
                    val.toString(),
                    false,
                    Number.POSITIVE_INFINITY
                  );
                }

                if (addr[3] && typeof addr[3] === 'object') {
                  // domain
                  let val = addr[3];
                  if (!Buffer.isBuffer(val) && val.buffer) {
                    val = val.buffer;
                  }

                  try {
                    addr[3] = punycode.toASCII(val.toString());
                  } catch {
                    addr[3] = val.toString();
                  }
                }
              }
            }
          }

          // libmime.encodeWords(value, false, Infinity)
        }

        break;
      }

      case 'rfc822': {
        if (!mimeTree) {
          mimeTree = indexer.parseMimeTree(message.raw);
          mimeTree = repairEncryptedMessage(mimeTree, message.raw);
        }

        value = indexer.getContents(mimeTree, false, {}, instance, session);
        break;
      }

      case 'rfc822.size': {
        if (message.size > 0) {
          value = message.size;
        } else {
          if (!mimeTree) {
            mimeTree = indexer.parseMimeTree(message.raw);
            mimeTree = repairEncryptedMessage(mimeTree, message.raw);
          }

          value = indexer.getSize(mimeTree);
        }

        break;
      }

      case 'rfc822.header': {
        // Equivalent to BODY[HEADER]
        if (!mimeTree) {
          mimeTree = indexer.parseMimeTree(message.raw);
          mimeTree = repairEncryptedMessage(mimeTree, message.raw);
        }

        value = [mimeTree.header || []].flat().join('\r\n') + '\r\n\r\n';
        break;
      }

      case 'rfc822.text': {
        // Equivalent to BODY[TEXT]
        if (!mimeTree) {
          mimeTree = indexer.parseMimeTree(message.raw);
          mimeTree = repairEncryptedMessage(mimeTree, message.raw);
        }

        value = indexer.getContents(
          mimeTree,
          {
            path: '',
            type: 'text'
          },
          {},
          instance,
          session
        );
        break;
      }

      case 'body': {
        // if (!item.hasOwnProperty('type')) {
        if (!Object.prototype.hasOwnProperty.call(item, 'type')) {
          // BODY
          if (!mimeTree) {
            mimeTree = indexer.parseMimeTree(message.raw);
            mimeTree = repairEncryptedMessage(mimeTree, message.raw);
          }

          value = indexer.getBody(mimeTree);
        } else if (item.path === '' && item.type === 'content') {
          // BODY[]
          if (!mimeTree) {
            mimeTree = indexer.parseMimeTree(message.raw);
            mimeTree = repairEncryptedMessage(mimeTree, message.raw);
          }

          value = indexer.getContents(
            mimeTree,
            false,
            {
              startFrom: item.partial && item.partial.startFrom,
              maxLength: item.partial && item.partial.maxLength
            },
            instance,
            session
          );
        } else {
          // BODY[SELECTOR]
          if (!mimeTree) {
            mimeTree = indexer.parseMimeTree(message.raw);
            mimeTree = repairEncryptedMessage(mimeTree, message.raw);
          }

          value = indexer.getContents(
            mimeTree,
            item,
            {
              startFrom: item.partial && item.partial.startFrom,
              maxLength: item.partial && item.partial.maxLength
            },
            instance,
            session
          );
        }

        if (item.partial) {
          let len;

          if (value && value.type === 'stream') {
            value.startFrom = item.partial.startFrom;
            value.maxLength = item.partial.maxLength;
            len = value.expectedLength;
          } else {
            // eslint-disable-next-line unicorn/prefer-string-slice
            value = value
              .toString('binary')
              .substr(item.partial.startFrom, item.partial.maxLength);
            len = value.length;
          }

          // If start+length is larger than available value length, then do not return the length value
          // Instead of BODY[]<10.20> return BODY[]<10> which means that the response is from offset 10 to the end
          if (
            item.original.partial.length === 2 &&
            item.partial.maxLength - item.partial.startFrom > len
          ) {
            item.original.partial.pop();
          }
        }

        break;
      }

      default: {
        break;
      }
    }

    values.push(value);
  }

  return values;
}

module.exports = getQueryResponse;
