/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

// TLDs whose WHOIS servers are frequently unreachable or return unreliable
// results.  These are excluded from generated suggestions.
const UNRELIABLE_TLDS = new Set([
  'co', // whois.nic.co — DNS resolution frequently fails
  'co.in' // whois.registry.in — DNS resolution frequently fails
]);

// Word lists for generating creative domain name suggestions
// (Inspired by @ngneat/falso word data — inlined to avoid bundling the full library)
const ADJECTIVES = [
  'adaptable',
  'alluring',
  'ambitious',
  'amusing',
  'artistic',
  'awesome',
  'bold',
  'bright',
  'brilliant',
  'captivating',
  'charismatic',
  'cheerful',
  'classic',
  'clever',
  'creative',
  'crisp',
  'dashing',
  'delightful',
  'dependable',
  'distinctive',
  'dynamic',
  'elegant',
  'energetic',
  'enthusiastic',
  'essential',
  'exquisite',
  'flexible',
  'friendly',
  'futuristic',
  'genuine',
  'gleaming',
  'glowing',
  'graceful',
  'healthy',
  'innovative',
  'inspired',
  'intelligent',
  'intuitive',
  'inventive',
  'jubilant',
  'lively',
  'luminous',
  'magnetic',
  'majestic',
  'meticulous',
  'modern',
  'motivated',
  'natural',
  'neat',
  'opulent',
  'organic',
  'playful',
  'plush',
  'polished',
  'powerful',
  'precise',
  'radiant',
  'refined',
  'refreshing',
  'reliable',
  'robust',
  'savvy',
  'serene',
  'sleek',
  'smooth',
  'sophisticated',
  'sparkling',
  'sturdy',
  'stylish',
  'sublime',
  'timeless',
  'trendy',
  'unique',
  'versatile',
  'vibrant',
  'vigorous',
  'vivid',
  'warm',
  'wholesome',
  'witty'
];

const NOUNS = [
  'adventurer',
  'advisor',
  'ally',
  'architect',
  'artist',
  'astronomer',
  'athlete',
  'author',
  'bird',
  'boat',
  'book',
  'boss',
  'bridge',
  'builder',
  'buyer',
  'castle',
  'chef',
  'cloud',
  'coach',
  'companion',
  'composer',
  'consultant',
  'creator',
  'critic',
  'curator',
  'dancer',
  'designer',
  'director',
  'discoverer',
  'doctor',
  'driver',
  'editor',
  'engineer',
  'explorer',
  'expert',
  'fan',
  'farmer',
  'flower',
  'forest',
  'friend',
  'garden',
  'guardian',
  'guide',
  'helper',
  'hero',
  'house',
  'innovator',
  'inventor',
  'journalist',
  'king',
  'leader',
  'librarian',
  'listener',
  'mentor',
  'mountain',
  'musician',
  'observer',
  'ocean',
  'owner',
  'painter',
  'participant',
  'partner',
  'philosopher',
  'phone',
  'photographer',
  'physicist',
  'pilot',
  'pioneer',
  'plane',
  'poet',
  'prince',
  'producer',
  'queen',
  'reader',
  'scholar',
  'scientist',
  'sculptor',
  'singer',
  'specialist',
  'star',
  'teacher',
  'trader',
  'traveler',
  'warrior',
  'writer'
];

const VERBS = [
  'bypass',
  'calculate',
  'compress',
  'connect',
  'copy',
  'generate',
  'index',
  'input',
  'navigate',
  'override',
  'parse',
  'program',
  'quantify',
  'reboot',
  'synthesize',
  'transmit'
];

// Popular TLDs for generating suggestions
// NOTE: .co and .co.in are excluded because their WHOIS servers
// (whois.nic.co and whois.registry.in) are frequently unreachable,
// causing availability checks to fail and show false negatives.
const POPULAR_TLDS = [
  'com',
  'net',
  'org',
  'io',
  'dev',
  'app',
  'ai',
  'me',
  'info',
  'cc',
  'xyz',
  'tech',
  'online',
  'site',
  'store',
  'shop',
  'cloud',
  'email',
  'blog',
  'design',
  'digital',
  'live',
  'world',
  'fun',
  'space'
];

// Common prefixes and suffixes for domain name variations
const PREFIXES = [
  'get',
  'try',
  'use',
  'my',
  'the',
  'go',
  'hey',
  'hi',
  'join',
  'with'
];

