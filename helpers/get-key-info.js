/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * This file incorporates work covered by the following copyright and
 * permission notice:
 *
 *   WildDuck Mail Agent is licensed under the European Union Public License 1.2 or later.
 *   https://github.com/nodemailer/wildduck
 */

const Boom = require('@hapi/boom');
const openpgp = require('openpgp');
const tools = require('@forwardemail/wildduck/lib/tools');

const i18n = require('#helpers/i18n');

// <https://github.com/nodemailer/wildduck/blob/a15878c7d709473c5b0d4eec2062e9425c9b5e31/lib/api/users.js#L2480>
async function getKeyInfo(pubKeyArmored, locale = i18n.config.defaultLocale) {
  if (!pubKeyArmored) {
    return false;
  }

  const publicKey = await openpgp.readKey({
    armoredKey: tools.prepareArmoredPubKey(pubKeyArmored),
    config: { ignoreMalformedPackets: true }
  });

  if (!publicKey)
    throw Boom.badRequest(i18n.translateError('FAILED_TO_PROCESS_PUBLIC_KEY'));

  const fingerprint = publicKey.getFingerprint();
  const { name, address } = tools.getPGPUserId(publicKey);

  const ciphertext = await openpgp.encrypt({
    message: await openpgp.createMessage({ text: 'Hello, World!' }),
    encryptionKeys: publicKey, // for encryption
    format: 'armored',
    config: { minRSABits: 1024 }
  });

  if (ciphertext.startsWith('-----BEGIN PGP MESSAGE')) {
    // everything checks out
    return {
      name,
      address,
      fingerprint,
      publicKey
    };
  }

  throw Boom.badRequest(
    i18n.translateError('FAILED_TO_VERIFY_PUBLIC_KEY', locale)
  );
}

module.exports = getKeyInfo;
