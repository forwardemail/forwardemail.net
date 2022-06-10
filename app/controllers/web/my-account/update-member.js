const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const { Domains } = require('#models');

async function updateMember(ctx, next) {
  // ctx.params.member_id
  if (!isSANB(ctx.params.member_id))
    return ctx.throw(Boom.notFound(ctx.translateError('INVALID_USER')));

  // ctx.request.body.group
  if (
    !isSANB(ctx.request.body.group) ||
    !['admin', 'user'].includes(ctx.request.body.group)
  )
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_GROUP')));

  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  if (!ctx.state.domain)
    return ctx.throw(
      Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
    );

  const match = ctx.state.domain.members.find(
    (member) => member.user.toString() === ctx.params.member_id
  );

  if (!match)
    return ctx.throw(Boom.notFound(ctx.translateError('INVALID_USER')));

  // swap the user group based off ctx.request.body.group
  // <https://github.com/Automattic/mongoose/issues/11522>
  ctx.state.domain.members = ctx.state.domain.members.map((member) => ({
    user: member.user,
    group:
      member.user.toString() === ctx.params.member_id
        ? ctx.request.body.group
        : member.group
  }));

  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain.client = ctx.client;
  ctx.state.domain = await ctx.state.domain.save();

  if (ctx.api) return next();

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

module.exports = updateMember;
