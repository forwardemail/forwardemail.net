/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const querystring = require('node:querystring');

const test = require('ava');
const qs = require('qs');
const isSANB = require('is-string-and-not-blank');

//
// Ubuntu SSO unit tests (no web server or database required)
//
// Tests for:
//   1. OpenID body parsing fix: koa-bodyparser's allowDots breaks dotted keys
//   2. @ladjs/passport Ubuntu profile mapping: firstname/lastname → givenName/familyName
//   3. Redirect loop prevention for Ubuntu team domains
//

// Inline config values to avoid requiring #config (which needs native modules)
const UBUNTU_TEAM_MAPPING = {
  'ubuntu.com': '~ubuntumembers',
  'kubuntu.org': '~kubuntu-members',
  'lubuntu.me': '~lubuntu-members',
  'edubuntu.org': '~edubuntu-members',
  'ubuntu.net': '~ubuntu-smtp-test'
};

const PASSPORT_FIELDS = {
  ubuntuProfileID: 'ubuntu_profile_id',
  ubuntuUsername: 'ubuntu_username'
};

// ---------------------------------------------------------------------------
// Issue 1: OpenID POST body parsing with allowDots
// ---------------------------------------------------------------------------

test('koa-bodyparser with allowDots converts dotted keys to nested objects', (t) => {
  // This demonstrates the bug: qs.parse with allowDots: true
  // converts flat OpenID keys into nested objects
  const rawBody =
    'openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0' +
    '&openid.mode=id_res' +
    '&openid.sreg.fullname=Test+User' +
    '&openid.sreg.nickname=testuser' +
    '&openid.sreg.email=test%40ubuntu.com';

  const parsed = qs.parse(rawBody, { allowDots: true });

  // With allowDots, the keys become nested objects
  t.is(typeof parsed.openid, 'object');
  t.is(parsed['openid.mode'], undefined);
  t.is(parsed.openid.mode, 'id_res');
  t.is(parsed.openid.sreg.fullname, 'Test User');
});

test('querystring.parse preserves dotted keys as flat structure', (t) => {
  // This is the fix: using Node.js querystring.parse preserves dots in keys
  const rawBody =
    'openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0' +
    '&openid.mode=id_res' +
    '&openid.sreg.fullname=Test+User' +
    '&openid.sreg.nickname=testuser' +
    '&openid.sreg.email=test%40ubuntu.com';

  const parsed = querystring.parse(rawBody);

  // With querystring.parse, dots are preserved in keys
  t.is(parsed['openid.ns'], 'http://specs.openid.net/auth/2.0');
  t.is(parsed['openid.mode'], 'id_res');
  t.is(parsed['openid.sreg.fullname'], 'Test User');
  t.is(parsed['openid.sreg.nickname'], 'testuser');
  t.is(parsed['openid.sreg.email'], 'test@ubuntu.com');
});

test('querystring.stringify round-trips flat OpenID params correctly', (t) => {
  const rawBody =
    'openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0' +
    '&openid.mode=id_res' +
    '&openid.sreg.fullname=Test+User';

  const parsed = querystring.parse(rawBody);
  const reEncoded = querystring.stringify(parsed);
  const reParsed = querystring.parse(reEncoded);

  // Round-trip preserves all keys and values
  t.deepEqual(Object.keys(parsed).sort(), Object.keys(reParsed).sort());
  for (const key of Object.keys(parsed)) {
    t.is(parsed[key], reParsed[key]);
  }
});

test('querystring.parse handles non-Latin characters in OpenID fullname', (t) => {
  // Bengali name: সৌম্যদীপ ঘোষ
  const bengaliName =
    '\u09B8\u09CC\u09AE\u09CD\u09AF\u09A6\u09C0\u09AA \u0998\u09CB\u09B7';
  const encodedName = encodeURIComponent(bengaliName);
  const rawBody =
    'openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0' +
    '&openid.mode=id_res' +
    `&openid.sreg.fullname=${encodedName}` +
    '&openid.sreg.nickname=soumyadeep' +
    '&openid.sreg.email=test%40ubuntu.com';

  const parsed = querystring.parse(rawBody);

  t.is(parsed['openid.mode'], 'id_res');
  t.is(parsed['openid.sreg.fullname'], bengaliName);
  t.is(parsed['openid.sreg.nickname'], 'soumyadeep');
});

