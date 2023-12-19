/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');
const pWaitFor = require('p-wait-for');
const { ImapFlow } = require('imapflow');

const logger = require('#helpers/logger');

async function getMessage(info, provider) {
  let received;
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

        await client.mailboxOpen('INBOX');

        try {
          for await (const message of client.fetch(
            {
              seen: false
            },
            {
              headers: ['Message-ID']
            }
          )) {
            if (received) continue;
            if (
              message.headers
                .toString()
                .includes(
                  info.messageId.replace('<', '').replace('>', '').split('@')[1]
                )
            ) {
              //
              // NOTE: due to NTP time differences we cannot rely on
              //       a message's internal date from a given provider
              //       nor can we rely on Recieved headers
              //       nor can we rely on message envelope date
              //
              received = new Date();
            }
          }

          if (received) {
            try {
              await client.messageDelete({ all: true });
            } catch (err) {
              logger.fatal(err);
            }
          }
        } catch (_err) {
          err = _err;
        }

        try {
          await client.logout();
        } catch (err) {
          logger.fatal(err);
        }

        if (err) throw err;

        return Boolean(received);
      },
      {
        interval: 0,
        timeout: ms('1m')
      }
    );
  } catch (_err) {
    err = _err;
  }

  return { provider, received, err };
}

module.exports = getMessage;
