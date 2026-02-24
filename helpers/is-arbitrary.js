/*
 Copyright (c) Forward Email LLC
 SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');
const RE2 = require('re2');
const addressParser = require('nodemailer/lib/addressparser');
const confusables = require('confusables');
const isSANB = require('is-string-and-not-blank');
const { fromUrl, parseDomain } = require('parse-domain');

const SMTPError = require('#helpers/smtp-error');
const checkSRS = require('#helpers/check-srs');
const config = require('#config');
const env = require('#config/env');
const getHeaders = require('#helpers/get-headers');
// const isAutoReplyOrMailingList = require('#helpers/is-auto-reply-or-mailing-list');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseRootDomain = require('#helpers/parse-root-domain');

const REGEX_BLOCKED_PHRASES = new RE2(
  /cheecck y0ur acc0untt|recorded you|you've been hacked|account is hacked|personal data has leaked|private information has been stolen/im
);

// const REGEX_BITCOIN = new RE2(/bitcoin|btc/im);
// const REGEX_PASSWORD_MALWARE_INFECTED_VIDEO = new RE2(
//   /hacked|malware|infected|trojan|recorded you/im
// );

// TODO: remove yum here and wrap these with spaces or something
const REGEX_SYSADMIN_SUBJECT = new RE2(
  /please moderate|mdadm monitoring|weekly report|wordfence|wordpress|wpforms|docker|graylog|digest|event notification|package update manager|event alert|system events|monit alert|ping|monitor|cron|yum|sendmail|exim|backup|logwatch|unattended-upgrades/im
);

/*
const YAHOO_DOMAINS = new Set([
  'aim.com',
  'aol.com',
  'cox.net',
  'epix.net',
  'netscape.net',
  'rocketmail.com',
  'rogers.com',
  'sky.com',
  'verizon.net',
  'yahoo.ca',
  'yahoo.co.in',
  'yahoo.co.nz',
  'yahoo.co.uk',
  'yahoo.com',
  'yahoo.com.au',
  'yahoo.com.br',
  'yahoo.com.hk',
  'yahoo.com.mx',
  'yahoo.com.ph',
  'yahoo.de',
  'yahoo.dk',
  'yahoo.es',
  'yahoo.fr',
  'yahoo.gr',
  'yahoo.it',
  'ymail.com'
]);
*/

const REGEX_DOMAIN = new RE2(new RegExp(env.WEB_HOST, 'im'));

// this accounts for spammers that spoof our domain name in From
// but omit the ".com" portion, e.g. "ForwardEmail" or "forwardemail"
// (this will return just the domain portion, e.g. "forwardemail")

const result = parseDomain(fromUrl(env.WEB_HOST));
const domainWithoutTLD =
  result?.type === 'LISTED' && result?.domain ? result.domain : env.WEB_HOST;

const REGEX_DOMAIN_WITHOUT_TLD = new RE2(new RegExp(domainWithoutTLD, 'im'));
const REGEX_APP_NAME = new RE2(new RegExp(env.APP_NAME, 'im'));

// function isArbitrary(session, headers, bodyStr) {

