/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const os = require('node:os');
const path = require('node:path');

//
// NOTE: eventually this could be complex with multi server lookup
//       and if the server we're talking to doesn't have it mounted
//       then it would just not send a response (and another one would)
//
function getPathToDatabase(id) {
  return path.join(os.tmpdir(), `${id}.sqlite`);
}

module.exports = getPathToDatabase;
