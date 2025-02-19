/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const dayjs = require('dayjs-with-plugins');

const config = require('#config');
const { developerDocs } = require('#config/utilities');

const author = {
  name: `${config.appName} Team`,
  email: config.email.message.from,
  link: config.urls.web
};

let atom1;
let rss;
let json;

// dynamically import feed
let Feed;
import('feed').then((obj) => {
  Feed = obj.Feed;

  const f = new Feed({
    title: `${config.appName} Blog`,
    description: `Stay up to date on ${config.appName} product updates, news, and alerts.`,
    id: config.urls.web,
    link: config.urls.web,
    language: 'en', // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: `${config.urls.web}/img/apple-touch-icon.png`,
    favicon: `${config.urls.web}/favicon.ico`,
    copyright: `Copyright ${dayjs().format(
      'YYYY'
    )} Forward Email LLC. All rights reserved.`,
    updated: new Date(),
    generator: 'forward-email',
    feedLinks: {
      json: `${config.urls.web}/blog/feed/json`,
      atom: `${config.urls.web}/blog/feed/atom`,
      rss: `${config.urls.web}/blog/feed/rss`
    },
    author
  });

  f.addCategory('Developer Articles');

  for (const doc of developerDocs) {
    f.addItem({
      title: doc.title,
      category: [
        { name: 'Developer Articles', domain: `${config.urls.web}/blog/docs` }
      ],
      id: `${config.urls.web}${doc.slug}`,
      link: `${config.urls.web}${doc.slug}`,
      description: doc.description,
      // content: post.content,
      author: [author],
      date: doc.mtime,
      published: doc.ctime,
      image: `${config.urls.web}${doc.slug}.png`
    });
  }

  // TODO: status page feed injection (?)

  atom1 = f.atom1();
  rss = f.rss2();
  json = f.json1();
});

async function feed(ctx, next) {
  if (!atom1 || !rss || !json)
    throw Boom.clientTimeout(ctx.translateError('WEBSITE_OUTAGE'));

  switch (ctx.pathWithoutLocale) {
    case '/blog/feed/atom': {
      ctx.type = 'application/atom+xml';
      ctx.body = atom1;

      break;
    }

    case '/blog/feed/rss': {
      ctx.type = 'application/rss+xml';
      ctx.body = rss;

      break;
    }

    case '/blog/feed/json': {
      ctx.type = 'application/json';
      ctx.body = json;

      break;
    }

    default: {
      return next();
    }
  }
}

module.exports = feed;
