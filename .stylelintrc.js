/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// Class names in the fe design system: fe-block, fe-block__element,
// fe-block--modifier, fe-block__element--modifier, words joined by hyphens.
// Two hooks from outside the system are allowed alongside them: `is-*`
// state classes toggled by scripts, and the `no-js` class _meta.pug strips.
const FE_CLASS =
  '^(fe-[a-z0-9]+(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?|is-[a-z]+(-[a-z]+)*|no-js)$';

module.exports = {
  extends: ['stylelint-config-recommended-scss'],
  plugins: ['stylelint-declaration-strict-value'],
  overrides: [
    {
      // The fe design system is token driven: colours, sizes and radii come
      // from the --fe-* custom properties, never from literals, and every
      // selector follows one naming form. These rules make that mechanical.
      files: ['assets/css/_fe-*.scss'],
      rules: {
        'scale-unlimited/declaration-strict-value': [
          [
            'color',
            'background-color',
            'border-color',
            'border-inline-start-color',
            'border-top-color',
            'font-size',
            'font-family',
            'border-radius',
            'box-shadow'
          ],
          {
            ignoreValues: [
              // a token, or a list that starts with one (layered shadows)
              '/^var\\(/',
              'transparent',
              'inherit',
              'currentColor',
              'none',
              '0',
              // the raised-label chip in the FAQ and the dropdown header
              // sizes are the two deliberate off-scale values, documented
              // where they are used
              '0.75rem'
            ],
            // Sass interpolation of a palette variable (the tokens file) and
            // the surface-context overrides both resolve to var()/tokens.
            ignoreFunctions: true
          }
        ],
        'selector-class-pattern': [
          FE_CLASS,
          {
            resolveNestedSelectors: true,
            message:
              'fe classes are fe-block, fe-block__element or fe-block--modifier'
          }
        ],
        'declaration-no-important': true
      }
    },
    {
      // These files style bootstrap's own classes on the fe surfaces (the
      // bar, the footer, the modals, authored FAQ markdown), so the naming
      // rule cannot apply. The tokens file interpolates palette hex values
      // on purpose.
      files: [
        'assets/css/_fe-tokens.scss',
        'assets/css/_fe-nav.scss',
        'assets/css/_fe-footer.scss',
        'assets/css/_fe-modal.scss',
        'assets/css/_fe-faq.scss'
      ],
      rules: {
        'selector-class-pattern': null,
        'scale-unlimited/declaration-strict-value': null
      }
    },
    {
      // The modal restyle and the FAQ's authored-markdown callouts still
      // outrank bootstrap utilities with !important; the bar and the footer
      // no longer need to.
      files: ['assets/css/_fe-modal.scss', 'assets/css/_fe-faq.scss'],
      rules: {
        'declaration-no-important': null
      }
    }
  ]
};
