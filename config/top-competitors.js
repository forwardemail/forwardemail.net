/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// The services whose "vs" comparison pages are listed in the sitemap: each
// pair of these. The other pairs (over 6,000 of them) are thin pages, so the
// sitemap leaves them out and the "Compare with..." menus link to them with
// rel="nofollow" (see app/views/compare.pug).
module.exports = [
  'forward-email',
  'proton-mail',
  'gmail',
  'tutanota',
  'fastmail',
  'zoho-mail',
  'outlook-com',
  'yahoo',
  'hey',
  'mailbox-org',
  'posteo',
  'startmail',
  'runbox',
  'mailfence',
  'skiff'
];
