/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const { Buffer } = require('node:buffer');

const sharp = require('sharp');

//
// Open Graph image (1200 x 630) of a page.
//
// The image is an SVG built here and rasterized by sharp.  Its text is laid
// out from real measurements: every candidate line is rendered by the same
// engine that renders the final image and its ink width read back, so a
// title wraps or shrinks to fit, a description is cut at the last line that
// fits (with an ellipsis) and a long address is shortened -- nothing is
// ever cut off, whatever the language or the length of the text.
//
// The fonts live in assets/fonts/og (see fonts.conf there): sharp finds
// them through fontconfig, which is pointed at that directory unless the
// environment already provides its own configuration.
//
const FONTS_DIR = path.join(__dirname, '..', 'assets', 'fonts', 'og');
if (!process.env.FONTCONFIG_FILE)
  process.env.FONTCONFIG_FILE = path.join(FONTS_DIR, 'fonts.conf');

const WIDTH = 1200;
const HEIGHT = 630;
const MARGIN = 64;
const CONTENT_WIDTH = WIDTH - 2 * MARGIN;

// the body sits between these two rules
const HEADER_RULE_Y = 136;
const FOOTER_RULE_Y = 522;

const COLORS = {
  title: '#f4f7fb',
  body: '#a9b5c6',
  muted: '#7d8a9c',
  accent: '#5cc8ff',
  accentDeep: '#2f7cff'
};

const FONT = {
  sans: { family: 'Nunito Sans', weight: 400 },
  sansBold: { family: 'Nunito Sans', weight: 700 },
  mono: { family: 'Inconsolata-dz for Powerline', weight: 400 }
};

// text styles: font, size and tracking travel together into every render
const STYLE = {
  wordmark: { font: FONT.sansBold, size: 31, letterSpacing: -0.4 },
  stars: { font: FONT.sansBold, size: 24, letterSpacing: -0.3 },
  starsLabel: { font: FONT.mono, size: 18, letterSpacing: 1 },
  eyebrow: { font: FONT.mono, size: 22, letterSpacing: 2 },
  description: { font: FONT.sans, size: 28, letterSpacing: 0 },
  footer: { font: FONT.sans, size: 22, letterSpacing: 0 },
  footerStrong: { font: FONT.sansBold, size: 22, letterSpacing: 0 },
  pill: { font: FONT.sansBold, size: 21, letterSpacing: 0 }
};

// the title shrinks step by step until it fits on two lines
const TITLE_SIZES = [64, 58, 52, 46, 40];
const TITLE_MAX_LINES = 2;
const TITLE_LINE_HEIGHT = 1.12;
const DESCRIPTION_LINE_HEIGHT = 40;
// a two-line title leaves room for two lines of description, else three
const DESCRIPTION_MAX_LINES = [3, 2];

const ELLIPSIS = '\u2026';

const TRUSTED_BY = ['Netflix', 'Ubuntu', 'Linux', 'jQuery'];

// scripts written right to left (Hebrew, Arabic, Syriac, Thaana, N'Ko...)
const RTL_REGEX = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;
// the first strong character decides the direction of a paragraph
const STRONG_REGEX = /[\p{L}\p{N}]/u;

//
// Measurements are cached per style and string: words and lines repeat
// across pages and locales, so after a while most layouts need no render.
//
const MEASURE_CACHE_MAX = 20_000;
const measureCache = new Map();

// nothing wider than the canvas can be laid out; past this is "too wide"
const MEASURE_WIDTH = WIDTH + 100;

