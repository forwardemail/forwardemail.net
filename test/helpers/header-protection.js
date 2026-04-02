/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const crypto = require('node:crypto');

const test = require('ava');
const { Crypto } = require('@peculiar/webcrypto');
const x509 = require('@peculiar/x509');

const {
  STRUCTURAL_HEADERS,
  USER_FACING_HEADERS,
  HCP_BASELINE_CONFIDENTIAL,
  OBSCURED_SUBJECT,
  isStructuralHeader,
  isUserFacingHeader,
  isConfidentialHeader,
  parseHeaderLines,
  buildProtectedHeaders,
  buildLegacyDisplayText
} = require('../../helpers/header-protection');

const encryptMessageSMIME = require('../../helpers/encrypt-message-smime');

// Set up WebCrypto for x509
const webcrypto = new Crypto();
x509.cryptoProvider.set(webcrypto);

// Helper to generate test certificates
async function generateTestCertificate(options = {}) {
  const {
    algorithm = 'RSA',
    keySize = 2048,
    curve = 'P-256',
    notBefore = new Date(),
    notAfter = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    email = 'test@example.com'
  } = options;

  let keys;
  let signingAlgorithm;

  if (algorithm === 'RSA') {
    keys = await webcrypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: keySize,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['sign', 'verify']
    );
    signingAlgorithm = { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' };
  } else if (algorithm === 'ECC') {
    keys = await webcrypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: curve
      },
      true,
      ['sign', 'verify']
    );
    signingAlgorithm = { name: 'ECDSA', hash: 'SHA-256' };
  }

  const cert = await x509.X509CertificateGenerator.createSelfSigned({
    serialNumber: crypto.randomBytes(16).toString('hex'),
    name: `CN=${email}, E=${email}`,
    notBefore,
    notAfter,
    keys,
    signingAlgorithm,
    extensions: [
      new x509.BasicConstraintsExtension(false, undefined, true),
      new x509.KeyUsagesExtension(176, true),
      new x509.ExtendedKeyUsageExtension(['1.3.6.1.5.5.7.3.4'], false),
      await x509.SubjectKeyIdentifierExtension.create(keys.publicKey)
    ]
  });

  return cert.toString('pem');
}

// =====================================================
// Tests for header classification functions
// =====================================================

test('isStructuralHeader - identifies structural headers correctly', (t) => {
  t.true(isStructuralHeader('Content-Type'));
  t.true(isStructuralHeader('content-type'));
  t.true(isStructuralHeader('CONTENT-TYPE'));
  t.true(isStructuralHeader('Content-Transfer-Encoding'));
  t.true(isStructuralHeader('Content-Disposition'));
  t.true(isStructuralHeader('MIME-Version'));
  t.true(isStructuralHeader('Content-ID'));
  t.true(isStructuralHeader('Content-Language'));
  t.true(isStructuralHeader('Content-Location'));
  t.true(isStructuralHeader('Content-Description'));
});

test('isStructuralHeader - rejects non-structural headers', (t) => {
  t.false(isStructuralHeader('Subject'));
  t.false(isStructuralHeader('From'));
  t.false(isStructuralHeader('To'));
  t.false(isStructuralHeader('Date'));
  t.false(isStructuralHeader('Message-ID'));
  t.false(isStructuralHeader('X-Custom-Header'));
});

test('isUserFacingHeader - identifies user-facing headers correctly', (t) => {
  t.true(isUserFacingHeader('Subject'));
  t.true(isUserFacingHeader('subject'));
  t.true(isUserFacingHeader('From'));
  t.true(isUserFacingHeader('To'));
  t.true(isUserFacingHeader('Cc'));
  t.true(isUserFacingHeader('Date'));
  t.true(isUserFacingHeader('Reply-To'));
  t.true(isUserFacingHeader('Message-ID'));
  t.true(isUserFacingHeader('In-Reply-To'));
  t.true(isUserFacingHeader('References'));
  t.true(isUserFacingHeader('Keywords'));
  t.true(isUserFacingHeader('Comments'));
  t.true(isUserFacingHeader('Sender'));
});

