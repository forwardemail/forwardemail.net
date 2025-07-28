# Port 25 blockerad av internetleverantörens lösning {#port-25-blocked-by-isp-workaround}

## Innehållsförteckning {#table-of-contents}

* [Hur man kringgår att internetleverantören blockerar inkommande SMTP på port 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Hur man kringgår att internetleverantören blockerar utgående SMTP på port 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Hur kan jag kontrollera om min internetleverantör blockerar portar](#how-can-i-check-if-my-isp-blocks-ports)

## Hur man kringgår internetleverantörens blockering av inkommande SMTP på port 25 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Om du inte har port 25 öppen på din e-postservers IP-adress, då är den här guiden för dig.

Till exempel, du kör en anpassad e-postserver hemma och din internetleverantör har blockerat utgående port 25.

Eftersom du inte kan ha utgående trafik på port 25, kommer du troligtvis inte heller att ha inkommande trafik på port 25 på grund av detta block.

Förutsatt att du använder vår tjänst för att vidarebefordra e-postmeddelanden, [Du kan lösa problemet genom att svara på våra vanliga frågor här](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).

## Hur man kringgår internetleverantörens blockering av utgående SMTP på port 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Om din internetleverantör blockerar utgående port 25 måste du hitta en alternativ lösning eller kontakta dem.

## Hur kan jag kontrollera om min internetleverantör blockerar portar {#how-can-i-check-if-my-isp-blocks-ports}

Du kan köra `telnet smtp.forwardemail.net 25` från kommandoraden eller terminalen för att se om din utgående port 25-anslutning är blockerad.