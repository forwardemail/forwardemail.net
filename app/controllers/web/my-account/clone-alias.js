/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const ms = require('ms');

const _ = require('#helpers/lodash');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const isValidPassword = require('#helpers/is-valid-password');
const { encrypt } = require('#helpers/encrypt-decrypt');
const { isClosedBeforeResponse } = require('#helpers/is-retryable-error');
const { getCloneStartingKey } = require('#helpers/clone-queue');
const { Aliases, Domains, SieveScripts } = require('#models');

//
// The settings a clone gets from the original alias (it has a name of its
// own, and the same owner and domain)
//
// (not its state: e.g. its storage used, backups, suspension, or the
// recipients that verified it, who are asked to verify the clone too)
//
const CLONED_FIELDS = [
  'description',
  'labels',
  'is_enabled',
  'error_code_if_disabled',
  'recipients',
  'has_recipient_verification',
  'max_quota',
  'smtp_limit',
  'vacation_responder',
  'has_pgp',
  'public_key',
  'has_smime',
  'smime_certificate',
  'has_wkd_disabled',
  'retention',
  'settings',
  'storage_location',
  // (its copy of the mailbox has the same migrations as the original)
  'has_storage_format_migration',
  'has_auto_vacuum_migration'
];

// (a Sieve script is copied as it is, see below)
const SIEVE_SCRIPT_OMITTED_FIELDS = [
  '_id',
  'id',
  'alias',
  'user',
  'created_at',
  'updated_at',
  '__v'
];

