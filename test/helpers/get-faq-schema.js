/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');
const { randomUUID } = require('node:crypto');

const test = require('ava');
const Redis = require('ioredis-mock');

const getFaqSchema = require('#helpers/get-faq-schema');

const {
  parseFaqMarkdown,
  buildFaqSchema,
  ensureQuestionMark,
  CACHE_KEY,
  CACHE_TTL_SECONDS,
  ALLOWED_TAGS,
  QUESTION_PREFIXES
} = getFaqSchema;

// <https://github.com/luin/ioredis/issues/1179>
Redis.Command.setArgumentTransformer('set', (args) => {
  if (typeof args[1] === 'object') args[1] = JSON.stringify(args[1]);
  return args;
});

Redis.Command.setReplyTransformer('get', (value) => {
  if (value && typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {}
  }

  return value;
});

const FAQ_FILE_PATH = path.join(
  __dirname,
  '..',
  '..',
  'app',
  'views',
  'faq',
  'index.md'
);

//
// ensureQuestionMark tests
//
test('ensureQuestionMark appends ? to interrogative questions without one', (t) => {
  t.is(ensureQuestionMark('How do I set up email'), 'How do I set up email?');
  t.is(ensureQuestionMark('What is Forward Email'), 'What is Forward Email?');
  t.is(ensureQuestionMark('Can I forward emails'), 'Can I forward emails?');
  t.is(ensureQuestionMark('Do you support IMAP'), 'Do you support IMAP?');
  t.is(
    ensureQuestionMark('Does it support sub-domains'),
    'Does it support sub-domains?'
  );
  t.is(ensureQuestionMark('Is this well-tested'), 'Is this well-tested?');
  t.is(
    ensureQuestionMark('Are you compliant with NDAA'),
    'Are you compliant with NDAA?'
  );
  t.is(
    ensureQuestionMark('Why am I not receiving emails'),
    'Why am I not receiving emails?'
  );
  t.is(
    ensureQuestionMark('Where are your servers located'),
    'Where are your servers located?'
  );
  t.is(
    ensureQuestionMark('Who has access to your infrastructure'),
    'Who has access to your infrastructure?'
  );
  t.is(
    ensureQuestionMark('Which payment methods do you accept'),
    'Which payment methods do you accept?'
  );
  t.is(
    ensureQuestionMark('Will this work with Gmail'),
    'Will this work with Gmail?'
  );
  t.is(ensureQuestionMark('Would this work for me'), 'Would this work for me?');
  t.is(ensureQuestionMark('Should I use DKIM'), 'Should I use DKIM?');
  t.is(ensureQuestionMark('Has this been audited'), 'Has this been audited?');
  t.is(
    ensureQuestionMark('Have you considered adding X'),
    'Have you considered adding X?'
  );
  t.is(
    ensureQuestionMark('If I switch plans do you pro-rate'),
    'If I switch plans do you pro-rate?'
  );
});

test('ensureQuestionMark does not append ? to statement-style headings', (t) => {
  t.is(ensureQuestionMark('Thunderbird'), 'Thunderbird');
  t.is(ensureQuestionMark('Microsoft Outlook'), 'Microsoft Outlook');
  t.is(ensureQuestionMark('Apple Mail'), 'Apple Mail');
  t.is(ensureQuestionMark('eM Client'), 'eM Client');
  t.is(ensureQuestionMark('Mobile Devices'), 'Mobile Devices');
  t.is(
    ensureQuestionMark('Advanced Server Hardening Techniques'),
    'Advanced Server Hardening Techniques'
  );
  t.is(
    ensureQuestionMark('Prevent bounces from known MAIL FROM spammers'),
    'Prevent bounces from known MAIL FROM spammers'
  );
  t.is(
    ensureQuestionMark('Sendmail SMTP Relay Configuration'),
    'Sendmail SMTP Relay Configuration'
  );
});

test('ensureQuestionMark does not double-append ? if already present', (t) => {
  t.is(ensureQuestionMark('How does it work?'), 'How does it work?');
  t.is(ensureQuestionMark('Is this free?'), 'Is this free?');
  t.is(
    ensureQuestionMark('Already has question mark?'),
    'Already has question mark?'
  );
});

