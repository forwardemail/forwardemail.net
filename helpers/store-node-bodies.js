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

async function storeNodeBodies(instance, session, maildata, mimeTree) {
  mimeTree.attachmentMap = {};
  for (const node of maildata.nodes) {
    //
    // TODO: we should store blobs in their own table and use a foreign key reference (?)
    //       <https://stackoverflow.com/a/57583478>
    //
    //       <https://sqlite-users.sqlite.narkive.com/Q4txMI8t/effect-of-blobs-on-performance#post3>
    //
    //       Quote from the author of SQLite:
    //
    //       > Here's a hint though - make the BLOB columns the last column in
    //       > your tables. Or even store the BLOBs in a separate table which
    //       > only has two columns: an integer primary key and the blob itself,
    //       > and then access the BLOB content using a join if you need to.
    //       > If you put various small integer fields after the BLOB, then
    //       > SQLite has to scan through the entire BLOB content (following
    //       > the linked list of disk pages) to get to the integer fields at
    //       > the end, and that definitely can slow you down.
    //       > - D. Richard Hipp
    //
    // NOTE: findOneAndUpdate calls in AttachmentStorage helper method
    //       cause SQLite slowness because it's updating a row
    //       that has a large BLOB (e.g. if you have a large attachment it's slow)
    //

    const attachment = await this.attachmentStorage.create(
      instance,
      session,
      node
    );
    mimeTree.attachmentMap[node.attachmentId] = attachment.hash;
    const attachmentInfo =
      maildata.attachments &&
      maildata.attachments.find((a) => a.id === node.attachmentId);
    if (attachmentInfo && node.body) attachmentInfo.size = node.body.length;
  }

  return true;
}

module.exports = storeNodeBodies;
