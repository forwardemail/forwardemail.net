/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const prettyMilliseconds = require('pretty-ms');

const getGreylistKey = require('#helpers/get-greylist-key');
const SMTPError = require('#helpers/smtp-error');
const config = require('#config');

async function isGreylisted(session, client) {
  //
  // check if the message fingerprint was greylisted
  // (message fingerprints get greylisted if they bounce)
  // (see the logic in `helpers/on-data-mx.js`)
  //
  const msToGo = await client.pttl(getGreylistKey(session.fingerprint));
  if (msToGo > 0) {
    throw new SMTPError(
      `Message was greylisted, try again in ${prettyMilliseconds(msToGo, {
        verbose: true,
        secondsDecimalDigits: 0
      })}; see https://forwardemail.net/faq#do-you-have-a-greylist for more information`,
      { responseCode: 450, ignoreHook: true }
    );
  }

  // safeguard to return early if the sender was allowlisted
  if (session.isAllowlisted) return;

  const key = getGreylistKey(
    session.resolvedRootClientHostname || session.remoteAddress
  );
  let value = await client.get(key);
  if (value) {
    // parse the value from a string to an integer (date)
    const time = new Date(Number.parseInt(value, 10)).getTime();
    // validate date stored is not NaN and is numeric positive time
    if (Number.isFinite(time) && time > 0) {
      // example:
      // - value stored in redis is 4:05pm (original arrival time + 5m)
      // - currently it's 4:08pm
      // - msToGo = 4:05pm + 5m - 4:08pm = 4:10pm - 4:08pm = 2m
      //
      const msToGo = time + config.greylistTimeout - session.arrivalTime;

      if (msToGo > 0 && msToGo <= config.greylistTimeout) {
        throw new SMTPError(
          `Message was greylisted, try again in ${prettyMilliseconds(msToGo, {
            verbose: true,
            secondsDecimalDigits: 0
          })}; see https://forwardemail.net/faq#do-you-have-a-greylist for more information`,
          { responseCode: 450, ignoreHook: true }
        );
      }
    } else {
      // value stored was invalid so we need to reset it
      value = null;
    }
  }

  // if there was no value stored then set one and throw an error
  if (!value) {
    await client.set(key, session.arrivalTime, 'PX', config.greylistTtlMs);
    throw new SMTPError(
      `Message was greylisted, try again in ${prettyMilliseconds(
        config.greylistTimeout,
        {
          verbose: true,
          secondsDecimalDigits: 0
        }
      )}; see https://forwardemail.net/faq#do-you-have-a-greylist for more information`,
      { responseCode: 450, ignoreHook: true }
    );
  }
}

module.exports = isGreylisted;
