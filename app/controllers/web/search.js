/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');

const SearchResults = require('#models/search-results');

async function search(ctx) {
  const results = isSANB(ctx.query.q)
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
        .limit(25)
    : [];

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

  if (ctx.accepts('html')) return ctx.render('search', { results });

  return ctx.render('_search-results', { results });
}

module.exports = search;
