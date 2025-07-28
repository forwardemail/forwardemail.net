# Port 25 durch ISP-Workaround blockiert {#port-25-blocked-by-isp-workaround}

## Inhaltsverzeichnis {#table-of-contents}

* [So umgehen Sie die Blockierung eingehender SMTP-Daten durch den ISP auf Port 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [So umgehen Sie die Blockierung ausgehenden SMTP-Datenverkehrs durch den ISP auf Port 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Wie kann ich überprüfen, ob mein ISP Ports blockiert](#how-can-i-check-if-my-isp-blocks-ports)

## So umgehen Sie die Blockierung eingehender SMTP-Nachrichten durch Ihren ISP auf Port 25 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Wenn Sie Port 25 auf der IP-Adresse Ihres Mailservers nicht geöffnet haben, ist diese Anleitung für Sie.

Beispiel: Sie betreiben zu Hause einen benutzerdefinierten Mailserver und Ihr Internetdienstanbieter („ISP“) hat den ausgehenden Port 25 blockiert.

Da auf Port 25 kein ausgehender Datenverkehr möglich ist, wird aufgrund dieser Sperre höchstwahrscheinlich auch kein eingehender Datenverkehr auf Port 25 möglich sein.

Angenommen, Sie verwenden unseren Dienst zum Weiterleiten von E-Mails, [Sie können dieses Problem mithilfe unserer FAQ-Antwort hier umgehen.](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).

## So umgehen Sie die Blockierung ausgehenden SMTP-Datenverkehrs durch Ihren ISP auf Port 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Wenn Ihr ISP den ausgehenden Port 25 blockiert, müssen Sie eine alternative Lösung finden oder sich an ihn wenden.

## Wie kann ich überprüfen, ob mein ISP die Ports {#how-can-i-check-if-my-isp-blocks-ports} blockiert?

Sie können `telnet smtp.forwardemail.net 25` von der Befehlszeile oder dem Terminal aus ausführen, um zu sehen, ob Ihre ausgehende Verbindung über Port 25 blockiert ist.