/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const SearchResults = require('#models/search-results');

async function search(ctx) {
  if (isSANB(ctx.query.q) && ctx.query.q.length > 50)
    throw Boom.badRequest(ctx.translate('NO_RESULTS_FOUND'));

  //
  // search string should be A-Z, 0-9, _ only
  // otherwise rendering of `app/views/_search-results.pug`
  //
  if (isSANB(ctx.query.q))
    ctx.query.q = ctx.query.q.replace(/[\W_]+/g, ' ').trim();

  let results = isSANB(ctx.query.q)
    ? await SearchResults.find(
        {
          $text: {
            $search: ctx.query.q
          },
          locale: ctx.locale
        },
        {
          score: {
            $meta: 'textScore'
          }
        }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(50)
        .lean()
    : [];

  //
  // Re-rank results with phrase-match boosting.
  // MongoDB $text search splits on whitespace and OR-matches individual tokens.
  // This means "delete account" matches any doc containing "delete" OR "account",
  // which causes irrelevant pages to rank highly.
  //
  // We boost results where the exact phrase (case-insensitive) appears in the
  // title, header, or content fields so that the most relevant results float
  // to the top.
  //
  if (results.length > 0 && isSANB(ctx.query.q)) {
    const phrase = ctx.query.q.toLowerCase();
    const words = phrase.split(/\s+/).filter(Boolean);
    const hasMultipleWords = words.length > 1;

    results = results.map((doc) => {
      const titleLower = (doc.title || '').toLowerCase();
      const headerLower = (doc.header || '').toLowerCase();
      const contentLower = (doc.content || '').toLowerCase();

      let boost = 0;

      if (hasMultipleWords) {
        // Exact phrase match boosts
        if (headerLower.includes(phrase)) boost += 100;
        if (titleLower.includes(phrase)) boost += 50;
        if (contentLower.includes(phrase)) boost += 20;
      }

      // All individual words present (conjunction match)
      const allWordsInHeader = words.every((w) => headerLower.includes(w));
      const allWordsInTitle = words.every((w) => titleLower.includes(w));
      const allWordsInContent = words.every((w) => contentLower.includes(w));

      if (allWordsInHeader) boost += 30;
      if (allWordsInTitle) boost += 15;
      if (allWordsInContent) boost += 5;

      return {
        ...doc,
        _boostedScore: (doc.score || 0) + boost
      };
    });

    // Sort by boosted score descending
    results.sort((a, b) => b._boostedScore - a._boostedScore);

    // Trim to 25 results after re-ranking
    results = results.slice(0, 25);
  }

  if (isSANB(ctx.query.q) && results.length === 0 && ctx.accepts('html'))
    ctx.flash('custom', {
      title: ctx.request.t('Warning'),
      text: ctx.translate('NO_RESULTS_FOUND'),
      type: 'warning',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

  const title = `${results.length} ${
    results.length === 1
      ? ctx.state.t('search result')
      : ctx.state.t('search results')
  } ${ctx.state.t('for')} "${ctx.query.q}"`;

  ctx.state.meta = {
    title,
    description: title
  };

  if (ctx.accepts('html')) return ctx.render('search', { results });

  ctx.body = results;
}

module.exports = search;
