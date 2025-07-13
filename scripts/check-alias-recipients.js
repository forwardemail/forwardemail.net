/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');

const mongoose = require('mongoose');
const { Domains, Aliases } = require('#models');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose]
});

graceful.listen();

(async () => {
  await setupMongoose();

  //
  // go through all aliases
  // that are enabled
  // not wildcard
  // not starting with /
  // recipients $size > 0
  //
  // check where recipient has same as user
  //
  for await (const domain of Domains.find({
    plan: { $in: ['enhanced_protection', 'team', 'enterprise'] }
  })
    .lean()
    .select('id name')
    .cursor()
    .addCursorFlag('noCursorTimeout', true)) {
    for await (const alias of Aliases.find({
      domain: domain._id
    })) {
      if (alias.name === '*' || alias.name.startsWith('/') || !alias.is_enabled)
        continue;
      const foo = `${alias.name}@${domain.name}`;
      if (alias.recipients.some((r) => r.toLowerCase().trim() === foo))
        console.error(`${foo} from ${domain.id}`);
    }
  }

  process.exit(0);
})();
