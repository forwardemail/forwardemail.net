module.exports = {
  prettier: true,
  space: true,
  extends: ['xo-lass'],
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
