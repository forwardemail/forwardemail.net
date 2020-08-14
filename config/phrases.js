const env = require('./env');

// turn off max length eslint rule since this is a config file with long strs
/* eslint max-len: 0 */

module.exports = {
  HELLO: 'Hello',
  WWW_WARNING:
    'It looks like you accidentally included "www." in your domain name.  Did you mean example.com instead of www.example.com?',
  INVALID_API_CREDENTIALS: 'Invalid API credentials.',
  INVALID_API_TOKEN: 'Invalid API token.',
  INVALID_EMAIL: 'Email address was invalid.',
  INVALID_FILE: 'File upload was invalid.',
  INVALID_MESSAGE: `Your message was invalid, as it was either blank or more than (${env.SUPPORT_REQUEST_MAX_LENGTH}) characters.`,
  INVALID_PASSWORD: 'Password was invalid.',
  INVALID_PASSWORD_CONFIRM: 'Password confirmation did not match new password.',
  INVALID_PASSWORD_STRENGTH: 'Password strength was not strong enough.',
  INVALID_PORT: 'Invalid port number.',
  INVALID_PROVIDER: 'We do not support this authentication provider.',
  INVALID_RECOVERY_KEY: 'Invalid recovery key.',
  INVALID_RESET_PASSWORD: 'Reset token and email were not valid together.',
  INVALID_SET_EMAIL: 'Change email token and email were not valid together.',
  INVALID_RESET_TOKEN: 'Reset token provided was invalid.',
  INVALID_SESSION_SECRET: 'Invalid session secret.',
  INVALID_SLUG: 'Please slightly change values to ensure slug uniqueness.',
  INVALID_STRING: '<span class="notranslate">%s</span> was missing or blank.',
  INVALID_USER: 'User does not exist.',
  INVALID_TOKEN: 'Invalid CSRF token.',
  INVALID_VERIFICATION_PIN: 'The verification code entered was invalid.',
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
  LOGOUT_REQUIRED: 'Please log out to view the page you requested.',
  ALIAS_DOES_NOT_EXIST: 'Alias does not exist on the domain.',
  NO_DOMAINS_EXIST: 'Add a domain name to your account to continue.',
  NO_ALIASES_EXIST: 'Add a new alias to continue.',
  INVALID_DOMAIN: 'Domain name was invalid (must be an IP or FQDN).',
  INVALID_FQDN: 'Domain name was invalid (must be a FQDN).',
  ADD_ALIAS: 'Add Alias',
  CATCHALL_ADMIN_REQUIRED:
    'User must be a domain admin to create a catch-all alias.',
  ALIAS_ALREADY_EXISTS: 'Alias already exists for domain.',
  DOMAIN_IS_VERIFIED: "Domain's DNS records have been verified.",
  DOMAIN_DOES_NOT_EXIST: 'Domain does not exist on your account.',
  RESERVED_WORD_ADMIN_REQUIRED: `User must be a domain admin to create an alias with a reserved word (see the page on <a target="_blank" rel="noopener noreferrer" href="%s/reserved-email-addresses">Reserved Email Addresses</a>).`,
  REACHED_MAX_ALIAS_COUNT:
    'User cannot have more than (5) aliases on global domains.',
  EXCEEDED_UNIQUE_COUNT: `You have exceeded the maximum count of (<span class="notranslate">%s</span>) recipients per alias.  Please <a href="/help">contact us</a> if you wish to have this limit increased.  We review requests on a unique basis.  Please provide us with information about your forwarding purposes if possible.`,
  DOMAIN_DOES_NOT_EXIST_ANYWHERE: 'Domain does not exist.',
  INVITE_DOES_NOT_EXIST:
    'Invite does not exist with your email address for this domain.',
  DOMAIN_ALREADY_EXISTS: 'Domain already exists on your account.',
  ACCOUNT_DELETE_HAS_DOMAINS:
    'Your account is currently an admin of one or more domain names.  Please delete these domains or remove yourself from them to continue.',
  ACCOUNT_DELETE_SUCCESSFUL: 'Your account was successfully deleted.',
  PASSWORD_RESET_LIMIT:
    'You can only request a password reset every 30 minutes.  Please try again <span class="notranslate">%s</span>.',
  PASSWORD_RESET_SENT: 'We have emailed you a link to reset your password.',
  PASSWORD_CONFIRM_SUCCESS: 'Password successfully confirmed.',
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
  CHANGE_EMAIL: 'You have successfully set a new email.',
  SIGNED_OUT: 'You have successfully signed out.',
  PENDING_RECOVERY_VERIFICATION_SUCCESS:
    'Your email has been successfully verified. You should receive a support email from an admin within the next 3-5 business days.',
  SUPPORT_REQUEST_ERROR:
    'We were unable to send your help request.  We have been alerted of this problem.  Please try again.',
  SUPPORT_REQUEST_LIMIT:
    'You have reached the limit for sending help requests.  Please try again.',
  SUPPORT_REQUEST_MESSAGE:
    'Thank you for contacting us.  We would love to hear more from you.  How can we help?',
  SUPPORT_REQUEST_SENT:
    'Your help request has been sent successfully.  You should hear from us soon.  Thank you!',
  UNKNOWN_ERROR:
    'An unknown error has occurred. We have been alerted of this issue. Please try again.',
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
  UPGRADE_PLAN: 'Upgrade Plan',
  INVALID_PLAN: 'Invalid plan selected.',
  PLAN_UPGRADE_REQUIRED:
    'Please upgrade to a paid plan to unlock this feature.',
  INVITE_ACCEPTED_ADMIN:
    'You have successfully accepted the invite to this domain and are an admin.',
  INVITE_ACCEPTED_USER:
    'You have successfully accepted the invite to this domain and you can now create your first alias.',
  INVITE_EMAIL_ERROR:
    'An error occurred while emailing the invite link.  Please manually copy the the invite link and share it with this person if needed.',
  INVALID_GROUP: 'Group was invalid, must be either admin or user.',
  INVITE_ALREADY_SENT:
    'Invite was already sent to this email address.  Please manually copy the invite link and share it with this person if needed.',
  BETA_PROGRAM:
    'Enhanced Protection and Team plans are currently free and in our final testing and beta program phase.  Once they are released, you will be emailed and will have 30 days to enter your billing information.  Thank you!',
  FREE_PLAN: 'You have successfully downgraded to the Free Plan.',
  ENHANCED_PROTECTION_PLAN:
    'You have successfully upgraded to the Enhanced Protection Plan.',
  TEAM_PLAN: 'You have successfully upgraded to the Team Plan.',
  ACCOUNT_BANNED: 'Your account has been banned.',
  ENOTFOUND: `Domain is not a registered domain name. <a href="/domain-registration">Click here to register it now</a>.`,
  MISSING_DNS_TXT:
    'Domain is missing required DNS TXT records. <a href="/faq?domain=%s" target="_blank">Read our FAQ</a> for detailed instructions.',
  SINGLE_VERIFICATION_RECORD_REQUIRED: `Domain has multiple verification records.  Please ensure there is only one verification record that exists.`,
  MULTIPLE_PORT_RECORDS: `Domain has multiple port records.  Please ensure there is only one port record that exists.`,
  AT_LEAST_ONE_ADMIN_REQUIRED:
    'At least one admin user must belong to the domain.',
  INVALID_VERIFICATION_RECORD:
    'Verification record must only use characters A-Z and numbers 0-9.',
  MISSING_DNS_MX: `<p class="mb-0">Domain is missing required DNS MX records of:</p><ul class="markdown-body ml-0 mr-0 mb-3"><span class="notranslate">%s</span></ul><p class="mb-0">Please ensure you do not have any typos and have both unique records added (e.g. make sure both records aren't the same).<a href="/faq?domain=%s" target="_blank">Read our FAQ</a> for detailed instructions.</p>`,
  MISSING_VERIFICATION_RECORD: `Domain is missing required DNS TXT record of: <span class="notranslate">%s</span>`,
  INCORRECT_VERIFICATION_RECORD: `Domain has an incorrect DNS TXT record for verification.  Please ensure <span class="notranslate">%s</span> is the only verification record that exists.`,
  MULTIPLE_VERIFICATION_RECORDS:
    'Domain has multiple verification records.  Please ensure <span class="notranslate">%s</span> is the only verification record that exists.',
  PURGE_CACHE: `If you recently updated your DNS records for <span class="notranslate">%s</span>, then you should purge its cache using <a href="https://1.1.1.1/purge-cache/" rel="noopener noreferrer" target="_blank">Cloudflare's Purge Cache Tool</a> and optionally <a href="https://developers.google.com/speed/public-dns/cache" rel="noopener noreferrer" target="_blank">Google's Purge Cache Tool</a>.  Note that sometimes it may take 30 minutes to 24 hours (depending on your location and provider) for the Internet's DNS propagation to finish.`,
  AUTOMATED_CHECK:
    "If we automatically detect your DNS records are valid (before you do), then we will send you an automated email alert.  Don't worry, we routinely check DNS records for your domain every few minutes!",
  IMPORT_ALIAS_ALREADY_EXISTS: `Could not import "<span class="notranslate">%s</span>" record's recipient of "<span class="notranslate">%s</span>" since it already exists as an alias.`,
  IMPORT_ALIAS_DISABLED_NOBODY:
    'We successfully imported the disabled address of "<span class="notranslate">%s</span>", but we had to do so with a single recipient of "nobody@forwardemail.net" because it did not have a recipient in the imported DNS entry.',
  IMPORT_CATCHALL_ALREADY_INCLUDES: `Could not import catch-all record's recipient of "<span class="notranslate">%s</span>" since the catch-all already includes it as a recipient.`,
  IMPORT_SUCCESSFUL: `Successfully imported (<span class="notranslate">%d</span>) aliases.`,
  IMPORT_ERROR: 'An error occurred while importing aliases.',
  IMPORT_NO_ALIASES_AVAILABLE: 'No aliases were available to import.',
  IMPORT_CATCHALL_SUCCESSFUL: `Successfully imported (<span class="notranslate">%d</span>) catch-all recipients.`,
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
  EMAIL_FAILED_TO_SEND:
    'Unfortunately an error occurred while sending the email.  Please try again or <a href="/help">contact us</a> for help.',
  EMAIL_CHANGE_SENT: 'We have emailed you a link to confirm email change.'
};
