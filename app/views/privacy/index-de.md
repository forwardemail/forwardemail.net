# Datenschutzrichtlinie {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email Datenschutzrichtlinie" class="rounded-lg" />


## Inhaltsverzeichnis {#table-of-contents}

* [Haftungsausschluss](#disclaimer)
* [Nicht gesammelte Informationen](#information-not-collected)
* [Gesammelte Informationen](#information-collected)
  * [Kontoinformationen](#account-information)
  * [E-Mail-Speicherung](#email-storage)
  * [Fehlerprotokolle](#error-logs)
  * [Ausgehende SMTP-E-Mails](#outbound-smtp-emails)
* [Temporäre Datenverarbeitung](#temporary-data-processing)
  * [Ratenbegrenzung](#rate-limiting)
  * [Verbindungsverfolgung](#connection-tracking)
  * [Authentifizierungsversuche](#authentication-attempts)
* [Audit-Protokolle](#audit-logs)
  * [Kontenänderungen](#account-changes)
  * [Änderungen der Domain-Einstellungen](#domain-settings-changes)
* [Cookies und Sitzungen](#cookies-and-sessions)
* [Analysen](#analytics)
* [Geteilte Informationen](#information-shared)
* [Informationslöschung](#information-removal)
* [Zusätzliche Offenlegungen](#additional-disclosures)


## Haftungsausschluss {#disclaimer}

Bitte beachten Sie unsere [Nutzungsbedingungen](/terms), da diese für die gesamte Website gelten.


## Nicht gesammelte Informationen {#information-not-collected}

**Mit Ausnahme von [Fehlerprotokollen](#error-logs), [ausgehenden SMTP-E-Mails](#outbound-smtp-emails) und/oder wenn Spam oder bösartige Aktivitäten erkannt werden (z. B. für Ratenbegrenzung):**

* Wir speichern keine weitergeleiteten E-Mails auf Festplatten oder in Datenbanken.
* Wir speichern keine Metadaten über weitergeleitete E-Mails auf Festplatten oder in Datenbanken.
* Wir speichern keine Protokolle oder IP-Adressen auf Festplatten oder in Datenbanken.
* Wir verwenden keine Analyse- oder Telemetriedienste von Drittanbietern.


## Gesammelte Informationen {#information-collected}

Zur Transparenz können Sie jederzeit <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">unseren Quellcode einsehen</a>, um zu sehen, wie die unten genannten Informationen gesammelt und verwendet werden.

**Streng für die Funktionalität und zur Verbesserung unseres Dienstes sammeln und speichern wir sicher die folgenden Informationen:**

### Kontoinformationen {#account-information}

* Wir speichern die E-Mail-Adresse, die Sie uns mitteilen.
* Wir speichern Ihre Domainnamen, Aliase und Konfigurationen, die Sie uns mitteilen.
* Alle zusätzlichen Informationen, die Sie uns freiwillig mitteilen, wie Kommentare oder Fragen, die Sie uns per E-Mail oder auf unserer <a href="/help">Hilfeseite</a> senden.

**Registrierungszuordnung** (wird dauerhaft in Ihrem Konto gespeichert):

Wenn Sie ein Konto erstellen, speichern wir die folgenden Informationen, um zu verstehen, wie Nutzer unseren Dienst finden:

* Die verweisende Website-Domain (nicht die vollständige URL)
* Die erste Seite, die Sie auf unserer Website besucht haben
* UTM-Kampagnenparameter, falls in der URL vorhanden

### E-Mail-Speicherung {#email-storage}

* Wir speichern E-Mails und Kalenderinformationen in Ihrer [verschlüsselten SQLite-Datenbank](/blog/docs/best-quantum-safe-encrypted-email-service) ausschließlich für Ihren IMAP/POP3/CalDAV/CardDAV-Zugriff und die Postfachfunktionalität.
  * Beachten Sie, dass wenn Sie nur unseren E-Mail-Weiterleitungsdienst nutzen, keine E-Mails auf Festplatte oder in Datenbanken gespeichert werden, wie unter [Nicht gesammelte Informationen](#information-not-collected) beschrieben.
  * Unsere E-Mail-Weiterleitungsdienste arbeiten ausschließlich im Arbeitsspeicher (kein Schreiben auf Festplatte oder in Datenbanken).
  * IMAP/POP3/CalDAV/CardDAV-Speicher ist ruhend verschlüsselt, während der Übertragung verschlüsselt und auf einer LUKS-verschlüsselten Festplatte gespeichert.
  * Backups Ihres IMAP/POP3/CalDAV/CardDAV-Speichers sind ruhend verschlüsselt, während der Übertragung verschlüsselt und werden auf [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) gespeichert.

### Fehlerprotokolle {#error-logs}

* Wir speichern `4xx` und `5xx` SMTP-Antwortcode-[Fehlerprotokolle](/faq#do-you-store-error-logs) für 7 Tage.
* Fehlerprotokolle enthalten den SMTP-Fehler, Umschlag und E-Mail-Header (wir speichern **nicht** den E-Mail-Text oder Anhänge).
* Fehlerprotokolle können IP-Adressen und Hostnamen von sendenden Servern zu Debugging-Zwecken enthalten.
* Fehlerprotokolle für [Ratenbegrenzung](/faq#do-you-have-rate-limiting) und [Greylisting](/faq#do-you-have-a-greylist) sind nicht zugänglich, da die Verbindung frühzeitig beendet wird (z. B. bevor `RCPT TO` und `MAIL FROM` Befehle übertragen werden können).
### Ausgehende SMTP-E-Mails {#outbound-smtp-emails}

* Wir speichern [ausgehende SMTP-E-Mails](/faq#do-you-support-sending-email-with-smtp) für ca. 30 Tage.
  * Diese Dauer variiert basierend auf dem "Date"-Header; da wir E-Mails erlauben, in der Zukunft gesendet zu werden, wenn ein zukünftiger "Date"-Header vorhanden ist.
  * **Beachten Sie, dass sobald eine E-Mail erfolgreich zugestellt oder dauerhaft fehlerhaft ist, wir den Nachrichteninhalt schwärzen und löschen.**
  * Wenn Sie möchten, dass der Nachrichteninhalt Ihrer ausgehenden SMTP-E-Mail länger als der Standard von 0 Tagen (nach erfolgreicher Zustellung oder dauerhaftem Fehler) aufbewahrt wird, gehen Sie zu den Erweiterten Einstellungen für Ihre Domain und geben Sie einen Wert zwischen `0` und `30` ein.
  * Einige Nutzer verwenden gerne die Vorschaufunktion [Mein Konto > E-Mails](/my-account/emails), um zu sehen, wie ihre E-Mails dargestellt werden, daher unterstützen wir eine konfigurierbare Aufbewahrungsdauer.
  * Beachten Sie, dass wir auch [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) unterstützen.


## Temporäre Datenverarbeitung {#temporary-data-processing}

Die folgenden Daten werden temporär im Arbeitsspeicher oder Redis verarbeitet und **nicht** dauerhaft gespeichert:

### Ratenbegrenzung {#rate-limiting}

* IP-Adressen werden temporär in Redis für Zwecke der Ratenbegrenzung verwendet.
* Ratenbegrenzungsdaten verfallen automatisch (typischerweise innerhalb von 24 Stunden).
* Dies verhindert Missbrauch und stellt eine faire Nutzung unserer Dienste sicher.

### Verbindungsverfolgung {#connection-tracking}

* Gleichzeitige Verbindungsanzahlen werden pro IP-Adresse in Redis verfolgt.
* Diese Daten verfallen automatisch, wenn Verbindungen geschlossen werden oder nach einem kurzen Timeout.
* Wird verwendet, um Verbindungs-Missbrauch zu verhindern und die Verfügbarkeit des Dienstes sicherzustellen.

### Authentifizierungsversuche {#authentication-attempts}

* Fehlgeschlagene Authentifizierungsversuche werden pro IP-Adresse in Redis verfolgt.
* Diese Daten verfallen automatisch (typischerweise innerhalb von 24 Stunden).
* Wird verwendet, um Brute-Force-Angriffe auf Benutzerkonten zu verhindern.


## Prüfprotokolle {#audit-logs}

Um Ihnen zu helfen, Ihr Konto und Ihre Domains zu überwachen und zu sichern, führen wir Prüfprotokolle für bestimmte Änderungen. Diese Protokolle werden verwendet, um Benachrichtigungs-E-Mails an Kontoinhaber und Domain-Administratoren zu senden.

### Kontoänderungen {#account-changes}

* Wir verfolgen Änderungen an wichtigen Kontoeinstellungen (z. B. Zwei-Faktor-Authentifizierung, Anzeigename, Zeitzone).
* Wenn Änderungen erkannt werden, senden wir eine E-Mail-Benachrichtigung an Ihre registrierte E-Mail-Adresse.
* Sensible Felder (z. B. Passwort, API-Tokens, Wiederherstellungsschlüssel) werden verfolgt, aber deren Werte in Benachrichtigungen geschwärzt.
* Prüfprotokolleinträge werden nach dem Versand der Benachrichtigungs-E-Mail gelöscht.

### Änderungen an Domain-Einstellungen {#domain-settings-changes}

Für Domains mit mehreren Administratoren bieten wir detaillierte Prüfprotokollierung, um Teams bei der Nachverfolgung von Konfigurationsänderungen zu unterstützen:

**Was wir verfolgen:**

* Änderungen an Domain-Einstellungen (z. B. Bounce-Webhooks, Spam-Filterung, DKIM-Konfiguration)
* Wer die Änderung vorgenommen hat (E-Mail-Adresse des Benutzers)
* Wann die Änderung vorgenommen wurde (Zeitstempel)
* Die IP-Adresse, von der die Änderung vorgenommen wurde
* Den Browser/Client User-Agent-String

**Wie es funktioniert:**

* Alle Domain-Administratoren erhalten eine einzelne konsolidierte E-Mail-Benachrichtigung, wenn Einstellungen geändert werden.
* Die Benachrichtigung enthält eine Tabelle, die jede Änderung mit dem Benutzer, der sie vorgenommen hat, dessen IP-Adresse und Zeitstempel zeigt.
* Sensible Felder (z. B. Webhook-Schlüssel, API-Tokens, DKIM-Private Keys) werden verfolgt, aber deren Werte geschwärzt.
* User-Agent-Informationen sind in einem einklappbaren Abschnitt "Technische Details" enthalten.
* Prüfprotokolleinträge werden nach dem Versand der Benachrichtigungs-E-Mail gelöscht.

**Warum wir das erfassen:**

* Um Domain-Administratoren bei der Sicherheitsüberwachung zu unterstützen
* Um Teams zu ermöglichen, nachzuvollziehen, wer Konfigurationsänderungen vorgenommen hat
* Um bei der Fehlerbehebung zu helfen, falls unerwartete Änderungen auftreten
* Um Verantwortlichkeit bei gemeinsamer Domain-Verwaltung zu gewährleisten


## Cookies und Sitzungen {#cookies-and-sessions}

* Wir speichern ein Cookie in einer Sitzung für Ihren Website-Traffic.
* Cookies sind HTTP-only, signiert und verwenden SameSite-Schutz.
* Sitzungscookies verfallen nach 30 Tagen Inaktivität.
* Wir erstellen keine Sitzungen für Bots oder Crawler.
* Wir verwenden Cookies für:
  * Authentifizierung und Login-Status
  * Zwei-Faktor-Authentifizierungs-"Remember me"-Funktionalität
  * Flash-Nachrichten und Benachrichtigungen
## Analytics {#analytics}

Wir verwenden unser eigenes datenschutzorientiertes Analysesystem, um zu verstehen, wie unsere Dienste genutzt werden. Dieses System ist mit Datenschutz als Kernprinzip konzipiert:

**Was wir NICHT erfassen:**

* Wir speichern keine IP-Adressen
* Wir verwenden keine Cookies oder persistente Identifikatoren für Analysen
* Wir nutzen keine Analyse-Dienste von Drittanbietern
* Wir verfolgen Nutzer nicht über Tage oder Sitzungen hinweg

**Was wir erfassen (anonymisiert):**

* Aggregierte Seitenaufrufe und Dienstnutzung (SMTP, IMAP, POP3, API usw.)
* Browser- und Betriebssystemtyp (aus dem User-Agent geparst, Rohdaten werden verworfen)
* Gerätetyp (Desktop, Mobilgerät, Tablet)
* Referrer-Domain (nicht die vollständige URL)
* E-Mail-Client-Typ für Mail-Protokolle (z. B. Thunderbird, Outlook)

**Datenaufbewahrung:**

* Analysedaten werden automatisch nach 30 Tagen gelöscht
* Sitzungskennungen rotieren täglich und können nicht verwendet werden, um Nutzer über Tage hinweg zu verfolgen


## Information Shared {#information-shared}

Wir geben Ihre Informationen nicht an Dritte weiter.

Wir können verpflichtet sein und werden gerichtlichen Anordnungen nachkommen (beachten Sie jedoch, dass [wir keine oben unter „Information Not Collected“ (#information-not-collected) genannten Informationen erfassen], sodass wir diese von vornherein nicht bereitstellen können).


## Information Removal {#information-removal}

Wenn Sie zu irgendeinem Zeitpunkt Informationen, die Sie uns bereitgestellt haben, entfernen möchten, gehen Sie zu <a href="/my-account/security">Mein Konto > Sicherheit</a> und klicken Sie auf „Konto löschen“.

Aus Gründen der Missbrauchsprävention und -minderung kann die Löschung Ihres Kontos eine manuelle Überprüfung durch unsere Administratoren erfordern, wenn Sie es innerhalb von 5 Tagen nach Ihrer ersten Zahlung löschen.

Dieser Prozess dauert in der Regel weniger als 24 Stunden und wurde eingeführt, weil Nutzer unseren Dienst missbraucht haben, indem sie ihn spamten und dann ihre Konten schnell löschten – was uns daran hinderte, ihre Zahlungsarten-Fingerabdrücke in Stripe zu sperren.


## Additional Disclosures {#additional-disclosures}

Diese Seite wird durch Cloudflare geschützt und es gelten die [Datenschutzerklärung](https://www.cloudflare.com/privacypolicy/) sowie die [Nutzungsbedingungen](https://www.cloudflare.com/website-terms/) von Cloudflare.
