/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const isHighConfidencePhpHostingSpam = require('#helpers/is-high-confidence-php-hosting-spam');

function createHeaders(values = {}) {
  return {
    getDecoded(name) {
      return (values[name.toLowerCase()] || []).map((value) => ({ value }));
    }
  };
}

function createSuspiciousHeaders(overrides = {}) {
  return createHeaders({
    to: [''],
    'x-php-originating-script': ['1089:contact-form.php'],
    ...overrides
  });
}

function createUnauthenticatedSession(overrides = {}) {
  return {
    isAllowlisted: false,
    isOriginalFromAddressAllowlisted: false,
    hasSameHostnameAsFrom: false,
    hadAlignedAndPassingDKIM: false,
    isTrustedArc: false,
    dmarc: { status: { result: 'none' } },
    ...overrides
  };
}

test('matches unauthenticated blind mail from any PHP-originating script', (t) => {
  t.true(
    isHighConfidencePhpHostingSpam(
      createSuspiciousHeaders({ 'content-type': ['text/plain'] }),
      createUnauthenticatedSession()
    )
  );
});

test('matches standard PHP-originating script names without inspecting content', (t) => {
  for (const script of ['apvins.php', 'gismns.php', 'zkvkns.php']) {
    t.true(
      isHighConfidencePhpHostingSpam(
        createSuspiciousHeaders({
          'x-php-originating-script': [`812967:${script}`]
        }),
        createUnauthenticatedSession()
      ),
      `Expected ${script} to match the PHP-originating script rule`
    );
  }
});

test('does not trust a sender-supplied Authentication-Results header', (t) => {
  t.true(
    isHighConfidencePhpHostingSpam(
      createSuspiciousHeaders({
        'authentication-results': ['forged.example; dkim=pass; dmarc=pass']
      }),
      createUnauthenticatedSession()
    )
  );
});

test('allows authenticated mail from a PHP-originating script', (t) => {
  t.false(
    isHighConfidencePhpHostingSpam(
      createSuspiciousHeaders(),
      createUnauthenticatedSession({
        dmarc: { status: { result: 'pass' } }
      })
    )
  );
});

test('allows mail with a trusted ARC chain from a PHP-originating script', (t) => {
  t.false(
    isHighConfidencePhpHostingSpam(
      createSuspiciousHeaders(),
      createUnauthenticatedSession({ isTrustedArc: true })
    )
  );
});

test('allows mail with a visible recipient from a PHP-originating script', (t) => {
  t.false(
    isHighConfidencePhpHostingSpam(
      createSuspiciousHeaders({ to: ['recipient@example.com'] }),
      createUnauthenticatedSession()
    )
  );
});

test('allows disclosed BCC delivery from a PHP-originating script', (t) => {
  t.false(
    isHighConfidencePhpHostingSpam(
      createSuspiciousHeaders({ bcc: ['recipient@example.com'] }),
      createUnauthenticatedSession()
    )
  );
});

test('allows nonstandard PHP-origin headers and malformed script values', (t) => {
  t.false(
    isHighConfidencePhpHostingSpam(
      createSuspiciousHeaders({
        'x-php-originating-script': [],
        'x-php-script': ['site.example/contact-form.php']
      }),
      createUnauthenticatedSession()
    )
  );

  t.false(
    isHighConfidencePhpHostingSpam(
      createSuspiciousHeaders({
        'x-php-originating-script': ['contact-form.php']
      }),
      createUnauthenticatedSession()
    )
  );
});

test('allows global and sender-domain allowlisted mail', (t) => {
  t.false(
    isHighConfidencePhpHostingSpam(
      createSuspiciousHeaders(),
      createUnauthenticatedSession({ isAllowlisted: true })
    )
  );

  t.false(
    isHighConfidencePhpHostingSpam(
      createSuspiciousHeaders(),
      createUnauthenticatedSession({ isOriginalFromAddressAllowlisted: true })
    )
  );
});

test('allows mail when the connecting host matches the From domain', (t) => {
  t.false(
    isHighConfidencePhpHostingSpam(
      createSuspiciousHeaders(),
      createUnauthenticatedSession({ hasSameHostnameAsFrom: true })
    )
  );
});
