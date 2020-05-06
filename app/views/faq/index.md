# Frequently Asked Questions


## Table of Contents

* [How do I get started and set up email forwarding](#how-do-i-get-started-and-set-up-email-forwarding)
* [How to Send Mail As using Gmail](#how-to-send-mail-as-using-gmail)
* [Why am I not receiving my test emails](#why-am-i-not-receiving-my-test-emails)
* [Why are my test emails sent to myself in Gmail showing as "suspicuious"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicuious)
* [Can I remove the "via forwardemail.net" in Gmail](#can-i-remove-the-via-forwardemailnet-in-gmail)
* [Can I forward emails to ports other than 25 (e.g. if my ISP has blocked port 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
* [Do you offer a money back guarantee on paid plans](#do-you-offer-a-money-back-guarantee-on-paid-plans)
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
    If you would like to hide your information from being publicly searchable over the Internet, then please go to <a class="alert-link" href="/my-account/domains" target="_blank" rel="noopener">My Account <i class="fa fa-angle-right"></i> Domains</a> and upgrade your domain to a paid plan before starting this guide.
    Publicly searchable information on free plans includes, but is not limited to: aliases, forwarded addresses, recipients, and advanced settings such as custom port forwarding.
    If you would like to learn more about paid plans see our <a class="alert-link" rel="noopener" href="/features">Features</a> page &ndash; else keep reading!
    All plans abide by our <a class="alert-link" href="/privacy">Privacy</a> policy of strictly not storing logs, metadata, nor reading emails
    We don't track you like other services do.
  </span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-play-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Getting Started:
  </strong>
  <span>
    Carefully read and follow steps one through eight listed below.  Be sure to replace the email address of <code>niftylettuce@gmail.com</code> with the email address you want to forward emails to (only if it is not accurate already).  Similarly be sure to replace <code>example.com</code> with your custom domain name (only if it is not accurate already).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">If you have already registered your domain name somewhere, then you must completely skip this step and go to step two!  Otherwise you can <a href="/domain-registration" rel="noopener">click here to register your domain name</a>.</li>
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
      <td><a rel="nofollow" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Domain Center <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Edit DNS Settings</td>
    </tr>
    <tr>
      <td><a rel="nofollow" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Hosted Zones <i class="fa fa-angle-right"></i> (Select your domain)</td>
    </tr>
    <tr>
      <td><a rel="nofollow" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> My Servers <i class="fa fa-angle-right"></i> Domain Management <i class="fa fa-angle-right"></i> DNS Manager</td>
    </tr>
    <tr>
      <td><a rel="nofollow" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="nofollow" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Select your domain)</td>
    </tr>
    <tr>
      <td><a rel="nofollow" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> (Select your domain)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Manage</td>
    </tr>
    <tr>
      <td><a rel="nofollow" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Networking <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> More <i class="fa fa-angle-right"></i> Manage Domain</td>
    </tr>
    <tr>
      <td><a rel="nofollow" target="_blank" href="https://www.domains.com/">Domains.com</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> (click gear icon) <i class="fa fa-angle-right"></i> Click on DNS &amp; Nameservers in left-hand menu</td>
    </tr>
    <tr>
      <td><a rel="nofollow" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Manage Domains <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="nofollow" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Overview <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> Simple Editor <i class="fa fa-angle-right"></i> Records</td>
    </tr>
    <tr>
      <td><a rel="nofollow" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Management <i class="fa fa-angle-right"></i> Edit the zone</td>
    </tr>
    <tr>
      <td><a rel="nofollow" target="_blank" href="https://sso.godaddy.com">GoDaddy</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Manage My Domains <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Manage DNS</td>
    </tr>
    <tr>
      <td><a rel="nofollow" target="_blank" href="https://domains.google.com/registrar">Google Domains</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Configure DNS</td>
    </tr>
    <tr>
      <td><a rel="nofollow" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Domain List <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> Advanced DNS</td>
    </tr>
    <tr>
      <td><a rel="nofollow" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Setup Netlify DNS</td>
    </tr>
    <tr>
      <td><a rel="nofollow" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Account Manager <i class="fa fa-angle-right"></i> My Domain Names <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> Change Where Domain Points <i class="fa fa-angle-right"></i> Advanced DNS</td>
    </tr>
    <tr>
      <td><a rel="nofollow" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Managed Domains <i class="fa fa-angle-right"></i> (Select your domain) <i class="fa fa-angle-right"></i> DNS Settings</td>
    </tr>
    <tr>
      <td><a rel="nofollow" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Sign in <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> My Domains</td>
    </tr>
    <tr>
      <td>Other</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Important:</strong> Don't see your registrar name listed here?  Simply search on the Internet for "how to change DNS records on $REGISTRAR" (replacing "$REGISTRAR" with the name of your registrar &ndash; e.g. "how to change DNS records on GoDaddy" if you're using GoDaddy).</div>
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
    Note that there should be NO other MX records set.  Both of the above records MUST exist.  Be sure there are no typos; and you have both mx1 and mx2 spelled correctly.If there were already MX records that existed, please delete them completely.
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
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>10</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>20</td>
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
    If you are on a paid plan, then you must completely skip this step and go to step five! If you are not on a paid plan, then your forwarded addresses will be publicly searchable – go to <a href="/my-account/domains" target="_blank" rel="noopener" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> and upgrade your domain to a paid plan if desired.  If you would like to learn more about paid plans see our <a rel="noopener" href="/features" class="alert-link">Features</a> page.  Otherwise you can continue to choose one or more combinations from Option A to Option E listed below.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option A:
  </strong>
  <span>
    If you are forwarding all emails from your domain, (e.g. "all@example.com", "hello@example.com", etc) to a specific address "niftylettuce@gmail.com":
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
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=niftylettuce@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Make sure to replace the values above in the "Value/Answer/Destination" column with your own email address.  The "TTL" value does not need to be 3600, it could be a lower or higher value if necessary.  A lower time to live ("TTL") value will ensure any future changes made to your DNS records are propagated throughout the Internet quicker &ndash; think of this as how long it will be cached in-memory (in seconds).  You can learn more about <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="nofollow" target="_blank" class="alert-link">TTL on Wikipedia</a>.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option B:
  </strong>
  <span>
    If you just need to forward a single email address (e.g. "hello@example.com" to "niftylettuce@gmail.com"; this will also forward "hello+test@example.com" to "niftylettuce+test@gmail.com" automatically):
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
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=hello:niftylettuce@gmail.com</code></td>
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
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=hello:niftylettuce@gmail.com,support:niftylettuce@gmail.com</code></td>
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
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=hello:niftylettuce@gmail.com,support:niftylettuce@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=help:niftylettuce@gmail.com,foo:niftylettuce@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=orders:niftylettuce@gmail.com,baz:niftylettuce@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=info:niftylettuce@gmail.com,beep:niftylettuce@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=errors:niftylettuce@gmail.com,boop:niftylettuce@gmail.com</code></td>
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
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=example.net</code></td>
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
      <td><em>@ or leave blank</em></td>
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
    If you are using Google Apps, you'll need to append <code>include:_spf.google.com</code> to the value above, for example:
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
  </span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Verify your DNS records using our "Verify Records" tool available at <a href="/my-account/domains" target="_blank" rel="noopener">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Setup.

</li><li class="mb-2 mb-md-3 mb-lg-5">Send a test email to confirm it works.  Note that it might take some time for your DNS records to propagate.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
  </span>
    If you are not receiving test emails, or receive a test email that says "Be careful with this message", then see the answers for <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Why am I not receiving my test emails</a> and <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicuious" class="alert-link">Why are my test emails sent to myself in Gmail showing as "suspicious"</a> respectively.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">If you wish to "Send Mail As" from Gmail, then you will need to follow the steps under <a href="#how-to-send-mail-as-using-gmail">How to Send Mail As Using Gmail</a> below.

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

<div class="text-muted">Now you can <a href="https://www.youtube.com/watch?v=hvuzUasjFAo" target="_blank" rel="nofollow">start dancing</a>, <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="nofollow">sing a song</a>, and start forwarding emails!  If you have enjoyed these instructions, then please consider <a rel="noopener" href="/features">upgrading to a paid plan</a> or sending us a <a href="/donate">donation</a>.  Additional tips and optional add-ons are described below:</div>

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
    Add a DMARC record for your domain name by following the instructions at <https://dmarc.postmarkapp.com> (this will allow DMARC verification to pass and help to prevent people from forging emails as if they were from you).
    If you intend to use <a href="#how-to-send-mail-as-using-gmail">How to Send Mail As using Gmail</a>, you can only set the DMARC policy to "p=none", for example:
    <br /><br />
    <code>v=DMARC1; p=none; pct=100; rua=mailto:re+random-key@dmarc.postmarkapp.com;</code>
    <br /><br />
    Setting other policies, "quarantine" or "reject", may cause sent mails to respectively end up in recipient's spam folder or not delivered at all.
    DMARC requires both "From" and "Return-Path" to match the same domain. When you use "Send Mail As", your Gmail address would be used as the "Return-Path", instead of your custom domain in "From".
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Optional Add-on:
  </strong>
  <span>
    If you're the <a class="alert-link" href="#how-to-send-mail-as-using-gmial">How to Send Mail As using Gmail</a> feature, then you may want to whitelist yourself.  To do this, simply <a class="alert-link" href="https://support.google.com/a/answer/60751?hl=en&ref_topic=1685627" target="_blank" rel="nofollow">follow these instructions by Gmail</a> on this topic.
  </span>
</div>


## How to Send Mail As using Gmail

<div class="alert my-3 bg-dark border-dark text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimated Setup Time:</strong>
  <span>Less than 10 minutes</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-play-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Getting Started:
  </strong>
  <span>
    After you've followed the steps above in <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">How do I get started and set up email forwarding</a> you can follow these steps in Gmail in order to "Send Mail As" using your custom domain.
  </span>
</div>

1. You need to have [Gmail's Two-Factor Authentication][gmail-2fa] enabled for this to work.  Visit <https://www.google.com/landing/2step/> if you do not have it enabled.

2. Once Two-Factor Authentication is enabled (or if you already had it enabled), then visit <https://myaccount.google.com/apppasswords>.

3. When prompted for "Select the app and device you want to generate the app password for":
   * Select "Mail" under the drop-down for "Select app"
   * Select "Other" under the drop-down for "Select device"
   * When prompted for text input, enter your custom domain's email address you're forwarding from (e.g. "[hello@example.com](mailto:hello@example.com)" - this will help you keep track in case you use this service for multiple accounts)

4. Copy the password to your clipboard that is automatically generated
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Important:
     </strong>
     <span>
       If you are using Google Apps, visit your admin panel <a class="alert-link" href="https://admin.google.com//AdminHome#ServiceSettings/service=email&subtab=filters" rel="nofollow" target="_blank">Apps <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Settings for Gmail <i class="fa fa-angle-right"></i> Advanced settings</a> and make sure to check "Allow users to send mail through an external SMTP server...". There will be some delay for this change to be activated, so please wait a few minutes.
     </span>
   </div>

5. Go to [Gmail](https://gmail.com) and under [Settings <i class="fa fa-angle-right"></i> Accounts and Import <i class="fa fa-angle-right"></i> Send mail as](https://mail.google.com/mail/u/0/#settings/accounts), click "Add another email address"

6. When prompted for "Name", enter the name that you want your email to be seen as "From" (e.g. "Elon Musk")

7. When prompted for "Email address", enter the email address with the custom domain you used above (e.g. "[hello@example.com](mailto:hello@example.com)")

8. Uncheck "Treat as an alias"
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>
       If you prefer the recipient to reply directly to your Gmail address, then leave this checked. To learn more, <a href="https://support.google.com/a/answer/1710338" rel="nofollow" target="_blank">follow these instructions by Gmail</a> on this topic.
     </span>
   </div>

9. Click "Next Step" to proceed

10. When prompted for "SMTP Server", enter <code>smtp.gmail.com</code> and leave the port as <code>587</code>

11. When prompted for "Username", enter the portion of your Gmail address without the <span>gmail.com</span> part (e.g. just "niftylettuce" if my email is <span>[niftylettuce@gmail.com](mailto:niftylettuce@gmail.com)</span>)

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

The most probable cause of your issues with not receiving test emails or with configuration in general is due to DNS propagation and caching.

Fortunately **our DNS provider Cloudflare has a nice "Purge Cache" tool available for you to use at:** <https://1.1.1.1/purge-cache/>.

All you need to do is go to that link, and for both "MX" and "TXT" records, enter your domain name, and click "Purge Cache".  You'll then need to wait a few minutes and try again.

If you're using Gmail, you should check your spam folder for test messages (sometimes test messages to yourself get marked as spam), and also purge cache on Google's DNS at <https://developers.google.com/speed/public-dns/cache>.

Still having issues?  Please file a <a href="/help">Help request</a> so we can help investigate the issue and find a quick resolution.


## Why are my test emails sent to myself in Gmail showing as "suspicuious"

If you see this error message in Gmail when you send a test to yourself (see picture below), then **please do not worry** – as this is a built-in safety feature of Gmail that only you will see when you send a test to yourself.  You can simply click "Looks safe".  For example, if you were to send a test message using the send mail as feature (to someone else), then they will not see this message.

<img src="/img/faq/gmail-suspicious.png" width="546" height="148" alt="Gmail Suspicious Message Warning" />


## Can I remove the "via forwardemail.net" in Gmail

Not yet!  We plan to release our very own SMTP service (not just forwarding, but email in general), which would alleviate this.  Gmail automatically adds this and there is no current workaround.  Other email forwarding services with similar features to ours will still incur this same issue too (and other email forwarding solutions  simply do not offer the level of privacy we do).


## Can I forward emails to ports other than 25 (e.g. if my ISP has blocked port 25)

Yes, as of May 5, 2020 we have added this feature.  Right now the feature is domain-specific, as opposed to alias-specific.  If you require it to be alias-specific, please contact us to let us know of your needs.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Enhanced Privacy Protection:
  </strong>
  <span>
    If you are on a paid plan (which features enhanced privacy protection), then please go to <a href="/my-account/domains" target="_blank" rel="noopener" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a>, click on "Setup" next to your domain, and then click on "Advanced Settings".  If you would like to learn more about paid plans see our <a class="alert-link" rel="noopener" href="/features">Features</a> page.  Otherwise you can continue to follow the instructions below.
  </span>
</div>

If you are on the free plan, then simply add a new DNS TXT record as shown below, but change the port from 25 to the port of your choosing.

For example, if I want all emails that go to `alias@example.com` to forward to alias recipients' SMTP port of 1337 instead of 25:

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
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email-port=1337</code></td>
    </tr>
  </tbody>
</table>


## Do you offer a money back guarantee on paid plans

Yes!  We offer a 30-day money back guarantee on all paids plans if you are not satisfied with our service.

We do not ask any questions and simply process the refund within 5-7 business days.

To request a refund, please send an email from the email address verified on your account to: [refunds@forwardemail.net](mailto:refunds@forwardemail.net)


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
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>1</td>
      <td><code>ASPMX.L.GOOGLE.COM</code></td>
    </tr>
    <tr>
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>5</td>
      <td><code>ALT1.ASPMX.L.GOOGLE.COM</code></td>
    </tr>
    <tr>
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>5</td>
      <td><code>ALT2.ASPMX.L.GOOGLE.COM</code></td>
    </tr>
    <tr>
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>10</td>
      <td><code>ALT3.ASPMX.L.GOOGLE.COM</code></td>
    </tr>
    <tr>
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>10</td>
      <td><code>ALT4.ASPMX.L.GOOGLE.COM</code></td>
    </tr>
    <tr>
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>20</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>@ or leave blank</em></td>
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

For example, if I want all emails that go to `alias@example.com` to stop flowing through to `niftylettuce@gmail.com`:

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
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=!alias:niftylettuce@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Emails sent to disabled addresses will respond with a `250` (message queued) status code, but the emails will not actually be delivered to the recipient(s).


## Can I forward emails to multiple recipients

Yes, absolutely.  Just specify multiple recipients in your TXT records.

For example, if I want an email that goes to `hello@example.com` to get forwarded to `niftylettuce+a@gmail.com` and `niftylettuce+b@gmail.com`, then my TXT record would look like this:

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
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code style="cursor: initial;" data-original-title="" title="" aria-describedby="tooltip885348">forward-email=hello:niftylettuce+a@gmail.com,hello:niftylettuce+b@gmail.com</code></td>
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
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=hello:niftylettuce+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=hello:niftylettuce+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

It's up to you!


## Can I have multiple global catch-all recipients

Yes, you can. Just specify multiple global catch-all recipients in your TXT records.

For example, if I want every email that goes to `*@example.com` (the asterisk meaning its a wildcard aka catch-all) to get forwarded to `niftylettuce+a@gmail.com` and `niftylettuce+b@gmail.com`, then my TXT record would look like this:

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
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=niftylettuce+a@gmail.com,niftylettuce+b@gmail.com</code></td>
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
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=niftylettuce+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@ or leave blank</em></td>
      <td class="text-center">3600</td>
      <td>TXT</td>
      <td><code>forward-email=niftylettuce+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

It's up to you!


## Is there a maximum limit on the number of email addresses I can forward to per alias

Yes, the default limit is 10.  This does NOT mean that you can only have 10 aliases on your domain name.  You can have as many aliases as you want (an unlimited amount).  It means that you can only forward one alias to 10 unique email addresses.  You could have `hello:niftylettuce+1@gmail.com`, `hello:niftylettuce+2@gmail.com`, `hello:niftylettuce+3@gmail.com`, … (from 1-10) – and any emails to `hello@example.com` would get forwarded to `niftylettuce+1@gmail.com`, `niftylettuce+2@gmail.com`, `niftylettuce+3@gmail.com`, … (from 1-10).


## Can I recursively forward emails

Yes, you can, however you still must adhere to the maximum limit.  If you have `hello:elon@example.com` and `elon:niftylettuce@gmail.com`, then emails to `hello@example.com` would get forwarded to `elon@example.com` and `niftylettuce@gmail.com`.  Note that an error will be thrown if you attempt to recursively forward emails.


## Can people unregister or register my email forwarding without my permission

We use MX and TXT record verification, therefore if you add this service's respective MX and TXT records, then you're registered.  If you remove them, then you're unregistered.  You have ownership of your domain and DNS management, so if someone has access to that then that's a problem.


## How is it free

The service continues to run thanks to [donations](/donate) and users that upgraded to paid plans.  We want to provide a free alternative (since we feel bad) for people that are using closed-source forwarding services (and subsequently risking their privacy and security).


## What is the max email size limit

We default to a 25 MB size limit (the same as Gmail), which includes content, headers, and attachments.

An error with the proper response code is returned if the file size limit is exceeded.


## Do you store emails and their contents

No, absolutely not.  See our [Privacy Policy](/privacy).


## Do you store logs of emails

No, absolutely not.  See our [Privacy Policy](/privacy).


## Do you read my emails

No, absolutely not.  We do not store logs.  See our [Privacy Policy](/privacy).

Many other email forwarding services unethically read your email.  This is not what I'm about.

The code that is deployed to the server is [open-source software on GitHub](https://github.com/forwardemail).


## Does it support the "+" symbol (e.g. for Gmail aliases)

Yes, absolutely.


## Does this forward my email's headers

Yes, absolutely.


## Is this well-tested

Yes, it has tests written with [ava](https://github.com/avajs/ava/pull/2323) and also has code coverage.


## Do you pass along SMTP response messages and codes

Yes, absolutely.  For example if you're sending an email to `hello@example.com` and it's registered to forward to `niftylettuce@gmail.com`, then the SMTP response message and code from the "gmail.com" SMTP server will be returned instead of the proxy server at "mx1.forwardemail.net" or "mx2.forwardemail.net".


## How do you prevent spammers and ensure good email forwarding reputation

Per documentation and suggestions from Google at <https://support.google.com/a/answer/175365?hl=en>, along with best practice, including:

1. **DNS Blacklists:** we test senders IP's against the Spamhaus [DNS blacklists][dns-blacklists], if any fail, then the sender is not permitted to send the message and is returned a detailed error message with instructions on how to de-list themselves from the specific blacklists they're listed under.

2. **Anti-Spam and Anti-Phishing Scanner**: we built from scratch and use [SpamScanner][] for anti-spam prevention (it uses a Naive Bayes classifier under the hood).  We built this because we were not happy with [rspamd][] nor [SpamAssassin][], nor were we happy with their lack of privacy-focused policies and public corpus datasets.

3. **SPF and DKIM:** through checking if an SPF record exists for a sender, and if so, we reverse-lookup the SMTP connection's remote address to validate it matches the SPF record, otherwise it's rejected.  If an SPF record does not exist, then we require DKIM verification.  If DKIM headers are passed and fail, then it is rejected as well.  If no DKIM headers are passed, then we assume that DKIM validation passes.

4. **MX Record Test:** through checking if the sender's from address domain has MX records (so it's actually coming from a mail exchange/SMTP server), otherwise it's rejected.

5. **Disposable Email Addresses:** we automatically block senders that are from the [disposable-email-domains][] list.

6. **Fully Qualified Domain Name Test:** validates that senders SMTP connections are from a fully qualified domain name ("FQDN"), meaning no IP addresses, they must have a valid domain name resolved.

7. **TXT Record Test:** through checking if the email address the sender is trying to send to has a TXT DNS record with a valid email forwarding setup. The SSL certificates (main domain name or alternative names) of all MX servers of the forwarding destination must match the MX entry.

8. **Sender Rewriting Scheme:** we use the [Sender Rewriting Scheme][srs] ("SRS"), which is a scheme used to rewrite the envelope from address for email forwarding in order for DKIM/SPF/DMARC to pass with a forwarding mail server.


## Can I "send mail as" with this

Yes! As of October 2, 2018 we have added this feature.  See [How to Send Mail As using Gmail](#how-to-send-mail-as-using-gmail) above!


## Can I forward unlimited emails with this

Practically yes - the only current restriction is that senders **by unique email address** are limited to sending (300) emails per hour through the system.

If this limit is exceeded we send a "451" response code which tells the senders mail server to retry later.


## How do you perform DNS lookups on domain names

We use CloudFlare's privacy-first consumer DNS service (see [announcement here][cloudflare-dns]).  Note that the Python packages we use (`python-spfcheck2` and `python-dkim-verify`) do not have the means like Node.js does with `dns` and its method `dns.setServers` – therefore we set the server DNS to `1.1.1.1` which it will use as a fallback in this case.


## How fast is this service

The latest version, v2 (released on May 6, 2019) was a major rewrite from v1 and focuses on performance through streams.  [Nodemailer's][nodemailer] prolific author Andris Reinman ([@andris9](https://github.com/andris9)) helped us switch off using the `mailparser` library and use `mailsplit` instead with some custom transform logic to split the header and the body of the message without affecting the body.  This allows us to perform operations on headers very fast (such as security checks and for SPF/DKIM/DMARC compliance).

**In other words, the latest version of this service uses streams purely now and is lightning fast.**  The older version v1 also had some logic not in the most optimal order of operations – but now v2 does less memory/network intense operations first (and returns early if possible to send a response as quickly as possible to the SMTP client).  We plan to continue to optimize speed, enhance features, and improve this service over time.

At no point in time do we write to disk or store emails – everything is done in-memory thanks to Node.js's streams and transforms! :tada:


## 

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[dns-blacklists]: https://en.wikipedia.org/wiki/Domain_Name_System-based_Blackhole_List

[disposable-email-domains]: https://github.com/ivolo/disposable-email-domains

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/

[nodemailer]: https://github.com/nodemailer/nodemailer

[srs]: https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme

[spamscanner]: https://github.com/spamscanner/spamscanner

[rspamd]: https://www.rspamd.com/

[spamassassin]: https://spamassassin.apache.org/
