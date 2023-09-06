const RE2 = require('re2');
const _ = require('lodash');
const ip = require('ip');
const isSANB = require('is-string-and-not-blank');
const previewEmail = require('preview-email');
const zoneMTABounces = require('zone-mta/lib/bounces');

const config = require('#config');
const getErrorCode = require('#helpers/get-error-code');
const getTransporter = require('#helpers/get-transporter');
const isCodeBug = require('#helpers/is-code-bug');
const isNodemailerError = require('#helpers/is-nodemailer-error');
const isTLSError = require('#helpers/is-tls-error');
const isSSLError = require('#helpers/is-ssl-error');
const logger = require('#helpers/logger');

const IP_ADDRESS = ip.address();

const REGEX_SPOOFING = new RE2(/spoof|impersonation|impersonate/im);
const REGEX_LOCAL_POLICY = new RE2(/local\s+policy/im);
const REGEX_SPAM = new RE2(/spam/im);
const REGEX_VIRUS = new RE2(/virus/im);
const REGEX_DENYLIST = new RE2(/denylist|deny\s+list/im);
const REGEX_BLACKLIST = new RE2(/blacklist|black\s+list/im);
const REGEX_BLOCKLIST = new RE2(/blocklist|block\s+list/im);
const APPLE_HOSTS = new Set(['apple.com', 'icloud.com', 'me.com', 'mac.com']);

const MAIL_RETRY_ERROR_CODES = new Set([
  'ECONNRESET',
  'ESOCKET',
  'ECONNECTION',
  'ETIMEDOUT',
  'EDNS',
  'EPROTOCOL'
]);

