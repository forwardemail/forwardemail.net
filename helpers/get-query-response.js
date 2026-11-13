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

const IMAPError = require('./imap-error');
const Indexer = require('./indexer');
const getImapFlags = require('./get-imap-flags');

//
// Content a response may hold of one message: twice its size, and this much
// (a client asks for a message, or for its parts, once). The response of a
// message is built whole before it is sent, and sections asked for in one
// FETCH can hold each other (BODY[1] holds BODY[1.1], and each of many
// HEADER.FIELDS lists a part of the same header), so without a bound a
// message of many nested parts could be asked for many times over.
//
const MAX_CONTENT_EXTRA = 1024 * 1024;

// the bytes of content a value takes to build (the whole of a section, also
// when a range of it is asked for: its attachments are read whole)
function contentLength(value) {
  if (typeof value === 'string' || Buffer.isBuffer(value)) return value.length;
  return value?.type === 'stream' ? value.expectedLength || 0 : 0;
}

// the size of a message: as stored, or else by its parts (which cannot be
// added up for a message of thousands of them, and is then not bounded)
function messageSize(message, mimeTree, indexer) {
  if (message.size > 0) return message.size;
  try {
    return indexer.getSize(mimeTree);
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

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

  // Older records can contain the original RFC 5322 source as a MIME-tree
  // string. Parse it before any BODY selector mutates or rebuilds a node.
  if (typeof mimeTree === 'string' || Buffer.isBuffer(mimeTree)) {
    mimeTree = indexer.parseMimeTree(mimeTree);
  }

  // generate response object
  const values = [];
  // (see `MAX_CONTENT_EXTRA`; the size is only worked out for a response
  //  that holds that much)
  let contentBytes = 0;
  let maxContentBytes;
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
        // Merge custom labels into FLAGS as IMAP keywords (RFC 3501) so
        // native IMAP clients (Apple Mail, Thunderbird) see them. STORE
        // mirrors keywords into both fields, so dedupe defensively.
        value = getImapFlags(message);
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
          for (const index of [8, 9]) {
            if (value[index] && Array.isArray(value[index])) {
              value[index] = value[index].pop() || null;
            }
          }
        } else {
          if (!mimeTree) {
            mimeTree = indexer.parseMimeTree(message.raw);
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
          }

          value = indexer.getSize(mimeTree);
        }

        break;
      }

      case 'rfc822.header': {
        // Equivalent to BODY[HEADER]
        if (!mimeTree) {
          mimeTree = indexer.parseMimeTree(message.raw);
        }

        value = [mimeTree.header || []].flat().join('\r\n') + '\r\n\r\n';
        break;
      }

      case 'rfc822.text': {
        // Equivalent to BODY[TEXT]
        if (!mimeTree) {
          mimeTree = indexer.parseMimeTree(message.raw);
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
          }

          value = indexer.getBody(mimeTree);
        } else if (item.path === '' && item.type === 'content') {
          // BODY[]
          if (!mimeTree) {
            mimeTree = indexer.parseMimeTree(message.raw);
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
            item.partial.maxLength > len
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

    contentBytes += contentLength(value);
    if (contentBytes > MAX_CONTENT_EXTRA) {
      maxContentBytes ??=
        2 * messageSize(message, mimeTree, indexer) + MAX_CONTENT_EXTRA;
      if (contentBytes > maxContentBytes) {
        // (nothing reads the content that was started)
        for (const value of values) {
          if (value?.type === 'stream') value.value.abort();
        }

        // (a client's mistake, answered NO [LIMIT]: not one to alert on)
        throw new IMAPError('Too much of the message asked for at once', {
          imapResponse: 'LIMIT',
          ignoreHook: true
        });
      }
    }
  }

  return values;
}

module.exports = getQueryResponse;
