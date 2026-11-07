/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// One-time migration of the account secrets stored before they were
// protected at rest (see the last `pre('save')` hook in app/models/users.js):
//
// - the API token, the two-factor secret and recovery keys, the email change
//   link token and the verification code are encrypted with
//   HELPER_ENCRYPTION_KEY (the API token also gets the digest it is found by)
// - the password reset token is replaced by its digest (a reset link already
//   sent keeps working)
// - a pending account update about the API token keeps a digest of the
//   token in place of the token (it is only ever shown as redacted)
//
// The app reads both forms, and encrypts a secret whenever it sets one. Run
// this once the release is deployed to every server (web, API, and the
// others): a server still on the release before cannot read what this
// writes. It writes to the collection directly, so no hooks run: no email is
// sent, and no session or token is revoked. It is safe to run again, and a
// value changed by the app meanwhile is left alone (run it again).
//
// To roll the release back, run `--revert`, deploy the release before, then
// run `--revert` again (for what the app wrote in between): it decrypts the
// values, removes the API token digests and clears pending password resets (a
// digest cannot be turned back into its token; the user asks for a new link).
//
// It stops if HELPER_ENCRYPTION_KEY is not the key the app uses: it is
// checked first against a domain webhook key (which the app encrypts with
// it), and against every encrypted value read.
//
// Usage:
//   node scripts/encrypt-user-secrets.js --dry-run   # report only
//   node scripts/encrypt-user-secrets.js             # apply
//   node scripts/encrypt-user-secrets.js --revert    # undo (before a rollback)
//

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');

const config = require('#config');
const env = require('#config/env');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const {
  encrypt,
  decryptIfEncrypted,
  hashToken
} = require('#helpers/encrypt-decrypt');

const Domains = require('#models/domains');
const Users = require('#models/users');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

const DRY_RUN = process.argv.includes('--dry-run');
const REVERT = process.argv.includes('--revert');
const BATCH_SIZE = 500;

const {
  apiToken,
  apiTokenHash,
  otpRecoveryKeys,
  resetToken,
  resetTokenExpiresAt,
  changeEmailToken,
  verificationPin,
  accountUpdates
} = config.userFields;
const { otpToken } = config.passport.fields;

const ENCRYPTED_FIELDS = [
  apiToken,
  otpToken,
  changeEmailToken,
  verificationPin
];

// (as `getResetTokenQuery` in app/controllers/web/auth.js)
const isDigest = (value) => /^[\da-f]{64}$/i.test(value);

const isEncrypted = (value) =>
  isSANB(value) && decryptIfEncrypted(value) !== value;

// (no plaintext secret is this long, see `getChanges`)
function checkKey(value) {
  if (isSANB(value) && /^[\w-]{40,}$/.test(value) && !isEncrypted(value))
    throw new Error(
      'A value looks encrypted but does not decrypt: is HELPER_ENCRYPTION_KEY the one the app uses?'
    );
}

function encryptValue(value) {
  return isSANB(value) && !isEncrypted(value) ? encrypt(value) : value;
}