test('ensureQuestionMark handles edge cases', (t) => {
  t.is(ensureQuestionMark(''), '');
  t.is(ensureQuestionMark(null), null);
  t.is(ensureQuestionMark(undefined), undefined);
});

//
// parseFaqMarkdown tests
//
test('parseFaqMarkdown returns an array of Q&A pairs', (t) => {
  const pairs = parseFaqMarkdown(FAQ_FILE_PATH);
  t.true(Array.isArray(pairs));
  t.true(pairs.length > 0);
});

test('parseFaqMarkdown extracts all h3 questions from the FAQ', (t) => {
  const pairs = parseFaqMarkdown(FAQ_FILE_PATH);
  // The FAQ has 131 h3 headings as of the current version
  t.true(
    pairs.length >= 100,
    `Expected at least 100 Q&A pairs, got ${pairs.length}`
  );
});

test('parseFaqMarkdown pairs have question and answerMd properties', (t) => {
  const pairs = parseFaqMarkdown(FAQ_FILE_PATH);
  for (const pair of pairs) {
    t.truthy(pair.question, 'Each pair should have a question');
    t.truthy(
      pair.answerMd,
      `Question "${pair.question}" should have an answer`
    );
    t.is(typeof pair.question, 'string');
    t.is(typeof pair.answerMd, 'string');
  }
});

test('parseFaqMarkdown first question is "What is Forward Email"', (t) => {
  const pairs = parseFaqMarkdown(FAQ_FILE_PATH);
  t.is(pairs[0].question, 'What is Forward Email');
});

test('parseFaqMarkdown does not include h2 section headings as questions', (t) => {
  const pairs = parseFaqMarkdown(FAQ_FILE_PATH);
  const sectionHeadings = [
    'Table of Contents',
    'Quick Start',
    'Introduction',
    'Email Clients',
    'Troubleshooting',
    'Data Management',
    'Email Configuration',
    'Additional Resources'
  ];
  for (const heading of sectionHeadings) {
    const found = pairs.find((p) => p.question === heading);
    t.falsy(found, `Section heading "${heading}" should not be a question`);
  }
});

test('parseFaqMarkdown throws for non-existent file', (t) => {
  t.throws(() => parseFaqMarkdown('/nonexistent/path/faq.md'), {
    instanceOf: Error
  });
});

//
// buildFaqSchema tests
//
test('buildFaqSchema returns valid FAQPage JSON-LD structure', (t) => {
  const pairs = [
    { question: 'Test question?', answerMd: 'Test **answer** with markdown.' }
  ];
  const schema = buildFaqSchema(pairs);
  t.is(schema['@context'], 'https://schema.org');
  t.is(schema['@type'], 'FAQPage');
  t.true(Array.isArray(schema.mainEntity));
  t.is(schema.mainEntity.length, 1);
});

test('buildFaqSchema Question entries have correct structure', (t) => {
  const pairs = [
    { question: 'How does it work', answerMd: 'It works **great**.' }
  ];
  const schema = buildFaqSchema(pairs);
  const q = schema.mainEntity[0];
  t.is(q['@type'], 'Question');
  // Should have "?" appended since it starts with "How"
  t.is(q.name, 'How does it work?');
  t.is(q.acceptedAnswer['@type'], 'Answer');
  t.truthy(q.acceptedAnswer.text);
});

test('buildFaqSchema appends ? to interrogative questions from markdown', (t) => {
  const pairs = [
    { question: 'What is Forward Email', answerMd: 'A service.' },
    { question: 'Do you support IMAP', answerMd: 'Yes.' },
    { question: 'Thunderbird', answerMd: 'Use Thunderbird.' }
  ];
  const schema = buildFaqSchema(pairs);
  t.is(schema.mainEntity[0].name, 'What is Forward Email?');
  t.is(schema.mainEntity[1].name, 'Do you support IMAP?');
  // Statement-style heading should NOT get a "?"
  t.is(schema.mainEntity[2].name, 'Thunderbird');
});

test('buildFaqSchema renders markdown to HTML in answers', (t) => {
  const pairs = [
    {
      question: 'Test?',
      answerMd: 'This is **bold** and *italic* text.'
    }
  ];
  const schema = buildFaqSchema(pairs);
  const answerText = schema.mainEntity[0].acceptedAnswer.text;
  t.true(answerText.includes('<strong>bold</strong>'));
  t.true(answerText.includes('<em>italic</em>'));
});