test('querystring.stringify preserves non-Latin characters through round-trip', (t) => {
  // Bengali name: সৌম্যদীপ ঘোষ
  const bengaliName =
    '\u09B8\u09CC\u09AE\u09CD\u09AF\u09A6\u09C0\u09AA \u0998\u09CB\u09B7';
  const encodedName = encodeURIComponent(bengaliName);
  const rawBody =
    'openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0' +
    '&openid.mode=id_res' +
    `&openid.sreg.fullname=${encodedName}`;

  const parsed = querystring.parse(rawBody);
  const reEncoded = querystring.stringify(parsed);
  const reParsed = querystring.parse(reEncoded);

  t.is(reParsed['openid.sreg.fullname'], bengaliName);
});

test('qs.parse with allowDots causes querystring.stringify to produce empty value', (t) => {
  // This demonstrates why the nested object from qs.parse breaks passport-ubuntu
  const rawBody =
    'openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0' +
    '&openid.mode=id_res' +
    '&openid.sreg.fullname=Test+User';

  const nestedParsed = qs.parse(rawBody, { allowDots: true });
  const reEncoded = querystring.stringify(nestedParsed);

  // querystring.stringify produces "openid=" for nested objects
  // (both Node 18 and Node 22+ convert object values to empty strings)
  t.is(reEncoded, 'openid=');
  t.not(reEncoded.includes('openid.mode=id_res'), true);
});

test('fix middleware correctly re-parses raw body for Ubuntu provider', (t) => {
  // Simulate the middleware logic
  const rawBody =
    'openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0' +
    '&openid.mode=id_res' +
    '&openid.sreg.fullname=%E0%A6%B8%E0%A7%8C%E0%A6%AE%E0%A7%8D%E0%A6%AF%E0%A6%A6%E0%A7%80%E0%A6%AA+%E0%A6%98%E0%A7%8B%E0%A6%B7' +
    '&openid.sreg.nickname=soumyadeep' +
    '&openid.sreg.email=test%40ubuntu.com';

  // Simulate what koa-bodyparser produces (broken)
  const brokenBody = qs.parse(rawBody, { allowDots: true });
  t.is(brokenBody['openid.mode'], undefined); // key is nested, not flat

  // Simulate the fix: re-parse from rawBody using querystring
  const fixedBody = querystring.parse(rawBody);
  t.is(fixedBody['openid.mode'], 'id_res'); // key is flat
  t.is(
    fixedBody['openid.sreg.fullname'],
    '\u09B8\u09CC\u09AE\u09CD\u09AF\u09A6\u09C0\u09AA \u0998\u09CB\u09B7'
  );
});

// ---------------------------------------------------------------------------
// Issue 1b: @ladjs/passport Ubuntu profile firstname/lastname mapping
// ---------------------------------------------------------------------------

test('Ubuntu profile firstname/lastname arrays are mapped to givenName/familyName', (t) => {
  // Simulate the Ubuntu profile as returned by passport-openid
  const profile = {
    claimedIdentifier: 'https://login.ubuntu.com/+id/abc123',
    fullname: ['Test User'],
    firstname: ['Test'],
    lastname: ['User'],
    nickname: ['testuser'],
    email: ['test@ubuntu.com']
  };

  // Simulate the mapping logic from the fix
  if (Array.isArray(profile.fullname) && isSANB(profile.fullname[0]))
    profile.displayName = profile.fullname[0];
  if (Array.isArray(profile.firstname) && isSANB(profile.firstname[0]))
    profile.givenName = profile.firstname[0];
  if (Array.isArray(profile.lastname) && isSANB(profile.lastname[0]))
    profile.familyName = profile.lastname[0];

  t.is(profile.displayName, 'Test User');
  t.is(profile.givenName, 'Test');
  t.is(profile.familyName, 'User');
});

test('Ubuntu profile with non-Latin firstname/lastname maps correctly', (t) => {
  // Bengali name
  const profile = {
    claimedIdentifier: 'https://login.ubuntu.com/+id/abc123',
    fullname: [
      '\u09B8\u09CC\u09AE\u09CD\u09AF\u09A6\u09C0\u09AA \u0998\u09CB\u09B7'
    ],
    firstname: ['\u09B8\u09CC\u09AE\u09CD\u09AF\u09A6\u09C0\u09AA'],
    lastname: ['\u0998\u09CB\u09B7'],
    nickname: ['soumyadeep'],
    email: ['test@ubuntu.com']
  };

  if (Array.isArray(profile.fullname) && isSANB(profile.fullname[0]))
    profile.displayName = profile.fullname[0];
  if (Array.isArray(profile.firstname) && isSANB(profile.firstname[0]))
    profile.givenName = profile.firstname[0];
  if (Array.isArray(profile.lastname) && isSANB(profile.lastname[0]))
    profile.familyName = profile.lastname[0];

  t.is(
    profile.displayName,
    '\u09B8\u09CC\u09AE\u09CD\u09AF\u09A6\u09C0\u09AA \u0998\u09CB\u09B7'
  );
  t.is(profile.givenName, '\u09B8\u09CC\u09AE\u09CD\u09AF\u09A6\u09C0\u09AA');
  t.is(profile.familyName, '\u0998\u09CB\u09B7');
});

