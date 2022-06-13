const { series, concurrent } = require('nps-utils');

module.exports = {
  scripts: {
    all: series.nps('build', 'apps-and-watch'),
    appsAndWatch: concurrent.nps('apps', 'watch'),
    apps: concurrent.nps('bree', 'api', 'web'),

    webAndWatch: series.nps('build', 'web', 'watch'),

    bree: 'nodemon bree.js',
    api: 'nodemon api.js',
    web: 'nodemon web.js',

    watch: 'gulp watch',
    clean: 'gulp clean',
    build: 'gulp build',
    buildTest: 'NODE_ENV=test gulp build',
    publishAssets: 'gulp publish',

    //
    // TODO: once remark-preset-github is upgraded to ESM and all deps upgraded
    //       then we can change `-qo` to `-qfo` to get failure on warnings
    //       <https://github.com/remarkjs/remark-lint/blob/main/packages/remark-preset-lint-recommended/index.js>
    //
    lintMd: 'remark . -qo',
    lintPkg: 'fixpack',
    lintPug: 'prettier --write **/*.pug && pug-lint **/*.pug',
    lintJs: 'xo --fix',
    lintScss: 'stylelint --fix **/*.scss',

    lint: concurrent.nps(
      'lint-js',
      'lint-md',
      'lint-pug',
      'lint-pkg',
      'lint-scss'
    ),

    // <https://github.com/kentcdodds/nps-utils/issues/24>
    pretest: concurrent.nps('lint', 'build-test'),

    test: 'nyc ava',
    testUpdateSnapshots: series('nps pretest', 'ava --update-snapshots')
  }
};