function isArbitrary(session, headers) {
  let subject = getHeaders(headers, 'subject');
  if (!isSANB(subject)) subject = null;

  // <https://github.com/andris9/mailsplit/issues/21>
  const from = getHeaders(headers, 'from');

  // rudimentary blocking
  if (subject && REGEX_BLOCKED_PHRASES.test(subject)) {
    throw new SMTPError('Spam', { responseCode: 421 });
  }

  // Until adobe responds
  // if (
  //   subject &&
  //   subject.includes('Signature requested on') &&
  //   session.originalFromAddress === 'adobesign@adobesign.com'
  // )
  //   throw new SMTPError('Due to spam from Adobe this message is blocked');

  // authorize.net invoice scam
  // x-forward-email-sender: rfc822; invoice@authorize.net, tzportal8.visa.com, 198.241.206.78
  if (
    session.originalFromAddress === 'invoice@authorize.net' &&
    session.resolvedRootClientHostname === 'visa.com'
  ) {
    const error = new SMTPError(
      'Authorize.net and VISA have a phishing scam invoice vulnerability and this message was rejected'
    );
    error.isCodeBug = true; // Alert admins for inspection
    throw error;
  }

  // Amazon impersonation
  if (
    from &&
    from.toLowerCase().includes('amazon.co.jp') &&
    (!session.resolvedRootClientHostname ||
      !session.resolvedRootClientHostname.startsWith('amazon.'))
  ) {
    const error = new SMTPError('Prevented spoofing of Amazon.co.jp');
    error.isCodeBug = true; // Alert admins for inspection
    throw error;
  }

  // DocuSign impersonation
  /*
  if (
    from &&
    from.toLowerCase().includes('docusign ') &&
    (!session.resolvedRootClientHostname ||
      !session.resolvedRootClientHostname.startsWith('docusign.'))
  ) {
    const err = new SMTPError('Prevented spoofing of DocuSign');
    err.isCodeBug = true; // alert admins for inspection
    throw err;
  }
  */

  // pCloud impersonation
  if (
    subject &&
    subject.includes('pCloud') &&
    session.originalFromAddressRootDomain !== 'pcloud.com' &&
    from &&
    from.includes('pCloud')
  ) {
    const error = new SMTPError('Prevented spoofing of pCloud.com');
    error.isCodeBug = true; // Alert admins for inspection
    throw error;
  }

  //
  // check for paypal scam (very strict until PayPal resolves phishing on their side)
  // (seems to only come from "outlook.com" and "paypal.com" hosts)
  //
  // X-Email-Type-Id = RT000238
  //                   PPC001017
  //                   RT000542 = gift message hack
  //                              <https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/>
  //                   RT002947 = paypal invoice spam
  //
  if (
    session.originalFromAddressRootDomain === 'paypal.com' &&
    headers.hasHeader('x-email-type-id') &&
    ['PPC001017', 'RT000238', 'RT000542', 'RT002947'].includes(
      headers.getFirst('x-email-type-id')
    )
  ) {
    const error = new SMTPError(
      'Due to ongoing PayPal invoice spam, you must manually send an invoice link; See https://forwardemail.net/en/blog/docs/paypal-api-disaster-11-years-missing-features-broken-promises#the-11-year-capture-bug-disaster-1899-and-counting ;'
    );
    error.isCodeBug = true; // Alert admins for inspection
    throw error;
  }

  /*
// NOTE: disabled due to false positives
// check for btc crypto scam
if (
  isSANB(bodyStr) &&
  REGEX_BITCOIN.test(bodyStr) &&
  REGEX_PASSWORD_MALWARE_INFECTED_VIDEO.test(bodyStr)
)
  throw new SMTPError(
    `Blocked crypto scam, please forward this to ${config.abuseEmail}`
  );
*/

  //
  // NOTE: due to unprecedented spam from Microsoft's "onmicrosoft.com" domain
  //       we had to implement arbitrary rule to block spam from them
  //
  // <https://www.reddit.com/r/msp/comments/16n8p0j/spam_increase_from_onmicrosoftcom_addresses/>
  // <https://answers.microsoft.com/en-us/msoffice/forum/all/overwhelmed-by-onmicrosoftcom-spam-emails/6dcbd5c4-b661-47f5-95bc-1f3b412f398c>
  // <https://www.reddit.com/r/msp/comments/16n8p0j/comment/k1ns3ow/>
  //
  // IMPROVED APPROACH:
  // ------------------
  // Instead of blocking ALL Microsoft bounces, we now check Microsoft's own
  // spam classification (X-Forefront-Antispam-Report header) to distinguish
  // between legitimate bounces and spam bounces (backscatter).
  //
  // Legitimate bounces from Microsoft will have:
  // - SFV:NSPM (Not Spam) verdict
  // - Low SCL (0-2) spam confidence level
  // - No spam categories (CAT:OSPM, CAT:SPM, etc.)
  //
  // Spam bounces (backscatter) will have:
  // - High SCL (>=5)
  // - Spam verdicts (SFV:SPM, SFV:SKB, SFV:SKS)
  // - Spam categories (CAT:OSPM, CAT:SPM, CAT:PHSH, etc.)
  //
  // This allows legitimate NDRs through while still blocking spam bounces.
  //
  // Check if this is a Microsoft bounce message
  const isMicrosoftBounce =
    session.originalFromAddress === 'postmaster@outlook.com' ||
    (session.resolvedClientHostname &&
      session.resolvedClientHostname.endsWith(
        '.outbound.protection.outlook.com'
      )) ||
    (session.originalFromAddress.startsWith('postmaster@') &&
      session.originalFromAddress.endsWith('.onmicrosoft.com')); // &&
  // isAutoReplyOrMailingList(headers); // &&
  // subject &&
  // (subject.startsWith('Undeliverable: ') ||
  //   subject.startsWith('No se puede entregar: '));

  if (isMicrosoftBounce) {
    // Check Microsoft's own spam classification to determine if this is a spam bounce
    const forefrontHeader = headers.getFirst('x-forefront-antispam-report');

    // Default to blocking if no Forefront header (can't verify legitimacy)
    let isSpamBounce = true;

    if (forefrontHeader) {
      const lowerForefrontHeader = forefrontHeader.toLowerCase();

      // Extract SCL (Spam Confidence Level) - scale 0-9
      const sclMatch = lowerForefrontHeader.match(/scl:(-?\d+)/);
      const scl = sclMatch ? Number.parseInt(sclMatch[1], 10) : null;

      // Check for spam verdicts
      // SFV:SPM - Message marked as spam by spam filtering
      // SFV:SKB - Message blocked because sender is in blocked senders/domains list
      // SFV:SKS - Message marked as spam before filtering (e.g., by mail flow rule)
      const hasSpamVerdict =
        lowerForefrontHeader.includes('sfv:spm') ||
        lowerForefrontHeader.includes('sfv:skb') ||
        lowerForefrontHeader.includes('sfv:sks');

      // Check for spam categories
      // CAT:OSPM - Outbound spam (from compromised Microsoft tenants)
      // CAT:SPM - Spam
      // CAT:PHSH - Phishing
      // CAT:HPHSH/HPHISH - High confidence phishing
      // CAT:HSPM - High confidence spam
      // CAT:MALW - Malware
      // CAT:SPOOF - Spoofing
      const hasSpamCategory =
        lowerForefrontHeader.includes('cat:ospm') ||
        lowerForefrontHeader.includes('cat:spm') ||
        lowerForefrontHeader.includes('cat:phsh') ||
        lowerForefrontHeader.includes('cat:hphsh') ||
        lowerForefrontHeader.includes('cat:hphish') ||
        lowerForefrontHeader.includes('cat:hspm') ||
        lowerForefrontHeader.includes('cat:malw') ||
        lowerForefrontHeader.includes('cat:spoof');

      // Check for non-spam verdict
      // SFV:NSPM - Spam filtering marked the message as non-spam
      const isNotSpam = lowerForefrontHeader.includes('sfv:nspm');

      // Determine if this is a spam bounce:
      // 1. If Microsoft explicitly says NOT spam (SFV:NSPM) with low SCL and no spam categories -> legitimate
      // 2. If has spam verdict or spam category -> spam bounce
      // 3. If high SCL (>=5) -> spam bounce
      // 4. If low SCL (<=2) without spam markers -> likely legitimate
      if (isNotSpam && scl !== null && scl <= 2 && !hasSpamCategory) {
        // Microsoft explicitly marked as non-spam with low confidence - allow through
        isSpamBounce = false;
      } else if (
        hasSpamVerdict ||
        hasSpamCategory ||
        (scl !== null && scl >= 5)
      ) {
        // Has spam indicators - block
        isSpamBounce = true;
      } else if (scl !== null && scl <= 2) {
        // Low SCL without explicit spam markers - allow through
        isSpamBounce = false;
      }
      // else: no clear indicators, default to blocking (isSpamBounce = true)
    }

    if (isSpamBounce) {
      throw new SMTPError(
        'Due to spam from onmicrosoft.com we have implemented restrictions; see https://old.reddit.com/r/msp/comments/16n8p0j/spam_increase_from_onmicrosoftcom_addresses/ ;'
      );
    }
  }

  //
  // ============================================================================
  // MICROSOFT EXCHANGE SPAM DETECTION
  // ============================================================================
  //
  // This section detects spam that has been forwarded through Microsoft Exchange
  // infrastructure by examining Microsoft's own spam classification headers.
  //
  // BACKGROUND:
  // -----------
  // Spam messages from compromised Microsoft 365 tenants (*.onmicrosoft.com) can
  // bypass traditional spam detection because:
  //
  // 1. Microsoft Exchange adds its own valid DKIM signature when forwarding
  // 2. External systems see dkim=pass for the Microsoft domain
  // 3. Original authentication failures (spf=fail, dkim=none, dmarc=none) are
  //    buried in inner headers and not checked by default
  //
  // TIMING & HEADER AVAILABILITY:
  // ------------------------------
  // Microsoft's mail flow rules (transport rules) run BEFORE anti-spam filtering,
  // so they cannot check X-Forefront-Antispam-Report headers. However, ForwardEmail
  // receives messages AFTER they have passed through Microsoft's complete processing
  // pipeline, meaning all anti-spam headers are already present and available for
  // inspection.
  //
  // Reference: https://learn.microsoft.com/en-us/answers/questions/125695/apply-transport-rule-per-junk-mail-category-to-pre
  // Quote: "The rules are applied _before_ the anti-spam checks."
  //
  // SOLUTION:
  // ---------
  // We leverage Microsoft's own spam detection results by checking their headers:
  // - X-MS-Exchange-Authentication-Results: Contains SPF/DKIM/DMARC results
  // - X-Forefront-Antispam-Report: Contains spam classification and confidence
  //
  // This approach benefits from Microsoft's extensive anti-spam infrastructure
  // without needing to replicate their analysis.
  //
  // COMMUNITY CONSENSUS:
  // --------------------
  // Reddit MSP community (18 upvotes) recommends checking:
  // 1. Sender from *.onmicrosoft.com domains
  // 2. X-MS-Exchange-Authentication-Results with spf=fail/softfail/dmarc=fail
  // 3. Legitimate Microsoft email will have spf=pass
  //
  // Reference: https://old.reddit.com/r/msp/comments/16n8p0j/spam_increase_from_onmicrosoftcom_addresses/
  //
  // Note: We do NOT check for spf=none (no SPF record) because:
  // - Many legitimate small/medium businesses don't implement SPF
  // - spf=none is absence of authentication, not authentication failure
  // - Would cause excessive false positives
  // Reference: https://www.reddit.com/r/sysadmin/comments/fftrx0/block_email_when_spfnone/
  // Quote: "Blocking for no SPF is horrible, sadly most small/medium businesses
  //         don't implement spf, and more of those who do, do it wrong."
  //
  // MICROSOFT DOCUMENTATION:
  // ------------------------
  // CAT (Category) values and their priority order:
  // Reference: https://learn.microsoft.com/en-us/defender-office-365/how-policies-and-protections-are-combined
  //
  // Priority Order (highest to lowest):
  // 1. CAT:MALW - Malware (cannot be bypassed by transport rules)
  // 2. CAT:HPHSH/HPHISH - High confidence phishing (cannot be bypassed)
  // 3. CAT:PHSH - Phishing
  // 4. CAT:HSPM - High confidence spam
  // 5. CAT:SPOOF - Spoofing
  // 6. CAT:UIMP - User impersonation (Defender for Office 365 only)
  // 7. CAT:DIMP - Domain impersonation (Defender for Office 365 only)
  // 8. CAT:GIMP - Mailbox intelligence/contact graph (Defender for Office 365 only)
  // 9. CAT:SPM - Spam
  // 10. CAT:BULK - Bulk mail
  //
  // Additional categories:
  // - CAT:BIMP - Brand impersonation
  // - CAT:OSPM - Outbound spam (spam from within Microsoft infrastructure)
  // - CAT:INTOS - Intra-Organization phishing
  //
  // SFV (Spam Filtering Verdict) values:
  // Reference: https://learn.microsoft.com/en-us/defender-office-365/message-headers-eop-mdo
  // - SFV:SPM - Message marked as spam by spam filtering
  // - SFV:SKB - Message blocked because sender is in blocked senders/domains list
  // - SFV:SKS - Message marked as spam before filtering (e.g., by mail flow rule setting SCL 5-9)
  // - SFV:NSPM - Message marked as non-spam
  // - SFV:BLK - Blocked by user's blocked senders list (already blocked, won't reach us)
  //
  // SCL (Spam Confidence Level):
  // - Range: -1 to 9
  // - Higher values = more likely spam
  // - SCL 5+ = medium-high to high spam confidence
  // - SCL -1 = whitelisted/bypass spam filtering
  //
  // RELATIONSHIP BETWEEN SFV, SCL, AND CAT:
  // ----------------------------------------
  // These three fields are complementary but serve different purposes:
  // - SCL: Numeric confidence score (0-9) - "How confident are we this is spam?"
  // - CAT: Threat category classification - "What type of threat is this?"
  // - SFV: Filtering verdict/decision - "What did we decide to do?"
  //
  // Reference: https://techcommunity.microsoft.com/blog/microsoftdefenderforoffice365blog/email-protection-basics-in-microsoft-365-spam--phish/3555712
  // Quote: "SCL:5 usually means the message was filtered as spam or phish, and you
  //         will find the category CAT:SPM / CAT:PHISH in the message headers."
  // Quote: "If we identify a message is spam or phish with a high degree of confidence,
  //         we'll mark it accordingly as CAT:HSPM or CAT:HPHSH and assign SCL:9"
  //
  // Example from analyzed spam message:
  // X-Forefront-Antispam-Report: ...SCL:5;SRV:;IPV:CAL;SFV:SPM;...CAT:OSPM;...
  //
  // This shows all three working together:
  // - SCL:5 = Medium-high spam confidence (numeric score)
  // - SFV:SPM = Verdict: marked as spam (filtering decision)
  // - CAT:OSPM = Category: outbound spam (threat classification)
  //
  // Our checks cover all three dimensions for defense in depth:
  // - CAT checks: Identify specific threat types
  // - SFV checks: Respect Microsoft's filtering verdicts
  // - SCL check: Catch-all for any spam Microsoft identifies
  //
  // ============================================================================

  //
  // IMPORTANT: Only check these headers for messages from Microsoft infrastructure
  // This prevents false positives from forged headers and ensures we only act on
  // legitimate Microsoft spam classifications.
  //
  // We check session.resolvedClientHostname ends with '.outbound.protection.outlook.com'
  // which is Microsoft's outbound email infrastructure. This ensures we only apply
  // these checks to messages that have actually been processed by Microsoft's systems.
  //
  if (
    session.resolvedClientHostname &&
    session.resolvedClientHostname.endsWith('.outbound.protection.outlook.com')
  ) {
    const msAuthHeader = headers.getFirst(
      'x-ms-exchange-authentication-results'
    );
    const forefrontHeader = headers.getFirst('x-forefront-antispam-report');

    //
    // CHECK 1: Authentication Failures
    // --------------------------------
    // Block if Microsoft detected that the original sender failed authentication.
    // According to RFC 7489 (DMARC), a message passes authentication if at least
    // one of SPF, DKIM, or DMARC passes. We must check all three and only block
    // if none of them pass.
    //
    // This check catches messages that fail all authentication methods:
    // - SPF failures: Sender IP not authorized by domain's SPF record
    // - SPF softfails: Domain owner suggests IP is probably not authorized
    // - DKIM failures: Message signature verification failed
    // - DMARC failures: Domain's DMARC policy failed
    //
    // NOTE: We do NOT check for spf=none or dkim=none (no record) because:
    // - Many legitimate small/medium businesses don't implement SPF/DKIM
    // - spf=none/dkim=none indicates absence of authentication, not failure
    // - Blocking for no SPF/DKIM would cause excessive false positives
    // - Community consensus: "Blocking for no SPF is horrible"
    //
    // IMPORTANT: Per RFC 7489, we only block if ALL authentication methods fail.
    // If any one of SPF, DKIM, or DMARC passes, the message should be allowed.
    //
    // Example legitimate forwarded email (should NOT be blocked):
    // X-MS-Exchange-Authentication-Results: spf=fail (sender IP changed)
    //  smtp.mailfrom=example.com; dkim=pass (signature verified)
    //  header.d=example.com;dmarc=pass action=none header.from=example.com;
    //
    // Example spam (should be blocked):
    // X-MS-Exchange-Authentication-Results: spf=fail (sender IP is 185.227.111.180)
    //  smtp.mailfrom=smssa.moe.edu.bn; dkim=fail (signature verification failed)
    //  header.d=none;dmarc=fail action=none header.from=smssa.moe.edu.bn;
    //
    //
    // CRITICAL FIX: Check Microsoft's spam verdict FIRST
    // ----------------------------------------------------
    // Before rejecting based on authentication failures, check if Microsoft's
    // spam filters already classified this message. If Microsoft says it's NOT spam
    // (SFV:NSPM or low SCL), we should trust that judgment and not override it
    // based solely on authentication failures.
    //
    // This prevents false positives for legitimate emails that have authentication
    // issues during domain transitions (e.g., SPF softfail with "domain transitioning").
    //
    if (forefrontHeader) {
      const lowerForefrontHeader = forefrontHeader.toLowerCase();

      // Extract SCL (Spam Confidence Level) - scale 0-9
      const sclMatch = lowerForefrontHeader.match(/scl:(\d+)/);
      const scl = sclMatch ? Number.parseInt(sclMatch[1], 10) : null;

      // Check SFV (Spam Filtering Verdict)
      const sfvNotSpam = lowerForefrontHeader.includes('sfv:nspm');

      // If Microsoft says it's NOT spam (low SCL or explicit NSPM verdict),
      // skip authentication-based blocking to avoid false positives
      const microsoftSaysNotSpam = sfvNotSpam || (scl !== null && scl <= 2);

      if (!microsoftSaysNotSpam && msAuthHeader) {
        // Microsoft either classified it as spam OR has no strong opinion
        // Proceed with authentication checks
        const lowerMsAuthHeader = msAuthHeader.toLowerCase();

        // Check if SPF passed
        const spfPass = lowerMsAuthHeader.includes('spf=pass');

        // Check if DKIM passed
        const dkimPass = lowerMsAuthHeader.includes('dkim=pass');

        // Check if DMARC passed
        const dmarcPass = lowerMsAuthHeader.includes('dmarc=pass');

        // Only block if ALL authentication methods failed (none passed)
        // Per RFC 7489: at least one of SPF, DKIM, or DMARC must pass
        if (!spfPass && !dkimPass && !dmarcPass) {
          // Additionally verify that at least one method actually failed
          // (not just absent) to avoid blocking messages with no auth headers
          //
          // CRITICAL FIX: Only consider HARD SPF failures, not softfail
          // spf=softfail indicates uncertainty (often during domain transitions)
          // and should NOT be treated as a hard failure
          const spfFailed = lowerMsAuthHeader.includes('spf=fail');
          // REMOVED: lowerMsAuthHeader.includes('spf=softfail')
          const dkimFailed = lowerMsAuthHeader.includes('dkim=fail');
          const dmarcFailed = lowerMsAuthHeader.includes('dmarc=fail');

          if (spfFailed || dkimFailed || dmarcFailed) {
            throw new SMTPError(
              'Due to spam from onmicrosoft.com we have implemented restrictions; see https://old.reddit.com/r/msp/comments/16n8p0j/spam_increase_from_onmicrosoftcom_addresses/'
            );
          }
        }
      }
    } else if (msAuthHeader) {
      // No forefrontHeader available, fall back to authentication-only check
      // (but still without treating softfail as hard failure)
      const lowerMsAuthHeader = msAuthHeader.toLowerCase();

      const spfPass = lowerMsAuthHeader.includes('spf=pass');
      const dkimPass = lowerMsAuthHeader.includes('dkim=pass');
      const dmarcPass = lowerMsAuthHeader.includes('dmarc=pass');

      if (!spfPass && !dkimPass && !dmarcPass) {
        const spfFailed = lowerMsAuthHeader.includes('spf=fail');
        const dkimFailed = lowerMsAuthHeader.includes('dkim=fail');
        const dmarcFailed = lowerMsAuthHeader.includes('dmarc=fail');

        if (spfFailed || dkimFailed || dmarcFailed) {
          throw new SMTPError(
            'Due to spam from onmicrosoft.com we have implemented restrictions; see https://old.reddit.com/r/msp/comments/16n8p0j/spam_increase_from_onmicrosoftcom_addresses/'
          );
        }
      }
    }

    // Continue with remaining checks on forefrontHeader
    if (forefrontHeader) {
      const lowerForefrontHeader = forefrontHeader.toLowerCase();

      //
      // CHECK 2: High-Confidence Threats (Highest Priority)
      // ----------------------------------------------------
      // Block messages that Microsoft identified with high confidence as:
      // - Malware (CAT:MALW)
      // - High confidence phishing (CAT:HPHSH or CAT:HPHISH)
      // - High confidence spam (CAT:HSPM)
      //
      // These are the highest priority threats in Microsoft's processing order
      // and cannot be bypassed by transport rules within Exchange.
      //
      // Reference: https://learn.microsoft.com/en-us/defender-office-365/how-policies-and-protections-are-combined
      // Quote: "High confidence phishing verdicts cannot be overridden by transport rules"
      //
      // Why block these:
      // - Microsoft has high confidence these are threats
      // - These represent the most dangerous message types
      // - False positive rate is very low for high-confidence classifications
      //
      if (
        lowerForefrontHeader.includes('cat:malw') ||
        lowerForefrontHeader.includes('cat:hphsh') ||
        lowerForefrontHeader.includes('cat:hphish') ||
        lowerForefrontHeader.includes('cat:hspm')
      ) {
        throw new SMTPError(
          'Due to spam from onmicrosoft.com we have implemented restrictions; see https://old.reddit.com/r/msp/comments/16n8p0j/spam_increase_from_onmicrosoftcom_addresses/'
        );
      }

      //
      // CHECK 3: Impersonation Attempts
      // --------------------------------
      // Block messages flagged for various types of impersonation:
      // - CAT:BIMP - Brand impersonation (impersonating known brands)
      // - CAT:DIMP - Domain impersonation (impersonating protected domains)
      // - CAT:GIMP - Mailbox intelligence impersonation (impersonating contacts)
      // - CAT:UIMP - User impersonation (impersonating protected users)
      //
      // These categories indicate sophisticated phishing attempts where the attacker
      // is trying to impersonate a trusted entity to deceive recipients.
      //
      // Note: DIMP, GIMP, and UIMP require Defender for Office 365 Plan 1 or 2.
      // BIMP is available in all plans.
      //
      // Why block these:
      // - Impersonation is a primary phishing technique
      // - These represent targeted attacks against specific entities
      // - Microsoft's machine learning has identified similarity to protected entities
      //
      if (
        lowerForefrontHeader.includes('cat:bimp') ||
        lowerForefrontHeader.includes('cat:dimp') ||
        lowerForefrontHeader.includes('cat:gimp') ||
        lowerForefrontHeader.includes('cat:uimp')
      ) {
        throw new SMTPError(
          'Due to spam from onmicrosoft.com we have implemented restrictions; see https://old.reddit.com/r/msp/comments/16n8p0j/spam_increase_from_onmicrosoftcom_addresses/'
        );
      }

      //
      // CHECK 4: Phishing and Spoofing
      // -------------------------------
      // Block messages identified as:
      // - CAT:PHSH - Phishing (standard confidence)
      // - CAT:SPOOF - Spoofing (forged sender)
      //
      // These are processed at priority levels 3 and 5 respectively in
      // Microsoft's protection order.
      //
      // Phishing attempts to trick users into revealing sensitive information.
      // Spoofing involves forging the sender's identity to appear as someone else.
      //
      // Why block these:
      // - Both represent malicious intent
      // - Spoofing indicates the From header is forged
      // - Phishing is a common attack vector
      //
      if (
        lowerForefrontHeader.includes('cat:phsh') ||
        lowerForefrontHeader.includes('cat:spoof')
      ) {
        throw new SMTPError(
          'Due to spam from onmicrosoft.com we have implemented restrictions; see https://old.reddit.com/r/msp/comments/16n8p0j/spam_increase_from_onmicrosoftcom_addresses/'
        );
      }

      //
      // CHECK 5: Spam Filtering Verdicts and Classifications
      // -----------------------------------------------------
      // Block messages with explicit spam verdicts or classifications:
      //
      // SFV (Spam Filtering Verdict) values:
      // - SFV:SPM - Message marked as spam by spam filtering
      // - SFV:SKB - Message blocked because sender is in blocked senders/domains list
      // - SFV:SKS - Message marked as spam before filtering (e.g., mail flow rule set SCL 5-9)
      //
      // CAT (Category) values:
      // - CAT:OSPM - Outbound spam (spam from within Microsoft infrastructure)
      // - CAT:SPM - Spam category
      //
      // CAT:OSPM is particularly important as it indicates spam originating from
      // compromised Microsoft 365 tenants, which is the exact problem we're solving.
      //
      // SFV:SKB and SFV:SKS are important because they represent explicit spam/block
      // decisions made through Microsoft's policies and mail flow rules. If Microsoft
      // has explicitly blocked or marked something as spam through these mechanisms,
      // we should respect those decisions.
      //
      // Example from analyzed spam:
      // X-Forefront-Antispam-Report: CIP:185.227.111.180;CTRY:DE;LANG:en;SCL:5;
      //  SRV:;IPV:CAL;SFV:SPM;H:smssa.moe.edu.bn;PTR:InfoDomainNonexistent;
      //  CAT:OSPM;SFS:(13230040)(82310400026)...;DIR:OUT;SFP:1501;
      //
      // Why block these:
      // - SFV:SPM is Microsoft's explicit spam verdict from filtering
      // - SFV:SKB indicates admin policy blocked the sender
      // - SFV:SKS indicates mail flow rule marked it as spam
      // - CAT:OSPM indicates compromised Microsoft tenant (our primary concern)
      // - CAT:SPM is the general spam category
      //
      // Note: We do NOT check for SRV:BULK (bulk mail) because:
      // - Bulk mail is not necessarily spam (newsletters, marketing users want)
      // - Would cause false positives
      // - Users can configure their own bulk mail thresholds
      // - Our focus is spam from compromised tenants, not bulk mail
      //
      if (
        lowerForefrontHeader.includes('sfv:spm') ||
        lowerForefrontHeader.includes('sfv:skb') ||
        lowerForefrontHeader.includes('sfv:sks') ||
        lowerForefrontHeader.includes('cat:ospm') ||
        lowerForefrontHeader.includes('cat:spm')
      ) {
        throw new SMTPError(
          'Due to spam from onmicrosoft.com we have implemented restrictions; see https://old.reddit.com/r/msp/comments/16n8p0j/spam_increase_from_onmicrosoftcom_addresses/'
        );
      }

      //
      // CHECK 6: Spam Confidence Level (SCL)
      // -------------------------------------
      // Block if SCL is 5 or higher (medium-high to high spam confidence).
      //
      // SCL Scale:
      // -1: Whitelisted (skip spam filtering)
      //  0-4: Low to medium spam likelihood
      //  5-6: Medium-high spam likelihood (typically moved to Junk)
      //  7-9: High spam likelihood (typically quarantined)
      //
      // Threshold of 5 chosen because:
      // 1. The analyzed spam message had SCL:5 and was clearly spam
      // 2. Microsoft's default policies treat SCL 5+ as spam
      // 3. Balances false positives vs. catching spam
      // 4. Organizations can adjust threshold to 6 or 7 if needed
      //
      // Example from analyzed spam:
      // X-Forefront-Antispam-Report: ...SCL:5;SRV:;IPV:CAL;SFV:SPM...
      //
      // Why use SCL 5 as threshold:
      // - Catches medium-high to high confidence spam
      // - Aligns with Microsoft's default spam handling
      // - Provides defense-in-depth (catches spam even if other checks miss it)
      // - Can be tuned based on false positive rate
      //
      // Relationship to CAT and SFV:
      // According to Microsoft: "SCL:5 usually means the message was filtered as
      // spam or phish, and you will find the category CAT:SPM / CAT:PHISH in the
      // message headers."
      //
      // This means SCL and CAT are usually assigned together, making this check
      // somewhat redundant with the CAT:SPM check above. However, we keep it as:
      // - A catch-all for edge cases where SCL is assigned without CAT
      // - Defense-in-depth
      // - Explicit documentation of our spam threshold
      //
      // Reference: https://learn.microsoft.com/en-us/defender-office-365/anti-spam-spam-confidence-level-scl-about
      //
      const sclMatch = forefrontHeader.match(/scl:(\d+)/i);
      if (sclMatch && Number.parseInt(sclMatch[1], 10) >= 5) {
        throw new SMTPError(
          'Due to spam from onmicrosoft.com we have implemented restrictions; see https://old.reddit.com/r/msp/comments/16n8p0j/spam_increase_from_onmicrosoftcom_addresses/'
        );
      }
    }
  }

  /*
  // Postmark has refused to do any KYC process to prevent Cash App scammers
  if (
    session.resolvedRootClientHostname &&
    session.resolvedRootClientHostname === 'mtasv.net'
  )
    throw new SMTPError(
      'Postmark has been blocked due to their lack of KYC process in preventing Cash App phishing email scams. If they resolve this issue and contact us, we will unblock them.'
    );
  */

  //
  // due to high spam from 163.com we are blocking their bounces
  //
  if (
    session.originalFromAddress === 'postmaster@163.com' &&
    subject &&
    subject.includes('系统退信')
  ) {
    throw new SMTPError(
      'Due to spam from postmaster@163.com we have implemented bounce block restrictions'
    );
  }

  //
  // due to bounce spam from sakura.ne.jp we are blocking their failure auto-replies
  //
  if (
    session.resolvedRootClientHostname === 'sakura.ne.jp' &&
    headers.hasHeader('auto-submitted') &&
    headers.getFirst('auto-submitted').toLowerCase().trim() ===
      'auto-generated (failure)'
  ) {
    throw new SMTPError(
      'Due to bounce spam from sakura.ne.jp we have implemented bounce block restrictions'
    );
  }

  //
  // due to microsoft and docusign scam
  //
  if (
    session.originalFromAddress === 'dse_na4@docusign.net' &&
    (session?.spf?.domain.endsWith('.onmicrosoft.com') ||
      session?.spf?.domain === 'onmicrosoft.com')
  ) {
    throw new SMTPError(
      'Due to spam from onmicrosoft.com and docusign.net SPF we have implemented restrictions; see https://old.sp/comments/16n8p0j/spam_increase_from_onmicrosoftcom_addresses/ ;'
    );
  }

  //
  // this checks for messages that aren't coming from us
  // and contain a spoofed "From" address that looks like it's from us
  //
  // NOTE: we only check the DOMAIN portion of the From address, not the local part (username)
  //       this allows users to have emails like "user+forwardemail@domain.com" or "forwardemail@company.com"
  //       while still blocking impersonation attacks like "support@forwardemailclone.com"
  //
  // we also check for:
  // 1. TLD spoofing (e.g., forwardemail.cn, forwardemail.io)
  // 2. IDN homograph attacks (e.g., Cyrillic/Greek lookalike characters)
  //
  if (!config.isSelfHosted) {
    // extract domain from From header
    const fromDomain = parseHostFromDomainOrAddress(from);

    // check if domain contains our brand name or is a homograph/TLD attack
    let isDomainImpersonation = false;

    if (fromDomain) {
      // get root domain of the From address
      const fromRootDomain = parseRootDomain(fromDomain);

      // check for exact domain match (e.g., forwardemail.net)
      if (REGEX_DOMAIN.test(fromDomain)) {
        isDomainImpersonation = true;
      }
      // check for TLD spoofing (e.g., forwardemail.cn, forwardemail.io)
      // this catches domains where the root domain contains our brand but has different TLD
      else if (
        fromRootDomain &&
        fromRootDomain !== env.WEB_HOST &&
        (REGEX_DOMAIN_WITHOUT_TLD.test(fromRootDomain) ||
          REGEX_APP_NAME.test(fromRootDomain))
      ) {
        isDomainImpersonation = true;
      }
      // check for brand name in subdomain or other parts (e.g., forwardemailclone.com)
      else if (
        REGEX_DOMAIN_WITHOUT_TLD.test(fromDomain) ||
        REGEX_APP_NAME.test(fromDomain)
      ) {
        isDomainImpersonation = true;
      }
      // check for IDN homograph attacks using confusables library
      else {
        // decode punycode if present
        let decoded = fromDomain.toLowerCase();
        try {
          if (decoded.includes('xn--')) {
            decoded = punycode.toUnicode(decoded);
          }
        } catch {
          // if decoding fails, use original
        }

        // convert confusable characters to ASCII equivalents
        // e.g., Cyrillic 'а' -> Latin 'a', Greek 'ο' -> Latin 'o'
        const skeleton = confusables.remove(decoded);

        // check if skeleton contains our brand name
        if (
          skeleton.includes(domainWithoutTLD.toLowerCase()) ||
          skeleton.includes(env.APP_NAME.toLowerCase())
        ) {
          isDomainImpersonation = true;
        }
      }
    }

    // if domain impersonation detected, block it regardless of DKIM/SPF status
    // (spammers can easily set up valid DKIM/SPF for impersonation domains)
    // only allow if the authenticated domain is actually our domain (env.WEB_HOST)
    if (isDomainImpersonation) {
      // allow only if both DKIM and SPF are passing AND the root domain is ours
      const isAuthenticatedAsUs =
        (session.hadAlignedAndPassingDKIM ||
          session.spfFromHeader.status.result === 'pass') &&
        session.originalFromAddressRootDomain === env.WEB_HOST;

      if (!isAuthenticatedAsUs) {
        throw new SMTPError(
          `Blocked spoofing, please forward this to ${config.abuseEmail}`
        );
      }
    }

    //
    // check for display name impersonation in the From header
    // this catches attacks like: From: forwardemail.net<aaa@xyz.com>
    // where the display name is used to impersonate our service
    //
    // we check for:
    // 1. exact matches (case-insensitive): "forwardemail", "forwardemail.net"
    // 2. variations with spaces: "forward email", "Forward Email"
    // 3. IDN homograph attacks using confusables library
    //
    if (isSANB(from)) {
      const parsed = addressParser(from);
      if (parsed.length > 0 && isSANB(parsed[0].name)) {
        const displayName = parsed[0].name;

        // normalize: remove spaces and convert to lowercase
        const normalizedName = displayName.replace(/\s+/g, '').toLowerCase();

        // check for exact brand name matches
        let isDisplayNameImpersonation = false;

        // check if normalized name contains our domain or brand name
        if (
          normalizedName.includes(domainWithoutTLD.toLowerCase()) ||
          normalizedName.includes(
            env.APP_NAME.replace(/\s+/g, '').toLowerCase()
          )
        ) {
          isDisplayNameImpersonation = true;
        }

        // check for IDN homograph attacks in display name
        if (!isDisplayNameImpersonation) {
          // decode punycode if present in display name
          let decoded = displayName.toLowerCase();
          try {
            if (decoded.includes('xn--')) {
              decoded = punycode.toUnicode(decoded);
            }
          } catch {
            // if decoding fails, use original
          }

          // convert confusable characters to ASCII equivalents
          // e.g., Cyrillic 'а' -> Latin 'a', Greek 'ο' -> Latin 'o'
          const skeleton = confusables.remove(decoded);

          // normalize skeleton: remove spaces
          const normalizedSkeleton = skeleton.replace(/\s+/g, '').toLowerCase();

          // check if skeleton contains our brand name
          if (
            normalizedSkeleton.includes(domainWithoutTLD.toLowerCase()) ||
            normalizedSkeleton.includes(
              env.APP_NAME.replace(/\s+/g, '').toLowerCase()
            )
          ) {
            isDisplayNameImpersonation = true;
          }
        }

        // if display name impersonation detected, block it
        // only allow if the authenticated domain is actually our domain
        if (isDisplayNameImpersonation) {
          const isAuthenticatedAsUs =
            (session.hadAlignedAndPassingDKIM ||
              session.spfFromHeader.status.result === 'pass') &&
            session.originalFromAddressRootDomain === env.WEB_HOST;

          if (!isAuthenticatedAsUs) {
            throw new SMTPError(
              `Blocked display name spoofing, please forward this to ${config.abuseEmail}`
            );
          }
        }
      }
    }
  }

  //
  // here is where we attempt to protect users from spammers
  // that impersonate spoofing the "From" address in an email
  // as if it's from their domain name, which is a common attack
  //
  // note that we only check this if DKIM wasn't aligned and passing
  // and if the sender's hostname is not same as From header's hostname
  // so we use `session.hasSameHostnameAsFrom` for this (which is set in `helpers/update-session.js`)
  // because that's an obvious signal that it's coming from the same address
  // due to the resolved client hostname of the reverse lookup on the `session.remoteAddress`
  //
  // the way that we check this is quite simple:
  // all we need to do is check if any of the RCPT TO values have a matching root domain as From header
  // AND if the From header was not SPF aligned, then throw the error
  //
  // NOTE: we do have one exception to this, and it is that often
  //       system administrators will set up cron jobs to send them alerts
  //       (which often are sent to the same domain name) and are lacking passing SPF
  //       (or the administrator simply never configured an SPF policy)
  //       therefore we check for those cases with a simple regular expression against the Subject line
  //       and if the SPF policy was not strictly failing, then it's probably a legitimate message
  //
  if (
    !session.hasSameHostnameAsFrom &&
    !session.hadAlignedAndPassingDKIM &&
    !session.isAllowlisted
  ) {
    const hasSameRcptToAsFrom = session.envelope.rcptTo.some(
      (to) =>
        parseRootDomain(parseHostFromDomainOrAddress(checkSRS(to.address))) ===
        session.originalFromAddressRootDomain
    );
    if (hasSameRcptToAsFrom && session.spfFromHeader.status.result !== 'pass') {
      session.isPotentialPhishing = true;
    } // Used after email is delivered to imap/webhook/forwarding to send a one-time email

    if (
      hasSameRcptToAsFrom &&
      session.spfFromHeader.status.result !== 'pass' &&
      // NOTE: a lot of sysadmins have improperly configured SPF/DKIM
      //       on their servers and send wordpress/php script alerts
      !headers.hasHeader('x-php-script') &&
      !(
        headers.hasHeader('x-mailer') &&
        // PHP/PHPMailer/Drupal
        ['php', 'drupal'].some((string_) =>
          headers.getFirst('x-mailer').toLowerCase().includes(string_)
        )
      ) &&
      !(subject && REGEX_SYSADMIN_SUBJECT.test(subject))
    ) {
      throw new SMTPError(
        'Message likely to be spoofing attack and was rejected due to lack of SPF alignment with From header'
      );
    }
  }

  //
  // NOTE: we may want to handle Reply-To attack where the reply address is different than the From address
  //       BUT... this is typically handled with the logic above
  //       (for example, someone sends an email "We have your password, send us BTC")
  //       (and the From is you@yourdomain.com and the To is you@yourdomain.com, but the Reply-To needs to be different)
  //       (otherwise the spammer/attacker would never get the response to the email)
  //
}

module.exports = isArbitrary;
