/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Domains = require('#models/domains');
const logger = require('#helpers/logger');

async function populateDomainStorage(d, locale) {
  if (!d._id) throw new TypeError('_id missing');
  if (d.is_global || d.plan === 'free') return d;
  try {
    const [storageUsed, storageUsedByAliases, maxQuotaPerAlias] =
      await Promise.all([
        Domains.getStorageUsed(d._id, locale),
        Domains.getStorageUsed(d._id, locale, true),
        Domains.getMaxQuota(d._id)
      ]);
    d.storage_used = storageUsed;
    d.storage_used_by_aliases = storageUsedByAliases;
    d.storage_quota = maxQuotaPerAlias;
  } catch (err) {
    logger.fatal(err);
  }

  return d;
}

module.exports = populateDomainStorage;
