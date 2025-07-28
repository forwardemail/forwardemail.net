# Poort 25 geblokkeerd door ISP-oplossing {#port-25-blocked-by-isp-workaround}

## Inhoudsopgave {#table-of-contents}

* [Hoe u kunt omzeilen dat de ISP inkomende SMTP op poort 25 blokkeert](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Hoe u kunt omzeilen dat de ISP uitgaande SMTP op poort 25 blokkeert](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Hoe kan ik controleren of mijn internetprovider poorten blokkeert?](#how-can-i-check-if-my-isp-blocks-ports)

## Hoe je kunt omzeilen dat de ISP inkomende SMTP op poort 25 blokkeert {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Als u poort 25 niet open hebt staan op het IP-adres van uw mailserver, dan is deze handleiding voor u.

Stel dat u thuis een eigen mailserver gebruikt en uw internetprovider (ISP) de uitgaande poort 25 heeft geblokkeerd.

Omdat er op poort 25 geen uitgaand verkeer mogelijk is, is de kans groot dat er door deze blokkade ook geen inkomend verkeer op poort 25 mogelijk is.

Ervan uitgaande dat u onze service gebruikt om e-mails door te sturen, [U kunt dit probleem oplossen via ons FAQ-antwoord hier](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).

## Hoe je kunt omzeilen dat de ISP uitgaande SMTP op poort 25 blokkeert {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Als uw internetprovider uitgaande poort 25 blokkeert, moet u een alternatieve oplossing vinden of contact met hen opnemen.

## Hoe kan ik controleren of mijn internetprovider de poorten {#how-can-i-check-if-my-isp-blocks-ports} blokkeert?

U kunt `telnet smtp.forwardemail.net 25` vanaf de opdrachtregel of terminal uitvoeren om te controleren of uw uitgaande poort 25-verbinding is geblokkeerd.