test('isUserFacingHeader - rejects non-user-facing headers', (t) => {
  t.false(isUserFacingHeader('Content-Type'));
  t.false(isUserFacingHeader('X-Mailer'));
  t.false(isUserFacingHeader('Received'));
  t.false(isUserFacingHeader('DKIM-Signature'));
});

test('isConfidentialHeader - identifies confidential headers per hcp_baseline', (t) => {
  t.true(isConfidentialHeader('Subject'));
  t.true(isConfidentialHeader('subject'));
  t.true(isConfidentialHeader('Keywords'));
  t.true(isConfidentialHeader('Comments'));
  t.true(isConfidentialHeader('In-Reply-To'));
  t.true(isConfidentialHeader('References'));
});

test('isConfidentialHeader - rejects non-confidential headers', (t) => {
  t.false(isConfidentialHeader('From'));
  t.false(isConfidentialHeader('To'));
  t.false(isConfidentialHeader('Cc'));
  t.false(isConfidentialHeader('Date'));
  t.false(isConfidentialHeader('Reply-To'));
});

// =====================================================
// Tests for parseHeaderLines
// =====================================================

test('parseHeaderLines - parses simple headers', (t) => {
  const headerBlock =
    'From: sender@example.com\r\n' +
    'To: recipient@example.com\r\n' +
    'Subject: Test Message';

  const parsed = parseHeaderLines(headerBlock);
  t.is(parsed.length, 3);
  t.is(parsed[0].name, 'From');
  t.is(parsed[0].value, ' sender@example.com');
  t.is(parsed[1].name, 'To');
  t.is(parsed[2].name, 'Subject');
  t.is(parsed[2].value, ' Test Message');
});

test('parseHeaderLines - handles folded (continuation) headers', (t) => {
  const headerBlock =
    'Subject: This is a very long subject\r\n' +
    ' that continues on the next line\r\n' +
    'From: sender@example.com';

  const parsed = parseHeaderLines(headerBlock);
  t.is(parsed.length, 2);
  t.is(parsed[0].name, 'Subject');
  t.true(parsed[0].value.includes('very long subject'));
  t.true(parsed[0].value.includes('continues on the next line'));
  t.is(parsed[1].name, 'From');
});

test('parseHeaderLines - handles empty input', (t) => {
  const parsed = parseHeaderLines('');
  t.is(parsed.length, 0);
});

test('parseHeaderLines - handles headers with colons in values', (t) => {
  const headerBlock = 'Subject: Re: Meeting at 10:00\r\nFrom: test@example.com';
  const parsed = parseHeaderLines(headerBlock);
  t.is(parsed.length, 2);
  t.is(parsed[0].name, 'Subject');
  t.is(parsed[0].value, ' Re: Meeting at 10:00');
});

// =====================================================
// Tests for buildProtectedHeaders
// =====================================================

test('buildProtectedHeaders - creates inner headers with HP-Outer for encrypted messages', (t) => {
  const headerBlock =
    'From: sender@example.com\r\n' +
    'To: recipient@example.com\r\n' +
    'Subject: Secret Meeting\r\n' +
    'Date: Thu, 01 Jan 2026 00:00:00 +0000';

  const parsedHeaders = parseHeaderLines(headerBlock);
  const result = buildProtectedHeaders(parsedHeaders, { isEncrypted: true });

  t.is(result.hpValue, 'cipher');

  // Inner headers should contain all non-structural headers
  t.true(result.innerHeaders.includes('From: sender@example.com'));
  t.true(result.innerHeaders.includes('To: recipient@example.com'));
  t.true(result.innerHeaders.includes('Subject: Secret Meeting'));
  t.true(result.innerHeaders.includes('Date:'));

  // Inner headers should contain HP-Outer entries
  t.true(result.innerHeaders.includes('HP-Outer:'));

  // Subject should be obscured in outer headers
  const outerSubject = result.outerHeaders.find(
    (h) => h.name.toLowerCase() === 'subject'
  );
  t.truthy(outerSubject);
  t.true(outerSubject.value.includes(OBSCURED_SUBJECT));

  // From and To should be in outer headers (not confidential)
  const outerFrom = result.outerHeaders.find(
    (h) => h.name.toLowerCase() === 'from'
  );
  t.truthy(outerFrom);
  t.true(outerFrom.value.includes('sender@example.com'));
});

