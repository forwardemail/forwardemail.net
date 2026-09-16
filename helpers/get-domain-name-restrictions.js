/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const RE2 = require('re2');

const config = require('#config');
const parseRootDomain = require('#helpers/parse-root-domain');

const REGEX_MAIL_DISPOSABLE_INBOX = new RE2(
  /disposable|temporary|10minut|24hour|minutemail|tempmail/i
);

/**
 * Return the plan-restriction classification used when domains are created
 * or verified. A free-plan domain must be good, non-restricted, and
 * non-disposable.
 *
 * @param   {string} domainName Domain to classify
 * @returns {{isGood: boolean, isDisposable: boolean, isRestricted: boolean}}
 */
function getDomainNameRestrictions(domainName) {
  const rootDomain = parseRootDomain(domainName);
  const isGood = config.goodDomains.some((ext) =>
    rootDomain.endsWith(`.${ext}`)
  );
  const isDisposable = REGEX_MAIL_DISPOSABLE_INBOX.test(rootDomain);
  // NOTE: this also takes into account `nic.ext` for registrars
  const isRestricted = config.restrictedDomains.some(
    (ext) =>
      rootDomain === ext ||
      rootDomain.endsWith(`.${ext}`) ||
      rootDomain === `nic.${ext}`
  );

  return { isGood, isDisposable, isRestricted };
}

module.exports = getDomainNameRestrictions;
