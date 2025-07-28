# Port 25 blokkert av internettleverandørens løsning {#port-25-blocked-by-isp-workaround}

## Innholdsfortegnelse {#table-of-contents}

* [Slik omgår du at internettleverandøren blokkerer innkommende SMTP på port 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Slik omgår du at internettleverandøren blokkerer utgående SMTP på port 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Hvordan kan jeg sjekke om internettleverandøren min blokkerer porter](#how-can-i-check-if-my-isp-blocks-ports)

## Slik omgår du internettleverandørens blokkering av innkommende SMTP på port 25 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Hvis du ikke har port 25 åpen på IP-adressen til e-postserveren din, er denne veiledningen for deg.

For eksempel, du kjører en tilpasset e-postserver hjemme, og internettleverandøren din har blokkert utgående port 25.

Siden du ikke kan ha utgående trafikk på port 25, vil du mest sannsynlig heller ikke ha innkommende trafikk på port 25 på grunn av denne blokkeringen.

Forutsatt at du bruker tjenesten vår til å videresende e-poster, [Du kan løse dette problemet gjennom våre FAQ-svar her](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).

## Slik omgår du internettleverandørens blokkering av utgående SMTP på port 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Hvis internettleverandøren din blokkerer utgående port 25, må du finne en alternativ løsning eller kontakte dem.

## Hvordan kan jeg sjekke om internettleverandøren min blokkerer porter {#how-can-i-check-if-my-isp-blocks-ports}

Du kan kjøre `telnet smtp.forwardemail.net 25` fra kommandolinjen eller terminalen for å se om den utgående port 25-tilkoblingen din er blokkert.