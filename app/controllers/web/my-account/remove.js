const Boom = require('@hapi/boom');

const { Users, Aliases } = require('#models');

async function remove(ctx) {
  const adminDomains = ctx.state.domains.filter(
    (domain) => domain.group === 'admin'
  );
  if (adminDomains.length > 0)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('ACCOUNT_DELETE_HAS_DOMAINS'))
    );
  // delete aliases
  await Aliases.deleteMany({
    user: ctx.state.user._id
  });
  // delete user
  await Users.findByIdAndRemove(ctx.state.user._id);
  // TODO: update domains 'members.user' with this uid (pull it)
  if (!ctx.api)
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('ACCOUNT_DELETE_SUCCESSFUL'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });
  const redirectTo = ctx.state.l('/logout');
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

module.exports = remove;