// eslint-disable-next-line complexity
async function shouldThrowError(err, session) {
  // handle programmer mistakes
  err.isCodeBug = isCodeBug(err);

  // TODO: rewrite `err.response` and `err.message` if either/both start with diagnostic code
  err.responseCode = getErrorCode(err);

  if (err.isCodeBug) {
    logger.fatal(err, { session });
    throw err;
  }

  // log the error
  logger.warn(err, { session });

  // if it was a nodemailer/smtp-server specific
  // connection error then return early (so it will retry)
  if (isNodemailerError(err)) return;

  // return early if no response (we're going to retry sending)
  if (!isSANB(err.response)) return;

  //
  // otherwise there was a response from SMTP server we're sending to, so parse it and throw
  //

  //
  // parse the bounce error if any
  //
  // {
  //   action: 'reject',
  //   message: 'Message Sender Blocked By Receiving Server',
  //   category: 'block',
  //   code: 554,
  //   status: '5.7.1',
  //   line: 526
  // }

  // set bounce info on the error object (useful for debugging)
  err.bounceInfo = zoneMTABounces.check(err.response);
  if (err?.bounceInfo?.category === 'blacklist')
    err.bounceInfo.category = 'blocklist';

  //
  // NOTE: if the bounce checked was Unknown and no category
  //       then check if it was a virus, denylist, blocklist, or spam response message
  //       <https://github.com/zone-eu/zone-mta/blob/83c613fa3edbf35df5182b3c5a4b39bf3f50a97b/lib/bounces.js#L100-L106>
  //
  if (
    err.bounceInfo.message === 'Unknown' ||
    (err.bounceInfo.action === 'reject' &&
      isSANB(err.bounceInfo.category) &&
      ['policy', 'message', 'block', 'other'].includes(err.bounceInfo.category))
  ) {
    if (REGEX_VIRUS.test(err.response)) err.bounceInfo.category = 'virus';
    else if (REGEX_SPAM.test(err.response)) err.bounceInfo.category = 'spam';
  }

  // TODO: <https://csi.cloudmark.com/en/reset/>
  // TODO: <http://dnsbl.invaluement.com/lookup/>
  // TODO: <http://sendersupport.senderscore.net/>
  // TODO: <http://www.spamhaus.org/lookup.lasso>
  // TODO: <http://www.surbl.org/>

  //
  // if it was apple (icloud.com, me.com, or mac.com)
  // then note that this error [CS01] or [HM08] Message rejected due to local policy
  // indicates that blocklist or spam was detected and so treat it appropriately
  //
  if (
    APPLE_HOSTS.has(err.target) &&
    err.response.includes('Message rejected due to local policy')
  ) {
    if (
      err.response.includes(
        '554 5.7.1 [HM08] Message rejected due to local policy'
      )
    )
      err.bounceInfo.category = 'blocklist';
    // '554 5.7.1 [CS01] Message rejected due to local policy.'
    else err.bounceInfo.category = 'spam';
    //
    // if it was spectrum/charter/rr then if blocked then retry
    // <https://www.spectrum.net/support/internet/understanding-email-error-codes>
    //
  } else if (err.response.includes('AUP#1260'))
    // IPv6 not supported with Spectrum
    err.responseCode = 421;
  else if (
    err.response.includes('#CNCT') ||
    err.response.includes('#CXCNCT') ||
    err.response.includes('#CXMXRT') ||
    err.response.includes('#MXRT')
  )
    // Cloudfilter rejection (421 mwd-ibgw-6004a.ext.cloudfilter.net cmsmtp 138.197.213.185 blocked AUP#CNCT:)
    err.bounceInfo.category = 'blocklist';
  else if (
    err.response.includes('contains a unicode character in a disallowed header')
  )
    err.bounceInfo.category = 'spam';
  else if (err.response.includes('temporarily deferred'))
    err.bounceInfo.category = 'blocklist';
  else if (err.response.includes('JunkMail rejected'))
    err.bounceInfo.category = 'blocklist';
  else if (
    err.response.includes(
      'spectrum.net/support/internet/understanding-email-error-codes'
    )
  )
    err.bounceInfo.category = 'blocklist';
  // AT&T (TODO: email them and cc us)
  else if (err.response.includes('abuse_rbl@abuse-att.net'))
    err.bounceInfo.category = 'blocklist';
  // Cloudmark/Proofpoint (TODO: email them and cc us + link to form submission)
  else if (err.response.includes('cloudmark.com'))
    err.bounceInfo.category = 'blocklist';
  else if (err.response.includes('[IPTS04]'))
    // shared among Verizon/Yahoo and indicates blocklist
    err.bounceInfo.category = 'blocklist';
  // COX - unblock.request@cox.net (TODO: email them and cc us)
  // <https://www.cox.com/residential/support/email-error-codes.html#contactus>
  else if (
    err.response.includes('cox.com/residential/support/email-error-codes')
  )
    err.bounceInfo.category = 'blocklist';
  // spamcop (TODO: email us to request removal, same with spamhaus too)
  // <https://github.com/zone-eu/zone-mta/issues/331>
  else if (err.response.includes('spamcop.net'))
    err.bounceInfo.category = 'blocklist';
  // generic detection of RBL blocklist
  else if (err.response.includes('RBL')) err.bounceInfo.category = 'blocklist';
  else if (
    err.target === 'qq.com' &&
    err.response.includes('550 Mail content denied')
  )
    err.bounceInfo.category = 'spam';
  else if (
    err.bounceInfo.category === 'policy' &&
    REGEX_SPOOFING.test(err.response)
  )
    err.bounceInfo.category = 'spam';
  else if (
    err.response.includes(`?q=${IP_ADDRESS}`) ||
    err.response.includes(`?test=${IP_ADDRESS}`) ||
    err.response.includes(`?query=${IP_ADDRESS}`) ||
    err.response.includes(`?ip=${IP_ADDRESS}`)
  ) {
    // test against our IP and put into blocklist category if so
    err.bounceInfo.category = 'blocklist';
  } else if (err.response.includes('linuxmagic.com/power_of_ip_reputation'))
    // <https://www.linuxmagic.com/power_of_ip_reputation.php>
    err.bounceInfo.category = 'blocklist';
  else if (err.response.includes("We don't accept mail from DO spammers"))
    err.bounceInfo.category = 'blocklist';
  else if (
    err.bounceInfo.category !== 'spam' &&
    (err.response.includes('rate limited') ||
      err.response.includes('reputation') ||
      // optimum-specific error message
      err.response.includes('451 4.7.1 Resources restricted') ||
      // 550 5.7.1 Service unavailable; client [138.197.213.185] blocked using antispam.fasthosts.co.uk
      err.response.includes('blocked') ||
      // Connection refused - IB115. 104.248.224.170 is blacklisted (bigpond.com)
      err.response.includes('blacklisted') ||
      err.response.includes('blocklisted')) &&
    err.response.includes(IP_ADDRESS)
    // TODO: email us to send message to tobr@rx.t-online.de if detected string
  )
    // <https://sender.office.com/> <-- submit request here
    // <https://olcsupport.office.com/> <-- fill form here
    // <https://sendersupport.olc.protection.outlook.com/pm/>
    err.bounceInfo.category = 'blocklist';

  // log fatal error if block, spam, or blocklist
  if (
    isSANB(err.bounceInfo.category) &&
    ['virus', 'block', 'spam', 'blocklist'].includes(err.bounceInfo.category)
  )
    logger.fatal(err, { session });

  //
  // dmarc failures shouldn't occur since we check them on our side
  //
  if (isSANB(err.bounceInfo.category) && err.bounceInfo.category === 'dmarc')
    err.responseCode = 421;

  //
  // denylist the sender if it was detected to be a virus
  // <https://github.com/zone-eu/zone-mta/pull/314
  //
  if (
    isSANB(err.bounceInfo.category) &&
    (['virus', 'spam'].includes(err.bounceInfo.category) ||
      (err.bounceInfo.category === 'policy' &&
        REGEX_SPOOFING.test(err.response)))
  ) {
    // if it was a virus then throw the error as 554
    // (set err.responseCode to 554 if it was < 500)
    if (typeof err.responseCode !== 'number' || err.responseCode < 500)
      // TODO: rewrite `err.response` and `err.message` if either/both start with diagnostic code
      err.responseCode = err.bounceInfo.category === 'virus' ? 554 : 550;
  } else if (
    err.responseCode >= 500 &&
    ((isSANB(err.bounceInfo.action) &&
      ['defer', 'slowdown'].includes(err.bounceInfo.action)) ||
      (isSANB(err.bounceInfo.category) &&
        [
          'block',
          'blocklist',
          'capacity',
          'network',
          'protocol',
          'policy'
        ].includes(err.bounceInfo.category) &&
        (err.bounceInfo.category !== 'policy' ||
          !REGEX_SPOOFING.test(err.response))) ||
      REGEX_DENYLIST.test(err.response) ||
      REGEX_BLACKLIST.test(err.response) ||
      REGEX_BLOCKLIST.test(err.response) ||
      (REGEX_LOCAL_POLICY.test(err.response) &&
        !REGEX_SPOOFING.test(err.response)))
  ) {
    //
    // we want to retry messages with 421
    // if the action was "defer" or "slowdown"
    // or if the category was "block", "blocklist", "capacity", "network", "protocol", or "policy"
    // or if it was detected to be denylist, blocklist, or local policy issue
    //
    // (this is the magic that lets us fix our IP's being listed as false positive denylists in advance)
    // (and allows messages to retry and then would succeed once we get delisted)
    //
    // TODO: rewrite `err.response` and `err.message` if either/both start with diagnostic code
    err.responseCode = 421;
  }

  throw err;
}

