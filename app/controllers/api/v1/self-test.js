/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const os = require('node:os');

const Boom = require('@hapi/boom');
const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const pMap = require('p-map');
const isEmail = require('#helpers/is-email');

const config = require('#config');
const email = require('#helpers/email');
const i18n = require('#helpers/i18n');
const { Users, SelfTests } = require('#models');

const concurrency = os.cpus().length;

async function selfTest(ctx) {
  async function mapper(to) {
    try {
      const user = await Users.findOne({ email: to });
      const locale = user ? user[config.lastLocaleField] : i18n.getLocale();
      await email({
        template: 'self-test',
        message: { to },
        locals: { locale }
      });
    } catch (err) {
      ctx.logger.error(err);
    }
  }

  if (isSANB(ctx.request.body.emails))
    ctx.request.body.emails = [ctx.request.body.emails];

  if (!_.isArray(ctx.request.body.emails) || _.isEmpty(ctx.request.body.emails))
    throw Boom.badRequest(ctx.translateError('INVALID_EMAIL'));

  const emails = _.uniq(
    ctx.request.body.emails.map((email) => email.toLowerCase())
  );

  if (emails.some((email) => !isEmail(email)))
    throw Boom.badRequest(ctx.translateError('INVALID_EMAIL'));

  // filter out emails that we've already sent
  const distinctEmailsAlreadySent = await SelfTests.distinct('email', {
    email: { $in: emails }
  });

  // mutate array and remove emails we've already sent
  if (_.isArray(distinctEmailsAlreadySent))
    _.pullAll(emails, distinctEmailsAlreadySent);

  // if there were no emails to send then return early
  if (emails.length === 0) {
    ctx.body = 'OK';
    return;
  }

  //
  // TODO: we should store `sent_at` and build a queue out of this
  //

  // store that we sent this in case parallel requests
  await SelfTests.create(emails.map((email) => ({ email })));

  pMap(emails, mapper, { concurrency })
    .then()
    .catch((err) => ctx.logger.fatal(err));

  // send successful response
  ctx.body = 'OK';
}

module.exports = selfTest;
