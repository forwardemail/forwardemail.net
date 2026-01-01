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
  // Handle already-parsed object (new brotli-compressed format)
  if (typeof mimeTree === 'object' && mimeTree !== null) {
    if (mimeTree.attachmentMap && typeof mimeTree.attachmentMap === 'object') {
      return Object.values(mimeTree.attachmentMap);
    }

    return [];
  }

  // Handle JSON string (old format) - fast string search to avoid full parse
  if (typeof mimeTree === 'string') {
    const index = mimeTree.indexOf(ATTACHMENT_MAP_STR);
    if (index === -1) return [];
    return Object.values(
      JSON.parse(
        `{${mimeTree.slice(index + ATTACHMENT_MAP_STR.length).split('}')[0]}}`
      )
    );
  }

  return [];
}

module.exports = getAttachments;