//
// TODO: when emails are sent we need to store the `raw` (w/DKIM-Signature) per `accepted`
// TODO: similarly we need to store this for rejectedErrors so we can see details of error raw message (and end users can too)
//

// eslint-disable-next-line complexity
async function sendEmail({
  connectionMap = new Map(),
  session,
  cache,
  target,
  port = 25,
  envelope,
  raw,
  localAddress,
  localHostname,
  resolver
}) {
  //
  // if we're in development mode then use preview-email to render queue processing
  //
  if (config.env === 'development') {
    await previewEmail(raw, {
      ...config.previewEmailOptions,
      returnHTML: false
    });
    // return early with consistent `info` object (mirrored from FE)
    return {
      accepted: envelope.to,
      rejected: [],
      rejectedErrors: []
    };
  }

  const ignoreMXHosts = [];
  let mxLastError;

  try {
    const {
      truthSource,
      mx,
      requireTLS,
      ignoreTLS,
      opportunisticTLS,
      tls,
      transporter
    } = await getTransporter(connectionMap, {
      target,
      port,
      localAddress,
      localHostname,
      resolver,
      logger,
      cache
    });

    session.truthSource = truthSource;
    session.mx = _.omit(mx, ['socket']);
    session.requireTLS = requireTLS;
    session.ignoreTLS = ignoreTLS;
    session.opportunisticTLS = opportunisticTLS;
    session.tls = tls;

    const info = await transporter.sendMail({
      envelope,
      raw
    });

    return info;
  } catch (err) {
    // NOTE: this is important to keep here
    mxLastError = err;

    err.target = target;
    err.envelope = envelope;

    // TODO: clean this up (shouldn't be mirrored to `err` probably?)
    err.truthSource = session.truthSource;
    err.mx = session.mx;
    err.requireTLS = session.requireTLS;
    err.ignoreTLS = session.ignoreTLS;
    err.opportunisticTLS = session.opportunisticTLS;
    err.tls = session.tls;

    await shouldThrowError(err, session);

    //
    // NOTE: this is handled because `MAIL_RETRY_ERROR_CODES` has `ECONNRESET`
    //       https://github.com/zone-eu/zone-mta/blob/5daa48eea4aa05e724eb2ab80fd3a957e6cc8c6c/lib/sender.js#L1140
    //
    if (err.code && MAIL_RETRY_ERROR_CODES.has(err.code)) {
      // if (!isNodemailerError(err))
      ignoreMXHosts.push(session.mx.host);
    } else if (
      session.requireTLS &&
      (!err.code || !MAIL_RETRY_ERROR_CODES.has(err.code)) &&
      isTLSError(err)
    ) {
      //
      // NOTE: if MTA-STS was enforced and it was TLS error then throw if not a retry code
      // (safeguard is here for keeping retry codes in conditional in case this moves around)
      //
      logger.fatal(new Error('TLS is required due to MTA-STS policy'), {
        err,
        session
      });
      err.response = `421 TLS is required due to MTA-STS policy${
        isSANB(err.reason) ? ` (${err.reason})` : ''
      }`;
      // TODO: rewrite `err.response` and `err.message` if either/both start with diagnostic code
      err.responseCode = 421;
      err.category = 'policy';
      throw err;
    }

    // this error will indicate it is a TLS issue, so we should retry as plain
    // if it doesn't have all these properties per this link then its not TLS
    //
    // ✖  error     Error [ERR_TLS_CERT_ALTNAME_INVALID]: Hostname/IP does not match certificate's altnames: Host: mx.example.com. is not in the cert's altnames: DNS:test1.example.com, DNS:test2.example.com
    //     at Object.checkServerIdentity (tls.js:288:12)
    //     at TLSSocket.onConnectSecure (_tls_wrap.js:1483:27)
    //     at TLSSocket.emit (events.js:311:20)
    //     at TLSSocket._finishInit (_tls_wrap.js:916:8)
    //     at TLSWrap.ssl.onhandshakedone (_tls_wrap.js:686:12)
    //   reason: "Host: mx.example.com. is not in the cert's altnames: DNS:test1.example.com, DNS:test2.example.com",
    //   host: 'mx.example.com',
    //   cert: ...,
    //   ...
    //
    // <https://github.com/nodejs/node/blob/1f9761f4cc027315376cd669ceed2eeaca865d76/lib/tls.js#L287>
    //
    //
    if (
      (err.code &&
        Number.parseInt(err.code, 10) >= 400 &&
        Number.parseInt(err.code, 10) < 500) ||
      isSSLError(err) ||
      isTLSError(err) ||
      isNodemailerError(err) ||
      (err.code && MAIL_RETRY_ERROR_CODES.has(err.code))
    ) {
      const { truthSource, mx, requireTLS, ignoreTLS, tls, transporter } =
        await getTransporter(
          connectionMap,
          {
            ignoreMXHosts,
            mxLastError,
            target,
            port,
            localAddress,
            localHostname,
            resolver,
            logger,
            cache
          },
          err
        );

      session.truthSource = truthSource;
      session.mx = _.omit(mx, ['socket']);
      session.requireTLS = requireTLS;
      session.ignoreTLS = ignoreTLS;
      session.opportunisticTLS = requireTLS;
      session.tls = tls;

      try {
        const info = await transporter.sendMail({
          envelope,
          raw
        });

        return info;
      } catch (err) {
        err.target = target;
        err.envelope = envelope;

        // TODO: clean this up (shouldn't be mirrored to `err` probably?)
        err.truthSource = session.truthSource;
        err.mx = session.mx;
        err.requireTLS = session.requireTLS;
        err.ignoreTLS = session.ignoreTLS;
        err.opportunisticTLS = session.opportunisticTLS;
        err.tls = session.tls;

        err.mxLastError = mxLastError;
        err.ignoreMXHosts = ignoreMXHosts;

        await shouldThrowError(err, session);

        //
        // retry if code, tls, or ssl error
        //
        if (
          (err.code && MAIL_RETRY_ERROR_CODES.has(err.code)) ||
          isTLSError(err) ||
          isSSLError(err) ||
          isNodemailerError(err)
        ) {
          // TODO: rewrite `err.response` and `err.message` if either/both start with diagnostic code
          err.responseCode = 421;
        }

        throw err;
      }
    }

    throw err;
  }
}

module.exports = sendEmail;
