// const Boom = require('@hapi/boom');
// const isFQDN = require('is-fqdn');
// const isSANB = require('is-string-and-not-blank');
// const { isEmail, isIP } = require('validator');

// const { decrypt } = require('#helpers');

// TODO: void a user's refund capability if they have submitted denylist removal request

function denylist(ctx, next) {
  return next();
}

/*
async function denylist(ctx, next) {
  // ctx.request.body.q
  // IP, FQDN, Email, or encrypted value
  // check against redis to ensure it's listed in denylist
  //
  // if it is not in denylist then error
  //
  // if it is already in whitelist then error
  //
  // if paid, then make instant and email admins
  // otherwise email admins with request and cc the user
  //
  // note that we need to update terms to prevent removal requests
  // for users that have boolean marked for instant removal
  //
  if (!isSANB(ctx.request.body.q))
    return ctx.throw(
      Boom.badRequest(ctx.translateError('INVALID_DENYLIST_VALUE'))
    );

  let { q } = ctx.request.body;

  if (!isFQDN(q) && !isIP(q) && !isEmail(q)) {
    // check if it was encrypted value and can be decrypted without error
    // and the decrypted value is a FQDN, IP, or Email
    // otherwise throw the same error as above
    try {
      q = decrypt(q);
    } catch (err) {
      ctx.logger.warn(err);
      return ctx.throw(
        Boom.badRequest(ctx.translateError('INVALID_DENYLIST_VALUE'))
      );
    }

    if (!isFQDN(q) && !isIP(q) && !isEmail(q))
      return ctx.throw(
        Boom.badRequest(ctx.translateError('INVALID_DENYLIST_VALUE'))
      );
  }

  // normalize by converting to lowercase and trimming
  q = q.toLowerCase();

  // check that the value is in the denylist
  const result = await ctx.client.get(`denylist:${q}`);
  if (!result || !boolean(result)) {
    // if the value was not === "true" then we have to clean it up
    if (result)
      ctx.client
        .del(`denylist:${q}`)
        .then()
        .catch((err) => ctx.logger.fatal(err));
    return ctx.throw(
      Boom.badRequest(ctx.translateError('INVALID_DENYLIST_REQUEST'))
    );
  }

  // if within first 30 days of plan_set_at then send email otherwise make it instant

  // if it was an email address then we need to check the root domain if it was denylisted
  // if it was an email address then check root domain to see if it was whitelisted
  // and if so, then we need to check the denylist:domain:email combination

  // if it was whitelisted domain but denylisted email then we need to manually email admins

  // otherwise the value was in the denylist
  // so we need to make it instant (and email admins) if the user was paid
  // otherwise we need to send an email to admins for removal request submission

  // if it was an admin then grant the removal immediately
}
*/

module.exports = denylist;
