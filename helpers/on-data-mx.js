/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const os = require('node:os');
const punycode = require('node:punycode');
const { Buffer } = require('node:buffer');
const { isIP } = require('node:net');

// TODO: SMTP needs resolver option
//       https://github.com/nodemailer/smtp-server/issues/177

// TODO: block these file attachments in spam scanner
// .z, .ade, .adp, .apk, .appx, .appxbundle, .bat, .cab, .chm, .cmd, .com, .cpl, .diagcab, .diagcfg, .diagpack, .dll, .dmg, .ex, .ex_, .exe, .hta, .img, .ins, .iso, .isp, .jar, .jnlp, .js, .jse, .lib, .lnk, .mde, .msc, .msi, .msix, .msixbundle, .msp, .mst, .nsh, .pif, .ps1, .scr, .sct, .shb, .sys, .vb, .vbe, .vbs, .vhd, .vxd, .wsc, .wsf, .wsh, .xll
// const SpamScanner = require('spamscanner');

// TODO: integrate ASN check and reputation check into spam scanner

// TODO: mullvad dns blocklist (Extended)
// <https://github.com/mullvad/dns-blocklists/blob/main/inventory/group_vars/all.yml>

const MimeNode = require('nodemailer/lib/mime-node');
const RE2 = require('re2');
const URLParse = require('url-parse');
const arrayJoinConjunction = require('array-join-conjunction');
const bytes = require('@forwardemail/bytes');
const escapeStringRegexp = require('escape-string-regexp');
const ip = require('ip');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const pMap = require('p-map');
const pMapSeries = require('p-map-series');
const parseErr = require('parse-err');
const qs = require('qs');
const revHash = require('rev-hash');
const safeStringify = require('fast-safe-stringify');
const status = require('statuses');
const { Headers } = require('mailsplit');
const { Iconv } = require('iconv');
const { SRS } = require('sender-rewriting-scheme');
const { boolean } = require('boolean');
const { sealMessage } = require('mailauth');
const { simpleParser } = require('mailparser');
const _ = require('#helpers/lodash');

const getReceivedHeader = require('#helpers/get-received-header');

const Domains = require('#models/domains');
const DenylistError = require('#helpers/denylist-error');
const REGEX_LOCALHOST = require('#helpers/regex-localhost');
const SMTPError = require('#helpers/smtp-error');
const checkSRS = require('#helpers/check-srs');
const combineErrors = require('#helpers/combine-errors');
const config = require('#config');
const createSession = require('#helpers/create-session');
const emailHelper = require('#helpers/email');
const env = require('#config/env');
const getAttributes = require('#helpers/get-attributes');
const getBounceInfo = require('#helpers/get-bounce-info');
const getErrorCode = require('#helpers/get-error-code');
const getGreylistKey = require('#helpers/get-greylist-key');
const getHeaders = require('#helpers/get-headers');
const getRecipients = require('#helpers/get-recipients');
const hasFingerprintExpired = require('#helpers/has-fingerprint-expired');
const i18n = require('#helpers/i18n');
const isAllowlisted = require('#helpers/is-allowlisted');
const isArbitrary = require('#helpers/is-arbitrary');
const isAuthenticatedMessage = require('#helpers/is-authenticated-message');
const isAutoReplyOrMailingList = require('#helpers/is-auto-reply-or-mailing-list');
const isBackscatterer = require('#helpers/is-backscatterer');
const isCodeBug = require('#helpers/is-code-bug');
const isDenylisted = require('#helpers/is-denylisted');
const isEmail = require('#helpers/is-email');
const isGreylisted = require('#helpers/is-greylisted');
const isSilentBanned = require('#helpers/is-silent-banned');
const logger = require('#helpers/logger');
const parseError = require('#helpers/parse-error');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseRootDomain = require('#helpers/parse-root-domain');
const parseUsername = require('#helpers/parse-username');
const retryRequest = require('#helpers/retry-request');
const sendEmail = require('#helpers/send-email');
const signMessage = require('#helpers/sign-message');
const updateHeaders = require('#helpers/update-headers');
const { Emails, Users, SelfTests } = require('#models');
const { decrypt } = require('#helpers/encrypt-decrypt');
const { encoder } = require('#helpers/encoder-decoder');

const USER_AGENT = `${config.pkg.name}/${config.pkg.version}`;
const HOSTNAME = os.hostname();
const IP_ADDRESS = ip.address();

const srs = new SRS(config.srs);

/*
// TODO: re-enable spam scanner once v7 released
const scanner = new SpamScanner({
  logger,
  clamscan: config.env === 'test',
  memoize: {
    // since memoizee doesn't support supplying mb or gb of cache size
    // we can calculate how much the maximum could potentially be
    // the max length of a domain name is 253 characters (bytes)
    // and if we want to store up to 1 GB in memory, that's
    // `Math.floor(bytes('1GB') / 253)` = 4244038 (domains)
    // note that this is per thread, so if you have 4 core server
    // you will have 4 threads, and therefore need 4 GB of free memory
    size: Math.floor(bytes('0.5GB') / 253)
  }
});
*/

//
// NOTE: Outlook appears to have a major bug in their system
//       and they go against the protocol by rejecting for p=quarantine as well
//       (this thread has extensive comments about this)
//       <https://techcommunity.microsoft.com/blog/exchange/announcing-new-dmarc-policy-handling-defaults-for-enhanced-email-security/3878883/replies/3942410>>
//
// TODO: if `err.truthSource` is `outlook.com` then link to this article
//
/*
async function sendSysAdminEmail(template, err, session, headers) {
  // safeguard in case we add more of these kinds of alerts
  if (template !== 'dmarc-issue') throw new TypeError('Invalid template');

  // TODO: if it was due to domain vs subdomain mismatch (specific note for admins)
  // TODO: ensure `err` is passed in all invocations

  //
  // NOTE: to prevent spammers from abusing this automation
  //       we only permit allowlisted senders
  //       or senders that have same root domain connecting as in From header
  //       to receive this developer-friendly system admin alerts
  //
  if (
    !session.isAllowlisted &&
    (!session.resolvedRootClientHostname ||
      session.resolvedRootClientHostname !==
        session.originalFromAddressRootDomain)
  ) {
    return;
  }

  const key = `${_.snakeCase(template)}_check:${
    session.originalFromAddressRootDomain
  }`;
  const cache = await this.client.get(key);
  if (boolean(cache)) return;
  await this.client.set(key, true, 'PX', ms('30d'));
  await emailHelper({
    template,
    message: {
      to: session.originalFromAddress,
      cc: ['info', 'help', 'support', 'admin', 'security'].map(
        (str) => `${str}@${session.originalFromAddressRootDomain}`
      )
      // bcc: config.alertsEmail
    },
    locals: {
      domain: session.originalFromAddressDomain,
      truthSource: err.truthSource,
      mailFrom: session?.envelope?.mailFrom?.address
        ? checkSRS(session?.envelope?.mailFrom?.address)
        : '',
      rcptTo: session.envelope.rcptTo.map((to) => to.address).join(', '),
      messageId: getHeaders(headers, 'message-id'),
      fromAddress: session.originalFromAddress,
      subject: getHeaders(headers, 'subject'),
      date: getHeaders(headers, 'date'),
      response: err.response || err.message,
      dmarc: session.dmarc
    }
  });
}
*/

