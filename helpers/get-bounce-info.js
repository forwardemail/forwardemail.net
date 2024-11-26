/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const RE2 = require('re2');
const ip = require('ip');
const zoneMTABounces = require('zone-mta/lib/bounces');

const isRetryableError = require('#helpers/is-retryable-error');

const IP_ADDRESS = ip.address();

const REGEX_SPOOFING = new RE2(/spoof|impersonation|impersonate/im);
const REGEX_SPAM = new RE2(/spam/im);
const REGEX_VIRUS = new RE2(/virus|phishing|malware|trojan/im);
const REGEX_DENYLIST = new RE2(/denylist|deny\s+list/im);
const REGEX_BLACKLIST = new RE2(/blacklist|black\s+list/im);
const REGEX_BLOCKLIST = new RE2(/blocklist|block\s+list/im);

// eslint-disable-next-line complexity
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
    else if (REGEX_SPAM.test(response)) bounceInfo.category = 'spam';
    else if (isRetryableError(err)) {
      bounceInfo.category = 'network';
      bounceInfo.action = 'defer';
    }
  }

  // WHM/cPanel generic country error
  if (
    response.includes('Your country is not allowed to connect to this server')
  ) {
    bounceInfo.action = 'defer';
    bounceInfo.category = 'network';
    // <https://learn.microsoft.com/en-us/exchange/troubleshoot/email-delivery/send-receive-emails-socketerror>
  }

  if (response.includes('Comcast block for spam')) {
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
  } else if (
    response.includes('Your IP subnet has been temporarily deferred')
  ) {
    bounceInfo.category = 'blocklist';
  } else if (response.includes('unsolicited mail')) {
    // 421-4.7.28 Gmail has detected an unusual rate of unsolicited mail originating
    // 421-4.7.28 from your SPF domain [fe-bounces.somedomain.com]
    if (
      response.includes('IP address') ||
      response.includes('from your SPF domain') ||
      response.includes('from your IP Netblock')
    ) {
      bounceInfo.category = 'blocklist';
    } else {
      bounceInfo.category = 'spam';
    }
  } else if (response.toLowerCase().includes('access denied')) {
    bounceInfo.category = 'blocklist';
  } else if (
    //
    // if it was apple (icloud.com, me.com, or mac.com)
    // then note that this error [CS01] or [HM08] Message rejected due to local policy
    // indicates that blocklist or spam was detected and so treat it appropriately
    //
    response.includes('[HM08] Message rejected due to local policy')
  )
    bounceInfo.category = 'blocklist';
  else if (response.includes('[CS01] Message rejected due to local policy'))
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
    response.includes(`?q=${IP_ADDRESS}`) ||
    response.includes(`?test=${IP_ADDRESS}`) ||
    response.includes(`?query=${IP_ADDRESS}`) ||
    response.includes(`?ip=${IP_ADDRESS}`)
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
  else if (
    bounceInfo.category !== 'spam' &&
    (response.includes('rate limited') ||
      response.includes('reputation') ||
      response.includes('temporarily deferred') ||
      // optimum-specific error message
      response.includes('4.7.1 Resources restricted') ||
      // CenturyLink/Cloudfilter rejection (421 mwd-ibgw-6004a.ext.cloudfilter.net cmsmtp 138.197.213.185 blocked AUP#CNCT:)
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
  )
    // <https://sender.office.com/> <-- submit request here
    // <https://sendersupport.olc.protection.outlook.com/pm/>
    bounceInfo.category = 'blocklist';
  //
  // dmarc failures shouldn't occur since we check them on our side
  //
  else if (bounceInfo.category === 'dmarc') bounceInfo.action = 'defer';
  else if (
    REGEX_DENYLIST.test(response) ||
    REGEX_BLACKLIST.test(response) ||
    REGEX_BLOCKLIST.test(response)
  )
    bounceInfo.category = 'blocklist';

  //
  // set "action" based off "category"
  //
  // if it was blocklist then set action to defer
  if (bounceInfo.category === 'blocklist') bounceInfo.action = 'defer';
  else if (['virus', 'spam'].includes(bounceInfo.category))
    bounceInfo.action = 'reject';

  return bounceInfo;
}

module.exports = getBounceInfo;