function escapeXml(string) {
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isRtl(string) {
  const match = STRONG_REGEX.exec(String(string));
  return Boolean(match) && RTL_REGEX.test(match[0]);
}

function textAttributes(style) {
  return `font-family="${escapeXml(style.font.family)}" font-weight="${
    style.font.weight
  }" font-size="${style.size}" letter-spacing="${style.letterSpacing || 0}"${
    style.rtl ? ' direction="rtl"' : ''
  }`;
}

function cacheKey(style, string) {
  return `${style.font.family}|${style.font.weight}|${style.size}|${
    style.letterSpacing || 0
  }|${style.rtl ? 'rtl' : 'ltr'}|${string}`;
}

function remember(key, value) {
  if (measureCache.size >= MEASURE_CACHE_MAX)
    measureCache.delete(measureCache.keys().next().value);
  measureCache.set(key, value);
}

//
// Width in pixels of the ink of each string (from its origin to its
// right-most pixel) when rendered with `style`, or Infinity for a string
// wider than the canvas.  Every string not cached yet is rendered in one
// go, one per row.
//
async function measure(style, strings) {
  const widths = Array.from({ length: strings.length });
  const pending = [];
  for (const [index, string] of strings.entries()) {
    const cached = measureCache.get(cacheKey(style, string));
    if (cached === undefined) pending.push(index);
    else widths[index] = cached;
  }

  if (pending.length === 0) return widths;

  // ascenders and descenders of any script fit within twice the size
  const rowHeight = Math.ceil(style.size * 2);
  const baseline = Math.round(style.size * 1.3);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${MEASURE_WIDTH}" height="${
    rowHeight * pending.length
  }">${pending
    .map(
      (index, row) =>
        `<text x="0" y="${row * rowHeight + baseline}" ${textAttributes({
          ...style,
          rtl: false
        })} fill="#fff" xml:space="preserve">${escapeXml(
          strings[index]
        )}</text>`
    )
    .join('')}</svg>`;

  const { data, info } = await sharp(Buffer.from(svg))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const stride = info.width * info.channels;
  for (const [row, index] of pending.entries()) {
    let max = 0;
    for (let y = row * rowHeight; y < (row + 1) * rowHeight; y++) {
      const offset = y * stride + 3; // alpha of the first pixel of the row
      for (let x = info.width - 1; x >= max; x--) {
        if (data[offset + x * info.channels] > 0) {
          max = x + 1;
          break;
        }
      }
    }

    const width = max >= info.width - 1 ? Number.POSITIVE_INFINITY : max;
    widths[index] = width;
    remember(cacheKey(style, strings[index]), width);
  }

  return widths;
}

async function measureOne(style, string) {
  const [width] = await measure(style, [string]);
  return width;
}

//
// The longest prefix of `chars` which, followed by `suffix`, is no wider
// than `maxWidth` (at least one character).  The length is estimated from
// the width of a sample and refined by measuring a window of candidates
// around the estimate, so a long word costs a few renders rather than one
// per character.
//
async function fitPrefix(style, chars, maxWidth, suffix = '') {
  const window = 6;
  const sample = chars.slice(0, Math.min(chars.length, 12)).join('');
  const sampleWidth = await measureOne(style, sample);
  const perChar =
    Number.isFinite(sampleWidth) && sampleWidth > 0
      ? sampleWidth / Math.min(chars.length, 12)
      : style.size;
  let guess = Math.min(
    chars.length,
    Math.max(1, Math.floor(maxWidth / perChar))
  );

  for (let attempt = 0; attempt < 8; attempt++) {
    const low = Math.max(1, guess - window);
    const high = Math.min(chars.length, guess + window);
    const lengths = [];
    for (let n = low; n <= high; n++) lengths.push(n);

    const widths = await measure(
      style,
      lengths.map((n) => `${chars.slice(0, n).join('')}${suffix}`)
    );
    let best = -1;
    for (const [i, width] of widths.entries()) if (width <= maxWidth) best = i;

    if (best === -1) {
      // nothing in the window fits: a single character always does
      if (low === 1) return 1;
      guess = low - window;
    } else if (best === lengths.length - 1 && high < chars.length) {
      // everything fits: there may be room for more
      guess = high + window;
    } else {
      return lengths[best];
    }
  }

  return Math.max(1, Math.min(chars.length, guess));
}

//
// Break a word wider than a line into pieces that fit (a URL, a long
// compound, text without spaces such as Chinese or Japanese).
//
async function breakWord(style, word, maxWidth) {
  const pieces = [];
  let rest = [...word];
  while (rest.length > 0) {
    const length = await fitPrefix(style, rest, maxWidth);
    pieces.push(rest.slice(0, length).join(''));
    rest = rest.slice(length);
  }

  return pieces;
}

//
// Wrap `text` into lines no wider than `maxWidth`.  Words are placed by
// their measured widths and every resulting line is measured as a whole
// (kerning, shaping), moving words down whenever a line proves too wide.
// With `maxLines` the text is cut at the last line that fits, which ends
// with an ellipsis when anything was left out.
//
async function wrap(style, text, maxWidth, options = {}) {
  const { maxLines = Number.POSITIVE_INFINITY } = options;

  let words = String(text).trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return { lines: [], truncated: false };

  // words wider than a line are split first
  const wordWidths = await measure(style, words);
  if (wordWidths.some((width) => width > maxWidth)) {
    const split = [];
    for (const [index, word] of words.entries()) {
      if (wordWidths[index] > maxWidth)
        split.push(...(await breakWord(style, word, maxWidth)));
      else split.push(word);
    }

    words = split;
  }

  const widths = await measure(style, words);
  const [spaced, joined] = await measure(style, ['x x', 'xx']);
  const space = Math.max(1, spaced - joined);

  // first pass: by arithmetic on the word widths
  const lines = [];
  let current = [];
  let currentWidth = 0;
  for (const [index, word] of words.entries()) {
    const width = widths[index];
    const next = current.length === 0 ? width : currentWidth + space + width;
    if (current.length > 0 && next > maxWidth) {
      lines.push(current);
      current = [word];
      currentWidth = width;
    } else {
      current.push(word);
      currentWidth = next;
    }
  }

  if (current.length > 0) lines.push(current);

  // second pass: every line as it will really be rendered
  for (let i = 0; i < lines.length; i++) {
    let width = await measureOne(style, lines[i].join(' '));
    while (width > maxWidth && lines[i].length > 1) {
      const moved = lines[i].pop();
      if (lines[i + 1]) lines[i + 1].unshift(moved);
      else lines.push([moved]);

      width = await measureOne(style, lines[i].join(' '));
    }
  }

  let truncated = false;
  if (lines.length > maxLines) {
    truncated = true;
    lines.length = maxLines;
    // the last line ends with an ellipsis and must still fit
    const last = lines[maxLines - 1];
    while (
      last.length > 1 &&
      (await measureOne(style, `${last.join(' ')}${ELLIPSIS}`)) > maxWidth
    )
      last.pop();

    if (
      last.length === 1 &&
      (await measureOne(style, `${last[0]}${ELLIPSIS}`)) > maxWidth
    ) {
      const chars = [...last[0]];
      const length = await fitPrefix(style, chars, maxWidth, ELLIPSIS);
      last[0] = chars.slice(0, length).join('');
    }

    lines[maxLines - 1] = [`${last.join(' ')}${ELLIPSIS}`];
  }

  return { lines: lines.map((line) => line.join(' ')), truncated };
}

//
// Shorten `text` (with an ellipsis) so that it is no wider than `maxWidth`.
//
async function truncate(style, text, maxWidth) {
  const string = String(text).trim();
  if ((await measureOne(style, string)) <= maxWidth) return string;
  const chars = [...string];
  const length = await fitPrefix(style, chars, maxWidth, ELLIPSIS);
  return `${chars.slice(0, length).join('')}${ELLIPSIS}`;
}

//
// Lay out the title: the largest size at which it fits on two lines, else
// the smallest size with the end of the second line elided.
//
async function layoutTitle(text, maxWidth, options = {}) {
  let result;
  for (const size of TITLE_SIZES) {
    const style = {
      font: FONT.sansBold,
      size,
      letterSpacing: -size / 40,
      rtl: options.rtl
    };

    const { lines, truncated } = await wrap(style, text, maxWidth, {
      maxLines: TITLE_MAX_LINES
    });
    result = { style, lines, truncated };
    if (!truncated) break;
  }

  return result;
}

//
// A file of the assets embedded in the image: its root element is dropped
// and its ids namespaced so that several files never collide.
//
function embedSvg(file, prefix) {
  const source = fs.readFileSync(file, 'utf8');
  const inner = source
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '');
  return inner
    .replace(/\bid="([^"]+)"/g, (m, id) => `id="${prefix}${id}"`)
    .replace(/url\(#([^)]+)\)/g, (m, id) => `url(#${prefix}${id})`)
    .replace(
      /xlink:href="#([^"]+)"/g,
      (m, id) => `xlink:href="#${prefix}${id}"`
    );
}