//
// TODO: digest email with parsed FQDN's or IP's parsed from rejected emails
//
async function addToDenylist(attr, headers, bounce, _session) {
  await this.client.set(`denylist:${attr}`, true, 'PX', ms('30d'));
  //
  // we don't need to do a caching check here for sending the email
  // because adding to the denylist sort of acts like a cache by itself
  //
  // (e.g. sometimes a service like example.com might have dmarc with p=none)
  // (and bad actors could be impersonating them, which causes them to get marked as spam)
  // (so we notify the admins, if any, on our side if they are a paying customer)
  //
  if (!isEmail(attr) && !isFQDN(attr)) return;

  const host = parseHostFromDomainOrAddress(attr);
  const root = parseRootDomain(host);

  // lookup the main host, if not found, and if root differs, then lookup the root
  let domain = await Domains.findOne({
    plan: { $in: ['enhanced_protection', 'team'] },
    // has_mx_record: true,
    has_txt_record: true,
    domain: host
  })
    .lean()
    .exec();

  if (!domain && host !== root)
    domain = await Domains.findOne({
      plan: { $in: ['enhanced_protection', 'team'] },
      // has_mx_record: true,
      has_txt_record: true,
      domain: root
    })
      .lean()
      .exec();

  if (!domain) return;

  const { to, locale } = await Domains.getToAndMajorityLocaleByDomain(domain);

  emailHelper({
    template: 'alert',
    message: {
      to,
      bcc: config.alertsEmail,
      subject: i18n.translate(
        'DENYLIST_SUBJECT',
        locale,
        domain.name,
        bounce.err.bounceInfo.category
      )
    },
    locals: {
      message: i18n.translate(
        'DENYLIST_MESSAGE',
        locale,
        attr,
        bounce.err.bounceInfo.category
      ),
      locale
    }
  })
    .then()
    .catch((err) => logger.fatal(err));
}

//
// NOTE: we check against both MAIL FROM and From header for some arbitrary checks
//       <https://github.com/zone-eu/zone-mta/issues/432>
//
function isMailerDaemonEmail(address) {
  const username = parseUsername(address); // portion before "+" symbol
  const fullUsername = parseUsername(address, true);
  // TODO: owner-*", "*-request
  // <https://www.rfc-editor.org/rfc/rfc3834#:~:text=Responders%20MUST%20NOT,to%20be%20useful.>
  return (
    config.POSTMASTER_USERNAMES.has(username) ||
    // google groups
    fullUsername.endsWith('+donotreply') ||
    fullUsername.endsWith('-donotreply') ||
    // mssecurity-noreply@microsoft.com
    fullUsername.endsWith('+noreply') ||
    fullUsername.endsWith('-noreply')
  );
}

// this logic determines if we should we send a vacation responder or bounce
function shouldSendVacationOrBounce(headers, session) {
  // NOTE: we return the inverse here so the code is more readable
  return !(
    //
    // prevent sending a bounce message if missing MAIL FROM or From
    // (if the MAIL FROM wasn't set or blank then it's likely spam or misconfigured message)
    //
    (
      !isSANB(session.envelope.mailFrom.address) ||
      !isSANB(session.originalFromAddress) ||
      // don't send to mailing lists, group messages, or mailer daemons
      isAutoReplyOrMailingList(headers) ||
      isMailerDaemonEmail(checkSRS(session.envelope.mailFrom.address)) ||
      isMailerDaemonEmail(checkSRS(session.originalFromAddress)) ||
      // don't send if it was "MDaemon" with "X-MDDSN-Message" header
      (headers.hasHeader('x-mddsn-message') &&
        parseUsername(checkSRS(session.originalFromAddress)) === 'mdaemon')
    )
  );
}

async function sendVacationResponder(vacationResponder, headers, session) {
  // check cache if we've already sent this
  const key = `${config.fingerprintPrefix}:${revHash(
    encoder.pack([
      vacationResponder.alias_id,
      session.isAllowlisted
        ? session.originalFromAddress
        : session.originalFromAddressRootDomain
    ])
  )}`;

  const cache = await this.client.get(key);
  if (cache) return;

  await this.client.set(key, true, 'PX', ms('4d'));

  // message is a stream
  const message = createVacationResponder(vacationResponder, headers, session);

  //
  // TODO: we should use this queue method instead of email helper
  //       and also for bounces in MX codebase
  //
  // queue the email
  const email = await Emails.queue({
    info: {
      message,
      envelope: {
        from: punycode.toASCII(vacationResponder.from),
        to: [checkSRS(session.envelope.mailFrom.address)]
      }
    },
    user: { id: vacationResponder.user },
    is_bounce: true
  });

  logger.debug('email created', {
    session: createSession(email),
    user: email.user,
    email: email._id,
    domains: [email.domain],
    ignore_hook: false
  });
}

function createVacationResponder(vacationResponder, headers, session) {
  // NOTE: "Date" and "Message-ID" header will be automatically set
  const rootNode = new MimeNode('text/plain; charset=utf-8');
  rootNode.setHeader('To', session.originalFromAddress);
  rootNode.setHeader('From', vacationResponder.from);
  //
  // Gmail sets Precedence to "bulk" and X-Autoreply to "yes"
  // (though they go against sieve/vacation RFC and don't set In-Reply-To)
  // (and they set "$vacationSubject Re: $originalSubject" as Subject)
  //
  const subject = getHeaders(headers, 'subject');
  rootNode.setHeader(
    'Subject',
    isSANB(subject)
      ? `${vacationResponder.subject} Re: ${subject}`
      : vacationResponder.subject
  );
  rootNode.setHeader('Precedence', 'bulk');
  rootNode.setHeader('X-Autoreply', 'yes');
  rootNode.setHeader('Auto-Submitted', 'auto-replied');

  if (headers.hasHeader('message-id')) {
    rootNode.setHeader('In-Reply-To', headers.getFirst('message-id'));
    rootNode.setHeader('References', headers.getFirst('message-id'));
  }

  rootNode.setHeader('X-Report-Abuse-To', config.abuseEmail);
  rootNode.setHeader('X-Report-Abuse', config.abuseEmail);
  rootNode.setHeader('X-Complaints-To', config.abuseEmail);
  rootNode.setHeader('X-Forward-Email-Website', config.urls.web);
  rootNode.setHeader('X-Forward-Email-Version', config.pkg.version);
  rootNode.setHeader(
    'X-Forward-Email-Sender',
    `rfc822; ${[
      punycode.toASCII(vacationResponder.from),
      HOSTNAME,
      IP_ADDRESS
    ].join(', ')}`
  );

  rootNode.setContent(vacationResponder.message);

  return rootNode.createReadStream();
}

function getFingerprintKey(session, value) {
  if (!session?.fingerprint) throw new TypeError('Fingerprint missing');
  if (!value) throw new TypeError('Value missing');
  return `${config.fingerprintPrefix}:${session.fingerprint}:${revHash(value)}`;
}

