# Missbrauch melden {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Report abuse and spam to Forward Email" class="rounded-lg" />

## Inhaltsverzeichnis {#table-of-contents}

* [Haftungsausschluss](#disclaimer)
* [So reichen Sie einen Missbrauchsbericht ein](#how-to-submit-an-abuse-report)
* [Für die breite Öffentlichkeit](#for-the-general-public)
* [Für die Strafverfolgung](#for-law-enforcement)
  * [Welche Informationen sind verfügbar](#what-information-is-available)
  * [Welche Informationen sind nicht verfügbar](#what-information-is-not-available)
  * [Strafverfolgungsbehörden mit Sitz in den Vereinigten Staaten](#law-enforcement-based-in-the-united-states)
  * [Strafverfolgungsbehörden mit Sitz außerhalb der Vereinigten Staaten](#law-enforcement-based-outside-of-the-united-states)
  * [Dringende Anfragen der Strafverfolgungsbehörden](#law-enforcement-emergency-requests)
  * [Anfragen von Strafverfolgungsbehörden können Kontobenachrichtigungen auslösen](#law-enforcement-requests-may-trigger-account-notices)
  * [Anfragen von Strafverfolgungsbehörden zur Aufbewahrung von Informationen](#law-enforcement-requests-to-preserve-information)
  * [Zustellungsverfahren durch die Strafverfolgungsbehörden](#law-enforcement-serving-process)

## Haftungsausschluss {#disclaimer}

Bitte halten Sie sich an unseren [Bedingungen](/terms), da dieser für die gesamte Site gilt.

## So reichen Sie einen Missbrauchsbericht ein {#how-to-submit-an-abuse-report}

Wir prüfen Missbrauchsmeldungen und beantworten Informationsanfragen zu [Öffentlichkeit](#for-the-general-public) und [Strafverfolgung](#for-law-enforcement) von Fall zu Fall per E-Mail.

Missbrauchsmeldungen und Auskunftsanfragen zu Benutzern, E-Mails, IP-Adressen und/oder Domänen werden im Folgenden zusammenfassend als „Konto“ bezeichnet.

Unsere E-Mail-Adresse für Ihre Anfrage oder Meldung bezüglich Missbrauch lautet: `abuse@forwardemail.net`

Lesen Sie die folgenden Abschnitte, um weitere Informationen zu erhalten, die für Sie relevant sein könnten.

## Für die breite Öffentlichkeit {#for-the-general-public}

<u>**Wenn Sie oder jemand anderes in unmittelbarer Gefahr ist, kontaktieren Sie bitte sofort die Polizei und den Notdienst.**</u>

<u>**Sie sollten professionellen Rechtsbeistand einholen, um den verlorenen Zugriff auf Ihr Konto wiederzuerlangen oder einen böswilligen Akteur zu stoppen.**</u>

Wenn Sie Opfer eines Missbrauchs eines Kontos geworden sind, das unseren Service nutzt, senden Sie uns bitte Ihren Bericht per E-Mail an die oben genannte Adresse. Wenn Ihr Konto von einem böswilligen Akteur übernommen wurde (z. B. weil Ihre Domain kürzlich abgelaufen ist und von einem Dritten neu registriert und anschließend für Missbrauch verwendet wurde), senden Sie uns bitte einen Bericht mit Ihren genauen Kontoinformationen (z. B. Ihrem Domainnamen) an die oben genannte Adresse. Nach der Bestätigung Ihres vorherigen Kontoinhabers können wir Ihnen helfen, das Konto [Schattenverbot](https://en.wikipedia.org/wiki/Shadow_banning) wiederherzustellen. Beachten Sie, dass wir nicht befugt sind, Ihnen dabei zu helfen, den Zugriff auf Ihr Konto wiederherzustellen.

Ihr Rechtsvertreter empfiehlt Ihnen möglicherweise, sich an die Strafverfolgungsbehörden oder den Inhaber Ihres Kontos (z. B. den Registrar des Domänennamens, die Website, auf der Sie den Domänennamen registriert haben) zu wenden und/oder Sie an [ICANN-Seite zu verlorenen Domänen](https://www.icann.org/resources/pages/lost-domain-names) zu verweisen.

## Für Strafverfolgungsbehörden {#for-law-enforcement}

Bei den meisten Anfragen unterliegt unsere Befugnis zur Offenlegung von Informationen dem [Gesetz zum Schutz der Privatsphäre in der elektronischen Kommunikation](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701) usw. („ECPA“). Das ECPA schreibt vor, dass wir bestimmte Nutzerinformationen nur dann an Strafverfolgungsbehörden weitergeben dürfen, wenn bestimmte Arten von rechtlichen Anfragen vorliegen, darunter Vorladungen, Gerichtsbeschlüsse und Durchsuchungsbefehle.

Wenn Sie einer Strafverfolgungsbehörde angehören und Informationen zu einem Konto suchen, sollten Sie Ihrer Anfrage Kontoinformationen sowie Datum und Uhrzeit beifügen. Wir können keine zu weit gefassten und/oder vagen Anfragen bearbeiten. Dies dient dem Schutz der Daten und des Vertrauens unserer Nutzer und vor allem der Sicherheit ihrer Daten.

Wenn Ihre Anfrage für uns einen Verstoß gegen unseren [Bedingungen](/terms) signalisiert, verarbeiten wir ihn gemäß unseren ausschließlich intern geltenden Best Practices für den Umgang mit Missbrauch. Beachten Sie, dass dies in einigen Fällen zur Sperrung und/oder zum Verbot des Kontos führen kann.

**Da wir kein Domainnamen-Registrar sind**, sollten Sie sich, wenn Sie Informationen zu historischen DNS-Einträgen eines Domainnamens wünschen, an den entsprechenden Domainnamen-Registrar wenden. Dienste wie [Security Trails]() bieten möglicherweise eine Suche nach historischen Einträgen an, genauere und genauere Informationen erhalten Sie jedoch möglicherweise vom Registrar. Um den Domainnamen-Registrar und/oder die Inhaber der DNS-Nameserver einer Domain zu ermitteln, können die Tools `dig` und `whois` hilfreich sein (z. B. `whois example.com` oder `dig example.com ns`). Sie können feststellen, ob ein Konto einen kostenpflichtigen oder kostenlosen Tarif unseres Dienstes nutzt, indem Sie eine DNS-Eintragssuche durchführen (z. B. `dig example.com mx` und `dig example.com txt`). Wenn die MX-Einträge keine Werte wie `mx1.forwardemail.net` und `mx2.forwardemail.net` zurückgeben, nutzt die Domain unseren Service nicht. Wenn die TXT-Einträge eine Klartext-E-Mail-Adresse (z. B. `forward-email=user@example.com`) zurückgeben, deutet dies auf die Zieladresse der E-Mail-Weiterleitung für eine Domain hin. Wenn stattdessen ein Wert wie `forward-email-site-verification=XXXXXXXXXX` zurückgegeben wird, handelt es sich um einen kostenpflichtigen Tarif, und die Weiterleitungskonfiguration ist in unserer Datenbank unter der ID `whois`0 gespeichert. Weitere Informationen zur Funktionsweise unseres Dienstes auf DNS-Ebene finden Sie unter `whois`1.

### Welche Informationen sind verfügbar {#what-information-is-available}

Bitte beachten Sie unsere Datenschutzrichtlinie für [Erfasste Informationen](/privacy#information-collected). Konten dürfen ihre Informationen unter Einhaltung der Gesetze zur Vorratsdatenspeicherung und zum Datenschutz aus unserem System entfernen. Bitte beachten Sie unsere Datenschutzrichtlinie für [Entfernen von Informationen](/privacy#information-removal). Dies bedeutet, dass die angeforderten Informationen zum Zeitpunkt der Anfrage aufgrund der Kontolöschung möglicherweise nicht verfügbar sind.

### Welche Informationen sind nicht verfügbar {#what-information-is-not-available}

Bitte beachten Sie unseren Abschnitt zur Datenschutzrichtlinie für [Nicht erfasste Informationen](/privacy#information-not-collected).

### Strafverfolgungsbehörden mit Sitz in den Vereinigten Staaten {#law-enforcement-based-in-the-united-states}

Mit dem [Ausnahme von Notfällen](#law-enforcement-emergency-requests) geben wir Kontoinformationen nur nach Erhalt einer gültigen Vorladung, eines ECPA-Gerichtsbeschlusses der USA und/oder eines Durchsuchungsbefehls weiter.

Darüber hinaus können wir [ein Konto benachrichtigen](#law-enforcement-requests-may-trigger-account-notices) auf Anfrage einer Strafverfolgungsbehörde verarbeiten, sofern uns dies nicht durch Gesetz oder Gerichtsbeschluss untersagt ist.

Wenn wir eine gültige Vorladung, einen ECPA-Gerichtsbeschluss und/oder einen Durchsuchungsbefehl erhalten, werden wir nach bestem Wissen und Gewissen relevante und verfügbare Informationen bereitstellen.

### Strafverfolgungsbehörden mit Sitz außerhalb der Vereinigten Staaten {#law-enforcement-based-outside-of-the-united-states}

Wir verlangen, dass Anfragen an Strafverfolgungsbehörden mit Sitz außerhalb der Vereinigten Staaten auf eine der folgenden Arten zugestellt werden:

* Ein US-amerikanisches Gericht.
* Eine Vollstreckungsbehörde im Rahmen der Verfahren von [Vertrag über gegenseitige Rechtshilfe der Vereinigten Staaten](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) („MLAT“).
* Eine Anordnung einer ausländischen Regierung, die einem vom Generalstaatsanwalt der Vereinigten Staaten festgelegten und dem Kongress beglaubigten Durchführungsübereinkommen unterliegt, erfüllt die Anforderungen von [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Notfallanfragen der Strafverfolgungsbehörden {#law-enforcement-emergency-requests}

Soweit es das Gesetz in den Vereinigten Staaten erlaubt (z. B. gemäß [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\) an eine staatliche Stelle, wenn der Anbieter in gutem Glauben davon ausgeht, dass ein Notfall, der mit Todesgefahr oder einer schweren Körperverletzung einer Person verbunden ist, eine unverzügliche Offenlegung der Kommunikation im Zusammenhang mit dem Notfall erfordert, und [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Ausnahmen%20für%20die%20Offenlegung%20von%20Kundendatensätzen.%E2%80%94Ein%20in%20Unterabschnitt%20(a\)%20beschriebener%20Anbieter%20darf%20einen%20Datensatz%20oder%20andere%20Informationen%20in Bezug auf%20einen%20Abonnenten%20oder%20Kunden%20dieses%20Dienstes%20(ausgenommen%20die%20Inhalte%20der%20Kommunikation,%20die%20unter%20Unterabschnitt%20(a\)\(1\)%20oder%20(a\)\(2\)\)%E2%80%94)) preisgeben, wenn dies in gutem Glauben geschieht und eine unabhängige Überprüfung der Antragsteller – wir können Kontoinformationen ohne Vorladung, ECPA-Gerichtsbeschluss und/oder Durchsuchungsbefehl an Strafverfolgungsbehörden weitergeben, wenn wir der Ansicht sind, dass dies ohne Verzögerung erforderlich ist, um Todesfälle oder schwere körperliche Verletzungen zu verhindern.

Wir verlangen, dass Notfalldatenanfragen („EDR“) per E-Mail gesendet werden und alle relevanten Informationen enthalten, um eine zeitnahe und beschleunigte Bearbeitung zu gewährleisten.

Beachten Sie, dass uns die Möglichkeit ausgeklügelter Spoofing-, Phishing- und Identitätsbetrugsangriffe per E-Mail bekannt ist (siehe beispielsweise [dieser Artikel aus The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Unsere Richtlinien zur Bearbeitung von EDRs lauten wie folgt:

1. Untersuchen Sie zur Überprüfung selbstständig die Metadaten des E-Mail-Headers (z. B. DKIM/SPF/DMARC) (oder deren Fehlen).

2. Wir bemühen uns nach bestem Wissen und Gewissen (ggf. auch wiederholt) selbstständig telefonisch mit dem Anfragenden Kontakt aufzunehmen, um die Echtheit der Anfrage zu bestätigen. Beispielsweise können wir die Website `.gov` für den Rechtsraum, aus dem die Anfrage stammt, recherchieren und anschließend das Büro unter der öffentlich zugänglichen offiziellen Telefonnummer anrufen, um die Anfrage zu verifizieren.

### Anfragen von Strafverfolgungsbehörden können Kontobenachrichtigungen auslösen {#law-enforcement-requests-may-trigger-account-notices}

Wir können ein Konto benachrichtigen und ihm eine Kopie einer ihn betreffenden Strafverfolgungsanfrage zukommen lassen, sofern uns dies nicht gesetzlich oder per Gerichtsbeschluss untersagt ist (z. B. [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). In diesen Fällen können wir ein Konto gegebenenfalls benachrichtigen, wenn die Geheimhaltungsanordnung abgelaufen ist.

Wenn eine Auskunftsanfrage einer Strafverfolgungsbehörde berechtigt ist, werden wir [notwendige und angeforderte Kontoinformationen aufbewahren](#law-enforcement-requests-to-preserve-information) und uns im Rahmen des Zumutbaren bemühen, den Kontoinhaber über seine registrierte und verifizierte E-Mail-Adresse zu kontaktieren (z. B. innerhalb von sieben Kalendertagen). Erhalten wir einen rechtzeitigen Widerspruch (z. B. innerhalb von sieben Kalendertagen), geben wir die Kontoinformationen nicht weiter und setzen das Rechtsverfahren, falls erforderlich, fort.

### Anfragen von Strafverfolgungsbehörden zur Aufbewahrung von Informationen {#law-enforcement-requests-to-preserve-information}

Wir kommen berechtigten Anfragen von Strafverfolgungsbehörden zur Aufbewahrung von Kontoinformationen gemäß [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703) nach. Beachten Sie, dass die Aufbewahrung nur auf die ausdrücklich angeforderten und derzeit verfügbaren Daten beschränkt ist.

### Zustellungsverfahren durch die Strafverfolgungsbehörden {#law-enforcement-serving-process}

Wir verlangen, dass Sie uns bei allen gültigen Anfragen von Strafverfolgungsbehörden eine gültige und funktionierende E-Mail-Adresse mitteilen, mit der wir korrespondieren und der wir die angeforderten Informationen elektronisch übermitteln können.

Alle Anfragen sollten an die oben unter [So reichen Sie einen Missbrauchsbericht ein](#how-to-submit-an-abuse-report) angegebene E-Mail-Adresse gesendet werden.

Alle Anfragen von Strafverfolgungsbehörden müssen auf dem Briefkopf der Behörde oder Abteilung (z. B. als gescannter PDF-Anhang) von einer offiziellen und relevanten E-Mail-Adresse gesendet und unterzeichnet werden.

Handelt es sich um einen [Notfallanfrage](#law-enforcement-emergency-requests), schreiben Sie bitte „Notfallanfrage der Strafverfolgungsbehörden“ in die Betreffzeile der E-Mail.

Bitte beachten Sie, dass es mindestens zwei Wochen dauern kann, bis wir Ihre Anfrage prüfen und beantworten können.