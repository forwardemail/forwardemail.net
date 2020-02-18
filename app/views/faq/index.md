# Frequently Asked Questions


## Table of Contents

* [How do I get started and set up email forwarding](#how-do-i-get-started-and-set-up-email-forwarding)
* [Why am I not receiving my test emails](#why-am-i-not-receiving-my-test-emails)
* [How to Send Mail As using Gmail](#how-to-send-mail-as-using-gmail)
* [Can I just use this email forwarding service as a "fallback" or "fallover" MX server](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
* [Can I disable specific aliases](#can-i-disable-specific-aliases)
* [Can I forward emails to multiple recipients](#can-i-forward-emails-to-multiple-recipients)
* [Can I have multiple global catch-all recipients](#can-i-have-multiple-global-catch-all-recipients)
* [Is there a maximum limit on the number of email addresses I can forward to per alias](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
* [Can I recursively forward emails](#can-i-recursively-forward-emails)
* [Can people unregister or register my email forwarding without my permission](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
* [How is it free](#how-is-it-free)
* [What is the max email size limit](#what-is-the-max-email-size-limit)
* [Do you store emails and their contents](#do-you-store-emails-and-their-contents)
* [Do you store logs of emails](#do-you-store-logs-of-emails)
* [Can you read my forwarded emails](#can-you-read-my-forwarded-emails)
* [Does it support the "+" symbol (e.g. for Gmail aliases)](#does-it-support-the--symbol-eg-for-gmail-aliases)
* [Does this forward my email's headers](#does-this-forward-my-emails-headers)
* [Is this well-tested](#is-this-well-tested)
* [Do you pass along SMTP response messages and codes](#do-you-pass-along-smtp-response-messages-and-codes)
* [How do you prevent spammers and ensure good email forwarding reputation](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
* [Can I "send mail as" with this](#can-i-send-mail-as-with-this)
* [Can I forward unlimited emails with this](#can-i-forward-unlimited-emails-with-this)
* [How do you perform DNS lookups on domain names](#how-do-you-perform-dns-lookups-on-domain-names)
* [How fast is this service](#how-fast-is-this-service)


## How do I get started and set up email forwarding

The guided steps below should take no more than ten minutes of your time to setup.  Please be sure to read the instructions (and notes) thoroughly while you are following each step.

Be sure to replace the email address of `niftylettuce@gmail.com` with the email address you want to forward emails to (only if it is not accurate already).  Similarly be sure to replace `example.com` with your custom domain name (only if it is not accurate already).

<mark>**IMPORTANT:** If you would like to hide your forwarded addresses from being publicly searchable over DNS record lookups, then please go to <a href="/my-account/domains" target="_blank" rel="noopener">My Account > Domains</a> and upgrade your domain to a paid plan BEFORE starting this guide.</mark>

**1.** If you have already registered your domain name, then you must completely skip this step and go to step two.  Otherwise you can <a href="/domain-registration" target="_blank" rel="noopener">click here to register your domain name</a>.

**2.** Click on the provider under "Provider Name" below where you registered your domain name, follow the respective steps under "Steps to Configure DNS", and then return to this tab to continue reading step three below:

> Clicking on a "Provider Name" below will open a link in a new tab for you.  After following the "Steps to Configure DNS" in this tab, do NOT close the tab, but instead return to this tab to proceed to step three.

| Provider Name                                                             | Steps to Configure DNS                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [1&1](https://login.ionos.com/)                                           | Sign in > Domain Center > (Select your domain) > Edit DNS Settings                                                                                                                                                                                                                                         |
| [Amazon Route 53](https://console.aws.amazon.com/route53/)                | Sign in > Hosted Zones > (Select your domain)                                                                                                                                                                                                                                                              |
| [Aplus.net](https://www.aplus.net/)                                       | Sign in > My Servers > Domain Management > DNS Manager                                                                                                                                                                                                                                                     |
| [Cloudflare](https://dash.cloudflare.com/login)                           | Sign in > DNS                                                                                                                                                                                                                                                                                              |
| [DNS Made Easy](https://cp.dnsmadeeasy.com/)                              | Sign in > DNS > (Select your domain)                                                                                                                                                                                                                                                                       |
| [DNSimple](https://dnsimple.com/dashboard)                                | Sign in > (Select your domain)  > DNS > Manage                                                                                                                                                                                                                                                             |
| [Digital Ocean](https://cloud.digitalocean.com/login)                     | Sign in > Networking > Domains > (Select your domain) > More > Manage Domain                                                                                                                                                                                                                               |
| [Domains.com](https://www.domains.com/)                                   | Sign in > (Select your domain) > Manage > (click gear icon) > Click on DNS & Nameservers in left-hand menu                                                                                                                                                                                                 |
| [DreamHost](https://panel.dreamhost.com/)                                 | Sign in > Panel > Domains > Manage Domains > DNS                                                                                                                                                                                                                                                           |
| [Dyn](https://portal.dynect.net/login/)                                   | Sign in > Overview > Manage > Simple Editor > Records                                                                                                                                                                                                                                                      |
| [Gandi](https://id.gandi.net/en/login)                                    | Sign in > (Select your domain) > Management > Edit the zone                                                                                                                                                                                                                                                |
| [GoDaddy](https://sso.godaddy.com)                                        | Sign in > Manage My Domains > (Select your domain) > Manage DNS                                                                                                                                                                                                                                            |
| [Google Domains](https://domains.google.com/registrar)                    | Sign in > (Select your domain) > Configure DNS                                                                                                                                                                                                                                                             |
| [Namecheap](https://www.namecheap.com/myaccount/login/)                   | Sign in > Domain List > (Select your domain) > Manage > Advanced DNS                                                                                                                                                                                                                                       |
| [Netlify](https://app.netlify.com/)                                       | Sign in > (Select your domain) > Setup Netlify DNS                                                                                                                                                                                                                                                         |
| [Network Solutions](https://www.networksolutions.com/manage-it/index.jsp) | Sign in > Account Manager > My Domain Names > (Select your domain) > Manage > Change Where Domain Points > Advanced DNS                                                                                                                                                                                    |
| [Shopify](https://accounts.shopify.com/store-login)                       | Sign in > Managed Domains > (Select your domain) > DNS Settings                                                                                                                                                                                                                                            |
| [eNom](https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&) | Sign in > Domains > My Domains                                                                                                                                                                                                                                                                             |
| Other                                                                     | <mark>**Don't see your provider name listed here?** Simply search on the Internet for "how to change DNS records on <code>Provider Name</code>" (replacing <code>Provider Name</code> with the name of your provider).  Feel free to <a href="/help">contact us</a> with any questions or comments.</mark> |

**3.** Using your provider's DNS management page (the other tab you have opened), set the following "MX" record types on your domain name:

| Name/Host/Alias    |  TTL | Record Type | Priority | Value/Answer/Destination |
| ------------------ | :--: | ----------- | -------- | ------------------------ |
| _@ or leave blank_ | 3600 | MX          | 10       | `mx1.forwardemail.net`   |
| _@ or leave blank_ | 3600 | MX          | 20       | `mx2.forwardemail.net`   |

> Note that there should be NO other MX records set on your domain name.  Both of the above records MUST exist.  If there were already MX records that existed, please delete them completely.
>
> The "TTL" value does not need to be 3600, it could be a lower or higher value if necessary.

**4.** Using your provider's DNS management page (the other tab you have opened), set the following "TXT" record types on your domain name:

<mark>**IMPORTANT**: <u>If you are on a paid plan, then you must completely skip this step and go to step five!</u>  If you are not on a paid plan, then your forwarded addresses will be publicly searchable – go to <a href="/my-account/domains" target="_blank" rel="noopener">My Account > Domains</a> and upgrade your domain to a paid plan if desired.</mark>

If you are forwarding all emails from your domain, ("all@example.com", "hello@example.com", etc) to a specific address "niftylettuce@gmail.com":

| Name/Host/Alias    |  TTL | Record Type | Value/Answer/Destination               |
| ------------------ | :--: | ----------- | -------------------------------------- |
| _@ or leave blank_ | 3600 | TXT         | `forward-email=niftylettuce@gmail.com` |

> Make sure to replace the values above in the "Value/Answer/Destination" column with your own email address.
>
> The "TTL" value does not need to be 3600, it could be a lower or higher value if necessary.

If you just need to forward a single email address (e.g. "hello@example.com" to "niftylettuce@gmail.com"; this will also forward "hello+test@example.com" to "niftylettuce+test@gmail.com" automatically):

| Name/Host/Alias    |  TTL | Record Type | Value/Answer/Destination                     |
| ------------------ | :--: | ----------- | -------------------------------------------- |
| _@ or leave blank_ | 3600 | TXT         | `forward-email=hello:niftylettuce@gmail.com` |

If you are forwarding multiple emails, then you'll want to separate them with a comma:

| Name/Host/Alias    |  TTL | Record Type | Value/Answer/Destination                                                    |
| ------------------ | :--: | ----------- | --------------------------------------------------------------------------- |
| _@ or leave blank_ | 3600 | TXT         | `forward-email=hello:niftylettuce@gmail.com,support:niftylettuce@gmail.com` |

You can have an infinite amount of forwarding emails setup – just make sure to not wrap over 255 characters in a single-line and start each line with "forward-email=".  An example is provided below:

| Name/Host/Alias    |  TTL | Record Type | Value/Answer/Destination                                                    |
| ------------------ | :--: | ----------- | --------------------------------------------------------------------------- |
| _@ or leave blank_ | 3600 | TXT         | `forward-email=hello:niftylettuce@gmail.com,support:niftylettuce@gmail.com` |
| _@ or leave blank_ | 3600 | TXT         | `forward-email=help:niftylettuce@gmail.com,foo:niftylettuce@gmail.com`      |
| _@ or leave blank_ | 3600 | TXT         | `forward-email=orders:niftylettuce@gmail.com,baz:niftylettuce@gmail.com`    |
| _@ or leave blank_ | 3600 | TXT         | `forward-email=info:niftylettuce@gmail.com,beep:niftylettuce@gmail.com`     |
| _@ or leave blank_ | 3600 | TXT         | `forward-email=errors:niftylettuce@gmail.com,boop:niftylettuce@gmail.com`   |

You can also specify a domain name in your TXT record to have global alias forwarding (e.g. "user@example.com" will get forwarded to "user@example.net"):

| Name/Host/Alias    |  TTL | Record Type | Value/Answer/Destination    |
| ------------------ | :--: | ----------- | --------------------------- |
| _@ or leave blank_ | 3600 | TXT         | `forward-email=example.net` |

**5.** Using your provider's DNS management page (the other tab you have opened), additionally set the following "TXT" record types on your domain name:

| Name/Host/Alias    |  TTL | Record Type | Value/Answer/Destination                        |
| ------------------ | :--: | ----------- | ----------------------------------------------- |
| _@ or leave blank_ | 3600 | TXT         | `v=spf1 a mx include:spf.forwardemail.net -all` |

> :warning: If you are using Google Apps, you'll need to append `include:_spf.google.com` to the value above – e.g. `v=spf1 a mx include:spf.forwardemail.net include:_spf.google.com -all`.
>
> If you already have a similar line with "v=spf1", then you'll need to append `include:spf.forwardemail.net` right before any existing "include:host.com" records and before the "-all" in the same line, for example":
>
> `v=spf1 a mx include:spf.forwardemail.net include:host.com -all`
>
> Note that there is a difference between "-all" and "~all".  The "-" indicates that the SPF check should FAIL if it does not match, and "~" indicates that the SPF check should SOFTFAIL.  We recommend to use the "-all" approach to prevent domain forgery.

**6.** Verify your DNS records using our "Verify Records" tool available at <a href="/my-account/domains" target="_blank" rel="noopener">My Account > Domains</a>.

**7.** Send a test email to confirm it works.  Note that it might take some time for your DNS records to propagate.

**8.** If you wish to "Send Mail As" from Gmail, then you will need to follow the steps under [How to Send Mail As Using Gmail](#how-to-send-mail-as-using-gmail) below.

---

_Optional Add-ons:_

* Add a DMARC record for your domain name by following the instructions at <https://dmarc.postmarkapp.com> (this will allow DMARC verification to pass)
  > :warning: If you intend to use [How to Send Mail As using Gmail](#how-to-send-mail-as-using-gmail), you can only set the DMARC policy to "p=none", for example:
  >
  > `v=DMARC1; p=none; pct=100; rua=mailto:re+random-key@dmarc.postmarkapp.com;`
  >
  > Setting other policies, "quarantine" or "reject", may cause sent mails to end up in recipient's spam folder or not delivered at all.
  >
  > DMARC requires both "From" and "Return-Path" to match the same domain. When you use "Send Mail As", your Gmail address would be used as the "Return-Path", instead of your custom domain in "From".

* If the email lands in your spam folder (which it should not), you can whitelist it (e.g. here are instructions for Google <https://support.google.com/a/answer/60751?hl=en&ref_topic=1685627>)

* Add the ability to "Send Mail As" from Gmail by following [How to Send Mail As Using Gmail](#how-to-send-mail-as-using-gmail) below


## Why am I not receiving my test emails

The most probable cause of your issues with not receiving test emails or with configuration in general is due to DNS propagation and caching.

Fortunately **our DNS provider Cloudflare has a nice "Purge Cache" tool available for you to use at:** <https://1.1.1.1/purge-cache/>.

All you need to do is go to that link for both "MX" and "TXT" record types, enter your domain name, and click "Purge Cache".  You'll then need to wait a few minutes and try again!

If you're using Gmail, you should also purge cache on Google's DNS at <https://developers.google.com/speed/public-dns/cache>.


## How to Send Mail As using Gmail

After you've followed the steps above in [How do I get started and set up email forwarding](#how-do-i-get-started-and-set-up-email-forwarding) you can follow these steps in Gmail in order to "Send Mail As" using your custom domain.

1. You need to have [Gmail's Two-Factor Authentication][gmail-2fa] enabled for this to work.  Visit <https://www.google.com/landing/2step/> if you do not have it enabled.
2. Once Two-Factor Authentication is enabled (or if you already had it enabled), then visit <https://myaccount.google.com/apppasswords>.
3. When prompted for "Select the app and device you want to generate the app password for":
   * Select "Mail" under the drop-down for "Select app"
   * Select "Other" under the drop-down for "Select device"
   * When prompted for text input, enter your custom domain's email address you're forwarding from (e.g. `hello@example.com` - this will help you keep track in case you use this service for multiple accounts)
4. Copy the password to your clipboard that is automatically generated
   > :warning: If you are using Google Apps, visit your admin panel [Apps > G Suite >Settings for Gmail > Advanced settings](https://admin.google.com//AdminHome#ServiceSettings/service=email&subtab=filters) and make sure to check "Allow users to send mail through an external SMTP server...". There will be some delay for this change to be activated, so please wait for ~5-10 minutes.
5. Go to [Gmail](https://gmail.com) and under [Settings > Accounts and Import > Send mail as](https://mail.google.com/mail/u/0/#settings/accounts), click "Add another email address"
6. When prompted for "Name", enter the name that you want your email to be seen as "From" (e.g. `Elon Musk`)
7. When prompted for "Email address", enter the email address with the custom domain you used above (e.g. `hello@example.com`)
8. Uncheck "Treat as an alias"
   > Check it if you prefer the recipient to reply (to the mail sent using your custom domain) directly to your Gmail address. [See details](https://support.google.com/a/answer/1710338)
9. Click "Next Step" to proceed
10. When prompted for "SMTP Server", enter `smtp.gmail.com` and leave the port as `587`
11. When prompted for "Username", enter the portion of your Gmail address without the `@gmail.com` part (e.g. `niftylettuce` if my email is `niftylettuce@gmail.com`)
12. When prompted for "Password", paste from your clipboard the password you generated in step 2 above
13. Leave the radio button checked to "Secured connection using TLS"
14. Click "Add Account" to proceed
15. Open a new tab to [Gmail](https://gmail.com) and wait for your verification email to arrive (you will receive a verification code that confirms you are the owner of the email address you are attempting to "Send Mail As")
16. Once it arrives, copy and paste the verification code at the prompt you received in the previous step
17. Once you've done that, go back to the email and click the link to "confirm the request". You need to do this step and the previous step for the email to be correctly configured.
18. Done!


## Can I just use this email forwarding service as a "fallback" or "fallover" MX server

Yes, but this is <u>NOT</u> recommended as this is an incredibly rare edge case.

If you use Google Business for email, and want to use our server as a fallback so your mail still gets delivered, then just specify the Google mail servers with a lower priority than our mail servers.  An example is provided below:

| Name/Host/Alias    |  TTL | Record Type | Priority | Value/Answer/Destination  |
| ------------------ | :--: | ----------- | -------- | ------------------------- |
| _@ or leave blank_ | 3600 | MX          | 1        | `ASPMX.L.GOOGLE.COM`      |
| _@ or leave blank_ | 3600 | MX          | 5        | `ALT1.ASPMX.L.GOOGLE.COM` |
| _@ or leave blank_ | 3600 | MX          | 5        | `ALT2.ASPMX.L.GOOGLE.COM` |
| _@ or leave blank_ | 3600 | MX          | 10       | `ALT3.ASPMX.L.GOOGLE.COM` |
| _@ or leave blank_ | 3600 | MX          | 10       | `ALT4.ASPMX.L.GOOGLE.COM` |
| _@ or leave blank_ | 3600 | MX          | 20       | `mx1.forwardemail.net`    |
| _@ or leave blank_ | 3600 | MX          | 30       | `mx2.forwardemail.net`    |


## Can I disable specific aliases

Yes! As of February 6, 2020 we have added this feature.  Simply edit your DNS TXT record and prefix the alias with an exclamation mark.  Note that you must preserve the ":" mapping, as this is required if you ever decide to toggle this off (and it's also used for importing in our paid plans).

If you prefix an alias with "!" (exclamation mark) then it will still return successful respond codes to senders attempting to send to this address, but the emails themselves will go nowhere; to a blackhole.

For example, if I want all emails that go to `alias@example.com` to stop flowing through to `niftylettuce@gmail.com`:

| Name/Host/Alias    |  TTL | Record Type | Value/Answer/Destination                      |
| ------------------ | :--: | ----------- | --------------------------------------------- |
| _@ or leave blank_ | 3600 | TXT         | `forward-email=!alias:niftylettuce@gmail.com` |

Emails sent to disabled addresses will respond with a `250` (message queued) status code, but the emails will not actually be delivered to the recipient(s).


## Can I forward emails to multiple recipients

Yes, absolutely.  Just specify multiple recipients in your TXT records.

For example, if I want an email that goes to `hello@example.com` to get forwarded to `niftylettuce+a@gmail.com` and `niftylettuce+b@gmail.com`, then my TXT record would look like this:

| Name/Host/Alias    |  TTL | Record Type | Value/Answer/Destination                                                      |
| ------------------ | :--: | ----------- | ----------------------------------------------------------------------------- |
| _@ or leave blank_ | 3600 | TXT         | `forward-email=hello:niftylettuce+a@gmail.com,hello:niftylettuce+b@gmail.com` |

Or, you could specify them in two separate lines, such as this:

| Name/Host/Alias    |  TTL | Record Type | Value/Answer/Destination                       |
| ------------------ | :--: | ----------- | ---------------------------------------------- |
| _@ or leave blank_ | 3600 | TXT         | `forward-email=hello:niftylettuce+a@gmail.com` |
| _@ or leave blank_ | 3600 | TXT         | `forward-email=hello:niftylettuce+b@gmail.com` |

It's up to you!


## Can I have multiple global catch-all recipients

Yes, you can. Just specify multiple global catch-all recipients in your TXT records.

For example, if I want every email that goes to `*@example.com` (the asterisk meaning its a wildcard aka catch-all) to get forwarded to `niftylettuce+a@gmail.com` and `niftylettuce+b@gmail.com`, then my TXT record would look like this:

| Name/Host/Alias    |  TTL | Record Type | Value/Answer/Destination                                          |
| ------------------ | :--: | ----------- | ----------------------------------------------------------------- |
| _@ or leave blank_ | 3600 | TXT         | `forward-email=niftylettuce+a@gmail.com,niftylettuce+b@gmail.com` |

Or, you could specify them in two separate lines, such as this:

| Name/Host/Alias    |  TTL | Record Type | Value/Answer/Destination                 |
| ------------------ | :--: | ----------- | ---------------------------------------- |
| _@ or leave blank_ | 3600 | TXT         | `forward-email=niftylettuce+a@gmail.com` |
| _@ or leave blank_ | 3600 | TXT         | `forward-email=niftylettuce+b@gmail.com` |

It's up to you!


## Is there a maximum limit on the number of email addresses I can forward to per alias

Yes, the default limit is 5.  This does NOT mean that you can only have five aliases on your domain name.  You can have as many as you want (unlimited).  It means that you can only forward one alias to five unique email addresses.  You could have `hello:niftylettuce+1@gmail.com`, `hello:niftylettuce+2@gmail.com`, `hello:niftylettuce+3@gmail.com`, … (from 1-5) – and any emails to `hello@example.com` would get forwarded to `niftylettuce+1@gmail.com`, `niftylettuce+2@gmail.com`, `niftylettuce+3@gmail.com`, … (from 1-5).


## Can I recursively forward emails

Yes, you can, however you still must adhere to the maximum limit.  If you have `hello:elon@example.com` and `elon:niftylettuce@gmail.com`, then emails to `hello@example.com` would get forwarded to `elon@example.com` and `niftylettuce@gmail.com`.  Note that an error will be thrown if you attempt to recursively forward emails.


## Can people unregister or register my email forwarding without my permission

We use MX and TXT record verification, therefore if you add this service's respective MX and TXT records, then you're registered.  If you remove them, then you're unregistered.  You have ownership of your domain and DNS management, so if someone has access to that then that's a problem.


## How is it free

The service continues to run thanks to [donations](/donate).

We want to provide a free alternative (since we feel bad) for people that are using closed-source forwarding services (and subsequently risking their privacy and security).


## What is the max email size limit

We default to a 25 MB size limit (the same as Gmail), which includes content, headers, and attachments.

An error with the proper response code is returned if the file size limit is exceeded.


## Do you store emails and their contents

No, absolutely not.  See our [Privacy Policy](/privacy).


## Do you store logs of emails

No, absolutely not.  See our [Privacy Policy](/privacy).


## Can you read my forwarded emails

No, I cannot read your emails and I have no wish to.  Many other email forwarding providers unethically read your email.  This is not what I'm about.

The code that is deployed to the server is publicly visible on GitHub!


## Does it support the "+" symbol (e.g. for Gmail aliases)

Yes, absolutely.


## Does this forward my email's headers

Yes, absolutely.


## Is this well-tested

Yes, it has tests written with ava and also has code coverage.


## Do you pass along SMTP response messages and codes

Yes, absolutely.  For example if you're sending an email to `hello@example.com` and it's registered to forward to `niftylettuce@gmail.com`, then the SMTP response message and code from the "gmail.com" SMTP server will be returned instead of the proxy server at "mx1.forwardemail.net" or "mx2.forwardemail.net".


## How do you prevent spammers and ensure good email forwarding reputation

Per documentation and suggestions from Google at <https://support.google.com/a/answer/175365?hl=en>, along with best practice, including:

1. DNSBL - we test senders IP's against the Spamhaus [DNS blacklists][dns-blacklists], if any fail, then the sender is not permitted to send the message and is returned a detailed error message with instructions on how to de-list themselves from the specific blacklists they're listed under.

2. SpamAssassin - using `spamc` client to check emails and automatically reject them if they're marked as spam

   * Checks daily for updated rules
   * Spam score threshold of (5.0)
   * Uses bayes theorem and auto learning
   * Uses [other improvements](https://wiki.apache.org/spamassassin/ImproveAccuracy)

3. SPF/DKIM - through checking if an SPF record exists for a sender, and if so, we reverse-lookup the SMTP connection's remote address to validate it matches the SPF record, otherwise it's rejected.  If an SPF record does not exist, then we require DKIM verification.  If DKIM headers are passed and fail, then it is rejected as well.  If no DKIM headers are passed, then we assume that DKIM validation passes.

4. MX - through checking if the sender's from address domain has MX records (so it's actually coming from a mail exchange/SMTP server), otherwise it's rejected

5. Disposable Email Addresses - we automatically block senders that are from the [disposable-email-domains][] list

6. FQDN - validates that senders SMTP connections are from FQDN (meaning no IP addresses, they must have a valid domain name resolved)

7. TXT - through checking if the email address the sender is trying to send to has a TXT DNS record with a valid email forwarding setup. The SSL certificates (main domain name or alternative names) of all MX servers of the forwarding destination must match the MX entry.

8. Sender Rewriting Scheme ("SRS") - we use [SRS][srs], which is a scheme used to rewrite the envelope sender address for email forwarding in order for DKIM/SPF/DMARC to pass with a forwarding mail server (middleman).


## Can I "send mail as" with this

Yes! As of October 2, 2018 we have added this feature.  See [How to Send Mail As using Gmail](#how-to-send-mail-as-using-gmail) above!


## Can I forward unlimited emails with this

Practically yes - the only current restriction is that senders (by unique email address) are limited to sending (300) emails per hour through the system.

If this limit is exceeded we send a "451" response code which tells the senders mail server to retry later.


## How do you perform DNS lookups on domain names

We use CloudFlare's privacy-first consumer DNS service (see [announcement here][cloudflare-dns]).  Note that the Python packages we use (`python-spfcheck2` and `python-dkim-verify`) do not have the means like Node.js does with `dns` and its method `dns.setServers` – therefore we set the server DNS to `1.1.1.1` which it will use as a fallback in this case.


## How fast is this service

The latest version, v2 (released on May 6, 2019) was a major rewrite from v1 and focuses on performance through streams.  [Nodemailer's][nodemailer] prolific author Andris Reinman ([@andris9](https://github.com/andris9)) helped us switch off using the `mailparser` library and use `mailsplit` instead with some custom transform logic to split the header and the body of the message without affecting the body.  This allows us to perform operations on headers very fast (such as security checks and for SPF/DKIM/DMARC compliance).

**In other words, the latest version of this service uses streams purely now and is lightning fast.**  The older version v1 also had some logic not in the most optimal order of operations – but now v2 does less memory/network intense operations first (and returns early if possible to send a response as quickly as possible to the SMTP client).

At no point in time do we write to disk or store emails – everything is done in-memory thanks to Node.js's streams and transforms! :tada:


## 

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[dns-blacklists]: https://en.wikipedia.org/wiki/Domain_Name_System-based_Blackhole_List

[disposable-email-domains]: https://github.com/ivolo/disposable-email-domains

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/

[nodemailer]: https://github.com/nodemailer/nodemailer

[srs]: https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme
