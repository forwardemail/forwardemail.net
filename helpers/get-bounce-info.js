/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const RE2 = require('re2');
const ip = require('ip');
const zoneMTABounces = require('@zone-eu/zone-mta/lib/bounces');

const isRetryableError = require('#helpers/is-retryable-error');

const IP_ADDRESS = ip.address();

const REGEX_SPOOFING = new RE2(/spoof|impersonation|impersonate/im);
const REGEX_SPAM = new RE2(/(^|[^a-z\d])spam([^a-z\d]|$)/i);
const REGEX_VIRUS = new RE2(
  /(^|[^a-z\d])(virus|phishing|malware|trojan)([^a-z\d]|$)/i
);
const REGEX_DENYLIST = new RE2(/denylist|deny\s+list/im);
const REGEX_BLACKLIST = new RE2(/blacklist|black\s+list/im);
const REGEX_BLOCKLIST = new RE2(/blocklist|block\s+list/im);

// TODO: add these to bounces.txt
// <https://github.com/zone-eu/zone-mta/issues/435>
// <https://postmaster-earthlink.vadesecure.com/inbound_error_codes/>
// <https://sendertool.vadesecure.com/en/> (how to remove if Vade Secure blocks)

//
// NOTE: we have access to `err.truthSource` if needed here
//       (e.g. google.com, qq.com, is the value)
//       but note we don't need to rely on it because we only
//       take action if a given `truthSource` value actually exists
//