async function imap(alias, headers, session, body) {
  const accepted = [];
  const bounces = [];
  const vacationResponders = [];

  // NOTE: we don't check for denylist in between like forwarding

  //
  // NOTE: we filter out already accepted aliases here
  //
  // aliases = [
  //   {
  //     address: 'test@example.com',
  //     id: '674f6167316b8198f8a09f32'
  //   },
  //   ...
  // ]
  const value = await this.client.get(getFingerprintKey(session, alias.id));
  if (boolean(value)) {
    accepted.push(alias.address);
    if (alias.vacationResponder)
      vacationResponders.push(alias.vacationResponder);
    return {
      accepted,
      bounces,
      vacationResponders
    };
  }

  try {
    // add "Received" and "X-Original-To" headers to the message
    if (!headers.hasHeader('x-original-to')) {
      headers.remove('x-original-to');
      headers.add('X-Original-To', alias.address);
    }

    headers.add(
      'Received',
      getReceivedHeader({
        origin: session.remoteAddress,
        originhost: session.resolvedClientHostname,
        transhost: session.hostNameAppearsAs,
        user: false,
        transtype: session.transmissionType,
        // id: session.id,
        // seq: 'some-seq-id',
        recipient: alias.address,
        // session.tlsOptions {
        //   name: 'ECDHE-RSA-AES128-GCM-SHA256',
        //   standardName: 'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256',
        //   version: 'TLSv1.2'
        // }
        tls:
          session.secure &&
          session?.tlsOptions?.name &&
          session?.tlsOptions?.version
            ? {
                name: session.tlsOptions.name,
                version: session.tlsOptions.version
              }
            : false,
        time: new Date(session.arrivalDate)
      })
    );

    const unsealed = Buffer.concat([headers.build(), body]);
    const sealHeaders = await sealMessage(unsealed, {
      ...config.signatureData,
      authResults: session.arc.authResults,
      cv: session.arc.status.result
    });

    // <https://github.com/websockets/ws/issues/1959>
    const response = await this.wsp.request({
      action: 'tmp',
      aliases: [alias],
      remoteAddress: session.remoteAddress,
      resolvedRootClientHostname: session.resolvedRootClientHostname,
      resolvedClientHostname: session.resolvedClientHostname,
      allowlistValue: session.allowlistValue,
      date:
        typeof session.arrivalDate === 'string'
          ? session.arrivalDate
          : session.arrivalDate.toISOString(),
      raw: Buffer.concat([sealHeaders, unsealed]),
      timeout: ms('1m')
    });

    if (response[alias.address]) {
      // convert response object error into an Error
      const err = parseError(response[alias.address]);
      err.target = env.IMAP_HOST;
      bounces.push({
        address: alias.address,
        err,
        host: env.SQLITE_HOST
      });
    } else {
      logger.info('delivered', {
        // spoofing nodemailer info object
        info: {
          // TODO: improve this message in the future
          response: `Appended to INBOX of ${alias.address}`
          // TODO: we might want to spoof these in future too
          // `messageId`
          // `envelope`
          // `accepted`
          // `rejected`
          // `pending`
        },
        ignore_hook: false,
        resolver: this.resolver,
        session
      });

      // store that we sent this message so we don't again
      const key = getFingerprintKey(session, alias.id);
      this.client
        .pipeline()
        .incr(key)
        .pexpire(key, config.fingerprintTTL)
        .exec()
        .then()
        .catch((err) => logger.fatal(err));
      // push to accepted array
      accepted.push(alias.address);
      if (alias.vacationResponder)
        vacationResponders.push(alias.vacationResponder);
    }
  } catch (_err) {
    // an error occurred here with websockets so we bounce all IMAP recipients
    logger.fatal(_err, { session, resolver: this.resolver });
    const err = parseError(_err);
    err.target = env.IMAP_HOST;
    bounces.push({
      address: alias.address,
      err,
      host: HOSTNAME
    });
  }

  return { accepted, bounces, vacationResponders };
}

async function checkBounceForSpam(bounce, headers, session) {
  //
  // if the bounce error was a code bug then
  // return early since it was on our side
  // (and we don't want any blocking to occur)
  //
  if (bounce?.err?.isCodeBug) return;

  //
  // NOTE: we always store the message fingerprint in our greylist database
  //       in order to prevent the sender from retrying and having the same
  //       bounce occur by the recipient's mail server (which could affect our reputation)
  //       since it appears to the recipient's mail server as if we're the spammer
  //       (see `helpers/is-greylisted.js` which checks the PTTL of this at top of the function)
  //
  //       (this also takes into account DNS bounces, which would prevent unnecessary lookups)
  //
  //       bounce.err = Error: Failed to resolve any IP addresses for the Mail Exchange (MX) server associated with "beep.com"
  //           at /path/to/web/node_modules/.pnpm/mx-connect@1.5.5/node_modules/mx-connect/lib/resolve-ip.js:110:33
  //           at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
  //         code: 'ENOTFOUND',
  //         response: 'DNS Error: Failed to resolve any IP addresses for the Mail Exchange (MX) server associated with "beep.com"',
  //         category: 'dns',
  //         _message: 'Failed to resolve any IP addresses for the Mail Exchange (MX) server associated with "beep.com"',
  //         target: 'beep.com'
  //       },
  //

  // always ensure bounce info object is set
  if (!bounce?.err?.bounceInfo)
    bounce.err.bounceInfo = getBounceInfo(bounce?.err);

  //
  // NOTE: if it was a network (DNS) error then we greylist
  //       for a much shorter duration as opposed to the blanket rule
  //
  await this.client.set(
    getGreylistKey(session.fingerprint),
    true,
    'PX',
    ms(
      session.isAllowlisted
        ? bounce.err.bounceInfo.category === 'network'
          ? '1m'
          : '10m'
        : bounce.err.bounceInfo.category === 'network'
        ? '5m'
        : '1h'
    )
  );

  //
  // NOTE: we prevent actors from maliciously flooding us with DNS requests
  //       (e.g. they configure a server that forwards to a non-routeable destination)
  //       (which results in a lot of DNS lookups/failures, and so we need to alert admins at the least)
  //

  //
  // bounce = {
  //   address: 'foo@example.com',
  //   host: 'example.com',
  //   err: Error,
  //   recipient: {
  //     aliasPublicKey: PublicKey {
  //       keyPacket: PublicKeyPacket {
  //         version: 4,
  //         created: 2024-12-04T21:52:42.000Z,
  //         algorithm: 22,
  //         publicParams: [Object],
  //         expirationTimeV3: 0,
  //         fingerprint: [Uint8Array],
  //         keyID: [KeyID],
  //         packets: PacketList(0) [],
  //         fromStream: false
  //       },
  //       revocationSignatures: [],
  //       directSignatures: [],
  //       users: [ [User] ],
  //       subkeys: [ [Subkey] ]
  //     },
  //     webhookKey: '...',
  //     webhook: 'http://example.com:15836',
  //     to: [ 'http://example.com:15836' ],
  //     recipient: 'test@exmaple.com',
  //     replacements: { 'test@example.com': 'http://example.com:15836' }
  //   }
  // }
  //

  //
  // `getAttributes` function will always return a unique array of lowercase metadata (e.g. hostnames, emails, etc)
  // also note that `true` here indicates it must be SPF or DKIM aligned metadata (since users could otherwise spoof and we could denylist incorrectly)
  //
  const attributes = await getAttributes(headers, session, this.resolver, true);

  //
  // NOTE: we don't denylist attributes that are allowlisted as it would have no impact
  //       instead, for those cases we alert admins of allowlisted values that may need to be denylisted
  //
  await pMap(
    attributes,

    async (attr) => {
      const isAttributeAllowlisted = await isAllowlisted(
        attr,
        this.client,
        this.resolver
      );

      //
      // NOTE: the key needs to have the date in it, otherwise it will keep rolling over
      //       (this is a rudimentary and very simple approach)
      //
      // increase counter for category:attribute:date key
      const key = `counter_${bounce.err.bounceInfo.category}:${attr}:${session.arrivalDateFormatted}`;
      const count = await this.client.incr(key);
      await this.client.pexpire(
        key,
        isAttributeAllowlisted || session.isAllowlisted ? ms('1d') : ms('5d')
      );

      //
      // NOTE: this is an arbitrary counting system that will need refined over time
      //       until we have our spam scanner v7 reputation/tokenization system implemented
      //       (which would come with a bayesian spam filter, phishing/malware token scanning, etc)
      //
      //       if the attribute was a truth source and counter >= 500 in a 24 hour period
      //       or if the attribute was allowlisted and counter is >= 100 in a 24 hour period
      //       or if the attribute was not allowlisted but the session was and counter >= 50 in a 24 hour period
      //       or if the attribute was not allowlisted and nor was the session with >= 10 in a 24 hour period
      //
      //       (this will allow admins to see in real-time which bounce
      //       categories and actions need hard-coded rules implemented)
      //
      let sendCountEmail = false;
      if (config.truthSources.has(attr) && count >= 500) {
        sendCountEmail = 500;
      } else if (isAttributeAllowlisted && count >= 100) {
        sendCountEmail = 100;
      } else if (
        !isAttributeAllowlisted &&
        session.isAllowlisted &&
        count >= 50
      ) {
        sendCountEmail = 50;
      } else if (
        !isAttributeAllowlisted &&
        !session.isAllowlisted &&
        count >= 10
      ) {
        sendCountEmail = 10;
      }

      // NOTE: we may want to trigger alerts for non-allowlisted senders if they exceed a threshold in future
      if (
        session.isAllowlisted &&
        sendCountEmail &&
        ![
          'capacity',
          'other',
          'recipient',
          'block',
          'envelope',
          'network',
          'greylist',
          'blocklist'
        ].includes(bounce.err.bounceInfo.category)
      ) {
        const err = new TypeError(
          `${config.views.locals.emoji(
            isAttributeAllowlisted ? 'rotating_light' : 'warning'
          )} ${attr} sent ${sendCountEmail} ${
            bounce.err.bounceInfo.category
          } bounces in 24 hours`
        );
        err.bounce = bounce;
        err.session = session;
        err.isCodeBug = true;
        logger.fatal(err);
      }

      // return early if the bounce was not from a truth source
      if (!bounce?.err?.truthSource) return;

      // attributes that are email addresses sending viruses get denylisted immediately
      if (
        bounce.err.bounceInfo.category === 'virus' &&
        isEmail(attr) &&
        count >= 3
      ) {
        const err = new TypeError(
          `${config.views.locals.emoji('microbe')} ${config.views.locals.emoji(
            'rotating_light'
          )} ${attr} was denylisted for sending 3+ virus (${
            isAttributeAllowlisted ? 'allowlisted' : 'not allowlisted'
          })`
        );
        err.headers = headers;
        err.bounce = bounce;
        err.session = session;
        err.isCodeBug = true;
        logger.fatal(err, { session });

        // add to the denylist or email the affected customer (e.g. they may need DMARC)
        try {
          await addToDenylist.call(this, attr, headers, bounce, session);
        } catch (err) {
          logger.fatal(err, { session });
        }

        return;
      }

      //
      // NOTE: this is another arbitrary counter approach here for non-email virus attributes and spam in general
      //       (note that admins will get an email if they see an allowlisted domain or email sending a lot of spam per above counter email)
      //
      //       if the attribute was allowlisted (e.g. truth source) then don't do anything (denylisting would have no effect anyways)
      //       else if the attribute was a non-allowlisted email with >= 5 in a 24 hour period
      //       else if the attribute was non-allowlisted with >= 10 in a 24 hour period
      //

      // return early if it was not a spam bounce
      if (bounce.err.bounceInfo.category !== 'spam') return;

      if (isAttributeAllowlisted && count >= 10) {
        const err = new TypeError(
          `${config.views.locals.emoji(
            'canned_food'
          )} ${config.views.locals.emoji(
            'rotating_light'
          )} ${attr} was allowlisted and sent 10+ spam`
        );
        err.bounce = bounce;
        err.session = session;
        err.isCodeBug = true;
        err.headers = headers;
        logger.fatal(err);
      } else if (!isAttributeAllowlisted) {
        let shouldDenylist = false;
        if (isEmail(attr) && count >= 5) {
          shouldDenylist = true;
        } else if (count >= 10) {
          shouldDenylist = true;
        }

        if (shouldDenylist) {
          if (session.isAllowlisted) {
            const err = new TypeError(
              `${config.views.locals.emoji(
                'canned_food'
              )} ${config.views.locals.emoji(
                'warning'
              )} ${attr} was denylisted for spam`
            );
            err.bounce = bounce;
            err.session = session;
            err.isCodeBug = true;
            err.headers = headers;
            logger.fatal(err, { session });
          }

          // add to the denylist or email the affected customer (e.g. they may need DMARC)
          try {
            await addToDenylist.call(this, attr, headers, bounce, session);
          } catch (err) {
            logger.fatal(err, { session });
          }
        }
      }
    },
    { concurrency: config.concurrency }
  );
}

