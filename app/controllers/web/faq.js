const isSANB = require('is-string-and-not-blank');
const slug = require('speakingurl');
const { boolean } = require('boolean');

function faq(ctx) {
  const isRedirectToDomain = boolean(ctx.query.redirect_to_domain);
  let redirectTo =
    isRedirectToDomain && ctx.state.domain
      ? ctx.state.l(`/my-account/domains/${ctx.state.domain.name}`)
      : ctx.session.returnTo
      ? ctx.session.returnTo
      : ctx.state.l('/faq');
  let qs = '';
  if (!isSANB(ctx.request.body.domain) && !isSANB(ctx.request.body.email)) {
    qs = '';
  } else {
    qs = '?';
    if (isSANB(ctx.request.body.domain))
      qs += `domain=${ctx.request.body.domain.toLowerCase()}`;
    if (isSANB(ctx.request.body.email)) {
      if (qs.length > 1) qs += '&';
      qs += `email=${ctx.request.body.email.toLowerCase()}`;
    }
  }

  if (ctx.session.returnTo) {
    redirectTo += `?${qs}`;
    delete ctx.session.returnTo;
  } else {
    const hash = isSANB(ctx.query.hash)
      ? slug(ctx.query.hash)
      : 'how-do-i-get-started-and-set-up-email-forwarding';
    redirectTo = ctx.state.l(
      `/faq${qs}${ctx.request.body.domain.startsWith('www.') ? '' : `#${hash}`}`
    );
  }

  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

module.exports = faq;
