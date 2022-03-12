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

  const member = ctx.state.domain.members.find(
    (member) => member.user.id === ctx.params.member_id
  );

  if (!member)
    return ctx.throw(Boom.notFound(ctx.translateError('INVALID_USER')));

  const domain = await Domains.findById(ctx.state.domain._id);

  if (!domain)
    return ctx.throw(
      Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
    );

  // swap the user group based off ctx.request.body.group
  domain.members = domain.members.map((member) => ({
    ...member.toObject(),
    group:
      member.user.toString() === ctx.params.member_id
        ? ctx.request.body.group
        : member.group
  }));

  domain.locale = ctx.locale;
  domain.client = ctx.client;
  ctx.state.domain = await domain.save();

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
