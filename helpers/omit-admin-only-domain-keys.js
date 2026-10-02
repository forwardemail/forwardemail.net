/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// settings only admins of a domain can change, and that may hold secrets
// (e.g. a token in the bounce webhook URL), are hidden from other members
// in API responses (every user is a virtual member of a global domain)
//
const ADMIN_ONLY_KEYS = [
  'bounce_webhook',
  'custom_verification',
  'allowlist',
  'denylist',
  'restricted_alias_names',
  's3_endpoint',
  's3_region',
  's3_bucket'
];

//
// The id of a member's user, whether it is populated or not (a bare ObjectId's
// `id` is its raw bytes, so it is not read)
//
function getMemberUserId(member) {
  const user = member?.user;
  if (!user) return null;
  if (typeof user === 'string') return user;
  if (user._id) return String(user._id);
  if (typeof user.id === 'string') return user.id;
  return null;
}

//
// `domain.group` is set by `retrieveDomains`, but a domain that was saved or
// fetched again afterwards (e.g. after an update) does not have it, so the
// admin membership of the user is also checked on the domain itself
//
function isDomainAdmin(domain, user) {
  if (domain?.group === 'admin') return true;
  if (!user || !Array.isArray(domain?.members)) return false;
  const userId = String(user._id || user.id);
  return domain.members.some(
    (member) => member?.group === 'admin' && getMemberUserId(member) === userId
  );
}

function omitAdminOnlyDomainKeys(data, domain, user) {
  if (!data || typeof data !== 'object' || isDomainAdmin(domain, user))
    return data;
  for (const key of ADMIN_ONLY_KEYS) delete data[key];
  return data;
}

module.exports = omitAdminOnlyDomainKeys;
module.exports.ADMIN_ONLY_KEYS = ADMIN_ONLY_KEYS;
module.exports.isDomainAdmin = isDomainAdmin;
module.exports.getMemberUserId = getMemberUserId;
