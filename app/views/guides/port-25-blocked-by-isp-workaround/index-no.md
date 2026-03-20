# Port 25 blokkert av ISP - løsning {#port-25-blocked-by-isp-workaround}


## Innholdsfortegnelse {#table-of-contents}

* [Hvordan omgå ISP-blokkering av innkommende SMTP på port 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Hvordan omgå ISP-blokkering av utgående SMTP på port 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Hvordan kan jeg sjekke om min ISP blokkerer porter](#how-can-i-check-if-my-isp-blocks-ports)


## Hvordan omgå ISP-blokkering av innkommende SMTP på port 25 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Hvis du ikke har port 25 åpen på IP-adressen til din mailserver, er denne guiden for deg.

For eksempel, du kjører en tilpasset mailserver hjemme, og din Internettleverandør ("ISP") har blokkert utgående port 25.

Siden du ikke kan ha utgående trafikk på port 25, vil du mest sannsynlig heller ikke ha innkommende trafikk på port 25 på grunn av denne blokken.

Forutsatt at du bruker vår tjeneste for å videresende e-poster, [kan du omgå dette problemet gjennom vårt FAQ-svar her](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).


## Hvordan omgå ISP-blokkering av utgående SMTP på port 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Hvis din ISP blokkerer utgående port 25, må du finne en alternativ løsning eller kontakte dem.


## Hvordan kan jeg sjekke om min ISP blokkerer porter {#how-can-i-check-if-my-isp-blocks-ports}

Du kan kjøre `telnet smtp.forwardemail.net 25` fra kommandolinjen eller terminalen for å se om din utgående port 25-tilkobling er blokkert.
