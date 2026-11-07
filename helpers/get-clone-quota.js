/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const mongoose = require('mongoose');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');

//
// Whether a domain has room for a copy of the mailbox of one of its aliases
// (see #575): the copy counts toward the domain's storage like the original
// (as `Aliases.isOverQuota` counts it), so every mailbox of the domain would
// be over quota once it is copied otherwise.
//
// Resolves with the mailbox's storage used (`size`), the storage left on the
// domain (`left`) and whether the copy fits (`hasRoom`).
//
async function getCloneQuota(aliasId, domainId, locale) {
  // (an ObjectId: the domain's storage is summed with an aggregation)
  const _id = new mongoose.Types.ObjectId(domainId);
  const [alias, storageUsed, maxQuota] = await Promise.all([
    Aliases.findById(aliasId).select('storage_used').lean().exec(),
    Domains.getStorageUsed(_id, locale, true),
    Domains.getMaxQuota(_id)
  ]);
  const size = typeof alias?.storage_used === 'number' ? alias.storage_used : 0;
  return {
    size,
    left: Math.max(0, maxQuota - storageUsed),
    hasRoom: storageUsed + size <= maxQuota
  };
}

module.exports = getCloneQuota;
