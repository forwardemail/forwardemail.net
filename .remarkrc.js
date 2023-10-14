/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

module.exports = {
  plugins: [
    'preset-github',
    [
      'remark-license',
      {
        file: 'https://github.com/forwardemail/forwardemail.net/blob/master/LICENSE.md',
        heading: '## License'
      }
    ]
  ]
};
