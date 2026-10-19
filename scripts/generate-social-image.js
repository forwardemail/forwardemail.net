/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// assets/img/social.png: the site's own image in the structured data (the
// organization's image and the alternatives pages' product image). It is the home page's Open Graph image (see
// helpers/open-graph-image.js), without the GitHub star count, which a file
// would freeze. Run again after the design of that image changes:
//
//   node scripts/generate-social-image.js
//

const path = require('node:path');
const process = require('node:process');
const { Buffer } = require('node:buffer');

const sharp = require('sharp');

const { renderOpenGraphImage } = require('#helpers/open-graph-image');

const SOCIAL_IMAGE = path.join(__dirname, '..', 'assets', 'img', 'social.png');

// the home page's title, and its description without the sentence that
// repeats the title (so it fits whole, with no ellipsis)
const TITLE = 'Free Email Forwarding for Custom Domains';
const DESCRIPTION =
  'Send & receive as you@yourdomain.com with unlimited aliases, 10GB storage & 100% open-source security.';

async function generateSocialImage(file = SOCIAL_IMAGE) {
  const svg = await renderOpenGraphImage({
    title: TITLE,
    description: DESCRIPTION,
    url: '/'
  });
  // (encoded as app/controllers/web/index.js encodes the Open Graph images)
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(file);
  return file;
}

module.exports = generateSocialImage;
module.exports.SOCIAL_IMAGE = SOCIAL_IMAGE;

if (require.main === module) {
  generateSocialImage()
    .then((file) => {
      console.log(`wrote ${file}`);
    })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}
