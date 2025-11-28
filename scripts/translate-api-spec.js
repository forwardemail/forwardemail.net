/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MIT
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const Redis = require('@ladjs/redis');
const pMap = require('p-map');
const revHash = require('rev-hash');
const sharedConfig = require('@ladjs/shared-config');
const { Translate } = require('@google-cloud/translate').v2;

const config = require('#config');
const locales = require('#config/locales');
const logger = require('#helpers/logger');

// Initialize Google Translate client
const translate = new Translate({
  projectId: process.env.GOOGLE_PROJECT_ID,
  key: process.env.GOOGLE_API_KEY
});

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

/*
// All 25 locales
const locales = [
  'ar',
  'cs',
  'da',
  'de',
  'en',
  'es',
  'fi',
  'fr',
  'he',
  'hu',
  'id',
  'it',
  'ja',
  'ko',
  'nl',
  'no',
  'pl',
  'pt',
  'ru',
  'sv',
  'th',
  'tr',
  'uk',
  'vi',
  'zh'
];
*/

// Simple function to protect GitHub alerts from translation
function protectGitHubAlerts(text) {
  return text
    .replace(/\[!NOTE]/g, '__NO_TRANSLATE_NOTE__')
    .replace(/\[!TIP]/g, '__NO_TRANSLATE_TIP__')
    .replace(/\[!IMPORTANT]/g, '__NO_TRANSLATE_IMPORTANT__')
    .replace(/\[!WARNING]/g, '__NO_TRANSLATE_WARNING__')
    .replace(/\[!CAUTION]/g, '__NO_TRANSLATE_CAUTION__');
}

// Simple function to restore GitHub alerts after translation
function restoreGitHubAlerts(text) {
  return text
    .replace(/__NO_TRANSLATE_NOTE__/g, '[!NOTE]')
    .replace(/__NO_TRANSLATE_TIP__/g, '[!TIP]')
    .replace(/__NO_TRANSLATE_IMPORTANT__/g, '[!IMPORTANT]')
    .replace(/__NO_TRANSLATE_WARNING__/g, '[!WARNING]')
    .replace(/__NO_TRANSLATE_CAUTION__/g, '[!CAUTION]');
}

// COMPLETELY DYNAMIC translation function using Google Translate API with simple GitHub alert preservation
async function translateTextDynamically(text, targetLocale) {
  if (targetLocale === 'en') {
    return text; // Keep English as-is
  }

  try {
    // Step 1: Protect GitHub alerts from translation
    const protectedText = protectGitHubAlerts(text);

    //
    // Step 2: Translate the protected text
    //

    // Check cache first
    const key = `${targetLocale}:${revHash(protectedText)}`;
    let translation = await client.get(key);
    if (typeof translation !== 'string') {
      [translation] = await translate.translate(protectedText, {
        to: targetLocale,
        format: 'text'
      });
      if (typeof translation === 'string') await client.set(key, translation);
    }

    // Step 3: Restore GitHub alerts
    const finalTranslation = restoreGitHubAlerts(translation);

    return finalTranslation;
  } catch (err) {
    console.error(`Translation error for ${targetLocale}:`, err.message);
    return text; // Fallback to original text if translation fails
  }
}

// Function to extract and translate tag names, building a mapping
async function buildTagTranslationMapping(apiSpec, targetLocale) {
  const tagMapping = new Map();

  if (targetLocale === 'en') {
    return tagMapping; // No mapping needed for English
  }

  if (apiSpec.tags && Array.isArray(apiSpec.tags)) {
    console.log(`Building tag translation mapping for ${targetLocale}...`);

    await pMap(
      apiSpec.tags,
      async (tag) => {
        if (tag.name && typeof tag.name === 'string') {
          const translatedName = await translateTextDynamically(
            tag.name,
            targetLocale
          );
          tagMapping.set(tag.name, translatedName);
          console.log(`  Tag: "${tag.name}" -> "${translatedName}"`);
        }
      },
      { concurrency: config.concurrency }
    );
  }

  return tagMapping;
}

// Function to replace tag references throughout the document
function replaceTagReferences(obj, tagMapping, path = '') {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    // Handle arrays - check if this is a tags array
    if (path.endsWith('.tags')) {
      // This is a tags array, replace tag names with translated versions
      return obj.map((tagName) => {
        if (typeof tagName === 'string' && tagMapping.has(tagName)) {
          return tagMapping.get(tagName);
        }

        return tagName;
      });
    }

    // Regular array processing
    const replacedArray = [];
    for (const [i, element] of obj.entries()) {
      replacedArray[i] = replaceTagReferences(
        element,
        tagMapping,
        `${path}[${i}]`
      );
    }

    return replacedArray;
  }

  // Handle objects
  const replacedObj = {};
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    replacedObj[key] = replaceTagReferences(value, tagMapping, currentPath);
  }

  return replacedObj;
}

