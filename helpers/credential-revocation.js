/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
const ms = require('ms');
const sharedConfig = require('@ladjs/shared-config');

const config = require('#config');
const logger = require('#helpers/logger');
const { encoder } = require('#helpers/encoder-decoder');

//
// Revoking access that was granted before credentials changed.
//
// An open WebSocket was authenticated once, when it connected, and a cached
// login (helpers/on-auth.js) was checked when it was cached, so a password or
// API token change has to reach both explicitly.  A revocation:
//
//   1. records the revocation time (Redis TIME, so every server compares
//      against one clock) for each subject, and then
//   2. publishes it, so every API server closes the matching sockets.
//
// Subjects are what a grant depends on:
//
//   alias:<id>    the alias's passwords (changed, alias disabled or moved)
//   account:<id>  the user's account (banned or removed)
//   token:<id>    the user's API token and the domain access it carries
//                 (token changed or disabled, member removed or demoted)
//
// A grant records the Redis time before its credentials are checked.  A
// WebSocket, after it is registered (so a published revocation would reach
// it), and a cached login, when it is used, are refused if one of their
// subjects was revoked at or after that time.  One of the two always catches
// a revocation that races a handshake: either the revocation was recorded
// before the check reads it, or it is published after the socket was
// registered.
//
// Records only need to outlive the grants they can refuse: a cached login
// lives for one minute, and a WebSocket authentication times out after ten
// seconds.
//
const REVOCATION_TTL_MS = ms('10m');

// application close code sent to a socket whose credentials changed
const CLOSE_CODE_REVOKED = 4001;

const SUBJECT_TYPES = {
  aliasIds: 'alias',
  accountIds: 'account',
  tokenIds: 'token'
};

const SUBJECT_REGEX = /^(?:alias|account|token):[\da-f]{24}$/i;

function getKey(subject) {
  return `auth_revoked:${config.env}:${subject}`;
}

function toIds(values) {
  const ids = new Set();
  for (const value of Array.isArray(values) ? values : [values]) {
    if (!value) continue;
    const id = typeof value === 'string' ? value : value.toString();
    if (mongoose.isObjectIdOrHexString(id)) ids.add(id);
  }

  return [...ids];
}

// e.g. { aliasIds: [a], accountIds: [u] } -> ['alias:a', 'account:u']
function getSubjects(ids = {}) {
  const subjects = [];
  for (const [field, type] of Object.entries(SUBJECT_TYPES)) {
    for (const id of toIds(ids[field])) subjects.push(`${type}:${id}`);
  }

  return subjects;
}

function isSubject(value) {
  return typeof value === 'string' && SUBJECT_REGEX.test(value);
}

// Current Redis server time in microseconds.
async function getRedisTime(client) {
  const [seconds, microseconds] = await client.time();
  const time = Number(seconds) * 1e6 + Number(microseconds);
  if (!Number.isSafeInteger(time) || time <= 0)
    throw new TypeError('Invalid Redis time');
  return time;
}

async function revokeAccess(client, ids) {
  if (!client) return;
  const subjects = getSubjects(ids);
  if (subjects.length === 0) return;

  const now = String(await getRedisTime(client));
  const multi = client.multi();
  for (const subject of subjects)
    multi.set(getKey(subject), now, 'PX', REVOCATION_TTL_MS);
  await multi.exec();

  await client.publishBuffer(
    config.WS_REDIS_CHANNEL_NAME,
    encoder.pack({ revoke: { subjects } })
  );
}

// Never throws (revocation must not break the write that triggered it).
async function revokeAccessSafely(client, ids) {
  try {
    await revokeAccess(client, ids);
  } catch (err) {
    logger.error(err, { extra: { message: 'Credential revocation failed' } });
  }
}

// Whether any of the subjects was revoked at or after `since` (Redis time in
// microseconds).  No valid time or no subjects counts as revoked.
async function isRevokedSince(client, subjects, since) {
  if (!Number.isSafeInteger(since) || since <= 0) return true;
  const valid = (Array.isArray(subjects) ? subjects : []).filter((subject) =>
    isSubject(subject)
  );
  if (valid.length === 0) return true;
  const values = await client.mget(valid.map((subject) => getKey(subject)));
  return values.some((value) => value !== null && Number(value) >= since);
}

//
// Model hooks (a password or API token change saved anywhere) use the
// process's own Redis client when it registered one (the API server does),
// or else one lazily created connection.
//
let modelClient;

function useRevocationClient(client) {
  modelClient = client;
}

function revokeFromModel(ids) {
  if (!modelClient) modelClient = new Redis(sharedConfig('BREE').redis, logger);
  return revokeAccessSafely(modelClient, ids);
}

//
// The same for writes that bypass document middleware (`updateOne`,
// `updateMany`, `findOneAndUpdate`/`findByIdAndUpdate`).  `getRevocation`
// looks at the updated paths and returns the revocation fields
// ({ aliasIds: true, ... }) or null; the matching documents are collected
// before the write and revoked after it.
//
function getUpdatedPaths(update) {
  const paths = new Map();
  if (!update || typeof update !== 'object') return paths;
  for (const [key, value] of Object.entries(update)) {
    if (key.startsWith('$')) {
      if (value && typeof value === 'object')
        for (const [path, pathValue] of Object.entries(value))
          paths.set(path, { operator: key, value: pathValue });
    } else {
      paths.set(key, { operator: '$set', value });
    }
  }

  return paths;
}

function addRevocationQueryHooks(schema, getRevocation) {
  for (const operation of ['updateOne', 'updateMany', 'findOneAndUpdate']) {
    schema.pre(operation, async function () {
      this._revokeAccess = null;
      const fields = getRevocation(getUpdatedPaths(this.getUpdate()));
      if (!fields) return;
      const ids = await this.model.distinct('_id', this.getFilter());
      if (ids.length > 0) this._revokeAccess = { fields, ids };
    });

    schema.post(operation, async function () {
      const revoke = this._revokeAccess;
      if (!revoke) return;
      this._revokeAccess = null;
      const ids = {};
      for (const field of Object.keys(revoke.fields)) ids[field] = revoke.ids;
      await revokeFromModel(ids);
    });
  }
}

module.exports = {
  addRevocationQueryHooks,
  CLOSE_CODE_REVOKED,
  REVOCATION_TTL_MS,
  getRedisTime,
  getSubjects,
  isRevokedSince,
  isSubject,
  revokeAccess,
  revokeAccessSafely,
  revokeFromModel,
  useRevocationClient
};
