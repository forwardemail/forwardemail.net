/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const RE2 = require('re2');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const _ = require('#helpers/lodash');

const isEmail = require('#helpers/is-email');
const {
  addMicrosoftAllowlist,
  removeMicrosoftAllowlist
} = require('#helpers/is-microsoft-allowlisted');

async function list(ctx) {
  let results = await ctx.client.keys('microsoft:*');

  if (isSANB(ctx.query.key)) {
    const regex = new RE2(_.escapeRegExp(ctx.query.key), 'i');

    // go in reverse so we can mutate the array
    let i = results.length;
    while (i--) {
      if (!regex.test(results[i].replace('microsoft:', '')))
        results.splice(i, 1);
    }
  }

  if (isSANB(ctx.query.sort)) {
    if (ctx.query.sort === 'key' || ctx.query.sort === '-key')
      results = results.sort();
    if (ctx.query.sort === '-key') results = results.reverse();
  }

  // Get TTL information for each entry
  const resultsWithTTL = await Promise.all(
    results.map(async (key) => {
      const ttl = await ctx.client.ttl(key);
      return {
        key,
        identifier: key.replace('microsoft:', ''),
        ttl: ttl > 0 ? ttl : null,
        type: determineEntryType(key.replace('microsoft:', ''))
      };
    })
  );

  const itemCount = resultsWithTTL.length;
  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  // slice for page
  const paginatedResults = resultsWithTTL.slice(
    ctx.paginate.skip,
    ctx.query.limit + ctx.paginate.skip
  );

  if (ctx.accepts('html'))
    return ctx.render('admin/microsoft-allowlist', {
      results: paginatedResults,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });

  const table = await ctx.render('admin/microsoft-allowlist/_table', {
    results: paginatedResults,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });

  ctx.body = { table };
}

function determineEntryType(identifier) {
  if (identifier.includes('*')) return 'wildcard';
  if (isEmail(identifier)) return 'email';
  return 'domain';
}

function validateMicrosoftIdentifier(value) {
  // Must be onmicrosoft.com related
  if (
    !value.toLowerCase().includes('onmicrosoft.com') &&
    !value.includes('*')
  ) {
    return false;
  }

  // Handle wildcard patterns (e.g., "contoso.*")
  if (value.includes('*')) {
    const parts = value.split('*');
    if (parts.length !== 2 || !parts[0] || parts[1] !== '') {
      return false;
    }

    // Ensure wildcard is for a reasonable tenant name
    return /^[a-zA-Z\d-]+\.\*$/.test(value);
  }

  // Handle email addresses
  if (value.includes('@')) {
    return isEmail(value) && value.toLowerCase().endsWith('.onmicrosoft.com');
  }

  // Handle domain names
  return value.toLowerCase().endsWith('.onmicrosoft.com');
}

async function validate(ctx, next) {
  //
  // NOTE: Microsoft allowlist values can be:
  //
  // "user@tenant.onmicrosoft.com" (specific email)
  // "tenant.onmicrosoft.com" (entire domain)
  // "tenant.*" (wildcard for tenant)
  //
  if (!isSANB(ctx.request.body.value))
    throw Boom.badRequest(ctx.translateError('INVALID_KEY_VALUE'));

  const value = ctx.request.body.value.trim();

  if (!validateMicrosoftIdentifier(value)) {
    throw Boom.badRequest(
      'Invalid Microsoft identifier. Must be an onmicrosoft.com email, domain, or tenant wildcard (e.g., tenant.*)'
    );
  }

  // Validate TTL if provided
  if (ctx.request.body.ttl) {
    const ttl = Number.parseInt(ctx.request.body.ttl, 10);
    if (Number.isNaN(ttl) || ttl < 60 || ttl > 2592000) {
      // 1 minute to 30 days
      throw Boom.badRequest(
        'TTL must be between 60 seconds and 30 days (2592000 seconds)'
      );
    }
  }

  return next();
}

async function create(ctx) {
  const value = ctx.request.body.value.trim().toLowerCase();
  const ttl = ctx.request.body.ttl
    ? Number.parseInt(ctx.request.body.ttl, 10)
    : 2592000; // 30 days default

  // Add to Microsoft allowlist
  const success = await addMicrosoftAllowlist(value, ctx.client, ttl);

  if (!success) {
    throw Boom.badRequest('Failed to add to Microsoft allowlist');
  }

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: `Added ${value} to Microsoft allowlist${
      ttl ? ` (TTL: ${Math.floor(ttl / 3600)}h)` : ''
    }`,
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

async function remove(ctx) {
  const value = ctx.request.body.value.trim().toLowerCase();

  // Remove from Microsoft allowlist
  const success = await removeMicrosoftAllowlist(value, ctx.client);

  if (!success) {
    throw Boom.badRequest('Entry not found in Microsoft allowlist');
  }

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: `Removed ${value} from Microsoft allowlist`,
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

async function bulkAdd(ctx) {
  if (
    !Array.isArray(ctx.request.body.values) ||
    ctx.request.body.values.length === 0
  ) {
    throw Boom.badRequest('No values provided for bulk add');
  }

  const ttl = ctx.request.body.ttl
    ? Number.parseInt(ctx.request.body.ttl, 10)
    : 2592000;
  const results = {
    added: [],
    failed: []
  };

  for (const value of ctx.request.body.values) {
    const trimmedValue = value.trim().toLowerCase();

    if (!validateMicrosoftIdentifier(trimmedValue)) {
      results.failed.push(`${trimmedValue} (invalid format)`);
      continue;
    }

    const success = await addMicrosoftAllowlist(trimmedValue, ctx.client, ttl);
    if (success) {
      results.added.push(trimmedValue);
    } else {
      results.failed.push(`${trimmedValue} (add failed)`);
    }
  }

  ctx.flash('custom', {
    title: ctx.request.t('Bulk Add Results'),
    text: `Added: ${results.added.length}, Failed: ${results.failed.length}`,
    type: results.failed.length === 0 ? 'success' : 'warning',
    toast: true,
    showConfirmButton: false,
    timer: 5000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { results };
}

module.exports = {
  list,
  validate,
  create,
  remove,
  bulkAdd
};
