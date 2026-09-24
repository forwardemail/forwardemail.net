/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const QRCode = require('qrcode');
const humanize = require('humanize-string');
const ms = require('ms');
const RE2 = require('re2');
const shortID = require('mongodb-short-id');
const titleize = require('titleize');

const config = require('#config');
const env = require('#config/env');
const { encrypt } = require('#helpers/encrypt-decrypt');

//
// (this punctuation stuff is borrowed from our work with `spamscanner`)
// <https://github.com/regexhq/punctuation-regex>
// NOTE: we prepended a normal "-" hyphen since it was missing
const PUNCTUATION_REGEX = new RE2(
  /[-‒–—―|$&~=\\/⁄@+*!?({[\]})<>‹›«».;:^‘’“”'",،、`·•†‡°″¡¿※#№÷×%‰−‱¶′‴§_‖¦]/g
);

//
// FWD-01-007: HTML-escape user-controlled values before interpolation into
// the HTML of the SweetAlert2 popup (the password can be user-supplied and
// the username contains the alias name)
//
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

//
// The popup that shows a newly generated alias password (username, password,
// Apple Mail and Thunderbird QR codes), used right after the password was
// generated and when a one-time password link is claimed.
//
async function getAliasPasswordSwal(
  ctx,
  { aliasId, aliasName, domainName, password, isRekey = false }
) {
  const username = `${aliasName}@${domainName}`;

  // we use shortID to generate shorter querystring for less complicated QR code
  // (this same logic is in app/controllers/web/index.js)
  const appleLink = `${
    config.urls.web
  }/c/${username}.mobileconfig?a=${shortID.longToShort(aliasId)}&p=${encrypt(
    password
  )}`;
  const appleImgSrc = await QRCode.toDataURL(appleLink, {
    margin: 0,
    width: 200
  });

  const name = titleize(humanize(aliasName.replace(PUNCTUATION_REGEX, ' ')));

  // <https://gist.github.com/titanism/4a1a2816e0b57a5fa930f449256b75f6>
  //
  // 3 = TLS/SSL connection security
  // if (env.IMAP_PORT === 993 || env.IMAP_PORT === 2993) = 3
  // if (!env.SMTP_ALLOW_INSECURE_AUTH || config.env === 'production') = 3
  // otherwise 1 or 2 (probably 2)
  //
  // 1 = Password (cleartext) authentication
  //
  const imapTLS = env.IMAP_PORT === 993 || env.IMAP_PORT === 2993 ? 3 : 2;
  const smtpTLS =
    !env.SMTP_ALLOW_INSECURE_AUTH || config.env === 'production' ? 3 : 2;
  const thunderbirdQRCode = await QRCode.toDataURL(
    `[1,[1,1],[0,"${env.IMAP_HOST}",${env.IMAP_PORT},${imapTLS},1,"${username}","${username}","${password}"],[[[0,"${env.SMTP_HOST}",${env.SMTP_PORT},${smtpTLS},1,"${username}","${password}"],["${username}","${name}"]]]]`,
    {
      margin: 0,
      width: 200
    }
  );

  const safeUsername = escapeHtml(username);
  const safePass = escapeHtml(password);

  // the new password only works once the rekey is complete (emailed)
  const rekeyNotice = isRekey
    ? `<p class="alert alert-warning">${ctx.translate(
        'ALIAS_REKEY_STARTED',
        safeUsername
      )}</p>`
    : '';

  return {
    title: ctx.request.t('Success'),
    html:
      rekeyNotice +
      ctx.translate(
        'ALIAS_GENERATED_PASSWORD',
        safeUsername,
        safeUsername,
        safePass,
        safePass,
        appleImgSrc,
        appleLink,
        `${safeUsername}.mobileconfig`,
        thunderbirdQRCode
      ),
    type: 'success',
    timer: ms('10m'),
    position: 'top',
    allowEscapeKey: false,
    allowOutsideClick: false,
    focusConfirm: false,
    confirmButtonText: ctx.translate('CLOSE_POPUP'),
    grow: 'row'
  };
}

module.exports = getAliasPasswordSwal;
