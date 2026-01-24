# Frequently Asked Questions

<img loading="lazy" src="/img/articles/faq.webp" alt="Forward Email frequently asked questions" class="rounded-lg" />


## Table of Contents

* [Quick Start](#quick-start)
* [Introduction](#introduction)
  * [What is Forward Email](#what-is-forward-email)
  * [Who uses Forward Email](#who-uses-forward-email)
  * [What is Forward Email's history](#what-is-forward-emails-history)
  * [How fast is this service](#how-fast-is-this-service)
* [Email Clients](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [Mobile Devices](#mobile-devices)
  * [Sendmail SMTP Relay Configuration](#sendmail-smtp-relay-configuration)
  * [Exim4 SMTP Relay Configuration](#exim4-smtp-relay-configuration)
  * [msmtp SMTP Client Configuration](#msmtp-smtp-client-configuration)
  * [Command-line Email Clients](#command-line-email-clients)
  * [Windows Email Configuration](#windows-email-configuration)
  * [Postfix SMTP Relay Configuration](#postfix-smtp-relay-configuration)
  * [How to Send Mail As using Gmail](#how-to-send-mail-as-using-gmail)
  * [What is the legacy free guide for Send Mail As using Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Advanced Gmail Routing Configuration](#advanced-gmail-routing-configuration)
  * [Advanced Outlook Routing Configuration](#advanced-outlook-routing-configuration)
* [Troubleshooting](#troubleshooting)
  * [Why am I not receiving my test emails](#why-am-i-not-receiving-my-test-emails)
  * [How do I configure my email client to work with Forward Email](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Why are my emails landing in Spam and Junk and how can I check my domain reputation](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [What should I do if I receive spam emails](#what-should-i-do-if-i-receive-spam-emails)
  * [Why are my test emails sent to myself in Gmail showing as "suspicious"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Can I remove the via forwardemail dot net in Gmail](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Data Management](#data-management)
  * [Where are your servers located](#where-are-your-servers-located)
  * [How do I export and backup my mailbox](#how-do-i-export-and-backup-my-mailbox)
  * [How do I import and migrate my existing mailbox](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Do you support self-hosting](#do-you-support-self-hosting)
* [Email Configuration](#email-configuration)
  * [How do I get started and set up email forwarding](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Can I use multiple MX exchanges and servers for advanced forwarding](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [How do I set up a vacation responder (out of office auto-responder)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [How do I set up SPF for Forward Email](#how-do-i-set-up-spf-for-forward-email)
  * [How do I set up DKIM for Forward Email](#how-do-i-set-up-dkim-for-forward-email)
  * [How do I set up DMARC for Forward Email](#how-do-i-set-up-dmarc-for-forward-email)
  * [How do I view DMARC Reports](#how-do-i-view-dmarc-reports)
  * [How do I connect and configure my contacts](#how-do-i-connect-and-configure-my-contacts)
  * [How do I connect and configure my calendars](#how-do-i-connect-and-configure-my-calendars)
  * [How do I add more calendars and manage existing calendars](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [How do I connect and configure tasks and reminders](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [Why can't I create tasks in macOS Reminders](#why-cant-i-create-tasks-in-macos-reminders)
  * [How do I set up Tasks.org on Android](#how-do-i-set-up-tasksorg-on-android)
  * [How do I set up SRS for Forward Email](#how-do-i-set-up-srs-for-forward-email)
  * [How do I set up MTA-STS for Forward Email](#how-do-i-set-up-mta-sts-for-forward-email)
  * [How do I add a profile picture to my email address](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Advanced Features](#advanced-features)
  * [Do you support newsletters or mailing lists for marketing related email](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Do you support sending email with API](#do-you-support-sending-email-with-api)
  * [Do you support receiving email with IMAP](#do-you-support-receiving-email-with-imap)
  * [Do you support POP3](#do-you-support-pop3)
  * [Do you support calendars (CalDAV)](#do-you-support-calendars-caldav)
  * [Do you support tasks and reminders (CalDAV VTODO)](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [Do you support contacts (CardDAV)](#do-you-support-contacts-carddav)
  * [Do you support sending email with SMTP](#do-you-support-sending-email-with-smtp)
  * [Do you support OpenPGP/MIME, end-to-end encryption ("E2EE"), and Web Key Directory ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Do you support S/MIME encryption](#do-you-support-smime-encryption)
  * [Do you support Sieve email filtering](#do-you-support-sieve-email-filtering)
  * [Do you support MTA-STS](#do-you-support-mta-sts)
  * [Do you support passkeys and WebAuthn](#do-you-support-passkeys-and-webauthn)
  * [Do you support email best practices](#do-you-support-email-best-practices)
  * [Do you support bounce webhooks](#do-you-support-bounce-webhooks)
  * [Do you support webhooks](#do-you-support-webhooks)
  * [Do you support regular expressions or regex](#do-you-support-regular-expressions-or-regex)
  * [What are your outbound SMTP limits](#what-are-your-outbound-smtp-limits)
  * [Do I need approval to enable SMTP](#do-i-need-approval-to-enable-smtp)
  * [What are your SMTP server configuration settings](#what-are-your-smtp-server-configuration-settings)
  * [What are your IMAP server configuration settings](#what-are-your-imap-server-configuration-settings)
  * [What are your POP3 server configuration settings](#what-are-your-pop3-server-configuration-settings)
* [Security](#security)
  * [Advanced Server Hardening Techniques](#advanced-server-hardening-techniques)
  * [Do you have SOC 2 or ISO 27001 certifications](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Do you use TLS encryption for email forwarding](#do-you-use-tls-encryption-for-email-forwarding)
  * [Do you preserve email authentication headers](#do-you-preserve-email-authentication-headers)
  * [Do you preserve original email headers and prevent spoofing](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [How do you protect against spam and abuse](#how-do-you-protect-against-spam-and-abuse)
  * [Do you store email content on disk](#do-you-store-email-content-on-disk)
  * [Can email content be exposed during system crashes](#can-email-content-be-exposed-during-system-crashes)
  * [Who has access to your email infrastructure](#who-has-access-to-your-email-infrastructure)
  * [What infrastructure providers do you use](#what-infrastructure-providers-do-you-use)
  * [Do you offer a Data Processing Agreement (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [How do you handle data breach notifications](#how-do-you-handle-data-breach-notifications)
  * [Do you offer a test environment](#do-you-offer-a-test-environment)
  * [Do you provide monitoring and alerting tools](#do-you-provide-monitoring-and-alerting-tools)
  * [How do you ensure high availability](#how-do-you-ensure-high-availability)
  * [Are you compliant with Section 889 of the National Defense Authorization Act (NDAA)](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [System and Technical Details](#system-and-technical-details)
  * [Do you store emails and their contents](#do-you-store-emails-and-their-contents)
  * [How does your email forwarding system work](#how-does-your-email-forwarding-system-work)
  * [How do you process an email for forwarding](#how-do-you-process-an-email-for-forwarding)
  * [How do you handle email delivery issues](#how-do-you-handle-email-delivery-issues)
  * [How do you handle your IP addresses becoming blocked](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [What are postmaster addresses](#what-are-postmaster-addresses)
  * [What are no-reply addresses](#what-are-no-reply-addresses)
  * [What are your server's IP addresses](#what-are-your-servers-ip-addresses)
  * [Do you have an allowlist](#do-you-have-an-allowlist)
  * [What domain name extensions are allowlisted by default](#what-domain-name-extensions-are-allowlisted-by-default)
  * [What is your allowlist criteria](#what-is-your-allowlist-criteria)
  * [What domain name extensions can be used for free](#what-domain-name-extensions-can-be-used-for-free)
  * [Do you have a greylist](#do-you-have-a-greylist)
  * [Do you have a denylist](#do-you-have-a-denylist)
  * [Do you have rate limiting](#do-you-have-rate-limiting)
  * [How do you protect against backscatter](#how-do-you-protect-against-backscatter)
  * [Prevent bounces from known MAIL FROM spammers](#prevent-bounces-from-known-mail-from-spammers)
  * [Prevent unnecessary bounces to protect against backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [How do you determine an email fingerprint](#how-do-you-determine-an-email-fingerprint)
  * [Can I forward emails to ports other than 25 (e.g. if my ISP has blocked port 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Does it support the plus + symbol for Gmail aliases](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Does it support sub-domains](#does-it-support-sub-domains)
  * [Does this forward my email's headers](#does-this-forward-my-emails-headers)
  * [Is this well-tested](#is-this-well-tested)
  * [Do you pass along SMTP response messages and codes](#do-you-pass-along-smtp-response-messages-and-codes)
  * [How do you prevent spammers and ensure good email forwarding reputation](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [How do you perform DNS lookups on domain names](#how-do-you-perform-dns-lookups-on-domain-names)
* [Account and Billing](#account-and-billing)
  * [Do you offer a money back guarantee on paid plans](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [If I switch plans do you pro-rate and refund the difference](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Can I just use this email forwarding service as a "fallback" or "fallover" MX server](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Can I disable specific aliases](#can-i-disable-specific-aliases)
  * [Can I forward emails to multiple recipients](#can-i-forward-emails-to-multiple-recipients)
  * [Can I have multiple global catch-all recipients](#can-i-have-multiple-global-catch-all-recipients)
  * [Is there a maximum limit on the number of email addresses I can forward to per alias](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Can I recursively forward emails](#can-i-recursively-forward-emails)
  * [Can people unregister or register my email forwarding without my permission](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [How is it free](#how-is-it-free)
  * [What is the max email size limit](#what-is-the-max-email-size-limit)
  * [Do you store logs of emails](#do-you-store-logs-of-emails)
  * [Do you store error logs](#do-you-store-error-logs)
  * [Do you read my emails](#do-you-read-my-emails)
  * [Can I "send mail as" in Gmail with this](#can-i-send-mail-as-in-gmail-with-this)
  * [Can I "send mail as" in Outlook with this](#can-i-send-mail-as-in-outlook-with-this)
  * [Can I "send mail as" in Apple Mail and iCloud Mail with this](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Can I forward unlimited emails with this](#can-i-forward-unlimited-emails-with-this)
  * [Do you offer unlimited domains for one price](#do-you-offer-unlimited-domains-for-one-price)
  * [Which payment methods do you accept](#which-payment-methods-do-you-accept)
* [Additional Resources](#additional-resources)


## Quick Start

To get started with Forward Email:

1. **Create an account** at [forwardemail.net/register](https://forwardemail.net/register)

2. **Add and verify your domain** under [My Account → Domains](/my-account/domains)

3. **Add and configure email aliases/mailboxes** under [My Account → Domains](/my-account/domains) → Aliases

4. **Test your setup** by sending an email to one of your new aliases

> \[!TIP]
> DNS changes can take up to 24-48 hours to propagate globally, though they often take effect much sooner.

> \[!IMPORTANT]
> For enhanced deliverability, we recommend setting up [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), and [DMARC](#how-do-i-set-up-dmarc-for-forward-email) records.


## Introduction

### What is Forward Email

> \[!NOTE]
> Forward Email is perfect for individuals, small businesses, and developers who want professional email addresses without the cost and maintenance of a full email hosting solution.

Forward Email is a **fully featured email service provider** and **email hosting provider for custom domain names**.

It's the only free and open-source service, and lets you use custom domain email addresses without the complexity of setting up and maintaining your own email server.

Our service forwards emails sent to your custom domain to your existing email account – and you can even use us as your dedicated email hosting provider.

Key features of Forward Email:

* **Custom Domain Email**: Use professional email addresses with your own domain name
* **Free Tier**: Basic email forwarding at no cost
* **Enhanced Privacy**: We don't read your emails or sell your data
* **Open Source**: Our entire codebase is available on GitHub
* **SMTP, IMAP, and POP3 Support**: Full email sending and receiving capabilities
* **End-to-End Encryption**: Support for OpenPGP/MIME
* **Custom Catch-All Aliases**: Create unlimited email aliases

You can compare us to 56+ other email service providers on [our Email Comparison page](/blog/best-email-service).

> \[!TIP]
> Learn more about Forward Email by reading our free [Technical Whitepaper](/technical-whitepaper.pdf)

### Who uses Forward Email

We provide email hosting and email forwarding service to 500,000+ domains and these notable users:

| Customer                                 | Case Study                                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| U.S. Naval Academy                       | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant)         |
| Canonical                                | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Netflix Games                            |                                                                                                          |
| The Linux Foundation                     | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| The PHP Foundation                       |                                                                                                          |
| Fox News Radio                           |                                                                                                          |
| Disney Ad Sales                          |                                                                                                          |
| jQuery                                   | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| LineageOS                                |                                                                                                          |
| Ubuntu                                   | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Kubuntu                                  | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Lubuntu                                  | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| The University of Cambridge              | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| The University of Maryland               | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| The University of Washington             | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Tufts University                         | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Swarthmore College                       | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Government of South Australia            |                                                                                                          |
| Government of Dominican Republic         |                                                                                                          |
| Fly<span>.</span>io                      |                                                                                                          |
| RCD Hotels                               |                                                                                                          |
| Isaac Z. Schlueter (npm)                 | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |                                                                                                          |

### What is Forward Email's history

You can learn more about Forward Email on [our About page](/about).

### How fast is this service

> \[!NOTE]
> Our system is designed for speed and reliability, with multiple redundant servers to ensure your emails are delivered promptly.

Forward Email delivers messages with minimal delay, typically within seconds of receipt.

Performance metrics:

* **Average Delivery Time**: Less than 5-10 seconds from receipt to forwarding ([see our Time to Inbox "TTI" monitoring page](/tti))
* **Uptime**: 99.9%+ service availability
* **Global Infrastructure**: Servers strategically located for optimal routing
* **Automatic Scaling**: Our system scales during peak email periods

We operate in real-time, unlike other providers which rely upon delayed queues.

We do not write to disk or store logs – with the [exception of errors](#do-you-store-error-logs) and [outbound SMTP](#do-you-support-sending-email-with-smtp) (see our [Privacy Policy](/privacy)).

Everything is done in-memory and [our source code is on GitHub](https://github.com/forwardemail).


## Email Clients

### Thunderbird

1. Create a new alias and generate a password in your Forward Email dashboard
2. Open Thunderbird and go to **Edit → Account Settings → Account Actions → Add Mail Account**
3. Enter your name, Forward Email address, and password
4. Click **Configure manually** and enter:
   * Incoming: IMAP, `imap.forwardemail.net`, port 993, SSL/TLS
   * Outgoing: SMTP, `smtp.forwardemail.net`, port 587, STARTTLS
5. Click **Done**

### Microsoft Outlook

1. Create a new alias and generate a password in your Forward Email dashboard
2. Go to **File → Add Account**
3. Enter your Forward Email address and click **Connect**
4. Choose **Advanced options** and select **Let me set up my account manually**
5. Select **IMAP** and enter:
   * Incoming: `imap.forwardemail.net`, port 993, SSL
   * Outgoing: `smtp.forwardemail.net`, port 587, TLS
   * Username: Your full email address
   * Password: Your generated password
6. Click **Connect**

### Apple Mail

1. Create a new alias and generate a password in your Forward Email dashboard
2. Go to **Mail → Preferences → Accounts → +**
3. Select **Other Mail Account**
4. Enter your name, Forward Email address, and password
5. For server settings, enter:
   * Incoming: `imap.forwardemail.net`
   * Outgoing: `smtp.forwardemail.net`
   * Username: Your full email address
   * Password: Your generated password
6. Click **Sign In**

### eM Client

1. Create a new alias and generate a password in your Forward Email dashboard
2. Open eM Client and go to **Menu → Accounts → + Add Account**
3. Click on **Mail** and then select **Other**
4. Enter your Forward Email address and click **Next**
5. Enter the following server settings:
   * **Incoming server**: `imap.forwardemail.net`
   * **Outgoing server**: `smtp.forwardemail.net`
6. Enter your full email address as the **User name** and your generated password as the **Password** for both incoming and outgoing servers.
7. eM Client will test the connection. Once it passes, click **Next**.
8. Enter your name and choose an account name.
9. Click **Finish**.

### Mobile Devices

For iOS:

1. Go to **Settings → Mail → Accounts → Add Account → Other**
2. Tap **Add Mail Account** and enter your details
3. For server settings, use the same IMAP and SMTP settings as above

For Android:

1. Go to **Settings → Accounts → Add Account → Personal (IMAP)**
2. Enter your Forward Email address and password
3. For server settings, use the same IMAP and SMTP settings as above

### Sendmail SMTP Relay Configuration

You can configure Sendmail to relay emails through Forward Email's SMTP servers. This is a common setup for legacy systems or applications that rely on Sendmail.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimated Setup Time:</strong>
  <span>Less than 20 minutes</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    This requires a paid plan with SMTP access enabled.
  </span>
</div>

#### Configuration

1. Edit your `sendmail.mc` file, typically located at `/etc/mail/sendmail.mc`:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. Add the following lines to define the smart host and authentication:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 587')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. Create the authentication file `/etc/mail/authinfo`:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. Add your Forward Email credentials to the `authinfo` file:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. Generate the authentication database and secure the files:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Rebuild the Sendmail configuration and restart the service:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### Testing

Send a test email to verify the configuration:

```bash
echo "Test email from Sendmail" | mail -s "Sendmail Test" recipient@example.com
```

### Exim4 SMTP Relay Configuration

Exim4 is a popular MTA on Debian-based systems. You can configure it to use Forward Email as a smarthost.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimated Setup Time:</strong>
  <span>Less than 15 minutes</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    This requires a paid plan with SMTP access enabled.
  </span>
</div>

#### Configuration

1. Run the Exim4 configuration tool:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. Select the following options:
   * **General type of mail configuration:** mail sent by smarthost; received via SMTP or fetchmail
   * **System mail name:** your.hostname
   * **IP-addresses to listen on for incoming SMTP connections:** 127.0.0.1 ; ::1
   * **Other destinations for which mail is accepted:** (leave blank)
   * **Domains to relay mail for:** (leave blank)
   * **IP address or host name of the outgoing smarthost:** smtp.forwardemail.net::587
   * **Hide local mail name in outgoing mail?** No
   * **Keep number of DNS-queries minimal (Dial-on-Demand)?** No
   * **Delivery method for local mail:** Mbox format in /var/mail/
   * **Split configuration into small files?** No

3. Edit the `passwd.client` file to add your credentials:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. Add the following line:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. Update the configuration and restart Exim4:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### Testing

Send a test email:

```bash
echo "Test from Exim4" | mail -s "Exim4 Test" recipient@example.com
```

### msmtp SMTP Client Configuration

msmtp is a lightweight SMTP client that's useful for sending emails from scripts or command-line applications.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimated Setup Time:</strong>
  <span>Less than 10 minutes</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    This requires a paid plan with SMTP access enabled.
  </span>
</div>

#### Configuration

1. Create or edit the msmtp configuration file at `~/.msmtprc`:

   ```bash
   nano ~/.msmtprc
   ```

2. Add the following configuration:

   ```
   defaults
   auth           on
   tls            on
   tls_trust_file /etc/ssl/certs/ca-certificates.crt
   logfile        ~/.msmtp.log

   account        forwardemail
   host           smtp.forwardemail.net
   port           587
   from           your-alias@yourdomain.com
   user           your-alias@yourdomain.com
   password       your-generated-password

   account default : forwardemail
   ```

3. Set the correct permissions for the configuration file:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### Testing

Send a test email:

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### Command-line Email Clients

Popular command-line email clients like [Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org), and [Alpine](https://alpine.x10.mx/alpine/release/) can be configured to use Forward Email's SMTP servers for sending mail. The configuration will be similar to the `msmtp` setup, where you provide the SMTP server details and your credentials in the respective configuration files (`.muttrc`, `.neomuttrc`, or `.pinerc`).

### Windows Email Configuration

For Windows users, you can configure popular email clients like **Microsoft Outlook** and **eM Client** using the IMAP and SMTP settings provided in your Forward Email account. For command-line or scripting use, you can use PowerShell's `Send-MailMessage` cmdlet (though it is considered obsolete) or a lightweight SMTP relay tool like [E-MailRelay](https://github.com/graeme-walker/emailrelay).

### Postfix SMTP Relay Configuration

You can configure Postfix to relay emails through Forward Email's SMTP servers. This is useful for server applications that need to send emails.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimated Setup Time:</strong>
  <span>Less than 15 minutes</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    This requires a paid plan with SMTP access enabled.
  </span>
</div>

#### Installation

1. Install Postfix on your server:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. During installation, select "Internet Site" when prompted for configuration type.

#### Configuration

1. Edit the main Postfix configuration file:

```bash
sudo nano /etc/postfix/main.cf
```

2. Add or modify these settings:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Create the SASL password file:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Add your Forward Email credentials:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. Secure and hash the password file:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Restart Postfix:

```bash
sudo systemctl restart postfix
```

#### Testing

Test your configuration by sending a test email:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

### How to Send Mail As using Gmail

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimated Setup Time:</strong>
  <span>Less than 10 minutes</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Getting Started:
  </strong>
  <span>
    If you've followed the instructions above under <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">How do I get started and set up email forwarding</a>, then you can continue reading below.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    Please ensure you have read our <a href="/terms" class="alert-link" target="_blank">Terms</a>, <a href="/privacy" class="alert-link" target="_blank">Privacy Policy</a>, and <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Outbound SMTP Limits</a> &ndash; your use is considered acknowledgement and agreement.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    If you are a developer, then refer to our <a class="alert-link" href="/email-api#outbound-emails" target="_blank">email API docs</a>.
  </span>
</div>

1. Go to <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Settings <i class="fa fa-angle-right"></i> Outbound SMTP Configuration and follow setup instructions

2. Create a new alias for your domain under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliases (e.g. <code><hello@example.com></code>)

3. Click on <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> next to the newly created alias.  Copy to your clipboard and securely store the generated password shown on the screen.

4. Go to [Gmail](https://gmail.com) and under [Settings <i class="fa fa-angle-right"></i> Accounts and Import <i class="fa fa-angle-right"></i> Send mail as](https://mail.google.com/mail/u/0/#settings/accounts), click "Add another email address"

5. When prompted for "Name", enter the name that you want your email to be seen as "From" (e.g. "Linus Torvalds").

6. When prompted for "Email address", enter the full email address of an alias you created under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliases (e.g. <code><hello@example.com></code>)

7. Uncheck "Treat as an alias"

8. Click "Next Step" to proceed

9. When prompted for "SMTP Server", enter <code>smtp.forwardemail.net</code> and leave the port as <code>587</code>

10. When prompted for "Username", enter the full email address of an alias you created under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliases (e.g. <code><hello@example.com></code>)

11. When prompted for "Password", paste the password from <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> in step 3 above

12. Leave the radio button checked for "Secured connection using TLS"

13. Click "Add Account" to proceed

14. Open a new tab to [Gmail](https://gmail.com) and wait for your verification email to arrive (you will receive a verification code that confirms you are the owner of the email address you are attempting to "Send Mail As")

15. Once it arrives, copy and paste the verification code at the prompt you received in the previous step

16. Once you've done that, go back to the email and click the link to "confirm the request". You will most likely need to do this step and the previous step for the email to be correctly configured.

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Congratulations!
    </strong>
    <span>
      You've successfully completed all steps.
    </span>
  </div>
</div>

</div>

### What is the legacy free guide for Send Mail As using Gmail

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Important:</strong> This legacy free guide is deprecated as of May 2023 since <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we now support outbound SMTP</a>. If you use the guide below, then <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this will cause your outbound email</a> to say "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" in Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimated Setup Time:</strong>
  <span>Less than 10 minutes</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Getting Started:
  </strong>
  <span>
    If you've followed the instructions above under <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">How do I get started and set up email forwarding</a>, then you can continue reading below.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. You need to have [Gmail's Two-Factor Authentication][gmail-2fa] enabled for this to work.  Visit <https://www.google.com/landing/2step/> if you do not have it enabled.

2. Once Two-Factor Authentication is enabled (or if you already had it enabled), then visit <https://myaccount.google.com/apppasswords>.

3. When prompted for "Select the app and device you want to generate the app password for":
   * Select "Mail" under the drop-down for "Select app"
   * Select "Other" under the drop-down for "Select device"
   * When prompted for text input, enter your custom domain's email address you're forwarding from (e.g. <code><hello@example.com></code> - this will help you keep track in case you use this service for multiple accounts)

4. Copy the password to your clipboard that is automatically generated
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Important:
     </strong>
     <span>
       If you are using G Suite, visit your admin panel <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Apps <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Settings for Gmail <i class="fa fa-angle-right"></i> Settings</a> and make sure to check "Allow users to send mail through an external SMTP server...". There will be some delay for this change to be activated, so please wait a few minutes.
     </span>
   </div>

5. Go to [Gmail](https://gmail.com) and under [Settings <i class="fa fa-angle-right"></i> Accounts and Import <i class="fa fa-angle-right"></i> Send mail as](https://mail.google.com/mail/u/0/#settings/accounts), click "Add another email address"

6. When prompted for "Name", enter the name that you want your email to be seen as "From" (e.g. "Linus Torvalds")

7. When prompted for "Email address", enter the email address with the custom domain you used above (e.g. <code><hello@example.com></code>)

8. Uncheck "Treat as an alias"

9. Click "Next Step" to proceed

10. When prompted for "SMTP Server", enter <code>smtp.gmail.com</code> and leave the port as <code>587</code>

11. When prompted for "Username", enter the portion of your Gmail address without the <span>gmail.com</span> part (e.g. just "user" if my email is <span><user@gmail.com></span>)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        Important:
      </strong>
      <span>
        If the "Username" portion is autofilled, then <u><strong>you will need to change this</strong></u> to the username portion of your Gmail address instead.
      </span>
    </div>

12. When prompted for "Password", paste from your clipboard the password you generated in step 2 above

13. Leave the radio button checked for "Secured connection using TLS"

14. Click "Add Account" to proceed

15. Open a new tab to [Gmail](https://gmail.com) and wait for your verification email to arrive (you will receive a verification code that confirms you are the owner of the email address you are attempting to "Send Mail As")

16. Once it arrives, copy and paste the verification code at the prompt you received in the previous step

17. Once you've done that, go back to the email and click the link to "confirm the request". You will most likely need to do this step and the previous step for the email to be correctly configured.

</div>

### Advanced Gmail Routing Configuration

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimated Setup Time:</strong>
  <span>15-30 minutes</span>
</div>

If you want to set up advanced routing in Gmail so that aliases that don't match a mailbox will forward to Forward Email's mail exchanges, follow these steps:

1. Log in to your Google Admin console at [admin.google.com](https://admin.google.com)
2. Go to **Apps → Google Workspace → Gmail → Routing**
3. Click on **Add Route** and configure the following settings:

**Single Recipient Settings:**

* Select "Change envelope recipient" and enter your primary Gmail address
* Check "Add X-Gm-Original-To header with original recipient"

**Envelope Recipient Patterns:**

* Add a pattern that matches all non-existent mailboxes (e.g., `.*@yourdomain.com`)

**Email Server Settings:**

* Select "Route to host" and enter `mx1.forwardemail.net` as the primary server
* Add `mx2.forwardemail.net` as the backup server
* Set port to 25
* Select "Require TLS" for security

4. Click **Save** to create the route

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    This configuration will only work for Google Workspace accounts with custom domains, not for regular Gmail accounts.
  </span>
</div>

### Advanced Outlook Routing Configuration

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimated Setup Time:</strong>
  <span>15-30 minutes</span>
</div>

For Microsoft 365 (formerly Office 365) users who want to set up advanced routing so that aliases that don't match a mailbox will forward to Forward Email's mail exchanges:

1. Log in to the Microsoft 365 admin center at [admin.microsoft.com](https://admin.microsoft.com)
2. Go to **Exchange → Mail flow → Rules**
3. Click **Add a rule** and select **Create a new rule**
4. Name your rule (e.g., "Forward non-existent mailboxes to Forward Email")
5. Under **Apply this rule if**, select:
   * "The recipient address matches..."
   * Enter a pattern that matches all addresses at your domain (e.g., `*@yourdomain.com`)
6. Under **Do the following**, select:
   * "Redirect the message to..."
   * Choose "The following mail server"
   * Enter `mx1.forwardemail.net` and port 25
   * Add `mx2.forwardemail.net` as a backup server
7. Under **Except if**, select:
   * "The recipient is..."
   * Add all your existing mailboxes that should not be forwarded
8. Set the rule priority to ensure it runs after other mail flow rules
9. Click **Save** to activate the rule


## Troubleshooting

### Why am I not receiving my test emails

If you're sending a test email to yourself, then it may not show up in your inbox because it has the same "Message-ID" header.

This is a widely known issue, and also affects services such as Gmail.  <a href="https://support.google.com/a/answer/1703601">Here is the official Gmail answer regarding this issue</a>.

If you continue to have issues, then it is most likely to be an issue with DNS propagation.  You will need to wait a bit longer and try again (or try setting a lower TTL value on your <strong class="notranslate">TXT</strong> records).

**Still having issues?**  Please <a href="/help">contact us</a> so we can help investigate the issue and find a quick resolution.

### How do I configure my email client to work with Forward Email

<div class="mb-3">
  Our service works with popular email clients such as:
  <ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
    <li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Desktop</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Terminal</a></li>
  </ul>
</div>

<div class="alert alert-primary">
  Your username is your alias' email address and password is from <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ("Normal Password").
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>If you are using Thunderbird, then ensure "Connection security" is set to "SSL/TLS" and Authentication method is set to "Normal password".</span>
</div>

| Type |         Hostname        |                 Protocol                |                                         Ports                                        |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` |          SSL/TLS **Preferred**          |                                   `993` and `2993`                                   |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Preferred** or TLS (STARTTLS) | `465` and `2465` for SSL/TLS (or) `587`, `2587`, `2525`, and `25` for TLS (STARTTLS) |

### Why are my emails landing in Spam and Junk and how can I check my domain reputation

This section guides you if your outbound mail is using our SMTP servers (e.g. `smtp.forwardemail.net`) (or forwarded via `mx1.forwardemail.net` or `mx2.forwardemail.net`) and it is being delivered in the Spam or Junk folder of recipients.

We routinely monitor our [IP addresses](#what-are-your-servers-ip-addresses) against [all reputable DNS denylists](#how-do-you-handle-your-ip-addresses-becoming-blocked), **therefore it is most likely a domain-reputation specific issue**.

Emails can land in spam folders for several reasons:

1. **Missing Authentication**: Set up [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), and [DMARC](#how-do-i-set-up-dmarc-for-forward-email) records.

2. **Domain Reputation**: New domains often have neutral reputation until they establish a sending history.

3. **Content Triggers**: Certain words or phrases can trigger spam filters.

4. **Sending Patterns**: Sudden increases in email volume can look suspicious.

You can try to use one or more of these tools to check your domain's reputation and categorization:

#### Reputation and Blocklist Check Tools

| Tool Name                                   | URL                                                          | Type                   |
| ------------------------------------------- | ------------------------------------------------------------ | ---------------------- |
| Cloudflare Domain Categorization Feedback   | <https://radar.cloudflare.com/domains/feedback>              | Categorization         |
| Spamhaus IP and Domain Reputation Checker   | <https://check.spamhaus.org/>                                | DNSBL                  |
| Cisco Talos IP and Domain Reputation Center | <https://talosintelligence.com/reputation_center>            | Reputation             |
| Barracuda IP and Domain Reputation Lookup   | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| MX Toolbox Blacklist Check                  | <https://mxtoolbox.com/blacklists.aspx>                      | Blacklist              |
| Google Postmaster Tools                     | <https://www.gmail.com/postmaster/>                          | Reputation             |
| Yahoo Sender Hub                            | <https://senders.yahooinc.com/>                              | Reputation             |
| MultiRBL.valli.org Blacklist Check          | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                                | <https://senderscore.org/act/blocklist-remover/>             | Reputation             |
| Invaluement                                 | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                       | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                     | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| UCEPROTECT's Levels 1, 2, and 3             | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| UCEPROTECT's backscatterer.org              | <https://www.backscatterer.org/>                             | Backscatter Protection |
| UCEPROTECT's whitelisted.org                | <https://www.whitelisted.org/> (requires a fee)              | DNSWL                  |

#### IP Removal Request Forms by Provider

If your IP address has been blocked by a specific email provider, use the appropriate removal form or contact below:

| Provider                               | Removal Form / Contact                                                                                     | Notes                                        |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                           | <https://support.google.com/mail/contact/bulk_send_new>                                                    | Bulk sender contact form                     |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                | Office 365 IP delist portal                  |
| Yahoo/AOL/Verizon                      | <https://senders.yahooinc.com/>                                                                            | Yahoo Sender Hub                             |
| Apple/iCloud                           | <https://ipcheck.proofpoint.com/>                                                                          | Apple uses Proofpoint for IP reputation      |
| Proofpoint                             | <https://ipcheck.proofpoint.com/>                                                                          | Proofpoint IP check and removal              |
| Barracuda Networks                     | <https://www.barracudacentral.org/lookups/lookup-reputation>                                               | Barracuda reputation lookup and removal      |
| Cloudmark                              | <https://csi.cloudmark.com/en/reset/>                                                                      | Cloudmark CSI reset request                  |
| GoDaddy/SecureServer                   | <https://unblock.secureserver.net>                                                                         | GoDaddy IP unblock request form              |
| Comcast/Xfinity                        | <https://spa.xfinity.com/report>                                                                           | Comcast IP removal request                   |
| Charter/Spectrum                       | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                | Contact Spectrum support for removal         |
| AT&T                                   | `abuse_rbl@abuse-att.net`                                                                                  | Email for removal request                    |
| Cox Communications                     | `unblock.request@cox.net`                                                                                  | Email for removal request                    |
| CenturyLink/Lumen                      | `abuse@centurylink.com`                                                                                    | Uses Cloudfilter                             |
| Windstream                             | `abuse@windstream.net`                                                                                     | Email for removal request                    |
| t-online.de (Germany)                  | `tobr@rx.t-online.de`                                                                                      | Email for removal request                    |
| Orange France                          | <https://postmaster.orange.fr/>                                                                            | Use contact form or email `abuse@orange.fr`  |
| GMX                                    | <https://postmaster.gmx.net/en/contact>                                                                    | GMX postmaster contact form                  |
| Mail.ru                                | <https://postmaster.mail.ru/>                                                                              | Mail.ru postmaster portal                    |
| Yandex                                 | <https://postmaster.yandex.ru/>                                                                            | Yandex postmaster portal                     |
| QQ Mail (Tencent)                      | <https://open.mail.qq.com/>                                                                                | QQ Mail whitelist application (Chinese)      |
| Netease (163.com)                      | <https://mail.163.com/postmaster/>                                                                         | Netease postmaster portal                    |
| Alibaba/Aliyun/HiChina                 | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                       | Contact via Alibaba Cloud console            |
| Amazon SES                             | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                               | AWS SES console > Blacklist Removal          |
| SendGrid                               | <https://support.sendgrid.com/>                                                                            | Contact SendGrid support                     |
| Mimecast                               | <https://community.mimecast.com/>                                                                          | Uses third-party RBLs - contact specific RBL |
| Fastmail                               | <https://www.fastmail.com/support/>                                                                        | Contact Fastmail support                     |
| Zoho                                   | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address> | Contact Zoho support                         |
| ProtonMail                             | <https://proton.me/support/contact>                                                                        | Contact Proton support                       |
| Tutanota                               | <https://tutanota.com/support>                                                                             | Contact Tutanota support                     |
| Hushmail                               | <https://www.hushmail.com/support/>                                                                        | Contact Hushmail support                     |
| Mailbox.org                            | <https://mailbox.org/en/support>                                                                           | Contact Mailbox.org support                  |
| Posteo                                 | <https://posteo.de/en/site/contact>                                                                        | Contact Posteo support                       |
| DuckDuckGo Email                       | <https://duckduckgo.com/email/support>                                                                     | Contact DuckDuckGo support                   |
| Sonic.net                              | <https://www.sonic.com/support>                                                                            | Contact Sonic support                        |
| Telus                                  | <https://www.telus.com/en/support>                                                                         | Contact Telus support                        |
| Vodafone Germany                       | <https://www.vodafone.de/hilfe/>                                                                           | Contact Vodafone support                     |
| Xtra (Spark NZ)                        | <https://www.spark.co.nz/help/>                                                                            | Contact Spark NZ support                     |
| UOL/BOL (Brazil)                       | <https://ajuda.uol.com.br/>                                                                                | Contact UOL support (Portuguese)             |
| Libero (Italy)                         | <https://aiuto.libero.it/>                                                                                 | Contact Libero support (Italian)             |
| Telenet (Belgium)                      | <https://www2.telenet.be/en/support/>                                                                      | Contact Telenet support                      |
| Facebook/WhatsApp                      | <https://www.facebook.com/business/help>                                                                   | Contact Facebook business support            |
| LinkedIn                               | <https://www.linkedin.com/help/linkedin>                                                                   | Contact LinkedIn support                     |
| Groups.io                              | <https://groups.io/helpcenter>                                                                             | Contact Groups.io support                    |
| Earthlink/Vade Secure                  | <https://sendertool.vadesecure.com/en/>                                                                    | Vade Secure sender tool                      |
| Cloudflare Email Security              | <https://www.cloudflare.com/products/zero-trust/email-security/>                                           | Contact Cloudflare support                   |
| Hornetsecurity/Expurgate               | <https://www.hornetsecurity.com/>                                                                          | Contact Hornetsecurity support               |
| SpamExperts/Antispamcloud              | <https://www.spamexperts.com/>                                                                             | Contact via hosting provider                 |
| Mail2World                             | <https://www.mail2world.com/support/>                                                                      | Contact Mail2World support                   |

> \[!TIP]
> Start with a low volume of high-quality emails to build a positive reputation before sending in larger volumes.

> \[!IMPORTANT]
> If your domain is on a blacklist, each blacklist has its own removal process. Check their websites for instructions.

> \[!TIP]
> If you need additional help or find that we are false-positive listed as spam by a certain email service provider, then please <a href="/help">contact us</a>.

### What should I do if I receive spam emails

You should unsubscribe from the emailing list (if possible) and block the sender.

Please do not report the message as spam, but instead forward it to our manually curated and privacy-focused abuse prevention system.

**The email address to forward spam to is:** <abuse@forwardemail.net>

### Why are my test emails sent to myself in Gmail showing as "suspicious"

If you see this error message in Gmail when you send a test to yourself, or when a person you're emailing with your alias sees an email from you for the first time, then **please do not worry** – as this is a built-in safety feature of Gmail.

You can simply click "Looks safe".  For example, if you were to send a test message using the send mail as feature (to someone else), then they will not see this message.

However if they do see this message, it's because they were normally used to seeing your emails come from <john@gmail.com> instead of <john@customdomain.com> (just an example).  Gmail will alert the users just to make sure things are safe just in case, there is no workaround.

### Can I remove the via forwardemail dot net in Gmail

This topic is related to a [widely known issue in Gmail where extra info appears next to a sender's name](https://support.google.com/mail/answer/1311182).

As of May 2023 we support sending email with SMTP as an add-on for all paid users – which means that you can remove the <span class="notranslate">via forwardemail dot net</span> in Gmail.

Note that this FAQ topic is specific for those using the [How to Send Mail As using Gmail](#how-to-send-mail-as-using-gmail) feature.

Please see the section on [Do you support sending email with SMTP](#do-you-support-sending-email-with-smtp) for configuration instructions.


## Data Management

### Where are your servers located

> \[!TIP]
> We may soon announce our EU datacenter location hosted under [forwardemail.eu](https://forwardemail.eu).  Subscribe to the discussion at <https://github.com/orgs/forwardemail/discussions/336> for updates.

Our servers are located primarily in Denver, Colorado – see <https://forwardemail.net/ips> for our complete list of IP addresses.

You can learn about our subprocessors on our [GDPR](/gdpr),  [DPA](/dpa), and [Privacy](/privacy) pages.

### How do I export and backup my mailbox

At anytime you can export your mailboxes as [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox), or encrypted [SQLite](https://en.wikipedia.org/wiki/SQLite) formats.

Go to <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliases <i class="fa fa-angle-right"></i> Download Backup and select your preferred export format type.

You will be emailed a link to download the export once it has finished.

Note that this export download link expires after 4 hours for security concerns.

If you need to inspect your exported EML or Mbox formats, then these open-soruce tools may be useful:

| Name            | Format | Platform      | GitHub URL                                          |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox Viewer     |  Mbox  | Windows       | <https://github.com/eneam/mboxviewer>               |
| mbox-web-viewer |  Mbox  | All platforms | <https://github.com/PHMRanger/mbox-web-viewer>      |
| EmlReader       |   EML  | Windows       | <https://github.com/ayamadori/EmlReader>            |
| Email viewer    |   EML  | VSCode        | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader      |   EML  | All platforms | <https://github.com/s0ph1e/eml-reader>              |

Additionally if you need to convert a Mbox file to EML file, then you can use <https://github.com/noelmartinon/mboxzilla>.

### How do I import and migrate my existing mailbox

You can easily import your email to Forward Email (e.g. using [Thunderbird](https://www.thunderbird.net)) with the instructions below:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    You must follow all of the following steps in order to import your existing email.
  </span>
</div>

1. Export your email from your existing email provider:

   | Email Provider | Export Format                                  | Export Instructions                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail          | MBOX                                           | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook        | PST                                            | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Tip:</strong> <span>If you are using Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST export format</a>), then you could simply follow the instructions under "Other" below.  However we have provided links below to convert PST to MBOX/EML format based off your operating system:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba for Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst for Windows cygwin</a> – (e.g. <code>readpst -u -o $OUT_DIR $IN_DIR</code> replacing <code>$OUT_DIR</code> and <code>$IN_DIR</code> with the output directory and input directory paths respectively).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst for Ubuntu/Linux</a> – (e.g. <code>sudo apt-get install readpst</code> and then <code>readpst -u -o $OUT_DIR $IN_DIR</code>, replacing <code>$OUT_DIR</code> and <code>$IN_DIR</code> with the output directory and input directory paths respectively).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst for macOS (via brew)</a> – (e.g. <code>brew install libpst</code> and then <code>readpst -u -o $OUT_DIR $IN_DIR</code>, replacing <code>$OUT_DIR</code> and <code>$IN_DIR</code> with the output directory and input directory paths respectively).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter for Windows (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail     | MBOX                                           | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail       | EML                                            | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail    | MBOX/EML                                       | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota       | EML                                            | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi          | EML                                            | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho           | EML                                            | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | Other          | [Use Thunderbird](https://www.thunderbird.net) | Set up your existing email account in Thunderbird and then use the [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) plugin to export and import your email.  **You may also be able to simply copy/paste or drag/drop emails between one account to another.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

2. Download, install, and open [Thunderbird](https://www.thunderbird.net).

3. Create a new account using your alias' full email address (e.g. <code><you@yourdomain.com></code>) and your generated password.  <strong>If you do not yet have a generated password, then <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">refer to our setup instructions</a></strong>.

4. Download and install the [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird plugin.

5. Create a new local folder in Thunderbird, and then right click on it  → select the `ImportExportTools NG` option → choose `Import mbox file` (for MBOX export format) – or – `Import messages` / `Import all messages from a directory` (for EML export format).

6. Drag/drop from the local folder to a new (or existing) IMAP folder in Thunderbird you wish to upload messages to in IMAP storage with our service.  This will ensure they are backed up online with our SQLite encrypted storage.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>
       If you are confused as to how to import into Thunderbird, then you can refer to official instructions at <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> and <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    Once you have completed the export and import process, then you may also want to enable forwarding on your existing email account and set up an auto-responder to notify senders that you have a new email address (e.g. if you were previously using Gmail and are now using an email with your custom domain name).
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Congratulations!
    </strong>
    <span>
      You've successfully completed all steps.
    </span>
  </div>
</div>

### Do you support self-hosting

Yes, as of March 2025, we support a self-hosted option. Read the blog [here](https://forwardemail.net/blog/docs/self-hosted-solution). Checkout the [self-hosted guide](https://forwardemail.net/self-hosted) to get started. And for those interested in a more broken down step-by-step version see our [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.


## Email Configuration

### How do I get started and set up email forwarding

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimated Setup Time:</strong>
  <span>Less than 10 minutes</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Getting Started:
  </strong>
  <span>
    Carefully read and follow steps one through eight listed below.  Be sure to replace the email address of <code>user@gmail.com</code> with the email address you want to forward emails to (if it isn't already accurate).  Similarly be sure to replace <code>example.com</code> with your custom domain name (if it isn't already accurate).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">If you have already registered your domain name somewhere, then you must completely skip this step and go to step two!  Otherwise you can <a href="/domain-registration" rel="noopener noreferrer">click here to register your domain name</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  Do you remember where you registered your domain?  Once you remember this, then follow the instructions below:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    You must open a new tab and sign in to your domain registrar.  You can easily click on your "Registrar" below to automatically do this.  In this new tab, you must navigate to the DNS management page at your registrar &ndash; and we have provided the step by step navigation steps below under the "Steps to Configure" column.  Once you've navigated to this page in the new tab, you can return to this tab and proceed to step three below.
    <strong class="font-weight-bold">Do not close the opened tab yet; you will need it for future steps!</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Registrar</th>
      <th>Steps to Configure</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>Log in <i class="fa fa-angle-right"></i> Domain Center <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Edit DNS Settings</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Log in <i class="fa fa-angle-right"></i> Hosted Zones <i class="fa fa-angle-right"></i> (Select your domain)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Log in <i class="fa fa-angle-right"></i> My Servers <i class="fa fa-angle-right"></i> Domain Management <i class="fa fa-angle-right"></i> DNS Manager</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>FOR ROCK: Log in <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Click the ▼ icon next to manage) <i class="fa fa-angle-right"></i> DNS
      <br />
      FOR LEGACY: Log in <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Zone editor <i class="fa fa-angle-right"></i> (Select your domain)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Log in <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Log in <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Select your domain)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Log in <i class="fa fa-angle-right"></i> (Select your domain)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Manage</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Log in <i class="fa fa-angle-right"></i> Networking <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> More <i class="fa fa-angle-right"></i> Manage Domain</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>Log in <i class="fa fa-angle-right"></i> In card view, click manage on your domain <i class="fa fa-angle-right"></i> In list view, click
the gear icon <i class="fa fa-angle-right"></i> DNS & Nameservers <i class="fa fa-angle-right"></i> DNS Records</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Watch</a>
      </td>
      <td>Log in <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> (click gear icon) <i class="fa fa-angle-right"></i> Click on DNS &amp; Nameservers in left-hand menu</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Log in <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Manage Domains <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Log in <i class="fa fa-angle-right"></i> Overview <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> Simple Editor <i class="fa fa-angle-right"></i> Records</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Log in <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Management <i class="fa fa-angle-right"></i> Edit the zone</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Watch</a>
      </td>
      <td>Log in <i class="fa fa-angle-right"></i> Manage My Domains <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Manage DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Watch</a>
      </td>
      <td>Log in <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Configure DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Watch</a>
      </td>
      <td>Log in <i class="fa fa-angle-right"></i> Domain List <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> Advanced DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Log in <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Setup Netlify DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Log in <i class="fa fa-angle-right"></i> Account Manager <i class="fa fa-angle-right"></i> My Domain Names <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> Change Where Domain Points <i class="fa fa-angle-right"></i> Advanced DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Watch</a>
      </td>
      <td>Log in <i class="fa fa-angle-right"></i> Managed Domains <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> DNS Settings</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>Log in <i class="fa fa-angle-right"></i> Home menu <i class="fa fa-angle-right"></i> Settings <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i>
Advanced settings <i class="fa fa-angle-right"></i> Custom Records</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>Using "now" CLI <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Log in <i class="fa fa-angle-right"></i> Domains page <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Log in <i class="fa fa-angle-right"></i> Domains page <i class="fa fa-angle-right"></i> (Click <i class="fa fa-ellipsis-h"></i> icon) <i class="fa fa-angle-right"></i> Select Manage DNS Records</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Log in <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> My Domains</td>
    </tr>
    <tr>
      <td>Other</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Important:</strong> Don't see your registrar name listed here?  Simply search on the Internet for "how to change DNS records on $REGISTRAR" (replacing $REGISTRAR with the name of your registrar &ndash; e.g. "how to change DNS records on GoDaddy" if you're using GoDaddy).</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Using your registrar's DNS management page (the other tab you have opened), set the following "MX" records:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    Note that there should be NO other MX records set.  Both records shown below MUST exist.  Be sure there are no typos; and you have both mx1 and mx2 spelled correctly. If there were already MX records that existed, please delete them completely.
    The "TTL" value does not need to be 3600, it could be a lower or higher value if necessary.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Priority</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx2.forwardemail.net</code></td>
    </tr>
  </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Using your registrar's DNS management page (the other tab you have opened), set the following <strong class="notranslate">TXT</strong> record(s):

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    If you are on a paid plan, then you must completely skip this step and go to step five! If you are not on a paid plan, then your forwarded addresses will be publicly searchable – go to <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> and upgrade your domain to a paid plan if desired.  If you would like to learn more about paid plans see our <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Pricing</a> page.  Otherwise you can continue to choose one or more combinations from Option A to Option F listed below.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option A:
  </strong>
  <span>
    If you are forwarding all emails from your domain, (e.g. "all@example.com", "hello@example.com", etc) to a specific address "user@gmail.com":
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Make sure to replace the values above in the "Value" column with your own email address.  The "TTL" value does not need to be 3600, it could be a lower or higher value if necessary.  A lower time to live ("TTL") value will ensure any future changes made to your DNS records are propagated throughout the Internet quicker &ndash; think of this as how long it will be cached in-memory (in seconds).  You can learn more about <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL on Wikipedia</a>.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option B:
  </strong>
  <span>
    If you just need to forward a single email address (e.g. <code>hello@example.com</code> to <code>user@gmail.com</code>; this will also forward "hello+test@example.com" to "user+test@gmail.com" automatically):
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option C:
  </strong>
  <span>
    If you are forwarding multiple emails, then you'll want to separate them with a comma:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option D:
  </strong>
  <span>
    You can have an infinite amount of forwarding emails setup – just make sure to not wrap over 255 characters in a single-line and start each line with "forward-email=".  An example is provided below:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option E:
  </strong>
  <span>
    You can also specify a domain name in your <strong class="notranslate">TXT</strong> record to have global alias forwarding (e.g. "user@example.com" will get forwarded to "user@example.net"):
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=example.net</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option F:
  </strong>
  <span>
    You can even use webhooks as a global or individual alias to forward emails to.  See the example and full section on webhooks titled <a href="#do-you-support-webhooks" class="alert-link">Do you support webhooks</a> below.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option G:
  </strong>
  <span>
    You can even use regular expressions ("regex") for matching aliases and for handling substitutions to forward emails to.  See the examples and full section on regex titled <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Do you support regular expressions or regex</a> below.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Need advanced regex with substitution?</strong> See the examples and full section on regex titled <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Do you support regular expressions or regex</a> below.
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Simple Example:</strong> If I want all emails that go to `linus@example.com` or `torvalds@example.com` to forward to `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    Catch-all forwarding rules could also be described as "fall-through".
    This means that incoming emails which match at least one specific forwarding rule will be used instead of the catch-all.
    Specific rules include email addresses and regular expressions.
    <br /><br />
    For example:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    Emails sent to <code>hello@example.com</code> will **not** be forwarded to <code>second@gmail.com</code> (catch-all) with this configuration, and instead only be delivered to <code>first@gmail.com</code>.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Using your registrar's DNS management page (the other tab you have opened), additionally set the following <strong class="notranslate">TXT</strong> record:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    If you are using Gmail (e.g. Send Mail As) or G Suite, then you'll need to append <code>include:_spf.google.com</code> to the value above, for example:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    If you already have a similar line with "v=spf1", then you'll need to append <code>include:spf.forwardemail.net</code> right before any existing "include:host.com" records and before the "-all" in the same line, for example:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Note that there is a difference between "-all" and "~all".  The "-" indicates that the SPF check should FAIL if it does not match, and "~" indicates that the SPF check should SOFTFAIL.  We recommend to use the "-all" approach to prevent domain forgery.
    <br /><br />
    You may also need to include the SPF record for whichever host you are sending mail from (e.g. Outlook).
  </span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Verify your DNS records using our "Verify Records" tool available at <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Setup.

</li><li class="mb-2 mb-md-3 mb-lg-5">Send a test email to confirm it works.  Note that it might take some time for your DNS records to propagate.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
  </span>
    If you are not receiving test emails, or receive a test email that says "Be careful with this message", then see the answers for <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Why am I not receiving my test emails</a> and <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Why are my test emails sent to myself in Gmail showing as "suspicious"</a> respectively.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">If you wish to "Send Mail As" from Gmail, then you will need to <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">watch this video</a></strong>, or follow the steps under <a href="#how-to-send-mail-as-using-gmail">How to Send Mail As Using Gmail</a> below.

</li></ol>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Congratulations!
    </strong>
    <span>
      You've successfully completed all steps.
    </span>
  </div>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Optional add-ons are listed below.  Note that these add-ons are completely optional and may not be necessary.  We wanted to at least provide you with additional information if necessary.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Optional Add-on:
  </strong>
  <span>
    If you're using the <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How to Send Mail As using Gmail</a> feature, then you may want to add yourself to an allowlist.  See <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">these instructions by Gmail</a> on this topic.
  </span>
</div>

### Can I use multiple MX exchanges and servers for advanced forwarding

Yes, but **you should only have one MX exchange listed in your DNS records**.

Do not attempt to use "Priority" as a way to configure multiple MX exchanges.

Instead, you need to configure your existing MX exchange to forward mail for all non-matching aliases to our service's exchanges (`mx1.forwardemail.net` and/or `mx2.forwardemail.net`).

If you are using Google Workspace and you want to forward all non-matching aliases to our service, then see <https://support.google.com/a/answer/6297084>.

If you are using Microsoft 365 (Outlook) and you want to forward all non-matching aliases to our service, then see <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> and <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### How do I set up a vacation responder (out of office auto-responder)

Go to <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliases and either create or edit the alias you would like to configure a vacation autoresponder for.

You have the ability to configure a start date, end date, subject, and message, and enable or disable it at anytime:

* Plaintext subject and message are currently supported (we use `striptags` package internally to remove any HTML).
* Subject is limited to 100 characters.
* Message is limited to 1000 characters.
* Setup requires Outbound SMTP configuration (e.g. you will need to setup DKIM, DMARC, and Return-Path DNS records).
  * Go to <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Settings <i class="fa fa-angle-right"></i> Outbound SMTP Configuration and follow setup instructions.
* Vacation responder cannot be enabled on global vanity domain names (e.g. [disposable addresses](/disposable-addresses) are not supported).
* Vacation responder cannot be enabled for aliases with wildcard/catch-all (`*`) nor regular expressions.

Unlike mail systems such as `postfix` (e.g. that use the `sieve` vacation filter extension) – Forward Email automatically adds your DKIM signature, dummy-proofs connection issues when sending vacation responses (e.g. due to common SSL/TLS connection issues and legacy maintained servers), and even supports Open WKD and PGP encryption for vacation responses.

<!--
* In order to prevent abuse, 1 outbound SMTP credit will be deducted for each vacation responder message sent.
  * All paid accounts include 300 credits per day by default.  If you need a larger amount, then please contact us.
-->

1. We only send once per [allowlisted](#do-you-have-an-allowlist) sender every 4 days (which is similar to Gmail's behavior).

   * Our Redis cache uses a fingerprint of `alias_id` and `sender`, whereas `alias_id` is the alias MongoDB ID and `sender` is either the From address (if allowlisted) or root domain in the From address (if not allowlisted).  For simplicity the expiry of this fingerprint in cache is set to 4 days.

   * Our approach of using the root domain parsed in the From address for non-allowlisted senders prevents abuse from relatively unknown senders (e.g. malicious actors) from flooding vacation responder messages.

2. We only send when the MAIL FROM and/or From is not blank and does not contain (case-insensitive) a [postmaster username](#what-are-postmaster-addresses) (the portion before the @ in an email).

3. We don't send if the original message had any of the following headers (case-insensitive):

   * Header of `auto-submitted` with a value not equal to `no`.
   * Header of `x-auto-response-suppress` with a value of `dr`, `autoreply`, `auto-reply`, `auto_reply`, or `all`
   * Header of `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond`, or `x-auto-respond` (regardless of value).
   * Header of `precedence` with a value of `bulk`, `autoreply`, `auto-reply`, `auto_reply`, or `list`.

4. We don't send if the MAIL FROM or From email address ends with `+donotreply`, `-donotreply`, `+noreply`, or `-noreply`.

5. We don't send if the From email address username portion was `mdaemon` and it had a case-insensitive header of `X-MDDSN-Message`.

6. We don't send if there was a case-insensitive `content-type` header of `multipart/report`.

### How do I set up SPF for Forward Email

Using your registrar's DNS management page, set the following <strong class="notranslate">TXT</strong> record:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    If you are using Gmail (e.g. Send Mail As) or G Suite, then you'll need to append <code>include:_spf.google.com</code> to the value above, for example:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    If you are using Microsoft Outlook or Live.com, you'll need to append <code>include:spf.protection.outlook.com</code> to your SPF <strong class="notranslate">TXT</strong> record, for example:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    If you already have a similar line with "v=spf1", then you'll need to append <code>include:spf.forwardemail.net</code> right before any existing "include:host.com" records and before the "-all" in the same line, for example:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Note that there is a difference between "-all" and "~all".  The "-" indicates that the SPF check should FAIL if it does not match, and "~" indicates that the SPF check should SOFTFAIL.  We recommend to use the "-all" approach to prevent domain forgery.
    <br /><br />
    You may also need to include the SPF record for whichever host you are sending mail from (e.g. Outlook).
  </span>
</div>

### How do I set up DKIM for Forward Email

Go to <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Settings <i class="fa fa-angle-right"></i> Outbound SMTP Configuration and follow setup instructions.

### How do I set up DMARC for Forward Email

Go to <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Settings <i class="fa fa-angle-right"></i> Outbound SMTP Configuration and follow setup instructions.

### How do I view DMARC Reports

Forward Email provides a comprehensive DMARC Reports dashboard that allows you to monitor your email authentication performance across all your domains from a single interface.

**What are DMARC Reports?**

DMARC (Domain-based Message Authentication, Reporting, and Conformance) reports are XML files sent by receiving mail servers that tell you how your emails are being authenticated. These reports help you understand:

* How many emails are being sent from your domain
* Whether those emails are passing SPF and DKIM authentication
* What actions receiving servers are taking (accept, quarantine, or reject)
* Which IP addresses are sending email on behalf of your domain

**How to Access DMARC Reports**

Go to <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> DMARC Reports</a> to view your dashboard. You can also access domain-specific reports from <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a> by clicking the "DMARC" button next to any domain.

**Dashboard Features**

The DMARC Reports dashboard provides:

* **Summary Metrics**: Total reports received, total messages analyzed, SPF alignment rate, DKIM alignment rate, and overall pass rate
* **Messages Over Time Chart**: Visual trend of email volume and authentication rates over the past 30 days
* **Alignment Summary**: Donut chart showing SPF vs DKIM alignment distribution
* **Message Disposition**: Stacked bar chart showing how receiving servers handled your emails (accepted, quarantined, or rejected)
* **Recent Reports Table**: Detailed list of individual DMARC reports with filtering and pagination
* **Domain Filtering**: Filter reports by specific domain when managing multiple domains

**Why This Matters**

For organizations managing multiple domains (like enterprises, non-profits, or agencies), DMARC reports are essential for:

* **Identifying unauthorized senders**: Detect if someone is spoofing your domain
* **Improving deliverability**: Ensure your legitimate emails pass authentication
* **Monitoring email infrastructure**: Track which services and IPs are sending on your behalf
* **Compliance**: Maintain visibility into email authentication for security audits

Unlike other services that require separate DMARC monitoring tools, Forward Email includes DMARC report processing and visualization as part of your account at no additional cost.

**Requirements**

* DMARC Reports are available for paid plans only
* Your domain must have DMARC configured (see [How do I set up DMARC for Forward Email](#how-do-i-set-up-dmarc-for-forward-email))
* Reports are automatically collected when receiving mail servers send them to your configured DMARC reporting address

**Weekly Email Reports**

Paid plan users automatically receive weekly DMARC report summaries via email. These emails include:

* Summary statistics for all your domains
* SPF and DKIM alignment rates
* Message disposition breakdown (accepted, quarantined, rejected)
* Top reporting organizations (Google, Microsoft, Yahoo, etc.)
* IP addresses with alignment issues that may need attention
* Direct links to your DMARC Reports dashboard

Weekly reports are sent automatically and cannot be disabled separately from other email notifications.

### How do I connect and configure my contacts

**To configure your contacts, use the CardDAV URL of:** `https://carddav.forwardemail.net` (or simply `carddav.forwardemail.net` if your client allows it)

### How do I connect and configure my calendars

**To configure your calendar, use the CalDAV URL of:** `https://caldav.forwardemail.net` (or simply `caldav.forwardemail.net` if your client allows it)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### How do I add more calendars and manage existing calendars

If you'd like to add additional calendars, then just add a new calendar URL of: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**be sure to replace `calendar-name` with your desired calendar name**)

You can change a calendar's name and color after creation – just use your preferred calendar application (e.g. Apple Mail or [Thunderbird](https://thunderbird.net)).

### How do I connect and configure tasks and reminders

**To configure tasks and reminders, use the same CalDAV URL as calendars:** `https://caldav.forwardemail.net` (or simply `caldav.forwardemail.net` if your client allows it)

Tasks and reminders will automatically be separated from calendar events into their own "Reminders" or "Tasks" calendar collection.

**Setup instructions by platform:**

**macOS/iOS:**

1. Add a new CalDAV account in System Preferences > Internet Accounts (or Settings > Accounts on iOS)
2. Use `caldav.forwardemail.net` as the server
3. Enter your Forward Email alias and generated password
4. After setup, you'll see both "Calendar" and "Reminders" collections
5. Use the Reminders app to create and manage tasks

**Android with Tasks.org:**

1. Install Tasks.org from Google Play Store or F-Droid
2. Go to Settings > Synchronization > Add Account > CalDAV
3. Enter server: `https://caldav.forwardemail.net`
4. Enter your Forward Email alias and generated password
5. Tasks.org will automatically discover your task calendars

**Thunderbird:**

1. Install the Lightning add-on if not already installed
2. Create a new calendar with type "CalDAV"
3. Use URL: `https://caldav.forwardemail.net`
4. Enter your Forward Email credentials
5. Both events and tasks will be available in the calendar interface

### Why can't I create tasks in macOS Reminders

If you're having trouble creating tasks in macOS Reminders, try these troubleshooting steps:

1. **Check account setup**: Ensure your CalDAV account is properly configured with `caldav.forwardemail.net`

2. **Verify separate calendars**: You should see both "Calendar" and "Reminders" in your account. If you only see "Calendar", the task support may not be fully activated yet.

3. **Refresh account**: Try removing and re-adding your CalDAV account in System Preferences > Internet Accounts

4. **Check server connectivity**: Test that you can access `https://caldav.forwardemail.net` in your browser

5. **Verify credentials**: Ensure you're using the correct alias email and generated password (not your account password)

6. **Force sync**: In Reminders app, try creating a task and then manually refreshing the sync

**Common issues:**

* **"Reminders calendar not found"**: The server may need a moment to create the Reminders collection on first access
* **Tasks not syncing**: Check that both devices are using the same CalDAV account credentials
* **Mixed content**: Ensure tasks are being created in the "Reminders" calendar, not the general "Calendar"

### How do I set up Tasks.org on Android

Tasks.org is a popular open-source task manager that works excellently with Forward Email's CalDAV task support.

**Installation and Setup:**

1. **Install Tasks.org**:
   * From Google Play Store: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * From F-Droid: [Tasks.org on F-Droid](https://f-droid.org/packages/org.tasks/)

2. **Configure CalDAV sync**:
   * Open Tasks.org
   * Go to ☰ Menu > Settings > Synchronization
   * Tap "Add Account"
   * Select "CalDAV"

3. **Enter Forward Email settings**:
   * **Server URL**: `https://caldav.forwardemail.net`
   * **Username**: Your Forward Email alias (e.g., `you@yourdomain.com`)
   * **Password**: Your alias-specific generated password
   * Tap "Add Account"

4. **Account discovery**:
   * Tasks.org will automatically discover your task calendars
   * You should see your "Reminders" collection appear
   * Tap "Subscribe" to enable sync for the task calendar

5. **Test sync**:
   * Create a test task in Tasks.org
   * Check that it appears in other CalDAV clients (like macOS Reminders)
   * Verify changes sync both ways

**Features available:**

* ✅ Task creation and editing
* ✅ Due dates and reminders
* ✅ Task completion and status
* ✅ Priority levels
* ✅ Subtasks and task hierarchy
* ✅ Tags and categories
* ✅ Two-way sync with other CalDAV clients

**Troubleshooting:**

* If no task calendars appear, try manually refreshing in Tasks.org settings
* Ensure you have at least one task created on the server (you can create one in macOS Reminders first)
* Check network connectivity to `caldav.forwardemail.net`

### How do I set up SRS for Forward Email

We automatically configure [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – you do not need to do this yourself.

### How do I set up MTA-STS for Forward Email

Please refer to [our section on MTA-STS](#do-you-support-mta-sts) for more insight.

### How do I add a profile picture to my email address

If you're using Gmail, then follow these steps below:

1. Go to <https://google.com> and sign out of all email accounts
2. Click "Sign In" and on the drop-down click on "other account"
3. Select "Use another account"
4. Select "Create account"
5. Select "Use my current email address instead"
6. Enter your custom domain name email address
7. Retrieve the verification email sent to your email address
8. Enter the verification code from this email
9. Complete profile information for your new Google account
10. Agree to all Privacy and Terms of Use policies
11. Go to <https://google.com> and in the top right corner, click on your profile icon, and click on the "change" button
12. Upload a new photo or avatar for your account
13. Changes will take approximately 1-2 hours to propagate, but sometimes may be very quick.
14. Send a test email and the profile photo should appear.


## Advanced Features

### Do you support newsletters or mailing lists for marketing related email

Yes, you can read more at <https://forwardemail.net/guides/newsletter-with-listmonk>.

Please note that in order to maintain IP reputation and ensure deliverability, Forward Email has a manual review process on a per-domain basis for **newsletter approval**. Email <support@forwardemail.net> or open a [help request](https://forwardemail.net/help) for approval. This typically takes less than 24 hours, with most requests being honored within 1-2 hours. In the near future we aim to make this process instant with additional spam controls and alerting. This process ensures that your emails reach the inbox and your messages don't get marked as spam.

### Do you support sending email with API

Yes, as of May 2023 we support sending email with API as an add-on for all paid users.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    Please ensure you have read our <a href="/terms" class="alert-link" target="_blank">Terms</a>, <a href="/privacy" class="alert-link" target="_blank">Privacy Policy</a>, and <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Outbound SMTP Limits</a> &ndash; your use is considered acknowledgement and agreement.
  </span>
</div>

Please view our section on [Emails](/email-api#outbound-emails) in our API documentation for options, examples, and more insight.

In order to send outbound email with our API, you must use your API token available under [My Security](/my-account/security).

### Do you support receiving email with IMAP

Yes, as of October 16, 2023 we support receiving email over IMAP as an add-on for all paid users.  **Please read our deep-dive article** on [how our encrypted SQLite mailbox storage feature works](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    Please ensure you have read our <a href="/terms" class="alert-link" target="_blank">Terms</a> and <a href="/privacy" class="alert-link" target="_blank">Privacy Policy</a> &ndash; your use is considered acknowledgement and agreement.
  </span>
</div>

1. Create a new alias for your domain under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliases (e.g. <code><hello@example.com></code>)

2. Click on <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> next to the newly created alias.  Copy to your clipboard and securely store the generated password shown on the screen.

3. Using your preferred email application, add or configure an account with your newly created alias (e.g. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>We recommend using <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, or <a href="/blog/open-source" class="alert-link" target="_blank">an open-source and privacy-focused alternative</a>.</span>
   </div>

4. When prompted for IMAP server name, enter `imap.forwardemail.net`

5. When prompted for IMAP server port, enter `993` (SSL/TLS) – see [alternate IMAP ports](/faq#what-are-your-imap-server-configuration-settings) if necessary
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>If you are using Thunderbird, then ensure "Connection security" is set to "SSL/TLS" and Authentication method is set to "Normal password".</span>
   </div>

6. When prompted for IMAP server password, paste the password from <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> in step 2 above

7. **Save your settings** – if you are having issues, then please <a href="/help">contact us</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Congratulations!
    </strong>
    <span>
      You've successfully completed all steps.
    </span>
  </div>
</div>

</div>

### Do you support POP3

Yes, as of December 4, 2023 we support [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) as an add-on for all paid users.  **Please read our deep-dive article** on [how our encrypted SQLite mailbox storage feature works](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    Please ensure you have read our <a href="/terms" class="alert-link" target="_blank">Terms</a> and <a href="/privacy" class="alert-link" target="_blank">Privacy Policy</a> &ndash; your use is considered acknowledgement and agreement.
  </span>
</div>

1. Create a new alias for your domain under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliases (e.g. <code><hello@example.com></code>)

2. Click on <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> next to the newly created alias.  Copy to your clipboard and securely store the generated password shown on the screen.

3. Using your preferred email application, add or configure an account with your newly created alias (e.g. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>We recommend using <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, or <a href="/blog/open-source" class="alert-link" target="_blank">an open-source and privacy-focused alternative</a>.</span>
   </div>

4. When prompted for POP3 server name, enter `pop3.forwardemail.net`

5. When prompted for POP3 server port, enter `995` (SSL/TLS) – see [alternate POP3 ports](/faq#what-are-your-pop3-server-configuration-settings) if necessary
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>If you are using Thunderbird, then ensure "Connection security" is set to "SSL/TLS" and Authentication method is set to "Normal password".</span>
   </div>

6. When prompted for POP3 server password, paste the password from <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> in step 2 above

7. **Save your settings** – if you are having issues, then please <a href="/help">contact us</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Congratulations!
    </strong>
    <span>
      You've successfully completed all steps.
    </span>
  </div>
</div>

</div>

### Do you support calendars (CalDAV)

Yes, as of February 5, 2024 we have added this feature.  Our server is `caldav.forwardemail.net` and is also monitored on our <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">status page</a>.

It supports both IPv4 and IPv6 and is available over port `443` (HTTPS).

| Login    | Example                    | Description                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`         | Email address of an alias that exists for the domain at <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a>. |
| Password | `************************` | Alias-specific generated password.                                                                                                                                                        |

In order to use calendar support, the **user** must be the email address of an alias that exists for the domain at <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a> – and the **password** must be an alias-specific generated password.

### Do you support tasks and reminders (CalDAV VTODO)

Yes, as of October 14, 2025 we have added CalDAV VTODO support for tasks and reminders. This uses the same server as our calendar support: `caldav.forwardemail.net`.

Our CalDAV server supports both calendar events (VEVENT) and tasks (VTODO) components using **unified calendars**. This means each calendar can contain both events and tasks, providing maximum flexibility and compatibility across all CalDAV clients.

**How calendars and lists work:**

* **Each calendar supports both events and tasks** - You can add events, tasks, or both to any calendar
* **Apple Reminders lists** - Each list you create in Apple Reminders becomes a separate calendar on the server
* **Multiple calendars** - You can create as many calendars as you need, each with its own name, color, and organization
* **Cross-client sync** - Tasks and events sync seamlessly between all compatible clients

**Supported task clients:**

* **macOS Reminders** - Full native support for task creation, editing, completion, and sync
* **iOS Reminders** - Full native support across all iOS devices
* **Tasks.org (Android)** - Popular open-source task manager with CalDAV sync
* **Thunderbird** - Task and calendar support in desktop email client
* **Any CalDAV-compatible task manager** - Standard VTODO component support

**Task features supported:**

* Task creation, editing, and deletion
* Due dates and start dates
* Task completion status (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* Task priority levels
* Recurring tasks
* Task descriptions and notes
* Multi-device synchronization
* Subtasks with RELATED-TO property
* Task reminders with VALARM

The login credentials are the same as for calendar support:

| Login    | Example                    | Description                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`         | Email address of an alias that exists for the domain at <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a>. |
| Password | `************************` | Alias-specific generated password.                                                                                                                                                        |

**Important notes:**

* **Each Reminders list is a separate calendar** - When you create a new list in Apple Reminders, it creates a new calendar on the CalDAV server
* **Thunderbird users** - You'll need to manually subscribe to each calendar/list you want to sync, or use the calendar home URL: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Apple users** - Calendar discovery happens automatically, so all your calendars and lists will appear in Calendar.app and Reminders.app
* **Unified calendars** - All calendars support both events and tasks, giving you flexibility in how you organize your data

### Do you support contacts (CardDAV)

Yes, as of June 12, 2025 we have added this feature.  Our server is `carddav.forwardemail.net` and is also monitored on our <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">status page</a>.

It supports both IPv4 and IPv6 and is available over port `443` (HTTPS).

| Login    | Example                    | Description                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`         | Email address of an alias that exists for the domain at <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a>. |
| Password | `************************` | Alias-specific generated password.                                                                                                                                                        |

In order to use contacts support, the **user** must be the email address of an alias that exists for the domain at <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a> – and the **password** must be an alias-specific generated password.

### Do you support sending email with SMTP

Yes, as of May 2023 we support sending email with SMTP as an add-on for all paid users.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    Please ensure you have read our <a href="/terms" class="alert-link" target="_blank">Terms</a>, <a href="/privacy" class="alert-link" target="_blank">Privacy Policy</a>, and <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Outbound SMTP Limits</a> &ndash; your use is considered acknowledgement and agreement.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    If you are using Gmail, then refer to our <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Send Mail As with Gmail guide</a>. If you are a developer, then refer to our <a class="alert-link" href="/email-api#outbound-emails" target="_blank">email API docs</a>.
  </span>
</div>

1. Go to <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Settings <i class="fa fa-angle-right"></i> Outbound SMTP Configuration and follow setup instructions

2. Create a new alias for your domain under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliases (e.g. <code><hello@example.com></code>)

3. Click on <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> next to the newly created alias.  Copy to your clipboard and securely store the generated password shown on the screen.

4. Using your preferred email application, add or configure an account with your newly created alias (e.g. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>We recommend using <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, or <a href="/blog/open-source" class="alert-link" target="_blank">an open-source and privacy-focused alternative</a>.</span>
   </div>

5. When prompted for SMTP server name, enter `smtp.forwardemail.net`

6. When prompted for SMTP server port, enter `465` (SSL/TLS) – see [alternate SMTP ports](/faq#what-are-your-smtp-server-configuration-settings) if necessary
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>If you are using Thunderbird, then ensure "Connection security" is set to "SSL/TLS" and Authentication method is set to "Normal password".</span>
   </div>

7. When prompted for SMTP server password, paste the password from <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> in step 3 above

8. **Save your settings and send your first test email** – if you are having issues, then please <a href="/help">contact us</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    Please note that in order to maintain IP reputation and ensure deliverability, we have a manual review process on a per-domain basis for outbound SMTP approval. This typically takes less than 24 hours, with most requests being honored within 1-2 hours. In the near future we aim to make this process instant with additional spam controls and alerting. This process ensures that your emails reach the inbox and your messages don't get marked as spam.
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Congratulations!
    </strong>
    <span>
      You've successfully completed all steps.
    </span>
  </div>
</div>

</div>

### Do you support OpenPGP/MIME, end-to-end encryption ("E2EE"), and Web Key Directory ("WKD")

Yes, we support [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [end-to-end encryption ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption), and the discovery of public keys using [Web Key Directory ("WKD")](https://wiki.gnupg.org/WKD).  You can configure OpenPGP using [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) or [self-host your own keys](https://wiki.gnupg.org/WKDHosting) (refer to [this gist for WKD server setup](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* WKD lookups are cached for 1 hour to ensure timely email delivery → therefore if you add, change, or remove your WKD key, then please email us at `support@forwardemail.net` with your email address in order for us to manually purge the cache.
* We support PGP encryption for messages that are forwarded via WKD lookup or using an uploaded PGP key on our interface.
* Uploaded keys take prevalance as long as the PGP checkbox is enabled/checked.
* Messages sent to webhooks are not currently encrypted with PGP.
* If you have multiple aliases that match for a given forwarding address (e.g. regex/wildcard/exact combo) and if more than one of these contains an uploaded PGP key and has PGP checked → then we will send you an error alert email and will not encrypt the message with your uploaded PGP key.  This is very rare and usually only applies to advanced users with complex alias rules.
* **PGP encryption will not be applied to email forwarding through our MX servers if the sender had a DMARC policy of reject.  If you require PGP encryption on *all* mail then we suggest to use our IMAP service and configure your PGP key for your alias for inbound mail.**

**You can validate your Web Key Directory setup at <https://wkd.chimbosonic.com/> (open-source) or <https://www.webkeydirectory.com/> (proprietary).**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Automatic Encryption:
  </strong>
  <span>If you are using our <a href="#do-you-support-sending-email-with-smtp" class="alert-link">outbound SMTP service</a> and sending unencrypted messages, then we will automatically attempt to encrypt messages on a per-recipient basis using <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    You must follow all of the following steps in order to enable OpenPGP for your custom domain name.
  </span>
</div>

1. Download and install your email client's recommended plugin below:

   | Email Client    | Platform | Recommended Plugin                                                                                                                                                                    | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird     | Desktop  | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird has built-in support for OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                            |
   | Gmail           | Browser  | [Mailvelope](https://mailvelope.com/) or [FlowCrypt](https://flowcrypt.com/download) (proprietary license)                                                                            | Gmail does not support OpenPGP, however you can download the open-source plugin [Mailvelope](https://mailvelope.com/) or [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                    |
   | Apple Mail      | macOS    | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                          | Apple Mail does not support OpenPGP, however you can download the open-source plugin [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation).                                                                                                                                                                                                                                                       |
   | Apple Mail      | iOS      | [PGPro](https://github.com/opensourceios/PGPro/) or [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (proprietary license)                           | Apple Mail does not support OpenPGP, however you can download the open-source plugin [PGPro](https://github.com/opensourceios/PGPro/) or [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                    |
   | Outlook         | Windows  | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                          | Outlook's desktop mail client does not support OpenPGP, however you can download the open-source plugin [gpg4win](https://www.gpg4win.de/index.html).                                                                                                                                                                                                                                                                                    |
   | Outlook         | Browser  | [Mailvelope](https://mailvelope.com/) or [FlowCrypt](https://flowcrypt.com/download) (proprietary license)                                                                            | Outlook's web-based mail client does not support OpenPGP, however you can download the open-source plugin [Mailvelope](https://mailvelope.com/) or [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                          |
   | Android         | Mobile   | [OpenKeychain](https://www.openkeychain.org/) or [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                       | [Android mail clients](/blog/open-source/android-email-clients) such as [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) and [FairEmail](https://github.com/M66B/FairEmail) both support the open-source plugin [OpenKeychain](https://www.openkeychain.org/). You could alternatively use the open-source (proprietary licensing) plugin [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
   | Google Chrome   | Browser  | [Mailvelope](https://mailvelope.com/) or [FlowCrypt](https://flowcrypt.com/download) (proprietary license)                                                                            | You can download the open-source browser extension [Mailvelope](https://mailvelope.com/) or [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                 |
   | Mozilla Firefox | Browser  | [Mailvelope](https://mailvelope.com/) or [FlowCrypt](https://flowcrypt.com/download) (proprietary license)                                                                            | You can download the open-source browser extension [Mailvelope](https://mailvelope.com/) or [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                 |
   | Microsoft Edge  | Browser  | [Mailvelope](https://mailvelope.com/)                                                                                                                                                 | You can download the open-source browser extension [Mailvelope](https://mailvelope.com/).                                                                                                                                                                                                                                                                                                                                                |
   | Brave           | Browser  | [Mailvelope](https://mailvelope.com/) or [FlowCrypt](https://flowcrypt.com/download) (proprietary license)                                                                            | You can download the open-source browser extension [Mailvelope](https://mailvelope.com/) or [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                 |
   | Balsa           | Desktop  | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                            | Balsa has built-in support for OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                                  |
   | KMail           | Desktop  | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                                 | KMail has built-in support for OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                                  |
   | GNOME Evolution | Desktop  | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                               | GNOME Evolution has built-in support for OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                        |
   | Terminal        | Desktop  | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                           | You can use the open-source [gpg command line tool](https://www.gnupg.org/download/) to generate a new key from command line.                                                                                                                                                                                                                                                                                                            |

2. Open the plugin, create your public key, and configure your email client to use it.

3. Upload your public key at <https://keys.openpgp.org/upload>.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>You can visit <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> to manage your key in the future.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Optional Add-on:
     </strong>
     <span>
       If you are using our <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">encrypted storage (IMAP/POP3)</a> service and want <i>all</i> email stored in your (already encrypted) SQLite database to be encrypted with your public key, then go to <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliases (e.g. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Edit <i class="fa fa-angle-right"></i> OpenPGP and upload your public key.
     </span>
   </div>

4. Add a new `CNAME` record to your domain name (e.g. `example.com`):

   <table class="table table-striped table-hover my-3">
     <thead class="thead-dark">
       <tr>
         <th>Name/Host/Alias</th>
         <th class="text-center">TTL</th>
         <th>Type</th>
         <th>Answer/Value</th>
       </tr>
     </thead>
     <tbody>
       <tr>
         <td><code>openpgpkey</code></td>
         <td class="text-center">3600</td>
         <td class="notranslate">CNAME</td>
         <td><code>wkd.keys.openpgp.org</code></td>
       </tr>
     </tbody>
   </table>

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>If your alias is using our <a class="alert-link" href="/disposable-addresses" target="_blank">vanity/disposable domains</a> (e.g. <code>hideaddress.net</code>), then you can skip this step.</span>
   </div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Congratulations!
    </strong>
    <span>
      You've successfully completed all steps.
    </span>
  </div>
</div>

### Do you support S/MIME encryption

Yes, we support [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME) encryption as defined in [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551). S/MIME provides end-to-end encryption using X.509 certificates, which is widely supported by enterprise email clients.

We support both RSA and ECC (Elliptic Curve Cryptography) certificates:

* **RSA certificates**: 2048-bit minimum, 4096-bit recommended
* **ECC certificates**: P-256, P-384, and P-521 NIST curves

To configure S/MIME encryption for your alias:

1. Obtain an S/MIME certificate from a trusted Certificate Authority (CA) or generate a self-signed certificate for testing.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Free S/MIME certificates are available from providers like <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> or <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>.</span>
   </div>

2. Export your certificate in PEM format (the public certificate only, not the private key).

3. Go to <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliases (e.g. <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> Edit <i class="fa fa-angle-right"></i> S/MIME and upload your public certificate.

4. Once configured, all incoming emails to your alias will be encrypted using your S/MIME certificate before being stored or forwarded.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Note:
     </strong>
     <span>
       S/MIME encryption is applied to incoming messages that are not already encrypted. If a message is already encrypted with OpenPGP or S/MIME, it will not be re-encrypted.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Important:
     </strong>
     <span>
       S/MIME encryption will not be applied to email forwarding through our MX servers if the sender had a DMARC policy of reject. If you require S/MIME encryption on <em>all</em> mail then we suggest to use our IMAP service and configure your S/MIME certificate for your alias for inbound mail.
     </span>
   </div>

The following email clients have built-in S/MIME support:

| Email Client      | Platform | Notes                                                                                                               |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| Apple Mail        | macOS    | Built-in S/MIME support. Go to Mail > Preferences > Accounts > your account > Trust to configure certificates.      |
| Apple Mail        | iOS      | Built-in S/MIME support. Go to Settings > Mail > Accounts > your account > Advanced > S/MIME to configure.          |
| Microsoft Outlook | Windows  | Built-in S/MIME support. Go to File > Options > Trust Center > Trust Center Settings > Email Security to configure. |
| Microsoft Outlook | macOS    | Built-in S/MIME support. Go to Tools > Accounts > Advanced > Security to configure.                                 |
| Thunderbird       | Desktop  | Built-in S/MIME support. Go to Account Settings > End-To-End Encryption > S/MIME to configure.                      |
| GNOME Evolution   | Desktop  | Built-in S/MIME support. Go to Edit > Preferences > Mail Accounts > your account > Security to configure.           |
| KMail             | Desktop  | Built-in S/MIME support. Go to Settings > Configure KMail > Identities > your identity > Cryptography to configure. |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Congratulations!
    </strong>
    <span>
      You've successfully configured S/MIME encryption for your alias.
    </span>
  </div>
</div>

### Do you support Sieve email filtering

Yes! We support [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) email filtering as defined in [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228). Sieve is a powerful, standardized scripting language for server-side email filtering that allows you to automatically organize, filter, and respond to incoming messages.

#### Supported Sieve Extensions

We support a comprehensive set of Sieve extensions:

| Extension                    | RFC                                                                                    | Description                                      |
| ---------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `fileinto`                   | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | File messages into specific folders              |
| `reject` / `ereject`         | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                              | Reject messages with an error                    |
| `vacation`                   | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                              | Automatic vacation/out-of-office replies         |
| `vacation-seconds`           | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                              | Fine-grained vacation response intervals         |
| `imap4flags`                 | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                              | Set IMAP flags (\Seen, \Flagged, etc.)           |
| `envelope`                   | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | Test envelope sender/recipient                   |
| `body`                       | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                              | Test message body content                        |
| `variables`                  | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                              | Store and use variables in scripts               |
| `relational`                 | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                              | Relational comparisons (greater than, less than) |
| `comparator-i;ascii-numeric` | [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                              | Numeric comparisons                              |
| `copy`                       | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                              | Copy messages while redirecting                  |
| `editheader`                 | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                              | Add or delete message headers                    |
| `date`                       | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | Test date/time values                            |
| `index`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | Access specific header occurrences               |
| `regex`                      | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex) | Regular expression matching                      |
| `enotify`                    | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                              | Send notifications (e.g., mailto:)               |
| `environment`                | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                              | Access environment information                   |
| `mailbox`                    | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                              | Test mailbox existence, create mailboxes         |
| `special-use`                | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                              | File into special-use mailboxes (\Junk, \Trash)  |
| `duplicate`                  | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                              | Detect duplicate messages                        |
| `ihave`                      | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                              | Test for extension availability                  |
| `subaddress`                 | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                              | Access user+detail address parts                 |

#### Extensions Not Supported

The following extensions are not currently supported:

| Extension                                                       | Reason                                                              |
| --------------------------------------------------------------- | ------------------------------------------------------------------- |
| `include`                                                       | Security risk (script injection) and requires global script storage |
| `mboxmetadata` / `servermetadata`                               | Requires IMAP METADATA extension support                            |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | Complex MIME tree manipulation not yet implemented                  |

#### Example Sieve Scripts

**File newsletters into a folder:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**Auto-reply when on vacation:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "I am currently out of the office and will respond when I return.";
```

**Mark messages from important senders:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**Reject spam with specific subjects:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Message rejected due to spam content.";
}
```

#### Managing Sieve Scripts

You can manage your Sieve scripts in several ways:

1. **Web Interface**: Go to <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliases <i class="fa fa-angle-right"></i> Sieve Scripts to create and manage scripts.

2. **ManageSieve Protocol**: Connect using any ManageSieve-compatible client (like Thunderbird's Sieve add-on or [sieve-connect](https://github.com/philpennock/sieve-connect)) to `imap.forwardemail.net`. Use port `2190` with STARTTLS (recommended for most clients) or port `4190` with implicit TLS.

3. **API**: Use our [REST API](/api#sieve-scripts) to programmatically manage scripts.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Note:
  </strong>
  <span>
    Sieve filtering is applied to incoming messages before they are stored in your mailbox. Scripts are executed in order of priority, and the first matching action determines how the message is handled.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Security:
  </strong>
  <span>
    For security, redirect actions are limited to 10 per script and 100 per day. Vacation responses are rate-limited to prevent abuse.
  </span>
</div>

### Do you support MTA-STS

Yes, as of March 2, 2023 we support [MTA-STS](https://www.hardenize.com/blog/mta-sts).  You can use [this template](https://github.com/jpawlowski/mta-sts.template) if you wish to enable it on your domain.

Our configuration can be found publicly on GitHub at <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Do you support passkeys and WebAuthn

Yes! As of December 13, 2023 we have added support for passkeys [due to high demand](https://github.com/orgs/forwardemail/discussions/182).

Passkeys allow you to securely log in without requiring a password and two-factor authentication.

You can validate your identity with touch, facial recognition, device-based password, or PIN.

We allow you to manage up to 30 passkeys at once, so that you can log in with all of your devices with ease.

Learn more about passkeys at the following links:

* [Sign-in to your applications and websites with passkeys](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Use passkeys to sign in to apps and websites on iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Wikipedia article on Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### Do you support email best practices

Yes. We have built-in support for SPF, DKIM, DMARC, ARC, and SRS across all plans. We have also worked extensively with the original authors of these specifications and other email experts to ensure perfection and high deliverability.

### Do you support bounce webhooks

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Looking for documentation on email webhooks?  See <a href="/faq#do-you-support-webhooks" class="alert-link">Do you support webhooks?</a> for more insight.
  <span>
  </span>
</div>

Yes, as of August 14, 2024 we have added this feature.  You can now go to My Account → Domains → Settings → Bounce Webhook URL and configure an `http://` or `https://` URL that we will send a `POST` request to whenever outbound SMTP emails bounce.

This is useful for you to manage and monitor your outbound SMTP – and can be used to maintain subscribers, opt-out, and detect whenever bounces occur.

Bounce webhook payloads are sent as a JSON with these properties:

* `email_id` (String) - email ID that corresponds to an email in My Account → Emails (outbound SMTP)
* `list_id` (String) - the `List-ID` header (case-insensitive) value, if any, from the original outbound email
* `list_unsubscribe` (String) - the `List-Unsubscribe` header (case-insensitive) value, if any, from the original outbound email
* `feedback_id` (String) - the `Feedback-ID` header (case-insensitive) value, if any, from the original outbound email
* `recipient` (String) - the email address of the recipient that bounced or errored
* `message` (String) - a detailed error message for the bounce
* `response` (String) - the SMTP response message
* `response_code` (Number) - the parsed SMTP response code
* `truth_source` (String) - if the response code was from a trusted source, this value will be populated with the root domain name (e.g. `google.com` or `yahoo.com`)
* `bounce` (Object) - an object containing the following properties that detail the bounce and rejection status
  * `action` (String) - bounce action (e.g. `"reject"`)
  * `message` (String) - bounce reason (e.g. `"Message Sender Blocked By Receiving Server"`)
  * `category` (String) - bounce category (e.g. `"block"`)
  * `code` (Number) - bounce status code (e.g. `554`)
  * `status` (String) - bounce code from response message (e.g. `5.7.1`)
  * `line` (Number) - parsed line number, if any, [from Zone-MTA bounce parse list](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (e.g. `526`)
* `headers` (Object) - key value pair of headers for the outbound email
* `bounced_at` (String) - [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) formatted Date for when the bounce error occurred

For example:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "The email account that you tried to reach is over quota.",
  "response": "552 5.2.2 The email account that you tried to reach is over quota.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Gmail Mailbox is full",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

Here are a few additional notes regarding bounce webhooks:

* If the webhook payload contains a `list_id`, `list_unsubscribe`, or `feedback_id` value, then you should take appropriate action to remove the `recipient` from the list if necessary.
  * If the `bounce.category` value was one `"block"`, `"recipient"`, `"spam"`, or `"virus"`, then you should definitely remove the user from the list.
* If you need to verify webhook payloads (to ensure they're actually coming from our server), then you can [resolve the remote client IP address client hostname using a reverse lookup](https://nodejs.org/api/dns.html#dnspromisesreverseip) – it should be `smtp.forwardemail.net`.
  * You can also check the IP against [our published IP addresses](#what-are-your-servers-ip-addresses).
  * Go to My Account → Domains → Settings → Webhook Signature Payload Verification Key to obtain your webhook key.
    * You can rotate this key at anytime for security reasons.
    * Calculate and compare the `X-Webhook-Signature` value from our webhook request with the computed body value using this key.  An example of how to do this is available at [this Stack Overflow post](https://stackoverflow.com/a/68885281).
  * See the discussion at <https://github.com/forwardemail/free-email-forwarding/issues/235> for more insight.
* We will wait for up to `5` seconds for your webhook endpoint to respond with a `200` status code, and we will retry up to `1` time.
* If we detect that your bounce webhook URL has an error while we try to send a request to it, then we will send you a courtesy email once a week.

### Do you support webhooks

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Looking for documentation on bounce webhooks?  See <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Do you support bounce webhooks?</a> for more insight.
  <span>
  </span>
</div>

Yes, as of May 15, 2020 we have added this feature.  You can simply add webhook(s) exactly like you would with any recipient!  Please ensure that you have the "http" or "https" protocol prefixed in the webhook's URL.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Enhanced Privacy Protection:
  </strong>
  <span>
    If you are on a paid plan (which features enhanced privacy protection), then please go to <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> and click on "Aliases" next to your domain to configure your webhooks.  If you would like to learn more about paid plans see our <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Pricing</a> page.  Otherwise you can continue to follow the instructions below.
  </span>
</div>

If you are on the free plan, then simply add a new DNS <strong class="notranslate">TXT</strong> record as shown below:

For example, if I want all emails that go to `alias@example.com` to forward to a new [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect) test endpoint:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

Or perhaps you want all emails that go to `example.com` to forward to this endpoint:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

**Here are additional notes regarding webhooks:**

* If you need to verify webhook payloads (to ensure they're actually coming from our server), then you can [resolve the remote client IP address client hostname using a reverse lookup](https://nodejs.org/api/dns.html#dnspromisesreverseip) – it should be either `mx1.forwardemail.net` or `mx2.forwardemail.net`.
  * You can also check the IP against [our published IP addresses](#what-are-your-servers-ip-addresses).
  * If you're on a paid plan, then go to My Account → Domains → Settings → Webhook Signature Payload Verification Key to obtain your webhook key.
    * You can rotate this key at anytime for security reasons.
    * Calculate and compare the `X-Webhook-Signature` value from our webhook request with the computed body value using this key.  An example of how to do this is available at [this Stack Overflow post](https://stackoverflow.com/a/68885281).
  * See the discussion at <https://github.com/forwardemail/free-email-forwarding/issues/235> for more insight.
* If a webhook does not respond with a `200` status code, then we will store its response in the [error log created](#do-you-store-error-logs) – which is useful for debugging.
* Webhook HTTP requests will retry up to 3 times every SMTP connection attempt, with a 60 second max timeout per endpoint POST request.  **Note that this does not mean that it only retries 3 times**, it will actually retry continously over time by sending a SMTP code of 421 (which indicates to the sender retry later) after the 3rd failed HTTP POST request attempt.  This means the email will retry continuously for days until a 200 status code is achieved.
* We will retry automatically based off the default status and error codes used in [superagent's retry method](https://ladjs.github.io/superagent/#retrying-requests) (we are maintainers).
* We group together webhook HTTP requests to the same endpoint in one request instead of multiple) in order to save resources and speed up response time.  For example, if you send an email to <webhook1@example.com>, <webhook2@example.com>, and <webhook3@example.com>, and all of these are configured to hit the same *exact* endpoint URL, then only one request will be made.  We group together by exact endpoint matching with strict equality.
* Note that we use the [mailparser](https://nodemailer.com/extras/mailparser/) library's "simpleParser" method to parse the message into a JSON friendly object.
* Raw email value as a String is given as the property "raw".
* Authentication results are given as properties "dkim", "spf", "arc", "dmarc", and "bimi".
* The parsed email headers is given as the property "headers" – but also note you can use "headerLines" for easier iteration and parsing.
* The grouped recipients for this webhook are grouped together and given as the property "recipients".
* The SMTP session information is given as the property "session".  This contains information about the sender of the message, arrival time of the message, HELO, and client hostname.  The client hostname value as `session.clientHostname` is either the FQDN (from a reverse PTR lookup) or it is `session.remoteAddress` wrapped in brackets (e.g. `"[127.0.0.1]"`).
* If you need a quick way to get the value of `X-Original-To`, then you can use the value of `session.recipient` (see example below).  The header `X-Original-To` is a header we add to messages for debugging with the original recipient (before masked forwarding) for the message.
* If you need to remove `attachments` and/or `raw` properties from the payload body, simply add `?attachments=false`, `?raw=false`, or `?attachments=false&raw=false` to your webhook endpoint as a querystring parameter (e.g. `https://example.com/webhook?attachments=false&raw=false`).
* If there are attachments, they will be appended to the `attachments` Array with Buffer values.  You can parse them back into content using an approach with JavaScript such as:

  ```js
  const data = [
    104,
    101,
    108,
    108,
    111,
    32,
    119,
    111,
    114,
    108,
    100,
    33
  ];

  //
  // outputs "hello world!" to the console
  // (this is the content from the filename "text1.txt" in the example JSON request payload above)
  //
  console.log(Buffer.from(data).toString());
  ```

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Curious what the webhook request looks like from forwarded emails?  We've included an example below for you!
  <span>
  </span>
</div>

```json
{
  "attachments": [
    {
      "type": "attachment",
      "content": {
        "type": "Buffer",
        "data": [
          104,
          101,
          108,
          108,
          111,
          32,
          119,
          111,
          114,
          108,
          100,
          33
        ]
      },
      "contentType": "text/plain",
      "partId": "2",
      "release": null,
      "contentDisposition": "attachment",
      "filename": "text1.txt",
      "headers": {},
      "checksum": "fc3ff98e8c6a0d3087d515c0473f8677",
      "size": 12
    }
  ],
  "headers": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\n",
  "headerLines": [
    {
      "key": "arc-seal",
      "line": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0="
    },
    {
      "key": "arc-message-signature",
      "line": "ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino="
    },
    {
      "key": "arc-authentication-results",
      "line": "ARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "received-spf",
      "line": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;"
    },
    {
      "key": "authentication-results",
      "line": "Authentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "x-forward-email-sender",
      "line": "X-Forward-Email-Sender: rfc822; test@example.net"
    },
    {
      "key": "x-forward-email-session-id",
      "line": "X-Forward-Email-Session-ID: w2czxgznghn5ryyw"
    },
    {
      "key": "x-forward-email-version",
      "line": "X-Forward-Email-Version: 9.0.0"
    },
    {
      "key": "content-type",
      "line": "Content-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\""
    },
    {
      "key": "from",
      "line": "From: some <random@example.com>"
    },
    {
      "key": "message-id",
      "line": "Message-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>"
    },
    {
      "key": "date",
      "line": "Date: Wed, 25 May 2022 19:26:41 +0000"
    },
    {
      "key": "mime-version",
      "line": "MIME-Version: 1.0"
    }
  ],
  "html": "<strong>some random text</strong>",
  "text": "some random text",
  "textAsHtml": "<p>some random text</p>",
  "date": "2022-05-25T19:26:41.000Z",
  "from": {
    "value": [
      {
        "address": "random@example.com",
        "name": "some"
      }
    ],
    "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">some</span> &lt;<a href=\"mailto:random@example.com\" class=\"mp_address_email\">random@example.com</a>&gt;</span>",
    "text": "some <random@example.com>"
  },
  "messageId": "<69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>",
  "raw": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nX-Forward-Email-Sender: rfc822; test@example.net\r\nX-Forward-Email-Session-ID: w2czxgznghn5ryyw\r\nX-Forward-Email-Version: 9.0.0\r\nContent-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\"\r\nFrom: some <random@example.com>\r\nMessage-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>\r\nDate: Wed, 25 May 2022 19:26:41 +0000\r\nMIME-Version: 1.0\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: multipart/alternative;\r\n boundary=\"--_NmP-179a735428ca7575-Part_2\"\r\n\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\nsome random text\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\n<strong>some random text</strong>\r\n----_NmP-179a735428ca7575-Part_2--\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: text/plain; name=text1.txt\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=text1.txt\r\n\r\naGVsbG8gd29ybGQh\r\n----_NmP-179a735428ca7575-Part_1--\r\n",
  "dkim": {
    "headerFrom": [
      "random@example.com"
    ],
    "envelopeFrom": "test@example.net",
    "results": [
      {
        "status": {
          "result": "none",
          "comment": "message not signed"
        },
        "info": "dkim=none (message not signed)"
      }
    ]
  },
  "spf": {
    "domain": "example.net",
    "client-ip": "127.0.0.1",
    "helo": "user.oem.local",
    "envelope-from": "test@example.net",
    "status": {
      "result": "none",
      "comment": "mx1.forwardemail.net: example.net does not designate permitted sender hosts",
      "smtp": {
        "mailfrom": "test@example.net",
        "helo": "user.oem.local"
      }
    },
    "header": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;",
    "info": "spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local",
    "lookups": {
      "limit": 50,
      "count": 1
    }
  },
  "arc": {
    "status": {
      "result": "none"
    },
    "i": 0,
    "authResults": "mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
  },
  "dmarc": {
    "status": {
      "result": "none",
      "header": {
        "from": "example.com"
      }
    },
    "domain": "example.com",
    "info": "dmarc=none header.from=example.com"
  },
  "bimi": {
    "status": {
      "header": {},
      "result": "skipped",
      "comment": "DMARC not enabled"
    },
    "info": "bimi=skipped (DMARC not enabled)"
  },
  "recipients": [
    "webhook1@webhooks.net"
  ],
  "session": {
    "recipient": "webhook1@webhooks.net",
    "remoteAddress": "127.0.0.1",
    "remotePort": 65138,
    "clientHostname": "[127.0.0.1]",
    "hostNameAppearsAs": "user.oem.local",
    "sender": "test@example.net",
    "mta": "mx1.forwardemail.net",
    "arrivalDate": "2022-05-25T19:26:41.423Z",
    "arrivalTime": 1653506801423
  }
}
```

### Do you support regular expressions or regex

Yes, as of September 27, 2021 we have added this feature.  You can simply write regular expressions ("regex") for matching aliases and performing substitions.

Regular expression supported aliases are ones that start with a `/` and end with `/` and their recipients are email addresses or webhooks.  The recipients can also include regex substitution support (e.g. `$1`, `$2`).

We support two regular expression flags including `i` and `g`.  The case-insensitive flag of `i` is a permanent default and it is always enforced.  The global flag of `g` can be added by you by affixing the ending `/` with `/g`.

Note that we also support our <a href="#can-i-disable-specific-aliases">disabled alias feature</a> for the recipient portion with our regex support.

Regular expressions are not supported on <a href="/disposable-addresses" target="_blank">global vanity domains</a> (as this could be a security vulnerability).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Enhanced Privacy Protection:
  </strong>
  <span>
    If you are on a paid plan (which features enhanced privacy protection), then please go to <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> and click on "Aliases" next to your domain to configure aliases, including those with regular expressions.  If you would like to learn more about paid plans see our <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Pricing</a> page.
  </span>
</div>

#### Examples for Enhanced Privacy Protection

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Alias Name</th>
      <th>Effect</th>
      <th>Test</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>Emails to `linus@example.com` or `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">view test on RegExr</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>Emails to `24highst@example.com` or `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">view test on RegExr</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    To test these at <a href="https://regexr.com" class="alert-link">RegExr</a>, write the expression in the top box, and then type an example alias in the text box below. If it matches, it will turn blue.
  <span>
  </span>
</div>

#### Examples for the free plan

If you are on the free plan, then simply add a new DNS <strong class="notranslate">TXT</strong> record using one or more of the provided examples below:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Simple Example:</strong> If I want all emails that go to `linus@example.com` or `torvalds@example.com` to forward to `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Firstname Lastname Substitution Example:</strong> Imagine all of your company email addresses are of the `firstname.lastname@example.com` pattern.  If I want all emails that go to the pattern of `firstname.lastname@example.com` to forward to `firstname.lastname@company.com` with substitution support (<a href="https://regexr.com/66hnu" class="alert-link">view test on RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Plus Symbol Filtering Substitution Example:</strong> If I want all emails that go to `info@example.com` or `support@example.com` to forward to `user+info@gmail.com` or `user+support@gmail.com` respectively (with substitution support) (<a href="https://regexr.com/66ho7" class="alert-link">view test on RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Webhook Querystring Substitution Example:</strong> Perhaps you want all emails that go to `example.com` to go to a <a href="#do-you-support-webhooks" class="alert-link">webhook</a> and have a dynamic querystring key of "to" with a value of the username portion of the email address (<a href="https://regexr.com/66ho4" class="alert-link">view test on RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Quiet reject example:</strong> If you want all emails that match a certain pattern to be disabled and quietly reject (appears to sender as if the message was sent successfully, but actually goes nowhere) with status code `250` (see <a href="#can-i-disable-specific-aliases" class="alert-link">Can I disable specific aliases</a>), then simply use the same approach with a single exclamation mark "!".  This indicates to the sender that the message was successfully delivered, but it actually went nowhere (e.g. blackhole or `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Soft reject example:</strong> If you want all emails that match a certain pattern to be disabled and soft reject with status code `421` (see <a href="#can-i-disable-specific-aliases" class="alert-link">Can I disable specific aliases</a>), then simply use the same approach with a double exclamation mark "!!".  This indicates to the sender to retry their email, and emails to this alias will be retried for approximately 5 days and then reject permanently.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Hard reject example:</strong> If you want all emails that match a certain pattern to be disabled and hard reject with status code `550` (see <a href="#can-i-disable-specific-aliases" class="alert-link">Can I disable specific aliases</a>), then simply use the same approach with a triple exclamation mark "!!!".  This indicates to the sender of a permanent error and emails will not retry, they will be rejected for this alias.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Curious how to write a regular expression or need to test your replacement?  You can go to the free regular expression testing website <a href="https://regexr.com" class="alert-link">RegExr</a> at <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
  <span>
  </span>
</div>

### What are your outbound SMTP limits

We rate limit users and domains to 300 outbound SMTP messages per 1 day. This averages 9000+ emails in a calendar month. If you need to exceed this amount or have consistently large emails, then please [contact us](https://forwardemail.net/help).

### Do I need approval to enable SMTP

Yes, please note that in order to maintain IP reputation and ensure deliverability, Forward Email has a manual review process on a per-domain basis for outbound SMTP approval. Email <support@forwardemail.net> or open a [help request](https://forwardemail.net/help) for approval. This typically takes less than 24 hours, with most requests being honored within 1-2 hours. In the near future we aim to make this process instant with additional spam controls and alerting. This process ensures that your emails reach the inbox and your messages don't get marked as spam.

### What are your SMTP server configuration settings

Our server is `smtp.forwardemail.net` and is also monitored on our <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">status page</a>.

It supports both IPv4 and IPv6 and is available over ports `465` and `2465` for SSL/TLS and `587`, `2587`, `2525`, and `25` for TLS (STARTTLS).

**As of October 2025**, we now support **legacy TLS 1.0** connections on ports `2455` (SSL/TLS) and `2555` (STARTTLS) for older devices such as printers, scanners, cameras, and legacy email clients that cannot support modern TLS versions. These ports are provided as an alternative to Gmail, Yahoo, Outlook, and other providers that have discontinued support for older TLS protocols.

> \[!CAUTION]
> **Legacy TLS 1.0 Support (Ports 2455 and 2555)**: These ports use the deprecated TLS 1.0 protocol which has known security vulnerabilities (BEAST, POODLE). Only use these ports if your device absolutely cannot support TLS 1.2 or higher. We strongly recommend upgrading your device firmware or switching to modern email clients whenever possible. These ports are intended solely for legacy hardware compatibility (old printers, scanners, cameras, IoT devices).

|                                     Protocol                                     | Hostname                |            Ports            |        IPv4        |        IPv6        | Notes                                  |
| :------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **Preferred**                             | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | Modern TLS 1.2+ (Recommended)          |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | Modern TLS 1.2+ (Recommended)          |
|                             `SSL/TLS` **Legacy Only**                            | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 for old devices only |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **Legacy Only** | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 for old devices only |

| Login    | Example                    | Description                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`         | Email address of an alias that exists for the domain at <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a>. |
| Password | `************************` | Alias                                                                                                                                                                                     |

In order to send outbound email with SMTP, the **SMTP user** must be the email address of an alias that exists for the domain at <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a> – and the **SMTP password** must be an alias-specific generated password.

Please refer to [Do you support sending email with SMTP](#do-you-support-sending-email-with-smtp) for step by step instructions.

### What are your IMAP server configuration settings

Our server is `imap.forwardemail.net` and is also monitored on our <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">status page</a>.

It supports both IPv4 and IPv6 and is available over ports `993` and `2993` for SSL/TLS.

|         Protocol        | Hostname                |     Ports     |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferred** | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Login    | Example                    | Description                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`         | Email address of an alias that exists for the domain at <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a>. |
| Password | `************************` | Alias-specific generated password.                                                                                                                                                        |

In order to connect with IMAP, the **IMAP user** must be the email address of an alias that exists for the domain at <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a> – and the **IMAP password** must be an alias-specific generated password.

Please refer to [Do you support receiving email with IMAP](#do-you-support-receiving-email-with-imap) for step by step instructions.

### What are your POP3 server configuration settings

Our server is `pop3.forwardemail.net` and is also monitored on our <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">status page</a>.

It supports both IPv4 and IPv6 and is available over ports `995` and `2995` for SSL/TLS.

|         Protocol        | Hostname                |     Ports     |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferred** | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |

| Login    | Example                    | Description                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`         | Email address of an alias that exists for the domain at <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a>. |
| Password | `************************` | Alias-specific generated password.                                                                                                                                                        |

In order to connect with POP3, the **POP3 user** must be the email address of an alias that exists for the domain at <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a> – and the **IMAP password** must be an alias-specific generated password.

Please refer to [Do you support POP3](#do-you-support-pop3) for step by step instructions.


## Security

### Advanced Server Hardening Techniques

> \[!TIP]
> Learn more about our security infrastructure on [our Security page](/security).

Forward Email implements numerous server hardening techniques to ensure the security of our infrastructure and your data:

1. **Network Security**:
   * IP tables firewall with strict rules
   * Fail2ban for brute force protection
   * Regular security audits and penetration testing
   * VPN-only adm​inistrative access

2. **System Hardening**:
   * Minimal package installation
   * Regular security updates
   * SELinux in enforcing mode
   * Disabled root SSH access
   * Key-based authentication only

3. **Application Security**:
   * Content Security Policy (CSP) headers
   * HTTPS Strict Transport Security (HSTS)
   * XSS protection headers
   * Frame options and referrer policy headers
   * Regular dependency audits

4. **Data Protection**:
   * Full disk encryption with LUKS
   * Secure key management
   * Regular backups with encryption
   * Data minimization practices

5. **Monitoring and Response**:
   * Real-time intrusion detection
   * Automated security scanning
   * Centralized logging and analysis
   * Incident response procedures

> \[!IMPORTANT]
> Our security practices are continuously updated to address emerging threats and vulnerabilities.

> \[!TIP]
> For maximum security, we recommend using our service with end-to-end encryption via OpenPGP.

### Do you have SOC 2 or ISO 27001 certifications

> \[!NOTE]
> Forward Email operates on infrastructure provided by certified subprocessors to ensure compliance with industry standards.

Forward Email does not directly hold SOC 2 Type II or ISO 27001 certifications. However, the service operates on infrastructure provided by certified subprocessors:

* **DigitalOcean**: SOC 2 Type II and SOC 3 Type II certified (audited by Schellman & Company LLC), ISO 27001 certified at multiple data centers. Details: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: SOC 2+ (HIPAA) certified, ISO/IEC certifications: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Details: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2 compliant (contact DataPacket directly to obtain certification), enterprise-grade infrastructure provider (Denver location). Details: <https://www.datapacket.com/datacenters/denver>

Forward Email follows industry best practices for security audits and regularly engages with independent security researchers. Source: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Do you use TLS encryption for email forwarding

Yes. Forward Email strictly enforces TLS 1.2+ for all connections (HTTPS, SMTP, IMAP, POP3) and implements MTA-STS for enhanced TLS support. The implementation includes:

* TLS 1.2+ enforcement for all email connections
* ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) key exchange for perfect forward secrecy
* Modern cipher suites with regular security updates
* HTTP/2 support for improved performance and security
* HSTS (HTTP Strict Transport Security) with preloading in major browsers
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** for strict TLS enforcement

Source: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS Implementation**: Forward Email implements strict MTA-STS enforcement in the codebase. When TLS errors occur and MTA-STS is enforced, the system returns 421 SMTP status codes to ensure emails are retried later rather than being delivered insecurely. Implementation details:

* TLS error detection: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* MTA-STS enforcement in send-email helper: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Third-party validation: <https://www.hardenize.com/report/forwardemail.net/1750312779> shows "Good" ratings for all TLS and transport security measures.

### Do you preserve email authentication headers

Yes. Forward Email comprehensively implements and preserves email authentication headers:

* **SPF (Sender Policy Framework)**: Properly implemented and preserved
* **DKIM (DomainKeys Identified Mail)**: Full support with proper key management
* **DMARC**: Policy enforcement for emails that fail SPF or DKIM validation
* **ARC**: While not explicitly detailed, the service's perfect compliance scores suggest comprehensive authentication header handling

Source: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validation: Internet.nl Mail Test shows 100/100 score specifically for "SPF, DKIM, and DMARC" implementation. Hardenize assessment confirms "Good" ratings for SPF and DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Do you preserve original email headers and prevent spoofing

> \[!TIP]
> Forward Email implements sophisticated anti-spoofing protection to prevent email abuse.

Forward Email preserves original email headers while implementing comprehensive anti-spoofing protection through the MX codebase:

* **Header Preservation**: Original authentication headers are maintained during forwarding
* **Anti-Spoofing**: DMARC policy enforcement prevents header spoofing by rejecting emails that fail SPF or DKIM validation
* **Header Injection Prevention**: Input validation and sanitization using striptags library
* **Advanced Protection**: Sophisticated phishing detection with spoofing detection, impersonation prevention, and user notification systems

**MX Implementation Details**: The core email processing logic is handled by the MX server codebase, specifically:

* Main MX data handler: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Arbitrary email filtering (anti-spoofing): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

The `isArbitrary` helper implements sophisticated anti-spoofing rules including detection of domain impersonation, blocked phrases, and various phishing patterns.

Source: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### How do you protect against spam and abuse

Forward Email implements comprehensive multi-layer protection:

* **Rate Limiting**: Applied to authentication attempts, API endpoints, and SMTP connections
* **Resource Isolation**: Between users to prevent impact from high-volume users
* **DDoS Protection**: Multi-layer protection through DataPacket's Shield system and Cloudflare
* **Automatic Scaling**: Dynamic resource adjustment based on demand
* **Abuse Prevention**: User-specific abuse prevention checks and hash-based blocking for malicious content
* **Email Authentication**: SPF, DKIM, DMARC protocols with advanced phishing detection

Sources:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (DDoS protection details)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Do you store email content on disk

> \[!IMPORTANT]
> Forward Email uses a zero-knowledge architecture that prevents email content from being written to disk.

* **Zero-Knowledge Architecture**: Individually encrypted SQLite mailboxes mean Forward Email cannot access email content
* **In-Memory Processing**: Email processing occurs entirely in memory, avoiding disk storage
* **No Content Logging**: "We do not log or store email content or metadata to disk"
* **Sandboxed Encryption**: Encryption keys are never stored on disk in plaintext

**MX Codebase Evidence**: The MX server processes emails entirely in memory without writing content to disk. The main email processing handler demonstrates this in-memory approach: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Sources:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Abstract)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Zero-knowledge details)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Sandboxed encryption)

### Can email content be exposed during system crashes

No. Forward Email implements comprehensive safeguards against crash-related data exposure:

* **Core Dumps Disabled**: Prevents memory exposure during crashes
* **Swap Memory Disabled**: Completely disabled to prevent sensitive data extraction from swap files
* **In-Memory Architecture**: Email content exists only in volatile memory during processing
* **Encryption Key Protection**: Keys are never stored on disk in plaintext
* **Physical Security**: LUKS v2 encrypted disks prevent physical access to data
* **USB Storage Disabled**: Prevents unauthorized data extraction

**Error Handling for System Issues**: Forward Email uses helper functions `isCodeBug` and `isTimeoutError` to ensure that if any database connectivity issues, DNS network/blocklist issues, or upstream connectivity issues occur, the system returns 421 SMTP status codes to ensure emails will be retried later rather than being lost or exposed.

Implementation details:

* Error classification: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Timeout error handling in MX processing: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Source: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Who has access to your email infrastructure

Forward Email implements comprehensive access controls for its minimal 2-3 person engineering team access with strict 2FA requirements:

* **Role-Based Access Control**: For team accounts with resource-based permissions
* **Least Privilege Principle**: Applied throughout all systems
* **Segregation of Duties**: Between operational roles
* **User Management**: Separate deploy and devops users with distinct permissions
* **Root Login Disabled**: Forces access through properly authenticated accounts
* **Strict 2FA**: No SMS-based 2FA due to risk of MiTM attacks - only app-based or hardware tokens
* **Comprehensive Audit Logging**: With sensitive data redaction
* **Automated Anomaly Detection**: For unusual access patterns
* **Regular Security Reviews**: Of access logs
* **Evil Maid Attack Prevention**: USB storage disabled and other physical security measures

Sources:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Authorization Controls)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Network Security)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Evil maid attack prevention)

### What infrastructure providers do you use

> \[!IMPORTANT]
> Forward Email uses multiple infrastructure subprocessors with comprehensive compliance certifications.

Complete details are available on our GDPR compliance page: <https://forwardemail.net/gdpr>

**Primary Infrastructure Subprocessors:**

| Provider         | Data Privacy Framework Certified | GDPR Compliance Page                            |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **Cloudflare**   | ✅ Yes                            | <https://www.cloudflare.com/trust-hub/gdpr/>    |
| **DataPacket**   | ❌ No                             | <https://www.datapacket.com/privacy-policy>     |
| **DigitalOcean** | ❌ No                             | <https://www.digitalocean.com/legal/gdpr>       |
| **Vultr**        | ❌ No                             | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**Detailed Certifications:**

**DigitalOcean**

* SOC 2 Type II & SOC 3 Type II (audited by Schellman & Company LLC)
* ISO 27001 certified at multiple data centers
* PCI-DSS compliant
* CSA STAR Level 1 certified
* APEC CBPR PRP certified
* Details: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+ (HIPAA) certified
* PCI Merchant compliant
* CSA STAR Level 1 certified
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Details: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* SOC 2 compliant (contact DataPacket directly to obtain certification)
* Enterprise-grade infrastructure (Denver location)
* DDoS protection through Shield cybersecurity stack
* 24/7 technical support
* Global network across 58 data centers
* Details: <https://www.datapacket.com/datacenters/denver>

**Payment Processors:**

* **Stripe**: Data Privacy Framework certified - <https://stripe.com/legal/privacy-center>
* **PayPal**: Not DPF certified - <https://www.paypal.com/uk/legalhub/privacy-full>

### Do you offer a Data Processing Agreement (DPA)

Yes, Forward Email offers a comprehensive Data Processing Agreement (DPA) that can be signed with our enterprise agreement. A copy of our DPA is available at: <https://forwardemail.net/dpa>

**DPA Details:**

* Covers GDPR compliance and EU-US/Swiss-US Privacy Shield frameworks
* Automatically accepted when agreeing to our Terms of Service
* No separate signature required for standard DPA
* Custom DPA arrangements available through Enterprise License

**GDPR Compliance Framework:**
Our DPA details compliance with GDPR as well as international data transfer requirements. Complete information is available at: <https://forwardemail.net/gdpr>

For enterprise customers requiring custom DPA terms or specific contractual arrangements, these can be addressed through our **Enterprise License ($250/month)** program.

### How do you handle data breach notifications

> \[!NOTE]
> Forward Email's zero-knowledge architecture significantly limits breach impact.

* **Limited Data Exposure**: Cannot access encrypted email content due to zero-knowledge architecture
* **Minimal Data Collection**: Only basic subscriber information and limited IP logs for security
* **Subprocessor Frameworks**: DigitalOcean and Vultr maintain GDPR-compliant incident response procedures

**GDPR Representative Information:**
Forward Email has appointed GDPR representatives in accordance with Article 27:

**EU Representative:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**UK Representative:**
Osano UK Compliance LTD
ATTN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

For enterprise customers requiring specific breach notification SLAs, these should be discussed as part of an **Enterprise License** agreement.

Sources:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Do you offer a test environment

Forward Email's technical documentation does not explicitly describe a dedicated sandbox mode. However, potential testing approaches include:

* **Self-Hosting Option**: Comprehensive self-hosting capabilities for creating test environments
* **API Interface**: Potential for programmatic testing of configurations
* **Open Source**: 100% open-source code allows customers to examine forwarding logic
* **Multiple Domains**: Support for multiple domains could enable test domain creation

For enterprise customers requiring formal sandbox capabilities, this should be discussed as part of an **Enterprise License** arrangement.

Source: <https://github.com/forwardemail/forwardemail.net> (Development environment details)

### Do you provide monitoring and alerting tools

Forward Email provides real-time monitoring with some limitations:

**Available:**

* **Real-Time Delivery Monitoring**: Publicly visible performance metrics for major email providers
* **Automatic Alerting**: Engineering team alerted when delivery times exceed 10 seconds
* **Transparent Monitoring**: 100% open-source monitoring systems
* **Infrastructure Monitoring**: Automated anomaly detection and comprehensive audit logging

**Limitations:**

* Customer-facing webhooks or API-based delivery status notifications are not explicitly documented

For enterprise customers requiring detailed delivery status webhooks or custom monitoring integrations, these capabilities may be available through **Enterprise License** arrangements.

Sources:

* <https://forwardemail.net> (Real-time monitoring display)
* <https://github.com/forwardemail/forwardemail.net> (Monitoring implementation)

### How do you ensure high availability

> \[!IMPORTANT]
> Forward Email implements comprehensive redundancy across multiple infrastructure providers.

* **Distributed Infrastructure**: Multiple providers (DigitalOcean, Vultr, DataPacket) across geographic regions
* **Geographic Load Balancing**: Cloudflare-based geo-located load balancing with automatic failover
* **Automatic Scaling**: Dynamic resource adjustment based on demand
* **Multi-Layer DDoS Protection**: Through DataPacket's Shield system and Cloudflare
* **Server Redundancy**: Multiple servers per region with automatic failover
* **Database Replication**: Real-time data synchronization across multiple locations
* **Monitoring and Alerting**: 24/7 monitoring with automatic incident response

**Uptime Commitment**: 99.9%+ service availability with transparent monitoring available at <https://forwardemail.net>

Sources:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Are you compliant with Section 889 of the National Defense Authorization Act (NDAA)

> \[!IMPORTANT]
> Forward Email is fully compliant with Section 889 through careful selection of infrastructure partners.

Yes, Forward Email is **Section 889 compliant**. Section 889 of the National Defense Authorization Act (NDAA) prohibits government agencies from using or contracting with entities that use telecommunications and video surveillance equipment from specific companies (Huawei, ZTE, Hikvision, Dahua, and Hytera).

**How Forward Email Achieves Section 889 Compliance:**

Forward Email relies exclusively on two key infrastructure providers, neither of which uses Section 889 prohibited equipment:

1. **Cloudflare**: Our primary partner for network services and email security
2. **DataPacket**: Our primary provider for server infrastructure (using Arista Networks and Cisco equipment exclusively)
3. **Backup Providers**: Our backup providers of Digital Ocean and Vultr are additionally confirmed in writing as being Section 889 compliant.

**Cloudflare's Commitment**: Cloudflare explicitly states in their Third Party Code of Conduct that they do not use telecommunications equipment, video surveillance products, or services from any Section 889 prohibited entities.

**Government Use Case**: Our Section 889 compliance was validated when the **US Naval Academy** selected Forward Email for their secure email forwarding needs, requiring documentation of our federal compliance standards.

For complete details about our government compliance framework, including broader federal regulations, read our comprehensive case study: [Federal Government Email Service Section 889 Compliant](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## System and Technical Details

### Do you store emails and their contents

No, we do not write to disk or store logs – with the [exception of errors](#do-you-store-error-logs) and [outbound SMTP](#do-you-support-sending-email-with-smtp) (see our [Privacy Policy](/privacy)).

Everything is done in-memory and [our source code is on GitHub](https://github.com/forwardemail).

### How does your email forwarding system work

Email relies on the [SMTP protocol](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol).  This protocol consists of commands sent to a server (running most commonly on port 25).  There is an initial connection, then the sender indicates who the mail is from ("MAIL FROM"), followed by where it's going to ("RCPT TO"), and finally the headers and the body of the email itself ("DATA").  The flow of our email forwarding system is described relative to each SMTP protocol command below:

* Initial Connection (no command name, e.g. `telnet example.com 25`) - This is the initial connection.  We check senders that aren't in our [allowlist](#do-you-have-an-allowlist) against our [denylist](#do-you-have-a-denylist).  Finally, if a sender is not in our allowlist, then we check to see if they have been [greylisted](#do-you-have-a-greylist).

* `HELO` - This indicates a greeting to identify the sender's FQDN, IP address, or mail handler name.  This value can be spoofed, so we do not rely on this data and instead use the reverse hostname lookup of the connection's IP address.

* `MAIL FROM` - This indicates the envelope mail from address of the email.  If a value is entered, it must be a valid RFC 5322 email address.  Empty values are permitted.  We [check for backscatter](#how-do-you-protect-against-backscatter) here, and we also check the MAIL FROM against our [denylist](#do-you-have-a-denylist).  We finally check senders that are not on the allowlist for rate limiting (see the section on [Rate Limiting](#do-you-have-rate-limiting) and [allowlist](#do-you-have-an-allowlist) for more information).

* `RCPT TO` - This indicates the recipient(s) of the email.  These must be valid RFC 5322 email addresses.  We only permit up to 50 envelope recipients per message (this is different than the "To" header from an email).  We also check for a valid [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") address here to protect against spoofing with our SRS domain name.

* `DATA` - This is the core part of our service which processes an email.  See the section [How do you process an email for forwarding](#how-do-you-process-an-email-for-forwarding) below for more insight.

### How do you process an email for forwarding

This section describes our process related to the SMTP protocol command `DATA` in the section [How does your email forwarding system work](#how-does-your-email-forwarding-system-work) above – it is how we process an email's headers, body, security, determine where it needs to be delivered to, and how we handle connections.

1. If the message exceeds the maximum size of 50mb, then it is rejected with a 552 error code.

2. If the message did not contain a "From" header, or if any of the values in the "From" header were not valid RFC 5322 email addresses, then it is rejected with a 550 error code.

3. If the message had more than 25 "Received" headers, then it was determined to have been stuck in a redirect loop, and it is rejected with a 550 error code.

4. Using the email's fingerprint (see the section on [Fingerprinting](#how-do-you-determine-an-email-fingerprint)), we will check to see the message has been attempted to be retried for more than 5 days (which matches [default postfix behavior](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), and if so, then it will be rejected with a 550 error code.

5. We store in-memory the results from scanning the email using [Spam Scanner](https://spamscanner.net).

6. If there were any arbitrary results from Spam Scanner, then it is rejected with a 554 error code.  Arbitrary results only include the GTUBE test at the time of this writing.  See <https://spamassassin.apache.org/gtube/> for more insight.

7. We will add the following headers to the message for debugging and abuse prevention purposes:

   * `Received` - we add this standard Received header with origin IP and host, transmission type, TLS connection information, date/time, and recipient.
   * `X-Original-To` - the original recipient for the message:
     * This is useful for determining where an email was originally delivered to (in addition to the "Received" header).
     * This is added on a per recipient basis at the time of IMAP and/or masked forwarding (in order to protect privacy).
   * `X-Forward-Email-Website` - contains a link to our website of <https://forwardemail.net>
   * `X-Forward-Email-Version` - the current [SemVer](https://semver.org/) version from `package.json` of our codebase.
   * `X-Forward-Email-Session-ID` - a session ID value used for debug purposes (only applies in non-production environments).
   * `X-Forward-Email-Sender` - a comma separated list containing the original envelope MAIL FROM address (if it was not blank), the reverse PTR client FQDN (if it exists), and the sender's IP address.
   * `X-Forward-Email-ID` - this is only applicable for outbound SMTP and correlates to the email ID stored in My Account → Emails
   * `X-Report-Abuse` - with a value of `abuse@forwardemail.net`.
   * `X-Report-Abuse-To` - with a value of `abuse@forwardemail.net`.
   * `X-Complaints-To` - with a value of `abuse@forwardemail.net`.

8. We then check the message for [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain), and [DMARC](https://en.wikipedia.org/wiki/DMARC).

   * If the message failed DMARC and the domain had a rejection policy (e.g. `p=reject` [was in the DMARC policy](https://wikipedia.org/wiki/DMARC)), then it is rejected with a 550 error code.  Typically a DMARC policy for a domain can be found in the `_dmarc` sub-domain <strong class="notranslate">TXT</strong> record, (e.g. `dig _dmarc.example.com txt`).
   * If the message failed SPF and the domain had a hard fail policy (e.g. `-all` was in the SPF policy as opposed to `~all` or no policy at all), then it is rejected with a 550 error code.  Typically an SPF policy for a domain can be found in the <strong class="notranslate">TXT</strong> record for the root domain (e.g. `dig example.com txt`).  See this section for more information on [sending mail as with Gmail](#can-i-send-mail-as-in-gmail-with-this) regarding SPF.

9. Now we process the recipients of the message as collected from the `RCPT TO` command in the section [How does your email forwarding system work](#how-does-your-email-forwarding-system-work) above.  For each recipient, we perform the following operations:

   * We lookup the <strong class="notranslate">TXT</strong> records of the domain name (the part after the `@` symbol, e.g. `example.com` if the email address was `test@example.com`).  For example, if the domain is `example.com` we do a DNS lookup such as `dig example.com txt`.
   * We parse all <strong class="notranslate">TXT</strong> records that start with either `forward-email=` (free plans) or `forward-email-site-verification=` (paid plans).  Note that we parse both, in order to process emails while a user is upgrading or downgrading plans.
   * From these parsed <strong class="notranslate">TXT</strong> records, we iterate over them to extract the forwarding configuration (as described in the section [How do I get started and set up email forwarding](#how-do-i-get-started-and-set-up-email-forwarding) above).  Note that we only support one `forward-email-site-verification=` value, and if more than one is supplied, then a 550 error will occur and the sender will receive a bounce for this recipient.
   * Recursively we iterate over the extracted forwarding configuration to determine global forwarding, regex based forwarding, and all other supported forwarding configurations – which are now known as our "Forwarding Addresses".
   * For each Forwarding Address, we support one recursive lookup (which will start this series of operations over on the given address).  If a recursive match was found, then the parent result will be removed from Forwarding Addresses, and the children added.
   * Forwarding Addresses are parsed for uniqueness (since we don't want to send duplicates to one address or spawn additionally unnecessary SMTP client connections).
   * For each Forwarding Address, we lookup its domain name against our API endpoint `/v1/max-forwarded-addresses` (in order to determine how many addresses the domain is permitted to forward email to per alias, e.g. 10 by default – see the section on [maximum limit on forwarding per alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)).  If this limit is exceeded, then a 550 error will occur and the sender will receive a bounce for this recipient.
   * We lookup the settings of the original recipient against our API endpoint `/v1/settings`, which supports a lookup for paid users (with a fallback for free users).  This returns a configuration object for advanced settings for `port` (Number, e.g. `25`), `has_adult_content_protection` (Boolean), `has_phishing_protection` (Boolean), `has_executable_protection` (Boolean), and `has_virus_protection` (Boolean).
   * Based off these settings, we then check against Spam Scanner results and if any errors occur, then the message is rejected with a 554 error code (e.g. if `has_virus_protection` is enabled, then we will check the Spam Scanner results for viruses).  Note that all free plan users will be opted-in for checks against adult-content, phishing, executables, and viruses.  By default, all paid plan users are opted-in as well, but this configuration can be altered under the Settings page for a domain in the Forward Email dashboard).

10. For each processed recipient's Forwarding Addresses, we then perform the following operations:

    * The address is checked against our [denylist](#do-you-have-a-denylist), and if it was listed, then a 421 error code will occur (indicates to sender to retry again later).
    * If the address is a webhook, then we set a Boolean for future operations (see below – we group together similar webhooks to make one POST request vs. multiple for delivery).
    * If the address is an email address, then we parse the host for future operations (see below – we group together similar hosts to make one connection vs. multiple individual connections for delivery).

11. If there are no recipients and there are no bounces, then we respond with a 550 error of "Invalid recipients".

12. If there are recipients, then we iterate over them (grouped together by the same host) and deliver the emails.  See the section [How do you handle email delivery issues](#how-do-you-handle-email-delivery-issues) below for more insight.

    * If any errors occur while sending emails, then we will store them in-memory for later processing.
    * We will take the lowest error code (if any) from sending emails – and use that as the response code to the `DATA` command.  This means that emails not delivered will typically be retried by the original sender, yet emails that were already delivered will not be re-sent the next time the message is sent (as we use [Fingerprinting](#how-do-you-determine-an-email-fingerprint)).
    * If no errors occurred, then we will send a 250 successful SMTP response status code.
    * A bounce is determined to be any delivery attempted that results in a status code that is >= 500 (permanent failures).

13. If no bounces occurred (permanent failures), then we will return a SMTP response status code of the lowest error code from non-permanent failures (or a 250 successful status code if there were none).

14. If bounces did occur then we will send bounce emails in the background after returning the lowest of all error codes to the sender.  However, if the lowest error code is >= 500, then we do not send any bounce emails.  This is because if we did, then senders would receive a double bounce email (e.g. one from their outbound MTA, such as Gmail – and also one from us).  See the section on [How do you protect against backscatter](#how-do-you-protect-against-backscatter) below for more insight.

### How do you handle email delivery issues

Note that we will do a "Friendly-From" rewrite on the emails if and only if the DMARC policy of the sender was not passing AND no DKIM signatures were aligned with the "From" header.  This means that we will alter the "From" header on the message, set "X-Original-From", and also set a "Reply-To" if it was not already set.  We will also re-seal the ARC seal on the message after altering these headers.

We also use smart-parsing of error messages at every level of our stack – in our code, DNS requests, Node.js internals, HTTP requests (e.g. 408, 413, and 429 are mapped to the SMTP response code of 421 if the recipient is a webhook), and mail server responses (e.g. responses with "defer" or "slowdown" would be retried as 421 errors).

Our logic is dummy-proof and it will also retry for SSL/TLS errors, connection issues, and more.  The goal with dummy-proofing is to maximize deliverability to all recipients for a forwarding configuration.

If the recipient is a webhook, then we will permit a 60 second timeout for the request to complete with up to 3 retries (so 4 requests total before a failure).  Note that we correctly parse error codes 408, 413, and 429 and map them to a SMTP response code of 421.

Otherwise if the recipient is an email address, then we will attempt to send the email with opportunistic TLS (we attempt to use STARTTLS if it is available on the recipient mail server).  If a SSL/TLS error occurs while attempting to send the email, then we will attempt to send the email without TLS (without using STARTTLS).

If any DNS or connection errors occur, then we will return to the `DATA` command a SMTP response code of 421, otherwise if there are >= 500 level errors, then bounces will be sent.

If we detect that an email server we are attempting to deliver to has one or more of our mail exchange IP addresses blocked (e.g. by whatever technology they use for deferring spammers), then we will send a SMTP response code of 421 for the sender to retry their message later (and we are alerted to the issue so we can hopefully resolve it before the next attempt).

### How do you handle your IP addresses becoming blocked

We routinely monitor all major DNS denylists and if any of our mail exchange ("MX") IP addresses are listed in a major denylist, we will pull it out of the relevant DNS A record round robin if possible until it the issue is resolved.

At the time of this writing, we are listed in several DNS allowlists as well, and we take monitoring denylists seriously.  If you see any issues before we have a chance to resolve them, please notify us in writing at <support@forwardemail.net>.

Our IP addresses are publicly available, [see this section below for more insight](#what-are-your-servers-ip-addresses).

### What are postmaster addresses

In order to prevent misdirected bounces and sending vacation responder messages to unmonitored or nonexistent mailboxes, we maintain a list of mailer-daemon like usernames:

* `automailer`
* `autoresponder`
* `bounce`
* `bounce-notification`
* `bounce-notifications`
* `bounces`
* `hostmaster`
* `listserv`
* `localhost`
* `mail-daemon`
* `mail.daemon`
* `maildaemon`
* `mailer-daemon`
* `mailer.daemon`
* `mailerdaemon`
* `majordomo`
* `postmaster`
* [and any no-reply address](#what-are-no-reply-addresses)

See [RFC 5320 Section 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) for more insight into how lists such as these are used to create efficient email systems.

### What are no-reply addresses

Email usernames equal to any of the following (case-insensitive) are considered to be no-reply addresses:

* `do-not-reply`
* `do-not-respond`
* `do.not.reply`
* `donotreply`
* `donotrespond`
* `dont-reply`
* `naoresponda`
* `no-replies`
* `no-reply`
* `no-replys`
* `no.replies`
* `no.reply`
* `no.replys`
* `no_reply`
* `nobody`
* `noreplies`
* `noreply`
* `noreplys`

This list is maintained [as an open-source project on GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### What are your server's IP addresses

We publish our IP addresses at <https://forwardemail.net/ips>.

### Do you have an allowlist

Yes, we have a [list of domain name extensions](#what-domain-name-extensions-are-allowlisted-by-default) that are allowlisted by default and a dynamic, cached, and rolling allowlist based off [strict criteria](#what-is-your-allowlist-criteria).

All domains, emails, and IP addresses used by paying customers are automatically checked against our denylist hourly – which alerts admins who can manually intervene if necessary.

Additionally, if one of your domains or its email addresses are denylisted (e.g. for sending spam, viruses, or due to impersonation attacks) – then the domain admins (you) and our team admins will be notified by email immediately.  We strongly recommend that you [configure DMARC](#how-do-i-set-up-dmarc-for-forward-email) to prevent this.

### What domain name extensions are allowlisted by default

The following domain name extensions are considered to be allowlisted by default (regardless if they are on the Umbrella Popularity List or not):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">edu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov</code></li>
  <li class="list-inline-item"><code class="notranslate">mil</code></li>
  <li class="list-inline-item"><code class="notranslate">int</code></li>
  <li class="list-inline-item"><code class="notranslate">arpa</code></li>
  <li class="list-inline-item"><code class="notranslate">dni.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fed.us</code></li>
  <li class="list-inline-item"><code class="notranslate">isa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">kids.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nsn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ak.us</code></li>
  <li class="list-inline-item"><code class="notranslate">al.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ar.us</code></li>
  <li class="list-inline-item"><code class="notranslate">as.us</code></li>
  <li class="list-inline-item"><code class="notranslate">az.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ca.us</code></li>
  <li class="list-inline-item"><code class="notranslate">co.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ct.us</code></li>
  <li class="list-inline-item"><code class="notranslate">dc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">de.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fl.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ga.us</code></li>
  <li class="list-inline-item"><code class="notranslate">gu.us</code></li>
  <li class="list-inline-item"><code class="notranslate">hi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ia.us</code></li>
  <li class="list-inline-item"><code class="notranslate">id.us</code></li>
  <li class="list-inline-item"><code class="notranslate">il.us</code></li>
  <li class="list-inline-item"><code class="notranslate">in.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ks.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ky.us</code></li>
  <li class="list-inline-item"><code class="notranslate">la.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ma.us</code></li>
  <li class="list-inline-item"><code class="notranslate">md.us</code></li>
  <li class="list-inline-item"><code class="notranslate">me.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mo.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ne.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nj.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nm.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ny.us</code></li>
  <li class="list-inline-item"><code class="notranslate">oh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ok.us</code></li>
  <li class="list-inline-item"><code class="notranslate">or.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pr.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ri.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tx.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ut.us</code></li>
  <li class="list-inline-item"><code class="notranslate">va.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wy.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.au</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.at</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.br</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">school.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">cri.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">health.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.in</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.in</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.in</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ed.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">lg.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.za</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.za</code></li>
  <li class="list-inline-item"><code class="notranslate">school.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">hs.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">es.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">kg.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.es</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.th</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.th</code></li>
  <li class="list-inline-item"><code class="notranslate">admin.ch</code></li>
  <li class="list-inline-item"><code class="notranslate">canada.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">go.id</code></li>
  <li class="list-inline-item"><code class="notranslate">go.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">go.ke</code></li>
  <li class="list-inline-item"><code class="notranslate">go.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">go.th</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.ar</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.es</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.mx</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gob.pe</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gob.ve</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.sv</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.nc</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.qc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ad</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.af</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ai</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.al</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.am</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ao</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.au</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.aw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ax</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.az</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.be</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bm</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gov.by</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.co</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cy</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.dz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.eg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fi</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ie</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.il</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.im</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.in</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.iq</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ir</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.it</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.je</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kp</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.krd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ky</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lb</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lv</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ma</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mm</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mo</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.my</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ng</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.np</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ph</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.py</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ro</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ru</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.scot</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.se</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.si</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.vn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.wales</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.za</code></li>
  <li class="list-inline-item"><code class="notranslate">government.pn</code></li>
  <li class="list-inline-item"><code class="notranslate">govt.nz</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gv.at</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">bl.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">mod.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">nhs.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">police.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">rct.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">royal.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>

Additionally these [brand and corporate top-level domains](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) are allowlisted by default (e.g. `apple` for `applecard.apple` for Apple Card bank statements):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">aaa</code></li>
  <li class="list-inline-item"><code class="notranslate">aarp</code></li>
  <li class="list-inline-item"><code class="notranslate">abarth</code></li>
  <li class="list-inline-item"><code class="notranslate">abb</code></li>
  <li class="list-inline-item"><code class="notranslate">abbott</code></li>
  <li class="list-inline-item"><code class="notranslate">abbvie</code></li>
  <li class="list-inline-item"><code class="notranslate">abc</code></li>
  <li class="list-inline-item"><code class="notranslate">accenture</code></li>
  <li class="list-inline-item"><code class="notranslate">aco</code></li>
  <li class="list-inline-item"><code class="notranslate">aeg</code></li>
  <li class="list-inline-item"><code class="notranslate">aetna</code></li>
  <li class="list-inline-item"><code class="notranslate">afl</code></li>
  <li class="list-inline-item"><code class="notranslate">agakhan</code></li>
  <li class="list-inline-item"><code class="notranslate">aig</code></li>
  <li class="list-inline-item"><code class="notranslate">aigo</code></li>
  <li class="list-inline-item"><code class="notranslate">airbus</code></li>
  <li class="list-inline-item"><code class="notranslate">airtel</code></li>
  <li class="list-inline-item"><code class="notranslate">akdn</code></li>
  <li class="list-inline-item"><code class="notranslate">alfaromeo</code></li>
  <li class="list-inline-item"><code class="notranslate">alibaba</code></li>
  <li class="list-inline-item"><code class="notranslate">alipay</code></li>
  <li class="list-inline-item"><code class="notranslate">allfinanz</code></li>
  <li class="list-inline-item"><code class="notranslate">allstate</code></li>
  <li class="list-inline-item"><code class="notranslate">ally</code></li>
  <li class="list-inline-item"><code class="notranslate">alstom</code></li>
  <li class="list-inline-item"><code class="notranslate">amazon</code></li>
  <li class="list-inline-item"><code class="notranslate">americanexpress</code></li>
  <li class="list-inline-item"><code class="notranslate">amex</code></li>
  <li class="list-inline-item"><code class="notranslate">amica</code></li>
  <li class="list-inline-item"><code class="notranslate">android</code></li>
  <li class="list-inline-item"><code class="notranslate">anz</code></li>
  <li class="list-inline-item"><code class="notranslate">aol</code></li>
  <li class="list-inline-item"><code class="notranslate">apple</code></li>
  <li class="list-inline-item"><code class="notranslate">aquarelle</code></li>
  <li class="list-inline-item"><code class="notranslate">aramco</code></li>
  <li class="list-inline-item"><code class="notranslate">audi</code></li>
  <li class="list-inline-item"><code class="notranslate">auspost</code></li>
  <li class="list-inline-item"><code class="notranslate">aws</code></li>
  <li class="list-inline-item"><code class="notranslate">axa</code></li>
  <li class="list-inline-item"><code class="notranslate">azure</code></li>
  <li class="list-inline-item"><code class="notranslate">baidu</code></li>
  <li class="list-inline-item"><code class="notranslate">bananarepublic</code></li>
  <li class="list-inline-item"><code class="notranslate">barclaycard</code></li>
  <li class="list-inline-item"><code class="notranslate">barclays</code></li>
  <li class="list-inline-item"><code class="notranslate">basketball</code></li>
  <li class="list-inline-item"><code class="notranslate">bauhaus</code></li>
  <li class="list-inline-item"><code class="notranslate">bbc</code></li>
  <li class="list-inline-item"><code class="notranslate">bbt</code></li>
  <li class="list-inline-item"><code class="notranslate">bbva</code></li>
  <li class="list-inline-item"><code class="notranslate">bcg</code></li>
  <li class="list-inline-item"><code class="notranslate">bentley</code></li>
  <li class="list-inline-item"><code class="notranslate">bharti</code></li>
  <li class="list-inline-item"><code class="notranslate">bing</code></li>
  <li class="list-inline-item"><code class="notranslate">blanco</code></li>
  <li class="list-inline-item"><code class="notranslate">bloomberg</code></li>
  <li class="list-inline-item"><code class="notranslate">bms</code></li>
  <li class="list-inline-item"><code class="notranslate">bmw</code></li>
  <li class="list-inline-item"><code class="notranslate">bnl</code></li>
  <li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
  <li class="list-inline-item"><code class="notranslate">boehringer</code></li>
  <li class="list-inline-item"><code class="notranslate">bond</code></li>
  <li class="list-inline-item"><code class="notranslate">booking</code></li>
  <li class="list-inline-item"><code class="notranslate">bosch</code></li>
  <li class="list-inline-item"><code class="notranslate">bostik</code></li>
  <li class="list-inline-item"><code class="notranslate">bradesco</code></li>
  <li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
  <li class="list-inline-item"><code class="notranslate">brother</code></li>
  <li class="list-inline-item"><code class="notranslate">bugatti</code></li>
  <li class="list-inline-item"><code class="notranslate">cal</code></li>
  <li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
  <li class="list-inline-item"><code class="notranslate">canon</code></li>
  <li class="list-inline-item"><code class="notranslate">capitalone</code></li>
  <li class="list-inline-item"><code class="notranslate">caravan</code></li>
  <li class="list-inline-item"><code class="notranslate">cartier</code></li>
  <li class="list-inline-item"><code class="notranslate">cba</code></li>
  <li class="list-inline-item"><code class="notranslate">cbn</code></li>
  <li class="list-inline-item"><code class="notranslate">cbre</code></li>
  <li class="list-inline-item"><code class="notranslate">cbs</code></li>
  <li class="list-inline-item"><code class="notranslate">cern</code></li>
  <li class="list-inline-item"><code class="notranslate">cfa</code></li>
  <li class="list-inline-item"><code class="notranslate">chanel</code></li>
  <li class="list-inline-item"><code class="notranslate">chase</code></li>
  <li class="list-inline-item"><code class="notranslate">chintai</code></li>
  <li class="list-inline-item"><code class="notranslate">chrome</code></li>
  <li class="list-inline-item"><code class="notranslate">chrysler</code></li>
  <li class="list-inline-item"><code class="notranslate">cipriani</code></li>
  <li class="list-inline-item"><code class="notranslate">cisco</code></li>
  <li class="list-inline-item"><code class="notranslate">citadel</code></li>
  <li class="list-inline-item"><code class="notranslate">citi</code></li>
  <li class="list-inline-item"><code class="notranslate">citic</code></li>
  <li class="list-inline-item"><code class="notranslate">clubmed</code></li>
  <li class="list-inline-item"><code class="notranslate">comcast</code></li>
  <li class="list-inline-item"><code class="notranslate">commbank</code></li>
  <li class="list-inline-item"><code class="notranslate">creditunion</code></li>
  <li class="list-inline-item"><code class="notranslate">crown</code></li>
  <li class="list-inline-item"><code class="notranslate">crs</code></li>
  <li class="list-inline-item"><code class="notranslate">csc</code></li>
  <li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
  <li class="list-inline-item"><code class="notranslate">dabur</code></li>
  <li class="list-inline-item"><code class="notranslate">datsun</code></li>
  <li class="list-inline-item"><code class="notranslate">dealer</code></li>
  <li class="list-inline-item"><code class="notranslate">dell</code></li>
  <li class="list-inline-item"><code class="notranslate">deloitte</code></li>
  <li class="list-inline-item"><code class="notranslate">delta</code></li>
  <li class="list-inline-item"><code class="notranslate">dhl</code></li>
  <li class="list-inline-item"><code class="notranslate">discover</code></li>
  <li class="list-inline-item"><code class="notranslate">dish</code></li>
  <li class="list-inline-item"><code class="notranslate">dnp</code></li>
  <li class="list-inline-item"><code class="notranslate">dodge</code></li>
  <li class="list-inline-item"><code class="notranslate">dunlop</code></li>
  <li class="list-inline-item"><code class="notranslate">dupont</code></li>
  <li class="list-inline-item"><code class="notranslate">dvag</code></li>
  <li class="list-inline-item"><code class="notranslate">edeka</code></li>
  <li class="list-inline-item"><code class="notranslate">emerck</code></li>
  <li class="list-inline-item"><code class="notranslate">epson</code></li>
  <li class="list-inline-item"><code class="notranslate">ericsson</code></li>
  <li class="list-inline-item"><code class="notranslate">erni</code></li>
  <li class="list-inline-item"><code class="notranslate">esurance</code></li>
  <li class="list-inline-item"><code class="notranslate">etisalat</code></li>
  <li class="list-inline-item"><code class="notranslate">eurovision</code></li>
  <li class="list-inline-item"><code class="notranslate">everbank</code></li>
  <li class="list-inline-item"><code class="notranslate">extraspace</code></li>
  <li class="list-inline-item"><code class="notranslate">fage</code></li>
  <li class="list-inline-item"><code class="notranslate">fairwinds</code></li>
  <li class="list-inline-item"><code class="notranslate">farmers</code></li>
  <li class="list-inline-item"><code class="notranslate">fedex</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrari</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrero</code></li>
  <li class="list-inline-item"><code class="notranslate">fiat</code></li>
  <li class="list-inline-item"><code class="notranslate">fidelity</code></li>
  <li class="list-inline-item"><code class="notranslate">firestone</code></li>
  <li class="list-inline-item"><code class="notranslate">firmdale</code></li>
  <li class="list-inline-item"><code class="notranslate">flickr</code></li>
  <li class="list-inline-item"><code class="notranslate">flir</code></li>
  <li class="list-inline-item"><code class="notranslate">flsmidth</code></li>
  <li class="list-inline-item"><code class="notranslate">ford</code></li>
  <li class="list-inline-item"><code class="notranslate">fox</code></li>
  <li class="list-inline-item"><code class="notranslate">fresenius</code></li>
  <li class="list-inline-item"><code class="notranslate">forex</code></li>
  <li class="list-inline-item"><code class="notranslate">frogans</code></li>
  <li class="list-inline-item"><code class="notranslate">frontier</code></li>
  <li class="list-inline-item"><code class="notranslate">fujitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">fujixerox</code></li>
  <li class="list-inline-item"><code class="notranslate">gallo</code></li>
  <li class="list-inline-item"><code class="notranslate">gallup</code></li>
  <li class="list-inline-item"><code class="notranslate">gap</code></li>
  <li class="list-inline-item"><code class="notranslate">gbiz</code></li>
  <li class="list-inline-item"><code class="notranslate">gea</code></li>
  <li class="list-inline-item"><code class="notranslate">genting</code></li>
  <li class="list-inline-item"><code class="notranslate">giving</code></li>
  <li class="list-inline-item"><code class="notranslate">gle</code></li>
  <li class="list-inline-item"><code class="notranslate">globo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmail</code></li>
  <li class="list-inline-item"><code class="notranslate">gmo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmx</code></li>
  <li class="list-inline-item"><code class="notranslate">godaddy</code></li>
  <li class="list-inline-item"><code class="notranslate">goldpoint</code></li>
  <li class="list-inline-item"><code class="notranslate">goodyear</code></li>
  <li class="list-inline-item"><code class="notranslate">goog</code></li>
  <li class="list-inline-item"><code class="notranslate">google</code></li>
  <li class="list-inline-item"><code class="notranslate">grainger</code></li>
  <li class="list-inline-item"><code class="notranslate">guardian</code></li>
  <li class="list-inline-item"><code class="notranslate">gucci</code></li>
  <li class="list-inline-item"><code class="notranslate">hbo</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfc</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
  <li class="list-inline-item"><code class="notranslate">hermes</code></li>
  <li class="list-inline-item"><code class="notranslate">hisamitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">hitachi</code></li>
  <li class="list-inline-item"><code class="notranslate">hkt</code></li>
  <li class="list-inline-item"><code class="notranslate">honda</code></li>
  <li class="list-inline-item"><code class="notranslate">honeywell</code></li>
  <li class="list-inline-item"><code class="notranslate">hotmail</code></li>
  <li class="list-inline-item"><code class="notranslate">hsbc</code></li>
  <li class="list-inline-item"><code class="notranslate">hughes</code></li>
  <li class="list-inline-item"><code class="notranslate">hyatt</code></li>
  <li class="list-inline-item"><code class="notranslate">hyundai</code></li>
  <li class="list-inline-item"><code class="notranslate">ibm</code></li>
  <li class="list-inline-item"><code class="notranslate">ieee</code></li>
  <li class="list-inline-item"><code class="notranslate">ifm</code></li>
  <li class="list-inline-item"><code class="notranslate">ikano</code></li>
  <li class="list-inline-item"><code class="notranslate">imdb</code></li>
  <li class="list-inline-item"><code class="notranslate">infiniti</code></li>
  <li class="list-inline-item"><code class="notranslate">intel</code></li>
  <li class="list-inline-item"><code class="notranslate">intuit</code></li>
  <li class="list-inline-item"><code class="notranslate">ipiranga</code></li>
  <li class="list-inline-item"><code class="notranslate">iselect</code></li>
  <li class="list-inline-item"><code class="notranslate">itau</code></li>
  <li class="list-inline-item"><code class="notranslate">itv</code></li>
  <li class="list-inline-item"><code class="notranslate">iveco</code></li>
  <li class="list-inline-item"><code class="notranslate">jaguar</code></li>
  <li class="list-inline-item"><code class="notranslate">java</code></li>
  <li class="list-inline-item"><code class="notranslate">jcb</code></li>
  <li class="list-inline-item"><code class="notranslate">jcp</code></li>
  <li class="list-inline-item"><code class="notranslate">jeep</code></li>
  <li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
  <li class="list-inline-item"><code class="notranslate">juniper</code></li>
  <li class="list-inline-item"><code class="notranslate">kddi</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryhotels</code></li>
  <li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryproperties</code></li>
  <li class="list-inline-item"><code class="notranslate">kfh</code></li>
  <li class="list-inline-item"><code class="notranslate">kia</code></li>
  <li class="list-inline-item"><code class="notranslate">kinder</code></li>
  <li class="list-inline-item"><code class="notranslate">kindle</code></li>
  <li class="list-inline-item"><code class="notranslate">komatsu</code></li>
  <li class="list-inline-item"><code class="notranslate">kpmg</code></li>
  <li class="list-inline-item"><code class="notranslate">kred</code></li>
  <li class="list-inline-item"><code class="notranslate">kuokgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">lacaixa</code></li>
  <li class="list-inline-item"><code class="notranslate">ladbrokes</code></li>
  <li class="list-inline-item"><code class="notranslate">lamborghini</code></li>
  <li class="list-inline-item"><code class="notranslate">lancaster</code></li>
  <li class="list-inline-item"><code class="notranslate">lancia</code></li>
  <li class="list-inline-item"><code class="notranslate">lancome</code></li>
  <li class="list-inline-item"><code class="notranslate">landrover</code></li>
  <li class="list-inline-item"><code class="notranslate">lanxess</code></li>
  <li class="list-inline-item"><code class="notranslate">lasalle</code></li>
  <li class="list-inline-item"><code class="notranslate">latrobe</code></li>
  <li class="list-inline-item"><code class="notranslate">lds</code></li>
  <li class="list-inline-item"><code class="notranslate">leclerc</code></li>
  <li class="list-inline-item"><code class="notranslate">lego</code></li>
  <li class="list-inline-item"><code class="notranslate">liaison</code></li>
  <li class="list-inline-item"><code class="notranslate">lexus</code></li>
  <li class="list-inline-item"><code class="notranslate">lidl</code></li>
  <li class="list-inline-item"><code class="notranslate">lifestyle</code></li>
  <li class="list-inline-item"><code class="notranslate">lilly</code></li>
  <li class="list-inline-item"><code class="notranslate">lincoln</code></li>
  <li class="list-inline-item"><code class="notranslate">linde</code></li>
  <li class="list-inline-item"><code class="notranslate">lipsy</code></li>
  <li class="list-inline-item"><code class="notranslate">lixil</code></li>
  <li class="list-inline-item"><code class="notranslate">locus</code></li>
  <li class="list-inline-item"><code class="notranslate">lotte</code></li>
  <li class="list-inline-item"><code class="notranslate">lpl</code></li>
  <li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
  <li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
  <li class="list-inline-item"><code class="notranslate">lupin</code></li>
  <li class="list-inline-item"><code class="notranslate">macys</code></li>
  <li class="list-inline-item"><code class="notranslate">maif</code></li>
  <li class="list-inline-item"><code class="notranslate">man</code></li>
  <li class="list-inline-item"><code class="notranslate">mango</code></li>
  <li class="list-inline-item"><code class="notranslate">marriott</code></li>
  <li class="list-inline-item"><code class="notranslate">maserati</code></li>
  <li class="list-inline-item"><code class="notranslate">mattel</code></li>
  <li class="list-inline-item"><code class="notranslate">mckinsey</code></li>
  <li class="list-inline-item"><code class="notranslate">metlife</code></li>
  <li class="list-inline-item"><code class="notranslate">microsoft</code></li>
  <li class="list-inline-item"><code class="notranslate">mini</code></li>
  <li class="list-inline-item"><code class="notranslate">mit</code></li>
  <li class="list-inline-item"><code class="notranslate">mitsubishi</code></li>
  <li class="list-inline-item"><code class="notranslate">mlb</code></li>
  <li class="list-inline-item"><code class="notranslate">mma</code></li>
  <li class="list-inline-item"><code class="notranslate">monash</code></li>
  <li class="list-inline-item"><code class="notranslate">mormon</code></li>
  <li class="list-inline-item"><code class="notranslate">moto</code></li>
  <li class="list-inline-item"><code class="notranslate">movistar</code></li>
  <li class="list-inline-item"><code class="notranslate">msd</code></li>
  <li class="list-inline-item"><code class="notranslate">mtn</code></li>
  <li class="list-inline-item"><code class="notranslate">mtr</code></li>
  <li class="list-inline-item"><code class="notranslate">mutual</code></li>
  <li class="list-inline-item"><code class="notranslate">nadex</code></li>
  <li class="list-inline-item"><code class="notranslate">nationwide</code></li>
  <li class="list-inline-item"><code class="notranslate">natura</code></li>
  <li class="list-inline-item"><code class="notranslate">nba</code></li>
  <li class="list-inline-item"><code class="notranslate">nec</code></li>
  <li class="list-inline-item"><code class="notranslate">netflix</code></li>
  <li class="list-inline-item"><code class="notranslate">neustar</code></li>
  <li class="list-inline-item"><code class="notranslate">newholland</code></li>
  <li class="list-inline-item"><code class="notranslate">nfl</code></li>
  <li class="list-inline-item"><code class="notranslate">nhk</code></li>
  <li class="list-inline-item"><code class="notranslate">nico</code></li>
  <li class="list-inline-item"><code class="notranslate">nike</code></li>
  <li class="list-inline-item"><code class="notranslate">nikon</code></li>
  <li class="list-inline-item"><code class="notranslate">nissan</code></li>
  <li class="list-inline-item"><code class="notranslate">nissay</code></li>
  <li class="list-inline-item"><code class="notranslate">nokia</code></li>
  <li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li>
  <li class="list-inline-item"><code class="notranslate">norton</code></li>
  <li class="list-inline-item"><code class="notranslate">nra</code></li>
  <li class="list-inline-item"><code class="notranslate">ntt</code></li>
  <li class="list-inline-item"><code class="notranslate">obi</code></li>
  <li class="list-inline-item"><code class="notranslate">office</code></li>
  <li class="list-inline-item"><code class="notranslate">omega</code></li>
  <li class="list-inline-item"><code class="notranslate">oracle</code></li>
  <li class="list-inline-item"><code class="notranslate">orange</code></li>
  <li class="list-inline-item"><code class="notranslate">otsuka</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
  <li class="list-inline-item"><code class="notranslate">panasonic</code></li>
  <li class="list-inline-item"><code class="notranslate">pccw</code></li>
  <li class="list-inline-item"><code class="notranslate">pfizer</code></li>
  <li class="list-inline-item"><code class="notranslate">philips</code></li>
  <li class="list-inline-item"><code class="notranslate">piaget</code></li>
  <li class="list-inline-item"><code class="notranslate">pictet</code></li>
  <li class="list-inline-item"><code class="notranslate">ping</code></li>
  <li class="list-inline-item"><code class="notranslate">pioneer</code></li>
  <li class="list-inline-item"><code class="notranslate">play</code></li>
  <li class="list-inline-item"><code class="notranslate">playstation</code></li>
  <li class="list-inline-item"><code class="notranslate">pohl</code></li>
  <li class="list-inline-item"><code class="notranslate">politie</code></li>
  <li class="list-inline-item"><code class="notranslate">praxi</code></li>
  <li class="list-inline-item"><code class="notranslate">prod</code></li>
  <li class="list-inline-item"><code class="notranslate">progressive</code></li>
  <li class="list-inline-item"><code class="notranslate">pru</code></li>
  <li class="list-inline-item"><code class="notranslate">prudential</code></li>
  <li class="list-inline-item"><code class="notranslate">pwc</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">quest</code></li>-->
  <li class="list-inline-item"><code class="notranslate">qvc</code></li>
  <li class="list-inline-item"><code class="notranslate">redstone</code></li>
  <li class="list-inline-item"><code class="notranslate">reliance</code></li>
  <li class="list-inline-item"><code class="notranslate">rexroth</code></li>
  <li class="list-inline-item"><code class="notranslate">ricoh</code></li>
  <li class="list-inline-item"><code class="notranslate">rmit</code></li>
  <li class="list-inline-item"><code class="notranslate">rocher</code></li>
  <li class="list-inline-item"><code class="notranslate">rogers</code></li>
  <li class="list-inline-item"><code class="notranslate">rwe</code></li>
  <li class="list-inline-item"><code class="notranslate">safety</code></li>
  <li class="list-inline-item"><code class="notranslate">sakura</code></li>
  <li class="list-inline-item"><code class="notranslate">samsung</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvik</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li>
  <li class="list-inline-item"><code class="notranslate">sanofi</code></li>
  <li class="list-inline-item"><code class="notranslate">sap</code></li>
  <li class="list-inline-item"><code class="notranslate">saxo</code></li>
  <li class="list-inline-item"><code class="notranslate">sbi</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
  <li class="list-inline-item"><code class="notranslate">sca</code></li>
  <li class="list-inline-item"><code class="notranslate">scb</code></li>
  <li class="list-inline-item"><code class="notranslate">schaeffler</code></li>
  <li class="list-inline-item"><code class="notranslate">schmidt</code></li>
  <li class="list-inline-item"><code class="notranslate">schwarz</code></li>
  <li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
  <li class="list-inline-item"><code class="notranslate">scor</code></li>
  <li class="list-inline-item"><code class="notranslate">seat</code></li>
  <li class="list-inline-item"><code class="notranslate">sener</code></li>
  <li class="list-inline-item"><code class="notranslate">ses</code></li>
  <li class="list-inline-item"><code class="notranslate">sew</code></li>
  <li class="list-inline-item"><code class="notranslate">seven</code></li>
  <li class="list-inline-item"><code class="notranslate">sfr</code></li>
  <li class="list-inline-item"><code class="notranslate">seek</code></li>
  <li class="list-inline-item"><code class="notranslate">shangrila</code></li>
  <li class="list-inline-item"><code class="notranslate">sharp</code></li>
  <li class="list-inline-item"><code class="notranslate">shaw</code></li>
  <li class="list-inline-item"><code class="notranslate">shell</code></li>
  <li class="list-inline-item"><code class="notranslate">shriram</code></li>
  <li class="list-inline-item"><code class="notranslate">sina</code></li>
  <li class="list-inline-item"><code class="notranslate">sky</code></li>
  <li class="list-inline-item"><code class="notranslate">skype</code></li>
  <li class="list-inline-item"><code class="notranslate">smart</code></li>
  <li class="list-inline-item"><code class="notranslate">sncf</code></li>
  <li class="list-inline-item"><code class="notranslate">softbank</code></li>
  <li class="list-inline-item"><code class="notranslate">sohu</code></li>
  <li class="list-inline-item"><code class="notranslate">sony</code></li>
  <li class="list-inline-item"><code class="notranslate">spiegel</code></li>
  <li class="list-inline-item"><code class="notranslate">stada</code></li>
  <li class="list-inline-item"><code class="notranslate">staples</code></li>
  <li class="list-inline-item"><code class="notranslate">star</code></li>
  <li class="list-inline-item"><code class="notranslate">starhub</code></li>
  <li class="list-inline-item"><code class="notranslate">statebank</code></li>
  <li class="list-inline-item"><code class="notranslate">statefarm</code></li>
  <li class="list-inline-item"><code class="notranslate">statoil</code></li>
  <li class="list-inline-item"><code class="notranslate">stc</code></li>
  <li class="list-inline-item"><code class="notranslate">stcgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">suzuki</code></li>
  <li class="list-inline-item"><code class="notranslate">swatch</code></li>
  <li class="list-inline-item"><code class="notranslate">swiftcover</code></li>
  <li class="list-inline-item"><code class="notranslate">symantec</code></li>
  <li class="list-inline-item"><code class="notranslate">taobao</code></li>
  <li class="list-inline-item"><code class="notranslate">target</code></li>
  <li class="list-inline-item"><code class="notranslate">tatamotors</code></li>
  <li class="list-inline-item"><code class="notranslate">tdk</code></li>
  <li class="list-inline-item"><code class="notranslate">telecity</code></li>
  <li class="list-inline-item"><code class="notranslate">telefonica</code></li>
  <li class="list-inline-item"><code class="notranslate">temasek</code></li>
  <li class="list-inline-item"><code class="notranslate">teva</code></li>
  <li class="list-inline-item"><code class="notranslate">tiffany</code></li>
  <li class="list-inline-item"><code class="notranslate">tjx</code></li>
  <li class="list-inline-item"><code class="notranslate">toray</code></li>
  <li class="list-inline-item"><code class="notranslate">toshiba</code></li>
  <li class="list-inline-item"><code class="notranslate">total</code></li>
  <li class="list-inline-item"><code class="notranslate">toyota</code></li>
  <li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">travelers</code></li>
  <li class="list-inline-item"><code class="notranslate">tui</code></li>
  <li class="list-inline-item"><code class="notranslate">tvs</code></li>
  <li class="list-inline-item"><code class="notranslate">ubs</code></li>
  <li class="list-inline-item"><code class="notranslate">unicom</code></li>
  <li class="list-inline-item"><code class="notranslate">uol</code></li>
  <li class="list-inline-item"><code class="notranslate">ups</code></li>
  <li class="list-inline-item"><code class="notranslate">vanguard</code></li>
  <li class="list-inline-item"><code class="notranslate">verisign</code></li>
  <li class="list-inline-item"><code class="notranslate">vig</code></li>
  <li class="list-inline-item"><code class="notranslate">viking</code></li>
  <li class="list-inline-item"><code class="notranslate">virgin</code></li>
  <li class="list-inline-item"><code class="notranslate">visa</code></li>
  <li class="list-inline-item"><code class="notranslate">vista</code></li>
  <li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
  <li class="list-inline-item"><code class="notranslate">vivo</code></li>
  <li class="list-inline-item"><code class="notranslate">volkswagen</code></li>
  <li class="list-inline-item"><code class="notranslate">volvo</code></li>
  <li class="list-inline-item"><code class="notranslate">walmart</code></li>
  <li class="list-inline-item"><code class="notranslate">walter</code></li>
  <li class="list-inline-item"><code class="notranslate">weatherchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">weber</code></li>
  <li class="list-inline-item"><code class="notranslate">weir</code></li>
  <li class="list-inline-item"><code class="notranslate">williamhill</code></li>
  <li class="list-inline-item"><code class="notranslate">windows</code></li>
  <li class="list-inline-item"><code class="notranslate">wme</code></li>
  <li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
  <li class="list-inline-item"><code class="notranslate">woodside</code></li>
  <li class="list-inline-item"><code class="notranslate">wtc</code></li>
  <li class="list-inline-item"><code class="notranslate">xbox</code></li>
  <li class="list-inline-item"><code class="notranslate">xerox</code></li>
  <li class="list-inline-item"><code class="notranslate">xfinity</code></li>
  <li class="list-inline-item"><code class="notranslate">yahoo</code></li>
  <li class="list-inline-item"><code class="notranslate">yamaxun</code></li>
  <li class="list-inline-item"><code class="notranslate">yandex</code></li>
  <li class="list-inline-item"><code class="notranslate">yodobashi</code></li>
  <li class="list-inline-item"><code class="notranslate">youtube</code></li>
  <li class="list-inline-item"><code class="notranslate">zappos</code></li>
  <li class="list-inline-item"><code class="notranslate">zara</code></li>
  <li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>

As of March 18, 2025 we have also added these French overseas territories to this list ([per this GitHub request](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

As of July 8, 2025 we have added these Europe-specific countries:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

In October 2025 we have also added <code class="notranslate">cz</code> (Czech Republic) due to demand.

We specifically did not include `ru` and `ua` due to high spam activity.

### What is your allowlist criteria

We have a static list of [domain name extensions allowlisted by default](#what-domain-name-extensions-are-allowlisted-by-default) – and we also maintain a dynamic, cached, rolling allowlist based off the following strict criteria:

* Sender root domain must be of a [domain name extension that matches the list we offer on our free plan](#what-domain-name-extensions-can-be-used-for-free) (with the addition of `biz` and `info`).  We also include `edu`, `gov`, and `mil` partial matches, such as `xyz.gov.au` and `xyz.edu.au`.
* Sender root domain must be within top 100,000 unique root domain parsed results from [Umbrella Popularity List](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* Sender root domain must be within top 50,000 results from unique root domains appearing in at least 4 of past 7 days of UPL's (\~50%+).
* Sender root domain must not be [categorized](https://radar.cloudflare.com/categorization-feedback/) as adult-content or malware by Cloudflare.
* Sender root domain must have either A or MX records set.
* Sender root domain must have either A record(s), MX record(s), DMARC record with `p=reject` or `p=quarantine`, or an SPF record with `-all` or `~all` qualifier.

If this criteria is satisfied, then the sender root domain will be cached for 7 days.  Note that our automated job runs daily – therefore this is a rolling allowlist cache that updates daily.

Our automated job will download the previous 7 days of UPL's in-memory, unzip them, and then parse in-memory according to the strict criteria above.

Popular domains at the time of this writing such as Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify, and more – are of course included.

If you are a sender not in our allowlist, then the first time your FQDN root domain or IP address sends an email, you will be [rate limited](#do-you-have-rate-limiting) and [greylisted](#do-you-have-a-greylist).  Note that this is standard practice adopted as an email standard.  Most email server clients will attempt to retry if they receive a rate limit or greylist error (e.g. a 421 or 4xx level error status code).

**Note that specific senders such as `a@gmail.com`, `b@xyz.edu`, and `c@gov.au` can still be [denylisted](#do-you-have-a-denylist)** (e.g. if we automatically detect spam, phishing, or malware from those senders).

### What domain name extensions can be used for free

As of March 31, 2023 we enforced a new blanket spam rule to protect our users and service.

This new rule allows only the following domain name extensions to be used on our free plan:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ac</code></li>
  <li class="list-inline-item"><code class="notranslate">ad</code></li>
  <li class="list-inline-item"><code class="notranslate">ag</code></li>
  <li class="list-inline-item"><code class="notranslate">ai</code></li>
  <li class="list-inline-item"><code class="notranslate">al</code></li>
  <li class="list-inline-item"><code class="notranslate">am</code></li>
  <li class="list-inline-item"><code class="notranslate">app</code></li>
  <li class="list-inline-item"><code class="notranslate">as</code></li>
  <li class="list-inline-item"><code class="notranslate">at</code></li>
  <li class="list-inline-item"><code class="notranslate">au</code></li>
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">ba</code></li>
  <li class="list-inline-item"><code class="notranslate">be</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">br</code></li>
  <li class="list-inline-item"><code class="notranslate">by</code></li>
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">ca</code></li>
  <li class="list-inline-item"><code class="notranslate">cat</code></li>
  <li class="list-inline-item"><code class="notranslate">cc</code></li>
  <li class="list-inline-item"><code class="notranslate">cd</code></li>
  <li class="list-inline-item"><code class="notranslate">ch</code></li>
  <li class="list-inline-item"><code class="notranslate">ck</code></li>
  <li class="list-inline-item"><code class="notranslate">co</code></li>
  <li class="list-inline-item"><code class="notranslate">com</code></li>
  <li class="list-inline-item"><code class="notranslate">de</code></li>
  <li class="list-inline-item"><code class="notranslate">dev</code></li>
  <li class="list-inline-item"><code class="notranslate">dj</code></li>
  <li class="list-inline-item"><code class="notranslate">dk</code></li>
  <li class="list-inline-item"><code class="notranslate">ee</code></li>
  <li class="list-inline-item"><code class="notranslate">es</code></li>
  <li class="list-inline-item"><code class="notranslate">eu</code></li>
  <li class="list-inline-item"><code class="notranslate">family</code></li>
  <li class="list-inline-item"><code class="notranslate">fi</code></li>
  <li class="list-inline-item"><code class="notranslate">fm</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gl</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">id</code></li>
  <li class="list-inline-item"><code class="notranslate">ie</code></li>
  <li class="list-inline-item"><code class="notranslate">il</code></li>
  <li class="list-inline-item"><code class="notranslate">im</code></li>
  <li class="list-inline-item"><code class="notranslate">in</code></li>
  <li class="list-inline-item"><code class="notranslate">io</code></li>
  <li class="list-inline-item"><code class="notranslate">ir</code></li>
  <li class="list-inline-item"><code class="notranslate">is</code></li>
  <li class="list-inline-item"><code class="notranslate">it</code></li>
  <li class="list-inline-item"><code class="notranslate">je</code></li>
  <li class="list-inline-item"><code class="notranslate">jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ke</code></li>
  <li class="list-inline-item"><code class="notranslate">kr</code></li>
  <li class="list-inline-item"><code class="notranslate">la</code></li>
  <li class="list-inline-item"><code class="notranslate">li</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">lv</code></li>
  <li class="list-inline-item"><code class="notranslate">ly</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">md</code></li>
  <li class="list-inline-item"><code class="notranslate">me</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mn</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">ms</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">mu</code></li>
  <li class="list-inline-item"><code class="notranslate">mx</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">net</code></li>
  <li class="list-inline-item"><code class="notranslate">ni</code></li>
  <li class="list-inline-item"><code class="notranslate">nl</code></li>
  <li class="list-inline-item"><code class="notranslate">no</code></li>
  <li class="list-inline-item"><code class="notranslate">nu</code></li>
  <li class="list-inline-item"><code class="notranslate">nz</code></li>
  <li class="list-inline-item"><code class="notranslate">org</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pl</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">pr</code></li>
  <li class="list-inline-item"><code class="notranslate">pt</code></li>
  <li class="list-inline-item"><code class="notranslate">pw</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">rs</code></li>
  <li class="list-inline-item"><code class="notranslate">sc</code></li>
  <li class="list-inline-item"><code class="notranslate">se</code></li>
  <li class="list-inline-item"><code class="notranslate">sh</code></li>
  <li class="list-inline-item"><code class="notranslate">si</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">sm</code></li>
  <li class="list-inline-item"><code class="notranslate">sr</code></li>
  <li class="list-inline-item"><code class="notranslate">st</code></li>
  <li class="list-inline-item"><code class="notranslate">tc</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">tm</code></li>
  <li class="list-inline-item"><code class="notranslate">to</code></li>
  <li class="list-inline-item"><code class="notranslate">tv</code></li>
  <li class="list-inline-item"><code class="notranslate">uk</code></li>
  <li class="list-inline-item"><code class="notranslate">us</code></li>
  <li class="list-inline-item"><code class="notranslate">uz</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
  <li class="list-inline-item"><code class="notranslate">vc</code></li>
  <li class="list-inline-item"><code class="notranslate">vg</code></li>
  <li class="list-inline-item"><code class="notranslate">vu</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">ws</code></li>
  <li class="list-inline-item"><code class="notranslate">xyz</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
  <li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>

### Do you have a greylist

Yes, we have a very lax [email greylisting](https://en.wikipedia.org/wiki/Greylisting_\(email\)) policy used.  Greylisting only applies for senders not on our allowlist and lasts in our cache for 30 days.

For any new sender, we store a key in our Redis database for 30 days with a value set to the initial arrival time of their first request.  We then reject their email with a retry status code of 450 and only allow it to pass once 5 minutes has passed.

If they have successfully waited for 5 minutes from this initial arrival time, then their emails will be accepted and they will not receive this 450 status code.

The key consists of either the FQDN root domain or the sender's IP address.  This means that any sub-domain that passes the greylist also will pass for the root domain, and vice-versa (this is what we mean by a "very lax" policy).

For example, if an email comes from `test.example.com` before we see an email come from `example.com`, then any email from `test.example.com` and/or `example.com` will have to wait 5 minutes from the initial arrival time of the connection.  We do not make both `test.example.com` and `example.com` each wait their own 5 minute periods (our greylisting policy applies at the root domain level).

Note that greylisting does not apply to any sender on our [allowlist](#do-you-have-an-allowlist) (e.g. Meta, Amazon, Netflix, Google, Microsoft at the time of this writing).

### Do you have a denylist

Yes, we operate our own denylist and update it automatically in real-time and manually based off spam and malicious activity detected.

We also pull all IP addresses from the UCEPROTECT Level 1 denylist at <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> every hour and feed it into our denylist with a 7 day expiry.

Senders found in the denylist will receive a 421 error code (indicates to sender to retry again later) if they [are not allowlisted](#do-you-have-an-allowlist).

By using a 421 status code instead of a 554 status code, potential false positives can be alleviated in real-time and then the message can be successfully delivered on the next attempt.

**This is designed unlike other mail services**, where if you are put on a blocklist, a hard and permanent failure occurs.  It is often difficult to ask senders to retry messages (especially from large organizations), and therefore this approach gives roughly 5 days from the initial email attempt for either the sender, recipient, or us to step in and alleviate the issue (by requesting denylist removal).

All denylist removal requests are monitored in real-time by admins (e.g. so that recurring false positives can be permanently allowlisted by admins).

Denylist removal requests can be requested at <https://forwardemail.net/denylist>.  Paid users have their denylist removal requests instantly processed, while non-paid users must wait for admins to process their request.

Senders that are detected to be sending spam or virus content will be added to the denylist in the following approach:

1. The [initial message fingerprint](#how-do-you-determine-an-email-fingerprint) is greylisted upon detection of spam or blocklist from a "trusted" sender (e.g. `gmail.com`, `microsoft.com`, `apple.com`).
   * If the sender was allowlisted, the message is greylisted for 1 hour.
   * If the sender is not allowlisted, the message is greylisted for 6 hours.
2. We parse denylist keys from information from the sender and message, and for each of these keys we create (if one does not already exist) a counter, increment it by 1, and cache it for 24 hours.
   * For allowlisted senders:
     * Add a key for the envelope "MAIL FROM" email address if it had passing SPF or no SPF, and it was not [a postmaster username](#what-are-postmaster-addresses) or [a no-reply username](#what-are-no-reply-addresses).
     * If "From" header was allowlisted, then add a key for the "From" header email address if it had passing SPF or passing and aligned DKIM.
     * If "From" header was not allowlisted, then add a key for the "From" header email address and its root parsed domain name.
   * For non-allowlisted senders:
     * Add a key for the envelope "MAIL FROM" email address if it had passing SPF.
     * If "From" header was allowlisted, then add a key for the "From" header email address if it had passing SPF or passing and aligned DKIM.
     * If "From" header was not allowlisted, then add a key for the "From" header email address and its root parsed domain name.
     * Add a key for the remote IP address of the sender.
     * Add a key for the client resolved hostname by reverse lookup from the IP address of the sender (if any).
     * Add a key for the root domain of the client resolved hostname (if any, and if it differs than the client resolved hostname).
3. If the counter reaches 5 for a non-allowlisted sender and key, then we denylist the key for 30 days and an email is sent to our abuse team.  These numbers may change and updates will be reflected here as we monitor abuse.
4. If the counter reaches 10 for an allowlisted sender and key, then we denylist the key for 7 days and an email is sent to our abuse team.  These numbers may change and updates will be reflected here as we monitor abuse.

> **NOTE:** In the near future we will introduce reputation monitoring. Reputation monitoring will instead calculate when to denylist a sender based off a percentage threshold (as opposed to a rudimentary counter as noted above).

### Do you have rate limiting

Sender rate limiting is either by the root domain parsed from a reverse PTR lookup on the sender's IP address – or if that does not yield a result, then it simply uses the sender's IP address.  Note that we refer to this as `Sender` below.

Our MX servers have daily limits for inbound mail received for [encrypted IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service):

* Instead of rate limiting inbound mail received on an individual alias basis (e.g. `you@yourdomain.com`) – we rate limit by the alias's domain name itself (e.g. `yourdomain.com`). This prevents `Senders` from flooding the inboxes of all aliases across your domain at once.
* We have general limits that apply to all `Senders` across our service regardless of recipient:
  * `Senders` that we consider to be "trusted" as a source of truth (e.g. `gmail.com`, `microsoft.com`, `apple.com`) are limited to sending 100 GB per day.
  * `Senders` that are [allowlisted](#do-you-have-an-allowlist) are limited to sending 10 GB per day.
  * All other `Senders` are limited to sending 1 GB and/or 1000 messages per day.
* We have a specific limit per `Sender` and `yourdomain.com` of 1 GB and/or 1000 messages daily.

The MX servers also limit messages being forwarded to one or more recipients through rate limiting – but this only applies to `Senders` not on the [allowlist](#do-you-have-an-allowlist):

* We only permit up to 100 connections per hour, per `Sender` resolved FQDN root domain (or) `Sender` remote IP address (if no reverse PTR is available), and per envelope recipient to.  We store the key for rate limiting as a cryptographic hash in our Redis database.

* If you are sending email through our system, please ensure you have a reverse PTR set up for all your IP addresses (otherwise each unique FQDN root domain or IP address you send from will be rate limited).

* Note that if you send through a popular system such as Amazon SES, then you will not be rate limited since (at the time of this writing) Amazon SES is listed in our allowlist.

* If you are sending from a domain such as `test.abc.123.example.com`, then the rate limit will be imposed on `example.com`.  Many spammers use hundreds of sub-domains to work around common spam filters that only rate limit unique hostnames as opposed to unique FQDN root domains.

* `Senders` that exceed the rate limit will be rejected with a 421 error.

Our IMAP and SMTP servers limit your aliases from having more than `60` concurrent connections at once.

Our MX servers limit [non-allowlisted](#do-you-have-an-allowlist) senders from establishing more than 10 concurrent connections (with 3 minute cache expiry for the counter, which mirrors our socket timeout of 3 minutes).

### How do you protect against backscatter

Misdirected bounces or bounce spam (known as "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") can cause negative reputation to sender IP addreses.

We take two steps to protect against backscatter, which is detailed in the following sections [Prevent bounces from known MAIL FROM spammers](#prevent-bounces-from-known-mail-from-spammers) and [Prevent unnecessary bounces to protect against backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter) below.

### Prevent bounces from known MAIL FROM spammers

We pull the list from [Backscatter.org](https://www.backscatterer.org/) (powered by [UCEPROTECT](https://www.uceprotect.net/)) at <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> every hour and feed it into our Redis database (we also compare the difference in advance; in case any IP's were removed that need to be honored).

If the MAIL FROM is blank OR is equal to (case-insensitive) any of the [postmaster addresses](#what-are-postmaster-addresses) (the portion before the @ in an email), then we check to see if the sender IP matches one from this list.

If the sender's IP is listed (and not in our [allowlist](#do-you-have-an-allowlist)), then we send a 554 error with the message `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`.  We will be alerted if a sender is on both the Backscatterer list and in our allowlist so we can resolve the issue if necessary.

The techniques described in this section adhere to the "SAFE MODE" recommendation at <https://www.backscatterer.org/?target=usage> – where we only check the sender IP if certain conditions have already been met.

### Prevent unnecessary bounces to protect against backscatter

Bounces are emails that indicate email forwarding completely failed to the recipient and the email will not be retried.

A common reason for getting listed on the Backscatterer list is misdirected bounces or bounce spam, so we must protect against this in a few ways:

1. We only send when >= 500 status code errors occur (when emails attempted to be forwarded have failed, e.g. Gmail responds with a 500 level error).

2. We only send once and once only (we use a calculated bounce fingerprint key and store it in cache to prevent sending duplicates).  The bounce fingerprint is a key that is the message's fingerprint combined with a hash of the bounce address and its error code).  See the section on [Fingerprinting](#how-do-you-determine-an-email-fingerprint) for more insight into how the message fingerprint is calculated.  Successfully sent bounce fingerprints will expire after 7 days in our Redis cache.

3. We only send when the MAIL FROM and/or From is not blank and does not contain (case-insensitive) a [postmaster username](#what-are-postmaster-addresses) (the portion before the @ in an email).

4. We don't send if the original message had any of the following headers (case-insensitive):

   * Header of `auto-submitted` with a value not equal to `no`.
   * Header of `x-auto-response-suppress` with a value of `dr`, `autoreply`, `auto-reply`, `auto_reply`, or `all`
   * Header of `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond`, or `x-auto-respond` (regardless of value).
   * Header of `precedence` with a value of `bulk`, `autoreply`, `auto-reply`, `auto_reply`, or `list`.

5. We don't send if the MAIL FROM or From email address ends with `+donotreply`, `-donotreply`, `+noreply`, or `-noreply`.

6. We don't send if the From email address username portion was `mdaemon` and it had a case-insensitive header of `X-MDDSN-Message`.

7. We don't send if there was a case-insensitive `content-type` header of `multipart/report`.

### How do you determine an email fingerprint

An email's fingerprint is used for determining uniqueness of an email and to prevent duplicate messages from being delivered and [duplicate bounces](#prevent-unnecessary-bounces-to-protect-against-backscatter) from being sent.

The fingerprint is calculated from the following list:

* Client resolved FQDN hostname or IP address
* `Message-ID` header value (if any)
* `Date` header value (if any)
* `From` header value (if any)
* `To` header value (if any)
* `Cc` header value (if any)
* `Subject` header value (if any)
* `Body` value (if any)

### Can I forward emails to ports other than 25 (e.g. if my ISP has blocked port 25)

Yes, as of May 5, 2020 we have added this feature.  Right now the feature is domain-specific, as opposed to alias-specific.  If you require it to be alias-specific, please contact us to let us know of your needs.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Enhanced Privacy Protection:
  </strong>
  <span>
    If you are on a paid plan (which features enhanced privacy protection), then please go to <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a>, click on "Setup" next to your domain, and then click on "Settings".  If you would like to learn more about paid plans see our <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Pricing</a> page.  Otherwise you can continue to follow the instructions below.
  </span>
</div>

If you are on the free plan, then simply add a new DNS <strong class="notranslate">TXT</strong> record as shown below, but change the port from 25 to the port of your choosing.

For example, if I want all emails that go to `example.com` to forward to alias recipients' SMTP port of 1337 instead of 25:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email-port=1337</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    The most common scenario for custom port forwarding setup is when you want to forward all emails that go to example.com to a different port at example.com, other than the SMTP standard of port 25.  To set this up, simply add the following <strong class="notranslate">TXT</strong> catch-all record.
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=example.com</code></td>
    </tr>
  </tbody>
</table>

### Does it support the plus + symbol for Gmail aliases

Yes, absolutely.

### Does it support sub-domains

Yes, absolutely.  Instead of using "@", ".", or blank as the name/host/alias, you just use the sub-domain name as the value instead.

If you want `foo.example.com` to forward emails, then enter `foo` as the name/host/alias value in your DNS settings (for both MX and <strong class="notranslate">TXT</strong> records).

### Does this forward my email's headers

Yes, absolutely.

### Is this well-tested

Yes, it has tests written with [ava](https://github.com/avajs/ava) and also has code coverage.

### Do you pass along SMTP response messages and codes

Yes, absolutely.  For example if you're sending an email to `hello@example.com` and it's registered to forward to `user@gmail.com`, then the SMTP response message and code from the "gmail.com" SMTP server will be returned instead of the proxy server at "mx1.forwardemail.net" or "mx2.forwardemail.net".

### How do you prevent spammers and ensure good email forwarding reputation

See our sections on [How does your email forwarding system work](#how-does-your-email-forwarding-system-work), [How do you handle email delivery issues](#how-do-you-handle-email-delivery-issues), and [How do you handle your IP addresses becoming blocked](#how-do-you-handle-your-ip-addresses-becoming-blocked) above.

### How do you perform DNS lookups on domain names

We created an open-source software project :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) and use it for DNS lookups.  The default DNS servers used are `1.1.1.1` and `1.0.0.1`, and DNS queries are through [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") at the application layer.

:tangerine: [Tangerine](https://github.com/tangerine) uses [CloudFlare's privacy-first consumer DNS service by default][cloudflare-dns].


## Account and Billing

### Do you offer a money back guarantee on paid plans

Yes! Automatic refunds occur when you upgrade, downgrade, or cancel your account within 30-days from when your plan first started.  This only applies for first-time customers.

### If I switch plans do you pro-rate and refund the difference

We do not pro-rate nor refund the difference when you switch plans. Instead we convert the remaining duration from your existing plan's expiration date into the closest relative duration for your new plan (rounded down by month).

Note that if you upgrade or downgrade between paid plans within a 30-day window since first starting a paid plan, then we will automatically refund the full amount from your existing plan.

### Can I just use this email forwarding service as a "fallback" or "fallover" MX server

No, it is not recommended, as you can only use one mail exchange server at a time.  Fallbacks are usually never retried due to priority misconfigurations and mail servers not respecting MX exchange priority checking.

### Can I disable specific aliases

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    If you are on a paid plan, then you must go to <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliases <i class="fa fa-angle-right"></i> Edit Alias <i class="fa fa-angle-right"></i> Uncheck "Active" checkbox <i class="fa fa-angle-right"></i> Continue.
  </span>
</div>

Yes, simply edit your DNS <strong class="notranslate">TXT</strong> record and prefix the alias with either one, two, or three exclamation marks (see below).

Note that you *should* preserve the ":" mapping, as this is required if you ever decide to toggle this off (and it's also used for importing if you upgrade to one of our paid plans).

**For quiet reject (appears to sender as if the message was sent successfully, but actually goes nowhere) (status code `250`):** If you prefix an alias with "!" (single exclamation mark) then it will return a successful status code of `250` to senders attempting to send to this address, but the emails themselves will go nowhere (e.g. a blackhole or `/dev/null`).

**For soft reject (status code `421`):** If you prefix an alias with "!!" (double exclamation mark) then it will return a soft error status code of `421` to senders attempting to send to this address, and the emails will often be retried for up to 5 days before rejection and bounce.

**For hard reject (status code `550`):** If you prefix an alias with "!!!" (triple exclamation mark) then it will return a permanent error status code of `550` to senders attempting to send to this address and the emails will be rejected and bounce.

For example, if I want all emails that go to `alias@example.com` to stop flowing through to `user@gmail.com` and get rejected and bounce (e.g. use three exclamation marks):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    You can also rewrite the forwarded recipient's address to simply "nobody@forwardemail.net", which will route it to nobody as in the example below.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    If you want increased security, then you can also remove the ":user@gmail.com" (or ":nobody@forwardemail.net") part, leaving just "!!!alias" as in the example below.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias</code></td>
    </tr>
  </tbody>
</table>

### Can I forward emails to multiple recipients

Yes, absolutely.  Just specify multiple recipients in your <strong class="notranslate">TXT</strong> records.

For example, if I want an email that goes to `hello@example.com` to get forwarded to `user+a@gmail.com` and `user+b@gmail.com`, then my <strong class="notranslate">TXT</strong> record would look like this:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Or, you could specify them in two separate lines, such as this:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

It's up to you!

### Can I have multiple global catch-all recipients

Yes, you can. Just specify multiple global catch-all recipients in your <strong class="notranslate">TXT</strong> records.

For example, if I want every email that goes to `*@example.com` (the asterisk meaning its a wildcard aka catch-all) to get forwarded to `user+a@gmail.com` and `user+b@gmail.com`, then my <strong class="notranslate">TXT</strong> record would look like this:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Or, you could specify them in two separate lines, such as this:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@, ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

It's up to you!

### Is there a maximum limit on the number of email addresses I can forward to per alias

Yes, the default limit is 10.  This does NOT mean that you can only have 10 aliases on your domain name.  You can have as many aliases as you want (an unlimited amount).  It means that you can only forward one alias to 10 unique email addresses.  You could have `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (from 1-10) – and any emails to `hello@example.com` would get forwarded to `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (from 1-10).

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Need more than 10 recipients per alias?  Send us an email and we would be happy to increase your accounts limit.
  </span>
</div>

### Can I recursively forward emails

Yes, you can, however you still must adhere to the maximum limit.  If you have `hello:linus@example.com` and `linus:user@gmail.com`, then emails to `hello@example.com` would get forwarded to `linus@example.com` and `user@gmail.com`.  Note that an error will be thrown if you attempt to recursively forward emails beyond the maximum limit.

### Can people unregister or register my email forwarding without my permission

We use MX and <strong class="notranslate">TXT</strong> record verification, therefore if you add this service's respective MX and <strong class="notranslate">TXT</strong> records, then you're registered.  If you remove them, then you're unregistered.  You have ownership of your domain and DNS management, so if someone has access to that then that's a problem.

### How is it free

Forward Email offers a free tier through a combination of open-source development, efficient infrastructure, and optional paid plans that support the service.

Our free tier is supported by:

1. **Open Source Development**: Our codebase is open source, allowing community contributions and transparent operation.

2. **Efficient Infrastructure**: We've optimized our systems to handle email forwarding with minimal resources.

3. **Paid Premium Plans**: Users who need additional features like SMTP sending, IMAP receiving, or enhanced privacy options subscribe to our paid plans.

4. **Reasonable Usage Limits**: The free tier has fair usage policies to prevent abuse.

> \[!NOTE]
> We're committed to keeping basic email forwarding free while offering premium features for users with more advanced needs.

> \[!TIP]
> If you find our service valuable, consider upgrading to a paid plan to support ongoing development and maintenance.

### What is the max email size limit

We default to a 50MB size limit, which includes content, headers, and attachments.  Note that services such as Gmail and Outlook allow only 25MB size limit, and if you exceed the limit when sending to addresses at those providers you will receive an error message.

An error with the proper response code is returned if the file size limit is exceeded.

### Do you store logs of emails

No, we do not write to disk or store logs – with the [exception of errors](#do-you-store-error-logs) and [outbound SMTP](#do-you-support-sending-email-with-smtp) (see our [Privacy Policy](/privacy)).

Everything is done in-memory and [our source code is on GitHub](https://github.com/forwardemail).

### Do you store error logs

**Yes. You can access error logs under [My Account → Logs](/my-account/logs) or [My Account → Domains](/my-account/domains).**

As of February 2023, we store error logs for `4xx` and `5xx` SMTP response codes for a period of 7 days – which contain the SMTP error, envelope, and email headers (we **do not** store the email body nor attachments).

Error logs allow you to check for missing important emails and mitigate spam false positives for [your domains](/my-account/domains). They are also a great resource for debugging issues with [email webhooks](#do-you-support-webhooks) (since the error logs contain the webhook endpoint response).

Error logs for [rate limiting](#do-you-have-rate-limiting) and [greylisting](#do-you-have-a-greylist) are not accessible since the connection ends early (e.g. before `RCPT TO` and `MAIL FROM` commands can be transmitted).

See our [Privacy Policy](/privacy) for more insight.

### Do you read my emails

No, absolutely not.  See our [Privacy Policy](/privacy).

Many other email forwarding services store and could potentially read your email.  There is no reason why forwarded emails need to be stored to disk storage – and therefore we architected the first open-source solution that does it all in-memory.

We believe you should have a right to privacy and we strictly respect it.  The code that is deployed to the server is [open-source software on GitHub](https://github.com/forwardemail) for transparency and to build trust.

### Can I "send mail as" in Gmail with this

Yes! As of October 2, 2018 we have added this feature.  See [How to Send Mail As using Gmail](#how-to-send-mail-as-using-gmail) above!

You should also set the SPF record for Gmail in your DNS configuration <strong class="notranslate">TXT</strong> record.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    If you are using Gmail (e.g. Send Mail As) or G Suite, then you'll need to append <code>include:_spf.google.com</code> to your SPF <strong class="notranslate">TXT</strong> record, for example:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### Can I "send mail as" in Outlook with this

Yes! As of October 2, 2018 we have added this feature.  Simply view these two links from Microsoft below:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

You should also set the SPF record for Outlook in your DNS configuration <strong class="notranslate">TXT</strong> record.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    If you are using Microsoft Outlook or Live.com, you'll need to append <code>include:spf.protection.outlook.com</code> to your SPF <strong class="notranslate">TXT</strong> record, for example:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### Can I "send mail as" in Apple Mail and iCloud Mail with this

If you are a subscriber to iCloud+, you can use a custom domain.  [Our service is also compatible with Apple Mail](#apple-mail).

Please see <https://support.apple.com/en-us/102540> for more information.

### Can I forward unlimited emails with this

Yes, however "relatively unknown" senders are rate limited to 100 connections per hour per hostname or IP.  See the section on [Rate Limiting](#do-you-have-rate-limiting) and [Greylisting](#do-you-have-a-greylist) above.

By "relatively unknown", we mean senders that do not appear in the [allowlist](#do-you-have-an-allowlist).

If this limit is exceeded we send a 421 response code which tells the senders mail server to retry again later.

### Do you offer unlimited domains for one price

Yes. Regardless of which plan you are on, you will pay only one monthly rate – which covers all of your domains.

### Which payment methods do you accept

Forward Email accepts the following one-time or monthly/quarterly/yearly payment methods:

1. **Credit/Debit Cards/Bank Transfers**: Visa, Mastercard, American Express, Discover, JCB, Diners Club, etc.
2. **PayPal**: Connect your PayPal account for easy payments
3. **Cryptocurrency**: We accept payments via Stripe's stablecoin payments on Ethereum, Polygon, and Solana networks

> \[!NOTE]
> We store limited payment information on our servers, which only includes payment identifiers and references to [Stripe](https://stripe.com/global) and [PayPal](https://www.paypal.com) transaction, customer, subscription, and payment ID's.

> \[!TIP]
> For maximum privacy, consider using cryptocurrency payments.

All payments are processed securely through Stripe or PayPal. Your payment details are never stored on our servers.


## Additional Resources

> \[!TIP]
> Our articles below are regularly updated with new guides, tips, and technical information. Check back often for the latest content.

* [Case Studies & Developer Documentation](/blog/docs)
* [Resources](/resources)
* [Guides](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
