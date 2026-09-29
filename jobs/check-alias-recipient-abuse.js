/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const mongoose = require('mongoose');

const CappedList = require('#helpers/capped-list');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Users, Domains, Aliases } = require('#models');

// <https://gist.github.com/technikhil314/67d82ecf2beb633571064119d1f6e92d>
// <https://gist.github.com/mavieth/418b0ba7b3525517dd85b31ee881b2ec>
const EMAIL_DOMAINS = [
  '123mail.org',
  '126.com',
  '150mail.com',
  '150ml.com',
  '163.com',
  '16mail.com',
  '2-mail.com',
  '21cn.com',
  '4email.net',
  '50mail.com',
  'aim.com',
  'airpost.net',
  'alice.it',
  'aliceadsl.fr',
  'aliyun.com',
  'allmail.net',
  'aol.com',
  'aol.it',
  'arcor.de',
  'arnet.com.ar',
  'att.net',
  'attorneymail.ch',
  'barmail.ch',
  'bell.net',
  'bellsouth.net',
  'bestmail.us',
  'bigpond.com',
  'bigpond.net.au',
  'bk.ru',
  'bluewin.ch',
  'blueyonder.co.uk',
  'bol.com.br',
  'bt.com',
  'btinternet.com',
  'centurylink.net',
  'centurytel.net',
  'charter.net',
  'chello.nl',
  'club-internet.fr',
  'cluemail.com',
  'collaborative.li',
  'comcast.net',
  'cox.net',
  'daum.net',
  'diplomail.ch',
  'earthlink.net',
  'elitemail.org',
  'email.com',
  'email.it',
  'emailcorner.net',
  'emailengine.net',
  'emailengine.org',
  'emailgroups.net',
  'emailplus.org',
  'emailuser.net',
  'eml.cc',
  'epix.net',
  'excite.com',
  'f-m.fm',
  'facebook.com',
  'fast-email.com',
  'fast-mail.org',
  'fastem.com',
  'fastemail.us',
  'fastemailer.com',
  'fastest.cc',
  'fastimap.com',
  'fastmail.cn',
  'fastmail.co.uk',
  'fastmail.com',
  'fastmail.com.au',
  'fastmail.de',
  'fastmail.es',
  'fastmail.fm',
  'fastmail.fr',
  'fastmail.im',
  'fastmail.in',
  'fastmail.jp',
  'fastmail.mx',
  'fastmail.net',
  'fastmail.nl',
  'fastmail.org',
  'fastmail.se',
  'fastmail.to',
  'fastmail.tw',
  'fastmail.uk',
  'fastmail.us',
  'fastmailbox.net',
  'fastmessaging.com',
  'fea.st',
  'fibertel.com.ar',
  'fmail.co.uk',
  'fmailbox.com',
  'fmgirl.com',
  'fmguy.com',
  'foxmail.com',
  'free.fr',
  'freedommail.ch',
  'freenet.de',
  'freeserve.co.uk',
  'frontiernet.net',
  'ftml.net',
  'games.com',
  'gandi.net',
  'globo.com',
  'globomail.com',
  'gmail.com',
  'gmx.at',
  'gmx.ch',
  'gmx.com',
  'gmx.de',
  'gmx.fr',
  'gmx.net',
  'google.com',
  'googlemail.com',
  'groupoffice.ch',
  'h-mail.us',
  'hailmail.net',
  'hanmail.net',
  'hetnet.nl',
  'hey.com',
  'home.nl',
  'hotmail.be',
  'hotmail.ca',
  'hotmail.co.uk',
  'hotmail.com	',
  'hotmail.com',
  'hotmail.com.ar',
  'hotmail.com.br',
  'hotmail.com.mx',
  'hotmail.de',
  'hotmail.es',
  'hotmail.fr',
  'hotmail.it',
  'hush.com',
  'hushmail.com',
  'icloud.com',
  'ig.com.br',
  'imap-mail.com',
  'imap.cc',
  'imapmail.org',
  'iname.com',
  'inbox.com',
  'inbox.ru',
  'inoutbox.com',
  'internet-e-mail.com',
  'internet-mail.org',
  'internet.ru',
  'internetemails.net',
  'internetmailing.net',
  'itelefonica.com.br',
  'jetemail.net',
  'journalistmail.ch',
  'juno.com',
  'justemail.net',
  'keemail.me',
  'kolabnow.ch',
  'kolabnow.com',
  'laposte.net',
  'lavabit.com',
  'legalprivilege.ch',
  'letterboxes.org',
  'libero.it',
  'libertymail.co',
  'libertymail.net',
  'list.ru',
  'live.be',
  'live.ca',
  'live.co.uk',
  'live.com',
  'live.com.ar',
  'live.com.au',
  'live.com.mx',
  'live.de',
  'live.fr',
  'live.it',
  'live.nl',
  'love.com',
  'lycos.com',
  'mac.com',
  'mail-central.com',
  'mail-page.com',
  'mail.com',
  'mail.ru',
  'mailandftp.com',
  'mailatlaw.ch',
  'mailbolt.com',
  'mailc.net',
  'mailcan.com',
  'mailforce.net',
  'mailftp.com',
  'mailhaven.com',
  'mailhost.work',
  'mailhouse.biz',
  'mailingaddress.org',
  'mailite.com',
  'mailmight.com',
  'mailnew.com',
  'mailsent.net',
  'mailservice.ms',
  'mailup.net',
  'mailworks.org',
  'me.com',
  'medmail.ch',
  'messagebox.email',
  'ml1.net',
  'mm.st',
  'msn.com',
  'myfastmail.com',
  'mykolab.ch',
  'mykolab.com',
  'mymacmail.com',
  'myswissmail.ch',
  'nate.com',
  'naver.com',
  'netscape.net',
  'neuf.fr',
  'nospammail.net',
  'ntlworld.com',
  'o2.co.uk',
  'offshore.rocks',
  'oi.com.br',
  'online.de',
  'onmicrosoft.com',
  'opengroupware.ch',
  'optonline.net',
  'optusnet.com.au',
  'orange.fr',
  'orange.net',
  'outlook.com',
  'outlook.com.br',
  'ownmail.net',
  'petml.com',
  'planet.nl',
  'pobox.com',
  'poste.it',
  'posteo.af',
  'posteo.at',
  'posteo.be',
  'posteo.ca',
  'posteo.ch',
  'posteo.cl',
  'posteo.co',
  'posteo.co.uk',
  'posteo.com.br',
  'posteo.cr',
  'posteo.cz',
  'posteo.de',
  'posteo.dk',
  'posteo.ee',
  'posteo.es',
  'posteo.eu',
  'posteo.fi',
  'posteo.gl',
  'posteo.gr',
  'posteo.hn',
  'posteo.hr',
  'posteo.hu',
  'posteo.ie',
  'posteo.in',
  'posteo.is',
  'posteo.it',
  'posteo.jp',
  'posteo.la',
  'posteo.li',
  'posteo.lt',
  'posteo.lu',
  'posteo.me',
  'posteo.mx',
  'posteo.my',
  'posteo.net',
  'posteo.nl',
  'posteo.no',
  'posteo.nz',
  'posteo.org',
  'posteo.pe',
  'posteo.pl',
  'posteo.pm',
  'posteo.pt',
  'posteo.ro',
  'posteo.ru',
  'posteo.se',
  'posteo.sg',
  'posteo.si',
  'posteo.tn',
  'posteo.uk',
  'posteo.us',
  'postinbox.com',
  'postpro.net',
  'pressmail.ch',
  'prodigy.net.mx',
  'proinbox.com',
  'promessage.com',
  'protonmail.ch',
  'protonmail.com',
  'qq.com',
  'r7.com',
  'rambler.ru',
  'rbox.co',
  'rbox.me',
  'rbx.email',
  'rbx.life',
  'rbx.run',
  'realemail.net',
  'reallyfast.biz',
  'reallyfast.info',
  'rediffmail.com',
  'rnbx.uk',
  'rocketmail.com',
  'rogers.com',
  'runbox.at',
  'runbox.biz',
  'runbox.bz',
  'runbox.ch',
  'runbox.co',
  'runbox.co.in',
  'runbox.com',
  'runbox.dk',
  'runbox.email',
  'runbox.eu',
  'runbox.is',
  'runbox.it',
  'runbox.ky',
  'runbox.li',
  'runbox.me',
  'runbox.nl',
  'runbox.no',
  'runbox.uk',
  'runbox.us',
  'rushpost.com',
  'safe-mail.net',
  'sbcglobal.net',
  'sent.as',
  'sent.at',
  'sent.com',
  'sfr.fr',
  'shaw.ca',
  'sina.cn',
  'sina.com',
  'sky.com',
  'skynet.be',
  'speedpost.net',
  'speedy.com.ar',
  'speedymail.org',
  'ssl-mail.com',
  'swift-mail.com',
  'swissgroupware.ch',
  'switzerlandmail.ch',
  'sympatico.ca',
  't-online.de',
  'talktalk.co.uk',
  'telenet.be',
  'teletu.it',
  'terra.com.br',
  'the-fastest.net',
  'the-quickest.com',
  'theinternetemail.com',
  'tin.it',
  'tiscali.co.uk',
  'tiscali.it',
  'trusted-legal-mail.ch',
  'tuta.io',
  'tutamail.com',
  'tutanota.com',
  'tutanota.de',
  'tvcablenet.be',
  'uol.com.br',
  'verizon.net',
  'veryfast.biz',
  'veryspeedy.net',
  'virgilio.it',
  'virgin.net',
  'virginmedia.com',
  'voila.fr',
  'voo.be',
  'wanadoo.co.uk',
  'wanadoo.fr',
  'warpmail.net',
  'web.de',
  'windstream.net',
  'wow.com',
  'xobnur.uk',
  'xsmail.com',
  'ya.ru',
  'yahoo.ca',
  'yahoo.co.id',
  'yahoo.co.in',
  'yahoo.co.jp',
  'yahoo.co.kr',
  'yahoo.co.nz',
  'yahoo.co.uk',
  'yahoo.com',
  'yahoo.com.ar',
  'yahoo.com.au',
  'yahoo.com.br',
  'yahoo.com.hk',
  'yahoo.com.mx',
  'yahoo.com.ph',
  'yahoo.com.sg',
  'yahoo.de',
  'yahoo.dk',
  'yahoo.es',
  'yahoo.fr',
  'yahoo.gr',
  'yahoo.in',
  'yahoo.it',
  'yandex.com',
  'yandex.ru',
  'yeah.net',
  'yepmail.net',
  'ygm.com',
  'ymail.com',
  'your-mail.com',
  'zipmail.com.br',
  'zoho.com',
  'zohomail.in',
  'zonnet.nl'
];

