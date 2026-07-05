/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Users = require('#models/users');
const logger = require('#helpers/logger');

// sticky positive cache: once an admin exists, self-hosted first-run setup
// is complete for the lifetime of the process (a countDocuments per request
// only happens during the short window before the first admin is created)
let complete = false;

async function isSetupComplete() {
  if (complete) return true;

  try {
    const count = await Users.countDocuments({ group: 'admin' });
    if (count > 0) complete = true;
  } catch (err) {
    logger.fatal(err);
    // fail open so a transient database error cannot lock an existing
    // install behind the first-run gate
    return true;
  }

  return complete;
}

function markSetupComplete() {
  complete = true;
}

// exposed for tests only
function resetSetupComplete() {
  complete = false;
}

module.exports = { isSetupComplete, markSetupComplete, resetSetupComplete };