//
// Clone an alias: a new alias with the same settings and Sieve scripts (see
// #575).  An alias with a generated password needs it entered, and the
// clone signs in with it too.  An alias with IMAP turned on and a generated
// password also gets a copy of its mailbox (folders, messages, calendars and
// contacts) made by the sqlite-worker (see `clone` in helpers/worker.js):
// the new alias has IMAP turned off until its mailbox is in place, and its
// owner is emailed then.
//
// (the domain must be on a paid plan and not global, see the route)
//
async function cloneAlias(ctx) {
  const { domain } = ctx.state;
  const redirectTo = ctx.state.l(
    `/my-account/domains/${punycode.toASCII(domain.name)}/aliases`
  );

  const alias = await Aliases.findOne({
    _id: ctx.state.alias._id,
    domain: domain._id
  })
    .select('+tokens.hash +tokens.salt +tokens.has_pbkdf2_migration')
    .lean()
    .exec();

  //
  // only an admin of the domain or the owner of the alias may clone it (as
  // the route checks, see retrieve-alias.js and ensure-alias-admin.js)
  //
  if (
    !alias ||
    (domain.group !== 'admin' && String(alias.user) !== ctx.state.user.id)
  )
    throw Boom.notFound(ctx.translateError('ALIAS_DOES_NOT_EXIST'));

  // (the mailbox is opened with the password, so only then is it copied)
  const hasPassword = Array.isArray(alias.tokens) && alias.tokens.length > 0;
  const hasMailbox = hasPassword && alias.has_imap;

  if (alias.is_rekey)
    throw Boom.badRequest(ctx.translateError('ALIAS_REKEY_IN_PROGRESS'));

  // (a clone must not get around a suspension)
  if (alias.is_smtp_suspended || _.isDate(alias.smtp_suspended_sent_at))
    throw Boom.forbidden(ctx.translateError('ALIAS_CLONE_SUSPENDED'));

  //
  // as when creating an alias: members of the user group of a domain synced
  // with Ubuntu cannot create aliases (see create-alias.js)
  //
  if (
    domain.plan === 'team' &&
    domain.has_txt_record &&
    Object.keys(config.ubuntuTeamMapping).includes(domain.name)
  ) {
    const member = domain.members.find(
      (member) => member.user && member.user.id === ctx.state.user.id
    );
    if (!member) throw Boom.notFound(ctx.translateError('INVALID_USER'));
    if (member.group === 'user')
      throw Boom.notFound(ctx.translateError('UBUNTU_PERMISSIONS'));
  }

  // the name of the clone (validated with the alias, see below)
  const name = isSANB(ctx.request.body.name)
    ? ctx.request.body.name.trim().toLowerCase()
    : '';
  if (!name)
    throw Boom.badRequest(ctx.translateError('ALIAS_CLONE_NAME_REQUIRED'));

  // (nor a catch-all or regular expression, which have no mailbox and no
  // password)
  if (name.includes('*') || name.startsWith('/'))
    throw Boom.badRequest(ctx.translateError('ALIAS_CLONE_NAME_INVALID'));

  if (name.includes('+'))
    throw Boom.badRequest(ctx.translateError('ALIAS_WITH_PLUS_UNSUPPORTED'));

  //
  // the current password of the alias, if it has one (the clone signs in
  // with it, and the copy of its mailbox is encrypted with it), checked as
  // for a backup
  //
  let password;
  if (hasPassword) {
    if (!isSANB(ctx.request.body.password))
      throw Boom.badRequest(
        ctx.translateError('ALIAS_CLONE_PASSWORD_REQUIRED')
      );

    const authLimitKey = `auth_limit_${config.env}:${ctx.state.user.id}`;
    const count = await ctx.client.incrby(authLimitKey, 0);
    if (count >= config.smtpLimitAuth)
      throw Boom.forbidden(ctx.translateError('ALIAS_RATE_LIMITED'));

    password = ctx.request.body.password.trim();
    if (!(await isValidPassword(alias.tokens, password, alias))) {
      await ctx.client
        .pipeline()
        .incr(authLimitKey)
        .pexpire(authLimitKey, config.smtpLimitAuthDuration)
        .exec();
      throw Boom.forbidden(ctx.translateError('INVALID_PASSWORD'));
    }

    await ctx.client.del(authLimitKey);
  }

  //
  // the per-alias quota and SMTP limit are set by domain admins only (see
  // validate-alias.js), so the clone a member makes keeps a lower one than
  // new aliases get, never a higher one
  //
  const fields = _.pick(alias, CLONED_FIELDS);
  if (domain.group !== 'admin') {
    const [maxQuota, limits] = await Promise.all([
      Domains.getMaxQuota(domain._id),
      Domains.findById(domain._id)
        .select('alias_default_smtp_limit')
        .lean()
        .exec()
    ]);
    const defaultSmtpLimit = limits?.alias_default_smtp_limit;
    if (Number.isFinite(fields.max_quota) && fields.max_quota > maxQuota)
      delete fields.max_quota;
    if (defaultSmtpLimit > 0 && fields.smtp_limit > defaultSmtpLimit)
      fields.smtp_limit = defaultSmtpLimit;
  }

  //
  // until its job is queued, neither alias may get a new password (see
  // helpers/clone-queue.js): they are marked before the original is read
  // again, so a password change that started first is seen here, and one
  // that starts later sees the mark (see generate-alias-password.js)
  //
  const cloneId = new mongoose.Types.ObjectId();
  const startingKeys = hasMailbox
    ? [alias._id, cloneId].map((id) => getCloneStartingKey(id))
    : [];
  if (startingKeys.length > 0) {
    const pipeline = ctx.client.pipeline();
    for (const key of startingKeys)
      pipeline.set(key, `${alias._id}:${cloneId}`, 'PX', ms('2m'));
    await pipeline.exec();
  }

  let clone;
  let cloneUsername;
  let isQueued;
  // (whether the sqlite server may have queued the copy without saying so)
  let isUnconfirmed = false;
  try {
    if (startingKeys.length > 0) {
      const current = await Aliases.findById(alias._id)
        .select('is_rekey')
        .lean()
        .exec();
      if (!current)
        throw Boom.notFound(ctx.translateError('ALIAS_DOES_NOT_EXIST'));
      if (current.is_rekey)
        throw Boom.badRequest(ctx.translateError('ALIAS_REKEY_IN_PROGRESS'));
    }

    //
    // create the clone (validated like any new alias, e.g. its name must be
    // free and allowed for its owner), with IMAP off until a mailbox it
    // gets a copy of is in place (see helpers/worker.js)
    //
    // (the sqlite server checks the domain has room for the copy, see
    // `clone` in helpers/parse-payload.js)
    //
    clone = new Aliases({
      _id: cloneId,
      ...fields,
      name,
      user: alias.user,
      domain: alias.domain,
      has_imap: hasMailbox ? false : alias.has_imap,
      is_api: false
    });
    clone.locale = ctx.locale;
    if (hasPassword) await clone.createToken('', password);
    await clone.save();
    cloneUsername = `${clone.name}@${domain.name}`;

    try {
      // its Sieve scripts (copied as they are, like the mailbox)
      const scripts = await SieveScripts.find({ alias: alias._id })
        .lean()
        .exec();
      if (scripts.length > 0) {
        const now = new Date();
        await SieveScripts.collection.insertMany(
          scripts.map((script) => {
            const _id = new mongoose.Types.ObjectId();
            return {
              ..._.omit(script, SIEVE_SCRIPT_OMITTED_FIELDS),
              _id,
              id: _id.toString(),
              alias: clone._id,
              user: clone.user,
              created_at: now,
              updated_at: now
            };
          })
        );
      }

      // its mailbox (use the shared WebSocket on the API server, otherwise an
      // ephemeral one, as for a backup)
      if (hasMailbox) {
        const hasSharedWsp = Boolean(ctx.instance?.wsp);
        const wsp = hasSharedWsp
          ? ctx.instance.wsp
          : createWebSocketAsPromised();
        try {
          const result = await wsp.request(
            {
              action: 'clone',
              clone_alias_id: clone.id,
              clone_username: cloneUsername,
              email: ctx.state.user.email,
              // (well within the web request's own timeout: a request that runs
              // longer may still be queued, and its owner is told so below)
              timeout: ms('10s'),
              session: {
                user: {
                  id: alias._id.toString(),
                  username: `${alias.name}@${domain.name}`,
                  alias_id: alias._id.toString(),
                  alias_name: alias.name,
                  domain_id: domain.id,
                  domain_name: domain.name,
                  password: encrypt(password),
                  storage_location: alias.storage_location,
                  alias_has_pgp: alias.has_pgp,
                  alias_public_key: alias.public_key,
                  alias_has_smime: alias.has_smime,
                  alias_smime_certificate: alias.smime_certificate,
                  alias_has_wkd_disabled: alias.has_wkd_disabled,
                  locale: ctx.locale,
                  owner_full_email: ctx.state.user.email
                }
              }
            },
            // (not retried, it is started once)
            0
          );
          // (the data of the response)
          isQueued = result === true;
        } finally {
          if (!hasSharedWsp) {
            try {
              wsp.close();
            } catch (err) {
              ctx.logger.fatal(err);
            }
          }
        }

        // (no mailbox to copy: the original was never signed in to)
        if (!isQueued)
          await Aliases.findOneAndUpdate(
            { _id: clone._id, has_imap: false },
            { $set: { has_imap: true } }
          );
      }
    } catch (err) {
      //
      // the connection dropped after the request was sent (or no response came
      // in time), so the worker may be copying the mailbox into the clone: it
      // is kept, with IMAP off, and its owner is told how to tell
      //
      if (isClosedBeforeResponse(err)) {
        ctx.logger.fatal(err, { alias: alias._id, clone: clone._id });
        isUnconfirmed = true;
      } else {
        // nothing of a clone that could not be started is kept
        await SieveScripts.deleteMany({ alias: clone._id }).catch((err) =>
          ctx.logger.fatal(err)
        );
        await Aliases.findByIdAndRemove(clone._id).catch((err) =>
          ctx.logger.fatal(err)
        );
        throw err;
      }
    }
  } finally {
    // (the job is queued now, or it never will be)
    if (startingKeys.length > 0)
      await ctx.client
        .del(...startingKeys)
        .catch((err) => ctx.logger.fatal(err));
  }

  ctx.logger.debug('alias cloned', {
    alias: alias._id,
    clone: clone._id,
    domains: [domain._id]
  });

  if (isUnconfirmed)
    ctx.flash(
      'warning',
      ctx.translate(
        'ALIAS_CLONE_UNCONFIRMED',
        `${alias.name}@${domain.name}`,
        cloneUsername,
        cloneUsername
      )
    );
  else
    ctx.flash(
      'success',
      ctx.translate(
        isQueued
          ? 'ALIAS_CLONE_STARTED'
          : hasPassword
          ? 'ALIAS_CLONED'
          : 'ALIAS_CLONED_WITHOUT_PASSWORD',
        `${alias.name}@${domain.name}`,
        cloneUsername
      )
    );

  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

module.exports = cloneAlias;