//
// TODO: since we rewrote most of this and sendEmail only accepts one email at a time
//       we can probably rewrite most of the `recipient.replacements` stuff below to clean it up
//

async function forward(recipient, headers, session, body) {
  // prevent sending to the same webhook or email twice
  const key = getFingerprintKey(session, recipient.webhook || recipient.to[0]);

  const [count] = await Promise.all([
    this.client.incrby(key, 0),
    (async () => {
      //
      // NOTE: we send emails in series therefore we can check
      //       if the sender was denylisted since sending started
      //       so that we can stop the spam right away rather
      //       then wait until we're done iterating over RCPT TO values
      //
      try {
        await isDenylisted(
          [recipient.webhook || recipient.to[0], ...session.attributes],
          this.client,
          this.resolver
        );
      } catch (err) {
        // store a counter
        if (err instanceof DenylistError)
          this.client
            .incr(`denylist_prevented:${session.arrivalDateFormatted}`)
            .then()
            .catch((err) => logger.fatal(err));
        throw err;
      }
    })()
  ]);

  const accepted = [];
  const bounces = [];

  if (count > 0) {
    // NOTE: we group together recipients based off endpoint
    for (const replacement of Object.keys(recipient.replacements)) {
      if (!accepted.includes(replacement)) accepted.push(replacement);
    }

    return {
      accepted,
      bounces,
      vacationResponder:
        accepted.length > 0 ? recipient.vacationResponder : false
    };
  }

  // add "Received" and "X-Original-To" headers to the message
  if (!headers.hasHeader('x-original-to')) {
    headers.remove('x-original-to');
    headers.add('X-Original-To', recipient.recipient);
  }

  headers.add(
    'Received',
    getReceivedHeader({
      origin: session.remoteAddress,
      originhost: session.resolvedClientHostname,
      transhost: session.hostNameAppearsAs,
      user: false,
      transtype: session.transmissionType,
      // id: session.id,
      // seq: 'some-seq-id',
      recipient: recipient.recipient,
      // session.tlsOptions {
      //   name: 'ECDHE-RSA-AES128-GCM-SHA256',
      //   standardName: 'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256',
      //   version: 'TLSv1.2'
      // }
      tls:
        session.secure &&
        session?.tlsOptions?.name &&
        session?.tlsOptions?.version
          ? {
              name: session.tlsOptions.name,
              version: session.tlsOptions.version
            }
          : false,
      time: new Date(session.arrivalDate)
    })
  );

  // NOTE: we don't add to mail_accepted nor mail_rejected counters for webhooks
  if (recipient.webhook) {
    try {
      // dkim sign the message
      const unsealed = await signMessage(
        Buffer.concat([headers.build(), body])
      );

      const sealHeaders = await sealMessage(unsealed, {
        ...config.signatureData,
        authResults: session.arc.authResults,
        cv: session.arc.status.result
      });

      const raw = Buffer.concat([sealHeaders, unsealed]);

      const mail = await simpleParser(raw, {
        Iconv,
        skipHtmlToText: true,
        skipTextLinks: true,
        skipTextToHtml: true,
        skipImageLinks: true,
        maxHtmlLengthToParse: bytes(env.SMTP_MESSAGE_MAX_SIZE)
      });

      //
      // delete `mail.attachments` and `mail.raw` if we detect the
      // user did not want attachments or raw in JSON payload
      // <https://github.com/forwardemail/forwardemail.net/issues/322#issuecomment-2752210518>
      //
      const url = new URLParse(recipient.webhook, (query) =>
        qs.parse(query, { ignoreQueryPrefix: true })
      );

      if (url?.query?.attachments === 'false') delete mail.attachments;
      if (!url?.query?.raw || url?.query?.raw !== 'false')
        mail.raw = raw.toString();

      const webhookBody = JSON.stringify({
        ...mail,
        dkim: session.dkim,
        spf: session.spf,
        arc: session.arc,
        dmarc: session.dmarc,
        bimi: session.bimi,
        // NOTE: we don't add the following (yet)
        // - `session.receivedChain`
        // - `session.spfFromHeader`
        // - `session.signingDomains` (Set)
        // - `session.alignedDKIMResults`
        // - `session.hadAlignedAndPassingDKIM`
        headers: session.headers,
        recipients: Object.keys(recipient.replacements),
        session: {
          recipient: recipient.recipient,
          remoteAddress: session.remoteAddress,
          remotePort: session.remotePort,
          clientHostname:
            session.resolvedClientHostname || session.clientHostname,
          hostNameAppearsAs: session.hostNameAppearsAs,
          sender: session.envelope.mailFrom.address,
          mta: HOSTNAME,
          arrivalDate: session.arrivalDate,
          arrivalTime: session.arrivalTime
        }
      });

      // TODO: we may want to prevent localhost bound reverse hostname
      //       (in which case we'd need `punycode.toASCII` on the domain)
      if (
        isIP(parseRootDomain(recipient.webhook)) &&
        REGEX_LOCALHOST.test(parseRootDomain(recipient.webhook))
      )
        throw new SMTPError(
          i18n.translateError('INVALID_LOCALHOST_URL', 'en'),
          { ignore_hook: true }
        );

      const response = await retryRequest(
        // dummyproofing
        recipient.webhook
          .replace('HTTP://', 'http://')
          .replace('HTTPS://', 'https://'),
        {
          method: 'POST',
          headers: {
            'User-Agent': USER_AGENT,
            'Content-Type': 'application/json',
            //
            // NOTE: per discussion at <https://github.com/forwardemail/free-email-forwarding/issues/235>
            //       it was requested that we sign webhooks with a signature for payload verification
            //       <https://stackoverflow.com/a/68885281>
            //
            ...(recipient.webhookKey
              ? {
                  'X-Webhook-Signature': crypto
                    .createHmac('sha256', decrypt(recipient.webhookKey))
                    .update(webhookBody)
                    .digest('hex')
                }
              : {})
          },
          body: webhookBody,
          resolver: this.resolver
        }
      );

      let text = 'OK';
      if (response.statusCode === 200) {
        text = await response.body.text();
      } else if (
        !response?.signal?.aborted &&
        typeof response?.body?.dump === 'function'
      )
        await response.body.dump();

      logger.info('delivered', {
        // spoofing nodemailer info object
        info: {
          response: text
          // TODO: we might want to spoof these in future too
          // `messageId`
          // `envelope`
          // `accepted`
          // `rejected`
          // `pending`
        },
        // TODO: use `is_webhook` later in the future
        is_webhook: true,
        ignore_hook: false,
        resolver: this.resolver,
        session
      });

      // store that we sent this so we don't again
      this.client
        .pipeline()
        .incr(key)
        .pexpire(key, config.fingerprintTTL)
        .exec()
        .then()
        .catch((err) => logger.fatal(err));

      // NOTE: we group together recipients based off endpoint
      for (const replacement of Object.keys(recipient.replacements)) {
        if (!accepted.includes(replacement)) accepted.push(replacement);
      }

      return {
        accepted,
        bounces,
        vacationResponder:
          accepted.length > 0 ? recipient.vacationResponder : false
      };
    } catch (err_) {
      // delete undici's `body` prop in err object
      // in order to prevent huge payloads in-memory
      delete err_.body;

      // preserve webhook for admins to inspect if user needs help
      err_.webhook = recipient.webhook;
      logger.error(err_, { session, resolver: this.resolver });

      // determine if code or status is retryable here and set it as `err._responseCode`
      // TODO: rewrite `err.response` and `err.message` if either/both start with diagnostic code
      err_.responseCode = getErrorCode(err_);

      // preserve original message
      err_.original_message = err_.message;

      // hide the webhook endpoint
      try {
        err_.message = err_.message.replace(
          new RE2(new RegExp(escapeStringRegexp(recipient.webhook), 'gi')),
          'a webhook endpoint'
        );
        // TODO: may need to replace by `value` property (e.g. HTTP -> http)
      } catch (err) {
        // catch in case undici error
        // (e.g. Cannot set property which only has a getter)
        // TODO: we shouldn't call `.replace` on an instance of a ResponseStatusCodeError (?)
        // new undici.errors.ResponseStatusCodeError(...)
        err.orig_error = err_;
        err.isCodeBug = true;
        logger.fatal(err);
      }

      // in case the response had sensitive email user information hide it too
      for (const address of Object.keys(recipient.replacements)) {
        try {
          err_.message = err_.message.replace(
            new RE2(new RegExp(escapeStringRegexp(address), 'gi')),
            recipient.replacements[address]
          );
        } catch (err) {
          // catch in case undici error
          // (e.g. Cannot set property which only has a getter)
          // TODO: we shouldn't call `.replace` on an instance of a ResponseStatusCodeError (?)
          // new undici.errors.ResponseStatusCodeError(...)
          err.orig_error = err_;
          err.isCodeBug = true;
          logger.fatal(err);
        }
      }

      const obj = parseErr(err_);
      // webhook response is helpful for users to debug
      if (obj.response) {
        if (obj.response.text) {
          // ensure the response is not more than 1 KB
          const bytes = Buffer.byteLength(obj.response.text, 'utf8');
          obj.response =
            bytes > bytes('1KB')
              ? 'Response byte size exceeds 1 KB'
              : obj.response.text;
        } else delete obj.response;
      }

      for (const address of Object.keys(recipient.replacements)) {
        const err = new Error(err_.message);
        for (const k of Object.keys(obj)) {
          if (k === 'message') continue;
          err[k] = obj[k];
        }

        if (err_.status) {
          err.message = `${err_.status} ${status(err_.status)}${
            err_.status === 500 ? '' : ' Error'
          } for ${address}`;
        } else if (err_.statusCode) {
          err.message = `${err_.statusCode} ${status(err_.statusCode)}${
            err_.statusCode === 500 ? '' : ' Error'
          } for ${address}`;
        } else if (err_.code) {
          // use user-friendly error messages instead of internal error codes
          // (e.g. UND_ERR_CONNECT_TIMEOUT -> Connection Timeout)
          let friendlyMessage;
          switch (err_.code) {
            case 'UND_ERR_CONNECT_TIMEOUT': {
              friendlyMessage = 'Connection Timeout';
              break;
            }

            case 'UND_ERR_HEADERS_TIMEOUT': {
              friendlyMessage = 'Headers Timeout';
              break;
            }

            case 'UND_ERR_BODY_TIMEOUT': {
              friendlyMessage = 'Body Timeout';
              break;
            }

            case 'UND_ERR_SOCKET': {
              friendlyMessage = 'Socket Error';
              break;
            }

            case 'UND_ERR_ABORTED': {
              friendlyMessage = 'Request Aborted';
              break;
            }

            case 'UND_ERR_DESTROYED': {
              friendlyMessage = 'Connection Destroyed';
              break;
            }

            case 'UND_ERR_CLOSED': {
              friendlyMessage = 'Connection Closed';
              break;
            }

            case 'ETIMEDOUT': {
              friendlyMessage = 'Connection Timed Out';
              break;
            }

            case 'ECONNRESET': {
              friendlyMessage = 'Connection Reset';
              break;
            }

            case 'ECONNREFUSED': {
              friendlyMessage = 'Connection Refused';
              break;
            }

            case 'ENOTFOUND': {
              friendlyMessage = 'Host Not Found';
              break;
            }

            case 'ENETUNREACH': {
              friendlyMessage = 'Network Unreachable';
              break;
            }

            case 'EHOSTUNREACH': {
              friendlyMessage = 'Host Unreachable';
              break;
            }

            default: {
              // for other codes, use a generic message
              friendlyMessage = 'Network Error';
            }
          }

          err.message = `${friendlyMessage} for ${address}`;
        }

        // TODO: rewrite `err.response` and `err.message` if either/both start with diagnostic code
        err.responseCode = getErrorCode(err_);

        err.target = parseHostFromDomainOrAddress(recipient.webhook);

        bounces.push({
          address,
          err,
          recipient
        });
      }
    }

    return {
      accepted,
      bounces,
      vacationResponder:
        accepted.length > 0 ? recipient.vacationResponder : false
    };
  }

  //
  // TODO: check DSN issues (e.g. specify `recipient` field)
  //       <https://www.nodemailer.com/smtp/dsn/>
  //
  // > The DSN MUST be addressed (in both the message header and the
  //   transport envelope) to the return address from the transport envelope
  //   which accompanied the original message for which the DSN was
  //   generated.  (For a message that arrived via SMTP, the envelope return
  //   address appears in the MAIL FROM command.)
  //
  // <https://datatracker.ietf.org/doc/html/rfc3464#:~:text=The%20DSN%20MUST%20be,the%20MAIL%20FROM%20command.)>
  //
  let from;
  if (isSANB(session.envelope.mailFrom.address)) {
    if (
      session.envelope.mailFrom.address
        .toLowerCase()
        .endsWith(`@${env.WEB_HOST}`)
    ) {
      from = session.envelope.mailFrom.address;
    } else {
      from = srs.forward(
        checkSRS(session.envelope.mailFrom.address),
        env.WEB_HOST
      );
    }
  }

  // NOTE: only webhooks use array for `to`, send email uses a string (we convert it)
  if (!_.isArray(recipient.to) || recipient.to.length > 1)
    throw new TypeError('Invalid array of recipients');

  const unsealed = Buffer.concat([headers.build(), body]);
  const sealHeaders = await sealMessage(unsealed, {
    ...config.signatureData,
    authResults: session.arc.authResults,
    cv: session.arc.status.result
  });

  try {
    let info;
    try {
      // check for abuse (e.g. massive amount of domains forwarding to single email addresses)
      const key = `abuse_check:${revHash(recipient.to[0].toLowerCase())}`;
      const cache = await this.client.get(key);
      let json;
      if (cache) {
        try {
          json = JSON.parse(cache);
          if (
            typeof json !== 'object' ||
            typeof json.domains !== 'object' ||
            !Array.isArray(json.domains) ||
            typeof json.sent !== 'boolean'
          )
            throw new TypeError('JSON invalid');
        } catch (err) {
          logger.fatal(err);
          json = null;
        }
      }

      if (!json) json = { domains: [], sent: false };
      const rootDomain = parseRootDomain(
        parseHostFromDomainOrAddress(recipient.recipient)
      );
      if (!json.domains.includes(rootDomain)) json.domains.push(rootDomain);
      json.email = recipient.to[0].toLowerCase();
      // rudimentary email alert to admins if we detect the count was >= 20
      if (!json.sent && json.domains.length >= 20) {
        json.sent = true;

        // log fatal error email alert to admins
        const err = new TypeError(
          `${recipient.to[0].toLowerCase()} forwarded to from ${
            json.domains.length
          } domains`
        );
        err.isCodeBug = true;
        err.domains = json.domains;
        err.recipient = recipient;
        err.session = session;
        logger.fatal(err);
      }

      await this.client.set(key, safeStringify(json), 'PX', ms('30d'));

      info = await sendEmail({
        session,
        cache: this.cache,
        target: recipient.host,
        port: recipient.port,
        envelope: {
          from,
          to: recipient.to[0],
          requireTLS: session.envelope.requireTLS
        },
        raw: Buffer.concat([sealHeaders, unsealed]),
        resolver: this.resolver,
        client: this.client,
        publicKey: recipient.aliasPublicKey
      });
    } catch (err) {
      //
      // TODO: until we figure out how best to resolve this issue
      //       we've implemented this logic which will retry sending
      //       with a friendly-from rewrite as per our FAQ
      //       <https://github.com/postalsys/mailauth/issues/74>
      //
      // NOTE: this would need rewritten if we keep this and
      //       if we change the `recipient.to[0]` stuff above
      //       because we'd have to support `rejectedErrors` with this
      //
      err.bounceInfo = getBounceInfo(err);

      //
      // if user mailbox is full or if they are receiving mail too quickly
      // then we should back off from retrying by greylisting the session fingerprint
      // (this prevents repeated delivery attempts to the same recipient from the same sender
      // without blocking other senders from delivering to that recipient)
      //
      if (
        err.truthSource &&
        isEmail(recipient.to[0]) &&
        ((err.bounceInfo.action === 'reject' &&
          err.bounceInfo.category === 'capacity' &&
          err.bounceInfo.message &&
          err.bounceInfo.message.toLowerCase() === 'mailbox is full') ||
          (err.bounceInfo.action === 'defer' &&
            err.bounceInfo.category === 'recipient' &&
            err.bounceInfo.message &&
            err.bounceInfo.message.toLowerCase() === 'recipient overloaded'))
      ) {
        this.client
          .set(
            getGreylistKey(session.fingerprint),
            true,
            'PX',
            ms(session.isAllowlisted ? '30m' : '2h')
          )
          .then()
          .catch((err) => logger.fatal(err));
        throw err;
      }

      if (
        !session.rewriteFriendlyFrom &&
        session.dmarc?.status?.result === 'pass' &&
        err.bounceInfo.category === 'dmarc' &&
        (session.isAllowlisted || session.hasSameHostnameAsFrom)
      ) {
        session.rewriteFriendlyFrom = true;

        // TODO: disabled until we use MongoDB for this
        // notify common system administrator usernames of this issue
        // sendSysAdminEmail
        //   .call(this, 'dmarc-issue', err, session, headers)
        //   .then()
        //   .catch((err) => logger.fatal(err));

        headers.update(
          'From',
          `"${session.originalFromAddress}" <${config.friendlyFromEmail}>`
        );
        headers.add('X-Original-From', session.originalFromAddress);
        //
        // if there was an original reply-to on the email
        // then we don't want to modify it of course
        //
        // <https://github.com/andris9/mailsplit/issues/21>
        if (!getHeaders(headers, 'reply-to'))
          headers.update('Reply-To', session.originalFromAddress);

        const unsealed = Buffer.concat([headers.build(), body]);
        const sealHeaders = await sealMessage(unsealed, {
          ...config.signatureData,
          authResults: session.arc.authResults,
          cv: session.arc.status.result
        });

        // retry sending the email
        try {
          info = await sendEmail({
            session,
            cache: this.cache,
            target: recipient.host,
            port: recipient.port,
            envelope: {
              from,
              to: recipient.to[0],
              requireTLS: session.envelope.requireTLS
            },
            raw: Buffer.concat([sealHeaders, unsealed]),
            resolver: this.resolver,
            client: this.client,
            publicKey: recipient.aliasPublicKey
          });
        } catch (err) {
          err.bounceInfo = getBounceInfo(err);
          // alert admins of the issue
          if (err.bounceInfo.category === 'dmarc') {
            if (!session.isAllowlisted && !session.hasSameHostnameAsFrom)
              err.message = `No Friendly-From Rewrite: ${err.message}`;
            err.isCodeBug = true;
            err.session = session;
            logger.fatal(err);
          }

          // throw original error
          throw err;
        }
      } else {
        throw err;
      }
    }

    logger.info('sent email', {
      info,
      session
    });

    // store that we sent this so we don't again
    this.client
      .pipeline()
      .incr(key)
      .pexpire(key, config.fingerprintTTL)
      .exec()
      .then()
      .catch((err) => logger.fatal(err));

    if (info.accepted && info.accepted.length > 0) {
      // add the masked recipient to the final accepted array
      // (we don't want to reveal forwarding config to client SMTP servers)
      for (const replacement of Object.keys(recipient.replacements)) {
        if (!accepted.includes(replacement)) accepted.push(replacement);
      }

      for (const a of info.accepted) {
        //
        // check to see if we sent an email to the same address it was coming from
        // (and if so, then send a self test email to notify sender it won't show up twice)
        //

        //
        // get normalized form without `+` symbol (in case someone tries test+something@gmail.com)
        //
        const domainName = parseHostFromDomainOrAddress(a);
        const rootDomain = parseRootDomain(domainName);
        const normal = `${parseUsername(a)}@${domainName}`;
        const isRestricted = config.restrictedDomains.some(
          (ext) =>
            rootDomain === ext ||
            rootDomain.endsWith(`.${ext}`) ||
            rootDomain === `nic.${ext}`
        );
        // TODO: other enterprise customers, e.g. linux foundation
        if (
          !isRestricted &&
          !Object.keys(config.ubuntuTeamMapping).includes(rootDomain) &&
          !config.ignoredSelfTestDomains.has(rootDomain) &&
          isSANB(session.envelope.mailFrom.address) &&
          normal === checkSRS(session.envelope.mailFrom.address).toLowerCase()
        ) {
          // NOTE: instead of using /v1/self-test endpoint we do this in real-time
          SelfTests.exists({
            email: normal
          })
            .then(async (exists) => {
              if (exists) return;
              try {
                await SelfTests.create({ email: normal });
                const user = await Users.findOne({ email: normal })
                  .lean()
                  .exec();
                const locale = user
                  ? user[config.lastLocaleField]
                  : i18n.config.defaultLocale;
                const locals = { locale };
                if (user) locals.user = user;

                // TODO: use Emails.queue
                await emailHelper({
                  template: 'self-test',
                  message: { to: normal },
                  locals
                });
              } catch (err) {
                logger.fatal(err);
              }
            })
            .catch((err) => logger.fatal(err));
        }
      }

      // accepted counter
      this.client
        .incrby(
          `mail_accepted:${session.arrivalDateFormatted}`,
          info.accepted.length
        )
        .then()
        .catch((err) => logger.fatal(err));
    }

    if (info.rejectedErrors && info.rejectedErrors.length > 0) {
      for (const err of info.rejectedErrors) {
        logger.warn(err, {
          session
        });

        // here we do some magic so that we push an error message
        // that has the end-recipient's email masked with the
        // original to address that we were trying to send to
        err._message = err.message;
        for (const address of Object.keys(recipient.replacements)) {
          err.message = err.message.replace(
            new RE2(new RegExp(escapeStringRegexp(address), 'gi')),
            recipient.replacements[address]
          );
        }

        if (!err.target) err.target = recipient.host;

        bounces.push({
          address: recipient.recipient,
          host: recipient.host,
          err,
          recipient
        });
      }

      // rejected counter
      this.client
        .incrby(
          `mail_rejected:${session.arrivalDateFormatted}`,
          info.rejectedErrors.length
        )
        .then()
        .catch((err) => logger.fatal(err));
    }
  } catch (err) {
    // here we do some magic so that we push an error message
    // that has the end-recipient's email masked with the
    // original to address that we were trying to send to
    err._message = err.message;
    for (const address of Object.keys(recipient.replacements)) {
      err.message = err.message.replace(
        new RE2(new RegExp(escapeStringRegexp(address), 'gi')),
        recipient.replacements[address]
      );
    }

    if (!err.target) err.target = recipient.host;

    bounces.push({
      address: recipient.recipient,
      host: recipient.host,
      err,
      recipient
    });

    // rejected counter
    this.client
      .incr(`mail_rejected:${session.arrivalDateFormatted}`)
      .then()
      .catch((err) => logger.fatal(err));
  }

  //
  // NOTE: here is where we denylist and greylist in real-time
  //       in order to prevent spammers from sending to bulk RCPT TO
  //       (this is the reason why we use pMapSeries instead of pMap)
  //
  await pMap(
    bounces,
    (bounce) => checkBounceForSpam.call(this, bounce, headers, session),
    {
      concurrency: config.concurrency
    }
  );

  return {
    accepted,
    bounces,
    vacationResponder: accepted.length > 0 ? recipient.vacationResponder : false
  };
}

