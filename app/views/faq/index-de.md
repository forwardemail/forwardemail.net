# Häufig gestellte Fragen {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

## Inhaltsverzeichnis {#table-of-contents}

* [Schnellstart](#quick-start)
* [Einführung](#introduction)
  * [Was ist die E-Mail-Weiterleitung?](#what-is-forward-email)
  * [Wer verwendet Forward Email](#who-uses-forward-email)
  * [Was ist der Verlauf von Forward Email](#what-is-forward-emails-history)
  * [Wie schnell ist dieser Service](#how-fast-is-this-service)
* [E-Mail-Clients](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [Mobile Geräte](#mobile-devices)
  * [So senden Sie E-Mails mit Gmail](#how-to-send-mail-as-using-gmail)
  * [Was ist der alte kostenlose Leitfaden zum Senden von E-Mails als mit Gmail?](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Erweiterte Gmail-Routing-Konfiguration](#advanced-gmail-routing-configuration)
  * [Erweiterte Outlook-Routingkonfiguration](#advanced-outlook-routing-configuration)
* [Fehlerbehebung](#troubleshooting)
  * [Warum erhalte ich meine Test-E-Mails nicht?](#why-am-i-not-receiving-my-test-emails)
  * [Wie konfiguriere ich meinen E-Mail-Client für die Verwendung mit Forward Email?](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Warum landen meine E-Mails im Spam- und Junk-Ordner und wie kann ich die Reputation meiner Domain überprüfen?](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Was soll ich tun, wenn ich Spam-E-Mails erhalte?](#what-should-i-do-if-i-receive-spam-emails)
  * [Warum werden meine an mich selbst gesendeten Test-E-Mails in Gmail als „verdächtig“ angezeigt?](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Kann ich die via forwardemail dot net in Gmail entfernen?](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Datenmanagement](#data-management)
  * [Wo befinden sich Ihre Server?](#where-are-your-servers-located)
  * [Wie exportiere und sichere ich mein Postfach?](#how-do-i-export-and-backup-my-mailbox)
  * [Wie importiere und migriere ich mein vorhandenes Postfach?](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Unterstützen Sie Self-Hosting?](#do-you-support-self-hosting)
* [E-Mail-Konfiguration](#email-configuration)
  * [Wie fange ich an und richte die E-Mail-Weiterleitung ein?](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Kann ich mehrere MX-Börsen und Server für erweiterte Weiterleitungen verwenden?](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Wie richte ich eine Abwesenheitsnotiz ein (Auto-Responder bei Abwesenheit)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Wie richte ich SPF für die E-Mail-Weiterleitung ein?](#how-do-i-set-up-spf-for-forward-email)
  * [Wie richte ich DKIM für die E-Mail-Weiterleitung ein?](#how-do-i-set-up-dkim-for-forward-email)
  * [Wie richte ich DMARC für die E-Mail-Weiterleitung ein?](#how-do-i-set-up-dmarc-for-forward-email)
  * [Wie verbinde und konfiguriere ich meine Kontakte?](#how-do-i-connect-and-configure-my-contacts)
  * [Wie verbinde und konfiguriere ich meine Kalender?](#how-do-i-connect-and-configure-my-calendars)
  * [Wie füge ich weitere Kalender hinzu und verwalte vorhandene Kalender](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Wie richte ich SRS für die E-Mail-Weiterleitung ein?](#how-do-i-set-up-srs-for-forward-email)
  * [Wie richte ich MTA-STS für die Weiterleitung von E-Mails ein?](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Wie füge ich meiner E-Mail-Adresse ein Profilbild hinzu?](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Erweiterte Funktionen](#advanced-features)
  * [Unterstützen Sie Newsletter oder Mailinglisten für marketingbezogene E-Mails?](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Unterstützen Sie das Senden von E-Mails mit API?](#do-you-support-sending-email-with-api)
  * [Unterstützen Sie den Empfang von E-Mails mit IMAP?](#do-you-support-receiving-email-with-imap)
  * [Unterstützen Sie POP3](#do-you-support-pop3)
  * [Unterstützen Sie Kalender (CalDAV)](#do-you-support-calendars-caldav)
  * [Unterstützen Sie Kontakte (CardDAV)?](#do-you-support-contacts-carddav)
  * [Unterstützen Sie das Senden von E-Mails mit SMTP](#do-you-support-sending-email-with-smtp)
  * [Unterstützen Sie OpenPGP/MIME, End-to-End-Verschlüsselung („E2EE“) und Web Key Directory („WKD“)?](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Unterstützen Sie MTA-STS](#do-you-support-mta-sts)
  * [Unterstützen Sie Passkeys und WebAuthn](#do-you-support-passkeys-and-webauthn)
  * [Unterstützen Sie bewährte Methoden für E-Mail?](#do-you-support-email-best-practices)
  * [Unterstützen Sie Bounce-Webhooks?](#do-you-support-bounce-webhooks)
  * [Unterstützen Sie Webhooks?](#do-you-support-webhooks)
  * [Unterstützen Sie reguläre Ausdrücke oder Regex](#do-you-support-regular-expressions-or-regex)
  * [Was sind Ihre ausgehenden SMTP-Limits?](#what-are-your-outbound-smtp-limits)
  * [Benötige ich eine Genehmigung, um SMTP zu aktivieren?](#do-i-need-approval-to-enable-smtp)
  * [Wie lauten Ihre SMTP-Serverkonfigurationseinstellungen?](#what-are-your-smtp-server-configuration-settings)
  * [Wie lauten Ihre IMAP-Serverkonfigurationseinstellungen?](#what-are-your-imap-server-configuration-settings)
  * [Wie lauten Ihre POP3-Serverkonfigurationseinstellungen?](#what-are-your-pop3-server-configuration-settings)
  * [Postfix SMTP-Relay-Konfiguration](#postfix-smtp-relay-configuration)
* [Sicherheit](#security)
  * [Erweiterte Server-Härtungstechniken](#advanced-server-hardening-techniques)
  * [Verfügen Sie über SOC 2- oder ISO 27001-Zertifizierungen?](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Verwenden Sie TLS-Verschlüsselung für die E-Mail-Weiterleitung?](#do-you-use-tls-encryption-for-email-forwarding)
  * [Bewahren Sie E-Mail-Authentifizierungsheader auf?](#do-you-preserve-email-authentication-headers)
  * [Bewahren Sie die ursprünglichen E-Mail-Header und verhindern Sie Spoofing?](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Wie schützen Sie sich vor Spam und Missbrauch](#how-do-you-protect-against-spam-and-abuse)
  * [Speichern Sie E-Mail-Inhalte auf der Festplatte?](#do-you-store-email-content-on-disk)
  * [Können E-Mail-Inhalte bei Systemabstürzen offengelegt werden?](#can-email-content-be-exposed-during-system-crashes)
  * [Wer hat Zugriff auf Ihre E-Mail-Infrastruktur](#who-has-access-to-your-email-infrastructure)
  * [Welche Infrastrukturanbieter nutzen Sie](#what-infrastructure-providers-do-you-use)
  * [Bieten Sie eine Datenverarbeitungsvereinbarung (DPA) an?](#do-you-offer-a-data-processing-agreement-dpa)
  * [Wie gehen Sie mit Benachrichtigungen über Datenschutzverletzungen um?](#how-do-you-handle-data-breach-notifications)
  * [Bieten Sie eine Testumgebung an](#do-you-offer-a-test-environment)
  * [Bieten Sie Überwachungs- und Warntools an?](#do-you-provide-monitoring-and-alerting-tools)
  * [Wie stellen Sie eine hohe Verfügbarkeit sicher?](#how-do-you-ensure-high-availability)
  * [Erfüllen Sie Abschnitt 889 des National Defense Authorization Act (NDAA)?](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [System- und technische Details](#system-and-technical-details)
  * [Speichern Sie E-Mails und deren Inhalte?](#do-you-store-emails-and-their-contents)
  * [Wie funktioniert Ihr E-Mail-Weiterleitungssystem](#how-does-your-email-forwarding-system-work)
  * [Wie verarbeiten Sie eine E-Mail zur Weiterleitung?](#how-do-you-process-an-email-for-forwarding)
  * [Wie gehen Sie mit Problemen bei der E-Mail-Zustellung um?](#how-do-you-handle-email-delivery-issues)
  * [Wie gehen Sie mit der Sperrung Ihrer IP-Adressen um?](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Was sind Postmasteradressen?](#what-are-postmaster-addresses)
  * [Was sind No-Reply-Adressen](#what-are-no-reply-addresses)
  * [Wie lauten die IP-Adressen Ihres Servers?](#what-are-your-servers-ip-addresses)
  * [Haben Sie eine Zulassungsliste?](#do-you-have-an-allowlist)
  * [Welche Domänennamenerweiterungen werden standardmäßig auf die Zulassungsliste gesetzt?](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Was sind Ihre Zulassungskriterien?](#what-is-your-allowlist-criteria)
  * [Welche Domain-Namen-Erweiterungen können kostenlos verwendet werden](#what-domain-name-extensions-can-be-used-for-free)
  * [Haben Sie eine Greylist?](#do-you-have-a-greylist)
  * [Haben Sie eine Deny-Liste](#do-you-have-a-denylist)
  * [Haben Sie eine Ratenbegrenzung?](#do-you-have-rate-limiting)
  * [Wie schützt man sich vor Backscatter](#how-do-you-protect-against-backscatter)
  * [Verhindern Sie Bounces von bekannten MAIL FROM-Spammern](#prevent-bounces-from-known-mail-from-spammers)
  * [Verhindern Sie unnötige Rücksprünge, um vor Rückstreuung zu schützen](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Wie ermittelt man einen E-Mail-Fingerabdruck](#how-do-you-determine-an-email-fingerprint)
  * [Kann ich E-Mails an andere Ports als 25 weiterleiten (z. B. wenn mein ISP Port 25 blockiert hat)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Unterstützt es das Pluszeichen + für Gmail-Aliase?](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Unterstützt es Subdomains?](#does-it-support-sub-domains)
  * [Leitet dies die Header meiner E-Mails weiter?](#does-this-forward-my-emails-headers)
  * [Ist das gut getestet](#is-this-well-tested)
  * [Geben Sie SMTP-Antwortnachrichten und -Codes weiter?](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Wie verhindern Sie Spammer und sorgen für einen guten Ruf bei der E-Mail-Weiterleitung?](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Wie führen Sie DNS-Lookups für Domänennamen durch?](#how-do-you-perform-dns-lookups-on-domain-names)
* [Konto und Abrechnung](#account-and-billing)
  * [Bieten Sie eine Geld-zurück-Garantie für kostenpflichtige Pläne an?](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Wenn ich den Plan wechsle, erstatten Sie mir die Differenz anteilig?](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Kann ich diesen E-Mail-Weiterleitungsdienst einfach als "Fallback"- oder "Fallover"-MX-Server verwenden?](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Kann ich bestimmte Aliase deaktivieren?](#can-i-disable-specific-aliases)
  * [Kann ich E-Mails an mehrere Empfänger weiterleiten?](#can-i-forward-emails-to-multiple-recipients)
  * [Kann ich mehrere globale Catch-All-Empfänger haben?](#can-i-have-multiple-global-catch-all-recipients)
  * [Gibt es eine maximale Anzahl von E-Mail-Adressen, an die ich pro Alias weiterleiten kann?](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Kann ich E-Mails rekursiv weiterleiten](#can-i-recursively-forward-emails)
  * [Können Leute meine E-Mail-Weiterleitung ohne meine Erlaubnis ab- oder anmelden?](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Wie ist es kostenlos](#how-is-it-free)
  * [Was ist die maximale E-Mail-Größenbeschränkung?](#what-is-the-max-email-size-limit)
  * [Speichern Sie E-Mail-Protokolle?](#do-you-store-logs-of-emails)
  * [Speichern Sie Fehlerprotokolle](#do-you-store-error-logs)
  * [Liest du meine E-Mails?](#do-you-read-my-emails)
  * [Kann ich mit diesem](#can-i-send-mail-as-in-gmail-with-this)
  * [Kann ich mit diesem](#can-i-send-mail-as-in-outlook-with-this)
  * [Kann ich mit diesem](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Kann ich damit unbegrenzt E-Mails weiterleiten?](#can-i-forward-unlimited-emails-with-this)
  * [Bieten Sie unbegrenzte Domains zu einem Preis an?](#do-you-offer-unlimited-domains-for-one-price)
  * [Welche Zahlungsmethoden akzeptieren Sie?](#which-payment-methods-do-you-accept)
* [Weitere Ressourcen](#additional-resources)

## Schnellstart {#quick-start}

So beginnen Sie mit der E-Mail-Weiterleitung:

1. **Erstellen Sie ein Konto** unter [forwardemail.net/register](https://forwardemail.net/register)

2. **Fügen Sie Ihre Domain hinzu und bestätigen Sie sie** unter [Mein Konto → Domänen](/my-account/domains)

3. **E-Mail-Aliase/Postfächer hinzufügen und konfigurieren** unter [Mein Konto → Domänen](/my-account/domains) → Aliase

4. **Testen Sie Ihr Setup**, indem Sie eine E-Mail an einen Ihrer neuen Aliase senden

> \[!TIP]
> DNS changes can take up to 24-48 hours to propagate globally, though they often take effect much sooner.

> \[!IMPORTANT]
> For enhanced deliverability, we recommend setting up [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), and [DMARC](#how-do-i-set-up-dmarc-for-forward-email) records.

## Einführung {#introduction}

### Was ist die E-Mail-Weiterleitung? {#what-is-forward-email}

> \[!NOTE]
> Forward Email is perfect for individuals, small businesses, and developers who want professional email addresses without the cost and maintenance of a full email hosting solution.

Forward Email ist ein **voll ausgestatteter E-Mail-Dienstanbieter** und **E-Mail-Hosting-Anbieter für benutzerdefinierte Domänennamen**.

Es handelt sich um den einzigen kostenlosen Open-Source-Dienst, mit dem Sie benutzerdefinierte Domänen-E-Mail-Adressen verwenden können, ohne dass Sie einen eigenen E-Mail-Server einrichten und warten müssen.

Unser Service leitet E-Mails, die an Ihre benutzerdefinierte Domäne gesendet werden, an Ihr vorhandenes E-Mail-Konto weiter – und Sie können uns sogar als Ihren dedizierten E-Mail-Hosting-Anbieter nutzen.

Hauptfunktionen von „E-Mail weiterleiten“:

* **E-Mail mit eigener Domain**: Nutzen Sie professionelle E-Mail-Adressen mit Ihrer eigenen Domain.
* **Kostenloses Kontingent**: Kostenlose E-Mail-Weiterleitung.
* **Erhöhter Datenschutz**: Wir lesen Ihre E-Mails nicht und verkaufen Ihre Daten nicht.
* **Open Source**: Unser gesamter Code ist auf GitHub verfügbar.
* **SMTP-, IMAP- und POP3-Unterstützung**: Vollständige Funktionen zum Senden und Empfangen von E-Mails.
* **Ende-zu-Ende-Verschlüsselung**: Unterstützung für OpenPGP/MIME.
* **Benutzerdefinierte Catch-All-Aliase**: Erstellen Sie unbegrenzt viele E-Mail-Aliase.

Sie können uns auf [unsere E-Mail-Vergleichsseite](/blog/best-email-service) mit über 56 anderen E-Mail-Dienstanbietern vergleichen.

> \[!TIP]
> Learn more about Forward Email by reading our free [Technical Whitepaper](/technical-whitepaper.pdf)

### Wer verwendet die E-Mail-Weiterleitung? {#who-uses-forward-email}

Wir bieten E-Mail-Hosting und E-Mail-Weiterleitungsdienste für über 500.000 Domänen und diese namhaften Benutzer:

| Kunde | Fallstudie |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| US-Marineakademie | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| Kanonisch | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Netflix-Spiele |  |
| Die Linux Foundation | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| Die PHP Foundation |  |
| Fox News Radio |  |
| Disney-Anzeigenverkäufe |  |
| jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| Ubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| In der Menschheit | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Lubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Die Universität von Cambridge | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Die Universität von Maryland | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Die Universität von Washington | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Tufts Universität | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Swarthmore College | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Regierung von Südaustralien |  |
| Regierung der Dominikanischen Republik |  |
| Fliegen Sie<span>.</span>io |  |
| RCD Hotels |  |
| Isaac Z. Schlueter (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |  |

### Was ist der Verlauf der weitergeleiteten E-Mails? {#what-is-forward-emails-history}

Weitere Informationen zum Weiterleiten von E-Mails finden Sie unter [unsere Info-Seite](/about).

### Wie schnell ist dieser Dienst {#how-fast-is-this-service}

> \[!NOTE]
> Our system is designed for speed and reliability, with multiple redundant servers to ensure your emails are delivered promptly.

Durch die Weiterleitung von E-Mails werden Nachrichten mit minimaler Verzögerung zugestellt, normalerweise innerhalb weniger Sekunden nach Erhalt.

Leistungskennzahlen:

* **Durchschnittliche Zustellzeit**: Weniger als 5–10 Sekunden vom Eingang bis zur Weiterleitung ([siehe unsere Überwachungsseite zur Zeit bis zum Posteingang „TTI“](/tti))
* **Verfügbarkeit**: Über 99,9 % Serviceverfügbarkeit
* **Globale Infrastruktur**: Strategisch platzierte Server für optimales Routing
* **Automatische Skalierung**: Unser System skaliert während der E-Mail-Spitzenzeiten

Wir arbeiten in Echtzeit, im Gegensatz zu anderen Anbietern, die auf verzögerte Warteschlangen angewiesen sind.

Wir schreiben nicht auf die Festplatte und speichern keine Protokolle – mit [Ausnahme von Fehlern](#do-you-store-error-logs) und [ausgehendes SMTP](#do-you-support-sending-email-with-smtp) (siehe unser [Datenschutzrichtlinie](/privacy)).

Alles wird im Speicher erledigt und [Unser Quellcode ist auf GitHub](https://github.com/forwardemail).

## E-Mail-Clients {#email-clients}

### Thunderbird {#thunderbird}

1. Erstellen Sie einen neuen Alias und generieren Sie ein Passwort in Ihrem E-Mail-Weiterleitungs-Dashboard.
2. Öffnen Sie Thunderbird und gehen Sie zu **Bearbeiten → Kontoeinstellungen → Kontoaktionen → E-Mail-Konto hinzufügen**.
3. Geben Sie Ihren Namen, Ihre E-Mail-Weiterleitungsadresse und Ihr Passwort ein.
4. Klicken Sie auf **Manuell konfigurieren** und geben Sie Folgendes ein:
* Eingehend: IMAP, `imap.forwardemail.net`, Port 993, SSL/TLS
* Ausgehend: SMTP, `smtp.forwardemail.net`, Port 587, STARTTLS
5. Klicken Sie auf **Fertig**

### Microsoft Outlook {#microsoft-outlook}

1. Erstellen Sie einen neuen Alias und generieren Sie ein Passwort in Ihrem E-Mail-Weiterleitungs-Dashboard.
2. Gehen Sie zu **Datei → Konto hinzufügen**.
3. Geben Sie Ihre E-Mail-Weiterleitungsadresse ein und klicken Sie auf **Verbinden**.
4. Wählen Sie **Erweiterte Optionen** und wählen Sie **Konto manuell einrichten**.
5. Wählen Sie **IMAP** und geben Sie Folgendes ein:
* Eingehend: `imap.forwardemail.net`, Port 993, SSL
* Ausgehend: `smtp.forwardemail.net`, Port 587, TLS
* Benutzername: Ihre vollständige E-Mail-Adresse
* Passwort: Ihr generiertes Passwort
6. Klicken Sie auf **Verbinden**

### Apple Mail {#apple-mail}

1. Erstellen Sie einen neuen Alias und generieren Sie ein Passwort in Ihrem E-Mail-Weiterleitungs-Dashboard.
2. Gehen Sie zu **Mail → Einstellungen → Konten → +**
3. Wählen Sie **Anderes E-Mail-Konto**
4. Geben Sie Ihren Namen, Ihre E-Mail-Weiterleitungsadresse und Ihr Passwort ein.
5. Geben Sie für die Servereinstellungen Folgendes ein:
* Eingehend: `imap.forwardemail.net`
* Ausgehend: `smtp.forwardemail.net`
* Benutzername: Ihre vollständige E-Mail-Adresse
* Passwort: Ihr generiertes Passwort
6. Klicken Sie auf **Anmelden**

### Mobilgeräte {#mobile-devices}

Für iOS:

1. Gehen Sie zu **Einstellungen → E-Mail → Konten → Konto hinzufügen → Sonstiges**.
2. Tippen Sie auf **E-Mail-Konto hinzufügen** und geben Sie Ihre Daten ein.
3. Verwenden Sie für die Servereinstellungen dieselben IMAP- und SMTP-Einstellungen wie oben.

Für Android:

1. Gehen Sie zu **Einstellungen → Konten → Konto hinzufügen → Privat (IMAP)**.
2. Geben Sie Ihre Weiterleitungs-E-Mail-Adresse und Ihr Passwort ein.
3. Verwenden Sie für die Servereinstellungen dieselben IMAP- und SMTP-Einstellungen wie oben.

### So senden Sie E-Mails mit Gmail {#how-to-send-mail-as-using-gmail}

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
Wenn Sie die Anweisungen unter <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Wie starte ich und richte eine E-Mail-Weiterleitung ein</a> befolgt haben, können Sie unten weiterlesen.
</span>
</div>

<div id="E-Mail als Inhalt senden">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wichtig:
</strong>
<span>
Bitte lesen Sie unsere <a href="/terms" class="alert-link" target="_blank">Nutzungsbedingungen</a>, <a href="/privacy" class="alert-link" target="_blank">Datenschutzrichtlinie</a> und <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">SMTP-Limits für ausgehenden Datenverkehr</a>. Ihre Nutzung gilt als Kenntnisnahme und Zustimmung.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wichtig:
</strong>
<span>
Wenn Sie Entwickler sind, lesen Sie bitte unsere <a class="alert-link" href="/email-api#outbound-emails" target="_blank">E-Mail-API-Dokumente</a>.
</span>
</div>

1. Gehen Sie zu <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domänen</a> <i class="fa fa-angle-right"></i> Einstellungen <i class="fa fa-angle-right"></i> Outbound SMTP-Konfiguration und folgen Sie den Einrichtungsanweisungen

2. Erstellen Sie einen neuen Alias für Ihre Domain unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase (z. B. <code><hello@example.com></code>)

3. Klicken Sie neben dem neu erstellten Alias auf <strong class="text-success"><i class="fa fa-key"></i> Passwort generieren</strong>. Kopieren Sie das auf dem Bildschirm angezeigte generierte Passwort in die Zwischenablage und speichern Sie es sicher.

4. Gehen Sie zu [Google Mail](https://gmail.com) und klicken Sie unter [Einstellungen <i class="fa fa-angle-right"></i> Konten und Import <i class="fa fa-angle-right"></i> E-Mail senden als](https://mail.google.com/mail/u/0/#settings/accounts) auf „Weitere E-Mail-Adresse hinzufügen“.

5. Wenn Sie zur Eingabe des „Namens“ aufgefordert werden, geben Sie den Namen ein, der als „Absender“ Ihrer E-Mail angezeigt werden soll (z. B. „Linus Torvalds“).

6. Wenn Sie zur Eingabe der „E-Mail-Adresse“ aufgefordert werden, geben Sie die vollständige E-Mail-Adresse eines Alias ein, den Sie unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domänen</a> <i class="fa fa-angle-right"></i> Aliase erstellt haben (z. B. <code><hello@example.com></code>).

7. Deaktivieren Sie „Als Alias behandeln“

8. Klicken Sie auf "Nächster Schritt", um fortzufahren

9. Wenn Sie nach dem „SMTP-Server“ gefragt werden, geben Sie <code>smtp.forwardemail.net</code> ein und belassen Sie den Port bei <code>587</code>

10. Wenn Sie zur Eingabe des „Benutzernamens“ aufgefordert werden, geben Sie die vollständige E-Mail-Adresse eines Alias ein, den Sie unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domänen</a> <i class="fa fa-angle-right"></i> Aliase erstellt haben (z. B. <code><hello@example.com></code>).

11. Wenn Sie zur Eingabe des Passworts aufgefordert werden, fügen Sie das Passwort aus <strong class="text-success"><i class="fa fa-key"></i> Passwort generieren</strong> in Schritt 3 oben ein.

12. Lassen Sie das Optionsfeld „Gesicherte Verbindung mit TLS“ aktiviert.

13. Klicken Sie auf „Konto hinzufügen“, um fortzufahren

14. Öffnen Sie einen neuen Tab zu [Google Mail](https://gmail.com) und warten Sie auf Ihre Bestätigungs-E-Mail (Sie erhalten einen Bestätigungscode, der bestätigt, dass Sie der Besitzer der E-Mail-Adresse sind, mit der Sie E-Mails senden möchten).

15. Sobald es eintrifft, kopieren Sie den Bestätigungscode und fügen Sie ihn in die Eingabeaufforderung ein, die Sie im vorherigen Schritt erhalten haben

16. Gehen Sie anschließend zurück zur E-Mail und klicken Sie auf den Link „Anfrage bestätigen“. Sie müssen diesen und den vorherigen Schritt wahrscheinlich ausführen, damit die E-Mail korrekt konfiguriert ist.

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

### Was ist die alte kostenlose Anleitung zum Senden von E-Mails mit Gmail? {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Wichtig:</strong> Diese kostenlose Anleitung ist seit Mai 2023 veraltet, da <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we jetzt ausgehendes SMTP unterstützt</a>. Wenn Sie die folgende Anleitung verwenden, <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this führt dies dazu, dass Ihre ausgehenden E-Mails</a> in Gmail die Meldung "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" erhalten.</a></div>

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
Wenn Sie die Anweisungen unter <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Wie starte ich und richte eine E-Mail-Weiterleitung ein</a> befolgt haben, können Sie unten weiterlesen.
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="So senden Sie E-Mails mit Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Damit dies funktioniert, muss die [Zwei-Faktor-Authentifizierung von Gmail][gmail-2fa] aktiviert sein. Falls diese Funktion nicht aktiviert ist, besuchen Sie <https://www.google.com/landing/2step/>.

2. Sobald die Zwei-Faktor-Authentifizierung aktiviert ist (oder wenn Sie sie bereits aktiviert hatten), besuchen Sie <https://myaccount.google.com/apppasswords>.

3. Wählen Sie bei der Aufforderung „App und Gerät auswählen, für das Sie das App-Passwort generieren möchten“ Folgendes aus:
* Wählen Sie im Dropdown-Menü „App auswählen“ die Option „E-Mail“ aus.
* Wählen Sie im Dropdown-Menü „Gerät auswählen“ die Option „Andere“ aus.
* Geben Sie bei der Eingabeaufforderung die E-Mail-Adresse Ihrer benutzerdefinierten Domain ein, von der aus Sie die Weiterleitung durchführen (z. B. <code><hello@example.com></code> – so behalten Sie den Überblick, falls Sie diesen Dienst für mehrere Konten nutzen).

4. Kopieren Sie das automatisch generierte Passwort in die Zwischenablage.
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wichtig:
</strong>
<span>
Wenn Sie die G Suite verwenden, öffnen Sie in Ihrem Admin-Bereich <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Apps <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Gmail-Einstellungen <i class="fa fa-angle-right"></i> Einstellungen</a> und aktivieren Sie „Benutzern erlauben, E-Mails über einen externen SMTP-Server zu senden …“. Die Aktivierung dieser Änderung dauert etwas. Bitte warten Sie daher einige Minuten.
</span>
</div>

5. Gehen Sie zu [Google Mail](https://gmail.com) und klicken Sie unter [Einstellungen <i class="fa fa-angle-right"></i> Konten und Import <i class="fa fa-angle-right"></i> E-Mail senden als](https://mail.google.com/mail/u/0/#settings/accounts) auf „Weitere E-Mail-Adresse hinzufügen“.

6. Wenn Sie nach „Name“ gefragt werden, geben Sie den Namen ein, der als „Von“ in Ihrer E-Mail angezeigt werden soll (z. B. „Linus Torvalds“).

7. Wenn Sie zur Eingabe der „E-Mail-Adresse“ aufgefordert werden, geben Sie die E-Mail-Adresse mit der benutzerdefinierten Domäne ein, die Sie oben verwendet haben (z. B. <code><hello@example.com></code>).

8. Deaktivieren Sie „Als Alias behandeln“

9. Klicken Sie auf "Nächster Schritt", um fortzufahren

10. Wenn Sie nach dem „SMTP-Server“ gefragt werden, geben Sie <code>smtp.gmail.com</code> ein und belassen Sie den Port bei <code>587</code>

11. Wenn Sie nach „Nutzername“ gefragt werden, geben Sie den Teil Ihrer Gmail-Adresse ohne den Teil <span>gmail.com</span> ein (z. B. nur „user“, wenn meine E-Mail-Adresse <span><user@gmail.com></span> lautet).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wichtig:
</strong>
<span>
Wenn der Teil „Nutzername“ automatisch ausgefüllt wird, <u><strong>müssen Sie diesen</strong></u> in den Nutzernamen Ihrer Gmail-Adresse ändern.
</span>
</div>

12. Wenn Sie zur Eingabe des Passworts aufgefordert werden, fügen Sie das in Schritt 2 oben generierte Passwort aus Ihrer Zwischenablage ein

13. Lassen Sie das Optionsfeld „Gesicherte Verbindung mit TLS“ aktiviert.

14. Klicken Sie auf „Konto hinzufügen“, um fortzufahren

15. Öffnen Sie einen neuen Tab zu [Google Mail](https://gmail.com) und warten Sie auf Ihre Bestätigungs-E-Mail (Sie erhalten einen Bestätigungscode, der bestätigt, dass Sie der Besitzer der E-Mail-Adresse sind, mit der Sie E-Mails senden möchten).

16. Sobald es eintrifft, kopieren Sie den Bestätigungscode und fügen Sie ihn in die Eingabeaufforderung ein, die Sie im vorherigen Schritt erhalten haben

17. Gehen Sie anschließend zurück zur E-Mail und klicken Sie auf den Link „Anfrage bestätigen“. Sie müssen diesen und den vorherigen Schritt wahrscheinlich ausführen, damit die E-Mail korrekt konfiguriert ist.

</div>

### Erweiterte Gmail-Routing-Konfiguration {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Geschätzte Einrichtungszeit:</strong>
<span>15–30 Minuten</span>
</div>

Wenn Sie in Gmail eine erweiterte Weiterleitung einrichten möchten, sodass Aliase, die keinem Postfach entsprechen, an die E-Mail-Austausche von Forward Email weitergeleitet werden, gehen Sie folgendermaßen vor:

1. Melden Sie sich in Ihrer Google Admin-Konsole unter [admin.google.com](https://admin.google.com) an.
2. Gehen Sie zu **Apps → Google Workspace → Gmail → Routing**.
3. Klicken Sie auf **Route hinzufügen** und konfigurieren Sie die folgenden Einstellungen:

**Einstellungen für einzelne Empfänger:**

* Wählen Sie „Umschlagempfänger ändern“ und geben Sie Ihre primäre Gmail-Adresse ein.
* Aktivieren Sie „X-Gm-Original-To-Header mit ursprünglichem Empfänger hinzufügen“.

**Umschlagempfängermuster:**

* Fügen Sie ein Muster hinzu, das mit allen nicht vorhandenen Postfächern übereinstimmt (z. B. `.*@yourdomain.com`)

**E-Mail-Servereinstellungen:**

* Wählen Sie „An Host weiterleiten“ und geben Sie `mx1.forwardemail.net` als primären Server ein.
* Fügen Sie `mx2.forwardemail.net` als Backup-Server hinzu.
* Stellen Sie Port 25 ein.
* Wählen Sie „TLS erforderlich“ aus Sicherheitsgründen.

4. Klicken Sie auf **Speichern**, um die Route zu erstellen

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wichtig:
</strong>
<span>
Diese Konfiguration funktioniert nur für Google Workspace-Konten mit benutzerdefinierten Domains, nicht für normale Gmail-Konten.
</span>
</div>

### Erweiterte Outlook-Routingkonfiguration {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Geschätzte Einrichtungszeit:</strong>
<span>15–30 Minuten</span>
</div>

Für Benutzer von Microsoft 365 (früher Office 365), die eine erweiterte Weiterleitung einrichten möchten, sodass Aliase, die keinem Postfach entsprechen, an den E-Mail-Austausch von Forward Email weitergeleitet werden:

1. Melden Sie sich im Microsoft 365 Admin Center unter [admin.microsoft.com](https://admin.microsoft.com) an.
2. Gehen Sie zu **Exchange → Nachrichtenfluss → Regeln**.
3. Klicken Sie auf **Regel hinzufügen** und wählen Sie **Neue Regel erstellen**.
4. Benennen Sie Ihre Regel (z. B. „Nicht vorhandene Postfächer an E-Mail weiterleiten“).
5. Wählen Sie unter **Diese Regel anwenden, wenn** Folgendes aus:
* „Die Empfängeradresse entspricht…“
* Geben Sie ein Muster ein, das mit allen Adressen in Ihrer Domain übereinstimmt (z. B. `*@yourdomain.com`).
6. Wählen Sie unter **Folgendes ausführen** Folgendes aus:
* „Nachricht umleiten an…“
* Wählen Sie „Folgenden Mailserver“
* Geben Sie `mx1.forwardemail.net` und Port 25 ein.
* Fügen Sie `mx2.forwardemail.net` als Backup-Server hinzu.
7. Wählen Sie unter **Außer wenn** Folgendes aus:
* „Der Empfänger ist…“
* Fügen Sie alle Ihre Vorhandene Postfächer, die nicht weitergeleitet werden sollen.
8. Legen Sie die Regelpriorität fest, um sicherzustellen, dass sie nach anderen E-Mail-Flussregeln ausgeführt wird.
9. Klicken Sie auf **Speichern**, um die Regel zu aktivieren.

## Fehlerbehebung {#troubleshooting}

### Warum erhalte ich meine Test-E-Mails nicht? {#why-am-i-not-receiving-my-test-emails}

Wenn Sie eine Test-E-Mail an sich selbst senden, wird diese möglicherweise nicht in Ihrem Posteingang angezeigt, da sie denselben Header „Message-ID“ hat.

Dies ist ein weithin bekanntes Problem und betrifft auch Dienste wie Gmail. <a href="https://support.google.com/a/answer/1703601">Here ist die offizielle Gmail-Antwort zu diesem Problem</a>.

Sollten weiterhin Probleme auftreten, liegt dies höchstwahrscheinlich an der DNS-Weitergabe. Warten Sie etwas länger und versuchen Sie es erneut (oder versuchen Sie, einen niedrigeren TTL-Wert für Ihre <strong class="notranslate">TXT</strong>-Einträge festzulegen).

**Haben Sie weiterhin Probleme?** Bitte <a href="/help">kontaktieren Sie uns</a>, damit wir das Problem untersuchen und schnell eine Lösung finden können.

### Wie konfiguriere ich meinen E-Mail-Client für die Weiterleitung von E-Mails? {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
Unser Service ist mit gängigen E-Mail-Clients kompatibel, darunter:
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android™</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux™</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Desktop</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Terminal</a></li>
  </ul>
</div>

<div class="alert alert-primary">
Ihr Benutzername ist die E-Mail-Adresse Ihres Alias und Ihr Passwort stammt von <strong class="text-success"><i class="fa fa-key"></i> Passwort generieren</strong> („Normales Passwort“).
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>Wenn Sie Thunderbird verwenden, stellen Sie sicher, dass die Verbindungssicherheit auf „SSL/TLS“ und die Authentifizierungsmethode auf „Normales Passwort“ eingestellt ist.</span>
</div>

| Typ | Hostname | Protokoll | Häfen |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **Bevorzugt** | `993` und `2993` |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Bevorzugt** oder TLS (STARTTLS) | `465` und `2465` für SSL/TLS (oder) `587`, `2587`, `2525` und `25` für TLS (STARTTLS) |

### Warum landen meine E-Mails im Spam- und Junk-Ordner und wie kann ich die Reputation meiner Domain überprüfen? {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

Dieser Abschnitt enthält Anleitungen, wenn Ihre ausgehenden E-Mails unsere SMTP-Server verwenden (z. B. `smtp.forwardemail.net`) (oder über `mx1.forwardemail.net` oder `mx2.forwardemail.net` weitergeleitet werden) und im Spam- oder Junk-Ordner der Empfänger landen.

Wir überwachen unseren [IP-Adressen](#what-are-your-servers-ip-addresses) routinemäßig im Vergleich zu [alle seriösen DNS-Denylisten](#how-do-you-handle-your-ip-addresses-becoming-blocked), **deshalb handelt es sich höchstwahrscheinlich um ein spezifisches Problem der Domänenreputation**.

E-Mails können aus mehreren Gründen im Spam-Ordner landen:

1. **Fehlende Authentifizierung**: Richten Sie die Datensätze [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) und [DMARC](#how-do-i-set-up-dmarc-for-forward-email) ein.

2. **Domänenreputation**: Neue Domänen haben oft eine neutrale Reputation, bis sie einen Sendeverlauf aufbauen.

3. **Inhaltsauslöser**: Bestimmte Wörter oder Ausdrücke können Spamfilter auslösen.

4. **Sendemuster**: Plötzliche Anstiege des E-Mail-Volumens können verdächtig aussehen.

Sie können versuchen, eines oder mehrere dieser Tools zu verwenden, um die Reputation und Kategorisierung Ihrer Domain zu überprüfen:

| Werkzeugname | URL | Typ |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Cloudflare-Feedback zur Domänenkategorisierung | <https://radar.cloudflare.com/domains/feedback> | Kategorisierung |
| Spamhaus IP- und Domain-Reputationschecker | <https://check.spamhaus.org/> | DNSBL |
| Cisco Talos IP- und Domänen-Reputationscenter | <https://talosintelligence.com/reputation_center> | Ruf |
| Barracuda IP- und Domänenreputationssuche | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| MX Toolbox Blacklist-Prüfung | <https://mxtoolbox.com/blacklists.aspx> | Schwarze Liste |
| Google Postmaster Tools | <https://www.gmail.com/postmaster/> | Ruf |
| Yahoo Sender Hub | <https://senders.yahooinc.com/> | Ruf |
| MultiRBL.valli.org Blacklist-Check | <https://multirbl.valli.org/lookup/> | DNSBL |
| Absenderbewertung | <https://senderscore.org/act/blocklist-remover/> | Ruf |
| Aufwertung | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Apple/Proofpoint IP-Entfernung | <https://ipcheck.proofpoint.com/> | Entfernung |
| Cloudmark IP-Entfernung | <https://csi.cloudmark.com/en/reset/> | Entfernung |
| SpamCop | <https://www.spamcop.net/bl.shtml> | DNSBL |
| IP-Entfernung für Microsoft Outlook und Office 365 | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | Entfernung |
| UCEPROTECT Level 1, 2 und 3 | <https://www.uceprotect.net/en/rblcheck.php> | DNSBL |
| UCEPROTECTs backscatterer.org | <https://www.backscatterer.org/> | Rückstreuschutz |
| Whitelisted.org von UCEPROTECT | <https://www.whitelisted.org/> (kostenpflichtig) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | Entfernung |
| AOL/Verizon (z. B. `[IPTS04]`) | <https://senders.yahooinc.com/> | Entfernung |
| Cox Communications | `unblock.request@cox.net` | Entfernung |
| t-online.de (Deutsch/T-Mobile) | `tobr@rx.t-online.de` | Entfernung |

> \[!TIP]
> Start with a low volume of high-quality emails to build a positive reputation before sending in larger volumes.

> \[!IMPORTANT]
> If your domain is on a blacklist, each blacklist has its own removal process. Check their websites for instructions.

> \[!TIP]
> If you need additional help or find that we are false-positive listed as spam by a certain email service provider, then please <a href="/help">contact us</a>.

### Was soll ich tun, wenn ich Spam-E-Mails erhalte? {#what-should-i-do-if-i-receive-spam-emails}

Sie sollten sich (sofern möglich) von der E-Mail-Liste abmelden und den Absender blockieren.

Bitte melden Sie die Nachricht nicht als Spam, sondern leiten Sie sie an unser manuell kuratiertes und auf Datenschutz ausgerichtetes Missbrauchspräventionssystem weiter.

**Die E-Mail-Adresse, an die Spam weitergeleitet werden soll, lautet:** <abuse@forwardemail.net>

### Warum werden meine an mich gesendeten Test-E-Mails in Gmail als „verdächtig“ angezeigt? {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Wenn Sie diese Fehlermeldung in Gmail sehen, wenn Sie einen Test an sich selbst senden, oder wenn eine Person, der Sie unter Ihrem Alias eine E-Mail senden, zum ersten Mal eine E-Mail von Ihnen sieht, **machen Sie sich bitte keine Sorgen** – dies ist eine integrierte Sicherheitsfunktion von Gmail.

Klicken Sie einfach auf „Sieht sicher aus“. Wenn Sie beispielsweise eine Testnachricht mit der Funktion „E-Mail senden als“ an eine andere Person senden, wird diese Nachricht nicht angezeigt.

Wenn diese Meldung dennoch angezeigt wird, liegt das daran, dass Ihre E-Mails normalerweise von <john@gmail.com> und nicht von <john@customdomain.com> stammen (nur ein Beispiel). Gmail benachrichtigt die Nutzer, um die Sicherheit zu gewährleisten. Es gibt keine Lösung.

### Kann ich „via forwardemail dot net“ in Gmail entfernen? {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Dieses Thema bezieht sich auf einen [weithin bekanntes Problem in Gmail, bei dem neben dem Namen eines Absenders zusätzliche Informationen angezeigt werden](https://support.google.com/mail/answer/1311182).

Ab Mai 2023 unterstützen wir das Senden von E-Mails mit SMTP als Add-on für alle zahlenden Benutzer – das bedeutet, dass Sie <span class="notranslate">via forwardemail dot net</span> in Gmail entfernen können.

Beachten Sie, dass dieses FAQ-Thema speziell für Benutzer der Funktion [So senden Sie E-Mails mit Gmail](#how-to-send-mail-as-using-gmail) gilt.

Konfigurationsanweisungen finden Sie im Abschnitt zu [Unterstützen Sie das Senden von E-Mails mit SMTP](#do-you-support-sending-email-with-smtp).

## Datenverwaltung {#data-management}

### Wo befinden sich Ihre Server? {#where-are-your-servers-located}

> \[!TIP]
> We may soon announce our EU datacenter location hosted under [forwardemail.eu](https://forwardemail.eu).  Subscribe to the discussion at <https://github.com/orgs/forwardemail/discussions/336> for updates.

Unsere Server befinden sich hauptsächlich in Denver, Colorado – unsere vollständige Liste der IP-Adressen finden Sie unter <https://forwardemail.net/ips>.

Auf unseren Seiten [GDPR](/gdpr), [DPA](/dpa) und [Datenschutz](/privacy) können Sie mehr über unsere Unterauftragsverarbeiter erfahren.

### Wie exportiere und sichere ich mein Postfach {#how-do-i-export-and-backup-my-mailbox}

Sie können Ihre Postfächer jederzeit im Format [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) oder verschlüsselt im Format [SQLite](https://en.wikipedia.org/wiki/SQLite) exportieren.

Gehen Sie zu <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domänen</a> <i class="fa fa-angle-right"></i> Aliase <i class="fa fa-angle-right"></i> Backup herunterladen und wählen Sie Ihren bevorzugten Exportformattyp aus.

Sobald der Export abgeschlossen ist, wird Ihnen per E-Mail ein Link zum Herunterladen zugeschickt.

Beachten Sie, dass dieser Export-Download-Link aus Sicherheitsgründen nach 4 Stunden abläuft.

Wenn Sie Ihre exportierten EML- oder Mbox-Formate überprüfen müssen, können diese Open-Source-Tools hilfreich sein:

| Name | Format | Plattform | GitHub-URL |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox-Viewer | Mbox | Windows | <https://github.com/eneam/mboxviewer> |
| mbox-web-viewer | Mbox | Alle Plattformen | <https://github.com/PHMRanger/mbox-web-viewer> |
| EmlReader | EML | Windows | <https://github.com/ayamadori/EmlReader> |
| E-Mail-Viewer | EML | VSCode | <https://github.com/joelharkes/vscode_email_viewer> |
| EML-Reader | EML | Alle Plattformen | <https://github.com/s0ph1e/eml-reader> |

Wenn Sie zusätzlich eine Mbox-Datei in eine EML-Datei konvertieren müssen, können Sie <https://github.com/noelmartinon/mboxzilla>. verwenden

### Wie importiere und migriere ich mein vorhandenes Postfach {#how-do-i-import-and-migrate-my-existing-mailbox}

Mit den folgenden Anweisungen können Sie Ihre E-Mails ganz einfach in Forward Email importieren (z. B. mit [Thunderbird](https://www.thunderbird.net)):

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wichtig:
</strong>
<span>
Um Ihre bestehende E-Mail-Adresse zu importieren, müssen Sie alle folgenden Schritte ausführen.
</span>
</div>

1. Exportieren Sie Ihre E-Mails von Ihrem bestehenden E-Mail-Anbieter:

| E-Mail-Anbieter | Exportformat | Exportanweisungen |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Google Mail | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| Ausblick | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Tipp:</strong> <span>Wenn Sie Outlook verwenden (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST-Exportformat</a>), können Sie einfach den Anweisungen unter „Sonstiges“ weiter unten folgen. Nachfolgend finden Sie jedoch Links zum Konvertieren von PST in das MBOX/EML-Format, abhängig von Ihrem Betriebssystem:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba für Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst für Windows cygwin</a> – (z. B. <code>readpst -u -o $OUT_DIR $IN_DIR</code>, wobei <code>$OUT_DIR</code> und <code>$IN_DIR</code> durch Ausgabeverzeichnis und Eingabeverzeichnispfade jeweils).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst für Ubuntu/Linux</a> – (z. B. <code>sudo apt-get install readpst</code> und dann <code>readpst -u -o $OUT_DIR $IN_DIR</code>, wobei <code>$OUT_DIR</code> und <code>$IN_DIR</code> durch die Ausgabeverzeichnis- und Eingabeverzeichnispfade jeweils ersetzt werden).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst für macOS (über brew)</a> – (z. B. <code>brew install libpst</code> und dann <code>readpst -u -o $OUT_DIR $IN_DIR</code>, wobei <code>$OUT_DIR</code> und <code>$IN_DIR</code> mit den Pfaden für das Ausgabeverzeichnis bzw. das Eingabeverzeichnis).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST-Konverter für Windows (GitHub)</a></li></ul><br /></span></div> |
| Apple Mail | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| Fastmail | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail> |
| Proton Mail | MBOX/EML | <https://proton.me/support/export-emails-import-export-app> |
| Tutanota | EML | <https://github.com/crepererum-oss/tatutanatata> |
| Denken | EML | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents> |
| Zoho | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| Andere | [Use Thunderbird](https://www.thunderbird.net) | Richten Sie Ihr bestehendes E-Mail-Konto in Thunderbird ein und verwenden Sie anschließend das Plugin [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) zum Exportieren und Importieren Ihrer E-Mails. **Sie können E-Mails auch einfach per Kopieren/Einfügen oder Drag & Drop von einem Konto in ein anderes verschieben.** |

2. Laden Sie [Thunderbird](https://www.thunderbird.net) herunter, installieren und öffnen Sie es.

3. Erstellen Sie ein neues Konto mit der vollständigen E-Mail-Adresse Ihres Alias (z. B. <code><you@yourdomain.com></code>) und Ihrem generierten Passwort. <strong>Falls Sie noch kein generiertes Passwort haben, <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">lesen Sie unsere Einrichtungsanleitung</a></strong>.

4. Laden Sie das Thunderbird-Plugin [ImportExportTools OF](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) herunter und installieren Sie es.

5. Erstellen Sie einen neuen lokalen Ordner in Thunderbird und klicken Sie mit der rechten Maustaste darauf → wählen Sie die Option `ImportExportTools NG` → wählen Sie `Import mbox file` (für das MBOX-Exportformat) – oder – `Import messages` / `Import all messages from a directory` (für das EML-Exportformat).

6. Ziehen Sie die Nachrichten per Drag & Drop aus dem lokalen Ordner in einen neuen (oder bestehenden) IMAP-Ordner in Thunderbird, in den Sie sie im IMAP-Speicher unseres Dienstes hochladen möchten. Dadurch wird sichergestellt, dass die Nachrichten online in unserem SQLite-verschlüsselten Speicher gesichert werden.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>
Wenn Sie sich nicht sicher sind, wie Sie Dateien in Thunderbird importieren, finden Sie die offiziellen Anleitungen unter <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> und <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wichtig:
</strong>
<span>
Nachdem Sie den Export- und Importvorgang abgeschlossen haben, können Sie die Weiterleitung für Ihr bestehendes E-Mail-Konto aktivieren und einen Autoresponder einrichten, der Absender über Ihre neue E-Mail-Adresse informiert (z. B. wenn Sie zuvor Gmail verwendet haben und nun eine E-Mail-Adresse mit Ihrem benutzerdefinierten Domainnamen nutzen).
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

### Unterstützen Sie Self-Hosting? {#do-you-support-self-hosting}

Ja, ab März 2025 unterstützen wir eine selbst gehostete Option. Lesen Sie den Blog [Hier](https://forwardemail.net/blog/docs/self-hosted-solution). Schauen Sie sich den [selbst gehosteter Leitfaden](https://forwardemail.net/self-hosted) an, um loszulegen. Wer eine detailliertere Schritt-für-Schritt-Anleitung sucht, findet unsere Anleitungen auf [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) oder [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

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
Lesen Sie die unten aufgeführten Schritte eins bis acht sorgfältig durch und befolgen Sie sie. Ersetzen Sie die E-Mail-Adresse <code>user@gmail.com</code> durch die E-Mail-Adresse, an die Sie E-Mails weiterleiten möchten (falls diese noch nicht korrekt ist). Ersetzen Sie <code>example.com</code> durch Ihren benutzerdefinierten Domänennamen (falls dieser noch nicht korrekt ist).
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">Wenn Sie Ihren Domainnamen bereits registriert haben, überspringen Sie diesen Schritt und fahren Sie mit Schritt 2 fort! Andernfalls können Sie <a href="/domain-registration" rel="noopener noreferrer">hier klicken, um Ihren Domainnamen zu registrieren</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
Wissen Sie noch, wo Sie Ihre Domain registriert haben? Folgen Sie anschließend den folgenden Anweisungen:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wichtig:
</strong>
<span>
Sie müssen einen neuen Tab öffnen und sich bei Ihrem Domain-Registrar anmelden. Klicken Sie einfach unten auf „Registrar“, um die Anmeldung automatisch durchzuführen. Navigieren Sie in diesem neuen Tab zur DNS-Verwaltung Ihres Registrars. Die Schritt-für-Schritt-Anleitung finden Sie unten in der Spalte „Konfigurationsschritte“. Sobald Sie diese Seite im neuen Tab aufgerufen haben, können Sie dorthin zurückkehren und mit Schritt 3 fortfahren.
<strong class="font-weight-bold">Schließen Sie den geöffneten Tab noch nicht. Sie benötigen ihn für weitere Schritte!</strong>
</span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Registrar</th>
<th>Konfigurationsschritte</th>
</tr>
</thead>
<tbody>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
<td>Anmelden <i class="fa fa-angle-right"></i> Domain-Center <i class="fa fa-angle-right"></i> (Domain auswählen) <i class="fa fa-angle-right"></i> DNS-Einstellungen bearbeiten</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
<td>Anmelden <i class="fa fa-angle-right"></i> Gehostete Zonen <i class="fa fa-angle-right"></i> (Domain auswählen)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>Anmelden <i class="fa fa-angle-right"></i> Meine Server <i class="fa fa-angle-right"></i> Domainverwaltung <i class="fa fa-angle-right"></i> DNS-Manager</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>FOR ROCK: Anmelden <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Klicken Sie auf das ▼-Symbol neben „Verwalten“) <i class="fa fa-angle-right"></i> DNS
<br />
FÜR VERALTETE SYSTEME: Anmelden <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Zonen-Editor <i class="fa fa-angle-right"></i> (Wählen Sie Ihre Domain aus)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>Anmelden <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Leicht gemacht</a></td>
<td>Anmelden <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Domain auswählen)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>Anmelden <i class="fa fa-angle-right"></i> (Domain auswählen) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Verwalten</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
<td>Anmelden <i class="fa fa-angle-right"></i> Netzwerk <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Wählen Sie Ihre Domain aus) <i class="fa fa-angle-right"></i> Mehr <i class="fa fa-angle-right"></i> Domain verwalten</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>Anmelden <i class="fa fa-angle-right"></i> Klicken Sie in der Kartenansicht auf „Domain verwalten“. <i class="fa fa-angle-right"></i> Klicken Sie in der Listenansicht auf das Zahnradsymbol. <i class="fa fa-angle-right"></i> DNS & Nameserver <i class="fa fa-angle-right"></i> DNS-Einträge</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Ansehen</a>
</td>
<td>Anmelden <i class="fa fa-angle-right"></i> (Domain auswählen) <i class="fa fa-angle-right"></i> Verwalten <i class="fa fa-angle-right"></i> (Zahnradsymbol anklicken) <i class="fa fa-angle-right"></i> Im linken Menü auf „DNS & Nameserver“ klicken</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
<td>Anmelden <i class="fa fa-angle-right"></i> Bereich <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Domains verwalten <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
<td>Anmelden <i class="fa fa-angle-right"></i> Übersicht <i class="fa fa-angle-right"></i> <i class="fa fa-angle-right"></i> verwalten <i class="fa fa-angle-right"></i> Einfacher Editor <i class="fa fa-angle-right"></i> Einträge</td>
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
<td>Anmelden <i class="fa fa-angle-right"></i> Domainliste <i class="fa fa-angle-right"></i> (Domain auswählen) <i class="fa fa-angle-right"></i> Erweitertes DNS verwalten <i class="fa fa-angle-right"></i></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
<td>Anmelden <i class="fa fa-angle-right"></i> (Domain auswählen) <i class="fa fa-angle-right"></i> Netlify DNS einrichten</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Lösungen</a></td>
<td>Anmelden <i class="fa fa-angle-right"></i> Account-Manager <i class="fa fa-angle-right"></i> Meine Domains <i class="fa fa-angle-right"></i> (Domain auswählen) <i class="fa fa-angle-right"></i> Verwalten <i class="fa fa-angle-right"></i> Domain-Verweis ändern <i class="fa fa-angle-right"></i> Erweitertes DNS</td>
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
<td>Anmelden <i class="fa fa-angle-right"></i> Startseite <i class="fa fa-angle-right"></i> Einstellungen <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Domain auswählen) <i class="fa fa-angle-right"></i>
Erweiterte Einstellungen <i class="fa fa-angle-right"></i> Benutzerdefinierte Einträge</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
<td>Mithilfe der "now"-CLI <i class="fa fa-angle-right"></i> <code>now dns add [Domain] '@' MX [Record-Value] [Priorität]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
<td>Anmelden <i class="fa fa-angle-right"></i> Domains-Seite <i class="fa fa-angle-right"></i> (Domain auswählen) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
<td>Anmelden <i class="fa fa-angle-right"></i> Domains-Seite <i class="fa fa-angle-right"></i> (Klicken Sie auf das Symbol <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> DNS-Einträge verwalten auswählen</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
<td>Anmelden <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Meine Domains</td>
</tr>
<tr>
<td>Sonstige</td>
<td>
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Wichtig:</strong> Ist Ihr Registrarname hier nicht aufgeführt? Suchen Sie einfach im Internet nach „So ändern Sie DNS-Einträge auf $REGISTRAR“ (ersetzen Sie $REGISTRAR durch den Namen Ihres Registrars – z. B. „So ändern Sie DNS-Einträge bei GoDaddy“, wenn Sie GoDaddy verwenden).</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Legen Sie auf der DNS-Verwaltungsseite Ihres Registrars (dem anderen Tab, den Sie geöffnet haben) die folgenden „MX“-Einträge fest:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wichtig:
</strong>
<span>
Es dürfen keine weiteren MX-Einträge gesetzt sein. Beide unten angezeigten Einträge MÜSSEN vorhanden sein. Achten Sie auf Tippfehler und die korrekte Schreibweise von mx1 und mx2. Sollten bereits MX-Einträge vorhanden sein, löschen Sie diese bitte vollständig.

Der TTL-Wert muss nicht 3600 betragen, er kann bei Bedarf auch niedriger oder höher sein.
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
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx1.forwardemail.net</code></td>
</tr>
<tr>
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx2.forwardemail.net</code></td>
</tr>
</tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Legen Sie auf der DNS-Verwaltungsseite Ihres Registrars (die andere Registerkarte, die Sie geöffnet haben) die folgenden <strong class="notranslate">TXT</strong>-Einträge fest:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wichtig:
</strong>
<span>
Wenn Sie einen kostenpflichtigen Tarif nutzen, überspringen Sie diesen Schritt und fahren Sie mit Schritt 5 fort! Andernfalls sind Ihre weitergeleiteten Adressen öffentlich auffindbar. Gehen Sie dazu zu <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> und rüsten Sie Ihre Domain bei Bedarf auf einen kostenpflichtigen Tarif auf. Weitere Informationen zu kostenpflichtigen Tarifen finden Sie auf unserer Seite <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Preise</a>. Andernfalls können Sie weiterhin eine oder mehrere der unten aufgeführten Kombinationen aus Option A bis Option F wählen.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Option A:
</strong>
<span>
Wenn Sie alle E-Mails Ihrer Domain (z. B. "all@example.com", "hallo@example.com" usw.) an eine bestimmte Adresse wie "user@gmail.com" weiterleiten:
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
<td><em>"@", "." oder leer</em></td>
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
Ersetzen Sie die obigen Werte in der Spalte „Wert“ durch Ihre eigene E-Mail-Adresse. Der TTL-Wert muss nicht 3600 sein, er kann bei Bedarf auch niedriger oder höher sein. Ein niedrigerer Time-to-Live-Wert („TTL“) stellt sicher, dass zukünftige Änderungen an Ihren DNS-Einträgen schneller im Internet verbreitet werden. Dies entspricht der Dauer der Zwischenspeicherung (in Sekunden). Weitere Informationen zur <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL finden Sie auf Wikipedia</a>.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Option B:
</strong>
<span>
Wenn Sie nur eine einzelne E-Mail-Adresse weiterleiten möchten (z. B. <code>hallo@beispiel.com</code> an <code>benutzer@gmail.com</code>; dadurch wird auch "hallo+test@beispiel.com" automatisch an "benutzer+test@gmail.com" weitergeleitet):
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
<td><em>"@", "." oder leer</em></td>
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
Wenn Sie mehrere E-Mails weiterleiten, trennen Sie diese bitte durch Kommas:
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
<td><em>"@", "." oder leer</em></td>
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
Sie können beliebig viele Weiterleitungs-E-Mails einrichten. Achten Sie jedoch darauf, dass die E-Mail-Adresse nicht mehr als 255 Zeichen in einer Zeile enthält und beginnen Sie jede Zeile mit "forward-email=". Ein Beispiel finden Sie unten:
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
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." oder leer</em></td>
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
Sie können in Ihrem <strong class="notranslate">TXT</strong>-Eintrag auch einen Domänennamen angeben, um eine globale Alias-Weiterleitung zu aktivieren (z. B. wird "user@example.com" an "user@example.net" weitergeleitet):
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
<td><em>"@", "." oder leer</em></td>
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
Sie können Webhooks sogar als globalen oder individuellen Alias für die E-Mail-Weiterleitung verwenden. Siehe das Beispiel und den vollständigen Abschnitt zu Webhooks mit dem Titel <a href="#do-you-support-webhooks" class="alert-link">Unterstützen Sie Webhooks?</a> weiter unten.
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
<td><em>"@", "." oder leer</em></td>
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
Sie können sogar reguläre Ausdrücke („regex“) verwenden, um Aliase abzugleichen und Ersetzungen für die E-Mail-Weiterleitung zu verarbeiten. Siehe die Beispiele und den vollständigen Abschnitt zu Regex mit dem Titel <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Unterstützen Sie reguläre Ausdrücke oder Regex?</a> weiter unten.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Benötigen Sie erweiterte Regex-Funktionen mit Ersetzung?</strong> Siehe die Beispiele und den vollständigen Abschnitt zu Regex mit dem Titel <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Unterstützen Sie reguläre Ausdrücke oder Regex?</a> weiter unten.
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Einfaches Beispiel:</strong> Wenn ich alle E-Mails, die an `linus@example.com` oder `torvalds@example.com` gehen, an `user@gmail.com` weiterleiten möchte:
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
<td><em>"@", "." oder leer</em></td>
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
Catch-All-Weiterleitungsregeln werden auch als „Fall-Through“-Regeln bezeichnet.
Das bedeutet, dass eingehende E-Mails, die mindestens einer bestimmten Weiterleitungsregel entsprechen, anstelle der Catch-All-Regel verwendet werden.
Zu den spezifischen Regeln gehören E-Mail-Adressen und reguläre Ausdrücke.
<br /><br />
Beispiel:
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
E-Mails, die an <code>hello@example.com</code> gesendet werden, werden mit dieser Konfiguration **nicht** an <code>second@gmail.com</code> weitergeleitet (Catch-All), sondern nur an <code>first@gmail.com</code> zugestellt.
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Legen Sie auf der DNS-Verwaltungsseite Ihres Registrars (die andere Registerkarte, die Sie geöffnet haben) zusätzlich den folgenden <strong class="notranslate">TXT</strong>-Eintrag fest:

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
<td><em>"@", "." oder leer</em></td>
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
Wenn Sie Gmail (z. B. „Senden als“) oder G Suite verwenden, müssen Sie <code>include:_spf.google.com</code> an den obigen Wert anhängen, zum Beispiel:
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
Beachten Sie den Unterschied zwischen "-all" und "~all". Das "-" bedeutet, dass die SPF-Prüfung fehlschlägt, wenn keine Übereinstimmung vorliegt, und "~" bedeutet, dass die SPF-Prüfung SOFTFAIL ist. Wir empfehlen die Verwendung der Option „-all“, um Domainfälschungen vorzubeugen.
<br /><br />
Möglicherweise müssen Sie auch den SPF-Eintrag des Hosts angeben, von dem Sie E-Mails senden (z. B. Outlook).
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Überprüfen Sie Ihre DNS-Einträge mit unserem Tool „Einträge überprüfen“, das unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domänen</a> <i class="fa fa-angle-right"></i> Setup verfügbar ist.

</li><li class="mb-2 mb-md-3 mb-lg-5">Senden Sie eine Test-E-Mail, um zu bestätigen, dass es funktioniert. Beachten Sie, dass die Verbreitung Ihrer DNS-Einträge einige Zeit dauern kann.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>
</span>
Wenn Sie keine Test-E-Mails erhalten oder eine Test-E-Mail mit dem Hinweis „Vorsicht mit dieser Nachricht“ erhalten, lesen Sie die Antworten unter <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Warum erhalte ich meine Test-E-Mails nicht?</a> bzw. <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Warum werden meine an mich gesendeten Test-E-Mails in Gmail als „verdächtig“ angezeigt?</a>.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Wenn Sie von Gmail aus „E-Mails senden als“ verwenden möchten, müssen Sie <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">dieses Video ansehen</a></strong> oder die Schritte unter <a href="#how-to-send-mail-as-using-gmail">How zum Senden von E-Mails mit Gmail</a> unten befolgen.

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
Optionale Add-ons sind unten aufgeführt. Beachten Sie, dass diese Add-ons völlig optional und möglicherweise nicht erforderlich sind. Wir möchten Ihnen bei Bedarf zumindest zusätzliche Informationen zur Verfügung stellen.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Optionales Add-on:
</strong>
<span>
Wenn Sie die Funktion <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How zum Senden von E-Mails mit Gmail</a> verwenden, können Sie sich auf eine Positivliste setzen lassen. Lesen Sie dazu <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">diese Anleitung von Gmail</a>.
</span>
</div>

### Kann ich mehrere MX-Börsen und Server für erweiterte Weiterleitungen verwenden? {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Ja, aber **in Ihren DNS-Einträgen sollte nur ein MX-Austausch aufgeführt sein**.

Versuchen Sie nicht, „Priorität“ zum Konfigurieren mehrerer MX-Austausche zu verwenden.

Stattdessen müssen Sie Ihren vorhandenen MX-Austausch so konfigurieren, dass E-Mails für alle nicht übereinstimmenden Aliase an die Austausche unseres Dienstes weitergeleitet werden (`mx1.forwardemail.net` und/oder `mx2.forwardemail.net`).

Wenn Sie Google Workspace verwenden und alle nicht übereinstimmenden Aliase an unseren Dienst weiterleiten möchten, lesen Sie <https://support.google.com/a/answer/6297084>.

Wenn Sie Microsoft 365 (Outlook) verwenden und alle nicht übereinstimmenden Aliase an unseren Dienst weiterleiten möchten, lesen Sie <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> und <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Wie richte ich eine Abwesenheitsnotiz (Auto-Responder) ein? {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Gehen Sie zu <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase und erstellen oder bearbeiten Sie den Alias, für den Sie einen Abwesenheits-Autoresponder konfigurieren möchten.

Sie haben die Möglichkeit, ein Startdatum, ein Enddatum, einen Betreff und eine Nachricht zu konfigurieren und diese jederzeit zu aktivieren oder zu deaktivieren:

* Betreff und Nachricht im Klartext werden derzeit unterstützt (wir verwenden intern das Paket `striptags`, um HTML-Code zu entfernen).
* Der Betreff ist auf 100 Zeichen begrenzt.
* Die Nachricht ist auf 1000 Zeichen begrenzt.
* Für die Einrichtung ist eine Konfiguration für ausgehenden SMTP-Verkehr erforderlich (z. B. müssen Sie DKIM-, DMARC- und Return-Path-DNS-Einträge einrichten).
* Gehen Sie zu <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domänen</a> <i class="fa fa-angle-right"></i> Einstellungen <i class="fa fa-angle-right"></i> Konfiguration für ausgehenden SMTP-Verkehr und folgen Sie den Einrichtungsanweisungen.
* Die Abwesenheitsnotiz kann für globale Vanity-Domänennamen nicht aktiviert werden (z. B. werden [Wegwerfadressen](/disposable-addresses) nicht unterstützt).
* Die Abwesenheitsnotiz kann weder für Aliase mit Platzhaltern/Catch-All (`*`) noch für reguläre Ausdrücke aktiviert werden.

Im Gegensatz zu Mailsystemen wie `postfix` (die beispielsweise die Urlaubsfiltererweiterung `sieve` verwenden) fügt Forward Email automatisch Ihre DKIM-Signatur hinzu, schließt Verbindungsprobleme beim Senden von Urlaubsantworten ab (z. B. aufgrund häufiger SSL/TLS-Verbindungsprobleme und veralteter Server) und unterstützt sogar Open WKD- und PGP-Verschlüsselung für Urlaubsantworten.

<!--
* Um Missbrauch zu verhindern, wird für jede gesendete Abwesenheitsnachricht ein SMTP-Guthaben für ausgehende Nachrichten abgezogen.
* Alle kostenpflichtigen Konten beinhalten standardmäßig 300 Guthaben pro Tag. Sollten Sie mehr Guthaben benötigen, kontaktieren Sie uns bitte.
-->

1. Wir senden nur einmal alle 4 Tage pro [auf die Positivliste gesetzt](#do-you-have-an-allowlist)-Absender (was dem Verhalten von Gmail ähnelt).

* Unser Redis-Cache verwendet einen Fingerabdruck von `alias_id` und `sender`, wobei `alias_id` die Alias-MongoDB-ID und `sender` entweder die Absenderadresse (falls auf der Whitelist) oder die Stammdomäne in der Absenderadresse (falls nicht auf der Whitelist) ist. Der Einfachheit halber ist die Gültigkeitsdauer dieses Fingerabdrucks im Cache auf 4 Tage festgelegt.

* Unser Ansatz, die in der Absenderadresse analysierte Stammdomäne für nicht auf der Whitelist stehende Absender zu verwenden, verhindert Missbrauch durch relativ unbekannte Absender (z. B. böswillige Akteure), die Abwesenheitsnotizen mit Nachrichten überfluten.

2. Wir senden nur, wenn MAIL FROM und/oder From nicht leer sind und kein [Postmaster-Benutzername](#what-are-postmaster-addresses) (den Teil vor dem @ in einer E-Mail) enthalten (ohne Berücksichtigung der Groß-/Kleinschreibung).

3. Wir senden nicht, wenn die ursprüngliche Nachricht einen der folgenden Header hatte (ohne Berücksichtigung der Groß- und Kleinschreibung):

* Header von `auto-submitted` mit einem Wert ungleich `no`.
* Header von `x-auto-response-suppress` mit einem Wert von `dr`, `autoreply`, `auto-reply`, `auto_reply` oder `all`
* Header von `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` oder `x-auto-respond` (unabhängig vom Wert).
* Header von `precedence` mit einem Wert von `bulk`, `autoreply`, `auto-reply`, `auto_reply` oder `list`.

4. Wir senden nicht, wenn die E-Mail-Adresse „MAIL FROM“ oder „From“ mit `+donotreply`, `-donotreply`, `+noreply` oder `-noreply` endet.

5. Wir senden nicht, wenn der Benutzernamenteil der Absender-E-Mail-Adresse `mdaemon` lautete und einen Header ohne Berücksichtigung der Groß-/Kleinschreibung von `X-MDDSN-Message` hatte.

6. Wir senden nicht, wenn es einen Groß-/Kleinschreibung nicht berücksichtigenden `content-type`-Header von `multipart/report` gab.

### Wie richte ich SPF für die E-Mail-Weiterleitung ein? {#how-do-i-set-up-spf-for-forward-email}

Legen Sie auf der DNS-Verwaltungsseite Ihres Registrars den folgenden <strong class="notranslate">TXT</strong>-Eintrag fest:

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
<td><em>"@", "." oder leer</em></td>
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
Wenn Sie Gmail (z. B. „Senden als“) oder G Suite verwenden, müssen Sie <code>include:_spf.google.com</code> an den obigen Wert anhängen, zum Beispiel:
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
Wenn Sie Microsoft Outlook oder Live.com verwenden, müssen Sie <code>include:spf.protection.outlook.com</code> an Ihren SPF-<strong class="notranslate">TXT</strong>-Eintrag anhängen, zum Beispiel:
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
Wenn Sie bereits eine ähnliche Zeile mit "v=spf1" haben, müssen Sie <code>include:spf.forwardemail.net</code> direkt vor allen vorhandenen "include:host.com"-Einträgen und vor dem "-all" in derselben Zeile anhängen, zum Beispiel:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Beachten Sie den Unterschied zwischen "-all" und "~all". Das "-" bedeutet, dass die SPF-Prüfung fehlschlägt, wenn keine Übereinstimmung vorliegt, und "~" bedeutet, dass die SPF-Prüfung SOFTFAIL ist. Wir empfehlen die Verwendung der Option „-all“, um Domainfälschungen vorzubeugen.
<br /><br />
Möglicherweise müssen Sie auch den SPF-Eintrag des Hosts angeben, von dem Sie E-Mails senden (z. B. Outlook).
</span>
</div>

### Wie richte ich DKIM für die E-Mail-Weiterleitung ein? {#how-do-i-set-up-dkim-for-forward-email}

Gehen Sie zu <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domänen</a> <i class="fa fa-angle-right"></i> Einstellungen <i class="fa fa-angle-right"></i> Outbound SMTP-Konfiguration und folgen Sie den Einrichtungsanweisungen.

### Wie richte ich DMARC für die E-Mail-Weiterleitung ein? {#how-do-i-set-up-dmarc-for-forward-email}

Gehen Sie zu <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domänen</a> <i class="fa fa-angle-right"></i> Einstellungen <i class="fa fa-angle-right"></i> Outbound SMTP-Konfiguration und folgen Sie den Einrichtungsanweisungen.

### Wie verbinde und konfiguriere ich meine Kontakte {#how-do-i-connect-and-configure-my-contacts}

**Um Ihre Kontakte zu konfigurieren, verwenden Sie die CardDAV-URL von:** `https://carddav.forwardemail.net` (oder einfach `carddav.forwardemail.net`, wenn Ihr Client dies zulässt)

### Wie verbinde und konfiguriere ich meine Kalender {#how-do-i-connect-and-configure-my-calendars}

**Um Ihren Kalender zu konfigurieren, verwenden Sie die CalDAV-URL von:** `https://caldav.forwardemail.net` (oder einfach `caldav.forwardemail.net`, wenn Ihr Client dies zulässt)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="E-Mail-Kalender weiterleiten, CalDAV, Thunderbird, Beispiel-Setup" />

### Wie füge ich weitere Kalender hinzu und verwalte vorhandene Kalender {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Wenn Sie weitere Kalender hinzufügen möchten, fügen Sie einfach die neue Kalender-URL hinzu: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**ersetzen Sie unbedingt `calendar-name` durch den gewünschten Kalendernamen**)

Sie können den Namen und die Farbe eines Kalenders nach der Erstellung ändern – verwenden Sie dazu einfach Ihre bevorzugte Kalenderanwendung (z. B. Apple Mail oder [Thunderbird](https://thunderbird.net)).

### Wie richte ich SRS für die E-Mail-Weiterleitung ein? {#how-do-i-set-up-srs-for-forward-email}

Wir konfigurieren [Sender-Rewriting-Schema](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) („SRS“) automatisch – Sie müssen dies nicht selbst tun.

### Wie richte ich MTA-STS für die Weiterleitung von E-Mails ein? {#how-do-i-set-up-mta-sts-for-forward-email}

Weitere Informationen finden Sie unter [unser Abschnitt über MTA-STS](#do-you-support-mta-sts).

### Wie füge ich meiner E-Mail-Adresse ein Profilbild hinzu? {#how-do-i-add-a-profile-picture-to-my-email-address}

Wenn Sie Gmail verwenden, führen Sie die folgenden Schritte aus:

1. Gehen Sie zu <https://google.com> und melden Sie sich von allen E-Mail-Konten ab.
2. Klicken Sie auf „Anmelden“ und im Dropdown-Menü auf „Anderes Konto“.
3. Wählen Sie „Anderes Konto verwenden“.
4. Wählen Sie „Konto erstellen“.
5. Wählen Sie „Stattdessen meine aktuelle E-Mail-Adresse verwenden“.
6. Geben Sie Ihre benutzerdefinierte Domain-E-Mail-Adresse ein.
7. Rufen Sie die Bestätigungs-E-Mail ab, die an Ihre E-Mail-Adresse gesendet wurde.
8. Geben Sie den Bestätigungscode aus dieser E-Mail ein.
9. Vervollständigen Sie die Profilinformationen für Ihr neues Google-Konto.
10. Stimmen Sie allen Datenschutz- und Nutzungsbedingungen zu.
11. Gehen Sie zu <https://google.com>, klicken Sie oben rechts auf Ihr Profilsymbol und anschließend auf „Ändern“.
12. Laden Sie ein neues Foto oder einen Avatar für Ihr Konto hoch.
13. Die Änderungen werden nach etwa 1–2 Stunden wirksam, können aber manchmal auch sehr schnell erfolgen.
14. Senden Sie eine Test-E-Mail. Das Profilfoto sollte dann angezeigt werden.

## Erweiterte Funktionen {#advanced-features}

### Unterstützen Sie Newsletter oder Mailinglisten für marketingbezogene E-Mails? {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Ja, Sie können mehr unter <https://forwardemail.net/guides/newsletter-with-listmonk>. lesen.

Bitte beachten Sie, dass Forward Email zur Wahrung der IP-Reputation und Gewährleistung der Zustellbarkeit einen manuellen Prüfprozess pro Domain für die **Newsletter-Freigabe** durchführt. Senden Sie eine E-Mail an <support@forwardemail.net> oder öffnen Sie ein [Hilfeanfrage](https://forwardemail.net/help) zur Freigabe. Dies dauert in der Regel weniger als 24 Stunden, wobei die meisten Anfragen innerhalb von 1-2 Stunden bearbeitet werden. In naher Zukunft planen wir, diesen Prozess mit zusätzlichen Spam-Kontrollen und Warnmeldungen sofort zu ermöglichen. Dieser Prozess stellt sicher, dass Ihre E-Mails den Posteingang erreichen und nicht als Spam markiert werden.

### Unterstützen Sie das Senden von E-Mails mit der API {#do-you-support-sending-email-with-api}

Ja, ab Mai 2023 unterstützen wir das Senden von E-Mails mit API als Add-on für alle zahlenden Benutzer.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wichtig:
</strong>
<span>
Bitte lesen Sie unsere <a href="/terms" class="alert-link" target="_blank">Nutzungsbedingungen</a>, <a href="/privacy" class="alert-link" target="_blank">Datenschutzrichtlinie</a> und <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">SMTP-Limits für ausgehenden Datenverkehr</a>. Ihre Nutzung gilt als Kenntnisnahme und Zustimmung.
</span>
</div>

Optionen, Beispiele und weitere Informationen finden Sie in unserem Abschnitt zu [E-Mails](/email-api#outbound-emails) in unserer API-Dokumentation.

Um ausgehende E-Mails mit unserer API zu senden, müssen Sie Ihr unter [Meine Sicherheit](/my-account/security) verfügbares API-Token verwenden.

### Unterstützen Sie den Empfang von E-Mails mit IMAP {#do-you-support-receiving-email-with-imap}

Ja, ab dem 16. Oktober 2023 unterstützen wir den E-Mail-Empfang über IMAP als Add-on für alle zahlenden Nutzer. **Bitte lesen Sie unseren ausführlichen Artikel** auf [So funktioniert unsere Funktion zum verschlüsselten SQLite-Postfachspeicher](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wichtig:
</strong>
<span>
Bitte lesen Sie unsere <a href="/terms" class="alert-link" target="_blank">Nutzungsbedingungen</a> und <a href="/privacy" class="alert-link" target="_blank">Datenschutzrichtlinie</a>. Ihre Nutzung gilt als Kenntnisnahme und Zustimmung.
</span>
</div>

1. Erstellen Sie einen neuen Alias für Ihre Domain unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase (z. B. <code><hello@example.com></code>)

2. Klicken Sie neben dem neu erstellten Alias auf <strong class="text-success"><i class="fa fa-key"></i> Passwort generieren</strong>. Kopieren Sie das auf dem Bildschirm angezeigte generierte Passwort in die Zwischenablage und speichern Sie es sicher.

3. Fügen Sie in Ihrem bevorzugten E-Mail-Programm ein Konto mit Ihrem neu erstellten Alias hinzu oder konfigurieren Sie es (z. B. <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>Wir empfehlen die Verwendung von <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> oder <a href="/blog/open-source" class="alert-link" target="_blank">eine Open-Source-Alternative mit Fokus auf Datenschutz</a>.</span>
</div>

4. Wenn Sie nach dem IMAP-Servernamen gefragt werden, geben Sie `imap.forwardemail.net` ein.

5. Wenn Sie nach dem IMAP-Serverport gefragt werden, geben Sie `993` (SSL/TLS) ein – siehe ggf. [alternative IMAP-Ports](/faq#what-are-your-imap-server-configuration-settings).
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>Wenn Sie Thunderbird verwenden, stellen Sie sicher, dass „Verbindungssicherheit“ auf „SSL/TLS“ und „Authentifizierungsmethode“ auf „Normales Passwort“ eingestellt ist.</span>
</div>

6. Wenn Sie zur Eingabe des IMAP-Serverkennworts aufgefordert werden, fügen Sie das Kennwort aus <strong class="text-success"><i class="fa fa-key"></i> Kennwort generieren</strong> in Schritt 2 oben ein.

7. **Speichern Sie Ihre Einstellungen** – wenn Sie Probleme haben, <a href="/help">kontaktieren Sie uns bitte</a>

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

### Unterstützen Sie POP3? {#do-you-support-pop3}

Ja, ab dem 4. Dezember 2023 unterstützen wir [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) als Add-on für alle zahlenden Nutzer. **Bitte lesen Sie unseren ausführlichen Artikel** zu [So funktioniert unsere Funktion zum verschlüsselten SQLite-Postfachspeicher](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-Anweisungen">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wichtig:
</strong>
<span>
Bitte lesen Sie unsere <a href="/terms" class="alert-link" target="_blank">Nutzungsbedingungen</a> und <a href="/privacy" class="alert-link" target="_blank">Datenschutzrichtlinie</a>. Ihre Nutzung gilt als Kenntnisnahme und Zustimmung.
</span>
</div>

1. Erstellen Sie einen neuen Alias für Ihre Domain unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase (z. B. <code><hello@example.com></code>)

2. Klicken Sie neben dem neu erstellten Alias auf <strong class="text-success"><i class="fa fa-key"></i> Passwort generieren</strong>. Kopieren Sie das auf dem Bildschirm angezeigte generierte Passwort in die Zwischenablage und speichern Sie es sicher.

3. Fügen Sie in Ihrem bevorzugten E-Mail-Programm ein Konto mit Ihrem neu erstellten Alias hinzu oder konfigurieren Sie es (z. B. <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>Wir empfehlen die Verwendung von <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> oder <a href="/blog/open-source" class="alert-link" target="_blank">eine Open-Source-Alternative mit Fokus auf Datenschutz</a>.</span>
</div>

4. Wenn Sie nach dem POP3-Servernamen gefragt werden, geben Sie `pop3.forwardemail.net` ein.

5. Wenn Sie nach dem POP3-Serverport gefragt werden, geben Sie `995` (SSL/TLS) ein – siehe ggf. [alternative POP3-Ports](/faq#what-are-your-pop3-server-configuration-settings).
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>Wenn Sie Thunderbird verwenden, stellen Sie sicher, dass „Verbindungssicherheit“ auf „SSL/TLS“ und „Authentifizierungsmethode“ auf „Normales Passwort“ eingestellt ist.</span>
</div>

6. Wenn Sie zur Eingabe des POP3-Serverkennworts aufgefordert werden, fügen Sie das Kennwort aus <strong class="text-success"><i class="fa fa-key"></i> Kennwort generieren</strong> in Schritt 2 oben ein

7. **Speichern Sie Ihre Einstellungen** – wenn Sie Probleme haben, <a href="/help">kontaktieren Sie uns bitte</a>

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

### Unterstützen Sie Kalender (CalDAV)? {#do-you-support-calendars-caldav}

Ja, seit dem 5. Februar 2024 haben wir diese Funktion hinzugefügt. Unser Server ist `caldav.forwardemail.net` und wird auch auf unserer <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">Statusseite</a> überwacht.

Es unterstützt sowohl IPv4 als auch IPv6 und ist über den Port `443` (HTTPS) verfügbar.

| Login | Beispiel | Beschreibung |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Benutzername | `user@example.com` | E-Mail-Adresse eines Alias, der für die Domäne unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domänen</a> existiert. |
| Passwort | `************************` | Aliasspezifisch generiertes Passwort. |

Um die Kalenderunterstützung zu nutzen, muss der **Benutzer** die E-Mail-Adresse eines Alias sein, der für die Domäne unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domänen</a> existiert – und das **Passwort** muss ein aliasspezifisches generiertes Passwort sein.

### Unterstützen Sie Kontakte (CardDAV) {#do-you-support-contacts-carddav}

Ja, seit dem 12. Juni 2025 haben wir diese Funktion hinzugefügt. Unser Server ist `carddav.forwardemail.net` und wird auch auf unserer <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">Statusseite</a> überwacht.

Es unterstützt sowohl IPv4 als auch IPv6 und ist über den Port `443` (HTTPS) verfügbar.

| Login | Beispiel | Beschreibung |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Benutzername | `user@example.com` | E-Mail-Adresse eines Alias, der für die Domäne unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domänen</a> existiert. |
| Passwort | `************************` | Aliasspezifisch generiertes Passwort. |

Um die Kontaktunterstützung zu nutzen, muss der **Benutzer** die E-Mail-Adresse eines Alias sein, der für die Domäne unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domänen</a> existiert – und das **Passwort** muss ein aliasspezifisches generiertes Passwort sein.

### Unterstützen Sie das Senden von E-Mails mit SMTP {#do-you-support-sending-email-with-smtp}

Ja, ab Mai 2023 unterstützen wir das Senden von E-Mails mit SMTP als Add-on für alle zahlenden Benutzer.

<div id="smtp-Anweisungen">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wichtig:
</strong>
<span>
Bitte lesen Sie unsere <a href="/terms" class="alert-link" target="_blank">Nutzungsbedingungen</a>, <a href="/privacy" class="alert-link" target="_blank">Datenschutzrichtlinie</a> und <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">SMTP-Limits für ausgehenden Datenverkehr</a>. Ihre Nutzung gilt als Zustimmung.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wichtig:
</strong>
<span>
Wenn Sie Gmail verwenden, lesen Sie bitte unseren <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Leitfaden zum Senden von E-Mails mit Gmail</a>. Wenn Sie Entwickler sind, lesen Sie bitte unsere <a class="alert-link" href="/email-api#outbound-emails" target="_blank">E-Mail-API-Dokumente</a>.
</span>
</div>

1. Gehen Sie zu <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domänen</a> <i class="fa fa-angle-right"></i> Einstellungen <i class="fa fa-angle-right"></i> Outbound SMTP-Konfiguration und folgen Sie den Einrichtungsanweisungen

2. Erstellen Sie einen neuen Alias für Ihre Domain unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase (z. B. <code><hello@example.com></code>)

3. Klicken Sie neben dem neu erstellten Alias auf <strong class="text-success"><i class="fa fa-key"></i> Passwort generieren</strong>. Kopieren Sie das auf dem Bildschirm angezeigte generierte Passwort in die Zwischenablage und speichern Sie es sicher.

4. Fügen Sie in Ihrem bevorzugten E-Mail-Programm ein Konto mit Ihrem neu erstellten Alias hinzu oder konfigurieren Sie es (z. B. <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>Wir empfehlen die Verwendung von <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> oder <a href="/blog/open-source" class="alert-link" target="_blank">eine Open-Source-Alternative mit Fokus auf Datenschutz</a>.</span>
</div>

5. Wenn Sie nach dem SMTP-Servernamen gefragt werden, geben Sie `smtp.forwardemail.net` ein.

6. Wenn Sie nach dem SMTP-Serverport gefragt werden, geben Sie `465` (SSL/TLS) ein – siehe ggf. [alternative SMTP-Ports](/faq#what-are-your-smtp-server-configuration-settings).

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>Wenn Sie Thunderbird verwenden, stellen Sie sicher, dass „Verbindungssicherheit“ auf „SSL/TLS“ und „Authentifizierungsmethode“ auf „Normales Passwort“ eingestellt ist.</span>
</div>

7. Wenn Sie zur Eingabe des SMTP-Serverkennworts aufgefordert werden, fügen Sie das Kennwort aus <strong class="text-success"><i class="fa fa-key"></i> Kennwort generieren</strong> in Schritt 3 oben ein

8. **Speichern Sie Ihre Einstellungen und senden Sie Ihre erste Test-E-Mail** – wenn Sie Probleme haben, <a href="/help">kontaktieren Sie uns bitte</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wichtig:
</strong>
<span>
Bitte beachten Sie: Um die IP-Reputation zu wahren und die Zustellbarkeit zu gewährleisten, führen wir für ausgehende SMTP-Nachrichten einen manuellen Überprüfungsprozess pro Domain durch. Dieser dauert in der Regel weniger als 24 Stunden, wobei die meisten Anfragen innerhalb von 1–2 Stunden bearbeitet werden. In naher Zukunft möchten wir diesen Prozess mit zusätzlichen Spam-Kontrollen und Warnmeldungen sofort abwickeln. So stellen wir sicher, dass Ihre E-Mails Ihren Posteingang erreichen und nicht als Spam markiert werden.
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

### Unterstützen Sie OpenPGP/MIME, End-to-End-Verschlüsselung („E2EE“) und Web Key Directory („WKD“)? {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Ja, wir unterstützen [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [Ende-zu-Ende-Verschlüsselung („E2EE“)](https://en.wikipedia.org/wiki/End-to-end_encryption) und die Ermittlung öffentlicher Schlüssel mit [Webschlüsselverzeichnis („WKD“)](https://wiki.gnupg.org/WKD). Sie können OpenPGP mit [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) oder [Hosten Sie Ihre eigenen Schlüssel selbst](https://wiki.gnupg.org/WKDHosting) konfigurieren (siehe [dieser Kern für die Einrichtung des WKD-Servers](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* WKD-Lookups werden 1 Stunde lang zwischengespeichert, um eine pünktliche E-Mail-Zustellung zu gewährleisten. → Wenn Sie Ihren WKD-Schlüssel hinzufügen, ändern oder entfernen, senden Sie uns bitte eine E-Mail mit Ihrer E-Mail-Adresse an `support@forwardemail.net`, damit wir den Cache manuell leeren können.
* Wir unterstützen PGP-Verschlüsselung für Nachrichten, die per WKD-Lookup oder mit einem hochgeladenen PGP-Schlüssel über unsere Schnittstelle weitergeleitet werden.
* Hochgeladene Schlüssel haben Vorrang, solange das PGP-Kontrollkästchen aktiviert ist.
* An Webhooks gesendete Nachrichten werden derzeit nicht mit PGP verschlüsselt.
* Wenn Sie mehrere Aliase haben, die zu einer bestimmten Weiterleitungsadresse passen (z. B. Regex/Wildcard/genaue Kombination) und mehr als einer davon einen hochgeladenen PGP-Schlüssel enthält und PGP aktiviert ist, → senden wir Ihnen eine Fehlermeldung per E-Mail und verschlüsseln die Nachricht nicht mit Ihrem hochgeladenen PGP-Schlüssel. Dies kommt sehr selten vor und betrifft in der Regel nur fortgeschrittene Benutzer mit komplexen Alias-Regeln.
* **PGP-Verschlüsselung wird nicht auf E-Mail-Weiterleitungen über unsere MX-Server angewendet, wenn der Absender eine DMARC-Ablehnungsrichtlinie hatte. Wenn Sie PGP-Verschlüsselung für *alle* E-Mails benötigen, empfehlen wir Ihnen, unseren IMAP-Dienst zu nutzen und Ihren PGP-Schlüssel für Ihren Alias für eingehende E-Mails zu konfigurieren.**

**Sie können Ihr Web Key Directory-Setup unter <https://wkd.chimbosonic.com/> (Open Source) oder <https://www.webkeydirectory.com/> (proprietär) validieren.**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Automatische Verschlüsselung:
</strong>
<span>Wenn Sie unseren <a href="#do-you-support-sending-email-with-smtp" class="alert-link">SMTP-Dienst für ausgehende Nachrichten</a> nutzen und unverschlüsselte Nachrichten senden, versuchen wir automatisch, die Nachrichten pro Empfänger mit dem <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Schlüsselverzeichnis ("WKD")</a> zu verschlüsseln.</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wichtig:
</strong>
<span>
Um OpenPGP für Ihren benutzerdefinierten Domänennamen zu aktivieren, müssen Sie alle folgenden Schritte ausführen.
</span>
</div>

1. Laden Sie das unten empfohlene Plug-In für Ihren E-Mail-Client herunter und installieren Sie es:

| E-Mail-Client | Plattform | Empfohlenes Plugin | Hinweise |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thunderbird | Desktop | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird verfügt über integrierte Unterstützung für OpenPGP. |
| Google Mail | Browser | [Mailvelope](https://mailvelope.com/) oder [FlowCrypt](https://flowcrypt.com/download) (proprietäre Lizenz) | Gmail unterstützt OpenPGP nicht, Sie können jedoch das Open-Source-Plugin [Mailvelope](https://mailvelope.com/) oder [FlowCrypt](https://flowcrypt.com/download) herunterladen. |
| Apple Mail | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail unterstützt OpenPGP nicht, Sie können jedoch das Open-Source-Plugin [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) herunterladen. |
| Apple Mail | iOS | [PGPro](https://github.com/opensourceios/PGPro/) oder [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (proprietäre Lizenz) | Apple Mail unterstützt OpenPGP nicht, Sie können jedoch das Open-Source-Plugin [PGPro](https://github.com/opensourceios/PGPro/) oder [FlowCrypt](https://flowcrypt.com/download) herunterladen. |
| Ausblick | Windows | [gpg4win](https://www.gpg4win.de/index.html) | Der Desktop-Mail-Client von Outlook unterstützt OpenPGP nicht, Sie können jedoch das Open-Source-Plugin [gpg4win](https://www.gpg4win.de/index.html) herunterladen. |
| Ausblick | Browser | [Mailvelope](https://mailvelope.com/) oder [FlowCrypt](https://flowcrypt.com/download) (proprietäre Lizenz) | Der webbasierte E-Mail-Client von Outlook unterstützt OpenPGP nicht, Sie können jedoch das Open-Source-Plugin [Mailvelope](https://mailvelope.com/) oder [FlowCrypt](https://flowcrypt.com/download) herunterladen. |
| Android | Mobile | [OpenKeychain](https://www.openkeychain.org/) oder [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | [Android mail clients](/blog/open-source/android-email-clients) sowie [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) und [FairEmail](https://github.com/M66B/FairEmail) unterstützen beide das Open-Source-Plugin [OpenKeychain](https://www.openkeychain.org/). Alternativ können Sie das Open-Source-Plugin (proprietäre Lizenz) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) verwenden. |
| Google Chrome | Browser | [Mailvelope](https://mailvelope.com/) oder [FlowCrypt](https://flowcrypt.com/download) (proprietäre Lizenz) | Sie können die Open-Source-Browsererweiterung [Mailvelope](https://mailvelope.com/) oder [FlowCrypt](https://flowcrypt.com/download) herunterladen. |
| Mozilla Firefox | Browser | [Mailvelope](https://mailvelope.com/) oder [FlowCrypt](https://flowcrypt.com/download) (proprietäre Lizenz) | Sie können die Open-Source-Browsererweiterung [Mailvelope](https://mailvelope.com/) oder [FlowCrypt](https://flowcrypt.com/download) herunterladen. |
| Microsoft Edge | Browser | [Mailvelope](https://mailvelope.com/) | Sie können die Open-Source-Browsererweiterung [Mailvelope](https://mailvelope.com/) herunterladen. |
| Mutig | Browser | [Mailvelope](https://mailvelope.com/) oder [FlowCrypt](https://flowcrypt.com/download) (proprietäre Lizenz) | Sie können die Open-Source-Browsererweiterung [Mailvelope](https://mailvelope.com/) oder [FlowCrypt](https://flowcrypt.com/download) herunterladen. |
| Balsa | Desktop | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | Balsa verfügt über integrierte Unterstützung für OpenPGP. |
| KMail | Desktop | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | KMail verfügt über integrierte Unterstützung für OpenPGP. |
| GNOME-Entwicklung | Desktop | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | GNOME Evolution verfügt über integrierte Unterstützung für OpenPGP. |
| Terminal | Desktop | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | Sie können den Open-Source-Schlüssel [gpg command line tool](https://www.gnupg.org/download/) verwenden, um über die Befehlszeile einen neuen Schlüssel zu generieren. |

2. Öffnen Sie das Plugin, erstellen Sie Ihren öffentlichen Schlüssel und konfigurieren Sie Ihren E-Mail-Client für die Verwendung.

3. Laden Sie Ihren öffentlichen Schlüssel unter <https://keys.openpgp.org/upload>. hoch

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>Sie können Ihren Schlüssel zukünftig unter <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> verwalten.</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Optionales Add-on:
</strong>
<span>
Wenn Sie unseren <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">verschlüsselten Speicherdienst (IMAP/POP3)</a> nutzen und <i>alle</i> in Ihrer (bereits verschlüsselten) SQLite-Datenbank gespeicherten E-Mails mit Ihrem öffentlichen Schlüssel verschlüsseln möchten, gehen Sie zu <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domänen</a> <i class="fa fa-angle-right"></i> Aliase (z. B. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Bearbeiten Sie <i class="fa fa-angle-right"></i> OpenPGP und laden Sie Ihren öffentlichen Schlüssel hoch.
</span>
</div>

4. Fügen Sie Ihrem Domänennamen einen neuen `CNAME`-Eintrag hinzu (z. B. `example.com`):

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
<span>Wenn Ihr Alias unsere <a class="alert-link" href="/disposable-addresses" target="_blank">Vanity-/Disposable-Domains</a> verwendet (z. B. <code>hideaddress.net</code>), können Sie diesen Schritt überspringen.</span>
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

### Unterstützen Sie MTA-STS? {#do-you-support-mta-sts}

Ja, seit dem 2. März 2023 unterstützen wir [MTA-STS](https://www.hardenize.com/blog/mta-sts). Sie können [diese Vorlage](https://github.com/jpawlowski/mta-sts.template) verwenden, wenn Sie es in Ihrer Domain aktivieren möchten.

Unsere Konfiguration ist öffentlich auf GitHub unter <https://github.com/forwardemail/mta-sts.forwardemail.net>. zu finden.

### Unterstützen Sie Passkeys und WebAuthn? {#do-you-support-passkeys-and-webauthn}

Ja! Seit dem 13. Dezember 2023 unterstützen wir Passkeys [aufgrund der hohen Nachfrage](https://github.com/orgs/forwardemail/discussions/182).

Mit Passkeys können Sie sich sicher anmelden, ohne dass ein Kennwort und eine Zwei-Faktor-Authentifizierung erforderlich sind.

Sie können Ihre Identität per Berührung, Gesichtserkennung, gerätebasiertem Passwort oder PIN bestätigen.

Wir ermöglichen Ihnen die gleichzeitige Verwaltung von bis zu 30 Passkeys, sodass Sie sich problemlos mit all Ihren Geräten anmelden können.

Weitere Informationen zu Passkeys finden Sie unter den folgenden Links:

* [Melden Sie sich mit Passkeys bei Ihren Anwendungen und Websites an](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Verwenden Sie Passkeys, um sich bei Apps und Websites auf dem iPhone anzumelden](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Wikipedia-Artikel zu Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### Unterstützen Sie bewährte Methoden für E-Mails? {#do-you-support-email-best-practices}

Ja. Wir bieten integrierte Unterstützung für SPF, DKIM, DMARC, ARC und SRS in allen Tarifen. Wir haben außerdem intensiv mit den ursprünglichen Autoren dieser Spezifikationen und anderen E-Mail-Experten zusammengearbeitet, um Perfektion und hohe Zustellbarkeit zu gewährleisten.

### Unterstützen Sie Bounce-Webhooks? {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
Suchen Sie Dokumentation zu E-Mail-Webhooks? Weitere Informationen finden Sie unter <a href="/faq#do-you-support-webhooks" class="alert-link">Unterstützen Sie Webhooks?</a>.
<span>
</span>
</div>

Ja, seit dem 14. August 2024 ist diese Funktion verfügbar. Gehen Sie nun zu „Mein Konto“ → „Domains“ → „Einstellungen“ → „Bounce-Webhook-URL“ und konfigurieren Sie eine `http://`- oder `https://`-URL, an die wir eine `POST`-Anfrage senden, wenn ausgehende SMTP-E-Mails zurückgewiesen werden.

Dies ist für Sie nützlich, um Ihr ausgehendes SMTP zu verwalten und zu überwachen – und kann verwendet werden, um Abonnenten zu verwalten, sich abzumelden und zu erkennen, wann Bounces auftreten.

Bounce-Webhook-Nutzdaten werden als JSON mit diesen Eigenschaften gesendet:

* `email_id` (String) – E-Mail-ID einer E-Mail unter „Mein Konto“ → „E-Mails (ausgehendes SMTP)“
* `list_id` (String) – der Header-Wert `List-ID` (ohne Berücksichtigung der Groß- und Kleinschreibung), falls vorhanden, aus der ursprünglichen ausgehenden E-Mail
* `list_unsubscribe` (String) – der Header-Wert `List-Unsubscribe` (ohne Berücksichtigung der Groß- und Kleinschreibung), falls vorhanden, aus der ursprünglichen ausgehenden E-Mail
* `feedback_id` (String) – der Header-Wert `Feedback-ID` (ohne Berücksichtigung der Groß- und Kleinschreibung), falls vorhanden, aus der ursprünglichen ausgehenden E-Mail
* `recipient` (String) – die E-Mail-Adresse des Empfängers, der die Nachricht zurückgewiesen hat oder Fehlerhaft
* `message` (String) – eine detaillierte Fehlermeldung zum Bounce
* `response` (String) – die SMTP-Antwortnachricht
* `response_code` (Zahl) – der analysierte SMTP-Antwortcode
* `truth_source` (String) – Stammt der Antwortcode aus einer vertrauenswürdigen Quelle, wird dieser Wert mit dem Stammdomänennamen gefüllt (z. B. `google.com` oder `yahoo.com`)
* `bounce` (Objekt) – ein Objekt mit den folgenden Eigenschaften, die den Bounce- und Ablehnungsstatus detailliert beschreiben:
* `action` (String) – Bounce-Aktion (z. B. `"reject"`)
* `message` (String) – Bounce-Grund (z. B. `"Message Sender Blocked By Receiving Server"`)
* `category` (String) – Bounce-Kategorie (z. B. `"block"`)
* `code` (Nummer) – Bounce-Statuscode (z. B. `554`)
* `status` (String) – Bounce-Code aus der Antwortnachricht (z. B. `5.7.1`)
* `line` (Nummer) – Geparste Zeilennummer, falls vorhanden [aus der Zone-MTA-Bounce-Analyseliste](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (z. B. `526`)
* `headers` (Objekt) – Schlüssel-Wert-Paar der Header der ausgehenden E-Mail
* `bounced_at` (String) – [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) formatiertes Datum, an dem der Bounce-Fehler aufgetreten ist

Zum Beispiel:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "The email account that you tried to reach is over quota.",
  "response": "552 5.2.2 The email account that you tried to reach is over quota.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Gmail Mailbox is full",
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

* Enthält die Webhook-Nutzlast einen Wert vom Typ `list_id`, `list_unsubscribe` oder `feedback_id`, sollten Sie gegebenenfalls geeignete Maßnahmen ergreifen, um den Wert `recipient` aus der Liste zu entfernen.
* Entsprach der Wert `bounce.category` einem Wert vom Typ `"block"`, `"recipient"`, `"spam"` oder `"virus"`, sollten Sie den Benutzer unbedingt aus der Liste entfernen.
* Wenn Sie Webhook-Nutzdaten überprüfen müssen (um sicherzustellen, dass sie tatsächlich von unserem Server stammen), können Sie [Lösen Sie die Remote-Client-IP-Adresse Client-Hostname mithilfe einer umgekehrten Suche](https://nodejs.org/api/dns.html#dnspromisesreverseip) verwenden – es sollte `smtp.forwardemail.net` lauten.
* Sie können die IP-Adresse auch mit [unsere veröffentlichten IP-Adressen](#what-are-your-servers-ip-addresses) vergleichen.
* Gehen Sie zu „Mein Konto“ → „Domains“ → „Einstellungen“ → „Webhook-Signatur-Nutzdaten-Verifizierungsschlüssel“, um Ihren Webhook-Schlüssel abzurufen.
* Sie können diesen Schlüssel aus Sicherheitsgründen jederzeit rotieren.
* Berechnen und vergleichen Sie den `X-Webhook-Signature`-Wert aus unserer Webhook-Anfrage mit dem berechneten Body-Wert mithilfe dieses Schlüssels. Ein Beispiel hierfür finden Sie unter [dieser Stack Overflow-Beitrag](https://stackoverflow.com/a/68885281).
* Weitere Informationen finden Sie in der Diskussion unter <https://github.com/forwardemail/free-email-forwarding/issues/235>.
* Wir warten bis zu `5` Sekunden, bis Ihr Webhook-Endpunkt mit dem Statuscode `200` antwortet, und versuchen es bis zu `1` Mal erneut.
* Sollten wir beim Senden einer Anfrage einen Fehler in Ihrer Bounce-Webhook-URL feststellen, senden wir Ihnen einmal pro Woche eine kostenlose E-Mail.

### Unterstützen Sie Webhooks? {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
Suchen Sie Dokumentation zu Bounce-Webhooks? Weitere Informationen finden Sie unter <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Unterstützen Sie Bounce-Webhooks?</a>.
<span>
</span>
</div>

Ja, seit dem 15. Mai 2020 ist diese Funktion verfügbar. Sie können Webhooks ganz einfach wie bei jedem anderen Empfänger hinzufügen! Bitte stellen Sie sicher, dass die URL des Webhooks das Protokoll „http“ oder „https“ enthält.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Erweiterter Datenschutz:
</strong>
<span>
Wenn Sie einen kostenpflichtigen Tarif (mit erweitertem Datenschutz) nutzen, gehen Sie bitte zu <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> und klicken Sie neben Ihrer Domain auf „Aliase“, um Ihre Webhooks zu konfigurieren. Weitere Informationen zu kostenpflichtigen Tarifen finden Sie auf unserer Seite <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Preise</a>. Andernfalls folgen Sie den unten stehenden Anweisungen.
</span>
</div>

Wenn Sie den kostenlosen Tarif nutzen, fügen Sie einfach einen neuen DNS-<strong class="notranslate">TXT</strong>-Eintrag hinzu, wie unten gezeigt:

Wenn ich beispielsweise möchte, dass alle E-Mails, die an `alias@example.com` gehen, an einen neuen Testendpunkt [Anfragebehälter](https://requestbin.com/r/en8pfhdgcculn?inspect) weitergeleitet werden:

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
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

Oder Sie möchten vielleicht, dass alle E-Mails, die an `example.com` gehen, an diesen Endpunkt weitergeleitet werden:

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
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

**Hier sind zusätzliche Hinweise zu Webhooks:**

* Wenn Sie Webhook-Nutzdaten überprüfen müssen (um sicherzustellen, dass sie tatsächlich von unserem Server stammen), können Sie [Lösen Sie die Remote-Client-IP-Adresse Client-Hostname mithilfe einer umgekehrten Suche](https://nodejs.org/api/dns.html#dnspromisesreverseip) verwenden – es sollte entweder `mx1.forwardemail.net` oder `mx2.forwardemail.net` sein.
* Sie können die IP-Adresse auch mit [unsere veröffentlichten IP-Adressen](#what-are-your-servers-ip-addresses) vergleichen.
* Wenn Sie einen kostenpflichtigen Tarif nutzen, rufen Sie Ihren Webhook-Schlüssel unter „Mein Konto“ → „Domains“ → „Einstellungen“ → „Webhook-Signatur-Nutzdaten-Verifizierungsschlüssel“ auf.
* Sie können diesen Schlüssel aus Sicherheitsgründen jederzeit rotieren.
* Berechnen und vergleichen Sie den `X-Webhook-Signature`-Wert aus unserer Webhook-Anfrage mit dem berechneten Body-Wert mithilfe dieses Schlüssels. Ein Beispiel hierfür finden Sie unter [dieser Stack Overflow-Beitrag](https://stackoverflow.com/a/68885281).
* Weitere Informationen finden Sie in der Diskussion unter <https://github.com/forwardemail/free-email-forwarding/issues/235>.
* Wenn ein Webhook nicht mit dem Statuscode `200` antwortet, speichern wir seine Antwort im Statuscode [Fehlerprotokoll erstellt](#do-you-store-error-logs) – hilfreich für die Fehlersuche.
* HTTP-Anfragen des Webhooks werden bei jedem SMTP-Verbindungsversuch bis zu dreimal wiederholt, mit einem maximalen Timeout von 60 Sekunden pro Endpunkt-POST-Anfrage. **Das bedeutet nicht, dass nur dreimal wiederholt wird**, sondern dass der Versuch kontinuierlich fortgesetzt wird, indem nach dem dritten fehlgeschlagenen HTTP-POST-Anfrageversuch der SMTP-Code 421 gesendet wird (der dem Absender anzeigt, dass er es später erneut versuchen soll). Das bedeutet, dass die E-Mail tagelang wiederholt wird, bis der Statuscode 200 erreicht wird.
* Wir wiederholen den Versuch automatisch basierend auf den in [Wiederholungsmethode des Superagenten](https://ladjs.github.io/superagent/#retrying-requests) verwendeten Standardstatus- und Fehlercodes (wir sind für die Wartung zuständig).
* Wir fassen Webhook-HTTP-Anfragen an denselben Endpunkt in einer einzigen Anfrage zusammen (anstatt mehrere), um Ressourcen zu sparen und die Antwortzeit zu verkürzen. Wenn Sie beispielsweise eine E-Mail an <webhook1@example.com>, <webhook2@example.com> und <webhook3@example.com> senden und alle diese so konfiguriert sind, dass sie dieselbe *exakte* Endpunkt-URL ansprechen, wird nur eine Anfrage gestellt. Wir gruppieren nach exakter Endpunktübereinstimmung unter strikter Gleichheit.
* Beachten Sie, dass wir die Methode „simpleParser“ der Bibliothek [Mailparser](https://nodemailer.com/extras/mailparser/) verwenden, um die Nachricht in ein JSON-fähiges Objekt zu analysieren.
* Der Rohwert der E-Mail als String wird als Eigenschaft „raw“ angegeben.
* Authentifizierungsergebnisse werden als Eigenschaften „dkim“, „spf“, „arc“, „dmarc“ und „bimi“ angegeben.
* Die analysierten E-Mail-Header werden als Eigenschaft „headers“ angegeben. Beachten Sie jedoch, dass Sie „headerLines“ für eine einfachere Iteration und Analyse verwenden können.
* Die gruppierten Empfänger für diesen Webhook werden gruppiert und als Eigenschaft „recipients“ angegeben.
* Die SMTP-Sitzungsinformationen werden als Eigenschaft „session“ angegeben. Diese enthalten Informationen über den Absender der Nachricht, deren Ankunftszeit, HELO und den Client-Hostnamen. Der Client-Hostname als `session.clientHostname` ist entweder der FQDN (aus einer umgekehrten PTR-Suche) oder `session.remoteAddress` in Klammern (z. B. `"[127.0.0.1]"`).
* Wenn Sie den Wert von `X-Original-To` schnell ermitteln möchten, können Sie den Wert von `session.recipient` verwenden (siehe Beispiel unten). Der Header `X-Original-To` wird Nachrichten zur Fehlerbehebung mit dem ursprünglichen Empfänger (vor der maskierten Weiterleitung) hinzugefügt.
* Wenn Sie die Eigenschaften `attachments` und/oder `raw` aus dem Payload-Text entfernen möchten, fügen Sie Ihrem Webhook-Endpunkt einfach `?attachments=false`, `?raw=false` oder `?attachments=false&raw=false` als Querystring-Parameter hinzu (z. B. `https://example.com/webhook?attachments=false&raw=false`).
* Falls Anhänge vorhanden sind, werden diese mit Pufferwerten an das Array `attachments` angehängt. Sie können sie mithilfe eines JavaScript-Ansatzes wie dem folgenden wieder in Inhalte zerlegen:

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
Tipp:
</strong>
Sie möchten wissen, wie die Webhook-Anfrage aus weitergeleiteten E-Mails aussieht? Unten finden Sie ein Beispiel!
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

Ja, seit dem 27. September 2021 haben wir diese Funktion hinzugefügt. Sie können einfach reguläre Ausdrücke („regex“) schreiben, um Aliase abzugleichen und Ersetzungen vorzunehmen.

Aliase mit regulären Ausdrücken beginnen mit `/` und enden mit `/`. Ihre Empfänger sind E-Mail-Adressen oder Webhooks. Die Empfänger können auch Regex-Ersetzungen unterstützen (z. B. `$1`, `$2`).

Wir unterstützen zwei reguläre Ausdrucksflags: `i` und `g`. Das Groß-/Kleinschreibungs-unabhängige Flag `i` ist ein permanenter Standard und wird immer erzwungen. Das globale Flag `g` können Sie hinzufügen, indem Sie die Endung `/` mit `/g` ergänzen.

Beachten Sie, dass wir mit unserer Regex-Unterstützung auch unsere <a href="#can-i-disable-specific-aliases">disabled-Alias-Funktion</a> für den Empfängerteil unterstützen.

Reguläre Ausdrücke werden auf <a href="/disposable-addresses" target="_blank">globalen Vanity-Domains</a> nicht unterstützt (da dies eine Sicherheitslücke darstellen könnte).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Erweiterter Datenschutz:
</strong>
<span>
Wenn Sie einen kostenpflichtigen Tarif (mit erweitertem Datenschutz) nutzen, gehen Sie bitte zu <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> und klicken Sie neben Ihrer Domain auf „Aliase“, um reguläre Ausdrücke zu konfigurieren. Weitere Informationen zu kostenpflichtigen Tarifen finden Sie auf unserer Seite <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Preise</a>. Andernfalls folgen Sie den unten stehenden Anweisungen.
</span>
</div>

Wenn Sie den kostenlosen Tarif nutzen, fügen Sie einfach einen neuen DNS-<strong class="notranslate">TXT</strong>-Eintrag hinzu und verwenden Sie dabei eines oder mehrere der unten angegebenen Beispiele:

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Einfaches Beispiel:</strong> Wenn ich alle E-Mails, die an `linus@example.com` oder `torvalds@example.com` gehen, an `user@gmail.com` weiterleiten möchte:
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
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Beispiel für die Ersetzung von Vorname und Nachname:</strong> Stellen Sie sich vor, alle Ihre Firmen-E-Mail-Adressen haben das Muster `firstname.lastname@example.com`. Wenn ich möchte, dass alle E-Mails mit dem Muster `firstname.lastname@example.com` mit Ersetzungsunterstützung an `firstname.lastname@company.com` weitergeleitet werden (<a href="https://regexr.com/66hnu" class="alert-link">Test auf RegExr ansehen</a>):
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
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Beispiel für die Substitution von Plus-Symbolfiltern:</strong> Wenn ich alle E-Mails, die an `info@example.com` oder `support@example.com` gehen, an `user+info@gmail.com` bzw. `user+support@gmail.com` weiterleiten möchte (mit Substitutionsunterstützung) (<a href="https://regexr.com/66ho7" class="alert-link">Test auf RegExr anzeigen</a>):
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
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Beispiel für die Ersetzung von Webhook-Abfragezeichenfolgen:</strong> Sie möchten beispielsweise, dass alle E-Mails, die an `example.com` gehen, an einen <a href="#do-you-support-webhooks" class="alert-link">Webhook</a> weitergeleitet werden und den dynamischen Abfragezeichenfolgenschlüssel „to“ mit dem Benutzernamen der E-Mail-Adresse als Wert verwenden (<a href="https://regexr.com/66ho4" class="alert-link">Test auf RegExr anzeigen</a>):
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
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Beispiel für stille Ablehnung:</strong> Wenn Sie alle E-Mails, die einem bestimmten Muster entsprechen, deaktivieren und stillschweigend ablehnen möchten (für den Absender sieht es so aus, als wäre die Nachricht erfolgreich gesendet worden, geht aber in Wirklichkeit nirgendwo hin) und den Statuscode `250` verwenden möchten (siehe <a href="#can-i-disable-specific-aliases" class="alert-link">Kann ich bestimmte Aliase deaktivieren?</a>), verwenden Sie einfach denselben Ansatz mit einem einzelnen Ausrufezeichen „!“. Dies zeigt dem Absender an, dass die Nachricht erfolgreich zugestellt wurde, aber in Wirklichkeit nirgendwohin gelangt ist (z. B. Blackhole oder `/dev/null`).
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
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Beispiel für eine Soft-Reject-Funktion:</strong> Wenn Sie alle E-Mails, die einem bestimmten Muster entsprechen, deaktivieren und mit dem Statuscode `421` (siehe <a href="#can-i-disable-specific-aliases" class="alert-link">Kann ich bestimmte Aliase deaktivieren?</a>) soft ablehnen möchten, verwenden Sie einfach denselben Ansatz mit einem doppelten Ausrufezeichen „!!“. Dies weist den Absender an, seine E-Mail erneut zu senden. E-Mails an diesen Alias werden etwa fünf Tage lang erneut versucht und dann dauerhaft abgelehnt.
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
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Beispiel für eine endgültige Ablehnung:</strong> Wenn Sie alle E-Mails, die einem bestimmten Muster entsprechen, deaktivieren und mit dem Statuscode `550` endgültig ablehnen möchten (siehe <a href="#can-i-disable-specific-aliases" class="alert-link">Kann ich bestimmte Aliase deaktivieren?</a>), verwenden Sie einfach denselben Ansatz mit einem dreifachen Ausrufezeichen „!!!“. Dies signalisiert dem Absender einen permanenten Fehler und E-Mails werden nicht erneut gesendet, sondern für diesen Alias abgelehnt.
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
<td><em>"@", "." oder leer</em></td>
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
Wissen Sie, wie man einen regulären Ausdruck schreibt, oder möchten Sie Ihren Ersatz testen? Besuchen Sie die kostenlose Website zum Testen regulärer Ausdrücke <a href="https://regexr.com" class="alert-link">RegExr</a> unter <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
<span>
</span>
</div>

### Was sind Ihre ausgehenden SMTP-Limits? {#what-are-your-outbound-smtp-limits}

Wir begrenzen die Anzahl ausgehender SMTP-Nachrichten pro Tag auf 300 Benutzer und Domänen. Das entspricht durchschnittlich über 9000 E-Mails pro Kalendermonat. Sollten Sie diese Anzahl überschreiten oder dauerhaft große E-Mails versenden, kontaktieren Sie uns bitte unter [Kontaktieren Sie uns](https://forwardemail.net/help).

### Benötige ich eine Genehmigung, um SMTP zu aktivieren? {#do-i-need-approval-to-enable-smtp}

Ja, bitte beachten Sie: Um die IP-Reputation zu wahren und die Zustellbarkeit zu gewährleisten, führt Forward Email einen manuellen Überprüfungsprozess pro Domain für die Freigabe ausgehender SMTP-Nachrichten durch. Senden Sie eine E-Mail an <support@forwardemail.net> oder öffnen Sie ein [Hilfeanfrage](https://forwardemail.net/help) zur Genehmigung. Dies dauert in der Regel weniger als 24 Stunden, wobei die meisten Anfragen innerhalb von 1-2 Stunden bearbeitet werden. In naher Zukunft planen wir, diesen Prozess mit zusätzlichen Spam-Kontrollen und Warnmeldungen sofort zu ermöglichen. Dieser Prozess stellt sicher, dass Ihre E-Mails den Posteingang erreichen und nicht als Spam markiert werden.

### Wie lauten Ihre SMTP-Server-Konfigurationseinstellungen {#what-are-your-smtp-server-configuration-settings}

Unser Server ist `smtp.forwardemail.net` und wird auch auf unserer <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">Statusseite</a> überwacht.

Es unterstützt sowohl IPv4 als auch IPv6 und ist über die Ports `465` und `2465` für SSL/TLS und `587`, `2587`, `2525` und `25` für TLS (STARTTLS) verfügbar.

| Protokoll | Hostname | Häfen | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **Bevorzugt** | `smtp.forwardemail.net` | `465`, `2465` | :weißes Häkchen: | :weißes Häkchen: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :weißes Häkchen: | :weißes Häkchen: |

| Login | Beispiel | Beschreibung |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Benutzername | `user@example.com` | E-Mail-Adresse eines Alias, der für die Domäne unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domänen</a> existiert. |
| Passwort | `************************` | Aliasspezifisch generiertes Passwort. |

Um ausgehende E-Mails mit SMTP zu senden, muss der **SMTP-Benutzer** die E-Mail-Adresse eines Alias sein, der für die Domäne unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domänen</a> existiert – und das **SMTP-Passwort** muss ein aliasspezifisches generiertes Passwort sein.

Eine Schritt-für-Schritt-Anleitung finden Sie unter [Unterstützen Sie das Senden von E-Mails mit SMTP](#do-you-support-sending-email-with-smtp).

### Wie lauten Ihre IMAP-Serverkonfigurationseinstellungen? {#what-are-your-imap-server-configuration-settings}

Unser Server ist `imap.forwardemail.net` und wird auch auf unserer <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">Statusseite</a> überwacht.

Es unterstützt sowohl IPv4 als auch IPv6 und ist über die Ports `993` und `2993` für SSL/TLS verfügbar.

| Protokoll | Hostname | Häfen | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Bevorzugt** | `imap.forwardemail.net` | `993`, `2993` | :weißes Häkchen: | :weißes Häkchen: |

| Login | Beispiel | Beschreibung |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Benutzername | `user@example.com` | E-Mail-Adresse eines Alias, der für die Domäne unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domänen</a> existiert. |
| Passwort | `************************` | Aliasspezifisch generiertes Passwort. |

Um eine Verbindung mit IMAP herzustellen, muss der **IMAP-Benutzer** die E-Mail-Adresse eines Alias sein, der für die Domäne unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domänen</a> existiert – und das **IMAP-Passwort** muss ein aliasspezifisches generiertes Passwort sein.

Eine Schritt-für-Schritt-Anleitung finden Sie unter [Unterstützen Sie den Empfang von E-Mails mit IMAP?](#do-you-support-receiving-email-with-imap).

### Wie lauten Ihre POP3-Serverkonfigurationseinstellungen? {#what-are-your-pop3-server-configuration-settings}

Unser Server ist `pop3.forwardemail.net` und wird auch auf unserer <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">Statusseite</a> überwacht.

Es unterstützt sowohl IPv4 als auch IPv6 und ist über die Ports `995` und `2995` für SSL/TLS verfügbar.

| Protokoll | Hostname | Häfen | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Bevorzugt** | `pop3.forwardemail.net` | `995`, `2995` | :weißes Häkchen: | :weißes Häkchen: |

| Login | Beispiel | Beschreibung |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Benutzername | `user@example.com` | E-Mail-Adresse eines Alias, der für die Domäne unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domänen</a> existiert. |
| Passwort | `************************` | Aliasspezifisch generiertes Passwort. |

Um eine Verbindung mit POP3 herzustellen, muss der **POP3-Benutzer** die E-Mail-Adresse eines Alias sein, der für die Domäne unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mein Konto <i class="fa fa-angle-right"></i> Domänen</a> existiert – und das **IMAP-Passwort** muss ein aliasspezifisches generiertes Passwort sein.

Eine Schritt-für-Schritt-Anleitung finden Sie unter [Unterstützen Sie POP3](#do-you-support-pop3).

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
Hierfür ist ein kostenpflichtiger Tarif mit aktiviertem SMTP-Zugriff erforderlich.
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

2. Wählen Sie während der Installation „Internet-Site“ aus, wenn Sie nach dem Konfigurationstyp gefragt werden.

#### Konfiguration {#configuration}

1. Bearbeiten Sie die Hauptkonfigurationsdatei von Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Fügen Sie diese Einstellungen hinzu oder ändern Sie sie:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Erstellen Sie die SASL-Passwortdatei:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Fügen Sie Ihre Anmeldeinformationen für die E-Mail-Weiterleitung hinzu:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. Sichern und hashen Sie die Kennwortdatei:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Starten Sie Postfix neu:

```bash
sudo systemctl restart postfix
```

#### Testen {#testing}

Testen Sie Ihre Konfiguration, indem Sie eine Test-E-Mail senden:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## Sicherheit {#security}

### Erweiterte Techniken zur Serverhärtung {#advanced-server-hardening-techniques}

> \[!TIP]
> Learn more about our security infrastructure on [our Security page](/security).

Forward Email implementiert zahlreiche Serverhärtungstechniken, um die Sicherheit unserer Infrastruktur und Ihrer Daten zu gewährleisten:

1. **Netzwerksicherheit**:
* IP-Tabellen-Firewall mit strengen Regeln
* Fail2ban zum Schutz vor Brute-Force-Angriffen
* Regelmäßige Sicherheitsüberprüfungen und Penetrationstests
* VPN-only-Administratorzugriff

2. **Systemhärtung**:
* Minimale Paketinstallation
* Regelmäßige Sicherheitsupdates
* SELinux im Durchsetzungsmodus
* Deaktivierter Root-SSH-Zugriff
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
* Maßnahmen zur Datenminimierung

5. **Überwachung und Reaktion**:
* Echtzeit-Einbruchserkennung
* Automatisierte Sicherheitsscans
* Zentralisierte Protokollierung und Analyse
* Verfahren zur Reaktion auf Vorfälle

> \[!IMPORTANT]
> Our security practices are continuously updated to address emerging threats and vulnerabilities.

> \[!TIP]
> For maximum security, we recommend using our service with end-to-end encryption via OpenPGP.

### Verfügen Sie über SOC 2- oder ISO 27001-Zertifizierungen? {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email operates on infrastructure provided by certified subprocessors to ensure compliance with industry standards.

Forward Email verfügt nicht direkt über SOC 2 Typ II- oder ISO 27001-Zertifizierungen. Der Dienst basiert jedoch auf der Infrastruktur zertifizierter Unterauftragnehmer:

* **DigitalOcean**: SOC 2 Typ II und SOC 3 Typ II zertifiziert (geprüft von Schellman & Company LLC), ISO 27001-zertifiziert in mehreren Rechenzentren. Details: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: SOC 2+ (HIPAA)-zertifiziert, ISO/IEC-Zertifizierungen: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Details: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2-konform (wenden Sie sich direkt an DataPacket, um eine Zertifizierung zu erhalten), Anbieter von Enterprise-Infrastruktur (Standort Denver). Details: <https://www.datapacket.com/datacenters/denver>

Forward Email befolgt branchenübliche Best Practices für Sicherheitsprüfungen und arbeitet regelmäßig mit unabhängigen Sicherheitsforschern zusammen. Quelle: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Verwenden Sie TLS-Verschlüsselung für die E-Mail-Weiterleitung? {#do-you-use-tls-encryption-for-email-forwarding}

Ja. Forward Email setzt TLS 1.2+ für alle Verbindungen (HTTPS, SMTP, IMAP, POP3) strikt durch und implementiert MTA-STS für erweiterte TLS-Unterstützung. Die Implementierung umfasst:

* TLS 1.2+-Durchsetzung für alle E-Mail-Verbindungen
* ECDHE-Schlüsselaustausch (Elliptic Curve Diffie-Hellman Ephemeral) für Perfect Forward Secrecy
* Moderne Verschlüsselungspakete mit regelmäßigen Sicherheitsupdates
* HTTP/2-Unterstützung für verbesserte Leistung und Sicherheit
* HSTS (HTTP Strict Transport Security) mit Vorabinstallation in gängigen Browsern
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** für strikte TLS-Durchsetzung

Quelle: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS-Implementierung**: Forward Email implementiert die strikte MTA-STS-Durchsetzung im Code. Bei TLS-Fehlern und aktivierter MTA-STS-Durchsetzung gibt das System den SMTP-Statuscode 421 zurück, um sicherzustellen, dass E-Mails später erneut gesendet und nicht unsicher zugestellt werden. Implementierungsdetails:

* TLS-Fehlererkennung: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* MTA-STS-Erzwingung im E-Mail-Sende-Helper: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Validierung durch Dritte: <https://www.hardenize.com/report/forwardemail.net/1750312779> zeigt die Bewertung „Gut“ für alle TLS- und Transportsicherheitsmaßnahmen.

### Bewahren Sie E-Mail-Authentifizierungsheader auf? {#do-you-preserve-email-authentication-headers}

Ja. Forward Email implementiert und bewahrt E-Mail-Authentifizierungsheader umfassend:

* **SPF (Sender Policy Framework)**: Ordnungsgemäß implementiert und geschützt
* **DKIM (DomainKeys Identified Mail)**: Vollständige Unterstützung mit ordnungsgemäßer Schlüsselverwaltung
* **DMARC**: Richtliniendurchsetzung für E-Mails, die die SPF- oder DKIM-Validierung nicht bestehen
* **ARC**: Obwohl nicht explizit beschrieben, deuten die perfekten Compliance-Werte des Dienstes auf eine umfassende Handhabung der Authentifizierungsheader hin

Quelle: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validierung: Der Internet.nl Mail-Test zeigt eine 100/100-Bewertung speziell für die Implementierung von SPF, DKIM und DMARC. Die Hardenize-Bewertung bestätigt die Bewertung „Gut“ für SPF und DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Bewahren Sie die ursprünglichen E-Mail-Header auf und verhindern Sie Spoofing? {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implements sophisticated anti-spoofing protection to prevent email abuse.

Forward Email bewahrt die ursprünglichen E-Mail-Header und implementiert gleichzeitig einen umfassenden Anti-Spoofing-Schutz durch die MX-Codebasis:

* **Header-Erhaltung**: Die ursprünglichen Authentifizierungsheader bleiben während der Weiterleitung erhalten.
* **Anti-Spoofing**: Die Durchsetzung der DMARC-Richtlinie verhindert Header-Spoofing, indem E-Mails, die die SPF- oder DKIM-Validierung nicht bestehen, abgelehnt werden.
* **Header-Injection-Schutz**: Eingabevalidierung und -bereinigung mithilfe der Striptags-Bibliothek.
* **Erweiterter Schutz**: Ausgefeilte Phishing-Erkennung mit Spoofing-Erkennung, Schutz vor Identitätsbetrug und Benutzerbenachrichtigungssystemen.

**Details zur MX-Implementierung**: Die Kernlogik der E-Mail-Verarbeitung wird von der Codebasis des MX-Servers übernommen, und zwar:

* Haupt-MX-Datenhandler: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Beliebige E-Mail-Filterung (Anti-Spoofing): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

Der `isArbitrary`-Helfer implementiert ausgefeilte Anti-Spoofing-Regeln, einschließlich der Erkennung von Domänen-Identitätsmissbrauch, blockierten Phrasen und verschiedenen Phishing-Mustern.

Quelle: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### Wie schützen Sie sich vor Spam und Missbrauch {#how-do-you-protect-against-spam-and-abuse}

Forward Email implementiert umfassenden mehrschichtigen Schutz:

* **Ratenbegrenzung**: Wird auf Authentifizierungsversuche, API-Endpunkte und SMTP-Verbindungen angewendet.
* **Ressourcenisolierung**: Zwischen Benutzern, um Beeinträchtigungen durch Nutzer mit hohem Datenaufkommen zu verhindern.
* **DDoS-Schutz**: Mehrschichtiger Schutz durch DataPackets Shield-System und Cloudflare.
* **Automatische Skalierung**: Dynamische Ressourcenanpassung je nach Bedarf.
* **Missbrauchsschutz**: Benutzerspezifische Missbrauchsschutzprüfungen und Hash-basierte Blockierung schädlicher Inhalte.
* **E-Mail-Authentifizierung**: SPF-, DKIM- und DMARC-Protokolle mit erweiterter Phishing-Erkennung.

Quellen:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (Details zum DDoS-Schutz)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Speichern Sie E-Mail-Inhalte auf der Festplatte? {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email uses a zero-knowledge architecture that prevents email content from being written to disk.

* **Zero-Knowledge-Architektur**: Individuell verschlüsselte SQLite-Postfächer verhindern, dass Forward Email auf E-Mail-Inhalte zugreifen kann.
* **In-Memory-Verarbeitung**: Die E-Mail-Verarbeitung erfolgt vollständig im Arbeitsspeicher, sodass keine Daten auf der Festplatte gespeichert werden.
* **Keine Inhaltsprotokollierung**: Wir protokollieren oder speichern weder E-Mail-Inhalte noch Metadaten auf der Festplatte.
* **Sandbox-Verschlüsselung**: Verschlüsselungsschlüssel werden niemals im Klartext auf der Festplatte gespeichert.

**MX-Codebasis-Beweis**: Der MX-Server verarbeitet E-Mails vollständig im Speicher, ohne Inhalte auf die Festplatte zu schreiben. Der Haupt-E-Mail-Verarbeitungshandler demonstriert diesen In-Memory-Ansatz: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Quellen:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Zusammenfassung)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Zero-Knowledge-Details)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Sandbox-Verschlüsselung)

### Können E-Mail-Inhalte bei Systemabstürzen offengelegt werden? {#can-email-content-be-exposed-during-system-crashes}

Nein. Forward Email implementiert umfassende Sicherheitsvorkehrungen gegen absturzbedingte Datenfreigabe:

* **Core Dumps deaktiviert**: Verhindert Speicherverlust bei Abstürzen.
* **Auslagerungsspeicher deaktiviert**: Vollständig deaktiviert, um die Extraktion sensibler Daten aus Auslagerungsdateien zu verhindern.
* **In-Memory-Architektur**: E-Mail-Inhalte werden während der Verarbeitung ausschließlich im flüchtigen Speicher gespeichert.
* **Verschlüsselungsschlüsselschutz**: Schlüssel werden niemals im Klartext auf der Festplatte gespeichert.
* **Physische Sicherheit**: Mit LUKS v2 verschlüsselte Festplatten verhindern den physischen Zugriff auf Daten.
* **USB-Speicher deaktiviert**: Verhindert unbefugten Datenzugriff.

**Fehlerbehandlung bei Systemproblemen**: Forward Email verwendet die Hilfsfunktionen `isCodeBug` und `isTimeoutError`, um sicherzustellen, dass das System bei Problemen mit der Datenbankkonnektivität, dem DNS-Netzwerk/der Blockliste oder der Upstream-Konnektivität 421 SMTP-Statuscodes zurückgibt, um sicherzustellen, dass E-Mails später erneut zugestellt werden und nicht verloren gehen oder offengelegt werden.

Implementierungsdetails:

* Fehlerklassifizierung: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Timeout-Fehlerbehandlung bei der MX-Verarbeitung: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Quelle: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Wer hat Zugriff auf Ihre E-Mail-Infrastruktur {#who-has-access-to-your-email-infrastructure}

Forward Email implementiert umfassende Zugriffskontrollen für den minimalen Zugriff seines 2-3-köpfigen Engineering-Teams mit strengen 2FA-Anforderungen:

* **Rollenbasierte Zugriffskontrolle**: Für Teamkonten mit ressourcenbasierten Berechtigungen
* **Prinzip der geringsten Rechte**: Anwendung in allen Systemen
* **Aufgabentrennung**: Zwischen operativen Rollen
* **Benutzerverwaltung**: Separate Bereitstellungs- und Entwicklungsbenutzer mit unterschiedlichen Berechtigungen
* **Root-Login deaktiviert**: Erzwingt den Zugriff über ordnungsgemäß authentifizierte Konten
* **Strenge 2FA**: Keine SMS-basierte 2FA aufgrund des Risikos von MiTM-Angriffen – nur App-basierte oder Hardware-Token
* **Umfassende Audit-Protokollierung**: Mit Schwärzung sensibler Daten
* **Automatische Anomalieerkennung**: Für ungewöhnliche Zugriffsmuster
* **Regelmäßige Sicherheitsüberprüfungen**: Der Zugriffsprotokolle
* **Schutz vor Evil-Maid-Angriffen**: Deaktivierung von USB-Speichern und andere physische Sicherheitsmaßnahmen

Quellen:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Autorisierungskontrollen)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Netzwerksicherheit)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Schutz vor Angriffen durch bösartige Dienstmädchen)

### Welche Infrastrukturanbieter nutzen Sie {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email uses multiple infrastructure subprocessors with comprehensive compliance certifications.

Ausführliche Informationen finden Sie auf unserer Seite zur DSGVO-Konformität: <https://forwardemail.net/gdpr>

**Primäre Infrastruktur-Subprozessoren:**

| Anbieter | Zertifiziertes Datenschutz-Framework | DSGVO-Konformitätsseite |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **Cloudflare** | ✅ Ja | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **Datenpaket** | ❌ Nein | <https://www.datapacket.com/privacy-policy> |
| **DigitalOcean** | ❌ Nein | <https://www.digitalocean.com/legal/gdpr> |
| **Vultr** | ❌ Nein | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**Detaillierte Zertifizierungen:**

**DigitalOcean**

* SOC 2 Typ II & SOC 3 Typ II (geprüft durch Schellman & Company LLC)
* ISO 27001-zertifiziert in mehreren Rechenzentren
* PCI-DSS-konform
* CSA STAR Level 1-zertifiziert
* APEC CBPR PRP-zertifiziert
* Details: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+ (HIPAA)-zertifiziert
* PCI Merchant-konform
* CSA STAR Level 1-zertifiziert
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Details: <https://www.vultr.com/legal/compliance/>

**Datenpaket**

* SOC 2-konform (für eine Zertifizierung wenden Sie sich bitte direkt an DataPacket)
* Enterprise-Infrastruktur (Standort Denver)
* DDoS-Schutz durch Shield Cybersecurity Stack
* Technischer Support rund um die Uhr
* Globales Netzwerk mit 58 Rechenzentren
* Details: <https://www.datapacket.com/datacenters/denver>

**Zahlungsabwickler:**

* **Stripe**: Data Privacy Framework-zertifiziert – <https://stripe.com/legal/privacy-center>
* **PayPal**: Nicht DPF-zertifiziert – <https://www.paypal.com/uk/legalhub/privacy-full>

### Bieten Sie eine Datenverarbeitungsvereinbarung (DPA) an? {#do-you-offer-a-data-processing-agreement-dpa}

Ja, Forward Email bietet eine umfassende Datenverarbeitungsvereinbarung (DPA) an, die mit unserem Unternehmensvertrag abgeschlossen werden kann. Eine Kopie unserer DPA finden Sie unter: <https://forwardemail.net/dpa>

**DPA Details:**

* Beinhaltet die DSGVO-Konformität und die EU-US/Schweiz-US-Datenschutzschild-Rahmenbestimmungen.
* Wird automatisch akzeptiert, wenn Sie unseren Nutzungsbedingungen zustimmen.
* Keine separate Unterschrift für Standard-Datenschutzvereinbarungen erforderlich.
* Individuelle Datenschutzvereinbarungen sind über die Enterprise-Lizenz verfügbar.

**Rahmenwerk zur Einhaltung der DSGVO:**
Unsere Datenschutzvereinbarung (DPA) beschreibt die Einhaltung der DSGVO sowie die Anforderungen für den internationalen Datentransfer. Vollständige Informationen finden Sie unter: <https://forwardemail.net/gdpr>

Unternehmenskunden, die individuelle DPA-Bedingungen oder besondere vertragliche Vereinbarungen benötigen, können diese über unser Programm **Unternehmenslizenz (250 $/Monat)** erfüllen.

### Wie gehen Sie mit Benachrichtigungen über Datenschutzverletzungen um? {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Email's zero-knowledge architecture significantly limits breach impact.

* **Begrenzte Datenexposition**: Kein Zugriff auf verschlüsselte E-Mail-Inhalte aufgrund der Zero-Knowledge-Architektur.
* **Minimale Datenerfassung**: Aus Sicherheitsgründen werden nur grundlegende Abonnenteninformationen und eingeschränkte IP-Protokolle erfasst.
* **Unterauftragsverarbeiter-Frameworks**: DigitalOcean und Vultr verfügen über DSGVO-konforme Verfahren zur Reaktion auf Vorfälle.

**Informationen zum DSGVO-Vertreter:**
Forward Email hat DSGVO-Vertreter gemäß Artikel 27 ernannt:

**EU-Vertreter:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**Vertreter in Großbritannien:**
Osano UK Compliance LTD
ATTN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1-5EF

Unternehmenskunden, die spezielle SLAs für die Benachrichtigung bei Verstößen benötigen, sollten diese im Rahmen einer **Unternehmenslizenz**-Vereinbarung besprechen.

Quellen:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Bieten Sie eine Testumgebung an? {#do-you-offer-a-test-environment}

Die technische Dokumentation von Forward Email beschreibt keinen dedizierten Sandbox-Modus. Mögliche Testansätze sind jedoch:

* **Self-Hosting-Option**: Umfassende Self-Hosting-Funktionen zum Erstellen von Testumgebungen
* **API-Schnittstelle**: Möglichkeit zum programmatischen Testen von Konfigurationen
* **Open Source**: 100 % Open-Source-Code ermöglicht Kunden die Prüfung der Weiterleitungslogik
* **Mehrere Domänen**: Die Unterstützung mehrerer Domänen ermöglicht die Erstellung von Testdomänen

Für Unternehmenskunden, die formelle Sandbox-Funktionen benötigen, sollte dies im Rahmen einer **Unternehmenslizenz**-Vereinbarung besprochen werden.

Quelle: <https://github.com/forwardemail/forwardemail.net> (Details zur Entwicklungsumgebung)

### Stellen Sie Überwachungs- und Warntools zur Verfügung? {#do-you-provide-monitoring-and-alerting-tools}

Forward Email bietet Echtzeitüberwachung mit einigen Einschränkungen:

**Verfügbar:**

* **Echtzeit-Zustellungsüberwachung**: Öffentlich sichtbare Leistungskennzahlen für wichtige E-Mail-Anbieter
* **Automatische Benachrichtigung**: Das Entwicklungsteam wird benachrichtigt, wenn die Zustellzeit 10 Sekunden überschreitet
* **Transparente Überwachung**: 100 % Open-Source-Überwachungssysteme
* **Infrastrukturüberwachung**: Automatische Anomalieerkennung und umfassende Audit-Protokollierung

**Einschränkungen:**

* Kundenorientierte Webhooks oder API-basierte Benachrichtigungen zum Lieferstatus sind nicht explizit dokumentiert

Für Unternehmenskunden, die detaillierte Webhooks zum Lieferstatus oder benutzerdefinierte Überwachungsintegrationen benötigen, sind diese Funktionen möglicherweise über **Unternehmenslizenz**-Vereinbarungen verfügbar.

Quellen:

* <https://forwardemail.net> (Echtzeit-Monitoring-Anzeige)
* <https://github.com/forwardemail/forwardemail.net> (Monitoring-Implementierung)

### Wie stellen Sie eine hohe Verfügbarkeit sicher? {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implements comprehensive redundancy across multiple infrastructure providers.

* **Verteilte Infrastruktur**: Mehrere Anbieter (DigitalOcean, Vultr, DataPacket) in verschiedenen geografischen Regionen
* **Geografischer Lastausgleich**: Cloudflare-basierter, geolokalisierter Lastausgleich mit automatischem Failover
* **Automatische Skalierung**: Dynamische Ressourcenanpassung je nach Bedarf
* **Mehrschichtiger DDoS-Schutz**: Durch DataPackets Shield-System und Cloudflare
* **Serverredundanz**: Mehrere Server pro Region mit automatischem Failover
* **Datenbankreplikation**: Echtzeit-Datensynchronisierung über mehrere Standorte hinweg
* **Überwachung und Warnmeldungen**: Rund-um-die-Uhr-Überwachung mit automatischer Reaktion auf Vorfälle

**Verfügbarkeitsgarantie**: Serviceverfügbarkeit von über 99,9 % mit transparenter Überwachung verfügbar unter <https://forwardemail.net>

Quellen:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Erfüllen Sie Abschnitt 889 des National Defense Authorization Act (NDAA)? {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email is fully compliant with Section 889 through careful selection of infrastructure partners.

Ja, Forward Email entspricht **Abschnitt 889**. Abschnitt 889 des National Defense Authorization Act (NDAA) verbietet Regierungsbehörden die Nutzung oder den Abschluss von Verträgen mit Unternehmen, die Telekommunikations- und Videoüberwachungsgeräte bestimmter Unternehmen (Huawei, ZTE, Hikvision, Dahua und Hytera) verwenden.

**So erreicht Forward Email die Einhaltung von Abschnitt 889:**

Forward Email verlässt sich ausschließlich auf zwei wichtige Infrastrukturanbieter, von denen keiner die gemäß Abschnitt 889 verbotene Ausrüstung verwendet:

1. **Cloudflare**: Unser Hauptpartner für Netzwerkdienste und E-Mail-Sicherheit.
2. **DataPacket**: Unser Hauptanbieter für Serverinfrastruktur (wir nutzen ausschließlich Geräte von Arista Networks und Cisco).
3. **Backup-Anbieter**: Unsere Backup-Anbieter Digital Ocean und Vultr sind zusätzlich schriftlich als konform mit Abschnitt 889 bestätigt.

**Verpflichtung von Cloudflare**: Cloudflare erklärt in seinem Verhaltenskodex für Dritte ausdrücklich, dass das Unternehmen keine Telekommunikationsgeräte, Videoüberwachungsprodukte oder Dienste von Unternehmen verwendet, die gemäß Abschnitt 889 verboten sind.

**Anwendungsfall für die Regierung**: Unsere Konformität mit Abschnitt 889 wurde bestätigt, als die **US Naval Academy** Forward Email für ihre Anforderungen an die sichere E-Mail-Weiterleitung auswählte und dafür eine Dokumentation unserer bundesstaatlichen Compliance-Standards verlangte.

Vollständige Informationen zu unserem Rahmenwerk zur Einhaltung gesetzlicher Vorschriften, einschließlich umfassenderer Bundesvorschriften, finden Sie in unserer umfassenden Fallstudie: [E-Mail-Dienst der Bundesregierung gemäß Abschnitt 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## System- und technische Details {#system-and-technical-details}

### Speichern Sie E-Mails und deren Inhalte? {#do-you-store-emails-and-their-contents}

Nein, wir schreiben nicht auf die Festplatte und speichern keine Protokolle – mit [Ausnahme von Fehlern](#do-you-store-error-logs) und [ausgehendes SMTP](#do-you-support-sending-email-with-smtp) (siehe unser [Datenschutzrichtlinie](/privacy)).

Alles wird im Speicher erledigt und [Unser Quellcode ist auf GitHub](https://github.com/forwardemail).

### Wie funktioniert Ihr E-Mail-Weiterleitungssystem {#how-does-your-email-forwarding-system-work}

E-Mail basiert auf dem [SMTP-Protokoll](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)-Protokoll. Dieses Protokoll besteht aus Befehlen, die an einen Server gesendet werden (meistens auf Port 25). Zunächst wird eine Verbindung hergestellt, anschließend gibt der Absender an, von wem die E-Mail stammt („MAIL FROM“), wohin sie gesendet wird („RCPT TO“) und schließlich die Header und der Text der E-Mail selbst („DATA“). Der Ablauf unseres E-Mail-Weiterleitungssystems wird unten für jeden SMTP-Protokollbefehl beschrieben:

* Initiale Verbindung (kein Befehlsname, z. B. `telnet example.com 25`) – Dies ist die initiale Verbindung. Absender, die nicht in unserem [Zulassungsliste](#do-you-have-an-allowlist) stehen, werden mit unserem [Denylist](#do-you-have-a-denylist) abgeglichen. Steht ein Absender nicht auf unserer Whitelist, prüfen wir, ob er bereits [graue Liste](#do-you-have-a-greylist) war.

* `HELO` – Dies kennzeichnet eine Begrüßung zur Identifizierung des FQDN, der IP-Adresse oder des Mail-Handler-Namens des Absenders. Dieser Wert kann gefälscht werden, daher verlassen wir uns nicht auf diese Daten und verwenden stattdessen die umgekehrte Hostnamensuche der IP-Adresse der Verbindung.

* `MAIL FROM` – Dies gibt die Absenderadresse der E-Mail an. Wenn ein Wert eingegeben wird, muss es sich um eine gültige RFC 5322-E-Mail-Adresse handeln. Leere Werte sind zulässig. Wir verwenden hier [auf Rückstreuung prüfen](#how-do-you-protect-against-backscatter) und gleichen die MAIL FROM-Adresse mit unserem [Denylist](#do-you-have-a-denylist) ab. Abschließend prüfen wir Absender, die nicht auf der Whitelist stehen, auf Ratenbegrenzung (weitere Informationen finden Sie im Abschnitt zu [Ratenbegrenzung](#do-you-have-rate-limiting) und [Zulassungsliste](#do-you-have-an-allowlist)).

* `RCPT TO` – Gibt den/die Empfänger der E-Mail an. Es müssen gültige RFC 5322-E-Mail-Adressen sein. Wir erlauben maximal 50 Envelope-Empfänger pro Nachricht (dies unterscheidet sich vom „An“-Header einer E-Mail). Wir prüfen hier außerdem, ob eine gültige [Sender-Rewriting-Schema](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) („SRS“)-Adresse vorhanden ist, um Spoofing mit unserem SRS-Domänennamen zu verhindern.

* `DATA` – Dies ist der Kern unseres Dienstes, der eine E-Mail verarbeitet. Weitere Informationen finden Sie im Abschnitt [Wie verarbeiten Sie eine E-Mail zur Weiterleitung?](#how-do-you-process-an-email-for-forwarding) weiter unten.

### Wie verarbeiten Sie eine E-Mail zur Weiterleitung {#how-do-you-process-an-email-for-forwarding}

In diesem Abschnitt wird unser Prozess im Zusammenhang mit dem SMTP-Protokollbefehl `DATA` im Abschnitt [Wie funktioniert Ihr E-Mail-Weiterleitungssystem](#how-does-your-email-forwarding-system-work) oben beschrieben. So verarbeiten wir die Kopfzeilen, den Text und die Sicherheit einer E-Mail, bestimmen, wohin sie zugestellt werden muss, und handhaben Verbindungen.

1. Wenn die Nachricht die maximale Größe von 50 MB überschreitet, wird sie mit einem Fehlercode 552 abgelehnt.

2. Wenn die Nachricht keinen „Von“-Header enthielt oder wenn einer der Werte im „Von“-Header keine gültigen RFC 5322-E-Mail-Adressen waren, wird sie mit einem Fehlercode 550 abgelehnt.

3. Wenn die Nachricht mehr als 25 „Received“-Header enthielt, wurde festgestellt, dass sie in einer Umleitungsschleife feststeckte, und sie wurde mit einem Fehlercode 550 abgelehnt.

4. Mithilfe des Fingerabdrucks der E-Mail (siehe Abschnitt zu [Fingerabdrücke](#how-do-you-determine-an-email-fingerprint)) überprüfen wir, ob seit mehr als 5 Tagen ein erneuter Zustellversuch für die Nachricht unternommen wurde (was mit [Standardmäßiges Postfix-Verhalten](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime) übereinstimmt). Wenn dies der Fall ist, wird die Nachricht mit dem Fehlercode 550 abgelehnt.

5. Wir speichern die Ergebnisse des E-Mail-Scans mit [Spam-Scanner](https://spamscanner.net) im Arbeitsspeicher.

6. Falls der Spam-Scanner fehlerhafte Ergebnisse liefert, wird er mit dem Fehlercode 554 abgelehnt. Zu den fehlerhaften Ergebnissen gehört zum Zeitpunkt der Erstellung dieses Artikels nur der GTUBE-Test. Weitere Informationen finden Sie unter <https://spamassassin.apache.org/gtube/>.

7. Wir werden der Nachricht zur Fehlerbehebung und Missbrauchsprävention die folgenden Header hinzufügen:

* `Received` – Wir fügen diesen standardmäßigen „Received“-Header mit Ursprungs-IP und -Host, Übertragungstyp, TLS-Verbindungsinformationen, Datum/Uhrzeit und Empfänger hinzu.
* `X-Original-To` – der ursprüngliche Empfänger der Nachricht:
* Dies ist nützlich, um festzustellen, wohin eine E-Mail ursprünglich zugestellt wurde (zusätzlich zum „Received“-Header).
* Dies wird pro Empfänger bei IMAP- und/oder maskierter Weiterleitung hinzugefügt (zum Schutz der Privatsphäre).
* `X-Forward-Email-Website` – enthält einen Link zu unserer Website unter <https://forwardemail.net>
* `X-Forward-Email-Version` – die aktuelle [SemVer](https://semver.org/)-Version von `package.json` unserer Codebasis.
* `X-Forward-Email-Session-ID` – ein Sitzungs-ID-Wert für Debugging-Zwecke (gilt nur in Nicht-Produktionsumgebungen).
* `X-Forward-Email-Sender` – eine durch Kommas getrennte Liste mit der ursprünglichen MAIL FROM-Adresse des Envelopes (sofern nicht leer), dem Reverse-PTR-Client-FQDN (sofern vorhanden) und der IP-Adresse des Absenders.
* `X-Forward-Email-ID` – gilt nur für ausgehendes SMTP und entspricht der unter „Mein Konto“ → „E-Mails“ gespeicherten E-Mail-ID.
* `X-Report-Abuse` – mit dem Wert `abuse@forwardemail.net`.
* `X-Report-Abuse-To` – mit dem Wert `abuse@forwardemail.net`.
* `X-Complaints-To` – mit einem Wert von `abuse@forwardemail.net`.

8. Anschließend überprüfen wir die Nachricht auf [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) und [DMARC](https://en.wikipedia.org/wiki/DMARC).

* Wenn die Nachricht den DMARC-Test nicht bestanden hat und für die Domäne eine Ablehnungsrichtlinie galt (z. B. `p=reject` [war in der DMARC-Richtlinie](https://wikipedia.org/wiki/DMARC)), wird sie mit dem Fehlercode 550 abgelehnt. Normalerweise befindet sich eine DMARC-Richtlinie für eine Domäne im <strong class="notranslate">TXT</strong>-Eintrag der Subdomäne `_dmarc` (z. B. `dig _dmarc.example.com txt`).
* Wenn die Nachricht den SPF-Test nicht bestanden hat und für die Domäne eine Hard-Fail-Richtlinie galt (z. B. war `-all` in der SPF-Richtlinie enthalten, im Gegensatz zu `~all` oder es gab überhaupt keine Richtlinie), wird sie mit dem Fehlercode 550 abgelehnt. Typischerweise findet sich eine SPF-Richtlinie für eine Domain im <strong class="notranslate">TXT</strong>-Eintrag der Stammdomain (z. B. `dig example.com txt`). Weitere Informationen zu [E-Mail-Versand wie mit Gmail](#can-i-send-mail-as-in-gmail-with-this) und SPF finden Sie in diesem Abschnitt.

9. Nun verarbeiten wir die Empfänger der Nachricht, die wir mit dem Befehl `RCPT TO` im Abschnitt [Wie funktioniert Ihr E-Mail-Weiterleitungssystem](#how-does-your-email-forwarding-system-work) oben ermittelt haben. Für jeden Empfänger führen wir die folgenden Operationen durch:

* Wir suchen die <strong class="notranslate">TXT</strong>-Einträge des Domänennamens (den Teil nach dem Symbol `@`, z. B. `example.com`, wenn die E-Mail-Adresse `test@example.com` lautete). Wenn die Domäne beispielsweise `example.com` lautet, führen wir einen DNS-Lookup wie `dig example.com txt` durch.
* Wir analysieren alle <strong class="notranslate">TXT</strong>-Einträge, die entweder mit `forward-email=` (kostenlose Tarife) oder `forward-email-site-verification=` (kostenpflichtige Tarife) beginnen. Beachten Sie, dass wir beide analysieren, um E-Mails zu verarbeiten, während ein Nutzer sein Tarif-Upgrade oder -Downgrade durchführt.
* Aus diesen analysierten <strong class="notranslate">TXT</strong>-Datensätzen iterieren wir, um die Weiterleitungskonfiguration zu extrahieren (wie im Abschnitt [Wie fange ich an und richte die E-Mail-Weiterleitung ein?](#how-do-i-get-started-and-set-up-email-forwarding) oben beschrieben). Beachten Sie, dass wir nur einen `forward-email-site-verification=`-Wert unterstützen. Bei Angabe mehrerer Werte tritt ein 550-Fehler auf, und der Absender erhält einen Bounce für diesen Empfänger.
* Rekursiv iterieren wir über die extrahierte Weiterleitungskonfiguration, um globale Weiterleitungen, Regex-basierte Weiterleitungen und alle anderen unterstützten Weiterleitungskonfigurationen zu ermitteln – diese werden nun als unsere „Weiterleitungsadressen“ bezeichnet.
* Für jede Weiterleitungsadresse unterstützen wir eine rekursive Suche (die diese Reihe von Operationen für die angegebene Adresse erneut startet). Wird eine rekursive Übereinstimmung gefunden, wird das übergeordnete Ergebnis aus den Weiterleitungsadressen entfernt und die untergeordneten Elemente hinzugefügt.
* Weiterleitungsadressen werden auf Eindeutigkeit geprüft (da wir keine Duplikate an eine Adresse senden oder zusätzliche, unnötige SMTP-Client-Verbindungen erzeugen möchten).
* Für jede Weiterleitungsadresse wird der Domänenname anhand unseres API-Endpunkts `/v1/max-forwarded-addresses` abgeglichen (um zu ermitteln, an wie viele Adressen die Domäne pro Alias E-Mails weiterleiten darf, z. B. standardmäßig 10 – siehe Abschnitt zu [maximales Weiterleitungslimit pro Alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Wird dieses Limit überschritten, tritt ein 550-Fehler auf, und der Absender erhält einen Bounce für diesen Empfänger.
* Die Einstellungen des ursprünglichen Empfängers werden anhand unseres API-Endpunkts `/v1/settings` abgeglichen, der eine Abfrage für kostenpflichtige Nutzer unterstützt (mit einem Fallback für kostenlose Nutzer). Dies gibt ein Konfigurationsobjekt für erweiterte Einstellungen für `port` (Zahl, z. B. `25`), `has_adult_content_protection` (Boolesch), `has_phishing_protection` (Boolesch), `has_executable_protection` (Boolesch) und `has_virus_protection` (Boolesch) zurück.
* Basierend auf diesen Einstellungen prüfen wir dann die Ergebnisse des Spam-Scanners. Bei Fehlern wird die Nachricht mit dem Fehlercode 554 abgelehnt (z. B. wenn `has_virus_protection` aktiviert ist, prüfen wir die Ergebnisse des Spam-Scanners auf Viren). Beachten Sie, dass alle Nutzer des kostenlosen Plans Prüfungen auf Inhalte für Erwachsene, Phishing, ausführbare Dateien und Viren abonnieren. Standardmäßig sind auch alle Benutzer des kostenpflichtigen Plans angemeldet, diese Konfiguration kann jedoch auf der Seite „Einstellungen“ für eine Domäne im Dashboard „E-Mail weiterleiten“ geändert werden.

10. Für jede verarbeitete Weiterleitungsadresse des Empfängers führen wir dann die folgenden Vorgänge durch:

* Die Adresse wird mit unserem [Denylist](#do-you-have-a-denylist) abgeglichen. Falls sie aufgeführt ist, wird der Fehlercode 421 ausgegeben (weist dem Absender an, es später erneut zu versuchen).
* Handelt es sich bei der Adresse um einen Webhook, setzen wir einen Booleschen Wert für zukünftige Vorgänge (siehe unten – wir gruppieren ähnliche Webhooks, um eine POST-Anfrage statt mehrerer für die Zustellung zu erstellen).
* Handelt es sich bei der Adresse um eine E-Mail-Adresse, analysieren wir den Host für zukünftige Vorgänge (siehe unten – wir gruppieren ähnliche Hosts, um eine Verbindung statt mehrerer einzelner Verbindungen für die Zustellung zu erstellen).

11. Wenn keine Empfänger vorhanden sind und es keine Bounces gibt, antworten wir mit einem 550-Fehler „Ungültige Empfänger“.

12. Wenn Empfänger vorhanden sind, durchlaufen wir diese (gruppiert vom selben Host) und stellen die E-Mails zu. Weitere Informationen finden Sie im Abschnitt [Wie gehen Sie mit Problemen bei der E-Mail-Zustellung um?](#how-do-you-handle-email-delivery-issues) weiter unten.

* Sollten beim Senden von E-Mails Fehler auftreten, werden diese zur späteren Bearbeitung gespeichert.
* Wir verwenden den niedrigsten Fehlercode (sofern vorhanden) aus dem E-Mail-Versand als Antwortcode für den Befehl `DATA`. Das bedeutet, dass nicht zugestellte E-Mails in der Regel vom ursprünglichen Absender erneut gesendet werden. Bereits zugestellte E-Mails werden jedoch beim nächsten Senden nicht erneut gesendet (da wir [Fingerabdrücke](#how-do-you-determine-an-email-fingerprint) verwenden).
* Wenn keine Fehler aufgetreten sind, senden wir den SMTP-Statuscode „250 erfolgreich“.
* Als Bounce gilt jeder Zustellversuch mit einem Statuscode >= 500 (dauerhafte Fehler).

13. Wenn keine Bounces aufgetreten sind (dauerhafte Fehler), geben wir einen SMTP-Antwortstatuscode mit dem niedrigsten Fehlercode aus nicht dauerhaften Fehlern zurück (oder einen erfolgreichen Statuscode 250, wenn keine aufgetreten sind).

14. Sollten Bounces auftreten, versenden wir im Hintergrund Bounce-E-Mails, nachdem wir den niedrigsten aller Fehlercodes an den Absender zurückgesendet haben. Ist der niedrigste Fehlercode jedoch >= 500, versenden wir keine Bounce-E-Mails. Andernfalls würden die Absender eine doppelte Bounce-E-Mail erhalten (z. B. eine von ihrem Outbound-MTA, z. B. Gmail, und eine von uns). Weitere Informationen finden Sie im Abschnitt zu [Wie schützt man sich vor Backscatter](#how-do-you-protect-against-backscatter) weiter unten.

### Wie gehen Sie mit Problemen bei der E-Mail-Zustellung um? {#how-do-you-handle-email-delivery-issues}

Beachten Sie, dass wir die E-Mails genau dann neu „Friendly-From“ schreiben, wenn die DMARC-Richtlinie des Absenders nicht bestanden wurde UND keine DKIM-Signaturen mit dem „From“-Header übereinstimmen. Das bedeutet, dass wir den „From“-Header der Nachricht ändern, „X-Original-From“ festlegen und auch eine „Reply-To“-Adresse einrichten, falls diese noch nicht eingerichtet wurde. Nach der Änderung dieser Header werden wir außerdem das ARC-Siegel der Nachricht erneut versiegeln.

Wir verwenden außerdem auf jeder Ebene unseres Stacks eine intelligente Analyse von Fehlermeldungen – in unserem Code DNS-Anfragen, interne Node.js-Daten, HTTP-Anfragen (z. B. werden 408, 413 und 429 dem SMTP-Antwortcode 421 zugeordnet, wenn der Empfänger ein Webhook ist) und Antworten des Mailservers (z. B. würden Antworten mit „defer“ oder „slowdown“ als 421-Fehler erneut versucht).

Unsere Logik ist fehlersicher und führt auch bei SSL/TLS-Fehlern, Verbindungsproblemen usw. einen erneuten Versuch durch. Ziel der Fehlersicherheit ist die Maximierung der Zustellbarkeit an alle Empfänger einer Weiterleitungskonfiguration.

Handelt es sich beim Empfänger um einen Webhook, gewähren wir ein Timeout von 60 Sekunden für die Ausführung der Anfrage mit bis zu drei Wiederholungsversuchen (also insgesamt vier Anfragen vor einem Fehler). Beachten Sie, dass wir die Fehlercodes 408, 413 und 429 korrekt analysieren und sie dem SMTP-Antwortcode 421 zuordnen.

Andernfalls, wenn der Empfänger eine E-Mail-Adresse ist, versuchen wir, die E-Mail mit opportunistischem TLS zu versenden (wir versuchen, STARTTLS zu verwenden, sofern es auf dem Mailserver des Empfängers verfügbar ist). Tritt beim Senden der E-Mail ein SSL/TLS-Fehler auf, versuchen wir, die E-Mail ohne TLS (ohne Verwendung von STARTTLS) zu versenden.

Wenn DNS- oder Verbindungsfehler auftreten, geben wir an den Befehl `DATA` einen SMTP-Antwortcode von 421 zurück. Andernfalls werden Bounces gesendet, wenn Fehler der Stufe >= 500 auftreten.

Wenn wir feststellen, dass ein E-Mail-Server, an den wir eine Zustellung vornehmen möchten, eine oder mehrere unserer Mail-Exchange-IP-Adressen blockiert hat (z. B. durch die Technologie, die dieser Server zum Abweisen von Spammern verwendet), senden wir dem Absender einen SMTP-Antwortcode von 421, damit er seine Nachricht später erneut senden kann (und wir werden über das Problem informiert, sodass wir es hoffentlich vor dem nächsten Versuch beheben können).

### Wie gehen Sie mit der Sperrung Ihrer IP-Adressen um? {#how-do-you-handle-your-ip-addresses-becoming-blocked}

Wir überwachen routinemäßig alle wichtigen DNS-Sperrlisten. Wenn eine unserer Mail Exchange-IP-Adressen („MX“) in einer wichtigen Sperrliste aufgeführt ist, entfernen wir sie nach Möglichkeit im Round-Robin-Verfahren aus dem entsprechenden DNS-A-Eintrag, bis das Problem behoben ist.

Zum Zeitpunkt der Erstellung dieses Artikels sind wir auch in mehreren DNS-Whitelists gelistet und nehmen die Überwachung von Denylists sehr ernst. Sollten Sie Probleme feststellen, bevor wir diese beheben können, benachrichtigen Sie uns bitte schriftlich unter <support@forwardemail.net>.

Unsere IP-Adressen sind öffentlich verfügbar, [Weitere Informationen finden Sie im folgenden Abschnitt.](#what-are-your-servers-ip-addresses).

### Was sind Postmaster-Adressen {#what-are-postmaster-addresses}

Um fehlgeleitete Bounces und das Senden von Abwesenheitsnachrichten an nicht überwachte oder nicht vorhandene Postfächer zu verhindern, pflegen wir eine Liste mit Mailer-Daemon-ähnlichen Benutzernamen:

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

Weitere Informationen dazu, wie Listen wie diese zum Erstellen effizienter E-Mail-Systeme verwendet werden, finden Sie unter [RFC 5320 Abschnitt 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6).

### Was sind No-Reply-Adressen {#what-are-no-reply-addresses}

E-Mail-Benutzernamen, die einem der folgenden Werte entsprechen (ohne Berücksichtigung der Groß- und Kleinschreibung), werden als No-Reply-Adressen betrachtet:

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

Diese Liste wird [als Open-Source-Projekt auf GitHub](https://github.com/forwardemail/reserved-email-addresses-list) gepflegt.

### Wie lauten die IP-Adressen Ihres Servers? {#what-are-your-servers-ip-addresses}

Wir veröffentlichen unsere IP-Adressen unter <https://forwardemail.net/ips>.

### Haben Sie eine Zulassungsliste {#do-you-have-an-allowlist}

Ja, wir haben einen [Liste der Domänennamenerweiterungen](#what-domain-name-extensions-are-allowlisted-by-default), der standardmäßig auf der Whitelist steht, und eine dynamische, zwischengespeicherte und rollierende Whitelist, die auf [strenge Kriterien](#what-is-your-allowlist-criteria) basiert.

Alle E-Mails, Domänen und Empfänger von Kunden mit kostenpflichtigen Tarifen werden automatisch zu unserer Whitelist hinzugefügt.

### Welche Domänennamenerweiterungen werden standardmäßig auf die Whitelist gesetzt? {#what-domain-name-extensions-are-allowlisted-by-default}

Die folgenden Domänennamenerweiterungen gelten standardmäßig als zugelassene Erweiterungen (unabhängig davon, ob sie auf der Umbrella Popularity List stehen oder nicht):

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
<li wy.us</code></li>
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
<li mil.in</code></li>
<li class="list-inline-item"><code class="notranslate">ac.jp</code></li>
<li class="list-inline-item"><code class="notranslate">ed.jp</code></li>
<li class="list-inline-item"><code class="notranslate">lg.jp</code></li>
<li class="list-inline-item"><code class="notranslate">ac.za</code></li>
<li class="list-inline-item"><code class="notranslate">edu.za</code></li>
<li class="list-inline-item"><code class="notranslate">mil.za</code></li>
<li class="list-inline-item"><code class="notranslate">school.za</code></li>
<li mil.kr</code></li>
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
<li gob.mx</code></li>
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

Darüber hinaus werden diese [Marken- und Unternehmens-Top-Level-Domains](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) standardmäßig auf die Whitelist gesetzt (z. B. `apple` für `applecard.apple` für Kontoauszüge der Apple Card):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">aaa</code></li>
<li class="list-inline-item"><code class="notranslate">aarp</code></li>
<li class="list-inline-item"><code class="notranslate">abarth</code></li>
<li class="list-inline-item"><code class="notranslate">abb</code></li>
<li class="list-inline-item"><code class="notranslate">abbott</code></li>
<li class="list-inline-item"><code class="notranslate">abbvie</code></li>
<li class="list-inline-item"><code class="notranslate">abc</code></li>
<li class="list-inline-item"><code Accenture</code></li>
<li class="list-inline-item"><code class="notranslate">aco</code></li>
<li class="list-inline-item"><code class="notranslate">aeg</code></li>
<li class="list-inline-item"><code class="notranslate">aetna</code></li>
<li class="list-inline-item"><code class="notranslate">afl</code></li>
<li class="list-inline-item"><code class="notranslate">agakhan</code></li>
<li class="list-inline-item"><code class="notranslate">aig</code></li>
<li class="list-inline-item"><code class="notranslate">aigo</code></li>
<li class="list-inline-item"><code Airbus</code></li>
<li class="list-inline-item"><code class="notranslate">Airtel</code></li>
<li class="list-inline-item"><code class="notranslate">AkDN</code></li>
<li class="list-inline-item"><code class="notranslate">Alfa Romeo</code></li>
<li class="list-inline-item"><code class="notranslate">Alibaba</code></li>
<li class="list-inline-item"><code class="notranslate">Alipay</code></li>
<li class="list-inline-item"><code class="notranslate">Allfinanz</code></li>
<li class="list-inline-item"><code class="notranslate">Allstate</code></li>
<li class="list-inline-item"><code class="notranslate">ally</code></li>
<li class="list-inline-item"><code class="notranslate">alstom</code></li>
<li class="list-inline-item"><code class="notranslate">amazon</code></li>
<li class="list-inline-item"><code class="notranslate">americanexpress</code></li>
<li class="list-inline-item"><code class="notranslate">amex</code></li>
<li class="list-inline-item"><code class="notranslate">amica</code></li>
<li class="list-inline-item"><code class="notranslate">android</code></li>
<li class="list-inline-item"><code class="notranslate">anz</code></li>
<li class="list-inline-item"><code class="notranslate">aol</code></li>
<li Apple</li>
Aquarelle</li>
Aramco</li>
Audi</li>
Auspost</li>
AWS</li>
Axa</li>
Azure</li>
Azure</li>
Azure</li> Baidu</code></li>
<li class="list-inline-item"><code class="notranslate">Bananenrepublik</code></li>
<li class="list-inline-item"><code class="notranslate">Barclays</code></li>
<li class="list-inline-item"><code class="notranslate">Basketball</code></li>
<li class="list-inline-item"><code class="notranslate">Bauhaus</code></li>
<li class="list-inline-item"><code class="notranslate">BBC</code></li>
<li class="list-inline-item"><code class="notranslate">BBT</code></li>
<li class="list-inline-item"><code bbva</code></li>
<li class="list-inline-item"><code class="notranslate">bcg</code></li>
<li class="list-inline-item"><code class="notranslate">bentley</code></li>
<li class="list-inline-item"><code class="notranslate">bharti</code></li>
<li class="list-inline-item"><code class="notranslate">bing</code></li>
<li class="list-inline-item"><code class="notranslate">blanco</code></li>
<li class="list-inline-item"><code class="notranslate">bloomberg</code></li>
<li class="list-inline-item"><code class="notranslate">bms</code></li>
<li class="list-inline-item"><code BMW</li>

<li class="list-inline-item"><code class="notranslate">bnl</li>

<li class="list-inline-item"><code class="notranslate">bnpparibas</li>

<li class="list-inline-item"><code class="notranslate">boehringer</li>

<li class="list-inline-item"><code class="notranslate">Bond</li>

<li class="list-inline-item"><code class="notranslate">Buchung</li>

<li class="list-inline-item"><code class="notranslate">Bosch</li>

<li class="list-inline-item"><code class="notranslate">Bostik</li>

<li class="list-inline-item"><code Bradesco</code></li>
<li class="list-inline-item"><code class="notranslate">Bridgestone</code></li>
<li class="list-inline-item"><code class="notranslate">Brother</code></li>
<li class="list-inline-item"><code class="notranslate">Bugatti</code></li>
<li class="list-inline-item"><code class="notranslate">Cal</code></li>
<li class="list-inline-item"><code class="notranslate">Calvin Klein</code></li>
<li class="list-inline-item"><code class="notranslate">Canon</code></li>
<li class="list-inline-item"><code class="notranslate">Capitalone</code></li>
<li class="list-inline-item"><code Caravan</code></li>
<li class="list-inline-item"><code class="notranslate">Cartier</code></li>
<li class="list-inline-item"><code class="notranslate">CBA</code></li>
<li class="list-inline-item"><code class="notranslate">CBN</code></li>
<li class="list-inline-item"><code class="notranslate">CBRE</code></li>
<li class="list-inline-item"><code class="notranslate">CBS</code></li>
<li class="list-inline-item"><code class="notranslate">CERN</code></li>
<li class="list-inline-item"><code class="notranslate">CFA</code></li>
<li class="list-inline-item"><code Chanel</code></li>
<li class="list-inline-item"><code class="notranslate">Chase</code></li>
<li class="list-inline-item"><code class="notranslate">Chinesisch</code></li>
<li class="list-inline-item"><code class="notranslate">Chrome</code></li>
<li class="list-inline-item"><code class="notranslate">Chrysler</code></li>
<li class="list-inline-item"><code class="notranslate">Cipriani</code></li>
<li class="list-inline-item"><code class="notranslate">Cisco</code></li>
<li class="list-inline-item"><code class="notranslate">Citadel</code></li>
<li class="list-inline-item"><code class="notranslate">Citi</code></li>
<li class="list-inline-item"><code class="notranslate">Citi</code></li>
<li class="list-inline-item"><code class="notranslate">ClubMed</code></li>
<li class="list-inline-item"><code class="notranslate">Comcast</code></li>
<li class="list-inline-item"><code class="notranslate">Commbank</code></li>
<li class="list-inline-item"><code class="notranslate">Creditunion</code></li>
<li class="list-inline-item"><code class="notranslate">Crown</code></li>
<li class="list-inline-item"><code class="notranslate">CRS</code></li>
<li class="list-inline-item"><code class="notranslate">csc</code></li>
<li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
<li class="list-inline-item"><code class="notranslate">dabur</code></li>
<li class="list-inline-item"><code class="notranslate">datsun</code></li>
<li class="list-inline-item"><code class="notranslate">Händler</code></li>
<li class="list-inline-item"><code class="notranslate">Dell</code></li>
<li class="list-inline-item"><code class="notranslate">Deloitte</code></li>
<li class="list-inline-item"><code class="notranslate">Delta</code></li>
<li class="list-inline-item"><code DHL</li>
Discover</li>
Dish</li>
DNP</li>
Dodge</li>
Dunlop</li>
Dupont</li>
Dvag</li>
Danlop</li>
Dupont</li>
Danlop</li>
Danlop</li> class="notranslate">edeka</code></li>
<li class="list-inline-item"><code class="notranslate">emerck</code></li>
<li class="list-inline-item"><code class="notranslate">epson</code></li>
<li class="list-inline-item"><code class="notranslate">ericsson</code></li>
<li class="list-inline-item"><code class="notranslate">erni</code></li>
<li class="list-inline-item"><code class="notranslate">esurance</code></li>
<li class="list-inline-item"><code class="notranslate">etisalat</code></li>
<li class="list-inline-item"><code class="notranslate">eurovision</code></li>
<li class="list-inline-item"><code class="notranslate">Everbank</code></li>
<li class="list-inline-item"><code class="notranslate">Extraspace</code></li>
<li class="list-inline-item"><code class="notranslate">Fage</code></li>
<li class="list-inline-item"><code class="notranslate">Fairwinds</code></li>
<li class="list-inline-item"><code class="notranslate">Farmers</code></li>
<li class="list-inline-item"><code class="notranslate">Fedex</code></li>
<li class="list-inline-item"><code class="notranslate">Ferrari</code></li>
<li class="list-inline-item"><code class="notranslate">Ferrero</code></li>
<li class="list-inline-item"><code Fiat</code></li>
Fidelity</code></li>
Fidelity</code></li>
Fidelity</code></li>
Fidelity</code></li>
Fidelity</code></li>
Fidelity</code></li>
Fidelity</code></li>
Fidelity</code></li>
Fidelity</code></li>
Fidelity</code></li>
Fidelity</code></li>
Fidelity</code></li>
Fidelity</code></li>
Fidelity</code></li>
Fidelity</code></li>
Fidelity</code></li> Fox</code></li>
<li class="list-inline-item"><code class="notranslate">Fresenius</code></li>
<li class="list-inline-item"><code class="notranslate">Forex</code></li>
<li class="list-inline-item"><code class="notranslate">Frogans</code></li>
<li class="list-inline-item"><code class="notranslate">Frontier</code></li>
<li class="list-inline-item"><code class="notranslate">Fujitsu</code></li>
<li class="list-inline-item"><code class="notranslate">Fujixerox</code></li>
<li class="list-inline-item"><code class="notranslate">Gallo</code></li>
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
<li class="list-inline-item"><code Guardian</code></li>
<li class="list-inline-item"><code class="notranslate">Gucci</code></li>
<li class="list-inline-item"><code class="notranslate">HBO</code></li>
<li class="list-inline-item"><code class="notranslate">HDFC</code></li>
<li class="list-inline-item"><code class="notranslate">HDFCBank</code></li>
<li class="list-inline-item"><code class="notranslate">Hermès</code></li>
<li class="list-inline-item"><code class="notranslate">Hisamitsu</code></li>
<li class="list-inline-item"><code class="notranslate">Hitachi</code></li>
<li class="list-inline-item"><code hkt</code></li>
<li class="list-inline-item"><code class="notranslate">Honda</code></li>
<li class="list-inline-item"><code class="notranslate">Honeywell</code></li>
<li class="list-inline-item"><code class="notranslate">Hotmail</code></li>
<li class="list-inline-item"><code class="notranslate">HSBC</code></li>
<li class="list-inline-item"><code class="notranslate">Hughes</code></li>
<li class="list-inline-item"><code class="notranslate">Hyatt</code></li>
<li class="list-inline-item"><code class="notranslate">Hyundai</code></li>
<li class="list-inline-item"><code IBM</code></li>
<li class="list-inline-item"><code class="notranslate">IEEE</code></li>
<li class="list-inline-item"><code class="notranslate">IFM</code></li>
<li class="list-inline-item"><code class="notranslate">IKANO</code></li>
<li class="list-inline-item"><code class="notranslate">IMDB</code></li>
<li class="list-inline-item"><code class="notranslate">Infiniti</code></li>
<li class="list-inline-item"><code class="notranslate">Intel</code></li>
<li class="list-inline-item"><code class="notranslate">Intuition</code></li>
<li class="list-inline-item"><code class="notranslate">ipiranga</code></li>
<li class="list-inline-item"><code class="notranslate">iselect</code></li>
<li class="list-inline-item"><code class="notranslate">itau</code></li>
<li class="list-inline-item"><code class="notranslate">itv</code></li>
<li class="list-inline-item"><code class="notranslate">iveco</code></li>
<li class="list-inline-item"><code class="notranslate">jaguar</code></li>
<li class="list-inline-item"><code class="notranslate">java</code></li>
<li class="list-inline-item"><code class="notranslate">jcb</code></li>
<li class="list-inline-item"><code jcp</code></li>
<li class="list-inline-item"><code class="notranslate">Jeep</code></li>
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
<li class="list-inline-item"><code class="notranslate">Lacaixa</code></li>
<li class="list-inline-item"><code class="notranslate">Ladbrokes</code></li>
<li class="list-inline-item"><code class="notranslate">Lamborghini</code></li>
<li class="list-inline-item"><code class="notranslate">Lancaster</code></li>
<li class="list-inline-item"><code class="notranslate">Lancia</code></li>
<li class="list-inline-item"><code class="notranslate">Lancome</code></li>
<li class="list-inline-item"><code class="notranslate">Landrover</code></li>
<li class="list-inline-item"><code class="notranslate">Lanxess</code></li>
<li class="list-inline-item"><code class="notranslate">Lasalle</code></li>
<li class="list-inline-item"><code class="notranslate">Latrobe</code></li>
<li class="list-inline-item"><code class="notranslate">LDS</code></li>
<li class="list-inline-item"><code class="notranslate">Leclerc</code></li>
<li class="list-inline-item"><code class="notranslate">Lego</code></li>
<li class="list-inline-item"><code class="notranslate">Liaison</code></li>
<li class="list-inline-item"><code class="notranslate">Lexus</code></li>
<li class="list-inline-item"><code class="notranslate">Lidl</code></li>
<li class="list-inline-item"><code Lifestyle</code></li>
<li class="list-inline-item"><code class="notranslate">Lilly</code></li>
<li class="list-inline-item"><code class="notranslate">Lincoln</code></li>
<li class="list-inline-item"><code class="notranslate">Lipsy</code></li>
<li class="list-inline-item"><code class="notranslate">Lipsy</code></li>
<li class="list-inline-item"><code class="notranslate">Locus</code></li>
<li class="list-inline-item"><code class="notranslate">Lotte</code></li>
<li class="list-inline-item"><code lpl</code></li>
<li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
<li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
<li class="list-inline-item"><code class="notranslate">lupin</code></li>
<li class="list-inline-item"><code class="notranslate">macys</code></li>
<li class="list-inline-item"><code class="notranslate">maif</code></li>
<li class="list-inline-item"><code class="notranslate">man</code></li>
<li class="list-inline-item"><code class="notranslate">mango</code></li>
<li class="list-inline-item"><code class="notranslate">Marriott</code></li>
<li class="list-inline-item"><code class="notranslate">Maserati</code></li>
<li class="list-inline-item"><code class="notranslate">Mattel</code></li>
<li class="list-inline-item"><code class="notranslate">Mckinsey</code></li>
<li class="list-inline-item"><code class="notranslate">Metlife</code></li>
<li class="list-inline-item"><code class="notranslate">Microsoft</code></li>
<li class="list-inline-item"><code class="notranslate">Mini</code></li>
<li class="list-inline-item"><code class="notranslate">MIT</code></li>
<li class="list-inline-item"><code Mitsubishi</code></li>
<li class="list-inline-item"><code class="notranslate">MLB</code></li>
<li class="list-inline-item"><code class="notranslate">MMA</code></li>
<li class="list-inline-item"><code class="notranslate">Monash</code></li>
<li class="list-inline-item"><code class="notranslate">Mormon</code></li>
<li class="list-inline-item"><code class="notranslate">Movistar</code></li>
<li class="list-inline-item"><code class="notranslate">MSD</code></li>
<li class="list-inline-item"><code class="notranslate">mtn</code></li>
<li class="list-inline-item"><code class="notranslate">mtr</code></li>
<li class="list-inline-item"><code class="notranslate">gegenseitig</code></li>
<li class="list-inline-item"><code class="notranslate">nadex</code></li>
<li class="list-inline-item"><code class="notranslate">bundesweit</code></li>
<li class="list-inline-item"><code class="notranslate">natura</code></ li>
<li class="list-inline-item"><code class="notranslate">nba</code></li>
<li class="list-inline-item"><code class="notranslate">nec</code></li>
<li class="list-inline-item"><code class="notranslate">netflix</code></li>
<li class="list-inline-item"><code class="notranslate">neustar</code></li>
<li class="list-inline-item"><code class="notranslate">newholland</code></li>
<li class="list-inline-item"><code class="notranslate">nfl</code></li>
<li class="list-inline-item"><code class="notranslate">nhk</code></li>
<li class="list-inline-item"><code class="notranslate">nico</code></li>
<li Nike</li>

<li>Nikon</li>
<li>Nissan</li>
<li>Nissan</li>
<li>Nokia</li>
<li>Northwesternmutual</li>
<li>Norton</li>
<li>NRA</li>
<li class="list-inline-item"><code class="notranslate">ntt</code></li>
<li class="list-inline-item"><code class="notranslate">obi</code></li>
<li class="list-inline-item"><code class="notranslate">office</code></li>
<li class="list-inline-item"><code class="notranslate">omega</code></li>
<li class="list-inline-item"><code class="notranslate">oracle</code></li>
<li class="list-inline-item"><code class="notranslate">orange</code></li>
<li class="list-inline-item"><code class="notranslate">otsuka</code></li>
<!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
<li Panasonic</li>

<li>PCCW</li>
<li>Pfizer</li>
<li>Philips</li>
<li>Piaget</li>
<li>Pictet</li>
<li>Ping</li>
<li>Pioneer</li>
<li> class="list-inline-item"><code class="notranslate">Play</code></li>
<li class="list-inline-item"><code class="notranslate">Playstation</code></li>
<li class="list-inline-item"><code class="notranslate">Polizei</code></li>
<li class="list-inline-item"><code class="notranslate">Praxis</code></li>
<li class="list-inline-item"><code class="notranslate">Produktion</code></li>
<li class="list-inline-item"><code class="notranslate">Progressiv</code></li>
<li class="list-inline-item"><code class="notranslate">Praxis</code></li>
<li class="list-inline-item"><code Prudential</code></li>
<li class="list-inline-item"><code class="notranslate">PWC</code></li>
<!--<li class="list-inline-item"><code class="notranslate">Quest</code></li>-->
<li class="list-inline-item"><code class="notranslate">QVC</code></li>
<li class="list-inline-item"><code class="notranslate">Redstone</code></li>
<li class="list-inline-item"><code class="notranslate">Reliance</code></li>
<li class="list-inline-item"><code class="notranslate">Rexroth</code></li>
<li class="list-inline-item"><code class="notranslate">Ricoh</code></li>
<li class="list-inline-item"><code class="notranslate">rmit</code></li>
<li class="list-inline-item"><code class="notranslate">rocher</code></li>
<li class="list-inline-item"><code class="notranslate">rogers</code></li>
<li class="list-inline-item"><code class="notranslate">rwe</code></li>
<li class="list-inline-item"><code class="notranslate">Sicherheit</code></li>
<li class="list-inline-item"><code class="notranslate">Sakura</code></li>
<li class="list-inline-item"><code class="notranslate">Samsung</code></li>
<li class="list-inline-item"><code class="notranslate">Sandvik</code></li>
<li class="list-inline-item"><code Sandvikcoromant</code></li>
<li class="list-inline-item"><code class="notranslate">Sanofi</code></li>
<li class="list-inline-item"><code class="notranslate">Sap</code></li>
<li class="list-inline-item"><code class="notranslate">Saxo</code></li>
<li class="list-inline-item"><code class="notranslate">SBI</code></li>
<!--<li class="list-inline-item"><code class="notranslate">SBS</code></li>-->
<li class="list-inline-item"><code class="notranslate">SCA</code></li>
<li class="list-inline-item"><code class="notranslate">SCB</code></li>
<li class="list-inline-item"><code class="notranslate">Schaeffler</code></li>
<li class="list-inline-item"><code class="notranslate">Schmidt</code></li>
<li class="list-inline-item"><code class="notranslate">Schwarz</code></li>
<li class="list-inline-item"><code class="notranslate">ScJohnson</code></li>
<li class="list-inline-item"><code class="notranslate">Scor</code></li>
<li class="list-inline-item"><code class="notranslate">Seat</code></li>
<li class="list-inline-item"><code class="notranslate">Sener</code></li>
<li class="list-inline-item"><code class="notranslate">Ses</code></li>
<li class="list-inline-item"><code class="notranslate">nähen</code></li>
<li class="list-inline-item"><code class="notranslate">sieben</code></li>
<li class="list-inline-item"><code class="notranslate">sfr</code></li>
<li class="list-inline-item"><code class="notranslate">suchen</code></li>
<li class="list-inline-item"><code class="notranslate">shangrila</code></li>
<li class="list-inline-item"><code class="notranslate">scharf</code></li>
<li class="list-inline-item"><code class="notranslate">shaw</code></li>
<li class="list-inline-item"><code class="notranslate">Shell</code></li>
<li class="list-inline-item"><code shriram</code></li>
<li class="list-inline-item"><code class="notranslate">sina</code></li>
<li class="list-inline-item"><code class="notranslate">sky</code></li>
<li class="list-inline-item"><code class="notranslate">skype</code></li>
<li class="list-inline-item"><code class="notranslate">smart</code></li>
<li class="list-inline-item"><code class="notranslate">sncf</code></li>
<li class="list-inline-item"><code class="notranslate">softbank</code></li>
<li class="list-inline-item"><code class="notranslate">sohu</code></li>
<li class="list-inline-item"><code Sony</li>
Spiegel</li>
Stada</li>
Staples</li>
Star</li>
Starhub</li>
Statebank</li>
Statefarm</li>
Statoil</li>
<li class="list-inline-item"><code class="notranslate">stc</code></li>
<li class="list-inline-item"><code class="notranslate">stcgroup</code></li>
<li class="list-inline-item"><code class="notranslate">Suzuki</code></li>
<li class="list-inline-item"><code class="notranslate">Swatch</code></li>
<li class="list-inline-item"><code class="notranslate">Swiftcover</code></li>
<li class="list-inline-item"><code class="notranslate">Symantec</code></li>
<li class="list-inline-item"><code class="notranslate">Taobao</code></li>
<li class="list-inline-item"><code class="notranslate">Ziel</code></li>
<li Tatamotors</li>
<li>TDK</li>
<li>Telecity</li>
<li>Telekom</li>
<li>Temasek</li>
<li>Teva</li>
<li>Tiffany</li>
<li>TJX</li>
<li class="list-inline-item"><code class="notranslate">Toray</code></li>
<li class="list-inline-item"><code class="notranslate">Toshiba</code></li>
<li class="list-inline-item"><code class="notranslate">Gesamt</code></li>
<li class="list-inline-item"><code class="notranslate">Toyota</code></li>
<li class="list-inline-item"><code class="notranslate">Travelchannel</code></li>
<li class="list-inline-item"><code class="notranslate">Reisende</code></li>
<li class="list-inline-item"><code class="notranslate">TUI</code></li>
<li class="list-inline-item"><code class="notranslate">Fernseher</code></li>
<li class="list-inline-item"><code class="notranslate">ubs</code></li>
<li class="list-inline-item"><code class="notranslate">unicom</code></li>
<li class="list-inline-item"><code class="notranslate">uol</code></li>
<li class="list-inline-item"><code class="notranslate">ups</code></li>
<li class="list-inline-item"><code class="notranslate">vanguard</code></li>
<li class="list-inline-item"><code class="notranslate">verisign</code></li>
<li class="list-inline-item"><code class="notranslate">vig</code></li>
<li class="list-inline-item"><code class="notranslate">viking</code></li>
<li class="list-inline-item"><code Virgin</code></li>
<li class="list-inline-item"><code class="notranslate">Visa</code></li>
<li class="list-inline-item"><code class="notranslate">Vista</code></li>
<li class="list-inline-item"><code class="notranslate">Vistaprint</code></li>
<li class="list-inline-item"><code class="notranslate">Vivo</code></li>
<li class="list-inline-item"><code class="notranslate">Volkswagen</code></li>
<li class="list-inline-item"><code class="notranslate">Volvo</code></li>
<li class="list-inline-item"><code class="notranslate">Walmart</code></li>
<li class="list-inline-item"><code class="notranslate">Walter</code></li>
<li class="list-inline-item"><code class="notranslate">Wetterkanal</code></li>
<li class="list-inline-item"><code class="notranslate">Weber</code></li>
<li class="list-inline-item"><code class="notranslate">Weir</code></li>
<li class="list-inline-item"><code class="notranslate">Williamhill</code></li>
<li class="list-inline-item"><code class="notranslate">Windows</code></li>
<li class="list-inline-item"><code class="notranslate">WME</code></li>
<li class="list-inline-item"><code class="notranslate">Wolterskluwer</code></li>
<li class="list-inline-item"><code Woodside</code></li>
<li class="list-inline-item"><code class="notranslate">wtc</code></li>
<li class="list-inline-item"><code class="notranslate">xbox</code></li>
<li class="list-inline-item"><code class="notranslate">xerox</code></li>
<li class="list-inline-item"><code class="notranslate">xfinity</code></li>
<li class="list-inline-item"><code class="notranslate">yahoo</code></li>
<li class="list-inline-item"><code class="notranslate">yamaxun</code></li>
<li class="list-inline-item"><code class="notranslate">yandex</code></li>
<li class="list-inline-item"><code Yodobashi</code></li>
<li class="list-inline-item"><code class="notranslate">YouTube</code></li>
<li class="list-inline-item"><code class="notranslate">Zappos</code></li>
<li class="list-inline-item"><code class="notranslate">Zara</code></li>
<li class="list-inline-item"><code class="notranslate">Zippo</code></li>
</ul>

Seit dem 18. März 2025 haben wir dieser Liste auch die folgenden französischen Überseegebiete hinzugefügt ([gemäß dieser GitHub-Anfrage](https://github.com/forwardemail/forwardemail.net/issues/327)):

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

Ab dem 8. Juli 2025 haben wir diese europaspezifischen Länder hinzugefügt:

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

Aufgrund hoher Spam-Aktivität haben wir `cz`, `ru` und `ua` ausdrücklich nicht aufgenommen.

### Was sind Ihre Zulassungskriterien? {#what-is-your-allowlist-criteria}

Wir verfügen über eine statische Liste mit [Domänennamenerweiterungen standardmäßig auf der Zulassungsliste](#what-domain-name-extensions-are-allowlisted-by-default) und pflegen außerdem eine dynamische, zwischengespeicherte, rollierende Zulassungsliste, die auf den folgenden strengen Kriterien basiert:

* Die Absender-Root-Domain muss [Domänennamenerweiterung, die mit der Liste übereinstimmt, die wir in unserem kostenlosen Plan anbieten](#what-domain-name-extensions-can-be-used-for-free) sein (zusätzlich zu `biz` und `info`). Teilübereinstimmungen mit `edu`, `gov` und `mil` werden ebenfalls berücksichtigt, z. B. `xyz.gov.au` und `xyz.edu.au`.
* Die Absender-Root-Domain muss zu den 100.000 besten Ergebnissen eindeutiger Root-Domains aus [Regenschirm-Popularitätsliste](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") („UPL“) gehören.
* Die Absender-Root-Domain muss zu den 50.000 besten Ergebnissen eindeutiger Root-Domains gehören, die in mindestens 4 der letzten 7 Tage in UPLs aufgetaucht sind (> 50 %).
* Die Absender-Stammdomäne darf von Cloudflare nicht als jugendgefährdender Inhalt oder Malware [kategorisiert](https://radar.cloudflare.com/categorization-feedback/) eingestuft werden.
* Für die Absender-Stammdomäne müssen entweder A- oder MX-Einträge festgelegt sein.
* Die Absender-Stammdomäne muss entweder A-Einträge, MX-Einträge, einen DMARC-Eintrag mit `p=reject` oder `p=quarantine` oder einen SPF-Eintrag mit dem Qualifizierer `-all` oder `~all` enthalten.

Wenn dieses Kriterium erfüllt ist, wird die Absender-Stammdomäne sieben Tage lang zwischengespeichert. Beachten Sie, dass unser automatisierter Job täglich ausgeführt wird. Es handelt sich daher um einen rollierenden Whitelist-Cache, der täglich aktualisiert wird.

Unser automatisierter Job lädt die UPLs der letzten 7 Tage aus dem Speicher herunter, entpackt sie und analysiert sie dann im Speicher gemäß den oben genannten strengen Kriterien.

Zum Zeitpunkt des Schreibens dieses Artikels beliebte Domänen wie Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify und mehr sind natürlich enthalten.

Wenn Sie ein Absender sind, der nicht auf unserer Positivliste steht, werden Sie beim ersten Senden einer E-Mail mit Ihrer FQDN-Stammdomäne oder IP-Adresse als [ratenbegrenzt](#do-you-have-rate-limiting) und [graue Liste](#do-you-have-a-greylist) gekennzeichnet. Beachten Sie, dass dies ein gängiges Verfahren ist und als E-Mail-Standard übernommen wurde. Die meisten E-Mail-Server-Clients versuchen einen erneuten Versuch, wenn sie einen Ratenlimit- oder Greylist-Fehler (z. B. einen Fehlerstatuscode der Stufe 421 oder 4xx) erhalten.

**Beachten Sie, dass bestimmte Absender wie `a@gmail.com`, `b@xyz.edu` und `c@gov.au` weiterhin [auf der Sperrliste](#do-you-have-a-denylist)** sein können (z. B. wenn wir Spam, Phishing oder Malware von diesen Absendern automatisch erkennen).

### Welche Domain-Namenserweiterungen können kostenlos verwendet werden {#what-domain-name-extensions-can-be-used-for-free}

Seit dem 31. März 2023 haben wir zum Schutz unserer Benutzer und Dienste eine neue allgemeine Spam-Regel in Kraft gesetzt.

Diese neue Regel erlaubt in unserem kostenlosen Plan nur die Verwendung der folgenden Domänennamenerweiterungen:

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
<li class="list-inline-item"><code class="notranslate">ba</code></li>
<li class="list-inline-item"><code class="notranslate">be</code></li>
<li class="list-inline-item"><code class="notranslate">br</code></li>
<li class="list-inline-item"><code class="notranslate">by</code></li>
<li class="list-inline-item"><code class="notranslate">ca</code></li>
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
<li class="list-inline-item"><code class="notranslate">Familie</code></li>
<li class="list-inline-item"><code class="notranslate">fi</code></li>
<li class="list-inline-item"><code class="notranslate">fm</code></li>
<li class="list-inline-item"><code class="notranslate">fr</code></li>
<li class="list-inline-item"><code class="notranslate">gg</code></li>
<li class="list-inline-item"><code class="notranslate">gl</code></li>
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
<li class="list-inline-item"><code class="notranslate">lv</code></li>
<li class="list-inline-item"><code class="notranslate">ly</code></li>
<li class="list-inline-item"><code class="notranslate">md</code></li>
<li class="list-inline-item"><code class="notranslate">me</code></li>
<li class="list-inline-item"><code class="notranslate">mn</code></li>
<li class="list-inline-item"><code class="notranslate">ms</code></li>
<li class="list-inline-item"><code class="notranslate">mu</code></li>
<li class="list-inline-item"><code class="notranslate">mx</code></li>
<li class="list-inline-item"><code class="notranslate">net</code></li>
<li class="list-inline-item"><code class="notranslate">ni</code></li>
<li class="list-inline-item"><code class="notranslate">nl</code></li>
<li class="list-inline-item"><code class="notranslate">nein</code></li>
<li class="list-inline-item"><code class="notranslate">nu</code></li>
<li class="list-inline-item"><code class="notranslate">nz</code></li>
<li class="list-inline-item"><code class="notranslate">org</code></li>
<li class="list-inline-item"><code class="notranslate">pl</code></li>
<li class="list-inline-item"><code class="notranslate">pr</code></li>
<li class="list-inline-item"><code class="notranslate">pt</code></li>
<li class="list-inline-item"><code class="notranslate">pw</code></li>
<li class="list-inline-item"><code class="notranslate">rs</code></li>
<li class="list-inline-item"><code class="notranslate">sc</code></li>
<li class="list-inline-item"><code class="notranslate">se</code></li>
<li class="list-inline-item"><code class="notranslate">sh</code></li>
<li class="list-inline-item"><code class="notranslate">si</code></li>
<li class="list-inline-item"><code class="notranslate">sm</code></li>
<li class="list-inline-item"><code class="notranslate">sr</code></li>
<li class="list-inline-item"><code class="notranslate">st</code></li>
<li class="list-inline-item"><code class="notranslate">tc</code></li>
<li class="list-inline-item"><code class="notranslate">tm</code></li>
<li class="list-inline-item"><code class="notranslate">to</code></li>
<li class="list-inline-item"><code class="notranslate">tv</code></li>
<li class="list-inline-item"><code class="notranslate">uk</code></li>
<li class="list-inline-item"><code class="notranslate">us</code></li>
<li class="list-inline-item"><code class="notranslate">uz</code></li>
<li class="list-inline-item"><code class="notranslate">vc</code></li>
<li class="list-inline-item"><code class="notranslate">vg</code></li>
<li class="list-inline-item"><code class="notranslate">vu</code></li>
<li class="list-inline-item"><code class="notranslate">ws</code></li>
<li class="list-inline-item"><code class="notranslate">xyz</code></li>
<li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>

### Haben Sie eine Greylist {#do-you-have-a-greylist}

Ja, wir verwenden eine sehr laxe [E-Mail-Greylisting](https://en.wikipedia.org/wiki/Greylisting_\(email\))-Richtlinie. Greylisting gilt nur für Absender, die nicht auf unserer Whitelist stehen, und bleibt 30 Tage lang in unserem Cache.

Für jeden neuen Absender speichern wir 30 Tage lang einen Schlüssel in unserer Redis-Datenbank. Der Wert entspricht der Ankunftszeit der ersten Anfrage. Anschließend lehnen wir die E-Mail mit dem Wiederholungsstatuscode 450 ab und lassen sie erst nach fünf Minuten durch.

Wenn sie ab dieser ersten Ankunftszeit erfolgreich 5 Minuten gewartet haben, werden ihre E-Mails akzeptiert und sie erhalten diesen Statuscode 450 nicht.

Der Schlüssel besteht entweder aus der FQDN-Stammdomäne oder der IP-Adresse des Absenders. Das bedeutet, dass jede Subdomäne, die die Greylist passiert, auch als Stammdomäne gilt und umgekehrt (das meinen wir mit einer „sehr laxen“ Richtlinie).

Wenn beispielsweise eine E-Mail von `test.example.com` eingeht, bevor wir eine E-Mail von `example.com` sehen, muss jede E-Mail von `test.example.com` und/oder `example.com` 5 Minuten ab dem Zeitpunkt der ersten Verbindung warten. Wir lassen nicht sowohl `test.example.com` als auch `example.com` jeweils 5 Minuten warten (unsere Greylisting-Richtlinie gilt auf der Ebene der Stammdomäne).

Beachten Sie, dass Greylisting für keinen Absender auf unserer [Zulassungsliste](#do-you-have-an-allowlist) gilt (zum Zeitpunkt der Erstellung dieses Artikels beispielsweise Meta, Amazon, Netflix, Google, Microsoft).

### Haben Sie eine Sperrliste? {#do-you-have-a-denylist}

Ja, wir betreiben unsere eigene Blockierungsliste und aktualisieren sie automatisch in Echtzeit und manuell auf Grundlage von erkanntem Spam und bösartigen Aktivitäten.

Wir ziehen außerdem stündlich alle IP-Adressen aus der UCEPROTECT Level 1-Sperrliste unter <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> und speisen sie mit einer Ablauffrist von 7 Tagen in unsere Sperrliste ein.

Absender, die sich in der Blockierungsliste befinden, erhalten einen Fehlercode 421 (weist den Absender an, es später noch einmal zu versuchen), wenn sie [sind nicht auf der Zulassungsliste](#do-you-have-an-allowlist).

Durch die Verwendung eines 421-Statuscodes anstelle eines 554-Statuscodes können potenzielle Fehlalarme in Echtzeit verringert werden und die Nachricht kann beim nächsten Versuch erfolgreich zugestellt werden.

**Dieser Ansatz unterscheidet sich von anderen E-Mail-Diensten**, bei denen die Aufnahme in eine Sperrliste einen dauerhaften Fehler verursacht. Es ist oft schwierig, Absender zu bitten, Nachrichten erneut zu versenden (insbesondere von großen Organisationen). Daher bietet dieser Ansatz dem Absender, Empfänger oder uns ab dem ersten E-Mail-Versuch etwa fünf Tage Zeit, um einzugreifen und das Problem zu beheben (durch die Entfernung aus der Sperrliste).

Alle Anfragen zur Entfernung von Denylisten werden von Administratoren in Echtzeit überwacht (z. B. damit wiederkehrende Fehlalarme von Administratoren dauerhaft auf die Whitelist gesetzt werden können).

Anfragen zur Entfernung von Denylisten können unter <https://forwardemail.net/denylist>. gestellt werden. Bei zahlenden Benutzern wird die Entfernung von Denylisten sofort bearbeitet, während bei nicht zahlenden Benutzern die Bearbeitung der Anfrage durch den Administrator warten muss.

Absender, bei denen Spam oder Viren erkannt werden, werden wie folgt zur Blockierungsliste hinzugefügt:

1. Der [anfänglicher Nachrichtenfingerabdruck](#how-do-you-determine-an-email-fingerprint) wird auf die graue Liste gesetzt, wenn Spam oder eine Blockliste eines vertrauenswürdigen Absenders erkannt wird (z. B. `gmail.com`, `microsoft.com`, `apple.com`).
* Wenn der Absender auf der Whitelist stand, bleibt die Nachricht 1 Stunde lang auf der grauen Liste.
* Wenn der Absender nicht auf der Whitelist stand, bleibt die Nachricht 6 Stunden lang auf der grauen Liste.
2. Wir analysieren die Blocklistenschlüssel anhand der Informationen von Absender und Nachricht. Für jeden dieser Schlüssel erstellen wir (sofern noch keiner vorhanden ist) einen Zähler, erhöhen ihn um 1 und speichern ihn 24 Stunden lang im Cache.
* Für Absender auf der Whitelist:
* Fügen Sie einen Schlüssel für die E-Mail-Adresse „MAIL FROM“ im Envelope hinzu, sofern diese SPF bestanden hat oder nicht und nicht [ein Postmaster-Benutzername](#what-are-postmaster-addresses) oder [ein No-Reply-Benutzername](#what-are-no-reply-addresses) war.
* Wenn der „From“-Header auf der Whitelist stand, fügen Sie einen Schlüssel für die E-Mail-Adresse im „From“-Header hinzu, sofern diese SPF bestanden oder DKIM bestanden und angepasst wurde.
* Wenn der „From“-Header nicht auf der Whitelist stand, fügen Sie einen Schlüssel für die E-Mail-Adresse im „From“-Header und deren analysierten Stammdomänennamen hinzu.
* Für Absender ohne Whitelist:
* Fügen Sie einen Schlüssel für die E-Mail-Adresse „MAIL FROM“ im Envelope hinzu, sofern diese SPF bestanden hat.
* Wenn der „From“-Header auf der Whitelist stand, fügen Sie einen Schlüssel für die E-Mail-Adresse im „From“-Header hinzu, sofern diese SPF bestanden oder DKIM bestanden und angepasst wurde.
* Falls der „Von“-Header nicht auf der Whitelist stand, fügen Sie einen Schlüssel für die E-Mail-Adresse des „Von“-Headers und deren analysierten Domänennamen hinzu.
* Fügen Sie einen Schlüssel für die Remote-IP-Adresse des Absenders hinzu.
* Fügen Sie einen Schlüssel für den vom Client aufgelösten Hostnamen durch Reverse-Lookup von der IP-Adresse des Absenders hinzu (falls vorhanden).
* Fügen Sie einen Schlüssel für die Stammdomäne des vom Client aufgelösten Hostnamens hinzu (falls vorhanden und falls dieser vom vom Client aufgelösten Hostnamen abweicht).
3. Erreicht der Zähler für einen nicht auf der Whitelist stehenden Absender und Schlüssel 5, wird der Schlüssel für 30 Tage auf die Blacklist gesetzt und eine E-Mail an unser Missbrauchsteam gesendet. Diese Zahlen können sich ändern und Aktualisierungen werden hier im Rahmen unserer Missbrauchsüberwachung angezeigt.
4. Erreicht der Zähler für einen auf der Whitelist stehenden Absender und Schlüssel 10, wird der Schlüssel für 7 Tage auf die Blacklist gesetzt und eine E-Mail an unser Missbrauchsteam gesendet. Diese Zahlen können sich ändern und Aktualisierungen werden hier im Rahmen unserer Missbrauchsüberwachung angezeigt.

> **HINWEIS:** In Kürze führen wir ein Reputationsmonitoring ein. Das Reputationsmonitoring berechnet stattdessen anhand eines prozentualen Schwellenwerts (im Gegensatz zu einem rudimentären Zähler, wie oben erwähnt) den Zeitpunkt, an dem ein Absender von der Sperrliste genommen wird.

### Haben Sie eine Ratenbegrenzung {#do-you-have-rate-limiting}

Die Senderratenbegrenzung erfolgt entweder durch die Stammdomäne, die aus einer umgekehrten PTR-Suche nach der IP-Adresse des Absenders analysiert wird – oder, falls dies kein Ergebnis liefert, wird einfach die IP-Adresse des Absenders verwendet. Beachten Sie, dass wir dies im Folgenden als `Sender` bezeichnen.

Unsere MX-Server haben tägliche Limits für eingehende E-Mails für [verschlüsselter IMAP-Speicher](/blog/docs/best-quantum-safe-encrypted-email-service):

* Anstatt eingehende E-Mails für einzelne Aliase (z. B. `you@yourdomain.com`) zu begrenzen, beschränken wir die Rate anhand des Domänennamens des Alias (z. B. `yourdomain.com`). Dadurch wird verhindert, dass `Senders` die Posteingänge aller Aliase Ihrer Domain gleichzeitig überflutet.
* Wir haben allgemeine Limits, die für alle `Senders` in unserem Service gelten, unabhängig vom Empfänger:
* `Senders`, die wir als vertrauenswürdige Quelle betrachten (z. B. `gmail.com`, `microsoft.com`, `apple.com`), dürfen maximal 100 GB pro Tag senden.
* `Senders` mit [auf die Positivliste gesetzt](#do-you-have-an-allowlist) sind auf das Senden von 10 GB pro Tag beschränkt.
* Alle anderen `Senders` sind auf das Senden von 1 GB und/oder 1000 Nachrichten pro Tag beschränkt.
* Wir haben ein spezifisches Limit pro `Sender` und `yourdomain.com` von 1 GB und/oder 1000 Nachrichten täglich.

Die MX-Server begrenzen außerdem die Weiterleitung von Nachrichten an einen oder mehrere Empfänger durch Ratenbegrenzung – dies gilt jedoch nur für `Senders`, nicht für [Zulassungsliste](#do-you-have-an-allowlist):

* Wir erlauben maximal 100 Verbindungen pro Stunde, pro `Sender` aufgelöster FQDN-Stammdomäne (oder) `Sender` Remote-IP-Adresse (falls kein Reverse-PTR verfügbar ist) und pro Umschlagempfänger. Wir speichern den Schlüssel zur Ratenbegrenzung als kryptografischen Hash in unserer Redis-Datenbank.

* Wenn Sie E-Mails über unser System senden, stellen Sie bitte sicher, dass Sie für alle Ihre IP-Adressen einen Reverse-PTR eingerichtet haben (andernfalls wird für jede eindeutige FQDN-Stammdomäne oder IP-Adresse, von der Sie senden, eine Geschwindigkeitsbeschränkung gelten).

* Beachten Sie, dass Sie keiner Ratenbeschränkung unterliegen, wenn Sie über ein beliebtes System wie Amazon SES senden, da Amazon SES (zum Zeitpunkt der Erstellung dieses Artikels) auf unserer Zulassungsliste steht.

* Wenn Sie von einer Domäne wie `test.abc.123.example.com` senden, wird die Ratenbegrenzung auf `example.com` angewendet. Viele Spammer nutzen Hunderte von Subdomänen, um gängige Spamfilter zu umgehen, die nur eindeutige Hostnamen und nicht eindeutige FQDN-Stammdomänen begrenzen.

* `Senders`, die das Ratenlimit überschreiten, werden mit einem 421-Fehler abgelehnt.

Unsere IMAP- und SMTP-Server begrenzen die Anzahl Ihrer Aliase auf maximal `60` gleichzeitige Verbindungen.

Unsere MX-Server beschränken [nicht auf der Whitelist](#do-you-have-an-allowlist)-Absender darauf, mehr als 10 gleichzeitige Verbindungen herzustellen (mit einem Cache-Ablauf von 3 Minuten für den Zähler, der unserem Socket-Timeout von 3 Minuten entspricht).

### Wie schützen Sie sich vor Backscatter {#how-do-you-protect-against-backscatter}

Fehlgeleitete Bounces oder Bounce-Spam (bekannt als „[Rückstreuung](https://en.wikipedia.org/wiki/Backscatter_\(email\))“) können zu einem negativen Ruf der Absender-IP-Adresse führen.

Wir ergreifen zwei Maßnahmen zum Schutz vor Rückstreuung. Diese werden in den folgenden Abschnitten [Verhindern Sie Bounces von bekannten MAIL FROM-Spammern](#prevent-bounces-from-known-mail-from-spammers) und [Verhindern Sie unnötige Rücksprünge, um vor Rückstreuung zu schützen](#prevent-unnecessary-bounces-to-protect-against-backscatter) ausführlich beschrieben.

### Bounces von bekannten MAIL FROM-Spammern verhindern {#prevent-bounces-from-known-mail-from-spammers}

Wir ziehen die Liste stündlich von [Backscatter.org](https://www.backscatterer.org/) (powered by [UCEPROTECT](https://www.uceprotect.net/)) unter <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> und speisen sie in unsere Redis-Datenbank ein (wir vergleichen die Unterschiede auch im Voraus, falls IPs entfernt wurden, die berücksichtigt werden müssen).

Wenn das Feld „MAIL FROM“ leer ist ODER (ohne Berücksichtigung der Groß-/Kleinschreibung) einem der [Postmaster-Adressen](#what-are-postmaster-addresses) (dem Teil vor dem @ in einer E-Mail) entspricht, prüfen wir, ob die IP des Absenders mit einer aus dieser Liste übereinstimmt.

Wenn die IP-Adresse des Absenders aufgeführt ist (und nicht in unserem [Zulassungsliste](#do-you-have-an-allowlist)), senden wir einen 554-Fehler mit der Meldung `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Wir werden benachrichtigt, wenn ein Absender sowohl auf der Backscatterer-Liste als auch auf unserer Whitelist steht, damit wir das Problem gegebenenfalls beheben können.

Die in diesem Abschnitt beschriebenen Techniken entsprechen der Empfehlung „SAFE MODE“ unter <https://www.backscatterer.org/?target=usage> – hier überprüfen wir die Absender-IP nur, wenn bestimmte Bedingungen bereits erfüllt sind.

### Verhindern Sie unnötige Bounces, um vor Backscatter zu schützen {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Bounces sind E-Mails, die darauf hinweisen, dass die E-Mail-Weiterleitung an den Empfänger vollständig fehlgeschlagen ist und kein erneuter Versuch zur Zustellung der E-Mail erfolgt.

Ein häufiger Grund für die Aufnahme in die Backscatterer-Liste sind fehlgeleitete Bounces oder Bounce-Spam. Daher müssen wir uns auf verschiedene Weise davor schützen:

1. Wir senden nur, wenn Statuscodefehler >= 500 auftreten (wenn der Versuch, E-Mails weiterzuleiten, fehlgeschlagen ist, z. B. antwortet Gmail mit einem Fehler der Stufe 500).

2. Wir versenden nur einmal (wir verwenden einen berechneten Bounce-Fingerprint-Schlüssel und speichern ihn im Cache, um Duplikate zu vermeiden). Der Bounce-Fingerprint ist ein Schlüssel, der den Nachrichtenfingerabdruck kombiniert mit einem Hash der Bounce-Adresse und ihrem Fehlercode darstellt. Weitere Informationen zur Berechnung des Nachrichtenfingerabdrucks finden Sie im Abschnitt [Fingerabdrücke](#how-do-you-determine-an-email-fingerprint). Erfolgreich gesendete Bounce-Fingerprints verfallen nach 7 Tagen in unserem Redis-Cache.

3. Wir senden nur, wenn MAIL FROM und/oder From nicht leer sind und kein [Postmaster-Benutzername](#what-are-postmaster-addresses) (den Teil vor dem @ in einer E-Mail) enthalten (ohne Berücksichtigung der Groß-/Kleinschreibung).

4. Wir senden nicht, wenn die ursprüngliche Nachricht einen der folgenden Header hatte (ohne Berücksichtigung der Groß- und Kleinschreibung):

* Header von `auto-submitted` mit einem Wert ungleich `no`.
* Header von `x-auto-response-suppress` mit einem Wert von `dr`, `autoreply`, `auto-reply`, `auto_reply` oder `all`
* Header von `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` oder `x-auto-respond` (unabhängig vom Wert).
* Header von `precedence` mit einem Wert von `bulk`, `autoreply`, `auto-reply`, `auto_reply` oder `list`.

5. Wir senden nicht, wenn die E-Mail-Adresse „MAIL FROM“ oder „From“ mit `+donotreply`, `-donotreply`, `+noreply` oder `-noreply` endet.

6. Wir senden nicht, wenn der Benutzernamenteil der Absender-E-Mail-Adresse `mdaemon` lautete und einen Header ohne Berücksichtigung der Groß-/Kleinschreibung von `X-MDDSN-Message` hatte.

7. Wir senden nicht, wenn es einen Groß-/Kleinschreibung nicht berücksichtigenden Header `content-type` oder `multipart/report` gab.

### Wie ermittelt man einen E-Mail-Fingerabdruck {#how-do-you-determine-an-email-fingerprint}

Der Fingerabdruck einer E-Mail wird verwendet, um die Einzigartigkeit einer E-Mail zu bestimmen und die Zustellung doppelter Nachrichten sowie den Versand von [doppelte Bounces](#prevent-unnecessary-bounces-to-protect-against-backscatter) zu verhindern.

Der Fingerabdruck wird aus der folgenden Liste berechnet:

* Vom Client aufgelöster FQDN-Hostname oder IP-Adresse
* `Message-ID` Header-Wert (falls vorhanden)
* `Date` Header-Wert (falls vorhanden)
* `From` Header-Wert (falls vorhanden)
* `To` Header-Wert (falls vorhanden)
* `Cc` Header-Wert (falls vorhanden)
* `Subject` Header-Wert (falls vorhanden)
* `Body` Wert (falls vorhanden)

### Kann ich E-Mails an andere Ports als 25 weiterleiten (z. B. wenn mein ISP Port 25 blockiert hat) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Ja, seit dem 5. Mai 2020 ist diese Funktion verfügbar. Derzeit ist sie domänenspezifisch und nicht aliasspezifisch. Sollten Sie eine aliasspezifische Funktion benötigen, kontaktieren Sie uns bitte und teilen Sie uns Ihre Anforderungen mit.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Erweiterter Datenschutz:
</strong>
<span>
Wenn Sie einen kostenpflichtigen Tarif (mit erweitertem Datenschutz) nutzen, gehen Sie bitte zu <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a>, klicken Sie neben Ihrer Domain auf „Einrichten“ und anschließend auf „Einstellungen“. Weitere Informationen zu kostenpflichtigen Tarifen finden Sie auf unserer Seite <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Preise</a>. Andernfalls folgen Sie den unten stehenden Anweisungen.
</span>
</div>

Wenn Sie den kostenlosen Tarif nutzen, fügen Sie einfach einen neuen DNS-<strong class="notranslate">TXT</strong>-Eintrag hinzu, wie unten gezeigt, ändern Sie jedoch den Port von 25 auf den Port Ihrer Wahl.

Wenn ich beispielsweise möchte, dass alle E-Mails, die an `example.com` gehen, an den SMTP-Port 1337 statt 25 des Alias-Empfängers weitergeleitet werden:

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
<td><em>"@", "." oder leer</em></td>
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
Das häufigste Szenario für die Einrichtung einer benutzerdefinierten Portweiterleitung ist, wenn Sie alle E-Mails, die an example.com gehen, an einen anderen Port als den SMTP-Standardport 25 weiterleiten möchten. Fügen Sie dazu einfach den folgenden <strong class="notranslate">TXT</strong> Catch-All-Eintrag hinzu.
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
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=example.com</code></td>
</tr>
</tbody>
</table>

### Unterstützt es das Pluszeichen + für Gmail-Aliase {#does-it-support-the-plus--symbol-for-gmail-aliases}

Ja, absolut.

### Unterstützt es Subdomains {#does-it-support-sub-domains}

Ja, absolut. Anstatt "@", "." oder ein Leerzeichen als Name/Host/Alias zu verwenden, verwenden Sie einfach den Subdomänennamen als Wert.

Wenn Sie möchten, dass `foo.example.com` E-Mails weiterleitet, geben Sie `foo` als Name/Host/Alias-Wert in Ihren DNS-Einstellungen ein (sowohl für MX- als auch für <strong class="notranslate">TXT</strong>-Einträge).

### Leitet dies die Header meiner E-Mail weiter? {#does-this-forward-my-emails-headers}

Ja, absolut.

### Ist dies gut getestet {#is-this-well-tested}

Ja, es verfügt über Tests, die mit [ava](https://github.com/avajs/ava) geschrieben wurden, und bietet auch Codeabdeckung.

### Leiten Sie SMTP-Antwortnachrichten und Codes weiter? {#do-you-pass-along-smtp-response-messages-and-codes}

Ja, absolut. Wenn Sie beispielsweise eine E-Mail an `hello@example.com` senden und diese für die Weiterleitung an `user@gmail.com` registriert ist, werden die SMTP-Antwortnachricht und der Code vom SMTP-Server „gmail.com“ zurückgegeben, anstatt vom Proxyserver unter „mx1.forwardemail.net“ oder „mx2.forwardemail.net“.

### Wie verhindern Sie Spammer und gewährleisten einen guten Ruf bei der E-Mail-Weiterleitung? {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Siehe unsere Abschnitte zu [Wie funktioniert Ihr E-Mail-Weiterleitungssystem](#how-does-your-email-forwarding-system-work), [Wie gehen Sie mit Problemen bei der E-Mail-Zustellung um?](#how-do-you-handle-email-delivery-issues) und [Wie gehen Sie mit der Sperrung Ihrer IP-Adressen um?](#how-do-you-handle-your-ip-addresses-becoming-blocked) oben.

### Wie führen Sie DNS-Lookups für Domänennamen durch? {#how-do-you-perform-dns-lookups-on-domain-names}

Wir haben ein Open-Source-Softwareprojekt :tangerine: [Mandarine](https://github.com/forwardemail/tangerine) erstellt und nutzen es für DNS-Suchen. Die verwendeten Standard-DNS-Server sind `1.1.1.1` und `1.0.0.1`. DNS-Abfragen erfolgen über [DNS über HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) („DoH“) auf Anwendungsebene.

:tangerine: [Mandarine](https://github.com/tangerine) verwendet [standardmäßig den datenschutzorientierten DNS-Dienst von CloudFlare für Verbraucher][cloudflare-dns].

## Konto und Abrechnung {#account-and-billing}

### Bieten Sie eine Geld-zurück-Garantie für kostenpflichtige Pläne an? {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Ja! Automatische Rückerstattungen erfolgen, wenn Sie Ihr Konto innerhalb von 30 Tagen nach Vertragsbeginn upgraden, downgraden oder kündigen. Dies gilt nur für Erstkunden.

### Wenn ich den Plan wechsle, berechnen Sie die Differenz anteilig und erstatten sie mir zurück? {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Bei einem Tarifwechsel berechnen wir die Differenz nicht anteilig und erstatten sie auch nicht zurück. Stattdessen rechnen wir die verbleibende Laufzeit ab dem Ablaufdatum Ihres bestehenden Tarifs in die nächsthöhere Laufzeit Ihres neuen Tarifs um (abgerundet auf Monate).

Beachten Sie: Wenn Sie innerhalb eines Zeitraums von 30 Tagen seit dem ersten Start eines kostenpflichtigen Plans ein Upgrade oder Downgrade zwischen kostenpflichtigen Plänen durchführen, erstatten wir Ihnen automatisch den vollen Betrag Ihres bestehenden Plans.

### Kann ich diesen E-Mail-Weiterleitungsdienst einfach als „Fallback“- oder „Fallover“-MX-Server verwenden? {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Nein, es wird nicht empfohlen, da Sie immer nur einen Mail-Exchange-Server gleichzeitig verwenden können. Fallbacks werden aufgrund von Prioritätsfehlkonfigurationen und der Nichtbeachtung der MX-Exchange-Prioritätsprüfung durch Mailserver in der Regel nie wiederholt.

### Kann ich bestimmte Aliase deaktivieren {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wichtig:
</strong>
<span>
Wenn Sie einen kostenpflichtigen Tarif nutzen, gehen Sie bitte zu <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase <i class="fa fa-angle-right"></i> Alias bearbeiten <i class="fa fa-angle-right"></i> Kontrollkästchen „Aktiv“ deaktivieren <i class="fa fa-angle-right"></i> Weiter.
</span>
</div>

Ja, bearbeiten Sie einfach Ihren DNS-<strong class="notranslate">TXT</strong>-Eintrag und stellen Sie dem Alias ein, zwei oder drei Ausrufezeichen voran (siehe unten).

Beachten Sie, dass Sie die Zuordnung „:“ beibehalten *sollten*, da diese erforderlich ist, falls Sie sich jemals dazu entscheiden, sie auszuschalten (und sie wird auch für den Import verwendet, wenn Sie auf einen unserer kostenpflichtigen Pläne upgraden).

**Für stille Ablehnung (für den Absender erscheint es so, als ob die Nachricht erfolgreich gesendet wurde, geht aber tatsächlich nirgendwo hin) (Statuscode `250`):** Wenn Sie einem Alias ein "!" (einzelnes Ausrufezeichen) voranstellen, wird an Absender, die versuchen, an diese Adresse zu senden, ein erfolgreicher Statuscode von `250` zurückgegeben, aber die E-Mails selbst gehen nirgendwo hin (z. B. ein Blackhole oder `/dev/null`).

**Für Soft Reject (Statuscode `421`):** Wenn Sie einem Alias ein „!!“ (doppeltes Ausrufezeichen) voranstellen, wird an Absender, die versuchen, an diese Adresse zu senden, der Soft-Error-Statuscode `421` zurückgegeben. Die E-Mails werden oft bis zu 5 Tage lang erneut versendet, bevor sie abgelehnt und zurückgewiesen werden.

**Bei endgültiger Ablehnung (Statuscode `550`):** Wenn Sie einem Alias ein „!!!“ (dreifaches Ausrufezeichen) voranstellen, wird an Absender, die versuchen, an diese Adresse zu senden, ein permanenter Fehlerstatuscode von `550` zurückgegeben und die E-Mails werden abgelehnt und zurückgeschickt.

Wenn ich beispielsweise möchte, dass alle E-Mails, die an `alias@example.com` gehen, nicht mehr an `user@gmail.com` weitergeleitet werden, sondern abgelehnt und zurückgesendet werden (verwenden Sie beispielsweise drei Ausrufezeichen):

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
<td><em>"@", "." oder leer</em></td>
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
Sie können die Adresse des weitergeleiteten Empfängers auch einfach in „nobody@forwardemail.net“ umschreiben. Dadurch wird die E-Mail wie im folgenden Beispiel an niemanden weitergeleitet.
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
<td><em>"@", "." oder leer</em></td>
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
Für erhöhte Sicherheit können Sie auch den Teil ":user@gmail.com" (oder ":nobody@forwardemail.net") entfernen und nur "!!!alias" belassen, wie im folgenden Beispiel.
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
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias</code></td>
</tr>
</tbody>
</table>

### Kann ich E-Mails an mehrere Empfänger weiterleiten? {#can-i-forward-emails-to-multiple-recipients}

Ja, absolut. Geben Sie einfach mehrere Empfänger in Ihren <strong class="notranslate">TXT</strong>-Datensätzen an.

Wenn ich beispielsweise möchte, dass eine E-Mail, die an `hello@example.com` geht, an `user+a@gmail.com` und `user+b@gmail.com` weitergeleitet wird, dann würde mein <strong class="notranslate">TXT</strong>-Eintrag folgendermaßen aussehen:

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
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code class="cursor-initial" data-original-title="" title="">forward-email=hallo:user+a@gmail.com,hallo:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Oder Sie können sie in zwei separaten Zeilen angeben, etwa so:

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
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Es liegt an Ihnen!

### Kann ich mehrere globale Catch-All-Empfänger haben? {#can-i-have-multiple-global-catch-all-recipients}

Ja, das ist möglich. Geben Sie einfach mehrere globale Catch-All-Empfänger in Ihren <strong class="notranslate">TXT</strong>-Datensätzen an.

Wenn ich beispielsweise möchte, dass jede E-Mail, die an `*@example.com` geht (das Sternchen bedeutet, dass es sich um ein Platzhalterzeichen bzw. Catch-All handelt), an `user+a@gmail.com` und `user+b@gmail.com` weitergeleitet wird, dann würde mein <strong class="notranslate">TXT</strong>-Eintrag folgendermaßen aussehen:

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
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Oder Sie können sie in zwei separaten Zeilen angeben, etwa so:

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
<td><em>"@", "." oder leer</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>@, "." oder leer</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Es liegt an Ihnen!

### Gibt es eine maximale Anzahl von E-Mail-Adressen, an die ich pro Alias weiterleiten kann? {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Ja, das Standardlimit liegt bei 10. Das bedeutet NICHT, dass Sie nur 10 Aliase für Ihren Domainnamen haben können. Sie können so viele Aliase haben, wie Sie möchten (unbegrenzt). Das bedeutet, dass Sie nur einen Alias an 10 eindeutige E-Mail-Adressen weiterleiten können. Sie könnten `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (von 1-10) haben – und alle E-Mails an `hello@example.com` werden an `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (von 1-10) weitergeleitet.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>
Benötigen Sie mehr als 10 Empfänger pro Alias? Senden Sie uns eine E-Mail und wir erhöhen gerne Ihr Kontolimit.
</span>
</div>

### Kann ich E-Mails rekursiv weiterleiten {#can-i-recursively-forward-emails}

Ja, das ist möglich. Sie müssen jedoch die maximale Anzahl einhalten. Wenn Sie `hello:linus@example.com` und `linus:user@gmail.com` haben, werden E-Mails an `hello@example.com` an `linus@example.com` und `user@gmail.com` weitergeleitet. Beachten Sie, dass ein Fehler auftritt, wenn Sie versuchen, E-Mails über die maximale Anzahl hinaus rekursiv weiterzuleiten.

### Können Leute meine E-Mail-Weiterleitung ohne meine Erlaubnis ab- oder anmelden? {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Wir verwenden die MX- und <strong class="notranslate">TXT</strong>-Eintragsprüfung. Wenn Sie die entsprechenden MX- und <strong class="notranslate">TXT</strong>-Einträge dieses Dienstes hinzufügen, sind Sie registriert. Wenn Sie sie entfernen, ist Ihre Registrierung beendet. Sie sind Eigentümer Ihrer Domain und verwalten Ihr DNS. Wenn also jemand Zugriff darauf hat, ist das ein Problem.

### Wie ist es kostenlos {#how-is-it-free}

Forward Email bietet eine kostenlose Stufe durch eine Kombination aus Open-Source-Entwicklung, effizienter Infrastruktur und optionalen kostenpflichtigen Plänen, die den Dienst unterstützen.

Unser kostenloses Kontingent wird unterstützt von:

1. **Open-Source-Entwicklung**: Unsere Codebasis ist Open Source, was Community-Beiträge und einen transparenten Betrieb ermöglicht.

2. **Effiziente Infrastruktur**: Wir haben unsere Systeme optimiert, um die E-Mail-Weiterleitung mit minimalem Ressourcenaufwand zu bewältigen.

3. **Kostenpflichtige Premium-Pläne**: Benutzer, die zusätzliche Funktionen wie SMTP-Senden, IMAP-Empfangen oder erweiterte Datenschutzoptionen benötigen, abonnieren unsere kostenpflichtigen Pläne.

4. **Angemessene Nutzungsbeschränkungen**: Die kostenlose Stufe verfügt über Richtlinien zur fairen Nutzung, um Missbrauch zu verhindern.

> \[!NOTE]
> We're committed to keeping basic email forwarding free while offering premium features for users with more advanced needs.

> \[!TIP]
> If you find our service valuable, consider upgrading to a paid plan to support ongoing development and maintenance.

### Was ist die maximale E-Mail-Größenbeschränkung? {#what-is-the-max-email-size-limit}

Wir verwenden standardmäßig eine Größenbeschränkung von 50 MB, einschließlich Inhalt, Kopfzeilen und Anhängen. Beachten Sie, dass Dienste wie Gmail und Outlook nur eine Größenbeschränkung von 25 MB zulassen. Wenn Sie beim Senden an Adressen dieser Anbieter diese Beschränkung überschreiten, erhalten Sie eine Fehlermeldung.

Wenn die Dateigrößenbeschränkung überschritten wird, wird ein Fehler mit dem entsprechenden Antwortcode zurückgegeben.

### Speichern Sie E-Mail-Protokolle? {#do-you-store-logs-of-emails}

Nein, wir schreiben nicht auf die Festplatte und speichern keine Protokolle – mit [Ausnahme von Fehlern](#do-you-store-error-logs) und [ausgehendes SMTP](#do-you-support-sending-email-with-smtp) (siehe unser [Datenschutzrichtlinie](/privacy)).

Alles wird im Speicher erledigt und [Unser Quellcode ist auf GitHub](https://github.com/forwardemail).

### Speichern Sie Fehlerprotokolle? {#do-you-store-error-logs}

**Ja. Sie können auf die Fehlerprotokolle unter [Mein Konto → Protokolle](/my-account/logs) oder [Mein Konto → Domänen](/my-account/domains) zugreifen.**

Ab Februar 2023 speichern wir Fehlerprotokolle für die SMTP-Antwortcodes `4xx` und `5xx` für einen Zeitraum von 7 Tagen – diese enthalten den SMTP-Fehler, den Umschlag und die E-Mail-Header (wir speichern weder den E-Mail-Text noch Anhänge).

Mithilfe von Fehlerprotokollen können Sie wichtige E-Mails auf fehlende E-Mails prüfen und Spam-Falschmeldungen für [Ihre Domänen](/my-account/domains) minimieren. Sie eignen sich außerdem hervorragend zum Debuggen von Problemen mit [E-Mail-Webhooks](#do-you-support-webhooks) (da die Fehlerprotokolle die Antwort des Webhook-Endpunkts enthalten).

Auf Fehlerprotokolle für [Ratenbegrenzung](#do-you-have-rate-limiting) und [Graue Liste](#do-you-have-a-greylist) kann nicht zugegriffen werden, da die Verbindung vorzeitig beendet wird (z. B. bevor die Befehle `RCPT TO` und `MAIL FROM` übertragen werden können).

Weitere Informationen finden Sie in unserem [Datenschutzrichtlinie](/privacy).

### Lesen Sie meine E-Mails? {#do-you-read-my-emails}

Nein, absolut nicht. Siehe unseren [Datenschutzrichtlinie](/privacy).

Viele andere E-Mail-Weiterleitungsdienste speichern Ihre E-Mails und könnten diese möglicherweise lesen. Es gibt keinen Grund, weitergeleitete E-Mails auf der Festplatte zu speichern – deshalb haben wir die erste Open-Source-Lösung entwickelt, die dies vollständig im Arbeitsspeicher erledigt.

Wir sind der Meinung, dass Sie ein Recht auf Privatsphäre haben sollten und respektieren dieses strikt. Der auf dem Server bereitgestellte Code trägt den Namen [Open-Source-Software auf GitHub](https://github.com/forwardemail), um Transparenz und Vertrauen zu schaffen.

### Kann ich mit dieser {#can-i-send-mail-as-in-gmail-with-this} in Gmail „E-Mails senden als“?

Ja! Seit dem 2. Oktober 2018 ist diese Funktion verfügbar. Siehe [So senden Sie E-Mails mit Gmail](#how-to-send-mail-as-using-gmail) oben!

Sie sollten den SPF-Eintrag für Gmail auch in Ihrem <strong class="notranslate">TXT</strong>-Eintrag der DNS-Konfiguration festlegen.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wichtig:
</strong>
<span>
Wenn Sie Gmail (z. B. „Send Mail As“) oder G Suite verwenden, müssen Sie <code>include:_spf.google.com</code> an Ihren SPF-<strong class="notranslate">TXT</strong>-Eintrag anhängen, zum Beispiel:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### Kann ich mit dieser {#can-i-send-mail-as-in-outlook-with-this} E-Mails in Outlook senden als

Ja! Seit dem 2. Oktober 2018 ist diese Funktion verfügbar. Sehen Sie sich einfach die beiden folgenden Links von Microsoft an:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Sie sollten den SPF-Eintrag für Outlook auch in Ihrem <strong class="notranslate">TXT</strong>-Eintrag der DNS-Konfiguration festlegen.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wichtig:
</strong>
<span>
Wenn Sie Microsoft Outlook oder Live.com verwenden, müssen Sie <code>include:spf.protection.outlook.com</code> an Ihren SPF-<strong class="notranslate">TXT</strong>-Eintrag anhängen, zum Beispiel:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

### Kann ich mit dieser {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this} E-Mails in Apple Mail und iCloud Mail senden als

Wenn Sie iCloud+-Abonnent sind, können Sie eine benutzerdefinierte Domäne verwenden. [Unser Service ist auch mit Apple Mail kompatibel](#apple-mail).

Weitere Informationen finden Sie unter <https://support.apple.com/en-us/102540>.

### Kann ich mit diesem {#can-i-forward-unlimited-emails-with-this} unbegrenzt E-Mails weiterleiten?

Ja, allerdings ist die Verbindungsrate für „relativ unbekannte“ Absender auf 100 Verbindungen pro Stunde pro Hostname oder IP begrenzt. Siehe den Abschnitt zu [Ratenbegrenzung](#do-you-have-rate-limiting) und [Greylisting](#do-you-have-a-greylist) oben.

Mit „relativ unbekannt“ meinen wir Absender, die nicht im [Zulassungsliste](#do-you-have-an-allowlist) erscheinen.

Wenn dieses Limit überschritten wird, senden wir einen 421-Antwortcode, der den Mailserver des Absenders anweist, es später noch einmal zu versuchen.

### Bieten Sie unbegrenzte Domains zu einem Preis an? {#do-you-offer-unlimited-domains-for-one-price}

Ja. Unabhängig von Ihrem Tarif zahlen Sie nur eine monatliche Gebühr – für alle Ihre Domains.

### Welche Zahlungsmethoden akzeptieren Sie? {#which-payment-methods-do-you-accept}

Forward Email akzeptiert die folgenden einmaligen oder monatlichen/vierteljährlichen/jährlichen Zahlungsmethoden:

1. **Kredit-/Debitkarten/Banküberweisungen**: Visa, Mastercard, American Express, Discover, JCB, Diners Club usw.
2. **PayPal**: Verknüpfen Sie Ihr PayPal-Konto für einfache Zahlungen.
3. **Kryptowährung**: Wir akzeptieren Zahlungen über Stripes Stablecoin-Zahlungen in den Netzwerken Ethereum, Polygon und Solana.

> \[!NOTE]
> We store limited payment information on our servers, which only includes payment identifiers and references to [Stripe](https://stripe.com/global) and [PayPal](https://www.paypal.com) transaction, customer, subscription, and payment ID's.

> \[!TIP]
> For maximum privacy, consider using cryptocurrency payments.

Alle Zahlungen werden sicher über Stripe oder PayPal abgewickelt. Ihre Zahlungsdaten werden niemals auf unseren Servern gespeichert.

## Zusätzliche Ressourcen {#additional-resources}

> \[!TIP]
> Our articles below are regularly updated with new guides, tips, and technical information. Check back often for the latest content.

* [Fallstudien und Entwicklerdokumentation](/blog/docs)
* [Ressourcen](/resources)
* [Anleitungen](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: __GESCHÜTZTE_URL_869__