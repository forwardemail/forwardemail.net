/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

module.exports = {
  '*.md,!test/snapshots/**/*.md,!test/**/snapshots/**/*.md,!locales/README.md':
    [(filenames) => filenames.map((filename) => `remark ${filename} -qfo`)],
  'package.json': 'fixpack',
  '*.pug': ['prettier --write', 'pug-lint'],
  '*.js': 'xo --fix',
  '*.scss': 'stylelint --fix'
};
