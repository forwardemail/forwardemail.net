/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');
const pWaitFor = require('p-wait-for');

async function getMessage(imapClient, info, provider) {
  let received;
  let err;
  try {
    await pWaitFor(
      async () => {
        // TODO: IMAP Protocol Extension Support
        // TODO: render a page with each provider's capabilities
        // <https://gist.github.com/nevans/8ef449da0786f9d1cc7c8324a288dd9b>
        // /blog/smtp-capability-command-by-provider
        // /blog/smtp-jmap-capability-imaprev
        // console.log('capabilities', imapClient.capabilities);

        try {
          //
          // NOTE: We issue NOOP before each fetch to refresh mailbox state.
          // This is required for Yahoo which doesn't push EXISTS updates.
          // Without NOOP, Yahoo returns stale mailbox data.
          // - https://stackoverflow.com/a/71254393
          // - https://github.com/ikvk/imap_tools/blob/master/tests/test_idle.py
          //
          try {
            await imapClient.noop();
          } catch {}

          for await (const message of imapClient.fetch('*', {
            headers: ['Message-ID']
          })) {
            if (received) break;
            if (
              message.headers &&
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
        } catch (_err) {
          err = _err;
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
