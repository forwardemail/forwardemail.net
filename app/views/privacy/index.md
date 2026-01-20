# Privacy Policy

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" class="rounded-lg" />


## Table of Contents

* [Disclaimer](#disclaimer)
* [Information Not Collected](#information-not-collected)
* [Information Collected](#information-collected)
  * [Account Information](#account-information)
  * [Email Storage](#email-storage)
  * [Error Logs](#error-logs)
  * [Outbound SMTP Emails](#outbound-smtp-emails)
* [Temporary Data Processing](#temporary-data-processing)
  * [Rate Limiting](#rate-limiting)
  * [Connection Tracking](#connection-tracking)
  * [Authentication Attempts](#authentication-attempts)
* [Cookies and Sessions](#cookies-and-sessions)
* [Analytics](#analytics)
* [Information Shared](#information-shared)
* [Information Removal](#information-removal)
* [Additional Disclosures](#additional-disclosures)


## Disclaimer

Please defer to our [Terms](/terms) as it applies sitewide.


## Information Not Collected

**With the exception of [error logs](#error-logs), [outbound SMTP emails](#outbound-smtp-emails), and/or when spam or malicious activity is detected (e.g. for rate limiting):**

* We do not store any forwarded emails to disk storage nor databases.
* We do not store any metadata about forwarded emails to disk storage nor databases.
* We do not store any logs or IP addresses to disk storage nor databases.
* We do not use any third-party analytics or telemetry services.


## Information Collected

For transparency, at any time you can <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">view our source code</a> to see how the information below is collected and used.

**Strictly for functionality and to improve our service, we collect and store securely the following information:**

### Account Information

* We store your email address that you provide us with.
* We store your domain names, aliases, and configurations that you provide us with.
* Any additional information you voluntarily provide us, such as comments or questions submitted to us by email or on our <a href="/help">help</a> page.

**Signup attribution** (stored permanently on your account):

When you create an account, we store the following information to understand how users find our service:

* The referring website domain (not full URL)
* The first page you visited on our site
* UTM campaign parameters if present in the URL

### Email Storage

* We store emails and calendar information in your [encrypted SQLite database](/blog/docs/best-quantum-safe-encrypted-email-service) strictly for your IMAP/POP3/CalDAV/CardDAV access and mailbox functionality.
  * Note that if you are using our email forwarding services only, then no emails are stored to disk or database store as described in [Information Not Collected](#information-not-collected).
  * Our email forwarding services operate in-memory only (no writing to disk storage nor databases).
  * IMAP/POP3/CalDAV/CardDAV storage is encrypted-at-rest, encrypted-in-transit, and stored on a LUKS encrypted disk.
  * Backups for your IMAP/POP3/CalDAV/CardDAV storage is encrypted-at-rest, encrypted-in-transit, and stored on [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).

### Error Logs

* We store `4xx` and `5xx` SMTP response code [error logs](/faq#do-you-store-error-logs) for 7 days.
* Error logs contain the SMTP error, envelope, and email headers (we **do not** store the email body nor attachments).
* Error logs may contain IP addresses and hostnames of sending servers for debugging purposes.
* Error logs for [rate limiting](/faq#do-you-have-rate-limiting) and [greylisting](/faq#do-you-have-a-greylist) are not accessible since the connection ends early (e.g. before `RCPT TO` and `MAIL FROM` commands can be transmitted).

### Outbound SMTP Emails

* We store [outbound SMTP emails](/faq#do-you-support-sending-email-with-smtp) for \~30 days.
  * This length varies based off the "Date" header; since we allow emails to be sent in the future if a future "Date" header exists.
  * **Note that once an email is successfully delivered or permanently errors, then we will redact and purge the message body.**
  * If you would like to configure your outbound SMTP email message body to be retained longer than the default of 0 days (after successfully delivery or permanent error), then go to Advanced Settings for your domain and enter a value between `0` and `30`.
  * Some users enjoy using the [My Account > Emails](/my-account/emails) preview feature to see how their emails are rendered, therefore we support a configurable retention period.
  * Note that we also support [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).


## Temporary Data Processing

The following data is processed temporarily in-memory or Redis and is **not** permanently stored:

### Rate Limiting

* IP addresses are used temporarily in Redis for rate limiting purposes.
* Rate limiting data expires automatically (typically within 24 hours).
* This prevents abuse and ensures fair usage of our services.

### Connection Tracking

* Concurrent connection counts are tracked per IP address in Redis.
* This data expires automatically when connections close or after a short timeout.
* Used to prevent connection abuse and ensure service availability.

### Authentication Attempts

* Failed authentication attempts are tracked per IP address in Redis.
* This data expires automatically (typically within 24 hours).
* Used to prevent brute-force attacks on user accounts.


## Cookies and Sessions

* We store a cookie in a session for your website traffic.
* Cookies are HTTP-only, signed, and use SameSite protection.
* Session cookies expire after 30 days of inactivity.
* We do not create sessions for bots or crawlers.
* We use cookies for:
  * Authentication and login state
  * Two-factor authentication "remember me" functionality
  * Flash messages and notifications


## Analytics

We use our own privacy-focused analytics system to understand how our services are used. This system is designed with privacy as a core principle:

**What we do NOT collect:**

* We do not store IP addresses
* We do not use cookies or persistent identifiers for analytics
* We do not use any third-party analytics services
* We do not track users across days or sessions

**What we DO collect (anonymized):**

* Aggregated page views and service usage (SMTP, IMAP, POP3, API, etc.)
* Browser and operating system type (parsed from user agent, raw data discarded)
* Device type (desktop, mobile, tablet)
* Referrer domain (not full URL)
* Email client type for mail protocols (e.g. Thunderbird, Outlook)

**Data retention:**

* Analytics data is automatically deleted after 30 days
* Session identifiers rotate daily and cannot be used to track users across days


## Information Shared

We do not share your information with any third parties.

We may need to and will comply with court ordered legal requests (but keep in mind [we do not collect information mentioned above under "Information Not Collected"](#information-not-collected), so we will not be able to provide it to begin with).


## Information Removal

If at any time if you wish to remove information that you have provided us with, then go to <a href="/my-account/security">My Account > Security</a> and click "Delete Account".

Due to abuse prevention and mitigation, your account may require manual deletion review by our admins if you delete it within 5 days of your first payment.

This process usually takes less than 24 hours and was implemented due to users were spamming with our service, and then quickly deleting their accounts – which prevented us from blocking their payment method fingerprint(s) in Stripe.


## Additional Disclosures

This site is protected by Cloudflare and its [Privacy Policy](https://www.cloudflare.com/privacypolicy/) and [Terms of Service](https://www.cloudflare.com/website-terms/) apply.
