/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const getCloudflareRadarFeedbackUrl = require('#helpers/get-cloudflare-radar-feedback-url');

test('creates a domain-specific Cloudflare Radar change-request URL', (t) => {
  t.is(
    getCloudflareRadarFeedbackUrl('Outlooks.Link'),
    'https://radar.cloudflare.com/domains/outlooks.link'
  );
});

test('normalizes internationalized domains before building the Radar URL', (t) => {
  t.is(
    getCloudflareRadarFeedbackUrl('BÜCHER.EE'),
    'https://radar.cloudflare.com/domains/xn--bcher-kva.ee'
  );
});
