/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const ms = require('ms');

const config = require('#config');
const { getFaqIndex, suggestFaq } = require('#helpers/get-faq-index');

// The help form asks this endpoint on every pause in typing. The cached index
// in redis carries every answer's full HTML, well over a megabyte per locale,
// which is far too much to fetch and parse per keystroke. So the fields
// suggestFaq actually reads are kept here per process and per locale, and the
// redis copy is only consulted when this expires. The markdown changes only on
// deploy, and a deploy restarts the process, so a short TTL is purely a guard.
const MEMO_TTL = ms('1h');
const memo = new Map();

async function getSuggestIndex(client, locale) {
  const hit = memo.get(locale);
  if (hit && hit.expires > Date.now()) return hit.index;

  const full = await getFaqIndex(client, config.views.root, locale);
  const index = {
    categories: full.categories.map((category) => ({
      title: category.title,
      questions: category.questions.map((q) => ({
        id: q.id,
        question: q.question,
        search: q.search,
        excerpt: q.excerpt
      }))
    }))
  };
  memo.set(locale, { index, expires: Date.now() + MEMO_TTL });
  return index;
}

async function faqSuggest(ctx) {
  const query = isSANB(ctx.query.q) ? ctx.query.q : '';

  let suggestions = [];
  if (query) {
    try {
      const index = await getSuggestIndex(ctx.client, ctx.locale);
      suggestions = suggestFaq(index, query).map((s) => ({
        id: s.id,
        question: s.question,
        topic: s.topic,
        url: ctx.state.l(`/faq#${s.id}`)
      }));
    } catch (err) {
      // Suggestions are a convenience under a form that works without them,
      // so a failure here is logged and answered with an empty list rather
      // than an error the client would have to handle.
      ctx.logger.error(err);
    }
  }

  // Varies per person's typing, so nothing upstream should hold on to it.
  ctx.set('Cache-Control', 'private, no-store');
  ctx.body = { suggestions };
}

module.exports = faqSuggest;
module.exports.getSuggestIndex = getSuggestIndex;
module.exports.memo = memo;
