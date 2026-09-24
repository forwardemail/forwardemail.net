/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { createHash, randomBytes } = require('node:crypto');

const ms = require('ms');

const config = require('#config');
const { encrypt, decrypt } = require('#helpers/encrypt-decrypt');

//
// One-time links to view a newly generated alias password.
//
// The password is NEVER put in an email, not even encrypted: the email only
// carries a random token, and the (encrypted) password is kept server-side
// in Redis under a hash of that token.  The entry is deleted when the link
// is claimed or when it expires, so an email left in an inbox holds nothing
// that can reveal the password afterwards.
//
const ALIAS_PASSWORD_LINK_TTL = ms('3d');
const TOKEN_REGEX = /^[\da-f]{64}$/;

function getKey(token) {
  const hash = createHash('sha256').update(token).digest('hex');
  return `alias_password_link:${config.env}:${hash}`;
}

//
// `userId` binds the link to the account that generated the password (the
// owner must be logged in as that user to claim it); `emailedInstructions`
// binds it to the address the instructions were emailed to instead.
//
async function createAliasPasswordLink(
  client,
  { domainId, aliasId, password, userId, emailedInstructions }
) {
  if (!userId && !emailedInstructions)
    throw new TypeError('User ID or emailed instructions required');

  const token = randomBytes(32).toString('hex');
  await client.set(
    getKey(token),
    JSON.stringify({
      domain_id: String(domainId),
      alias_id: String(aliasId),
      password: encrypt(password),
      ...(userId ? { user_id: String(userId) } : {}),
      ...(emailedInstructions
        ? { emailed_instructions: emailedInstructions }
        : {})
    }),
    'PX',
    ALIAS_PASSWORD_LINK_TTL
  );

  return `${config.urls.web}/ap/${token}`;
}

// read a link without claiming it (returns null when invalid or expired)
async function peekAliasPasswordLink(client, token) {
  if (typeof token !== 'string' || !TOKEN_REGEX.test(token)) return null;
  const value = await client.get(getKey(token));
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

// claim a link exactly once: returns the plaintext password, or null if the
// link was claimed by someone else in the meantime (or expired)
async function claimAliasPasswordLink(client, token) {
  if (typeof token !== 'string' || !TOKEN_REGEX.test(token)) return null;
  const [[getErr, value], [delErr, deleted]] = await client
    .multi()
    .get(getKey(token))
    .del(getKey(token))
    .exec();
  if (getErr) throw getErr;
  if (delErr) throw delErr;
  if (!value || deleted !== 1) return null;
  const record = JSON.parse(value);
  return decrypt(record.password);
}

module.exports = {
  ALIAS_PASSWORD_LINK_TTL,
  getAliasPasswordLinkKey: getKey,
  createAliasPasswordLink,
  peekAliasPasswordLink,
  claimAliasPasswordLink
};
