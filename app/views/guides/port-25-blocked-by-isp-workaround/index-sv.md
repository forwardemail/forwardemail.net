# Port 25 blockerat av ISP - lösning {#port-25-blocked-by-isp-workaround}


## Innehållsförteckning {#table-of-contents}

* [Hur man kringgår ISP-blockering av inkommande SMTP på port 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Hur man kringgår ISP-blockering av utgående SMTP på port 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Hur kan jag kontrollera om min ISP blockerar portar](#how-can-i-check-if-my-isp-blocks-ports)


## Hur man kringgår ISP-blockering av inkommande SMTP på port 25 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Om du inte har port 25 öppen på din mailservers IP-adress, då är denna guide för dig.

Till exempel, du kör en egen mailserver hemma och din Internetleverantör ("ISP") har blockerat utgående port 25.

Eftersom du inte kan ha utgående trafik på port 25, så kommer du troligen inte heller ha inkommande trafik på port 25 på grund av denna blockering.

Förutsatt att du använder vår tjänst för att vidarebefordra e-post, [kan du kringgå detta problem genom vårt FAQ-svar här](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).


## Hur man kringgår ISP-blockering av utgående SMTP på port 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Om din ISP blockerar utgående port 25, måste du hitta en alternativ lösning eller kontakta dem.


## Hur kan jag kontrollera om min ISP blockerar portar {#how-can-i-check-if-my-isp-blocks-ports}

Du kan köra `telnet smtp.forwardemail.net 25` från kommandoraden eller terminalen för att se om din utgående port 25-anslutning är blockerad.
