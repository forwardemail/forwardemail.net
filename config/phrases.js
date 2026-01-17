/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const statuses = require('statuses');

const env = require('./env');

// turn off max length eslint rule since this is a config file with long strs
/* eslint max-len: 0 */

//
// NOTE: page title's use this if status code is not 200
// (e.g we don't want to render koa-meta titles on 404's)
//
const STATUSES = {};
for (const key of Object.keys(statuses.message)) {
  STATUSES[key.toString()] = statuses.message[key];
}

const DENYLIST_SUBJECT =
  'Your domain <span class="notranslate">%s</span> sent <span class="notranslate">%s</span> content';

const DENYLIST_MESSAGE = `
<p>We detected that <strong class="notranslate">%s</span> was sending <span class="notranslate">%s</span>. In order to protect our server's IP reputation, we had to block it &ndash; and therefore we added it to our denylist.</p>
<p>If this looks suspicious or is a false positive, then please contact us by responding to this message.  You should also check to ensure that you have a DMARC policy with "p=reject" (not "p=none") and are signing your outbound messages with a DKIM signature (e.g. using our SMTP servers).</p>
`.trim();

const ALIAS_GENERATED_PASSWORD = `
<div class="container mt-4">
  <div class="alert alert-danger small font-weight-bold d-inline-block mb-4">
    You must copy and store the password below somewhere before closing this pop-up – we do not store it; it cannot be recovered if lost.
  </div>

  <div class="mb-4">
    <strong>Username:</strong>
    <code class="notranslate">%s</code>
    <button type="button" data-toggle="clipboard" data-clipboard-text="%s" class="notranslate ml-3 btn btn-dark">
      <i class="fa fa-clipboard"></i> Copy
    </button>
  </div>

  <div class="mb-4">
    <strong>Password:</strong>
    <code class="notranslate">%s</code>
    <button type="button" data-toggle="clipboard" data-clipboard-text="%s" class="notranslate ml-3 btn btn-dark">
      <i class="fa fa-clipboard"></i> Copy
    </button>
  </div>

  <div class="alert alert-primary small font-weight-bold d-inline-block mb-4">
    Scan the QR codes below and open them to easily set up your account.
  </div>

  <div class="row mt-3 mb-0">
    <div class="col-12 col-md-6">
      <strong>Apple Mail (macOS/iOS)</strong>
      <div class="d-flex justify-content-center">
        <ol class="small text-left mb-4 mt-3">
          <li>Scan the QR Code</li>
          <li>Open the <span class="notranslate">.mobileconfig</span> file</li>
          <li>Allow the Profile Download</li>
          <li>Open Settings > General > VPN & Device Management</li>
          <li>Review and Install the Profile</li>
          <li>Open the Mail app to verify</li>
        </ol>
      </div>
      <img alt="Apple Mail QR Code" src="%s" class="bg-white p-3 mb-3" />
      <br />
      <a href="%s" download="%s" target="_blank" class="btn btn-success">Download</a>
    </div>

    <div class="col-12 col-md-6 mt-4 mt-md-0">
      <strong>Thunderbird Mobile (Android)</strong>
      <div class="d-flex justify-content-center">
        <ol class="text-left mb-4 mt-3">
          <li>Open Thunderbird Mobile</li>
          <li>Go to Settings</li>
          <li>Select Import Settings</li>
          <li>Tap Scan QR Code</li>
        </ol>
      </div>
      <img alt="Thunderbird QR Code" src="%s" class="bg-white p-3" />
    </div>
  </div>

  <div class="mt-4">
    <strong class="text-danger">This pop-up will automatically close in 10 minutes.</strong>
  </div>
</div>`.trim();

