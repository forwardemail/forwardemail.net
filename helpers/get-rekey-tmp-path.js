/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');

//
// The rekeyed VACUUM INTO copy lives next to the live database and is named
// after the rekey operation ID (falling back to the queue payload ID for
// legacy jobs).  Deriving the path from the operation instead of the request
// lets a re-queued job clean up after a hard kill and lets startup recovery
// tell whether a crashed worker had already renamed the copy over the live
// database (the copy no longer exists once the rename happened).
//
function getRekeyTmpPath(storagePath, { rekey_id: rekeyId, id }) {
  const operationId = rekeyId || id;
  if (typeof operationId !== 'string' || operationId.length === 0)
    throw new TypeError('Rekey operation ID missing');
  // never let an operation ID steer the copy outside the mailbox directory
  if (/[/\\\0]/.test(operationId) || operationId.includes('..'))
    throw new TypeError('Rekey operation ID contains invalid characters');
  return path.join(
    path.dirname(storagePath),
    `${path.basename(storagePath, '.sqlite')}-${operationId}-backup.sqlite`
  );
}

module.exports = getRekeyTmpPath;
