module.exports = {
  prettier: true,
  space: true,
  extends: ['xo-lass'],
  rules: {
    'no-warning-comments': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/no-process-exit': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'max-depth': 'off'
  },
  overrides: [
    {
      files: ['assets/js/*.js', 'assets/js/**/*.js'],
      envs: ['browser'],
      plugins: ['compat', 'no-smart-quotes'],
      rules: {
        'compat/compat': 'error',
        'no-smart-quotes/no-smart-quotes': 'error',
        'n/prefer-global/process': 'off',
        'import/no-unassigned-import': 'off'
      }
    }
  ]
};