function getBounceInfo(err) {
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
  const response =
    typeof err.response === 'string' ? err.response : err.message;
  const lc = response.toLowerCase();
  const bounceInfo = zoneMTABounces.check(response);
  if (typeof bounceInfo.category !== 'string') bounceInfo.category = 'other';
  if (bounceInfo.category === 'blacklist') bounceInfo.category = 'blocklist';

  //
  // NOTE: if the bounce checked was Unknown and no category
  //       then check if it was a virus, denylist, blocklist, or spam response message
  //       <https://github.com/zone-eu/zone-mta/blob/83c613fa3edbf35df5182b3c5a4b39bf3f50a97b/lib/bounces.js#L100-L106>
  //
  if (
    bounceInfo.message === 'Unknown' ||
    (bounceInfo.action === 'reject' &&
      ['blocklist', 'envelope', 'policy', 'message', 'block', 'other'].includes(
        bounceInfo.category
      ))
  ) {
    if (REGEX_VIRUS.test(response)) bounceInfo.category = 'virus';
    else if (
      // TODO: clean this up later or remove altogether
      REGEX_SPAM.test(response) ||
      lc === 'spam' ||
      lc === 'spam.' ||
      lc.endsWith(' spam') ||
      lc.endsWith(' spam.')
    )
      bounceInfo.category = 'spam';
  }

  if (isRetryableError(err)) {
    bounceInfo.category = 'network';
    bounceInfo.action = 'defer';
  }

  // proton spam
  if (response.includes('rejected by rspamd filter')) {
    bounceInfo.category = 'spam';
  } else if (
    response.includes('PTR record') &&
    (response.includes('missing PTR records') || response.includes(IP_ADDRESS))
  ) {
    bounceInfo.action = 'defer';
    bounceInfo.category = 'network';
  } else if (
    // WHM/cPanel generic country error
    response.includes('Your country is not allowed to connect to this server')
  ) {
    // <https://learn.microsoft.com/en-us/exchange/troubleshoot/email-delivery/send-receive-emails-socketerror>
    bounceInfo.action = 'defer';
    bounceInfo.category = 'network';
  } else if (
    // Comcast removal requests submitted at:
    // https://spa.xfinity.com/report
    response.includes('#BL000000') ||
    response.includes('#RL000010')
  ) {
    bounceInfo.category = 'blocklist';
  } else if (response.includes('Comcast block for spam')) {
    bounceInfo.category = 'blocklist';
  } else if (response.includes('Connection dropped due to SocketError')) {
    // modify message to include URL for debugging
    err.message +=
      ' ; Resolve this issue by visiting https://learn.microsoft.com/en-us/exchange/troubleshoot/email-delivery/send-receive-emails-socketerror#cause ;';
    bounceInfo.action = 'defer';
    bounceInfo.category = 'network';
  } else if (response.includes('Connection dropped due to ConnectionReset')) {
    // modify message to include URL for debugging
    err.message +=
      ' ; Resolve this issue by visiting https://learn.microsoft.com/en-us/exchange/troubleshoot/email-delivery/configure-proofpoint-with-exchange#specify-a-limit-for-the-number-of-messages-per-connection ;';
    bounceInfo.action = 'defer';
    bounceInfo.category = 'network';
    //
    // Barracuda "550 permanent failure" responses are recipient rejections, not blocklist
    // e.g. "550 permanent failure for one or more recipients (user@example.com:blocked)"
    //
  } else if (
    err.truthSource === 'barracudanetworks.com' &&
    response.includes('permanent failure for one or more recipients')
  ) {
    bounceInfo.category = 'recipient';
    bounceInfo.action = 'reject';
    //
    // Gmail "suspicious due to the nature of the content" is spam, not blocklist
    // e.g. "421-4.7.0 Gmail has detected that this message is suspicious due to the nature of the content"
    //
  } else if (
    err.truthSource === 'google.com' &&
    response.includes('suspicious due to the nature of the content')
  ) {
    bounceInfo.category = 'spam';
    //
    // QQ.com "Mail is rejected by recipients" with IP in message is spam (content-based), not blocklist
    // e.g. "550 Mail is rejected by recipients [..... IP: 138.197.213.185]. https://service.mail.qq.com/detail/0/92."
    // The URL /detail/0/92 indicates spam content rejection
    //
  } else if (
    err.truthSource === 'qq.com' &&
    response.includes('Mail is rejected by recipients') &&
    response.includes('service.mail.qq.com/detail/0/92')
  ) {
    bounceInfo.category = 'spam';
    //
    // Netease (163.com, qiye.163.com) "DT:SPM" is spam, not blocklist
    // e.g. "550 5.7.0 DT:SPM .For more information, please visit https://feedback.qiye.163.com/..."
    //
  } else if (err.truthSource === 'netease.com' && response.includes('DT:SPM')) {
    bounceInfo.category = 'spam';
    //
    // Yahoo/AOL [PH01] is phishing/spam content rejection, not blocklist
    // e.g. "554 Message not allowed - [PH01] Email not accepted for policy reasons."
    //
  } else if (
    err.truthSource === 'yahoodns.net' &&
    response.includes('[PH01]')
  ) {
    bounceInfo.category = 'spam';
    //
    // QQ.com "Suspected bounce attacks" is spam, not blocklist
    // e.g. "550 Suspected bounce attacks [...]. https://service.mail.qq.com/detail/122/57."
    //
  } else if (
    err.truthSource === 'qq.com' &&
    response.includes('Suspected bounce attacks')
  ) {
    bounceInfo.category = 'spam';
    //
    // QQ.com "Mailbox unavailable or access denied" with detail/122/166 is recipient rejection
    // e.g. "550 Mailbox unavailable or access denied. http://service.mail.qq.com/detail/122/166"
    //
  } else if (
    err.truthSource === 'qq.com' &&
    response.includes('Mailbox unavailable or access denied') &&
    response.includes('service.mail.qq.com/detail/122/166')
  ) {
    bounceInfo.category = 'recipient';
    bounceInfo.action = 'reject';
    //
    // QQ.com (WeChat Work) "Mailbox unavailable or access denied" with weixin help URL is recipient rejection
    // e.g. "550 Mailbox unavailable or access denied [...]. https://open.work.weixin.qq.com/help2/pc/20057."
    //
  } else if (
    err.truthSource === 'qq.com' &&
    response.includes('Mailbox unavailable or access denied') &&
    response.includes('open.work.weixin.qq.com')
  ) {
    bounceInfo.category = 'recipient';
    bounceInfo.action = 'reject';
    //
    // QQ.com (WeChat Work) "Mail is rejected by recipients" with weixin help URL is recipient rejection
    // e.g. "550 Mail is rejected by recipients [...]. https://open.work.weixin.qq.com/help2/pc/20051."
    // Note: This is different from the qq.com/detail/0/92 spam case
    //
  } else if (
    err.truthSource === 'qq.com' &&
    response.includes('Mail is rejected by recipients') &&
    response.includes('open.work.weixin.qq.com')
  ) {
    bounceInfo.category = 'recipient';
    bounceInfo.action = 'reject';
    //
    // Outlook/Microsoft "MailFrom domain is listed in Spamhaus" is spam (domain blocklist), not IP blocklist
    // e.g. "550 5.7.1 Service unavailable, MailFrom domain is listed in Spamhaus."
    // The sender's DOMAIN is blocked, not our IP
    //
  } else if (response.includes('MailFrom domain is listed in Spamhaus')) {
    bounceInfo.category = 'spam';
    bounceInfo.action = 'reject';
    //
    // Proofpoint "Local Policy Violation" is policy rejection, not blocklist
    // e.g. "550 5.7.0 Local Policy Violation"
    //
  } else if (
    err.truthSource === 'pphosted.com' &&
    response.includes('Local Policy Violation')
  ) {
    bounceInfo.category = 'policy';
    bounceInfo.action = 'reject';
    //
    // Google "policy that prohibited the mail" is policy rejection, not blocklist
    // e.g. "550-5.7.1 The user or domain that you are sending to (or from) has a policy that prohibited the mail"
    // <https://support.google.com/a/answer/172179>
    //
  } else if (
    err.truthSource === 'google.com' &&
    response.includes('has a policy that') &&
    response.includes('prohibited the mail')
  ) {
    bounceInfo.category = 'policy';
    bounceInfo.action = 'reject';
    //
    // Spectrum/Charter AUP#In-1010 is spam/suspicious activity, not blocklist
    // <https://www.spectrum.net/support/internet/understanding-email-error-codes>
    // "This email account has been blocked from sending emails due to suspicious activity"
    //
  } else if (
    err.truthSource === 'charter.net' &&
    response.includes('AUP#In-1010')
  ) {
    bounceInfo.category = 'spam';
    //
    // Gmail RFC 5322 non-compliant messages (e.g. missing From header) is message issue, not blocklist
    // e.g. "550-5.7.1 [IP] Gmail has detected that this message is not RFC 5322 compliant"
    //
  } else if (
    err.truthSource === 'google.com' &&
    response.includes('is not RFC 5322') &&
    response.includes('compliant')
  ) {
    bounceInfo.category = 'message';
    //
    // Gmail SPF authentication failure rate limiting is greylist (temporary), not blocklist
    // e.g. "421-4.7.27 Your email has been rate limited because SPF authentication didn't pass"
    //
  } else if (
    err.truthSource === 'google.com' &&
    response.includes('rate limited') &&
    response.includes("SPF authentication didn't")
  ) {
    bounceInfo.category = 'greylist';
    bounceInfo.action = 'defer';
  } else if (err.truthSource === '163.com' && response.includes('DT:SPM')) {
    bounceInfo.category = 'spam';
  } else if (err.truthSource === 'orange.fr' && response.includes('[506]')) {
    // <https://github.com/sisimai/p5-Sisimai/issues/243>
    bounceInfo.category = 'spam';
  } else if (err.truthSource && response.includes('Too many emails')) {
    bounceInfo.category = 'greylist';
  } else if (
    response.includes(`[${IP_ADDRESS}]`) &&
    response.includes('blocked')
  ) {
    bounceInfo.category = 'blocklist';
  } else if (
    response.includes('bounce attack') ||
    response.includes('misdirected bounce')
  ) {
    bounceInfo.category = response.includes(IP_ADDRESS) ? 'blocklist' : 'spam';
  } else if (
    err.truthSource === 'qq.com' &&
    response.includes('Mail is rejected by recipients') &&
    !response.includes('open.work.weixin.qq.com')
  ) {
    // Only classify as blocklist if NOT from WeChat Work (weixin)
    // WeChat Work rejections are recipient-level, not IP blocklist
    bounceInfo.category = 'blocklist';
  } else if (
    err.truthSource === 'yahoodns.net' &&
    response.includes('mailbox is disabled')
  ) {
    bounceInfo.category = 'recipient';
  } else if (
    err.truthSource === 'secureserver.net' &&
    response.includes('judged to be spam')
  ) {
    bounceInfo.category = 'spam';
  } else if (
    err.truthSource === 'secureserver.net' &&
    response.includes('Recipient not found')
  ) {
    bounceInfo.category = 'recipient';
  } else if (
    err.truthSource === 'synchronoss.net' &&
    response.includes('Resources restricted')
  ) {
    bounceInfo.category = 'blocklist';
  } else if (
    err.truthSource === 'yandex.net' &&
    response.includes('No such user')
  ) {
    bounceInfo.category = 'recipient';
  } else if (
    response.includes('RFC') &&
    (response.includes('compliance') || response.includes('complaint'))
  ) {
    bounceInfo.category = 'spam';
  } else if (
    err.truthSource === 'google.com' &&
    response.includes('NotAuthorizedError') &&
    response.includes(`[${IP_ADDRESS}]`)
  ) {
    // 550-5.7.1 [104.248.224.170] The IP you're using to send mail is not authorized
    // 550-5.7.1 to send email directly to our servers. Please use the SMTP relay at
    // 550-5.7.1 your service provider instead. For more information, go to
    // 550 5.7.1 https://support.google.com/mail/?p=NotAuthorizedError 8926c6da1cb9f-4f88a8b5013si16229094173.21 - gsmtp
    bounceInfo.category = 'blocklist';
  } else if (
    response.includes(
      `Mail from IP ${IP_ADDRESS} was rejected due to listing in Spamhaus`
    ) ||
    response.includes(`Client host [${IP_ADDRESS}] blocked using Spamhaus`)
  ) {
    // 550 5.7.1 Mail from IP 104.248.224.170 was rejected due to listing in Spamhaus PBL. For details please see http://www.spamhaus.org/query/bl?ip=104.248.224.170
    // and
    // 550 5.7.1 Service unavailable, Client host [104.248.224.170] blocked using Spamhaus. To request removal from this list see https://www.spamhaus.org/query/ip/104.248.224.170 AS(1450) [ML1PEPF00011309.ausprd01.prod.outlook.com 2025-05-08T08:05:01.086Z 08DD8D91D7D59D80]
    bounceInfo.category = 'blocklist';
  } else if (
    err.truthSource === 'google.com' &&
    response.includes('this message exceeded its quota') &&
    response.includes('messages with the same Message-ID')
  ) {
    // Gmail has detected this message exceeded its quota for sending
    // ...
    // messages with the same Message-ID
    bounceInfo.category = 'spam';
  } else if (
    err.truthSource === 'google.com' &&
    response.includes('originating from your DKIM') &&
    response.includes('temporarily rate limited')
  ) {
    bounceInfo.category = 'spam';
  } else if (
    err.truthSource === 'google.com' &&
    response.includes('very low reputation')
  ) {
    bounceInfo.category = 'spam';
  } else if (
    response.includes('Your IP subnet has been temporarily deferred')
  ) {
    bounceInfo.category = 'blocklist';
  } else if (response.includes('unsolicited mail')) {
    // 421-4.7.28 Gmail has detected an unusual rate of unsolicited mail originating
    // 421-4.7.28 from your SPF domain [fe-bounces.somedomain.com]
    // https://support.google.com/mail/contact/gmail_bulk_sender_escalation
    if (
      response.includes('IP address') ||
      response.includes('from your SPF domain') ||
      response.includes('from your IP Netblock')
    ) {
      bounceInfo.category = 'blocklist';
    } else {
      bounceInfo.category = 'spam';
    }
  } else if (lc.includes('access denied') && response.includes(IP_ADDRESS)) {
    bounceInfo.category = 'blocklist';
  } else if (
    //
    // if it was apple (icloud.com, me.com, or mac.com)
    // then note that this error [CS01] or [HM08] Message rejected due to local policy
    // indicates that blocklist or spam was detected and so treat it appropriately
    //
    // NOTE: [HM08] without our IP address is spam (content-based), not blocklist
    //
    response.includes('[HM08] Message rejected due to local policy') &&
    response.includes(IP_ADDRESS)
  )
    bounceInfo.category = 'blocklist';
  else if (
    response.includes('[HM08] Message rejected due to local policy') ||
    response.includes('[CS01] Message rejected due to local policy')
  )
    bounceInfo.category = 'spam';
  //
  // if it was spectrum/charter/rr then if blocked then retry
  // <https://www.spectrum.net/support/internet/understanding-email-error-codes>
  //
  else if (response.includes('AUP#1260')) {
    // IPv6 not supported with Spectrum
    bounceInfo.action = 'defer';
    bounceInfo.category = 'network';
  } else if (response.includes('Rejected by header based Anti-Spoofing policy'))
    bounceInfo.category = 'spam';
  else if (
    response.includes('contains a unicode character in a disallowed header')
  )
    bounceInfo.category = 'spam';
  else if (response.includes('Message contained unsafe content'))
    bounceInfo.category = 'virus';
  else if (response.includes('JunkMail rejected'))
    bounceInfo.category = 'blocklist';
  else if (
    response.includes(
      'spectrum.net/support/internet/understanding-email-error-codes'
    )
  )
    bounceInfo.category = 'blocklist';
  // AT&T
  else if (response.includes('abuse_rbl@abuse-att.net'))
    bounceInfo.category = 'blocklist';
  // Cloudmark/Proofpoint
  else if (response.includes('cloudmark.com'))
    bounceInfo.category = 'blocklist';
  else if (response.includes('[IPTS04]'))
    // shared among Verizon/Yahoo and indicates blocklist
    bounceInfo.category = 'blocklist';
  // COX - unblock.request@cox.net
  // <https://www.cox.com/residential/support/email-error-codes.html#contactus>
  else if (response.includes('cox.com/residential/support/email-error-codes'))
    bounceInfo.category = 'blocklist';
  // spamcop
  // <https://github.com/zone-eu/zone-mta/issues/331>
  else if (response.includes('spamcop.net')) bounceInfo.category = 'blocklist';
  // generic detection of RBL blocklist
  else if (response.includes('RBL')) bounceInfo.category = 'blocklist';
  else if (response.includes('550 Mail content denied')) {
    bounceInfo.category = 'spam';
  } else if (bounceInfo.category === 'policy' && REGEX_SPOOFING.test(response))
    bounceInfo.category = 'spam';
  else if (
    bounceInfo.category === 'policy' ||
    response.includes(`?q=${IP_ADDRESS}`) ||
    response.includes(`?test=${IP_ADDRESS}`) ||
    response.includes(`?query=${IP_ADDRESS}`) ||
    response.includes(`?ip=${IP_ADDRESS}`) ||
    response.includes('exceeded the maximum number of connections')
  ) {
    // test against our IP and put into blocklist category if so
    bounceInfo.category = 'blocklist';
  } else if (response.includes('linuxmagic.com/power_of_ip_reputation'))
    // <https://www.linuxmagic.com/power_of_ip_reputation.php>
    bounceInfo.category = 'blocklist';
  else if (response.includes("We don't accept mail from DO spammers"))
    bounceInfo.category = 'blocklist';
  else if (response.includes('tobr@rx.t-online.de'))
    bounceInfo.category = 'blocklist';
  else if (response.includes('an unusual rate of unsolicited mail')) {
    bounceInfo.category = 'blocklist';
  } else if (
    bounceInfo.category !== 'spam' &&
    (response.includes('rate limited') ||
      response.includes('reputation') ||
      response.includes('temporarily deferred') ||
      // optimum-specific error message
      response.includes('4.7.1 Resources restricted') ||
      // CenturyLink/Cloudfilter rejection (421 mwd-ibgw-6004a.ext.cloudfilter.net cmsmtp 138.197.213.185 blocked AUP#CNCT:)
      // cloudfilter.net
      // tmomail.net
      // <https://postmaster.t-online.de/index.en.html>
      // <https://postmaster.t-online.de/kontakt.en.php>
      // postmaster@t-online.de
      // postmaster@rx.t-online.de
      response.includes('#CNCT') ||
      response.includes('#CXCNCT') ||
      response.includes('#CXMXRT') ||
      response.includes('#MXRT') ||
      // 550 5.7.1 Service unavailable; client [138.197.213.185] blocked using antispam.fasthosts.co.uk
      response.includes('blocked') ||
      // Connection refused - IB115. 104.248.224.170 is blacklisted (bigpond.com)
      response.includes('blacklisted') ||
      response.includes('blocklisted')) &&
    response.includes(IP_ADDRESS)
  ) {
    // <https://sender.office.com/> <-- submit request here
    // <https://sendersupport.olc.protection.outlook.com/pm/>
    bounceInfo.category = 'blocklist';
  } else if (
    !response.includes(`${IP_ADDRESS} listed `) &&
    (REGEX_DENYLIST.test(response) ||
      REGEX_BLACKLIST.test(response) ||
      REGEX_BLOCKLIST.test(response))
  )
    bounceInfo.category = 'blocklist';

  //
  // OVERRIDE SECTION: These checks run AFTER all other checks and override
  // any category set by zone-mta or earlier checks. This ensures specific
  // error patterns are correctly categorized regardless of generic matches.
  //

  // QQ.com (WeChat Work) errors should be recipient, not blocklist
  if (
    err.truthSource === 'qq.com' &&
    (response.includes('Mailbox unavailable or access denied') ||
      response.includes('Mail is rejected by recipients'))
  ) {
    bounceInfo.category = 'recipient';
    bounceInfo.action = 'reject';
  }

  // Yahoo/AOL "sender is unauthenticated" is auth issue, not blocklist
  if (
    err.truthSource === 'yahoodns.net' &&
    response.includes('sender is unauthenticated')
  ) {
    bounceInfo.category = 'auth';
    bounceInfo.action = 'reject';
  }

  // Google "policy that prohibited the mail" is policy rejection, not blocklist
  // e.g. "550-5.7.1 The user or domain that you are sending to (or from) has a policy that prohibited the mail"
  // <https://support.google.com/a/answer/172179>
  if (
    err.truthSource === 'google.com' &&
    response.includes('has a policy that') &&
    response.includes('prohibited the mail')
  ) {
    bounceInfo.category = 'policy';
    bounceInfo.action = 'reject';
  }

  // Google "policy that prohibited the mail" is policy rejection, not blocklist
  // e.g. "550-5.7.1 The user or domain that you are sending to (or from) has a policy that prohibited the mail"
  // <https://support.google.com/a/answer/172179>
  if (
    err.truthSource === 'google.com' &&
    response.includes('has a policy that') &&
    response.includes('prohibited the mail')
  ) {
    bounceInfo.category = 'policy';
    bounceInfo.action = 'reject';
  }

  //
  // set "action" based off "category"
  //
  // if it was blocklist then set action to defer
  if (bounceInfo.category === 'blocklist') bounceInfo.action = 'defer';
  else if (['virus', 'spam'].includes(bounceInfo.category))
    bounceInfo.action = 'reject';

  // <https://github.com/zone-eu/zone-mta/issues/434>
  // DMARC failures should be retried (421) since they may be temporary SPF issues
  if (
    response.startsWith('DMARC ') ||
    response.includes(' DMARC ') ||
    response.includes('DMARC policy')
  ) {
    bounceInfo.category = 'dmarc';
    bounceInfo.action = 'defer';
  }

  return bounceInfo;
}

module.exports = getBounceInfo;
