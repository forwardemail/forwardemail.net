# History


## Table of Contents

* [Background](#background)
* [Alternatives](#alternatives)


## Background

We created this service after realizing that the only "free" email forwarding services that exist today are closed-source and proprietary.  This means they probably read your forwarded emails.

We also practice the "do not repeat yourself" and "good coders code, great coders re-use" principles - so an endless search, trial, and error was conducted  on StackOverflow, GitHub, Gists, and elsewhere for alternative solutions.


## Alternatives

Of course there is Haraka, sendmail, postfix, and dozens of other options, but they require a lot of setup, configuration, testing, maintenance, and are not simple. The current service offering for email forwarding is either extremely bloated, insecure, requires payment, has a convoluted setup with unsolved or undocumented bugs (that lead you down a rabbit hole of searching for hours to come up empty handed), or they are closed-source.

There are also solutions that use "serverless" technologies, such as through Amazon SES and Amazon Lambda, but again they are extremely confusing, time intensive, and no typical user would go to those lengths for setup (and instead would probably end up using a simpler alternative as we almost did; in exchange for lack of privacy).

Furthermore, solutions like Amazon SES do not allow you to modify the envelope of the SMTP request, therefore you will need to add a Reply-To header and rewrite the From header as well to something like from@noreply.com (which is really not clean).

Then there is Gmail, which costs money for custom domains (it used to be free).  They obviously scan and parse your emails as well. They also do not allow you to easily set up email forwarding for custom domains anymore.

There is also Zoho mail, but again that requires you signing up for an account with Zoho, and then forwarding over the emails in a configuration setting.
