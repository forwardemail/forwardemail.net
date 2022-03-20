const Boom = require('@hapi/boom');
const _ = require('lodash');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const splitLines = require('split-lines');
const { boolean } = require('boolean');
const { isIP } = require('validator');

const toObject = require('#helpers/to-object');
const { Users, Domains, Aliases } = require('#models');

// eslint-disable-next-line complexity
async function createDomain(ctx, next) {
  if (!['GET', 'POST'].includes(ctx.method)) return next();

  if (ctx.method === 'GET') {
    ctx.state.breadcrumbHeaderCentered = true;
    ctx.state.breadcrumbs = [
      'my-account',
      {
        name: ctx.state.t('Domains'),
        header: ctx.state.t('Add Domain'),
        href: ctx.state.l('/my-account/domains')
      },
      {
        name: ctx.state.t('Add Domain')
      }
    ];
    if (ctx.api) return next();
    return ctx.render('my-account/domains/new');
  }

  if (
    !isSANB(ctx.request.body.domain) ||
    (!isFQDN(ctx.request.body.domain) && !isIP(ctx.request.body.domain))
  )
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_DOMAIN')));

  const match = ctx.state.domains.find(
    (domain) => domain.name === ctx.request.body.domain
  );

  if (match)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('DOMAIN_ALREADY_EXISTS'))
    );

  if (
    isSANB(ctx.request.body.plan) &&
    !['free', 'enhanced_protection', 'team'].includes(ctx.request.body.plan)
  )
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_PLAN')));

  // check if we're creating a default catchall
  const recipients = [ctx.state.user.email];

  if (_.isBoolean(ctx.request.body.catchall) && !ctx.request.body.catchall)
    recipients.pop();
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
      recipients.push(rcpt);
    }
  }

  const name = ctx.request.body.domain.trim().toLowerCase();

  let plan = ctx.state.user.plan || 'free';
  let redirectTo = ctx.state.l(`/my-account/domains/${name}`);

  // if the user was not on a valid plan then redirect them to billing post creation
  if (isSANB(ctx.request.body.plan)) {
    switch (ctx.request.body.plan) {
      case 'enhanced_protection': {
        if (['enhanced_protection', 'team'].includes(ctx.state.user.plan))
          plan = 'enhanced_protection';
        else
          redirectTo = ctx.state.l(
            `/my-account/domains/${name}/billing?plan=enhanced_protection`
          );

        break;
      }

      case 'team': {
        if (ctx.state.user.plan === 'team') {
          plan = 'team';
        } else {
          if (ctx.state.user.plan === 'enhanced_protection')
            plan = 'enhanced_protection';
          redirectTo = ctx.state.l(
            `/my-account/domains/${name}/billing?plan=team`
          );
        }

        break;
      }

      case 'free': {
        plan = 'free';

        break;
      }
      // No default
    }
  }

  try {
    ctx.state.domain = await Domains.create({
      is_api: boolean(ctx.api),
      members: [{ user: ctx.state.user._id, group: 'admin' }],
      name,
      is_global:
        ctx.state.user.group === 'admin' && boolean(ctx.request.body.is_global),
      locale: ctx.locale,
      plan,
      client: ctx.client
    });

    // create a default alias for the user pointing to the admin
    if (recipients.length > 0)
      await Aliases.create({
        is_api: boolean(ctx.api),
        user: ctx.state.user._id,
        domain: ctx.state.domain._id,
        name: '*',
        recipients,
        locale: ctx.locale
      });

    if (ctx.api) {
      ctx.state.domain = toObject(Domains, ctx.state.domain);
      ctx.state.domain.members[0].user = toObject(Users, ctx.state.user);
      return next();
    }

    // TODO: flash messages logic in @ladjs/assets doesn't support both
    // custom and regular flash message yet
    if (ctx.state.domain.name.startsWith('www.') && !ctx.api) {
      ctx.flash(
        'error',
        ctx
          .translate('WWW_WARNING')
          .replace(/example.com/g, ctx.state.domain.name.replace('www.', ''))
      );
    } else if (!ctx.api) {
      ctx.flash('custom', {
        title: ctx.request.t('Success'),
        text: ctx.translate('REQUEST_OK'),
        type: 'success',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        position: 'top'
      });
    }

    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.throw(Boom.badRequest(err));
  }
}

module.exports = createDomain;
