/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// NOTE: this is custom function since `JSON.parse` on the entire
//       message's `mimeTree` would be incredible slow (1ms+)
//
const ATTACHMENT_MAP_STR = ',"attachmentMap":{';

function getAttachments(mimeTree) {
  const index = mimeTree.indexOf(ATTACHMENT_MAP_STR);
  if (index === -1) return [];
  return Object.values(
    JSON.parse(
      `{${mimeTree.slice(index + ATTACHMENT_MAP_STR.length).split('}')[0]}}`
    )
  );
}

module.exports = getAttachments;