module.exports = {
  AUTHENTICATION_REQUIRED: 'Authentication is required.',
  MAILBOX_CREATION_FAILED: 'Mailbox creation failed. Please try again.',
  IMAP_OUT_OF_SYNC_TRY_AGAIN:
    'Your client is not in sync with another process or client.',
  DENYLIST_SUBJECT,
  DENYLIST_MESSAGE,
  ABUSE_PREVENTION_DELETE_ACCOUNT:
    'You cannot perform this deletion until 5 days after your first payment was made. This is an abuse prevention measure to mitigate fraud and spam, and it is noted in our privacy policy.',
  LOGGED_OUT_OTHER_DEVICES: 'Successfully logged out all other devices.',
  NEWSLETTER_ALREADY_SUBSCRIBED:
    'You are already subscribed to our newsletter.',
  NEWSLETTER_SUBSCRIBED:
    'You have successfully subscribed to our newsletter (new features and product updates).',
  NEWSLETTER_UNSUBSCRIBED:
    'You have successfully unsubscribed from our newsletter.',
  VACATION_RESPONDER_NAME_SPECIFIC:
    'Vacation responder can only be enabled for specific alias names (catchall/wildcard and regular expressions are not supported).',
  VACATION_RESPONDER_SMTP_REQUIRED:
    'You need to <a href="%s" target="_blank" rel="noopener noreferrer">configure Outbound SMTP</a> (and be approved) for <span class="notranslate">%s</span> in order to use a vacation responder.',
  VACATION_RESPONDER_NOT_SUPPORTED_ON_GLOBAL:
    'Vacation responder is not supported on global domains at this time.',
  VACATION_RESPONDER_DATE_INVALID:
    'Vacation responder start and/or end dates must be in MM/DD/YYYY format.',
  VACATION_RESPONDER_DATE_ISSUE:
    'Vacation responder start date must be before its end date.',
  MULTIPLE_PGP_SUBJECT:
    'Multiple PGP key conflict detected for <span class="notranslate">%s</span>',
  MULTIPLE_PGP_MESSAGE:
    'An email that was attempted to be forwarded under <span class="notranslate">%s</span> for <span class="notranslate">%s</span> matched multiple aliases that had PGP keys uploaded and enabled. Due to this conflict, PGP encryption was not enabled for the forwarded message as no primary public key could be determined. Please ensure only one PGP key matches this address match.',
  INVALID_BYTES:
    'Bytes were invalid, must be a string such as "1 GB" or "100 MB".',
  ALIAS_QUOTA_EXCEEDS_DOMAIN:
    "The quota for <span class='notranslate'>%s</span> of <span class='notranslate'>%s</span> exceeds the domain's maximum quota of <span class='notranslate'>%s</span>.",
  DOMAIN_MAX_QUOTA_EXCEEDS_USER:
    'The quota for <span class="notranslate">%s</span> of <span class="notranslate">%s</span> exceeds the maximum quota of <span class="notranslate">%s</span> from admins of the domain.',
  PAGINATION_CHECK_SUBJECT:
    'Notice: API pagination required starting November 1st',
  PAGINATION_CHECK_MESSAGE:
    'Starting November 1st of this year we will be enforcing API pagination on our API endpoints for list domains and list domain aliases.  Learn more about our approach to API pagination and how you can opt-in beforehand at <a href="%s" target="_blank" rel="noopener noreferrer">%s</a>.',
  RESTRICTED_ALIAS_DETECTED_SUBJECT:
    '<span class="notranslate">%s</span> has restricted alias name(s) detected',
  RESTRICTED_ALIAS_DETECTED_MESSAGE:
    '<div>The following alias names were detected on <strong class="notranslate text-monospace">%s</span> to be listed in restricted alias names and already existed.  You may wish to manually remove them, edit the names, and/or notify the alias owner to change their alias name:</div><ul class="notranslate"><li>%s</li></ul>',
  INVALID_LOCAL_PART:
    '<span class="notranslate">%s</span> is not a valid UTF-8 local part for an alias name',
  INVALID_REGEX_PATTERN:
    'The regex alias <span class="notranslate">%s</span> has an invalid pattern: <span class="notranslate">%s</span>. Please note that Perl-style operators like negative lookahead (?!) and lookbehind (?<!) are not supported.',
  INVALID_REGEX_ALIAS_SUBJECT:
    'Invalid regex pattern detected for alias on <span class="notranslate">%s</span>',
  INVALID_REGEX_ALIAS_MESSAGE:
    'An alias with an invalid regex pattern was detected on your domain <span class="notranslate">%s</span>. The alias <span class="notranslate">%s</span> has the pattern <span class="notranslate">%s</span> which caused the error: <span class="notranslate">%s</span>. Please note that Perl-style operators like negative lookahead and lookbehind are not supported by our regex engine (RE2). Please update or remove this alias to prevent email delivery issues.',
  ALIAS_NAME_INVISIBLE_UNICODE:
    'Alias name cannot contain invisible Unicode characters',
  RECIPIENT_INVISIBLE_UNICODE:
    'Recipient cannot contain invisible Unicode characters',
  VERIFIED_RECIPIENT_INVISIBLE_UNICODE:
    'Verified recipient cannot contain invisible Unicode characters',
  PENDING_RECIPIENT_INVISIBLE_UNICODE:
    'Pending recipient cannot contain invisible Unicode characters',
  RECIPIENT_MATCHES_EMAIL:
    '<p>You must edit the "Recipients" for these aliases to ensure they forward to a proper destination:</p><ul class="notranslate"><li>%s<li></ul><p><strong>IMPORTANT NOTE:</strong> You must ensure that you check the checkbox for "Active" once complete to re-enable the aliases on the Edit Alias screen.</p>',
  LINK_EXPIRED_OR_INVALID:
    'Link has expired, already been claimed, or is no longer active.',
  RATE_LIMITED: 'You have been rate limited, please try again later.',
  SMTP_RATE_LIMIT_EXCEEDED:
    'You have exceeded your daily SMTP outbound rate limit.',

  ALIAS_MUST_NOT_MATCH_RECIPIENT:
    'Alias forwarding recipients cannot be equal to <strong class="notranslate">%s</strong> &ndash; otherwise recursive forwarding would occur.  Please change or remove the forwarding recipient of <strong class="notranslate">%s</strong> to continue.',

  UBUNTU_LOGIN_REQUIRED:
    'Please <a href="%s" class="font-weight-bold">click here</a> to sign in with your Ubuntu One account to activate your alias.',
  UBUNTU_NOT_ALLOWED_EMAIL:
    'You cannot use that email address as a forwarding recipient.',
  UBUNTU_PERMISSIONS:
    'You can only read or manage your existing aliases, and do not have permission to create new ones.',
  UBUNTU_MAX_LIMIT: 'You cannot have more than 3 aliases for this domain.',
  UBUNTU_INVALID_USERNAME:
    'Launchpad username was missing or not detected, please try again later.',
  UBUNTU_API_RESPONSE_INVALID:
    'Invalid response from Launchpad API, please try again later.',
  UBUNTU_INVALID_GROUP:
    'You must be a member of a specific Launchpad group to get access.  Supported groups include ~ubuntumembers, ~kubuntu-members, ~lubuntu-members, ~edubuntu-members, and ~ubuntustudio-core.',

  START_DATE_INVALID: 'Start date must be a valid ISO-8601 date.',
  END_DATE_INVALID: 'End date must be an valid ISO-8601 date.',
  END_BEFORE_START: 'End date must be after start date.',

  ADDRESS_BOOK_DOES_NOT_EXIST: 'Address book does not exist.',
  ADDRESS_BOOK_ALREADY_EXISTS: 'Address book already exists.',
  ADDRESS_BOOK_READONLY: 'Address book is read-only.',

  INVALID_XML_REQUEST_BODY: 'Invalid XML request body.',
  UNSUPPORTED_REPORT_TYPE: 'Unsupported report type.',

  ETAG_DOES_NOT_MATCH: 'ETag does not match.',

  CONTACT_DOES_NOT_EXIST: 'Contact does not exist.',
  CONTACT_ALREADY_EXISTS: 'Contact already exists.',

  ICAL_DATA_REQUIRED: 'iCal data is required.',
  CALENDAR_EVENT_ID_REQUIRED: 'Calendar event ID is required.',

  CALENDAR: 'Calendar',
  CALENDAR_ALREADY_EXISTS: 'Calendar already exists.',
  CALENDAR_DOES_NOT_EXIST: 'Calendar does not exist.',
  CALENDAR_ID_REQUIRED: 'Calendar ID is required.',
  CALENDAR_DELETED_BACKUP:
    'Calendar named <span class="notranslate">%s</span> was successfully deleted with <span class="notranslate">%d</span> events (attached is a backup in case this was an accident)',
  EVENT_ALREADY_EXISTS: 'Event ID already exists within the same calendar.',
  EVENT_DOES_NOT_EXIST: 'Event does not exist.',
  PGP_ENCRYPTION_ERROR: 'An error occurred with OpenPGP encryption',
  FAILED_TO_PROCESS_PUBLIC_KEY: 'Failed to process public key.',
  FAILED_TO_VERIFY_PUBLIC_KEY: 'Failed to verify public key.',
  USER_UNVERIFIED:
    'Please <a href="%s" target="_blank">verify your email address</a> to continue',
  SCHEDULED_SEND_SUBJECT:
    'Did you mean to use scheduled sending? (<span class="notranslate">%d</span> minute(s) delay detected)',
  SCHEDULED_SEND_MESSAGE:
    'Our servers detected that one or more emails you queued for outbound SMTP have a "Date" header time difference of <span class="notranslate">%d</span> minute(s).  This means that these emails will not be sent until this time period has elapsed.  If this is not intended, then you may need to check your time and date settings on your device that is queueing emails.  We recommend that you use <a href="https://developers.cloudflare.com/time-services/ntp/usage/" target="_blank" rel="noopener noreferrer">Cloudflare\'s Time Service</a> as your NTP provider if possible.',
  STORAGE_THRESHOLD_SUBJECT:
    '<span class="notranslate">%d</span>% storage quota reached for <span class="notranslate">%s</span>',
  STORAGE_THRESHOLD_MESSAGE:
    '<div class="alert alert-danger small text-center"><span class="notranslate">%d</span>% storage quota reached (<span class="notranslate">%s</span> of <span class="notranslate">%s</span>) for <span class="notranslate text-monospace font-weight-bold">%s</span>.</div><p class="text-center">If you exceed your quota, then messages will not be delivered.</p><p class="text-center mb-0"><a href="%s" class="btn btn-lg btn-danger">Upgrade Storage</a></p>',
  CHANGED_MODULUS_LENGTH: 'New DKIM public and private key pair generated.',
  ALIAS_OVERRIDE_CANNOT_HAVE_PASSWORD:
    'You cannot enter your current password and also attempt to override at the same time.',
  ALIAS_OVERRIDE_REQUIRED:
    'You must enter the current password for the alias or check the checkbox to override and delete the mailbox.',
  ALIAS_NO_GENERATED_PASSWORD:
    'Alias does not yet have a generated password yet.',
  ALIAS_RATE_LIMITED:
    'You have exceeded the maximum number of failed authentication attempts. Please try again later or contact us.',
  ALIAS_BACKUP_LINK:
    'Please <a href="%s" target="_blank">click here</a> to download the backup. This link will expire soon.',
  ALIAS_REKEY_STARTED:
    'Alias password change (rekey) has been started for <span class="notranslate text-monospace font-weight-bold">%s</span> and you will be emailed upon completion.',
  ALIAS_REKEY_READY:
    'Alias password change (rekey) is now complete.  You can now log in to IMAP, POP3, and CalDAV servers with the new password for <span class="notranslate font-weight-bold text-monospace">%s</span>.',
  ALIAS_REKEY_READY_SUBJECT:
    'Alias password change (rekey) for <span class="notranslate">%s</span> is complete',
  ALIAS_REKEY_FAILED_SUBJECT:
    'Alias password change (rekey) for <span class="notranslate">%s</span> has failed due to an error',
  ALIAS_REKEY_FAILED_MESSAGE:
    '<p>The alias password change (rekey) for <span class="notranslate text-monospace font-weight-bold">%s</span> has failed and we have been alerted.</p><p>You may proceed to retry if necessary, and we may email you soon to provide help if necessary.</p><p>The error received during the rekey process was:</p><pre><code>%s</code></pre>',
  ALIAS_BACKUP_READY:
    'Click the button below within 4 hours to download the <span class="notranslate">"%s"</span> backup for <span class="notranslate font-weight-bold text-monospace">%s</span>.<br /><br /><a href="%s" target="_blank" rel="noopener noreferrer" class="btn btn-dark btn-lg">Download Now</a>',
  ALIAS_BACKUP_READY_SUBJECT:
    'Alias backup for <span class="notranslate">%s</span> is ready for download',
  ALIAS_BACKUP_STARTED:
    'Alias backup has been started for <span class="notranslate text-monospace font-weight-bold">%s</span> and you will be emailed once it is ready for download.',
  ALIAS_BACKUP_FAILED_SUBJECT:
    'Alias backup for <span class="notranslate">%s</span> has failed due to an error',
  ALIAS_BACKUP_FAILED_MESSAGE:
    '<p>The alias backup download for <span class="notranslate text-monospace font-weight-bold">%s</span> has failed and we have been alerted.</p><p>You may proceed to retry if necessary, and we may email you soon to provide help if necessary.</p><p>The error received during the backup process was:</p><pre><code>%s</code></pre>',
  ALIAS_BACKUP_DOWNLOAD_SUBJECT: `New alias backup download for <span class="notranslate">%s</span>`,
  ALIAS_BACKUP_DOWNLOAD:
    'Alias mailbox backup was downloaded by <span class="font-weight-bold text-monospace notranslate">%s</span>.  It was for <span class="font-weight-bold text-monospace notranslate">%s</span>.',
  ALIAS_PASSWORD_INSTRUCTIONS:
    'Alias password instructions have been emailed to <span class="font-weight-bold text-monospace notranslate">%s</span>.',
  ALIAS_PASSWORD_INSTRUCTIONS_SUBJECT: `Here is your password for <span class="notranslate">%s</span>`,
  ALIAS_PASSWORD_CLAIMED:
    'Password was claimed for <span class="font-weight-bold text-monospace notranslate">%s</span>.  This action was done by <span class="font-weight-bold text-monospace notranslate">%s</span>.',
  ALIAS_PASSWORD_CLAIMED_SUBJECT: `Password was claimed for <span class="notranslate">%s</span>`,
  ALIAS_PASSWORD_GENERATED:
    'New password created for <span class="font-weight-bold text-monospace notranslate">%s</span>.  This action was done by <span class="font-weight-bold text-monospace notranslate">%s</span>.',
  ALIAS_PASSWORD_GENERATED_SUBJECT: `New password generated for <span class="notranslate">%s</span>`,
  NO_RESULTS_FOUND: 'No results were found.',
  EMAIL_SETUP_GUIDE: 'Email Setup Guide',
  NO_CREDIT_CARD: '100% OPEN-SOURCE + QUANTUM RESISTANT ENCRYPTION',
  PRIVATE_BUSINESS: 'Private Business Email Service',
  TUTORIAL: 'Tutorial',
  FREE_EMAIL: 'Learn more',
  RECENTLY_BLOCKED:
    'The target <span class="notranslate">%s</span> has recently blocked this IP address, please try again in 1 hour.',
  CANNOT_CREATE_CATCHALL_ON_GLOBAL: 'Cannot create catch-all on global domain.',
  CANNOT_CREATE_REGEX_ON_GLOBAL: 'Cannot create regex on global domain.',
  CANNOT_USE_IMAP_ON_GLOBAL: 'Cannot use IMAP on global domain.',
  CANNOT_CREATE_CATCHALL_ON_DOMAIN:
    'Cannot create catch-all on domain due to large alias volume size.',
  CANNOT_CREATE_REGEX_ON_DOMAIN:
    'Cannot create regex on domain due to large alias volume size.',
  ALL_RECIPIENTS_BLOCKED: 'All recipients are blocked from sending mail to.',
  DENYLIST_HARD_CODED:
    'The value <span class="notranslate">%s</span> was listed in our permanent and hard-coded denylist.  Our team has been notified of your request for removal and we will follow up soon.',
  RECIPIENT_BLOCKED: 'Recipient is blocked from sending mail to.',
  SMTP_ERROR_SUBJECT:
    'Outbound SMTP Configuration Issue Detected for <span class="notranslate">%s</span>',
  SMTP_ERROR_MESSAGE:
    '<p class="text-center">Your domain <span class="notranslate">%s</span> has a configuration issue detected for outbound SMTP access.</p><p class="text-center mb-0"><a class="btn btn-lg btn-danger" href="%s">Verify Setup</a></p>',
  SMTP_ACCESS_SUBJECT:
    'Outbound SMTP for <span class="notranslate">%s</span> is now pending admin approval',
  SMTP_AUTO_APPROVAL_SUBJECT:
    'Outbound SMTP for <span class="notranslate">%s</span> has been auto-approved',
  SMTP_ACCESS_PENDING:
    'Your outbound SMTP configuration for <strong class="notranslate">%s</strong> was successfully verified and is now pending admin approval. We have been notified and you will receive a follow-up email as soon as an admin reviews this information.',
  ADD_DOMAIN: 'What is your domain name?',
  CANNOT_CREATE_TOKEN_FOR_CATCHALL: 'Cannot create token for catch-all alias.',
  CANNOT_CREATE_TOKEN_FOR_REGEX: 'Cannot create token for regex alias.',
  ALIAS_PASSWORD_EMAIL:
    '<p><span class="notranslate text-monospace font-weight-bold">%s</span> has sent you a password to use for <span class="notranslate text-monospace font-weight-bold">%s</span>.</p><p><a href="%s" rel="noopener noreferrer" class="font-weight-bold text-decoration-underline" target="_blank">Click this link</a> and immediately follow the instructions.</p>',
  ALIAS_GENERATED_PASSWORD,
  ALIAS_GENERATED_PASSWORD_NO_MOBILE_CONFIG:
    '<br /><div class="mt-3 alert alert-danger small font-weight-bold d-inline-block">You must copy and store the password below somewhere before closing this pop-up &ndash; we do not store it; it cannot be recovered it lost.</div><br /><br /><strong>Username:</strong> <code class="notranslate">%s</code><button type="button" data-toggle="clipboard" data-clipboard-text="%s" class="notranslate ml-3 btn btn-dark"><i class="fa fa-clipboard"></i> Copy</button><br /><br /><strong>Password:</strong> <code class="notranslate">%s</code><button type="button" data-toggle="clipboard" data-clipboard-text="%s" class="notranslate ml-3 btn btn-dark"><i class="fa fa-clipboard"></i> Copy</button><br /><br /><strong class="text-danger">This pop-up will automatically close in 10 minutes.</strong>',
  FASTEST_EMAIL: 'The Fastest Email Service',
  CLOSE_POPUP: 'Close Pop-up',
  PAST_DUE_OR_INVALID_ADMIN:
    'Domain has past due balance or does not have at least one valid admin.',
  ALIAS_ACCOUNT_BANNED: 'Alias user is banned.',
  EMAIL_SMTP_IS_VERIFIED:
    'You have successfully configured and verified DNS records for outbound SMTP.',
  INVALID_RETURN_PATH: 'Invalid Return-Path.',
  EMAIL_SMTP_CONFIGURATION_NEEDED:
    'Outbound SMTP configuration has not yet been completed for <strong class="notranslate">%s</strong>. Please verify the <span class="notranslate">DKIM</span>, <span class="notranslate">Return-Path</span>, and <span class="notranslate">DMARC</span> records under <strong>Outbound SMTP Configuration</strong> below.',
  EMAIL_SMTP_CONFIGURATION_REQUIRED:
    'Outbound SMTP configuration has not yet been completed for <strong class="notranslate">%s</strong>. Please verify the <span class="notranslate">DKIM</span>, <span class="notranslate">Return-Path</span>, and <span class="notranslate">DMARC</span> records under <a href="%s">Outbound SMTP Configuration</a>.',
  EMAIL_SMTP_GLOBAL_NOT_PERMITTED:
    'Outbound SMTP email from global domain names is not permitted.',
  EMAIL_SMTP_ACCESS_ENABLED_SUBJECT:
    '<span class="notranslate">%s</span> approved for outbound SMTP access',
  EMAIL_SMTP_ACCESS_ENABLED_MESSAGE:
    '<p class="text-center">Your domain <span class="notranslate">%s</span> was approved for outbound SMTP access.</p><p class="text-center mb-0"><a class="btn btn-lg btn-danger" href="%s">Complete Setup</a></p>',
  EMAIL_SMTP_ACCESS_DISABLED:
    '<p class="text-center text-danger">Your domain <span class="notranslate">%s</span> had its outbound SMTP access removed.</p>',
  EMAIL_NEWSLETTER_ACCESS_ENABLED_SUBJECT:
    '<span class="notranslate">%s</span> approved for newsletter access',
  EMAIL_NEWSLETTER_ACCESS_ENABLED_MESSAGE:
    '<p class="text-center">Your domain <span class="notranslate">%s</span> was approved for newsletter access.</p><p class="text-center mb-0"><a class="btn btn-lg btn-danger" href="%s">Complete Setup</a></p>',
  EMAIL_NEWSLETTER_ACCESS_DISABLED:
    '<p class="text-center text-danger">Your domain <span class="notranslate">%s</span> had its newsletter access removed.</p>',
  EMAIL_SMTP_ACCESS_REQUIRED:
    'Domain is not approved for outbound SMTP access, please <a class="font-weight-bold" href="/help">contact us</a>.',
  ENVELOPE_FROM_MISSING:
    'Envelope MAIL FROM header could not be parsed or was missing.',
  EMAIL_PREVIEW_ERROR:
    'An error occurred while rendering an email preview. We have been notified by email.',
  EMAIL_DOES_NOT_EXIST: 'Email does not exist.',
  LOG_DOWNLOAD_IN_PROGRESS: 'Your report will be emailed to you shortly.',
  EMAIL_REMOVED: 'Email was removed from the queue by an admin.',
  EMAIL_NOT_SCHEDULED:
    'Only emails with scheduled status can be updated. This email has already been sent or is currently being processed.',
  EMAIL_LOCKED:
    'Email is currently locked for processing and cannot be modified.',
  EMAIL_OWNER_REQUIRED:
    'You must be the email owner or a domain administrator to perform this action.',
  INVALID_EMAIL_STATUS:
    'Email status must be pending, queued, deferred, or scheduled.',
  EMAIL_ALREADY_EXISTS:
    'Email already exists with the same Message-ID, Date, and Envelope.',
  NO_REPLY_USERNAME_NO_SMTP:
    'You cannot use a "no-reply" username for outbound SMTP.',
  NO_REPLY_USERNAME_DISALLOWED:
    'You cannot use a "no-reply" username for an alias.',
  INVALID_DMARC_RESULT:
    'Invalid DMARC result (<span class="notranslate">"pct"</span> must be omitted or set to 100). We recommend using <span class="notranslate">"p=reject"</span> for better security.',
  INVALID_SPF_RESULT:
    'Invalid SPF result (must start with <span class="notranslate">"v=spf1"</span> and include <span class="notranslate">"include:spf.forwardemail.net"</span>).',
  INVALID_DKIM_SIGNATURE: 'Invalid DKIM signature.',
  INVALID_FROM_HEADER:
    'From header must be equal to <span class="notranslate">%s</span> (or) you can use a domain-wide catch-all password at <a href="%s" target="_blank" rel="noopener noreferrer">%s</a>',
  INVALID_CATCHALL_FROM_HEADER:
    'From header must end with <span class="notranslate">%s</span>',
  ALIAS_IS_NOT_ENABLED: 'Alias is not enabled.',
  ALIAS_MUST_HAVE_ONE_RECIPIENT: 'Alias must have at least one recipient.',
  ENCRYPTED_VALUE:
    '<br /><small class="notranslate alert alert-danger d-inline-block">You must copy the encrypted output below before closing this pop-up; it will not be shown again.</small><br /><strong>Input:</strong><br /><br />%s<br /><br /><strong>Output:</strong><br /><br /><code class="notranslate">%s=%s</code><br /><br /><button type="button" data-toggle="clipboard" data-clipboard-text="%s" class="btn btn-dark notranslate"><i class="fa fa-clipboard"></i> Copy</button>',
  INPUT_HAD_FE_SV: 'You do not need to encrypt site verification records',
  SEARCH_PAGE: 'Search page',
  TABLE_OF_CONTENTS: 'Table of Contents',
  PAYPAL_NOT_LOADED: 'Please wait for PayPal to load and try again.',
  BACKSCATTER:
    'The IP <span class="notranslate">%s</span> is denylisted by <a href="https://www.backscatterer.org" target="_blank" rel="noopener noreferrer">https://www.backscatterer.org</a>. To request removal, you must visit <a href="https://www.backscatterer.org/index.php?target=test&ip=%s" target="_blank" rel="noopener noreferrer">https://www.backscatterer.org/index.php?target=test&ip=%s</a>.',
  INSTANT_DENYLIST_AVAILABLE:
    'You may now submit your denylist removal request for instant removal.',
  DENYLIST_REMOVAL_SUCCESS:
    '<span class="notranslate">%s</span> was successfully removed from our denylist.',
  HELLO: 'Hello',
  WWW_WARNING:
    'It looks like you accidentally included <span class="notranslate">"www."</span> in your domain name.  Did you mean example.com instead of www.example.com?',
  INVALID_PROFILE_RESPONSE:
    'Invalid profile response, please delete this site from your third-party sign-in preferences and try again.',
  INVALID_PROFILE_ID:
    'Invalid profile identifier, please delete this site from your third-party sign-in preferences and try again.',
  CONSENT_REQUIRED:
    'Offline access consent required to generate a new refresh token.',
  OTP_NOT_ENABLED: 'OTP authentication is not enabled.',
  OTP_TOKEN_DOES_NOT_EXIST: 'OTP token does not exist for validation.',
  INVALID_CHALLENGE: 'Invalid challenge.',
  INVALID_ORIGIN_MISMATCH: 'Origin mismatch.',
  INVALID_RP_ID_HASH_MISMATCH: 'RP ID hash mismatch.',
  INVALID_ATTESTATION_DATA: 'Invalid attestation data.',
  INVALID_USER_NOT_PRESENT: 'User not present.',
  INVALID_PASSKEY: 'Passkey does not exist.',
  INVALID_NICKNAME: 'Nickname was missing or blank.',
  INVALID_ATTESTATION_FORMAT:
    'Unsupported attestation format <span class="notranslate">%s</span>',
  SUCCESSFULLY_ADDED_PASSKEY: 'Successfully added new passkey.',
  SUCCESSFULLY_REMOVED_PASSKEY: 'Successfully removed existing passkey.',
  SUCCESSFULLY_UPDATED_PASSKEY_NICKNAME:
    'Successfully updated passkey nickname.',
  PASSKEY_ADDED: 'New passkey was added to your account',
  PASSKEY_REMOVED: 'Passkey was removed from your account',
  PASSKEYS_MAX_LIMIT_EXCEEDED:
    'You cannot have more than <span class="notranslate">%d</span> passkeys at the same time.',
  DELETE_PROTECTED:
    'DELETE requests are dummy-proofed and protected from access within our API docs, please make a request outside of our API docs using your preferred client to perform this request.',
  INVALID_WEBAUTHN_KEY: 'Invalid WebAuthn key.',
  INVALID_API_CREDENTIALS: 'Invalid API credentials.',
  INVALID_API_TOKEN: 'Invalid API token.',
  INVALID_EMAIL: 'Email address was invalid.',
  INVALID_FILE: 'File upload was invalid.',
  INVALID_DATE: 'Date was invalid or not in the correct format.',
  INVALID_UPDATE_FIELDS:
    'Invalid fields for update: <span class="notranslate">%s</span>. Only the date field can be updated.',
  DATE_REQUIRED: 'Date field is required for this operation.',
  DATE_MUST_BE_FUTURE:
    'Scheduled send date must be in the future (at least 1 minute from now).',
  DATE_TOO_FAR_FUTURE:
    'Scheduled send date cannot be more than <span class="notranslate">%s</span> in the future.',
  INVALID_DENYLIST_VALUE:
    'Invalid domain name, IP address, email address. Please correct your denylist removal request and try again.',
  INVALID_DENYLIST_REQUEST: 'Value was not currently found in our denylist.',
  INVALID_KEY_VALUE:
    'Value was invalid, must be FQDN, EMAIL, IP, FQDN:email, or IP:email.',
  INVALID_MESSAGE: `Your message was invalid, as it was either blank or more than (${env.SUPPORT_REQUEST_MAX_LENGTH}) characters.`,
  INVALID_PASSWORD: 'Password was invalid.',
  DOMAIN_EXCEEDS_CATCHALL_PASSWORD_LIMIT:
    'You cannot have more than <span class="notranslate">%d</span> catch-all passwords generated at once',
  NEWSLETTER_USAGE_NOT_APPROVED:
    'Newsletter usage is not yet approved for your account, please wait for approval or contact us for support.',
  NEWSLETTER_APPROVAL_REQUIRED_SUBJECT:
    'Newsletter approval required for <span class="notranslate">%s</span>',
  NEWSLETTER_APPROVAL_REQUIRED_MESSAGE:
    'We detected that you attempted to send an outbound SMTP newsletter for <strong class="notranslate">%s</strong>.  Your domain does not yet have newsletter support approved, and an admin has been notified to begin review.  This process usually is resolved within 2-4 hours, but sometimes it may longer.',
  RETURN_PATH_ERROR_SUBJECT:
    '<span class="notranslate">%s</span> needs outbound SMTP configured or re-verified',
  RETURN_PATH_ERROR_MESSAGE:
    '<p>The domain <strong class="notranslate">%s</strong> had an issue with its outbound SMTP configuration:</p><p class="text-center mb-0"><a href="%s" class="btn btn-lg btn-danger">Resolve Issues</a></p>',
  BOUNCE_WEBHOOK_ERROR_SUBJECT:
    '<span class="notranslate">%s</span> had a bounce webhook error',
  BOUNCE_WEBHOOK_ERROR_MESSAGE:
    '<p>The domain <strong class="notranslate">%s</strong> had the following bounce webhook error from our POST request submitted to <strong class="notranslate">%s</strong>:</p>',
  INVALID_LOCALHOST_URL:
    'Localhost and private IP addresses are not permitted.',
  INVALID_PASSWORD_CONFIRM: 'Password confirmation did not match new password.',
  INVALID_PASSWORD_STRENGTH: 'Password strength was not strong enough.',
  INVALID_PASSWORD_CHARACTERS:
    'Quotes and apostrophes cannot be used as password characters.',
  INVALID_PORT: 'Invalid port number.',
  INVALID_PROVIDER: 'We do not support this authentication provider.',
  PROVIDER_NOT_CONNECTED:
    'The <span class="notranslate">%s</span> account is not connected to your profile.',
  USER_UNVERIFIED_FOR_DISCONNECT:
    'You must verify your email address before disconnecting an OAuth provider.',
  PASSWORD_REQUIRED_FOR_DISCONNECT:
    'You must set a password before disconnecting an OAuth provider to ensure you can still log in.',
  OAUTH_PROVIDER_DISCONNECTED:
    'Successfully disconnected your <span class="notranslate">%s</span> account.',
  OAUTH_PROVIDER_DISCONNECTED_SUBJECT:
    '%s account disconnected from your Forward Email account',
  OAUTH_PROVIDER_DISCONNECTED_MESSAGE:
    'Your %s account has been disconnected from your Forward Email account. If you did not make this change, please contact us immediately.',
  INVALID_RECOVERY_KEY: 'Invalid recovery key.',
  INVALID_RESET_PASSWORD: 'Reset token and email were not valid together.',
  INVALID_SET_EMAIL: 'Change email token and email were not valid together.',
  INVALID_RESET_TOKEN: 'Reset token provided was invalid.',
  INVALID_SESSION_SECRET: 'Invalid session secret.',
  INVALID_ALIAS_BACKUP:
    'You cannot download a backup for a catch-all or regex.',
  INVALID_ALIAS_BACKUP_FORMAT:
    'Backup format must be either EML, MBOX, or SQLite.',
  INVALID_SLUG: 'Please slightly change values to ensure slug uniqueness.',
  BACKUP_IN_PROGRESS:
    'We could not complete your request at this time to create a backup.  Either a backup is already in progress or the queue is currently full.  Please try again later, and if this problem persists please contact us for help.',
  INVALID_STRING: '<span class="notranslate">%s</span> was missing or blank.',
  INVALID_INQUIRY: 'Inquiry does not exist.',
  INVALID_INQUIRY_WEBHOOK_EMAIL:
    'Invalid inquiry webhook email. Requires support@ emails.',
  INVALID_INQUIRY_WEBHOOK_PAYLOAD: 'Invalid inquiry webhook payload.',
  INVALID_INQUIRY_WEBHOOK_REQUEST:
    'Webhook request did not originate from a valid hostname',
  MISSING_INQUIRY_WEBHOOK_SIGNATURE_HEADER:
    'Webhook request missing X-Signature-Header',
  INVALID_INQUIRY_WEBHOOK_SIGNATURE: 'Invalid signature in webhook request',
  INVALID_USER: 'User does not exist.',
  INVALID_LOG: 'Log does not exist.',
  INVALID_MEMBER: 'Member does not exist.',
  INVALID_VERIFICATION_PIN: 'The verification code entered was invalid.',
  PAYMENT_ALREADY_EXISTS: 'Payment already exists',
  INVALID_PAYMENT_METHOD:
    'Payment method must be either card, wallet, bank, or PayPal.',
  INVALID_PAYMENT_TYPE: 'Payment type must be either one-time or subscription.',
  INVALID_PAYMENT_DURATION: 'Payment duration was invalid.',
  JAVASCRIPT_REQUIRED: 'Please enable JavaScript to continue.',
  EMAIL_VERIFICATION_REQUIRED: 'Please verify your email address to continue.',
  EMAIL_VERIFICATION_INTERVAL:
    'Please wait for <span class="notranslate">%s</span> and try again.',
  EMAIL_VERIFICATION_SUCCESS:
    'Your email address has been successfully verified.',
  EMAIL_ALREADY_VERIFIED: 'Your email address is already verified.',
  EMAIL_VERIFICATION_SENT:
    'A verification code has been sent to your email address.',
  EMAIL_VERIFICATION_EXPIRED:
    'Your current email verification code has expired and we have sent a new one to your email address.',
  INVALID_OTP_PASSCODE: 'Invalid two-factor authentication passcode.',
  IS_NOT_ADMIN: 'You do not belong to the administrative user group.',
  TWO_FACTOR_REQUIRED:
    'Please log in with two-factor authentication to continue.',
  LOGIN_REQUIRED: 'Please log in or sign up to view the page you requested.',
  LOGIN_REQUIRED_FOR_ACTION:
    'We tried to create a new account with this email address, but it already exists.  Please log in with this email address if it belongs to you and then try again.',
  LOGOUT_REQUIRED: 'Please log out to view the page you requested.',
  ALIAS_DOES_NOT_EXIST: 'Alias does not exist on the domain.',
  CALDAV_SMTP_NOT_ENABLED_SUBJECT:
    'Configure Outbound SMTP for <span class="notranslate">%s</span> to send calendar invites',
  CALDAV_SMTP_NOT_ENABLED_MESSAGE:
    'You need to <a href="%s" target="_blank" rel="noopener noreferrer">configure Outbound SMTP</a> (and be approved) for <span class="notranslate">%s</span> in order for calendar invites to be sent by email to attendees.',
  IMAP_NOT_ENABLED_SUBJECT:
    'Enable <span class="notranslate">IMAP/POP3/CalDAV</span> for <span class="notranslate">%s</span>',
  IMAP_NOT_ENABLED_MESSAGE:
    'We detected a login to our <span class="notranslate">IMAP/POP3/CalDAV</span> servers by <strong class="notranslate text-monospace">%s</strong>, however this feature is not yet enabled on the alias. Please <a target="_blank" rel="noopener noreferrer" class="font-weight-bold" href="%s">edit your alias</a> and enable IMAP to receive mail for <strong class="text-monospace notranslate">%s</strong>.',
  IMAP_INBOX_SAFEGUARD_SUBJECT: 'Inbox Safeguard',
  IMAP_MAILBOX_SESSION_OUTDATED:
    'Mailbox needs to call OPEN/SELECT prior to MOVE',
  EXPUNGE_RESERVED:
    'EXPUNGE command is reserved for Trash/Junk/Spam only, please MOVE the messages to one of these folders to EXPUNGE',
  IMAP_INBOX_SAFEGUARD:
    'You cannot move all messages in the Inbox at once to Trash; please make partial moves to continue',
  IMAP_SESSION_OUTDATED: 'Session mailbox change detected during request',
  IMAP_TARGET_AND_SOURCE_SAME: 'Source mailbox and target mailbox are equal',
  IMAP_NO_MESSAGES_SELECTED: 'No messages were selected',
  IMAP_MAILBOX_MAX_EXCEEDED: 'Maximum number of mailboxes exceeded',
  IMAP_MESSAGE_SIZE_EXCEEDED: 'Maximum message size exceeded',
  IMAP_MAILBOX_INBOX_CANNOT_STORE_DRAFTS: 'Inbox cannot store draft messages',
  IMAP_MAILBOX_ALREADY_EXISTS: 'Mailbox already exists',
  IMAP_MAILBOX_DOES_NOT_EXIST: 'Mailbox does not exist',
  IMAP_MAILBOX_OVER_QUOTA: 'Mailbox is over quota',
  IMAP_MAILBOX_RESERVED: 'Mailbox is reserved and cannot be removed',
  IMAP_INVALID_SEARCH: 'Invalid search query',
  IMAP_MAILBOX_MESSAGE_EXCEEDS_QUOTA:
    'Mailbox quota for <span class="notranslate">%s</span> would be exceeded by message size',
  NO_DOMAINS_EXIST: 'Enter your custom domain name to continue.',
  NO_ALIASES_EXIST: 'Add a new alias to continue.',
  INVALID_DOMAIN:
    'Domain name was invalid (must be a domain name without protocol, for example "domain.com" instead of "http://domain.com" or an IP address).',
  INVALID_FQDN:
    'Domain name was invalid (must be a domain name without protocol, for example "domain.com" instead of "http://domain.com").',
  ADD_ALIAS: 'Add Alias',
  CATCHALL_ADMIN_REQUIRED:
    'User must be a domain admin to create a catch-all alias.',
  ALIAS_ALREADY_EXISTS: 'Alias already exists for domain.',
  DOMAIN_IS_VERIFIED: "Domain's DNS records have been verified.",
  DOMAIN_DOES_NOT_EXIST: 'Domain does not exist on your account.',
  LOG_DOES_NOT_EXIST: 'Log does not exist on your account.',
  RESERVED_WORD_ADMIN_REQUIRED:
    'User must be a domain admin to create an alias with a reserved word (see the page on <a target="_blank" rel="noopener noreferrer" class="font-weight-bold" href="%s/reserved-email-addresses">Reserved Email Addresses</a>).',
  REACHED_MAX_ALIAS_COUNT:
    'User cannot have more than <span class="notranslate">%d</span> aliases on global domains.',
  EXCEEDED_UNIQUE_COUNT:
    'You have exceeded the maximum count of (<span class="notranslate">%s</span>) recipients per alias.  Please <a class="font-weight-bold" href="/help">contact us</a> if you wish to have this limit increased.  We review requests on a unique basis.  Please provide us with information about your forwarding purposes if possible.',
  DOMAIN_DOES_NOT_EXIST_ANYWHERE: 'Domain does not exist.',
  DOMAIN_REQUIRES_SMTP_ACCESS: 'Domain requires SMTP access.',
  INVITE_DOES_NOT_EXIST:
    'Invite does not exist with your email address for this domain.',
  DOMAIN_ALREADY_EXISTS: 'Domain already exists on your account.',
  ASYNC_PAYMENT:
    'Thank you for completing your checkout session. <strong>Please note that your payment is still pending.</strong> Once it has been successfully processed, then we will notify you by email. Please wait until you receive this email &ndash; and then you can visit our website and refresh the page for the most updated account information.',
  ACCOUNT_DELETE_HAS_DOMAINS:
    'Your account is currently an admin of one or more domain names.  Please delete these domains or remove yourself from them to continue.',
  ACCOUNT_DELETE_SUCCESSFUL: 'Your account was successfully deleted.',
  PASSWORD_RESET_LIMIT: 'Please try again <span class="notranslate">%s</span>.',
  PASSWORD_RESET_SENT: 'We have emailed you a link to reset your password.',
  PASSWORD_CONFIRM_SUCCESS: 'Password successfully confirmed.',
  PASSWORD_REQUIRED: 'Please set a password on your account to continue.',
  EMPTY_RECOVERY_KEYS: 'Empty Recovery Keys',
  OTP_RECOVERY_RESET:
    'You have run out of recovery keys. Please download the newly generated recovery keys before continuing.',
  OTP_RECOVERY_SUCCESS:
    'Recovery key successful. This key will no longer be valid.',
  REGISTERED: 'You have successfully registered.',
  SIGNED_IN: 'You have successfully signed in.',
  ALREADY_SIGNED_IN: 'You are already signed in.',
  REQUEST_OK: 'Your request was successfully completed.',
  REQUEST_TIMED_OUT:
    'Sorry, your request has timed out.  We have been alerted of this issue.  Please try again.',
  RESET_PASSWORD: 'You have successfully set a new password.',
  CHANGE_EMAIL: 'You have successfully set a new email address.',
  SIGNED_OUT: 'You have successfully signed out.',
  PENDING_RECOVERY_VERIFICATION_SUCCESS:
    'Your email has been successfully verified. You should receive a support email from an admin within the next 3-5 business days.',
  INQUIRY_RESPONSE_BULK_REPLY_ERROR:
    'An error occurred while attempting to send bulk reply. Please try again.',
  SUPPORT_REQUEST_ERROR:
    'We were unable to send your help request.  We have been alerted of this problem.  Please try again or directly email <a href="mailto:support@forwardemail.net">support@forwardemail.net</a>.',
  SUPPORT_REQUEST_LIMIT:
    'You have reached the limit for sending help requests.  Please try again.',
  SUPPORT_REQUEST_MESSAGE:
    'Thank you for contacting us.  We would love to hear more from you.  How can we help?',
  SUPPORT_REQUEST_SENT:
    'Your help request has been sent successfully.  You should hear from us soon.  Thank you!',
  UNKNOWN_ERROR:
    'An unknown error has occurred. We have been alerted of this issue. Please try again.',
  ERROR_OCCURRED_PLEASE_CONTACT_US:
    'An error occurred, please contact us directly by email at <a href="mailto:%s" target="_blank">%s</a>',
  INVALID_ERROR_CODE_IF_DISABLED:
    'Error code if disabled must be either <span class="notranslate">250</span>, <span class="notranslate">421</span>, or <span class="notranslate">550</span>.',
  PASSPORT_MISSING_PASSWORD_ERROR: 'Please enter a password.',
  PASSPORT_ATTEMPT_TOO_SOON_ERROR:
    'Account is currently locked due to rate limiting.  Please try again later.',
  PASSPORT_TOO_MANY_ATTEMPTS_ERROR:
    'Account is currently locked due to too many failed login attempts.  Please try again later.',
  PASSPORT_NO_SALT_VALUE_STORED_ERROR:
    'Please log in with Google or GitHub and set your password in order to be able to log in with your email address.',
  PASSPORT_INCORRECT_PASSWORD_ERROR: 'Email address or password is incorrect.',
  PASSPORT_INCORRECT_USERNAME_ERROR: 'Email address or password is incorrect.',
  PASSPORT_MISSING_USERNAME_ERROR: 'Please enter an email address.',
  PASSPORT_USER_EXISTS_ERROR:
    'A user with the given email address is already registered.  Please try to log in or reset the password if this account belongs to you.',
  PLAN_ALREADY_ACTIVE: 'This plan is already active, please refresh.',
  UPGRADE_PLAN: 'Upgrade Plan',
  INVALID_PLAN: 'Invalid plan selected.',
  REMOVE_MEMBERS_BEFORE_PLAN_CHANGE:
    'Please remove all invited members to the domain before changing plans.',
  PLAN_UPGRADE_REQUIRED:
    'Please <a class="font-weight-bold" href="%s">upgrade to a paid plan</a> to unlock this feature.',
  PLAN_UPGRADE_REQUIRED_FOR_GLOBAL_DOMAINS:
    'Please <a class="font-weight-bold" target="_blank" href="%s">upgrade to the Enhanced Protection Plan</a> to unlock vanity domains on your account.',
  PLAN_UPGRADE_REQUIRED_FOR_GLOBAL_DOMAINS_AND_DELETE_REQUIRED:
    'Please <a class="font-weight-bold" target="_blank" href="%s">upgrade to the Enhanced Protection Plan</a> to unlock vanity domains on your account.  To prevent this messages from showing again, please either upgrade, disable, or delete all global vanity aliases from your account.',
  INVITE_ACCEPTED_ADMIN:
    'You have successfully accepted the invite to this domain and are an admin.',
  INVITE_ACCEPTED_USER:
    'You have successfully accepted the invite to this domain and you can now create your first alias.',
  INVITE_EMAIL_ERROR:
    'An error occurred while emailing the invite link.  Please manually copy the the invite link and share it with this person if needed.',
  INVALID_GROUP: 'Group was invalid, must be either admin or user.',
  INVITE_ALREADY_SENT:
    'Invite was already sent to this email address.  Please manually copy the invite link and share it with this person if needed.',
  CANNOT_REMOVE_GLOBAL_DOMAIN:
    'You cannot remove a global domain, please <a class="font-weight-bold" href="/help">contact us</a>.',
  FREE: 'Free',
  ENHANCED_PROTECTION: 'Enhanced Protection',
  TEAM: 'Team',
  FREE_PLAN: 'You have successfully downgraded to the Free Plan.',
  ENHANCED_PROTECTION_PLAN:
    'You have successfully upgraded to the Enhanced Protection Plan.',
  TEAM_PLAN: 'You have successfully upgraded to the Team Plan.',
  AUTO_RENEW_STARTS:
    'Auto-renew successfully enabled (starts on <span class="notranslate">%s</span>)',
  AUTO_RENEW_ENABLED:
    'You have successfully subscribed and enabled auto-renew.',
  ACCOUNT_BANNED: 'Your account has been banned.',
  DOMAIN_SUSPENDED:
    'Your domain has been suspended from outbound SMTP access due to spam or bounce detection.',
  DOMAIN_IS_ADMIN_SUSPENDED:
    '<p class="text-center text-danger">Your domain <span class="notranslate">%s</span> has been suspended from outbound SMTP access by an admin.</p>',
  DOMAIN_SUSPENSION_REMOVED:
    '<p class="text-center">Your domain <span class="notranslate">%s</span> is no longer suspended from outbound SMTP access.</p>',
  ENOTFOUND:
    'Domain is not a registered domain name. <a class="font-weight-bold" href="/domain-registration">Click here to register it now</a>.',
  MISSING_DNS_TXT:
    'Domain is missing required DNS <span class="notranslate">TXT</span> records. <a class="font-weight-bold" href="/faq?domain=%s" target="_blank">Read our FAQ</a> for detailed instructions.',
  MISSING_DNS_NS: 'Domain does not have DNS nameservers configured.',
  SINGLE_VERIFICATION_RECORD_REQUIRED:
    'Domain has multiple verification records.  Please ensure there is only one verification record that exists.',
  MULTIPLE_PORT_RECORDS:
    'Domain has multiple port records.  Please ensure there is only one port record that exists.',
  AT_LEAST_ONE_ADMIN_REQUIRED:
    'At least one admin user must belong to the domain.',
  INVALID_VERIFICATION_RECORD:
    'Verification record must only use characters A-Z and numbers 0-9.',
  MX_HAS_OTHER:
    '<p class="mb-0">We have detected that your domain has multiple MX server providers. Please ensure that the <strong>ONLY</strong> DNS MX records are:</p><ul class="markdown-body ml-0 mr-0 mb-3 notranslate">%s</ul><p class="mb-0">Please ensure you do not have any typos and have both unique records added (e.g. make sure both records aren\'t the same). <a class="font-weight-bold" href="/faq?domain=%s" target="_blank">Read our FAQ</a> for detailed instructions.</p>',
  MISSING_DNS_MX:
    '<p class="mb-0">Domain is missing required DNS MX records of:</p><ul class="markdown-body ml-0 mr-0 mb-3 notranslate">%s</ul><p class="mb-0">Please ensure you do not have any typos and have both unique records added (e.g. make sure both records aren\'t the same). <a class="font-weight-bold" href="/faq?domain=%s" target="_blank">Read our FAQ</a> for detailed instructions.</p>',
  DNS_CHANGES_TAKE_TIME:
    '<p class="mb-0"><strong>Making changes to your DNS records takes time to propagate throughout the Internet. <span class="text-danger">You may need to wait a few minutes</span> and then try again.</strong></p>',
  TO_UNSUBSCRIBE_DELETE_ACCOUNT:
    'If you wish to unsubscribe from all of our emails, then please delete your account on this page.',
  UNSUBSCRIBE: 'Unsubscribe',
  SETUP_REQUIRED:
    'Your domain <span class="notranslate font-weight-bold">%s</span> has not yet completed setup. You must follow <a href="%s" class="font-weight-bold">steps 1 and 2</a> as soon as possible to complete setup.',
  SETUP_NOT_FINISHED: 'Follow steps 1 and 2 below to complete setup.',
  SETUP_REQUIRED_MULTIPLE: 'Please complete setup for multiple domains below.',
  MISSING_VERIFICATION_RECORD:
    'Domain is missing required DNS <span class="notranslate">TXT</span> record of: <span class="notranslate">%s</span>',
  INCORRECT_VERIFICATION_RECORD:
    'Domain has an incorrect DNS <span class="notranslate">TXT</span> record for verification.  Please ensure <span class="notranslate">%s</span> is the only verification record that exists.',
  MULTIPLE_VERIFICATION_RECORDS:
    'Domain has multiple verification records.  Please ensure <span class="notranslate">%s</span> is the only verification record that exists.',
  NAMESERVER_CHECK:
    'Please ensure that your DNS nameservers are set properly too (e.g. if you are using a DNS provider such as Cloudflare &ndash; which may be a different provider than your domain registrar).',
  AUTOMATED_CHECK:
    'If we detect your DNS records are valid, then we will send you an automated email alert.  We routinely check DNS records for your domain every few hours.',
  IMPORT_ALIAS_ALREADY_EXISTS:
    'Could not import "<span class="notranslate">%s</span>" record\'s recipient of "<span class="notranslate">%s</span>" since it already exists as an alias.',
  IMPORT_ALIAS_DISABLED_NOBODY:
    'We successfully imported the disabled address of "<span class="notranslate">%s</span>", but we had to do so with a single recipient of "nobody@forwardemail.net" because it did not have a recipient in the imported DNS entry.',
  IMPORT_CATCHALL_ALREADY_INCLUDES:
    'Could not import catch-all record\'s recipient of "<span class="notranslate">%s</span>" since the catch-all already includes it as a recipient.',
  IMPORT_SUCCESSFUL:
    'Successfully imported (<span class="notranslate">%d</span>) aliases.',
  IMPORT_ERROR: 'An error occurred while importing aliases.',
  IMPORT_NO_ALIASES_AVAILABLE: 'No aliases were available to import.',
  IMPORT_CATCHALL_SUCCESSFUL:
    'Successfully imported (<span class="notranslate">%d</span>) catch-all recipients.',
  IMPORT_CATCHALL_ERROR:
    'An error occurred while importing catch-all recipients.',
  IMPORT_CATCHALL_NONE: 'No catch-all recipients were available to import.',
  MULTIPLE_VERIFICATION_ERRORS:
    'Multiple errors occurred during record verification.',
  USER_ALREADY_MEMBER: 'User is already an accepted member of this domain',
  METRICS_NOT_AVAILABLE:
    'Our metrics are not available, please check back later.',
  SUNDAY: 'Sunday',
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  WEEK: 'Week',
  USERS: 'Users',
  DOMAINS: 'Domains',
  ALIASES: 'Aliases',
  PAYMENTS: 'Payments',
  CONCURRENCY_EXCEEDED_SUBJECT:
    'Exceeded max concurrent connections for <span class="notranslate">%s</span>',
  CONCURRENCY_EXCEEDED_MESSAGE:
    'You have exceeded the maximum number of concurrent connections (60) for <span class="notranslate">%s</span>.',
  ALIAS_WITH_PLUS_UNSUPPORTED:
    'Aliases cannot have a "+" symbol as this is a built-in filtering feature (similar to Gmail).',
  EMAIL_FAILED_TO_SEND:
    'Unfortunately an error occurred while sending the email.  Please try again or <a class="font-weight-bold" href="/help">contact us</a> for help.',
  EMAIL_CHANGE_SENT:
    'Check your inbox for a link to confirm your email change.',
  EMAIL_CHANGE_LIMIT:
    'You can only change your email address every <span class="notranslate">%s</span> minutes. Please try again <span class="notranslate">%s</span>.',
  EMAIL_CHANGE_ALREADY_EXISTS:
    'The email address <span class="notranslate">%s</span> already exists.',
  EMAIL_CHANGE_DOES_NOT_EXIST: 'Email change request does not exist.',
  EMAIL_CHANGE_CANCELLED: 'Email change request has been cancelled.',
  CANCELLED: 'Cancelled',
  INVITATION: 'Invitation',
  UPDATED_INVITATION: 'Updated Invitation',
  PAYMENT_DESCRIPTION:
    '<span class="notranslate">%s</span> payment for <span class="notranslate">%s</span> of the <span class="notranslate">%s</span> plan.',
  PAYMENT_REFERENCE_INVALID: 'Payment reference was invalid or did not exist.',
  RECEIPT: 'Receipt',
  MAKE_PAYMENT: 'Make Payment',
  ALLOWLIST_DENYLIST_EXCEEDS_LIMIT:
    "The domain's custom allowlist or denylist exceeds the limit of <span class='notranslate'>%d</span> entries.",
  ALLOWLIST_DOMAIN_NOT_ALLOWED:
    'The domain name you entered of <span class="font-weight-bold notranslate">%s</span> is not a valid custom domain name or it requires account approval for usage. Please use a custom domain name or <a href="%s">contact us</a> for account approval.',
  DENYLIST_DOMAIN_NOT_ALLOWED:
    'The domain name you entered of <span class="font-weight-bold notranslate">%s</span> is listed in our denylist. Please submit a <a href="%s">Denylist Removal Request</a> to resolve this issue.',
  RESTRICTED_EMAILS_ONLY:
    'Domain has a restricted extension and all users associated with the domain must have email addresses associated with government, public, or state extensions (no personal email addresses are permitted).',
  RESTRICTED_PLAN_UPGRADE_REQUIRED:
    'Domain name <span class="notranslate">%s</span> has a restricted extension and requires at least one admin to be on a paid plan. Please <a class="font-weight-bold" href="%s">upgrade your domain</a> to this plan to continue.',
  DOMAIN_PLAN_UPGRADE_REQUIRED:
    'Domain name <span class="notranslate">%s</span> must have at least one admin that is signed up for the <span class="notranslate">%s</span> plan. Please <a class="font-weight-bold" href="%s">upgrade your domain</a> to this plan to continue.',
  DOMAIN_PLAN_DOWNGRADE_REQUIRED:
    'Domain name <span class="notranslate">%s</span> must have at least one admin that is signed up for the <span class="notranslate">%s</span> plan. Please <a class="font-weight-bold" href="%s">downgrade this domain</a> to continue.',
  RESERVED_KEYWORD_DOMAIN_PLAN_UPGRADE_REQUIRED:
    'Domain name <span class="notranslate">%s</span> has a domain name that includes reserved keywords such as "mail", "disposable", and "inbox". Please <a class="font-weight-bold" href="%s">upgrade your domain</a> to this plan to continue.',
  BILLING_CYCLE_UPDATED_SUBJECT:
    'Your subscription billing cycle was accurately updated',
  BILLING_CYCLE_UPDATED_BODY:
    '<p class="text-center">This is an automated email regarding your subscription.</p><p class="text-center">Your next payment will be on <span class="notranslate">%s</span> instead of <span class="notranslate">%s</span>.</p><p class="text-center">This is most likely due to free credit being awarded to you.</p><p class="text-center"><strong>You do not need to take any action &ndash; thank you!</strong><p class="text-center mb-0"><a href="%s" class="btn btn-md btn-dark notranslate">Manage Billing</a></p>',
  SUBSCRIPTION_ACTIVATED_SUBJECT:
    'Your subscription has been successfully activated',
  SUBSCRIPTION_ACTIVATED_BODY:
    '<p class="text-center">This is an automated email regarding your subscription.</p><p class="text-center">Your <span class="notranslate">%s</span> plan subscription has been successfully activated.</p><p class="text-center"><strong>You do not need to take any action &ndash; thank you!</strong></p><p class="text-center mb-0"><a href="%s" class="btn btn-md btn-dark">Manage Billing</a></p>',
  INVALID_UPGRADE_KIND: 'Invalid upgrade type specified',
  INVALID_UPGRADE_OPTION: 'Invalid upgrade option specified',
  INVALID_STORAGE_OPTION: 'Invalid storage upgrade option',
  INVALID_SMTP_OPTION: 'Invalid SMTP upgrade option',
  UPGRADE_REQUEST_ERROR:
    'An error occurred while processing your upgrade request. Please try again.',
  EMAIL_FORWARDING_PAUSED: 'Email forwarding is paused',
  EMAIL_PAST_DUE:
    'Your account registered under <span class="notranslate">%s</span> is past due on payment. We have paused email forwarding and may suspend your account if this is not resolved.  Please visit <a href="https://forwardemail.net/my-account/billing">https://forwardemail.net/my-account/billing</a> to make payment.',
  MALICIOUS_DOMAIN_PLAN_UPGRADE_REQUIRED:
    'Domain name <span class="notranslate">%s</span> has a domain name extension that is frequently used for spam operations. Please <a class="font-weight-bold" href="%s">upgrade your domain</a> to continue. Please see our FAQ for the complete list of <a href="https://forwardemail.net/faq#what-domain-name-extensions-can-be-used-for-free" target="_blank">domain name extensions that can be used for free</a>.',
  MALICIOUS_DOMAIN:
    'Domain name <span class="notranslate">%s</span> has a domain name extension that is frequently abused for spam operations.  We require that users with this domain name extension upgrade to a paid plan in order to use our service.  Please see our FAQ for the complete list of <a href="https://forwardemail.net/faq#what-domain-name-extensions-can-be-used-for-free" target="_blank">domain name extensions that can be used for free</a>.',
  UPGRADE: 'Upgrade',
  BILLING: 'Billing',
  ENABLE_AUTO_RENEW: 'Enable Auto-Renew',
  INVALID_STRIPE_SIGNATURE: 'Invalid Stripe Signature',
  INVALID_PAYPAL_SIGNATURE: 'Invalid PayPal Signature',
  SUBSCRIPTION_ALREADY_ACTIVE:
    'You have an active subscription and auto-renew is currently enabled.',
  SUBSCRIPTION_ALREADY_CANCELLED:
    'You do not currently have an active subscription, or it was recently cancelled.',
  SUBSCRIPTION_CANCELLED: 'You have successfully cancelled your subscription.',
  ONE_TIME_PAYMENT_SUCCESSFUL: 'You have successfully made a one-time payment.',
  INVALID_PAYMENT_INTENT:
    'Payment was not successful and charge was not processed.  Please try again or contact us for help.',
  REFUND_ERROR_OCCURRED:
    'An error occurred while processing refunds. We have been notified by email.',
  REFUND_SUCCESSFUL:
    'We have successfully processed a total refunded amount of <span class="notranslate">%s</span>.',
  CONVERSION_ERROR_OCCURRED:
    'An error occurred while converting your existing credit between plans. We have been notified by email.',
  CONVERSION_SUCCESS:
    'You successfully switched plans and received a conversion credit of <span class="notranslate">%s</span>.',
  TURNSTILE_NOT_VERIFIED:
    '<span class="notranslate">Cloudflare Turnstile</span> not verified.',
  TURNSTILE_RENDER_ERROR:
    '<span class="notranslate">Cloudflare Turnstile</span> had an error, please refresh and try again or <a class="font-weight-bold" href="/help">contact us</a>.',
  MISSING_VERIFICATION_LINK:
    'Missing "VERIFICATION_LINK" in HTML template string.  This variable must be included at least once either in text or link format.',
  PAID_PLAN_REQUIRED_FOR_RECIPIENT_VERIFICATION:
    'Paid plan is required for recipient verification',
  INVALID_RECIPIENT_VERIFICATION:
    'Invalid recipient verification request.  Please ensure the link is correct and try again, or <a class="font-weight-bold" href="/help">contact us</a> for help.',
  RECIPIENT_VERIFICATION_PENDING_DOMAIN_VERIFICATION:
    'Verification link will not be sent until the domain has verified <span class="notranslate">TXT</span> and MX records.',
  DISPOSABLE_EMAIL_NOT_ALLOWED:
    'Disposable email addresses are not allowed.  Try again or <a class="font-weight-bold" href="/help">contact us</a> for help.',
  ACTIVE_INCIDENT:
    '<strong>Active Incident:</strong> <a class="text-themed" href="%s" rel="noopener noreferrer" target="_blank" class="notranslate">%s</a>',
  WEBSITE_OUTAGE:
    'We are resolving an issue with our website &ndash; visit our <a href="https://status.forwardemail.net" class="text-themed font-weight-bold" target="_blank" rel="noopener noreferrer">Status Page</a> for updates.',
  ERRORS_OCCURRED: 'The following errors occurred:',
  RESET_TOKEN_EXPIRED:
    'The reset token has already expired. Please start a new <a href="/forgot-password">Forgot Password</a> request to continue.',
  REASSIGNED_ALIAS_OWNERSHIP:
    'We have reassigned ownership of the following aliases to you:',
  REMOVED_ALIASES_FROM_OWNER:
    'We have removed the following aliases that belonged to you:',
  REASSIGNED_ALIASES_FROM_OWNER:
    'We have reassigned the following aliases that belonged to you:',
  PAID_PLAN_HAS_UNENCRYPTED_RECORDS:
    '<strong>This domain has unencrypted aliases stored in DNS <span class="notranslate">TXT</span> records.</strong>  Follow these steps to resolve this issue:<ol class="mt-3"><li><a href="%s">Import <span class="notranslate">TXT</span> Records</a></li><li>Remove any DNS <span class="notranslate">TXT</span> records prefixed with <code class="notranslate">%s=</code> (make sure you <u>DO NOT</u> remove the existing encrypted record)</li><li>Try to <a href="%s">Verify Records</a> again</li></ol>',
  DNS_RETRY:
    'An error code of "<span class="notranslate">%s</span>" occurred while performing the DNS lookup. Please try again.',
  USER_UPGRADED_ACCOUNT_NOT_DOMAINS_MESSAGE:
    'You successfully upgraded your account &ndash; however we noticed that you have one or more domains that are not on the same plan you upgraded to. Please configure each domain to use your current plan by using the drop-down menu located at the <a href="/my-account/domains">Domains</a> page.  You can feel free to mix and match domains to be configured on different plans (e.g. you can have some on the free plan, and others on upgraded paid plans).',
  USER_UPGRADED_ACCOUNT_NOT_DOMAINS_SUBJECT:
    'Need to configure your domains to match your plan?',
  PAST_DUE_CANNOT_SWITCH:
    'In order to switch plans, you must first update your account to good standing by paying the entire past due balance. You owe payment for <span class="notranslate">%d</span> months.  You can alternatively downgrade all of your domains to the free plan.',
  PAYMENT_PAST_DUE_SUBJECT:
    'Your account is past due and API access may be restricted!',
  PAYMENT_PAST_DUE_API_RESTRICTED:
    'API access has been restricted due to past due payment',
  PAYMENT_PAST_DUE_MESSAGE:
    '<strong class="text-danger">Your account is past due.</strong> Please <a href="%s">make a payment</a> immediately to avoid account termination.',
  VANITY_DOMAINS_NOT_ON_PAID:
    '<strong class="text-danger">Your vanity domain aliases are disabled due to past due payment.</strong> Please <a href="%s">%s</a> to re-enable them. As of January 1, 2023, we require vanity domain aliases to be on paid plans. We sent notifications in advance of this new policy starting in November 2022. If you no longer use vanity domain aliases, then disable or remove them from <a href="/my-account/domains">Domains</a> &rarr; Vanity Domain &rarr; Aliases.',
  PAST_DUE_REQUIRED_ONE_TIME:
    'Your account is <strong class="notranslate">%s</strong> past due. You must pay this amount before you can enable auto-renew.',
  YOUR_HELP_REQUEST: 'Your Help Request',
  AND: 'and',
  PLAN_MORE_THAN_TWO_YEARS_FROM_EXPIRY:
    'You cannot start a subscription nor enable auto-renew more than two years from your plan\'s current expiration date of <span class="notranslate">%s</span>.  Please try again <span class="notranslate">%s</span>.',
  MONTH: 'month',
  YEAR: 'year',
  SMTP: 'smtp',
  STORAGE: 'storage',
  SUCCESS: 'success',
  UPGRADE_REQUEST_ALREADY_SENT:
    'You recently sent an upgrade request, please try again later or contact us.',
  UPGRADE_REQUEST: 'Upgrade Request',
  UPGRADE_REQUEST_NOTIFICATION:
    'Our team has been notified and will follow up shortly by email.',
  FREE_CREDIT_GRANTED:
    'Free credit granted successfully to <span class="notranslate">%s</span> for <span class="notranslate">%s</span> plan (%s duration)',

  // API endpoint validation messages
  CONTACT_FULLNAME_OR_CONTENT_REQUIRED:
    'Contact must have either fullName or vCard content.',
  CONTACT_INVALID_ID: 'Invalid contact ID.',

  CALENDAR_NAME_REQUIRED: 'Calendar name is required.',
  CALENDAR_INVALID_ID: 'Invalid calendar ID.',

  FOLDER_NAME_OR_PATH_REQUIRED: 'Folder must have either name or path.',
  FOLDER_INVALID_ID: 'Invalid folder ID.',
  FOLDER_DOES_NOT_EXIST: 'Folder does not exist.',

  // General validation phrases
  INVALID_PARAMS: 'Invalid parameters.',
  INVALID_REQUEST_BODY: 'Invalid request body.',

  MESSAGE_INVALID_ID: 'Invalid message ID.',
  MESSAGE_DOES_NOT_EXIST: 'Message does not exist.',
  MESSAGE_FLAGS_INVALID: 'Message flags invalid.',

  // Contact validation phrases
  CONTACT_ID_REQUIRED: 'Contact ID is required.',
  CONTACT_FULLNAME_INVALID: 'Contact full name must be a valid string.',
  CONTACT_CONTENT_INVALID: 'Contact content must be a valid string.',
  CONTACT_UPDATE_FIELDS_REQUIRED:
    'At least one field must be provided for contact update.',
  CONTACT_EMAILS_MUST_BE_ARRAY: 'Contact emails must be an array.',
  CONTACT_EMAIL_MUST_BE_OBJECT: 'Contact email must be an object.',
  CONTACT_EMAIL_INVALID:
    'Contact email address is required and must be a valid email address.',
  CONTACT_EMAIL_TYPE_INVALID: 'Contact email type must be a valid string.',
  CONTACT_PHONES_MUST_BE_ARRAY: 'Contact phones must be an array.',
  CONTACT_PHONE_MUST_BE_OBJECT: 'Contact phone must be an object.',
  CONTACT_PHONE_INVALID:
    'Contact phone number is required and must be a valid string.',
  CONTACT_PHONE_TYPE_INVALID: 'Contact phone type must be a valid string.',
  CONTACT_ADDRESSES_MUST_BE_ARRAY: 'Contact addresses must be an array.',
  CONTACT_ADDRESS_MUST_BE_OBJECT: 'Contact address must be an object.',
  CONTACT_ADDRESS_STREET_INVALID:
    'Contact address street must be a valid string.',
  CONTACT_ADDRESS_CITY_INVALID: 'Contact address city must be a valid string.',
  CONTACT_ADDRESS_STATE_INVALID:
    'Contact address state must be a valid string.',
  CONTACT_ADDRESS_POSTAL_CODE_INVALID:
    'Contact address postal code must be a valid string.',
  CONTACT_ADDRESS_COUNTRY_INVALID:
    'Contact address country must be a valid string.',
  CONTACT_ADDRESS_TYPE_INVALID: 'Contact address type must be a valid string.',
  // EU referrer notification
  EU_REFERRER_NOTIFICATION:
    'Our EU servers are coming soon! Sign up for an account to auto-subscribe to our newsletter, or <a href="https://github.com/orgs/forwardemail/discussions/336" target="_blank" rel="noopener noreferrer" class="alert-link">subscribe to our GitHub discussion</a> to get notified when they\'re available.',
  // Unsubscribe phrases
  INVALID_UNSUBSCRIBE_TOKEN:
    'Invalid or expired unsubscribe link. Please manage your email preferences in your account settings.',
  // Settings validation phrases
  SETTINGS_ALIAS_AUTH_REQUIRED: 'Alias authentication required.',
  SETTINGS_INVALID_ALIAS_ID: 'Invalid alias ID.',
  SETTINGS_LABEL_KEYWORD_INVALID:
    'Label keyword must follow IMAP atom rules (letters, numbers, underscores, hyphens, dots).',
  SETTINGS_LABEL_NAME_REQUIRED: 'Label name is required.',
  SETTINGS_LABEL_COLOR_INVALID: 'Color must be a hex value like #33AADD.',
  SETTINGS_ARCHIVE_FOLDER_INVALID:
    'Archive folder must be a non-empty string or null.',
  SETTINGS_SENT_FOLDER_INVALID:
    'Sent folder must be a non-empty string or null.',
  SETTINGS_DRAFTS_FOLDER_INVALID:
    'Drafts folder must be a non-empty string or null.',
  SETTINGS_SAVED_SEARCH_NAME_REQUIRED: 'Saved search name is required.',
  SETTINGS_SAVED_SEARCH_QUERY_REQUIRED: 'Saved search query is required.',
  SETTINGS_SHORTCUT_KEYBINDING_REQUIRED:
    'Shortcut keybindings must be non-empty strings.',
  SETTINGS_ALIASES_DEFAULTS_MUST_BE_OBJECT:
    'Alias defaults must be provided as an object.',
  ...STATUSES
};
