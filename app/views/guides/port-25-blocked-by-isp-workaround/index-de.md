# Port 25 von ISP blockiert - Workaround {#port-25-blocked-by-isp-workaround}


## Inhaltsverzeichnis {#table-of-contents}

* [Wie man die ISP-Blockierung von eingehendem SMTP auf Port 25 umgeht](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Wie man die ISP-Blockierung von ausgehendem SMTP auf Port 25 umgeht](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Wie kann ich prüfen, ob mein ISP Ports blockiert](#how-can-i-check-if-my-isp-blocks-ports)


## Wie man die ISP-Blockierung von eingehendem SMTP auf Port 25 umgeht {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Wenn Port 25 auf der IP-Adresse Ihres Mailservers nicht geöffnet ist, dann ist diese Anleitung für Sie.

Zum Beispiel betreiben Sie einen eigenen Mailserver zu Hause, und Ihr Internetanbieter ("ISP") hat den ausgehenden Port 25 blockiert.

Da Sie keinen ausgehenden Verkehr auf Port 25 haben können, werden Sie höchstwahrscheinlich auch keinen eingehenden Verkehr auf Port 25 aufgrund dieser Blockierung haben.

Vorausgesetzt, Sie verwenden unseren Service zum Weiterleiten von E-Mails, [können Sie dieses Problem über unsere FAQ-Antwort hier umgehen](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).


## Wie man die ISP-Blockierung von ausgehendem SMTP auf Port 25 umgeht {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Wenn Ihr ISP den ausgehenden Port 25 blockiert, müssen Sie eine alternative Lösung finden oder ihn kontaktieren.


## Wie kann ich prüfen, ob mein ISP Ports blockiert {#how-can-i-check-if-my-isp-blocks-ports}

Sie können `telnet smtp.forwardemail.net 25` über die Kommandozeile oder das Terminal ausführen, um zu sehen, ob Ihre ausgehende Port-25-Verbindung blockiert ist.
