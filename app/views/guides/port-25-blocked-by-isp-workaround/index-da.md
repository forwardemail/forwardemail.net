# Port 25 blokeret af internetudbyderens løsning {#port-25-blocked-by-isp-workaround}

## Indholdsfortegnelse {#table-of-contents}

* [Sådan omgår du en internetudbyders blokering af indgående SMTP på port 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Sådan omgår du en internetudbyders blokering af udgående SMTP på port 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Hvordan kan jeg tjekke, om min internetudbyder blokerer porte](#how-can-i-check-if-my-isp-blocks-ports)

## Sådan omgår du internetudbyderens blokering af indgående SMTP på port 25 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Hvis du ikke har port 25 åben på din mailservers IP-adresse, så er denne guide til dig.

For eksempel kører du en brugerdefineret mailserver derhjemme, og din internetudbyder ("ISP") har blokeret udgående port 25.

Da du ikke kan have udgående trafik på port 25, vil du højst sandsynligt heller ikke have indgående trafik på port 25 på grund af denne blokering.

Forudsat at du bruger vores tjeneste til at videresende e-mails, [Du kan løse dette problem via vores FAQ-svar her](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).

## Sådan omgår du internetudbyderens blokering af udgående SMTP på port 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Hvis din internetudbyder blokerer udgående port 25, skal du finde en alternativ løsning eller kontakte dem.

## Hvordan kan jeg tjekke, om min internetudbyder blokerer porte {#how-can-i-check-if-my-isp-blocks-ports}

Du kan køre `telnet smtp.forwardemail.net 25` fra kommandolinjen eller terminalen for at se, om din udgående port 25-forbindelse er blokeret.