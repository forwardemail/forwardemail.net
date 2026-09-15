/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const renewalGraceStatuses = new Set(['auto renew period', 'pending renew']);

function isRdapRenewalGracePeriod(status) {
  if (!Array.isArray(status)) return false;

  return status.some(
    (value) =>
      typeof value === 'string' &&
      renewalGraceStatuses.has(value.trim().toLowerCase())
  );
}

module.exports = isRdapRenewalGracePeriod;
