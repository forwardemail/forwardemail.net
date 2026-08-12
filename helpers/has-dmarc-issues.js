/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

function hasDmarcIssues(stats) {
  return (
    stats.quarantined > 0 ||
    stats.rejected > 0 ||
    Number.parseFloat(stats.passRate) < 90
  );
}

module.exports = hasDmarcIssues;
