/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// helpers/create-suspicious-email-matcher.js must return what
// jobs/check-suspicious-emails.js returned when it compared an email with
// every banned email in turn (matchBefore below, the job's own code), for
// emails made from banned ones by one to several edits of every kind and for
// unrelated ones.
//

const test = require('ava');
const { distance } = require('fastest-levenshtein');

const createSuspiciousEmailMatcher = require('#helpers/create-suspicious-email-matcher');

// what the job returned for an email, as it computed it
function matchBefore(email, bannedEmails, maxDistance = 3) {
  if (!email || typeof email !== 'string') return null;

  const emailLower = email.toLowerCase().trim();

  if (bannedEmails.includes(emailLower)) {
    return {
      type: 'exact',
      bannedEmail: emailLower,
      reason: 'Exact match to banned email'
    };
  }

  for (const bannedEmail of bannedEmails) {
    const dist = distance(emailLower, bannedEmail.toLowerCase());
    if (dist <= maxDistance && dist > 0) {
      return {
        type: 'similar',
        bannedEmail,
        distance: dist,
        reason: `Similar to banned email: ${bannedEmail} (distance: ${dist})`
      };
    }
  }

  return null;
}

// a seeded generator (Park-Miller), so a failure can be reproduced
function random(seed) {
  let a = (seed % 2_147_483_646) + 1;
  return () => {
    a = (a * 48_271) % 2_147_483_647;
    return (a - 1) / 2_147_483_646;
  };
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789._-+@ABCZéü日📧';
const DOMAINS = ['gmail.com', 'example.com', 'x.io', 'a.b', 'mail.example.org'];

function emails(rand) {
  const pick = (array) => array[Math.floor(rand() * array.length)];
  // one character of ALPHABET (whose emoji is two UTF-16 code units)
  const chars = [...ALPHABET];
  const char = () => pick(chars);

  const word = (min, max) => {
    let s = '';
    const length = min + Math.floor(rand() * (max - min + 1));
    for (let i = 0; i < length; i++) s += char();
    return s;
  };

  function edit(s) {
    const i = Math.floor(rand() * (s.length + 1));
    switch (Math.floor(rand() * 5)) {
      case 0: {
        return s.slice(0, i) + char() + s.slice(i);
      }

      case 1: {
        return s.slice(0, i) + s.slice(i + 1);
      }

      case 2: {
        return s.slice(0, i) + char() + s.slice(i + 1);
      }

      case 3: {
        return s.slice(0, i) + s.slice(i, i + 1).toUpperCase() + s.slice(i + 1);
      }

      default: {
        // swap two neighbours (two edits)
        return (
          s.slice(0, i) +
          s.slice(i + 1, i + 2) +
          s.slice(i, i + 1) +
          s.slice(i + 2)
        );
      }
    }
  }

  return { pick, word, edit };
}

function cases(seed, bannedCount, userCount) {
  const rand = random(seed);
  const { pick, word, edit } = emails(rand);

  const banned = [];
  for (let i = 0; i < bannedCount; i++) {
    const kind = rand();
    if (kind < 0.05) banned.push(word(0, 3)); // too short to cut
    else if (kind < 0.1) banned.push(`${word(1, 2)}@${pick(DOMAINS)}`);
    else if (kind < 0.13)
      banned.push(`${word(2, 6)}@${word(1, 3)}@${pick(DOMAINS)}`);
    else if (kind < 0.16) banned.push(word(6, 14)); // without "@"
    else if (kind < 0.2 && banned.length > 0)
      banned.push(pick(banned)); // twice
    else if (kind < 0.25)
      banned.push(`${word(3, 10)}@${pick(DOMAINS)}`.toUpperCase());
    else banned.push(`${word(3, 17)}@${pick(DOMAINS)}`);
  }

  const users = [null, undefined, '', 42, {}, '   ', ...banned.slice(0, 20)];
  for (let i = 0; i < userCount; i++) {
    const kind = rand();
    if (kind < 0.7) {
      // one to five edits of a banned email
      let email = pick(banned);
      const edits = 1 + Math.floor(rand() * 5);
      for (let j = 0; j < edits; j++) email = edit(email);
      users.push(rand() < 0.1 ? `  ${email}\t` : email);
    } else if (kind < 0.8) {
      users.push(pick(banned).toUpperCase());
    } else {
      users.push(`${word(1, 17)}@${pick(DOMAINS)}`);
    }
  }

  return { banned, users };
}

for (const maxDistance of [1, 2, 3]) {
  test(`same result as comparing every banned email in turn (within ${maxDistance})`, (t) => {
    let similar = 0;
    let exact = 0;
    for (const seed of [1, 2, 3, 4, 5]) {
      const { banned, users } = cases(seed * 7919 + maxDistance, 400, 3000);
      const matcher =
        maxDistance === 3
          ? createSuspiciousEmailMatcher(banned)
          : createSuspiciousEmailMatcher(banned, maxDistance);
      for (const email of users) {
        const expected = matchBefore(email, banned, maxDistance);
        t.deepEqual(matcher(email), expected, `seed ${seed}: ${String(email)}`);
        if (expected?.type === 'similar') similar++;
        if (expected?.type === 'exact') exact++;
      }
    }

    // the cases hit both kinds of match many times
    t.true(similar > 1000, `${similar} similar`);
    t.true(exact > 100, `${exact} exact`);
  });
}

test('the first similar banned email in the order given', (t) => {
  const banned = [
    'john.smith@example.com',
    'john.smyth@example.com',
    'jon.smith@example.com'
  ];
  const matcher = createSuspiciousEmailMatcher(banned);
  t.deepEqual(
    matcher('jon.smyth@example.com'),
    matchBefore('jon.smyth@example.com', banned)
  );
  t.is(matcher('jon.smyth@example.com').bannedEmail, 'john.smith@example.com');
  t.deepEqual(matcher('JOHN.SMITH@EXAMPLE.COM '), {
    type: 'exact',
    bannedEmail: 'john.smith@example.com',
    reason: 'Exact match to banned email'
  });
});

test('a banned email stored in capitals gives what it gave before', (t) => {
  // an exact match needs the banned email in lower case (user emails are
  // stored that way), and a similar one reports it as stored
  const banned = ['Spam.King@Example.com'];
  const matcher = createSuspiciousEmailMatcher(banned);
  for (const email of [
    'spam.king@example.com',
    'spam.kink@example.com',
    'x@y.z'
  ]) {
    t.deepEqual(matcher(email), matchBefore(email, banned), `${email}`);
  }

  t.is(matcher('spam.kink@example.com').bannedEmail, 'Spam.King@Example.com');
});

test('no banned emails', (t) => {
  const matcher = createSuspiciousEmailMatcher([]);
  t.is(matcher('someone@example.com'), null);
  t.is(matcher(null), null);
});
