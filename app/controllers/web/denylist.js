/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const dayjs = require('dayjs-with-plugins');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const { boolean } = require('boolean');
const { isIP } = require('@forwardemail/validator');

const isEmail = require('#helpers/is-email');
const config = require('#config');
const email = require('#helpers/email');
const decrypt = require('#helpers/encrypt-decrypt');
const { Inquiries } = require('#models');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseRootDomain = require('#helpers/parse-root-domain');
const isAllowlistTld = require('#helpers/is-allowlist-tld');

async function validate(ctx, next) {
  //
  // ctx.request.body.q
  // IP, FQDN, Email, or encrypted value
  // check against redis to ensure it's listed in denylist
  //
  if (!isSANB(ctx.request.body.q))
    throw Boom.badRequest(ctx.translateError('INVALID_DENYLIST_VALUE'));

  // safeguard in case we render email links wrong for admins in future
  if (
    ctx.state.user.group === 'admin' &&
    isSANB(ctx.request.body.email) &&
    !isEmail(ctx.request.body.email)
  )
    throw Boom.badRequest(ctx.translateError('INVALID_EMAIL'));

  let { q } = ctx.request.body;

  // normalize by converting to lowercase and trimming
  q = q.toLowerCase().trim();

  if (!isFQDN(q) && !isIP(q) && !isEmail(q)) {
    // check if it was encrypted value and can be decrypted without error
    // and the decrypted value is a FQDN, IP, or Email
    // otherwise throw the same error as above
    try {
      q = decrypt(q);
      ctx.state.isEncrypted = true;
    } catch (err) {
      ctx.logger.warn(err);
      throw Boom.badRequest(ctx.translateError('INVALID_DENYLIST_VALUE'));
    }

    if (!isFQDN(q) && !isIP(q) && !isEmail(q))
      throw Boom.badRequest(ctx.translateError('INVALID_DENYLIST_VALUE'));
  }

  // if the value was an IP address then check against backscatter
  // and if it was listed in backscatter then prevent the user
  if (isIP(q)) {
    const isBackscatter = await ctx.client.get(`backscatter:${q}`);
    if (boolean(isBackscatter))
      throw Boom.badRequest(ctx.translateError('BACKSCATTER', q, q, q));
  }

  // set the root domain value in state for validate fn
  if (isEmail(q) || isFQDN(q)) ctx.state.rootDomain = parseRootDomain(q);

  // check that the value is in the denylist
  // (or the root value is in the denylist)
  let result = false;
  try {
    result = await ctx.client.get(`denylist:${q}`);
    if (!result || !boolean(result)) {
      // if the value was not === "true" then we have to clean it up
      if (result) {
        ctx.client
          .del(`denylist:${q}`)
          .then()
          .catch((err) => ctx.logger.fatal(err));
        result = false;
      }

      //
      // check the root value in the denylist if it was an email or fqdn
      // (and if it was an email then also check denylist:domain:email combo)
      //
      if (
        ctx.state.rootDomain && // if it was an email or if the root domain value was different
        // then we need to check denylist against root value and if it was an email
        // then we need to check the combo of denylist:root:email
        (isEmail(q) || ctx.state.rootDomain !== q)
      ) {
        result = await ctx.client.get(`denylist:${ctx.state.rootDomain}`);

        if (!result || !boolean(result)) {
          // if the value was not === "true" then we have to clean it up

          if (result) {
            ctx.client
              .del(`denylist:${ctx.state.rootDomain}`)
              .then()
              .catch((err) => ctx.logger.fatal(err));
            result = false;
          }

          // if it was an email then check `denylist:root:email` combo

          if (isEmail(q)) {
            result = await ctx.client.get(
              `denylist:${ctx.state.rootDomain}:${q}`
            );

            if (
              (!result || !boolean(result)) && // if the value was not === "true" then we have to clean it up
              result
            ) {
              ctx.client
                .del(`denylist:${ctx.state.rootDomain}:${q}`)
                .then()
                .catch((err) => ctx.logger.fatal(err));
              result = false;
            }
          }
        }
      }

      // if no result and it was an email then check against hard-coded denylist
      // (and also check parsed domain and root domain)
      if (!result && isEmail(q)) {
        const domain = parseHostFromDomainOrAddress(q);
        const root = parseRootDomain(domain);
        if (config.denylist.has(q)) {
          result = true;
          ctx.state.isHardCoded = true;
        } else if (config.denylist.has(domain)) {
          result = true;
          ctx.state.isHardCoded = true;
          q = domain;
        } else if (config.denylist.has(root)) {
          result = true;
          ctx.state.isHardCoded = true;
          q = root;
        }
      }

      // if no result and it was an IP then check against hard-coded denylist
      if (!result && isIP(q) && config.denylist.has(q)) {
        result = true;
        ctx.state.isHardCoded = true;
      }

      // if no result and it was a domain then check against hard-coded denylist
      // (and also check parsed root domain)
      if (!result && isFQDN(q)) {
        const root = parseRootDomain(q);
        if (config.denylist.has(q)) {
          result = true;
          ctx.state.isHardCoded = true;
        } else if (config.denylist.has(root)) {
          result = true;
          ctx.state.isHardCoded = true;
          q = root;
        }
      }
    }
  } catch (err) {
    ctx.logger.fatal(err);
    // we don't want to expose redis errors to client
    throw Boom.clientTimeout(ctx.translateError('WEBSITE_OUTAGE'));
  }

  if (!result)
    throw Boom.badRequest(ctx.translateError('INVALID_DENYLIST_REQUEST'));

  // set this in ctx state for next route middleware
  ctx.state.q = q;

  return next();
}

