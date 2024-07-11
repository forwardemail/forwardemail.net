/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');

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

    if (!member)
      return ctx.throw(Boom.notFound(ctx.translateError('INVALID_USER')));

    if (member.group === 'user')
      return ctx.throw(Boom.notFound(ctx.translateError('UBUNTU_PERMISSIONS')));
  }

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
    `/my-account/domains/${ctx.state.domain.name}/aliases`
  );
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

module.exports = removeAlias;
