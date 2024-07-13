/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const mongoose = require('mongoose');
const { Builder } = require('json-sql');

const getAttachments = require('#helpers/get-attachments');

const builder = new Builder();

// eslint-disable-next-line max-params
function copyMessages(session, modseq, mailbox, targetMailbox, results) {
  if (
    typeof results !== 'object' ||
    !Array.isArray(results.sourceUid) ||
    !Array.isArray(results.sourceIds) ||
    !Array.isArray(results.destinationUid) ||
    typeof results.copiedMessages !== 'number' ||
    typeof results.copiedStorage !== 'number' ||
    typeof results.uidNext !== 'number' ||
    !Array.isArray(results.entries)
  )
    throw new TypeError('results object missing');

  return function (messages) {
    for (const m of messages) {
      // don't copy in bulk so it doesn't get out of incremental uid sync
      const _id = new mongoose.Types.ObjectId();
      results.sourceUid.unshift(m.uid);
      results.sourceIds.push(m._id);
      results.destinationUid.unshift(results.uidNext);

      // copy the message and generate new id
      m._id = _id.toString();
      m.mailbox = targetMailbox._id.toString();
      m.uid = results.uidNext;
      m.exp = (
        typeof targetMailbox.retention === 'number'
          ? targetMailbox.retention !== 0
          : false
      )
        ? 1
        : 0;
      m.rdate = new Date(
        Date.now() +
          (typeof targetMailbox.retention === 'number'
            ? targetMailbox.retention
            : 0)
      ).toISOString();
      m.modseq = modseq;
      m.junk = targetMailbox.specialUse === '\\Junk';
      m.remoteAddress = session.remoteAddress;
      m.transaction = 'COPY';

      // create new message
      {
        const sql = builder.build({
          type: 'insert',
          table: 'Messages',
          values: m
        });
        session.db.prepare(sql.query).run(sql.values);
      }

      // update attachment store magic number
      const attachmentIds = getAttachments(m.mimeTree);
      if (attachmentIds.length > 0) {
        const sql = builder.build({
          type: 'update',
          table: 'Attachments',
          condition: {
            hash: {
              $in: attachmentIds
            }
          },
          modifier: {
            $inc: {
              counter: 1,
              magic: m.magic
            },
            $set: {
              counterUpdated: new Date().toString()
            }
          }
        });
        session.db.prepare(sql.query).run(sql.values);
      }

      // increase counters
      results.copiedMessages++;
      results.copiedStorage += m.size;
      results.uidNext += 1;

      // add entries
      results.entries.push({
        command: 'EXISTS',
        uid: m.uid,
        mailbox: targetMailbox._id,
        message: _id
        // thread: new mongoose.Types.ObjectId(m.thread),
        // unseen: boolean(m.unseen),
        // idate: new Date(m.idate),
        // junk: boolean(m.junk)
      });
    }

    // set all existing messages as copied
    {
      const sql = builder.build({
        type: 'update',
        table: 'Messages',
        condition: {
          _id: {
            $in: results.sourceIds
          }
        },
        modifier: {
          $set: {
            copied: true
          }
        }
      });
      session.db.prepare(sql.query).run(sql.values);
    }

    // store on target mailbox the final value of `uidNext`
    {
      const sql = builder.build({
        type: 'update',
        table: 'Mailboxes',
        condition: {
          _id: targetMailbox._id.toString()
        },
        modifier: {
          $set: {
            uidNext: results.uidNext
          }
        }
      });
      session.db.prepare(sql.query).run(sql.values);
    }
  };
}

module.exports = copyMessages;