const LOGO = embedSvg(
  path.join(__dirname, '..', 'assets', 'img', 'logo-square.svg'),
  'og-logo-'
);
const GITHUB_MARK = embedSvg(
  path.join(__dirname, '..', 'assets', 'img', 'github-logo-white.svg'),
  'og-github-'
);

//
// A run of text (`{ text, style, fill }`) starting at (x, y).  For a
// right-to-left run `x` is its right edge: with `direction="rtl"` the start
// of the text is on the right, and the paragraph direction keeps embedded
// numbers and Latin words in their reading order.
//
function textRun(x, y, run) {
  return `<text x="${x}" y="${y}" ${textAttributes(run.style)} fill="${
    run.fill
  }" xml:space="preserve">${escapeXml(run.text)}</text>`;
}

//
// A rounded outlined pill holding runs of text (and optionally a leading
// graphic), laid out from the measured runs.  Returns its markup and width.
//
async function pill({ x, y, height, runs, leading, paddingX = 20, gap = 10 }) {
  const widths = await Promise.all(
    runs.map((run) => measureOne(run.style, run.text))
  );
  let width = paddingX * 2;
  if (leading) width += leading.width + gap;
  for (const [index, w] of widths.entries())
    width += w + (index < widths.length - 1 ? gap : 0);
  width = Math.round(width);

  let markup = `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${
    height / 2
  }" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-opacity=".16"/>`;
  let cursor = x + paddingX;
  if (leading) {
    markup += `<g transform="translate(${cursor} ${
      y + (height - leading.height) / 2
    })">${leading.markup}</g>`;
    cursor += leading.width + gap;
  }

  for (const [index, run] of runs.entries()) {
    const baseline = y + height / 2 + run.style.size * 0.36;
    markup += textRun(Math.round(cursor), Math.round(baseline), run);
    cursor += widths[index] + gap;
  }

  return { markup, width };
}

