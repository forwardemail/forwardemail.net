const { Domains, Aliases } = require('#models');

async function removeDomain(ctx, next) {
  // remove all aliases
  await Aliases.deleteMany({
    domain: ctx.state.domain._id
  });
  // remove the domain
  await Domains.findByIdAndRemove(ctx.state.domain._id);
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
  const redirectTo = ctx.state.l('/my-account/domains');
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

module.exports = removeDomain;
