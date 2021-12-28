const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const parseDomain = require('parse-domain');

const email = require('#helpers/email');
const { SPFErrors } = require('#models');

const props = [
  'remote_address',
  'from',
  'client_hostname',
  'result',
  'explanation'
];

async function spfError(ctx) {
  const locals = {};

  for (const prop of props) {
    if (!isSANB(ctx.request.body[prop]))
      throw Boom.badRequest(ctx.translateError('INVALID_STRING', prop));
    locals[prop] = ctx.request.body[prop];
  }

  const parsed = parseDomain(locals.from.split('@').pop());

  // check if we've already sent this
  locals.org_domain = `${parsed.domain}.${parsed.tld}`;
  const count = await SPFErrors.countDocuments({
    org_domain: locals.org_domain
  });

  if (count > 0) {
    ctx.body = 'OK';
    return;
  }

  //
  // TODO: we should store `sent_at` and build a queue out of this
  //

  // store that we sent this in case parallel requests
  await SPFErrors.create(locals);

  const admin = `admin@${locals.org_domain}`;

  // include admin@ if not already added
  const to = [locals.from.toLowerCase()];
  if (!to.includes(admin)) to.push(admin);

  // send an email
  email({
    template: 'spf-error',
    message: { to },
    locals
  })
    .then(() => {})
    .catch((err) => ctx.logger.error(err));

  // send successful response
  ctx.body = 'OK';
}

module.exports = spfError;
