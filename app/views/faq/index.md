# Frequently Asked Questions


## Table of Contents

* [How do I get started and set up email forwarding](#how-do-i-get-started-and-set-up-email-forwarding)
* [How to Send Mail As using Gmail](#how-to-send-mail-as-using-gmail)
* [Why am I not receiving my test emails](#why-am-i-not-receiving-my-test-emails)
* [Why are my test emails sent to myself in Gmail showing as "suspicious"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
* [Can I remove the via forwardemail dot net in Gmail](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Can I forward emails to ports other than 25 (e.g. if my ISP has blocked port 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
* [Do you offer a money back guarantee on paid plans](#do-you-offer-a-money-back-guarantee-on-paid-plans)
* [If I switch plans do you pro-rate and refund the difference](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
* [Do you support webhooks](#do-you-support-webhooks)
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
* [What should I do if I receive spam emails?](#what-should-i-do-if-i-receive-spam-emails)
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
    All plans abide by our <a class="alert-link" href="/privacy">Privacy</a> policy of strictly not storing logs, metadata, nor emails.
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
    You must open a new tab and log in to your domain registrar.  You can easily click on your "Registrar" below to automatically do this.  In this new tab, you must navigate to the DNS management page at your registrar &ndash; and we have provided the step by step navigation steps below under the "Steps to Configure DNS" column.  Once you've navigated to this page in the new tab, you can return to this tab and proceed to step three below.
    <strong class="font-weight-bold">Do not close the opened tab yet; you will need it for future steps!</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Registrar</th>
      <th>Steps to Configure DNS</th>
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
      <td>Using <code>now</code> CLI <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Domains page <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Domains page <i class="fa fa-angle-right"></i> (Click <code>...</code> icon) <i class="fa fa-angle-right"></i> Select Manage DNS Records</td>
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
      <th>Record Type</th>
      <th>Priority</th>
      <th>Value/Answer/Destination</th>
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
      <th>Record Type</th>
      <th>Value/Answer/Destination</th>
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
    Make sure to replace the values above in the "Value/Answer/Destination" column with your own email address.  The "TTL" value does not need to be 3600, it could be a lower or higher value if necessary.  A lower time to live ("TTL") value will ensure any future changes made to your DNS records are propagated throughout the Internet quicker &ndash; think of this as how long it will be cached in-memory (in seconds).  You can learn more about <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL on Wikipedia</a>.
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
      <th>Record Type</th>
      <th>Value/Answer/Destination</th>
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
      <th>Record Type</th>
      <th>Value/Answer/Destination</th>
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
      <th>Record Type</th>
      <th>Value/Answer/Destination</th>
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
      <th>Record Type</th>
      <th>Value/Answer/Destination</th>
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
      <th>Record Type</th>
      <th>Value/Answer/Destination</th>
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
      <th>Record Type</th>
      <th>Value/Answer/Destination</th>
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

<div class="text-muted">Now you can <a href="https://www.youtube.com/watch?v=hvuzUasjFAo" target="_blank" rel="noopener noreferrer">start dancing</a>, <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer">sing a song</a>, and start forwarding emails!  If you have enjoyed these instructions, then please consider <a rel="noopener noreferrer" href="/pricing">upgrading to a paid plan</a> or sending us a <a href="/donate">donation</a>.  Additional tips and optional add-ons are described below:</div>

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

<iframe style="display:block; margin:0 auto; margin-bottom: 20px;" width="890" height="500" src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

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
      <th>Record Type</th>
      <th>Value/Answer/Destination</th>
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
      <th>Record Type</th>
      <th>Value/Answer/Destination</th>
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
      <th>Record Type</th>
      <th>Value/Answer/Destination</th>
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
      <th>Record Type</th>
      <th>Value/Answer/Destination</th>
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
  "attachments": [],
  "headers": {},
  "headerLines": [
    {
      "key": "dkim-signature",
      "line": "DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=forwardemail.net;\r\n q=dns/txt; s=default; bh=fdkeB/A0FkbVP2k4J4pNPoeWH6vqBm9+b0C3OY87Cw8=;\r\n h=from:subject:date:message-id:to:mime-version:content-type:content-transfer-encoding;\r\n b=KJZp0q0u/cQhcjwilKMainmlystwHgCZ7/ncK1uBmmdGoaXlQcMHsfenLyn/uribhMVrdfWw6\r\n YhQ5AIOAGoft/fwpGhl3zP1b5qrPwYu0kLMPr2MSwkLo0YVdbHB6xF+VGeg2vaduJk6CipXjMW7\r\n Mlohmvjw0m1tnN6dAYGOkwQ="
    },
    {
      "key": "message-id",
      "line": "Message-ID: <123.abc@test>"
    },
    {
      "key": "date",
      "line": "Date: Thu, 9 Nov 2000 10:44:00 -0800 (PST)"
    },
    {
      "key": "to",
      "line": "To: webhook@example.com"
    },
    {
      "key": "from",
      "line": "From: Test <test@user.com>"
    },
    {
      "key": "subject",
      "line": "Subject: testing webhooks"
    },
    {
      "key": "mime-version",
      "line": "Mime-Version: 1.0"
    },
    {
      "key": "content-type",
      "line": "Content-Type: text/plain; charset=us-ascii"
    },
    {
      "key": "content-transfer-encoding",
      "line": "Content-Transfer-Encoding: 7bit"
    }
  ],
  "text": "Test\n",
  "textAsHtml": "<p>Test</p>",
  "subject": "testing webhooks",
  "date": "2000-11-09T18:44:00.000Z",
  "to": {
    "value": [
      {
        "address": "webhook@example.com",
        "name": ""
      }
    ],
    "html": "<span class=\"mp_address_group\"><a href=\"mailto:webhook@example.com\" class=\"mp_address_email\">webhook@example.com</a></span>",
    "text": "webhook@example.com"
  },
  "from": {
    "value": [
      {
        "address": "test@example.com",
        "name": "Test"
      }
    ],
    "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">Test</span> &lt;<a href=\"mailto:test@example.com\" class=\"mp_address_email\">test@example.com</a>&gt;</span>",
    "text": "Test <test@examplecom>"
  },
  "messageId": "<123.abc@test>",
  "html": false,
  "raw": "DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=forwardemail.net;\r\n q=dns/txt; s=default; bh=fdkeB/A0FkbVP2k4J4pNPoeWH6vqBm9+b0C3OY87Cw8=;\r\n h=from:subject:date:message-id:to:mime-version:content-type:content-transfer-encoding;\r\n b=KJZp0q0u/cQhcjwilKMainmlystwHgCZ7/ncK1uBmmdGoaXlQcMHsfenLyn/uribhMVrdfWw6\r\n YhQ5AIOAGoft/fwpGhl3zP1b5qrPwYu0kLMPr2MSwkLo0YVdbHB6xF+VGeg2vaduJk6CipXjMW7\r\n Mlohmvjw0m1tnN6dAYGOkwQ=\r\nMessage-ID: <123.abc@test>\r\nDate: Thu, 9 Nov 2000 10:44:00 -0800 (PST)\r\nTo: webhook@example.com\r\nFrom: Test <test@example.com>\r\nSubject: testing webhooks\r\nMime-Version: 1.0\r\nContent-Type: text/plain; charset=us-ascii\r\nContent-Transfer-Encoding: 7bit\r\n\r\nTest\r\n"
}
```

> Note that we use the [mailparser](https://nodemailer.com/extras/mailparser/) library's "simpleParser" method to parse the message into a JSON friendly object, and also append the "raw" property with the raw email message as a String.

Webhook HTTP requests will retry up to 10 times (the exact same number of retries we permit for normal SMTP), with 20 seconds max timeout per endpoint POST request.  We will retry automatically based off the default status and error codes used in [superagent's retry method](https://visionmedia.github.io/superagent/#retrying-requests) (this package is also maintained by the creator of Forward Email).


## Can I just use this email forwarding service as a "fallback" or "fallover" MX server

Yes, but this is <u>NOT</u> recommended as this is an incredibly rare edge case.

If you use Google Business for email, and want to use our server as a fallback so your mail still gets delivered, then just specify the Google mail servers with a lower priority than our mail servers.  An example is provided below:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Record Type</th>
      <th>Priority</th>
      <th>Value/Answer/Destination</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>1</td>
      <td><code>ASPMX.L.GOOGLE.COM</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>5</td>
      <td><code>ALT1.ASPMX.L.GOOGLE.COM</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>5</td>
      <td><code>ALT2.ASPMX.L.GOOGLE.COM</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>10</td>
      <td><code>ALT3.ASPMX.L.GOOGLE.COM</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>10</td>
      <td><code>ALT4.ASPMX.L.GOOGLE.COM</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>20</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", or blank</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>30</td>
      <td><code>mx2.forwardemail.net</code></td>
    </tr>
  </tbody>
</table>


## Can I disable specific aliases

Yes! As of February 6, 2020 we have added this feature.  Simply edit your DNS TXT record and prefix the alias with an exclamation mark.  Note that you must preserve the ":" mapping, as this is required if you ever decide to toggle this off (and it's also used for importing in our paid plans).

If you prefix an alias with "!" (exclamation mark) then it will still return successful respond codes to senders attempting to send to this address, but the emails themselves will go nowhere; to a blackhole.

Emails sent to disabled addresses will respond with a `250` (message queued) status code, but the emails will not actually be delivered to the recipient(s).

For example, if I want all emails that go to `alias@example.com` to stop flowing through to `user@gmail.com`:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Record Type</th>
      <th>Value/Answer/Destination</th>
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
      <th>Record Type</th>
      <th>Value/Answer/Destination</th>
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
      <th>Record Type</th>
      <th>Value/Answer/Destination</th>
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
      <th>Record Type</th>
      <th>Value/Answer/Destination</th>
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
      <th>Record Type</th>
      <th>Value/Answer/Destination</th>
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
      <th>Record Type</th>
      <th>Value/Answer/Destination</th>
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
      <th>Record Type</th>
      <th>Value/Answer/Destination</th>
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

The service continues to run thanks to [donations](/donate) and users that upgraded to paid plans.  We want to provide a free alternative (since we feel bad) for people that are using closed-source forwarding services (and subsequently risking their privacy and security).


## What is the max email size limit

We default to a 50MB size limit, which includes content, headers, and attachments.  Note that services such as Gmail and Outlook allow only 25MB size limit, and if you exceed the limit when sending to addresses at those providers you will receive an error message.

An error with the proper response code is returned if the file size limit is exceeded.


## Do you store emails and their contents

No, absolutely not.  See our [Privacy Policy](/privacy).


## Do you store logs of emails

No, absolutely not.  See our [Privacy Policy](/privacy).


## Do you read my emails

No, absolutely not.  We do not store logs.  See our [Privacy Policy](/privacy).

Many other email forwarding services unethically read your email.  This is not in alignment with our principles and philosophy on software.

We believe you should have a right to privacy and we strictly respect it.

The code that is deployed to the server is [open-source software on GitHub](https://github.com/forwardemail) for transparency and to build trust.


## Does it support the plus + symbol for Gmail aliases

Yes, absolutely.


## Does it support sub-domains

Yes, absolutely.  Instead of using "@", ".", or blank as the name/host/alias, you just use the sub-domain name as the value instead.

If you want `foo.example.com` to forward emails, then enter `foo` as the name/host/alias value in your DNS settings (for both MX and TXT records).


## Does this forward my email's headers

Yes, absolutely.


## Is this well-tested

Yes, it has tests written with [ava](https://github.com/avajs/ava/pull/2323) and also has code coverage.


## Do you pass along SMTP response messages and codes

Yes, absolutely.  For example if you're sending an email to `hello@example.com` and it's registered to forward to `user@gmail.com`, then the SMTP response message and code from the "gmail.com" SMTP server will be returned instead of the proxy server at "mx1.forwardemail.net" or "mx2.forwardemail.net".


## How do you prevent spammers and ensure good email forwarding reputation

Per documentation and suggestions from Google at <https://support.google.com/a/answer/175365?hl=en>, along with best practice, including:

1. **DNS Blacklists:** we test senders IP's against the Spamhaus [DNS blacklists][dns-blacklists], if any fail, then the sender is not permitted to send the message and is returned a detailed error message with instructions on how to de-list themselves from the specific blacklists they're listed under.

2. **Anti-Spam and Anti-Phishing Scanner**: we built from scratch and use [Spam Scanner][spamscanner] for anti-spam prevention (it uses a Naive Bayes classifier under the hood).  We built this because we were not happy with [rspamd][] nor [SpamAssassin][], nor were we happy with their lack of privacy-focused policies and public corpus datasets.  Spam Scanner checks a message for spam, phishing, executables, viruses, and more, while completely respecting your privacy.

3. **SPF and DKIM:** through checking if an SPF record exists for a sender, and if so, we reverse-lookup the SMTP connection's remote address to validate it matches the SPF record, otherwise it's rejected.  If an SPF record does not exist, then we require DKIM verification.  If DKIM headers are passed and fail, then it is rejected as well.  If no DKIM headers are passed, then we assume that DKIM validation passes.

4. **MX Record Test:** through checking if the sender's from address domain has MX records (so it's actually coming from a mail exchange/SMTP server), otherwise it's rejected.

5. **Fully Qualified Domain Name Test:** validates that senders SMTP connections are from a fully qualified domain name ("FQDN"), meaning no IP addresses, they must have a valid domain name resolved.

6. **TXT Record Test:** through checking if the email address the sender is trying to send to has a TXT DNS record with a valid email forwarding setup. The SSL certificates (main domain name or alternative names) of all MX servers of the forwarding destination must match the MX entry.

7. **ARC:** we use the [Authentication-Results][] header and validate it against the sending domain's DMARC policy.


## What should I do if I receive spam emails?

You should unsubscribe from the emailing list (if possible) and block the sender.

Please do not report the message as spam, but instead forward it to our manually curated and privacy-focused abuse prevention system.

**The email address to forward spam to is:** <abuse@forwardemail.net>


## Can I "send mail as" in Gmail with this

Yes! As of October 2, 2018 we have added this feature.  See [How to Send Mail As using Gmail](#how-to-send-mail-as-using-gmail) above!


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

Practically yes - the only current restriction is that senders **by unique email address** are limited to sending (300) emails per hour through the system.

If this limit is exceeded we send a "451" response code which tells the senders mail server to retry later.


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

We accept credit cards using [Stripe](https://stripe.com/global) and payment with [PayPal](https://paypal.com/) – for one-time payments and monthly or yearly subscriptions.

If you need to make payment with Bitcoin or other means, please email us at <support@forwardemail.net>.


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

[dns-blacklists]: https://en.wikipedia.org/wiki/Domain_Name_System-based_Blackhole_List

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/

[nodemailer]: https://github.com/nodemailer/nodemailer

[spamscanner]: https://github.com/spamscanner/spamscanner

[rspamd]: https://www.rspamd.com/

[spamassassin]: https://spamassassin.apache.org/

[authentication-results]: https://en.wikipedia.org/wiki/Email_authentication#Authentication-Results
