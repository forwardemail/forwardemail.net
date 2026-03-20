# Port 25 blokeret af ISP løsning {#port-25-blocked-by-isp-workaround}


## Indholdsfortegnelse {#table-of-contents}

* [Hvordan man omgår ISP-blokering af indgående SMTP på port 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Hvordan man omgår ISP-blokering af udgående SMTP på port 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Hvordan kan jeg tjekke om min ISP blokerer porte](#how-can-i-check-if-my-isp-blocks-ports)


## Hvordan man omgår ISP-blokering af indgående SMTP på port 25 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Hvis du ikke har port 25 åben på din mailservers IP-adresse, så er denne guide til dig.

For eksempel, hvis du kører en tilpasset mailserver derhjemme, og din Internetudbyder ("ISP") har blokeret udgående port 25.

Da du ikke kan have udgående trafik på port 25, vil du højst sandsynligt heller ikke have indgående trafik på port 25 på grund af denne blokering.

Forudsat at du bruger vores service til at videresende e-mails, [kan du omgå dette problem via vores FAQ-svar her](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).


## Hvordan man omgår ISP-blokering af udgående SMTP på port 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Hvis din ISP blokerer udgående port 25, så bliver du nødt til at finde en alternativ løsning eller kontakte dem.


## Hvordan kan jeg tjekke om min ISP blokerer porte {#how-can-i-check-if-my-isp-blocks-ports}

Du kan køre `telnet smtp.forwardemail.net 25` fra kommandolinjen eller terminalen for at se, om din udgående port 25-forbindelse er blokeret.