const SUFFIXES = [
  'app',
  'hq',
  'hub',
  'lab',
  'io',
  'ly',
  'ify',
  'ful',
  'now',
  'up'
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, n) {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(pick(arr));
  }

  return result;
}

function sanitize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z\d-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 63);
}

function generateVariations(keyword) {
  const base = sanitize(keyword);
  if (base.length === 0) return [];

  const variations = new Set();
  variations.add(base);

  // Add prefix variations
  for (const prefix of PREFIXES) {
    variations.add(sanitize(`${prefix}${base}`));
    variations.add(sanitize(`${prefix}-${base}`));
  }

  // Add suffix variations
  for (const suffix of SUFFIXES) {
    variations.add(sanitize(`${base}${suffix}`));
    variations.add(sanitize(`${base}-${suffix}`));
  }

  // Add creative combinations using word lists
  const adjectives = pickN(ADJECTIVES, 5);
  const nouns = pickN(NOUNS, 5);
  const verbs = pickN(VERBS, 5);
  for (let i = 0; i < 5; i++) {
    const adj = sanitize(adjectives[i] || '');
    const noun = sanitize(nouns[i] || '');
    const verb = sanitize(verbs[i] || '');
    if (adj) {
      variations.add(sanitize(`${adj}${base}`));
      variations.add(sanitize(`${adj}-${base}`));
    }

    if (noun) {
      variations.add(sanitize(`${base}${noun}`));
      variations.add(sanitize(`${base}-${noun}`));
    }

    if (verb) {
      variations.add(sanitize(`${verb}${base}`));
    }
  }

  // Filter out empty strings and names that are too short
  return [...variations].filter((v) => v.length >= 2 && v.length <= 63);
}

function generateRandomNames() {
  const names = new Set();
  const adjectives = pickN(ADJECTIVES, 15);
  const nouns = pickN(NOUNS, 15);
  const verbs = pickN(VERBS, 15);
  for (let i = 0; i < 15; i++) {
    const adj = sanitize(adjectives[i] || '');
    const noun = sanitize(nouns[i] || '');
    const verb = sanitize(verbs[i] || '');
    if (adj && noun) {
      names.add(sanitize(`${adj}${noun}`));
      names.add(sanitize(`${adj}-${noun}`));
    }

    if (verb && noun) {
      names.add(sanitize(`${verb}${noun}`));
    }
  }

  return [...names].filter((v) => v.length >= 4 && v.length <= 20);
}

// POST /domain-suggestions
// body: { q: 'keyword', tlds: 'com,net,org' }
// response: { domains: ['keyword.com', ...], type: 'single'|'bulk' }
async function domainSuggestions(ctx) {
  const query = ctx.request.body.q;
  let tlds = POPULAR_TLDS.slice(0, 10);

  // If user specified TLDs via body param
  if (isSANB(ctx.request.body.tlds)) {
    tlds = ctx.request.body.tlds
      .split(',')
      .map((t) => t.trim().replace(/^\./, '').toLowerCase())
      .filter((t) => t.length > 0 && !UNRELIABLE_TLDS.has(t))
      .slice(0, 30);
  }

  let names;
  if (isSANB(query)) {
    const q = query.trim().toLowerCase();
    // Check if it's a full domain (has a dot)
    if (q.includes('.')) {
      const parts = q.split('.');
      const name = sanitize(parts[0]);
      const tld = parts.slice(1).join('.').toLowerCase();
      if (!name || !tld) {
        throw Boom.badRequest(ctx.translateError('INVALID_DOMAIN'));
      }

      // Return just this one domain for single-domain check
      ctx.body = { domains: [`${name}.${tld}`], type: 'single' };
      return;
    }

    names = generateVariations(q);
  } else {
    names = generateRandomNames();
  }

  // Combine names with TLDs to create domain suggestions
  const domains = [];
  for (const name of names) {
    for (const tld of tlds) {
      domains.push(`${name}.${tld}`);
    }
  }

  // Shuffle and limit to a reasonable number
  const shuffled = domains.sort(() => Math.random() - 0.5);
  ctx.body = { domains: shuffled.slice(0, 100), type: 'bulk' };
}

module.exports = domainSuggestions;