//
// TODO: all counters should be reflected in new deliverability dashboard for users
//

function updateMXHeaders(headers, session) {
  headers.remove('x-forward-email-sender');
  const senderHeader = [];
  if (
    isSANB(session.envelope.mailFrom.address) &&
    isEmail(session.envelope.mailFrom.address)
  )
    senderHeader.push(
      punycode.toASCII(checkSRS(session.envelope.mailFrom.address))
    );
  if (session.resolvedClientHostname)
    senderHeader.push(session.resolvedClientHostname);
  senderHeader.push(session.remoteAddress);
  headers.add(
    'X-Forward-Email-Sender',
    `rfc822; ${senderHeader.join(', ')}`
    // headers.lines.length
  );
  if (config.env !== 'production') {
    headers.remove('x-forward-email-session-id');
    headers.add('X-Forward-Email-Session-ID', session.id); // , headers.lines.length);
  }

  //
  // NOTE: as a test of ARC with truth sources we're disabling this as we have a catch in sendEmail forn ow
  //
  /*
  //
  // perform a friendly-from rewrite if necessary using mailauth data
  // (basically if no aligned DKIM and if strict DMARC we can assume it's relying on SPF)
  // <https://github.com/postalsys/mailauth/issues/74>
  //
  if (
    session.dmarc?.status?.result === 'pass' &&
    !session.hadAlignedAndPassingDKIM &&
    (session.isAllowlisted || session.hasSameHostnameAsFrom)
  ) {
    session.rewriteFriendlyFrom = true;
    // TODO: disabled until we use MongoDB for this
    // const err = new TypeError(
    //   `DMARC passing only via SPF and therefore will break when forwarded since DKIM signature is not aligned with "From" header domain of ${
    //     session.dmarc?.status?.header?.d || session.originalFromAddressDomain
    //   }.`
    // );
    // err.truthSource = env.WEB_HOST;
    // notify common system administrator usernames of this issue
    // sendSysAdminEmail
    //   .call(this, 'dmarc-issue', err, session, headers)
    //   .then()
    //   .catch((err) => logger.fatal(err));

    headers.update(
      'From',
      `"${session.originalFromAddress}" <${config.friendlyFromEmail}>`
    );
    headers.add('X-Original-From', session.originalFromAddress);
    //
    // if there was an original reply-to on the email
    // then we don't want to modify it of course
    //
    // <https://github.com/andris9/mailsplit/issues/21>
    if (!getHeaders(headers, 'reply-to'))
      headers.update('Reply-To', session.originalFromAddress);
  }
  */
}

