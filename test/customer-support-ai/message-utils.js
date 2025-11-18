/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const {
  extractSenderText,
  buildReplyRecipients
} = require('../../helpers/customer-support-ai/message-utils');

test('extractSenderText should return formatted string with name and email', (t) => {
  const message = {
    nodemailer: {
      headers: {
        from: {
          value: [{ name: 'John Doe', address: 'john@example.com' }]
        }
      }
    }
  };

  const result = extractSenderText(message);
  t.is(result, 'John Doe <john@example.com>');
});

test('extractSenderText should return email only when name matches prefix', (t) => {
  const message = {
    nodemailer: {
      headers: {
        from: {
          value: [{ name: 'john', address: 'john@example.com' }]
        }
      }
    }
  };

  const result = extractSenderText(message);
  t.is(result, 'john@example.com');
});

test('extractSenderText should use from.text if available', (t) => {
  const message = {
    nodemailer: {
      headers: {
        from: {
          text: 'Jane Smith <jane@example.com>'
        }
      }
    }
  };

  const result = extractSenderText(message);
  t.is(result, 'Jane Smith <jane@example.com>');
});

test('buildReplyRecipients should use Reply-To if present', (t) => {
  const message = {
    nodemailer: {
      headers: {
        from: {
          value: [{ name: 'John Doe', address: 'john@example.com' }]
        },
        'reply-to': {
          value: [{ address: 'support@company.com' }]
        }
      },
      to: {
        value: [{ address: 'support@forwardemail.net' }]
      },
      cc: {
        value: []
      }
    }
  };

  const result = buildReplyRecipients(message, 'support@forwardemail.net');

  t.is(result.to, 'support@company.com');
  t.deepEqual(result.cc, ['john@example.com']);
});

test('buildReplyRecipients should use From if no Reply-To', (t) => {
  const message = {
    nodemailer: {
      headers: {
        from: {
          value: [{ name: 'John Doe', address: 'john@example.com' }]
        }
      },
      to: {
        value: [{ address: 'support@forwardemail.net' }]
      },
      cc: {
        value: []
      }
    }
  };

  const result = buildReplyRecipients(message, 'support@forwardemail.net');

  t.is(result.to, 'john@example.com');
  t.deepEqual(result.cc, []);
});

test('buildReplyRecipients should include original CC recipients', (t) => {
  const message = {
    nodemailer: {
      headers: {
        from: {
          value: [{ name: 'John Doe', address: 'john@example.com' }]
        }
      },
      to: {
        value: [{ address: 'support@forwardemail.net' }]
      },
      cc: {
        value: [
          { address: 'manager@company.com' },
          { address: 'team@company.com' }
        ]
      }
    }
  };

  const result = buildReplyRecipients(message, 'support@forwardemail.net');

  t.is(result.to, 'john@example.com');
  t.true(result.cc.includes('manager@company.com'));
  t.true(result.cc.includes('team@company.com'));
});

test('buildReplyRecipients should exclude our own address from CC', (t) => {
  const message = {
    nodemailer: {
      headers: {
        from: {
          value: [{ name: 'John Doe', address: 'john@example.com' }]
        }
      },
      to: {
        value: [
          { address: 'support@forwardemail.net' },
          { address: 'other@example.com' }
        ]
      },
      cc: {
        value: [{ address: 'support@forwardemail.net' }]
      }
    }
  };

  const result = buildReplyRecipients(message, 'support@forwardemail.net');

  t.is(result.to, 'john@example.com');
  t.false(result.cc.includes('support@forwardemail.net'));
  t.true(result.cc.includes('other@example.com'));
});

test('buildReplyRecipients should handle Reply-To with From in CC', (t) => {
  const message = {
    nodemailer: {
      headers: {
        from: {
          value: [{ name: 'John Doe', address: 'john@example.com' }]
        },
        'reply-to': {
          value: [{ address: 'support@company.com' }]
        }
      },
      to: {
        value: [{ address: 'support@forwardemail.net' }]
      },
      cc: {
        value: [{ address: 'manager@company.com' }]
      }
    }
  };

  const result = buildReplyRecipients(message, 'support@forwardemail.net');

  t.is(result.to, 'support@company.com');
  t.true(result.cc.includes('john@example.com'));
  t.true(result.cc.includes('manager@company.com'));
});

test('buildReplyRecipients should deduplicate CC addresses', (t) => {
  const message = {
    nodemailer: {
      headers: {
        from: {
          value: [{ name: 'John Doe', address: 'john@example.com' }]
        },
        'reply-to': {
          value: [{ address: 'support@company.com' }]
        }
      },
      to: {
        value: [{ address: 'support@forwardemail.net' }]
      },
      cc: {
        value: [
          { address: 'john@example.com' },
          { address: 'john@example.com' }
        ]
      }
    }
  };

  const result = buildReplyRecipients(message, 'support@forwardemail.net');

  t.is(result.to, 'support@company.com');
  // Should only have john@example.com once
  const johnCount = result.cc.filter(
    (email) => email === 'john@example.com'
  ).length;
  t.is(johnCount, 1);
});
