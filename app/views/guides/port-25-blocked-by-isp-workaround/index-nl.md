# Poort 25 geblokkeerd door ISP oplossing {#port-25-blocked-by-isp-workaround}


## Inhoudsopgave {#table-of-contents}

* [Hoe om te gaan met ISP die inkomende SMTP op poort 25 blokkeert](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Hoe om te gaan met ISP die uitgaande SMTP op poort 25 blokkeert](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Hoe kan ik controleren of mijn ISP poorten blokkeert](#how-can-i-check-if-my-isp-blocks-ports)


## Hoe om te gaan met ISP die inkomende SMTP op poort 25 blokkeert {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Als poort 25 niet open is op het IP-adres van je mailserver, dan is deze gids voor jou.

Bijvoorbeeld, je draait een eigen mailserver thuis, en je Internet Service Provider ("ISP") heeft uitgaande poort 25 geblokkeerd.

Aangezien je geen uitgaand verkeer op poort 25 kunt hebben, zul je waarschijnlijk ook geen inkomend verkeer op poort 25 hebben vanwege deze blokkade.

Als je onze dienst gebruikt om e-mails door te sturen, [kun je dit probleem omzeilen via ons FAQ antwoord hier](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).


## Hoe om te gaan met ISP die uitgaande SMTP op poort 25 blokkeert {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Als je ISP uitgaande poort 25 blokkeert, dan zul je een alternatieve oplossing moeten vinden of contact met hen opnemen.


## Hoe kan ik controleren of mijn ISP poorten blokkeert {#how-can-i-check-if-my-isp-blocks-ports}

Je kunt `telnet smtp.forwardemail.net 25` uitvoeren vanuit de opdrachtregel of terminal om te zien of je uitgaande poort 25 verbinding geblokkeerd is.
