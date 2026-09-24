/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Email = require('email-templates');
const nodemailer = require('nodemailer');
const pify = require('pify');

const Aliases = require('#models/aliases');
const config = require('#config');
const getEmailLocals = require('#helpers/get-email-locals');
const logger = require('#helpers/logger');
const onAppend = require('#helpers/imap/on-append');

const onAppendPromise = pify(onAppend, { multiArgs: true });

//
// Renders an email template to a raw RFC 5322 message without sending it
// anywhere (nodemailer's stream transport only builds the message).
//
const renderer = new Email({
  ...config.email,
  // always render (`config.email.send` is off in development and tests)
  send: true,
  preview: false,
  transport: nodemailer.createTransport({
    streamTransport: true,
    buffer: true
  })
});

async function renderWelcomeMessage(session) {
  const aliasAddress = session.user.username;
  const locale = session.user.locale || 'en';
  const locals = {
    ...(await getEmailLocals()),
    aliasAddress,
    locale
  };
  const info = await renderer.send({
    template: 'welcome-mailbox',
    message: { to: aliasAddress },
    locals
  });
  return info.message;
}

//
// Write the welcome message directly into the INBOX of a newly created
// mailbox.
//
// It is NOT sent over SMTP: a mailbox is usually set up before the domain's
// MX records point to us (the message would land at the previous provider),
// and it would be subject to spam filtering and `config.email.send`.
//
// Only once per alias (persisted in MongoDB with `welcome_email_sent_at`).
// The flag is claimed before the append so two concurrent initial opens
// cannot both write it; it is released again if the append fails, so the
// next initial setup can retry.
//
async function appendWelcomeMessage(instance, session) {
  const aliasId = session?.user?.alias_id;
  if (!aliasId || !session?.user?.username) return false;

  const claimed = await Aliases.findOneAndUpdate(
    { id: aliasId, welcome_email_sent_at: { $exists: false } },
    { $set: { welcome_email_sent_at: new Date() } }
  )
    .select('_id')
    .lean()
    .exec();

  if (!claimed) return false;

  try {
    const raw = await renderWelcomeMessage(session);
    await onAppendPromise.call(instance, 'INBOX', [], new Date(), raw, {
      ...session,
      remoteAddress: session.remoteAddress || '127.0.0.1'
    });
    return true;
  } catch (err) {
    await Aliases.updateOne(
      { _id: claimed._id },
      { $unset: { welcome_email_sent_at: 1 } }
    ).catch((err) => logger.warn(err));
    throw err;
  }
}

appendWelcomeMessage.renderWelcomeMessage = renderWelcomeMessage;

module.exports = appendWelcomeMessage;
