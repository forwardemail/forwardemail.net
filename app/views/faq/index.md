# Frequently Asked Questions


## Table of Contents

* [How do I get started and set up email forwarding](#how-do-i-get-started-and-set-up-email-forwarding)
* [How to Send Mail As using Gmail](#how-to-send-mail-as-using-gmail)
* [Why am I not receiving my test emails](#why-am-i-not-receiving-my-test-emails)
* [How does your email forwarding system work](#how-does-your-email-forwarding-system-work)
* [How do you process an email for forwarding](#how-do-you-process-an-email-for-forwarding)
* [How do you handle email delivery issues](#how-do-you-handle-email-delivery-issues)
* [How do you handle your IP addresses becoming blacklisted](#how-do-you-handle-your-ip-addresses-becoming-blacklisted)
* [What are no-reply addresses](#what-are-no-reply-addresses)
* [Do you have a whitelist](#do-you-have-a-whitelist)
* [Do you have a greylist](#do-you-have-a-greylist)
* [Do you have a blacklist](#do-you-have-a-blacklist)
* [Do you have rate limiting](#do-you-have-rate-limiting)
* [How do you protect against backscatter](#how-do-you-protect-against-backscatter)
  * [Prevent bounces from known MAIL FROM spammers](#prevent-bounces-from-known-mail-from-spammers)
  * [Prevent unnecessary bounces to protect against backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
* [How do you determine an email fingerprint](#how-do-you-determine-an-email-fingerprint)
* [Why are my test emails sent to myself in Gmail showing as "suspicious"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
* [Can I remove the via forwardemail dot net in Gmail](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Can I forward emails to ports other than 25 (e.g. if my ISP has blocked port 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
* [Do you offer a money back guarantee on paid plans](#do-you-offer-a-money-back-guarantee-on-paid-plans)
* [If I switch plans do you pro-rate and refund the difference](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
* [Do you support webhooks](#do-you-support-webhooks)
* [Do you support regular expressions or regex](#do-you-support-regular-expressions-or-regex)
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
* [Do you read my emails](#do-you-read-my-emails)
* [Does it support the plus + symbol for Gmail aliases](#does-it-support-the-plus--symbol-for-gmail-aliases)
* [Does it support sub-domains](#does-it-support-sub-domains)
* [Does this forward my email's headers](#does-this-forward-my-emails-headers)
* [Is this well-tested](#is-this-well-tested)
* [Do you pass along SMTP response messages and codes](#do-you-pass-along-smtp-response-messages-and-codes)
* [How do you prevent spammers and ensure good email forwarding reputation](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
* [What should I do if I receive spam emails](#what-should-i-do-if-i-receive-spam-emails)
* [Can I "send mail as" in Gmail with this](#can-i-send-mail-as-in-gmail-with-this)
* [Can I "send mail as" in Outlook with this](#can-i-send-mail-as-in-outlook-with-this)
* [Can I "send mail as" in Apple Mail and iCloud Mail with this](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
* [Can I forward unlimited emails with this](#can-i-forward-unlimited-emails-with-this)
* [How do I add a profile picture to my email address](#how-do-i-add-a-profile-picture-to-my-email-address)
* [What is the difference between Free and Enhanced Protection](#what-is-the-difference-between-free-and-enhanced-protection)
* [Do you support email best practices](#do-you-support-email-best-practices)
* [Do you offer unlimited domains for one price](#do-you-offer-unlimited-domains-for-one-price)
* [Which payment methods do you accept](#which-payment-methods-do-you-accept)
* [Will you ever increase prices](#will-you-ever-increase-prices)
* [How do you perform DNS lookups on domain names](#how-do-you-perform-dns-lookups-on-domain-names)
* [How fast is this service](#how-fast-is-this-service)


## How do I get started and set up email forwarding

<div class="alert my-3 bg-dark border-dark text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimated Setup Time:</strong>
  <span>Less than 10 minutes</span>
</div>

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Enhanced Privacy Protection:
  </strong>
  <span>
    If you would like to hide your information from being publicly searchable over the Internet, then please go to <a class="alert-link" href="/my-account/domains" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a> and upgrade your domain to a paid plan before starting this guide.
    Publicly searchable information on free plans includes, but is not limited to: aliases, forwarded addresses, recipients, and advanced settings such as custom port forwarding.
    If you would like to learn more about paid plans see our <a class="alert-link" rel="noopener noreferrer" href="/pricing">Pricing</a> page &ndash; otherwise keep reading!
    All plans abide by our <a class="alert-link" href="/privacy">Privacy</a> policy of strictly not storing SMTP logs, metadata, nor emails.
    We don't track you like other services do.
  </span>
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
    You must open a new tab and log in to your domain registrar.  You can easily click on your "Registrar" below to automatically do this.  In this new tab, you must navigate to the DNS management page at your registrar &ndash; and we have provided the step by step navigation steps below under the "Steps to Configure" column.  Once you've navigated to this page in the new tab, you can return to this tab and proceed to step three below.
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
      <td>Sign in <i class="fa fa-angle-right"></i> Domain Center <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Edit DNS Settings</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Hosted Zones <i class="fa fa-angle-right"></i> (Select your domain)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> My Servers <i class="fa fa-angle-right"></i> Domain Management <i class="fa fa-angle-right"></i> DNS Manager</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>FOR ROCK: Sign in <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Click the ▼ icon next to manage) <i class="fa fa-angle-right"></i> DNS
      <br />
      FOR LEGACY: Sign in <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Zone editor <i class="fa fa-angle-right"></i> (Select your domain)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Select your domain)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> (Select your domain)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Manage</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Networking <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> More <i class="fa fa-angle-right"></i> Manage Domain</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> In card view, click manage on your domain <i class="fa fa-angle-right"></i> In list view, click
the gear icon <i class="fa fa-angle-right"></i> DNS & Nameservers <i class="fa fa-angle-right"></i> DNS Records</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Watch</a>
      </td>
      <td>Sign in <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> (click gear icon) <i class="fa fa-angle-right"></i> Click on DNS &amp; Nameservers in left-hand menu</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Manage Domains <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Overview <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> Simple Editor <i class="fa fa-angle-right"></i> Records</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Management <i class="fa fa-angle-right"></i> Edit the zone</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Watch</a>
      </td>
      <td>Sign in <i class="fa fa-angle-right"></i> Manage My Domains <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Manage DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Watch</a>
      </td>
      <td>Sign in <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Configure DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Watch</a>
      </td>
      <td>Sign in <i class="fa fa-angle-right"></i> Domain List <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> Advanced DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Setup Netlify DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Account Manager <i class="fa fa-angle-right"></i> My Domain Names <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> Change Where Domain Points <i class="fa fa-angle-right"></i> Advanced DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Watch</a>
      </td>
      <td>Sign in <i class="fa fa-angle-right"></i> Managed Domains <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> DNS Settings</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Home menu <i class="fa fa-angle-right"></i> Settings <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i>
Advanced settings <i class="fa fa-angle-right"></i> Custom Records</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>Using "now" CLI <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Domains page <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Domains page <i class="fa fa-angle-right"></i> (Click <i class="fa fa-ellipsis-h"></i> icon) <i class="fa fa-angle-right"></i> Select Manage DNS Records</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> My Domains</td>
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
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>10</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>10</td>
      <td><code>mx2.forwardemail.net</code></td>
    </tr>
  </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5">Using your registrar's DNS management page (the other tab you have opened), set the following "TXT" record(s):

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    If you are on a paid plan, then you must completely skip this step and go to step five! If you are not on a paid plan, then your forwarded addresses will be publicly searchable – go to <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> and upgrade your domain to a paid plan if desired.  If you would like to learn more about paid plans see our <a rel="noopener noreferrer" href="/pricing" class="alert-link">Pricing</a> page.  Otherwise you can continue to choose one or more combinations from Option A to Option F listed below.
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
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=user@gmail.com</code></td>
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
    If you just need to forward a single email address (e.g. "hello@example.com" to "user@gmail.com"; this will also forward "hello+test@example.com" to "user+test@gmail.com" automatically):
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=hello:user@gmail.com</code></td>
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
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=hello:user@gmail.com,support:user@gmail.com</code></td>
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
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=hello:user@gmail.com,support:user@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=help:user@gmail.com,foo:user@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=info:user@gmail.com,beep:user@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code></td>
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
    You can also specify a domain name in your TXT record to have global alias forwarding (e.g. "user@example.com" will get forwarded to "user@example.net"):
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=example.net</code></td>
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
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
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
    You can even use regular expressions ("regex") for matching aliases and for handling substitutions to forward emails to.  See the example and full section on regex titled <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Do you support regular expressions or regex</a> below.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Using your registrar's DNS management page (the other tab you have opened), additionally set the following "TXT" record:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>v=spf1 a mx include:spf.forwardemail.net -all</code></td>
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
    <code>v=spf1 a mx include:spf.forwardemail.net include:_spf.google.com -all</code>
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
    <code>v=spf1 a mx include:spf.forwardemail.net include:host.com -all</code>
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

<div class="text-muted">Now you can <a href="https://www.youtube.com/watch?v=hvuzUasjFAo" target="_blank" rel="noopener noreferrer">start dancing</a>, <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer">sing a song</a>, and start forwarding emails!  If you have enjoyed these instructions, then please consider <a rel="noopener noreferrer" href="/pricing">upgrading to a paid plan</a>.  Additional tips and optional add-ons are described below:</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Optional add-ons are listed below.  Note that these add-ons are completely optional and may not be necessary.  We wanted to at least provide you with additional information if necessary.
  </span>
</div>

<!--
<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Optional Add-on:
  </strong>
  <span>
    Add a DMARC record for your domain name by following the instructions at <a rel="noopener noreferrer" class="alert-link" href="https://dmarc.postmarkapp.com" target="_blank">https://dmarc.postmarkapp.com</a> (this will allow DMARC verification to pass and help to prevent people from forging emails as if they were from you).
    If you intend to use <a href="#how-to-send-mail-as-using-gmail">How to Send Mail As using Gmail</a>, you can only set the DMARC policy to "p=none", for example:
    <br /><br />
    <code>v=DMARC1; p=none; pct=100; rua=mailto:re+random-key@dmarc.postmarkapp.com;</code>
    <br /><br />
    Setting other policies, "quarantine" or "reject", may cause sent mails to respectively end up in recipient's spam folder or not delivered at all.
    DMARC requires both "From" and "Return-Path" to match the same domain. When you use "Send Mail As", your Gmail address would be used as the "Return-Path", instead of your custom domain in "From".
  </span>
</div>
-->

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Optional Add-on:
  </strong>
  <span>
    If you're the <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How to Send Mail As using Gmail</a> feature, then you may want to whitelist yourself.  To do this, simply <a class="alert-link" href="https://support.google.com/a/answer/60751?hl=en&ref_topic=1685627" target="_blank" rel="noopener noreferrer">follow these instructions by Gmail</a> on this topic.
  </span>
</div>


## How to Send Mail As using Gmail

<div class="lazyframe border border-dark mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" style="border-color: #1d1d1d !important; max-width:100%; border-width:0.5rem !important;width:640px;height:360px" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div class="alert my-3 bg-dark border-dark text-white d-inline-block">
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
    After you've followed the steps above in <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">How do I get started and set up email forwarding</a> you can follow the video above or the steps below &ndash; in order to "Send Mail As" using your custom domain.
  </span>
</div>

1. You need to have [Gmail's Two-Factor Authentication][gmail-2fa] enabled for this to work.  Visit <https://www.google.com/landing/2step/> if you do not have it enabled.

2. Once Two-Factor Authentication is enabled (or if you already had it enabled), then visit <https://myaccount.google.com/apppasswords>.

3. When prompted for "Select the app and device you want to generate the app password for":
   * Select "Mail" under the drop-down for "Select app"
   * Select "Other" under the drop-down for "Select device"
   * When prompted for text input, enter your custom domain's email address you're forwarding from (e.g. "<hello@example.com>" - this will help you keep track in case you use this service for multiple accounts)

4. Copy the password to your clipboard that is automatically generated
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Important:
     </strong>
     <span>
       If you are using G Suite, visit your admin panel <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Apps <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Settings for Gmail <i class="fa fa-angle-right"></i> Advanced settings</a> and make sure to check "Allow users to send mail through an external SMTP server...". There will be some delay for this change to be activated, so please wait a few minutes.
     </span>
   </div>

5. Go to [Gmail](https://gmail.com) and under [Settings <i class="fa fa-angle-right"></i> Accounts and Import <i class="fa fa-angle-right"></i> Send mail as](https://mail.google.com/mail/u/0/#settings/accounts), click "Add another email address"

6. When prompted for "Name", enter the name that you want your email to be seen as "From" (e.g. "Elon Musk")

7. When prompted for "Email address", enter the email address with the custom domain you used above (e.g. "<hello@example.com>")

8. Uncheck "Treat as an alias"
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>
       If you prefer the recipient to reply directly to your Gmail address, then leave this checked. To learn more, <a class="alert-link" href="https://support.google.com/a/answer/1710338" rel="noopener noreferrer" target="_blank">follow these instructions by Gmail</a> on this topic.
     </span>
   </div>

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

13. Leave the radio button checked to "Secured connection using TLS"

14. Click "Add Account" to proceed

15. Open a new tab to [Gmail](https://gmail.com) and wait for your verification email to arrive (you will receive a verification code that confirms you are the owner of the email address you are attempting to "Send Mail As")

16. Once it arrives, copy and paste the verification code at the prompt you received in the previous step

17. Once you've done that, go back to the email and click the link to "confirm the request". You need to do this step and the previous step for the email to be correctly configured.

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


## Why am I not receiving my test emails

If you're sending a test email to yourself using the "Send Mail As" feature, then it will not show up in your inbox due to <a href="https://support.google.com/a/answer/1703601">this widely known official Gmail answer</a>.

If you continue to have issues, then it is most likely to be an issue with DNS propagation.  You will need to wait a bit longer and try again (or try setting a lower TTL value on your TXT records).

**Still having issues?**  Please file a <a href="/help">Help request</a> so we can help investigate the issue and find a quick resolution.


## How does your email forwarding system work

Email relies on the [SMTP protocol](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol).  This protocol consists of commands sent to a server (running most commonly on port 25).  There is an initial connection, then the sender indicates who the mail is from ("MAIL FROM"), followed by where it's going to ("RCPT TO"), and finally the headers and the body of the email itself ("DATA").  The flow of our email forwarding system is described relative to each SMTP protocol command below:

* Initial Connection (no command name, e.g. `telnet example.com 25`) - This is the initial connection.  We check senders that aren't whitelisted against our [Blacklist](#do-you-have-a-blacklist).  Finally, if a sender is not whitelisted, then we check to see if they have been [greylisted](#do-you-have-a-greylist).

* `HELO` - This indicates a greeting to identify the sender's FQDN, IP address, or mail handler name.  This value can be spoofed, so we do not rely on this data and instead use the reverse hostname lookup of the connection's IP address.

* `MAIL FROM` - This indicates the envelope mail from address of the email.  If a value is entered, it must be a valid RFC 5322 email address.  Empty values are permitted.  We [check for backscatter](#how-do-you-protect-against-backscatter) here, and we also check the MAIL FROM against our [Blacklist](#do-you-have-a-blacklist).  We finally check senders that are not on the whitelist for rate limiting (see the section on [Rate Limiting](#do-you-have-rate-limiting) and [Whitelisting](#do-you-have-a-whitelist) for more information).

* `RCPT TO` - This indicates the recipient(s) of the email.  These must be valid RFC 5322 email addresses.  We only permit up to 100 envelope recipients per message (this is different than the "To" header from an email).  We also check for a valid [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") address here to protect against spoofing with our SRS domain name.  Recipients provided that contain a "no-reply" address will receive a 553 error.  See the [complete list of "no-reply" addresses below](#what-are-no-reply-addresses).  We also check the recipient against our [Blacklist](#do-you-have-a-blacklist).

* `DATA` - This is the core part of our service which processes an email.  See the section [How do you process an email for forwarding](#how-do-you-process-an-email-for-forwarding) below for more insight.


## How do you process an email for forwarding

This section describes our process related to the SMTP protocol command `DATA` in the section [How does your email forwarding system work](#how-does-your-email-forwarding-system-work) above – it is how we process an email's headers, body, security, determine where it needs to be delivered to, and how we handle connections.

1. If the message exceeds the maximum size of 50mb, then it is rejected with a 552 error code.

2. If the message did not have any headers, or headers were unable to be parsed, then it is rejected with a 421 error code.

3. If the message did not contain a "From" header, or if any of the values in the "From" header were not valid RFC 5322 email addresses, then it is rejected with a 550 error code.

4. If the message had more than 25 "Received" headers, then it was determined to have been stuck in a redirect loop, and it is rejected with a 550 error code.

5. Using the email's fingerprint (see the section on [Fingerprinting](#how-do-you-determine-an-email-fingerprint)), we will check to see the message has been attempted to be retried more than 500 times, and if so, then it will be rejected with a 550 error code.

6. If the message had a "To" header, and if any of the message's "To" headers were directed towards SRS rewritten addresses using our domain name, then we will rewrite them (this namely applies for vacation responders).

7. If the message was missing a "Message-ID" header, then we will add one using either the envelope MAIL FROM parsed FQDN or our domain name.

8. If the message was missing a valid "Date" header, then we will add one using the arrival time from the initial connection of the message.

9. We store in-memory the results from scanning the email using [Spam Scanner](https://spamscanner.net).

10. If there were any arbitrary results from Spam Scanner, then it is rejected with a 554 error code.  Arbitrary results only include the GTUBE test at the time of this writing.  See <https://spamassassin.apache.org/gtube/> for more insight.

11. We will add the following headers to the message for debugging and abuse prevention purposes:

    * `X-ForwardEmail-Version` - the current [SemVer](https://semver.org/) version from `package.json` of our codebase.
    * `X-ForwardEmail-Session-ID` - a session ID value used for debug purposes (only applies in non-production environments).
    * `X-ForwardEmail-Sender` - a comma separated list containing the original envelope MAIL FROM address (if it was not blank), the reverse PTR client FQDN (if it exists), and the sender's IP address.
    * `X-Report-Abuse` - with a value of `abuse@forwardemail.net` (only if this header was not already set)
    * `X-Report-Abuse-To` - with a value of `abuse@forwardemail.net` (only if this header was not already set)

12. We then check the message for [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain), and [DMARC](https://en.wikipedia.org/wiki/DMARC).

    * If the message failed DMARC and the domain had a rejection policy (e.g. `p=reject` [was in the DMARC policy](https://dmarc.postmarkapp.com/)), then it is rejected with a 550 error code.  Typically a DMARC policy for a domain can be found in the `_dmarc` sub-domain TXT record, (e.g. `dig _dmarc.example.com txt`).
    * If the message failed SPF and the domain had a hard fail policy (e.g. `-all` was in the SPF policy as opposed to `~all` or no policy at all), then it is rejected with a 550 error code.  Typically an SPF policy for a domain can be found in the TXT record for the root domain (e.g. `dig example.com txt`).  See this section for more information on [sending mail as with Gmail](#can-i-send-mail-as-in-gmail-with-this) regarding SPF.

13. Now we process the recipients of the message as collected from the `RCPT TO` command in the section [How does your email forwarding system work](#how-does-your-email-forwarding-system-work) above.  For each recipient, we perform the following operations:

    * We lookup the TXT records of the domain name (the part after the `@` symbol, e.g. `example.com` if the email address was `test@example.com`).  For example, if the domain is `example.com` we do a DNS lookup such as `dig example.com txt`.
    * We parse all TXT records that start with either `forward-email=` (free plans) or `forward-email-site-verification=` (paid plans).  Note that we parse both, in order to process emails while a user is upgrading or downgrading plans.
    * From these parsed TXT records, we iterate over them to extract the forwarding configuration (as described in the section [How do I get started and set up email forwarding](#how-do-i-get-started-and-set-up-email-forwarding) above).  Note that we only support one `forward-email-site-verification=` value, and if more than one is supplied, then a 550 error will occur and the sender will receive a bounce for this recipient.
    * Recursively we iterate over the extracted forwarding configuration to determine global forwarding, regex based forwarding, and all other supported forwarding configurations – which are now known as our "Forwarding Addresses".
    * For each Forwarding Address, we support one recursive lookup (which will start this series of operations over on the given address).  If a recursive match was found, then the parent result will be removed from Forwarding Addresses, and the children added.
    * Forwarding Addresses are parsed for uniqueness (since we don't want to send duplicates to one address or spawn additionally unnecessary SMTP client connections).
    * For each Forwarding Address, we lookup its domain name against our API endpoint `/v1/max-forwarded-addresses` (in order to determine how many addresses the domain is permitted to forward email to per alias, e.g. 10 by default – see the section on [maximum limit on forwarding per alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)).  If this limit is exceeded, then a 550 error will occur and the sender will receive a bounce for this recipient.
    * We lookup the settings of the original recipient against our API endpoint `/v1/settings`, which supports a lookup for paid users (with a fallback for free users).  This returns a configuration object for advanced settings for `port` (Number, e.g. `25`), `has_adult_content_protection` (Boolean), `has_phishing_protection` (Boolean), `has_executable_protection` (Boolean), and `has_virus_protection` (Boolean).
    * Based off these settings, we then check against Spam Scanner results and if any errors occur, then the message is rejected with a 554 error code (e.g. if `has_virus_protection` is enabled, then we will check the Spam Scanner results for viruses).  Note that all free plan users will be opted-in for checks against adult-content, phishing, executables, and viruses.  By default, all paid plan users are opted-in as well, but this configuration can be altered under the Advanced Settings page for a domain in the Forward Email dashboard).

14. For each processed recipient's Forwarding Addresses, we then perform the following operations:

    * The address is checked against our [Blacklist](#do-you-have-a-blacklist), and if it was listed, then a 554 error code will occur and the sender will receive a bounce for this recipient.
    * If the address is a webhook, then we set a Boolean for future operations (see below – we group together similar webhooks to make one POST request vs. multiple for delivery).
    * If the address is an email address, then we parse the host for future operations (see below – we group together similar hosts to make one connection vs. multiple individual connections for delivery).

15. If there are no recipients and there are no bounces, then we respond with a 550 error of "Invalid recipients".

16. If there are recipients, then we iterate over them (grouped together by the same host) and deliver the emails.  See the section [How do you handle email delivery issues](#how-do-you-handle-email-delivery-issues) below for more insight.

    * If any errors occur while sending emails, then we will store them in-memory for later processing.
    * We will take the lowest error code (if any) from sending emails – and use that as the response code to the `DATA` command.  This means that emails not delivered will typically be retried by the original sender, yet emails that were already delivered will not be re-sent the next time the message is sent (as we use [Fingerprinting](#how-do-you-determine-an-email-fingerprint)).
    * If no errors occurred, then we will send a 250 successful SMTP response status code.
    * A bounce is determined to be any delivery attempted that results in a status code that is >= 500 (permanent failures).

17. If no bounces occurred (permanent failures), then we will return a SMTP response status code of the lowest error code from non-permanent failures (or a 250 successful status code if there were none).

18. If bounces did occur then we will send bounce emails in the background after returning the lowest of all error codes to the sender.  However, if the lowest error code is >= 500, then we do not send any bounce emails.  This is because if we did, then senders would receive a double bounce email (e.g. one from their outbound MTA, such as Gmail – and also one from us).  See the section on [How do you protect against backscatter](#how-do-you-protect-against-backscatter) below for more insight.


## How do you handle email delivery issues

Note that we will do a "Friendly-From" rewrite on the emails if and only if the DMARC policy of the sender was `p=reject`, AND it has a passing SPF, AND no DKIM signatures were aligned with the "From" header.  This means that we will alter the "From" header on the message, set "X-Original-From", and also set a "Reply-To" if it was not already set.  We will also re-seal the ARC seal on the message after altering these headers.

We also use smart-parsing of error messages at every level of our stack \&mndash; in our code, DNS requests, Node.js internals, HTTP requests (e.g. 408, 413, and 429 are mapped to the SMTP response code of 421 if the recipient is a webhook), and mail server responses (e.g. responses with "defer" or "slowdown" would be retried as 421 errors).

Our logic is dummy-proof and it will also retry for TLS/SSL errors, connection issues, and more.  The goal with dummy-proofing is to maximize deliverability to all recipients for a forwarding configuration.

If the recipient is a webhook, then we will permit a 10 second timeout for the request to complete with up to 3 retries (so 4 requests total before a failure).  Note that we correctly parse error codes 408, 413, and 429 and map them to a SMTP response code of 421.

Otherwise if the recipient is an email address, then we will attempt to send the email with opportunistic TLS (we attempt to use STARTTLS if it is available on the recipient mail server).  If a SSL or TLS error occurs while attempting to send the email, then we will attempt to send the email without TLS (without using STARTTLS).

If any DNS or connection errors occur, then we will return to the `DATA` command a SMTP response code of 421, otherwise if there are >= 500 level errors, then bounces will be sent.

If we detect that an email server we are attempting to deliver to has one or more of our mail exchange IP addresses blacklisted (e.g. by whatever technology they use for deferring spammers), then we will send a SMTP response code of 421 for the sender to retry their message later (and we are alerted to the issue so we can hopefully resolve it before the next attempt).


## How do you handle your IP addresses becoming blacklisted

We routinely monitor all major DNS blacklists and if any of our mail exchange ("MX") IP addresses are listed in a major blacklist, we will pull it out of the relevant DNS A record round robin if possible until it the issue is resolved.

At the time of this writing, we are listed in several DNS whitelists as well, and we take monitoring blacklists seriously.  If you see any issues before we have a chance to resolve them, please notify us in writing at <support@forwardemail.net>.


## What are no-reply addresses

We do not forward emails to "no-reply" addresses, and any sender attempting to will receive a 553 error.

Email usernames equal to any of the following (case-insensitive) are considered to be no-reply addresses:

* `no-reply@`
* `no_reply@`
* `nobody@`
* `noreplies@`
* `noreply@`


## Do you have a whitelist

Yes, we update a whitelist daily based off the most popular root FQDN used at the DNS level.  This list consists of approximately 200,000 to 300,000 unique root domain names.

Popular providers such as Google (Gmail), Yahoo, Microsoft (Outlook), Amazon (Amazon SES), Meta (Facebook), Twitter, Netflix, Spotify, and more are included.

If you are a sender or using a sender not on the whitelist, then the first time your FQDN root domain or IP address sends an email, you will be [rate limited](#do-you-have-rate-limiting) and [greylisted](#do-you-have-a-greylist).

Whitelist requests can be sent to <whitelist@forwardemail.net> (please provide a complete description and reason for whitelisting, links to websites, and your businesses' certificate of formation to be whitelisted).


## Do you have a greylist

Yes, we have a very lax [email greylisting](https://en.wikipedia.org/wiki/Greylisting_\(email\)) policy used.  Greylisting only applies for senders not on our whitelist and lasts in our cache for 30 days.

For any new sender, we store a key in our Redis database for 30 days with a value set to the initial arrival time of their first request.  We then reject their email with a retry status code of 450 and only allow it to pass once 5 minutes has passed.

If they have successfully waited for 5 minutes from this initial arrival time, then their emails will be accepted and they will not receive this 450 status code.

The key consists of either the FQDN root domain or the sender's IP address.  This means that any sub-domain that passes the greylist also will pass for the root domain, and vice-versa (this is what we mean by a "very lax" policy).

For example, if an email comes from `test.example.com` before we see an email come from `example.com`, then any email from `test.example.com` and/or `example.com` will have to wait 5 minutes from the initial arrival time of the connection.  We do not make both `test.example.com` and `example.com` each wait their own 5 minute periods (our greylisting policy applies at the root domain level).

Note that greylisting does not apply to any sender on our [Whitelist](#do-you-have-a-whitelist) (e.g. Meta, Amazon, Netflix, Google, Microsoft at the time of this writing).


## Do you have a blacklist

Yes, we operate our own private blacklist and update it automatically in real-time and manually based off spam and malicious activity detected.  Blacklisted senders will receive a 554 error message.

We also pull from the UCEPROTECT Level 1 Blacklist at <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> every hour and feed it into our Redis database (we also compare the difference in advance; in case any IP's were removed that need to be honored).

Blacklist removal requests can be sent to <whitelist@forwardemail.net> (please provide a complete description and reason for whitelisting, links to websites, and your businesses' certificate of formation to be whitelisted).


## Do you have rate limiting

Yes, we have rate limiting which applies only to senders not on the [Whitelist](#do-you-have-a-whitelist).

We only permit up to 100 connections per hour, per sender resolved FQDN root domain (or) sender remote IP address (if no reverse PTR is available), and per envelope recipient to.  We store the key for rate limiting as a cryptographic hash in our Redis database.

If you are sending email through our system, please ensure you have a reverse PTR set up for all your IP addresses (otherwise each unique FQDN root domain or IP address you send from will be rate limited).

Note that if you send through a popular system such as Amazon SES, then you will not be rate limited since (at the time of this writing) Amazon SES is whitelisted.

If you are sending from a domain such as `test.abc.123.example.com`, then the rate limit will be imposed on `example.com`.  Many spammers use hundreds of sub-domains to work around common spam filters that only rate limit unique hostnames as opposed to unique FQDN root domains.

Senders that exceed the rate limit will be rejected with a 421 error.


## How do you protect against backscatter

Misdirected bounces or bounce spam (known as "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") can cause negative reputation to sender IP addreses.

We take two steps to protect against backscatter, which is detailed in the following sections [Prevent bounces from known MAIL FROM spammers](#prevent-bounces-from-known-mail-from-spammers) and [Prevent unnecessary bounces to protect against backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter) below.

### Prevent bounces from known MAIL FROM spammers

We pull the list from [Backscatter.org](https://www.backscatterer.org/) (powered by [UCEPROTECT](https://www.uceprotect.net/)) at <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> every hour and feed it into our Redis database (we also compare the difference in advance; in case any IP's were removed that need to be honored).

If the MAIL FROM is blank OR contains (case-insensitive) one of the following usernames (the portion before the @ in an email), then we check to see if the sender IP matches one on this list:

* `abuse@`
* `ftp@`
* `hostmaster@`
* `mailer-daemon@`
* `mailer_daemon@`
* `mailerdaemon@`
* `news@`
* `no-reply@`
* `no_reply@`
* `nobody@`
* `noreplies@`
* `noreply@`
* `postmaster@`
* `root@`
* `security@`
* `usenet@`
* `webmaster@`
* `www@`

If the sender's IP is listed (and not in our [Whitelist](#do-you-have-a-whitelist)), then we send a 554 error with the message `The IP ${session.remoteAddress} is blacklisted by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`.  We will be alerted if a sender is on both the Backscatterer list and in our whitelist so we can resolve the issue if necessary.

The techniques described in this section adhere to the "SAFE MODE" recommendation at <https://www.backscatterer.org/?target=usage> – where we only check the sender IP if certain conditions have already been met.

### Prevent unnecessary bounces to protect against backscatter

Bounces are emails that indicate email forwarding completely failed to the recipient and the email will not be retried.

A common reason for getting listed on the Backscatterer list is misdirected bounces or bounce spam, so we must protect against this in a few ways:

1. We only send bounces when >= 500 status code errors occur (when emails attempted to be forwarded have failed, e.g. Gmail responds with a 500 level error).

2. We only send bounces once and once only (we use a calculated bounce fingerprint key and store it in cache to prevent sending duplicates).  The bounce fingerprint is a key that is the message's fingerprint combined with a hash of the bounce address and its error code).  See the section on [Fingerprinting](#how-do-you-determine-an-email-fingerprint) for more insight into how the message fingerprint is calculated.  Successfully sent bounce fingerprints will expire after 7 days in our Redis cache.

3. We only send bounces when the MAIL FROM is not blank and does not contain (case-insensitive) one of the following usernames (the portion before the @ in an email).  Note that this list is a little bit shorter than the one above in the MAIL FROM check because we don't want to have false positives (e.g. security@ is a valid address that you might want to get a bounce for; a lot of folks use security@ for their bug bounty programs).

   * `abuse@`
   * `mailer-daemon@`
   * `mailer_daemon@`
   * `mailerdaemon@`

4. We don't send bounces if the original message had any of the following headers (case-insensitive):

   * `Auto-Submitted` (with a value of `no`)
   * `X-Auto-Response-Suppress` (with a value of `dr`, `autoreply`, `auto-reply`, `auto_reply`, or `all`)
   * `List-Id`
   * `List-Unsubscribe`
   * `Feedback-ID`
   * `X-Auto-Reply`
   * `X-Autoreply`
   * `X-Auto-Respond`
   * `X-Autorespond`
   * `Precedence` (with a value of `bulk`, `autoreply`, `auto-reply`, `auto_reply`, or `list`)


## How do you determine an email fingerprint

An email's fingerprint is used for determining uniqueness of an email and to prevent duplicate messages from being delivered and [duplicate bounces](#prevent-unnecessary-bounces-to-protect-against-backscatter) from being sent.

The fingerprint is a series of cryptographically calculated hashes delimited by a colon, and it is used internally in our codebase.

These calculated hashes are pushed to an Array (a list) if and only if their values exist:

* Client resolved FQDN hostname or IP address
* `Message-ID` header value
* `Date` header value (if and only if `Message-ID` did not exist)
* `From` header value (if and only if `Message-ID` did not exist)
* `To` header value (if and only if `Message-ID` did not exist)
* `Cc` header value (if and only if `Message-ID` did not exist)
* `Subject` header value (if and only if `Message-ID` did not exist)
* `Body` value (if and only if `Message-ID` did not exist)


## Why are my test emails sent to myself in Gmail showing as "suspicious"

If you see this error message in Gmail when you send a test to yourself, or when a person you're emailing with your alias sees an email from you for the first time, then **please do not worry** – as this is a built-in safety feature of Gmail.

You can simply click "Looks safe".  For example, if you were to send a test message using the send mail as feature (to someone else), then they will not see this message.

However if they do see this message, it's because they were normally used to seeing your emails come from <john@gmail.com> instead of <john@customdomain.com> (just an example).  Gmail will alert the users just to make sure things are safe just in case, there is no workaround.


## Can I remove the via forwardemail dot net in Gmail

This is ONLY applicable if you are using the [How to Send Mail As using Gmail](#how-to-send-mail-as-using-gmail) feature.  Currently there is no workaround for this, and it affects all service providers (not just us).  The workaround is to use a custom SMTP server.  However we do not offer SMTP yet.

We plan to release our very own SMTP service (not just forwarding, but email in general), which would alleviate this.  Gmail automatically adds this and there is no current workaround.  Other email forwarding services with similar features to ours will still incur this same issue too (and other email forwarding solutions  simply do not offer the level of privacy we do).

If you want to get notified when this is released, you can email <smtp@forwardemail.net> and we'll send you a notification once it's released.  Or just sign up for an account here if you haven't already!


## Can I forward emails to ports other than 25 (e.g. if my ISP has blocked port 25)

Yes, as of May 5, 2020 we have added this feature.  Right now the feature is domain-specific, as opposed to alias-specific.  If you require it to be alias-specific, please contact us to let us know of your needs.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Enhanced Privacy Protection:
  </strong>
  <span>
    If you are on a paid plan (which features enhanced privacy protection), then please go to <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a>, click on "Setup" next to your domain, and then click on "Advanced Settings".  If you would like to learn more about paid plans see our <a class="alert-link" rel="noopener noreferrer" href="/pricing">Pricing</a> page.  Otherwise you can continue to follow the instructions below.
  </span>
</div>

If you are on the free plan, then simply add a new DNS TXT record as shown below, but change the port from 25 to the port of your choosing.

For example, if I want all emails that go to `example.com` to forward to alias recipients' SMTP port of 1337 instead of 25:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email-port=1337</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    The most common scenario for custom port forwarding setup is when you want to forward all emails that go to example.com to a different port at example.com, other than the SMTP standard of port 25.  To set this up, simply add the following TXT catch-all record.
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=example.com</code></td>
    </tr>
  </tbody>
</table>


## Do you offer a money back guarantee on paid plans

Yes!  We offer a 30-day money back guarantee on all paids plans if you are not satisfied with our service.

We do not ask any questions and simply process the refund within 5-7 business days.

To request a refund, please send an email from the email address verified on your account to: <refunds@forwardemail.net>


## If I switch plans do you pro-rate and refund the difference

Yes, we will manually process your refund for you and email you once complete.  You will get a notification regarding the refund amount when you switch plans.


## Do you support webhooks

Yes, as of May 15, 2020 we have added this feature.  You can simply add webhook(s) exactly like you would with any recipient!  Please ensure that you have the "http" or "https" protocol prefixed in the webhook's URL.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Enhanced Privacy Protection:
  </strong>
  <span>
    If you are on a paid plan (which features enhanced privacy protection), then please go to <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> and click on "Aliases" next to your domain to configure your webhooks.  If you would like to learn more about paid plans see our <a class="alert-link" rel="noopener noreferrer" href="/pricing">Pricing</a> page.  Otherwise you can continue to follow the instructions below.
  </span>
</div>

If you are on the free plan, then simply add a new DNS TXT record as shown below:

For example, if I want all emails that go to `alias@example.com` to forward to a new [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect) test endpoint:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
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
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

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
      "key": "x-forwardemail-sender",
      "line": "X-ForwardEmail-Sender: rfc822; test@example.net"
    },
    {
      "key": "x-forwardemail-session-id",
      "line": "X-ForwardEmail-Session-ID: w2czxgznghn5ryyw"
    },
    {
      "key": "x-forwardemail-version",
      "line": "X-ForwardEmail-Version: 9.0.0"
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
  "raw": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nX-ForwardEmail-Sender: rfc822; test@example.net\r\nX-ForwardEmail-Session-ID: w2czxgznghn5ryyw\r\nX-ForwardEmail-Version: 9.0.0\r\nContent-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\"\r\nFrom: some <random@example.com>\r\nMessage-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>\r\nDate: Wed, 25 May 2022 19:26:41 +0000\r\nMIME-Version: 1.0\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: multipart/alternative;\r\n boundary=\"--_NmP-179a735428ca7575-Part_2\"\r\n\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\nsome random text\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\n<strong>some random text</strong>\r\n----_NmP-179a735428ca7575-Part_2--\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: text/plain; name=text1.txt\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=text1.txt\r\n\r\naGVsbG8gd29ybGQh\r\n----_NmP-179a735428ca7575-Part_1--\r\n",
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

> Note that we use the [mailparser](https://nodemailer.com/extras/mailparser/) library's "simpleParser" method to parse the message into a JSON friendly object.

> Raw email value as a String is given as the property "raw".

> Authentication results are given as properties "dkim", "spf", "arc", "dmarc", and "bimi".

> The parsed email headers is given as the property "headers" – but also note you can use "headerLines" for easier iteration and parsing.

> The grouped recipients for this webhook are grouped together and given as the property "recipients".

> The SMTP session information is given as the property "session".  This contains information about the sender of the message, arrival time of the message, HELO, and client hostname.  The client hostname value as `session.clientHostname` is either the FQDN (from a reverse PTR lookup) or it is `session.remoteAddress` wrapped in brackets (e.g. `"[127.0.0.1]"`).

> If there are attachments, they will be appended to the `attachments` Array with Buffer values.  You can parse them back into content using an approach with JavaScript such as:

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

Webhook HTTP requests will retry up to 10 times (the exact same number of retries we permit for normal SMTP), with 20 seconds max timeout per endpoint POST request.  We will retry automatically based off the default status and error codes used in [superagent's retry method](https://visionmedia.github.io/superagent/#retrying-requests).

We group together webhook HTTP requests to the same endpoint in one request instead of multiple) in order to save resources and speed up response time.  For example, if you send an email to <webhook1@example.com>, <webhook2@example.com>, and <webhook3@example.com>, and all of these are configured to hit the same *exact* endpoint URL, then only one request will be made.  We group together by exact endpoint matching with strict equality.


## Do you support regular expressions or regex

Yes, as of September 27, 2021 we have added this feature.  You can simply write regular expressions ("regex") for matching aliases and performing substitions.

Regular expression supported aliases are ones that start with a `/` and end with `/` and their recipients are email addresses or webhooks.  The recipients can also include regex substitution support (e.g. `$1`, `$2`).

We support two regular expression flags including `i` and `g`.  The case-insensitive flag of `i` is a permanent default and it is always enforced.  The global flag of `g` can be added by you by affixing the ending `/` with `/g`.

Note that we also support our <a href="#can-i-disable-specific-aliases">disabled alias feature</a> for the recipient portion with our regex support.

Regular expressions are not supported on <a href="/free-disposable-addresses" target="_blank">free global vanity domains</a> (as this could be a security vulnerability).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Enhanced Privacy Protection:
  </strong>
  <span>
    If you are on a paid plan (which features enhanced privacy protection), then please go to <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> and click on "Aliases" next to your domain to configure regular expressions.  If you would like to learn more about paid plans see our <a class="alert-link" rel="noopener noreferrer" href="/pricing">Pricing</a> page.  Otherwise you can continue to follow the instructions below.
  </span>
</div>

If you are on the free plan, then simply add a new DNS TXT record as shown below:

<strong>Simple Example:</strong> If I want all emails that go to `elon@example.com` or `musk@example.com` to forward to `user@gmail.com`:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=/^(elon|musk)$/:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<strong>Firstname Lastname Substitution Example:</strong> Imagine all of your company email addresses are of the `firstname.lastname@example.com` pattern.  If I want all emails that go to the pattern of `firstname.lastname@example.com` to forward to `firstname.lastname@company.com` with substitution support (<a href="https://regexr.com/66hnu" class="alert-link">view test on RegExr</a>):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
    </tr>
  </tbody>
</table>

<strong>Plus Symbol Filtering Substitution Example:</strong> If I want all emails that go to `info@example.com` or `support@example.com` to forward to `user+info@gmail.com` or `user+support@gmail.com` respectively (with substitution support) (<a href="https://regexr.com/66ho7" class="alert-link">view test on RegExr</a>):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<strong>Webhook Querystring Substitution Example:</strong> Perhaps you want all emails that go to `example.com` to go to a <a href="#do-you-support-webhooks" class="alert-link">webhook</a> and have a dynamic querystring key of "to" with a value of the username portion of the email address (<a href="https://regexr.com/66ho4" class="alert-link">view test on RegExr</a>)::

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
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


## Can I just use this email forwarding service as a "fallback" or "fallover" MX server

No, it is not recommended, as you can only use one mail exchange server at a time.  Fallbacks are usually never retried due to priority misconfigurations and mail servers not respecting MX exchange priority checking.


## Can I disable specific aliases

Yes! As of February 6, 2020 we have added this feature.  Simply edit your DNS TXT record and prefix the alias with an exclamation mark.  Note that you must preserve the ":" mapping, as this is required if you ever decide to toggle this off (and it's also used for importing in our paid plans).

If you prefix an alias with "!" (exclamation mark) then it will still return successful respond codes to senders attempting to send to this address, but the emails themselves will go nowhere; to a blackhole.

Emails sent to disabled addresses will respond with a SMTP response status code of 250 (accepted), but the emails will not actually be delivered to the recipient(s).

For example, if I want all emails that go to `alias@example.com` to stop flowing through to `user@gmail.com`:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=!alias:user@gmail.com</code></td>
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
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=!alias:nobody@forwardemail.net</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    If you want increased security, then you can also remove the ":user@gmail.com" (or ":nobody@forwardemail.net") part, leaving just "!alias" as in the example below.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=!alias</code></td>
    </tr>
  </tbody>
</table>


## Can I forward emails to multiple recipients

Yes, absolutely.  Just specify multiple recipients in your TXT records.

For example, if I want an email that goes to `hello@example.com` to get forwarded to `user+a@gmail.com` and `user+b@gmail.com`, then my TXT record would look like this:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code style="cursor: initial;" data-original-title="" title="" aria-describedby="tooltip885348">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
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
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=hello:user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

It's up to you!


## Can I have multiple global catch-all recipients

Yes, you can. Just specify multiple global catch-all recipients in your TXT records.

For example, if I want every email that goes to `*@example.com` (the asterisk meaning its a wildcard aka catch-all) to get forwarded to `user+a@gmail.com` and `user+b@gmail.com`, then my TXT record would look like this:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
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
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@, ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

It's up to you!


## Is there a maximum limit on the number of email addresses I can forward to per alias

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


## Can I recursively forward emails

Yes, you can, however you still must adhere to the maximum limit.  If you have `hello:elon@example.com` and `elon:user@gmail.com`, then emails to `hello@example.com` would get forwarded to `elon@example.com` and `user@gmail.com`.  Note that an error will be thrown if you attempt to recursively forward emails.


## Can people unregister or register my email forwarding without my permission

We use MX and TXT record verification, therefore if you add this service's respective MX and TXT records, then you're registered.  If you remove them, then you're unregistered.  You have ownership of your domain and DNS management, so if someone has access to that then that's a problem.


## How is it free

The service continues to run thanks to users that upgraded to paid plans.  We want to provide a free alternative for people that are using closed-source forwarding services (and subsequently risking their privacy and security).


## What is the max email size limit

We default to a 50MB size limit, which includes content, headers, and attachments.  Note that services such as Gmail and Outlook allow only 25MB size limit, and if you exceed the limit when sending to addresses at those providers you will receive an error message.

An error with the proper response code is returned if the file size limit is exceeded.


## Do you store emails and their contents

No, absolutely not.  See our [Privacy Policy](/privacy).


## Do you store logs of emails

No, absolutely not.  See our [Privacy Policy](/privacy).


## Do you read my emails

No, absolutely not.  We do not store SMTP logs.  See our [Privacy Policy](/privacy).

Many other email forwarding services store and could potentially read your email.  There is no reason why forwarded emails need to be stored to disk storage – and therefore we architected the first open-source solution that does it all in-memory.

We believe you should have a right to privacy and we strictly respect it.  The code that is deployed to the server is [open-source software on GitHub](https://github.com/forwardemail) for transparency and to build trust.


## Does it support the plus + symbol for Gmail aliases

Yes, absolutely.


## Does it support sub-domains

Yes, absolutely.  Instead of using "@", ".", or blank as the name/host/alias, you just use the sub-domain name as the value instead.

If you want `foo.example.com` to forward emails, then enter `foo` as the name/host/alias value in your DNS settings (for both MX and TXT records).


## Does this forward my email's headers

Yes, absolutely.


## Is this well-tested

Yes, it has tests written with [ava](https://github.com/avajs/ava) and also has code coverage.


## Do you pass along SMTP response messages and codes

Yes, absolutely.  For example if you're sending an email to `hello@example.com` and it's registered to forward to `user@gmail.com`, then the SMTP response message and code from the "gmail.com" SMTP server will be returned instead of the proxy server at "mx1.forwardemail.net" or "mx2.forwardemail.net".


## How do you prevent spammers and ensure good email forwarding reputation

See our sections on [How does your email forwarding system work](#how-does-your-email-forwarding-system-work), [How do you handle email delivery issues](#how-do-you-handle-email-delivery-issues), and [How do you handle your IP addresses becoming blacklisted](#how-do-you-handle-your-ip-addresses-becoming-blacklisted) above.


## What should I do if I receive spam emails

You should unsubscribe from the emailing list (if possible) and block the sender.

Please do not report the message as spam, but instead forward it to our manually curated and privacy-focused abuse prevention system.

**The email address to forward spam to is:** <abuse@forwardemail.net>


## Can I "send mail as" in Gmail with this

Yes! As of October 2, 2018 we have added this feature.  See [How to Send Mail As using Gmail](#how-to-send-mail-as-using-gmail) above!

You should also set the SPF record for Gmail in your DNS configuration TXT record.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    If you are using Gmail (e.g. Send Mail As) or G Suite, then you'll need to append <code>include:_spf.google.com</code> to your SPF TXT record, for example:
    <br /><br />
    <code>v=spf1 a mx include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>


## Can I "send mail as" in Outlook with this

Yes! As of October 2, 2018 we have added this feature.  Simply view these two links from Microsoft below:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

You should also set the SPF record for Outlook in your DNS configuration TXT record.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important:
  </strong>
  <span>
    If you are using Microsoft Outlook or Live.com, you'll need to append <code>include:spf.protection.outlook.com</code> to your SPF TXT record, for example:
    <br /><br />
    <code>v=spf1 a mx include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>


## Can I "send mail as" in Apple Mail and iCloud Mail with this

Unfortunately Apple does not allow this, regardless of which service you use.  However you can use the Mail app along with your domain's email account.

* <https://discussions.apple.com/thread/8316291>
* <https://discussions.apple.com/thread/6876839>


## Can I forward unlimited emails with this

Yes, however "relatively unknown" senders are rate limited to 1,000 connections per hour per hostname or IP.  See the section on [Rate Limiting](#do-you-have-rate-limiting) and [Greylisting](#do-you-have-a-greylist) above.

By "relatively unknown", we mean senders that do not appear in the [Whitelist](#do-you-have-a-whitelist).

If this limit is exceeded we send a "421" response code which tells the senders mail server to retry again later.


## How do I add a profile picture to my email address

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


## What is the difference between Free and Enhanced Protection

The Free plan requires you to use public DNS records to store your forwarding configuration. Anyone with a computer can lookup your forwarding configuration in a terminal if you are on the Free plan. Unlike the Free plan, the Enhanced Protection plan uses a cryptographically generated random string to store your forwarding configuration privately.

|            Free Plan           |           Enhanced Protection Plan           |
| :----------------------------: | :------------------------------------------: |
| `forward-email=user@gmail.com` | `forward-email-site-verification=m8d7o8K4Il` |


## Do you support email best practices

Yes. We have built-in support for SPF, DKIM, DMARC, ARC, and SRS across all plans. We have also worked extensively with the original authors of these specifications and other email experts to ensure perfection and high deliverability.


## Do you offer unlimited domains for one price

Yes. Regardless of which plan you are on, you will pay only one monthly rate – which covers all of your domains.


## Which payment methods do you accept

We accept debit and credit cards using [Stripe](https://stripe.com/global) and [PayPal](https://paypal.com/) – for one-time payments or monthly, quarterly, or yearly subscriptions.


## Will you ever increase prices

No. Prices will never increase. Unlike other companies, we will never shutdown our service either.


## How do you perform DNS lookups on domain names

We use CloudFlare's privacy-first consumer DNS service (see [announcement here][cloudflare-dns]).  We set `1.1.1.3` and `1.0.0.3` as the DNS servers (see <https://developers.cloudflare.com/1.1.1.1/1.1.1.1-for-families/>) using `/etc/resolv.conf` on our servers and test environments.


## How fast is this service

The latest version, v2 (released on May 6, 2019) was a major rewrite from v1 and focuses on performance through streams.  [Nodemailer's][nodemailer] prolific author Andris Reinman ([@andris9](https://github.com/andris9)) helped us switch off using the `mailparser` library and use `mailsplit` instead with some custom transform logic to split the header and the body of the message without affecting the body.  This allows us to perform operations on headers very fast (such as security checks and for SPF/DKIM/DMARC compliance).

**In other words, the latest version of this service uses streams purely now and is lightning fast.**  The older version v1 also had some logic not in the most optimal order of operations – but now v2 does less memory/network intense operations first (and returns early if possible to send a response as quickly as possible to the SMTP client).  We plan to continue to optimize speed, enhance features, and improve this service over time.

At no point in time do we write to disk or store emails – everything is done in-memory thanks to Node.js's streams and transforms! :tada:


##

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/

[nodemailer]: https://github.com/nodemailer/nodemailer
