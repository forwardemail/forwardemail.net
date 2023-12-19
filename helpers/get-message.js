/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');
const pWaitFor = require('p-wait-for');
const { ImapFlow } = require('imapflow');

const logger = require('#helpers/logger');

async function getMessage(info, provider) {
  let message;
  let err;
  try {
    await pWaitFor(
      async () => {
        const client = new ImapFlow(provider.config);

        // this is outside of try/catch so we error and don't retry if LOGIN/AUTH failed
        await client.connect();

        // TODO: IMAP Protocol Extension Support
        // TODO: render a page with each provider's capabilities
        // <https://gist.github.com/nevans/8ef449da0786f9d1cc7c8324a288dd9b>
        // /blog/smtp-capability-command-by-provider
        // /blog/smtp-jmap-capability-imaprev
        // console.log('capabilities', client.capabilities);

        const lock = await client.getMailboxLock('INBOX');

        try {
          const messages = await client.search({
            from: info.envelope.from,
            header: { 'Message-ID': info.messageId }
          });

          if (messages.length > 0) {
            const received = new Date();
            //
            // NOTE: due to NTP time differences we cannot rely on
            //       a message's internal date from a given provider
            //       nor can we rely on Recieved headers
            //       nor can we rely on message envelope date
            //
            message = await client.fetchOne(messages[0], {
              source: true,
              envelope: true,
              internalDate: true
            });
            message.received = received;

            await client.messageDelete(message.uid);
          }
        } catch (_err) {
          err = _err;
        }

        lock.release();

        try {
          await client.logout();
        } catch (err) {
          logger.fatal(err);
        }

        if (err) throw err;

        return Boolean(message);
      },
      {
        interval: ms('1s'),
        timeout: ms('1m')
      }
    );
  } catch (_err) {
    err = _err;
  }

  return { provider, message, err };
}

module.exports = getMessage;
