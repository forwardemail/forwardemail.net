const isSANB = require('is-string-and-not-blank');

const config = require('../config');
const { Domains } = require('../app/models');

async function parseLoginSuccessRedirect(ctx) {
  let redirectTo = ctx.state.l(
    config.passportCallbackOptions.successReturnToOrRedirect
  );

  if (
    ctx.isAuthenticated() &&
    isSANB(ctx.state.user[config.userFields.defaultDomain])
  ) {
    const domain = await Domains.findOne({
      name: ctx.state.user.default_domain,
      'members.user': ctx.state.user.id
    })
      .lean()
      .exec();

    ctx.logger.debug('parsed domain', { domain, user: ctx.state.user });

    if (domain) {
      redirectTo = ctx.state.l(`/my-account/domains/${domain.name}`);
    } else {
      ctx.flash('custom', {
        text: ctx.request.t('Your default domain does not exist!'),
        type: 'error',
        position: 'top',
        toast: true,
        showConfirmButton: false,
        timer: 3000
      });
    }
  }

  if (ctx.session && ctx.session.returnTo) {
    redirectTo = ctx.session.returnTo;
    delete ctx.session.returnTo;
  }

  return redirectTo;
}

module.exports = parseLoginSuccessRedirect;
