# Report Abuse

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="" class="rounded-lg" />


## Table of Contents

* [Disclaimer](#disclaimer)
* [How to submit an abuse report](#how-to-submit-an-abuse-report)
* [For the general public](#for-the-general-public)
* [For law enforcement](#for-law-enforcement)
  * [What information is available](#what-information-is-available)
  * [What information is not available](#what-information-is-not-available)
  * [Law enforcement based in the United States](#law-enforcement-based-in-the-united-states)
  * [Law enforcement based outside of the United States](#law-enforcement-based-outside-of-the-united-states)
  * [Law enforcement emergency requests](#law-enforcement-emergency-requests)
  * [Law enforcement requests may trigger account notices](#law-enforcement-requests-may-trigger-account-notices)
  * [Law enforcement requests to preserve information](#law-enforcement-requests-to-preserve-information)
  * [Law enforcement serving process](#law-enforcement-serving-process)


## Disclaimer

Please defer to our [Terms](/terms) as it applies sitewide.


## How to submit an abuse report

We review abuse reports and serve information requests for the [general public](#for-the-general-public) and [law enforcement](#for-law-enforcement) on a case by case basis by email.

Abuse reports and information requests with regards to users, emails, IP addresses, and/or domains are referred to collectively as an "Account" below.

Our email addresses to contact with your request or report regarding abuse is: `support@forwardemail.net`, `abuse@forwardemail.net`, and `security@forwardemail.net`.

Please send a copy to all of these email addresses if possible, and also send reminder emails if we do not follow up within 24-48+ hours.

Read the sections below for more information that may pertain to you.


## For the general public

<u>**If you or someone else is in imminent harm, then please contact police and emergency services immediately.**</u>

<u>**You should seek professional legal advice to regain lost access to your Account or to help stop a malicious actor.**</u>

If you are the victim of abuse from an Account that is using our service, then please send us your report by email to the address above.  If your Account was taken over by a malicious actor (e.g. your domain recently expired and was re-registered by a third-party and then used for abuse), then please email us a report to the address above with your exact Account information (e.g. your domain name).  We can help to [shadow ban](https://en.wikipedia.org/wiki/Shadow_banning) the Account after validation of your previous ownership.  Note that we do not have authority to help you regain access to your Account.

Your legal representative may advise you to contact law enforcement, your Account owner (e.g. the domain name's registrar; the website where you registered the domain name), and/or defer you to [ICANN's page on lost domains](https://www.icann.org/resources/pages/lost-domain-names).


## For law enforcement

For a majority of requests, our ability to disclose information is governed by the [Electronic Communications Privacy Act](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701), et seq. ("ECPA").  The ECPA mandates that we disclose certain user information to law enforcement only in response to specific types of legal requests, including subpoenas, court orders, and search warrants.

If you are a member of law enforcement and seeking information regarding an Account, then Account information as well as date and time range should be included with your request.  We cannot process overly broad and/or vague requests – this is in order to safeguard our users' data and trust, and most importantly to keep their data secure.

If your request signals to us a violation of our [Terms](/terms), then we will process it according to our internal-only best practices for handling abuse – note that in some cases this may result in suspending and/or banning the Account.

**Since we are not a domain name registrar**, if you wish to seek historical DNS record information regarding a domain name, then you should contact the specific domain name registrar that corresponds to the domain.  Services such as [Security Trails]() may provide historical record lookup, but more specific and accurate information may be provided from the registrar.  In order to determine who the domain name registrar and/or DNS nameservers owners are for a domain, the tools `dig` and `whois` may be useful (e.g. `whois example.com` or `dig example.com ns`).  You can determine if an Account is on a paid plan or free plan on our service by conducting a DNS record lookup (e.g. `dig example.com mx` and `dig example.com txt`).  If the MX records do not return values such as `mx1.forwardemail.net` and `mx2.forwardemail.net`, then the domain is not using our service.  If the TXT records return a plaintext email address (e.g. `forward-email=user@example.com`), then that indicates the email forwarding address destination for a domain.  If it instead returns a value such as `forward-email-site-verification=XXXXXXXXXX`, then that indicates it is on a paid plan and the forwarding configuration is stored in our database under the ID of `XXXXXXXXXX`.  For more information on how our service works at the DNS level, then please defer to our [FAQ](/faq).

### What information is available

Please defer to our Privacy Policy section for [Information Collected](/privacy#information-collected).  Accounts are permitted to remove their information from our system in compliance with data retention and privacy laws; defer to our Privacy Policy section for [Information Removal](/privacy#information-removal). This means that information requested may not be available at the time of request due to Account deletion.

### What information is not available

Please defer to our Privacy Policy section for [Information Not Collected](/privacy#information-not-collected).

### Law enforcement based in the United States

With the [exception of emergencies](#law-enforcement-emergency-requests), we share Account information only upon receipt of a valid subpoena, ECPA US court order, and/or search warrant.

We may additionally [notify an Account](#law-enforcement-requests-may-trigger-account-notices) about a law enforcement request, unless we are prohibited from doing so by law or court order.

If we receive a valid subpoena, ECPA court order, and/or search warrant, then we will provide relevant and available information to the best of our ability.

### Law enforcement based outside of the United States

We require that requests be served for law enforcement based from outside of the United States via one of the following:

* A United States court.
* An enforcement agency under the procedures of a [United States mutual legal assistance treaty](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT").
* An order from a foreign government which  is subject to an executive agreement that the Attorney General of the United States has determined and certified to Congress satisfies the requirements of [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Law enforcement emergency requests

As law permits in the United States (e.g. in accordance with [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%2C%20if%20the%20provider%2C%20in%20good%20faith%2C%20believes%20that%20an%20emergency%20involving%20danger%20of%20death%20or%20serious%20physical%20injury%20to%20any%20person%20requires%20disclosure%20without%20delay%20of%20communications%20relating%20to%20the%20emergency%3B%20or) and [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Exceptions%20for%20Disclosure%20of%20Customer%20Records.%E2%80%94A%20provider%20described%20in%20subsection%20\(a\)%20may%20divulge%20a%20record%20or%20other%20information%20pertaining%20to%20a%20subscriber%20to%20or%20customer%20of%20such%20service%20\(not%20including%20the%20contents%20of%20communications%20covered%20by%20subsection%20\(a\)\(1\)%20or%20\(a\)\(2\)\)%E2%80%94)), when in good faith and with independent verification of the requester – we may disclose and share Account information to law enforcement without a subpoena, ECPA court order, and/or search warrant when we believe that doing so without delay is needed in order to prevent death or serious physical injury.

We require that emergency data requests ("EDR") be sent via email and include all relevant information in order to provide a timely and expedited process.

Note that we are aware of sophisticated spoofing, phishing, and impersonation attacks with email (e.g. see [this article from The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Our policy for processing EDR's is as follows:

1. Independently research the email header metadata (e.g. DKIM/SPF/DMARC) (or lack thereof) for verification.

2. Make our best effort attempt in good faith (with repeated attempts if necessary) to independently contact by phone the requester – in order to confirm the authenticity of the request.  For example, we may research the `.gov` website related to the jurisdiction the request is from, and then call the office from their publicly listed official phone number to verify the request.

### Law enforcement requests may trigger account notices

We may notify an Account and provide them with a copy of a law enforcement request pertaining to them unless we are prohibited by law or court order from doing so (e.g. [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)).  In those cases, if applicable, then we may notify an Account when the non-disclosure order has expired.

If a request for information by law enforcement is valid, then we will [preserve necessary and requested Account information](#law-enforcement-requests-to-preserve-information) and make a reasonable effort to contact the Account owner by their registered and verified email address (e.g. within 7 calendar days).  If we receive a timely objection (e.g. within 7 calendar days), then we will withhold sharing Account information and continue the legal process as necessary.

### Law enforcement requests to preserve information

We will honor valid requests from law enforcement to preserve information regarding an Account according to [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703).  Note that preservation of data is restricted only to what is specifically requested and presently available.

### Law enforcement serving process

We require that all valid law enforcement requests provide us with a valid and functional email address that we may correspond to and provide requested information electronically to.

All requests should be sent to the email address specified under [How to submit an abuse report](#how-to-submit-an-abuse-report) above.

All law enforcement requests must be sent on agency or department letterhead (e.g. as a PDF scanned attachment), from an official and relevant email address, and signed.

If it is with regards to an [emergency request](#law-enforcement-emergency-requests), then please write "Emergency law enforcement request" in the Subject header of the email.

Please note that it may take us at least two weeks to be able to review and respond to your request.