function getChanges(user) {
  const $set = {};
  const $unset = {};

  for (const field of ENCRYPTED_FIELDS) checkKey(user[field]);
  if (Array.isArray(user[otpRecoveryKeys]))
    for (const key of user[otpRecoveryKeys]) checkKey(key);

  if (REVERT) {
    for (const field of ENCRYPTED_FIELDS) {
      if (isEncrypted(user[field]))
        $set[field] = decryptIfEncrypted(user[field]);
    }

    if (
      Array.isArray(user[otpRecoveryKeys]) &&
      user[otpRecoveryKeys].some((key) => isEncrypted(key))
    )
      $set[otpRecoveryKeys] = user[otpRecoveryKeys].map((key) =>
        decryptIfEncrypted(key)
      );

    if (user[apiTokenHash] !== undefined) $unset[apiTokenHash] = 1;

    if (isSANB(user[resetToken]) && isDigest(user[resetToken])) {
      $unset[resetToken] = 1;
      $unset[resetTokenExpiresAt] = 1;
    }

    return { $set, $unset };
  }

  for (const field of ENCRYPTED_FIELDS) {
    const value = encryptValue(user[field]);
    if (value !== user[field]) $set[field] = value;
  }

  if (Array.isArray(user[otpRecoveryKeys])) {
    const keys = user[otpRecoveryKeys].map((key) => encryptValue(key));
    if (keys.some((key, i) => key !== user[otpRecoveryKeys][i]))
      $set[otpRecoveryKeys] = keys;
  }

  // (as `getApiTokenHash` in app/models/users.js)
  const token = decryptIfEncrypted(user[apiToken]);
  const hash = isSANB(token)
    ? hashToken(token.trim().toLowerCase())
    : undefined;
  if (hash && user[apiTokenHash] !== hash) $set[apiTokenHash] = hash;

  if (isSANB(user[resetToken]) && !isDigest(user[resetToken]))
    $set[resetToken] = hashToken(user[resetToken]);

  if (
    Array.isArray(user[accountUpdates]) &&
    user[accountUpdates].some(
      (update) =>
        update?.fieldName === apiToken &&
        ((isSANB(update.current) && !isDigest(update.current)) ||
          (isSANB(update.previous) && !isDigest(update.previous)))
    )
  )
    $set[accountUpdates] = user[accountUpdates].map((update) =>
      update?.fieldName === apiToken
        ? {
            ...update,
            current:
              isSANB(update.current) && !isDigest(update.current)
                ? hashToken(update.current)
                : update.current,
            previous:
              isSANB(update.previous) && !isDigest(update.previous)
                ? hashToken(update.previous)
                : update.previous
          }
        : update
    );

  return { $set, $unset };
}

(async () => {
  try {
    if (!env.HELPER_ENCRYPTION_KEY)
      throw new Error('HELPER_ENCRYPTION_KEY is not set');

    await setupMongoose(logger);

    const domain = await Domains.collection.findOne(
      { webhook_key: { $regex: /^[\w-]{40,}$/ } },
      { projection: { webhook_key: 1 } }
    );
    if (domain) checkKey(domain.webhook_key);

    // (the app builds this index on start, this is in case it has not yet)
    if (!REVERT && !DRY_RUN)
      await Users.collection.createIndex({ [apiTokenHash]: 1 });

    const fields = [
      ...ENCRYPTED_FIELDS,
      otpRecoveryKeys,
      apiTokenHash,
      resetToken,
      resetTokenExpiresAt,
      accountUpdates
    ];

    const counts = { scanned: 0, changed: 0, modified: 0, skipped: 0 };
    let operations = [];

    const flush = async () => {
      if (operations.length === 0) return;
      const result = await Users.collection.bulkWrite(operations, {
        ordered: false
      });
      counts.modified += result.modifiedCount;
      counts.skipped += operations.length - result.modifiedCount;
      operations = [];
    };

    for await (const user of Users.collection.find(
      {},
      {
        projection: Object.fromEntries(fields.map((field) => [field, 1])),
        noCursorTimeout: true
      }
    )) {
      counts.scanned++;
      const { $set, $unset } = getChanges(user);
      const changed = [...Object.keys($set), ...Object.keys($unset)];
      if (changed.length === 0) continue;
      counts.changed++;
      if (DRY_RUN) continue;

      //
      // (only if each changed value is still what was read, so a value the
      // app changed meanwhile is not overwritten)
      //
      const filter = { _id: user._id };
      for (const field of changed) {
        filter[field] =
          user[field] === undefined ? { $exists: false } : user[field];
      }

      const update = {};
      if (Object.keys($set).length > 0) update.$set = $set;
      if (Object.keys($unset).length > 0) update.$unset = $unset;
      operations.push({ updateOne: { filter, update } });
      if (operations.length >= BATCH_SIZE) await flush();
    }

    await flush();

    console.log(
      `${REVERT ? 'Revert' : 'Encrypt'}${DRY_RUN ? ' (dry run)' : ''}: ` +
        `scanned ${counts.scanned}, to change ${counts.changed}` +
        (DRY_RUN
          ? ''
          : `, changed ${counts.modified}, changed meanwhile (run again) ${counts.skipped}`)
    );

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
