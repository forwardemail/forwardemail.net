# Datenschutzrichtlinie {#privacy-policy}

<!-- <img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email Datenschutzrichtlinie" class="rounded-lg" /> -->


## Inhaltsverzeichnis {#table-of-contents}

* [Haftungsausschluss](#disclaimer)
* [Nicht gesammelte Informationen](#information-not-collected)
* [Gesammelte Informationen](#information-collected)
  * [Kontoinformationen](#account-information)
  * [E-Mail-Speicherung](#email-storage)
  * [Fehlerprotokolle](#error-logs)
  * [Server-Protokolle](#server-logs)
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
* [Apps und Webmail](#apps-and-webmail)
  * [Daten auf Ihrem Gerät](#data-on-your-device)
  * [Daten, die die Apps an uns senden](#data-the-apps-send-us)
  * [Push-Benachrichtigungen](#push-notifications)
  * [Bilder und Links in E-Mails](#images-and-links-in-emails)
  * [Weitere Verbindungen](#other-connections)
* [Geteilte Informationen](#information-shared)
* [Informationslöschung](#information-removal)
* [Zusätzliche Offenlegungen](#additional-disclosures)


## Haftungsausschluss {#disclaimer}

Bitte beachten Sie unsere [Nutzungsbedingungen](/terms), da diese für die gesamte Website gelten.


## Nicht gesammelte Informationen {#information-not-collected}

**Mit Ausnahme der in dieser Richtlinie ausdrücklich beschriebenen Informationen (einschließlich [Fehlerprotokolle](#error-logs), [Server-Protokolle](#server-logs), [ausgehende SMTP-E-Mails](#outbound-smtp-emails), [Kontoinformationen](#account-information), [temporäre Datenverarbeitung](#temporary-data-processing), [Audit-Protokolle](#audit-logs), [Cookies und Sitzungen](#cookies-and-sessions), [Analysen](#analytics) und [Apps und Webmail](#apps-and-webmail)):**

* Wir speichern keine weitergeleiteten E-Mails auf Festplatten oder in Datenbanken.
* Wir speichern keine Metadaten über weitergeleitete E-Mails auf Festplatten oder in Datenbanken.
* Außer wie in dieser Richtlinie ausdrücklich beschrieben, speichern wir keine Protokolle oder IP-Adressen auf Festplatten oder in Datenbanken.
* Wir verwenden keine Analyse- oder Telemetriedienste von Drittanbietern.


## Gesammelte Informationen {#information-collected}

Zur Transparenz können Sie jederzeit <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">unseren Quellcode einsehen</a>, um zu sehen, wie die unten genannten Informationen gesammelt und verwendet werden.

**Streng für die Funktionalität und zur Verbesserung unseres Dienstes sammeln und speichern wir sicher die folgenden Informationen:**

### Kontoinformationen {#account-information}

* Wir speichern Ihre E-Mail-Adresse, die Sie uns zur Verfügung stellen.
* Wir speichern Ihre Domainnamen, Aliase und Konfigurationen, die Sie uns zur Verfügung stellen.
* Wir speichern begrenzte Konto-Sicherheitsmetadaten, die zum Schutz Ihres Kontos und zur Zugriffsverwaltung erforderlich sind, einschließlich aktiver Website-Sitzungskennungen, Zähler für fehlgeschlagene Anmeldeversuche und des Zeitstempels des letzten Anmeldeversuchs.
* Alle zusätzlichen Informationen, die Sie uns freiwillig zur Verfügung stellen, wie z. B. Kommentare oder Fragen, die Sie uns per E-Mail oder auf unserer <a href="/help">Hilfe</a>-Seite übermitteln.


**Registrierungszuordnung** (wird dauerhaft in Ihrem Konto gespeichert):

Wenn Sie ein Konto erstellen, speichern wir die folgenden Informationen, um zu verstehen, wie Nutzer unseren Dienst finden:

* Die verweisende Website-Domain (nicht die vollständige URL)
* Die erste Seite, die Sie auf unserer Website besucht haben, wobei in ihrem Pfad enthaltene Werte wie Domainnamen, IDs und Tokens durch Platzhalter ersetzt sind
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
* Wir speichern außerdem 7 Tage lang Fehlerprotokolle für Website- und API-Anfragen, die fehlschlagen oder zu lange dauern, sowie für Fehler auf unseren IMAP-, POP3-, CalDAV- und CardDAV-Servern.
* Diese Protokolle können die IP-Adresse, die Anfrage-URL (einschließlich Abfrageparametern wie Suchbegriffen), Anfrage-Header wie den User-Agent sowie das beteiligte Konto oder den beteiligten Alias enthalten.
* Passwörter, API-Tokens, Cookies und Anfrageinhalte werden in diesen Protokollen vor dem Speichern geschwärzt.

### Server-Protokolle {#server-logs}

* Unsere Server schreiben für jede Website- und API-Anfrage eine Protokollzeile, die die IP-Adresse, die Anfragemethode und die URL (einschließlich Abfrageparametern), Anfrage-Header, den Antwortstatus sowie das angemeldete Konto enthalten kann.
* Wir nutzen diese Protokolle, um Probleme zu finden und zu beheben und um Missbrauch zu unterbinden, und bewahren sie bis zu 30 Tage lang auf.

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
* Wir speichern auch begrenzte Authentifizierungsmetadaten auf Kontoebene, einschließlich Zähler für fehlgeschlagene Anmeldeversuche und des Zeitstempels des letzten Anmeldeversuchs.
* Redis-basierte Daten zu Authentifizierungsversuchen laufen automatisch ab (normalerweise innerhalb von 24 Stunden).
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

* Wir speichern HTTP-only, signierte Cookies und serverseitige Sitzungsdaten für Ihren Website-Verkehr.
* Cookies verwenden SameSite-Schutz.
* Wir speichern aktive Website-Sitzungskennungen in Ihrem Konto, um Funktionen wie "andere Geräte abmelden" und sicherheitsrelevante Sitzungsungültigmachung zu unterstützen.
* Sitzungs-Cookies laufen nach 30 Tagen Inaktivität ab.
* Wir erstellen keine Sitzungen für Bots oder Crawler.
* Wir verwenden Cookies und Sitzungen für:
  * Authentifizierung und Anmeldestatus
  * Zwei-Faktor-Authentifizierung "Angemeldet bleiben"-Funktion
  * Flash-Nachrichten und Benachrichtigungen
  * [Analysen](#analytics): die erste Seite Ihres Besuchs, die Referrer-Domain, UTM-Kampagnenparameter und ein Seitenzähler


## Analytics {#analytics}

Wir verwenden unser eigenes datenschutzorientiertes Analysesystem, um zu verstehen, wie unsere Dienste genutzt werden. Dieses System ist mit Datenschutz als Kernprinzip konzipiert:

**Was wir NICHT erfassen:**

* Wir speichern keine IP-Adressen
* Wir setzen kein separates Cookie für Analysen
* Wir nutzen keine Analyse-Dienste von Drittanbietern
* Wir verfolgen Besucher nicht über Tage oder Sitzungen hinweg, wenn sie nicht angemeldet sind

**Was wir erfassen:**

* Aggregierte Seitenaufrufe und Dienstnutzung (SMTP, IMAP, POP3, API usw.)
* Typ und Version von Browser und Betriebssystem (aus dem User-Agent geparst, Rohdaten werden verworfen)
* Gerätetyp (Desktop, Mobilgerät, Tablet)
* Referrer-Domain (nicht die vollständige URL) und UTM-Kampagnenparameter
* E-Mail-Client-Typ für Mail-Protokolle (z. B. Thunderbird, Outlook)
* Die aufgerufene Seite oder der aufgerufene API-Pfad, wobei darin enthaltene Werte wie Domainnamen, IDs und Tokens durch Platzhalter ersetzt sind, und ob die Anfrage erfolgreich war
* Bei Website-Besuchen die erste Seite des Besuchs und ein Seitenzähler, die in Ihrer Sitzung gespeichert werden (siehe [Cookies und Sitzungen](#cookies-and-sessions))
* Wenn Sie angemeldet sind, die ID Ihres Kontos, Ihres Alias oder Ihrer Domain, damit wir sehen können, wie jeder Dienst genutzt wird, und Probleme beheben können

**Datenaufbewahrung:**

* Analyse-Ereignisse werden automatisch nach 30 Tagen gelöscht
* Stündliche Summen, die mit keinem Konto verknüpft sind, werden 90 Tage lang aufbewahrt
* Sitzungskennungen rotieren täglich und können nicht verwendet werden, um Besucher über Tage hinweg zu verfolgen


## Apps und Webmail {#apps-and-webmail}

Dieser Abschnitt behandelt unsere E-Mail-Apps für iOS, Android, macOS, Windows und Linux sowie unser Webmail unter <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a>, die denselben Code nutzen. Die Apps enthalten keinen Werbe- oder Tracking-Code und keine Analysetools von Drittanbietern.

### Daten auf Ihrem Gerät {#data-on-your-device}

* Die Apps speichern Ihre E-Mails, Kontakte, Kalender, Einstellungen und Anmeldedaten auf Ihrem Gerät, damit sie schnell laden und offline funktionieren.
* Wenn Sie App Lock aktivieren, verschlüsselt die App gespeicherte E-Mail-Inhalte, Kontakte und Anmeldedaten mit einem Schlüssel, der durch Ihre PIN oder Ihren Passkey geschützt ist. Datumsangaben, Ordner, Labels und Markierungen bleiben unverschlüsselt, damit die App Ihre E-Mails sortieren und zählen kann.
* Wenn Sie sich von einem Konto abmelden, werden dessen Daten von Ihrem Gerät entfernt.

### Daten, die die Apps an uns senden {#data-the-apps-send-us}

* Ihre Alias-E-Mail-Adresse und Ihr Passwort bei jeder Anfrage, um Sie anzumelden.
* Die E-Mails, Kontakte, Kalender, Labels und Filter, die Sie senden, erstellen oder ändern. Wir speichern E-Mails, Kontakte und Kalender wie unter [E-Mail-Speicherung](#email-storage) beschrieben und von Ihnen gesendete E-Mails wie unter [Ausgehende SMTP-E-Mails](#outbound-smtp-emails) beschrieben.
* Ihre Suchbegriffe, damit wir Ihr Postfach auf unseren Servern durchsuchen können. Suchbegriffe sind Teil der Anfrage-URL und können daher in [Fehlerprotokollen](#error-logs) und [Server-Protokollen](#server-logs) erscheinen.
* Feedback, das Sie freiwillig aus der App senden. Es wird per E-Mail von Ihrem Alias an unser Support-Team geschickt, zusammen mit den Diagnosedetails, die Sie beifügen möchten.
* E-Mails, die Sie als Spam melden. Die App leitet sie an unser Abuse-Team weiter (oder an eine andere Adresse, die Sie in den Einstellungen festlegen).

### Push-Benachrichtigungen {#push-notifications}

* Wenn Sie Benachrichtigungen erlauben, registriert die App ein Push-Token bei uns. Wir speichern es zusammen mit der Plattform, dem zugehörigen Alias und Konto, dem Zeitpunkt seiner letzten Zustellung und einem Gerätenamen aus dem User-Agent der App, der Ihre Betriebssystemversion und unter Android Ihr Gerätemodell enthält.
* Wir bewahren ein Push-Token bis zu einem Jahr nach seiner letzten Verwendung auf. Wir löschen es früher, wenn Sie sich in der App abmelden, wenn die Zustellung dreimal hintereinander fehlschlägt, wenn sich das Alias-Passwort ändert, wenn Sie den Alias oder Ihr Konto löschen oder wenn der Alias an einen anderen Inhaber übergeht.
* Unter iOS und macOS laufen Benachrichtigungen über den Apple Push Notification service. In unserer Android-App aus Google Play laufen sie über Firebase Cloud Messaging. Benachrichtigungen über neue E-Mails enthalten den Namen und die Adresse des Absenders, den Betreff, eine kurze Vorschau und den Ordnernamen, auch für E-Mails, die ohne sichtbare Benachrichtigung eingehen, etwa solche, die im Ordner Spam oder Gesendet abgelegt werden. Wenn sich E-Mails, Kalender oder Kontakte ändern, senden wir außerdem stille Benachrichtigungen mit Kennungen, aber ohne E-Mail-Inhalt, damit die App aktuell bleibt.
* Mit [UnifiedPush](https://unifiedpush.org/) unter Android sowie bei Benachrichtigungen in einem Webbrowser wird jede Benachrichtigung so verschlüsselt, dass nur Ihr Gerät sie lesen kann.
* Unsere Android-App aus Google Play enthält Firebase Cloud Messaging, das eine Firebase-Installations-ID, die App-Version sowie Geräte- und SDK-Details an Google sendet. Unsere Google-freie Android-App von GitHub enthält kein Firebase.

### Bilder und Links in E-Mails {#images-and-links-in-emails}

* Bilder in E-Mails werden von den Servern des Absenders geladen, die Ihre IP-Adresse und den Zeitpunkt des Ladens sehen können.
* Die Apps blockieren Tracking-Pixel standardmäßig. Sie können außerdem unter Settings > Privacy & Security alle externen Bilder blockieren und sie dann für jeweils eine E-Mail laden.
* Links in E-Mails öffnen sich in Ihrem Webbrowser.

### Weitere Verbindungen {#other-connections}

* Unser Webmail fragt bei GitHub seine neueste Version ab, wenn es geladen wird, wenn Sie zu ihm zurückkehren und alle 10 Minuten, solange es geöffnet ist. About & Help fragt bei GitHub die neueste Desktop-Version ab, und die Desktop-Apps suchen bei GitHub nach Updates. GitHub erhält bei diesen Anfragen Ihre IP-Adresse.


## Information Shared {#information-shared}

Wir geben Ihre Informationen nicht an Dritte weiter, mit Ausnahme von Dienstleistern, die Teile unseres Dienstes betreiben, wie Cloudflare (Website-Schutz und verschlüsselte Backups), Stripe und PayPal (Zahlungen) sowie den Diensten, die Push-Benachrichtigungen an Ihre Geräte zustellen (siehe [Push-Benachrichtigungen](#push-notifications)).

Wir können verpflichtet sein und werden gerichtlichen Anordnungen nachkommen (beachten Sie jedoch, dass [wir keine oben unter „Nicht gesammelte Informationen“ genannten Informationen erfassen](#information-not-collected), sodass wir diese von vornherein nicht bereitstellen können).


## Information Removal {#information-removal}

Wenn Sie zu irgendeinem Zeitpunkt Informationen, die Sie uns bereitgestellt haben, entfernen möchten, gehen Sie zu <a href="/my-account/security">Mein Konto > Sicherheit</a> und klicken Sie auf „Konto löschen“.

Aus Gründen der Missbrauchsprävention und -minderung kann die Löschung Ihres Kontos eine manuelle Überprüfung durch unsere Administratoren erfordern, wenn Sie es innerhalb von 5 Tagen nach Ihrer ersten Zahlung löschen.

Dieser Prozess dauert in der Regel weniger als 24 Stunden und wurde eingeführt, weil Nutzer unseren Dienst missbraucht haben, indem sie ihn spamten und dann ihre Konten schnell löschten – was uns daran hinderte, ihre Zahlungsarten-Fingerabdrücke in Stripe zu sperren.

Wenn Sie Ihr Konto löschen, werden auch die von Ihnen verwalteten Domains, Ihre Aliase und die dafür registrierten Push-Tokens gelöscht. Der Kontodatensatz selbst bleibt bestehen, wobei dessen E-Mail-Adresse, Rechnungsangaben, Passwort und Passkeys entfernt und dessen Zwei-Faktor-Authentifizierung und API-Token widerrufen werden, und wir bewahren die zugehörigen Zahlungsdatensätze für Rückerstattungen und die Buchhaltung auf. Protokolle und Analysedaten, die sich auf Ihr Konto beziehen, werden gemäß den oben genannten Fristen gelöscht.

Um die Daten der Apps von einem Gerät zu entfernen, melden Sie sich in der App ab oder deinstallieren Sie sie.


## Additional Disclosures {#additional-disclosures}

Diese Seite wird durch Cloudflare geschützt und es gelten die [Datenschutzerklärung](https://www.cloudflare.com/privacypolicy/) sowie die [Nutzungsbedingungen](https://www.cloudflare.com/website-terms/) von Cloudflare.
