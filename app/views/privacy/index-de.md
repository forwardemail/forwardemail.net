# Datenschutzrichtlinie {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="" class="rounded-lg" />

## Inhaltsverzeichnis {#table-of-contents}

* [Haftungsausschluss](#disclaimer)
* [Nicht erfasste Informationen](#information-not-collected)
* [Erfasste Informationen](#information-collected)
* [Weitergabe von Informationen](#information-shared)
* [Entfernen von Informationen](#information-removal)
* [Zusätzliche Angaben](#additional-disclosures)

## Haftungsausschluss {#disclaimer}

Bitte beachten Sie unsere [Bedingungen](/terms), da diese für die gesamte Site gelten.

## Informationen nicht erfasst {#information-not-collected}

**Mit Ausnahme von [Fehler](/faq#do-you-store-error-logs), [ausgehende SMTP-E-Mails](/faq#do-you-support-sending-email-with-smtp) und/oder wenn Spam oder böswillige Aktivitäten erkannt werden (z. B. zur Ratenbegrenzung):**

* Wir speichern keine weitergeleiteten E-Mails auf Festplatten oder in Datenbanken.
* Wir speichern keine Metadaten zu E-Mails auf Festplatten oder in Datenbanken.
* Wir speichern keine Protokolle oder IP-Adressen auf Festplatten oder in Datenbanken.

## Erfasste Informationen {#information-collected}

Aus Gründen der Transparenz können Sie jederzeit <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">unseren Quellcode einsehen</a>, um zu sehen, wie die folgenden Informationen gesammelt und verwendet werden:

**Ausschließlich für die Funktionalität und zur Verbesserung unseres Dienstes erfassen und speichern wir die folgenden Informationen sicher:**

* Wir speichern E-Mails und Kalenderdaten in Ihrem [verschlüsselte SQLite-Datenbank](/blog/docs/best-quantum-safe-encrypted-email-service) ausschließlich für Ihren IMAP-/POP3-/CalDAV-/CardDAV-Zugriff und Ihre Postfachfunktionen.
* Beachten Sie: Wenn Sie ausschließlich unsere E-Mail-Weiterleitungsdienste nutzen, werden keine E-Mails wie unter [Nicht erfasste Informationen](#information-not-collected) beschrieben auf Festplatte oder in Datenbanken gespeichert.
* Unsere E-Mail-Weiterleitungsdienste arbeiten ausschließlich im Arbeitsspeicher (kein Schreiben auf Festplatte oder in Datenbanken).
* IMAP-/POP3-/CalDAV-/CardDAV-Speicher ist im Ruhezustand und während der Übertragung verschlüsselt und wird auf einer LUKS-verschlüsselten Festplatte gespeichert.
* Backups Ihres IMAP-/POP3-/CalDAV-/CardDAV-Speichers sind im Ruhezustand und während der Übertragung verschlüsselt und werden auf [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) gespeichert.
* Wir speichern während einer Sitzung ein Cookie für Ihren Website-Verkehr.
* Wir speichern Ihre E-Mail-Adresse, die Sie uns mitteilen.
* Wir speichern Ihre Domänennamen, Aliase und Konfigurationen, die Sie uns zur Verfügung stellen.
* Wir speichern die SMTP-Antwortcodes `4xx` und `5xx` sowie den SMTP-Antwortcode [Fehlerprotokolle](/faq#do-you-store-error-logs) für 7 Tage.
* Wir speichern [ausgehende SMTP-E-Mails](/faq#do-you-support-sending-email-with-smtp) für ca. 30 Tage.
* Diese Dauer variiert je nach „Datum“-Header, da wir den zukünftigen Versand von E-Mails zulassen, sofern ein zukünftiger „Datum“-Header vorhanden ist.
* **Beachten Sie, dass wir den Nachrichtentext einer E-Mail nach erfolgreicher Zustellung oder dauerhaftem Fehler redigieren und löschen.**
* Wenn Sie den Nachrichtentext Ihrer ausgehenden SMTP-E-Mails länger als die Standardeinstellung von 0 Tagen (nach erfolgreicher Zustellung oder dauerhaftem Fehler) speichern möchten, geben Sie in den erweiterten Einstellungen Ihrer Domäne einen Wert zwischen `0` und `30` ein.
* Manche Nutzer nutzen gerne die Vorschaufunktion [Mein Konto > E-Mails](/my-account/emails), um zu sehen, wie ihre E-Mails dargestellt werden. Daher unterstützen wir eine konfigurierbare Aufbewahrungsdauer.
* Beachten Sie, dass wir auch [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) unterstützen.
* Alle zusätzlichen Informationen, die Sie uns freiwillig zur Verfügung stellen, wie z. B. Kommentare oder Fragen, die Sie uns per E-Mail oder über unsere <a href="/help">Hilfeseite</a> senden.

## Geteilte Informationen {#information-shared}

Wir geben Ihre Daten nicht an Dritte weiter. Wir nutzen auch keine Analyse- oder Telemetriesoftware von Drittanbietern.

Wir müssen möglicherweise gerichtlich angeordneten rechtlichen Anfragen nachkommen und werden dies auch tun (denken Sie jedoch daran, dass wir diese [Wir sammeln keine Informationen, die oben unter „Nicht gesammelte Informationen“ aufgeführt sind.](#information-not-collected) daher nicht von vornherein bereitstellen können).

## Informationen entfernen {#information-removal}

Wenn Sie die Informationen, die Sie uns bereitgestellt haben, jederzeit entfernen möchten, gehen Sie zu <a href="/my-account/security">Mein Konto > Sicherheit</a> und klicken Sie auf „Konto löschen“.

Aus Gründen der Missbrauchsprävention und -minderung muss Ihr Konto möglicherweise manuell von unseren Administratoren gelöscht werden, wenn Sie es innerhalb von 5 Tagen nach Ihrer ersten Zahlung löschen.

Dieser Vorgang dauert normalerweise weniger als 24 Stunden und wurde implementiert, weil Benutzer unseren Dienst mit Spam überfluteten und dann schnell ihre Konten löschten – was uns daran hinderte, ihre Zahlungsmethoden-Fingerabdrücke in Stripe zu blockieren.

## Zusätzliche Angaben {#additional-disclosures}

Diese Site ist durch Cloudflare geschützt und es gelten die [Datenschutzrichtlinie](https://www.cloudflare.com/privacypolicy/) und [Servicebedingungen](https://www.cloudflare.com/website-terms/).