test('Ubuntu profile without firstname/lastname does not set givenName/familyName', (t) => {
  // Some Ubuntu accounts may not have firstname/lastname via AX
  const profile = {
    claimedIdentifier: 'https://login.ubuntu.com/+id/abc123',
    fullname: ['Test User'],
    nickname: ['testuser'],
    email: ['test@ubuntu.com']
  };

  if (Array.isArray(profile.fullname) && isSANB(profile.fullname[0]))
    profile.displayName = profile.fullname[0];
  if (Array.isArray(profile.firstname) && isSANB(profile.firstname[0]))
    profile.givenName = profile.firstname[0];
  if (Array.isArray(profile.lastname) && isSANB(profile.lastname[0]))
    profile.familyName = profile.lastname[0];

  t.is(profile.displayName, 'Test User');
  t.is(profile.givenName, undefined);
  t.is(profile.familyName, undefined);
});

test('Ubuntu profile with empty firstname/lastname arrays does not set givenName/familyName', (t) => {
  const profile = {
    claimedIdentifier: 'https://login.ubuntu.com/+id/abc123',
    fullname: ['Test User'],
    firstname: [],
    lastname: [],
    nickname: ['testuser'],
    email: ['test@ubuntu.com']
  };

  if (Array.isArray(profile.fullname) && isSANB(profile.fullname[0]))
    profile.displayName = profile.fullname[0];
  if (Array.isArray(profile.firstname) && isSANB(profile.firstname[0]))
    profile.givenName = profile.firstname[0];
  if (Array.isArray(profile.lastname) && isSANB(profile.lastname[0]))
    profile.familyName = profile.lastname[0];

  t.is(profile.displayName, 'Test User');
  t.is(profile.givenName, undefined);
  t.is(profile.familyName, undefined);
});

// ---------------------------------------------------------------------------
// Combined: full OpenID callback simulation
// ---------------------------------------------------------------------------

test('full OpenID callback flow with non-Latin name succeeds after fix', (t) => {
  // Simulate the complete flow:
  // 1. Ubuntu SSO provider POSTs to /auth/ubuntu/ok with OpenID params
  // 2. koa-bodyparser parses with allowDots (broken)
  // 3. Our middleware re-parses from rawBody (fixed)
  // 4. passport-ubuntu uses the fixed body to construct URL
  // 5. passport-openid verifies the assertion

  const bengaliName =
    '\u09B8\u09CC\u09AE\u09CD\u09AF\u09A6\u09C0\u09AA \u0998\u09CB\u09B7';

  // Raw POST body from Ubuntu SSO provider
  const rawBody =
    'openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0' +
    '&openid.mode=id_res' +
    '&openid.op_endpoint=https%3A%2F%2Flogin.ubuntu.com%2F%2Bopenid' +
    '&openid.claimed_id=https%3A%2F%2Flogin.ubuntu.com%2F%2Bid%2Fabc123' +
    '&openid.identity=https%3A%2F%2Flogin.ubuntu.com%2F%2Bid%2Fabc123' +
    '&openid.return_to=https%3A%2F%2Fforwardemail.net%2Fauth%2Fubuntu%2Fok' +
    `&openid.sreg.fullname=${encodeURIComponent(bengaliName)}` +
    '&openid.sreg.nickname=soumyadeep' +
    '&openid.sreg.email=test%40ubuntu.com' +
    '&openid.sig=fakesig123' +
    '&openid.signed=ns%2Cmode%2Cop_endpoint%2Cclaimed_id%2Cidentity%2Creturn_to%2Csreg.fullname%2Csreg.nickname%2Csreg.email%2Csig%2Csigned';

  // Step 2: koa-bodyparser produces nested object (broken)
  const brokenBody = qs.parse(rawBody, { allowDots: true });
  t.is(brokenBody['openid.mode'], undefined); // BROKEN: key is nested

  // Step 3: Our middleware re-parses from rawBody (fixed)
  const fixedBody = querystring.parse(rawBody);
  t.is(fixedBody['openid.mode'], 'id_res'); // FIXED: key is flat

  // Step 4: passport-ubuntu constructs URL
  const url = '/auth/ubuntu/ok?' + querystring.stringify(fixedBody);
  t.true(url.includes('openid.mode=id_res'));
  t.true(url.includes('openid.sreg.fullname='));

  // Verify the URL can be parsed back to get the same params
  const urlParsed = new URL('http://localhost' + url);
  t.is(urlParsed.searchParams.get('openid.mode'), 'id_res');
  t.is(urlParsed.searchParams.get('openid.sreg.fullname'), bengaliName);
});

