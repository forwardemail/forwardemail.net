/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');
const punycode = require('node:punycode');

const test = require('ava');
const pug = require('pug');

const config = require('#config');
const hasDmarcIssues = require('#helpers/has-dmarc-issues');

const renderUpgrade = pug.compileFile(
  path.join(__dirname, '../../emails/_upgrade.pug')
);

function t(string, ...args) {
  return string.replace(/%s/g, () => args.shift());
}

function renderUpgradePartial(locals = {}) {
  return renderUpgrade({
    config,
    punycode,
    t,
    user: { email: 'user@example.com' },
    ...locals
  });
}

test('upgrade partial confirms encryption without displaying a dig warning', (t) => {
  const html = renderUpgradePartial({
    domain: { name: 'example.com' },
    hasEncryptedTxtRecord: true
  });

  t.true(
    html.includes('Your domain is already using encrypted DNS TXT records.')
  );
  t.false(html.includes('Right now anyone can run this computer command:'));
  t.false(html.includes('forward-email=user@example.com'));
  t.true(html.includes(`${config.urls.web}/en/my-account`));
  t.true(html.includes(`${config.urls.web}/en/encrypt`));
});

test('upgrade partial preserves the dig warning only for a confirmed unencrypted record', (t) => {
  const html = renderUpgradePartial({
    domain: { name: 'example.com' },
    hasEncryptedTxtRecord: false
  });

  t.true(html.includes('Right now anyone can run this computer command:'));
  t.true(html.includes('dig example.com txt'));
  t.true(html.includes('forward-email='));
  t.true(html.includes('user@example.com'));
  t.true(html.includes(`${config.urls.web}/en/encrypt`));
});

test('upgrade partial does not make an encryption claim when its status is unavailable', (t) => {
  const html = renderUpgradePartial();

  t.true(
    html.includes(
      'We could not confirm your current DNS encryption status when this email was prepared.'
    )
  );
  t.false(html.includes('Right now anyone can run this computer command:'));
  t.false(html.includes('forward-email=user@example.com'));
  t.true(html.includes(`${config.urls.web}/en/my-account`));
  t.true(html.includes(`${config.urls.web}/en/encrypt`));
});

test('DMARC warning is based on disposition and overall pass rate, not standalone alignment', (t) => {
  t.false(
    hasDmarcIssues({
      quarantined: 0,
      rejected: 0,
      spfAlignedPct: '0.0',
      dkimAlignedPct: '100.0',
      passRate: '100.0'
    })
  );
  t.true(
    hasDmarcIssues({
      quarantined: 1,
      rejected: 0,
      passRate: '100.0'
    })
  );
  t.true(
    hasDmarcIssues({
      quarantined: 0,
      rejected: 1,
      passRate: '100.0'
    })
  );
  t.true(
    hasDmarcIssues({
      quarantined: 0,
      rejected: 0,
      passRate: '89.9'
    })
  );
});
