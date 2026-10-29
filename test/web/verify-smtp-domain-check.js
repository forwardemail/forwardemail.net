/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The "Verify" button's emails for a domain that is not approved for SMTP
// automatically: support is told what the domain check flagged it for, and
// while the check has no verdict yet only support is told (once in 10
// minutes), and again once it has one.
// The models, the approval helper and the mailer are stubbed so the real
// controller runs.
//

const test = require('ava');
const Redis = require('ioredis-mock');

function stubModule(id, exports) {
  const filename = require.resolve(id);
  require.cache[filename] = {
    id: filename,
    filename,
    loaded: true,
    exports
  };
}

let domain;
stubModule('#models/domains', {
  async findById() {
    return domain;
  },
  async getToAndMajorityLocaleByDomain() {
    return { to: ['admin@example.com'], locale: 'en' };
  }
});

let flaggedCategories = [];
stubModule('#helpers/check-and-auto-approve-smtp', async () => ({
  isVerified: true,
  isAutoApproved: false,
  ns: [],
  dkim: true,
  returnPath: true,
  dmarc: true,
  strictDmarc: true,
  spf: true,
  autoconfig: false,
  autodiscover: false,
  hasLegitimateHosting: true,
  flaggedCategories,
  errors: [],
  hasDNSError: false
}));

const sent = [];
stubModule('#helpers/email', async (options) => {
  sent.push(options);
});

const verifySMTP = require('#controllers/web/my-account/verify-smtp');

function newCtx(client) {
  return {
    api: true,
    state: {
      l: (path) => path,
      domain: { _id: 'domain-id', name: 'example.com' },
      user: { id: 'user-id' },
      domains: []
    },
    locale: 'en',
    resolver: {},
    client,
    ip: '192.0.2.1',
    get: () => '',
    translate: (key) => key,
    translateError: (key) => key,
    flash() {},
    logger: { fatal() {} }
  };
}

test.serial(
  'support is told what a held domain is flagged for, the user once',
  async (t) => {
    domain = {
      _id: 'domain-id',
      name: 'example.com',
      has_smtp: false,
      async save() {}
    };

    // (the domain check has no verdict yet: only support is told, and not
    //  on every click)
    const client = new Redis();
    flaggedCategories = ['domain_check_pending'];
    sent.length = 0;
    await verifySMTP(newCtx(client));
    t.is(sent.length, 1);
    t.is(sent[0].message.to, require('#config').supportEmail);
    t.true(sent[0].locals.message.includes('domain_check_pending'));
    t.is(domain.smtp_verified_at, undefined);
    for (let i = 0; i < 3; i++) {
      await verifySMTP(newCtx(client));
    }

    t.is(sent.length, 1);

    // (then it has one: support sees it, and the user is told)
    flaggedCategories = ['gambling'];
    sent.length = 0;
    await verifySMTP(newCtx(client));
    t.is(sent.length, 2);
    t.true(
      sent.some((options) =>
        options.locals.message.includes(
          'Flagged by Domain Check</strong> gambling'
        )
      )
    );
    t.true(
      sent.some((options) => options.message.to.includes('admin@example.com'))
    );
    t.true(domain.smtp_verified_at instanceof Date);

    // (and not again)
    sent.length = 0;
    await verifySMTP(newCtx(client));
    t.is(sent.length, 0);
  }
);
