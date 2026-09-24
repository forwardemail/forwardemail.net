/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');

const test = require('ava');

const {
  parseFaqIndex,
  suggestFaq,
  tokenize
} = require('#helpers/get-faq-index');

const FAQ_FILE_PATH = path.join(
  __dirname,
  '..',
  '..',
  'app',
  'views',
  'faq',
  'index.md'
);

let index;
test.before(() => {
  index = parseFaqIndex(FAQ_FILE_PATH, 'en');
});

function findQuestion(id) {
  for (const category of index.categories) {
    const q = category.questions.find((question) => question.id === id);
    if (q) return q;
  }
}

test('every question carries a lowercased plain-text excerpt of its answer', (t) => {
  t.true(index.total > 100);
  for (const category of index.categories) {
    for (const q of category.questions) {
      t.is(typeof q.excerpt, 'string');
      t.true(q.excerpt.length > 0, `${q.id} has no excerpt`);
      t.true(q.excerpt.length <= 400);
      t.is(q.excerpt, q.excerpt.toLowerCase());
      t.false(q.excerpt.includes('<'), `${q.id} excerpt contains markup`);
    }
  }
});

test('the data residency and enterprise answers are present under the expected anchors', (t) => {
  const residency = findQuestion(
    'can-i-keep-my-email-processing-and-storage-in-the-eu-data-residency'
  );
  t.truthy(residency);
  t.true(residency.excerpt.includes('not yet'));

  const retention = findQuestion(
    'where-is-inbound-email-for-my-domain-processed-and-stored-and-for-how-long'
  );
  t.truthy(retention);
  t.true(retention.answerHtml.includes('7 days'));

  const annex = findQuestion(
    'how-do-i-list-forward-email-as-a-subprocessor-in-my-own-dpa'
  );
  t.truthy(annex);
  t.true(annex.answerHtml.includes('Forward Email LLC'));

  const enterprise = findQuestion('what-is-included-in-the-enterprise-license');
  t.truthy(enterprise);
  t.true(enterprise.answerHtml.includes('$250/month'));
});

test('tokenize drops stop words, short words and plurals, and de-duplicates', (t) => {
  t.deepEqual(
    tokenize(
      'Can our emails for the kindergartens be kept in the EU? EU only!'
    ),
    ['kindergarten', 'kept', 'eu']
  );
  t.deepEqual(tokenize('your sub-processor list and DNS'), [
    'processor',
    'list',
    'dns',
    'subprocessor'
  ]);
  t.deepEqual(tokenize('the ips of it'), ['ips']);
  t.deepEqual(tokenize(''), []);
  t.deepEqual(tokenize('the and or'), []);
  t.deepEqual(tokenize('Subprocessors subprocessor SUBPROCESSORS'), [
    'subprocessor'
  ]);
});

test('suggestFaq returns nothing for an empty or stop-word-only message', (t) => {
  t.deepEqual(suggestFaq(index, ''), []);
  t.deepEqual(suggestFaq(index, '   '), []);
  t.deepEqual(suggestFaq(index, 'can you please'), []);
  t.deepEqual(suggestFaq(null, 'imap'), []);
});

test('suggestFaq surfaces the data residency answers for a GDPR processor question', (t) => {
  const message =
    'We are about to start selling a service to kindergartens in the EU, which makes us a processor under GDPR Article 28. Can inbound mail for our domain be handled entirely on EU infrastructure today? Your FAQ mentions a planned EU datacentre under forwardemail.eu.';
  const results = suggestFaq(index, message);
  t.true(results.length > 0);
  t.true(results.length <= 5);
  const compliance = new Set([
    'can-i-keep-my-email-processing-and-storage-in-the-eu-data-residency',
    'where-is-inbound-email-for-my-domain-processed-and-stored-and-for-how-long',
    'how-do-i-list-forward-email-as-a-subprocessor-in-my-own-dpa'
  ]);
  // The best match is one of the three answers written for exactly this
  // question, and the residency answer is on the list.
  t.true(compliance.has(results[0].id));
  const ids = results.map((r) => r.id);
  t.true(
    ids.includes(
      'can-i-keep-my-email-processing-and-storage-in-the-eu-data-residency'
    )
  );
  for (const result of results) {
    t.is(typeof result.question, 'string');
    t.is(typeof result.topic, 'string');
    t.is(typeof result.score, 'number');
    t.true(result.score > 0);
  }

  // The narrower follow-up lands on the residency answer first.
  t.is(
    suggestFaq(
      index,
      'Can our emails for the kindergartens be kept in the EU?'
    )[0].id,
    'can-i-keep-my-email-processing-and-storage-in-the-eu-data-residency'
  );
  t.is(
    suggestFaq(
      index,
      'If not, exactly where is inbound mail for a custom domain processed and stored, and for how long?'
    )[0].id,
    'where-is-inbound-email-for-my-domain-processed-and-stored-and-for-how-long'
  );
});

test('suggestFaq surfaces the DPA and subprocessor answers for an annex question', (t) => {
  const ids = new Set(
    suggestFaq(
      index,
      'Can you point me at your current DPA and your sub-processor list, so I can name you correctly in our own annex?'
    ).map((r) => r.id)
  );
  t.true(ids.has('do-you-offer-a-data-processing-agreement-dpa'));
  t.true(
    ids.has('how-do-i-list-forward-email-as-a-subprocessor-in-my-own-dpa')
  );
});

test('suggestFaq ranks a heading match above an answer-only match and honours limit', (t) => {
  const results = suggestFaq(index, 'error logs');
  t.is(results[0].id, 'do-you-store-error-logs');
  t.is(suggestFaq(index, 'error logs', { limit: 2 }).length, 2);
  t.is(suggestFaq(index, 'error logs', { limit: 0 }).length, 5);
});

test('suggestFaq matches a single meaningful word against headings', (t) => {
  const ids = suggestFaq(index, 'imap').map((r) => r.id);
  t.true(ids.includes('do-you-support-receiving-email-with-imap'));
});
