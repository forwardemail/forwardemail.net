/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { zxcvbn, zxcvbnOptions } = require('@zxcvbn-ts/core');
const zxcvbnArPackage = require('@zxcvbn-ts/language-ar');
const zxcvbnCommonPackage = require('@zxcvbn-ts/language-common');
const zxcvbnCsPackage = require('@zxcvbn-ts/language-cs');
const zxcvbnDePackage = require('@zxcvbn-ts/language-de');
const zxcvbnEnPackage = require('@zxcvbn-ts/language-en');
const zxcvbnEsEsPackage = require('@zxcvbn-ts/language-es-es');
const zxcvbnFiPackage = require('@zxcvbn-ts/language-fi');
const zxcvbnFrPackage = require('@zxcvbn-ts/language-fr');
const zxcvbnIdPackage = require('@zxcvbn-ts/language-id');
const zxcvbnItPackage = require('@zxcvbn-ts/language-it');
const zxcvbnJaPackage = require('@zxcvbn-ts/language-ja');
const zxcvbnNlBePackage = require('@zxcvbn-ts/language-nl-be');
const zxcvbnPlPackage = require('@zxcvbn-ts/language-pl');
const zxcvbnPtBrPackage = require('@zxcvbn-ts/language-pt-br');

const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnArPackage.dictionary,
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnCsPackage.dictionary,
    ...zxcvbnDePackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
    ...zxcvbnEsEsPackage.dictionary,
    ...zxcvbnFiPackage.dictionary,
    ...zxcvbnFrPackage.dictionary,
    ...zxcvbnIdPackage.dictionary,
    ...zxcvbnItPackage.dictionary,
    ...zxcvbnJaPackage.dictionary,
    ...zxcvbnNlBePackage.dictionary,
    ...zxcvbnPlPackage.dictionary,
    ...zxcvbnPtBrPackage.dictionary
  }
};

zxcvbnOptions.setOptions(options);

module.exports = zxcvbn;
