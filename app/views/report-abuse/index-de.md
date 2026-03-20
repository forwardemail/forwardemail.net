# Missbrauch melden {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Missbrauch und Spam an Forward Email melden" class="rounded-lg" />


## Inhaltsverzeichnis {#table-of-contents}

* [Haftungsausschluss](#disclaimer)
* [Wie man einen Missbrauch meldet](#how-to-submit-an-abuse-report)
* [Für die Allgemeinheit](#for-the-general-public)
* [Für Strafverfolgungsbehörden](#for-law-enforcement)
  * [Welche Informationen verfügbar sind](#what-information-is-available)
  * [Welche Informationen nicht verfügbar sind](#what-information-is-not-available)
  * [Strafverfolgungsbehörden mit Sitz in den Vereinigten Staaten](#law-enforcement-based-in-the-united-states)
  * [Strafverfolgungsbehörden mit Sitz außerhalb der Vereinigten Staaten](#law-enforcement-based-outside-of-the-united-states)
  * [Notfallanfragen von Strafverfolgungsbehörden](#law-enforcement-emergency-requests)
  * [Anfragen von Strafverfolgungsbehörden können Kontobenachrichtigungen auslösen](#law-enforcement-requests-may-trigger-account-notices)
  * [Anfragen von Strafverfolgungsbehörden zur Informationssicherung](#law-enforcement-requests-to-preserve-information)
  * [Zustellung von Strafverfolgungsbehörden](#law-enforcement-serving-process)


## Haftungsausschluss {#disclaimer}

Bitte beachten Sie unsere [Nutzungsbedingungen](/terms), da diese für die gesamte Website gelten.


## Wie man einen Missbrauch meldet {#how-to-submit-an-abuse-report}

Wir prüfen Missbrauchsmeldungen und bearbeiten Informationsanfragen für die [Allgemeinheit](#for-the-general-public) und [Strafverfolgungsbehörden](#for-law-enforcement) fallweise per E-Mail.

Missbrauchsmeldungen und Informationsanfragen bezüglich Nutzer, E-Mails, IP-Adressen und/oder Domains werden im Folgenden zusammenfassend als „Account“ bezeichnet.

Unsere E-Mail-Adressen für Ihre Anfrage oder Meldung bezüglich Missbrauch sind: `support@forwardemail.net`, `abuse@forwardemail.net` und `security@forwardemail.net`.

Bitte senden Sie, wenn möglich, eine Kopie an alle diese E-Mail-Adressen und schicken Sie auch Erinnerungsemails, falls wir innerhalb von 24-48+ Stunden nicht antworten.

Lesen Sie die folgenden Abschnitte für weitere Informationen, die für Sie relevant sein könnten.


## Für die Allgemeinheit {#for-the-general-public}

<u>**Wenn Sie oder jemand anderes sich in unmittelbarer Gefahr befindet, kontaktieren Sie bitte sofort Polizei und Rettungsdienste.**</u>

<u>**Sie sollten professionelle rechtliche Beratung in Anspruch nehmen, um verlorenen Zugang zu Ihrem Account wiederzuerlangen oder um einen böswilligen Akteur zu stoppen.**</u>

Wenn Sie Opfer von Missbrauch durch einen Account sind, der unseren Dienst nutzt, senden Sie uns bitte Ihre Meldung per E-Mail an die oben genannte Adresse. Wenn Ihr Account von einem böswilligen Akteur übernommen wurde (z. B. Ihre Domain ist kürzlich abgelaufen, wurde von Dritten neu registriert und dann für Missbrauch verwendet), senden Sie uns bitte eine Meldung mit Ihren genauen Account-Informationen (z. B. Ihrem Domainnamen) an die oben genannte Adresse. Wir können helfen, den Account nach Validierung Ihres vorherigen Besitzes zu [shadow bannen](https://de.wikipedia.org/wiki/Shadow_Banning). Beachten Sie, dass wir keine Befugnis haben, Ihnen den Zugang zu Ihrem Account wiederherzustellen.

Ihr Rechtsvertreter kann Ihnen raten, Strafverfolgungsbehörden, den Account-Inhaber (z. B. den Registrar des Domainnamens; die Website, auf der Sie den Domainnamen registriert haben) zu kontaktieren und/oder Sie auf die [ICANN-Seite zu verlorenen Domains](https://www.icann.org/resources/pages/lost-domain-names) verweisen.


## Für Strafverfolgungsbehörden {#for-law-enforcement}

Für die Mehrheit der Anfragen ist unsere Fähigkeit zur Offenlegung von Informationen durch den [Electronic Communications Privacy Act](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://de.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701) ff. („ECPA“) geregelt. Der ECPA schreibt vor, dass wir bestimmte Nutzerinformationen nur als Reaktion auf spezifische rechtliche Anfragen, einschließlich Vorladungen, Gerichtsbeschlüssen und Durchsuchungsbefehlen, an Strafverfolgungsbehörden weitergeben.

Wenn Sie Mitglied einer Strafverfolgungsbehörde sind und Informationen zu einem Account anfordern, sollten Account-Informationen sowie Datum und Zeitbereich in Ihrer Anfrage enthalten sein. Wir können keine zu weit gefassten und/oder vagen Anfragen bearbeiten – dies dient dem Schutz der Daten und des Vertrauens unserer Nutzer und vor allem der Sicherheit ihrer Daten.
Wenn Ihre Anfrage uns auf eine Verletzung unserer [Nutzungsbedingungen](/terms) hinweist, werden wir diese gemäß unseren internen Best Practices zur Behandlung von Missbrauch bearbeiten – beachten Sie, dass dies in einigen Fällen zur Sperrung und/oder zum Bann des Kontos führen kann.

**Da wir kein Domain-Name-Registrar sind**, sollten Sie sich, wenn Sie historische DNS-Datensatzinformationen zu einem Domainnamen suchen, an den jeweiligen Domain-Name-Registrar wenden, der für die Domain zuständig ist. Dienste wie [Security Trails]() können historische Datensatzabfragen anbieten, aber spezifischere und genauere Informationen können vom Registrar bereitgestellt werden. Um zu ermitteln, wer der Domain-Name-Registrar und/oder die Eigentümer der DNS-Nameserver für eine Domain sind, können die Tools `dig` und `whois` nützlich sein (z. B. `whois example.com` oder `dig example.com ns`). Sie können feststellen, ob ein Konto bei unserem Dienst einen kostenpflichtigen oder kostenlosen Plan nutzt, indem Sie eine DNS-Datensatzabfrage durchführen (z. B. `dig example.com mx` und `dig example.com txt`). Wenn die MX-Datensätze keine Werte wie `mx1.forwardemail.net` und `mx2.forwardemail.net` zurückgeben, verwendet die Domain unseren Dienst nicht. Wenn die TXT-Datensätze eine Klartext-E-Mail-Adresse zurückgeben (z. B. `forward-email=user@example.com`), zeigt dies die Zieladresse der E-Mail-Weiterleitung für eine Domain an. Wenn stattdessen ein Wert wie `forward-email-site-verification=XXXXXXXXXX` zurückgegeben wird, bedeutet dies, dass ein kostenpflichtiger Plan vorliegt und die Weiterleitungskonfiguration in unserer Datenbank unter der ID `XXXXXXXXXX` gespeichert ist. Für weitere Informationen darüber, wie unser Dienst auf DNS-Ebene funktioniert, verweisen wir auf unsere [FAQ](/faq).

### Welche Informationen verfügbar sind {#what-information-is-available}

Bitte entnehmen Sie der Rubrik Datenschutzbestimmungen den Abschnitt [Gesammelte Informationen](/privacy#information-collected). Konten dürfen ihre Informationen gemäß den Datenschutz- und Aufbewahrungsgesetzen aus unserem System entfernen; siehe dazu den Abschnitt [Informationen entfernen](/privacy#information-removal) in unseren Datenschutzbestimmungen. Dies bedeutet, dass angeforderte Informationen zum Zeitpunkt der Anfrage aufgrund der Löschung des Kontos möglicherweise nicht verfügbar sind.

### Welche Informationen nicht verfügbar sind {#what-information-is-not-available}

Bitte entnehmen Sie der Rubrik Datenschutzbestimmungen den Abschnitt [Nicht gesammelte Informationen](/privacy#information-not-collected).

### Strafverfolgungsbehörden mit Sitz in den Vereinigten Staaten {#law-enforcement-based-in-the-united-states}

Mit Ausnahme von [Notfällen](#law-enforcement-emergency-requests) geben wir Kontoinformationen nur nach Erhalt einer gültigen Vorladung, eines ECPA US-Gerichtsbeschlusses und/oder eines Durchsuchungsbefehls weiter.

Wir können zusätzlich [ein Konto benachrichtigen](#law-enforcement-requests-may-trigger-account-notices) über eine Anfrage von Strafverfolgungsbehörden, sofern wir gesetzlich oder durch Gerichtsbeschluss nicht daran gehindert sind.

Wenn wir eine gültige Vorladung, einen ECPA-Gerichtsbeschluss und/oder einen Durchsuchungsbefehl erhalten, stellen wir relevante und verfügbare Informationen nach bestem Wissen und Gewissen bereit.

### Strafverfolgungsbehörden mit Sitz außerhalb der Vereinigten Staaten {#law-enforcement-based-outside-of-the-united-states}

Wir verlangen, dass Anfragen von Strafverfolgungsbehörden mit Sitz außerhalb der Vereinigten Staaten über eine der folgenden Möglichkeiten zugestellt werden:

* Ein Gericht der Vereinigten Staaten.
* Eine Vollzugsbehörde im Rahmen eines [bilateralen Rechtshilfeabkommens der Vereinigten Staaten](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT").
* Eine Anordnung einer ausländischen Regierung, die einem Exekutivabkommen unterliegt, das der Generalstaatsanwalt der Vereinigten Staaten gegenüber dem Kongress als den Anforderungen von [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523) entsprechend bestimmt und zertifiziert hat.

### Notfallanfragen von Strafverfolgungsbehörden {#law-enforcement-emergency-requests}

Soweit das Gesetz in den Vereinigten Staaten dies erlaubt (z. B. gemäß [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%2C%20if%20the%20provider%2C%20in%20good%20faith%2C%20believes%20that%20an%20emergency%20involving%20danger%20of%20death%20or%20serious%20physical%20injury%20to%20any%20person%20requires%20disclosure%20without%20delay%20of%20communications%20relating%20to%20the%20emergency%3B%20or) und [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Exceptions%20for%20Disclosure%20of%20Customer%20Records.%E2%80%94A%20provider%20described%20in%20subsection%20\(a\)%20may%20divulge%20a%20record%20or%20other%20information%20pertaining%20to%20a%20subscriber%20to%20or%20customer%20of%20such%20service%20\(not%20including%20the%20contents%20of%20communications%20covered%20by%20subsection%20\(a\)\(1\)%20or%20\(a\)\(2\)\)%E2%80%94)), können wir bei gutem Glauben und unabhängiger Überprüfung des Anfragenden Kontoinformationen an Strafverfolgungsbehörden ohne Vorladung, ECPA-Gerichtsbeschluss und/oder Durchsuchungsbefehl weitergeben, wenn wir glauben, dass dies ohne Verzögerung erforderlich ist, um Tod oder schwere körperliche Verletzungen zu verhindern.
Wir verlangen, dass Notfalldatenanfragen ("EDR") per E-Mail gesendet werden und alle relevanten Informationen enthalten, um einen zeitnahen und beschleunigten Prozess zu gewährleisten.

Beachten Sie, dass wir uns der ausgefeilten Spoofing-, Phishing- und Identitätsdiebstahl-Angriffe per E-Mail bewusst sind (z. B. siehe [diesen Artikel von The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Unsere Richtlinie zur Bearbeitung von EDRs lautet wie folgt:

1. Unabhängige Recherche der E-Mail-Header-Metadaten (z. B. DKIM/SPF/DMARC) (oder deren Fehlen) zur Verifizierung.

2. Unseren besten guten Glauben Versuch unternehmen (bei Bedarf mit wiederholten Versuchen), den Anfragenden telefonisch zu kontaktieren – um die Echtheit der Anfrage zu bestätigen. Zum Beispiel können wir die `.gov`-Website der zuständigen Behörde recherchieren und dann das Büro unter der öffentlich gelisteten offiziellen Telefonnummer anrufen, um die Anfrage zu verifizieren.

### Anfragen von Strafverfolgungsbehörden können Kontobenachrichtigungen auslösen {#law-enforcement-requests-may-trigger-account-notices}

Wir können ein Konto benachrichtigen und diesem eine Kopie einer Strafverfolgungsanfrage, die das Konto betrifft, zukommen lassen, sofern wir gesetzlich oder durch Gerichtsbeschluss nicht daran gehindert sind (z. B. [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). In diesen Fällen können wir, falls zutreffend, ein Konto benachrichtigen, wenn die Geheimhaltungsanordnung abgelaufen ist.

Wenn eine Anfrage von Strafverfolgungsbehörden gültig ist, werden wir [notwendige und angeforderte Kontoinformationen bewahren](#law-enforcement-requests-to-preserve-information) und uns bemühen, den Kontoinhaber über seine registrierte und verifizierte E-Mail-Adresse zu kontaktieren (z. B. innerhalb von 7 Kalendertagen). Wenn wir rechtzeitig einen Widerspruch erhalten (z. B. innerhalb von 7 Kalendertagen), werden wir die Weitergabe von Kontoinformationen zurückhalten und den rechtlichen Prozess nach Bedarf fortsetzen.

### Anfragen von Strafverfolgungsbehörden zur Datensicherung {#law-enforcement-requests-to-preserve-information}

Wir erfüllen gültige Anfragen von Strafverfolgungsbehörden zur Sicherung von Informationen bezüglich eines Kontos gemäß [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Beachten Sie, dass die Datensicherung nur auf das beschränkt ist, was spezifisch angefordert und derzeit verfügbar ist.

### Zustellung von Strafverfolgungsanfragen {#law-enforcement-serving-process}

Wir verlangen, dass alle gültigen Anfragen von Strafverfolgungsbehörden uns eine gültige und funktionierende E-Mail-Adresse bereitstellen, über die wir korrespondieren und angeforderte Informationen elektronisch übermitteln können.

Alle Anfragen sollten an die unter [Wie man einen Missbrauch meldet](#how-to-submit-an-abuse-report) angegebene E-Mail-Adresse gesendet werden.

Alle Anfragen von Strafverfolgungsbehörden müssen auf dem Briefkopf der Behörde oder Abteilung (z. B. als PDF-Scan-Anhang), von einer offiziellen und relevanten E-Mail-Adresse und unterschrieben eingereicht werden.

Wenn es sich um eine [Notfallanfrage](#law-enforcement-emergency-requests) handelt, schreiben Sie bitte „Emergency law enforcement request“ in die Betreffzeile der E-Mail.

Bitte beachten Sie, dass es mindestens zwei Wochen dauern kann, bis wir Ihre Anfrage prüfen und beantworten können.
