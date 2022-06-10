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

    lintJs: 'gulp xo',
    lintMd: 'gulp remark',
    lintPug: 'gulp pug',
    lintPkg: 'fixpack',
    lint: concurrent.nps('lint-js', 'lint-md', 'lint-pug', 'lintPkg'),

    // <https://github.com/kentcdodds/nps-utils/issues/24>
    pretest: concurrent.nps('lint', 'build-test'),

    test: 'nyc ava',
    testUpdateSnapshots: series('nps pretest', 'ava --update-snapshots')
  }
};