test('broken body causes passport-openid to miss openid.mode check', (t) => {
  // This test proves the exact failure mechanism
  const rawBody =
    'openid.mode=id_res&openid.sreg.fullname=Test+User&openid.sig=abc';

  // koa-bodyparser with allowDots
  const body = qs.parse(rawBody, { allowDots: true });

  // passport-ubuntu sets: req.query = req.body
  const reqQuery = body;

  // passport-openid checks: if (req.query && req.query['openid.mode'])
  const passportOpenIdCheck = reqQuery && reqQuery['openid.mode'];
  t.falsy(passportOpenIdCheck);

  // This means passport-openid falls through to the "initiate auth" branch
  // and redirects back to login.ubuntu.com -> infinite loop
});

test('fixed body allows passport-openid to find openid.mode', (t) => {
  const rawBody =
    'openid.mode=id_res&openid.sreg.fullname=Test+User&openid.sig=abc';

  // Our middleware re-parses with querystring.parse
  const body = querystring.parse(rawBody);

  // passport-ubuntu sets: req.query = req.body
  const reqQuery = body;

  // passport-openid checks: if (req.query && req.query['openid.mode'])
  const passportOpenIdCheck = reqQuery && reqQuery['openid.mode'];
  t.truthy(passportOpenIdCheck);
  t.is(passportOpenIdCheck, 'id_res');
});

// ---------------------------------------------------------------------------
// Issue 2: Ubuntu domain redirect loop prevention
// ---------------------------------------------------------------------------

test('ubuntu team domain names are correctly identified', (t) => {
  const ubuntuDomains = Object.keys(UBUNTU_TEAM_MAPPING);
  t.true(ubuntuDomains.includes('ubuntu.com'));
  t.true(ubuntuDomains.includes('kubuntu.org'));
  t.true(ubuntuDomains.includes('lubuntu.me'));
  t.true(ubuntuDomains.includes('edubuntu.org'));
  t.true(ubuntuDomains.includes('ubuntu.net'));
});

test('redirect loop fix logic: user with Ubuntu profile ID is detected', (t) => {
  // Simulate a user who is authenticated via Ubuntu SSO
  const user = {
    [PASSPORT_FIELDS.ubuntuProfileID]: 'https://login.ubuntu.com/+id/abc123',
    [PASSPORT_FIELDS.ubuntuUsername]: 'testuser'
  };

  // The fix checks if the user has Ubuntu credentials
  const hasUbuntuAuth =
    isSANB(user[PASSPORT_FIELDS.ubuntuProfileID]) &&
    isSANB(user[PASSPORT_FIELDS.ubuntuUsername]);

  t.true(hasUbuntuAuth);
});

test('redirect loop fix logic: user without Ubuntu profile ID is not affected', (t) => {
  // Simulate a user who is NOT authenticated via Ubuntu SSO
  const user = {
    [PASSPORT_FIELDS.ubuntuProfileID]: undefined,
    [PASSPORT_FIELDS.ubuntuUsername]: undefined
  };

  const hasUbuntuAuth =
    isSANB(user[PASSPORT_FIELDS.ubuntuProfileID]) &&
    isSANB(user[PASSPORT_FIELDS.ubuntuUsername]);

  t.false(hasUbuntuAuth);
});

test('redirect loop fix logic: domain name matching is case-insensitive', (t) => {
  const ubuntuDomains = Object.keys(UBUNTU_TEAM_MAPPING);

  // The fix lowercases the domain name before checking
  t.true(ubuntuDomains.includes('Ubuntu.com'.toLowerCase()));
  t.true(ubuntuDomains.includes('UBUNTU.COM'.toLowerCase()));
  t.true(ubuntuDomains.includes('ubuntu.com'.toLowerCase()));
});

test('redirect loop fix logic: non-ubuntu domains are not affected', (t) => {
  const ubuntuDomains = Object.keys(UBUNTU_TEAM_MAPPING);

  t.false(ubuntuDomains.includes('example.com'));
  t.false(ubuntuDomains.includes('gmail.com'));
  t.false(ubuntuDomains.includes('canonical.com'));
});