async function onDataMX(session, headers, body) {
  // TODO: possibly store a counter here too for arbitrary blocks by day
  // arbitrary spam checks
  // (this throws an error if any arbitrary checks were detected)
  // (this relies on `isAuthenticatedMessage` to populate `session.spf` etc)
  const [silentBanned] = await Promise.all([
    (async () => {
      //
      // check message against DKIM, SPF, DMARC
      // (this populates `session.spf`, `session.dmarc`, etc)
      // (it also throws an error if it was found to be unauthenticated)
      //
      await isAuthenticatedMessage(headers, body, session, this.resolver);

      isArbitrary(session, headers); // , body.toString());

      // if there were DKIM signing domains then check them
      // against the silent ban and denylists
      let silentBanned = false;
      if (session.signingDomains.size > 0) {
        for (const signingDomain of session.signingDomains) {
          silentBanned = await isSilentBanned(
            signingDomain,
            this.client,
            this.resolver
          );
          if (silentBanned) break; // break early
          try {
            await isDenylisted(signingDomain, this.client, this.resolver);
          } catch (err) {
            // store a counter
            if (err instanceof DenylistError)
              this.client
                .incr(`denylist_prevented:${session.arrivalDateFormatted}`)
                .then()
                .catch((err) => logger.fatal(err));
            throw err;
          }
        }
      }

      return silentBanned;
    })(),
    //
    // determine if we should check against backscatterer list
    // (only if blank, mailer-daemon@, postmaster@, or another standard)
    // (and if not allowlisted)
    // <https://unix.stackexchange.com/q/65013>
    // <http://www.backscatterer.org/?target=usage>
    //
    (async () => {
      if (!session.isAllowlisted) {
        let checkBackscatterer = false;
        // check against MAIL FROM
        if (
          isSANB(session.envelope.mailFrom.address) &&
          isEmail(session.envelope.mailFrom.address)
        ) {
          const username = parseUsername(
            checkSRS(session.envelope.mailFrom.address)
          );
          if (config.POSTMASTER_USERNAMES.has(username))
            checkBackscatterer = true;
        } else {
          // MAIL FROM was <> (empty)
          checkBackscatterer = true;
        }

        // check against From header
        if (!checkBackscatterer) {
          const username = parseUsername(checkSRS(session.originalFromAddress));
          if (config.POSTMASTER_USERNAMES.has(username))
            checkBackscatterer = true;
        }

        // check against backscatterer list
        // (it will throw a DenylistError if so)
        if (checkBackscatterer) {
          try {
            await isBackscatterer(
              session.remoteAddress,
              this.client,
              this.resolver
            );
          } catch (err) {
            // store a counter
            if (err instanceof DenylistError)
              this.client
                .incr(`backscatter_prevented:${session.arrivalDateFormatted}`)
                .then()
                .catch((err) => logger.fatal(err));
            throw err;
          }
        }
      }
    })(),
    //
    // NOTE: here is where we check against denylist
    //       (we simply check if any of the `session.attributes` were denylisted)
    //       (this includes added RCPT TO values as parsed in `helpers/on-data.js`)
    //       (it will throw a DenylistError if so)
    //
    (async () => {
      try {
        await isDenylisted(session.attributes, this.client, this.resolver);
      } catch (err) {
        // store a counter
        if (err instanceof DenylistError)
          this.client
            .incr(`denylist_prevented:${session.arrivalDateFormatted}`)
            .then()
            .catch((err) => logger.fatal(err));
        throw err;
      }
    })(),
    // only let this message retry for up to 5 days
    // (this throws an error if it exceeds duration)
    hasFingerprintExpired(session, this.client),
    // TODO: possibly store a counter here too for greylisting by day
    // check if the message needs to be greylisted
    // (this throws an error if so)
    isGreylisted(session, this.client)
  ]);

  // return early if it was silent banned
  if (silentBanned) return;

  /*
  // TODO: re-enable spam scanner once v7 released
  const scan = await scanner.scan(raw);

  // arbitrary tests (e.g. EICAR) always should throw
  if (_.isArray(scan?.results?.arbitrary) && !_.isEmpty(scan.results.arbitrary))
    throw new SMTPError(scan.results.arbitrary.join(' '), {
      responseCode: 554
    });
  */

  //
  // NOTE: however the other spamscanner tests including these should be on a per-domain basis
  // - phishing
  // - executables
  // - viruses
  //
  // (see `helpers/get-recipients.js` as these args are passed)
  //

  // add X-* headers (e.g. version + report-to)
  updateHeaders(headers, session);

  // additional headers to add specifically for MX
  // (this also does a friendly-from rewrite if necessary)
  updateMXHeaders(headers, session);

  // this is the core logic that determines where to forward and deliver emails to
  // TODO: re-enable spam scanner once v7 released
  // const data = await getRecipients.call(this, session, scan);
  const data = await getRecipients.call(this, session);

  // return early if necessary (e.g. all recipients were silent banned)
  if (
    !data ||
    (data.bounces.length === 0 &&
      data.normalized.length === 0 &&
      data.imap.length === 0)
  ) {
    logger.debug('returning early', { session, resolver: this.resolver });
    return;
  }

  // deliver to IMAP and forward messages in parallel
  const [imapResults, forwardResults] = await Promise.all([
    // imap
    data.imap.length === 0
      ? Promise.resolve()
      : pMap(
          data.imap,
          (alias) =>
            imap.call(
              this,
              alias,
              // clone headers to prevent mutations
              new Headers(headers.build(), { Iconv }),
              session,
              body
            ),
          { concurrency: config.concurrency }
        ),
    // forwarding
    data.normalized.length === 0
      ? Promise.resolve()
      : pMapSeries(data.normalized, (recipient) =>
          forward.call(
            this,
            recipient,
            // clone headers to prevent mutations
            new Headers(headers.build(), { Iconv }),
            session,
            body
          )
        )
  ]);

  const accepted = [];
  const bounces = [...data.bounces];
  const vacationResponders = [];

  // NOTE: we don't add to mail_accepted nor mail_rejected counters for IMAP
  if (imapResults) {
    for (const result of imapResults) {
      if (result.accepted.length > 0) {
        for (const a of result.accepted) {
          if (!accepted.includes(a)) accepted.push(a);
        }
      }

      if (result.bounces.length > 0) bounces.push(...result.bounces);

      if (result.vacationResponders.length > 0)
        vacationResponders.push(...result.vacationResponders);
    }
  }

  if (forwardResults) {
    for (const result of forwardResults) {
      if (result.accepted.length > 0) {
        for (const a of result.accepted) {
          if (!accepted.includes(a)) accepted.push(a);
        }
      }

      if (result.bounces.length > 0) bounces.push(...result.bounces);

      if (result.vacationResponder)
        vacationResponders.push(result.vacationResponder);
    }
  }

  //
  // send vacation responders if necessary in series
  //
  if (
    shouldSendVacationOrBounce(headers, session) &&
    vacationResponders.length > 0
  ) {
    pMapSeries(
      // ensure they are unique by alias_id otherwise we'd do unnecessary calls
      _.uniqBy(vacationResponders, (obj) => obj.alias_id),
      async (vacationResponder) => {
        try {
          await sendVacationResponder.call(
            this,
            vacationResponder,
            headers,
            session
          );
        } catch (err) {
          logger.fatal(err);
        }
      }
    )
      .then()
      .catch((err) => logger.fatal(err));
  }

  // if at least one was accepted and potential phishing
  // was detected from `helpers/is-arbitrary.js` then
  // send a one-time email to each of the accepted recipients
  if (accepted.length > 0 && session.isPotentialPhishing) {
    pMapSeries(accepted, async (to) => {
      try {
        const key = `phishing_check:${
          session.originalFromAddressRootDomain
        }:${to.toLowerCase()}`;
        const cache = await this.client.get(key);
        if (cache) return;
        await this.client.set(key, true, 'PX', ms('30d'));
        await emailHelper({
          template: 'phishing-alert',
          message: { to },
          locals: {
            from: session.originalFromAddress,
            domain: session.originalFromAddressRootDomain,
            subject: getHeaders(headers, 'subject'),
            date: getHeaders(headers, 'date'),
            messageId: getHeaders(headers, 'message-id'),
            remoteAddress: session.remoteAddress
          }
        });
      } catch (err) {
        logger.fatal(err);
      }
    })
      .then()
      .catch((err) => logger.fatal(err));
  }

  // return early if no bounces (complete successful delivery)
  if (bounces.length === 0) return;

  //
  // prepare final combined error and message
  //
  const errors = [];
  const codes = [];
  let isDenylistError = false;
  let hasCodeBug = false;

  //
  // TODO: we may want to redo this in the future
  //     (it's vague as to what email addresses specifically fail)
  //     (although we do not want to expose destination addresses)
  //
  if (accepted.length > 0)
    errors.push(
      new Error(`Message delivered to ${arrayJoinConjunction(accepted.sort())}`)
    );

  for (const bounce of bounces) {
    errors.push(bounce.err);
    codes.push(getErrorCode(bounce.err));
    if (bounce.err instanceof DenylistError) isDenylistError = true;
    if (isCodeBug(bounce.err)) hasCodeBug = true;
  }

  const err = combineErrors(errors);
  if (isDenylistError) err.name = 'DenylistError';
  if (hasCodeBug) err.isCodeBug = true;

  // set SMTP response code equal to lowest error code
  err.responseCode = codes.sort()[0];

  // preserve original bounce array
  err.bounces = bounces;

  // throw the error so it bubbles up to connection
  throw err;
}

module.exports = onDataMX;