//
// Build the SVG of a page's Open Graph image.
//
// `title` and `description` are plain text (no HTML), `url` is the path of
// the page (without locale) and `stars` the GitHub star count.
//
async function renderOpenGraphImage({ title, description, url, stars }) {
  const parts = [];

  //
  // header: logo, wordmark and the GitHub stars, on a rule
  //
  parts.push(
    `<g transform="translate(${MARGIN} 56) scale(.48)">${LOGO}</g>`,
    textRun(MARGIN + 64, 96, {
      text: 'Forward Email',
      style: STYLE.wordmark,
      fill: COLORS.title
    })
  );

  const starCount = Number.isFinite(Number(stars))
    ? Number(stars).toLocaleString('en-US')
    : String(stars);
  const starsPill = await pill({
    x: 0,
    y: 56,
    height: 48,
    leading: {
      width: 22,
      height: 22,
      markup: `<g transform="scale(1.2222)">${GITHUB_MARK}</g>`
    },
    runs: [
      { text: starCount, style: STYLE.stars, fill: COLORS.title },
      { text: 'stars', style: STYLE.starsLabel, fill: COLORS.muted }
    ]
  });
  parts.push(
    `<g transform="translate(${WIDTH - MARGIN - starsPill.width} 0)">${
      starsPill.markup
    }</g>`,
    `<rect x="${MARGIN}" y="${HEADER_RULE_Y}" width="${CONTENT_WIDTH}" height="1" fill="#fff" fill-opacity=".1"/>`
  );

  //
  // body: the address of the page, the title and the description, centred
  // between the rules (a right-to-left title or description is aligned to
  // the right, each by its own script: a page's title may be translated
  // while its description is not, or the other way round)
  //
  const eyebrow = await truncate(
    STYLE.eyebrow,
    `forwardemail.net${url === '/' ? '' : url}`,
    CONTENT_WIDTH
  );
  const titleLayout = await layoutTitle(title, CONTENT_WIDTH, {
    rtl: isRtl(title)
  });
  const titleLineHeight = Math.round(
    titleLayout.style.size * TITLE_LINE_HEIGHT
  );
  const descriptionStyle = { ...STYLE.description, rtl: isRtl(description) };
  const descriptionLayout = await wrap(
    descriptionStyle,
    description,
    CONTENT_WIDTH,
    {
      maxLines:
        DESCRIPTION_MAX_LINES[Math.min(titleLayout.lines.length, 2) - 1] ||
        DESCRIPTION_MAX_LINES[0]
    }
  );

  const eyebrowHeight = 26;
  const gapAfterEyebrow = 22;
  const titleHeight = titleLayout.lines.length * titleLineHeight;
  const gapAfterTitle = descriptionLayout.lines.length > 0 ? 24 : 0;
  const descriptionHeight =
    descriptionLayout.lines.length * DESCRIPTION_LINE_HEIGHT;
  const blockHeight =
    eyebrowHeight +
    gapAfterEyebrow +
    titleHeight +
    gapAfterTitle +
    descriptionHeight;
  let y =
    HEADER_RULE_Y +
    Math.round((FOOTER_RULE_Y - HEADER_RULE_Y - blockHeight) / 2);

  // the address with its accent mark
  parts.push(
    `<rect x="${MARGIN}" y="${y + 8}" width="4" height="12" rx="2" fill="${
      COLORS.accent
    }"/>`,
    textRun(MARGIN + 16, y + 20, {
      text: eyebrow,
      style: STYLE.eyebrow,
      fill: COLORS.accent
    })
  );
  y += eyebrowHeight + gapAfterEyebrow;

  const titleX = titleLayout.style.rtl ? MARGIN + CONTENT_WIDTH : MARGIN;
  for (const line of titleLayout.lines) {
    y += titleLineHeight;
    parts.push(
      textRun(titleX, y - Math.round(titleLineHeight * 0.24), {
        text: line,
        style: titleLayout.style,
        fill: COLORS.title
      })
    );
  }

  y += gapAfterTitle;

  const descriptionX = descriptionStyle.rtl ? MARGIN + CONTENT_WIDTH : MARGIN;
  for (const line of descriptionLayout.lines) {
    y += DESCRIPTION_LINE_HEIGHT;
    parts.push(
      textRun(descriptionX, y - 11, {
        text: line,
        style: descriptionStyle,
        fill: COLORS.body
      })
    );
  }

  //
  // footer: who trusts the service, on a rule
  //
  parts.push(
    `<rect x="${MARGIN}" y="${FOOTER_RULE_Y}" width="${CONTENT_WIDTH}" height="1" fill="#fff" fill-opacity=".1"/>`
  );
  const footerY = 552;
  const footerHeight = 44;
  let cursor = MARGIN;
  const trusted = await pill({
    x: cursor,
    y: footerY,
    height: footerHeight,
    paddingX: 18,
    gap: 7,
    leading: {
      width: 8,
      height: 8,
      markup: `<circle cx="4" cy="4" r="4" fill="${COLORS.accent}"/>`
    },
    runs: [
      { text: 'Trusted by', style: STYLE.footer, fill: COLORS.body },
      { text: '500,000+', style: STYLE.footerStrong, fill: COLORS.accent },
      { text: 'domains', style: STYLE.footer, fill: COLORS.body }
    ]
  });
  parts.push(trusted.markup);
  cursor += trusted.width + 12;
  for (const name of TRUSTED_BY) {
    const badge = await pill({
      x: cursor,
      y: footerY,
      height: footerHeight,
      paddingX: 18,
      runs: [{ text: name, style: STYLE.pill, fill: COLORS.title }]
    });
    parts.push(badge.markup);
    cursor += badge.width + 12;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
<defs>
<linearGradient id="og-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1119"/><stop offset="1" stop-color="#0c1421"/></linearGradient>
<radialGradient id="og-glow-a" cx="1090" cy="30" r="600" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${
    COLORS.accentDeep
  }" stop-opacity=".42"/><stop offset=".5" stop-color="${
    COLORS.accentDeep
  }" stop-opacity=".1"/><stop offset="1" stop-color="${
    COLORS.accentDeep
  }" stop-opacity="0"/></radialGradient>
<radialGradient id="og-glow-b" cx="90" cy="650" r="520" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${
    COLORS.accent
  }" stop-opacity=".16"/><stop offset="1" stop-color="${
    COLORS.accent
  }" stop-opacity="0"/></radialGradient>
<pattern id="og-grid" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="#fff" fill-opacity=".08"/></pattern>
</defs>
<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#og-bg)"/>
<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#og-grid)"/>
<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#og-glow-a)"/>
<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#og-glow-b)"/>
${parts.join('\n')}
</svg>`;
}

module.exports = {
  CONTENT_WIDTH,
  HEIGHT,
  MARGIN,
  STYLE,
  WIDTH,
  escapeXml,
  isRtl,
  layoutTitle,
  measure,
  renderOpenGraphImage,
  truncate,
  wrap
};
