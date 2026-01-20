# Terms

<img loading="lazy" src="/img/articles/terms.webp" alt="Forward Email terms of service" class="rounded-lg" />


## Table of Contents

* [Disclaimer](#disclaimer)
* [Unlimited Usage](#unlimited-usage)
* [Limitations](#limitations)
* [Refunds](#refunds)
* [Disputes](#disputes)
* [Service Level Agreement ("SLA")](#service-level-agreement-sla)
  * [Terms](#terms-1)
  * [Agreement](#agreement)
  * [Credits](#credits)
  * [Eligibility](#eligibility)
* [Revisions and Errata](#revisions-and-errata)
* [Links](#links)
* [Site Terms of Use Modifications](#site-terms-of-use-modifications)
* [Governing Law](#governing-law)
* [Additional Disclosures](#additional-disclosures)


## Disclaimer

By accessing this web site, you are agreeing to be bound by these Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.

You must be at least eighteen (18) years of age, or between thirteen (13) and seventeen (17) years of age and using the Service with parental or legal guardian consent and supervision.

<u>**If you do not agree with any of these terms or any of the terms below, you are prohibited from using or accessing this site.**</u>

The materials on Forward Email's web site and related services ("Service") are provided "as is".

Forward Email makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

Further, Forward Email does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its Service or otherwise relating to such materials or on any sites linked to this site.

<u>**You specifically agree that you will not use the Service for any business or related materials to both [Stripe's Prohibited Businesses](https://stripe.com/legal/restricted-businesses) and [PayPal's Prohibited Activities](https://www.paypal.com/us/legalhub/acceptableuse-full).**</u>

<u>**You specifically agree that by using the Service that Forward Email shall not be responsible for, shall not be liable for, and you will not create, read, modify, or transmit any of the following with the Service:**</u>

* **You will not use our service to operate a service which allow third parties (other than your own employees and contractors) to access, use, or benefit from our service.  If you need us to make an exception for you regarding this, then please contact us to discuss an enterprise agreement.  See our [LICENSE](https://github.com/forwardemail/forwardemail.net/blob/master/LICENSE.md) for more information.**
* If you are using our [Outbound SMTP](/faq#do-you-support-sending-email-with-smtp) service, then you agree to the following:
  * You are permitted to use it for [transactional email](https://wikipedia.org/wiki/Email_marketing#Transactional_emails) and [email marketing](https://en.wikipedia.org/wiki/Email_marketing).
  * If you are sending email marketing material, then you must include a `List-Unsubscribe` header and your subscribers must be opt-in.
    * We recommend that you use an open-source newsletter manager such as [ListMonk](https://github.com/knadh/listmonk) at <https://github.com/knadh/listmonk>.
      * Note that we plan to release our own newsletter manager in the future.
    * Email marketing material includes promotional, bulk, or commercial email to a list of contacts with similar content, subject line, and body message (e.g. newsletters and announcements).
    * You must comply with the [CAN-SPAM Act of 2003](https://en.wikipedia.org/wiki/CAN-SPAM_Act_of_2003).
    * You must remove users that have opted-out, unsubscribed, or marked your email as spam either instantly or within 24 hours.
    * The first-time your domain name attempts to send a newsletter, an admin will review and approve your domain for sending newsletters (usually within 2-4 hours, but sometimes it may take longer).
* Anything that causes interference with the disruption of the Service, its operations, and/or its customers.
* Materials that are abusive, defamatory, false, harassing, indecent, libelous, misleading, objectionable, obscene, offensive, profane, threatening, unlawful, and/or vulgar.
* Unauthorized copyrighted or confidential materials and/or materials that infringe upon intellectual property rights, trade secrets, and/or privacy of others.
* Anything that encourages criminal conduct, has the potential to cause civil liability, and/or violate any jurisdictions' laws or regulations.
* Materials that cause harm or has the potential to cause harm to minors, impersonate another individual or entity, and/or misrepresent an affiliation with an individual or entity.
* Materials that contain spam, viruses, malware, NSFW materials (indecent, provocative, or profane content), corrupted files, and/or any other software or programs that may damage or has the potential to cause harm to an individual, entity, computer, network, government, service, and/or any other matter.

The materials contained in this web site are protected by applicable copyright and trademark law.

Your access of our website and usage of our service indicates that you have agreed to our [Privacy Policy](/privacy) and [Data Processing Agreement](/dpa) (e.g. for GDPR compliance).


## Unlimited Usage

Regarding "unlimited" usage in our service, we automatically rate limit and may temporarily restrict or slow usage when necessary to maintain quality of service for all customers.

If we determine your usage of services differs from normal user behavior, is deemed to be spam or malicious activity by our team, or for any other reason under our sole discretion – then we may restrict or slow usage.

We may or may not notify you in advance of restrictions already imposed or that will be imposed on your account and the service in general.


## Limitations

In no event shall Forward Email or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption,) arising out of the use or inability to use the materials on Forward Email's Internet site, even if Forward Email or a Forward Email authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.


## Refunds

Automatic refunds occur when you upgrade, downgrade, or cancel your account within 30-days from when your plan first started.  This only applies for first-time customers.

We do not pro-rate nor refund the difference when you switch plans. Instead we convert the remaining duration from your existing plan's expiration date into the closest relative duration for your new plan (rounded down by month).

Note that if you upgrade or downgrade between paid plans within a 30-day window since first starting a paid plan, then we will automatically refund the full amount from your existing plan.


## Disputes

Please contact us if you would like to dispute a transaction or charge from our service.  Do not contact your credit card provider, bank, or PayPal.

Your account will be automatically and permanently banned if you open a dispute with your credit card provider, bank, or PayPal.


## Service Level Agreement ("SLA")

### Terms

* "Downtime" refers to a factor of more than a 5% user error rate, determined by a server-side error rate.
* "Monthly Uptime Percentage" refers to the total minutes in a calendar month minus the number of minutes of Downtime suffered in the calendar month, divided by the total minutes in the calendar month.

### Agreement

Forward Email shall use all reasonable commercial efforts (no less than acceptable and reasonable industry standards) to ensure that the Forward Email service is available to paying customers 99.99% of the time in any calendar month.  If it is not, then you may be eligible to receive the [Credits](#credits) described below in accordance with [Eligibility](#eligibility).

### Credits

| Monthly Uptime Percentage | Days of Service* |
| ------------------------- | ---------------- |
| < 99.99% – >= 99.90%      | 3                |
| < 99.90% – >= 95.00%      | 7                |
| < 95.50%                  | 15               |

\* Instead of receiving Days of Service being added to your account, you can also choose to have us issue a pro-rated refund.

### Eligibility

Minimum credit amount must be at least $1.00 to be eligible.  Maximum credit is capped at the 30 days or the total amount the customer is paying per the most recent calendar month with respect to Downtime (whichever is greater).  Paying customers affected for any Downtime must request Credits by filing a [Help request](/help) within 30 days from the date of Downtime.  Credits only apply for Downtime factors that are within the primary control of Forward Email.


## Revisions and Errata

The materials appearing on Forward Email's web site could include technical, typographical, or photographic errors. Forward Email does not warrant that any of the materials on its web site are accurate, complete, or current. Forward Email may make changes to the materials contained on its web site at any time without notice. Forward Email does not, however, make any commitment to update the materials.


## Links

Forward Email has not reviewed all of the sites linked to its Service and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Forward Email of the site. Use of any such linked web site is at the user's own risk.


## Site Terms of Use Modifications

Forward Email may revise these terms of use for its web site at any time without notice. By using this web site you are agreeing to be bound by the then current version of these Terms and Conditions of Use.


## Governing Law

Any claim relating to Forward Email's web site shall be governed by the laws of the State of Delaware without regard to its conflict of law provisions.

General Terms and Conditions applicable to Use of a Web Site.


## Additional Disclosures

This site is protected by Cloudflare and its [Privacy Policy](https://www.cloudflare.com/privacypolicy/) and [Terms of Service](https://www.cloudflare.com/website-terms/) apply.
