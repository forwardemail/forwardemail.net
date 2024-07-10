/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');

const config = require('#config');

function createAliasForm(ctx, next) {
  //
  // if the domain is ubuntu.com and the user is in the user group
  // then don't allow them to create aliases (only manage/delete their own)
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

  ctx.state.breadcrumbHeaderCentered = true;
  ctx.state.breadcrumbs = [
    'my-account',
    'domains',
    {
      name: ctx.state.t('Add Alias')
    }
  ];
  return next();
}

module.exports = createAliasForm;
