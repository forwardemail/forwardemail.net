# Privacy Policy

<!-- <img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" class="rounded-lg" /> -->


## Table of Contents

* [Disclaimer](#disclaimer)
* [Information Not Collected](#information-not-collected)
* [Information Collected](#information-collected)
  * [Account Information](#account-information)
  * [Email Storage](#email-storage)
  * [Error Logs](#error-logs)
  * [Server Logs](#server-logs)
  * [Outbound SMTP Emails](#outbound-smtp-emails)
* [Temporary Data Processing](#temporary-data-processing)
  * [Rate Limiting](#rate-limiting)
  * [Connection Tracking](#connection-tracking)
  * [Authentication Attempts](#authentication-attempts)
* [Audit Logs](#audit-logs)
  * [Account Changes](#account-changes)
  * [Domain Settings Changes](#domain-settings-changes)
* [Cookies and Sessions](#cookies-and-sessions)
* [Analytics](#analytics)
* [Apps and Webmail](#apps-and-webmail)
  * [Data on Your Device](#data-on-your-device)
  * [Data the Apps Send Us](#data-the-apps-send-us)
  * [Push Notifications](#push-notifications)
  * [Images and Links in Emails](#images-and-links-in-emails)
  * [Other Connections](#other-connections)
* [Information Shared](#information-shared)
* [Information Removal](#information-removal)
* [Additional Disclosures](#additional-disclosures)


## Disclaimer

Please defer to our [Terms](/terms) as it applies sitewide.


## Information Not Collected

**With the exception of the information expressly described in this policy (including [error logs](#error-logs), [server logs](#server-logs), [outbound SMTP emails](#outbound-smtp-emails), [account information](#account-information), [temporary data processing](#temporary-data-processing), [audit logs](#audit-logs), [cookies and sessions](#cookies-and-sessions), [analytics](#analytics), and [apps and webmail](#apps-and-webmail)):**

* We do not store any forwarded emails to disk storage nor databases.
* We do not store any metadata about forwarded emails to disk storage nor databases.
* Except as expressly described in this policy, we do not store logs or IP addresses to disk storage nor databases.
* We do not use any third-party analytics or telemetry services.


## Information Collected

For transparency, at any time you can <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">view our source code</a> to see how the information below is collected and used.

**Strictly for functionality and to improve our service, we collect and store securely the following information:**

### Account Information

* We store your email address that you provide us with.
* We store your domain names, aliases, and configurations that you provide us with.
* We store limited account security metadata needed to protect your account and manage access, including active website session identifiers, failed login attempt counters, and the timestamp of the last login attempt.
* Any additional information you voluntarily provide us, such as comments or questions submitted to us by email or on our <a href="/help">help</a> page.

**Signup attribution** (stored permanently on your account):

When you create an account, we store the following information to understand how users find our service:

* The referring website domain (not full URL)
* The first page you visited on our site, with values in its path such as domain names, IDs, and tokens replaced by placeholders
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
* We also store error logs for website and API requests that fail or take too long, and for errors on our IMAP, POP3, CalDAV, and CardDAV servers, for 7 days.
* These logs can contain the IP address, the request URL (including query strings such as search terms), request headers such as the user agent, and the account or alias involved.
* Passwords, API tokens, cookies, and request bodies are redacted from these logs before they are stored.

### Server Logs

* Our servers write a log line for each website and API request, which may include the IP address, the request method and URL (including query strings), request headers, the response status, and the signed-in account.
* We use these logs to find and fix problems and to stop abuse, and we keep them for up to 30 days.

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
* We also store limited account-level authentication metadata, including failed login attempt counters and the timestamp of the last login attempt.
* Redis-based authentication attempt data expires automatically (typically within 24 hours).
* Used to prevent brute-force attacks on user accounts.


## Audit Logs

To help you monitor and secure your account and domains, we maintain audit logs for certain changes. These logs are used to send notification emails to account holders and domain administrators.

### Account Changes

* We track changes to important account settings (e.g., two-factor authentication, display name, timezone).
* When changes are detected, we send an email notification to your registered email address.
* Sensitive fields (e.g., password, API tokens, recovery keys) are tracked but their values are redacted in notifications.
* Audit log entries are cleared after the notification email is sent.

### Domain Settings Changes

For domains with multiple administrators, we provide detailed audit logging to help teams track configuration changes:

**What we track:**

* Changes to domain settings (e.g., bounce webhooks, spam filtering, DKIM configuration)
* Who made the change (email address of the user)
* When the change was made (timestamp)
* The IP address from which the change was made
* The browser/client user-agent string

**How it works:**

* All domain administrators receive a single consolidated email notification when settings change.
* The notification includes a table showing each change with the user who made it, their IP address, and timestamp.
* Sensitive fields (e.g., webhook keys, API tokens, DKIM private keys) are tracked but their values are redacted.
* User-agent information is included in a collapsible "Technical Details" section.
* Audit log entries are cleared after the notification email is sent.

**Why we collect this:**

* To help domain administrators maintain security oversight
* To enable teams to audit who made configuration changes
* To assist with troubleshooting if unexpected changes occur
* To provide accountability for shared domain management


## Cookies and Sessions

* We store HTTP-only, signed cookies and server-side session data for your website traffic.
* Cookies use SameSite protection.
* We store active website session identifiers on your account to support features such as "log out other devices" and security-related session invalidation.
* Session cookies expire after 30 days of inactivity.
* We do not create sessions for bots or crawlers.
* We use cookies and sessions for:
  * Authentication and login state
  * Two-factor authentication "remember me" functionality
  * Flash messages and notifications
  * [Analytics](#analytics): the first page of your visit, the referrer domain, campaign (UTM) parameters, and a page count


## Analytics

We use our own privacy-focused analytics system to understand how our services are used. This system is designed with privacy as a core principle:

**What we do NOT collect:**

* We do not store IP addresses
* We do not set a separate cookie for analytics
* We do not use any third-party analytics services
* We do not track visitors across days or sessions when they are not signed in

**What we DO collect:**

* Aggregated page views and service usage (SMTP, IMAP, POP3, API, etc.)
* Browser and operating system type and version (parsed from user agent, raw data discarded)
* Device type (desktop, mobile, tablet)
* Referrer domain (not full URL) and campaign (UTM) parameters
* Email client type for mail protocols (e.g. Thunderbird, Outlook)
* The page or API path requested, with values in it such as domain names, IDs, and tokens replaced by placeholders, and whether the request succeeded
* For website visits, the first page of the visit and a page count, kept in your session (see [Cookies and Sessions](#cookies-and-sessions))
* When you are signed in, the ID of your account, alias, or domain, so we can see how each service is used and troubleshoot problems

**Data retention:**

* Analytics events are automatically deleted after 30 days
* Hourly totals, which are not linked to any account, are kept for 90 days
* Session identifiers rotate daily and cannot be used to track visitors across days


## Apps and Webmail

This section covers our email apps for iOS, Android, macOS, Windows, and Linux, and our webmail at <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a>, which share the same code. The apps contain no advertising or tracking code and no third-party analytics.

### Data on Your Device

* The apps store your emails, contacts, calendars, settings, and sign-in details on your device, so they load quickly and work offline.
* If you turn on App Lock, the app encrypts stored email content, contacts, and sign-in details with a key protected by your PIN or passkey. Dates, folders, labels, and flags stay unencrypted so the app can sort and count your emails.
* Signing out of an account removes its data from your device.

### Data the Apps Send Us

* Your alias email address and password, with each request, to sign you in.
* The emails, contacts, calendars, labels, and filters you send, create, or change. We store emails, contacts, and calendars as described in [Email Storage](#email-storage), and emails you send as described in [Outbound SMTP Emails](#outbound-smtp-emails).
* Your search terms, so we can search your mailbox on our servers. Search terms are part of the request URL, so they can appear in [error logs](#error-logs) and [server logs](#server-logs).
* Feedback you choose to send from the app, which is emailed from your alias to our support team with any diagnostic details you choose to include.
* Emails you report as spam, which the app forwards to our abuse team (or to another address you set in Settings).

### Push Notifications

* When you allow notifications, the app registers a push token with us. We store it with the platform, the alias and account it is for, the time of its last delivery, and a device name taken from the app's user agent, which includes your operating system version and, on Android, your device model.
* We keep a push token for up to one year after its last use. We delete it sooner when you sign out of the app, when delivery fails three times in a row, when the alias password changes, when you delete the alias or your account, or when the alias moves to another owner.
* On iOS and macOS, notifications go through Apple Push Notification service. In our Android app from Google Play, they go through Firebase Cloud Messaging. New-mail notifications include the sender's name and address, the subject, a short preview, and the folder name, also for mail that arrives without an alert, such as mail filed into Junk or Sent. When emails, calendars, or contacts change, we also send silent notifications with identifiers but no email content, so the app stays up to date.
* With [UnifiedPush](https://unifiedpush.org/) on Android, and with notifications in a web browser, each notification is encrypted so that only your device can read it.
* Our Android app from Google Play includes Firebase Cloud Messaging, which sends Google a Firebase installation ID, the app version, and device and SDK details. Our Google-free Android app from GitHub does not include Firebase.

### Images and Links in Emails

* Images in emails load from the sender's servers, which can see your IP address and when the images were loaded.
* The apps block tracking pixels by default. You can also block all external images under Settings > Privacy & Security, then load them for one email at a time.
* Links in emails open in your web browser.

### Other Connections

* Our webmail asks GitHub for its latest version when it loads, when you return to it, and every 10 minutes while it is open. About & Help asks GitHub for the latest desktop release, and the desktop apps check GitHub for updates. GitHub receives your IP address with these requests.


## Information Shared

We do not share your information with any third parties, except service providers that run parts of our service, such as Cloudflare (website protection and encrypted backups), Stripe and PayPal (payments), and the services that deliver push notifications to your devices (see [Push Notifications](#push-notifications)).

We may need to and will comply with court ordered legal requests (but keep in mind [we do not collect information mentioned above under "Information Not Collected"](#information-not-collected), so we will not be able to provide it to begin with).


## Information Removal

If at any time if you wish to remove information that you have provided us with, then go to <a href="/my-account/security">My Account > Security</a> and click "Delete Account".

Due to abuse prevention and mitigation, your account may require manual deletion review by our admins if you delete it within 5 days of your first payment.

This process usually takes less than 24 hours and was implemented due to users were spamming with our service, and then quickly deleting their accounts – which prevented us from blocking their payment method fingerprint(s) in Stripe.

Deleting your account also deletes the domains you administer, your aliases, and the push tokens registered for them. The account record itself stays, with its email address, billing details, password, and passkeys removed and its two-factor authentication and API token revoked, and we keep its payment records for refunds and accounting. Logs and analytics data that reference your account are deleted on the schedules above.

To remove the apps' data from a device, sign out of the app or uninstall it.


## Additional Disclosures

This site is protected by Cloudflare and its [Privacy Policy](https://www.cloudflare.com/privacypolicy/) and [Terms of Service](https://www.cloudflare.com/website-terms/) apply.
