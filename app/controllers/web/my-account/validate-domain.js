const Boom = require('@hapi/boom');
const _ = require('lodash');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const splitLines = require('split-lines');
const { boolean } = require('boolean');
const { isIP } = require('validator');

// eslint-disable-next-line complexity
async function validateDomain(ctx, next) {
  if (
    !isSANB(ctx.request.body.domain) ||
    (!isFQDN(ctx.request.body.domain) && !isIP(ctx.request.body.domain))
  )
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_DOMAIN')));

  // trim and convert to lowercase the domain name
  ctx.request.body.domain = ctx.request.body.domain.trim().toLowerCase();

  const match = ctx.state.domains.find(
    (domain) => domain.name === ctx.request.body.domain
  );

  if (match)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('DOMAIN_ALREADY_EXISTS'))
    );

  if (isSANB(ctx.request.body.plan)) {
    if (
      !['free', 'enhanced_protection', 'team'].includes(ctx.request.body.plan)
    )
      return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_PLAN')));
  } else {
    ctx.request.body.plan = ctx.state.user.plan || 'free';
  }

  // check if we're creating a default catchall
  ctx.state.recipients = [ctx.state.user.email];

  if (_.isBoolean(ctx.request.body.catchall) && !ctx.request.body.catchall)
    ctx.state.recipients.pop();
  else if (isSANB(ctx.request.body.catchall)) {
    const rcpts = _.compact(
      _.uniq(
        _.map(
          splitLines(ctx.request.body.catchall)
            .join(' ')
            .split(',')
            .join(' ')
            .split(' '),
          (recipient) => recipient.trim()
        )
      )
    );
    for (const rcpt of rcpts) {
      ctx.state.recipients.push(rcpt);
    }
  }

  ctx.state.redirectTo = ctx.state.l(
    `/my-account/domains/${ctx.request.body.domain}`
  );

  // if the user was not on a valid plan then redirect them to billing post creation
  if (isSANB(ctx.request.body.plan)) {
    switch (ctx.request.body.plan) {
      case 'enhanced_protection': {
        if (!['enhanced_protection', 'team'].includes(ctx.state.user.plan)) {
          ctx.request.body.plan = 'free';
          ctx.state.redirectTo = ctx.state.l(
            `/my-account/domains/${ctx.request.body.domain}/billing?plan=enhanced_protection`
          );
        }

        break;
      }

      case 'team': {
        if (ctx.state.user.plan !== 'team') {
          ctx.request.body.plan =
            ctx.state.user.plan === 'enhanced_protection'
              ? 'enhanced_protection'
              : 'free';
          ctx.state.redirectTo = ctx.state.l(
            `/my-account/domains/${ctx.request.body.domain}/billing?plan=team`
          );
        }

        break;
      }

      // No default
    }
  }

  // Boolean settings for spam and requiring recipient verification
  ctx.state.optionalBooleans = {};
  for (const bool of [
    'has_adult_content_protection',
    'has_phishing_protection',
    'has_executable_protection',
    'has_virus_protection',
    'has_recipient_verification'
  ]) {
    if (_.isBoolean(ctx.request.body[bool]) || isSANB(ctx.request.body[bool]))
      ctx.state.optionalBooleans[bool] = boolean(ctx.request.body[bool]);
  }

  return next();
}

module.exports = validateDomain;