// Lowercased (and deduplicated) for matching in the aggregation
const EMAIL_DOMAINS_LOWER = [
  ...new Set(EMAIL_DOMAINS.map((d) => d.toLowerCase()))
];

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    // users listed in the alert (every flagged user is still counted)
    const MAX_LISTED_USERS = 500;
    const lis = new CappedList(MAX_LISTED_USERS);

    // Process users in batches to avoid memory issues
    // (read from a cursor instead of loading every user id first)
    const BATCH_SIZE = 10;
    const userBatch = [];
    const cursor = Users.find({
      [config.userFields.isBanned]: false,
      plan: { $in: ['enhanced_protection', 'team'] },
      has_passed_kyc: false
    })
      .select('_id')
      .lean()
      .cursor({ batchSize: 100 })
      .addCursorFlag('noCursorTimeout', true);

    const processUsers = async (users) => {
      // Use Promise.all to process batch concurrently
      const results = await Promise.all(
        users.map(async (user) => {
          try {
            // Optimized aggregation with timeout and better performance
            const arr = await Aliases.aggregate(
              [
                {
                  $match: {
                    user
                  }
                },
                {
                  $unwind: '$recipients'
                },
                {
                  $group: {
                    _id: '$recipients'
                  }
                },
                {
                  $project: {
                    _id: 1,
                    // Extract domain for filtering
                    domain: {
                      $toLower: {
                        $arrayElemAt: [{ $split: ['$_id', '@'] }, 1]
                      }
                    }
                  }
                },
                //
                // Only recipients at free email providers, and only their
                // count and a few examples are returned: returning every
                // distinct recipient (100K+ for some users) to filter it here
                // held all of them in memory for each user at once
                //
                {
                  $match: {
                    domain: { $in: EMAIL_DOMAINS_LOWER }
                  }
                },
                {
                  $facet: {
                    count: [{ $count: 'count' }],
                    examples: [{ $limit: 10 }]
                  }
                }
              ],
              {
                allowDiskUse: true,
                maxTimeMS: 30_000 // 30 second timeout
              }
            ).exec();

            const [{ count = [], examples = [] } = {}] = arr;
            const recipientCount = count[0]?.count || 0;

            // If it had more than 25 distinct then alert admins
            if (recipientCount >= 25) {
              const [u, names, domainCount] = await Promise.all([
                Users.findById(user).select('email').lean().exec(),
                Domains.find({ 'members.user': user })
                  .select('name')
                  .limit(10)
                  .lean()
                  .exec(),
                Domains.countDocuments({ 'members.user': user })
              ]);

              return {
                email: u.email,
                names: names.map((d) => d.name),
                domainCount,
                recipients: examples.map((v) => v._id),
                recipientCount
              };
            }

            return null;
          } catch (err) {
            // Log individual user errors but continue processing
            await logger.error(err, { user });
            return null;
          }
        })
      );

      // Build list items from results
      for (const result of results) {
        if (result) {
          lis.push(
            `
          <li>
            <strong><a href="${
              config.urls.web
            }/admin/users?q=${encodeURIComponent(
              result.email
            )}" target="_blank">${result.email}</a></strong>
            <br />
            <a href="${config.urls.web}/admin/domains?name=${encodeURIComponent(
              result.email
            )}" target="_blank">${
              result.domainCount
            } domains (e.g. ${result.names.join(', ')})</a>
            <br />
            <small>Using ${
              result.recipientCount
            } free account emails (e.g. ${result.recipients.join(', ')}</small>
          </li>
        `.trim()
          );
        }
      }
    };

    for await (const doc of cursor) {
      userBatch.push(doc._id);
      if (userBatch.length < BATCH_SIZE) continue;
      await processUsers(userBatch.splice(0));
    }

    if (userBatch.length > 0) await processUsers(userBatch.splice(0));

    if (lis.count > 0)
      await emailHelper({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: `👀 Check Alias Recipient Abuse (${lis.count} users)`
        },
        locals: {
          message: `<ul>${lis.items.join('\n')}</ul>${
            lis.omitted > 0
              ? `<p><em>${lis.omitted} more users are not listed.</em></p>`
              : ''
          }`
        }
      });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
