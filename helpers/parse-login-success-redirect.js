const config = require('#config');
const { Users, Domains } = require('#models');

async function parseLoginSuccessRedirect(ctx) {
  let redirectTo = ctx.state.l(
    config.passportCallbackOptions.successReturnToOrRedirect
  );

  if (
    ctx.isAuthenticated() &&
    ctx.state.user[config.userFields.defaultDomain]
  ) {
    const domain = await Domains.findOne({
      _id: ctx.state.user[config.userFields.defaultDomain],
      'members.user': ctx.state.user.id
    })
      .lean()
      .exec();

    if (domain) {
      redirectTo = ctx.state.l(`/my-account/domains/${domain.name}`);
      if (domain.has_mx_record && domain.has_txt_record) {
        redirectTo += '/aliases';
      }
    } else {
      // remove the default domain from the user
      await Users.findByIdAndUpdate(ctx.state.user._id, {
        $unset: {
          [config.userFields.defaultDomain]: ''
        }
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
