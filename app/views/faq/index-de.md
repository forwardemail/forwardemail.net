# Häufig gestellte Fragen {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Forward Email häufig gestellte Fragen" class="rounded-lg" />


## Inhaltsverzeichnis {#table-of-contents}

* [Schnellstart](#quick-start)
* [Einführung](#introduction)
  * [Was ist Forward Email](#what-is-forward-email)
  * [Wer nutzt Forward Email](#who-uses-forward-email)
  * [Wie ist die Geschichte von Forward Email](#what-is-forward-emails-history)
  * [Wie schnell ist dieser Dienst](#how-fast-is-this-service)
* [E-Mail-Clients](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [Mobile Geräte](#mobile-devices)
  * [Sendmail SMTP Relay Konfiguration](#sendmail-smtp-relay-configuration)
  * [Exim4 SMTP Relay Konfiguration](#exim4-smtp-relay-configuration)
  * [msmtp SMTP Client Konfiguration](#msmtp-smtp-client-configuration)
  * [Kommandozeilen-E-Mail-Clients](#command-line-email-clients)
  * [Windows E-Mail Konfiguration](#windows-email-configuration)
  * [Postfix SMTP Relay Konfiguration](#postfix-smtp-relay-configuration)
  * [Wie man "Senden als" mit Gmail einrichtet](#how-to-send-mail-as-using-gmail)
  * [Was ist die Legacy-freie Anleitung für "Senden als" mit Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Erweiterte Gmail-Routing-Konfiguration](#advanced-gmail-routing-configuration)
  * [Erweiterte Outlook-Routing-Konfiguration](#advanced-outlook-routing-configuration)
* [Fehlerbehebung](#troubleshooting)
  * [Warum erhalte ich meine Test-E-Mails nicht](#why-am-i-not-receiving-my-test-emails)
  * [Wie konfiguriere ich meinen E-Mail-Client für Forward Email](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Warum landen meine E-Mails im Spam und Junk und wie kann ich meinen Domain-Ruf prüfen](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Was soll ich tun, wenn ich Spam-E-Mails erhalte](#what-should-i-do-if-i-receive-spam-emails)
  * [Warum werden meine Test-E-Mails, die ich mir selbst in Gmail sende, als "verdächtig" angezeigt](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Kann ich das "via forwardemail dot net" in Gmail entfernen](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Datenverwaltung](#data-management)
  * [Wo befinden sich Ihre Server](#where-are-your-servers-located)
  * [Wie exportiere und sichere ich mein Postfach](#how-do-i-export-and-backup-my-mailbox)
  * [Wie importiere und migriere ich mein bestehendes Postfach](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Wie nutze ich meinen eigenen S3-kompatiblen Speicher für Backups](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [Wie konvertiere ich SQLite-Backups in EML-Dateien](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [Unterstützen Sie Self-Hosting](#do-you-support-self-hosting)
* [E-Mail-Konfiguration](#email-configuration)
  * [Wie starte ich und richte E-Mail-Weiterleitung ein](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Kann ich mehrere MX-Exchanges und Server für erweiterte Weiterleitung verwenden](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Wie richte ich eine Abwesenheitsnotiz (Out-of-Office-Auto-Responder) ein](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Wie richte ich SPF für Forward Email ein](#how-do-i-set-up-spf-for-forward-email)
  * [Wie richte ich DKIM für Forward Email ein](#how-do-i-set-up-dkim-for-forward-email)
  * [Wie richte ich DMARC für Forward Email ein](#how-do-i-set-up-dmarc-for-forward-email)
  * [Wie sehe ich DMARC-Berichte ein](#how-do-i-view-dmarc-reports)
  * [Wie verbinde und konfiguriere ich meine Kontakte](#how-do-i-connect-and-configure-my-contacts)
  * [Wie verbinde und konfiguriere ich meine Kalender](#how-do-i-connect-and-configure-my-calendars)
  * [Wie füge ich weitere Kalender hinzu und verwalte bestehende Kalender](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Wie verbinde und konfiguriere ich Aufgaben und Erinnerungen](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [Warum kann ich in macOS Erinnerungen keine Aufgaben erstellen](#why-cant-i-create-tasks-in-macos-reminders)
  * [Wie richte ich Tasks.org auf Android ein](#how-do-i-set-up-tasksorg-on-android)
  * [Wie richte ich SRS für Forward Email ein](#how-do-i-set-up-srs-for-forward-email)
  * [Wie richte ich MTA-STS für Forward Email ein](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Wie füge ich meinem E-Mail-Adresse ein Profilbild hinzu](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Erweiterte Funktionen](#advanced-features)
  * [Unterstützen Sie Newsletter oder Mailinglisten für Marketing-E-Mails](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Unterstützen Sie das Senden von E-Mails per API](#do-you-support-sending-email-with-api)
  * [Unterstützen Sie den Empfang von E-Mails per IMAP](#do-you-support-receiving-email-with-imap)
  * [Unterstützen Sie POP3](#do-you-support-pop3)
  * [Unterstützen Sie Kalender (CalDAV)](#do-you-support-calendars-caldav)
  * [Unterstützen Sie Aufgaben und Erinnerungen (CalDAV VTODO)](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [Unterstützen Sie Kontakte (CardDAV)](#do-you-support-contacts-carddav)
  * [Unterstützen Sie das Senden von E-Mails per SMTP](#do-you-support-sending-email-with-smtp)
  * [Unterstützen Sie OpenPGP/MIME, Ende-zu-Ende-Verschlüsselung ("E2EE") und Web Key Directory ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Unterstützen Sie S/MIME-Verschlüsselung](#do-you-support-smime-encryption)
  * [Unterstützen Sie Sieve E-Mail-Filterung](#do-you-support-sieve-email-filtering)
  * [Unterstützen Sie MTA-STS](#do-you-support-mta-sts)
  * [Unterstützen Sie Passkeys und WebAuthn](#do-you-support-passkeys-and-webauthn)
  * [Unterstützen Sie E-Mail-Best-Practices](#do-you-support-email-best-practices)
  * [Unterstützen Sie Bounce-Webhooks](#do-you-support-bounce-webhooks)
  * [Unterstützen Sie Webhooks](#do-you-support-webhooks)
  * [Unterstützen Sie reguläre Ausdrücke oder Regex](#do-you-support-regular-expressions-or-regex)
  * [Wie sind Ihre ausgehenden SMTP-Limits](#what-are-your-outbound-smtp-limits)
  * [Brauche ich eine Genehmigung, um SMTP zu aktivieren](#do-i-need-approval-to-enable-smtp)
  * [Wie lauten Ihre SMTP-Server-Konfigurationseinstellungen](#what-are-your-smtp-server-configuration-settings)
  * [Wie lauten Ihre IMAP-Server-Konfigurationseinstellungen](#what-are-your-imap-server-configuration-settings)
  * [Wie lauten Ihre POP3-Server-Konfigurationseinstellungen](#what-are-your-pop3-server-configuration-settings)
  * [Wie richte ich E-Mail-Autodiscovery für meine Domain ein](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [Sicherheit](#security-1)
  * [Erweiterte Techniken zur Server-Härtung](#advanced-server-hardening-techniques)
  * [Haben Sie SOC 2 oder ISO 27001 Zertifizierungen](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Verwenden Sie TLS-Verschlüsselung für die E-Mail-Weiterleitung](#do-you-use-tls-encryption-for-email-forwarding)
  * [Bewahren Sie E-Mail-Authentifizierungsheader auf](#do-you-preserve-email-authentication-headers)
  * [Bewahren Sie originale E-Mail-Header auf und verhindern Spoofing](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Wie schützen Sie vor Spam und Missbrauch](#how-do-you-protect-against-spam-and-abuse)
  * [Speichern Sie E-Mail-Inhalte auf der Festplatte](#do-you-store-email-content-on-disk)
  * [Können E-Mail-Inhalte bei Systemabstürzen offengelegt werden](#can-email-content-be-exposed-during-system-crashes)
  * [Wer hat Zugriff auf Ihre E-Mail-Infrastruktur](#who-has-access-to-your-email-infrastructure)
  * [Welche Infrastruktur-Anbieter nutzen Sie](#what-infrastructure-providers-do-you-use)
  * [Bieten Sie eine Datenverarbeitungsvereinbarung (DPA) an](#do-you-offer-a-data-processing-agreement-dpa)
  * [Wie gehen Sie mit Datenschutzverletzungsbenachrichtigungen um](#how-do-you-handle-data-breach-notifications)
  * [Bieten Sie eine Testumgebung an](#do-you-offer-a-test-environment)
  * [Stellen Sie Überwachungs- und Alarmierungstools bereit](#do-you-provide-monitoring-and-alerting-tools)
  * [Wie gewährleisten Sie hohe Verfügbarkeit](#how-do-you-ensure-high-availability)
  * [Sind Sie konform mit Abschnitt 889 des National Defense Authorization Act (NDAA)](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [System- und technische Details](#system-and-technical-details)
  * [Speichern Sie E-Mails und deren Inhalte](#do-you-store-emails-and-their-contents)
  * [Wie funktioniert Ihr E-Mail-Weiterleitungssystem](#how-does-your-email-forwarding-system-work)
  * [Wie verarbeiten Sie eine E-Mail zur Weiterleitung](#how-do-you-process-an-email-for-forwarding)
  * [Wie gehen Sie mit Problemen bei der E-Mail-Zustellung um](#how-do-you-handle-email-delivery-issues)
  * [Wie gehen Sie damit um, wenn Ihre IP-Adressen blockiert werden](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Was sind Postmaster-Adressen](#what-are-postmaster-addresses)
  * [Was sind No-Reply-Adressen](#what-are-no-reply-addresses)
  * [Wie lauten die IP-Adressen Ihres Servers](#what-are-your-servers-ip-addresses)
  * [Haben Sie eine Allowlist](#do-you-have-an-allowlist)
  * [Welche Domain-Endungen sind standardmäßig auf der Allowlist](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Was sind Ihre Kriterien für die Allowlist](#what-is-your-allowlist-criteria)
  * [Welche Domain-Endungen können kostenlos verwendet werden](#what-domain-name-extensions-can-be-used-for-free)
  * [Haben Sie eine Greylist](#do-you-have-a-greylist)
  * [Haben Sie eine Denylist](#do-you-have-a-denylist)
  * [Haben Sie Rate Limiting](#do-you-have-rate-limiting)
  * [Wie schützen Sie vor Backscatter](#how-do-you-protect-against-backscatter)
  * [Verhindern Sie Bounces von bekannten MAIL FROM-Spammern](#prevent-bounces-from-known-mail-from-spammers)
  * [Verhindern Sie unnötige Bounces zum Schutz vor Backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Wie bestimmen Sie einen E-Mail-Fingerabdruck](#how-do-you-determine-an-email-fingerprint)
  * [Kann ich E-Mails an andere Ports als 25 weiterleiten (z.B. wenn mein ISP Port 25 blockiert)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Unterstützt es das Plus + Symbol für Gmail-Aliase](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Unterstützt es Subdomains](#does-it-support-sub-domains)
  * [Leitet es die Header meiner E-Mails weiter](#does-this-forward-my-emails-headers)
  * [Ist das gut getestet](#is-this-well-tested)
  * [Leiten Sie SMTP-Antwortnachrichten und Codes weiter](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Wie verhindern Sie Spammer und gewährleisten einen guten Ruf für die E-Mail-Weiterleitung](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Wie führen Sie DNS-Abfragen für Domainnamen durch](#how-do-you-perform-dns-lookups-on-domain-names)
* [Konto und Abrechnung](#account-and-billing)
  * [Bieten Sie eine Geld-zurück-Garantie für kostenpflichtige Pläne](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Wenn ich den Plan wechsle, erfolgt eine anteilige Rückerstattung](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Kann ich diesen E-Mail-Weiterleitungsdienst nur als "Fallback" oder "Fallover" MX-Server verwenden](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Kann ich bestimmte Aliase deaktivieren](#can-i-disable-specific-aliases)
  * [Kann ich E-Mails an mehrere Empfänger weiterleiten](#can-i-forward-emails-to-multiple-recipients)
  * [Kann ich mehrere globale Catch-All-Empfänger haben](#can-i-have-multiple-global-catch-all-recipients)
  * [Gibt es eine maximale Anzahl von E-Mail-Adressen, an die ich pro Alias weiterleiten kann](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Kann ich E-Mails rekursiv weiterleiten](#can-i-recursively-forward-emails)
  * [Können Leute meine E-Mail-Weiterleitung ohne meine Erlaubnis abmelden oder anmelden](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Wie ist das kostenlos](#how-is-it-free)
  * [Was ist die maximale E-Mail-Größe](#what-is-the-max-email-size-limit)
  * [Speichern Sie Protokolle von E-Mails](#do-you-store-logs-of-emails)
  * [Speichern Sie Fehlerprotokolle](#do-you-store-error-logs)
  * [Lesen Sie meine E-Mails](#do-you-read-my-emails)
  * [Kann ich mit Gmail "Senden als" verwenden](#can-i-send-mail-as-in-gmail-with-this)
  * [Kann ich mit Outlook "Senden als" verwenden](#can-i-send-mail-as-in-outlook-with-this)
  * [Kann ich mit Apple Mail und iCloud Mail "Senden als" verwenden](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Kann ich unbegrenzt E-Mails weiterleiten](#can-i-forward-unlimited-emails-with-this)
  * [Bieten Sie unbegrenzte Domains zu einem Preis an](#do-you-offer-unlimited-domains-for-one-price)
  * [Welche Zahlungsmethoden akzeptieren Sie](#which-payment-methods-do-you-accept)
* [Zusätzliche Ressourcen](#additional-resources)
## Schnellstart {#quick-start}

Um mit Forward Email zu beginnen:

1. **Erstellen Sie ein Konto** unter [forwardemail.net/register](https://forwardemail.net/register)

2. **Fügen Sie Ihre Domain hinzu und verifizieren Sie sie** unter [Mein Konto → Domains](/my-account/domains)

3. **Fügen Sie E-Mail-Aliase/Postfächer hinzu und konfigurieren Sie diese** unter [Mein Konto → Domains](/my-account/domains) → Aliase

4. **Testen Sie Ihre Einrichtung**, indem Sie eine E-Mail an einen Ihrer neuen Aliase senden

> \[!TIP]
> DNS-Änderungen können bis zu 24-48 Stunden benötigen, um weltweit wirksam zu werden, obwohl sie oft viel schneller wirksam sind.

> \[!IMPORTANT]
> Für eine verbesserte Zustellbarkeit empfehlen wir die Einrichtung von [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) und [DMARC](#how-do-i-set-up-dmarc-for-forward-email) Einträgen.


## Einführung {#introduction}

### Was ist Forward Email {#what-is-forward-email}

> \[!NOTE]
> Forward Email ist perfekt für Einzelpersonen, kleine Unternehmen und Entwickler, die professionelle E-Mail-Adressen ohne die Kosten und den Aufwand einer vollständigen E-Mail-Hosting-Lösung wünschen.

Forward Email ist ein **voll ausgestatteter E-Mail-Dienstanbieter** und **E-Mail-Hosting-Anbieter für benutzerdefinierte Domainnamen**.

Es ist der einzige kostenlose und Open-Source-Dienst und ermöglicht Ihnen die Nutzung von E-Mail-Adressen mit eigener Domain, ohne die Komplexität der Einrichtung und Wartung eines eigenen E-Mail-Servers.

Unser Dienst leitet E-Mails, die an Ihre benutzerdefinierte Domain gesendet werden, an Ihr bestehendes E-Mail-Konto weiter – und Sie können uns sogar als Ihren dedizierten E-Mail-Hosting-Anbieter nutzen.

Wichtige Funktionen von Forward Email:

* **E-Mail mit eigener Domain**: Verwenden Sie professionelle E-Mail-Adressen mit Ihrem eigenen Domainnamen
* **Kostenlose Stufe**: Basis-E-Mail-Weiterleitung ohne Kosten
* **Erhöhter Datenschutz**: Wir lesen Ihre E-Mails nicht und verkaufen Ihre Daten nicht
* **Open Source**: Unser gesamter Code ist auf GitHub verfügbar
* **SMTP-, IMAP- und POP3-Unterstützung**: Vollständige E-Mail-Sende- und Empfangsfunktionen
* **Ende-zu-Ende-Verschlüsselung**: Unterstützung für OpenPGP/MIME
* **Benutzerdefinierte Catch-All-Aliase**: Erstellen Sie unbegrenzt viele E-Mail-Aliase

Sie können uns mit über 56 anderen E-Mail-Dienstanbietern auf [unserer E-Mail-Vergleichsseite](/blog/best-email-service) vergleichen.

> \[!TIP]
> Erfahren Sie mehr über Forward Email, indem Sie unser kostenloses [Technisches Whitepaper](/technical-whitepaper.pdf) lesen

### Wer nutzt Forward Email {#who-uses-forward-email}

Wir bieten E-Mail-Hosting und E-Mail-Weiterleitungsdienste für über 500.000 Domains und diese namhaften Nutzer:

| Kunde                                   | Fallstudie                                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| U.S. Naval Academy                      | [:page_facing_up: Fallstudie](/blog/docs/federal-government-email-service-section-889-compliant)         |
| Canonical                               | [:page_facing_up: Fallstudie](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Netflix Games                           |                                                                                                          |
| The Linux Foundation                    | [:page_facing_up: Fallstudie](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| The PHP Foundation                      |                                                                                                          |
| Fox News Radio                          |                                                                                                          |
| Disney Ad Sales                         |                                                                                                          |
| jQuery                                  | [:page_facing_up: Fallstudie](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| LineageOS                               |                                                                                                          |
| Ubuntu                                  | [:page_facing_up: Fallstudie](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Kubuntu                                 | [:page_facing_up: Fallstudie](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Lubuntu                                 | [:page_facing_up: Fallstudie](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| The University of Cambridge             | [:page_facing_up: Fallstudie](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| The University of Maryland              | [:page_facing_up: Fallstudie](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| The University of Washington            | [:page_facing_up: Fallstudie](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Tufts University                        | [:page_facing_up: Fallstudie](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Swarthmore College                      | [:page_facing_up: Fallstudie](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Government of South Australia           |                                                                                                          |
| Government of Dominican Republic        |                                                                                                          |
| Fly<span>.</span>io                     |                                                                                                          |
| RCD Hotels                              |                                                                                                          |
| Isaac Z. Schlueter (npm)                | [:page_facing_up: Fallstudie](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |                                                                                                          |
### Was ist die Geschichte von Forward Email {#what-is-forward-emails-history}

Sie können mehr über Forward Email auf [unserer Über uns-Seite](/about) erfahren.

### Wie schnell ist dieser Dienst {#how-fast-is-this-service}

> \[!NOTE]
> Unser System ist auf Geschwindigkeit und Zuverlässigkeit ausgelegt, mit mehreren redundanten Servern, um sicherzustellen, dass Ihre E-Mails umgehend zugestellt werden.

Forward Email liefert Nachrichten mit minimaler Verzögerung, typischerweise innerhalb von Sekunden nach Eingang.

Leistungskennzahlen:

* **Durchschnittliche Zustellzeit**: Weniger als 5-10 Sekunden vom Eingang bis zur Weiterleitung ([siehe unsere Time to Inbox "TTI" Überwachungsseite](/tti))
* **Verfügbarkeit**: 99,9 %+ Serviceverfügbarkeit
* **Globale Infrastruktur**: Strategisch platzierte Server für optimale Weiterleitung
* **Automatische Skalierung**: Unser System skaliert während Spitzenzeiten im E-Mail-Verkehr

Wir arbeiten in Echtzeit, im Gegensatz zu anderen Anbietern, die auf verzögerte Warteschlangen setzen.

Wir schreiben nicht auf die Festplatte und speichern keine Protokolle – mit Ausnahme von [Fehlern](#do-you-store-error-logs) und [ausgehenden SMTP](#do-you-support-sending-email-with-smtp) (siehe unsere [Datenschutzerklärung](/privacy)).

Alles wird im Arbeitsspeicher erledigt und [unser Quellcode ist auf GitHub](https://github.com/forwardemail).


## E-Mail-Clients {#email-clients}

### Thunderbird {#thunderbird}

1. Erstellen Sie einen neuen Alias und generieren Sie ein Passwort in Ihrem Forward Email Dashboard
2. Öffnen Sie Thunderbird und gehen Sie zu **Bearbeiten → Kontoeinstellungen → Kontenaktionen → E-Mail-Konto hinzufügen**
3. Geben Sie Ihren Namen, Forward Email-Adresse und Passwort ein
4. Klicken Sie auf **Manuell konfigurieren** und geben Sie ein:
   * Eingehend: IMAP, `imap.forwardemail.net`, Port 993, SSL/TLS
   * Ausgehend: SMTP, `smtp.forwardemail.net`, Port 465, SSL/TLS (empfohlen; Port 587 mit STARTTLS wird ebenfalls unterstützt)
5. Klicken Sie auf **Fertig**

### Microsoft Outlook {#microsoft-outlook}

1. Erstellen Sie einen neuen Alias und generieren Sie ein Passwort in Ihrem Forward Email Dashboard
2. Gehen Sie zu **Datei → Konto hinzufügen**
3. Geben Sie Ihre Forward Email-Adresse ein und klicken Sie auf **Verbinden**
4. Wählen Sie **Erweiterte Optionen** und aktivieren Sie **Ich möchte mein Konto manuell einrichten**
5. Wählen Sie **IMAP** und geben Sie ein:
   * Eingehend: `imap.forwardemail.net`, Port 993, SSL
   * Ausgehend: `smtp.forwardemail.net`, Port 465, SSL/TLS (empfohlen; Port 587 mit STARTTLS wird ebenfalls unterstützt)
   * Benutzername: Ihre vollständige E-Mail-Adresse
   * Passwort: Ihr generiertes Passwort
6. Klicken Sie auf **Verbinden**

### Apple Mail {#apple-mail}

1. Erstellen Sie einen neuen Alias und generieren Sie ein Passwort in Ihrem Forward Email Dashboard
2. Gehen Sie zu **Mail → Einstellungen → Accounts → +**
3. Wählen Sie **Anderes Mail-Konto**
4. Geben Sie Ihren Namen, Forward Email-Adresse und Passwort ein
5. Für die Servereinstellungen geben Sie ein:
   * Eingehend: `imap.forwardemail.net`
   * Ausgehend: `smtp.forwardemail.net`
   * Benutzername: Ihre vollständige E-Mail-Adresse
   * Passwort: Ihr generiertes Passwort
6. Klicken Sie auf **Anmelden**

### eM Client {#em-client}

1. Erstellen Sie einen neuen Alias und generieren Sie ein Passwort in Ihrem Forward Email Dashboard
2. Öffnen Sie eM Client und gehen Sie zu **Menü → Konten → + Konto hinzufügen**
3. Klicken Sie auf **Mail** und wählen Sie dann **Andere**
4. Geben Sie Ihre Forward Email-Adresse ein und klicken Sie auf **Weiter**
5. Geben Sie die folgenden Servereinstellungen ein:
   * **Eingehender Server**: `imap.forwardemail.net`
   * **Ausgehender Server**: `smtp.forwardemail.net`
6. Geben Sie Ihre vollständige E-Mail-Adresse als **Benutzername** und Ihr generiertes Passwort als **Passwort** für beide Server ein.
7. eM Client testet die Verbindung. Sobald der Test erfolgreich ist, klicken Sie auf **Weiter**.
8. Geben Sie Ihren Namen ein und wählen Sie einen Kontonamen.
9. Klicken Sie auf **Fertigstellen**.

### Mobile Geräte {#mobile-devices}

Für iOS:

1. Gehen Sie zu **Einstellungen → Mail → Accounts → Account hinzufügen → Andere**
2. Tippen Sie auf **Mail-Account hinzufügen** und geben Sie Ihre Daten ein
3. Für die Servereinstellungen verwenden Sie die gleichen IMAP- und SMTP-Einstellungen wie oben

Für Android:

1. Gehen Sie zu **Einstellungen → Konten → Konto hinzufügen → Persönlich (IMAP)**
2. Geben Sie Ihre Forward Email-Adresse und Ihr Passwort ein
3. Für die Servereinstellungen verwenden Sie die gleichen IMAP- und SMTP-Einstellungen wie oben

### Sendmail SMTP Relay Konfiguration {#sendmail-smtp-relay-configuration}

Sie können Sendmail so konfigurieren, dass E-Mails über die SMTP-Server von Forward Email weitergeleitet werden. Dies ist eine gängige Einrichtung für Legacy-Systeme oder Anwendungen, die auf Sendmail angewiesen sind.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Geschätzte Einrichtungszeit:</strong>
  <span>Weniger als 20 Minuten</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Dies erfordert einen kostenpflichtigen Plan mit aktiviertem SMTP-Zugang.
  </span>
</div>

#### Konfiguration {#configuration}

1. Bearbeiten Sie Ihre `sendmail.mc`-Datei, die sich typischerweise unter `/etc/mail/sendmail.mc` befindet:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. Fügen Sie die folgenden Zeilen hinzu, um den Smart Host und die Authentifizierung zu definieren:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. Erstellen Sie die Authentifizierungsdatei `/etc/mail/authinfo`:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. Fügen Sie Ihre Forward Email-Zugangsdaten in die `authinfo`-Datei ein:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. Erzeugen Sie die Authentifizierungsdatenbank und sichern Sie die Dateien:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Bauen Sie die Sendmail-Konfiguration neu und starten Sie den Dienst neu:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### Testen {#testing}

Senden Sie eine Test-E-Mail, um die Konfiguration zu überprüfen:

```bash
echo "Test email from Sendmail" | mail -s "Sendmail Test" recipient@example.com
```

### Exim4 SMTP Relay Konfiguration {#exim4-smtp-relay-configuration}

Exim4 ist ein beliebter MTA auf Debian-basierten Systemen. Sie können ihn so konfigurieren, dass Forward Email als Smarthost verwendet wird.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Geschätzte Einrichtungszeit:</strong>
  <span>Weniger als 15 Minuten</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Dies erfordert einen kostenpflichtigen Plan mit aktiviertem SMTP-Zugang.
  </span>
</div>

#### Konfiguration {#configuration-1}

1. Starten Sie das Exim4-Konfigurationstool:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. Wählen Sie die folgenden Optionen:
   * **Allgemeiner Typ der Mail-Konfiguration:** Mail, die über Smarthost gesendet wird; empfangen via SMTP oder fetchmail
   * **System-Mail-Name:** your.hostname
   * **IP-Adressen, auf denen eingehende SMTP-Verbindungen akzeptiert werden:** 127.0.0.1 ; ::1
   * **Andere Ziele, für die Mail akzeptiert wird:** (leer lassen)
   * **Domains, für die Mail weitergeleitet wird:** (leer lassen)
   * **IP-Adresse oder Hostname des ausgehenden Smarthosts:** smtp.forwardemail.net::465
   * **Lokalen Mail-Namen in ausgehender Mail verbergen?** Nein
   * **Anzahl der DNS-Abfragen minimal halten (Dial-on-Demand)?** Nein
   * **Zustellmethode für lokale Mail:** Mbox-Format in /var/mail/
   * **Konfiguration in kleine Dateien aufteilen?** Nein

3. Bearbeiten Sie die Datei `passwd.client`, um Ihre Zugangsdaten hinzuzufügen:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. Fügen Sie die folgende Zeile hinzu:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. Aktualisieren Sie die Konfiguration und starten Sie Exim4 neu:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### Testen {#testing-1}

Senden Sie eine Test-E-Mail:

```bash
echo "Test from Exim4" | mail -s "Exim4 Test" recipient@example.com
```

### msmtp SMTP Client Konfiguration {#msmtp-smtp-client-configuration}

msmtp ist ein leichter SMTP-Client, der nützlich ist, um E-Mails von Skripten oder Kommandozeilenanwendungen zu senden.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Geschätzte Einrichtungszeit:</strong>
  <span>Weniger als 10 Minuten</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Dies erfordert einen kostenpflichtigen Plan mit aktiviertem SMTP-Zugang.
  </span>
</div>

#### Konfiguration {#configuration-2}

1. Erstellen oder bearbeiten Sie die msmtp-Konfigurationsdatei unter `~/.msmtprc`:

   ```bash
   nano ~/.msmtprc
   ```

2. Fügen Sie die folgende Konfiguration hinzu:

   ```
   defaults
   auth           on
   tls            on
   tls_trust_file /etc/ssl/certs/ca-certificates.crt
   logfile        ~/.msmtp.log

   account        forwardemail
   host           smtp.forwardemail.net
   port           465
   tls_starttls   off
   from           your-alias@yourdomain.com
   user           your-alias@yourdomain.com
   password       your-generated-password

   account default : forwardemail
   ```

3. Setzen Sie die korrekten Berechtigungen für die Konfigurationsdatei:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### Testen {#testing-2}

Senden Sie eine Test-E-Mail:

```bash
echo "Dies ist eine Test-E-Mail von msmtp" | msmtp -a default recipient@example.com
```

### Kommandozeilen-E-Mail-Clients {#command-line-email-clients}

Beliebte Kommandozeilen-E-Mail-Clients wie [Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org) und [Alpine](https://alpine.x10.mx/alpine/release/) können so konfiguriert werden, dass sie die SMTP-Server von Forward Email zum Senden von E-Mails verwenden. Die Konfiguration ähnelt der `msmtp`-Einrichtung, bei der Sie die SMTP-Serverdetails und Ihre Zugangsdaten in den jeweiligen Konfigurationsdateien (`.muttrc`, `.neomuttrc` oder `.pinerc`) angeben.

### Windows E-Mail-Konfiguration {#windows-email-configuration}

Für Windows-Nutzer können Sie beliebte E-Mail-Clients wie **Microsoft Outlook** und **eM Client** mit den IMAP- und SMTP-Einstellungen konfigurieren, die in Ihrem Forward Email-Konto bereitgestellt werden. Für die Verwendung in der Kommandozeile oder in Skripten können Sie PowerShells `Send-MailMessage` Cmdlet verwenden (obwohl es als veraltet gilt) oder ein leichtgewichtiges SMTP-Relay-Tool wie [E-MailRelay](https://github.com/graeme-walker/emailrelay).

### Postfix SMTP-Relay-Konfiguration {#postfix-smtp-relay-configuration}

Sie können Postfix so konfigurieren, dass E-Mails über die SMTP-Server von Forward Email weitergeleitet werden. Dies ist nützlich für Serveranwendungen, die E-Mails versenden müssen.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Geschätzte Einrichtungszeit:</strong>
  <span>Weniger als 15 Minuten</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Dies erfordert einen kostenpflichtigen Plan mit aktiviertem SMTP-Zugang.
  </span>
</div>

#### Installation {#installation}

1. Installieren Sie Postfix auf Ihrem Server:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Wählen Sie während der Installation "Internet Site" als Konfigurationstyp aus, wenn Sie dazu aufgefordert werden.

#### Konfiguration {#configuration-3}

1. Bearbeiten Sie die Hauptkonfigurationsdatei von Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Fügen Sie diese Einstellungen hinzu oder ändern Sie sie:

```
# SMTP-Relay-Konfiguration
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Erstellen Sie die SASL-Passwortdatei:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Fügen Sie Ihre Forward Email-Zugangsdaten hinzu:

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. Sichern und hashen Sie die Passwortdatei:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Starten Sie Postfix neu:

```bash
sudo systemctl restart postfix
```

#### Testen {#testing-3}

Testen Sie Ihre Konfiguration, indem Sie eine Test-E-Mail senden:

```bash
echo "Test E-Mail-Inhalt" | mail -s "Test Betreff" recipient@example.com
```

### Wie man Mail As mit Gmail sendet {#how-to-send-mail-as-using-gmail}
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Geschätzte Einrichtungszeit:</strong>
  <span>Weniger als 10 Minuten</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Erste Schritte:
  </strong>
  <span>
    Wenn Sie den obigen Anweisungen unter <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Wie starte ich und richte die E-Mail-Weiterleitung ein</a> gefolgt sind, können Sie unten weiterlesen.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Bitte stellen Sie sicher, dass Sie unsere <a href="/terms" class="alert-link" target="_blank">Nutzungsbedingungen</a>, <a href="/privacy" class="alert-link" target="_blank">Datenschutzerklärung</a> und <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Outbound SMTP Limits</a> gelesen haben – Ihre Nutzung gilt als Anerkennung und Zustimmung.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Wenn Sie Entwickler sind, lesen Sie bitte unsere <a class="alert-link" href="/email-api#outbound-emails" target="_blank">E-Mail-API-Dokumentation</a>.
  </span>
</div>

1. Gehen Sie zu <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Einstellungen <i class="fa fa-angle-right"></i> Outbound SMTP-Konfiguration und folgen Sie den Einrichtungshinweisen

2. Erstellen Sie einen neuen Alias für Ihre Domain unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase (z. B. <code><hello@example.com></code>)

3. Klicken Sie neben dem neu erstellten Alias auf <strong class="text-success"><i class="fa fa-key"></i> Passwort generieren</strong>. Kopieren Sie es in Ihre Zwischenablage und speichern Sie das angezeigte Passwort sicher.

4. Gehen Sie zu [Gmail](https://gmail.com) und klicken Sie unter [Einstellungen <i class="fa fa-angle-right"></i> Konten und Import <i class="fa fa-angle-right"></i> Senden als](https://mail.google.com/mail/u/0/#settings/accounts) auf „Weitere E-Mail-Adresse hinzufügen“

5. Geben Sie bei der Aufforderung „Name“ den Namen ein, der als Absender angezeigt werden soll (z. B. „Linus Torvalds“).

6. Geben Sie bei der Aufforderung „E-Mail-Adresse“ die vollständige E-Mail-Adresse eines unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase erstellten Alias ein (z. B. <code><hello@example.com></code>)

7. Deaktivieren Sie „Als Alias behandeln“

8. Klicken Sie auf „Nächster Schritt“, um fortzufahren

9. Geben Sie bei der Aufforderung „SMTP-Server“ <code>smtp.forwardemail.net</code> ein und ändern Sie den Port auf <code>465</code>

10. Geben Sie bei der Aufforderung „Benutzername“ die vollständige E-Mail-Adresse eines unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase erstellten Alias ein (z. B. <code><hello@example.com></code>)

11. Fügen Sie bei der Aufforderung „Passwort“ das Passwort ein, das Sie in Schritt 3 unter <strong class="text-success"><i class="fa fa-key"></i> Passwort generieren</strong> erhalten haben

12. Wählen Sie die Option „Gesicherte Verbindung mit SSL“

13. Klicken Sie auf „Konto hinzufügen“, um fortzufahren

14. Öffnen Sie einen neuen Tab zu [Gmail](https://gmail.com) und warten Sie auf Ihre Bestätigungs-E-Mail (Sie erhalten einen Bestätigungscode, der bestätigt, dass Sie der Eigentümer der E-Mail-Adresse sind, von der Sie „Senden als“ verwenden möchten)

15. Sobald die E-Mail eingetroffen ist, kopieren Sie den Bestätigungscode und fügen Sie ihn in die Aufforderung ein, die Sie im vorherigen Schritt erhalten haben
16. Sobald Sie das erledigt haben, gehen Sie zurück zur E-Mail und klicken Sie auf den Link, um die Anfrage zu "bestätigen". Wahrscheinlich müssen Sie diesen Schritt und den vorherigen Schritt durchführen, damit die E-Mail korrekt konfiguriert wird.

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Herzlichen Glückwunsch!
    </strong>
    <span>
      Sie haben alle Schritte erfolgreich abgeschlossen.
    </span>
  </div>
</div>

</div>

### Was ist die legacy-freie Anleitung für Send Mail As mit Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Wichtig:</strong> Diese legacy-freie Anleitung ist seit Mai 2023 veraltet, da <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">wir jetzt ausgehendes SMTP unterstützen</a>. Wenn Sie die untenstehende Anleitung verwenden, dann <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">wird Ihre ausgehende E-Mail</a> in Gmail mit "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" angezeigt.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Geschätzte Einrichtungszeit:</strong>
  <span>Weniger als 10 Minuten</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Erste Schritte:
  </strong>
  <span>
    Wenn Sie den obigen Anweisungen unter <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Wie starte ich und richte die E-Mail-Weiterleitung ein</a> gefolgt sind, können Sie unten weiterlesen.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Sie müssen die [Zwei-Faktor-Authentifizierung von Gmail][gmail-2fa] aktiviert haben, damit dies funktioniert. Besuchen Sie <https://www.google.com/landing/2step/>, falls Sie diese noch nicht aktiviert haben.

2. Sobald die Zwei-Faktor-Authentifizierung aktiviert ist (oder wenn sie bereits aktiviert war), besuchen Sie <https://myaccount.google.com/apppasswords>.

3. Wenn Sie aufgefordert werden, "Wählen Sie die App und das Gerät, für das Sie das App-Passwort generieren möchten":
   * Wählen Sie unter dem Dropdown-Menü "App auswählen" die Option "Mail"
   * Wählen Sie unter dem Dropdown-Menü "Gerät auswählen" die Option "Andere"
   * Wenn Sie zur Texteingabe aufgefordert werden, geben Sie die E-Mail-Adresse Ihrer benutzerdefinierten Domain ein, von der Sie weiterleiten (z. B. <code><hello@example.com></code> – dies hilft Ihnen, den Überblick zu behalten, falls Sie diesen Dienst für mehrere Konten nutzen)

4. Kopieren Sie das automatisch generierte Passwort in Ihre Zwischenablage
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Wichtig:
     </strong>
     <span>
       Wenn Sie G Suite verwenden, besuchen Sie Ihr Admin-Panel <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Apps <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Einstellungen für Gmail <i class="fa fa-angle-right"></i> Einstellungen</a> und stellen Sie sicher, dass "Benutzern erlauben, E-Mails über einen externen SMTP-Server zu senden..." aktiviert ist. Es kann einige Minuten dauern, bis diese Änderung wirksam wird, bitte warten Sie daher einige Minuten.
     </span>
   </div>

5. Gehen Sie zu [Gmail](https://gmail.com) und klicken Sie unter [Einstellungen <i class="fa fa-angle-right"></i> Konten und Import <i class="fa fa-angle-right"></i> E-Mail senden als](https://mail.google.com/mail/u/0/#settings/accounts) auf "Weitere E-Mail-Adresse hinzufügen"

6. Wenn Sie nach "Name" gefragt werden, geben Sie den Namen ein, der als Absendername angezeigt werden soll (z. B. "Linus Torvalds")

7. Wenn Sie nach "E-Mail-Adresse" gefragt werden, geben Sie die E-Mail-Adresse mit der benutzerdefinierten Domain ein, die Sie oben verwendet haben (z. B. <code><hello@example.com></code>)
8. Deaktivieren Sie "Als Alias behandeln"

9. Klicken Sie auf "Nächster Schritt", um fortzufahren

10. Wenn Sie nach dem "SMTP-Server" gefragt werden, geben Sie <code>smtp.gmail.com</code> ein und lassen Sie den Port auf <code>587</code>

11. Wenn Sie nach dem "Benutzernamen" gefragt werden, geben Sie den Teil Ihrer Gmail-Adresse ohne den <span>gmail.com</span>-Teil ein (z. B. nur "user", wenn meine E-Mail <span><user@gmail.com></span> lautet)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        Wichtig:
      </strong>
      <span>
        Wenn der "Benutzername"-Teil automatisch ausgefüllt wird, <u><strong>müssen Sie diesen</strong></u> stattdessen auf den Benutzernamen-Teil Ihrer Gmail-Adresse ändern.
      </span>
    </div>

12. Wenn Sie nach dem "Passwort" gefragt werden, fügen Sie das in Schritt 2 oben generierte Passwort aus Ihrer Zwischenablage ein

13. Lassen Sie die Option "Gesicherte Verbindung mit TLS" aktiviert

14. Klicken Sie auf "Konto hinzufügen", um fortzufahren

15. Öffnen Sie einen neuen Tab zu [Gmail](https://gmail.com) und warten Sie auf Ihre Verifizierungs-E-Mail (Sie erhalten einen Bestätigungscode, der bestätigt, dass Sie der Eigentümer der E-Mail-Adresse sind, von der Sie "Senden als" versuchen)

16. Sobald die E-Mail eintrifft, kopieren Sie den Verifizierungscode und fügen ihn in die Eingabeaufforderung ein, die Sie im vorherigen Schritt erhalten haben

17. Nachdem Sie das getan haben, gehen Sie zurück zur E-Mail und klicken Sie auf den Link, um die Anfrage zu "bestätigen". Wahrscheinlich müssen Sie diesen Schritt und den vorherigen durchführen, damit die E-Mail korrekt konfiguriert wird.

</div>

### Erweiterte Gmail-Routing-Konfiguration {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Geschätzte Einrichtungszeit:</strong>
  <span>15-30 Minuten</span>
</div>

Wenn Sie in Gmail ein erweitertes Routing einrichten möchten, sodass Aliase, die keinem Postfach entsprechen, an die Mail-Exchanges von Forward Email weitergeleitet werden, gehen Sie wie folgt vor:

1. Melden Sie sich in Ihrer Google Admin-Konsole unter [admin.google.com](https://admin.google.com) an
2. Gehen Sie zu **Apps → Google Workspace → Gmail → Routing**
3. Klicken Sie auf **Route hinzufügen** und konfigurieren Sie die folgenden Einstellungen:

**Einstellungen für einzelnen Empfänger:**

* Wählen Sie "Empfänger im Umschlag ändern" und geben Sie Ihre primäre Gmail-Adresse ein
* Aktivieren Sie "X-Gm-Original-To-Header mit ursprünglichem Empfänger hinzufügen"

**Muster für Empfänger im Umschlag:**

* Fügen Sie ein Muster hinzu, das alle nicht existierenden Postfächer abdeckt (z. B. `.*@yourdomain.com`)

**Einstellungen für den E-Mail-Server:**

* Wählen Sie "An Host weiterleiten" und geben Sie `mx1.forwardemail.net` als primären Server ein
* Fügen Sie `mx2.forwardemail.net` als Backup-Server hinzu
* Setzen Sie den Port auf 25
* Wählen Sie "TLS erforderlich" für die Sicherheit

4. Klicken Sie auf **Speichern**, um die Route zu erstellen

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Diese Konfiguration funktioniert nur für Google Workspace-Konten mit benutzerdefinierten Domains, nicht für reguläre Gmail-Konten.
  </span>
</div>

### Erweiterte Outlook-Routing-Konfiguration {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Geschätzte Einrichtungszeit:</strong>
  <span>15-30 Minuten</span>
</div>

Für Microsoft 365 (ehemals Office 365)-Nutzer, die ein erweitertes Routing einrichten möchten, sodass Aliase, die keinem Postfach entsprechen, an die Mail-Exchanges von Forward Email weitergeleitet werden:

1. Melden Sie sich im Microsoft 365 Admin Center unter [admin.microsoft.com](https://admin.microsoft.com) an
2. Gehen Sie zu **Exchange → Mailfluss → Regeln**
3. Klicken Sie auf **Regel hinzufügen** und wählen Sie **Neue Regel erstellen**
4. Benennen Sie Ihre Regel (z. B. "Nicht existierende Postfächer an Forward Email weiterleiten")
5. Unter **Diese Regel anwenden, wenn** wählen Sie:
   * "Die Empfängeradresse entspricht..."
   * Geben Sie ein Muster ein, das alle Adressen Ihrer Domain abdeckt (z. B. `*@yourdomain.com`)
6. Unter **Folgendes tun** wählen Sie:
   * "Nachricht umleiten an..."
   * Wählen Sie "Den folgenden Mailserver"
   * Geben Sie `mx1.forwardemail.net` und Port 25 ein
   * Fügen Sie `mx2.forwardemail.net` als Backup-Server hinzu
7. Unter **Außer wenn** wählen Sie:
   * "Der Empfänger ist..."
   * Fügen Sie alle bestehenden Postfächer hinzu, die nicht weitergeleitet werden sollen
8. Setzen Sie die Priorität der Regel so, dass sie nach anderen Mailflussregeln ausgeführt wird
9. Klicken Sie auf **Speichern**, um die Regel zu aktivieren
## Fehlerbehebung {#troubleshooting}

### Warum erhalte ich meine Test-E-Mails nicht {#why-am-i-not-receiving-my-test-emails}

Wenn Sie eine Test-E-Mail an sich selbst senden, wird diese möglicherweise nicht in Ihrem Posteingang angezeigt, da sie denselben "Message-ID"-Header hat.

Dies ist ein bekanntes Problem und betrifft auch Dienste wie Gmail.  <a href="https://support.google.com/a/answer/1703601">Hier ist die offizielle Gmail-Antwort zu diesem Problem</a>.

Wenn Sie weiterhin Probleme haben, liegt dies höchstwahrscheinlich an der DNS-Propagation.  Sie müssen etwas länger warten und es erneut versuchen (oder versuchen, einen niedrigeren TTL-Wert für Ihre <strong class="notranslate">TXT</strong>-Einträge festzulegen).

**Immer noch Probleme?**  Bitte <a href="/help">kontaktieren Sie uns</a>, damit wir das Problem untersuchen und schnell lösen können.

### Wie konfiguriere ich meinen E-Mail-Client, um mit Forward Email zu arbeiten {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  Unser Dienst funktioniert mit beliebten E-Mail-Clients wie:
  <ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
    <li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Desktop</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Terminal</a></li>
  </ul>
</div>

<div class="alert alert-primary">
  Ihr Benutzername ist die E-Mail-Adresse Ihres Alias und das Passwort stammt von <strong class="text-success"><i class="fa fa-key"></i> Passwort generieren</strong> („Normales Passwort“).
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
  <span>Wenn Sie Thunderbird verwenden, stellen Sie sicher, dass „Verbindungssicherheit“ auf „SSL/TLS“ und die Authentifizierungsmethode auf „Normales Passwort“ eingestellt ist.</span>
</div>

| Typ  |         Hostname        |         Protokoll       |                                            Ports                                           |
| :--: | :---------------------: | :---------------------: | :----------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` |  SSL/TLS **Bevorzugt**  |                                      `993` und `2993`                                      |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Empfohlen**   | `465` und `2465` für SSL/TLS (empfohlen) oder `587`, `2587`, `2525` und `25` für STARTTLS |

### Warum landen meine E-Mails im Spam- und Junk-Ordner und wie kann ich die Reputation meiner Domain überprüfen {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
Dieser Abschnitt führt Sie durch, falls Ihre ausgehende Mail unsere SMTP-Server verwendet (z. B. `smtp.forwardemail.net`) (oder weitergeleitet über `mx1.forwardemail.net` oder `mx2.forwardemail.net`) und diese im Spam- oder Junk-Ordner der Empfänger zugestellt wird.

Wir überwachen routinemäßig unsere [IP-Adressen](#what-are-your-servers-ip-addresses) gegen [alle renommierten DNS-Denylists](#how-do-you-handle-your-ip-addresses-becoming-blocked), **daher handelt es sich höchstwahrscheinlich um ein domänenspezifisches Reputationsproblem**.

E-Mails können aus verschiedenen Gründen im Spam-Ordner landen:

1. **Fehlende Authentifizierung**: Richten Sie [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) und [DMARC](#how-do-i-set-up-dmarc-for-forward-email) Records ein.

2. **Domain-Reputation**: Neue Domains haben oft eine neutrale Reputation, bis sie eine Versandhistorie aufgebaut haben.

3. **Inhaltliche Auslöser**: Bestimmte Wörter oder Phrasen können Spam-Filter auslösen.

4. **Versandmuster**: Plötzliche Erhöhungen des E-Mail-Volumens können verdächtig wirken.

Sie können eines oder mehrere dieser Tools verwenden, um die Reputation und Kategorisierung Ihrer Domain zu überprüfen:

#### Reputation- und Blocklist-Check-Tools {#reputation-and-blocklist-check-tools}

| Tool-Name                                  | URL                                                          | Typ                    |
| ------------------------------------------ | ------------------------------------------------------------ | ---------------------- |
| Cloudflare Domain Categorization Feedback  | <https://radar.cloudflare.com/domains/feedback>              | Kategorisierung        |
| Spamhaus IP and Domain Reputation Checker  | <https://check.spamhaus.org/>                                | DNSBL                  |
| Cisco Talos IP and Domain Reputation Center| <https://talosintelligence.com/reputation_center>            | Reputation             |
| Barracuda IP and Domain Reputation Lookup  | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| MX Toolbox Blacklist Check                 | <https://mxtoolbox.com/blacklists.aspx>                      | Blacklist              |
| Google Postmaster Tools                    | <https://www.gmail.com/postmaster/>                          | Reputation             |
| Yahoo Sender Hub                           | <https://senders.yahooinc.com/>                              | Reputation             |
| MultiRBL.valli.org Blacklist Check         | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                               | <https://senderscore.org/act/blocklist-remover/>             | Reputation             |
| Invaluement                                | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                      | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                    | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| UCEPROTECT's Levels 1, 2, and 3            | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| UCEPROTECT's backscatterer.org             | <https://www.backscatterer.org/>                             | Backscatter-Schutz     |
| UCEPROTECT's whitelisted.org               | <https://www.whitelisted.org/> (erfordert eine Gebühr)       | DNSWL                  |

#### IP-Entfernungsanfrageformulare nach Anbieter {#ip-removal-request-forms-by-provider}

Wenn Ihre IP-Adresse von einem bestimmten E-Mail-Anbieter blockiert wurde, verwenden Sie das entsprechende Entfernungsformular oder den Kontakt unten:

| Anbieter                               | Entfernungsformular / Kontakt                                                                                 | Hinweise                                     |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                          | <https://support.google.com/mail/contact/bulk_send_new>                                                       | Formular für Massenversender                 |
| Microsoft (Outlook/Office 365/Hotmail)| <https://sender.office.com>                                                                                   | Office 365 IP-Delist-Portal                   |
| Yahoo/AOL/Verizon                     | <https://senders.yahooinc.com/>                                                                               | Yahoo Sender Hub                             |
| Apple/iCloud                         | <https://ipcheck.proofpoint.com/>                                                                             | Apple verwendet Proofpoint für IP-Reputation |
| Proofpoint                          | <https://ipcheck.proofpoint.com/>                                                                             | Proofpoint IP-Check und Entfernung           |
| Barracuda Networks                  | <https://www.barracudacentral.org/lookups/lookup-reputation>                                                  | Barracuda Reputation-Check und Entfernung    |
| Cloudmark                         | <https://csi.cloudmark.com/en/reset/>                                                                         | Cloudmark CSI Reset-Anfrage                   |
| GoDaddy/SecureServer                | <https://unblock.secureserver.net>                                                                            | GoDaddy IP-Entfernungsanfrageformular        |
| Comcast/Xfinity                   | <https://spa.xfinity.com/report>                                                                              | Comcast IP-Entfernungsanfrage                 |
| Charter/Spectrum                  | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                   | Kontaktieren Sie Spectrum-Support für Entfernung |
| AT&T                                | `abuse_rbl@abuse-att.net`                                                                                     | E-Mail für Entfernungsanfrage                 |
| Cox Communications                | `unblock.request@cox.net`                                                                                      | E-Mail für Entfernungsanfrage                 |
| CenturyLink/Lumen                 | `abuse@centurylink.com`                                                                                        | Verwendet Cloudfilter                         |
| Windstream                        | `abuse@windstream.net`                                                                                         | E-Mail für Entfernungsanfrage                 |
| t-online.de (Deutschland)         | `tobr@rx.t-online.de`                                                                                          | E-Mail für Entfernungsanfrage                 |
| Orange Frankreich                 | <https://postmaster.orange.fr/>                                                                               | Kontaktformular oder E-Mail `abuse@orange.fr`|
| GMX                               | <https://postmaster.gmx.net/en/contact>                                                                       | GMX Postmaster-Kontaktformular                 |
| Mail.ru                           | <https://postmaster.mail.ru/>                                                                                 | Mail.ru Postmaster-Portal                      |
| Yandex                            | <https://postmaster.yandex.ru/>                                                                               | Yandex Postmaster-Portal                       |
| QQ Mail (Tencent)                 | <https://open.mail.qq.com/>                                                                                   | QQ Mail Whitelist-Antrag (Chinesisch)         |
| Netease (163.com)                 | <https://mail.163.com/postmaster/>                                                                            | Netease Postmaster-Portal                      |
| Alibaba/Aliyun/HiChina            | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                          | Kontakt über Alibaba Cloud-Konsole             |
| Amazon SES                       | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                                  | AWS SES-Konsole > Blacklist-Entfernung        |
| SendGrid                        | <https://support.sendgrid.com/>                                                                               | Kontakt SendGrid-Support                       |
| Mimecast                        | <https://community.mimecast.com/>                                                                             | Verwendet Drittanbieter-RBLs – kontaktieren Sie spezifische RBL |
| Fastmail                        | <https://www.fastmail.com/support/>                                                                           | Kontakt Fastmail-Support                       |
| Zoho                            | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address>    | Kontakt Zoho-Support                           |
| ProtonMail                      | <https://proton.me/support/contact>                                                                           | Kontakt Proton-Support                         |
| Tutanota                       | <https://tutanota.com/support>                                                                                 | Kontakt Tutanota-Support                       |
| Hushmail                       | <https://www.hushmail.com/support/>                                                                           | Kontakt Hushmail-Support                       |
| Mailbox.org                    | <https://mailbox.org/en/support>                                                                              | Kontakt Mailbox.org-Support                    |
| Posteo                         | <https://posteo.de/en/site/contact>                                                                           | Kontakt Posteo-Support                         |
| DuckDuckGo Email              | <https://duckduckgo.com/email/support>                                                                        | Kontakt DuckDuckGo-Support                     |
| Sonic.net                     | <https://www.sonic.com/support>                                                                               | Kontakt Sonic-Support                          |
| Telus                         | <https://www.telus.com/en/support>                                                                            | Kontakt Telus-Support                          |
| Vodafone Deutschland          | <https://www.vodafone.de/hilfe/>                                                                              | Kontakt Vodafone-Support                       |
| Xtra (Spark NZ)               | <https://www.spark.co.nz/help/>                                                                               | Kontakt Spark NZ-Support                       |
| UOL/BOL (Brasilien)           | <https://ajuda.uol.com.br/>                                                                                   | Kontakt UOL-Support (Portugiesisch)            |
| Libero (Italien)              | <https://aiuto.libero.it/>                                                                                     | Kontakt Libero-Support (Italienisch)           |
| Telenet (Belgien)             | <https://www2.telenet.be/en/support/>                                                                         | Kontakt Telenet-Support                        |
| Facebook/WhatsApp             | <https://www.facebook.com/business/help>                                                                       | Kontakt Facebook Business-Support             |
| LinkedIn                     | <https://www.linkedin.com/help/linkedin>                                                                       | Kontakt LinkedIn-Support                       |
| Groups.io                    | <https://groups.io/helpcenter>                                                                                 | Kontakt Groups.io-Support                      |
| Earthlink/Vade Secure        | <https://sendertool.vadesecure.com/en/>                                                                        | Vade Secure Sender Tool                        |
| Cloudflare Email Security    | <https://www.cloudflare.com/products/zero-trust/email-security/>                                              | Kontakt Cloudflare-Support                     |
| Hornetsecurity/Expurgate     | <https://www.hornetsecurity.com/>                                                                              | Kontakt Hornetsecurity-Support                 |
| SpamExperts/Antispamcloud    | <https://www.spamexperts.com/>                                                                                 | Kontakt über Hosting-Provider                  |
| Mail2World                  | <https://www.mail2world.com/support/>                                                                           | Kontakt Mail2World-Support                      |
> \[!TIP]
> Beginnen Sie mit einem geringen Volumen an hochwertigen E-Mails, um einen positiven Ruf aufzubauen, bevor Sie größere Mengen versenden.

> \[!IMPORTANT]
> Wenn Ihre Domain auf einer Blacklist steht, hat jede Blacklist ihren eigenen Entfernungsprozess. Überprüfen Sie deren Websites auf Anweisungen.

> \[!TIP]
> Wenn Sie zusätzliche Hilfe benötigen oder feststellen, dass wir fälschlicherweise von einem bestimmten E-Mail-Dienstanbieter als Spam gelistet werden, dann <a href="/help">kontaktieren Sie uns</a> bitte.

### Was soll ich tun, wenn ich Spam-E-Mails erhalte {#what-should-i-do-if-i-receive-spam-emails}

Sie sollten sich von der Mailingliste abmelden (wenn möglich) und den Absender blockieren.

Bitte melden Sie die Nachricht nicht als Spam, sondern leiten Sie sie stattdessen an unser manuell kuratiertes und datenschutzorientiertes Missbrauchspräventionssystem weiter.

**Die E-Mail-Adresse, an die Spam weitergeleitet werden soll, lautet:** <abuse@forwardemail.net>

### Warum werden meine Test-E-Mails, die ich mir selbst in Gmail sende, als „verdächtig“ angezeigt {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Wenn Sie diese Fehlermeldung in Gmail sehen, wenn Sie sich selbst einen Test senden, oder wenn eine Person, mit der Sie über Ihr Alias E-Mails austauschen, zum ersten Mal eine E-Mail von Ihnen sieht, dann **machen Sie sich bitte keine Sorgen** – dies ist eine integrierte Sicherheitsfunktion von Gmail.

Sie können einfach auf „Sieht sicher aus“ klicken. Wenn Sie beispielsweise eine Testnachricht mit der Funktion „Senden als“ (send mail as) an jemand anderen senden, wird diese Meldung dort nicht angezeigt.

Wenn sie diese Meldung jedoch sehen, liegt das daran, dass sie normalerweise Ihre E-Mails von <john@gmail.com> und nicht von <john@customdomain.com> (nur ein Beispiel) gewohnt sind. Gmail warnt die Nutzer nur, um sicherzugehen, dass alles sicher ist. Es gibt keine Umgehungslösung.

### Kann ich das „via forwardemail dot net“ in Gmail entfernen {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Dieses Thema hängt mit einem [bekannten Problem in Gmail zusammen, bei dem zusätzliche Informationen neben dem Namen des Absenders angezeigt werden](https://support.google.com/mail/answer/1311182).

Seit Mai 2023 unterstützen wir das Versenden von E-Mails per SMTP als Add-on für alle zahlenden Nutzer – was bedeutet, dass Sie das <span class="notranslate">via forwardemail dot net</span> in Gmail entfernen können.

Beachten Sie, dass dieses FAQ-Thema speziell für diejenigen gilt, die die Funktion [Wie man E-Mails mit Gmail als Absender sendet](#how-to-send-mail-as-using-gmail) verwenden.

Bitte sehen Sie den Abschnitt [Unterstützen Sie das Versenden von E-Mails per SMTP](#do-you-support-sending-email-with-smtp) für Konfigurationsanweisungen ein.


## Datenverwaltung {#data-management}

### Wo befinden sich Ihre Server {#where-are-your-servers-located}

> \[!TIP]
> Wir werden bald unseren EU-Datencenter-Standort unter [forwardemail.eu](https://forwardemail.eu) ankündigen. Abonnieren Sie die Diskussion unter <https://github.com/orgs/forwardemail/discussions/336> für Updates.

Unsere Server befinden sich hauptsächlich in Denver, Colorado – siehe <https://forwardemail.net/ips> für unsere vollständige Liste der IP-Adressen.

Informationen zu unseren Unterauftragsverarbeitern finden Sie auf unseren [GDPR](/gdpr), [DPA](/dpa) und [Datenschutz](/privacy) Seiten.

### Wie exportiere und sichere ich mein Postfach {#how-do-i-export-and-backup-my-mailbox}

Sie können jederzeit Ihre Postfächer als [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) oder verschlüsselte [SQLite](https://en.wikipedia.org/wiki/SQLite) Formate exportieren.

Gehen Sie zu <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase <i class="fa fa-angle-right"></i> Backup herunterladen und wählen Sie Ihr bevorzugtes Exportformat aus.

Sie erhalten eine E-Mail mit einem Link zum Herunterladen des Exports, sobald dieser abgeschlossen ist.

Beachten Sie, dass dieser Download-Link aus Sicherheitsgründen nach 4 Stunden abläuft.

Wenn Sie Ihre exportierten EML- oder Mbox-Formate inspizieren möchten, können diese Open-Source-Tools nützlich sein:

| Name            | Format | Plattform    | GitHub URL                                          |
| --------------- | :----: | ----------- | --------------------------------------------------- |
| MBox Viewer     |  Mbox  | Windows     | <https://github.com/eneam/mboxviewer>               |
| mbox-web-viewer |  Mbox  | Alle Plattformen | <https://github.com/PHMRanger/mbox-web-viewer>      |
| EmlReader       |   EML  | Windows     | <https://github.com/ayamadori/EmlReader>            |
| Email viewer    |   EML  | VSCode      | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader      |   EML  | Alle Plattformen | <https://github.com/s0ph1e/eml-reader>              |
Zusätzlich, falls Sie eine Mbox-Datei in eine EML-Datei konvertieren müssen, können Sie <https://github.com/noelmartinon/mboxzilla> verwenden.

### Wie importiere und migriere ich mein bestehendes Postfach {#how-do-i-import-and-migrate-my-existing-mailbox}

Sie können Ihre E-Mails ganz einfach zu Forward Email importieren (z. B. mit [Thunderbird](https://www.thunderbird.net)) mit den folgenden Anweisungen:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Sie müssen alle folgenden Schritte befolgen, um Ihre bestehenden E-Mails zu importieren.
  </span>
</div>

1. Exportieren Sie Ihre E-Mails von Ihrem bestehenden E-Mail-Anbieter:

   | E-Mail-Anbieter | Exportformat                                  | Exportanweisungen                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail          | MBOX                                           | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook        | PST                                            | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Tipp:</strong> <span>Wenn Sie Outlook verwenden (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST-Exportformat</a>), können Sie einfach den Anweisungen unter "Andere" unten folgen. Wir haben jedoch unten Links bereitgestellt, um PST basierend auf Ihrem Betriebssystem in MBOX/EML zu konvertieren:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba für Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst für Windows cygwin</a> – (z. B. <code>readpst -u -o $OUT_DIR $IN_DIR</code>, wobei <code>$OUT_DIR</code> und <code>$IN_DIR</code> durch die Pfade des Ausgabe- bzw. Eingabeverzeichnisses ersetzt werden).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst für Ubuntu/Linux</a> – (z. B. <code>sudo apt-get install readpst</code> und dann <code>readpst -u -o $OUT_DIR $IN_DIR</code>, wobei <code>$OUT_DIR</code> und <code>$IN_DIR</code> durch die Pfade des Ausgabe- bzw. Eingabeverzeichnisses ersetzt werden).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst für macOS (über brew)</a> – (z. B. <code>brew install libpst</code> und dann <code>readpst -u -o $OUT_DIR $IN_DIR</code>, wobei <code>$OUT_DIR</code> und <code>$IN_DIR</code> durch die Pfade des Ausgabe- bzw. Eingabeverzeichnisses ersetzt werden).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter für Windows (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail     | MBOX                                           | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail       | EML                                            | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail    | MBOX/EML                                       | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota       | EML                                            | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi          | EML                                            | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho           | EML                                            | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | Andere        | [Verwenden Sie Thunderbird](https://www.thunderbird.net) | Richten Sie Ihr bestehendes E-Mail-Konto in Thunderbird ein und verwenden Sie dann das Plugin [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/), um Ihre E-Mails zu exportieren und zu importieren.  **Möglicherweise können Sie E-Mails auch einfach kopieren/einfügen oder per Drag & Drop zwischen Konten verschieben.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. Laden Sie [Thunderbird](https://www.thunderbird.net) herunter, installieren Sie es und öffnen Sie es.

3. Erstellen Sie ein neues Konto mit der vollständigen E-Mail-Adresse Ihres Alias (z. B. <code><you@yourdomain.com></code>) und Ihrem generierten Passwort.  <strong>Wenn Sie noch kein generiertes Passwort haben, dann <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">sehen Sie unsere Einrichtungshinweise ein</a></strong>.

4. Laden Sie das Thunderbird-Plugin [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) herunter und installieren Sie es.

5. Erstellen Sie in Thunderbird einen neuen lokalen Ordner, klicken Sie dann mit der rechten Maustaste darauf → wählen Sie die Option `ImportExportTools NG` → wählen Sie `Import mbox file` (für das MBOX-Exportformat) – oder – `Import messages` / `Import all messages from a directory` (für das EML-Exportformat).

6. Ziehen Sie Nachrichten per Drag & Drop vom lokalen Ordner in einen neuen (oder bestehenden) IMAP-Ordner in Thunderbird, in den Sie Nachrichten in unserem IMAP-Speicher hochladen möchten.  Dadurch wird sichergestellt, dass sie online mit unserem SQLite-verschlüsselten Speicher gesichert werden.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tipp:
     </strong>
     <span>
       Wenn Sie unsicher sind, wie Sie in Thunderbird importieren, können Sie sich an den offiziellen Anleitungen unter <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> und <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a> orientieren.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Nachdem Sie den Export- und Importvorgang abgeschlossen haben, möchten Sie möglicherweise auch die Weiterleitung in Ihrem bestehenden E-Mail-Konto aktivieren und einen Autoresponder einrichten, um Absender darüber zu informieren, dass Sie eine neue E-Mail-Adresse haben (z. B. wenn Sie zuvor Gmail verwendet haben und jetzt eine E-Mail mit Ihrer eigenen Domain nutzen).
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Herzlichen Glückwunsch!
    </strong>
    <span>
      Sie haben alle Schritte erfolgreich abgeschlossen.
    </span>
  </div>
</div>

### Wie verwende ich meinen eigenen S3-kompatiblen Speicher für Backups {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

Nutzer mit kostenpflichtigem Tarif können ihren eigenen [S3](https://en.wikipedia.org/wiki/Amazon_S3)-kompatiblen Speicheranbieter pro Domain für IMAP/SQLite-Backups konfigurieren.  Das bedeutet, dass Ihre verschlüsselten Postfach-Backups auf Ihrer eigenen Infrastruktur gespeichert werden können, anstelle von (oder zusätzlich zu) unserem Standardspeicher.

Unterstützte Anbieter sind unter anderem [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) und jeder andere S3-kompatible Dienst.

#### Einrichtung {#setup}

1. Erstellen Sie einen **privaten** Bucket bei Ihrem S3-kompatiblen Anbieter. Der Bucket darf nicht öffentlich zugänglich sein.
2. Erstellen Sie Zugangsdaten (Access Key ID und Secret Access Key) mit Lese-/Schreibrechten für den Bucket.
3. Gehen Sie zu <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Erweiterte Einstellungen <i class="fa fa-angle-right"></i> Benutzerdefinierter S3-kompatibler Speicher.
4. Aktivieren Sie **"Benutzerdefinierten S3-kompatiblen Speicher aktivieren"** und füllen Sie Ihre Endpunkt-URL, Access Key ID, Secret Access Key, Region und Bucket-Namen aus.
5. Klicken Sie auf **"Verbindung testen"**, um Ihre Zugangsdaten, den Bucket-Zugriff und die Schreibrechte zu überprüfen.
6. Klicken Sie auf **"Speichern"**, um die Einstellungen zu übernehmen.

#### Wie Backups funktionieren {#how-backups-work}

Backups werden automatisch für jeden verbundenen IMAP-Alias ausgelöst. Der IMAP-Server prüft alle aktiven Verbindungen einmal pro Stunde und startet für jeden verbundenen Alias ein Backup. Ein Redis-basierter Lock verhindert, dass doppelte Backups innerhalb von 30 Minuten ausgeführt werden, und das eigentliche Backup wird übersprungen, wenn innerhalb der letzten 24 Stunden bereits ein erfolgreiches Backup durchgeführt wurde (es sei denn, das Backup wurde explizit von einem Nutzer zum Download angefordert).
Backups können auch manuell ausgelöst werden, indem im Dashboard für jeden Alias auf **"Backup herunterladen"** geklickt wird. Manuelle Backups werden immer ausgeführt, unabhängig vom 24-Stunden-Fenster.

Der Backup-Prozess funktioniert wie folgt:

1. Die SQLite-Datenbank wird mit `VACUUM INTO` kopiert, was einen konsistenten Snapshot erstellt, ohne aktive Verbindungen zu unterbrechen, und die Datenbankverschlüsselung beibehält.
2. Die Backup-Datei wird durch Öffnen überprüft, um zu bestätigen, dass die Verschlüsselung weiterhin gültig ist.
3. Ein SHA-256-Hash wird berechnet und mit dem vorhandenen Backup im Speicher verglichen. Wenn der Hash übereinstimmt, wird der Upload übersprungen (keine Änderungen seit dem letzten Backup).
4. Das Backup wird mit Multipart-Upload über die [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage) Bibliothek zu S3 hochgeladen.
5. Eine signierte Download-URL (gültig für 4 Stunden) wird generiert und per E-Mail an den Benutzer gesendet.

#### Backup-Formate {#backup-formats}

Drei Backup-Formate werden unterstützt:

| Format   | Erweiterung | Beschreibung                                                                 |
| -------- | ----------- | --------------------------------------------------------------------------- |
| `sqlite` | `.sqlite`   | Rohes verschlüsseltes SQLite-Datenbank-Snapshot (Standard für automatische IMAP-Backups) |
| `mbox`   | `.zip`      | Passwortgeschütztes ZIP mit Postfach im mbox-Format                         |
| `eml`    | `.zip`      | Passwortgeschütztes ZIP mit einzelnen `.eml` Dateien pro Nachricht          |

> **Tipp:** Wenn Sie `.sqlite` Backup-Dateien haben und diese lokal in `.eml` Dateien konvertieren möchten, verwenden Sie unser eigenständiges CLI-Tool **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**. Es funktioniert unter Windows, Linux und macOS und benötigt keine Netzwerkverbindung.

#### Dateibenennung und Schlüsselstruktur {#file-naming-and-key-structure}

Bei Verwendung von **benutzerdefiniertem S3-Speicher** werden Backup-Dateien mit einem [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) Zeitstempel-Präfix gespeichert, sodass jedes Backup als separates Objekt erhalten bleibt. So erhalten Sie eine vollständige Backup-Historie in Ihrem eigenen Bucket.

Das Schlüssel-Format lautet:

```
{ISO 8601 timestamp}-{alias_id}.{extension}
```

Zum Beispiel:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

Die `alias_id` ist die MongoDB ObjectId des Alias. Sie finden sie auf der Alias-Einstellungsseite oder über die API.

Bei Verwendung des **Standard-(System-)Speichers** ist der Schlüssel flach (z.B. `65a31c53c36b75ed685f3fda.sqlite`) und jedes Backup überschreibt das vorherige.

> **Hinweis:** Da benutzerdefinierter S3-Speicher alle Backup-Versionen behält, wächst der Speicherverbrauch mit der Zeit. Wir empfehlen, [Lifecycle-Regeln](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) für Ihren Bucket zu konfigurieren, um alte Backups automatisch zu löschen (z.B. Objekte, die älter als 30 oder 90 Tage sind).

#### Datenhoheit und Löschrichtlinie {#data-ownership-and-deletion-policy}

Ihr benutzerdefinierter S3-Bucket steht vollständig unter Ihrer Kontrolle. Wir **löschen oder verändern niemals** Dateien in Ihrem benutzerdefinierten S3-Bucket – weder beim Löschen eines Alias, noch beim Entfernen einer Domain, noch während irgendwelcher Aufräumaktionen. Wir schreiben nur neue Backup-Dateien in Ihren Bucket.

Das bedeutet:

* **Alias-Löschung** — Wenn Sie einen Alias löschen, entfernen wir das Backup nur aus unserem Standard-Systemspeicher. Alle zuvor in Ihren benutzerdefinierten S3-Bucket geschriebenen Backups bleiben unberührt.
* **Domain-Entfernung** — Das Entfernen einer Domain hat keine Auswirkungen auf Dateien in Ihrem benutzerdefinierten Bucket.
* **Aufbewahrungsverwaltung** — Sie sind verantwortlich für die Verwaltung des Speichers in Ihrem eigenen Bucket, einschließlich der Konfiguration von Lifecycle-Regeln zum Löschen alter Backups.

Wenn Sie den benutzerdefinierten S3-Speicher deaktivieren oder zurück zu unserem Standardspeicher wechseln, bleiben vorhandene Dateien in Ihrem Bucket erhalten. Zukünftige Backups werden stattdessen einfach in unserem Standardspeicher abgelegt.

#### Sicherheit {#security}

* Ihre Access Key ID und Secret Access Key werden **im Ruhezustand verschlüsselt** mit [AES-256-GCM](https://de.wikipedia.org/wiki/Galois/Counter_Mode) gespeichert. Sie werden nur zur Laufzeit bei Backup-Operationen entschlüsselt.
* Wir validieren automatisch, dass Ihr Bucket **nicht öffentlich zugänglich** ist. Wenn ein öffentlicher Bucket erkannt wird, wird die Konfiguration beim Speichern abgelehnt. Wenn während des Backups öffentlicher Zugriff festgestellt wird, greifen wir auf unseren Standardspeicher zurück und benachrichtigen alle Domain-Administratoren per E-Mail.
* Die Zugangsdaten werden beim Speichern über einen [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html) Aufruf validiert, um sicherzustellen, dass der Bucket existiert und die Zugangsdaten korrekt sind. Bei Validierungsfehlern wird der benutzerdefinierte S3-Speicher automatisch deaktiviert.
* Jede Backup-Datei enthält einen SHA-256-Hash in ihren S3-Metadaten, der verwendet wird, um unveränderte Datenbanken zu erkennen und redundante Uploads zu überspringen.
#### Fehlerbenachrichtigungen {#error-notifications}

Wenn ein Backup bei der Verwendung Ihres benutzerdefinierten S3-Speichers fehlschlägt (z. B. aufgrund abgelaufener Anmeldeinformationen oder eines Verbindungsproblems), werden alle Domain-Administratoren per E-Mail benachrichtigt. Diese Benachrichtigungen werden auf einmal alle 6 Stunden begrenzt, um doppelte Warnungen zu vermeiden. Wenn Ihr Bucket zum Zeitpunkt des Backups als öffentlich zugänglich erkannt wird, werden die Administratoren einmal täglich benachrichtigt.

#### API {#api}

Sie können benutzerdefinierten S3-Speicher auch über die API konfigurieren:

```sh
curl -X PUT https://api.forwardemail.net/v1/domains/example.com \
  -u API_TOKEN: \
  -d has_custom_s3=true \
  -d s3_endpoint=https://s3.us-east-1.amazonaws.com \
  -d s3_access_key_id=YOUR_ACCESS_KEY_ID \
  -d s3_secret_access_key=YOUR_SECRET_ACCESS_KEY \
  -d s3_region=us-east-1 \
  -d s3_bucket=my-email-backups
```

Um die Verbindung über die API zu testen:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### Wie konvertiere ich SQLite-Backups in EML-Dateien {#how-do-i-convert-sqlite-backups-to-eml-files}

Wenn Sie SQLite-Backups herunterladen oder speichern (entweder aus unserem Standardspeicher oder Ihrem eigenen [benutzerdefinierten S3-Bucket](#how-do-i-use-my-own-s3-compatible-storage-for-backups)), können Sie diese mit unserem eigenständigen CLI-Tool **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)** in Standard-`.eml`-Dateien konvertieren. EML-Dateien können mit jedem E-Mail-Client ([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail) usw.) geöffnet oder in andere Mailserver importiert werden.

#### Installation {#installation-1}

Sie können entweder eine vorgefertigte Binärdatei herunterladen (kein [Node.js](https://github.com/nodejs/node) erforderlich) oder sie direkt mit [Node.js](https://github.com/nodejs/node) ausführen:

**Vorgefertigte Binärdateien** — Laden Sie die neueste Version für Ihre Plattform von [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases) herunter:

| Plattform | Architektur  | Datei                                |
| -------- | ------------- | ------------------------------------ |
| Linux    | x64           | `convert-sqlite-to-eml-linux-x64`    |
| Linux    | arm64         | `convert-sqlite-to-eml-linux-arm64`  |
| macOS    | Apple Silicon | `convert-sqlite-to-eml-darwin-arm64` |
| Windows  | x64           | `convert-sqlite-to-eml-win-x64.exe`  |

> **macOS-Benutzer:** Nach dem Herunterladen müssen Sie möglicherweise das Quarantäne-Attribut entfernen, bevor Sie die Binärdatei ausführen:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (Ersetzen Sie `./convert-sqlite-to-eml-darwin-arm64` durch den tatsächlichen Pfad zur heruntergeladenen Datei.)

> **Linux-Benutzer:** Nach dem Herunterladen müssen Sie möglicherweise die Binärdatei ausführbar machen:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (Ersetzen Sie `./convert-sqlite-to-eml-linux-x64` durch den tatsächlichen Pfad zur heruntergeladenen Datei.)

**Aus dem Quellcode** (erfordert [Node.js](https://github.com/nodejs/node) >= 18):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### Verwendung {#usage}

Das Tool unterstützt sowohl interaktive als auch nicht-interaktive Modi.

**Interaktiver Modus** — ohne Argumente ausführen, und Sie werden zu allen Eingaben aufgefordert:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - SQLite-Backup in EML konvertieren
  ================================================

  Pfad zur SQLite-Backup-Datei: /path/to/backup.sqlite
  IMAP/Alias-Passwort: ********
  Ausgabe ZIP-Pfad [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**Nicht-interaktiver Modus** — Argumente über Kommandozeilen-Flags für Skripting und Automatisierung übergeben:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "your-imap-password" \
  --output /path/to/output.zip
```

| Flag                | Beschreibung                                                                 |
| ------------------- | --------------------------------------------------------------------------- |
| `--path <path>`     | Pfad zur verschlüsselten SQLite-Backup-Datei                               |
| `--password <pass>` | IMAP/Alias-Passwort zur Entschlüsselung                                    |
| `--output <path>`   | Ausgabepfad für die ZIP-Datei (Standard: automatisch generiert mit ISO 8601-Zeitstempel) |
| `--help`            | Hilfemeldung anzeigen                                                      |
#### Ausgabeformat {#output-format}

Das Tool erzeugt ein passwortgeschütztes ZIP-Archiv (AES-256 verschlüsselt), das Folgendes enthält:

```
README.txt
INBOX/
  <message-id-1>.eml
  <message-id-2>.eml
Sent/
  <message-id-3>.eml
Drafts/
  <message-id-4>.eml
```

EML-Dateien sind nach Postfachordnern organisiert. Das ZIP-Passwort ist dasselbe wie Ihr IMAP-/Alias-Passwort. Jede `.eml`-Datei ist eine standardmäßige [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) E-Mail-Nachricht mit vollständigen Headern, Textkörper und Anhängen, die aus der SQLite-Datenbank rekonstruiert wurden.

#### So funktioniert es {#how-it-works}

1. Öffnet die verschlüsselte SQLite-Datenbank mit Ihrem IMAP-/Alias-Passwort (unterstützt sowohl [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) als auch [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) Verschlüsselungen).
2. Liest die Tabelle Mailboxes, um die Ordnerstruktur zu ermitteln.
3. Dekodiert für jede Nachricht den mimeTree (als [Brotli](https://github.com/google/brotli)-komprimiertes JSON gespeichert) aus der Tabelle Messages.
4. Rekonstruiert die vollständige EML, indem der MIME-Baum durchlaufen und die Anhänge aus der Tabelle Attachments abgerufen werden.
5. Verpackt alles in ein passwortgeschütztes ZIP-Archiv mit [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted).

### Unterstützen Sie Self-Hosting? {#do-you-support-self-hosting}

Ja, seit März 2025 unterstützen wir eine Self-Hosting-Option. Lesen Sie den Blog [hier](https://forwardemail.net/blog/docs/self-hosted-solution). Schauen Sie sich die [Self-Hosting-Anleitung](https://forwardemail.net/self-hosted) an, um loszulegen. Und für diejenigen, die eine detailliertere Schritt-für-Schritt-Version wünschen, siehe unsere [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) oder [Debian](https://forwardemail.net/guides/selfhosted-on-debian) basierten Anleitungen.


## E-Mail-Konfiguration {#email-configuration}

### Wie fange ich an und richte die E-Mail-Weiterleitung ein? {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Geschätzte Einrichtungszeit:</strong>
  <span>Weniger als 10 Minuten</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Erste Schritte:
  </strong>
  <span>
    Lesen Sie die unten aufgeführten Schritte eins bis acht sorgfältig durch und befolgen Sie diese. Ersetzen Sie unbedingt die E-Mail-Adresse <code>user@gmail.com</code> durch die E-Mail-Adresse, an die Sie E-Mails weiterleiten möchten (falls diese nicht bereits korrekt ist). Ebenso ersetzen Sie <code>example.com</code> durch Ihren eigenen Domainnamen (falls dieser nicht bereits korrekt ist).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">Wenn Sie Ihre Domain bereits irgendwo registriert haben, müssen Sie diesen Schritt komplett überspringen und direkt zu Schritt zwei gehen! Andernfalls können Sie <a href="/domain-registration" rel="noopener noreferrer">hier klicken, um Ihre Domain zu registrieren</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  Erinnern Sie sich, wo Sie Ihre Domain registriert haben? Sobald Sie sich daran erinnern, folgen Sie den untenstehenden Anweisungen:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Sie müssen einen neuen Tab öffnen und sich bei Ihrem Domain-Registrar anmelden. Sie können einfach unten auf Ihren "Registrar" klicken, um dies automatisch zu tun. In diesem neuen Tab müssen Sie zur DNS-Verwaltungsseite Ihres Registrars navigieren – und wir haben die Schritt-für-Schritt-Navigation unten in der Spalte "Schritte zur Konfiguration" bereitgestellt. Sobald Sie diese Seite im neuen Tab geöffnet haben, können Sie zu diesem Tab zurückkehren und mit Schritt drei fortfahren.
    <strong class="font-weight-bold">Schließen Sie den geöffneten Tab noch nicht; Sie werden ihn für zukünftige Schritte benötigen!</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Registrar</th>
      <th>Schritte zur Konfiguration</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>Anmelden <i class="fa fa-angle-right"></i> Domain Center <i class="fa fa-angle-right"></i> (Domain auswählen) <i class="fa fa-angle-right"></i> DNS-Einstellungen bearbeiten</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Anmelden <i class="fa fa-angle-right"></i> Hosted Zones <i class="fa fa-angle-right"></i> (Domain auswählen)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Anmelden <i class="fa fa-angle-right"></i> My Servers <i class="fa fa-angle-right"></i> Domain Management <i class="fa fa-angle-right"></i> DNS Manager</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>FÜR ROCK: Anmelden <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Klicken Sie auf das ▼-Symbol neben Verwalten) <i class="fa fa-angle-right"></i> DNS
      <br />
      FÜR LEGACY: Anmelden <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Zone editor <i class="fa fa-angle-right"></i> (Domain auswählen)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Anmelden <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Anmelden <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Domain auswählen)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Anmelden <i class="fa fa-angle-right"></i> (Domain auswählen)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Verwalten</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Anmelden <i class="fa fa-angle-right"></i> Networking <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Domain auswählen) <i class="fa fa-angle-right"></i> Mehr <i class="fa fa-angle-right"></i> Domain verwalten</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>Anmelden <i class="fa fa-angle-right"></i> In der Kartenansicht auf Verwalten bei Ihrer Domain klicken <i class="fa fa-angle-right"></i> In der Listenansicht auf das Zahnrad-Symbol klicken <i class="fa fa-angle-right"></i> DNS & Nameserver <i class="fa fa-angle-right"></i> DNS-Einträge</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Ansehen</a>
      </td>
      <td>Anmelden <i class="fa fa-angle-right"></i> (Domain auswählen) <i class="fa fa-angle-right"></i> Verwalten <i class="fa fa-angle-right"></i> (Zahnrad-Symbol klicken) <i class="fa fa-angle-right"></i> Im linken Menü auf DNS &amp; Nameserver klicken</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Anmelden <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Domains verwalten <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Anmelden <i class="fa fa-angle-right"></i> Übersicht <i class="fa fa-angle-right"></i> Verwalten <i class="fa fa-angle-right"></i> Einfacher Editor <i class="fa fa-angle-right"></i> Einträge</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Anmelden <i class="fa fa-angle-right"></i> (Domain auswählen) <i class="fa fa-angle-right"></i> Verwaltung <i class="fa fa-angle-right"></i> Zone bearbeiten</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Ansehen</a>
      </td>
      <td>Anmelden <i class="fa fa-angle-right"></i> Meine Domains verwalten <i class="fa fa-angle-right"></i> (Domain auswählen) <i class="fa fa-angle-right"></i> DNS verwalten</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Ansehen</a>
      </td>
      <td>Anmelden <i class="fa fa-angle-right"></i> (Domain auswählen) <i class="fa fa-angle-right"></i> DNS konfigurieren</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Ansehen</a>
      </td>
      <td>Anmelden <i class="fa fa-angle-right"></i> Domainliste <i class="fa fa-angle-right"></i> (Domain auswählen) <i class="fa fa-angle-right"></i> Verwalten <i class="fa fa-angle-right"></i> Erweiterte DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Anmelden <i class="fa fa-angle-right"></i> (Domain auswählen) <i class="fa fa-angle-right"></i> Netlify DNS einrichten</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Anmelden <i class="fa fa-angle-right"></i> Account Manager <i class="fa fa-angle-right"></i> Meine Domainnamen <i class="fa fa-angle-right"></i> (Domain auswählen) <i class="fa fa-angle-right"></i> Verwalten <i class="fa fa-angle-right"></i> Domain-Ziel ändern <i class="fa fa-angle-right"></i> Erweiterte DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Ansehen</a>
      </td>
      <td>Anmelden <i class="fa fa-angle-right"></i> Verwaltete Domains <i class="fa fa-angle-right"></i> (Domain auswählen) <i class="fa fa-angle-right"></i> DNS-Einstellungen</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>Anmelden <i class="fa fa-angle-right"></i> Hauptmenü <i class="fa fa-angle-right"></i> Einstellungen <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Domain auswählen) <i class="fa fa-angle-right"></i>
Erweiterte Einstellungen <i class="fa fa-angle-right"></i> Benutzerdefinierte Einträge</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>Verwendung der "now" CLI <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Anmelden <i class="fa fa-angle-right"></i> Domains-Seite <i class="fa fa-angle-right"></i> (Domain auswählen) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Anmelden <i class="fa fa-angle-right"></i> Domains-Seite <i class="fa fa-angle-right"></i> (Klicken Sie auf das <i class="fa fa-ellipsis-h"></i>-Symbol) <i class="fa fa-angle-right"></i> Wählen Sie DNS-Einträge verwalten</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Anmelden <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Meine Domains</td>
    </tr>
    <tr>
      <td>Andere</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Wichtig:</strong> Sehen Sie Ihren Registrar hier nicht aufgelistet? Suchen Sie einfach im Internet nach "wie ändere ich DNS-Einträge bei $REGISTRAR" (ersetzen Sie $REGISTRAR durch den Namen Ihres Registrars – z. B. "wie ändere ich DNS-Einträge bei GoDaddy", wenn Sie GoDaddy verwenden).</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Verwenden Sie die DNS-Verwaltungsseite Ihres Registrars (den anderen geöffneten Tab), um die folgenden "MX"-Einträge zu setzen:
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Beachten Sie, dass KEINE anderen MX-Einträge gesetzt sein dürfen. Beide unten gezeigten Einträge MÜSSEN vorhanden sein. Stellen Sie sicher, dass keine Tippfehler vorliegen und dass sowohl mx1 als auch mx2 korrekt geschrieben sind. Falls bereits MX-Einträge existierten, löschen Sie diese bitte vollständig.
    Der "TTL"-Wert muss nicht 3600 sein, er kann bei Bedarf auch niedriger oder höher sein.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Priorität</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx2.forwardemail.net</code></td>
    </tr>
  </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Verwenden Sie die DNS-Verwaltungsseite Ihres Registrars (den anderen geöffneten Tab), um den/die folgenden <strong class="notranslate">TXT</strong>-Eintrag/-Einträge zu setzen:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Wenn Sie einen kostenpflichtigen Plan nutzen, müssen Sie diesen Schritt vollständig überspringen und direkt zu Schritt fünf gehen! Wenn Sie keinen kostenpflichtigen Plan haben, sind Ihre weitergeleiteten Adressen öffentlich durchsuchbar – gehen Sie zu <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> und upgraden Sie Ihre Domain bei Bedarf auf einen kostenpflichtigen Plan. Wenn Sie mehr über kostenpflichtige Pläne erfahren möchten, besuchen Sie unsere <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Preisseite</a>. Andernfalls können Sie eine oder mehrere Kombinationen aus Option A bis Option F unten auswählen.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option A:
  </strong>
  <span>
    Wenn Sie alle E-Mails von Ihrer Domain weiterleiten (z. B. "all@example.com", "hello@example.com" usw.) an eine bestimmte Adresse "user@gmail.com":
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
  <span>
    Ersetzen Sie die oben in der Spalte "Wert" angegebenen Werte durch Ihre eigene E-Mail-Adresse. Der "TTL"-Wert muss nicht 3600 sein, er kann bei Bedarf auch niedriger oder höher sein. Ein niedrigerer Time-to-Live ("TTL")-Wert sorgt dafür, dass zukünftige Änderungen an Ihren DNS-Einträgen schneller im Internet verbreitet werden – denken Sie daran, wie lange diese im Speicher zwischengespeichert werden (in Sekunden). Mehr Informationen zu <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL bei Wikipedia</a>.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option B:
  </strong>
  <span>
    Wenn Sie nur eine einzelne E-Mail-Adresse weiterleiten müssen (z. B. <code>hello@example.com</code> an <code>user@gmail.com</code>; dies leitet auch automatisch "hello+test@example.com" an "user+test@gmail.com" weiter):
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option C:
  </strong>
  <span>
    Wenn Sie mehrere E-Mails weiterleiten, sollten Sie diese mit einem Komma trennen:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option D:
  </strong>
  <span>
    Sie können eine unbegrenzte Anzahl von Weiterleitungs-E-Mails einrichten – achten Sie nur darauf, nicht mehr als 255 Zeichen in einer einzigen Zeile zu verwenden und jede Zeile mit "forward-email=" zu beginnen. Ein Beispiel finden Sie unten:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option E:
  </strong>
  <span>
    Sie können auch einen Domainnamen in Ihrem <strong class="notranslate">TXT</strong>-Eintrag angeben, um eine globale Alias-Weiterleitung einzurichten (z.B. wird "user@example.com" an "user@example.net" weitergeleitet):
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=example.net</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option F:
  </strong>
  <span>
    Sie können sogar Webhooks als globalen oder individuellen Alias verwenden, um E-Mails weiterzuleiten. Siehe das Beispiel und den vollständigen Abschnitt zu Webhooks mit dem Titel <a href="#do-you-support-webhooks" class="alert-link">Unterstützen Sie Webhooks</a> unten.
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option G:
  </strong>
  <span>
    Sie können sogar reguläre Ausdrücke ("regex") verwenden, um Aliase abzugleichen und für die Behandlung von Ersetzungen, um E-Mails weiterzuleiten. Siehe die Beispiele und den vollständigen Abschnitt zu Regex mit dem Titel <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Unterstützen Sie reguläre Ausdrücke oder Regex</a> weiter unten.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Benötigen Sie erweiterte Regex mit Ersetzung?</strong> Siehe die Beispiele und den vollständigen Abschnitt zu Regex mit dem Titel <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Unterstützen Sie reguläre Ausdrücke oder Regex</a> weiter unten.
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Einfaches Beispiel:</strong> Wenn ich möchte, dass alle E-Mails, die an `linus@example.com` oder `torvalds@example.com` gehen, an `user@gmail.com` weitergeleitet werden:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Catch-all-Weiterleitungsregeln könnten auch als "Durchfallen" beschrieben werden.
    Das bedeutet, dass eingehende E-Mails, die mindestens einer spezifischen Weiterleitungsregel entsprechen, anstelle des Catch-alls verwendet werden.
    Spezifische Regeln umfassen E-Mail-Adressen und reguläre Ausdrücke.
    <br /><br />
    Zum Beispiel:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    E-Mails, die an <code>hello@example.com</code> gesendet werden, werden mit dieser Konfiguration **nicht** an <code>second@gmail.com</code> (Catch-all) weitergeleitet, sondern nur an <code>first@gmail.com</code> zugestellt.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Verwenden Sie die DNS-Verwaltungsseite Ihres Registrars (den anderen Tab, den Sie geöffnet haben), um zusätzlich den folgenden <strong class="notranslate">TXT</strong>-Eintrag zu setzen:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Wenn Sie Gmail (z. B. "Send Mail As") oder G Suite verwenden, müssen Sie <code>include:_spf.google.com</code> an den obigen Wert anhängen, zum Beispiel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
  <span>
    Wenn Sie bereits eine ähnliche Zeile mit "v=spf1" haben, müssen Sie <code>include:spf.forwardemail.net</code> direkt vor allen vorhandenen "include:host.com"-Einträgen und vor dem "-all" in derselben Zeile anhängen, zum Beispiel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Beachten Sie, dass es einen Unterschied zwischen "-all" und "~all" gibt. Das "-" zeigt an, dass die SPF-Prüfung FEHLERHAFT sein soll, wenn sie nicht übereinstimmt, und "~" zeigt an, dass die SPF-Prüfung SOFTFAIL sein soll. Wir empfehlen die Verwendung der "-all"-Methode, um Domainfälschung zu verhindern.
    <br /><br />
    Möglicherweise müssen Sie auch den SPF-Eintrag für den Host einschließen, von dem Sie E-Mails senden (z. B. Outlook).
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">Überprüfen Sie Ihre DNS-Einträge mit unserem Tool "Einträge überprüfen", verfügbar unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Einrichtung.

</li><li class="mb-2 mb-md-3 mb-lg-5">Senden Sie eine Test-E-Mail, um zu bestätigen, dass alles funktioniert. Beachten Sie, dass es einige Zeit dauern kann, bis Ihre DNS-Einträge propagiert sind.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
  <span>
  </span>
    Wenn Sie keine Test-E-Mails erhalten oder eine Test-E-Mail mit dem Hinweis "Seien Sie vorsichtig mit dieser Nachricht" erhalten, sehen Sie die Antworten zu <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Warum erhalte ich meine Test-E-Mails nicht</a> und <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Warum werden meine Test-E-Mails, die ich mir selbst in Gmail sende, als "verdächtig" angezeigt</a>.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Wenn Sie "Senden als" über Gmail verwenden möchten, müssen Sie <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">dieses Video ansehen</a></strong> oder den Schritten unter <a href="#how-to-send-mail-as-using-gmail">Wie man "Senden als" mit Gmail verwendet</a> unten folgen.

</li></ol>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Herzlichen Glückwunsch!
    </strong>
    <span>
      Sie haben alle Schritte erfolgreich abgeschlossen.
    </span>
  </div>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
  <span>
    Optionale Zusatzfunktionen sind unten aufgeführt. Beachten Sie, dass diese Zusatzfunktionen völlig optional sind und möglicherweise nicht notwendig sind. Wir wollten Ihnen zumindest zusätzliche Informationen bereitstellen, falls erforderlich.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Optionale Zusatzfunktion:
  </strong>
  <span>
    Wenn Sie die Funktion <a class="alert-link" href="#how-to-send-mail-as-using-gmail">Wie man "Senden als" mit Gmail verwendet</a> nutzen, möchten Sie sich möglicherweise auf eine Positivliste setzen. Siehe <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">diese Anweisungen von Gmail</a> zu diesem Thema.
  </span>
</div>

### Kann ich mehrere MX-Exchanges und Server für erweitertes Weiterleiten verwenden {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Ja, aber **Sie sollten nur einen MX-Exchange in Ihren DNS-Einträgen haben**.

Versuchen Sie nicht, "Priorität" als Methode zur Konfiguration mehrerer MX-Exchanges zu verwenden.

Stattdessen müssen Sie Ihren bestehenden MX-Exchange so konfigurieren, dass er E-Mails für alle nicht übereinstimmenden Aliase an die Exchanges unseres Dienstes (`mx1.forwardemail.net` und/oder `mx2.forwardemail.net`) weiterleitet.

Wenn Sie Google Workspace verwenden und alle nicht übereinstimmenden Aliase an unseren Dienst weiterleiten möchten, siehe <https://support.google.com/a/answer/6297084>.

Wenn Sie Microsoft 365 (Outlook) verwenden und alle nicht übereinstimmenden Aliase an unseren Dienst weiterleiten möchten, siehe <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> und <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Wie richte ich eine Abwesenheitsnotiz (automatische Antwort bei Abwesenheit) ein {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Gehen Sie zu <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase und erstellen oder bearbeiten Sie den Alias, für den Sie eine Abwesenheitsnotiz konfigurieren möchten.
Sie können ein Startdatum, Enddatum, Betreff und Nachricht konfigurieren und diese jederzeit aktivieren oder deaktivieren:

* Klartext-Betreff und Nachricht werden derzeit unterstützt (wir verwenden intern das `striptags`-Paket, um jegliches HTML zu entfernen).
* Der Betreff ist auf 100 Zeichen begrenzt.
* Die Nachricht ist auf 1000 Zeichen begrenzt.
* Die Einrichtung erfordert eine Outbound-SMTP-Konfiguration (z. B. müssen Sie DKIM-, DMARC- und Return-Path-DNS-Einträge einrichten).
  * Gehen Sie zu <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Einstellungen <i class="fa fa-angle-right"></i> Outbound SMTP-Konfiguration und folgen Sie den Einrichtungshinweisen.
* Der Urlaubsantworter kann nicht für globale Vanity-Domainnamen aktiviert werden (z. B. werden [wegwerfbare Adressen](/disposable-addresses) nicht unterstützt).
* Der Urlaubsantworter kann nicht für Aliase mit Wildcard/Catch-All (`*`) oder regulären Ausdrücken aktiviert werden.

Im Gegensatz zu Mailsystemen wie `postfix` (z. B. die die `sieve`-Vacation-Filter-Erweiterung verwenden) – fügt Forward Email automatisch Ihre DKIM-Signatur hinzu, schützt vor Verbindungsproblemen beim Senden von Urlaubsantworten (z. B. aufgrund häufiger SSL/TLS-Verbindungsprobleme und älterer Server) und unterstützt sogar Open WKD und PGP-Verschlüsselung für Urlaubsantworten.

<!--
* Um Missbrauch zu verhindern, wird für jede gesendete Urlaubsantwort eine Outbound-SMTP-Gutschrift abgezogen.
  * Alle kostenpflichtigen Konten enthalten standardmäßig 300 Gutschriften pro Tag. Wenn Sie eine größere Menge benötigen, kontaktieren Sie uns bitte.
-->

1. Wir senden nur einmal alle 4 Tage pro [erlaubtem](#do-you-have-an-allowlist) Absender.

   * Unser Redis-Cache verwendet einen Fingerabdruck aus `alias_id` und `sender`, wobei `alias_id` die Alias-MongoDB-ID ist und `sender` entweder die From-Adresse (wenn erlaubt) oder die Root-Domain in der From-Adresse (wenn nicht erlaubt). Zur Vereinfachung ist die Ablaufzeit dieses Fingerabdrucks im Cache auf 4 Tage gesetzt.

   * Unser Ansatz, bei nicht erlaubten Absendern die Root-Domain aus der From-Adresse zu verwenden, verhindert Missbrauch durch relativ unbekannte Absender (z. B. böswillige Akteure), die Urlaubsantworten fluten könnten.

2. Wir senden nur, wenn MAIL FROM und/oder From nicht leer sind und keinen (Groß-/Kleinschreibung ignorierenden) [Postmaster-Benutzernamen](#what-are-postmaster-addresses) enthalten (der Teil vor dem @ in einer E-Mail).

3. Wir senden nicht, wenn die Originalnachricht einen der folgenden Header (Groß-/Kleinschreibung ignorierend) hatte:

   * Header `auto-submitted` mit einem Wert ungleich `no`.
   * Header `x-auto-response-suppress` mit einem Wert von `dr`, `autoreply`, `auto-reply`, `auto_reply` oder `all`.
   * Header `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` oder `x-auto-respond` (unabhängig vom Wert).
   * Header `precedence` mit einem Wert von `bulk`, `autoreply`, `auto-reply`, `auto_reply` oder `list`.

4. Wir senden nicht, wenn die MAIL FROM- oder From-E-Mail-Adresse mit `+donotreply`, `-donotreply`, `+noreply` oder `-noreply` endet.

5. Wir senden nicht, wenn der Benutzername der From-E-Mail-Adresse `mdaemon` war und ein Groß-/Kleinschreibung ignorierender Header `X-MDDSN-Message` vorhanden war.

6. Wir senden nicht, wenn ein Groß-/Kleinschreibung ignorierender `content-type`-Header mit dem Wert `multipart/report` vorhanden war.

### Wie richte ich SPF für Forward Email ein {#how-do-i-set-up-spf-for-forward-email}

Verwenden Sie die DNS-Verwaltungsseite Ihres Registrars und legen Sie den folgenden <strong class="notranslate">TXT</strong>-Eintrag fest:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Wenn Sie Gmail (z. B. Send Mail As) oder G Suite verwenden, müssen Sie <code>include:_spf.google.com</code> an den obigen Wert anhängen, zum Beispiel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Wenn Sie Microsoft Outlook oder Live.com verwenden, müssen Sie <code>include:spf.protection.outlook.com</code> zu Ihrem SPF <strong class="notranslate">TXT</strong>-Eintrag hinzufügen, zum Beispiel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
  <span>
    Wenn Sie bereits eine ähnliche Zeile mit "v=spf1" haben, müssen Sie <code>include:spf.forwardemail.net</code> direkt vor allen vorhandenen "include:host.com"-Einträgen und vor dem "-all" in derselben Zeile hinzufügen, zum Beispiel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Beachten Sie, dass es einen Unterschied zwischen "-all" und "~all" gibt. Das "-" bedeutet, dass die SPF-Prüfung FEHLERHAFT sein soll, wenn sie nicht übereinstimmt, und "~" bedeutet, dass die SPF-Prüfung SOFTFAIL sein soll. Wir empfehlen die Verwendung der "-all"-Methode, um Domain-Fälschungen zu verhindern.
    <br /><br />
    Möglicherweise müssen Sie auch den SPF-Eintrag für den Host einschließen, von dem Sie E-Mails senden (z. B. Outlook).
  </span>
</div>

### Wie richte ich DKIM für Forward Email ein {#how-do-i-set-up-dkim-for-forward-email}

Gehen Sie zu <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Einstellungen <i class="fa fa-angle-right"></i> Outbound SMTP-Konfiguration und folgen Sie den Einrichtungshinweisen.

### Wie richte ich DMARC für Forward Email ein {#how-do-i-set-up-dmarc-for-forward-email}

Gehen Sie zu <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Einstellungen <i class="fa fa-angle-right"></i> Outbound SMTP-Konfiguration und folgen Sie den Einrichtungshinweisen.

### Wie kann ich DMARC-Berichte anzeigen {#how-do-i-view-dmarc-reports}

Forward Email bietet ein umfassendes DMARC-Berichte-Dashboard, mit dem Sie die Leistung Ihrer E-Mail-Authentifizierung über alle Ihre Domains hinweg von einer einzigen Oberfläche aus überwachen können.

**Was sind DMARC-Berichte?**

DMARC (Domain-based Message Authentication, Reporting, and Conformance) Berichte sind XML-Dateien, die von empfangenden Mailservern gesendet werden und Ihnen mitteilen, wie Ihre E-Mails authentifiziert werden. Diese Berichte helfen Ihnen zu verstehen:

* Wie viele E-Mails von Ihrer Domain gesendet werden
* Ob diese E-Mails die SPF- und DKIM-Authentifizierung bestehen
* Welche Maßnahmen empfangende Server ergreifen (akzeptieren, in Quarantäne stellen oder ablehnen)
* Welche IP-Adressen E-Mails im Namen Ihrer Domain senden

**Wie greife ich auf DMARC-Berichte zu**

Gehen Sie zu <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> DMARC-Berichte</a>, um Ihr Dashboard anzuzeigen. Sie können auch domänenspezifische Berichte über <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> aufrufen, indem Sie neben einer Domain auf die Schaltfläche "DMARC" klicken.

**Dashboard-Funktionen**

Das DMARC-Berichte-Dashboard bietet:

* **Zusammenfassende Kennzahlen**: Gesamtzahl der empfangenen Berichte, analysierte Nachrichten, SPF-Ausrichtungsrate, DKIM-Ausrichtungsrate und Gesamtbestehensrate
* **Nachrichten im Zeitverlauf Diagramm**: Visueller Trend des E-Mail-Volumens und der Authentifizierungsraten der letzten 30 Tage
* **Ausrichtungsübersicht**: Donut-Diagramm, das die Verteilung der SPF- gegenüber DKIM-Ausrichtung zeigt
* **Nachrichten-Disposition**: Gestapeltes Balkendiagramm, das zeigt, wie empfangende Server Ihre E-Mails behandelt haben (akzeptiert, in Quarantäne gestellt oder abgelehnt)
* **Tabelle der letzten Berichte**: Detaillierte Liste einzelner DMARC-Berichte mit Filter- und Paginierungsoptionen
* **Domain-Filterung**: Filtert Berichte nach bestimmten Domains, wenn mehrere Domains verwaltet werden
**Warum das wichtig ist**

Für Organisationen, die mehrere Domains verwalten (wie Unternehmen, gemeinnützige Organisationen oder Agenturen), sind DMARC-Berichte unerlässlich für:

* **Identifizierung unautorisierter Absender**: Erkennen, ob jemand Ihre Domain fälscht
* **Verbesserung der Zustellbarkeit**: Sicherstellen, dass Ihre legitimen E-Mails die Authentifizierung bestehen
* **Überwachung der E-Mail-Infrastruktur**: Nachverfolgen, welche Dienste und IPs in Ihrem Namen senden
* **Compliance**: Sichtbarkeit der E-Mail-Authentifizierung für Sicherheitsprüfungen gewährleisten

Im Gegensatz zu anderen Diensten, die separate DMARC-Überwachungstools erfordern, beinhaltet Forward Email die Verarbeitung und Visualisierung von DMARC-Berichten als Teil Ihres Kontos ohne zusätzliche Kosten.

**Anforderungen**

* DMARC-Berichte sind nur für kostenpflichtige Pläne verfügbar
* Ihre Domain muss DMARC konfiguriert haben (siehe [Wie richte ich DMARC für Forward Email ein](#how-do-i-set-up-dmarc-for-forward-email))
* Berichte werden automatisch gesammelt, wenn empfangende Mailserver sie an Ihre konfigurierte DMARC-Berichtsadresse senden

**Wöchentliche E-Mail-Berichte**

Benutzer mit kostenpflichtigem Plan erhalten automatisch wöchentliche Zusammenfassungen der DMARC-Berichte per E-Mail. Diese E-Mails enthalten:

* Zusammenfassende Statistiken für alle Ihre Domains
* SPF- und DKIM-Ausrichtungsraten
* Aufschlüsselung der Nachrichtenverarbeitung (akzeptiert, in Quarantäne, abgelehnt)
* Top meldende Organisationen (Google, Microsoft, Yahoo usw.)
* IP-Adressen mit Ausrichtungsproblemen, die möglicherweise Aufmerksamkeit erfordern
* Direkte Links zu Ihrem DMARC-Berichte-Dashboard

Wöchentliche Berichte werden automatisch gesendet und können nicht separat von anderen E-Mail-Benachrichtigungen deaktiviert werden.

### Wie verbinde und konfiguriere ich meine Kontakte {#how-do-i-connect-and-configure-my-contacts}

**Um Ihre Kontakte zu konfigurieren, verwenden Sie die CardDAV-URL:** `https://carddav.forwardemail.net` (oder einfach `carddav.forwardemail.net`, wenn Ihr Client dies erlaubt)

### Wie verbinde und konfiguriere ich meine Kalender {#how-do-i-connect-and-configure-my-calendars}

**Um Ihren Kalender zu konfigurieren, verwenden Sie die CalDAV-URL:** `https://caldav.forwardemail.net` (oder einfach `caldav.forwardemail.net`, wenn Ihr Client dies erlaubt)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Beispielkonfiguration" />

### Wie füge ich weitere Kalender hinzu und verwalte bestehende Kalender {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Wenn Sie weitere Kalender hinzufügen möchten, fügen Sie einfach eine neue Kalender-URL hinzu: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**ersetzen Sie `calendar-name` unbedingt durch den gewünschten Kalendernamen**)

Sie können den Namen und die Farbe eines Kalenders nach der Erstellung ändern – verwenden Sie dazu einfach Ihre bevorzugte Kalenderanwendung (z. B. Apple Mail oder [Thunderbird](https://thunderbird.net)).

### Wie verbinde und konfiguriere ich Aufgaben und Erinnerungen {#how-do-i-connect-and-configure-tasks-and-reminders}

**Um Aufgaben und Erinnerungen zu konfigurieren, verwenden Sie dieselbe CalDAV-URL wie für Kalender:** `https://caldav.forwardemail.net` (oder einfach `caldav.forwardemail.net`, wenn Ihr Client dies erlaubt)

Aufgaben und Erinnerungen werden automatisch von Kalenderereignissen getrennt und in einer eigenen "Erinnerungen" oder "Aufgaben"-Kalendersammlung angezeigt.

**Einrichtungsanleitungen nach Plattform:**

**macOS/iOS:**

1. Fügen Sie ein neues CalDAV-Konto in den Systemeinstellungen > Internetaccounts hinzu (oder Einstellungen > Accounts auf iOS)
2. Verwenden Sie `caldav.forwardemail.net` als Server
3. Geben Sie Ihren Forward Email-Alias und das generierte Passwort ein
4. Nach der Einrichtung sehen Sie sowohl "Kalender" als auch "Erinnerungen"-Sammlungen
5. Verwenden Sie die Erinnerungen-App, um Aufgaben zu erstellen und zu verwalten

**Android mit Tasks.org:**

1. Installieren Sie Tasks.org aus dem Google Play Store oder F-Droid
2. Gehen Sie zu Einstellungen > Synchronisierung > Konto hinzufügen > CalDAV
3. Geben Sie den Server ein: `https://caldav.forwardemail.net`
4. Geben Sie Ihren Forward Email-Alias und das generierte Passwort ein
5. Tasks.org erkennt automatisch Ihre Aufgaben-Kalender

**Thunderbird:**

1. Installieren Sie das Lightning-Add-on, falls noch nicht geschehen
2. Erstellen Sie einen neuen Kalender vom Typ "CalDAV"
3. Verwenden Sie die URL: `https://caldav.forwardemail.net`
4. Geben Sie Ihre Forward Email-Zugangsdaten ein
5. Sowohl Ereignisse als auch Aufgaben sind in der Kalenderoberfläche verfügbar

### Warum kann ich in macOS Erinnerungen keine Aufgaben erstellen {#why-cant-i-create-tasks-in-macos-reminders}
Wenn Sie Probleme haben, Aufgaben in macOS Erinnerungen zu erstellen, versuchen Sie diese Schritte zur Fehlerbehebung:

1. **Kontoeinrichtung überprüfen**: Stellen Sie sicher, dass Ihr CalDAV-Konto korrekt mit `caldav.forwardemail.net` konfiguriert ist

2. **Separate Kalender überprüfen**: Sie sollten sowohl "Kalender" als auch "Erinnerungen" in Ihrem Konto sehen. Wenn Sie nur "Kalender" sehen, ist die Aufgabenunterstützung möglicherweise noch nicht vollständig aktiviert.

3. **Konto aktualisieren**: Versuchen Sie, Ihr CalDAV-Konto in den Systemeinstellungen > Internetkonten zu entfernen und erneut hinzuzufügen

4. **Serververbindung prüfen**: Testen Sie, ob Sie `https://caldav.forwardemail.net` in Ihrem Browser erreichen können

5. **Anmeldedaten überprüfen**: Stellen Sie sicher, dass Sie die richtige Alias-E-Mail und das generierte Passwort (nicht Ihr Kontopasswort) verwenden

6. **Sync erzwingen**: Versuchen Sie in der Erinnerungen-App, eine Aufgabe zu erstellen und dann die Synchronisierung manuell zu aktualisieren

**Häufige Probleme:**

* **"Erinnerungskalender nicht gefunden"**: Der Server benötigt möglicherweise einen Moment, um die Erinnerungs-Sammlung beim ersten Zugriff zu erstellen
* **Aufgaben werden nicht synchronisiert**: Prüfen Sie, ob beide Geräte dieselben CalDAV-Kontodaten verwenden
* **Gemischte Inhalte**: Stellen Sie sicher, dass Aufgaben im "Erinnerungen"-Kalender und nicht im allgemeinen "Kalender" erstellt werden

### Wie richte ich Tasks.org auf Android ein {#how-do-i-set-up-tasksorg-on-android}

Tasks.org ist ein beliebter Open-Source-Aufgabenmanager, der hervorragend mit Forward Emails CalDAV-Aufgabenunterstützung funktioniert.

**Installation und Einrichtung:**

1. **Tasks.org installieren**:
   * Aus dem Google Play Store: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * Aus F-Droid: [Tasks.org auf F-Droid](https://f-droid.org/packages/org.tasks/)

2. **CalDAV-Synchronisierung konfigurieren**:
   * Öffnen Sie Tasks.org
   * Gehen Sie zu ☰ Menü > Einstellungen > Synchronisierung
   * Tippen Sie auf "Konto hinzufügen"
   * Wählen Sie "CalDAV"

3. **Forward Email Einstellungen eingeben**:
   * **Server-URL**: `https://caldav.forwardemail.net`
   * **Benutzername**: Ihr Forward Email Alias (z.B. `you@yourdomain.com`)
   * **Passwort**: Ihr alias-spezifisches generiertes Passwort
   * Tippen Sie auf "Konto hinzufügen"

4. **Kontenerkennung**:
   * Tasks.org erkennt automatisch Ihre Aufgaben-Kalender
   * Sie sollten Ihre "Erinnerungen"-Sammlung sehen
   * Tippen Sie auf "Abonnieren", um die Synchronisierung für den Aufgaben-Kalender zu aktivieren

5. **Synchronisierung testen**:
   * Erstellen Sie eine Testaufgabe in Tasks.org
   * Prüfen Sie, ob sie in anderen CalDAV-Clients (wie macOS Erinnerungen) erscheint
   * Verifizieren Sie, dass Änderungen in beide Richtungen synchronisiert werden

**Verfügbare Funktionen:**

* ✅ Erstellung und Bearbeitung von Aufgaben
* ✅ Fälligkeitsdaten und Erinnerungen
* ✅ Aufgabenabschluss und Status
* ✅ Prioritätsstufen
* ✅ Unteraufgaben und Aufgabenhierarchie
* ✅ Tags und Kategorien
* ✅ Zwei-Wege-Synchronisierung mit anderen CalDAV-Clients

**Fehlerbehebung:**

* Wenn keine Aufgaben-Kalender erscheinen, versuchen Sie, in den Tasks.org-Einstellungen manuell zu aktualisieren
* Stellen Sie sicher, dass mindestens eine Aufgabe auf dem Server erstellt wurde (Sie können zuerst eine in macOS Erinnerungen anlegen)
* Prüfen Sie die Netzwerkverbindung zu `caldav.forwardemail.net`

### Wie richte ich SRS für Forward Email ein {#how-do-i-set-up-srs-for-forward-email}

Wir konfigurieren automatisch das [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – Sie müssen dies nicht selbst tun.

### Wie richte ich MTA-STS für Forward Email ein {#how-do-i-set-up-mta-sts-for-forward-email}

Bitte lesen Sie [unseren Abschnitt zu MTA-STS](#do-you-support-mta-sts) für weitere Informationen.

### Wie füge ich meinem E-Mail-Adresse ein Profilbild hinzu {#how-do-i-add-a-profile-picture-to-my-email-address}

Wenn Sie Gmail verwenden, folgen Sie bitte diesen Schritten:

1. Gehen Sie zu <https://google.com> und melden Sie sich von allen E-Mail-Konten ab
2. Klicken Sie auf "Anmelden" und wählen Sie im Dropdown "anderes Konto"
3. Wählen Sie "Anderes Konto verwenden"
4. Wählen Sie "Konto erstellen"
5. Wählen Sie "Stattdessen meine aktuelle E-Mail-Adresse verwenden"
6. Geben Sie Ihre E-Mail-Adresse mit Ihrer eigenen Domain ein
7. Rufen Sie die Verifizierungs-E-Mail ab, die an Ihre E-Mail-Adresse gesendet wurde
8. Geben Sie den Verifizierungscode aus dieser E-Mail ein
9. Vervollständigen Sie die Profilinformationen für Ihr neues Google-Konto
10. Stimmen Sie allen Datenschutz- und Nutzungsbedingungen zu
11. Gehen Sie zu <https://google.com>, klicken Sie oben rechts auf Ihr Profilbild und dann auf die Schaltfläche "ändern"
12. Laden Sie ein neues Foto oder Avatar für Ihr Konto hoch
13. Änderungen benötigen etwa 1-2 Stunden zur Übernahme, können aber manchmal sehr schnell erfolgen.
14. Senden Sie eine Test-E-Mail, und das Profilbild sollte angezeigt werden.
## Erweiterte Funktionen {#advanced-features}

### Unterstützen Sie Newsletter oder Mailinglisten für marketingbezogene E-Mails {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Ja, Sie können mehr lesen unter <https://forwardemail.net/guides/newsletter-with-listmonk>.

Bitte beachten Sie, dass Forward Email zur Wahrung der IP-Reputation und Sicherstellung der Zustellbarkeit einen manuellen Überprüfungsprozess pro Domain für die **Newsletter-Freigabe** hat. Senden Sie eine E-Mail an <support@forwardemail.net> oder eröffnen Sie eine [Hilfeanfrage](https://forwardemail.net/help) zur Freigabe. Dies dauert in der Regel weniger als 24 Stunden, wobei die meisten Anfragen innerhalb von 1-2 Stunden bearbeitet werden. In naher Zukunft wollen wir diesen Prozess mit zusätzlichen Spam-Kontrollen und Benachrichtigungen sofortig machen. Dieser Prozess stellt sicher, dass Ihre E-Mails den Posteingang erreichen und Ihre Nachrichten nicht als Spam markiert werden.

### Unterstützen Sie das Versenden von E-Mails per API {#do-you-support-sending-email-with-api}

Ja, seit Mai 2023 unterstützen wir das Versenden von E-Mails per API als Zusatzfunktion für alle zahlenden Nutzer.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Bitte stellen Sie sicher, dass Sie unsere <a href="/terms" class="alert-link" target="_blank">Nutzungsbedingungen</a>, <a href="/privacy" class="alert-link" target="_blank">Datenschutzerklärung</a> und <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Outbound SMTP Limits</a> gelesen haben – Ihre Nutzung gilt als Anerkennung und Zustimmung.
  </span>
</div>

Bitte sehen Sie sich unseren Abschnitt zu [E-Mails](/email-api#outbound-emails) in unserer API-Dokumentation für Optionen, Beispiele und weitere Einblicke an.

Um ausgehende E-Mails mit unserer API zu versenden, müssen Sie Ihren API-Token verwenden, der unter [Mein Sicherheit](/my-account/security) verfügbar ist.

### Unterstützen Sie den Empfang von E-Mails per IMAP {#do-you-support-receiving-email-with-imap}

Ja, seit dem 16. Oktober 2023 unterstützen wir den Empfang von E-Mails über IMAP als Zusatzfunktion für alle zahlenden Nutzer.  **Bitte lesen Sie unseren ausführlichen Artikel** über [wie unsere verschlüsselte SQLite-Postfachspeicherfunktion funktioniert](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Bitte stellen Sie sicher, dass Sie unsere <a href="/terms" class="alert-link" target="_blank">Nutzungsbedingungen</a> und <a href="/privacy" class="alert-link" target="_blank">Datenschutzerklärung</a> gelesen haben – Ihre Nutzung gilt als Anerkennung und Zustimmung.
  </span>
</div>

1. Erstellen Sie einen neuen Alias für Ihre Domain unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase (z. B. <code><hello@example.com></code>)

2. Klicken Sie neben dem neu erstellten Alias auf <strong class="text-success"><i class="fa fa-key"></i> Passwort generieren</strong>. Kopieren Sie das angezeigte Passwort in Ihre Zwischenablage und speichern Sie es sicher.

3. Fügen Sie mit Ihrer bevorzugten E-Mail-Anwendung ein Konto mit Ihrem neu erstellten Alias hinzu oder konfigurieren Sie es (z. B. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tipp:
     </strong>
     <span>Wir empfehlen die Nutzung von <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> oder <a href="/blog/open-source" class="alert-link" target="_blank">eine Open-Source- und datenschutzorientierte Alternative</a>.</span>
   </div>

4. Wenn Sie nach dem IMAP-Servernamen gefragt werden, geben Sie `imap.forwardemail.net` ein

5. Wenn Sie nach dem IMAP-Serverport gefragt werden, geben Sie `993` (SSL/TLS) ein – siehe [alternative IMAP-Ports](/faq#what-are-your-imap-server-configuration-settings) falls nötig
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tipp:
     </strong>
     <span>Wenn Sie Thunderbird verwenden, stellen Sie sicher, dass die "Verbindungssicherheit" auf "SSL/TLS" und die Authentifizierungsmethode auf "Normales Passwort" eingestellt ist.</span>
   </div>
6. Wenn Sie nach dem IMAP-Server-Passwort gefragt werden, fügen Sie das Passwort aus <strong class="text-success"><i class="fa fa-key"></i> Passwort generieren</strong> in Schritt 2 oben ein

7. **Speichern Sie Ihre Einstellungen** – wenn Sie Probleme haben, dann <a href="/help">kontaktieren Sie uns</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Herzlichen Glückwunsch!
    </strong>
    <span>
      Sie haben alle Schritte erfolgreich abgeschlossen.
    </span>
  </div>
</div>

</div>

### Unterstützen Sie POP3 {#do-you-support-pop3}

Ja, seit dem 4. Dezember 2023 unterstützen wir [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) als Zusatzfunktion für alle zahlenden Nutzer.  **Bitte lesen Sie unseren ausführlichen Artikel** darüber, [wie unsere verschlüsselte SQLite-Postfachspeicherfunktion funktioniert](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Bitte stellen Sie sicher, dass Sie unsere <a href="/terms" class="alert-link" target="_blank">Nutzungsbedingungen</a> und <a href="/privacy" class="alert-link" target="_blank">Datenschutzerklärung</a> gelesen haben – Ihre Nutzung gilt als Anerkennung und Zustimmung.
  </span>
</div>

1. Erstellen Sie einen neuen Alias für Ihre Domain unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase (z. B. <code><hello@example.com></code>)

2. Klicken Sie neben dem neu erstellten Alias auf <strong class="text-success"><i class="fa fa-key"></i> Passwort generieren</strong>. Kopieren Sie das Passwort in Ihre Zwischenablage und speichern Sie es sicher.

3. Fügen Sie in Ihrer bevorzugten E-Mail-Anwendung ein Konto mit Ihrem neu erstellten Alias hinzu oder konfigurieren Sie es (z. B. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tipp:
     </strong>
     <span>Wir empfehlen die Verwendung von <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> oder <a href="/blog/open-source" class="alert-link" target="_blank">eine Open-Source- und datenschutzorientierte Alternative</a>.</span>
   </div>

4. Wenn Sie nach dem POP3-Servernamen gefragt werden, geben Sie `pop3.forwardemail.net` ein

5. Wenn Sie nach dem POP3-Serverport gefragt werden, geben Sie `995` (SSL/TLS) ein – siehe [alternative POP3-Ports](/faq#what-are-your-pop3-server-configuration-settings) falls nötig
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tipp:
     </strong>
     <span>Wenn Sie Thunderbird verwenden, stellen Sie sicher, dass die "Verbindungssicherheit" auf "SSL/TLS" und die Authentifizierungsmethode auf "Normales Passwort" eingestellt ist.</span>
   </div>

6. Wenn Sie nach dem POP3-Server-Passwort gefragt werden, fügen Sie das Passwort aus <strong class="text-success"><i class="fa fa-key"></i> Passwort generieren</strong> in Schritt 2 oben ein

7. **Speichern Sie Ihre Einstellungen** – wenn Sie Probleme haben, dann <a href="/help">kontaktieren Sie uns</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Herzlichen Glückwunsch!
    </strong>
    <span>
      Sie haben alle Schritte erfolgreich abgeschlossen.
    </span>
  </div>
</div>

</div>

### Unterstützen Sie Kalender (CalDAV) {#do-you-support-calendars-caldav}

Ja, seit dem 5. Februar 2024 haben wir diese Funktion hinzugefügt. Unser Server ist `caldav.forwardemail.net` und wird auch auf unserer <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">Statusseite</a> überwacht.
Es unterstützt sowohl IPv4 als auch IPv6 und ist über den Port `443` (HTTPS) verfügbar.

| Login    | Beispiel                   | Beschreibung                                                                                                                                                                              |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Benutzername | `user@example.com`         | E-Mail-Adresse eines Alias, der für die Domain unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> existiert. |
| Passwort | `************************` | Alias-spezifisch generiertes Passwort.                                                                                                                                                    |

Um Kalenderunterstützung zu nutzen, muss der **Benutzer** die E-Mail-Adresse eines Alias sein, der für die Domain unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> existiert – und das **Passwort** muss ein alias-spezifisch generiertes Passwort sein.

### Unterstützen Sie Aufgaben und Erinnerungen (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

Ja, seit dem 14. Oktober 2025 haben wir CalDAV VTODO-Unterstützung für Aufgaben und Erinnerungen hinzugefügt. Dies verwendet denselben Server wie unsere Kalenderunterstützung: `caldav.forwardemail.net`.

Unser CalDAV-Server unterstützt sowohl Kalenderereignisse (VEVENT) als auch Aufgaben (VTODO)-Komponenten mit **einheitlichen Kalendern**. Das bedeutet, dass jeder Kalender sowohl Ereignisse als auch Aufgaben enthalten kann, was maximale Flexibilität und Kompatibilität mit allen CalDAV-Clients bietet.

**Wie Kalender und Listen funktionieren:**

* **Jeder Kalender unterstützt sowohl Ereignisse als auch Aufgaben** – Sie können Ereignisse, Aufgaben oder beides zu jedem Kalender hinzufügen
* **Apple Erinnerungen-Listen** – Jede Liste, die Sie in Apple Erinnerungen erstellen, wird zu einem separaten Kalender auf dem Server
* **Mehrere Kalender** – Sie können so viele Kalender erstellen, wie Sie benötigen, jeder mit eigenem Namen, Farbe und Organisation
* **Synchronisation zwischen Clients** – Aufgaben und Ereignisse synchronisieren nahtlos zwischen allen kompatiblen Clients

**Unterstützte Aufgaben-Clients:**

* **macOS Erinnerungen** – Volle native Unterstützung für Erstellung, Bearbeitung, Abschluss und Synchronisation von Aufgaben
* **iOS Erinnerungen** – Volle native Unterstützung auf allen iOS-Geräten
* **Tasks.org (Android)** – Beliebter Open-Source-Aufgabenmanager mit CalDAV-Synchronisation
* **Thunderbird** – Aufgaben- und Kalenderunterstützung im Desktop-E-Mail-Client
* **Jeder CalDAV-kompatible Aufgabenmanager** – Standardmäßige VTODO-Komponenten-Unterstützung

**Unterstützte Aufgabenfunktionen:**

* Erstellung, Bearbeitung und Löschung von Aufgaben
* Fälligkeits- und Startdaten
* Aufgabenstatus (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* Prioritätsstufen für Aufgaben
* Wiederkehrende Aufgaben
* Aufgabenbeschreibungen und Notizen
* Synchronisation über mehrere Geräte
* Unteraufgaben mit RELATED-TO-Eigenschaft
* Aufgaben-Erinnerungen mit VALARM

Die Anmeldedaten sind dieselben wie für die Kalenderunterstützung:

| Login    | Beispiel                   | Beschreibung                                                                                                                                                                              |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Benutzername | `user@example.com`         | E-Mail-Adresse eines Alias, der für die Domain unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> existiert. |
| Passwort | `************************` | Alias-spezifisch generiertes Passwort.                                                                                                                                                    |

**Wichtige Hinweise:**

* **Jede Erinnerungen-Liste ist ein separater Kalender** – Wenn Sie in Apple Erinnerungen eine neue Liste erstellen, wird auf dem CalDAV-Server ein neuer Kalender erstellt
* **Thunderbird-Nutzer** – Sie müssen jeden Kalender/jede Liste, die Sie synchronisieren möchten, manuell abonnieren oder die Kalender-Home-URL verwenden: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Apple-Nutzer** – Die Kalendererkennung erfolgt automatisch, sodass alle Ihre Kalender und Listen in Calendar.app und Reminders.app angezeigt werden
* **Einheitliche Kalender** – Alle Kalender unterstützen sowohl Ereignisse als auch Aufgaben, was Ihnen Flexibilität bei der Organisation Ihrer Daten bietet
### Unterstützen Sie Kontakte (CardDAV) {#do-you-support-contacts-carddav}

Ja, seit dem 12. Juni 2025 haben wir diese Funktion hinzugefügt. Unser Server ist `carddav.forwardemail.net` und wird auch auf unserer <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">Statusseite</a> überwacht.

Er unterstützt sowohl IPv4 als auch IPv6 und ist über Port `443` (HTTPS) verfügbar.

| Anmeldung | Beispiel                  | Beschreibung                                                                                                                                                                              |
| --------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Benutzername | `user@example.com`       | E-Mail-Adresse eines Alias, der für die Domain unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> existiert. |
| Passwort  | `************************` | Alias-spezifisch generiertes Passwort.                                                                                                                                                    |

Um die Kontaktunterstützung zu nutzen, muss der **Benutzer** die E-Mail-Adresse eines Alias sein, der für die Domain unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> existiert – und das **Passwort** muss ein alias-spezifisch generiertes Passwort sein.

### Unterstützen Sie das Senden von E-Mails mit SMTP {#do-you-support-sending-email-with-smtp}

Ja, seit Mai 2023 unterstützen wir das Senden von E-Mails mit SMTP als Add-on für alle zahlenden Nutzer.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Bitte stellen Sie sicher, dass Sie unsere <a href="/terms" class="alert-link" target="_blank">Nutzungsbedingungen</a>, <a href="/privacy" class="alert-link" target="_blank">Datenschutzerklärung</a> und <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Outbound SMTP Limits</a> gelesen haben – Ihre Nutzung gilt als Anerkennung und Zustimmung.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Wenn Sie Gmail verwenden, beachten Sie bitte unseren <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Send Mail As mit Gmail Leitfaden</a>. Wenn Sie Entwickler sind, beachten Sie bitte unsere <a class="alert-link" href="/email-api#outbound-emails" target="_blank">E-Mail-API-Dokumentation</a>.
  </span>
</div>

1. Gehen Sie zu <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Einstellungen <i class="fa fa-angle-right"></i> Outbound SMTP Konfiguration und folgen Sie den Einrichtungshinweisen

2. Erstellen Sie einen neuen Alias für Ihre Domain unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase (z.B. <code><hello@example.com></code>)

3. Klicken Sie neben dem neu erstellten Alias auf <strong class="text-success"><i class="fa fa-key"></i> Passwort generieren</strong>. Kopieren Sie es in Ihre Zwischenablage und speichern Sie das auf dem Bildschirm angezeigte generierte Passwort sicher.

4. Fügen Sie in Ihrer bevorzugten E-Mail-Anwendung ein Konto mit Ihrem neu erstellten Alias hinzu oder konfigurieren Sie es (z.B. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tipp:
     </strong>
     <span>Wir empfehlen die Verwendung von <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> oder <a href="/blog/open-source" class="alert-link" target="_blank">einer Open-Source- und datenschutzorientierten Alternative</a>.</span>
   </div>
5. Wenn Sie nach dem SMTP-Servernamen gefragt werden, geben Sie `smtp.forwardemail.net` ein

6. Wenn Sie nach dem SMTP-Serverport gefragt werden, geben Sie `465` (SSL/TLS) ein – siehe [alternative SMTP-Ports](/faq#what-are-your-smtp-server-configuration-settings), falls erforderlich
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tipp:
     </strong>
     <span>Wenn Sie Thunderbird verwenden, stellen Sie sicher, dass "Verbindungssicherheit" auf "SSL/TLS" und die Authentifizierungsmethode auf "Normales Passwort" eingestellt ist.</span>
   </div>

7. Wenn Sie nach dem SMTP-Serverpasswort gefragt werden, fügen Sie das Passwort aus <strong class="text-success"><i class="fa fa-key"></i> Passwort generieren</strong> in Schritt 3 oben ein

8. **Speichern Sie Ihre Einstellungen und senden Sie Ihre erste Test-E-Mail** – wenn Sie Probleme haben, dann <a href="/help">kontaktieren Sie uns</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Bitte beachten Sie, dass wir zur Wahrung des IP-Rufs und zur Sicherstellung der Zustellbarkeit einen manuellen Überprüfungsprozess pro Domain für die Genehmigung des ausgehenden SMTP-Verkehrs haben. Dies dauert in der Regel weniger als 24 Stunden, wobei die meisten Anfragen innerhalb von 1-2 Stunden bearbeitet werden. In naher Zukunft wollen wir diesen Prozess mit zusätzlichen Spam-Kontrollen und Benachrichtigungen sofortig machen. Dieser Prozess stellt sicher, dass Ihre E-Mails den Posteingang erreichen und Ihre Nachrichten nicht als Spam markiert werden.
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Herzlichen Glückwunsch!
    </strong>
    <span>
      Sie haben alle Schritte erfolgreich abgeschlossen.
    </span>
  </div>
</div>

</div>

### Unterstützen Sie OpenPGP/MIME, Ende-zu-Ende-Verschlüsselung ("E2EE") und Web Key Directory ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Ja, wir unterstützen [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [Ende-zu-Ende-Verschlüsselung ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) und die Entdeckung öffentlicher Schlüssel mittels [Web Key Directory ("WKD")](https://wiki.gnupg.org/WKD). Sie können OpenPGP über [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) konfigurieren oder [eigene Schlüssel selbst hosten](https://wiki.gnupg.org/WKDHosting) (siehe [diesen Gist für WKD-Server-Setup](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* WKD-Abfragen werden für 1 Stunde zwischengespeichert, um eine zeitnahe E-Mail-Zustellung zu gewährleisten → wenn Sie also Ihren WKD-Schlüssel hinzufügen, ändern oder entfernen, senden Sie uns bitte eine E-Mail an `support@forwardemail.net` mit Ihrer E-Mail-Adresse, damit wir den Cache manuell löschen können.
* Wir unterstützen PGP-Verschlüsselung für Nachrichten, die über WKD-Abfrage weitergeleitet werden oder bei Verwendung eines hochgeladenen PGP-Schlüssels in unserer Oberfläche.
* Hochgeladene Schlüssel haben Vorrang, solange das PGP-Kontrollkästchen aktiviert/angekreuzt ist.
* Nachrichten, die an Webhooks gesendet werden, sind derzeit nicht mit PGP verschlüsselt.
* Wenn Sie mehrere Aliase haben, die für eine bestimmte Weiterleitungsadresse übereinstimmen (z. B. Regex/Wildcard/exakte Kombination) und wenn mehr als einer dieser Aliase einen hochgeladenen PGP-Schlüssel enthält und PGP aktiviert ist → senden wir Ihnen eine Fehlermeldung per E-Mail und verschlüsseln die Nachricht nicht mit Ihrem hochgeladenen PGP-Schlüssel. Dies ist sehr selten und betrifft normalerweise nur fortgeschrittene Benutzer mit komplexen Alias-Regeln.
* **PGP-Verschlüsselung wird bei der E-Mail-Weiterleitung über unsere MX-Server nicht angewendet, wenn der Absender eine DMARC-Richtlinie mit "reject" hatte. Wenn Sie PGP-Verschlüsselung für *alle* Mails benötigen, empfehlen wir die Nutzung unseres IMAP-Dienstes und die Konfiguration Ihres PGP-Schlüssels für Ihren Alias für eingehende Mails.**

**Sie können Ihre Web Key Directory-Konfiguration unter <https://wkd.chimbosonic.com/> (Open Source) oder <https://www.webkeydirectory.com/> (proprietär) validieren.**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Automatische Verschlüsselung:
  </strong>
  <span>Wenn Sie unseren <a href="#do-you-support-sending-email-with-smtp" class="alert-link">ausgehenden SMTP-Dienst</a> verwenden und unverschlüsselte Nachrichten senden, versuchen wir automatisch, Nachrichten pro Empfänger mit <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a> zu verschlüsseln.</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Sie müssen alle folgenden Schritte befolgen, um OpenPGP für Ihren benutzerdefinierten Domainnamen zu aktivieren.
  </span>
</div>

1. Laden Sie das empfohlene Plugin Ihres E-Mail-Clients unten herunter und installieren Sie es:

   | E-Mail-Client  | Plattform | Empfohlenes Plugin                                                                                                                                                                    | Hinweise                                                                                                                                                                                                                                                                                                                                                                                                                                |
   | -------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird    | Desktop  | [OpenPGP in Thunderbird konfigurieren](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird unterstützt OpenPGP nativ.                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Gmail          | Browser  | [Mailvelope](https://mailvelope.com/) oder [FlowCrypt](https://flowcrypt.com/download) (proprietäre Lizenz)                                                                           | Gmail unterstützt OpenPGP nicht, Sie können jedoch das Open-Source-Plugin [Mailvelope](https://mailvelope.com/) oder [FlowCrypt](https://flowcrypt.com/download) herunterladen.                                                                                                                                                                                                                                                          |
   | Apple Mail     | macOS    | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                          | Apple Mail unterstützt OpenPGP nicht, Sie können jedoch das Open-Source-Plugin [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) herunterladen.                                                                                                                                                                                                                                                 |
   | Apple Mail     | iOS      | [PGPro](https://github.com/opensourceios/PGPro/) oder [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (proprietäre Lizenz)                          | Apple Mail unterstützt OpenPGP nicht, Sie können jedoch das Open-Source-Plugin [PGPro](https://github.com/opensourceios/PGPro/) oder [FlowCrypt](https://flowcrypt.com/download) herunterladen.                                                                                                                                                                                                                                          |
   | Outlook        | Windows  | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                          | Der Desktop-Mailclient von Outlook unterstützt OpenPGP nicht, Sie können jedoch das Open-Source-Plugin [gpg4win](https://www.gpg4win.de/index.html) herunterladen.                                                                                                                                                                                                                                                                      |
   | Outlook        | Browser  | [Mailvelope](https://mailvelope.com/) oder [FlowCrypt](https://flowcrypt.com/download) (proprietäre Lizenz)                                                                           | Der webbasierte Mailclient von Outlook unterstützt OpenPGP nicht, Sie können jedoch das Open-Source-Plugin [Mailvelope](https://mailvelope.com/) oder [FlowCrypt](https://flowcrypt.com/download) herunterladen.                                                                                                                                                                                                                          |
   | Android        | Mobile   | [OpenKeychain](https://www.openkeychain.org/) oder [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                    | [Android-Mailclients](/blog/open-source/android-email-clients) wie [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) und [FairEmail](https://github.com/M66B/FairEmail) unterstützen beide das Open-Source-Plugin [OpenKeychain](https://www.openkeychain.org/). Alternativ können Sie das Open-Source-(proprietäre Lizenzierung) Plugin [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) verwenden. |
   | Google Chrome  | Browser  | [Mailvelope](https://mailvelope.com/) oder [FlowCrypt](https://flowcrypt.com/download) (proprietäre Lizenz)                                                                           | Sie können die Open-Source-Browsererweiterung [Mailvelope](https://mailvelope.com/) oder [FlowCrypt](https://flowcrypt.com/download) herunterladen.                                                                                                                                                                                                                                                                                     |
   | Mozilla Firefox| Browser  | [Mailvelope](https://mailvelope.com/) oder [FlowCrypt](https://flowcrypt.com/download) (proprietäre Lizenz)                                                                           | Sie können die Open-Source-Browsererweiterung [Mailvelope](https://mailvelope.com/) oder [FlowCrypt](https://flowcrypt.com/download) herunterladen.                                                                                                                                                                                                                                                                                     |
   | Microsoft Edge | Browser  | [Mailvelope](https://mailvelope.com/)                                                                                                                                                 | Sie können die Open-Source-Browsererweiterung [Mailvelope](https://mailvelope.com/) herunterladen.                                                                                                                                                                                                                                                                                                                                    |
   | Brave          | Browser  | [Mailvelope](https://mailvelope.com/) oder [FlowCrypt](https://flowcrypt.com/download) (proprietäre Lizenz)                                                                           | Sie können die Open-Source-Browsererweiterung [Mailvelope](https://mailvelope.com/) oder [FlowCrypt](https://flowcrypt.com/download) herunterladen.                                                                                                                                                                                                                                                                                     |
   | Balsa          | Desktop  | [OpenPGP in Balsa konfigurieren](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                        | Balsa unterstützt OpenPGP nativ.                                                                                                                                                                                                                                                                                                                                                                                                        |
   | KMail          | Desktop  | [OpenPGP in KMail konfigurieren](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                             | KMail unterstützt OpenPGP nativ.                                                                                                                                                                                                                                                                                                                                                                                                        |
   | GNOME Evolution| Desktop  | [OpenPGP in Evolution konfigurieren](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                           | GNOME Evolution unterstützt OpenPGP nativ.                                                                                                                                                                                                                                                                                                                                                                                              |
   | Terminal       | Desktop  | [gpg im Terminal konfigurieren](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                     | Sie können das Open-Source-[gpg Kommandozeilen-Tool](https://www.gnupg.org/download/) verwenden, um einen neuen Schlüssel über die Kommandozeile zu generieren.                                                                                                                                                                                                                                                                          |
2. Öffnen Sie das Plugin, erstellen Sie Ihren öffentlichen Schlüssel und konfigurieren Sie Ihren E-Mail-Client zur Verwendung desselben.

3. Laden Sie Ihren öffentlichen Schlüssel unter <https://keys.openpgp.org/upload> hoch.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tipp:
     </strong>
     <span>Sie können <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> besuchen, um Ihren Schlüssel zukünftig zu verwalten.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Optionales Zusatzmodul:
     </strong>
     <span>
       Wenn Sie unseren <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">verschlüsselten Speicher (IMAP/POP3)</a>-Dienst nutzen und möchten, dass <i>alle</i> E-Mails, die in Ihrer (bereits verschlüsselten) SQLite-Datenbank gespeichert sind, mit Ihrem öffentlichen Schlüssel verschlüsselt werden, dann gehen Sie zu <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase (z. B. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Bearbeiten <i class="fa fa-angle-right"></i> OpenPGP und laden Sie Ihren öffentlichen Schlüssel hoch.
     </span>
   </div>

4. Fügen Sie einen neuen `CNAME`-Eintrag zu Ihrem Domainnamen hinzu (z. B. `example.com`):

   <table class="table table-striped table-hover my-3">
     <thead class="thead-dark">
       <tr>
         <th>Name/Host/Alias</th>
         <th class="text-center">TTL</th>
         <th>Typ</th>
         <th>Antwort/Wert</th>
       </tr>
     </thead>
     <tbody>
       <tr>
         <td><code>openpgpkey</code></td>
         <td class="text-center">3600</td>
         <td class="notranslate">CNAME</td>
         <td><code>wkd.keys.openpgp.org</code></td>
       </tr>
     </tbody>
   </table>

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tipp:
     </strong>
     <span>Wenn Ihr Alias unsere <a class="alert-link" href="/disposable-addresses" target="_blank">Vanity-/Einweg-Domains</a> verwendet (z. B. <code>hideaddress.net</code>), können Sie diesen Schritt überspringen.</span>
   </div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Herzlichen Glückwunsch!
    </strong>
    <span>
      Sie haben alle Schritte erfolgreich abgeschlossen.
    </span>
  </div>
</div>

### Unterstützen Sie S/MIME-Verschlüsselung {#do-you-support-smime-encryption}

Ja, wir unterstützen die [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME)-Verschlüsselung, wie sie in [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551) definiert ist. S/MIME bietet Ende-zu-Ende-Verschlüsselung mittels X.509-Zertifikaten, die von Unternehmens-E-Mail-Clients weitgehend unterstützt wird.

Wir unterstützen sowohl RSA- als auch ECC-(Elliptic Curve Cryptography)-Zertifikate:

* **RSA-Zertifikate**: mindestens 2048 Bit, empfohlen 4096 Bit
* **ECC-Zertifikate**: P-256, P-384 und P-521 NIST-Kurven

Um die S/MIME-Verschlüsselung für Ihren Alias zu konfigurieren:

1. Beschaffen Sie ein S/MIME-Zertifikat von einer vertrauenswürdigen Zertifizierungsstelle (CA) oder erstellen Sie ein selbstsigniertes Zertifikat zum Testen.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tipp:
     </strong>
     <span>Kostenlose S/MIME-Zertifikate sind bei Anbietern wie <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> oder <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a> erhältlich.</span>
   </div>

2. Exportieren Sie Ihr Zertifikat im PEM-Format (nur das öffentliche Zertifikat, nicht den privaten Schlüssel).

3. Gehen Sie zu <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase (z. B. <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> Bearbeiten <i class="fa fa-angle-right"></i> S/MIME und laden Sie Ihr öffentliches Zertifikat hoch.
4. Sobald konfiguriert, werden alle eingehenden E-Mails an Ihr Alias mit Ihrem S/MIME-Zertifikat verschlüsselt, bevor sie gespeichert oder weitergeleitet werden.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Hinweis:
     </strong>
     <span>
       Die S/MIME-Verschlüsselung wird auf eingehende Nachrichten angewendet, die nicht bereits verschlüsselt sind. Wenn eine Nachricht bereits mit OpenPGP oder S/MIME verschlüsselt ist, wird sie nicht erneut verschlüsselt.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Wichtig:
     </strong>
     <span>
       Die S/MIME-Verschlüsselung wird bei der E-Mail-Weiterleitung über unsere MX-Server nicht angewendet, wenn der Absender eine DMARC-Richtlinie mit "reject" hatte. Wenn Sie S/MIME-Verschlüsselung für <em>alle</em> Mails benötigen, empfehlen wir die Nutzung unseres IMAP-Dienstes und die Konfiguration Ihres S/MIME-Zertifikats für Ihr Alias für eingehende Mails.
     </span>
   </div>

Die folgenden E-Mail-Clients unterstützen S/MIME nativ:

| E-Mail-Client    | Plattform | Hinweise                                                                                                           |
| ---------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| Apple Mail       | macOS    | Eingebaute S/MIME-Unterstützung. Gehen Sie zu Mail > Einstellungen > Accounts > Ihr Konto > Vertrauen, um Zertifikate zu konfigurieren. |
| Apple Mail       | iOS      | Eingebaute S/MIME-Unterstützung. Gehen Sie zu Einstellungen > Mail > Accounts > Ihr Konto > Erweitert > S/MIME, um zu konfigurieren. |
| Microsoft Outlook| Windows  | Eingebaute S/MIME-Unterstützung. Gehen Sie zu Datei > Optionen > Trust Center > Einstellungen für Trust Center > E-Mail-Sicherheit, um zu konfigurieren. |
| Microsoft Outlook| macOS    | Eingebaute S/MIME-Unterstützung. Gehen Sie zu Werkzeuge > Accounts > Erweitert > Sicherheit, um zu konfigurieren.   |
| Thunderbird     | Desktop  | Eingebaute S/MIME-Unterstützung. Gehen Sie zu Kontoeinstellungen > Ende-zu-Ende-Verschlüsselung > S/MIME, um zu konfigurieren. |
| GNOME Evolution | Desktop  | Eingebaute S/MIME-Unterstützung. Gehen Sie zu Bearbeiten > Einstellungen > Mail-Konten > Ihr Konto > Sicherheit, um zu konfigurieren. |
| KMail           | Desktop  | Eingebaute S/MIME-Unterstützung. Gehen Sie zu Einstellungen > KMail konfigurieren > Identitäten > Ihre Identität > Kryptographie, um zu konfigurieren. |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Herzlichen Glückwunsch!
    </strong>
    <span>
      Sie haben die S/MIME-Verschlüsselung für Ihr Alias erfolgreich konfiguriert.
    </span>
  </div>
</div>

### Unterstützen Sie Sieve E-Mail-Filterung {#do-you-support-sieve-email-filtering}

Ja! Wir unterstützen [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) E-Mail-Filterung wie in [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228) definiert. Sieve ist eine leistungsstarke, standardisierte Skriptsprache für serverseitige E-Mail-Filterung, mit der Sie eingehende Nachrichten automatisch organisieren, filtern und beantworten können.

#### Unterstützte Sieve-Erweiterungen {#supported-sieve-extensions}

Wir unterstützen eine umfassende Reihe von Sieve-Erweiterungen:

| Erweiterung                  | RFC                                                                                     | Beschreibung                                    |
| --------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `fileinto`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | Nachrichten in bestimmte Ordner ablegen        |
| `reject` / `ereject`        | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                              | Nachrichten mit einem Fehler ablehnen           |
| `vacation`                  | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                              | Automatische Abwesenheits-/Urlaubsantworten    |
| `vacation-seconds`          | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                              | Feingranulare Intervalle für Abwesenheitsantworten |
| `imap4flags`                | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                              | IMAP-Flags setzen (\Seen, \Flagged, etc.)      |
| `envelope`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | Absender/Empfänger im Umschlag testen           |
| `body`                      | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                              | Inhalt des Nachrichtenkörpers testen            |
| `variables`                 | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                              | Variablen in Skripten speichern und verwenden  |
| `relational`                | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                              | Relationale Vergleiche (größer als, kleiner als) |
| `comparator-i;ascii-numeric`| [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                              | Numerische Vergleiche                           |
| `copy`                      | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                              | Nachrichten beim Weiterleiten kopieren          |
| `editheader`                | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                              | Nachrichten-Header hinzufügen oder löschen      |
| `date`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | Datum/Uhrzeit-Werte testen                      |
| `index`                     | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | Zugriff auf bestimmte Header-Vorkommen          |
| `regex`                     | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex) | Reguläre Ausdrucksübereinstimmung               |
| `enotify`                   | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                              | Benachrichtigungen senden (z.B. mailto:)        |
| `environment`               | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                              | Zugriff auf Umgebungsinformationen              |
| `mailbox`                   | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                              | Postfachexistenz testen, Postfächer erstellen   |
| `special-use`               | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                              | In spezielle Postfächer ablegen (\Junk, \Trash) |
| `duplicate`                 | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                              | Doppelte Nachrichten erkennen                    |
| `ihave`                     | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                              | Verfügbarkeit von Erweiterungen testen           |
| `subaddress`                | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                              | Zugriff auf user+detail Adressteile              |
#### Erweiterungen nicht unterstützt {#extensions-not-supported}

Die folgenden Erweiterungen werden derzeit nicht unterstützt:

| Erweiterung                                                    | Grund                                                               |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| `include`                                                      | Sicherheitsrisiko (Skripteinfügung) und erfordert globalen Skriptspeicher |
| `mboxmetadata` / `servermetadata`                              | Erfordert Unterstützung der IMAP METADATA-Erweiterung             |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | Komplexe MIME-Baum-Manipulation noch nicht implementiert          |

#### Beispiel-Sieve-Skripte {#example-sieve-scripts}

**Newsletter in einen Ordner ablegen:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**Automatische Antwort bei Abwesenheit:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "Ich bin derzeit nicht im Büro und werde nach meiner Rückkehr antworten.";
```

**Nachrichten von wichtigen Absendern markieren:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**Spam mit bestimmten Betreffs ablehnen:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Nachricht aufgrund von Spam-Inhalt abgelehnt.";
}
```

#### Verwaltung von Sieve-Skripten {#managing-sieve-scripts}

Sie können Ihre Sieve-Skripte auf verschiedene Weise verwalten:

1. **Weboberfläche**: Gehen Sie zu <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase <i class="fa fa-angle-right"></i> Sieve-Skripte, um Skripte zu erstellen und zu verwalten.

2. **ManageSieve-Protokoll**: Verbinden Sie sich mit einem ManageSieve-kompatiblen Client (wie dem Sieve-Add-on von Thunderbird oder [sieve-connect](https://github.com/philpennock/sieve-connect)) mit `imap.forwardemail.net`. Verwenden Sie Port `2190` mit STARTTLS (empfohlen für die meisten Clients) oder Port `4190` mit implizitem TLS.

3. **API**: Verwenden Sie unsere [REST API](/api#sieve-scripts), um Skripte programmatisch zu verwalten.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Hinweis:
  </strong>
  <span>
    Die Sieve-Filterung wird auf eingehende Nachrichten angewendet, bevor sie in Ihrem Postfach gespeichert werden. Skripte werden in Prioritätsreihenfolge ausgeführt, und die erste passende Aktion bestimmt, wie die Nachricht behandelt wird.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Sicherheit:
  </strong>
  <span>
    Aus Sicherheitsgründen sind Weiterleitungsaktionen auf 10 pro Skript und 100 pro Tag begrenzt. Abwesenheitsantworten sind zur Missbrauchsvermeidung rate-begrenzt.
  </span>
</div>

### Unterstützen Sie MTA-STS? {#do-you-support-mta-sts}

Ja, seit dem 2. März 2023 unterstützen wir [MTA-STS](https://www.hardenize.com/blog/mta-sts). Sie können [diese Vorlage](https://github.com/jpawlowski/mta-sts.template) verwenden, wenn Sie es auf Ihrer Domain aktivieren möchten.

Unsere Konfiguration ist öffentlich auf GitHub unter <https://github.com/forwardemail/mta-sts.forwardemail.net> verfügbar.

### Unterstützen Sie Passkeys und WebAuthn? {#do-you-support-passkeys-and-webauthn}

Ja! Seit dem 13. Dezember 2023 haben wir aufgrund hoher Nachfrage [Passkeys](https://github.com/orgs/forwardemail/discussions/182) unterstützt.

Passkeys ermöglichen es Ihnen, sich sicher anzumelden, ohne ein Passwort und eine Zwei-Faktor-Authentifizierung zu benötigen.

Sie können Ihre Identität per Touch, Gesichtserkennung, gerätebasiertem Passwort oder PIN bestätigen.

Wir erlauben Ihnen, bis zu 30 Passkeys gleichzeitig zu verwalten, damit Sie sich mit all Ihren Geräten problemlos anmelden können.

Erfahren Sie mehr über Passkeys unter den folgenden Links:

* [Melden Sie sich bei Ihren Anwendungen und Websites mit Passkeys an](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Verwenden Sie Passkeys, um sich auf iPhone bei Apps und Websites anzumelden](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Wikipedia-Artikel zu Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### Unterstützen Sie bewährte E-Mail-Praktiken {#do-you-support-email-best-practices}

Ja. Wir haben integrierte Unterstützung für SPF, DKIM, DMARC, ARC und SRS in allen Tarifen. Wir haben auch intensiv mit den ursprünglichen Autoren dieser Spezifikationen und anderen E-Mail-Experten zusammengearbeitet, um Perfektion und hohe Zustellbarkeit sicherzustellen.

### Unterstützen Sie Bounce-Webhooks {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
    Suchen Sie nach Dokumentation zu E-Mail-Webhooks? Siehe <a href="/faq#do-you-support-webhooks" class="alert-link">Unterstützen Sie Webhooks?</a> für weitere Einblicke.
  <span>
  </span>
</div>

Ja, seit dem 14. August 2024 haben wir diese Funktion hinzugefügt. Sie können jetzt zu Mein Konto → Domains → Einstellungen → Bounce Webhook URL gehen und eine `http://` oder `https://` URL konfigurieren, an die wir eine `POST`-Anfrage senden, wann immer ausgehende SMTP-E-Mails zurückgewiesen werden.

Dies ist nützlich, um Ihren ausgehenden SMTP-Verkehr zu verwalten und zu überwachen – und kann verwendet werden, um Abonnenten zu verwalten, Opt-outs durchzuführen und zu erkennen, wann Bounces auftreten.

Bounce-Webhook-Payloads werden als JSON mit folgenden Eigenschaften gesendet:

* `email_id` (String) - E-Mail-ID, die einer E-Mail in Mein Konto → E-Mails (ausgehender SMTP) entspricht
* `list_id` (String) - der Wert des `List-ID` Headers (Groß-/Kleinschreibung ignoriert), falls vorhanden, aus der ursprünglichen ausgehenden E-Mail
* `list_unsubscribe` (String) - der Wert des `List-Unsubscribe` Headers (Groß-/Kleinschreibung ignoriert), falls vorhanden, aus der ursprünglichen ausgehenden E-Mail
* `feedback_id` (String) - der Wert des `Feedback-ID` Headers (Groß-/Kleinschreibung ignoriert), falls vorhanden, aus der ursprünglichen ausgehenden E-Mail
* `recipient` (String) - die E-Mail-Adresse des Empfängers, der zurückgewiesen oder fehlerhaft war
* `message` (String) - eine detaillierte Fehlermeldung für den Bounce
* `response` (String) - die SMTP-Antwortnachricht
* `response_code` (Number) - der analysierte SMTP-Antwortcode
* `truth_source` (String) - wenn der Antwortcode von einer vertrauenswürdigen Quelle stammt, wird dieser Wert mit dem Root-Domainnamen gefüllt (z.B. `google.com` oder `yahoo.com`)
* `bounce` (Object) - ein Objekt mit folgenden Eigenschaften, die den Bounce- und Ablehnungsstatus detaillieren
  * `action` (String) - Bounce-Aktion (z.B. `"reject"`)
  * `message` (String) - Bounce-Grund (z.B. `"Message Sender Blocked By Receiving Server"`)
  * `category` (String) - Bounce-Kategorie (z.B. `"block"`)
  * `code` (Number) - Bounce-Statuscode (z.B. `554`)
  * `status` (String) - Bounce-Code aus der Antwortnachricht (z.B. `5.7.1`)
  * `line` (Number) - analysierte Zeilennummer, falls vorhanden, [aus der Zone-MTA Bounce-Parse-Liste](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (z.B. `526`)
* `headers` (Object) - Schlüssel-Wert-Paare der Header für die ausgehende E-Mail
* `bounced_at` (String) - [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) formatiertes Datum, wann der Bounce-Fehler auftrat

Zum Beispiel:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "Das E-Mail-Konto, das Sie zu erreichen versucht haben, hat sein Kontingent überschritten.",
  "response": "552 5.2.2 Das E-Mail-Konto, das Sie zu erreichen versucht haben, hat sein Kontingent überschritten.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Gmail-Postfach ist voll",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

Hier sind einige zusätzliche Hinweise zu Bounce-Webhooks:

* Wenn die Webhook-Payload einen `list_id`, `list_unsubscribe` oder `feedback_id` Wert enthält, sollten Sie geeignete Maßnahmen ergreifen, um den `recipient` gegebenenfalls aus der Liste zu entfernen.
  * Wenn der Wert von `bounce.category` einer der Werte `"block"`, `"recipient"`, `"spam"` oder `"virus"` war, sollten Sie den Benutzer definitiv aus der Liste entfernen.
* Wenn Sie Webhook-Payloads verifizieren müssen (um sicherzustellen, dass sie tatsächlich von unserem Server stammen), können Sie [die Remote-Client-IP-Adresse und den Hostnamen des Clients mit einer Reverse-Lookup-Abfrage auflösen](https://nodejs.org/api/dns.html#dnspromisesreverseip) – sie sollte `smtp.forwardemail.net` sein.
  * Sie können die IP auch gegen [unsere veröffentlichten IP-Adressen](#what-are-your-servers-ip-addresses) prüfen.
  * Gehen Sie zu Mein Konto → Domains → Einstellungen → Webhook Signature Payload Verification Key, um Ihren Webhook-Schlüssel zu erhalten.
    * Sie können diesen Schlüssel jederzeit aus Sicherheitsgründen rotieren.
    * Berechnen und vergleichen Sie den Wert `X-Webhook-Signature` aus unserer Webhook-Anfrage mit dem berechneten Body-Wert unter Verwendung dieses Schlüssels. Ein Beispiel, wie dies zu tun ist, finden Sie in [diesem Stack Overflow-Beitrag](https://stackoverflow.com/a/68885281).
  * Siehe die Diskussion unter <https://github.com/forwardemail/free-email-forwarding/issues/235> für weitere Einblicke.
* Wir warten bis zu `5` Sekunden auf eine Antwort Ihres Webhook-Endpunkts mit einem `200` Statuscode und versuchen es bis zu `1` Mal erneut.
* Wenn wir feststellen, dass Ihre Bounce-Webhook-URL einen Fehler aufweist, während wir versuchen, eine Anfrage zu senden, senden wir Ihnen einmal pro Woche eine höfliche E-Mail.
### Unterstützen Sie Webhooks {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
    Suchen Sie Dokumentation zu Bounce-Webhooks? Siehe <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Unterstützen Sie Bounce-Webhooks?</a> für weitere Einblicke.
  <span>
  </span>
</div>

Ja, seit dem 15. Mai 2020 haben wir diese Funktion hinzugefügt. Sie können Webhook(s) einfach genauso hinzufügen, wie Sie es bei jedem Empfänger tun würden! Bitte stellen Sie sicher, dass die URL des Webhooks mit dem Protokoll "http" oder "https" beginnt.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Verbesserter Datenschutz:
  </strong>
  <span>
    Wenn Sie einen kostenpflichtigen Tarif nutzen (der verbesserten Datenschutz bietet), gehen Sie bitte zu <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> und klicken Sie neben Ihrer Domain auf "Aliase", um Ihre Webhooks zu konfigurieren. Wenn Sie mehr über kostenpflichtige Tarife erfahren möchten, besuchen Sie unsere <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Preisseite</a>. Andernfalls können Sie den untenstehenden Anweisungen folgen.
  </span>
</div>

Wenn Sie den kostenlosen Tarif nutzen, fügen Sie einfach einen neuen DNS-<strong class="notranslate">TXT</strong>-Eintrag wie unten gezeigt hinzu:

Zum Beispiel, wenn ich alle E-Mails, die an `alias@example.com` gehen, an einen neuen [Request Bin](https://requestbin.com/r/en8pfhdgcculn?inspect) Test-Endpunkt weiterleiten möchte:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

Oder vielleicht möchten Sie, dass alle E-Mails, die an `example.com` gehen, an diesen Endpunkt weitergeleitet werden:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

**Hier sind zusätzliche Hinweise zu Webhooks:**

* Wenn Sie Webhook-Payloads verifizieren müssen (um sicherzustellen, dass sie tatsächlich von unserem Server stammen), können Sie [die Remote-Client-IP-Adresse bzw. den Client-Hostnamen mittels Reverse Lookup auflösen](https://nodejs.org/api/dns.html#dnspromisesreverseip) – dieser sollte entweder `mx1.forwardemail.net` oder `mx2.forwardemail.net` sein.
  * Sie können die IP auch mit [unseren veröffentlichten IP-Adressen](#what-are-your-servers-ip-addresses) abgleichen.
  * Wenn Sie einen kostenpflichtigen Tarif nutzen, gehen Sie zu Mein Konto → Domains → Einstellungen → Webhook Signature Payload Verification Key, um Ihren Webhook-Schlüssel zu erhalten.
    * Sie können diesen Schlüssel jederzeit aus Sicherheitsgründen rotieren.
    * Berechnen und vergleichen Sie den Wert von `X-Webhook-Signature` aus unserer Webhook-Anfrage mit dem berechneten Body-Wert unter Verwendung dieses Schlüssels. Ein Beispiel, wie dies funktioniert, finden Sie in [diesem Stack Overflow-Beitrag](https://stackoverflow.com/a/68885281).
  * Weitere Einblicke finden Sie in der Diskussion unter <https://github.com/forwardemail/free-email-forwarding/issues/235>.
* Wenn ein Webhook nicht mit einem `200` Statuscode antwortet, speichern wir dessen Antwort im [erstellten Fehlerprotokoll](#do-you-store-error-logs) – was für die Fehlersuche nützlich ist.
* Webhook-HTTP-Anfragen werden bis zu 3 Mal bei jedem SMTP-Verbindungsversuch erneut gesendet, mit einem maximalen Timeout von 60 Sekunden pro POST-Anfrage an den Endpunkt. **Beachten Sie, dass dies nicht bedeutet, dass nur 3 Versuche unternommen werden**, tatsächlich wird kontinuierlich über die Zeit erneut versucht, indem nach dem 3. fehlgeschlagenen HTTP-POST-Versuch ein SMTP-Code 421 gesendet wird (was dem Absender signalisiert, später erneut zu versuchen). Das bedeutet, die E-Mail wird über Tage hinweg kontinuierlich erneut versucht, bis ein 200 Statuscode erreicht wird.
* Wir versuchen automatisch basierend auf den Standardstatus- und Fehlercodes, die in der [Retry-Methode von superagent](https://ladjs.github.io/superagent/#retrying-requests) verwendet werden (wir sind Maintainer).
* Wir bündeln Webhook-HTTP-Anfragen an denselben Endpunkt in einer einzigen Anfrage (statt mehreren), um Ressourcen zu sparen und die Antwortzeit zu beschleunigen. Wenn Sie beispielsweise eine E-Mail an <webhook1@example.com>, <webhook2@example.com> und <webhook3@example.com> senden und alle auf denselben *exakten* Endpunkt-URL konfiguriert sind, wird nur eine Anfrage gesendet. Die Gruppierung erfolgt durch exakte Übereinstimmung des Endpunkts mit strenger Gleichheit.
* Beachten Sie, dass wir die "simpleParser"-Methode der [mailparser](https://nodemailer.com/extras/mailparser/) Bibliothek verwenden, um die Nachricht in ein JSON-freundliches Objekt zu parsen.
* Der rohe E-Mail-Wert als String wird als Eigenschaft "raw" bereitgestellt.
* Authentifizierungsergebnisse werden als Eigenschaften "dkim", "spf", "arc", "dmarc" und "bimi" bereitgestellt.
* Die geparsten E-Mail-Header werden als Eigenschaft "headers" bereitgestellt – beachten Sie auch, dass Sie "headerLines" für einfacheres Iterieren und Parsen verwenden können.
* Die gruppierten Empfänger für diesen Webhook sind zusammengefasst und als Eigenschaft "recipients" angegeben.
* Die SMTP-Sitzungsinformationen werden als Eigenschaft "session" bereitgestellt. Diese enthält Informationen über den Absender der Nachricht, die Ankunftszeit der Nachricht, HELO und den Client-Hostnamen. Der Client-Hostname-Wert als `session.clientHostname` ist entweder der FQDN (aus einem Reverse-PTR-Lookup) oder `session.remoteAddress` in Klammern (z.B. `"[127.0.0.1]"`).
* Wenn Sie schnell den Wert von `X-Original-To` erhalten möchten, können Sie den Wert von `session.recipient` verwenden (siehe Beispiel unten). Der Header `X-Original-To` ist ein Header, den wir Nachrichten zur Fehlerbehebung mit dem ursprünglichen Empfänger (vor der maskierten Weiterleitung) hinzufügen.
* Wenn Sie `attachments` und/oder `raw` Eigenschaften aus dem Payload-Body entfernen möchten, fügen Sie einfach `?attachments=false`, `?raw=false` oder `?attachments=false&raw=false` als Querystring-Parameter zu Ihrem Webhook-Endpunkt hinzu (z.B. `https://example.com/webhook?attachments=false&raw=false`).
* Wenn Anhänge vorhanden sind, werden diese dem `attachments` Array mit Buffer-Werten hinzugefügt. Sie können diese mit einem JavaScript-Ansatz wie folgt wieder in Inhalte parsen:
  ```js
  const data = [
    104,
    101,
    108,
    108,
    111,
    32,
    119,
    111,
    114,
    108,
    100,
    33
  ];

  //
  // outputs "hello world!" to the console
  // (this is the content from the filename "text1.txt" in the example JSON request payload above)
  //
  console.log(Buffer.from(data).toString());
  ```

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Curious what the webhook request looks like from forwarded emails?  We've included an example below for you!
  <span>
  </span>
</div>

```json
{
  "attachments": [
    {
      "type": "attachment",
      "content": {
        "type": "Buffer",
        "data": [
          104,
          101,
          108,
          108,
          111,
          32,
          119,
          111,
          114,
          108,
          100,
          33
        ]
      },
      "contentType": "text/plain",
      "partId": "2",
      "release": null,
      "contentDisposition": "attachment",
      "filename": "text1.txt",
      "headers": {},
      "checksum": "fc3ff98e8c6a0d3087d515c0473f8677",
      "size": 12
    }
  ],
  "headers": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\n",
  "headerLines": [
    {
      "key": "arc-seal",
      "line": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0="
    },
    {
      "key": "arc-message-signature",
      "line": "ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino="
    },
    {
      "key": "arc-authentication-results",
      "line": "ARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "received-spf",
      "line": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;"
    },
    {
      "key": "authentication-results",
      "line": "Authentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "x-forward-email-sender",
      "line": "X-Forward-Email-Sender: rfc822; test@example.net"
    },
    {
      "key": "x-forward-email-session-id",
      "line": "X-Forward-Email-Session-ID: w2czxgznghn5ryyw"
    },
    {
      "key": "x-forward-email-version",
      "line": "X-Forward-Email-Version: 9.0.0"
    },
    {
      "key": "content-type",
      "line": "Content-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\""
    },
    {
      "key": "from",
      "line": "From: some <random@example.com>"
    },
    {
      "key": "message-id",
      "line": "Message-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>"
    },
    {
      "key": "date",
      "line": "Date: Wed, 25 May 2022 19:26:41 +0000"
    },
    {
      "key": "mime-version",
      "line": "MIME-Version: 1.0"
    }
  ],
  "html": "<strong>some random text</strong>",
  "text": "some random text",
  "textAsHtml": "<p>some random text</p>",
  "date": "2022-05-25T19:26:41.000Z",
  "from": {
    "value": [
      {
        "address": "random@example.com",
        "name": "some"
      }
    ],
    "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">some</span> &lt;<a href=\"mailto:random@example.com\" class=\"mp_address_email\">random@example.com</a>&gt;</span>",
    "text": "some <random@example.com>"
  },
  "messageId": "<69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>",
  "raw": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nX-Forward-Email-Sender: rfc822; test@example.net\r\nX-Forward-Email-Session-ID: w2czxgznghn5ryyw\r\nX-Forward-Email-Version: 9.0.0\r\nContent-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\"\r\nFrom: some <random@example.com>\r\nMessage-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>\r\nDate: Wed, 25 May 2022 19:26:41 +0000\r\nMIME-Version: 1.0\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: multipart/alternative;\r\n boundary=\"--_NmP-179a735428ca7575-Part_2\"\r\n\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\nsome random text\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\n<strong>some random text</strong>\r\n----_NmP-179a735428ca7575-Part_2--\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: text/plain; name=text1.txt\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=text1.txt\r\n\r\naGVsbG8gd29ybGQh\r\n----_NmP-179a735428ca7575-Part_1--\r\n",
  "dkim": {
    "headerFrom": [
      "random@example.com"
    ],
    "envelopeFrom": "test@example.net",
    "results": [
      {
        "status": {
          "result": "none",
          "comment": "message not signed"
        },
        "info": "dkim=none (message not signed)"
      }
    ]
  },
  "spf": {
    "domain": "example.net",
    "client-ip": "127.0.0.1",
    "helo": "user.oem.local",
    "envelope-from": "test@example.net",
    "status": {
      "result": "none",
      "comment": "mx1.forwardemail.net: example.net does not designate permitted sender hosts",
      "smtp": {
        "mailfrom": "test@example.net",
        "helo": "user.oem.local"
      }
    },
    "header": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;",
    "info": "spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local",
    "lookups": {
      "limit": 50,
      "count": 1
    }
  },
  "arc": {
    "status": {
      "result": "none"
    },
    "i": 0,
    "authResults": "mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
  },
  "dmarc": {
    "status": {
      "result": "none",
      "header": {
        "from": "example.com"
      }
    },
    "domain": "example.com",
    "info": "dmarc=none header.from=example.com"
  },
  "bimi": {
    "status": {
      "header": {},
      "result": "skipped",
      "comment": "DMARC not enabled"
    },
    "info": "bimi=skipped (DMARC not enabled)"
  },
  "recipients": [
    "webhook1@webhooks.net"
  ],
  "session": {
    "recipient": "webhook1@webhooks.net",
    "remoteAddress": "127.0.0.1",
    "remotePort": 65138,
    "clientHostname": "[127.0.0.1]",
    "hostNameAppearsAs": "user.oem.local",
    "sender": "test@example.net",
    "mta": "mx1.forwardemail.net",
    "arrivalDate": "2022-05-25T19:26:41.423Z",
    "arrivalTime": 1653506801423
  }
}
```

### Unterstützen Sie reguläre Ausdrücke oder Regex {#do-you-support-regular-expressions-or-regex}

Ja, seit dem 27. September 2021 haben wir diese Funktion hinzugefügt. Sie können einfach reguläre Ausdrücke ("Regex") schreiben, um Aliase abzugleichen und Ersetzungen durchzuführen.

Reguläre Ausdrücke unterstützende Aliase sind solche, die mit einem `/` beginnen und mit einem `/` enden und deren Empfänger E-Mail-Adressen oder Webhooks sind. Die Empfänger können auch Regex-Ersetzungsunterstützung enthalten (z.B. `$1`, `$2`).

Wir unterstützen zwei reguläre Ausdrucks-Flags, darunter `i` und `g`. Das case-insensitive Flag `i` ist eine permanente Voreinstellung und wird immer durchgesetzt. Das globale Flag `g` kann von Ihnen hinzugefügt werden, indem Sie das abschließende `/` mit `/g` versehen.

Beachten Sie, dass wir auch unsere <a href="#can-i-disable-specific-aliases">Deaktivierte Alias-Funktion</a> für den Empfängerbereich mit unserer Regex-Unterstützung unterstützen.

Reguläre Ausdrücke werden bei <a href="/disposable-addresses" target="_blank">globalen Vanity-Domains</a> nicht unterstützt (da dies eine Sicherheitslücke darstellen könnte).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Verbesserter Datenschutz:
  </strong>
  <span>
    Wenn Sie einen kostenpflichtigen Plan nutzen (der verbesserten Datenschutz bietet), gehen Sie bitte zu <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> und klicken Sie neben Ihrer Domain auf "Aliase", um Aliase zu konfigurieren, einschließlich solcher mit regulären Ausdrücken. Wenn Sie mehr über kostenpflichtige Pläne erfahren möchten, sehen Sie unsere <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Preise</a>-Seite.
  </span>
</div>

#### Beispiele für verbesserten Datenschutz {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Alias-Name</th>
      <th>Effekt</th>
      <th>Test</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>E-Mails an `linus@example.com` oder `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">Test auf RegExr ansehen</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>E-Mails an `24highst@example.com` oder `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">Test auf RegExr ansehen</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
    Um diese bei <a href="https://regexr.com" class="alert-link">RegExr</a> zu testen, schreiben Sie den Ausdruck in das obere Feld und geben Sie dann einen Beispiel-Alias in das darunterliegende Textfeld ein. Wenn er übereinstimmt, wird er blau.
  <span>
  </span>
</div>

#### Beispiele für den kostenlosen Plan {#examples-for-the-free-plan}

Wenn Sie den kostenlosen Plan nutzen, fügen Sie einfach einen neuen DNS-<strong class="notranslate">TXT</strong>-Eintrag mit einem oder mehreren der unten angegebenen Beispiele hinzu:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Einfaches Beispiel:</strong> Wenn ich möchte, dass alle E-Mails, die an `linus@example.com` oder `torvalds@example.com` gehen, an `user@gmail.com` weitergeleitet werden:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Beispiel für Vorname Nachname Ersetzung:</strong> Stellen Sie sich vor, alle Ihre Firmen-E-Mail-Adressen haben das Muster `vorname.nachname@example.com`. Wenn ich möchte, dass alle E-Mails, die dem Muster `vorname.nachname@example.com` entsprechen, an `vorname.nachname@company.com` mit Ersetzungsunterstützung weitergeleitet werden (<a href="https://regexr.com/66hnu" class="alert-link">Test auf RegExr ansehen</a>):
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Plus-Symbol-Filterersetzungsbeispiel:</strong> Wenn ich möchte, dass alle E-Mails, die an `info@example.com` oder `support@example.com` gehen, jeweils an `user+info@gmail.com` oder `user+support@gmail.com` weitergeleitet werden (mit Ersetzungsunterstützung) (<a href="https://regexr.com/66ho7" class="alert-link">Test auf RegExr ansehen</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Webhook-Querystring-Ersetzungsbeispiel:</strong> Vielleicht möchten Sie, dass alle E-Mails, die an `example.com` gehen, an einen <a href="#do-you-support-webhooks" class="alert-link">Webhook</a> gesendet werden und einen dynamischen Querystring-Schlüssel "to" mit dem Wert des Benutzernamensanteils der E-Mail-Adresse haben (<a href="https://regexr.com/66ho4" class="alert-link">Test auf RegExr ansehen</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Beispiel für stilles Ablehnen:</strong> Wenn Sie möchten, dass alle E-Mails, die einem bestimmten Muster entsprechen, deaktiviert und still abgelehnt werden (erscheint für den Absender, als ob die Nachricht erfolgreich gesendet wurde, geht aber tatsächlich nirgendwo hin) mit Statuscode `250` (siehe <a href="#can-i-disable-specific-aliases" class="alert-link">Kann ich bestimmte Aliase deaktivieren</a>), dann verwenden Sie einfach denselben Ansatz mit einem einzelnen Ausrufezeichen "!". Dies signalisiert dem Absender, dass die Nachricht erfolgreich zugestellt wurde, sie aber tatsächlich nirgendwohin gelangte (z.B. Blackhole oder `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Beispiel für weiches Ablehnen:</strong> Wenn Sie möchten, dass alle E-Mails, die einem bestimmten Muster entsprechen, deaktiviert und mit Statuscode `421` weich abgelehnt werden (siehe <a href="#can-i-disable-specific-aliases" class="alert-link">Kann ich bestimmte Aliase deaktivieren</a>), dann verwenden Sie einfach denselben Ansatz mit einem doppelten Ausrufezeichen "!!". Dies signalisiert dem Absender, seine E-Mail erneut zu versuchen, und E-Mails an diesen Alias werden etwa 5 Tage lang erneut versucht und dann dauerhaft abgelehnt.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Beispiel für harte Ablehnung:</strong> Wenn Sie möchten, dass alle E-Mails, die einem bestimmten Muster entsprechen, deaktiviert und mit dem Statuscode `550` hart abgelehnt werden (siehe <a href="#can-i-disable-specific-aliases" class="alert-link">Kann ich bestimmte Aliase deaktivieren</a>), verwenden Sie einfach denselben Ansatz mit drei Ausrufezeichen "!!!". Dies signalisiert dem Absender einen dauerhaften Fehler und die E-Mails werden nicht erneut versucht, sondern für diesen Alias abgelehnt.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
    Neugierig, wie man einen regulären Ausdruck schreibt oder möchten Sie Ihre Ersetzung testen? Sie können die kostenlose Website zum Testen regulärer Ausdrücke <a href="https://regexr.com" class="alert-link">RegExr</a> unter <a href="https://regexr.com/" class="alert-link">https://regexr.com</a> besuchen.
  <span>
  </span>
</div>

### Was sind Ihre ausgehenden SMTP-Limits {#what-are-your-outbound-smtp-limits}

Wir begrenzen Benutzer und Domains auf 300 ausgehende SMTP-Nachrichten pro Tag. Das entspricht durchschnittlich über 9000 E-Mails in einem Kalendermonat. Wenn Sie diese Menge überschreiten müssen oder regelmäßig große E-Mails versenden, dann [kontaktieren Sie uns](https://forwardemail.net/help).

### Benötige ich eine Genehmigung, um SMTP zu aktivieren {#do-i-need-approval-to-enable-smtp}

Ja, bitte beachten Sie, dass Forward Email zur Wahrung des IP-Rufs und zur Sicherstellung der Zustellbarkeit einen manuellen Überprüfungsprozess pro Domain für die Genehmigung des ausgehenden SMTP hat. Senden Sie eine E-Mail an <support@forwardemail.net> oder eröffnen Sie eine [Hilfsanfrage](https://forwardemail.net/help) zur Genehmigung. Dies dauert in der Regel weniger als 24 Stunden, wobei die meisten Anfragen innerhalb von 1-2 Stunden bearbeitet werden. In naher Zukunft wollen wir diesen Prozess mit zusätzlichen Spam-Kontrollen und Benachrichtigungen sofortig machen. Dieser Prozess stellt sicher, dass Ihre E-Mails im Posteingang ankommen und Ihre Nachrichten nicht als Spam markiert werden.

### Was sind Ihre SMTP-Server-Konfigurationseinstellungen {#what-are-your-smtp-server-configuration-settings}

Unser Server ist `smtp.forwardemail.net` und wird auch auf unserer <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">Statusseite</a> überwacht.

Er unterstützt sowohl IPv4 als auch IPv6 und ist über die Ports `465` und `2465` für SSL/TLS (empfohlen) sowie `587`, `2587`, `2525` und `25` für TLS (STARTTLS) erreichbar.

**Ab Oktober 2025** unterstützen wir nun **Legacy TLS 1.0** Verbindungen auf den Ports `2455` (SSL/TLS) und `2555` (STARTTLS) für ältere Geräte wie Drucker, Scanner, Kameras und ältere E-Mail-Clients, die keine modernen TLS-Versionen unterstützen können. Diese Ports werden als Alternative zu Gmail, Yahoo, Outlook und anderen Anbietern bereitgestellt, die die Unterstützung für ältere TLS-Protokolle eingestellt haben.

> \[!CAUTION]
> **Legacy TLS 1.0 Unterstützung (Ports 2455 und 2555)**: Diese Ports verwenden das veraltete TLS 1.0-Protokoll, das bekannte Sicherheitslücken (BEAST, POODLE) aufweist. Verwenden Sie diese Ports nur, wenn Ihr Gerät TLS 1.2 oder höher absolut nicht unterstützt. Wir empfehlen dringend, die Firmware Ihres Geräts zu aktualisieren oder auf moderne E-Mail-Clients umzusteigen, wann immer dies möglich ist. Diese Ports sind ausschließlich für die Kompatibilität mit Legacy-Hardware (alte Drucker, Scanner, Kameras, IoT-Geräte) vorgesehen.

|                                     Protokoll                                     | Hostname                |            Ports            |        IPv4        |        IPv6        | Hinweise                               |
| :------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | ------------------------------------- |
|                              `SSL/TLS` **Bevorzugt**                             | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | Modernes TLS 1.2+ (Empfohlen)         |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | Unterstützt (bevorzugen Sie SSL/TLS Port `465`) |
|                             `SSL/TLS` **Nur Legacy**                            | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 nur für alte Geräte |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **Nur Legacy** | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 nur für alte Geräte |
| Login    | Beispiel                  | Beschreibung                                                                                                                                                                             |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Benutzername | `user@example.com`         | E-Mail-Adresse eines Alias, der für die Domain unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> existiert. |
| Passwort | `************************` | Alias                                                                                                                                                                                     |

Um ausgehende E-Mails mit SMTP zu senden, muss der **SMTP-Benutzer** die E-Mail-Adresse eines Alias sein, der für die Domain unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> existiert – und das **SMTP-Passwort** muss ein alias-spezifisch generiertes Passwort sein.

Bitte siehe [Unterstützen Sie das Senden von E-Mails mit SMTP](#do-you-support-sending-email-with-smtp) für Schritt-für-Schritt-Anleitungen.

### Wie lauten Ihre IMAP-Server-Konfigurationseinstellungen {#what-are-your-imap-server-configuration-settings}

Unser Server ist `imap.forwardemail.net` und wird auch auf unserer <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">Statusseite</a> überwacht.

Er unterstützt sowohl IPv4 als auch IPv6 und ist über die Ports `993` und `2993` für SSL/TLS verfügbar.

|         Protokoll        | Hostname                |     Ports     |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Bevorzugt** | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Login    | Beispiel                  | Beschreibung                                                                                                                                                                             |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Benutzername | `user@example.com`         | E-Mail-Adresse eines Alias, der für die Domain unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> existiert. |
| Passwort | `************************` | Alias-spezifisch generiertes Passwort.                                                                                                                                                    |

Um sich mit IMAP zu verbinden, muss der **IMAP-Benutzer** die E-Mail-Adresse eines Alias sein, der für die Domain unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> existiert – und das **IMAP-Passwort** muss ein alias-spezifisch generiertes Passwort sein.

Bitte siehe [Unterstützen Sie das Empfangen von E-Mails mit IMAP](#do-you-support-receiving-email-with-imap) für Schritt-für-Schritt-Anleitungen.

### Wie lauten Ihre POP3-Server-Konfigurationseinstellungen {#what-are-your-pop3-server-configuration-settings}

Unser Server ist `pop3.forwardemail.net` und wird auch auf unserer <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">Statusseite</a> überwacht.

Er unterstützt sowohl IPv4 als auch IPv6 und ist über die Ports `995` und `2995` für SSL/TLS verfügbar.

|         Protokoll        | Hostname                |     Ports     |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Bevorzugt** | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |
| Login    | Beispiel                   | Beschreibung                                                                                                                                                                              |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Benutzername | `user@example.com`         | E-Mail-Adresse eines Alias, der für die Domain unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> existiert. |
| Passwort | `************************` | Alias-spezifisch generiertes Passwort.                                                                                                                                                    |

Um sich mit POP3 zu verbinden, muss der **POP3-Benutzer** die E-Mail-Adresse eines Alias sein, der für die Domain unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> existiert – und das **IMAP-Passwort** muss ein alias-spezifisch generiertes Passwort sein.

Bitte siehe [Unterstützen Sie POP3](#do-you-support-pop3) für Schritt-für-Schritt-Anleitungen.

### Wie richte ich die E-Mail-Autodiscovery für meine Domain ein {#how-do-i-set-up-email-autodiscovery-for-my-domain}

Die E-Mail-Autodiscovery ermöglicht es E-Mail-Clients wie **Thunderbird**, **Apple Mail**, **Microsoft Outlook** und mobilen Geräten, automatisch die korrekten IMAP-, SMTP-, POP3-, CalDAV- und CardDAV-Servereinstellungen zu erkennen, wenn ein Benutzer sein E-Mail-Konto hinzufügt. Dies ist definiert durch [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (E-Mail) und [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) und verwendet DNS-SRV-Einträge.

Forward Email veröffentlicht Autodiscovery-Einträge auf `forwardemail.net`. Sie können entweder SRV-Einträge direkt zu Ihrer Domain hinzufügen oder eine einfachere CNAME-Methode verwenden.

#### Option A: CNAME-Einträge (einfachste) {#option-a-cname-records-simplest}

Fügen Sie diese zwei CNAME-Einträge zum DNS Ihrer Domain hinzu. Dies delegiert die Autodiscovery an die Server von Forward Email:

|  Typ  | Name/Host      | Ziel/Wert                      |
| :---: | -------------- | ------------------------------ |
| CNAME | `autoconfig`   | `autoconfig.forwardemail.net`  |
| CNAME | `autodiscover` | `autodiscover.forwardemail.net` |

Der `autoconfig`-Eintrag wird von **Thunderbird** und anderen Mozilla-basierten Clients verwendet. Der `autodiscover`-Eintrag wird von **Microsoft Outlook** verwendet.

#### Option B: SRV-Einträge (direkt) {#option-b-srv-records-direct}

Wenn Sie die Einträge lieber direkt hinzufügen möchten (oder Ihr DNS-Anbieter keine CNAME-Einträge für Subdomains unterstützt), fügen Sie diese SRV-Einträge zu Ihrer Domain hinzu:

| Typ | Name/Host           | Priorität | Gewicht | Port | Ziel/Wert                  | Zweck                                  |
| :--: | ------------------- | :-------: | :-----: | :--: | -------------------------- | ------------------------------------- |
|  SRV | `_imaps._tcp`       |     0     |    1    |  993 | `imap.forwardemail.net`    | IMAP über SSL/TLS (bevorzugt)         |
|  SRV | `_imap._tcp`        |     0     |    0    |   0  | `.`                        | Klartext-IMAP deaktiviert              |
|  SRV | `_submissions._tcp` |     0     |    1    |  465 | `smtp.forwardemail.net`    | SMTP-Einreichung (SSL/TLS, empfohlen) |
|  SRV | `_submission._tcp`  |     5     |    1    |  587 | `smtp.forwardemail.net`    | SMTP-Einreichung (STARTTLS)            |
|  SRV | `_pop3s._tcp`       |    10     |    1    |  995 | `pop3.forwardemail.net`    | POP3 über SSL/TLS                      |
|  SRV | `_pop3._tcp`        |     0     |    0    |   0  | `.`                        | Klartext-POP3 deaktiviert              |
|  SRV | `_caldavs._tcp`     |     0     |    1    |  443 | `caldav.forwardemail.net`  | CalDAV über TLS (Kalender)             |
|  SRV | `_caldav._tcp`      |     0     |    0    |   0  | `.`                        | Klartext-CalDAV deaktiviert            |
|  SRV | `_carddavs._tcp`    |     0     |    1    |  443 | `carddav.forwardemail.net` | CardDAV über TLS (Kontakte)            |
|  SRV | `_carddav._tcp`     |     0     |    0    |   0  | `.`                        | Klartext-CardDAV deaktiviert           |
> \[!NOTE]
> IMAP hat einen niedrigeren Prioritätswert (0) als POP3 (10), was E-Mail-Clients anweist, IMAP gegenüber POP3 zu bevorzugen, wenn beide verfügbar sind. Die Einträge mit einem Ziel von `.` (ein einzelner Punkt) zeigen an, dass die Klartext- (nicht verschlüsselten) Versionen dieser Protokolle gemäß [RFC 6186 Abschnitt 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4) absichtlich deaktiviert sind. Die CalDAV- und CardDAV-SRV-Einträge folgen [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) für die automatische Erkennung von Kalender- und Kontaktservern.

#### Welche E-Mail-Clients unterstützen die automatische Erkennung? {#which-email-clients-support-autodiscovery}

| Client             | E-Mail                                           | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | `autoconfig` CNAME- oder SRV-Einträge           | `autoconfig` XML- oder SRV-Einträge (RFC 6764) |
| Apple Mail (macOS) | SRV-Einträge (RFC 6186)                          | SRV-Einträge (RFC 6764)                     |
| Apple Mail (iOS)   | SRV-Einträge (RFC 6186)                          | SRV-Einträge (RFC 6764)                     |
| Microsoft Outlook  | `autodiscover` CNAME- oder `_autodiscover._tcp` SRV | Nicht unterstützt                          |
| GNOME (Evolution)  | SRV-Einträge (RFC 6186)                          | SRV-Einträge (RFC 6764)                     |
| KDE (KMail)        | SRV-Einträge (RFC 6186)                          | SRV-Einträge (RFC 6764)                     |
| eM Client          | `autoconfig` oder `autodiscover`                 | SRV-Einträge (RFC 6764)                     |

> \[!TIP]
> Für die beste Kompatibilität über alle Clients hinweg empfehlen wir die Verwendung von **Option A** (CNAME-Einträge) kombiniert mit den SRV-Einträgen aus **Option B**. Der CNAME-Ansatz allein deckt die Mehrheit der E-Mail-Clients ab. Die CalDAV/CardDAV-SRV-Einträge stellen sicher, dass Kalender- und Kontakt-Clients Ihre Servereinstellungen ebenfalls automatisch erkennen können.


## Sicherheit {#security-1}

### Erweiterte Techniken zur Server-Härtung {#advanced-server-hardening-techniques}

> \[!TIP]
> Erfahren Sie mehr über unsere Sicherheitsinfrastruktur auf [unserer Sicherheitsseite](/security).

Forward Email implementiert zahlreiche Techniken zur Server-Härtung, um die Sicherheit unserer Infrastruktur und Ihrer Daten zu gewährleisten:

1. **Netzwerksicherheit**:
   * IP-Tables-Firewall mit strengen Regeln
   * Fail2ban zum Schutz vor Brute-Force-Angriffen
   * Regelmäßige Sicherheitsprüfungen und Penetrationstests
   * Nur VPN-gestützter administrativer Zugriff

2. **System-Härtung**:
   * Minimale Paketinstallation
   * Regelmäßige Sicherheitsupdates
   * SELinux im enforcing-Modus
   * Deaktivierter Root-SSH-Zugang
   * Nur schlüsselbasierte Authentifizierung

3. **Anwendungssicherheit**:
   * Content Security Policy (CSP)-Header
   * HTTPS Strict Transport Security (HSTS)
   * XSS-Schutz-Header
   * Frame-Optionen und Referrer-Policy-Header
   * Regelmäßige Abhängigkeitsprüfungen

4. **Datenschutz**:
   * Vollständige Festplattenverschlüsselung mit LUKS
   * Sichere Schlüsselverwaltung
   * Regelmäßige Backups mit Verschlüsselung
   * Datenminimierungspraktiken

5. **Überwachung und Reaktion**:
   * Echtzeit-Einbruchserkennung
   * Automatisierte Sicherheits-Scans
   * Zentralisiertes Logging und Analyse
   * Verfahren zur Vorfallreaktion

> \[!IMPORTANT]
> Unsere Sicherheitspraktiken werden kontinuierlich aktualisiert, um auf neue Bedrohungen und Schwachstellen zu reagieren.

> \[!TIP]
> Für maximale Sicherheit empfehlen wir die Nutzung unseres Dienstes mit Ende-zu-Ende-Verschlüsselung via OpenPGP.

### Haben Sie SOC 2- oder ISO 27001-Zertifizierungen? {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email betreibt seine Infrastruktur über zertifizierte Subprozessoren, um die Einhaltung von Industriestandards sicherzustellen.

Forward Email besitzt keine direkten SOC 2 Typ II- oder ISO 27001-Zertifizierungen. Der Dienst läuft jedoch auf Infrastruktur, die von zertifizierten Subprozessoren bereitgestellt wird:

* **DigitalOcean**: SOC 2 Typ II und SOC 3 Typ II zertifiziert (geprüft von Schellman & Company LLC), ISO 27001 zertifiziert an mehreren Rechenzentren. Details: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: SOC 2+ (HIPAA) zertifiziert, ISO/IEC-Zertifizierungen: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Details: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2 konform (kontaktieren Sie DataPacket direkt, um die Zertifizierung zu erhalten), Anbieter von Infrastruktur in Unternehmensqualität (Standort Denver). Details: <https://www.datapacket.com/datacenters/denver>

Forward Email folgt den branchenüblichen Best Practices für Sicherheitsprüfungen und arbeitet regelmäßig mit unabhängigen Sicherheitsforschern zusammen. Quelle: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Verwenden Sie TLS-Verschlüsselung für die E-Mail-Weiterleitung {#do-you-use-tls-encryption-for-email-forwarding}

Ja. Forward Email erzwingt strikt TLS 1.2+ für alle Verbindungen (HTTPS, SMTP, IMAP, POP3) und implementiert MTA-STS für erweiterten TLS-Support. Die Implementierung umfasst:

* Durchsetzung von TLS 1.2+ für alle E-Mail-Verbindungen
* ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) Schlüsselaustausch für perfekte Vorwärtsgeheimnis
* Moderne Chiffren-Suiten mit regelmäßigen Sicherheitsupdates
* HTTP/2-Unterstützung für verbesserte Leistung und Sicherheit
* HSTS (HTTP Strict Transport Security) mit Preloading in großen Browsern
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** für strikte TLS-Durchsetzung

Quelle: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS-Implementierung**: Forward Email implementiert strikte MTA-STS-Durchsetzung im Code. Wenn TLS-Fehler auftreten und MTA-STS erzwungen wird, gibt das System 421 SMTP-Statuscodes zurück, um sicherzustellen, dass E-Mails später erneut versucht werden, anstatt unsicher zugestellt zu werden. Implementierungsdetails:

* TLS-Fehlererkennung: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* MTA-STS-Durchsetzung im send-email Helper: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Validierung durch Dritte: <https://www.hardenize.com/report/forwardemail.net/1750312779> zeigt "Good"-Bewertungen für alle TLS- und Transportsicherheitsmaßnahmen.

### Bewahren Sie E-Mail-Authentifizierungsheader auf {#do-you-preserve-email-authentication-headers}

Ja. Forward Email implementiert und bewahrt E-Mail-Authentifizierungsheader umfassend:

* **SPF (Sender Policy Framework)**: Korrekt implementiert und erhalten
* **DKIM (DomainKeys Identified Mail)**: Vollständige Unterstützung mit ordnungsgemäßem Schlüsselmanagement
* **DMARC**: Richtliniendurchsetzung für E-Mails, die SPF- oder DKIM-Validierung nicht bestehen
* **ARC**: Obwohl nicht explizit beschrieben, deuten die perfekten Compliance-Werte des Dienstes auf eine umfassende Handhabung von Authentifizierungsheadern hin

Quelle: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validierung: Internet.nl Mail Test zeigt 100/100 Punkte speziell für die Implementierung von "SPF, DKIM und DMARC". Hardenize-Bewertung bestätigt "Good"-Bewertungen für SPF und DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Bewahren Sie die ursprünglichen E-Mail-Header auf und verhindern Sie Spoofing {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implementiert ausgefeilten Anti-Spoofing-Schutz, um E-Mail-Missbrauch zu verhindern.

Forward Email bewahrt die ursprünglichen E-Mail-Header und implementiert umfassenden Anti-Spoofing-Schutz durch den MX-Code:

* **Header-Erhaltung**: Ursprüngliche Authentifizierungsheader werden beim Weiterleiten beibehalten
* **Anti-Spoofing**: DMARC-Richtliniendurchsetzung verhindert Header-Spoofing, indem E-Mails abgelehnt werden, die SPF- oder DKIM-Validierung nicht bestehen
* **Verhinderung von Header-Injektion**: Eingabevalidierung und -bereinigung mit der striptags-Bibliothek
* **Erweiterter Schutz**: Ausgefeilte Phishing-Erkennung mit Spoofing-Erkennung, Identitätsdiebstahl-Prävention und Benachrichtigungssystemen für Benutzer

**MX-Implementierungsdetails**: Die Kernlogik der E-Mail-Verarbeitung wird vom MX-Server-Code gehandhabt, insbesondere:

* Haupt-MX-Datenhandler: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Willkürliche E-Mail-Filterung (Anti-Spoofing): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

Der `isArbitrary` Helper implementiert ausgefeilte Anti-Spoofing-Regeln, einschließlich Erkennung von Domain-Imitation, blockierten Phrasen und verschiedenen Phishing-Mustern.
### Wie schützen Sie vor Spam und Missbrauch {#how-do-you-protect-against-spam-and-abuse}

Forward Email implementiert umfassenden mehrschichtigen Schutz:

* **Rate Limiting**: Wird auf Authentifizierungsversuche, API-Endpunkte und SMTP-Verbindungen angewendet
* **Ressourcentrennung**: Zwischen Benutzern, um Auswirkungen von Nutzern mit hohem Volumen zu verhindern
* **DDoS-Schutz**: Mehrschichtiger Schutz durch das Shield-System von DataPacket und Cloudflare
* **Automatische Skalierung**: Dynamische Ressourcenanpassung basierend auf der Nachfrage
* **Missbrauchsprävention**: Benutzerspezifische Missbrauchsprüfungen und hash-basierte Blockierung für bösartige Inhalte
* **E-Mail-Authentifizierung**: SPF-, DKIM-, DMARC-Protokolle mit fortschrittlicher Phishing-Erkennung

Quellen:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (Details zum DDoS-Schutz)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Speichern Sie E-Mail-Inhalte auf der Festplatte {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email verwendet eine Zero-Knowledge-Architektur, die verhindert, dass E-Mail-Inhalte auf der Festplatte gespeichert werden.

* **Zero-Knowledge-Architektur**: Individuell verschlüsselte SQLite-Mailboxen bedeuten, dass Forward Email keinen Zugriff auf E-Mail-Inhalte hat
* **In-Memory-Verarbeitung**: Die E-Mail-Verarbeitung erfolgt vollständig im Arbeitsspeicher, um Festplattenspeicherung zu vermeiden
* **Keine Inhaltsprotokollierung**: „Wir protokollieren oder speichern keine E-Mail-Inhalte oder Metadaten auf der Festplatte“
* **Sandbox-Verschlüsselung**: Verschlüsselungsschlüssel werden niemals im Klartext auf der Festplatte gespeichert

**MX-Codebasis-Beleg**: Der MX-Server verarbeitet E-Mails vollständig im Arbeitsspeicher, ohne Inhalte auf die Festplatte zu schreiben. Der Haupt-E-Mail-Verarbeitungs-Handler zeigt diesen In-Memory-Ansatz: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Quellen:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Abstract)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Details zur Zero-Knowledge-Architektur)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Sandbox-Verschlüsselung)

### Können E-Mail-Inhalte bei Systemabstürzen offengelegt werden {#can-email-content-be-exposed-during-system-crashes}

Nein. Forward Email implementiert umfassende Schutzmaßnahmen gegen eine Datenoffenlegung bei Abstürzen:

* **Core Dumps deaktiviert**: Verhindert Speicheroffenlegung bei Abstürzen
* **Swap-Speicher deaktiviert**: Vollständig deaktiviert, um die Extraktion sensibler Daten aus Swap-Dateien zu verhindern
* **In-Memory-Architektur**: E-Mail-Inhalte existieren nur im flüchtigen Speicher während der Verarbeitung
* **Schutz der Verschlüsselungsschlüssel**: Schlüssel werden niemals im Klartext auf der Festplatte gespeichert
* **Physische Sicherheit**: LUKS v2-verschlüsselte Festplatten verhindern physischen Datenzugriff
* **USB-Speicher deaktiviert**: Verhindert unbefugte Datenextraktion

**Fehlerbehandlung bei Systemproblemen**: Forward Email verwendet Hilfsfunktionen `isCodeBug` und `isTimeoutError`, um sicherzustellen, dass bei Datenbankverbindungsproblemen, DNS-Netzwerk-/Blocklistenproblemen oder Upstream-Konnektivitätsproblemen der SMTP-Statuscode 421 zurückgegeben wird, damit E-Mails später erneut zugestellt werden und nicht verloren gehen oder offengelegt werden.

Implementierungsdetails:

* Fehlerklassifizierung: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Timeout-Fehlerbehandlung in der MX-Verarbeitung: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Quelle: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Wer hat Zugriff auf Ihre E-Mail-Infrastruktur {#who-has-access-to-your-email-infrastructure}

Forward Email implementiert umfassende Zugriffskontrollen für den minimalen 2-3-köpfigen Engineering-Team-Zugang mit strengen 2FA-Anforderungen:

* **Rollenbasierte Zugriffskontrolle**: Für Teamkonten mit ressourcenbasierten Berechtigungen
* **Prinzip der geringsten Privilegien**: Wird in allen Systemen angewendet
* **Aufgabentrennung**: Zwischen operativen Rollen
* **Benutzermanagement**: Getrennte Deploy- und DevOps-Benutzer mit unterschiedlichen Berechtigungen
* **Root-Login deaktiviert**: Erzwingt Zugriff über ordnungsgemäß authentifizierte Konten
* **Strenge 2FA**: Kein SMS-basiertes 2FA wegen MiTM-Angriffsrisiko – nur app-basierte oder Hardware-Token
* **Umfassende Audit-Protokollierung**: Mit Schwärzung sensibler Daten
* **Automatisierte Anomalieerkennung**: Für ungewöhnliche Zugriffsmuster
* **Regelmäßige Sicherheitsüberprüfungen**: Der Zugriffsprotokolle
* **Schutz vor Evil Maid Angriffen**: USB-Speicher deaktiviert und weitere physische Sicherheitsmaßnahmen
Quellen:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Autorisierungskontrollen)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Netzwerksicherheit)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Verhinderung von Evil-Maid-Angriffen)

### Welche Infrastruktur-Anbieter verwenden Sie {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email nutzt mehrere Infrastruktur-Unterauftragsverarbeiter mit umfassenden Compliance-Zertifizierungen.

Vollständige Details sind auf unserer GDPR-Compliance-Seite verfügbar: <https://forwardemail.net/gdpr>

**Primäre Infrastruktur-Unterauftragsverarbeiter:**

| Anbieter         | Zertifiziert im Datenschutzrahmen | GDPR-Compliance-Seite                                                                    |
| ---------------- | -------------------------------- | ---------------------------------------------------------------------------------------- |
| **Cloudflare**   | ✅ Ja                            | <https://www.cloudflare.com/trust-hub/gdpr/>                                            |
| **DataPacket**   | ❌ Nein                          | <https://www.datapacket.com/privacy-policy>                                             |
| **DigitalOcean** | ❌ Nein                          | <https://www.digitalocean.com/legal/gdpr>                                               |
| **GitHub**       | ✅ Ja                            | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**        | ❌ Nein                          | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                         |

**Detaillierte Zertifizierungen:**

**DigitalOcean**

* SOC 2 Typ II & SOC 3 Typ II (geprüft von Schellman & Company LLC)
* ISO 27001 zertifiziert an mehreren Rechenzentren
* PCI-DSS konform
* CSA STAR Level 1 zertifiziert
* APEC CBPR PRP zertifiziert
* Details: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+ (HIPAA) zertifiziert
* PCI-Händler konform
* CSA STAR Level 1 zertifiziert
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Details: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* SOC 2 konform (bitte direkt bei DataPacket Zertifizierung anfragen)
* Infrastruktur in Unternehmensqualität (Standort Denver)
* DDoS-Schutz durch Shield-Cybersecurity-Stack
* 24/7 technischer Support
* Globales Netzwerk mit 58 Rechenzentren
* Details: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* Zertifiziert im Datenschutzrahmen (EU-US, Schweiz-US und UK-Erweiterung)
* Quellcode-Hosting, CI/CD und Projektmanagement
* GitHub-Datenschutzvereinbarung verfügbar
* Details: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**Zahlungsabwickler:**

* **Stripe**: Zertifiziert im Datenschutzrahmen - <https://stripe.com/legal/privacy-center>
* **PayPal**: Nicht DPF-zertifiziert - <https://www.paypal.com/uk/legalhub/privacy-full>

### Bieten Sie eine Datenverarbeitungsvereinbarung (DPA) an {#do-you-offer-a-data-processing-agreement-dpa}

Ja, Forward Email bietet eine umfassende Datenverarbeitungsvereinbarung (DPA) an, die mit unserem Enterprise-Vertrag unterzeichnet werden kann. Eine Kopie unserer DPA ist verfügbar unter: <https://forwardemail.net/dpa>

**DPA-Details:**

* Deckt GDPR-Compliance sowie EU-US/Schweiz-US Privacy Shield Rahmenwerke ab
* Wird automatisch akzeptiert, wenn den Nutzungsbedingungen zugestimmt wird
* Keine separate Unterschrift für Standard-DPA erforderlich
* Individuelle DPA-Vereinbarungen über Enterprise-Lizenz verfügbar

**GDPR-Compliance-Rahmen:**
Unsere DPA beschreibt die Einhaltung der GDPR sowie der internationalen Anforderungen an Datenübertragungen. Vollständige Informationen sind verfügbar unter: <https://forwardemail.net/gdpr>

Für Unternehmenskunden, die individuelle DPA-Bedingungen oder spezifische vertragliche Vereinbarungen benötigen, können diese über unser **Enterprise License ($250/Monat)** Programm geregelt werden.

### Wie gehen Sie mit Benachrichtigungen über Datenschutzverletzungen um {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Die Zero-Knowledge-Architektur von Forward Email begrenzt die Auswirkungen von Datenschutzverletzungen erheblich.
* **Begrenzte Dateneinsicht**: Kein Zugriff auf verschlüsselten E-Mail-Inhalt aufgrund der Zero-Knowledge-Architektur
* **Minimale Datenerfassung**: Nur grundlegende Abonnenteninformationen und eingeschränkte IP-Protokolle zur Sicherheit
* **Subprozessor-Rahmenwerke**: DigitalOcean, GitHub und Vultr unterhalten GDPR-konforme Verfahren zur Vorfallreaktion

**Informationen zum GDPR-Vertreter:**
Forward Email hat gemäß Artikel 27 GDPR-Vertreter benannt:

**EU-Vertreter:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**UK-Vertreter:**
Osano UK Compliance LTD
ATTN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

Für Unternehmenskunden, die spezifische SLAs für Benachrichtigungen bei Datenschutzverletzungen benötigen, sollten diese im Rahmen einer **Enterprise License** Vereinbarung besprochen werden.

Quellen:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Bieten Sie eine Testumgebung an {#do-you-offer-a-test-environment}

Die technische Dokumentation von Forward Email beschreibt keinen expliziten dedizierten Sandbox-Modus. Mögliche Testansätze umfassen jedoch:

* **Self-Hosting-Option**: Umfassende Self-Hosting-Fähigkeiten zur Erstellung von Testumgebungen
* **API-Schnittstelle**: Möglichkeit zur programmatischen Prüfung von Konfigurationen
* **Open Source**: 100 % Open-Source-Code ermöglicht Kunden die Prüfung der Weiterleitungslogik
* **Mehrere Domains**: Unterstützung mehrerer Domains könnte die Erstellung von Testdomains ermöglichen

Für Unternehmenskunden, die formale Sandbox-Funktionalitäten benötigen, sollte dies im Rahmen einer **Enterprise License** Vereinbarung besprochen werden.

Quelle: <https://github.com/forwardemail/forwardemail.net> (Details zur Entwicklungsumgebung)

### Bieten Sie Überwachungs- und Alarmierungstools an {#do-you-provide-monitoring-and-alerting-tools}

Forward Email bietet Echtzeitüberwachung mit einigen Einschränkungen:

**Verfügbar:**

* **Echtzeit-Lieferüberwachung**: Öffentlich sichtbare Leistungskennzahlen für große E-Mail-Anbieter
* **Automatische Alarmierung**: Das Engineering-Team wird benachrichtigt, wenn Lieferzeiten 10 Sekunden überschreiten
* **Transparente Überwachung**: 100 % Open-Source-Überwachungssysteme
* **Infrastrukturüberwachung**: Automatische Anomalieerkennung und umfassende Audit-Protokollierung

**Einschränkungen:**

* Kundenorientierte Webhooks oder API-basierte Benachrichtigungen zum Lieferstatus sind nicht explizit dokumentiert

Für Unternehmenskunden, die detaillierte Webhooks zum Lieferstatus oder benutzerdefinierte Überwachungsintegrationen benötigen, können diese Funktionen im Rahmen von **Enterprise License** Vereinbarungen verfügbar sein.

Quellen:

* <https://forwardemail.net> (Anzeige der Echtzeitüberwachung)
* <https://github.com/forwardemail/forwardemail.net> (Implementierung der Überwachung)

### Wie stellen Sie hohe Verfügbarkeit sicher {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implementiert umfassende Redundanz über mehrere Infrastruktur-Anbieter hinweg.

* **Verteilte Infrastruktur**: Mehrere Anbieter (DigitalOcean, Vultr, DataPacket) über geografische Regionen verteilt
* **Geografisches Lastenausgleich**: Cloudflare-basierter geo-lokalisierter Lastenausgleich mit automatischem Failover
* **Automatische Skalierung**: Dynamische Ressourcenanpassung basierend auf der Nachfrage
* **Mehrschichtiger DDoS-Schutz**: Durch das Shield-System von DataPacket und Cloudflare
* **Server-Redundanz**: Mehrere Server pro Region mit automatischem Failover
* **Datenbank-Replikation**: Echtzeit-Datensynchronisation über mehrere Standorte
* **Überwachung und Alarmierung**: 24/7 Überwachung mit automatischer Vorfallreaktion

**Verfügbarkeitsgarantie**: 99,9 %+ Serviceverfügbarkeit mit transparenter Überwachung verfügbar unter <https://forwardemail.net>

Quellen:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Sind Sie konform mit Abschnitt 889 des National Defense Authorization Act (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email ist vollständig konform mit Abschnitt 889 durch sorgfältige Auswahl der Infrastrukturpartner.

Ja, Forward Email ist **Section 889 konform**. Abschnitt 889 des National Defense Authorization Act (NDAA) verbietet Regierungsbehörden die Nutzung oder Beauftragung von Unternehmen, die Telekommunikations- und Videoüberwachungsausrüstung bestimmter Firmen (Huawei, ZTE, Hikvision, Dahua und Hytera) verwenden.
**Wie Forward Email die Einhaltung von Abschnitt 889 erreicht:**

Forward Email verlässt sich ausschließlich auf zwei wichtige Infrastruktur-Anbieter, von denen keiner Ausrüstung verwendet, die nach Abschnitt 889 verboten ist:

1. **Cloudflare**: Unser Hauptpartner für Netzwerkdienste und E-Mail-Sicherheit
2. **DataPacket**: Unser Hauptanbieter für Serverinfrastruktur (ausschließlich mit Ausrüstung von Arista Networks und Cisco)
3. **Backup-Anbieter**: Unsere Backup-Anbieter Digital Ocean und Vultr sind zusätzlich schriftlich als Abschnitt 889-konform bestätigt.

**Cloudflares Verpflichtung**: Cloudflare erklärt ausdrücklich in ihrem Verhaltenskodex für Dritte, dass sie keine Telekommunikationsausrüstung, Videoüberwachungsprodukte oder Dienstleistungen von nach Abschnitt 889 verbotenen Unternehmen verwenden.

**Anwendungsfall für die Regierung**: Unsere Einhaltung von Abschnitt 889 wurde bestätigt, als die **US Naval Academy** Forward Email für ihre sicheren E-Mail-Weiterleitungsbedürfnisse auswählte und eine Dokumentation unserer bundesstaatlichen Compliance-Standards verlangte.

Für vollständige Details zu unserem Compliance-Rahmenwerk für die Regierung, einschließlich umfassenderer bundesstaatlicher Vorschriften, lesen Sie unsere ausführliche Fallstudie: [Bundesregierung E-Mail-Dienst Abschnitt 889 konform](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## System- und technische Details {#system-and-technical-details}

### Speichern Sie E-Mails und deren Inhalte {#do-you-store-emails-and-their-contents}

Nein, wir schreiben nicht auf die Festplatte und speichern keine Protokolle – mit Ausnahme von [Fehlern](#do-you-store-error-logs) und [ausgehenden SMTP](#do-you-support-sending-email-with-smtp) (siehe unsere [Datenschutzerklärung](/privacy)).

Alles wird im Arbeitsspeicher verarbeitet und [unser Quellcode ist auf GitHub](https://github.com/forwardemail).

### Wie funktioniert Ihr E-Mail-Weiterleitungssystem {#how-does-your-email-forwarding-system-work}

E-Mail basiert auf dem [SMTP-Protokoll](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Dieses Protokoll besteht aus Befehlen, die an einen Server gesendet werden (meist auf Port 25). Es gibt eine anfängliche Verbindung, dann gibt der Absender an, von wem die Mail ist ("MAIL FROM"), gefolgt davon, wohin sie geht ("RCPT TO"), und schließlich die Header und den eigentlichen Inhalt der E-Mail ("DATA"). Der Ablauf unseres E-Mail-Weiterleitungssystems wird im Folgenden in Bezug auf jeden SMTP-Protokollbefehl beschrieben:

* Initiale Verbindung (kein Befehlsname, z.B. `telnet example.com 25`) – Dies ist die anfängliche Verbindung. Wir prüfen Absender, die nicht auf unserer [Erlaubnisliste](#do-you-have-an-allowlist) stehen, anhand unserer [Sperrliste](#do-you-have-a-denylist). Schließlich prüfen wir, falls ein Absender nicht auf der Erlaubnisliste steht, ob er [gegrautelistet](#do-you-have-a-greylist) wurde.

* `HELO` – Dies signalisiert eine Begrüßung zur Identifikation des FQDN, der IP-Adresse oder des Mail-Handler-Namens des Absenders. Dieser Wert kann gefälscht sein, daher verlassen wir uns nicht auf diese Daten, sondern verwenden stattdessen die Reverse-Hostname-Abfrage der IP-Adresse der Verbindung.

* `MAIL FROM` – Dies gibt die Absenderadresse des Umschlags der E-Mail an. Wenn ein Wert eingegeben wird, muss es eine gültige RFC 5322 E-Mail-Adresse sein. Leere Werte sind erlaubt. Wir prüfen hier auf Backscatter (#how-do-you-protect-against-backscatter), und wir prüfen auch die MAIL FROM-Adresse gegen unsere [Sperrliste](#do-you-have-a-denylist). Schließlich prüfen wir Absender, die nicht auf der Erlaubnisliste stehen, auf Ratenbegrenzung (siehe den Abschnitt zu [Ratenbegrenzung](#do-you-have-rate-limiting) und [Erlaubnisliste](#do-you-have-an-allowlist) für weitere Informationen).

* `RCPT TO` – Dies gibt den/die Empfänger der E-Mail an. Diese müssen gültige RFC 5322 E-Mail-Adressen sein. Wir erlauben maximal 50 Umschlagsempfänger pro Nachricht (dies unterscheidet sich vom "To"-Header einer E-Mail). Wir prüfen hier auch auf eine gültige [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS")-Adresse, um Spoofing mit unserem SRS-Domainnamen zu verhindern.

* `DATA` – Dies ist der Kernteil unseres Dienstes, der eine E-Mail verarbeitet. Siehe den Abschnitt [Wie verarbeiten Sie eine E-Mail zur Weiterleitung](#how-do-you-process-an-email-for-forwarding) unten für weitere Einblicke.
### Wie verarbeiten Sie eine E-Mail zum Weiterleiten {#how-do-you-process-an-email-for-forwarding}

Dieser Abschnitt beschreibt unseren Prozess im Zusammenhang mit dem SMTP-Protokollbefehl `DATA` im Abschnitt [Wie funktioniert Ihr E-Mail-Weiterleitungssystem](#how-does-your-email-forwarding-system-work) oben – es geht darum, wie wir die Header, den Inhalt, die Sicherheit einer E-Mail verarbeiten, bestimmen, wohin sie zugestellt werden muss, und wie wir Verbindungen handhaben.

1. Wenn die Nachricht die maximale Größe von 50 MB überschreitet, wird sie mit einem 552-Fehlercode abgelehnt.

2. Wenn die Nachricht keinen "From"-Header enthielt oder wenn einer der Werte im "From"-Header keine gültige RFC 5322-E-Mail-Adresse war, wird sie mit einem 550-Fehlercode abgelehnt.

3. Wenn die Nachricht mehr als 25 "Received"-Header hatte, wurde festgestellt, dass sie in einer Weiterleitungsschleife feststeckte, und sie wird mit einem 550-Fehlercode abgelehnt.

4. Mithilfe des Fingerabdrucks der E-Mail (siehe Abschnitt [Fingerprinting](#how-do-you-determine-an-email-fingerprint)) prüfen wir, ob versucht wurde, die Nachricht länger als 5 Tage erneut zuzustellen (was dem [Standardverhalten von Postfix](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime) entspricht), und falls ja, wird sie mit einem 550-Fehlercode abgelehnt.

5. Wir speichern die Ergebnisse des Scans der E-Mail mit [Spam Scanner](https://spamscanner.net) im Arbeitsspeicher.

6. Wenn es beliebige Ergebnisse vom Spam Scanner gab, wird die Nachricht mit einem 554-Fehlercode abgelehnt. Beliebige Ergebnisse umfassen zum Zeitpunkt dieses Schreibens nur den GTUBE-Test. Siehe <https://spamassassin.apache.org/gtube/> für weitere Informationen.

7. Wir fügen der Nachricht die folgenden Header zu Debugging- und Missbrauchspräventionszwecken hinzu:

   * `Received` – wir fügen diesen Standard-Received-Header mit Ursprungs-IP und Host, Übertragungsart, TLS-Verbindungsinformationen, Datum/Uhrzeit und Empfänger hinzu.
   * `X-Original-To` – der ursprüngliche Empfänger der Nachricht:
     * Dies ist nützlich, um zu bestimmen, wohin eine E-Mail ursprünglich zugestellt wurde (zusätzlich zum "Received"-Header).
     * Dieser wird pro Empfänger zum Zeitpunkt von IMAP und/oder maskierter Weiterleitung hinzugefügt (um die Privatsphäre zu schützen).
   * `X-Forward-Email-Website` – enthält einen Link zu unserer Website <https://forwardemail.net>
   * `X-Forward-Email-Version` – die aktuelle [SemVer](https://semver.org/) Version aus `package.json` unseres Codebases.
   * `X-Forward-Email-Session-ID` – eine Sitzungs-ID, die zu Debugging-Zwecken verwendet wird (gilt nur in Nicht-Produktionsumgebungen).
   * `X-Forward-Email-Sender` – eine durch Kommas getrennte Liste, die die ursprüngliche Envelope MAIL FROM-Adresse (sofern nicht leer), den Reverse-PTR-Client-FQDN (sofern vorhanden) und die IP-Adresse des Absenders enthält.
   * `X-Forward-Email-ID` – dies gilt nur für ausgehendes SMTP und korreliert mit der E-Mail-ID, die in Mein Konto → E-Mails gespeichert ist.
   * `X-Report-Abuse` – mit dem Wert `abuse@forwardemail.net`.
   * `X-Report-Abuse-To` – mit dem Wert `abuse@forwardemail.net`.
   * `X-Complaints-To` – mit dem Wert `abuse@forwardemail.net`.

8. Wir prüfen dann die Nachricht auf [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) und [DMARC](https://en.wikipedia.org/wiki/DMARC).

   * Wenn die Nachricht DMARC nicht bestanden hat und die Domain eine Ablehnungsrichtlinie hatte (z. B. `p=reject` [war in der DMARC-Richtlinie](https://wikipedia.org/wiki/DMARC)), wird sie mit einem 550-Fehlercode abgelehnt. Typischerweise ist eine DMARC-Richtlinie für eine Domain im `_dmarc`-Subdomain-<strong class="notranslate">TXT</strong>-Eintrag zu finden (z. B. `dig _dmarc.example.com txt`).
   * Wenn die Nachricht SPF nicht bestanden hat und die Domain eine Hard-Fail-Richtlinie hatte (z. B. war `-all` in der SPF-Richtlinie anstelle von `~all` oder keiner Richtlinie), wird sie mit einem 550-Fehlercode abgelehnt. Typischerweise ist eine SPF-Richtlinie für eine Domain im <strong class="notranslate">TXT</strong>-Eintrag der Root-Domain zu finden (z. B. `dig example.com txt`). Siehe diesen Abschnitt für weitere Informationen zum [Senden von E-Mails als mit Gmail](#can-i-send-mail-as-in-gmail-with-this) bezüglich SPF.
9. Nun verarbeiten wir die Empfänger der Nachricht, wie sie aus dem `RCPT TO`-Befehl im Abschnitt [Wie funktioniert Ihr E-Mail-Weiterleitungssystem](#how-does-your-email-forwarding-system-work) oben gesammelt wurden. Für jeden Empfänger führen wir die folgenden Operationen durch:

   * Wir suchen die <strong class="notranslate">TXT</strong>-Einträge des Domainnamens (der Teil nach dem `@`-Symbol, z. B. `example.com`, wenn die E-Mail-Adresse `test@example.com` war). Zum Beispiel, wenn die Domain `example.com` ist, führen wir eine DNS-Abfrage wie `dig example.com txt` durch.
   * Wir parsen alle <strong class="notranslate">TXT</strong>-Einträge, die entweder mit `forward-email=` (kostenlose Pläne) oder `forward-email-site-verification=` (bezahlte Pläne) beginnen. Beachten Sie, dass wir beide parsen, um E-Mails während eines Upgrades oder Downgrades eines Plans zu verarbeiten.
   * Aus diesen geparsten <strong class="notranslate">TXT</strong>-Einträgen iterieren wir, um die Weiterleitungskonfiguration zu extrahieren (wie im Abschnitt [Wie starte ich und richte die E-Mail-Weiterleitung ein](#how-do-i-get-started-and-set-up-email-forwarding) oben beschrieben). Beachten Sie, dass wir nur einen `forward-email-site-verification=`-Wert unterstützen, und wenn mehr als einer angegeben wird, tritt ein 550-Fehler auf und der Absender erhält für diesen Empfänger eine Bounce-Nachricht.
   * Rekursiv iterieren wir über die extrahierte Weiterleitungskonfiguration, um globale Weiterleitungen, regex-basierte Weiterleitungen und alle anderen unterstützten Weiterleitungskonfigurationen zu bestimmen – diese sind jetzt als unsere "Weiterleitungsadressen" bekannt.
   * Für jede Weiterleitungsadresse unterstützen wir eine rekursive Suche (die diese Reihe von Operationen für die angegebene Adresse erneut startet). Wenn eine rekursive Übereinstimmung gefunden wurde, wird das übergeordnete Ergebnis aus den Weiterleitungsadressen entfernt und die untergeordneten hinzugefügt.
   * Weiterleitungsadressen werden auf Einzigartigkeit geprüft (da wir keine Duplikate an eine Adresse senden oder unnötige zusätzliche SMTP-Client-Verbindungen erzeugen wollen).
   * Für jede Weiterleitungsadresse prüfen wir den Domainnamen über unseren API-Endpunkt `/v1/max-forwarded-addresses` (um zu bestimmen, wie viele Adressen die Domain pro Alias weiterleiten darf, z. B. standardmäßig 10 – siehe Abschnitt [maximale Begrenzung der Weiterleitung pro Alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Wird dieses Limit überschritten, tritt ein 550-Fehler auf und der Absender erhält für diesen Empfänger eine Bounce-Nachricht.
   * Wir prüfen die Einstellungen des ursprünglichen Empfängers über unseren API-Endpunkt `/v1/settings`, der eine Abfrage für zahlende Nutzer unterstützt (mit Fallback für kostenlose Nutzer). Dies gibt ein Konfigurationsobjekt für erweiterte Einstellungen zurück für `port` (Nummer, z. B. `25`), `has_adult_content_protection` (Boolean), `has_phishing_protection` (Boolean), `has_executable_protection` (Boolean) und `has_virus_protection` (Boolean).
   * Basierend auf diesen Einstellungen prüfen wir dann die Ergebnisse des Spam-Scanners und falls Fehler auftreten, wird die Nachricht mit einem 554-Fehlercode abgelehnt (z. B. wenn `has_virus_protection` aktiviert ist, prüfen wir die Spam-Scanner-Ergebnisse auf Viren). Beachten Sie, dass alle Nutzer des kostenlosen Plans automatisch für Prüfungen gegen Erwachsenen-Inhalte, Phishing, ausführbare Dateien und Viren angemeldet sind. Standardmäßig sind auch alle zahlenden Nutzer angemeldet, aber diese Konfiguration kann auf der Einstellungsseite für eine Domain im Forward Email Dashboard geändert werden).

10. Für jede verarbeitete Weiterleitungsadresse eines Empfängers führen wir dann die folgenden Operationen durch:

    * Die Adresse wird gegen unsere [Denylist](#do-you-have-a-denylist) geprüft, und wenn sie gelistet ist, tritt ein 421-Fehlercode auf (signalisiert dem Absender, es später erneut zu versuchen).
    * Wenn die Adresse ein Webhook ist, setzen wir ein Boolean für zukünftige Operationen (siehe unten – wir gruppieren ähnliche Webhooks, um eine POST-Anfrage statt mehrerer für die Zustellung zu machen).
    * Wenn die Adresse eine E-Mail-Adresse ist, parsen wir den Host für zukünftige Operationen (siehe unten – wir gruppieren ähnliche Hosts, um eine Verbindung statt mehrerer einzelner Verbindungen für die Zustellung herzustellen).
11. Wenn es keine Empfänger gibt und keine Bounces, antworten wir mit einem 550-Fehler "Ungültige Empfänger".

12. Wenn es Empfänger gibt, iterieren wir über diese (gruppiert nach demselben Host) und liefern die E-Mails aus. Siehe den Abschnitt [Wie gehen Sie mit Problemen bei der E-Mail-Zustellung um](#how-do-you-handle-email-delivery-issues) unten für weitere Einblicke.

    * Wenn beim Senden von E-Mails Fehler auftreten, speichern wir diese im Speicher zur späteren Verarbeitung.
    * Wir nehmen den niedrigsten Fehlercode (falls vorhanden) vom Senden der E-Mails – und verwenden diesen als Antwortcode auf den `DATA`-Befehl. Das bedeutet, dass nicht zugestellte E-Mails in der Regel vom ursprünglichen Absender erneut versucht werden, während E-Mails, die bereits zugestellt wurden, beim nächsten Versand der Nachricht nicht erneut gesendet werden (da wir [Fingerprinting](#how-do-you-determine-an-email-fingerprint) verwenden).
    * Wenn keine Fehler aufgetreten sind, senden wir einen erfolgreichen SMTP-Antwortstatuscode 250.
    * Ein Bounce wird als jede Zustellungsversuch definiert, der in einem Statuscode >= 500 (permanente Fehler) resultiert.

13. Wenn keine Bounces aufgetreten sind (permanente Fehler), geben wir einen SMTP-Antwortstatuscode des niedrigsten Fehlercodes von nicht-permanenten Fehlern zurück (oder einen erfolgreichen Statuscode 250, falls keine vorhanden waren).

14. Wenn Bounces aufgetreten sind, senden wir Bounce-E-Mails im Hintergrund, nachdem wir den niedrigsten aller Fehlercodes an den Absender zurückgegeben haben. Wenn der niedrigste Fehlercode jedoch >= 500 ist, senden wir keine Bounce-E-Mails. Dies liegt daran, dass der Absender sonst eine doppelte Bounce-E-Mail erhalten würde (z. B. eine von ihrem ausgehenden MTA, wie Gmail – und auch eine von uns). Siehe den Abschnitt [Wie schützen Sie sich gegen Backscatter](#how-do-you-protect-against-backscatter) unten für weitere Einblicke.

### Wie gehen Sie mit Problemen bei der E-Mail-Zustellung um {#how-do-you-handle-email-delivery-issues}

Beachten Sie, dass wir eine "Friendly-From"-Umwandlung der E-Mails nur dann durchführen, wenn die DMARC-Richtlinie des Absenders nicht bestanden wurde UND keine DKIM-Signaturen mit dem "From"-Header übereinstimmten. Das bedeutet, dass wir den "From"-Header der Nachricht ändern, "X-Original-From" setzen und auch ein "Reply-To" setzen, falls dieses noch nicht gesetzt war. Wir versiegeln auch das ARC-Siegel der Nachricht nach der Änderung dieser Header neu.

Wir verwenden außerdem eine intelligente Analyse von Fehlermeldungen auf jeder Ebene unseres Stacks – in unserem Code, DNS-Anfragen, Node.js-Interna, HTTP-Anfragen (z. B. werden 408, 413 und 429 auf den SMTP-Antwortcode 421 abgebildet, wenn der Empfänger ein Webhook ist) und Mailserver-Antworten (z. B. werden Antworten mit "defer" oder "slowdown" als 421-Fehler erneut versucht).

Unsere Logik ist narrensicher und versucht auch bei SSL/TLS-Fehlern, Verbindungsproblemen und mehr erneut zu senden. Das Ziel der Narrensicherheit ist es, die Zustellbarkeit an alle Empfänger für eine Weiterleitungskonfiguration zu maximieren.

Wenn der Empfänger ein Webhook ist, erlauben wir eine Timeout-Dauer von 60 Sekunden für den Abschluss der Anfrage mit bis zu 3 Wiederholungen (also insgesamt 4 Anfragen vor einem Fehler). Beachten Sie, dass wir die Fehlercodes 408, 413 und 429 korrekt analysieren und auf den SMTP-Antwortcode 421 abbilden.

Andernfalls, wenn der Empfänger eine E-Mail-Adresse ist, versuchen wir, die E-Mail mit opportunistischem TLS zu senden (wir versuchen STARTTLS zu verwenden, wenn es auf dem Mailserver des Empfängers verfügbar ist). Wenn beim Versuch, die E-Mail zu senden, ein SSL/TLS-Fehler auftritt, versuchen wir, die E-Mail ohne TLS (ohne STARTTLS) zu senden.

Wenn DNS- oder Verbindungsfehler auftreten, geben wir auf den `DATA`-Befehl einen SMTP-Antwortcode 421 zurück, andernfalls werden bei Fehlern >= 500 Bounces gesendet.

Wenn wir feststellen, dass ein E-Mail-Server, an den wir zustellen wollen, eine oder mehrere unserer Mail-Exchange-IP-Adressen blockiert hat (z. B. durch welche Technologie auch immer sie zur Verzögerung von Spammern verwenden), senden wir einen SMTP-Antwortcode 421, damit der Absender seine Nachricht später erneut versuchen kann (und wir werden über das Problem informiert, damit wir es hoffentlich vor dem nächsten Versuch beheben können).

### Wie gehen Sie damit um, wenn Ihre IP-Adressen blockiert werden {#how-do-you-handle-your-ip-addresses-becoming-blocked}
Wir überwachen routinemäßig alle wichtigen DNS-Denylisten, und wenn eine unserer Mail-Exchange-("MX")-IP-Adressen in einer wichtigen Denyliste aufgeführt ist, ziehen wir sie, wenn möglich, aus dem entsprechenden DNS-A-Record-Round-Robin heraus, bis das Problem behoben ist.

Zum Zeitpunkt dieses Schreibens sind wir auch in mehreren DNS-Allowlisten aufgeführt, und wir nehmen die Überwachung von Denylists ernst. Wenn Sie Probleme bemerken, bevor wir die Gelegenheit hatten, sie zu beheben, benachrichtigen Sie uns bitte schriftlich unter <support@forwardemail.net>.

Unsere IP-Adressen sind öffentlich verfügbar, [siehe diesen Abschnitt unten für weitere Einblicke](#what-are-your-servers-ip-addresses).

### Was sind Postmaster-Adressen {#what-are-postmaster-addresses}

Um fehlgeleitete Bounces und das Senden von Abwesenheitsantworten an unbeaufsichtigte oder nicht existierende Postfächer zu verhindern, führen wir eine Liste von mailer-daemon-ähnlichen Benutzernamen:

* `automailer`
* `autoresponder`
* `bounce`
* `bounce-notification`
* `bounce-notifications`
* `bounces`
* `hostmaster`
* `listserv`
* `localhost`
* `mail-daemon`
* `mail.daemon`
* `maildaemon`
* `mailer-daemon`
* `mailer.daemon`
* `mailerdaemon`
* `majordomo`
* `postmaster`
* [und jede No-Reply-Adresse](#what-are-no-reply-addresses)

Siehe [RFC 5320 Abschnitt 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) für weitere Einblicke, wie solche Listen verwendet werden, um effiziente E-Mail-Systeme zu erstellen.

### Was sind No-Reply-Adressen {#what-are-no-reply-addresses}

E-Mail-Benutzernamen, die einem der folgenden (Groß-/Kleinschreibung nicht beachtet) entsprechen, gelten als No-Reply-Adressen:

* `do-not-reply`
* `do-not-respond`
* `do.not.reply`
* `donotreply`
* `donotrespond`
* `dont-reply`
* `naoresponda`
* `no-replies`
* `no-reply`
* `no-replys`
* `no.replies`
* `no.reply`
* `no.replys`
* `no_reply`
* `nobody`
* `noreplies`
* `noreply`
* `noreplys`

Diese Liste wird [als Open-Source-Projekt auf GitHub gepflegt](https://github.com/forwardemail/reserved-email-addresses-list).

### Was sind die IP-Adressen Ihres Servers {#what-are-your-servers-ip-addresses}

Wir veröffentlichen unsere IP-Adressen unter <https://forwardemail.net/ips>.

### Haben Sie eine Allowlist {#do-you-have-an-allowlist}

Ja, wir haben eine [Liste von Domain-Endungen](#what-domain-name-extensions-are-allowlisted-by-default), die standardmäßig auf der Allowlist stehen, sowie eine dynamische, zwischengespeicherte und rollierende Allowlist basierend auf [strengen Kriterien](#what-is-your-allowlist-criteria).

Alle Domains, E-Mails und IP-Adressen, die von zahlenden Kunden verwendet werden, werden automatisch stündlich gegen unsere Denyliste geprüft – was Administratoren alarmiert, die bei Bedarf manuell eingreifen können.

Außerdem werden, wenn eine Ihrer Domains oder deren E-Mail-Adressen auf einer Denyliste stehen (z. B. wegen Spam, Viren oder aufgrund von Identitätsdiebstahl-Angriffen), die Domain-Administratoren (Sie) und unsere Team-Administratoren sofort per E-Mail benachrichtigt. Wir empfehlen dringend, dass Sie [DMARC konfigurieren](#how-do-i-set-up-dmarc-for-forward-email), um dies zu verhindern.

### Welche Domain-Endungen sind standardmäßig auf der Allowlist {#what-domain-name-extensions-are-allowlisted-by-default}

Die folgenden Domain-Endungen gelten standardmäßig als auf der Allowlist stehend (unabhängig davon, ob sie auf der Umbrella Popularity List stehen oder nicht):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">edu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov</code></li>
  <li class="list-inline-item"><code class="notranslate">mil</code></li>
  <li class="list-inline-item"><code class="notranslate">int</code></li>
  <li class="list-inline-item"><code class="notranslate">arpa</code></li>
  <li class="list-inline-item"><code class="notranslate">dni.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fed.us</code></li>
  <li class="list-inline-item"><code class="notranslate">isa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">kids.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nsn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ak.us</code></li>
  <li class="list-inline-item"><code class="notranslate">al.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ar.us</code></li>
  <li class="list-inline-item"><code class="notranslate">as.us</code></li>
  <li class="list-inline-item"><code class="notranslate">az.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ca.us</code></li>
  <li class="list-inline-item"><code class="notranslate">co.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ct.us</code></li>
  <li class="list-inline-item"><code class="notranslate">dc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">de.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fl.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ga.us</code></li>
  <li class="list-inline-item"><code class="notranslate">gu.us</code></li>
  <li class="list-inline-item"><code class="notranslate">hi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ia.us</code></li>
  <li class="list-inline-item"><code class="notranslate">id.us</code></li>
  <li class="list-inline-item"><code class="notranslate">il.us</code></li>
  <li class="list-inline-item"><code class="notranslate">in.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ks.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ky.us</code></li>
  <li class="list-inline-item"><code class="notranslate">la.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ma.us</code></li>
  <li class="list-inline-item"><code class="notranslate">md.us</code></li>
  <li class="list-inline-item"><code class="notranslate">me.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mo.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ne.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nj.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nm.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ny.us</code></li>
  <li class="list-inline-item"><code class="notranslate">oh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ok.us</code></li>
  <li class="list-inline-item"><code class="notranslate">or.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pr.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ri.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tx.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ut.us</code></li>
  <li class="list-inline-item"><code class="notranslate">va.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wy.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.au</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.at</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.br</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">school.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">cri.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">health.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.in</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.in</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.in</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ed.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">lg.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.za</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.za</code></li>
  <li class="list-inline-item"><code class="notranslate">school.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">hs.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">es.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">kg.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.es</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.th</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.th</code></li>
  <li class="list-inline-item"><code class="notranslate">admin.ch</code></li>
  <li class="list-inline-item"><code class="notranslate">canada.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">go.id</code></li>
  <li class="list-inline-item"><code class="notranslate">go.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">go.ke</code></li>
  <li class="list-inline-item"><code class="notranslate">go.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">go.th</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.ar</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.es</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.mx</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gob.pe</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gob.ve</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.sv</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.nc</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.qc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ad</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.af</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ai</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.al</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.am</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ao</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.au</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.aw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ax</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.az</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.be</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bm</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gov.by</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.co</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cy</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.dz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.eg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fi</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ie</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.il</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.im</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.in</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.iq</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ir</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.it</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.je</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kp</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.krd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ky</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lb</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lv</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ma</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mm</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mo</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.my</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ng</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.np</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ph</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.py</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ro</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ru</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.scot</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.se</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.si</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.vn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.wales</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.za</code></li>
  <li class="list-inline-item"><code class="notranslate">government.pn</code></li>
  <li class="list-inline-item"><code class="notranslate">govt.nz</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gv.at</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">bl.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">mod.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">nhs.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">police.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">rct.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">royal.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>
Zusätzlich sind diese [Marken- und Unternehmens-Top-Level-Domains](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) standardmäßig auf der Positivliste erlaubt (z.B. `apple` für `applecard.apple` für Apple Card Kontoauszüge):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">aaa</code></li>
  <li class="list-inline-item"><code class="notranslate">aarp</code></li>
  <li class="list-inline-item"><code class="notranslate">abarth</code></li>
  <li class="list-inline-item"><code class="notranslate">abb</code></li>
  <li class="list-inline-item"><code class="notranslate">abbott</code></li>
  <li class="list-inline-item"><code class="notranslate">abbvie</code></li>
  <li class="list-inline-item"><code class="notranslate">abc</code></li>
  <li class="list-inline-item"><code class="notranslate">accenture</code></li>
  <li class="list-inline-item"><code class="notranslate">aco</code></li>
  <li class="list-inline-item"><code class="notranslate">aeg</code></li>
  <li class="list-inline-item"><code class="notranslate">aetna</code></li>
  <li class="list-inline-item"><code class="notranslate">afl</code></li>
  <li class="list-inline-item"><code class="notranslate">agakhan</code></li>
  <li class="list-inline-item"><code class="notranslate">aig</code></li>
  <li class="list-inline-item"><code class="notranslate">aigo</code></li>
  <li class="list-inline-item"><code class="notranslate">airbus</code></li>
  <li class="list-inline-item"><code class="notranslate">airtel</code></li>
  <li class="list-inline-item"><code class="notranslate">akdn</code></li>
  <li class="list-inline-item"><code class="notranslate">alfaromeo</code></li>
  <li class="list-inline-item"><code class="notranslate">alibaba</code></li>
  <li class="list-inline-item"><code class="notranslate">alipay</code></li>
  <li class="list-inline-item"><code class="notranslate">allfinanz</code></li>
  <li class="list-inline-item"><code class="notranslate">allstate</code></li>
  <li class="list-inline-item"><code class="notranslate">ally</code></li>
  <li class="list-inline-item"><code class="notranslate">alstom</code></li>
  <li class="list-inline-item"><code class="notranslate">amazon</code></li>
  <li class="list-inline-item"><code class="notranslate">americanexpress</code></li>
  <li class="list-inline-item"><code class="notranslate">amex</code></li>
  <li class="list-inline-item"><code class="notranslate">amica</code></li>
  <li class="list-inline-item"><code class="notranslate">android</code></li>
  <li class="list-inline-item"><code class="notranslate">anz</code></li>
  <li class="list-inline-item"><code class="notranslate">aol</code></li>
  <li class="list-inline-item"><code class="notranslate">apple</code></li>
  <li class="list-inline-item"><code class="notranslate">aquarelle</code></li>
  <li class="list-inline-item"><code class="notranslate">aramco</code></li>
  <li class="list-inline-item"><code class="notranslate">audi</code></li>
  <li class="list-inline-item"><code class="notranslate">auspost</code></li>
  <li class="list-inline-item"><code class="notranslate">aws</code></li>
  <li class="list-inline-item"><code class="notranslate">axa</code></li>
  <li class="list-inline-item"><code class="notranslate">azure</code></li>
  <li class="list-inline-item"><code class="notranslate">baidu</code></li>
  <li class="list-inline-item"><code class="notranslate">bananarepublic</code></li>
  <li class="list-inline-item"><code class="notranslate">barclaycard</code></li>
  <li class="list-inline-item"><code class="notranslate">barclays</code></li>
  <li class="list-inline-item"><code class="notranslate">basketball</code></li>
  <li class="list-inline-item"><code class="notranslate">bauhaus</code></li>
  <li class="list-inline-item"><code class="notranslate">bbc</code></li>
  <li class="list-inline-item"><code class="notranslate">bbt</code></li>
  <li class="list-inline-item"><code class="notranslate">bbva</code></li>
  <li class="list-inline-item"><code class="notranslate">bcg</code></li>
  <li class="list-inline-item"><code class="notranslate">bentley</code></li>
  <li class="list-inline-item"><code class="notranslate">bharti</code></li>
  <li class="list-inline-item"><code class="notranslate">bing</code></li>
  <li class="list-inline-item"><code class="notranslate">blanco</code></li>
  <li class="list-inline-item"><code class="notranslate">bloomberg</code></li>
  <li class="list-inline-item"><code class="notranslate">bms</code></li>
  <li class="list-inline-item"><code class="notranslate">bmw</code></li>
  <li class="list-inline-item"><code class="notranslate">bnl</code></li>
  <li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
  <li class="list-inline-item"><code class="notranslate">boehringer</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">bond</code></li>-->
  <li class="list-inline-item"><code class="notranslate">booking</code></li>
  <li class="list-inline-item"><code class="notranslate">bosch</code></li>
  <li class="list-inline-item"><code class="notranslate">bostik</code></li>
  <li class="list-inline-item"><code class="notranslate">bradesco</code></li>
  <li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
  <li class="list-inline-item"><code class="notranslate">brother</code></li>
  <li class="list-inline-item"><code class="notranslate">bugatti</code></li>
  <li class="list-inline-item"><code class="notranslate">cal</code></li>
  <li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
  <li class="list-inline-item"><code class="notranslate">canon</code></li>
  <li class="list-inline-item"><code class="notranslate">capitalone</code></li>
  <li class="list-inline-item"><code class="notranslate">caravan</code></li>
  <li class="list-inline-item"><code class="notranslate">cartier</code></li>
  <li class="list-inline-item"><code class="notranslate">cba</code></li>
  <li class="list-inline-item"><code class="notranslate">cbn</code></li>
  <li class="list-inline-item"><code class="notranslate">cbre</code></li>
  <li class="list-inline-item"><code class="notranslate">cbs</code></li>
  <li class="list-inline-item"><code class="notranslate">cern</code></li>
  <li class="list-inline-item"><code class="notranslate">cfa</code></li>
  <li class="list-inline-item"><code class="notranslate">chanel</code></li>
  <li class="list-inline-item"><code class="notranslate">chase</code></li>
  <li class="list-inline-item"><code class="notranslate">chintai</code></li>
  <li class="list-inline-item"><code class="notranslate">chrome</code></li>
  <li class="list-inline-item"><code class="notranslate">chrysler</code></li>
  <li class="list-inline-item"><code class="notranslate">cipriani</code></li>
  <li class="list-inline-item"><code class="notranslate">cisco</code></li>
  <li class="list-inline-item"><code class="notranslate">citadel</code></li>
  <li class="list-inline-item"><code class="notranslate">citi</code></li>
  <li class="list-inline-item"><code class="notranslate">citic</code></li>
  <li class="list-inline-item"><code class="notranslate">clubmed</code></li>
  <li class="list-inline-item"><code class="notranslate">comcast</code></li>
  <li class="list-inline-item"><code class="notranslate">commbank</code></li>
  <li class="list-inline-item"><code class="notranslate">creditunion</code></li>
  <li class="list-inline-item"><code class="notranslate">crown</code></li>
  <li class="list-inline-item"><code class="notranslate">crs</code></li>
  <li class="list-inline-item"><code class="notranslate">csc</code></li>
  <li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
  <li class="list-inline-item"><code class="notranslate">dabur</code></li>
  <li class="list-inline-item"><code class="notranslate">datsun</code></li>
  <li class="list-inline-item"><code class="notranslate">dealer</code></li>
  <li class="list-inline-item"><code class="notranslate">dell</code></li>
  <li class="list-inline-item"><code class="notranslate">deloitte</code></li>
  <li class="list-inline-item"><code class="notranslate">delta</code></li>
  <li class="list-inline-item"><code class="notranslate">dhl</code></li>
  <li class="list-inline-item"><code class="notranslate">discover</code></li>
  <li class="list-inline-item"><code class="notranslate">dish</code></li>
  <li class="list-inline-item"><code class="notranslate">dnp</code></li>
  <li class="list-inline-item"><code class="notranslate">dodge</code></li>
  <li class="list-inline-item"><code class="notranslate">dunlop</code></li>
  <li class="list-inline-item"><code class="notranslate">dupont</code></li>
  <li class="list-inline-item"><code class="notranslate">dvag</code></li>
  <li class="list-inline-item"><code class="notranslate">edeka</code></li>
  <li class="list-inline-item"><code class="notranslate">emerck</code></li>
  <li class="list-inline-item"><code class="notranslate">epson</code></li>
  <li class="list-inline-item"><code class="notranslate">ericsson</code></li>
  <li class="list-inline-item"><code class="notranslate">erni</code></li>
  <li class="list-inline-item"><code class="notranslate">esurance</code></li>
  <li class="list-inline-item"><code class="notranslate">etisalat</code></li>
  <li class="list-inline-item"><code class="notranslate">eurovision</code></li>
  <li class="list-inline-item"><code class="notranslate">everbank</code></li>
  <li class="list-inline-item"><code class="notranslate">extraspace</code></li>
  <li class="list-inline-item"><code class="notranslate">fage</code></li>
  <li class="list-inline-item"><code class="notranslate">fairwinds</code></li>
  <li class="list-inline-item"><code class="notranslate">farmers</code></li>
  <li class="list-inline-item"><code class="notranslate">fedex</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrari</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrero</code></li>
  <li class="list-inline-item"><code class="notranslate">fiat</code></li>
  <li class="list-inline-item"><code class="notranslate">fidelity</code></li>
  <li class="list-inline-item"><code class="notranslate">firestone</code></li>
  <li class="list-inline-item"><code class="notranslate">firmdale</code></li>
  <li class="list-inline-item"><code class="notranslate">flickr</code></li>
  <li class="list-inline-item"><code class="notranslate">flir</code></li>
  <li class="list-inline-item"><code class="notranslate">flsmidth</code></li>
  <li class="list-inline-item"><code class="notranslate">ford</code></li>
  <li class="list-inline-item"><code class="notranslate">fox</code></li>
  <li class="list-inline-item"><code class="notranslate">fresenius</code></li>
  <li class="list-inline-item"><code class="notranslate">forex</code></li>
  <li class="list-inline-item"><code class="notranslate">frogans</code></li>
  <li class="list-inline-item"><code class="notranslate">frontier</code></li>
  <li class="list-inline-item"><code class="notranslate">fujitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">fujixerox</code></li>
  <li class="list-inline-item"><code class="notranslate">gallo</code></li>
  <li class="list-inline-item"><code class="notranslate">gallup</code></li>
  <li class="list-inline-item"><code class="notranslate">gap</code></li>
  <li class="list-inline-item"><code class="notranslate">gbiz</code></li>
  <li class="list-inline-item"><code class="notranslate">gea</code></li>
  <li class="list-inline-item"><code class="notranslate">genting</code></li>
  <li class="list-inline-item"><code class="notranslate">giving</code></li>
  <li class="list-inline-item"><code class="notranslate">gle</code></li>
  <li class="list-inline-item"><code class="notranslate">globo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmail</code></li>
  <li class="list-inline-item"><code class="notranslate">gmo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmx</code></li>
  <li class="list-inline-item"><code class="notranslate">godaddy</code></li>
  <li class="list-inline-item"><code class="notranslate">goldpoint</code></li>
  <li class="list-inline-item"><code class="notranslate">goodyear</code></li>
  <li class="list-inline-item"><code class="notranslate">goog</code></li>
  <li class="list-inline-item"><code class="notranslate">google</code></li>
  <li class="list-inline-item"><code class="notranslate">grainger</code></li>
  <li class="list-inline-item"><code class="notranslate">guardian</code></li>
  <li class="list-inline-item"><code class="notranslate">gucci</code></li>
  <li class="list-inline-item"><code class="notranslate">hbo</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfc</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
  <li class="list-inline-item"><code class="notranslate">hermes</code></li>
  <li class="list-inline-item"><code class="notranslate">hisamitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">hitachi</code></li>
  <li class="list-inline-item"><code class="notranslate">hkt</code></li>
  <li class="list-inline-item"><code class="notranslate">honda</code></li>
  <li class="list-inline-item"><code class="notranslate">honeywell</code></li>
  <li class="list-inline-item"><code class="notranslate">hotmail</code></li>
  <li class="list-inline-item"><code class="notranslate">hsbc</code></li>
  <li class="list-inline-item"><code class="notranslate">hughes</code></li>
  <li class="list-inline-item"><code class="notranslate">hyatt</code></li>
  <li class="list-inline-item"><code class="notranslate">hyundai</code></li>
  <li class="list-inline-item"><code class="notranslate">ibm</code></li>
  <li class="list-inline-item"><code class="notranslate">ieee</code></li>
  <li class="list-inline-item"><code class="notranslate">ifm</code></li>
  <li class="list-inline-item"><code class="notranslate">ikano</code></li>
  <li class="list-inline-item"><code class="notranslate">imdb</code></li>
  <li class="list-inline-item"><code class="notranslate">infiniti</code></li>
  <li class="list-inline-item"><code class="notranslate">intel</code></li>
  <li class="list-inline-item"><code class="notranslate">intuit</code></li>
  <li class="list-inline-item"><code class="notranslate">ipiranga</code></li>
  <li class="list-inline-item"><code class="notranslate">iselect</code></li>
  <li class="list-inline-item"><code class="notranslate">itau</code></li>
  <li class="list-inline-item"><code class="notranslate">itv</code></li>
  <li class="list-inline-item"><code class="notranslate">iveco</code></li>
  <li class="list-inline-item"><code class="notranslate">jaguar</code></li>
  <li class="list-inline-item"><code class="notranslate">java</code></li>
  <li class="list-inline-item"><code class="notranslate">jcb</code></li>
  <li class="list-inline-item"><code class="notranslate">jcp</code></li>
  <li class="list-inline-item"><code class="notranslate">jeep</code></li>
  <li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
  <li class="list-inline-item"><code class="notranslate">juniper</code></li>
  <li class="list-inline-item"><code class="notranslate">kddi</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryhotels</code></li>
  <li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryproperties</code></li>
  <li class="list-inline-item"><code class="notranslate">kfh</code></li>
  <li class="list-inline-item"><code class="notranslate">kia</code></li>
  <li class="list-inline-item"><code class="notranslate">kinder</code></li>
  <li class="list-inline-item"><code class="notranslate">kindle</code></li>
  <li class="list-inline-item"><code class="notranslate">komatsu</code></li>
  <li class="list-inline-item"><code class="notranslate">kpmg</code></li>
  <li class="list-inline-item"><code class="notranslate">kred</code></li>
  <li class="list-inline-item"><code class="notranslate">kuokgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">lacaixa</code></li>
  <li class="list-inline-item"><code class="notranslate">ladbrokes</code></li>
  <li class="list-inline-item"><code class="notranslate">lamborghini</code></li>
  <li class="list-inline-item"><code class="notranslate">lancaster</code></li>
  <li class="list-inline-item"><code class="notranslate">lancia</code></li>
  <li class="list-inline-item"><code class="notranslate">lancome</code></li>
  <li class="list-inline-item"><code class="notranslate">landrover</code></li>
  <li class="list-inline-item"><code class="notranslate">lanxess</code></li>
  <li class="list-inline-item"><code class="notranslate">lasalle</code></li>
  <li class="list-inline-item"><code class="notranslate">latrobe</code></li>
  <li class="list-inline-item"><code class="notranslate">lds</code></li>
  <li class="list-inline-item"><code class="notranslate">leclerc</code></li>
  <li class="list-inline-item"><code class="notranslate">lego</code></li>
  <li class="list-inline-item"><code class="notranslate">liaison</code></li>
  <li class="list-inline-item"><code class="notranslate">lexus</code></li>
  <li class="list-inline-item"><code class="notranslate">lidl</code></li>
  <li class="list-inline-item"><code class="notranslate">lifestyle</code></li>
  <li class="list-inline-item"><code class="notranslate">lilly</code></li>
  <li class="list-inline-item"><code class="notranslate">lincoln</code></li>
  <li class="list-inline-item"><code class="notranslate">linde</code></li>
  <li class="list-inline-item"><code class="notranslate">lipsy</code></li>
  <li class="list-inline-item"><code class="notranslate">lixil</code></li>
  <li class="list-inline-item"><code class="notranslate">locus</code></li>
  <li class="list-inline-item"><code class="notranslate">lotte</code></li>
  <li class="list-inline-item"><code class="notranslate">lpl</code></li>
  <li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
  <li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
  <li class="list-inline-item"><code class="notranslate">lupin</code></li>
  <li class="list-inline-item"><code class="notranslate">macys</code></li>
  <li class="list-inline-item"><code class="notranslate">maif</code></li>
  <li class="list-inline-item"><code class="notranslate">man</code></li>
  <li class="list-inline-item"><code class="notranslate">mango</code></li>
  <li class="list-inline-item"><code class="notranslate">marriott</code></li>
  <li class="list-inline-item"><code class="notranslate">maserati</code></li>
  <li class="list-inline-item"><code class="notranslate">mattel</code></li>
  <li class="list-inline-item"><code class="notranslate">mckinsey</code></li>
  <li class="list-inline-item"><code class="notranslate">metlife</code></li>
  <li class="list-inline-item"><code class="notranslate">microsoft</code></li>
  <li class="list-inline-item"><code class="notranslate">mini</code></li>
  <li class="list-inline-item"><code class="notranslate">mit</code></li>
  <li class="list-inline-item"><code class="notranslate">mitsubishi</code></li>
  <li class="list-inline-item"><code class="notranslate">mlb</code></li>
  <li class="list-inline-item"><code class="notranslate">mma</code></li>
  <li class="list-inline-item"><code class="notranslate">monash</code></li>
  <li class="list-inline-item"><code class="notranslate">mormon</code></li>
  <li class="list-inline-item"><code class="notranslate">moto</code></li>
  <li class="list-inline-item"><code class="notranslate">movistar</code></li>
  <li class="list-inline-item"><code class="notranslate">msd</code></li>
  <li class="list-inline-item"><code class="notranslate">mtn</code></li>
  <li class="list-inline-item"><code class="notranslate">mtr</code></li>
  <li class="list-inline-item"><code class="notranslate">mutual</code></li>
  <li class="list-inline-item"><code class="notranslate">nadex</code></li>
  <li class="list-inline-item"><code class="notranslate">nationwide</code></li>
  <li class="list-inline-item"><code class="notranslate">natura</code></li>
  <li class="list-inline-item"><code class="notranslate">nba</code></li>
  <li class="list-inline-item"><code class="notranslate">nec</code></li>
  <li class="list-inline-item"><code class="notranslate">netflix</code></li>
  <li class="list-inline-item"><code class="notranslate">neustar</code></li>
  <li class="list-inline-item"><code class="notranslate">newholland</code></li>
  <li class="list-inline-item"><code class="notranslate">nfl</code></li>
  <li class="list-inline-item"><code class="notranslate">nhk</code></li>
  <li class="list-inline-item"><code class="notranslate">nico</code></li>
  <li class="list-inline-item"><code class="notranslate">nike</code></li>
  <li class="list-inline-item"><code class="notranslate">nikon</code></li>
  <li class="list-inline-item"><code class="notranslate">nissan</code></li>
  <li class="list-inline-item"><code class="notranslate">nissay</code></li>
  <li class="list-inline-item"><code class="notranslate">nokia</code></li>
  <li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li>
  <li class="list-inline-item"><code class="notranslate">norton</code></li>
  <li class="list-inline-item"><code class="notranslate">nra</code></li>
  <li class="list-inline-item"><code class="notranslate">ntt</code></li>
  <li class="list-inline-item"><code class="notranslate">obi</code></li>
  <li class="list-inline-item"><code class="notranslate">office</code></li>
  <li class="list-inline-item"><code class="notranslate">omega</code></li>
  <li class="list-inline-item"><code class="notranslate">oracle</code></li>
  <li class="list-inline-item"><code class="notranslate">orange</code></li>
  <li class="list-inline-item"><code class="notranslate">otsuka</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
  <li class="list-inline-item"><code class="notranslate">panasonic</code></li>
  <li class="list-inline-item"><code class="notranslate">pccw</code></li>
  <li class="list-inline-item"><code class="notranslate">pfizer</code></li>
  <li class="list-inline-item"><code class="notranslate">philips</code></li>
  <li class="list-inline-item"><code class="notranslate">piaget</code></li>
  <li class="list-inline-item"><code class="notranslate">pictet</code></li>
  <li class="list-inline-item"><code class="notranslate">ping</code></li>
  <li class="list-inline-item"><code class="notranslate">pioneer</code></li>
  <li class="list-inline-item"><code class="notranslate">play</code></li>
  <li class="list-inline-item"><code class="notranslate">playstation</code></li>
  <li class="list-inline-item"><code class="notranslate">pohl</code></li>
  <li class="list-inline-item"><code class="notranslate">politie</code></li>
  <li class="list-inline-item"><code class="notranslate">praxi</code></li>
  <li class="list-inline-item"><code class="notranslate">prod</code></li>
  <li class="list-inline-item"><code class="notranslate">progressive</code></li>
  <li class="list-inline-item"><code class="notranslate">pru</code></li>
  <li class="list-inline-item"><code class="notranslate">prudential</code></li>
  <li class="list-inline-item"><code class="notranslate">pwc</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">quest</code></li>-->
  <li class="list-inline-item"><code class="notranslate">qvc</code></li>
  <li class="list-inline-item"><code class="notranslate">redstone</code></li>
  <li class="list-inline-item"><code class="notranslate">reliance</code></li>
  <li class="list-inline-item"><code class="notranslate">rexroth</code></li>
  <li class="list-inline-item"><code class="notranslate">ricoh</code></li>
  <li class="list-inline-item"><code class="notranslate">rmit</code></li>
  <li class="list-inline-item"><code class="notranslate">rocher</code></li>
  <li class="list-inline-item"><code class="notranslate">rogers</code></li>
  <li class="list-inline-item"><code class="notranslate">rwe</code></li>
  <li class="list-inline-item"><code class="notranslate">safety</code></li>
  <li class="list-inline-item"><code class="notranslate">sakura</code></li>
  <li class="list-inline-item"><code class="notranslate">samsung</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvik</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li>
  <li class="list-inline-item"><code class="notranslate">sanofi</code></li>
  <li class="list-inline-item"><code class="notranslate">sap</code></li>
  <li class="list-inline-item"><code class="notranslate">saxo</code></li>
  <li class="list-inline-item"><code class="notranslate">sbi</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
  <li class="list-inline-item"><code class="notranslate">sca</code></li>
  <li class="list-inline-item"><code class="notranslate">scb</code></li>
  <li class="list-inline-item"><code class="notranslate">schaeffler</code></li>
  <li class="list-inline-item"><code class="notranslate">schmidt</code></li>
  <li class="list-inline-item"><code class="notranslate">schwarz</code></li>
  <li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
  <li class="list-inline-item"><code class="notranslate">scor</code></li>
  <li class="list-inline-item"><code class="notranslate">seat</code></li>
  <li class="list-inline-item"><code class="notranslate">sener</code></li>
  <li class="list-inline-item"><code class="notranslate">ses</code></li>
  <li class="list-inline-item"><code class="notranslate">sew</code></li>
  <li class="list-inline-item"><code class="notranslate">seven</code></li>
  <li class="list-inline-item"><code class="notranslate">sfr</code></li>
  <li class="list-inline-item"><code class="notranslate">seek</code></li>
  <li class="list-inline-item"><code class="notranslate">shangrila</code></li>
  <li class="list-inline-item"><code class="notranslate">sharp</code></li>
  <li class="list-inline-item"><code class="notranslate">shaw</code></li>
  <li class="list-inline-item"><code class="notranslate">shell</code></li>
  <li class="list-inline-item"><code class="notranslate">shriram</code></li>
  <li class="list-inline-item"><code class="notranslate">sina</code></li>
  <li class="list-inline-item"><code class="notranslate">sky</code></li>
  <li class="list-inline-item"><code class="notranslate">skype</code></li>
  <li class="list-inline-item"><code class="notranslate">smart</code></li>
  <li class="list-inline-item"><code class="notranslate">sncf</code></li>
  <li class="list-inline-item"><code class="notranslate">softbank</code></li>
  <li class="list-inline-item"><code class="notranslate">sohu</code></li>
  <li class="list-inline-item"><code class="notranslate">sony</code></li>
  <li class="list-inline-item"><code class="notranslate">spiegel</code></li>
  <li class="list-inline-item"><code class="notranslate">stada</code></li>
  <li class="list-inline-item"><code class="notranslate">staples</code></li>
  <li class="list-inline-item"><code class="notranslate">star</code></li>
  <li class="list-inline-item"><code class="notranslate">starhub</code></li>
  <li class="list-inline-item"><code class="notranslate">statebank</code></li>
  <li class="list-inline-item"><code class="notranslate">statefarm</code></li>
  <li class="list-inline-item"><code class="notranslate">statoil</code></li>
  <li class="list-inline-item"><code class="notranslate">stc</code></li>
  <li class="list-inline-item"><code class="notranslate">stcgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">suzuki</code></li>
  <li class="list-inline-item"><code class="notranslate">swatch</code></li>
  <li class="list-inline-item"><code class="notranslate">swiftcover</code></li>
  <li class="list-inline-item"><code class="notranslate">symantec</code></li>
  <li class="list-inline-item"><code class="notranslate">taobao</code></li>
  <li class="list-inline-item"><code class="notranslate">target</code></li>
  <li class="list-inline-item"><code class="notranslate">tatamotors</code></li>
  <li class="list-inline-item"><code class="notranslate">tdk</code></li>
  <li class="list-inline-item"><code class="notranslate">telecity</code></li>
  <li class="list-inline-item"><code class="notranslate">telefonica</code></li>
  <li class="list-inline-item"><code class="notranslate">temasek</code></li>
  <li class="list-inline-item"><code class="notranslate">teva</code></li>
  <li class="list-inline-item"><code class="notranslate">tiffany</code></li>
  <li class="list-inline-item"><code class="notranslate">tjx</code></li>
  <li class="list-inline-item"><code class="notranslate">toray</code></li>
  <li class="list-inline-item"><code class="notranslate">toshiba</code></li>
  <li class="list-inline-item"><code class="notranslate">total</code></li>
  <li class="list-inline-item"><code class="notranslate">toyota</code></li>
  <li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">travelers</code></li>
  <li class="list-inline-item"><code class="notranslate">tui</code></li>
  <li class="list-inline-item"><code class="notranslate">tvs</code></li>
  <li class="list-inline-item"><code class="notranslate">ubs</code></li>
  <li class="list-inline-item"><code class="notranslate">unicom</code></li>
  <li class="list-inline-item"><code class="notranslate">uol</code></li>
  <li class="list-inline-item"><code class="notranslate">ups</code></li>
  <li class="list-inline-item"><code class="notranslate">vanguard</code></li>
  <li class="list-inline-item"><code class="notranslate">verisign</code></li>
  <li class="list-inline-item"><code class="notranslate">vig</code></li>
  <li class="list-inline-item"><code class="notranslate">viking</code></li>
  <li class="list-inline-item"><code class="notranslate">virgin</code></li>
  <li class="list-inline-item"><code class="notranslate">visa</code></li>
  <li class="list-inline-item"><code class="notranslate">vista</code></li>
  <li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
  <li class="list-inline-item"><code class="notranslate">vivo</code></li>
  <li class="list-inline-item"><code class="notranslate">volkswagen</code></li>
  <li class="list-inline-item"><code class="notranslate">volvo</code></li>
  <li class="list-inline-item"><code class="notranslate">walmart</code></li>
  <li class="list-inline-item"><code class="notranslate">walter</code></li>
  <li class="list-inline-item"><code class="notranslate">weatherchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">weber</code></li>
  <li class="list-inline-item"><code class="notranslate">weir</code></li>
  <li class="list-inline-item"><code class="notranslate">williamhill</code></li>
  <li class="list-inline-item"><code class="notranslate">windows</code></li>
  <li class="list-inline-item"><code class="notranslate">wme</code></li>
  <li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
  <li class="list-inline-item"><code class="notranslate">woodside</code></li>
  <li class="list-inline-item"><code class="notranslate">wtc</code></li>
  <li class="list-inline-item"><code class="notranslate">xbox</code></li>
  <li class="list-inline-item"><code class="notranslate">xerox</code></li>
  <li class="list-inline-item"><code class="notranslate">xfinity</code></li>
  <li class="list-inline-item"><code class="notranslate">yahoo</code></li>
  <li class="list-inline-item"><code class="notranslate">yamaxun</code></li>
  <li class="list-inline-item"><code class="notranslate">yandex</code></li>
  <li class="list-inline-item"><code class="notranslate">yodobashi</code></li>
  <li class="list-inline-item"><code class="notranslate">youtube</code></li>
  <li class="list-inline-item"><code class="notranslate">zappos</code></li>
  <li class="list-inline-item"><code class="notranslate">zara</code></li>
  <li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>
Ab dem 18. März 2025 haben wir auch diese französischen Überseegebiete zu dieser Liste hinzugefügt ([laut dieser GitHub-Anfrage](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

Ab dem 8. Juli 2025 haben wir diese europa-spezifischen Länder hinzugefügt:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

Im Oktober 2025 haben wir aufgrund der Nachfrage auch <code class="notranslate">cz</code> (Tschechische Republik) hinzugefügt.

Wir haben `ru` und `ua` aufgrund hoher Spam-Aktivität bewusst nicht aufgenommen.

### Was sind Ihre Kriterien für die Allowlist {#what-is-your-allowlist-criteria}

Wir haben eine statische Liste von [standardmäßig erlaubten Domain-Endungen](#what-domain-name-extensions-are-allowlisted-by-default) – und wir pflegen außerdem eine dynamische, zwischengespeicherte, rollierende Allowlist basierend auf den folgenden strengen Kriterien:

* Die Root-Domain des Absenders muss eine [Domain-Endung sein, die in unserer kostenlosen Tarifliste enthalten ist](#what-domain-name-extensions-can-be-used-for-free) (mit der Ergänzung von `biz` und `info`). Wir schließen auch teilweise Übereinstimmungen mit `edu`, `gov` und `mil` ein, wie z. B. `xyz.gov.au` und `xyz.edu.au`.
* Die Root-Domain des Absenders muss unter den Top 100.000 eindeutigen Root-Domains aus den geparsten Ergebnissen der [Umbrella Popularity List](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL") sein.
* Die Root-Domain des Absenders muss unter den Top 50.000 Ergebnissen von eindeutigen Root-Domains sein, die an mindestens 4 der letzten 7 Tage in der UPL erscheinen (~50%+).
* Die Root-Domain des Absenders darf von Cloudflare nicht als [Adult-Content oder Malware kategorisiert](https://radar.cloudflare.com/categorization-feedback/) sein.
* Die Root-Domain des Absenders muss entweder A- oder MX-Einträge gesetzt haben.
* Die Root-Domain des Absenders muss entweder A-Einträge, MX-Einträge, einen DMARC-Eintrag mit `p=reject` oder `p=quarantine` oder einen SPF-Eintrag mit `-all` oder `~all` Qualifier haben.

Wenn diese Kriterien erfüllt sind, wird die Root-Domain des Absenders für 7 Tage zwischengespeichert. Beachten Sie, dass unser automatisierter Job täglich läuft – daher handelt es sich um einen rollierenden Allowlist-Cache, der täglich aktualisiert wird.

Unser automatisierter Job lädt die letzten 7 Tage der UPLs im Speicher, entpackt sie und parst sie dann im Speicher gemäß den oben genannten strengen Kriterien.

Beliebte Domains zum Zeitpunkt dieses Schreibens wie Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify und mehr sind natürlich enthalten.
Wenn Sie ein Absender sind, der nicht auf unserer Positivliste steht, werden Sie beim ersten Mal, wenn Ihre FQDN-Stamm-Domain oder IP-Adresse eine E-Mail sendet, [rate-limitiert](#do-you-have-rate-limiting) und [greylistet](#do-you-have-a-greylist). Beachten Sie, dass dies eine Standardpraxis ist, die als E-Mail-Standard übernommen wurde. Die meisten E-Mail-Server-Clients versuchen es erneut, wenn sie eine Rate-Limit- oder Greylist-Fehlermeldung erhalten (z. B. einen 421- oder 4xx-Fehlerstatuscode).

**Beachten Sie, dass bestimmte Absender wie `a@gmail.com`, `b@xyz.edu` und `c@gov.au` dennoch [auf die Sperrliste gesetzt werden können](#do-you-have-a-denylist)** (z. B. wenn wir automatisch Spam, Phishing oder Malware von diesen Absendern erkennen).

### Welche Domain-Endungen können kostenlos verwendet werden {#what-domain-name-extensions-can-be-used-for-free}

Ab dem 31. März 2023 haben wir eine neue allgemeine Spam-Regel eingeführt, um unsere Nutzer und unseren Dienst zu schützen.

Diese neue Regel erlaubt nur die folgenden Domain-Endungen in unserem kostenlosen Tarif:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ac</code></li>
  <li class="list-inline-item"><code class="notranslate">ad</code></li>
  <li class="list-inline-item"><code class="notranslate">ag</code></li>
  <li class="list-inline-item"><code class="notranslate">ai</code></li>
  <li class="list-inline-item"><code class="notranslate">al</code></li>
  <li class="list-inline-item"><code class="notranslate">am</code></li>
  <li class="list-inline-item"><code class="notranslate">app</code></li>
  <li class="list-inline-item"><code class="notranslate">as</code></li>
  <li class="list-inline-item"><code class="notranslate">at</code></li>
  <li class="list-inline-item"><code class="notranslate">au</code></li>
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">ba</code></li>
  <li class="list-inline-item"><code class="notranslate">be</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">br</code></li>
  <li class="list-inline-item"><code class="notranslate">by</code></li>
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">ca</code></li>
  <li class="list-inline-item"><code class="notranslate">cat</code></li>
  <li class="list-inline-item"><code class="notranslate">cc</code></li>
  <li class="list-inline-item"><code class="notranslate">cd</code></li>
  <li class="list-inline-item"><code class="notranslate">ch</code></li>
  <li class="list-inline-item"><code class="notranslate">ck</code></li>
  <li class="list-inline-item"><code class="notranslate">co</code></li>
  <li class="list-inline-item"><code class="notranslate">com</code></li>
  <li class="list-inline-item"><code class="notranslate">de</code></li>
  <li class="list-inline-item"><code class="notranslate">dev</code></li>
  <li class="list-inline-item"><code class="notranslate">dj</code></li>
  <li class="list-inline-item"><code class="notranslate">dk</code></li>
  <li class="list-inline-item"><code class="notranslate">ee</code></li>
  <li class="list-inline-item"><code class="notranslate">es</code></li>
  <li class="list-inline-item"><code class="notranslate">eu</code></li>
  <li class="list-inline-item"><code class="notranslate">family</code></li>
  <li class="list-inline-item"><code class="notranslate">fi</code></li>
  <li class="list-inline-item"><code class="notranslate">fm</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gl</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">id</code></li>
  <li class="list-inline-item"><code class="notranslate">ie</code></li>
  <li class="list-inline-item"><code class="notranslate">il</code></li>
  <li class="list-inline-item"><code class="notranslate">im</code></li>
  <li class="list-inline-item"><code class="notranslate">in</code></li>
  <li class="list-inline-item"><code class="notranslate">io</code></li>
  <li class="list-inline-item"><code class="notranslate">ir</code></li>
  <li class="list-inline-item"><code class="notranslate">is</code></li>
  <li class="list-inline-item"><code class="notranslate">it</code></li>
  <li class="list-inline-item"><code class="notranslate">je</code></li>
  <li class="list-inline-item"><code class="notranslate">jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ke</code></li>
  <li class="list-inline-item"><code class="notranslate">kr</code></li>
  <li class="list-inline-item"><code class="notranslate">la</code></li>
  <li class="list-inline-item"><code class="notranslate">li</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">lv</code></li>
  <li class="list-inline-item"><code class="notranslate">ly</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">md</code></li>
  <li class="list-inline-item"><code class="notranslate">me</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mn</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">ms</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">mu</code></li>
  <li class="list-inline-item"><code class="notranslate">mx</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">net</code></li>
  <li class="list-inline-item"><code class="notranslate">ni</code></li>
  <li class="list-inline-item"><code class="notranslate">nl</code></li>
  <li class="list-inline-item"><code class="notranslate">no</code></li>
  <li class="list-inline-item"><code class="notranslate">nu</code></li>
  <li class="list-inline-item"><code class="notranslate">nz</code></li>
  <li class="list-inline-item"><code class="notranslate">org</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pl</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">pr</code></li>
  <li class="list-inline-item"><code class="notranslate">pt</code></li>
  <li class="list-inline-item"><code class="notranslate">pw</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">rs</code></li>
  <li class="list-inline-item"><code class="notranslate">sc</code></li>
  <li class="list-inline-item"><code class="notranslate">se</code></li>
  <li class="list-inline-item"><code class="notranslate">sh</code></li>
  <li class="list-inline-item"><code class="notranslate">si</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">sm</code></li>
  <li class="list-inline-item"><code class="notranslate">sr</code></li>
  <li class="list-inline-item"><code class="notranslate">st</code></li>
  <li class="list-inline-item"><code class="notranslate">tc</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">tm</code></li>
  <li class="list-inline-item"><code class="notranslate">to</code></li>
  <li class="list-inline-item"><code class="notranslate">tv</code></li>
  <li class="list-inline-item"><code class="notranslate">uk</code></li>
  <li class="list-inline-item"><code class="notranslate">us</code></li>
  <li class="list-inline-item"><code class="notranslate">uz</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
  <li class="list-inline-item"><code class="notranslate">vc</code></li>
  <li class="list-inline-item"><code class="notranslate">vg</code></li>
  <li class="list-inline-item"><code class="notranslate">vu</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">ws</code></li>
  <li class="list-inline-item"><code class="notranslate">xyz</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
  <li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>
### Haben Sie eine Greylist {#do-you-have-a-greylist}

Ja, wir verwenden eine sehr lockere [E-Mail-Greylisting](https://en.wikipedia.org/wiki/Greylisting_\(email\))-Richtlinie. Greylisting gilt nur für Absender, die nicht auf unserer Allowlist stehen, und bleibt für 30 Tage in unserem Cache.

Für jeden neuen Absender speichern wir einen Schlüssel in unserer Redis-Datenbank für 30 Tage mit einem Wert, der auf die anfängliche Ankunftszeit ihrer ersten Anfrage gesetzt ist. Wir lehnen dann ihre E-Mail mit einem Retry-Statuscode 450 ab und erlauben sie erst, wenn 5 Minuten vergangen sind.

Wenn sie erfolgreich 5 Minuten seit dieser anfänglichen Ankunftszeit gewartet haben, werden ihre E-Mails akzeptiert und sie erhalten diesen 450-Statuscode nicht mehr.

Der Schlüssel besteht entweder aus der FQDN-Root-Domain oder der IP-Adresse des Absenders. Das bedeutet, dass jede Subdomain, die die Greylist passiert, auch für die Root-Domain gilt und umgekehrt (das ist, was wir mit einer „sehr lockeren“ Richtlinie meinen).

Zum Beispiel, wenn eine E-Mail von `test.example.com` kommt, bevor wir eine E-Mail von `example.com` sehen, dann müssen alle E-Mails von `test.example.com` und/oder `example.com` 5 Minuten ab der anfänglichen Ankunftszeit der Verbindung warten. Wir lassen nicht sowohl `test.example.com` als auch `example.com` jeweils ihre eigenen 5-Minuten-Perioden warten (unsere Greylisting-Richtlinie gilt auf Root-Domain-Ebene).

Beachten Sie, dass Greylisting für keinen Absender auf unserer [Allowlist](#do-you-have-an-allowlist) gilt (z. B. Meta, Amazon, Netflix, Google, Microsoft zum Zeitpunkt dieses Schreibens).

### Haben Sie eine Denylist {#do-you-have-a-denylist}

Ja, wir betreiben unsere eigene Denylist und aktualisieren sie automatisch in Echtzeit sowie manuell basierend auf erkanntem Spam und bösartiger Aktivität.

Wir ziehen außerdem alle IP-Adressen aus der UCEPROTECT Level 1 Denylist unter <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> jede Stunde und fügen sie mit einer 7-tägigen Ablaufzeit in unsere Denylist ein.

Absender, die in der Denylist gefunden werden, erhalten einen 421-Fehlercode (zeigt dem Absender an, es später erneut zu versuchen), wenn sie [nicht auf der Allowlist stehen](#do-you-have-an-allowlist).

Durch die Verwendung eines 421-Statuscodes anstelle eines 554-Statuscodes können potenzielle Fehlalarme in Echtzeit gemildert werden, und die Nachricht kann beim nächsten Versuch erfolgreich zugestellt werden.

**Dies ist anders als bei anderen Mail-Diensten**, bei denen eine Blocklist einen harten und dauerhaften Fehler verursacht. Es ist oft schwierig, Absender dazu zu bringen, Nachrichten erneut zu senden (insbesondere von großen Organisationen), und daher gibt dieser Ansatz etwa 5 Tage ab dem ersten E-Mail-Versuch, damit entweder der Absender, der Empfänger oder wir eingreifen und das Problem beheben können (durch Anforderung der Entfernung von der Denylist).

Alle Anfragen zur Entfernung von der Denylist werden in Echtzeit von Administratoren überwacht (z. B. damit wiederkehrende Fehlalarme dauerhaft von Administratoren auf die Allowlist gesetzt werden können).

Anfragen zur Entfernung von der Denylist können unter <https://forwardemail.net/denylist> gestellt werden. Bezahlte Nutzer erhalten ihre Anfragen zur Entfernung von der Denylist sofort bearbeitet, während nicht bezahlte Nutzer auf die Bearbeitung durch Administratoren warten müssen.

Absender, die beim Versand von Spam- oder Vireninhalten erkannt werden, werden nach folgendem Verfahren in die Denylist aufgenommen:

1. Der [anfängliche Nachrichten-Fingerabdruck](#how-do-you-determine-an-email-fingerprint) wird bei Erkennung von Spam oder Blocklist von einem „vertrauenswürdigen“ Absender (z. B. `gmail.com`, `microsoft.com`, `apple.com`) greylisted.
   * Wenn der Absender auf der Allowlist war, wird die Nachricht für 1 Stunde greylisted.
   * Wenn der Absender nicht auf der Allowlist ist, wird die Nachricht für 6 Stunden greylisted.
2. Wir parsen Denylist-Schlüssel aus Informationen des Absenders und der Nachricht, und für jeden dieser Schlüssel erstellen wir (falls noch nicht vorhanden) einen Zähler, erhöhen ihn um 1 und cachen ihn für 24 Stunden.
   * Für allowlistete Absender:
     * Fügen Sie einen Schlüssel für die Envelope-"MAIL FROM"-E-Mail-Adresse hinzu, wenn diese SPF bestanden hat oder kein SPF vorhanden war, und es sich nicht um [einen Postmaster-Benutzernamen](#what-are-postmaster-addresses) oder [einen No-Reply-Benutzernamen](#what-are-no-reply-addresses) handelt.
     * Wenn der "From"-Header allowlistet war, dann fügen Sie einen Schlüssel für die "From"-Header-E-Mail-Adresse hinzu, wenn diese SPF bestanden hat oder DKIM bestanden und ausgerichtet war.
     * Wenn der "From"-Header nicht allowlistet war, dann fügen Sie einen Schlüssel für die "From"-Header-E-Mail-Adresse und deren geparste Root-Domain hinzu.
   * Für nicht allowlistete Absender:
     * Fügen Sie einen Schlüssel für die Envelope-"MAIL FROM"-E-Mail-Adresse hinzu, wenn diese SPF bestanden hat.
     * Wenn der "From"-Header allowlistet war, dann fügen Sie einen Schlüssel für die "From"-Header-E-Mail-Adresse hinzu, wenn diese SPF bestanden hat oder DKIM bestanden und ausgerichtet war.
     * Wenn der "From"-Header nicht allowlistet war, dann fügen Sie einen Schlüssel für die "From"-Header-E-Mail-Adresse und deren geparste Root-Domain hinzu.
     * Fügen Sie einen Schlüssel für die Remote-IP-Adresse des Absenders hinzu.
     * Fügen Sie einen Schlüssel für den durch Reverse-Lookup von der IP-Adresse des Absenders ermittelten Client-Hostnamen hinzu (falls vorhanden).
     * Fügen Sie einen Schlüssel für die Root-Domain des Client-Hostnamens hinzu (falls vorhanden und falls sie sich vom Client-Hostnamen unterscheidet).
3. Wenn der Zähler für einen nicht allowlisteten Absender und Schlüssel 5 erreicht, dann setzen wir den Schlüssel für 30 Tage auf die Denylist und senden eine E-Mail an unser Abuse-Team. Diese Zahlen können sich ändern und Aktualisierungen werden hier reflektiert, während wir den Missbrauch überwachen.
4. Wenn der Zähler für einen allowlisteten Absender und Schlüssel 10 erreicht, dann setzen wir den Schlüssel für 7 Tage auf die Denylist und senden eine E-Mail an unser Abuse-Team. Diese Zahlen können sich ändern und Aktualisierungen werden hier reflektiert, während wir den Missbrauch überwachen.
> **HINWEIS:** In naher Zukunft werden wir eine Reputationsüberwachung einführen. Die Reputationsüberwachung wird stattdessen berechnen, wann ein Absender basierend auf einem prozentualen Schwellenwert auf die Sperrliste gesetzt wird (anstatt eines rudimentären Zählers wie oben beschrieben).

### Haben Sie eine Ratenbegrenzung {#do-you-have-rate-limiting}

Die Ratenbegrenzung für Absender erfolgt entweder über die Root-Domain, die aus einer Reverse-PTR-Abfrage der IP-Adresse des Absenders ermittelt wird – oder falls dies kein Ergebnis liefert, wird einfach die IP-Adresse des Absenders verwendet. Beachten Sie, dass wir dies unten als `Sender` bezeichnen.

Unsere MX-Server haben tägliche Limits für eingehende E-Mails, die für [verschlüsselten IMAP-Speicher](/blog/docs/best-quantum-safe-encrypted-email-service) empfangen werden:

* Anstatt die eingehenden E-Mails auf individueller Alias-Basis zu begrenzen (z. B. `you@yourdomain.com`), begrenzen wir die Rate nach dem Domainnamen des Alias selbst (z. B. `yourdomain.com`). Dies verhindert, dass `Sender` die Posteingänge aller Aliase Ihrer Domain gleichzeitig überfluten.
* Wir haben allgemeine Limits, die für alle `Sender` unseres Dienstes unabhängig vom Empfänger gelten:
  * `Sender`, die wir als "vertrauenswürdig" als Quelle der Wahrheit betrachten (z. B. `gmail.com`, `microsoft.com`, `apple.com`), dürfen 100 GB pro Tag senden.
  * `Sender`, die auf der [Erlaubnisliste](#do-you-have-an-allowlist) stehen, dürfen 10 GB pro Tag senden.
  * Alle anderen `Sender` dürfen 1 GB und/oder 1000 Nachrichten pro Tag senden.
* Wir haben ein spezifisches Limit pro `Sender` und `yourdomain.com` von 1 GB und/oder 1000 Nachrichten täglich.

Die MX-Server begrenzen auch Nachrichten, die an einen oder mehrere Empfänger weitergeleitet werden, durch Ratenbegrenzung – dies gilt jedoch nur für `Sender`, die nicht auf der [Erlaubnisliste](#do-you-have-an-allowlist) stehen:

* Wir erlauben nur bis zu 100 Verbindungen pro Stunde, pro aufgelöster FQDN-Root-Domain des `Sender` (oder) der Remote-IP-Adresse des `Sender` (falls kein Reverse-PTR verfügbar ist) und pro Empfänger im Umschlag. Wir speichern den Schlüssel für die Ratenbegrenzung als kryptografischen Hash in unserer Redis-Datenbank.

* Wenn Sie E-Mails über unser System senden, stellen Sie bitte sicher, dass für alle Ihre IP-Adressen ein Reverse-PTR eingerichtet ist (ansonsten wird jede eindeutige FQDN-Root-Domain oder IP-Adresse, von der Sie senden, ratenbegrenzt).

* Beachten Sie, dass Sie, wenn Sie über ein populäres System wie Amazon SES senden, nicht ratenbegrenzt werden, da (zum Zeitpunkt dieses Schreibens) Amazon SES in unserer Erlaubnisliste steht.

* Wenn Sie von einer Domain wie `test.abc.123.example.com` senden, wird die Ratenbegrenzung auf `example.com` angewendet. Viele Spammer verwenden Hunderte von Subdomains, um gängige Spamfilter zu umgehen, die nur eindeutige Hostnamen und nicht eindeutige FQDN-Root-Domains ratenbegrenzen.

* `Sender`, die das Ratenlimit überschreiten, werden mit einem 421-Fehler abgelehnt.

Unsere IMAP- und SMTP-Server begrenzen Ihre Aliase darauf, nicht mehr als `60` gleichzeitige Verbindungen gleichzeitig zu haben.

Unsere MX-Server begrenzen [nicht erlaubnisgelistete](#do-you-have-an-allowlist) Sender darauf, nicht mehr als 10 gleichzeitige Verbindungen herzustellen (mit einem 3-minütigen Cache-Ablauf für den Zähler, der unserem Socket-Timeout von 3 Minuten entspricht).

### Wie schützen Sie vor Backscatter {#how-do-you-protect-against-backscatter}

Fehlgeleitete Bounces oder Bounce-Spam (bekannt als "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") können der Reputation der IP-Adressen von Absendern schaden.

Wir ergreifen zwei Maßnahmen zum Schutz vor Backscatter, die in den folgenden Abschnitten [Verhindern von Bounces von bekannten MAIL FROM-Spammern](#prevent-bounces-from-known-mail-from-spammers) und [Verhindern unnötiger Bounces zum Schutz vor Backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter) detailliert beschrieben sind.

### Verhindern von Bounces von bekannten MAIL FROM-Spammern {#prevent-bounces-from-known-mail-from-spammers}

Wir laden die Liste von [Backscatter.org](https://www.backscatterer.org/) (betrieben von [UCEPROTECT](https://www.uceprotect.net/)) unter <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> jede Stunde herunter und füttern sie in unsere Redis-Datenbank (wir vergleichen auch im Voraus die Unterschiede; falls IPs entfernt wurden, die berücksichtigt werden müssen).
Wenn der MAIL FROM leer ist ODER (case-insensitive) einem der [Postmaster-Adressen](#what-are-postmaster-addresses) (der Teil vor dem @ in einer E-Mail) entspricht, prüfen wir, ob die Absender-IP mit einer aus dieser Liste übereinstimmt.

Wenn die IP des Absenders aufgeführt ist (und nicht in unserer [Allowlist](#do-you-have-an-allowlist) steht), senden wir einen 554-Fehler mit der Nachricht `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Wir werden benachrichtigt, wenn ein Absender sowohl auf der Backscatterer-Liste als auch in unserer Allowlist steht, damit wir das Problem bei Bedarf lösen können.

Die in diesem Abschnitt beschriebenen Techniken entsprechen der "SAFE MODE"-Empfehlung unter <https://www.backscatterer.org/?target=usage> – dabei prüfen wir die Absender-IP nur, wenn bestimmte Bedingungen bereits erfüllt sind.

### Verhindern unnötiger Bounces zum Schutz vor Backscatter {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Bounces sind E-Mails, die anzeigen, dass die Weiterleitung der E-Mail an den Empfänger vollständig fehlgeschlagen ist und die E-Mail nicht erneut zugestellt wird.

Ein häufiger Grund, auf der Backscatterer-Liste zu landen, sind fehlgeleitete Bounces oder Bounce-Spam, daher müssen wir uns auf mehrere Arten dagegen schützen:

1. Wir senden nur, wenn >= 500 Statuscode-Fehler auftreten (wenn E-Mails, die weitergeleitet werden sollten, fehlgeschlagen sind, z.B. antwortet Gmail mit einem 500er Fehler).

2. Wir senden nur einmal und nur einmal (wir verwenden einen berechneten Bounce-Fingerabdruck-Schlüssel und speichern ihn im Cache, um doppelte Sendungen zu verhindern). Der Bounce-Fingerabdruck ist ein Schlüssel, der den Fingerabdruck der Nachricht mit einem Hash der Bounce-Adresse und ihres Fehlercodes kombiniert). Siehe den Abschnitt zu [Fingerprinting](#how-do-you-determine-an-email-fingerprint) für weitere Einblicke, wie der Nachrichten-Fingerabdruck berechnet wird. Erfolgreich gesendete Bounce-Fingerabdrücke verfallen nach 7 Tagen in unserem Redis-Cache.

3. Wir senden nur, wenn MAIL FROM und/oder From nicht leer sind und (case-insensitive) keinen [Postmaster-Benutzernamen](#what-are-postmaster-addresses) (der Teil vor dem @ in einer E-Mail) enthalten.

4. Wir senden nicht, wenn die Originalnachricht einen der folgenden Header (case-insensitive) hatte:

   * Header `auto-submitted` mit einem Wert ungleich `no`.
   * Header `x-auto-response-suppress` mit einem Wert von `dr`, `autoreply`, `auto-reply`, `auto_reply` oder `all`
   * Header `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` oder `x-auto-respond` (unabhängig vom Wert).
   * Header `precedence` mit einem Wert von `bulk`, `autoreply`, `auto-reply`, `auto_reply` oder `list`.

5. Wir senden nicht, wenn die MAIL FROM- oder From-E-Mail-Adresse mit `+donotreply`, `-donotreply`, `+noreply` oder `-noreply` endet.

6. Wir senden nicht, wenn der Benutzername der From-E-Mail-Adresse `mdaemon` war und ein case-insensitiver Header `X-MDDSN-Message` vorhanden war.

7. Wir senden nicht, wenn ein case-insensitiver `content-type`-Header mit dem Wert `multipart/report` vorhanden war.

### Wie bestimmen Sie einen E-Mail-Fingerabdruck {#how-do-you-determine-an-email-fingerprint}

Der Fingerabdruck einer E-Mail wird verwendet, um die Einzigartigkeit einer E-Mail zu bestimmen und zu verhindern, dass doppelte Nachrichten zugestellt und [doppelte Bounces](#prevent-unnecessary-bounces-to-protect-against-backscatter) gesendet werden.

Der Fingerabdruck wird aus der folgenden Liste berechnet:

* Vom Client aufgelöster FQDN-Hostname oder IP-Adresse
* Wert des `Message-ID`-Headers (falls vorhanden)
* Wert des `Date`-Headers (falls vorhanden)
* Wert des `From`-Headers (falls vorhanden)
* Wert des `To`-Headers (falls vorhanden)
* Wert des `Cc`-Headers (falls vorhanden)
* Wert des `Subject`-Headers (falls vorhanden)
* Wert des `Body` (falls vorhanden)

### Kann ich E-Mails an andere Ports als 25 weiterleiten (z.B. wenn mein ISP Port 25 blockiert) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Ja, seit dem 5. Mai 2020 haben wir diese Funktion hinzugefügt. Derzeit ist die Funktion domainspezifisch, nicht alias-spezifisch. Wenn Sie eine alias-spezifische Lösung benötigen, kontaktieren Sie uns bitte, um uns Ihre Anforderungen mitzuteilen.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Verbesserter Datenschutz:
  </strong>
  <span>
    Wenn Sie einen kostenpflichtigen Tarif nutzen (der erweiterten Datenschutz bietet), gehen Sie bitte zu <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a>, klicken Sie neben Ihrer Domain auf "Setup" und dann auf "Einstellungen". Wenn Sie mehr über kostenpflichtige Tarife erfahren möchten, sehen Sie unsere <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Preisseite</a>. Andernfalls können Sie den untenstehenden Anweisungen folgen.
  </span>
</div>
Wenn Sie den kostenlosen Plan nutzen, fügen Sie einfach einen neuen DNS <strong class="notranslate">TXT</strong>-Eintrag wie unten gezeigt hinzu, ändern jedoch den Port von 25 auf den von Ihnen gewünschten Port.

Zum Beispiel, wenn ich alle E-Mails, die an `example.com` gehen, an den SMTP-Port 1337 der Alias-Empfänger weiterleiten möchte, anstatt an Port 25:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email-port=1337</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
    Das häufigste Szenario für die Einrichtung einer benutzerdefinierten Portweiterleitung ist, wenn Sie alle E-Mails, die an example.com gehen, an einen anderen Port bei example.com weiterleiten möchten, als den SMTP-Standardport 25. Um dies einzurichten, fügen Sie einfach den folgenden <strong class="notranslate">TXT</strong>-Catch-All-Eintrag hinzu.
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=example.com</code></td>
    </tr>
  </tbody>
</table>

### Unterstützt es das Plus + Symbol für Gmail-Aliase {#does-it-support-the-plus--symbol-for-gmail-aliases}

Ja, absolut.

### Unterstützt es Subdomains {#does-it-support-sub-domains}

Ja, absolut. Anstatt "@", ".", oder leer als Name/Host/Alias zu verwenden, verwenden Sie einfach den Subdomain-Namen als Wert.

Wenn Sie möchten, dass `foo.example.com` E-Mails weiterleitet, geben Sie `foo` als Name/Host/Alias-Wert in Ihren DNS-Einstellungen ein (für sowohl MX- als auch <strong class="notranslate">TXT</strong>-Einträge).

### Leitet es die Header meiner E-Mails weiter {#does-this-forward-my-emails-headers}

Ja, absolut.

### Ist das gut getestet {#is-this-well-tested}

Ja, es wurden Tests mit [ava](https://github.com/avajs/ava) geschrieben und es gibt auch Code Coverage.

### Werden SMTP-Antwortnachrichten und Codes weitergegeben {#do-you-pass-along-smtp-response-messages-and-codes}

Ja, absolut. Wenn Sie beispielsweise eine E-Mail an `hello@example.com` senden und diese registriert ist, um an `user@gmail.com` weiterzuleiten, wird die SMTP-Antwortnachricht und der Code vom SMTP-Server "gmail.com" zurückgegeben, anstatt vom Proxy-Server bei "mx1.forwardemail.net" oder "mx2.forwardemail.net".

### Wie verhindern Sie Spammer und stellen einen guten Ruf für die E-Mail-Weiterleitung sicher {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Siehe unsere Abschnitte zu [Wie funktioniert Ihr E-Mail-Weiterleitungssystem](#how-does-your-email-forwarding-system-work), [Wie gehen Sie mit Zustellproblemen bei E-Mails um](#how-do-you-handle-email-delivery-issues) und [Wie gehen Sie damit um, wenn Ihre IP-Adressen blockiert werden](#how-do-you-handle-your-ip-addresses-becoming-blocked) oben.

### Wie führen Sie DNS-Abfragen für Domainnamen durch {#how-do-you-perform-dns-lookups-on-domain-names}

Wir haben ein Open-Source-Softwareprojekt :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) erstellt und verwenden es für DNS-Abfragen. Die standardmäßig verwendeten DNS-Server sind `1.1.1.1` und `1.0.0.1`, und DNS-Abfragen erfolgen über [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") auf Anwendungsebene.

:tangerine: [Tangerine](https://github.com/tangerine) verwendet standardmäßig [CloudFlares datenschutzorientierten Consumer-DNS-Dienst][cloudflare-dns].


## Konto und Abrechnung {#account-and-billing}

### Bieten Sie eine Geld-zurück-Garantie für kostenpflichtige Pläne an {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Ja! Automatische Rückerstattungen erfolgen, wenn Sie Ihr Konto innerhalb von 30 Tagen nach Beginn Ihres Plans upgraden, downgraden oder kündigen. Dies gilt nur für Erstkunden.
### Wenn ich den Plan wechsle, verrechnen Sie anteilig und erstatten die Differenz zurück {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Wir verrechnen nicht anteilig und erstatten die Differenz nicht zurück, wenn Sie den Plan wechseln. Stattdessen wandeln wir die verbleibende Laufzeit ab dem Ablaufdatum Ihres bestehenden Plans in die nächstliegende relative Laufzeit für Ihren neuen Plan um (abgerundet auf Monate).

Beachten Sie, dass wenn Sie innerhalb eines 30-Tage-Zeitraums seit Beginn eines kostenpflichtigen Plans zwischen kostenpflichtigen Plänen upgraden oder downgraden, wir automatisch den vollen Betrag Ihres bestehenden Plans zurückerstatten.

### Kann ich diesen E-Mail-Weiterleitungsdienst einfach als "Fallback" oder "Fallover" MX-Server verwenden {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Nein, das wird nicht empfohlen, da Sie immer nur einen Mail-Exchange-Server gleichzeitig verwenden können. Fallbacks werden normalerweise aufgrund von Prioritätsfehlkonfigurationen und Mailservern, die die MX-Prioritätsprüfung nicht respektieren, nie erneut versucht.

### Kann ich bestimmte Aliase deaktivieren {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Wenn Sie einen kostenpflichtigen Plan nutzen, müssen Sie zu <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase <i class="fa fa-angle-right"></i> Alias bearbeiten <i class="fa fa-angle-right"></i> Das Kontrollkästchen "Aktiv" deaktivieren <i class="fa fa-angle-right"></i> Fortfahren.
  </span>
</div>

Ja, bearbeiten Sie einfach Ihren DNS-<strong class="notranslate">TXT</strong>-Eintrag und setzen Sie vor den Alias ein, zwei oder drei Ausrufezeichen (siehe unten).

Beachten Sie, dass Sie die ":"-Zuordnung *beibehalten sollten*, da diese erforderlich ist, falls Sie diese Einstellung später wieder aktivieren möchten (und sie wird auch für den Import verwendet, wenn Sie auf einen unserer kostenpflichtigen Pläne upgraden).

**Für stilles Ablehnen (erscheint dem Absender, als ob die Nachricht erfolgreich gesendet wurde, geht aber tatsächlich nirgendwo hin) (Statuscode `250`):** Wenn Sie einen Alias mit "!" (einzelnes Ausrufezeichen) voranstellen, wird an Absender, die an diese Adresse senden, ein erfolgreicher Statuscode `250` zurückgegeben, aber die E-Mails gehen ins Leere (z.B. ein schwarzes Loch oder `/dev/null`).

**Für weiches Ablehnen (Statuscode `421`):** Wenn Sie einen Alias mit "!!" (doppeltes Ausrufezeichen) voranstellen, wird an Absender, die an diese Adresse senden, ein temporärer Fehlerstatuscode `421` zurückgegeben, und die E-Mails werden oft bis zu 5 Tage lang erneut versucht, bevor sie abgelehnt und zurückgewiesen werden.

**Für hartes Ablehnen (Statuscode `550`):** Wenn Sie einen Alias mit "!!!" (dreifaches Ausrufezeichen) voranstellen, wird an Absender, die an diese Adresse senden, ein permanenter Fehlerstatuscode `550` zurückgegeben und die E-Mails werden abgelehnt und zurückgewiesen.

Zum Beispiel, wenn ich möchte, dass alle E-Mails, die an `alias@example.com` gehen, nicht mehr an `user@gmail.com` weitergeleitet werden, sondern abgelehnt und zurückgewiesen werden (z.B. mit drei Ausrufezeichen):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
  <span>
    Sie können auch die Adresse des weitergeleiteten Empfängers einfach in "nobody@forwardemail.net" umschreiben, was sie an niemanden weiterleitet, wie im folgenden Beispiel.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
  <span>
    Wenn Sie erhöhte Sicherheit wünschen, können Sie auch den Teil ":user@gmail.com" (oder ":nobody@forwardemail.net") entfernen und nur "!!!alias" wie im folgenden Beispiel belassen.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias</code></td>
    </tr>
  </tbody>
</table>

### Kann ich E-Mails an mehrere Empfänger weiterleiten {#can-i-forward-emails-to-multiple-recipients}

Ja, absolut. Geben Sie einfach mehrere Empfänger in Ihren <strong class="notranslate">TXT</strong>-Einträgen an.

Zum Beispiel, wenn ich eine E-Mail, die an `hello@example.com` geht, an `user+a@gmail.com` und `user+b@gmail.com` weiterleiten möchte, würde mein <strong class="notranslate">TXT</strong>-Eintrag so aussehen:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Oder Sie können sie in zwei separaten Zeilen angeben, wie hier:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Es liegt an Ihnen!

### Kann ich mehrere globale Catch-All-Empfänger haben {#can-i-have-multiple-global-catch-all-recipients}

Ja, das können Sie. Geben Sie einfach mehrere globale Catch-All-Empfänger in Ihren <strong class="notranslate">TXT</strong>-Einträgen an.

Zum Beispiel, wenn ich jede E-Mail, die an `*@example.com` (der Stern bedeutet ein Platzhalter bzw. Catch-All) geht, an `user+a@gmail.com` und `user+b@gmail.com` weiterleiten möchte, würde mein <strong class="notranslate">TXT</strong>-Eintrag so aussehen:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Oder Sie können sie in zwei separaten Zeilen angeben, wie hier:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Antwort/Wert</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@, ".", oder leer</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>
Es liegt an dir!

### Gibt es eine maximale Anzahl an E-Mail-Adressen, an die ich pro Alias weiterleiten kann {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Ja, das Standardlimit beträgt 10. Das bedeutet NICHT, dass du nur 10 Aliase auf deinem Domainnamen haben kannst. Du kannst so viele Aliase haben, wie du möchtest (eine unbegrenzte Anzahl). Es bedeutet, dass du nur einen Alias an 10 eindeutige E-Mail-Adressen weiterleiten kannst. Du könntest `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (von 1-10) haben – und alle E-Mails an `hello@example.com` würden an `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (von 1-10) weitergeleitet werden.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
  <span>
    Brauchst du mehr als 10 Empfänger pro Alias? Schick uns eine E-Mail und wir erhöhen gerne das Limit deines Kontos.
  </span>
</div>

### Kann ich E-Mails rekursiv weiterleiten {#can-i-recursively-forward-emails}

Ja, das kannst du, allerdings musst du weiterhin das maximale Limit einhalten. Wenn du `hello:linus@example.com` und `linus:user@gmail.com` hast, dann werden E-Mails an `hello@example.com` an `linus@example.com` und `user@gmail.com` weitergeleitet. Beachte, dass ein Fehler ausgelöst wird, wenn du versuchst, E-Mails rekursiv über das maximale Limit hinaus weiterzuleiten.

### Können Leute meine E-Mail-Weiterleitung ohne meine Erlaubnis abmelden oder anmelden {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Wir verwenden MX- und <strong class="notranslate">TXT</strong>-Record-Verifizierung, daher bist du registriert, wenn du die jeweiligen MX- und <strong class="notranslate">TXT</strong>-Records dieses Dienstes hinzufügst. Wenn du sie entfernst, bist du abgemeldet. Du besitzt deine Domain und die DNS-Verwaltung, also ist es ein Problem, wenn jemand Zugriff darauf hat.

### Wie ist das kostenlos {#how-is-it-free}

Forward Email bietet eine kostenlose Stufe durch eine Kombination aus Open-Source-Entwicklung, effizienter Infrastruktur und optionalen kostenpflichtigen Plänen, die den Dienst unterstützen.

Unsere kostenlose Stufe wird unterstützt durch:

1. **Open Source Entwicklung**: Unser Code ist Open Source, was Community-Beiträge und transparente Abläufe ermöglicht.

2. **Effiziente Infrastruktur**: Wir haben unsere Systeme optimiert, um E-Mail-Weiterleitung mit minimalen Ressourcen zu ermöglichen.

3. **Bezahlte Premium-Pläne**: Nutzer, die zusätzliche Funktionen wie SMTP-Versand, IMAP-Empfang oder erweiterte Datenschutzoptionen benötigen, abonnieren unsere kostenpflichtigen Pläne.

4. **Angemessene Nutzungsgrenzen**: Die kostenlose Stufe hat faire Nutzungsrichtlinien, um Missbrauch zu verhindern.

> \[!NOTE]
> Wir sind bestrebt, die grundlegende E-Mail-Weiterleitung kostenlos anzubieten und gleichzeitig Premium-Funktionen für Nutzer mit erweiterten Bedürfnissen bereitzustellen.

> \[!TIP]
> Wenn du unseren Dienst wertvoll findest, erwäge ein Upgrade auf einen kostenpflichtigen Plan, um die laufende Entwicklung und Wartung zu unterstützen.

### Wie groß darf eine E-Mail maximal sein {#what-is-the-max-email-size-limit}

Standardmäßig gilt ein Größenlimit von 50 MB, das Inhalt, Header und Anhänge umfasst. Beachte, dass Dienste wie Gmail und Outlook nur ein Limit von 25 MB erlauben, und wenn du dieses Limit beim Senden an Adressen bei diesen Anbietern überschreitest, erhältst du eine Fehlermeldung.

Ein Fehler mit dem entsprechenden Antwortcode wird zurückgegeben, wenn das Dateigrößenlimit überschritten wird.

### Speichert ihr Protokolle von E-Mails {#do-you-store-logs-of-emails}

Nein, wir schreiben nichts auf die Festplatte und speichern keine Protokolle – mit Ausnahme von [Fehlern](#do-you-store-error-logs) und [ausgehendem SMTP](#do-you-support-sending-email-with-smtp) (siehe unsere [Datenschutzerklärung](/privacy)).

Alles wird im Arbeitsspeicher verarbeitet und [unser Quellcode ist auf GitHub](https://github.com/forwardemail).

### Speichert ihr Fehlerprotokolle {#do-you-store-error-logs}

**Ja. Du kannst Fehlerprotokolle unter [Mein Konto → Protokolle](/my-account/logs) oder [Mein Konto → Domains](/my-account/domains) einsehen.**

Seit Februar 2023 speichern wir Fehlerprotokolle für `4xx` und `5xx` SMTP-Antwortcodes für einen Zeitraum von 7 Tagen – diese enthalten den SMTP-Fehler, Umschlag und E-Mail-Header (wir speichern **nicht** den E-Mail-Text oder Anhänge).
Fehlerprotokolle ermöglichen es Ihnen, nach fehlenden wichtigen E-Mails zu suchen und Spam-Falschmeldungen für [Ihre Domains](/my-account/domains) zu reduzieren. Sie sind auch eine großartige Ressource zur Fehlerbehebung bei Problemen mit [E-Mail-Webhooks](#do-you-support-webhooks) (da die Fehlerprotokolle die Antwort des Webhook-Endpunkts enthalten).

Fehlerprotokolle für [Rate Limiting](#do-you-have-rate-limiting) und [Greylisting](#do-you-have-a-greylist) sind nicht zugänglich, da die Verbindung frühzeitig endet (z. B. bevor `RCPT TO` und `MAIL FROM` Befehle übertragen werden können).

Siehe unsere [Datenschutzerklärung](/privacy) für weitere Einblicke.

### Lesen Sie meine E-Mails {#do-you-read-my-emails}

Nein, auf keinen Fall. Siehe unsere [Datenschutzerklärung](/privacy).

Viele andere E-Mail-Weiterleitungsdienste speichern und könnten potenziell Ihre E-Mails lesen. Es gibt keinen Grund, warum weitergeleitete E-Mails auf Festplattenspeicher gespeichert werden müssen – daher haben wir die erste Open-Source-Lösung entwickelt, die alles im Arbeitsspeicher erledigt.

Wir glauben, dass Sie ein Recht auf Privatsphäre haben und respektieren dies strikt. Der Code, der auf dem Server bereitgestellt wird, ist [Open-Source-Software auf GitHub](https://github.com/forwardemail) für Transparenz und um Vertrauen aufzubauen.

### Kann ich mit diesem Dienst in Gmail "als Absender senden" {#can-i-send-mail-as-in-gmail-with-this}

Ja! Seit dem 2. Oktober 2018 haben wir diese Funktion hinzugefügt. Siehe [Wie man in Gmail als Absender sendet](#how-to-send-mail-as-using-gmail) oben!

Sie sollten auch den SPF-Eintrag für Gmail in Ihrer DNS-Konfiguration im <strong class="notranslate">TXT</strong>-Eintrag setzen.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Wenn Sie Gmail (z. B. "Als Absender senden") oder G Suite verwenden, müssen Sie <code>include:_spf.google.com</code> zu Ihrem SPF-<strong class="notranslate">TXT</strong>-Eintrag hinzufügen, zum Beispiel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### Kann ich mit diesem Dienst in Outlook "als Absender senden" {#can-i-send-mail-as-in-outlook-with-this}

Ja! Seit dem 2. Oktober 2018 haben wir diese Funktion hinzugefügt. Sehen Sie sich einfach diese beiden Links von Microsoft unten an:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Sie sollten auch den SPF-Eintrag für Outlook in Ihrer DNS-Konfiguration im <strong class="notranslate">TXT</strong>-Eintrag setzen.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wichtig:
  </strong>
  <span>
    Wenn Sie Microsoft Outlook oder Live.com verwenden, müssen Sie <code>include:spf.protection.outlook.com</code> zu Ihrem SPF-<strong class="notranslate">TXT</strong>-Eintrag hinzufügen, zum Beispiel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### Kann ich mit diesem Dienst in Apple Mail und iCloud Mail "als Absender senden" {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Wenn Sie Abonnent von iCloud+ sind, können Sie eine benutzerdefinierte Domain verwenden. [Unser Dienst ist auch mit Apple Mail kompatibel](#apple-mail).

Bitte sehen Sie <https://support.apple.com/en-us/102540> für weitere Informationen.

### Kann ich mit diesem Dienst unbegrenzt E-Mails weiterleiten {#can-i-forward-unlimited-emails-with-this}

Ja, jedoch sind "relativ unbekannte" Absender auf 100 Verbindungen pro Stunde pro Hostname oder IP begrenzt. Siehe den Abschnitt zu [Rate Limiting](#do-you-have-rate-limiting) und [Greylisting](#do-you-have-a-greylist) oben.

Mit "relativ unbekannt" meinen wir Absender, die nicht in der [Allowlist](#do-you-have-an-allowlist) erscheinen.

Wenn dieses Limit überschritten wird, senden wir einen 421-Antwortcode, der dem Mailserver des Absenders mitteilt, es später erneut zu versuchen.

### Bieten Sie unbegrenzte Domains zu einem Preis an {#do-you-offer-unlimited-domains-for-one-price}

Ja. Unabhängig davon, welchen Plan Sie haben, zahlen Sie nur einen monatlichen Preis – der alle Ihre Domains abdeckt.
### Welche Zahlungsmethoden akzeptieren Sie {#which-payment-methods-do-you-accept}

Forward Email akzeptiert die folgenden einmaligen oder monatlichen/vierteljährlichen/jährlichen Zahlungsmethoden:

1. **Kredit-/Debitkarten/Banküberweisungen**: Visa, Mastercard, American Express, Discover, JCB, Diners Club usw.
2. **PayPal**: Verbinden Sie Ihr PayPal-Konto für einfache Zahlungen
3. **Kryptowährung**: Wir akzeptieren Zahlungen über Stripes Stablecoin-Zahlungen auf den Ethereum-, Polygon- und Solana-Netzwerken

> \[!NOTE]
> Wir speichern nur begrenzte Zahlungsinformationen auf unseren Servern, die nur Zahlungskennungen und Verweise auf [Stripe](https://stripe.com/global) und [PayPal](https://www.paypal.com) Transaktions-, Kunden-, Abonnement- und Zahlungs-IDs enthalten.

> \[!TIP]
> Für maximale Privatsphäre sollten Sie Kryptowährungszahlungen in Betracht ziehen.

Alle Zahlungen werden sicher über Stripe oder PayPal abgewickelt. Ihre Zahlungsdaten werden niemals auf unseren Servern gespeichert.


## Zusätzliche Ressourcen {#additional-resources}

> \[!TIP]
> Unsere untenstehenden Artikel werden regelmäßig mit neuen Anleitungen, Tipps und technischen Informationen aktualisiert. Schauen Sie häufig vorbei, um die neuesten Inhalte zu erhalten.

* [Fallstudien & Entwicklerdokumentation](/blog/docs)
* [Ressourcen](/resources)
* [Anleitungen](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
