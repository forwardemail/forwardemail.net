/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const _ = require('#helpers/lodash');
const config = require('#config');
const emailHelper = require('#helpers/email');
const getAliasPasswordsNotice = require('#helpers/get-alias-passwords-notice');
const i18n = require('#helpers/i18n');
const { Aliases, Domains, Emails, SieveScripts, Users } = require('#models');

// (as helpers/transfer-domain.js: mail not yet sent goes with the alias)
const UNSENT = ['pending', 'queued', 'deferred'];

// Tell a member, in their language, that an alias is theirs now (and that
// its passwords still work), or no longer is.
async function notify(userId, phrase, alias, username) {
  const user = await Users.findById(userId)
    .select(`email ${config.lastLocaleField} ${config.userFields.isBanned}`)
    .lean()
    .exec();
  if (!user || user[config.userFields.isBanned] || !isSANB(user.email)) return;
  const locale = user[config.lastLocaleField] || i18n.config.defaultLocale;
  const notice = alias
    ? await getAliasPasswordsNotice(
        { translate: (phrase) => i18n.translate(phrase, locale) },
        [alias]
      )
    : '';
  await emailHelper({
    template: 'alert',
    message: { to: user.email },
    locals: {
      locale,
      message: `<p class="font-weight-bold">${i18n.translate(
        phrase,
        locale
      )}</p><ul class="mb-0 text-left"><li>${_.escape(
        username
      )}</li></ul>${notice}`
    }
  });
}

//
// An admin of a domain on the team plan gives one of its aliases to another
// of its members, or takes it (as when a member is removed, see
// remove-member.js, but for one alias and to any member).
//
// The alias is saved, so its new owner is checked like the owner of a new
// alias (see the `pre('save')` hooks of app/models/aliases.js): a member of
// the domain who is not banned, and an admin for a catch-all, a regular
// expression or a reserved name. Saving it also signs out the sessions
// opened with its passwords and removes the push tokens of its past owner.
// Its passwords stay (its mailbox is encrypted with them), which the admin
// and the new owner are told.
//
async function changeAliasOwner(ctx) {
  const { domain } = ctx.state;
  const redirectTo = ctx.state.l(
    `/my-account/domains/${punycode.toASCII(domain.name)}/aliases`
  );

  //
  // only an admin of the domain (as the route checks), and not of a global
  // domain, whose aliases belong to users who are not its members, nor of a
  // domain synced with Ubuntu, whose aliases follow its memberships
  //
  if (
    domain.group !== 'admin' ||
    domain.plan !== 'team' ||
    domain.is_global ||
    (domain.has_txt_record &&
      Object.keys(config.ubuntuTeamMapping).includes(domain.name))
  )
    throw Boom.forbidden(ctx.translateError('ALIAS_OWNER_CHANGE_NOT_ALLOWED'));

  // the new owner: a member of the domain (banned members are left out of
  // `domain.members`, see retrieve-domains.js)
  const id = ctx.request.body.user;
  if (!isSANB(id)) throw Boom.badRequest(ctx.translateError('INVALID_MEMBER'));
  const member = domain.members.find(
    (member) => member.user && member.user.id === id
  );
  if (!member) throw Boom.notFound(ctx.translateError('INVALID_MEMBER'));

  const alias = await Aliases.findOne({
    _id: ctx.state.alias._id,
    domain: domain._id
  });
  if (!alias) throw Boom.notFound(ctx.translateError('ALIAS_DOES_NOT_EXIST'));

  // (its owner is emailed when a password change is done)
  if (alias.is_rekey)
    throw Boom.conflict(ctx.translateError('ALIAS_REKEY_IN_PROGRESS'));

  const previousOwner = alias.user;
  const isChanged = String(previousOwner) !== member.user.id;
  if (isChanged) {
    alias.user = member.user._id;
    alias.locale = ctx.locale;
    alias.is_update = true;
    await alias.save();

    //
    // a member removed while this was saved keeps no alias: their aliases
    // were listed for the admin who removed them before this one was theirs
    //
    const isMember = await Domains.exists({
      _id: domain._id,
      'members.user': member.user._id
    });
    if (!isMember) {
      await Aliases.updateOne(
        { _id: alias._id, user: member.user._id },
        { $set: { user: previousOwner } }
      );
      throw Boom.notFound(ctx.translateError('INVALID_MEMBER'));
    }

    await Promise.all([
      SieveScripts.updateMany(
        { alias: alias._id },
        { $set: { user: member.user._id } }
      ),
      Emails.updateMany(
        { alias: alias._id, status: { $in: UNSENT } },
        { $set: { user: member.user._id } }
      )
    ]);

    ctx.logger.info('alias owner changed', {
      alias: alias.id,
      domain: domain.id,
      previous_owner: String(previousOwner),
      owner: member.user.id
    });

    // the passwords generated for the alias still work
    const notice = await getAliasPasswordsNotice(ctx, [alias]);
    if (notice) ctx.flash('info', notice);

    // tell its new owner and its past one (in the background)
    const username = `${alias.name}@${domain.name}`;
    const jobs = [];
    if (member.user.id !== ctx.state.user.id)
      jobs.push(
        notify(member.user._id, 'REASSIGNED_ALIAS_OWNERSHIP', alias, username)
      );
    if (String(previousOwner) !== ctx.state.user.id)
      jobs.push(
        notify(previousOwner, 'REASSIGNED_ALIASES_FROM_OWNER', null, username)
      );
    Promise.all(jobs)
      .then()
      .catch((err) => ctx.logger.fatal(err));
  }

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

module.exports = changeAliasOwner;