test('buildFaqSchema strips disallowed HTML tags', (t) => {
  const pairs = [
    {
      question: 'Test?',
      answerMd:
        '<table><tr><td>cell</td></tr></table>\n\n<img src="test.png" />\n\n<script>alert("xss")</script>\n\nAllowed: **bold**'
    }
  ];
  const schema = buildFaqSchema(pairs);
  const answerText = schema.mainEntity[0].acceptedAnswer.text;
  t.false(answerText.includes('<table'));
  t.false(answerText.includes('<tr'));
  t.false(answerText.includes('<td'));
  t.false(answerText.includes('<img'));
  t.false(answerText.includes('<script'));
  t.true(answerText.includes('<strong>bold</strong>'));
});

test('buildFaqSchema preserves Google-allowed HTML tags', (t) => {
  const pairs = [
    {
      question: 'Test?',
      answerMd:
        '1. First item\n2. Second item\n\n- Bullet one\n- Bullet two\n\n[Link text](https://example.com)\n\n**Bold** and *italic*'
    }
  ];
  const schema = buildFaqSchema(pairs);
  const answerText = schema.mainEntity[0].acceptedAnswer.text;
  t.true(answerText.includes('<ol>'));
  t.true(answerText.includes('<li>'));
  t.true(answerText.includes('<ul>'));
  t.true(answerText.includes('<a href="https://example.com">'));
  t.true(answerText.includes('<strong>'));
  t.true(answerText.includes('<em>'));
});

test('buildFaqSchema strips non-href attributes from anchor tags', (t) => {
  const pairs = [
    {
      question: 'Test?',
      answerMd:
        '<a href="https://example.com" target="_blank" rel="noopener" class="link">Click</a>'
    }
  ];
  const schema = buildFaqSchema(pairs);
  const answerText = schema.mainEntity[0].acceptedAnswer.text;
  t.true(answerText.includes('href="https://example.com"'));
  t.false(answerText.includes('target='));
  t.false(answerText.includes('rel='));
  t.false(answerText.includes('class='));
});

test('buildFaqSchema skips pairs with empty answers', (t) => {
  const pairs = [
    { question: 'Thunderbird setup', answerMd: 'Yes it does.' },
    { question: 'Empty topic', answerMd: '' }
  ];
  const schema = buildFaqSchema(pairs);
  t.is(schema.mainEntity.length, 1);
  // Statement-style heading, no "?" appended
  t.is(schema.mainEntity[0].name, 'Thunderbird setup');
});

test('buildFaqSchema produces valid JSON when serialized', (t) => {
  const pairs = parseFaqMarkdown(FAQ_FILE_PATH);
  const schema = buildFaqSchema(pairs);
  const json = JSON.stringify(schema);
  const parsed = JSON.parse(json);
  t.is(parsed['@type'], 'FAQPage');
  t.true(parsed.mainEntity.length > 0);
});

test('buildFaqSchema handles special characters in questions', (t) => {
  const pairs = [
    {
      question: 'Can I "send mail as" in Gmail with this',
      answerMd: 'Yes you can.'
    },
    {
      question: 'Does it support the plus + symbol',
      answerMd: 'Yes it does.'
    }
  ];
  const schema = buildFaqSchema(pairs);
  // Both start with interrogative words so should get "?"
  t.is(schema.mainEntity[0].name, 'Can I "send mail as" in Gmail with this?');
  t.is(schema.mainEntity[1].name, 'Does it support the plus + symbol?');
  // Ensure it serializes correctly
  const json = JSON.stringify(schema);
  const parsed = JSON.parse(json);
  t.is(parsed.mainEntity[0].name, 'Can I "send mail as" in Gmail with this?');
});

//
// getFaqSchema tests (with Redis caching via ioredis-mock)
//
test('getFaqSchema returns FAQ schema from markdown when no cache exists', async (t) => {
  const client = new Redis({ keyPrefix: randomUUID() });
  client.setMaxListeners(0);

  const schema = await getFaqSchema(client, FAQ_FILE_PATH);
  t.is(schema['@context'], 'https://schema.org');
  t.is(schema['@type'], 'FAQPage');
  t.true(Array.isArray(schema.mainEntity));
  t.true(schema.mainEntity.length >= 100);

  client.disconnect();
});

