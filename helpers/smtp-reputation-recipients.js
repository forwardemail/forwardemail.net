/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const config = require('#config');
const parseRootDomain = require('#helpers/parse-root-domain');

//
// Consumer domains where dots in the local part do not matter
//
const DOTLESS_DOMAINS = new Set(['gmail.com', 'googlemail.com']);

//
// Consumer domains that reach the same mailbox as another domain of the same
// provider (so one mailbox does not count once per domain)
//
const SAME_MAILBOX_DOMAINS = new Map([
  ['googlemail.com', 'gmail.com'],
  ['me.com', 'icloud.com'],
  ['mac.com', 'icloud.com'],
  ['protonmail.com', 'proton.me'],
  ['protonmail.ch', 'proton.me'],
  ['pm.me', 'proton.me'],
  ['yandex.com', 'yandex.ru'],
  ['yandex.by', 'yandex.ru'],
  ['yandex.kz', 'yandex.ru'],
  ['yandex.ua', 'yandex.ru'],
  ['yandex.com.tr', 'yandex.ru'],
  ['ya.ru', 'yandex.ru']
]);

//
// Consumer domains whose disposable addresses are `base-keyword` (a hyphen
// is not allowed in their regular addresses)
//
const HYPHEN_TAG_DOMAINS = new Set([
  'yahoo.com',
  'yahoo.co.uk',
  'yahoo.fr',
  'yahoo.de',
  'yahoo.it',
  'yahoo.es',
  'yahoo.co.jp',
  'yahoo.com.br',
  'ymail.com',
  'rocketmail.com'
]);

/**
 * Normalize a recipient so variants of one mailbox count once: the address is
 * lowercased, a `+tag` is removed, for Gmail dots are removed, a Yahoo
 * disposable `-keyword` is removed, and a provider's other domains for the
 * same mailbox (e.g. googlemail.com, me.com, pm.me) are its main one.
 *
 * @param {string} address - Email address
 * @returns {string} Normalized address (or '' if not an address)
 */
function normalizeRecipient(address) {
  if (typeof address !== 'string') return '';
  const lower = address.toLowerCase().trim();
  const at = lower.lastIndexOf('@');
  if (at <= 0) return '';
  let local = lower.slice(0, at).split('+')[0];
  let domain = lower.slice(at + 1);
  if (DOTLESS_DOMAINS.has(domain)) local = local.replaceAll('.', '');
  if (HYPHEN_TAG_DOMAINS.has(domain)) local = local.split('-')[0];
  domain = SAME_MAILBOX_DOMAINS.get(domain) || domain;

  return `${local}@${domain}`;
}

/**
 * Whether a root domain is a mailbox provider's own consumer domain.
 *
 * @param {string} root - Root domain
 * @returns {boolean} True for consumer domains (e.g. gmail.com)
 */
function isConsumerDomain(root) {
  return config.smtpReputationConsumerDomains.has(root);
}

/**
 * The key a spam or virus report counts under: the (normalized) recipient on
 * a mailbox provider's consumer domain, or else the recipient's root domain
 * (so a company tenant hosted by a truth source, whose admins can reject mail
 * as they like and create addresses at will, counts once).
 *
 * @param {string} recipient - Recipient address
 * @returns {string} Key ('' if not an address)
 */
function getReportKey(recipient) {
  const normalized = normalizeRecipient(recipient);
  if (!normalized) return '';
  const root = parseRootDomain(normalized.split('@').pop());
  return isConsumerDomain(root) ? normalized : `domain:${root}`;
}

/**
 * Whether a report key (see `getReportKey`) is a recipient on a mailbox
 * provider's consumer domain.
 *
 * @param {string} key - Report key
 * @returns {boolean} True for consumer domain recipients
 */
function isReportKeyConsumer(key) {
  return typeof key === 'string' && key !== '' && !key.startsWith('domain:');
}

/**
 * MongoDB expression normalizing the address in `expr` the same way as
 * `normalizeRecipient` (`expr` must be a lowercase string).
 *
 * @param {*} expr - Expression resolving to a lowercase address
 * @returns {Object} Expression resolving to the normalized address
 */
function normalizeRecipientExpression(expr) {
  return {
    $let: {
      vars: {
        local: {
          $arrayElemAt: [
            {
              $split: [{ $arrayElemAt: [{ $split: [expr, '@'] }, 0] }, '+']
            },
            0
          ]
        },
        domain: { $arrayElemAt: [{ $split: [expr, '@'] }, -1] }
      },
      in: {
        $concat: [
          {
            $switch: {
              branches: [
                {
                  case: {
                    $in: ['$$domain', { $literal: [...DOTLESS_DOMAINS] }]
                  },
                  // eslint-disable-next-line unicorn/no-thenable
                  then: {
                    $replaceAll: {
                      input: '$$local',
                      find: '.',
                      replacement: ''
                    }
                  }
                },
                {
                  case: {
                    $in: ['$$domain', { $literal: [...HYPHEN_TAG_DOMAINS] }]
                  },
                  // eslint-disable-next-line unicorn/no-thenable
                  then: {
                    $arrayElemAt: [{ $split: ['$$local', '-'] }, 0]
                  }
                }
              ],
              default: '$$local'
            }
          },
          '@',
          {
            $switch: {
              branches: [...SAME_MAILBOX_DOMAINS].map(([from, to]) => ({
                case: { $eq: ['$$domain', from] },
                // eslint-disable-next-line unicorn/no-thenable
                then: to
              })),
              default: '$$domain'
            }
          }
        ]
      }
    }
  };
}

//
// Bounce categories that are not about the sender's mail (e.g. our shared IP
// addresses on a blocklist, or a network issue)
//
const NOT_SENDER_CATEGORIES = ['blocklist', 'network'];

/**
 * MongoDB expression for whether a stored delivery error (`rejectedErrors`
 * entry, in `variable`, e.g. `$e`) is a permanent rejection of the
 * sender's mail that counts against them: a 5xx response that is not about our
 * shared IP addresses (a blocklist, or a verdict naming the IP), not a network
 * issue or deferral, not a message we gave up retrying (the recipient's
 * server kept deferring or could not be reached), and not our own bug.
 *
 * @param {string} variable - Variable holding the error (e.g. `$e`)
 * @returns {Object} Expression resolving to a boolean
 */
function senderRejectionExpression(variable) {
  return {
    $and: [
      {
        $gte: [
          {
            $convert: {
              input: `${variable}.responseCode`,
              to: 'int',
              onError: 0,
              onNull: 0
            }
          },
          500
        ]
      },
      { $ne: [`${variable}.isCodeBug`, true] },
      { $not: [{ $ifNull: [`${variable}.maxRetryDuration`, false] }] },
      {
        $not: [
          {
            $in: [
              { $ifNull: [`${variable}.bounceInfo.category`, 'other'] },
              { $literal: NOT_SENDER_CATEGORIES }
            ]
          }
        ]
      },
      { $ne: [`${variable}.bounceInfo.action`, 'defer'] },
      {
        $not: [
          {
            $regexMatch: {
              input: {
                $convert: {
                  input: `${variable}.bounceInfo.message`,
                  to: 'string',
                  onError: '',
                  onNull: ''
                }
              },
              regex: /\bIP\b/
            }
          }
        ]
      }
    ]
  };
}

module.exports = {
  senderRejectionExpression,
  normalizeRecipient,
  isConsumerDomain,
  getReportKey,
  isReportKeyConsumer,
  normalizeRecipientExpression
};
