/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');

const abusePreventionByUserId = require('#helpers/abuse-prevention-by-user-id');
// const { removeAliasBackup } = require('#helpers/remove-alias-backup');
const config = require('#config');
const { Aliases } = require('#models');

async function removeAlias(ctx, next) {
  // TODO: clean up this later
  //
  // if the domain is ubuntu.com and the user is in the user group
  // then don't allow them to delete aliases (since sync job would re-create)
  //
  if (
    ctx.state.domain.plan === 'team' &&
    ctx.state.domain.has_txt_record &&
    Object.keys(config.ubuntuTeamMapping).includes(ctx.state.domain.name)
  ) {
    const member = ctx.state.domain.members.find(
      (member) => member.user && member.user.id === ctx.state.user.id
    );

    if (!member) throw Boom.notFound(ctx.translateError('INVALID_USER'));

    if (member.group === 'user')
      throw Boom.notFound(ctx.translateError('UBUNTU_PERMISSIONS'));
  }

  //
  // abuse prevention (need to wait at least 5 days if any payments made)
  //
  await abusePreventionByUserId(ctx);

  // NOTE: currently commented out until we're certain this works well
  // Clean up R2 backup files for this alias before deletion
  // try {
  //   await removeAliasBackup(ctx.state.alias);
  // } catch (err) {
  //   // Log error but don't fail the alias removal
  //   ctx.logger.error('Failed to remove R2 backup files', {
  //     error: err,
  //     aliasId: ctx.state.alias._id,
  //     storageLocation: ctx.state.alias.storage_location
  //   });
  // }

  await Aliases.findByIdAndRemove(ctx.state.alias._id);
  if (!ctx.api)
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('REQUEST_OK'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });
  if (ctx.api) return next();
  const redirectTo = ctx.state.l(
    `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases`
  );
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

module.exports = removeAlias;