test('buildProtectedHeaders - signed-only mode uses hp=clear', (t) => {
  const headerBlock = 'From: sender@example.com\r\nSubject: Test';
  const parsedHeaders = parseHeaderLines(headerBlock);
  const result = buildProtectedHeaders(parsedHeaders, { isEncrypted: false });

  t.is(result.hpValue, 'clear');

  // All headers should be in outer (no obscuring for signed-only)
  const outerSubject = result.outerHeaders.find(
    (h) => h.name.toLowerCase() === 'subject'
  );
  t.truthy(outerSubject);
  t.is(outerSubject.value, ' Test');
});

test('buildProtectedHeaders - confidential headers are removed from outer', (t) => {
  const headerBlock =
    'From: sender@example.com\r\n' +
    'Subject: Secret\r\n' +
    'In-Reply-To: <abc@example.com>\r\n' +
    'References: <abc@example.com>\r\n' +
    'Keywords: secret, classified\r\n' +
    'Comments: This is confidential';

  const parsedHeaders = parseHeaderLines(headerBlock);
  const result = buildProtectedHeaders(parsedHeaders, { isEncrypted: true });

  // In-Reply-To, References, Keywords, Comments should NOT be in outer
  const outerNames = new Set(
    result.outerHeaders.map((h) => h.name.toLowerCase())
  );
  t.false(outerNames.has('in-reply-to'));
  t.false(outerNames.has('references'));
  t.false(outerNames.has('keywords'));
  t.false(outerNames.has('comments'));

  // From should still be in outer
  t.true(outerNames.has('from'));

  // Subject should be obscured but present
  const outerSubject = result.outerHeaders.find(
    (h) => h.name.toLowerCase() === 'subject'
  );
  t.truthy(outerSubject);
  t.true(outerSubject.value.includes(OBSCURED_SUBJECT));
});

test('buildProtectedHeaders - structural headers are excluded', (t) => {
  const headerBlock =
    'Content-Type: text/plain\r\n' +
    'From: sender@example.com\r\n' +
    'Subject: Test';

  const parsedHeaders = parseHeaderLines(headerBlock);
  const result = buildProtectedHeaders(parsedHeaders, { isEncrypted: true });

  // Content-Type is structural, should not appear in inner non-structural headers
  // (it's handled separately as the body content-type)
  t.false(result.innerHeaders.includes('Content-Type: text/plain'));
});

// =====================================================
// Tests for buildLegacyDisplayText
// =====================================================

test('buildLegacyDisplayText - generates display text for confidential headers', (t) => {
  const headerBlock =
    'From: sender@example.com\r\n' +
    'Subject: Secret Meeting\r\n' +
    'Keywords: important';

  const parsedHeaders = parseHeaderLines(headerBlock);
  const displayText = buildLegacyDisplayText(parsedHeaders);

  t.true(displayText.includes('Subject: Secret Meeting'));
  t.true(displayText.includes('Keywords: important'));
  // From is not confidential, should not be in legacy display
  t.false(displayText.includes('From:'));
});

test('buildLegacyDisplayText - returns empty string when no confidential headers', (t) => {
  const headerBlock = 'From: sender@example.com\r\nTo: recipient@example.com';
  const parsedHeaders = parseHeaderLines(headerBlock);
  const displayText = buildLegacyDisplayText(parsedHeaders);

  t.is(displayText, '');
});

// =====================================================
// Tests for OBSCURED_SUBJECT constant
// =====================================================

test('OBSCURED_SUBJECT is the correct placeholder', (t) => {
  t.is(OBSCURED_SUBJECT, '...');
});

// =====================================================
// Tests for header set contents
// =====================================================

test('STRUCTURAL_HEADERS contains all RFC 9787 structural headers', (t) => {
  const expected = [
    'content-type',
    'content-transfer-encoding',
    'content-disposition',
    'content-description',
    'content-id',
    'content-language',
    'content-location',
    'mime-version'
  ];
  for (const h of expected) {
    t.true(STRUCTURAL_HEADERS.has(h), `Missing structural header: ${h}`);
  }
});

