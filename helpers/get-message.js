/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');
const pWaitFor = require('p-wait-for');

async function getMessage(imapClient, info, provider) {
  let received;
  let err;
  let timedOut = false;

  //
  // NOTE: we match the full unique Message-ID (not just its domain)
  //       otherwise the concurrent Direct and Forward probes sent to the
  //       same inbox would match each other's message and skew timings
  //
  const messageId = info.messageId.replace('<', '').replace('>', '');

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
          // mailbox is empty (nothing has arrived yet)
          if (imapClient.mailbox && imapClient.mailbox.exists === 0)
            return false;

          //
          // NOTE: we scan the entire mailbox (it is purged after every run)
          //       instead of only the newest message ('*'), otherwise any
          //       unrelated message arriving last would blind the probe
          //       for the full timeout and record a false failure
          //
          for await (const message of imapClient.fetch('1:*', {
            headers: ['Message-ID']
          })) {
            if (received) continue;
            if (
              message.headers &&
              message.headers.toString().includes(messageId)
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
        interval: ms('0.5s'),
        timeout: ms('1m')
      }
    );
  } catch (_err) {
    err = _err;
    // distinguish "message never arrived within 1m" from IMAP errors
    timedOut = _err.name === 'TimeoutError';
  }

  return { provider, received, err, timedOut };
}

module.exports = getMessage;
