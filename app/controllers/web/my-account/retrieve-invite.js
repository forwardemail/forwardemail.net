const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const { Domains } = require('#models');

async function retrieveInvite(ctx) {
  if (!isSANB(ctx.params.domain_id))
    return ctx.throw(
      Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
    );

  const domain = await Domains.findOne({
    $or: [
      {
        id: ctx.params.domain_id,
        'invites.email': ctx.state.user.email
      },
      {
        id: ctx.params.domain_id,
        'members.user': ctx.state.user._id
      }
    ]
  });

  if (!domain)
    return ctx.throw(
      Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
    );

  // convert invitee to a member with the same group as invite had
  const invite = domain.invites.find(
    (invite) => invite.email === ctx.state.user.email
  );

  let group = 'user';

  if (invite) {
    ({ group } = invite);
    domain.members.push({
      user: ctx.state.user._id,
      group
    });

    // remove invitee from invites list
    domain.invites = domain.invites.filter(
      (invite) => invite.email !== ctx.state.user.email
    );

    // save domain
    domain.locale = ctx.locale;
    domain.skip_verification = true;
    ctx.state.domain = await domain.save();
  } else {
    const match = domain.members.find(
      (member) => member._id.toString() === ctx.state.user.id
    );
    group = match && match.group === 'admin' ? 'admin' : 'user';
  }

  // flash a message to the user telling them they've successfully accepted
  const message =
    group === 'admin'
      ? ctx.translate('INVITE_ACCEPTED_ADMIN')
      : ctx.translate('INVITE_ACCEPTED_USER');

  // edge case if it was an API request to simply send a string in the body
  if (ctx.api) {
    ctx.body = message;
    return;
  }

  ctx.flash('success', message);

  // redirect user to either alias page (if user) or admin page (if admin)
  const redirectTo =
    group === 'admin'
      ? ctx.state.l(`/my-account/domains/${domain.name}`)
      : ctx.state.l(`/my-account/domains/${domain.name}/aliases`);

  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

module.exports = retrieveInvite;
