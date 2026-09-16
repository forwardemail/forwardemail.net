/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');

const test = require('ava');

const root = path.join(__dirname, '..', '..');
const template = fs.readFileSync(
  path.join(root, 'emails', 'smtp-prevented', 'html.pug'),
  'utf8'
);
const emailModel = fs.readFileSync(
  path.join(root, 'app', 'models', 'emails.js'),
  'utf8'
);

test('the SMTP-prevented notice describes a one-message rejection', (t) => {
  t.true(
    template.includes('Only this outbound message was prevented from delivery.')
  );
  t.true(
    template.includes(
      'Your outbound SMTP service and other queued messages remain active.'
    )
  );
  t.false(
    template.includes('Outbound SMTP is currently paused and suspended.')
  );
  t.false(
    template.includes(
      'This means that all of your outbound emails are not being processed.'
    )
  );
});

test('spam prevention rejects the scanned message without setting domain suspension state', (t) => {
  const start = emailModel.indexOf('if (messages.length > 0)');
  const end = emailModel.indexOf(
    '// Determine status based on domain suspension'
  );
  const prevention = emailModel.slice(start, end);

  t.true(start >= 0);
  t.true(end > start);
  t.regex(prevention, /throw error;/);
  t.notRegex(prevention, /smtp_suspended_sent_at: new Date\(\)/);
  t.notRegex(prevention, /is_smtp_suspended: true/);
});