test('getFaqSchema caches result in Redis', async (t) => {
  const keyPrefix = randomUUID();
  const client = new Redis({ keyPrefix });
  client.setMaxListeners(0);

  await getFaqSchema(client, FAQ_FILE_PATH);

  // Verify the cache was set
  const cached = await client.get(CACHE_KEY);
  t.truthy(cached);

  const parsed = typeof cached === 'string' ? JSON.parse(cached) : cached;
  t.is(parsed['@type'], 'FAQPage');
  t.true(parsed.mainEntity.length >= 100);

  client.disconnect();
});

test('getFaqSchema returns cached data on subsequent calls', async (t) => {
  const keyPrefix = randomUUID();
  const client = new Redis({ keyPrefix });
  client.setMaxListeners(0);

  // First call - parses markdown and caches
  const schema1 = await getFaqSchema(client, FAQ_FILE_PATH);

  // Manually modify the cached data to verify it's being read from cache
  const modified = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Cached question?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cached answer.'
        }
      }
    ]
  };
  await client.set(
    CACHE_KEY,
    JSON.stringify(modified),
    'EX',
    CACHE_TTL_SECONDS
  );

  // Second call - should return cached data
  const schema2 = await getFaqSchema(client, FAQ_FILE_PATH);
  t.is(schema2.mainEntity.length, 1);
  t.is(schema2.mainEntity[0].name, 'Cached question?');
  t.not(schema1.mainEntity.length, schema2.mainEntity.length);

  client.disconnect();
});

test('getFaqSchema works without Redis client (null)', async (t) => {
  const schema = await getFaqSchema(null, FAQ_FILE_PATH);
  t.is(schema['@type'], 'FAQPage');
  t.true(schema.mainEntity.length >= 100);
});

test('getFaqSchema works with Redis client set to false', async (t) => {
  const schema = await getFaqSchema(false, FAQ_FILE_PATH);
  t.is(schema['@type'], 'FAQPage');
  t.true(schema.mainEntity.length >= 100);
});

test('getFaqSchema ignores invalid cached data and re-parses', async (t) => {
  const keyPrefix = randomUUID();
  const client = new Redis({ keyPrefix });
  client.setMaxListeners(0);

  // Set invalid cached data
  await client.set(CACHE_KEY, JSON.stringify({ invalid: true }));

  const schema = await getFaqSchema(client, FAQ_FILE_PATH);
  t.is(schema['@type'], 'FAQPage');
  t.true(schema.mainEntity.length >= 100);

  client.disconnect();
});

test('getFaqSchema ignores cached data with empty mainEntity', async (t) => {
  const keyPrefix = randomUUID();
  const client = new Redis({ keyPrefix });
  client.setMaxListeners(0);

  // Set cached data with empty mainEntity
  await client.set(
    CACHE_KEY,
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: []
    })
  );

  const schema = await getFaqSchema(client, FAQ_FILE_PATH);
  t.is(schema['@type'], 'FAQPage');
  t.true(schema.mainEntity.length >= 100);

  client.disconnect();
});

//
// CACHE_KEY and constants tests
//
test('CACHE_KEY is a non-empty string', (t) => {
  t.is(typeof CACHE_KEY, 'string');
  t.true(CACHE_KEY.length > 0);
});

test('CACHE_TTL_SECONDS is 3600 (1 hour)', (t) => {
  t.is(CACHE_TTL_SECONDS, 3600);
});

test('ALLOWED_TAGS contains all Google-specified tags', (t) => {
  const googleTags = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'br',
    'ol',
    'ul',
    'li',
    'a',
    'p',
    'div',
    'b',
    'strong',
    'i',
    'em'
  ];
  for (const tag of googleTags) {
    t.true(ALLOWED_TAGS.includes(tag), `ALLOWED_TAGS should include "${tag}"`);
  }
});