test('USER_FACING_HEADERS contains all RFC 9787 user-facing headers', (t) => {
  const expected = [
    'subject',
    'from',
    'to',
    'cc',
    'date',
    'reply-to',
    'message-id',
    'in-reply-to',
    'references',
    'keywords',
    'comments',
    'sender'
  ];
  for (const h of expected) {
    t.true(USER_FACING_HEADERS.has(h), `Missing user-facing header: ${h}`);
  }
});

test('HCP_BASELINE_CONFIDENTIAL contains correct confidential headers', (t) => {
  const expected = [
    'subject',
    'keywords',
    'comments',
    'in-reply-to',
    'references'
  ];
  for (const h of expected) {
    t.true(
      HCP_BASELINE_CONFIDENTIAL.has(h),
      `Missing confidential header: ${h}`
    );
  }

  // These should NOT be confidential
  t.false(HCP_BASELINE_CONFIDENTIAL.has('from'));
  t.false(HCP_BASELINE_CONFIDENTIAL.has('to'));
  t.false(HCP_BASELINE_CONFIDENTIAL.has('date'));
});

// =====================================================
// Integration tests: S/MIME encryption with header protection
// =====================================================

test('S/MIME encryption with header protection includes hp parameter', async (t) => {
  const cert = await generateTestCertificate({
    algorithm: 'RSA',
    keySize: 2048
  });

  const message = Buffer.from(
    'From: sender@example.com\r\n' +
      'To: recipient@example.com\r\n' +
      'Subject: Secret Meeting\r\n' +
      'Date: Thu, 01 Jan 2026 00:00:00 +0000\r\n' +
      'Content-Type: text/plain\r\n' +
      '\r\n' +
      'Hello, this is a secret message!'
  );

  const encrypted = await encryptMessageSMIME(cert, message, {
    headerProtection: true
  });

  const encryptedStr = encrypted.toString();

  // Should be S/MIME encrypted
  t.true(encryptedStr.includes('application/pkcs7-mime'));
  t.true(encryptedStr.includes('enveloped-data'));

  // Outer Subject should be obscured
  const lines = encryptedStr.split('\r\n');
  const subjectLine = lines.find((l) => /^subject:/i.test(l));
  if (subjectLine) {
    t.true(subjectLine.includes('...'), 'Outer Subject should be obscured');
    t.false(
      subjectLine.includes('Secret Meeting'),
      'Outer Subject should not contain original subject'
    );
  }

  // From and To should still be visible in outer headers
  t.true(encryptedStr.includes('sender@example.com'));
  t.true(encryptedStr.includes('recipient@example.com'));
});

test('S/MIME encryption without header protection preserves original behavior', async (t) => {
  const cert = await generateTestCertificate({
    algorithm: 'RSA',
    keySize: 2048
  });

  const message = Buffer.from(
    'From: sender@example.com\r\n' +
      'To: recipient@example.com\r\n' +
      'Subject: Not Secret\r\n' +
      'Content-Type: text/plain\r\n' +
      '\r\n' +
      'Hello, World!'
  );

  const encrypted = await encryptMessageSMIME(cert, message, {
    headerProtection: false
  });

  const encryptedStr = encrypted.toString();

  // Should be S/MIME encrypted
  t.true(encryptedStr.includes('application/pkcs7-mime'));

  // Subject should NOT be obscured (no header protection)
  const lines = encryptedStr.split('\r\n');
  const subjectLine = lines.find((l) => /^subject:/i.test(l));
  if (subjectLine) {
    t.true(
      subjectLine.includes('Not Secret'),
      'Subject should be preserved without header protection'
    );
  }
});

test('S/MIME encryption with header protection - multipart message', async (t) => {
  const cert = await generateTestCertificate({
    algorithm: 'RSA',
    keySize: 2048
  });

  const message = Buffer.from(
    'From: sender@example.com\r\n' +
      'To: recipient@example.com\r\n' +
      'Subject: Multipart Secret\r\n' +
      'MIME-Version: 1.0\r\n' +
      'Content-Type: multipart/mixed; boundary="boundary123"\r\n' +
      '\r\n' +
      '--boundary123\r\n' +
      'Content-Type: text/plain\r\n' +
      '\r\n' +
      'Hello, World!\r\n' +
      '--boundary123\r\n' +
      'Content-Type: application/octet-stream\r\n' +
      'Content-Disposition: attachment; filename="test.txt"\r\n' +
      '\r\n' +
      'attachment content\r\n' +
      '--boundary123--'
  );

  const encrypted = await encryptMessageSMIME(cert, message, {
    headerProtection: true
  });

  const encryptedStr = encrypted.toString();
  t.true(encryptedStr.includes('application/pkcs7-mime'));

  // Subject should be obscured in outer
  const lines = encryptedStr.split('\r\n');
  const subjectLine = lines.find((l) => /^subject:/i.test(l));
  if (subjectLine) {
    t.true(subjectLine.includes('...'));
    t.false(subjectLine.includes('Multipart Secret'));
  }
});

