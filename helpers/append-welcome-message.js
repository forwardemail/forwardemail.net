/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { setTimeout: delay } = require('node:timers/promises');

const Email = require('email-templates');
const ms = require('ms');
const nodemailer = require('nodemailer');
const pify = require('pify');

const Aliases = require('#models/aliases');
const Messages = require('#models/messages');
const config = require('#config');
const getEmailLocals = require('#helpers/get-email-locals');
const logger = require('#helpers/logger');
const onAppend = require('#helpers/imap/on-append');

// (rejects with the error itself: with `multiArgs` a rejection is the array
//  of the callback arguments)
const onAppendPromise = pify(onAppend);

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

//
// The welcome message of an alias always has the same Message-ID, so a
// mailbox that already has it does not get it again (e.g. an alias without
// IMAP gets it unmarked, and IMAP is enabled while that mailbox is kept)
//
function getWelcomeMessageId(aliasId) {
  return `<welcome-${aliasId}@${config.webHost}>`;
}

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
    message: {
      to: aliasAddress,
      messageId: getWelcomeMessageId(session.user.alias_id)
    },
    locals
  });
  return info.message;
}

//
// One attempt at storing the welcome message.  The attempt holds a reference
// on the mailbox handle while it uses it, as a request does.  The password
// reset that set up the mailbox ends with `sqlite_auth_reset`, and that
// eviction at once closes a handle no reference holds: without one, the
// append fails on a closed handle.  The attempt uses the handle it was given
// only while the cache still holds that handle (the cache closes an evicted
// handle once nothing uses it, and a file swap may wait for that), and it
// releases the handles the append opens itself as well.
//
async function storeWelcomeMessage(instance, session, raw) {
  const aliasId = session.user.alias_id;
  const welcome = {
    ...session,
    remoteAddress: session.remoteAddress || '127.0.0.1',
    // (an attempt after one that stored the message but then failed, e.g.
    // while letting go of a handle, finds it instead of storing it again,
    // see `helpers/imap/on-append.js`)
    checkForExisting: true
  };
  const { databaseMap } = instance;
  let held;
  if (welcome.db && typeof databaseMap?.acquire === 'function') {
    if (databaseMap.getRaw(aliasId) === welcome.db)
      held = databaseMap.acquire(aliasId, welcome.db);
    if (!held) delete welcome.db;
  }

  try {
    // the mailbox already has the welcome message (in any folder)
    if (welcome.db) {
      const existing = await Messages.findOne(instance, welcome, {
        msgid: getWelcomeMessageId(aliasId)
      });
      if (existing) return;
    }

    await onAppendPromise.call(instance, 'INBOX', [], new Date(), raw, welcome);
  } finally {
    if (typeof databaseMap?.release === 'function') {
      if (held) databaseMap.release(aliasId, held);
      for (const db of welcome.dbAcquired || [])
        databaseMap.release(aliasId, db);
    }
  }
}

//
// After a failed attempt, try again a few seconds later, whatever the error
// (a closed handle throws a TypeError, which p-retry does not retry), unless
// the server is shutting down.
//
async function storeWithRetries(instance, session, raw, attempt = 1) {
  try {
    await storeWelcomeMessage(instance, session, raw);
  } catch (err) {
    if (attempt > appendWelcomeMessage.retries || instance.isClosing) throw err;
    logger.warn(err, { alias_id: session.user.alias_id, attempt });
    await delay(appendWelcomeMessage.retryDelay * 2 ** (attempt - 1));
    if (instance.isClosing) throw err;
    await storeWithRetries(instance, session, raw, attempt + 1);
  }
}

//
// Write the welcome message directly into the INBOX of a newly created
// mailbox.
//
// It is NOT sent over SMTP: a mailbox is usually set up before the domain's
// MX records point to us (the message would land at the previous provider),
// and it would be subject to spam filtering and `config.email.send`.
//
// An alias with IMAP gets it once (`welcome_email_sent_at`).  The claim on
// the flag comes before the append, so two concurrent initial opens cannot
// both write it.  Nothing sets the mailbox up again later, so a failed
// attempt gets two more, and the flag goes back only when all of them fail.
//
// An alias without IMAP gets it in its mailbox too, unmarked: its first
// password sets the mailbox up, so the message is there when IMAP is
// enabled soon after.  jobs/cleanup-sqlite.js deletes the mailbox of an
// alias without IMAP within the hour, and the mailbox set up once IMAP is
// enabled then gets the welcome message (and the flag).  A Redis key held
// for an hour stands in for the flag, so two concurrent initial opens write
// it once.
//
async function appendWelcomeMessage(instance, session) {
  const aliasId = session?.user?.alias_id;
  if (!aliasId || !session?.user?.username) return false;

  const alias = await Aliases.findOne({ id: aliasId })
    .select('has_imap welcome_email_sent_at')
    .lean()
    .exec();
  if (!alias || alias.welcome_email_sent_at) return false;

  if (alias.has_imap) {
    const claimed = await Aliases.findOneAndUpdate(
      { _id: alias._id, welcome_email_sent_at: { $exists: false } },
      { $set: { welcome_email_sent_at: new Date() } }
    )
      .select('_id')
      .lean()
      .exec();
    if (!claimed) return false;
  } else if (instance.client) {
    const claimed = await instance.client.set(
      `welcome_unmarked:${aliasId}`,
      true,
      'PX',
      ms('1h'),
      'NX'
    );
    if (!claimed) return false;
  }

  try {
    // (render once, before holding a handle: rendering takes a while)
    const raw = await renderWelcomeMessage(session);
    await storeWithRetries(instance, session, raw);
    return true;
  } catch (err) {
    if (alias.has_imap)
      await Aliases.updateOne(
        { _id: alias._id },
        { $unset: { welcome_email_sent_at: 1 } }
      ).catch((err) => logger.warn(err));
    else if (instance.client)
      await instance.client
        .del(`welcome_unmarked:${aliasId}`)
        .catch((err) => logger.warn(err));
    throw err;
  }
}

appendWelcomeMessage.renderWelcomeMessage = renderWelcomeMessage;
appendWelcomeMessage.getWelcomeMessageId = getWelcomeMessageId;

// (off in tests, which count the messages of a mailbox; a test turns it on)
appendWelcomeMessage.enabled = config.env !== 'test';

// attempts after the first one, and the delay before the first of them
// (doubled before each next one)
appendWelcomeMessage.retries = 2;
appendWelcomeMessage.retryDelay = ms('5s');

module.exports = appendWelcomeMessage;