//
// NOTE: this will void a user's refund capability if they have submitted denylist removal request
//       (see user[config.userFields.hasDenylistRequests] in user model and in refund helper)
//       (we also alert the user to the voiding of the refund policy in the view for denylist requests)
//

async function remove(ctx) {
  // we have `ctx.state.q` to work with from validate fn
  // `denylist:${ctx.state.q}`
  const redirectTo = ctx.state.l('/denylist');

  // if user already submitted inquiry then return early
  if (ctx.state.user.group !== 'admin') {
    const count = await Inquiries.countDocuments({
      user: ctx.state.user._id,
      message: ctx.state.q,
      is_denylist: true,
      // don't create duplicate requests over 7d period
      created_at: {
        $gte: dayjs().subtract(7, 'day').toDate()
      }
    });

    if (count > 0) {
      const message = ctx.translate('SUPPORT_REQUEST_SENT');
      ctx.flash('success', message);
      if (ctx.accepts('html')) {
        ctx.redirect(redirectTo);
      } else {
        ctx.body = { redirectTo };
      }

      return;
    }
  }

  // store inquiry
  if (ctx.state.user.group !== 'admin') {
    try {
      const inquiry = await Inquiries.create({
        user: ctx.state.user._id,
        message: ctx.state.q,
        is_denylist: true
      });

      ctx.logger.debug('created inquiry', { inquiry });
    } catch (err) {
      ctx.logger.fatal(err);
      throw Boom.badRequest(ctx.translateError('SUPPORT_REQUEST_ERROR'));
    }
  }

  // if user is on free plan then send an email
  // with link for admins to /denylist?q=ctx.state.q
  if (ctx.state.user.group !== 'admin' && !ctx.state.isHardCoded) {
    //
    // if it was allowlisted domain but denylisted email
    // then we should email admins because it's either a false positive
    // automatic spam activity detected bug or a spammer
    //
    let isAllowlisted = false;
    if (isEmail(ctx.state.q) && ctx.state.rootDomain) {
      try {
        isAllowlisted = await ctx.client.get(
          `allowlist:${ctx.state.rootDomain}`
        );
        isAllowlisted = boolean(isAllowlisted);
      } catch (err) {
        ctx.logger.fatal(err);
      }
    }

    // email admins here
    email({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: `Denylist Removal: ${ctx.state.q}${
          isAllowlisted ? ' *Root domain allowlisted*' : ''
        }${
          ctx.state.user.plan === 'free'
            ? ''
            : ' *Already removed by paid user*'
        }`
      },
      locals: {
        //
        // NOTE: prefixHTMLPathBasedAnchors will add the full URL for us
        //
        message: `<p class="text-center"><code>${ctx.state.q}</code> for <code>${ctx.state.user.email}</code></p><p class="mb-0"><a class="btn btn-lg btn-dark btn-block" href="/denylist?q=${ctx.state.q}&email=${ctx.state.user.email}">Process Removal</a></p>`
      }
    })
      .then()
      .catch((err) => ctx.logger.fatal(err));
  }

  // return early if the user is free with a message we have been notified
  if (ctx.state.user.group !== 'admin' && ctx.state.user.plan === 'free') {
    const message = ctx.translate('SUPPORT_REQUEST_SENT');
    ctx.flash('success', message);
    if (ctx.accepts('html')) {
      ctx.redirect(redirectTo);
    } else {
      ctx.body = { redirectTo };
    }

    return;
  }

  //
  // if it is in hard-coded list then email admins and cc user and return early
  //
  if (ctx.state.isHardCoded) {
    // email admins here
    await email({
      template: 'alert',
      message: {
        to: config.email.message.from,
        cc: isEmail(ctx.request.body.email)
          ? ctx.request.body.email
          : ctx.state.user.email,
        subject: `Hard-coded Denylist Removal: ${ctx.state.q}`
      },
      locals: {
        message: `<p class="text-center"><code>${ctx.state.q}</code> for <code>${ctx.state.user.email}</code></p>`
      }
    });
    const message = ctx.translate(
      'DENYLIST_HARD_CODED',
      ctx.state.isEncrypted && ctx.state.user.group !== 'admin'
        ? ctx.translate('ENCRYPTED_VALUE')
        : ctx.state.q
    );
    ctx.flash('warning', message);
    if (ctx.accepts('html')) {
      ctx.redirect(redirectTo);
    } else {
      ctx.body = { redirectTo };
    }

    return;
  }

  // delete from all denylists
  try {
    if (isIP(ctx.state.q)) {
      // del ip
      await ctx.client.del(`denylist:${ctx.state.q}`);
      // add ip
      await ctx.client.set(`allowlist:${ctx.state.q}`, 'true', 'PX', ms('30d'));
    } else {
      // del email and/or domain
      await ctx.client.del(`denylist:${ctx.state.q}`);
      if (
        isAllowlistTld(isFQDN(ctx.state.q) ? ctx.state.q : ctx.state.rootDomain)
      )
        await ctx.client.set(
          `allowlist:${ctx.state.q}`,
          'true',
          'PX',
          ms('30d')
        );
      // del root domain
      if (ctx.state.rootDomain && ctx.state.q !== ctx.state.rootDomain) {
        await ctx.client.del(`denylist:${ctx.state.rootDomain}`);
        if (isAllowlistTld(ctx.state.rootDomain))
          await ctx.client.set(
            `allowlist:${ctx.state.rootDomain}`,
            'true',
            'PX',
            ms('30d')
          );
      }

      // if it was an email then delete the combo
      if (isEmail(ctx.state.q) && ctx.state.rootDomain) {
        await ctx.client.del(`denylist:${ctx.state.q}`);
        await ctx.client.del(`denylist:${ctx.state.rootDomain}:${ctx.state.q}`);
        if (isAllowlistTld(ctx.state.rootDomain)) {
          await ctx.client.set(
            `allowlist:${ctx.state.q}`,
            'true',
            'PX',
            ms('30d')
          );
          await ctx.client.set(
            `allowlist:${ctx.state.rootDomain}:${ctx.state.q}`,
            'true',
            'PX',
            ms('30d')
          );
        }
      }
    }
  } catch (err) {
    ctx.logger.fatal(err);
    throw Boom.badRequest(ctx.translateError('SUPPORT_REQUEST_ERROR'));
  }

  const message = ctx.translate(
    'DENYLIST_REMOVAL_SUCCESS',
    ctx.state.isEncrypted && ctx.state.user.group !== 'admin'
      ? ctx.translate('ENCRYPTED_VALUE')
      : ctx.state.q
  );

  // if it was an admin and there was ?email that was valid then email the user
  if (
    ctx.state.user.group === 'admin' &&
    isSANB(ctx.request.body.email) &&
    isEmail(ctx.request.body.email)
  )
    email({
      template: 'alert',
      message: {
        to: ctx.request.body.email,
        subject: `Denylist Removal Success: ${ctx.state.q}`
      },
      locals: { message: `<p class="text-center mb-0">${message}</p>` }
    })
      .then()
      .catch((err) => ctx.logger.fatal(err));

  // set `user[config.userFields.hasDenylistRequests]` to true (iff false)
  if (
    ctx.state.user.group !== 'admin' &&
    !ctx.state.user[config.userFields.hasDenylistRequests]
  ) {
    ctx.state.user[config.userFields.hasDenylistRequests] = true;
    try {
      await ctx.state.user.save();
    } catch (err) {
      ctx.logger.fatal(err);
    }
  }

  ctx.flash('success', message);
  if (ctx.accepts('html')) {
    ctx.redirect(redirectTo);
  } else {
    ctx.body = { redirectTo };
  }
}

module.exports = { validate, remove };