test('S/MIME encryption with header protection - ECC certificate', async (t) => {
  const cert = await generateTestCertificate({
    algorithm: 'ECC',
    curve: 'P-256'
  });

  const message = Buffer.from(
    'From: sender@example.com\r\n' +
      'To: recipient@example.com\r\n' +
      'Subject: ECC Secret\r\n' +
      'Content-Type: text/plain\r\n' +
      '\r\n' +
      'Hello from ECC!'
  );

  const encrypted = await encryptMessageSMIME(cert, message, {
    headerProtection: true
  });

  const encryptedStr = encrypted.toString();
  t.true(
    encryptedStr.includes('application/pkcs7-mime') ||
      encryptedStr.includes('application/x-pkcs7-mime')
  );
});

test('S/MIME encryption with header protection - confidential headers removed from outer', async (t) => {
  const cert = await generateTestCertificate({
    algorithm: 'RSA',
    keySize: 2048
  });

  const message = Buffer.from(
    'From: sender@example.com\r\n' +
      'To: recipient@example.com\r\n' +
      'Subject: Secret Subject\r\n' +
      'In-Reply-To: <original@example.com>\r\n' +
      'References: <original@example.com>\r\n' +
      'Keywords: secret, classified\r\n' +
      'Comments: This is a confidential comment\r\n' +
      'Date: Thu, 01 Jan 2026 00:00:00 +0000\r\n' +
      'Content-Type: text/plain\r\n' +
      '\r\n' +
      'Secret message body'
  );

  const encrypted = await encryptMessageSMIME(cert, message, {
    headerProtection: true
  });

  const encryptedStr = encrypted.toString();

  // Extract outer headers (before the base64 body)
  const headerBodySplit = encryptedStr.indexOf('\r\n\r\n');
  const outerHeaderBlock = encryptedStr.slice(0, headerBodySplit);

  // In-Reply-To, References, Keywords, Comments should NOT be in outer
  t.false(
    outerHeaderBlock.toLowerCase().includes('in-reply-to:'),
    'In-Reply-To should be removed from outer'
  );
  t.false(
    outerHeaderBlock.toLowerCase().includes('references:'),
    'References should be removed from outer'
  );
  t.false(
    outerHeaderBlock.toLowerCase().includes('keywords:'),
    'Keywords should be removed from outer'
  );
  t.false(
    outerHeaderBlock.toLowerCase().includes('comments:'),
    'Comments should be removed from outer'
  );

  // From and Date should still be in outer
  t.true(outerHeaderBlock.includes('sender@example.com'));
  t.true(outerHeaderBlock.includes('recipient@example.com'));
});

test('S/MIME headerProtection defaults to true', async (t) => {
  const cert = await generateTestCertificate({
    algorithm: 'RSA',
    keySize: 2048
  });

  const message = Buffer.from(
    'From: sender@example.com\r\n' +
      'To: recipient@example.com\r\n' +
      'Subject: Default HP Test\r\n' +
      'Content-Type: text/plain\r\n' +
      '\r\n' +
      'Hello!'
  );

  // Call without options - should default to headerProtection: true
  const encrypted = await encryptMessageSMIME(cert, message);

  const encryptedStr = encrypted.toString();
  t.true(encryptedStr.includes('application/pkcs7-mime'));

  // Subject should be obscured by default
  const lines = encryptedStr.split('\r\n');
  const subjectLine = lines.find((l) => /^subject:/i.test(l));
  if (subjectLine) {
    t.true(subjectLine.includes('...'));
    t.false(subjectLine.includes('Default HP Test'));
  }
});
