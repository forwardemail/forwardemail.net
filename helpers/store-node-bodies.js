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
    // eslint-disable-next-line no-await-in-loop
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