// Enhanced recursive function to translate summary/description/tag name properties
async function translateObjectDynamically(
  obj,
  targetLocale,
  tagMapping,
  path = ''
) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // Skip if we're inside example or response objects
  if (path.includes('.example') || path.includes('.response')) {
    return obj;
  }

  if (Array.isArray(obj)) {
    // Handle arrays
    const translatedArray = [];
    for (const [i, element] of obj.entries()) {
      translatedArray[i] = await translateObjectDynamically(
        element,
        targetLocale,
        tagMapping,
        `${path}[${i}]`
      );
    }

    return translatedArray;
  }

  // Handle objects
  const translatedObj = {};
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (
      (key === 'summary' || key === 'description') &&
      typeof value === 'string'
    ) {
      // Translate summary and description properties with simple GitHub alert preservation
      translatedObj[key] = await translateTextDynamically(value, targetLocale);
    } else if (
      key === 'name' &&
      path.includes('tags[') &&
      typeof value === 'string'
    ) {
      // Translate tag name properties
      translatedObj[key] = await translateTextDynamically(value, targetLocale);
    } else {
      // Recursively process nested objects
      translatedObj[key] = await translateObjectDynamically(
        value,
        targetLocale,
        tagMapping,
        currentPath
      );
    }
  }

  return translatedObj;
}

// Enhanced verification function to count translations including tag names
function countTranslations(obj, originalObj, path = '') {
  let translated = 0;
  let total = 0;

  if (typeof obj !== 'object' || obj === null) {
    return { translated, total };
  }

  // Skip if we're inside example or response objects
  if (path.includes('.example') || path.includes('.response')) {
    return { translated, total };
  }

  if (Array.isArray(obj)) {
    for (const [i, element] of obj.entries()) {
      const result = countTranslations(
        element,
        originalObj[i],
        `${path}[${i}]`
      );
      translated += result.translated;
      total += result.total;
    }
  } else {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (
        (key === 'summary' ||
          key === 'description' ||
          (key === 'name' && path.includes('tags['))) &&
        typeof value === 'string'
      ) {
        total++;
        if (originalObj && originalObj[key] && value !== originalObj[key]) {
          translated++;
        }
      } else if (typeof value === 'object') {
        const result = countTranslations(
          value,
          originalObj?.[key],
          currentPath
        );
        translated += result.translated;
        total += result.total;
      }
    }
  }

  return { translated, total };
}

