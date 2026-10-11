# Forward Email Webmail-Anleitung {#forward-email-webmail-guide}

<p class="lead mt-3">
  <strong>TL;DR:</strong> Im <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">Webmail</a> lesen und senden Sie E-Mails. Im <a href="/my-account/domains">Web-Dashboard</a> richten Sie Domains, Aliase und Passwörter ein. Bei Webmail melden Sie sich mit einer Alias-Adresse und einem im Dashboard generierten Passwort an. Webmail ist kostenlos und <a href="/faq#do-you-offer-a-webmail-client">Open Source</a>, und dieselbe App läuft im Browser, auf dem Desktop, auf dem Smartphone und im Terminal.
</p>


## Inhaltsverzeichnis {#table-of-contents}

* [Wo Sie Webmail bekommen](#where-to-get-webmail)
* [Webmail und das Web-Dashboard](#webmail-and-the-web-dashboard)
* [Anmelden](#signing-in)
  * [Ein Alias-Passwort generieren](#generate-an-alias-password)
  * [Bei Webmail anmelden](#sign-in-to-webmail)
* [Mehrere Konten verwenden](#using-more-than-one-account)
  * [Als ein anderes angemeldetes Konto senden](#send-as-another-signed-in-account)
* [Von jeder Adresse Ihrer Domain senden](#send-from-any-address-on-your-domain)
  * [Schritt 1: Ein Catch-All-Passwort im Dashboard generieren](#step-1-generate-a-catch-all-password-in-the-dashboard)
  * [Schritt 2: Im Webmail speichern](#step-2-save-it-in-webmail)
  * [Schritt 3: Beim Verfassen die Adresse wählen](#step-3-pick-the-address-when-you-compose)
  * [Was Sie über das Senden mit Catch-All wissen sollten](#what-to-know-about-catch-all-sending)
* [Webmail-Einstellungen im Überblick](#webmail-settings-at-a-glance)
* [Datenschutz und App Lock](#privacy-and-app-lock)
* [Fehlerbehebung](#troubleshooting)


## Wo Sie Webmail bekommen {#where-to-get-webmail}

| Plattform                       | Wo                                                                                                                         |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Browser                         | <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a> (ohne Installation) |
| Desktop (macOS, Windows, Linux) | Unsere <a href="/download">Download-Seite</a>                                                                              |
| Mobil (Android, iOS)            | Unsere <a href="/download">Download-Seite</a>                                                                              |
| Terminal                        | Der Befehl `forwardemail`. Siehe [Haben Sie eine Terminal-App](/faq#do-you-have-a-terminal-app)                            |

Alle werden aus demselben Open-Source-Projekt gebaut, daher gilt alles in dieser Anleitung für jede Variante. Einstellungen und gespeicherte Passwörter werden auf jedem Gerät separat gespeichert, richten Sie sie also auf jedem Gerät ein, das Sie verwenden.


## Webmail und das Web-Dashboard {#webmail-and-the-web-dashboard}

Forward Email hat zwei getrennte Orte zum Anmelden, und sie verwenden unterschiedliche Zugangsdaten:

|                                | Web-Dashboard (forwardemail.net)                                                                               | Webmail (mail.forwardemail.net und die Apps)                                           |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Anmelden mit**               | E-Mail-Adresse und Passwort Ihres Forward Email-Kontos (plus 2FA oder ein Passkey)                             | Einer Alias-Adresse (z. B. `you@example.com`) und ihrem generierten Passwort           |
| **Verwendet für**              | Domains, DNS, Aliase, Abrechnung, Teammitglieder, Passwörter generieren, Erweiterte Einstellungen              | E-Mails lesen und senden, Ordner, Labels, Suche, Kalender, Kontakte, Filter            |
| **Hier erstellte Passwörter**  | Alias-Passwörter und Catch-All-Passwörter                                                                      | Keine. Webmail verwendet die Passwörter, die Sie im Dashboard erstellt haben           |

Eine typische Einrichtung sieht so aus:

1. Fügen Sie im Dashboard Ihre Domain hinzu und richten Sie DNS ein.
2. Erstellen Sie einen Alias mit aktiviertem IMAP-Speicher (zum Beispiel `you@example.com`).
3. Generieren Sie ein Passwort für diesen Alias.
4. Melden Sie sich mit diesem Alias und Passwort bei Webmail an.

Zum Senden von E-Mails muss für Ihre Domain außerdem ausgehendes SMTP unter <a href="/my-account/domains">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Erweiterte Einstellungen <i class="fa fa-angle-right"></i> Ausgehende SMTP-Konfiguration aktiviert sein, genau wie bei jedem anderen E-Mail-Client.


## Anmelden {#signing-in}

### Ein Alias-Passwort generieren {#generate-an-alias-password}

1. Gehen Sie zu <a href="/my-account/domains">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase.
2. Klicken Sie neben dem Alias auf **Passwort generieren**.
3. Kopieren Sie das Passwort. Es wird nur einmal angezeigt.

Das ist dasselbe Passwort, das Sie für IMAP, POP3, SMTP, CalDAV und CardDAV verwenden würden. Damit können Sie sich nicht beim Web-Dashboard anmelden.

### Bei Webmail anmelden {#sign-in-to-webmail}

Öffnen Sie Webmail und geben Sie die vollständige Alias-Adresse und das generierte Passwort ein. Wenn Sie sich zuerst nur umsehen möchten, probieren Sie die Demo auf dem Anmeldebildschirm aus.


## Mehrere Konten verwenden {#using-more-than-one-account}

Sie können sich bei mehreren Aliasen gleichzeitig anmelden, auch auf verschiedenen Domains. Wechseln Sie über das Kontomenü zwischen ihnen und verwalten Sie sie unter **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Your accounts**. Konten werden auf dem Gerät gespeichert, auf dem Sie sie hinzugefügt haben, und nicht synchronisiert.

### Als ein anderes angemeldetes Konto senden {#send-as-another-signed-in-account}

Beim Verfassen listet das Menü **From** jedes auf diesem Gerät angemeldete Konto auf. Wählen Sie eines aus, um als diese Adresse zu senden. Die Nachricht wird mit dem eigenen Passwort dieses Kontos gesendet, und die Kopie landet im Ordner „Gesendet“ dieses Kontos.


## Von jeder Adresse Ihrer Domain senden {#send-from-any-address-on-your-domain}

Wenn Ihnen eine Domain gehört, können Sie von jeder Adresse darauf senden, etwa `billing@example.com` oder `no-reply@example.com`, ohne für jede einen Alias zu erstellen und sich anzumelden. Dafür verwenden Sie ein **Catch-All-Passwort** für die Domain.

Sie melden sich bei Webmail **nicht** als Wildcard- oder Catch-All-Konto an, und es gibt keine Funktion, die Sie aktivieren müssen. Sie speichern das Catch-All-Passwort einmal in den Webmail-Einstellungen, danach können Sie im From-Menü jede beliebige Adresse dieser Domain eingeben.

### Schritt 1: Ein Catch-All-Passwort im Dashboard generieren {#step-1-generate-a-catch-all-password-in-the-dashboard}

1. Gehen Sie zu <a href="/my-account/domains">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> und wählen Sie Ihre Domain.
2. Öffnen Sie **Erweiterte Einstellungen** und suchen Sie **Catch-All-Passwörter**.
3. Klicken Sie auf **Passwort generieren**. Lassen Sie das Feld leer, um ein starkes Zufallspasswort zu erhalten, und fügen Sie bei Bedarf eine Beschreibung hinzu (zum Beispiel „Webmail auf meinem Laptop“).
4. Kopieren Sie das Passwort. Es wird nur einmal angezeigt.

Sie müssen Administrator der Domain sein, um diesen Bereich zu sehen. Über **Passwörter verwalten** an derselben Stelle können Sie Catch-All-Passwörter später ansehen oder löschen. Wenn Sie eines löschen, funktioniert es überall dort nicht mehr, wo es gespeichert ist.

### Schritt 2: Im Webmail speichern {#step-2-save-it-in-webmail}

1. Öffnen Sie im Webmail **Settings <i class="fa fa-angle-right"></i> General**.
2. Suchen Sie die Karte **Send from any address**, direkt unter **Your accounts**.
3. Klicken Sie auf **Add catch-all password**.
4. Geben Sie die Domain ein (zum Beispiel `example.com`) und fügen Sie das Catch-All-Passwort ein.
5. Klicken Sie auf **Save**. Sie sehen dann „You can now send from any address @example.com“.

Sie können Passwörter für beliebig viele Domains speichern. Um eines zu entfernen, klicken Sie auf das Papierkorb-Symbol daneben.

### Schritt 3: Beim Verfassen die Adresse wählen {#step-3-pick-the-address-when-you-compose}

1. Beginnen Sie eine neue Nachricht.
2. Öffnen Sie das Menü **From**. Unter Ihren angemeldeten Konten gibt es für jede gespeicherte Domain einen Eintrag: **Other address @example.com…**
3. Wählen Sie ihn aus. Die From-Zeile wird zu einem Textfeld mit `@example.com` dahinter.
4. Geben Sie den Teil vor dem @ ein (zum Beispiel `billing`) und senden Sie.

Entwürfe behalten die eingegebene Adresse, sodass ein gespeicherter Entwurf mit derselben Absenderadresse wieder geöffnet wird.

### Was Sie über das Senden mit Catch-All wissen sollten {#what-to-know-about-catch-all-sending}

* **Es kann nur senden.** Ein Catch-All-Passwort funktioniert nur zum Senden. Es kann kein Postfach öffnen, daher können Sie damit keine E-Mails für `billing@example.com` lesen. Um Antworten zu lesen, erstellen Sie einen Alias (oder einen Catch-All-Alias, der an Sie weiterleitet) für diese Adresse.
* **Gesendete Kopien gehen an das Konto, das Sie verwenden.** Eine als `billing@example.com` gesendete Nachricht wird im Ordner „Gesendet“ des Kontos abgelegt, von dem aus Sie sie verfasst haben.
* **Es funktioniert mit jedem Konto auf dem Gerät.** Das gespeicherte Passwort ist nicht an ein angemeldetes Konto gebunden. Jedes Konto auf diesem Gerät kann es verwenden.
* **Es bleibt auf diesem Gerät.** Das Passwort wird nur auf dem Gerät gespeichert, auf dem Sie es gespeichert haben. Es wird nicht synchronisiert, und die Gerätekopplung per QR-Code überträgt es nicht. Fügen Sie es auf jedem Gerät erneut hinzu.
* **App Lock schützt es.** Wenn App Lock aktiviert ist, wird das Passwort zusammen mit Ihren übrigen lokalen Daten verschlüsselt, und die Einträge **Other address** sind ausgeblendet, solange die App gesperrt ist.
* **Geplantes Senden ist nicht verfügbar** für Adressen, die mit einem Catch-All-Passwort gesendet werden, weil dieses Passwort eine geplante Nachricht weder zurücklesen noch abbrechen kann. Senden Sie sofort oder als ein angemeldetes Konto.
* **Ein falsches Passwort meldet Sie nicht ab.** Wenn das Catch-All-Passwort falsch ist oder im Dashboard gelöscht wurde, schlägt das Senden mit einer Fehlermeldung fehl, und Sie bleiben angemeldet.


## Webmail-Einstellungen im Überblick {#webmail-settings-at-a-glance}

| Bereich                | Was er umfasst                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| **General**            | Ihre Konten, von jeder Adresse senden (Catch-All-Passwörter), Benachrichtigungen, Speicher     |
| **Appearance**         | Design, Layout, Dichte, Standards für den Editor, Signatur, Schriftart, externe Links          |
| **Privacy & Security** | App Lock, PGP-Verschlüsselung, Datenschutzoptionen, Spam-Meldungen                             |
| **Folders & Labels**   | Spezialordner, Ihre Ordner, Labels                                                             |
| **Filters**            | E-Mail-Filter für den angemeldeten Alias                                                       |
| **Calendar**           | Wochenbeginn und Aufgaben                                                                      |
| **Search**             | Suchindizierung, Indexzustand, gespeicherte Suchen, Suchoperatoren                             |
| **Advanced**           | Postfachspeicher, lokaler Cache und Zurücksetzen der App                                       |
| **Keyboard Shortcuts** | Alle Tastenkürzel                                                                              |
| **About & Help**       | Version, Download der Desktop-App, Feedback und Links                                          |

Dinge, die zur Domain oder zum Alias selbst gehören, wie DNS, Weiterleitungsempfänger, Speicherlimits, Abwesenheitsnotizen, Catch-All-Passwörter und Spam-Prüfung, werden im <a href="/my-account/domains">Web-Dashboard</a> eingestellt.


## Datenschutz und App Lock {#privacy-and-app-lock}

Webmail speichert eine lokale Kopie Ihrer E-Mails, damit es schnell ist und offline funktioniert. **App Lock** (unter **Settings <i class="fa fa-angle-right"></i> Privacy & Security**) verschlüsselt diese lokalen Daten, Ihre Einstellungen und Ihre gespeicherten Passwörter auf dem Gerät und wird mit einem Passkey oder einer PIN entsperrt. E-Mails und Live-Updates gehen direkt zwischen der App und Forward Email, ohne Werbe- oder Tracking-Dienste dazwischen.


## Fehlerbehebung {#troubleshooting}

**„Can't send as <name@example.com>: sign in to that account on this device again, or save its domain's catch-all password in Settings.“**

Webmail hat auf diesem Gerät kein Passwort für diese Adresse. Melden Sie sich entweder bei diesem Alias an oder speichern Sie das Catch-All-Passwort der Domain unter **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Send from any address**. Wenn die App gesperrt ist, entsperren Sie sie zuerst.

**Der Eintrag „Other address“ fehlt im From-Menü.**

Prüfen Sie, ob Sie das Catch-All-Passwort auf diesem Gerät gespeichert haben und ob App Lock entsperrt ist.

**Das Senden von einer Catch-All-Adresse schlägt mit einem Authentifizierungsfehler fehl.**

Das Catch-All-Passwort wurde möglicherweise gelöscht oder falsch eingegeben. Generieren Sie im Dashboard ein neues, entfernen Sie dann das alte im Webmail und fügen Sie das neue hinzu.

**Mein Dashboard-Passwort funktioniert im Webmail nicht.**

Webmail benötigt ein Alias-Passwort, nicht Ihr Dashboard-Passwort. Siehe [Ein Alias-Passwort generieren](#generate-an-alias-password).

Kommen Sie immer noch nicht weiter? Lesen Sie unsere <a href="/faq">FAQ</a> oder <a href="/help">kontaktieren Sie uns</a>.
