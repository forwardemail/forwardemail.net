/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const SearchResults = require('#models/search-results');

async function search(ctx) {
  if (isSANB(ctx.query.q) && ctx.query.q.length > 50)
    return ctx.throw(Boom.badRequest(ctx.translate('NO_RESULTS_FOUND')));

  //
  // search string should be A-Z, 0-9, _ only
  // otherwise rendering of `app/views/_search-results.pug`
  //
  if (isSANB(ctx.query.q))
    ctx.query.q = ctx.query.q.replace(/[\W_]+/g, ' ').trim();

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