test('ALLOWED_TAGS does not contain disallowed tags', (t) => {
  const disallowedTags = [
    'script',
    'style',
    'img',
    'table',
    'tr',
    'td',
    'th',
    'thead',
    'tbody',
    'span',
    'code',
    'pre',
    'blockquote',
    'iframe',
    'form',
    'input'
  ];
  for (const tag of disallowedTags) {
    t.false(
      ALLOWED_TAGS.includes(tag),
      `ALLOWED_TAGS should not include "${tag}"`
    );
  }
});

test('QUESTION_PREFIXES contains common interrogative words', (t) => {
  const expected = [
    'how',
    'what',
    'why',
    'when',
    'where',
    'who',
    'which',
    'can',
    'do',
    'does',
    'is',
    'are',
    'will',
    'would',
    'should',
    'has',
    'have',
    'if'
  ];
  for (const word of expected) {
    t.true(
      QUESTION_PREFIXES.includes(word),
      `QUESTION_PREFIXES should include "${word}"`
    );
  }
});

//
// Full integration test - schema from real FAQ file
//
test('full FAQ schema from real markdown has no disallowed HTML tags in answers', (t) => {
  const pairs = parseFaqMarkdown(FAQ_FILE_PATH);
  const schema = buildFaqSchema(pairs);

  // Regex to detect HTML tags NOT in the allowed list
  const allowedTagPattern = ALLOWED_TAGS.join('|');
  const disallowedTagRegex = new RegExp(
    `<(?!\\/?(${allowedTagPattern})\\b)[a-z]`,
    'gi'
  );

  for (const q of schema.mainEntity) {
    const matches = q.acceptedAnswer.text.match(disallowedTagRegex);
    t.falsy(
      matches,
      `Question "${q.name}" has disallowed HTML tags: ${
        matches ? matches.join(', ') : 'none'
      }`
    );
  }
});

test('full FAQ schema from real markdown has no empty answers', (t) => {
  const pairs = parseFaqMarkdown(FAQ_FILE_PATH);
  const schema = buildFaqSchema(pairs);

  for (const q of schema.mainEntity) {
    t.truthy(
      q.acceptedAnswer.text.trim(),
      `Question "${q.name}" should have a non-empty answer`
    );
  }
});

test('full FAQ schema interrogative questions end with ?', (t) => {
  const pairs = parseFaqMarkdown(FAQ_FILE_PATH);
  const schema = buildFaqSchema(pairs);

  for (const q of schema.mainEntity) {
    const lower = q.name.toLowerCase();
    const isInterrogative = QUESTION_PREFIXES.some(
      (prefix) => lower === prefix || lower.startsWith(prefix + ' ')
    );
    if (isInterrogative) {
      t.true(
        q.name.endsWith('?'),
        `Interrogative question "${q.name}" should end with "?"`
      );
    }
  }
});

test('full FAQ schema statement-style headings do not end with ?', (t) => {
  const pairs = parseFaqMarkdown(FAQ_FILE_PATH);
  const schema = buildFaqSchema(pairs);

  // Known statement-style headings from the FAQ
  const statementHeadings = [
    'Thunderbird',
    'Microsoft Outlook',
    'Apple Mail',
    'eM Client',
    'Mobile Devices',
    'Advanced Server Hardening Techniques'
  ];

  for (const heading of statementHeadings) {
    const found = schema.mainEntity.find((q) => q.name === heading);
    if (found) {
      t.false(
        found.name.endsWith('?'),
        `Statement heading "${found.name}" should NOT end with "?"`
      );
    }
  }
});

test('full FAQ schema JSON is valid and parseable', (t) => {
  const pairs = parseFaqMarkdown(FAQ_FILE_PATH);
  const schema = buildFaqSchema(pairs);
  const json = JSON.stringify(schema);

  t.notThrows(() => JSON.parse(json));

  const parsed = JSON.parse(json);
  t.is(parsed['@context'], 'https://schema.org');
  t.is(parsed['@type'], 'FAQPage');
  t.true(parsed.mainEntity.length >= 100);

  // Verify each entry has the required structure
  for (const q of parsed.mainEntity) {
    t.is(q['@type'], 'Question');
    t.truthy(q.name);
    t.is(q.acceptedAnswer['@type'], 'Answer');
    t.truthy(q.acceptedAnswer.text);
  }
});