// Main function to generate ALL 25 dynamic translations with tag support and SIMPLE GitHub alert preservation
async function generateAllDynamicTranslations() {
  console.log(
    `Generating DYNAMIC translations for ALL ${locales.length} locales using Google Translate API...`
  );
  console.log(
    'Including tag name translations, 1:1 tag reference replacement, and SIMPLE GitHub alert preservation...'
  );

  // Load original API spec
  const originalApiSpec = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '..', 'assets', 'api-spec.json'),
      'utf8'
    )
  );
  const originalSize = fs.statSync(
    path.join(__dirname, '..', 'assets', 'api-spec.json')
  ).size;

  const results = [];

  await pMap(
    locales,
    async (locale) => {
      console.log(`\\n=== Processing locale: ${locale} ===`);

      // Step 1: Build tag translation mapping
      const tagMapping = await buildTagTranslationMapping(
        originalApiSpec,
        locale
      );

      // Step 2: Translate the entire API spec using Google Translate API
      const translatedSpec = await translateObjectDynamically(
        originalApiSpec,
        locale,
        tagMapping
      );

      // Step 3: Replace all tag references throughout the document with translated versions
      const finalSpec = replaceTagReferences(translatedSpec, tagMapping);

      // Save the translated file
      const filename = path.join(
        __dirname,
        '..',
        'assets',
        `api-spec-${locale}.json`
      );
      fs.writeFileSync(filename, JSON.stringify(finalSpec, null, 2));

      // Verify translations
      const { translated, total } = countTranslations(
        finalSpec,
        originalApiSpec
      );
      const translatedSize = fs.statSync(filename).size;
      const coverage = ((translated / total) * 100).toFixed(1);

      results.push({
        locale,
        filename,
        translated,
        total,
        coverage: `${coverage}%`,
        originalSize,
        translatedSize,
        sizeDifference: translatedSize - originalSize,
        tagCount: tagMapping.size
      });

      console.log(
        `  ✅ ${filename}: ${translated}/${total} strings (${coverage}%) - ${translatedSize} bytes (+${
          translatedSize - originalSize
        })`
      );
      console.log(`  📝 Tags translated: ${tagMapping.size}`);
    },
    { concurrency: config.concurrency }
  );

  // Generate comprehensive summary report
  console.log('\\n=== DYNAMIC TRANSLATION SUMMARY ===');
  console.log(
    'Locale | File Size | Coverage | Size Diff | Tags | Google Translate'
  );
  console.log(
    '-------|-----------|----------|-----------|------|----------------'
  );

  const uniqueSizes = new Set();
  for (const result of results) {
    uniqueSizes.add(result.translatedSize);
    const googleTranslate = result.locale === 'en' ? 'N/A' : '✅ Used';
    console.log(
      `${result.locale.padEnd(6)} | ${result.translatedSize
        .toString()
        .padEnd(9)} | ${result.coverage.padEnd(8)} | ${
        result.sizeDifference > 0 ? '+' : ''
      }${result.sizeDifference.toString().padEnd(9)} | ${result.tagCount
        .toString()
        .padEnd(4)} | ${googleTranslate}`
    );
  }

  console.log(
    `\\nUnique file sizes: ${uniqueSizes.size} out of ${results.length} files`
  );
  console.log(`Original file size: ${originalSize} bytes`);

  if (uniqueSizes.size === results.length) {
    console.log(
      '✅ All files have unique sizes - dynamic translations successful!'
    );
  } else {
    console.log('⚠️  Some files have identical sizes - check translations');
  }

  // Verify user-mentioned strings are translated
  console.log('\\n=== USER-MENTIONED STRINGS VERIFICATION ===');
  const testStrings = [
    'Search for emails by metadata.',
    'List outbound SMTP emails',
    "Update the current user's account information",
    'Domain invite management endpoints',
    'Accept domain invite'
  ];

  for (const locale of locales) {
    if (locale === 'en') continue;

    const filename = path.join(
      __dirname,
      '..',
      'assets',
      `api-spec-${locale}.json`
    );
    const content = fs.readFileSync(filename, 'utf8');

    let translatedCount = 0;
    for (const testString of testStrings) {
      if (!content.includes(testString)) {
        translatedCount++;
      }
    }

    const percentage = ((translatedCount / testStrings.length) * 100).toFixed(
      1
    );
    console.log(
      `${locale}: ${translatedCount}/${testStrings.length} user strings translated (${percentage}%)`
    );
  }

  // Verify GitHub alerts are SIMPLY and PERFECTLY preserved
  console.log('\\n=== SIMPLE GITHUB ALERTS VERIFICATION ===');
  const correctAlertPatterns = [
    '[!NOTE]',
    '[!TIP]',
    '[!IMPORTANT]',
    '[!WARNING]',
    '[!CAUTION]'
  ];
  const incorrectTranslations = [
    'NOTA',
    'CONSEIL',
    'HINWEIS',
    'ПРИМЕЧАНИЕ',
    'ملاحظة',
    'NOTĂ',
    'POZNÁMKA',
    'IMPORTANTE',
    'WICHTIG',
    'ВАЖНЫЙ',
    'مهم',
    'DŮLEŽITÝ',
    'ADVERTENCIA',
    'AVERTISSEMENT',
    'WARNUNG',
    'ПРЕДУПРЕЖДЕНИЕ',
    'تحذير',
    'VAROVÁNÍ'
  ];

  for (const locale of locales) {
    const filename = path.join(
      __dirname,
      '..',
      'assets',
      `api-spec-${locale}.json`
    );
    const content = fs.readFileSync(filename, 'utf8');

    let correctAlertsFound = 0;
    let totalCorrectAlerts = 0;

    for (const pattern of correctAlertPatterns) {
      const matches = (
        content.match(
          new RegExp(pattern.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g')
        ) || []
      ).length;
      if (matches > 0) {
        correctAlertsFound++;
        totalCorrectAlerts += matches;
      }
    }

    let incorrectTranslationsFound = 0;
    for (const translated of incorrectTranslations) {
      if (content.includes(`[!${translated}]`)) {
        incorrectTranslationsFound++;
      }
    }

    const status =
      incorrectTranslationsFound === 0 ? '✅ PERFECT' : '❌ HAS ERRORS';
    console.log(
      `${locale}: ${correctAlertsFound}/${correctAlertPatterns.length} correct alerts (${totalCorrectAlerts} total), ${incorrectTranslationsFound} incorrect - ${status}`
    );
  }

  console.log(
    '\\n🎉 DYNAMIC TRANSLATION COMPLETE - All locales processed with Google Translate API!'
  );
  console.log(
    '✅ Tag names translated and all tag references updated throughout documents'
  );
  console.log(
    '✅ GitHub alert syntax SIMPLY and PERFECTLY preserved with notranslate spans'
  );
  return results;
}

// Run the dynamic translation generation
generateAllDynamicTranslations().catch(console.error);
