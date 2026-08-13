/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const isTruthSourceArc = require('#helpers/is-truth-source-arc');

const truthSources = new Set(['google.com', 'microsoft.com']);

test('accepts a passing ARC chain sealed by a configured truth source', (t) => {
  t.true(
    isTruthSourceArc(
      {
        status: { result: 'pass' },
        signature: { signingDomain: 'mail.google.com' }
      },
      truthSources
    )
  );
});

test('does not trust a passing ARC chain from an unconfigured sealer', (t) => {
  t.false(
    isTruthSourceArc(
      {
        status: { result: 'pass' },
        signature: { signingDomain: 'arc.example.net' }
      },
      truthSources
    )
  );
});

test('does not trust a missing, failing, or incomplete ARC chain', (t) => {
  t.false(isTruthSourceArc(undefined, truthSources));
  t.false(
    isTruthSourceArc(
      {
        status: { result: 'fail' },
        signature: { signingDomain: 'mail.google.com' }
      },
      truthSources
    )
  );
  t.false(isTruthSourceArc({ status: { result: 'pass' } }, truthSources));
});
