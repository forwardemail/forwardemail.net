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
  INVALID_PROVIDER: 'We do not support this authentication provider.',
  INVALID_RECOVERY_PASSCODE: 'Invalid recovery passcode.',
  INVALID_RESET_PASSWORD: 'Reset token and email were not valid together.',
  INVALID_RESET_TOKEN: 'Reset token provided was invalid.',
  INVALID_SESSION_SECRET: 'Invalid session secret.',
  INVALID_SLUG: 'Please slightly change values to ensure slug uniqueness.',
  INVALID_STRING: '%s was missing or blank.',
  INVALID_USER: 'User does not exist.',
  INVALID_TOKEN: 'Invalid CSRF token.',
  INVALID_VERIFICATION_PIN: 'The verification pin you entered was invalid.',
  EMAIL_VERIFICATION_REQUIRED: 'Please verify your email address to continue.',
  EMAIL_VERIFICATION_INTERVAL: 'Please wait for %s and try again.',
  EMAIL_VERIFICATION_SUCCESS:
    'Your email address has been successfully verified.',
  EMAIL_ALREADY_VERIFIED: 'Your email address is already verified.',
  EMAIL_VERIFICATION_SENT:
    'An email verification pin has been sent to your email address.',
  EMAIL_VERIFICATION_EXPIRED:
    'Your current email verification pin has expired and we have sent you a new one to your email address.',
  INVALID_OTP_PASSCODE: 'Invalid two-factor authentication passcode.',
  IS_NOT_ADMIN: 'You do not belong to the administrative user group.',
  TWO_FACTOR_REQUIRED:
    'Please log in with two-factor authentication to view the page you requested.',
  LOGIN_REQUIRED: 'Please log in to view the page you requested.',
  LOGOUT_REQUIRED: 'Please log out to view the page you requested.',
  ALIAS_DOES_NOT_EXIST: 'Alias does not exist on the domain.',
  NO_DOMAINS_EXIST: 'Add a domain name to your account to continue.',
  NO_ALIASES_EXIST: 'Add a new alias to continue.',
  INVALID_DOMAIN: 'Domain name was invalid (must be an IP or FQDN).',
  ADD_ALIAS: 'Add Alias',
  DOMAIN_IS_VERIFIED: "Domain's DNS records have been verified.",
  DOMAIN_DOES_NOT_EXIST: 'Domain does not exist on your account.',
  INVITE_DOES_NOT_EXIST:
    'Invite does not exist with your email address for this domain.',
  DOMAIN_ALREADY_EXISTS: 'Domain already exists on your account.',
  ACCOUNT_DELETE_HAS_DOMAINS:
    'Your account is currently an admin of one or more domain names.  Please delete these domains or remove yourself from them to continue.',
  ACCOUNT_DELETE_SUCCESSFUL: 'Your account was successfully deleted.',
  PASSWORD_RESET_LIMIT:
    'You can only request a password reset every 30 minutes.  Please try again %s.',
  PASSWORD_RESET_SENT:
    'We have sent you an email with a link to reset your password.',
  TWO_FACTOR_RECOVERY_SUCCESS:
    'Recovery passcode successful. This passcode will no longer be valid.',
  REGISTERED: 'You have successfully registered.',
  SIGNED_IN: 'You have successfully signed in.',
  ALREADY_SIGNED_IN: 'You are already signed in.',
  REQUEST_OK: 'Your request was successfully completed.',
  REQUEST_TIMED_OUT:
    'Sorry, your request has timed out.  We have been alerted of this issue.  Please try again.',
  RESET_PASSWORD: 'You have successfully reset your password.',
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
    'Authentication is not possible.  No salt value was stored for the account.',
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
  ACCOUNT_BANNED: 'Your account has been banned.'
};
