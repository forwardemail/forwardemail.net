/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');
const { Buffer } = require('node:buffer');

const sharp = require('sharp');
const test = require('ava');

const {
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
} = require('#helpers/open-graph-image');

const ELLIPSIS = '\u2026';

const PARAGRAPH =
  'Powerful RESTful email API for developers. Send transactional emails, manage domains, create aliases programmatically. Comprehensive documentation with code examples in multiple programming languages, plus SDKs, webhooks and a sandbox to try everything out.';

// the widest line of a layout, as it will be rendered
async function widest(style, lines) {
  const widths = await measure(style, lines);
  return Math.max(...widths);
}

test('the fonts of the image are found by the renderer', async (t) => {
  t.true(process.env.FONTCONFIG_FILE.endsWith('/assets/fonts/og/fonts.conf'));

  //
  // the proportional and the monospace font must both be picked up: with
  // the fallback font a string of "i" and a string of "m" of the same
  // length differ in width in both, while in the monospace font they do not
  //
  const [i, m] = await measure(STYLE.eyebrow, ['iiiiiiiiii', 'mmmmmmmmmm']);
  // (same advances; the ink of the last glyph differs by a pixel or two)
  t.true(Math.abs(i - m) <= 3, `monospace font: ${i} vs ${m}`);
  const [iSans, mSans] = await measure(STYLE.description, [
    'iiiiiiiiii',
    'mmmmmmmmmm'
  ]);
  t.true(mSans > iSans * 2, 'proportional font');
});

test('measure returns the ink width of each string in one render', async (t) => {
  const widths = await measure(STYLE.description, ['a', 'ab', 'abc', '']);
  t.true(widths[0] > 0);
  t.true(widths[1] > widths[0]);
  t.true(widths[2] > widths[1]);
  t.is(widths[3], 0);
  // wider than the canvas is infinite
  const [huge] = await measure(STYLE.description, ['m'.repeat(200)]);
  t.is(huge, Number.POSITIVE_INFINITY);
  // cached results are stable
  t.deepEqual(await measure(STYLE.description, ['abc', 'a']), [
    widths[2],
    widths[0]
  ]);
});

test('wrap never yields a line wider than the limit', async (t) => {
  const style = STYLE.description;
  for (const maxWidth of [CONTENT_WIDTH, 700, 400, 180]) {
    const { lines, truncated } = await wrap(style, PARAGRAPH, maxWidth);
    t.false(truncated);
    // nothing is lost (a word wider than a narrow line is split in two)
    t.is(
      lines.join(' ').replaceAll(' ', ''),
      PARAGRAPH.replaceAll(' ', ''),
      `every character survives at ${maxWidth}`
    );
    if (maxWidth >= 400) t.is(lines.join(' '), PARAGRAPH);

    t.true((await widest(style, lines)) <= maxWidth, `${maxWidth}px`);
    t.true(lines.length >= Math.floor(2200 / maxWidth));
  }
});

test('wrap cuts at the last line that fits with an ellipsis', async (t) => {
  const style = STYLE.description;
  const { lines, truncated } = await wrap(style, PARAGRAPH, CONTENT_WIDTH, {
    maxLines: 2
  });
  t.true(truncated);
  t.is(lines.length, 2);
  t.true(lines[1].endsWith(ELLIPSIS));
  t.true((await widest(style, lines)) <= CONTENT_WIDTH);
  // the text before the ellipsis is a prefix of the paragraph, whole words
  const kept = lines.join(' ').slice(0, -1);
  t.true(PARAGRAPH.startsWith(kept));
  t.true(
    PARAGRAPH[kept.length] === ' ' || PARAGRAPH[kept.length] === undefined
  );

  // a paragraph that fits is left alone
  const short = await wrap(style, 'Short and sweet.', CONTENT_WIDTH, {
    maxLines: 2
  });
  t.deepEqual(short, { lines: ['Short and sweet.'], truncated: false });
  t.deepEqual(await wrap(style, '   ', CONTENT_WIDTH), {
    lines: [],
    truncated: false
  });
});

test('wrap breaks words and scripts without spaces', async (t) => {
  const style = STYLE.description;
  const word =
    'ThisIsAnExtremelyLongWordWithoutAnySpacesThatDoesNotFitOnOneLineOfTheImageAtAll';
  const { lines } = await wrap(style, `${word} then more words`, 500);
  t.true(lines.length > 2);
  t.is(lines.join('').replace(/ /g, ''), `${word}thenmorewords`);
  t.true((await widest(style, lines)) <= 500);

  // Repeat the no-space script enough to exceed two lines for every supported
  // renderer/font fallback.  A single sentence is a boundary case: it may fit
  // exactly in two lines, where `truncated: false` is the correct result.
  const japanese =
    'エンタープライズグレードのメールを誰にでも。オープンソース、暗号化、プライバシー重視のメールホスティング、転送、IMAP、POP3、SMTP、CalDAV、CardDAVに対応しています。'.repeat(
      3
    );
  const result = await wrap(style, japanese, CONTENT_WIDTH, { maxLines: 2 });
  t.is(result.lines.length, 2);
  t.true(result.truncated);
  t.true(result.lines[1].endsWith(ELLIPSIS));
  t.true((await widest(style, result.lines)) <= CONTENT_WIDTH);
  t.true(japanese.startsWith(result.lines.join('').slice(0, -1)));
});

