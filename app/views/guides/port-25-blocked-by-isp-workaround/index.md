# Port 25 blocked by ISP workaround


## Table of Contents

* [How to workaround ISP blocking inbound SMTP on port 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [How to workaround ISP blocking outbound SMTP on port 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [How can I check if my ISP blocks ports](#how-can-i-check-if-my-isp-blocks-ports)


## How to workaround ISP blocking inbound SMTP on port 25

If you do not have port 25 open on your mail server's IP address, then this guide is for you.

For example, you're running a custom mail server at home, and your Internet Service Provider ("ISP") has blocked outbound port 25.

Since you cannot have outbound traffic on port 25, then you most likely also won't have inbound traffic on port 25 due to this block.

Assuming you are using our service to forward emails, [you can workaround this issue through our FAQ answer here](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).


## How to workaround ISP blocking outbound SMTP on port 25

If your ISP blocks outbound port 25, then you will have to find an alternate solution or contact them.


## How can I check if my ISP blocks ports

You can run `telnet smtp.forwardemail.net 25` from command line or terminal to see if your outbound port 25 connection is blocked.
