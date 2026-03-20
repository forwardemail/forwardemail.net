# Datenverarbeitungsvereinbarung {#data-processing-agreement}

<!-- v1.0 from <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email Datenverarbeitungsvereinbarung" class="rounded-lg" />


## Inhaltsverzeichnis {#table-of-contents}

* [Wichtige Begriffe](#key-terms)
* [Änderungen der Vereinbarung](#changes-to-the-agreement)
* [1. Beziehungen zwischen Auftragsverarbeiter und Unterauftragsverarbeiter](#1-processor-and-subprocessor-relationships)
  * [1. Anbieter als Auftragsverarbeiter](#1-provider-as-processor)
  * [2. Anbieter als Unterauftragsverarbeiter](#2-provider-as-subprocessor)
* [2. Verarbeitung](#2-processing)
  * [1. Verarbeitungsdetails](#1-processing-details)
  * [2. Verarbeitungsanweisungen](#2-processing-instructions)
  * [3. Verarbeitung durch den Anbieter](#3-processing-by-provider)
  * [4. Verarbeitung durch den Kunden](#4-customer-processing)
  * [5. Einwilligung zur Verarbeitung](#5-consent-to-processing)
  * [6. Unterauftragsverarbeiter](#6-subprocessors)
* [3. Eingeschränkte Übermittlungen](#3-restricted-transfers)
  * [1. Autorisierung](#1-authorization)
  * [2. Übermittlungen außerhalb des EWR](#2-ex-eea-transfers)
  * [3. Übermittlungen außerhalb des Vereinigten Königreichs](#3-ex-uk-transfers)
  * [4. Andere internationale Übermittlungen](#4-other-international-transfers)
* [4. Reaktion auf Sicherheitsvorfälle](#4-security-incident-response)
* [5. Prüfung & Berichte](#5-audit--reports)
  * [1. Prüfungsrechte](#1-audit-rights)
  * [2. Sicherheitsberichte](#2-security-reports)
  * [3. Sicherheits-Due-Diligence](#3-security-due-diligence)
* [6. Koordination & Zusammenarbeit](#6-coordination--cooperation)
  * [1. Reaktion auf Anfragen](#1-response-to-inquiries)
  * [2. Datenschutz-Folgenabschätzungen (DPIAs) und Datenschutz-Technische Bewertungen (DTIAs)](#2-dpias-and-dtias)
* [7. Löschung von personenbezogenen Kundendaten](#7-deletion-of-customer-personal-data)
  * [1. Löschung durch den Kunden](#1-deletion-by-customer)
  * [2. Löschung bei Ablauf der DPA](#2-deletion-at-dpa-expiration)
* [8. Haftungsbeschränkung](#8-limitation-of-liability)
  * [1. Haftungsobergrenzen und Verzicht auf Schadensersatz](#1-liability-caps-and-damages-waiver)
  * [2. Ansprüche Dritter](#2-related-party-claims)
  * [3. Ausnahmen](#3-exceptions)
* [9. Konflikte zwischen Dokumenten](#9-conflicts-between-documents)
* [10. Vertragslaufzeit](#10-term-of-agreement)
* [11. Anwendbares Recht und Gerichtsstand](#11-governing-law-and-chosen-courts)
* [12. Dienstleisterbeziehung](#12-service-provider-relationship)
* [13. Definitionen](#13-definitions)
* [Credits](#credits)


## Wichtige Begriffe {#key-terms}

| Begriff                                    | Wert                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Vereinbarung</strong>               | Diese DPA ergänzt die [Nutzungsbedingungen](/terms)                                                                                                                                                                                                                                                                                                                                                                                                                                |
| <strong>Genehmigte Unterauftragsverarbeiter</strong> | [Cloudflare](https://cloudflare.com) (USA; DNS-, Netzwerk- und Sicherheitsanbieter), [DataPacket](https://www.datapacket.com/) (USA/UK; Hosting-Anbieter), [Digital Ocean](https://digitalocean.com) (USA; Hosting-Anbieter), [GitHub](https://github.com) (USA; Quellcode-Hosting, CI/CD und Projektmanagement), [Vultr](https://www.vultr.com) (USA; Hosting-Anbieter), [Stripe](https://stripe.com) (USA; Zahlungsabwickler), [PayPal](https://paypal.com) (USA; Zahlungsabwickler) |
| <strong>Kontakt für Sicherheit beim Anbieter</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a>                                                                                                                                                                                                                                                                                                                                                                                                         |
| <strong>Sicherheitsrichtlinie</strong>     | Siehe [unsere Sicherheitsrichtlinie auf GitHub](https://github.com/forwardemail/forwardemail.net/security/policy)                                                                                                                                                                                                                                                                                                                                                                 |
| <strong>Geltender Staat</strong>            | Der Bundesstaat Delaware, Vereinigte Staaten                                                                                                                                                                                                                                                                                                                                                                                                                                       |
## Änderungen der Vereinbarung {#changes-to-the-agreement}

Dieses Dokument ist eine Ableitung der [Common Paper DPA Standard Terms (Version 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) und folgende Änderungen wurden vorgenommen:

1. [Anwendbares Recht und Gerichtsstand](#11-governing-law-and-chosen-courts) wurde als nachfolgender Abschnitt aufgenommen, wobei der `Governing State` oben angegeben ist.
2. [Beziehung zum Dienstleister](#12-service-provider-relationship) wurde als nachfolgender Abschnitt aufgenommen.


## 1. Beziehungen zwischen Auftragsverarbeiter und Unterauftragsverarbeiter {#1-processor-and-subprocessor-relationships}

### 1. Anbieter als Auftragsverarbeiter {#1-provider-as-processor}

In Fällen, in denen <strong>Kunde</strong> Verantwortlicher der Kundendaten ist, gilt <strong>Anbieter</strong> als Auftragsverarbeiter, der personenbezogene Daten im Auftrag des <strong>Kunden</strong> verarbeitet.

### 2. Anbieter als Unterauftragsverarbeiter {#2-provider-as-subprocessor}

In Fällen, in denen <strong>Kunde</strong> Auftragsverarbeiter der Kundendaten ist, gilt <strong>Anbieter</strong> als Unterauftragsverarbeiter der Kundendaten.


## 2. Verarbeitung {#2-processing}

### 1. Verarbeitungsdetails {#1-processing-details}

Anhang I(B) auf der Titelseite beschreibt den Gegenstand, die Art, den Zweck und die Dauer dieser Verarbeitung sowie die <strong>Kategorien personenbezogener Daten</strong> und die <strong>Kategorien betroffener Personen</strong>.

### 2. Verarbeitungsanweisungen {#2-processing-instructions}

<strong>Kunde</strong> weist <strong>Anbieter</strong> an, Kundendaten zu verarbeiten: (a) zur Bereitstellung und Wartung des Dienstes; (b) wie möglicherweise weiter spezifiziert durch die Nutzung des Dienstes durch den <strong>Kunden</strong>; (c) wie im <strong>Vertrag</strong> dokumentiert; und (d) wie in sonstigen schriftlichen Anweisungen des <strong>Kunden</strong> zur Verarbeitung von Kundendaten unter dieser DPA dokumentiert und vom <strong>Anbieter</strong> bestätigt. <strong>Anbieter</strong> wird diese Anweisungen befolgen, es sei denn, dies ist durch geltendes Recht untersagt. <strong>Anbieter</strong> wird <strong>Kunde</strong> unverzüglich informieren, wenn er die Verarbeitungsanweisungen nicht befolgen kann. <strong>Kunde</strong> hat Anweisungen gegeben und wird nur solche geben, die mit geltendem Recht übereinstimmen.

### 3. Verarbeitung durch Anbieter {#3-processing-by-provider}

<strong>Anbieter</strong> wird Kundendaten nur gemäß dieser DPA verarbeiten, einschließlich der Angaben auf der Titelseite. Wenn <strong>Anbieter</strong> den Dienst aktualisiert, um bestehende oder neue Produkte, Funktionen oder Funktionalitäten einzuführen, kann <strong>Anbieter</strong> die <strong>Kategorien betroffener Personen</strong>, <strong>Kategorien personenbezogener Daten</strong>, <strong>besondere Kategorien von Daten</strong>, <strong>Einschränkungen oder Schutzmaßnahmen für besondere Kategorien von Daten</strong>, <strong>Häufigkeit der Übermittlung</strong>, <strong>Art und Zweck der Verarbeitung</strong> sowie <strong>Dauer der Verarbeitung</strong> nach Bedarf anpassen, um die Aktualisierungen widerzuspiegeln, indem <strong>Kunde</strong> über die Aktualisierungen und Änderungen informiert wird.

### 4. Verarbeitung durch Kunde {#4-customer-processing}

Wenn <strong>Kunde</strong> Auftragsverarbeiter und <strong>Anbieter</strong> Unterauftragsverarbeiter ist, wird <strong>Kunde</strong> alle geltenden Gesetze einhalten, die für die Verarbeitung von Kundendaten durch <strong>Kunde</strong> gelten. Die Vereinbarung des <strong>Kunden</strong> mit seinem Verantwortlichen wird ebenfalls verlangen, dass <strong>Kunde</strong> alle geltenden Gesetze einhält, die für <strong>Kunde</strong> als Auftragsverarbeiter gelten. Darüber hinaus wird <strong>Kunde</strong> die Anforderungen an Unterauftragsverarbeiter in der Vereinbarung mit seinem Verantwortlichen einhalten.

### 5. Einwilligung zur Verarbeitung {#5-consent-to-processing}

<strong>Kunde</strong> hat alle geltenden Datenschutzgesetze im Zusammenhang mit der Bereitstellung von Kundendaten an <strong>Anbieter</strong> und/oder den Dienst eingehalten und wird dies weiterhin tun, einschließlich aller Offenlegungen, Einholung aller Einwilligungen, Bereitstellung angemessener Wahlmöglichkeiten und Umsetzung relevanter Schutzmaßnahmen, die nach geltendem Datenschutzrecht erforderlich sind.
### 6. Subprozessoren {#6-subprocessors}

a. <strong>Provider</strong> wird keine Kundendaten an einen Subprozessor bereitstellen, übertragen oder übergeben, es sei denn, <strong>Kunde</strong> hat den Subprozessor genehmigt. Die aktuelle Liste der <strong>Genehmigten Subprozessoren</strong> enthält die Identitäten der Subprozessoren, deren Standortland und die voraussichtlichen Verarbeitungstätigkeiten. <strong>Provider</strong> wird <strong>Kunde</strong> mindestens 10 Werktage im Voraus und schriftlich über beabsichtigte Änderungen der <strong>Genehmigten Subprozessoren</strong> informieren, sei es durch Hinzufügung oder Ersatz eines Subprozessors, sodass <strong>Kunde</strong> genügend Zeit hat, den Änderungen zu widersprechen, bevor <strong>Provider</strong> den neuen Subprozessor(en) nutzt. <strong>Provider</strong> wird <strong>Kunde</strong> die notwendigen Informationen zur Verfügung stellen, damit <strong>Kunde</strong> sein Recht ausüben kann, der Änderung der <strong>Genehmigten Subprozessoren</strong> zu widersprechen. <strong>Kunde</strong> hat 30 Tage nach Mitteilung einer Änderung der <strong>Genehmigten Subprozessoren</strong> Zeit, Widerspruch einzulegen, andernfalls gilt die Änderung als akzeptiert. Wenn <strong>Kunde</strong> innerhalb von 30 Tagen nach Mitteilung Widerspruch einlegt, werden <strong>Kunde</strong> und <strong>Provider</strong> in gutem Glauben zusammenarbeiten, um den Widerspruch oder die Bedenken von <strong>Kunde</strong> zu klären.

b. Bei der Beauftragung eines Subprozessors wird <strong>Provider</strong> eine schriftliche Vereinbarung mit dem Subprozessor abschließen, die sicherstellt, dass der Subprozessor nur auf Kundendaten zugreift und diese nur (i) im erforderlichen Umfang zur Erfüllung der an ihn vergebenen Verpflichtungen nutzt und (ii) im Einklang mit den Bedingungen der <strong>Vereinbarung</strong>.

c. Wenn die DSGVO auf die Verarbeitung von Kundendaten anwendbar ist, (i) gelten die in diesem DPA beschriebenen Datenschutzpflichten (wie in Artikel 28 Absatz 3 der DSGVO genannt, falls zutreffend) auch für den Subprozessor, und (ii) wird die Vereinbarung von <strong>Provider</strong> mit dem Subprozessor diese Pflichten einbeziehen, einschließlich Details darüber, wie <strong>Provider</strong> und sein Subprozessor bei Anfragen oder Anforderungen bezüglich der Verarbeitung von Kundendaten zusammenarbeiten. Darüber hinaus wird <strong>Provider</strong> auf Anfrage von <strong>Kunde</strong> eine Kopie seiner Vereinbarungen (einschließlich etwaiger Änderungen) mit seinen Subprozessoren bereitstellen. Soweit erforderlich zum Schutz von Geschäftsgeheimnissen oder anderen vertraulichen Informationen, einschließlich personenbezogener Daten, kann <strong>Provider</strong> den Text seiner Vereinbarung mit dem Subprozessor vor der Weitergabe schwärzen.

d. <strong>Provider</strong> bleibt voll verantwortlich für alle an seine Subprozessoren vergebenen Verpflichtungen, einschließlich der Handlungen und Unterlassungen seiner Subprozessoren bei der Verarbeitung von Kundendaten. <strong>Provider</strong> wird <strong>Kunde</strong> über jegliches Versäumnis seiner Subprozessoren informieren, eine wesentliche Verpflichtung bezüglich der Kundendaten aus der Vereinbarung zwischen <strong>Provider</strong> und dem Subprozessor zu erfüllen.


## 3. Eingeschränkte Übermittlungen {#3-restricted-transfers}

### 1. Genehmigung {#1-authorization}

<strong>Kunde</strong> stimmt zu, dass <strong>Provider</strong> Kundendaten außerhalb des EWR, des Vereinigten Königreichs oder eines anderen relevanten geografischen Gebiets übertragen darf, soweit dies zur Erbringung der Dienstleistung erforderlich ist. Überträgt <strong>Provider</strong> Kundendaten in ein Gebiet, für das die Europäische Kommission oder eine andere zuständige Aufsichtsbehörde keine Angemessenheitsentscheidung erlassen hat, wird <strong>Provider</strong> geeignete Schutzmaßnahmen für die Übermittlung der Kundendaten in dieses Gebiet gemäß den geltenden Datenschutzgesetzen umsetzen.

### 2. Übermittlungen außerhalb des EWR {#2-ex-eea-transfers}

<strong>Kunde</strong> und <strong>Provider</strong> sind sich einig, dass, wenn die DSGVO die Übermittlung von Kundendaten schützt, die Übermittlung von <strong>Kunde</strong> aus dem EWR an <strong>Provider</strong> außerhalb des EWR erfolgt und die Übermittlung nicht durch eine Angemessenheitsentscheidung der Europäischen Kommission geregelt ist, durch den Abschluss dieses DPA <strong>Kunde</strong> und <strong>Provider</strong> als unterzeichnete die EWR-Standardvertragsklauseln (EEA SCCs) und deren Anhänge, die durch Verweis einbezogen sind. Jede solche Übermittlung erfolgt gemäß den EWR SCCs, die wie folgt ausgefüllt werden:
a. Modul Zwei (Verantwortlicher zum Auftragsverarbeiter) der EWR-Standardvertragsklauseln (SCCs) gilt, wenn der <strong>Kunde</strong> ein Verantwortlicher ist und der <strong>Provider</strong> personenbezogene Daten des Kunden im Auftrag des <strong>Kunden</strong> als Auftragsverarbeiter verarbeitet.

b. Modul Drei (Auftragsverarbeiter zum Unterauftragsverarbeiter) der EWR-SCCs gilt, wenn der <strong>Kunde</strong> ein Auftragsverarbeiter ist und der <strong>Provider</strong> personenbezogene Daten des Kunden im Auftrag des <strong>Kunden</strong> als Unterauftragsverarbeiter verarbeitet.

c. Für jedes Modul gilt Folgendes (sofern anwendbar):

1. Die optionale Andockklausel in Klausel 7 findet keine Anwendung;

2. In Klausel 9 gilt Option 2 (allgemeine schriftliche Genehmigung), und die Mindestfrist für die vorherige Mitteilung von Änderungen bei Unterauftragsverarbeitern beträgt 10 Werktage;

3. In Klausel 11 gilt die optionale Sprache nicht;

4. Alle eckigen Klammern in Klausel 13 werden entfernt;

5. In Klausel 17 (Option 1) unterliegen die EWR-SCCs dem Recht des <strong>geltenden Mitgliedstaats</strong>;

6. In Klausel 18(b) werden Streitigkeiten vor den Gerichten des <strong>geltenden Mitgliedstaats</strong> beigelegt; und

7. Die Titelseite dieses DPA enthält die in Anhang I, Anhang II und Anhang III der EWR-SCCs erforderlichen Informationen.

### 3. Ex-UK-Übermittlungen {#3-ex-uk-transfers}

<strong>Kunde</strong> und <strong>Provider</strong> vereinbaren, dass, wenn die UK GDPR die Übermittlung personenbezogener Daten des Kunden schützt, die Übermittlung vom <strong>Kunden</strong> innerhalb des Vereinigten Königreichs an den <strong>Provider</strong> außerhalb des Vereinigten Königreichs erfolgt und die Übermittlung nicht durch eine Angemessenheitsentscheidung des britischen Staatssekretärs geregelt wird, durch den Abschluss dieses DPA der <strong>Kunde</strong> und der <strong>Provider</strong> als unterzeichnete UK-Zusatzvereinbarung und deren Anhänge gelten, die durch Verweis einbezogen sind. Jede solche Übermittlung erfolgt gemäß der UK-Zusatzvereinbarung, die wie folgt ausgefüllt wird:

a. Abschnitt 3.2 dieses DPA enthält die in Tabelle 2 der UK-Zusatzvereinbarung erforderlichen Informationen.

b. Tabelle 4 der UK-Zusatzvereinbarung wird wie folgt geändert: Keine Partei darf die UK-Zusatzvereinbarung gemäß Abschnitt 19 der UK-Zusatzvereinbarung beenden; soweit die ICO eine überarbeitete genehmigte Zusatzvereinbarung gemäß Abschnitt ‎18 der UK-Zusatzvereinbarung herausgibt, werden die Parteien in gutem Glauben zusammenarbeiten, um dieses DPA entsprechend zu überarbeiten.

c. Die Titelseite enthält die von Anhang 1A, Anhang 1B, Anhang II und Anhang III der UK-Zusatzvereinbarung geforderten Informationen.

### 4. Andere internationale Übermittlungen {#4-other-international-transfers}

Für Übermittlungen personenbezogener Daten, bei denen schweizerisches Recht (und nicht das Recht eines EWR-Mitgliedstaats oder des Vereinigten Königreichs) auf die internationale Natur der Übermittlung anwendbar ist, werden Verweise auf die DSGVO in Klausel 4 der EWR-SCCs, soweit gesetzlich erforderlich, stattdessen auf das Schweizer Bundesgesetz über den Datenschutz oder dessen Nachfolger geändert, und das Konzept der Aufsichtsbehörde umfasst die Schweizerische Datenschutz- und Öffentlichkeitsbeauftragte.

## 4. Reaktion auf Sicherheitsvorfälle {#4-security-incident-response}

1. Sobald <strong>Provider</strong> von einem Sicherheitsvorfall Kenntnis erlangt, wird er: (a) <strong>Kunde</strong> unverzüglich benachrichtigen, wenn möglich, spätestens jedoch 72 Stunden nach Kenntnisnahme des Sicherheitsvorfalls; (b) zeitnah Informationen über den Sicherheitsvorfall bereitstellen, sobald diese bekannt werden oder von <strong>Kunde</strong> vernünftigerweise angefordert werden; und (c) unverzüglich angemessene Maßnahmen ergreifen, um den Sicherheitsvorfall einzudämmen und zu untersuchen. Die Benachrichtigung oder Reaktion des <strong>Providers</strong> auf einen Sicherheitsvorfall gemäß diesem DPA wird nicht als Anerkennung einer Schuld oder Haftung des <strong>Providers</strong> für den Sicherheitsvorfall ausgelegt.

## 5. Prüfung & Berichte {#5-audit--reports}

### 1. Prüfungsrechte {#1-audit-rights}

<strong>Provider</strong> wird <strong>Kunde</strong> alle vernünftigerweise erforderlichen Informationen zur Verfügung stellen, um die Einhaltung dieses DPA nachzuweisen, und <strong>Provider</strong> wird Prüfungen, einschließlich Inspektionen durch <strong>Kunde</strong>, zulassen und unterstützen, um die Einhaltung dieses DPA durch <strong>Provider</strong> zu bewerten. <strong>Provider</strong> kann jedoch den Zugang zu Daten oder Informationen einschränken, wenn der Zugang von <strong>Kunde</strong> zu den Informationen die geistigen Eigentumsrechte, Vertraulichkeitsverpflichtungen oder andere Verpflichtungen des <strong>Providers</strong> nach geltendem Recht negativ beeinträchtigen würde. <strong>Kunde</strong> erkennt an und stimmt zu, dass er seine Prüfungsrechte gemäß diesem DPA und etwaigen durch geltende Datenschutzgesetze gewährten Prüfungsrechten nur ausübt, indem er <strong>Provider</strong> anweist, die nachstehenden Berichts- und Sorgfaltspflichten einzuhalten. <strong>Provider</strong> wird Aufzeichnungen über die Einhaltung dieses DPA für 3 Jahre nach Beendigung des DPA aufbewahren.
### 2. Sicherheitsberichte {#2-security-reports}

<strong>Kunde</strong> erkennt an, dass <strong>Anbieter</strong> regelmäßig von unabhängigen Dritten anhand der in der <strong>Sicherheitsrichtlinie</strong> definierten Standards geprüft wird. Auf schriftliche Anfrage wird <strong>Anbieter</strong> dem <strong>Kunden</strong> vertraulich eine Zusammenfassung seines jeweils aktuellen Berichts zur Verfügung stellen, damit der <strong>Kunde</strong> die Einhaltung der in der <strong>Sicherheitsrichtlinie</strong> definierten Standards durch den <strong>Anbieter</strong> überprüfen kann.

### 3. Sicherheits-Due-Diligence {#3-security-due-diligence}

Zusätzlich zum Bericht wird <strong>Anbieter</strong> auf angemessene Informationsanfragen des <strong>Kunden</strong> reagieren, um die Einhaltung dieser DPA durch den <strong>Anbieter</strong> zu bestätigen, einschließlich Antworten auf Informationssicherheits-, Due-Diligence- und Audit-Fragebögen oder durch die Bereitstellung zusätzlicher Informationen über sein Informationssicherheitsprogramm. Alle derartigen Anfragen müssen schriftlich erfolgen und an den <strong>Provider Security Contact</strong> gerichtet sein und dürfen nur einmal jährlich gestellt werden.


## 6. Koordination & Zusammenarbeit {#6-coordination--cooperation}

### 1. Reaktion auf Anfragen {#1-response-to-inquiries}

Wenn <strong>Anbieter</strong> eine Anfrage oder Aufforderung von Dritten bezüglich der Verarbeitung von Kundendaten erhält, wird <strong>Anbieter</strong> den <strong>Kunden</strong> über die Anfrage informieren und ohne vorherige Zustimmung des <strong>Kunden</strong> nicht auf die Anfrage reagieren. Beispiele für solche Anfragen und Aufforderungen sind gerichtliche, administrative oder behördliche Anordnungen bezüglich Kundendaten, sofern die Benachrichtigung des <strong>Kunden</strong> durch geltendes Recht nicht untersagt ist, oder eine Anfrage einer betroffenen Person. Sofern gesetzlich zulässig, wird <strong>Anbieter</strong> den angemessenen Anweisungen des <strong>Kunden</strong> zu diesen Anfragen folgen, einschließlich der Bereitstellung von Statusaktualisierungen und anderer vom <strong>Kunden</strong> vernünftigerweise angeforderter Informationen. Wenn eine betroffene Person gemäß den geltenden Datenschutzgesetzen eine gültige Anfrage zur Löschung oder zum Widerruf der Weitergabe von Kundendaten an <strong>Anbieter</strong> stellt, wird <strong>Anbieter</strong> den <strong>Kunden</strong> bei der Erfüllung dieser Anfrage gemäß den geltenden Datenschutzgesetzen unterstützen. <strong>Anbieter</strong> wird mit dem <strong>Kunden</strong> zusammenarbeiten und auf dessen Kosten angemessene Unterstützung bei rechtlichen Reaktionen oder sonstigen Verfahrenshandlungen leisten, die der <strong>Kunde</strong> als Reaktion auf eine Drittanfrage bezüglich der Verarbeitung von Kundendaten durch <strong>Anbieter</strong> im Rahmen dieser DPA unternimmt.

### 2. DPIAs und DTIAs {#2-dpias-and-dtias}

Sofern von den geltenden Datenschutzgesetzen verlangt, wird <strong>Anbieter</strong> den <strong>Kunden</strong> angemessen bei der Durchführung vorgeschriebener Datenschutz-Folgenabschätzungen oder Datenübertragungs-Folgenabschätzungen sowie bei Konsultationen mit den zuständigen Datenschutzbehörden unterstützen, wobei die Art der Verarbeitung und der Kundendaten berücksichtigt wird.


## 7. Löschung von Kundendaten {#7-deletion-of-customer-personal-data}

### 1. Löschung durch den Kunden {#1-deletion-by-customer}

<strong>Anbieter</strong> wird dem <strong>Kunden</strong> ermöglichen, Kundendaten in einer mit der Funktionalität der Dienste vereinbaren Weise zu löschen. <strong>Anbieter</strong> wird dieser Anweisung so bald wie vernünftigerweise möglich nachkommen, außer wenn die weitere Speicherung der Kundendaten durch geltendes Recht erforderlich ist.

### 2. Löschung nach Ablauf der DPA {#2-deletion-at-dpa-expiration}

a. Nach Ablauf der DPA wird <strong>Anbieter</strong> die Kundendaten auf Anweisung des <strong>Kunden</strong> zurückgeben oder löschen, es sei denn, die weitere Speicherung der Kundendaten ist durch geltendes Recht erforderlich oder erlaubt. Wenn die Rückgabe oder Vernichtung unpraktikabel oder durch geltendes Recht verboten ist, wird <strong>Anbieter</strong> angemessene Anstrengungen unternehmen, um eine weitere Verarbeitung der Kundendaten zu verhindern und die verbleibenden Kundendaten in seinem Besitz, seiner Obhut oder Kontrolle weiterhin schützen. Zum Beispiel können geltende Gesetze <strong>Anbieter</strong> dazu verpflichten, Kundendaten weiterhin zu hosten oder zu verarbeiten.
b. Wenn <strong>Kunde</strong> und <strong>Anbieter</strong> die EWR SCCs oder das UK Addendum als Teil dieses DPA vereinbart haben, wird <strong>Anbieter</strong> <strong>Kunde</strong> die in Klausel 8.1(d) und Klausel 8.5 der EWR SCCs beschriebene Löschbescheinigung personenbezogener Daten nur dann ausstellen, wenn <strong>Kunde</strong> eine solche anfordert.


## 8. Haftungsbeschränkung {#8-limitation-of-liability}

### 1. Haftungsobergrenzen und Verzicht auf Schadensersatz {#1-liability-caps-and-damages-waiver}

**Soweit nach den anwendbaren Datenschutzgesetzen zulässig, unterliegt die gesamte kumulative Haftung jeder Partei gegenüber der anderen Partei, die sich aus oder im Zusammenhang mit diesem DPA ergibt, den im <strong>Vertrag</strong> festgelegten Verzichtserklärungen, Ausschlüssen und Haftungsbeschränkungen.**

### 2. Ansprüche Dritter {#2-related-party-claims}

**Jegliche Ansprüche gegen <strong>Anbieter</strong> oder seine verbundenen Unternehmen, die sich aus oder im Zusammenhang mit diesem DPA ergeben, dürfen nur von der <strong>Kunden</strong>-Einheit geltend gemacht werden, die Partei des <strong>Vertrags</strong> ist.**

### 3. Ausnahmen {#3-exceptions}

1. Dieses DPA beschränkt keine Haftung gegenüber einer Person hinsichtlich der Datenschutzrechte dieser Person nach den anwendbaren Datenschutzgesetzen. Darüber hinaus beschränkt dieses DPA keine Haftung zwischen den Parteien für Verstöße gegen die EWR SCCs oder das UK Addendum.


## 9. Widersprüche zwischen Dokumenten {#9-conflicts-between-documents}

1. Dieses DPA ist Bestandteil des Vertrags und ergänzt diesen. Bei Unstimmigkeiten zwischen diesem DPA, dem <strong>Vertrag</strong> oder Teilen davon gilt für diese Unstimmigkeit die zuerst genannte Regelung vorrangig gegenüber der später genannten: (1) die EWR SCCs oder das UK Addendum, (2) dieses DPA und dann (3) der <strong>Vertrag</strong>.


## 10. Vertragslaufzeit {#10-term-of-agreement}

Dieses DPA beginnt, wenn <strong>Anbieter</strong> und <strong>Kunde</strong> einer Deckblattseite für das DPA zustimmen und den <strong>Vertrag</strong> unterzeichnen oder elektronisch akzeptieren, und läuft bis zum Ablauf oder zur Beendigung des <strong>Vertrags</strong>. <strong>Anbieter</strong> und <strong>Kunde</strong> bleiben jedoch jeweils den Verpflichtungen dieses DPA und den anwendbaren Datenschutzgesetzen unterworfen, bis <strong>Kunde</strong> die Übermittlung personenbezogener Kundendaten an <strong>Anbieter</strong> einstellt und <strong>Anbieter</strong> die Verarbeitung personenbezogener Kundendaten einstellt.


## 11. Anwendbares Recht und Gerichtsstand {#11-governing-law-and-chosen-courts}

Ungeachtet der Rechtswahl- oder ähnlichen Klauseln des <strong>Vertrags</strong> unterliegen alle Auslegungen und Streitigkeiten über dieses DPA dem Recht des <strong>Governing State</strong> ohne Berücksichtigung seiner kollisionsrechtlichen Bestimmungen. Zusätzlich und ungeachtet der Gerichtsstands-, Zuständigkeits- oder ähnlichen Klauseln des <strong>Vertrags</strong> vereinbaren die Parteien, dass alle Rechtsstreitigkeiten, Klagen oder Verfahren bezüglich dieses DPA vor den Gerichten des <strong>Governing State</strong> zu führen sind, und jede Partei sich unwiderruflich der ausschließlichen Zuständigkeit dieser Gerichte unterwirft.


## 12. Dienstleisterbeziehung {#12-service-provider-relationship}

Soweit das California Consumer Privacy Act, Cal. Civ. Code § 1798.100 ff. ("CCPA") anwendbar ist, erkennen die Parteien an und stimmen zu, dass <strong>Anbieter</strong> ein Dienstleister ist und personenbezogene Daten von <strong>Kunde</strong> erhält, um die Dienstleistung wie im <strong>Vertrag</strong> vereinbart zu erbringen, was einen Geschäftszweck darstellt. <strong>Anbieter</strong> wird keine personenbezogenen Daten, die von <strong>Kunde</strong> im Rahmen des <strong>Vertrags</strong> bereitgestellt wurden, verkaufen. Darüber hinaus wird <strong>Anbieter</strong> keine personenbezogenen Daten, die von <strong>Kunde</strong> im Rahmen des <strong>Vertrags</strong> bereitgestellt wurden, aufbewahren, verwenden oder offenlegen, außer soweit dies zur Erbringung der Dienstleistung für <strong>Kunde</strong>, wie im <strong>Vertrag</strong> angegeben, oder gemäß den anwendbaren Datenschutzgesetzen zulässig ist. <strong>Anbieter</strong> bestätigt, dass er die Beschränkungen dieses Absatzes versteht.
## 13. Definitionen {#13-definitions}

1. **„Anwendbare Gesetze“** bezeichnet die Gesetze, Regeln, Vorschriften, Gerichtsbeschlüsse und sonstigen verbindlichen Anforderungen einer zuständigen Regierungsbehörde, die für eine Partei gelten oder diese regeln.

2. **„Anwendbare Datenschutzgesetze“** bezeichnet die Anwendbaren Gesetze, die regeln, wie der Dienst personenbezogene Informationen, personenbezogene Daten, persönlich identifizierbare Informationen oder einen anderen ähnlichen Begriff verarbeiten oder verwenden darf.

3. **„Verantwortlicher“** hat die Bedeutung(en), die ihm in den Anwendbaren Datenschutzgesetzen für das Unternehmen zugewiesen werden, das den Zweck und das Ausmaß der Verarbeitung personenbezogener Daten bestimmt.

4. **„Deckblatt“** bezeichnet ein Dokument, das von den Parteien unterzeichnet oder elektronisch akzeptiert wird, diese DPA-Standardbedingungen einbezieht und <strong>Provider</strong>, <strong>Customer</strong> sowie den Gegenstand und die Details der Datenverarbeitung identifiziert.

5. **„Kundendaten“** bezeichnet personenbezogene Daten, die <strong>Customer</strong> im Rahmen des Dienstes an <strong>Provider</strong> hochlädt oder bereitstellt und die dieser DPA unterliegen.

6. **„DPA“** bezeichnet diese DPA-Standardbedingungen, das Deckblatt zwischen <strong>Provider</strong> und <strong>Customer</strong> sowie die in oder an das Deckblatt angehängten oder darin referenzierten Richtlinien und Dokumente.

7. **„EWR-Standardvertragsklauseln (EEA SCCs)“** bezeichnet die der Durchführungsentscheidung 2021/914 der Europäischen Kommission vom 4. Juni 2021 über Standardvertragsklauseln für die Übermittlung personenbezogener Daten an Drittländer gemäß der Verordnung (EU) 2016/679 des Europäischen Parlaments und des Rates beigefügten Standardvertragsklauseln.

8. **„Europäischer Wirtschaftsraum“** oder **„EWR“** bezeichnet die Mitgliedstaaten der Europäischen Union, Norwegen, Island und Liechtenstein.

9. **„DSGVO“** bezeichnet die Verordnung (EU) 2016/679, wie sie durch nationales Recht im jeweiligen EWR-Mitgliedstaat umgesetzt wird.

10. **„Personenbezogene Daten“** hat die Bedeutung(en), die ihm in den Anwendbaren Datenschutzgesetzen für personenbezogene Informationen, personenbezogene Daten oder einen anderen ähnlichen Begriff zugewiesen werden.

11. **„Verarbeitung“** oder **„Verarbeiten“** hat die Bedeutung(en), die ihm in den Anwendbaren Datenschutzgesetzen für jede Nutzung von oder Durchführung eines Computerverfahrens mit personenbezogenen Daten, einschließlich automatischer Verfahren, zugewiesen werden.

12. **„Auftragsverarbeiter“** hat die Bedeutung(en), die ihm in den Anwendbaren Datenschutzgesetzen für das Unternehmen zugewiesen werden, das personenbezogene Daten im Auftrag des Verantwortlichen verarbeitet.

13. **„Bericht“** bezeichnet Prüfberichte, die von einem anderen Unternehmen gemäß den im Sicherheitsleitfaden definierten Standards im Auftrag des Providers erstellt werden.

14. **„Eingeschränkte Übermittlung“** bezeichnet (a) im Anwendungsbereich der DSGVO eine Übermittlung personenbezogener Daten aus dem EWR in ein Land außerhalb des EWR, das nicht von der Europäischen Kommission als angemessen eingestuft wurde; und (b) im Anwendungsbereich des UK GDPR eine Übermittlung personenbezogener Daten aus dem Vereinigten Königreich in ein anderes Land, das nicht den Angemessenheitsregelungen gemäß Abschnitt 17A des britischen Datenschutzgesetzes 2018 unterliegt.

15. **„Sicherheitsvorfall“** bezeichnet eine Verletzung des Schutzes personenbezogener Daten im Sinne von Artikel 4 der DSGVO.

16. **„Dienst“** bezeichnet das im <strong>Vertrag</strong> beschriebene Produkt und/oder die beschriebenen Dienstleistungen.

17. **„Besondere Kategorien von Daten“** hat die Bedeutung, die ihm in Artikel 9 der DSGVO zugewiesen wird.

18. **„Unterauftragsverarbeiter“** hat die Bedeutung(en), die ihm in den Anwendbaren Datenschutzgesetzen für ein Unternehmen zugewiesen werden, das mit Zustimmung und Annahme des Verantwortlichen den Auftragsverarbeiter bei der Verarbeitung personenbezogener Daten im Auftrag des Verantwortlichen unterstützt.

19. **„UK GDPR“** bezeichnet die Verordnung (EU) 2016/679, wie sie durch Abschnitt 3 des britischen European Union (Withdrawal) Act von 2018 im Vereinigten Königreich umgesetzt wird.

20. **„UK Zusatzvereinbarung“** bezeichnet die internationale Zusatzvereinbarung zu den EWR-Standardvertragsklauseln, die vom Information Commissioner für Parteien herausgegeben wurde, die Eingeschränkte Übermittlungen gemäß S119A(1) des britischen Datenschutzgesetzes 2018 vornehmen.


## Credits {#credits}

Dieses Dokument ist eine Ableitung der [Common Paper DPA Standard Terms (Version 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) und steht unter der Lizenz [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