test('layoutTitle shrinks a long title to two lines', async (t) => {
  const short = await layoutTitle('Email API', CONTENT_WIDTH);
  t.is(short.style.size, 64);
  t.deepEqual(short.lines, ['Email API']);

  const long = await layoutTitle(
    '15 Outstanding Open Source Email Servers for Purism Librem PureOS',
    CONTENT_WIDTH
  );
  t.is(long.lines.length, 2);
  t.false(long.truncated);
  t.true((await widest(long.style, long.lines)) <= CONTENT_WIDTH);

  // longer still: the size comes down until two lines hold it
  const longer = await layoutTitle(
    '15 Outstanding Open Source Email Servers for Red Hat Enterprise Linux Workstations and Servers',
    CONTENT_WIDTH
  );
  t.true(longer.style.size < 64, `${longer.style.size}px`);
  t.is(longer.lines.length, 2);
  t.false(longer.truncated);
  t.true((await widest(longer.style, longer.lines)) <= CONTENT_WIDTH);

  // hopeless lengths end with an ellipsis at the smallest size
  const endless = await layoutTitle('word '.repeat(60).trim(), CONTENT_WIDTH);
  t.is(endless.style.size, 40);
  t.is(endless.lines.length, 2);
  t.true(endless.truncated);
  t.true(endless.lines[1].endsWith(ELLIPSIS));
  t.true((await widest(endless.style, endless.lines)) <= CONTENT_WIDTH);
});

test('truncate shortens with an ellipsis to the width', async (t) => {
  const style = STYLE.eyebrow;
  t.is(
    await truncate(style, 'forwardemail.net/faq', CONTENT_WIDTH),
    'forwardemail.net/faq'
  );
  const url = `forwardemail.net/blog/docs/${'a-very-long-slug-'.repeat(10)}`;
  const shortened = await truncate(style, url, CONTENT_WIDTH);
  t.true(shortened.endsWith(ELLIPSIS));
  t.true(url.startsWith(shortened.slice(0, -1)));
  t.true((await widest(style, [shortened])) <= CONTENT_WIDTH);
  // as long as it can be
  const [w] = await measure(style, [`${shortened.slice(0, -1)}x${ELLIPSIS}`]);
  t.true(w > CONTENT_WIDTH);
});

test('escapeXml and isRtl', (t) => {
  t.is(
    escapeXml(`a & b < c > "d" 'e'`),
    'a &amp; b &lt; c &gt; &quot;d&quot; &#39;e&#39;'
  );
  t.false(isRtl('Email API'));
  t.false(isRtl('100 emails'));
  t.true(isRtl('واجهة برمجة التطبيقات'));
  t.true(isRtl('דואר אלקטרוני'));
  t.false(isRtl(''));
});

test('renders a 1200x630 image with the given texts', async (t) => {
  t.timeout(60_000);
  const svg = await renderOpenGraphImage({
    title: 'Ubuntu & <Kubuntu> "email" setup',
    description: 'Enterprise-grade email for everyone.',
    url: '/ubuntu',
    stars: 1672
  });
  t.true(svg.startsWith('<svg '));
  t.true(svg.includes(`width="${WIDTH}" height="${HEIGHT}"`));
  // texts are escaped, the star count formatted, the address shown
  t.true(svg.includes('Ubuntu &amp; &lt;Kubuntu&gt; &quot;email&quot; setup'));
  t.true(svg.includes('>1,672<'));
  t.true(svg.includes('>forwardemail.net/ubuntu<'));
  t.true(svg.includes('>Forward Email<'));
  t.true(svg.includes('>Netflix<') && svg.includes('>jQuery<'));

  const { info } = await sharp(Buffer.from(svg))
    .png()
    .toBuffer({ resolveWithObject: true });
  t.is(info.width, WIDTH);
  t.is(info.height, HEIGHT);

  // the address, the title and the description start at the margin
  t.regex(svg, /<text x="80"[^>]*>forwardemail\.net\/ubuntu</);
  t.regex(svg, /<text x="64"[^>]*>Ubuntu &amp; &lt;Kubuntu&gt;/);
  t.regex(svg, /<text x="64"[^>]*>Enterprise-grade email for everyone\.</);
});

test('right-to-left text is aligned to the right', async (t) => {
  const svg = await renderOpenGraphImage({
    title: 'واجهة برمجة تطبيقات البريد الإلكتروني للمطورين',
    description:
      'بريد إلكتروني على مستوى المؤسسات للجميع. مفتوح المصدر بنسبة 100%.',
    url: '/email-api',
    stars: 5
  });
  const rtl = [...svg.matchAll(/<text x="(\d+)"[^>]*direction="rtl"/g)];
  t.true(rtl.length >= 2);
  t.true(rtl.every((match) => Number(match[1]) === WIDTH - MARGIN));
  // the address stays left to right
  t.regex(svg, /<text x="80"[^>]*>forwardemail\.net\/email-api</);
});
